# Serbian editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic and in the Ekavian standard.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Serbian counts in three plural categories, but only a message that prints the
# number beside a noun needs all three. `help-coordinates` never shows its count
# — it decides a heading's singular against its plural — so `one` and `*[other]`
# are the whole selection.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Поништи
       *[update] Освежи
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } прегледач
       *[other] { $word } прегледач { $shortcut }
    }


## The variant picker

editor-variant = Варијанта
editor-variant-filter = Филтер…
editor-variant-next = Изабери следећу варијанту
editor-variant-previous = Изабери претходну варијанту


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Утврђено је кршење приступачности према WCAG AA. Кликните да { $action ->
            [close] затворите
           *[open] отворите
        } извештај о приступачности.
        [advisories] Кликните да { $action ->
            [close] затворите
           *[open] отворите
        } извештај о приступачности. Нису пронађена кршења према WCAG AA, али постоје додатне препоруке о приступачности.
       *[clean] Кликните да { $action ->
            [close] затворите
           *[open] отворите
        } извештај о приступачности. Нису пронађени проблеми са приступачношћу.
    }

editor-accessibility-label =
    { $status ->
        [violations] Утврђено је кршење приступачности према WCAG AA. Пронађено је { $count ->
            [one] { $count } кршење према WCAG AA
            [few] { $count } кршења према WCAG AA
           *[other] { $count } кршења према WCAG AA
        }. Кликните да { $action ->
            [close] затворите
           *[open] отворите
        } извештај о приступачности.
        [advisories] Нису утврђена кршења према WCAG AA. Пронађена је { $count ->
            [one] { $count } додатна препорука о приступачности
            [few] { $count } додатне препоруке о приступачности
           *[other] { $count } додатних препорука о приступачности
        }. Кликните да { $action ->
            [close] затворите
           *[open] отворите
        } извештај о приступачности.
       *[clean] Нису утврђена кршења према WCAG AA. Кликните да { $action ->
            [close] затворите
           *[open] отворите
        } извештај о приступачности.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Верзија { $version } DoenetML-а

editor-tab-help = Контекстна помоћ
editor-tab-help-short = Контекст
editor-tab-errors = Грешке
editor-tab-warnings = Упозорења
editor-tab-info = Информације
editor-tab-accessibility = Приступачност
editor-tab-responses = Послати одговори

editor-tab-with-count = { $label }: { $count }

editor-options = Подешавања уређивача
editor-format-as-doenetml = Обликуј као DoenetML
editor-format-as-xml = Обликуј као XML


## The diagnostics panel

editor-diagnostic-line = Ред бр. { $line }

editor-no-errors = Нема грешака
editor-no-warnings = Нема упозорења
editor-no-info = Нема информативних порука

editor-show-info-annotations = Приказуј информативне поруке у уређивачу
editor-show-accessibility-annotations = Приказуј поруке о приступачности у уређивачу

editor-accessibility-learn-more = Како Doenet приступа приступачности

editor-accessibility-violations-heading = Кршења приступачности ({ $standard })

editor-accessibility-other-heading = Остали проблеми са приступачношћу
editor-none-found = Ништа није пронађено


## Submitted responses

editor-no-responses = Још нема послатих одговора
editor-response-answer-id = Id одговора
editor-response-response = Одговор
editor-response-credit = Поени
editor-response-submitted = Послато


## The context-help panel

help-placeholder = Поставите показивач на име ознаке, атрибут или { $ref } за документацију.

help-unsupported-ref-chain = Помоћ за вишеделне упуте попут { $example } још није подржана.

help-unresolved-ref =
    { $reason ->
        [notFound] Није пронађен објекат за упуту: { $ref }.
        [multiple] Пронађено је више објеката за упуту: { $ref }.
       *[indeterminate] Објекат за { $ref } није могао да се одреди.
    }

help-learn-about-references = Сазнајте више о упутама →
help-reference-page = Страница приручника →

help-suggestions-header =
    { $location ->
        [inside] Унутар { $element }
       *[top] На највишем нивоу
    }{ $allowed ->
        [none] { " — овде не иде ништа." }
        [text] { " — овде можете уписати текст." }
        [text-and-components] { " — овде можете уписати текст или пробати:" }
       *[components] { " — можете пробати:" }
    }

help-suggestions-footer = Притисните { $shortcut } да видите свих { $total } компоненти.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } је упута на { $target }.
       *[other] { $ref } је упута на { $target } (ред { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Увео ју је { $owner } као { $role }.
       *[other] Увео ју је { $owner } у реду { $line } као { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } је упута на својство { $property } елемента { $element }.
       *[other] { $ref } је упута на својство { $property } елемента { $element } (ред { $line }).
    }

help-kind-attribute = атрибут
help-kind-snippet = исечак
help-kind-array-entry = члан низа

help-default = Подразумевана вредност:
help-active-default = Важећа подразумевана вредност:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Дозвољене вредности (по једна на члан):
       *[other] Дозвољене вредности:
    }

help-suggested-values = Предложене вредности:

help-inserts = Уметне:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координате:
    }

help-type = Тип:

help-resolved-style = Добијени стил (styleNumber { $styleNumber }):

help-resolved-function-names = Добијена имена функција:
help-reset-list = Списак за поништавање на овом пољу:
help-added-on-input = Додато на овом пољу:
help-removed-on-input = Уклоњено на овом пољу:

help-reset-overrides = { $reset } има предност над { $additional } и { $removed }.
