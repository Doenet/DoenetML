# Hebrew viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register: impersonal throughout — a control is named by a verbal noun
# («הוספת שורה», not «הוסף שורה»), which also sidesteps Hebrew's gendered
# imperative, since the viewer does not know who is reading.
#
# Hebrew counts in three categories: one, two and other. `other` covers zero as
# well, so a message wanting a separate wording for none says `[0]` by number,
# as the English does — Fluent matches an explicit number before it consults
# the plural rules.


## Answer submission

answer-checking = בודק...
answer-submitting = שולח...
answer-checking-status = בודק את התשובה
answer-submitting-status = שולח את התשובה
answer-correct = נכון
answer-incorrect = לא נכון
answer-response-saved = התשובה נשמרה
answer-percent-credit = { $percent }% מהניקוד
answer-percent-correct = { $percent }% נכון
answer-percent-short = { $percent }%
max-credit-available = הניקוד המרבי האפשרי: { $percent }%
attempts-remaining =
    { $count ->
        [0] לא נותרו ניסיונות
        [one] נותר ניסיון אחד
        [two] נותרו שני ניסיונות
       *[other] נותרו { $count } ניסיונות
    }
# Named rather than adjectival: read aloud after a field's own name, a bare
# «(נכונה)» would leave a listener to guess what it agreed with.
validation-correct = (תשובה נכונה)
validation-incorrect = (תשובה לא נכונה)
validation-partially-correct = (תשובה נכונה חלקית)
answer-show-responses =
    { $count ->
        [one] הצגת תשובה אחת שנשלחה אל { $answerId }
        [two] הצגת שתי תשובות שנשלחו אל { $answerId }
       *[other] הצגת { $count } תשובות שנשלחו אל { $answerId }
    }

## Disclosure panels

feedback-heading = משוב
collapsible-click-to-open = (לחיצה לפתיחה)
collapsible-click-to-close = (לחיצה לסגירה)
collapsible-initializing = מאתחל...
footnote-show = הצגת הערת השוליים
footnote-hide = הסתרת הערת השוליים
description-more-information = מידע נוסף

## Controls

slider-previous = הקודם
slider-next = הבא
keyboard-open = פתיחת המקלדת
keyboard-close = סגירת המקלדת
choice-input-remove-choice = הסרת { $choice }
matrix-remove-row = הסרת שורה
matrix-add-row = הוספת שורה
matrix-remove-column = הסרת עמודה
matrix-add-column = הוספת עמודה
subset-add-remove-points = הוספת/הסרת נקודות
subset-toggle-points-intervals = מעבר בין נקודות לקטעים
subset-move-points = הזזת נקודות
subset-clear = ניקוי
orbital-add-row = הוספת שורה
orbital-remove-row = הסרת שורה
orbital-add-box = הוספת תא
orbital-remove-box = הסרת תא
orbital-add-up-arrow = הוספת חץ למעלה
orbital-add-down-arrow = הוספת חץ למטה
orbital-remove-arrow = הסרת חץ
orbital-row-label = תווית לשורה { $row }
pretzel-answer = תשובה

## Math input

math-input-preview-region = תצוגה מקדימה של הביטוי המתמטי
math-input-preview = תצוגה מקדימה
math-input-invalid-expression = ביטוי לא תקין:

## Document status

viewer-initializing = מאתחל...

## Errors

error-heading = שגיאה
error-found-at =
    { $span ->
        [line] נמצאה בשורה { $startLine }.
       *[lines] נמצאה בשורות { $startLine } עד { $endLine }.
    }
document-contains-errors = במסמך הזה יש שגיאות!
# Headings of the tooltip the editor shows over a squiggle.
diagnostic-heading-error = שגיאה
diagnostic-heading-warning = אזהרה
diagnostic-heading-information = מידע
diagnostic-heading-hint = רמז
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = הפרת נגישות לפי WCAG AA
accessibility-heading-level-2 = התראת נגישות
something-went-wrong = משהו השתבש.
# Follows `error-heading` and a colon.
renderer-load-failed = טעינת אחד הרכיבים נכשלה. יש לטעון מחדש את העמוד.
core-start-failed = הפעלת מציג המסמך נכשלה. יש לטעון מחדש את העמוד.
