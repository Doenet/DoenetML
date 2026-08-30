# Piedmontese (piemontèis) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography and verbal particles.** See `chrome.ftl`.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# **Number.** CLDR has no plural rules for `pms`, so no `zero`, `two`, `few` or
# `many` branch appears anywhere. Every symbolic selector — `$action`,
# `$status`, `$shortcut`, `$reason`, `$location`, `$allowed`, `$line`,
# `$perItem` — is kept byte for byte from English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ripristina
       *[update] Agiorna
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } ël visualisador
       *[other] { $word } ël visualisador { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtra…
editor-variant-next = Ch'a sern ël variant pròssim
editor-variant-previous = Ch'a sern ël variant precedent


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] As é trovasse na violassion d'assessibilità WCAG AA. Sgnaca për { $action ->
            [close] sarè
           *[open] deurbe
        } ël rapòrt d'assessibilità.
        [advisories] Sgnaca për { $action ->
            [close] sarè
           *[open] deurbe
        } ël rapòrt d'assessibilità. As son nen trovasse violassion WCAG AA, ma a-i son d'àutri consej d'assessibilità.
       *[clean] Sgnaca për { $action ->
            [close] sarè
           *[open] deurbe
        } ël rapòrt d'assessibilità. As son nen trovasse problema d'assessibilità.
    }

editor-accessibility-label =
    { $status ->
        [violations] As é trovasse na violassion d'assessibilità WCAG AA. As son trovasse { $count ->
            [one] { $count } violassion WCAG AA
           *[other] { $count } violassion WCAG AA
        }. Sgnaca për { $action ->
            [close] sarè
           *[open] deurbe
        } ël rapòrt d'assessibilità.
        [advisories] As son nen trovasse violassion WCAG AA. As son trovasse { $count ->
            [one] { $count } consej d'assessibilità an pì
           *[other] { $count } consej d'assessibilità an pì
        }. Sgnaca për { $action ->
            [close] sarè
           *[open] deurbe
        } ël rapòrt d'assessibilità.
       *[clean] As son nen trovasse violassion WCAG AA. Sgnaca për { $action ->
            [close] sarè
           *[open] deurbe
        } ël rapòrt d'assessibilità.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Version ëd DoenetML { $version }

editor-tab-help = Agiut për ël contest
editor-tab-help-short = Contest
editor-tab-errors = Eror
editor-tab-warnings = Avis
editor-tab-info = Anformassion
editor-tab-accessibility = Assessibilità
editor-tab-responses = Rispòste mandà

editor-tab-with-count = { $label }: { $count }

editor-options = Opsion ëd l'editor
editor-format-as-doenetml = Formata coma DoenetML
editor-format-as-xml = Formata coma XML


## The diagnostics panel

editor-diagnostic-line = Riga #{ $line }

editor-no-errors = Gnun eror
editor-no-warnings = Gnun avis
editor-no-info = Gnun-a anformassion

editor-show-info-annotations = Mostra j'anformassion ant l'editor
editor-show-accessibility-annotations = Mostra j'avis d'assessibilità ant l'editor

editor-accessibility-learn-more = Amprend coma che Doenet a pija l'assessibilità

editor-accessibility-violations-heading = Violassion d'assessibilità ({ $standard })

editor-accessibility-other-heading = Àutri problema d'assessibilità
editor-none-found = Gnun trovà


## Submitted responses

editor-no-responses = Ancó gnun-a rispòsta mandà
editor-response-answer-id = Id dla rispòsta
editor-response-response = Rispòsta
editor-response-credit = Pont
editor-response-submitted = Mandà


## The context-help panel

help-placeholder = Buta ël cursor an sun un nòm ëd tag, an sun un atribut o an sun { $ref } për la documentassion.

help-unsupported-ref-chain = L'agiut për ij riferiment a pì tòch coma { $example } a l'é ancó nen pront.

help-unresolved-ref =
    { $reason ->
        [notFound] Gnun referent trovà për ël riferiment: { $ref }.
        [multiple] Pì referent trovà për ël riferiment: { $ref }.
       *[indeterminate] As é nen podusse determiné un referent për { $ref }.
    }

help-learn-about-references = Amprend an sij riferiment →
help-reference-page = Pàgina ëd riferiment →

help-suggestions-header =
    { $location ->
        [inside] Andrinta ëd { $element }
       *[top] Al livel pì àut
    }{ $allowed ->
        [none] { " — sì a-i va gnente." }
        [text] { " — scriv ëd test sì." }
        [text-and-components] { " — scriv ëd test sì, o preuva:" }
       *[components] { " — còse da provè:" }
    }

help-suggestions-footer = Sgnaca { $shortcut } për vëdde tuti ij { $total } component.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } a l'é un riferiment a { $target }.
       *[other] { $ref } a l'é un riferiment a { $target } (riga { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Anandià da { $owner } coma { $role }.
       *[other] Anandià da { $owner } an sla riga { $line } coma { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } a l'é un riferiment a la proprietà { $property } ëd { $element }.
       *[other] { $ref } a l'é un riferiment a la proprietà { $property } ëd { $element } (riga { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = tòch ëd test
help-kind-array-entry = vos ëd array

help-default = Predefinì:
help-active-default = Predefinì ativ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valor përmëttù (un për element):
       *[other] Valor përmëttù:
    }

help-suggested-values = Valor consijà:

help-inserts = A anseriss:

help-coordinates =
    { $count ->
        [one] Coordinà:
       *[other] Coordinà:
    }

help-type = Sòrt:

help-resolved-style = Stil arzolvù (styleNumber { $styleNumber }):

help-resolved-function-names = Nòm ëd fonsion arzolvù:
help-reset-list = Lista ëd ripristin an sun cost input:
help-added-on-input = Giontà an sun cost input:
help-removed-on-input = Gavà da cost input:

help-reset-overrides = { $reset } a passa dzora a { $additional } e { $removed }.
