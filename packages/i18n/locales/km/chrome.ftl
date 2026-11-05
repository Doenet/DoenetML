# Khmer viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Khmer has a single plural category, so a countable message needs no
# selection — `[other]` covers every count. `[0]` is still spelled out where
# the English wording changes for zero, because that is a different sentence
# rather than a different number. A noun is not marked for number, so
# «{ $count } ឱកាស» is both "1 attempt" and "5 attempts".
#
# Sentence-final «។» and the colon «៖» are Khmer punctuation and replace the
# Latin period and colon wherever a whole sentence or a label ends.
#
# Numbers render in Latin digits rather than in Khmer numerals, which is the
# digit policy in the package README and what Cambodian schoolbooks print.


## Answer submission

answer-checking = កំពុងពិនិត្យ...
answer-submitting = កំពុងដាក់ស្នើ...
answer-checking-status = កំពុងពិនិត្យចម្លើយ
answer-submitting-status = កំពុងដាក់ស្នើចម្លើយ
answer-correct = ត្រឹមត្រូវ
answer-incorrect = មិនត្រឹមត្រូវ
answer-response-saved = បានរក្សាទុកចម្លើយ
answer-percent-credit = ពិន្ទុ { $percent }%
answer-percent-correct = ត្រឹមត្រូវ { $percent }%
answer-percent-short = { $percent }%
max-credit-available = ពិន្ទុអតិបរមាដែលអាចទទួលបាន៖ { $percent }%
# `[0]` is a numeric literal, matched against the count itself rather than
# against a plural category, so Khmer's having a single category does not make
# it unreachable the way it did the `[one]` branch that used to sit below it.
# It stays: zero is a different sentence here, not a different number.
attempts-remaining =
    { $count ->
        [0] គ្មានការប៉ុនប៉ងនៅសល់ទេ
       *[other] នៅសល់ការប៉ុនប៉ងចំនួន { $count } ដង
    }
validation-correct = (ត្រឹមត្រូវ)
validation-incorrect = (មិនត្រឹមត្រូវ)
validation-partially-correct = (ត្រឹមត្រូវខ្លះ)
answer-show-responses = បង្ហាញការឆ្លើយតបចំនួន { $count } ទៅកាន់ { $answerId }

## Disclosure panels

feedback-heading = មតិយោបល់
collapsible-click-to-open = (ចុចដើម្បីបើក)
collapsible-click-to-close = (ចុចដើម្បីបិទ)
collapsible-initializing = កំពុងចាប់ផ្ដើម...
footnote-show = បង្ហាញលេខយោង
footnote-hide = លាក់លេខយោង
description-more-information = ព័ត៌មានបន្ថែម

## Controls

slider-previous = មុន
slider-next = បន្ទាប់
keyboard-open = បើកក្ដារចុច
keyboard-close = បិទក្ដារចុច
choice-input-remove-choice = ដក { $choice } ចេញ
matrix-remove-row = លុបជួរដេក
matrix-add-row = បន្ថែមជួរដេក
matrix-remove-column = លុបជួរឈរ
matrix-add-column = បន្ថែមជួរឈរ
subset-add-remove-points = បន្ថែម/ដកចំណុច
subset-toggle-points-intervals = ប្ដូររវាងចំណុច និងចន្លោះ
subset-move-points = ផ្លាស់ទីចំណុច
subset-clear = សម្អាត
orbital-add-row = បន្ថែមជួរដេក
orbital-remove-row = លុបជួរដេក
orbital-add-box = បន្ថែមប្រអប់
orbital-remove-box = លុបប្រអប់
orbital-add-up-arrow = បន្ថែមព្រួញឡើងលើ
orbital-add-down-arrow = បន្ថែមព្រួញចុះក្រោម
orbital-remove-arrow = លុបព្រួញ
orbital-row-label = ស្លាកសម្រាប់ជួរដេកទី { $row }
pretzel-answer = ចម្លើយ

## Math input

math-input-preview-region = ការមើលកន្សោមគណិតវិទ្យាជាមុន
math-input-preview = មើលជាមុន
math-input-invalid-expression = កន្សោមមិនត្រឹមត្រូវ៖

## Document status

viewer-initializing = កំពុងចាប់ផ្ដើម...

## Errors

error-heading = កំហុស
error-found-at =
    { $span ->
        [line] រកឃើញនៅបន្ទាត់ទី { $startLine }។
       *[lines] រកឃើញនៅបន្ទាត់ទី { $startLine }–{ $endLine }។
    }
document-contains-errors = ឯកសារនេះមានកំហុស!
diagnostic-heading-error = កំហុស
diagnostic-heading-warning = ការព្រមាន
diagnostic-heading-information = ព័ត៌មាន
diagnostic-heading-hint = ការណែនាំ
accessibility-heading-level-1 = ការបំពានលទ្ធភាពប្រើប្រាស់ WCAG AA
accessibility-heading-level-2 = ការជូនដំណឹងអំពីលទ្ធភាពប្រើប្រាស់
something-went-wrong = មានបញ្ហាកើតឡើង។
renderer-load-failed = កម្មវិធីបង្ហាញមួយផ្ទុកមិនបានទេ។ សូមផ្ទុកទំព័រឡើងវិញ។
core-start-failed = មិនអាចចាប់ផ្ដើមកម្មវិធីមើលឯកសារបានទេ។ សូមផ្ទុកទំព័រឡើងវិញ។
