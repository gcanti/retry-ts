import { delay, Task, task } from 'fp-ts/lib/Task'
import { applyPolicy, defaultRetryStatus, RetryPolicy, RetryStatus } from '.'

/**
 * Apply policy and delay by its amount if it results in a retry.
 * Returns updated status.
 */
export const applyAndDelay = (policy: RetryPolicy, status: RetryStatus): Task<RetryStatus> => {
  const newStatus = applyPolicy(policy, status)
  return newStatus.previousDelay.foldL(() => task.of(newStatus), millis => delay(millis, newStatus))
}

/**
 * Retry combinator for actions that don't raise exceptions, but
 * signal in their type the outcome has failed. Examples are the
 * `Option`, `Either` and `EitherT` monads.
 */
export const retrying = <A>(
  policy: RetryPolicy,
  action: (status: RetryStatus) => Task<A>,
  check: (a: A) => boolean
): Task<A> => {
  const go = (status: RetryStatus): Task<A> => {
    return action(status).chain(a => {
      if (check(a)) {
        return applyAndDelay(policy, status).chain(status =>
          status.previousDelay.foldL(() => task.of(a), () => go(status))
        )
      } else {
        return task.of(a)
      }
    })
  }
  return go(defaultRetryStatus)
}
