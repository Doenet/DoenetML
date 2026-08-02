# Assamese editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Element names, attribute names, `styleNumber`, `WCAG AA` and version numbers
# are identifiers rather than prose and stay exactly as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ৰিছেট
       *[update] আপডেট
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] প্ৰদৰ্শক { $word }
       *[other] প্ৰদৰ্শক { $word } { $shortcut }
    }


## The variant picker

editor-variant = ৰূপভেদ
editor-variant-filter = ছাঁকক...
editor-variant-next = পৰৱৰ্তী ৰূপভেদ বাছক
editor-variant-previous = পূৰ্বৱৰ্তী ৰূপভেদ বাছক


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA প্ৰৱেশযোগ্যতা উলংঘন চিনাক্ত কৰা হৈছে। প্ৰৱেশযোগ্যতা প্ৰতিবেদন { $action ->
            [close] বন্ধ কৰিবলৈ
           *[open] খুলিবলৈ
        } ক্লিক কৰক।
        [advisories] প্ৰৱেশযোগ্যতা প্ৰতিবেদন { $action ->
            [close] বন্ধ কৰিবলৈ
           *[open] খুলিবলৈ
        } ক্লিক কৰক। কোনো WCAG AA উলংঘন পোৱা নগ'ল, কিন্তু আৰু কিছু প্ৰৱেশযোগ্যতা পৰামৰ্শ আছে।
       *[clean] প্ৰৱেশযোগ্যতা প্ৰতিবেদন { $action ->
            [close] বন্ধ কৰিবলৈ
           *[open] খুলিবলৈ
        } ক্লিক কৰক। কোনো প্ৰৱেশযোগ্যতা সমস্যা পোৱা নগ'ল।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA প্ৰৱেশযোগ্যতা উলংঘন চিনাক্ত কৰা হৈছে। { $count ->
            [one] { $count }টা WCAG AA উলংঘন
           *[other] { $count }টা WCAG AA উলংঘন
        } পোৱা গৈছে। প্ৰৱেশযোগ্যতা প্ৰতিবেদন { $action ->
            [close] বন্ধ কৰিবলৈ
           *[open] খুলিবলৈ
        } ক্লিক কৰক।
        [advisories] কোনো WCAG AA উলংঘন চিনাক্ত কৰা হোৱা নাই। আৰু { $count ->
            [one] { $count }টা প্ৰৱেশযোগ্যতা পৰামৰ্শ
           *[other] { $count }টা প্ৰৱেশযোগ্যতা পৰামৰ্শ
        } পোৱা গৈছে। প্ৰৱেশযোগ্যতা প্ৰতিবেদন { $action ->
            [close] বন্ধ কৰিবলৈ
           *[open] খুলিবলৈ
        } ক্লিক কৰক।
       *[clean] কোনো WCAG AA উলংঘন চিনাক্ত কৰা হোৱা নাই। প্ৰৱেশযোগ্যতা প্ৰতিবেদন { $action ->
            [close] বন্ধ কৰিবলৈ
           *[open] খুলিবলৈ
        } ক্লিক কৰক।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML সংস্কৰণ { $version }

editor-tab-help = প্ৰসংগভিত্তিক সহায়
editor-tab-help-short = প্ৰসংগ
editor-tab-errors = ত্ৰুটি
editor-tab-warnings = সতৰ্কবাণী
editor-tab-info = তথ্য
editor-tab-accessibility = প্ৰৱেশযোগ্যতা
editor-tab-responses = দাখিল কৰা উত্তৰ

editor-tab-with-count = { $label }: { $count }

editor-options = সম্পাদকৰ বিকল্প
editor-format-as-doenetml = DoenetML হিচাপে সজাওক
editor-format-as-xml = XML হিচাপে সজাওক


## The diagnostics panel

editor-diagnostic-line = শাৰী #{ $line }

editor-no-errors = কোনো ত্ৰুটি নাই
editor-no-warnings = কোনো সতৰ্কবাণী নাই
editor-no-info = কোনো তথ্যমূলক নিৰ্দেশনা নাই

editor-show-info-annotations = সম্পাদকত তথ্যমূলক নিৰ্দেশনা দেখুৱাওক
editor-show-accessibility-annotations = সম্পাদকত প্ৰৱেশযোগ্যতা নিৰ্দেশনা দেখুৱাওক

editor-accessibility-learn-more = Doenet-এ প্ৰৱেশযোগ্যতাক কেনেকৈ দেখে জানক

editor-accessibility-violations-heading = প্ৰৱেশযোগ্যতা উলংঘন ({ $standard })

editor-accessibility-other-heading = আন প্ৰৱেশযোগ্যতা সমস্যা
editor-none-found = একো পোৱা নগ'ল


## Submitted responses

editor-no-responses = এতিয়ালৈকে কোনো উত্তৰ দাখিল কৰা হোৱা নাই
editor-response-answer-id = উত্তৰৰ আইডি
editor-response-response = উত্তৰ
editor-response-credit = নম্বৰ
editor-response-submitted = দাখিল কৰা হৈছে


## The context-help panel

help-placeholder = নথিপত্ৰৰ বাবে কাৰ্চাৰটো কোনো টেগৰ নাম, এট্ৰিবিউট বা { $ref }-ৰ ওপৰত ৰাখক।

help-unsupported-ref-chain = { $example }-ৰ দৰে বহু-অংশৰ ৰেফাৰেন্সৰ বাবে সহায় এতিয়াও সমৰ্থিত নহয়।

help-unresolved-ref =
    { $reason ->
        [notFound] ৰেফাৰেন্সৰ বাবে কোনো লক্ষ্য পোৱা নগ'ল: { $ref }।
        [multiple] ৰেফাৰেন্সৰ বাবে একাধিক লক্ষ্য পোৱা গ'ল: { $ref }।
       *[indeterminate] { $ref }-ৰ লক্ষ্য নিৰ্ণয় কৰিব পৰা নগ'ল।
    }

help-learn-about-references = ৰেফাৰেন্সৰ বিষয়ে জানক →
help-reference-page = ৰেফাৰেন্স পৃষ্ঠা →

help-suggestions-header =
    { $location ->
        [inside] { $element }-ৰ ভিতৰত
       *[top] সৰ্বোচ্চ স্তৰত
    }{ $allowed ->
        [none] { " — ইয়াত একো নবহে।" }
        [text] { " — ইয়াত লিখা লিখক।" }
        [text-and-components] { " — ইয়াত লিখা লিখক, বা চেষ্টা কৰক:" }
       *[components] { " — যি চেষ্টা কৰিব পাৰি:" }
    }

help-suggestions-footer = সকলো { $total }টা উপাদান চাবলৈ { $shortcut } টিপক।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } হ'ল { $target }-ৰ এটা ৰেফাৰেন্স।
       *[other] { $ref } হ'ল { $target }-ৰ এটা ৰেফাৰেন্স (শাৰী { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner }-এ ইয়াক { $role } হিচাপে আনিছে।
       *[other] { $owner }-এ ইয়াক { $line } নং শাৰীত { $role } হিচাপে আনিছে।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } হ'ল { $element }-ৰ { $property } বৈশিষ্ট্যৰ এটা ৰেফাৰেন্স।
       *[other] { $ref } হ'ল { $element }-ৰ { $property } বৈশিষ্ট্যৰ এটা ৰেফাৰেন্স (শাৰী { $line })।
    }

help-kind-attribute = এট্ৰিবিউট
help-kind-snippet = স্নিপেট
help-kind-array-entry = এৰে ভুক্তি

help-default = পূৰ্বনিৰ্ধাৰিত:
help-active-default = সক্ৰিয় পূৰ্বনিৰ্ধাৰিত:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] অনুমোদিত মান (প্ৰতিটোৰ বাবে এটা):
       *[other] অনুমোদিত মান:
    }

help-suggested-values = প্ৰস্তাৱিত মান:

help-inserts = যি বহায়:

help-coordinates =
    { $count ->
        [one] স্থানাংক:
       *[other] স্থানাংক:
    }

help-type = ধৰণ:

help-resolved-style = নিৰ্ণীত শৈলী (styleNumber { $styleNumber }):

help-resolved-function-names = নিৰ্ণীত ফলনৰ নাম:
help-reset-list = এই ইনপুটত তালিকা ৰিছেট:
help-added-on-input = এই ইনপুটত যোগ হৈছে:
help-removed-on-input = এই ইনপুটত বাদ পৰিছে:

help-reset-overrides = { $reset }-এ { $additional } আৰু { $removed }-ৰ ওপৰত প্ৰাধান্য পায়।
