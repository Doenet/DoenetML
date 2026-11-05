# Swati viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for how this catalog stands beside `locales/zu`
# and `locales/xh`, and for what a speaker should check first.


## Answer submission

answer-checking = Kuyahlolwa…
answer-submitting = Kuyatfunyelwa…
answer-checking-status = Kuhlolwa imphendvulo
answer-submitting-status = Kutfunyelwa imphendvulo
answer-correct = Kulungile
answer-incorrect = Akulungile
answer-response-saved = Imphendvulo Igciniwe
answer-percent-credit = { $percent }% Wemamaki
answer-percent-correct = { $percent }% Kulungile
answer-percent-short = { $percent } %
max-credit-available = Emamaki lamaningi lakhona: { $percent }%
attempts-remaining =
    { $count ->
        [0] akusekho kuzama lokusele
        [one] kusele kuzama lokungu-{ $count }
       *[other] kusele kuzama lokungu-{ $count }
    }
validation-correct = (Kulungile)
validation-incorrect = (Akulungile)
validation-partially-correct = (Kulungile ngalokwengcenye)
answer-show-responses =
    { $count ->
        [one] Khombisa imphendvulo lengu-{ $count } ku-{ $answerId }
       *[other] Khombisa timphendvulo letingu-{ $count } ku-{ $answerId }
    }

## Disclosure panels

feedback-heading = Imphendvulo yekucondzisa
collapsible-click-to-open = (chafata kute uvule)
collapsible-click-to-close = (chafata kute uvale)
collapsible-initializing = Kuyacalwa…
footnote-show = Khombisa inothi langaphansi
footnote-hide = Fihla inothi langaphansi
description-more-information = lwati loluchubekako

## Controls

slider-previous = Kwendlulile
slider-next = Kulandzelako
keyboard-open = Vula Ikhibhodi
keyboard-close = Vala Ikhibhodi
choice-input-remove-choice = Susa { $choice }
matrix-remove-row = Susa umudvwa
matrix-add-row = Ngeta umudvwa
matrix-remove-column = Susa likholomu
matrix-add-column = Ngeta likholomu
subset-add-remove-points = Ngeta/Susa emaphuzu
subset-toggle-points-intervals = Guculula emaphuzu netikhatsi
subset-move-points = Khweshisa Emaphuzu
subset-clear = Sula
orbital-add-row = Ngeta Umudvwa
orbital-remove-row = Susa Umudvwa
orbital-add-box = Ngeta Libhokisi
orbital-remove-box = Susa Libhokisi
orbital-add-up-arrow = Ngeta Umcibisholo Wenhla
orbital-add-down-arrow = Ngeta Umcibisholo Wenzansi
orbital-remove-arrow = Susa Umcibisholo
orbital-row-label = Libito lomudvwa { $row }
pretzel-answer = Imphendvulo

## Math input

math-input-preview-region = kubukwa kwenkhulumo yetibalo
math-input-preview = Kubukwa
math-input-invalid-expression = Inkhulumo lengasiyo:

## Document status

viewer-initializing = Kuyacalwa…

## Errors

error-heading = Liphutsa
error-found-at =
    { $span ->
        [line] Litfolwe emudvweni { $startLine }.
       *[lines] Litfolwe emidvweni { $startLine }–{ $endLine }.
    }
document-contains-errors = Lomculu unemaphutsa!
diagnostic-heading-error = Liphutsa
diagnostic-heading-warning = Secwayiso
diagnostic-heading-information = Lwati
diagnostic-heading-hint = Sicondziso
accessibility-heading-level-1 = Kwephulwa Kwe-WCAG AA Kwekufinyeleleka
accessibility-heading-level-2 = Secwayiso sekufinyeleleka
something-went-wrong = Kukhona lokungahambanga kahle.
renderer-load-failed = umkhombisi wehlulekile kulayisha. Sicela ulayishe likhasi kabusha.
core-start-failed = Umbukisi wemculu awukhonanga kucala. Sicela ulayishe likhasi kabusha.
