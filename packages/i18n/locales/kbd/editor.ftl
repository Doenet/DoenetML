# Kabardian (East Circassian) editor and language-server surfaces. Translated
# from `locales/en/editor.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Cyrillic literary standard of Kabardino-Balkaria and
# Karachay-Cherkessia. The palochka Ӏ is a letter, not a Latin I and not a
# digit 1.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Kabardian counts in the same two categories English does, so every selection
# below keeps both branches — a noun takes no plural ending after a numeral, so
# the two read alike. A numeral follows the word it counts, so a count is
# written after its noun. Nothing here agrees with a gender or a class:
# Kabardian has neither, which `content.ftl` sets out in full.
#
# No case ending is welded onto a placeable anywhere in this file. Kabardian's
# oblique is «-м» after a vowel and «-ым» after a consonant, so a value whose
# last letter the catalog cannot see cannot be inflected; the identifiers this
# file receives — `$ref`, `$target`, `$element`, `$owner` — are therefore left
# bare and the sentence is built around them with free words.
#
# The weakest words here, and the first a speaker should replace: «Ӏэрыхуагъэ»
# for accessibility (formed from «Ӏэрыхуэ», handy, and not an established
# term), and «Ямыгъэувмэ:» / «Иджыпсту лажьэр:» for `help-default` and
# `help-active-default`, which paraphrase the idea rather than name it.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Егъэзэжын
       *[update] ГъэщӀэрэщӀэн
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] КъэгъэлъэгъуапӀэр { $word }
       *[other] КъэгъэлъэгъуапӀэр { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Къыхэхын…
editor-variant-next = Вариант къыкӀэлъыкӀуэр къыхэх
editor-variant-previous = Вариант ипэрейр къыхэх


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA Ӏэрыхуагъэм и къутэныгъэ къэгъуэтащ. Ӏэрыхуагъэм и отчётыр { $action ->
            [close] зэхуэщӀын
           *[open] Ӏухын
        } папщӀэ къытеӀуэ.
        [advisories] Ӏэрыхуагъэм и отчётыр { $action ->
            [close] зэхуэщӀын
           *[open] Ӏухын
        } папщӀэ къытеӀуэ. WCAG AA къутэныгъэ къэгъуэтакъым, ауэ Ӏэрыхуагъэм теухуа нэгъуэщӀ чэнджэщхэр щыӀэщ.
       *[clean] Ӏэрыхуагъэм и отчётыр { $action ->
            [close] зэхуэщӀын
           *[open] Ӏухын
        } папщӀэ къытеӀуэ. Ӏэрыхуагъэм теухуа гугъуехь къэгъуэтакъым.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA Ӏэрыхуагъэм и къутэныгъэ къэгъуэтащ. { $count ->
            [one] WCAG AA къутэныгъэ { $count }
           *[other] WCAG AA къутэныгъэ { $count }
        } къэгъуэтащ. Ӏэрыхуагъэм и отчётыр { $action ->
            [close] зэхуэщӀын
           *[open] Ӏухын
        } папщӀэ къытеӀуэ.
        [advisories] WCAG AA къутэныгъэ къэгъуэтакъым. { $count ->
            [one] Ӏэрыхуагъэм теухуа нэгъуэщӀ чэнджэщ { $count }
           *[other] Ӏэрыхуагъэм теухуа нэгъуэщӀ чэнджэщ { $count }
        } къэгъуэтащ. Ӏэрыхуагъэм и отчётыр { $action ->
            [close] зэхуэщӀын
           *[open] Ӏухын
        } папщӀэ къытеӀуэ.
       *[clean] WCAG AA къутэныгъэ къэгъуэтакъым. Ӏэрыхуагъэм и отчётыр { $action ->
            [close] зэхуэщӀын
           *[open] Ӏухын
        } папщӀэ къытеӀуэ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML верси { $version }

editor-tab-help = Контекстым елъытауэ дэӀэпыкъуэгъу
editor-tab-help-short = Контекст
editor-tab-errors = Щыуагъэхэр
editor-tab-warnings = Гъэсакъыныгъэхэр
editor-tab-info = Хъыбар
editor-tab-accessibility = Ӏэрыхуагъэ
editor-tab-responses = Ягъэхьа жэуапхэр

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторым и Ӏэмалхэр
editor-format-as-doenetml = DoenetML хуэдэу гъэпсын
editor-format-as-xml = XML хуэдэу гъэпсын


## The diagnostics panel

editor-diagnostic-line = Сатыр #{ $line }

editor-no-errors = Щыуагъэ щыӀэкъым
editor-no-warnings = Гъэсакъыныгъэ щыӀэкъым
editor-no-info = Хъыбар щыӀэкъым

editor-show-info-annotations = Хъыбархэр редакторым къыщыгъэлъэгъуэн
editor-show-accessibility-annotations = Ӏэрыхуагъэм и хъыбархэр редакторым къыщыгъэлъэгъуэн

editor-accessibility-learn-more = Doenet Ӏэрыхуагъэм зэрыбгъэдыхьэр зэгъащӀэ

editor-accessibility-violations-heading = Ӏэрыхуагъэм и къутэныгъэхэр ({ $standard })

editor-accessibility-other-heading = Ӏэрыхуагъэм теухуа нэгъуэщӀ гугъуехьхэр
editor-none-found = Зыри къэгъуэтакъым


## Submitted responses

editor-no-responses = Иджыри жэуап ягъэхьакъым
editor-response-answer-id = Жэуапым и Id
editor-response-response = Жэуап
editor-response-credit = Балл
editor-response-submitted = Ягъэхьащ


## The context-help panel

help-placeholder = Документацэ къэпщтэн папщӀэ курсорыр тегым и цӀэм, атрибутым е { $ref } тегъэувэ.

help-unsupported-ref-chain = { $example } хуэдэу Ӏыхьэ зыбжанэу зэхэт пыщӀэхэм я дэӀэпыкъуэгъу иджыри щыӀэкъым.

help-unresolved-ref =
    { $reason ->
        [notFound] ПыщӀэм и объект къэгъуэтакъым: { $ref }.
        [multiple] ПыщӀэм и объект куэд къэгъуэтащ: { $ref }.
       *[indeterminate] { $ref } зыхуэгъэза объектыр убзыхун хъуакъым.
    }

help-learn-about-references = ПыщӀэхэм я хъыбар зэгъащӀэ →
help-reference-page = Справочнэ напэкӀуэцӀ →

help-suggestions-header =
    { $location ->
        [inside] { $element } и кӀуэцӀым
       *[top] ЛъэгапӀэ нэхъыщхьэм
    }{ $allowed ->
        [none] { " — мыбдеж зыри хэхуэркъым." }
        [text] { " — мыбдеж текст птхы хъунущ." }
        [text-and-components] { " — мыбдеж текст птхы хъунущ, е мыхэр зэгъэлъагъу:" }
       *[components] { " — мыхэр зэгъэлъагъу:" }
    }

help-suggestions-footer = Компонент { $total } псори плъагъун папщӀэ { $shortcut } къытеӀуэ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — ар { $target } зыхуэгъэза пыщӀэщ.
       *[other] { $ref } — ар { $target } зыхуэгъэза пыщӀэщ (сатыр { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Къыхэзылъхьар { $owner }, и мыхьэнэр { $role }.
       *[other] Къыхэзылъхьар { $owner }, сатыр { $line }, и мыхьэнэр { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — ар { $element } и свойствэ { $property } зыхуэгъэза пыщӀэщ.
       *[other] { $ref } — ар { $element } и свойствэ { $property } зыхуэгъэза пыщӀэщ (сатыр { $line }).
    }

help-kind-attribute = атрибут
help-kind-snippet = пычыгъуэ
help-kind-array-entry = массивым и элемент

help-default = Ямыгъэувмэ:
help-active-default = Иджыпсту лажьэр:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Мыхьэнэ хуитхэр (Ӏыхьэ къэс зырыз):
       *[other] Мыхьэнэ хуитхэр:
    }

help-suggested-values = Мыхьэнэ чэнджэщахэр:

help-inserts = Хегъэхьэ:

help-coordinates =
    { $count ->
        [one] Координатэ:
       *[other] Координатэхэр:
    }

help-type = ЛӀэужьыгъуэ:

help-resolved-style = Стиль убзыхуа (styleNumber { $styleNumber }):

help-resolved-function-names = Функцэхэм я цӀэ убзыхуахэр:
help-reset-list = Мы хэлъхьапӀэм и списк егъэзэжыныгъэ:
help-added-on-input = Мы хэлъхьапӀэм хагъэхьар:
help-removed-on-input = Мы хэлъхьапӀэм хахар:

help-reset-overrides = { $reset } — { $additional } икӀи { $removed } тепщэ хуохъу.
