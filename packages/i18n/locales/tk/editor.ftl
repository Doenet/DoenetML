# Turkmen editor and language-server surfaces. Translated from
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
# Turkmen counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Dikelt
       *[update] Täzele
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Görkezijini { $word }
       *[other] Görkezijini { $word } { $shortcut }
    }


## The variant picker

editor-variant = Wariant
editor-variant-filter = Süz…
editor-variant-next = Indiki warianty saýla
editor-variant-previous = Öňki warianty saýla


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA elýeterlilik bozulmasy ýüze çykaryldy. Elýeterlilik hasabatyny { $action ->
            [close] ýapmak
           *[open] açmak
        } üçin basyň.
        [advisories] Elýeterlilik hasabatyny { $action ->
            [close] ýapmak
           *[open] açmak
        } üçin basyň. WCAG AA bozulmalary tapylmady, ýöne goşmaça elýeterlilik maslahatlary bar.
       *[clean] Elýeterlilik hasabatyny { $action ->
            [close] ýapmak
           *[open] açmak
        } üçin basyň. Elýeterlilik meseleleri tapylmady.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA elýeterlilik bozulmasy ýüze çykaryldy. { $count ->
            [one] { $count } WCAG AA bozulmasy
           *[other] { $count } WCAG AA bozulmasy
        } tapyldy. Elýeterlilik hasabatyny { $action ->
            [close] ýapmak
           *[open] açmak
        } üçin basyň.
        [advisories] WCAG AA bozulmalary ýüze çykarylmady. { $count ->
            [one] { $count } goşmaça elýeterlilik maslahaty
           *[other] { $count } goşmaça elýeterlilik maslahaty
        } tapyldy. Elýeterlilik hasabatyny { $action ->
            [close] ýapmak
           *[open] açmak
        } üçin basyň.
       *[clean] WCAG AA bozulmalary ýüze çykarylmady. Elýeterlilik hasabatyny { $action ->
            [close] ýapmak
           *[open] açmak
        } üçin basyň.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML wersiýasy { $version }

editor-tab-help = Kontekst kömegi
editor-tab-help-short = Kontekst
editor-tab-errors = Ýalňyşlyklar
editor-tab-warnings = Duýduryşlar
editor-tab-info = Maglumat
editor-tab-accessibility = Elýeterlilik
editor-tab-responses = Iberilen jogaplar

editor-tab-with-count = { $label }: { $count }

editor-options = Redaktoryň sazlamalary
editor-format-as-doenetml = DoenetML hökmünde formatla
editor-format-as-xml = XML hökmünde formatla


## The diagnostics panel

editor-diagnostic-line = { $line }-nji setir

editor-no-errors = Ýalňyşlyk ýok
editor-no-warnings = Duýduryş ýok
editor-no-info = Maglumat habarlary ýok

editor-show-info-annotations = Maglumat habarlaryny redaktorda görkez
editor-show-accessibility-annotations = Elýeterlilik habarlaryny redaktorda görkez

editor-accessibility-learn-more = Doenet elýeterlilige nähili çemeleşýär

editor-accessibility-violations-heading = Elýeterlilik bozulmalary ({ $standard })

editor-accessibility-other-heading = Beýleki elýeterlilik meseleleri
editor-none-found = Hiç zat tapylmady


## Submitted responses

editor-no-responses = Entek iberilen jogap ýok
editor-response-answer-id = Jogabyň Id-si
editor-response-response = Jogap
editor-response-credit = Bal
editor-response-submitted = Iberildi


## The context-help panel

help-placeholder = Resminamalary görmek üçin kursory tegiň adynyň, atributyň ýa-da { $ref } üstünde goýuň.

help-unsupported-ref-chain = { $example } ýaly köp bölekli salgylanmalar üçin kömek entek goldanylmaýar.

help-unresolved-ref =
    { $reason ->
        [notFound] Salgylanma üçin obýekt tapylmady: { $ref }.
        [multiple] Salgylanma üçin birnäçe obýekt tapyldy: { $ref }.
       *[indeterminate] { $ref } üçin obýekti kesgitlemek başartmady.
    }

help-learn-about-references = Salgylanmalar barada öwreniň →
help-reference-page = Sprawka sahypasy →

help-suggestions-header =
    { $location ->
        [inside] { $element } içinde
       *[top] Ýokarky derejede
    }{ $allowed ->
        [none] { " — bu ýere hiç zat gelmeýär." }
        [text] { " — bu ýere tekst ýazyp bolýar." }
        [text-and-components] { " — bu ýere tekst ýazyp bolýar ýa-da şulary synanyşyň:" }
       *[components] { " — şulary synanyşyp bolýar:" }
    }

help-suggestions-footer = Ähli { $total } komponenti görmek üçin { $shortcut } basyň.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } obýektine salgylanma.
       *[other] { $ref } — { $target } obýektine salgylanma ({ $line }-nji setir).
    }

help-ref-derived-from =
    { $line ->
        [none] Ony { $owner } { $role } hökmünde girizdi.
       *[other] Ony { $owner } { $line }-nji setirde { $role } hökmünde girizdi.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } elementiniň { $property } häsiýetine salgylanma.
       *[other] { $ref } — { $element } elementiniň { $property } häsiýetine salgylanma ({ $line }-nji setir).
    }

help-kind-attribute = atribut
help-kind-snippet = bölek
help-kind-array-entry = massiwiň elementi

help-default = Başlangyç bahasy:
help-active-default = Hereket edýän başlangyç bahasy:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Rugsat berlen bahalar (her element üçin birden):
       *[other] Rugsat berlen bahalar:
    }

help-suggested-values = Maslahat berilýän bahalar:

help-inserts = Goşýar:

help-coordinates =
    { $count ->
        [one] Koordinata:
       *[other] Koordinatalar:
    }

help-type = Görnüşi:

help-resolved-style = Alnan stil (styleNumber { $styleNumber }):

help-resolved-function-names = Alnan funksiýa atlary:
help-reset-list = Bu meýdanyň dikeldiş sanawy:
help-added-on-input = Bu meýdanda goşulanlar:
help-removed-on-input = Bu meýdandan aýrylanlar:

help-reset-overrides = { $reset } — { $additional } we { $removed } üstünden agdyklyk edýär.
