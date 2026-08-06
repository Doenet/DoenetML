# Minangkabau editor and language-server surfaces. Translated from
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
# Minangkabau marks no number on the noun, so a `{ $count -> … }` whose two
# English branches differ only in the noun renders one string here and the
# select is dropped.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Kambalikan
       *[update] Pabarui
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } panampil
       *[other] { $word } panampil { $shortcut }
    }


## The variant picker

editor-variant = Varian
editor-variant-filter = Sariang…
editor-variant-next = Piliah varian salanjuiknyo
editor-variant-previous = Piliah varian sabalunnyo


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ado palanggaran aksesibilitas WCAG AA nan basuo. Klik untuak { $action ->
            [close] manutuik
           *[open] mambukak
        } laporan aksesibilitas.
        [advisories] Klik untuak { $action ->
            [close] manutuik
           *[open] mambukak
        } laporan aksesibilitas. Indak ado palanggaran WCAG AA nan basuo, tapi ado saran aksesibilitas nan lain.
       *[clean] Klik untuak { $action ->
            [close] manutuik
           *[open] mambukak
        } laporan aksesibilitas. Indak ado masalah aksesibilitas nan basuo.
    }

# No select on `$count` inside the branches: «palanggaran» and «saran» are the
# same words for one and for many.
editor-accessibility-label =
    { $status ->
        [violations] Ado palanggaran aksesibilitas WCAG AA nan basuo. Basuo { $count } palanggaran WCAG AA. Klik untuak { $action ->
            [close] manutuik
           *[open] mambukak
        } laporan aksesibilitas.
        [advisories] Indak ado palanggaran WCAG AA nan basuo. Basuo { $count } saran aksesibilitas nan lain. Klik untuak { $action ->
            [close] manutuik
           *[open] mambukak
        } laporan aksesibilitas.
       *[clean] Indak ado palanggaran WCAG AA nan basuo. Klik untuak { $action ->
            [close] manutuik
           *[open] mambukak
        } laporan aksesibilitas.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versi DoenetML { $version }

editor-tab-help = Bantuan manuruik konteks
editor-tab-help-short = Konteks
editor-tab-errors = Kasalahan
editor-tab-warnings = Peringatan
editor-tab-info = Katarangan
editor-tab-accessibility = Aksesibilitas
editor-tab-responses = Jawaban nan alah dikirim

editor-tab-with-count = { $label }: { $count }

editor-options = Piliahan editor
editor-format-as-doenetml = Format sabagai DoenetML
editor-format-as-xml = Format sabagai XML


## The diagnostics panel

editor-diagnostic-line = Barih #{ $line }

editor-no-errors = Indak ado kasalahan
editor-no-warnings = Indak ado peringatan
editor-no-info = Indak ado diagnostik katarangan

editor-show-info-annotations = Tampilkan diagnostik katarangan di editor
editor-show-accessibility-annotations = Tampilkan diagnostik aksesibilitas di editor

editor-accessibility-learn-more = Palajari caro Doenet manangani aksesibilitas

editor-accessibility-violations-heading = Palanggaran aksesibilitas ({ $standard })

editor-accessibility-other-heading = Masalah aksesibilitas nan lain
editor-none-found = Indak ado nan basuo


## Submitted responses

editor-no-responses = Alun ado jawaban nan dikirim
editor-response-answer-id = Id jawaban
editor-response-response = Jawaban
editor-response-credit = Kredit
editor-response-submitted = Dikirim


## The context-help panel

help-placeholder = Latakkan kursor di namo tag, atribut, atau { $ref } untuak dokumentasi.

help-unsupported-ref-chain = Bantuan untuak rujuakan babagai bagian saroman { $example } alun didukuang lai.

help-unresolved-ref =
    { $reason ->
        [notFound] Indak basuo nan ditunjuak dek rujuakan: { $ref }.
        [multiple] Banyak nan ditunjuak dek rujuakan: { $ref }.
       *[indeterminate] Indak bisa ditantukan apo nan ditunjuak dek { $ref }.
    }

help-learn-about-references = Palajari tantang rujuakan →
help-reference-page = Laman rujuakan →

help-suggestions-header =
    { $location ->
        [inside] Di dalam { $element }
       *[top] Di tingkek paliang ateh
    }{ $allowed ->
        [none] { " — indak ado nan buliah dilatakkan di siko." }
        [text] { " — tuliskan teks di siko." }
        [text-and-components] { " — tuliskan teks di siko, atau cubo:" }
       *[components] { " — nan bisa dicubo:" }
    }

help-suggestions-footer = Takan { $shortcut } untuak maliek sadonyo { $total } komponen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } adolah rujuakan ka { $target }.
       *[other] { $ref } adolah rujuakan ka { $target } (barih { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Dibaok dek { $owner } sabagai { $role }.
       *[other] Dibaok dek { $owner } di barih { $line } sabagai { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } adolah rujuakan ka sifat { $property } dari { $element }.
       *[other] { $ref } adolah rujuakan ka sifat { $property } dari { $element } (barih { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = potongan kode
help-kind-array-entry = entri array

help-default = Baku:
help-active-default = Baku nan aktif:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nilai nan dibuliahkan (ciek satiok item):
       *[other] Nilai nan dibuliahkan:
    }

help-suggested-values = Nilai nan disarankan:

help-inserts = Manyisipkan:

# No select: «koordinat» is the same word for one and for many.
help-coordinates = Koordinat:

help-type = Jinih:

help-resolved-style = Gaya nan alah ditantukan (styleNumber { $styleNumber }):

help-resolved-function-names = Namo fungsi nan alah ditantukan:
help-reset-list = Daftar reset di input ko:
help-added-on-input = Ditambah di input ko:
help-removed-on-input = Dihapuih di input ko:

help-reset-overrides = { $reset } mangatasi { $additional } jo { $removed }.
