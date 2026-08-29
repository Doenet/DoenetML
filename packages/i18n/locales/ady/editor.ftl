# Adyghe (West Circassian) editor and language-server surfaces. Translated
# from `locales/en/editor.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with Ӏ (palochka), which is a letter and not a Latin I
# or a digit 1 — see `content.ftl`'s header, which says why that matters more
# in Adyghe than in most Cyrillic orthographies.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Adyghe counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular and
# the numeral follows it, so the two branches read alike apart from the
# number. Nothing here agrees with a gender or a noun class; Adyghe has
# neither.
#
# The editor's own vocabulary is where this file is weakest. Adyghe has no
# settled words for "variant", "diagnostic" or "accessibility", so this seed
# writes the Russian terms an Adyghe author already meets in the software
# around the editor — «вариант», «диагностикэ», «доступность» — rather than
# coining three. A speaker replacing them should replace them everywhere.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ыпэрэм фэдэу гъэуцужьын
       *[update] ГъэкӀэрэкӀэжьын
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] КъэгъэлъэгъуапӀэр { $word }
       *[other] КъэгъэлъэгъуапӀэр { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Къыхэхын…
editor-variant-next = КӀэлъыкӀорэ вариантыр къыхэхын
editor-variant-previous = Ыпэрэ вариантыр къыхэхын


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA доступностым икъутэныгъ къэгъотыгъэ хъугъэ. Доступностым иотчёт { $action ->
            [close] зэфэшӀыжьыным
           *[open] къызэӀухыным
        } фэшӀ тепӀытӀ.
        [advisories] Доступностым иотчёт { $action ->
            [close] зэфэшӀыжьыным
           *[open] къызэӀухыным
        } фэшӀ тепӀытӀ. WCAG AA икъутэныгъэхэр къэгъотыгъэхэ хъугъэп, ау доступностымкӀэ нэмыкӀ чэнджэшхэр щыӀэх.
       *[clean] Доступностым иотчёт { $action ->
            [close] зэфэшӀыжьыным
           *[open] къызэӀухыным
        } фэшӀ тепӀытӀ. ДоступностымкӀэ гумэкӀыгъо къэгъотыгъэ хъугъэп.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA доступностым икъутэныгъ къэгъотыгъэ хъугъэ. { $count ->
            [one] WCAG AA икъутэныгъ { $count } къагъотыгъ
           *[other] WCAG AA икъутэныгъ { $count } къагъотыгъ
        }. Доступностым иотчёт { $action ->
            [close] зэфэшӀыжьыным
           *[open] къызэӀухыным
        } фэшӀ тепӀытӀ.
        [advisories] WCAG AA икъутэныгъ къэгъотыгъэ хъугъэп. { $count ->
            [one] ДоступностымкӀэ нэмыкӀ чэнджэш { $count } къагъотыгъ
           *[other] ДоступностымкӀэ нэмыкӀ чэнджэш { $count } къагъотыгъ
        }. Доступностым иотчёт { $action ->
            [close] зэфэшӀыжьыным
           *[open] къызэӀухыным
        } фэшӀ тепӀытӀ.
       *[clean] WCAG AA икъутэныгъ къэгъотыгъэ хъугъэп. Доступностым иотчёт { $action ->
            [close] зэфэшӀыжьыным
           *[open] къызэӀухыным
        } фэшӀ тепӀытӀ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML иверсие { $version }

editor-tab-help = ЧӀыпӀэм ехьылӀэгъэ ӀэпыӀэгъу
editor-tab-help-short = Контекст
editor-tab-errors = Щыуагъэхэр
editor-tab-warnings = Гъэсакъхэр
editor-tab-info = Къэбар
editor-tab-accessibility = Доступность
editor-tab-responses = ГъэкӀуагъэ джэуапхэр

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторым иӀэшӀагъэхэр
editor-format-as-doenetml = DoenetML фэдэу гъэпсын
editor-format-as-xml = XML фэдэу гъэпсын


## The diagnostics panel

editor-diagnostic-line = Сатыр #{ $line }

editor-no-errors = Щыуагъэхэр щыӀэп
editor-no-warnings = Гъэсакъхэр щыӀэп
editor-no-info = Къэбар диагностикэхэр щыӀэп

editor-show-info-annotations = Къэбар диагностикэхэр редакторым къыщэгъэлъагъох
editor-show-accessibility-annotations = Доступностым идиагностикэхэр редакторым къыщэгъэлъагъох

editor-accessibility-learn-more = Doenet доступностым зэрэдэлажьэрэр зэгъашӀ

editor-accessibility-violations-heading = Доступностым икъутэныгъэхэр ({ $standard })

editor-accessibility-other-heading = ДоступностымкӀэ нэмыкӀ гумэкӀыгъохэр
editor-none-found = Зи къэгъотыгъэ хъугъэп


## Submitted responses

editor-no-responses = ГъэкӀуагъэ джэуап джыри щыӀэп
editor-response-answer-id = Джэуапым иид
editor-response-response = Джэуап
editor-response-credit = Балл
editor-response-submitted = ГъэкӀуагъ


## The context-help panel

help-placeholder = Документацием пае курсорыр тегым ыцӀэ, атрибут е { $ref } тегъэуцу.

help-unsupported-ref-chain = { $example } фэдэ Ӏахьыбэ зыхэт ссылкэхэмкӀэ ӀэпыӀэгъур джыри щыӀэп.

help-unresolved-ref =
    { $reason ->
        [notFound] Ссылкэм ызыфигъазэрэр къэгъотыгъэ хъугъэп: { $ref }.
        [multiple] Ссылкэм ызыфигъазэрэ зыбгъупш къэгъотыгъэ хъугъ: { $ref }.
       *[indeterminate] { $ref } ызыфигъазэрэр гъэнэфагъэ хъушъугъэп.
    }

help-learn-about-references = Ссылкэхэм афэгъэхьыгъэу зэгъашӀ →
help-reference-page = Справочнэ нэкӀубгъу →

help-suggestions-header =
    { $location ->
        [inside] { $element } ыкӀоцӀ
       *[top] ШъхьаӀэ лъэгапӀэм
    }{ $allowed ->
        [none] { " — мыщ зи ифэрэп." }
        [text] { " — мыщ текст тебгъэуцон плъэкӀыщт." }
        [text-and-components] { " — мыщ текст тебгъэуцон, е мыхэр зэпыплъыхьан плъэкӀыщт:" }
       *[components] { " — зэпыплъыхьан плъэкӀыщтхэр:" }
    }

help-suggestions-footer = Компонент { $total } зэкӀэри плъэгъуным пае { $shortcut } тепӀытӀ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target } зыфэзыгъазэрэ ссылк.
       *[other] { $ref } { $target } зыфэзыгъазэрэ ссылк (сатыр { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } { $role } фэдэу къыхилъхьагъ.
       *[other] { $owner } { $role } фэдэу къыхилъхьагъ, сатыр { $line }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element } и { $property } свойствэ зыфэзыгъазэрэ ссылк.
       *[other] { $ref } { $element } и { $property } свойствэ зыфэзыгъазэрэ ссылк (сатыр { $line }).
    }

help-kind-attribute = атрибут
help-kind-snippet = сниппет
help-kind-array-entry = массивым итедзапӀ

help-default = ЫпэрапшӀэу гъэнэфагъэр:
help-active-default = Джы Ӏоф зышӀэрэ ыпэрапшӀэ гъэнэфагъэр:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Хэлъытэгъэ мэхьанэхэр (зы Ӏахьым — зы):
       *[other] Хэлъытэгъэ мэхьанэхэр:
    }

help-suggested-values = Чэнджэшыгъэ мэхьанэхэр:

help-inserts = Хелъхьэ:

help-coordinates =
    { $count ->
        [one] Координат:
       *[other] Координатхэр:
    }

help-type = Тип:

help-resolved-style = Гъэнэфэгъэ стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Гъэнэфэгъэ функцие цӀэхэр:
help-reset-list = Мы инпутым итхьапэ зэтегъэуцожьыгъ:
help-added-on-input = Мы инпутым хэгъэхьагъ:
help-removed-on-input = Мы инпутым хэгъэкӀыгъ:

help-reset-overrides = { $reset } { $additional } ыкӀи { $removed } акӀэрехьэ.
