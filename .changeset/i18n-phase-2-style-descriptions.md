---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Translate style descriptions, and ship the Spanish vocabulary.

"thick dashed blue line", "filled blue circle with a thick red border", "green square", "black with a yellow background" — the words `styleDescription`, `styleDescriptionWithNoun`, `borderStyleDescription`, `fillStyleDescription`, `textStyleDescription`, `textColor`, and `backgroundColor` report now come from message catalogs. An activity set to Spanish, by `documentLocale="es"` or by declaring `<document lang="es">`, describes its graphics in Spanish with nothing else configured.

These are the words authors interpolate into their prose with `$line.styleDescription`, and the words a screen reader announces for a graph, so they follow the language the activity was *written* in rather than the reader's interface language.

Word order and agreement belong to the language, not to the code that assembles the sentence. Spanish puts adjectives after the noun and inflects them to match its gender, so it says "línea discontinua gruesa roja" where English says "thick dashed red line", and "círculo azul relleno con un borde grueso rojo" where English says "filled blue circle with a thick red border" — including agreeing the border's adjectives with the word for border rather than with the shape around it.

A word an author writes themselves — `lineColorWord="chartreuse"`, `markerStyleWord`, or a CSS color asked for by name like `rebeccapurple` — is left exactly as written.

A shape that names itself after another, such as a triangle or a rectangle, is now described with its own noun rather than by rewriting the finished English sentence, so `$triangle.styleDescriptionWithNoun` reads correctly in every language.

With no locale configured, every description reads exactly as it did before, with one exception: a `<regularPolygon>` reports its side count through the locale's own number formatting, so a thousand-sided one now reads "1,000-sided regular polygon" rather than "1000-sided regular polygon". Every side count anyone writes in practice is unaffected.
