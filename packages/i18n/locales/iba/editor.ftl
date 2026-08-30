# Iban editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the standard Sarawak Iban orthography used by the other three
# files of this locale — `ch` for Malay `c`, and the Iban prefixes `be-`,
# `te-`, `pe-`/`peN-`. See `locales/iba/chrome.ftl` for the whole note.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay in English exactly as written.
#
# DECLARED LOANS. `editor`, `input`, `array`, `kod`, `kursor`, `tag`,
# `atribut`, `koordinat`, `varian`, `versi` and `konteks` are written as they
# stand: they are the words an Iban reader has met these ideas under, in Malay
# or in English, and a coinage would be worse than a loan that is already in
# use. `Papan Peda` for "viewer" is a description rather than a loan —
# literally "viewing panel" — and is the phrase in this file a reviewer is
# most likely to want to replace.
#
# Iban does not mark number on a noun after a numeral, and `Intl.PluralRules`
# has no data for `iba` in any case, so every count selection here is
# collapsed to a single `*[other]` rather than carrying two branches that
# would read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Pulaika
       *[update] Baruka
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Papan Peda
       *[other] { $word } Papan Peda { $shortcut }
    }


## The variant picker

editor-variant = Varian
editor-variant-filter = Tapis…
editor-variant-next = Pilih varian ti ka mua
editor-variant-previous = Pilih varian ti ka belakang


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Pelanggar akses WCAG AA udah ditemu. Tekan kena { $action ->
            [close] nutup
           *[open] muka
        } laporan akses.
        [advisories] Tekan kena { $action ->
            [close] nutup
           *[open] muka
        } laporan akses. Nadai pelanggar WCAG AA ditemu, tang bisi saran akses tambah.
       *[clean] Tekan kena { $action ->
            [close] nutup
           *[open] muka
        } laporan akses. Nadai penyalah akses ditemu.
    }

editor-accessibility-label =
    { $status ->
        [violations] Pelanggar akses WCAG AA udah ditemu. { $count ->
           *[other] { $count } pelanggar WCAG AA
        } ditemu. Tekan kena { $action ->
            [close] nutup
           *[open] muka
        } laporan akses.
        [advisories] Nadai pelanggar WCAG AA ditemu. { $count ->
           *[other] { $count } saran akses tambah
        } ditemu. Tekan kena { $action ->
            [close] nutup
           *[open] muka
        } laporan akses.
       *[clean] Nadai pelanggar WCAG AA ditemu. Tekan kena { $action ->
            [close] nutup
           *[open] muka
        } laporan akses.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versi DoenetML { $version }

editor-tab-help = Tulung nitihka konteks
editor-tab-help-short = Konteks
editor-tab-errors = Penyalah
editor-tab-warnings = Amaran
editor-tab-info = Penerang
editor-tab-accessibility = Akses
editor-tab-responses = Saut ti udah dikirum

editor-tab-with-count = { $label }: { $count }

editor-options = Pilihan editor
editor-format-as-doenetml = Susun baka DoenetML
editor-format-as-xml = Susun baka XML


## The diagnostics panel

editor-diagnostic-line = Baris #{ $line }

editor-no-errors = Nadai Penyalah
editor-no-warnings = Nadai Amaran
editor-no-info = Nadai Penerang

editor-show-info-annotations = Ayanka penerang dalam editor
editor-show-accessibility-annotations = Ayanka pesan akses dalam editor

editor-accessibility-learn-more = Belajar pasal chara Doenet ngintu akses

editor-accessibility-violations-heading = Pelanggar akses ({ $standard })

editor-accessibility-other-heading = Penyalah akses bukai
editor-none-found = Nadai ditemu


## Submitted responses

editor-no-responses = Apin bisi saut dikirum
editor-response-answer-id = Id Saut
editor-response-response = Saut
editor-response-credit = Markah
editor-response-submitted = Udah dikirum


## The context-help panel

help-placeholder = Taruh kursor ba nama tag, atribut tauka { $ref } kena meda dokumentasi.

help-unsupported-ref-chain = Tulung ke rujuk mayuh bagi baka { $example } apin disukung.

help-unresolved-ref =
    { $reason ->
        [notFound] Nadai utai ditemu ke rujuk: { $ref }.
        [multiple] Mayuh utai ditemu ke rujuk: { $ref }.
       *[indeterminate] Utai ti ditunjuk { $ref } enda ulih dipastika.
    }

help-learn-about-references = Belajar pasal rujuk →
help-reference-page = Lambar rujuk →

help-suggestions-header =
    { $location ->
        [inside] Dalam { $element }
       *[top] Ba tingkat atas
    }{ $allowed ->
        [none] { " — nadai utai tama ditu." }
        [text] { " — tulis teks ditu." }
        [text-and-components] { " — tulis teks ditu, tauka uji tu:" }
       *[components] { " — utai ti ulih diuji:" }
    }

help-suggestions-footer = Tekan { $shortcut } kena meda semua { $total } komponen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } nya rujuk ngagai { $target }.
       *[other] { $ref } nya rujuk ngagai { $target } (baris { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ditaruh { $owner } baka { $role }.
       *[other] Ditaruh { $owner } ba baris { $line } baka { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } nya rujuk ngagai sipat { $property } ba { $element }.
       *[other] { $ref } nya rujuk ngagai sipat { $property } ba { $element } (baris { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = keping kod
help-kind-array-entry = isi array

help-default = Nilai asal:
help-active-default = Nilai asal ti bejalai:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nilai ti ulih dipakai (siti ke tiap iti):
       *[other] Nilai ti ulih dipakai:
    }

help-suggested-values = Nilai ti disaran:

help-inserts = Nyelit:

help-coordinates =
    { $count ->
       *[other] Koordinat:
    }

help-type = Jenis:

help-resolved-style = Gaya ti udah dipastika (styleNumber { $styleNumber }):

help-resolved-function-names = Nama fungsi ti udah dipastika:
help-reset-list = Senarai pulai ba input tu:
help-added-on-input = Ditambah ba input tu:
help-removed-on-input = Dibuai ari input tu:

help-reset-overrides = { $reset } ngatasi { $additional } enggau { $removed }.
