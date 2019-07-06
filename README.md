TypeScript port of PureScript's [purescript-aff-retry](https://github.com/Unisay/purescript-aff-retry) package
which in turn is a porting of Haskell's [retry](https://github.com/Soostone/retry) package

# Example

```ts
import { log } from 'fp-ts/lib/Console'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as TE from 'fp-ts/lib/TaskEither'
import { capDelay, exponentialBackoff, limitRetries, monoidRetryPolicy } from 'retry-ts'
import { retrying } from 'retry-ts/lib/Task'

const policy = capDelay(2000, monoidRetryPolicy.concat(exponentialBackoff(200), limitRetries(5)))

const err = TE.left('error')

const logDelay = (delay: number) => TE.rightIO(log(`retrying in ${delay} milliseconds`))

const result = retrying(
  policy,
  status =>
    pipe(
      status.previousDelay,
      O.fold(
        () => err,
        delay =>
          pipe(
            logDelay(delay),
            TE.apSecond(err)
          )
      )
    ),
  E.isLeft
)

result().then(e => console.log(e))
/*
retrying in 200 milliseconds  <= exponentialBackoff
retrying in 400 milliseconds  <= exponentialBackoff
retrying in 800 milliseconds  <= exponentialBackoff
retrying in 1600 milliseconds <= exponentialBackoff
retrying in 2000 milliseconds <= exponentialBackoff + capDelay
left("error")                 <= limitRetries
*/
```

# Documentation

- [API Reference](https://gcanti.github.io/retry-ts)

# License

The MIT License (MIT)
