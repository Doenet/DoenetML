# Northern Kurdish (Kurmanji) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Named `kmr`, not `ku`.** `ku` is the macrolanguage over Northern, Central
# and Southern Kurdish, and Central Kurdish (Sorani) ships beside this catalog
# as `locales/ckb`; a directory called `ku` would claim to cover a sibling it
# cannot serve. `negotiate.ts` aliases `ku` onto `kmr`, so a document written
# with either tag reaches this catalog. See `locales/kmr/content.ftl` for the
# full note.
#
# Northern Kurdish (Kurmanji) in the Hawar Latin alphabet — the orthography of
# Kurmanji publishing in Turkey, Syria and the diaspora, and what CLDR fills a
# bare `ku` in as (`ku` maximizes to `ku-Latn-TR`, endonym «kurdî
# (kurmancî)»). This catalog is **left to right**. A reader arriving under
# `ku-Arab` reaches it and gets Latin, the same script asymmetry `locales/pa`,
# `locales/sr` and `locales/ha` have; the answer is a second catalog beside
# this one rather than a rename of it. Central Kurdish (Sorani) is
# `locales/ckb`, a separate right-to-left catalog.
#
# Kurmanji counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape English gives it, `[0]` branch
# included. A noun after a numeral stays in the singular, so the two branches
# differ only in the verb agreeing with them.
#
# Kurmanji has grammatical gender, but nothing in this file agrees with a noun
# the catalog supplies — the gender fork lives in `content.ftl`, where the
# noun being described is known, and that file's header explains why it lands
# on the ezafe particle rather than on the adjectives.


## Answer submission

answer-checking = Tê kontrolkirin…
answer-submitting = Tê şandin…
answer-checking-status = Bersiv tê kontrolkirin
answer-submitting-status = Bersiv tê şandin
answer-correct = Rast
answer-incorrect = Şaş
answer-response-saved = Bersiv hate tomarkirin
answer-percent-credit = { $percent }% xal
answer-percent-correct = { $percent }% rast
answer-percent-short = { $percent } %
max-credit-available = Xala herî zêde ya berdest: { $percent }%
attempts-remaining =
    { $count ->
        [0] tu ceribandin nemane
        [one] { $count } ceribandin maye
       *[other] { $count } ceribandin mane
    }
validation-correct = (Rast)
validation-incorrect = (Şaş)
validation-partially-correct = (Bi qismî rast)
answer-show-responses =
    { $count ->
        [one] { $count } bersiva ji bo { $answerId } nîşan bide
       *[other] { $count } bersivên ji bo { $answerId } nîşan bide
    }


## Disclosure panels

feedback-heading = Bertek
collapsible-click-to-open = (ji bo vekirinê bitikîne)
collapsible-click-to-close = (ji bo girtinê bitikîne)
collapsible-initializing = Tê amadekirin…
footnote-show = Jêrenotê nîşan bide
footnote-hide = Jêrenotê veşêre
description-more-information = agahiyên bêtir


## Controls

slider-previous = Paş
slider-next = Pêş
keyboard-open = Klavyeyê Veke
keyboard-close = Klavyeyê Bigire
choice-input-remove-choice = { $choice } jê bibe
matrix-remove-row = Rêzê jê bibe
matrix-add-row = Rêzê zêde bike
matrix-remove-column = Stûnê jê bibe
matrix-add-column = Stûnê zêde bike
subset-add-remove-points = Xalan zêde bike/jê bibe
subset-toggle-points-intervals = Di navbera xal û navberan de biguhêre
subset-move-points = Xalan Bilivîne
subset-clear = Paqij Bike
orbital-add-row = Rêzê Zêde Bike
orbital-remove-row = Rêzê Jê Bibe
orbital-add-box = Qutîkê Zêde Bike
orbital-remove-box = Qutîkê Jê Bibe
orbital-add-up-arrow = Tîra Jorê Zêde Bike
orbital-add-down-arrow = Tîra Jêrê Zêde Bike
orbital-remove-arrow = Tîrê Jê Bibe
orbital-row-label = Etîketa rêza { $row }
pretzel-answer = Bersiv


## Math input

math-input-preview-region = pêşdîtina îfadeya matematîkî
math-input-preview = Pêşdîtin
math-input-invalid-expression = Îfadeya nederbasdar:


## Document status

viewer-initializing = Tê amadekirin…


## Errors

error-heading = Çewtî
error-found-at =
    { $span ->
        [line] Li rêza { $startLine } hate dîtin.
       *[lines] Li rêzên { $startLine }–{ $endLine } hate dîtin.
    }
document-contains-errors = Di vê belgeyê de çewtî hene!
diagnostic-heading-error = Çewtî
diagnostic-heading-warning = Hişyarî
diagnostic-heading-information = Agahî
diagnostic-heading-hint = Şîret
accessibility-heading-level-1 = Binpêkirina Gihîştinê ya WCAG AA
accessibility-heading-level-2 = Hişyariya gihîştinê
something-went-wrong = Tiştek çewt çû.
renderer-load-failed = nîşanderek nehate barkirin. Ji kerema xwe rûpelê nû bike.
core-start-failed = Ev belge nehate destpêkirin. Ji kerema xwe rûpelê nû bike.
core-start-failed-busy = Ev belge nehate destpêkirin. Çend belge bi hev re dest pê dikirin, û ev li ser amûreke hêdî dikare dirêjtir bidome. Piştî ku belgeyên din biqedin, nûkirina rûpelê dikare bibe alîkar.
core-start-failed-retry = Ev belge nehate destpêkirin.
core-start-failed-busy-retry = Ev belge nehate destpêkirin. Çend belge bi hev re dest pê dikirin, û ev li ser amûreke hêdî dikare dirêjtir bidome.
core-start-retry = Dîsa biceribîne
saved-state-unavailable = Xebata te ya tomarkirî nehate barkirin.
