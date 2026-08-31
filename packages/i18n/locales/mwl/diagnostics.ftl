# Mirandese (mirandés) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Mirandese is Asturleonese, not Portuguese** — co-official in the Tierra de
# Miranda since 1999, descended from the Astur-Leonese of León, with
# `locales/ast` rather than `locales/pt` as its nearest relative. **Script:
# Latin, in the Convenção Ortográfica da Língua Mirandesa** (1999), the only
# codified orthography it has. Digits are Latin, as `src/intl.ts` pins for
# every locale, and every number inside this prose is in Latin digits.
#
# **DoenetML identifiers are not translated.** `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `labelPosition`, `selectFromSequence` and
# every tag name stay in English exactly as written, as do the `[deprecation]`
# marker and `WCAG AA`.
#
# **Mirandese and Portuguese.** The frame is Mirandese and it is consistent:
# «nun se puode» for the impersonal *cannot*, «ten de» for *must*, «nun»
# negating, «i» for *and*, «ó» for *or*, «se» for *if*, «cumo» for *as*, «sin»
# for *without*, «puis que» / «porque» for *because*, «an beç desso» for
# *instead*, «quando» for *when*, and the article «l» / «la» / «ls» / «las».
# «erro», «abiso», «achado», «lhinha», «punto», «balor», «nome», «nun bálido»,
# «einorado» and «specificado» carry the everyday layer.
#
# **The technical layer is Portuguese, and it is declared rather than
# disguised.** «atributo», «componente», «eilemento», «referéncia», «índice»,
# «matriz», «seqüéncia», «bariante», «renderizador», «formato»,
# «acessibilidade», «contraste» are Portuguese words in the Convenção's
# spelling. Mirandese has no computing terminology of its own; every Mirandese
# speaker is schooled in Portuguese and reads a diagnostic in it. Nothing here
# has been coined.
#
# **Counts.** CLDR has **no plural data for `mwl`**, so `Intl.PluralRules`
# resolves the tag against the runtime's own locale and any `[one]` branch
# would be selected by somebody else's rules. **No `[zero]`, `[one]`, `[two]`,
# `[few]` or `[many]` branch appears anywhere in this catalog**, in any of the
# four files. Every message where English selects on a count is written once,
# in the plural, which reads correctly for any count in a language that marks
# plural on the noun with `-s`. `field-function-wrong-num-outputs`'s
# `$expected` keeps its two branches because it is a two-way choice between one
# output and two rather than a plural, and it is rewritten to select on the
# symbolic values rather than on a category.
#
# **Weakest first.** The parser and schema sections carry the longest sentences
# and lean hardest on Portuguese; «einorado» for *ignored* and «resolbido» for
# *resolved* are the two words a reviewing speaker should decide about first,
# since each is used throughout and each is one letter from its Portuguese
# source.

## `<lineSegment>`

# Written once, in the plural: CLDR has no plural rules for `mwl`.
line-segment-attributes-ignored-with-endpoints = { $attributes } son einorados quando se specifican dous puntos finales
line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } son einorados quando se specifican un punto final i un punto medio
line-segment-midpoint-offset-without-midpoint = midpointOffset nun ten eifeito sin un punto medio

## `<line>`

line-points-undetermined-dimensions = Lhinha por puntos de dimensiones nun determinadas.
line-points-too-few-dimensions = La lhinha ten de passar por puntos de al menos dues dimensiones.
line-points-depend-on-variables = La lhinha passa por puntos que dependen de bariables: { $variables }.
line-equation-invalid-format = Formato nun bálido para la eiquaçon de la lhinha nas bariables { $variable1 } i { $variable2 }.

## `<ray>`

ray-overprescribed-through = L raio stá specificado por through, endpoint i direction. A einorar l through specificado.
ray-dimension-mismatch = numDimensions nun cundiç ne l raio.

## `<vector>`

vector-overprescribed-head = L betor stá specificado por head, tail i displacement. A einorar l head specificado.
vector-dimension-mismatch = numDimensions nun cundiç ne l betor.

## Attracting and constraining

attract-to-without-nearest-point = Nun se puode atrair a un `<{ $component }>` puis que nun ten la bariable de stado nearestPoint.
constrain-to-without-nearest-point = Nun se puode restringir a un `<{ $component }>` puis que nun ten la bariable de stado nearestPoint.
constrain-to-interior-without-nearest-point = Nun se puode restringir al anterior de un `<{ $component }>` puis que nun ten la bariable de stado nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ye einorado nun choiceInput que nun ye inline

## Ordering children by index

choice-input-indices-count-mismatch = A einorar ls índices specificados para choiceInput puis que l número de índices nun cundiç cul número de filhos choice.
pretzel-indices-count-mismatch = A einorar ls índices specificados para problem puis que l número de índices nun cundiç cul número de filhos problem.
shuffle-indices-count-mismatch = A einorar ls índices specificados para shuffle puis que l número de índices nun cundiç cul número de componentes.
indices-ignored-out-of-range = A einorar ls índices specificados para { $component } puis que alguns stán fuora de l antrebalo.
pretzel-indices-repeated = A einorar ls índices specificados para pretzel puis que alguns stán repetidos.
pretzel-circuit-first-index = A einorar ls índices specificados para pretzel ne l modo circuit puis que l purmeiro índice ten de ser 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Para que `<{ $component }>` funcione cun filhos de testo, ten de se specificar un atributo `type`.
invalid-type-defaulting-to-math = Tipo nun bálido { $type } para l componente { $component }. Ten de ser un de math, text, number ó boolean. A usar math por defeito.
string-not-valid-component-to-arrange = L testo "{ $value }" nun ye un componente bálido para { $component }. A einorar.

## Types and variables

invalid-type-defaulting-to-number = Tipo nun bálido { $type }, a poner l tipo cumo number.
invalid-variable-value = Balor nun bálido dua bariable: `{ $value }`

## Variants

variant-index-must-be-number = L índice de bariante { $index } ten de ser un número
variant-index-must-be-integer = L índice de bariante { $index } ten de ser un número anteiro

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` nun stá feito para medidas absolutas. A poner las lharguras cumo relatibas.
side-by-side-absolute-margins = `<{ $component }>` nun stá feito para medidas absolutas. A poner las margines cumo relatibas.
side-by-side-no-block-child = `<{ $component }>` nun bálido: ten de tener al menos un filho de bloco.

## `<label>`

label-for-ignored-on-graphical = L atributo `for` nun `<label>` gráfico ye einorado.
label-for-must-resolve-to-one = L atributo `for` nun `<label>` ten de resolber-se an eisatamente un componente.
label-for-unresolved = Nun fui possible resolber l atributo `for` de `<label>` nun componente.
label-for-answer-with-authored-inputs = L atributo `for` de `<label>` refire un `<answer>` cun inputs screbidos pul outor; refire l input dreitamente.
label-for-answer-without-input = L atributo `for` de `<label>` refire un `<answer>` sin un input para eitiquetar.
label-for-must-reference-input-or-answer = L atributo `for` de `<label>` ten de referir un input ó ua repuosta.

## Accessibility

accessibility-short-description-or-decorative = Para acessibilidade, `<{ $component }>` ten de tener ua çcriçon cúrtia ó ser specificado cumo decorative.
accessibility-video-short-description = Para acessibilidade, `<video>` ten de tener ua çcriçon cúrtia.
accessibility-input-short-description-or-label = Para acessibilidade, `<{ $component }>` ten de tener ua çcriçon cúrtia ó ua eitiqueta.
accessibility-answer-input-short-description-or-label = Para acessibilidade, un `<answer>` que cria un input ten de tener ua çcriçon cúrtia ó ua eitiqueta.
accessibility-short-description-contains-math = Las çcriçones cúrtias nun deben tener componentes matemáticos cumo `<{ $component }>`. Screbe la matemática toda cun palabras.
accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } nun ten contraste bastante para l testo de l títalo de la secçon (modo scuro) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ye percisso al menos { $threshold }:1).
       *[other] { $colorName } nun ten contraste bastante para l testo de l títalo de la secçon ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ye percisso al menos { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Inda nun stá feito un `<circle>` por { $count } puntos ne l causo an que ls puntos nun ténen balores numéricos.
circle-too-many-through-points = Nun se puode calcular un círclo por mais de 3 puntos.
circle-overprescribed-radius-center-points = Nun se puode calcular un círclo cun raio, centro i puntos specificados.
circle-center-with-multiple-points = Nun se puode calcular un círclo cun centro specificado por mais de 1 punto.
circle-radius-too-small = Nun se puode calcular l círclo: sendo la çtáncia antre ls dous puntos { $distance }, l raio specificado { $radius } ye pequeinho de mais.
circle-radius-with-many-points = Nun se puode criar un círclo por mais de dous puntos cun un raio specificado.
circle-invalid-center-or-through-points = Centro ó puntos through de l círclo nun bálidos.
circle-radius-center-with-multiple-points = Nun se puode calcular l raio dun círclo cun centro specificado por mais de 1 punto.
circle-change-radius-non-numerical = Nun se puode mudar l raio dun círclo cun puntos through nun numéricos
circle-radius-with-points-non-numerical = Nun se puode criar un círclo por mais de un punto cun un raio specificado quando nun hai balores numéricos.
circle-change-center-non-numerical = Inda nun stá feito mudar l centro dun círclo por puntos cun balores nun numéricos.

## `<function>`

# Written once, in the plural: CLDR has no plural rules for `mwl`.
function-domain-insufficient-dimensions = Nun hai dimensiones bastantes para l domínio de la funcion. L domínio ten { $intervals } antrebalos mas la funcion ten { $inputs } antradas.
function-domain-invalid-format = Formato nun bálido para l domínio de la funcion.
function-ignoring-non-numerical =
    { $type ->
        [maximum] A einorar l máximo nun numérico de la funcion.
        [minimum] A einorar l mínimo nun numérico de la funcion.
        [extremum] A einorar l stremo nun numérico de la funcion.
        [point] A einorar l punto nun numérico de la funcion.
        [slope] A einorar l declibe nun numérico de la funcion.
       *[other] A einorar l { $type } nun numérico de la funcion.
    }
function-ignoring-empty =
    { $type ->
        [maximum] A einorar l máximo bazio de la funcion.
        [minimum] A einorar l mínimo bazio de la funcion.
        [extremum] A einorar l stremo bazio de la funcion.
        [point] A einorar l punto bazio de la funcion.
       *[other] A einorar l { $type } bazio de la funcion.
    }
function-points-too-close = La funcion ten dous puntos an lhugares acerca de mais un de l outro. Nun se puode defenir la funcion.
function-iterates-input-output-mismatch = Las eiteraçones dua funcion solo son possibles se l número de antradas fur eigual al número de salidas. Esta funcion ten { $inputs } antradas i { $outputs } salidas.

## `<sequence>`

sequence-invalid-length = Cumprimiento nun bálido de la seqüéncia. Ten de ser un número anteiro nun negatibo.
sequence-invalid-step = Passo nun bálido de la seqüéncia. Ten de ser un número para ua seqüéncia de l tipo { $type }.
sequence-invalid-endpoint-number = "{ $attribute }" nun bálido dua seqüéncia de números. Ten de ser un número.
sequence-invalid-endpoint-letters = "{ $attribute }" nun bálido dua seqüéncia de lhetras. Ten de ser ua cumbinaçon de lhetras.
sequence-invalid-endpoint = "{ $attribute }" nun bálido de la seqüéncia.
select-from-sequence-coprime-not-numbers = coprime ye einorado puis que nun se stan a scolher números
select-from-sequence-coprime-with-exclude-combinations = coprime ye einorado puis que excludeCombinations stá specificado

## Resolving a `target`

target-not-found = Albo nun bálido para `<{ $source }>`: nun se ancontra l albo.
target-state-variable-not-found = Albo nun bálido para `<{ $source }>`: nun se ancontra ua bariable de stado chamada "{ $property }" nun `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Las bariables de `<odeSystem>` ténen de ser çfrentes de la bariable andependente.
ode-system-duplicate-variable-names = Nun se puoden defenir las funciones RHS de la ODE cun nomes de bariables dependentes repetidos.
ode-system-rhs-function-error = Nun se puode defenir la funcion RHS de la ODE. Erro a criar la funcion mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Nun se puode defenir un ángulo antre { $count } lhinhas
angle-invalid-through-point = Punto nun bálido ne l through de `<angle>`
parabola-vertex-too-many-points = Inda nun stá feita ua parabóla cun bértice por mais de 1 punto.
parabola-too-many-points = Inda nun stá feita ua parabóla por mais de 3 puntos.
intersection-too-many-items = Inda nun stá feita la anterseçon para mais de dous eilementos

## Other math components

ionic-compound-not-two-ions = Inda nun stá feito un cumposto iónico para outra cousa que nun séian dous iones.
ionic-compound-needs-cation-and-anion = L cumposto iónico solo stá feito para un cation i un anion.
solve-equations-cannot-evaluate = Nun se puode resolber la eiquaçon puis que nun fui possible abaliá-la: { $equation }
math-operators-operand-number-required = Ten de se specificar un operandNumber al stráir un operando matemático.
eigen-decomposition-failed = Nun fui possible calcular ls balores próprios de la matriz

## `<matchesPattern>`

# Written once, in the plural: CLDR has no plural rules for `mwl`.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: ls parámetros { $parameters } nun aparécen ne l padron, portanto ban siempre cundizir cun un spácio bazio.

## `<graph>`

graph-grid-invalid = `<graph>`: nun se puode antender grid="{ $grid }". Ten de ser none, medium, dense, ó dous números positibos apartados por un spácio, cumo grid="1 0.5". Nun se çenha grade nanhue.

## `<slopeField>` and `<vectorField>`

# `$expected` is a two-way choice between one output and two, not a plural, so
# it keeps both branches — but written as the numeric `[1]` rather than as
# `[one]`, which would be a CLDR category chosen by the runtime's own rules
# and not by anything Mirandese decides. `ext` and `lad` write it the same way.
field-function-wrong-num-outputs =
    `<{ $component }>` percisa dua funcion cun { $expected ->
        [1] ua salida, l declibe y' an cada punto, cumo `y - x`
       *[other] dues salidas, l betor an cada punto, cumo `(y, -x)`
    }, mas la funcion que le fui dada ten { $found } salidas. { $alternative ->
        [none] Nun se çenha nada.
       *[other] `<{ $alternative }>` ye l componente para essa funcion. Nun se çenha nada.
    }
field-function-attribute-ignored-with-child = L atributo `function` ye einorado porque la funcion tamien ye dada andrento de l componente; ye usada la de andrento. Dá la funcion solo dua de las dues maneiras.
field-variables-ignored =
    `<{ $component }>`: l atributo `variables` nomeia las bariables dua spresson screbida dreitamente andrento de l componente. { $reason ->
        [function-child] La funcion eiqui ye dada cumo un filho `<function>`, que nomeia las sues própias bariables, portanto `variables` ye einorado.
       *[no-expression] Nun se dá eiqui nanhue spresson dessas, portanto `variables` ye einorado.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" nun ye supuortado ne l renderizador prefigure; a usar l cumportamiento de la posiçon dreita.
prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" nun ye supuortado ne l renderizador prefigure; a usar l cumportamiento de la posiçon de riba.
prefigure-invalid-axis-bounds = `<graph>`: lhemites de eixe nun bálidos para la cumberson prefigure; a usar l bbox por defeito (-10,-10,10,10).
prefigure-invalid-width = `<graph>`: lhargura nun bálida para la cumberson prefigure; a usar la lhargura de diagrama por defeito 425.
prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio nun bálido para la cumberson prefigure; a usar la raçon de aspeto por defeito 1.
prefigure-grid-spacing-too-fine = `<graph>`: l spácio de la grade ye fino de mais para ls lhemites de l eixe; la grade nun ye çenhada ne l renderizador prefigure.
prefigure-annotations-not-rendered = `<graph>`: las anotaçones nun son çenhadas quando nun se usa l renderizador PreFigure.
multiple-annotations-children = Achórun-se bários filhos `<annotations>` nun `<graph>`; todos menos l redadeiro son einorados.

## Referring to other components

copy-unrecognized-component-type = Nun se puode stender ó copiar un tipo de componente nun reconhecido: { $type }.
copy-prop-not-found = Nun se achou la prop { $property } nun componente de l tipo { $component }
collect-no-source = Nun se achou fuonte para collect.
collect-invalid-component-type = Nun se puoden ajuntar componentes de l tipo `<{ $component }>` puis que ye un tipo de componente nun bálido.
reference-index-unavailable = Nun se puode referir l índice `{ $reference }`

## `<callAction>`

component-action-unavailable = Nun se puode chamar { $action } ne l componente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ls dados ténen ua forma nun bálida. Las fileras ténen cumprimientos çfrentes. Achado an componentIdx :{ $componentIdx }
data-frame-duplicate-column-names = Ls dados ténen nomes de coluna repetidos. Achado an componentIdx :{ $componentIdx }
data-frame-missing-column-name = Ls dados nun ténen un nome de coluna. Achado an componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un award desta repuosta baseia-se na repuosta ambiada de l própio tag answer, l que bai lhebar a un cumportamiento nun sperado.
answer-max-num-attempts-in-section-wide-check-work = Poner `maxNumAttempts` nun `<answer>` andrento dun cuntentor cun `sectionWideCheckWork` nun ten eifeito, puis que l número de tentos ye cuntrolado pul cuntentor. Pon `maxNumAttempts` ne l cuntentor an beç desso.
nested-section-wide-check-work-max-num-attempts = Poner `maxNumAttempts` nun cuntentor cun `sectionWideCheckWork` que stá andrento doutro cuntentor cun `sectionWideCheckWork` nun ten eifeito, puis que l número de tentos ye cuntrolado pul cuntentor de fuora. Pon `maxNumAttempts` ne l cuntentor de fuora an beç desso.
# Written once, in the plural: CLDR has no plural rules for `mwl`.
answer-attributes-need-symbolic-equality = Ls atributos { $attributes } nun ban tener eifeito sin symbolicEquality specificado.
answer-invalid-type = Tipo nun bálido para la repuosta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Cumo l componente `<{ $component }>` nun ten nome, nun puode ser usado para un atributo de module
module-attribute-name-already-defined = L componente `<{ $component } name="{ $name }">` nun puode ser usado cumo atributo dun module porque l tipo de componente `<module>` yá ten un atributo "{ $name }" defenido.
conditional-content-condition-ignored = L atributo `condition` ye einorado nun componente `<conditionalContent>` cun filhos case ó else.
slider-markers-type-mismatch = L tipo de ls marcadores nun cundiç cul tipo de l slider.
pretzel-problem-needs-statement-and-answer = Pretzel nun bálido: cada `<problem>` ten de tener un `<statement>` i ua `<answer>`.
pretzel-circuit-first-problem-distractor = Pretzel nun bálido: an mode="circuit", l purmeiro `<problem>` nun puode ser un distractor.

## Attribute values

# Written once, in the plural: CLDR has no plural rules for `mwl`.
attribute-invalid-values = Balores nun bálidos { $values } para l atributo `{ $attribute }`; a einorar.
attribute-must-be-references = Balor nun bálido `{ $value }` para l atributo `{ $attribute }`. L atributo ten de ser feito de referéncias que ampécen cun `$`.
math-input-invalid-function-names = <mathInput>: einorórun-se nomes de funcion nun bálidos an { $attribute }: { $names }. L segmento de amostraige de cada nome ten de tener al menos 2 caratelres (lhetras ó trações); puode seguir-se un sufixo `|<mathspeak alternative>` oupcional.

## Building components from the source

component-type-invalid = Tipo de componente nun bálido: `<{ $componentType }>`
attribute-repeated = Nun se puode repetir l atributo { $attribute }.
attribute-invalid-for-component = Atributo nun bálido "{ $attribute }" nun componente de l tipo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La defeniçon de stilo { $styleNumber } nun ten contraste bastante para { $context ->
        [text-on-background] la quelor de l testo contra la quelor de l fondo
        [high-contrast] la quelor de alto contraste contra la tela
        [line] la quelor de la lhinha contra la tela
        [marker] la quelor de l marcador contra la tela
       *[text-on-canvas] la quelor de l testo contra la tela
    }{ $mode ->
        [dark] { " (modo scuro)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ye percisso al menos { $threshold }:1).
style-definition-dark-mode-text-background-contrast =
    Anque la defeniçon de stilo { $styleNumber } tenga quelores cun contraste bastante ne l modo claro, las quelores de l modo scuro deribadas deilhas nun ténen contraste bastante para la quelor de l testo contra la quelor de l fondo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ye percisso al menos { $threshold }:1). { $suggestion ->
        [available] Para garantir contraste bastante ne l modo scuro, ó auméntia l contraste de l modo claro (por ejemplo, pon { $lightAttribute }="{ $lightColor }") ó defina la quelor de l modo scuro (por ejemplo, pon { $darkAttribute }="{ $darkColor }").
       *[none] Para garantir contraste bastante ne l modo scuro, auméntia l contraste de l modo claro ó defina las quelores deribadas cun textColorDarkMode i/ó backgroundColorDarkMode.
    }
style-definition-dark-mode-text-canvas-contrast =
    Anque la defeniçon de stilo { $styleNumber } tenga ua quelor de testo cun contraste bastante ne l modo claro, la quelor de testo de l modo scuro deribada deilha nun ten contraste bastante contra la tela ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ye percisso al menos { $threshold }:1). { $suggestion ->
        [available] Para garantir contraste bastante ne l modo scuro, ó auméntia l contraste de l modo claro (por ejemplo, pon textColor="{ $lightColor }") ó defina la quelor de l modo scuro (por ejemplo, pon textColorDarkMode="{ $darkColor }").
       *[none] Para garantir contraste bastante ne l modo scuro, auméntia l contraste de l modo claro ó defina la quelor deribada cun textColorDarkMode.
    }
section-multiple-style-palettes = Ua secçon solo puode scolher un <stylePalette>; a usar l redadeiro.

## Unique variants

variant-num-to-select-not-non-negative-integer = nun se puoden determinar las bariantes ounicas de { $component } puis que numToSelect nun ye un número anteiro nun negatibo.
variant-num-to-select-not-constant-number = nun se puoden determinar las bariantes ounicas de { $component } puis que numToSelect nun ye un número custante.
variant-with-replacement-not-constant-boolean = nun se puoden determinar las bariantes ounicas de { $component } puis que withReplacement nun ye un boolean custante.
variant-select-weight-disables-unique = Las bariantes ounicas de select son çatibadas se hai ua oupçon cun selectWeight ó selectForVariants specificado
variant-coprime-undetermined = nun se puoden determinar las bariantes ounicas de { $component } puis que nun se puode determinar que coprime seia siempre falso.
variant-attribute-not-constant = nun se puoden determinar las bariantes ounicas de { $component } puis que { $attribute } nun ye custante.
variant-attribute-not-number = nun se puoden determinar las bariantes ounicas de { $component } puis que { $attribute } nun ye un número.
variant-attribute-wrong-type-for-sequence =
    nun se puoden determinar las bariantes ounicas de { $component } de l tipo { $type } puis que { $attribute } nun ye { $expected ->
        [letters-combination] ua cumbinaçon de lhetras
        [math-expression] ua spresson matemática bálida
        [integer] un número anteiro
       *[number] un número
    }.
variant-length-not-integer = nun se puoden determinar las bariantes ounicas de { $component } puis que length nun ye un número anteiro.
variant-sort-not-implemented = inda nun stan feitas las bariantes ounicas dun { $component } cun sort
variant-exclude-combinations-not-implemented = inda nun stan feitas las bariantes ounicas dun { $component } cun excludeCombinations
variant-math-exclude-not-implemented = inda nun stan feitas las bariantes ounicas dun { $component } de l tipo math cun exclude
variant-non-constant-exclude-not-implemented = inda nun stan feitas las bariantes ounicas dun { $component } cun un exclude nun custante

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: nun ye supuortado ne l renderizador prefigure de l gráfico; çcendente saltado.
prefigure-descendant-invalid-geometry = { $subject }: geometrie nun finita ó ancumpleta; çcendente saltado.
prefigure-curve-label-omitted = { $subject }: las eitiquetas nun son supuortadas ne ls eilementos de curba cumbertidos; eitiqueta omitida.
prefigure-curve-unsupported-definition-type = { $subject }: tipo de defeniçon de funcion de curba nun supuortado '{ $definitionType }'; çcendente saltado.
prefigure-region-flip-functions-unsupported = { $subject }: atributo flipFunctions nun supuortado an regionBetweenCurves; çcendente saltado.
prefigure-region-non-formula-child = { $subject }: solo son supuortados filhos de funcion de l tipo formula an regionBetweenCurves; çcendente saltado.
prefigure-label-position-unsupported =
    { $subject }: labelPosition nun supuortado '{ $labelPosition }' para { $labelKind ->
        [line-family] ua eitiqueta de la famílhia de las lhinhas
       *[point] ua eitiqueta de punto
    }; a usar l alinhamiento por defeito de l PreFigure.
prefigure-fill-style-unsupported = { $subject }: l stilo de anchimiento '{ $fillStyle }' nun ye supuortado pul PreFigure; a boltar a un anchimiento sólido.
prefigure-line-style-unknown = { $subject }: stilo de lhinha çconhecido '{ $lineStyle }' omitido de la salida PreFigure.
prefigure-marker-style-mapped-to-diamond = { $subject }: stilo de marcador '{ $markerStyle }' cumbertido ne l stilo PreFigure 'diamond'.
prefigure-marker-style-unsupported = { $subject }: l stilo de marcador '{ $markerStyle }' nun ye supuortado pul PreFigure; a usar l stilo por defeito.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` nun bálido; nun se puode resolber l albo. Anotaçon omitida.
annotation-ref-multiple-targets = `<annotation>`: `ref` resolbiu-se an bários albos; a usar l purmeiro.
annotation-ref-outside-graph = `<annotation>`: `ref` nun bálido; l albo stá fuora de l gráfico que l cuntén. Anotaçon omitida.
annotation-ref-unsupported-target = `<annotation>`: `ref` nun bálido; l albo nun ye un oujeto gráfico supuortado na cumberson prefigure. Anotaçon omitida.
annotation-text-missing = `<annotation>`: `text` an falta ó bazio; a mandar testo bazio.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Detetou-se ua dependéncia circular.
       *[other] Detetou-se ua dependéncia circular que anvuolbe un componente `<{ $componentType }>`.
    }
reference-no-referent = Nun se achou niun referente para la referéncia: `{ $reference }`
reference-multiple-referents = Achórun-se bários referentes para la referéncia: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formato nun bálido para l atributo { $attribute } de `<{ $componentType }>`.
children-invalid = Filhos nun bálidos para `<{ $componentType }>`: achórun-se filhos nun bálidos: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Balor nun bálido `{ $value }` para l atributo `{ $attribute }`, a usar l balor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Nun se achou la berson { $version } de l DoenetML.
       *[other] Nun se achou la berson { $version } de l DoenetML. A boltar a la berson { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML nun bálido: { $content }
parse-tag-missing-close-tag = DoenetML nun bálido: L tag `{ $tag }` nun ten tag de cierre. Speraba-se un tag que se cerra a si mesmo ó un tag `</{ $tagName }>`.
parse-tag-error = DoenetML nun bálido: Erro ne l tag `<{ $tagName }>`
parse-attribute-missing-value = DoenetML nun bálido: L atributo nun bálido `{ $attribute }` parece star sin balor.
parse-attribute-invalid = DoenetML nun bálido: Atributo nun bálido `{ $attribute }`
parse-attribute-value-invalid = DoenetML nun bálido: Balor de atributo nun bálido `{ $value }`
parse-attribute-value-quote-mismatch = DoenetML nun bálido: Balor de atributo nun bálido `{ $value }`. Las aspas nun cundízen. Parece que te falta un `{ $quote }`
parse-open-tag-name-missing = DoenetML nun bálido: Achou-se un tag sin nome de tag, por ejemplo `<`
parse-tag-not-closed = DoenetML nun bálido: L tag `{ $tag }` nun fui cerrado (parece que falta un `>`).
parse-self-closing-tag-name-missing = DoenetML nun bálido: Achou-se un tag sin nome de tag `<{ $content }>`
parse-self-closing-tag-not-closed = DoenetML nun bálido: L tag `{ $tag }` nun fui cerrado (parece que falta un `/>`).
parse-tag-invalid-attributes = DoenetML nun bálido: L tag `{ $tag }` nun ye bálido. Puode tener atributos errados.
parse-close-tag-name-missing = DoenetML nun bálido: Achou-se un tag de cierre sin nome de tag, por ejemplo `</`
parse-attribute-value-unquoted = Ls balores de ls atributos ténen de star antre aspas: `{ $attribute }="{ $value }"`
parse-close-tag-without-open-tag = DoenetML nun bálido: Achou-se l tag de cierre `{ $tag }`, mas nun hai un tag de abertura correspundente
parse-close-tag-mismatched = DoenetML nun bálido: Tag de cierre que nun cundiç. Speraba-se `</{ $expected }>`. Achou-se `{ $found }`
parser-node-unconvertible = Nun fui possible cumbertir l nó { $node } nun nó Dast.

## Names

name-attribute-invalid =
    Atributo name='{ $name }' nun bálido. { $reason ->
        [characters] Ls nomes solo puoden tener lhetras, números, sublinhados ó trações.
       *[start] Ls nomes ténen de ampeçar cun ua lhetra.
    }
component-name-invalid-start = Nome de componente nun bálido "{ $name }". Ls nomes ténen de ampeçar cun ua lhetra.

## `<answer>` sugar

answer-video-watched-missing-video = Ua repuosta de l tipo videoWatched ten de tener un atributo video
answer-video-watched-video-not-reference = Ua repuosta de l tipo videoWatched ten de tener un atributo video que seia ua referéncia
answer-name-not-single-text = L atributo nome de la repuosta ten de tener un solo filho de testo

## Referencing another document

external-doenetml-recursion-limit = Nun fui possible ir buscar l DoenetML sterno por haber nibles de recurson de mais. Haberá ua referéncia circular?
external-doenetml-unavailable = Nun fui possible ir buscar l DoenetML an { $attribute }="{ $uri }"
external-doenetml-type-mismatch = L DoenetML recebido de { $attribute }="{ $uri }" nun ye bálido: nun cundiç cul tipo de componente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L atributo `{ $from }` stá çcuntinuado; usa `{ $to }` an beç desso.
       *[other] [deprecation] L atributo `{ $from }` an `<{ $component }>` stá çcuntinuado; usa `{ $to }` an beç desso.
    }
deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L atributo `{ $from }` stá çcuntinuado i ye einorado porque `{ $to }` tamien stá specificado.
       *[other] [deprecation] L atributo `{ $from }` an `<{ $component }>` stá çcuntinuado i ye einorado porque `{ $to }` tamien stá specificado.
    }
deprecated-attribute-ignored = [deprecation] L atributo `{ $attribute }` an `<{ $component }>` stá çcuntinuado i ye einorado.
deprecated-attribute-to-child = [deprecation] L atributo `{ $attribute }` an `<{ $component }>` stá çcuntinuado; usa un filho `<{ $child }>` an beç desso.
deprecated-attribute-value-renamed = [deprecation] L balor `{ $value }` de l atributo `{ $attribute }` an `<{ $component }>` stá çcuntinuado; usa `{ $to }` an beç desso.


## Language coverage

pluralize-english-only = `<pluralize>` solo puode poner ne l plural an anglés, portanto l sou testo queda cumo stá nun documento screbido an { $locale }. Screbe la forma de l plural dreitamente ó pon-la cul atributo `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L eilemento `<{ $tag }>` nun ye un eilemento Doenet reconhecido.
schema-element-not-allowed-at-root = L eilemento `<{ $tag }>` nun ye premitido na raiç de l documento.
schema-element-not-allowed-inside = L eilemento `<{ $tag }>` nun ye premitido andrento de `<{ $parent }>`.
schema-attribute-unrecognized = L eilemento `<{ $tag }>` nun ten un atributo chamado `{ $attribute }`.
schema-attribute-value-not-allowed =
    { $isList ->
        [true] L atributo `{ $attribute }` de l eilemento `<{ $tag }>` ten de ser ua lhista an que cada item seia un de: { $allowed }
       *[other] L atributo `{ $attribute }` de l eilemento `<{ $tag }>` ten de ser un de: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nome de bariante nun bálido para select. L nome de bariante { $variantName } aparece an { $numOptions } oupçones mas l número a scolher ye { $numToSelect }.
select-variant-name-without-options = Stan specificadas bariantes para select mas nun stan specificadas oupçones para l possible nome de bariante: { $variantName }.
select-variant-name-not-possible = L nome de bariante { $variantName } specificado para select nun ye un nome de bariante possible.
select-too-few-options = Nun se puoden scolher { $numToSelect } componentes de solo { $numOptions }.
select-from-sequence-too-few-values = Nun se puoden scolher { $numToSelect } balores dua seqüéncia de cumprimiento { $length }.
select-from-sequence-indices-count-mismatch = L número de índices specificados para select ten de cundizir cul número a scolher
select-from-sequence-indices-not-integers = Todos ls índices specificados para select ténen de ser números anteiros
select-from-sequence-index-excluded = Fui specificado un índice de selectfromsequence que staba scluído
select-from-sequence-indices-excluded-combination = Fúrun specificados índices de selectfromsequence que éran ua cumbinaçon scluída
select-from-sequence-coprime-not-positive-integers = Nun se puoden scolher cumbinaçones coprime puis que nun se stan a scolher números anteiros positibos.
select-from-sequence-coprime-common-factor = Nun se puoden scolher números coprime. Todos ls balores possibles ténen un fator quemun. (Ls balores specificados de "from" ó "to" ténen de ser coprime cun "step".)
select-from-sequence-coprime-single-number = Nun se puoden scolher cumbinaçones coprime dun solo número que nun seia 1.
select-from-sequence-excluded-too-many-combinations = Fúrun scluídas mais de 70% de las cumbinaçones an selectFromSequence
select-from-sequence-coprime-none-found = Nun fui possible scolher números coprime. Todos ls balores possibles ténen un fator quemun.
select-from-sequence-too-few-unique-values = Nun se puoden scolher { $numToSelect } balores ounicos dua seqüéncia de cumprimiento { $numPossibleValues }
select-prime-numbers-too-few-values = Nun se puoden scolher { $numToSelect } balores dua lhista de primos de cumprimiento { $numValues }
select-prime-numbers-values-count-mismatch = L número de balores specificados para select ten de cundizir cul número a scolher
select-prime-numbers-values-not-prime = Todos ls balores specificados para scolher un número primo ténen de star na lhista de primos
select-prime-numbers-values-excluded-combination = Ls balores specificados de selectPrimeNumbers éran ua cumbinaçon scluída
select-prime-numbers-excluded-too-many-combinations = Fúrun scluídas mais de 70% de las cumbinaçones an selectPrimeNumbers
select-random-combination-fluke = Por un acaso mui pouco probable, nun fui possible scolher ua cumbinaçon de balores al acaso
select-random-value-fluke = Por un acaso mui pouco probable, nun fui possible scolher un balor al acaso

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Este `<{ $component }>` nun ye amostrado porque stá andrento de matemática i nun ye `inline`. Acrecenta `inline` para que se torne ua lhista pendente, que cabe andrento dua spresson.
        [expanded] Este `<{ $component }>` nun ye amostrado porque stá andrento de matemática i ye `expanded`. Tira `expanded`; ua caixa de bárias lhinhas nun cabe andrento dua spresson.
        [on-graph] Este `<{ $component }>` nun ye amostrado porque stá andrento de matemática çenhada nun gráfico, que nun ten spácio para un input.
       *[relative-width] Este `<{ $component }>` nun ye amostrado porque stá andrento de matemática i ten ua lhargura relatiba. Dá la lhargura an ounidades absolutas, cumo `px`, an beç desso.
    }
