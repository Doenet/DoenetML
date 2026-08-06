# math-expressions: what DoenetML still needs

**For:** maintainers of [`Doenet/math-expressions`](https://github.com/Doenet/math-expressions)
**Against:** `siefkenj/math-expressions@doenet`, `10488e9`
**Date:** 2026-08-06

Every request below is reproducible from `import me from "math-expressions"` alone, and was checked
against `10488e9` on the day of writing. Closed and withdrawn items are in
[`upstream_requests/RESOLVED.md`](upstream_requests/RESOLVED.md) and
[`upstream_requests/README.md`](upstream_requests/README.md).

---

## 25. Term order puts a constant-bearing product last

```js
me.fromText("ae+bf").simplify().toString();   // "b f + a e"   — legacy: "a e + b f"
me.fromText("ax+by").simplify().toString();   // "a x + b y"   ✓ pure variables are fine
```

`e` is Euler's number, so `a·e` has degree 1 in variables where `b·f` has 2, and the higher degree
sorts first. Defensible as a convention, but it is not legacy's, and it is visible wherever an author
uses `e` or `f` as a variable name.

**Want:** a decision, not necessarily a change — if the order is intended, we will update the
expectations that encode legacy's.

**Costs us:** 1 test, `math.test.ts > matrix-vector multiplication`, which now contracts correctly
(`(ae+bf, ce+df)`) and compares the rendered string.

