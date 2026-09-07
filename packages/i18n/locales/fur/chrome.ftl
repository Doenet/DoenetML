# Friulian (furlan) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file writes the **grafie uficiâl** — the official
# spelling the Regjon Autonome Friûl Vignesie Julie and ARLeF publish in — and
# not any of the older conventions. Three things in it are spelling rather than
# decoration: the circumflex marks a long vowel and distinguishes words
# («lât» ≠ «lat», «vôs» ≠ «vos»); «ç» is a letter of the alphabet; and the
# digraphs «cj» and «gj» are two letters each and are never respelled «ci» or
# «gi». A corrector who drops the circumflexes is not simplifying the file, it
# is writing a different word.
#
# **This is a standard over a spread of varieties**, in the shape `locales/sc`
# and `locales/rm` already record: the koine ARLeF publishes in, not Carnic,
# not Western, not the Gorizian varieties. A deployment that wants one supplies
# its own catalog as `localeResources`; correcting this file toward a variety
# sentence by sentence would leave it in two standards at once.
#
# **Number.** CLDR has plural rules for `fur` — `one` and `other` — so a
# category branch here is selected by Friulian's own rules. Friulian marks the
# plural on the noun (`-s`, and the palatalizing plural in `-e` → `-is`), so
# the split English draws is a real one and is written out.
#
# **Italian is the contact language and the medium of schooling**, which is
# what the chemistry note in `content.ftl` turns on.


## Answer submission

answer-checking = Daûr a controlâ…
answer-submitting = Daûr a mandâ…
answer-checking-status = Daûr a controlâ la rispueste
answer-submitting-status = Daûr a mandâ la rispueste
answer-correct = Just
answer-incorrect = Sbaliât
answer-response-saved = Rispueste salvade
answer-percent-credit = { $percent }% di pont
answer-percent-correct = { $percent }% just
answer-percent-short = { $percent } %
max-credit-available = Massim di ponts disponibii: { $percent }%
attempts-remaining =
    { $count ->
        [0] nissun tentatîf restât
        [one] { $count } tentatîf restât
       *[other] { $count } tentatîfs restâts
    }
validation-correct = (Just)
validation-incorrect = (Sbaliât)
validation-partially-correct = (In part just)
answer-show-responses =
    { $count ->
        [one] Mostre { $count } rispueste a { $answerId }
       *[other] Mostre { $count } rispuestis a { $answerId }
    }

## Disclosure panels

feedback-heading = Coment
collapsible-click-to-open = (frache par vierzi)
collapsible-click-to-close = (frache par sierâ)
collapsible-initializing = Daûr a inviâ…
footnote-show = Mostre la note a pît di pagjine
footnote-hide = Plate la note a pît di pagjine
description-more-information = plui informazions

## Controls

slider-previous = Precedent
slider-next = Prossim
keyboard-open = Vierç la tastiere
keyboard-close = Siere la tastiere
choice-input-remove-choice = Gjave { $choice }
matrix-remove-row = Gjave une rie
matrix-add-row = Zonte une rie
matrix-remove-column = Gjave une colone
matrix-add-column = Zonte une colone
subset-add-remove-points = Zonte / gjave ponts
subset-toggle-points-intervals = Cambie tra ponts e intervai
subset-move-points = Môf i ponts
subset-clear = Nete
orbital-add-row = Zonte une rie
orbital-remove-row = Gjave une rie
orbital-add-box = Zonte une casele
orbital-remove-box = Gjave une casele
orbital-add-up-arrow = Zonte une frece in sù
orbital-add-down-arrow = Zonte une frece in jù
orbital-remove-arrow = Gjave la frece
orbital-row-label = Etichete pe rie { $row }
pretzel-answer = Rispueste

## Math input

math-input-preview-region = anteprime de espression matematiche
math-input-preview = Anteprime
math-input-invalid-expression = Espression no valide:

## Document status

viewer-initializing = Daûr a inviâ…

## Errors

error-heading = Erôr
error-found-at =
    { $span ->
        [line] Cjatât te rie { $startLine }.
       *[lines] Cjatât tes riis { $startLine }–{ $endLine }.
    }
document-contains-errors = Chest document al à dentri dai erôrs!
diagnostic-heading-error = Erôr
diagnostic-heading-warning = Avertiment
diagnostic-heading-information = Informazion
diagnostic-heading-hint = Sugjeriment
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Violazion di acessibilitât WCAG AA
accessibility-heading-level-2 = Avîs di acessibilitât
something-went-wrong = Alc al è lât stuart.
renderer-load-failed = un modul di visualizazion no si è cjariât. Torne cjarie la pagjine.
core-start-failed = No si è rivâts a inviâ chest document. Torne cjarie la pagjine.
core-start-failed-busy = No si è rivâts a inviâ chest document. Plui documents a stavin partint intun colp, e su di une machine plui lente al pues tirâ plui a dilunc. Tornâ a cjariâ la pagjine al pues judâ cuant che chei altris documents a àn finît.
core-start-failed-retry = No si è rivâts a inviâ chest document.
core-start-failed-busy-retry = No si è rivâts a inviâ chest document. Plui documents a stavin partint intun colp, e su di une machine plui lente al pues tirâ plui a dilunc.
core-start-retry = Torne prove
saved-state-unavailable = No si è rivâts a cjariâ il to lavôr salvât.
