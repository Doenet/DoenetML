# Dungan (хуэйзў хуа / хуэйзў йүян) editor and language-server surfaces — the
# footer, the diagnostics panel, the variant picker, the accessibility button
# and the context-help panel beside them. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every element or attribute
# name are identifiers, not prose, and stay exactly as written. So do message
# ids.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Standard Dungan Cyrillic — the Soviet-era alphabet still in
# use in Kyrgyzstan and Kazakhstan: Russian letters plus **ә, җ, ң, ў, ү**.
# **Tones are unmarked**, as that orthography leaves them; there is no accent,
# macron, tone digit or tone letter anywhere in these four files, and a
# corrector must not introduce one. Nor should a corrector mix in **pinyin**
# (`zh`, `x`, `q`, `ü` are `җ`, `щ`, `ч`, `ү` here) or **Chinese characters**.
# `chrome.ftl`'s header states the convention in full.
#
# **Word order.** Modifier before noun, joined by the attributive particle
# **«ди»**: «доступность ди вынти», «дин ща ди функция ди мин». No gender, no
# agreement, no case.
#
# **Number.** Not marked after a numeral, and CLDR has no plural data for
# `dng`, so every plural select here is collapsed to a single `*[other]`. See
# `content.ftl`'s header for the reasoning.
#
# **This is the thinnest of the four files.** The editor's nouns are the
# vocabulary of a profession that is not practised in Dungan: there is no
# Dungan word for a variant, a filter, a component, a reference, an array, a
# snippet or a diagnostic, and this seed has not invented one. What is Dungan
# here is the **frame** — the verbs («кан» look, «щүан» choose, «дян» click,
# «җаоҗо» find, «фаңзэ» put at), the negation, the word order and «ди». The
# technical nouns are the **Russian words a Dungan speaker actually writes**,
# in Russian spelling and left **uninflected** in the nominative, because
# Dungan does not decline and a guessed Russian case ending would be a claim
# this seed cannot check. That trade is stated once here and holds for every
# line below.
#
# Russian loans in this file: вариант, фильтр, доступность, отчёт, версия,
# контекст, диагностика, редактор, Сброс,
# настройка, курсор, тег, атрибут, документация, ссылка, справочник,
# компонент, свойство, значение, тип, стиль, массив, фрагмент, список, ввод,
# просмотр, ошибка, предупреждение, Id. `WCAG` stays as the standard's name.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Сброс
       *[update] Гыңщин
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } просмотр
       *[other] { $word } просмотр { $shortcut }
    }


## The variant picker

editor-variant = Вариант

editor-variant-filter = Фильтр...

editor-variant-next = Щүан сяйигә вариант
editor-variant-previous = Щүан шаңйигә вариант


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA доступность ди вынти җаоҗола. Дян йиха { $action ->
            [close] гуаншаң
           *[open] дакэ
        } доступность ди отчёт.
        [advisories] Дян йиха { $action ->
            [close] гуаншаң
           *[open] дакэ
        } доступность ди отчёт. WCAG AA ди вынти йигә дў мый җаоҗо, дансы хэ ю битиди доступность ди тиши.
       *[clean] Дян йиха { $action ->
            [close] гуаншаң
           *[open] дакэ
        } доступность ди отчёт. Доступность ди вынти йигә дў мый җаоҗо.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA доступность ди вынти җаоҗола. Җаоҗо { $count ->
           *[other] { $count } гә WCAG AA ди вынти
        }. Дян йиха { $action ->
            [close] гуаншаң
           *[open] дакэ
        } доступность ди отчёт.
        [advisories] WCAG AA ди вынти йигә дў мый җаоҗо. Җаоҗо { $count ->
           *[other] { $count } гә битиди доступность ди тиши
        }. Дян йиха { $action ->
            [close] гуаншаң
           *[open] дакэ
        } доступность ди отчёт.
       *[clean] WCAG AA ди вынти йигә дў мый җаоҗо. Дян йиха { $action ->
            [close] гуаншаң
           *[open] дакэ
        } доступность ди отчёт.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версия { $version }

editor-tab-help = Контекст ди баңҗў
editor-tab-help-short = Контекст
editor-tab-errors = Ошибка
editor-tab-warnings = Предупреждение
editor-tab-info = Щёщи
editor-tab-accessibility = Доступность
editor-tab-responses = Сунхади хуэйда

editor-tab-with-count = { $label }: { $count }

editor-options = Редактор ди настройка
editor-format-as-doenetml = Ан DoenetML пайбан
editor-format-as-xml = Ан XML пайбан


## The diagnostics panel

editor-diagnostic-line = Хаң #{ $line }

editor-no-errors = Мый ю ошибка
editor-no-warnings = Мый ю предупреждение
editor-no-info = Мый ю щёщи ди диагностика

editor-show-info-annotations = Зэ редактор ли щянши щёщи ди диагностика
editor-show-accessibility-annotations = Зэ редактор ли щянши доступность ди диагностика

editor-accessibility-learn-more = Кан Doenet зынмә дуйдэ доступность

editor-accessibility-violations-heading = Доступность ди вынти ({ $standard })

editor-accessibility-other-heading = Битиди доступность ди вынти
editor-none-found = Йигә дў мый җаоҗо


## Submitted responses

editor-no-responses = Хэ мый сунха хуэйда
editor-response-answer-id = Даан ди Id
editor-response-response = Хуэйда
editor-response-credit = Фын
editor-response-submitted = Сунхала


## The context-help panel

help-placeholder = Ба курсор фаңзэ тег ди мин, атрибут хуәҗә { $ref } шаң, җё нын кан документация.

help-unsupported-ref-chain = Щяң { $example } җәяңди дуогә буфын ди ссылка, хэ мый ю баңҗў.

help-unresolved-ref =
    { $reason ->
        [notFound] { $ref }: та җы ди дунщи җаобуҗо.
        [multiple] { $ref }: та җы ди дунщи җаоҗо бу җы йигә.
       *[indeterminate] { $ref } җы ди сы шә дунщи, дин бучў.
    }

help-learn-about-references = Кан ссылка ди шомин →
help-reference-page = Справочник ди страница →

help-suggestions-header =
    { $location ->
        [inside] { $element } ли
       *[top] Зуй шаңтў ди дифаң
    }{ $allowed ->
        [none] { " — җәли шәму дў фаңбудә." }
        [text] { " — җәли кәи да вынзы." }
        [text-and-components] { " — җәли кәи да вынзы, хуәҗә шы йиха:" }
       *[components] { " — кәи шы йиха:" }
    }

help-suggestions-footer = Ан { $shortcut } кан чүанбў { $total } гә компонент.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } сы җы { $target } ди ссылка.
       *[other] { $ref } сы җы { $target } ди ссылка ({ $line } хаң).
    }

help-ref-derived-from =
    { $line ->
        [none] Сы { $owner } даң { $role } гый ди.
       *[other] Сы { $owner } зэ { $line } хаң шаң даң { $role } гый ди.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } сы җы { $element } ди { $property } свойство ди ссылка.
       *[other] { $ref } сы җы { $element } ди { $property } свойство ди ссылка ({ $line } хаң).
    }

help-kind-attribute = атрибут
help-kind-snippet = фрагмент
help-kind-array-entry = массив ди элемент

help-default = Мырян ди:
help-active-default = Җынзэ юңди мырян:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Кәи юңди значение (мый йигә ю йигә):
       *[other] Кәи юңди значение:
    }

help-suggested-values = Тиши ди значение:

help-inserts = Ча җинчў ди:

help-coordinates =
    { $count ->
       *[other] Координата:
    }

help-type = Тип:

help-resolved-style = Дин ща ди стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Дин ща ди функция ди мин:
help-reset-list = Җә ввод шаң ди сброс ди список:
help-added-on-input = Җә ввод шаң җяди:
help-removed-on-input = Җә ввод шаң начўди:

help-reset-overrides = { $reset } ба { $additional } гын { $removed } дў гэ ща ла.
