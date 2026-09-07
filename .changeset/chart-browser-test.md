---
"@doenet/doenetml": patch
---

Cover `<chart>` with browser tests: the renderer hand-off, the build request, the framing, and diagcess navigation of the series.

Every existing chart test stopped at the XML the worker generates, which left the whole second half of the component unverified — the component resolving to its renderer, the build request being made with that XML, `GraphFrame` sizing the result and `aspectRatio` reaching CSS, and diagcess initializing over the annotations. The last is the reason a chart renders through PreFigure at all, and it is the one claim no assertion on the XML can make.

Two specs, following the shapes already in `cypress/e2e/prefigure/`. `chart.cy.js` intercepts the build endpoint, so it costs a normal CI run nothing and still checks the request body, the mount, the frame's aspect ratio and the diagcess start. `chartLive.cy.js` compiles for real behind the same env gate as `prefigureLiveAccessibility.cy.js`, and checks the things only a rendered chart can answer: that every authored string — categories, series labels, title, axis label — is actually painted, that no text is drawn outside the picture, that the title clears the tallest bar, and that the annotation tree a screen reader walks really is figure → series → bar.

Also confirms that a document using `<tally>` or `<binCounts>` without a chart pulls no PreFigure runtime, which is what makes the counting operators free to use on any page.

Closes #1837.
