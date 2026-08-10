# Luba-Lulua editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Pingaja
       *[update] Vuluija
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Mulejianyi
       *[other] { $word } Mulejianyi { $shortcut }
    }


## The variant picker

editor-variant = Mushindu

editor-variant-filter = Sungula…

editor-variant-next = Sungula mushindu udi ulonda

editor-variant-previous = Sungula mushindu uvua kumpala


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Dipita dia WCAG AA dia difikila didi disanganyibue. Kanda bua { $action ->
            [close] kukanga
           *[open] kubulula
        } lapolo wa difikila.
        [advisories] Kanda bua { $action ->
            [close] kukanga
           *[open] kubulula
        } lapolo wa difikila. Kakuena dipita dia WCAG AA disanganyibue, kadi kudi mibelu mikuabo ya difikila.
       *[clean] Kanda bua { $action ->
            [close] kukanga
           *[open] kubulula
        } lapolo wa difikila. Kakuena ntatu ya difikila isanganyibue.
    }

editor-accessibility-label =
    { $status ->
        [violations] Dipita dia WCAG AA dia difikila didi disanganyibue. { $count ->
            [one] Kudi dipita dia WCAG AA { $count } disanganyibue
           *[other] Kudi mapita a WCAG AA { $count } asanganyibue
        }. Kanda bua { $action ->
            [close] kukanga
           *[open] kubulula
        } lapolo wa difikila.
        [advisories] Kakuena dipita dia WCAG AA disanganyibue. { $count ->
            [one] Kudi mubelu mukuabo wa difikila { $count } musanganyibue
           *[other] Kudi mibelu mikuabo ya difikila { $count } isanganyibue
        }. Kanda bua { $action ->
            [close] kukanga
           *[open] kubulula
        } lapolo wa difikila.
       *[clean] Kakuena dipita dia WCAG AA disanganyibue. Kanda bua { $action ->
            [close] kukanga
           *[open] kubulula
        } lapolo wa difikila.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Mvelesio wa DoenetML { $version }

editor-tab-help = Diambuluisha dia muaba udi
editor-tab-help-short = Muaba udi
editor-tab-errors = Mapanga
editor-tab-warnings = Didimuija
editor-tab-info = Ngumu
editor-tab-accessibility = Difikila
editor-tab-responses = Mandamuna matume

editor-tab-with-count = { $label }: { $count }

editor-options = Disungula dia mufundi
editor-format-as-doenetml = Longolola bu DoenetML
editor-format-as-xml = Longolola bu XML


## The diagnostics panel

editor-diagnostic-line = Mulongo #{ $line }

editor-no-errors = Kakuena Mapanga
editor-no-warnings = Kakuena Didimuija
editor-no-info = Kakuena Ngumu

editor-show-info-annotations = Leja ngumu mu mufundi
editor-show-accessibility-annotations = Leja didimuija dia difikila mu mufundi

editor-accessibility-learn-more = Manya mudi Doenet ipima difikila

editor-accessibility-violations-heading = Mapita a difikila ({ $standard })

editor-accessibility-other-heading = Ntatu mikuabo ya difikila
editor-none-found = Kakuena cintu cisanganyibue


## Submitted responses

editor-no-responses = Kakuena mandamuna matume mpindieu
editor-response-answer-id = Cimanyinu cia Diandamuna
editor-response-response = Diandamuna
editor-response-credit = Manganyi
editor-response-submitted = Ditumibue


## The context-help panel

help-placeholder = Teka kalembelu ku dina dia tagi, ku cimanyinu, anyi ku { $ref } bua kupeta bifundilu.

help-unsupported-ref-chain = Diambuluisha ku bilejilu bia bitupa bia bungi bu { $example } kabivua bituadije.

help-unresolved-ref =
    { $reason ->
        [notFound] Kakuena cintu cisanganyibue ku cilejilu eci: { $ref }.
        [multiple] Bintu bia bungi bidi bisanganyibue ku cilejilu eci: { $ref }.
       *[indeterminate] Cidi { $ref } uleja kacimanyiki.
    }

help-learn-about-references = Manya bua bilejilu →
help-reference-page = Dibeji dia bilejilu →

help-suggestions-header =
    { $location ->
        [inside] Munda mua { $element }
       *[top] Kuulu menemene
    }{ $allowed ->
        [none] { " — kakuena cintu cidi mua kulua muno." }
        [text] { " — fundaku miaku muno." }
        [text-and-components] { " — fundaku miaku muno, anyi teta:" }
       *[components] { " — bitupa biudi mua kuteta:" }
    }

help-suggestions-footer = Kanda { $shortcut } bua kutangila bitupa bionso { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } udi uleja { $target }.
       *[other] { $ref } udi uleja { $target } (mulongo { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Cidi cifumina kudi { $owner } bu { $role }.
       *[other] Cidi cifumina kudi { $owner } ku mulongo { $line } bu { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } udi uleja cimanyinu { $property } cia { $element }.
       *[other] { $ref } udi uleja cimanyinu { $property } cia { $element } (mulongo { $line }).
    }

help-kind-attribute = cimanyinu
help-kind-snippet = kacitupa
help-kind-array-entry = dibueja mu mulongolodi

help-default = Cia tshiakadi:
help-active-default = Cia tshiakadi cidi cienza:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mbalu itabujibue (ku cintu cionso ku cionso):
       *[other] Mbalu itabujibue:
    }

help-suggested-values = Mbalu ilombola:

help-inserts = Udi ubueja:

help-coordinates =
    { $count ->
        [one] Cilejilu cia muaba:
       *[other] Bilejilu bia miaba:
    }

help-type = Mushindu:

help-resolved-style = Mushindu musanganyibue (styleNumber { $styleNumber }):

help-resolved-function-names = Mena a fonksio masanganyibue:
help-reset-list = Mulongolodi mupingaje ku dibueja edi:
help-added-on-input = Bibuejibue ku dibueja edi:
help-removed-on-input = Biumbushibue ku dibueja edi:

help-reset-overrides = { $reset } udi upita { $additional } ne { $removed }.
