# Võro editor and language-server surfaces. Translated from
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
# Võro is a written standard of its own and not an Estonian spelling; see
# `chrome.ftl` for the three places that shows. The `q` is here in every plural
# imperative the editor's buttons use — «Vajotagõq», «Näütäq» — and «sys», the
# one word in these catalogs that carries the letter `y`, is in `chrome.ftl`.
#
# Võro counts in the same two categories English and Estonian do, `one` and
# `other`, so every selection below keeps both branches.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Säädäq tagasi
       *[update] Vahtsõndaq
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } näütäjät
       *[other] { $word } näütäjät { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtri…
editor-variant-next = Valiq perämine variant
editor-variant-previous = Valiq endine variant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Löüti WCAG AA ligipääsemise rikminõ. Klõpsakõq, et ligipääsemise aruannõt { $action ->
            [close] kinniq pandaq
           *[open] vallalõ tetäq
        }.
        [advisories] Klõpsakõq, et ligipääsemise aruannõt { $action ->
            [close] kinniq pandaq
           *[open] vallalõ tetäq
        }. WCAG AA rikmisi es lövvätäq, a ommaq viil ligipääsemise soovitusõq.
       *[clean] Klõpsakõq, et ligipääsemise aruannõt { $action ->
            [close] kinniq pandaq
           *[open] vallalõ tetäq
        }. Ligipääsemise hätti es lövvätäq.
    }

editor-accessibility-label =
    { $status ->
        [violations] Löüti WCAG AA ligipääsemise rikminõ. Löüti { $count ->
            [one] { $count } WCAG AA rikminõ
           *[other] { $count } WCAG AA rikmist
        }. Klõpsakõq, et ligipääsemise aruannõt { $action ->
            [close] kinniq pandaq
           *[open] vallalõ tetäq
        }.
        [advisories] WCAG AA rikmisi es lövvätäq. Löüti { $count ->
            [one] { $count } lisasoovitus ligipääsemise kotsilõ
           *[other] { $count } lisasoovitust ligipääsemise kotsilõ
        }. Klõpsakõq, et ligipääsemise aruannõt { $action ->
            [close] kinniq pandaq
           *[open] vallalõ tetäq
        }.
       *[clean] WCAG AA rikmisi es lövvätäq. Klõpsakõq, et ligipääsemise aruannõt { $action ->
            [close] kinniq pandaq
           *[open] vallalõ tetäq
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-i versioon { $version }

editor-tab-help = Kontekstiabi
editor-tab-help-short = Kontekst
editor-tab-errors = Viaq
editor-tab-warnings = Hoiatusõq
editor-tab-info = Teedüs
editor-tab-accessibility = Ligipääsemine
editor-tab-responses = Ärqsaadõduq vastusõq

editor-tab-with-count = { $label }: { $count }

editor-options = Toimõndaja säädmiseq
editor-format-as-doenetml = Vormindaq DoenetML-is
editor-format-as-xml = Vormindaq XML-is


## The diagnostics panel

editor-diagnostic-line = Rida nr { $line }

editor-no-errors = Vikõ ei olõ
editor-no-warnings = Hoiatuisi ei olõ
editor-no-info = Teedüsteatit ei olõ

editor-show-info-annotations = Näütäq teedüsteatit toimõndajan
editor-show-accessibility-annotations = Näütäq ligipääsemise teatit toimõndajan

editor-accessibility-learn-more = Kuis Doenet ligipääsemises tegutsõs

editor-accessibility-violations-heading = Ligipääsemise rikmiseq ({ $standard })

editor-accessibility-other-heading = Muuq ligipääsemise hädäq
editor-none-found = Midägi es lövvätäq


## Submitted responses

editor-no-responses = Ärqsaadõtuid vastussit viil ei olõ
editor-response-answer-id = Vastussõ Id
editor-response-response = Vastus
editor-response-credit = Punktiq
editor-response-submitted = Ärq saadõt


## The context-help panel

help-placeholder = Viigeq kursor sildi nime, atribuudi vai { $ref } pääle, et nätäq dokumentatsiooni.

help-unsupported-ref-chain = Api mitmõosalidsi viidete, nigu { $example }, kotsilõ ei olõ viil toetõt.

help-unresolved-ref =
    { $reason ->
        [notFound] Viitele es lövvätäq objekti: { $ref }.
        [multiple] Viitele löüti mitu objekti: { $ref }.
       *[indeterminate] Objekti viitele { $ref } es saaq määrädäq.
    }

help-learn-about-references = Inämb teedüst viidete kotsilõ →
help-reference-page = Käsiraamadu lehekülg →

help-suggestions-header =
    { $location ->
        [inside] { $element } seen
       *[top] Kõgõ pääl
    }{ $allowed ->
        [none] { " — siiä ei passiq midägi." }
        [text] { " — siiä saa kirotaq teksti." }
        [text-and-components] { " — siiä saa kirotaq teksti vai pruuvkõq:" }
       *[components] { " — vai pruuvi:" }
    }

help-suggestions-footer = Vajotagõq { $shortcut }, et nätäq kõiki { $total } komponenti.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } om viideq objektile { $target }.
       *[other] { $ref } om viideq objektile { $target } (rida { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Tõi seen { $owner } rollin { $role }.
       *[other] Tõi seen { $owner } reäl { $line } rollin { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } om viideq elemendi { $element } umadusõlõ { $property }.
       *[other] { $ref } om viideq elemendi { $element } umadusõlõ { $property } (rida { $line }).
    }

help-kind-attribute = atribuut
help-kind-snippet = katkõq
help-kind-array-entry = massiivi liigõq

help-default = Vaikimisi väärtüs:
help-active-default = Kehtiv vaikimisi väärtüs:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Lubaduq väärtüseq (üts liikme kottalõ):
       *[other] Lubaduq väärtüseq:
    }

help-suggested-values = Soovitõduq väärtüseq:

help-inserts = Lisas:

help-coordinates =
    { $count ->
        [one] Kuurdinaat:
       *[other] Kuurdinaadiq:
    }

help-type = Tüüp:

help-resolved-style = Saad stiil (styleNumber { $styleNumber }):

help-resolved-function-names = Saaduq funktsiooninimeq:
help-reset-list = Seo välä tagasisäädmise nimekiri:
help-added-on-input = Seon välän lisät:
help-removed-on-input = Seost väläst ärq võet:

help-reset-overrides = { $reset } om ülemb ku { $additional } ja { $removed }.
