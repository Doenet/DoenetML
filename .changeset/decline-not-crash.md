---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/v06-to-v07": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A half-typed function call no longer stops the document building.

```xml
$$g($$f(<math>3</math>)
```

That is what `$$g($$f(<math>3</math>), 2)` looks like partway through being typed, and the editor
parses on every keystroke — so what the reader saw was not a message about the missing
parenthesis but a blank page. The only `)` in it belongs to the inner call, and the outer
reference was committing to being a call on the strength of it. It now declines and
leaves its text alone, as every other unfinished shape here does. A very long run of
brackets or parentheses in one span of prose used to fail to parse for an unrelated
reason, and no longer does either.

Formatting a document no longer changes what it means.

```xml
<p>$(x)hi</p>
<p>$(x)[1]</p>
```

Both came back rewritten: the first as `$xhi`, a reference to a component nobody named,
and the second as `$x[1]`, a reference *with an index* where the author had written a
reference followed by the text `[1]`. `$(…)` ends a reference's path, so the parentheses
are now kept wherever dropping them would let what follows be read as part of the
reference — and still dropped where it could not be, so `$(x).5` and `$(x) hi` come back
as `$x.5` and `$x hi`.

A bad index no longer quietly stops a function reference being called.

```xml
<p>$$F[$(x)[<math>3</math>]](3)</p>
```

The inner brackets cannot be read as an index, which was reported. What was not reported
is that the `(3)` had stopped being a call and was rendering as text. The call is built
now, and the index still says what is wrong with it.

A diagnostic about markup written between index brackets is reported once, however deeply
nested — it used to double with each level — and no longer names components that are not
yours. An element in brackets that turns out to be in error drew a second warning about
invalid `<_copy>` children beside the real message; that warning is gone, and the real
one stayed.

Converting a v0.6 document now keeps `$(b/c).d` as a reference followed by the text `.d`.
v0.6 read it that way — a prop access went inside the parentheses, as `$(b/c.d)` — and the
conversion was turning it into a property access the author never wrote.
