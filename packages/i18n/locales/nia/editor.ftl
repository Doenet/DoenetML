# Nias (Li Niha) editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety and orthography: the northern standard, in Latin**, with `ö` a
# letter of its own that must never be folded to `o`. `chrome.ftl`'s header
# sets out the alphabet, the final-vowel property and what this catalog does
# about it, and why initial mutation is not applied.
#
# **This is the file where the Indonesian loan register is heaviest**, and it
# should be read as such rather than as a failure to translate. An editor's
# nouns — «editor», «penampil», «varian», «saringan», «komponen», «atribut»,
# «referensi», «properti», «cuplikan», «larik», «nilai», «tipe», «gaya»,
# «koordinat», «fungsi», «baris», «tag», «dokumentasi», «aksesibilitas»,
# «laporan», «versi», «format», «konteks», «diagnostik» — are Indonesian in a
# Nias speaker's computing vocabulary, and none of them ends in a vowel. The
# file therefore reads as two languages at once in a way `content.ftl` does
# not, and that is the honest state of the register rather than an oversight.
#
# What is Nias here is the frame: «lö» (not), «tebai» (cannot), «tola» (can),
# «so» (there is), «moroi» (from), «ba» (in, at, and), «awö» (with), «ma»
# (or), «na» (if, when), «börö me» (because), «fefu» (all), «oya» (many),
# «andrö» (that), the passive «ni-» and the verbal «fa-» and «mu-», and the
# words «fanofu», «fanema li», «töi», «oroma», «bunia», «bokai», «faudu»,
# «moguna», «fazökhi» and «tesöndra».
#
# **The count selects.** Nias leaves a noun unmarked after a numeral, so
# «koordinat» is the same word for one and for many; `help-coordinates` and the
# two counts inside `editor-accessibility-label` collapse to a single
# `*[other]` branch. That is also what the plural rule requires — `nia` has no
# CLDR plural data, so an `[one]` branch here would be selected by English's
# rules — but it would be the right form even if it did.
#
# **What this catalog does not know.** The spoken adaptation of any of the
# loans above, the initial mutation every noun in it is missing, and whether
# «penampil» or a Nias phrase reads better for *viewer*.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Fatambai
       *[update] Fabö'ö
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } penampil
       *[other] { $word } penampil { $shortcut }
    }


## The variant picker

editor-variant = Varian

editor-variant-filter = Saring...

editor-variant-next = Fili varian si so föna
editor-variant-previous = Fili varian si fatua


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Tesöndra pelanggaran aksesibilitas WCAG AA. Klik ba { $action ->
            [close] wanutu
           *[open] wamokai
        } laporan aksesibilitas.
        [advisories] Klik ba { $action ->
            [close] wanutu
           *[open] wamokai
        } laporan aksesibilitas. Lö tesöndra pelanggaran WCAG AA, ba so nasa saran aksesibilitas tanö bö'ö.
       *[clean] Klik ba { $action ->
            [close] wanutu
           *[open] wamokai
        } laporan aksesibilitas. Lö tesöndra masalah aksesibilitas.
    }

editor-accessibility-label =
    { $status ->
        [violations] Tesöndra pelanggaran aksesibilitas WCAG AA. Tesöndra { $count } pelanggaran WCAG AA. Klik ba { $action ->
            [close] wanutu
           *[open] wamokai
        } laporan aksesibilitas.
        [advisories] Lö tesöndra pelanggaran WCAG AA. Tesöndra { $count } saran aksesibilitas tanö bö'ö. Klik ba { $action ->
            [close] wanutu
           *[open] wamokai
        } laporan aksesibilitas.
       *[clean] Lö tesöndra pelanggaran WCAG AA. Klik ba { $action ->
            [close] wanutu
           *[open] wamokai
        } laporan aksesibilitas.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versi { $version }

editor-tab-help = Fanolo si faudu ba konteks
editor-tab-help-short = Konteks
editor-tab-errors = Fasala
editor-tab-warnings = Fango'ou
editor-tab-info = Info
editor-tab-accessibility = Aksesibilitas
editor-tab-responses = Fanema li si no mufa'ohe

editor-tab-with-count = { $label }: { $count }

editor-options = Pilihan editor
editor-format-as-doenetml = Format simane DoenetML
editor-format-as-xml = Format simane XML


## The diagnostics panel

editor-diagnostic-line = Baris #{ $line }

editor-no-errors = Lö fasala
editor-no-warnings = Lö fango'ou
editor-no-info = Lö diagnostik info

editor-show-info-annotations = Oroma'ö diagnostik info ba editor
editor-show-accessibility-annotations = Oroma'ö diagnostik aksesibilitas ba editor

editor-accessibility-learn-more = Fahaö ba wamalua aksesibilitas ba Doenet

editor-accessibility-violations-heading = Pelanggaran aksesibilitas ({ $standard })

editor-accessibility-other-heading = Masalah aksesibilitas tanö bö'ö
editor-none-found = Lö tesöndra


## Submitted responses

editor-no-responses = Lö nasa fanema li si no mufa'ohe
editor-response-answer-id = Id wanema li
editor-response-response = Fanema li
editor-response-credit = Nilai
editor-response-submitted = No mufa'ohe


## The context-help panel

help-placeholder = Be'e kursor ba döi tag, atribut, ma { $ref } ba wamaigi dokumentasi.

help-unsupported-ref-chain = Fanolo ba referensi si oya ngawalö simane { $example } lö nasa so.

help-unresolved-ref =
    { $reason ->
        [notFound] Lö tesöndra nitunö referensi andre: { $ref }.
        [multiple] Oya nitunö referensi andre: { $ref }.
       *[indeterminate] Nitunö { $ref } tebai mu'ila.
    }

help-learn-about-references = Fahaö sanandrösa ba referensi →
help-reference-page = Halaman rujukan →

help-suggestions-header =
    { $location ->
        [inside] Bakha ba { $element }
       *[top] Ba tingkat si yawa sibai
    }{ $allowed ->
        [none] { " — lö hadöi zi tola muhalö ba da'e." }
        [text] { " — sura teks ba da'e." }
        [text-and-components] { " — sura teks ba da'e, ma andrö tandraigö:" }
       *[components] { " — hadia zi tola tandraigö:" }
    }

help-suggestions-footer = Ta'u { $shortcut } ba wamaigi fefu { $total } komponen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } no referensi ba { $target }.
       *[other] { $ref } no referensi ba { $target } (baris { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ni'ombakha'ö { $owner } simane { $role }.
       *[other] Ni'ombakha'ö { $owner } ba baris { $line } simane { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } no referensi ba properti { $property } khö { $element }.
       *[other] { $ref } no referensi ba properti { $property } khö { $element } (baris { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = cuplikan
help-kind-array-entry = entri larik

help-default = Bawaan:
help-active-default = Bawaan si mohalöwö:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nilai si tola (sara ba zi sambua item):
       *[other] Nilai si tola:
    }

help-suggested-values = Nilai ni'ombakha'ö:

help-inserts = Nifasui:

help-coordinates = Koordinat:

help-type = Tipe:

help-resolved-style = Gaya si tesöndra (styleNumber { $styleNumber }):

help-resolved-function-names = Töi fungsi si tesöndra:
help-reset-list = Daftar nifatambai ba masukan andre:
help-added-on-input = Nitambö ba masukan andre:
help-removed-on-input = Niheta ba masukan andre:

help-reset-overrides = { $reset } famalalini { $additional } awö { $removed }.
