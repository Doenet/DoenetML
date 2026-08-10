# Tsonga editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Tlherisela
       *[update] Pfuxeta
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Xikombisi
       *[other] { $word } Xikombisi { $shortcut }
    }


## The variant picker

editor-variant = Muxaka

editor-variant-filter = Hlungula…

editor-variant-next = Hlawula muxaka lowu landzelaka

editor-variant-previous = Hlawula muxaka lowu hundzeke


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ku kumeke ku tluriwa ka WCAG AA ka ku fikeleleka. Tshikilela ku { $action ->
            [close] pfala
           *[open] pfula
        } xiviko xa ku fikeleleka.
        [advisories] Tshikilela ku { $action ->
            [close] pfala
           *[open] pfula
        } xiviko xa ku fikeleleka. A ku kumekanga ku tluriwa ka WCAG AA, kambe ku na switsundzuxo swin'wana swa ku fikeleleka.
       *[clean] Tshikilela ku { $action ->
            [close] pfala
           *[open] pfula
        } xiviko xa ku fikeleleka. A ku kumekanga swiphiqo swa ku fikeleleka.
    }

editor-accessibility-label =
    { $status ->
        [violations] Ku kumeke ku tluriwa ka WCAG AA ka ku fikeleleka. Ku kumeke { $count ->
            [one] ku tluriwa ka WCAG AA ka { $count }
           *[other] ku tluriwa ka WCAG AA ka { $count }
        }. Tshikilela ku { $action ->
            [close] pfala
           *[open] pfula
        } xiviko xa ku fikeleleka.
        [advisories] A ku kumekanga ku tluriwa ka WCAG AA. Ku kumeke { $count ->
            [one] xitsundzuxo xin'wana xa ku fikeleleka xa { $count }
           *[other] switsundzuxo swin'wana swa ku fikeleleka swa { $count }
        }. Tshikilela ku { $action ->
            [close] pfala
           *[open] pfula
        } xiviko xa ku fikeleleka.
       *[clean] A ku kumekanga ku tluriwa ka WCAG AA. Tshikilela ku { $action ->
            [close] pfala
           *[open] pfula
        } xiviko xa ku fikeleleka.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Vhezheni ya DoenetML { $version }

editor-tab-help = Mpfuno wa xiyimo
editor-tab-help-short = Xiyimo
editor-tab-errors = Swihoxo
editor-tab-warnings = Swilemukiso
editor-tab-info = Vuxokoxoko
editor-tab-accessibility = Ku fikeleleka
editor-tab-responses = Tinhlamulo leti rhumeriweke

editor-tab-with-count = { $label }: { $count }

editor-options = Swihlawulekisi swa muhleri
editor-format-as-doenetml = Longoloxa tanihi DoenetML
editor-format-as-xml = Longoloxa tanihi XML


## The diagnostics panel

editor-diagnostic-line = Layini #{ $line }

editor-no-errors = A Ku Na Swihoxo
editor-no-warnings = A Ku Na Swilemukiso
editor-no-info = A Ku Na Vuxokoxoko

editor-show-info-annotations = Kombisa vuxokoxoko eka muhleri
editor-show-accessibility-annotations = Kombisa swilemukiso swa ku fikeleleka eka muhleri

editor-accessibility-learn-more = Dyondza ndlela leyi Doenet yi languteke ku fikeleleka ha yona

editor-accessibility-violations-heading = Ku tluriwa ka ku fikeleleka ({ $standard })

editor-accessibility-other-heading = Swin'wana swiphiqo swa ku fikeleleka
editor-none-found = A ku kumekanga nchumu


## Submitted responses

editor-no-responses = A ku na tinhlamulo leti rhumeriweke ku fikela sweswi
editor-response-answer-id = Ayidi ya Nhlamulo
editor-response-response = Nhlamulo
editor-response-credit = Tinhlayo
editor-response-submitted = Yi rhumeriwile


## The context-help panel

help-placeholder = Veka khesa eka vito ra thegi, xihlawulekisi, kumbe { $ref } leswaku u kuma vuxokoxoko.

help-unsupported-ref-chain = Mpfuno wa tinkombo ta swiphemu swo tala tanihi { $example } a wu si seketeriwa.

help-unresolved-ref =
    { $reason ->
        [notFound] A ku kumekanga nchumu eka nkombo lowu: { $ref }.
        [multiple] Ku kumeke swilo swo tala eka nkombo lowu: { $ref }.
       *[indeterminate] Leswi { $ref } yi swi kombaka a swi kotekanga ku kumeka.
    }

help-learn-about-references = Dyondza hi tinkombo →
help-reference-page = Tluka ra nkombo →

help-suggestions-header =
    { $location ->
        [inside] Endzeni ka { $element }
       *[top] Ehenhla ka hinkwaswo
    }{ $allowed ->
        [none] { " — a ku na nchumu lowu nghenaka laha." }
        [text] { " — tsala matsalwa laha." }
        [text-and-components] { " — tsala matsalwa laha, kumbe u ringeta:" }
       *[components] { " — swilo leswi u nga swi ringetaka:" }
    }

help-suggestions-footer = Tshikilela { $shortcut } ku vona swiphemu hinkwaswo swa { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } i nkombo wa { $target }.
       *[other] { $ref } i nkombo wa { $target } (layini { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Yi tisiwe hi { $owner } tanihi { $role }.
       *[other] Yi tisiwe hi { $owner } eka layini { $line } tanihi { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } i nkombo wa xihlawulekisi xa { $property } xa { $element }.
       *[other] { $ref } i nkombo wa xihlawulekisi xa { $property } xa { $element } (layini { $line }).
    }

help-kind-attribute = xihlawulekisi
help-kind-snippet = xiphemu
help-kind-array-entry = ku nghenisiwa eka nxaxamelo

help-default = Xitolovelo:
help-active-default = Xitolovelo lexi tirhaka:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mimpimo leyi pfumeleriwaka (yin'we eka nchumu wun'wana ni wun'wana):
       *[other] Mimpimo leyi pfumeleriwaka:
    }

help-suggested-values = Mimpimo leyi tsundzuxiweke:

help-inserts = Yi nghenisa:

help-coordinates =
    { $count ->
        [one] Nkomboxiyimo:
       *[other] Swikomboxiyimo:
    }

help-type = Muxaka:

help-resolved-style = Xitayela lexi kumekeke (styleNumber { $styleNumber }):

help-resolved-function-names = Mavito ya mintirho lama kumekeke:
help-reset-list = Nxaxamelo lowu tlheriseriweke eka ku nghenisiwa loku:
help-added-on-input = Leswi engeteriweke eka ku nghenisiwa loku:
help-removed-on-input = Leswi susiweke eka ku nghenisiwa loku:

help-reset-overrides = { $reset } yi tlula { $additional } na { $removed }.
