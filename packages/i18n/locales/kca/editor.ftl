# Khanty editor and language-server surfaces. Translated from
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
# `kca` is Khanty (хӑнты ясӑӈ), Ob-Ugric, written here towards the Kazym
# literary norm. See `content.ftl`'s header for the norm, for the Hungarian
# non-relationship, and for the list of coinages — this file leans on them as
# hard as any: nothing in an editor's footer or a language server's context
# help has ever been written in Khanty, so **most of the vocabulary below is
# coined rather than attested**, and a speaker should treat it as a first
# proposal rather than a translation.
#
# Khanty counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Йухԓы
       *[update] Йиԓӑпӑтты
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Вантты пєлӑк { $word }
       *[other] Вантты пєлӑк { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Вўштаԓӑм…
editor-variant-next = Кимет вариант вўштаты
editor-variant-previous = Оԓӑӈмет вариант вўштаты


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA юхӑтты рӑхты вєр кӑшӑԓӑм вөйӑтса. Юхӑтты рӑхты вєр отчёт { $action ->
            [close] пєнтты
           *[open] пўншты
        } ԓапӑта.
        [advisories] Юхӑтты рӑхты вєр отчёт { $action ->
            [close] пєнтты
           *[open] пўншты
        } ԓапӑта. WCAG AA кӑшӑԓӑмӑт ӑнт вөйӑтсайӑт, па нётты ясӑӈӑт вөԓӑт.
       *[clean] Юхӑтты рӑхты вєр отчёт { $action ->
            [close] пєнтты
           *[open] пўншты
        } ԓапӑта. Юхӑтты рӑхты вєр оԓӑӈӑн инщӑсты ясӑӈӑт ӑнт вөйӑтсайӑт.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA юхӑтты рӑхты вєр кӑшӑԓӑм вөйӑтса. { $count ->
            [one] { $count } WCAG AA кӑшӑԓӑм
           *[other] { $count } WCAG AA кӑшӑԓӑм
        } вөйӑтса. Юхӑтты рӑхты вєр отчёт { $action ->
            [close] пєнтты
           *[open] пўншты
        } ԓапӑта.
        [advisories] WCAG AA кӑшӑԓӑмӑт ӑнт вөйӑтсайӑт. { $count ->
            [one] { $count } нётты ясӑӈ
           *[other] { $count } нётты ясӑӈ
        } вөйӑтса. Юхӑтты рӑхты вєр отчёт { $action ->
            [close] пєнтты
           *[open] пўншты
        } ԓапӑта.
       *[clean] WCAG AA кӑшӑԓӑмӑт ӑнт вөйӑтсайӑт. Юхӑтты рӑхты вєр отчёт { $action ->
            [close] пєнтты
           *[open] пўншты
        } ԓапӑта.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версия { $version }

editor-tab-help = Кўтӑӈ нётты вєр
editor-tab-help-short = Кўт
editor-tab-errors = Ошибкаӑт
editor-tab-warnings = Ԓавӑԓты ясӑӈӑт
editor-tab-info = Нөмӑс
editor-tab-accessibility = Юхӑтты рӑхты вєр
editor-tab-responses = Китӑм вошты ясӑӈӑт

editor-tab-with-count = { $label }: { $count }

editor-options = Редактор ԓєщӑтты вєрӑт
editor-format-as-doenetml = DoenetML сирӑн ԓєщӑтты
editor-format-as-xml = XML сирӑн ԓєщӑтты


## The diagnostics panel

editor-diagnostic-line = { $line } строка

editor-no-errors = Ошибка ӑнтөм
editor-no-warnings = Ԓавӑԓты ясӑӈ ӑнтөм
editor-no-info = Нөмӑс ясӑӈ ӑнтөм

editor-show-info-annotations = Нөмӑс ясӑӈӑт редактор ԓыпийн вантӑԓты
editor-show-accessibility-annotations = Юхӑтты рӑхты вєр ясӑӈӑт редактор ԓыпийн вантӑԓты

editor-accessibility-learn-more = Doenet юхӑтты рӑхты вєр муй сирӑн вантӑԓ →

editor-accessibility-violations-heading = Юхӑтты рӑхты вєр кӑшӑԓӑмӑт ({ $standard })

editor-accessibility-other-heading = Па юхӑтты рӑхты вєр инщӑсты ясӑӈӑт
editor-none-found = Нємӑԓты ӑнт вөйӑтса


## Submitted responses

editor-no-responses = Ин китӑм вошты ясӑӈ ӑнтөм
editor-response-answer-id = Вошты ясӑӈ Id
editor-response-response = Вошты ясӑӈ
editor-response-credit = Балл
editor-response-submitted = Китса


## The context-help panel

help-placeholder = Документация вантты пата курсор тег нєм хуща, атрибут хуща муй { $ref } хуща пуна.

help-unsupported-ref-chain = { $example } сир ар пєлӑкӑп кӑтԓӑпса пата нётты вєр ӑт па ӑнтөм.

help-unresolved-ref =
    { $reason ->
        [notFound] Кӑтԓӑпса пата вєр ӑнт вөйӑтса: { $ref }.
        [multiple] Кӑтԓӑпса пата ар вєр вөйӑтса: { $ref }.
       *[indeterminate] { $ref } вєр ӑнт пасӑтса.
    }

help-learn-about-references = Кӑтԓӑпсаӑт оԓӑӈӑн уша верты →
help-reference-page = Справка страница →

help-suggestions-header =
    { $location ->
        [inside] { $element } ԓыпийн
       *[top] Мєт нўмпи кўтн
    }{ $allowed ->
        [none] { " — тӑта нємӑԓты ӑнт рӑхӑԓ." }
        [text] { " — тӑта текст хӑншты рӑхӑԓ." }
        [text-and-components] { " — тӑта текст хӑншты рӑхӑԓ, муй тӑми вантаԓӑн:" }
       *[components] { " — тӑми вантаԓӑн:" }
    }

help-suggestions-footer = Хуԓыева { $total } компонент вантты пата { $shortcut } ԓапӑта.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } вєр хуща кӑтԓӑпса.
       *[other] { $ref } — { $target } вєр хуща кӑтԓӑпса ({ $line } строка).
    }

help-ref-derived-from =
    { $line ->
        [none] Ԓўвеԓ { $owner } { $role } сирӑн пунса.
       *[other] Ԓўвеԓ { $owner } { $line } строка хуща { $role } сирӑн пунса.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элемент { $property } вєр хуща кӑтԓӑпса.
       *[other] { $ref } — { $element } элемент { $property } вєр хуща кӑтԓӑпса ({ $line } строка).
    }

help-kind-attribute = атрибут
help-kind-snippet = пєлӑк
help-kind-array-entry = массив элемент

help-default = Оԓӑӈ вєр:
help-active-default = Ин оԓӑӈ вєр:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Рӑхты вєрӑт (хуԓы элемент пата ит):
       *[other] Рӑхты вєрӑт:
    }

help-suggested-values = Мийӑм вєрӑт:

help-inserts = Пунӑԓ:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатаӑт:
    }

help-type = Сир:

help-resolved-style = Этӑм стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Этӑм функция нємӑт:
help-reset-list = Тӑм пєлӑк йухԓы вєрты списка:
help-added-on-input = Тӑм пєлӑк хуща пунса:
help-removed-on-input = Тӑм пєлӑк эвӑԓт ким ўса:

help-reset-overrides = { $reset } — { $additional } па { $removed } нўмпийн вөԓ.
