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
# The two counted messages here write a `[zero]` branch, which Chuvash resolves
# for exactly 0 — see the note in `chrome.ftl` on how that differs from
# `locales/lv`'s category of the same name. A `[zero]` here is reached rather
# than decorative: neither message has an explicit `[0]` branch to win first.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Каялла
       *[update] Çĕнетес
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Пăхмаллине { $word }
       *[other] Пăхмаллине { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Суйласа илни…
editor-variant-next = Тепĕр варианта суйлас
editor-variant-previous = Малтанхи варианта суйлас


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA майлăх пăсăлăвĕ тупăнчĕ. Майлăх отчетне { $action ->
            [close] хупма
           *[open] уçма
        } пусăр.
        [advisories] Майлăх отчетне { $action ->
            [close] хупма
           *[open] уçма
        } пусăр. WCAG AA пăсăлăвĕсем тупăнмарĕç, анчах хушма сĕнӳсем пур.
       *[clean] Майлăх отчетне { $action ->
            [close] хупма
           *[open] уçма
        } пусăр. Майлăх проблемисем тупăнмарĕç.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA майлăх пăсăлăвĕ тупăнчĕ. { $count ->
            [zero] Пĕр WCAG AA пăсăлăвĕ те
            [one] { $count } WCAG AA пăсăлăвĕ
           *[other] { $count } WCAG AA пăсăлăвĕ
        } тупăнчĕ. Майлăх отчетне { $action ->
            [close] хупма
           *[open] уçма
        } пусăр.
        [advisories] WCAG AA пăсăлăвĕсем тупăнмарĕç. { $count ->
            [zero] Пĕр хушма сĕнӳ те
            [one] { $count } хушма сĕнӳ
           *[other] { $count } хушма сĕнӳ
        } тупăнчĕ. Майлăх отчетне { $action ->
            [close] хупма
           *[open] уçма
        } пусăр.
       *[clean] WCAG AA пăсăлăвĕсем тупăнмарĕç. Майлăх отчетне { $action ->
            [close] хупма
           *[open] уçма
        } пусăр.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версийĕ { $version }

editor-tab-help = Контекст пулăшăвĕ
editor-tab-help-short = Контекст
editor-tab-errors = Йăнăшсем
editor-tab-warnings = Асăрхаттарусем
editor-tab-info = Информаци
editor-tab-accessibility = Майлăх
editor-tab-responses = Янă хуравсем

editor-tab-with-count = { $label }: { $count }

editor-options = Редактор ĕнерлевĕсем
editor-format-as-doenetml = DoenetML пек форматлас
editor-format-as-xml = XML пек форматлас


## The diagnostics panel

editor-diagnostic-line = { $line }-мĕш йĕрке

editor-no-errors = Йăнăшсем çук
editor-no-warnings = Асăрхаттарусем çук
editor-no-info = Информаци хыпарĕсем çук

editor-show-info-annotations = Информаци хыпарĕсене редакторта кăтартас
editor-show-accessibility-annotations = Майлăх хыпарĕсене редакторта кăтартас

editor-accessibility-learn-more = Doenet майлăх çине мĕнле пăхать

editor-accessibility-violations-heading = Майлăх пăсăлăвĕсем ({ $standard })

editor-accessibility-other-heading = Майлăхăн ытти проблемисем
editor-none-found = Нимĕн те тупăнмарĕ


## Submitted responses

editor-no-responses = Халĕ таран янă хуравсем çук
editor-response-answer-id = Хуравăн Id-йĕ
editor-response-response = Хурав
editor-response-credit = Балл
editor-response-submitted = Янă


## The context-help panel

help-placeholder = Документацие курас тесен курсора тег ячĕ, атрибут е { $ref } çине лартăр.

help-unsupported-ref-chain = { $example } пек нумай пайлă каçăсем валли пулăшу халĕ çук.

help-unresolved-ref =
    { $reason ->
        [notFound] Каçă валли объект тупăнмарĕ: { $ref }.
        [multiple] Каçă валли темиçе объект тупăнчĕ: { $ref }.
       *[indeterminate] { $ref } валли объекта палăртма пулмарĕ.
    }

help-learn-about-references = Каçăсем çинчен пĕлес →
help-reference-page = Справка страници →

help-suggestions-header =
    { $location ->
        [inside] { $element } ăшĕнче
       *[top] Чи çӳлти шайра
    }{ $allowed ->
        [none] { " — кунта нимĕн те вырнаçмасть." }
        [text] { " — кунта текст çырма пулать." }
        [text-and-components] { " — кунта текст çырма пулать, е çаксене сăнаса пăхăр:" }
       *[components] { " — çаксене сăнаса пăхма пулать:" }
    }

help-suggestions-footer = Пĕтĕм { $total } компонента курас тесен { $shortcut } пусăр.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объект çине каçă.
       *[other] { $ref } — { $target } объект çине каçă ({ $line }-мĕш йĕрке).
    }

help-ref-derived-from =
    { $line ->
        [none] Ăна { $owner } { $role } пек кĕртнĕ.
       *[other] Ăна { $owner } { $line }-мĕш йĕркере { $role } пек кĕртнĕ.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементăн { $property } уйрăмлăхĕ çине каçă.
       *[other] { $ref } — { $element } элементăн { $property } уйрăмлăхĕ çине каçă ({ $line }-мĕш йĕрке).
    }

help-kind-attribute = атрибут
help-kind-snippet = татăк
help-kind-array-entry = массив элеменчĕ

help-default = Тĕп хак:
help-active-default = Хальхи тĕп хак:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ирĕк панă хаксем (кашни элемент валли пĕрре):
       *[other] Ирĕк панă хаксем:
    }

help-suggested-values = Сĕннĕ хаксем:

help-inserts = Хушать:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатăсем:
    }

help-type = Тĕсĕ:

help-resolved-style = Тухнă стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Тухнă функци ячĕсем:
help-reset-list = Ку хирĕн каялла таврăну списокĕ:
help-added-on-input = Ку хирте хушнисем:
help-removed-on-input = Ку хиртен кăларнисем:

help-reset-overrides = { $reset } — { $additional } тата { $removed } çинчен мала тухать.
