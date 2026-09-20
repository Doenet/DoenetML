# Shughni (Шугнонӣ, х̌уг̌нӯн зивод) editor and language-server surfaces.
# Translated from `locales/en/editor.ftl`, which is the source of truth:
# `lint:i18n` rejects a key that does not exist there, and reports a key that
# exists there but not here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber`, `Id` and every element or
# attribute name are identifiers rather than prose and stay exactly as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Cyrillic, the Gorno-Badakhshan practice: Tajik Cyrillic plus
# the Pamiri letters where a Shughni word calls for them. Latin and
# Arabic-script practices for Shughni also exist, chiefly in Afghanistan, and
# must not be mixed into these files — `chrome.ftl`'s header states the rule in
# full.
#
# **This is the thinnest file of the four, and knowingly so.** The editor's
# nouns — muharrir, variant, filter, attribute, snippet, array entry, context,
# coordinate, reference, property — are exactly the words Shughni has no
# settled form for, because nobody has yet written software documentation in
# the language. What is below is therefore **a translated frame around a
# borrowed technical vocabulary**: the sentence structure, the argument
# placement and the selector branches are worked out, and the nouns inside them
# are Tajik and Russian (`муҳаррир`, `вариант`, `филтр`, `атрибут`, `курсор`,
# `координата`, `версия`, `контекст`, `массив`, `функсия`) in their own
# spelling. That is the honest state of the language's technical register, not
# a shortcut. A speaker should feel free to replace any of it.
#
# **Grammar.** Adjective before noun, no `$gender` or `$role` fork, and a noun
# after a numeral is unmarked for number — `content.ftl`'s header sets all
# three out. The counts in `editor-accessibility-label` and `help-coordinates`
# therefore write `[one]` and `*[other]` identically. CLDR has no plural data
# for `sgh`, so no other category is reachable.
#
# Unlike `locales/tg`, this catalog does **not** weld an izafat or a case
# ending onto any placeable: where English's sentence would need one, the
# message names what the value is and lets it stand free.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Барқарор кардан
       *[update] Нав кардан
    }

# `$word` is the button's own current label; `$shortcut` is a key combination
# and stays as written.
editor-update-viewer-title =
    { $shortcut ->
        [none] Тамошобин: { $word }
       *[other] Тамошобин: { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Филтр…
editor-variant-next = Навбатӣ вариантро интихоб кунед
editor-variant-previous = Қаблӣ вариантро интихоб кунед


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
        } ҳисоботи дастрасӣ пахш кунед. Вайронкунии WCAG AA ёфт нашуд, аммо тавсияҳои иловагии дастрасӣ ҳастанд.
       *[clean] Барои { $action ->
            [close] пӯшидани
           *[open] кушодани
        } ҳисоботи дастрасӣ пахш кунед. Ҳеҷ мушкилоти дастрасӣ ёфт нашуд.
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
editor-tab-responses = Фиристодашуда ҷавобҳо

editor-tab-with-count = { $label }: { $count }

editor-options = Танзимоти муҳаррир
editor-format-as-doenetml = Ҳамчун DoenetML шакл додан
editor-format-as-xml = Ҳамчун XML шакл додан


## The diagnostics panel

# `$line` arrives as text, not as a number: it identifies the line.
editor-diagnostic-line = Сатри №{ $line }

editor-no-errors = Хато нест
editor-no-warnings = Огоҳӣ нест
editor-no-info = Маълумотӣ огоҳинома нест

editor-show-info-annotations = Маълумотӣ огоҳиномаҳоро дар муҳаррир нишон додан
editor-show-accessibility-annotations = Огоҳиномаҳои дастрасиро дар муҳаррир нишон додан

editor-accessibility-learn-more = Doenet ба дастрасӣ чӣ гуна муносибат мекунад

# `$standard` is a link, put back by the code; the brackets are this catalog's.
editor-accessibility-violations-heading = Вайронкуниҳои дастрасӣ ({ $standard })

editor-accessibility-other-heading = Дигар мушкилоти дастрасӣ
editor-none-found = Чизе ёфт нашуд


## Submitted responses

editor-no-responses = Ҳанӯз ҳеҷ ҷавоб фиристода нашудааст
editor-response-answer-id = Id: ҷавоб
editor-response-response = Ҷавоб
editor-response-credit = Хол
editor-response-submitted = Фиристода шуд


## The context-help panel
##
## Several sentences here carry marked-up fragments — an element name, a link,
## a piece of inline markdown — which arrive as arguments and are put back as
## React nodes afterwards. The whole sentence, including where a fragment sits
## and the punctuation around it, belongs to this catalog.

help-placeholder = Барои ҳуҷҷат курсорро ба номи тег, атрибут йо { $ref } гузоред.

help-unsupported-ref-chain = Кӯмак барои бисёрқисма истинодҳо мисли { $example } ҳанӯз нест.

help-unresolved-ref =
    { $reason ->
        [notFound] Барои ин истинод объект ёфт нашуд: { $ref }.
        [multiple] Барои ин истинод якчанд объект ёфт шуд: { $ref }.
       *[indeterminate] Объекти ин истинодро муайян кардан нашуд: { $ref }.
    }

# The arrow is direction, not punctuation, and sits inside the message.
help-learn-about-references = Дар бораи истинодҳо хонед →
help-reference-page = Саҳифаи маълумотнома →

help-suggestions-header =
    { $location ->
        [inside] Дар дохили { $element }
       *[top] Дар болоӣ сатҳ
    }{ $allowed ->
        [none] { " — ин ҷо чизе намеғунҷад." }
        [text] { " — ин ҷо матн навиштан мумкин." }
        [text-and-components] { " — ин ҷо матн навиштан мумкин, йо инҳоро санҷед:" }
       *[components] { " — инҳоро санҷидан мумкин:" }
    }

# `$shortcut` is a key combination and stays as written. The message names the
# keys rather than welding a case ending onto them.
help-suggestions-footer = Барои дидани ҳамаи { $total } ҷузъ ин тугмаҳоро пахш кунед: { $shortcut }.

# `$name` is empty where the panel has already printed the name, so this has to
# read as punctuation on its own.
help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } истинод ба { $target } аст.
       *[other] { $ref } истинод ба { $target } аст (сатри { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ворид кардааст: { $owner }, ҳамчун { $role }.
       *[other] Ворид кардааст: { $owner }, дар сатри { $line }, ҳамчун { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } истинод ба хосият { $property } дар { $element } аст.
       *[other] { $ref } истинод ба хосият { $property } дар { $element } аст (сатри { $line }).
    }

help-kind-attribute = атрибут
help-kind-snippet = порча
help-kind-array-entry = унсури массив

help-default = Пешфарз қимат:
help-active-default = Амалкунанда пешфарз қимат:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Иҷозатдодашуда қиматҳо (ба ҳар унсур яктоӣ):
       *[other] Иҷозатдодашуда қиматҳо:
    }

help-suggested-values = Тавсияшуда қиматҳо:

help-inserts = Илова мекунад:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координата:
    }

help-type = Навъ:

help-resolved-style = Ҳосилшуда услуб (styleNumber { $styleNumber }):

help-resolved-function-names = Ҳосилшуда номҳои функсия:
help-reset-list = Дар ин майдон рӯйхати барқарорсозӣ:
help-added-on-input = Дар ин майдон иловашуда:
help-removed-on-input = Аз ин майдон хориҷшуда:

# The three names are attributes an author writes and stay as written.
help-reset-overrides = { $reset } бар { $additional } ат { $removed } бартарӣ дорад.
