# Setswana editor and language-server surfaces. Translated from
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
# Setswana marks number with a class prefix and keeps doing so after a numeral,
# so the counted messages keep their selects.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Busetsa
       *[update] Ntshafatsa
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Mmontshi
       *[other] { $word } Mmontshi { $shortcut }
    }


## The variant picker

editor-variant = Mofuta
editor-variant-filter = Tlhopha...
editor-variant-next = Tlhopha mofuta o o latelang
editor-variant-previous = Tlhopha mofuta o o fetileng


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Tlolo ya WCAG AA ya tsenogo e fitlhetswe. Tobetsa go { $action ->
            [close] tswala
           *[open] bula
        } pego ya tsenogo.
        [advisories] Tobetsa go { $action ->
            [close] tswala
           *[open] bula
        } pego ya tsenogo. Ga go na tlolo ya WCAG AA e e fitlhetsweng, mme go na le dikgakololo tse dingwe tsa tsenogo.
       *[clean] Tobetsa go { $action ->
            [close] tswala
           *[open] bula
        } pego ya tsenogo. Ga go na bothata jwa tsenogo jo bo fitlhetsweng.
    }

editor-accessibility-label =
    { $status ->
        [violations] Tlolo ya WCAG AA ya tsenogo e fitlhetswe. { $count ->
            [one] Tlolo e le { $count } ya WCAG AA e fitlhetswe
           *[other] Ditlolo tse { $count } tsa WCAG AA di fitlhetswe
        }. Tobetsa go { $action ->
            [close] tswala
           *[open] bula
        } pego ya tsenogo.
        [advisories] Ga go na tlolo ya WCAG AA e e fitlhetsweng. { $count ->
            [one] Kgakololo e le { $count } e nngwe ya tsenogo e fitlhetswe
           *[other] Dikgakololo tse { $count } tse dingwe tsa tsenogo di fitlhetswe
        }. Tobetsa go { $action ->
            [close] tswala
           *[open] bula
        } pego ya tsenogo.
       *[clean] Ga go na tlolo ya WCAG AA e e fitlhetsweng. Tobetsa go { $action ->
            [close] tswala
           *[open] bula
        } pego ya tsenogo.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML mofuta { $version }

editor-tab-help = Thuso e e tsamaelanang le lefelo
editor-tab-help-short = Lefelo
editor-tab-errors = Diphoso
editor-tab-warnings = Ditlhagiso
editor-tab-info = Tshedimosetso
editor-tab-accessibility = Tsenogo
editor-tab-responses = Dikarabo tse di romilweng

editor-tab-with-count = { $label }: { $count }

editor-options = Ditlhopho tsa mokwadi
editor-format-as-doenetml = Rulaganya jaaka DoenetML
editor-format-as-xml = Rulaganya jaaka XML


## The diagnostics panel

editor-diagnostic-line = Mola #{ $line }

editor-no-errors = Ga go na Diphoso
editor-no-warnings = Ga go na Ditlhagiso
editor-no-info = Ga go na Tlhatlhobo ya Tshedimosetso

editor-show-info-annotations = Bontsha ditlhatlhobo tsa tshedimosetso mo mokwading
editor-show-accessibility-annotations = Bontsha ditlhatlhobo tsa tsenogo mo mokwading

editor-accessibility-learn-more = Ithute ka fa Doenet e dirisanang ka teng le tsenogo

editor-accessibility-violations-heading = Ditlolo tsa tsenogo ({ $standard })

editor-accessibility-other-heading = Mathata a mangwe a tsenogo
editor-none-found = Ga go na sepe se se fitlhetsweng


## Submitted responses

editor-no-responses = Ga go na karabo e e romilweng go fitlha jaanong
editor-response-answer-id = Leina la Karabo
editor-response-response = Karabo
editor-response-credit = Matshwao
editor-response-submitted = E romilwe


## The context-help panel

help-placeholder = Baya sesupo mo godimo ga leina la tagi, tshiamelo kgotsa { $ref } go bona dikwalo.

help-unsupported-ref-chain = Thuso ya disupo tsa dikarolo tse dintsi jaaka { $example } ga e ise e nne teng.

help-unresolved-ref =
    { $reason ->
        [notFound] Ga go na sepe se se fitlhetsweng mo sesupong: { $ref }.
        [multiple] Dilo tse dintsi di fitlhetswe mo sesupong: { $ref }.
       *[indeterminate] Se { $ref } e se supang ga se itsiwe.
    }

help-learn-about-references = Ithute ka disupo →
help-reference-page = Tsebe ya disupo →

help-suggestions-header =
    { $location ->
        [inside] Mo teng ga { $element }
       *[top] Mo boemong jo bo kwa godimo
    }{ $allowed ->
        [none] { " — ga go sepe se se tsenang fano." }
        [text] { " — kwala mokwalo fano." }
        [text-and-components] { " — kwala mokwalo fano, kgotsa leka:" }
       *[components] { " — dilo tse o ka di lekang:" }
    }

help-suggestions-footer = Tobetsa { $shortcut } go bona dilo tsotlhe tse { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ke sesupo sa { $target }.
       *[other] { $ref } ke sesupo sa { $target } (mola { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } o e reile leina la { $role }.
       *[other] { $owner } o e reile leina la { $role } mo moleng wa { $line }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ke sesupo sa tshiamelo { $property } ya { $element }.
       *[other] { $ref } ke sesupo sa tshiamelo { $property } ya { $element } (mola { $line }).
    }

help-kind-attribute = tshiamelo
help-kind-snippet = karolwana ya mokwalo
help-kind-array-entry = tsenyo ya lenaneo

help-default = E teng ka tlwaelo:
help-active-default = E teng ka tlwaelo mme e a dira:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Boleng jo bo letleletsweng (bo le bongwe mo selong sengwe le sengwe):
       *[other] Boleng jo bo letleletsweng:
    }

help-suggested-values = Boleng jo bo atlenegisitsweng:

help-inserts = E tsenya:

help-coordinates =
    { $count ->
        [one] Sesupanepo:
       *[other] Disupanepo:
    }

help-type = Mofuta:

help-resolved-style = Setaele se se itsiweng (styleNumber { $styleNumber }):

help-resolved-function-names = Maina a ditiro a a itsiweng:
help-reset-list = Lenaneo le le busediwang mo tsenyong e:
help-added-on-input = Se se okeditsweng mo tsenyong e:
help-removed-on-input = Se se ntshitsweng mo tsenyong e:

help-reset-overrides = { $reset } e feta { $additional } le { $removed }.
