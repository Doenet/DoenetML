# Oromo viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Oromo has two plural categories, so the counted messages keep both branches.
# The noun takes the `-oota`/`-wwan` plural and the verb agrees with it —
# «yaaliin … hafeera» against «yaaliiwwan … hafaniiru» — so both halves of the
# sentence move and neither branch could stand for the other.


## Answer submission

answer-checking = Ilaalaa jira...
answer-submitting = Ergaa jira...
answer-checking-status = Deebii ilaalaa jira
answer-submitting-status = Deebii ergaa jira
answer-correct = Sirrii
answer-incorrect = Sirrii miti
answer-response-saved = Deebiin Olkaa'ameera
answer-percent-credit = Qabxii { $percent }%
answer-percent-correct = { $percent }% Sirrii
answer-percent-short = { $percent }%
max-credit-available = Qabxii ol'aanaa argamu: { $percent }%
attempts-remaining =
    { $count ->
        [0] yaaliin hafe hin jiru
        [one] yaaliin { $count } hafeera
       *[other] yaaliiwwan { $count } hafaniiru
    }
validation-correct = (Sirrii)
validation-incorrect = (Sirrii miti)
validation-partially-correct = (Gartokkoon sirrii)
answer-show-responses =
    { $count ->
        [one] Deebii { $count } kan { $answerId } agarsiisi
       *[other] Deebiiwwan { $count } kan { $answerId } agarsiisi
    }

## Disclosure panels

feedback-heading = Deebii Qajeelchaa
collapsible-click-to-open = (banuuf tuqi)
collapsible-click-to-close = (cufuuf tuqi)
collapsible-initializing = Jalqabaa jira...
footnote-show = Yaadannoo jalaa agarsiisi
footnote-hide = Yaadannoo jalaa dhoksi
description-more-information = odeeffannoo dabalataa

## Controls

slider-previous = Duubatti
slider-next = Fuulduratti
keyboard-open = Gabatee Qubee Bani
keyboard-close = Gabatee Qubee Cufi
choice-input-remove-choice = { $choice } haqi
matrix-remove-row = Tarree haqi
matrix-add-row = Tarree dabali
matrix-remove-column = Utubaa haqi
matrix-add-column = Utubaa dabali
subset-add-remove-points = Tuqaalee dabali/haqi
subset-toggle-points-intervals = Tuqaalee fi giddu-gala gidduu jijjiiri
subset-move-points = Tuqaalee Sochoosi
subset-clear = Haqi
# A `box` here is one orbital, drawn as a square: saanduqa.
orbital-add-row = Tarree Dabali
orbital-remove-row = Tarree Haqi
orbital-add-box = Saanduqa Dabali
orbital-remove-box = Saanduqa Haqi
orbital-add-up-arrow = Xiyya Ol Aanu Dabali
orbital-add-down-arrow = Xiyya Gad Aanu Dabali
orbital-remove-arrow = Xiyya Haqi
orbital-row-label = Mallattoo tarree { $row }
pretzel-answer = Deebii

## Math input

math-input-preview-region = duraa-ilaalcha ibsa herregaa
math-input-preview = Duraa-ilaalcha
math-input-invalid-expression = Ibsa sirrii hin taane:

## Document status

viewer-initializing = Jalqabaa jira...

## Errors

error-heading = Dogoggora
error-found-at =
    { $span ->
        [line] Sarara { $startLine } irratti argame.
       *[lines] Sararoota { $startLine }–{ $endLine } irratti argame.
    }
document-contains-errors = Barreeffamni kun dogoggora qaba!
diagnostic-heading-error = Dogoggora
diagnostic-heading-warning = Akeekkachiisa
diagnostic-heading-information = Odeeffannoo
diagnostic-heading-hint = Qajeelfama
accessibility-heading-level-1 = Sarbama Argamummaa WCAG AA
accessibility-heading-level-2 = Akeekkachiisa argamummaa
something-went-wrong = Wanti tokko sirriitti hin deemne.
renderer-load-failed = agarsiisaan tokko fe'amuu hin dandeenye. Maaloo fuula kana irra deebi'aa fe'aa.
core-start-failed = Agarsiisaan barreeffamaa jalqabuu hin dandeenye. Maaloo fuula kana irra deebi'aa fe'aa.
