# Ojibwe viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Fiero double-vowel orthography; see `content.ftl`'s header for
# the dialect spread, the animate/inanimate gender, and the colour-table seam.
#
# **Ojibwe is the one language in this batch that actually marks number here**, so
# it is the one whose counted messages keep their selects. The inanimate plural is
# «-an»/«-oon» and the verb agrees with it too, so «bezhig» and several are two
# different sentences rather than one sentence with a different numeral. Every
# other catalog in this batch drops those selects; this one does not, and that is
# a fact about Ojibwe rather than about how carefully the files were written.
#
# Most of these strings are **verbs**, because Ojibwe says what is happening
# rather than naming a state: "it is being checked" rather than "checking". A
# button label that reads as a command is in the imperative, which is what a
# button is.


## Answer submission

answer-checking = Agindaaso…
answer-submitting = Izhinizha'igaade…
answer-checking-status = Agindaan nakwetamowin
answer-submitting-status = Izhinizha'amaw nakwetamowin
answer-correct = Gwayak
answer-incorrect = Gaawiin gwayak
answer-response-saved = Gii-asigina'igaade nakwetamowin
answer-percent-credit = { $percent }% dibaakonigewin
answer-percent-correct = { $percent }% gwayak
answer-percent-short = { $percent } %
max-credit-available = Gichi-dibaakonigewin ayaamagak: { $percent }%
# The select stays: the inanimate plural is marked and the verb agrees with it, so
# these really are three different sentences. `[0]` names none, which is a fourth.
attempts-remaining =
    { $count ->
        [0] gaawiin gegoo gagwedaagewin ishkwaasinoon
        [one] { $count } gagwedaagewin ishkwaamagad
       *[other] { $count } gagwedaagewinan ishkwaamagadoon
    }
validation-correct = (Gwayak)
validation-incorrect = (Gaawiin gwayak)
validation-partially-correct = (Aabita gwayak)
# The select stays, for the reason above. The answer is named with «ezhinikaazod»
# — "the one so called" — rather than possessed, because a possessive prefix's
# shape would be decided by `$answerId`.
answer-show-responses =
    { $count ->
        [one] Waabanda'iwe { $count } nakwetamowin, { $answerId } ezhinikaazod
       *[other] Waabanda'iwe { $count } nakwetamowinan, { $answerId } ezhinikaazod
    }

## Disclosure panels

feedback-heading = Nakwetamowin-wiindamaagewin
collapsible-click-to-open = (bagidin ji-baakinigaadeg)
collapsible-click-to-close = (bagidin ji-gibaakwa'igaadeg)
collapsible-initializing = Maajitaamagad…
footnote-show = Waabanda'iwe naabishkaan-ozhibii'igan
footnote-hide = Gaadoon naabishkaan-ozhibii'igan
description-more-information = nawaj wiindamaagewin

## Controls

slider-previous = Ishkweyaang
slider-next = Niigaan
keyboard-open = Baakinan mazina'iganaabik
keyboard-close = Gibaakwa'an mazina'iganaabik
choice-input-remove-choice = Webinan { $choice }
matrix-remove-row = Webinan bezhig shingishing
matrix-add-row = Agonan bezhig shingishing
matrix-remove-column = Webinan bezhig gaabawi
matrix-add-column = Agonan bezhig gaabawi
subset-add-remove-points = Agonan/Webinan mazina'igaansan
subset-toggle-points-intervals = Aanjitoon mazina'igaansan gaye dazhiwinan
subset-move-points = Ani-izhiwidoon mazina'igaansan
subset-clear = Gaasii'an
orbital-add-row = Agonan bezhig shingishing
orbital-remove-row = Webinan bezhig shingishing
orbital-add-box = Agonan bezhig makak
orbital-remove-box = Webinan bezhig makak
orbital-add-up-arrow = Agonan bezhig bikwak ishpiming
orbital-add-down-arrow = Agonan bezhig bikwak niisaayi'ii
orbital-remove-arrow = Webinan bezhig bikwak
orbital-row-label = Izhinikaazowin shingishing { $row }
pretzel-answer = Nakwetamowin

## Math input

math-input-preview-region = agindaasowin-ikidowin waabanda'iwewin
math-input-preview = Niigaan-waabanda'iwewin
math-input-invalid-expression = Gaawiin gwayak ikidowin:

## Document status

viewer-initializing = Maajitaamagad…

## Errors

error-heading = Bataadowin
error-found-at =
    { $span ->
        [line] Gii-mikigaade shingishing { $startLine } ishkwaandeg.
       *[lines] Gii-mikigaade shingishingoon { $startLine }–{ $endLine } ishkwaandeg.
    }
document-contains-errors = O'ow mazina'igan bataadowinan otayaanan!
diagnostic-heading-error = Bataadowin
diagnostic-heading-warning = Aakoziwin-wiindamaagewin
diagnostic-heading-information = Wiindamaagewin
diagnostic-heading-hint = Wiidookaagewin
accessibility-heading-level-1 = WCAG AA bimaadiziwin-bagidinigewin banaadaagewin
accessibility-heading-level-2 = Bagidinigewin-wiindamaagewin
something-went-wrong = Gegoo gaawiin gii-gwayakosesinoon.
renderer-load-failed = bezhig waabanda'iwewin gaawiin gii-dagoshinzinoon. Aanjitoon mazina'igan.
core-start-failed = Mazina'igan-waabanda'iwewin gaawiin gii-maajitaasinoon. Aanjitoon mazina'igan.
