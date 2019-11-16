---
title: Create a Webhook with AWS Lambda
date: "2019-11-16"
draft: true
slug: lambda-webhook
image_url: assets/img/aws-lambda.png
image_alt: AWS Lambda
description: Create a simple webhook with AWS Lambda
tags:
- AWS
- Lambda
- Python
---

Notes

- Lambda has to be in US-EAST-1 region to work with CloudFront
- Make sure you use the right IAM permissions.
- 

```python
import boto3
import json

def build_ffxiv(event, context):

    CONTENT = 'Success'

    cb = boto3.client('codebuild', region_name='us-east-2')
    response = cb.start_build(projectName='ffxiv-mechapower-com')
    print('Successfully launched build.')
    # Generate HTTP OK response using 200 status code with HTML body.
    response = {
        'status': '200',
        'statusDescription': 'OK',
        'headers': {
            'cache-control': [
                {
                    'key': 'Cache-Control',
                    'value': 'max-age=100'
                }
            ],
            "content-type": [
                {
                    'key': 'Content-Type',
                    'value': 'text/html'
                }
            ],
            'content-encoding': [
                {
                    'key': 'Content-Encoding',
                    'value': 'UTF-8'
                }
            ]
        },
        'body': CONTENT
    }
    return response
```