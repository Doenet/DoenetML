# Avar editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Avar (авар мацӀ) in the Cyrillic orthography with the palochka Ӏ, which is a
# letter and not a Latin I or a digit 1. `WCAG AA`, `DoenetML`, `XML`,
# `styleNumber` and every attribute or element name are identifiers rather than
# prose and stay exactly as written.
#
# Avar counts in the two categories English does, `one` and `other`, so every
# selection below keeps both branches. A noun after a numeral stays singular,
# so the two branches of `editor-accessibility-label` and `help-coordinates`
# differ only in the number they print — deliberately, not by oversight.
#
# Nothing here agrees with a noun class. Avar's class agreement is real and is
# spelled as a suffix, but it needs a noun this catalog supplies, and the
# things named here are the editor's own panels. The class system is written
# out in `content.ftl`'s header, which is also where the reason it forks
# nothing is argued.
#
# The editor's technical nouns are the Russian ones written Avar uses —
# «вариант», «версия», «строка», «атрибут», «ссылка» — as they are throughout
# this catalog.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Нахъбуссине
       *[update] ЦӀияб гьабизе
    }
editor-update-viewer-title =
    { $shortcut ->
        [none] Балагьулеб гьумер { $word }
       *[other] Балагьулеб гьумер { $word } { $shortcut }
    }

## The variant picker

editor-variant = Вариант
editor-variant-filter = Балагьи…
editor-variant-next = Хадусеб вариант тӀаса бищизе
editor-variant-previous = Цебесеб вариант тӀаса бищизе

## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA щвезабиялъул хисмат батана. Щвезабиялъул отчёт { $action ->
            [close] къазе
           *[open] рагьизе
        } хӀапа гьабе.
        [advisories] Щвезабиялъул отчёт { $action ->
            [close] къазе
           *[open] рагьизе
        } хӀапа гьабе. WCAG AA хисматал ратичӀо, амма щвезабиялъе цойги малъа-хъваял руго.
       *[clean] Щвезабиялъул отчёт { $action ->
            [close] къазе
           *[open] рагьизе
        } хӀапа гьабе. Щвезабиялъул цониги захӀматлъи батичӀо.
    }
editor-accessibility-label =
    { $status ->
        [violations] WCAG AA щвезабиялъул хисмат батана. { $count ->
            [one] { $count } WCAG AA хисмат
           *[other] { $count } WCAG AA хисмат
        } батана. Щвезабиялъул отчёт { $action ->
            [close] къазе
           *[open] рагьизе
        } хӀапа гьабе.
        [advisories] WCAG AA хисматал ратичӀо. { $count ->
            [one] { $count } щвезабиялъе цойги малъа-хъвай
           *[other] { $count } щвезабиялъе цойги малъа-хъвай
        } батана. Щвезабиялъул отчёт { $action ->
            [close] къазе
           *[open] рагьизе
        } хӀапа гьабе.
       *[clean] WCAG AA хисматал ратичӀо. Щвезабиялъул отчёт { $action ->
            [close] къазе
           *[open] рагьизе
        } хӀапа гьабе.
    }
editor-accessibility-badge = WCAG

## The footer

editor-version-title = DoenetML версия { $version }
editor-tab-help = БакӀалде данде кколеб кумек
editor-tab-help-short = БакӀ
editor-tab-errors = ГъалатӀал
editor-tab-warnings = ХӀинкъаби
editor-tab-info = Хабар
editor-tab-accessibility = Щвезаби
editor-tab-responses = БитӀарал жавабал
editor-tab-with-count = { $label }: { $count }
editor-options = Редакторалъул сайлъаби
editor-format-as-doenetml = DoenetML гӀадин формат гьабе
editor-format-as-xml = XML гӀадин формат гьабе

## The diagnostics panel

editor-diagnostic-line = Мухъ #{ $line }
editor-no-errors = ГъалатӀал гьечӀо
editor-no-warnings = ХӀинкъаби гьечӀо
editor-no-info = Хабаралъул диагностикаби гьечӀо
editor-show-info-annotations = Редакторалда хабаралъул диагностикаби рихьизаризе
editor-show-accessibility-annotations = Редакторалда щвезабиялъул диагностикаби рихьизаризе
editor-accessibility-learn-more = Doenet щвезабиялде щиб къагӀидаялъ балагьулебали лъазабе
editor-accessibility-violations-heading = Щвезабиялъул хисматал ({ $standard })
editor-accessibility-other-heading = Щвезабиялъул цогидал захӀматлъаби
editor-none-found = Щибго батичӀо

## Submitted responses

editor-no-responses = ГьанжелъизегӀан битӀарал жавабал гьечӀо
editor-response-answer-id = Жавабалъул Id
editor-response-response = Жаваб
editor-response-credit = Балл
editor-response-submitted = БитӀараб

## The context-help panel

help-placeholder = Документациялъе курсор тегалъул цӀаралда, атрибуталда яги { $ref } абуралда лъе.
help-unsupported-ref-chain = { $example } гӀадал гӀемерал бутӀабазул ссылкабазе кумек гьанже гьечӀо.
help-unresolved-ref =
    { $reason ->
        [notFound] { $ref } абураб ссылкаялъе жаваб кколеб жо батичӀо.
        [multiple] { $ref } абураб ссылкаялъе жаваб кколел гӀемерал жал ратана.
       *[indeterminate] { $ref } абураб ссылкаялъе жаваб кколеб жо бихьизабизе кӀвечӀо.
    }
help-learn-about-references = Ссылкабазул хӀакъалъулъ лъазабе →
help-reference-page = Справочникалъул гьумер →
help-suggestions-header =
    { $location ->
        [inside] { $element } абуралъул жаниб
       *[top] ТӀадегӀанаб даражаялда
    }{ $allowed ->
        [none] { " — гьаниб щибго ккезе бегьуларо." }
        [text] { " — гьаниб текст хъвае." }
        [text-and-components] { " — гьаниб текст хъвае, яги гьал рагьае:" }
       *[components] { " — рагьазе бегьулел жал:" }
    }
help-suggestions-footer = Киналго { $total } компонент рихьизе { $shortcut } кьабе.
help-name-summary = { $name } — { $summary }
help-ref-is-reference =
    { $line ->
        [none] { $ref } — гьеб { $target } абуралде ссылка буго.
       *[other] { $ref } — гьеб { $target } абуралде ссылка буго ({ $line } абураб мухъ).
    }
help-ref-derived-from =
    { $line ->
        [none] { $owner } абуралъ { $role } гӀадин лъуна.
       *[other] { $owner } абуралъ { $line } абураб мухъалда { $role } гӀадин лъуна.
    }
help-property-is-reference =
    { $line ->
        [none] { $ref } — гьеб { $element } абуралъул { $property } абураб свойствоялде ссылка буго.
       *[other] { $ref } — гьеб { $element } абуралъул { $property } абураб свойствоялде ссылка буго ({ $line } абураб мухъ).
    }
help-kind-attribute = атрибут
help-kind-snippet = сниппет
help-kind-array-entry = массивалъул бутӀа
help-default = Стандартияб къимат:
help-active-default = ХӀалтӀулеб стандартияб къимат:
help-style-number-annotation = { " " }(styleNumber { $styleNumber })
help-allowed-values =
    { $perItem ->
        [true] Бегьулел къиматал (кӀиго-лъабго бутӀаялъе цо-цо):
       *[other] Бегьулел къиматал:
    }
help-suggested-values = Малъулел къиматал:
help-inserts = Лъолеб жо:
help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатаби:
    }
help-type = Тайпа:
help-resolved-style = Бихьизабураб стиль (styleNumber { $styleNumber }):
help-resolved-function-names = Бихьизарурал функциязул цӀарал:
help-reset-list = Гьаб инпуталда список нахъбуссинаби:
help-added-on-input = Гьаб инпуталда жубараб:
help-removed-on-input = Гьаб инпуталда нахъе босараб:
help-reset-overrides = { $reset } абураб { $additional } ва { $removed } абуразда тӀад ккола.
