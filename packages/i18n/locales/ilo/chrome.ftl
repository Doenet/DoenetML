# Ilocano viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the modern Latin orthography Ilocano publishing and the Department
# of Education's mother-tongue materials use.
#
# Ilocano does not mark number on the noun. Plurality is carried by the article
# — «ti» against «dagiti» — and a noun after a numeral stays singular, so a
# `{ $count -> … }` whose only English difference is the noun's number renders
# one string here and the select is dropped. The count still arrives and is
# still formatted. A `[0]` branch stays wherever English has one: "none left" is
# its own sentence rather than a form of the sentence beside it.
#
# The **linker** is this catalog's one recurring decision. An attributive
# adjective is joined to its noun by «nga» before a vowel and «a» before a
# consonant, and which one is right is decided by the word *after* it. Where
# that word is one this catalog writes, the linker is written out; where it
# would land in front of a placeable — an author's own answer name, a choice's
# text — the sentence is built so that no linker is needed at all. See the
# header of `content.ftl`, where the same constraint decides the shape of every
# composition message.


## Answer submission

answer-checking = Sursukimaten…
answer-submitting = Ipatpatulod…
answer-checking-status = Sursukimaten ti sungbat
answer-submitting-status = Ipatpatulod ti sungbat
answer-correct = Husto
answer-incorrect = Saan a husto
answer-response-saved = Naidulin ti sungbat
answer-percent-credit = { $percent }% a kredito
answer-percent-correct = { $percent }% a husto
answer-percent-short = { $percent } %
max-credit-available = Kangatuan a kredito a magun-od: { $percent }%
# No select: «padas» is the same word for one and for many — the number in front
# of it does the work — so both English categories render one string here. The
# `[0]` branch stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] awanen ti nabati a padas
       *[other] { $count } ti nabati a padas
    }
validation-correct = (Husto)
validation-incorrect = (Saan a husto)
validation-partially-correct = (Husto iti paset)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated, so the sentence reaches it through «iti»
# rather than through a linker whose shape that name would decide.
answer-show-responses = Ipakita ti { $count } a sungbat iti { $answerId }

## Disclosure panels

feedback-heading = Komento
collapsible-click-to-open = (pinduten tapno maluktan)
collapsible-click-to-close = (pinduten tapno mairikep)
collapsible-initializing = Mangrugrugi…
footnote-show = Ipakita ti footnote
footnote-hide = Ilemmeng ti footnote
description-more-information = ad-adu pay nga impormasion

## Controls

slider-previous = Napalabas
slider-next = Sumaruno
keyboard-open = Luktan ti teklado
keyboard-close = Irikep ti teklado
# `$choice` is the choice's own text and is never translated. It follows «ti»,
# so no linker has to agree with a word this catalog has not seen.
choice-input-remove-choice = Ikkaten ti { $choice }
matrix-remove-row = Ikkaten ti intar
matrix-add-row = Mangnayon iti intar
matrix-remove-column = Ikkaten ti adigi
matrix-add-column = Mangnayon iti adigi
subset-add-remove-points = Mangnayon/Mangikkat kadagiti punto
subset-toggle-points-intervals = Agbaliw kadagiti punto ken interbalo
subset-move-points = Iyalis dagiti punto
subset-clear = Dalusan
orbital-add-row = Mangnayon iti intar
orbital-remove-row = Ikkaten ti intar
orbital-add-box = Mangnayon iti kahon
orbital-remove-box = Ikkaten ti kahon
orbital-add-up-arrow = Mangnayon iti pana nga agpangato
orbital-add-down-arrow = Mangnayon iti pana nga agpababa
orbital-remove-arrow = Ikkaten ti pana
orbital-row-label = Etiketa para iti intar { $row }
pretzel-answer = Sungbat

## Math input

math-input-preview-region = pagsakbayan ti ekspresion a matematika
math-input-preview = Pagsakbayan
math-input-invalid-expression = Imbalido nga ekspresion:

## Document status

viewer-initializing = Mangrugrugi…

## Errors

error-heading = Biddut
# `$startLine` and `$endLine` are line numbers and arrive as text.
error-found-at =
    { $span ->
        [line] Nasarakan iti linia { $startLine }.
       *[lines] Nasarakan kadagiti linia { $startLine }–{ $endLine }.
    }
document-contains-errors = Adda biddut daytoy a dokumento!
diagnostic-heading-error = Biddut
diagnostic-heading-warning = Ballaag
diagnostic-heading-information = Impormasion
diagnostic-heading-hint = Palagip
accessibility-heading-level-1 = Panaglabsing iti aksesibilidad a WCAG AA
accessibility-heading-level-2 = Ballaag maipapan iti aksesibilidad
something-went-wrong = Adda saan a nasayaat a napasamak.
renderer-load-failed = adda renderer a saan a naikarga. Pangngaasi ta i-reload ti panid.
core-start-failed = Saan a nairugi ti pagbuyaan ti dokumento. Pangngaasi ta i-reload ti panid.
