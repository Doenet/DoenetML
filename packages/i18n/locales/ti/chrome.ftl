# Tigrinya viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Tigrinya has two plural categories, and CLDR puts **zero** in the `one`
# branch with it, so nothing here can lean on the category to say "no ...".
# A noun does change shape for the plural — «ፈተነ» one attempt, «ፈተነታት»
# several — so the selects are kept and the noun changes inside them.
# `attempts-remaining` writes its own `[0]` branch, an exact-value match ahead
# of the category, which says «የልቦን» instead of counting to zero.
#
# The script is Ge'ez and reads left to right; nothing here needs a direction
# mark.


## Answer submission

answer-checking = ይምርምር ኣሎ...
answer-submitting = ይልእኽ ኣሎ...
answer-checking-status = መልሲ ይምርምር ኣሎ
answer-submitting-status = መልሲ ይልእኽ ኣሎ
answer-correct = ቅኑዕ
answer-incorrect = ጌጋ
answer-response-saved = መልሲ ተዓቂቡ
answer-percent-credit = ነጥቢ { $percent }%
answer-percent-correct = { $percent }% ቅኑዕ
answer-percent-short = { $percent } %
max-credit-available = ዝለዓለ ክርከብ ዝኽእል ነጥቢ፡ { $percent }%
attempts-remaining =
    { $count ->
        [0] ዝተረፈ ፈተነ የልቦን
        [one] { $count } ፈተነ ተሪፉ
       *[other] { $count } ፈተነታት ተሪፈን
    }
validation-correct = (ቅኑዕ)
validation-incorrect = (ጌጋ)
validation-partially-correct = (ብኸፊል ቅኑዕ)
answer-show-responses =
    { $count ->
        [one] { $count } መልሲ ናብ { $answerId } ኣርኢ
       *[other] { $count } መልስታት ናብ { $answerId } ኣርኢ
    }

## Disclosure panels

feedback-heading = ግብረ-መልሲ
collapsible-click-to-open = (ንምኽፋት ጠውቕ)
collapsible-click-to-close = (ንምዕጻው ጠውቕ)
collapsible-initializing = ይጅምር ኣሎ...
footnote-show = እግረ-ጽሑፍ ኣርኢ
footnote-hide = እግረ-ጽሑፍ ሕባእ
description-more-information = ተወሳኺ ሓበሬታ

## Controls

slider-previous = ዝሓለፈ
slider-next = ዝቕጽል
keyboard-open = ኪቦርድ ክፈት
keyboard-close = ኪቦርድ ዕጾ
choice-input-remove-choice = { $choice } ኣወግድ
matrix-remove-row = መስርዕ ኣወግድ
matrix-add-row = መስርዕ ወስኽ
matrix-remove-column = ዓምዲ ኣወግድ
matrix-add-column = ዓምዲ ወስኽ
subset-add-remove-points = ነጥብታት ወስኽ/ኣወግድ
subset-toggle-points-intervals = ኣብ መንጎ ነጥብታትን ክፍተታትን ቀያይር
subset-move-points = ነጥብታት ኣንቀሳቕስ
subset-clear = ኣጽሪ
# A `box` here is one orbital, drawn as a square: «ሳጹን».
orbital-add-row = መስርዕ ወስኽ
orbital-remove-row = መስርዕ ኣወግድ
orbital-add-box = ሳጹን ወስኽ
orbital-remove-box = ሳጹን ኣወግድ
orbital-add-up-arrow = ናብ ላዕሊ ዘመልክት ኮፍታ ወስኽ
orbital-add-down-arrow = ናብ ታሕቲ ዘመልክት ኮፍታ ወስኽ
orbital-remove-arrow = ኮፍታ ኣወግድ
orbital-row-label = ስም መስርዕ { $row }
pretzel-answer = መልሲ

## Math input

math-input-preview-region = ቅድመ-ትርኢት ናይ ሒሳብ መግለጺ
math-input-preview = ቅድመ-ትርኢት
math-input-invalid-expression = ዘይቅቡል መግለጺ፡

## Document status

viewer-initializing = ይጅምር ኣሎ...

## Errors

error-heading = ጌጋ
error-found-at =
    { $span ->
        [line] ኣብ መስመር { $startLine } ተረኺቡ።
       *[lines] ኣብ መስመራት { $startLine }–{ $endLine } ተረኺቡ።
    }
document-contains-errors = እዚ ሰነድ ጌጋታት ኣለውዎ!
diagnostic-heading-error = ጌጋ
diagnostic-heading-warning = መጠንቀቕታ
diagnostic-heading-information = ሓበሬታ
diagnostic-heading-hint = ፍንጪ
accessibility-heading-level-1 = ጥሕሰት ተበጻሕነት WCAG AA
accessibility-heading-level-2 = መጠንቀቕታ ተበጻሕነት
something-went-wrong = ገለ ጌጋ ኣጋጢሙ።
renderer-load-failed = ሓደ ኣርኣዪ ክጽዕን ኣይከኣለን። በጃኹም ገጽ ደጊምኩም ጽዓኑ።
core-start-failed = ኣርኣዪ ሰነድ ክጅምር ኣይከኣለን። በጃኹም ገጽ ደጊምኩም ጽዓኑ።
