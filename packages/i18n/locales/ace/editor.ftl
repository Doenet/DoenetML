# Acehnese editor and language-server surfaces. Translated from
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
# Acehnese marks no number on the noun, so a `{ $count -> … }` whose two English
# branches differ only in the noun renders one string here and the select is
# dropped.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Peuwoë
       *[update] Peubaro
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } peuleumah
       *[other] { $word } peuleumah { $shortcut }
    }


## The variant picker

editor-variant = Varian
editor-variant-filter = Saring…
editor-variant-next = Pileh varian seulanjut
editor-variant-previous = Pileh varian sigohlom


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Na peulanggaran aksesibilitas WCAG AA nyang meuteumeung. Klik keu jeuet { $action ->
            [close] tôb
           *[open] buka
        } laporan aksesibilitas.
        [advisories] Klik keu jeuet { $action ->
            [close] tôb
           *[open] buka
        } laporan aksesibilitas. Hana peulanggaran WCAG AA nyang meuteumeung, teuma na saran aksesibilitas laén.
       *[clean] Klik keu jeuet { $action ->
            [close] tôb
           *[open] buka
        } laporan aksesibilitas. Hana masalah aksesibilitas nyang meuteumeung.
    }

# No select on `$count` inside the branches: «peulanggaran» and «saran» are the
# same words for one and for many.
editor-accessibility-label =
    { $status ->
        [violations] Na peulanggaran aksesibilitas WCAG AA nyang meuteumeung. Meuteumeung { $count } peulanggaran WCAG AA. Klik keu jeuet { $action ->
            [close] tôb
           *[open] buka
        } laporan aksesibilitas.
        [advisories] Hana peulanggaran WCAG AA nyang meuteumeung. Meuteumeung { $count } saran aksesibilitas laén. Klik keu jeuet { $action ->
            [close] tôb
           *[open] buka
        } laporan aksesibilitas.
       *[clean] Hana peulanggaran WCAG AA nyang meuteumeung. Klik keu jeuet { $action ->
            [close] tôb
           *[open] buka
        } laporan aksesibilitas.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versi DoenetML { $version }

editor-tab-help = Bantuan meunurot konteks
editor-tab-help-short = Konteks
editor-tab-errors = Salah
editor-tab-warnings = Peuingat
editor-tab-info = Keterangan
editor-tab-accessibility = Aksesibilitas
editor-tab-responses = Jaweueb nyang ka geukirém

editor-tab-with-count = { $label }: { $count }

editor-options = Pilihan editor
editor-format-as-doenetml = Format sibagoë DoenetML
editor-format-as-xml = Format sibagoë XML


## The diagnostics panel

editor-diagnostic-line = Barih #{ $line }

editor-no-errors = Hana salah
editor-no-warnings = Hana peuingat
editor-no-info = Hana diagnostik keterangan

editor-show-info-annotations = Peuleumah diagnostik keterangan bak editor
editor-show-accessibility-annotations = Peuleumah diagnostik aksesibilitas bak editor

editor-accessibility-learn-more = Beulajeue cara Doenet jak peuseumana aksesibilitas

editor-accessibility-violations-heading = Peulanggaran aksesibilitas ({ $standard })

editor-accessibility-other-heading = Masalah aksesibilitas laén
editor-none-found = Hana nyang meuteumeung


## Submitted responses

editor-no-responses = Gohlom na jaweueb nyang geukirém
editor-response-answer-id = Id jaweueb
editor-response-response = Jaweueb
editor-response-credit = Kredit
editor-response-submitted = Geukirém


## The context-help panel

help-placeholder = Peuduek kursor bak nan tag, atribut, atawa { $ref } keu dokumentasi.

help-unsupported-ref-chain = Bantuan keu rujukan meubagoë bagian lagée { $example } gohlom teudukong.

help-unresolved-ref =
    { $reason ->
        [notFound] Hana meuteumeung nyang geutunyok lé rujukan: { $ref }.
        [multiple] Le nyang geutunyok lé rujukan: { $ref }.
       *[indeterminate] Hana ék teupeuteuntee peue nyang geutunyok lé { $ref }.
    }

help-learn-about-references = Beulajeue keuhai rujukan →
help-reference-page = Laman rujukan →

help-suggestions-header =
    { $location ->
        [inside] Lam { $element }
       *[top] Bak tingkat paléng ateuh
    }{ $allowed ->
        [none] { " — hana nyang jeuet teupeuduek disinoe." }
        [text] { " — tuléh teks disinoe." }
        [text-and-components] { " — tuléh teks disinoe, atawa cuba:" }
       *[components] { " — nyang jeuet teucuba:" }
    }

help-suggestions-footer = Teugon { $shortcut } keu jeuet takalon banmandum { $total } komponen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } na rujukan u { $target }.
       *[other] { $ref } na rujukan u { $target } (barih { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Geuba lé { $owner } sibagoë { $role }.
       *[other] Geuba lé { $owner } bak barih { $line } sibagoë { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } na rujukan u sifat { $property } nibak { $element }.
       *[other] { $ref } na rujukan u sifat { $property } nibak { $element } (barih { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = ceubeuëh kode
help-kind-array-entry = entri array

help-default = Baku:
help-active-default = Baku nyang aktif:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nilai nyang teuidin (saboh keu tiep item):
       *[other] Nilai nyang teuidin:
    }

help-suggested-values = Nilai nyang geusaran:

help-inserts = Geuseulop:

# No select: «koordinat» is the same word for one and for many.
help-coordinates = Koordinat:

help-type = Jeuneh:

help-resolved-style = Gaya nyang ka teupeuteuntee (styleNumber { $styleNumber }):

help-resolved-function-names = Nan fungsi nyang ka teupeuteuntee:
help-reset-list = Dapeuta peuwoë bak input nyoe:
help-added-on-input = Teutamah bak input nyoe:
help-removed-on-input = Teupeugadôh bak input nyoe:

help-reset-overrides = { $reset } jipeugantoë { $additional } ngon { $removed }.
