---
title: "Fizz Buzz in Go"
excerpt: "Using Iota"
tags: ["Code","Go"]
---

> Fizz buzz is a group word game for children to teach them about division. Players take turns to count incrementally, replacing any number divisible by three with the word "fizz", and any number divisible by five with the word "buzz".

I wrote this implementation in Go quickly as an answer on LeetCode. The interesting bit is the use of `Iota()`.

Generally in Go, Iota is useful for when you want to create incrementing constants. In the code below the package `strconv` has an `Iota()` method that converts the counter to a string.

The `Iota()` method returns the equivalent to `FormatInt(int64(x), 10)`. That is to say the string of `x` when the base is 10.

In math, 0, 1, 2, 3, 4, 5, 6, 7, 8, and 9 are base ten numerals. Base-10 is used in most modern civilizations (probably because we have 10 fingers) and forms the basis of our counting system and monetary system.

```go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	for i := 1; i <= 15; i++ {
		output := ""

		if i%3 == 0 {
			output += "Fizz"
		}
		if i%5 == 0 {
			output += "Buzz"
		}
		if output == "" {
			output += strconv.Itoa(i)
		}

		fmt.Println(output)
	}
}
```
### Alternate solution without Iota:

```go
package main

import (
	"fmt"
	"strconv"
)

func main() {
    if i%3 == 0 && i%5 == 0 {
        fmt.Println("FizzBuzz")
    } else if i%3 == 0 && i%5 != 0 {
        fmt.Println("Fizz")
    } else if i%3 != 0 && i%5 == 0 {
        fmt.Println("Buzz")
    } else {
        fmt.Println(i)
    }
}
```