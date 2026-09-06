# Yiddish viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written right to left, in logical order: the characters below are in the
# order the words are spoken, and the bidi algorithm draws them. Brackets and
# parentheses are written opening-first and turn around at render time. Digits
# stay Latin, as everywhere else in these catalogs.
#
# Yiddish counts in two plural categories, `one` and `other`, and unlike
# Persian its `one` does not catch zero — which is why the wording for none is
# spelled out in `[0]` rather than left to a category.
#
# A Yiddish noun after a numeral does take the plural, so the counted messages
# keep their selects rather than collapsing to one form.


## Answer submission

answer-checking = קאָנטראָלירן…
answer-submitting = שיקן…
answer-checking-status = קאָנטראָלירן דעם ענטפֿער
answer-submitting-status = שיקן דעם ענטפֿער
answer-correct = ריכטיק
answer-incorrect = ניט ריכטיק
answer-response-saved = דער ענטפֿער איז אייַנגעהיט
answer-percent-credit = { $percent }% קרעדיט
answer-percent-correct = { $percent }% ריכטיק
answer-percent-short = { $percent } %
max-credit-available = מאַקסימאַלער מעגלעכער קרעדיט: { $percent }%
attempts-remaining =
    { $count ->
        [0] קיין פּרוּוון זייַנען ניט געבליבן
        [one] עס איז געבליבן { $count } פּרוּוו
       *[other] עס זייַנען געבליבן { $count } פּרוּוון
    }
validation-correct = (ריכטיק)
validation-incorrect = (ניט ריכטיק)
validation-partially-correct = (טיילווייַז ריכטיק)
answer-show-responses =
    { $count ->
        [one] ווייַז { $count } ענטפֿער אויף { $answerId }
       *[other] ווייַז { $count } ענטפֿערס אויף { $answerId }
    }

## Disclosure panels

feedback-heading = אָפּרוף
collapsible-click-to-open = (קליק צו עפֿענען)
collapsible-click-to-close = (קליק צו פֿאַרמאַכן)
collapsible-initializing = אָנהייבן…
footnote-show = ווייַז די פֿוסנאָטע
footnote-hide = באַהאַלט די פֿוסנאָטע
description-more-information = מער אינפֿאָרמאַציע

## Controls

slider-previous = צוריק
slider-next = ווייַטער
keyboard-open = עפֿן די קלאַוויאַטור
keyboard-close = פֿאַרמאַך די קלאַוויאַטור
choice-input-remove-choice = נעם אַרויס { $choice }
matrix-remove-row = נעם אַרויס אַ רייע
matrix-add-row = גיב צו אַ רייע
matrix-remove-column = נעם אַרויס אַ זייַל
matrix-add-column = גיב צו אַ זייַל
subset-add-remove-points = גיב צו/נעם אַרויס פּונקטן
subset-toggle-points-intervals = בייַט צווישן פּונקטן און אינטערוואַלן
subset-move-points = רוק די פּונקטן
subset-clear = רייניק אויס
orbital-add-row = גיב צו אַ רייע
orbital-remove-row = נעם אַרויס אַ רייע
orbital-add-box = גיב צו אַ קעסטל
orbital-remove-box = נעם אַרויס אַ קעסטל
orbital-add-up-arrow = גיב צו אַ פֿייַל אַרויף
orbital-add-down-arrow = גיב צו אַ פֿייַל אַראָפּ
orbital-remove-arrow = נעם אַרויס אַ פֿייַל
orbital-row-label = צייכן פֿאַר רייע { $row }
pretzel-answer = ענטפֿער

## Math input

math-input-preview-region = פֿאָרויסבליק פֿונעם מאַטעמאַטישן אויסדרוק
math-input-preview = פֿאָרויסבליק
math-input-invalid-expression = אומגילטיקער אויסדרוק:

## Document status

viewer-initializing = אָנהייבן…

## Errors

error-heading = טעות
error-found-at =
    { $span ->
        [line] געפֿונען אויף ליניע { $startLine }.
       *[lines] געפֿונען אויף ליניעס { $startLine }–{ $endLine }.
    }
document-contains-errors = דער דאָקומענט אַנטהאַלט טעותן!
diagnostic-heading-error = טעות
diagnostic-heading-warning = וואָרענונג
diagnostic-heading-information = אינפֿאָרמאַציע
diagnostic-heading-hint = אָנווייַז
accessibility-heading-level-1 = איבערטרעטונג פֿון צוטריטלעכקייט לויט WCAG AA
accessibility-heading-level-2 = וואָרענונג וועגן צוטריטלעכקייט
something-went-wrong = עפּעס איז ניט געגאַנגען ווי געהעריק.
renderer-load-failed = אַ מאָדול פֿאַרן ווייַזן האָט זיך ניט אַרויפֿגעלאָדן. לאָדט איבער די בלאַט.
core-start-failed = דער דאָקומענט־ווייַזער האָט זיך ניט געקענט אָנהייבן. לאָדט איבער די בלאַט.
