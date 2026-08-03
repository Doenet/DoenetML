# Igbo editor and language-server surfaces. Translated from
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
# Igbo has a single plural category, so a countable message needs no selection.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Tọghata
       *[update] Melite
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Ngosi
       *[other] { $word } Ngosi { $shortcut }
    }


## The variant picker

editor-variant = Ụdị
editor-variant-filter = Nyocha...
editor-variant-next = Họrọ ụdị na-esote
editor-variant-previous = Họrọ ụdị gara aga


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Achọpụtara mmebi nnweta WCAG AA. Pịa iji { $action ->
            [close] mechie
           *[open] mepee
        } akụkọ nnweta.
        [advisories] Pịa iji { $action ->
            [close] mechie
           *[open] mepee
        } akụkọ nnweta. Achọtaghị mmebi WCAG AA ọ bụla, mana e nwere ndụmọdụ nnweta ndị ọzọ.
       *[clean] Pịa iji { $action ->
            [close] mechie
           *[open] mepee
        } akụkọ nnweta. Achọtaghị nsogbu nnweta ọ bụla.
    }

editor-accessibility-label =
    { $status ->
        [violations] Achọpụtara mmebi nnweta WCAG AA. Achọtara mmebi WCAG AA { $count }. Pịa iji { $action ->
            [close] mechie
           *[open] mepee
        } akụkọ nnweta.
        [advisories] Achọpụtaghị mmebi WCAG AA ọ bụla. Achọtara ndụmọdụ nnweta ọzọ { $count }. Pịa iji { $action ->
            [close] mechie
           *[open] mepee
        } akụkọ nnweta.
       *[clean] Achọpụtaghị mmebi WCAG AA ọ bụla. Pịa iji { $action ->
            [close] mechie
           *[open] mepee
        } akụkọ nnweta.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Ụdị DoenetML { $version }

editor-tab-help = Enyemaka dabere n'ọnọdụ
editor-tab-help-short = Ọnọdụ
editor-tab-errors = Njehie
editor-tab-warnings = Ịdọ aka ná ntị
editor-tab-info = Ozi
editor-tab-accessibility = Nnweta
editor-tab-responses = Azịza e zipụrụ

editor-tab-with-count = { $label }: { $count }

editor-options = Nhọrọ nhazi
editor-format-as-doenetml = Hazie dị ka DoenetML
editor-format-as-xml = Hazie dị ka XML


## The diagnostics panel

editor-diagnostic-line = Ahịrị #{ $line }

editor-no-errors = Ọ Dịghị Njehie
editor-no-warnings = Ọ Dịghị Ịdọ aka ná ntị
editor-no-info = Ọ Dịghị Nyocha Ozi

editor-show-info-annotations = Gosi nyocha ozi n'ime nhazi
editor-show-accessibility-annotations = Gosi nyocha nnweta n'ime nhazi

editor-accessibility-learn-more = Mụta ka Doenet si ele nnweta anya

editor-accessibility-violations-heading = Mmebi nnweta ({ $standard })

editor-accessibility-other-heading = Nsogbu nnweta ndị ọzọ
editor-none-found = Achọtaghị ihe ọ bụla


## Submitted responses

editor-no-responses = Ọ dịbeghị azịza e zipụrụ
editor-response-answer-id = Njirimara Azịza
editor-response-response = Azịza
editor-response-credit = Akara
editor-response-submitted = E zipụrụ


## The context-help panel

help-placeholder = Tinye ihe nrịbama n'aha akara, n'àgwà ma ọ bụ n'{ $ref } maka akwụkwọ nkọwa.

help-unsupported-ref-chain = Akwadobeghị enyemaka maka ntụaka nwere akụkụ ọtụtụ dị ka { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Achọtaghị ihe a na-ezo aka na ya maka ntụaka: { $ref }.
        [multiple] Achọtara ọtụtụ ihe a na-ezo aka na ha maka ntụaka: { $ref }.
       *[indeterminate] Enweghị ike ịkọwa ihe { $ref } na-ezo aka na ya.
    }

help-learn-about-references = Mụta banyere ntụaka →
help-reference-page = Ibe ntụaka →

help-suggestions-header =
    { $location ->
        [inside] N'ime { $element }
       *[top] N'ọkwa kachasị elu
    }{ $allowed ->
        [none] { " — ọ dịghị ihe na-aga ebe a." }
        [text] { " — pịnye ederede ebe a." }
        [text-and-components] { " — pịnye ederede ebe a, ma ọ bụ nwaa:" }
       *[components] { " — ihe ị ga-anwale:" }
    }

help-suggestions-footer = Pịa { $shortcut } iji hụ akụkụ niile { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } bụ ntụaka na { $target }.
       *[other] { $ref } bụ ntụaka na { $target } (ahịrị { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } webatara ya dị ka { $role }.
       *[other] { $owner } webatara ya n'ahịrị { $line } dị ka { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } bụ ntụaka na àgwà { $property } nke { $element }.
       *[other] { $ref } bụ ntụaka na àgwà { $property } nke { $element } (ahịrị { $line }).
    }

help-kind-attribute = àgwà
help-kind-snippet = obere akụkụ
help-kind-array-entry = ntinye ndepụta

help-default = Ndabara:
help-active-default = Ndabara na-arụ ọrụ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ụkpụrụ ekwenyere (otu maka ihe ọ bụla):
       *[other] Ụkpụrụ ekwenyere:
    }

help-suggested-values = Ụkpụrụ atụrụ aro:

help-inserts = Ọ na-etinye:

help-coordinates = Ebe:

help-type = Ụdị:

help-resolved-style = Ụdị e kpebiri (styleNumber { $styleNumber }):

help-resolved-function-names = Aha ọrụ e kpebiri:
help-reset-list = Ndepụta a na-atọghata na ntinye a:
help-added-on-input = Ihe agbakwunyere na ntinye a:
help-removed-on-input = Ihe ewepụrụ na ntinye a:

help-reset-overrides = { $reset } na-akarị { $additional } na { $removed }.
