---
title: "Wild Rydes Workshop on Serverless"
date: "2017-06-08"
description: "Wild Rydes Workshop on Serverless"
tags: ["AWS","Career"]
---

Last Thursday I participated in the "Wild Rydes Workshop on Serverless," sponsored by Amazon at the AWS pop-up loft in SoHo. Workshop participants learned how to create a serverless web application using Lambda, Amazon API Gateway, S3, DynamoDB, and Cognito.

[Complete instructions](https://github.com/awslabs/aws-serverless-workshops) for the workshop are available on GitHub, so attending wasn't strictly necessary for success. That said, there are benefits to visiting an AWS loft. Visitors have the opportunity to consult with certified Amazon architects, network with other professionals, or just grab some free WiFi and enjoy the quirky decor while you work.

After a brief welcome by the Amazon staff, we were pretty much left to our own devices. Most of us worked quietly through the instructions and create the serverless application while AWS staff roamed the room, helping out where needed.

The most challenging part of the workshop was configuring the API Gateway. Having never been exposed to this service before, I had to read through several pages of documentation to understand how the parts fit together. I also made the mistake of placing my S3 bucket in a different region than my application (us-east-1). I didn't think this would make a difference, but it did, and I was forced to retrace my steps.

In the end, most of us got the app up and working, and watched with satisfaction as our unicorns darted happily across a map, picked up simulated customers, and flew them to their destinations in the cloud.
