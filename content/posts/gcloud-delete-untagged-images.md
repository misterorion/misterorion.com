---
title: "Delete Untagged Images on Google Artifact Registry"
date: "2021-10-19"
slug: "gcloud-delete-untagged-images"
description: "Using Cloud Build and Cloud Scheduler"
imageFluid: "../images/raph-howald-GSCtoEEqntQ-unsplash_resized.jpg"
imageAlt: "Angkor Wat, Cambodia"
tags: ["PowerShell","Google Cloud", "Docker"]
---

When we push a container image to Google Artifact Registry with the same tag as an existing image, the tag on the existing image is removed, leaving us an image with no tag.

![Empty Tags](../images/empty-tags.png)

All images take up space and count towards your bill. Assuming you have no use for the untagged images, wouldn't it be nice if we could remove all of them at once? What if we also wanted to clean out unwanted tagged images as well?

## Existing Solutions

Unlike Amazon's ECR Lifecycle Policies, there is **currently** no official way to do this on GCP, but we have options.

I've seen a few ways to tackle this issue, notably [GCR Cleaner](https://github.com/sethvargo/gcr-cleaner), which is mentioned in Google's Container Registry's [official documentation](https://cloud.google.com/container-registry/docs/managing#deleting_images). There are also some good methods in this [Stack Overflow question](https://stackoverflow.com/questions/46451173/delete-untagged-images-on-google-cloud-registry).

Give these approaches a read to see if they might fit your use case.

## My Solution

My solution uses Cloud Build and Cloud Scheduler with a dash of PowerShell and shell scripting. It is a bit simpler than the solutions referenced above, but works well.

> The commands below are for Google Cloud *Artifact Registry* (not to be confused with *Container Registry*). You can easily modify the `gcloud` commands below to accommodate the latter.

**Prerequisites**

* A service account for your Cloud Scheduler job with the Cloud Build Editor role so it can trigger the builds.
* Your Cloud Build service account should already have permission to list artifact registry images in your project, but you may need to give it the additional `artifactregistry.versions.delete` permission.
* A git repository containing the 3 files below, added as a Source to your Cloud Build trigger.

## List of Images to Clean

This is the list of repositories you want to clean out, in a text file.

```txt
# repos-to-clean.txt

us-central1-docker.pkg.dev/repo-name/cool-app
us-central1-docker.pkg.dev/repo-name/awesome-app
EOF

```

## Cloud Build Script

```yaml
# cloudbuild.yaml

steps:
  - id: Generate list of all images
    name: gcr.io/cloud-builders/gcloud
    entrypoint: sh
    args:
      - -c
      - |
        mkdir images
        while read i; do
          gcloud artifacts docker images list "$i" \
            --include-tags --format=json > "./images/$(echo $i | sed -e 's/\//-/g').json"
        done < ./repos-to-clean.txt
  - id: New list of images to delete
    name: mcr.microsoft.com/powershell
    entrypoint: pwsh
    args:
      - ./New-ImageList.ps1
  - id: Delete images
    name: gcr.io/cloud-builders/gcloud
    entrypoint: sh
    args:
      - -c
      - |
        if test -f clean.txt; then
          while read i; do
            gcloud artifacts docker images delete --async --delete-tags --quiet "$i"
          done < clean.txt
        else
          echo "No images to clean."
        fi

```

First read the `repos-to-clean.txt` file into a short shell script. For each line (repository), use `gcloud` to list Artifact Registry container images for the repo, and send the output to a json file at `./images`. To name the output json file, use the repository name, but replace `/` with `-`. We'll use these files in PowerShell below.

## PowerShell Script

```powershell
# New-ImageList.ps1

Get-ChildItem -Path ./images | ForEach-Object {
    $Images = Get-Content $_ | ConvertFrom-Json | Sort-Object createTime -Descending

    $Images | Where-Object {$_.tags -eq ""} | ForEach-Object {
        $p, $v = $_.package, $_.version
        Add-Content clean.txt "$p`@$v"
    }

    $Images | Where-Object {$_.tags -ne ""} | Select-Object -Skip 3 | ForEach-Object {
        $p, $v = $_.package, $_.version
        Add-Content clean.txt "$p`@$v"
    }
}

```

The PowerShell script reads each `json` file, parses it into an object, and sorts by date. The object represents all of the container images in the repository currently being processed, sorted from newest to oldest. PowerShell looks at the object tag values. It will find empty tags, and in this exampe, tags where the image count is greater than 3. If it finds any, it adds the repository name and sha256 hash to a text file.

At this point the CloudBuild script will read through the output text file and delete those images.

You can change `-Skip` to a larger value to keep more tagged images, or just omit that step.

> This is a destructive process. Please take care.

## The End

I created a Cloud Scheduler job to run this automatically once a week (cron is `33 15 * * 4`). Instead of using Cloud Scheduler to trigger your build, you could certainly integrate the steps into an existing build.

Hope this helps some of you clean out your repositories. Happy coding!