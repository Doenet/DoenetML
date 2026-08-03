# Filipino editor and language-server surfaces. Translated from
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
# name are identifiers, not prose, and stay as written.
#
# Filipino's two plural categories are not singular and plural — they are the
# linker a numeral takes, `-ng` for `one` and the separate `na` for `other`
# (4, 6, 9 and anything ending in them). Number itself is the free word «mga»,
# so a message that wants a singular selects `[1]` by number. See the head of
# `chrome.ftl` for the whole of it.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] I-reset
       *[update] I-update
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } ang Tagatanaw
       *[other] { $word } ang Tagatanaw { $shortcut }
    }


## The variant picker

editor-variant = Baryante
editor-variant-filter = Salain...
editor-variant-next = Piliin ang susunod na baryante
editor-variant-previous = Piliin ang nakaraang baryante


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] May natukoy na paglabag sa accessibility ng WCAG AA. I-click para { $action ->
            [close] isara
           *[open] buksan
        } ang ulat sa accessibility.
        [advisories] I-click para { $action ->
            [close] isara
           *[open] buksan
        } ang ulat sa accessibility. Walang natagpuang paglabag sa WCAG AA, ngunit may karagdagang mga rekomendasyon sa accessibility.
       *[clean] I-click para { $action ->
            [close] isara
           *[open] buksan
        } ang ulat sa accessibility. Walang natagpuang isyu sa accessibility.
    }

editor-accessibility-label =
    { $status ->
        [violations] May natukoy na paglabag sa accessibility ng WCAG AA. { $count ->
            [one] { $count } paglabag sa WCAG AA
           *[other] { $count } na paglabag sa WCAG AA
        } ang natagpuan. I-click para { $action ->
            [close] isara
           *[open] buksan
        } ang ulat sa accessibility.
        [advisories] Walang natukoy na paglabag sa WCAG AA. { $count ->
            [one] { $count } karagdagang rekomendasyon sa accessibility
           *[other] { $count } na karagdagang rekomendasyon sa accessibility
        } ang natagpuan. I-click para { $action ->
            [close] isara
           *[open] buksan
        } ang ulat sa accessibility.
       *[clean] Walang natukoy na paglabag sa WCAG AA. I-click para { $action ->
            [close] isara
           *[open] buksan
        } ang ulat sa accessibility.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML bersyon { $version }

editor-tab-help = Tulong ayon sa konteksto
editor-tab-help-short = Konteksto
editor-tab-errors = Mga Error
editor-tab-warnings = Mga Babala
editor-tab-info = Impormasyon
editor-tab-accessibility = Accessibility
editor-tab-responses = Mga naipasang sagot

editor-tab-with-count = { $label }: { $count }

editor-options = Mga opsiyon ng editor
editor-format-as-doenetml = I-format bilang DoenetML
editor-format-as-xml = I-format bilang XML


## The diagnostics panel

editor-diagnostic-line = Linya #{ $line }

editor-no-errors = Walang Error
editor-no-warnings = Walang Babala
editor-no-info = Walang Diagnostic na Impormasyon

editor-show-info-annotations = Ipakita ang mga diagnostic na impormasyon sa editor
editor-show-accessibility-annotations = Ipakita ang mga diagnostic sa accessibility sa editor

editor-accessibility-learn-more = Alamin ang paninindigan ng Doenet sa accessibility

editor-accessibility-violations-heading = Mga paglabag sa accessibility ({ $standard })

editor-accessibility-other-heading = Iba pang isyu sa accessibility
editor-none-found = Walang natagpuan


## Submitted responses

editor-no-responses = Wala pang naipasang sagot
editor-response-answer-id = Id ng Sagot
editor-response-response = Sagot
editor-response-credit = Puntos
editor-response-submitted = Naipasa


## The context-help panel

help-placeholder = Ilagay ang cursor sa pangalan ng tag, attribute, o { $ref } para sa dokumentasyon.

help-unsupported-ref-chain = Hindi pa suportado ang tulong para sa mga sanggunian na maraming bahagi tulad ng { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Walang natagpuang tinutukoy ng sanggunian: { $ref }.
        [multiple] Maraming natagpuang tinutukoy ng sanggunian: { $ref }.
       *[indeterminate] Hindi matukoy ang tinutukoy ng { $ref }.
    }

help-learn-about-references = Alamin ang tungkol sa mga sanggunian →
help-reference-page = Pahina ng sanggunian →

help-suggestions-header =
    { $location ->
        [inside] Sa loob ng { $element }
       *[top] Sa pinakamataas na antas
    }{ $allowed ->
        [none] { " — walang puwedeng ilagay dito." }
        [text] { " — puwedeng mag-type ng teksto dito." }
        [text-and-components] { " — puwedeng mag-type ng teksto dito, o subukan ang:" }
       *[components] { " — mga puwedeng subukan:" }
    }

help-suggestions-footer =
    { $total ->
        [one] Pindutin ang { $shortcut } para makita ang lahat ng { $total } bahagi.
       *[other] Pindutin ang { $shortcut } para makita ang lahat ng { $total } na bahagi.
    }

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Ang { $ref } ay sanggunian sa { $target }.
       *[other] Ang { $ref } ay sanggunian sa { $target } (linya { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ipinasok ng { $owner } bilang { $role }.
       *[other] Ipinasok ng { $owner } sa linya { $line } bilang { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Ang { $ref } ay sanggunian sa katangiang { $property } ng { $element }.
       *[other] Ang { $ref } ay sanggunian sa katangiang { $property } ng { $element } (linya { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = snippet
help-kind-array-entry = entri sa array

help-default = Default:
help-active-default = Aktibong default:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mga pinapayagang halaga (isa sa bawat aytem):
       *[other] Mga pinapayagang halaga:
    }

help-suggested-values = Mga iminumungkahing halaga:

help-inserts = Ipinapasok:

help-coordinates =
    { $count ->
        [1] Koordinado:
       *[other] Mga koordinado:
    }

help-type = Uri:

help-resolved-style = Natukoy na estilo (styleNumber { $styleNumber }):

help-resolved-function-names = Mga natukoy na pangalan ng punsiyon:
help-reset-list = Listahang nire-reset sa input na ito:
help-added-on-input = Idinagdag sa input na ito:
help-removed-on-input = Inalis sa input na ito:

help-reset-overrides = Nananaig ang { $reset } sa { $additional } at { $removed }.
