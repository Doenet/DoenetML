# Aragonese (aragonés) diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script in the Academia de l'Aragonés / EFA
# *Propuesta ortografica* (2010) — ⟨ny⟩ not ⟨ñ⟩, etymological ⟨v⟩, articles
# «o / a / os / as» with the contractions «d'o», «d'a». See `chrome.ftl`.
# Numbers render in Latin digits.
#
# **What makes these sentences Aragonese rather than Spanish** is the copula
# «ye», the modal «no se puet», «cal» for *must*, «tien» and «ha», «i hai» for
# *there is*, «u» for *or*, «garra» for *no/any*, «encara» for *yet*, and the
# **-au / -ada** participles («trobau», «especificau», «ignorau»). A sentence
# in this file without one of those markers is very likely still Spanish, and
# that is the quickest check a reviewer has.
#
# **What is borrowed.** The whole technical register — «atributo»,
# «component», «variable d'estau», «matriz», «dominio», «intervalo»,
# «secuencia», «coprimo», «contraste» — is the learned Romance vocabulary an
# Aragonese speaker meets through **Spanish**, the language of schooling in
# Aragón. It is borrowed openly; there is no Aragonese computing register to
# take it from.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names.
#
# **Counts.** CLDR has plural rules for `an`, with the categories `one` and
# `other`, so every `[one]` / `*[other]` select English writes here is kept and
# is genuinely selected by Aragonese rules. Every **symbolic** selector —
# `$type`, `$mode`, `$reason`, `$context`, `$suggestion`, `$alternative`,
# `$fallback`, `$expected`, `$labelKind`, `$isList`, `$componentType` — is kept
# byte for byte from English, keys included.
#
# **Weakest first.** The verbal periphrases for *cannot* and *have not
# implemented* («no se puet», «encara no s'ha feito») are repeated a hundred
# times; if a speaker prefers another wording, changing it here changes the
# tone of the whole file.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } s'ignora cuan s'especifican dos estremos
       *[other] { $attributes } s'ignoran cuan s'especifican dos estremos
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } s'ignora cuan s'especifican un estremo y un punto meyo
       *[other] { $attributes } s'ignoran cuan s'especifican un estremo y un punto meyo
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset no fa cosa sin un punto meyo

## `<line>`

line-points-undetermined-dimensions = Linia por puntos de dimensions no determinadas.

line-points-too-few-dimensions = A linia ha de pasar por puntos d'a lo menos dos dimensions.

line-points-depend-on-variables = A linia pasa por puntos que dependen d'as variables: { $variables }.

line-equation-invalid-format = Formato no valido ta la ecuación d'a linia en as variables { $variable1 } y { $variable2 }.

## `<ray>`

ray-overprescribed-through = A semirrecta ye definida por through, endpoint y direction.  S'ignora o through especificau.

ray-dimension-mismatch = numDimensions no concuerda en a semirrecta.

## `<vector>`

vector-overprescribed-head = O vector ye definiu por head, tail y displacement.  S'ignora o head especificau.

vector-dimension-mismatch = numDimensions no concuerda en o vector.

## Attracting and constraining

attract-to-without-nearest-point = No se puet atrayer enta un `<{ $component }>`, ya que no tien a variable d'estau nearestPoint.

constrain-to-without-nearest-point = No se puet restrinyir a un `<{ $component }>`, ya que no tien a variable d'estau nearestPoint.

constrain-to-interior-without-nearest-point = No se puet restrinyir a l'interior d'un `<{ $component }>`, ya que no tien a variable d'estau nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition s'ignora en un choiceInput que no ye inline

## Ordering children by index

choice-input-indices-count-mismatch = S'ignoran os indices especificaus ta choiceInput porque o numero d'indices no concuerda con o numero de fillos choice.

pretzel-indices-count-mismatch = S'ignoran os indices especificaus ta problem porque o numero d'indices no concuerda con o numero de fillos problem.

shuffle-indices-count-mismatch = S'ignoran os indices especificaus ta shuffle porque o numero d'indices no concuerda con o numero de components.

indices-ignored-out-of-range = S'ignoran os indices especificaus ta { $component } porque bells indices son difuera d'o rango.

pretzel-indices-repeated = S'ignoran os indices especificaus ta pretzel porque bells indices son repetius.

pretzel-circuit-first-index = S'ignoran os indices especificaus ta pretzel en modo circuit porque o primer indice cal que siga 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ta que `<{ $component }>` funcione con fillos de texto, cal especificar un atributo `type`.

invalid-type-defaulting-to-math = Tipo { $type } no valido ta lo component { $component }. Ha de ser un d'istos: math, text, number u boolean. S'emplega math.

string-not-valid-component-to-arrange = A cadena "{ $value }" no ye un component valido ta { $component }. S'ignora.

## Types and variables

invalid-type-defaulting-to-number = Tipo { $type } no valido, se mete o tipo a number.

invalid-variable-value = Valor no valido d'una variable: `{ $value }`

## Variants

variant-index-must-be-number = L'indice de variant { $index } ha de ser un numero

variant-index-must-be-integer = L'indice de variant { $index } ha de ser un numero entero

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` no ye feito ta midas absolutas. Se metén as amplarias en relativas.

side-by-side-absolute-margins = `<{ $component }>` no ye feito ta midas absolutas. Se metén os marguins en relativos.

side-by-side-no-block-child = `<{ $component }>` no valido: cal que tienga a lo menos un fillo de bloque.

## `<label>`

label-for-ignored-on-graphical = L'atributo `for` en una `<label>` grafica s'ignora.

label-for-must-resolve-to-one = L'atributo `for` en `<label>` ha de resolver-se en un solo component.

label-for-unresolved = L'atributo `for` en `<label>` no s'ha puesto resolver en un component.

label-for-answer-with-authored-inputs = L'atributo `for` en `<label>` fa referencia a un `<answer>` con dentradas escritas por l'autor; fe referencia dreitament a la dentrada.

label-for-answer-without-input = L'atributo `for` en `<label>` fa referencia a un `<answer>` sin garra dentrada que etiquetar.

label-for-must-reference-input-or-answer = L'atributo `for` en `<label>` ha de fer referencia a una dentrada u a una respuesta.

## Accessibility

accessibility-short-description-or-decorative = Ta l'accesibilidat, `<{ $component }>` cal que tienga una descripción curta u que siga marcau como decorativo.

accessibility-video-short-description = Ta l'accesibilidat, `<video>` cal que tienga una descripción curta.

accessibility-input-short-description-or-label = Ta l'accesibilidat, `<{ $component }>` cal que tienga una descripción curta u una etiqueta.

accessibility-answer-input-short-description-or-label = Ta l'accesibilidat, un `<answer>` que creya una dentrada cal que tienga una descripción curta u una etiqueta.

accessibility-short-description-contains-math = As descripcions curtas no habrían de contener components matematicos como `<{ $component }>`. Escribe a matematica con parolas.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } no tien contraste prou ta lo texto d'o titol d'a sección (modo escuro) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; cal a lo menos { $threshold }:1).
       *[other] { $colorName } no tien contraste prou ta lo texto d'o titol d'a sección ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; cal a lo menos { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Encara no s'ha feito un `<circle>` por { $count } puntos en o caso que os puntos no tiengan valors numericas.

circle-too-many-through-points = No se puet calcular un cerclo por mas de 3 puntos.

circle-overprescribed-radius-center-points = No se puet calcular un cerclo con radio, centro y puntos de paso especificaus.

circle-center-with-multiple-points = No se puet calcular un cerclo con o centro especificau que pase por mas d'1 punto.

circle-radius-too-small = No se puet calcular o cerclo: dau que a distancia entre os dos puntos ye { $distance }, o radio especificau { $radius } ye massa chicot.

circle-radius-with-many-points = No se puet crear un cerclo por mas de dos puntos con un radio especificau.

circle-invalid-center-or-through-points = Centro u puntos de paso d'o cerclo no validos.

circle-radius-center-with-multiple-points = No se puet calcular o radio d'un cerclo con o centro especificau que pase por mas d'1 punto.

circle-change-radius-non-numerical = No se puet cambiar o radio d'un cerclo con puntos de paso no numericos

circle-radius-with-points-non-numerical = No se puet crear un cerclo por mas d'un punto con un radio especificau cuan no i hai valors numericas.

circle-change-center-non-numerical = Encara no s'ha feito o cambio d'o centro d'un cerclo por puntos con valors no numericas.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensions insuficients ta lo dominio d'a función. O dominio tien { $intervals } intervalo pero a función tien { $inputs ->
            [one] { $inputs } dentrada
           *[other] { $inputs } dentradas
        }.
       *[other] Dimensions insuficients ta lo dominio d'a función. O dominio tien { $intervals } intervalos pero a función tien { $inputs ->
            [one] { $inputs } dentrada
           *[other] { $inputs } dentradas
        }.
    }

function-domain-invalid-format = Formato no valido ta lo dominio d'a función.

function-ignoring-non-numerical =
    { $type ->
        [maximum] S'ignora un masimo no numerico d'a función.
        [minimum] S'ignora un minimo no numerico d'a función.
        [extremum] S'ignora un estremo no numerico d'a función.
        [point] S'ignora un punto no numerico d'a función.
        [slope] S'ignora una pendient no numerica d'a función.
       *[other] S'ignora un { $type } no numerico d'a función.
    }

function-ignoring-empty =
    { $type ->
        [maximum] S'ignora un masimo buedo d'a función.
        [minimum] S'ignora un minimo buedo d'a función.
        [extremum] S'ignora un estremo buedo d'a función.
        [point] S'ignora un punto buedo d'a función.
       *[other] S'ignora un { $type } buedo d'a función.
    }

function-points-too-close = A función tien dos puntos massa amanaus l'un a l'atro. No se puet definir a función.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] As iteracions d'una función nomás son posibles si o numero de dentradas ye igual a lo numero de salidas. Ista función tien { $inputs } dentrada y { $outputs ->
            [one] { $outputs } salida
           *[other] { $outputs } salidas
        }.
       *[other] As iteracions d'una función nomás son posibles si o numero de dentradas ye igual a lo numero de salidas. Ista función tien { $inputs } dentradas y { $outputs ->
            [one] { $outputs } salida
           *[other] { $outputs } salidas
        }.
    }

## `<sequence>`

sequence-invalid-length = Longaria no valida d'a secuencia.  Cal que siga un numero entero no negativo.

sequence-invalid-step = Paso no valido d'a secuencia.  Cal que siga un numero ta una secuencia de tipo { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" no valido d'una secuencia de numeros.  Cal que siga un numero.

sequence-invalid-endpoint-letters = "{ $attribute }" no valido d'una secuencia de letras.  Cal que siga una combinación de letras.

sequence-invalid-endpoint = "{ $attribute }" d'a secuencia no valido.

select-from-sequence-coprime-not-numbers = s'ignora coprime porque no se trigan numeros

select-from-sequence-coprime-with-exclude-combinations = s'ignora coprime porque s'ha especificau excludeCombinations

## Resolving a `target`

target-not-found = target no valido ta `<{ $source }>`: no se troba o destino.

target-state-variable-not-found = target no valido ta `<{ $source }>`: no se troba garra variable d'estau clamada "{ $property }" en un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = As variables de `<odeSystem>` han de ser diferents d'a variable independient.

ode-system-duplicate-variable-names = No se pueden definir as funcions RHS d'a EDO con nombres de variables dependients repetius.

ode-system-rhs-function-error = No se puet definir a función RHS d'a EDO.  Error creyando a función mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = No se puet definir un anglo entre { $count } linias

angle-invalid-through-point = Punto no valido en through de `<angle>`

parabola-vertex-too-many-points = Encara no s'ha feito una parabola con vertiz por mas d'1 punto.

parabola-too-many-points = Encara no s'ha feito una parabola por mas de 3 puntos.

intersection-too-many-items = Encara no s'ha feito a intersección de mas de dos elementos

## Other math components

ionic-compound-not-two-ions = Encara no s'ha feito un compuesto ionico d'atra cosa que dos ions.

ionic-compound-needs-cation-and-anion = O compuesto ionico nomás ye feito ta un catión y un anión.

solve-equations-cannot-evaluate = No se puet resolver a ecuación porque no s'ha puesto evaluar: { $equation }

math-operators-operand-number-required = Cal especificar un operandNumber ta estrayer un operando matematico.

eigen-decomposition-failed = No s'han puesto calcular os valors propios d'a matriz

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: o parametro { $parameters } no amaneix en o patrón, asinas que siempre concordará con un buedo.
       *[other] `<matchesPattern>`: os parametros { $parameters } no amaneixen en o patrón, asinas que siempre concordarán con un buedo.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: no se puet interpretar grid="{ $grid }". Cal que siga none, medium, dense u dos numeros positivos deseparaus por un espacio, como grid="1 0.5". No se dibuixa garra quadricula.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` amenista una función con { $expected ->
        [one] una salida, a pendient y' en cada punto, como `y - x`
       *[other] dos salidas, o vector en cada punto, como `(y, -x)`
    }, pero a función que se le ha dau tien { $found ->
        [one] { $found } salida
       *[other] { $found } salidas
    }. { $alternative ->
        [none] No se dibuixa cosa.
       *[other] `<{ $alternative }>` ye o component ta ixa función. No se dibuixa cosa.
    }

field-function-attribute-ignored-with-child = L'atributo `function` s'ignora porque a función se da tamién adentro d'o component; s'emplega a de adentro. Da a función nomás d'una d'as dos trazas.

field-variables-ignored =
    `<{ $component }>`: l'atributo `variables` nombra as variables d'una espresión escrita dreitament adentro d'o component. { $reason ->
        [function-child] Aquí a función se da como fillo `<function>`, que nombra as suyas propias variables, asinas que s'ignora `variables`.
       *[no-expression] Aquí no se da garra espresión d'ixe tipo, asinas que s'ignora `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" no ye suportau en o renderizador prefigure; s'emplega o comportamiento d'a posición a la dreita.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" no ye suportau en o renderizador prefigure; s'emplega o comportamiento d'a posición alto.

prefigure-invalid-axis-bounds = `<graph>`: limites d'os eixes no validos ta la conversión prefigure; s'emplega o bbox predeterminau (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: amplaria no valida ta la conversión prefigure; s'emplega l'amplaria predeterminada d'o diagrama 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio no valido ta la conversión prefigure; s'emplega a proporción predeterminada 1.

prefigure-grid-spacing-too-fine = `<graph>`: a separación d'a quadricula ye massa fina ta os limites d'os eixes; a quadricula se deixa difuera en o renderizador prefigure.

prefigure-annotations-not-rendered = `<graph>`: as anotacions no se dibuixan si no s'emplega o renderizador PreFigure.

multiple-annotations-children = S'han trobau cuantos fillos `<annotations>` en `<graph>`; s'ignoran toz fueras d'o zaguer.

## Referring to other components

copy-unrecognized-component-type = No se puet estender u copiar un tipo de component no reconoixiu: { $type }.

copy-prop-not-found = No s'ha trobau a propiedat { $property } en un component de tipo { $component }

collect-no-source = No s'ha trobau garra fuent ta collect.

collect-invalid-component-type = No se pueden replegar components de tipo `<{ $component }>` porque ye un tipo de component no valido.

reference-index-unavailable = No se puet fer referencia a l'indice `{ $reference }`

## `<callAction>`

component-action-unavailable = No se puet clamar { $action } en o component `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = As datos tienen una forma no valida.  As ringleras tienen longarias diferents. Trobau en componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = As datos tienen nombres de columna repetius.  Trobau en componentIdx :{ $componentIdx }

data-frame-missing-column-name = A las datos les manca un nombre de columna.  Trobau en componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un premio d'ista respuesta se basa en a respuesta ninviada por la propia etiqueta answer, y ixo levará a un comportamiento inesperau.

answer-max-num-attempts-in-section-wide-check-work = Meter `maxNumAttempts` en un `<answer>` adentro d'un contenedor con `sectionWideCheckWork` no fa cosa, porque o numero d'intentos ye controlau por o contenedor. Mete `maxNumAttempts` en o contenedor en cuenta.

nested-section-wide-check-work-max-num-attempts = Meter `maxNumAttempts` en un contenedor con `sectionWideCheckWork` que ye adentro d'atro contenedor con `sectionWideCheckWork` no fa cosa, porque o numero d'intentos ye controlau por o contenedor esterior. Mete `maxNumAttempts` en o contenedor esterior en cuenta.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L'atributo { $attributes } no fará cosa sin symbolicEquality especificau.
       *[other] Os atributos { $attributes } no farán cosa sin symbolicEquality especificau.
    }

answer-invalid-type = Tipo no valido ta la respuesta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Como que o component `<{ $component }>` no tien nombre, no se puet emplegar como atributo d'un modulo

module-attribute-name-already-defined = O component `<{ $component } name="{ $name }">` no se puet emplegar como atributo d'un modulo porque o tipo de component `<module>` ya tien un atributo "{ $name }" definiu.

conditional-content-condition-ignored = L'atributo `condition` s'ignora en un component `<conditionalContent>` con fillos case u else.

slider-markers-type-mismatch = O tipo d'os marcadors no concuerda con o tipo d'o slider.

pretzel-problem-needs-statement-and-answer = pretzel no valido: cada `<problem>` cal que tienga un `<statement>` y un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel no valido: en mode="circuit", o primer `<problem>` no puet ser un distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valor no valida { $values } ta l'atributo `{ $attribute }`; s'ignora.
       *[other] Valors no validas { $values } ta l'atributo `{ $attribute }`; s'ignoran.
    }

attribute-must-be-references = Valor no valida `{ $value }` ta l'atributo `{ $attribute }`. L'atributo ha de ser feito de referencias que prencipien con un `$`.

math-input-invalid-function-names = <mathInput>: s'han ignorau nombres de función no validos en { $attribute }: { $names }. O troz amostrau de cada nombre cal que tienga a lo menos 2 caracters (letras u guions); dimpués puet venir un sufixo opcional `|<alternativa mathspeak>`.

## Building components from the source

component-type-invalid = Tipo de component no valido: `<{ $componentType }>`

attribute-repeated = No se puet repetir l'atributo { $attribute }.

attribute-invalid-for-component = Atributo "{ $attribute }" no valido ta un component de tipo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    A definición d'estilo { $styleNumber } no tien contraste prou ta { $context ->
        [text-on-background] o color d'o texto contra o color d'o fondo
        [high-contrast] o color d'alto contraste contra o lienzo
        [line] o color d'a linia contra o lienzo
        [marker] o color d'o marcador contra o lienzo
       *[text-on-canvas] o color d'o texto contra o lienzo
    }{ $mode ->
        [dark] { " (modo escuro)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; cal a lo menos { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Encara que a definición d'estilo { $styleNumber } tienga colors que dan contraste prou ta lo modo claro, os colors ta lo modo escuro derivaus d'ixas valors no tienen contraste prou entre o color d'o texto y o color d'o fondo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; cal a lo menos { $threshold }:1). { $suggestion ->
        [available] Ta guarenciar contraste prou en o modo escuro, u aumenta o contraste d'o modo claro (p. ex. mete { $lightAttribute }="{ $lightColor }") u sobrescribe o color d'o modo escuro (p. ex. mete { $darkAttribute }="{ $darkColor }").
       *[none] Ta guarenciar contraste prou en o modo escuro, aumenta o contraste d'o modo claro u sobrescribe os colors derivaus con textColorDarkMode y/u backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Encara que a definición d'estilo { $styleNumber } tienga un color de texto que da contraste prou ta lo modo claro, o color d'o texto ta lo modo escuro derivau d'ixa valor no tien contraste prou contra o lienzo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; cal a lo menos { $threshold }:1). { $suggestion ->
        [available] Ta guarenciar contraste prou en o modo escuro, u aumenta o contraste d'o modo claro (p. ex. mete textColor="{ $lightColor }") u sobrescribe o color d'o modo escuro (p. ex. mete textColorDarkMode="{ $darkColor }").
       *[none] Ta guarenciar contraste prou en o modo escuro, aumenta o contraste d'o modo claro u sobrescribe o color derivau con textColorDarkMode.
    }

section-multiple-style-palettes = Una sección nomás puet trigar un <stylePalette>; s'emplega o zaguer.

## Unique variants

variant-num-to-select-not-non-negative-integer = no se pueden determinar as variants unicas de { $component } porque numToSelect no ye un numero entero no negativo.

variant-num-to-select-not-constant-number = no se pueden determinar as variants unicas de { $component } porque numToSelect no ye un numero constant.

variant-with-replacement-not-constant-boolean = no se pueden determinar as variants unicas de { $component } porque withReplacement no ye un boolean constant.

variant-select-weight-disables-unique = As variants unicas ta select se desactivan si bella opción tien selectWeight u selectForVariants especificau

variant-coprime-undetermined = no se pueden determinar as variants unicas de { $component } porque no se puet determinar que coprime siga siempre falso.

variant-attribute-not-constant = no se pueden determinar as variants unicas de { $component } porque { $attribute } no ye una constant.

variant-attribute-not-number = no se pueden determinar as variants unicas de { $component } porque { $attribute } no ye un numero.

variant-attribute-wrong-type-for-sequence =
    no se pueden determinar as variants unicas de { $component } de tipo { $type } porque { $attribute } no ye { $expected ->
        [letters-combination] una combinación de letras
        [math-expression] una espresión matematica valida
        [integer] un numero entero
       *[number] un numero
    }.

variant-length-not-integer = no se pueden determinar as variants unicas de { $component } porque length no ye un numero entero.

variant-sort-not-implemented = encara no s'han feito as variants unicas d'un { $component } con sort

variant-exclude-combinations-not-implemented = encara no s'han feito as variants unicas d'un { $component } con excludeCombinations

variant-math-exclude-not-implemented = encara no s'han feito as variants unicas d'un { $component } de tipo math con exclude

variant-non-constant-exclude-not-implemented = encara no s'han feito as variants unicas d'un { $component } con un exclude no constant

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: no ye suportau en o renderizador prefigure d'a grafica; se salta o descendient.

prefigure-descendant-invalid-geometry = { $subject }: cheometria no finita u incompleta; se salta o descendient.

prefigure-curve-label-omitted = { $subject }: as etiquetas no son suportadas en os elementos de curva convertius; a etiqueta se deixa difuera.

prefigure-curve-unsupported-definition-type = { $subject }: tipo de definición de curva '{ $definitionType }' no suportau; se salta o descendient.

prefigure-region-flip-functions-unsupported = { $subject }: atributo flipFunctions no suportau en regionBetweenCurves; se salta o descendient.

prefigure-region-non-formula-child = { $subject }: nomás se suportan as funcions fillas de tipo formula en regionBetweenCurves; se salta o descendient.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' no suportau ta { $labelKind ->
        [line-family] una etiqueta d'a familia d'as linias
       *[point] una etiqueta de punto
    }; s'emplega l'alineación predeterminada de PreFigure.

prefigure-fill-style-unsupported = { $subject }: l'estilo de replén '{ $fillStyle }' no ye suportau por PreFigure; se torna a un replén pleno.

prefigure-line-style-unknown = { $subject }: estilo de linia desconoixiu '{ $lineStyle }' deixau difuera d'a salida de PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: l'estilo de marcador '{ $markerStyle }' s'ha mapiau a l'estilo PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: l'estilo de marcador '{ $markerStyle }' no ye suportau por PreFigure; s'emplega l'estilo predeterminau.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` no valido; no se puet resolver o destino. S'omite l'anotación.

annotation-ref-multiple-targets = `<annotation>`: `ref` s'ha resuelto en cuantos destinos; s'emplega o primero.

annotation-ref-outside-graph = `<annotation>`: `ref` no valido; o destino ye difuera d'a grafica que lo contién. S'omite l'anotación.

annotation-ref-unsupported-target = `<annotation>`: `ref` no valido; o destino no ye un obchecto grafico suportau en a conversión prefigure. S'omite l'anotación.

annotation-text-missing = `<annotation>`: `text` manca u ye buedo; se da texto buedo.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] S'ha detectau una dependencia circular.
       *[other] S'ha detectau una dependencia circular que implica un component `<{ $componentType }>`.
    }

reference-no-referent = No s'ha trobau garra referent ta la referencia: `{ $reference }`

reference-multiple-referents = S'han trobau cuantos referents ta la referencia: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formato no valido ta l'atributo { $attribute } de `<{ $componentType }>`.

children-invalid = Fillos no validos ta `<{ $componentType }>`: s'han trobau fillos no validos: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valor no valida `{ $value }` ta l'atributo `{ $attribute }`, s'emplega a valor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] No s'ha trobau a versión de DoenetML { $version }.
       *[other] No s'ha trobau a versión de DoenetML { $version }. Se torna a la versión { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML no valido: { $content }

parse-tag-missing-close-tag = DoenetML no valido: L'etiqueta `{ $tag }` no tien etiqueta de zarradura. S'asperaba una etiqueta que se zarre ella misma u una etiqueta `</{ $tagName }>`.

parse-tag-error = DoenetML no valido: Error en a etiqueta `<{ $tagName }>`

parse-attribute-missing-value = DoenetML no valido: Pareix que a l'atributo no valido `{ $attribute }` le manca una valor.

parse-attribute-invalid = DoenetML no valido: Atributo no valido `{ $attribute }`

parse-attribute-value-invalid = DoenetML no valido: Valor d'atributo no valida `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML no valido: Valor d'atributo no valida `{ $value }`. As cometas no concuerdan. Pareix que te manca un `{ $quote }`

parse-open-tag-name-missing = DoenetML no valido: S'ha trobau una etiqueta sin nombre d'etiqueta, p. ex. `<`

parse-tag-not-closed = DoenetML no valido: L'etiqueta `{ $tag }` no s'ha zarrau (pareix que manca un `>`).

parse-self-closing-tag-name-missing = DoenetML no valido: S'ha trobau una etiqueta sin nombre d'etiqueta `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML no valido: L'etiqueta `{ $tag }` no s'ha zarrau (pareix que manca `/>`).

parse-tag-invalid-attributes = DoenetML no valido: L'etiqueta `{ $tag }` no ye valida. Puet que tienga atributos incorrectos.

parse-close-tag-name-missing = DoenetML no valido: S'ha trobau una etiqueta de zarradura sin nombre d'etiqueta, p. ex. `</`

parse-attribute-value-unquoted = As valors d'os atributos han d'ir entre cometas: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML no valido: S'ha trobau a etiqueta de zarradura `{ $tag }`, pero garra etiqueta d'ubertura correspondient

parse-close-tag-mismatched = DoenetML no valido: Etiqueta de zarradura que no concuerda. S'asperaba `</{ $expected }>`. S'ha trobau `{ $found }`

parser-node-unconvertible = No s'ha puesto convertir o nodo { $node } en un nodo Dast.

## Names

name-attribute-invalid =
    Atributo no valido name='{ $name }'. { $reason ->
        [characters] Os nombres nomás pueden tener letras, numeros, guions baixos u guions.
       *[start] Os nombres han de prencipiar con una letra.
    }

component-name-invalid-start = Nombre de component no valido "{ $name }". Os nombres han de prencipiar con una letra.

## `<answer>` sugar

answer-video-watched-missing-video = Una respuesta de tipo videoWatched cal que tienga un atributo video

answer-video-watched-video-not-reference = Una respuesta de tipo videoWatched cal que tienga un atributo video que siga una referencia

answer-name-not-single-text = L'atributo name d'a respuesta cal que tienga un solo fillo de texto

## Referencing another document

external-doenetml-recursion-limit = No se puet obtener o DoenetML esterno por massa libels de recursión. I hai bella referencia circular?

external-doenetml-unavailable = No se puet obtener o DoenetML de { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML no valido obteniu de { $attribute }="{ $uri }": no concordaba con o tipo de component "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L'atributo `{ $from }` ye obsoleto; emplega `{ $to }` en cuenta.
       *[other] [deprecation] L'atributo `{ $from }` en `<{ $component }>` ye obsoleto; emplega `{ $to }` en cuenta.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L'atributo `{ $from }` ye obsoleto y s'ignora porque tamién s'ha especificau `{ $to }`.
       *[other] [deprecation] L'atributo `{ $from }` en `<{ $component }>` ye obsoleto y s'ignora porque tamién s'ha especificau `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] L'atributo `{ $attribute }` en `<{ $component }>` ye obsoleto y s'ignora.

deprecated-attribute-to-child = [deprecation] L'atributo `{ $attribute }` en `<{ $component }>` ye obsoleto; emplega en cuenta un fillo `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] A valor `{ $value }` de l'atributo `{ $attribute }` en `<{ $component }>` ye obsoleta; emplega `{ $to }` en cuenta.


## Language coverage

pluralize-english-only = `<pluralize>` nomás puet meter en plural l'anglés, asinas que o suyo texto se deixa tal como ye en un documento escrito en { $locale }. Escribe a forma plural dreitament, u mete-la con l'atributo `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L'elemento `<{ $tag }>` no ye un elemento de Doenet reconoixiu.

schema-element-not-allowed-at-root = L'elemento `<{ $tag }>` no ye premitiu en a radiz d'o documento.

schema-element-not-allowed-inside = L'elemento `<{ $tag }>` no ye premitiu adentro de `<{ $parent }>`.

schema-attribute-unrecognized = L'elemento `<{ $tag }>` no tien garra atributo clamau `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L'atributo `{ $attribute }` de l'elemento `<{ $tag }>` cal que siga una lista an cada elemento siga un d'istos: { $allowed }
       *[other] L'atributo `{ $attribute }` de l'elemento `<{ $tag }>` cal que siga un d'istos: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nombre de variant no valido ta select.  O nombre de variant { $variantName } amaneix en { $numOptions } opcions pero o numero que trigar ye { $numToSelect }.

select-variant-name-without-options = S'han especificau bellas variants ta select pero garra opción ta lo posible nombre de variant: { $variantName }.

select-variant-name-not-possible = O nombre de variant { $variantName } especificau ta select no ye un nombre de variant posible.

select-too-few-options = No se pueden trigar { $numToSelect } components de nomás { $numOptions }.

select-from-sequence-too-few-values = No se pueden trigar { $numToSelect } valors d'una secuencia de longaria { $length }.

select-from-sequence-indices-count-mismatch = O numero d'indices especificaus ta select ha de concordar con o numero que trigar

select-from-sequence-indices-not-integers = Toz os indices especificaus ta select han de ser numeros enteros

select-from-sequence-index-excluded = L'indice especificau de selectfromsequence yera escluyiu

select-from-sequence-indices-excluded-combination = Os indices especificaus de selectfromsequence yeran una combinación escluyida

select-from-sequence-coprime-not-positive-integers = No se pueden trigar combinacions coprimas porque no se trigan numeros enteros positivos.

select-from-sequence-coprime-common-factor = No se pueden trigar numeros coprimos. Todas as valors posibles comparten un factor común. (As valors especificadas de "from" u "to" han de ser coprimas con "step".)

select-from-sequence-coprime-single-number = No se pueden trigar combinacions coprimas d'un solo numero que no siga 1.

select-from-sequence-excluded-too-many-combinations = S'ha escluyiu mas d'o 70% d'as combinacions en selectFromSequence

select-from-sequence-coprime-none-found = No s'han puesto trigar numeros coprimos. Todas as valors posibles comparten un factor común.

select-from-sequence-too-few-unique-values = No se pueden trigar { $numToSelect } valors unicas d'una secuencia de longaria { $numPossibleValues }

select-prime-numbers-too-few-values = No se pueden trigar { $numToSelect } valors d'una lista de numeros primos de longaria { $numValues }

select-prime-numbers-values-count-mismatch = O numero de valors especificadas ta select ha de concordar con o numero que trigar

select-prime-numbers-values-not-prime = Todas as valors especificadas ta trigar numeros primos han d'estar en a lista de numeros primos

select-prime-numbers-values-excluded-combination = As valors especificadas de selectPrimeNumbers yeran una combinación escluyida

select-prime-numbers-excluded-too-many-combinations = S'ha escluyiu mas d'o 70% d'as combinacions en selectPrimeNumbers

select-random-combination-fluke = Por una casualidat estraordinariament improbable, no s'ha puesto trigar una combinación de valors a l'azar

select-random-value-fluke = Por una casualidat estraordinariament improbable, no s'ha puesto trigar una valor a l'azar

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Iste `<{ $component }>` no s'amuestra porque ye adentro d'a matematica y no ye `inline`. Adhibe `inline` ta que se torne una lista desplegable, que cabe adentro d'una espresión.
        [expanded] Iste `<{ $component }>` no s'amuestra porque ye adentro d'a matematica y ye `expanded`. Saca `expanded`; una caixa de cuantas linias no cabe adentro d'una espresión.
        [on-graph] Iste `<{ $component }>` no s'amuestra porque ye adentro d'a matematica dibuixada en una grafica, que no tien puesto ta una dentrada.
       *[relative-width] Iste `<{ $component }>` no s'amuestra porque ye adentro d'a matematica y tien una amplaria relativa. Da l'amplaria en unidatz absolutas, como `px`, en cuenta.
    }
