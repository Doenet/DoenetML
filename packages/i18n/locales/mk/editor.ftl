# Macedonian editor and language-server surfaces. Translated from
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
# Macedonian counts in two categories, so every selection below keeps both
# branches.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Врати
       *[update] Освежи
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } го прегледот
       *[other] { $word } го прегледот { $shortcut }
    }


## The variant picker

editor-variant = Варијанта
editor-variant-filter = Филтер…
editor-variant-next = Избери ја следната варијанта
editor-variant-previous = Избери ја претходната варијанта


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Откриено е прекршување на пристапноста според WCAG AA. Кликнете за да { $action ->
            [close] го затворите
           *[open] го отворите
        } извештајот за пристапност.
        [advisories] Кликнете за да { $action ->
            [close] го затворите
           *[open] го отворите
        } извештајот за пристапност. Не се најдени прекршувања според WCAG AA, но има дополнителни препораки за пристапност.
       *[clean] Кликнете за да { $action ->
            [close] го затворите
           *[open] го отворите
        } извештајот за пристапност. Не се најдени проблеми со пристапноста.
    }

editor-accessibility-label =
    { $status ->
        [violations] Откриено е прекршување на пристапноста според WCAG AA. Пронајдено е { $count ->
            [one] { $count } прекршување според WCAG AA
           *[other] { $count } прекршувања според WCAG AA
        }. Кликнете за да { $action ->
            [close] го затворите
           *[open] го отворите
        } извештајот за пристапност.
        [advisories] Не се откриени прекршувања според WCAG AA. Пронајдена е { $count ->
            [one] { $count } дополнителна препорака за пристапност
           *[other] { $count } дополнителни препораки за пристапност
        }. Кликнете за да { $action ->
            [close] го затворите
           *[open] го отворите
        } извештајот за пристапност.
       *[clean] Не се откриени прекршувања според WCAG AA. Кликнете за да { $action ->
            [close] го затворите
           *[open] го отворите
        } извештајот за пристапност.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Верзија { $version } на DoenetML

editor-tab-help = Контекстна помош
editor-tab-help-short = Контекст
editor-tab-errors = Грешки
editor-tab-warnings = Предупредувања
editor-tab-info = Информации
editor-tab-accessibility = Пристапност
editor-tab-responses = Испратени одговори

editor-tab-with-count = { $label }: { $count }

editor-options = Поставки на уредувачот
editor-format-as-doenetml = Форматирај како DoenetML
editor-format-as-xml = Форматирај како XML


## The diagnostics panel

editor-diagnostic-line = Ред бр. { $line }

editor-no-errors = Нема грешки
editor-no-warnings = Нема предупредувања
editor-no-info = Нема информативни пораки

editor-show-info-annotations = Прикажувај информативни пораки во уредувачот
editor-show-accessibility-annotations = Прикажувај пораки за пристапност во уредувачот

editor-accessibility-learn-more = Како Doenet пристапува кон пристапноста

editor-accessibility-violations-heading = Прекршувања на пристапноста ({ $standard })

editor-accessibility-other-heading = Други проблеми со пристапноста
editor-none-found = Ништо не е пронајдено


## Submitted responses

editor-no-responses = Сè уште нема испратени одговори
editor-response-answer-id = Id на одговорот
editor-response-response = Одговор
editor-response-credit = Поени
editor-response-submitted = Испратен


## The context-help panel

help-placeholder = Поставете го покажувачот врз име на ознака, атрибут или { $ref } за документација.

help-unsupported-ref-chain = Помош за составени упатувања како { $example } сè уште не е поддржана.

help-unresolved-ref =
    { $reason ->
        [notFound] Не е пронајден објект за упатувањето: { $ref }.
        [multiple] Пронајдени се повеќе објекти за упатувањето: { $ref }.
       *[indeterminate] Објектот за { $ref } не можеше да се определи.
    }

help-learn-about-references = Дознајте повеќе за упатувањата →
help-reference-page = Страница од прирачникот →

help-suggestions-header =
    { $location ->
        [inside] Внатре во { $element }
       *[top] На највисоко ниво
    }{ $allowed ->
        [none] { " — тука не оди ништо." }
        [text] { " — тука може да напишете текст." }
        [text-and-components] { " — тука може да напишете текст или да пробате:" }
       *[components] { " — може да пробате:" }
    }

help-suggestions-footer = Притиснете { $shortcut } за да ги видите сите { $total } компоненти.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } е упатување на { $target }.
       *[other] { $ref } е упатување на { $target } (ред { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Воведено од { $owner } како { $role }.
       *[other] Воведено од { $owner } во редот { $line } како { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } е упатување на својството { $property } на { $element }.
       *[other] { $ref } е упатување на својството { $property } на { $element } (ред { $line }).
    }

help-kind-attribute = атрибут
help-kind-snippet = исечок
help-kind-array-entry = член на низа

help-default = Стандардна вредност:
help-active-default = Активна стандардна вредност:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Дозволени вредности (по една на член):
       *[other] Дозволени вредности:
    }

help-suggested-values = Предложени вредности:

help-inserts = Вметнува:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координати:
    }

help-type = Тип:

help-resolved-style = Добиен стил (styleNumber { $styleNumber }):

help-resolved-function-names = Добиени имиња на функции:
help-reset-list = Список за враќање за ова поле:
help-added-on-input = Додадено за ова поле:
help-removed-on-input = Отстрането за ова поле:

help-reset-overrides = { $reset } има предност пред { $additional } и { $removed }.
