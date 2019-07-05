import { Either } from 'fp-ts/lib/Either'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import { RetryPolicy, RetryStatus } from '.'
import { retrying as r } from './Task'

export const retrying = <L, A>(
  policy: RetryPolicy,
  action: (status: RetryStatus) => TaskEither<L, A>,
  check: (e: Either<L, A>) => boolean
): TaskEither<L, A> => {
  return r(policy, action, check)
}
