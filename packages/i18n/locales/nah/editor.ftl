# Nahuatl editor and language-server surfaces. Translated from
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
# Written in Central Nahuatl, SEP/INALI orthography; see `chrome.ftl`'s header.
#
# The possessive prefix is not put on a placeable anywhere in this file: its
# shape depends on what follows it, so where the English possessed a value —
# "the { $property } property of { $element }" — this catalog names it instead.
# That is the constraint `content.ftl`'s header sets out.
#
# The inanimate nouns these messages count take no plural, so a
# `{ $count -> … }` whose only English difference is the noun's number renders
# one string here and the select is dropped. A comment marks each site.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Xiccuepa
       *[update] Xicyancuīli
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } in tlachiyalōni
       *[other] { $word } in tlachiyalōni { $shortcut }
    }


## The variant picker

editor-variant = Occē tlamantli
editor-variant-filter = Xictzehtzelo…
editor-variant-next = Xicpehpena in niman tlamantli
editor-variant-previous = Xicpehpena in yehuā tlamantli


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ōmottac cē WCAG AA tlahtlacōlli ipan calaquiliztli. Xictzōtzona inic { $action ->
            [close] motzacuāz
           *[open] motlapōz
        } in calaquiliztli tlahcuilōlli.
        [advisories] Xictzōtzona inic { $action ->
            [close] motzacuāz
           *[open] motlapōz
        } in calaquiliztli tlahcuilōlli. Ahtlein WCAG AA tlahtlacōlli ōmottac, tel oc cequi calaquiliztli tlanahuatīlli mopiya.
       *[clean] Xictzōtzona inic { $action ->
            [close] motzacuāz
           *[open] motlapōz
        } in calaquiliztli tlahcuilōlli. Ahtlein calaquiliztli tlaohuihcāyōtl ōmottac.
    }

# No select on `$count`: «tlahtlacōlli» and «tlanahuatīlli» are inanimate and take
# no plural, so both categories would render the same string.
editor-accessibility-label =
    { $status ->
        [violations] Ōmottac cē WCAG AA tlahtlacōlli ipan calaquiliztli. Ōmottac { $count } WCAG AA tlahtlacōlli. Xictzōtzona inic { $action ->
            [close] motzacuāz
           *[open] motlapōz
        } in calaquiliztli tlahcuilōlli.
        [advisories] Ahtlein WCAG AA tlahtlacōlli ōmottac. Ōmottac { $count } oc cequi calaquiliztli tlanahuatīlli. Xictzōtzona inic { $action ->
            [close] motzacuāz
           *[open] motlapōz
        } in calaquiliztli tlahcuilōlli.
       *[clean] Ahtlein WCAG AA tlahtlacōlli ōmottac. Xictzōtzona inic { $action ->
            [close] motzacuāz
           *[open] motlapōz
        } in calaquiliztli tlahcuilōlli.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML tlamantli { $version }

editor-tab-help = Tlapalēhuīlli in cānin cah
editor-tab-help-short = Cānin
editor-tab-errors = Tlahtlacōlli
editor-tab-warnings = Tlanahuatīlli
editor-tab-info = Tlamachiliztli
editor-tab-accessibility = Calaquiliztli
editor-tab-responses = Tlanānquilīlli ōtitlanōc

editor-tab-with-count = { $label }: { $count }

editor-options = Tlahcuilōlōni tlapehpenalli
editor-format-as-doenetml = Xictlālia DoenetML iuhqui
editor-format-as-xml = Xictlālia XML iuhqui


## The diagnostics panel

editor-diagnostic-line = Tlamelāuhcāyōtl #{ $line }

editor-no-errors = Ahtlein tlahtlacōlli
editor-no-warnings = Ahtlein tlanahuatīlli
editor-no-info = Ahtlein tlamachiliztli tlanēxtīlli

editor-show-info-annotations = Xicnēxti tlamachiliztli tlanēxtīlli ipan tlahcuilōlōni
editor-show-accessibility-annotations = Xicnēxti calaquiliztli tlanēxtīlli ipan tlahcuilōlōni

editor-accessibility-learn-more = Xicmati quēnin Doenet quitta in calaquiliztli

editor-accessibility-violations-heading = Tlahtlacōlli ipan calaquiliztli ({ $standard })

editor-accessibility-other-heading = Oc cequi calaquiliztli tlaohuihcāyōtl
editor-none-found = Ahtlein ōmottac


## Submitted responses

editor-no-responses = Ayamo mopiya tlanānquilīlli ōtitlanōc
editor-response-answer-id = Ītōcā in tlanānquilīlli
editor-response-response = Tlanānquilīlli
editor-response-credit = Ipatiuh
editor-response-submitted = Ōtitlanōc


## The context-help panel

help-placeholder = Xictlāli in tlīltzintli ipan cē tag ītōcā, cē tlamachiyōtīlli, ahnōzo { $ref } inic tiquittaz in tlahcuilōlli.

help-unsupported-ref-chain = Tlapalēhuīlli ipan miec tlacotōnalli tlanōtzalli iuhqui { $example } ayamo mopiya.

help-unresolved-ref =
    { $reason ->
        [notFound] Ahtlein ōmottac inic inin tlanōtzalli: { $ref }.
        [multiple] Miec ōmottac inic inin tlanōtzalli: { $ref }.
       *[indeterminate] Ahmo ōhuel ōmottac tlein { $ref } quinōtza.
    }

help-learn-about-references = Xicmati in tlanōtzalli →
help-reference-page = Tlanōtzalli āmoxpechtli →

help-suggestions-header =
    { $location ->
        [inside] Ihtic { $element }
       *[top] Ipan in tlacpac
    }{ $allowed ->
        [none] { " — nicān ahtlein calaqui." }
        [text] { " — nicān xictlāli tlahcuilōlli." }
        [text-and-components] { " — nicān xictlāli tlahcuilōlli, ahnōzo xicyehyeco:" }
       *[components] { " — tlein tiquyehyecōz:" }
    }

help-suggestions-footer = Xictzōtzona { $shortcut } inic tiquittaz in mochi { $total } tlanechicōlli.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } quinōtza { $target }.
       *[other] { $ref } quinōtza { $target } (tlamelāuhcāyōtl { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ōquitlālih iuhqui { $role }.
       *[other] { $owner } ōquitlālih ipan tlamelāuhcāyōtl { $line } iuhqui { $role }.
    }

# The property is named rather than possessed, for the reason in this file's
# header: the possessive prefix's shape would depend on `$property`.
help-property-is-reference =
    { $line ->
        [none] { $ref } quinōtza in tlamachiyōtīlli { $property } ipan { $element }.
       *[other] { $ref } quinōtza in tlamachiyōtīlli { $property } ipan { $element } (tlamelāuhcāyōtl { $line }).
    }

help-kind-attribute = tlamachiyōtīlli
help-kind-snippet = tlahcuilōlcotōnalli
help-kind-array-entry = tlapōhualli calaquiliztli

help-default = Tlein achto cah:
help-active-default = Tlein axcān achto cah:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Tlein cualli (cē īpan cēcen):
       *[other] Tlein cualli:
    }

help-suggested-values = Tlein monequi:

help-inserts = Quicalaquia:

# No select: «tlaīxnēxtīlli» is inanimate and takes no plural, so both categories
# would render the same string.
help-coordinates = Tlaīxnēxtīlli:

help-type = Tlamantli:

help-resolved-style = Tlanēmilīlli ōmottac (styleNumber { $styleNumber }):

help-resolved-function-names = Funsion ītōcā ōmottac:
help-reset-list = Tlacuepcāyōtl tlapōhualli ipan inin calaquiliztli:
help-added-on-input = Ōmaxiltih ipan inin calaquiliztli:
help-removed-on-input = Ōmoquīxtih ipan inin calaquiliztli:

help-reset-overrides = { $reset } quipanahuia { $additional } īhuān { $removed }.
