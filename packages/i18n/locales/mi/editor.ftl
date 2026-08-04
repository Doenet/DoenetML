# Māori editor and language-server surfaces. Translated from
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
# Māori marks number on the article rather than on the noun, so the counted
# messages here need no selection — see the header of `chrome.ftl`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Tautuhi anō
       *[update] Whakahou
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } i te kaitirotiro
       *[other] { $word } i te kaitirotiro { $shortcut }
    }


## The variant picker

editor-variant = Momo
editor-variant-filter = Tātari...
editor-variant-next = Kōwhiria te momo o muri
editor-variant-previous = Kōwhiria te momo o mua


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kua kitea he takahitanga urunga WCAG AA. Pāwhiri kia { $action ->
            [close] katia
           *[open] whakatuwheratia
        } te pūrongo urunga.
        [advisories] Pāwhiri kia { $action ->
            [close] katia
           *[open] whakatuwheratia
        } te pūrongo urunga. Kāore he takahitanga WCAG AA i kitea, engari he tūtohutanga urunga anō kei reira.
       *[clean] Pāwhiri kia { $action ->
            [close] katia
           *[open] whakatuwheratia
        } te pūrongo urunga. Kāore he raruraru urunga i kitea.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kua kitea he takahitanga urunga WCAG AA. E { $count } ngā takahitanga WCAG AA i kitea. Pāwhiri kia { $action ->
            [close] katia
           *[open] whakatuwheratia
        } te pūrongo urunga.
        [advisories] Kāore he takahitanga WCAG AA i kitea. E { $count } ngā tūtohutanga urunga anō i kitea. Pāwhiri kia { $action ->
            [close] katia
           *[open] whakatuwheratia
        } te pūrongo urunga.
       *[clean] Kāore he takahitanga WCAG AA i kitea. Pāwhiri kia { $action ->
            [close] katia
           *[open] whakatuwheratia
        } te pūrongo urunga.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Putanga DoenetML { $version }

editor-tab-help = Āwhina ā-horopaki
editor-tab-help-short = Horopaki
editor-tab-errors = Hapa
editor-tab-warnings = Whakatūpato
editor-tab-info = Mōhiohio
editor-tab-accessibility = Urunga
editor-tab-responses = Whakautu kua tukuna

editor-tab-with-count = { $label }: { $count }

editor-options = Kōwhiringa ētita
editor-format-as-doenetml = Whakatakotoria hei DoenetML
editor-format-as-xml = Whakatakotoria hei XML


## The diagnostics panel

editor-diagnostic-line = Rārangi #{ $line }

editor-no-errors = Kāore he hapa
editor-no-warnings = Kāore he whakatūpato
editor-no-info = Kāore he mōhiohio

editor-show-info-annotations = Whakaaturia ngā mōhiohio i te ētita
editor-show-accessibility-annotations = Whakaaturia ngā tohu urunga i te ētita

editor-accessibility-learn-more = Akohia te huarahi a Doenet ki te urunga

editor-accessibility-violations-heading = Takahitanga urunga ({ $standard })

editor-accessibility-other-heading = Ētahi atu raruraru urunga
editor-none-found = Kāore i kitea


## Submitted responses

editor-no-responses = Kāore anō he whakautu kia tukuna
editor-response-answer-id = Answer Id
editor-response-response = Whakautu
editor-response-credit = Kaute
editor-response-submitted = I tukuna


## The context-help panel

help-placeholder = Waiho te pātohu ki runga i te ingoa tūtohu, huanga, { $ref } rānei mō ngā tuhinga āwhina.

help-unsupported-ref-chain = Kāore anō te āwhina mō ngā tohutoro wāhanga-maha pēnei i { $example } kia tautokona.

help-unresolved-ref =
    { $reason ->
        [notFound] Kāore i kitea he mea e tohua ana e te tohutoro: { $ref }.
        [multiple] He maha ngā mea i kitea e tohua ana e te tohutoro: { $ref }.
       *[indeterminate] Kāore i taea te tautuhi i te mea e tohua ana e { $ref }.
    }

help-learn-about-references = Akohia ngā tohutoro →
help-reference-page = Whārangi tohutoro →

help-suggestions-header =
    { $location ->
        [inside] Kei roto i { $element }
       *[top] Kei te taumata runga
    }{ $allowed ->
        [none] { " — kāore he mea e tau ki konei." }
        [text] { " — tuhia he kupu ki konei." }
        [text-and-components] { " — tuhia he kupu ki konei, whakamātauria rānei:" }
       *[components] { " — ngā mea hei whakamātau:" }
    }

help-suggestions-footer = Pēhia { $shortcut } kia kite i ngā wāhanga { $total } katoa.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] He tohutoro { $ref } ki { $target }.
       *[other] He tohutoro { $ref } ki { $target } (rārangi { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] I whakaurua e { $owner } hei { $role }.
       *[other] I whakaurua e { $owner } i te rārangi { $line } hei { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] He tohutoro { $ref } ki te āhuatanga { $property } o { $element }.
       *[other] He tohutoro { $ref } ki te āhuatanga { $property } o { $element } (rārangi { $line }).
    }

help-kind-attribute = huanga
help-kind-snippet = kongakonga
help-kind-array-entry = urunga huinga

help-default = Taunoa:
help-active-default = Taunoa mahi:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ngā uara e whakaaetia ana (kotahi mō ia mea):
       *[other] Ngā uara e whakaaetia ana:
    }

help-suggested-values = Ngā uara e tūtohutia ana:

help-inserts = Ka whakauru:

help-coordinates = Ruruku:

help-type = Momo:

help-resolved-style = Tāera kua tautuhia (styleNumber { $styleNumber }):

help-resolved-function-names = Ingoa taumahi kua tautuhia:
help-reset-list = Rārangi tautuhi anō mō tēnei tāuru:
help-added-on-input = I tāpirihia ki tēnei tāuru:
help-removed-on-input = I tangohia i tēnei tāuru:

help-reset-overrides = Ka hipa te { $reset } i te { $additional } me te { $removed }.
