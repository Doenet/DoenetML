# Tuvan editor and language-server surfaces. Translated from
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
# Tuvan counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Дедир эгидер
       *[update] Чаартыр
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Көрүкчүнү { $word }
       *[other] Көрүкчүнү { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Шүүрээр…
editor-variant-next = Дараазында вариантыны шилиир
editor-variant-previous = Мурнунда вариантыны шилиир


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA ажыглаар аргазының үрелиишкини тывылган. Ажыглаар арга дугайында отчетту { $action ->
            [close] хаар
           *[open] ажар
        } дээш базыңар.
        [advisories] Ажыглаар арга дугайында отчетту { $action ->
            [close] хаар
           *[open] ажар
        } дээш базыңар. WCAG AA үрелиишкиннери тывылбаан, ынчалза-даа немелде сүмелер бар.
       *[clean] Ажыглаар арга дугайында отчетту { $action ->
            [close] хаар
           *[open] ажар
        } дээш базыңар. Ажыглаар арга айтырыглары тывылбаан.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA ажыглаар аргазының үрелиишкини тывылган. { $count ->
            [one] { $count } WCAG AA үрелиишкини
           *[other] { $count } WCAG AA үрелиишкини
        } тывылган. Ажыглаар арга дугайында отчетту { $action ->
            [close] хаар
           *[open] ажар
        } дээш базыңар.
        [advisories] WCAG AA үрелиишкиннери тывылбаан. { $count ->
            [one] { $count } немелде сүме
           *[other] { $count } немелде сүме
        } тывылган. Ажыглаар арга дугайында отчетту { $action ->
            [close] хаар
           *[open] ажар
        } дээш базыңар.
       *[clean] WCAG AA үрелиишкиннери тывылбаан. Ажыглаар арга дугайында отчетту { $action ->
            [close] хаар
           *[open] ажар
        } дээш базыңар.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML хевири { $version }

editor-tab-help = Контекст дузазы
editor-tab-help-short = Контекст
editor-tab-errors = Частырыглар
editor-tab-warnings = Сагындырыглар
editor-tab-info = Медээ
editor-tab-accessibility = Ажыглаар арга
editor-tab-responses = Чорудупкан харыылар

editor-tab-with-count = { $label }: { $count }

editor-options = Редактор тааржылгалары
editor-format-as-doenetml = DoenetML кылдыр форматтаар
editor-format-as-xml = XML кылдыр форматтаар


## The diagnostics panel

editor-diagnostic-line = { $line } дугаар одуруг

editor-no-errors = Частырыг чок
editor-no-warnings = Сагындырыг чок
editor-no-info = Медээ дыңнадыы чок

editor-show-info-annotations = Медээ дыңнадыгларын редакторда көргүзер
editor-show-accessibility-annotations = Ажыглаар арга дыңнадыгларын редакторда көргүзер

editor-accessibility-learn-more = Doenet ажыглаар аргага канчаар хамаарылгалыгыл

editor-accessibility-violations-heading = Ажыглаар арга үрелиишкиннери ({ $standard })

editor-accessibility-other-heading = Өске ажыглаар арга айтырыглары
editor-none-found = Чүү-даа тывылбаан


## Submitted responses

editor-no-responses = Ам дээрезинде чорудупкан харыы чок
editor-response-answer-id = Харыының Id-зи
editor-response-response = Харыы
editor-response-credit = Балл
editor-response-submitted = Чорудупкан


## The context-help panel

help-placeholder = Документацияны көөр дизе курсорну тег адынга, атрибутка азы { $ref } кырынга салыңар.

help-unsupported-ref-chain = { $example } дег хөй кезектиг шилчилгелерге дуза ам-даа чок.

help-unresolved-ref =
    { $reason ->
        [notFound] Шилчилгеге объект тывылбаан: { $ref }.
        [multiple] Шилчилгеге хөй объект тывылган: { $ref }.
       *[indeterminate] { $ref } объектизин тодарадып шыдаваан.
    }

help-learn-about-references = Шилчилгелер дугайында билип алыр →
help-reference-page = Айтыкчы арын →

help-suggestions-header =
    { $location ->
        [inside] { $element } иштинде
       *[top] Дээди деңнелде
    }{ $allowed ->
        [none] { " — мында чүү-даа таарышпас." }
        [text] { " — мында текст бижип болур." }
        [text-and-components] { " — мында текст бижип болур, азы боларны оралдажып көрүңер:" }
       *[components] { " — боларны оралдажып көрүп болур:" }
    }

help-suggestions-footer = Шупту { $total } компонентини көөр дизе { $shortcut } базыңар.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объектиже шилчилге.
       *[other] { $ref } — { $target } объектиже шилчилге ({ $line } дугаар одуруг).
    }

help-ref-derived-from =
    { $line ->
        [none] Ону { $owner } { $role } кылдыр киирген.
       *[other] Ону { $owner } { $line } дугаар одуругда { $role } кылдыр киирген.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементиниң { $property } шынарынче шилчилге.
       *[other] { $ref } — { $element } элементиниң { $property } шынарынче шилчилге ({ $line } дугаар одуруг).
    }

help-kind-attribute = атрибут
help-kind-snippet = кезек
help-kind-array-entry = массив элементизи

help-default = Кол утказы:
help-active-default = Амгы кол утказы:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Чөпшээрээн утказы (кажан-даа элемент бүрүзүнге бирээ):
       *[other] Чөпшээрээн утказы:
    }

help-suggested-values = Сүмелээн утказы:

help-inserts = Немээр:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координаталар:
    }

help-type = Хевири:

help-resolved-style = Үнген стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Үнген функция аттары:
help-reset-list = Бо шөлдүң дедир эгидер даңзызы:
help-added-on-input = Бо шөлге немешкени:
help-removed-on-input = Бо шөлден ужулдурганы:

help-reset-overrides = { $reset } — { $additional } биле { $removed } кырындан ажыглаттынар.
