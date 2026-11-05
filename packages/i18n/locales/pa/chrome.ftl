# Punjabi viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Gurmukhi; see the note at the head of `content.ftl` for why the
# directory is named `pa`.
#
# Controls take the ਤੁਸੀਂ imperative Punjabi puts on a button — «ਕੀ-ਬੋਰਡ
# ਖੋਲ੍ਹੋ» — which is what a reader expects from software.
#
# Punjabi counts in two plural categories and marks the plural on the noun, so
# both are written out where the noun changes.
#
# Numbers render in Latin digits rather than in Gurmukhi numerals, which is the
# digit policy in the package README (#1615).


## Answer submission

answer-checking = ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...
answer-submitting = ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ...
answer-checking-status = ਜਵਾਬ ਦੀ ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ
answer-submitting-status = ਜਵਾਬ ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ
answer-correct = ਸਹੀ
answer-incorrect = ਗਲਤ
answer-response-saved = ਜਵਾਬ ਸਾਂਭ ਲਿਆ
answer-percent-credit = { $percent }% ਅੰਕ
answer-percent-correct = { $percent }% ਸਹੀ
answer-percent-short = { $percent }%
max-credit-available = ਵੱਧ ਤੋਂ ਵੱਧ ਸੰਭਵ ਅੰਕ: { $percent }%
attempts-remaining =
    { $count ->
        [0] ਕੋਈ ਕੋਸ਼ਿਸ਼ ਬਾਕੀ ਨਹੀਂ
        [one] { $count } ਕੋਸ਼ਿਸ਼ ਬਾਕੀ
       *[other] { $count } ਕੋਸ਼ਿਸ਼ਾਂ ਬਾਕੀ
    }
validation-correct = (ਸਹੀ)
validation-incorrect = (ਗਲਤ)
validation-partially-correct = (ਅੰਸ਼ਕ ਤੌਰ ’ਤੇ ਸਹੀ)
answer-show-responses =
    { $count ->
        [one] { $answerId } ਦਾ { $count } ਜਵਾਬ ਵਿਖਾਓ
       *[other] { $answerId } ਦੇ { $count } ਜਵਾਬ ਵਿਖਾਓ
    }

## Disclosure panels

feedback-heading = ਪ੍ਰਤੀਕਰਮ
collapsible-click-to-open = (ਖੋਲ੍ਹਣ ਲਈ ਕਲਿੱਕ ਕਰੋ)
collapsible-click-to-close = (ਬੰਦ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ)
collapsible-initializing = ਸ਼ੁਰੂ ਹੋ ਰਿਹਾ ਹੈ...
footnote-show = ਫੁਟਨੋਟ ਵਿਖਾਓ
footnote-hide = ਫੁਟਨੋਟ ਲੁਕਾਓ
description-more-information = ਹੋਰ ਜਾਣਕਾਰੀ

## Controls

slider-previous = ਪਿਛਲਾ
slider-next = ਅਗਲਾ
keyboard-open = ਕੀ-ਬੋਰਡ ਖੋਲ੍ਹੋ
keyboard-close = ਕੀ-ਬੋਰਡ ਬੰਦ ਕਰੋ
choice-input-remove-choice = { $choice } ਹਟਾਓ
matrix-remove-row = ਕਤਾਰ ਹਟਾਓ
matrix-add-row = ਕਤਾਰ ਜੋੜੋ
matrix-remove-column = ਕਾਲਮ ਹਟਾਓ
matrix-add-column = ਕਾਲਮ ਜੋੜੋ
subset-add-remove-points = ਬਿੰਦੂ ਜੋੜੋ/ਹਟਾਓ
subset-toggle-points-intervals = ਬਿੰਦੂਆਂ ਅਤੇ ਅੰਤਰਾਲਾਂ ਵਿਚਕਾਰ ਬਦਲੋ
subset-move-points = ਬਿੰਦੂ ਸਰਕਾਓ
subset-clear = ਮਿਟਾਓ
# A `box` here is one orbital, drawn as a square: ਖਾਨਾ.
orbital-add-row = ਕਤਾਰ ਜੋੜੋ
orbital-remove-row = ਕਤਾਰ ਹਟਾਓ
orbital-add-box = ਖਾਨਾ ਜੋੜੋ
orbital-remove-box = ਖਾਨਾ ਹਟਾਓ
orbital-add-up-arrow = ਉੱਪਰਲਾ ਤੀਰ ਜੋੜੋ
orbital-add-down-arrow = ਹੇਠਲਾ ਤੀਰ ਜੋੜੋ
orbital-remove-arrow = ਤੀਰ ਹਟਾਓ
orbital-row-label = ਕਤਾਰ { $row } ਦਾ ਲੇਬਲ
pretzel-answer = ਜਵਾਬ

## Math input

math-input-preview-region = ਗਣਿਤ ਸਮੀਕਰਨ ਦੀ ਝਲਕ
math-input-preview = ਝਲਕ
math-input-invalid-expression = ਗਲਤ ਸਮੀਕਰਨ:

## Document status

viewer-initializing = ਸ਼ੁਰੂ ਹੋ ਰਿਹਾ ਹੈ...

## Errors

error-heading = ਗਲਤੀ
error-found-at =
    { $span ->
        [line] ਸਤਰ { $startLine } ਉੱਤੇ ਮਿਲੀ।
       *[lines] ਸਤਰ { $startLine }–{ $endLine } ਉੱਤੇ ਮਿਲੀ।
    }
document-contains-errors = ਇਸ ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਗਲਤੀਆਂ ਹਨ!
diagnostic-heading-error = ਗਲਤੀ
diagnostic-heading-warning = ਚੇਤਾਵਨੀ
diagnostic-heading-information = ਜਾਣਕਾਰੀ
diagnostic-heading-hint = ਸੰਕੇਤ
accessibility-heading-level-1 = WCAG AA ਪਹੁੰਚਯੋਗਤਾ ਉਲੰਘਣਾ
accessibility-heading-level-2 = ਪਹੁੰਚਯੋਗਤਾ ਚੇਤਾਵਨੀ
something-went-wrong = ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ।
renderer-load-failed = ਇੱਕ ਰੈਂਡਰਰ ਲੋਡ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਸਫ਼ਾ ਮੁੜ ਲੋਡ ਕਰੋ।
core-start-failed = ਦਸਤਾਵੇਜ਼ ਦਰਸ਼ਕ ਸ਼ੁਰੂ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਸਫ਼ਾ ਮੁੜ ਲੋਡ ਕਰੋ।
