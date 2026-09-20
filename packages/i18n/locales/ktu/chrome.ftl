# Kituba viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for why this Bantu catalog writes no noun-class
# table, and for what a speaker should check first.


## Answer submission

answer-checking = Ke tala…
answer-submitting = Ke tinda…
answer-checking-status = Mvutu ke tadila
answer-submitting-status = Mvutu ke tindama
answer-correct = Ya kyeleka
answer-incorrect = Ya mbi
answer-response-saved = Mvutu Kubumbama
answer-percent-credit = { $percent }% ya Bapwe
answer-percent-correct = { $percent }% Ya kyeleka
answer-percent-short = { $percent } %
max-credit-available = Bapwe mingi ya kele: { $percent }%
attempts-remaining =
    { $count ->
        [0] kumeka ya kubikala kele ve
        [one] kumeka { $count } me bikala
       *[other] kumeka { $count } me bikala
    }
validation-correct = (Ya kyeleka)
validation-incorrect = (Ya mbi)
validation-partially-correct = (Ya kyeleka na kitini)
answer-show-responses =
    { $count ->
        [one] Songa mvutu { $count } na { $answerId }
       *[other] Songa bamvutu { $count } na { $answerId }
    }

## Disclosure panels

feedback-heading = Ntendula
collapsible-click-to-open = (fina sambu na kukangula)
collapsible-click-to-close = (fina sambu na kukanga)
collapsible-initializing = Ke yantika…
footnote-show = Songa nsangu ya nsi
footnote-hide = Bumba nsangu ya nsi
description-more-information = bansangu ya nkaka

## Controls

slider-previous = Ya ntete
slider-next = Ya nima
keyboard-open = Kangula Klavie
keyboard-close = Kanga Klavie
choice-input-remove-choice = Katula { $choice }
matrix-remove-row = Katula linya
matrix-add-row = Yika linya
matrix-remove-column = Katula kolone
matrix-add-column = Yika kolone
subset-add-remove-points = Yika/Katula bapwente
subset-toggle-points-intervals = Soba bapwente ti bitini
subset-move-points = Nikisa Bapwente
subset-clear = Katula yonso
orbital-add-row = Yika Linya
orbital-remove-row = Katula Linya
orbital-add-box = Yika Kesi
orbital-remove-box = Katula Kesi
orbital-add-up-arrow = Yika Nsonga ya Zulu
orbital-add-down-arrow = Yika Nsonga ya Nsi
orbital-remove-arrow = Katula Nsonga
orbital-row-label = Zina ya linya { $row }
pretzel-answer = Mvutu

## Math input

math-input-preview-region = kutala na ntwala ya batalu
math-input-preview = Kutala na ntwala
math-input-invalid-expression = Mbikudulu ya mbi:

## Document status

viewer-initializing = Ke yantika…

## Errors

error-heading = Mbi
error-found-at =
    { $span ->
        [line] Yo me monana na linya { $startLine }.
       *[lines] Yo me monana na balinya { $startLine }–{ $endLine }.
    }
document-contains-errors = Mukanda yai kele ti bambi!
diagnostic-heading-error = Mbi
diagnostic-heading-warning = Lukebisu
diagnostic-heading-information = Nsangu
diagnostic-heading-hint = Kidimbu
accessibility-heading-level-1 = Kulutisa WCAG AA ya Kukuma
accessibility-heading-level-2 = Lukebisu ya kukuma
something-went-wrong = Kima mosi me kwenda mbote ve.
renderer-load-failed = kisongi me kwisa ve. Pardo, vutukisa lutiti.
core-start-failed = Kisongi ya mukanda me yantika ve. Pardo, vutukisa lutiti.
