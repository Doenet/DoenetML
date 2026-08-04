# Estonian editor and language-server surfaces. Translated from
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
# Estonian counts in the same two categories English does, so every selection
# below keeps both branches.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Lähtesta
       *[update] Uuenda
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } vaaturit
       *[other] { $word } vaaturit { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filter…
editor-variant-next = Vali järgmine variant
editor-variant-previous = Vali eelmine variant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Tuvastati WCAG AA ligipääsetavuse rikkumine. Klõpsake, et ligipääsetavuse aruannet { $action ->
            [close] sulgeda
           *[open] avada
        }.
        [advisories] Klõpsake, et ligipääsetavuse aruannet { $action ->
            [close] sulgeda
           *[open] avada
        }. WCAG AA rikkumisi ei leitud, kuid on täiendavaid ligipääsetavuse soovitusi.
       *[clean] Klõpsake, et ligipääsetavuse aruannet { $action ->
            [close] sulgeda
           *[open] avada
        }. Ligipääsetavuse probleeme ei leitud.
    }

editor-accessibility-label =
    { $status ->
        [violations] Tuvastati WCAG AA ligipääsetavuse rikkumine. Leiti { $count ->
            [one] { $count } WCAG AA rikkumine
           *[other] { $count } WCAG AA rikkumist
        }. Klõpsake, et ligipääsetavuse aruannet { $action ->
            [close] sulgeda
           *[open] avada
        }.
        [advisories] WCAG AA rikkumisi ei tuvastatud. Leiti { $count ->
            [one] { $count } täiendav ligipääsetavuse soovitus
           *[other] { $count } täiendavat ligipääsetavuse soovitust
        }. Klõpsake, et ligipääsetavuse aruannet { $action ->
            [close] sulgeda
           *[open] avada
        }.
       *[clean] WCAG AA rikkumisi ei tuvastatud. Klõpsake, et ligipääsetavuse aruannet { $action ->
            [close] sulgeda
           *[open] avada
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versioon { $version }

editor-tab-help = Kontekstiabi
editor-tab-help-short = Kontekst
editor-tab-errors = Vead
editor-tab-warnings = Hoiatused
editor-tab-info = Teave
editor-tab-accessibility = Ligipääsetavus
editor-tab-responses = Saadetud vastused

editor-tab-with-count = { $label }: { $count }

editor-options = Redaktori sätted
editor-format-as-doenetml = Vorminda DoenetML'ina
editor-format-as-xml = Vorminda XML'ina


## The diagnostics panel

editor-diagnostic-line = Rida nr { $line }

editor-no-errors = Vigu pole
editor-no-warnings = Hoiatusi pole
editor-no-info = Teabeteateid pole

editor-show-info-annotations = Näita teabeteateid redaktoris
editor-show-accessibility-annotations = Näita ligipääsetavuse teateid redaktoris

editor-accessibility-learn-more = Kuidas Doenet ligipääsetavusele läheneb

editor-accessibility-violations-heading = Ligipääsetavuse rikkumised ({ $standard })

editor-accessibility-other-heading = Muud ligipääsetavuse probleemid
editor-none-found = Midagi ei leitud


## Submitted responses

editor-no-responses = Saadetud vastuseid veel pole
editor-response-answer-id = Vastuse Id
editor-response-response = Vastus
editor-response-credit = Punktid
editor-response-submitted = Saadetud


## The context-help panel

help-placeholder = Viige kursor sildi nime, atribuudi või { $ref } peale, et näha dokumentatsiooni.

help-unsupported-ref-chain = Abi mitmeosaliste viidete, nagu { $example }, kohta ei ole veel toetatud.

help-unresolved-ref =
    { $reason ->
        [notFound] Viitele ei leitud objekti: { $ref }.
        [multiple] Viitele leiti mitu objekti: { $ref }.
       *[indeterminate] Objekti viitele { $ref } ei õnnestunud määrata.
    }

help-learn-about-references = Lisateave viidete kohta →
help-reference-page = Käsiraamatu lehekülg →

help-suggestions-header =
    { $location ->
        [inside] { $element } sees
       *[top] Ülemisel tasemel
    }{ $allowed ->
        [none] { " — siia ei sobi midagi." }
        [text] { " — siia saab kirjutada teksti." }
        [text-and-components] { " — siia saab kirjutada teksti või proovida:" }
       *[components] { " — võib proovida:" }
    }

help-suggestions-footer = Vajutage { $shortcut }, et näha kõiki { $total } komponenti.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } on viide objektile { $target }.
       *[other] { $ref } on viide objektile { $target } (rida { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Tõi sisse { $owner } rollis { $role }.
       *[other] Tõi sisse { $owner } real { $line } rollis { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } on viide elemendi { $element } omadusele { $property }.
       *[other] { $ref } on viide elemendi { $element } omadusele { $property } (rida { $line }).
    }

help-kind-attribute = atribuut
help-kind-snippet = katkend
help-kind-array-entry = massiivi liige

help-default = Vaikeväärtus:
help-active-default = Kehtiv vaikeväärtus:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Lubatud väärtused (üks liikme kohta):
       *[other] Lubatud väärtused:
    }

help-suggested-values = Soovitatavad väärtused:

help-inserts = Lisab:

help-coordinates =
    { $count ->
        [one] Koordinaat:
       *[other] Koordinaadid:
    }

help-type = Tüüp:

help-resolved-style = Saadud stiil (styleNumber { $styleNumber }):

help-resolved-function-names = Saadud funktsiooninimed:
help-reset-list = Selle välja lähtestusloend:
help-added-on-input = Sellel väljal lisatud:
help-removed-on-input = Sellelt väljalt eemaldatud:

help-reset-overrides = { $reset } on ülimuslik { $additional } ja { $removed } suhtes.
