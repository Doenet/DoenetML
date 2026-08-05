# Guarani editor and language-server surfaces. Translated from
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
# Written in the *jopara* register; see `chrome.ftl`'s header.
#
# Guarani drops the plural suffix after a numeral, so a `{ $count -> … }` whose
# only English difference is the noun's number renders one string here and the
# select is dropped. A comment marks each site.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Embojevy
       *[update] Embohekopyahu
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } pe mba'erechaha
       *[other] { $word } pe mba'erechaha { $shortcut }
    }


## The variant picker

editor-variant = Ambue ojehecháva
editor-variant-filter = Emoñe'ẽngue…
editor-variant-next = Eiporavo upeigua ojehecháva
editor-variant-previous = Eiporavo mboyvegua ojehecháva


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ojejuhu peteĩ WCAG AA jeikeha ñembyai. Eikutu pe jeikeha marandu'i { $action ->
            [close] emboty
           *[open] embojera
        } haguã.
        [advisories] Eikutu pe jeikeha marandu'i { $action ->
            [close] emboty
           *[open] embojera
        } haguã. Ndojejuhúi mba'eve WCAG AA ñembyai, hákatu oĩ ambue jeikeha ñemoñe'ẽ.
       *[clean] Eikutu pe jeikeha marandu'i { $action ->
            [close] emboty
           *[open] embojera
        } haguã. Ndojejuhúi mba'eve jeikeha apañuãi.
    }

# No select on `$count`: «ñembyai» and «ñemoñe'ẽ» take no plural suffix after a
# numeral, so both categories would render the same string.
editor-accessibility-label =
    { $status ->
        [violations] Ojejuhu peteĩ WCAG AA jeikeha ñembyai. Ojejuhu { $count } WCAG AA ñembyai. Eikutu pe jeikeha marandu'i { $action ->
            [close] emboty
           *[open] embojera
        } haguã.
        [advisories] Ndojejuhúi mba'eve WCAG AA ñembyai. Ojejuhu { $count } ambue jeikeha ñemoñe'ẽ. Eikutu pe jeikeha marandu'i { $action ->
            [close] emboty
           *[open] embojera
        } haguã.
       *[clean] Ndojejuhúi mba'eve WCAG AA ñembyai. Eikutu pe jeikeha marandu'i { $action ->
            [close] emboty
           *[open] embojera
        } haguã.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML { $version } jeguerujey

editor-tab-help = Ñepytyvõ tenda rehegua
editor-tab-help-short = Tenda
editor-tab-errors = Javy
editor-tab-warnings = Ñemomarandu
editor-tab-info = Marandu
editor-tab-accessibility = Jeikeha
editor-tab-responses = Mbohovái mondopyre

editor-tab-with-count = { $label }: { $count }

editor-options = Mohesakãha poravorã
editor-format-as-doenetml = Emoha'ãnga DoenetML ramo
editor-format-as-xml = Emoha'ãnga XML ramo


## The diagnostics panel

editor-diagnostic-line = Tysỹi #{ $line }

editor-no-errors = Ndaipóri javy
editor-no-warnings = Ndaipóri ñemomarandu
editor-no-info = Ndaipóri marandu ñemombe'u

editor-show-info-annotations = Ehechauka marandu ñemombe'u mohesakãhápe
editor-show-accessibility-annotations = Ehechauka jeikeha ñemombe'u mohesakãhápe

editor-accessibility-learn-more = Eikuaave mba'éichapa Doenet oñangareko jeikeha rehe

editor-accessibility-violations-heading = Jeikeha ñembyai ({ $standard })

editor-accessibility-other-heading = Ambue jeikeha apañuãi
editor-none-found = Ndojejuhúi mba'eve


## Submitted responses

editor-no-responses = Ndaipóri gueteri mbohovái mondopyre
editor-response-answer-id = Mbohovái réra
editor-response-response = Mbohovái
editor-response-credit = Tepy
editor-response-submitted = Mondopyre


## The context-help panel

help-placeholder = Emoĩ pe kyta peteĩ tag réra, teroja, térã { $ref } ári kuatiañe'ẽ jehupytyrã.

help-unsupported-ref-chain = Ñepytyvõ { $example } mba'eichagua heta pehẽ jehechaukápe ndaipóri gueteri.

help-unresolved-ref =
    { $reason ->
        [notFound] Ndojejuhúi mba'eve ko jehechauka peguarã: { $ref }.
        [multiple] Ojejuhu heta ko jehechauka peguarã: { $ref }.
       *[indeterminate] Ndaikatúi ojekuaa mba'épe { $ref } ohechauka.
    }

help-learn-about-references = Eikuaave jehechauka rehegua →
help-reference-page = Jehechauka rogue →

help-suggestions-header =
    { $location ->
        [inside] { $element } ryepýpe
       *[top] Yvateveguápe
    }{ $allowed ->
        [none] { " — ko'ápe ndaipóri mba'eve oikéva." }
        [text] { " — ehai jehaipy ko'ápe." }
        [text-and-components] { " — ehai jehaipy ko'ápe, térã eha'ã:" }
       *[components] { " — mba'e eha'ãrã:" }
    }

help-suggestions-footer = Eikutu { $shortcut } ehecha haguã opa { $total } apyra.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ohechauka { $target } rehe.
       *[other] { $ref } ohechauka { $target } rehe (tysỹi { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } omoĩ { $role } ramo.
       *[other] { $owner } omoĩ tysỹi { $line } rehe, { $role } ramo.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ohechauka { $element } mba'e { $property } teko rehe.
       *[other] { $ref } ohechauka { $element } mba'e { $property } teko rehe (tysỹi { $line }).
    }

help-kind-attribute = teroja
help-kind-snippet = jehaipy pehẽ
help-kind-array-entry = tysỹi jeike

help-default = Teko ypykue:
help-active-default = Teko ypykue oikóva:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Tepy ojeheja (peteĩteĩ apyrápe):
       *[other] Tepy ojeheja:
    }

help-suggested-values = Tepy ñemoñe'ẽ:

help-inserts = Omoĩ:

# No select: no numeral stands here, and «-kuéra» is optional rather than
# obligatory, so «kyta rendaguã» is written bare for both categories and they
# would render the same string.
help-coordinates = Kyta rendaguã:

help-type = Mba'eichagua:

help-resolved-style = Ta'ãnga ojejuhúva (styleNumber { $styleNumber }):

help-resolved-function-names = Funsiõ réra ojejuhúva:
help-reset-list = Ko jeiképe ñembojevy tysỹi:
help-added-on-input = Ko jeiképe ojejoapy:
help-removed-on-input = Ko jeiképe ojepe'a:

help-reset-overrides = { $reset } ombyai { $additional } ha { $removed }.
