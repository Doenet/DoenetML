# Susu editor and language-server surfaces: the footer, the diagnostics
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
        [reset] Murundi
       *[update] Kutayandi
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Yitandirilai
       *[other] { $word } Yitandirilai { $shortcut }
    }


## The variant picker

editor-variant = Siifa

editor-variant-filter = Tombo…

editor-variant-next = Siifa naxan fa tombo

editor-variant-previous = Siifa naxan tɛmɛn tombo


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA futandiyi tɛmɛn tofaxi. A mati futandiyi kibari { $action ->
            [close] soxo
           *[open] raba
        }.
        [advisories] A mati futandiyi kibari { $action ->
            [close] soxo
           *[open] raba
        }. WCAG AA tɛmɛn mu tofa, bare dangaxun dɔɔ nan a bara.
       *[clean] A mati futandiyi kibari { $action ->
            [close] soxo
           *[open] raba
        }. Futandiyi kolo mu tofa.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA futandiyi tɛmɛn tofaxi. { $count ->
            [one] WCAG AA tɛmɛn { $count } tofaxi
           *[other] WCAG AA tɛmɛn { $count } tofaxi
        }. A mati futandiyi kibari { $action ->
            [close] soxo
           *[open] raba
        }.
        [advisories] WCAG AA tɛmɛn mu tofa. { $count ->
            [one] Futandiyi dangaxun doo { $count } tofaxi
           *[other] Futandiyi dangaxune { $count } tofaxi
        }. A mati futandiyi kibari { $action ->
            [close] soxo
           *[open] raba
        }.
       *[clean] WCAG AA tɛmɛn mu tofa. A mati futandiyi kibari { $action ->
            [close] soxo
           *[open] raba
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML siifa { $version }

editor-tab-help = Dulaa malaxidi
editor-tab-help-short = Dulaa
editor-tab-errors = Filinu
editor-tab-warnings = Dangaxune
editor-tab-info = Kibari
editor-tab-accessibility = Futandiyi
editor-tab-responses = Yabi rasaxinu

editor-tab-with-count = { $label }: { $count }

editor-options = Safarilai tombonyi
editor-format-as-doenetml = A rakolon ko DoenetML
editor-format-as-xml = A rakolon ko XML


## The diagnostics panel

editor-diagnostic-line = Sira #{ $line }

editor-no-errors = Fili Mu A Bara
editor-no-warnings = Dangaxun Mu A Bara
editor-no-info = Kibari Mu A Bara

editor-show-info-annotations = Kibari yitandi safarilai konyi
editor-show-accessibility-annotations = Futandiyi dangaxune yitandi safarilai konyi

editor-accessibility-learn-more = Doenet ki futandiyi mato cogo min, a loxi

editor-accessibility-violations-heading = Futandiyi tɛmɛnnu ({ $standard })

editor-accessibility-other-heading = Futandiyi kolo dɔɔ
editor-none-found = Fɛn mu tofa


## Submitted responses

editor-no-responses = Yabi rasaxi mu a bara xungbe
editor-response-answer-id = Yabi xili
editor-response-response = Yabi
editor-response-credit = Kerediti
editor-response-submitted = A rasaxi


## The context-help panel

help-placeholder = Kursɔ landi tagi xili ma, taamasenyi ma, waraxa { $ref } ma ki safari sɔtɔ.

help-unsupported-ref-chain = Malaxidi naxan findi kore wuyaxi yitandiyi ma ko { $example }, wo mu dati singe.

help-unresolved-ref =
    { $reason ->
        [notFound] Fɛn mu tofa yitandiyi yi ma: { $ref }.
        [multiple] Fɛn wuyaxi tofaxi yitandiyi yi ma: { $ref }.
       *[indeterminate] { $ref } ki naxan yitandi, wo mu loxi.
    }

help-learn-about-references = Yitandiyi kanla loxi →
help-reference-page = Yitandiyi karati →

help-suggestions-header =
    { $location ->
        [inside] { $element } konyi
       *[top] Fari kore
    }{ $allowed ->
        [none] { " — fɛn mu fa noo yan." }
        [text] { " — kumakan safari yan." }
        [text-and-components] { " — kumakan safari yan, waraxa i xa yi tombo:" }
       *[components] { " — korenu i si naxan tombo:" }
    }

help-suggestions-footer = { $shortcut } mati ki korenu bɛɛ tofa { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ki { $target } yitandi.
       *[other] { $ref } ki { $target } yitandi (sira { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] A bota { $owner } bara ko { $role }.
       *[other] A bota { $owner } bara sira { $line } ma ko { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ki { $element } taamasenyi { $property } yitandi.
       *[other] { $ref } ki { $element } taamasenyi { $property } yitandi (sira { $line }).
    }

help-kind-attribute = taamasenyi
help-kind-snippet = kore surunyi
help-kind-array-entry = dii sinsanyi konyi

help-default = Naxan a bara singe:
help-active-default = Naxan a bara singe nun naxan ki tigi:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Kantinu naxee bɛnbɛxi (fɛn-wo-fɛn ma):
       *[other] Kantinu naxee bɛnbɛxi:
    }

help-suggested-values = Kantinu naxee foota:

help-inserts = A ki yi landi:

help-coordinates =
    { $count ->
        [one] Dulaa yitandirilai:
       *[other] Dulaa yitandirilaie:
    }

help-type = Siifa:

help-resolved-style = Siifa naxan tofaxi (styleNumber { $styleNumber }):

help-resolved-function-names = Fonksioni xili tofaxinu:
help-reset-list = Sinsanyi murunxi yi dii ra:
help-added-on-input = Naxan lafanxi yi dii ra:
help-removed-on-input = Naxan botaxi yi dii ra:

help-reset-overrides = { $reset } ki { $additional } nun { $removed } tɛmɛn.
