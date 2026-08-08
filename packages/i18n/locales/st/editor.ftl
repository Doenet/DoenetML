# Southern Sotho editor and language-server surfaces. Translated from
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
# Sesotho marks number with a class prefix and keeps doing so after a numeral,
# so the counted messages keep their selects.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Khutlisetsa
       *[update] Nchafatsa
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Mmontshi
       *[other] { $word } Mmontshi { $shortcut }
    }


## The variant picker

editor-variant = Mofuta
editor-variant-filter = Sefa...
editor-variant-next = Kgetha mofuta o latelang
editor-variant-previous = Kgetha mofuta o fetileng


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Tlolo ya WCAG AA ya phihlelelo e fumanwe. Tobetsa ho { $action ->
            [close] koala
           *[open] bula
        } tlaleho ya phihlelelo.
        [advisories] Tobetsa ho { $action ->
            [close] koala
           *[open] bula
        } tlaleho ya phihlelelo. Ha ho tlolo ya WCAG AA e fumanweng, empa ho na le dikeletso tse ding tsa phihlelelo.
       *[clean] Tobetsa ho { $action ->
            [close] koala
           *[open] bula
        } tlaleho ya phihlelelo. Ha ho bothata ba phihlelelo bo fumanweng.
    }

editor-accessibility-label =
    { $status ->
        [violations] Tlolo ya WCAG AA ya phihlelelo e fumanwe. { $count ->
            [one] Tlolo e { $count } ya WCAG AA e fumanwe
           *[other] Ditlolo tse { $count } tsa WCAG AA di fumanwe
        }. Tobetsa ho { $action ->
            [close] koala
           *[open] bula
        } tlaleho ya phihlelelo.
        [advisories] Ha ho tlolo ya WCAG AA e fumanweng. { $count ->
            [one] Keletso e { $count } e nngwe ya phihlelelo e fumanwe
           *[other] Dikeletso tse { $count } tse ding tsa phihlelelo di fumanwe
        }. Tobetsa ho { $action ->
            [close] koala
           *[open] bula
        } tlaleho ya phihlelelo.
       *[clean] Ha ho tlolo ya WCAG AA e fumanweng. Tobetsa ho { $action ->
            [close] koala
           *[open] bula
        } tlaleho ya phihlelelo.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML mofuta { $version }

editor-tab-help = Thuso e tsamaellanang le moo o leng teng
editor-tab-help-short = Moo o leng teng
editor-tab-errors = Diphoso
editor-tab-warnings = Ditemoso
editor-tab-info = Tlhahisoleseding
editor-tab-accessibility = Phihlelelo
editor-tab-responses = Dikarabo tse rometsweng

editor-tab-with-count = { $label }: { $count }

editor-options = Dikgetho tsa mongodi
editor-format-as-doenetml = Hlophisa jwaloka DoenetML
editor-format-as-xml = Hlophisa jwaloka XML


## The diagnostics panel

editor-diagnostic-line = Mola #{ $line }

editor-no-errors = Ha ho Diphoso
editor-no-warnings = Ha ho Ditemoso
editor-no-info = Ha ho Tlhahlobo ya Tlhahisoleseding

editor-show-info-annotations = Bontsha ditlhahlobo tsa tlhahisoleseding ho mongodi
editor-show-accessibility-annotations = Bontsha ditlhahlobo tsa phihlelelo ho mongodi

editor-accessibility-learn-more = Ithute kamoo Doenet e sebetsanang le phihlelelo

editor-accessibility-violations-heading = Ditlolo tsa phihlelelo ({ $standard })

editor-accessibility-other-heading = Mathata a mang a phihlelelo
editor-none-found = Ha ho letho le fumanweng


## Submitted responses

editor-no-responses = Ha ho karabo e rometsweng ho fihlela jwale
editor-response-answer-id = Lebitso la Karabo
editor-response-response = Karabo
editor-response-credit = Matshwao
editor-response-submitted = E rometswe


## The context-help panel

help-placeholder = Beha sesupo hodima lebitso la tagi, tshobotsi kapa { $ref } ho fumana ditokomane.

help-unsupported-ref-chain = Thuso bakeng sa disupo tsa dikarolo tse ngata jwaloka { $example } ha e eso be teng.

help-unresolved-ref =
    { $reason ->
        [notFound] Ha ho letho le fumanweng bakeng sa sesupo: { $ref }.
        [multiple] Dintho tse ngata di fumanwe bakeng sa sesupo: { $ref }.
       *[indeterminate] Seo { $ref } e se supang ha se a tsejwa.
    }

help-learn-about-references = Ithute ka disupo →
help-reference-page = Leqephe la disupo →

help-suggestions-header =
    { $location ->
        [inside] Ka hare ho { $element }
       *[top] Boemong bo hodimo
    }{ $allowed ->
        [none] { " — ha ho letho le kenang mona." }
        [text] { " — ngola mongolo mona." }
        [text-and-components] { " — ngola mongolo mona, kapa leka:" }
       *[components] { " — dintho tseo o ka di lekang:" }
    }

help-suggestions-footer = Tobetsa { $shortcut } ho bona dintho tsohle tse { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ke sesupo sa { $target }.
       *[other] { $ref } ke sesupo sa { $target } (mola { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } o e reile lebitso la { $role }.
       *[other] { $owner } o e reile lebitso la { $role } moleng wa { $line }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ke sesupo sa tshobotsi { $property } ya { $element }.
       *[other] { $ref } ke sesupo sa tshobotsi { $property } ya { $element } (mola { $line }).
    }

help-kind-attribute = tshobotsi
help-kind-snippet = karolwana ya mongolo
help-kind-array-entry = kenyo ya lethathamo

help-default = E teng ka tlwaelo:
help-active-default = E teng ka tlwaelo mme e sebetsa:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Boleng bo dumelletsweng (bo le bong ntho ka nngwe):
       *[other] Boleng bo dumelletsweng:
    }

help-suggested-values = Boleng bo kgothaletswang:

help-inserts = E kenya:

help-coordinates =
    { $count ->
        [one] Sesupanepo:
       *[other] Disupanepo:
    }

help-type = Mofuta:

help-resolved-style = Setaele se tsejwang (styleNumber { $styleNumber }):

help-resolved-function-names = Mabitso a tshebetso a tsejwang:
help-reset-list = Lethathamo le khutlisetswang kenyong ena:
help-added-on-input = Se ekeditsweng kenyong ena:
help-removed-on-input = Se tlositsweng kenyong ena:

help-reset-overrides = { $reset } e feta { $additional } le { $removed }.
