---
title: "Updating EC2 Launch Templates with Lambda"
date:  "2020-02-29"
slug: "lambda-update-ami"
description: "Tired of manually updating your EC2 launch templates?"
imageFluid:  "../images/vinyl-jukebox.jpg"
tags: ["AWS", "DevOps"]
---

Are you tired of manually updating your EC2 launch templates?

## Background

I run all of my applications in containers on ECS. The ECS instances in my cluster are just bare-bones, compute instances in an auto-scaling group. I think of them as a pool of resources (cattle not pets). The only configuration performed is mounting an elastic file system at boot. This is accomplished by the `user-data` section of my launch template.

AWS frequently updates ECS-optimized AMIs. The updates contain new versions of the ECS Agent, kernel updates, security patches, and other miscellaneous fixes. I want to update all ECS instances a cluster to this new AMI. How do we do this without any manual work? To make life easier, I created a Lambda function to handle it.

## IAM role for Lambda

As usual, my first step when working with Lambda is to create an IAM policy and IAM role. If I don't perform this step at the beginning, I'll inevitably find that my function doesn't work and I'll start second-guessing my code, while the root cause is permissions. Approaching the problem with a security-first mindset also helps me think about how the pieces fit together.

Below is the IAM policy for this Lambda function. We allow getting an SSM parameter, creating and deleting EC2 launch template versions, creating auto-scaling group actions, and sending SNS notification updates.

If you would like to use this policy, remember to add the full `arn` of your EC2 launch template, SNS topic, and auto-scaling group.

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
                "ec2:ModifyLaunchTemplate",
                "ec2:DeleteLaunchTemplateVersions",
                "ec2:CreateLaunchTemplateVersion",
                "autoscaling:PutScheduledUpdateGroupAction"
            ],
            "Resource": [
                "arn:aws:ec2: ...",
                "arn:aws:sns: ... ",
                "arn:aws:autoscaling: ..."
            ]
        }
    ]
}
```

## Lambda function

The Lambda itself is blunt-force Python. My favorite!

1. Accept a trigger from CloudWatch Events (a `cron` expression).
2. Check the SSM parameter for the latest-and-greatest ECS-optimized AMI ID.
3. Compare this AMI ID with the AMI ID in my ASG launch template. If the values differ, update the launch template with the new AMI ID.
4. Set the new launch template version as the default version, delete the `$Latest -2` version and keep the `$Latest -1` so I can roll back if necessary.
5. Create two ASG scheduled actions; one to scale-up instances with the new AMI, one to scale-down (terminate) instances with the old AMI.
6. Publish an event to SNS, notifying me that the AMI has been updated.

For this example, imagine we have an ASG with a `min` size of 1, a `max` size of 2 and an initial `desired` size of 1.

```python
# lambda_function.py
import boto3
import os
from datetime import datetime, timezone, timedelta


def lambda_handler(event, context):

    # Get values from Lambda environment variables.
    launch_template_id = os.environ["launch_template_id"]
    image_id_ssm_parameter = os.environ["image_id_ssm_parameter"]
    sns_arn = os.environ["sns_arn"]
    asg_name = os.environ["asg_name"]

    # Create boto3 clients
    ssm_client = boto3.client("ssm")
    ec2_client = boto3.client("ec2")
    asg_client = boto3.client("autoscaling")
    sns_client = boto3.client("sns")

    def get_latest_ecs_ami():
        response = ssm_client.get_parameter(
            Name=image_id_ssm_parameter,
        )
        latest_ecs_ami = response["Parameter"]["Value"]
        print(f"Latest ECS-Optimized AMI: {latest_ecs_ami}")
        return latest_ecs_ami

    def get_current_launch_template_ami():
        response = ec2_client.describe_launch_template_versions(
            LaunchTemplateId=launch_template_id,
            Versions=[
                "$Latest",
            ],
        )
        current_launch_template_ami = (
            response["LaunchTemplateVersions"][0]
                    ["LaunchTemplateData"]["ImageId"]
        )
        print(f"Current Launch Template AMI: {current_launch_template_ami}")
        return current_launch_template_ami

    def update_current_launch_template_ami(ami):
        response = ec2_client.create_launch_template_version(
            LaunchTemplateId=launch_template_id,
            SourceVersion="$Latest",
            VersionDescription="Latest-AMI",
            LaunchTemplateData={
                "ImageId": ami
            }
        )
        print(f"New launch template created with AMI: {ami}")

    def set_launch_template_default_version():
        response = ec2_client.modify_launch_template(
            LaunchTemplateId=launch_template_id,
            DefaultVersion="$Latest"
        )
        previous_version = str(
            int(response["LaunchTemplate"]["LatestVersionNumber"]) - 2)

        response = ec2_client.delete_launch_template_versions(
            LaunchTemplateId=launch_template_id,
            Versions=[
                previous_version,
            ]
        )
        print(f"Launch template {previous_version} deleted.")

    def create_asg_scheduled_action(start_time, desired_capacity):
        response = asg_client.put_scheduled_update_group_action(
            AutoScalingGroupName=asg_name,
            ScheduledActionName=f"Desire {desired_capacity}",
            StartTime=start_time,
            DesiredCapacity=desired_capacity
        )

    def send_sns_notification(subject, message):
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
            # Update template AMI and set as default
            update_current_launch_template_ami(latest_ecs_ami)
            set_launch_template_default_version()

            # Create future ASG actions to roll out the new AMI
            now_utc = datetime.now(timezone.utc)
            in_01_min = now_utc + timedelta(minutes=1)
            in_15_min = now_utc + timedelta(minutes=15)
            create_asg_scheduled_action(in_01_min, 2)
            create_asg_scheduled_action(in_15_min, 1)

            # Sent a notification that the update succeeded.
            subject = "AMI updated!"
            message = f"AMI updated! New AMI is {latest_ecs_ami}."
            send_sns_notification(subject, message)
            return message
        else:
            subject = "AMI is current."
            message = "AMI was not updated. AMI is current."
            # Uncomment below to be notified every time the Lambda runs.
            #send_sns_notification(subject, message)
            return message

    ami_status = check_amis_and_update_if_needed()

    # Show if AMI was updated in CloudWatch log group.
    print(ami_status)

    # Show if AMI was updated in Lambda console.
    return ami_status

```

If you look closely, the Lambda sets the `desired` size to 2 and then sets it back to 1 after 15 minutes. This is enough time for the new instances to spin up, and applications to reach a healthy state and start receiving traffic from the load balancer. This ensures zero downtime.

![ASG scheduled actions](../images/asg-scheduled-actions.png)

Our ASG termination policy is configured to terminate instances with the oldest launch configuration first.

The trickiest bit I encountered coding this was getting the current launch template AMI. The response `dictionary` containing the template information is convoluted, so it took some time to suss out the location of `ImageId`.

## Scheduling

We configure the function to run every day on a schedule using CloudWatch. In the example below, the Lambda is run every day at 1 p.m. UTC.

![Lambda template designer](../images/lambda-template-designer.png)

## Conclusion

I'm enjoying using Lambdas to automate parts of my AWS infrastructure. In a lot of ways, it's easier to write automation code than relying on tools AWS may or may not have. Boto3 is powerful, and the documentation is great, unlike the standard AWS docs.

I hope this mini-tutorial helps some of the automation fans out there!
