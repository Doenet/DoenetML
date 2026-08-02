# Sindhi editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register as in `chrome.ftl`: the polite plural.
#
# Counting as in `chrome.ftl` too: a Sindhi noun after a numeral takes the
# plural, so `editor-accessibility-label` branches on `one` rather than
# reporting «1 ڀڃڪڙيون».
#
# Where English interpolates a bare verb — "Click to { $action } accessibility
# report" — Sindhi puts its verb at the end of the clause and cannot take one
# dropped into the middle, so the selector carries the whole sentence. Fluent
# does not care where a select sits inside a pattern.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ٻيهر ترتيب
       *[update] تازو ڪريو
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] ناظر { $word }
       *[other] ناظر { $word } { $shortcut }
    }


## The variant picker

editor-variant = نسخو
editor-variant-filter = ڇاڻيو...
editor-variant-next = ايندڙ نسخو چونڊيو
editor-variant-previous = پويون نسخو چونڊيو


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA موجب رسائي جي ڀڃڪڙي ملي. { $action ->
            [close] رسائي جي رپورٽ بند ڪرڻ لاءِ ڪلڪ ڪريو.
           *[open] رسائي جي رپورٽ کولڻ لاءِ ڪلڪ ڪريو.
        }
        [advisories] { $action ->
            [close] رسائي جي رپورٽ بند ڪرڻ لاءِ ڪلڪ ڪريو.
           *[open] رسائي جي رپورٽ کولڻ لاءِ ڪلڪ ڪريو.
        } WCAG AA جي ڪا به ڀڃڪڙي نه ملي، پر رسائي بابت ٻيون صلاحون موجود آهن.
       *[clean] { $action ->
            [close] رسائي جي رپورٽ بند ڪرڻ لاءِ ڪلڪ ڪريو.
           *[open] رسائي جي رپورٽ کولڻ لاءِ ڪلڪ ڪريو.
        } رسائي بابت ڪو مسئلو نه مليو.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA موجب رسائي جي ڀڃڪڙي ملي. { $count ->
            [one] WCAG AA جي { $count } ڀڃڪڙي ملي.
           *[other] WCAG AA جون { $count } ڀڃڪڙيون مليون.
        } { $action ->
            [close] رسائي جي رپورٽ بند ڪرڻ لاءِ ڪلڪ ڪريو.
           *[open] رسائي جي رپورٽ کولڻ لاءِ ڪلڪ ڪريو.
        }
        [advisories] WCAG AA جي ڪا به ڀڃڪڙي نه ملي. { $count ->
            [one] رسائي بابت { $count } ٻي صلاح ملي.
           *[other] رسائي بابت { $count } ٻيون صلاحون مليون.
        } { $action ->
            [close] رسائي جي رپورٽ بند ڪرڻ لاءِ ڪلڪ ڪريو.
           *[open] رسائي جي رپورٽ کولڻ لاءِ ڪلڪ ڪريو.
        }
       *[clean] WCAG AA جي ڪا به ڀڃڪڙي نه ملي. { $action ->
            [close] رسائي جي رپورٽ بند ڪرڻ لاءِ ڪلڪ ڪريو.
           *[open] رسائي جي رپورٽ کولڻ لاءِ ڪلڪ ڪريو.
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML جو نسخو { $version }

editor-tab-help = سياق موجب مدد
editor-tab-help-short = سياق
editor-tab-errors = خرابيون
editor-tab-warnings = خبرداريون
editor-tab-info = ڄاڻ
editor-tab-accessibility = رسائي
editor-tab-responses = موڪليل جواب

editor-tab-with-count = { $label }: { $count }

editor-options = ايڊيٽر جون ترتيبون
editor-format-as-doenetml = DoenetML جي صورت ۾ ترتيب ڏيو
editor-format-as-xml = XML جي صورت ۾ ترتيب ڏيو


## The diagnostics panel

editor-diagnostic-line = سٽ نمبر { $line }

editor-no-errors = ڪا خرابي ناهي
editor-no-warnings = ڪا خبرداري ناهي
editor-no-info = ڪا ڄاڻ واري تشخيص ناهي

editor-show-info-annotations = ايڊيٽر ۾ ڄاڻ واريون تشخيصون ڏيکاريو
editor-show-accessibility-annotations = ايڊيٽر ۾ رسائي جون تشخيصون ڏيکاريو

editor-accessibility-learn-more = رسائي بابت Doenet جو طريقو ڄاڻو

editor-accessibility-violations-heading = رسائي جون ڀڃڪڙيون ({ $standard })

editor-accessibility-other-heading = رسائي جا ٻيا مسئلا
editor-none-found = ڪجهه نه مليو


## Submitted responses

editor-no-responses = اڃا ڪو جواب نه موڪليو ويو آهي
editor-response-answer-id = جواب جي سڃاڻپ
editor-response-response = جواب
editor-response-credit = نمبر
editor-response-submitted = موڪلڻ جو وقت


## The context-help panel

help-placeholder = دستاويز ڏسڻ لاءِ ڪرسر ڪنهن عنصر جي نالي، ڪنهن خاصيت يا { $ref } تي رکو.

help-unsupported-ref-chain = { $example } جهڙن گهڻ حصن وارن حوالن لاءِ مدد اڃا موجود ناهي.

help-unresolved-ref =
    { $reason ->
        [notFound] { $ref } جنهن عنصر ڏانهن اشارو ڪري ٿو، اهو نه مليو.
        [multiple] { $ref } جن عنصرن ڏانهن اشارو ڪري ٿو، اهي هڪ کان وڌيڪ آهن.
       *[indeterminate] { $ref } ڪهڙي عنصر ڏانهن اشارو ڪري ٿو، اهو طئي نه ٿي سگهيو.
    }

# The arrow is direction rather than punctuation, and Sindhi runs the other
# way, so it points where the reader is going.
help-learn-about-references = حوالن بابت ڄاڻو ←
help-reference-page = حوالي جو صفحو ←

help-suggestions-header =
    { $location ->
        [inside] { $element } جي اندر
       *[top] مٿئين سطح تي
    }{ $allowed ->
        [none] { " — هتي ڪجهه به نٿو اچي." }
        [text] { " — هتي متن لکي سگهجي ٿو." }
        [text-and-components] { " — هتي متن لکي سگهجي ٿو، يا هي آزمايو:" }
       *[components] { " — آزمائڻ لاءِ شيون:" }
    }

help-suggestions-footer = سڀ { $total } جزا ڏسڻ لاءِ { $shortcut } دٻايو.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target } ڏانهن حوالو آهي.
       *[other] { $ref } { $target } ڏانهن حوالو آهي (سٽ { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] هن کي { $owner } { $role } جي حيثيت سان متعارف ڪرايو.
       *[other] هن کي { $owner } سٽ { $line } تي { $role } جي حيثيت سان متعارف ڪرايو.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element } جي { $property } خاصيت ڏانهن حوالو آهي.
       *[other] { $ref } { $element } جي { $property } خاصيت ڏانهن حوالو آهي (سٽ { $line }).
    }

help-kind-attribute = خاصيت
help-kind-snippet = ٽڪرو
help-kind-array-entry = صف جو عنصر

help-default = ڊفالٽ قدر:
help-active-default = فعال ڊفالٽ قدر:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] جائز قدر (هر عنصر لاءِ هڪ):
       *[other] جائز قدر:
    }

help-suggested-values = تجويز ڪيل قدر:

help-inserts = داخل ڪري ٿو:

help-coordinates =
    { $count ->
        [one] ڪوآرڊينيٽ:
       *[other] ڪوآرڊينيٽ:
    }

help-type = قسم:

help-resolved-style = طئي ٿيل انداز (styleNumber { $styleNumber }):

help-resolved-function-names = طئي ٿيل فنڪشن جا نالا:
help-reset-list = هن داخلا تي فهرست ٻيهر ترتيب ڏيو:
help-added-on-input = هن داخلا تي شامل ٿيو:
help-removed-on-input = هن داخلا تي هٽايو ويو:

help-reset-overrides = { $reset } کي { $additional } ۽ { $removed } تي ترجيح آهي.
