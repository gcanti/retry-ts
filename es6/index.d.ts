import { Monoid } from 'fp-ts/es6/Monoid'
import * as O from 'fp-ts/es6/Option'
/**
 * @since 0.1.0
 */
export interface RetryStatus {
  /** Iteration number, where `0` is the first try */
  iterNumber: number
  /** Delay incurred so far from retries */
  cumulativeDelay: number
  /** Latest attempt's delay. Will always be `none` on first run. */
  previousDelay: O.Option<number>
}
/**
 * A `RetryPolicy` is a function that takes an `RetryStatus` and
 * possibly returns a delay in milliseconds. Iteration numbers start
 * at zero and increase by one on each retry. A *None* return value from
 * the function implies we have reached the retry limit.
 *
 * @since 0.1.0
 */
export interface RetryPolicy {
  (status: RetryStatus): O.Option<number>
}
/**
 * 'RetryPolicy' is a 'Monoid'. You can collapse multiple strategies into one using 'concat'.
 * The semantics of this combination are as follows:
 *
 * 1. If either policy returns 'None', the combined policy returns
 * 'None'. This can be used to inhibit after a number of retries,
 * for example.
 *
 * 2. If both policies return a delay, the larger delay will be used.
 * This is quite natural when combining multiple policies to achieve a
 * certain effect.
 *
 * @example
 * import { monoidRetryPolicy, exponentialBackoff, limitRetries } from 'retry-ts'
 *
 * // One can easily define an exponential backoff policy with a limited
 * // number of retries:
 * export const limitedBackoff = monoidRetryPolicy.concat(exponentialBackoff(50), limitRetries(5))
 *
 * @since 0.1.0
 */
export declare const monoidRetryPolicy: Monoid<RetryPolicy>
/**
 * Retry immediately, but only up to `i` times.
 *
 * @since 0.1.0
 */
export declare function limitRetries(i: number): RetryPolicy
/**
 * Add an upperbound to a policy such that once the given time-delay
 * amount *per try* has been reached or exceeded, the policy will stop
 * retrying and fail.
 *
 * @since 0.1.0
 */
export declare function limitRetriesByDelay(maxDelay: number, policy: RetryPolicy): RetryPolicy
/**
 * Constant delay with unlimited retries
 *
 * @since 0.1.0
 */
export declare function constantDelay(delay: number): RetryPolicy
/**
 * Set a time-upperbound for any delays that may be directed by the
 * given policy. This function does not terminate the retrying. The policy
 * capDelay(maxDelay, exponentialBackoff(n))` will never stop retrying. It
 * will reach a state where it retries forever with a delay of `maxDelay`
 * between each one. To get termination you need to use one of the
 * 'limitRetries' function variants.
 *
 * @since 0.1.0
 */
export declare function capDelay(maxDelay: number, policy: RetryPolicy): RetryPolicy
/**
 * Grow delay exponentially each iteration.
 * Each delay will increase by a factor of two.
 *
 * @since 0.1.0
 */
export declare function exponentialBackoff(delay: number): RetryPolicy
/**
 * Initial, default retry status. Exported mostly to allow user code
 * to test their handlers and retry policies.
 *
 * @since 0.1.0
 */
export declare const defaultRetryStatus: RetryStatus
/**
 * Apply policy on status to see what the decision would be.
 *
 * @since 0.1.0
 */
export declare function applyPolicy(policy: RetryPolicy, status: RetryStatus): RetryStatus
