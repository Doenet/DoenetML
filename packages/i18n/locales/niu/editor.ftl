# Niuean (ko e vagahau Niue) editor and language-server surfaces. Translated
# from `locales/en/editor.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Orthography, the absence of the glottal stop, and the departures from
# `locales/to` are set out in `chrome.ftl`'s header; `content.ftl`'s tables are
# canonical for the vocabulary. Niuean marks plural with a preposed «tau» and
# never after a numeral, so a `{ $count -> … }` whose two English branches
# differ only in the noun renders one string here and the select is dropped.
#
# Known residue: «tohitohiaga» is used for the editor and «tohi» for the
# document. Both are built on «tohi», to write, and a speaker may want two
# less closely related words.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Liu fakatū
       *[update] Fakahou
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } e mata kite
       *[other] { $word } e mata kite { $shortcut }
    }


## The variant picker

editor-variant = Kehekehe
editor-variant-filter = Fakamama…
editor-variant-next = Fifili e kehekehe hoko
editor-variant-previous = Fifili e kehekehe mua


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ne moua e moumouaga he tuaga hokotia WCAG AA. Lomi ke { $action ->
            [close] pā
           *[open] hafagi
        } e lipoti hokotia.
        [advisories] Lomi ke { $action ->
            [close] pā
           *[open] hafagi
        } e lipoti hokotia. Ne nakai moua ha moumouaga WCAG AA, ka e ha ha i ai e tau tomatoma hokotia foki.
       *[clean] Lomi ke { $action ->
            [close] pā
           *[open] hafagi
        } e lipoti hokotia. Ne nakai moua ha lekua hokotia.
    }

# No select on `$count` inside the branches: «moumouaga» and «tomatoma» are the
# same words after one and after many.
editor-accessibility-label =
    { $status ->
        [violations] Ne moua e moumouaga he tuaga hokotia WCAG AA. Ne moua { $count } e moumouaga WCAG AA. Lomi ke { $action ->
            [close] pā
           *[open] hafagi
        } e lipoti hokotia.
        [advisories] Ne nakai moua ha moumouaga WCAG AA. Ne moua { $count } e tomatoma hokotia foki. Lomi ke { $action ->
            [close] pā
           *[open] hafagi
        } e lipoti hokotia.
       *[clean] Ne nakai moua ha moumouaga WCAG AA. Lomi ke { $action ->
            [close] pā
           *[open] hafagi
        } e lipoti hokotia.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Fakaholoaga DoenetML { $version }

editor-tab-help = Lagomatai ke lata mo e tuaga
editor-tab-help-short = Tuaga
editor-tab-errors = Tau hehē
editor-tab-warnings = Tau fakatokanga
editor-tab-info = Fakailoaaga
editor-tab-accessibility = Hokotia
editor-tab-responses = Tau tali ne fakafano atu

editor-tab-with-count = { $label }: { $count }

editor-options = Tau fifiliaga he tohitohiaga
editor-format-as-doenetml = Fakatokatoka mo DoenetML
editor-format-as-xml = Fakatokatoka mo XML


## The diagnostics panel

editor-diagnostic-line = Laini #{ $line }

editor-no-errors = Nakai fai hehē
editor-no-warnings = Nakai fai fakatokanga
editor-no-info = Nakai fai fakasivi fakailoaaga

editor-show-info-annotations = Fakakite e tau fakasivi fakailoaaga he tohitohiaga
editor-show-accessibility-annotations = Fakakite e tau fakasivi hokotia he tohitohiaga

editor-accessibility-learn-more = Ako ke he puhala he Doenet ke he hokotia

editor-accessibility-violations-heading = Tau moumouaga hokotia ({ $standard })

editor-accessibility-other-heading = Tau lekua hokotia kehe
editor-none-found = Nakai fai mena ne moua


## Submitted responses

editor-no-responses = Kua nakai la fai tali ne fakafano atu
editor-response-answer-id = Id he tali
editor-response-response = Tali
editor-response-credit = Mataitohi
editor-response-submitted = Kua fakafano atu


## The context-help panel

help-placeholder = Tuku e kāsolo ke he higoa tag, ke he atilipiuti, po ke { $ref } ma e fakamaamaaga.

help-unsupported-ref-chain = Kua nakai la lagomatai e tau hagaaoaga vala loga tuga e { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Nakai moua ha mena ne hagaao ki ai e hagaaoaga: { $ref }.
        [multiple] Ne moua e tau mena loga ne hagaao ki ai e hagaaoaga: { $ref }.
       *[indeterminate] Nakai maeke ke fakamooli po ko e heigoa ne hagaao ki ai e { $ref }.
    }

help-learn-about-references = Ako hagaao ke he tau hagaaoaga →
help-reference-page = Lau hagaaoaga →

help-suggestions-header =
    { $location ->
        [inside] I loto he { $element }
       *[top] He tuaga i luga
    }{ $allowed ->
        [none] { " — nakai fai mena ka tuku ki heni." }
        [text] { " — tohi e kupu ki heni." }
        [text-and-components] { " — tohi e kupu ki heni, po ke lali e:" }
       *[components] { " — tau mena ke lali:" }
    }

help-suggestions-footer = Lomi e { $shortcut } ke kitia e tau vala oti { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Ko e { $ref } ko e hagaaoaga ke he { $target }.
       *[other] Ko e { $ref } ko e hagaaoaga ke he { $target } (laini { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ne uta mai he { $owner } ko e { $role }.
       *[other] Ne uta mai he { $owner } he laini { $line } ko e { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Ko e { $ref } ko e hagaaoaga ke he mena { $property } he { $element }.
       *[other] Ko e { $ref } ko e hagaaoaga ke he mena { $property } he { $element } (laini { $line }).
    }

help-kind-attribute = atilipiuti
help-kind-snippet = vala koti
help-kind-array-entry = huki ke he array

help-default = Mahani fa mau:
help-active-default = Mahani fa mau gahua:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Tau uho ata (taha ke he mena takitaha):
       *[other] Tau uho ata:
    }

help-suggested-values = Tau uho ne tomatoma:

help-inserts = Kua fakauku:

# No select: «tuaga» is the same word after one and after many.
help-coordinates = Tuaga fakamau:

help-type = Faahi:

help-resolved-style = Sitaila kua fakamooli (styleNumber { $styleNumber }):

help-resolved-function-names = Tau higoa gahua fika kua fakamooli:
help-reset-list = Lisi liu fakatū he input nei:
help-added-on-input = Ne lafi he input nei:
help-removed-on-input = Ne tuku kehe he input nei:

help-reset-overrides = Kua fakahiku he { $reset } e { $additional } mo e { $removed }.
