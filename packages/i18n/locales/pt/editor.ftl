# Portuguese editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Brazilian Portuguese, which is what a bare `pt` means — see the note at the
# head of `content.ftl`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Redefinir
       *[update] Atualizar
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } visualizador
       *[other] { $word } visualizador { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Filtrar...
editor-variant-next = Selecionar a próxima variante
editor-variant-previous = Selecionar a variante anterior


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Violação de acessibilidade WCAG AA identificada. Clique para { $action ->
            [close] fechar
           *[open] abrir
        } o relatório de acessibilidade.
        [advisories] Clique para { $action ->
            [close] fechar
           *[open] abrir
        } o relatório de acessibilidade. Nenhuma violação WCAG AA foi encontrada, mas há outras recomendações de acessibilidade.
       *[clean] Clique para { $action ->
            [close] fechar
           *[open] abrir
        } o relatório de acessibilidade. Nenhum problema de acessibilidade foi encontrado.
    }

editor-accessibility-label =
    { $status ->
        [violations] Violação de acessibilidade WCAG AA identificada. { $count ->
            [one] { $count } violação WCAG AA encontrada
           *[other] { $count } violações WCAG AA encontradas
        }. Clique para { $action ->
            [close] fechar
           *[open] abrir
        } o relatório de acessibilidade.
        [advisories] Nenhuma violação WCAG AA identificada. { $count ->
            [one] { $count } recomendação adicional de acessibilidade encontrada
           *[other] { $count } recomendações adicionais de acessibilidade encontradas
        }. Clique para { $action ->
            [close] fechar
           *[open] abrir
        } o relatório de acessibilidade.
       *[clean] Nenhuma violação WCAG AA identificada. Clique para { $action ->
            [close] fechar
           *[open] abrir
        } o relatório de acessibilidade.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versão { $version }

editor-tab-help = Ajuda contextual
editor-tab-help-short = Contexto
editor-tab-errors = Erros
editor-tab-warnings = Avisos
editor-tab-info = Informação
editor-tab-accessibility = Acessibilidade
editor-tab-responses = Respostas enviadas

editor-tab-with-count = { $label }: { $count }

editor-options = Opções do editor
editor-format-as-doenetml = Formatar como DoenetML
editor-format-as-xml = Formatar como XML


## The diagnostics panel

editor-diagnostic-line = Linha #{ $line }

editor-no-errors = Nenhum erro
editor-no-warnings = Nenhum aviso
editor-no-info = Nenhum diagnóstico informativo

editor-show-info-annotations = Mostrar diagnósticos informativos no editor
editor-show-accessibility-annotations = Mostrar diagnósticos de acessibilidade no editor

editor-accessibility-learn-more = Saiba como o Doenet trata a acessibilidade

editor-accessibility-violations-heading = Violações de acessibilidade ({ $standard })

editor-accessibility-other-heading = Outros problemas de acessibilidade
editor-none-found = Nenhum encontrado


## Submitted responses

editor-no-responses = Ainda não há respostas enviadas
editor-response-answer-id = Id da resposta
editor-response-response = Resposta
editor-response-credit = Nota
editor-response-submitted = Enviada


## The context-help panel

help-placeholder = Coloque o cursor sobre um nome de tag, um atributo ou { $ref } para ver a documentação.

help-unsupported-ref-chain = Ainda não há ajuda para referências de várias partes como { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Nenhum referente encontrado para a referência: { $ref }.
        [multiple] Vários referentes encontrados para a referência: { $ref }.
       *[indeterminate] Não foi possível determinar um referente para { $ref }.
    }

help-learn-about-references = Saiba mais sobre referências →
help-reference-page = Página de referência →

help-suggestions-header =
    { $location ->
        [inside] Dentro de { $element }
       *[top] No nível superior
    }{ $allowed ->
        [none] { " — nada pode ficar aqui." }
        [text] { " — digite texto aqui." }
        [text-and-components] { " — digite texto aqui, ou experimente:" }
       *[components] { " — coisas para experimentar:" }
    }

help-suggestions-footer = Pressione { $shortcut } para ver todos os { $total } componentes.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } é uma referência a { $target }.
       *[other] { $ref } é uma referência a { $target } (linha { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introduzido por { $owner } como { $role }.
       *[other] Introduzido por { $owner } na linha { $line } como { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } é uma referência à propriedade { $property } de { $element }.
       *[other] { $ref } é uma referência à propriedade { $property } de { $element } (linha { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = trecho de código
help-kind-array-entry = entrada de array

help-default = Padrão:
help-active-default = Padrão em vigor:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valores permitidos (um por item):
       *[other] Valores permitidos:
    }

help-suggested-values = Valores sugeridos:

help-inserts = Insere:

help-coordinates =
    { $count ->
        [one] Coordenada:
       *[other] Coordenadas:
    }

help-type = Tipo:

help-resolved-style = Estilo resolvido (styleNumber { $styleNumber }):

help-resolved-function-names = Nomes de funções resolvidos:
help-reset-list = Lista de redefinição desta entrada:
help-added-on-input = Adicionado nesta entrada:
help-removed-on-input = Removido nesta entrada:

help-reset-overrides = { $reset } tem prioridade sobre { $additional } e { $removed }.
