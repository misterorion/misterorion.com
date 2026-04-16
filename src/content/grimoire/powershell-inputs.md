---
title: Parameter Input vs Pipeline Input
tags: ["PowerShell"]
---

_Parameter input_ sends the input parameter object to the function.

_Pipeline input_ reads from the pipeline, one object at a time. Pipeline input requires an advanced function with Begin, Process, End blocks.

Example that finds duplicates in an array:

```powershell
$MyArray = @(1, 2, 3, 4, 5, 1, 1, 6, 6, 32, "adam", "adam")

Function Find-DuplicatesFromParameters {
  Param(
    [Parameter(Mandatory = $true)]
    [array]$InputArray
  )

  $DuplicateItems = $InputArray |
  Group-Object | Where-Object { $_.Count -gt 1 }

  $DuplicateItems | ForEach-Object {
    $Count = $_ | Select-Object -ExpandProperty Count
    Write-Output "$($_.Name) `t ($Count times)"
  }
}

Function Find-DuplicatesFromPipeline {
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
    Group-Object | Where-Object { $_.Count -gt 1 } |
    ForEach-Object {
      $Count = $_ | Select-Object -ExpandProperty Count
      Write-Output "$($_.Name) `t ($Count times)"
    }
  }
}

Find-DuplicatesFromParameters -InputArray $MyArray

$MyArray | Find-DuplicatesFromPipeline
```
