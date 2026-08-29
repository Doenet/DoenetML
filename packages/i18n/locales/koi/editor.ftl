# Komi-Permyak editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with Komi's ӧ — but **not** with the і that Komi-Zyrian
# writes, which is not a letter of the Komi-Permyak alphabet.
#
# Komi-Permyak (`koi`) is a member of the Komi macrolanguage (`kv`) that until
# now was folded onto the Komi-Zyrian catalog by `MACROLANGUAGE_MEMBERS` in
# `src/negotiate.ts`. It is a written standard of its own, so it now has a
# catalog of its own and that fold is removed. In the words this file contains
# its spelling parts from `locales/kv`'s by the plural -эз rather than Zyrian
# -яс (тшыкӧдчӧмэз, вочакывэз, координатаэз), by writing no і (вӧли for kv's
# вӧлі), and by «либо» where Zyrian writes «либӧ».
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Komi-Permyak counts in the same two categories English does, so every
# selection below keeps both branches — though a noun after a numeral stays
# singular, so the two read alike.


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
        } вӧсна ляпкы. WCAG AA торкӧмэз эз аддзысьны, но содтӧд индӧдэз эмӧсь.
       *[clean] Воан позянлун отчёт { $action ->
            [close] пӧдлавны
           *[open] восьтны
        } вӧсна ляпкы. Воан позянлун могэз эз аддзысьны.
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
        [advisories] WCAG AA торкӧмэз эз аддзысьны. { $count ->
            [one] { $count } содтӧд индӧд
           *[other] { $count } содтӧд индӧд
        } аддзӧма. Воан позянлун отчёт { $action ->
            [close] пӧдлавны
           *[open] восьтны
        } вӧсна ляпкы.
       *[clean] WCAG AA торкӧмэз эз аддзысьны. Воан позянлун отчёт { $action ->
            [close] пӧдлавны
           *[open] восьтны
        } вӧсна ляпкы.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версия { $version }

editor-tab-help = Контекст отсӧг
editor-tab-help-short = Контекст
editor-tab-errors = Тшыкӧдчӧмэз
editor-tab-warnings = Пасйӧмэз
editor-tab-info = Юӧр
editor-tab-accessibility = Воан позянлун
editor-tab-responses = Мӧдӧдӧм вочакывэз

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторлӧн лӧсьӧдӧмэзыс
editor-format-as-doenetml = DoenetML моз форматируйтны
editor-format-as-xml = XML моз форматируйтны


## The diagnostics panel

editor-diagnostic-line = { $line }-ӧд визь

editor-no-errors = Тшыкӧдчӧмэз абуӧсь
editor-no-warnings = Пасйӧмэз абуӧсь
editor-no-info = Юӧр висьталӧмэз абуӧсь

editor-show-info-annotations = Юӧр висьталӧмэзсӧ редакторын петкӧдлыны
editor-show-accessibility-annotations = Воан позянлун висьталӧмэзсӧ редакторын петкӧдлыны

editor-accessibility-learn-more = Doenet воан позянлун вылӧ кыдзи видзӧдӧ

editor-accessibility-violations-heading = Воан позянлун торкӧмэз ({ $standard })

editor-accessibility-other-heading = Мукӧд воан позянлун могэз
editor-none-found = Немтор эз аддзысь


## Submitted responses

editor-no-responses = Ӧнӧдз мӧдӧдӧм вочакывэз абуӧсь
editor-response-answer-id = Вочакывлӧн Id-ыс
editor-response-response = Вочакыв
editor-response-credit = Балл
editor-response-submitted = Мӧдӧдӧма


## The context-help panel

help-placeholder = Документация аддзӧм вӧсна курсорсӧ тег ним вылӧ, атрибут вылӧ либо { $ref } вылӧ пукты.

help-unsupported-ref-chain = { $example } кодь уна юкӧна йитӧдэзлы отсӧг ӧнӧдз абу.

help-unresolved-ref =
    { $reason ->
        [notFound] Йитӧдлы объект эз аддзысь: { $ref }.
        [multiple] Йитӧдлы уна объект аддзӧма: { $ref }.
       *[indeterminate] { $ref } объектсӧ тӧдмавны эз артмы.
    }

help-learn-about-references = Йитӧдэз йылысь тӧдмавны →
help-reference-page = Индӧд лист бок →

help-suggestions-header =
    { $location ->
        [inside] { $element } пытшкын
       *[top] Медвылыс тшупӧдын
    }{ $allowed ->
        [none] { " — тани немтор оз тӧр." }
        [text] { " — тани текст гижны позьӧ." }
        [text-and-components] { " — тани текст гижны позьӧ, либо тайӧс видлы:" }
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
        [none] Сийӧс { $owner } { $role } моз пыртис.
       *[other] Сийӧс { $owner } { $line }-ӧд визьын { $role } моз пыртис.
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
help-active-default = Ӧния подув дон:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Позьтана донэз (быд элементлы ӧти):
       *[other] Позьтана донэз:
    }

help-suggested-values = Индӧм донэз:

help-inserts = Содтӧ:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатаэз:
    }

help-type = Ногыс:

help-resolved-style = Петӧм стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Петӧм функциялӧн нимэзыс:
help-reset-list = Тайӧ ин бӧр вайӧм список:
help-added-on-input = Тайӧ инын содтӧмэз:
help-removed-on-input = Тайӧ инысь бӧрйӧмэз:

help-reset-overrides = { $reset } — { $additional } да { $removed } вылын вермӧ.
