# Saramaccan (Saamáka tongo) editor and language-server surfaces: the footer,
# the diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Translated from `locales/en/editor.ftl`, which is the
# source of truth.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard Saramaccan orthography of the Rountree / Glock
# dictionary and of the Saramaccan scriptures: seven vowel letters `a e ë i o
# ö u` (`ë` U+00EB and `ö` U+00F6 are letters, not decorated `e` and `o`); a
# doubled vowel writes length; **nasality is written with an `n` after the
# vowel**; prenasalized `mb`, `nd`, `ng`; `tj` and `dj`; initial `h`
# («hopo», «hakisi», «hii»). `chrome.ftl`'s header sets the system out point
# by point.
#
# **Tone is NOT written in this catalog, and that is a real loss.** Saramaccan
# is tonal, the dictionary and the scriptures mark tone with accents, and
# these four files leave it unmarked throughout. The only accented letter
# outside `ë` and `ö` is **«á», the preverbal negator**, spelled with its
# accent because that is the negator's spelling and not a tone mark.
#
# **Grammar.** The preverbal markers are «ta» (imperfective), «bi» (past),
# «o» (future), «sa» (able), «musu» (must); «á» negates and stands in front of
# them; «ku» is *and* and *with*; «u» / «fu» is the purposive. Ndyuka's «e»
# and «be» belong to `locales/djk` and are not Saramaccan.
#
# **Number.** `Intl.PluralRules("srm")` has no CLDR data for `srm` and falls
# back to English. A Saramaccan noun after a numeral does not inflect, so
# `editor-accessibility-label` and `help-coordinates` — the two messages
# English selects on a count — are written here as **one unselected form**
# each, with the count still interpolated. No plural branch appears anywhere
# in this file.
#
# **Loans.** Dutch and English reshaped to Saramaccan phonology: «fowtu»,
# «wakiman-buka» (*warning*), «info», «aksesibiliteiti», «vaaliant»,
# «filitee», «komponenti», «atibut», «snipiti», «kolodinaati», «foomati»,
# «vesi» (*version*), «dokumentasi», «lin», «punti». `WCAG`, `DoenetML`, `XML`
# and `styleNumber` are names and stay as written, as do the attribute names
# in `help-reset-overrides`.
#
# **Confidence.** This is the file with the least everyday Saramaccan in it —
# almost every noun is a technical loan reshaped by rule rather than a form
# this seed found in use. The verbs, the negator «á» and the preverbal markers
# are Saramaccan throughout, and that is what a reviewer should read for.
# Nothing was left in English.


editor-update-viewer =
    { $action ->
        [reset] Seti baka
       *[update] Njunsu
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } di luku-peesi
       *[other] { $word } di luku-peesi { $shortcut }
    }


editor-variant = Vaaliant

editor-variant-filter = Filitee...

editor-variant-next = Tei di woto vaaliant di ta ko

editor-variant-previous = Tei di vaaliant di bi pasa


editor-accessibility-title =
    { $status ->
        [violations] U feni wan WCAG AA aksesibiliteiti-fowtu. Kiliki u { $action ->
            [close] tapa
           *[open] hopo
        } di aksesibiliteiti-lapoti.
        [advisories] Kiliki u { $action ->
            [close] tapa
           *[open] hopo
        } di aksesibiliteiti-lapoti. U á feni na wan WCAG AA fowtu, ma u abi möön soni u taki u di aksesibiliteiti.
       *[clean] Kiliki u { $action ->
            [close] tapa
           *[open] hopo
        } di aksesibiliteiti-lapoti. U á feni na wan aksesibiliteiti-pooblema.
    }

editor-accessibility-label =
    { $status ->
        [violations] U feni wan WCAG AA aksesibiliteiti-fowtu. U feni { $count } WCAG AA fowtu. Kiliki u { $action ->
            [close] tapa
           *[open] hopo
        } di aksesibiliteiti-lapoti.
        [advisories] U á feni na wan WCAG AA fowtu. U feni { $count } möön soni u taki u di aksesibiliteiti. Kiliki u { $action ->
            [close] tapa
           *[open] hopo
        } di aksesibiliteiti-lapoti.
       *[clean] U á feni na wan WCAG AA fowtu. Kiliki u { $action ->
            [close] tapa
           *[open] hopo
        } di aksesibiliteiti-lapoti.
    }

editor-accessibility-badge = WCAG


editor-version-title = DoenetML vesi { $version }

editor-tab-help = Heepi di ta fiti di peesi ka i dë
editor-tab-help-short = Konteksi
editor-tab-errors = Fowtu
editor-tab-warnings = Wakiman-buka
editor-tab-info = Info
editor-tab-accessibility = Aksesibiliteiti
editor-tab-responses = Piki di manda kaba

editor-tab-with-count = { $label }: { $count }

editor-options = Editoo-fasi
editor-format-as-doenetml = Foomati kuma DoenetML
editor-format-as-xml = Foomati kuma XML


editor-diagnostic-line = Lin #{ $line }

editor-no-errors = Na wan fowtu
editor-no-warnings = Na wan wakiman-buka
editor-no-info = Na wan info-lapoti

editor-show-info-annotations = Lei dee info-lapoti a dendu di editoo
editor-show-accessibility-annotations = Lei dee aksesibiliteiti-lapoti a dendu di editoo

editor-accessibility-learn-more = Lei fa Doenet ta wooko ku aksesibiliteiti

editor-accessibility-violations-heading = Aksesibiliteiti-fowtu ({ $standard })

editor-accessibility-other-heading = Woto aksesibiliteiti-pooblema
editor-none-found = U á feni na wan


editor-no-responses = Na wan piki á manda ete
editor-response-answer-id = Piki Id
editor-response-response = Piki
editor-response-credit = Punti
editor-response-submitted = Manda


help-placeholder = Buta di kosoo a wan tag-nen, wan atibut, ofu { $ref } u si di dokumentasi.

help-unsupported-ref-chain = Heepi da wan longi lefeensi kuma { $example } á dë ete.

help-unresolved-ref =
    { $reason ->
        [notFound] U á feni na wan soni di { $ref } ta lei.
        [multiple] U feni möön kuma wan soni di { $ref } ta lei.
       *[indeterminate] U á sa sabi andi { $ref } ta lei.
    }

help-learn-about-references = Lei u dee lefeensi →
help-reference-page = Lefeensi-pagina →

help-suggestions-header =
    { $location ->
        [inside] A dendu { $element }
       *[top] A hei u hii soni
    }{ $allowed ->
        [none] { " — na wan soni á ta go aki." }
        [text] { " — sikifi tëkisi aki." }
        [text-and-components] { " — sikifi tëkisi aki, ofu pooba:" }
       *[components] { " — soni u pooba:" }
    }

help-suggestions-footer = Buta { $shortcut } u si hii dee { $total } komponenti.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } da wan lefeensi da { $target }.
       *[other] { $ref } da wan lefeensi da { $target } (lin { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } tja ën ko kuma { $role }.
       *[other] { $owner } tja ën ko a lin { $line } kuma { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } da wan lefeensi da di { $property } fasi u { $element }.
       *[other] { $ref } da wan lefeensi da di { $property } fasi u { $element } (lin { $line }).
    }

help-kind-attribute = atibut
help-kind-snippet = snipiti
help-kind-array-entry = aray-soni

help-default = Difoolti:
help-active-default = Difoolti di ta wooko:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Waalde di i sa wooko (wan da hiniwan soni):
       *[other] Waalde di i sa wooko:
    }

help-suggested-values = Waalde di u ta taki i:

help-inserts = Andi a ta buta:

help-coordinates = Kolodinaati:

help-type = Sootu:

help-resolved-style = Di sitali di ko a doo (styleNumber { $styleNumber }):

help-resolved-function-names = Dee funsi-nen di ko a doo:
help-reset-list = Seti di lisi baka a di inputu aki:
help-added-on-input = Andi buta a di inputu aki:
help-removed-on-input = Andi puu a di inputu aki:

help-reset-overrides = { $reset } ta wini { $additional } ku { $removed }.
