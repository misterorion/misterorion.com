---
title: I passed the Linux Essentials exam
date: "2017-05-21"
slug: passed-linux-essentials
imageFluid: "../images/LPI-Essentials.jpg"
tags: ["Linux","Career"]
---

The [LPI Linux Essentials](https://www.lpi.org/our-certifications/linux-essentials-overview) certification demonstrates fundamental knowledge of the open source industry, an understanding of the major components of the Linux operating system, and technical proficiency in the command line.

I had fun studying for this certification. I picked up the majority of my Linux skills in a piecemeal way through occasional projects over the years, so it was nice to sit down and learn the basics in a logical, progressive manner. Many concepts rattling around in my head gelled in satisfying ways.

## How I studied

The bulk of my learning took place through [LinuxAcademy.com](https://linuxacademy.com)'s Linux Essentials course. The course contains 14 hours of video lectures, and several practice tests. I found the course to be well-structured and the instructor's presentation clear, and concise.

My methodology was watching the lectures in order and taking notes. For lessons involving the command line, I created a CentOS 7 virtual machine on my workstation and followed along, typing commands. I also studied a few of the flash card sets contributed by LinuxAcademy users. These cards were useful in memorizing relevant commands.

For more depth, I read through sections of [LPIC-1 Linux Professional Institute Certification Study Guide](http://amzn.to/2rpmgZE)—though it's not necessary to read this book to pass the exam.

## Mistakes I made

I should have spent more time studying popular applications for desktop Linux distributions. I saw at least 2 questions on this topic and I'm fairly certain I got both of the questions wrong.

There was also a question about selecting which distros use the RPM package manager. I didn't remember one of them (Mandriva).

Yet another mistake I made involved the `bash±mv` command. The question was along the lines of, "You want to move `bash±/dirA` and all of its contents to `bash±/dirB`. Which is the correct command?" I had the correct answer narrowed down to two options, essentially:

```bash
mv /dirA /dirB
```

or

```bash
mv -R /dirA dirB
```

I chose the command with the `bash±-R` option, which is definitely *wrong*. There is no `bash±-R` option available with `bash±mv`.

## Where to go from here

The next exam on this path is the LPIC certification exam, but I think RHCSA would be more beneficial to my career.
