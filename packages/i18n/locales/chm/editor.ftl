# Mari editor and language-server surfaces. Translated from
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
# Mari counts in the same two categories English does, so every selection below
# keeps both branches — though a noun after a numeral stays singular, so the
# two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Пӧртылташ
       *[update] Уэмдаш
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Ончышым { $word }
       *[other] Ончышым { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Ойырымаш…
editor-variant-next = Вес вариантым ойыраш
editor-variant-previous = Ончычсо вариантым ойыраш


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA шуын кертмашын пудыртымашыже муалте. Шуын кертмаш отчётым { $action ->
            [close] петыраш
           *[open] почаш
        } темдал.
        [advisories] Шуын кертмаш отчётым { $action ->
            [close] петыраш
           *[open] почаш
        } темдал. WCAG AA пудыртымаш-влак муалт огытыл, но ешартыш ой-влак улыт.
       *[clean] Шуын кертмаш отчётым { $action ->
            [close] петыраш
           *[open] почаш
        } темдал. Шуын кертмаш йодыш-влак муалт огытыл.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA шуын кертмашын пудыртымашыже муалте. { $count ->
            [one] { $count } WCAG AA пудыртымаш
           *[other] { $count } WCAG AA пудыртымаш
        } муалте. Шуын кертмаш отчётым { $action ->
            [close] петыраш
           *[open] почаш
        } темдал.
        [advisories] WCAG AA пудыртымаш-влак муалт огытыл. { $count ->
            [one] { $count } ешартыш ой
           *[other] { $count } ешартыш ой
        } муалте. Шуын кертмаш отчётым { $action ->
            [close] петыраш
           *[open] почаш
        } темдал.
       *[clean] WCAG AA пудыртымаш-влак муалт огытыл. Шуын кертмаш отчётым { $action ->
            [close] петыраш
           *[open] почаш
        } темдал.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версий { $version }

editor-tab-help = Контекст полыш
editor-tab-help-short = Контекст
editor-tab-errors = Йоҥылыш-влак
editor-tab-warnings = Шижтарымаш-влак
editor-tab-info = Увер
editor-tab-accessibility = Шуын кертмаш
editor-tab-responses = Колтымо вашмут-влак

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторын келыштарымашыже
editor-format-as-doenetml = DoenetML семын форматлаш
editor-format-as-xml = XML семын форматлаш


## The diagnostics panel

editor-diagnostic-line = { $line }-ше радам

editor-no-errors = Йоҥылыш уке
editor-no-warnings = Шижтарымаш уке
editor-no-info = Увер увертарымаш уке

editor-show-info-annotations = Увер увертарымаш-влакым редакторышто ончыкташ
editor-show-accessibility-annotations = Шуын кертмаш увертарымаш-влакым редакторышто ончыкташ

editor-accessibility-learn-more = Doenet шуын кертмашлан кузе онча

editor-accessibility-violations-heading = Шуын кертмашын пудыртымашыже-влак ({ $standard })

editor-accessibility-other-heading = Вес шуын кертмаш йодыш-влак
editor-none-found = Нимат муалт огыл


## Submitted responses

editor-no-responses = Кызытеш колтымо вашмут уке
editor-response-answer-id = Вашмутын Id-же
editor-response-response = Вашмут
editor-response-credit = Балл
editor-response-submitted = Колтымо


## The context-help panel

help-placeholder = Документацийым ужаш курсорым тег лӱм ӱмбак, атрибут ӱмбак але { $ref } ӱмбак шынде.

help-unsupported-ref-chain = { $example } гай шуко ужашан кылверлан полыш эше уке.

help-unresolved-ref =
    { $reason ->
        [notFound] Кылверлан объект муалт огыл: { $ref }.
        [multiple] Кылверлан шуко объект муалте: { $ref }.
       *[indeterminate] { $ref } объектым палемдаш ыш лий.
    }

help-learn-about-references = Кылвер-влак нерген пален налаш →
help-reference-page = Справке лаштык →

help-suggestions-header =
    { $location ->
        [inside] { $element } кӧргыштӧ
       *[top] Эн кӱшыл кӱкшытыштӧ
    }{ $allowed ->
        [none] { " — тыште нимо ок пуро." }
        [text] { " — тыште текстым возаш лиеш." }
        [text-and-components] { " — тыште текстым возаш лиеш, але нуным терген ончо:" }
       *[components] { " — нуным терген ончаш лиеш:" }
    }

help-suggestions-footer = Чыла { $total } компонентым ужаш { $shortcut } темдал.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объект ӱмбак кылвер.
       *[other] { $ref } — { $target } объект ӱмбак кылвер ({ $line }-ше радам).
    }

help-ref-derived-from =
    { $line ->
        [none] Тудым { $owner } { $role } семын пуртен.
       *[other] Тудым { $owner } { $line }-ше радамыште { $role } семын пуртен.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементын { $property } свойствыж ӱмбак кылвер.
       *[other] { $ref } — { $element } элементын { $property } свойствыж ӱмбак кылвер ({ $line }-ше радам).
    }

help-kind-attribute = атрибут
help-kind-snippet = ужаш
help-kind-array-entry = массивын элементше

help-default = Тӱҥ ак:
help-active-default = Кызытсе тӱҥ ак:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Лийше ак-влак (кажне элементлан иктым):
       *[other] Лийше ак-влак:
    }

help-suggested-values = Темлыме ак-влак:

help-inserts = Ешара:

help-coordinates =
    { $count ->
        [one] Координат:
       *[other] Координат-влак:
    }

help-type = Тӱс:

help-resolved-style = Лекше стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Лекше функцийын лӱмжӧ-влак:
help-reset-list = Тиде пасун пӧртылтымӧ лӱмерже:
help-added-on-input = Тиде пасуэш ешарыме:
help-removed-on-input = Тиде пасу гыч кораҥдыме:

help-reset-overrides = { $reset } — { $additional } да { $removed } ӱмбалне сеҥа.
