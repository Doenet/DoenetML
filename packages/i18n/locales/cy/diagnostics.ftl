# Welsh diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
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
# Welsh counts in six plural categories, but most of the counted messages
# below need no select at all: the impersonal «anwybyddir» reads alike for one
# attribute and for several, and a noun after a numeral stays singular. Where
# the count is a list length and the noun itself changes — «paramedr» against
# «paramedrau» — the two branches the English source has are kept.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = anwybyddir { $attributes } pan bennir dau bwynt terfyn

line-segment-attributes-ignored-with-endpoint-and-midpoint = anwybyddir { $attributes } pan bennir pwynt terfyn a chanolbwynt gyda'i gilydd

line-segment-midpoint-offset-without-midpoint = nid oes gan midpointOffset unrhyw effaith heb ganolbwynt

## `<line>`

line-points-undetermined-dimensions = Llinell drwy bwyntiau nad yw eu dimensiynau'n hysbys.

line-points-too-few-dimensions = Rhaid i'r llinell fynd drwy bwyntiau sydd â dau ddimensiwn o leiaf.

line-points-depend-on-variables = Mae'r llinell yn mynd drwy bwyntiau sy'n dibynnu ar newidynnau: { $variables }.

line-equation-invalid-format = Fformat annilys ar gyfer hafaliad llinell yn y newidynnau canlynol: { $variable1 }, { $variable2 }.

## `<ray>`

ray-overprescribed-through = Pennir y pelydryn gan through, endpoint a direction.  Anwybyddir y through a bennwyd.

ray-dimension-mismatch = Anghysondeb numDimensions yn y pelydryn.

## `<vector>`

vector-overprescribed-head = Pennir y fector gan head, tail a displacement.  Anwybyddir y head a bennwyd.

vector-dimension-mismatch = Anghysondeb numDimensions yn y fector.

## Attracting and constraining

attract-to-without-nearest-point = Ni ellir denu at `<{ $component }>` gan nad oes ganddo newidyn cyflwr nearestPoint.

constrain-to-without-nearest-point = Ni ellir cyfyngu at `<{ $component }>` gan nad oes ganddo newidyn cyflwr nearestPoint.

constrain-to-interior-without-nearest-point = Ni ellir cyfyngu at du mewn `<{ $component }>` gan nad oes ganddo newidyn cyflwr nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = Anwybyddir labelPosition ar gyfer choiceInput nad yw'n inline

## Ordering children by index

choice-input-indices-count-mismatch = Anwybyddir y mynegeion a bennwyd ar gyfer choiceInput gan nad yw eu nifer yn cyfateb i nifer y plant choice.

pretzel-indices-count-mismatch = Anwybyddir y mynegeion a bennwyd ar gyfer problem gan nad yw eu nifer yn cyfateb i nifer y plant problem.

shuffle-indices-count-mismatch = Anwybyddir y mynegeion a bennwyd ar gyfer shuffle gan nad yw eu nifer yn cyfateb i nifer y cydrannau.

indices-ignored-out-of-range = Anwybyddir y mynegeion a bennwyd ar gyfer { $component } gan fod rhai ohonynt y tu allan i'r amrediad.

pretzel-indices-repeated = Anwybyddir y mynegeion a bennwyd ar gyfer pretzel gan fod rhai ohonynt yn cael eu hailadrodd.

pretzel-circuit-first-index = Anwybyddir y mynegeion a bennwyd ar gyfer pretzel yn y modd circuit gan fod rhaid i'r mynegai cyntaf fod yn 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Er mwyn i `<{ $component }>` weithio gyda phlant llinyn, rhaid pennu priodoledd `type`.

invalid-type-defaulting-to-math = Math annilys { $type } ar gyfer y gydran { $component }. Rhaid iddo fod yn un o math, text, number neu boolean. Yn dychwelyd i math.

string-not-valid-component-to-arrange = Nid yw'r llinyn "{ $value }" yn gydran ddilys ar gyfer { $component }. Yn ei anwybyddu.

## Types and variables

invalid-type-defaulting-to-number = Math annilys { $type }, yn gosod y math i number.

invalid-variable-value = Gwerth annilys ar gyfer newidyn: `{ $value }`

## Variants

variant-index-must-be-number = Rhaid i fynegai'r amrywiad { $index } fod yn rhif

variant-index-must-be-integer = Rhaid i fynegai'r amrywiad { $index } fod yn gyfanrif

## `<sideBySide>`

side-by-side-absolute-widths = Nid yw `<{ $component }>` wedi'i weithredu ar gyfer mesuriadau absoliwt. Yn gosod y lledau'n gymharol.

side-by-side-absolute-margins = Nid yw `<{ $component }>` wedi'i weithredu ar gyfer mesuriadau absoliwt. Yn gosod yr ymylon yn gymharol.

side-by-side-no-block-child = `<{ $component }>` annilys: rhaid iddo gael o leiaf un plentyn bloc.

## `<label>`

label-for-ignored-on-graphical = Anwybyddir y briodoledd `for` ar `<label>` graffigol.

label-for-must-resolve-to-one = Rhaid i'r briodoledd `for` ar `<label>` ddatrys i un gydran yn union.

label-for-unresolved = Nid oedd modd datrys y briodoledd `for` ar `<label>` i gydran.

label-for-answer-with-authored-inputs = Mae'r briodoledd `for` ar `<label>` yn cyfeirio at `<answer>` sydd â mewnbynnau wedi'u hysgrifennu'n benodol; cyfeiriwch at y mewnbwn ei hun.

label-for-answer-without-input = Mae'r briodoledd `for` ar `<label>` yn cyfeirio at `<answer>` heb fewnbwn i'w labelu.

label-for-must-reference-input-or-answer = Rhaid i'r briodoledd `for` ar `<label>` gyfeirio at fewnbwn neu at ateb.

## Accessibility

accessibility-short-description-or-decorative = Er mwyn hygyrchedd, rhaid i `<{ $component }>` gael disgrifiad byr neu gael ei bennu'n addurnol.

accessibility-video-short-description = Er mwyn hygyrchedd, rhaid i `<video>` gael disgrifiad byr.

accessibility-input-short-description-or-label = Er mwyn hygyrchedd, rhaid i `<{ $component }>` gael disgrifiad byr neu label.

accessibility-answer-input-short-description-or-label = Er mwyn hygyrchedd, rhaid i `<answer>` sy'n creu mewnbwn gael disgrifiad byr neu label.

accessibility-short-description-contains-math = Ni ddylai disgrifiad byr gynnwys cydrannau mathemategol fel `<{ $component }>`. Ysgrifennwch unrhyw fathemateg mewn geiriau.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Nid oes gan { $colorName } ddigon o gyferbyniad ar gyfer testun pennawd yr adran (modd tywyll) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mae angen { $threshold }:1 o leiaf).
       *[other] Nid oes gan { $colorName } ddigon o gyferbyniad ar gyfer testun pennawd yr adran ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mae angen { $threshold }:1 o leiaf).
    }

## `<circle>`

circle-through-points-non-numerical = Nid yw `<circle>` drwy { $count } pwynt wedi'i weithredu pan nad oes gan y pwyntiau werthoedd rhifiadol.

circle-too-many-through-points = Ni ellir cyfrifo cylch drwy fwy na 3 phwynt.

circle-overprescribed-radius-center-points = Ni ellir cyfrifo cylch pan bennir y radiws, y canol a'r pwyntiau drwodd.

circle-center-with-multiple-points = Ni ellir cyfrifo cylch â chanol penodedig drwy fwy nag un pwynt.

circle-radius-too-small = Ni ellir cyfrifo'r cylch: gan mai { $distance } yw'r pellter rhwng y ddau bwynt, mae'r radiws penodedig { $radius } yn rhy fach.

circle-radius-with-many-points = Ni ellir creu cylch drwy fwy na dau bwynt â radiws penodedig.

circle-invalid-center-or-through-points = Canol neu bwyntiau drwodd annilys ar gyfer y cylch.

circle-radius-center-with-multiple-points = Ni ellir cyfrifo radiws cylch â chanol penodedig drwy fwy nag un pwynt.

circle-change-radius-non-numerical = Ni ellir newid radiws cylch pan nad oes gan y pwyntiau drwodd werthoedd rhifiadol

circle-radius-with-points-non-numerical = Ni ellir creu cylch drwy fwy nag un pwynt â radiws penodedig pan nad oes gwerthoedd rhifiadol.

circle-change-center-non-numerical = Nid yw newid canol cylch drwy bwyntiau heb werthoedd rhifiadol wedi'i weithredu.

## `<function>`

function-domain-insufficient-dimensions = Dimensiynau annigonol ar gyfer parth y ffwythiant. Mae gan y parth { $intervals } cyfwng ond mae gan y ffwythiant { $inputs } mewnbwn.

function-domain-invalid-format = Fformat annilys ar gyfer parth y ffwythiant.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Yn anwybyddu uchafbwynt anrhifiadol y ffwythiant.
        [minimum] Yn anwybyddu isafbwynt anrhifiadol y ffwythiant.
        [extremum] Yn anwybyddu eithafbwynt anrhifiadol y ffwythiant.
        [point] Yn anwybyddu pwynt anrhifiadol y ffwythiant.
        [slope] Yn anwybyddu graddiant anrhifiadol y ffwythiant.
       *[other] Yn anwybyddu { $type } anrhifiadol y ffwythiant.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Yn anwybyddu uchafbwynt gwag y ffwythiant.
        [minimum] Yn anwybyddu isafbwynt gwag y ffwythiant.
        [extremum] Yn anwybyddu eithafbwynt gwag y ffwythiant.
        [point] Yn anwybyddu pwynt gwag y ffwythiant.
       *[other] Yn anwybyddu { $type } gwag y ffwythiant.
    }

function-points-too-close = Mae gan y ffwythiant ddau bwynt sy'n rhy agos at ei gilydd. Ni ellir diffinio'r ffwythiant.

# «ond» rather than «a» joins the two counts: «a» becomes «ac» before a vowel,
# and whether the numeral after it is read with one is the value's business
# rather than this catalog's.
function-iterates-input-output-mismatch = Dim ond pan fo nifer mewnbynnau'r ffwythiant yn hafal i nifer ei allbynnau y mae iteriadau'n bosibl. Mae gan y ffwythiant hwn { $inputs } mewnbwn ond { $outputs } allbwn.

## `<sequence>`

sequence-invalid-length = Hyd annilys ar gyfer dilyniant.  Rhaid iddo fod yn gyfanrif anegatif.

sequence-invalid-step = Cam annilys ar gyfer dilyniant.  Rhaid iddo fod yn rhif ar gyfer dilyniant o'r math { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" annilys ar gyfer dilyniant rhifau.  Rhaid iddo fod yn rhif.

sequence-invalid-endpoint-letters = "{ $attribute }" annilys ar gyfer dilyniant llythrennau.  Rhaid iddo fod yn gyfuniad o lythrennau.

sequence-invalid-endpoint = "{ $attribute }" annilys ar gyfer dilyniant.

select-from-sequence-coprime-not-numbers = anwybyddir coprime gan nad rhifau sy'n cael eu dewis

select-from-sequence-coprime-with-exclude-combinations = anwybyddir coprime gan fod excludeCombinations wedi'i bennu

## Resolving a `target`

target-not-found = Targed annilys ar gyfer `<{ $source }>`: ni ellir dod o hyd i'r targed.

target-state-variable-not-found = Targed annilys ar gyfer `<{ $source }>`: ni ellir dod o hyd i newidyn cyflwr o'r enw "{ $property }" ar `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Rhaid i newidynnau `<odeSystem>` fod yn wahanol i'r newidyn annibynnol.

ode-system-duplicate-variable-names = Ni ellir diffinio ffwythiannau RHS ODE ag enwau newidynnau dibynnol dyblyg.

ode-system-rhs-function-error = Ni ellir diffinio ffwythiant RHS ODE.  Gwall wrth greu ffwythiant mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ni ellir diffinio ongl rhwng { $count } llinell

angle-invalid-through-point = Pwynt annilys yn through `<angle>`

parabola-vertex-too-many-points = Nid yw parabola â fertig drwy fwy nag un pwynt wedi'i weithredu.

parabola-too-many-points = Nid yw parabola drwy fwy na 3 phwynt wedi'i weithredu.

intersection-too-many-items = Nid yw croestoriad ar gyfer mwy na dwy eitem wedi'i weithredu

## Other math components

ionic-compound-not-two-ions = Nid yw cyfansoddyn ïonig wedi'i weithredu ar gyfer dim byd ond dau ïon.

ionic-compound-needs-cation-and-anion = Dim ond ar gyfer un catïon ac un anïon y mae cyfansoddyn ïonig wedi'i weithredu.

solve-equations-cannot-evaluate = Ni ellir datrys yr hafaliad gan nad oedd modd ei werthuso: { $equation }

math-operators-operand-number-required = Rhaid pennu operandNumber wrth dynnu operand mathemategol.

eigen-decomposition-failed = Nid oedd modd cyfrifo eigenwerthoedd y matrics

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: nid yw'r paramedr { $parameters } yn ymddangos yn y patrwm, felly bydd bob amser yn cyfateb i fwlch.
       *[other] `<matchesPattern>`: nid yw'r paramedrau { $parameters } yn ymddangos yn y patrwm, felly byddant bob amser yn cyfateb i fwlch.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ni ellir dehongli grid="{ $grid }". Rhaid iddo fod yn none, medium, dense, neu'n ddau rif positif wedi'u gwahanu gan fwlch, fel grid="1 0.5". Ni thynnir grid.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: ni chefnogir xLabelPosition="left" yn y rendrwr prefigure; yn defnyddio ymddygiad y safle dde.

prefigure-y-label-position-unsupported = `<graph>`: ni chefnogir yLabelPosition="bottom" yn y rendrwr prefigure; yn defnyddio ymddygiad y safle uchaf.

prefigure-invalid-axis-bounds = `<graph>`: ffiniau echelin annilys ar gyfer trosi prefigure; yn defnyddio'r bbox rhagosodedig (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lled annilys ar gyfer trosi prefigure; yn defnyddio lled diagram rhagosodedig o 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio annilys ar gyfer trosi prefigure; yn defnyddio'r gymhareb agwedd ragosodedig 1.

prefigure-grid-spacing-too-fine = `<graph>`: mae bylchau'r grid yn rhy fân ar gyfer terfynau'r echelin; hepgorir y grid yn y rendrwr prefigure.

prefigure-annotations-not-rendered = `<graph>`: ni chaiff anodiadau eu rendro oni bai bod y rendrwr PreFigure yn cael ei ddefnyddio.

multiple-annotations-children = Canfuwyd sawl plentyn `<annotations>` yn `<graph>`; anwybyddir pob un ond yr olaf.

## Referring to other components

copy-unrecognized-component-type = Ni ellir ymestyn na chopïo math cydran anhysbys: { $type }.

copy-prop-not-found = Nid oedd modd dod o hyd i'r prop { $property } ar gydran o'r math { $component }

collect-no-source = Ni chanfuwyd ffynhonnell ar gyfer collect.

collect-invalid-component-type = Ni ellir casglu cydrannau o'r math `<{ $component }>` gan ei fod yn fath cydran annilys.

reference-index-unavailable = Ni ellir cyfeirio at y mynegai `{ $reference }`

## `<callAction>`

component-action-unavailable = Ni ellir galw { $action } ar y gydran `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Mae siâp y data'n annilys.  Mae hyd y rhesi'n anghyson. Canfuwyd yn componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Mae gan y data enwau colofnau dyblyg.  Canfuwyd yn componentIdx :{ $componentIdx }

data-frame-missing-column-name = Mae enw colofn ar goll o'r data.  Canfuwyd yn componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Mae gwobr ar gyfer yr ateb hwn yn seiliedig ar yr ateb a gyflwynwyd gan y tag answer ei hun, a fydd yn arwain at ymddygiad annisgwyl.

answer-max-num-attempts-in-section-wide-check-work = Nid oes effaith i osod `maxNumAttempts` ar `<answer>` y tu mewn i gynhwysydd â `sectionWideCheckWork`, gan mai'r cynhwysydd sy'n rheoli nifer y cynigion. Gosodwch `maxNumAttempts` ar y cynhwysydd yn lle hynny.

nested-section-wide-check-work-max-num-attempts = Nid oes effaith i osod `maxNumAttempts` ar gynhwysydd â `sectionWideCheckWork` sydd y tu mewn i gynhwysydd arall â `sectionWideCheckWork`, gan mai'r cynhwysydd allanol sy'n rheoli nifer y cynigion. Gosodwch `maxNumAttempts` ar y cynhwysydd allanol yn lle hynny.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Ni fydd unrhyw effaith i'r briodoledd { $attributes } heb osod symbolicEquality.
       *[other] Ni fydd unrhyw effaith i'r priodoleddau { $attributes } heb osod symbolicEquality.
    }

answer-invalid-type = Math annilys ar gyfer yr ateb: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Gan nad oes enw ar y gydran `<{ $component }>`, ni ellir ei defnyddio fel priodoledd modiwl

module-attribute-name-already-defined = Ni ellir defnyddio'r gydran `<{ $component } name="{ $name }">` fel priodoledd ar gyfer modiwl gan fod gan y math cydran `<module>` briodoledd "{ $name }" wedi'i diffinio eisoes.

conditional-content-condition-ignored = Anwybyddir y briodoledd `condition` ar gydran `<conditionalContent>` sydd â phlant case neu else.

slider-markers-type-mismatch = Nid yw math y marcwyr yn cyfateb i fath y llithrydd.

pretzel-problem-needs-statement-and-answer = Pretzel annilys: rhaid i bob `<problem>` gynnwys un `<statement>` ac un `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel annilys: yn mode="circuit", ni all y `<problem>` cyntaf fod yn wrthdyniad.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Gwerth annilys { $values } ar gyfer y briodoledd `{ $attribute }`; yn ei anwybyddu.
       *[other] Gwerthoedd annilys { $values } ar gyfer y briodoledd `{ $attribute }`; yn eu hanwybyddu.
    }

attribute-must-be-references = Gwerth annilys `{ $value }` ar gyfer y briodoledd `{ $attribute }`. Rhaid i'r briodoledd gynnwys cyfeiriadau sy'n dechrau â `$`.

math-input-invalid-function-names = <mathInput>: anwybyddwyd enw(au) ffwythiant annilys yn { $attribute }: { $names }. Rhaid i segment arddangos pob enw fod o leiaf 2 nod (llythrennau neu gysylltnodau); gall ôl-ddodiad dewisol `|<mathspeak alternative>` ddilyn.

## Building components from the source

component-type-invalid = Math cydran annilys: `<{ $componentType }>`

attribute-repeated = Ni ellir ailadrodd y briodoledd { $attribute }.

attribute-invalid-for-component = Priodoledd annilys "{ $attribute }" ar gyfer cydran o'r math `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Nid oes gan ddiffiniad arddull { $styleNumber } ddigon o gyferbyniad ar gyfer { $context ->
        [text-on-background] lliw'r testun yn erbyn lliw'r cefndir
        [high-contrast] y lliw cyferbyniad uchel yn erbyn y cynfas
        [line] lliw'r llinell yn erbyn y cynfas
        [marker] lliw'r marciwr yn erbyn y cynfas
       *[text-on-canvas] lliw'r testun yn erbyn y cynfas
    }{ $mode ->
        [dark] { " (modd tywyll)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mae angen { $threshold }:1 o leiaf).

style-definition-dark-mode-text-background-contrast =
    Er bod gan ddiffiniad arddull { $styleNumber } liwiau penodedig sy'n rhoi digon o gyferbyniad yn y modd golau, nid oes gan y lliwiau modd tywyll a ddeilliodd ohonynt ddigon o gyferbyniad rhwng lliw'r testun a lliw'r cefndir ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mae angen { $threshold }:1 o leiaf). { $suggestion ->
        [available] Er mwyn sicrhau digon o gyferbyniad yn y modd tywyll, naill ai cynyddwch gyferbyniad y modd golau (e.e. gosodwch { $lightAttribute }="{ $lightColor }") neu ddiystyrwch liw'r modd tywyll (e.e. gosodwch { $darkAttribute }="{ $darkColor }").
       *[none] Er mwyn sicrhau digon o gyferbyniad yn y modd tywyll, cynyddwch gyferbyniad y modd golau neu ddiystyrwch y lliwiau a ddeilliodd ohonynt â textColorDarkMode a/neu backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Er bod gan ddiffiniad arddull { $styleNumber } liw testun penodedig sy'n rhoi digon o gyferbyniad yn y modd golau, nid oes gan liw testun y modd tywyll a ddeilliodd ohono ddigon o gyferbyniad yn erbyn y cynfas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mae angen { $threshold }:1 o leiaf). { $suggestion ->
        [available] Er mwyn sicrhau digon o gyferbyniad yn y modd tywyll, naill ai cynyddwch gyferbyniad y modd golau (e.e. gosodwch textColor="{ $lightColor }") neu ddiystyrwch liw'r modd tywyll (e.e. gosodwch textColorDarkMode="{ $darkColor }").
       *[none] Er mwyn sicrhau digon o gyferbyniad yn y modd tywyll, cynyddwch gyferbyniad y modd golau neu ddiystyrwch y lliw a ddeilliodd ohono â textColorDarkMode.
    }

section-multiple-style-palettes = Dim ond un <stylePalette> y gall adran ei ddewis; yn defnyddio'r olaf.

## Unique variants

variant-num-to-select-not-non-negative-integer = ni ellir pennu amrywiadau unigryw { $component } gan nad yw numToSelect yn gyfanrif anegatif.

variant-num-to-select-not-constant-number = ni ellir pennu amrywiadau unigryw { $component } gan nad yw numToSelect yn rif cyson.

variant-with-replacement-not-constant-boolean = ni ellir pennu amrywiadau unigryw { $component } gan nad yw withReplacement yn Boole cyson.

variant-select-weight-disables-unique = Analluogir amrywiadau unigryw ar gyfer select os oes opsiwn â selectWeight neu selectForVariants wedi'i bennu

variant-coprime-undetermined = ni ellir pennu amrywiadau unigryw { $component } gan na ellir pennu bod coprime bob amser yn gau.

variant-attribute-not-constant = ni ellir pennu amrywiadau unigryw { $component } gan nad yw { $attribute } yn gyson.

variant-attribute-not-number = ni ellir pennu amrywiadau unigryw { $component } gan nad yw { $attribute } yn rif.

variant-attribute-wrong-type-for-sequence =
    ni ellir pennu amrywiadau unigryw { $component } o'r math { $type } gan nad yw { $attribute } yn { $expected ->
        [letters-combination] gyfuniad o lythrennau
        [math-expression] fynegiad mathemategol dilys
        [integer] gyfanrif
       *[number] rif
    }.

variant-length-not-integer = ni ellir pennu amrywiadau unigryw { $component } gan nad yw length yn gyfanrif.

variant-sort-not-implemented = nid yw amrywiadau unigryw { $component } â sort wedi'u gweithredu

variant-exclude-combinations-not-implemented = nid yw amrywiadau unigryw { $component } ag excludeCombinations wedi'u gweithredu

variant-math-exclude-not-implemented = nid yw amrywiadau unigryw { $component } o'r math math ag exclude wedi'u gweithredu

variant-non-constant-exclude-not-implemented = nid yw amrywiadau unigryw { $component } ag exclude anghyson wedi'u gweithredu

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ni chefnogir hyn yn rendrwr prefigure y graff; hepgorwyd y disgynnydd.

prefigure-descendant-invalid-geometry = { $subject }: geometreg anfeidraidd neu anghyflawn; hepgorwyd y disgynnydd.

prefigure-curve-label-omitted = { $subject }: ni chefnogir labeli ar elfennau cromlin a droswyd; hepgorwyd y label.

prefigure-curve-unsupported-definition-type = { $subject }: math diffiniad ffwythiant cromlin nas cefnogir '{ $definitionType }'; hepgorwyd y disgynnydd.

prefigure-region-flip-functions-unsupported = { $subject }: ni chefnogir y briodoledd flipFunctions ar regionBetweenCurves; hepgorwyd y disgynnydd.

prefigure-region-non-formula-child = { $subject }: dim ond ffwythiannau plentyn o'r math formula a gefnogir ar regionBetweenCurves; hepgorwyd y disgynnydd.

prefigure-label-position-unsupported =
    { $subject }: labelPosition nas cefnogir '{ $labelPosition }' ar gyfer { $labelKind ->
        [line-family] label teulu'r llinellau
       *[point] label pwynt
    }; defnyddiwyd aliniad rhagosodedig PreFigure.

prefigure-fill-style-unsupported = { $subject }: nid yw PreFigure yn cefnogi'r arddull llenwi '{ $fillStyle }'; yn dychwelyd i lenwad solet.

prefigure-line-style-unknown = { $subject }: hepgorwyd arddull llinell anhysbys '{ $lineStyle }' o allbwn PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: mapiwyd arddull y marciwr '{ $markerStyle }' i arddull PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: nid yw PreFigure yn cefnogi arddull y marciwr '{ $markerStyle }'; defnyddiwyd yr arddull ragosodedig.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` annilys; ni ellir datrys y targed. Hepgorwyd yr anodiad.

annotation-ref-multiple-targets = `<annotation>`: datrysodd `ref` i sawl targed; yn defnyddio'r cyntaf.

annotation-ref-outside-graph = `<annotation>`: `ref` annilys; mae'r targed y tu allan i'r graff amgylchynol. Hepgorwyd yr anodiad.

annotation-ref-unsupported-target = `<annotation>`: `ref` annilys; nid yw'r targed yn wrthrych graffigol a gefnogir yn y trosi prefigure. Hepgorwyd yr anodiad.

annotation-text-missing = `<annotation>`: `text` ar goll neu'n wag; yn allbynnu testun gwag.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Canfuwyd dibyniaeth gylchol.
       *[other] Canfuwyd dibyniaeth gylchol sy'n cynnwys cydran `<{ $componentType }>`.
    }

reference-no-referent = Ni chanfuwyd cyfeiriedig ar gyfer y cyfeiriad: `{ $reference }`

reference-multiple-referents = Canfuwyd sawl cyfeiriedig ar gyfer y cyfeiriad: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Fformat annilys ar gyfer y briodoledd { $attribute } o `<{ $componentType }>`.

children-invalid = Plant annilys ar gyfer `<{ $componentType }>`: Canfuwyd plant annilys: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Gwerth annilys `{ $value }` ar gyfer y briodoledd `{ $attribute }`, yn defnyddio'r gwerth `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ni chanfuwyd fersiwn DoenetML { $version }.
       *[other] Ni chanfuwyd fersiwn DoenetML { $version }. Yn dychwelyd i fersiwn { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML annilys: { $content }

parse-tag-missing-close-tag = DoenetML annilys: Nid oes gan y tag `{ $tag }` dag cau. Disgwylid tag hunangaeedig neu dag `</{ $tagName }>`.

parse-tag-error = DoenetML annilys: Gwall yn y tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML annilys: Mae'n ymddangos bod gwerth ar goll o'r briodoledd annilys `{ $attribute }`.

parse-attribute-invalid = DoenetML annilys: Priodoledd annilys `{ $attribute }`

parse-attribute-value-invalid = DoenetML annilys: Gwerth priodoledd annilys `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML annilys: Gwerth priodoledd annilys `{ $value }`. Nid yw'r dyfynodau'n cyfateb. Mae'n ymddangos bod `{ $quote }` ar goll gennych

parse-open-tag-name-missing = DoenetML annilys: Canfuwyd tag heb enw tag, e.e. `<`

parse-tag-not-closed = DoenetML annilys: Ni chaewyd y tag `{ $tag }` (mae'n ymddangos bod `>` ar goll).

parse-self-closing-tag-name-missing = DoenetML annilys: Canfuwyd tag heb enw tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML annilys: Ni chaewyd y tag `{ $tag }` (mae'n ymddangos bod `/>` ar goll).

parse-tag-invalid-attributes = DoenetML annilys: Nid yw'r tag `{ $tag }` yn ddilys. Efallai bod ganddo briodoleddau anghywir.

parse-close-tag-name-missing = DoenetML annilys: Canfuwyd tag cau heb enw tag, e.e. `</`

parse-attribute-value-unquoted = Rhaid amgáu gwerthoedd priodoleddau mewn dyfynodau: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML annilys: Canfuwyd y tag cau `{ $tag }`, ond nid oes tag agor cyfatebol

parse-close-tag-mismatched = DoenetML annilys: Tag cau anghyfatebol. Disgwylid `</{ $expected }>`. Canfuwyd `{ $found }`

parser-node-unconvertible = Nid oedd modd trosi'r nod { $node } yn nod Dast.

## Names

name-attribute-invalid =
    Enw priodoledd annilys name='{ $name }'. { $reason ->
        [characters] Dim ond llythrennau, rhifau, tanlinellau neu gysylltnodau a all fod mewn enwau.
       *[start] Rhaid i enwau ddechrau â llythyren.
    }

component-name-invalid-start = Enw cydran annilys "{ $name }". Rhaid i enwau ddechrau â llythyren.

## `<answer>` sugar

answer-video-watched-missing-video = Rhaid i ateb o'r math videoWatched gael priodoledd video

answer-video-watched-video-not-reference = Rhaid i briodoledd video ateb o'r math videoWatched fod yn gyfeiriad

answer-name-not-single-text = Rhaid i briodoledd name yr ateb gael un plentyn testun

## Referencing another document

external-doenetml-recursion-limit = Ni ellir cyrchu DoenetML allanol oherwydd gormod o lefelau dychweliad. A oes cyfeiriad cylchol?

external-doenetml-unavailable = Ni ellir cyrchu DoenetML o { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML annilys wedi'i gyrchu o { $attribute }="{ $uri }": nid oedd yn cyfateb i'r math cydran "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Mae'r briodoledd `{ $from }` wedi darfod; defnyddiwch `{ $to }` yn ei lle.
       *[other] [deprecation] Mae'r briodoledd `{ $from }` ar `<{ $component }>` wedi darfod; defnyddiwch `{ $to }` yn ei lle.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Mae'r briodoledd `{ $from }` wedi darfod ac fe'i hanwybyddir gan fod `{ $to }` wedi'i bennu hefyd.
       *[other] [deprecation] Mae'r briodoledd `{ $from }` ar `<{ $component }>` wedi darfod ac fe'i hanwybyddir gan fod `{ $to }` wedi'i bennu hefyd.
    }

deprecated-attribute-ignored = [deprecation] Mae'r briodoledd `{ $attribute }` ar `<{ $component }>` wedi darfod ac fe'i hanwybyddir.


## Language coverage

pluralize-english-only = Dim ond Saesneg y gall `<pluralize>` ei luosogi, felly gadewir ei destun heb ei newid mewn dogfen a ysgrifennwyd yn { $locale }. Ysgrifennwch y ffurf luosog yn uniongyrchol, neu ei gosod â'r briodoledd `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Nid yw'r elfen `<{ $tag }>` yn elfen Doenet gydnabyddedig.

schema-element-not-allowed-at-root = Ni chaniateir yr elfen `<{ $tag }>` wrth wraidd y ddogfen.

schema-element-not-allowed-inside = Ni chaniateir yr elfen `<{ $tag }>` y tu mewn i `<{ $parent }>`.

schema-attribute-unrecognized = Nid oes gan yr elfen `<{ $tag }>` briodoledd o'r enw `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Rhaid i'r briodoledd `{ $attribute }` o'r elfen `<{ $tag }>` fod yn rhestr lle mae pob eitem yn un o: { $allowed }
       *[other] Rhaid i'r briodoledd `{ $attribute }` o'r elfen `<{ $tag }>` fod yn un o: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Enw amrywiad annilys ar gyfer select.  Mae'r enw amrywiad { $variantName } yn ymddangos mewn { $numOptions } opsiwn ond { $numToSelect } yw'r nifer i'w dewis.

select-variant-name-without-options = Pennwyd amrywiadau ar gyfer select ond ni phennwyd unrhyw opsiwn ar gyfer yr enw amrywiad posibl: { $variantName }.

select-variant-name-not-possible = Nid yw'r enw amrywiad { $variantName } a bennwyd ar gyfer select yn enw amrywiad posibl.

select-too-few-options = Ni ellir dewis { $numToSelect } cydran o ddim ond { $numOptions }.

select-from-sequence-too-few-values = Ni ellir dewis { $numToSelect } gwerth o ddilyniant o hyd { $length }.

select-from-sequence-indices-count-mismatch = Rhaid i nifer y mynegeion a bennwyd ar gyfer select gyfateb i'r nifer i'w dewis

select-from-sequence-indices-not-integers = Rhaid i bob mynegai a bennwyd ar gyfer select fod yn gyfanrif

select-from-sequence-index-excluded = Pennwyd mynegai o selectfromsequence a gafodd ei eithrio

select-from-sequence-indices-excluded-combination = Pennwyd mynegeion o selectfromsequence a oedd yn gyfuniad wedi'i eithrio

select-from-sequence-coprime-not-positive-integers = Ni ellir dewis cyfuniadau cydgysefin gan nad cyfanrifau positif sy'n cael eu dewis.

select-from-sequence-coprime-common-factor = Ni ellir dewis rhifau cydgysefin. Mae gan bob gwerth posibl ffactor cyffredin. (Rhaid i'r gwerthoedd penodedig "from" neu "to" fod yn gydgysefin â "step".)

select-from-sequence-coprime-single-number = Ni ellir dewis cyfuniadau cydgysefin o un rhif nad yw'n 1.

select-from-sequence-excluded-too-many-combinations = Eithriwyd dros 70% o'r cyfuniadau yn selectFromSequence

select-from-sequence-coprime-none-found = Nid oedd modd dewis rhifau cydgysefin. Mae gan bob gwerth posibl ffactor cyffredin.

select-from-sequence-too-few-unique-values = Ni ellir dewis { $numToSelect } gwerth unigryw o ddilyniant o hyd { $numPossibleValues }

select-prime-numbers-too-few-values = Ni ellir dewis { $numToSelect } gwerth o restr o rifau cysefin o hyd { $numValues }

select-prime-numbers-values-count-mismatch = Rhaid i nifer y gwerthoedd a bennwyd ar gyfer select gyfateb i'r nifer i'w dewis

select-prime-numbers-values-not-prime = Rhaid i bob gwerth a bennwyd ar gyfer select prime number fod ar y rhestr o rifau cysefin

select-prime-numbers-values-excluded-combination = Roedd y gwerthoedd a bennwyd ar gyfer selectPrimeNumbers yn gyfuniad wedi'i eithrio

select-prime-numbers-excluded-too-many-combinations = Eithriwyd dros 70% o'r cyfuniadau yn selectPrimeNumbers

select-random-combination-fluke = Trwy hap eithriadol o annhebygol, nid oedd modd dewis cyfuniad o werthoedd hap

select-random-value-fluke = Trwy hap eithriadol o annhebygol, nid oedd modd dewis gwerth hap
