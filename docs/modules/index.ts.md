---
title: index.ts
nav_order: 1
parent: Modules
---

## index overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Monoid](#monoid)
  - [RetryPolicy (interface)](#retrypolicy-interface)
  - [RetryStatus (interface)](#retrystatus-interface)
  - [applyPolicy](#applypolicy)
  - [capDelay](#capdelay)
  - [constantDelay](#constantdelay)
  - [defaultRetryStatus](#defaultretrystatus)
  - [exponentialBackoff](#exponentialbackoff)
  - [limitRetries](#limitretries)
  - [limitRetriesByDelay](#limitretriesbydelay)
  - [~~monoidRetryPolicy~~](#monoidretrypolicy)

---

# utils

## Monoid

'RetryPolicy' is a 'Monoid'. You can collapse multiple strategies into one using 'concat'.
The semantics of this combination are as follows:

1. If either policy returns 'None', the combined policy returns
   'None'. This can be used to inhibit after a number of retries,
   for example.

2. If both policies return a delay, the larger delay will be used.
   This is quite natural when combining multiple policies to achieve a
   certain effect.

**Signature**

```ts
export declare const Monoid: M.Monoid<RetryPolicy>
```

**Example**

```ts
import { monoidRetryPolicy, exponentialBackoff, limitRetries } from 'retry-ts'

// One can easily define an exponential backoff policy with a limited
// number of retries:
export const limitedBackoff = monoidRetryPolicy.concat(exponentialBackoff(50), limitRetries(5))
```

Added in v0.1.3

## RetryPolicy (interface)

A `RetryPolicy` is a function that takes an `RetryStatus` and
possibly returns a delay in milliseconds. Iteration numbers start
at zero and increase by one on each retry. A _None_ return value from
the function implies we have reached the retry limit.

**Signature**

```ts
export interface RetryPolicy {
  (status: RetryStatus): O.Option<number>
}
```

Added in v0.1.0

## RetryStatus (interface)

**Signature**

```ts
export interface RetryStatus {
  /** Iteration number, where `0` is the first try */
  iterNumber: number
  /** Delay incurred so far from retries */
  cumulativeDelay: number
  /** Latest attempt's delay. Will always be `none` on first run. */
  previousDelay: O.Option<number>
}
```

Added in v0.1.0

## applyPolicy

Apply policy on status to see what the decision would be.

**Signature**

```ts
export declare function applyPolicy(policy: RetryPolicy, status: RetryStatus): RetryStatus
```

Added in v0.1.0

## capDelay

Set a time-upperbound for any delays that may be directed by the
given policy. This function does not terminate the retrying. The policy
capDelay(maxDelay, exponentialBackoff(n))`will never stop retrying. It will reach a state where it retries forever with a delay of`maxDelay`
between each one. To get termination you need to use one of the
'limitRetries' function variants.

**Signature**

```ts
export declare function capDelay(maxDelay: number, policy: RetryPolicy): RetryPolicy
```

Added in v0.1.0

## constantDelay

Constant delay with unlimited retries

**Signature**

```ts
export declare function constantDelay(delay: number): RetryPolicy
```

Added in v0.1.0

## defaultRetryStatus

Initial, default retry status. Exported mostly to allow user code
to test their handlers and retry policies.

**Signature**

```ts
export declare const defaultRetryStatus: RetryStatus
```

Added in v0.1.0

## exponentialBackoff

Grow delay exponentially each iteration.
Each delay will increase by a factor of two.

**Signature**

```ts
export declare function exponentialBackoff(delay: number): RetryPolicy
```

Added in v0.1.0

## limitRetries

Retry immediately, but only up to `i` times.

**Signature**

```ts
export declare function limitRetries(i: number): RetryPolicy
```

Added in v0.1.0

## limitRetriesByDelay

Add an upperbound to a policy such that once the given time-delay
amount _per try_ has been reached or exceeded, the policy will stop
retrying and fail.

**Signature**

```ts
export declare function limitRetriesByDelay(maxDelay: number, policy: RetryPolicy): RetryPolicy
```

Added in v0.1.0

## ~~monoidRetryPolicy~~

Use [`Monoid`](#monoid) instead.

**Signature**

```ts
export declare const monoidRetryPolicy: M.Monoid<RetryPolicy>
```

Added in v0.1.0
