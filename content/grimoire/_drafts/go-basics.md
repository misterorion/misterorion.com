---
title: "Goroutines"
excerpt: "Some handy commands for your health"
tags: ["Go"]
---

### Goroutines

From the documentation: "A goroutine is a lightweight thread of execution." Goroutines are lighter than a thread so managing them is comparatively less resource intensive.

### Channels

Channels are communication channels between goroutines. Use channels when you want to pass errors or any other kind of information between goroutines.

```go
package main

import "fmt"

func addSauce(p string, c chan string){
  p := []string{pasta, ch}
  ch <- p
}

func main() {
  ch := make(chan string)

  go func(){
    ch <- "Rigatoni" // Send value on a channel
  }()

  go addSauce("Bolognese", ch)

  p := <- ch

  fmt.Println("Pasta Dish:", p)
}

```