# Buginese (Basa Ugi) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button, and the
# context-help panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script, apostrophe and register** are `chrome.ftl`'s: Latin rather than
# Lontara, the final glottal stop written with the ASCII apostrophe `'`
# (U+0027), and an Indonesian technical vocabulary declared as a loan register
# around a Buginese frame — «de'», «de' nawedding», «de'gaga», «sibawa», «na»,
# «iyaré'ga», «nasaba», «rékko», «pole ri», «untu'», «ri», «maneng»,
# «tungke'», «riruntu'».
#
# **`WCAG`, `DoenetML`, `styleNumber` and every element and attribute name
# stay in English.** They are identifiers an author types, not words.
#
# **The counts do not fork.** `editor-accessibility-label` and
# `help-coordinates` write a single `*[other]` where English writes `[one]`
# and `[other]`: CLDR has no plural data for `bug`, so an English-selected
# branch would be worse than none, and a Buginese noun is unmarked after a
# numeral in any case.
#
# **`help-name-summary` is punctuation.** It renders with `{ $name }` empty
# for a suggestion the panel has already named, so the em dash and its spaces
# have to read on their own.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Palisu
       *[update] Baruwi
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Panampi'
       *[other] { $word } Panampi' { $shortcut }
    }


## The variant picker

editor-variant = Varian

editor-variant-filter = Saring...

editor-variant-next = Piléi varian rimonri

editor-variant-previous = Piléi varian riolo


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Riruntu' pelanggaran aksesibilitas WCAG AA. Klik untu' { $action ->
            [close] tutu'
           *[open] timpa'
        } laporan aksesibilitas.
        [advisories] Klik untu' { $action ->
            [close] tutu'
           *[open] timpa'
        } laporan aksesibilitas. De'gaga pelanggaran WCAG AA iya riruntu'é, naé engka saran aksesibilitas laingngé.
       *[clean] Klik untu' { $action ->
            [close] tutu'
           *[open] timpa'
        } laporan aksesibilitas. De'gaga masala aksesibilitas iya riruntu'é.
    }

editor-accessibility-label =
    { $status ->
        [violations] Riruntu' pelanggaran aksesibilitas WCAG AA. Riruntu' { $count ->
           *[other] { $count } pelanggaran WCAG AA
        }. Klik untu' { $action ->
            [close] tutu'
           *[open] timpa'
        } laporan aksesibilitas.
        [advisories] De'gaga pelanggaran WCAG AA iya riruntu'é. Riruntu' { $count ->
           *[other] { $count } saran aksesibilitas tamba
        }. Klik untu' { $action ->
            [close] tutu'
           *[open] timpa'
        } laporan aksesibilitas.
       *[clean] De'gaga pelanggaran WCAG AA iya riruntu'é. Klik untu' { $action ->
            [close] tutu'
           *[open] timpa'
        } laporan aksesibilitas.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versi { $version }

editor-tab-help = Bantuan situru' konteks
editor-tab-help-short = Konteks
editor-tab-errors = Asalang
editor-tab-warnings = Papparingerrang
editor-tab-info = Info
editor-tab-accessibility = Aksesibilitas
editor-tab-responses = Pappébali iya purae rikiring

editor-tab-with-count = { $label }: { $count }

editor-options = Pilihan panyunting
editor-format-as-doenetml = Atoro' selaku DoenetML
editor-format-as-xml = Atoro' selaku XML


## The diagnostics panel

editor-diagnostic-line = Baris #{ $line }

editor-no-errors = De'gaga asalang
editor-no-warnings = De'gaga papparingerrang
editor-no-info = De'gaga diagnostik info

editor-show-info-annotations = Paitangngi diagnostik info ri panyunting
editor-show-accessibility-annotations = Paitangngi diagnostik aksesibilitas ri panyunting

editor-accessibility-learn-more = Pelajari pékkugi Doenet majjama aksesibilitas

editor-accessibility-violations-heading = Pelanggaran aksesibilitas ({ $standard })

editor-accessibility-other-heading = Masala aksesibilitas laingngé
editor-none-found = De'gaga iya riruntu'é


## Submitted responses

editor-no-responses = De'pa engka pappébali iya rikiringngé
editor-response-answer-id = Id pappébali
editor-response-response = Pappébali
editor-response-credit = Nilai
editor-response-submitted = Purani rikiring


## The context-help panel

help-placeholder = Taroi kursor ri aseng tag, atribut, iyaré'ga { $ref } untu' dokumentasi.

help-unsupported-ref-chain = Bantuan untu' referensi maéga bagiang pada-pada { $example } de'pa nariébbu.

help-unresolved-ref =
    { $reason ->
        [notFound] De'gaga acuan iya riruntu'é untu' referensi: { $ref }.
        [multiple] Riruntu' maéga acuan untu' referensi: { $ref }.
       *[indeterminate] Acuan untu' { $ref } de' nawedding ripattentu.
    }

help-learn-about-references = Pelajari passalenna referensi →
help-reference-page = Halaman rujukan →

help-suggestions-header =
    { $location ->
        [inside] Ri laleng { $element }
       *[top] Ri tingkat kaminang liyasé
    }{ $allowed ->
        [none] { " — de'gaga iya wedding ritaro kuae." }
        [text] { " — okii teks kuae." }
        [text-and-components] { " — okii teks kuae, iyaré'ga coba:" }
       *[components] { " — iya wedding ricoba:" }
    }

help-suggestions-footer = Tikkeng { $shortcut } untu' mitai maneng { $total } komponen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } iyanaritu referensi lao ri { $target }.
       *[other] { $ref } iyanaritu referensi lao ri { $target } (baris { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ripaompo ri { $owner } selaku { $role }.
       *[other] Ripaompo ri { $owner } ri baris { $line } selaku { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } iyanaritu referensi lao ri properti { $property } appunnangenna { $element }.
       *[other] { $ref } iyanaritu referensi lao ri properti { $property } appunnangenna { $element } (baris { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = pettuang
help-kind-array-entry = isi larik

help-default = Bawaan:
help-active-default = Bawaan iya majjamaé:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nilai iya riwéréngngé (séddi untu' tungke' item):
       *[other] Nilai iya riwéréngngé:
    }

help-suggested-values = Nilai iya risaranangngé:

help-inserts = Nasisip:

help-coordinates =
    { $count ->
       *[other] Koordinat:
    }

help-type = Tipe:

help-resolved-style = Gaya iya pura ripattentu (styleNumber { $styleNumber }):

help-resolved-function-names = Aseng fungsi iya pura ripattentu:
help-reset-list = Daftar iya ripalisué ri masukan iyaé:
help-added-on-input = Ritamba ri masukan iyaé:
help-removed-on-input = Riabbéang ri masukan iyaé:

help-reset-overrides = { $reset } natimpai { $additional } na { $removed }.
