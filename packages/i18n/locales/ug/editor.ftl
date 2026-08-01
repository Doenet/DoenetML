# Uyghur editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register as in `chrome.ftl`: verbal nouns for controls.
#
# Where English interpolates a bare verb — "Click to { $action } accessibility
# report" — Uyghur puts its verb at the end of the clause and cannot take one
# dropped into the middle, so the selector carries the whole sentence. Fluent
# does not care where a select sits inside a pattern.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ئەسلىگە قايتۇرۇش
       *[update] يېڭىلاش
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] كۆرگۈچنى { $word }
       *[other] كۆرگۈچنى { $word } { $shortcut }
    }


## The variant picker

editor-variant = نۇسخا
editor-variant-filter = سۈزۈش...
editor-variant-next = كېيىنكى نۇسخىنى تاللاش
editor-variant-previous = ئالدىنقى نۇسخىنى تاللاش


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA بويىچە زىيارەت قۇلايلىقى بۇزۇلۇشى بايقالدى. { $action ->
            [close] زىيارەت قۇلايلىقى دوكلاتىنى يېپىش ئۈچۈن چېكىڭ.
           *[open] زىيارەت قۇلايلىقى دوكلاتىنى ئېچىش ئۈچۈن چېكىڭ.
        }
        [advisories] { $action ->
            [close] زىيارەت قۇلايلىقى دوكلاتىنى يېپىش ئۈچۈن چېكىڭ.
           *[open] زىيارەت قۇلايلىقى دوكلاتىنى ئېچىش ئۈچۈن چېكىڭ.
        } WCAG AA بۇزۇلۇشى تېپىلمىدى، لېكىن باشقا تەۋسىيەلەر بار.
       *[clean] { $action ->
            [close] زىيارەت قۇلايلىقى دوكلاتىنى يېپىش ئۈچۈن چېكىڭ.
           *[open] زىيارەت قۇلايلىقى دوكلاتىنى ئېچىش ئۈچۈن چېكىڭ.
        } زىيارەت قۇلايلىقىدا مەسىلە تېپىلمىدى.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA بويىچە زىيارەت قۇلايلىقى بۇزۇلۇشى بايقالدى. { $count } بۇزۇلۇش تېپىلدى. { $action ->
            [close] زىيارەت قۇلايلىقى دوكلاتىنى يېپىش ئۈچۈن چېكىڭ.
           *[open] زىيارەت قۇلايلىقى دوكلاتىنى ئېچىش ئۈچۈن چېكىڭ.
        }
        [advisories] WCAG AA بۇزۇلۇشى بايقالمىدى. { $count } قوشۇمچە تەۋسىيە تېپىلدى. { $action ->
            [close] زىيارەت قۇلايلىقى دوكلاتىنى يېپىش ئۈچۈن چېكىڭ.
           *[open] زىيارەت قۇلايلىقى دوكلاتىنى ئېچىش ئۈچۈن چېكىڭ.
        }
       *[clean] WCAG AA بۇزۇلۇشى بايقالمىدى. { $action ->
            [close] زىيارەت قۇلايلىقى دوكلاتىنى يېپىش ئۈچۈن چېكىڭ.
           *[open] زىيارەت قۇلايلىقى دوكلاتىنى ئېچىش ئۈچۈن چېكىڭ.
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML نۇسخىسى { $version }

editor-tab-help = مۇھىتقا ماس ياردەم
editor-tab-help-short = مۇھىت
editor-tab-errors = خاتالىقلار
editor-tab-warnings = ئاگاھلاندۇرۇشلار
editor-tab-info = ئۇچۇر
editor-tab-accessibility = زىيارەت قۇلايلىقى
editor-tab-responses = يوللانغان جاۋابلار

editor-tab-with-count = { $label }: { $count }

editor-options = تەھرىرلىگۈچ تەڭشەكلىرى
editor-format-as-doenetml = DoenetML شەكلىدە رەتلەش
editor-format-as-xml = XML شەكلىدە رەتلەش


## The diagnostics panel

editor-diagnostic-line = { $line } - قۇر

editor-no-errors = خاتالىق يوق
editor-no-warnings = ئاگاھلاندۇرۇش يوق
editor-no-info = ئۇچۇر دىئاگنوزى يوق

editor-show-info-annotations = تەھرىرلىگۈچتە ئۇچۇر دىئاگنوزلىرىنى كۆرسىتىش
editor-show-accessibility-annotations = تەھرىرلىگۈچتە زىيارەت قۇلايلىقى دىئاگنوزلىرىنى كۆرسىتىش

editor-accessibility-learn-more = Doenet نىڭ زىيارەت قۇلايلىقى ئۇسۇلىنى بىلىش

editor-accessibility-violations-heading = زىيارەت قۇلايلىقى بۇزۇلۇشلىرى ({ $standard })

editor-accessibility-other-heading = باشقا زىيارەت قۇلايلىقى مەسىلىلىرى
editor-none-found = ھېچنېمە تېپىلمىدى


## Submitted responses

editor-no-responses = تېخى جاۋاب يوللانمىدى
editor-response-answer-id = جاۋاب كىملىكى
editor-response-response = جاۋاب
editor-response-credit = نومۇر
editor-response-submitted = يوللانغان ۋاقىت


## The context-help panel

help-placeholder = ھۆججەتنى كۆرۈش ئۈچۈن نۇر بەلگىنى بىر ئېلېمېنت ئىسمى، خاسلىق ياكى { $ref } ئۈستىگە قويۇڭ.

help-unsupported-ref-chain = { $example } دەك كۆپ بۆلەكلىك نەقىللەر ئۈچۈن ياردەم تېخى يوق.

help-unresolved-ref =
    { $reason ->
        [notFound] { $ref } كۆرسەتكەن ئېلېمېنت تېپىلمىدى.
        [multiple] { $ref } كۆرسەتكەن ئېلېمېنت بىردىن كۆپ.
       *[indeterminate] { $ref } قايسى ئېلېمېنتنى كۆرسىتىدىغانلىقى ئېنىقلانمىدى.
    }

# The arrow is direction rather than punctuation, and Uyghur runs the other
# way, so it points where the reader is going.
help-learn-about-references = نەقىللەر ھەققىدە بىلىش ←
help-reference-page = پايدىلىنىش بېتى ←

help-suggestions-header =
    { $location ->
        [inside] { $element } ئىچىدە
       *[top] ئەڭ يۇقىرى قەۋەتتە
    }{ $allowed ->
        [none] { " — بۇ يەرگە ھېچنېمە كەلمەيدۇ." }
        [text] { " — بۇ يەرگە تېكىست يازغىلى بولىدۇ." }
        [text-and-components] { " — بۇ يەرگە تېكىست يازغىلى بولىدۇ، ياكى بۇلارنى سىناڭ:" }
       *[components] { " — سىنايدىغان نەرسىلەر:" }
    }

help-suggestions-footer = بارلىق { $total } بۆلەكنى كۆرۈش ئۈچۈن { $shortcut } نى بېسىڭ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } بولسا { $target } غا بولغان نەقىل.
       *[other] { $ref } بولسا { $target } غا بولغان نەقىل ({ $line } - قۇر).
    }

help-ref-derived-from =
    { $line ->
        [none] بۇنى { $owner } { $role } سۈپىتىدە كىرگۈزگەن.
       *[other] بۇنى { $owner } { $line } - قۇردا { $role } سۈپىتىدە كىرگۈزگەن.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } بولسا { $element } نىڭ { $property } خاسلىقىغا بولغان نەقىل.
       *[other] { $ref } بولسا { $element } نىڭ { $property } خاسلىقىغا بولغان نەقىل ({ $line } - قۇر).
    }

help-kind-attribute = خاسلىق
help-kind-snippet = پارچە
help-kind-array-entry = سانلار قاتارىنىڭ ئەزاسى

help-default = كۆڭۈلدىكى قىممەت:
help-active-default = ئاكتىپ كۆڭۈلدىكى قىممەت:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] رۇخسەت قىلىنغان قىممەتلەر (ھەر ئەزاغا بىردىن):
       *[other] رۇخسەت قىلىنغان قىممەتلەر:
    }

help-suggested-values = تەۋسىيە قىلىنغان قىممەتلەر:

help-inserts = قىستۇرىدۇ:

help-coordinates =
    { $count ->
        [one] كوئوردېنات:
       *[other] كوئوردېناتلار:
    }

help-type = تىپى:

help-resolved-style = ھېسابلانغان ئۇسلۇب (styleNumber { $styleNumber }):

help-resolved-function-names = ھېسابلانغان فۇنكسىيە ئىسىملىرى:
help-reset-list = بۇ كىرگۈزۈشتە تىزىمنى ئەسلىگە قايتۇرۇش:
help-added-on-input = بۇ كىرگۈزۈشتە قوشۇلدى:
help-removed-on-input = بۇ كىرگۈزۈشتە ئۆچۈرۈلدى:

help-reset-overrides = { $reset } بولسا { $additional } ۋە { $removed } دىن ئۈستۈن تۇرىدۇ.
