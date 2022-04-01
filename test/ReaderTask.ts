import * as assert from 'assert'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as TE from 'fp-ts/lib/TaskEither'
import { capDelay, exponentialBackoff, limitRetries, Monoid, RetryStatus } from '../src'
import { retrying } from '../src/ReaderTask'

describe('ReaderTask', () => {
  it('retrying', async () => {
    const log: Array<string> = []
    const policy = capDelay(1000, Monoid.concat(exponentialBackoff(100), limitRetries(5)))
    const err = TE.left('error')
    const logDelay = (delay: number) =>
      TE.rightIO(() => {
        log.push(`retrying in ${delay} milliseconds`)
      })
    const action = (status: RetryStatus) => () =>
      pipe(
        status.previousDelay,
        O.fold(
          () => err,
          (delay) => pipe(logDelay(delay), TE.apSecond(err))
        )
      )
    const result1 = retrying(policy, action, E.isLeft)
    const e1 = await result1({})()
    assert.deepStrictEqual(e1, E.left('error'))
    assert.deepStrictEqual(log, [
      'retrying in 100 milliseconds',
      'retrying in 200 milliseconds',
      'retrying in 400 milliseconds',
      'retrying in 800 milliseconds',
      'retrying in 1000 milliseconds'
    ])
    const result2 = retrying(policy, action, E.isRight)
    const e2 = await result2({})()
    assert.deepStrictEqual(e2, E.left('error'))
  })
})
