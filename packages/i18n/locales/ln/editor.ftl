# Lingala editor and language-server surfaces. Translated from
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
# Lingala marks number by changing a noun's class prefix, and keeps doing so
# after a numeral, so the counted messages keep their selects.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Zongisá
       *[update] Bongisá
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Molakisi
       *[other] { $word } Molakisi { $shortcut }
    }


## The variant picker

editor-variant = Lolenge
editor-variant-filter = Poná...
editor-variant-next = Poná lolenge oyo elandi
editor-variant-previous = Poná lolenge oyo eleki


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kobuka mibeko ya WCAG AA mpo na bokɔti emonani. Finá mpo na { $action ->
            [close] kokanga
           *[open] kofungola
        } lapolo ya bokɔti.
        [advisories] Finá mpo na { $action ->
            [close] kokanga
           *[open] kofungola
        } lapolo ya bokɔti. Kobuka mibeko ya WCAG AA emonani te, kasi batoli mosusu ezali mpo na bokɔti.
       *[clean] Finá mpo na { $action ->
            [close] kokanga
           *[open] kofungola
        } lapolo ya bokɔti. Mokakatano moko te ya bokɔti emonani.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kobuka mibeko ya WCAG AA mpo na bokɔti emonani. { $count ->
            [one] Kobuka mobeko { $count } ya WCAG AA emonani
           *[other] Kobuka mibeko { $count } ya WCAG AA emonani
        }. Finá mpo na { $action ->
            [close] kokanga
           *[open] kofungola
        } lapolo ya bokɔti.
        [advisories] Kobuka mibeko ya WCAG AA emonani te. { $count ->
            [one] Toli { $count } ya kobakisa mpo na bokɔti emonani
           *[other] Batoli { $count } ya kobakisa mpo na bokɔti emonani
        }. Finá mpo na { $action ->
            [close] kokanga
           *[open] kofungola
        } lapolo ya bokɔti.
       *[clean] Kobuka mibeko ya WCAG AA emonani te. Finá mpo na { $action ->
            [close] kokanga
           *[open] kofungola
        } lapolo ya bokɔti.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML lolenge { $version }

editor-tab-help = Lisalisi oyo ebongi na esika
editor-tab-help-short = Esika
editor-tab-errors = Mabunga
editor-tab-warnings = Makebisi
editor-tab-info = Basango
editor-tab-accessibility = Bokɔti
editor-tab-responses = Biyano oyo etindami

editor-tab-with-count = { $label }: { $count }

editor-options = Baponi ya mokomi
editor-format-as-doenetml = Bongisá lokola DoenetML
editor-format-as-xml = Bongisá lokola XML


## The diagnostics panel

editor-diagnostic-line = Molɔngɔ #{ $line }

editor-no-errors = Libunga Moko Te
editor-no-warnings = Likebisi Moko Te
editor-no-info = Botali ya Basango Moko Te

editor-show-info-annotations = Lakisá botali ya basango na mokomi
editor-show-accessibility-annotations = Lakisá botali ya bokɔti na mokomi

editor-accessibility-learn-more = Yekolá ndenge Doenet asalaka na bokɔti

editor-accessibility-violations-heading = Kobuka mibeko ya bokɔti ({ $standard })

editor-accessibility-other-heading = Mikakatano mosusu ya bokɔti
editor-none-found = Eloko moko te emonani


## Submitted responses

editor-no-responses = Eyano moko etindami naino te
editor-response-answer-id = Nkombo ya Eyano
editor-response-response = Eyano
editor-response-credit = Motuya
editor-response-submitted = Etindami


## The context-help panel

help-placeholder = Tiá elembo likolo ya nkombo ya tagi, ezalela to { $ref } mpo na kozwa mikanda.

help-unsupported-ref-chain = Lisalisi mpo na balakisi ya biteni ebele lokola { $example } ezali naino te.

help-unresolved-ref =
    { $reason ->
        [notFound] Eloko moko te emonani mpo na elakisi: { $ref }.
        [multiple] Biloko ebele emonani mpo na elakisi: { $ref }.
       *[indeterminate] Eloko oyo { $ref } elakisi eyebani te.
    }

help-learn-about-references = Yekolá makambo ya balakisi →
help-reference-page = Lokasa ya balakisi →

help-suggestions-header =
    { $location ->
        [inside] Na kati ya { $element }
       *[top] Na likolo
    }{ $allowed ->
        [none] { " — eloko moko te ekɔti awa." }
        [text] { " — komá makomi awa." }
        [text-and-components] { " — komá makomi awa, to meká:" }
       *[components] { " — biloko ya komeka:" }
    }

help-suggestions-footer = Finá { $shortcut } mpo na kotala biloko { $total } nyonso.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ezali elakisi ya { $target }.
       *[other] { $ref } ezali elakisi ya { $target } (molɔngɔ { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } apesi yango nkombo { $role }.
       *[other] { $owner } apesi yango nkombo { $role } na molɔngɔ { $line }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ezali elakisi ya ezalela { $property } ya { $element }.
       *[other] { $ref } ezali elakisi ya ezalela { $property } ya { $element } (molɔngɔ { $line }).
    }

help-kind-attribute = ezalela
help-kind-snippet = eteni ya makomi
help-kind-array-entry = ekɔteli ya tabelo

help-default = Oyo ezali wana:
help-active-default = Oyo ezali wana mpe ezali kosala:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mituya oyo epesameli nzela (moko na eloko mokomoko):
       *[other] Mituya oyo epesameli nzela:
    }

help-suggested-values = Mituya oyo epesami likanisi:

help-inserts = Ekɔtisaka:

help-coordinates =
    { $count ->
        [one] Elembo ya esika:
       *[other] Bilembo ya esika:
    }

help-type = Lolenge:

help-resolved-style = Lolenge oyo eyebani (styleNumber { $styleNumber }):

help-resolved-function-names = Bankombo ya fɔnksiɔ oyo eyebani:
help-reset-list = Molɔngɔ oyo ezongisami na ekɔteli oyo:
help-added-on-input = Oyo ebakisami na ekɔteli oyo:
help-removed-on-input = Oyo elongolami na ekɔteli oyo:

help-reset-overrides = { $reset } eleki { $additional } mpe { $removed }.
