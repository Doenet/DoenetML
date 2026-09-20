# Portuguese viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Brazilian Portuguese, which is what a bare `pt` means — see the note at the
# head of `content.ftl`.
#
# Controls are labelled with the infinitive, which is what Portuguese puts on a
# button: `Abrir teclado`, not `Abra o teclado`. A sentence addressed to the
# reader still takes the second person — `Recarregue a página`.


## Answer submission

answer-checking = Verificando...
answer-submitting = Enviando...
answer-checking-status = Verificando a resposta
answer-submitting-status = Enviando a resposta
answer-correct = Correto
answer-incorrect = Incorreto
answer-response-saved = Resposta salva
answer-percent-credit = { $percent }% de nota
answer-percent-correct = { $percent }% correto
answer-percent-short = { $percent }%
max-credit-available = Nota máxima disponível: { $percent }%
attempts-remaining =
    { $count ->
        [0] nenhuma tentativa restante
        [one] { $count } tentativa restante
       *[other] { $count } tentativas restantes
    }
validation-correct = (Correto)
validation-incorrect = (Incorreto)
validation-partially-correct = (Parcialmente correto)
answer-show-responses =
    { $count ->
        [one] Mostrar { $count } resposta de { $answerId }
       *[other] Mostrar { $count } respostas de { $answerId }
    }

## Disclosure panels

feedback-heading = Comentários
collapsible-click-to-open = (clique para abrir)
collapsible-click-to-close = (clique para fechar)
collapsible-initializing = Inicializando...
footnote-show = Mostrar nota de rodapé
footnote-hide = Ocultar nota de rodapé
description-more-information = mais informações

## Controls

slider-previous = Anterior
slider-next = Próximo
keyboard-open = Abrir teclado
keyboard-close = Fechar teclado
choice-input-remove-choice = Remover { $choice }
matrix-remove-row = Remover linha
matrix-add-row = Adicionar linha
matrix-remove-column = Remover coluna
matrix-add-column = Adicionar coluna
subset-add-remove-points = Adicionar/remover pontos
subset-toggle-points-intervals = Alternar entre pontos e intervalos
subset-move-points = Mover pontos
subset-clear = Limpar
# A `box` here is one orbital, drawn as a square: caixa.
orbital-add-row = Adicionar linha
orbital-remove-row = Remover linha
orbital-add-box = Adicionar caixa
orbital-remove-box = Remover caixa
orbital-add-up-arrow = Adicionar seta para cima
orbital-add-down-arrow = Adicionar seta para baixo
orbital-remove-arrow = Remover seta
orbital-row-label = Rótulo da linha { $row }
pretzel-answer = Resposta

## Math input

math-input-preview-region = pré-visualização da expressão matemática
math-input-preview = Pré-visualização
math-input-invalid-expression = Expressão inválida:

## Document status

viewer-initializing = Inicializando...

## Errors

error-heading = Erro
error-found-at =
    { $span ->
        [line] Encontrado na linha { $startLine }.
       *[lines] Encontrado nas linhas { $startLine }–{ $endLine }.
    }
document-contains-errors = Este documento contém erros!
diagnostic-heading-error = Erro
diagnostic-heading-warning = Aviso
diagnostic-heading-information = Informação
diagnostic-heading-hint = Dica
accessibility-heading-level-1 = Violação de acessibilidade WCAG AA
accessibility-heading-level-2 = Alerta de acessibilidade
something-went-wrong = Algo deu errado.
renderer-load-failed = um renderizador não pôde ser carregado. Recarregue a página.
core-start-failed = Não foi possível iniciar o visualizador de documentos. Recarregue a página.
