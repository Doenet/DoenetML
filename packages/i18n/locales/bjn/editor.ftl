# Banjar (Bahasa Banjar) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button, and the
# context-help panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography and register** are `chrome.ftl`'s: Banjar Hulu in the ordinary
# Indonesian Latin alphabet, with an Indonesian technical vocabulary declared
# as such and a Banjar everyday layer — «kada», «kada kawa», «nang», «gasan»,
# «matan», «lawan», «amun», «katamu», «barataan» — that is what makes this
# catalog Banjar rather than Indonesian.
#
# **`WCAG`, `DoenetML`, `styleNumber` and every attribute and element name
# stay in English**, as they do in every catalog: they are identifiers an
# author types, not words.
#
# **The counts do not fork.** `editor-accessibility-label` and
# `help-coordinates` write a single `*[other]` where English writes `[one]`
# and `[other]`: CLDR has no plural data for `bjn`, so an English-selected
# branch would be worse than none, and Banjar leaves the noun unmarked after a
# numeral in any case.
#
# **`help-name-summary` is punctuation.** It is rendered with `{ $name }`
# empty for a suggestion the panel has already named, so the em dash and its
# spaces have to read on their own; that is why it is not rewritten as a
# sentence.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Balikakan
       *[update] Barui
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Panampil
       *[other] { $word } Panampil { $shortcut }
    }


## The variant picker

editor-variant = Varian

editor-variant-filter = Saring...

editor-variant-next = Pilih varian barikutnya

editor-variant-previous = Pilih varian sabalumnya


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Katamu palanggaran aksesibilitas WCAG AA. Klik gasan { $action ->
            [close] manutup
           *[open] mambuka
        } laporan aksesibilitas.
        [advisories] Klik gasan { $action ->
            [close] manutup
           *[open] mambuka
        } laporan aksesibilitas. Kadada palanggaran WCAG AA nang katamu, tagal ada saran aksesibilitas nang lain.
       *[clean] Klik gasan { $action ->
            [close] manutup
           *[open] mambuka
        } laporan aksesibilitas. Kadada masalah aksesibilitas nang katamu.
    }

editor-accessibility-label =
    { $status ->
        [violations] Katamu palanggaran aksesibilitas WCAG AA. Katamu { $count ->
           *[other] { $count } palanggaran WCAG AA
        }. Klik gasan { $action ->
            [close] manutup
           *[open] mambuka
        } laporan aksesibilitas.
        [advisories] Kadada palanggaran WCAG AA nang katamu. Katamu { $count ->
           *[other] { $count } saran aksesibilitas tambahan
        }. Klik gasan { $action ->
            [close] manutup
           *[open] mambuka
        } laporan aksesibilitas.
       *[clean] Kadada palanggaran WCAG AA nang katamu. Klik gasan { $action ->
            [close] manutup
           *[open] mambuka
        } laporan aksesibilitas.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versi { $version }

editor-tab-help = Batuan sasuai kunteks
editor-tab-help-short = Kunteks
editor-tab-errors = Kasalahan
editor-tab-warnings = Paringatan
editor-tab-info = Info
editor-tab-accessibility = Aksesibilitas
editor-tab-responses = Jawaban nang tapadi

editor-tab-with-count = { $label }: { $count }

editor-options = Pilihan panyunting
editor-format-as-doenetml = Ator sabagai DoenetML
editor-format-as-xml = Ator sabagai XML


## The diagnostics panel

editor-diagnostic-line = Baris #{ $line }

editor-no-errors = Kadada kasalahan
editor-no-warnings = Kadada paringatan
editor-no-info = Kadada diagnostik info

editor-show-info-annotations = Tampaiakan diagnostik info di panyunting
editor-show-accessibility-annotations = Tampaiakan diagnostik aksesibilitas di panyunting

editor-accessibility-learn-more = Pelajari kayapa Doenet manggarap aksesibilitas

editor-accessibility-violations-heading = Palanggaran aksesibilitas ({ $standard })

editor-accessibility-other-heading = Masalah aksesibilitas nang lain
editor-none-found = Kadada nang katamu


## Submitted responses

editor-no-responses = Balum ada jawaban nang tapadi
editor-response-answer-id = Id jawaban
editor-response-response = Jawaban
editor-response-credit = Nilai
editor-response-submitted = Tapadi


## The context-help panel

help-placeholder = Andakakan kursor di nama tag, atribut, atawa { $ref } gasan dokumentasi.

help-unsupported-ref-chain = Batuan gasan referensi babagian kaya { $example } balum didukung.

help-unresolved-ref =
    { $reason ->
        [notFound] Kadada acuan nang katamu gasan referensi: { $ref }.
        [multiple] Katamu babarapa acuan gasan referensi: { $ref }.
       *[indeterminate] Acuan gasan { $ref } kada kawa ditantuakan.
    }

help-learn-about-references = Pelajari pasal referensi →
help-reference-page = Halaman rujukan →

help-suggestions-header =
    { $location ->
        [inside] Di dalam { $element }
       *[top] Di tingkat paling luar
    }{ $allowed ->
        [none] { " — kadada nang muat di sini." }
        [text] { " — tulis teks di sini." }
        [text-and-components] { " — tulis teks di sini, atawa cuba:" }
       *[components] { " — nang kawa dicuba:" }
    }

help-suggestions-footer = Tikan { $shortcut } gasan malihat barataan { $total } komponen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } marupakan referensi ka { $target }.
       *[other] { $ref } marupakan referensi ka { $target } (baris { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Diadaakan ulih { $owner } sabagai { $role }.
       *[other] Diadaakan ulih { $owner } di baris { $line } sabagai { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } marupakan referensi ka properti { $property } milik { $element }.
       *[other] { $ref } marupakan referensi ka properti { $property } milik { $element } (baris { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = potongan
help-kind-array-entry = isian larik

help-default = Bawaan:
help-active-default = Bawaan nang bajalan:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nilai nang dibulihakan (satu gasan tiap item):
       *[other] Nilai nang dibulihakan:
    }

help-suggested-values = Nilai nang disaranakan:

help-inserts = Manyisipakan:

help-coordinates =
    { $count ->
       *[other] Kuurdinat:
    }

help-type = Tipe:

help-resolved-style = Gaya nang tatantu (styleNumber { $styleNumber }):

help-resolved-function-names = Nama fungsi nang tatantu:
help-reset-list = Daftar nang diulang di masukan ini:
help-added-on-input = Ditambah di masukan ini:
help-removed-on-input = Dihapus di masukan ini:

help-reset-overrides = { $reset } manimpa { $additional } wan { $removed }.
