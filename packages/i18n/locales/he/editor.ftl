# Hebrew editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register as in `chrome.ftl`: verbal nouns for controls, and «יש ל…» for an
# instruction, which is impersonal and ungendered.
#
# Where English interpolates a bare verb — "Click to { $action } accessibility
# report" — the Hebrew infinitive cannot be dropped into the middle of the
# clause the same way, so the selector carries the whole sentence. Fluent does
# not care where a select sits inside a pattern.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] איפוס
       *[update] עדכון
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } המציג
       *[other] { $word } המציג { $shortcut }
    }


## The variant picker

editor-variant = גרסה
editor-variant-filter = סינון...
editor-variant-next = בחירת הגרסה הבאה
editor-variant-previous = בחירת הגרסה הקודמת


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] זוהתה הפרת נגישות לפי WCAG AA. { $action ->
            [close] לחיצה תסגור את דוח הנגישות.
           *[open] לחיצה תפתח את דוח הנגישות.
        }
        [advisories] { $action ->
            [close] לחיצה תסגור את דוח הנגישות.
           *[open] לחיצה תפתח את דוח הנגישות.
        } לא נמצאו הפרות של WCAG AA, אך יש המלצות נגישות נוספות.
       *[clean] { $action ->
            [close] לחיצה תסגור את דוח הנגישות.
           *[open] לחיצה תפתח את דוח הנגישות.
        } לא נמצאו בעיות נגישות.
    }

editor-accessibility-label =
    { $status ->
        [violations] זוהתה הפרת נגישות לפי WCAG AA. { $count ->
            [one] נמצאה הפרה אחת של WCAG AA.
            [two] נמצאו שתי הפרות של WCAG AA.
           *[other] נמצאו { $count } הפרות של WCAG AA.
        } { $action ->
            [close] לחיצה תסגור את דוח הנגישות.
           *[open] לחיצה תפתח את דוח הנגישות.
        }
        [advisories] לא זוהו הפרות של WCAG AA. { $count ->
            [one] נמצאה המלצת נגישות נוספת אחת.
            [two] נמצאו שתי המלצות נגישות נוספות.
           *[other] נמצאו { $count } המלצות נגישות נוספות.
        } { $action ->
            [close] לחיצה תסגור את דוח הנגישות.
           *[open] לחיצה תפתח את דוח הנגישות.
        }
       *[clean] לא זוהו הפרות של WCAG AA. { $action ->
            [close] לחיצה תסגור את דוח הנגישות.
           *[open] לחיצה תפתח את דוח הנגישות.
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = גרסת DoenetML { $version }

editor-tab-help = עזרה תלוית הקשר
editor-tab-help-short = הקשר
editor-tab-errors = שגיאות
editor-tab-warnings = אזהרות
editor-tab-info = מידע
editor-tab-accessibility = נגישות
editor-tab-responses = תשובות שנשלחו

editor-tab-with-count = { $label }: { $count }

editor-options = הגדרות העורך
editor-format-as-doenetml = עיצוב כ־DoenetML
editor-format-as-xml = עיצוב כ־XML


## The diagnostics panel

editor-diagnostic-line = שורה מס' { $line }

editor-no-errors = אין שגיאות
editor-no-warnings = אין אזהרות
editor-no-info = אין אבחונים מידעיים

editor-show-info-annotations = הצגת אבחונים מידעיים בעורך
editor-show-accessibility-annotations = הצגת אבחוני נגישות בעורך

editor-accessibility-learn-more = הכירו את גישת Doenet לנגישות

editor-accessibility-violations-heading = הפרות נגישות ({ $standard })

editor-accessibility-other-heading = בעיות נגישות אחרות
editor-none-found = לא נמצא דבר


## Submitted responses

editor-no-responses = עדיין לא נשלחו תשובות
editor-response-answer-id = מזהה התשובה
editor-response-response = תשובה
editor-response-credit = ניקוד
editor-response-submitted = מועד השליחה


## The context-help panel

help-placeholder = יש למקם את הסמן על שם של אלמנט, על מאפיין או על { $ref } כדי לראות תיעוד.

help-unsupported-ref-chain = עזרה להפניות מרובות חלקים כמו { $example } עדיין אינה נתמכת.

help-unresolved-ref =
    { $reason ->
        [notFound] לא נמצא אלמנט ש־{ $ref } מפנה אליו.
        [multiple] נמצא יותר מאלמנט אחד ש־{ $ref } מפנה אליו.
       *[indeterminate] לא ניתן היה לקבוע לאיזה אלמנט { $ref } מפנה.
    }

# The arrow is direction rather than punctuation, and Hebrew runs the other
# way, so it points where the reader is going.
help-learn-about-references = הכירו את ההפניות ←
help-reference-page = דף העיון ←

help-suggestions-header =
    { $location ->
        [inside] בתוך { $element }
       *[top] ברמה העליונה
    }{ $allowed ->
        [none] { " — כאן לא נכנס דבר." }
        [text] { " — אפשר לכתוב כאן טקסט." }
        [text-and-components] { " — אפשר לכתוב כאן טקסט, או לנסות:" }
       *[components] { " — דברים לנסות:" }
    }

help-suggestions-footer = לחיצה על { $shortcut } תציג את כל { $total } הרכיבים.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } מפנה אל { $target }.
       *[other] { $ref } מפנה אל { $target } (שורה { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } הציג אותו בתור { $role }.
       *[other] { $owner } הציג אותו בשורה { $line } בתור { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } מפנה אל המאפיין { $property } של { $element }.
       *[other] { $ref } מפנה אל המאפיין { $property } של { $element } (שורה { $line }).
    }

help-kind-attribute = מאפיין
help-kind-snippet = קטע
help-kind-array-entry = איבר במערך

help-default = ברירת מחדל:
help-active-default = ברירת המחדל הפעילה:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ערכים מותרים (אחד לכל איבר):
       *[other] ערכים מותרים:
    }

help-suggested-values = ערכים מוצעים:

help-inserts = מוסיף:

help-coordinates =
    { $count ->
        [one] שיעור:
       *[other] שיעורים:
    }

help-type = סוג:

help-resolved-style = הסגנון המחושב (styleNumber { $styleNumber }):

help-resolved-function-names = שמות הפונקציות המחושבים:
help-reset-list = איפוס הרשימה בקלט הזה:
help-added-on-input = נוסף בקלט הזה:
help-removed-on-input = הוסר בקלט הזה:

help-reset-overrides = { $reset } גובר על { $additional } ועל { $removed }.
