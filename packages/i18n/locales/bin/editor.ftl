# Bini editor and language-server surfaces. Translated from
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
# See `content.ftl`'s header for the family classification (Edoid,
# Niger-Congo, Volta-Niger), the no-agreement finding, and the loanword
# strategy for editor/LSP vocabulary this seed has no settled Bini coinage
# for.
#
# Intl.PluralRules('bin') gives `one` and `other`; a countable message here
# keeps both branches (see `editor-accessibility-label`'s nested { $count }
# selects), unlike Yoruba's single-category catalog which collapses them.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Gele Ye Efe
       *[update] Gele
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Owanrẹn
       *[other] { $word } Owanrẹn { $shortcut }
    }


## The variant picker

editor-variant = Irẹnkẹn
editor-variant-filter = Miẹn...
editor-variant-next = Rhie irẹnkẹn ọvbehe
editor-variant-previous = Rhie irẹnkẹn ọni


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] A miẹn efian WCAG AA. Kie ne u { $action ->
            [close] mudia
           *[open] wa
        } ekhọe ne oghẹ khẹke sẹ.
        [advisories] Kie ne u { $action ->
            [close] mudia
           *[open] wa
        } ekhọe ne oghẹ khẹke sẹ. A i miẹn efian WCAG AA ọkpa ọsọ, sokẹ ẹmwẹ ọvbehe eso ne oghẹ khẹke sẹ rre.
       *[clean] Kie ne u { $action ->
            [close] mudia
           *[open] wa
        } ekhọe ne oghẹ khẹke sẹ. A i miẹn ekhọe ọkpa ọsọ.
    }

editor-accessibility-label =
    { $status ->
        [violations] A miẹn efian WCAG AA. { $count ->
            [one] Efian WCAG AA { $count }
           *[other] Efian WCAG AA { $count }
        } nọ a miẹn. Kie ne u { $action ->
            [close] mudia
           *[open] wa
        } ekhọe ne oghẹ khẹke sẹ.
        [advisories] A i miẹn efian WCAG AA ọkpa ọsọ. { $count ->
            [one] Ẹmwẹ ọvbehe { $count } ne oghẹ khẹke sẹ
           *[other] Ẹmwẹ ọvbehe { $count } ne oghẹ khẹke sẹ
        } nọ a miẹn. Kie ne u { $action ->
            [close] mudia
           *[open] wa
        } ekhọe ne oghẹ khẹke sẹ.
       *[clean] A i miẹn efian WCAG AA ọkpa ọsọ. Kie ne u { $action ->
            [close] mudia
           *[open] wa
        } ekhọe ne oghẹ khẹke sẹ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Ẹdẹ DoenetML { $version }

editor-tab-help = Ọsagbọn nọ danmwẹhọ ye ọtọ
editor-tab-help-short = Ọtọ
editor-tab-errors = Efian
editor-tab-warnings = Ivbieka
editor-tab-info = Ikuẹdẹ
editor-tab-accessibility = Oghẹ nọ khẹke sẹ
editor-tab-responses = Ọre nọ a rhie hia

editor-tab-with-count = { $label }: { $count }

editor-options = Ọya nọ khẹke sẹ ne editor
editor-format-as-doenetml = Ye odẹ ye DoenetML
editor-format-as-xml = Ye odẹ ye XML


## The diagnostics panel

editor-diagnostic-line = Ẹfẹ #{ $line }

editor-no-errors = Efian I Rre
editor-no-warnings = Ivbieka I Rre
editor-no-info = Ikuẹdẹ Diagnostic I Rre

editor-show-info-annotations = Rhie ikuẹdẹ diagnostic ye miẹn vbe editor
editor-show-accessibility-annotations = Rhie oghẹ khẹke sẹ diagnostic ye miẹn vbe editor

editor-accessibility-learn-more = Sagbọn odẹ Doenet ni ru vbe oghẹ nọ khẹke sẹ

editor-accessibility-violations-heading = Efian oghẹ khẹke sẹ ({ $standard })

editor-accessibility-other-heading = Ekhọe oghẹ khẹke sẹ ọvbehe
editor-none-found = A i miẹn emwin ọkpa


## Submitted responses

editor-no-responses = Ọre i ke rre nian
editor-response-answer-id = Uni Ọre
editor-response-response = Ọre
editor-response-credit = Kirediti
editor-response-submitted = A rhie ẹre


## The context-help panel

help-placeholder = Ye ọtọ vbe uni owa, ànímọ́, yana { $ref } ne ekhọe.

help-unsupported-ref-chain = Ọsagbọn ne emwin nọ danmwẹhọ ye eso bii { $example } i ke rre.

help-unresolved-ref =
    { $reason ->
        [notFound] A i miẹn emwin nọ hia ne emwin nọ ru: { $ref }.
        [multiple] A miẹn emwin nọ hin ọkpa nọ hia ne emwin nọ ru: { $ref }.
       *[indeterminate] A i sẹtin gbaroko emwin nọ { $ref } ru.
    }

help-learn-about-references = Sagbọn odẹ emwin nọ ru ni ru →
help-reference-page = Ọwagbe ekhọe emwin nọ ru →

help-suggestions-header =
    { $location ->
        [inside] Evbare { $element }
       *[top] Vbe ẹfẹnrẹn
    }{ $allowed ->
        [none] { " — emwin ọkpa i rre vbe ọni." }
        [text] { " — kha ẹmwẹ vbe ọni." }
        [text-and-components] { " — kha ẹmwẹ vbe ọni, yana miẹn:" }
       *[components] { " — emwin ni u sẹtin miẹn:" }
    }

help-suggestions-footer = Kie { $shortcut } ne u miẹn owa { $total } hia.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } rrọọ emwin nọ ru { $target }.
       *[other] { $ref } rrọọ emwin nọ ru { $target } (ẹfẹ { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ye ẹre rre ye { $role }.
       *[other] { $owner } ye ẹre rre vbe ẹfẹ { $line } ye { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } rrọọ emwin nọ ru ànímọ́ { $property } ti { $element }.
       *[other] { $ref } rrọọ emwin nọ ru ànímọ́ { $property } ti { $element } (ẹfẹ { $line }).
    }

help-kind-attribute = ànímọ́
help-kind-snippet = ọya ọfoworhọ
help-kind-array-entry = uni ke uni akójọ

help-default = Nọkiekie:
help-active-default = Nọkiekie nọ ru:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Iye nọ a ru (ọkpa ne emwin kevbekevbe):
       *[other] Iye nọ a ru:
    }

help-suggested-values = Iye nọ a hoẹmwẹ:

help-inserts = Ọ gha gie:

help-coordinates =
    { $count ->
        [one] Ọya:
       *[other] Ọya:
    }

help-type = Irẹnkẹn:

help-resolved-style = Ọya nọ a gbaroko (styleNumber { $styleNumber }):

help-resolved-function-names = Uni ọsẹ nọ a gbaroko:
help-reset-list = Akójọ nọ a gele ye efe vbe ighiẹnrhan nan:
help-added-on-input = Emwin nọ a gie vbe ighiẹnrhan nan:
help-removed-on-input = Emwin nọ a fian vbe ighiẹnrhan nan:

# The three names are attributes an author writes, so they stay as written.
help-reset-overrides = { $reset } gbaroko sẹ { $additional } kevbe { $removed }.
