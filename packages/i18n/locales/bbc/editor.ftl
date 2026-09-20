# Toba Batak (Hata Batak Toba) editor and language-server surfaces. Translated
# from `locales/en/editor.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin**, in the spelling `chrome.ftl`'s header sets out, and no
# Surat Batak anywhere in this file.
#
# **This is the file where the Indonesian loan register is heaviest**, and it
# should be read as such rather than as a failure to translate. An editor's
# nouns — «editor», «penampil», «varian», «saringan», «komponen», «atribut»,
# «referensi», «properti», «cuplikan», «larik», «nilai», «tipe», «gaya»,
# «koordinat», «fungsi», «baris», «tag», «dokumentasi», «aksesibilitas»,
# «laporan», «versi», «format», «konteks», «diagnostik» — are Indonesian in a
# Batak speaker's computing vocabulary, and there is no Batak word for any of
# them that a reviewer would recognize. What is Toba Batak here is the frame:
# the negator «ndang», the modal «boi», the linker «na», the possessive «ni»,
# the prepositions «di», «tu» and «sian», and the verbs «patuduhon» (show),
# «tabunihon» (hide), «mambuhai» (open), «manutup» (close), «pillit» (choose),
# «jumpang» (found), «pasahat» (submit) and «guruhon» (learn).
#
# **`editor-coordinates` and the count selects.** Toba Batak leaves a noun
# unmarked after a numeral, so «koordinat» is the same word for one and for
# many; `help-coordinates` and the two counts inside
# `editor-accessibility-label` collapse to a single `*[other]` branch. That is
# also what the plural rule requires — `bbc` has no CLDR plural data, so an
# `[one]` branch here would be selected by English's rules — but it would be
# the right form even if it did.
#
# **What this catalog does not know.** Whether «penampil» or a Batak phrase
# reads better for *viewer*, and whether an imperative like «Buhai» is polite
# enough for a button. Both are speaker questions, and both are one edit away.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ulang
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

editor-variant-next = Pillit varian na pudi
editor-variant-previous = Pillit varian na jolo


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Jumpang pelanggaran aksesibilitas WCAG AA. Klik laho { $action ->
            [close] manutup
           *[open] mambuhai
        } laporan aksesibilitas.
        [advisories] Klik laho { $action ->
            [close] manutup
           *[open] mambuhai
        } laporan aksesibilitas. Ndang adong pelanggaran WCAG AA na jumpang, alai adong dope panuturi aksesibilitas na asing.
       *[clean] Klik laho { $action ->
            [close] manutup
           *[open] mambuhai
        } laporan aksesibilitas. Ndang adong parsoalan aksesibilitas na jumpang.
    }

editor-accessibility-label =
    { $status ->
        [violations] Jumpang pelanggaran aksesibilitas WCAG AA. Jumpang { $count } pelanggaran WCAG AA. Klik laho { $action ->
            [close] manutup
           *[open] mambuhai
        } laporan aksesibilitas.
        [advisories] Ndang adong pelanggaran WCAG AA na jumpang. Jumpang { $count } panuturi aksesibilitas na asing. Klik laho { $action ->
            [close] manutup
           *[open] mambuhai
        } laporan aksesibilitas.
       *[clean] Ndang adong pelanggaran WCAG AA na jumpang. Klik laho { $action ->
            [close] manutup
           *[open] mambuhai
        } laporan aksesibilitas.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versi { $version }

editor-tab-help = Panorangi na hombar tu konteks
editor-tab-help-short = Konteks
editor-tab-errors = Hasalaan
editor-tab-warnings = Sipaingot
editor-tab-info = Info
editor-tab-accessibility = Aksesibilitas
editor-tab-responses = Alus na pinasahat

editor-tab-with-count = { $label }: { $count }

editor-options = Pilihan editor
editor-format-as-doenetml = Format songon DoenetML
editor-format-as-xml = Format songon XML


## The diagnostics panel

editor-diagnostic-line = Baris #{ $line }

editor-no-errors = Ndang adong hasalaan
editor-no-warnings = Ndang adong sipaingot
editor-no-info = Ndang adong diagnostik info

editor-show-info-annotations = Patuduhon diagnostik info di editor
editor-show-accessibility-annotations = Patuduhon diagnostik aksesibilitas di editor

editor-accessibility-learn-more = Guruhon songon dia Doenet mangaradoti aksesibilitas

editor-accessibility-violations-heading = Pelanggaran aksesibilitas ({ $standard })

editor-accessibility-other-heading = Parsoalan aksesibilitas na asing
editor-none-found = Ndang adong na jumpang


## Submitted responses

editor-no-responses = Ndang adong dope alus na pinasahat
editor-response-answer-id = Id ni alus
editor-response-response = Alus
editor-response-credit = Nilai
editor-response-submitted = Pinasahat


## The context-help panel

help-placeholder = Bahen kursor tu goar ni tag, atribut, manang { $ref } laho mangida dokumentasi.

help-unsupported-ref-chain = Panorangi tu referensi na marlapis-lapis songon { $example } ndang dope adong.

help-unresolved-ref =
    { $reason ->
        [notFound] Ndang jumpang na ditudu referensi on: { $ref }.
        [multiple] Torop na ditudu referensi on: { $ref }.
       *[indeterminate] Ndang boi ditontuhon aha na ditudu { $ref }.
    }

help-learn-about-references = Guruhon taringot referensi →
help-reference-page = Halaman rujukan →

help-suggestions-header =
    { $location ->
        [inside] Di bagasan { $element }
       *[top] Di tingkat na tumimbo
    }{ $allowed ->
        [none] { " — ndang adong na boi dibahen dison." }
        [text] { " — surathon teks dison." }
        [text-and-components] { " — surathon teks dison, manang coba:" }
       *[components] { " — na boi dicoba:" }
    }

help-suggestions-footer = Tostos { $shortcut } laho mangida sude { $total } komponen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } i ma referensi tu { $target }.
       *[other] { $ref } i ma referensi tu { $target } (baris { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Dipabotohon { $owner } songon { $role }.
       *[other] Dipabotohon { $owner } di baris { $line } songon { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } i ma referensi tu properti { $property } ni { $element }.
       *[other] { $ref } i ma referensi tu properti { $property } ni { $element } (baris { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = cuplikan
help-kind-array-entry = entri larik

help-default = Bawaan:
help-active-default = Bawaan na mardalan:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nilai na boi (sada ganup item):
       *[other] Nilai na boi:
    }

help-suggested-values = Nilai na tinuturhon:

help-inserts = Na dibahen masuk:

help-coordinates = Koordinat:

help-type = Tipe:

help-resolved-style = Gaya na dapot (styleNumber { $styleNumber }):

help-resolved-function-names = Goar ni fungsi na dapot:
help-reset-list = Daftar na diulang di masukan on:
help-added-on-input = Na tinamba di masukan on:
help-removed-on-input = Na binuang di masukan on:

help-reset-overrides = { $reset } manggantihon { $additional } dohot { $removed }.
