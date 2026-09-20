# Kumyk editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Kumyk in the Cyrillic orthography of Dagestan's schools and press, which is
# what CLDR assumes for a bare `kum` (`kum-Cyrl-RU`).
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Kumyk counts in the same two categories English does, `one` and `other`, so
# every selection below keeps both branches — but a noun after a numeral stays
# singular, so the two read alike apart from the number. Nothing here agrees
# with a gender or a noun class; Kumyk has neither.
#
# Two words in this file are the seed's own choices rather than established
# terms, and a speaker should expect to replace them wholesale. «онгайлыкъ»
# for *accessibility* means convenience or ease of use. «силтев» for
# *reference* is built from «силтемек», to point at; the alternative in the
# Kumyk press is the Russian «ссылка», and choosing between them is a decision
# about register that this seed is not entitled to make.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Къайтарыв
       *[update] Янгыртыв
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Гёрсетивню { $word }
       *[other] Гёрсетивню { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Сюзюв…
editor-variant-next = Сонрагъы вариантны танглав
editor-variant-previous = Алдагъы вариантны танглав


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA онгайлыкъ бузув табылды. Онгайлыкъ отчётну { $action ->
            [close] ябыв
           *[open] ачыв
        } учун басыгъыз.
        [advisories] Онгайлыкъ отчётну { $action ->
            [close] ябыв
           *[open] ачыв
        } учун басыгъыз. WCAG AA бузувлар табылмады, тек къошум онгайлыкъ таклифлер бар.
       *[clean] Онгайлыкъ отчётну { $action ->
            [close] ябыв
           *[open] ачыв
        } учун басыгъыз. Онгайлыкъ масалалар табылмады.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA онгайлыкъ бузув табылды. { $count ->
            [one] { $count } WCAG AA бузув
           *[other] { $count } WCAG AA бузув
        } табылды. Онгайлыкъ отчётну { $action ->
            [close] ябыв
           *[open] ачыв
        } учун басыгъыз.
        [advisories] WCAG AA бузувлар табылмады. { $count ->
            [one] { $count } къошум онгайлыкъ таклиф
           *[other] { $count } къошум онгайлыкъ таклиф
        } табылды. Онгайлыкъ отчётну { $action ->
            [close] ябыв
           *[open] ачыв
        } учун басыгъыз.
       *[clean] WCAG AA бузувлар табылмады. Онгайлыкъ отчётну { $action ->
            [close] ябыв
           *[open] ачыв
        } учун басыгъыз.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версиясы { $version }

editor-tab-help = Контекст кёмеги
editor-tab-help-short = Контекст
editor-tab-errors = Янгылышлар
editor-tab-warnings = Эсгертивлер
editor-tab-info = Малумат
editor-tab-accessibility = Онгайлыкъ
editor-tab-responses = Йиберилген жаваплар

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторну параметрлери
editor-format-as-doenetml = DoenetML кюйде форматлав
editor-format-as-xml = XML кюйде форматлав


## The diagnostics panel

editor-diagnostic-line = Сатыр №{ $line }

editor-no-errors = Янгылышлар ёкъ
editor-no-warnings = Эсгертивлер ёкъ
editor-no-info = Малумат хабарлар ёкъ

editor-show-info-annotations = Малумат хабарланы редакторда гёрсетив
editor-show-accessibility-annotations = Онгайлыкъ хабарланы редакторда гёрсетив

editor-accessibility-learn-more = Doenet онгайлыкъгъа нечик къарайгъанын билигиз

editor-accessibility-violations-heading = Онгайлыкъ бузувлар ({ $standard })

editor-accessibility-other-heading = Оьзге онгайлыкъ масалалар
editor-none-found = Бир зат да табылмады


## Submitted responses

editor-no-responses = Гьалиге йиберилген жавап ёкъ
editor-response-answer-id = Жавапны Id-си
editor-response-response = Жавап
editor-response-credit = Балл
editor-response-submitted = Йиберилди


## The context-help panel

help-placeholder = Документацияны гёрмек учун курсорну тегни атына, атрибутгъа яда { $ref } уьстюне салыгъыз.

help-unsupported-ref-chain = { $example } йимик кёп бёлюклю силтевлер учун кёмек гьалиге ёкъ.

help-unresolved-ref =
    { $reason ->
        [notFound] Силтев учун объект табылмады: { $ref }.
        [multiple] Силтев учун бир нече объект табылды: { $ref }.
       *[indeterminate] { $ref } учун объектни белгилеп болмады.
    }

help-learn-about-references = Силтевлер гьакъда билигиз →
help-reference-page = Малумат бети →

help-suggestions-header =
    { $location ->
        [inside] { $element } ичинде
       *[top] Инг уьст даражада
    }{ $allowed ->
        [none] { " — мунда бир зат да гирмей." }
        [text] { " — мунда текст языгъыз." }
        [text-and-components] { " — мунда текст языгъыз, яда буланы сынагъыз:" }
       *[components] { " — буланы сынагъыз:" }
    }

help-suggestions-footer = Бары { $total } компонентни гёрмек учун { $shortcut } басыгъыз.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объектге силтев.
       *[other] { $ref } — { $target } объектге силтев ({ $line } сатыр).
    }

help-ref-derived-from =
    { $line ->
        [none] Ону { $owner } { $role } гьисапда гийирген.
       *[other] Ону { $owner } { $line } сатырда { $role } гьисапда гийирген.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементни { $property } къасиетине силтев.
       *[other] { $ref } — { $element } элементни { $property } къасиетине силтев ({ $line } сатыр).
    }

help-kind-attribute = атрибут
help-kind-snippet = уьзюк
help-kind-array-entry = массивни элементи

help-default = Келишив бойунча къыймат:
help-active-default = Ишлейген келишив бойунча къыймат:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ихтияр берилген къыйматлар (гьар элементге бирев):
       *[other] Ихтияр берилген къыйматлар:
    }

help-suggested-values = Таклиф этилген къыйматлар:

help-inserts = Къоша:

help-coordinates =
    { $count ->
        [one] Координат:
       *[other] Координатлар:
    }

help-type = Тюр:

help-resolved-style = Белгиленген стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Белгиленген функцияланы атлары:
help-reset-list = Бу гиришде къайтарыв сиягьы:
help-added-on-input = Бу гиришде къошулгъанлар:
help-removed-on-input = Бу гиришден гетерилгенлер:

help-reset-overrides = { $reset } { $additional } ва { $removed } атрибутлардан уьстюн геле.
