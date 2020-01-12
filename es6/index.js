import { getFunctionMonoid } from 'fp-ts/es6/Monoid';
import * as O from 'fp-ts/es6/Option';
import { getJoinSemigroup } from 'fp-ts/es6/Semigroup';
import { ordNumber } from 'fp-ts/es6/Ord';
import { pipe } from 'fp-ts/es6/pipeable';
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
export const monoidRetryPolicy = getFunctionMonoid(O.getApplyMonoid(Object.assign({}, getJoinSemigroup(ordNumber), { empty: 0 })))();
/**
 * Retry immediately, but only up to `i` times.
 *
 * @since 0.1.0
 */
export function limitRetries(i) {
    return status => (status.iterNumber >= i ? O.none : O.some(0));
}
/**
 * Add an upperbound to a policy such that once the given time-delay
 * amount *per try* has been reached or exceeded, the policy will stop
 * retrying and fail.
 *
 * @since 0.1.0
 */
export function limitRetriesByDelay(maxDelay, policy) {
    return status => pipe(status, policy, O.filter(delay => delay < maxDelay));
}
/**
 * Constant delay with unlimited retries
 *
 * @since 0.1.0
 */
export function constantDelay(delay) {
    return () => O.some(delay);
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
export function capDelay(maxDelay, policy) {
    return status => pipe(status, policy, O.map(delay => Math.min(maxDelay, delay)));
}
/**
 * Grow delay exponentially each iteration.
 * Each delay will increase by a factor of two.
 *
 * @since 0.1.0
 */
export function exponentialBackoff(delay) {
    return status => O.some(delay * Math.pow(2, status.iterNumber));
}
/**
 * Initial, default retry status. Exported mostly to allow user code
 * to test their handlers and retry policies.
 *
 * @since 0.1.0
 */
export const defaultRetryStatus = {
    iterNumber: 0,
    cumulativeDelay: 0,
    previousDelay: O.none
};
/**
 * Apply policy on status to see what the decision would be.
 *
 * @since 0.1.0
 */
export function applyPolicy(policy, status) {
    const previousDelay = policy(status);
    return {
        iterNumber: status.iterNumber + 1,
        cumulativeDelay: status.cumulativeDelay + O.getOrElse(() => 0)(previousDelay),
        previousDelay
    };
}
