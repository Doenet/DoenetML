# Occitan diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
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
# Occitan puts a space before `:`, `;`, `?` and `!`, as French does. That
# spacing is punctuation and belongs to this catalog, so it is written out
# rather than added by the code.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } es ignorat quand los dos extrèms son especificats
       *[other] { $attributes } son ignorats quand los dos extrèms son especificats
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } es ignorat quand un extrèm e un mitan son especificats amassa
       *[other] { $attributes } son ignorats quand un extrèm e un mitan son especificats amassa
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset a pas cap d'efièit sens mitan

## `<line>`

line-points-undetermined-dimensions = Drecha passant per de punts de dimensions indeterminadas.

line-points-too-few-dimensions = La drecha deu passar per de punts d'almens doas dimensions.

line-points-depend-on-variables = La drecha passa per de punts que dependon de variablas : { $variables }.

line-equation-invalid-format = Format invalid per l'equacion d'una drecha dins las variablas { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = La semidrecha es determinada per through, endpoint e direction. Lo through especificat es ignorat.

ray-dimension-mismatch = numDimensions concòrda pas dins ray.

## `<vector>`

vector-overprescribed-head = Lo vector es determinat per head, tail e displacement. Lo head especificat es ignorat.

vector-dimension-mismatch = numDimensions concòrda pas dins vector.

## Attracting and constraining

attract-to-without-nearest-point = Impossible d'atirar cap a un `<{ $component }>` perque a pas de variabla d'estat nearestPoint.

constrain-to-without-nearest-point = Impossible de restrénher a un `<{ $component }>` perque a pas de variabla d'estat nearestPoint.

constrain-to-interior-without-nearest-point = Impossible de restrénher a l'interior d'un `<{ $component }>` perque a pas de variabla d'estat nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition es ignorat per un choiceInput que non es inline

## Ordering children by index

choice-input-indices-count-mismatch = Los indèxes especificats per choiceInput son ignorats perque lor nombre correspond pas al nombre d'enfants choice.

pretzel-indices-count-mismatch = Los indèxes especificats per problem son ignorats perque lor nombre correspond pas al nombre d'enfants problem.

shuffle-indices-count-mismatch = Los indèxes especificats per shuffle son ignorats perque lor nombre correspond pas al nombre de components.

indices-ignored-out-of-range = Los indèxes especificats per { $component } son ignorats perque d'unes son fòra de portada.

pretzel-indices-repeated = Los indèxes especificats per pretzel son ignorats perque d'unes se repetisson.

pretzel-circuit-first-index = Los indèxes especificats per pretzel en mòde circuit son ignorats perque lo primièr indèx deu èsser 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Per que `<{ $component }>` foncione amb d'enfants tèxte, un atribut `type` deu èsser especificat.

invalid-type-defaulting-to-math = type { $type } invalid pel component { $component }. Deu èsser math, text, number o boolean. Es plaçat sus math.

string-not-valid-component-to-arrange = Lo tèxte "{ $value }" es pas un component valid per { $component }. Es ignorat.

## Types and variables

invalid-type-defaulting-to-number = type { $type } invalid, type es plaçat sus number.

invalid-variable-value = Valor invalida d'una variabla : `{ $value }`

## Variants

variant-index-must-be-number = L'indèx de variant { $index } deu èsser un nombre

variant-index-must-be-integer = L'indèx de variant { $index } deu èsser un entièr

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` es pas implementat per de mesuras absolutas. Las largors son plaçadas en relatiu.

side-by-side-absolute-margins = `<{ $component }>` es pas implementat per de mesuras absolutas. Los marges son plaçats en relatiu.

side-by-side-no-block-child = `<{ $component }>` invalid : deu aver almens un enfant de blòc.

## `<label>`

label-for-ignored-on-graphical = L'atribut `for` sus un `<label>` grafic es ignorat.

label-for-must-resolve-to-one = L'atribut `for` sus `<label>` deu se resòlvre en exactament un component.

label-for-unresolved = L'atribut `for` sus `<label>` a pas pogut èsser resolgut en un component.

label-for-answer-with-authored-inputs = L'atribut `for` sus `<label>` fa referéncia a un `<answer>` amb de camps d'entrada escriches expressament ; fasètz referéncia al camp dirèctament.

label-for-answer-without-input = L'atribut `for` sus `<label>` fa referéncia a un `<answer>` sens camp d'entrada d'etiquetar.

label-for-must-reference-input-or-answer = L'atribut `for` sus `<label>` deu far referéncia a un camp d'entrada o a un answer.

## Accessibility

accessibility-short-description-or-decorative = Per l'accessibilitat, `<{ $component }>` deu aver una descripcion corta o èsser especificat coma decoratiu.

accessibility-video-short-description = Per l'accessibilitat, `<video>` deu aver una descripcion corta.

accessibility-input-short-description-or-label = Per l'accessibilitat, `<{ $component }>` deu aver una descripcion corta o una etiqueta.

accessibility-answer-input-short-description-or-label = Per l'accessibilitat, un `<answer>` que crèa un camp d'entrada deu aver una descripcion corta o una etiqueta.

accessibility-short-description-contains-math = Las descripcions cortas devon pas conténer de components matematics coma `<{ $component }>`. Escrivètz las matematicas amb de mots.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } a pas un contraste sufisent pel tèxte del títol de seccion (mòde escur) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; almens { $threshold }:1 requesit).
       *[other] { $colorName } a pas un contraste sufisent pel tèxte del títol de seccion ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; almens { $threshold }:1 requesit).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` passant per { $count } punts es pas implementat quand los punts an pas de valors numericas.

circle-too-many-through-points = Impossible de calcular un cercle passant per mai de 3 punts.

circle-overprescribed-radius-center-points = Impossible de calcular un cercle amb rai, centre e punts especificats.

circle-center-with-multiple-points = Impossible de calcular un cercle amb centre especificat passant per mai d'1 punt.

circle-radius-too-small = Impossible de calcular lo cercle : la distància entre los dos punts essent { $distance }, lo rai especificat { $radius } es tròp pichon.

circle-radius-with-many-points = Impossible de crear un cercle passant per mai de dos punts amb un rai especificat.

circle-invalid-center-or-through-points = Centre o punts de passatge del cercle invalids.

circle-radius-center-with-multiple-points = Impossible de calcular lo rai d'un cercle amb centre especificat passant per mai d'1 punt.

circle-change-radius-non-numerical = Impossible de cambiar lo rai d'un cercle amb de punts pas numerics

circle-radius-with-points-non-numerical = Impossible de crear un cercle passant per mai d'un punt amb un rai especificat quand las valors son pas numericas.

circle-change-center-non-numerical = Lo cambiament del centre d'un cercle passant per de punts amb de valors pas numericas es pas implementat.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensions insufisentas pel domeni de la foncion. Lo domeni a { $intervals } interval mas la foncion a { $inputs ->
            [one] { $inputs } entrada
           *[other] { $inputs } entradas
        }.
       *[other] Dimensions insufisentas pel domeni de la foncion. Lo domeni a { $intervals } intervals mas la foncion a { $inputs ->
            [one] { $inputs } entrada
           *[other] { $inputs } entradas
        }.
    }

function-domain-invalid-format = Format invalid pel domeni de la foncion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Lo maximum pas numeric de la foncion es ignorat.
        [minimum] Lo minimum pas numeric de la foncion es ignorat.
        [extremum] L'extremum pas numeric de la foncion es ignorat.
        [point] Lo punt pas numeric de la foncion es ignorat.
        [slope] Lo pendent pas numeric de la foncion es ignorat.
       *[other] Lo { $type } pas numeric de la foncion es ignorat.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Lo maximum void de la foncion es ignorat.
        [minimum] Lo minimum void de la foncion es ignorat.
        [extremum] L'extremum void de la foncion es ignorat.
        [point] Lo punt void de la foncion es ignorat.
       *[other] Lo { $type } void de la foncion es ignorat.
    }

function-points-too-close = La foncion conten dos punts tròp pròches l'un de l'autre. Impossible de definir la foncion.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Las iteracions d'una foncion son possiblas solament se lo nombre d'entradas es egal al nombre de sortidas. Aquesta foncion a { $inputs } entrada e { $outputs ->
            [one] { $outputs } sortida
           *[other] { $outputs } sortidas
        }.
       *[other] Las iteracions d'una foncion son possiblas solament se lo nombre d'entradas es egal al nombre de sortidas. Aquesta foncion a { $inputs } entradas e { $outputs ->
            [one] { $outputs } sortida
           *[other] { $outputs } sortidas
        }.
    }

## `<sequence>`

sequence-invalid-length = Longor invalida de la sequéncia. Deu èsser un entièr pas negatiu.

sequence-invalid-step = Pas invalid de la sequéncia. Deu èsser un nombre per una sequéncia de tipe { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" invalid d'una sequéncia de nombres. Deu èsser un nombre.

sequence-invalid-endpoint-letters = "{ $attribute }" invalid d'una sequéncia de letras. Deu èsser una combinason de letras.

sequence-invalid-endpoint = "{ $attribute }" invalid de la sequéncia.

select-from-sequence-coprime-not-numbers = coprime es ignorat perque se seleccionan pas de nombres

select-from-sequence-coprime-with-exclude-combinations = coprime es ignorat perque excludeCombinations es especificat

## Resolving a `target`

target-not-found = target invalid per `<{ $source }>` : impossible de trobar la cibla.

target-state-variable-not-found = target invalid per `<{ $source }>` : impossible de trobar una variabla d'estat nomenada "{ $property }" sus un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Las variablas de `<odeSystem>` devon èsser diferentas de la variabla independenta.

ode-system-duplicate-variable-names = Impossible de definir las foncions del membre drech de l'EDO amb de noms de variablas dependentas repetits.

ode-system-rhs-function-error = Impossible de definir la foncion del membre drech de l'EDO. Error a la creacion de la foncion mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Impossible de definir un angle entre { $count } drechas

angle-invalid-through-point = Punt invalid dins lo through de `<angle>`

parabola-vertex-too-many-points = Una parabòla amb somet passant per mai d'1 punt es pas implementada.

parabola-too-many-points = Una parabòla passant per mai de 3 punts es pas implementada.

intersection-too-many-items = L'interseccion de mai de dos objèctes es pas implementada

## Other math components

ionic-compound-not-two-ions = Un compausat ionic es pas implementat per autra causa que dos ions.

ionic-compound-needs-cation-and-anion = Un compausat ionic es implementat solament per un cation e un anion.

solve-equations-cannot-evaluate = Impossible de resòlvre l'equacion perque a pas pogut èsser evaluada : { $equation }

math-operators-operand-number-required = Cal especificar un operandNumber quand s'extrai un operand matematic.

eigen-decomposition-failed = Impossible de calcular las valors pròprias de la matritz

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>` : lo paramètre { $parameters } apareis pas dins lo motiu, doncas correspondrà totjorn a un void.
       *[other] `<matchesPattern>` : los paramètres { $parameters } apareisson pas dins lo motiu, doncas correspondràn totjorn a un void.
    }

## `<graph>`

graph-grid-invalid = `<graph>` : impossible d'interpretar grid="{ $grid }". Deu èsser none, medium, dense o dos nombres positius separats per un espaci, per exemple grid="1 0.5". Cap de grasilha es pas dessenhada.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>` : xLabelPosition="left" es pas pres en carga pel motor prefigure ; lo compòrtament de la posicion drecha es utilizat.

prefigure-y-label-position-unsupported = `<graph>` : yLabelPosition="bottom" es pas pres en carga pel motor prefigure ; lo compòrtament de la posicion nauta es utilizat.

prefigure-invalid-axis-bounds = `<graph>` : limits d'axes invalids per la conversion en prefigure ; la bbox per defaut (-10,-10,10,10) es utilizada.

prefigure-invalid-width = `<graph>` : largor invalida per la conversion en prefigure ; la largor per defaut 425 es utilizada.

prefigure-invalid-aspect-ratio = `<graph>` : aspectRatio invalid per la conversion en prefigure ; lo rapòrt per defaut 1 es utilizat.

prefigure-grid-spacing-too-fine = `<graph>` : l'espaçament de la grasilha es tròp fin pels limits dels axes ; la grasilha es omesa dins lo motor prefigure.

prefigure-annotations-not-rendered = `<graph>` : las anotacions seràn pas afichadas quand lo motor PreFigure es pas utilizat.

multiple-annotations-children = Mai d'un enfant `<annotations>` trobat dins `<graph>` ; totes levat lo darrièr son ignorats.

## Referring to other components

copy-unrecognized-component-type = Impossible d'espandir o de copiar un tipe de component desconegut : { $type }.

copy-prop-not-found = Impossible de trobar la proprietat { $property } sus un component de tipe { $component }

collect-no-source = Cap de font trobada per collect.

collect-invalid-component-type = Impossible de collectar de components de tipe `<{ $component }>` perque es un tipe de component invalid.

reference-index-unavailable = Impossible de far referéncia a l'indèx `{ $reference }`

## `<callAction>`

component-action-unavailable = Impossible d'apelar { $action } sul component `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Las donadas an una forma invalida. Las linhas an de longors diferentas. Trobat dins componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Las donadas an de noms de colomnas repetits. Trobat dins componentIdx :{ $componentIdx }

data-frame-missing-column-name = Un nom de colomna manca a las donadas. Trobat dins componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un award d'aquesta responsa se basa sus la responsa mandada per la balisa answer ela-meteissa, çò que menarà a un compòrtament inesperat.

answer-max-num-attempts-in-section-wide-check-work = Definir `maxNumAttempts` sus un `<answer>` dins un contenidor amb `sectionWideCheckWork` a pas cap d'efièit, perque lo nombre d'ensages es contrarotlat pel contenidor. Definissètz `maxNumAttempts` sul contenidor.

nested-section-wide-check-work-max-num-attempts = Definir `maxNumAttempts` sus un contenidor amb `sectionWideCheckWork` que se tròba dins un autre contenidor amb `sectionWideCheckWork` a pas cap d'efièit, perque lo nombre d'ensages es contrarotlat pel contenidor exterior. Definissètz `maxNumAttempts` sul contenidor exterior.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L'atribut { $attributes } aurà pas cap d'efièit sens symbolicEquality.
       *[other] Los atributs { $attributes } auràn pas cap d'efièit sens symbolicEquality.
    }

answer-invalid-type = Tipe invalid per la responsa : { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Coma lo component `<{ $component }>` a pas de nom, pòt pas èsser utilizat coma atribut d'un modul

module-attribute-name-already-defined = Lo component `<{ $component } name="{ $name }">` pòt pas èsser utilizat coma atribut d'un modul perque lo tipe de component `<module>` a ja un atribut "{ $name }".

conditional-content-condition-ignored = L'atribut `condition` es ignorat sus un component `<conditionalContent>` amb d'enfants case o else.

slider-markers-type-mismatch = Lo tipe dels marcadors correspond pas al tipe del lisador.

pretzel-problem-needs-statement-and-answer = pretzel invalid : cada `<problem>` deu conténer un `<statement>` e un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel invalid : en mode="circuit", lo primièr `<problem>` pòt pas èsser un destorbador.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valor invalida { $values } per l'atribut `{ $attribute }` ; ignorada.
       *[other] Valors invalidas { $values } per l'atribut `{ $attribute }` ; ignoradas.
    }

attribute-must-be-references = Valor invalida `{ $value }` per l'atribut `{ $attribute }`. L'atribut deu èsser compausat de referéncias que comencen per un `$`.

math-input-invalid-function-names = <mathInput> : noms de foncions invalids ignorats dins { $attribute } : { $names }. La partida afichada de cada nom deu far almens 2 caractèrs (letras o jonhents) ; un sufix opcional `|<mathspeak alternativa>` pòt seguir.

## Building components from the source

component-type-invalid = Tipe de component invalid : `<{ $componentType }>`

attribute-repeated = Impossible de repetir l'atribut { $attribute }.

attribute-invalid-for-component = Atribut "{ $attribute }" invalid per un component de tipe `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La definicion d'estil { $styleNumber } a pas un contraste sufisent per { $context ->
        [text-on-background] la color del tèxte contra la color de fons
        [high-contrast] la color de naut contraste contra la tela
        [line] la color de la linha contra la tela
        [marker] la color del marcador contra la tela
       *[text-on-canvas] la color del tèxte contra la tela
    }{ $mode ->
        [dark] { " (mòde escur)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; almens { $threshold }:1 requesit).

style-definition-dark-mode-text-background-contrast =
    Encara que la definicion d'estil { $styleNumber } especifique de colors amb un contraste sufisent pel mòde clar, las colors del mòde escur derivadas d'aquestas valors an pas un contraste sufisent per la color del tèxte contra la color de fons ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; almens { $threshold }:1 requesit). { $suggestion ->
        [available] Per assegurar un contraste sufisent en mòde escur, aumentatz lo contraste del mòde clar (per exemple { $lightAttribute }="{ $lightColor }") o remplaçatz la color del mòde escur (per exemple { $darkAttribute }="{ $darkColor }").
       *[none] Per assegurar un contraste sufisent en mòde escur, aumentatz lo contraste del mòde clar o remplaçatz las colors derivadas amb textColorDarkMode e/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Encara que la definicion d'estil { $styleNumber } especifique una color de tèxte amb un contraste sufisent pel mòde clar, la color de tèxte del mòde escur derivada d'aquesta valor a pas un contraste sufisent contra la tela ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; almens { $threshold }:1 requesit). { $suggestion ->
        [available] Per assegurar un contraste sufisent en mòde escur, aumentatz lo contraste del mòde clar (per exemple textColor="{ $lightColor }") o remplaçatz la color del mòde escur (per exemple textColorDarkMode="{ $darkColor }").
       *[none] Per assegurar un contraste sufisent en mòde escur, aumentatz lo contraste del mòde clar o remplaçatz la color derivada amb textColorDarkMode.
    }

section-multiple-style-palettes = Una seccion pòt seleccionar solament una <stylePalette> ; la darrièra es utilizada.

## Unique variants

variant-num-to-select-not-non-negative-integer = impossible de determinar los variants unics de { $component } perque numToSelect es pas un entièr pas negatiu.

variant-num-to-select-not-constant-number = impossible de determinar los variants unics de { $component } perque numToSelect es pas un nombre constant.

variant-with-replacement-not-constant-boolean = impossible de determinar los variants unics de { $component } perque withReplacement es pas un boolean constant.

variant-select-weight-disables-unique = Los variants unics per select son desactivats se una opcion a un selectWeight o un selectForVariants especificat

variant-coprime-undetermined = impossible de determinar los variants unics de { $component } perque se pòt pas determinar que coprime es totjorn fals.

variant-attribute-not-constant = impossible de determinar los variants unics de { $component } perque { $attribute } es pas una constanta.

variant-attribute-not-number = impossible de determinar los variants unics de { $component } perque { $attribute } es pas un nombre.

variant-attribute-wrong-type-for-sequence =
    impossible de determinar los variants unics de { $component } de tipe { $type } perque { $attribute } es pas { $expected ->
        [letters-combination] una combinason de letras
        [math-expression] una expression matematica valida
        [integer] un entièr
       *[number] un nombre
    }.

variant-length-not-integer = impossible de determinar los variants unics de { $component } perque length es pas un entièr.

variant-sort-not-implemented = los variants unics d'un { $component } amb sort son pas implementats

variant-exclude-combinations-not-implemented = los variants unics d'un { $component } amb excludeCombinations son pas implementats

variant-math-exclude-not-implemented = los variants unics d'un { $component } de tipe math amb exclude son pas implementats

variant-non-constant-exclude-not-implemented = los variants unics d'un { $component } amb un exclude pas constant son pas implementats

## PreFigure conversion

prefigure-descendant-unsupported = { $subject } : pas pres en carga pel motor prefigure del grafic ; lo descendent es passat.

prefigure-descendant-invalid-geometry = { $subject } : geometria pas finida o incompleta ; lo descendent es passat.

prefigure-curve-label-omitted = { $subject } : las etiquetas son pas presas en carga suls elements de corba convertits ; l'etiqueta es omesa.

prefigure-curve-unsupported-definition-type = { $subject } : tipe de definicion de foncion de corba pas pres en carga '{ $definitionType }' ; lo descendent es passat.

prefigure-region-flip-functions-unsupported = { $subject } : atribut flipFunctions pas pres en carga sus regionBetweenCurves ; lo descendent es passat.

prefigure-region-non-formula-child = { $subject } : sus regionBetweenCurves, solas las foncions enfants definidas per una formula son presas en carga ; lo descendent es passat.

prefigure-label-position-unsupported =
    { $subject } : labelPosition '{ $labelPosition }' pas pres en carga per { $labelKind ->
        [line-family] una etiqueta de la familha de las linhas
       *[point] una etiqueta de punt
    } ; l'alinhament PreFigure per defaut es utilizat.

prefigure-fill-style-unsupported = { $subject } : l'estil d'emplenatge '{ $fillStyle }' es pas pres en carga per PreFigure ; se torna a un emplenatge plen.

prefigure-line-style-unknown = { $subject } : estil de linha desconegut '{ $lineStyle }' omés de la sortida PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject } : l'estil de marcador '{ $markerStyle }' es estat convertit en l'estil PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject } : l'estil de marcador '{ $markerStyle }' es pas pres en carga per PreFigure ; l'estil per defaut es utilizat.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>` : `ref` invalid ; impossible de resòlvre la cibla. L'anotacion es omesa.

annotation-ref-multiple-targets = `<annotation>` : `ref` s'es resolgut en mantuna cibla ; la primièra es utilizada.

annotation-ref-outside-graph = `<annotation>` : `ref` invalid ; la cibla es fòra del grafic que la conten. L'anotacion es omesa.

annotation-ref-unsupported-target = `<annotation>` : `ref` invalid ; la cibla es pas un objècte grafic pres en carga dins la conversion prefigure. L'anotacion es omesa.

annotation-text-missing = `<annotation>` : `text` mancant o void ; un tèxte void es emés.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Dependéncia circulara detectada.
       *[other] Dependéncia circulara detectada implicant un component `<{ $componentType }>`.
    }

reference-no-referent = Cap de referent pas trobat per la referéncia : `{ $reference }`

reference-multiple-referents = Mai d'un referent trobat per la referéncia : `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format invalid per l'atribut { $attribute } de `<{ $componentType }>`.

children-invalid = Enfants invalids per `<{ $componentType }>` : enfants invalids trobats : { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valor invalida `{ $value }` per l'atribut `{ $attribute }`, la valor `{ $default }` es utilizada

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Version DoenetML { $version } pas trobada.
       *[other] Version DoenetML { $version } pas trobada. Se torna a la version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML invalid : { $content }

parse-tag-missing-close-tag = DoenetML invalid : la balisa `{ $tag }` a pas de balisa tampanta. Una balisa auto-tampanta o una balisa `</{ $tagName }>` èra esperada.

parse-tag-error = DoenetML invalid : error dins la balisa `<{ $tagName }>`

parse-attribute-missing-value = DoenetML invalid : sembla que l'atribut invalid `{ $attribute }` a pas de valor.

parse-attribute-invalid = DoenetML invalid : atribut invalid `{ $attribute }`

parse-attribute-value-invalid = DoenetML invalid : valor d'atribut invalida `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML invalid : valor d'atribut invalida `{ $value }`. Las verguetas correspondon pas. Sembla que manca un `{ $quote }`

parse-open-tag-name-missing = DoenetML invalid : balisa sens nom trobada, per exemple `<`

parse-tag-not-closed = DoenetML invalid : la balisa `{ $tag }` es pas estada tampada (sembla que manca un `>`).

parse-self-closing-tag-name-missing = DoenetML invalid : balisa sens nom trobada `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML invalid : la balisa `{ $tag }` es pas estada tampada (sembla que manca `/>`).

parse-tag-invalid-attributes = DoenetML invalid : la balisa `{ $tag }` es pas valida. Benlèu qu'a d'atributs incorrèctes.

parse-close-tag-name-missing = DoenetML invalid : balisa tampanta sens nom trobada, per exemple `</`

parse-attribute-value-unquoted = Las valors d'atributs devon èsser entre verguetas : `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML invalid : balisa tampanta `{ $tag }` trobada, mas cap de balisa dobrissenta correspondenta

parse-close-tag-mismatched = DoenetML invalid : balisa tampanta discordanta. `</{ $expected }>` èra esperada. `{ $found }` trobada

parser-node-unconvertible = Impossible de convertir lo nos { $node } en nos Dast.

## Names

name-attribute-invalid =
    Atribut name='{ $name }' invalid. { $reason ->
        [characters] Los noms pòdon conténer solament de letras, de chifras, de jonhents bas o de jonhents.
       *[start] Los noms devon començar per una letra.
    }

component-name-invalid-start = Nom de component "{ $name }" invalid. Los noms devon començar per una letra.

## `<answer>` sugar

answer-video-watched-missing-video = Un answer de tipe videoWatched deu aver un atribut video

answer-video-watched-video-not-reference = Un answer de tipe videoWatched deu aver un atribut video qu'es una referéncia

answer-name-not-single-text = L'atribut name d'un answer deu aver un sol enfant tèxte

## Referencing another document

external-doenetml-recursion-limit = Impossible de recuperar lo DoenetML extèrne a causa de tròp de nivèls de recursion. I a benlèu una referéncia circulara ?

external-doenetml-unavailable = Impossible de recuperar de DoenetML dempuèi { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML invalid recuperat dempuèi { $attribute }="{ $uri }" : correspond pas al tipe de component "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L'atribut `{ $from }` es obsolet ; utilizatz `{ $to }` a la plaça.
       *[other] [deprecation] L'atribut `{ $from }` sus `<{ $component }>` es obsolet ; utilizatz `{ $to }` a la plaça.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L'atribut `{ $from }` es obsolet e ignorat perque `{ $to }` es tanben especificat.
       *[other] [deprecation] L'atribut `{ $from }` sus `<{ $component }>` es obsolet e ignorat perque `{ $to }` es tanben especificat.
    }

deprecated-attribute-ignored = [deprecation] L'atribut `{ $attribute }` sus `<{ $component }>` es obsolet e ignorat.

deprecated-attribute-to-child = [deprecation] L'atribut `{ $attribute }` sus `<{ $component }>` es obsolet ; utilizatz un enfant `<{ $child }>` a la plaça.

deprecated-attribute-value-renamed = [deprecation] La valor `{ $value }` de l'atribut `{ $attribute }` sus `<{ $component }>` es obsoleta ; utilizatz `{ $to }` a la plaça.


## Language coverage

pluralize-english-only = `<pluralize>` pòt metre al plural solament l'anglés, doncas son tèxte demòra inchangat dins un document escrich en { $locale }. Escrivètz la forma plurala dirèctament, o especificatz-la amb l'atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L'element `<{ $tag }>` es pas un element Doenet reconegut.

schema-element-not-allowed-at-root = L'element `<{ $tag }>` es pas permés a la raiç del document.

schema-element-not-allowed-inside = L'element `<{ $tag }>` es pas permés dins `<{ $parent }>`.

schema-attribute-unrecognized = L'element `<{ $tag }>` a pas d'atribut nomenat `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L'atribut `{ $attribute }` de l'element `<{ $tag }>` deu èsser una lista que cada element es un d'aquestes : { $allowed }
       *[other] L'atribut `{ $attribute }` de l'element `<{ $tag }>` deu èsser un d'aquestes : { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nom de variant invalid per select. Lo nom de variant { $variantName } apareis dins { $numOptions } opcions mas lo nombre de seleccionar es { $numToSelect }.

select-variant-name-without-options = D'unes variants son especificats per select mas cap d'opcion es pas especificada pel nom de variant possible : { $variantName }.

select-variant-name-not-possible = Lo nom de variant { $variantName } especificat per select es pas un nom de variant possible.

select-too-few-options = Impossible de seleccionar { $numToSelect } components a partir de solament { $numOptions }.

select-from-sequence-too-few-values = Impossible de seleccionar { $numToSelect } valors dins una sequéncia de longor { $length }.

select-from-sequence-indices-count-mismatch = Lo nombre d'indèxes especificats per select deu correspondre al nombre de seleccionar

select-from-sequence-indices-not-integers = Totes los indèxes especificats per select devon èsser d'entièrs

select-from-sequence-index-excluded = Un indèx especificat de selectfromsequence èra exclús

select-from-sequence-indices-excluded-combination = Los indèxes especificats de selectfromsequence èran una combinason exclusa

select-from-sequence-coprime-not-positive-integers = Impossible de seleccionar de combinasons copremièras perque se seleccionan pas d'entièrs positius.

select-from-sequence-coprime-common-factor = Impossible de seleccionar de nombres copremièrs. Totas las valors possiblas an un factor comun. (Las valors especificadas de "from" o "to" devon èsser copremièras amb "step".)

select-from-sequence-coprime-single-number = Impossible de seleccionar de combinasons copremièras a partir d'un sol nombre qu'es pas 1.

select-from-sequence-excluded-too-many-combinations = Mai de 70% de las combinasons son exclusas dins selectFromSequence

select-from-sequence-coprime-none-found = Impossible de seleccionar de nombres copremièrs. Totas las valors possiblas an un factor comun.

select-from-sequence-too-few-unique-values = Impossible de seleccionar { $numToSelect } valors unicas dins una sequéncia de longor { $numPossibleValues }

select-prime-numbers-too-few-values = Impossible de seleccionar { $numToSelect } valors dins una lista de nombres primièrs de longor { $numValues }

select-prime-numbers-values-count-mismatch = Lo nombre de valors especificadas per select deu correspondre al nombre de seleccionar

select-prime-numbers-values-not-prime = Totas las valors especificadas per la seleccion de nombres primièrs devon èsser dins la lista dels nombres primièrs

select-prime-numbers-values-excluded-combination = Las valors especificadas de selectPrimeNumbers èran una combinason exclusa

select-prime-numbers-excluded-too-many-combinations = Mai de 70% de las combinasons son exclusas dins selectPrimeNumbers

select-random-combination-fluke = Per un azard extrèmament improbable, cap de combinason de valors aleatòrias a pas pogut èsser seleccionada

select-random-value-fluke = Per un azard extrèmament improbable, cap de valor aleatòria a pas pogut èsser seleccionada
