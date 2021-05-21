TypeScript port of PureScript's [purescript-aff-retry](https://github.com/Unisay/purescript-aff-retry) package
which in turn is a porting of Haskell's [retry](https://github.com/Soostone/retry) package

# Example

```ts
import { log } from 'fp-ts/Console'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import { capDelay, exponentialBackoff, limitRetries, Monoid, RetryStatus } from 'retry-ts'
import { retrying } from 'retry-ts/Task'

const policy = capDelay(2000, Monoid.concat(exponentialBackoff(200), limitRetries(5)))

const fakeAPI = TE.left('API errored out')

const logDelay = (status: RetryStatus) =>
  TE.rightIO(
    log(
      pipe(
        status.previousDelay,
        O.map((delay) => `retrying in ${delay} milliseconds...`),
        O.getOrElse(() => 'first attempt...')
      )
    )
  )

const result = retrying(policy, (status) => pipe(logDelay(status), TE.apSecond(fakeAPI)), E.isLeft)

result().then((e) => console.log(e))
/*
first attempt...
retrying in 200 milliseconds...  <= exponentialBackoff
retrying in 400 milliseconds...  <= exponentialBackoff
retrying in 800 milliseconds...  <= exponentialBackoff
retrying in 1600 milliseconds... <= exponentialBackoff
retrying in 2000 milliseconds... <= exponentialBackoff + capDelay
left("API errored out")          <= limitRetries
*/
```

# Documentation

- [API Reference](https://gcanti.github.io/retry-ts)

# License

The MIT License (MIT)
