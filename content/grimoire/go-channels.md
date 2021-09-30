---
title: "Example of channels in Golang"
excerpt: "Using pasta dishes"
tags: ["Code","Go"]
---

> Channels are communication channels between goroutines. Use channels when you want to pass errors or any other kind of information between goroutines.

In the code below we use customers ordering pasta dishes as our scenario. 

Each customer places an order for a pasta dish. The dish is assigned a random difficulty and sent off into a goroutine (the "kitchen" if you wish). The goroutine "makes" the dish, waiting a number of seconds to simulate difficulty before sending the completed dish into a channel.

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

func makeDish(i int, d Dish, ch chan string) {
	di, p, s := d.difficulty, d.pasta, d.sauce
	time.Sleep(time.Duration(di) * time.Second)
	ch <- fmt.Sprintf(
		"Serving Order #%d\t(Difficulty %d)\t%s %s", i, di, p, s)
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
