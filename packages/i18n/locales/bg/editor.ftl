# Bulgarian editor and language-server surfaces. Translated from
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
# Bulgarian counts in the same two categories English does, so every selection
# below keeps both branches.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Нулиране
       *[update] Обновяване
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } на прегледа
       *[other] { $word } на прегледа { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Филтър…
editor-variant-next = Избор на следващия вариант
editor-variant-previous = Избор на предишния вариант


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Открито е нарушение на достъпността по WCAG AA. Щракнете, за да { $action ->
            [close] затворите
           *[open] отворите
        } отчета за достъпност.
        [advisories] Щракнете, за да { $action ->
            [close] затворите
           *[open] отворите
        } отчета за достъпност. Не са намерени нарушения по WCAG AA, но има допълнителни препоръки за достъпност.
       *[clean] Щракнете, за да { $action ->
            [close] затворите
           *[open] отворите
        } отчета за достъпност. Не са намерени проблеми с достъпността.
    }

editor-accessibility-label =
    { $status ->
        [violations] Открито е нарушение на достъпността по WCAG AA. Намерено е { $count ->
            [one] { $count } нарушение по WCAG AA
           *[other] { $count } нарушения по WCAG AA
        }. Щракнете, за да { $action ->
            [close] затворите
           *[open] отворите
        } отчета за достъпност.
        [advisories] Не са открити нарушения по WCAG AA. Намерена е { $count ->
            [one] { $count } допълнителна препоръка за достъпност
           *[other] { $count } допълнителни препоръки за достъпност
        }. Щракнете, за да { $action ->
            [close] затворите
           *[open] отворите
        } отчета за достъпност.
       *[clean] Не са открити нарушения по WCAG AA. Щракнете, за да { $action ->
            [close] затворите
           *[open] отворите
        } отчета за достъпност.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Версия { $version } на DoenetML

editor-tab-help = Контекстна помощ
editor-tab-help-short = Контекст
editor-tab-errors = Грешки
editor-tab-warnings = Предупреждения
editor-tab-info = Информация
editor-tab-accessibility = Достъпност
editor-tab-responses = Изпратени отговори

editor-tab-with-count = { $label }: { $count }

editor-options = Настройки на редактора
editor-format-as-doenetml = Форматиране като DoenetML
editor-format-as-xml = Форматиране като XML


## The diagnostics panel

editor-diagnostic-line = Ред № { $line }

editor-no-errors = Няма грешки
editor-no-warnings = Няма предупреждения
editor-no-info = Няма информационни съобщения

editor-show-info-annotations = Показване на информационните съобщения в редактора
editor-show-accessibility-annotations = Показване на съобщенията за достъпност в редактора

editor-accessibility-learn-more = Как Doenet подхожда към достъпността

editor-accessibility-violations-heading = Нарушения на достъпността ({ $standard })

editor-accessibility-other-heading = Други проблеми с достъпността
editor-none-found = Не е намерено нищо


## Submitted responses

editor-no-responses = Все още няма изпратени отговори
editor-response-answer-id = Id на отговора
editor-response-response = Отговор
editor-response-credit = Точки
editor-response-submitted = Изпратен


## The context-help panel

help-placeholder = Поставете курсора върху име на таг, атрибут или { $ref }, за да видите документацията.

help-unsupported-ref-chain = Помощта за съставни препратки като { $example } все още не се поддържа.

help-unresolved-ref =
    { $reason ->
        [notFound] Не е намерен обект за препратката: { $ref }.
        [multiple] Намерени са няколко обекта за препратката: { $ref }.
       *[indeterminate] Обектът за { $ref } не можа да бъде определен.
    }

help-learn-about-references = Научете повече за препратките →
help-reference-page = Страница от справочника →

help-suggestions-header =
    { $location ->
        [inside] Вътре в { $element }
       *[top] На най-горното ниво
    }{ $allowed ->
        [none] { " — тук не може да има нищо." }
        [text] { " — тук може да въведете текст." }
        [text-and-components] { " — тук може да въведете текст или да опитате:" }
       *[components] { " — може да опитате:" }
    }

help-suggestions-footer = Натиснете { $shortcut }, за да видите всички { $total } компонента.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } е препратка към { $target }.
       *[other] { $ref } е препратка към { $target } (ред { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Въведено от { $owner } като { $role }.
       *[other] Въведено от { $owner } на ред { $line } като { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } е препратка към свойството { $property } на { $element }.
       *[other] { $ref } е препратка към свойството { $property } на { $element } (ред { $line }).
    }

help-kind-attribute = атрибут
help-kind-snippet = фрагмент
help-kind-array-entry = елемент от масив

help-default = Стойност по подразбиране:
help-active-default = Действаща стойност по подразбиране:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Допустими стойности (по една на елемент):
       *[other] Допустими стойности:
    }

help-suggested-values = Предлагани стойности:

help-inserts = Вмъква:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координати:
    }

help-type = Тип:

help-resolved-style = Получен стил (styleNumber { $styleNumber }):

help-resolved-function-names = Получени имена на функции:
help-reset-list = Списък за нулиране за това поле:
help-added-on-input = Добавено за това поле:
help-removed-on-input = Премахнато за това поле:

help-reset-overrides = { $reset } има предимство пред { $additional } и { $removed }.
