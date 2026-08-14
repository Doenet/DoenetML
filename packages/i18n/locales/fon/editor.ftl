# Fon editor and language-server surfaces. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and `styleNumber` are identifiers of
# the language and stay in English exactly as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Lɛ́ Bló
       *[update] Vɔ́ Bló
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Wemakpɔ́ntɔ́
       *[other] { $word } Wemakpɔ́ntɔ́ { $shortcut }
    }


## The variant picker

editor-variant = Alɔkpa

editor-variant-filter = Ba…

editor-variant-next = Cyán alɔkpa e bɔ dó é

editor-variant-previous = Cyán alɔkpa e jɛ nukɔ́n é


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] È mɔ gbigbà WCAG AA tɔ̀n. Zin bo { $action ->
            [close] sú
           *[open] hun
        } wema sisɛkpɔ́ tɔ̀n ɔ́.
        [advisories] Zin bo { $action ->
            [close] sú
           *[open] hun
        } wema sisɛkpɔ́ tɔ̀n ɔ́. È mɔ gbigbà WCAG AA tɔ̀n ɖé ǎ, amɔ̌ wěɖexámɛ sisɛkpɔ́ tɔ̀n ɖěvo lɛ́ ɖè.
       *[clean] Zin bo { $action ->
            [close] sú
           *[open] hun
        } wema sisɛkpɔ́ tɔ̀n ɔ́. È mɔ tagba sisɛkpɔ́ tɔ̀n ɖé ǎ.
    }

editor-accessibility-label =
    { $status ->
        [violations] È mɔ gbigbà WCAG AA tɔ̀n. È mɔ { $count ->
            [one] gbigbà WCAG AA tɔ̀n { $count }
           *[other] gbigbà WCAG AA tɔ̀n { $count }
        }. Zin bo { $action ->
            [close] sú
           *[open] hun
        } wema sisɛkpɔ́ tɔ̀n ɔ́.
        [advisories] È mɔ gbigbà WCAG AA tɔ̀n ɖé ǎ. È mɔ { $count ->
            [one] wěɖexámɛ sisɛkpɔ́ tɔ̀n ɖěvo { $count }
           *[other] wěɖexámɛ sisɛkpɔ́ tɔ̀n ɖěvo { $count }
        }. Zin bo { $action ->
            [close] sú
           *[open] hun
        } wema sisɛkpɔ́ tɔ̀n ɔ́.
       *[clean] È mɔ gbigbà WCAG AA tɔ̀n ɖé ǎ. Zin bo { $action ->
            [close] sú
           *[open] hun
        } wema sisɛkpɔ́ tɔ̀n ɔ́.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = Alɔdo tɛnmɛ tɔ̀n
editor-tab-help-short = Tɛnmɛ
editor-tab-errors = Nùwaɖókpɔ́ lɛ́
editor-tab-warnings = Gbeɖiɖe lɛ́
editor-tab-info = Nǔmɔnú
editor-tab-accessibility = Sisɛkpɔ́
editor-tab-responses = Xósin e è sɛ́dó lɛ́

editor-tab-with-count = { $label }: { $count }

editor-options = Wlantɔ́ sín nǔcyán lɛ́
editor-format-as-doenetml = Bló ɖi DoenetML
editor-format-as-xml = Bló ɖi XML


## The diagnostics panel

editor-diagnostic-line = Línu #{ $line }

editor-no-errors = Nùwaɖókpɔ́ Ðé Ǎ
editor-no-warnings = Gbeɖiɖe Ðé Ǎ
editor-no-info = Nǔmɔnú Ðé Ǎ

editor-show-info-annotations = Ðè nǔmɔnú lɛ́ xlɛ́ ɖò wlantɔ́ mɛ
editor-show-accessibility-annotations = Ðè tagba sisɛkpɔ́ tɔ̀n lɛ́ xlɛ́ ɖò wlantɔ́ mɛ

editor-accessibility-learn-more = Kplɔ́n lě Doenet nɔ kpé nukún dó sisɛkpɔ́ wú gbɔn é

editor-accessibility-violations-heading = Gbigbà sisɛkpɔ́ tɔ̀n lɛ́ ({ $standard })

editor-accessibility-other-heading = Tagba sisɛkpɔ́ tɔ̀n ɖěvo lɛ́
editor-none-found = È mɔ ɖé ǎ


## Submitted responses

editor-no-responses = È sɛ́ xósin ɖé dó kpɔ́n ǎ
editor-response-answer-id = Xósin sín nyikɔ́
editor-response-response = Xósin
editor-response-credit = Kɛ́ndɛ́
editor-response-submitted = È sɛ́dó


## The context-help panel

help-placeholder = Sɔ́ nùwlanwlantɛn ɔ́ dó tag sín nyikɔ́, attribute, alǒ { $ref } jí bo mɔ wěɖexámɛ.

help-unsupported-ref-chain = È má ko bló alɔdo nú akpáxwé gègě sín zɔnlin ɖi { $example } ǎ.

help-unresolved-ref =
    { $reason ->
        [notFound] È mɔ nǔ ɖé nú { $ref } ǎ.
        [multiple] È mɔ nǔ gègě nú { $ref }.
       *[indeterminate] È má sixú tuùn nǔ e { $ref } ɖɔ́ é ǎ.
    }

help-learn-about-references = Kplɔ́n nǔ dó zɔnlin lɛ́ wú →
help-reference-page = Wexwɛ wěɖexámɛ tɔ̀n →

help-suggestions-header =
    { $location ->
        [inside] Ðò { $element } mɛ
       *[top] Ðò wema ɔ́ tá
    }{ $allowed ->
        [none] { " — nǔ ɖé má yì fí ǎ." }
        [text] { " — wlan xógbe ɖò fí." }
        [text-and-components] { " — wlan xógbe ɖò fí, alǒ tɛ́n kpɔ́n:" }
       *[components] { " — nǔ e è sixú tɛ́n kpɔ́n lɛ́ é:" }
    }

help-suggestions-footer = Zin { $shortcut } bo kpɔ́n nǔ { $total } lɛ́ bǐ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } nyí zɔnlin ɖé yì { $target }.
       *[other] { $ref } nyí zɔnlin ɖé yì { $target } (línu { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } sɔ́ ɛ dó ɖi { $role }.
       *[other] { $owner } sɔ́ ɛ dó ɖò línu { $line } jí ɖi { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } nyí zɔnlin ɖé yì akpáxwé { $property } { $element } tɔ̀n.
       *[other] { $ref } nyí zɔnlin ɖé yì akpáxwé { $property } { $element } tɔ̀n (línu { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = akpáxwé
help-kind-array-entry = akpáxwé array tɔ̀n

help-default = Nǔ e ɖ'ayǐ é:
help-active-default = Nǔ e ɖ'ayǐ bo ɖò azɔ̌ wà wɛ é:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nǔ e è yí gbè ná lɛ́ é (ɖokpo nú nǔ ɖokpo):
       *[other] Nǔ e è yí gbè ná lɛ́ é:
    }

help-suggested-values = Nǔ e è ɖè xlɛ́ lɛ́ é:

help-inserts = É nɔ sɔ́ dó:

help-coordinates =
    { $count ->
        [one] Tɛnmɛ:
       *[other] Tɛnmɛ lɛ́:
    }

help-type = Alɔkpa:

help-resolved-style = Alɔkpa e è mɔ é (styleNumber { $styleNumber }):

help-resolved-function-names = Fonction sín nyikɔ́ e è mɔ lɛ́ é:
help-reset-list = Lɛ́ bló kplékplé ɔ́ ɖò input élɔ́ jí:
help-added-on-input = È sɔ́ dó ɖò input élɔ́ jí:
help-removed-on-input = È ɖè sín mɛ ɖò input élɔ́ jí:

help-reset-overrides = { $reset } nɔ ɖu { $additional } kpó { $removed } kpó jí.
