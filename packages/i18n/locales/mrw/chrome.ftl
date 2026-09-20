# Maranao (Basa a Mëranaw) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **This is the thinnest of the four Philippine catalogs added with it, and
# it says so first rather than last.** Maranao is the language of the Lanao
# provinces in Mindanao, and the published lexical material a seed can reach
# is small and mostly religious and lexicographic rather than technical.
# **Almost every content word below is a declared loan.** What is Maranao here
# is the *frame* — the markers, the linker, the negators, a short list of
# function words and a handful of verbs — and a speaker should expect to
# rewrite sentences rather than to correct words inside them.
#
# **The schwa is written «ë» (U+00EB).** Maranao has four vowels — a, i, o and
# a mid central one — and the fourth is written here as **ë**, in «Mëranaw»,
# «maitëm», «pën», «pëkhagamit», «galëbëk», «madakël», «sëmbag». Print uses
# other conventions for the same vowel: a bare **e**, an **e'** with an
# apostrophe, and in older material a **u**. A reviewer who prefers one of
# those should **respell rather than retranslate**, and should respell all
# four files at once: a catalog that writes «pën» in one file and «pen» in
# another is unsearchable. The claim is checkable — no bare «e» carries the
# schwa anywhere in these files.
#
# **The Latin script is otherwise plain**: no other diacritic appears, and the
# glottal stop is not written.
#
# **The technical register is English, and it is a real register rather than a
# gap.** Lanao's schools teach mathematics and science in English, so the
# words a Maranao speaker uses for these things *are* the English ones. They
# are kept here as they stand — `point`, `line`, `graph`, `renderer`, `input`,
# `preview`, `row`, `column`, `keyboard`, `WCAG` — rather than respelled into
# an invented Maranao phonology. A few Filipino loans do the same job where
# Filipino rather than English is what is said: «alisën» (move), «punasën»
# (clear), «sarahën» (close), «sobok» (attempt). Every one of those is a loan
# and is named as one.
#
# **The verb morphology is the least certain thing in this catalog.** The seed
# writes «pëng-/pëk-/pëph-» for an ongoing action, «mi-/miya-» for a completed
# one and «-ën»/«-an» for an undergoer form. Those affixes are the first thing
# a speaker should correct, ahead of any word choice.
#
# **Two words to check first**, because they carry many messages each:
# «sëmbag» for *answer* and «kasalaan» for *error*. If either is wrong, it is
# wrong in dozens of places and one search fixes it.

answer-checking = Pëngilayn...
answer-submitting = Pësogoën...

answer-checking-status = Pëngilayn so sëmbag
answer-submitting-status = Pësogoën so sëmbag

answer-correct = Ontol
answer-incorrect = Di ontol

answer-response-saved = Miyatago so Sëmbag

answer-percent-credit = { $percent }% a kredito
answer-percent-correct = { $percent }% a ontol
answer-percent-short = { $percent } %

max-credit-available = Mala a kredito a khakowa: { $percent }%

attempts-remaining =
    { $count ->
        [0] da a somobra a sobok
       *[other] { $count } a sobok i somobra
    }

validation-correct = (Ontol)
validation-incorrect = (Di ontol)
validation-partially-correct = (Bagi a ontol)

answer-show-responses =
    { $count ->
       *[other] Pakiilayin so { $count } a sëmbag ko { $answerId }
    }

feedback-heading = Feedback

collapsible-click-to-open = (i-click a an malokaan)
collapsible-click-to-close = (i-click a an masarahan)

collapsible-initializing = Pëphoonan...

footnote-show = Pakiilayin so footnote
footnote-hide = Di pakiilayin so footnote

description-more-information = madakël a impormasyon

slider-previous = Miyaona
slider-next = Somonod

keyboard-open = Lokaan so Keyboard
keyboard-close = Sarahën so Keyboard

choice-input-remove-choice = Awaan so { $choice }

matrix-remove-row = Awaan so row
matrix-add-row = Omanan sa row
matrix-remove-column = Awaan so column
matrix-add-column = Omanan sa column

subset-add-remove-points = Omanan/Awaan so manga point
subset-toggle-points-intervals = Somambi ko manga point go manga interval
subset-move-points = Alisën so manga point
subset-clear = Punasën

orbital-add-row = Omanan sa row
orbital-remove-row = Awaan so row
orbital-add-box = Omanan sa box
orbital-remove-box = Awaan so box
orbital-add-up-arrow = Omanan sa up arrow
orbital-add-down-arrow = Omanan sa down arrow
orbital-remove-arrow = Awaan so arrow

orbital-row-label = Label ko row { $row }

pretzel-answer = Sëmbag


math-input-preview-region = preview o math expression
math-input-preview = Preview
math-input-invalid-expression = Di ontol a expression:

viewer-initializing = Pëphoonan...

error-heading = Kasalaan

error-found-at =
    { $span ->
        [line] Miyailay ko line { $startLine }.
       *[lines] Miyailay ko manga line { $startLine }–{ $endLine }.
    }

document-contains-errors = Aden a kasalaan ko sangkai a document!

diagnostic-heading-error = Kasalaan
diagnostic-heading-warning = Pakatanod
diagnostic-heading-information = Impormasyon
diagnostic-heading-hint = Hint

accessibility-heading-level-1 = Violation ko WCAG AA a Accessibility
accessibility-heading-level-2 = Pakatanod ko accessibility

something-went-wrong = Aden a miyasalaan.

renderer-load-failed = da makaload so isa a renderer. Ipa-reload sa so page.

core-start-failed = Di khagaga a phoonan so sangkai a document. Ipa-reload sa so page.

core-start-failed-busy = Di khagaga a phoonan so sangkai a document. Madakël a document i miyaphoonan a sama-sama, na mapëthagaan oto amay ka malëbod so aparato. Amay ka miyapasad den so manga salakaw a document, khatabang o kapaka-reload ko page.

core-start-failed-retry = Di khagaga a phoonan so sangkai a document.

core-start-failed-busy-retry = Di khagaga a phoonan so sangkai a document. Madakël a document i miyaphoonan a sama-sama, na mapëthagaan oto amay ka malëbod so aparato.

core-start-retry = Sobok pëman

saved-state-unavailable = Da makaload so miyatago a galëbëk ëngka.
