# Udmurt editor and language-server surfaces. Translated from
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
# Udmurt counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Берыктыны
       *[update] Выльдыны
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Учконэз { $word }
       *[other] Учконэз { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Бӧрысь…
editor-variant-next = Собере вариантэз быръёно
editor-variant-previous = Азьло вариантэз быръёно


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA вуонлык тӥян шедьтэмын. Вуонлык отчётэз { $action ->
            [close] ворсан
           *[open] усьтон
        } понна зӥбе.
        [advisories] Вуонлык отчётэз { $action ->
            [close] ворсан
           *[open] усьтон
        } понна зӥбе. WCAG AA тӥянъёс ӧз шедьтӥськы, нош ватсам ӵектонъёс вань.
       *[clean] Вуонлык отчётэз { $action ->
            [close] ворсан
           *[open] усьтон
        } понна зӥбе. Вуонлык ужпумъёс ӧз шедьтӥськы.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA вуонлык тӥян шедьтэмын. { $count ->
            [one] { $count } WCAG AA тӥян
           *[other] { $count } WCAG AA тӥян
        } шедьтэмын. Вуонлык отчётэз { $action ->
            [close] ворсан
           *[open] усьтон
        } понна зӥбе.
        [advisories] WCAG AA тӥянъёс ӧз шедьтӥськы. { $count ->
            [one] { $count } ватсам ӵектон
           *[other] { $count } ватсам ӵектон
        } шедьтэмын. Вуонлык отчётэз { $action ->
            [close] ворсан
           *[open] усьтон
        } понна зӥбе.
       *[clean] WCAG AA тӥянъёс ӧз шедьтӥськы. Вуонлык отчётэз { $action ->
            [close] ворсан
           *[open] усьтон
        } понна зӥбе.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версия { $version }

editor-tab-help = Контекст юрттэт
editor-tab-help-short = Контекст
editor-tab-errors = Янгышъёс
editor-tab-warnings = Сак кариськонъёс
editor-tab-info = Ивортэт
editor-tab-accessibility = Вуонлык
editor-tab-responses = Ыстэм ответъёс

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторлэн тупатонъёсыз
editor-format-as-doenetml = DoenetML кадь форматировать карыны
editor-format-as-xml = XML кадь форматировать карыны


## The diagnostics panel

editor-diagnostic-line = { $line }-тӥ чур

editor-no-errors = Янгышъёс ӧвӧл
editor-no-warnings = Сак кариськонъёс ӧвӧл
editor-no-info = Ивортэт юрттэтъёс ӧвӧл

editor-show-info-annotations = Ивортэт юрттэтъёсты редакторын возьматыны
editor-show-accessibility-annotations = Вуонлык юрттэтъёсты редакторын возьматыны

editor-accessibility-learn-more = Doenet вуонлыклы кызьы учке

editor-accessibility-violations-heading = Вуонлык тӥянъёс ({ $standard })

editor-accessibility-other-heading = Мукет вуонлык ужпумъёс
editor-none-found = Номыр ӧз шедьтӥськы


## Submitted responses

editor-no-responses = Али ке но ыстэм ответъёс ӧвӧл
editor-response-answer-id = Ответлэн Id-ез
editor-response-response = Ответ
editor-response-credit = Балл
editor-response-submitted = Ыстэмын


## The context-help panel

help-placeholder = Документациез адӟон понна курсорез тег нимын, атрибут яке { $ref } вылэ пукты.

help-unsupported-ref-chain = { $example } кадь трос люкетъем герӟетъёслы юрттэт али ӧвӧл.

help-unresolved-ref =
    { $reason ->
        [notFound] Герӟетлы объект ӧз шедьтӥськы: { $ref }.
        [multiple] Герӟетлы трос объект шедьтэмын: { $ref }.
       *[indeterminate] { $ref } объектэз тодманы ӧз луы.
    }

help-learn-about-references = Герӟетъёс сярысь тодыны →
help-reference-page = Справка бам →

help-suggestions-header =
    { $location ->
        [inside] { $element } пушкын
       *[top] Вылӥ ёзын
    }{ $allowed ->
        [none] { " — татын номыр уг тэры." }
        [text] { " — татын текст гожтыны луэ." }
        [text-and-components] { " — татын текст гожтыны луэ, яке таосты эскере:" }
       *[components] { " — таосты эскерыны луэ:" }
    }

help-suggestions-footer = Вань { $total } компонентэз адӟон понна { $shortcut } зӥбе.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объект вылэ герӟет.
       *[other] { $ref } — { $target } объект вылэ герӟет ({ $line }-тӥ чур).
    }

help-ref-derived-from =
    { $line ->
        [none] Сое { $owner } { $role } сямен пыртӥз.
       *[other] Сое { $owner } { $line }-тӥ чурын { $role } сямен пыртӥз.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементлэн { $property } тодметэз вылэ герӟет.
       *[other] { $ref } — { $element } элементлэн { $property } тодметэз вылэ герӟет ({ $line }-тӥ чур).
    }

help-kind-attribute = атрибут
help-kind-snippet = висъет
help-kind-array-entry = массивлэн элементэз

help-default = Инъет дун:
help-active-default = Али инъет дун:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Лэзем дунъёс (котькуд элементлы огез):
       *[other] Лэзем дунъёс:
    }

help-suggested-values = Ӵектэм дунъёс:

help-inserts = Ватса:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатаос:
    }

help-type = Пӧртэмлык:

help-resolved-style = Потэм стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Потэм функциослэн нимъёссы:
help-reset-list = Та бусылэн берыктон списокез:
help-added-on-input = Та бусыын ватсамъёс:
help-removed-on-input = Та бусыысь палэнтэмъёс:

help-reset-overrides = { $reset } — { $additional } но { $removed } вылтӥ вормись.
