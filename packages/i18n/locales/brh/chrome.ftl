# Brahui (براہوئی) viewer chrome: the buttons, panel headings and status words
# the reader interacts with. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Brahui is Dravidian**, and it is the only Dravidian language on this
# roster written right to left. Its nearest neighbours on the map — Balochi,
# Sindhi, Saraiki, Pashto — are Iranian or Indo-Aryan, and it agrees with none
# of them about how a word is built: what those languages do with a
# postposition Brahui does with a case clitic, and what they do with gender it
# does not do at all. A reader who arrives here from `locales/bal` should
# expect the vocabulary to look familiar and the grammar not to.
#
# **Script and direction: Perso-Arabic, right to left**, on the Urdu letter
# inventory as Brahui is printed in Quetta — `ٹ ڈ ڑ` for the retroflexes, `ے`
# for final *ē*, `ہ` rather than `ه`. `directionOf` learns `brh` from
# `src/direction.ts`'s fallback list, since ICU does not maximize the tag to a
# script on its own. Nothing about the file format changes for a right-to-left
# catalog: the text is written in **logical order** — the order it is spoken —
# and **no bidi control characters are placed by hand**. Fluent's own isolation
# puts the marks around an interpolated value, and `dir` decides where each run
# is drawn. Brackets are written opening-first and the bidi algorithm turns
# them around at render time.
#
# **The case clitics are written as separate words here, and that is a
# decision.** Brahui marks case with `‑نا` (genitive), `‑ٹی` (locative), `‑آن`
# (ablative), `‑کے` (dative) and `تون` (comitative), and Brahui print usually
# joins the first four to the word in front of them. This catalog writes all
# five separated, because the word in front is very often a **placeable** — a
# column name, an answer id, a component tag — and an affix cannot be welded to
# a value the catalog never sees without making a claim about what that value
# ends in. Brahui's clitics happen to have one shape each, so welding them
# would have come out right; writing them apart is the safer spelling and it
# costs the file nothing. A corrector who prefers the joined spelling should
# join them everywhere except after a placeable.
#
# **Digits are Latin**, here as everywhere else in the repository, which is
# what keeps a Brahui sentence and the mathematics beside it counting in the
# same characters. The separator is not pinned; only the ten characters are.
#
# **No plural categories.** CLDR has no plural data for `brh`, so nothing here
# selects on one and `lint:i18n` would reject a branch that did. Nothing is
# lost: a Brahui noun after a numeral stays unmarked. `[0]` is kept where
# English has it — Fluent matches a numeric literal against the number itself
# before it consults any plural rule, so that branch is reachable whatever the
# locale.
#
# **Register: the verbal noun in `‑نگ`.** A control is named with «کننگ»
# (*doing*), «دیرنگ» (*showing*) and their kind rather than with an imperative.
# That is a deliberately conservative choice: Brahui's imperative paradigm is
# not something this seed can get right unaided, and a verbal noun on a button
# is idiomatic in the language and unambiguous in a UI. A speaker who wants
# imperatives should write them.
#
# **Loans kept rather than coined, and this is the file's weakest property.**
# Brahui is not a medium of instruction anywhere: schooling in its area is in
# Urdu and English, and roughly half the everyday lexicon is Balochi or Persian
# already. So the technical vocabulary below — `کی بورڈ`, `میٹرکس`, `کالم`,
# `شماریاتی`, `فیصد`, `آربیٹل`, `WCAG` — is the Urdu and Balochi vocabulary a
# Brahui-speaking pupil actually meets, and the sentences around it are built
# on Brahui's own case clitics and word order. The grammar is Brahui; a good
# deal of the vocabulary is not, and this file says so rather than inventing
# words.


## Answer submission

answer-checking = چک کننگ ٹی اے...
answer-submitting = دیہنگ ٹی اے...
answer-checking-status = جواب نا چک کننگ
answer-submitting-status = جواب نا دیہنگ
answer-correct = راست
answer-incorrect = غلط
answer-response-saved = جواب محفوظ اے
answer-percent-credit = { $percent }% نمبر
answer-percent-correct = { $percent }% راست
answer-percent-short = { $percent } %
max-credit-available = مزنترین نمبر: { $percent }%
attempts-remaining =
    { $count ->
        [0] ہچ کوشش باقی اف
       *[other] { $count } کوشش باقی اے
    }
validation-correct = (راست)
validation-incorrect = (غلط)
validation-partially-correct = (بہرے راست)
# «نا» is the genitive clitic and stands as its own word, so nothing is welded
# to the placeable.
answer-show-responses = { $answerId } نا { $count } جواب دیرنگ

## Disclosure panels

feedback-heading = رائے
collapsible-click-to-open = (پچ کننگ کے کلک کننگ)
collapsible-click-to-close = (بند کننگ کے کلک کننگ)
collapsible-initializing = تیار مانگ ٹی اے...
footnote-show = حاشیہ نا دیرنگ
footnote-hide = حاشیہ نا لکانگ
description-more-information = گیشتر معلومات

## Controls

slider-previous = پیشی
slider-next = رندی
keyboard-open = کی بورڈ نا پچ کننگ
keyboard-close = کی بورڈ نا بند کننگ
choice-input-remove-choice = { $choice } نا در کننگ
matrix-remove-row = رج نا در کننگ
matrix-add-row = رج نا ھور کننگ
matrix-remove-column = کالم نا در کننگ
matrix-add-column = کالم نا ھور کننگ
subset-add-remove-points = نقطہ نا ھور کننگ/در کننگ
subset-toggle-points-intervals = نقطہ او وقفہ نا نیام ٹی گردیننگ
subset-move-points = نقطہ نا لڑیننگ
subset-clear = پاک کننگ
orbital-add-row = رج نا ھور کننگ
orbital-remove-row = رج نا در کننگ
orbital-add-box = خانہ نا ھور کننگ
orbital-remove-box = خانہ نا در کننگ
orbital-add-up-arrow = برزی تیر نا ھور کننگ
orbital-add-down-arrow = چیری تیر نا ھور کننگ
orbital-remove-arrow = تیر نا در کننگ
orbital-row-label = رج { $row } نا نام
pretzel-answer = جواب
# «کالم» names what `$column` is, so the genitive clitic falls behind a word
# this catalog writes rather than behind the value.

## Math input

math-input-preview-region = ریاضی نا عبارت نا پیش دیرنگ
math-input-preview = پیش دیرنگ
math-input-invalid-expression = غلط عبارت:

## Document status

viewer-initializing = تیار مانگ ٹی اے...

## Errors

error-heading = خطا
error-found-at =
    { $span ->
        [line] سطر { $startLine } ٹی خفتا۔
       *[lines] سطر { $startLine }–{ $endLine } ٹی خفتا۔
    }
document-contains-errors = دا دستاویز ٹی خطا اے!
diagnostic-heading-error = خطا
diagnostic-heading-warning = ہشدار
diagnostic-heading-information = معلومات
diagnostic-heading-hint = اشارہ
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = رسائی نا خلاف ورزی: WCAG AA
accessibility-heading-level-2 = رسائی نا ہشدار
something-went-wrong = چیزے غلط مسا۔
renderer-load-failed = اسٹ رینڈرر بار مانگ ممکن اف۔ مہربانی کننگ او صفحہ نا پدا بار کننگ۔
core-start-failed = دا دستاویز سرا مانگ ممکن اف۔ مہربانی کننگ او صفحہ نا پدا بار کننگ۔
core-start-failed-busy = دا دستاویز سرا مانگ ممکن اف۔ گیشتر دستاویز اسٹ وخت ٹی سرا مسا اے، او دا کار سست دستگاہ ٹی گیشتر وخت گرینک۔ دگہ دستاویز نا خلاص مانگ آن رند، صفحہ نا پدا بار کننگ فائدہ کیک۔
core-start-failed-retry = دا دستاویز سرا مانگ ممکن اف۔
core-start-failed-busy-retry = دا دستاویز سرا مانگ ممکن اف۔ گیشتر دستاویز اسٹ وخت ٹی سرا مسا اے، او دا کار سست دستگاہ ٹی گیشتر وخت گرینک۔
core-start-retry = پدا کوشش کننگ
saved-state-unavailable = نا محفوظ کار بار مانگ ممکن اف۔
