# Ga editor and language-server surfaces: the footer, the diagnostics panel,
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
        [reset] Kumɔ ekoŋŋ
       *[update] Tsakemɔ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Tsɔɔlɔ
       *[other] { $word } Tsɔɔlɔ { $shortcut }
    }


## The variant picker

editor-variant = Sui

editor-variant-filter = Halamɔ…

editor-variant-next = Halamɔ sui ni nyiɛ sɛɛ

editor-variant-previous = Halamɔ sui ni tsɔ hiɛ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ana WCAG AA shɛmɔ he tɔmɔ. Nyɛmɔ ni o{ $action ->
            [close] ŋa
           *[open] gbele
        } shɛmɔ he amaniɛbɔɔ lɛ.
        [advisories] Nyɛmɔ ni o{ $action ->
            [close] ŋa
           *[open] gbele
        } shɛmɔ he amaniɛbɔɔ lɛ. Anaaa WCAG AA tɔmɔ ko, shi kɔkɔbɔɔi krokomɛi yɔɔ.
       *[clean] Nyɛmɔ ni o{ $action ->
            [close] ŋa
           *[open] gbele
        } shɛmɔ he amaniɛbɔɔ lɛ. Anaaa shɛmɔ he naagba ko.
    }

editor-accessibility-label =
    { $status ->
        [violations] Ana WCAG AA shɛmɔ he tɔmɔ. { $count ->
            [one] Ana WCAG AA tɔmɔ { $count }
           *[other] Ana WCAG AA tɔmɔi { $count }
        }. Nyɛmɔ ni o{ $action ->
            [close] ŋa
           *[open] gbele
        } shɛmɔ he amaniɛbɔɔ lɛ.
        [advisories] Anaaa WCAG AA tɔmɔ ko. { $count ->
            [one] Ana shɛmɔ he kɔkɔbɔɔ kroko { $count }
           *[other] Ana shɛmɔ he kɔkɔbɔɔi krokomɛi { $count }
        }. Nyɛmɔ ni o{ $action ->
            [close] ŋa
           *[open] gbele
        } shɛmɔ he amaniɛbɔɔ lɛ.
       *[clean] Anaaa WCAG AA tɔmɔ ko. Nyɛmɔ ni o{ $action ->
            [close] ŋa
           *[open] gbele
        } shɛmɔ he amaniɛbɔɔ lɛ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML sui { $version }

editor-tab-help = He lɛ he yelikɛbuamɔ
editor-tab-help-short = He lɛ
editor-tab-errors = Tɔmɔi
editor-tab-warnings = Kɔkɔbɔɔi
editor-tab-info = Saji
editor-tab-accessibility = Shɛmɔ
editor-tab-responses = Hetooi ni amaje

editor-tab-with-count = { $label }: { $count }

editor-options = Ŋmalɔ hilɛmɔi
editor-format-as-doenetml = Saa lɛ tamɔ DoenetML
editor-format-as-xml = Saa lɛ tamɔ XML


## The diagnostics panel

editor-diagnostic-line = Laiŋi #{ $line }

editor-no-errors = Tɔmɔ Ko Bɛ
editor-no-warnings = Kɔkɔbɔɔ Ko Bɛ
editor-no-info = Sane Ko Bɛ

editor-show-info-annotations = Tsɔɔmɔ saji yɛ ŋmalɔ lɛ mli
editor-show-accessibility-annotations = Tsɔɔmɔ shɛmɔ he kɔkɔbɔɔi yɛ ŋmalɔ lɛ mli

editor-accessibility-learn-more = Kasemɔ bɔ ni Doenet susuɔ shɛmɔ ehaa

editor-accessibility-violations-heading = Shɛmɔ he tɔmɔi ({ $standard })

editor-accessibility-other-heading = Shɛmɔ he naagbai krokomɛi
editor-none-found = Anaaa nɔ ko


## Submitted responses

editor-no-responses = Hetoo ni amaje ko bɛ amrɔ nɛɛ
editor-response-answer-id = Hetoo gbɛi
editor-response-response = Hetoo
editor-response-credit = Pɔintsii
editor-response-submitted = Amaje lɛ


## The context-help panel

help-placeholder = Kɛ kɔɔsɔ lɛ maa tagi gbɛi, okadi, loo { $ref } nɔ koni oná ŋmalɛi.

help-unsupported-ref-chain = Yelikɛbuamɔ ni kɔɔ fãi babaoo tsɔɔmɔ he tamɔ { $example } ejeko shishi.

help-unresolved-ref =
    { $reason ->
        [notFound] Anaaa nɔ ko yɛ tsɔɔmɔ nɛɛ he: { $ref }.
        [multiple] Ana nibii babaoo yɛ tsɔɔmɔ nɛɛ he: { $ref }.
       *[indeterminate] Nɔ ni { $ref } tsɔɔ lɛ aleee.
    }

help-learn-about-references = Kasemɔ tsɔɔmɔi ahe →
help-reference-page = Tsɔɔmɔi abaafa →

help-suggestions-header =
    { $location ->
        [inside] { $element } mli
       *[top] Yiteŋ lolo
    }{ $allowed ->
        [none] { " — nɔ ko nyɛŋ aba biɛ." }
        [text] { " — ŋmaa wiemɔi biɛ." }
        [text-and-components] { " — ŋmaa wiemɔi biɛ, loo okwɛ:" }
       *[components] { " — fãi ni obaanyɛ okwɛ:" }
    }

help-suggestions-footer = Nyɛmɔ { $shortcut } koni okwɛ fãi fɛɛ { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } tsɔɔ { $target }.
       *[other] { $ref } tsɔɔ { $target } (laiŋi { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ejɛ { $owner } dɛŋ tamɔ { $role }.
       *[other] Ejɛ { $owner } dɛŋ yɛ laiŋi { $line } nɔ tamɔ { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } tsɔɔ { $element } okadi { $property }.
       *[other] { $ref } tsɔɔ { $element } okadi { $property } (laiŋi { $line }).
    }

help-kind-attribute = okadi
help-kind-snippet = fã bibioo
help-kind-array-entry = wobɔɔ yɛ gbɛjianɔtoo mli

help-default = Nɔ ni yɔɔ jeŋmaa:
help-active-default = Nɔ ni yɔɔ jeŋmaa ni tsuɔ nii:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Yibɔi ni aŋmɛ gbɛ (nɔ fɛɛ nɔ nɔ):
       *[other] Yibɔi ni aŋmɛ gbɛ:
    }

help-suggested-values = Yibɔi ni awo:

help-inserts = Ewoɔ:

help-coordinates =
    { $count ->
        [one] He tsɔɔlɔ:
       *[other] Hei atsɔɔlɔi:
    }

help-type = Sui:

help-resolved-style = Sui ni ana (styleNumber { $styleNumber }):

help-resolved-function-names = Fɔŋkshɔn gbɛii ni ana:
help-reset-list = Gbɛjianɔtoo ni aku sɛɛ yɛ wobɔɔ nɛɛ he:
help-added-on-input = Nɔ ni afata he yɛ wobɔɔ nɛɛ he:
help-removed-on-input = Nɔ ni ajie yɛ wobɔɔ nɛɛ he:

help-reset-overrides = { $reset } teɔ { $additional } kɛ { $removed } nɔ.
