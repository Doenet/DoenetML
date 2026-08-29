# Mansi editor and language-server surfaces. Translated from
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
# `mns` is Mansi (мāньси лāтыӈ), Ob-Ugric, written here towards the Sosva
# (Northern) literary norm. See `content.ftl`'s header for the norm, for the
# Hungarian non-relationship, and for the list of coinages — this file leans on
# them as hard as any: nothing in an editor's footer or a language server's
# context help has ever been written in Mansi, so **most of the vocabulary
# below is coined rather than attested**, and a speaker should treat it as a
# first proposal rather than a translation.
#
# Mansi counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ювле
       *[update] Йильпиг вāруӈкве
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Сунсын пēлы { $word }
       *[other] Сунсын пēлы { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Уртнэ вāрмаль…
editor-variant-next = Ēлаль вариант уртуӈкве
editor-variant-previous = Ювле вариант уртуӈкве


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA ёхтуӈкве рōвнэ вāрмаль сакватам хōнтвēс. Ёхтуӈкве рōвнэ вāрмаль отчёт { $action ->
            [close] пантуӈкве
           *[open] пӯнсуӈкве
        } щёлката.
        [advisories] Ёхтуӈкве рōвнэ вāрмаль отчёт { $action ->
            [close] пантуӈкве
           *[open] пӯнсуӈкве
        } щёлката. WCAG AA сакватамыт ат хōнтвēсыт, но мōт нётнэ лāтыӈыт ōлēгыт.
       *[clean] Ёхтуӈкве рōвнэ вāрмаль отчёт { $action ->
            [close] пантуӈкве
           *[open] пӯнсуӈкве
        } щёлката. Ёхтуӈкве рōвнэ вāрмаль урыл китыглан лāтыӈыт ат хōнтвēсыт.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA ёхтуӈкве рōвнэ вāрмаль сакватам хōнтвēс. { $count ->
            [one] { $count } WCAG AA сакватам
           *[other] { $count } WCAG AA сакватам
        } хōнтвēс. Ёхтуӈкве рōвнэ вāрмаль отчёт { $action ->
            [close] пантуӈкве
           *[open] пӯнсуӈкве
        } щёлката.
        [advisories] WCAG AA сакватамыт ат хōнтвēсыт. { $count ->
            [one] { $count } нётнэ лāтыӈ
           *[other] { $count } нётнэ лāтыӈ
        } хōнтвēс. Ёхтуӈкве рōвнэ вāрмаль отчёт { $action ->
            [close] пантуӈкве
           *[open] пӯнсуӈкве
        } щёлката.
       *[clean] WCAG AA сакватамыт ат хōнтвēсыт. Ёхтуӈкве рōвнэ вāрмаль отчёт { $action ->
            [close] пантуӈкве
           *[open] пӯнсуӈкве
        } щёлката.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версия { $version }

editor-tab-help = Кӯтюв нётнэ вāрмаль
editor-tab-help-short = Кӯтюв
editor-tab-errors = Ошибкат
editor-tab-warnings = Ӯргалан лāтыӈыт
editor-tab-info = Нōмт
editor-tab-accessibility = Ёхтуӈкве рōвнэ вāрмаль
editor-tab-responses = Кēтым ювле лāтыӈыт

editor-tab-with-count = { $label }: { $count }

editor-options = Редактор лēщатан вāрмалит
editor-format-as-doenetml = DoenetML сырыл лēщатаӈкве
editor-format-as-xml = XML сырыл лēщатаӈкве


## The diagnostics panel

editor-diagnostic-line = { $line } строка

editor-no-errors = Ошибка ат ōлы
editor-no-warnings = Ӯргалан лāтыӈ ат ōлы
editor-no-info = Нōмт лāтыӈ ат ōлы

editor-show-info-annotations = Нōмт лāтыӈыт редактор кӣвырт нāӈктаӈкве
editor-show-accessibility-annotations = Ёхтуӈкве рōвнэ вāрмаль лāтыӈыт редактор кӣвырт нāӈктаӈкве

editor-accessibility-learn-more = Doenet ёхтуӈкве рōвнэ вāрмаль хумус сунсы →

editor-accessibility-violations-heading = Ёхтуӈкве рōвнэ вāрмаль сакватамыт ({ $standard })

editor-accessibility-other-heading = Мōт ёхтуӈкве рōвнэ вāрмаль китыглан лāтыӈыт
editor-none-found = Нēматыр ат хōнтвēс


## Submitted responses

editor-no-responses = Ань кēтым ювле лāтыӈ ат ōлы
editor-response-answer-id = Ювле лāтыӈ Id
editor-response-response = Ювле лāтыӈ
editor-response-credit = Балл
editor-response-submitted = Кēтвēс


## The context-help panel

help-placeholder = Документация сунсуӈкве мāгыс курсор тег нам тāрмыл, атрибут тāрмыл манос { $ref } тāрмыл пинэн.

help-unsupported-ref-chain = { $example } сыр сав пēлыпыг ёт-паттым вāрмаль мāгыс нётнэ вāрмаль ань ат ōлы.

help-unresolved-ref =
    { $reason ->
        [notFound] Ёт-паттым вāрмаль ат хōнтвēс: { $ref }.
        [multiple] Ёт-паттым сав вāрмаль хōнтвēс: { $ref }.
       *[indeterminate] { $ref } вāрмаль ат пāсыстувēс.
    }

help-learn-about-references = Ёт-паттым вāрмалит урыл ханисьтахтуӈкве →
help-reference-page = Справка страница →

help-suggestions-header =
    { $location ->
        [inside] { $element } кӣвырт
       *[top] Сяр нуми тāгылт
    }{ $allowed ->
        [none] { " — тыт нēматыр ат рōви." }
        [text] { " — тыт текст хансуӈкве рōви." }
        [text-and-components] { " — тыт текст хансуӈкве рōви, манос тынаныл сунсэн:" }
       *[components] { " — тынаныл сунсэн:" }
    }

help-suggestions-footer = Пуссын { $total } компонент сунсуӈкве мāгыс { $shortcut } щёлката.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } вāрмаль палт ёт-паттым.
       *[other] { $ref } — { $target } вāрмаль палт ёт-паттым ({ $line } строка).
    }

help-ref-derived-from =
    { $line ->
        [none] Тав { $owner } { $role } сырыл пинвēс.
       *[other] Тав { $owner } { $line } строкат { $role } сырыл пинвēс.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элемент { $property } вāрмаль палт ёт-паттым.
       *[other] { $ref } — { $element } элемент { $property } вāрмаль палт ёт-паттым ({ $line } строка).
    }

help-kind-attribute = атрибут
help-kind-snippet = пēлы
help-kind-array-entry = массив элемент

help-default = Овыл вāрмаль:
help-active-default = Ань овыл вāрмаль:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Рōвнэ вāрмалит (касыӈ элемент мāгыс аква):
       *[other] Рōвнэ вāрмалит:
    }

help-suggested-values = Мим вāрмалит:

help-inserts = Пины:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатат:
    }

help-type = Сыр:

help-resolved-style = Нēглум стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Нēглум функция намыт:
help-reset-list = Ты пēлы ювле вāрнэ списка:
help-added-on-input = Ты пēлы палт пинвēс:
help-removed-on-input = Ты пēлы ныл кон вувēс:

help-reset-overrides = { $reset } — { $additional } ос { $removed } тāрмыл ōлы.
