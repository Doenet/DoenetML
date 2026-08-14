# Erzya editor and language-server surfaces. Translated from
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
# Erzya counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Мекев велявтомс
       *[update] Одкстомтомс
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Ваныцянть { $word }
       *[other] Ваныцянть { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Кочкамо…
editor-variant-next = Сы вариантонть кочкамс
editor-variant-previous = Икелень вариантонть кочкамс


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA пачкодемань коламо муезь. Пачкодемань отчётонть { $action ->
            [close] пекстамга
           *[open] панжомга
        } лепштик.
        [advisories] Пачкодемань отчётонть { $action ->
            [close] пекстамга
           *[open] панжомга
        } лепштик. WCAG AA коламот эзть муеве, ансяк улить поладкс невтевкст.
       *[clean] Пачкодемань отчётонть { $action ->
            [close] пекстамга
           *[open] панжомга
        } лепштик. Пачкодемань кевкстемат эзть муеве.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA пачкодемань коламо муезь. { $count ->
            [one] { $count } WCAG AA коламо
           *[other] { $count } WCAG AA коламо
        } муезь. Пачкодемань отчётонть { $action ->
            [close] пекстамга
           *[open] панжомга
        } лепштик.
        [advisories] WCAG AA коламот эзть муеве. { $count ->
            [one] { $count } поладкс невтевкс
           *[other] { $count } поладкс невтевкс
        } муезь. Пачкодемань отчётонть { $action ->
            [close] пекстамга
           *[open] панжомга
        } лепштик.
       *[clean] WCAG AA коламот эзть муеве. Пачкодемань отчётонть { $action ->
            [close] пекстамга
           *[open] панжомга
        } лепштик.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версия { $version }

editor-tab-help = Контекстэнь лезкс
editor-tab-help-short = Контекст
editor-tab-errors = Ильведевкст
editor-tab-warnings = Икелев пелькстамот
editor-tab-info = Тевпаро
editor-tab-accessibility = Пачкодема
editor-tab-responses = Кучозь каршо валт

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторонь анокстамот
editor-format-as-doenetml = DoenetML ладсо форматировамс
editor-format-as-xml = XML ладсо форматировамс


## The diagnostics panel

editor-diagnostic-line = { $line }-це ряд

editor-no-errors = Ильведевкст арасть
editor-no-warnings = Икелев пелькстамот арасть
editor-no-info = Тевпаронь ёвтамот арасть

editor-show-info-annotations = Тевпаронь ёвтамотнень редакторсо невтемс
editor-show-accessibility-annotations = Пачкодемань ёвтамотнень редакторсо невтемс

editor-accessibility-learn-more = Doenet пачкодемантень кода вансты

editor-accessibility-violations-heading = Пачкодемань коламот ({ $standard })

editor-accessibility-other-heading = Лия пачкодемань кевкстемат
editor-none-found = Мезеяк эзь муеве


## Submitted responses

editor-no-responses = Течис кучозь каршо валт арасть
editor-response-answer-id = Каршо валонь Id
editor-response-response = Каршо вал
editor-response-credit = Балл
editor-response-submitted = Кучозь


## The context-help panel

help-placeholder = Документациянть неемга курсоронть путык тег лем лангс, атрибут лангс эли { $ref } лангс.

help-unsupported-ref-chain = { $example } ладсо ламо пельксэнь сюлмавкстнэнень лезкс зярс арась.

help-unresolved-ref =
    { $reason ->
        [notFound] Сюлмавксонтень объект эзь муеве: { $ref }.
        [multiple] Сюлмавксонтень ламо объект муезь: { $ref }.
       *[indeterminate] { $ref } объектэнть содамс эзь маштово.
    }

help-learn-about-references = Сюлмавкстнэде содамс →
help-reference-page = Невтемань лопа →

help-suggestions-header =
    { $location ->
        [inside] { $element } потсо
       *[top] Сехте верде
    }{ $allowed ->
        [none] { " — тесэ мезеяк а кельги." }
        [text] { " — тесэ текст сёрмадомс маштови." }
        [text-and-components] { " — тесэ текст сёрмадомс маштови, эли неть варчик:" }
       *[components] { " — неть варчемс маштови:" }
    }

help-suggestions-footer = Весе { $total } компонентэнть неемга { $shortcut } лепштик.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объект лангс сюлмавкс.
       *[other] { $ref } — { $target } объект лангс сюлмавкс ({ $line }-це ряд).
    }

help-ref-derived-from =
    { $line ->
        [none] Сонзэ { $owner } { $role } ладсо совавтызе.
       *[other] Сонзэ { $owner } { $line }-це рядсо { $role } ладсо совавтызе.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементэнь { $property } свойстванть лангс сюлмавкс.
       *[other] { $ref } — { $element } элементэнь { $property } свойстванть лангс сюлмавкс ({ $line }-це ряд).
    }

help-kind-attribute = атрибут
help-kind-snippet = пелькске
help-kind-array-entry = массивень элемент

help-default = Основной питне:
help-active-default = Неень основной питне:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Мерезь питнеть (эрьва элементэнтень вейке):
       *[other] Мерезь питнеть:
    }

help-suggested-values = Невтезь питнеть:

help-inserts = Полады:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатат:
    }

help-type = Лад:

help-resolved-style = Лисезь стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Лисезь функциянь лемть:
help-reset-list = Те таркань мекев велявтомань список:
help-added-on-input = Те таркасо поладозь:
help-removed-on-input = Те таркасто саезь:

help-reset-overrides = { $reset } — { $additional } ды { $removed } лангсо изни.
