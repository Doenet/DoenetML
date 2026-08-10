# Northern Sotho editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button, and the
# context-help panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Bušetša
       *[update] Mpshafatša
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Mmontšhi
       *[other] { $word } Mmontšhi { $shortcut }
    }


## The variant picker

editor-variant = Mohuta

editor-variant-filter = Sefa…

editor-variant-next = Kgetha mohuta wo o latelago

editor-variant-previous = Kgetha mohuta wo o fetilego


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Go hweditšwe tlolo ya WCAG AA ya phihlelelo. Kgotla go { $action ->
            [close] tswalela
           *[open] bula
        } pego ya phihlelelo.
        [advisories] Kgotla go { $action ->
            [close] tswalela
           *[open] bula
        } pego ya phihlelelo. Ga go ya hwetšwa ditlolo tša WCAG AA, efela go na le dikeletšo tše dingwe tša phihlelelo.
       *[clean] Kgotla go { $action ->
            [close] tswalela
           *[open] bula
        } pego ya phihlelelo. Ga go ya hwetšwa mathata a phihlelelo.
    }

editor-accessibility-label =
    { $status ->
        [violations] Go hweditšwe tlolo ya WCAG AA ya phihlelelo. Go hweditšwe { $count ->
            [one] tlolo e { $count } ya WCAG AA
           *[other] ditlolo tše { $count } tša WCAG AA
        }. Kgotla go { $action ->
            [close] tswalela
           *[open] bula
        } pego ya phihlelelo.
        [advisories] Ga go ya hwetšwa ditlolo tša WCAG AA. Go hweditšwe { $count ->
            [one] keletšo e { $count } ye nngwe ya phihlelelo
           *[other] dikeletšo tše { $count } tše dingwe tša phihlelelo
        }. Kgotla go { $action ->
            [close] tswalela
           *[open] bula
        } pego ya phihlelelo.
       *[clean] Ga go ya hwetšwa ditlolo tša WCAG AA. Kgotla go { $action ->
            [close] tswalela
           *[open] bula
        } pego ya phihlelelo.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Tokollo ya DoenetML { $version }

editor-tab-help = Thušo ya seemo
editor-tab-help-short = Seemo
editor-tab-errors = Diphošo
editor-tab-warnings = Ditemošo
editor-tab-info = Tshedimošo
editor-tab-accessibility = Phihlelelo
editor-tab-responses = Dikarabo tše romilwego

editor-tab-with-count = { $label }: { $count }

editor-options = Dikgetho tša mohlophiši
editor-format-as-doenetml = Beakanya bjalo ka DoenetML
editor-format-as-xml = Beakanya bjalo ka XML


## The diagnostics panel

editor-diagnostic-line = Mothaladi #{ $line }

editor-no-errors = Ga go Diphošo
editor-no-warnings = Ga go Ditemošo
editor-no-info = Ga go Tshedimošo

editor-show-info-annotations = Bontšha tshedimošo ka gare ga mohlophiši
editor-show-accessibility-annotations = Bontšha ditemošo tša phihlelelo ka gare ga mohlophiši

editor-accessibility-learn-more = Ithute ka fao Doenet e lebelelago phihlelelo

editor-accessibility-violations-heading = Ditlolo tša phihlelelo ({ $standard })

editor-accessibility-other-heading = Mathata a mangwe a phihlelelo
editor-none-found = Ga go seo se hweditšwego


## Submitted responses

editor-no-responses = Ga go dikarabo tše romilwego go fihla bjale
editor-response-answer-id = Aidi ya Karabo
editor-response-response = Karabo
editor-response-credit = Meputso
editor-response-submitted = E romilwe


## The context-help panel

help-placeholder = Bea kesara leineng la tag, sekeng, goba go { $ref } bakeng sa ditokumente.

help-unsupported-ref-chain = Thušo ya ditšhupetšo tša dikarolo tše dintši bjalo ka { $example } ga se ya thekgwa go fihla bjale.

help-unresolved-ref =
    { $reason ->
        [notFound] Ga go seo se hweditšwego bakeng sa setšhupetšo se: { $ref }.
        [multiple] Go hweditšwe dilo tše dintši bakeng sa setšhupetšo se: { $ref }.
       *[indeterminate] Seo { $ref } se se šupago ga se a kgona go laetšwa.
    }

help-learn-about-references = Ithute ka ditšhupetšo →
help-reference-page = Letlakala la tšhupetšo →

help-suggestions-header =
    { $location ->
        [inside] Ka gare ga { $element }
       *[top] Mo godimo kudu
    }{ $allowed ->
        [none] { " — ga go selo se se yago mo." }
        [text] { " — ngwala sengwalwa mo." }
        [text-and-components] { " — ngwala sengwalwa mo, goba leka:" }
       *[components] { " — dilo tšeo o ka di lekago:" }
    }

help-suggestions-footer = Kgotla { $shortcut } go bona dikarolo ka moka tše { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ke setšhupetšo sa { $target }.
       *[other] { $ref } ke setšhupetšo sa { $target } (mothaladi { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] E tsebišitšwe ke { $owner } bjalo ka { $role }.
       *[other] E tsebišitšwe ke { $owner } mothalading { $line } bjalo ka { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ke setšhupetšo sa seka sa { $property } sa { $element }.
       *[other] { $ref } ke setšhupetšo sa seka sa { $property } sa { $element } (mothaladi { $line }).
    }

help-kind-attribute = seka
help-kind-snippet = sekgetlwana
help-kind-array-entry = tseno ya lelokelelo

help-default = Ka tlwaelo:
help-active-default = Tlwaelo ye e šomago:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Boleng bjo bo dumeletšwego (bo tee go selo se sengwe le se sengwe):
       *[other] Boleng bjo bo dumeletšwego:
    }

help-suggested-values = Boleng bjo bo šišintšwego:

help-inserts = E tsenya:

help-coordinates =
    { $count ->
        [one] Sesupanepo:
       *[other] Disupanepo:
    }

help-type = Mohuta:

help-resolved-style = Setaele se se laeditšwego (styleNumber { $styleNumber }):

help-resolved-function-names = Maina a ditirišo a a laeditšwego:
help-reset-list = Lenaneo le le bušeditšwego go tsenyo ye:
help-added-on-input = Se se okeditšwego go tsenyo ye:
help-removed-on-input = Se se tlošitšwego go tsenyo ye:

help-reset-overrides = { $reset } e feta { $additional } le { $removed }.
