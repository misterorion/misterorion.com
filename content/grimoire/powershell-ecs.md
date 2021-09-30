---
title: "Check AMI with PowerShell"
excerpt: "Use Lambda for bonus points"
tags: ["AWS","Lambda", "PowerShell"]
---

A Simple Lambda function to check your launch template AMI against the latest Bottlerocket AMI (or any AMI) and publish an SNS message if a new AMI exists.

Create a `LaunchTemplateId` environment variable in Lambda console to the ID of your launch template. Create an `AmiId` environment variable with the value of the AMI ID you want to check against, for example, `/aws/service/bottlerocket/aws-ecs-1/x86_64/latest/image_id`.

☝ Tip 1: Run this Lambda on a schedule or trigger it from a GitHub webhook.

☝ Tip 2: Send the output to SNS Topic that triggers another lambda function that updates your launch templates automatically or triggers auto-scaling group instance refreshes.

```powershell
Requires -Modules @{ModuleName='AWS.Tools.Common';ModuleVersion='4.1.0.0';}
Requires -Modules @{ModuleName='AWS.Tools.SimpleSystemsManagement';ModuleVersion='4.1.0.0';}
Requires -Modules @{ModuleName='AWS.Tools.EC2';ModuleVersion='4.1.0.0';}
Requires -Modules @{ModuleName='AWS.Tools.SimpleNotificationService';ModuleVersion='4.1.0.0';}

# Uncomment to send the input event to CloudWatch Logs
# Write-Host (ConvertTo-Json -InputObject $LambdaInput -Compress -Depth 5)

$LaunchTemplateId = $Env:LaunchTemplateID
$LatestAMI = (Get-SSMParameter $Env:AmiId).Value

$UsingAMI = (
    Get-EC2TemplateVersion `
        -LaunchTemplateId $LaunchTemplateId `
        -Version "`$Latest"
).LaunchTemplateData.ImageId

If ($UsingAMI -ne $LatestAMI) {

    Publish-SNSMessage `
        -TopicArn "arn:aws:sns:us-east-2:XXXXXXXXXXXX:SNS_TOPIC" `
        -Message "The latest AMI is: $LatestAMI" `
        -Subject "🚀New Bottlerocket AMI!🚀"

    $Message = "New ami: $LatestAMI"
}
Else {
    $Message = "No new AMI."
}

Return $Message
```