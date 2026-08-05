# West Frisian editor and language-server surfaces. Translated from
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
        [reset] Weromsette
       *[update] Bywurkje
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Werjefte { $word }
       *[other] Werjefte { $word } { $shortcut }
    }


## The variant picker

editor-variant = Fariant
editor-variant-filter = Filter…
editor-variant-next = Folgjende fariant kieze
editor-variant-previous = Foarige fariant kieze


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Der is in skeining fan 'e tagonklikens neffens WCAG AA fêststeld. Klik om it rapport oer tagonklikens { $action ->
            [close] ticht te dwaan
           *[open] iepen te dwaan
        }.
        [advisories] Klik om it rapport oer tagonklikens { $action ->
            [close] ticht te dwaan
           *[open] iepen te dwaan
        }. Der binne gjin skeiningen neffens WCAG AA fûn, mar der binne noch oanbefellings oer tagonklikens.
       *[clean] Klik om it rapport oer tagonklikens { $action ->
            [close] ticht te dwaan
           *[open] iepen te dwaan
        }. Der binne gjin problemen mei de tagonklikens fûn.
    }

editor-accessibility-label =
    { $status ->
        [violations] Der is in skeining fan 'e tagonklikens neffens WCAG AA fêststeld. Der binne { $count ->
            [one] { $count } skeining neffens WCAG AA
           *[other] { $count } skeiningen neffens WCAG AA
        } fûn. Klik om it rapport oer tagonklikens { $action ->
            [close] ticht te dwaan
           *[open] iepen te dwaan
        }.
        [advisories] Der binne gjin skeiningen neffens WCAG AA fêststeld. Der binne { $count ->
            [one] { $count } oanfoljende oanbefelling oer tagonklikens
           *[other] { $count } oanfoljende oanbefellings oer tagonklikens
        } fûn. Klik om it rapport oer tagonklikens { $action ->
            [close] ticht te dwaan
           *[open] iepen te dwaan
        }.
       *[clean] Der binne gjin skeiningen neffens WCAG AA fêststeld. Klik om it rapport oer tagonklikens { $action ->
            [close] ticht te dwaan
           *[open] iepen te dwaan
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-ferzje { $version }

editor-tab-help = Kontekstgefoelige help
editor-tab-help-short = Konteks
editor-tab-errors = Flaters
editor-tab-warnings = Warskôgings
editor-tab-info = Ynfo
editor-tab-accessibility = Tagonklikens
editor-tab-responses = Ynstjoerde antwurden

editor-tab-with-count = { $label }: { $count }

editor-options = Ynstellings fan 'e bewurker
editor-format-as-doenetml = As DoenetML opmeitsje
editor-format-as-xml = As XML opmeitsje


## The diagnostics panel

editor-diagnostic-line = Rigel nr. { $line }

editor-no-errors = Gjin flaters
editor-no-warnings = Gjin warskôgings
editor-no-info = Gjin ynfomeldings

editor-show-info-annotations = Ynfomeldings yn 'e bewurker sjen litte
editor-show-accessibility-annotations = Meldings oer tagonklikens yn 'e bewurker sjen litte

editor-accessibility-learn-more = Hoe't Doenet mei tagonklikens omgiet

editor-accessibility-violations-heading = Skeiningen fan 'e tagonklikens ({ $standard })

editor-accessibility-other-heading = Oare problemen mei de tagonklikens
editor-none-found = Neat fûn


## Submitted responses

editor-no-responses = Noch gjin antwurden ynstjoerd
editor-response-answer-id = Id fan it antwurd
editor-response-response = Antwurd
editor-response-credit = Punten
editor-response-submitted = Ynstjoerd


## The context-help panel

help-placeholder = Set de kursor op in tachnamme, in attribút of { $ref } foar dokumintaasje.

help-unsupported-ref-chain = Help foar ferwizings mei mear dielen, lykas { $example }, is der noch net.

help-unresolved-ref =
    { $reason ->
        [notFound] Gjin doel fûn foar de ferwizing: { $ref }.
        [multiple] Mear as ien doel fûn foar de ferwizing: { $ref }.
       *[indeterminate] In doel foar { $ref } koe net bepaald wurde.
    }

help-learn-about-references = Mear witte oer ferwizings →
help-reference-page = Referinsjeside →

help-suggestions-header =
    { $location ->
        [inside] Binnen { $element }
       *[top] Op it heechste nivo
    }{ $allowed ->
        [none] { " — hjir heart neat." }
        [text] { " — typ hjir tekst." }
        [text-and-components] { " — typ hjir tekst, of besykje:" }
       *[components] { " — besykje:" }
    }

help-suggestions-footer = Druk op { $shortcut } om alle { $total } komponinten te sjen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } is in ferwizing nei { $target }.
       *[other] { $ref } is in ferwizing nei { $target } (rigel { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ynfierd troch { $owner } as { $role }.
       *[other] Ynfierd troch { $owner } op rigel { $line } as { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } is in ferwizing nei de eigenskip { $property } fan { $element }.
       *[other] { $ref } is in ferwizing nei de eigenskip { $property } fan { $element } (rigel { $line }).
    }

help-kind-attribute = attribút
help-kind-snippet = tekstblok
help-kind-array-entry = elemint fan in rige

help-default = Standert:
help-active-default = Aktive standert:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Tastiene wearden (ien de elemint):
       *[other] Tastiene wearden:
    }

help-suggested-values = Foarstelde wearden:

help-inserts = Foeget yn:

help-coordinates =
    { $count ->
        [one] Koördinaat:
       *[other] Koördinaten:
    }

help-type = Type:

help-resolved-style = Oplost styl (styleNumber { $styleNumber }):

help-resolved-function-names = Oploste funksjenammen:
help-reset-list = List foar it weromsetten op dit fjild:
help-added-on-input = Op dit fjild tafoege:
help-removed-on-input = Op dit fjild fuortsmiten:

help-reset-overrides = { $reset } giet foar { $additional } en { $removed }.
