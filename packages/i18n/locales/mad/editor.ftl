# Madurese editor and language-server surfaces. Translated from
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
# Written throughout in enjâ'-iyâ, the plain everyday speech level; see
# `chrome.ftl`'s header.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Bâlik
       *[update] Anyarraghi
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } panèngalanna
       *[other] { $word } panèngalanna { $shortcut }
    }


## The variant picker

editor-variant = Varian
editor-variant-filter = Saring…
editor-variant-next = Pele varian salanjudde
editor-variant-previous = Pele varian sabellunna


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Badâ palanggharân aksesibilitas WCAG AA se etemmo. Klik sopaja { $action ->
            [close] atotop
           *[open] abukka'
        } laporan aksesibilitassa.
        [advisories] Klik sopaja { $action ->
            [close] atotop
           *[open] abukka'
        } laporan aksesibilitassa. Tadâ' palanggharân WCAG AA se etemmo, tapè badâ saran aksesibilitas laèn.
       *[clean] Klik sopaja { $action ->
            [close] atotop
           *[open] abukka'
        } laporan aksesibilitassa. Tadâ' masala aksesibilitas se etemmo.
    }

# No select on `$count` inside the branches: «palanggharân» and «saran» are the
# same words for one and for many.
editor-accessibility-label =
    { $status ->
        [violations] Badâ palanggharân aksesibilitas WCAG AA se etemmo. Etemmo { $count } palanggharân WCAG AA. Klik sopaja { $action ->
            [close] atotop
           *[open] abukka'
        } laporan aksesibilitassa.
        [advisories] Tadâ' palanggharân WCAG AA se etemmo. Etemmo { $count } saran aksesibilitas laèn. Klik sopaja { $action ->
            [close] atotop
           *[open] abukka'
        } laporan aksesibilitassa.
       *[clean] Tadâ' palanggharân WCAG AA se etemmo. Klik sopaja { $action ->
            [close] atotop
           *[open] abukka'
        } laporan aksesibilitassa.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versi DoenetML { $version }

editor-tab-help = Bantowan noro' konteks
editor-tab-help-short = Konteks
editor-tab-errors = Kasalaan
editor-tab-warnings = Parèngèdan
editor-tab-info = Katerrangan
editor-tab-accessibility = Aksesibilitas
editor-tab-responses = Jhâwâban se la èkèrèm

editor-tab-with-count = { $label }: { $count }

editor-options = Pelean editor
editor-format-as-doenetml = Format menangka DoenetML
editor-format-as-xml = Format menangka XML


## The diagnostics panel

editor-diagnostic-line = Baris #{ $line }

editor-no-errors = Tadâ' kasalaan
editor-no-warnings = Tadâ' parèngèdan
editor-no-info = Tadâ' diagnostik katerrangan

editor-show-info-annotations = Toduwagi diagnostik katerrangan e editor
editor-show-accessibility-annotations = Toduwagi diagnostik aksesibilitas e editor

editor-accessibility-learn-more = Ajhâr kadi ponapa Doenet nangani aksesibilitas

editor-accessibility-violations-heading = Palanggharân aksesibilitas ({ $standard })

editor-accessibility-other-heading = Masala aksesibilitas laèn
editor-none-found = Tadâ' se etemmo


## Submitted responses

editor-no-responses = Gi' tadâ' jhâwâban se èkèrèm
editor-response-answer-id = Id jhâwâban
editor-response-response = Jhâwâban
editor-response-credit = Kredit
editor-response-submitted = Èkèrèm


## The context-help panel

help-placeholder = Sabâ' kursor e nyamana tag, atribut, otabâ { $ref } kaangguy dokumentasi.

help-unsupported-ref-chain = Bantowan kaangguy rujuan bânnya' bâgiyân akadi { $example } gi' ta' èdukung.

help-unresolved-ref =
    { $reason ->
        [notFound] Tadâ' se etemmo se èdduduwagi rujuanna: { $ref }.
        [multiple] Bânnya' se etemmo se èdduduwagi rujuanna: { $ref }.
       *[indeterminate] Ta' bisa èpastèagi apa se èdduduwagi { $ref }.
    }

help-learn-about-references = Ajhâr parkara rujuan →
help-reference-page = Kaca rujuan →

help-suggestions-header =
    { $location ->
        [inside] E dâlem { $element }
       *[top] E tingkat se paleng attas
    }{ $allowed ->
        [none] { " — tadâ' se bisa èsabâ' e ka'dinto." }
        [text] { " — tolès teks e ka'dinto." }
        [text-and-components] { " — tolès teks e ka'dinto, otabâ coba:" }
       *[components] { " — se bisa ècoba:" }
    }

help-suggestions-footer = Penet { $shortcut } sopaja nèngale sakabbinna { $total } komponen.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } rowa rujuan ka { $target }.
       *[other] { $ref } rowa rujuan ka { $target } (baris { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Èghibâ bi' { $owner } menangka { $role }.
       *[other] Èghibâ bi' { $owner } e baris { $line } menangka { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } rowa rujuan ka sipat { $property } dâri { $element }.
       *[other] { $ref } rowa rujuan ka sipat { $property } dâri { $element } (baris { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = potongan kode
help-kind-array-entry = entri array

help-default = Baku:
help-active-default = Baku se aktif:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nilai se èolèagi (settong sabbân bârâng):
       *[other] Nilai se èolèagi:
    }

help-suggested-values = Nilai se èsaranagi:

help-inserts = Nyoccok:

# No select: «koordinat» is the same word for one and for many.
help-coordinates = Koordinat:

help-type = Jhinis:

help-resolved-style = Gaya se la èpastèagi (styleNumber { $styleNumber }):

help-resolved-function-names = Nyamana fungsi se la èpastèagi:
help-reset-list = Daftar reset e input rèya:
help-added-on-input = Ètambâ e input rèya:
help-removed-on-input = Èbuwang e input rèya:

help-reset-overrides = { $reset } ngalang { $additional } ban { $removed }.
