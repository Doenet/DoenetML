# Ewe viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `ɖ`, `ƒ`, `ɣ`, `ŋ`, `ɔ`, `ɛ` and `ʋ` are letters of the alphabet, as
# `content.ftl`'s header sets out; so are the tone marks.
#
# CLDR gives Ewe two plural categories. Ewe marks its plural with the suffix
# `-wo`, but not after a numeral: «axa eve», never «axawo eve». So a counted
# noun in these messages is invariable, the selects are dropped, and a `[one]`
# differing from its `[other]` would be wrong rather than merely redundant.
# `attempts-remaining` keeps its `[0]` branch, which is an exact-value match
# rather than a plural category and says «ɖeke mesusɔ o» instead of counting to
# zero.


## Answer submission

answer-checking = Ele kpɔkpɔm...
answer-submitting = Ele ɖoɖom ɖa...
answer-checking-status = Ele ŋuɖoɖoa kpɔm
answer-submitting-status = Ele ŋuɖoɖoa ɖom ɖa
answer-correct = Esɔ
answer-incorrect = Mesɔ o
answer-response-saved = Woɖo Ŋuɖoɖoa Ɖi
answer-percent-credit = Dzesi { $percent }%
answer-percent-correct = { $percent }% Sɔ
answer-percent-short = { $percent } %
max-credit-available = Dzesi gãtɔ si woate ŋu axɔ: { $percent }%
attempts-remaining =
    { $count ->
        [0] agbagbadzedze aɖeke mesusɔ o
       *[other] agbagbadzedze { $count } susɔ
    }
validation-correct = (Esɔ)
validation-incorrect = (Mesɔ o)
validation-partially-correct = (Esɔ le akpa aɖe me)
answer-show-responses = Fia ŋuɖoɖo { $count } si woɖo ɖe { $answerId }

## Disclosure panels

feedback-heading = Nyaŋuɖoɖo
collapsible-click-to-open = (zi edzi be nàʋui)
collapsible-click-to-close = (zi edzi be nàtui)
collapsible-initializing = Ele gɔmedzedzem...
footnote-show = Fia afɔnuŋɔŋlɔ
footnote-hide = Ɣla afɔnuŋɔŋlɔ
description-more-information = nyatakaka bubuwo

## Controls

slider-previous = Megbe
slider-next = Ŋgɔ
keyboard-open = Ʋu Fɛŋlɔdzesiawo
keyboard-close = Tu Fɛŋlɔdzesiawo
choice-input-remove-choice = Ɖe { $choice } ɖa
matrix-remove-row = Ɖe fli ɖa
matrix-add-row = Tsɔ fli kpe ɖe eŋu
matrix-remove-column = Ɖe sɔti ɖa
matrix-add-column = Tsɔ sɔti kpe ɖe eŋu
subset-add-remove-points = Tsɔ nɔƒe kpe ɖe eŋu/Ɖe wo ɖa
subset-toggle-points-intervals = Trɔ le nɔƒewo kple dometsotsowo dome
subset-move-points = Ʋu Nɔƒeawo
subset-clear = Tutu
# A `box` here is one orbital, drawn as a square: «aɖaka».
orbital-add-row = Tsɔ Fli Kpe Ɖe Eŋu
orbital-remove-row = Ɖe Fli Ɖa
orbital-add-box = Tsɔ Aɖaka Kpe Ɖe Eŋu
orbital-remove-box = Ɖe Aɖaka Ɖa
orbital-add-up-arrow = Tsɔ Aŋutrɔ Dziyimetɔ Kpe Ɖe Eŋu
orbital-add-down-arrow = Tsɔ Aŋutrɔ Anyiyimetɔ Kpe Ɖe Eŋu
orbital-remove-arrow = Ɖe Aŋutrɔ Ɖa
orbital-row-label = Fli { $row } ƒe ŋkɔ
pretzel-answer = Ŋuɖoɖo

## Math input

math-input-preview-region = akɔntabubu nyagbe ƒe ŋgɔdokpɔ
math-input-preview = Ŋgɔdokpɔ
math-input-invalid-expression = Nyagbea mesɔ o:

## Document status

viewer-initializing = Ele gɔmedzedzem...

## Errors

error-heading = Vodada
error-found-at =
    { $span ->
        [line] Wokpɔe le fli { $startLine } dzi.
       *[lines] Wokpɔe le fli { $startLine }–{ $endLine } dzi.
    }
document-contains-errors = Vodadawo le agbalẽ sia me!
diagnostic-heading-error = Vodada
diagnostic-heading-warning = Nuxlɔ̃ame
diagnostic-heading-information = Nyatakaka
diagnostic-heading-hint = Mɔfiame
accessibility-heading-level-1 = WCAG AA Sedzimawɔmawɔ le Ŋudɔwɔwɔ Ŋu
accessibility-heading-level-2 = Ŋudɔwɔwɔ ŋuti nuxlɔ̃ame
something-went-wrong = Nane meyi edzi nyuie o.
renderer-load-failed = nufiala ɖeka mete ŋu va o. Taflatse gaʋu axaa.
core-start-failed = Agbalẽ kpɔla la mete ŋu dze egɔme o. Taflatse gaʋu axaa.
