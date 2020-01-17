---
title: "Create a Webhook with AWS Lambda"
date:  "2020-01-17"
slug: "lambda-webhook"
description: "Create a simple webhook for your automation with AWS Lambda and Python"
imageFluid:  "../images/aircraft-clouds.jpg"
tags: ["AWS"]
---

The other day I was moving on of my friend's static website over to Netlify. It's a pretty simple Hugo site. Only a handful of pages and images. What makes his page unique is the hundreds of large PDF files that he hosts.

Initially, I looked into putting the big files in Git LFS, since Netlify started supporting it. Unfortunately, I quickly hit the storage limit of my GitHub account and didn't really feel like paying the extra $5/month to increase it, just for this one site. 

So, I switched to a Netlify/AWS hybrid solution. Netlify builds his site with Hugo, and the PDFs reside in S3. CloudFront sits in front of both of them. Netlify as the default origin, and all content under /pdf gets pulled from S3.

The hybrid setup works great. Dead simple automation and cheap, durable storage of the big files. Yet, there is a problem. How are we going to send an invalidation request to CloudFront every time Netlify does a deploy?

I decided to create my own webhook, which Netlify can post to after every deploy finishes. I created a Lambda function in Python and added it to my Application Load Balancer. 

The first thing to do was create an IAM role for my Lambda with very basic permissions; the only thing it needs to do is create an invalidation request.

I created this inline IAM role:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "cloudfront:CreateInvalidation",
            "Resource": "*"
        }
    ]
}
```

Next I had to create my Lambda function. I wanted a function I could reuse, such as with other distributions, so I'm telling it to look for a  in a query string parameter `dist_id`, which corresponds to the actuall distribution ID. I'm also invalidating all the paths in the site with `/*` which is fine for small sites. You might need to create a more complex dictionary for the paths, if your needs demand it.

Netlify requires webhooks to send back a response code (other than 4xx or 5xx), so we have the load balancer return a JSON response.

```python
import json
import boto3
import time


def lambda_handler(event, context):
    client = boto3.client("cloudfront")

    distribution = event["queryStringParameters"]["dist_id"]
    request = client.create_invalidation(
        DistributionId=distribution,
        InvalidationBatch={
            "Paths": {"Quantity": 1, "Items": ["/*"]},
            "CallerReference": str(time.time()),
        },
    )
    response = {
        "statusCode": 200,
        "statusDescription": "200 OK",
        "isBase64Encoded": False,
        "headers": {"Content-Type": "text/html"},
        "body": "<h1>Invalidation in progress.</h1>",
    }
    return response

```

Inside my ALB, I created a target group that points at my Lambda, then created a listener rule that watches for a path I made up, querystring containg a token. I made the path and token somewhat random but you can go crazy with it. This is to give myself just a little more security.

Here's an example of how the listener might look (I made up these values for this example).

![ALB Example 1](../images/alb-example-1.png)

So, you can put together a URL that looks like this:

```
https://lambda.mysite.com/w2HhVu4MKqQP?dist_id=EWR32F5MCGOV3&token=5Gm3SY6...
```

And plop that into your Netlify deploy configuration. Your site will automatically trigger a CloudFront invalidation on every new deploy.