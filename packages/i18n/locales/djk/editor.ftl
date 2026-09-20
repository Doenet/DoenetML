# Aukan / Ndyuka (Okanisi tongo) editor and language-server surfaces: the
# footer, the diagnostics panel, the variant picker, the accessibility button
# and the context-help panel. Translated from `locales/en/editor.ftl`, which is
# the source of truth.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The SIL Ndyuka orthography: a doubled vowel writes length
# («puu», «wooko», «gaan»), there are no consonant + `r` clusters at all
# («kiin», «taa», «gaantangi»), «u» never «oe», «y» never «j», and **tone is
# not written** — Ndyuka is tonal and the orthography leaves tone unmarked, as
# the dictionary and the scriptures do. Sranan Tongo and Saramaccan spellings
# are not mixed in; `chrome.ftl`'s header sets the system out point by point.
#
# **Grammar.** Preverbal «e» / «be» / «o» / «sa» / «mu» carry tense, aspect
# and modality; «no» negates and precedes them; «anga» is *and* and *with*;
# «fu» is the purposive. No English sentence order survives here.
#
# **Number.** `Intl.PluralRules("djk")` has no CLDR data for `djk` and falls
# back to English. A Ndyuka noun after a numeral does not inflect, so
# `editor-accessibility-label` and `help-coordinates` — the two messages
# English selects on a count — are written here as **one unselected form**
# each, with the count still interpolated. No plural branch appears anywhere
# in this file.
#
# **Loans.** Dutch and English reshaped to Ndyuka phonology: «fowtu»,
# «wasikoi», «info», «aksesibiliteiti», «vaariant», «filteri», «komponenti»,
# «atribut», «snipiti», «kolodinaati», «foomati», «vesi» (*version*),
# «dokumentasi», «lin», «kediti», «piki». `WCAG`, `DoenetML`, `XML` and
# `styleNumber` are names and stay as written, as do the attribute names in
# `help-reset-overrides`.
#
# **Confidence.** This is the file with the least everyday Ndyuka in it —
# almost every noun is a technical loan reshaped by rule rather than a form
# this seed found in use. The verbs, the negation and the preverbal markers
# are Ndyuka throughout, and that is what a reviewer should read for. Nothing
# was left in English.


editor-update-viewer =
    { $action ->
        [reset] Seti baka
       *[update] Nyunsu
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } a luku-peesi
       *[other] { $word } a luku-peesi { $shortcut }
    }


editor-variant = Vaariant

editor-variant-filter = Filteri...

editor-variant-next = Teke a taa vaariant di e kon

editor-variant-previous = Teke a vaariant di be pasa


editor-accessibility-title =
    { $status ->
        [violations] Wi feni wan WCAG AA aksesibiliteiti-fowtu. Kiliki fu { $action ->
            [close] tapu
           *[open] opo
        } a aksesibiliteiti-lepoti.
        [advisories] Kiliki fu { $action ->
            [close] tapu
           *[open] opo
        } a aksesibiliteiti-lepoti. Wi no feni no wan WCAG AA fowtu, ma wi abi moo sani fu taigi yu fu a aksesibiliteiti.
       *[clean] Kiliki fu { $action ->
            [close] tapu
           *[open] opo
        } a aksesibiliteiti-lepoti. Wi no feni no wan aksesibiliteiti-pooblema.
    }

editor-accessibility-label =
    { $status ->
        [violations] Wi feni wan WCAG AA aksesibiliteiti-fowtu. Wi feni { $count } WCAG AA fowtu. Kiliki fu { $action ->
            [close] tapu
           *[open] opo
        } a aksesibiliteiti-lepoti.
        [advisories] Wi no feni no wan WCAG AA fowtu. Wi feni { $count } moo sani fu taigi yu fu a aksesibiliteiti. Kiliki fu { $action ->
            [close] tapu
           *[open] opo
        } a aksesibiliteiti-lepoti.
       *[clean] Wi no feni no wan WCAG AA fowtu. Kiliki fu { $action ->
            [close] tapu
           *[open] opo
        } a aksesibiliteiti-lepoti.
    }

editor-accessibility-badge = WCAG


editor-version-title = DoenetML vesi { $version }

editor-tab-help = Yeepi di e fiti a peesi pe i de
editor-tab-help-short = Konteksi
editor-tab-errors = Fowtu
editor-tab-warnings = Wasikoi
editor-tab-info = Info
editor-tab-accessibility = Aksesibiliteiti
editor-tab-responses = Piki di seni kaba

editor-tab-with-count = { $label }: { $count }

editor-options = Editoo-fasi
editor-format-as-doenetml = Foomati enke DoenetML
editor-format-as-xml = Foomati enke XML


editor-diagnostic-line = Lin #{ $line }

editor-no-errors = No wan fowtu
editor-no-warnings = No wan wasikoi
editor-no-info = No wan info-lepoti

editor-show-info-annotations = Sori den info-lepoti a ini a editoo
editor-show-accessibility-annotations = Sori den aksesibiliteiti-lepoti a ini a editoo

editor-accessibility-learn-more = Leli fa Doenet e wooko anga aksesibiliteiti

editor-accessibility-violations-heading = Aksesibiliteiti-fowtu ({ $standard })

editor-accessibility-other-heading = Taa aksesibiliteiti-pooblema
editor-none-found = Wi no feni no wan


editor-no-responses = No wan piki no seni ete
editor-response-answer-id = Piki Id
editor-response-response = Piki
editor-response-credit = Kediti
editor-response-submitted = Seni


help-placeholder = Poti a kosoo a wan tag-neen, wan atribut, efuso { $ref } fu si a dokumentasi.

help-unsupported-ref-chain = Yeepi gi wan lengi refeensi enke { $example } no de ete.

help-unresolved-ref =
    { $reason ->
        [notFound] Wi no feni no wan sani di { $ref } e sori.
        [multiple] Wi feni moo enke wan sani di { $ref } e sori.
       *[indeterminate] Wi no man sabi san { $ref } e sori.
    }

help-learn-about-references = Leli fu den refeensi →
help-reference-page = Refeensi-pagina →

help-suggestions-header =
    { $location ->
        [inside] A ini { $element }
       *[top] A tapu fu ala sani
    }{ $allowed ->
        [none] { " — no wan sani no e go ya." }
        [text] { " — sikiifi tekisi ya." }
        [text-and-components] { " — sikiifi tekisi ya, efuso pooberi:" }
       *[components] { " — sani fu pooberi:" }
    }

help-suggestions-footer = Poti { $shortcut } fu si ala { $total } komponenti.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } na wan refeensi gi { $target }.
       *[other] { $ref } na wan refeensi gi { $target } (lin { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } tyai en kon enke { $role }.
       *[other] { $owner } tyai en kon a lin { $line } enke { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } na wan refeensi gi a { $property } fasi fu { $element }.
       *[other] { $ref } na wan refeensi gi a { $property } fasi fu { $element } (lin { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = snipiti
help-kind-array-entry = aray-sani

help-default = Difoolti:
help-active-default = Difoolti di e wooko:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Waarde di i sa gebooiki (wan gi ibii sani):
       *[other] Waarde di i sa gebooiki:
    }

help-suggested-values = Waarde di wi e taigi yu:

help-inserts = San a e poti:

help-coordinates = Kolodinaati:

help-type = Sortu:

help-resolved-style = A sitali di kon a doo (styleNumber { $styleNumber }):

help-resolved-function-names = Den funsi-neen di kon a doo:
help-reset-list = Seti a lisi baka a ini a inputu ya:
help-added-on-input = San poti a ini a inputu ya:
help-removed-on-input = San puu a ini a inputu ya:

help-reset-overrides = { $reset } e wini { $additional } anga { $removed }.
