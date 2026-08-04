# Catalan editor and language-server surfaces. Translated from
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
# Catalan's `many` category applies only to the compact millions, which nothing
# below counts to, so every selection keeps the two branches English has.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reinicialitza
       *[update] Actualitza
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } el visualitzador
       *[other] { $word } el visualitzador { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtra…
editor-variant-next = Selecciona la variant següent
editor-variant-previous = Selecciona la variant anterior


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] S'ha detectat un incompliment d'accessibilitat WCAG AA. Feu clic per { $action ->
            [close] tancar
           *[open] obrir
        } l'informe d'accessibilitat.
        [advisories] Feu clic per { $action ->
            [close] tancar
           *[open] obrir
        } l'informe d'accessibilitat. No s'ha trobat cap incompliment de WCAG AA, però hi ha recomanacions d'accessibilitat addicionals.
       *[clean] Feu clic per { $action ->
            [close] tancar
           *[open] obrir
        } l'informe d'accessibilitat. No s'ha trobat cap problema d'accessibilitat.
    }

editor-accessibility-label =
    { $status ->
        [violations] S'ha detectat un incompliment d'accessibilitat WCAG AA. S'{ $count ->
            [one] ha trobat { $count } incompliment de WCAG AA
           *[other] han trobat { $count } incompliments de WCAG AA
        }. Feu clic per { $action ->
            [close] tancar
           *[open] obrir
        } l'informe d'accessibilitat.
        [advisories] No s'ha detectat cap incompliment de WCAG AA. S'{ $count ->
            [one] ha trobat { $count } recomanació d'accessibilitat addicional
           *[other] han trobat { $count } recomanacions d'accessibilitat addicionals
        }. Feu clic per { $action ->
            [close] tancar
           *[open] obrir
        } l'informe d'accessibilitat.
       *[clean] No s'ha detectat cap incompliment de WCAG AA. Feu clic per { $action ->
            [close] tancar
           *[open] obrir
        } l'informe d'accessibilitat.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versió { $version } de DoenetML

editor-tab-help = Ajuda contextual
editor-tab-help-short = Context
editor-tab-errors = Errors
editor-tab-warnings = Advertiments
editor-tab-info = Informació
editor-tab-accessibility = Accessibilitat
editor-tab-responses = Respostes enviades

editor-tab-with-count = { $label }: { $count }

editor-options = Opcions de l'editor
editor-format-as-doenetml = Formata com a DoenetML
editor-format-as-xml = Formata com a XML


## The diagnostics panel

editor-diagnostic-line = Línia #{ $line }

editor-no-errors = Cap error
editor-no-warnings = Cap advertiment
editor-no-info = Cap diagnòstic informatiu

editor-show-info-annotations = Mostra els diagnòstics informatius a l'editor
editor-show-accessibility-annotations = Mostra els diagnòstics d'accessibilitat a l'editor

editor-accessibility-learn-more = Descobriu com aborda Doenet l'accessibilitat

editor-accessibility-violations-heading = Incompliments d'accessibilitat ({ $standard })

editor-accessibility-other-heading = Altres problemes d'accessibilitat
editor-none-found = No se n'ha trobat cap


## Submitted responses

editor-no-responses = Encara no s'ha enviat cap resposta
editor-response-answer-id = Identificador de la resposta
editor-response-response = Resposta
editor-response-credit = Puntuació
editor-response-submitted = Enviada


## The context-help panel

help-placeholder = Situeu el cursor sobre un nom d'etiqueta, un atribut o { $ref } per veure'n la documentació.

help-unsupported-ref-chain = Encara no s'admet l'ajuda per a referències de diverses parts com ara { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] No s'ha trobat cap referent per a la referència: { $ref }.
        [multiple] S'han trobat diversos referents per a la referència: { $ref }.
       *[indeterminate] No s'ha pogut determinar cap referent per a { $ref }.
    }

help-learn-about-references = Més informació sobre les referències →
help-reference-page = Pàgina de referència →

help-suggestions-header =
    { $location ->
        [inside] Dins de { $element }
       *[top] Al nivell superior
    }{ $allowed ->
        [none] { " — aquí no hi va res." }
        [text] { " — escriviu text aquí." }
        [text-and-components] { " — escriviu text aquí, o proveu:" }
       *[components] { " — coses per provar:" }
    }

help-suggestions-footer = Premeu { $shortcut } per veure els { $total } components.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } és una referència a { $target }.
       *[other] { $ref } és una referència a { $target } (línia { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introduït per { $owner } com a { $role }.
       *[other] Introduït per { $owner } a la línia { $line } com a { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } és una referència a la propietat { $property } de { $element }.
       *[other] { $ref } és una referència a la propietat { $property } de { $element } (línia { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = fragment
help-kind-array-entry = entrada de matriu

help-default = Valor per defecte:
help-active-default = Valor per defecte actiu:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valors permesos (un per element):
       *[other] Valors permesos:
    }

help-suggested-values = Valors suggerits:

help-inserts = Insereix:

help-coordinates =
    { $count ->
        [one] Coordenada:
       *[other] Coordenades:
    }

help-type = Tipus:

help-resolved-style = Estil resolt (styleNumber { $styleNumber }):

help-resolved-function-names = Noms de funció resolts:
help-reset-list = Reinicialitza la llista en aquesta entrada:
help-added-on-input = Afegit en aquesta entrada:
help-removed-on-input = Eliminat en aquesta entrada:

help-reset-overrides = { $reset } preval sobre { $additional } i { $removed }.
