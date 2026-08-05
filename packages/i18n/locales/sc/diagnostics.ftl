# Sardinian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } benit ignoradu cando ambos estremos sunt indicados
       *[other] { $attributes } benint ignorados cando ambos estremos sunt indicados
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } benit ignoradu cando unu estremu e unu puntu de mesu sunt indicados paris
       *[other] { $attributes } benint ignorados cando unu estremu e unu puntu de mesu sunt indicados paris
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset non tenet efetu sena unu puntu de mesu

## `<line>`

line-points-undetermined-dimensions = Reta chi colat pro puntos de dimensiones non determinadas.

line-points-too-few-dimensions = Sa reta depet colare pro puntos de a su mancu duas dimensiones.

line-points-depend-on-variables = Sa reta colat pro puntos chi dipendent dae variàbiles: { $variables }.

line-equation-invalid-format = Formadu non vàlidu pro s'ecuatzione de una reta in sas variàbiles { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = Sa semireta est determinada dae through, endpoint e direction. Su through indicadu benit ignoradu.

ray-dimension-mismatch = numDimensions non currispondet in ray.

## `<vector>`

vector-overprescribed-head = Su vetore est determinadu dae head, tail e displacement. Su head indicadu benit ignoradu.

vector-dimension-mismatch = numDimensions non currispondet in vector.

## Attracting and constraining

attract-to-without-nearest-point = Non si podet atraire a unu `<{ $component }>` ca non tenet sa variàbile de istadu nearestPoint.

constrain-to-without-nearest-point = Non si podet limitare a unu `<{ $component }>` ca non tenet sa variàbile de istadu nearestPoint.

constrain-to-interior-without-nearest-point = Non si podet limitare a s'internu de unu `<{ $component }>` ca non tenet sa variàbile de istadu nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition benit ignoradu in unu choiceInput chi no est inline

## Ordering children by index

choice-input-indices-count-mismatch = Sos ìnditzes indicados pro choiceInput benint ignorados ca su nùmeru issoro non currispondet a su nùmeru de fìgios choice.

pretzel-indices-count-mismatch = Sos ìnditzes indicados pro problem benint ignorados ca su nùmeru issoro non currispondet a su nùmeru de fìgios problem.

shuffle-indices-count-mismatch = Sos ìnditzes indicados pro shuffle benint ignorados ca su nùmeru issoro non currispondet a su nùmeru de cumponentes.

indices-ignored-out-of-range = Sos ìnditzes indicados pro { $component } benint ignorados ca calicunu est foras de s'intervallu.

pretzel-indices-repeated = Sos ìnditzes indicados pro pretzel benint ignorados ca calicunu si repitit.

pretzel-circuit-first-index = Sos ìnditzes indicados pro pretzel in mode="circuit" benint ignorados ca su primu ìnditze depet èssere 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pro chi `<{ $component }>` funtzionet cun fìgios de testu, depet èssere indicadu unu atributu `type`.

invalid-type-defaulting-to-math = type { $type } non vàlidu pro su cumponente { $component }. Depet èssere math, text, number o boolean. Si ponet a math.

string-not-valid-component-to-arrange = Su testu "{ $value }" no est unu cumponente vàlidu pro { $component }. Benit ignoradu.

## Types and variables

invalid-type-defaulting-to-number = type { $type } non vàlidu, type si ponet a number.

invalid-variable-value = Valore non vàlidu de una variàbile: `{ $value }`

## Variants

variant-index-must-be-number = S'ìnditze de variante { $index } depet èssere unu nùmeru

variant-index-must-be-integer = S'ìnditze de variante { $index } depet èssere unu nùmeru intreu

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` no est implementadu pro mesuras assolutas. Sas largàrias si ponent a relativas.

side-by-side-absolute-margins = `<{ $component }>` no est implementadu pro mesuras assolutas. Sos màrgines si ponent a relativos.

side-by-side-no-block-child = `<{ $component }>` non vàlidu: depet tènnere a su mancu unu fìgiu de blocu.

## `<label>`

label-for-ignored-on-graphical = S'atributu `for` in unu `<label>` gràficu benit ignoradu.

label-for-must-resolve-to-one = S'atributu `for` in `<label>` depet risòlvere in unu cumponente ebbia.

label-for-unresolved = S'atributu `for` in `<label>` no s'est pòdidu risòlvere in unu cumponente.

label-for-answer-with-authored-inputs = S'atributu `for` in `<label>` si riferit a unu `<answer>` cun campos de intrada iscritos a manu; riferi·ti a su campu deretu.

label-for-answer-without-input = S'atributu `for` in `<label>` si riferit a unu `<answer>` sena campu de intrada de etichetare.

label-for-must-reference-input-or-answer = S'atributu `for` in `<label>` si depet riferire a unu campu de intrada o a unu answer.

## Accessibility

accessibility-short-description-or-decorative = Pro s'atzessibilidade, `<{ $component }>` depet tènnere una descritzione curtza o èssere indicadu comente decorativu.

accessibility-video-short-description = Pro s'atzessibilidade, `<video>` depet tènnere una descritzione curtza.

accessibility-input-short-description-or-label = Pro s'atzessibilidade, `<{ $component }>` depet tènnere una descritzione curtza o una eticheta.

accessibility-answer-input-short-description-or-label = Pro s'atzessibilidade, unu `<answer>` chi creat unu campu de intrada depet tènnere una descritzione curtza o una eticheta.

accessibility-short-description-contains-math = Sas descritziones curtzas non depent tènnere cumponentes matemàticos comente `<{ $component }>`. Iscrie sa matemàtica cun paràulas.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } non tenet contrastu bastante pro su testu de su tìtulu de setzione (modalidade iscura) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; serbit a su mancu { $threshold }:1).
       *[other] { $colorName } non tenet contrastu bastante pro su testu de su tìtulu de setzione ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; serbit a su mancu { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` chi colat pro { $count } puntos no est implementadu cando sos puntos non tenent valores numèricos.

circle-too-many-through-points = Non si podet carculare unu chircu chi colet pro prus de 3 puntos.

circle-overprescribed-radius-center-points = Non si podet carculare unu chircu cun ràdiu, tzentru e puntos indicados.

circle-center-with-multiple-points = Non si podet carculare unu chircu cun tzentru indicadu chi colet pro prus de 1 puntu.

circle-radius-too-small = Non si podet carculare su chircu: dae chi sa distàntzia intre sos duos puntos est { $distance }, su ràdiu indicadu { $radius } est tropu minore.

circle-radius-with-many-points = Non si podet creare unu chircu chi colet pro prus de duos puntos cun unu ràdiu indicadu.

circle-invalid-center-or-through-points = Tzentru o puntos de coladòrgiu de su chircu non vàlidos.

circle-radius-center-with-multiple-points = Non si podet carculare su ràdiu de unu chircu cun tzentru indicadu chi colet pro prus de 1 puntu.

circle-change-radius-non-numerical = Non si podet cambiare su ràdiu de unu chircu cun puntos non numèricos

circle-radius-with-points-non-numerical = Non si podet creare unu chircu chi colet pro prus de unu puntu cun unu ràdiu indicadu cando sos valores non sunt numèricos.

circle-change-center-non-numerical = Su cambiamentu de su tzentru de unu chircu chi colat pro puntos cun valores non numèricos no est implementadu.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensiones non bastantes pro su domìniu de sa funtzione. Su domìniu tenet { $intervals } intervallu ma sa funtzione tenet { $inputs ->
            [one] { $inputs } intrada
           *[other] { $inputs } intradas
        }.
       *[other] Dimensiones non bastantes pro su domìniu de sa funtzione. Su domìniu tenet { $intervals } intervallos ma sa funtzione tenet { $inputs ->
            [one] { $inputs } intrada
           *[other] { $inputs } intradas
        }.
    }

function-domain-invalid-format = Formadu non vàlidu pro su domìniu de sa funtzione.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Su màssimu non numèricu de sa funtzione benit ignoradu.
        [minimum] Su mìnimu non numèricu de sa funtzione benit ignoradu.
        [extremum] S'estremu non numèricu de sa funtzione benit ignoradu.
        [point] Su puntu non numèricu de sa funtzione benit ignoradu.
        [slope] Sa pendèntzia non numèrica de sa funtzione benit ignorada.
       *[other] Su { $type } non numèricu de sa funtzione benit ignoradu.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Su màssimu bòidu de sa funtzione benit ignoradu.
        [minimum] Su mìnimu bòidu de sa funtzione benit ignoradu.
        [extremum] S'estremu bòidu de sa funtzione benit ignoradu.
        [point] Su puntu bòidu de sa funtzione benit ignoradu.
       *[other] Su { $type } bòidu de sa funtzione benit ignoradu.
    }

function-points-too-close = Sa funtzione tenet duos puntos tropu acurtzu a pare. Non si podet definire sa funtzione.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Sas iteratziones de una funtzione sunt possìbiles isceti si su nùmeru de intradas est uguale a su de essidas. Custa funtzione tenet { $inputs } intrada e { $outputs ->
            [one] { $outputs } essida
           *[other] { $outputs } essidas
        }.
       *[other] Sas iteratziones de una funtzione sunt possìbiles isceti si su nùmeru de intradas est uguale a su de essidas. Custa funtzione tenet { $inputs } intradas e { $outputs ->
            [one] { $outputs } essida
           *[other] { $outputs } essidas
        }.
    }

## `<sequence>`

sequence-invalid-length = Longària non vàlida de sa sucessione. Depet èssere unu nùmeru intreu non negativu.

sequence-invalid-step = Passu non vàlidu de sa sucessione. Depet èssere unu nùmeru pro una sucessione de tipu { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" non vàlidu de una sucessione de nùmeros. Depet èssere unu nùmeru.

sequence-invalid-endpoint-letters = "{ $attribute }" non vàlidu de una sucessione de lìteras. Depet èssere una cumbinatzione de lìteras.

sequence-invalid-endpoint = "{ $attribute }" non vàlidu de sa sucessione.

select-from-sequence-coprime-not-numbers = coprime benit ignoradu ca non si sunt seberende nùmeros

select-from-sequence-coprime-with-exclude-combinations = coprime benit ignoradu ca excludeCombinations est indicadu

## Resolving a `target`

target-not-found = target non vàlidu pro `<{ $source }>`: non s'agatat s'obietivu.

target-state-variable-not-found = target non vàlidu pro `<{ $source }>`: non s'agatat peruna variàbile de istadu de nùmene "{ $property }" in unu `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Sas variàbiles de `<odeSystem>` depent èssere diferentes dae sa variàbile indipendente.

ode-system-duplicate-variable-names = Non si podent definire sas funtziones de su membru dereta de s'EDO cun nùmenes de variàbiles dipendentes repìtidos.

ode-system-rhs-function-error = Non si podet definire sa funtzione de su membru dereta de s'EDO. Errore creende sa funtzione mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Non si podet definire unu àngulu intre { $count } retas

angle-invalid-through-point = Puntu non vàlidu in su through de `<angle>`

parabola-vertex-too-many-points = Una paràbola cun bèrtighe chi colet pro prus de 1 puntu no est implementada.

parabola-too-many-points = Una paràbola chi colet pro prus de 3 puntos no est implementada.

intersection-too-many-items = S'intersetzione de prus de duos ogetos no est implementada

## Other math components

ionic-compound-not-two-ions = Unu cumpostu iònicu no est implementadu pro àteru chi non pro duos iones.

ionic-compound-needs-cation-and-anion = Unu cumpostu iònicu est implementadu isceti pro unu catione e unu anione.

solve-equations-cannot-evaluate = Non si podet resòlvere s'ecuatzione ca no s'est pòdida valutare: { $equation }

math-operators-operand-number-required = Depet èssere indicadu unu operandNumber cando s'estraet unu operandu matemàticu.

eigen-decomposition-failed = Non si sunt pòdidos carculare sos autovalores de sa matritze

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: su paràmetru { $parameters } no aparit in su modellu, duncas at a currispòndere semper a unu bòidu.
       *[other] `<matchesPattern>`: sos paràmetros { $parameters } no aparint in su modellu, duncas ant a currispòndere semper a unu bòidu.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: non si podet interpretare grid="{ $grid }". Depet èssere none, medium, dense o duos nùmeros positivos separados dae unu ispàtziu, pro esèmpiu grid="1 0.5". Non si disinnat peruna grìllia.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" no est suportadu in su motore prefigure; s'impreat su cumportamentu de sa positzione dereta.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" no est suportadu in su motore prefigure; s'impreat su cumportamentu de sa positzione de subra.

prefigure-invalid-axis-bounds = `<graph>`: lìmites de assos non vàlidos pro sa cunversione in prefigure; s'impreat sa bbox predefinida (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: largària non vàlida pro sa cunversione in prefigure; s'impreat sa largària predefinida 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio non vàlidu pro sa cunversione in prefigure; s'impreat sa proportzione predefinida 1.

prefigure-grid-spacing-too-fine = `<graph>`: s'ispàtziu de sa grìllia est tropu minore pro sos lìmites de sos assos; sa grìllia benit lassada in su motore prefigure.

prefigure-annotations-not-rendered = `<graph>`: sas annotatziones no ant a èssere ammustradas cando non s'impreat su motore PreFigure.

multiple-annotations-children = Si sunt agatados prus fìgios `<annotations>` in `<graph>`; totus francu s'ùrtimu benint ignorados.

## Referring to other components

copy-unrecognized-component-type = Non si podet estèndere o copiare unu tipu de cumponente disconnotu: { $type }.

copy-prop-not-found = No s'est agatada sa propiedade { $property } in unu cumponente de tipu { $component }

collect-no-source = No s'est agatada peruna mitza pro collect.

collect-invalid-component-type = Non si podent regòllere cumponentes de tipu `<{ $component }>` ca est unu tipu de cumponente non vàlidu.

reference-index-unavailable = Non si podet fàghere riferimentu a s'ìnditze `{ $reference }`

## `<callAction>`

component-action-unavailable = Non si podet mutire { $action } in su cumponente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Sos datos tenent una forma non vàlida. Sas rigas tenent longàrias diferentes. Agatadu in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Sos datos tenent nùmenes de colunna repìtidos. Agatadu in componentIdx :{ $componentIdx }

data-frame-missing-column-name = A sos datos li mancat unu nùmene de colunna. Agatadu in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Unu award de custa risposta si fundat in sa risposta imbiada de s'eticheta answer etotu, chi at a portare a unu cumportamentu non isetadu.

answer-max-num-attempts-in-section-wide-check-work = Ponnere `maxNumAttempts` in unu `<answer>` intro de unu cuntenidore cun `sectionWideCheckWork` non tenet efetu, ca su nùmeru de proas est controlladu dae su cuntenidore. Pone `maxNumAttempts` in su cuntenidore.

nested-section-wide-check-work-max-num-attempts = Ponnere `maxNumAttempts` in unu cuntenidore cun `sectionWideCheckWork` chi est intro de un'àteru cuntenidore cun `sectionWideCheckWork` non tenet efetu, ca su nùmeru de proas est controlladu dae su cuntenidore de foras. Pone `maxNumAttempts` in su cuntenidore de foras.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] S'atributu { $attributes } no at a tènnere efetu sena symbolicEquality.
       *[other] Sos atributos { $attributes } no ant a tènnere efetu sena symbolicEquality.
    }

answer-invalid-type = Tipu non vàlidu pro sa risposta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Dae chi su cumponente `<{ $component }>` non tenet nùmene, non si podet impreare comente atributu de unu mòdulu

module-attribute-name-already-defined = Su cumponente `<{ $component } name="{ $name }">` non si podet impreare comente atributu de unu mòdulu ca su tipu de cumponente `<module>` giai tenet unu atributu "{ $name }".

conditional-content-condition-ignored = S'atributu `condition` benit ignoradu in unu cumponente `<conditionalContent>` cun fìgios case o else.

slider-markers-type-mismatch = Su tipu de sos marcadores non currispondet a su tipu de s'iscorriscione.

pretzel-problem-needs-statement-and-answer = pretzel non vàlidu: cada `<problem>` depet tènnere unu `<statement>` e unu `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel non vàlidu: in mode="circuit", su primu `<problem>` non podet èssere unu distratore.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valore non vàlidu { $values } pro s'atributu `{ $attribute }`; benit ignoradu.
       *[other] Valores non vàlidos { $values } pro s'atributu `{ $attribute }`; benint ignorados.
    }

attribute-must-be-references = Valore non vàlidu `{ $value }` pro s'atributu `{ $attribute }`. S'atributu depet èssere fatu de riferimentos chi comintzant cun unu `$`.

math-input-invalid-function-names = <mathInput>: nùmenes de funtzione non vàlidos ignorados in { $attribute }: { $names }. Sa parte ammustrada de cada nùmene depet èssere de a su mancu 2 caràteres (lìteras o lineddas); podet sighire unu sufissu optzionale `|<mathspeak alternativa>`.

## Building components from the source

component-type-invalid = Tipu de cumponente non vàlidu: `<{ $componentType }>`

attribute-repeated = Non si podet repìtere s'atributu { $attribute }.

attribute-invalid-for-component = Atributu "{ $attribute }" non vàlidu pro unu cumponente de tipu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Sa definitzione de istile { $styleNumber } non tenet contrastu bastante pro { $context ->
        [text-on-background] su colore de su testu contra a su colore de fundu
        [high-contrast] su colore de contrastu artu contra a sa tela
        [line] su colore de sa lìnia contra a sa tela
        [marker] su colore de su marcadore contra a sa tela
       *[text-on-canvas] su colore de su testu contra a sa tela
    }{ $mode ->
        [dark] { " (modalidade iscura)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; serbit a su mancu { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Fintzas si sa definitzione de istile { $styleNumber } indicat colores cun contrastu bastante pro sa modalidade crara, sos colores de sa modalidade iscura derivados dae custos valores non tenent contrastu bastante intre su colore de su testu e su colore de fundu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; serbit a su mancu { $threshold }:1). { $suggestion ->
        [available] Pro assegurare contrastu bastante in sa modalidade iscura, aumenta su contrastu de sa modalidade crara (pro esèmpiu { $lightAttribute }="{ $lightColor }") o cambia su colore de sa modalidade iscura (pro esèmpiu { $darkAttribute }="{ $darkColor }").
       *[none] Pro assegurare contrastu bastante in sa modalidade iscura, aumenta su contrastu de sa modalidade crara o cambia sos colores derivados cun textColorDarkMode e/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Fintzas si sa definitzione de istile { $styleNumber } indicat unu colore de testu cun contrastu bastante pro sa modalidade crara, su colore de testu de sa modalidade iscura derivadu dae custu valore non tenet contrastu bastante contra a sa tela ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; serbit a su mancu { $threshold }:1). { $suggestion ->
        [available] Pro assegurare contrastu bastante in sa modalidade iscura, aumenta su contrastu de sa modalidade crara (pro esèmpiu textColor="{ $lightColor }") o cambia su colore de sa modalidade iscura (pro esèmpiu textColorDarkMode="{ $darkColor }").
       *[none] Pro assegurare contrastu bastante in sa modalidade iscura, aumenta su contrastu de sa modalidade crara o cambia su colore derivadu cun textColorDarkMode.
    }

section-multiple-style-palettes = Una setzione podet seberare una <stylePalette> ebbia; s'impreat s'ùrtima.

## Unique variants

variant-num-to-select-not-non-negative-integer = non si podent determinare sas variantes ùnicas de { $component } ca numToSelect no est unu nùmeru intreu non negativu.

variant-num-to-select-not-constant-number = non si podent determinare sas variantes ùnicas de { $component } ca numToSelect no est unu nùmeru costante.

variant-with-replacement-not-constant-boolean = non si podent determinare sas variantes ùnicas de { $component } ca withReplacement no est unu boolean costante.

variant-select-weight-disables-unique = Sas variantes ùnicas pro select sunt disativadas si una optzione tenet selectWeight o selectForVariants indicadu

variant-coprime-undetermined = non si podent determinare sas variantes ùnicas de { $component } ca non si podet determinare chi coprime siat semper farsu.

variant-attribute-not-constant = non si podent determinare sas variantes ùnicas de { $component } ca { $attribute } no est una costante.

variant-attribute-not-number = non si podent determinare sas variantes ùnicas de { $component } ca { $attribute } no est unu nùmeru.

variant-attribute-wrong-type-for-sequence =
    non si podent determinare sas variantes ùnicas de { $component } de tipu { $type } ca { $attribute } no est { $expected ->
        [letters-combination] una cumbinatzione de lìteras
        [math-expression] un'espressione matemàtica vàlida
        [integer] unu nùmeru intreu
       *[number] unu nùmeru
    }.

variant-length-not-integer = non si podent determinare sas variantes ùnicas de { $component } ca length no est unu nùmeru intreu.

variant-sort-not-implemented = sas variantes ùnicas de unu { $component } cun sort non sunt implementadas

variant-exclude-combinations-not-implemented = sas variantes ùnicas de unu { $component } cun excludeCombinations non sunt implementadas

variant-math-exclude-not-implemented = sas variantes ùnicas de unu { $component } de tipu math cun exclude non sunt implementadas

variant-non-constant-exclude-not-implemented = sas variantes ùnicas de unu { $component } cun unu exclude non costante non sunt implementadas

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: no est suportadu in su motore prefigure de su gràficu; su dischendente benit brincadu.

prefigure-descendant-invalid-geometry = { $subject }: geometria non finida o non cumpleta; su dischendente benit brincadu.

prefigure-curve-label-omitted = { $subject }: sas etichetas non sunt suportadas in sos elementos de curva cunvertidos; s'eticheta benit lassada.

prefigure-curve-unsupported-definition-type = { $subject }: tipu de definitzione de funtzione de curva non suportadu '{ $definitionType }'; su dischendente benit brincadu.

prefigure-region-flip-functions-unsupported = { $subject }: atributu flipFunctions non suportadu in regionBetweenCurves; su dischendente benit brincadu.

prefigure-region-non-formula-child = { $subject }: in regionBetweenCurves sunt suportadas isceti sas funtziones fìgias definidas dae una fòrmula; su dischendente benit brincadu.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' non suportadu pro { $labelKind ->
        [line-family] una eticheta de sa famìlia de sas lìnias
       *[point] una eticheta de puntu
    }; s'impreat s'allineamentu PreFigure predefinidu.

prefigure-fill-style-unsupported = { $subject }: s'istile de prenidura '{ $fillStyle }' no est suportadu dae PreFigure; si torrat a una prenidura prena.

prefigure-line-style-unknown = { $subject }: istile de lìnia disconnotu '{ $lineStyle }' lassadu foras de s'essida PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: s'istile de marcadore '{ $markerStyle }' est istadu cunvertidu in s'istile PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: s'istile de marcadore '{ $markerStyle }' no est suportadu dae PreFigure; s'impreat s'istile predefinidu.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` non vàlidu; non si podet risòlvere s'obietivu. S'annotatzione benit lassada.

annotation-ref-multiple-targets = `<annotation>`: `ref` s'est risoltu in prus obietivos; s'impreat su primu.

annotation-ref-outside-graph = `<annotation>`: `ref` non vàlidu; s'obietivu est foras de su gràficu chi lu cuntenet. S'annotatzione benit lassada.

annotation-ref-unsupported-target = `<annotation>`: `ref` non vàlidu; s'obietivu no est unu ogetu gràficu suportadu in sa cunversione prefigure. S'annotatzione benit lassada.

annotation-text-missing = `<annotation>`: `text` mancat o est bòidu; si produit unu testu bòidu.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] S'est agatada una dipendèntzia tzirculare.
       *[other] S'est agatada una dipendèntzia tzirculare chi tocat unu cumponente `<{ $componentType }>`.
    }

reference-no-referent = No s'est agatadu perunu referente pro su riferimentu: `{ $reference }`

reference-multiple-referents = Si sunt agatados prus referentes pro su riferimentu: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formadu non vàlidu pro s'atributu { $attribute } de `<{ $componentType }>`.

children-invalid = Fìgios non vàlidos pro `<{ $componentType }>`: si sunt agatados fìgios non vàlidos: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valore non vàlidu `{ $value }` pro s'atributu `{ $attribute }`, s'impreat su valore `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] No s'est agatada sa versione { $version } de DoenetML.
       *[other] No s'est agatada sa versione { $version } de DoenetML. Si torrat a sa versione { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML non vàlidu: { $content }

parse-tag-missing-close-tag = DoenetML non vàlidu: s'eticheta `{ $tag }` non tenet eticheta de serradura. Si isetaiat una eticheta chi si serrat a sola o una eticheta `</{ $tagName }>`.

parse-tag-error = DoenetML non vàlidu: errore in s'eticheta `<{ $tagName }>`

parse-attribute-missing-value = DoenetML non vàlidu: paret chi a s'atributu non vàlidu `{ $attribute }` li manchet unu valore.

parse-attribute-invalid = DoenetML non vàlidu: atributu non vàlidu `{ $attribute }`

parse-attribute-value-invalid = DoenetML non vàlidu: valore de atributu non vàlidu `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML non vàlidu: valore de atributu non vàlidu `{ $value }`. Sas virguletas non currispondent. Paret chi manchet una `{ $quote }`

parse-open-tag-name-missing = DoenetML non vàlidu: s'est agatada una eticheta sena nùmene, pro esèmpiu `<`

parse-tag-not-closed = DoenetML non vàlidu: s'eticheta `{ $tag }` no est istada serrada (paret chi manchet unu `>`).

parse-self-closing-tag-name-missing = DoenetML non vàlidu: s'est agatada una eticheta sena nùmene `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML non vàlidu: s'eticheta `{ $tag }` no est istada serrada (paret chi manchet `/>`).

parse-tag-invalid-attributes = DoenetML non vàlidu: s'eticheta `{ $tag }` no est vàlida. Podet tènnere atributos isballiados.

parse-close-tag-name-missing = DoenetML non vàlidu: s'est agatada una eticheta de serradura sena nùmene, pro esèmpiu `</`

parse-attribute-value-unquoted = Sos valores de atributu depent èssere intre virguletas: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML non vàlidu: s'est agatada s'eticheta de serradura `{ $tag }`, ma peruna eticheta de abertura currispondente

parse-close-tag-mismatched = DoenetML non vàlidu: eticheta de serradura chi non currispondet. Si isetaiat `</{ $expected }>`. S'est agatada `{ $found }`

parser-node-unconvertible = No s'est pòdidu cunvertire su nodu { $node } in unu nodu Dast.

## Names

name-attribute-invalid =
    Atributu name='{ $name }' non vàlidu. { $reason ->
        [characters] Sos nùmenes podent tènnere isceti lìteras, nùmeros, lineddas bassas o lineddas.
       *[start] Sos nùmenes depent comintzare cun una lìtera.
    }

component-name-invalid-start = Nùmene de cumponente "{ $name }" non vàlidu. Sos nùmenes depent comintzare cun una lìtera.

## `<answer>` sugar

answer-video-watched-missing-video = Unu answer de tipu videoWatched depet tènnere unu atributu video

answer-video-watched-video-not-reference = Unu answer de tipu videoWatched depet tènnere unu atributu video chi siat unu riferimentu

answer-name-not-single-text = S'atributu name de unu answer depet tènnere unu fìgiu de testu ebbia

## Referencing another document

external-doenetml-recursion-limit = Non si podet recuperare su DoenetML de foras ca sunt tropu livellos de recursione. B'at unu riferimentu tzirculare?

external-doenetml-unavailable = Non si podet recuperare DoenetML dae { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML non vàlidu recuperadu dae { $attribute }="{ $uri }": non currispondiat a su tipu de cumponente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] S'atributu `{ $from }` est betzu; impreade `{ $to }` in càmbiu.
       *[other] [deprecation] S'atributu `{ $from }` in `<{ $component }>` est betzu; impreade `{ $to }` in càmbiu.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] S'atributu `{ $from }` est betzu e benit ignoradu ca est indicadu fintzas `{ $to }`.
       *[other] [deprecation] S'atributu `{ $from }` in `<{ $component }>` est betzu e benit ignoradu ca est indicadu fintzas `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] S'atributu `{ $attribute }` in `<{ $component }>` est betzu e benit ignoradu.

deprecated-attribute-to-child = [deprecation] S'atributu `{ $attribute }` in `<{ $component }>` est betzu; impreade unu fìgiu `<{ $child }>` in càmbiu.

deprecated-attribute-value-renamed = [deprecation] Su valore `{ $value }` de s'atributu `{ $attribute }` in `<{ $component }>` est betzu; impreade `{ $to }` in càmbiu.


## Language coverage

pluralize-english-only = `<pluralize>` podet fàghere su plurale isceti in inglesu, duncas su testu suo abarrat chene cambiare in unu documentu iscritu in { $locale }. Iscrie sa forma plurale deretu, o inditta·la cun s'atributu `pluralForm`.


## Checking against the schema

schema-element-unrecognized = S'elementu `<{ $tag }>` no est unu elementu Doenet connotu.

schema-element-not-allowed-at-root = S'elementu `<{ $tag }>` no est permìtidu in sa raighina de su documentu.

schema-element-not-allowed-inside = S'elementu `<{ $tag }>` no est permìtidu intro de `<{ $parent }>`.

schema-attribute-unrecognized = S'elementu `<{ $tag }>` non tenet perunu atributu de nùmene `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] S'atributu `{ $attribute }` de s'elementu `<{ $tag }>` depet èssere una lista in ue cada elementu est unu de custos: { $allowed }
       *[other] S'atributu `{ $attribute }` de s'elementu `<{ $tag }>` depet èssere unu de custos: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nùmene de variante non vàlidu pro select. Su nùmene de variante { $variantName } aparit in { $numOptions } optziones ma su nùmeru de seberare est { $numToSelect }.

select-variant-name-without-options = Sunt indicadas unas cantas variantes pro select ma peruna optzione pro su nùmene de variante possìbile: { $variantName }.

select-variant-name-not-possible = Su nùmene de variante { $variantName } indicadu pro select no est unu nùmene de variante possìbile.

select-too-few-options = Non si podent seberare { $numToSelect } cumponentes dae { $numOptions } ebbia.

select-from-sequence-too-few-values = Non si podent seberare { $numToSelect } valores dae una sucessione de longària { $length }.

select-from-sequence-indices-count-mismatch = Su nùmeru de ìnditzes indicados pro select depet currispòndere a su nùmeru de seberare

select-from-sequence-indices-not-integers = Totu sos ìnditzes indicados pro select depent èssere nùmeros intreos

select-from-sequence-index-excluded = Unu ìnditze indicadu de selectfromsequence fiat esclùidu

select-from-sequence-indices-excluded-combination = Sos ìnditzes indicados de selectfromsequence fiant una cumbinatzione esclùida

select-from-sequence-coprime-not-positive-integers = Non si podent seberare cumbinatziones coprimas ca non si sunt seberende nùmeros intreos positivos.

select-from-sequence-coprime-common-factor = Non si podent seberare nùmeros coprimos. Totu sos valores possìbiles tenent unu fatore comunu. (Sos valores indicados de "from" o "to" depent èssere coprimos cun "step".)

select-from-sequence-coprime-single-number = Non si podent seberare cumbinatziones coprimas dae unu nùmeru ebbia chi no est 1.

select-from-sequence-excluded-too-many-combinations = Prus de su 70% de sas cumbinatziones est esclùidu in selectFromSequence

select-from-sequence-coprime-none-found = Non si sunt pòdidos seberare nùmeros coprimos. Totu sos valores possìbiles tenent unu fatore comunu.

select-from-sequence-too-few-unique-values = Non si podent seberare { $numToSelect } valores ùnicos dae una sucessione de longària { $numPossibleValues }

select-prime-numbers-too-few-values = Non si podent seberare { $numToSelect } valores dae una lista de nùmeros primos de longària { $numValues }

select-prime-numbers-values-count-mismatch = Su nùmeru de valores indicados pro select depet currispòndere a su nùmeru de seberare

select-prime-numbers-values-not-prime = Totu sos valores indicados pro seberare nùmeros primos depent èssere in sa lista de sos nùmeros primos

select-prime-numbers-values-excluded-combination = Sos valores indicados de selectPrimeNumbers fiant una cumbinatzione esclùida

select-prime-numbers-excluded-too-many-combinations = Prus de su 70% de sas cumbinatziones est esclùidu in selectPrimeNumbers

select-random-combination-fluke = Pro una fortuna meda pagu probàbile, no s'est pòdida seberare peruna cumbinatzione de valores a casu

select-random-value-fluke = Pro una fortuna meda pagu probàbile, no s'est pòdidu seberare perunu valore a casu
