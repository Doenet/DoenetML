# Chuvash editor and language-server surfaces. Translated from
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
# `editor-accessibility-label` counts twice — violations and advisories — and
# both of its `{ $count -> … }` selectors write a `[zero]` branch, which Chuvash
# resolves for exactly 0; see the note in `chrome.ftl` on how that differs from
# `locales/lv`'s category of the same name. Both are reached rather than
# decorative: neither selector has an explicit `[0]` branch to win first.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Каялла
       *[update] Ҫӗнетес
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Пӑхмаллине { $word }
       *[other] Пӑхмаллине { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Суйласа илни…
editor-variant-next = Тепӗр варианта суйлас
editor-variant-previous = Малтанхи варианта суйлас


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA майлӑх пӑсӑлӑвӗ тупӑнчӗ. Майлӑх отчетне { $action ->
            [close] хупма
           *[open] уҫма
        } пусӑр.
        [advisories] Майлӑх отчетне { $action ->
            [close] хупма
           *[open] уҫма
        } пусӑр. WCAG AA пӑсӑлӑвӗсем тупӑнмарӗҫ, анчах хушма сӗнӳсем пур.
       *[clean] Майлӑх отчетне { $action ->
            [close] хупма
           *[open] уҫма
        } пусӑр. Майлӑх проблемисем тупӑнмарӗҫ.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA майлӑх пӑсӑлӑвӗ тупӑнчӗ. { $count ->
            [zero] Пӗр WCAG AA пӑсӑлӑвӗ те
            [one] { $count } WCAG AA пӑсӑлӑвӗ
           *[other] { $count } WCAG AA пӑсӑлӑвӗ
        } тупӑнчӗ. Майлӑх отчетне { $action ->
            [close] хупма
           *[open] уҫма
        } пусӑр.
        [advisories] WCAG AA пӑсӑлӑвӗсем тупӑнмарӗҫ. { $count ->
            [zero] Пӗр хушма сӗнӳ те
            [one] { $count } хушма сӗнӳ
           *[other] { $count } хушма сӗнӳ
        } тупӑнчӗ. Майлӑх отчетне { $action ->
            [close] хупма
           *[open] уҫма
        } пусӑр.
       *[clean] WCAG AA пӑсӑлӑвӗсем тупӑнмарӗҫ. Майлӑх отчетне { $action ->
            [close] хупма
           *[open] уҫма
        } пусӑр.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версийӗ { $version }

editor-tab-help = Контекст пулӑшӑвӗ
editor-tab-help-short = Контекст
editor-tab-errors = Йӑнӑшсем
editor-tab-warnings = Асӑрхаттарусем
editor-tab-info = Информаци
editor-tab-accessibility = Майлӑх
editor-tab-responses = Янӑ хуравсем

editor-tab-with-count = { $label }: { $count }

editor-options = Редактор ӗнерлевӗсем
editor-format-as-doenetml = DoenetML пек форматлас
editor-format-as-xml = XML пек форматлас


## The diagnostics panel

editor-diagnostic-line = { $line }-мӗш йӗрке

editor-no-errors = Йӑнӑшсем ҫук
editor-no-warnings = Асӑрхаттарусем ҫук
editor-no-info = Информаци хыпарӗсем ҫук

editor-show-info-annotations = Информаци хыпарӗсене редакторта кӑтартас
editor-show-accessibility-annotations = Майлӑх хыпарӗсене редакторта кӑтартас

editor-accessibility-learn-more = Doenet майлӑх ҫине мӗнле пӑхать

editor-accessibility-violations-heading = Майлӑх пӑсӑлӑвӗсем ({ $standard })

editor-accessibility-other-heading = Майлӑхӑн ытти проблемисем
editor-none-found = Нимӗн те тупӑнмарӗ


## Submitted responses

editor-no-responses = Халӗ таран янӑ хуравсем ҫук
editor-response-answer-id = Хуравӑн Id-йӗ
editor-response-response = Хурав
editor-response-credit = Балл
editor-response-submitted = Янӑ


## The context-help panel

help-placeholder = Документацие курас тесен курсора тег ячӗ, атрибут е { $ref } ҫине лартӑр.

help-unsupported-ref-chain = { $example } пек нумай пайлӑ каҫӑсем валли пулӑшу халӗ ҫук.

help-unresolved-ref =
    { $reason ->
        [notFound] Каҫӑ валли объект тупӑнмарӗ: { $ref }.
        [multiple] Каҫӑ валли темиҫе объект тупӑнчӗ: { $ref }.
       *[indeterminate] { $ref } валли объекта палӑртма пулмарӗ.
    }

help-learn-about-references = Каҫӑсем ҫинчен пӗлес →
help-reference-page = Справка страници →

help-suggestions-header =
    { $location ->
        [inside] { $element } ӑшӗнче
       *[top] Чи ҫӳлти шайра
    }{ $allowed ->
        [none] { " — кунта нимӗн те вырнаҫмасть." }
        [text] { " — кунта текст ҫырма пулать." }
        [text-and-components] { " — кунта текст ҫырма пулать, е ҫаксене сӑнаса пӑхӑр:" }
       *[components] { " — ҫаксене сӑнаса пӑхма пулать:" }
    }

help-suggestions-footer = Пӗтӗм { $total } компонента курас тесен { $shortcut } пусӑр.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объект ҫине каҫӑ.
       *[other] { $ref } — { $target } объект ҫине каҫӑ ({ $line }-мӗш йӗрке).
    }

help-ref-derived-from =
    { $line ->
        [none] Ӑна { $owner } { $role } пек кӗртнӗ.
       *[other] Ӑна { $owner } { $line }-мӗш йӗркере { $role } пек кӗртнӗ.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементӑн { $property } уйрӑмлӑхӗ ҫине каҫӑ.
       *[other] { $ref } — { $element } элементӑн { $property } уйрӑмлӑхӗ ҫине каҫӑ ({ $line }-мӗш йӗрке).
    }

help-kind-attribute = атрибут
help-kind-snippet = татӑк
help-kind-array-entry = массив элеменчӗ

help-default = Тӗп хак:
help-active-default = Хальхи тӗп хак:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ирӗк панӑ хаксем (кашни элемент валли пӗрре):
       *[other] Ирӗк панӑ хаксем:
    }

help-suggested-values = Сӗннӗ хаксем:

help-inserts = Хушать:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатӑсем:
    }

help-type = Тӗсӗ:

help-resolved-style = Тухнӑ стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Тухнӑ функци ячӗсем:
help-reset-list = Ку хирӗн каялла таврӑну списокӗ:
help-added-on-input = Ку хирте хушнисем:
help-removed-on-input = Ку хиртен кӑларнисем:

help-reset-overrides = { $reset } — { $additional } тата { $removed } ҫинчен мала тухать.
