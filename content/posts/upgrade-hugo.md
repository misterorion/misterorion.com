---
title: Bash Script to Upgrade Hugo
date: "2018-11-09"
draft: false
slug: bash-upgrade-hugo
image_url: /assets/img/bash.png
image_alt: The Bourne Again Shell
description: A quick bash script I wrote to simplify upgrading Hugo to the latest version.
tags:
- Linux
- Hugo
---

I'm a big fan of [Hugo](https://gohugo.io), the static website generator. With over 30,000 stars on GitHub, Hugo has an active development community that regularly adds new features and squashes bugs. I often like to experiment with bleeding-edge enhancements and find myself upgrading the binary on a regular basis. To make this easier, I wrote a small Bash script that upgrades Hugo to a given version number based on user input.

The output looks like this:

```plaintext
$ Which release would you like to install? (e.g. 51): 51
Installing...
Done!
Installed Hugo v0.51
```

The complete script is below. You should change the value of `target_dir` to a location on your system that has execute permission.

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

[Link to GitHub gist](https://gist.github.com/misterorion/8824811c3e25bba3c05189e513f1a585).
