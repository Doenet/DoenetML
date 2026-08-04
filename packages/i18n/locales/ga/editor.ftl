# Irish editor and language-server surfaces. Translated from
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
# Irish counts in five plural categories, so the counted messages below are
# written out in all five. The noun stays singular after a numeral, is left
# alone after 1, and is lenited after 2 to 6 — «shárú», «mholadh». Neither
# «sárú» nor «moladh» can be eclipsed, so the `many` branch (7 to 10) carries
# the plain word, the same as `one` and `other`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Athshocraigh
       *[update] Nuashonraigh
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } an t-amharcán
       *[other] { $word } an t-amharcán { $shortcut }
    }


## The variant picker

editor-variant = Leagan
editor-variant-filter = Scag…
editor-variant-next = Roghnaigh an chéad leagan eile
editor-variant-previous = Roghnaigh an leagan roimhe seo


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Aimsíodh sárú inrochtaineachta WCAG AA. Cliceáil chun an tuairisc inrochtaineachta a { $action ->
            [close] dhúnadh
           *[open] oscailt
        }.
        [advisories] Cliceáil chun an tuairisc inrochtaineachta a { $action ->
            [close] dhúnadh
           *[open] oscailt
        }. Níor aimsíodh aon sárú WCAG AA, ach tá moltaí inrochtaineachta breise ar fáil.
       *[clean] Cliceáil chun an tuairisc inrochtaineachta a { $action ->
            [close] dhúnadh
           *[open] oscailt
        }. Níor aimsíodh aon fhadhb inrochtaineachta.
    }

editor-accessibility-label =
    { $status ->
        [violations] Aimsíodh sárú inrochtaineachta WCAG AA. Aimsíodh { $count ->
            [one] { $count } sárú WCAG AA
            [two] { $count } shárú WCAG AA
            [few] { $count } shárú WCAG AA
            [many] { $count } sárú WCAG AA
           *[other] { $count } sárú WCAG AA
        }. Cliceáil chun an tuairisc inrochtaineachta a { $action ->
            [close] dhúnadh
           *[open] oscailt
        }.
        [advisories] Níor aimsíodh aon sárú WCAG AA. Aimsíodh { $count ->
            [one] { $count } moladh inrochtaineachta breise
            [two] { $count } mholadh inrochtaineachta breise
            [few] { $count } mholadh inrochtaineachta breise
            [many] { $count } moladh inrochtaineachta breise
           *[other] { $count } moladh inrochtaineachta breise
        }. Cliceáil chun an tuairisc inrochtaineachta a { $action ->
            [close] dhúnadh
           *[open] oscailt
        }.
       *[clean] Níor aimsíodh aon sárú WCAG AA. Cliceáil chun an tuairisc inrochtaineachta a { $action ->
            [close] dhúnadh
           *[open] oscailt
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Leagan DoenetML { $version }

editor-tab-help = Cabhair a bhaineann leis an gcomhthéacs
editor-tab-help-short = Comhthéacs
editor-tab-errors = Earráidí
editor-tab-warnings = Rabhaidh
editor-tab-info = Eolas
editor-tab-accessibility = Inrochtaineacht
editor-tab-responses = Freagraí a seoladh

editor-tab-with-count = { $label }: { $count }

editor-options = Roghanna an eagarthóra
editor-format-as-doenetml = Formáidigh mar DoenetML
editor-format-as-xml = Formáidigh mar XML


## The diagnostics panel

editor-diagnostic-line = Líne #{ $line }

editor-no-errors = Gan earráidí
editor-no-warnings = Gan rabhaidh
editor-no-info = Gan diagnóisic eolais

editor-show-info-annotations = Taispeáin diagnóisic eolais san eagarthóir
editor-show-accessibility-annotations = Taispeáin diagnóisic inrochtaineachta san eagarthóir

editor-accessibility-learn-more = Foghlaim conas a dhéileálann Doenet le hinrochtaineacht

editor-accessibility-violations-heading = Sáruithe inrochtaineachta ({ $standard })

editor-accessibility-other-heading = Fadhbanna inrochtaineachta eile
editor-none-found = Níor aimsíodh aon cheann


## Submitted responses

editor-no-responses = Níor seoladh aon fhreagra fós
editor-response-answer-id = Aitheantóir an fhreagra
editor-response-response = Freagra
editor-response-credit = Creidiúint
editor-response-submitted = Seolta


## The context-help panel

help-placeholder = Cuir an cúrsóir ar ainm clibe, ar aitreabúid nó ar { $ref } le doiciméadú a fháil.

help-unsupported-ref-chain = Níl cabhair ar fáil fós do thagairtí ilchodacha ar nós { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Níor aimsíodh aon tagra don tagairt: { $ref }.
        [multiple] Aimsíodh níos mó ná tagra amháin don tagairt: { $ref }.
       *[indeterminate] Níorbh fhéidir tagra do { $ref } a chinneadh.
    }

help-learn-about-references = Foghlaim faoi thagairtí →
help-reference-page = Leathanach tagartha →

help-suggestions-header =
    { $location ->
        [inside] Taobh istigh den eilimint { $element }
       *[top] Ag an leibhéal is airde
    }{ $allowed ->
        [none] { " — ní théann aon rud anseo." }
        [text] { " — clóscríobh téacs anseo." }
        [text-and-components] { " — clóscríobh téacs anseo, nó bain triail as:" }
       *[components] { " — rudaí le triail:" }
    }

help-suggestions-footer = Brúigh { $shortcut } chun na comhpháirteanna go léir a fheiceáil ({ $total } acu).

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Is tagairt chuig { $target } é { $ref }.
       *[other] Is tagairt chuig { $target } é { $ref } (líne { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Tugtha isteach ag { $owner } mar ról { $role }.
       *[other] Tugtha isteach ag { $owner } ar líne { $line } mar ról { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Is tagairt chuig airí { $property } na heiliminte { $element } é { $ref }.
       *[other] Is tagairt chuig airí { $property } na heiliminte { $element } é { $ref } (líne { $line }).
    }

help-kind-attribute = aitreabúid
help-kind-snippet = blúire
help-kind-array-entry = iontráil eagair

help-default = Réamhshocrú:
help-active-default = Réamhshocrú gníomhach:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Luachanna ceadaithe (ceann in aghaidh na míre):
       *[other] Luachanna ceadaithe:
    }

help-suggested-values = Luachanna molta:

help-inserts = Cuireann isteach:

help-coordinates =
    { $count ->
        [one] Comhordanáid:
        [two] Comhordanáidí:
        [few] Comhordanáidí:
        [many] Comhordanáidí:
       *[other] Comhordanáidí:
    }

help-type = Cineál:

help-resolved-style = Stíl réitithe (styleNumber { $styleNumber }):

help-resolved-function-names = Ainmneacha feidhme réitithe:
help-reset-list = Athshocraigh an liosta ar an ionchur seo:
help-added-on-input = Curtha leis ar an ionchur seo:
help-removed-on-input = Bainte ar an ionchur seo:

help-reset-overrides = Sáraíonn { $reset } { $additional } agus { $removed }.
