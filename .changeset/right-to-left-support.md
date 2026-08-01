---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Lay documents out right-to-left when their language is written that way.

DoenetML emitted no `dir` anywhere, and a browser will not infer one from `lang`. An Arabic document therefore rendered right-to-left text in a left-to-right box: punctuation landed on the wrong end, and a run mixing Arabic with a Latin identifier came out in the wrong visual order. The stylesheets were written in left and right throughout, so every indent, gutter and hanging list number pointed away from the text it belonged to.

The viewer now labels the document with its direction beside its language, and the chrome around it with the reader's — two attributes rather than one, because a reader whose language runs the other way from the activity's is the case this exists for. A nested `<document lang>` carries its own. Where a piece of chrome drawn inside the document runs the opposite way to it, it re-declares itself; where the two agree, nothing is added.

Mathematical notation does not mirror. Graphs, the math input and its keyboard, matrices, the spreadsheet, sliders, number lines, orbital diagrams and the source editor all stay left-to-right inside a right-to-left document. What does mirror is the prose: indents, list numbering, the paginator, feedback and hint headers, the editor toolbar.

Translated chrome now isolates its interpolated values, which is what keeps a Latin identifier from scrambling the words around it. English is unchanged, byte for byte. Content computed in the worker is unchanged too — those strings become state variables an author can interpolate and an `<award>` can compare, where an invisible character would be a silent wrong answer.

No right-to-left catalog ships yet: `<document lang="ar">` turns the page around and leaves the words in English. Arabic and the six other languages this unblocks — Persian, Hebrew, Urdu, Pashto, Sindhi and Uyghur — follow separately.
