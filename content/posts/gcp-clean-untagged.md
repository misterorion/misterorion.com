---
title: "Delete untagged images on Google Cloud"
date: "2021-10-19"
slug: "delete-untagged-images-on-google-cloud"
description: "Using Cloud Build and Cloud Scheduler"
# Use either imageFluid or imageFixed below
imageFluid: "../images/yeswanth-m-d57A7x85f3w-unsplash.jpg"
# imageFixed: "../images/image-fixed.jpg"
imageAlt: "Ta Prohm Temple, Cambodia"
tags: ["PowerShell","Google Cloud"]
---

Sometimes when we are building and pushing container images to Google Container Registry with the same tags as existing images, we end up with many untagged images. Assuming you have no use for these we may want to delete them to lower our bill.

Unlike Amazon's ECR Lifecycle Policies, there is **currently** no official way to do this on GCP.

I've seen a few ways to tackle this issue, notably [GCR Cleaner](https://github.com/sethvargo/gcr-cleaner), which is mentioned in Google's Conatiner Registry's [official documentation](https://cloud.google.com/container-registry/docs/managing#deleting_images). There are also a few interesting proposals in this [Stack Overflow question](https://stackoverflow.com/questions/46451173/delete-untagged-images-on-google-cloud-registry).

My solution is to use Cloud Build and Cloud Scheduler (and a little bit of PowerShell and shell scripting). If you are very fluent in shell scripting you could probably omit the PowerShell step below and modify shell script in the last step. This is cleaner because it doesn't write to the filesystem. But I find that PowerShell is much nicer to use when working with JSON.

**Note:** The commands below are for Google Cloud *Artifact Registry* (not to be confused with Container Registry), but you can easily modify the gcloud commands to accomodate the latter.

## Cloud Build script

1. You'll need to set up a service account for your scheduler with the Cloud Build Editor role so it can trigger the builds.
2. Your Cloud Build service account should already have permission to list artifact images in your project, but you may need to give it permission to delete artifact images (artifactregistry.versions.delete).
3. Set the `$_REPO` substitution variable in your Cloud Build trigger to the image repository you want to clean up, for example: `us-central1-docker.pkg.dev/my-project/my-container-apps`

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

The PowerShell script takes our `untagged.json`, parses JSON, concatenates each package and sha into a single line and appends it to a text file. If the JSON file is empty, this step is skipped.

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

