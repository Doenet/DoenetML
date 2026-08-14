# Kabiyè editor and language-server surfaces. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and `styleNumber` are identifiers of
# the language and stay in English exactly as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ñɔɔzɩ
       *[update] Lɛɣzɩ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Wɩlɩyʋ
       *[other] { $word } Wɩlɩyʋ { $shortcut }
    }


## The variant picker

editor-variant = Wɛtʋ

editor-variant-filter = Ñɩnɩ…

editor-variant-next = Lɩzɩ wɛtʋ ndʋ tɩkɔŋ yɔ

editor-variant-previous = Lɩzɩ wɛtʋ ndʋ tɩɖɛwa yɔ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Panawa WCAG AA talʋʋ paɣtʋ yɔɔ maʋ. Mabɩ nɛ { $action ->
            [close] tɔlɩ
           *[open] tʋlɩ
        } talʋʋ takayaɣ.
        [advisories] Mabɩ nɛ { $action ->
            [close] tɔlɩ
           *[open] tʋlɩ
        } talʋʋ takayaɣ. Patɩna WCAG AA paɣtʋ yɔɔ maʋ nabʋyʋ, ɛlɛ lɔŋ tasʋʋ lɛɛŋ wɛɛ talʋʋ yɔɔ.
       *[clean] Mabɩ nɛ { $action ->
            [close] tɔlɩ
           *[open] tʋlɩ
        } talʋʋ takayaɣ. Patɩna talʋʋ kʋñɔŋ nabʋyʋ.
    }

editor-accessibility-label =
    { $status ->
        [violations] Panawa WCAG AA talʋʋ paɣtʋ yɔɔ maʋ. Panawa { $count ->
            [one] WCAG AA paɣtʋ yɔɔ maʋ { $count }
           *[other] WCAG AA paɣtʋ yɔɔ maʋ { $count }
        }. Mabɩ nɛ { $action ->
            [close] tɔlɩ
           *[open] tʋlɩ
        } talʋʋ takayaɣ.
        [advisories] Patɩna WCAG AA paɣtʋ yɔɔ maʋ nabʋyʋ. Panawa { $count ->
            [one] lɔŋ tasʋʋ lɛɛkʋ { $count } talʋʋ yɔɔ
           *[other] lɔŋ tasʋʋ lɛɛŋ { $count } talʋʋ yɔɔ
        }. Mabɩ nɛ { $action ->
            [close] tɔlɩ
           *[open] tʋlɩ
        } talʋʋ takayaɣ.
       *[clean] Patɩna WCAG AA paɣtʋ yɔɔ maʋ nabʋyʋ. Mabɩ nɛ { $action ->
            [close] tɔlɩ
           *[open] tʋlɩ
        } talʋʋ takayaɣ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = Sɩnʋʋ ɖenɖe ŋwɛɛ yɔ
editor-tab-help-short = Ɖenɖe
editor-tab-errors = Kɩwɛɛkɩm
editor-tab-warnings = Paɣtʋ
editor-tab-info = Tɔm
editor-tab-accessibility = Talʋʋ
editor-tab-responses = Cosuu weyi patiyaa yɔ

editor-tab-with-count = { $label }: { $count }

editor-options = Mayʋ lɩzʋʋ
editor-format-as-doenetml = Ñɔɔzɩ ɛzɩ DoenetML
editor-format-as-xml = Ñɔɔzɩ ɛzɩ XML


## The diagnostics panel

editor-diagnostic-line = Ñɔʋ #{ $line }

editor-no-errors = Kɩwɛɛkɩm Fɛyɩ
editor-no-warnings = Paɣtʋ Fɛyɩ
editor-no-info = Tɔm Fɛyɩ

editor-show-info-annotations = Wɩlɩ tɔm mayʋ taa
editor-show-accessibility-annotations = Wɩlɩ talʋʋ kʋñɔmɩŋ mayʋ taa

editor-accessibility-learn-more = Kpɛlɩkɩ ɛzɩma Doenet ñakɩ pana talʋʋ yɔɔ yɔ

editor-accessibility-violations-heading = Talʋʋ paɣtʋ yɔɔ maʋ ({ $standard })

editor-accessibility-other-heading = Talʋʋ kʋñɔmɩŋ lɛɛŋ
editor-none-found = Patɩna nabʋyʋ


## Submitted responses

editor-no-responses = Patɩtiyi cosuu nabʋyʋ
editor-response-answer-id = Cosuu hɩɖɛ
editor-response-response = Cosuu
editor-response-credit = Kɩɖɛʋ
editor-response-submitted = Patiyaa


## The context-help panel

help-placeholder = Sɩɩ ñɔɔzɩyɛ tag hɩɖɛ, attribute, yaa { $ref } yɔɔ nɛ ŋna takayaɣ.

help-unsupported-ref-chain = Sɩnʋʋ tɔm ndʋ tɩwɛnɩ hɔɔlɩŋ sakɩyɛ ɛzɩ { $example } yɔ tɩtɩtalɩ.

help-unresolved-ref =
    { $reason ->
        [notFound] Patɩna nabʋyʋ { $ref } yɔɔ.
        [multiple] Pana pʋyʋ sakɩyɛ { $ref } yɔɔ.
       *[indeterminate] Patɩpɩzɩ nɛ pana { $ref } tɔbʋʋ.
    }

help-learn-about-references = Kpɛlɩkɩ tɔm ndʋ tɩñɔtɩnɩ nʋmɔŋ yɔ →
help-reference-page = Takayaɣ hɔɔlʋʋ →

help-suggestions-header =
    { $location ->
        [inside] { $element } taa
       *[top] Takayaɣ ñʋʋ taa
    }{ $allowed ->
        [none] { " — pʋyʋ nabʋyʋ ɛɛwɛɛ cɩnɛ." }
        [text] { " — ma tɔm cɩnɛ." }
        [text-and-components] { " — ma tɔm cɩnɛ, yaa maɣzɩ:" }
       *[components] { " — mbʋ ŋpɩzɩɣ ŋmaɣzɩ yɔ:" }
    }

help-suggestions-footer = Maɣ { $shortcut } nɛ ŋna pʋyʋ { $total } tɩŋa.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } kɛ nʋmɔʋ ŋgʋ kɩwolo { $target } yɔɔ yɔ.
       *[other] { $ref } kɛ nʋmɔʋ ŋgʋ kɩwolo { $target } yɔɔ yɔ (ñɔʋ { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } kɔnɩ-kʋ ɛzɩ { $role }.
       *[other] { $owner } kɔnɩ-kʋ ñɔʋ { $line } yɔɔ ɛzɩ { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } kɛ nʋmɔʋ ŋgʋ kɩwolo { $element } { $property } yɔɔ yɔ.
       *[other] { $ref } kɛ nʋmɔʋ ŋgʋ kɩwolo { $element } { $property } yɔɔ yɔ (ñɔʋ { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = hɔɔlʋʋ
help-kind-array-entry = array hɔɔlʋʋ

help-default = Ndʋ tɩwɛɛ yɔ:
help-active-default = Ndʋ tɩwɛɛ nɛ tɩlakɩ tʋmɩyɛ yɔ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mbʋ paha nʋmɔʋ yɔ (kʋɖʋm pʋyʋ kʋɖʋm yɔɔ):
       *[other] Mbʋ paha nʋmɔʋ yɔ:
    }

help-suggested-values = Mbʋ pɔtɔŋ se ŋlabɩ yɔ:

help-inserts = Pɩsʋʋnɩ:

help-coordinates =
    { $count ->
        [one] Ɖenɖe:
       *[other] Ɖenɖe:
    }

help-type = Wɛtʋ:

help-resolved-style = Wɛtʋ ndʋ pana yɔ (styleNumber { $styleNumber }):

help-resolved-function-names = Fɔŋksɩyɔŋ hɩla wena pana yɔ:
help-reset-list = Ñɔɔzɩ lɩzʋʋ input kʋnɛ kɩ-yɔɔ:
help-added-on-input = Pasʋsɩ input kʋnɛ kɩ-yɔɔ:
help-removed-on-input = Palɩzɩ input kʋnɛ kɩ-yɔɔ:

help-reset-overrides = { $reset } ɖɛɣnɩ { $additional } nɛ { $removed } nɔɔ.
