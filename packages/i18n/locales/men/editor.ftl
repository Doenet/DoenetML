# Mende editor and language-server surfaces. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and `styleNumber` are identifiers of
# the language and stay in English exactly as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Wote gbɔma
       *[update] Yɛlɛ nina
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Gɛnɛmɔi
       *[other] { $word } Gɛnɛmɔi { $shortcut }
    }


## The variant picker

editor-variant = Wotela

editor-variant-filter = Gɔɔ…

editor-variant-next = Hɛnda wotela na wa woma

editor-variant-previous = Hɛnda wotela na wa ma


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ti WCAG AA majɔɔla sawa wɔlɔla majɔɔ. Tɔkpɔ kɔ bi { $action ->
            [close] gbɔkɔ
           *[open] gbɔyɔ
        } majɔɔla nyɛingɔi.
        [advisories] Tɔkpɔ kɔ bi { $action ->
            [close] gbɔkɔ
           *[open] gbɔyɔ
        } majɔɔla nyɛingɔi. Ti WCAG AA wɔlɔla gbi ii majɔɔ, kɛɛ majɔɔla ngiti gbesia ti lɔ.
       *[clean] Tɔkpɔ kɔ bi { $action ->
            [close] gbɔkɔ
           *[open] gbɔyɔ
        } majɔɔla nyɛingɔi. Ti majɔɔla hinda gbi ii majɔɔ.
    }

editor-accessibility-label =
    { $status ->
        [violations] Ti WCAG AA majɔɔla sawa wɔlɔla majɔɔ. Ti { $count ->
            [one] WCAG AA wɔlɔla { $count }
           *[other] WCAG AA wɔlɔla { $count }
        } majɔɔ. Tɔkpɔ kɔ bi { $action ->
            [close] gbɔkɔ
           *[open] gbɔyɔ
        } majɔɔla nyɛingɔi.
        [advisories] Ti WCAG AA wɔlɔla gbi ii majɔɔ. Ti { $count ->
            [one] majɔɔla ngiti gbe { $count }
           *[other] majɔɔla ngiti gbe { $count }
        } majɔɔ. Tɔkpɔ kɔ bi { $action ->
            [close] gbɔkɔ
           *[open] gbɔyɔ
        } majɔɔla nyɛingɔi.
       *[clean] Ti WCAG AA wɔlɔla gbi ii majɔɔ. Tɔkpɔ kɔ bi { $action ->
            [close] gbɔkɔ
           *[open] gbɔyɔ
        } majɔɔla nyɛingɔi.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML wotela { $version }

editor-tab-help = Ngiti bi lɔ ndɔlɔ na
editor-tab-help-short = Ndɔlɔ
editor-tab-errors = Hinda nyamusia
editor-tab-warnings = Ngiti wasia
editor-tab-info = Hugɔɔla
editor-tab-accessibility = Majɔɔla
editor-tab-responses = Njepeisia ti venga

editor-tab-with-count = { $label }: { $count }

editor-options = Nyɛingɔmɔi hɛndei
editor-format-as-doenetml = Yɛlɛ kɛ DoenetML
editor-format-as-xml = Yɛlɛ kɛ XML


## The diagnostics panel

editor-diagnostic-line = Laing #{ $line }

editor-no-errors = Hinda Nyamu Gbi Ii Lɔ
editor-no-warnings = Ngiti Wa Gbi Ii Lɔ
editor-no-info = Hugɔɔla Gbi Ii Lɔ

editor-show-info-annotations = Gɛnɛ hugɔɔla nyɛingɔmɔi hu
editor-show-accessibility-annotations = Gɛnɛ majɔɔla hindeisia nyɛingɔmɔi hu

editor-accessibility-learn-more = Gaa Doenet a majɔɔla gbɔɔ ji

editor-accessibility-violations-heading = Majɔɔla wɔlɔlasia ({ $standard })

editor-accessibility-other-heading = Majɔɔla hinda gbesia
editor-none-found = Hinda gbi ii majɔɔ


## Submitted responses

editor-no-responses = Numu gbi ii njepei ve kpɛlɛ
editor-response-answer-id = Njepei biyei
editor-response-response = Njepei
editor-response-credit = Ndoli
editor-response-submitted = Ti venga


## The context-help panel

help-placeholder = Wa nyɛingɔ tɔkpɔi tag biyei ma, attribute ma, ɔɔ { $ref } ma kɔ bi hugɔɔla majɔɔ.

help-unsupported-ref-chain = Ngiti gbua gbotoma hɛndeisia va kɛ { $example } ii lɔ kpɛlɛ.

help-unresolved-ref =
    { $reason ->
        [notFound] Ti hinda gbi ii majɔɔ { $ref } va.
        [multiple] Ti hindeisia gbotoma majɔɔ { $ref } va.
       *[indeterminate] Ti ii gula ti { $ref } hinda gɔɔ.
    }

help-learn-about-references = Gaa hɛndeisia ma →
help-reference-page = Hugɔɔla pej →

help-suggestions-header =
    { $location ->
        [inside] { $element } bu
       *[top] Buk woma ma
    }{ $allowed ->
        [none] { " — hinda gbi ii li mba." }
        [text] { " — nyɛingɔ njepe mba." }
        [text-and-components] { " — nyɛingɔ njepe mba, ɔɔ gɔɔ:" }
       *[components] { " — hindeisia bi gɔɔ:" }
    }

help-suggestions-footer = Tɔkpɔ { $shortcut } kɔ bi hindeisia { $total } kpɛlɛ gɛnɛ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } a hɛnde lɔ { $target } ma.
       *[other] { $ref } a hɛnde lɔ { $target } ma (laing { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } i wa a ngi kɛ { $role }.
       *[other] { $owner } i wa a ngi laing { $line } ma kɛ { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } a hɛnde lɔ { $element } ngi { $property } ma.
       *[other] { $ref } a hɛnde lɔ { $element } ngi { $property } ma (laing { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = gbua
help-kind-array-entry = array gbua

help-default = Na lɔ pili:
help-active-default = Na lɔ pili tao a yenge:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Hindeisia ti gula (yila hinda yila va):
       *[other] Hindeisia ti gula:
    }

help-suggested-values = Hindeisia ti ngiti:

help-inserts = A wa a:

help-coordinates =
    { $count ->
        [one] Ndɔlɔ:
       *[other] Ndɔlɔsia:
    }

help-type = Mɔla:

help-resolved-style = Mɔla ti majɔɔ (styleNumber { $styleNumber }):

help-resolved-function-names = Fɔnkshɔn biyeisia ti majɔɔ:
help-reset-list = Wote gbɔma nyɛingɔi input ji ma:
help-added-on-input = Ti gbua input ji ma:
help-removed-on-input = Ti wumbu input ji ma:

help-reset-overrides = { $reset } a { $additional } kɛ { $removed } wumbu.
