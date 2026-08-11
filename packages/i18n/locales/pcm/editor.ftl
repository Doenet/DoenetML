# Nigerian Pidgin editor and language-server surfaces. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and `styleNumber` are identifiers of
# the language and stay in English exactly as written — which in this catalog
# is a distinction that has to be made deliberately, since the prose around
# them is English-lexified too. `attribute` inside a sentence is the DoenetML
# word; `atribyut` is not used anywhere, so the seam stays visible.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Risẹt
       *[update] Updet
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Viwa
       *[other] { $word } Viwa { $shortcut }
    }


## The variant picker

editor-variant = Vẹriant

editor-variant-filter = Filta…

editor-variant-next = Pik di nẹks vẹriant

editor-variant-previous = Pik di vẹriant wey pass


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Wi si WCAG AA aksẹsibiliti vayolashọn. Klik make yu { $action ->
            [close] klos
           *[open] opin
        } di aksẹsibiliti ripọt.
        [advisories] Klik make yu { $action ->
            [close] klos
           *[open] opin
        } di aksẹsibiliti ripọt. Wi no si eni WCAG AA vayolashọn, bọt wi gẹt oda aksẹsibiliti advais.
       *[clean] Klik make yu { $action ->
            [close] klos
           *[open] opin
        } di aksẹsibiliti ripọt. Wi no si eni aksẹsibiliti wahala.
    }

editor-accessibility-label =
    { $status ->
        [violations] Wi si WCAG AA aksẹsibiliti vayolashọn. Wi si { $count ->
            [one] { $count } WCAG AA vayolashọn
           *[other] { $count } WCAG AA vayolashọn
        }. Klik make yu { $action ->
            [close] klos
           *[open] opin
        } di aksẹsibiliti ripọt.
        [advisories] Wi no si eni WCAG AA vayolashọn. Wi si { $count ->
            [one] { $count } oda aksẹsibiliti advais
           *[other] { $count } oda aksẹsibiliti advais
        }. Klik make yu { $action ->
            [close] klos
           *[open] opin
        } di aksẹsibiliti ripọt.
       *[clean] Wi no si eni WCAG AA vayolashọn. Klik make yu { $action ->
            [close] klos
           *[open] opin
        } di aksẹsibiliti ripọt.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML vẹrshọn { $version }

editor-tab-help = Hẹlp fọ wia yu dey
editor-tab-help-short = Kọntẹks
editor-tab-errors = Ẹra dem
editor-tab-warnings = Wọnin dem
editor-tab-info = Infọ
editor-tab-accessibility = Aksẹsibiliti
editor-tab-responses = Ansa wey dem sẹnd

editor-tab-with-count = { $label }: { $count }

editor-options = Ẹdita ọpshọn dem
editor-format-as-doenetml = Fọmat am as DoenetML
editor-format-as-xml = Fọmat am as XML


## The diagnostics panel

editor-diagnostic-line = Lain #{ $line }

editor-no-errors = No Ẹra
editor-no-warnings = No Wọnin
editor-no-info = No Infọ

editor-show-info-annotations = Sho infọ dem fọ di ẹdita
editor-show-accessibility-annotations = Sho aksẹsibiliti wahala dem fọ di ẹdita

editor-accessibility-learn-more = Lan haw Doenet dey handul aksẹsibiliti

editor-accessibility-violations-heading = Aksẹsibiliti vayolashọn dem ({ $standard })

editor-accessibility-other-heading = Oda aksẹsibiliti wahala dem
editor-none-found = Wi no si eni


## Submitted responses

editor-no-responses = Nobody don sẹnd ansa yẹt
editor-response-answer-id = Ansa Id
editor-response-response = Ansa
editor-response-credit = Krẹdit
editor-response-submitted = Dem sẹnd am


## The context-help panel

help-placeholder = Put yọ kọsọ fọ tag nem, attribute, ọ { $ref } make yu si di dọkyumẹnteshọn.

help-unsupported-ref-chain = Wi neva gẹt hẹlp fọ rẹfrẹns wey gẹt many pat lai { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Wi no si wetin { $ref } dey point to.
        [multiple] Wi si many tin wey { $ref } fit dey point to.
       *[indeterminate] Wi no fit sabi wetin { $ref } dey point to.
    }

help-learn-about-references = Lan about rẹfrẹns dem →
help-reference-page = Rẹfrẹns pej →

help-suggestions-header =
    { $location ->
        [inside] Insai { $element }
       *[top] Fọ di tọp lẹvul
    }{ $allowed ->
        [none] { " — nọtin dey go hia." }
        [text] { " — taip tẹks hia." }
        [text-and-components] { " — taip tẹks hia, ọ tray:" }
       *[components] { " — tin wey yu fit tray:" }
    }

help-suggestions-footer = Prẹs { $shortcut } make yu si ọl { $total } kọmponẹnt dem.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } na rẹfrẹns to { $target }.
       *[other] { $ref } na rẹfrẹns to { $target } (lain { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } bring am as { $role }.
       *[other] { $owner } bring am fọ lain { $line } as { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } na rẹfrẹns to di { $property } prọpati of { $element }.
       *[other] { $ref } na rẹfrẹns to di { $property } prọpati of { $element } (lain { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = snipẹt
help-kind-array-entry = array ẹntri

help-default = Difọlt:
help-active-default = Difọlt wey dey wọk:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valyu wey dem alaw (wan fọ ich aitẹm):
       *[other] Valyu wey dem alaw:
    }

help-suggested-values = Valyu wey wi dey sọjẹst:

help-inserts = E dey put:

help-coordinates =
    { $count ->
        [one] Kọọdinet:
       *[other] Kọọdinet dem:
    }

help-type = Taip:

help-resolved-style = Stail wey wi wọk aut (styleNumber { $styleNumber }):

help-resolved-function-names = Fọnkshọn nem wey wi wọk aut:
help-reset-list = Risẹt list fọ dis input:
help-added-on-input = Dem add am fọ dis input:
help-removed-on-input = Dem rimuv am fọ dis input:

help-reset-overrides = { $reset } dey ovarait { $additional } an { $removed }.
