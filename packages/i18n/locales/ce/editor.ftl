# Chechen editor and language-server surfaces. Translated from
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
# Chechen counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike. Nothing here agrees with a noun class: the class fork
# lives in `content.ftl`, where the noun being described is known.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Юхаяккха
       *[update] Керлаян
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Хьажархо { $word }
       *[other] Хьажархо { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Харжар…
editor-variant-next = ТӀаьхьара вариант харжа
editor-variant-previous = Хьалхара вариант харжа


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA кхачаран дохор карийна. Кхачаран отчёт { $action ->
            [close] дӀакъовла
           *[open] даста
        } тӀетаӀае.
        [advisories] Кхачаран отчёт { $action ->
            [close] дӀакъовла
           *[open] даста
        } тӀетаӀае. WCAG AA дохораш ца карийна, амма кхин хьехамаш бу.
       *[clean] Кхачаран отчёт { $action ->
            [close] дӀакъовла
           *[open] даста
        } тӀетаӀае. Кхачаран хаттарш ца карийна.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA кхачаран дохор карийна. { $count ->
            [one] { $count } WCAG AA дохор
           *[other] { $count } WCAG AA дохор
        } карийна. Кхачаран отчёт { $action ->
            [close] дӀакъовла
           *[open] даста
        } тӀетаӀае.
        [advisories] WCAG AA дохораш ца карийна. { $count ->
            [one] { $count } тӀетоьхна хьехам
           *[other] { $count } тӀетоьхна хьехам
        } карийна. Кхачаран отчёт { $action ->
            [close] дӀакъовла
           *[open] даста
        } тӀетаӀае.
       *[clean] WCAG AA дохораш ца карийна. Кхачаран отчёт { $action ->
            [close] дӀакъовла
           *[open] даста
        } тӀетаӀае.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML верси { $version }

editor-tab-help = Контекстан гӀо
editor-tab-help-short = Контекст
editor-tab-errors = ГӀалаташ
editor-tab-warnings = Тергамчаш
editor-tab-info = Хаам
editor-tab-accessibility = Кхачар
editor-tab-responses = ДӀадахьийтина жоьпаш

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторан нисдарш
editor-format-as-doenetml = DoenetML санна форматдан
editor-format-as-xml = XML санна форматдан


## The diagnostics panel

editor-diagnostic-line = { $line }-гӀа могӀа

editor-no-errors = ГӀалаташ дац
editor-no-warnings = Тергамчаш яц
editor-no-info = Хааман хаамаш бац

editor-show-info-annotations = Хааман хаамаш редакторехь гайта
editor-show-accessibility-annotations = Кхачаран хаамаш редакторехь гайта

editor-accessibility-learn-more = Doenet кхачарна муха хьоьжу

editor-accessibility-violations-heading = Кхачаран дохораш ({ $standard })

editor-accessibility-other-heading = Кхин кхачаран хаттарш
editor-none-found = ХӀумма ца карийна


## Submitted responses

editor-no-responses = ХӀинццалц дӀадахьийтина жоьпаш дац
editor-response-answer-id = Жопан Id
editor-response-response = Жоп
editor-response-credit = Балл
editor-response-submitted = ДӀадахьийтина


## The context-help panel

help-placeholder = Документаци ган курсор теган цӀе тӀе, атрибут тӀе я { $ref } тӀе хӀотта.

help-unsupported-ref-chain = { $example } санна дукха дакъойн хьажораш йолчунна гӀо хӀинца дац.

help-unresolved-ref =
    { $reason ->
        [notFound] Хьажоранна объект ца карийна: { $ref }.
        [multiple] Хьажоранна дукха объекташ карийна: { $ref }.
       *[indeterminate] { $ref } объект билгалдан ца делира.
    }

help-learn-about-references = Хьажорийн хьокъехь хаа →
help-reference-page = Хьесапан агӀо →

help-suggestions-header =
    { $location ->
        [inside] { $element } чохь
       *[top] Лакхарчу тӀегӀанехь
    }{ $allowed ->
        [none] { " — кхузахь хӀумма ца тарло." }
        [text] { " — кхузахь текст яздан мега." }
        [text-and-components] { " — кхузахь текст яздан мега, я хӀорш зеде:" }
       *[components] { " — хӀорш зеде мега:" }
    }

help-suggestions-footer = Массо { $total } компонент ган { $shortcut } тӀетаӀае.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объекте хьажор.
       *[other] { $ref } — { $target } объекте хьажор ({ $line }-гӀа могӀа).
    }

help-ref-derived-from =
    { $line ->
        [none] Иза { $owner } { $role } санна чуялийна.
       *[other] Иза { $owner } { $line }-чу могӀанехь { $role } санна чуялийна.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементан { $property } лаьцна хьажор.
       *[other] { $ref } — { $element } элементан { $property } лаьцна хьажор ({ $line }-гӀа могӀа).
    }

help-kind-attribute = атрибут
help-kind-snippet = дакъа
help-kind-array-entry = массиван элемент

help-default = Бух болу мах:
help-active-default = ХӀинцлера бух болу мах:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Магийна мехаш (хӀор элементана цхьаъ):
       *[other] Магийна мехаш:
    }

help-suggested-values = Хьехийна мехаш:

help-inserts = ТӀетуху:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координаташ:
    }

help-type = Тайпа:

help-resolved-style = Схьаэцна стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Схьаэцна функцийн цӀераш:
help-reset-list = ХӀокху меттиган юхаяккхаран список:
help-added-on-input = ХӀокху меттигехь тӀетоьхна:
help-removed-on-input = ХӀокху меттигера дӀадаьхна:

help-reset-overrides = { $reset } — { $additional } а, { $removed } а тӀехь толу.
