---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

`<matchesPattern>`: add a `parameters` attribute, so a pattern can require the same subexpression in more than one place.

`parameters` names the variables in `pattern` that stand for a subexpression instead of themselves. A name repeated in the pattern has to match the same subexpression each time, which is what the blanks written `()` cannot say — each of those matches independently of the others. So `pattern="sin(a)^2+cos(a)^2" parameters="a"` accepts `sin(x)^2+cos(x)^2` and turns down `sin(x)^2+cos(y)^2`.

`patternMatches` comes back in the order the parameters were named, and a parameter that does not occur in the pattern holds its place there as a blank, so an author's `$m.patternMatches[2]` keeps meaning the second name they wrote.

Specifying `parameters` also makes `()` a literal blank rather than a placeholder — a pattern cannot ask for both kinds at once, and a pattern that wants a literal blank matched needs `matchExpressionWithBlanks` as before. A parameter must be a variable: a plain symbol, a subscripted or primed one, or a function name. Anything else is ignored with a warning.

Leaving `parameters` off changes nothing.

Closes #1315.
