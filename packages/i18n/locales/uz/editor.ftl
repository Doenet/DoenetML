# Uzbek editor and language-server surfaces. Translated from
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
# Uzbek counts in the same two categories English does, so every selection below
# keeps both branches — though a noun after a numeral stays singular, so the two
# read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Tiklash
       *[update] Yangilash
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Ko‘ruvchini { $word }
       *[other] Ko‘ruvchini { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtrlash…
editor-variant-next = Keyingi variantni tanlash
editor-variant-previous = Oldingi variantni tanlash


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA foydalanuvchanlik buzilishi aniqlandi. Foydalanuvchanlik hisobotini { $action ->
            [close] yopish
           *[open] ochish
        } uchun bosing.
        [advisories] Foydalanuvchanlik hisobotini { $action ->
            [close] yopish
           *[open] ochish
        } uchun bosing. WCAG AA buzilishlari topilmadi, ammo qo‘shimcha foydalanuvchanlik tavsiyalari bor.
       *[clean] Foydalanuvchanlik hisobotini { $action ->
            [close] yopish
           *[open] ochish
        } uchun bosing. Foydalanuvchanlik muammolari topilmadi.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA foydalanuvchanlik buzilishi aniqlandi. { $count ->
            [one] { $count } WCAG AA buzilishi
           *[other] { $count } WCAG AA buzilishi
        } topildi. Foydalanuvchanlik hisobotini { $action ->
            [close] yopish
           *[open] ochish
        } uchun bosing.
        [advisories] WCAG AA buzilishlari aniqlanmadi. { $count ->
            [one] { $count } qo‘shimcha foydalanuvchanlik tavsiyasi
           *[other] { $count } qo‘shimcha foydalanuvchanlik tavsiyasi
        } topildi. Foydalanuvchanlik hisobotini { $action ->
            [close] yopish
           *[open] ochish
        } uchun bosing.
       *[clean] WCAG AA buzilishlari aniqlanmadi. Foydalanuvchanlik hisobotini { $action ->
            [close] yopish
           *[open] ochish
        } uchun bosing.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versiyasi { $version }

editor-tab-help = Kontekstli yordam
editor-tab-help-short = Kontekst
editor-tab-errors = Xatolar
editor-tab-warnings = Ogohlantirishlar
editor-tab-info = Ma’lumot
editor-tab-accessibility = Foydalanuvchanlik
editor-tab-responses = Yuborilgan javoblar

editor-tab-with-count = { $label }: { $count }

editor-options = Muharrir sozlamalari
editor-format-as-doenetml = DoenetML sifatida formatlash
editor-format-as-xml = XML sifatida formatlash


## The diagnostics panel

editor-diagnostic-line = { $line }-qator

editor-no-errors = Xatolar yo‘q
editor-no-warnings = Ogohlantirishlar yo‘q
editor-no-info = Ma’lumot bildirishnomalari yo‘q

editor-show-info-annotations = Ma’lumot bildirishnomalarini muharrirda ko‘rsatish
editor-show-accessibility-annotations = Foydalanuvchanlik bildirishnomalarini muharrirda ko‘rsatish

editor-accessibility-learn-more = Doenet foydalanuvchanlikka qanday yondashadi

editor-accessibility-violations-heading = Foydalanuvchanlik buzilishlari ({ $standard })

editor-accessibility-other-heading = Boshqa foydalanuvchanlik muammolari
editor-none-found = Hech narsa topilmadi


## Submitted responses

editor-no-responses = Hozircha yuborilgan javoblar yo‘q
editor-response-answer-id = Javob Id-si
editor-response-response = Javob
editor-response-credit = Ball
editor-response-submitted = Yuborilgan


## The context-help panel

help-placeholder = Hujjatlarni ko‘rish uchun kursorni teg nomiga, atributga yoki { $ref } ustiga qo‘ying.

help-unsupported-ref-chain = { $example } kabi ko‘p qismli havolalar uchun yordam hozircha qo‘llab-quvvatlanmaydi.

help-unresolved-ref =
    { $reason ->
        [notFound] Havola uchun obyekt topilmadi: { $ref }.
        [multiple] Havola uchun bir nechta obyekt topildi: { $ref }.
       *[indeterminate] { $ref } uchun obyektni aniqlab bo‘lmadi.
    }

help-learn-about-references = Havolalar haqida bilib oling →
help-reference-page = Ma’lumotnoma sahifasi →

help-suggestions-header =
    { $location ->
        [inside] { $element } ichida
       *[top] Yuqori darajada
    }{ $allowed ->
        [none] { " — bu yerga hech narsa joylashmaydi." }
        [text] { " — bu yerga matn yozish mumkin." }
        [text-and-components] { " — bu yerga matn yozish mumkin yoki quyidagilarni sinab ko‘ring:" }
       *[components] { " — quyidagilarni sinab ko‘rish mumkin:" }
    }

help-suggestions-footer = Barcha { $total } komponentni ko‘rish uchun { $shortcut } bosing.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } obyektiga havola.
       *[other] { $ref } — { $target } obyektiga havola ({ $line }-qator).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } uni { $role } sifatida kiritgan.
       *[other] { $owner } uni { $line }-qatorda { $role } sifatida kiritgan.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } elementining { $property } xossasiga havola.
       *[other] { $ref } — { $element } elementining { $property } xossasiga havola ({ $line }-qator).
    }

help-kind-attribute = atribut
help-kind-snippet = parcha
help-kind-array-entry = massiv elementi

help-default = Standart qiymat:
help-active-default = Amaldagi standart qiymat:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ruxsat etilgan qiymatlar (har bir element uchun bittadan):
       *[other] Ruxsat etilgan qiymatlar:
    }

help-suggested-values = Tavsiya etilgan qiymatlar:

help-inserts = Qo‘shadi:

help-coordinates =
    { $count ->
        [one] Koordinata:
       *[other] Koordinatalar:
    }

help-type = Turi:

help-resolved-style = Olingan uslub (styleNumber { $styleNumber }):

help-resolved-function-names = Olingan funksiya nomlari:
help-reset-list = Bu maydonning tiklash ro‘yxati:
help-added-on-input = Bu maydonga qo‘shilganlar:
help-removed-on-input = Bu maydondan olib tashlanganlar:

help-reset-overrides = { $reset } — { $additional } va { $removed } ustidan ustunlik qiladi.
