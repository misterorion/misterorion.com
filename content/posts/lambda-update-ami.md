---
title: "Updating Launch Templates with Lambda"
date:  "2020-02-29"
slug: "lambda-update-ami"
description: "How many Lambda functions does it take to replace an AMI?"
imageFluid:  "../images/vinyl-jukebox.jpg"
tags: ["AWS", "DevOps"]
---

Are you sick and tired of manually updating your auto-scaling group launch templates? Are you fed-up with clicking around in the AWS console like a little monkey every time AWS releases a new AMI?

## Lexicon

As you probably know by now, Amazon loves their three-letter acronyms.

This mini-tutorial touches on the following AWS services:

* ALB - Application Load Balancer
* AMI - Amazon Machine Image
* ASG - Auto-Scaling Group
* EC2 - Elastic Compute Cloud
* ECS - Elastic Container Service
* EFS - Elastic File System
* IAM - Identity & Access Management
* SNS - Simple Notification Service
* SSM - Systems Manager

## Background

AWS frequently updates the machine images (AMIs) used for their compute instances. The updates usually contain kernel updates, security patches, and other miscellaneous fixes. This is nice because the new AMIs contain a roll-up of new software so you don't need to use other configuration-management software to update your instances. Even so, rolling the new AMI out to your fleet of EC2 instances can be a bit tedious.

I run all of my applications in containers on ECS. The ECS instances in my cluster are just bare-bones, compute instances in an ASG. I think of them as a pool of resources (compute and memory). The only configuration I do is mount my EFS share at boot so my containers can mount directories as volumes. This mounting is accomplished by the `user-data` section of my launch template.

When Amazon publishes new ECS-optimized AMIs, I need to update all ECS instances my cluster to this AMI. How do we do this without any manual work?

To make my life easier, I created a little Lambda function to take care of it.

My ASG is configured to remove instances older than 2 weeks and replace them with fresh instances. Thus, over time, all instances in my ASG will gradually be updated with the latest AMI.

## IAM role for Lambda

As usual, my first step when working with Lambda is to create an IAM policy and IAM role. If I don't perform this step at the beginning, I'll inevitably find that my function doesn't work and I'll start second-guessing my code, while the root cause is permissions. Approaching the problem with a security-first mindset also helps me think about how the pieces fit together.

Below is the IAM role for this Lambda function. Very simple. We allow getting an SSM parameter with the latest launch template version, allow creating and deleting EC2 launch template versions and sending SNS notification updates. The resource names are made up for security reasons.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeLaunchTemplateVersions",
                "ssm:GetParameter"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "sns:Publish",
                "ec2:DeleteLaunchTemplateVersions",
                "ec2:CreateLaunchTemplateVersion"
            ],
            "Resource": [
                "arn:aws:sns:us-east-2:xxx:FAKE-NOTIFY-TOPIC",
                "arn:aws:ec2:us-east-2:xxx:launch-template/lt-xxx"
            ]
        }
    ]
}
```

## Lambda function

The Lambda is blunt-force Python. The code grabs some environment variables from the Lambda settings. Then it queries the latest IAM ID and compares it to the IAM that the latest launch configuration uses. If the two are different, it updates the launch configuration to use the new IAM and publishes a notification to SNS, which sends an email.

```python
# lambda_function.py

import boto3
import os

# Get these values from the Lambda environment variables.
launch_template_id = os.environ['launch_template_id']
image_id_ssm_parameter = os.environ['image_id_ssm_parameter']
sns_arn = os.environ['sns_arn']


def lambda_handler(event, context):

    ssm_client = boto3.client('ssm')
    ec2_client = boto3.client('ec2')
    sns_client = boto3.client('sns')

    def get_latest_ecs_ami():
        response = ssm_client.get_parameter(
            Name=image_id_ssm_parameter,
        )
        latest_ecs_ami = response['Parameter']['Value']
        print(f"Latest ECS-Optimized AMI: {latest_ecs_ami}")
        return latest_ecs_ami

    def get_current_launch_template_ami():
        response = ec2_client.describe_launch_template_versions(
            LaunchTemplateId=launch_template_id,
            Versions=[
                '$Latest',
            ],
        )
        current_launch_template_ami = (
            response['LaunchTemplateVersions'][0]['LaunchTemplateData']['ImageId']
        )
        print(f"Current Launch Template AMI: {current_launch_template_ami}")
        return current_launch_template_ami

    def update_current_launch_template_ami(ami):
        response = ec2_client.create_launch_template_version(
            LaunchTemplateId=launch_template_id,
            SourceVersion='$Latest',
            VersionDescription='Latest-AMI',
            LaunchTemplateData={
                'ImageId': ami
            }
        )
        print(f"New launch template created with AMI: {ami}")

    def set_launch_template_default_version():
        response = ec2_client.modify_launch_template(
            LaunchTemplateId=launch_template_id,
            DefaultVersion='$Latest'
        )
        previous_version = str(
            int(response['LaunchTemplate']['LatestVersionNumber']) - 2)

        response = ec2_client.delete_launch_template_versions(
            LaunchTemplateId=launch_template_id,
            Versions=[
                previous_version,
            ]
        )
        print(f"Launch template {previous_version} deleted.")

    def send_sns_nofication(subject, message):
        response = sns_client.publish(
            TargetArn=sns_arn,
            Message=message,
            Subject=subject,
        )
        print("Notification email sent.")

    def check_amis_and_update_if_needed():
        latest_ecs_ami = get_latest_ecs_ami()
        current_launch_template_ami = get_current_launch_template_ami()

        if current_launch_template_ami != latest_ecs_ami:
            update_current_launch_template_ami(latest_ecs_ami)
            set_launch_template_default_version()
            message = f"Launch template updated with AMI {latest_ecs_ami}."
            send_sns_nofication("Template AMI updated", message)
            return message
        else:
            message = f"Launch Template not updated."
            return message

    ami_status = check_amis_and_update_if_needed()

    # Show if AMI was updated or not up in CloudWatch log group.
    print(ami_status)

    # Show if AMI was updated in Lambda console.
    return ami_status

```

The trickiest bit I encountered coding this was getting the current launch template AMI. The `dictionary` response with the template information is convoluted, so it took some time to suss out the location of the `ImageId`.

## Scheduling

We can configure the function to run every day on a schedule using CloudWatch. In the example below, the Lambda is run every day at 1 p.m. UTC. If there is a new AMI released, my launch template will be updated and I'll get an email letting me know.

![AWS Lambda template designer](../images/lambda-template-designer.png)

## ToDo

I'd like to receive an email if any part of this process fails. 

## Conclusion

Every day at a pre-configured time, the function checks a parameter which contains the latest-and-greatest ECS AMI ID. Then, the function compares this AMI ID with the AMI ID in my ASG launch template. If the two values are different, the function updates the launch template with the new ID. Then it sets the new version as the default version and deletes the `$Latest -1` version, so I can roll back if there are any breaking changes in the new AMI. Finally, it sends a publish event to SNS, notifying me that the AMI has been updated.

Hopefully this function will let me just forget about updating images in my launch templates.
