# Mizo (Mizo ṭawng) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, in the Roman orthography the Welsh mission fixed in 1894**
# and Mizoram has used ever since. Mizo has never had another script, so
# nothing is at issue here that is at issue in `locales/mni` or `locales/brx`:
# the only orthographic decisions are diacritic ones. This catalog writes the
# circumflex on the long vowels (â ê î ô û) and the **subscript-dotted ṭ**
# (U+1E6D / U+1E6C) that distinguishes «ṭawng» from «tawng», because that is
# the spelling Mizo print uses. A reviewer who prefers the undotted `t` that
# plain-ASCII Mizo typing falls back to should respell rather than retranslate,
# and must convert **all four files at once**.
#
# **Much of the vocabulary here is an English loan, and that is what the
# classroom uses.** Mizoram schools teach mathematics, science and computing
# in English; «click», «keyboard», «row», «column», «point», «interval»,
# «box», «arrow», «document», «reload», «credit» and «mark» are the words a
# Mizo student and a Mizo teacher actually say, and writing a coinage in their
# place would put a word in this catalog that no reader has met. Where Mizo has
# its own word the seed is confident of, it is used: «dik» and «dik lo» for
# right and wrong, «hawn» and «khâr» for open and close, «belh» and «paih» for
# add and remove, «entîr» and «thup» for show and hide, «buatsaih» for
# preparing, «vaukhânna» for a warning, «chhânna» for an answer, «zawhna» for a
# question, «phêk» for a page, «hming» for a name.
#
# Numbers render in Latin digits (#1615).


## Answer submission

answer-checking = Enfiah mêk...
answer-submitting = Thawn mêk...

answer-checking-status = Chhânna enfiah mêk
answer-submitting-status = Chhânna thawn mêk

answer-correct = A dik
answer-incorrect = A dik lo

answer-response-saved = Chhânna Vawng A Ni

answer-percent-credit = Credit { $percent }%
answer-percent-correct = A dik { $percent }%
answer-percent-short = { $percent } %

max-credit-available = Credit dawn theih tam ber: { $percent }%

# CLDR has no plural data for `lus`, and a Mizo noun is not marked for number
# after a numeral in any case, so the count branch is gone. The `[0]` branch
# stays: Fluent matches that against the number itself, not against a plural
# rule.
attempts-remaining =
    { $count ->
        [0] tumna a awm tawh lo
       *[other] tumna { $count } a la awm
    }

validation-correct = (A dik)
validation-incorrect = (A dik lo)
validation-partially-correct = (Chhehvêl thenkhat a dik)

answer-show-responses = { $answerId } chhânna { $count } entîr


## Disclosure panels

feedback-heading = Chhânlêtna

collapsible-click-to-open = (hawn tûrin click rawh)
collapsible-click-to-close = (khâr tûrin click rawh)

collapsible-initializing = Buatsaih mêk...

footnote-show = Hnuai ziak entîr
footnote-hide = Hnuai ziak thup

description-more-information = thu belhchhah


## Controls

slider-previous = Hmasa
slider-next = Dawt

keyboard-open = Keyboard Hawn
keyboard-close = Keyboard Khâr

choice-input-remove-choice = { $choice } paih

matrix-remove-row = Row paih
matrix-add-row = Row belh
matrix-remove-column = Column paih
matrix-add-column = Column belh

subset-add-remove-points = Point belh/paih
subset-toggle-points-intervals = Point leh interval inthlâk
subset-move-points = Point Sawn
subset-clear = Tihfai

orbital-add-row = Row Belh
orbital-remove-row = Row Paih
orbital-add-box = Box Belh
orbital-remove-box = Box Paih
orbital-add-up-arrow = Chungkâwn Arrow Belh
orbital-add-down-arrow = Hnuailam Arrow Belh
orbital-remove-arrow = Arrow Paih

orbital-row-label = Row { $row } hming

pretzel-answer = Chhânna



## Math input

math-input-preview-region = math ziahna en lâwkna
math-input-preview = En lâwk
math-input-invalid-expression = Ziahna dik lo:


## Document status

viewer-initializing = Buatsaih mêk...


## Errors

error-heading = Thil Dik Lo

error-found-at =
    { $span ->
        [line] Line { $startLine }-ah hmuh a ni.
       *[lines] Line { $startLine }–{ $endLine }-ah hmuh a ni.
    }

document-contains-errors = He document-ah hian thil dik lo a awm!

diagnostic-heading-error = Thil Dik Lo
diagnostic-heading-warning = Vaukhânna
diagnostic-heading-information = Thu
diagnostic-heading-hint = Kaihhruaina

accessibility-heading-level-1 = WCAG AA Accessibility Bawhchhiatna
accessibility-heading-level-2 = Accessibility vaukhânna

something-went-wrong = Engemaw a kal dik lo.

renderer-load-failed = renderer pakhat a chhuak thei lo. Phêk hi reload leh rawh le.

core-start-failed = He document hi tan theih a ni lo. Phêk hi reload leh rawh le.

core-start-failed-busy = He document hi tan theih a ni lo. Document tam tak a inkhat lai tea tan an ni a, chu chu tha lo zawk device-ah chuan a rei zâwk thei. Document dangte an zawh hnu chuan phêk reload leh chuan a ṭanpui thei.

core-start-failed-retry = He document hi tan theih a ni lo.

core-start-failed-busy-retry = He document hi tan theih a ni lo. Document tam tak a inkhat lai tea tan an ni a, chu chu tha lo zawk device-ah chuan a rei zâwk thei.

core-start-retry = Tum leh rawh

saved-state-unavailable = I hnathawh vawn chu chhuah theih a ni lo.
