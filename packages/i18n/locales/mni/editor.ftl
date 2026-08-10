# Manipuri (Meitei) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button, and the
# context-help panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand.
#
# Three English words the interface keeps apart would all be মখল if translated
# by sense — "type", "attribute" and "variant". মখল is kept for *type*, and the
# other two take the words `locales/bn` and `locales/as` use in the same script:
# এট্রিবিউট for an attribute and রূপভেদ for a variant.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] অমুক হন্না শেম্বা
       *[update] অনৌবা তৌবা
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] উৎপা মশীন { $word }
       *[other] উৎপা মশীন { $word } { $shortcut }
    }


## The variant picker

editor-variant = রূপভেদ

editor-variant-filter = খনথোকউ…

editor-variant-next = মথংগী রূপভেদ খল্লু

editor-variant-previous = মমাংগী রূপভেদ খল্লু


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA শিজিন্নবা য়াবগী ৱাথোক ফংলে। শিজিন্নবা য়াবগী রিপোর্ত { $action ->
            [close] থিংজিন্নবা
           *[open] হাংদোক্নবা
        } ক্লিক তৌরো।
        [advisories] শিজিন্নবা য়াবগী রিপোর্ত { $action ->
            [close] থিংজিন্নবা
           *[open] হাংদোক্নবা
        } ক্লিক তৌরো। WCAG AA ৱাথোক অমত্তা ফংদে, অদুবু অতোপ্পা শিজিন্নবা য়াবগী পাউতাক লৈরি।
       *[clean] শিজিন্নবা য়াবগী রিপোর্ত { $action ->
            [close] থিংজিন্নবা
           *[open] হাংদোক্নবা
        } ক্লিক তৌরো। শিজিন্নবা য়াবগী ৱাফম অমত্তা ফংদে।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA শিজিন্নবা য়াবগী ৱাথোক ফংলে। { $count ->
            [one] { $count } WCAG AA ৱাথোক
           *[other] { $count } WCAG AA ৱাথোক
        } ফংলে। শিজিন্নবা য়াবগী রিপোর্ত { $action ->
            [close] থিংজিন্নবা
           *[open] হাংদোক্নবা
        } ক্লিক তৌরো।
        [advisories] WCAG AA ৱাথোক অমত্তা ফংদে। { $count ->
            [one] { $count } অতোপ্পা শিজিন্নবা য়াবগী পাউতাক
           *[other] { $count } অতোপ্পা শিজিন্নবা য়াবগী পাউতাক
        } ফংলে। শিজিন্নবা য়াবগী রিপোর্ত { $action ->
            [close] থিংজিন্নবা
           *[open] হাংদোক্নবা
        } ক্লিক তৌরো।
       *[clean] WCAG AA ৱাথোক অমত্তা ফংদে। শিজিন্নবা য়াবগী রিপোর্ত { $action ->
            [close] থিংজিন্নবা
           *[open] হাংদোক্নবা
        } ক্লিক তৌরো।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ভর্সন { $version }

editor-tab-help = মরী লৈনবা মতুংইন্না মতেং
editor-tab-help-short = মরী
editor-tab-errors = অশোয়বা
editor-tab-warnings = চেকশিন ৱাফম
editor-tab-info = পাউ
editor-tab-accessibility = শিজিন্নবা য়াবা
editor-tab-responses = থাদোকখ্রবা পাউখুম

editor-tab-with-count = { $label }: { $count }

editor-options = এদিতর খনগদবা
editor-format-as-doenetml = DoenetML ওইনা শেম্বা
editor-format-as-xml = XML ওইনা শেম্বা


## The diagnostics panel

editor-diagnostic-line = পরেং #{ $line }

editor-no-errors = অশোয়বা অমত্তা লৈতে
editor-no-warnings = চেকশিন ৱাফম অমত্তা লৈতে
editor-no-info = পাউ অমত্তা লৈতে

editor-show-info-annotations = এদিতরদা পাউ উৎলু
editor-show-accessibility-annotations = এদিতরদা শিজিন্নবা য়াবগী ৱাফম উৎলু

editor-accessibility-learn-more = Doenet-না শিজিন্নবা য়াবা করম্না য়েংই হায়বদু খঙবিয়ু

editor-accessibility-violations-heading = শিজিন্নবা য়াবগী ৱাথোক ({ $standard })

editor-accessibility-other-heading = অতোপ্পা শিজিন্নবা য়াবগী ৱাফম
editor-none-found = করিসু ফংদে


## Submitted responses

editor-no-responses = হৌজিক ফাওবদা পাউখুম অমত্তা থাদোক্লবা লৈতে
editor-response-answer-id = পাউখুম আইদি
editor-response-response = পাউখুম
editor-response-credit = মাক
editor-response-submitted = থাদোকখ্রে


## The context-help panel

help-placeholder = দোকুমেন্তেসনগীদমক কর্সর অসি তেগ মমিং, এট্রিবিউট, নত্ত্রগা { $ref }-দা থমউ।

help-unsupported-ref-chain = { $example } অসিগুম্বা শরুক কয়াগী মরীগীদমক মতেং হৌজিক ফাওবদা লৈতে।

help-unresolved-ref =
    { $reason ->
        [notFound] মরী অসিগী পান্দম অমত্তা ফংদে: { $ref }।
        [multiple] মরী অসিগী পান্দম কয়া ফংলে: { $ref }।
       *[indeterminate] { $ref }গী পান্দম লেপ্পা ঙমদে।
    }

help-learn-about-references = মরীগী মরমদা খঙবিয়ু →
help-reference-page = মরীগী লামায় →

help-suggestions-header =
    { $location ->
        [inside] { $element }গী মনুংদা
       *[top] খ্বাইদগী মথক্কী থাক্তা
    }{ $allowed ->
        [none] { " — মফম অসিদা করিসু চংবা য়াদে।" }
        [text] { " — মফম অসিদা ৱারোল ইরো।" }
        [text-and-components] { " — মফম অসিদা ৱারোল ইরো, নত্ত্রগা মসিসিং হোৎনবিয়ু:" }
       *[components] { " — মসিসিং হোৎনবিয়ু:" }
    }

help-suggestions-footer = পুম্নমক { $total } শরুক উনবা { $shortcut } নম্বিয়ু।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } অসি { $target }গী মরী অমনি।
       *[other] { $ref } অসি { $target }গী মরী অমনি (পরেং { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner }না { $role } ওইনা পুরকখি।
       *[other] { $owner }না পরেং { $line }দা { $role } ওইনা পুরকখি।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } অসি { $element }গী { $property } মগুনগী মরী অমনি।
       *[other] { $ref } অসি { $element }গী { $property } মগুনগী মরী অমনি (পরেং { $line })।
    }

help-kind-attribute = এট্রিবিউট
help-kind-snippet = শরুক
help-kind-array-entry = শরনী এন্ত্রি

help-default = অহানবা:
help-active-default = থবক তৌরিবা অহানবা:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] য়াবা মমল (পোৎ খুদিংগী অমা):
       *[other] য়াবা মমল:
    }

help-suggested-values = পাউতাকপা মমল:

help-inserts = হাপচিল্লি:

help-coordinates =
    { $count ->
        [one] নির্দেশাংক:
       *[other] নির্দেশাংক:
    }

help-type = মখল:

help-resolved-style = লেপখ্রবা মওং (styleNumber { $styleNumber }):

help-resolved-function-names = লেপখ্রবা ফলনগী মমিং:
help-reset-list = ইনপুত অসিদা অমুক হন্না শেম্বগী পরিং:
help-added-on-input = ইনপুত অসিদা হাপচিনখ্রবা:
help-removed-on-input = ইনপুত অসিদা লৌথোকখ্রবা:

help-reset-overrides = { $reset }না { $additional } অমসুং { $removed }গী মথক্তা লৈ।
