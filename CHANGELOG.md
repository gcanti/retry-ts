# Changelog

> **Tags:**
>
> - [New Feature]
> - [Bug Fix]
> - [Breaking Change]
> - [Documentation]
> - [Internal]
> - [Polish]
> - [Experimental]

**Note**: Gaps between patch versions are faulty/broken releases.
**Note**: A feature tagged as Experimental is in a high state of flux, you're at risk of it changing without notice.

# 0.1.4

- **New Feature**
  - add `ReaderTask` support, #11 (@mlegenhausen)

# 0.1.3

- **Deprecation**
  - deprecate `monoidRetryPolicy` in favour of `Monoid` (@gcanti)
- **Polish**
  - allow import without es6 or lib directory #8 (@mlegenhausen)
  - add `/*#__PURE__*/` comments for better tree shaking (@gcanti)

# 0.1.2

- **Bug Fix**
  - don't set `target: es6` in `tsconfig.build-es6.json` (@gcanti)
- **Internal**
  - upgrade to latest `docs-ts` (@gcanti)

# 0.1.1

- **New Feature**
  - add build in ES6 format (@gcanti)

# 0.1.0

- **Breaking Change**
  - upgrade to `fp-ts@2.0.0` (@Wenqer)
  - remove `TaskEither` module (@Wenqer)

# 0.0.1

Initial release
