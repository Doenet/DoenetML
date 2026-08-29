# Hill Mari editor and language-server surfaces. Translated from
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
# `mrj` is Hill Mari (Western Mari, кырык мары йӹлмӹ), the western literary
# standard of the Mari macrolanguage and a written language in its own right —
# `content.ftl`'s header sets out what separates it from `locales/chm` and
# which of those differences this catalog actually contains.
#
# Hill Mari counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Пӧртӹлташ
       *[update] Угӹцемдӓш
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Анжышым { $word }
       *[other] Анжышым { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Айырымаш…
editor-variant-next = Вес вариантым айыраш
editor-variant-previous = Анзыцшы вариантым айыраш


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA шон кердмӓшын пыдыртымашыжӹ моалте. Шон кердмӓш отчётым { $action ->
            [close] питӹраш
           *[open] пачаш
        } темдӓл.
        [advisories] Шон кердмӓш отчётым { $action ->
            [close] питӹраш
           *[open] пачаш
        } темдӓл. WCAG AA пыдыртымаш-влӓ моалт агылеп, но ешӓртыш ой-влӓ ылыт.
       *[clean] Шон кердмӓш отчётым { $action ->
            [close] питӹраш
           *[open] пачаш
        } темдӓл. Шон кердмӓш ядмаш-влӓ моалт агылеп.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA шон кердмӓшын пыдыртымашыжӹ моалте. { $count ->
            [one] { $count } WCAG AA пыдыртымаш
           *[other] { $count } WCAG AA пыдыртымаш
        } моалте. Шон кердмӓш отчётым { $action ->
            [close] питӹраш
           *[open] пачаш
        } темдӓл.
        [advisories] WCAG AA пыдыртымаш-влӓ моалт агылеп. { $count ->
            [one] { $count } ешӓртыш ой
           *[other] { $count } ешӓртыш ой
        } моалте. Шон кердмӓш отчётым { $action ->
            [close] питӹраш
           *[open] пачаш
        } темдӓл.
       *[clean] WCAG AA пыдыртымаш-влӓ моалт агылеп. Шон кердмӓш отчётым { $action ->
            [close] питӹраш
           *[open] пачаш
        } темдӓл.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версий { $version }

editor-tab-help = Контекст полыш
editor-tab-help-short = Контекст
editor-tab-errors = Йоҥылыш-влӓ
editor-tab-warnings = Шижтӓрӹмӓш-влӓ
editor-tab-info = Увер
editor-tab-accessibility = Шон кердмӓш
editor-tab-responses = Колтымо вашмут-влӓ

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторын келӹштӓрӹмӓшыжӹ
editor-format-as-doenetml = DoenetML семӹнь форматлаш
editor-format-as-xml = XML семӹнь форматлаш


## The diagnostics panel

editor-diagnostic-line = { $line }-шӹ рӓдӹ

editor-no-errors = Йоҥылыш уке
editor-no-warnings = Шижтӓрӹмӓш уке
editor-no-info = Увер увертӓрӹмӓш уке

editor-show-info-annotations = Увер увертӓрӹмӓш-влӓм редакторӹштӹ анжыкташ
editor-show-accessibility-annotations = Шон кердмӓш увертӓрӹмӓш-влӓм редакторӹштӹ анжыкташ

editor-accessibility-learn-more = Doenet шон кердмӓшлан кыце анжа

editor-accessibility-violations-heading = Шон кердмӓшын пыдыртымашыжӹ-влӓ ({ $standard })

editor-accessibility-other-heading = Вес шон кердмӓш ядмаш-влӓ
editor-none-found = Нимат моалт агыл


## Submitted responses

editor-no-responses = Кӹзӹтеш колтымо вашмут уке
editor-response-answer-id = Вашмутын Id-жӹ
editor-response-response = Вашмут
editor-response-credit = Балл
editor-response-submitted = Колтымо


## The context-help panel

help-placeholder = Документацийым ужаш курсорым тег лӹм вӹкӹ, атрибут вӹкӹ ӓли { $ref } вӹкӹ шӹндӹ.

help-unsupported-ref-chain = { $example } гай шукы ужашан кӹлверлан полыш эшӹ уке.

help-unresolved-ref =
    { $reason ->
        [notFound] Кӹлверлан объект моалт агыл: { $ref }.
        [multiple] Кӹлверлан шукы объект моалте: { $ref }.
       *[indeterminate] { $ref } объектым пӓлемдӓш ӹш ли.
    }

help-learn-about-references = Кӹлвер-влӓ гишӓн пӓлӹн нӓлӓш →
help-reference-page = Справке ластык →

help-suggestions-header =
    { $location ->
        [inside] { $element } кӧргӹштӹ
       *[top] Сек кӱшыл кӱкшытӹштӹ
    }{ $allowed ->
        [none] { " — тӹштӹ нима ак пыры." }
        [text] { " — тӹштӹ текстым сирӓш лиэш." }
        [text-and-components] { " — тӹштӹ текстым сирӓш лиэш, ӓли нӹнӹм терген анжы:" }
       *[components] { " — нӹнӹм терген анжаш лиэш:" }
    }

help-suggestions-footer = Цилӓ { $total } компонентым ужаш { $shortcut } темдӓл.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объект вӹкӹ кӹлвер.
       *[other] { $ref } — { $target } объект вӹкӹ кӹлвер ({ $line }-шӹ рӓдӹ).
    }

help-ref-derived-from =
    { $line ->
        [none] Тӹдӹм { $owner } { $role } семӹнь пуртен.
       *[other] Тӹдӹм { $owner } { $line }-шӹ рӓдӹштӹ { $role } семӹнь пуртен.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементын { $property } свойствыж вӹкӹ кӹлвер.
       *[other] { $ref } — { $element } элементын { $property } свойствыж вӹкӹ кӹлвер ({ $line }-шӹ рӓдӹ).
    }

help-kind-attribute = атрибут
help-kind-snippet = ужаш
help-kind-array-entry = массивын элементшӹ

help-default = Тӹнг ак:
help-active-default = Кӹзӹтсе тӹнг ак:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Лишӹ ак-влӓ (кажнӹ элементлан иктым):
       *[other] Лишӹ ак-влӓ:
    }

help-suggested-values = Темлыме ак-влӓ:

help-inserts = Ешӓра:

help-coordinates =
    { $count ->
        [one] Координат:
       *[other] Координат-влӓ:
    }

help-type = Тӹс:

help-resolved-style = Лӓкшӹ стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Лӓкшӹ функцийын лӹмжӹ-влӓ:
help-reset-list = Тидӹ пасун пӧртӹлтымӧ лӹмержӹ:
help-added-on-input = Тидӹ пасуэш ешӓрыме:
help-removed-on-input = Тидӹ пасу гӹц карангдымы:

help-reset-overrides = { $reset } — { $additional } дӓ { $removed } вӹлнӹ сеҥа.
