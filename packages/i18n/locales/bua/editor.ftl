# Buryat editor and language-server surfaces. Translated from
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
# Buryat counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Бусааха
       *[update] Шэнэлхэ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Харагшые { $word }
       *[other] Харагшые { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Шүүлгэ…
editor-variant-next = Дараахи вариант шэлэхэ
editor-variant-previous = Урдахи вариант шэлэхэ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA хүрэхэ аргын эбдэлгэ олдобо. Хүрэхэ аргын тайлан { $action ->
            [close] хааха
           *[open] нээхэ
        } гэжэ дарагты.
        [advisories] Хүрэхэ аргын тайлан { $action ->
            [close] хааха
           *[open] нээхэ
        } гэжэ дарагты. WCAG AA эбдэлгэнүүд олдобогүй, теэд нэмэлтэ дурадхалнууд бии.
       *[clean] Хүрэхэ аргын тайлан { $action ->
            [close] хааха
           *[open] нээхэ
        } гэжэ дарагты. Хүрэхэ аргын асуудалнууд олдобогүй.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA хүрэхэ аргын эбдэлгэ олдобо. { $count ->
            [one] { $count } WCAG AA эбдэлгэ
           *[other] { $count } WCAG AA эбдэлгэ
        } олдобо. Хүрэхэ аргын тайлан { $action ->
            [close] хааха
           *[open] нээхэ
        } гэжэ дарагты.
        [advisories] WCAG AA эбдэлгэнүүд олдобогүй. { $count ->
            [one] { $count } нэмэлтэ дурадхал
           *[other] { $count } нэмэлтэ дурадхал
        } олдобо. Хүрэхэ аргын тайлан { $action ->
            [close] хааха
           *[open] нээхэ
        } гэжэ дарагты.
       *[clean] WCAG AA эбдэлгэнүүд олдобогүй. Хүрэхэ аргын тайлан { $action ->
            [close] хааха
           *[open] нээхэ
        } гэжэ дарагты.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-эй хубилбари { $version }

editor-tab-help = Контекстын туһаламжа
editor-tab-help-short = Контекст
editor-tab-errors = Алдуунууд
editor-tab-warnings = Һэргылэмжэнүүд
editor-tab-info = Мэдээсэл
editor-tab-accessibility = Хүрэхэ арга
editor-tab-responses = Эльгээгдэһэн харюунууд

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторай тохироонууд
editor-format-as-doenetml = DoenetML шэнгеэр форматлаха
editor-format-as-xml = XML шэнгеэр форматлаха


## The diagnostics panel

editor-diagnostic-line = { $line }-дохи мүр

editor-no-errors = Алдуу үгы
editor-no-warnings = Һэргылэмжэ үгы
editor-no-info = Мэдээсэлэй дуулгалга үгы

editor-show-info-annotations = Мэдээсэлэй дуулгалгануудые редактор соо харуулха
editor-show-accessibility-annotations = Хүрэхэ аргын дуулгалгануудые редактор соо харуулха

editor-accessibility-learn-more = Doenet хүрэхэ аргада яажа хандадаг бэ

editor-accessibility-violations-heading = Хүрэхэ аргын эбдэлгэнүүд ({ $standard })

editor-accessibility-other-heading = Бусад хүрэхэ аргын асуудалнууд
editor-none-found = Юуншье олдобогүй


## Submitted responses

editor-no-responses = Мүнөө болотор эльгээгдэһэн харюу үгы
editor-response-answer-id = Харюугай Id
editor-response-response = Харюу
editor-response-credit = Балл
editor-response-submitted = Эльгээгдэбэ


## The context-help panel

help-placeholder = Баримта бэшэг харахын тулада курсорые тэгэй нэрэ дээрэ, атрибут дээрэ али { $ref } дээрэ табигты.

help-unsupported-ref-chain = { $example } шэнги олон хубитай холбоһондо туһаламжа мүнөө болотор үгы.

help-unresolved-ref =
    { $reason ->
        [notFound] Холбоһондо объект олдобогүй: { $ref }.
        [multiple] Холбоһондо хэдэн объект олдобо: { $ref }.
       *[indeterminate] { $ref } объектые тодорхойлжо шадабагүй.
    }

help-learn-about-references = Холбоһон тухай мэдэхэ →
help-reference-page = Лаблагаанай нюур →

help-suggestions-header =
    { $location ->
        [inside] { $element } соо
       *[top] Дээдэ шатада
    }{ $allowed ->
        [none] { " — эндэ юуншье багтахагүй." }
        [text] { " — эндэ текст бэшэжэ болохо." }
        [text-and-components] { " — эндэ текст бэшэжэ болохо, али эдэниие туршажа үзэгты:" }
       *[components] { " — эдэниие туршажа үзэжэ болохо:" }
    }

help-suggestions-footer = Бүхы { $total } компонент харахын тулада { $shortcut } дарагты.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объект дээрэ холбоһон.
       *[other] { $ref } — { $target } объект дээрэ холбоһон ({ $line }-дохи мүр).
    }

help-ref-derived-from =
    { $line ->
        [none] Үүниие { $owner } { $role } болгожо оруулаа.
       *[other] Үүниие { $owner } { $line }-дохи мүртэ { $role } болгожо оруулаа.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементын { $property } шанар дээрэ холбоһон.
       *[other] { $ref } — { $element } элементын { $property } шанар дээрэ холбоһон ({ $line }-дохи мүр).
    }

help-kind-attribute = атрибут
help-kind-snippet = хэрчим
help-kind-array-entry = массивай элемент

help-default = Үндэһэн утга:
help-active-default = Мүнөөнэй үндэһэн утга:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Зүбшөөгдэһэн утганууд (элемент бүхэндэ нэгэ):
       *[other] Зүбшөөгдэһэн утганууд:
    }

help-suggested-values = Дурадхагдаһан утганууд:

help-inserts = Нэмэнэ:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатанууд:
    }

help-type = Түхэл:

help-resolved-style = Гараһан стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Гараһан функциин нэрэнүүд:
help-reset-list = Энэ талмайн бусаалгын жагсаалта:
help-added-on-input = Энэ талмай дээрэ нэмэгдэһэн:
help-removed-on-input = Энэ талмайһаа усадхагдаһан:

help-reset-overrides = { $reset } — { $additional } ба { $removed } дээрэһээ дабамгайлна.
