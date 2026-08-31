# Lombard (lombard) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety and orthography.** Western Lombard in its Milanese form, in the
# classical Milanese orthography; see `chrome.ftl`. Eastern Lombard would
# differ throughout.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# **Counts.** CLDR has **no** plural rules for `lmo`, so no `zero`, `two`,
# `few` or `many` branch appears here or in any other file of this locale.
# `[one]`/`*[other]` is kept because that is the split the runtime fallback
# makes and the split Milanese needs: the feminine plural is a real ending
# («violazion» → «violazion», but «coordinata» → «coordinat») and the verb
# beside a masculine noun changes even where the noun does not. Every symbolic
# selector — `$action`, `$status`, `$shortcut`, `$reason`, `$location`,
# `$allowed`, `$line`, `$perItem` — is kept byte for byte from English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Torna indree
       *[update] Ajorna
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } el visualizador
       *[other] { $word } el visualizador { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtra…
editor-variant-next = Ciappa el variant prossim
editor-variant-previous = Ciappa el variant precedent


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] S'è trovaa ona violazion de accessibilitaa WCAG AA. Schiscia per { $action ->
            [close] serrà
           *[open] verz
        } el rapport de accessibilitaa.
        [advisories] Schiscia per { $action ->
            [close] serrà
           *[open] verz
        } el rapport de accessibilitaa. S'è trovaa nissuna violazion WCAG AA, ma gh'è di alter consili de accessibilitaa.
       *[clean] Schiscia per { $action ->
            [close] serrà
           *[open] verz
        } el rapport de accessibilitaa. S'è trovaa nissun problema de accessibilitaa.
    }

editor-accessibility-label =
    { $status ->
        [violations] S'è trovaa ona violazion de accessibilitaa WCAG AA. S'è trovaa { $count ->
            [one] { $count } violazion WCAG AA
           *[other] { $count } violazion WCAG AA
        }. Schiscia per { $action ->
            [close] serrà
           *[open] verz
        } el rapport de accessibilitaa.
        [advisories] S'è trovaa nissuna violazion WCAG AA. S'è trovaa { $count ->
            [one] { $count } consili de accessibilitaa in pussee
           *[other] { $count } consili de accessibilitaa in pussee
        }. Schiscia per { $action ->
            [close] serrà
           *[open] verz
        } el rapport de accessibilitaa.
       *[clean] S'è trovaa nissuna violazion WCAG AA. Schiscia per { $action ->
            [close] serrà
           *[open] verz
        } el rapport de accessibilitaa.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Version de DoenetML { $version }

editor-tab-help = Aiut per el contest
editor-tab-help-short = Contest
editor-tab-errors = Erròr
editor-tab-warnings = Avis
editor-tab-info = Informazion
editor-tab-accessibility = Accessibilitaa
editor-tab-responses = Rispost mandaa

editor-tab-with-count = { $label }: { $count }

editor-options = Opzion de l'editor
editor-format-as-doenetml = Formatta come DoenetML
editor-format-as-xml = Formatta come XML


## The diagnostics panel

editor-diagnostic-line = Riga #{ $line }

editor-no-errors = Nissun erròr
editor-no-warnings = Nissun avis
editor-no-info = Nissuna informazion

editor-show-info-annotations = Mostra li informazion in l'editor
editor-show-accessibility-annotations = Mostra i avis de accessibilitaa in l'editor

editor-accessibility-learn-more = Impara come che Doenet el ciappa sù l'accessibilitaa

editor-accessibility-violations-heading = Violazion de accessibilitaa ({ $standard })

editor-accessibility-other-heading = Alter problema de accessibilitaa
editor-none-found = Nissun trovaa


## Submitted responses

editor-no-responses = Ancamò nissuna risposta mandada
editor-response-answer-id = Id de la risposta
editor-response-response = Risposta
editor-response-credit = Pont
editor-response-submitted = Mandada


## The context-help panel

help-placeholder = Metta el cursor su on nom de tag, su on attribut o su { $ref } per la documentazion.

help-unsupported-ref-chain = L'aiut per i riferiment a pussee tocch come { $example } l'è ancamò minga disponibil.

help-unresolved-ref =
    { $reason ->
        [notFound] Nissun referent trovaa per el riferiment: { $ref }.
        [multiple] Pussee referent trovaa per el riferiment: { $ref }.
       *[indeterminate] S'è minga poduu determinà on referent per { $ref }.
    }

help-learn-about-references = Impara sui riferiment →
help-reference-page = Pagina de riferiment →

help-suggestions-header =
    { $location ->
        [inside] Denter in { $element }
       *[top] Al livell pussee alt
    }{ $allowed ->
        [none] { " — chì el va nagott." }
        [text] { " — scriv test chì." }
        [text-and-components] { " — scriv test chì, o prova:" }
       *[components] { " — robb de provà:" }
    }

help-suggestions-footer = Schiscia { $shortcut } per vedè tucc i { $total } component.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } l'è on riferiment a { $target }.
       *[other] { $ref } l'è on riferiment a { $target } (riga { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introduii de { $owner } come { $role }.
       *[other] Introduii de { $owner } in la riga { $line } come { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } l'è on riferiment a la propietaa { $property } de { $element }.
       *[other] { $ref } l'è on riferiment a la propietaa { $property } de { $element } (riga { $line }).
    }

help-kind-attribute = attribut
help-kind-snippet = tocch de test
help-kind-array-entry = vos de array

help-default = Predefinii:
help-active-default = Predefinii attiv:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valor permettuu (vun per element):
       *[other] Valor permettuu:
    }

help-suggested-values = Valor consigliaa:

help-inserts = El mett denter:

help-coordinates =
    { $count ->
        [one] Coordinata:
       *[other] Coordinat:
    }

help-type = Tipo:

help-resolved-style = Stil risolt (styleNumber { $styleNumber }):

help-resolved-function-names = Nom de funzion risolt:
help-reset-list = Lista de tornà indree su chest input:
help-added-on-input = Giontaa su chest input:
help-removed-on-input = Cavaa su chest input:

help-reset-overrides = { $reset } el passa denanz a { $additional } e { $removed }.
