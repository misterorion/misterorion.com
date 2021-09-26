---
title: PowerShell Parameter Input vs Pipeline Input
date: "2020-05-11"
slug: aws-triple-threat
description: "I passed all three AWS Associate-level certifications."
imageFluid: "../images/matrix-architect.jpg"
tags: ["AWS","Career"]
---

PowerShell pipeline input sends one object at a time.
Pipeline input requires an advanced function. Begin, Process, End

```PowerShell
$MyArray = @(1, 2, 3, 4, 5, 1, 1, 6, 6, 32, "adam", "adam")

function Find-DuplicatesFromParameters {
    param(
        [Parameter(Mandatory=$true)]
        [array]$InputArray
    )

    $DuplicateItems = $InputArray | Group-Object | Where-Object { $_.Count -gt 1 }

    $DuplicateItems | ForEach-Object {
        $Count = $_ | Select-Object -ExpandProperty Count
        Write-Output "$($_.Name) `t ($Count times)"
    }
}

function Find-DuplicatesFromPipeline {
  [CmdletBinding()]
  Param(
    [Parameter(ValueFromPipeline)]
    [array]$InputArray
  )

  Begin {
    $TempArray = @()
  }
  Process {
      $TempArray += $_
  }

  End {
    $TempArray |
    Group-Object |
    Where-Object { $_.Count -gt 1 } |
    ForEach-Object {
      $Count = $_ |
      Select-Object -ExpandProperty Count
      Write-Output "$($_.Name) `t ($Count times)"
    }
  }
}

Find-DuplicatesFromParameters -InputArray $MyArray

$MyArray | Find-DuplicatesFromPipeline
```
