---
title: Home
nav_order: 1
---

TypeScript port of PureScript's [purescript-aff-retry](https://github.com/Unisay/purescript-aff-retry) package
which in turn is a porting of Haskell's [retry](https://github.com/Soostone/retry) package

# Example

```ts
import { log } from 'fp-ts/lib/Console'
import { isLeft } from 'fp-ts/lib/Either'
import { fromIO, fromLeft } from 'fp-ts/lib/TaskEither'
import { capDelay, exponentialBackoff, limitRetries, monoidRetryPolicy } from 'retry-ts'
import { retrying } from 'retry-ts/lib/TaskEither'

const policy = capDelay(2000, monoidRetryPolicy.concat(exponentialBackoff(200), limitRetries(5)))

const fa = fromLeft<string, number>('error')

const logDelay = (delay: number) => fromIO(log(`retrying in ${delay} milliseconds`))

const result = retrying(
  policy,
  status => status.previousDelay.fold(fa, delay => logDelay(delay).applySecond(fa)),
  isLeft
)

result.run().then(e => console.log(e))
/*
retrying in 200 milliseconds  <= exponentialBackoff
retrying in 400 milliseconds  <= exponentialBackoff
retrying in 800 milliseconds  <= exponentialBackoff
retrying in 1600 milliseconds <= exponentialBackoff
retrying in 2000 milliseconds <= exponentialBackoff + capDelay
left("error")                 <= limitRetries
*/
```
