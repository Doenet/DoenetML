# Southern Sotho diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
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
# Where English separates a singular from a plural only in the verb — "is
# ignored" against "are ignored" — the Sesotho verb takes its subject concord
# from the noun class rather than from the count, and the argument is a list
# either way. So those selects are dropped and the count argument goes unused.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } ha e nahanelwe ha dintlha tse pedi tsa pheletso di boletswe

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } ha e nahanelwe ha ntlha ya pheletso le ntlha ya bohareng di boletswe ka bobedi

line-segment-midpoint-offset-without-midpoint = midpointOffset ha e na tshusumetso ha ho se na ntlha ya bohareng

## `<line>`

line-points-undetermined-dimensions = Mola o feta dintlheng tse nang le bophara bo sa tsejweng.

line-points-too-few-dimensions = Mola o tshwanetse ho feta dintlheng tse nang le bophara bo bobedi bonyane.

line-points-depend-on-variables = Mola o feta dintlheng tse itshetlehileng ho diphetoho: { $variables }.

line-equation-invalid-format = Sebopeho ha se a nepahala bakeng sa equation ya mola ho diphetoho { $variable1 } le { $variable2 }.

## `<ray>`

ray-overprescribed-through = Lesedi le boletswe ka through, endpoint le direction ka bonngwe. through e boletsweng ha e nahanelwe.

ray-dimension-mismatch = numDimensions ha e tsamaellane ka hare ho lesedi.

## `<vector>`

vector-overprescribed-head = Vektoro e boletswe ka head, tail le displacement ka bonngwe. head e boletsweng ha e nahanelwe.

vector-dimension-mismatch = numDimensions ha e tsamaellane ka hare ho vektoro.

## Attracting and constraining

attract-to-without-nearest-point = Ha e kgone ho huelwa ho `<{ $component }>` hobane ha e na phetoho ya boemo nearestPoint.

constrain-to-without-nearest-point = Ha e kgone ho tlangwa ho `<{ $component }>` hobane ha e na phetoho ya boemo nearestPoint.

constrain-to-interior-without-nearest-point = Ha e kgone ho tlangwa ka hare ho `<{ $component }>` hobane ha e na phetoho ya boemo nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ha e nahanelwe ho choiceInput e seng ya mola o le mong

## Ordering children by index

choice-input-indices-count-mismatch = Disupo tse boletsweng bakeng sa choiceInput ha di nahanelwe hobane palo ya disupo ha e tsamaellane le palo ya bana ba choice.

pretzel-indices-count-mismatch = Disupo tse boletsweng bakeng sa problem ha di nahanelwe hobane palo ya disupo ha e tsamaellane le palo ya bana ba problem.

shuffle-indices-count-mismatch = Disupo tse boletsweng bakeng sa shuffle ha di nahanelwe hobane palo ya disupo ha e tsamaellane le palo ya dintho.

indices-ignored-out-of-range = Disupo tse boletsweng bakeng sa { $component } ha di nahanelwe hobane disupo tse ding di ka ntle ho sebaka.

pretzel-indices-repeated = Disupo tse boletsweng bakeng sa pretzel ha di nahanelwe hobane disupo tse ding di pheta-phetilwe.

pretzel-circuit-first-index = Disupo tse boletsweng bakeng sa pretzel mokgweng wa circuit ha di nahanelwe hobane sesupo sa pele se tshwanetse ho ba 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Hore `<{ $component }>` e sebetse le bana ba mofuta wa mongolo, tshobotsi `type` e tshwanetse ho boleloa.

invalid-type-defaulting-to-math = type { $type } ha e a nepahala bakeng sa ntho { $component }. E tshwanetse ho ba e nngwe ya math, text, number kapa boolean. E behwa math.

string-not-valid-component-to-arrange = Mongolo "{ $value }" ha se ntho ya { $component } e nepahetseng. Ha e nahanelwe.

## Types and variables

invalid-type-defaulting-to-number = type { $type } ha e a nepahala, type e behwa number.

invalid-variable-value = Boleng ba phetoho ha bo a nepahala: `{ $value }`

## Variants

variant-index-must-be-number = Sesupo sa mofuta { $index } se tshwanetse ho ba palo

variant-index-must-be-integer = Sesupo sa mofuta { $index } se tshwanetse ho ba palo e felletseng

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ha e a etswa ka ditekanyo tse tiileng. Bophara bo behwa ka dikarolo.

side-by-side-absolute-margins = `<{ $component }>` ha e a etswa ka ditekanyo tse tiileng. Meedi e behwa ka dikarolo.

side-by-side-no-block-child = `<{ $component }>` ha e a nepahala: e tshwanetse ho ba le ngwana a le mong bonyane wa mofuta wa bolokwe.

## `<label>`

label-for-ignored-on-graphical = Tshobotsi `for` ho `<label>` ya setshwantsho ha e nahanelwe.

label-for-must-resolve-to-one = Tshobotsi `for` ho `<label>` e tshwanetse ho supa ntho e le nngwe feela.

label-for-unresolved = Tshobotsi `for` ho `<label>` ha e a kgona ho supa ntho leha e le efe.

label-for-answer-with-authored-inputs = Tshobotsi `for` ho `<label>` e supa `<answer>` e nang le dikenyo tse ngotsweng; supa kenyo ka boyona.

label-for-answer-without-input = Tshobotsi `for` ho `<label>` e supa `<answer>` e se nang kenyo ya ho rehwa lebitso.

label-for-must-reference-input-or-answer = Tshobotsi `for` ho `<label>` e tshwanetse ho supa kenyo kapa karabo.

## Accessibility

accessibility-short-description-or-decorative = Bakeng sa phihlelelo, `<{ $component }>` e tshwanetse ho ba le tlhaloso e kgutshwane kapa e boleloe e le ya mokgabiso.

accessibility-video-short-description = Bakeng sa phihlelelo, `<video>` e tshwanetse ho ba le tlhaloso e kgutshwane.

accessibility-input-short-description-or-label = Bakeng sa phihlelelo, `<{ $component }>` e tshwanetse ho ba le tlhaloso e kgutshwane kapa lebitso.

accessibility-answer-input-short-description-or-label = Bakeng sa phihlelelo, `<answer>` e etsang kenyo e tshwanetse ho ba le tlhaloso e kgutshwane kapa lebitso.

accessibility-short-description-contains-math = Tlhaloso e kgutshwane ha ea lokela ho ba le dintho tsa dipalo jwaloka `<{ $component }>`. Hlalosa dipalo tsohle ka mantswe.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } e na le phapang e sa lekaneng bakeng sa mongolo wa sehlooho sa karolo (mokgwa o lefifi) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e hloka bonyane { $threshold }:1).
       *[other] { $colorName } e na le phapang e sa lekaneng bakeng sa mongolo wa sehlooho sa karolo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e hloka bonyane { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` e fetang dintlheng tse { $count } ha e eso etswe ha dintlha tseo di se na boleng ba dipalo.

circle-too-many-through-points = Ha e kgone ho bala sedikadikwe se fetang dintlheng tse fetang 3.

circle-overprescribed-radius-center-points = Ha e kgone ho bala sedikadikwe se nang le radiase, bohareng le dintlha tsa ho feta tsohle di boletswe.

circle-center-with-multiple-points = Ha e kgone ho bala sedikadikwe se nang le bohareng bo boletsweng se fetang dintlheng tse fetang 1.

circle-radius-too-small = Ha e kgone ho bala sedikadikwe: kaha sebaka pakeng tsa dintlha tse pedi ke { $distance }, radiase { $radius } e boletsweng e nyenyane haholo.

circle-radius-with-many-points = Ha e kgone ho etsa sedikadikwe se fetang dintlheng tse fetang tse pedi se nang le radiase e boletsweng.

circle-invalid-center-or-through-points = Bohareng ba sedikadikwe kapa dintlha tsa sona tsa ho feta ha di a nepahala.

circle-radius-center-with-multiple-points = Ha e kgone ho bala radiase ya sedikadikwe se nang le bohareng bo boletsweng se fetang dintlheng tse fetang 1.

circle-change-radius-non-numerical = Ha e kgone ho fetola radiase ya sedikadikwe se fetang dintlheng tse se nang boleng ba dipalo

circle-radius-with-points-non-numerical = Ha e kgone ho etsa sedikadikwe se fetang dintlheng tse fetang e le nngwe se nang le radiase e boletsweng ha ho se na boleng ba dipalo.

circle-change-center-non-numerical = Ho fetola bohareng ba sedikadikwe se fetang dintlheng tse se nang boleng ba dipalo ha ho eso etswe.

## `<function>`

function-domain-insufficient-dimensions = Bophara ba lebala la tshebetso ha bo lekane. Lebala le na le dikgeo tse { $intervals } empa tshebetso e na le dikenyo tse { $inputs }.

function-domain-invalid-format = Sebopeho sa lebala la tshebetso ha se a nepahala.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ntlha e phahameng ya tshebetso e seng ya dipalo ha e nahanelwe.
        [minimum] Ntlha e tlase ya tshebetso e seng ya dipalo ha e nahanelwe.
        [extremum] Ntlha ya pheletso ya tshebetso e seng ya dipalo ha e nahanelwe.
        [point] Ntlha ya tshebetso e seng ya dipalo ha e nahanelwe.
        [slope] Tshekamo ya tshebetso e seng ya dipalo ha e nahanelwe.
       *[other] { $type } ya tshebetso e seng ya dipalo ha e nahanelwe.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ntlha e phahameng ya tshebetso e se nang letho ha e nahanelwe.
        [minimum] Ntlha e tlase ya tshebetso e se nang letho ha e nahanelwe.
        [extremum] Ntlha ya pheletso ya tshebetso e se nang letho ha e nahanelwe.
        [point] Ntlha ya tshebetso e se nang letho ha e nahanelwe.
       *[other] { $type } ya tshebetso e se nang letho ha e nahanelwe.
    }

function-points-too-close = Tshebetso e na le dintlha tse pedi tse haufi haholo. Tshebetso ha e kgone ho hlaloswa.

function-iterates-input-output-mismatch = Ho pheta-pheta tshebetso ho kgonahala feela ha palo ya dikenyo e lekana le palo ya diphello. Tshebetso ena e na le dikenyo tse { $inputs } le diphello tse { $outputs }.

## `<sequence>`

sequence-invalid-length = Bolelele ba tatellano ha bo a nepahala. Bo tshwanetse ho ba palo e felletseng e seng ka tlase ho zero.

sequence-invalid-step = Mohato wa tatellano ha o a nepahala. Tatellanong ya mofuta { $type } o tshwanetse ho ba palo.

sequence-invalid-endpoint-number = "{ $attribute }" ya tatellano ya dipalo ha e a nepahala. E tshwanetse ho ba palo.

sequence-invalid-endpoint-letters = "{ $attribute }" ya tatellano ya ditlhaku ha e a nepahala. E tshwanetse ho ba ditlhaku.

sequence-invalid-endpoint = "{ $attribute }" ya tatellano ha e a nepahala.

select-from-sequence-coprime-not-numbers = coprime ha e nahanelwe hobane ha se dipalo tse kgethwang

select-from-sequence-coprime-with-exclude-combinations = coprime ha e nahanelwe hobane excludeCombinations e boletswe

## Resolving a `target`

target-not-found = target ha e a nepahala bakeng sa `<{ $source }>`: sepheo ha se a fumanwa.

target-state-variable-not-found = target ha e a nepahala bakeng sa `<{ $source }>`: phetoho ya boemo e nang le lebitso "{ $property }" ha e a fumanwa ho `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Diphetoho tsa `<odeSystem>` di tshwanetse ho fapana le phetoho e ikemetseng.

ode-system-duplicate-variable-names = Ha e kgone ho hlalosa ditshebetso tsa ODE RHS tse nang le mabitso a diphetoho a pheta-phetilweng.

ode-system-rhs-function-error = Ha e kgone ho hlalosa tshebetso ya ODE RHS. Phoso ha ho etswa tshebetso ya mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ha e kgone ho hlalosa kgutlo pakeng tsa mela e { $count }

angle-invalid-through-point = Ntlha ha e a nepahala ho through ya `<angle>`

parabola-vertex-too-many-points = Parabola e nang le ntlha e phahameng e fetang dintlheng tse fetang 1 ha e eso etswe.

parabola-too-many-points = Parabola e fetang dintlheng tse fetang 3 ha e eso etswe.

intersection-too-many-items = Kopano ya dintho tse fetang tse pedi ha e eso etswe

## Other math components

ionic-compound-not-two-ions = Motswako wa ione o fetang di-ione tse pedi ha o eso etswe.

ionic-compound-needs-cation-and-anion = Motswako wa ione o etseditswe cation e le nngwe le anion e le nngwe feela.

solve-equations-cannot-evaluate = Ha e kgone ho rarolla equation hobane equation ha e a kgona ho balwa: { $equation }

math-operators-operand-number-required = operandNumber e tshwanetse ho boleloa ha ho ntshuwa operand ya dipalo.

eigen-decomposition-failed = Ha e kgone ho bala boleng ba eigen ba matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: diparamethara { $parameters } ha di hlahe sebopehong, kahoo di tla tsamaellana le lefeela kamehla.

## `<graph>`

graph-grid-invalid = `<graph>`: ha e kgone ho hlalosa grid="{ $grid }". E tshwanetse ho ba none, medium, dense, kapa dipalo tse pedi tse ntle tse arotsweng ka sebaka, jwaloka grid="1 0.5". Ha ho grid e takwang.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ha e tshehetswe mmontshing wa prefigure; boitshwaro ba lehlakoreng le letona bo sebediswa.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ha e tshehetswe mmontshing wa prefigure; boitshwaro ba hodimo bo sebediswa.

prefigure-invalid-axis-bounds = `<graph>`: meedi ya axis ha e a nepahala bakeng sa phetoho ya prefigure; bbox (-10,-10,10,10) e sebediswa.

prefigure-invalid-width = `<graph>`: bophara ha bo a nepahala bakeng sa phetoho ya prefigure; bophara ba setshwantsho 425 bo sebediswa.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ha e a nepahala bakeng sa phetoho ya prefigure; tekanyo 1 e sebediswa.

prefigure-grid-spacing-too-fine = `<graph>`: dikgeo tsa grid di nyenyane haholo bakeng sa meedi ya axis; grid e siilwe mmontshing wa prefigure.

prefigure-annotations-not-rendered = `<graph>`: dintlha tsa tlatsetso di ke ke tsa bontshwa ha mmontshi wa PreFigure a sa sebediswe.

multiple-annotations-children = Bana ba bangata ba `<annotations>` ba fumanwe ho `<graph>`; bohle ha ba nahanelwe ntle le wa ho qetela.

## Referring to other components

copy-unrecognized-component-type = Ha e kgone ho atolosa kapa ho kopitsa mofuta wa ntho o sa tsejweng: { $type }.

copy-prop-not-found = Tshobotsi { $property } ha e a fumanwa nthong ya mofuta { $component }

collect-no-source = Ha ho mohlodi o fumanweng bakeng sa collect.

collect-invalid-component-type = Ha e kgone ho bokella dintho tsa mofuta `<{ $component }>` hobane ke mofuta wa ntho o sa nepahalang.

reference-index-unavailable = Ha e kgone ho supa sesupo `{ $reference }`

## `<callAction>`

component-action-unavailable = Ha e kgone ho bitsa { $action } nthong `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Sebopeho sa data ha se a nepahala. Mela e na le bolelele bo sa tsamaellaneng. E fumanwe ho componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data e na le mabitso a mela e emeng a pheta-phetilweng. E fumanwe ho componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data e haelloa ke lebitso la mola o emeng. E fumanwe ho componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award e le nngwe ya karabo ena e itshetlehile ka karabo e rometsweng ke tagi answer ka boyona, mme seo se tla baka boitshwaro bo sa lebellwang.

answer-max-num-attempts-in-section-wide-check-work = Ho beha `maxNumAttempts` ho `<answer>` e ka hare ho setshelo se nang le `sectionWideCheckWork` ha ho na tshusumetso, hobane setshelo seo ke sona se laolang palo ya diteko. Beha `maxNumAttempts` setshelong ka bosona.

nested-section-wide-check-work-max-num-attempts = Ho beha `maxNumAttempts` setshelong se nang le `sectionWideCheckWork` se ka hare ho setshelo se seng se nang le `sectionWideCheckWork` ha ho na tshusumetso, hobane setshelo sa ka ntle ke sona se laolang palo ya diteko. Beha `maxNumAttempts` setshelong sa ka ntle.

answer-attributes-need-symbolic-equality = Ditshobotsi { $attributes } di ke ke tsa ba le tshusumetso ha symbolicEquality e sa behwa.

answer-invalid-type = Mofuta ha o a nepahala bakeng sa karabo: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Kaha ntho `<{ $component }>` ha e na lebitso, e ke ke ya sebediswa e le tshobotsi ya module

module-attribute-name-already-defined = Ntho `<{ $component } name="{ $name }">` e ke ke ya sebediswa e le tshobotsi ya module hobane mofuta wa ntho `<module>` o se o na le tshobotsi e nang le lebitso "{ $name }".

conditional-content-condition-ignored = Tshobotsi `condition` ha e nahanelwe nthong `<conditionalContent>` e nang le bana ba case kapa else.

slider-markers-type-mismatch = Mofuta wa matshwao ha o tsamaellane le mofuta wa slider.

pretzel-problem-needs-statement-and-answer = pretzel ha e a nepahala: `<problem>` e nngwe le e nngwe e tshwanetse ho ba le `<statement>` e le nngwe le `<answer>` e le nngwe.

pretzel-circuit-first-problem-distractor = pretzel ha e a nepahala: ho mode="circuit", `<problem>` ya pele e ke ke ya ba ya ho kgelosa.

## Attribute values

attribute-invalid-values = Boleng { $values } ha bo a nepahala bakeng sa tshobotsi `{ $attribute }`; ha bo nahanelwe.

attribute-must-be-references = Boleng `{ $value }` ha bo a nepahala bakeng sa tshobotsi `{ $attribute }`. Tshobotsi e tshwanetse ho etswa ka disupo tse qalang ka `$`.

math-input-invalid-function-names = <mathInput>: mabitso a ditshebetso a sa nepahalang ho { $attribute } ha a nahanelwe: { $names }. Karolo e bontshwang ya lebitso le leng le le leng e tshwanetse ho ba le ditlhaku tse 2 bonyane (ditlhaku kapa mela); tlatsetso `|<mathspeak alternative>` e ka latela.

## Building components from the source

component-type-invalid = Mofuta wa ntho ha o a nepahala: `<{ $componentType }>`

attribute-repeated = Tshobotsi { $attribute } e ke ke ya pheta-phetwa.

attribute-invalid-for-component = Tshobotsi "{ $attribute }" ha e a nepahala bakeng sa ntho ya mofuta `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Tlhaloso ya setaele { $styleNumber } e na le phapang e sa lekaneng bakeng sa { $context ->
        [text-on-background] mmala wa mongolo kgahlano le mmala wa bokamorao
        [high-contrast] mmala wa phapang e phahameng kgahlano le lesela
        [line] mmala wa mola kgahlano le lesela
        [marker] mmala wa letshwao kgahlano le lesela
       *[text-on-canvas] mmala wa mongolo kgahlano le lesela
    }{ $mode ->
        [dark] { " (mokgwa o lefifi)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e hloka bonyane { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Le hoja tlhaloso ya setaele { $styleNumber } e boletse mebala e fanang ka phapang e lekaneng mokgweng o kganyang, mebala ya mokgwa o lefifi e tswang ho yona e na le phapang e sa lekaneng bakeng sa mmala wa mongolo kgahlano le mmala wa bokamorao ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e hloka bonyane { $threshold }:1). { $suggestion ->
        [available] Ho netefatsa phapang e lekaneng mokgweng o lefifi, eketsa phapang ya mokgwa o kganyang (mohlala beha { $lightAttribute }="{ $lightColor }") kapa fetola mmala wa mokgwa o lefifi (mohlala beha { $darkAttribute }="{ $darkColor }").
       *[none] Ho netefatsa phapang e lekaneng mokgweng o lefifi, eketsa phapang ya mokgwa o kganyang kapa fetola mebala e tswang ho yona ka textColorDarkMode le/kapa backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Le hoja tlhaloso ya setaele { $styleNumber } e boletse mmala wa mongolo o fanang ka phapang e lekaneng mokgweng o kganyang, mmala wa mongolo wa mokgwa o lefifi o tswang ho ona o na le phapang e sa lekaneng kgahlano le lesela ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e hloka bonyane { $threshold }:1). { $suggestion ->
        [available] Ho netefatsa phapang e lekaneng mokgweng o lefifi, eketsa phapang ya mokgwa o kganyang (mohlala beha textColor="{ $lightColor }") kapa fetola mmala wa mokgwa o lefifi (mohlala beha textColorDarkMode="{ $darkColor }").
       *[none] Ho netefatsa phapang e lekaneng mokgweng o lefifi, eketsa phapang ya mokgwa o kganyang kapa fetola mmala o tswang ho ona ka textColorDarkMode.
    }

section-multiple-style-palettes = Karolo e ka kgetha <stylePalette> e le nngwe feela; ya ho qetela e sebediswa.

## Unique variants

variant-num-to-select-not-non-negative-integer = ha e kgone ho hlalosa mefuta e ikgethang ya { $component } hobane numToSelect ha se palo e felletseng e seng ka tlase ho zero.

variant-num-to-select-not-constant-number = ha e kgone ho hlalosa mefuta e ikgethang ya { $component } hobane numToSelect ha se palo e sa fetoheng.

variant-with-replacement-not-constant-boolean = ha e kgone ho hlalosa mefuta e ikgethang ya { $component } hobane withReplacement ha se boolean e sa fetoheng.

variant-select-weight-disables-unique = Mefuta e ikgethang ya select e a tinywa ha ho na le kgetho e nang le selectWeight kapa selectForVariants e boletsweng

variant-coprime-undetermined = ha e kgone ho hlalosa mefuta e ikgethang ya { $component } hobane ha e kgone ho netefatsa hore coprime ke leshano kamehla.

variant-attribute-not-constant = ha e kgone ho hlalosa mefuta e ikgethang ya { $component } hobane { $attribute } ha e tsitsa.

variant-attribute-not-number = ha e kgone ho hlalosa mefuta e ikgethang ya { $component } hobane { $attribute } ha se palo.

variant-attribute-wrong-type-for-sequence =
    ha e kgone ho hlalosa mefuta e ikgethang ya { $component } ya mofuta { $type } hobane { $attribute } ha se { $expected ->
        [letters-combination] motswako wa ditlhaku
        [math-expression] polelo ya dipalo e nepahetseng
        [integer] palo e felletseng
       *[number] palo
    }.

variant-length-not-integer = ha e kgone ho hlalosa mefuta e ikgethang ya { $component } hobane length ha se palo e felletseng.

variant-sort-not-implemented = mefuta e ikgethang ya { $component } e nang le sort ha e eso etswe

variant-exclude-combinations-not-implemented = mefuta e ikgethang ya { $component } e nang le excludeCombinations ha e eso etswe

variant-math-exclude-not-implemented = mefuta e ikgethang ya { $component } ya mofuta math e nang le exclude ha e eso etswe

variant-non-constant-exclude-not-implemented = mefuta e ikgethang ya { $component } e nang le exclude e sa tsitsang ha e eso etswe

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ha e tshehetswe mmontshing wa graph prefigure; setloholo se tlolilwe.

prefigure-descendant-invalid-geometry = { $subject }: geometry e se nang moedi kapa e sa phethahalang; setloholo se tlolilwe.

prefigure-curve-label-omitted = { $subject }: mabitso ha a tshehetswe dinthong tsa kobeho tse fetotsweng; lebitso le siilwe.

prefigure-curve-unsupported-definition-type = { $subject }: mofuta wa tlhaloso ya tshebetso ya kobeho '{ $definitionType }' ha o tshehetswe; setloholo se tlolilwe.

prefigure-region-flip-functions-unsupported = { $subject }: tshobotsi flipFunctions ho regionBetweenCurves ha e tshehetswe; setloholo se tlolilwe.

prefigure-region-non-formula-child = { $subject }: ditshebetso tsa bana ba mofuta formula feela ke tse tshehetswang ho regionBetweenCurves; setloholo se tlolilwe.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ha e tshehetswe bakeng sa { $labelKind ->
        [line-family] lebitso la lelapa la mola
       *[point] lebitso la ntlha
    }; tlhophiso ya PreFigure e sebediswa.

prefigure-fill-style-unsupported = { $subject }: setaele sa ho tlatsa '{ $fillStyle }' ha se tshehetswe ke PreFigure; e khutlela ho tlatsa ka mmala o le mong.

prefigure-line-style-unknown = { $subject }: setaele sa mola '{ $lineStyle }' ha se tsejwe mme se siilwe diphellong tsa PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: setaele sa letshwao '{ $markerStyle }' se tsamaellanngwe le setaele sa PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: setaele sa letshwao '{ $markerStyle }' ha se tshehetswe ke PreFigure; setaele se teng ka tlwaelo se sebediswa.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ha e a nepahala; sepheo ha se kgone ho tsejwa. Ntlha ya tlatsetso e siilwe.

annotation-ref-multiple-targets = `<annotation>`: `ref` e boletse dipheo tse ngata; sepheo sa pele se sebediswa.

annotation-ref-outside-graph = `<annotation>`: `ref` ha e a nepahala; sepheo se ka ntle ho kerafo e se tshwereng. Ntlha ya tlatsetso e siilwe.

annotation-ref-unsupported-target = `<annotation>`: `ref` ha e a nepahala; sepheo ha se ntho ya setshwantsho e tshehetswang phetohong ya prefigure. Ntlha ya tlatsetso e siilwe.

annotation-text-missing = `<annotation>`: `text` ha e yo kapa ha e na letho; mongolo o se nang letho o ntshuwa.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Boitshetleho bo potolohang bo fumanwe.
       *[other] Boitshetleho bo potolohang bo amang ntho `<{ $componentType }>` bo fumanwe.
    }

reference-no-referent = Ha ho letho le fumanweng bakeng sa sesupo: `{ $reference }`

reference-multiple-referents = Dintho tse ngata di fumanwe bakeng sa sesupo: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Sebopeho ha se a nepahala bakeng sa tshobotsi { $attribute } ya `<{ $componentType }>`.

children-invalid = Bana ha ba a nepahala bakeng sa `<{ $componentType }>`: Bana ba sa nepahalang ba fumanwe: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Boleng `{ $value }` ha bo a nepahala bakeng sa tshobotsi `{ $attribute }`, boleng `{ $default }` bo sebediswa

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML mofuta { $version } ha o a fumanwa.
       *[other] DoenetML mofuta { $version } ha o a fumanwa. E khutlela mofuteng { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ha e a nepahala: { $content }

parse-tag-missing-close-tag = DoenetML ha e a nepahala: Tagi `{ $tag }` ha e na tagi ya ho koala. Ho ne ho lebelletswe tagi e ikwalang kapa tagi `</{ $tagName }>`.

parse-tag-error = DoenetML ha e a nepahala: Phoso tagi ya `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ha e a nepahala: Tshobotsi `{ $attribute }` e sa nepahalang e bonahala e haelloa ke boleng.

parse-attribute-invalid = DoenetML ha e a nepahala: Tshobotsi `{ $attribute }` ha e a nepahala

parse-attribute-value-invalid = DoenetML ha e a nepahala: Boleng ba tshobotsi `{ $value }` ha bo a nepahala

parse-attribute-value-quote-mismatch = DoenetML ha e a nepahala: Boleng ba tshobotsi `{ $value }` ha bo a nepahala. Matshwao a mantswe ha a tsamaellane. Ho bonahala `{ $quote }` e haellwa

parse-open-tag-name-missing = DoenetML ha e a nepahala: Ho fumanwe tagi e se nang lebitso, mohlala `<`

parse-tag-not-closed = DoenetML ha e a nepahala: Tagi `{ $tag }` ha e a kwalwa (ho bonahala `>` e haellwa).

parse-self-closing-tag-name-missing = DoenetML ha e a nepahala: Ho fumanwe tagi e se nang lebitso `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ha e a nepahala: Tagi `{ $tag }` ha e a kwalwa (ho bonahala `/>` e haellwa).

parse-tag-invalid-attributes = DoenetML ha e a nepahala: Tagi `{ $tag }` ha e a nepahala. Mohlomong e na le ditshobotsi tse sa nepahalang.

parse-close-tag-name-missing = DoenetML ha e a nepahala: Ho fumanwe tagi ya ho koala e se nang lebitso, mohlala `</`

parse-attribute-value-unquoted = Boleng ba ditshobotsi bo tshwanetse ho behwa ka hare ho matshwao a mantswe: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ha e a nepahala: Ho fumanwe tagi ya ho koala `{ $tag }`, empa ha ho na tagi ya ho bula e tsamaellanang

parse-close-tag-mismatched = DoenetML ha e a nepahala: Tagi ya ho koala ha e tsamaellane. Ho ne ho lebelletswe `</{ $expected }>`. Ho fumanwe `{ $found }`

parser-node-unconvertible = Ha ho a kgoneha ho fetola node { $node } ho ba node ya Dast.

## Names

name-attribute-invalid =
    Tshobotsi name='{ $name }' ha e a nepahala. { $reason ->
        [characters] Mabitso a ka ba le ditlhaku, dipalo, mela ya tlase kapa mela feela.
       *[start] Mabitso a tshwanetse ho qala ka tlhaku.
    }

component-name-invalid-start = Lebitso la ntho "{ $name }" ha le a nepahala. Mabitso a tshwanetse ho qala ka tlhaku.

## `<answer>` sugar

answer-video-watched-missing-video = Karabo ya mofuta videoWatched e tshwanetse ho ba le tshobotsi video

answer-video-watched-video-not-reference = Karabo ya mofuta videoWatched e tshwanetse ho ba le tshobotsi video e leng sesupo

answer-name-not-single-text = Tshobotsi name ya karabo e tshwanetse ho ba le ngwana a le mong feela wa text

## Referencing another document

external-doenetml-recursion-limit = Ha e kgone ho fumana DoenetML ya ka ntle ka lebaka la ho pheta-pheta ho hongata haholo. Na ho na le sesupo se potolohang?

external-doenetml-unavailable = Ha e kgone ho fumana DoenetML ho tswa ho { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML e fumanweng ho tswa ho { $attribute }="{ $uri }" ha e a nepahala: ha e tsamaellane le mofuta wa ntho "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Tshobotsi `{ $from }` e felletswe ke nako; sebedisa `{ $to }`.
       *[other] [deprecation] Tshobotsi `{ $from }` ho `<{ $component }>` e felletswe ke nako; sebedisa `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Tshobotsi `{ $from }` e felletswe ke nako mme ha e nahanelwe hobane `{ $to }` le yona e boletswe.
       *[other] [deprecation] Tshobotsi `{ $from }` ho `<{ $component }>` e felletswe ke nako mme ha e nahanelwe hobane `{ $to }` le yona e boletswe.
    }

deprecated-attribute-ignored = [deprecation] Tshobotsi `{ $attribute }` ho `<{ $component }>` e felletswe ke nako mme ha e nahanelwe.

deprecated-attribute-to-child = [deprecation] Tshobotsi `{ $attribute }` ho `<{ $component }>` e felletswe ke nako; sebedisa ngwana `<{ $child }>`.


## Language coverage

pluralize-english-only = `<pluralize>` e ka etsa bongata ka Senyesemane feela, kahoo mongolo wa yona o sala jwalokaha o le jwalo tokomaneng e ngotsweng ka { $locale }. Ngola sebopeho sa bongata ka bowena, kapa se behe tshobotsing `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ntho `<{ $tag }>` ha se ntho ya Doenet e tsejwang.

schema-element-not-allowed-at-root = Ntho `<{ $tag }>` ha e dumellwe motsong wa tokomane.

schema-element-not-allowed-inside = Ntho `<{ $tag }>` ha e dumellwe ka hare ho `<{ $parent }>`.

schema-attribute-unrecognized = Ntho `<{ $tag }>` ha e na tshobotsi e nang le lebitso `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Tshobotsi `{ $attribute }` ya ntho `<{ $tag }>` e tshwanetse ho ba lethathamo leo ntho e nngwe le e nngwe ho lona e leng e nngwe ya: { $allowed }
       *[other] Tshobotsi `{ $attribute }` ya ntho `<{ $tag }>` e tshwanetse ho ba e nngwe ya: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Lebitso la mofuta ha le a nepahala bakeng sa select. Lebitso la mofuta { $variantName } le hlaha dikgethong tse { $numOptions } empa palo ya ho kgetha ke { $numToSelect }.

select-variant-name-without-options = Mefuta e meng e boletswe bakeng sa select empa ha ho kgetho e boletsweng bakeng sa lebitso la mofuta le kgonahalang: { $variantName }.

select-variant-name-not-possible = Lebitso la mofuta { $variantName } le boletsweng bakeng sa select ha se lebitso la mofuta le kgonahalang.

select-too-few-options = Ha e kgone ho kgetha dintho tse { $numToSelect } ho tswa ho { $numOptions } feela.

select-from-sequence-too-few-values = Ha e kgone ho kgetha boleng bo { $numToSelect } tatellanong e nang le bolelele ba { $length }.

select-from-sequence-indices-count-mismatch = Palo ya disupo tse boletsweng bakeng sa select e tshwanetse ho tsamaellana le palo ya ho kgetha

select-from-sequence-indices-not-integers = Disupo tsohle tse boletsweng bakeng sa select di tshwanetse ho ba dipalo tse felletseng

select-from-sequence-index-excluded = Ho boletswe sesupo sa selectfromsequence se tlositsweng

select-from-sequence-indices-excluded-combination = Ho boletswe disupo tsa selectfromsequence tse neng di le motswako o tlositsweng

select-from-sequence-coprime-not-positive-integers = Ha e kgone ho kgetha metswako ya dipalo tse sa arolelaneng hobane ha se dipalo tse felletseng tse ka hodima zero tse kgethwang.

select-from-sequence-coprime-common-factor = Ha e kgone ho kgetha dipalo tse sa arolelaneng. Boleng bohle bo kgonahalang bo arolelana kgaolo e le nngwe. (Boleng bo boletsweng ba "from" kapa "to" bo tshwanetse ho se arolelane le "step".)

select-from-sequence-coprime-single-number = Ha e kgone ho kgetha metswako ya dipalo tse sa arolelaneng ho tswa palong e le nngwe e seng 1.

select-from-sequence-excluded-too-many-combinations = Ho feta 70% ya metswako e tlositswe ho selectFromSequence

select-from-sequence-coprime-none-found = Ha ho a kgoneha ho kgetha dipalo tse sa arolelaneng. Boleng bohle bo kgonahalang bo arolelana kgaolo e le nngwe.

select-from-sequence-too-few-unique-values = Ha e kgone ho kgetha boleng bo ikgethang bo { $numToSelect } tatellanong e nang le bolelele ba { $numPossibleValues }

select-prime-numbers-too-few-values = Ha e kgone ho kgetha boleng bo { $numToSelect } lethathamong la dipalo tsa prime le nang le bolelele ba { $numValues }

select-prime-numbers-values-count-mismatch = Palo ya boleng bo boletsweng bakeng sa select e tshwanetse ho tsamaellana le palo ya ho kgetha

select-prime-numbers-values-not-prime = Boleng bohle bo boletsweng bakeng sa select prime number bo tshwanetse ho ba lethathamong la dipalo tsa prime

select-prime-numbers-values-excluded-combination = Boleng ba selectPrimeNumbers bo boletsweng bo ne bo le motswako o tlositsweng

select-prime-numbers-excluded-too-many-combinations = Ho feta 70% ya metswako e tlositswe ho selectPrimeNumbers

select-random-combination-fluke = Ka tsela e sa tlwaelehang, ha ho a kgoneha ho kgetha motswako wa boleng bo sa reroang

select-random-value-fluke = Ka tsela e sa tlwaelehang, ha ho a kgoneha ho kgetha boleng bo sa reroang
