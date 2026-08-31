# Mirandese (mirandés) editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Mirandese is Asturleonese, not Portuguese** — its nearest relative is
# `locales/ast`. **Script: Latin, in the Convenção Ortográfica da Língua
# Mirandesa** (1999), as in every file of this catalog. Digits are Latin, as
# `src/intl.ts` pins for every locale.
#
# **Mirandese and Portuguese.** The frame is Mirandese: «ye» / «nun ye», «nun»
# negating, «i» for *and*, «ó» for *or*, «se» for *if*, «cun» for *with»,
# «para» for *for*, «an beç desso» for *instead*, and the article «l» / «la» /
# «ls» / «las» throughout. «lhinha», «páigina», «erros», «abisos», «achado»,
# «amostrar», «carrega», «bei» and «bal» are Mirandese.
#
# **The editor's technical vocabulary is Portuguese, and that is declared.**
# «bariante», «filtrar», «relatório», «acessibilidade», «diagnóstico»,
# «atributo», «referéncia», «documentaçon», «cursor», «formatar» are the words
# a Mirandese speaker reads on a screen, in Portuguese, adapted to the
# Convenção's spelling where it supplies one. DoenetML identifiers, `WCAG` and
# `styleNumber` stay in English exactly as written.
#
# **Counts.** CLDR has **no plural data for `mwl`**, so `Intl.PluralRules`
# would resolve the tag against the runtime's own locale and any `[one]` branch
# would be selected by somebody else's rules. **No `[zero]`, `[one]`, `[two]`,
# `[few]` or `[many]` branch appears anywhere in this catalog.**
# `editor-accessibility-label`'s two counted phrases and `help-coordinates` are
# therefore written once, in the plural, which reads correctly for any count in
# a language that marks plural only on the noun.
#
# **Weakest first.** «besualizador» for *viewer*, «sugerides» for *suggested*,
# «resolbido» for *resolved* and the boundary between a Mirandese word and its
# Portuguese source are what a reviewing speaker should check first.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reiniciar
       *[update] Atualizar
    }
editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } l besualizador
       *[other] { $word } l besualizador { $shortcut }
    }


## The variant picker

editor-variant = Bariante
editor-variant-filter = Filtrar…
editor-variant-next = Scolher la bariante seguinte
editor-variant-previous = Scolher la bariante anterior


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Fui eidentificada ua biolaçon de acessibilidade WCAG AA. Carrega para { $action ->
            [close] cerrar
           *[open] abrir
        } l relatório de acessibilidade.
        [advisories] Carrega para { $action ->
            [close] cerrar
           *[open] abrir
        } l relatório de acessibilidade. Nun se achórun biolaçones WCAG AA, mas hai mais recomendaçones de acessibilidade disponibles.
       *[clean] Carrega para { $action ->
            [close] cerrar
           *[open] abrir
        } l relatório de acessibilidade. Nun se achou niun porblema de acessibilidade.
    }
# The two counted phrases are written once and phrased so that no noun agrees
# with the count: CLDR has no plural rules for `mwl`, so no category branch
# could be selected correctly here.
editor-accessibility-label =
    { $status ->
        [violations] Fui eidentificada ua biolaçon de acessibilidade WCAG AA. Número de biolaçones WCAG AA achadas: { $count }. Carrega para { $action ->
            [close] cerrar
           *[open] abrir
        } l relatório de acessibilidade.
        [advisories] Nun se eidentificórun biolaçones WCAG AA. Número de recomendaçones de acessibilidade a mais: { $count }. Carrega para { $action ->
            [close] cerrar
           *[open] abrir
        } l relatório de acessibilidade.
       *[clean] Nun se eidentificórun biolaçones WCAG AA. Carrega para { $action ->
            [close] cerrar
           *[open] abrir
        } l relatório de acessibilidade.
    }
editor-accessibility-badge = WCAG


## The footer

editor-version-title = Berson de l DoenetML { $version }
editor-tab-help = Ajuda sensible al contesto
editor-tab-help-short = Contesto
editor-tab-errors = Erros
editor-tab-warnings = Abisos
editor-tab-info = Anformaçon
editor-tab-accessibility = Acessibilidade
editor-tab-responses = Repuostas ambiadas
editor-tab-with-count = { $label }: { $count }
editor-options = Opçones de l eiditor
editor-format-as-doenetml = Formatar cumo DoenetML
editor-format-as-xml = Formatar cumo XML


## The diagnostics panel

editor-diagnostic-line = Lhinha #{ $line }
editor-no-errors = Sin erros
editor-no-warnings = Sin abisos
editor-no-info = Sin diagnósticos de anformaçon
editor-show-info-annotations = Amostrar ls diagnósticos de anformaçon ne l eiditor
editor-show-accessibility-annotations = Amostrar ls diagnósticos de acessibilidade ne l eiditor
editor-accessibility-learn-more = Saber cumo l Doenet trata la acessibilidade
editor-accessibility-violations-heading = Biolaçones de acessibilidade ({ $standard })
editor-accessibility-other-heading = Outros porblemas de acessibilidade
editor-none-found = Nun se achou nada


## Submitted responses

editor-no-responses = Inda nun hai repuostas ambiadas
editor-response-answer-id = Id de la repuosta
editor-response-response = Repuosta
editor-response-credit = Crédito
editor-response-submitted = Ambiada


## The context-help panel

help-placeholder = Pon l cursor nun nome de tag, nun atributo ó nun { $ref } para ber la documentaçon.
help-unsupported-ref-chain = La ajuda para referéncias de bárias partes cumo { $example } inda nun stá disponible.
help-unresolved-ref =
    { $reason ->
        [notFound] Nun se achou niun referente para la referéncia: { $ref }.
        [multiple] Achórun-se bários referentes para la referéncia: { $ref }.
       *[indeterminate] Nun fui possible determinar un referente para { $ref }.
    }
help-learn-about-references = Saber mais subre las referéncias →
help-reference-page = Páigina de referéncia →
help-suggestions-header =
    { $location ->
        [inside] Andrento de { $element }
       *[top] Ne l nible de riba
    }{ $allowed ->
        [none] { " — nun bai nada eiqui." }
        [text] { " — screbe testo eiqui." }
        [text-and-components] { " — screbe testo eiqui ó eisperimenta:" }
       *[components] { " — cousas para eisperimentar:" }
    }
help-suggestions-footer = Carrega an { $shortcut } para ber ls { $total } componentes todos.
help-name-summary = { $name } — { $summary }
help-ref-is-reference =
    { $line ->
        [none] { $ref } ye ua referéncia a { $target }.
       *[other] { $ref } ye ua referéncia a { $target } (lhinha { $line }).
    }
help-ref-derived-from =
    { $line ->
        [none] Antroduzido por { $owner } cumo { $role }.
       *[other] Antroduzido por { $owner } na lhinha { $line } cumo { $role }.
    }
help-property-is-reference =
    { $line ->
        [none] { $ref } ye ua referéncia a la propiadade { $property } de { $element }.
       *[other] { $ref } ye ua referéncia a la propiadade { $property } de { $element } (lhinha { $line }).
    }
help-kind-attribute = atributo
help-kind-snippet = cachico
help-kind-array-entry = antrada de array
help-default = Balor por defeito:
help-active-default = Balor por defeito atibo:
help-style-number-annotation = { " " }(styleNumber { $styleNumber })
help-allowed-values =
    { $perItem ->
        [true] Balores premitidos (un por cada item):
       *[other] Balores premitidos:
    }
help-suggested-values = Balores sugeridos:
help-inserts = Ansire:
# Written once, in the plural: CLDR has no plural rules for `mwl`.
help-coordinates = Coordenadas:
help-type = Tipo:
help-resolved-style = Stilo resolbido (styleNumber { $styleNumber }):
help-resolved-function-names = Nomes de funcion resolbidos:
help-reset-list = Lhista de reinício neste input:
help-added-on-input = Acrecentado neste input:
help-removed-on-input = Tirado neste input:
help-reset-overrides = { $reset } prebalece subre { $additional } i { $removed }.
