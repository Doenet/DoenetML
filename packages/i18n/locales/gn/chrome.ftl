# Guarani viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Paraguayan Guarani, in the official orthography — the one the
# Ministerio de Educación uses and the one Guarani is co-official in.
#
# Where Guarani has no term of its own, this catalog writes the Spanish loan the
# *jopara* register actually uses rather than coining something. That is a choice
# about register, and it is the choice Paraguayan school materials make; a
# purist correction is a legitimate correction, and this note is here so whoever
# makes it knows they are changing register and not fixing an error.
#
# Guarani marks number with the optional suffix «-kuéra», and drops it after a
# numeral. So a counted message has one form and its select is dropped, keeping
# the `[0]` wording that names none, which is a different sentence rather than a
# different form.
#
# Nasal harmony decides the shape of several suffixes — «-kuéra» against
# «-nguéra», «-pe» against «-me» — according to whether the word before them is
# oral or nasal. That is the constraint the README calls "an affix cannot be
# welded to a placeable", and it is a sharper version of it than a case ending:
# the *choice* of allomorph depends on the value's last syllable. Nowhere in this
# catalog does such a suffix land on a placeable; where one was wanted, the value
# is named instead.


## Answer submission

answer-checking = Ohechajeýma…
answer-submitting = Omondóma…
answer-checking-status = Ohechajey pe mbohovái
answer-submitting-status = Omondo pe mbohovái
answer-correct = Oĩ porã
answer-incorrect = Naiporãi
answer-response-saved = Mbohovái ñongatupyre
answer-percent-credit = { $percent }% tepy
answer-percent-correct = { $percent }% oĩ porã
answer-percent-short = { $percent } %
max-credit-available = Tepy tuichavéva: { $percent }%
# No select: «ñeha'ã» takes no plural suffix after a numeral, so both English
# categories render the same words. The count still arrives and is still
# formatted. `[0]` stays, because "none left" is its own sentence.
attempts-remaining =
    { $count ->
        [0] ndaipóri véima ñeha'ã
       *[other] opyta { $count } ñeha'ã
    }
validation-correct = (Oĩ porã)
validation-incorrect = (Naiporãi)
validation-partially-correct = (Oĩ porã mbytemi)
# No select, for the reason given above. The answer is reached by naming it —
# «{ $answerId } hérava», "the one named X" — rather than by putting the dative
# on `$answerId`, whose shape nasal harmony would decide from a word this
# catalog never sees.
answer-show-responses = Ehecha { $count } mbohovái, { $answerId } hérava pyendápe

## Disclosure panels

feedback-heading = Ñe'ẽ jevy
collapsible-click-to-open = (eikutu ojepe'a haguã)
collapsible-click-to-close = (eikutu oñembotý haguã)
collapsible-initializing = Oñepyrũma…
footnote-show = Ehecha yvypegua jehaipy
footnote-hide = Emokañy yvypegua jehaipy
description-more-information = marandu hetave

## Controls

slider-previous = Mboyve
slider-next = Upéi
keyboard-open = Embojera pe teclado
keyboard-close = Emboty pe teclado
choice-input-remove-choice = Emboguete { $choice }
matrix-remove-row = Emboguete peteĩ tysỹi
matrix-add-row = Embojoapy peteĩ tysỹi
# «tysỹi» is the row; the column is the Spanish loan, which is what the register
# this catalog is written in uses. Guarani has no inherited term for it.
matrix-remove-column = Emboguete peteĩ kolúmna
matrix-add-column = Embojoapy peteĩ kolúmna
subset-add-remove-points = Embojoapy/Emboguete kyta
subset-toggle-points-intervals = Embojopyrũ kyta ha pa'ũ
subset-move-points = Emongu'e kyta
subset-clear = Emboguete
orbital-add-row = Embojoapy peteĩ tysỹi
orbital-remove-row = Emboguete peteĩ tysỹi
orbital-add-box = Embojoapy peteĩ karameguã
orbital-remove-box = Emboguete peteĩ karameguã
orbital-add-up-arrow = Embojoapy peteĩ hu'y yvate gotyo
orbital-add-down-arrow = Embojoapy peteĩ hu'y yvy gotyo
orbital-remove-arrow = Emboguete peteĩ hu'y
orbital-row-label = Tysỹi { $row } réra
pretzel-answer = Mbohovái

## Math input

math-input-preview-region = papapy ñe'ẽ jehecha mboyve
math-input-preview = Jehecha mboyve
math-input-invalid-expression = Ñe'ẽ naiporãiva:

## Document status

viewer-initializing = Oñepyrũma…

## Errors

error-heading = Javy
error-found-at =
    { $span ->
        [line] Ojejuhu tysỹi { $startLine } rehe.
       *[lines] Ojejuhu tysỹi { $startLine }–{ $endLine } rehe.
    }
document-contains-errors = Ko kuatia oguereko javy!
diagnostic-heading-error = Javy
diagnostic-heading-warning = Ñemomarandu
diagnostic-heading-information = Marandu
diagnostic-heading-hint = Ñepytyvõ
accessibility-heading-level-1 = WCAG AA jeikeha ñembyai
accessibility-heading-level-2 = Jeikeha ñemomarandu
something-went-wrong = Oĩ mba'e naiporãiva.
renderer-load-failed = peteĩ mba'erechaha ndoúi. Ikatúpa embojevy pe rogue.
core-start-failed = Kuatia rechaha ndaikatúi oñepyrũ. Ikatúpa embojevy pe rogue.
