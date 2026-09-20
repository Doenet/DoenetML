# Newar / Nepal Bhasa (नेपाल भाषा) editor and language-server surfaces: the
# footer, the diagnostics panel, the variant picker, the accessibility button,
# and the context-help panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and register** are `chrome.ftl`'s: Devanagari rather than Ranjana,
# and a Nepali-and-Sanskrit technical vocabulary declared as a loan register
# around a Newar frame — मदु, मखु, मफु, दु, याये, यानादिसँ, नापं, निंतिं, या,
# ल्यंगु, लुत.
#
# **`WCAG`, `DoenetML`, `styleNumber` and every element and attribute name
# stay in English.** They are identifiers an author types, not words. So does
# `$shortcut`, which is a key combination, and `$version`, `$standard` and
# `$ref`.
#
# **The counts do not fork.** `editor-accessibility-label` and
# `help-coordinates` write a single `*[other]` where English writes `[one]`
# and `[other]`: CLDR has no plural data for `new`, so an English-selected
# branch here would be a category this locale cannot reach. A Newar noun is
# unmarked for number after a numeral in any case, so the single form is also
# the grammatical one.
#
# **The arrow `→` in the two link labels is direction rather than
# punctuation** and is left where English puts it: Newar is written left to
# right.
#
# **Numbers render in Latin digits** (#1615).


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] रिसेट
       *[update] अपडेट
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] भ्युअर { $word }
       *[other] भ्युअर { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = छान्नेगु...
editor-variant-next = लिपांगु variant ल्यनादिसँ
editor-variant-previous = न्ह्यःगु variant ल्यनादिसँ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA पहुँचयोग्यता उल्लङ्घन लुत। पहुँचयोग्यता प्रतिवेदन { $action ->
            [close] बन्द
           *[open] खुल्ला
        } यायेत क्लिक यानादिसँ।
        [advisories] पहुँचयोग्यता प्रतिवेदन { $action ->
            [close] बन्द
           *[open] खुल्ला
        } यायेत क्लिक यानादिसँ। छुं नं WCAG AA उल्लङ्घन लुइ मफुत, तर मेमेगु पहुँचयोग्यता सुझाव दु।
       *[clean] पहुँचयोग्यता प्रतिवेदन { $action ->
            [close] बन्द
           *[open] खुल्ला
        } यायेत क्लिक यानादिसँ। छुं नं पहुँचयोग्यता समस्या लुइ मफुत।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA पहुँचयोग्यता उल्लङ्घन लुत। { $count ->
           *[other] { $count } WCAG AA उल्लङ्घन
        } लुत। पहुँचयोग्यता प्रतिवेदन { $action ->
            [close] बन्द
           *[open] खुल्ला
        } यायेत क्लिक यानादिसँ।
        [advisories] छुं नं WCAG AA उल्लङ्घन लुइ मफुत। { $count ->
           *[other] { $count } मेमेगु पहुँचयोग्यता सुझाव
        } लुत। पहुँचयोग्यता प्रतिवेदन { $action ->
            [close] बन्द
           *[open] खुल्ला
        } यायेत क्लिक यानादिसँ।
       *[clean] छुं नं WCAG AA उल्लङ्घन लुइ मफुत। पहुँचयोग्यता प्रतिवेदन { $action ->
            [close] बन्द
           *[open] खुल्ला
        } यायेत क्लिक यानादिसँ।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML संस्करण { $version }

editor-tab-help = प्रसंग अनुसारया ग्वाहालि
editor-tab-help-short = प्रसंग
editor-tab-errors = त्रुटित
editor-tab-warnings = चेतावनीत
editor-tab-info = जानकारी
editor-tab-accessibility = पहुँचयोग्यता
editor-tab-responses = छ्वयातःगु लिसःत

editor-tab-with-count = { $label }: { $count }

editor-options = सम्पादक विकल्प
editor-format-as-doenetml = DoenetML कथं ढाँचाबद्ध यायेगु
editor-format-as-xml = XML कथं ढाँचाबद्ध यायेगु


## The diagnostics panel

editor-diagnostic-line = लाइन #{ $line }

editor-no-errors = छुं त्रुटि मदु
editor-no-warnings = छुं चेतावनी मदु
editor-no-info = छुं जानकारी सूचना मदु

editor-show-info-annotations = सम्पादकय् जानकारी सूचना क्यनादिसँ
editor-show-accessibility-annotations = सम्पादकय् पहुँचयोग्यता सूचना क्यनादिसँ

editor-accessibility-learn-more = Doenet न पहुँचयोग्यतायात गथे कयाच्वंगु दु स्यनादिसँ

editor-accessibility-violations-heading = पहुँचयोग्यता उल्लङ्घन ({ $standard })

editor-accessibility-other-heading = मेमेगु पहुँचयोग्यता समस्या
editor-none-found = छुं नं लुइ मफुत


## Submitted responses

editor-no-responses = अजु छुं नं लिसः छ्वयातःगु मदु
editor-response-answer-id = Answer Id
editor-response-response = लिसः
editor-response-credit = अंक
editor-response-submitted = छ्वयाधुंकल


## The context-help panel

help-placeholder = दस्तावेजया निंतिं कर्सर छगू ट्यागया नां, विशेषता वा { $ref } य् तयादिसँ।

help-unsupported-ref-chain = { $example } थें ज्याःगु अप्व भागया सन्दर्भया निंतिं ग्वाहालि अजु लागू जुइ मफु।

help-unresolved-ref =
    { $reason ->
        [notFound] सन्दर्भया निंतिं छुं नं लक्ष्य लुइ मफुत: { $ref }।
        [multiple] सन्दर्भया निंतिं अप्व लक्ष्य लुत: { $ref }।
       *[indeterminate] { $ref } या लक्ष्य निर्धारण याये मफुत।
    }

help-learn-about-references = सन्दर्भया बारे स्यनादिसँ →
help-reference-page = सन्दर्भ पेज →

help-suggestions-header =
    { $location ->
        [inside] { $element } या दुने
       *[top] च्वयागु तहय्
    }{ $allowed ->
        [none] { " — थन छुं नं तये मज्यू।" }
        [text] { " — थन अक्षर च्वयादिसँ।" }
        [text-and-components] { " — थन अक्षर च्वयादिसँ, वा थ्व कुतः यानादिसँ:" }
       *[components] { " — कुतः यायेत्वःगु खँ:" }
    }

help-suggestions-footer = दक्व { $total } घटक स्वयेत { $shortcut } थिचादिसँ।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target } या छगू सन्दर्भ ख:।
       *[other] { $ref } { $target } या छगू सन्दर्भ ख: (लाइन { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } न { $role } कथं हयागु।
       *[other] { $owner } न लाइन { $line } य् { $role } कथं हयागु।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element } या { $property } गुणया छगू सन्दर्भ ख:।
       *[other] { $ref } { $element } या { $property } गुणया छगू सन्दर्भ ख: (लाइन { $line })।
    }

help-kind-attribute = विशेषता
help-kind-snippet = स्निपेट
help-kind-array-entry = सरणी प्रविष्टि

help-default = पूर्वनिर्धारित:
help-active-default = सक्रिय पूर्वनिर्धारित:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] मिले जुइगु मान (दक्व वस्तुया निंतिं छगू):
       *[other] मिले जुइगु मान:
    }

help-suggested-values = सुझाव जूगु मान:

help-inserts = दुथ्याकी:

help-coordinates =
    { $count ->
       *[other] निर्देशाङ्क:
    }

help-type = प्रकार:

help-resolved-style = निर्धारित शैली (styleNumber { $styleNumber }):

help-resolved-function-names = निर्धारित फलनया नां:
help-reset-list = थ्व input य् रिसेट सूची:
help-added-on-input = थ्व input य् तयागु:
help-removed-on-input = थ्व input य् पिकयागु:

help-reset-overrides = { $reset } न { $additional } व { $removed } यात लिकनी।
