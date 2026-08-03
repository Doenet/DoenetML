# Malay editor and language-server surfaces. Translated from
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
# Malay has a single plural category, so a countable message needs no
# selection.


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
editor-variant-filter = Tapis...
editor-variant-next = Pilih varian seterusnya
editor-variant-previous = Pilih varian sebelumnya


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Pelanggaran kebolehcapaian WCAG AA dikesan. Klik untuk { $action ->
            [close] tutup
           *[open] buka
        } laporan kebolehcapaian.
        [advisories] Klik untuk { $action ->
            [close] tutup
           *[open] buka
        } laporan kebolehcapaian. Tiada pelanggaran WCAG AA ditemui, tetapi ada cadangan kebolehcapaian tambahan.
       *[clean] Klik untuk { $action ->
            [close] tutup
           *[open] buka
        } laporan kebolehcapaian. Tiada isu kebolehcapaian ditemui.
    }

editor-accessibility-label =
    { $status ->
        [violations] Pelanggaran kebolehcapaian WCAG AA dikesan. { $count } pelanggaran WCAG AA ditemui. Klik untuk { $action ->
            [close] tutup
           *[open] buka
        } laporan kebolehcapaian.
        [advisories] Tiada pelanggaran WCAG AA dikesan. { $count } cadangan kebolehcapaian tambahan ditemui. Klik untuk { $action ->
            [close] tutup
           *[open] buka
        } laporan kebolehcapaian.
       *[clean] Tiada pelanggaran WCAG AA dikesan. Klik untuk { $action ->
            [close] tutup
           *[open] buka
        } laporan kebolehcapaian.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versi { $version }

editor-tab-help = Bantuan mengikut konteks
editor-tab-help-short = Konteks
editor-tab-errors = Ralat
editor-tab-warnings = Amaran
editor-tab-info = Maklumat
editor-tab-accessibility = Kebolehcapaian
editor-tab-responses = Jawapan dihantar

editor-tab-with-count = { $label }: { $count }

editor-options = Pilihan penyunting
editor-format-as-doenetml = Formatkan sebagai DoenetML
editor-format-as-xml = Formatkan sebagai XML


## The diagnostics panel

editor-diagnostic-line = Baris #{ $line }

editor-no-errors = Tiada Ralat
editor-no-warnings = Tiada Amaran
editor-no-info = Tiada Diagnostik Maklumat

editor-show-info-annotations = Tunjukkan diagnostik maklumat dalam penyunting
editor-show-accessibility-annotations = Tunjukkan diagnostik kebolehcapaian dalam penyunting

editor-accessibility-learn-more = Ketahui pendekatan Doenet terhadap kebolehcapaian

editor-accessibility-violations-heading = Pelanggaran kebolehcapaian ({ $standard })

editor-accessibility-other-heading = Isu kebolehcapaian lain
editor-none-found = Tiada ditemui


## Submitted responses

editor-no-responses = Belum ada jawapan dihantar
editor-response-answer-id = Id Jawapan
editor-response-response = Jawapan
editor-response-credit = Markah
editor-response-submitted = Dihantar


## The context-help panel

help-placeholder = Letakkan kursor pada nama tag, atribut atau { $ref } untuk melihat dokumentasi.

help-unsupported-ref-chain = Bantuan bagi rujukan berbilang bahagian seperti { $example } belum disokong.

help-unresolved-ref =
    { $reason ->
        [notFound] Tiada rujukan ditemui bagi: { $ref }.
        [multiple] Beberapa rujukan ditemui bagi: { $ref }.
       *[indeterminate] Rujukan bagi { $ref } tidak dapat ditentukan.
    }

help-learn-about-references = Ketahui tentang rujukan →
help-reference-page = Halaman rujukan →

help-suggestions-header =
    { $location ->
        [inside] Dalam { $element }
       *[top] Pada aras teratas
    }{ $allowed ->
        [none] { " — tiada apa-apa boleh diletakkan di sini." }
        [text] { " — taip teks di sini." }
        [text-and-components] { " — taip teks di sini, atau cuba:" }
       *[components] { " — perkara untuk dicuba:" }
    }

help-suggestions-footer = Tekan { $shortcut } untuk melihat kesemua { $total } komponen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ialah rujukan kepada { $target }.
       *[other] { $ref } ialah rujukan kepada { $target } (baris { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Diperkenalkan oleh { $owner } sebagai { $role }.
       *[other] Diperkenalkan oleh { $owner } pada baris { $line } sebagai { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ialah rujukan kepada sifat { $property } bagi { $element }.
       *[other] { $ref } ialah rujukan kepada sifat { $property } bagi { $element } (baris { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = cebisan
help-kind-array-entry = entri tatasusunan

help-default = Lalai:
help-active-default = Lalai aktif:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nilai dibenarkan (satu bagi setiap item):
       *[other] Nilai dibenarkan:
    }

help-suggested-values = Nilai dicadangkan:

help-inserts = Menyisipkan:

help-coordinates = Koordinat:

help-type = Jenis:

help-resolved-style = Gaya terungkai (styleNumber { $styleNumber }):

help-resolved-function-names = Nama fungsi terungkai:
help-reset-list = Senarai yang diset semula pada input ini:
help-added-on-input = Ditambah pada input ini:
help-removed-on-input = Dibuang pada input ini:

help-reset-overrides = { $reset } mengatasi { $additional } dan { $removed }.
