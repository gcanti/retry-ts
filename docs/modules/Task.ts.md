---
title: Task.ts
nav_order: 2
parent: Modules
---

# Task overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [applyAndDelay](#applyanddelay)
- [retrying](#retrying)

---

# applyAndDelay

Apply policy and delay by its amount if it results in a retry.
Returns updated status.

**Signature**

```ts
export function applyAndDelay(policy: RetryPolicy, status: RetryStatus): T.Task<RetryStatus> { ... }
```

Added in v0.1.0

# retrying

Retry combinator for actions that don't raise exceptions, but
signal in their type the outcome has failed. Examples are the
`Option`, `Either` and `EitherT` monads.

**Signature**

```ts
export function retrying<A>(
  policy: RetryPolicy,
  action: (status: RetryStatus) => T.Task<A>,
  check: (a: A) => boolean
): T.Task<A> { ... }
```

Added in v0.1.0
