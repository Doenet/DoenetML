# Sakha (Yakut) editor and language-server surfaces. Translated from
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
# Sakha resolves exactly one plural category, so every counted message here is
# written flat — see the note at the top of `chrome.ftl`. `help-coordinates`
# and the two accessibility labels are where that shows.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Төннөр
       *[update] Саҥырт
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Көрөөччүнү { $word }
       *[other] Көрөөччүнү { $word } { $shortcut }
    }


## The variant picker

editor-variant = Барыйаан
editor-variant-filter = Талан ыл…
editor-variant-next = Аныгыскы барыйааны тал
editor-variant-previous = Иннинээҕи барыйааны тал


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA туттуллар кыаҕын кэһиитэ булулунна. Туттуллар кыах отчуотун { $action ->
            [close] сабар
           *[open] аһар
        } туһугар баттаа.
        [advisories] Туттуллар кыах отчуотун { $action ->
            [close] сабар
           *[open] аһар
        } туһугар баттаа. WCAG AA кэһиитэ булулунна суох, ол эрээри эбии сүбэлэр бааллар.
       *[clean] Туттуллар кыах отчуотун { $action ->
            [close] сабар
           *[open] аһар
        } туһугар баттаа. Туттуллар кыах кыһалҕалара булуллубата.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA туттуллар кыаҕын кэһиитэ булулунна. { $count } WCAG AA кэһиитэ булулунна. Туттуллар кыах отчуотун { $action ->
            [close] сабар
           *[open] аһар
        } туһугар баттаа.
        [advisories] WCAG AA кэһиитэ булуллубата. { $count } эбии сүбэ булулунна. Туттуллар кыах отчуотун { $action ->
            [close] сабар
           *[open] аһар
        } туһугар баттаа.
       *[clean] WCAG AA кэһиитэ булуллубата. Туттуллар кыах отчуотун { $action ->
            [close] сабар
           *[open] аһар
        } туһугар баттаа.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML барыла { $version }

editor-tab-help = Контекс көмөтө
editor-tab-help-short = Контекс
editor-tab-errors = Алҕастар
editor-tab-warnings = Сэрэтиилэр
editor-tab-info = Информация
editor-tab-accessibility = Туттуллар кыах
editor-tab-responses = Ыытыллыбыт хоруйдар

editor-tab-with-count = { $label }: { $count }

editor-options = Редактор туруоруулара
editor-format-as-doenetml = DoenetML курдук формалаа
editor-format-as-xml = XML курдук формалаа


## The diagnostics panel

editor-diagnostic-line = { $line } строка

editor-no-errors = Алҕас суох
editor-no-warnings = Сэрэтии суох
editor-no-info = Информация биллэриитэ суох

editor-show-info-annotations = Информация биллэриилэрин редактордаах көрдөр
editor-show-accessibility-annotations = Туттуллар кыах биллэриилэрин редактордаах көрдөр

editor-accessibility-learn-more = Doenet туттуллар кыахха хайдах сыһыаннааҕый

editor-accessibility-violations-heading = Туттуллар кыах кэһиилэрэ ({ $standard })

editor-accessibility-other-heading = Атын туттуллар кыах кыһалҕалара
editor-none-found = Туох да булуллубата


## Submitted responses

editor-no-responses = Билиҥҥэ ыытыллыбыт хоруй суох
editor-response-answer-id = Хоруй Id-та
editor-response-response = Хоруй
editor-response-credit = Баал
editor-response-submitted = Ыытыллыбыта


## The context-help panel

help-placeholder = Дьокумуонтаассыйаны көрөр туһугар курсору тиэг аатыгар, атрибукка эбэтэр { $ref } үрдүгэр туруор.

help-unsupported-ref-chain = { $example } курдук элбэх чаастаах ыйыылар көмөлөрө өссө суох.

help-unresolved-ref =
    { $reason ->
        [notFound] Ыйыыга объект булуллубата: { $ref }.
        [multiple] Ыйыыга хас да объект булулунна: { $ref }.
       *[indeterminate] { $ref } объегын быһаарар кыах суох.
    }

help-learn-about-references = Ыйыылар туһунан бил →
help-reference-page = Ыйынньык сирэйэ →

help-suggestions-header =
    { $location ->
        [inside] { $element } иһигэр
       *[top] Үрдүкү таһымҥа
    }{ $allowed ->
        [none] { " — манна туох да батпат." }
        [text] { " — манна тиэкис суруйуохха сөп." }
        [text-and-components] { " — манна тиэкис суруйуохха сөп, эбэтэр буларын боруобалаа:" }
       *[components] { " — буларын боруобалыахха сөп:" }
    }

help-suggestions-footer = Бүтүн { $total } компонены көрөр туһугар { $shortcut } баттаа.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объекка ыйыы.
       *[other] { $ref } — { $target } объекка ыйыы ({ $line } строка).
    }

help-ref-derived-from =
    { $line ->
        [none] Маны { $owner } { $role } быһыытынан киллэрбит.
       *[other] Маны { $owner } { $line } строкаҕа { $role } быһыытынан киллэрбит.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элеменнэ { $property } бэлиэтигэр ыйыы.
       *[other] { $ref } — { $element } элеменнэ { $property } бэлиэтигэр ыйыы ({ $line } строка).
    }

help-kind-attribute = атрибут
help-kind-snippet = кэрчик
help-kind-array-entry = массив элемена

help-default = Сүрүн суолтата:
help-active-default = Билиҥҥи сүрүн суолтата:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Көҥүллэммит суолталар (биир элеменҥэ биир):
       *[other] Көҥүллэммит суолталар:
    }

help-suggested-values = Сүбэлэммит суолталар:

help-inserts = Эбэр:

help-coordinates = Координаталар:

help-type = Көрүҥэ:

help-resolved-style = Тахсыбыт истиил (styleNumber { $styleNumber }):

help-resolved-function-names = Тахсыбыт функция ааттара:
help-reset-list = Бу хонуу төннөрөр испииһэгэ:
help-added-on-input = Бу хонууга эбиллибиттэр:
help-removed-on-input = Бу хонууттан соруллубуттар:

help-reset-overrides = { $reset } — { $additional } уонна { $removed } үрдүнэн туттуллар.
