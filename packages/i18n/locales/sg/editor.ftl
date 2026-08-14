# Sango editor and language-server surfaces: the footer, the diagnostics panel,
# the variant picker, the accessibility button, and the context-help panel
# beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# The counted branches inside `editor-accessibility-label` are flat, because
# Sango has exactly one plural category; see `content.ftl`'s header.
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Kîri na tërê
       *[update] Fîni
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Wafängö-ye
       *[other] { $word } Wafängö-ye { $shortcut }
    }


## The variant picker

editor-variant = Marä

editor-variant-filter = Gï…

editor-variant-next = Soro marä so ayeke na pekô

editor-variant-previous = Soro marä so ahön


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] A wara fütïngö WCAG AA tî sïngö. Pîka tî { $action ->
            [close] kânga
           *[open] zi
        } rapôro tî sïngö.
        [advisories] Pîka tî { $action ->
            [close] kânga
           *[open] zi
        } rapôro tî sïngö. A wara fütïngö WCAG AA pëpe, me awango ndê tî sïngö ayeke dâ.
       *[clean] Pîka tî { $action ->
            [close] kânga
           *[open] zi
        } rapôro tî sïngö. A wara akpälë tî sïngö pëpe.
    }

editor-accessibility-label =
    { $status ->
        [violations] A wara fütïngö WCAG AA tî sïngö. A wara afütïngö WCAG AA { $count }. Pîka tî { $action ->
            [close] kânga
           *[open] zi
        } rapôro tî sïngö.
        [advisories] A wara fütïngö WCAG AA pëpe. A wara awango ndê tî sïngö { $count }. Pîka tî { $action ->
            [close] kânga
           *[open] zi
        } rapôro tî sïngö.
       *[clean] A wara fütïngö WCAG AA pëpe. Pîka tî { $action ->
            [close] kânga
           *[open] zi
        } rapôro tî sïngö.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Vêrsïon tî DoenetML { $version }

editor-tab-help = Mängö-maboko tî ndo
editor-tab-help-short = Ndo
editor-tab-errors = Afîon
editor-tab-warnings = Agbotöngö-mê
editor-tab-info = Tënë
editor-tab-accessibility = Sïngö
editor-tab-responses = Akîri-tënë so a tokua

editor-tab-with-count = { $label }: { $count }

editor-options = Asorongö tî wasûngö-mbëtï
editor-format-as-doenetml = Leke tongana DoenetML
editor-format-as-xml = Leke tongana XML


## The diagnostics panel

editor-diagnostic-line = Lignë #{ $line }

editor-no-errors = Afîon ayeke pëpe
editor-no-warnings = Agbotöngö-mê ayeke pëpe
editor-no-info = Tënë ayeke pëpe

editor-show-info-annotations = Fa tënë na yâ tî wasûngö-mbëtï
editor-show-accessibility-annotations = Fa agbotöngö-mê tî sïngö na yâ tî wasûngö-mbëtï

editor-accessibility-learn-more = Manda tongana nye Doenet abâa sïngö

editor-accessibility-violations-heading = Afütïngö tî sïngö ({ $standard })

editor-accessibility-other-heading = Ambênî akpälë tî sïngö
editor-none-found = A wara mbênî ye pëpe


## Submitted responses

editor-no-responses = Akîri-tënë so a tokua ayeke dâ pëpe fadësô
editor-response-answer-id = Aidi tî Kîri-tënë
editor-response-response = Kîri-tënë
editor-response-credit = Apoin
editor-response-submitted = A tokua


## The context-help panel

help-placeholder = Zîa kürsëre na ndö tî îri tî tâge, atribïi, wala { $ref } tî wara mbëtï.

help-unsupported-ref-chain = Mängö-maboko tî afängö-ndo tî ambâgë mîngi tongana { $example } ayeke dâ fadësô pëpe.

help-unresolved-ref =
    { $reason ->
        [notFound] A wara mbênî ye pëpe na ndö tî fängö-ndo sô: { $ref }.
        [multiple] A wara aye mîngi na ndö tî fängö-ndo sô: { $ref }.
       *[indeterminate] Ye so { $ref } afa alîngbi tî hînga pëpe.
    }

help-learn-about-references = Manda na ndö tî afängö-ndo →
help-reference-page = Lêmbëtï tî fängö-ndo →

help-suggestions-header =
    { $location ->
        [inside] Na yâ tî { $element }
       *[top] Na ndö tî aye kûê
    }{ $allowed ->
        [none] { " — mbênî ye ague ge pëpe." }
        [text] { " — sû mbëtï ge." }
        [text-and-components] { " — sû mbëtï ge, wala tara:" }
       *[components] { " — aye so mo lîngbi tî tara:" }
    }

help-suggestions-footer = Pîka { $shortcut } tî bâa ambâgë kûê { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ayeke fängö-ndo tî { $target }.
       *[other] { $ref } ayeke fängö-ndo tî { $target } (lignë { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } aga na nî tongana { $role }.
       *[other] { $owner } aga na nî na lignë { $line } tongana { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ayeke fängö-ndo tî atribïi { $property } tî { $element }.
       *[other] { $ref } ayeke fängö-ndo tî atribïi { $property } tî { $element } (lignë { $line }).
    }

help-kind-attribute = atribïi
help-kind-snippet = kete mbâgë
help-kind-array-entry = lïngö na yâ tî mölöngö

help-default = Tî gîgî:
help-active-default = Tî gîgî so ayeke sâra kua:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Awüngö so ayeke nzönî (ôko na ye ôko ôko):
       *[other] Awüngö so ayeke nzönî:
    }

help-suggested-values = Awüngö so a mû wango na nî:

help-inserts = A lï:

help-coordinates = Fängö-ndo:

help-type = Marä:

help-resolved-style = Stîle so a wara (styleNumber { $styleNumber }):

help-resolved-function-names = Aîri tî kua so a wara:
help-reset-list = Mölöngö so a kîri na tërê na lïngö sô:
help-added-on-input = Ye so a zîa na lïngö sô:
help-removed-on-input = Ye so a zî na lïngö sô:

help-reset-overrides = { $reset } ahön { $additional } na { $removed }.
