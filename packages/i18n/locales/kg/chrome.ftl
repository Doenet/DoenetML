# Kongo viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the connective table, for what separates this
# catalog from `locales/ktu`, and for what a speaker should check first.


## Answer submission

answer-checking = Kufyongunuka…
answer-submitting = Kutinda…
answer-checking-status = Mvutu yifyongunukwanga
answer-submitting-status = Mvutu yitindwanga
answer-correct = Ya kyedika
answer-incorrect = Ya luvunu
answer-response-saved = Mvutu Yibumbulu
answer-percent-credit = { $percent }% ya Ntalu
answer-percent-correct = { $percent }% Ya kyedika
answer-percent-short = { $percent } %
max-credit-available = Ntalu yanene yilenda baka: { $percent }%
attempts-remaining =
    { $count ->
        [0] kuna ntonta ve
        [one] ntonta { $count } yasyala
       *[other] bintonta { $count } byasyala
    }
validation-correct = (Ya kyedika)
validation-incorrect = (Ya luvunu)
validation-partially-correct = (Ya kyedika mu ndambu)
answer-show-responses =
    { $count ->
        [one] Songa mvutu { $count } ya { $answerId }
       *[other] Songa mivutu { $count } ya { $answerId }
    }

## Disclosure panels

feedback-heading = Mvutu ya Kisalu
collapsible-click-to-open = (buta sambu na kuzibula)
collapsible-click-to-close = (buta sambu na kukanga)
collapsible-initializing = Kuyantika…
footnote-show = Songa nsonokono ya nsi
footnote-hide = Swekisa nsonokono ya nsi
description-more-information = nsangu zankaka

## Controls

slider-previous = Yavita
slider-next = Yalanda
keyboard-open = Zibula Klavye
keyboard-close = Kanga Klavye
choice-input-remove-choice = Katula { $choice }
matrix-remove-row = Katula nkonso
matrix-add-row = Yika nkonso
matrix-remove-column = Katula ntandu
matrix-add-column = Yika ntandu
subset-add-remove-points = Yika/Katula matona
subset-toggle-points-intervals = Soba matona ye bintangu
subset-move-points = Nikisa Matona
subset-clear = Katula byonso
orbital-add-row = Yika Nkonso
orbital-remove-row = Katula Nkonso
orbital-add-box = Yika Sanduku
orbital-remove-box = Katula Sanduku
orbital-add-up-arrow = Yika Nsonga ya Ntandu
orbital-add-down-arrow = Yika Nsonga ya Nsi
orbital-remove-arrow = Katula Nsonga
orbital-row-label = Nkumbu ya nkonso { $row }
pretzel-answer = Mvutu

## Math input

math-input-preview-region = mona ntete mvovo wa mitangu
math-input-preview = Mona ntete
math-input-invalid-expression = Mvovo wambi:

## Document status

viewer-initializing = Kuyantika…

## Errors

error-heading = Mbi
error-found-at =
    { $span ->
        [line] Yamonana va nsinga { $startLine }.
       *[lines] Yamonana va nsinga { $startLine }–{ $endLine }.
    }
document-contains-errors = Mukanda wawu wina ye mambi!
diagnostic-heading-error = Mbi
diagnostic-heading-warning = Nlubuka
diagnostic-heading-information = Nsangu
diagnostic-heading-hint = Lusadisu
accessibility-heading-level-1 = Mbundamusu ya WCAG AA mu Nswalu
accessibility-heading-level-2 = Nlubuka wa nswalu
something-went-wrong = Kima kyankaka kyabwa.
renderer-load-failed = nsongi kalendi kwiza ko. Vutukisa lukaya.
core-start-failed = Nsongi wa mukanda kalendi yantika ko. Vutukisa lukaya.
