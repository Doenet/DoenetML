# Ossetian editor and language-server surfaces. Translated from
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
# Ossetian counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Раздæхын
       *[update] Ногæй кæнын
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Уынæг { $word }
       *[other] Уынæг { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Æвзарæн…
editor-variant-next = Дарддæры вариант равзарын
editor-variant-previous = Разæйы вариант равзарын


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA бахæццæйы халд ссардæуыд. Бахæццæйы отчёт { $action ->
            [close] æхгæнынæн
           *[open] байгом кæнынæн
        } ныххæц.
        [advisories] Бахæццæйы отчёт { $action ->
            [close] æхгæнынæн
           *[open] байгом кæнынæн
        } ныххæц. WCAG AA халдтытæ нæ ссардæуыд, фæлæ ис æндæр амындтытæ.
       *[clean] Бахæццæйы отчёт { $action ->
            [close] æхгæнынæн
           *[open] байгом кæнынæн
        } ныххæц. Бахæццæйы фарстытæ нæ ссардæуыд.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA бахæццæйы халд ссардæуыд. { $count ->
            [one] { $count } WCAG AA халд
           *[other] { $count } WCAG AA халд
        } ссардæуыд. Бахæццæйы отчёт { $action ->
            [close] æхгæнынæн
           *[open] байгом кæнынæн
        } ныххæц.
        [advisories] WCAG AA халдтытæ нæ ссардæуыд. { $count ->
            [one] { $count } æндæр амынд
           *[other] { $count } æндæр амынд
        } ссардæуыд. Бахæццæйы отчёт { $action ->
            [close] æхгæнынæн
           *[open] байгом кæнынæн
        } ныххæц.
       *[clean] WCAG AA халдтытæ нæ ссардæуыд. Бахæццæйы отчёт { $action ->
            [close] æхгæнынæн
           *[open] байгом кæнынæн
        } ныххæц.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML верси { $version }

editor-tab-help = Контексты æххуыс
editor-tab-help-short = Контекст
editor-tab-errors = Рæдыдтытæ
editor-tab-warnings = Фæдзæхстытæ
editor-tab-info = Информаци
editor-tab-accessibility = Бахæццæ
editor-tab-responses = Арвыст дзуæппытæ

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторы уагæвæрдтæ
editor-format-as-doenetml = DoenetML хуызы формат кæнын
editor-format-as-xml = XML хуызы формат кæнын


## The diagnostics panel

editor-diagnostic-line = { $line }-æм рæнхъ

editor-no-errors = Рæдыдтытæ нæй
editor-no-warnings = Фæдзæхстытæ нæй
editor-no-info = Информацион хъусынгæнинæгтæ нæй

editor-show-info-annotations = Информацион хъусынгæнинæгтæ редакторы равдисын
editor-show-accessibility-annotations = Бахæццæйы хъусынгæнинæгтæ редакторы равдисын

editor-accessibility-learn-more = Doenet бахæццæмæ куыд кæсы

editor-accessibility-violations-heading = Бахæццæйы халдтытæ ({ $standard })

editor-accessibility-other-heading = Æндæр бахæццæйы фарстытæ
editor-none-found = Ницы ссардæуыд


## Submitted responses

editor-no-responses = Ныртæккæмæ арвыст дзуæппытæ нæй
editor-response-answer-id = Дзуаппы Id
editor-response-response = Дзуапп
editor-response-credit = Балл
editor-response-submitted = Арвыст


## The context-help panel

help-placeholder = Документаци фенынæн курсор сæвæр тегы номыл, атрибутыл кæнæ { $ref }-ыл.

help-unsupported-ref-chain = { $example } хуызæн бирæхаййон бастдзинæдтæн æххуыс нырма нæй.

help-unresolved-ref =
    { $reason ->
        [notFound] Бастдзинадæн объект нæ ссардæуыд: { $ref }.
        [multiple] Бастдзинадæн бирæ объекттæ ссардæуыд: { $ref }.
       *[indeterminate] { $ref } объект бæрæг кæнын нæ бантыст.
    }

help-learn-about-references = Бастдзинæдты тыххæй базонын →
help-reference-page = Æрмæджы фарс →

help-suggestions-header =
    { $location ->
        [inside] { $element } мидæг
       *[top] Уæллаг уæлæнгайы
    }{ $allowed ->
        [none] { " — ам ницы бацæуы." }
        [text] { " — ам текст фыссæн ис." }
        [text-and-components] { " — ам текст фыссæн ис, кæнæ ацытæ бафæлвар:" }
       *[components] { " — ацытæ бафæлварæн ис:" }
    }

help-suggestions-footer = Æппæт { $total } компонент фенынæн { $shortcut } ныххæц.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объектмæ бастдзинад.
       *[other] { $ref } — { $target } объектмæ бастдзинад ({ $line }-æм рæнхъ).
    }

help-ref-derived-from =
    { $line ->
        [none] Уый { $owner } { $role } хуызы бахаста.
       *[other] Уый { $owner } { $line }-æм рæнхъы { $role } хуызы бахаста.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементы { $property } миниуæгмæ бастдзинад.
       *[other] { $ref } — { $element } элементы { $property } миниуæгмæ бастдзинад ({ $line }-æм рæнхъ).
    }

help-kind-attribute = атрибут
help-kind-snippet = хай
help-kind-array-entry = массивы элемент

help-default = Бындурон аргъ:
help-active-default = Ныртæккæйы бындурон аргъ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Уадзгæ аргъытæ (алы элементмæ иу):
       *[other] Уадзгæ аргъытæ:
    }

help-suggested-values = Амынд аргъытæ:

help-inserts = Бафтауы:

help-coordinates =
    { $count ->
        [one] Координатæ:
       *[other] Координатæтæ:
    }

help-type = Хуыз:

help-resolved-style = Рацыд стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Рацыд функцийы нæмттæ:
help-reset-list = Ацы быдыры раздæхыны номхыгъд:
help-added-on-input = Ацы быдыры бафтыд:
help-removed-on-input = Ацы быдырæй аппæрст:

help-reset-overrides = { $reset } — { $additional } æмæ { $removed } сæрты фæуæлахиз вæййы.
