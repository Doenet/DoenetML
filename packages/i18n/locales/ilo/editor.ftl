# Ilocano editor and language-server surfaces. Translated from
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
# Ilocano marks no number on the noun, so a `{ $count -> … }` whose two English
# branches differ only in the noun renders one string here and the select is
# dropped. Where the surrounding sentence differs, the select stays.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Isubli
       *[update] Pabaruen
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } ti pagbuyaan
       *[other] { $word } ti pagbuyaan { $shortcut }
    }


## The variant picker

editor-variant = Baryante
editor-variant-filter = Sagaten…
editor-variant-next = Pilien ti sumaruno a baryante
editor-variant-previous = Pilien ti napalabas a baryante


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Adda nasarakan a panaglabsing iti aksesibilidad a WCAG AA. Pinduten tapno { $action ->
            [close] mairikep
           *[open] maluktan
        } ti report ti aksesibilidad.
        [advisories] Pinduten tapno { $action ->
            [close] mairikep
           *[open] maluktan
        } ti report ti aksesibilidad. Awan ti nasarakan a panaglabsing iti WCAG AA, ngem adda pay dadduma a rekomendasion iti aksesibilidad.
       *[clean] Pinduten tapno { $action ->
            [close] mairikep
           *[open] maluktan
        } ti report ti aksesibilidad. Awan ti nasarakan a parikut iti aksesibilidad.
    }

# No select on `$count` inside the branches: «panaglabsing» and
# «rekomendasion» are the same words for one and for many, so both categories
# would render the same string. The count still arrives and is still formatted.
editor-accessibility-label =
    { $status ->
        [violations] Adda nasarakan a panaglabsing iti aksesibilidad a WCAG AA. { $count } a panaglabsing iti WCAG AA ti nasarakan. Pinduten tapno { $action ->
            [close] mairikep
           *[open] maluktan
        } ti report ti aksesibilidad.
        [advisories] Awan ti nasarakan a panaglabsing iti WCAG AA. { $count } a dadduma pay a rekomendasion iti aksesibilidad ti nasarakan. Pinduten tapno { $action ->
            [close] mairikep
           *[open] maluktan
        } ti report ti aksesibilidad.
       *[clean] Awan ti nasarakan a panaglabsing iti WCAG AA. Pinduten tapno { $action ->
            [close] mairikep
           *[open] maluktan
        } ti report ti aksesibilidad.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Bersion ti DoenetML { $version }

editor-tab-help = Tulong a maibatay iti konteksto
editor-tab-help-short = Konteksto
editor-tab-errors = Biddut
editor-tab-warnings = Ballaag
editor-tab-info = Impormasion
editor-tab-accessibility = Aksesibilidad
editor-tab-responses = Naipatulod a sungbat

editor-tab-with-count = { $label }: { $count }

editor-options = Opsion ti editor
editor-format-as-doenetml = Iporma a kas DoenetML
editor-format-as-xml = Iporma a kas XML


## The diagnostics panel

editor-diagnostic-line = Linia #{ $line }

editor-no-errors = Awan ti biddut
editor-no-warnings = Awan ti ballaag
editor-no-info = Awan ti diagnostiko nga impormasion

editor-show-info-annotations = Ipakita dagiti diagnostiko nga impormasion iti editor
editor-show-accessibility-annotations = Ipakita dagiti diagnostiko ti aksesibilidad iti editor

editor-accessibility-learn-more = Ammuen no kasano ti panangtaming ti Doenet iti aksesibilidad

editor-accessibility-violations-heading = Panaglabsing iti aksesibilidad ({ $standard })

editor-accessibility-other-heading = Dadduma pay a parikut iti aksesibilidad
editor-none-found = Awan ti nasarakan


## Submitted responses

editor-no-responses = Awan pay ti naipatulod a sungbat
editor-response-answer-id = Id ti sungbat
editor-response-response = Sungbat
editor-response-credit = Kredito
editor-response-submitted = Naipatulod


## The context-help panel

help-placeholder = Ikabil ti kursor iti nagan ti tag, atributo, wenno { $ref } para iti dokumentasion.

help-unsupported-ref-chain = Saan pay a suportado ti tulong para kadagiti nadumaduma a paset a reperensia a kas ti { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Awan ti nasarakan a tuktukoyen ti reperensia: { $ref }.
        [multiple] Adu ti nasarakan a tuktukoyen ti reperensia: { $ref }.
       *[indeterminate] Saan a nadeterminaran ti tuktukoyen ti { $ref }.
    }

help-learn-about-references = Ammuen ti maipapan kadagiti reperensia →
help-reference-page = Panid a reperensia →

help-suggestions-header =
    { $location ->
        [inside] Iti uneg ti { $element }
       *[top] Iti kangatuan a tukad
    }{ $allowed ->
        [none] { " — awan ti mabalin nga ikabil ditoy." }
        [text] { " — agsurat iti teksto ditoy." }
        [text-and-components] { " — agsurat iti teksto ditoy, wenno padasen:" }
       *[components] { " — mabalin a padasen:" }
    }

help-suggestions-footer = Pinduten ti { $shortcut } tapno makita ti amin a { $total } a komponente.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Ti { $ref } ket reperensia iti { $target }.
       *[other] Ti { $ref } ket reperensia iti { $target } (linia { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Inyeg ti { $owner } a kas { $role }.
       *[other] Inyeg ti { $owner } iti linia { $line } a kas { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Ti { $ref } ket reperensia iti pagilasinan a { $property } ti { $element }.
       *[other] Ti { $ref } ket reperensia iti pagilasinan a { $property } ti { $element } (linia { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = bassit a kodigo
help-kind-array-entry = pagserkan iti array

help-default = Kasisigud:
help-active-default = Aktibo a kasisigud:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mapalubosan a pateg (maysa iti tunggal banag):
       *[other] Mapalubosan a pateg:
    }

help-suggested-values = Naisingasing a pateg:

help-inserts = Mangiserrek iti:

# No select: «koordinado» is the same word for one and for many, so both
# categories would render the same string.
help-coordinates = Koordinado:

help-type = Kita:

help-resolved-style = Narisut nga estilo (styleNumber { $styleNumber }):

help-resolved-function-names = Narisut a nagan ti punsion:
help-reset-list = Listaan ti pannakaisubli iti daytoy nga input:
help-added-on-input = Nainayon iti daytoy nga input:
help-removed-on-input = Naikkat iti daytoy nga input:

help-reset-overrides = Ti { $reset } ti mangsukat iti { $additional } ken { $removed }.
