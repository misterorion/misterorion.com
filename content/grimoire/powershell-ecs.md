---
title: "Go Channels"
excerpt: "Check Bottlerocket AMI with Lambda and PowerShell"
tags: ["Powershell","AWS","Lambda","ECS"]
---

Simple Lambda function to check the AMI of your launch template against the latest Bottlerocket AMI.

Set `LaunchTemplateId` environment variable in Lambda console to the ID of your launch template.

Set `AmiId` environment variable to the AMI ID you want to check against. For example, `/aws/service/bottlerocket/aws-ecs-1/x86_64/latest/image_id`

The function publishes an SNS message to the ARN you specify and logs `$Message` to Cloudwatch Logs.

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