# Mapudungun editor and language-server surfaces. Translated from
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
# Written in the Alfabeto Mapuche Unificado; see `content.ftl`'s header for the
# orthography choice and the loan boundary.
#
# Mapudungun marks the plural with the free «pu» and drops it after a numeral, so
# a `{ $count -> … }` whose only English difference is the noun's number renders
# one string here and the select is dropped. A comment marks each site.
#
# "The X of Y" is «{ $property } { $element } mew» — the postposition follows and
# is a separate word, so nothing is welded to a value.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Wüñotun
       *[update] Wenuntun
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } ti pengelfe
       *[other] { $word } ti pengelfe { $shortcut }
    }


## The variant picker

editor-variant = Ka adkünun
editor-variant-filter = Dulliñ…
editor-variant-next = Dullinge ti inan adkünun
editor-variant-previous = Dullinge ti wüne adkünun


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Peñgey kiñe WCAG AA konpeyüm welulkan. Rütrünge ti konpeyüm chillka { $action ->
            [close] nürükünuam
           *[open] nülakünuam
        }.
        [advisories] Rütrünge ti konpeyüm chillka { $action ->
            [close] nürükünuam
           *[open] nülakünuam
        }. Chemnorume WCAG AA welulkan peñgelay, welu müley ka konpeyüm gülamtun.
       *[clean] Rütrünge ti konpeyüm chillka { $action ->
            [close] nürükünuam
           *[open] nülakünuam
        }. Chemnorume konpeyüm weda dungu peñgelay.
    }

# No select on `$count`: «welulkan» and «gülamtun» take no plural marker after a
# numeral, so both categories would render the same string.
editor-accessibility-label =
    { $status ->
        [violations] Peñgey kiñe WCAG AA konpeyüm welulkan. Peñgey { $count } WCAG AA welulkan. Rütrünge ti konpeyüm chillka { $action ->
            [close] nürükünuam
           *[open] nülakünuam
        }.
        [advisories] Chemnorume WCAG AA welulkan peñgelay. Peñgey { $count } ka konpeyüm gülamtun. Rütrünge ti konpeyüm chillka { $action ->
            [close] nürükünuam
           *[open] nülakünuam
        }.
       *[clean] Chemnorume WCAG AA welulkan peñgelay. Rütrünge ti konpeyüm chillka { $action ->
            [close] nürükünuam
           *[open] nülakünuam
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML adkünun { $version }

editor-tab-help = Kellun ti mülepeyüm mew
editor-tab-help-short = Mülepeyüm
editor-tab-errors = Welulkan
editor-tab-warnings = Gülamtun
editor-tab-info = Kimeltun
editor-tab-accessibility = Konpeyüm
editor-tab-responses = Werküngen llowdungun

editor-tab-with-count = { $label }: { $count }

editor-options = Wirintukufe dullin
editor-format-as-doenetml = Adkünunge DoenetML reke
editor-format-as-xml = Adkünunge XML reke


## The diagnostics panel

editor-diagnostic-line = Wirin #{ $line }

editor-no-errors = Chemnorume welulkan
editor-no-warnings = Chemnorume gülamtun
editor-no-info = Chemnorume kimeltun pengelün

editor-show-info-annotations = Pengelnge kimeltun pengelün ti wirintukufe mew
editor-show-accessibility-annotations = Pengelnge konpeyüm pengelün ti wirintukufe mew

editor-accessibility-learn-more = Kimnge chumngechi Doenet inaniey ti konpeyüm

editor-accessibility-violations-heading = Konpeyüm welulkan ({ $standard })

editor-accessibility-other-heading = Ka konpeyüm weda dungu
editor-none-found = Chemnorume peñgelay


## Submitted responses

editor-no-responses = Petu müleay werküngen llowdungun
editor-response-answer-id = Llowdungun üy
editor-response-response = Llowdungun
editor-response-credit = Falin
editor-response-submitted = Werküngen


## The context-help panel

help-placeholder = Elnge ti troy kiñe tag üy mew, kiñe adkünun mew, kam { $ref } mew, chillka peam.

help-unsupported-ref-chain = { $example } reke fentren trokiñ inarumen kellun petu müleay.

help-unresolved-ref =
    { $reason ->
        [notFound] Chemnorume peñgelay tüfachi inarumen mew: { $ref }.
        [multiple] Fentren peñgey tüfachi inarumen mew: { $ref }.
       *[indeterminate] Pepi kimngelay chem { $ref } inarumey.
    }

help-learn-about-references = Kimnge inarumen dungu →
help-reference-page = Inarumen chillka →

help-suggestions-header =
    { $location ->
        [inside] { $element } ponwi
       *[top] Doy wenu mew
    }{ $allowed ->
        [none] { " — chemnorume konkelay faw." }
        [text] { " — wirintukunge dungu faw." }
        [text-and-components] { " — wirintukunge dungu faw, kam pepiluge:" }
       *[components] { " — chem pepiluam:" }
    }

help-suggestions-footer = Rütrünge { $shortcut } kom { $total } trokiñ peam.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } inarumey { $target }.
       *[other] { $ref } inarumey { $target } (wirin { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } elelfi { $role } reke.
       *[other] { $owner } elelfi wirin { $line } mew, { $role } reke.
    }

# «mew» rather than a possessive affix on either value, for the reason in this
# file's header.
help-property-is-reference =
    { $line ->
        [none] { $ref } inarumey ti { $property } { $element } mew.
       *[other] { $ref } inarumey ti { $property } { $element } mew (wirin { $line }).
    }

help-kind-attribute = adkünun
help-kind-snippet = pichi wirintukun
help-kind-array-entry = wirin konün

help-default = Wüne falin:
help-active-default = Fewla wüne falin:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Elungen falin (kiñe kiñeke mew):
       *[other] Elungen falin:
    }

help-suggested-values = Gülamngen falin:

help-inserts = Konümtukuy:

# No select: no numeral stands here, and the free «pu» is optional rather than
# obligatory, so «troy adkünun» is written bare for both categories and they
# would render the same string.
help-coordinates = Troy adkünun:

help-type = Adkünun:

help-resolved-style = Peñgen adentun (styleNumber { $styleNumber }):

help-resolved-function-names = Peñgen funsion üy:
help-reset-list = Tüfachi konün mew wüñotun wirin:
help-added-on-input = Tüfachi konün mew yomümngen:
help-removed-on-input = Tüfachi konün mew nentungen:

help-reset-overrides = { $reset } kañpüle elkünuy { $additional } ka { $removed }.
