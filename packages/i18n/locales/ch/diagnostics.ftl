# Chamorro diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Written in the Guam orthography; see `chrome.ftl`. Chamorro marks no number on
# the noun, so a counted message whose only English difference is the noun's
# number renders one string here and the select is dropped.


## `<lineSegment>`

# No select: «ma'ignora» does not agree with what is ignored, and the list
# carries no number of its own.
line-segment-attributes-ignored-with-endpoints = ma'ignora i { $attributes } yanggen madetetmina i dos na kanton

line-segment-attributes-ignored-with-endpoint-and-midpoint = ma'ignora i { $attributes } yanggen madetetmina i un kanton yan i talo'

line-segment-midpoint-offset-without-midpoint = taya' efekto i midpointOffset yanggen taya' talo'

## `<line>`

line-points-undetermined-dimensions = Liña ni malolofan gi puntos ni ti matungo' i dimension-ñiha.

line-points-too-few-dimensions = Debi di u malofan i liña gi puntos ni guaha dos pat mås na dimension.

line-points-depend-on-variables = Malolofan i liña gi puntos ni dependeyon i bariåble: { $variables }.

line-equation-invalid-format = Ti maolek na fotmåtu i ekuasion i liña gi bariåble { $variable1 } yan { $variable2 }.

## `<ray>`

ray-overprescribed-through = Madetetmina i raya ginen i through, endpoint yan direction.  Ma'ignora i through ni madetetmina.

ray-dimension-mismatch = ti parehu i numDimensions gi raya.

## `<vector>`

vector-overprescribed-head = Madetetmina i bektot ginen i head, tail yan displacement.  Ma'ignora i head ni madetetmina.

vector-dimension-mismatch = ti parehu i numDimensions gi bektot.

## Attracting and constraining

attract-to-without-nearest-point = Ti siña ma'atrai para i `<{ $component }>` sa' taya' bariåblen estao nearestPoint-ña.

constrain-to-without-nearest-point = Ti siña ma'oppe para i `<{ $component }>` sa' taya' bariåblen estao nearestPoint-ña.

constrain-to-interior-without-nearest-point = Ti siña ma'oppe gi halom i `<{ $component }>` sa' taya' bariåblen estao nearestPoint-ña.

## `<choiceInput>`

choice-input-label-position-ignored = ma'ignora i labelPosition gi choiceInput ni ti inline

## Ordering children by index

choice-input-indices-count-mismatch = Ma'ignora i indise ni madetetmina para i choiceInput sa' ti parehu i kuenton indise yan i kuenton famagu'on ayek.

pretzel-indices-count-mismatch = Ma'ignora i indise ni madetetmina para i problem sa' ti parehu i kuenton indise yan i kuenton famagu'on problem.

shuffle-indices-count-mismatch = Ma'ignora i indise ni madetetmina para i shuffle sa' ti parehu i kuenton indise yan i kuenton komponente.

indices-ignored-out-of-range = Ma'ignora i indise ni madetetmina para i { $component } sa' guaha indise ni humuyong gi rånggo.

pretzel-indices-repeated = Ma'ignora i indise ni madetetmina para i pretzel sa' guaha indise ni marepiti.

pretzel-circuit-first-index = Ma'ignora i indise ni madetetmina para i pretzel gi mode circuit sa' debi di u 1 i fine'nana na indise.

## `<shuffle>` and `<sort>`

string-children-need-type = Para u fañetbe i `<{ $component }>` yan i famagu'on string, debi di u madetetmina i atributo `type`.

invalid-type-defaulting-to-math = Ti maolek na type { $type } para i komponente { $component }. Debi di unu gi math, text, number, pat boolean. Masetbe i math.

string-not-valid-component-to-arrange = I string "{ $value }" ti maolek na komponente para i { $component }. Ma'ignora.

## Types and variables

invalid-type-defaulting-to-number = Ti maolek na type { $type }, mapo'lo i type gi number.

invalid-variable-value = Ti maolek na balot un bariåble: `{ $value }`

## Variants

variant-index-must-be-number = Debi di u numero i indisen bariånte { $index }

variant-index-must-be-integer = Debi di u kabåles na numero i indisen bariånte { $index }

## `<sideBySide>`

side-by-side-absolute-widths = Trabiha ti mafa'tinas i `<{ $component }>` para i medida absoluto. Mapo'lo i ankon-ñiha relatibo.

side-by-side-absolute-margins = Trabiha ti mafa'tinas i `<{ $component }>` para i medida absoluto. Mapo'lo i mahen-ñiha relatibo.

side-by-side-no-block-child = Ti maolek na `<{ $component }>`: debi di guaha unu na famagu'on block.

## `<label>`

label-for-ignored-on-graphical = Ma'ignora i atributo `for` gi `<label>` grafiko.

label-for-must-resolve-to-one = Debi di u apunta i atributo `for` gi `<label>` para unu ha' na komponente.

label-for-unresolved = Ti siña ma'apunta i atributo `for` gi `<label>` para un komponente.

label-for-answer-with-authored-inputs = I atributo `for` gi `<label>` ha apunta un `<answer>` ni guaha input tinige' i autót; apunta i input mismo.

label-for-answer-without-input = I atributo `for` gi `<label>` ha apunta un `<answer>` ni taya' input para u ma'etiketa.

label-for-must-reference-input-or-answer = Debi di u apunta i atributo `for` gi `<label>` para un input pat un answer.

## Accessibility

accessibility-short-description-or-decorative = Para i akseso, debi di guaha dikike' na deskripsion i `<{ $component }>` pat madetetmina komo dekoratibu.

accessibility-video-short-description = Para i akseso, debi di guaha dikike' na deskripsion i `<video>`.

accessibility-input-short-description-or-label = Para i akseso, debi di guaha dikike' na deskripsion pat etiketa i `<{ $component }>`.

accessibility-answer-input-short-description-or-label = Para i akseso, debi di guaha dikike' na deskripsion pat etiketa un `<answer>` ni ha fa'tinas un input.

accessibility-short-description-contains-math = Ti debi di guaha komponenten matemåtika kalan i `<{ $component }>` gi dikike' na deskripsion. Tuge' i matemåtika ni palåbra.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Ti nahong i kontrasten { $colorName } para i tekston i tetulon i seksion (mode homhom) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nesesita { $threshold }:1 pat mås).
       *[other] Ti nahong i kontrasten { $colorName } para i tekston i tetulon i seksion ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nesesita { $threshold }:1 pat mås).
    }

## `<circle>`

circle-through-points-non-numerical = Trabiha ti mafa'tinas i `<circle>` ni malolofan gi { $count } na punto yanggen taya' balot numeriko i puntos.

circle-too-many-through-points = Ti siña makuenta un sirkulo ni malolofan gi mås ki 3 na punto.

circle-overprescribed-radius-center-points = Ti siña makuenta un sirkulo ni madetetmina i rådion-ña, i sentro-ña yan i puntos ni malolofan.

circle-center-with-multiple-points = Ti siña makuenta un sirkulo ni madetetmina i sentro-ña ya malolofan gi mås ki 1 na punto.

circle-radius-too-small = Ti siña makuenta i sirkulo: sa' i disgåsian i dos na punto { $distance }, dikike' megai i rådio { $radius } ni madetetmina.

circle-radius-with-many-points = Ti siña mafa'tinas un sirkulo ni malolofan gi mås ki dos na punto yan un rådio ni madetetmina.

circle-invalid-center-or-through-points = Ti maolek i sentro pat i puntos ni malolofan i sirkulo.

circle-radius-center-with-multiple-points = Ti siña makuenta i rådion un sirkulo ni madetetmina i sentro-ña ya malolofan gi mås ki 1 na punto.

circle-change-radius-non-numerical = Ti siña matulaika i rådion un sirkulo ni malolofan gi puntos ni ti numeriko

circle-radius-with-points-non-numerical = Ti siña mafa'tinas un sirkulo ni malolofan gi mås ki unu na punto yan un rådio ni madetetmina yanggen taya' balot numeriko.

circle-change-center-non-numerical = Trabiha ti mafa'tinas i tinilaika i sentron un sirkulo ni malolofan gi puntos ni taya' balot numeriko.

## `<function>`

# English's two counts multiply out to four sentences; Chamorro has one, because
# «intetbalu» and «input» do not change for number. Both selects are dropped and
# both counts still arrive.
function-domain-insufficient-dimensions = Ti nahong i dimension i domain para i funsion. Guaha { $intervals } na intetbalu i domain lao guaha { $inputs } na input i funsion.

function-domain-invalid-format = Ti maolek na fotmåtu i domain para i funsion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ma'ignora i mås takhilo' i funsion ni ti numeriko.
        [minimum] Ma'ignora i mås takpapa' i funsion ni ti numeriko.
        [extremum] Ma'ignora i ekstremum i funsion ni ti numeriko.
        [point] Ma'ignora i punton i funsion ni ti numeriko.
        [slope] Ma'ignora i inklinasion i funsion ni ti numeriko.
       *[other] Ma'ignora i { $type } i funsion ni ti numeriko.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ma'ignora i mås takhilo' i funsion ni taya' sanhalom-ña.
        [minimum] Ma'ignora i mås takpapa' i funsion ni taya' sanhalom-ña.
        [extremum] Ma'ignora i ekstremum i funsion ni taya' sanhalom-ña.
        [point] Ma'ignora i punton i funsion ni taya' sanhalom-ña.
       *[other] Ma'ignora i { $type } i funsion ni taya' sanhalom-ña.
    }

function-points-too-close = Guaha dos na punto i funsion ni hihot megai. Ti siña madefina i funsion.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Siña ha' i iterasion i funsion yanggen parehu i kuenton input yan i kuenton output. Este na funsion guaha { $inputs } na input yan { $outputs } na output.

## `<sequence>`

sequence-invalid-length = Ti maolek i anåkkon i sequence.  Debi di u kabåles na numero ni ti negatibu.

sequence-invalid-step = Ti maolek i step i sequence.  Debi di u numero para i sequence type { $type }.

sequence-invalid-endpoint-number = Ti maolek na "{ $attribute }" i sequence numero.  Debi di u numero.

sequence-invalid-endpoint-letters = Ti maolek na "{ $attribute }" i sequence letra.  Debi di u kombinasion letra.

sequence-invalid-endpoint = Ti maolek na "{ $attribute }" i sequence.

select-from-sequence-coprime-not-numbers = ma'ignora i coprime sa' ti numero i ma'ayek

select-from-sequence-coprime-with-exclude-combinations = ma'ignora i coprime sa' madetetmina i excludeCombinations

## Resolving a `target`

target-not-found = Ti maolek na target para i `<{ $source }>`: ti masodda' i target.

target-state-variable-not-found = Ti maolek na target para i `<{ $source }>`: ti masodda' un bariåblen estao ni na'ån-ña "{ $property }" gi un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Debi di u diferentes i bariåblen i `<odeSystem>` ginen i bariåble indipendiente.

ode-system-duplicate-variable-names = Ti siña madefina i funsion RHS i ODE ni parehu i na'ån bariåble dependiente.

ode-system-rhs-function-error = Ti siña madefina i funsion RHS i ODE.  Guaha linachi gi fina'tinas i funsion mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ti siña madefina un ånggulo gi entalo' { $count } na liña

angle-invalid-through-point = Ti maolek na punto gi through i `<angle>`

parabola-vertex-too-many-points = Trabiha ti mafa'tinas i paråbola ni guaha bettise-ña ya malolofan gi mås ki 1 na punto.

parabola-too-many-points = Trabiha ti mafa'tinas i paråbola ni malolofan gi mås ki 3 na punto.

intersection-too-many-items = Trabiha ti mafa'tinas i inetnon para mås ki dos na guinaha

## Other math components

ionic-compound-not-two-ions = Trabiha ti mafa'tinas i kompuesto ioniko para otro ki dos na ion.

ionic-compound-needs-cation-and-anion = Mafa'tinas i kompuesto ioniko para unu ha' na kation yan unu ha' na anion.

solve-equations-cannot-evaluate = Ti siña masotta i ekuasion sa' ti siña ma'ebalúa: { $equation }

math-operators-operand-number-required = Debi di u madetetmina i operandNumber yanggen machule' un operand matemåtika.

eigen-decomposition-failed = Ti siña makuenta i eigenvalue i matris

## `<matchesPattern>`

# No select: the parameter list carries no number that the noun would show.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: i parametro { $parameters } ti humuyong gi pattern, pues siempre ha nå'i i taya'.

## `<graph>`

graph-grid-invalid = `<graph>`: ti matungo' i grid="{ $grid }". Debi di none, medium, dense, pat dos na numero positibu ni madibide ni espasio, kalan i grid="1 0.5". Taya' grid madibuha.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: ti masetbe i xLabelPosition="left" gi renderer prefigure; masetbe i kostumbren i banda agapa'.

prefigure-y-label-position-unsupported = `<graph>`: ti masetbe i yLabelPosition="bottom" gi renderer prefigure; masetbe i kostumbren i banda hulo'.

prefigure-invalid-axis-bounds = `<graph>`: ti maolek i limiten i åksis para i konbetsion prefigure; masetbe i kostumbren bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ti maolek i anko' para i konbetsion prefigure; masetbe i kostumbren anko' diagrama 425.

prefigure-invalid-aspect-ratio = `<graph>`: ti maolek i aspectRatio para i konbetsion prefigure; masetbe i kostumbren aspect ratio 1.

prefigure-grid-spacing-too-fine = `<graph>`: hihot megai i espasion i grid para i limiten i åksis; ti madibuha i grid gi renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: ti madibuha i annotation yanggen ti masetbe i renderer PreFigure.

multiple-annotations-children = Meggai famagu'on `<annotations>` masodda' gi `<graph>`; ma'ignora todu na ti i uttimo.

## Referring to other components

copy-unrecognized-component-type = Ti siña ma'estende pat makopia un klåsen komponente ni ti matungo': { $type }.

copy-prop-not-found = Ti masodda' i prop { $property } gi komponente klåsi { $component }

collect-no-source = Taya' source masodda' para i collect.

collect-invalid-component-type = Ti siña marekohe i komponente klåsi `<{ $component }>` sa' ti maolek i klåsen komponente.

reference-index-unavailable = Ti siña marefirensia i indise `{ $reference }`

## `<callAction>`

component-action-unavailable = Ti siña ma'ågang i { $action } gi komponente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ti maolek i fotman i data.  Ti parehu i anåkkon i liña. Masodda' gi componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Guaha na'ån kolumna ni parehu gi data.  Masodda' gi componentIdx :{ $componentIdx }

data-frame-missing-column-name = Taya' na'ån un kolumna gi data.  Masodda' gi componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = I award este na ineppe' basåo gi ineppe' ni manenå'i i answer tag mismo, ya u fa'na'guaha ti manangga na cho'cho'.

answer-max-num-attempts-in-section-wide-check-work = Taya' efekto i mapo'lo i `maxNumAttempts` gi un `<answer>` gi halom un kahon ni guaha `sectionWideCheckWork`, sa' i kahon ha kontrola i kuenton chinagi. Po'lo i `maxNumAttempts` gi kahon.

nested-section-wide-check-work-max-num-attempts = Taya' efekto i mapo'lo i `maxNumAttempts` gi un kahon ni guaha `sectionWideCheckWork` ni gaige gi halom otro kahon ni guaha `sectionWideCheckWork`, sa' i kahon gi sanhiyong ha kontrola i kuenton chinagi. Po'lo i `maxNumAttempts` gi kahon gi sanhiyong.

# No select: «atributo» is the same word for one and for many.
answer-attributes-need-symbolic-equality = Taya' efekton i atributo { $attributes } yanggen ti mapo'lo i symbolicEquality.

answer-invalid-type = Ti maolek na klåsi para i ineppe': { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sa' taya' na'ån i komponente `<{ $component }>`, ti siña masetbe komo atributon i module

module-attribute-name-already-defined = Ti siña masetbe i komponente `<{ $component } name="{ $name }">` komo atributon i module sa' guaha esta atributo "{ $name }" i klåsen komponente `<module>`.

conditional-content-condition-ignored = Ma'ignora i atributo `condition` gi komponente `<conditionalContent>` ni guaha famagu'on case pat else.

slider-markers-type-mismatch = Ti parehu i klåsen marker yan i klåsen slider.

pretzel-problem-needs-statement-and-answer = Ti maolek na pretzel: debi di guaha unu na `<statement>` yan unu na `<answer>` kada `<problem>`.

pretzel-circuit-first-problem-distractor = Ti maolek na pretzel: gi mode="circuit", ti siña distractor i fine'nana na `<problem>`.

## Attribute values

# No select: «balot» is the same word for one and for many.
attribute-invalid-values = Ti maolek na balot { $values } para i atributo `{ $attribute }`; ma'ignora.

attribute-must-be-references = Ti maolek na balot `{ $value }` para i atributo `{ $attribute }`. Debi di u mafa'tinas i atributo ginen refirensia ni matutuhon ni `$`.

math-input-invalid-function-names = <mathInput>: ma'ignora i na'ån funsion ni ti maolek gi { $attribute }: { $names }. Debi di guaha dos pat mås na letra kada na'ån (letra pat gion); siña ha dalalak un suffix `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Ti maolek na klåsen komponente: `<{ $componentType }>`

attribute-repeated = Ti siña marepiti i atributo { $attribute }.

attribute-invalid-for-component = Ti maolek na atributo "{ $attribute }" para i komponente klåsi `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Ti nahong i kontrasten i definasion estilo { $styleNumber } para i { $context ->
        [text-on-background] kulot i teksto kontra i kulot i tatte
        [high-contrast] kulot takhilo' na kontraste kontra i kanbas
        [line] kulot i liña kontra i kanbas
        [marker] kulot i marker kontra i kanbas
       *[text-on-canvas] kulot i teksto kontra i kanbas
    }{ $mode ->
        [dark] { " (mode homhom)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nesesita { $threshold }:1 pat mås).

style-definition-dark-mode-text-background-contrast =
    Achok' ha' guaha kulot ni madetetmina i definasion estilo { $styleNumber } ya nahong i kontrasten-ñiha para i mode mananana, ti nahong i kontrasten i kulot i teksto kontra i kulot i tatte gi kulot ni machule' para i mode homhom ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nesesita { $threshold }:1 pat mås). { $suggestion ->
        [available] Para u nahong i kontraste gi mode homhom, na'dångkulo i kontrasten i mode mananana (ehemplo, po'lo i { $lightAttribute }="{ $lightColor }") pat tulaika i kulot i mode homhom (ehemplo, po'lo i { $darkAttribute }="{ $darkColor }").
       *[none] Para u nahong i kontraste gi mode homhom, na'dångkulo i kontrasten i mode mananana pat tulaika i kulot ni machule' ni textColorDarkMode yan/pat backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Achok' ha' guaha kulot teksto ni madetetmina i definasion estilo { $styleNumber } ya nahong i kontraste-ña para i mode mananana, ti nahong i kontrasten i kulot teksto ni machule' para i mode homhom kontra i kanbas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nesesita { $threshold }:1 pat mås). { $suggestion ->
        [available] Para u nahong i kontraste gi mode homhom, na'dångkulo i kontrasten i mode mananana (ehemplo, po'lo i textColor="{ $lightColor }") pat tulaika i kulot i mode homhom (ehemplo, po'lo i textColorDarkMode="{ $darkColor }").
       *[none] Para u nahong i kontraste gi mode homhom, na'dångkulo i kontrasten i mode mananana pat tulaika i kulot ni machule' ni textColorDarkMode.
    }

section-multiple-style-palettes = Unu ha' na <stylePalette> siña ma'ayek un seksion; masetbe i uttimo.

## Unique variants

variant-num-to-select-not-non-negative-integer = ti siña madetetmina i bariånte unibetsåt i { $component } sa' ti kabåles na numero ni ti negatibu i numToSelect.

variant-num-to-select-not-constant-number = ti siña madetetmina i bariånte unibetsåt i { $component } sa' ti konstante na numero i numToSelect.

variant-with-replacement-not-constant-boolean = ti siña madetetmina i bariånte unibetsåt i { $component } sa' ti konstante na boolean i withReplacement.

variant-select-weight-disables-unique = Mapuno' i bariånte unibetsåt para i select yanggen guaha opsion ni madetetmina i selectWeight pat i selectForVariants

variant-coprime-undetermined = ti siña madetetmina i bariånte unibetsåt i { $component } sa' ti siña madetetmina na siempre false i coprime.

variant-attribute-not-constant = ti siña madetetmina i bariånte unibetsåt i { $component } sa' ti konstante i { $attribute }.

variant-attribute-not-number = ti siña madetetmina i bariånte unibetsåt i { $component } sa' ti numero i { $attribute }.

variant-attribute-wrong-type-for-sequence =
    ti siña madetetmina i bariånte unibetsåt i { $component } klåsi { $type } sa' ti { $expected ->
        [letters-combination] kombinasion letra
        [math-expression] maolek na ekspresion matemåtika
        [integer] kabåles na numero
       *[number] numero
    } i { $attribute }.

variant-length-not-integer = ti siña madetetmina i bariånte unibetsåt i { $component } sa' ti kabåles na numero i length.

variant-sort-not-implemented = trabiha ti mafa'tinas i bariånte unibetsåt un { $component } ni guaha sort

variant-exclude-combinations-not-implemented = trabiha ti mafa'tinas i bariånte unibetsåt un { $component } ni guaha excludeCombinations

variant-math-exclude-not-implemented = trabiha ti mafa'tinas i bariånte unibetsåt un { $component } klåsi math ni guaha exclude

variant-non-constant-exclude-not-implemented = trabiha ti mafa'tinas i bariånte unibetsåt un { $component } ni guaha exclude ni ti konstante

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ti masetbe gi renderer prefigure i graph; malaktos i linahyan.

prefigure-descendant-invalid-geometry = { $subject }: ti kabåles pat ti finite i heometria; malaktos i linahyan.

prefigure-curve-label-omitted = { $subject }: ti masetbe i etiketa gi kotba ni makonbietti; ma'ignora i etiketa.

prefigure-curve-unsupported-definition-type = { $subject }: ti masetbe i klåsen definasion funsion kotba '{ $definitionType }'; malaktos i linahyan.

prefigure-region-flip-functions-unsupported = { $subject }: ti masetbe i atributo flipFunctions gi regionBetweenCurves; malaktos i linahyan.

prefigure-region-non-formula-child = { $subject }: i famagu'on funsion klåsi formula ha' masetbe gi regionBetweenCurves; malaktos i linahyan.

prefigure-label-position-unsupported =
    { $subject }: ti masetbe i labelPosition '{ $labelPosition }' para i { $labelKind ->
        [line-family] etiketan i familian liña
       *[point] etiketan i punto
    }; masetbe i kostumbren alineasion PreFigure.

prefigure-fill-style-unsupported = { $subject }: ti masetbe ni PreFigure i estilon i sanhalom '{ $fillStyle }'; matalo' guatu gi bula na sanhalom.

prefigure-line-style-unknown = { $subject }: ti matungo' i estilon liña '{ $lineStyle }', ma'ignora gi output PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: mapega i estilon marker '{ $markerStyle }' gi estilo 'diamond' PreFigure.

prefigure-marker-style-unsupported = { $subject }: ti masetbe ni PreFigure i estilon marker '{ $markerStyle }'; masetbe i kostumbren estilo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ti maolek na `ref`; ti siña ma'apunta i target. Ma'ignora i annotation.

annotation-ref-multiple-targets = `<annotation>`: ha apunta i `ref` meggai na target; masetbe i fine'nana na target.

annotation-ref-outside-graph = `<annotation>`: ti maolek na `ref`; gaige i target gi sanhiyong i graph ni gaige gui'. Ma'ignora i annotation.

annotation-ref-unsupported-target = `<annotation>`: ti maolek na `ref`; ti grafiko na guinaha ni masetbe i target gi konbetsion prefigure. Ma'ignora i annotation.

annotation-text-missing = `<annotation>`: taya' pat baså i `text`; ha na'huyong baså na teksto.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Masodda' un dependensia sirkulåt.
       *[other] Masodda' un dependensia sirkulåt ni ha inkluye i komponente `<{ $componentType }>`.
    }

reference-no-referent = Taya' masodda' ni ma'apunta i refirensia: `{ $reference }`

reference-multiple-referents = Meggai masodda' ni ma'apunta i refirensia: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ti maolek na fotmåtu i atributo { $attribute } i `<{ $componentType }>`.

children-invalid = Ti maolek i famagu'on i `<{ $componentType }>`: masodda' famagu'on ni ti maolek: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ti maolek na balot `{ $value }` para i atributo `{ $attribute }`, masetbe i balot `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ti masodda' i betsion DoenetML { $version }.
       *[other] Ti masodda' i betsion DoenetML { $version }. Matalo' guatu gi betsion { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Ti maolek na DoenetML: { $content }

parse-tag-missing-close-tag = Ti maolek na DoenetML: Taya' tag pangkhuchom i tag `{ $tag }`. Manangga un tag ni ha huchom maisa pat un tag `</{ $tagName }>`.

parse-tag-error = Ti maolek na DoenetML: Guaha linachi gi tag `<{ $tagName }>`

parse-attribute-missing-value = Ti maolek na DoenetML: Kalan taya' balot i atributo ni ti maolek `{ $attribute }`.

parse-attribute-invalid = Ti maolek na DoenetML: Ti maolek na atributo `{ $attribute }`

parse-attribute-value-invalid = Ti maolek na DoenetML: Ti maolek na balot atributo `{ $value }`

parse-attribute-value-quote-mismatch = Ti maolek na DoenetML: Ti maolek na balot atributo `{ $value }`. Ti parehu i marka sita. Kalan taya' unu na `{ $quote }`

parse-open-tag-name-missing = Ti maolek na DoenetML: Masodda' un tag ni taya' na'ån-ña, ehemplo `<`

parse-tag-not-closed = Ti maolek na DoenetML: Ti mahuchom i tag `{ $tag }` (kalan taya' `>`).

parse-self-closing-tag-name-missing = Ti maolek na DoenetML: Masodda' un tag ni taya' na'ån-ña `<{ $content }>`

parse-self-closing-tag-not-closed = Ti maolek na DoenetML: Ti mahuchom i tag `{ $tag }` (kalan taya' `/>`).

parse-tag-invalid-attributes = Ti maolek na DoenetML: Ti maolek i tag `{ $tag }`. Siña ti maolek i atributo-ña.

parse-close-tag-name-missing = Ti maolek na DoenetML: Masodda' un tag pangkhuchom ni taya' na'ån-ña, ehemplo `</`

parse-attribute-value-unquoted = Debi di u mapo'lo gi halom marka sita i balot atributo: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ti maolek na DoenetML: Masodda' un tag pangkhuchom `{ $tag }`, lao taya' tag pangbaba ni parehu

parse-close-tag-mismatched = Ti maolek na DoenetML: Ti parehu i tag pangkhuchom. Manangga i `</{ $expected }>`. Masodda' i `{ $found }`

parser-node-unconvertible = Ti siña makonbietti i node { $node } para un node Dast.

## Names

name-attribute-invalid =
    Ti maolek na atributo name='{ $name }'. { $reason ->
        [characters] Siña ha' guaha letra, numero, guion papa' pat guion gi na'ån.
       *[start] Debi di u tutuhon i na'ån ni un letra.
    }

component-name-invalid-start = Ti maolek na na'ån komponente "{ $name }". Debi di u tutuhon i na'ån ni un letra.

## `<answer>` sugar

answer-video-watched-missing-video = Debi di guaha atributo video i answer ni type videoWatched

answer-video-watched-video-not-reference = Debi di refirensia i atributo video i answer ni type videoWatched

answer-name-not-single-text = Debi di guaha unu ha' na famagu'on text i atributo name i answer

## Referencing another document

external-doenetml-recursion-limit = Ti siña machule' i DoenetML gi sanhiyong sa' megai megai i nibet i marepiti. Guaha refirensia sirkulåt?

external-doenetml-unavailable = Ti siña machule' i DoenetML ginen i { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Ti maolek na DoenetML machule' ginen i { $attribute }="{ $uri }": ti parehu yan i klåsen komponente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ti masetbe mås i atributo `{ $from }`; setbe i `{ $to }`.
       *[other] [deprecation] Ti masetbe mås i atributo `{ $from }` gi `<{ $component }>`; setbe i `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ti masetbe mås i atributo `{ $from }` ya ma'ignora sa' madetetmina lokkue' i `{ $to }`.
       *[other] [deprecation] Ti masetbe mås i atributo `{ $from }` gi `<{ $component }>` ya ma'ignora sa' madetetmina lokkue' i `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Ti masetbe mås i atributo `{ $attribute }` gi `<{ $component }>` ya ma'ignora.

deprecated-attribute-to-child = [deprecation] Ti masetbe mås i atributo `{ $attribute }` gi `<{ $component }>`; setbe un famagu'on `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Ti masetbe mås i balot `{ $value }` i atributo `{ $attribute }` gi `<{ $component }>`; setbe i `{ $to }`.


## Language coverage

pluralize-english-only = Siña ha' ha na'meggai i `<pluralize>` i fino' Engles, pues ti matulaika i teksto-ña gi dokumento ni matuge' ni { $locale }. Tuge' mismo i fotman meggai, pat po'lo ni atributo `pluralForm`.


## Checking against the schema

schema-element-unrecognized = I elemento `<{ $tag }>` ti elementon Doenet ni matungo'.

schema-element-not-allowed-at-root = Ti mapetmiti i elemento `<{ $tag }>` gi hale' i dokumento.

schema-element-not-allowed-inside = Ti mapetmiti i elemento `<{ $tag }>` gi halom i `<{ $parent }>`.

schema-attribute-unrecognized = Taya' atributo na'ån-ña `{ $attribute }` i elemento `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Debi di u lista i atributo `{ $attribute }` i elemento `<{ $tag }>` ni kada guinaha-ña unu gi: { $allowed }
       *[other] Debi di unu gi este siha i atributo `{ $attribute }` i elemento `<{ $tag }>`: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ti maolek na na'ån bariånte para i select.  Humuyong i na'ån bariånte { $variantName } gi { $numOptions } na opsion lao { $numToSelect } i kuenton ma'ayek.

select-variant-name-without-options = Guaha bariånte madetetmina para i select lao taya' opsion madetetmina para i posiblen na'ån bariånte: { $variantName }.

select-variant-name-not-possible = I na'ån bariånte { $variantName } ni madetetmina para i select ti posiblen na'ån bariånte.

select-too-few-options = Ti siña ma'ayek { $numToSelect } na komponente ginen { $numOptions } ha'.

select-from-sequence-too-few-values = Ti siña ma'ayek { $numToSelect } na balot ginen un sequence ni { $length } i anåkkon-ña.

select-from-sequence-indices-count-mismatch = Debi di u parehu i kuenton indise ni madetetmina para i select yan i kuenton ma'ayek

select-from-sequence-indices-not-integers = Debi di kabåles na numero todu i indise ni madetetmina para i select

select-from-sequence-index-excluded = I indisen selectfromsequence ni madetetmina ma'ekskluye

select-from-sequence-indices-excluded-combination = I indisen selectfromsequence ni madetetmina un kombinasion ni ma'ekskluye

select-from-sequence-coprime-not-positive-integers = Ti siña ma'ayek kombinasion coprime sa' ti kabåles na numero positibu i ma'ayek.

select-from-sequence-coprime-common-factor = Ti siña ma'ayek numero coprime. Guaha faktot parehu todu i posiblen balot. (Debi di u coprime i balot "from" pat "to" yan i "step".)

select-from-sequence-coprime-single-number = Ti siña ma'ayek kombinasion coprime ginen unu ha' na numero ni ti 1.

select-from-sequence-excluded-too-many-combinations = Ma'ekskluye mås ki 70% i kombinasion gi selectFromSequence

select-from-sequence-coprime-none-found = Ti siña ma'ayek numero coprime. Guaha faktot parehu todu i posiblen balot.

select-from-sequence-too-few-unique-values = Ti siña ma'ayek { $numToSelect } na balot unibetsåt ginen un sequence ni { $numPossibleValues } i anåkkon-ña

select-prime-numbers-too-few-values = Ti siña ma'ayek { $numToSelect } na balot ginen un listan prima ni { $numValues } i anåkkon-ña

select-prime-numbers-values-count-mismatch = Debi di u parehu i kuenton balot ni madetetmina para i select yan i kuenton ma'ayek

select-prime-numbers-values-not-prime = Debi di gaige gi listan prima todu i balot ni madetetmina para i select prime number

select-prime-numbers-values-excluded-combination = I balotan selectPrimeNumbers ni madetetmina un kombinasion ni ma'ekskluye

select-prime-numbers-excluded-too-many-combinations = Ma'ekskluye mås ki 70% i kombinasion gi selectPrimeNumbers

select-random-combination-fluke = Sa' un suette ni ti guaguan, ti siña ma'ayek un kombinasion balot råndom

select-random-value-fluke = Sa' un suette ni ti guaguan, ti siña ma'ayek un balot råndom
