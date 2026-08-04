# Mongolian editor and language-server surfaces. Translated from
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
# Mongolian counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.
#
# A Mongolian case ending harmonizes with the word it attaches to, so none is
# welded to a placeable: «лавлагаа», «бай» and «атрибут» are nouns this catalog
# writes, and they carry the case instead. The invariant ordinal «-р» on a line
# number is the one affix that may sit directly against a value.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Сэргээх
       *[update] Шинэчлэх
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Үзүүлэгчийг { $word }
       *[other] Үзүүлэгчийг { $word } { $shortcut }
    }


## The variant picker

editor-variant = Хувилбар
editor-variant-filter = Шүүх…
editor-variant-next = Дараагийн хувилбарыг сонгох
editor-variant-previous = Өмнөх хувилбарыг сонгох


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA хүртээмжийн зөрчил илэрлээ. Хүртээмжийн тайланг { $action ->
            [close] хаахын
           *[open] нээхийн
        } тулд товшино уу.
        [advisories] Хүртээмжийн тайланг { $action ->
            [close] хаахын
           *[open] нээхийн
        } тулд товшино уу. WCAG AA зөрчил илрээгүй ч нэмэлт хүртээмжийн зөвлөмжүүд байна.
       *[clean] Хүртээмжийн тайланг { $action ->
            [close] хаахын
           *[open] нээхийн
        } тулд товшино уу. Хүртээмжийн асуудал илрээгүй.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA хүртээмжийн зөрчил илэрлээ. { $count ->
            [one] { $count } WCAG AA зөрчил
           *[other] { $count } WCAG AA зөрчил
        } олдлоо. Хүртээмжийн тайланг { $action ->
            [close] хаахын
           *[open] нээхийн
        } тулд товшино уу.
        [advisories] WCAG AA зөрчил илрээгүй. { $count ->
            [one] { $count } нэмэлт хүртээмжийн зөвлөмж
           *[other] { $count } нэмэлт хүртээмжийн зөвлөмж
        } олдлоо. Хүртээмжийн тайланг { $action ->
            [close] хаахын
           *[open] нээхийн
        } тулд товшино уу.
       *[clean] WCAG AA зөрчил илрээгүй. Хүртээмжийн тайланг { $action ->
            [close] хаахын
           *[open] нээхийн
        } тулд товшино уу.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML хувилбар { $version }

editor-tab-help = Нөхцөл байдлын тусламж
editor-tab-help-short = Нөхцөл
editor-tab-errors = Алдаанууд
editor-tab-warnings = Анхааруулгууд
editor-tab-info = Мэдээлэл
editor-tab-accessibility = Хүртээмж
editor-tab-responses = Илгээсэн хариултууд

editor-tab-with-count = { $label }: { $count }

editor-options = Засварлагчийн тохиргоо
editor-format-as-doenetml = DoenetML болгон хэлбэржүүлэх
editor-format-as-xml = XML болгон хэлбэржүүлэх


## The diagnostics panel

editor-diagnostic-line = { $line }-р мөр

editor-no-errors = Алдаа алга
editor-no-warnings = Анхааруулга алга
editor-no-info = Мэдээллийн мэдэгдэл алга

editor-show-info-annotations = Мэдээллийн мэдэгдлийг засварлагчид харуулах
editor-show-accessibility-annotations = Хүртээмжийн мэдэгдлийг засварлагчид харуулах

editor-accessibility-learn-more = Doenet хүртээмжид хэрхэн ханддаг вэ

editor-accessibility-violations-heading = Хүртээмжийн зөрчлүүд ({ $standard })

editor-accessibility-other-heading = Бусад хүртээмжийн асуудлууд
editor-none-found = Юу ч олдсонгүй


## Submitted responses

editor-no-responses = Одоогоор илгээсэн хариулт алга
editor-response-answer-id = Хариултын Id
editor-response-response = Хариулт
editor-response-credit = Оноо
editor-response-submitted = Илгээсэн


## The context-help panel

help-placeholder = Баримтжуулалтыг үзэхийн тулд курсорыг тагийн нэр, атрибут эсвэл { $ref } дээр байрлуулна уу.

help-unsupported-ref-chain = { $example } мэт олон хэсэгтэй лавлагааны тусламж одоогоор дэмжигдээгүй.

help-unresolved-ref =
    { $reason ->
        [notFound] Лавлагаанд тохирох объект олдсонгүй: { $ref }.
        [multiple] Лавлагаанд тохирох хэд хэдэн объект олдлоо: { $ref }.
       *[indeterminate] { $ref } лавлагаанд тохирох объектыг тодорхойлж чадсангүй.
    }

help-learn-about-references = Лавлагааны талаар мэдэх →
help-reference-page = Лавлах хуудас →

help-suggestions-header =
    { $location ->
        [inside] { $element } дотор
       *[top] Дээд түвшинд
    }{ $allowed ->
        [none] { " — энд юу ч багтахгүй." }
        [text] { " — энд текст бичиж болно." }
        [text-and-components] { " — энд текст бичиж болно, эсвэл эдгээрийг туршина уу:" }
       *[components] { " — эдгээрийг туршиж болно:" }
    }

help-suggestions-footer = Бүх { $total } бүрэлдэхүүнийг харахын тулд { $shortcut } дарна уу.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } нь { $target } байд хийсэн лавлагаа юм.
       *[other] { $ref } нь { $target } байд хийсэн лавлагаа юм ({ $line }-р мөр).
    }

help-ref-derived-from =
    { $line ->
        [none] Үүнийг { $owner } { $role } болгон оруулсан.
       *[other] Үүнийг { $owner } { $line }-р мөрөнд { $role } болгон оруулсан.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } нь { $element } элементийн { $property } шинжид хийсэн лавлагаа юм.
       *[other] { $ref } нь { $element } элементийн { $property } шинжид хийсэн лавлагаа юм ({ $line }-р мөр).
    }

help-kind-attribute = атрибут
help-kind-snippet = хэсэг
help-kind-array-entry = массивын гишүүн

help-default = Анхны утга:
help-active-default = Үйлчилж буй анхны утга:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Зөвшөөрөгдсөн утгууд (гишүүн тус бүрд нэг):
       *[other] Зөвшөөрөгдсөн утгууд:
    }

help-suggested-values = Санал болгож буй утгууд:

help-inserts = Нэмнэ:

help-coordinates =
    { $count ->
        [one] Координат:
       *[other] Координатууд:
    }

help-type = Төрөл:

help-resolved-style = Гарсан загвар (styleNumber { $styleNumber }):

help-resolved-function-names = Гарсан функцийн нэрс:
help-reset-list = Энэ талбарын сэргээх жагсаалт:
help-added-on-input = Энэ талбарт нэмэгдсэн:
help-removed-on-input = Энэ талбараас хасагдсан:

help-reset-overrides = { $reset } нь { $additional } болон { $removed } атрибутаас давуу үйлчилнэ.
