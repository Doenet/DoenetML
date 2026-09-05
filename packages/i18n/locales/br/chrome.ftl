# Breton viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Breton counts in five plural categories — `one`, `two`, `few`, `many` and
# `other` — so every `{ $count -> … }` below is written out in full. The noun
# after a numeral stays singular, and what moves is the mutation the numeral
# puts on it: `two` softens (daou/div), while `few` covers 3, 4 and 9 and only
# 3 of those mutates, so that branch keeps the base form. `many` is the branch
# for multiples of a million, which is why it reads with «a» and a plural.


## Answer submission

answer-checking = O wiriañ…
answer-submitting = O kas…
answer-checking-status = O wiriañ ar respont
answer-submitting-status = O kas ar respont
answer-correct = Reizh
answer-incorrect = Direizh
answer-response-saved = Respont enrollet
answer-percent-credit = { $percent }% eus ar poentoù
answer-percent-correct = { $percent }% reizh
answer-percent-short = { $percent } %
max-credit-available = Poentoù uhelañ hegerz: { $percent }%
attempts-remaining =
    { $count ->
        [0] taol ebet a chom
        [one] { $count } taol a chom
        [two] { $count } daol a chom
        [few] { $count } taol a chom
        [many] { $count } a daolioù a chom
       *[other] { $count } taol a chom
    }
validation-correct = (Reizh)
validation-incorrect = (Direizh)
validation-partially-correct = (Reizh en un doare)
answer-show-responses =
    { $count ->
        [one] Diskouez { $count } respont da { $answerId }
        [two] Diskouez { $count } respont da { $answerId }
        [few] Diskouez { $count } respont da { $answerId }
        [many] Diskouez { $count } a respontoù da { $answerId }
       *[other] Diskouez { $count } respont da { $answerId }
    }

## Disclosure panels

feedback-heading = Evezhiadennoù
collapsible-click-to-open = (klikit evit digeriñ)
collapsible-click-to-close = (klikit evit serriñ)
collapsible-initializing = O kregiñ…
footnote-show = Diskouez an notenn traoñ-pajenn
footnote-hide = Kuzhat an notenn traoñ-pajenn
description-more-information = muioc'h a ditouroù

## Controls

slider-previous = A-raok
slider-next = War-lerc'h
keyboard-open = Digeriñ ar c'hlavier
keyboard-close = Serriñ ar c'hlavier
choice-input-remove-choice = Lemel { $choice }
matrix-remove-row = Lemel ul linenn
matrix-add-row = Ouzhpennañ ul linenn
matrix-remove-column = Lemel ur bann
matrix-add-column = Ouzhpennañ ur bann
subset-add-remove-points = Ouzhpennañ/lemel poentoù
subset-toggle-points-intervals = Tremen etre poentoù ha spasoù
subset-move-points = Dilec'hiañ ar poentoù
subset-clear = Skarzhañ
orbital-add-row = Ouzhpennañ ul linenn
orbital-remove-row = Lemel ul linenn
orbital-add-box = Ouzhpennañ ur voest
orbital-remove-box = Lemel ur voest
orbital-add-up-arrow = Ouzhpennañ ur bir war-grec'h
orbital-add-down-arrow = Ouzhpennañ ur bir war-zu an traoñ
orbital-remove-arrow = Lemel ur bir
orbital-row-label = Tikedenn evit al linenn { $row }
pretzel-answer = Respont

## Math input

math-input-preview-region = rakwel eus ar frazenn jedoniel
math-input-preview = Rakwel
math-input-invalid-expression = Frazenn direizh:

## Document status

viewer-initializing = O kregiñ…

## Errors

error-heading = Fazi
error-found-at =
    { $span ->
        [line] Kavet war al linenn { $startLine }.
       *[lines] Kavet war al linennoù { $startLine }–{ $endLine }.
    }
document-contains-errors = Fazioù zo en teul-mañ!
diagnostic-heading-error = Fazi
diagnostic-heading-warning = Diwall
diagnostic-heading-information = Titour
diagnostic-heading-hint = Kuzul
accessibility-heading-level-1 = Torr-reizh haezadusted WCAG AA
accessibility-heading-level-2 = Kemenn haezadusted
something-went-wrong = Un dra bennak a zo aet a-dreuz.
renderer-load-failed = un treser n'en deus ket gallet kargañ. Adkargit ar bajenn.
core-start-failed = N'eus ket bet gallet kregiñ gant gweler an teul. Adkargit ar bajenn.
