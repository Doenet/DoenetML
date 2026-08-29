# Komi-Zyrian editor and language-server surfaces. Translated from
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
# **Komi-Zyrian**, the literary standard of the Komi Republic. The directory is
# named `kpv` rather than the macrolanguage `kv` because Komi-Permyak ships
# beside it as `locales/koi`; `negotiate.ts` aliases `kv` onto `kpv`, so a
# document written with either tag reaches this catalog. See
# `locales/kpv/content.ftl` for the full note.
#
# Komi-Zyrian counts in the same two categories English does, so every
# selection below
# keeps both branches — though a noun after a numeral stays singular, so the
# two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Бӧр вайны
       *[update] Выльмӧдны
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Видзӧдысьсӧ { $word }
       *[other] Видзӧдысьсӧ { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Бӧрйӧм…
editor-variant-next = Водзӧ вариант бӧрйыны
editor-variant-previous = Бӧрын вариант бӧрйыны


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA воан позянлун торкӧм аддзӧма. Воан позянлун отчёт { $action ->
            [close] пӧдлавны
           *[open] восьтны
        } вӧсна ляпкы.
        [advisories] Воан позянлун отчёт { $action ->
            [close] пӧдлавны
           *[open] восьтны
        } вӧсна ляпкы. WCAG AA торкӧмъяс эз аддзысьны, но содтӧд индӧдъяс эмӧсь.
       *[clean] Воан позянлун отчёт { $action ->
            [close] пӧдлавны
           *[open] восьтны
        } вӧсна ляпкы. Воан позянлун могъяс эз аддзысьны.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA воан позянлун торкӧм аддзӧма. { $count ->
            [one] { $count } WCAG AA торкӧм
           *[other] { $count } WCAG AA торкӧм
        } аддзӧма. Воан позянлун отчёт { $action ->
            [close] пӧдлавны
           *[open] восьтны
        } вӧсна ляпкы.
        [advisories] WCAG AA торкӧмъяс эз аддзысьны. { $count ->
            [one] { $count } содтӧд индӧд
           *[other] { $count } содтӧд индӧд
        } аддзӧма. Воан позянлун отчёт { $action ->
            [close] пӧдлавны
           *[open] восьтны
        } вӧсна ляпкы.
       *[clean] WCAG AA торкӧмъяс эз аддзысьны. Воан позянлун отчёт { $action ->
            [close] пӧдлавны
           *[open] восьтны
        } вӧсна ляпкы.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версия { $version }

editor-tab-help = Контекст отсӧг
editor-tab-help-short = Контекст
editor-tab-errors = Тшыкӧдчӧмъяс
editor-tab-warnings = Пасйӧмъяс
editor-tab-info = Юӧр
editor-tab-accessibility = Воан позянлун
editor-tab-responses = Мӧдӧдӧм вочакывъяс

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторлӧн лӧсьӧдӧмъясыс
editor-format-as-doenetml = DoenetML моз форматируйтны
editor-format-as-xml = XML моз форматируйтны


## The diagnostics panel

editor-diagnostic-line = { $line }-ӧд визь

editor-no-errors = Тшыкӧдчӧмъяс абуӧсь
editor-no-warnings = Пасйӧмъяс абуӧсь
editor-no-info = Юӧр висьталӧмъяс абуӧсь

editor-show-info-annotations = Юӧр висьталӧмъяссӧ редакторын петкӧдлыны
editor-show-accessibility-annotations = Воан позянлун висьталӧмъяссӧ редакторын петкӧдлыны

editor-accessibility-learn-more = Doenet воан позянлун вылӧ кыдзи видзӧдӧ

editor-accessibility-violations-heading = Воан позянлун торкӧмъяс ({ $standard })

editor-accessibility-other-heading = Мукӧд воан позянлун могъяс
editor-none-found = Немтор эз аддзысь


## Submitted responses

editor-no-responses = Ӧнӧдз мӧдӧдӧм вочакывъяс абуӧсь
editor-response-answer-id = Вочакывлӧн Id-ыс
editor-response-response = Вочакыв
editor-response-credit = Балл
editor-response-submitted = Мӧдӧдӧма


## The context-help panel

help-placeholder = Документация аддзӧм вӧсна курсорсӧ тег ним вылӧ, атрибут вылӧ либӧ { $ref } вылӧ пукты.

help-unsupported-ref-chain = { $example } кодь уна юкӧна йитӧдъяслы отсӧг ӧнӧдз абу.

help-unresolved-ref =
    { $reason ->
        [notFound] Йитӧдлы объект эз аддзысь: { $ref }.
        [multiple] Йитӧдлы уна объект аддзӧма: { $ref }.
       *[indeterminate] { $ref } объектсӧ тӧдмавны эз артмы.
    }

help-learn-about-references = Йитӧдъяс йылысь тӧдмавны →
help-reference-page = Индӧд лист бок →

help-suggestions-header =
    { $location ->
        [inside] { $element } пытшкын
       *[top] Медвылыс тшупӧдын
    }{ $allowed ->
        [none] { " — тані немтор оз тӧр." }
        [text] { " — тані текст гижны позьӧ." }
        [text-and-components] { " — тані текст гижны позьӧ, либӧ тайӧс видлы:" }
       *[components] { " — тайӧс видлыны позьӧ:" }
    }

help-suggestions-footer = Став { $total } компонентсӧ аддзӧм вӧсна { $shortcut } ляпкы.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объект вылӧ йитӧд.
       *[other] { $ref } — { $target } объект вылӧ йитӧд ({ $line }-ӧд визь).
    }

help-ref-derived-from =
    { $line ->
        [none] Сійӧс { $owner } { $role } моз пыртіс.
       *[other] Сійӧс { $owner } { $line }-ӧд визьын { $role } моз пыртіс.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементлӧн { $property } свойствоыс вылӧ йитӧд.
       *[other] { $ref } — { $element } элементлӧн { $property } свойствоыс вылӧ йитӧд ({ $line }-ӧд визь).
    }

help-kind-attribute = атрибут
help-kind-snippet = юкӧн
help-kind-array-entry = массивлӧн элементыс

help-default = Подув дон:
help-active-default = Ӧнія подув дон:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Позьтана донъяс (быд элементлы ӧти):
       *[other] Позьтана донъяс:
    }

help-suggested-values = Индӧм донъяс:

help-inserts = Содтӧ:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатаяс:
    }

help-type = Ногыс:

help-resolved-style = Петӧм стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Петӧм функциялӧн нимъясыс:
help-reset-list = Тайӧ ин бӧр вайӧм список:
help-added-on-input = Тайӧ инын содтӧмъяс:
help-removed-on-input = Тайӧ инысь бӧрйӧмъяс:

help-reset-overrides = { $reset } — { $additional } да { $removed } вылын вермӧ.
