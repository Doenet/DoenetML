# Tausug editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Latin orthography of the other three files of this locale —
# three vowels, an apostrophe for the glottal stop, doubled consonants for
# length, and loans kept in the spelling of the language they came from. See
# `locales/tsg/chrome.ftl` for the argument against writing this catalog in
# Sulat Sūg, and for the verb-formation assumption every verb here rests on.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay in English exactly as written.
#
# The linker **«nga»** is written out in full everywhere, and the particles
# **«in»**, **«sin»**, **«ha»**, **«dayn ha»**, **«manga»**, **«awn»** and
# **«way»** are what a reviewer should read this file by. The three negators
# stay apart: «di'» before a verb, «bukun» before a noun, «way» for "there is
# none".
#
# DECLARED LOANS. `editor`, `input`, `array`, `kursor`, `tag`, `atribut`,
# `kordinat`, `varyant`, `bersyon` and `kontekst` are written as the Filipino
# or English words they are. Tausug has no coinage for them and this catalog
# does not invent one.
#
# Tausug does not mark number on a noun after a numeral, and
# `Intl.PluralRules` has no data for `tsg` in any case, so every count
# selection here is collapsed to a single `*[other]`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Balika
       *[update] Baguha
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } in Pagkita'an
       *[other] { $word } in Pagkita'an { $shortcut }
    }


## The variant picker

editor-variant = Varyant
editor-variant-filter = Sāya…
editor-variant-next = Pī' in sumunud nga varyant
editor-variant-previous = Pī' in nakauna nga varyant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Awn paglanggal sin akses WCAG AA kiyabaakan. Pindut ha { $action ->
            [close] pagtambul
           *[open] pag-ukab
        } sin taluk pasal akses.
        [advisories] Pindut ha { $action ->
            [close] pagtambul
           *[open] pag-ukab
        } sin taluk pasal akses. Way paglanggal sin WCAG AA kiyabaakan, sagawa' awn dugang panuntun pasal akses.
       *[clean] Pindut ha { $action ->
            [close] pagtambul
           *[open] pag-ukab
        } sin taluk pasal akses. Way kasala'an pasal akses kiyabaakan.
    }

editor-accessibility-label =
    { $status ->
        [violations] Awn paglanggal sin akses WCAG AA kiyabaakan. Awn { $count ->
           *[other] { $count } paglanggal sin WCAG AA
        } kiyabaakan. Pindut ha { $action ->
            [close] pagtambul
           *[open] pag-ukab
        } sin taluk pasal akses.
        [advisories] Way paglanggal sin WCAG AA kiyabaakan. Awn { $count ->
           *[other] { $count } dugang panuntun pasal akses
        } kiyabaakan. Pindut ha { $action ->
            [close] pagtambul
           *[open] pag-ukab
        } sin taluk pasal akses.
       *[clean] Way paglanggal sin WCAG AA kiyabaakan. Pindut ha { $action ->
            [close] pagtambul
           *[open] pag-ukab
        } sin taluk pasal akses.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Bersyon sin DoenetML { $version }

editor-tab-help = Tabang siyusūd sin kontekst
editor-tab-help-short = Kontekst
editor-tab-errors = Manga Kasala'an
editor-tab-warnings = Manga Pagpahati'
editor-tab-info = Kaingatan
editor-tab-accessibility = Akses
editor-tab-responses = Manga sambag naipasampay

editor-tab-with-count = { $label }: { $count }

editor-options = Manga pī'anan sin editor
editor-format-as-doenetml = Ayuha biya' DoenetML
editor-format-as-xml = Ayuha biya' XML


## The diagnostics panel

editor-diagnostic-line = Baris #{ $line }

editor-no-errors = Way Kasala'an
editor-no-warnings = Way Pagpahati'
editor-no-info = Way Kaingatan

editor-show-info-annotations = Pakita' in kaingatan ha editor
editor-show-accessibility-annotations = Pakita' in pagpahati' pasal akses ha editor

editor-accessibility-learn-more = Kaingati bang biya' diin in pag-atud sin Doenet ha akses

editor-accessibility-violations-heading = Manga paglanggal sin akses ({ $standard })

editor-accessibility-other-heading = Kaibanan kasala'an pasal akses
editor-none-found = Way kiyabaakan


## Submitted responses

editor-no-responses = Way pa sambag naipasampay
editor-response-answer-id = Id sin Sambag
editor-response-response = Sambag
editor-response-credit = Marka
editor-response-submitted = Naipasampay


## The context-help panel

help-placeholder = Butanga in kursor ha ngan sin tag, ha atribut atawa ha { $ref } ha supaya kumita' sin dukumintasyon.

help-unsupported-ref-chain = In tabang ha manga rupa nga mataud bahagi' biya' ha { $example } di' pa kasuppurtahan.

help-unresolved-ref =
    { $reason ->
        [notFound] Way kiyabaakan nga tinuyu' sin rupa: { $ref }.
        [multiple] Mataud tinuyu' in kiyabaakan sin rupa: { $ref }.
       *[indeterminate] In tinuyu' sin { $ref } di' matantu.
    }

help-learn-about-references = Kaingati in pasal sin manga rupa →
help-reference-page = Pahina sin rupa →

help-suggestions-header =
    { $location ->
        [inside] Ha lawm sin { $element }
       *[top] Ha taas nga lugal
    }{ $allowed ->
        [none] { " — way makasūd dī." }
        [text] { " — sulat sin tiksti dī." }
        [text-and-components] { " — sulat sin tiksti dī, atawa sulaya ini:" }
       *[components] { " — manga hikasulay:" }
    }

help-suggestions-footer = Pindut in { $shortcut } ha supaya kumita' sin katān { $total } komponin.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] In { $ref } rupa pa { $target }.
       *[other] In { $ref } rupa pa { $target } (baris { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Piyaguwa' sin { $owner } biya' { $role }.
       *[other] Piyaguwa' sin { $owner } ha baris { $line } biya' { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] In { $ref } rupa pa kabtangan { $property } sin { $element }.
       *[other] In { $ref } rupa pa kabtangan { $property } sin { $element } (baris { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = bahagi' sin kod
help-kind-array-entry = laman sin array

help-default = Timbang nga hantang:
help-active-default = Timbang nga hantang naghihinang:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Manga timbang kaingatan (hangka-timbang ha hangka-laman):
       *[other] Manga timbang kaingatan:
    }

help-suggested-values = Manga timbang piyanuntun:

help-inserts = Isuksuk:

help-coordinates =
    { $count ->
       *[other] Manga kordinat:
    }

help-type = Ginis:

help-resolved-style = Istilu natantu (styleNumber { $styleNumber }):

help-resolved-function-names = Manga ngan sin function natantu:
help-reset-list = Listahan sin pagbalik ha input ini:
help-added-on-input = Diyugangan ha input ini:
help-removed-on-input = Tiyanggal dayn ha input ini:

help-reset-overrides = In { $reset } makalabi ha { $additional } iban ha { $removed }.
