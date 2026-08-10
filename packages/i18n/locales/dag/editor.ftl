# Dagbani editor and language-server surfaces: the footer, the diagnostics
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
        [reset] Labsim
       *[update] Palli
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Wuhira
       *[other] { $word } Wuhira { $shortcut }
    }


## The variant picker

editor-variant = Balli

editor-variant-filter = Piihi…

editor-variant-next = Piihi balli din pahi

editor-variant-previous = Piihi balli din daŋ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Bɛ nya WCAG AA paabu taali. Nyɛbi ka { $action ->
            [close] yɔhi
           *[open] yooi
        } paabu lahabali maa.
        [advisories] Nyɛbi ka { $action ->
            [close] yɔhi
           *[open] yooi
        } paabu lahabali maa. Bɛ bi nya WCAG AA taali, amaa kpahimbu shɛŋa be.
       *[clean] Nyɛbi ka { $action ->
            [close] yɔhi
           *[open] yooi
        } paabu lahabali maa. Bɛ bi nya paabu yɛltɔɣa shɛli.
    }

editor-accessibility-label =
    { $status ->
        [violations] Bɛ nya WCAG AA paabu taali. { $count ->
            [one] Bɛ nya WCAG AA taali { $count }
           *[other] Bɛ nya WCAG AA taya { $count }
        }. Nyɛbi ka { $action ->
            [close] yɔhi
           *[open] yooi
        } paabu lahabali maa.
        [advisories] Bɛ bi nya WCAG AA taali. { $count ->
            [one] Bɛ nya paabu kpahimbu shɛli { $count }
           *[other] Bɛ nya paabu kpahimbu shɛŋa { $count }
        }. Nyɛbi ka { $action ->
            [close] yɔhi
           *[open] yooi
        } paabu lahabali maa.
       *[clean] Bɛ bi nya WCAG AA taali. Nyɛbi ka { $action ->
            [close] yɔhi
           *[open] yooi
        } paabu lahabali maa.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML balli { $version }

editor-tab-help = Luɣili sɔŋsim
editor-tab-help-short = Luɣili
editor-tab-errors = Taya
editor-tab-warnings = Kpahimbu
editor-tab-info = Lahabali
editor-tab-accessibility = Paabu
editor-tab-responses = Lahabali din tim

editor-tab-with-count = { $label }: { $count }

editor-options = Sabira piihibu
editor-format-as-doenetml = Mali kaman DoenetML
editor-format-as-xml = Mali kaman XML


## The diagnostics panel

editor-diagnostic-line = Layin #{ $line }

editor-no-errors = Taya Ka Ni
editor-no-warnings = Kpahimbu Ka Ni
editor-no-info = Lahabali Ka Ni

editor-show-info-annotations = Wuhi lahabali sabira ni
editor-show-accessibility-annotations = Wuhi paabu kpahimbu sabira ni

editor-accessibility-learn-more = Baŋ Doenet ni yuli paabu shɛm

editor-accessibility-violations-heading = Paabu taya ({ $standard })

editor-accessibility-other-heading = Paabu yɛltɔɣa shɛŋa
editor-none-found = Bɛ bi nya shɛli


## Submitted responses

editor-no-responses = Lahabali din tim ka ni pumpɔŋɔ
editor-response-answer-id = Lahabali maka
editor-response-response = Lahabali
editor-response-credit = Pɔyintnima
editor-response-submitted = Bɛ tim li


## The context-help panel

help-placeholder = Zaŋmi kɔsɔ n-niŋ tagi yuli, maka, bee { $ref } zuɣu ka nya sabbu.

help-unsupported-ref-chain = Sɔŋsim din chaŋ pirigili pam wuhibu kaman { $example } na bi pili.

help-unresolved-ref =
    { $reason ->
        [notFound] Bɛ bi nya shɛli ni wuhibu ŋɔ: { $ref }.
        [multiple] Bɛ nya binshɛŋa pam ni wuhibu ŋɔ: { $ref }.
       *[indeterminate] Din { $ref } wuhira ka bɛ mi.
    }

help-learn-about-references = Baŋ wuhibunima yɛla →
help-reference-page = Wuhibunima peji →

help-suggestions-header =
    { $location ->
        [inside] { $element } ni
       *[top] Zuɣusaa
    }{ $allowed ->
        [none] { " — shɛli ku tooi kana kpe." }
        [text] { " — sabimi yɛtɔɣa kpe." }
        [text-and-components] { " — sabimi yɛtɔɣa kpe, bee a dihi:" }
       *[components] { " — pirigilinima a ni tooi dihi:" }
    }

help-suggestions-footer = Nyɛbi { $shortcut } ka nya pirigilinima zaa { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } wuhirila { $target }.
       *[other] { $ref } wuhirila { $target } (layin { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Di yila { $owner } sani kaman { $role }.
       *[other] Di yila { $owner } sani layin { $line } zuɣu kaman { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } wuhirila { $element } maka { $property }.
       *[other] { $ref } wuhirila { $element } maka { $property } (layin { $line }).
    }

help-kind-attribute = maka
help-kind-snippet = pirigili bila
help-kind-array-entry = kpɛhibu tarima ni

help-default = Din daa be:
help-active-default = Din daa be ka tuma:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Kalinli din saɣi (binshɛɣu kam zuɣu):
       *[other] Kalinli din saɣi:
    }

help-suggested-values = Kalinli din wuhi:

help-inserts = Di kpɛhirila:

help-coordinates =
    { $count ->
        [one] Luɣili wuhira:
       *[other] Luɣisi wuhira:
    }

help-type = Balli:

help-resolved-style = Balli din nya (styleNumber { $styleNumber }):

help-resolved-function-names = Fɔnkshɔn yula din nya:
help-reset-list = Tarima din labsi ni kpɛhibu ŋɔ:
help-added-on-input = Din pahi ni kpɛhibu ŋɔ:
help-removed-on-input = Din yihi ni kpɛhibu ŋɔ:

help-reset-overrides = { $reset } gari { $additional } ni { $removed }.
