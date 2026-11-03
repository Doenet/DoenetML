---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A tag you write makes that tag: `<T extend="$x"/>` and `<T copy="$x"/>` now always make exactly one `T`. Whether a `T` can be made from a composite is decided when the document loads, from what is written, rather than as the composite changes. This is a breaking change for documents that relied on the run-time decision.

- **A composite needs to always hold exactly one component, of one type that can become the tag.** A `<conditionalContent>` needs an `<else>`, and each case and the else one component of the same type. A `<select>` or another selector needs `numToSelect` written as `1` or left out. A `<group>`, `<sort>` or `<shuffle>` needs one component, and a `<repeat>`, `<collect>`, `<sequence>` or `<intersection>` is an error as a single tag. In what a part holds, a bare `$y` holds `y`'s tag, a bare string is a text, and a property (`$P.x`) is an error. Each of these used to be decided as the document ran, with an info and nothing shown while it didn't match. They are now errors, whose messages say what to write instead: add an `<else>`, index it (`$x[1]`), or wrap it (`<math>$cc</math>`). `<point extend="$cc"/>` of a math case and a vector else is now an error; wrap it as `<point>$cc</point>`.
- **A list tag** (`<mathList extend="$g"/>`) takes any number of components, including none, as long as they are all of one type. Mixed types are an error.
- **A missing referent on a tag is an error**, shown in its place: a name that names nothing (`<math extend="$nothing"/>`) or more than one thing, a property its source doesn't have (`<p extend="$p.badProp"/>`), and a literal index past what a selector picks (`<math extend="$s[2]"/>` of a one-pick `<select>`). The tag used to be made empty, with its own children, and a warning. A bare `$nothing` is still a warning.
- **What still changes at run time doesn't change what the tag makes.** While the value of a math does not convert (`<point extend="$m"/>` while `m` is not a tuple), the tag now has the value of an empty one, such as `(0, 0)`, with its own attributes and children, where it used to show nothing. While an index names nothing because of its value (`<text extend="$r[$i]"/>` past the iterations of `r`), the tag is empty with a new info in place of the warning it used to give, and is made from the iteration again once the index names one. Both infos appear and go away with their condition.
- `<text extend="$cc"/>` of a `<conditionalContent>` whose cases hold bare text no longer fails to load.

Closes #2445 and #2433.
