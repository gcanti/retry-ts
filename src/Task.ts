/**
 * @since 0.1.0
 */
import * as T from 'fp-ts/lib/Task'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { applyPolicy, defaultRetryStatus, RetryPolicy, RetryStatus } from '.'

/**
 * Apply policy and delay by its amount if it results in a retry.
 * Returns updated status.
 *
 * @since 0.1.0
 */
export function applyAndDelay(policy: RetryPolicy, status: RetryStatus): T.Task<RetryStatus> {
  const newStatus = applyPolicy(policy, status)
  return pipe(
    newStatus.previousDelay,
    O.fold(
      () => T.task.of(newStatus),
      (millis) => T.delay(millis)(T.task.of(newStatus))
    )
  )
}

/**
 * Retry combinator for actions that don't raise exceptions, but
 * signal in their type the outcome has failed. Examples are the
 * `Option`, `Either` and `EitherT` monads.
 *
 * @since 0.1.0
 */
export function retrying<A>(
  policy: RetryPolicy,
  action: (status: RetryStatus) => T.Task<A>,
  check: (a: A) => boolean
): T.Task<A> {
  const go = (status: RetryStatus): T.Task<A> =>
    pipe(
      status,
      action,
      T.chain((a) => {
        if (check(a)) {
          return pipe(
            applyAndDelay(policy, status),
            T.chain((status) =>
              pipe(
                status.previousDelay,
                O.fold(
                  () => T.task.of(a),
                  () => go(status)
                )
              )
            )
          )
        } else {
          return T.task.of(a)
        }
      })
    )

  return go(defaultRetryStatus)
}
