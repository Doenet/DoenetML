# Amharic viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Amharic is written in the Ge'ez script, which runs left to right, so this
# needs none of the right-to-left support DoenetML lacks (#1614). It uses Latin
# digits, and Ge'ez punctuation for the full stop (።) and the comma (፣).
#
# Controls take the bare imperative, which is what Amharic puts on a button.


## Answer submission

answer-checking = በማረጋገጥ ላይ...
answer-submitting = በመላክ ላይ...
answer-checking-status = መልሱ በመረጋገጥ ላይ ነው
answer-submitting-status = መልሱ በመላክ ላይ ነው
answer-correct = ትክክል
answer-incorrect = ስህተት
answer-response-saved = መልሱ ተቀምጧል
answer-percent-credit = { $percent }% ነጥብ
answer-percent-correct = { $percent }% ትክክል
answer-percent-short = { $percent }%
max-credit-available = ከፍተኛው ሊገኝ የሚችል ነጥብ፦ { $percent }%
attempts-remaining =
    { $count ->
        [0] የቀረ ሙከራ የለም
        [one] { $count } ሙከራ ቀርቷል
       *[other] { $count } ሙከራዎች ቀርተዋል
    }
validation-correct = (ትክክል)
validation-incorrect = (ስህተት)
validation-partially-correct = (በከፊል ትክክል)
answer-show-responses =
    { $count ->
        [one] የ{ $answerId } { $count } መልስ አሳይ
       *[other] የ{ $answerId } { $count } መልሶች አሳይ
    }

## Disclosure panels

feedback-heading = አስተያየት
collapsible-click-to-open = (ለመክፈት ጠቅ ያድርጉ)
collapsible-click-to-close = (ለመዝጋት ጠቅ ያድርጉ)
collapsible-initializing = በመዘጋጀት ላይ...
footnote-show = የግርጌ ማስታወሻ አሳይ
footnote-hide = የግርጌ ማስታወሻ ደብቅ
description-more-information = ተጨማሪ መረጃ

## Controls

slider-previous = ቀዳሚ
slider-next = ቀጣይ
keyboard-open = ቁልፍ ሰሌዳ ክፈት
keyboard-close = ቁልፍ ሰሌዳ ዝጋ
choice-input-remove-choice = { $choice } አስወግድ
matrix-remove-row = ረድፍ አስወግድ
matrix-add-row = ረድፍ ጨምር
matrix-remove-column = ዓምድ አስወግድ
matrix-add-column = ዓምድ ጨምር
subset-add-remove-points = ነጥቦች ጨምር/አስወግድ
subset-toggle-points-intervals = በነጥቦችና በክፍተቶች መካከል ቀያይር
subset-move-points = ነጥቦችን አንቀሳቅስ
subset-clear = አጽዳ
# A `box` here is one orbital, drawn as a square: ሳጥን.
orbital-add-row = ረድፍ ጨምር
orbital-remove-row = ረድፍ አስወግድ
orbital-add-box = ሳጥን ጨምር
orbital-remove-box = ሳጥን አስወግድ
orbital-add-up-arrow = ወደ ላይ ቀስት ጨምር
orbital-add-down-arrow = ወደ ታች ቀስት ጨምር
orbital-remove-arrow = ቀስት አስወግድ
orbital-row-label = የረድፍ { $row } መለያ
pretzel-answer = መልስ

## Math input

math-input-preview-region = የሒሳብ አገላለጽ ቅድመ ዕይታ
math-input-preview = ቅድመ ዕይታ
math-input-invalid-expression = ልክ ያልሆነ አገላለጽ፦

## Document status

viewer-initializing = በመዘጋጀት ላይ...

## Errors

error-heading = ስህተት
error-found-at =
    { $span ->
        [line] በመስመር { $startLine } ላይ ተገኝቷል።
       *[lines] በመስመሮች { $startLine }–{ $endLine } ላይ ተገኝቷል።
    }
document-contains-errors = ይህ ሰነድ ስህተቶች አሉት።
diagnostic-heading-error = ስህተት
diagnostic-heading-warning = ማስጠንቀቂያ
diagnostic-heading-information = መረጃ
diagnostic-heading-hint = ፍንጭ
accessibility-heading-level-1 = የWCAG AA ተደራሽነት ጥሰት
accessibility-heading-level-2 = የተደራሽነት ማሳሰቢያ
something-went-wrong = የሆነ ስህተት ተከስቷል።
renderer-load-failed = አንድ አሳያ መጫን አልቻለም። እባክዎ ገጹን እንደገና ይጫኑ።
core-start-failed = የሰነድ መመልከቻው ሊጀመር አልቻለም። እባክዎ ገጹን እንደገና ይጫኑ።
