# Tajik editor and language-server surfaces. Translated from
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
# Tajik counts in the same two categories English does, so every selection below
# keeps both branches — though a noun after a numeral stays singular, so the two
# read alike.
#
# Case and izafat endings are written onto a value only where the value is an
# identifier — a Latin-script attribute, element or property name, which takes
# the same ending whatever it is — and they are hyphenated there, as Tajik
# hyphenates a suffix after Latin script. An author's own word
# is not welded to: `help-unresolved-ref` and `help-suggestions-footer` name
# what the value is and let it follow the clause, which is the README's "Name
# what the value is". A Cyrillic word this catalog wrote itself takes the
# ending unhyphenated, as in `editor-update-viewer-title`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Барқарор кардан
       *[update] Нав кардан
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word }и тамошобин
       *[other] { $word }и тамошобин { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Филтр…
editor-variant-next = Интихоби варианти навбатӣ
editor-variant-previous = Интихоби варианти қаблӣ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Вайронкунии дастрасии WCAG AA ошкор шуд. Барои { $action ->
            [close] пӯшидани
           *[open] кушодани
        } ҳисоботи дастрасӣ пахш кунед.
        [advisories] Барои { $action ->
            [close] пӯшидани
           *[open] кушодани
        } ҳисоботи дастрасӣ пахш кунед. Вайронкунии WCAG AA ёфт нашуд, вале тавсияҳои иловагии дастрасӣ мавҷуданд.
       *[clean] Барои { $action ->
            [close] пӯшидани
           *[open] кушодани
        } ҳисоботи дастрасӣ пахш кунед. Мушкилоти дастрасӣ ёфт нашуд.
    }

editor-accessibility-label =
    { $status ->
        [violations] Вайронкунии дастрасии WCAG AA ошкор шуд. { $count ->
            [one] { $count } вайронкунии WCAG AA
           *[other] { $count } вайронкунии WCAG AA
        } ёфт шуд. Барои { $action ->
            [close] пӯшидани
           *[open] кушодани
        } ҳисоботи дастрасӣ пахш кунед.
        [advisories] Вайронкунии WCAG AA ошкор нашуд. { $count ->
            [one] { $count } тавсияи иловагии дастрасӣ
           *[other] { $count } тавсияи иловагии дастрасӣ
        } ёфт шуд. Барои { $action ->
            [close] пӯшидани
           *[open] кушодани
        } ҳисоботи дастрасӣ пахш кунед.
       *[clean] Вайронкунии WCAG AA ошкор нашуд. Барои { $action ->
            [close] пӯшидани
           *[open] кушодани
        } ҳисоботи дастрасӣ пахш кунед.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Версияи DoenetML { $version }

editor-tab-help = Кӯмаки контекстӣ
editor-tab-help-short = Контекст
editor-tab-errors = Хатоҳо
editor-tab-warnings = Огоҳиҳо
editor-tab-info = Маълумот
editor-tab-accessibility = Дастрасӣ
editor-tab-responses = Ҷавобҳои фиристодашуда

editor-tab-with-count = { $label }: { $count }

editor-options = Танзимоти муҳаррир
editor-format-as-doenetml = Ҳамчун DoenetML шакл додан
editor-format-as-xml = Ҳамчун XML шакл додан


## The diagnostics panel

editor-diagnostic-line = Сатри №{ $line }

editor-no-errors = Хатоҳо нестанд
editor-no-warnings = Огоҳиҳо нестанд
editor-no-info = Огоҳиномаҳои маълумотӣ нестанд

editor-show-info-annotations = Нишон додани огоҳиномаҳои маълумотӣ дар муҳаррир
editor-show-accessibility-annotations = Нишон додани огоҳиномаҳои дастрасӣ дар муҳаррир

editor-accessibility-learn-more = Doenet ба дастрасӣ чӣ гуна муносибат мекунад

editor-accessibility-violations-heading = Вайронкуниҳои дастрасӣ ({ $standard })

editor-accessibility-other-heading = Дигар мушкилоти дастрасӣ
editor-none-found = Чизе ёфт нашуд


## Submitted responses

editor-no-responses = Ҳанӯз ҷавобҳои фиристодашуда нестанд
editor-response-answer-id = Id-и ҷавоб
editor-response-response = Ҷавоб
editor-response-credit = Хол
editor-response-submitted = Фиристода шуд


## The context-help panel

help-placeholder = Барои дидани ҳуҷҷатҳо курсорро ба номи тег, атрибут ё { $ref } гузоред.

help-unsupported-ref-chain = Кӯмак барои истинодҳои бисёрқисма мисли { $example } ҳанӯз дастгирӣ намешавад.

help-unresolved-ref =
    { $reason ->
        [notFound] Барои истинод объект ёфт нашуд: { $ref }.
        [multiple] Барои истинод якчанд объект ёфт шуд: { $ref }.
       *[indeterminate] Барои истинод объектро муайян кардан нашуд: { $ref }.
    }

help-learn-about-references = Дар бораи истинодҳо омӯзед →
help-reference-page = Саҳифаи маълумотнома →

help-suggestions-header =
    { $location ->
        [inside] Дар дохили { $element }
       *[top] Дар сатҳи болоӣ
    }{ $allowed ->
        [none] { " — ин ҷо чизе намеғунҷад." }
        [text] { " — ин ҷо матн навиштан мумкин аст." }
        [text-and-components] { " — ин ҷо матн навиштан мумкин аст ё инҳоро санҷед:" }
       *[components] { " — инҳоро санҷидан мумкин аст:" }
    }

help-suggestions-footer = Барои дидани ҳамаи { $total } ҷузъ ин тугмаҳоро пахш кунед: { $shortcut }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } истинод ба { $target } аст.
       *[other] { $ref } истинод ба { $target } аст (сатри { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } онро ҳамчун { $role } ворид кардааст.
       *[other] { $owner } онро дар сатри { $line } ҳамчун { $role } ворид кардааст.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } истинод ба хосияти { $property }-и { $element } аст.
       *[other] { $ref } истинод ба хосияти { $property }-и { $element } аст (сатри { $line }).
    }

help-kind-attribute = атрибут
help-kind-snippet = порча
help-kind-array-entry = унсури массив

help-default = Қимати пешфарз:
help-active-default = Қимати пешфарзи амалкунанда:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Қиматҳои иҷозатдодашуда (ба ҳар унсур яктоӣ):
       *[other] Қиматҳои иҷозатдодашуда:
    }

help-suggested-values = Қиматҳои тавсияшуда:

help-inserts = Илова мекунад:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатаҳо:
    }

help-type = Навъ:

help-resolved-style = Услуби ҳосилшуда (styleNumber { $styleNumber }):

help-resolved-function-names = Номҳои функсияҳои ҳосилшуда:
help-reset-list = Рӯйхати барқарорсозии ин майдон:
help-added-on-input = Дар ин майдон иловашуда:
help-removed-on-input = Аз ин майдон хориҷшуда:

help-reset-overrides = { $reset } бар { $additional } ва { $removed } бартарӣ дорад.
