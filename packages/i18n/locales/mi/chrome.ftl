# Māori viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The macron is part of the spelling, not decoration: «mātotoru» and «matotoru»
# are different words. Every long vowel here is written with one, and a
# correction that strips them is a mis-spelling rather than a simplification.
#
# Māori marks number on the **article** rather than on the noun — «te rārangi»
# one line, «ngā rārangi» many — so a count in front of a noun changes nothing
# about the noun itself, and the counted messages here need no selection even
# though CLDR gives Māori two plural categories. `[0]` is still spelled out
# where the English wording changes for zero.


## Answer submission

answer-checking = Kei te tirotiro...
answer-submitting = Kei te tuku...
answer-checking-status = Kei te tirotiro i te whakautu
answer-submitting-status = Kei te tuku i te whakautu
answer-correct = Tika
answer-incorrect = Hē
answer-response-saved = Kua tiakina te whakautu
answer-percent-credit = { $percent }% o te kaute
answer-percent-correct = { $percent }% tika
answer-percent-short = { $percent }%
max-credit-available = Te kaute mōrahi e wātea ana: { $percent }%
attempts-remaining =
    { $count ->
        [0] kāore he ngana e toe ana
       *[other] e toe ana { $count } ngana
    }
validation-correct = (Tika)
validation-incorrect = (Hē)
validation-partially-correct = (Tika ā-wāhanga)
answer-show-responses = Whakaaturia ngā whakautu { $count } ki { $answerId }

## Disclosure panels

feedback-heading = Urupare
collapsible-click-to-open = (pāwhiri kia whakatuwhera)
collapsible-click-to-close = (pāwhiri kia kati)
collapsible-initializing = Kei te tīmata...
footnote-show = Whakaaturia te tuhinga waewae
footnote-hide = Hunaia te tuhinga waewae
description-more-information = ētahi atu mōhiohio

## Controls

slider-previous = Mua
slider-next = Muri
keyboard-open = Whakatuwheratia te papapātuhi
keyboard-close = Katia te papapātuhi
choice-input-remove-choice = Tangohia { $choice }
matrix-remove-row = Tangohia te rārangi
matrix-add-row = Tāpirihia he rārangi
matrix-remove-column = Tangohia te tīwae
matrix-add-column = Tāpirihia he tīwae
subset-add-remove-points = Tāpiri/Tango ira
subset-toggle-points-intervals = Whakawhitia ngā ira me ngā āwhe
subset-move-points = Nekehia ngā ira
subset-clear = Ūkuia
orbital-add-row = Tāpirihia he rārangi
orbital-remove-row = Tangohia te rārangi
orbital-add-box = Tāpirihia he pouaka
orbital-remove-box = Tangohia te pouaka
orbital-add-up-arrow = Tāpirihia he pere whakarunga
orbital-add-down-arrow = Tāpirihia he pere whakararo
orbital-remove-arrow = Tangohia te pere
orbital-row-label = Tapanga mō te rārangi { $row }
pretzel-answer = Whakautu

## Math input

math-input-preview-region = arokite o te kīanga pāngarau
math-input-preview = Arokite
math-input-invalid-expression = Kīanga muhu:

## Document status

viewer-initializing = Kei te tīmata...

## Errors

error-heading = Hapa
error-found-at =
    { $span ->
        [line] I kitea i te rārangi { $startLine }.
       *[lines] I kitea i ngā rārangi { $startLine }–{ $endLine }.
    }
document-contains-errors = He hapa kei roto i tēnei tuhinga!
diagnostic-heading-error = Hapa
diagnostic-heading-warning = Whakatūpato
diagnostic-heading-information = Mōhiohio
diagnostic-heading-hint = Tohutohu
accessibility-heading-level-1 = Takahitanga urunga WCAG AA
accessibility-heading-level-2 = Whakatūpato urunga
something-went-wrong = I hē tētahi mea.
renderer-load-failed = kāore tētahi kaiwhakaatu i uta. Tēnā, utaina anō te whārangi.
core-start-failed = Kāore i taea te tīmata i te kaitirotiro tuhinga. Tēnā, utaina anō te whārangi.
