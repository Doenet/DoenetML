# Galician editor and language-server surfaces. Translated from
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
# Galician counts in the same two categories English does, so every selection
# below keeps both branches.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Restablecer
       *[update] Actualizar
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } o visualizador
       *[other] { $word } o visualizador { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Filtrar…
editor-variant-next = Seleccionar a seguinte variante
editor-variant-previous = Seleccionar a variante anterior


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Detectouse un incumprimento de accesibilidade WCAG AA. Prema para { $action ->
            [close] pechar
           *[open] abrir
        } o informe de accesibilidade.
        [advisories] Prema para { $action ->
            [close] pechar
           *[open] abrir
        } o informe de accesibilidade. Non se atopou ningún incumprimento de WCAG AA, pero hai recomendacións de accesibilidade adicionais.
       *[clean] Prema para { $action ->
            [close] pechar
           *[open] abrir
        } o informe de accesibilidade. Non se atopou ningún problema de accesibilidade.
    }

editor-accessibility-label =
    { $status ->
        [violations] Detectouse un incumprimento de accesibilidade WCAG AA. { $count ->
            [one] Atopouse { $count } incumprimento de WCAG AA
           *[other] Atopáronse { $count } incumprimentos de WCAG AA
        }. Prema para { $action ->
            [close] pechar
           *[open] abrir
        } o informe de accesibilidade.
        [advisories] Non se detectou ningún incumprimento de WCAG AA. { $count ->
            [one] Atopouse { $count } recomendación de accesibilidade adicional
           *[other] Atopáronse { $count } recomendacións de accesibilidade adicionais
        }. Prema para { $action ->
            [close] pechar
           *[open] abrir
        } o informe de accesibilidade.
       *[clean] Non se detectou ningún incumprimento de WCAG AA. Prema para { $action ->
            [close] pechar
           *[open] abrir
        } o informe de accesibilidade.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versión { $version } de DoenetML

editor-tab-help = Axuda contextual
editor-tab-help-short = Contexto
editor-tab-errors = Erros
editor-tab-warnings = Avisos
editor-tab-info = Información
editor-tab-accessibility = Accesibilidade
editor-tab-responses = Respostas enviadas

editor-tab-with-count = { $label }: { $count }

editor-options = Opcións do editor
editor-format-as-doenetml = Formatar como DoenetML
editor-format-as-xml = Formatar como XML


## The diagnostics panel

editor-diagnostic-line = Liña #{ $line }

editor-no-errors = Sen erros
editor-no-warnings = Sen avisos
editor-no-info = Sen diagnósticos informativos

editor-show-info-annotations = Amosar os diagnósticos informativos no editor
editor-show-accessibility-annotations = Amosar os diagnósticos de accesibilidade no editor

editor-accessibility-learn-more = Descubra como aborda Doenet a accesibilidade

editor-accessibility-violations-heading = Incumprimentos de accesibilidade ({ $standard })

editor-accessibility-other-heading = Outros problemas de accesibilidade
editor-none-found = Non se atopou ningún


## Submitted responses

editor-no-responses = Aínda non se enviou ningunha resposta
editor-response-answer-id = Identificador da resposta
editor-response-response = Resposta
editor-response-credit = Puntuación
editor-response-submitted = Enviada


## The context-help panel

help-placeholder = Sitúe o cursor sobre un nome de etiqueta, un atributo ou { $ref } para ver a documentación.

help-unsupported-ref-chain = Aínda non se admite a axuda para referencias de varias partes como { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Non se atopou ningún referente para a referencia: { $ref }.
        [multiple] Atopáronse varios referentes para a referencia: { $ref }.
       *[indeterminate] Non se puido determinar ningún referente para { $ref }.
    }

help-learn-about-references = Máis información sobre as referencias →
help-reference-page = Páxina de referencia →

help-suggestions-header =
    { $location ->
        [inside] Dentro de { $element }
       *[top] No nivel superior
    }{ $allowed ->
        [none] { " — aquí non vai nada." }
        [text] { " — escriba texto aquí." }
        [text-and-components] { " — escriba texto aquí, ou probe:" }
       *[components] { " — cousas para probar:" }
    }

help-suggestions-footer = Prema { $shortcut } para ver os { $total } compoñentes.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } é unha referencia a { $target }.
       *[other] { $ref } é unha referencia a { $target } (liña { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introducido por { $owner } como { $role }.
       *[other] Introducido por { $owner } na liña { $line } como { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } é unha referencia á propiedade { $property } de { $element }.
       *[other] { $ref } é unha referencia á propiedade { $property } de { $element } (liña { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = fragmento
help-kind-array-entry = entrada de matriz

help-default = Valor predeterminado:
help-active-default = Valor predeterminado activo:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valores permitidos (un por elemento):
       *[other] Valores permitidos:
    }

help-suggested-values = Valores suxeridos:

help-inserts = Insire:

help-coordinates =
    { $count ->
        [one] Coordenada:
       *[other] Coordenadas:
    }

help-type = Tipo:

help-resolved-style = Estilo resolto (styleNumber { $styleNumber }):

help-resolved-function-names = Nomes de función resoltos:
help-reset-list = Restablecer a lista nesta entrada:
help-added-on-input = Engadido nesta entrada:
help-removed-on-input = Quitado nesta entrada:

help-reset-overrides = { $reset } prevalece sobre { $additional } e { $removed }.
