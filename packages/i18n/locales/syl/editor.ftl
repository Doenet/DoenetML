# Sylheti (ছিলটি) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button, and the
# context-help panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and register** are `chrome.ftl`'s: the Bengali script, as Sylheti
# is normally printed today, rather than Sylheti Nagri, and a Bengali
# technical vocabulary declared as a loan register around a Sylheti frame —
# নায়, নাই, আছে, অউ, ইতা, লাগি, দিয়া, লগে, আর, and the honorific imperative
# in -ইন.
#
# **`WCAG`, `DoenetML`, `styleNumber` and every element and attribute name
# stay in English.** They are identifiers an author types, not words. So does
# `$shortcut`, which is a key combination, and `$version`, `$standard` and
# `$ref`.
#
# **The counts do not fork.** `editor-accessibility-label` and
# `help-coordinates` write a single `*[other]` where English writes `[one]`
# and `[other]`: CLDR has no plural data for `syl`, so an English-selected
# branch here would be a category this locale cannot reach. A Sylheti noun is
# unmarked for number after a numeral in any case, so the single form is also
# the grammatical one.
#
# **The arrow `→` in the two link labels is direction rather than
# punctuation** and is left where English puts it: Sylheti in the Bengali
# script is written left to right.
#
# **Numbers render in Latin digits** rather than in Bengali numerals (#1615).


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] রিসেট
       *[update] হালনাগাদ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] ভিউয়ার { $word }
       *[other] ভিউয়ার { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = ছাঁকনি...
editor-variant-next = পরের variant বাছইন
editor-variant-previous = আগের variant বাছইন


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA প্রবেশগম্যতা লঙ্ঘন পাওয়া গেছে। প্রবেশগম্যতার প্রতিবেদন { $action ->
            [close] বন্ধ
           *[open] খুলতে
        } ক্লিক করইন।
        [advisories] প্রবেশগম্যতার প্রতিবেদন { $action ->
            [close] বন্ধ
           *[open] খুলতে
        } ক্লিক করইন। কোনো WCAG AA লঙ্ঘন পাওয়া গেছে নায়, অথচ আরো কিছু প্রবেশগম্যতার পরামর্শ আছে।
       *[clean] প্রবেশগম্যতার প্রতিবেদন { $action ->
            [close] বন্ধ
           *[open] খুলতে
        } ক্লিক করইন। কোনো প্রবেশগম্যতার সমস্যা পাওয়া গেছে নায়।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA প্রবেশগম্যতা লঙ্ঘন পাওয়া গেছে। { $count ->
           *[other] { $count } WCAG AA লঙ্ঘন
        } পাওয়া গেছে। প্রবেশগম্যতার প্রতিবেদন { $action ->
            [close] বন্ধ
           *[open] খুলতে
        } ক্লিক করইন।
        [advisories] কোনো WCAG AA লঙ্ঘন পাওয়া গেছে নায়। { $count ->
           *[other] { $count } বাড়তি প্রবেশগম্যতার পরামর্শ
        } পাওয়া গেছে। প্রবেশগম্যতার প্রতিবেদন { $action ->
            [close] বন্ধ
           *[open] খুলতে
        } ক্লিক করইন।
       *[clean] কোনো WCAG AA লঙ্ঘন পাওয়া গেছে নায়। প্রবেশগম্যতার প্রতিবেদন { $action ->
            [close] বন্ধ
           *[open] খুলতে
        } ক্লিক করইন।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML সংস্করণ { $version }

editor-tab-help = প্রসঙ্গ অনুযায়ী সাহায্য
editor-tab-help-short = প্রসঙ্গ
editor-tab-errors = ত্রুটি
editor-tab-warnings = সতর্কতা
editor-tab-info = খবর
editor-tab-accessibility = প্রবেশগম্যতা
editor-tab-responses = পাঠানো জুয়াপ

editor-tab-with-count = { $label }: { $count }

editor-options = সম্পাদকের বিকল্প
editor-format-as-doenetml = DoenetML হিসাবে সাজাইন
editor-format-as-xml = XML হিসাবে সাজাইন


## The diagnostics panel

editor-diagnostic-line = লাইন #{ $line }

editor-no-errors = কোনো ত্রুটি নাই
editor-no-warnings = কোনো সতর্কতা নাই
editor-no-info = কোনো খবরের সূচনা নাই

editor-show-info-annotations = সম্পাদকো খবরের সূচনা দেখাইন
editor-show-accessibility-annotations = সম্পাদকো প্রবেশগম্যতার সূচনা দেখাইন

editor-accessibility-learn-more = Doenet প্রবেশগম্যতারে কেমনে দেখে ইতা জানইন

editor-accessibility-violations-heading = প্রবেশগম্যতা লঙ্ঘন ({ $standard })

editor-accessibility-other-heading = আরো কিছু প্রবেশগম্যতার সমস্যা
editor-none-found = কিছুউ পাওয়া গেছে নায়


## Submitted responses

editor-no-responses = এখনো কোনো জুয়াপ পাঠানো অয় নাই
editor-response-answer-id = Answer Id
editor-response-response = জুয়াপ
editor-response-credit = নম্বর
editor-response-submitted = পাঠানো অইছে


## The context-help panel

help-placeholder = দলিলের লাগি কার্সরটা একটা ট্যাগের নাম, বৈশিষ্ট্য বা { $ref }-র উপরে রাখইন।

help-unsupported-ref-chain = { $example }-র মতো অনেক অংশের সন্দর্ভের লাগি সাহায্য এখনো চলে নায়।

help-unresolved-ref =
    { $reason ->
        [notFound] সন্দর্ভের লাগি কোনো লক্ষ্য পাওয়া গেছে নায়: { $ref }।
        [multiple] সন্দর্ভের লাগি একের বেশি লক্ষ্য পাওয়া গেছে: { $ref }।
       *[indeterminate] { $ref }-র লক্ষ্য ঠিক করা গেছে নায়।
    }

help-learn-about-references = সন্দর্ভের কথা জানইন →
help-reference-page = সন্দর্ভের পাতা →

help-suggestions-header =
    { $location ->
        [inside] { $element }-র ভিতরে
       *[top] সবার উপরের স্তরো
    }{ $allowed ->
        [none] { " — এখানে কিছুউ বসে নায়।" }
        [text] { " — এখানে লেখা লেখইন।" }
        [text-and-components] { " — এখানে লেখা লেখইন, নাইলে ইতা দেখইন:" }
       *[components] { " — যেগুলি দেখতে পারইন:" }
    }

help-suggestions-footer = সব { $total } উপাদান দেখতে { $shortcut } চাপইন।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } অইল { $target }-র একটা সন্দর্ভ।
       *[other] { $ref } অইল { $target }-র একটা সন্দর্ভ (লাইন { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ইতারে { $role } হিসাবে আনছে।
       *[other] { $owner } ইতারে লাইন { $line }-ও { $role } হিসাবে আনছে।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } অইল { $element }-র { $property } বৈশিষ্ট্যের একটা সন্দর্ভ।
       *[other] { $ref } অইল { $element }-র { $property } বৈশিষ্ট্যের একটা সন্দর্ভ (লাইন { $line })।
    }

help-kind-attribute = বৈশিষ্ট্য
help-kind-snippet = স্নিপেট
help-kind-array-entry = অ্যারের ঘর

help-default = আগে থাকি ঠিক করা:
help-active-default = এখনকার আগে থাকি ঠিক করা:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] চলে এমন মান (প্রতিটা জিনিসের লাগি একটা):
       *[other] চলে এমন মান:
    }

help-suggested-values = পরামর্শ দেওয়া মান:

help-inserts = বসায়:

help-coordinates =
    { $count ->
       *[other] স্থানাঙ্ক:
    }

help-type = ধরন:

help-resolved-style = ঠিক করা শৈলী (styleNumber { $styleNumber }):

help-resolved-function-names = ঠিক করা ফাংশনের নাম:
help-reset-list = অউ input-র রিসেট তালিকা:
help-added-on-input = অউ input-ও বাড়ানো অইছে:
help-removed-on-input = অউ input-ও সরানো অইছে:

help-reset-overrides = { $reset } { $additional } আর { $removed }-র উপরে চলে।
