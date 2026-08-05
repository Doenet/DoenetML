# Haitian Creole editor and language-server surfaces. Translated from
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
# The counted branches below are kept even where the two categories render the
# same words, because the surrounding sentence differs between them in English
# and a corrector may well want it to differ here too. Where only the noun would
# have varied, the select is dropped and a comment says so.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reinisyalize
       *[update] Mete ajou
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } vizyonè a
       *[other] { $word } vizyonè a { $shortcut }
    }


## The variant picker

editor-variant = Varyant
editor-variant-filter = Filtre…
editor-variant-next = Chwazi varyant ki vin apre
editor-variant-previous = Chwazi varyant ki vin anvan


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Yo jwenn yon vyolasyon aksesibilite WCAG AA. Klike pou { $action ->
            [close] fèmen
           *[open] ouvri
        } rapò aksesibilite a.
        [advisories] Klike pou { $action ->
            [close] fèmen
           *[open] ouvri
        } rapò aksesibilite a. Yo pa jwenn okenn vyolasyon WCAG AA, men gen lòt rekòmandasyon aksesibilite ki disponib.
       *[clean] Klike pou { $action ->
            [close] fèmen
           *[open] ouvri
        } rapò aksesibilite a. Yo pa jwenn okenn pwoblèm aksesibilite.
    }

# No select on `$count` inside the branches: «vyolasyon» and «rekòmandasyon» are
# the same words for one and for many, so the two categories would render the
# same string. The count still arrives and is still formatted.
editor-accessibility-label =
    { $status ->
        [violations] Yo jwenn yon vyolasyon aksesibilite WCAG AA. Yo jwenn { $count } vyolasyon WCAG AA. Klike pou { $action ->
            [close] fèmen
           *[open] ouvri
        } rapò aksesibilite a.
        [advisories] Yo pa jwenn okenn vyolasyon WCAG AA. Yo jwenn { $count } lòt rekòmandasyon aksesibilite. Klike pou { $action ->
            [close] fèmen
           *[open] ouvri
        } rapò aksesibilite a.
       *[clean] Yo pa jwenn okenn vyolasyon WCAG AA. Klike pou { $action ->
            [close] fèmen
           *[open] ouvri
        } rapò aksesibilite a.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Vèsyon DoenetML { $version }

editor-tab-help = Èd ki depann de kontèks
editor-tab-help-short = Kontèks
editor-tab-errors = Erè
editor-tab-warnings = Avètisman
editor-tab-info = Enfo
editor-tab-accessibility = Aksesibilite
editor-tab-responses = Repons ki voye

editor-tab-with-count = { $label }: { $count }

editor-options = Opsyon editè a
editor-format-as-doenetml = Fòmate kòm DoenetML
editor-format-as-xml = Fòmate kòm XML


## The diagnostics panel

editor-diagnostic-line = Liy #{ $line }

editor-no-errors = Pa gen erè
editor-no-warnings = Pa gen avètisman
editor-no-info = Pa gen dyagnostik enfòmatif

editor-show-info-annotations = Montre dyagnostik enfòmatif nan editè a
editor-show-accessibility-annotations = Montre dyagnostik aksesibilite nan editè a

editor-accessibility-learn-more = Aprann kijan Doenet apwoche aksesibilite

editor-accessibility-violations-heading = Vyolasyon aksesibilite ({ $standard })

editor-accessibility-other-heading = Lòt pwoblèm aksesibilite
editor-none-found = Yo pa jwenn anyen


## Submitted responses

editor-no-responses = Poko gen repons ki voye
editor-response-answer-id = Idantifyan repons
editor-response-response = Repons
editor-response-credit = Kredi
editor-response-submitted = Voye


## The context-help panel

help-placeholder = Mete kisò a sou yon non tag, yon atribi, oswa { $ref } pou dokimantasyon.

help-unsupported-ref-chain = Èd pou referans an plizyè pati tankou { $example } poko sipòte.

help-unresolved-ref =
    { $reason ->
        [notFound] Yo pa jwenn okenn referan pou referans lan: { $ref }.
        [multiple] Yo jwenn plizyè referan pou referans lan: { $ref }.
       *[indeterminate] Yo pa t kapab detèmine yon referan pou { $ref }.
    }

help-learn-about-references = Aprann sou referans →
help-reference-page = Paj referans →

help-suggestions-header =
    { $location ->
        [inside] Anndan { $element }
       *[top] Nan nivo ki pi wo a
    }{ $allowed ->
        [none] { " — anyen pa antre isit la." }
        [text] { " — tape tèks isit la." }
        [text-and-components] { " — tape tèks isit la, oswa eseye:" }
       *[components] { " — bagay pou eseye:" }
    }

help-suggestions-footer = Peze { $shortcut } pou wè tout { $total } konpozan yo.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } se yon referans a { $target }.
       *[other] { $ref } se yon referans a { $target } (liy { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Entwodwi pa { $owner } kòm { $role }.
       *[other] Entwodwi pa { $owner } nan liy { $line } kòm { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } se yon referans a pwopriyete { $property } konpozan { $element }.
       *[other] { $ref } se yon referans a pwopriyete { $property } konpozan { $element } (liy { $line }).
    }

help-kind-attribute = atribi
help-kind-snippet = tibout kòd
help-kind-array-entry = antre tablo

help-default = Valè pa defo:
help-active-default = Valè pa defo aktif:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valè ki pèmèt (youn pa atik):
       *[other] Valè ki pèmèt:
    }

help-suggested-values = Valè ki sijere:

help-inserts = Mete:

# No select: «kòdone» is the same word for one and for many, so both categories
# would render the same string.
help-coordinates = Kòdone:

help-type = Tip:

help-resolved-style = Stil ki rezoud (styleNumber { $styleNumber }):

help-resolved-function-names = Non fonksyon ki rezoud:
help-reset-list = Lis reinisyalizasyon sou antre sa a:
help-added-on-input = Ajoute sou antre sa a:
help-removed-on-input = Retire sou antre sa a:

help-reset-overrides = { $reset } pran plas { $additional } ak { $removed }.
