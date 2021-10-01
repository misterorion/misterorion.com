---
title: "Fizz Buzz in Go"
excerpt: "Using Iota"
tags: ["Code","Go"]
---

> [Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz) is a group word game for children to teach them about division. Players take turns to count incrementally, replacing any number divisible by three with the word "fizz", and any number divisible by five with the word "buzz".

I wrote this implementation in Go quickly as an answer on LeetCode. The interesting bit is the use of `Iota()`.

Initially I tried to simply convert the counter `i` to a string with `string()`. This did not work because `string()` returns a rune, not a digit.

I also tried `fmt.Sprint()`, which worked in this simple example. But I wasn't sure if this method was the best one to use. The `fmt` package has a ton of methods.

After some research, I learned that the `Iota()` method returns the equivalent of `FormatInt(int64(x), 10)`. That is to say, the string of `x` when the base is 10.

Generally in Go, `Iota` is useful for when you want to create incrementing constants.

In math, 0, 1, 2, 3, 4, 5, 6, 7, 8, and 9 are [base ten numerals](https://en.wikipedia.org/wiki/Decimal). Base-10 is used in most modern civilizations (probably because we have 10 fingers) and forms the basis of our counting system and monetary system.

The takeaway is that the `strconv.Iota()` method is nicer for counters because it uses base 10 counting and thus is safer for incrementing counter values. 

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
			output += strconv.Iota(i)
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