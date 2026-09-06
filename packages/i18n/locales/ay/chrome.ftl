# Aymara viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the unified orthography of 1984, which Bolivia and Peru both use in
# intercultural bilingual education.
#
# **Aymara marks how the speaker knows what they are saying**, and it marks it on
# every assertion. The direct-knowledge sentence-final «-wa» is written
# throughout this catalog, and that is a deliberate reading of what these strings
# are: the software has first-hand access to what it reports — it counted the
# attempts, it graded the response, it found the error — so direct knowledge is
# the honest marking. A reportative would be the wrong claim rather than a more
# cautious one. That decision is the same in every message here, which is why it
# is recorded once at the top rather than at fifty sites, and it is the first
# thing a speaker should push back on if the register is wrong.
#
# Number is the optional suffix «-naka», dropped after a numeral, so a counted
# message has one form and its select is dropped, keeping the `[0]` wording that
# names none — a different sentence rather than a different form.
#
# Every case relation is a suffix, and as in `locales/qu` it lands on a word this
# catalog writes rather than on a value it never sees. Where that was not
# possible, the value is named instead; `content.ftl`'s header says where.


## Answer submission

answer-checking = Uñakipaskiwa…
answer-submitting = Apayaskiwa…
answer-checking-status = Jaysäwi uñakipaskiwa
answer-submitting-status = Jaysäwi apayaskiwa
answer-correct = Askiwa
answer-incorrect = Jan askiwa
answer-response-saved = Jaysäwi imantatawa
answer-percent-credit = { $percent }% chani
answer-percent-correct = { $percent }% aski
answer-percent-short = { $percent } %
max-credit-available = Jach'a chani: { $percent }%
# No select: «yant'a» takes no plural suffix after a numeral, so both English
# categories render the same words. The count still arrives and is still
# formatted. `[0]` stays, because "none left" is its own sentence.
attempts-remaining =
    { $count ->
        [0] janiwa yant'a jiltkiti
       *[other] { $count } yant'a jiltiwa
    }
validation-correct = (Askiwa)
validation-incorrect = (Jan askiwa)
validation-partially-correct = (Chikatanaki aski)
# No select, for the reason given above. The answer is reached by naming it —
# «{ $answerId } sutini jiskt'awi», "the question named X" — rather than by
# putting a case suffix on `$answerId`.
answer-show-responses = { $answerId } sutini jiskt'awitaki { $count } jaysäwi uñachayaña

## Disclosure panels

feedback-heading = Kutt'awi aru
collapsible-click-to-open = (jist'arañataki limt'aña)
collapsible-click-to-close = (jist'antañataki limt'aña)
collapsible-initializing = Qalltaskiwa…
footnote-show = Aynachankiri qillqa uñachayaña
footnote-hide = Aynachankiri qillqa imantaña
description-more-information = juk'ampi yatiyawi

## Controls

slider-previous = Nayra
slider-next = Qhipa
keyboard-open = Limt'aña uta jist'araña
keyboard-close = Limt'aña uta jist'antaña
choice-input-remove-choice = { $choice } apsuña
matrix-remove-row = Mä siqi apsuña
matrix-add-row = Mä siqi yapxataña
matrix-remove-column = Mä sayt'iri apsuña
matrix-add-column = Mä sayt'iri yapxataña
subset-add-remove-points = Chimpunaka yapxataña/apsuña
subset-toggle-points-intervals = Chimputa taypiruwa mayjt'ayaña
subset-move-points = Chimpunaka unxtayaña
subset-clear = Pichaña
orbital-add-row = Mä siqi yapxataña
orbital-remove-row = Mä siqi apsuña
orbital-add-box = Mä qullqa yapxataña
orbital-remove-box = Mä qullqa apsuña
orbital-add-up-arrow = Alaya wach'i yapxataña
orbital-add-down-arrow = Aynacha wach'i yapxataña
orbital-remove-arrow = Wach'i apsuña
orbital-row-label = { $row } siqitaki suti
pretzel-answer = Jaysäwi

## Math input

math-input-preview-region = jakhuwi aru nayra uñachawi
math-input-preview = Nayra uñachawi
math-input-invalid-expression = Jan aski aru:

## Document status

viewer-initializing = Qalltaskiwa…

## Errors

error-heading = Pantjawi
error-found-at =
    { $span ->
        [line] { $startLine } siqina jikitawa.
       *[lines] { $startLine }–{ $endLine } siqinakana jikitawa.
    }
document-contains-errors = Aka qillqana pantjawinakawa utji!
diagnostic-heading-error = Pantjawi
diagnostic-heading-warning = Amuyt'ayawi
diagnostic-heading-information = Yatiyawi
diagnostic-heading-hint = Yanapa
accessibility-heading-level-1 = WCAG AA puriña p'akjawi
accessibility-heading-level-2 = Puriña amuyt'ayawi
something-went-wrong = Kunas jan askiwa mistuwa.
renderer-load-failed = mä uñachayirisa janiwa purkiti. Mira, laphi wasitat apnaqaña.
core-start-failed = Qillqa uñachayirisa janiwa qalltañ atkiti. Mira, laphi wasitat apnaqaña.
