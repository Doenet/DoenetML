# Luganda viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Luganda has two plural categories, and a noun marks number with a class
# prefix rather than a suffix — «omulundi» one time, «emirundi» several;
# «eky'okuddamu» one answer, «eby'okuddamu» several — and it keeps doing so
# after a numeral. So the selects are kept and the noun changes shape inside
# them. `attempts-remaining` also keeps its `[0]` branch, an exact-value match
# rather than a plural category, which says «tewali» instead of counting to
# zero.


## Answer submission

answer-checking = Ekebera...
answer-submitting = Eweereza...
answer-checking-status = Ekebera eky'okuddamu
answer-submitting-status = Eweereza eky'okuddamu
answer-correct = Kituufu
answer-incorrect = Si kituufu
answer-response-saved = Eky'okuddamu Kitereddwa
answer-percent-credit = Amanya { $percent }%
answer-percent-correct = { $percent }% Kituufu
answer-percent-short = { $percent } %
max-credit-available = Amanya agasinga agasoboka: { $percent }%
attempts-remaining =
    { $count ->
        [0] tewali mulundi gusigadde
        [one] omulundi { $count } gusigadde
       *[other] emirundi { $count } gisigadde
    }
validation-correct = (Kituufu)
validation-incorrect = (Si kituufu)
validation-partially-correct = (Kituufu mu kitundu)
answer-show-responses =
    { $count ->
        [one] Laga eky'okuddamu { $count } ekya { $answerId }
       *[other] Laga eby'okuddamu { $count } ebya { $answerId }
    }

## Disclosure panels

feedback-heading = Okuddamu kw'Omusomesa
collapsible-click-to-open = (nyiga okuggulawo)
collapsible-click-to-close = (nyiga okuggalawo)
collapsible-initializing = Etandika...
footnote-show = Laga ekiwandiiko eky'emmanga
footnote-hide = Kweka ekiwandiiko eky'emmanga
description-more-information = ebirala ebikwata ku kino

## Controls

slider-previous = Ekiyise
slider-next = Ekiddako
keyboard-open = Ggulawo Kiibbodi
keyboard-close = Ggalawo Kiibbodi
choice-input-remove-choice = Ggyawo { $choice }
matrix-remove-row = Ggyawo olunyiriri olugalamidde
matrix-add-row = Yongerako olunyiriri olugalamidde
matrix-remove-column = Ggyawo olunyiriri oluyimiridde
matrix-add-column = Yongerako olunyiriri oluyimiridde
subset-add-remove-points = Yongerako/Ggyawo obutonnyeze
subset-toggle-points-intervals = Kyusa wakati w'obutonnyeze n'ebbanga
subset-move-points = Situla Obutonnyeze
subset-clear = Sangula
# A `box` here is one orbital, drawn as a square: «akasanduuko».
orbital-add-row = Yongerako Olunyiriri
orbital-remove-row = Ggyawo Olunyiriri
orbital-add-box = Yongerako Akasanduuko
orbital-remove-box = Ggyawo Akasanduuko
orbital-add-up-arrow = Yongerako Akasaale Akatunuulidde Waggulu
orbital-add-down-arrow = Yongerako Akasaale Akatunuulidde Wansi
orbital-remove-arrow = Ggyawo Akasaale
orbital-row-label = Erinnya ly'olunyiriri { $row }
pretzel-answer = Eky'okuddamu

## Math input

math-input-preview-region = okulaba mu maaso ng'ebigambo by'okubala
math-input-preview = Okulaba mu maaso
math-input-invalid-expression = Ebigambo tebituufu:

## Document status

viewer-initializing = Etandika...

## Errors

error-heading = Ensobi
error-found-at =
    { $span ->
        [line] Kizuuliddwa ku lunyiriri { $startLine }.
       *[lines] Kizuuliddwa ku nnyiriri { $startLine }–{ $endLine }.
    }
document-contains-errors = Ekiwandiiko kino kirimu ensobi!
diagnostic-heading-error = Ensobi
diagnostic-heading-warning = Okulabula
diagnostic-heading-information = Ebiwandiiko
diagnostic-heading-hint = Amagezi
accessibility-heading-level-1 = Okumenya Etteeka lya WCAG AA ery'Okutuukirira
accessibility-heading-level-2 = Okulabula ku kutuukirira
something-went-wrong = Waliwo ekitagenze bulungi.
renderer-load-failed = omulaga omu tegusobodde kutandika. Ddamu ozzeemu olupapula.
core-start-failed = Omulaga w'ekiwandiiko tasobodde kutandika. Ddamu ozzeemu olupapula.
