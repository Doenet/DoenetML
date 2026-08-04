# Scottish Gaelic editor and language-server surfaces. Translated from
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
# Gaelic counts in four plural categories, so the counted messages below are
# written out in all four; the `two` branch is the dual, which leaves the noun
# singular and lenites it.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ath-shuidhich
       *[update] Ùraich
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } an sealladair
       *[other] { $word } an sealladair { $shortcut }
    }


## The variant picker

editor-variant = Tionndadh
editor-variant-filter = Criathraich…
editor-variant-next = Tagh an ath thionndadh
editor-variant-previous = Tagh an tionndadh roimhe


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Chaidh briseadh so-ruigsinneachd WCAG AA a lorg. Briog gus an aithisg so-ruigsinneachd { $action ->
            [close] a dhùnadh
           *[open] fhosgladh
        }.
        [advisories] Briog gus an aithisg so-ruigsinneachd { $action ->
            [close] a dhùnadh
           *[open] fhosgladh
        }. Cha deach briseadh WCAG AA a lorg, ach tha molaidhean so-ruigsinneachd a bharrachd ri fhaighinn.
       *[clean] Briog gus an aithisg so-ruigsinneachd { $action ->
            [close] a dhùnadh
           *[open] fhosgladh
        }. Cha deach duilgheadas so-ruigsinneachd a lorg.
    }

editor-accessibility-label =
    { $status ->
        [violations] Chaidh briseadh so-ruigsinneachd WCAG AA a lorg. Chaidh { $count ->
            [one] { $count } bhriseadh WCAG AA
            [two] { $count } bhriseadh WCAG AA
            [few] { $count } brisidhean WCAG AA
           *[other] { $count } briseadh WCAG AA
        } a lorg. Briog gus an aithisg so-ruigsinneachd { $action ->
            [close] a dhùnadh
           *[open] fhosgladh
        }.
        [advisories] Cha deach briseadh WCAG AA a lorg. Chaidh { $count ->
            [one] { $count } mholadh so-ruigsinneachd a bharrachd
            [two] { $count } mholadh so-ruigsinneachd a bharrachd
            [few] { $count } molaidhean so-ruigsinneachd a bharrachd
           *[other] { $count } moladh so-ruigsinneachd a bharrachd
        } a lorg. Briog gus an aithisg so-ruigsinneachd { $action ->
            [close] a dhùnadh
           *[open] fhosgladh
        }.
       *[clean] Cha deach briseadh WCAG AA a lorg. Briog gus an aithisg so-ruigsinneachd { $action ->
            [close] a dhùnadh
           *[open] fhosgladh
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Tionndadh DoenetML { $version }

editor-tab-help = Cuideachadh a rèir a' cho-theacsa
editor-tab-help-short = Co-theacsa
editor-tab-errors = Mearachdan
editor-tab-warnings = Rabhaidhean
editor-tab-info = Fiosrachadh
editor-tab-accessibility = So-ruigsinneachd
editor-tab-responses = Freagairtean a chaidh a chur

editor-tab-with-count = { $label }: { $count }

editor-options = Roghainnean an deasaiche
editor-format-as-doenetml = Fòrmataich mar DoenetML
editor-format-as-xml = Fòrmataich mar XML


## The diagnostics panel

editor-diagnostic-line = Loidhne #{ $line }

editor-no-errors = Gun mhearachd
editor-no-warnings = Gun rabhadh
editor-no-info = Gun fhiosrachadh sgrùdaidh

editor-show-info-annotations = Seall fiosrachadh sgrùdaidh san deasaiche
editor-show-accessibility-annotations = Seall sgrùdadh so-ruigsinneachd san deasaiche

editor-accessibility-learn-more = Ionnsaich mar a làimhsicheas Doenet so-ruigsinneachd

editor-accessibility-violations-heading = Brisidhean so-ruigsinneachd ({ $standard })

editor-accessibility-other-heading = Duilgheadasan so-ruigsinneachd eile
editor-none-found = Cha deach gin a lorg


## Submitted responses

editor-no-responses = Cha deach freagairt a chur fhathast
editor-response-answer-id = Aithnichear na freagairt
editor-response-response = Freagairt
editor-response-credit = Creideas
editor-response-submitted = Air a chur


## The context-help panel

help-placeholder = Cuir an cùrsair air ainm taga, air buadh no air { $ref } airson sgrìobhainnean.

help-unsupported-ref-chain = Chan eil taic ann fhathast airson iomraidhean ioma-phàirteach mar { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Cha deach adhbhar-iomraidh a lorg airson: { $ref }.
        [multiple] Chaidh iomadh adhbhar-iomraidh a lorg airson: { $ref }.
       *[indeterminate] Cha b' urrainnear adhbhar-iomraidh airson { $ref } a dhearbhadh.
    }

help-learn-about-references = Ionnsaich mu iomraidhean →
help-reference-page = Duilleag iomraidh →

help-suggestions-header =
    { $location ->
        [inside] Am broinn { $element }
       *[top] Aig an ìre as àirde
    }{ $allowed ->
        [none] { " — chan eil dad a' dol an seo." }
        [text] { " — sgrìobh teacsa an seo." }
        [text-and-components] { " — sgrìobh teacsa an seo, no feuch:" }
       *[components] { " — rudan ri fheuchainn:" }
    }

help-suggestions-footer = Brùth { $shortcut } gus na { $total } co-phàirtean uile fhaicinn.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Is e iomradh air { $target } a th' ann an { $ref }.
       *[other] Is e iomradh air { $target } a th' ann an { $ref } (loidhne { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Air a thoirt a-steach le { $owner } mar { $role }.
       *[other] Air a thoirt a-steach le { $owner } air loidhne { $line } mar { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Is e iomradh air a' bhuadh { $property } de { $element } a th' ann an { $ref }.
       *[other] Is e iomradh air a' bhuadh { $property } de { $element } a th' ann an { $ref } (loidhne { $line }).
    }

help-kind-attribute = buadh
help-kind-snippet = criomag
help-kind-array-entry = innteart arraigh

help-default = Bun-roghainn:
help-active-default = Bun-roghainn ghnìomhach:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Luachan ceadaichte (fear gach nì):
       *[other] Luachan ceadaichte:
    }

help-suggested-values = Luachan a mholar:

help-inserts = Cuiridh e a-steach:

help-coordinates =
    { $count ->
        [one] Co-chomharra:
       *[other] Co-chomharran:
    }

help-type = Seòrsa:

help-resolved-style = Stoidhle fhuasgailte (styleNumber { $styleNumber }):

help-resolved-function-names = Ainmean foincsein fuasgailte:
help-reset-list = Ath-shuidhich an liosta air an ion-chur seo:
help-added-on-input = Air a chur ris an ion-chur seo:
help-removed-on-input = Air a thoirt air falbh bhon ion-chur seo:

help-reset-overrides = Bheir { $reset } buaidh thairis air { $additional } agus { $removed }.
