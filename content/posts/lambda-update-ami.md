---
title: "Updating EC2 Launch Templates with Lambda"
date:  "2020-02-29"
slug: "lambda-update-ami"
description: "Push template updates to your auto-scaling group with Python and AWS Lambda."
imageFluid:  "../images/vinyl-jukebox.jpg"
tags: ["AWS", "DevOps", "Python"]
---

Tired of manually updating your EC2 launch templates and auto-scaling groups?

I run all of my applications in containers on Amazon's Elastic Container Service (ECS). If you're familiar with ECS, you know that AWS frequently updates it's ECS-Optimized AMI for EC2. The updates contain all kinds of goodies, such as new versions of the ECS Agent, kernel updates, security patches, and other miscellaneous fixes. Since we want to update all the things, how do we accomplish it with automation? One way is with Python and AWS Lambda!

## IAM role for Lambda

As usual, my first step when working with Lambda is to create an IAM policy and IAM role. If I don't perform this step at the beginning, I'll inevitably find that my tests don't work and I'll start second-guessing my code. Approaching the problem with a security-first mindset also helps me think about how the components fit together.

Below is the IAM policy for this Lambda function. We allow getting an SSM parameter, creating and deleting EC2 launch template versions, creating auto-scaling group actions, and sending SNS notification updates.

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

> If you would like to use this policy, remember to add the full `arn` of your EC2 launch template, SNS topic, and auto-scaling group.

## Lambda function

The Lambda itself is blunt-force Python. My favorite!

1. Accept a trigger from an SNS topic.
2. Retrieve the ECS-optimized AMI ID from the SNS message data.
3. Update the launch template with the AMI ID.
4. Set the new launch template version as the default version.
5. Delete the `$Latest -2` version of the launch template and keep `$Latest -1`.
6. Create ASG scheduled actions to replace instances.
7. Publish an SNS event notifying me that the AMI has been updated.

```python
# lambda_function.py
import boto3
import os
import json
from datetime import datetime, timezone, timedelta


def lambda_handler(event, context):

    sns_message = json.loads(event["Records"][0]["Sns"]["Message"])

    latest_ami = sns_message["ECSAmis"][0]["Regions"]["us-east-2"]["ImageId"]

    # Get values from Lambda environment variables.
    launch_template_id = os.environ["launch_template_id"]
    sns_arn = os.environ["sns_arn"]
    asg_name = os.environ["asg_name"]

    # Create boto3 clients
    ec2 = boto3.client("ec2")
    asg = boto3.client("autoscaling")
    sns = boto3.client("sns")

    def update_current_launch_template_ami(ami):
        response = ec2.create_launch_template_version(
            LaunchTemplateId=launch_template_id,
            SourceVersion="$Latest",
            VersionDescription="Latest-AMI",
            LaunchTemplateData={
                "ImageId": ami
            }
        )
        print(f"New launch template created with AMI: {ami}")

    def set_launch_template_default_version():
        response = ec2.modify_launch_template(
            LaunchTemplateId=launch_template_id,
            DefaultVersion="$Latest"
        )
        previous_version = str(
            int(response["LaunchTemplate"]["LatestVersionNumber"]) - 2)

        response = ec2.delete_launch_template_versions(
            LaunchTemplateId=launch_template_id,
            Versions=[
                previous_version,
            ]
        )
        print(f"Launch template {previous_version} deleted.")

    def create_asg_scheduled_action(start_time, desired_capacity):
        response = asg.put_scheduled_update_group_action(
            AutoScalingGroupName=asg_name,
            ScheduledActionName=f"Desire {desired_capacity}",
            StartTime=start_time,
            DesiredCapacity=desired_capacity
        )

    def send_sns_notification(subject, message):
        response = sns.publish(
            TargetArn=sns_arn,
            Message=message,
            Subject=subject,
        )
        print("Notification email sent.")

    def update_launch_template_and_asg():
        # Update template AMI and set as default
        update_current_launch_template_ami(latest_ami)
        set_launch_template_default_version()

        # Create future ASG actions to roll out the new AMI
        now_utc = datetime.now(timezone.utc)
        in_01_min = now_utc + timedelta(minutes=1)
        in_15_min = now_utc + timedelta(minutes=15)
        create_asg_scheduled_action(in_01_min, 2)
        create_asg_scheduled_action(in_15_min, 1)

        # Sent a notification that the update succeeded.
        subject = "AMI updated!"
        message = f"AMI updated! New AMI is {latest_ami}."
        send_sns_notification(subject, message)
        return message

    ami_status = update_launch_template_and_asg()

    # Show if AMI was updated in CloudWatch log group.
    print(ami_status)

    # Show if AMI was updated in Lambda console.
    return ami_status

```

> For this example, imagine we have an ASG with a `min` size of 1, a `max` size of 2 and an initial `desired` size of 1.

If you look closely, you'll see that our code sets the ASG `desired` instance count to 2 and then sets it back to 1 after 15 minutes. This is enough time for the new instances to spin up, applications to reach a healthy state and the load balancer to start sending traffic to them. You may have to play with this window to ensure zero downtime.

![ASG scheduled actions](../images/asg-scheduled-actions.png)

> Our ASG termination policy is configured to terminate instances with the oldest launch configuration first.

The trickiest bit I encountered coding this was getting the current launch template AMI out of the SNS message. Fortunately, it was just a matter of loading the JSON data and hunting down the key/value.

## Scheduling

Lambdas can be triggered via SNS notifications, as is the case here. AWS publishes SNS topics with the lastest AMI information.

![Lambda template designer](../images/lambda-template-designer.png)

## Conclusion

I'm enjoying using Lambdas to automate parts of my AWS infrastructure. In a lot of ways, it's easier to write automation code than relying on tools AWS may or may not have. Boto3 is powerful, and the documentation is great, unlike many AWS docs.

I hope this mini-tutorial helps some of the automation fans out there!
