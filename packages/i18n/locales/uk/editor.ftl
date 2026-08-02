# Ukrainian editor and language-server surfaces. Translated from
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


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Скинути
       *[update] Оновити
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } переглядач
       *[other] { $word } переглядач { $shortcut }
    }


## The variant picker

editor-variant = Варіант
editor-variant-filter = Фільтр…
editor-variant-next = Вибрати наступний варіант
editor-variant-previous = Вибрати попередній варіант


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Виявлено порушення доступності WCAG AA. Натисніть, щоб { $action ->
            [close] закрити
           *[open] відкрити
        } звіт про доступність.
        [advisories] Натисніть, щоб { $action ->
            [close] закрити
           *[open] відкрити
        } звіт про доступність. Порушень WCAG AA не виявлено, але є додаткові рекомендації щодо доступності.
       *[clean] Натисніть, щоб { $action ->
            [close] закрити
           *[open] відкрити
        } звіт про доступність. Проблем з доступністю не виявлено.
    }

editor-accessibility-label =
    { $status ->
        [violations] Виявлено порушення доступності WCAG AA. Знайдено { $count ->
            [one] { $count } порушення WCAG AA
            [few] { $count } порушення WCAG AA
            [many] { $count } порушень WCAG AA
           *[other] { $count } порушення WCAG AA
        }. Натисніть, щоб { $action ->
            [close] закрити
           *[open] відкрити
        } звіт про доступність.
        [advisories] Порушень WCAG AA не виявлено. Знайдено { $count ->
            [one] { $count } додаткову рекомендацію щодо доступності
            [few] { $count } додаткові рекомендації щодо доступності
            [many] { $count } додаткових рекомендацій щодо доступності
           *[other] { $count } додаткові рекомендації щодо доступності
        }. Натисніть, щоб { $action ->
            [close] закрити
           *[open] відкрити
        } звіт про доступність.
       *[clean] Порушень WCAG AA не виявлено. Натисніть, щоб { $action ->
            [close] закрити
           *[open] відкрити
        } звіт про доступність.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Версія DoenetML { $version }

editor-tab-help = Контекстна довідка
editor-tab-help-short = Контекст
editor-tab-errors = Помилки
editor-tab-warnings = Попередження
editor-tab-info = Інформація
editor-tab-accessibility = Доступність
editor-tab-responses = Надіслані відповіді

editor-tab-with-count = { $label }: { $count }

editor-options = Параметри редактора
editor-format-as-doenetml = Форматувати як DoenetML
editor-format-as-xml = Форматувати як XML


## The diagnostics panel

editor-diagnostic-line = Рядок №{ $line }

editor-no-errors = Помилок немає
editor-no-warnings = Попереджень немає
editor-no-info = Інформаційних повідомлень немає

editor-show-info-annotations = Показувати інформаційні повідомлення в редакторі
editor-show-accessibility-annotations = Показувати повідомлення про доступність у редакторі

editor-accessibility-learn-more = Дізнатися, як Doenet підходить до доступності

editor-accessibility-violations-heading = Порушення доступності ({ $standard })

editor-accessibility-other-heading = Інші проблеми з доступністю
editor-none-found = Нічого не знайдено


## Submitted responses

editor-no-responses = Надісланих відповідей ще немає
editor-response-answer-id = Ідентифікатор відповіді
editor-response-response = Відповідь
editor-response-credit = Зарахування
editor-response-submitted = Надіслано


## The context-help panel

help-placeholder = Помістіть курсор на назву тега, атрибут або { $ref }, щоб побачити документацію.

help-unsupported-ref-chain = Довідка для складених посилань на кшталт { $example } поки що не підтримується.

help-unresolved-ref =
    { $reason ->
        [notFound] Не знайдено об'єкта для посилання: { $ref }.
        [multiple] Знайдено кілька об'єктів для посилання: { $ref }.
       *[indeterminate] Не вдалося визначити об'єкт для { $ref }.
    }

help-learn-about-references = Дізнатися про посилання →
help-reference-page = Сторінка довідника →

help-suggestions-header =
    { $location ->
        [inside] Усередині { $element }
       *[top] На верхньому рівні
    }{ $allowed ->
        [none] { " — тут нічого не можна розмістити." }
        [text] { " — тут можна вводити текст." }
        [text-and-components] { " — тут можна вводити текст або спробувати:" }
       *[components] { " — що можна спробувати:" }
    }

help-suggestions-footer = Натисніть { $shortcut }, щоб побачити всі компоненти ({ $total }).

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — це посилання на { $target }.
       *[other] { $ref } — це посилання на { $target } (рядок { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Введено компонентом { $owner } як { $role }.
       *[other] Введено компонентом { $owner } у рядку { $line } як { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — це посилання на властивість { $property } компонента { $element }.
       *[other] { $ref } — це посилання на властивість { $property } компонента { $element } (рядок { $line }).
    }

help-kind-attribute = атрибут
help-kind-snippet = фрагмент
help-kind-array-entry = елемент масиву

help-default = Типове значення:
help-active-default = Чинне типове значення:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Дозволені значення (по одному на елемент):
       *[other] Дозволені значення:
    }

help-suggested-values = Пропоновані значення:

help-inserts = Вставляє:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координати:
    }

help-type = Тип:

help-resolved-style = Обчислений стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Обчислені назви функцій:
help-reset-list = Скидання списку на цьому полі:
help-added-on-input = Додано на цьому полі:
help-removed-on-input = Вилучено на цьому полі:

help-reset-overrides = { $reset } має перевагу над { $additional } і { $removed }.
