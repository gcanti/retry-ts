import { Monoid, getFunctionMonoid } from 'fp-ts/lib/Monoid'
import { none, Option, some, getApplyMonoid } from 'fp-ts/lib/Option'
import { getJoinSemigroup } from 'fp-ts/lib/Semigroup'
import { ordNumber } from 'fp-ts/lib/Ord'

// Adapted from https://github.com/Unisay/purescript-aff-retry

export interface RetryStatus {
  /** Iteration number, where `0` is the first try */
  iterNumber: number
  /** Delay incurred so far from retries */
  cumulativeDelay: number
  /** Latest attempt's delay. Will always be `none` on first run. */
  previousDelay: Option<number>
}

/**
 * A `RetryPolicy` is a function that takes an `RetryStatus` and
 * possibly returns a delay in milliseconds. Iteration numbers start
 * at zero and increase by one on each retry. A *None* return value from
 * the function implies we have reached the retry limit.
 */
export interface RetryPolicy {
  (status: RetryStatus): Option<number>
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
 *
 * // One can easily define an exponential backoff policy with a limited
 * // number of retries:
 * const limitedBackoff = monoidRetryPolicy.concat(exponentialBackoff(50), limitRetries(5))
 */
export const monoidRetryPolicy: Monoid<RetryPolicy> = getFunctionMonoid(
  getApplyMonoid({
    ...getJoinSemigroup(ordNumber),
    empty: 0
  })
)<RetryStatus>()

/** Retry immediately, but only up to `i` times. */
export const limitRetries = (i: number): RetryPolicy => {
  return status => (status.iterNumber >= i ? none : some(0))
}

/**
 * Add an upperbound to a policy such that once the given time-delay
 * amount *per try* has been reached or exceeded, the policy will stop
 * retrying and fail.
 */
export const limitRetriesByDelay = (maxDelay: number, policy: RetryPolicy): RetryPolicy => {
  return status =>
    policy(status).chain(delay => {
      return delay >= maxDelay ? none : some(delay)
    })
}

/** Constant delay with unlimited retries */
export const constantDelay = (delay: number): RetryPolicy => {
  return () => some(delay)
}

/**
 * Set a time-upperbound for any delays that may be directed by the
 * given policy. This function does not terminate the retrying. The policy
 * capDelay(maxDelay, exponentialBackoff(n))` will never stop retrying. It
 * will reach a state where it retries forever with a delay of `maxDelay`
 * between each one. To get termination you need to use one of the
 * 'limitRetries' function variants.
 */
export const capDelay = (maxDelay: number, policy: RetryPolicy): RetryPolicy => {
  return status => policy(status).map(delay => Math.min(maxDelay, delay))
}

/**
 * Grow delay exponentially each iteration.
 * Each delay will increase by a factor of two.
 */
export const exponentialBackoff = (delay: number): RetryPolicy => {
  return status => some(delay * Math.pow(2, status.iterNumber))
}

/**
 * Initial, default retry status. Exported mostly to allow user code
 * to test their handlers and retry policies.
 */
export const defaultRetryStatus: RetryStatus = {
  iterNumber: 0,
  cumulativeDelay: 0,
  previousDelay: none
}

/**
 * Apply policy on status to see what the decision would be.
 */
export const applyPolicy = (policy: RetryPolicy, status: RetryStatus): RetryStatus => {
  const previousDelay = policy(status)
  return {
    iterNumber: status.iterNumber + 1,
    cumulativeDelay: status.cumulativeDelay + previousDelay.getOrElse(0),
    previousDelay
  }
}
