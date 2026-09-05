# Sinhala viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Sinhala has two plural categories, and its `one` catches **zero as well as
# one**: CLDR puts 0, 1 and 0.1 in `one` and everything else in `other`. So a
# `[one]` branch here has to read for zero too, which is why every message
# that says something different about zero keeps an explicit `[0]` branch in
# front of it rather than relying on the category.
#
# English `label` is rendered by the loanword «ලේබලය» rather than by «නම»,
# which is the word for *name*: `name` is a DoenetML attribute these same
# messages talk about, and using it here would point an author at the wrong
# attribute.
#
# Numbers render in Latin digits, which is what Sri Lankan schoolbooks print
# and what CLDR gives `si` as its default numbering system.


## Answer submission

answer-checking = පරීක්ෂා කරමින්...
answer-submitting = යොමු කරමින්...
answer-checking-status = පිළිතුර පරීක්ෂා කරමින්
answer-submitting-status = පිළිතුර යොමු කරමින්
answer-correct = නිවැරදියි
answer-incorrect = වැරදියි
answer-response-saved = පිළිතුර සුරකින ලදී
answer-percent-credit = ලකුණු { $percent }%
answer-percent-correct = නිවැරදි { $percent }%
answer-percent-short = { $percent }%
max-credit-available = ලබාගත හැකි උපරිම ලකුණු: { $percent }%
attempts-remaining =
    { $count ->
        [0] උත්සාහයන් ඉතිරි නැත
        [one] උත්සාහ { $count }ක් ඉතිරිව ඇත
       *[other] උත්සාහ { $count }ක් ඉතිරිව ඇත
    }
validation-correct = (නිවැරදියි)
validation-incorrect = (වැරදියි)
validation-partially-correct = (අර්ධ වශයෙන් නිවැරදියි)
answer-show-responses =
    { $count ->
        [one] { $answerId } වෙත යොමු කළ පිළිතුරු { $count } පෙන්වන්න
       *[other] { $answerId } වෙත යොමු කළ පිළිතුරු { $count } පෙන්වන්න
    }

## Disclosure panels

feedback-heading = ප්‍රතිපෝෂණ
collapsible-click-to-open = (විවෘත කිරීමට ක්ලික් කරන්න)
collapsible-click-to-close = (වැසීමට ක්ලික් කරන්න)
collapsible-initializing = ආරම්භ වෙමින්...
footnote-show = පාද සටහන පෙන්වන්න
footnote-hide = පාද සටහන සඟවන්න
description-more-information = වැඩි විස්තර

## Controls

slider-previous = පෙර
slider-next = මීළඟ
keyboard-open = යතුරුපුවරුව විවෘත කරන්න
keyboard-close = යතුරුපුවරුව වසන්න
choice-input-remove-choice = { $choice } ඉවත් කරන්න
matrix-remove-row = පේළිය ඉවත් කරන්න
matrix-add-row = පේළියක් එක් කරන්න
matrix-remove-column = තීරුව ඉවත් කරන්න
matrix-add-column = තීරුවක් එක් කරන්න
subset-add-remove-points = ලක්ෂ්‍ය එක් කරන්න/ඉවත් කරන්න
subset-toggle-points-intervals = ලක්ෂ්‍ය සහ අන්තර මාරු කරන්න
subset-move-points = ලක්ෂ්‍ය ගෙන යන්න
subset-clear = හිස් කරන්න
orbital-add-row = පේළියක් එක් කරන්න
orbital-remove-row = පේළිය ඉවත් කරන්න
orbital-add-box = කොටුවක් එක් කරන්න
orbital-remove-box = කොටුව ඉවත් කරන්න
orbital-add-up-arrow = ඉහළට ඊතලයක් එක් කරන්න
orbital-add-down-arrow = පහළට ඊතලයක් එක් කරන්න
orbital-remove-arrow = ඊතලය ඉවත් කරන්න
orbital-row-label = { $row } වන පේළියේ ලේබලය
pretzel-answer = පිළිතුර

## Math input

math-input-preview-region = ගණිත ප්‍රකාශන පෙරදසුන
math-input-preview = පෙරදසුන
math-input-invalid-expression = අවලංගු ප්‍රකාශනයකි:

## Document status

viewer-initializing = ආරම්භ වෙමින්...

## Errors

error-heading = දෝෂය
error-found-at =
    { $span ->
        [line] { $startLine } වන පේළියේ හමු විය.
       *[lines] { $startLine }–{ $endLine } පේළිවල හමු විය.
    }
document-contains-errors = මෙම ලේඛනයේ දෝෂ ඇත!
diagnostic-heading-error = දෝෂය
diagnostic-heading-warning = අනතුරු ඇඟවීම
diagnostic-heading-information = තොරතුරු
diagnostic-heading-hint = ඉඟිය
accessibility-heading-level-1 = WCAG AA ප්‍රවේශ්‍යතා උල්ලංඝනය
accessibility-heading-level-2 = ප්‍රවේශ්‍යතා දැනුම්දීම
something-went-wrong = යම් දෙයක් වැරදී ඇත.
renderer-load-failed = විදහාපාන්නෙකු පූරණය කිරීමට අසමත් විය. කරුණාකර පිටුව නැවත පූරණය කරන්න.
core-start-failed = ලේඛන දර්ශකය ආරම්භ කළ නොහැකි විය. කරුණාකර පිටුව නැවත පූරණය කරන්න.
