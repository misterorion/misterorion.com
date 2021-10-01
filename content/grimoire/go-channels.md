---
title: "Example of channels in Go"
excerpt: "Using pasta dishes"
tags: ["Code","Go"]
---

> Channels are communication channels between goroutines. Use channels when you want to pass errors or any other kind of information between goroutines.

Let's use customers ordering pasta dishes as our scenario.

Each customer places an order for a pasta dish. The dish is assigned a random difficulty and sent to a goroutine (the "kitchen"). The goroutine "makes" the dish, waiting a number of seconds to simulate difficulty before sending the completed dish into a channel.

Our output prints (or "serves") the dishes in the order in which they were recieved by the channel.

```go
package main

import (
	"fmt"
	"math/rand"
	"time"
)

type Dish struct {
	pasta, sauce string
	difficulty   int
}

func makeDish(i int, dish Dish, ch chan string) {
	d, p, s := dish.difficulty, dish.pasta, dish.sauce
	time.Sleep(time.Duration(d) * time.Second)
	ch <- fmt.Sprintf(
		"Serving Order #%d\t(Difficulty %d)\t%s %s", i, d, p, s)
}

func main() {

	customers := 5

	pastas := []string{"Rigatoni", "Fettuccine", "Tagliatelle", "Penne"}
	sauces := []string{"Bolognese", "Carbonara", "Alfredo", "Pomodoro"}

	ch := make(chan string, customers)

	rand.Seed(time.Now().UnixNano())

	for i := 1; i <= customers; i++ {
		order := Dish{
			pasta:      pastas[rand.Intn(len(pastas))],
			sauce:      sauces[rand.Intn(len(sauces))],
			difficulty: rand.Intn(11),
		}
		go makeDish(i, order, ch)
	}
	fmt.Println("All orders sent to the kitchen!")
	fmt.Println("Waiting...")

	for 0 < customers {
		dish := <-ch
		fmt.Println(dish)
		customers--
	}

	fmt.Println("All dishes served.")
}
```
[Run on Go Playground](https://play.golang.org/p/xTIrvSylXFy)