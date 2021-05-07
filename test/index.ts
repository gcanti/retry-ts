import * as assert from 'assert'
import { replicate } from 'fp-ts/lib/Array'
import { none, some } from 'fp-ts/lib/Option'
import {
  applyPolicy,
  capDelay,
  constantDelay,
  defaultRetryStatus,
  exponentialBackoff,
  limitRetries,
  limitRetriesByDelay,
  monoidRetryPolicy,
  RetryPolicy,
  RetryStatus
} from '../src'

/**
 * Apply policy `n` times
 */
const applyPolicyN = (n: number, policy: RetryPolicy): RetryStatus => {
  return replicate(n, policy).reduce((status, policy) => applyPolicy(policy, status), defaultRetryStatus)
}

describe('retry policy', () => {
  it('if either policy returns None then composition also returns None', () => {
    const p1: RetryPolicy = () => some(0)
    const p2: RetryPolicy = () => none
    assert.deepEqual(applyPolicy(monoidRetryPolicy.concat(p1, p2), defaultRetryStatus).previousDelay, none)
  })

  it('if both policies return a delay, larger delay is used', () => {
    const p1: RetryPolicy = monoidRetryPolicy.empty
    const p2: RetryPolicy = () => some(1)
    assert.deepEqual(applyPolicy(monoidRetryPolicy.concat(p1, p2), defaultRetryStatus), {
      iterNumber: 1,
      cumulativeDelay: 1,
      previousDelay: some(1)
    })
  })

  it('limitRetries', () => {
    const p = limitRetries(2)
    assert.deepEqual(applyPolicyN(2, p), {
      iterNumber: 2,
      cumulativeDelay: 0,
      previousDelay: some(0)
    })
    assert.deepEqual(applyPolicyN(3, p), {
      iterNumber: 3,
      cumulativeDelay: 0,
      previousDelay: none
    })
  })

  it('limitRetriesByDelay', () => {
    const incrementPolicy: RetryPolicy = (status) => some(status.iterNumber + 1)
    const p = limitRetriesByDelay(3, incrementPolicy)
    assert.deepEqual(applyPolicyN(2, p), {
      iterNumber: 2,
      cumulativeDelay: 3,
      previousDelay: some(2)
    })
    assert.deepEqual(applyPolicyN(3, p), {
      iterNumber: 3,
      cumulativeDelay: 3,
      previousDelay: none
    })
  })

  it('constantDelay', () => {
    const p = constantDelay(2)
    assert.deepEqual(applyPolicyN(5, p), {
      iterNumber: 5,
      cumulativeDelay: 10,
      previousDelay: some(2)
    })
  })

  it('capDelay', () => {
    const incrementPolicy: RetryPolicy = (status) => some(status.iterNumber + 1)
    const p = capDelay(3, incrementPolicy)
    assert.deepEqual(applyPolicyN(4, p), {
      iterNumber: 4,
      cumulativeDelay: 9,
      previousDelay: some(3)
    })
  })

  it('exponentialBackoff', () => {
    const p = exponentialBackoff(2)
    assert.deepEqual(applyPolicyN(4, p), {
      iterNumber: 4,
      cumulativeDelay: 30,
      previousDelay: some(16)
    })
  })
})
