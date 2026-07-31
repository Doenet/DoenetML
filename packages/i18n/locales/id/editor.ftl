# Indonesian editor and language-server surfaces. Translated from
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
# Indonesian has a single plural category, so a countable message needs no
# selection — `[other]` covers every count.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Setel ulang
       *[update] Perbarui
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } penampil
       *[other] { $word } penampil { $shortcut }
    }


## The variant picker

editor-variant = Varian
editor-variant-filter = Saring...
editor-variant-next = Pilih varian berikutnya
editor-variant-previous = Pilih varian sebelumnya


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Pelanggaran aksesibilitas WCAG AA teridentifikasi. Klik untuk { $action ->
            [close] menutup
           *[open] membuka
        } laporan aksesibilitas.
        [advisories] Klik untuk { $action ->
            [close] menutup
           *[open] membuka
        } laporan aksesibilitas. Tidak ditemukan pelanggaran WCAG AA, tetapi ada rekomendasi aksesibilitas tambahan.
       *[clean] Klik untuk { $action ->
            [close] menutup
           *[open] membuka
        } laporan aksesibilitas. Tidak ditemukan masalah aksesibilitas.
    }

editor-accessibility-label =
    { $status ->
        [violations] Pelanggaran aksesibilitas WCAG AA teridentifikasi. Ditemukan { $count } pelanggaran WCAG AA. Klik untuk { $action ->
            [close] menutup
           *[open] membuka
        } laporan aksesibilitas.
        [advisories] Tidak ada pelanggaran WCAG AA yang teridentifikasi. Ditemukan { $count } rekomendasi aksesibilitas tambahan. Klik untuk { $action ->
            [close] menutup
           *[open] membuka
        } laporan aksesibilitas.
       *[clean] Tidak ada pelanggaran WCAG AA yang teridentifikasi. Klik untuk { $action ->
            [close] menutup
           *[open] membuka
        } laporan aksesibilitas.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versi { $version }

editor-tab-help = Bantuan sesuai konteks
editor-tab-help-short = Konteks
editor-tab-errors = Kesalahan
editor-tab-warnings = Peringatan
editor-tab-info = Info
editor-tab-accessibility = Aksesibilitas
editor-tab-responses = Jawaban terkirim

editor-tab-with-count = { $label }: { $count }

editor-options = Opsi editor
editor-format-as-doenetml = Format sebagai DoenetML
editor-format-as-xml = Format sebagai XML


## The diagnostics panel

editor-diagnostic-line = Baris #{ $line }

editor-no-errors = Tidak ada kesalahan
editor-no-warnings = Tidak ada peringatan
editor-no-info = Tidak ada diagnostik info

editor-show-info-annotations = Tampilkan diagnostik info di editor
editor-show-accessibility-annotations = Tampilkan diagnostik aksesibilitas di editor

editor-accessibility-learn-more = Pelajari pendekatan Doenet terhadap aksesibilitas

editor-accessibility-violations-heading = Pelanggaran aksesibilitas ({ $standard })

editor-accessibility-other-heading = Masalah aksesibilitas lainnya
editor-none-found = Tidak ditemukan


## Submitted responses

editor-no-responses = Belum ada jawaban yang dikirim
editor-response-answer-id = Answer Id
editor-response-response = Jawaban
editor-response-credit = Nilai
editor-response-submitted = Dikirim


## The context-help panel

help-placeholder = Letakkan kursor pada nama tag, atribut, atau { $ref } untuk melihat dokumentasi.

help-unsupported-ref-chain = Bantuan untuk referensi bertingkat seperti { $example } belum didukung.

help-unresolved-ref =
    { $reason ->
        [notFound] Tidak ditemukan acuan untuk referensi: { $ref }.
        [multiple] Ditemukan beberapa acuan untuk referensi: { $ref }.
       *[indeterminate] Acuan untuk { $ref } tidak dapat ditentukan.
    }

help-learn-about-references = Pelajari tentang referensi →
help-reference-page = Halaman rujukan →

help-suggestions-header =
    { $location ->
        [inside] Di dalam { $element }
       *[top] Di tingkat teratas
    }{ $allowed ->
        [none] { " — tidak ada yang bisa diletakkan di sini." }
        [text] { " — ketik teks di sini." }
        [text-and-components] { " — ketik teks di sini, atau coba:" }
       *[components] { " — hal yang bisa dicoba:" }
    }

help-suggestions-footer = Tekan { $shortcut } untuk melihat semua { $total } komponen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } adalah referensi ke { $target }.
       *[other] { $ref } adalah referensi ke { $target } (baris { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Diperkenalkan oleh { $owner } sebagai { $role }.
       *[other] Diperkenalkan oleh { $owner } pada baris { $line } sebagai { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } adalah referensi ke properti { $property } dari { $element }.
       *[other] { $ref } adalah referensi ke properti { $property } dari { $element } (baris { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = cuplikan
help-kind-array-entry = entri larik

help-default = Bawaan:
help-active-default = Bawaan yang berlaku:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nilai yang diizinkan (satu per item):
       *[other] Nilai yang diizinkan:
    }

help-suggested-values = Nilai yang disarankan:

help-inserts = Menyisipkan:

help-coordinates = Koordinat:

help-type = Tipe:

help-resolved-style = Gaya hasil resolusi (styleNumber { $styleNumber }):

help-resolved-function-names = Nama fungsi hasil resolusi:
help-reset-list = Daftar setel ulang pada masukan ini:
help-added-on-input = Ditambahkan pada masukan ini:
help-removed-on-input = Dihapus pada masukan ini:

help-reset-overrides = { $reset } menggantikan { $additional } dan { $removed }.
