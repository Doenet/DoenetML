# Russian editor and language-server surfaces. Translated from
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
# Russian counts in four plural categories, so every countable message selects
# on all of `one`, `few`, `many` and `other`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Сбросить
       *[update] Обновить
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } просмотр
       *[other] { $word } просмотр { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Фильтр…
editor-variant-next = Выбрать следующий вариант
editor-variant-previous = Выбрать предыдущий вариант


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Обнаружено нарушение доступности WCAG AA. Нажмите, чтобы { $action ->
            [close] закрыть
           *[open] открыть
        } отчёт о доступности.
        [advisories] Нажмите, чтобы { $action ->
            [close] закрыть
           *[open] открыть
        } отчёт о доступности. Нарушений WCAG AA не найдено, но есть дополнительные рекомендации по доступности.
       *[clean] Нажмите, чтобы { $action ->
            [close] закрыть
           *[open] открыть
        } отчёт о доступности. Проблем с доступностью не найдено.
    }

editor-accessibility-label =
    { $status ->
        [violations] Обнаружено нарушение доступности WCAG AA. Найдено { $count ->
            [one] { $count } нарушение WCAG AA
            [few] { $count } нарушения WCAG AA
            [many] { $count } нарушений WCAG AA
           *[other] { $count } нарушения WCAG AA
        }. Нажмите, чтобы { $action ->
            [close] закрыть
           *[open] открыть
        } отчёт о доступности.
        [advisories] Нарушений WCAG AA не обнаружено. Найдено { $count ->
            [one] { $count } дополнительная рекомендация по доступности
            [few] { $count } дополнительные рекомендации по доступности
            [many] { $count } дополнительных рекомендаций по доступности
           *[other] { $count } дополнительной рекомендации по доступности
        }. Нажмите, чтобы { $action ->
            [close] закрыть
           *[open] открыть
        } отчёт о доступности.
       *[clean] Нарушений WCAG AA не обнаружено. Нажмите, чтобы { $action ->
            [close] закрыть
           *[open] открыть
        } отчёт о доступности.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Версия DoenetML { $version }

editor-tab-help = Контекстная справка
editor-tab-help-short = Контекст
editor-tab-errors = Ошибки
editor-tab-warnings = Предупреждения
editor-tab-info = Информация
editor-tab-accessibility = Доступность
editor-tab-responses = Отправленные ответы

editor-tab-with-count = { $label }: { $count }

editor-options = Настройки редактора
editor-format-as-doenetml = Форматировать как DoenetML
editor-format-as-xml = Форматировать как XML


## The diagnostics panel

editor-diagnostic-line = Строка № { $line }

editor-no-errors = Ошибок нет
editor-no-warnings = Предупреждений нет
editor-no-info = Информационных сообщений нет

editor-show-info-annotations = Показывать информационные сообщения в редакторе
editor-show-accessibility-annotations = Показывать сообщения о доступности в редакторе

editor-accessibility-learn-more = Как Doenet подходит к доступности

editor-accessibility-violations-heading = Нарушения доступности ({ $standard })

editor-accessibility-other-heading = Другие проблемы с доступностью
editor-none-found = Ничего не найдено


## Submitted responses

editor-no-responses = Отправленных ответов пока нет
editor-response-answer-id = Id ответа
editor-response-response = Ответ
editor-response-credit = Зачёт
editor-response-submitted = Отправлен


## The context-help panel

help-placeholder = Поместите курсор на имя тега, атрибут или { $ref }, чтобы увидеть документацию.

help-unsupported-ref-chain = Справка по составным ссылкам вида { $example } пока не поддерживается.

help-unresolved-ref =
    { $reason ->
        [notFound] Не найден объект для ссылки: { $ref }.
        [multiple] Найдено несколько объектов для ссылки: { $ref }.
       *[indeterminate] Не удалось определить объект для { $ref }.
    }

help-learn-about-references = Подробнее о ссылках →
help-reference-page = Страница справочника →

help-suggestions-header =
    { $location ->
        [inside] Внутри { $element }
       *[top] На верхнем уровне
    }{ $allowed ->
        [none] { " — здесь ничего не может быть." }
        [text] { " — здесь можно ввести текст." }
        [text-and-components] { " — здесь можно ввести текст или попробовать:" }
       *[components] { " — можно попробовать:" }
    }

help-suggestions-footer = Нажмите { $shortcut }, чтобы увидеть все { $total } компонентов.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — ссылка на { $target }.
       *[other] { $ref } — ссылка на { $target } (строка { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Введено { $owner } как { $role }.
       *[other] Введено { $owner } в строке { $line } как { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — ссылка на свойство { $property } элемента { $element }.
       *[other] { $ref } — ссылка на свойство { $property } элемента { $element } (строка { $line }).
    }

help-kind-attribute = атрибут
help-kind-snippet = фрагмент
help-kind-array-entry = элемент массива

help-default = Значение по умолчанию:
help-active-default = Действующее значение по умолчанию:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Допустимые значения (по одному на элемент):
       *[other] Допустимые значения:
    }

help-suggested-values = Предлагаемые значения:

help-inserts = Вставляет:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координаты:
    }

help-type = Тип:

help-resolved-style = Итоговый стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Итоговые имена функций:
help-reset-list = Список сброса для этого поля:
help-added-on-input = Добавлено для этого поля:
help-removed-on-input = Удалено для этого поля:

help-reset-overrides = { $reset } имеет приоритет над { $additional } и { $removed }.
