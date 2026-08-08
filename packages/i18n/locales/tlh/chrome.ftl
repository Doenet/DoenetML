# Klingon viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# See `locales/tlh/content.ftl` for the rule this catalog is built on — a
# compound of canon words is written, a new root is not — and for why the roster
# has a constructed language in it at all.
#
# **This file is the most complete of the four, and that is not an accident.**
# Klingon's lexicon is rich in verbs of acting and judging and empty of nouns
# for mathematics and for the parts of a document. The chrome is buttons, and a
# button is a verb: «yIchov» (evaluate it), «yIteq» (remove it), «yIchel» (add
# it). So nearly all of it can be written, where `content.ftl` and
# `diagnostics.ftl` have to leave a great deal to English.
#
# Klingon is verb-final and object-initial, so what English puts after the verb
# comes before it here — «{ $choice } yIteq», not the other way round.
#
# The imperative prefix is «yI-» for one thing acted on. It is used throughout
# rather than the bare stem: a Klingon verb without a prefix is a statement, and
# a button is an order.
#
# «-lu'» is the indefinite subject — «one does it», which is how Klingon says
# what English says with the passive. It is what makes «chovlu'taH» (it is being
# evaluated) a sentence with nobody in it, which is what a status line wants.
#
# Klingon has no noun for *answer* or *response*. «jang» is the verb, and the
# messages below are written around it rather than through a coined noun.


## Answer submission

answer-checking = chovlu'taH…
answer-submitting = ngeHlu'taH…

answer-checking-status = jang chovlu'taH
answer-submitting-status = jang ngeHlu'taH

answer-correct = lugh
answer-incorrect = lughbe'

# «pol» is «keep, save»; «-ta'» marks it done on purpose.
answer-response-saved = pollu'ta'

# «pop» is «reward», which is what credit is.
answer-percent-credit = { $percent }% pop
answer-percent-correct = { $percent }% lugh
answer-percent-short = { $percent } %

max-credit-available = Suqlu'laHbogh pop: { $percent }%

# No select. Klingon marks no number on a noun, so «nID» is one attempt and
# many alike, and «ratlh» (remain) puts its subject after it. The `[0]` branch
# stays, because «pagh» names none rather than counting.
attempts-remaining =
    { $count ->
        [0] ratlh pagh nID
       *[other] ratlh { $count } nID
    }

validation-correct = (lugh)
validation-incorrect = (lughbe')
validation-partially-correct = ('op lugh)

# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated; «-vaD» sits on it unchanged, which is what
# `content.ftl`'s header means about Klingon suffixes having one shape each.
answer-show-responses = { $answerId }vaD { $count } jang yI'ang


## Disclosure panels

# «qeS» is «advice». `hint-title` in `content.ftl` takes «boQ» (aid) so that the
# two headings stay apart.
feedback-heading = qeS

# «yuv» is «push», which is what a click is; «-meH» opens the purpose clause
# that says what pushing is for.
collapsible-click-to-open = (poSmoHmeH yIyuv)
collapsible-click-to-close = (SoQmoHmeH yIyuv)

# «tagh» is «begin» and «-lI'» marks it under way toward a known end.
collapsible-initializing = taghlI'…

# «bIng QIn» — «the message below» — is this file's own compound for a
# footnote, from two canon words.
footnote-show = bIng QIn yI'ang
footnote-hide = bIng QIn yISo'

description-more-information = De' latlh


## Controls

# «veb» is «be next»; «vebHa'» is formed with the canon reversative «-Ha'», as
# `paginator-previous` is, because Klingon has no word for *previous*.
slider-previous = vebHa'
slider-next = veb

# «ghItlhwI'» is «writing instrument», which is the nearest canon word to a
# keyboard.
keyboard-open = ghItlhwI' yIpoSmoH
keyboard-close = ghItlhwI' yISoQmoH

choice-input-remove-choice = { $choice } yIteq

# «tlhegh» is a line of things, and «chal tlhegh» — a sky-line — is this file's
# own for a column, the same vertical metaphor `fill-style` uses in
# `content.ftl`.
matrix-remove-row = tlhegh yIteq
matrix-add-row = tlhegh yIchel
matrix-remove-column = chal tlhegh yIteq
matrix-add-column = chal tlhegh yIchel

# Left to English. A subset of the reals is mathematics, and the four controls
# name operations on one; see `content.ftl` on why this catalog does not coin
# a mathematical vocabulary.

# «ngaSwI'» is «container», formed from the canon «ngaS» (contain). «Dung» and
# «bIng» are the areas above and below, which is which way an arrow points.
orbital-add-row = tlhegh yIchel
orbital-remove-row = tlhegh yIteq
orbital-add-box = ngaSwI' yIchel
orbital-remove-box = ngaSwI' yIteq
orbital-add-up-arrow = Dung tIH yIchel
orbital-add-down-arrow = bIng tIH yIchel
orbital-remove-arrow = tIH yIteq

orbital-row-label = { $row } tlhegh pong

pretzel-answer = jang


## Math input

# «mu'tlhegh» is «sentence» and «muj» is «be wrong», so an expression the parser
# could not read is a sentence that is wrong. The two preview keys are left to
# English: *preview* is a root, not a description.
math-input-invalid-expression = mujbogh mu'tlhegh:


## Document status

viewer-initializing = taghlI'…


## Errors

error-heading = Qagh

# «tu'lu'» is «one finds it», Klingon's way of saying *was found*; the locative
# «-Daq» sits on «tlhegh» rather than on the line number, and the verb comes
# last as it does in every Klingon sentence.
error-found-at =
    { $span ->
        [line] { $startLine } tlheghDaq tu'lu'.
       *[lines] { $startLine }–{ $endLine } tlheghmeyDaq tu'lu'.
    }

document-contains-errors = Qaghmey ngaS ghItlhvam!

# «ghuHmoHwI'» — «that which warns» — is this file's own, from the canon
# «ghuHmoH» (warn). The two accessibility headings are left to English: there is
# no canon word for accessibility, and WCAG AA is the standard's name and would
# stay as it is in any case.
diagnostic-heading-error = Qagh
diagnostic-heading-warning = ghuHmoHwI'
diagnostic-heading-information = De'
diagnostic-heading-hint = boQ

something-went-wrong = qaS wanI' muj.

# «'angwI'» is «that which shows», for the renderer; «HaSta» is a visual
# display, and «chu'qa'» is «activate it again».
renderer-load-failed = taghbe' 'angwI'. HaSta yIchu'qa'.

core-start-failed = taghlaHbe' ghItlh 'angwI'. HaSta yIchu'qa'.
