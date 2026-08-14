# Dyula editor and language-server surfaces: the footer, the diagnostics panel,
# the variant picker, the accessibility button, and the context-help panel
# beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Segin
       *[update] Kura kɛ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Jirala
       *[other] { $word } Jirala { $shortcut }
    }


## The variant picker

editor-variant = Cogoya

editor-variant-filter = Woloma…

editor-variant-next = Cogoya nata woloma

editor-variant-previous = Cogoya tɛmɛnen woloma


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA sekokɔrɔ tɛmɛ sɔrɔla. A digi walisa ka sekokɔrɔ rapɔri { $action ->
            [close] datugu
           *[open] da wuli
        }.
        [advisories] A digi walisa ka sekokɔrɔ rapɔri { $action ->
            [close] datugu
           *[open] da wuli
        }. WCAG AA tɛmɛ ma sɔrɔ, nka lasɔmini wɛrɛw bɛ yen.
       *[clean] A digi walisa ka sekokɔrɔ rapɔri { $action ->
            [close] datugu
           *[open] da wuli
        }. Sekokɔrɔ gɛlɛya si ma sɔrɔ.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA sekokɔrɔ tɛmɛ sɔrɔla. { $count ->
            [one] WCAG AA tɛmɛ { $count } sɔrɔla
           *[other] WCAG AA tɛmɛ { $count } sɔrɔla
        }. A digi walisa ka sekokɔrɔ rapɔri { $action ->
            [close] datugu
           *[open] da wuli
        }.
        [advisories] WCAG AA tɛmɛ ma sɔrɔ. { $count ->
            [one] Sekokɔrɔ lasɔmini wɛrɛ { $count } sɔrɔla
           *[other] Sekokɔrɔ lasɔmini wɛrɛ { $count } sɔrɔla
        }. A digi walisa ka sekokɔrɔ rapɔri { $action ->
            [close] datugu
           *[open] da wuli
        }.
       *[clean] WCAG AA tɛmɛ ma sɔrɔ. A digi walisa ka sekokɔrɔ rapɔri { $action ->
            [close] datugu
           *[open] da wuli
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML cogoya { $version }

editor-tab-help = Yɔrɔ dɛmɛ
editor-tab-help-short = Yɔrɔ
editor-tab-errors = Filiw
editor-tab-warnings = Lasɔminiw
editor-tab-info = Kunnafoni
editor-tab-accessibility = Sekokɔrɔ
editor-tab-responses = Jaabi cilenw

editor-tab-with-count = { $label }: { $count }

editor-options = Sɛbɛnnikɛla wolomali
editor-format-as-doenetml = A labɛn i n'a fɔ DoenetML
editor-format-as-xml = A labɛn i n'a fɔ XML


## The diagnostics panel

editor-diagnostic-line = Layini #{ $line }

editor-no-errors = Fili Si Tɛ Yen
editor-no-warnings = Lasɔmini Si Tɛ Yen
editor-no-info = Kunnafoni Si Tɛ Yen

editor-show-info-annotations = Kunnafoni jira sɛbɛnnikɛla kɔnɔ
editor-show-accessibility-annotations = Sekokɔrɔ lasɔminiw jira sɛbɛnnikɛla kɔnɔ

editor-accessibility-learn-more = Doenet bɛ sekokɔrɔ suman cogo min na, o dɔn

editor-accessibility-violations-heading = Sekokɔrɔ tɛmɛw ({ $standard })

editor-accessibility-other-heading = Sekokɔrɔ gɛlɛya wɛrɛw
editor-none-found = Foyi ma sɔrɔ


## Submitted responses

editor-no-responses = Jaabi cilen si tɛ yen sisan
editor-response-answer-id = Jaabi tɔgɔ
editor-response-response = Jaabi
editor-response-credit = Pɔnw
editor-response-submitted = A cira


## The context-help panel

help-placeholder = Kursɔri bila tagi tɔgɔ, taamasere, walima { $ref } kan walisa ka sɛbɛnni sɔrɔ.

help-unsupported-ref-chain = Dɛmɛ min bɛ yɔrɔ caman jirali la i n'a fɔ { $example }, o ma damina fɔlɔ.

help-unresolved-ref =
    { $reason ->
        [notFound] Foyi ma sɔrɔ nin jirali la: { $ref }.
        [multiple] Fɛn caman sɔrɔla nin jirali la: { $ref }.
       *[indeterminate] { $ref } bɛ min jira, o ma dɔn.
    }

help-learn-about-references = Jiraliw kow dɔn →
help-reference-page = Jiraliw ɲɛ →

help-suggestions-header =
    { $location ->
        [inside] { $element } kɔnɔ
       *[top] Sanfɛla la
    }{ $allowed ->
        [none] { " — foyi tɛ se ka na yan." }
        [text] { " — kumaw sɛbɛn yan." }
        [text-and-components] { " — kumaw sɛbɛn yan, walima i ka nin lajɛ:" }
       *[components] { " — yɔrɔ minnu bɛ se ka lajɛ:" }
    }

help-suggestions-footer = { $shortcut } digi walisa ka yɔrɔ bɛɛ lajɛ { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } bɛ { $target } jira.
       *[other] { $ref } bɛ { $target } jira (layini { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] A bɔra { $owner } la i n'a fɔ { $role }.
       *[other] A bɔra { $owner } la layini { $line } kan i n'a fɔ { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } bɛ { $element } taamasere { $property } jira.
       *[other] { $ref } bɛ { $element } taamasere { $property } jira (layini { $line }).
    }

help-kind-attribute = taamasere
help-kind-snippet = yɔrɔnin
help-kind-array-entry = donni tulon kɔnɔ

help-default = Fɔlɔfɔlɔta:
help-active-default = Fɔlɔfɔlɔta min bɛ baara kɛ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Jate minnu daga (fɛn kelen-kelen bɛɛ kan):
       *[other] Jate minnu daga:
    }

help-suggested-values = Jate minnu fɔra:

help-inserts = A bɛ nin don:

help-coordinates =
    { $count ->
        [one] Yɔrɔ jirala:
       *[other] Yɔrɔw jiralaw:
    }

help-type = Suguya:

help-resolved-style = Cogoya sɔrɔlen (styleNumber { $styleNumber }):

help-resolved-function-names = Fɔnksiyɔn tɔgɔ sɔrɔlenw:
help-reset-list = Tulon segininen nin donni na:
help-added-on-input = Minnu farala nin donni na:
help-removed-on-input = Minnu bɔra nin donni na:

help-reset-overrides = { $reset } bɛ tɛmɛ { $additional } ni { $removed } kan.
