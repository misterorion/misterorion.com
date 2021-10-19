---
title: "Delete Untagged Images on Google Cloud"
date: "2021-10-19"
slug: "gcloud-delete-untagged-images"
description: "Using Cloud Build and Cloud Scheduler"
imageFluid: "../images/yeswanth-m-d57A7x85f3w-unsplash.jpg"
imageAlt: "Ta Prohm Temple, Cambodia"
tags: ["PowerShell","Google Cloud", "Docker"]
---

When we push a container image to Google Container Registry with the same tag as an existing image, the tag on the existing image is removed leaving us an image with no tag. Assuming you have no use for these, they take up space and will raise your bill. 

Wouldn't it be nice if we could remove all of these untagged images at once?

Unlike Amazon's ECR Lifecycle Policies, there is **currently** no official way to do this on GCP, but we have options.

## Existing Solutions

I've seen a few ways to tackle this issue, notably [GCR Cleaner](https://github.com/sethvargo/gcr-cleaner), which is mentioned in Google's Container Registry's [official documentation](https://cloud.google.com/container-registry/docs/managing#deleting_images). There are also a few interesting proposals in this [Stack Overflow question](https://stackoverflow.com/questions/46451173/delete-untagged-images-on-google-cloud-registry).

These are certainly viable options and should be reviewed before proceeding.

## My Solution

My solution is to use Cloud Build and Cloud Scheduler with a dash of PowerShell and shell scripting. If you are very fluent in shell scripting you could probably omit the PowerShell step below and flesh out the shell script in the last step. Compared to my approach, this is cleaner because it doesn't write to the filesystem. But I find that PowerShell is is just nicer to use when working with the JSON omitted by `gcloud`.

> The commands below are for Google Cloud *Artifact Registry* (not to be confused with Container Registry), but you can easily modify the `gcloud` commands to accommodate the latter.

## Cloud Build script

### Prerequisites

1. A service account for your Cloud Scheduler job with the Cloud Build Editor role so it can trigger the builds.
2. Your Cloud Build service account should already have permission to list artifact images in your project, but you may need to give it the `artifactregistry.versions.delete` permission.
3. A git repository containing the files below, added as a Source to your Cloud Build trigger.

> Set the `$_REPO` substitution variable in your Cloud Build trigger to the image repository you want to clean up, for example: `us-central1-docker.pkg.dev/my-project/my-container-apps`

```yaml
# cloudbuild.yaml

steps:
  - id: Get and save untagged images
    name: gcr.io/cloud-builders/gcloud
    entrypoint: sh
    args:
      - -c
      - |
        gcloud artifacts docker images list $_REPO \
          --include-tags --filter='-tags:*' --format=json > untagged.json
        cat untagged.json
  - id: New list of untagged images
    name: mcr.microsoft.com/powershell
    entrypoint: pwsh
    args:
      - ./New-UntaggedImageList.ps1
  - id: Delete untagged images
    name: gcr.io/cloud-builders/gcloud
    entrypoint: sh
    args:
      - -c
      - |
        if test -f clean.txt; then
          while read i; do
            gcloud artifacts docker images delete --quiet "$i"
          done < clean.txt
        else
          echo "No untagged images."
        fi

```

## PowerShell Script

The PowerShell script takes our `untagged.json`, parses JSON, concatenates each package and digest (sha256) into a single line and appends it to a text file. If the JSON file is empty, this step is skipped.

```powershell
# New-UntaggedImageList.ps1

$UntaggedImages = Get-Content untagged.json | ConvertFrom-Json

If ($UntaggedImages) {
    $UntaggedImages | ForEach-Object {
        $p, $v = $_.package, $_.version
        Add-Content clean.txt "$p`@$v"
    }
} Else {
      Write-Host 'No untagged UntaggedImages.'
}

```