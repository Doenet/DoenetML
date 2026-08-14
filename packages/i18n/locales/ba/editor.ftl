# Bashkir editor and language-server surfaces. Translated from
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
# Bashkir counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Кире ҡайтарыу
       *[update] Яңыртыу
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Ҡарағысты { $word }
       *[other] Ҡарағысты { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Һөҙөү…
editor-variant-next = Киләһе вариантты һайлау
editor-variant-previous = Алдағы вариантты һайлау


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA ҡулайлылыҡ боҙоуы табылды. Ҡулайлылыҡ хисабын { $action ->
            [close] ябыу
           *[open] асыу
        } өсөн баҫығыҙ.
        [advisories] Ҡулайлылыҡ хисабын { $action ->
            [close] ябыу
           *[open] асыу
        } өсөн баҫығыҙ. WCAG AA боҙоуҙары табылманы, әммә өҫтәмә ҡулайлылыҡ тәҡдимдәре бар.
       *[clean] Ҡулайлылыҡ хисабын { $action ->
            [close] ябыу
           *[open] асыу
        } өсөн баҫығыҙ. Ҡулайлылыҡ мәсьәләләре табылманы.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA ҡулайлылыҡ боҙоуы табылды. { $count ->
            [one] { $count } WCAG AA боҙоуы
           *[other] { $count } WCAG AA боҙоуы
        } табылды. Ҡулайлылыҡ хисабын { $action ->
            [close] ябыу
           *[open] асыу
        } өсөн баҫығыҙ.
        [advisories] WCAG AA боҙоуҙары табылманы. { $count ->
            [one] { $count } өҫтәмә ҡулайлылыҡ тәҡдиме
           *[other] { $count } өҫтәмә ҡулайлылыҡ тәҡдиме
        } табылды. Ҡулайлылыҡ хисабын { $action ->
            [close] ябыу
           *[open] асыу
        } өсөн баҫығыҙ.
       *[clean] WCAG AA боҙоуҙары табылманы. Ҡулайлылыҡ хисабын { $action ->
            [close] ябыу
           *[open] асыу
        } өсөн баҫығыҙ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версияһы { $version }

editor-tab-help = Контекст ярҙамы
editor-tab-help-short = Контекст
editor-tab-errors = Хаталар
editor-tab-warnings = Иҫкәртеүҙәр
editor-tab-info = Мәғлүмәт
editor-tab-accessibility = Ҡулайлылыҡ
editor-tab-responses = Ебәрелгән яуаптар

editor-tab-with-count = { $label }: { $count }

editor-options = Мөхәррир көйләүҙәре
editor-format-as-doenetml = DoenetML булараҡ форматлау
editor-format-as-xml = XML булараҡ форматлау


## The diagnostics panel

editor-diagnostic-line = Юл №{ $line }

editor-no-errors = Хаталар юҡ
editor-no-warnings = Иҫкәртеүҙәр юҡ
editor-no-info = Мәғлүмәти хәбәрҙәр юҡ

editor-show-info-annotations = Мәғлүмәти хәбәрҙәрҙе мөхәррирҙә күрһәтеү
editor-show-accessibility-annotations = Ҡулайлылыҡ хәбәрҙәрен мөхәррирҙә күрһәтеү

editor-accessibility-learn-more = Doenet ҡулайлылыҡҡа нисек ҡарай

editor-accessibility-violations-heading = Ҡулайлылыҡ боҙоуҙары ({ $standard })

editor-accessibility-other-heading = Башҡа ҡулайлылыҡ мәсьәләләре
editor-none-found = Бер нәмә лә табылманы


## Submitted responses

editor-no-responses = Әлегә ебәрелгән яуаптар юҡ
editor-response-answer-id = Яуаптың Id-ы
editor-response-response = Яуап
editor-response-credit = Балл
editor-response-submitted = Ебәрелде


## The context-help panel

help-placeholder = Документацияны күреү өсөн курсорҙы тег исеменә, атрибутҡа йәки { $ref } өҫтөнә ҡуйығыҙ.

help-unsupported-ref-chain = { $example } кеүек күп өлөшлө һылтанмалар өсөн ярҙам әлегә ҡаралмаған.

help-unresolved-ref =
    { $reason ->
        [notFound] Һылтанма өсөн объект табылманы: { $ref }.
        [multiple] Һылтанма өсөн бер нисә объект табылды: { $ref }.
       *[indeterminate] { $ref } өсөн объектты билдәләп булманы.
    }

help-learn-about-references = Һылтанмалар тураһында белеү →
help-reference-page = Белешмә бите →

help-suggestions-header =
    { $location ->
        [inside] { $element } эсендә
       *[top] Юғары кимәлдә
    }{ $allowed ->
        [none] { " — бында бер нәмә лә һыймай." }
        [text] { " — бында текст яҙып була." }
        [text-and-components] { " — бында текст яҙып була, йәки быларҙы һынап ҡарағыҙ:" }
       *[components] { " — быларҙы һынап ҡарап була:" }
    }

help-suggestions-footer = Бөтә { $total } компонентты күреү өсөн { $shortcut } баҫығыҙ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объектына һылтанма.
       *[other] { $ref } — { $target } объектына һылтанма (юл { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Уны { $owner } { $role } булараҡ индергән.
       *[other] Уны { $owner } { $line } юлында { $role } булараҡ индергән.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементының { $property } үҙенсәлегенә һылтанма.
       *[other] { $ref } — { $element } элементының { $property } үҙенсәлегенә һылтанма (юл { $line }).
    }

help-kind-attribute = атрибут
help-kind-snippet = өҙөк
help-kind-array-entry = массив элементы

help-default = Килешеү буйынса ҡиммәт:
help-active-default = Ғәмәлдәге килешеү буйынса ҡиммәт:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Рөхсәт ителгән ҡиммәттәр (һәр элементҡа береһе):
       *[other] Рөхсәт ителгән ҡиммәттәр:
    }

help-suggested-values = Тәҡдим ителгән ҡиммәттәр:

help-inserts = Өҫтәй:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координаталар:
    }

help-type = Төр:

help-resolved-style = Алынған стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Алынған функция исемдәре:
help-reset-list = Был ҡырҙың кире ҡайтарыу исемлеге:
help-added-on-input = Был ҡырҙа өҫтәлгәндәр:
help-removed-on-input = Был ҡырҙан алып ташланғандар:

help-reset-overrides = { $reset } — { $additional } һәм { $removed } өҫтөнән өҫтөнлөклө.
