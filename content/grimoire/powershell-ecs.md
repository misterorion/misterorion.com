---
title: "Check Bottlerocket AMI with PowerShell"
excerpt: "Use Lambda for bonus points"
tags: ["AWS","Lambda", "PowerShell"]
---

Simple Lambda function to check your launch template AMI against the latest Bottlerocket AMI and publish an SNS topic if a new AMI exists.

Set `LaunchTemplateId` environment variable in Lambda console to the ID of your launch template.

Set `AmiId` environment variable in Lambda console to the AMI ID you want to check against. For example, `/aws/service/bottlerocket/aws-ecs-1/x86_64/latest/image_id`

The function publishes an SNS message to the ARN you specify and logs `$Message` to Cloudwatch Logs.

☝Tip: Use the public AWS Bottlerocket SNS topic as trigger to receive notifications only when a new AMI is released. You can also create an SNS message that will update your launch templates automatically and trigger ECS auto-scaling group instance refreshes.

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