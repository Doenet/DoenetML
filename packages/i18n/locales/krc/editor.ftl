# Karachay-Balkar editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Cyrillic orthography of Karachay-Cherkessia and
# Kabardino-Balkaria, in the Karachay literary norm (дж- rather than Balkar
# ж-); `content.ftl`'s header says what that choice does and does not cover.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Karachay-Balkar counts in the same two categories English does, so every
# selection below keeps both branches — though a noun after a numeral stays
# singular, so the two read alike apart from the number.
#
# Nothing here agrees with a gender or a noun class: the language has neither.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Артха къайтарыу
       *[update] Джангыртыу
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Кёргюзтюучюню { $word }
       *[other] Кёргюзтюучюню { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Сюзюу…
editor-variant-next = Келлик вариантны сайлау
editor-variant-previous = Алгъыннгы вариантны сайлау


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA джетимлилик бузукълукъ табылды. Джетимлилик хапарны { $action ->
            [close] джабар
           *[open] ачар
        } ючюн басыгъыз.
        [advisories] Джетимлилик хапарны { $action ->
            [close] джабар
           *[open] ачар
        } ючюн басыгъыз. WCAG AA бузукълукъла табылмадыла, алай къошакъ джетимлилик теджеуле бардыла.
       *[clean] Джетимлилик хапарны { $action ->
            [close] джабар
           *[open] ачар
        } ючюн басыгъыз. Джетимлилик бла байламлы проблема табылмады.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA джетимлилик бузукълукъ табылды. { $count ->
            [one] { $count } WCAG AA бузукълукъ
           *[other] { $count } WCAG AA бузукълукъ
        } табылды. Джетимлилик хапарны { $action ->
            [close] джабар
           *[open] ачар
        } ючюн басыгъыз.
        [advisories] WCAG AA бузукълукъла табылмадыла. { $count ->
            [one] { $count } къошакъ джетимлилик теджеу
           *[other] { $count } къошакъ джетимлилик теджеу
        } табылды. Джетимлилик хапарны { $action ->
            [close] джабар
           *[open] ачар
        } ючюн басыгъыз.
       *[clean] WCAG AA бузукълукъла табылмадыла. Джетимлилик хапарны { $action ->
            [close] джабар
           *[open] ачар
        } ючюн басыгъыз.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML { $version } версия

editor-tab-help = Орунуна кёре болушлукъ
editor-tab-help-short = Орун
editor-tab-errors = Халатла
editor-tab-warnings = Эсгертиуле
editor-tab-info = Билдириу
editor-tab-accessibility = Джетимлилик
editor-tab-responses = Джиберилген джууапла

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторну амаллары
editor-format-as-doenetml = DoenetML халда джарашдырыу
editor-format-as-xml = XML халда джарашдырыу


## The diagnostics panel

editor-diagnostic-line = Тизгин #{ $line }

editor-no-errors = Халатла джокъдула
editor-no-warnings = Эсгертиуле джокъдула
editor-no-info = Билдириу джокъду

editor-show-info-annotations = Билдириулени редакторда кёргюзюу
editor-show-accessibility-annotations = Джетимлилик эсгертиулени редакторда кёргюзюу

editor-accessibility-learn-more = Doenet джетимлиликге къалай къарагъанын билигиз

editor-accessibility-violations-heading = Джетимлилик бузукълукъла ({ $standard })

editor-accessibility-other-heading = Джетимлилик бла байламлы башха ишле
editor-none-found = Бир зат да табылмады


## Submitted responses

editor-no-responses = Алкъын джиберилген джууап джокъду
editor-response-answer-id = Джууапны ID-си
editor-response-response = Джууап
editor-response-credit = Балл
editor-response-submitted = Джиберилди


## The context-help panel

help-placeholder = Документация ючюн курсорну тегни атына, атрибутха неда { $ref } юсюне салыгъыз.

help-unsupported-ref-chain = { $example } кибик кёб кесекли ссылкала ючюн болушлукъ алкъын джокъду.

help-unresolved-ref =
    { $reason ->
        [notFound] Ссылка ючюн зат табылмады: { $ref }.
        [multiple] Ссылка ючюн бир къауум зат табылды: { $ref }.
       *[indeterminate] { $ref } ючюн зат белгиленмеди.
    }

help-learn-about-references = Ссылкаланы юсюнден билигиз →
help-reference-page = Справочник бет →

help-suggestions-header =
    { $location ->
        [inside] { $element } ичинде
       *[top] Эм башында
    }{ $allowed ->
        [none] { " — мында бир зат да салынмайды." }
        [text] { " — мында текст джазыгъыз." }
        [text-and-components] { " — мында текст джазыгъыз неда быланы сынагъыз:" }
       *[components] { " — сынаргъа боллукъла:" }
    }

help-suggestions-footer = Битеу { $total } компонентни кёрюр ючюн { $shortcut } басыгъыз.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } затха ссылка.
       *[other] { $ref } — { $target } затха ссылка ({ $line } тизгин).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } киргизгенди, { $role } халда.
       *[other] { $owner } { $line } тизгинде киргизгенди, { $role } халда.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементни { $property } къасиетине ссылка.
       *[other] { $ref } — { $element } элементни { $property } къасиетине ссылка ({ $line } тизгин).
    }

help-kind-attribute = атрибут
help-kind-snippet = юзюк
help-kind-array-entry = массивни кесеги

help-default = Сынгар къыймат:
help-active-default = Ишлеген сынгар къыймат:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Эркин этилген къыйматла (хар кесекге бирер):
       *[other] Эркин этилген къыйматла:
    }

help-suggested-values = Теджелген къыйматла:

help-inserts = Салынады:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатала:
    }

help-type = Тюр:

help-resolved-style = Белгиленнген стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Белгиленнген функция атла:
help-reset-list = Бу кириуде тизмени артха къайтарыу:
help-added-on-input = Бу кириуде къошулгъан:
help-removed-on-input = Бу кириуде кетерилген:

help-reset-overrides = { $reset } { $additional } бла { $removed } къыйматланы алмаштырады.
