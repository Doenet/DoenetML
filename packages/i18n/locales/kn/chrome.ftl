# Kannada viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Controls take the bare ನೀನು imperative Kannada puts on a button — «ಕೀಲಿಮಣೆ
# ತೆರೆ» — which is what a reader expects from software.
#
# Kannada counts in two plural categories and marks the plural on the noun, so
# both are written out where the noun changes.
#
# Numbers render in Latin digits rather than in Kannada numerals, which is the
# digit policy in the package README (#1615).


## Answer submission

answer-checking = ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...
answer-submitting = ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...
answer-checking-status = ಉತ್ತರ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ
answer-submitting-status = ಉತ್ತರ ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ
answer-correct = ಸರಿ
answer-incorrect = ತಪ್ಪು
answer-response-saved = ಉತ್ತರ ಉಳಿಸಲಾಗಿದೆ
answer-percent-credit = { $percent }% ಅಂಕ
answer-percent-correct = { $percent }% ಸರಿ
answer-percent-short = { $percent }%
max-credit-available = ಲಭ್ಯವಿರುವ ಗರಿಷ್ಠ ಅಂಕ: { $percent }%
attempts-remaining =
    { $count ->
        [0] ಯಾವುದೇ ಪ್ರಯತ್ನ ಉಳಿದಿಲ್ಲ
        [one] { $count } ಪ್ರಯತ್ನ ಉಳಿದಿದೆ
       *[other] { $count } ಪ್ರಯತ್ನಗಳು ಉಳಿದಿವೆ
    }
validation-correct = (ಸರಿ)
validation-incorrect = (ತಪ್ಪು)
validation-partially-correct = (ಭಾಗಶಃ ಸರಿ)
answer-show-responses =
    { $count ->
        [one] { $answerId } ಗೆ ಬಂದ { $count } ಉತ್ತರವನ್ನು ತೋರಿಸು
       *[other] { $answerId } ಗೆ ಬಂದ { $count } ಉತ್ತರಗಳನ್ನು ತೋರಿಸು
    }

## Disclosure panels

feedback-heading = ಪ್ರತಿಕ್ರಿಯೆ
collapsible-click-to-open = (ತೆರೆಯಲು ಕ್ಲಿಕ್ ಮಾಡಿ)
collapsible-click-to-close = (ಮುಚ್ಚಲು ಕ್ಲಿಕ್ ಮಾಡಿ)
collapsible-initializing = ಆರಂಭವಾಗುತ್ತಿದೆ...
footnote-show = ಅಡಿಟಿಪ್ಪಣಿ ತೋರಿಸು
footnote-hide = ಅಡಿಟಿಪ್ಪಣಿ ಮರೆಮಾಡು
description-more-information = ಹೆಚ್ಚಿನ ಮಾಹಿತಿ

## Controls

slider-previous = ಹಿಂದಿನದು
slider-next = ಮುಂದಿನದು
keyboard-open = ಕೀಲಿಮಣೆ ತೆರೆ
keyboard-close = ಕೀಲಿಮಣೆ ಮುಚ್ಚು
choice-input-remove-choice = { $choice } ತೆಗೆ
matrix-remove-row = ಸಾಲು ತೆಗೆ
matrix-add-row = ಸಾಲು ಸೇರಿಸು
matrix-remove-column = ಕಂಬ ತೆಗೆ
matrix-add-column = ಕಂಬ ಸೇರಿಸು
subset-add-remove-points = ಬಿಂದುಗಳನ್ನು ಸೇರಿಸು/ತೆಗೆ
subset-toggle-points-intervals = ಬಿಂದುಗಳು ಮತ್ತು ಅಂತರಗಳ ನಡುವೆ ಬದಲಿಸು
subset-move-points = ಬಿಂದುಗಳನ್ನು ಸರಿಸು
subset-clear = ಅಳಿಸು
# A `box` here is one orbital, drawn as a square: ಚೌಕ.
orbital-add-row = ಸಾಲು ಸೇರಿಸು
orbital-remove-row = ಸಾಲು ತೆಗೆ
orbital-add-box = ಚೌಕ ಸೇರಿಸು
orbital-remove-box = ಚೌಕ ತೆಗೆ
orbital-add-up-arrow = ಮೇಲ್ಬಾಣ ಸೇರಿಸು
orbital-add-down-arrow = ಕೆಳಬಾಣ ಸೇರಿಸು
orbital-remove-arrow = ಬಾಣ ತೆಗೆ
orbital-row-label = ಸಾಲು { $row } ಗೆ ಲೇಬಲ್
pretzel-answer = ಉತ್ತರ

## Math input

math-input-preview-region = ಗಣಿತ ಅಭಿವ್ಯಕ್ತಿ ಮುನ್ನೋಟ
math-input-preview = ಮುನ್ನೋಟ
math-input-invalid-expression = ಅಮಾನ್ಯ ಅಭಿವ್ಯಕ್ತಿ:

## Document status

viewer-initializing = ಆರಂಭವಾಗುತ್ತಿದೆ...

## Errors

error-heading = ದೋಷ
error-found-at =
    { $span ->
        [line] { $startLine } ನೇ ಸಾಲಿನಲ್ಲಿ ಕಂಡುಬಂದಿದೆ.
       *[lines] { $startLine }–{ $endLine } ಸಾಲುಗಳಲ್ಲಿ ಕಂಡುಬಂದಿದೆ.
    }
document-contains-errors = ಈ ದಸ್ತಾವೇಜಿನಲ್ಲಿ ದೋಷಗಳಿವೆ!
diagnostic-heading-error = ದೋಷ
diagnostic-heading-warning = ಎಚ್ಚರಿಕೆ
diagnostic-heading-information = ಮಾಹಿತಿ
diagnostic-heading-hint = ಸುಳಿವು
accessibility-heading-level-1 = WCAG AA ಪ್ರವೇಶಸಾಧ್ಯತೆ ಉಲ್ಲಂಘನೆ
accessibility-heading-level-2 = ಪ್ರವೇಶಸಾಧ್ಯತೆ ಎಚ್ಚರಿಕೆ
something-went-wrong = ಏನೋ ತಪ್ಪಾಗಿದೆ.
renderer-load-failed = ಒಂದು ರೆಂಡರರ್ ಲೋಡ್ ಆಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಪುಟವನ್ನು ಮತ್ತೆ ಲೋಡ್ ಮಾಡಿ.
core-start-failed = ದಸ್ತಾವೇಜು ವೀಕ್ಷಕವನ್ನು ಆರಂಭಿಸಲಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಪುಟವನ್ನು ಮತ್ತೆ ಲೋಡ್ ಮಾಡಿ.
