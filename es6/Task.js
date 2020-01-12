import * as T from 'fp-ts/es6/Task';
import * as O from 'fp-ts/es6/Option';
import { pipe } from 'fp-ts/es6/pipeable';
import { applyPolicy, defaultRetryStatus } from '.';
/**
 * Apply policy and delay by its amount if it results in a retry.
 * Returns updated status.
 *
 * @since 0.1.0
 */
export function applyAndDelay(policy, status) {
    const newStatus = applyPolicy(policy, status);
    return pipe(newStatus.previousDelay, O.fold(() => T.task.of(newStatus), millis => T.delay(millis)(T.task.of(newStatus))));
}
/**
 * Retry combinator for actions that don't raise exceptions, but
 * signal in their type the outcome has failed. Examples are the
 * `Option`, `Either` and `EitherT` monads.
 *
 * @since 0.1.0
 */
export function retrying(policy, action, check) {
    const go = (status) => pipe(status, action, T.chain(a => {
        if (check(a)) {
            return pipe(applyAndDelay(policy, status), T.chain(status => pipe(status.previousDelay, O.fold(() => T.task.of(a), () => go(status)))));
        }
        else {
            return T.task.of(a);
        }
    }));
    return go(defaultRetryStatus);
}
