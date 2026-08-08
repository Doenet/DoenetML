# Yiddish editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written — and they stay
# left-to-right runs inside a right-to-left sentence, which the bidi algorithm
# handles and this file does nothing about.
#
# The arrow at the end of the two link messages is direction rather than
# punctuation, so it is written pointing the way a Yiddish reader is going.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] שטעל צוריק
       *[update] דערפֿריש
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } דעם ווייַזער
       *[other] { $word } דעם ווייַזער { $shortcut }
    }


## The variant picker

editor-variant = וואַריאַנט
editor-variant-filter = פֿילטער…
editor-variant-next = קלייַב אויס דעם קומענדיקן וואַריאַנט
editor-variant-previous = קלייַב אויס דעם פֿריִערדיקן וואַריאַנט


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] אַן איבערטרעטונג פֿון צוטריטלעכקייט לויט WCAG AA איז געפֿונען געוואָרן. קליקט צו { $action ->
            [close] פֿאַרמאַכן
           *[open] עפֿענען
        } דעם באַריכט וועגן צוטריטלעכקייט.
        [advisories] קליקט צו { $action ->
            [close] פֿאַרמאַכן
           *[open] עפֿענען
        } דעם באַריכט וועגן צוטריטלעכקייט. קיין איבערטרעטונגען לויט WCAG AA זייַנען ניט געפֿונען געוואָרן, אָבער עס זייַנען פֿאַראַן נאָך רעקאָמענדאַציעס וועגן צוטריטלעכקייט.
       *[clean] קליקט צו { $action ->
            [close] פֿאַרמאַכן
           *[open] עפֿענען
        } דעם באַריכט וועגן צוטריטלעכקייט. קיין פּראָבלעמען מיט צוטריטלעכקייט זייַנען ניט געפֿונען געוואָרן.
    }

editor-accessibility-label =
    { $status ->
        [violations] אַן איבערטרעטונג פֿון צוטריטלעכקייט לויט WCAG AA איז געפֿונען געוואָרן. געפֿונען { $count ->
            [one] { $count } איבערטרעטונג לויט WCAG AA
           *[other] { $count } איבערטרעטונגען לויט WCAG AA
        }. קליקט צו { $action ->
            [close] פֿאַרמאַכן
           *[open] עפֿענען
        } דעם באַריכט וועגן צוטריטלעכקייט.
        [advisories] קיין איבערטרעטונגען לויט WCAG AA זייַנען ניט געפֿונען געוואָרן. געפֿונען { $count ->
            [one] נאָך { $count } רעקאָמענדאַציע וועגן צוטריטלעכקייט
           *[other] נאָך { $count } רעקאָמענדאַציעס וועגן צוטריטלעכקייט
        }. קליקט צו { $action ->
            [close] פֿאַרמאַכן
           *[open] עפֿענען
        } דעם באַריכט וועגן צוטריטלעכקייט.
       *[clean] קיין איבערטרעטונגען לויט WCAG AA זייַנען ניט געפֿונען געוואָרן. קליקט צו { $action ->
            [close] פֿאַרמאַכן
           *[open] עפֿענען
        } דעם באַריכט וועגן צוטריטלעכקייט.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ווערסיע { $version }

editor-tab-help = הילף לויטן קאָנטעקסט
editor-tab-help-short = קאָנטעקסט
editor-tab-errors = טעותן
editor-tab-warnings = וואָרענונגען
editor-tab-info = אינפֿאָרמאַציע
editor-tab-accessibility = צוטריטלעכקייט
editor-tab-responses = געשיקטע ענטפֿערס

editor-tab-with-count = { $label }: { $count }

editor-options = אייַנשטעלונגען פֿונעם רעדאַקטאָר
editor-format-as-doenetml = פֿאָרמאַטיר ווי DoenetML
editor-format-as-xml = פֿאָרמאַטיר ווי XML


## The diagnostics panel

editor-diagnostic-line = ליניע נומ׳ { $line }

editor-no-errors = קיין טעותן ניטאָ
editor-no-warnings = קיין וואָרענונגען ניטאָ
editor-no-info = קיין אינפֿאָרמאַטיווע מעלדונגען ניטאָ

editor-show-info-annotations = ווייַז אינפֿאָרמאַטיווע מעלדונגען אין רעדאַקטאָר
editor-show-accessibility-annotations = ווייַז מעלדונגען וועגן צוטריטלעכקייט אין רעדאַקטאָר

editor-accessibility-learn-more = ווי אַזוי Doenet באַהאַנדלט צוטריטלעכקייט

editor-accessibility-violations-heading = איבערטרעטונגען פֿון צוטריטלעכקייט ({ $standard })

editor-accessibility-other-heading = אַנדערע פּראָבלעמען מיט צוטריטלעכקייט
editor-none-found = גאָרנישט איז ניט געפֿונען געוואָרן


## Submitted responses

editor-no-responses = נאָך קיין געשיקטע ענטפֿערס ניטאָ
editor-response-answer-id = Id פֿונעם ענטפֿער
editor-response-response = ענטפֿער
editor-response-credit = קרעדיט
editor-response-submitted = געשיקט


## The context-help panel

help-placeholder = שטעלט דעם קורסאָר אויף אַ טעג־נאָמען, אַן אַטריבוט אָדער { $ref } פֿאַר דאָקומענטאַציע.

help-unsupported-ref-chain = הילף פֿאַר מערטיילדיקע רעפֿערענצן ווי { $example } איז נאָך ניט געשטיצט.

help-unresolved-ref =
    { $reason ->
        [notFound] קיין אָביעקט איז ניט געפֿונען געוואָרן פֿאַר דער רעפֿערענץ: { $ref }.
        [multiple] מער ווי איין אָביעקט איז געפֿונען געוואָרן פֿאַר דער רעפֿערענץ: { $ref }.
       *[indeterminate] דער אָביעקט פֿאַר { $ref } האָט זיך ניט געלאָזט באַשטימען.
    }

help-learn-about-references = לערנט זיך וועגן רעפֿערענצן →
help-reference-page = בלאַט פֿונעם רעפֿערענץ־ווערק →

help-suggestions-header =
    { $location ->
        [inside] אינעווייניק אין { $element }
       *[top] אויפֿן אויבערשטן ניוואָ
    }{ $allowed ->
        [none] { " — דאָ קומט גאָרנישט." }
        [text] { " — דאָ קענט איר טיפּן טעקסט." }
        [text-and-components] { " — דאָ קענט איר טיפּן טעקסט, אָדער פּרוּווט:" }
       *[components] { " — פּרוּווט:" }
    }

help-suggestions-footer = דריקט { $shortcut } צו זען אַלע { $total } קאָמפּאָנענטן.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } איז אַ רעפֿערענץ אויף { $target }.
       *[other] { $ref } איז אַ רעפֿערענץ אויף { $target } (ליניע { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] אַרייַנגעפֿירט דורך { $owner } ווי { $role }.
       *[other] אַרייַנגעפֿירט דורך { $owner } אויף ליניע { $line } ווי { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } איז אַ רעפֿערענץ אויף דער אייגנשאַפֿט { $property } פֿון { $element }.
       *[other] { $ref } איז אַ רעפֿערענץ אויף דער אייגנשאַפֿט { $property } פֿון { $element } (ליניע { $line }).
    }

help-kind-attribute = אַטריבוט
help-kind-snippet = אויסשניט
help-kind-array-entry = גליד פֿון אַ מאַסיוו

help-default = פֿאַרפֿעלט:
help-active-default = טעטיקער פֿאַרפֿעלט:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] דערלויבטע ווערטן (איינע פֿאַר יעדן גליד):
       *[other] דערלויבטע ווערטן:
    }

help-suggested-values = פֿאָרגעלייגטע ווערטן:

help-inserts = לייגט אַרייַן:

help-coordinates =
    { $count ->
        [one] קאָאָרדינאַט:
       *[other] קאָאָרדינאַטן:
    }

help-type = טיפּ:

help-resolved-style = דער אויסגערעכנטער סטיל (styleNumber { $styleNumber }):

help-resolved-function-names = די אויסגערעכנטע פֿונקציע־נעמען:
help-reset-list = רשימה פֿאַר צוריקשטעלן אויף דעם פֿעלד:
help-added-on-input = צוגעגעבן אויף דעם פֿעלד:
help-removed-on-input = אַרויסגענומען אויף דעם פֿעלד:

help-reset-overrides = { $reset } איז גובֿר אויף { $additional } און { $removed }.
