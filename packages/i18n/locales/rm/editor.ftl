# Romansh editor and language-server surfaces. Translated from
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
        [reset] Reinizialisar
       *[update] Actualisar
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } il visualisatur
       *[other] { $word } il visualisatur { $shortcut }
    }


## The variant picker

editor-variant = Varianta
editor-variant-filter = Filter…
editor-variant-next = Tscherner la proxima varianta
editor-variant-previous = Tscherner la varianta precedenta


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ina violaziun da l'accessibladad tenor WCAG AA è vegnida identifitgada. Cliccai per { $action ->
            [close] serrar
           *[open] avrir
        } il rapport d'accessibladad.
        [advisories] Cliccai per { $action ->
            [close] serrar
           *[open] avrir
        } il rapport d'accessibladad. Naginas violaziuns WCAG AA n'èn vegnidas chattadas, ma i dat ulteriuras recumandaziuns d'accessibladad.
       *[clean] Cliccai per { $action ->
            [close] serrar
           *[open] avrir
        } il rapport d'accessibladad. Nagins problems d'accessibladad n'èn vegnids chattads.
    }

editor-accessibility-label =
    { $status ->
        [violations] Ina violaziun da l'accessibladad tenor WCAG AA è vegnida identifitgada. { $count ->
            [one] È vegnida chattada { $count } violaziun WCAG AA
           *[other] Èn vegnidas chattadas { $count } violaziuns WCAG AA
        }. Cliccai per { $action ->
            [close] serrar
           *[open] avrir
        } il rapport d'accessibladad.
        [advisories] Naginas violaziuns WCAG AA n'èn vegnidas identifitgadas. { $count ->
            [one] È vegnida chattada { $count } ulteriura recumandaziun d'accessibladad
           *[other] Èn vegnidas chattadas { $count } ulteriuras recumandaziuns d'accessibladad
        }. Cliccai per { $action ->
            [close] serrar
           *[open] avrir
        } il rapport d'accessibladad.
       *[clean] Naginas violaziuns WCAG AA n'èn vegnidas identifitgadas. Cliccai per { $action ->
            [close] serrar
           *[open] avrir
        } il rapport d'accessibladad.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versiun { $version } da DoenetML

editor-tab-help = Agid tenor il context
editor-tab-help-short = Context
editor-tab-errors = Errurs
editor-tab-warnings = Avertiments
editor-tab-info = Infurmaziuns
editor-tab-accessibility = Accessibladad
editor-tab-responses = Respostas tramessas

editor-tab-with-count = { $label }: { $count }

editor-options = Opziuns da l'editur
editor-format-as-doenetml = Formatar sco DoenetML
editor-format-as-xml = Formatar sco XML


## The diagnostics panel

editor-diagnostic-line = Lingia nr. { $line }

editor-no-errors = Naginas errurs
editor-no-warnings = Nagins avertiments
editor-no-info = Nagins messadis infurmativs

editor-show-info-annotations = Mussar ils messadis infurmativs en l'editur
editor-show-accessibility-annotations = Mussar ils messadis d'accessibladad en l'editur

editor-accessibility-learn-more = Co che Doenet tracta l'accessibladad

editor-accessibility-violations-heading = Violaziuns d'accessibladad ({ $standard })

editor-accessibility-other-heading = Auters problems d'accessibladad
editor-none-found = Nagut chattà


## Submitted responses

editor-no-responses = Anc naginas respostas tramessas
editor-response-answer-id = Id da la resposta
editor-response-response = Resposta
editor-response-credit = Puncts
editor-response-submitted = Tramessa


## The context-help panel

help-placeholder = Mettai il cursur sin in num da tag, in attribut u { $ref } per la documentaziun.

help-unsupported-ref-chain = L'agid per referenzas da pliras parts sco { $example } n'è anc betg sustegnì.

help-unresolved-ref =
    { $reason ->
        [notFound] Nagin referent chattà per la referenza: { $ref }.
        [multiple] Plirs referents chattads per la referenza: { $ref }.
       *[indeterminate] In referent per { $ref } n'ha betg pudì vegnir determinà.
    }

help-learn-about-references = Emprender dapli davart las referenzas →
help-reference-page = Pagina da referenza →

help-suggestions-header =
    { $location ->
        [inside] Entaifer { $element }
       *[top] Sin il nivel il pli aut
    }{ $allowed ->
        [none] { " — qua na va nagut." }
        [text] { " — scrivai qua text." }
        [text-and-components] { " — scrivai qua text, u empruvai:" }
       *[components] { " — empruvai:" }
    }

help-suggestions-footer = Smaccai { $shortcut } per vesair tut ils { $total } components.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } è ina referenza a { $target }.
       *[other] { $ref } è ina referenza a { $target } (lingia { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introducì da { $owner } sco { $role }.
       *[other] Introducì da { $owner } en la lingia { $line } sco { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } è ina referenza a la caracteristica { $property } da { $element }.
       *[other] { $ref } è ina referenza a la caracteristica { $property } da { $element } (lingia { $line }).
    }

help-kind-attribute = attribut
help-kind-snippet = fragment
help-kind-array-entry = element d'ina glista

help-default = Valur predefinida:
help-active-default = Valur predefinida activa:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valurs permessas (ina per element):
       *[other] Valurs permessas:
    }

help-suggested-values = Valurs propostas:

help-inserts = Inserescha:

help-coordinates =
    { $count ->
        [one] Coordinata:
       *[other] Coordinatas:
    }

help-type = Tip:

help-resolved-style = Stil resolvì (styleNumber { $styleNumber }):

help-resolved-function-names = Nums da funcziun resolvids:
help-reset-list = Glista da reinizialisaziun sin quest champ:
help-added-on-input = Agiuntà sin quest champ:
help-removed-on-input = Allontanà sin quest champ:

help-reset-overrides = { $reset } va avant { $additional } ed { $removed }.
