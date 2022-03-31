/**
 * @since 0.1.4
 */
import { ReaderTask, fromTaskK } from 'fp-ts/lib/ReaderTask'
import { RetryPolicy, RetryStatus } from './index'
import * as T from './Task'

/**
 * Apply policy and delay by its amount if it results in a retry.
 * Returns updated status.
 *
 * @since 0.1.4
 */
export const applyAndDelay = fromTaskK(T.applyAndDelay)

/**
 * Retry combinator for actions that don't raise exceptions, but
 * signal in their type the outcome has failed. Examples are the
 * `Option`, `Either` and `EitherT` monads.
 *
 * @since 0.1.4
 */
export function retrying<R, A>(
  policy: RetryPolicy,
  action: (status: RetryStatus) => ReaderTask<R, A>,
  check: (a: A) => boolean
): ReaderTask<R, A> {
  return (r) => T.retrying(policy, (status) => action(status)(r), check)
}
