# Bangla editor and language-server surfaces. Translated from
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
        [reset] রিসেট
       *[update] হালনাগাদ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] প্রদর্শক { $word }
       *[other] প্রদর্শক { $word } { $shortcut }
    }


## The variant picker

editor-variant = রূপভেদ
editor-variant-filter = ছাঁকুন...
editor-variant-next = পরবর্তী রূপভেদ বাছুন
editor-variant-previous = পূর্ববর্তী রূপভেদ বাছুন


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA প্রবেশযোগ্যতা লঙ্ঘন শনাক্ত হয়েছে। প্রবেশযোগ্যতা প্রতিবেদন { $action ->
            [close] বন্ধ করতে
           *[open] খুলতে
        } ক্লিক করুন।
        [advisories] প্রবেশযোগ্যতা প্রতিবেদন { $action ->
            [close] বন্ধ করতে
           *[open] খুলতে
        } ক্লিক করুন। কোনো WCAG AA লঙ্ঘন পাওয়া যায়নি, তবে আরও কিছু প্রবেশযোগ্যতা সুপারিশ রয়েছে।
       *[clean] প্রবেশযোগ্যতা প্রতিবেদন { $action ->
            [close] বন্ধ করতে
           *[open] খুলতে
        } ক্লিক করুন। কোনো প্রবেশযোগ্যতা সমস্যা পাওয়া যায়নি।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA প্রবেশযোগ্যতা লঙ্ঘন শনাক্ত হয়েছে। { $count ->
            [one] { $count }টি WCAG AA লঙ্ঘন
           *[other] { $count }টি WCAG AA লঙ্ঘন
        } পাওয়া গেছে। প্রবেশযোগ্যতা প্রতিবেদন { $action ->
            [close] বন্ধ করতে
           *[open] খুলতে
        } ক্লিক করুন।
        [advisories] কোনো WCAG AA লঙ্ঘন শনাক্ত হয়নি। { $count ->
            [one] আরও { $count }টি প্রবেশযোগ্যতা সুপারিশ
           *[other] আরও { $count }টি প্রবেশযোগ্যতা সুপারিশ
        } পাওয়া গেছে। প্রবেশযোগ্যতা প্রতিবেদন { $action ->
            [close] বন্ধ করতে
           *[open] খুলতে
        } ক্লিক করুন।
       *[clean] কোনো WCAG AA লঙ্ঘন শনাক্ত হয়নি। প্রবেশযোগ্যতা প্রতিবেদন { $action ->
            [close] বন্ধ করতে
           *[open] খুলতে
        } ক্লিক করুন।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML সংস্করণ { $version }

editor-tab-help = প্রসঙ্গভিত্তিক সহায়তা
editor-tab-help-short = প্রসঙ্গ
editor-tab-errors = ত্রুটি
editor-tab-warnings = সতর্কতা
editor-tab-info = তথ্য
editor-tab-accessibility = প্রবেশযোগ্যতা
editor-tab-responses = জমা দেওয়া উত্তর

editor-tab-with-count = { $label }: { $count }

editor-options = সম্পাদকের বিকল্প
editor-format-as-doenetml = DoenetML হিসেবে সাজান
editor-format-as-xml = XML হিসেবে সাজান


## The diagnostics panel

editor-diagnostic-line = লাইন #{ $line }

editor-no-errors = কোনো ত্রুটি নেই
editor-no-warnings = কোনো সতর্কতা নেই
editor-no-info = কোনো তথ্যমূলক নির্দেশনা নেই

editor-show-info-annotations = সম্পাদকে তথ্যমূলক নির্দেশনা দেখান
editor-show-accessibility-annotations = সম্পাদকে প্রবেশযোগ্যতা নির্দেশনা দেখান

editor-accessibility-learn-more = Doenet প্রবেশযোগ্যতাকে কীভাবে দেখে তা জানুন

editor-accessibility-violations-heading = প্রবেশযোগ্যতা লঙ্ঘন ({ $standard })

editor-accessibility-other-heading = অন্যান্য প্রবেশযোগ্যতা সমস্যা
editor-none-found = কিছুই পাওয়া যায়নি


## Submitted responses

editor-no-responses = এখনও কোনো উত্তর জমা দেওয়া হয়নি
editor-response-answer-id = উত্তরের আইডি
editor-response-response = উত্তর
editor-response-credit = নম্বর
editor-response-submitted = জমা দেওয়া হয়েছে


## The context-help panel

help-placeholder = নথিপত্রের জন্য কার্সরটি কোনো ট্যাগের নাম, অ্যাট্রিবিউট বা { $ref }-এর উপর রাখুন।

help-unsupported-ref-chain = { $example }-এর মতো বহু-অংশের রেফারেন্সের জন্য সহায়তা এখনও সমর্থিত নয়।

help-unresolved-ref =
    { $reason ->
        [notFound] রেফারেন্সের জন্য কোনো লক্ষ্য পাওয়া যায়নি: { $ref }।
        [multiple] রেফারেন্সের জন্য একাধিক লক্ষ্য পাওয়া গেছে: { $ref }।
       *[indeterminate] { $ref }-এর লক্ষ্য নির্ধারণ করা যায়নি।
    }

help-learn-about-references = রেফারেন্স সম্পর্কে জানুন →
help-reference-page = রেফারেন্স পৃষ্ঠা →

help-suggestions-header =
    { $location ->
        [inside] { $element }-এর ভিতরে
       *[top] সর্বোচ্চ স্তরে
    }{ $allowed ->
        [none] { " — এখানে কিছুই বসে না।" }
        [text] { " — এখানে লেখা লিখুন।" }
        [text-and-components] { " — এখানে লেখা লিখুন, বা চেষ্টা করুন:" }
       *[components] { " — যা চেষ্টা করা যায়:" }
    }

help-suggestions-footer = সব { $total }টি উপাদান দেখতে { $shortcut } চাপুন।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } হলো { $target }-এর একটি রেফারেন্স।
       *[other] { $ref } হলো { $target }-এর একটি রেফারেন্স (লাইন { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } একে { $role } হিসেবে এনেছে।
       *[other] { $owner } একে { $line } নং লাইনে { $role } হিসেবে এনেছে।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } হলো { $element }-এর { $property } বৈশিষ্ট্যের একটি রেফারেন্স।
       *[other] { $ref } হলো { $element }-এর { $property } বৈশিষ্ট্যের একটি রেফারেন্স (লাইন { $line })।
    }

help-kind-attribute = অ্যাট্রিবিউট
help-kind-snippet = স্নিপেট
help-kind-array-entry = অ্যারে ভুক্তি

help-default = পূর্বনির্ধারিত:
help-active-default = কার্যকর পূর্বনির্ধারিত:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] অনুমোদিত মান (প্রতিটির জন্য একটি):
       *[other] অনুমোদিত মান:
    }

help-suggested-values = প্রস্তাবিত মান:

help-inserts = যা বসায়:

help-coordinates =
    { $count ->
        [one] স্থানাঙ্ক:
       *[other] স্থানাঙ্ক:
    }

help-type = ধরন:

help-resolved-style = নির্ধারিত শৈলী (styleNumber { $styleNumber }):

help-resolved-function-names = নির্ধারিত ফাংশনের নাম:
help-reset-list = এই ইনপুটে তালিকা রিসেট:
help-added-on-input = এই ইনপুটে যোগ হয়েছে:
help-removed-on-input = এই ইনপুটে বাদ পড়েছে:

help-reset-overrides = { $reset } { $additional } এবং { $removed }-এর উপর প্রাধান্য পায়।
