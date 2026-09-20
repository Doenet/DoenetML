# Irish viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Irish counts in five plural categories — `one`, `two`, `few`, `many` and
# `other` — so every `{ $count -> … }` below is written out in full. What
# distinguishes them is not the ending on the noun but what the numeral does to
# the front of it: a noun after a numeral stays singular, is left alone after 1,
# is lenited after 2 to 6, and is eclipsed after «seacht» to «deich», which is
# the `many` branch. «iarracht» begins with a vowel, so only the eclipsis shows
# on it, as `n-`; «freagra» shows both, as «fhreagra» and «bhfreagra».


## Answer submission

answer-checking = Á sheiceáil…
answer-submitting = Á sheoladh…
answer-checking-status = An freagra á sheiceáil
answer-submitting-status = An freagra á sheoladh
answer-correct = Ceart
answer-incorrect = Mícheart
answer-response-saved = Freagra sábháilte
answer-percent-credit = { $percent }% creidiúna
answer-percent-correct = { $percent }% ceart
answer-percent-short = { $percent } %
max-credit-available = Uaschreidiúint atá ar fáil: { $percent }%
attempts-remaining =
    { $count ->
        [0] níl aon iarracht fágtha
        [one] { $count } iarracht fágtha
        [two] { $count } iarracht fágtha
        [few] { $count } iarracht fágtha
        [many] { $count } n-iarracht fágtha
       *[other] { $count } iarracht fágtha
    }
validation-correct = (Ceart)
validation-incorrect = (Mícheart)
validation-partially-correct = (Ceart go páirteach)
answer-show-responses =
    { $count ->
        [one] Taispeáin { $count } freagra ar { $answerId }
        [two] Taispeáin { $count } fhreagra ar { $answerId }
        [few] Taispeáin { $count } fhreagra ar { $answerId }
        [many] Taispeáin { $count } bhfreagra ar { $answerId }
       *[other] Taispeáin { $count } freagra ar { $answerId }
    }

## Disclosure panels

feedback-heading = Aiseolas
collapsible-click-to-open = (cliceáil chun oscailt)
collapsible-click-to-close = (cliceáil chun dúnadh)
collapsible-initializing = Á thúsú…
footnote-show = Taispeáin an fonóta
footnote-hide = Folaigh an fonóta
description-more-information = tuilleadh eolais

## Controls

slider-previous = Siar
slider-next = Ar aghaidh
keyboard-open = Oscail an méarchlár
keyboard-close = Dún an méarchlár
choice-input-remove-choice = Bain { $choice }
matrix-remove-row = Bain ró
matrix-add-row = Cuir ró leis
matrix-remove-column = Bain colún
matrix-add-column = Cuir colún leis
subset-add-remove-points = Cuir pointí leis / bain pointí
subset-toggle-points-intervals = Scoránaigh idir pointí agus eatraimh
subset-move-points = Bog na pointí
subset-clear = Glan
orbital-add-row = Cuir ró leis
orbital-remove-row = Bain ró
orbital-add-box = Cuir bosca leis
orbital-remove-box = Bain bosca
orbital-add-up-arrow = Cuir saighead suas leis
orbital-add-down-arrow = Cuir saighead síos leis
orbital-remove-arrow = Bain saighead
orbital-row-label = Lipéad don ró { $row }
pretzel-answer = Freagra

## Math input

math-input-preview-region = réamhamharc ar an slonn matamaitice
math-input-preview = Réamhamharc
math-input-invalid-expression = Slonn neamhbhailí:

## Document status

viewer-initializing = Á thúsú…

## Errors

error-heading = Earráid
error-found-at =
    { $span ->
        [line] Aimsíodh ar líne { $startLine } é.
       *[lines] Aimsíodh ar línte { $startLine }–{ $endLine } é.
    }
document-contains-errors = Tá earráidí sa cháipéis seo!
diagnostic-heading-error = Earráid
diagnostic-heading-warning = Rabhadh
diagnostic-heading-information = Eolas
diagnostic-heading-hint = Leid
accessibility-heading-level-1 = Sárú inrochtaineachta WCAG AA
accessibility-heading-level-2 = Foláireamh inrochtaineachta
something-went-wrong = Chuaigh rud éigin amú.
renderer-load-failed = theip ar rindreálaí a lódáil. Athlódáil an leathanach, le do thoil.
core-start-failed = Níorbh fhéidir amharcán na cáipéise a thosú. Athlódáil an leathanach, le do thoil.
