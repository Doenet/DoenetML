# Tulu (ತುಳು) viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Kannada, not Tigalari.** Tulu has a historic script of its own —
# **Tigalari**, also called Tulu-Tigalari or Tulu lipi, a Brahmic script
# descended from the same Grantha stock as Malayalam's, in which the Tulu
# palm-leaf literature (the Sri Bhagavato, the Kaveri) is written, encoded in
# Unicode as of version 16.0 (U+11380–U+113FF). Its revival is active and
# organized: it is taught in Mangaluru and Udupi, the Karnataka Tulu Sahitya
# Academy promotes it, and there is a real argument that a Tulu catalog should
# be written in it. A reviewer may reasonably have expected that, and its
# absence here is not a judgement about which script belongs to the language.
#
# This catalog writes the **Kannada script**, for three reasons. The first is
# what a Tulu reader reads: every Tulu book, magazine, film subtitle,
# schoolbook, road sign and web page published in the last century and a half
# is in Kannada letters, and a Tulu speaker is schooled in them. The second is
# mechanical and, for a script encoded this recently, decisive: Tigalari font
# coverage in a browser is close to nonexistent, and a catalog that renders as
# boxes on almost every machine helps nobody. The third is that Tigalari
# orthography for *modern* Tulu is not settled — the manuscripts are Sanskrit
# and old Tulu, and how to write today's borrowings, its ಎ/ಏ and ಒ/ಓ
# contrasts, and its final ಇ in that script is a question the revival is still
# answering — so a Tigalari seed would be making orthographic decisions no
# current practice supports. Converting this catalog to Tigalari means
# converting **all four files at once**, never a mixture inside one catalog,
# and it is a real conversion rather than a transliteration.
#
# **This seed leans on Kannada.** Tulu and Kannada are both Southern
# Dravidian, they share the script and a great deal of the learned vocabulary,
# and every technical word in these files — ದೋಷ, ಎಚ್ಚರಿಕೆ, ಘಟಕ, ಗುಣ, ಚರ,
# ಆಯಾಮ, ಸಾಲು, ಕಂಬ — is Kannada, because Tulu-medium schooling does not exist
# and a Tulu reader met these words in Kannada. What is Tulu here is the
# **grammar**: ಇಜ್ಜಿ for negation and absence, ಉಂಡು for presence, the negative
# verb in -ಜಿ (ತಿಕ್ಕುಜಿ, ಆಪುಜಿ, ಮಲ್ಪುಜಿ), ಬೊಕ್ಕ for *and*, ಅತ್ತ್ಂಡ for *or*,
# ಒಟ್ಟುಗು for *with*, ಆವೊಡು for *must*, and the honorific imperative in -ಲೆ —
# ಮಲ್ಪುಲೆ, ತೋಜಾಲೆ — which is what a Tulu reader expects a button to say. A
# message where Kannada's ಇಲ್ಲ, ಮತ್ತು, ಅಥವಾ, ಮಾಡಿ or ಆಗಿದೆ has crept back in
# is a defect rather than a variant, and is the easiest thing in this catalog
# to check.
#
# **Numbers render in Latin digits** rather than in Kannada numerals, which is
# the digit policy in the package README (#1615). The grouping is the
# locale's; the ten characters are not.
#
# **No plural branches.** CLDR has no plural data for `tcy`, so a `one` branch
# here would be text selected by Kannada's rules rather than by this locale's.
# The numeric literal `[0]` in `attempts-remaining` stays, because Fluent
# matches it against the number itself before any plural rule is consulted.


## Answer submission

answer-checking = ಪರಿಶೀಲನೆ ಆವೊಂದುಂಡು...
answer-submitting = ಕಡಪುಡೊಂದುಂಡು...
answer-checking-status = ಉತ್ತರೊದ ಪರಿಶೀಲನೆ ಆವೊಂದುಂಡು
answer-submitting-status = ಉತ್ತರ ಕಡಪುಡೊಂದುಂಡು
answer-correct = ಸರಿ
answer-incorrect = ಸರಿ ಅತ್ತ್
answer-response-saved = ಉತ್ತರ ದೀಪುನ ಆಂಡ್
answer-percent-credit = { $percent }% ಅಂಕ
answer-percent-correct = { $percent }% ಸರಿ
answer-percent-short = { $percent } %
max-credit-available = ಗರಿಷ್ಠ ಅಂಕ: { $percent }%
attempts-remaining =
    { $count ->
        [0] ಇನಿ ಒವ್ವೇ ಪ್ರಯತ್ನ ಒರಿದ್‌ಜಿ
       *[other] ಇನಿ { $count } ಪ್ರಯತ್ನ ಒರಿದ್ಂಡ್
    }
validation-correct = (ಸರಿ)
validation-incorrect = (ಸರಿ ಅತ್ತ್)
validation-partially-correct = (ಒಂತೆ ಸರಿ)
answer-show-responses =
    { $count ->
       *[other] { $answerId }ಗ್ ಬತ್ತಿನ { $count } ಉತ್ತರ ತೋಜಾಲೆ
    }


## Disclosure panels

feedback-heading = ಅನಿಸಿಕೆ
collapsible-click-to-open = (ದೆಪ್ಪರೆ ಕ್ಲಿಕ್ ಮಲ್ಪುಲೆ)
collapsible-click-to-close = (ಮುಚ್ಚರೆ ಕ್ಲಿಕ್ ಮಲ್ಪುಲೆ)
collapsible-initializing = ಸುರುವಾವೊಂದುಂಡು...
footnote-show = ಅಡಿಟಿಪ್ಪಣಿ ತೋಜಾಲೆ
footnote-hide = ಅಡಿಟಿಪ್ಪಣಿ ದೆಂಗಾಲೆ
description-more-information = ಇನ್ನಷ್ಟು ವಿವರ


## Controls

slider-previous = ದುಂಬುದ
slider-next = ಬೊಕ್ಕದ
keyboard-open = ಕೀಬೋರ್ಡ್ ದೆಪ್ಪುಲೆ
keyboard-close = ಕೀಬೋರ್ಡ್ ಮುಚ್ಚುಲೆ
choice-input-remove-choice = { $choice } ದೆತ್ತ್ ಪಾಡ್ಲೆ
matrix-remove-row = ಸಾಲು ದೆತ್ತ್ ಪಾಡ್ಲೆ
matrix-add-row = ಸಾಲು ಸೇರಾಲೆ
matrix-remove-column = ಕಂಬ ದೆತ್ತ್ ಪಾಡ್ಲೆ
matrix-add-column = ಕಂಬ ಸೇರಾಲೆ
subset-add-remove-points = ಬಿಂದು ಸೇರಾವುನ/ದೆಪ್ಪುನ
subset-toggle-points-intervals = ಬಿಂದು ಬೊಕ್ಕ ಅಂತರ ಬದಲ್ ಮಲ್ಪುಲೆ
subset-move-points = ಬಿಂದು ಜರಿಪಾಲೆ
subset-clear = ಕ್ಲೀನ್ ಮಲ್ಪುಲೆ
orbital-add-row = ಸಾಲು ಸೇರಾಲೆ
orbital-remove-row = ಸಾಲು ದೆತ್ತ್ ಪಾಡ್ಲೆ
orbital-add-box = ಪೆಟ್ಟಿಗೆ ಸೇರಾಲೆ
orbital-remove-box = ಪೆಟ್ಟಿಗೆ ದೆತ್ತ್ ಪಾಡ್ಲೆ
orbital-add-up-arrow = ಮಿತ್ತ್‌ದ ಬಾಣ ಸೇರಾಲೆ
orbital-add-down-arrow = ತಿರ್ತ್‌ದ ಬಾಣ ಸೇರಾಲೆ
orbital-remove-arrow = ಬಾಣ ದೆತ್ತ್ ಪಾಡ್ಲೆ
orbital-row-label = { $row }ನೇ ಸಾಲುದ ಪುದರ್
pretzel-answer = ಉತ್ತರ


## Math input

math-input-preview-region = ಗಣಿತ ಸೂತ್ರೊದ ಮುನ್ನೋಟ
math-input-preview = ಮುನ್ನೋಟ
math-input-invalid-expression = ತಪ್ಪು ಸೂತ್ರ:


## Document status

viewer-initializing = ಸುರುವಾವೊಂದುಂಡು...


## Errors

error-heading = ದೋಷ
error-found-at =
    { $span ->
        [line] { $startLine }ನೇ ಸಾಲುಡ್ ತಿಕ್ಕ್‌ಂಡ್.
       *[lines] { $startLine }–{ $endLine } ಸಾಲುಡ್ ತಿಕ್ಕ್‌ಂಡ್.
    }
document-contains-errors = ಈ ದಾಖಲೆಡ್ ದೋಷ ಉಂಡು!
diagnostic-heading-error = ದೋಷ
diagnostic-heading-warning = ಎಚ್ಚರಿಕೆ
diagnostic-heading-information = ವಿವರ
diagnostic-heading-hint = ಸುಳಿವು
accessibility-heading-level-1 = WCAG AA ಸೌಲಭ್ಯ ಉಲ್ಲಂಘನೆ
accessibility-heading-level-2 = ಸೌಲಭ್ಯ ಸೂಚನೆ
something-went-wrong = ಒವ್ವೋ ತಪ್ಪಾಂಡ್.
renderer-load-failed = ಒಂಜಿ ರೆಂಡರರ್ ಲೋಡ್ ಆಪುಜಿ. ದಯಮಲ್ತ್ ಪುಟೊನು ಪಿರ ಲೋಡ್ ಮಲ್ಪುಲೆ.
core-start-failed = ಈ ದಾಖಲೆನ್ ಸುರು ಮಲ್ಪೆರೆ ಆಪುಜಿ. ದಯಮಲ್ತ್ ಪುಟೊನು ಪಿರ ಲೋಡ್ ಮಲ್ಪುಲೆ.
core-start-failed-busy = ಈ ದಾಖಲೆನ್ ಸುರು ಮಲ್ಪೆರೆ ಆಪುಜಿ. ಒಟ್ಟುಗು ಮಸ್ತ್ ದಾಖಲೆಲು ಸುರುವಾವೊಂದಿತ್ತ, ಮೆಲ್ಲ ಸಾಗುನ ಸಾಧನೊಡು ಅವು ಜಾಸ್ತಿ ಪೊರ್ತು ದೆತೊನುಂಡು. ಬಾಕಿ ದಾಖಲೆಲು ಮುಗಿಯಿನ ಬುಕ್ಕ ಪುಟೊನು ಪಿರ ಲೋಡ್ ಮಲ್ತ್ಂಡ ಸಹಾಯ ಆವು.
core-start-failed-retry = ಈ ದಾಖಲೆನ್ ಸುರು ಮಲ್ಪೆರೆ ಆಪುಜಿ.
core-start-failed-busy-retry = ಈ ದಾಖಲೆನ್ ಸುರು ಮಲ್ಪೆರೆ ಆಪುಜಿ. ಒಟ್ಟುಗು ಮಸ್ತ್ ದಾಖಲೆಲು ಸುರುವಾವೊಂದಿತ್ತ, ಮೆಲ್ಲ ಸಾಗುನ ಸಾಧನೊಡು ಅವು ಜಾಸ್ತಿ ಪೊರ್ತು ದೆತೊನುಂಡು.
core-start-retry = ಪಿರ ಪ್ರಯತ್ನ ಮಲ್ಪುಲೆ
saved-state-unavailable = ಈರ್ ದೀತಿನ ಕೆಲಸೊನು ಲೋಡ್ ಮಲ್ಪೆರೆ ಆಪುಜಿ.
