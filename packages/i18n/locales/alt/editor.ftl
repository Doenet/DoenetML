# Southern Altai editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Cyrillic in the standard Altai alphabet, with **ј ҥ ӧ ӱ** as full letters and
# not as `дж`, `нг` or their Russian look-alikes — the same convention as the
# other three files of this locale.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay in English exactly as written.
#
# This is the thinnest of the four Altai files. An editor's vocabulary —
# filter, format, diagnostic, context help — has no Altai equivalent that has
# ever been written down, so the Russian words stand where nothing else could
# be established: `редактор`, `формат`, `вариант`, `контекст`, `атрибут`,
# `массив`, `координата`, `стиль`, `версия`, `строка`. See
# `locales/alt/content.ftl` for the general note on the register.
#
# Altai leaves a noun singular after a numeral, and `Intl.PluralRules` has no
# data for `alt`, so every count selection is a single `*[other]`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Кайра эдер
       *[update] Јаҥыртар
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Кӧрӱмди { $word }
       *[other] Кӧрӱмди { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Шӱӱр…
editor-variant-next = Кийниндеги вариантты талдаар
editor-variant-previous = Озогы вариантты талдаар


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA тузаланар арганыҥ бузулганы табылган. Тузаланар арга керегинде отчётты { $action ->
            [close] јабарга
           *[open] ачарга
        } базыгар.
        [advisories] Тузаланар арга керегинде отчётты { $action ->
            [close] јабарга
           *[open] ачарга
        } базыгар. WCAG AA бузулталар табылбаган, је кожо сӱмелер бар.
       *[clean] Тузаланар арга керегинде отчётты { $action ->
            [close] јабарга
           *[open] ачарга
        } базыгар. Тузаланар арга сурактар табылбаган.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA тузаланар арганыҥ бузулганы табылган. { $count ->
           *[other] { $count } WCAG AA бузулта
        } табылган. Тузаланар арга керегинде отчётты { $action ->
            [close] јабарга
           *[open] ачарга
        } базыгар.
        [advisories] WCAG AA бузулталар табылбаган. { $count ->
           *[other] { $count } кожо тузаланар арга сӱмези
        } табылган. Тузаланар арга керегинде отчётты { $action ->
            [close] јабарга
           *[open] ачарга
        } базыгар.
       *[clean] WCAG AA бузулталар табылбаган. Тузаланар арга керегинде отчётты { $action ->
            [close] јабарга
           *[open] ачарга
        } базыгар.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версиязы { $version }

editor-tab-help = Контекст аайынча болуш
editor-tab-help-short = Контекст
editor-tab-errors = Јастыралар
editor-tab-warnings = Эскертӱлер
editor-tab-info = Јетирӱ
editor-tab-accessibility = Тузаланар арга
editor-tab-responses = Ийилген каруулар

editor-tab-with-count = { $label }: { $count }

editor-options = Редактордыҥ тургузулары
editor-format-as-doenetml = DoenetML чылап форматтаар
editor-format-as-xml = XML чылап форматтаар


## The diagnostics panel

editor-diagnostic-line = { $line } строка

editor-no-errors = Јастыра јок
editor-no-warnings = Эскертӱ јок
editor-no-info = Јетирӱ јок

editor-show-info-annotations = Јетирӱлерди редакторло кӧргӱзер
editor-show-accessibility-annotations = Тузаланар арга јетирӱлерин редакторло кӧргӱзер

editor-accessibility-learn-more = Doenet тузаланар аргага канайып кӧрӧтӧнин билигер

editor-accessibility-violations-heading = Тузаланар арганыҥ бузулталары ({ $standard })

editor-accessibility-other-heading = Ӧскӧ тузаланар арга сурактар
editor-none-found = Не де табылбаган


## Submitted responses

editor-no-responses = Ийилген каруу је јок
editor-response-answer-id = Карууныҥ Id-зи
editor-response-response = Каруу
editor-response-credit = Балл
editor-response-submitted = Ийилген


## The context-help panel

help-placeholder = Документацияны кӧрӧргӧ курсорды тег адына, атрибутка эмезе { $ref } ӱстине салыгар.

help-unsupported-ref-chain = { $example } чылап кӧп кезектӱ шилтӱлерге болуш је јок.

help-unresolved-ref =
    { $reason ->
        [notFound] Шилтӱге не де табылбаган: { $ref }.
        [multiple] Шилтӱге кӧп неме табылган: { $ref }.
       *[indeterminate] { $ref } учун немени јартаарга болбоды.
    }

help-learn-about-references = Шилтӱлер керегинде билигер →
help-reference-page = Јартамал бӱк →

help-suggestions-header =
    { $location ->
        [inside] { $element } ичинде
       *[top] Ӱстиги кемде
    }{ $allowed ->
        [none] { " — мында не де турбайт." }
        [text] { " — мында текст бичигер." }
        [text-and-components] { " — мында текст бичигер, эмезе мыналарды шенегер:" }
       *[components] { " — мыналарды шенегер:" }
    }

help-suggestions-footer = Ончо { $total } компонентти кӧрӧргӧ { $shortcut } базыгар.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } учун шилтӱ.
       *[other] { $ref } — { $target } учун шилтӱ ({ $line } строка).
    }

help-ref-derived-from =
    { $line ->
        [none] Оны { $owner } { $role } чылап киргискен.
       *[other] Оны { $owner } { $line } строкада { $role } чылап киргискен.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементтиҥ { $property } свойствозына шилтӱ.
       *[other] { $ref } — { $element } элементтиҥ { $property } свойствозына шилтӱ ({ $line } строка).
    }

help-kind-attribute = атрибут
help-kind-snippet = ӱзӱк
help-kind-array-entry = массив элементи

help-default = Тӧс учур:
help-active-default = Амадагы тӧс учур:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Јарадылган учурлар (ар бир элементке бирӱден):
       *[other] Јарадылган учурлар:
    }

help-suggested-values = Сӱме эдилген учурлар:

help-inserts = Кожот:

help-coordinates =
    { $count ->
       *[other] Координаталар:
    }

help-type = Тӱри:

help-resolved-style = Табылган стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Табылган функция аттары:
help-reset-list = Бу киргискенде кайра эдер список:
help-added-on-input = Бу киргискенге кожулганы:
help-removed-on-input = Бу киргискеннеҥ јоголтконы:

help-reset-overrides = { $reset } — { $additional } ла { $removed } ӱстинеҥ тузаланат.
