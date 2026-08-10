# Nyankole editor and language-server surfaces: the footer, the diagnostics
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
        [reset] Garurayo
       *[update] Hyahyisa
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Omworeki
       *[other] { $word } Omworeki { $shortcut }
    }


## The variant picker

editor-variant = Omuringo

editor-variant-filter = Cwamu…

editor-variant-next = Toorana omuringo ogurikukuratsya

editor-variant-previous = Toorana omuringo ogwahweireho


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Okuhenda WCAG AA omu kuhikaho kushangirwe. Kanda { $action ->
            [close] okwigara
           *[open] okwigura
        } eripoota y'okuhikaho.
        [advisories] Kanda { $action ->
            [close] okwigara
           *[open] okwigura
        } eripoota y'okuhikaho. Tihariho kuhenda WCAG AA okushangirwe, kwonka hariho endagiriro ezindi z'okuhikaho.
       *[clean] Kanda { $action ->
            [close] okwigara
           *[open] okwigura
        } eripoota y'okuhikaho. Tihariho bizibu by'okuhikaho ebishangirwe.
    }

editor-accessibility-label =
    { $status ->
        [violations] Okuhenda WCAG AA omu kuhikaho kushangirwe. { $count ->
            [one] Hashangirwe okuhenda WCAG AA { $count }
           *[other] Hashangirwe okuhenda WCAG AA { $count }
        }. Kanda { $action ->
            [close] okwigara
           *[open] okwigura
        } eripoota y'okuhikaho.
        [advisories] Tihariho kuhenda WCAG AA okushangirwe. { $count ->
            [one] Hashangirwe endagiriro endiijo y'okuhikaho { $count }
           *[other] Hashangirwe endagiriro ezindi z'okuhikaho { $count }
        }. Kanda { $action ->
            [close] okwigara
           *[open] okwigura
        } eripoota y'okuhikaho.
       *[clean] Tihariho kuhenda WCAG AA okushangirwe. Kanda { $action ->
            [close] okwigara
           *[open] okwigura
        } eripoota y'okuhikaho.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Enshoneka ya DoenetML { $version }

editor-tab-help = Obuhwezi bw'ahu orikuba
editor-tab-help-short = Ahu orikuba
editor-tab-errors = Ebihabo
editor-tab-warnings = Okurabura
editor-tab-info = Amakuru
editor-tab-accessibility = Okuhikaho
editor-tab-responses = Eby'okugarukamu ebyohereziibwe

editor-tab-with-count = { $label }: { $count }

editor-options = Entoorano z'omuhandiiki
editor-format-as-doenetml = Teekateeka nka DoenetML
editor-format-as-xml = Teekateeka nka XML


## The diagnostics panel

editor-diagnostic-line = Omurongo #{ $line }

editor-no-errors = Tihariho Bihabo
editor-no-warnings = Tihariho Kurabura
editor-no-info = Tihariho Makuru

editor-show-info-annotations = Yoreka amakuru omu muhandiiki
editor-show-accessibility-annotations = Yoreka okurabura kw'okuhikaho omu muhandiiki

editor-accessibility-learn-more = Manya oku Doenet erikupima okuhikaho

editor-accessibility-violations-heading = Okuhenda okuhikaho ({ $standard })

editor-accessibility-other-heading = Ebizibu ebindi by'okuhikaho
editor-none-found = Tihariho ekishangirwe


## Submitted responses

editor-no-responses = Tihariho by'okugarukamu ebyohereziibwe hati
editor-response-answer-id = Ekimanyiso ky'Eky'okugarukamu
editor-response-response = Ekigarukiibwemu
editor-response-credit = Amanota
editor-response-submitted = Kyohereziibwe


## The context-help panel

help-placeholder = Ta akakomo aha iziina rya tagi, aha kiranga, nari aha { $ref } okushanga ebyahandiikirwe.

help-unsupported-ref-chain = Obuhwezi aha byoreka ebicweka bingi nka { $example } tiburatandike.

help-unresolved-ref =
    { $reason ->
        [notFound] Tihariho ekishangirwe aha kyoreka eki: { $ref }.
        [multiple] Hashangirwe ebintu bingi aha kyoreka eki: { $ref }.
       *[indeterminate] Eki { $ref } erikworeka tikimanyirwe.
    }

help-learn-about-references = Manya aha byoreka →
help-reference-page = Orupapura rw'ebyoreka →

help-suggestions-header =
    { $location ->
        [inside] Omunda ya { $element }
       *[top] Ahaiguru munonga
    }{ $allowed ->
        [none] { " — tihariho ekirikubaasa kuza hanu." }
        [text] { " — handiika ebigambo hanu." }
        [text-and-components] { " — handiika ebigambo hanu, nari ogyezeho:" }
       *[components] { " — ebicweka ebi orikubaasa kugyezaho:" }
    }

help-suggestions-footer = Kanda { $shortcut } okureeba ebicweka byona { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } nikyoreka { $target }.
       *[other] { $ref } nikyoreka { $target } (omurongo { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Kiruga aha { $owner } nka { $role }.
       *[other] Kiruga aha { $owner } aha murongo { $line } nka { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } nikyoreka ekiranga { $property } kya { $element }.
       *[other] { $ref } nikyoreka ekiranga { $property } kya { $element } (omurongo { $line }).
    }

help-kind-attribute = ekiranga
help-kind-snippet = akacweka
help-kind-array-entry = okutaho omu rukurikirana

help-default = Eky'obwire bwona:
help-active-default = Eky'obwire bwona ekirikukora:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ebigyendererwa ebikirizibwe (aha buri kintu):
       *[other] Ebigyendererwa ebikirizibwe:
    }

help-suggested-values = Ebigyendererwa ebiteereireho:

help-inserts = Nikitaho:

help-coordinates =
    { $count ->
        [one] Ekyoreka omwanya:
       *[other] Ebyoreka emyanya:
    }

help-type = Omuringo:

help-resolved-style = Omuringo ogushangirwe (styleNumber { $styleNumber }):

help-resolved-function-names = Amaziina ga fonkishoni agashangirwe:
help-reset-list = Orukurikirana orugaruriibwe aha kutaho oku:
help-added-on-input = Ebyongyeirweho aha kutaho oku:
help-removed-on-input = Ebiihirweho aha kutaho oku:

help-reset-overrides = { $reset } neekira { $additional } na { $removed }.
