# Lezgian editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Cyrillic, the 1938 orthography Dagestan's schools and publishing use; the
# palochka Ӏ is a letter, not a Latin I and not a digit 1.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Lezgian counts in the same two categories English does, `one` and `other`, so
# every selection below keeps both branches — a noun after a numeral stays
# singular, so the two read alike apart from the number.
#
# Nothing here agrees with anything: Lezgian has no noun classes and no
# grammatical gender, which is set out in `content.ftl`.
#
# The editor vocabulary is the least settled part of this file. Lezgian has no
# established computing register, so the Russian technical nouns written in
# Lezgian sentences below — «редактор», «курсор», «формат», «координата»,
# «свойство», «ввод», «список», «массив» — are what a Lezgian speaker would
# actually reach for, and «агакьунвал» for "accessibility" is a coinage this
# seed made rather than a term it found.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Эвелдиз хкая
       *[update] ЦӀийи ая
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Килигдайди { $word }
       *[other] Килигдайди { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Филтр…
editor-variant-next = Гуьгъуьнин вариант хкягъа
editor-variant-previous = Вилик квай вариант хкягъа


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA агакьунвилин къайда чӀурун жагъана. Агакьунвилин отчёт { $action ->
            [close] агалун
           *[open] ахъаюн
        } патал тӀуша.
        [advisories] Агакьунвилин отчёт { $action ->
            [close] агалун
           *[open] ахъаюн
        } патал тӀуша. WCAG AA къайда чӀурунар жагъанач, амма агакьунвилин артух меслятар ава.
       *[clean] Агакьунвилин отчёт { $action ->
            [close] агалун
           *[open] ахъаюн
        } патал тӀуша. Агакьунвилин четинвилер жагъанач.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA агакьунвилин къайда чӀурун жагъана. { $count ->
            [one] { $count } WCAG AA къайда чӀурун
           *[other] { $count } WCAG AA къайда чӀурун
        } жагъана. Агакьунвилин отчёт { $action ->
            [close] агалун
           *[open] ахъаюн
        } патал тӀуша.
        [advisories] WCAG AA къайда чӀурунар жагъанач. { $count ->
            [one] { $count } агакьунвилин артух меслят
           *[other] { $count } агакьунвилин артух меслят
        } жагъана. Агакьунвилин отчёт { $action ->
            [close] агалун
           *[open] ахъаюн
        } патал тӀуша.
       *[clean] WCAG AA къайда чӀурунар жагъанач. Агакьунвилин отчёт { $action ->
            [close] агалун
           *[open] ахъаюн
        } патал тӀуша.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML верси { $version }

editor-tab-help = Контекстдин куьмек
editor-tab-help-short = Контекст
editor-tab-errors = ГъалатӀар
editor-tab-warnings = Хабардарвилер
editor-tab-info = Малумат
editor-tab-accessibility = Агакьунвал
editor-tab-responses = Ракъурнавай жавабар

editor-tab-with-count = { $label }: { $count }

editor-options = Редактордин къайдаяр
editor-format-as-doenetml = DoenetML хьиз формат ая
editor-format-as-xml = XML хьиз формат ая


## The diagnostics panel

editor-diagnostic-line = { $line } лагьай цӀар

editor-no-errors = ГъалатӀар авач
editor-no-warnings = Хабардарвилер авач
editor-no-info = Малуматдин къейдер авач

editor-show-info-annotations = Малуматдин къейдер редактордал къалура
editor-show-accessibility-annotations = Агакьунвилин къейдер редактордал къалура

editor-accessibility-learn-more = Doenet агакьунвилихъ гьикӀ эгечӀзаватӀа чир хьухь

editor-accessibility-violations-heading = Агакьунвилин къайда чӀурунар ({ $standard })

editor-accessibility-other-heading = Агакьунвилин маса четинвилер
editor-none-found = ЗатӀни жагъанач


## Submitted responses

editor-no-responses = Гьеле ракъурнавай жаваб авач
editor-response-answer-id = Жавабдин Id
editor-response-response = Жаваб
editor-response-credit = Балл
editor-response-submitted = Ракъурнава


## The context-help panel

# The dative would have to sit on `{ $ref }`, so «лишан» — "sign" — is written
# after it and carries the case instead.
help-placeholder = Документация патал курсор тегдин тӀварцӀел, атрибутдал ва я { $ref } лишандал эциг.

help-unsupported-ref-chain = { $example } хьтин гзаф паюникай ибарат къалурунрин куьмек гьеле авач.

help-unresolved-ref =
    { $reason ->
        [notFound] Къалурунин объект жагъанач: { $ref }.
        [multiple] Къалурунин гзаф объект жагъана: { $ref }.
       *[indeterminate] { $ref } патал объект тайинариз хьанач.
    }

help-learn-about-references = Къалурунрикай чир хьухь →
help-reference-page = Малуматдин чин →

help-suggestions-header =
    { $location ->
        [inside] { $element } къене
       *[top] Винел дережада
    }{ $allowed ->
        [none] { " — инал затӀни физвач." }
        [text] { " — инал текст кхьихь." }
        [text-and-components] { " — инал текст кхьихь, ва я ибур синагъ ая:" }
       *[components] { " — ибур синагъ ая:" }
    }

help-suggestions-footer = Вири { $total } компонент акун патал { $shortcut } тӀуша.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — им { $target } объектдиз къалурун я.
       *[other] { $ref } — им { $target } объектдиз къалурун я ({ $line } лагьай цӀар).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } { $role } хьиз тунва.
       *[other] { $owner } { $line } лагьай цӀарал { $role } хьиз тунва.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — им { $element } элементдин { $property } свойстводиз къалурун я.
       *[other] { $ref } — им { $element } элементдин { $property } свойстводиз къалурун я ({ $line } лагьай цӀар).
    }

help-kind-attribute = атрибут
help-kind-snippet = кӀус
help-kind-array-entry = массивдин элемент

help-default = Асул къимет:
help-active-default = Гилан асул къимет:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ихтияр авай къиметар (гьар са затӀуниз сад):
       *[other] Ихтияр авай къиметар:
    }

help-suggested-values = Меслят гузвай къиметар:

help-inserts = Эцигзава:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатаяр:
    }

help-type = Тип:

help-resolved-style = Тайинарнавай стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Тайинарнавай функцийрин тӀварар:
help-reset-list = И вводда эвелдиз хкидай список:
help-added-on-input = И вводда алава авунвайди:
help-removed-on-input = И вводда алуднавайди:

help-reset-overrides = { $reset } { $additional } ва { $removed } эвездайди я.
