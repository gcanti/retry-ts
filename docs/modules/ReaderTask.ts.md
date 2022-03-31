---
title: ReaderTask.ts
nav_order: 2
parent: Modules
---

## ReaderTask overview

Added in v0.1.4

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [applyAndDelay](#applyanddelay)
  - [retrying](#retrying)

---

# utils

## applyAndDelay

Apply policy and delay by its amount if it results in a retry.
Returns updated status.

**Signature**

```ts
export declare const applyAndDelay: <R>(policy: RetryPolicy, status: RetryStatus) => ReaderTask<R, RetryStatus>
```

Added in v0.1.4

## retrying

Retry combinator for actions that don't raise exceptions, but
signal in their type the outcome has failed. Examples are the
`Option`, `Either` and `EitherT` monads.

**Signature**

```ts
export declare function retrying<R, A>(
  policy: RetryPolicy,
  action: (status: RetryStatus) => ReaderTask<R, A>,
  check: (a: A) => boolean
): ReaderTask<R, A>
```

Added in v0.1.4
