# Venda viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the orthography note — ḓ, ṱ, ṋ, ḽ and ṅ are
# not the plain letters — and for what a speaker should check first.


## Answer submission

answer-checking = Hu khou sedzwa…
answer-submitting = Hu khou rumelwa…
answer-checking-status = Phindulo i khou sedzwa
answer-submitting-status = Phindulo i khou rumelwa
answer-correct = Zwo luga
answer-incorrect = A zwo ngo luga
answer-response-saved = Phindulo yo Vhulungwa
answer-percent-credit = { $percent }% ya Mavhege
answer-percent-correct = { $percent }% zwo Luga
answer-percent-short = { $percent } %
max-credit-available = Mavhege mahulwane a wanalaho: { $percent }%
attempts-remaining =
    { $count ->
        [0] a hu na u lingedza ho salaho
        [one] ho sala u lingedza ha { $count }
       *[other] ho sala u lingedza ha { $count }
    }
validation-correct = (Zwo luga)
validation-incorrect = (A zwo ngo luga)
validation-partially-correct = (Zwo luga nga tshipiḓa)
answer-show-responses =
    { $count ->
        [one] Sumbedza phindulo { $count } kha { $answerId }
       *[other] Sumbedza dziphindulo { $count } kha { $answerId }
    }

## Disclosure panels

feedback-heading = Mbuyedzedzo
collapsible-click-to-open = (puṱedza u vula)
collapsible-click-to-close = (puṱedza u vala)
collapsible-initializing = Hu khou thoma…
footnote-show = Sumbedza ṋowuthu ya fhasi
footnote-hide = Dzumba ṋowuthu ya fhasi
description-more-information = mafhungo manzhi

## Controls

slider-previous = Zwo fhiraho
slider-next = Zwi tevhelaho
keyboard-open = Vula Khiibodo
keyboard-close = Vala Khiibodo
choice-input-remove-choice = Bvisa { $choice }
matrix-remove-row = Bvisa mutalo
matrix-add-row = Engedza mutalo
matrix-remove-column = Bvisa kholomo
matrix-add-column = Engedza kholomo
subset-add-remove-points = Engedza/Bvisa dziphoinnti
subset-toggle-points-intervals = Shandukisa dziphoinnti na zwifhinga
subset-move-points = Pfulusa Dziphoinnti
subset-clear = Phumula
orbital-add-row = Engedza Mutalo
orbital-remove-row = Bvisa Mutalo
orbital-add-box = Engedza Bogisi
orbital-remove-box = Bvisa Bogisi
orbital-add-up-arrow = Engedza Musevhe wa Nṱha
orbital-add-down-arrow = Engedza Musevhe wa Fhasi
orbital-remove-arrow = Bvisa Musevhe
orbital-row-label = Dzina ḽa mutalo { $row }
pretzel-answer = Phindulo

## Math input

math-input-preview-region = u sedza hu saathu ha mubvumo wa mbalo
math-input-preview = U sedza hu saathu
math-input-invalid-expression = Mubvumo wo khakheaho:

## Document status

viewer-initializing = Hu khou thoma…

## Errors

error-heading = Vhukhakhi
error-found-at =
    { $span ->
        [line] Ho wanala kha mutalo { $startLine }.
       *[lines] Ho wanala kha mitalo { $startLine }–{ $endLine }.
    }
document-contains-errors = Ḽiṅwalo iḽi ḽi na vhukhakhi!
diagnostic-heading-error = Vhukhakhi
diagnostic-heading-warning = Tsevho
diagnostic-heading-information = Mafhungo
diagnostic-heading-hint = Nyeletshedzo
accessibility-heading-level-1 = U Pfuka ha WCAG AA ha U Swikelela
accessibility-heading-level-2 = Tsevho ya u swikelela
something-went-wrong = Hu na tshine tsha si tshimbile zwavhuḓi.
renderer-load-failed = tshisumbedzi a tsho ngo kona u lodiwa. Ri humbela ni lode siaṱari hafhu.
core-start-failed = Tshisumbedzi tsha ḽiṅwalo a tsho ngo kona u thoma. Ri humbela ni lode siaṱari hafhu.
