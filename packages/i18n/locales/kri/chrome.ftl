# Krio viewer chrome: buttons, panel headers, and other UI the reader interacts
# with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the orthography this catalog commits to, for
# what separates it from `locales/pcm`, and for what a speaker should check
# first. The short version: an English word that slipped back in unspelt is
# the failure to look for.


## Answer submission

answer-checking = De chɛk…
answer-submitting = De sɛn…
answer-checking-status = Wi de chɛk di ansa
answer-submitting-status = Wi de sɛn di ansa
answer-correct = I kɔrɛkt
answer-incorrect = I nɔ kɔrɛkt
answer-response-saved = Wi Dɔn Sev Yu Ansa
answer-percent-credit = { $percent }% Krɛdit
answer-percent-correct = { $percent }% Kɔrɛkt
answer-percent-short = { $percent } %
max-credit-available = Di mɔs krɛdit we yu kin gɛt: { $percent }%
attempts-remaining =
    { $count ->
        [0] nɔ tray lɛf
        [one] { $count } tray lɛf
       *[other] { $count } tray lɛf
    }
validation-correct = (I kɔrɛkt)
validation-incorrect = (I nɔ kɔrɛkt)
validation-partially-correct = (I kɔrɛkt smɔl)
answer-show-responses =
    { $count ->
        [one] Sho { $count } ansa fɔ { $answerId }
       *[other] Sho { $count } ansa fɔ { $answerId }
    }

## Disclosure panels

feedback-heading = Fidbak
collapsible-click-to-open = (klik fɔ opin)
collapsible-click-to-close = (klik fɔ klos)
collapsible-initializing = I de stat…
footnote-show = Sho di fut-not
footnote-hide = Ayd di fut-not
description-more-information = mɔ infɔmeshɔn

## Controls

slider-previous = Di wan we dɔn pas
slider-next = Nɛks
keyboard-open = Opin Kibɔd
keyboard-close = Klos Kibɔd
choice-input-remove-choice = Pul { $choice }
matrix-remove-row = Pul ro
matrix-add-row = Ad ro
matrix-remove-column = Pul kɔlum
matrix-add-column = Ad kɔlum
subset-add-remove-points = Ad/Pul pɔynt dɛn
subset-toggle-points-intervals = Chenj bitwin pɔynt ɛn intaval
subset-move-points = Muv Di Pɔynt Dɛn
subset-clear = Kliya
orbital-add-row = Ad Ro
orbital-remove-row = Pul Ro
orbital-add-box = Ad Bɔks
orbital-remove-box = Pul Bɔks
orbital-add-up-arrow = Ad Aro We Fes Ɔp
orbital-add-down-arrow = Ad Aro We Fes Dɔŋ
orbital-remove-arrow = Pul Aro
orbital-row-label = Nem fɔ ro { $row }
pretzel-answer = Ansa

## Math input

math-input-preview-region = privyu pan di mat ɛkspreshɔn
math-input-preview = Privyu
math-input-invalid-expression = Ɛkspreshɔn we nɔ kɔrɛkt:

## Document status

viewer-initializing = I de stat…

## Errors

error-heading = Ɛra
error-found-at =
    { $span ->
        [line] Wi si am pan layn { $startLine }.
       *[lines] Wi si am pan layn { $startLine }–{ $endLine }.
    }
document-contains-errors = Dis dɔkyumɛnt gɛt ɛra insay!
diagnostic-heading-error = Ɛra
diagnostic-heading-warning = Wɔnin
diagnostic-heading-information = Infɔ
diagnostic-heading-hint = Klu
accessibility-heading-level-1 = WCAG AA Aksɛsibiliti Vayoleshɔn
accessibility-heading-level-2 = Aksɛsibiliti alat
something-went-wrong = Sɔntin nɔ go fayn.
renderer-load-failed = wan rɛndara nɔ lod. Duya lod di pej bak.
core-start-failed = Di dɔkyumɛnt viwa nɔ ebul fɔ stat. Duya lod di pej bak.
