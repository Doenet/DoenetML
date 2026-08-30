# Sranan Tongo (Sranantongo) editor and language-server surfaces. Translated
# from `locales/en/editor.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber`, `prefigure` and every attribute
# or element name are identifiers, not prose, and stay exactly as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The **1986 official Surinamese orthography** — `u` for /u/
# and never «oe», `y` for the glide and never «j», `dy` for the voiced
# affricate, `ky` and `gy` for the palatalized stops, and vowel length written
# with a single letter. The pre-1986 Dutch-influenced spellings are used
# nowhere in these four files and must not be mixed into them. The system has
# no diacritics at all, so an accented character here would be an error.
# `chrome.ftl` sets the differences out point by point.
#
# **Word order and agreement.** Modifiers precede the noun, as in English.
# Sranan Tongo has no grammatical gender and no adjective agreement, so nothing
# here agrees with anything.
#
# **Number.** The probe reports no CLDR data of its own for `srn`: it resolves
# to `en-US` and answers `['one', 'other']`. A Sranan noun after a numeral is
# unmarked, so the two branches would be word-for-word identical and **one
# unselected form** is written instead. No count-driven select appears in this
# file.
#
# **This is the thinnest of the four files.** The editor is a developer
# surface, and most of what it names is discussed in Suriname in Dutch or in
# English rather than in Sranan. «Variant», «filter», «format», «komponent»,
# «atribut», «snippet», «array», «funksi», «versi», «koordinaat», «kursor» and
# «diagnostik» are the loans a Sranan speaker working with software would
# actually use; they are kept, not translated, and are not offered as
# translations. «Aksesibiliteit» is the word a reviewer should look at first,
# and «Luku» for *viewer* the second. The technical vocabulary in this file is
# a **lexifier loan set**, Dutch- and English-mediated, carried in Sranan
# Tongo's own grammar and written in the 1986 orthography: these loans are the
# words the language actually uses, and the sentences built around them are
# Sranan, not Dutch.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reset
       *[update] Nyun
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } a Luku
       *[other] { $word } a Luku { $shortcut }
    }


## The variant picker

editor-variant = Variant

editor-variant-filter = Filter...

editor-variant-next = Teki a variant di e kon baka
editor-variant-previous = Teki a variant di ben de fosi


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Wan WCAG AA aksesibiliteit-fowtu feni. Klik fu { $action ->
            [close] tapu
           *[open] opo
        } a aksesibiliteit-rapport.
        [advisories] Klik fu { $action ->
            [close] tapu
           *[open] opo
        } a aksesibiliteit-rapport. No wan WCAG AA fowtu no feni, ma moro aksesibiliteit-rai de.
       *[clean] Klik fu { $action ->
            [close] tapu
           *[open] opo
        } a aksesibiliteit-rapport. No wan aksesibiliteit-problema no feni.
    }

editor-accessibility-label =
    { $status ->
        [violations] Wan WCAG AA aksesibiliteit-fowtu feni. { $count } WCAG AA fowtu feni. Klik fu { $action ->
            [close] tapu
           *[open] opo
        } a aksesibiliteit-rapport.
        [advisories] No wan WCAG AA fowtu no feni. { $count } moro aksesibiliteit-rai feni. Klik fu { $action ->
            [close] tapu
           *[open] opo
        } a aksesibiliteit-rapport.
       *[clean] No wan WCAG AA fowtu no feni. Klik fu { $action ->
            [close] tapu
           *[open] opo
        } a aksesibiliteit-rapport.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versi { $version }

editor-tab-help = Yepi di e fiti a presi
editor-tab-help-short = Presi
editor-tab-errors = Fowtu
editor-tab-warnings = Warskow
editor-tab-info = Info
editor-tab-accessibility = Aksesibiliteit
editor-tab-responses = Piki di seni

editor-tab-with-count = { $label }: { $count }

editor-options = Editor-opsi
editor-format-as-doenetml = Formateri leki DoenetML
editor-format-as-xml = Formateri leki XML


## The diagnostics panel

editor-diagnostic-line = Lin #{ $line }

editor-no-errors = No wan fowtu
editor-no-warnings = No wan warskow
editor-no-info = No wan info-diagnostik

editor-show-info-annotations = Sori den info-diagnostik na ini a editor
editor-show-accessibility-annotations = Sori den aksesibiliteit-diagnostik na ini a editor

editor-accessibility-learn-more = Leri fa Doenet e wroko nanga aksesibiliteit

editor-accessibility-violations-heading = Aksesibiliteit-fowtu ({ $standard })

editor-accessibility-other-heading = Tra aksesibiliteit-problema
editor-none-found = No wan no feni


## Submitted responses

editor-no-responses = No wan piki no seni ete
editor-response-answer-id = Piki-Id
editor-response-response = Piki
editor-response-credit = Krediti
editor-response-submitted = Seni


## The context-help panel

help-placeholder = Poti a kursor tapu wan tag-nen, wan atribut, noso { $ref } fu kisi dokumentasi.

help-unsupported-ref-chain = Yepi gi referensi di abi difrenti pisi, leki { $example }, no de ete.

help-unresolved-ref =
    { $reason ->
        [notFound] No wan sani no feni gi a referensi: { $ref }.
        [multiple] Moro leki wan sani feni gi a referensi: { $ref }.
       *[indeterminate] Wi no man sabi san { $ref } e sori.
    }

help-learn-about-references = Leri moro fu referensi →
help-reference-page = Referensi-blad →

help-suggestions-header =
    { $location ->
        [inside] Na ini { $element }
       *[top] Na a moro hei nivo
    }{ $allowed ->
        [none] { " — no wan sani no e go dyaso." }
        [text] { " — skrifi tekst dyaso." }
        [text-and-components] { " — skrifi tekst dyaso, noso proberi:" }
       *[components] { " — sani fu proberi:" }
    }

help-suggestions-footer = Druk { $shortcut } fu si ala { $total } komponent.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } na wan referensi gi { $target }.
       *[other] { $ref } na wan referensi gi { $target } (lin { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } tyari en kon leki { $role }.
       *[other] { $owner } tyari en kon na lin { $line } leki { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } na wan referensi gi a { $property } propaiti fu { $element }.
       *[other] { $ref } na wan referensi gi a { $property } propaiti fu { $element } (lin { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = snippet
help-kind-array-entry = array-entri

help-default = Standard:
help-active-default = Standard di e wroko now:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Waarde di mag (wan gi ibri item):
       *[other] Waarde di mag:
    }

help-suggested-values = Waarde di wi e rai:

help-inserts = E poti:

help-coordinates = Koordinaat:

help-type = Sortu:

help-resolved-style = A stail di kon na krin (styleNumber { $styleNumber }):

help-resolved-function-names = Funksi-nen di kon na krin:
help-reset-list = Reset-lisi tapu a inputu disi:
help-added-on-input = Poti tapu a inputu disi:
help-removed-on-input = Puru tapu a inputu disi:

help-reset-overrides = { $reset } e teki presi fu { $additional } nanga { $removed }.
