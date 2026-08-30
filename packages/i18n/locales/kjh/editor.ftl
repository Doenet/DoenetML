# Khakas editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Cyrillic in the standard Khakas alphabet, with **і ғ ң ӧ ӱ ӌ** as full
# letters and not as variants of their Russian look-alikes — the same
# convention as the other three files of this locale.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay in English exactly as written.
#
# This is the thinnest of the four Khakas files. An editor's vocabulary —
# filter, format, diagnostic, context help — has no Khakas equivalent that has
# ever been written down, so the Russian words stand where nothing else could
# be established: `редактор`, `формат`, `вариант`, `фильтр`, `контекст`,
# `атрибут`, `массив`, `координата`, `стиль`, `версия`. See
# `locales/kjh/content.ftl` for the general note on how thin the register is.
#
# Khakas leaves a noun singular after a numeral, and `Intl.PluralRules` has no
# data for `kjh`, so every count selection is a single `*[other]`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Нандыра идерге
       *[update] Наларға
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Кӧрҷеңні { $word }
       *[other] Кӧрҷеңні { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Сӱзерге…
editor-variant-next = Соондағы вариантты таллирға
editor-variant-previous = Алнындағы вариантты таллирға


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA тузаланҷаң арғаның тоғыр полғаны табылған. Тузаланҷаң арға отчедын { $action ->
            [close] чабарға
           *[open] азарға
        } пазыңар.
        [advisories] Тузаланҷаң арға отчедын { $action ->
            [close] чабарға
           *[open] азарға
        } пазыңар. WCAG AA тоғыр нимелері табылбаан, че хоза сӱмелер пар.
       *[clean] Тузаланҷаң арға отчедын { $action ->
            [close] чабарға
           *[open] азарға
        } пазыңар. Тузаланҷаң арға сурығлары табылбаан.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA тузаланҷаң арғаның тоғыр полғаны табылған. { $count ->
           *[other] { $count } WCAG AA тоғыр нимезі
        } табылған. Тузаланҷаң арға отчедын { $action ->
            [close] чабарға
           *[open] азарға
        } пазыңар.
        [advisories] WCAG AA тоғыр нимелері табылбаан. { $count ->
           *[other] { $count } хоза тузаланҷаң арға сӱмезі
        } табылған. Тузаланҷаң арға отчедын { $action ->
            [close] чабарға
           *[open] азарға
        } пазыңар.
       *[clean] WCAG AA тоғыр нимелері табылбаан. Тузаланҷаң арға отчедын { $action ->
            [close] чабарға
           *[open] азарға
        } пазыңар.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версиязы { $version }

editor-tab-help = Контекст хоостыра полыс
editor-tab-help-short = Контекст
editor-tab-errors = Чазығлар
editor-tab-warnings = Сағындырығлар
editor-tab-info = Искіріг
editor-tab-accessibility = Тузаланҷаң арға
editor-tab-responses = Ызылған хариилар

editor-tab-with-count = { $label }: { $count }

editor-options = Редактор тимнестері
editor-format-as-doenetml = DoenetML чіли форматтирға
editor-format-as-xml = XML чіли форматтирға


## The diagnostics panel

editor-diagnostic-line = { $line } строка

editor-no-errors = Чазығ чох
editor-no-warnings = Сағындырығ чох
editor-no-info = Искіріг чох

editor-show-info-annotations = Искіріглерні редакторда кӧзідерге
editor-show-accessibility-annotations = Тузаланҷаң арға искіріглерін редакторда кӧзідерге

editor-accessibility-learn-more = Doenet тузаланҷаң арғаа хайди кӧрче, аны піліңер

editor-accessibility-violations-heading = Тузаланҷаң арғаның тоғыр нимелері ({ $standard })

editor-accessibility-other-heading = Пасха тузаланҷаң арға сурығлары
editor-none-found = Ноо да ниме табылбаан


## Submitted responses

editor-no-responses = Ызылған харии че чоғыл
editor-response-answer-id = Харииның Id-зі
editor-response-response = Харии
editor-response-credit = Палл
editor-response-submitted = Ызылған


## The context-help panel

help-placeholder = Документацияны кӧрер ӱчӱн курсорны тег адына, атрибутха алай { $ref } ӱстӱне саларға.

help-unsupported-ref-chain = { $example } чіли кӧп ӱлӱстіг сілтегнең полыс че чоғыл.

help-unresolved-ref =
    { $reason ->
        [notFound] Сілтегге ниме табылбаан: { $ref }.
        [multiple] Сілтегге кӧп ниме табылған: { $ref }.
       *[indeterminate] { $ref } ӱчӱн нимені таныхтап полбаан.
    }

help-learn-about-references = Сілтеглер тузында пілерге →
help-reference-page = Таныхтағ страницазы →

help-suggestions-header =
    { $location ->
        [inside] { $element } істінде
       *[top] Ӱстӱнзерге ӱлӱсте
    }{ $allowed ->
        [none] { " — мында ноо да ниме турбинча." }
        [text] { " — мында текст пазыңар." }
        [text-and-components] { " — мында текст пазыңар, алай пуларны сынаңар:" }
       *[components] { " — пуларны сынаңар:" }
    }

help-suggestions-footer = Прай { $total } компонентті кӧрер ӱчӱн { $shortcut } пазыңар.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } ӱчӱн сілтег.
       *[other] { $ref } — { $target } ӱчӱн сілтег ({ $line } строка).
    }

help-ref-derived-from =
    { $line ->
        [none] Аны { $owner } { $role } чіли кирген.
       *[other] Аны { $owner } { $line } строкада { $role } чіли кирген.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементтің { $property } свойствозына сілтег.
       *[other] { $ref } — { $element } элементтің { $property } свойствозына сілтег ({ $line } строка).
    }

help-kind-attribute = атрибут
help-kind-snippet = ӱзінді
help-kind-array-entry = массив элементі

help-default = Тӧстеғ утха:
help-active-default = Хазыр тӧстеғ утха:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Чарирған утхалар (пір элементке пірер):
       *[other] Чарирған утхалар:
    }

help-suggested-values = Сӱме иділген утхалар:

help-inserts = Хозар:

help-coordinates =
    { $count ->
       *[other] Координаталар:
    }

help-type = Пӱдізі:

help-resolved-style = Табылған стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Табылған функция аттары:
help-reset-list = Пу кирҷеңдегі нандыра идер списогы:
help-added-on-input = Пу кирҷеңге хозылғаны:
help-removed-on-input = Пу кирҷеңнең сығарылғаны:

help-reset-overrides = { $reset } — { $additional } паза { $removed } ӱстӱнең тузаланча.
