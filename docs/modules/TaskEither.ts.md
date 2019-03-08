---
title: TaskEither.ts
nav_order: 3
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [retrying (function)](#retrying-function)

---

# retrying (function)

**Signature**

```ts
export const retrying = <L, A>(
  policy: RetryPolicy,
  action: (status: RetryStatus) => TaskEither<L, A>,
  check: (e: Either<L, A>) => boolean
): TaskEither<L, A> => ...
```
