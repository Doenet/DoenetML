# Kadazandusun editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the standardised Bundu-Liwan-based Kadazandusun orthography used
# by the other three files of this locale; see `locales/dtp/chrome.ftl` for
# the whole note, including why most of the vocabulary below is a declared
# Malay loan rather than a Kadazandusun coinage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay in English exactly as written.
#
# The Kadazandusun in this file is its frame — «waro», «aiso», «amu'», «om»,
# «toi», «nung», «montok», «id», «mantad», «obuli», «diti», «dot» — around
# Malay technical nouns. A reviewer who wants to know whether the file is
# Kadazandusun should read those words rather than the nouns between them.
#
# Kadazandusun does not mark number on a noun after a numeral, and
# `Intl.PluralRules` has no data for `dtp` in any case, so every count
# selection here is collapsed to a single `*[other]`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Set Semula
       *[update] Kemas Kini
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Pemapar
       *[other] { $word } Pemapar { $shortcut }
    }


## The variant picker

editor-variant = Varian
editor-variant-filter = Tapis…
editor-variant-next = Pilih varian dot seterusnya
editor-variant-previous = Pilih varian dot sebelum


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Waro pelanggaran akses WCAG AA. Tekan montok { $action ->
            [close] tutup
           *[open] buka
        } laporan akses.
        [advisories] Tekan montok { $action ->
            [close] tutup
           *[open] buka
        } laporan akses. Aiso pelanggaran WCAG AA, nga waro cadangan akses tambahan.
       *[clean] Tekan montok { $action ->
            [close] tutup
           *[open] buka
        } laporan akses. Aiso masalah akses.
    }

editor-accessibility-label =
    { $status ->
        [violations] Waro pelanggaran akses WCAG AA. Waro { $count ->
           *[other] { $count } pelanggaran WCAG AA
        }. Tekan montok { $action ->
            [close] tutup
           *[open] buka
        } laporan akses.
        [advisories] Aiso pelanggaran WCAG AA. Waro { $count ->
           *[other] { $count } cadangan akses tambahan
        }. Tekan montok { $action ->
            [close] tutup
           *[open] buka
        } laporan akses.
       *[clean] Aiso pelanggaran WCAG AA. Tekan montok { $action ->
            [close] tutup
           *[open] buka
        } laporan akses.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versi DoenetML { $version }

editor-tab-help = Bantuan mengikut konteks
editor-tab-help-short = Konteks
editor-tab-errors = Ralat
editor-tab-warnings = Amaran
editor-tab-info = Maklumat
editor-tab-accessibility = Akses
editor-tab-responses = Simbar dot dihantar

editor-tab-with-count = { $label }: { $count }

editor-options = Pilihan editor
editor-format-as-doenetml = Format sebagai DoenetML
editor-format-as-xml = Format sebagai XML


## The diagnostics panel

editor-diagnostic-line = Baris #{ $line }

editor-no-errors = Aiso Ralat
editor-no-warnings = Aiso Amaran
editor-no-info = Aiso Maklumat

editor-show-info-annotations = Tunjuk maklumat id editor
editor-show-accessibility-annotations = Tunjuk pesanan akses id editor

editor-accessibility-learn-more = Belajar pasal cara Doenet menjaga akses

editor-accessibility-violations-heading = Pelanggaran akses ({ $standard })

editor-accessibility-other-heading = Masalah akses lain
editor-none-found = Aiso


## Submitted responses

editor-no-responses = Aiso nogi simbar dot dihantar
editor-response-answer-id = Id Simbar
editor-response-response = Simbar
editor-response-credit = Markah
editor-response-submitted = Dihantar


## The context-help panel

help-placeholder = Letak kursor id nama tag, atribut toi { $ref } montok melihat dokumentasi.

help-unsupported-ref-chain = Bantuan montok rujukan berbilang bahagian macam { $example } amu' nogi disokong.

help-unresolved-ref =
    { $reason ->
        [notFound] Aiso rujukan dijumpai montok: { $ref }.
        [multiple] Waro beberapa rujukan dijumpai montok: { $ref }.
       *[indeterminate] Rujukan montok { $ref } amu' obuli ditentukan.
    }

help-learn-about-references = Belajar pasal rujukan →
help-reference-page = Halaman rujukan →

help-suggestions-header =
    { $location ->
        [inside] Id dalam { $element }
       *[top] Id aras atas
    }{ $allowed ->
        [none] { " — aiso dot boleh masuk diti." }
        [text] { " — taip teks diti." }
        [text-and-components] { " — taip teks diti, toi cuba diti:" }
       *[components] { " — dot boleh dicuba:" }
    }

help-suggestions-footer = Tekan { $shortcut } montok melihat semua { $total } komponen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } nopo rujukan montok { $target }.
       *[other] { $ref } nopo rujukan montok { $target } (baris { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Diperkenalkan { $owner } sebagai { $role }.
       *[other] Diperkenalkan { $owner } id baris { $line } sebagai { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } nopo rujukan montok sifat { $property } id { $element }.
       *[other] { $ref } nopo rujukan montok sifat { $property } id { $element } (baris { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = cebisan kod
help-kind-array-entry = isi array

help-default = Nilai asal:
help-active-default = Nilai asal dot aktif:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nilai dot dibenarkan (satu montok setiap item):
       *[other] Nilai dot dibenarkan:
    }

help-suggested-values = Nilai dot dicadangkan:

help-inserts = Menyisip:

help-coordinates =
    { $count ->
       *[other] Koordinat:
    }

help-type = Jenis:

help-resolved-style = Gaya dot ditentukan (styleNumber { $styleNumber }):

help-resolved-function-names = Nama fungsi dot ditentukan:
help-reset-list = Senarai set semula id input diti:
help-added-on-input = Ditambah id input diti:
help-removed-on-input = Dibuang mantad input diti:

help-reset-overrides = { $reset } mengatasi { $additional } om { $removed }.
