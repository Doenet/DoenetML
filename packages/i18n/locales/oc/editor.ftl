# Occitan editor and language-server surfaces. Translated from
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


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reïnicializar
       *[update] Actualizar
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } lo visionador
       *[other] { $word } lo visionador { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtre…
editor-variant-next = Seleccionar lo variant seguent
editor-variant-previous = Seleccionar lo variant precedent


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Una violacion d'accessibilitat segon WCAG AA es estada identificada. Clicatz per { $action ->
            [close] tampar
           *[open] dobrir
        } lo rapòrt d'accessibilitat.
        [advisories] Clicatz per { $action ->
            [close] tampar
           *[open] dobrir
        } lo rapòrt d'accessibilitat. Cap de violacion WCAG AA es pas estada trobada, mas i a d'autras recomandacions d'accessibilitat.
       *[clean] Clicatz per { $action ->
            [close] tampar
           *[open] dobrir
        } lo rapòrt d'accessibilitat. Cap de problèma d'accessibilitat es pas estat trobat.
    }

editor-accessibility-label =
    { $status ->
        [violations] Una violacion d'accessibilitat segon WCAG AA es estada identificada. { $count ->
            [one] { $count } violacion WCAG AA trobada
           *[other] { $count } violacions WCAG AA trobadas
        }. Clicatz per { $action ->
            [close] tampar
           *[open] dobrir
        } lo rapòrt d'accessibilitat.
        [advisories] Cap de violacion WCAG AA es pas estada identificada. { $count ->
            [one] { $count } recomandacion d'accessibilitat suplementària trobada
           *[other] { $count } recomandacions d'accessibilitat suplementàrias trobadas
        }. Clicatz per { $action ->
            [close] tampar
           *[open] dobrir
        } lo rapòrt d'accessibilitat.
       *[clean] Cap de violacion WCAG AA es pas estada identificada. Clicatz per { $action ->
            [close] tampar
           *[open] dobrir
        } lo rapòrt d'accessibilitat.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Version { $version } de DoenetML

editor-tab-help = Ajuda contextuala
editor-tab-help-short = Contèxte
editor-tab-errors = Errors
editor-tab-warnings = Avertiments
editor-tab-info = Informacions
editor-tab-accessibility = Accessibilitat
editor-tab-responses = Responsas mandadas

editor-tab-with-count = { $label } : { $count }

editor-options = Opcions de l'editor
editor-format-as-doenetml = Formatar coma DoenetML
editor-format-as-xml = Formatar coma XML


## The diagnostics panel

editor-diagnostic-line = Linha n° { $line }

editor-no-errors = Cap d'error
editor-no-warnings = Cap d'avertiment
editor-no-info = Cap de messatge informatiu

editor-show-info-annotations = Mostrar los messatges informatius dins l'editor
editor-show-accessibility-annotations = Mostrar los messatges d'accessibilitat dins l'editor

editor-accessibility-learn-more = Cossí Doenet abòrda l'accessibilitat

editor-accessibility-violations-heading = Violacions d'accessibilitat ({ $standard })

editor-accessibility-other-heading = Autres problèmas d'accessibilitat
editor-none-found = Res de trobat


## Submitted responses

editor-no-responses = Cap de responsa mandada pel moment
editor-response-answer-id = Id de la responsa
editor-response-response = Responsa
editor-response-credit = Punts
editor-response-submitted = Mandada


## The context-help panel

help-placeholder = Plaçatz lo cursor sus un nom de balisa, un atribut o { $ref } per la documentacion.

help-unsupported-ref-chain = L'ajuda per las referéncias en mai d'una part coma { $example } es pas encara presa en carga.

help-unresolved-ref =
    { $reason ->
        [notFound] Cap de referent pas trobat per la referéncia : { $ref }.
        [multiple] Mai d'un referent trobat per la referéncia : { $ref }.
       *[indeterminate] Un referent per { $ref } a pas pogut èsser determinat.
    }

help-learn-about-references = Ne saber mai sus las referéncias →
help-reference-page = Pagina de referéncia →

help-suggestions-header =
    { $location ->
        [inside] Dins { $element }
       *[top] Al nivèl superior
    }{ $allowed ->
        [none] { " — res i va pas." }
        [text] { " — picatz de tèxte aicí." }
        [text-and-components] { " — picatz de tèxte aicí, o ensajatz :" }
       *[components] { " — ensajatz :" }
    }

help-suggestions-footer = Quichatz { $shortcut } per veire los { $total } components.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } es una referéncia a { $target }.
       *[other] { $ref } es una referéncia a { $target } (linha { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introdusida per { $owner } coma { $role }.
       *[other] Introdusida per { $owner } a la linha { $line } coma { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } es una referéncia a la proprietat { $property } de { $element }.
       *[other] { $ref } es una referéncia a la proprietat { $property } de { $element } (linha { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = fragment
help-kind-array-entry = entrada de tablèu

help-default = Valor per defaut :
help-active-default = Valor per defaut activa :

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valors permesas (una per element) :
       *[other] Valors permesas :
    }

help-suggested-values = Valors suggeridas :

help-inserts = Inserís :

help-coordinates =
    { $count ->
        [one] Coordenada :
       *[other] Coordenadas :
    }

help-type = Tipe :

help-resolved-style = Estil resolgut (styleNumber { $styleNumber }) :

help-resolved-function-names = Noms de foncions resolguts :
help-reset-list = Lista de reïnicializacion sus aqueste camp :
help-added-on-input = Apondut sus aqueste camp :
help-removed-on-input = Levat sus aqueste camp :

help-reset-overrides = { $reset } passa davant { $additional } e { $removed }.
