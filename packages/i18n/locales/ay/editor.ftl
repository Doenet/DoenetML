# Aymara editor and language-server surfaces. Translated from
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
# The direct-knowledge «-wa» is written on the assertions here, as in
# `chrome.ftl`; the panel's own headings are labels rather than assertions and
# carry nothing. That distinction is the reason this file's marking is uneven, and
# it is deliberate.
#
# Aymara drops the plural suffix after a numeral, so a `{ $count -> … }` whose
# only English difference is the noun's number renders one string here and the
# select is dropped. A comment marks each site.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Kutt'ayaña
       *[update] Machaqaptayaña
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Uñachayiri { $word }
       *[other] Uñachayiri { $word } { $shortcut }
    }


## The variant picker

editor-variant = Mayja uñacha
editor-variant-filter = Suysuña…
editor-variant-next = Qhipa mayja uñacha ajlliña
editor-variant-previous = Nayra mayja uñacha ajlliña


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA puriña p'akjawi jikitawa. Puriña yatiyawi { $action ->
            [close] jist'antañataki
           *[open] jist'arañataki
        } limt'aña.
        [advisories] Puriña yatiyawi { $action ->
            [close] jist'antañataki
           *[open] jist'arañataki
        } limt'aña. Janiwa kuna WCAG AA p'akjawisa jikitkiti, ukampisa yaqha puriña amuyt'ayawinakawa utji.
       *[clean] Puriña yatiyawi { $action ->
            [close] jist'antañataki
           *[open] jist'arañataki
        } limt'aña. Janiwa kuna puriña ch'axwawisa jikitkiti.
    }

# No select on `$count`: «p'akjawi» and «amuyt'ayawi» take no plural suffix after
# a numeral, so both categories would render the same string.
editor-accessibility-label =
    { $status ->
        [violations] WCAG AA puriña p'akjawi jikitawa. { $count } WCAG AA p'akjawi jikitawa. Puriña yatiyawi { $action ->
            [close] jist'antañataki
           *[open] jist'arañataki
        } limt'aña.
        [advisories] Janiwa kuna WCAG AA p'akjawisa jikitkiti. { $count } yaqha puriña amuyt'ayawi jikitawa. Puriña yatiyawi { $action ->
            [close] jist'antañataki
           *[open] jist'arañataki
        } limt'aña.
       *[clean] Janiwa kuna WCAG AA p'akjawisa jikitkiti. Puriña yatiyawi { $action ->
            [close] jist'antañataki
           *[open] jist'arañataki
        } limt'aña.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML { $version } uñacha

editor-tab-help = Kawkinkiskix ukhamaru yanapa
editor-tab-help-short = Kawki
editor-tab-errors = Pantjawinaka
editor-tab-warnings = Amuyt'ayawinaka
editor-tab-info = Yatiyawi
editor-tab-accessibility = Puriña
editor-tab-responses = Apayata jaysäwinaka

editor-tab-with-count = { $label }: { $count }

editor-options = Qillqaqiri ajlliwinaka
editor-format-as-doenetml = DoenetML kipka uñstayaña
editor-format-as-xml = XML kipka uñstayaña


## The diagnostics panel

editor-diagnostic-line = Siqi #{ $line }

editor-no-errors = Janiwa pantjawinaka
editor-no-warnings = Janiwa amuyt'ayawinaka
editor-no-info = Janiwa yatiyawi uñacht'awinaka

editor-show-info-annotations = Qillqaqirina yatiyawi uñacht'awinaka uñachayaña
editor-show-accessibility-annotations = Qillqaqirina puriña uñacht'awinaka uñachayaña

editor-accessibility-learn-more = Doenet kunjamsa puriña uñjaski uka yatiqaña

editor-accessibility-violations-heading = Puriña p'akjawinaka ({ $standard })

editor-accessibility-other-heading = Yaqha puriña ch'axwawinaka
editor-none-found = Janiwa kunasa jikitkiti


## Submitted responses

editor-no-responses = Janira apayata jaysäwinakasa utjkiti
editor-response-answer-id = Jaysäwi suti
editor-response-response = Jaysäwi
editor-response-credit = Chani
editor-response-submitted = Apayata


## The context-help panel

help-placeholder = Qillqa yatiyawitaki mä tag sutina, chimpuna, jan ukaxa { $ref } patxaru chimpu uchaña.

help-unsupported-ref-chain = { $example } kipka walja chikatani uñtawinakataki yanapa janira utjkiti.

help-unresolved-ref =
    { $reason ->
        [notFound] Aka uñtawitaki janiwa kunasa jikitkiti: { $ref }.
        [multiple] Aka uñtawitaki waljawa jikitawa: { $ref }.
       *[indeterminate] { $ref } kawkirurus uñtaski uka janiwa yatiñ atkiti.
    }

help-learn-about-references = Uñtawinakata yatiqaña →
help-reference-page = Uñtawi laphi →

help-suggestions-header =
    { $location ->
        [inside] { $element } manqhana
       *[top] Patxa chiqana
    }{ $allowed ->
        [none] { " — akana janiwa kunasa mantkiti." }
        [text] { " — akana qillqa uchaña." }
        [text-and-components] { " — akana qillqa uchaña, jan ukaxa yant'aña:" }
       *[components] { " — kunanaka yant'añataki:" }
    }

help-suggestions-footer = Taqpacha { $total } chikatanaka uñjañataki { $shortcut } limt'aña.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ukax { $target } uñtawiwa.
       *[other] { $ref } ukax { $target } uñtawiwa ({ $line } siqi).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } { $role } kipka uchawayi.
       *[other] { $owner } { $line } siqina { $role } kipka uchawayi.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ukax { $element } chikatana { $property } utjirinparu uñtawiwa.
       *[other] { $ref } ukax { $element } chikatana { $property } utjirinparu uñtawiwa ({ $line } siqi).
    }

help-kind-attribute = chimpu
help-kind-snippet = qillqa t'aqa
help-kind-array-entry = siqi mantawi

help-default = Nayra chani:
help-active-default = Jichha nayra chani:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Jaytata chaninaka (sapa mayniru mä):
       *[other] Jaytata chaninaka:
    }

help-suggested-values = Amuyt'ayata chaninaka:

help-inserts = Uchi:

# No select: «chiqanchawi» takes no plural suffix after a numeral, so both
# categories would render the same string.
help-coordinates = Chiqanchawinaka:

help-type = Kasta:

help-resolved-style = Jikita uñnaqa (styleNumber { $styleNumber }):

help-resolved-function-names = Jikita funsyun sutinaka:
help-reset-list = Aka mantawina kutt'ayawi siqi:
help-added-on-input = Aka mantawina yapxatata:
help-removed-on-input = Aka mantawina apsuta:

help-reset-overrides = { $reset } ukax { $additional } ukhamaraki { $removed } jaytiwa.
