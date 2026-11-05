# Kabyle viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the script decision, the gender fork, and the
# annexed state.


## Answer submission

answer-checking = Asenqed…
answer-submitting = Tuzna…
answer-checking-status = Tiririt tettwasenqad
answer-submitting-status = Tiririt tettwazen
answer-correct = D ṣṣeḥ
answer-incorrect = Mačči d ṣṣeḥ
answer-response-saved = Tiririt tettwasekles
answer-percent-credit = { $percent }% n tenqiḍin
answer-percent-correct = { $percent }% d ṣṣeḥ
answer-percent-short = { $percent } %
max-credit-available = Tanqiḍin ugar i yellan: { $percent }%
attempts-remaining =
    { $count ->
        [0] ulac aɛraḍ i d-yeqqimen
        [one] yeqqim-d { $count } n uɛraḍ
       *[other] qqimen-d { $count } n yiɛraḍen
    }
validation-correct = (D ṣṣeḥ)
validation-incorrect = (Mačči d ṣṣeḥ)
validation-partially-correct = (D ṣṣeḥ s uḥric)
answer-show-responses =
    { $count ->
        [one] Sken { $count } n tririt i { $answerId }
       *[other] Sken { $count } n tririyin i { $answerId }
    }

## Disclosure panels

feedback-heading = Iwenniten
collapsible-click-to-open = (sit akken ad t-teldiḍ)
collapsible-click-to-close = (sit akken ad t-tmedleḍ)
collapsible-initializing = Asenker…
footnote-show = Sken tazmilt n wadda
footnote-hide = Ffer tazmilt n wadda
description-more-information = ugar n telɣut

## Controls

slider-previous = Uzwir
slider-next = Uḍfir
keyboard-open = Ldi anasiw
keyboard-close = Mdel anasiw
choice-input-remove-choice = Kkes { $choice }
matrix-remove-row = Kkes izirig
matrix-add-row = Rnu izirig
matrix-remove-column = Kkes tagejdit
matrix-add-column = Rnu tagejdit
subset-add-remove-points = Rnu/Kkes tinqiḍin
subset-toggle-points-intervals = Beddel tinqiḍin d wakuden
subset-move-points = Smutti tinqiḍin
subset-clear = Sfeḍ
orbital-add-row = Rnu izirig
orbital-remove-row = Kkes izirig
orbital-add-box = Rnu tanaka
orbital-remove-box = Kkes tanaka
orbital-add-up-arrow = Rnu taneccabt s ufella
orbital-add-down-arrow = Rnu taneccabt s wadda
orbital-remove-arrow = Kkes taneccabt
orbital-row-label = Tabzimt n yizirig { $row }
pretzel-answer = Tiririt

## Math input

math-input-preview-region = tamuɣli tazwarant n tenfalit tusnakt
math-input-preview = Tamuɣli tazwarant
math-input-invalid-expression = Tanfalit tarameɣtut:

## Document status

viewer-initializing = Asenker…

## Errors

error-heading = Tuccḍa
error-found-at =
    { $span ->
        [line] Tettwaf deg yizirig { $startLine }.
       *[lines] Tettwaf deg yizirigen { $startLine }–{ $endLine }.
    }
document-contains-errors = Isemli-agi yesɛa tuccḍiwin!
diagnostic-heading-error = Tuccḍa
diagnostic-heading-warning = Alɣu
diagnostic-heading-information = Talɣut
diagnostic-heading-hint = Taneɣruft
accessibility-heading-level-1 = Azgar WCAG AA n wanekcum
accessibility-heading-level-2 = Alɣu n wanekcum
something-went-wrong = Yella wayen ur nteddu ara akken iwata.
renderer-load-failed = amsken ur yezmir ara ad d-yali. Ttxil-k ales asali n usebter.
core-start-failed = Amsken n usemli ur yezmir ara ad yekker. Ttxil-k ales asali n usebter.
