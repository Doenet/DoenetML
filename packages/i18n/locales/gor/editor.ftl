# Gorontalo (Bahasa Hulontalo) editor and language-server surfaces. Translated
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
# **Orthography: the Latin practice in current use**, no diacritics, the
# glottal stop written `'` only where a word would otherwise be ambiguous;
# `chrome.ftl`'s header sets it out in full.
#
# **This is the file where the loan register is heaviest**, and it should be
# read as such rather than as a failure to translate. An editor's nouns —
# «editor», «penampil», «varian», «saringan», «komponen», «atribut»,
# «referensi», «properti», «cuplikan», «larik», «nilai», «tipe», «gaya»,
# «koordinat», «fungsi», «baris», «tag», «dokumentasi», «aksesibilitas»,
# «laporan», «versi», «format», «konteks», «diagnostik» — are Indonesian in a
# Gorontalo speaker's computing vocabulary, and there is no Gorontalo word for
# any of them the seed can reach. What is Gorontalo here is the frame: «diila»,
# «mowali», «woluwo», «u», «to», «lonto», «lo», «wawu», «meyalo», «wonu», the
# verbs «mohuo» (open), «molautu» (close), «mohutu» (do), «momilohu» (see) and
# the causative «mopo-».
#
# **The count selects.** Gorontalo leaves a noun unmarked after a numeral, so
# «koordinat» is the same word for one and for many; `help-coordinates` and the
# two counts inside `editor-accessibility-label` collapse to a single
# `*[other]` branch. That is also what the plural rule requires — `gor` has no
# CLDR plural data, so an `[one]` branch here would be selected by English's
# rules — but it would be the right form even if it did.
#
# **What this catalog does not know.** Whether «penampil» or a Gorontalo phrase
# reads better for *viewer*, and what register an imperative on a button should
# be in. Both are speaker questions.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Poluli
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

editor-variant-next = Tulawota varian u ma monao
editor-variant-previous = Tulawota varian u lomayi


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Iloontonga pelanggaran aksesibilitas WCAG AA. Klik u { $action ->
            [close] molautu
           *[open] mohuo
        } laporan aksesibilitas.
        [advisories] Klik u { $action ->
            [close] molautu
           *[open] mohuo
        } laporan aksesibilitas. Diila woluwo pelanggaran WCAG AA u iloontonga, bo woluwo poli saran aksesibilitas wuwewo.
       *[clean] Klik u { $action ->
            [close] molautu
           *[open] mohuo
        } laporan aksesibilitas. Diila woluwo masalah aksesibilitas u iloontonga.
    }

editor-accessibility-label =
    { $status ->
        [violations] Iloontonga pelanggaran aksesibilitas WCAG AA. Iloontonga { $count } pelanggaran WCAG AA. Klik u { $action ->
            [close] molautu
           *[open] mohuo
        } laporan aksesibilitas.
        [advisories] Diila woluwo pelanggaran WCAG AA u iloontonga. Iloontonga { $count } saran aksesibilitas wuwewo. Klik u { $action ->
            [close] molautu
           *[open] mohuo
        } laporan aksesibilitas.
       *[clean] Diila woluwo pelanggaran WCAG AA u iloontonga. Klik u { $action ->
            [close] molautu
           *[open] mohuo
        } laporan aksesibilitas.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versi { $version }

editor-tab-help = Bantuan u motu'ude wolo konteks
editor-tab-help-short = Konteks
editor-tab-errors = Ututala
editor-tab-warnings = Poti'ingoti
editor-tab-info = Info
editor-tab-accessibility = Aksesibilitas
editor-tab-responses = Jawaban u ma diludelo

editor-tab-with-count = { $label }: { $count }

editor-options = Pilihan editor
editor-format-as-doenetml = Format debo DoenetML
editor-format-as-xml = Format debo XML


## The diagnostics panel

editor-diagnostic-line = Baris #{ $line }

editor-no-errors = Diila woluwo ututala
editor-no-warnings = Diila woluwo poti'ingoti
editor-no-info = Diila woluwo diagnostik info

editor-show-info-annotations = Popobiloheyi diagnostik info to editor
editor-show-accessibility-annotations = Popobiloheyi diagnostik aksesibilitas to editor

editor-accessibility-learn-more = Pelajari wololo Doenet momarakisa aksesibilitas

editor-accessibility-violations-heading = Pelanggaran aksesibilitas ({ $standard })

editor-accessibility-other-heading = Masalah aksesibilitas wuwewo
editor-none-found = Diila woluwo u iloontonga


## Submitted responses

editor-no-responses = Dipo woluwo jawaban u ma diludelo
editor-response-answer-id = Id lo jawaban
editor-response-response = Jawaban
editor-response-credit = Nilai
editor-response-submitted = Diludelo


## The context-help panel

help-placeholder = Pomao kursor to tanggulo tag, atribut, meyalo { $ref } u momilohu dokumentasi.

help-unsupported-ref-chain = Bantuan ode referensi u o'oduluwo debo { $example } dipo woluwo.

help-unresolved-ref =
    { $reason ->
        [notFound] Diila woluwo u tilunuhu lo referensi: { $ref }.
        [multiple] Daata u tilunuhu lo referensi: { $ref }.
       *[indeterminate] U tilunuhu lo { $ref } diila mowali otawa.
    }

help-learn-about-references = Pelajari tomimbihu referensi →
help-reference-page = Halaman rujukan →

help-suggestions-header =
    { $location ->
        [inside] To delomo { $element }
       *[top] To tingkat u palingu yitato
    }{ $allowed ->
        [none] { " — diila woluwo u mowali potaowa teya." }
        [text] { " — tulade teks teya." }
        [text-and-components] { " — tulade teks teya, meyalo coba:" }
       *[components] { " — u mowali cobalo:" }
    }

help-suggestions-footer = Tomo'o { $shortcut } u momilohu ngoa'amila { $total } komponen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } yito referensi ode { $target }.
       *[other] { $ref } yito referensi ode { $target } (baris { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Pilomulaalo li { $owner } debo { $role }.
       *[other] Pilomulaalo li { $owner } to baris { $line } debo { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } yito referensi ode properti { $property } lo { $element }.
       *[other] { $ref } yito referensi ode properti { $property } lo { $element } (baris { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = cuplikan
help-kind-array-entry = entri larik

help-default = Bawaan:
help-active-default = Bawaan u hemokaraja:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nilai u mowali (tuwawu ngota-ngota item):
       *[other] Nilai u mowali:
    }

help-suggested-values = Nilai u sinaranilo:

help-inserts = U potuwoto:

help-coordinates = Koordinat:

help-type = Tipe:

help-resolved-style = Gaya u iloontonga (styleNumber { $styleNumber }):

help-resolved-function-names = Tanggulo fungsi u iloontonga:
help-reset-list = Daftar u poluliyolo to masukan botie:
help-added-on-input = U tilambahu to masukan botie:
help-removed-on-input = U lilulutalo to masukan botie:

help-reset-overrides = { $reset } momuli { $additional } wawu { $removed }.
