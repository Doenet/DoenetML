# Inari Sami (anarâškielâ) viewer chrome, Latin script. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Inari Sami is spoken around Lake Inari in Finland, and it is the only Sami
# language whose speakers are all in one state. It shares `č`, `š`, `ž`, `đ`
# and `ŋ` with Northern Sami, but it carries two more vowel letters that
# Northern Sami does not have and that this catalog is full of: `â`, the
# reduced vowel that ends a great many of the words below («čuoggá»'s plural
# «čuoggááh» aside, look at «nommâ», «tuotâ», «čáhpis»/«čáhpâd»), and `ä`.
# Inari also writes `y`. Northern Sami's `á` is here too, but it is not the
# same vowel as `â` and the two are not interchangeable: a word that should
# carry `â` and carries `á` instead is a bug, not a variant.
#
# The vocabulary is its own as well. Where this seed had an Inari Sami word it
# used it — «puáštu», «västidâs», «räävi», «koččâmuš», «čäittiđ» — and where
# it did not, it derived one by regular correspondence from the Northern Sami
# seed beside it. The derived words are the ones to check first, and each file
# lists its own.
#
# Inari Sami counts in a **dual**, as every Sami language does. CLDR gives it
# `one`, `two` and `other`, so a `{ $count -> … }` below that prints its
# number writes three branches, and the middle one is not a rounding of the
# plural: two of a thing is its own number, in the noun, in the pronoun and in
# the verb. `two` and `other` are written out separately even where they carry
# the same string today — the noun stands in the nominative singular after
# «ohtâ» and in the genitive singular after «kyehti» and every higher numeral,
# so the two share a form that neither shares with `one` — because they are
# two categories and a later correction to one of them is unlikely to be a
# correction to both.
#
# `one` does not catch zero, so the wording for none is spelled out in `[0]`.


## Answer submission

answer-checking = Tärkkistmin…
answer-submitting = Vuolgâttmin…
answer-checking-status = Tärkkist västidâs
answer-submitting-status = Vuolgât västidâs
answer-correct = Riehtis
answer-incorrect = Puáštu
answer-response-saved = Västidâs lii vuorkkejum
answer-percent-credit = { $percent }% čuoggáin
answer-percent-correct = { $percent }% riehtis
answer-percent-short = { $percent } %
max-credit-available = Enimustáá čuoggá: { $percent }%
attempts-remaining =
    { $count ->
        [0] iä lah šoh kiäččâlmeh peesâm
        [one] { $count } kiäččâlem pääcá
        [two] { $count } kiäččâlem pääcá
       *[other] { $count } kiäččâlem pääcá
    }
validation-correct = (Riehtis)
validation-incorrect = (Puáštu)
validation-partially-correct = (Peln riehtis)
# No select: the noun is the object of «čäiti» and takes the accusative
# singular after every numeral, so all three categories would render the same
# string. The count still arrives and is still formatted; only the branching
# is gone.
answer-show-responses = Čäiti { $count } västidâs tääsä: { $answerId }

## Disclosure panels

feedback-heading = Maccâttâs
collapsible-click-to-open = (koorkâl räppiđ)
collapsible-click-to-close = (koorkâl peittiđ)
collapsible-initializing = Alguttmin…
footnote-show = Čäiti vyeligtiäđu
footnote-hide = Čieggâd vyeligtiäđu
description-more-information = ennuv tiäđuid

## Controls

slider-previous = Ovdeb
slider-next = Puátteem
keyboard-open = Räppi näppäimistuu
keyboard-close = Peiti näppäimistuu
choice-input-remove-choice = Váldee erâld { $choice }
matrix-remove-row = Váldee erâld ravvuu
matrix-add-row = Lasseet ravvuu
matrix-remove-column = Váldee erâld saargâ
matrix-add-column = Lasseet saargâ
subset-add-remove-points = Lasseet/váldee erâld čuoggáid
subset-toggle-points-intervals = Muote čuoggái já koskâi kooskâst
subset-move-points = Siirdâ čuoggáid
subset-clear = Suoládâh
orbital-add-row = Lasseet ravvuu
orbital-remove-row = Váldee erâld ravvuu
orbital-add-box = Lasseet pooksâ
orbital-remove-box = Váldee erâld pooksâ
orbital-add-up-arrow = Lasseet njuolâ pajas
orbital-add-down-arrow = Lasseet njuolâ vuálás
orbital-remove-arrow = Váldee erâld njuolâ
orbital-row-label = Ravvuu { $row } nommâdâs
pretzel-answer = Västidâs

## Math input

math-input-preview-region = matemaatilâš cielgâdâs ovdâčäittim
math-input-preview = Ovdâčäittim
math-input-invalid-expression = Kelbottes cielgâdâs:

## Document status

viewer-initializing = Alguttmin…

## Errors

error-heading = Meddâdâs
error-found-at =
    { $span ->
        [line] Kavnum ravvuust { $startLine }.
       *[lines] Kavnum ravvuin { $startLine }–{ $endLine }.
    }
document-contains-errors = Taan tovâttâsâst láá meddâdâsah!
diagnostic-heading-error = Meddâdâs
diagnostic-heading-warning = Váritâs
diagnostic-heading-information = Tiätu
diagnostic-heading-hint = Räävi
accessibility-heading-level-1 = WCAG AA juksâmvuođâ rihkkoos
accessibility-heading-level-2 = Juksâmvuođâ váritâs
something-went-wrong = Mii-nubái manai puáštu.
renderer-load-failed = čäittimmoduul ij vieččâlum. Vieččâ sijđo uđđâsist.
core-start-failed = Taat tovâttâs ij pottâm aalgâđ. Vieččâ sijđo uđđâsist.
core-start-failed-busy = Taat tovâttâs ij pottâm aalgâđ. Maaŋgâ tovâttâs alguttii oovtâst, mii kalga vaaldiđ kuhheeb ääigi hiitasub mašinâst. Sijđo uđđâsist viečâm suáhtá išediđ tastko eres tovâttâsah láá kergâm.
core-start-failed-retry = Taat tovâttâs ij pottâm aalgâđ.
core-start-failed-busy-retry = Taat tovâttâs ij pottâm aalgâđ. Maaŋgâ tovâttâs alguttii oovtâst, mii kalga vaaldiđ kuhheeb ääigi hiitasub mašinâst.
core-start-retry = Kiäččâl uđđâsist
saved-state-unavailable = Tuu vuorkkejum pargo ij vieččâlum.
