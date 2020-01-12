---
title: index.ts
nav_order: 1
parent: Modules
---

# index overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [RetryPolicy (interface)](#retrypolicy-interface)
- [RetryStatus (interface)](#retrystatus-interface)
- [defaultRetryStatus (constant)](#defaultretrystatus-constant)
- [monoidRetryPolicy (constant)](#monoidretrypolicy-constant)
- [applyPolicy (function)](#applypolicy-function)
- [capDelay (function)](#capdelay-function)
- [constantDelay (function)](#constantdelay-function)
- [exponentialBackoff (function)](#exponentialbackoff-function)
- [limitRetries (function)](#limitretries-function)
- [limitRetriesByDelay (function)](#limitretriesbydelay-function)

---

# RetryPolicy (interface)

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

# RetryStatus (interface)

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

# defaultRetryStatus (constant)

Initial, default retry status. Exported mostly to allow user code
to test their handlers and retry policies.

**Signature**

```ts
export const defaultRetryStatus: RetryStatus = ...
```

Added in v0.1.0

# monoidRetryPolicy (constant)

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
export const monoidRetryPolicy: Monoid<RetryPolicy> = ...
```

**Example**

```ts
import { monoidRetryPolicy, exponentialBackoff, limitRetries } from 'retry-ts'

// One can easily define an exponential backoff policy with a limited
// number of retries:
export const limitedBackoff = monoidRetryPolicy.concat(exponentialBackoff(50), limitRetries(5))
```

Added in v0.1.0

# applyPolicy (function)

Apply policy on status to see what the decision would be.

**Signature**

```ts
export function applyPolicy(policy: RetryPolicy, status: RetryStatus): RetryStatus { ... }
```

Added in v0.1.0

# capDelay (function)

Set a time-upperbound for any delays that may be directed by the
given policy. This function does not terminate the retrying. The policy
capDelay(maxDelay, exponentialBackoff(n))`will never stop retrying. It will reach a state where it retries forever with a delay of`maxDelay`
between each one. To get termination you need to use one of the
'limitRetries' function variants.

**Signature**

```ts
export function capDelay(maxDelay: number, policy: RetryPolicy): RetryPolicy { ... }
```

Added in v0.1.0

# constantDelay (function)

Constant delay with unlimited retries

**Signature**

```ts
export function constantDelay(delay: number): RetryPolicy { ... }
```

Added in v0.1.0

# exponentialBackoff (function)

Grow delay exponentially each iteration.
Each delay will increase by a factor of two.

**Signature**

```ts
export function exponentialBackoff(delay: number): RetryPolicy { ... }
```

Added in v0.1.0

# limitRetries (function)

Retry immediately, but only up to `i` times.

**Signature**

```ts
export function limitRetries(i: number): RetryPolicy { ... }
```

Added in v0.1.0

# limitRetriesByDelay (function)

Add an upperbound to a policy such that once the given time-delay
amount _per try_ has been reached or exceeded, the policy will stop
retrying and fail.

**Signature**

```ts
export function limitRetriesByDelay(maxDelay: number, policy: RetryPolicy): RetryPolicy { ... }
```

Added in v0.1.0
