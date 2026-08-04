# Sundanese editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# SPEECH LEVEL. Written in **loma**, the neutral level, throughout — see the
# header of `chrome.ftl`.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Sundanese has a single plural category, so a countable message needs no
# selection.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Balikan
       *[update] Anyarkeun
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Panempo
       *[other] { $word } Panempo { $shortcut }
    }


## The variant picker

editor-variant = Variasi
editor-variant-filter = Saring...
editor-variant-next = Pilih variasi salajengna
editor-variant-previous = Pilih variasi saméméhna


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kapanggih palanggaran aksésibilitas WCAG AA. Klik pikeun { $action ->
            [close] nutup
           *[open] muka
        } laporan aksésibilitas.
        [advisories] Klik pikeun { $action ->
            [close] nutup
           *[open] muka
        } laporan aksésibilitas. Teu kapanggih palanggaran WCAG AA, tapi aya saran aksésibilitas tambahan.
       *[clean] Klik pikeun { $action ->
            [close] nutup
           *[open] muka
        } laporan aksésibilitas. Teu kapanggih masalah aksésibilitas.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kapanggih palanggaran aksésibilitas WCAG AA. Kapanggih { $count } palanggaran WCAG AA. Klik pikeun { $action ->
            [close] nutup
           *[open] muka
        } laporan aksésibilitas.
        [advisories] Teu kapanggih palanggaran WCAG AA. Kapanggih { $count } saran aksésibilitas tambahan. Klik pikeun { $action ->
            [close] nutup
           *[open] muka
        } laporan aksésibilitas.
       *[clean] Teu kapanggih palanggaran WCAG AA. Klik pikeun { $action ->
            [close] nutup
           *[open] muka
        } laporan aksésibilitas.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML vérsi { $version }

editor-tab-help = Pitulung nurutkeun kontéks
editor-tab-help-short = Kontéks
editor-tab-errors = Kasalahan
editor-tab-warnings = Pépéling
editor-tab-info = Info
editor-tab-accessibility = Aksésibilitas
editor-tab-responses = Jawaban nu dikirim

editor-tab-with-count = { $label }: { $count }

editor-options = Pilihan panyunting
editor-format-as-doenetml = Format jadi DoenetML
editor-format-as-xml = Format jadi XML


## The diagnostics panel

editor-diagnostic-line = Baris #{ $line }

editor-no-errors = Teu Aya Kasalahan
editor-no-warnings = Teu Aya Pépéling
editor-no-info = Teu Aya Diagnostik Info

editor-show-info-annotations = Témbongkeun diagnostik info dina panyunting
editor-show-accessibility-annotations = Témbongkeun diagnostik aksésibilitas dina panyunting

editor-accessibility-learn-more = Diajar kumaha Doenet nyanghareupan aksésibilitas

editor-accessibility-violations-heading = Palanggaran aksésibilitas ({ $standard })

editor-accessibility-other-heading = Masalah aksésibilitas séjénna
editor-none-found = Teu aya nu kapanggih


## Submitted responses

editor-no-responses = Can aya jawaban nu dikirim
editor-response-answer-id = Answer Id
editor-response-response = Jawaban
editor-response-credit = Peunteun
editor-response-submitted = Dikirim


## The context-help panel

help-placeholder = Simpen kursor dina ngaran tag, atribut, atawa { $ref } pikeun ningali dokuméntasi.

help-unsupported-ref-chain = Pitulung pikeun rujukan sababaraha bagian saperti { $example } can dirojong.

help-unresolved-ref =
    { $reason ->
        [notFound] Teu kapanggih nu ditunjuk ku rujukan: { $ref }.
        [multiple] Kapanggih leuwih ti hiji nu ditunjuk ku rujukan: { $ref }.
       *[indeterminate] Nu ditunjuk ku { $ref } teu bisa ditangtukeun.
    }

help-learn-about-references = Diajar ngeunaan rujukan →
help-reference-page = Kaca rujukan →

help-suggestions-header =
    { $location ->
        [inside] Di jero { $element }
       *[top] Dina tingkat pangluhurna
    }{ $allowed ->
        [none] { " — teu aya nu bisa disimpen di dieu." }
        [text] { " — tuliskeun téks di dieu." }
        [text-and-components] { " — tuliskeun téks di dieu, atawa cobaan:" }
       *[components] { " — nu bisa dicobaan:" }
    }

help-suggestions-footer = Pencét { $shortcut } pikeun ningali sakabéh { $total } komponén.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } téh rujukan ka { $target }.
       *[other] { $ref } téh rujukan ka { $target } (baris { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Diwanohkeun ku { $owner } salaku { $role }.
       *[other] Diwanohkeun ku { $owner } dina baris { $line } salaku { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } téh rujukan ka property { $property } tina { $element }.
       *[other] { $ref } téh rujukan ka property { $property } tina { $element } (baris { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = potongan
help-kind-array-entry = éntri larik

help-default = Baku:
help-active-default = Baku nu aktip:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Niléy nu meunang (hiji per item):
       *[other] Niléy nu meunang:
    }

help-suggested-values = Niléy nu disarankeun:

help-inserts = Nyelapkeun:

help-coordinates = Koordinat:

help-type = Jinis:

help-resolved-style = Gaya nu ditangtukeun (styleNumber { $styleNumber }):

help-resolved-function-names = Ngaran fungsi nu ditangtukeun:
help-reset-list = Daptar reset dina input ieu:
help-added-on-input = Ditambahkeun dina input ieu:
help-removed-on-input = Dipiceun tina input ieu:

help-reset-overrides = { $reset } ngungkulan { $additional } jeung { $removed }.
