/**
 * @since 0.1.0
 */
import * as M from 'fp-ts/lib/Monoid'
import * as O from 'fp-ts/lib/Option'
import { getJoinSemigroup } from 'fp-ts/lib/Semigroup'
import { ordNumber } from 'fp-ts/lib/Ord'
import { pipe } from 'fp-ts/lib/pipeable'

// Adapted from https://github.com/Unisay/purescript-aff-retry

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
 * @since 0.1.3
 */
export const Monoid: M.Monoid<RetryPolicy> = M.getFunctionMonoid(
  O.getApplyMonoid({
    ...getJoinSemigroup(ordNumber),
    empty: 0
  })
)<RetryStatus>()

/**
 * Retry immediately, but only up to `i` times.
 *
 * @since 0.1.0
 */
export function limitRetries(i: number): RetryPolicy {
  return (status) => (status.iterNumber >= i ? O.none : O.some(0))
}

/**
 * Add an upperbound to a policy such that once the given time-delay
 * amount *per try* has been reached or exceeded, the policy will stop
 * retrying and fail.
 *
 * @since 0.1.0
 */
export function limitRetriesByDelay(maxDelay: number, policy: RetryPolicy): RetryPolicy {
  return (status) =>
    pipe(
      status,
      policy,
      O.filter((delay) => delay < maxDelay)
    )
}

/**
 * Constant delay with unlimited retries
 *
 * @since 0.1.0
 */
export function constantDelay(delay: number): RetryPolicy {
  return () => O.some(delay)
}

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
export function capDelay(maxDelay: number, policy: RetryPolicy): RetryPolicy {
  return (status) =>
    pipe(
      status,
      policy,
      O.map((delay) => Math.min(maxDelay, delay))
    )
}

/**
 * Grow delay exponentially each iteration.
 * Each delay will increase by a factor of two.
 *
 * @since 0.1.0
 */
export function exponentialBackoff(delay: number): RetryPolicy {
  return (status) => O.some(delay * Math.pow(2, status.iterNumber))
}

/**
 * Initial, default retry status. Exported mostly to allow user code
 * to test their handlers and retry policies.
 *
 * @since 0.1.0
 */
export const defaultRetryStatus: RetryStatus = {
  iterNumber: 0,
  cumulativeDelay: 0,
  previousDelay: O.none
}

/**
 * Apply policy on status to see what the decision would be.
 *
 * @since 0.1.0
 */
export function applyPolicy(policy: RetryPolicy, status: RetryStatus): RetryStatus {
  const previousDelay = policy(status)
  return {
    iterNumber: status.iterNumber + 1,
    cumulativeDelay: status.cumulativeDelay + O.getOrElse(() => 0)(previousDelay),
    previousDelay
  }
}

// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------

/**
 * Use [`Monoid`](#monoid) instead.
 * @since 0.1.0
 * @deprecated
 */
export const monoidRetryPolicy: M.Monoid<RetryPolicy> = Monoid
