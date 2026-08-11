# Krio editor and language-server surfaces. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and `styleNumber` are identifiers of
# the language and stay in English exactly as written. Krio's phonemic spelling
# makes that seam easy to see here: an identifier like `styleNumber` keeps its
# English spelling inside a sentence, and everything spelt Krio around it —
# «atribyut», «snipɛt» — is prose.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Risɛt
       *[update] Updet
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Viwa
       *[other] { $word } Viwa { $shortcut }
    }


## The variant picker

editor-variant = Vɛriant

editor-variant-filter = Filta…

editor-variant-next = Pik di nɛks vɛriant

editor-variant-previous = Pik di vɛriant we dɔn pas


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Wi si WCAG AA aksɛsibiliti vayoleshɔn. Klik fɔ { $action ->
            [close] klos
           *[open] opin
        } di aksɛsibiliti ripɔt.
        [advisories] Klik fɔ { $action ->
            [close] klos
           *[open] opin
        } di aksɛsibiliti ripɔt. Wi nɔ si ɛni WCAG AA vayoleshɔn, bɔt wi gɛt ɔda aksɛsibiliti advays.
       *[clean] Klik fɔ { $action ->
            [close] klos
           *[open] opin
        } di aksɛsibiliti ripɔt. Wi nɔ si ɛni aksɛsibiliti trɔbul.
    }

editor-accessibility-label =
    { $status ->
        [violations] Wi si WCAG AA aksɛsibiliti vayoleshɔn. Wi si { $count ->
            [one] { $count } WCAG AA vayoleshɔn
           *[other] { $count } WCAG AA vayoleshɔn
        }. Klik fɔ { $action ->
            [close] klos
           *[open] opin
        } di aksɛsibiliti ripɔt.
        [advisories] Wi nɔ si ɛni WCAG AA vayoleshɔn. Wi si { $count ->
            [one] { $count } ɔda aksɛsibiliti advays
           *[other] { $count } ɔda aksɛsibiliti advays
        }. Klik fɔ { $action ->
            [close] klos
           *[open] opin
        } di aksɛsibiliti ripɔt.
       *[clean] Wi nɔ si ɛni WCAG AA vayoleshɔn. Klik fɔ { $action ->
            [close] klos
           *[open] opin
        } di aksɛsibiliti ripɔt.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML vɛrshɔn { $version }

editor-tab-help = Ɛlp fɔ usay yu de
editor-tab-help-short = Kɔntɛks
editor-tab-errors = Ɛra dɛn
editor-tab-warnings = Wɔnin dɛn
editor-tab-info = Infɔ
editor-tab-accessibility = Aksɛsibiliti
editor-tab-responses = Ansa we dɛn sɛn

editor-tab-with-count = { $label }: { $count }

editor-options = Ɛdita ɔpshɔn dɛn
editor-format-as-doenetml = Fɔmat am lɛk DoenetML
editor-format-as-xml = Fɔmat am lɛk XML


## The diagnostics panel

editor-diagnostic-line = Layn #{ $line }

editor-no-errors = Nɔ Ɛra
editor-no-warnings = Nɔ Wɔnin
editor-no-info = Nɔ Infɔ

editor-show-info-annotations = Sho di infɔ dɛn na di ɛdita
editor-show-accessibility-annotations = Sho di aksɛsibiliti trɔbul dɛn na di ɛdita

editor-accessibility-learn-more = Lan aw Doenet de tek kia ɔf aksɛsibiliti

editor-accessibility-violations-heading = Aksɛsibiliti vayoleshɔn dɛn ({ $standard })

editor-accessibility-other-heading = Ɔda aksɛsibiliti trɔbul dɛn
editor-none-found = Wi nɔ si ɛni


## Submitted responses

editor-no-responses = Nɔbɔdi nɔ sɛn ansa yet
editor-response-answer-id = Ansa Id
editor-response-response = Ansa
editor-response-credit = Krɛdit
editor-response-submitted = Dɛn sɛn am


## The context-help panel

help-placeholder = Put yu kɔsɔ pan tag nem, attribute, ɔ { $ref } fɔ si di dɔkyumɛnteshɔn.

help-unsupported-ref-chain = Wi nɔ gɛt ɛlp yet fɔ rɛfrɛns we gɛt bɔku pat lɛk { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Wi nɔ si wetin { $ref } de pɔynt to.
        [multiple] Wi si bɔku tin we { $ref } kin de pɔynt to.
       *[indeterminate] Wi nɔ ebul fɔ no wetin { $ref } de pɔynt to.
    }

help-learn-about-references = Lan bɔt rɛfrɛns dɛn →
help-reference-page = Rɛfrɛns pej →

help-suggestions-header =
    { $location ->
        [inside] Insay { $element }
       *[top] Na di tɔp lɛvul
    }{ $allowed ->
        [none] { " — natin nɔ de go ya." }
        [text] { " — rayt tɛks ya." }
        [text-and-components] { " — rayt tɛks ya, ɔ tray:" }
       *[components] { " — tin we yu kin tray:" }
    }

help-suggestions-footer = Prɛs { $shortcut } fɔ si ɔl di { $total } kɔmponɛnt dɛn.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } na rɛfrɛns to { $target }.
       *[other] { $ref } na rɛfrɛns to { $target } (layn { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } bring am lɛk { $role }.
       *[other] { $owner } bring am pan layn { $line } lɛk { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } na rɛfrɛns to di { $property } prɔpati pan { $element }.
       *[other] { $ref } na rɛfrɛns to di { $property } prɔpati pan { $element } (layn { $line }).
    }

help-kind-attribute = atribyut
help-kind-snippet = snipɛt
help-kind-array-entry = array ɛntri

help-default = Difɔlt:
help-active-default = Difɔlt we de wok:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valyu dɛn we dɛn alaw (wan fɔ ɛvri aytɛm):
       *[other] Valyu dɛn we dɛn alaw:
    }

help-suggested-values = Valyu dɛn we wi de sɔjɛst:

help-inserts = I de put:

help-coordinates =
    { $count ->
        [one] Kɔɔdinet:
       *[other] Kɔɔdinet dɛn:
    }

help-type = Tayp:

help-resolved-style = Stayl we wi wok am ɔt (styleNumber { $styleNumber }):

help-resolved-function-names = Fɔnkshɔn nem dɛn we wi wok ɔt:
help-reset-list = Risɛt lis pan dis input:
help-added-on-input = Dɛn ad am pan dis input:
help-removed-on-input = Dɛn pul am pan dis input:

help-reset-overrides = { $reset } de ovarayt { $additional } ɛn { $removed }.
