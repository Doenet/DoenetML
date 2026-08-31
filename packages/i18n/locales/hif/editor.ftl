# Fiji Hindi (Fiji Baat) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel beside them. Translated from `locales/en/editor.ftl`,
# which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Latin script, left to right, the conventional Fiji Hindi orthography — the
# same convention `chrome.ftl` states, and the four files of this locale must
# not be split between two scripts.
#
# Fiji Hindi is verb-final, so where English drops a bare verb into the middle
# of a sentence — "Click to { $action } accessibility report" — the whole
# sentence sits inside the selector instead. Fluent does not care where a
# select falls in a pattern.
#
# No message here selects on a plural category: CLDR has none for `hif`, and a
# Fiji Hindi noun after a numeral stays unmarked in any case, so every count
# message is a single `*[other]` with the count kept in the selector.
#
# `WCAG`, `DoenetML`, `XML`, `styleNumber` and every element or attribute name
# are identifiers rather than words and stay exactly as written.
#
# **This is the thinnest of the four files, and the reason is not shyness.**
# The context-help panel talks about references, properties, arrays and
# resolved types, and the only words Fiji Hindi has for any of that are the
# English ones — `reference`, `property`, `array`, `type`, `style`,
# `coordinate` — because that is the language every Fiji Hindi speaker met
# these ideas in. They are kept rather than replaced with Sanskritic coinages,
# which would produce Standard Hindi under this tag. What is Fiji Hindi here is
# the frame around them: the postpositions, the verb-final order, and the `-o`
# imperative on every control.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reset
       *[update] Update
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Viewer ke { $word } karo
       *[other] Viewer ke { $word } karo { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Chhaano...
editor-variant-next = Agla variant chuno
editor-variant-previous = Pichhla variant chuno


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA accessibility ke ulanghan milaa. { $action ->
            [close] Accessibility report band kare ke liye click karo.
           *[open] Accessibility report kholne ke liye click karo.
        }
        [advisories] { $action ->
            [close] Accessibility report band kare ke liye click karo.
           *[open] Accessibility report kholne ke liye click karo.
        } WCAG AA ke koi ulanghan nai milaa, lekin accessibility ke kuchhu aur salaah hai.
       *[clean] { $action ->
            [close] Accessibility report band kare ke liye click karo.
           *[open] Accessibility report kholne ke liye click karo.
        } Accessibility ke koi samasya nai milaa.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA accessibility ke ulanghan milaa. { $count } WCAG AA ulanghan milaa. { $action ->
            [close] Accessibility report band kare ke liye click karo.
           *[open] Accessibility report kholne ke liye click karo.
        }
        [advisories] WCAG AA ke koi ulanghan nai milaa. Accessibility ke { $count } aur salaah milaa. { $action ->
            [close] Accessibility report band kare ke liye click karo.
           *[open] Accessibility report kholne ke liye click karo.
        }
       *[clean] WCAG AA ke koi ulanghan nai milaa. { $action ->
            [close] Accessibility report band kare ke liye click karo.
           *[open] Accessibility report kholne ke liye click karo.
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = Jagah ke hisaab se madad
editor-tab-help-short = Jagah
editor-tab-errors = Galti
editor-tab-warnings = Chetaawni
editor-tab-info = Jaankaari
editor-tab-accessibility = Accessibility
editor-tab-responses = Bhejaa gais jawaab

editor-tab-with-count = { $label }: { $count }

editor-options = Editor ke setting
editor-format-as-doenetml = DoenetML jaisan format karo
editor-format-as-xml = XML jaisan format karo


## The diagnostics panel

editor-diagnostic-line = Line #{ $line }

editor-no-errors = Koi galti nai
editor-no-warnings = Koi chetaawni nai
editor-no-info = Koi info diagnostic nai

editor-show-info-annotations = Editor me info diagnostic dekhao
editor-show-accessibility-annotations = Editor me accessibility diagnostic dekhao

editor-accessibility-learn-more = Jaano ki Doenet accessibility ke kaise dekhe hai →

editor-accessibility-violations-heading = Accessibility ke ulanghan ({ $standard })

editor-accessibility-other-heading = Accessibility ke dusra samasya
editor-none-found = Kuchhu nai milaa


## Submitted responses

editor-no-responses = Abhi tak koi jawaab nai bhejaa gais
editor-response-answer-id = Answer ke id
editor-response-response = Jawaab
editor-response-credit = Marks
editor-response-submitted = Bhejne ke time


## The context-help panel

help-placeholder = Documentation ke liye cursor ke kono tag ke naam, attribute ya { $ref } pe rakho.

help-unsupported-ref-chain = { $example } jaisan bahut hissa waala reference ke liye madad abhi tak nai hai.

help-unresolved-ref =
    { $reason ->
        [notFound] Reference { $ref } ke liye koi referent nai milaa.
        [multiple] Reference { $ref } ke liye bahut referent milaa.
       *[indeterminate] { $ref } ke referent pataa nai chal sakaa.
    }

help-learn-about-references = Reference ke baare me jaano →
help-reference-page = Reference ke panna →

help-suggestions-header =
    { $location ->
        [inside] { $element } ke andar
       *[top] Sab se uupar ke level pe
    }{ $allowed ->
        [none] { " — iihaan kuchhu nai aawe hai." }
        [text] { " — iihaan text likho." }
        [text-and-components] { " — iihaan text likho, ya ii koshish karo:" }
       *[components] { " — koshish kare ke chiij:" }
    }

help-suggestions-footer = Sab { $total } component dekhne ke liye { $shortcut } dabao.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target } ke ek reference hai.
       *[other] { $ref } { $target } ke ek reference hai (line { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } iske { $role } ke roop me laais hai.
       *[other] { $owner } iske line { $line } pe { $role } ke roop me laais hai.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element } ke { $property } property ke ek reference hai.
       *[other] { $ref } { $element } ke { $property } property ke ek reference hai (line { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = snippet
help-kind-array-entry = array ke entry

help-default = Default:
help-active-default = Chaalu default:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Chalne waala value (har chiij ke liye ek):
       *[other] Chalne waala value:
    }

help-suggested-values = Salaah diyaa gais value:

help-inserts = Jorhe hai:

help-coordinates =
    { $count ->
       *[other] Coordinate:
    }

help-type = Type:

help-resolved-style = Nikaalaa gais style (styleNumber { $styleNumber }):

help-resolved-function-names = Nikaalaa gais function ke naam:
help-reset-list = Ii input pe list reset karo:
help-added-on-input = Ii input pe jorhaa gais:
help-removed-on-input = Ii input se hataawa gais:

help-reset-overrides = { $reset } { $additional } aur { $removed } ke uupar chale hai.
