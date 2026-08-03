# Afrikaans editor and language-server surfaces. Translated from
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
        [reset] Herstel
       *[update] Werk By
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Kyker
       *[other] { $word } Kyker { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filter...
editor-variant-next = Kies volgende variant
editor-variant-previous = Kies vorige variant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA-toeganklikheidsoortreding geïdentifiseer. Klik om die toeganklikheidsverslag { $action ->
            [close] toe te maak
           *[open] oop te maak
        }.
        [advisories] Klik om die toeganklikheidsverslag { $action ->
            [close] toe te maak
           *[open] oop te maak
        }. Geen WCAG AA-oortredings is gevind nie, maar daar is bykomende toeganklikheidsaanbevelings.
       *[clean] Klik om die toeganklikheidsverslag { $action ->
            [close] toe te maak
           *[open] oop te maak
        }. Geen toeganklikheidsprobleme is gevind nie.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA-toeganklikheidsoortreding geïdentifiseer. { $count ->
            [one] { $count } WCAG AA-oortreding gevind
           *[other] { $count } WCAG AA-oortredings gevind
        }. Klik om die toeganklikheidsverslag { $action ->
            [close] toe te maak
           *[open] oop te maak
        }.
        [advisories] Geen WCAG AA-oortredings geïdentifiseer nie. { $count ->
            [one] { $count } bykomende toeganklikheidsaanbeveling gevind
           *[other] { $count } bykomende toeganklikheidsaanbevelings gevind
        }. Klik om die toeganklikheidsverslag { $action ->
            [close] toe te maak
           *[open] oop te maak
        }.
       *[clean] Geen WCAG AA-oortredings geïdentifiseer nie. Klik om die toeganklikheidsverslag { $action ->
            [close] toe te maak
           *[open] oop te maak
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-weergawe { $version }

editor-tab-help = Konteksgevoelige hulp
editor-tab-help-short = Konteks
editor-tab-errors = Foute
editor-tab-warnings = Waarskuwings
editor-tab-info = Inligting
editor-tab-accessibility = Toeganklikheid
editor-tab-responses = Ingediende antwoorde

editor-tab-with-count = { $label }: { $count }

editor-options = Redigeerderopsies
editor-format-as-doenetml = Formateer as DoenetML
editor-format-as-xml = Formateer as XML


## The diagnostics panel

editor-diagnostic-line = Reël #{ $line }

editor-no-errors = Geen Foute
editor-no-warnings = Geen Waarskuwings
editor-no-info = Geen Inligtingsdiagnostiek

editor-show-info-annotations = Wys inligtingsdiagnostiek in die redigeerder
editor-show-accessibility-annotations = Wys toeganklikheidsdiagnostiek in die redigeerder

editor-accessibility-learn-more = Leer hoe Doenet toeganklikheid benader

editor-accessibility-violations-heading = Toeganklikheidsoortredings ({ $standard })

editor-accessibility-other-heading = Ander toeganklikheidsprobleme
editor-none-found = Niks gevind nie


## Submitted responses

editor-no-responses = Nog geen ingediende antwoorde nie
editor-response-answer-id = Antwoord-id
editor-response-response = Antwoord
editor-response-credit = Krediet
editor-response-submitted = Ingedien


## The context-help panel

help-placeholder = Plaas die wyser op 'n etiketnaam, attribuut of { $ref } vir dokumentasie.

help-unsupported-ref-chain = Hulp vir veeldelige verwysings soos { $example } word nog nie ondersteun nie.

help-unresolved-ref =
    { $reason ->
        [notFound] Geen verwysde gevind vir verwysing: { $ref }.
        [multiple] Meer as een verwysde gevind vir verwysing: { $ref }.
       *[indeterminate] 'n Verwysde vir { $ref } kon nie bepaal word nie.
    }

help-learn-about-references = Leer meer oor verwysings →
help-reference-page = Verwysingsbladsy →

help-suggestions-header =
    { $location ->
        [inside] Binne { $element }
       *[top] Op die boonste vlak
    }{ $allowed ->
        [none] { " — hier gaan niks nie." }
        [text] { " — tik hier teks." }
        [text-and-components] { " — tik hier teks, of probeer:" }
       *[components] { " — dinge om te probeer:" }
    }

help-suggestions-footer = Druk { $shortcut } om al { $total } komponente te sien.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } is 'n verwysing na { $target }.
       *[other] { $ref } is 'n verwysing na { $target } (reël { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ingevoer deur { $owner } as { $role }.
       *[other] Ingevoer deur { $owner } op reël { $line } as { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } is 'n verwysing na die { $property }-eienskap van { $element }.
       *[other] { $ref } is 'n verwysing na die { $property }-eienskap van { $element } (reël { $line }).
    }

help-kind-attribute = attribuut
help-kind-snippet = brokkie
help-kind-array-entry = skikkinginskrywing

help-default = Verstek:
help-active-default = Aktiewe verstek:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Toegelate waardes (een per item):
       *[other] Toegelate waardes:
    }

help-suggested-values = Voorgestelde waardes:

help-inserts = Voeg in:

help-coordinates =
    { $count ->
        [one] Koördinaat:
       *[other] Koördinate:
    }

help-type = Tipe:

help-resolved-style = Opgeloste styl (styleNumber { $styleNumber }):

help-resolved-function-names = Opgeloste funksiename:
help-reset-list = Lys wat op hierdie invoer herstel word:
help-added-on-input = By hierdie invoer bygevoeg:
help-removed-on-input = By hierdie invoer verwyder:

help-reset-overrides = { $reset } oorheers { $additional } en { $removed }.
