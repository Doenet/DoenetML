# Basque editor and language-server surfaces. Translated from
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
# Basque counts in the same two categories English does, so every selection
# below keeps both branches.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Berrezarri
       *[update] Eguneratu
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } ikustailea
       *[other] { $word } ikustailea { $shortcut }
    }


## The variant picker

editor-variant = Aldaera
editor-variant-filter = Iragazi…
editor-variant-next = Hautatu hurrengo aldaera
editor-variant-previous = Hautatu aurreko aldaera


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA irisgarritasun-urraketa bat aurkitu da. Egin klik irisgarritasun-txostena { $action ->
            [close] ixteko
           *[open] irekitzeko
        }.
        [advisories] Egin klik irisgarritasun-txostena { $action ->
            [close] ixteko
           *[open] irekitzeko
        }. Ez da WCAG AA urraketarik aurkitu, baina irisgarritasun-gomendio gehiago daude eskuragarri.
       *[clean] Egin klik irisgarritasun-txostena { $action ->
            [close] ixteko
           *[open] irekitzeko
        }. Ez da irisgarritasun-arazorik aurkitu.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA irisgarritasun-urraketa bat aurkitu da. { $count ->
            [one] WCAG AA urraketa { $count } aurkitu da
           *[other] { $count } WCAG AA urraketa aurkitu dira
        }. Egin klik irisgarritasun-txostena { $action ->
            [close] ixteko
           *[open] irekitzeko
        }.
        [advisories] Ez da WCAG AA urraketarik aurkitu. { $count ->
            [one] irisgarritasun-gomendio gehigarri { $count } aurkitu da
           *[other] { $count } irisgarritasun-gomendio gehigarri aurkitu dira
        }. Egin klik irisgarritasun-txostena { $action ->
            [close] ixteko
           *[open] irekitzeko
        }.
       *[clean] Ez da WCAG AA urraketarik aurkitu. Egin klik irisgarritasun-txostena { $action ->
            [close] ixteko
           *[open] irekitzeko
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML { $version } bertsioa

editor-tab-help = Testuinguruaren araberako laguntza
editor-tab-help-short = Testuingurua
editor-tab-errors = Erroreak
editor-tab-warnings = Abisuak
editor-tab-info = Informazioa
editor-tab-accessibility = Irisgarritasuna
editor-tab-responses = Bidalitako erantzunak

editor-tab-with-count = { $label }: { $count }

editor-options = Editorearen aukerak
editor-format-as-doenetml = Formateatu DoenetML gisa
editor-format-as-xml = Formateatu XML gisa


## The diagnostics panel

editor-diagnostic-line = { $line }. lerroa

editor-no-errors = Errorerik ez
editor-no-warnings = Abisurik ez
editor-no-info = Informazio-diagnostikorik ez

editor-show-info-annotations = Erakutsi informazio-diagnostikoak editorean
editor-show-accessibility-annotations = Erakutsi irisgarritasun-diagnostikoak editorean

editor-accessibility-learn-more = Ikasi nola lantzen duen Doenetek irisgarritasuna

editor-accessibility-violations-heading = Irisgarritasun-urraketak ({ $standard })

editor-accessibility-other-heading = Beste irisgarritasun-arazo batzuk
editor-none-found = Ez da bat ere aurkitu


## Submitted responses

editor-no-responses = Oraindik ez da erantzunik bidali
editor-response-answer-id = Erantzunaren identifikatzailea
editor-response-response = Erantzuna
editor-response-credit = Puntuazioa
editor-response-submitted = Bidalita


## The context-help panel

help-placeholder = Jarri kurtsorea etiketa-izen batean, atributu batean edo { $ref } batean dokumentazioa ikusteko.

help-unsupported-ref-chain = { $example } bezalako erreferentzia konposatuentzako laguntza ez dago oraindik.

help-unresolved-ref =
    { $reason ->
        [notFound] Ez da erreferentearik aurkitu erreferentzia honentzat: { $ref }.
        [multiple] Erreferente bat baino gehiago aurkitu dira erreferentzia honentzat: { $ref }.
       *[indeterminate] Ezin izan da { $ref } erreferentziaren erreferentea zehaztu.
    }

help-learn-about-references = Ikasi erreferentziei buruz →
help-reference-page = Erreferentzia-orria →

help-suggestions-header =
    { $location ->
        [inside] { $element } barruan
       *[top] Goiko mailan
    }{ $allowed ->
        [none] { " — ez dago ezer hemen." }
        [text] { " — idatzi testua hemen." }
        [text-and-components] { " — idatzi testua hemen, edo saiatu:" }
       *[components] { " — probatzeko gauzak:" }
    }

help-suggestions-footer = Sakatu { $shortcut } { $total } osagai guztiak ikusteko.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target } elementuari egindako erreferentzia da.
       *[other] { $ref } { $target } elementuari egindako erreferentzia da ({ $line }. lerroa).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } elementuak sartua { $role } gisa.
       *[other] { $owner } elementuak { $line }. lerroan sartua { $role } gisa.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element } elementuaren { $property } propietateari egindako erreferentzia da.
       *[other] { $ref } { $element } elementuaren { $property } propietateari egindako erreferentzia da ({ $line }. lerroa).
    }

help-kind-attribute = atributua
help-kind-snippet = zatia
help-kind-array-entry = array-sarrera

help-default = Lehenetsia:
help-active-default = Lehenetsi aktiboa:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Onartutako balioak (bat elementu bakoitzeko):
       *[other] Onartutako balioak:
    }

help-suggested-values = Iradokitako balioak:

help-inserts = Txertatzen du:

help-coordinates =
    { $count ->
        [one] Koordenatua:
       *[other] Koordenatuak:
    }

help-type = Mota:

help-resolved-style = Ebatzitako estiloa (styleNumber { $styleNumber }):

help-resolved-function-names = Ebatzitako funtzio-izenak:
help-reset-list = Berrezarri zerrenda sarrera honetan:
help-added-on-input = Sarrera honetan gehitua:
help-removed-on-input = Sarrera honetan kendua:

help-reset-overrides = { $reset } aukerak { $additional } eta { $removed } gainidazten ditu.
