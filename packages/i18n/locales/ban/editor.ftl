# Balinese editor and language-server surfaces. Translated from
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
# Written throughout in basa andap, the unmarked everyday speech level; see
# `chrome.ftl`'s header.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Balikang
       *[update] Anyarang
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } panyingakane
       *[other] { $word } panyingakane { $shortcut }
    }


## The variant picker

editor-variant = Varian
editor-variant-filter = Saring…
editor-variant-next = Pilih varian salanturne
editor-variant-previous = Pilih varian sadurunge


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ada pelanggaran aksesibilitas WCAG AA ane katemu. Klik apang { $action ->
            [close] matutup
           *[open] mabukak
        } laporan aksesibilitasne.
        [advisories] Klik apang { $action ->
            [close] matutup
           *[open] mabukak
        } laporan aksesibilitasne. Tusing ada pelanggaran WCAG AA ane katemu, nanging enu ada saran aksesibilitas ane lenan.
       *[clean] Klik apang { $action ->
            [close] matutup
           *[open] mabukak
        } laporan aksesibilitasne. Tusing ada masalah aksesibilitas ane katemu.
    }

# No select on `$count` inside the branches: «pelanggaran» and «saran» are the
# same words for one and for many.
editor-accessibility-label =
    { $status ->
        [violations] Ada pelanggaran aksesibilitas WCAG AA ane katemu. Katemu { $count } pelanggaran WCAG AA. Klik apang { $action ->
            [close] matutup
           *[open] mabukak
        } laporan aksesibilitasne.
        [advisories] Tusing ada pelanggaran WCAG AA ane katemu. Katemu { $count } saran aksesibilitas ane lenan. Klik apang { $action ->
            [close] matutup
           *[open] mabukak
        } laporan aksesibilitasne.
       *[clean] Tusing ada pelanggaran WCAG AA ane katemu. Klik apang { $action ->
            [close] matutup
           *[open] mabukak
        } laporan aksesibilitasne.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versi DoenetML { $version }

editor-tab-help = Tulung manut konteks
editor-tab-help-short = Konteks
editor-tab-errors = Kaiwangan
editor-tab-warnings = Pinget
editor-tab-info = Informasi
editor-tab-accessibility = Aksesibilitas
editor-tab-responses = Pasaut ane suba kakirim

editor-tab-with-count = { $label }: { $count }

editor-options = Pilihan editor
editor-format-as-doenetml = Format dadi DoenetML
editor-format-as-xml = Format dadi XML


## The diagnostics panel

editor-diagnostic-line = Baris #{ $line }

editor-no-errors = Tusing ada kaiwangan
editor-no-warnings = Tusing ada pinget
editor-no-info = Tusing ada diagnostik informasi

editor-show-info-annotations = Edengang diagnostik informasi di editor
editor-show-accessibility-annotations = Edengang diagnostik aksesibilitas di editor

editor-accessibility-learn-more = Plajahin kenken Doenet ngurus aksesibilitas

editor-accessibility-violations-heading = Pelanggaran aksesibilitas ({ $standard })

editor-accessibility-other-heading = Masalah aksesibilitas ane lenan
editor-none-found = Tusing ada ane katemu


## Submitted responses

editor-no-responses = Enu tusing ada pasaut ane kakirim
editor-response-answer-id = Id pasaut
editor-response-response = Pasaut
editor-response-credit = Kredit
editor-response-submitted = Kakirim


## The context-help panel

help-placeholder = Genahang kursore di adan tag, atribut, utawi { $ref } anggon dokumentasi.

help-unsupported-ref-chain = Tulung anggon referensi mabagian liu buka { $example } enu tusing kasokong.

help-unresolved-ref =
    { $reason ->
        [notFound] Tusing ada ane katujuang baan referensine: { $ref }.
        [multiple] Liu ane katujuang baan referensine: { $ref }.
       *[indeterminate] Tusing nyidang kapastiang apa ane katujuang baan { $ref }.
    }

help-learn-about-references = Plajahin indik referensi →
help-reference-page = Kaca referensi →

help-suggestions-header =
    { $location ->
        [inside] Di tengah { $element }
       *[top] Di tingkat paling duur
    }{ $allowed ->
        [none] { " — tusing ada ane dadi kagenahang dini." }
        [text] { " — tulisang teks dini." }
        [text-and-components] { " — tulisang teks dini, utawi cobain:" }
       *[components] { " — ane dadi cobain:" }
    }

help-suggestions-footer = Pencet { $shortcut } apang nyingakin makejang { $total } komponen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ento referensi ka { $target }.
       *[other] { $ref } ento referensi ka { $target } (baris { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Kabakta baan { $owner } dadi { $role }.
       *[other] Kabakta baan { $owner } di baris { $line } dadi { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ento referensi ka properti { $property } uli { $element }.
       *[other] { $ref } ento referensi ka properti { $property } uli { $element } (baris { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = potongan kode
help-kind-array-entry = entri array

help-default = Baku:
help-active-default = Baku ane aktif:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nilai ane dadi (abesik asing-asing):
       *[other] Nilai ane dadi:
    }

help-suggested-values = Nilai ane kasaranang:

help-inserts = Nyelipang:

# No select: «koordinat» is the same word for one and for many.
help-coordinates = Koordinat:

help-type = Jenis:

help-resolved-style = Gaya ane suba kapastiang (styleNumber { $styleNumber }):

help-resolved-function-names = Adan fungsi ane suba kapastiang:
help-reset-list = Daftar reset di input ene:
help-added-on-input = Kaimbuhin di input ene:
help-removed-on-input = Kakaadang di input ene:

help-reset-overrides = { $reset } ngalahang { $additional } lan { $removed }.
