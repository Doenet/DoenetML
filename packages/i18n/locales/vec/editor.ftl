# Venetian (veneto) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The unified Venetian spelling, «x» for the voiced sibilant
# and no «ł»; see `chrome.ftl`.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# **Number.** CLDR has plural rules for `vec`; its `many` selects only at exact
# millions and no noun counted here changes shape there, so no `[many]` branch
# appears. Every symbolic selector — `$action`, `$status`, `$shortcut`,
# `$reason`, `$location`, `$allowed`, `$line`, `$perItem` — is kept byte for
# byte from English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ripristina
       *[update] Ajorna
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } el vixualixador
       *[other] { $word } el vixualixador { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Filtra…
editor-variant-next = Sielsi la variante prosima
editor-variant-previous = Sielsi la variante precedente


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Se ga trovà na violasion de acesibilità WCAG AA. Struca par { $action ->
            [close] serar
           *[open] verxer
        } el raporto de acesibilità.
        [advisories] Struca par { $action ->
            [close] serar
           *[open] verxer
        } el raporto de acesibilità. No se ga trovà violasion WCAG AA, ma ghe xe altri consegi de acesibilità.
       *[clean] Struca par { $action ->
            [close] serar
           *[open] verxer
        } el raporto de acesibilità. No se ga trovà nisun problema de acesibilità.
    }

editor-accessibility-label =
    { $status ->
        [violations] Se ga trovà na violasion de acesibilità WCAG AA. Se ga trovà { $count ->
            [one] { $count } violasion WCAG AA
           *[other] { $count } violasion WCAG AA
        }. Struca par { $action ->
            [close] serar
           *[open] verxer
        } el raporto de acesibilità.
        [advisories] No se ga trovà violasion WCAG AA. Se ga trovà { $count ->
            [one] { $count } consegio de acesibilità in pì
           *[other] { $count } consegi de acesibilità in pì
        }. Struca par { $action ->
            [close] serar
           *[open] verxer
        } el raporto de acesibilità.
       *[clean] No se ga trovà violasion WCAG AA. Struca par { $action ->
            [close] serar
           *[open] verxer
        } el raporto de acesibilità.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Version de DoenetML { $version }

editor-tab-help = Juto par el contesto
editor-tab-help-short = Contesto
editor-tab-errors = Erori
editor-tab-warnings = Avertimenti
editor-tab-info = Informasion
editor-tab-accessibility = Acesibilità
editor-tab-responses = Rispote mandà

editor-tab-with-count = { $label }: { $count }

editor-options = Opsion de l'editor
editor-format-as-doenetml = Formata come DoenetML
editor-format-as-xml = Formata come XML


## The diagnostics panel

editor-diagnostic-line = Riga #{ $line }

editor-no-errors = Nisun eror
editor-no-warnings = Nisun avertimento
editor-no-info = Nisuna informasion

editor-show-info-annotations = Mostra le informasion in te l'editor
editor-show-accessibility-annotations = Mostra i avisi de acesibilità in te l'editor

editor-accessibility-learn-more = Inpara come che Doenet el ciapa su la acesibilità

editor-accessibility-violations-heading = Violasion de acesibilità ({ $standard })

editor-accessibility-other-heading = Altri problemi de acesibilità
editor-none-found = Nisun trovà


## Submitted responses

editor-no-responses = Ancora nisuna rispota mandà
editor-response-answer-id = Id de la rispota
editor-response-response = Rispota
editor-response-credit = Punti
editor-response-submitted = Mandà


## The context-help panel

help-placeholder = Meti el cursor su un nome de tag, su un atributo o su { $ref } par la documentasion.

help-unsupported-ref-chain = El juto par i riferimenti a pì tochi come { $example } no'l xe ancora pronto.

help-unresolved-ref =
    { $reason ->
        [notFound] Nisun referente trovà par el riferimento: { $ref }.
        [multiple] Pì referenti trovà par el riferimento: { $ref }.
       *[indeterminate] No se ga podesto determinar un referente par { $ref }.
    }

help-learn-about-references = Inpara sui riferimenti →
help-reference-page = Pagina de riferimento →

help-suggestions-header =
    { $location ->
        [inside] Rentro de { $element }
       *[top] Al livel pì alto
    }{ $allowed ->
        [none] { " — qua no ghe va gnente." }
        [text] { " — scrivi testo qua." }
        [text-and-components] { " — scrivi testo qua, o prova:" }
       *[components] { " — robe da provar:" }
    }

help-suggestions-footer = Struca { $shortcut } par veder tuti i { $total } conponenti.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } el xe un riferimento a { $target }.
       *[other] { $ref } el xe un riferimento a { $target } (riga { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introdusesto da { $owner } come { $role }.
       *[other] Introdusesto da { $owner } in te la riga { $line } come { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } el xe un riferimento a la proprietà { $property } de { $element }.
       *[other] { $ref } el xe un riferimento a la proprietà { $property } de { $element } (riga { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = toco de testo
help-kind-array-entry = voxe de array

help-default = Predefinio:
help-active-default = Predefinio ativo:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valori permessi (uno par elemento):
       *[other] Valori permessi:
    }

help-suggested-values = Valori consegià:

help-inserts = El inserisse:

help-coordinates =
    { $count ->
        [one] Coordinata:
       *[other] Coordinate:
    }

help-type = Tipo:

help-resolved-style = Stil rixolto (styleNumber { $styleNumber }):

help-resolved-function-names = Nomi de funsion rixolti:
help-reset-list = Lista de ripristino su sto input:
help-added-on-input = Zontà su sto input:
help-removed-on-input = Cavà da sto input:

help-reset-overrides = { $reset } el passa sora a { $additional } e { $removed }.
