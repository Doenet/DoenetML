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
# compound of published words is written, a new root is not — for the three
# classes of source that rule means by *canon*, and for why the roster has a
# constructed language in it at all. Every word used here is from the first two
# classes: TKD and the other books, or Okrand's later `qep'a'`/`qepHom'a'`
# releases. Nothing in this file rests on a lone mailing-list post.
#
# **This file is the most complete of the four, and that is not an accident.**
# Klingon's lexicon is rich in verbs of acting and judging, and thin in nouns
# for the parts of a document. The chrome is buttons, and a button is a verb:
# «yIchov» (evaluate it), «yIteq» (remove it), «yIchel» (add it). So nearly all
# of it can be written, where `diagnostics.ftl` has to leave a great deal to
# English.
#
# Klingon is object–verb–subject, so what English puts after the verb comes
# before it here — «{ $choice } yIteq», not the other way round. An imperative
# has no spoken subject, which is why these messages end on the verb.
#
# The imperative prefix is «yI-» for one thing acted on. It is used throughout
# rather than the bare stem: a Klingon verb without a prefix is a statement, and
# a button is an order.
#
# «-lu'» is the indefinite subject — «one does it», which is how Klingon says
# what English says with the passive. It is what makes «chovlu'taH» (it is being
# evaluated) a sentence with nobody in it, which is what a status line wants.
#
# Klingon has no noun for *answer* or *response*; «jang» is the verb «answer,
# reply». The messages below put it in noun position anyway — «jang chovlu'taH»
# reads «the answer is being evaluated» — which is a liberty this seed takes
# rather than a canon pattern, and a speaker with a better construction should
# replace it. Coining a noun would have been the larger liberty.


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
# No select. Klingon marks no number on a noun after a numeral, so one form of
# «nID» serves every count, and «ratlh» (remain) puts its subject after it.
# «nID» is canon as the verb «attempt, try» and there is no noun for an
# attempt; standing it in noun position is the same liberty «jang» takes above.
# The `[0]` branch stays, because «pagh» names none rather than counting.
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

# «veb» is «be next» (KGT) and «vorgh» «be previous» (`qep'a'` 23); an earlier
# draft coined «vebHa'» for the second, which `content.ftl`'s paginator keys no
# longer do either.
slider-previous = vorgh
slider-next = veb
# «nItlh 'echlet» — «finger board» — is Okrand's own word for a computer
# keyboard, from the `qepHom'a'` list of 2014 rather than from TKD.
keyboard-open = nItlh 'echlet yIpoSmoH
keyboard-close = nItlh 'echlet yISoQmoH
choice-input-remove-choice = { $choice } yIteq
# «wev» and «war» are Okrand's words for a row and a column of a table or
# spreadsheet (`qepHom'a'` 2015), which is what a matrix is made of.
matrix-remove-row = wev yIteq
matrix-add-row = wev yIchel
matrix-remove-column = war yIteq
matrix-add-column = war yIchel

# Left to English. Klingon has a mathematics register — see `content.ftl` — but
# not this part of it: nothing published names an interval, a union or a
# complement, and the four controls name operations on those.

# «ngaSwI'» is «container» — «ngaS» (contain) with the agentive «-wI'», and
# attested in its own right rather than derived here. «Dung» and «bIng» are the
# TKD nouns for the areas above and below, which is which way an arrow points;
# «tIH» is an energy beam, standing in for the arrow itself.
orbital-add-row = wev yIchel
orbital-remove-row = wev yIteq
orbital-add-box = ngaSwI' yIchel
orbital-remove-box = ngaSwI' yIteq
orbital-add-up-arrow = Dung tIH yIchel
orbital-add-down-arrow = bIng tIH yIchel
orbital-remove-arrow = tIH yIteq
orbital-row-label = { $row } wev pong
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
# «ghuHmoHwI'» — «that which warns» — is this file's own, from the TKD
# «ghuHmoH» (warn). The two accessibility headings are left to English: nothing
# published names accessibility, and WCAG AA is the standard's name and would
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
