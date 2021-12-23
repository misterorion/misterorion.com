---
slug: "bash-upgrade-hugo"
date: "2018-11-09"
title: "Bash Script to Upgrade Hugo"
description: "A quick bash script that upgrades Hugo."
imageFixed: "../images/bash.png"
imageAlt: "Bash Logo"
tags: ["Linux"]
---

I'm a big fan of [Hugo](https://gohugo.io), the static website generator. With over 30,000 stars on GitHub, Hugo has an active development community that regularly adds new features and squashes bugs. I often like to experiment with bleeding-edge enhancements and find myself upgrading the binary regularly. To make this easier, I wrote a small Bash script that upgrades Hugo to a given version number based on user input.

The complete script is below. You should change the value of `$target_dir` to a directory with execute permission.

```bash
#!/bin/bash

echo -e "Which release would you like to install? (e.g. 51): \c"

read version

file="hugo_0.${version}_Linux-64bit.tar.gz"
URL=https://github.com/gohugoio/hugo/releases/download/v0.$version/$file
target_dir="/home/$(whoami)/bin/"

echo Installing...

wget -qO- $URL | tar xz -C $target_dir hugo

echo Done!

echo Installed Hugo $(hugo version | awk '{ print $5 }')
```
