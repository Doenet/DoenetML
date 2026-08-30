# Rusyn (русиньскый язык) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Prešov (Pryashiv) codification in Cyrillic, with «ы»,
# «ї», «ё» and the soft sign «ь» as letters; see `chrome.ftl` for the full
# note, for why this file writes one codification rather than mixing the
# Slovak, Polish (Lemko) and Transcarpathian norms, and for the words — «што»,
# «лем», «кідь», «вецей», «тот», «жебы» — that keep it from being edited toward
# Ukrainian or Slovak. Rusyn is a language of its own, not a variety of either.
#
# **Direction.** Left to right; `direction.ts` needs no entry for `rue`.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# **Number.** CLDR has no plural rules for `rue`, so no `zero`, `two`, `few` or
# `many` branch appears anywhere: nothing could select one, and Rusyn's real
# `few`/`many` split — «два боды» against «пять бодів» — is exactly the thing
# that would then be got wrong. Every symbolic selector — `$action`,
# `$status`, `$shortcut`, `$reason`, `$location`, `$allowed`, `$line`,
# `$perItem` — is kept byte for byte from English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Вернути
       *[update] Обновити
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } переглядач
       *[other] { $word } переглядач { $shortcut }
    }


## The variant picker

editor-variant = Варіант
editor-variant-filter = Філтер…
editor-variant-next = Выбрати наступный варіант
editor-variant-previous = Выбрати попереднїй варіант


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Найдене порушіня приступности WCAG AA. Клікнийте, жебы { $action ->
            [close] заперти
           *[open] отворити
        } рапорт о приступности.
        [advisories] Клікнийте, жебы { $action ->
            [close] заперти
           *[open] отворити
        } рапорт о приступности. Жадны порушіня WCAG AA ся не нашли, айбо суть далшы поради о приступности.
       *[clean] Клікнийте, жебы { $action ->
            [close] заперти
           *[open] отворити
        } рапорт о приступности. Жадны проблемы з приступностёв ся не нашли.
    }

editor-accessibility-label =
    { $status ->
        [violations] Найдене порушіня приступности WCAG AA. Найдено { $count } порушінь WCAG AA. Клікнийте, жебы { $action ->
            [close] заперти
           *[open] отворити
        } рапорт о приступности.
        [advisories] Жадны порушіня WCAG AA ся не нашли. Найдено { $count } далшых порад о приступности. Клікнийте, жебы { $action ->
            [close] заперти
           *[open] отворити
        } рапорт о приступности.
       *[clean] Жадны порушіня WCAG AA ся не нашли. Клікнийте, жебы { $action ->
            [close] заперти
           *[open] отворити
        } рапорт о приступности.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Верзія DoenetML { $version }

editor-tab-help = Поміч про тото місце
editor-tab-help-short = Контекст
editor-tab-errors = Хыбы
editor-tab-warnings = Варованя
editor-tab-info = Інформації
editor-tab-accessibility = Приступность
editor-tab-responses = Послаты одповідї

editor-tab-with-count = { $label }: { $count }

editor-options = Наставлїня едітора
editor-format-as-doenetml = Форматовати як DoenetML
editor-format-as-xml = Форматовати як XML


## The diagnostics panel

editor-diagnostic-line = Рядок #{ $line }

editor-no-errors = Жадны хыбы
editor-no-warnings = Жадны варованя
editor-no-info = Жадны інформації

editor-show-info-annotations = Указати інформації в едіторї
editor-show-accessibility-annotations = Указати варованя о приступности в едіторї

editor-accessibility-learn-more = Научте ся, як Doenet приступать ку приступности

editor-accessibility-violations-heading = Порушіня приступности ({ $standard })

editor-accessibility-other-heading = Другы проблемы з приступностёв
editor-none-found = Нич ся не нашло


## Submitted responses

editor-no-responses = Іщі жадны послаты одповідї
editor-response-answer-id = Id одповідї
editor-response-response = Одповідь
editor-response-credit = Боды
editor-response-submitted = Послане


## The context-help panel

help-placeholder = Поставте курзор на назву таґу, на атрібут або на { $ref }, жебы видїти документацію.

help-unsupported-ref-chain = Поміч про вецейчастны одкликы як { $example } іщі не є підпорована.

help-unresolved-ref =
    { $reason ->
        [notFound] Про одклик { $ref } ся не найшов жаден референт.
        [multiple] Про одклик { $ref } ся найшло вецей референтів.
       *[indeterminate] Референт про { $ref } ся не дав опредїлити.
    }

help-learn-about-references = Научте ся о одкликах →
help-reference-page = Сторінка одкликів →

help-suggestions-header =
    { $location ->
        [inside] В { $element }
       *[top] На найвысшій уровни
    }{ $allowed ->
        [none] { " — сюды не йде нич." }
        [text] { " — пиште сюды текст." }
        [text-and-components] { " — пиште сюды текст, або спробуйте:" }
       *[components] { " — на спробованя:" }
    }

help-suggestions-footer = Стисніть { $shortcut }, жебы видїти вшыткы компоненты ({ $total }).

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } є одклик на { $target }.
       *[other] { $ref } є одклик на { $target } (рядок { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Заведене компонентом { $owner } як { $role }.
       *[other] Заведене компонентом { $owner } на рядку { $line } як { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } є одклик на властность { $property } компонента { $element }.
       *[other] { $ref } є одклик на властность { $property } компонента { $element } (рядок { $line }).
    }

help-kind-attribute = атрібут
help-kind-snippet = кусок кода
help-kind-array-entry = запис поля

help-default = Выходне:
help-active-default = Актівне выходне:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Дозволены годноты (єдна на елемент):
       *[other] Дозволены годноты:
    }

help-suggested-values = Наврхнуты годноты:

help-inserts = Вкладать:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координаты:
    }

help-type = Тіп:

help-resolved-style = Вырахованый штіл (styleNumber { $styleNumber }):

help-resolved-function-names = Вырахованы назвы функцій:
help-reset-list = Список вернутя на тім вступі:
help-added-on-input = Придане на тім вступі:
help-removed-on-input = Одобране з того вступу:

help-reset-overrides = { $reset } перекрывать { $additional } а { $removed }.
