# Central Kurdish (Sorani) editor and language-server surfaces. Translated
# from `locales/en/editor.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Kurdo-Arabic alphabet, the fully vowelled Arabic-script
# orthography of the Kurdistan Region of Iraq. `ckb` maximizes to
# `ckb-Arab-IQ` and is right to left. Northern Kurdish (Kurmanji) has its own
# left-to-right Latin catalog in `locales/kmr`; a Sorani reader reaches this
# one, which is why `ckb` is kept out of the roster's fold onto Kurmanji — and
# why that catalog is named `kmr` rather than for the `ku` macrolanguage.
#
# Sorani has no grammatical gender, so nothing here agrees with anything. Two
# plural categories, `one` and `other`, and a noun after a numeral stays
# singular, so no count in this file needs a branch. Numbers are Latin digits;
# ٠١٢٣ appear nowhere and no message names a numbering system.
#
# Register as in `chrome.ftl`: verbal nouns for controls, imperative singular
# for a sentence addressed to the reader.
#
# Where English interpolates a bare verb — "Click to { $action } accessibility
# report" — the Kurdish verb closes its clause and cannot be dropped into the
# middle of one, so the selector carries the whole sentence. Fluent does not
# care where a select sits inside a pattern.
#
# The ezafe is written as a ـی suffix and cannot be welded onto a placeable,
# which is the constraint `content.ftl`'s header describes at length. It
# reaches this file in three places, each marked below.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ڕێکخستنەوە
       *[update] نوێکردنەوە
    }

# «{ $word }ی پیشاندەر» would be the idiomatic phrase, but the ezafe would have
# to be welded onto the button's own label, which arrives as a placeable. «بۆ»
# is a free preposition and needs nothing attached to it, so the tooltip reads
# "Update, for the viewer" rather than "Update of the viewer".
editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } بۆ پیشاندەر
       *[other] { $word } بۆ پیشاندەر { $shortcut }
    }


## The variant picker

editor-variant = وەشان
editor-variant-filter = پاڵاوتن...
editor-variant-next = هەڵبژاردنی وەشانی دواتر
editor-variant-previous = هەڵبژاردنی وەشانی پێشوو


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] پێشێلکردنی دەستڕاگەیشتن بەپێی WCAG AA دۆزرایەوە. { $action ->
            [close] بۆ داخستنی ڕاپۆرتی دەستڕاگەیشتن کلیک بکە.
           *[open] بۆ کردنەوەی ڕاپۆرتی دەستڕاگەیشتن کلیک بکە.
        }
        [advisories] { $action ->
            [close] بۆ داخستنی ڕاپۆرتی دەستڕاگەیشتن کلیک بکە.
           *[open] بۆ کردنەوەی ڕاپۆرتی دەستڕاگەیشتن کلیک بکە.
        } هیچ پێشێلکردنێکی WCAG AA نەدۆزرایەوە، بەڵام پێشنیاری زیاتری دەستڕاگەیشتن بەردەستە.
       *[clean] { $action ->
            [close] بۆ داخستنی ڕاپۆرتی دەستڕاگەیشتن کلیک بکە.
           *[open] بۆ کردنەوەی ڕاپۆرتی دەستڕاگەیشتن کلیک بکە.
        } هیچ کێشەیەکی دەستڕاگەیشتن نەدۆزرایەوە.
    }

editor-accessibility-label =
    { $status ->
        [violations] پێشێلکردنی دەستڕاگەیشتن بەپێی WCAG AA دۆزرایەوە. { $count } پێشێلکردنی WCAG AA دۆزرایەوە. { $action ->
            [close] بۆ داخستنی ڕاپۆرتی دەستڕاگەیشتن کلیک بکە.
           *[open] بۆ کردنەوەی ڕاپۆرتی دەستڕاگەیشتن کلیک بکە.
        }
        [advisories] هیچ پێشێلکردنێکی WCAG AA نەدۆزرایەوە. { $count } پێشنیاری زیاتری دەستڕاگەیشتن دۆزرایەوە. { $action ->
            [close] بۆ داخستنی ڕاپۆرتی دەستڕاگەیشتن کلیک بکە.
           *[open] بۆ کردنەوەی ڕاپۆرتی دەستڕاگەیشتن کلیک بکە.
        }
       *[clean] هیچ پێشێلکردنێکی WCAG AA نەدۆزرایەوە. { $action ->
            [close] بۆ داخستنی ڕاپۆرتی دەستڕاگەیشتن کلیک بکە.
           *[open] بۆ کردنەوەی ڕاپۆرتی دەستڕاگەیشتن کلیک بکە.
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = وەشانی DoenetML { $version }

editor-tab-help = یارمەتی بەپێی چوارچێوە
editor-tab-help-short = چوارچێوە
editor-tab-errors = هەڵەکان
editor-tab-warnings = ئاگادارییەکان
editor-tab-info = زانیاری
editor-tab-accessibility = دەستڕاگەیشتن
editor-tab-responses = وەڵامە نێردراوەکان

editor-tab-with-count = { $label }: { $count }

editor-options = هەڵبژاردەکانی دەستکاریکەر
editor-format-as-doenetml = فۆرماتکردن وەک DoenetML
editor-format-as-xml = فۆرماتکردن وەک XML


## The diagnostics panel

editor-diagnostic-line = دێڕی ژمارە { $line }

editor-no-errors = هیچ هەڵەیەک نییە
editor-no-warnings = هیچ ئاگادارییەک نییە
editor-no-info = هیچ دەستنیشانکردنێکی زانیاری نییە

editor-show-info-annotations = پیشاندانی دەستنیشانکردنی زانیاری لە دەستکاریکەردا
editor-show-accessibility-annotations = پیشاندانی دەستنیشانکردنی دەستڕاگەیشتن لە دەستکاریکەردا

editor-accessibility-learn-more = فێربە Doenet چۆن لە دەستڕاگەیشتن دەڕوانێت

editor-accessibility-violations-heading = پێشێلکردنەکانی دەستڕاگەیشتن ({ $standard })

editor-accessibility-other-heading = کێشەکانی تری دەستڕاگەیشتن
editor-none-found = هیچ نەدۆزرایەوە


## Submitted responses

editor-no-responses = هێشتا هیچ وەڵامێک نەنێردراوە
editor-response-answer-id = ناسنامەی وەڵام
editor-response-response = وەڵام
editor-response-credit = نمرە
editor-response-submitted = کاتی ناردن


## The context-help panel

help-placeholder = بۆ بینینی بەڵگەنامە، نیشاندەر بخە سەر ناوی تاگێک، تایبەتمەندییەک، یان { $ref }.

help-unsupported-ref-chain = یارمەتی بۆ ئاماژەی فرەبەش وەک { $example } هێشتا پشتگیری ناکرێت.

help-unresolved-ref =
    { $reason ->
        [notFound] هیچ ئامانجێک بۆ ئاماژەی { $ref } نەدۆزرایەوە.
        [multiple] چەند ئامانجێک بۆ ئاماژەی { $ref } دۆزرایەوە.
       *[indeterminate] نەتوانرا ئامانجێک بۆ { $ref } دیاری بکرێت.
    }

# The arrow is direction rather than punctuation, and Sorani runs the other
# way, so it points where the reader is going.
help-learn-about-references = فێربوون دەربارەی ئاماژەکان ←
help-reference-page = لاپەڕەی سەرچاوە ←

help-suggestions-header =
    { $location ->
        [inside] لە ناو { $element }
       *[top] لە ئاستی سەرەوە
    }{ $allowed ->
        [none] { " — هیچ شتێک لێرە دانانرێت." }
        [text] { " — لێرەدا دەق بنووسە." }
        [text-and-components] { " — لێرەدا دەق بنووسە، یان ئەمانە تاقی بکەرەوە:" }
       *[components] { " — شتانێک بۆ تاقیکردنەوە:" }
    }

help-suggestions-footer = { $shortcut } دابگرە بۆ بینینی هەموو { $total } پێکهاتەکە.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ئاماژەیەکە بۆ { $target }.
       *[other] { $ref } ئاماژەیەکە بۆ { $target } (دێڕی { $line }).
    }

# Kurdish would circumpose «لەلایەن … ەوە» here, and the closing «ەوە» is a
# suffix on `{ $owner }`. It is left off rather than welded, which is the same
# choice `content.ftl` makes for the ezafe.
help-ref-derived-from =
    { $line ->
        [none] لەلایەن { $owner } وەک { $role } ناسێنراوە.
       *[other] لەلایەن { $owner } لە دێڕی { $line } وەک { $role } ناسێنراوە.
    }

# «خاسیەتی { $property } ی { $element }» would need a second ezafe welded onto
# `{ $property }`, so the owner is reached with the free preposition «لەسەر»
# instead.
help-property-is-reference =
    { $line ->
        [none] { $ref } ئاماژەیەکە بۆ خاسیەتی { $property } لەسەر { $element }.
       *[other] { $ref } ئاماژەیەکە بۆ خاسیەتی { $property } لەسەر { $element } (دێڕی { $line }).
    }

help-kind-attribute = تایبەتمەندی
help-kind-snippet = پارچەکۆد
help-kind-array-entry = بڕگەی ڕیزە

help-default = بنەڕەت:
help-active-default = بنەڕەتی چالاک:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] نرخە ڕێگەپێدراوەکان (یەک بۆ هەر بڕگەیەک):
       *[other] نرخە ڕێگەپێدراوەکان:
    }

help-suggested-values = نرخە پێشنیارکراوەکان:

help-inserts = دادەنێت:

# Sorani does not change the noun for the count, so the two English branches
# would render the same string; the select is dropped rather than written out
# twice identically. `$count` then goes unused, which is harmless.
help-coordinates = کۆردینات:

help-type = جۆر:

help-resolved-style = شێوازی دیاریکراو (styleNumber { $styleNumber }):

help-resolved-function-names = ناوە دیاریکراوەکانی فەنکشن:
help-reset-list = لیستی ڕێکخستنەوە لەسەر ئەم داخڵکراوە:
help-added-on-input = زیادکراو لەسەر ئەم داخڵکراوە:
help-removed-on-input = لابراو لەسەر ئەم داخڵکراوە:

help-reset-overrides = { $reset } جێی { $additional } و { $removed } دەگرێتەوە.
