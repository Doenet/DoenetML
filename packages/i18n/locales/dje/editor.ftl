# Zarma editor and language-server surfaces. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and `styleNumber` are identifiers of
# the language and stay in English exactly as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ye ka sinji
       *[update] Taagandi
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Cabeko
       *[other] { $word } Cabeko { $shortcut }
    }


## The variant picker

editor-variant = Dumi

editor-variant-filter = Ceeci…

editor-variant-next = Suuban dumi kaŋ ga kaa

editor-variant-previous = Suuban dumi kaŋ bisa


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] I du WCAG AA duyaŋ sanno ŋwaarey. Kar zama ni ma { $action ->
            [close] daabu
           *[open] feeri
        } duyaŋ tira.
        [advisories] Kar zama ni ma { $action ->
            [close] daabu
           *[open] feeri
        } duyaŋ tira. I mana du WCAG AA ŋwaarey kulu, amma duyaŋ faada fo-yaŋ go no.
       *[clean] Kar zama ni ma { $action ->
            [close] daabu
           *[open] feeri
        } duyaŋ tira. I mana du duyaŋ taabi kulu.
    }

editor-accessibility-label =
    { $status ->
        [violations] I du WCAG AA duyaŋ sanno ŋwaarey. I du { $count ->
            [one] WCAG AA ŋwaarey { $count }
           *[other] WCAG AA ŋwaarey { $count }
        }. Kar zama ni ma { $action ->
            [close] daabu
           *[open] feeri
        } duyaŋ tira.
        [advisories] I mana du WCAG AA ŋwaarey kulu. I du { $count ->
            [one] duyaŋ faada fo { $count }
           *[other] duyaŋ faada fo { $count }
        }. Kar zama ni ma { $action ->
            [close] daabu
           *[open] feeri
        } duyaŋ tira.
       *[clean] I mana du WCAG AA ŋwaarey kulu. Kar zama ni ma { $action ->
            [close] daabu
           *[open] feeri
        } duyaŋ tira.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML dumi { $version }

editor-tab-help = Nangu faada
editor-tab-help-short = Nangu
editor-tab-errors = Taali-yaŋ
editor-tab-warnings = Yaamar-yaŋ
editor-tab-info = Bayrandi
editor-tab-accessibility = Duyaŋ
editor-tab-responses = Tuuruyaŋ kaŋ i samba

editor-tab-with-count = { $label }: { $count }

editor-options = Hantumkoo suubanyaŋ
editor-format-as-doenetml = Hanse danga DoenetML
editor-format-as-xml = Hanse danga XML


## The diagnostics panel

editor-diagnostic-line = Kar #{ $line }

editor-no-errors = Taali Si No
editor-no-warnings = Yaamar Si No
editor-no-info = Bayrandi Si No

editor-show-info-annotations = Cabe bayrandi-yaŋ hantumkoo ra
editor-show-accessibility-annotations = Cabe duyaŋ taabi-yaŋ hantumkoo ra

editor-accessibility-learn-more = Dooni mate kaŋ Doenet ga duyaŋ te

editor-accessibility-violations-heading = Duyaŋ ŋwaarey-yaŋ ({ $standard })

editor-accessibility-other-heading = Duyaŋ taabi fo-yaŋ
editor-none-found = I mana du hay kulu


## Submitted responses

editor-no-responses = Tuuruyaŋ kaŋ i samba si no jina
editor-response-answer-id = Tuuruyaŋ maa
editor-response-response = Tuuruyaŋ
editor-response-credit = Nooru
editor-response-submitted = I n'a samba


## The context-help panel

help-placeholder = Daŋ hantumyaŋ alaama tag maa ga, attribute ga, wala { $ref } ga zama ni ma feerijandi du.

help-unsupported-ref-chain = Faada dumbu boobo sanni-yaŋ se danga { $example } mana go no jina.

help-unresolved-ref =
    { $reason ->
        [notFound] I mana du hay kulu { $ref } se.
        [multiple] I du hari boobo { $ref } se.
       *[indeterminate] I mana hin ka bay { $ref } hara.
    }

help-learn-about-references = Dooni sanni-yaŋ boŋ →
help-reference-page = Feerijandi moo →

help-suggestions-header =
    { $location ->
        [inside] { $element } ra
       *[top] Tira boŋo ga
    }{ $allowed ->
        [none] { " — hay kulu si koy ne." }
        [text] { " — hantum sanni ne." }
        [text-and-components] { " — hantum sanni ne, wala ma guna:" }
       *[components] { " — hari-yaŋ kaŋ ni ga hin ka guna:" }
    }

help-suggestions-footer = Kar { $shortcut } zama ni ma hari { $total } kulu guna.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ya sanni no { $target } se.
       *[other] { $ref } ya sanni no { $target } se (kar { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } n'a daŋ danga { $role }.
       *[other] { $owner } n'a daŋ kar { $line } ga danga { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ya sanni no { $element } { $property } se.
       *[other] { $ref } ya sanni no { $element } { $property } se (kar { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = dumbu
help-kind-array-entry = array dumbu

help-default = Kaŋ go no za jina:
help-active-default = Kaŋ go no za jina nda goo ga goy:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Hari-yaŋ kaŋ i yadda (afo hari fo se):
       *[other] Hari-yaŋ kaŋ i yadda:
    }

help-suggested-values = Hari-yaŋ kaŋ i cabe:

help-inserts = A ga daŋ:

help-coordinates =
    { $count ->
        [one] Nangu:
       *[other] Nangu-yaŋ:
    }

help-type = Dumi:

help-resolved-style = Dumi kaŋ i du (styleNumber { $styleNumber }):

help-resolved-function-names = Fonksiyon maa-yaŋ kaŋ i du:
help-reset-list = Ye ka sinji lisi input woo ga:
help-added-on-input = I n'a tonton input woo ga:
help-removed-on-input = I n'a kaa input woo ga:

help-reset-overrides = { $reset } ga { $additional } nda { $removed } bisa.
