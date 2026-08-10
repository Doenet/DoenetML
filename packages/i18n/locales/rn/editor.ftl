# Rundi editor and language-server surfaces: the footer, the diagnostics panel,
# the variant picker, the accessibility button, and the context-help panel
# beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Subiza
       *[update] Vugurura
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Umwerekanyi
       *[other] { $word } Umwerekanyi { $shortcut }
    }


## The variant picker

editor-variant = Ubwoko

editor-variant-filter = Sesengura…

editor-variant-next = Hitamwo ubwoko bukurikira

editor-variant-previous = Hitamwo ubwoko buheruka


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Harabonetse ukurenga kwa WCAG AA kw'ukugerwako. Kanda kugira { $action ->
            [close] wugare
           *[open] wugurure
        } icegeranyo c'ukugerwako.
        [advisories] Kanda kugira { $action ->
            [close] wugare
           *[open] wugurure
        } icegeranyo c'ukugerwako. Nta kurenga kwa WCAG AA kwabonetse, mugabo hariho izindi mburi z'ukugerwako.
       *[clean] Kanda kugira { $action ->
            [close] wugare
           *[open] wugurure
        } icegeranyo c'ukugerwako. Nta ngorane z'ukugerwako zabonetse.
    }

editor-accessibility-label =
    { $status ->
        [violations] Harabonetse ukurenga kwa WCAG AA kw'ukugerwako. { $count ->
            [one] Harabonetse ukurenga kwa WCAG AA { $count }
           *[other] Harabonetse ukurenga kwa WCAG AA { $count }
        }. Kanda kugira { $action ->
            [close] wugare
           *[open] wugurure
        } icegeranyo c'ukugerwako.
        [advisories] Nta kurenga kwa WCAG AA kwabonetse. { $count ->
            [one] Harabonetse iyindi mburi y'ukugerwako { $count }
           *[other] Harabonetse izindi mburi z'ukugerwako { $count }
        }. Kanda kugira { $action ->
            [close] wugare
           *[open] wugurure
        } icegeranyo c'ukugerwako.
       *[clean] Nta kurenga kwa WCAG AA kwabonetse. Kanda kugira { $action ->
            [close] wugare
           *[open] wugurure
        } icegeranyo c'ukugerwako.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Verisiyo ya DoenetML { $version }

editor-tab-help = Ubufasha bw'aho uri
editor-tab-help-short = Aho uri
editor-tab-errors = Amakosa
editor-tab-warnings = Imburi
editor-tab-info = Amakuru
editor-tab-accessibility = Ukugerwako
editor-tab-responses = Inyishu zarungitswe

editor-tab-with-count = { $label }: { $count }

editor-options = Amahitamwo y'umwanditsi
editor-format-as-doenetml = Tunganya nka DoenetML
editor-format-as-xml = Tunganya nka XML


## The diagnostics panel

editor-diagnostic-line = Umurongo #{ $line }

editor-no-errors = Nta Makosa
editor-no-warnings = Nta Mburi
editor-no-info = Nta Makuru

editor-show-info-annotations = Erekana amakuru mu mwanditsi
editor-show-accessibility-annotations = Erekana imburi z'ukugerwako mu mwanditsi

editor-accessibility-learn-more = Menya ukuntu Doenet ipima ukugerwako

editor-accessibility-violations-heading = Ukurenga kw'ukugerwako ({ $standard })

editor-accessibility-other-heading = Izindi ngorane z'ukugerwako
editor-none-found = Nta kintu cabonetse


## Submitted responses

editor-no-responses = Nta nyishu zirungitswe ubu
editor-response-answer-id = Indangamuntu y'Inyishu
editor-response-response = Ivyatanzwe
editor-response-credit = Amanota
editor-response-submitted = Vyarungitswe


## The context-help panel

help-placeholder = Shira agatambo ku zina rya tagi, ku kiranga, canke kuri { $ref } kugira uronke ivyanditswe.

help-unsupported-ref-chain = Ubufasha ku vyerekana ibice vyinshi nka { $example } ntibura butangura.

help-unresolved-ref =
    { $reason ->
        [notFound] Nta kintu cabonetse kuri iki cerekana: { $ref }.
        [multiple] Harabonetse ibintu vyinshi kuri iki cerekana: { $ref }.
       *[indeterminate] Ico { $ref } yerekana ntikimenyekana.
    }

help-learn-about-references = Menya ivyerekeye ivyerekana →
help-reference-page = Urupapuro rw'ivyerekana →

help-suggestions-header =
    { $location ->
        [inside] Muri { $element }
       *[top] Hejuru cane
    }{ $allowed ->
        [none] { " — nta kintu gishobora kuza ng'aha." }
        [text] { " — andika amajambo ng'aha." }
        [text-and-components] { " — andika amajambo ng'aha, canke ugerageze:" }
       *[components] { " — ibintu ushobora kugerageza:" }
    }

help-suggestions-footer = Kanda { $shortcut } kugira urabe ibice vyose { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } yerekana { $target }.
       *[other] { $ref } yerekana { $target } (umurongo { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Yavuye kuri { $owner } nka { $role }.
       *[other] Yavuye kuri { $owner } ku murongo { $line } nka { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } yerekana ikiranga { $property } ca { $element }.
       *[other] { $ref } yerekana ikiranga { $property } ca { $element } (umurongo { $line }).
    }

help-kind-attribute = ikiranga
help-kind-snippet = agacimbiri
help-kind-array-entry = ukwinjiza mu rutonde

help-default = Ivyahora:
help-active-default = Ivyahora bikora:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ibitegerezwa vyemewe (kuri buri kintu):
       *[other] Ibitegerezwa vyemewe:
    }

help-suggested-values = Ibitegerezwa vyongewe:

help-inserts = Yinjiza:

help-coordinates =
    { $count ->
        [one] Cerekana ikibanza:
       *[other] Vyerekana ibibanza:
    }

help-type = Ubwoko:

help-resolved-style = Ubwoko bwabonetse (styleNumber { $styleNumber }):

help-resolved-function-names = Amazina ya fonksiyo yabonetse:
help-reset-list = Urutonde rwasubijwe kuri iri njizwa:
help-added-on-input = Ivyongewe kuri iri njizwa:
help-removed-on-input = Ivyakuwemwo kuri iri njizwa:

help-reset-overrides = { $reset } isumba { $additional } na { $removed }.
