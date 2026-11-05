# Nogai editor and language-server surfaces. Translated from
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
# Nogai counts in the same two categories English does, `one` and `other`, so
# every selection below keeps both branches — but a noun after a numeral stays
# singular, so the two read alike apart from the number.
#
# Nogai has no gender and no noun classes, so nothing here agrees with a noun.
#
# This is the file with the most invented vocabulary in the catalog, and it is
# invented in the open: Nogai has no published writing about editors, language
# servers or accessibility reports. «силтеме» for a reference, «карагыш» for
# the viewer pane, «суьзуьв» for a filter, «аьдепки» for a default value and
# «колайлык» for accessibility are built on the Kazakh and Karakalpak pattern
# because no attested Nogai term exists; a speaker should treat every one of
# them as a proposal. The Russian loans that written Nogai does use —
# «редактор», «атрибут», «компонент», «координата», «стиль» — are kept.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Кайтарув
       *[update] Янъыртув
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Карагышты { $word }
       *[other] Карагышты { $word } { $shortcut }
    }

## The variant picker

editor-variant = Вариант
editor-variant-filter = Суьзуьв…
editor-variant-next = Келеси вариантты сайлав
editor-variant-previous = Алдынгы вариантты сайлав

## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA колайлык бузылувы табылды. Колайлык отчетын { $action ->
            [close] ябув
           *[open] ашув
        } уьшин басынъыз.
        [advisories] Колайлык отчетын { $action ->
            [close] ябув
           *[open] ашув
        } уьшин басынъыз. WCAG AA бузылувлары табылмады, амма косымша колайлык кенъеслери бар.
       *[clean] Колайлык отчетын { $action ->
            [close] ябув
           *[open] ашув
        } уьшин басынъыз. Колайлык маьселелери табылмады.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA колайлык бузылувы табылды. { $count ->
            [one] { $count } WCAG AA бузылувы
           *[other] { $count } WCAG AA бузылувы
        } табылды. Колайлык отчетын { $action ->
            [close] ябув
           *[open] ашув
        } уьшин басынъыз.
        [advisories] WCAG AA бузылувлары табылмады. { $count ->
            [one] { $count } косымша колайлык кенъеси
           *[other] { $count } косымша колайлык кенъеси
        } табылды. Колайлык отчетын { $action ->
            [close] ябув
           *[open] ашув
        } уьшин басынъыз.
       *[clean] WCAG AA бузылувлары табылмады. Колайлык отчетын { $action ->
            [close] ябув
           *[open] ашув
        } уьшин басынъыз.
    }

editor-accessibility-badge = WCAG

## The footer

editor-version-title = DoenetML версиясы { $version }
editor-tab-help = Контекстке коьре коьмек
editor-tab-help-short = Контекст
editor-tab-errors = Кателер
editor-tab-warnings = Эскертуьвлер
editor-tab-info = Малюмат
editor-tab-accessibility = Колайлык
editor-tab-responses = Йиберилген яваплар
editor-tab-with-count = { $label }: { $count }
editor-options = Редактор параметрлери
editor-format-as-doenetml = DoenetML болып форматлав
editor-format-as-xml = XML болып форматлав

## The diagnostics panel

editor-diagnostic-line = Катар №{ $line }
editor-no-errors = Кателер йок
editor-no-warnings = Эскертуьвлер йок
editor-no-info = Малюмат диагностикалары йок
editor-show-info-annotations = Редакторда малюмат диагностикаларын коьрсетуьв
editor-show-accessibility-annotations = Редакторда колайлык диагностикаларын коьрсетуьв
editor-accessibility-learn-more = Doenet колайлыкка калай карайтаганын билинъиз
editor-accessibility-violations-heading = Колайлык бузылувлары ({ $standard })
editor-accessibility-other-heading = Баска колайлык маьселелери
editor-none-found = Табылмады

## Submitted responses

editor-no-responses = Аьли йиберилген явап йок
editor-response-answer-id = Явап Id
editor-response-response = Явап
editor-response-credit = Балл
editor-response-submitted = Йиберилди

## The context-help panel

help-placeholder = Документация уьшин курсорды тег атына, атрибутка яде { $ref } уьстине коьширинъиз.

help-unsupported-ref-chain = { $example } киби коьп боьликли силтемелер уьшин коьмек аьли берилмейди.

help-unresolved-ref =
    { $reason ->
        [notFound] { $ref } силтемеси коьрсеткен нысан табылмады.
        [multiple] { $ref } силтемеси бир кесек нысанды коьрсетеди.
       *[indeterminate] { $ref } уьшин нысанды белгилеп болмады.
    }

help-learn-about-references = Силтемелер акында билуьв →
help-reference-page = Аныклама бети →

help-suggestions-header =
    { $location ->
        [inside] { $element } ишинде
       *[top] Эм оьр дережеде
    }{ $allowed ->
        [none] { " — мунда бир зат та кирмейди." }
        [text] { " — мунда текст язынъыз." }
        [text-and-components] { " — мунда текст язынъыз яде мыналарды сынанъыз:" }
       *[components] { " — мыналарды сынанъыз:" }
    }

help-suggestions-footer = Барлык { $total } компонентти коьруьв уьшин { $shortcut } басынъыз.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } уьстине силтеме.
       *[other] { $ref } — { $target } уьстине силтеме ({ $line } катар).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } тарапыннан { $role } болып киргизилген.
       *[other] { $owner } тарапыннан { $line } катарда { $role } болып киргизилген.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементининъ { $property } касиетине силтеме.
       *[other] { $ref } — { $element } элементининъ { $property } касиетине силтеме ({ $line } катар).
    }

help-kind-attribute = атрибут
help-kind-snippet = уьзинди
help-kind-array-entry = массив элементи

help-default = Аьдепки:
help-active-default = Актив аьдепки:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ярайтаган маьнелер (аьр элемент уьшин бирев):
       *[other] Ярайтаган маьнелер:
    }

help-suggested-values = Кенъес этилетаган маьнелер:

help-inserts = Киргистеди:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координаталар:
    }

help-type = Туьри:

help-resolved-style = Аныкланган стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Аныкланган функция атлары:
help-reset-list = Бу киргистуьвде тизимди кайтарув:
help-added-on-input = Бу киргистуьвде косылган:
help-removed-on-input = Бу киргистуьвде алып тасланган:

help-reset-overrides = { $reset } { $additional } эм { $removed } маьнелерин авыстырады.
