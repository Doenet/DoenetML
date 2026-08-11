# Kalmyk editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Read the confidence note at the top of `content.ftl` before this file.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Хәрүлх
       *[update] Шинрүлх
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Үзгчиг { $word }
       *[other] Үзгчиг { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Шүүвр…
editor-variant-next = Дару вариант суңһх
editor-variant-previous = Өмнк вариант суңһх


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA күрх аргин эвдлт олгдв. Күрх аргин элгц { $action ->
            [close] хаах
           *[open] секх
        } гиҗ даргтн.
        [advisories] Күрх аргин элгц { $action ->
            [close] хаах
           *[open] секх
        } гиҗ даргтн. WCAG AA эвдлтс олгдсн уга, болв немр селвгүд бәәнә.
       *[clean] Күрх аргин элгц { $action ->
            [close] хаах
           *[open] секх
        } гиҗ даргтн. Күрх аргин сурврмуд олгдсн уга.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA күрх аргин эвдлт олгдв. { $count ->
            [one] { $count } WCAG AA эвдлт
           *[other] { $count } WCAG AA эвдлт
        } олгдв. Күрх аргин элгц { $action ->
            [close] хаах
           *[open] секх
        } гиҗ даргтн.
        [advisories] WCAG AA эвдлтс олгдсн уга. { $count ->
            [one] { $count } немр селвг
           *[other] { $count } немр селвг
        } олгдв. Күрх аргин элгц { $action ->
            [close] хаах
           *[open] секх
        } гиҗ даргтн.
       *[clean] WCAG AA эвдлтс олгдсн уга. Күрх аргин элгц { $action ->
            [close] хаах
           *[open] секх
        } гиҗ даргтн.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-ин хүврлт { $version }

editor-tab-help = Контекстин дөң
editor-tab-help-short = Контекст
editor-tab-errors = Эндүс
editor-tab-warnings = Селвгүд
editor-tab-info = Медәлл
editor-tab-accessibility = Күрх арг
editor-tab-responses = Илгәгдсн хәрүс

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторин таарулһс
editor-format-as-doenetml = DoenetML болҗ форматлх
editor-format-as-xml = XML болҗ форматлх


## The diagnostics panel

editor-diagnostic-line = { $line }-ч мөр

editor-no-errors = Эндү уга
editor-no-warnings = Селвг уга
editor-no-info = Медәллин зәңг уга

editor-show-info-annotations = Медәллин зәңгүдиг редактор деер үзүлх
editor-show-accessibility-annotations = Күрх аргин зәңгүдиг редактор деер үзүлх

editor-accessibility-learn-more = Doenet күрх аргд яһҗ хандна

editor-accessibility-violations-heading = Күрх аргин эвдлтс ({ $standard })

editor-accessibility-other-heading = Талдан күрх аргин сурврмуд
editor-none-found = Юмн олгдсн уга


## Submitted responses

editor-no-responses = Оддг цаг илгәгдсн хәрү уга
editor-response-answer-id = Хәрүһин Id
editor-response-response = Хәрү
editor-response-credit = Балл
editor-response-submitted = Илгәгдв


## The context-help panel

help-placeholder = Документац үзхин төлә курсориг тег нердән, атрибут деер эсвл { $ref } деер тәвтн.

help-unsupported-ref-chain = { $example } мет олн хүвтә заавр деер дөң оддг цаг уга.

help-unresolved-ref =
    { $reason ->
        [notFound] Заавр деер объект олгдсн уга: { $ref }.
        [multiple] Заавр деер кесг объект олгдв: { $ref }.
       *[indeterminate] { $ref } объектиг тодрхлҗ чадсн уга.
    }

help-learn-about-references = Заавриг тускар медх →
help-reference-page = Лавлврин халхц →

help-suggestions-header =
    { $location ->
        [inside] { $element } дотр
       *[top] Деед кемҗәнд
    }{ $allowed ->
        [none] { " — эндр юмн багтхш." }
        [text] { " — эндр текст бичҗ болхмн." }
        [text-and-components] { " — эндр текст бичҗ болхмн, эсвл эднг эрлһҗ үзтн:" }
       *[components] { " — эднг эрлһҗ үзҗ болхмн:" }
    }

help-suggestions-footer = Цуг { $total } компонент үзхин төлә { $shortcut } даргтн.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объект деер заавр.
       *[other] { $ref } — { $target } объект деер заавр ({ $line }-ч мөр).
    }

help-ref-derived-from =
    { $line ->
        [none] Үүг { $owner } { $role } болһҗ орулв.
       *[other] Үүг { $owner } { $line }-ч мөрт { $role } болһҗ орулв.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементин { $property } чинр деер заавр.
       *[other] { $ref } — { $element } элементин { $property } чинр деер заавр ({ $line }-ч мөр).
    }

help-kind-attribute = атрибут
help-kind-snippet = хәәрцг
help-kind-array-entry = массивин элемент

help-default = Ул утх:
help-active-default = Оддг ул утх:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Зөвшәргдсн утхс (элемент болһнд негн):
       *[other] Зөвшәргдсн утхс:
    }

help-suggested-values = Селвгләгдсн утхс:

help-inserts = Немнә:

help-coordinates =
    { $count ->
        [one] Координат:
       *[other] Координатс:
    }

help-type = Зүсн:

help-resolved-style = Һарсн стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Һарсн функцин нерд:
help-reset-list = Эн һазрин хәрүлһнә списк:
help-added-on-input = Эн һазрт немгдсн:
help-removed-on-input = Эн һазрас уга кегдсн:

help-reset-overrides = { $reset } — { $additional } болн { $removed } деерәс дәәвлнә.
