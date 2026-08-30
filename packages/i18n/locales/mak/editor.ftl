# Makasar (Basa Mangkasara') editor and language-server surfaces: the footer,
# the diagnostics panel, the variant picker, the accessibility button, and the
# context-help panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script, apostrophe and register** are `chrome.ftl`'s: Latin rather than
# Lontara or Ukiri' Jangang-jangang, the final glottal stop written with the
# ASCII apostrophe `'` (U+0027), and an Indonesian technical vocabulary
# declared as a loan register around a Makasar frame — «tena», «tena
# nakkulle», «tena nia'», «siagang», «yareka», «lanri», «punna», «mingka»,
# «battu ri», «untu'», «ri», «ngaseng», «tunggala'», «nigappa», «pole».
#
# **`WCAG`, `DoenetML`, `styleNumber` and every element and attribute name
# stay in English.** They are identifiers an author types, not words.
#
# **The counts do not fork.** `editor-accessibility-label` and
# `help-coordinates` write a single `*[other]` where English writes `[one]`
# and `[other]`: CLDR has no plural data for `mak`, so an English-selected
# branch would be worse than none, and a Makasar noun is unmarked after a
# numeral in any case.
#
# **`help-name-summary` is punctuation.** It renders with `{ $name }` empty
# for a suggestion the panel has already named, so the em dash and its spaces
# have to read on their own.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ammotere'
       *[update] Baru'
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Panampi'
       *[other] { $word } Panampi' { $shortcut }
    }


## The variant picker

editor-variant = Varian

editor-variant-filter = Saring...

editor-variant-next = Pilei varian ribokoang

editor-variant-previous = Pilei varian riolo


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Nigappa pelanggaran aksesibilitas WCAG AA. Klik untu' { $action ->
            [close] tongko'
           *[open] sungke
        } laporan aksesibilitas.
        [advisories] Klik untu' { $action ->
            [close] tongko'
           *[open] sungke
        } laporan aksesibilitas. Tena nia' pelanggaran WCAG AA nigappa, mingka nia' saran aksesibilitas maraeng.
       *[clean] Klik untu' { $action ->
            [close] tongko'
           *[open] sungke
        } laporan aksesibilitas. Tena nia' masala aksesibilitas nigappa.
    }

editor-accessibility-label =
    { $status ->
        [violations] Nigappa pelanggaran aksesibilitas WCAG AA. Nigappa { $count ->
           *[other] { $count } pelanggaran WCAG AA
        }. Klik untu' { $action ->
            [close] tongko'
           *[open] sungke
        } laporan aksesibilitas.
        [advisories] Tena nia' pelanggaran WCAG AA nigappa. Nigappa { $count ->
           *[other] { $count } saran aksesibilitas tamba
        }. Klik untu' { $action ->
            [close] tongko'
           *[open] sungke
        } laporan aksesibilitas.
       *[clean] Tena nia' pelanggaran WCAG AA nigappa. Klik untu' { $action ->
            [close] tongko'
           *[open] sungke
        } laporan aksesibilitas.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versi { $version }

editor-tab-help = Bantuang situru' konteks
editor-tab-help-short = Konteks
editor-tab-errors = Kasalang
editor-tab-warnings = Pappakainga'
editor-tab-info = Info
editor-tab-accessibility = Aksesibilitas
editor-tab-responses = Jawaban le'baka nikiring

editor-tab-with-count = { $label }: { $count }

editor-options = Pilihang panyunting
editor-format-as-doenetml = Atoro' salaku DoenetML
editor-format-as-xml = Atoro' salaku XML


## The diagnostics panel

editor-diagnostic-line = Baris #{ $line }

editor-no-errors = Tena nia' kasalang
editor-no-warnings = Tena nia' pappakainga'
editor-no-info = Tena nia' diagnostik info

editor-show-info-annotations = Paccinikangi diagnostik info ri panyunting
editor-show-accessibility-annotations = Paccinikangi diagnostik aksesibilitas ri panyunting

editor-accessibility-learn-more = Pelajari antekamma Doenet anjama aksesibilitas

editor-accessibility-violations-heading = Pelanggaran aksesibilitas ({ $standard })

editor-accessibility-other-heading = Masala aksesibilitas maraeng
editor-none-found = Tena nia' nigappa


## Submitted responses

editor-no-responses = Tenapa nia' jawaban nikiring
editor-response-answer-id = Id jawaban
editor-response-response = Jawaban
editor-response-credit = Nilai
editor-response-submitted = Le'ba' nikiring


## The context-help panel

help-placeholder = Boli'i kursor ri areng tag, atribut, yareka { $ref } untu' dokumentasi.

help-unsupported-ref-chain = Bantuang untu' referensi jai bageang kamma { $example } tenapa nipare'.

help-unresolved-ref =
    { $reason ->
        [notFound] Tena nia' acuan nigappa untu' referensi: { $ref }.
        [multiple] Nigappa jai acuan untu' referensi: { $ref }.
       *[indeterminate] Acuan untu' { $ref } tena nakkulle nipattantu.
    }

help-learn-about-references = Pelajari passala' referensi →
help-reference-page = Halaman rujukan →

help-suggestions-header =
    { $location ->
        [inside] Ri lalanna { $element }
       *[top] Ri tingkat kaminang rate
    }{ $allowed ->
        [none] { " — tena nia' akkullea niboli' anrinni." }
        [text] { " — tulisi teks anrinni." }
        [text-and-components] { " — tulisi teks anrinni, yareka coba:" }
       *[components] { " — akkullea nicoba:" }
    }

help-suggestions-footer = Katti' { $shortcut } untu' anciniki ngaseng { $total } komponen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } iamintu referensi mange ri { $target }.
       *[other] { $ref } iamintu referensi mange ri { $target } (baris { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Nipa'jari ri { $owner } salaku { $role }.
       *[other] Nipa'jari ri { $owner } ri baris { $line } salaku { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } iamintu referensi mange ri properti { $property } battu ri { $element }.
       *[other] { $ref } iamintu referensi mange ri properti { $property } battu ri { $element } (baris { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = pa'gang
help-kind-array-entry = isi larik

help-default = Bawaan:
help-active-default = Bawaan anjamaya:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nilai nipa'biang (se're untu' tunggala' item):
       *[other] Nilai nipa'biang:
    }

help-suggested-values = Nilai nisarangkang:

help-inserts = Ansisipi:

help-coordinates =
    { $count ->
       *[other] Koordinat:
    }

help-type = Tipe:

help-resolved-style = Gaya le'baka nipattantu (styleNumber { $styleNumber }):

help-resolved-function-names = Areng fungsi le'baka nipattantu:
help-reset-list = Daftar nipammotere' ri anne masukanga:
help-added-on-input = Nitamba ri anne masukanga:
help-removed-on-input = Nipela' ri anne masukanga:

help-reset-overrides = { $reset } antimpai { $additional } siagang { $removed }.
