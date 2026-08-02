# Portuguese diagnostics. Translated from `locales/en/diagnostics.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Brazilian Portuguese, which is what a bare `pt` means — see the note at the
# head of `content.ftl`.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } é ignorado quando dois extremos são especificados
       *[other] { $attributes } são ignorados quando dois extremos são especificados
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } é ignorado quando um extremo e um ponto médio são especificados juntos
       *[other] { $attributes } são ignorados quando um extremo e um ponto médio são especificados juntos
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset não tem efeito sem um ponto médio

## `<line>`

line-points-undetermined-dimensions = Reta que passa por pontos de dimensões indeterminadas.

line-points-too-few-dimensions = A reta deve passar por pontos de pelo menos duas dimensões.

line-points-depend-on-variables = A reta passa por pontos que dependem de variáveis: { $variables }.

line-equation-invalid-format = Formato inválido para a equação da reta nas variáveis { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = A semirreta é determinada por through, endpoint e direction ao mesmo tempo. Ignorando o through especificado.

ray-dimension-mismatch = numDimensions incompatível na semirreta.

## `<vector>`

vector-overprescribed-head = O vetor é determinado por head, tail e displacement ao mesmo tempo. Ignorando o head especificado.

vector-dimension-mismatch = numDimensions incompatível no vetor.

## Attracting and constraining

attract-to-without-nearest-point = Não é possível atrair para um `<{ $component }>` porque ele não tem a variável de estado nearestPoint.

constrain-to-without-nearest-point = Não é possível restringir a um `<{ $component }>` porque ele não tem a variável de estado nearestPoint.

constrain-to-interior-without-nearest-point = Não é possível restringir ao interior de um `<{ $component }>` porque ele não tem a variável de estado nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition é ignorado em um choiceInput que não é inline

## Ordering children by index

choice-input-indices-count-mismatch = Ignorando os índices especificados para choiceInput porque a quantidade de índices não corresponde à quantidade de filhos choice.

pretzel-indices-count-mismatch = Ignorando os índices especificados para problem porque a quantidade de índices não corresponde à quantidade de filhos problem.

shuffle-indices-count-mismatch = Ignorando os índices especificados para shuffle porque a quantidade de índices não corresponde à quantidade de componentes.

indices-ignored-out-of-range = Ignorando os índices especificados para { $component } porque alguns índices estão fora do intervalo.

pretzel-indices-repeated = Ignorando os índices especificados para pretzel porque alguns índices se repetem.

pretzel-circuit-first-index = Ignorando os índices especificados para pretzel no modo circuit porque o primeiro índice deve ser 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Para que `<{ $component }>` funcione com filhos de texto, o atributo `type` deve ser especificado.

invalid-type-defaulting-to-math = Tipo { $type } inválido para o componente { $component }. Deve ser math, text, number ou boolean. Usando math.

string-not-valid-component-to-arrange = A cadeia "{ $value }" não é um componente válido para { $component }. Ignorando.

## Types and variables

invalid-type-defaulting-to-number = Tipo { $type } inválido; definindo o tipo como number.

invalid-variable-value = Valor inválido de uma variável: `{ $value }`

## Variants

variant-index-must-be-number = O índice de variante { $index } deve ser um número

variant-index-must-be-integer = O índice de variante { $index } deve ser um inteiro

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` não está implementado para medidas absolutas. Definindo as larguras como relativas.

side-by-side-absolute-margins = `<{ $component }>` não está implementado para medidas absolutas. Definindo as margens como relativas.

side-by-side-no-block-child = `<{ $component }>` inválido: ele deve ter pelo menos um filho de bloco.

## `<label>`

label-for-ignored-on-graphical = O atributo `for` em um `<label>` gráfico é ignorado.

label-for-must-resolve-to-one = O atributo `for` em `<label>` deve resolver para exatamente um componente.

label-for-unresolved = O atributo `for` em `<label>` não pôde ser resolvido para um componente.

label-for-answer-with-authored-inputs = O atributo `for` em `<label>` referencia um `<answer>` com entradas escritas explicitamente; referencie a entrada diretamente.

label-for-answer-without-input = O atributo `for` em `<label>` referencia um `<answer>` sem uma entrada para rotular.

label-for-must-reference-input-or-answer = O atributo `for` em `<label>` deve referenciar uma entrada ou uma resposta.

## Accessibility

accessibility-short-description-or-decorative = Por acessibilidade, `<{ $component }>` deve ter uma descrição curta ou ser marcado como decorativo.

accessibility-video-short-description = Por acessibilidade, `<video>` deve ter uma descrição curta.

accessibility-input-short-description-or-label = Por acessibilidade, `<{ $component }>` deve ter uma descrição curta ou um rótulo.

accessibility-answer-input-short-description-or-label = Por acessibilidade, um `<answer>` que cria uma entrada deve ter uma descrição curta ou um rótulo.

accessibility-short-description-contains-math = Descrições curtas não devem conter componentes matemáticos como `<{ $component }>`. Escreva a matemática por extenso.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } tem contraste insuficiente para o texto do título da seção (modo escuro) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; exige pelo menos { $threshold }:1).
       *[other] { $colorName } tem contraste insuficiente para o texto do título da seção ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; exige pelo menos { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Ainda não implementado: `<circle>` passando por { $count } pontos quando os pontos não têm valores numéricos.

circle-too-many-through-points = Não é possível calcular um círculo que passe por mais de 3 pontos.

circle-overprescribed-radius-center-points = Não é possível calcular um círculo com raio, centro e pontos de passagem especificados ao mesmo tempo.

circle-center-with-multiple-points = Não é possível calcular um círculo com centro especificado que passe por mais de 1 ponto.

circle-radius-too-small = Não é possível calcular o círculo: como a distância entre os dois pontos é { $distance }, o raio { $radius } especificado é pequeno demais.

circle-radius-with-many-points = Não é possível criar um círculo que passe por mais de dois pontos com um raio especificado.

circle-invalid-center-or-through-points = Centro ou pontos de passagem do círculo inválidos.

circle-radius-center-with-multiple-points = Não é possível calcular o raio de um círculo com centro especificado que passe por mais de 1 ponto.

circle-change-radius-non-numerical = Não é possível alterar o raio de um círculo cujos pontos de passagem não são numéricos

circle-radius-with-points-non-numerical = Não é possível criar um círculo que passe por mais de um ponto com raio especificado quando não há valores numéricos.

circle-change-center-non-numerical = Ainda não implementado: alterar o centro de um círculo que passa por pontos não numéricos.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensões insuficientes para o domínio da função. O domínio tem { $intervals } intervalo, mas a função tem { $inputs ->
            [one] { $inputs } entrada
           *[other] { $inputs } entradas
        }.
       *[other] Dimensões insuficientes para o domínio da função. O domínio tem { $intervals } intervalos, mas a função tem { $inputs ->
            [one] { $inputs } entrada
           *[other] { $inputs } entradas
        }.
    }

function-domain-invalid-format = Formato inválido para o domínio da função.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ignorando o máximo não numérico da função.
        [minimum] Ignorando o mínimo não numérico da função.
        [extremum] Ignorando o extremo não numérico da função.
        [point] Ignorando o ponto não numérico da função.
        [slope] Ignorando a inclinação não numérica da função.
       *[other] Ignorando { $type } não numérico da função.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ignorando o máximo vazio da função.
        [minimum] Ignorando o mínimo vazio da função.
        [extremum] Ignorando o extremo vazio da função.
        [point] Ignorando o ponto vazio da função.
       *[other] Ignorando { $type } vazio da função.
    }

function-points-too-close = A função contém dois pontos em posições próximas demais. Não é possível definir a função.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Só é possível iterar a função quando a quantidade de entradas é igual à de saídas. Esta função tem { $inputs } entrada e { $outputs ->
            [one] { $outputs } saída
           *[other] { $outputs } saídas
        }.
       *[other] Só é possível iterar a função quando a quantidade de entradas é igual à de saídas. Esta função tem { $inputs } entradas e { $outputs ->
            [one] { $outputs } saída
           *[other] { $outputs } saídas
        }.
    }

## `<sequence>`

sequence-invalid-length = Comprimento inválido da sequência. Deve ser um inteiro não negativo.

sequence-invalid-step = Passo inválido da sequência. Deve ser um número para uma sequência do tipo { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" inválido em uma sequência numérica. Deve ser um número.

sequence-invalid-endpoint-letters = "{ $attribute }" inválido em uma sequência de letras. Deve ser uma combinação de letras.

sequence-invalid-endpoint = "{ $attribute }" inválido na sequência.

select-from-sequence-coprime-not-numbers = coprime ignorado porque não estão sendo selecionados números

select-from-sequence-coprime-with-exclude-combinations = coprime ignorado porque excludeCombinations foi especificado

## Resolving a `target`

target-not-found = target inválido para `<{ $source }>`: não foi possível encontrar o alvo.

target-state-variable-not-found = target inválido para `<{ $source }>`: não foi encontrada uma variável de estado chamada "{ $property }" em um `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = As variáveis de `<odeSystem>` devem ser diferentes da variável independente.

ode-system-duplicate-variable-names = Não é possível definir as funções do lado direito da EDO com nomes de variáveis dependentes repetidos.

ode-system-rhs-function-error = Não é possível definir a função do lado direito da EDO. Erro ao criar a função mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Não é possível definir um ângulo entre { $count } retas

angle-invalid-through-point = Ponto inválido no through de `<angle>`

parabola-vertex-too-many-points = Ainda não implementado: parábola com vértice especificado passando por mais de 1 ponto.

parabola-too-many-points = Ainda não implementado: parábola passando por mais de 3 pontos.

intersection-too-many-items = Ainda não implementado: interseção de mais de dois objetos

## Other math components

ionic-compound-not-two-ions = Ainda não implementado: composto iônico com um número de íons diferente de dois.

ionic-compound-needs-cation-and-anion = O composto iônico só está implementado para um cátion e um ânion.

solve-equations-cannot-evaluate = Não é possível resolver a equação porque ela não pôde ser avaliada: { $equation }

math-operators-operand-number-required = É preciso especificar operandNumber ao extrair um operando matemático.

eigen-decomposition-failed = Não foi possível calcular os autovalores da matriz

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: o parâmetro { $parameters } não ocorre no padrão, portanto corresponderá sempre a um vazio.
       *[other] `<matchesPattern>`: os parâmetros { $parameters } não ocorrem no padrão, portanto corresponderão sempre a um vazio.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: não foi possível interpretar grid="{ $grid }". Deve ser none, medium, dense ou dois números positivos separados por um espaço, como grid="1 0.5". Nenhuma grade é desenhada.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" não é suportado no renderizador prefigure; usando o comportamento da posição à direita.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" não é suportado no renderizador prefigure; usando o comportamento da posição no topo.

prefigure-invalid-axis-bounds = `<graph>`: limites de eixo inválidos para a conversão prefigure; usando a bbox padrão (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: largura inválida para a conversão prefigure; usando a largura padrão de diagrama 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio inválido para a conversão prefigure; usando a proporção padrão 1.

prefigure-grid-spacing-too-fine = `<graph>`: o espaçamento da grade é fino demais para os limites dos eixos; a grade é omitida no renderizador prefigure.

prefigure-annotations-not-rendered = `<graph>`: as anotações não serão desenhadas quando o renderizador PreFigure não for usado.

multiple-annotations-children = Vários filhos `<annotations>` encontrados em `<graph>`; todos são ignorados exceto o último.

## Referring to other components

copy-unrecognized-component-type = Não é possível estender ou copiar um tipo de componente não reconhecido: { $type }.

copy-prop-not-found = Não foi possível encontrar a propriedade { $property } em um componente do tipo { $component }

collect-no-source = Nenhuma origem encontrada para collect.

collect-invalid-component-type = Não é possível coletar componentes do tipo `<{ $component }>` porque esse não é um tipo de componente válido.

reference-index-unavailable = Não é possível referenciar o índice `{ $reference }`

## `<callAction>`

component-action-unavailable = Não é possível chamar { $action } no componente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Os dados têm formato inválido. As linhas têm comprimentos inconsistentes. Encontrado em componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Os dados têm nomes de coluna repetidos. Encontrado em componentIdx :{ $componentIdx }

data-frame-missing-column-name = Falta um nome de coluna nos dados. Encontrado em componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Um award desta resposta baseia-se na própria resposta enviada pela tag answer, o que levará a um comportamento inesperado.

answer-max-num-attempts-in-section-wide-check-work = Definir `maxNumAttempts` em um `<answer>` dentro de um contêiner com `sectionWideCheckWork` não tem efeito, porque o número de tentativas é controlado pelo contêiner. Defina `maxNumAttempts` no contêiner.

nested-section-wide-check-work-max-num-attempts = Definir `maxNumAttempts` em um contêiner com `sectionWideCheckWork` que está dentro de outro contêiner com `sectionWideCheckWork` não tem efeito, porque o número de tentativas é controlado pelo contêiner externo. Defina `maxNumAttempts` no contêiner externo.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] O atributo { $attributes } não terá efeito sem symbolicEquality definido.
       *[other] Os atributos { $attributes } não terão efeito sem symbolicEquality definido.
    }

answer-invalid-type = Tipo inválido para answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Como o componente `<{ $component }>` não tem nome, ele não pode ser usado como atributo de um módulo

module-attribute-name-already-defined = O componente `<{ $component } name="{ $name }">` não pode ser usado como atributo de um módulo porque o tipo de componente `<module>` já define um atributo "{ $name }".

conditional-content-condition-ignored = O atributo `condition` é ignorado em um componente `<conditionalContent>` que tem filhos case ou else.

slider-markers-type-mismatch = O tipo dos marcadores não corresponde ao tipo do controle deslizante.

pretzel-problem-needs-statement-and-answer = pretzel inválido: cada `<problem>` deve conter um `<statement>` e um `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel inválido: em mode="circuit", o primeiro `<problem>` não pode ser um distrator.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valor { $values } inválido para o atributo `{ $attribute }`; ignorando.
       *[other] Valores { $values } inválidos para o atributo `{ $attribute }`; ignorando.
    }

attribute-must-be-references = Valor `{ $value }` inválido para o atributo `{ $attribute }`. O atributo deve ser composto de referências que comecem com `$`.

math-input-invalid-function-names = <mathInput>: nomes de função inválidos ignorados em { $attribute }: { $names }. O segmento visível de cada nome deve ter pelo menos 2 caracteres (letras ou hifens); um sufixo opcional `|<alternativa mathspeak>` pode seguir.

## Building components from the source

component-type-invalid = Tipo de componente inválido: `<{ $componentType }>`

attribute-repeated = Não é possível repetir o atributo { $attribute }.

attribute-invalid-for-component = Atributo "{ $attribute }" inválido para um componente do tipo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    A definição de estilo { $styleNumber } tem contraste insuficiente para { $context ->
        [text-on-background] a cor do texto sobre a cor de fundo
        [high-contrast] a cor de alto contraste sobre a tela
        [line] a cor da linha sobre a tela
        [marker] a cor do marcador sobre a tela
       *[text-on-canvas] a cor do texto sobre a tela
    }{ $mode ->
        [dark] { " (modo escuro)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; exige pelo menos { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Embora a definição de estilo { $styleNumber } especifique cores com contraste suficiente para o modo claro, as cores de modo escuro derivadas desses valores têm contraste insuficiente entre a cor do texto e a cor de fundo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; exige pelo menos { $threshold }:1). { $suggestion ->
        [available] Para garantir contraste suficiente no modo escuro, aumente o contraste do modo claro (por exemplo, defina { $lightAttribute }="{ $lightColor }") ou sobrescreva a cor do modo escuro (por exemplo, defina { $darkAttribute }="{ $darkColor }").
       *[none] Para garantir contraste suficiente no modo escuro, aumente o contraste do modo claro ou sobrescreva as cores derivadas com textColorDarkMode e/ou backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Embora a definição de estilo { $styleNumber } especifique uma cor de texto com contraste suficiente para o modo claro, a cor de texto do modo escuro derivada desse valor tem contraste insuficiente sobre a tela ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; exige pelo menos { $threshold }:1). { $suggestion ->
        [available] Para garantir contraste suficiente no modo escuro, aumente o contraste do modo claro (por exemplo, defina textColor="{ $lightColor }") ou sobrescreva a cor do modo escuro (por exemplo, defina textColorDarkMode="{ $darkColor }").
       *[none] Para garantir contraste suficiente no modo escuro, aumente o contraste do modo claro ou sobrescreva a cor derivada com textColorDarkMode.
    }

section-multiple-style-palettes = Uma seção só pode escolher um <stylePalette>; usando o último.

## Unique variants

variant-num-to-select-not-non-negative-integer = não é possível determinar variantes únicas de { $component } porque numToSelect não é um inteiro não negativo.

variant-num-to-select-not-constant-number = não é possível determinar variantes únicas de { $component } porque numToSelect não é constante.

variant-with-replacement-not-constant-boolean = não é possível determinar variantes únicas de { $component } porque withReplacement não é um booleano constante.

variant-select-weight-disables-unique = as variantes únicas de select são desativadas se alguma opção especificar selectWeight ou selectForVariants

variant-coprime-undetermined = não é possível determinar variantes únicas de { $component } porque não se pode garantir que coprime seja sempre falso.

variant-attribute-not-constant = não é possível determinar variantes únicas de { $component } porque { $attribute } não é constante.

variant-attribute-not-number = não é possível determinar variantes únicas de { $component } porque { $attribute } não é um número.

variant-attribute-wrong-type-for-sequence =
    não é possível determinar variantes únicas de { $component } do tipo { $type } porque { $attribute } não é { $expected ->
        [letters-combination] uma combinação de letras
        [math-expression] uma expressão matemática válida
        [integer] um inteiro
       *[number] um número
    }.

variant-length-not-integer = não é possível determinar variantes únicas de { $component } porque length não é um inteiro.

variant-sort-not-implemented = ainda não implementado: variantes únicas de um { $component } com sort

variant-exclude-combinations-not-implemented = ainda não implementado: variantes únicas de um { $component } com excludeCombinations

variant-math-exclude-not-implemented = ainda não implementado: variantes únicas de um { $component } do tipo math com exclude

variant-non-constant-exclude-not-implemented = ainda não implementado: variantes únicas de um { $component } com exclude não constante

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: não suportado no renderizador prefigure do gráfico; descendente ignorado.

prefigure-descendant-invalid-geometry = { $subject }: geometria não finita ou incompleta; descendente ignorado.

prefigure-curve-label-omitted = { $subject }: rótulos não são suportados em elementos de curva convertidos; rótulo omitido.

prefigure-curve-unsupported-definition-type = { $subject }: tipo de definição de função de curva '{ $definitionType }' não suportado; descendente ignorado.

prefigure-region-flip-functions-unsupported = { $subject }: atributo flipFunctions não suportado em regionBetweenCurves; descendente ignorado.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves só suporta funções filhas do tipo fórmula; descendente ignorado.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' não suportado para { $labelKind ->
        [line-family] rótulo de família de retas
       *[point] rótulo de ponto
    }; usando o alinhamento padrão do PreFigure.

prefigure-fill-style-unsupported = { $subject }: o estilo de preenchimento '{ $fillStyle }' não é suportado pelo PreFigure; voltando a um preenchimento sólido.

prefigure-line-style-unknown = { $subject }: estilo de linha desconhecido '{ $lineStyle }' omitido da saída do PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: estilo de marcador '{ $markerStyle }' mapeado para o estilo 'diamond' do PreFigure.

prefigure-marker-style-unsupported = { $subject }: o estilo de marcador '{ $markerStyle }' não é suportado pelo PreFigure; usando o estilo padrão.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` inválido; não foi possível resolver o alvo. Anotação omitida.

annotation-ref-multiple-targets = `<annotation>`: `ref` resolveu para vários alvos; usando o primeiro.

annotation-ref-outside-graph = `<annotation>`: `ref` inválido; o alvo está fora do gráfico que o contém. Anotação omitida.

annotation-ref-unsupported-target = `<annotation>`: `ref` inválido; o alvo não é um objeto gráfico suportado na conversão prefigure. Anotação omitida.

annotation-text-missing = `<annotation>`: `text` ausente ou vazio; emitindo texto vazio.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Dependência circular detectada.
       *[other] Dependência circular detectada envolvendo um componente `<{ $componentType }>`.
    }

reference-no-referent = Nenhum referente encontrado para a referência: `{ $reference }`

reference-multiple-referents = Vários referentes encontrados para a referência: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formato inválido para o atributo { $attribute } de `<{ $componentType }>`.

children-invalid = Filhos inválidos para `<{ $componentType }>`: foram encontrados filhos inválidos: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valor `{ $value }` inválido para o atributo `{ $attribute }`; usando o valor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versão { $version } do DoenetML não encontrada.
       *[other] Versão { $version } do DoenetML não encontrada. Voltando à versão { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML inválido: { $content }

parse-tag-missing-close-tag = DoenetML inválido: a tag `{ $tag }` não tem tag de fechamento. Era esperada uma tag autofechada ou uma tag `</{ $tagName }>`.

parse-tag-error = DoenetML inválido: erro na tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML inválido: o atributo `{ $attribute }` parece estar sem valor.

parse-attribute-invalid = DoenetML inválido: atributo `{ $attribute }` inválido

parse-attribute-value-invalid = DoenetML inválido: valor de atributo `{ $value }` inválido

parse-attribute-value-quote-mismatch = DoenetML inválido: valor de atributo `{ $value }` inválido. As aspas não correspondem. Parece faltar uma `{ $quote }`

parse-open-tag-name-missing = DoenetML inválido: encontrada uma tag sem nome, por exemplo `<`

parse-tag-not-closed = DoenetML inválido: a tag `{ $tag }` não foi fechada (parece faltar um `>`).

parse-self-closing-tag-name-missing = DoenetML inválido: encontrada uma tag sem nome `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML inválido: a tag `{ $tag }` não foi fechada (parece faltar `/>`).

parse-tag-invalid-attributes = DoenetML inválido: a tag `{ $tag }` não é válida. Ela pode ter atributos incorretos.

parse-close-tag-name-missing = DoenetML inválido: encontrada uma tag de fechamento sem nome, por exemplo `</`

parse-attribute-value-unquoted = Os valores de atributo devem estar entre aspas: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML inválido: encontrada a tag de fechamento `{ $tag }`, mas não há tag de abertura correspondente

parse-close-tag-mismatched = DoenetML inválido: tag de fechamento incompatível. Era esperada `</{ $expected }>`. Encontrada `{ $found }`

parser-node-unconvertible = Não foi possível converter o nó { $node } em um nó Dast.

## Names

name-attribute-invalid =
    Atributo name='{ $name }' inválido. { $reason ->
        [characters] Os nomes só podem conter letras, números, sublinhados ou hifens.
       *[start] Os nomes devem começar por uma letra.
    }

component-name-invalid-start = Nome de componente "{ $name }" inválido. Os nomes devem começar por uma letra.

## `<answer>` sugar

answer-video-watched-missing-video = Um answer do tipo videoWatched deve ter um atributo video

answer-video-watched-video-not-reference = Um answer do tipo videoWatched deve ter um atributo video que seja uma referência

answer-name-not-single-text = O atributo name de answer deve ter um único filho de texto

## Referencing another document

external-doenetml-recursion-limit = Não foi possível obter o DoenetML externo por excesso de níveis de recursão. Existe alguma referência circular?

external-doenetml-unavailable = Não foi possível obter o DoenetML de { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML inválido obtido de { $attribute }="{ $uri }": não corresponde ao tipo de componente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] O atributo `{ $from }` está obsoleto; use `{ $to }`.
       *[other] [deprecation] O atributo `{ $from }` em `<{ $component }>` está obsoleto; use `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] O atributo `{ $from }` está obsoleto e foi ignorado porque `{ $to }` também foi especificado.
       *[other] [deprecation] O atributo `{ $from }` em `<{ $component }>` está obsoleto e foi ignorado porque `{ $to }` também foi especificado.
    }

deprecated-attribute-ignored = [deprecation] O atributo `{ $attribute }` em `<{ $component }>` está obsoleto e foi ignorado.


## Language coverage

pluralize-english-only = `<pluralize>` só sabe formar plurais em inglês, portanto o texto fica inalterado em um documento escrito em { $locale }. Escreva a forma plural diretamente ou defina-a com o atributo `pluralForm`.


## Checking against the schema

schema-element-unrecognized = O elemento `<{ $tag }>` não é um elemento Doenet reconhecido.

schema-element-not-allowed-at-root = O elemento `<{ $tag }>` não é permitido na raiz do documento.

schema-element-not-allowed-inside = O elemento `<{ $tag }>` não é permitido dentro de `<{ $parent }>`.

schema-attribute-unrecognized = O elemento `<{ $tag }>` não tem um atributo chamado `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] O atributo `{ $attribute }` do elemento `<{ $tag }>` deve ser uma lista cujos itens sejam cada um: { $allowed }
       *[other] O atributo `{ $attribute }` do elemento `<{ $tag }>` deve ser um de: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nome de variante inválido para select. O nome de variante { $variantName } aparece em { $numOptions } opções, mas a quantidade a selecionar é { $numToSelect }.

select-variant-name-without-options = Foram especificadas variantes para select, mas não há opções para o nome de variante possível: { $variantName }.

select-variant-name-not-possible = O nome de variante { $variantName } especificado para select não é um nome de variante possível.

select-too-few-options = Não é possível selecionar { $numToSelect } componentes de apenas { $numOptions }.

select-from-sequence-too-few-values = Não é possível selecionar { $numToSelect } valores de uma sequência de comprimento { $length }.

select-from-sequence-indices-count-mismatch = A quantidade de índices especificada para select deve corresponder à quantidade a selecionar

select-from-sequence-indices-not-integers = Todos os índices especificados para select devem ser inteiros

select-from-sequence-index-excluded = O índice especificado para selectfromsequence estava excluído

select-from-sequence-indices-excluded-combination = Os índices especificados para selectfromsequence formavam uma combinação excluída

select-from-sequence-coprime-not-positive-integers = Não é possível selecionar combinações coprimas porque não estão sendo selecionados inteiros positivos.

select-from-sequence-coprime-common-factor = Não é possível selecionar números coprimos. Todos os valores possíveis têm um fator comum. (Os valores especificados de "from" ou "to" devem ser coprimos com "step".)

select-from-sequence-coprime-single-number = Não é possível selecionar combinações coprimas a partir de um único número diferente de 1.

select-from-sequence-excluded-too-many-combinations = Mais de 70% das combinações foram excluídas em selectFromSequence

select-from-sequence-coprime-none-found = Não foi possível selecionar números coprimos. Todos os valores possíveis têm um fator comum.

select-from-sequence-too-few-unique-values = Não é possível selecionar { $numToSelect } valores distintos de uma sequência de comprimento { $numPossibleValues }

select-prime-numbers-too-few-values = Não é possível selecionar { $numToSelect } valores de uma lista de primos de comprimento { $numValues }

select-prime-numbers-values-count-mismatch = A quantidade de valores especificada para select deve corresponder à quantidade a selecionar

select-prime-numbers-values-not-prime = Todos os valores especificados para select prime number devem estar na lista de primos

select-prime-numbers-values-excluded-combination = Os valores especificados para selectPrimeNumbers formavam uma combinação excluída

select-prime-numbers-excluded-too-many-combinations = Mais de 70% das combinações foram excluídas em selectPrimeNumbers

select-random-combination-fluke = Por uma coincidência extremamente improvável, não foi possível selecionar uma combinação de valores aleatórios

select-random-value-fluke = Por uma coincidência extremamente improvável, não foi possível selecionar um valor aleatório
