---
title: Task.ts
nav_order: 2
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [applyAndDelay (function)](#applyanddelay-function)
- [retrying (function)](#retrying-function)

---

# applyAndDelay (function)

Apply policy and delay by its amount if it results in a retry.
Returns updated status.

**Signature**

```ts
export const applyAndDelay = (policy: RetryPolicy, status: RetryStatus): T.Task<RetryStatus> => ...
```

# retrying (function)

Retry combinator for actions that don't raise exceptions, but
signal in their type the outcome has failed. Examples are the
`Option`, `Either` and `EitherT` monads.

**Signature**

```ts
export const retrying = <A>(
  policy: RetryPolicy,
  action: (status: RetryStatus) => T.Task<A>,
  check: (a: A) => boolean
): T.Task<A> => ...
```
