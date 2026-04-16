---
title: Scheduled Reboots with Systemd
tags: ["Linux"]
---

I wanted to schedule reboots of my machine running Container Optimized OS on Google Cloud, since that is the intended way to pull in automatic updates.

The snippet below uses systemd to schedule a reboot on the first Tuesday of every month at 03:33 local time (Chicago). It will also log boots to a file so you can see when a reboot took place. In my case, this is located in my instance template user-data.

```yaml
#cloud-config
- path: /etc/systemd/system/sched-reboot.service
  permissions: '0644'
  owner: root
  content: |
    [Unit]
    Description=Scheduled Reboot

    [Service]
    Type=simple
    ExecStart=/usr/bin/systemctl --force reboot

- path: /etc/systemd/system/sched-reboot.timer
  permissions: '0644'
  owner: root
  content: |
    [Unit]
    Description=Reboot Scheduling

    [Timer]
    OnCalendar=Tue *-*-1..7 03:33:33

    [Install]
    WantedBy=multi-user.target

runcmd:
- timedatectl set-timezone America/Chicago
- echo -e $(date '+%a %F %H:%M %Z') >> /var/log/boot.log
- systemctl daemon-reload
- systemctl start sched-reboot.timer
```
