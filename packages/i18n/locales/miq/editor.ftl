# Mískito editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker and the context-help panel. Translated from
# `locales/en/editor.ftl`, which is the source of truth.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard Latin orthography of the Nicaraguan Caribbean
# coast; see `chrome.ftl`'s header for the alphabet, `ng`, the `aw`/`ai`
# diphthongs and the pronounced `h`. `c`, `f`, `g`, `j`, `q`, `v`, `x` and `z`
# are not in the alphabet, so `k` does the work of `c` and `qu` («kordenada»),
# `p` the work of `f` («piltrar», «pormat», «dipalt»), `b` the work of `v`
# («bersion», «bariant»), and `s` the work of `z` and of `c` before a front
# vowel («diaknostiku», «suherensia»).
#
# **Number.** `Intl.PluralRules` has no CLDR data for `miq`; it falls back to
# the default locale and reports `one` and `other`, categories Mískito does not
# select. A Mískito noun after a numeral takes no plural marker, so the two
# counted messages here — `editor-accessibility-label` and `help-coordinates` —
# are written as **one unselected form** rather than as a `[one]`/`[other]`
# pair. The `$status`, `$action` and `$shortcut` selects around them are not
# plural selects and keep all of English's branches.
#
# **Loans.** From English: «bariant» (through Spanish), «piltrar», «pormat»,
# «dipalt», «tekst», «snipet», «arrei», «WCAG», «riparens», «lain», «kredit»,
# «ansa». From Spanish: «diaknostiku», «bersion», «aksesibilidad»,
# «kordenada», «propiedad», «suherensia», «estilu», «konteks», «dokumentasion».
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber`, version numbers, element and
# attribute names and key combinations stay as written. The frame is Mískito:
# native verbs («kaikaia» to look, «sakaia» to take out, «mangkaia» to put,
# «marikaia» to show, «ulbaia» to write), the negator «apia» after what it
# negates, the postposition «ra», and the copula `sa`.
#
# **Confidence.** Every key in the English catalog is translated. The panel
# names things Mískito has never had to name — variant, diagnostic, snippet,
# array entry, styleNumber — and each of those is a loan in a Mískito sentence
# rather than a coinage; a reviewer should expect to replace several of them.
# «Snipet» and «arrei dinkanka» are the two least settled.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Kli mangks
       *[update] Raiti muns
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Kaikanka { $word }
       *[other] Kaikanka { $word } { $shortcut }
    }


## The variant picker

editor-variant = Bariant
editor-variant-filter = Piltrar...
editor-variant-next = Bariant wala ba bak
editor-variant-previous = Bariant pas ba bak


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA aksesibilidad saura kum sakan. Aksesibilidad ripot ba { $action ->
            [close] prakaia
           *[open] kwakaia
        } dukiara kliks muns.
        [advisories] Aksesibilidad ripot ba { $action ->
            [close] prakaia
           *[open] kwakaia
        } dukiara kliks muns. WCAG AA saura kum sakan apia, sakuna aksesibilidad dukiara smalkanka wala nani bara.
       *[clean] Aksesibilidad ripot ba { $action ->
            [close] prakaia
           *[open] kwakaia
        } dukiara kliks muns. Aksesibilidad trabil kum sakan apia.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA aksesibilidad saura kum sakan. WCAG AA saura { $count } sakan. Aksesibilidad ripot ba { $action ->
            [close] prakaia
           *[open] kwakaia
        } dukiara kliks muns.
        [advisories] WCAG AA saura kum sakan apia. Aksesibilidad dukiara smalkanka wala { $count } sakan. Aksesibilidad ripot ba { $action ->
            [close] prakaia
           *[open] kwakaia
        } dukiara kliks muns.
       *[clean] WCAG AA saura kum sakan apia. Aksesibilidad ripot ba { $action ->
            [close] prakaia
           *[open] kwakaia
        } dukiara kliks muns.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML bersion { $version }

editor-tab-help = Konteks dukiara help
editor-tab-help-short = Konteks
editor-tab-errors = Saura nani
editor-tab-warnings = Warnin nani
editor-tab-info = Tanka
editor-tab-accessibility = Aksesibilidad
editor-tab-responses = Ansa blikan nani

editor-tab-with-count = { $label }: { $count }

editor-options = Editor dukia nani
editor-format-as-doenetml = DoenetML baku pormat muns
editor-format-as-xml = XML baku pormat muns


## The diagnostics panel

editor-diagnostic-line = Lain #{ $line }

editor-no-errors = Saura Apu
editor-no-warnings = Warnin Apu
editor-no-info = Tanka diaknostiku apu

editor-show-info-annotations = Tanka diaknostiku nani ba editor ra marikaia
editor-show-accessibility-annotations = Aksesibilidad diaknostiku nani ba editor ra marikaia

editor-accessibility-learn-more = Doenet ba aksesibilidad dukiara nahki lukisa lan taks

editor-accessibility-violations-heading = Aksesibilidad saura nani ({ $standard })

editor-accessibility-other-heading = Aksesibilidad trabil wala nani
editor-none-found = Apu


## Submitted responses

editor-no-responses = Ansa blikan kum sin apu
editor-response-answer-id = Ansa Id
editor-response-response = Ansa
editor-response-credit = Kredit
editor-response-submitted = Blikan


## The context-help panel

help-placeholder = Dokumentasion briaia dukiara kursur ba tak nina, atributu, apia kaka { $ref } ra mangks.

help-unsupported-ref-chain = { $example } baku riparens tila manis brisa ba dukiara help bara apia sin.

help-unresolved-ref =
    { $reason ->
        [notFound] Naha riparens dukiara diara kum sakan apia: { $ref }.
        [multiple] Naha riparens dukiara diara manis sakan: { $ref }.
       *[indeterminate] { $ref } dukiara ani diara sa ba kaikaia sip apia.
    }

help-learn-about-references = Riparens nani tanka lan taks →
help-reference-page = Riparens wahia →

help-suggestions-header =
    { $location ->
        [inside] { $element } bilara
       *[top] Purara ra
    }{ $allowed ->
        [none] { " — naha ra diara kum dimbia apia." }
        [text] { " — naha ra tekst ulbs." }
        [text-and-components] { " — naha ra tekst ulbs, apia kaka naha nani traiks:" }
       *[components] { " — naha nani traiks:" }
    }

help-suggestions-footer = Kompanenti sut { $total } kaikaia dukiara { $shortcut } mangks.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } lika { $target } ra riparens kum sa.
       *[other] { $ref } lika { $target } ra riparens kum sa (lain { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ba { $role } baku dingkan.
       *[other] { $owner } ba lain { $line } ra { $role } baku dingkan.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } lika { $element } ai { $property } propiedad ra riparens kum sa.
       *[other] { $ref } lika { $element } ai { $property } propiedad ra riparens kum sa (lain { $line }).
    }

help-kind-attribute = atributu
help-kind-snippet = snipet
help-kind-array-entry = arrei dinkanka

help-default = Dipalt:
help-active-default = Dipalt warkka takisa ba:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Balur swin nani (dukia kumi bani dukiara kumi):
       *[other] Balur swin nani:
    }

help-suggested-values = Suherensia balur nani:

help-inserts = Dingkisa:

help-coordinates = Kordenada nani:

help-type = Tipka:

help-resolved-style = Estilu sakan (styleNumber { $styleNumber }):

help-resolved-function-names = Punsion nina sakan nani:
help-reset-list = Naha input ra lista ba kli mangkaia:
help-added-on-input = Naha input ra mangkan:
help-removed-on-input = Naha input ra sakan:

help-reset-overrides = { $reset } lika { $additional } bara { $removed } purara sa.
