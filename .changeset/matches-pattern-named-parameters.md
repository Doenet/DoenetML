---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

`<matchesPattern>`: add a `parameters` attribute, so a pattern can require the same subexpression in more than one place.

`parameters` names the variables in `pattern` that stand for a subexpression instead of themselves. A name repeated in the pattern has to match the same subexpression each time, which is what the blanks written `()` cannot say — each of those matches independently of the others. So `pattern="sin(a)^2+cos(a)^2" parameters="a"` accepts `sin(x)^2+cos(x)^2` and turns down `sin(x)^2+cos(y)^2`.

`patternMatches` comes back in the order the parameters were named, and a parameter that does not occur in the pattern holds its place there as a blank and warns, so an author's `$m.patternMatches[2]` keeps meaning the second name they wrote. A name listed twice is one placeholder and takes one place in that list.

Specifying `parameters` also makes `()` a literal blank rather than a placeholder — a pattern cannot ask for both kinds at once, and a pattern that wants a literal blank matched needs `matchExpressionWithBlanks` as before. `parameters` is a list of variable names, the same kind `<function variables>` and `<solveEquations variables>` take, so a plain symbol or a subscripted one is a parameter and anything else is ignored with a warning. A function name counts, which makes `pattern="f(x)+f(y)" parameters="f"` match `sin(x)+sin(y)` and not `sin(x)+cos(y)`.

Leaving `parameters` off changes nothing.

Closes #1315.
