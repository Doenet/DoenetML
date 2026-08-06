# Chamorro editor and language-server surfaces. Translated from
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
# Written in the Guam orthography; see `chrome.ftl`. Chamorro marks no number on
# the noun, so a `{ $count -> … }` whose two English branches differ only in the
# noun renders one string here and the select is dropped.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Na'tålo'
       *[update] Na'nuebu
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } i atan
       *[other] { $word } i atan { $shortcut }
    }


## The variant picker

editor-variant = Bariånte
editor-variant-filter = Sedåsu…
editor-variant-next = Ayek i sigiente na bariånte
editor-variant-previous = Ayek i antes na bariånte


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Masodda' un kinentra i akseso WCAG AA. Klek para u { $action ->
            [close] mahuchom
           *[open] mababa
        } i ripot i akseso.
        [advisories] Klek para u { $action ->
            [close] mahuchom
           *[open] mababa
        } i ripot i akseso. Taya' kinentra WCAG AA masodda', lao guaha mås na rekomendasion put i akseso.
       *[clean] Klek para u { $action ->
            [close] mahuchom
           *[open] mababa
        } i ripot i akseso. Taya' problema put i akseso masodda'.
    }

# No select on `$count` inside the branches: «kinentra» and «rekomendasion» are
# the same words for one and for many.
editor-accessibility-label =
    { $status ->
        [violations] Masodda' un kinentra i akseso WCAG AA. Masodda' { $count } na kinentra WCAG AA. Klek para u { $action ->
            [close] mahuchom
           *[open] mababa
        } i ripot i akseso.
        [advisories] Taya' kinentra WCAG AA masodda'. Masodda' { $count } na mås rekomendasion put i akseso. Klek para u { $action ->
            [close] mahuchom
           *[open] mababa
        } i ripot i akseso.
       *[clean] Taya' kinentra WCAG AA masodda'. Klek para u { $action ->
            [close] mahuchom
           *[open] mababa
        } i ripot i akseso.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Betsion DoenetML { $version }

editor-tab-help = Ayudu ni tåtte i kontekto
editor-tab-help-short = Kontekto
editor-tab-errors = Linachi
editor-tab-warnings = Adbertensia
editor-tab-info = Infotmasion
editor-tab-accessibility = Akseso
editor-tab-responses = Ineppe' ni manmanenå'i

editor-tab-with-count = { $label }: { $count }

editor-options = Opsion i editót
editor-format-as-doenetml = Fotmåtu komo DoenetML
editor-format-as-xml = Fotmåtu komo XML


## The diagnostics panel

editor-diagnostic-line = Liña #{ $line }

editor-no-errors = Taya' linachi
editor-no-warnings = Taya' adbertensia
editor-no-info = Taya' diagnostiko infotmasion

editor-show-info-annotations = Na'annok i diagnostiko infotmasion gi editót
editor-show-accessibility-annotations = Na'annok i diagnostiko i akseso gi editót

editor-accessibility-learn-more = Eyak håfa kumekeilek-ña i akseso para Doenet

editor-accessibility-violations-heading = Kinentra i akseso ({ $standard })

editor-accessibility-other-heading = Otro na problema put i akseso
editor-none-found = Taya' masodda'


## Submitted responses

editor-no-responses = Trabiha taya' ineppe' manmanenå'i
editor-response-answer-id = Id i ineppe'
editor-response-response = Ineppe'
editor-response-credit = Kredito
editor-response-submitted = Manmanenå'i


## The context-help panel

help-placeholder = Po'lo i kutsot gi na'ån tag, atributo, pat gi { $ref } para i dokumentasion.

help-unsupported-ref-chain = Trabiha ti masetbe i ayudu para i refirensia ni meggai na patte kalan i { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Taya' masodda' ni ma'apunta i refirensia: { $ref }.
        [multiple] Meggai masodda' ni ma'apunta i refirensia: { $ref }.
       *[indeterminate] Ti siña matungo' håfa ma'apunta i { $ref }.
    }

help-learn-about-references = Eyak put i refirensia →
help-reference-page = Påhinan refirensia →

help-suggestions-header =
    { $location ->
        [inside] Gi halom { $element }
       *[top] Gi mås takhilo' na nibet
    }{ $allowed ->
        [none] { " — taya' siña mapo'lo guini." }
        [text] { " — tuge' teksto guini." }
        [text-and-components] { " — tuge' teksto guini, pat chagi:" }
       *[components] { " — siña machagi:" }
    }

help-suggestions-footer = Pucha i { $shortcut } para un li'e' todu i { $total } na komponente.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] I { $ref } refirensia para i { $target }.
       *[other] I { $ref } refirensia para i { $target } (liña { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Machule' ginen i { $owner } komo { $role }.
       *[other] Machule' ginen i { $owner } gi liña { $line } komo { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] I { $ref } refirensia para i propiedåt { $property } i { $element }.
       *[other] I { $ref } refirensia para i propiedåt { $property } i { $element } (liña { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = dikike' na kodigo
help-kind-array-entry = entråda gi array

help-default = Kostumbre:
help-active-default = Kostumbre ni aktibo:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Balot ni matulaika (unu kada bånda):
       *[other] Balot ni matulaika:
    }

help-suggested-values = Balot ni marekomienda:

help-inserts = Muna'hålom:

# No select: «koordinåda» is the same word for one and for many.
help-coordinates = Koordinåda:

help-type = Klåsi:

help-resolved-style = Estilo ni matungo' (styleNumber { $styleNumber }):

help-resolved-function-names = Na'ån funsion ni matungo':
help-reset-list = Listan na'tålo' gi este na input:
help-added-on-input = Mana'saga gi este na input:
help-removed-on-input = Mana'suha gi este na input:

help-reset-overrides = I { $reset } ha tulaika i { $additional } yan i { $removed }.
