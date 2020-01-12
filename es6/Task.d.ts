import * as T from 'fp-ts/es6/Task'
import { RetryPolicy, RetryStatus } from '.'
/**
 * Apply policy and delay by its amount if it results in a retry.
 * Returns updated status.
 *
 * @since 0.1.0
 */
export declare function applyAndDelay(policy: RetryPolicy, status: RetryStatus): T.Task<RetryStatus>
/**
 * Retry combinator for actions that don't raise exceptions, but
 * signal in their type the outcome has failed. Examples are the
 * `Option`, `Either` and `EitherT` monads.
 *
 * @since 0.1.0
 */
export declare function retrying<A>(
  policy: RetryPolicy,
  action: (status: RetryStatus) => T.Task<A>,
  check: (a: A) => boolean
): T.Task<A>
