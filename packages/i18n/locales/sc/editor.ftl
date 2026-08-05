# Sardinian editor and language-server surfaces. Translated from
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
        [reset] Torra a cumintzare
       *[update] Atualiza
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } su visualizadore
       *[other] { $word } su visualizadore { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Filtru…
editor-variant-next = Sèbera sa variante sighente
editor-variant-previous = Sèbera sa variante pretzedente


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] S'est agatada una violatzione de s'atzessibilidade segundu WCAG AA. Crica pro { $action ->
            [close] serrare
           *[open] abèrrere
        } su rapportu de atzessibilidade.
        [advisories] Crica pro { $action ->
            [close] serrare
           *[open] abèrrere
        } su rapportu de atzessibilidade. No s'est agatada peruna violatzione WCAG AA, ma b'at àteras racumandatziones de atzessibilidade.
       *[clean] Crica pro { $action ->
            [close] serrare
           *[open] abèrrere
        } su rapportu de atzessibilidade. No s'est agatadu perunu problema de atzessibilidade.
    }

editor-accessibility-label =
    { $status ->
        [violations] S'est agatada una violatzione de s'atzessibilidade segundu WCAG AA. S'sunt agatadas { $count ->
            [one] { $count } violatzione WCAG AA
           *[other] { $count } violatziones WCAG AA
        }. Crica pro { $action ->
            [close] serrare
           *[open] abèrrere
        } su rapportu de atzessibilidade.
        [advisories] No s'est agatada peruna violatzione WCAG AA. S'sunt agatadas { $count ->
            [one] { $count } racumandatzione de atzessibilidade in prus
           *[other] { $count } racumandatziones de atzessibilidade in prus
        }. Crica pro { $action ->
            [close] serrare
           *[open] abèrrere
        } su rapportu de atzessibilidade.
       *[clean] No s'est agatada peruna violatzione WCAG AA. Crica pro { $action ->
            [close] serrare
           *[open] abèrrere
        } su rapportu de atzessibilidade.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versione { $version } de DoenetML

editor-tab-help = Agiudu segundu su cuntestu
editor-tab-help-short = Cuntestu
editor-tab-errors = Errores
editor-tab-warnings = Avisos
editor-tab-info = Informatziones
editor-tab-accessibility = Atzessibilidade
editor-tab-responses = Rispostas imbiadas

editor-tab-with-count = { $label }: { $count }

editor-options = Optziones de s'editore
editor-format-as-doenetml = Formata comente DoenetML
editor-format-as-xml = Formata comente XML


## The diagnostics panel

editor-diagnostic-line = Lìnia n. { $line }

editor-no-errors = Perunu errore
editor-no-warnings = Perunu avisu
editor-no-info = Perunu messàgiu informativu

editor-show-info-annotations = Ammustra sos messàgios informativos in s'editore
editor-show-accessibility-annotations = Ammustra sos messàgios de atzessibilidade in s'editore

editor-accessibility-learn-more = Comente Doenet afrontat s'atzessibilidade

editor-accessibility-violations-heading = Violatziones de atzessibilidade ({ $standard })

editor-accessibility-other-heading = Àteros problemas de atzessibilidade
editor-none-found = No s'est agatadu nudda


## Submitted responses

editor-no-responses = Ancora peruna risposta imbiada
editor-response-answer-id = Id de sa risposta
editor-response-response = Risposta
editor-response-credit = Puntos
editor-response-submitted = Imbiada


## The context-help panel

help-placeholder = Pone su cursore in unu nùmene de eticheta, unu atributu o { $ref } pro sa documentatzione.

help-unsupported-ref-chain = S'agiudu pro riferimentos de prus partes comente { $example } no est ancora suportadu.

help-unresolved-ref =
    { $reason ->
        [notFound] No s'est agatadu perunu referente pro su riferimentu: { $ref }.
        [multiple] S'sunt agatados prus referentes pro su riferimentu: { $ref }.
       *[indeterminate] No s'est pòdidu determinare unu referente pro { $ref }.
    }

help-learn-about-references = Àpere de prus subra sos riferimentos →
help-reference-page = Pàgina de riferimentu →

help-suggestions-header =
    { $location ->
        [inside] Intro de { $element }
       *[top] In su livellu prus artu
    }{ $allowed ->
        [none] { " — inoghe non bi andat nudda." }
        [text] { " — iscrie testu inoghe." }
        [text-and-components] { " — iscrie testu inoghe, o proa:" }
       *[components] { " — proa:" }
    }

help-suggestions-footer = Crica { $shortcut } pro bìdere totu sos { $total } cumponentes.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } est unu riferimentu a { $target }.
       *[other] { $ref } est unu riferimentu a { $target } (lìnia { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introduidu dae { $owner } comente { $role }.
       *[other] Introduidu dae { $owner } in sa lìnia { $line } comente { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } est unu riferimentu a sa propiedade { $property } de { $element }.
       *[other] { $ref } est unu riferimentu a sa propiedade { $property } de { $element } (lìnia { $line }).
    }

help-kind-attribute = atributu
help-kind-snippet = frammentu
help-kind-array-entry = elementu de matritze

help-default = Valore predefinidu:
help-active-default = Valore predefinidu ativu:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valores permìtidos (unu pro elementu):
       *[other] Valores permìtidos:
    }

help-suggested-values = Valores cussigiados:

help-inserts = Inserit:

help-coordinates =
    { $count ->
        [one] Coordinada:
       *[other] Coordinadas:
    }

help-type = Tipu:

help-resolved-style = Istile risoltu (styleNumber { $styleNumber }):

help-resolved-function-names = Nùmenes de funtzione risoltos:
help-reset-list = Lista de reset in custu campu:
help-added-on-input = Annantu in custu campu:
help-removed-on-input = Bogadu in custu campu:

help-reset-overrides = { $reset } balet prus de { $additional } e { $removed }.
