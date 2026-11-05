# Inuktitut (ᐃᓄᒃᑎᑐᑦ) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** **Canadian Aboriginal syllabics** (Unicode U+1400–U+167F),
# the script of Nunavut and the one the territory legislates, schools and
# broadcasts in. The **Latin qaliujaaqpait orthography** — the one Inuinnaqtun
# is written in, and the one many Nunavik documents use — **is not mixed into
# these four files anywhere**; no Inuktitut word below is spelled in roman
# letters. The Latin that does appear is either DoenetML source — element
# names, attribute names, anything quoted back from the author — or an
# English technical loan, which the paragraph on loans below sets out.
#
# The series used here are the fifteen of the Nunavut standard: ᐊᐃᐅ, ᐸᐱᐳ,
# ᑕᑎᑐ, ᑲᑭᑯ, ᒐᒋᒍ, ᒪᒥᒧ, ᓇᓂᓄ, ᓴᓯᓱ, ᓚᓕᓗ, ᔭᔨᔪ, ᕙᕕᕗ, ᕋᕆᕈ, ᖃᕿᖁ, ᖓᖏᖑ, ᕼ.
# Two things a reviewer should check by codepoint rather than by eye:
#
#   * **ᙱ (U+1671, NNGI) and ᙵ (U+1675, NNGA)** are the doubled *nng*, and
#     they are distinct from ᖏ (U+158F) and ᖓ (U+1593). This catalog writes
#     «ᓈᒻᒪᙱᑦᑐᖅ» with U+1671, because that is the word — a negative in *-nngit-*
#     — and not U+158F.
#   * **ᕼ (U+157C, NUNAVUT H)** is the Inuktitut *h*. It is **not** ᐦ
#     (U+1426), which is the Cree final *h* and belongs in `locales/cr`, and
#     not ᕻ (U+157B), which is the Nunavik final. Nothing below uses U+1426.
#
# The finals used are ᑉ ᑦ ᒃ ᒡ ᒻ ᓐ ᔅ ᓪ ᔾ ᕝ ᕐ ᖅ ᖕ.
#
# **Number, and the dual.** `Intl.PluralRules("iu")` selects **one**, **two**
# and **other**, and the `two` is not decoration: Inuktitut has a real
# **dual**, a separate number between the singular and the plural, marked by
# its own ending — «ᐆᒃᑐᕐᓂᒃᓴᖅ» one attempt, «ᐆᒃᑐᕐᓂᒃᓵᒃ» two, «ᐆᒃᑐᕐᓂᒃᓴᐃᑦ»
# three or more. So **every message that selects on a count writes all three
# branches**, and the `[two]` branch is a different word from the other two
# rather than a copy of the plural. This is the only catalog in its batch with
# a dual, and getting the dual endings right is the single most useful thing a
# speaker could correct here. English's explicit `[0]` literal matches the
# number itself and is kept.
#
# **Suffixes and placeables.** Inuktitut marks case with an ending, and an
# ending cannot be welded onto `{ $choice }` or `{ $startLine }`, whose final
# sound this catalog never sees. No `{ $x }`-ᒥ appears anywhere in these four
# files; the sentence is built around the argument with separate words.
#
# **Loans, and one coinage named as one.** Where Inuktitut has no settled word
# and no settled syllabic transliteration — *row*, *column*, *box*,
# *interval* on the matrix, orbital and subset controls — the English word is
# written **in roman letters inside a syllabic sentence**, with the verb
# around it in Inuktitut: «row ᐃᓚᒋᐊᕐᓗᒍ». That is the `locales/sgh` decision,
# and it is preferred to inventing a syllabic spelling a reader would have to
# undo.
#
# `diagnostic-heading-warning` is the one **coinage** in these four files and
# is flagged as one: «ᐅᔾᔨᖅᓱᖁᔨᔾᔪᑦ» is transparently built (*be careful* + the
# instrument-of-asking ending) but is not an attested term, and it labels
# every warning in the editor. A reviewer should check it first.

## Answer submission

answer-checking = ᖃᐅᔨᓴᖅᑐᖅ...
answer-submitting = ᐊᐅᓪᓚᖅᑎᑕᐅᔪᖅ...
answer-checking-status = ᑭᐅᔾᔪᑎ ᖃᐅᔨᓴᖅᑕᐅᔪᖅ
answer-submitting-status = ᑭᐅᔾᔪᑎ ᐊᐅᓪᓚᖅᑎᑕᐅᔪᖅ
answer-correct = ᓈᒻᒪᒃᑐᖅ
answer-incorrect = ᓈᒻᒪᙱᑦᑐᖅ
answer-response-saved = ᑭᐅᔾᔪᑎ ᑐᖅᑯᖅᑕᐅᔪᖅ
answer-percent-credit = { $percent }% ᐱᔭᒃᓴᖅ
answer-percent-correct = { $percent }% ᓈᒻᒪᒃᑐᖅ
answer-percent-short = { $percent } %
max-credit-available = ᐊᖏᓛᖅ ᐱᔭᒃᓴᖅ: { $percent }%
attempts-remaining =
    { $count ->
        [0] ᐆᒃᑐᕐᓂᒃᓴᖃᙱᑦᑐᖅ
        [one] ᓱᓕ ᐆᒃᑐᕐᓂᒃᓴᖅ { $count }
        [two] ᓱᓕ ᐆᒃᑐᕐᓂᒃᓵᒃ { $count }
       *[other] ᓱᓕ ᐆᒃᑐᕐᓂᒃᓴᐃᑦ { $count }
    }
validation-correct = (ᓈᒻᒪᒃᑐᖅ)
validation-incorrect = (ᓈᒻᒪᙱᑦᑐᖅ)
validation-partially-correct = (ᐃᓚᖓᒍᑦ ᓈᒻᒪᒃᑐᖅ)
answer-show-responses =
    { $count ->
        [one] { $answerId } ᑭᐅᔾᔪᑎᖓ { $count } ᑕᑯᒃᓴᐅᑎᑦᑎᒋᑦ
        [two] { $answerId } ᑭᐅᔾᔪᑏᒃ { $count } ᑕᑯᒃᓴᐅᑎᑦᑎᒋᑦ
       *[other] { $answerId } ᑭᐅᔾᔪᑏᑦ { $count } ᑕᑯᒃᓴᐅᑎᑦᑎᒋᑦ
    }


## Disclosure panels

feedback-heading = ᐅᖃᐅᓯᒃᓴᑦ
collapsible-click-to-open = (ᐅᒃᑯᐃᕐᓗᒍ ᓇᕿᓪᓗᒍ)
collapsible-click-to-close = (ᒪᑐᓗᒍ ᓇᕿᓪᓗᒍ)
collapsible-initializing = ᐱᒋᐊᖅᑐᖅ...
footnote-show = ᐊᑖᓂ ᑎᑎᖅᑲᖅ ᑕᑯᒃᓴᐅᑎᑦᑎᒋᑦ
footnote-hide = ᐊᑖᓂ ᑎᑎᖅᑲᖅ ᒪᑐᒍ
description-more-information = ᐊᓯᖏᑦ ᑐᑭᓯᒋᐊᕈᑏᑦ


## Controls

slider-previous = ᓯᕗᓪᓕᖅ
slider-next = ᑭᖑᓪᓕᖅ
keyboard-open = ᓇᕿᑦᑕᐅᑏᑦ ᐅᒃᑯᐃᕐᓗᒋᑦ
keyboard-close = ᓇᕿᑦᑕᐅᑏᑦ ᒪᑐᓗᒋᑦ
choice-input-remove-choice = { $choice } ᐲᔭᕐᓗᒍ
matrix-remove-row = row ᐲᔭᕐᓗᒍ
matrix-add-row = row ᐃᓚᒋᐊᕐᓗᒍ
matrix-remove-column = column ᐲᔭᕐᓗᒍ
matrix-add-column = column ᐃᓚᒋᐊᕐᓗᒍ
subset-add-remove-points = ᐃᓚᒋᐊᕐᓗᒋᑦ ᐲᔭᕐᓗᒋᓪᓘᓐᓃᑦ
subset-toggle-points-intervals = interval-ᖏᓐᓄᑦ ᐊᓯᔾᔨᕐᓗᒋᑦ
subset-move-points = ᓅᑦᑎᕐᓗᒋᑦ
subset-clear = ᐲᔭᐃᓗᑎᑦ
orbital-add-row = row ᐃᓚᒋᐊᕐᓗᒍ
orbital-remove-row = row ᐲᔭᕐᓗᒍ
orbital-add-box = box ᐃᓚᒋᐊᕐᓗᒍ
orbital-remove-box = box ᐲᔭᕐᓗᒍ
orbital-add-up-arrow = ᖁᒻᒧᐊᖅᑐᖅ ᐃᓚᒋᐊᕐᓗᒍ
orbital-add-down-arrow = ᐊᑦᑑᒃᑐᖅ ᐃᓚᒋᐊᕐᓗᒍ
orbital-remove-arrow = ᐲᔭᕐᓗᒍ
orbital-row-label = row { $row }-ᒧᑦ ᐊᑎᖓ
pretzel-answer = ᑭᐅᔾᔪᑎ


## Math input

math-input-preview-region = ᓈᓴᐅᓯᕆᓂᖅ ᑕᑯᒃᓴᐅᑎᑕᐅᔪᖅ
math-input-preview = ᑕᑯᒃᓴᐅᑎᑕᐅᔪᖅ
math-input-invalid-expression = ᓈᓴᐅᓯᕆᓂᖅ ᑕᒻᒪᖅᓯᒪᔪᖅ:


## Document status

viewer-initializing = ᐱᒋᐊᖅᑐᖅ...


## Errors

error-heading = ᑕᒻᒪᕐᓂᖅ
error-found-at =
    { $span ->
        [line] ᓇᓂᔭᐅᔪᖅ ᑎᑎᕋᖅᓯᒪᔪᒥ { $startLine }.
       *[lines] ᓇᓂᔭᐅᔪᖅ ᑎᑎᕋᖅᓯᒪᔪᓂ { $startLine }–{ $endLine }.
    }
document-contains-errors = ᑖᓐᓇ ᑎᑎᖅᑲᖅ ᑕᒻᒪᕐᓂᖃᖅᑐᖅ!
diagnostic-heading-error = ᑕᒻᒪᕐᓂᖅ
diagnostic-heading-warning = ᐅᔾᔨᖅᓱᖁᔨᔾᔪᑦ
diagnostic-heading-information = ᑐᑭᓯᒋᐊᕈᑏᑦ
diagnostic-heading-hint = ᐃᑲᔫᑦ
accessibility-heading-level-1 = WCAG AA ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᒪᓕᒃᑕᐅᙱᑦᑐᖅ
accessibility-heading-level-2 = ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ ᑐᑭᓯᒋᐊᕈᑦ
something-went-wrong = ᑕᒻᒪᖅᓯᒪᔪᖅ.
renderer-load-failed = ᑕᑯᒃᓴᐅᑎᑦᑎᔾᔪᑎ ᐱᔭᐅᔪᓐᓇᙱᑦᑐᖅ. ᒪᒃᐱᒐᖅ ᓄᑖᙳᖅᑎᒃᑯ.
core-start-failed = ᑖᓐᓇ ᑎᑎᖅᑲᖅ ᐱᒋᐊᖅᑎᑕᐅᔪᓐᓇᙱᑦᑐᖅ. ᒪᒃᐱᒐᖅ ᓄᑖᙳᖅᑎᒃᑯ.
core-start-failed-busy = ᑖᓐᓇ ᑎᑎᖅᑲᖅ ᐱᒋᐊᖅᑎᑕᐅᔪᓐᓇᙱᑦᑐᖅ. ᑎᑎᖅᑲᑦ ᐊᒥᓱᑦ ᐊᑕᐅᑦᑎᒃᑯᑦ ᐱᒋᐊᖅᑎᑕᐅᓚᐅᖅᑐᑦ. ᐊᓯᖏᑦ ᐱᔭᕇᖅᐸᑕ ᒪᒃᐱᒐᖅ ᓄᑖᙳᖅᑎᒃᑯ.
core-start-failed-retry = ᑖᓐᓇ ᑎᑎᖅᑲᖅ ᐱᒋᐊᖅᑎᑕᐅᔪᓐᓇᙱᑦᑐᖅ.
core-start-failed-busy-retry = ᑖᓐᓇ ᑎᑎᖅᑲᖅ ᐱᒋᐊᖅᑎᑕᐅᔪᓐᓇᙱᑦᑐᖅ. ᑎᑎᖅᑲᑦ ᐊᒥᓱᑦ ᐊᑕᐅᑦᑎᒃᑯᑦ ᐱᒋᐊᖅᑎᑕᐅᓚᐅᖅᑐᑦ.
core-start-retry = ᐆᒃᑐᒃᑲᓐᓂᕆᑦ
saved-state-unavailable = ᑐᖅᑯᖅᑕᐅᓯᒪᔪᑎᑦ ᐱᔭᐅᔪᓐᓇᙱᑦᑐᑦ.
