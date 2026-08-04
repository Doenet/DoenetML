# Kyrgyz editor and language-server surfaces. Translated from
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
# Kyrgyz counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Баштапкы абалга
       *[update] Жаңыртуу
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Көрсөткүчтү { $word }
       *[other] Көрсөткүчтү { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Чыпкалоо…
editor-variant-next = Кийинки вариантты тандоо
editor-variant-previous = Мурунку вариантты тандоо


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA жеткиликтүүлүк бузуусу аныкталды. Жеткиликтүүлүк отчётун { $action ->
            [close] жабуу
           *[open] ачуу
        } үчүн басыңыз.
        [advisories] Жеткиликтүүлүк отчётун { $action ->
            [close] жабуу
           *[open] ачуу
        } үчүн басыңыз. WCAG AA бузуулары табылган жок, бирок кошумча жеткиликтүүлүк сунуштары бар.
       *[clean] Жеткиликтүүлүк отчётун { $action ->
            [close] жабуу
           *[open] ачуу
        } үчүн басыңыз. Жеткиликтүүлүк көйгөйлөрү табылган жок.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA жеткиликтүүлүк бузуусу аныкталды. { $count ->
            [one] { $count } WCAG AA бузуусу
           *[other] { $count } WCAG AA бузуусу
        } табылды. Жеткиликтүүлүк отчётун { $action ->
            [close] жабуу
           *[open] ачуу
        } үчүн басыңыз.
        [advisories] WCAG AA бузуулары аныкталган жок. { $count ->
            [one] { $count } кошумча жеткиликтүүлүк сунушу
           *[other] { $count } кошумча жеткиликтүүлүк сунушу
        } табылды. Жеткиликтүүлүк отчётун { $action ->
            [close] жабуу
           *[open] ачуу
        } үчүн басыңыз.
       *[clean] WCAG AA бузуулары аныкталган жок. Жеткиликтүүлүк отчётун { $action ->
            [close] жабуу
           *[open] ачуу
        } үчүн басыңыз.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версиясы { $version }

editor-tab-help = Контексттик жардам
editor-tab-help-short = Контекст
editor-tab-errors = Каталар
editor-tab-warnings = Эскертүүлөр
editor-tab-info = Маалымат
editor-tab-accessibility = Жеткиликтүүлүк
editor-tab-responses = Жөнөтүлгөн жооптор

editor-tab-with-count = { $label }: { $count }

editor-options = Редактордун жөндөөлөрү
editor-format-as-doenetml = DoenetML катары форматтоо
editor-format-as-xml = XML катары форматтоо


## The diagnostics panel

editor-diagnostic-line = { $line }-сап

editor-no-errors = Каталар жок
editor-no-warnings = Эскертүүлөр жок
editor-no-info = Маалыматтык билдирүүлөр жок

editor-show-info-annotations = Маалыматтык билдирүүлөрдү редактордо көрсөтүү
editor-show-accessibility-annotations = Жеткиликтүүлүк билдирүүлөрүн редактордо көрсөтүү

editor-accessibility-learn-more = Doenet жеткиликтүүлүккө кандай мамиле кылат

editor-accessibility-violations-heading = Жеткиликтүүлүк бузуулары ({ $standard })

editor-accessibility-other-heading = Башка жеткиликтүүлүк көйгөйлөрү
editor-none-found = Эч нерсе табылган жок


## Submitted responses

editor-no-responses = Азырынча жөнөтүлгөн жооптор жок
editor-response-answer-id = Жооптун Id-си
editor-response-response = Жооп
editor-response-credit = Упай
editor-response-submitted = Жөнөтүлдү


## The context-help panel

help-placeholder = Документацияны көрүү үчүн курсорду тегдин атына, атрибутка же { $ref } үстүнө коюңуз.

help-unsupported-ref-chain = { $example } сыяктуу көп бөлүктүү шилтемелер боюнча жардам азырынча колдоого алынган жок.

help-unresolved-ref =
    { $reason ->
        [notFound] Шилтемеге объект табылган жок: { $ref }.
        [multiple] Шилтемеге бир нече объект табылды: { $ref }.
       *[indeterminate] { $ref } үчүн объектти аныктоо мүмкүн болбоду.
    }

help-learn-about-references = Шилтемелер жөнүндө билүү →
help-reference-page = Маалымдама барагы →

help-suggestions-header =
    { $location ->
        [inside] { $element } ичинде
       *[top] Жогорку деңгээлде
    }{ $allowed ->
        [none] { " — бул жерге эч нерсе жайгашпайт." }
        [text] { " — бул жерге текст жазса болот." }
        [text-and-components] { " — бул жерге текст жазса болот же муну байкап көрүңүз:" }
       *[components] { " — муну байкап көрсө болот:" }
    }

help-suggestions-footer = Бардык { $total } компонентти көрүү үчүн { $shortcut } басыңыз.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объектине шилтеме.
       *[other] { $ref } — { $target } объектине шилтеме ({ $line }-сап).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } аны { $role } катары киргизген.
       *[other] { $owner } аны { $line }-сапта { $role } катары киргизген.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементинин { $property } касиетине шилтеме.
       *[other] { $ref } — { $element } элементинин { $property } касиетине шилтеме ({ $line }-сап).
    }

help-kind-attribute = атрибут
help-kind-snippet = үзүндү
help-kind-array-entry = массивдин элементи

help-default = Демейки маани:
help-active-default = Колдонуудагы демейки маани:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Уруксат берилген маанилер (ар бир элементке бирден):
       *[other] Уруксат берилген маанилер:
    }

help-suggested-values = Сунушталган маанилер:

help-inserts = Кошот:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координаталар:
    }

help-type = Түрү:

help-resolved-style = Алынган стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Алынган функциялардын аттары:
help-reset-list = Бул талаанын баштапкы абалга келтирүү тизмеси:
help-added-on-input = Бул талаага кошулгандар:
help-removed-on-input = Бул талаадан алынгандар:

help-reset-overrides = { $reset } — { $additional } менен { $removed } үстүнөн артыкчылыктуу.
