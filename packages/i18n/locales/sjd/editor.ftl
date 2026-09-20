# Kildin Sami editor and language-server surfaces. Translated from
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
# Kildin Sami is a Sami language written in Cyrillic; `chrome.ftl` sets out
# what that means for this catalog, why it is the least certain of its group,
# and what its Cyrillic letters are.
#
# **Kildin counts in two categories here, `one` and `other`, and only two.**
# CLDR gives `sjd` no `two`, so every selection below writes two branches
# where `locales/se` and `locales/sms` write three. The language has a dual;
# the plural-rule data does not, so a `[two]` branch here would never be
# reached. A noun after a numeral stays in one form in any case, so the two
# branches of `editor-accessibility-label` differ in nothing but the number
# they print, and they are written out rather than collapsed so that a later
# correction to one of them need not be a correction to both.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Мāhцхэ
       *[update] Ōдтхэ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } вуэссьтэй
       *[other] { $word } вуэссьтэй { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Фильтр…
editor-variant-next = Вāльтэ пуэдтҍе вариант
editor-variant-previous = Вāльтэ оуддэль вариант


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Кāввнма WCAG AA доступность рӣккмуш. Кыррьк, штоб доступность отчёт { $action ->
            [close] кӣдтэ
           *[open] ва̄лльтэ
        }.
        [advisories] Кыррьк, штоб доступность отчёт { $action ->
            [close] кӣдтэ
           *[open] ва̄лльтэ
        }. WCAG AA рӣккмуж элль кāвн, но ля лāссь доступность ноаллэсэсс.
       *[clean] Кыррьк, штоб доступность отчёт { $action ->
            [close] кӣдтэ
           *[open] ва̄лльтэ
        }. Доступность вāйвмуж элль кāвн.
    }

editor-accessibility-label =
    { $status ->
        [violations] Кāввнма WCAG AA доступность рӣккмуш. Кāввнма { $count ->
            [one] { $count } WCAG AA рӣккмуш
           *[other] { $count } WCAG AA рӣккмуш
        }. Кыррьк, штоб доступность отчёт { $action ->
            [close] кӣдтэ
           *[open] ва̄лльтэ
        }.
        [advisories] WCAG AA рӣккмуж элль кāвн. Кāввнма { $count ->
            [one] { $count } лāссь доступность ноаллэсэсс
           *[other] { $count } лāссь доступность ноаллэсэсс
        }. Кыррьк, штоб доступность отчёт { $action ->
            [close] кӣдтэ
           *[open] ва̄лльтэ
        }.
       *[clean] WCAG AA рӣккмуж элль кāвн. Кыррьк, штоб доступность отчёт { $action ->
            [close] кӣдтэ
           *[open] ва̄лльтэ
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версия { $version }

editor-tab-help = Контекстэ вуэhкь
editor-tab-help-short = Контекст
editor-tab-errors = Пāстэй сāhь
editor-tab-warnings = Ва̄рртэмь
editor-tab-info = Тēдт
editor-tab-accessibility = Доступность
editor-tab-responses = Вӯлльктэм вāсьтэ

editor-tab-with-count = { $label }: { $count }

editor-options = Редактор настройка
editor-format-as-doenetml = Форматтэ DoenetML на̄лле
editor-format-as-xml = Форматтэ XML на̄лле


## The diagnostics panel

editor-diagnostic-line = Линия № { $line }

editor-no-errors = Пāстэй сāhь ей ля
editor-no-warnings = Ва̄рртэмь ей ля
editor-no-info = Тēдтсāhь ей ля

editor-show-info-annotations = Вуэссьтэ тēдтсāhь редакторэсьт
editor-show-accessibility-annotations = Вуэссьтэ доступность сāhь редакторэсьт

editor-accessibility-learn-more = Кӯhт Doenet рāботта доступностьэнҍ

editor-accessibility-violations-heading = Доступность рӣккмуж ({ $standard })

editor-accessibility-other-heading = Нӯббь доступность вāйвмуж
editor-none-found = Мӣ-ля элль кāвн


## Submitted responses

editor-no-responses = Вӯлльктэм вāсьтэ ель ля вӣль
editor-response-answer-id = Вāсьт Id
editor-response-response = Вāсьт
editor-response-credit = Ба̄лл
editor-response-submitted = Вӯлльктэм


## The context-help panel

help-placeholder = Пыййе курсор тег нэ̄мм, атрибут елле { $ref } а̄лл, штоб вуэссьтэ документация.

help-unsupported-ref-chain = Вуэhкь мāҏhа ча̄ссҍ ссылкаhь а̄лл, кӯhт { $example }, вӣль элль ля.

help-unresolved-ref =
    { $reason ->
        [notFound] Ссылка объект элль кāвн: { $ref }.
        [multiple] Ссылка мāҏhа объект кāввнма: { $ref }.
       *[indeterminate] { $ref } объект элль вуэйй мēрртэ.
    }

help-learn-about-references = Ēнас тēдт ссылкаhь а̄лл →
help-reference-page = Справочник лӣстт →

help-suggestions-header =
    { $location ->
        [inside] { $element } сӣзьн
       *[top] Па̄йй уровеньэсьт
    }{ $allowed ->
        [none] { " — тāсьт мӣ-ля ей пуэдт." }
        [text] { " — кыррьте тēкст тāсьт." }
        [text-and-components] { " — кыррьте тēкст тāсьт, елле пыррьте:" }
       *[components] { " — пыррьте:" }
    }

help-suggestions-footer = Тēдтэ { $shortcut }, штоб вуэссьтэ пугk { $total } компонент.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ля ссылка та̄ррьм: { $target }.
       *[other] { $ref } ля ссылка та̄ррьм: { $target } (линия { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } пыййе тэдт роль { $role } на̄лле.
       *[other] { $owner } пыййе тэдт { $line } линиесьт роль { $role } на̄лле.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ля ссылка { $element } свойства { $property } а̄лл.
       *[other] { $ref } ля ссылка { $element } свойства { $property } а̄лл (линия { $line }).
    }

help-kind-attribute = атрибут
help-kind-snippet = тēкстча̄ссҍ
help-kind-array-entry = массив ча̄ссҍ

help-default = Оудмēрр:
help-active-default = Рāботтэй оудмēрр:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Лōhкэм значенияhь (ыhт ча̄зя):
       *[other] Лōhкэм значенияhь:
    }

help-suggested-values = Ноаллэсэсс значенияhь:

help-inserts = Пыййе сӣзе:

help-coordinates =
    { $count ->
        [one] Координат:
       *[other] Координатэ:
    }

help-type = Тип:

help-resolved-style = Мēрртэм стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Мēрртэм функция нэ̄ммэ:
help-reset-list = Тэнн поля мāhцхэм лӣстт:
help-added-on-input = Тэнн поля лāссьтэм:
help-removed-on-input = Тэнн полясьт вāльтэм:

help-reset-overrides = { $reset } вуалльк { $additional } я { $removed } па̄йель.
