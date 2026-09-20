# Ingush editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Ingush (гӀалгӀай мотт) in Cyrillic with the palochka Ӏ, which is a letter and
# neither a Latin capital I nor a digit 1. The catalog's exemplar is
# `locales/ce` — the other Vainakh language rather than another dialect of this
# one; `content.ftl`'s header sets out what that means and where this seed is
# least sure of itself.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Ingush counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike. Nothing here agrees with a noun class: the class fork
# lives in `content.ftl`, where the noun being described is known.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Юхаяккха
       *[update] Керлаяккха
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Хьажархо { $word }
       *[other] Хьажархо { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Хержар…
editor-variant-next = ТӀехьара вариант харжа
editor-variant-previous = Хьалхара вариант харжа


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA кхачара дохадар корадаьд. Кхачара отчёт { $action ->
            [close] дӀакъовла
           *[open] даста
        } тӀатаӀае.
        [advisories] Кхачара отчёт { $action ->
            [close] дӀакъовла
           *[open] даста
        } тӀатаӀае. WCAG AA дохадараш ца корадаь, бакъда кхы хьехамаш да.
       *[clean] Кхачара отчёт { $action ->
            [close] дӀакъовла
           *[open] даста
        } тӀатаӀае. Кхачара хаттараш ца корадаь.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA кхачара дохадар корадаьд. { $count ->
            [one] { $count } WCAG AA дохадар
           *[other] { $count } WCAG AA дохадар
        } корадаьд. Кхачара отчёт { $action ->
            [close] дӀакъовла
           *[open] даста
        } тӀатаӀае.
        [advisories] WCAG AA дохадараш ца корадаь. { $count ->
            [one] { $count } тӀатоьхача хьехам
           *[other] { $count } тӀатоьхача хьехам
        } корадаьд. Кхачара отчёт { $action ->
            [close] дӀакъовла
           *[open] даста
        } тӀатаӀае.
       *[clean] WCAG AA дохадараш ца корадаь. Кхачара отчёт { $action ->
            [close] дӀакъовла
           *[open] даста
        } тӀатаӀае.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML верси { $version }

editor-tab-help = Контекста гӀо
editor-tab-help-short = Контекст
editor-tab-errors = ГӀалаташ
editor-tab-warnings = Тергамбараш
editor-tab-info = Хаам
editor-tab-accessibility = Кхачар
editor-tab-responses = ДӀаденна жоапаш

editor-tab-with-count = { $label }: { $count }

editor-options = Редактора нисдараш
editor-format-as-doenetml = DoenetML санна форматде
editor-format-as-xml = XML санна форматде


## The diagnostics panel

editor-diagnostic-line = { $line }-ча могӀа

editor-no-errors = ГӀалаташ дац
editor-no-warnings = Тергамбараш дац
editor-no-info = Хаама хаамаш дац

editor-show-info-annotations = Хаама хаамаш редактора чу гойта
editor-show-accessibility-annotations = Кхачара хаамаш редактора чу гойта

editor-accessibility-learn-more = Doenet кхачарга фу тайпара хьожа хьахьовзаде

editor-accessibility-violations-heading = Кхачара дохадараш ({ $standard })

editor-accessibility-other-heading = Кхы дола кхачара хаттараш
editor-none-found = ХӀама ца корадаь


## Submitted responses

editor-no-responses = ХӀанзалца дӀаденна жоапаш дац
editor-response-answer-id = Жоапа Id
editor-response-response = Жоп
editor-response-credit = Балл
editor-response-submitted = ДӀаденна


## The context-help panel

help-placeholder = Документаци гойта курсор тега цӀера тӀа, атрибута тӀа е { $ref } тӀа хӀоттабе.

help-unsupported-ref-chain = { $example } санна дукха дакъа дола хьажараш йолчоа гӀо хӀанза дац.

help-unresolved-ref =
    { $reason ->
        [notFound] Хьажарна объект ца корайо: { $ref }.
        [multiple] Хьажарна дукха объекташ корадаь: { $ref }.
       *[indeterminate] { $ref } объект билгалде ца делар.
    }

help-learn-about-references = Хьажарий хьакъехьа хьахьовзаде →
help-reference-page = Хьисапа оагӀув →

help-suggestions-header =
    { $location ->
        [inside] { $element } чу
       *[top] Лакхарча тӀегӀа тӀа
    }{ $allowed ->
        [none] { " — укхаза хӀама ца таралу." }
        [text] { " — укхаза текст язъе мега." }
        [text-and-components] { " — укхаза текст язъе мега, е укхарех зехьа:" }
       *[components] { " — укхарех зехьа:" }
    }

help-suggestions-footer = Масса { $total } компонент гойта { $shortcut } тӀатаӀае.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объекта тӀа хьажар.
       *[other] { $ref } — { $target } объекта тӀа хьажар ({ $line }-ча могӀа).
    }

help-ref-derived-from =
    { $line ->
        [none] Из { $owner } { $role } санна чудаьккхад.
       *[other] Из { $owner } { $line }-ча могӀа тӀа { $role } санна чудаьккхад.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элемента { $property } яха башхала тӀа хьажар.
       *[other] { $ref } — { $element } элемента { $property } яха башхала тӀа хьажар ({ $line }-ча могӀа).
    }

help-kind-attribute = атрибут
help-kind-snippet = дакъа
help-kind-array-entry = массива элемент

help-default = Бух болаш мах:
help-active-default = ХӀанзара бух болаш мах:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Мега мах (хӀор элемента цхьаъ):
       *[other] Мега мах:
    }

help-suggested-values = Хьехам бинна мах:

help-inserts = ТӀатуху:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координаташ:
    }

help-type = Тайпа:

help-resolved-style = Схьаэцна стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Схьаэцна функцешта цӀераш:
help-reset-list = Укх моттига юхаяккхара список:
help-added-on-input = Укх моттига тӀа тӀатоьхад:
help-removed-on-input = Укх моттигара дӀадаьккхад:

help-reset-overrides = { $reset } — { $additional } а, { $removed } а тӀехьа толаш да.
