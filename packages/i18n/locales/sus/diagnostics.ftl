# Susu diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`
# and the rest — are part of the language rather than prose, and stay in
# English exactly as written. So does the `[deprecation]` marker.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } mu suxu xa tonbondiye firin dɔxɔ landi
       *[other] { $attributes } mu suxu xa tonbondiye firin dɔxɔ landi
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } mu suxu xa dɔxɔ tonbondi nun tema tonbondi bɛɛ landi
       *[other] { $attributes } mu suxu xa dɔxɔ tonbondi nun tema tonbondi bɛɛ landi
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset mu naxɛ fɛn na xa tema tonbondi mu a ra

## `<line>`

line-points-undetermined-dimensions = Sira tɛmɛ tonbondie ra naxee dɔxɔliyi mu loxi.

line-points-too-few-dimensions = Sira fata a xa tɛmɛ tonbondie ra naxee dɔxɔliyi ki findi firin waraxa a fari.

line-points-depend-on-variables = Sira tɛmɛ tonbondie ra naxee sɔxɔsɔxɔ mafalinxi fɛnnu ra: { $variables }.

line-equation-invalid-format = Sira lanma-lanma mu tonyi ra mafalinxi fɛn { $variable1 } nun { $variable2 } ra.

## `<ray>`

ray-overprescribed-through = Rayi landi through, endpoint nun direction ra. Mu suxu xa through landixi.

ray-dimension-mismatch = numDimensions mu tonyi ra rayi ra.

## `<vector>`

vector-overprescribed-head = Vektɔri landi head, tail nun displacement ra. Mu suxu xa head landixi.

vector-dimension-mismatch = numDimensions mu tonyi ra vektɔri ra.

## Attracting and constraining

attract-to-without-nearest-point = Mu fama noo `<{ $component }>` xun ma, bara nearestPoint taamasenyi mu a bara.

constrain-to-without-nearest-point = Mu a bali noo `<{ $component }>` xun ma, bara nearestPoint taamasenyi mu a bara.

constrain-to-interior-without-nearest-point = Mu a bali noo `<{ $component }>` konyi, bara nearestPoint taamasenyi mu a bara.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition mu suxu choiceInput ra naxan mu sira konyi.

## Ordering children by index

choice-input-indices-count-mismatch = Mu suxu xa indices landixi choiceInput ra bara indices yatɛ mu tonyi ra a dii yatɛ ma.

pretzel-indices-count-mismatch = Mu suxu xa indices landixi problem ra bara indices yatɛ mu tonyi ra a dii yatɛ ma.

shuffle-indices-count-mismatch = Mu suxu xa indices landixi shuffle ra bara indices yatɛ mu tonyi ra a fɛnnu yatɛ ma.

indices-ignored-out-of-range = Mu suxu xa indices landixi { $component } ra bara dɔɔ bota a naanewo ra.

pretzel-indices-repeated = Mu suxu xa indices landixi pretzel ra bara dɔɔ murunkidixi.

pretzel-circuit-first-index = Mu suxu xa indices landixi pretzel ra mode="circuit" konyi bara singe fata a ki findi 1 ra.

## `<shuffle>` and `<sort>`

string-children-need-type = Fo `<{ $component }>` ki tigi noo kumakan dii nde ra, `type` taamasenyi fata a landi.

invalid-type-defaulting-to-math = Siifa { $type } mu tonyi ra { $component } ra. A fata a ki findi math, text, number waraxa boolean ra. Mu murun na math ra.

string-not-valid-component-to-arrange = Kumakan "{ $value }" mu findi kore tonyi ra { $component } ra. Mu a suxu.

## Types and variables

invalid-type-defaulting-to-number = Siifa { $type } mu tonyi ra, mu siifa landi na number ra.

invalid-variable-value = Mafalinxi fɛn kanti mu tonyi ra: `{ $value }`

## Variants

variant-index-must-be-number = Siifa taamasenyi { $index } fata a ki findi kanti ra

variant-index-must-be-integer = Siifa taamasenyi { $index } fata a ki findi kanti timmatɛxi ra

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` mu dadaxi kanti bambaxi nde ra. Mu bandi landi na kanti ra.

side-by-side-absolute-margins = `<{ $component }>` mu dadaxi kanti bambaxi nde ra. Mu naanewo landi na kanti ra.

side-by-side-no-block-child = `<{ $component }>` mu tonyi ra: a fata dii kereni sɔtɔ.

## `<label>`

label-for-ignored-on-graphical = `for` taamasenyi mu suxu natanma `<label>` ra.

label-for-must-resolve-to-one = `for` taamasenyi `<label>` ra fata a ki kore kereni gbansan yitandi.

label-for-unresolved = `for` taamasenyi `<label>` ra mu kore yitandi noo.

label-for-answer-with-authored-inputs = `for` taamasenyi `<label>` ra ki `<answer>` yitandi naxan sɔtɔ dii nde ra safarilai fanma naxee safari; dii yitandi.

label-for-answer-without-input = `for` taamasenyi `<label>` ra ki `<answer>` yitandi naxan mu dii sɔtɔ a xili ki laa a ra.

label-for-must-reference-input-or-answer = `for` taamasenyi `<label>` ra fata dii waraxa yabi yitandi.

## Accessibility

accessibility-short-description-or-decorative = Futandiyi ma, `<{ $component }>` fata kotoyi surunyi sɔtɔ waraxa a landi ko rafexi fɛn ra.

accessibility-video-short-description = Futandiyi ma, `<video>` fata kotoyi surunyi sɔtɔ.

accessibility-input-short-description-or-label = Futandiyi ma, `<{ $component }>` fata kotoyi surunyi waraxa xili sɔtɔ.

accessibility-answer-input-short-description-or-label = Futandiyi ma, `<answer>` naxan ki dii dadaxi, wo fata kotoyi surunyi waraxa xili sɔtɔ.

accessibility-short-description-contains-math = Kotoyi surunyie nakan ki konti kore sɔtɔ ko `<{ $component }>`. Kontinu bɛɛ safari nun kumakane.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } mu findi tonyi ra a ki kaanan karan xun kumakan ma (diibo konyi) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ki { $threshold }:1 sɔtɔ).
       *[other] { $colorName } mu findi tonyi ra a ki kaanan karan xun kumakan ma ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ki { $threshold }:1 sɔtɔ).
    }

## `<circle>`

circle-through-points-non-numerical = Mu `<circle>` dadaxi singe naxan tɛmɛ tonbondi { $count } ra xa kanti mu tonbondie bara.

circle-too-many-through-points = Mu kurunyi konti noo naxan tɛmɛ tonbondi 3 ra ki tɛmɛn.

circle-overprescribed-radius-center-points = Mu kurunyi konti noo naxan sɔtɔ rayɔn, tema dulaa nun tonbondie bɛɛ.

circle-center-with-multiple-points = Mu kurunyi konti noo naxan sɔtɔ tema dulaa ki tɛmɛn tonbondi 1 ra.

circle-radius-too-small = Mu kurunyi konti noo: tonbondi firin tema mu { $distance }, rayɔn landixi { $radius } dɔgɔxi haaci.

circle-radius-with-many-points = Mu kurunyi dadaxi noo naxan tɛmɛ tonbondi firin ra ki tɛmɛn rayɔn landixi ra.

circle-invalid-center-or-through-points = Kurunyi tema dulaa waraxa a tonbondie mu tonyi ra.

circle-radius-center-with-multiple-points = Mu kurunyi rayɔn konti noo naxan sɔtɔ tema dulaa ki tɛmɛn tonbondi 1 ra.

circle-change-radius-non-numerical = Mu kurunyi rayɔn mafalin noo xa kanti mu a tonbondie bara

circle-radius-with-points-non-numerical = Mu kurunyi dadaxi noo naxan tɛmɛ tonbondi kereni ra ki tɛmɛn rayɔn landixi ra xa kanti mu a bara.

circle-change-center-non-numerical = Mu kurunyi tema dulaa mafalinxi dadaxi singe xa kanti mu a tonbondie bara.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dɔxɔliyi mu tɛmɛn fonksioni dulaa ma. Dulaa sɔtɔ sinsanyi { $intervals } bare fonksioni sɔtɔ { $inputs ->
            [one] dii { $inputs }
           *[other] dii { $inputs }
        }.
       *[other] Dɔxɔliyi mu tɛmɛn fonksioni dulaa ma. Dulaa sɔtɔ sinsanyi { $intervals } bare fonksioni sɔtɔ { $inputs ->
            [one] dii { $inputs }
           *[other] dii { $inputs }
        }.
    }

function-domain-invalid-format = Fonksioni dulaa lanma-lanma mu tonyi ra.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Mu suxu fonksioni fari-baa naxan mu kanti sɔtɔ.
        [minimum] Mu suxu fonksioni bun-baa naxan mu kanti sɔtɔ.
        [extremum] Mu suxu fonksioni nakusa naxan mu kanti sɔtɔ.
        [point] Mu suxu fonksioni tonbondi naxan mu kanti sɔtɔ.
        [slope] Mu suxu fonksioni xungenyi naxan mu kanti sɔtɔ.
       *[other] Mu suxu fonksioni { $type } naxan mu kanti sɔtɔ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Mu suxu fonksioni fari-baa gbansanxi.
        [minimum] Mu suxu fonksioni bun-baa gbansanxi.
        [extremum] Mu suxu fonksioni nakusa gbansanxi.
        [point] Mu suxu fonksioni tonbondi gbansanxi.
       *[other] Mu suxu fonksioni { $type } gbansanxi.
    }

function-points-too-close = Fonksioni sɔtɔ tonbondi firin naxee sunbaxi ki fɔlɔn haaci. Mu fonksioni konti noo.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Fonksioni murunkidi kelen fama noo xa dii yatɛ mu tonyi ra a bɔ yatɛ ma. Fonksioni gbe sɔtɔ dii { $inputs } nun { $outputs ->
            [one] bɔ { $outputs }
           *[other] bɔ { $outputs }
        }.
       *[other] Fonksioni murunkidi kelen fama noo xa dii yatɛ mu tonyi ra a bɔ yatɛ ma. Fonksioni gbe sɔtɔ dii { $inputs } nun { $outputs ->
            [one] bɔ { $outputs }
           *[other] bɔ { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Sinsanyi jamfa mu tonyi ra. A fata a ki findi kanti timmatɛxi ra naxan mu zero bun ma.

sequence-invalid-step = Sinsanyi simfa mu tonyi ra. A fata a ki findi kanti ra sinsanyi ra naxan siifa mu { $type } ra.

sequence-invalid-endpoint-number = Kanti sinsanyi "{ $attribute }" mu tonyi ra. A fata a ki findi kanti ra.

sequence-invalid-endpoint-letters = Safarindi sinsanyi "{ $attribute }" mu tonyi ra. A fata a ki findi safarindi rakelenxi ra.

sequence-invalid-endpoint = Sinsanyi "{ $attribute }" mu tonyi ra.

select-from-sequence-coprime-not-numbers = coprime mu suxu bara kantie mu tomboxi

select-from-sequence-coprime-with-exclude-combinations = coprime mu suxu bara excludeCombinations landixi

## Resolving a `target`

target-not-found = target mu tonyi ra `<{ $source }>` ra: mu target tofa.

target-state-variable-not-found = target mu tonyi ra `<{ $source }>` ra: mu taamasenyi tofa naxan xili mu "{ $property }" ra `<{ $component }>` ra.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` mafalinxi fɛnnu fata a ki fɔxɔn mafalinxi fɛn xasenxi ra.

ode-system-duplicate-variable-names = Mu suxu ODE RHS fonksioninu landi noo naxee mafalinxi fɛn xili murunkidixi.

ode-system-rhs-function-error = Mu suxu ODE RHS fonksioni landi noo. Fili mathjs fonksioni dadaliyi konyi.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Mu suxu tuun landi noo sirandie { $count } tema

angle-invalid-through-point = Tonbondi mu tonyi ra `<angle>` through konyi

parabola-vertex-too-many-points = Mu parabɔli dadaxi singe naxan sɔtɔ tuun ki tɛmɛn tonbondi 1 ra.

parabola-too-many-points = Mu parabɔli dadaxi singe naxan ki tɛmɛn tonbondi 3 ra.

intersection-too-many-items = Mu beno dadaxi singe fɛn firin xa ki tɛmɛn

## Other math components

ionic-compound-not-two-ions = Mu iyɔn rafexi dadaxi singe fɛn naxan mu findi iyɔn firin na.

ionic-compound-needs-cation-and-anion = Iyɔn rafexi dadaxi katiyɔn kereni nun aniyɔn kereni gbansan ma.

solve-equations-cannot-evaluate = Mu suxu lanma-lanma yabi noo bara a mu kanti noo: { $equation }

math-operators-operand-number-required = I fata operandNumber landi xa i ki konti operand bo na.

eigen-decomposition-failed = Mu matiriks eigenvalues konti noo

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametiri { $parameters } mu pattern konyi, a xa laa a xa fɔxɔn gbansanxi ra waxati bɛɛ.
       *[other] `<matchesPattern>`: parametirinu { $parameters } mu pattern konyi, a xa laa ide xa fɔxɔn gbansanxi ra waxati bɛɛ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: mu suxu grid="{ $grid }" fahamu noo. A fata a ki findi none, medium, dense, waraxa kanti nafexi firin naxee talaxi dulaa ra, ko grid="1 0.5". Girido mu dadaxi.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" mu bɛnbɛ prefigure yitandirilai konyi; mu tigi na ko bulubaa kore ra.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" mu bɛnbɛ prefigure yitandirilai konyi; mu tigi na ko fari kore ra.

prefigure-invalid-axis-bounds = `<graph>`: aksisi naanewo mu tonyi ra prefigure mafalinyi ra; mu tigi na bbox fɔlɔxi ra (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: bandi mu tonyi ra prefigure mafalinyi ra; mu tigi na natanma bandi fɔlɔxi ra 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio mu tonyi ra prefigure mafalinyi ra; mu tigi na kanti fɔlɔxi ra 1.

prefigure-grid-spacing-too-fine = `<graph>`: girido tema dɔgɔxi haaci aksisi naanewo ma; girido mu dadaxi prefigure yitandirilai konyi.

prefigure-annotations-not-rendered = `<graph>`: kotoyi mu dadaxi PreFigure yitandirilai mu tigi na tɛ.

multiple-annotations-children = `<annotations>` dii wuyaxi tofaxi `<graph>` konyi; bɛɛ mu suxu fo nakusa.

## Referring to other components

copy-unrecognized-component-type = Mu suxu kore siifa lafan noo waraxa a ki kopi naxan mu loxi: { $type }.

copy-prop-not-found = Mu prop { $property } tofa kore ra naxan siifa mu { $component } ra

collect-no-source = collect sulɔ mu tofa.

collect-invalid-component-type = Mu suxu korenu rakelen noo naxee siifa mu `<{ $component }>` ra bara a findi siifa mu tonyi ra.

reference-index-unavailable = Mu suxu taamasenyi `{ $reference }` yitandi noo

## `<callAction>`

component-action-unavailable = Mu suxu { $action } xili noo kore `{ $reference }` ma

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Kibarinu lanma-lanma mu tonyi ra. Sirandie jamfa mu tonyi ra ide tema. A tofaxi componentIdx :{ $componentIdx } konyi

data-frame-duplicate-column-names = Kibarinu sɔtɔ kolɔn xili murunkidixi. A tofaxi componentIdx :{ $componentIdx } konyi

data-frame-missing-column-name = Kolɔn xili mu kibarinu bara. A tofaxi componentIdx :{ $componentIdx } konyi

## `<answer>` and scoring

answer-award-depends-on-own-response = Yabi yi kerediti sɔxɔsɔxɔ a fanma yabi ra naxan rasaxi, wo ma, nun wo ki fɛn faxa naxan mu fata.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` landixi `<answer>` ra naxan mu kore konyi nun `sectionWideCheckWork` ra, wo mu fɛn tigi, bara kore fanma ki katu yatɛ mara. `maxNumAttempts` landi kore ma.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` landixi kore ma nun `sectionWideCheckWork` ra naxan mu kore doo konyi nun `sectionWideCheckWork` ra, wo mu fɛn tigi, bara banda kore fanma ki katu yatɛ mara. `maxNumAttempts` landi banda kore ma.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Taamasenyi { $attributes } mu fɛn tigi xa symbolicEquality mu landixi.
       *[other] Taamasenyie { $attributes } mu fɛn tigi xa symbolicEquality mu landixi.
    }

answer-invalid-type = Yabi siifa mu tonyi ra: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Bara xili mu kore `<{ $component }>` bara, a mu findi noo module taamasenyi ra

module-attribute-name-already-defined = Kore `<{ $component } name="{ $name }">` mu findi noo module taamasenyi ra bara `<module>` siifa sɔtɔ taamasenyi "{ $name }" xa fɔlɔ.

conditional-content-condition-ignored = `condition` taamasenyi mu suxu `<conditionalContent>` ra naxan sɔtɔ case waraxa else dii.

slider-markers-type-mismatch = Taamasenyie siifa mu tonyi ra slider siifa ma.

pretzel-problem-needs-statement-and-answer = pretzel mu tonyi ra: `<problem>`-wo-`<problem>` fata `<statement>` kereni nun `<answer>` kereni sɔtɔ.

pretzel-circuit-first-problem-distractor = pretzel mu tonyi ra: mode="circuit" konyi, `<problem>` singe mu findi noo distractor ra.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Kanti mu tonyi ra { $values } taamasenyi `{ $attribute }` ma; mu suxu.
       *[other] Kantinu mu tonyi ra { $values } taamasenyi `{ $attribute }` ma; mu ide suxu.
    }

attribute-must-be-references = Kanti `{ $value }` mu tonyi ra taamasenyi `{ $attribute }` ma. Taamasenyi fata a ki dadaxi yitandie ra naxee dati `$` ra.

math-input-invalid-function-names = <mathInput>: mu suxu fonksioni xili mu tonyi ra { $attribute } konyi: { $names }. Xili-wo-xili yitandi kore fata safarindi 2 sɔtɔ waraxa ki tɛmɛn wo ra (safarindie waraxa tirenu); i xa `|<mathspeak alternative>` lafan a ma.

## Building components from the source

component-type-invalid = Kore siifa mu tonyi ra: `<{ $componentType }>`

attribute-repeated = Mu suxu taamasenyi { $attribute } murunkidi noo.

attribute-invalid-for-component = Taamasenyi "{ $attribute }" mu tonyi ra kore ma naxan siifa mu `<{ $componentType }>` ra.

## Style definition contrast

style-definition-insufficient-contrast =
    Siifa { $styleNumber } kotoyi mu findi tonyi ra a ki kaanan { $context ->
        [text-on-background] kumakan kulɔri raxidi kulɔri ma
        [high-contrast] kaanan gbeenyi kulɔri walaa ma
        [line] sira kulɔri walaa ma
        [marker] taamasenyi kulɔri walaa ma
       *[text-on-canvas] kumakan kulɔri walaa ma
    } ma{ $mode ->
        [dark] { " (diibo konyi)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ki { $threshold }:1 sɔtɔ).

style-definition-dark-mode-text-background-contrast =
    Hali nun siifa { $styleNumber } kotoyi sɔtɔ kulɔrinu naxee kaanan di malɔɔ konyi, diibo kulɔrinu naxee bota a bara, kaanan mu ide kumakan kulɔri nun raxidi kulɔri tema ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ki { $threshold }:1 sɔtɔ). { $suggestion ->
        [available] Fo kaanan xa kaanan diibo konyi, malɔɔ kaanan lafan (misali ra, { $lightAttribute }="{ $lightColor }" landi) waraxa diibo kulɔri mafalin (misali ra, { $darkAttribute }="{ $darkColor }" landi).
       *[none] Fo kaanan xa kaanan diibo konyi, malɔɔ kaanan lafan waraxa kulɔri bɔxi mafalin nun textColorDarkMode waraxa backgroundColorDarkMode ra.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hali nun siifa { $styleNumber } kotoyi sɔtɔ kumakan kulɔri naxan ki kaanan di malɔɔ konyi, diibo kumakan kulɔri naxan bota a bara, kaanan mu a walaa ma ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ki { $threshold }:1 sɔtɔ). { $suggestion ->
        [available] Fo kaanan xa kaanan diibo konyi, malɔɔ kaanan lafan (misali ra, textColor="{ $lightColor }" landi) waraxa diibo kulɔri mafalin (misali ra, textColorDarkMode="{ $darkColor }" landi).
       *[none] Fo kaanan xa kaanan diibo konyi, malɔɔ kaanan lafan waraxa kulɔri bɔxi mafalin nun textColorDarkMode ra.
    }

section-multiple-style-palettes = Karan kore si <stylePalette> kereni gbansan tomboxi; mu tigi na nakusa ra.

## Unique variants

variant-num-to-select-not-non-negative-integer = mu suxu { $component } siifa fɛlɛnxi loxi noo bara numToSelect mu findi kanti timmatɛxi ra naxan mu zero bun ma.

variant-num-to-select-not-constant-number = mu suxu { $component } siifa fɛlɛnxi loxi noo bara numToSelect mu findi kanti ra naxan mu mafalin.

variant-with-replacement-not-constant-boolean = mu suxu { $component } siifa fɛlɛnxi loxi noo bara withReplacement mu findi boolean ra naxan mu mafalin.

variant-select-weight-disables-unique = select siifa fɛlɛnxi bali di tombonyi ra selectWeight waraxa selectForVariants sɔtɔ

variant-coprime-undetermined = mu suxu { $component } siifa fɛlɛnxi loxi noo bara mu a loxi noo ko coprime findi false ra waxati bɛɛ.

variant-attribute-not-constant = mu suxu { $component } siifa fɛlɛnxi loxi noo bara { $attribute } ki mafalin.

variant-attribute-not-number = mu suxu { $component } siifa fɛlɛnxi loxi noo bara { $attribute } mu findi kanti ra.

variant-attribute-wrong-type-for-sequence =
    mu suxu { $component } naxan siifa mu { $type } ra, a siifa fɛlɛnxi loxi noo bara { $attribute } mu findi { $expected ->
        [letters-combination] safarindi rakelenxi ra
        [math-expression] konti kumakan bɛnbɛxi ra
        [integer] kanti timmatɛxi ra
       *[number] kanti ra
    } ra.

variant-length-not-integer = mu suxu { $component } siifa fɛlɛnxi loxi noo bara length mu findi kanti timmatɛxi ra.

variant-sort-not-implemented = mu { $component } naxan sɔtɔ sort, a siifa fɛlɛnxi dadaxi singe

variant-exclude-combinations-not-implemented = mu { $component } naxan sɔtɔ excludeCombinations, a siifa fɛlɛnxi dadaxi singe

variant-math-exclude-not-implemented = mu { $component } naxan siifa mu math ra nun naxan sɔtɔ exclude, a siifa fɛlɛnxi dadaxi singe

variant-non-constant-exclude-not-implemented = mu { $component } naxan sɔtɔ exclude mafalinxi, a siifa fɛlɛnxi dadaxi singe

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: a mu bɛnbɛ graph prefigure yitandirilai konyi; nakusa tɛmɛn.

prefigure-descendant-invalid-geometry = { $subject }: dulaa lanma-lanma mu naanewo sɔtɔ waraxa a mu timma; nakusa tɛmɛn.

prefigure-curve-label-omitted = { $subject }: xilinu mu bɛnbɛ sira xungenxi mafalinxie ma; xili bota.

prefigure-curve-unsupported-definition-type = { $subject }: sira xungenxi kotoyi siifa '{ $definitionType }' mu bɛnbɛ; nakusa tɛmɛn.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions taamasenyi mu bɛnbɛ regionBetweenCurves ra; nakusa tɛmɛn.

prefigure-region-non-formula-child = { $subject }: dii fonksioninu gbansan naxee siifa mu formula ra, wonu bɛnbɛxi regionBetweenCurves ra; nakusa tɛmɛn.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' mu bɛnbɛ { $labelKind ->
        [line-family] sira gbee xili
       *[point] tonbondi xili
    } ma; mu tigi na PreFigure landi fɔlɔxi ra.

prefigure-fill-style-unsupported = { $subject }: rafenyi siifa '{ $fillStyle }' mu bɛnbɛ PreFigure ra; mu murun na rafenyi bambaxi ra.

prefigure-line-style-unknown = { $subject }: sira siifa mu loxi '{ $lineStyle }' bota PreFigure bɔxi ra.

prefigure-marker-style-mapped-to-diamond = { $subject }: taamasenyi siifa '{ $markerStyle }' mafalinxi ki findi PreFigure siifa 'diamond' ra.

prefigure-marker-style-unsupported = { $subject }: taamasenyi siifa '{ $markerStyle }' mu bɛnbɛ PreFigure ra; mu tigi na siifa fɔlɔxi ra.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` mu tonyi ra; mu a yitandixi tofa. Kotoyi bota.

annotation-ref-multiple-targets = `<annotation>`: `ref` ki fɛn wuyaxi yitandi; mu tigi na singe ra.

annotation-ref-outside-graph = `<annotation>`: `ref` mu tonyi ra; a yitandixi findi graph banda ra. Kotoyi bota.

annotation-ref-unsupported-target = `<annotation>`: `ref` mu tonyi ra; a yitandixi mu findi natanma fɛn ra naxan bɛnbɛxi prefigure mafalinyi konyi. Kotoyi bota.

annotation-text-missing = `<annotation>`: `text` mu a bara waraxa a gbansanxi; mu kumakan gbansanxi bota.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Mu sɔxɔsɔxɔ tofa naxan murunkidi-murunkidi.
       *[other] Mu sɔxɔsɔxɔ tofa naxan murunkidi-murunkidi nun kore `<{ $componentType }>` ra.
    }

reference-no-referent = Fɛn mu tofa yitandiyi ra: `{ $reference }`

reference-multiple-referents = Fɛn wuyaxi tofaxi yitandiyi ra: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` taamasenyi { $attribute } lanma-lanma mu tonyi ra.

children-invalid = `<{ $componentType }>` dii mu tonyi ra: Mu dii mu tonyi ra tofa: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Kanti `{ $value }` mu tonyi ra taamasenyi `{ $attribute }` ma, mu tigi na kanti `{ $default }` ra

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML siifa { $version } mu tofa.
       *[other] DoenetML siifa { $version } mu tofa. Mu murun na siifa { $fallback } ra
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML mu tonyi ra: { $content }

parse-tag-missing-close-tag = DoenetML mu tonyi ra: Tagi `{ $tag }` mu soxo tagi sɔtɔ. Mu bata tagi ma naxan a fanma soxo waraxa tagi `</{ $tagName }>`.

parse-tag-error = DoenetML mu tonyi ra: Fili tagi `<{ $tagName }>` konyi

parse-attribute-missing-value = DoenetML mu tonyi ra: Taamasenyi mu tonyi ra `{ $attribute }` ki munta ko kanti mu a bara.

parse-attribute-invalid = DoenetML mu tonyi ra: Taamasenyi `{ $attribute }` mu tonyi ra

parse-attribute-value-invalid = DoenetML mu tonyi ra: Taamasenyi kanti `{ $value }` mu tonyi ra

parse-attribute-value-quote-mismatch = DoenetML mu tonyi ra: Taamasenyi kanti `{ $value }` mu tonyi ra. Kumakan taamasenyie mu tonyi ra. A ki munta ko `{ $quote }` mu i bara

parse-open-tag-name-missing = DoenetML mu tonyi ra: Mu tagi tofa naxan mu xili sɔtɔ, ko `<`

parse-tag-not-closed = DoenetML mu tonyi ra: Tagi `{ $tag }` mu soxo (a ki munta ko `>` mu a bara).

parse-self-closing-tag-name-missing = DoenetML mu tonyi ra: Mu tagi tofa naxan mu xili sɔtɔ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML mu tonyi ra: Tagi `{ $tag }` mu soxo (a ki munta ko `/>` mu a bara).

parse-tag-invalid-attributes = DoenetML mu tonyi ra: Tagi `{ $tag }` mu tonyi ra. A si taamasenyi mu tonyi ra sɔtɔ noo.

parse-close-tag-name-missing = DoenetML mu tonyi ra: Mu soxo tagi tofa naxan mu xili sɔtɔ, ko `</`

parse-attribute-value-unquoted = Taamasenyi kantinu fata a ki landi kumakan taamasenyie tema: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML mu tonyi ra: Mu soxo tagi `{ $tag }` tofa, bare raba tagi bɛnxi mu a bara

parse-close-tag-mismatched = DoenetML mu tonyi ra: Soxo tagi mu tonyi ra. Mu bata `</{ $expected }>` ma. Mu `{ $found }` tofa

parser-node-unconvertible = Mu node { $node } mafalin noo ki findi Dast node ra.

## Names

name-attribute-invalid =
    Xili name='{ $name }' mu tonyi ra. { $reason ->
        [characters] Xilinu si safarindie, kantinu, bun tirenu waraxa tirenu gbansan sɔtɔ noo.
       *[start] Xilinu fata a ki dati safarindi ra.
    }

component-name-invalid-start = Kore xili "{ $name }" mu tonyi ra. Xilinu fata a ki dati safarindi ra.

## `<answer>` sugar

answer-video-watched-missing-video = Yabi naxan siifa mu videoWatched ra, wo fata video taamasenyi sɔtɔ

answer-video-watched-video-not-reference = Yabi naxan siifa mu videoWatched ra, wo fata video taamasenyi sɔtɔ naxan findi yitandiyi ra

answer-name-not-single-text = Yabi name taamasenyi fata kumakan dii kereni sɔtɔ

## Referencing another document

external-doenetml-recursion-limit = Mu banda DoenetML sɔtɔ noo bara murunkidiyi ki siya haaci. Fo yitandiyi doo be murunkidi na?

external-doenetml-unavailable = Mu DoenetML sɔtɔ noo { $attribute }="{ $uri }" ma

external-doenetml-type-mismatch = DoenetML naxan sɔtɔxi { $attribute }="{ $uri }" ma, wo mu tonyi ra: a mu tonyi ra kore siifa "{ $componentType }" ma

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Taamasenyi `{ $from }` mu tigi na kotenke; `{ $to }` taa.
       *[other] [deprecation] Taamasenyi `{ $from }` `<{ $component }>` ra mu tigi na kotenke; `{ $to }` taa.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Taamasenyi `{ $from }` mu tigi na kotenke nun a mu suxu bara `{ $to }` fana landixi.
       *[other] [deprecation] Taamasenyi `{ $from }` `<{ $component }>` ra mu tigi na kotenke nun a mu suxu bara `{ $to }` fana landixi.
    }

deprecated-attribute-ignored = [deprecation] Taamasenyi `{ $attribute }` `<{ $component }>` ra mu tigi na kotenke nun a mu suxu.

deprecated-attribute-to-child = [deprecation] Taamasenyi `{ $attribute }` `<{ $component }>` ra mu tigi na kotenke; dii `<{ $child }>` taa.

deprecated-attribute-value-renamed = [deprecation] Taamasenyi `{ $attribute }` kanti `{ $value }` `<{ $component }>` ra mu tigi na kotenke; `{ $to }` taa.


## Language coverage

pluralize-english-only = `<pluralize>` si siyaxi ki noo Angilekan gbansan na, wo xa a kumakane ki to ko safarilai ki ide safari cogo min kitabuyi konyi naxan safarixi { $locale } ra. Siyaxi safari i fanma, waraxa a landi nun `pluralForm` taamasenyi ra.


## Checking against the schema

schema-element-unrecognized = Kore `<{ $tag }>` mu findi Doenet kore loxi ra.

schema-element-not-allowed-at-root = Kore `<{ $tag }>` mu bɛnbɛ kitabuyi sulɔ ma.

schema-element-not-allowed-inside = Kore `<{ $tag }>` mu bɛnbɛ `<{ $parent }>` konyi.

schema-attribute-unrecognized = Taamasenyi naxan xili mu `{ $attribute }` ra, wo mu kore `<{ $tag }>` bara.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Kore `<{ $tag }>` taamasenyi `{ $attribute }` fata a ki findi sinsanyi ra naxan fɛn-wo-fɛn findi kereni ra ide konyi: { $allowed }
       *[other] Kore `<{ $tag }>` taamasenyi `{ $attribute }` fata a ki findi kereni ra ide konyi: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select siifa xili mu tonyi ra. Siifa xili { $variantName } findi tombonyi { $numOptions } konyi bare tombonyi yatɛ mu { $numToSelect } ra.

select-variant-name-without-options = Siifa dɔɔ landixi select ra bare tombonyi mu landixi siifa xili ma naxan si findi: { $variantName }.

select-variant-name-not-possible = Siifa xili { $variantName } naxan landixi select ra, wo mu findi siifa xili ra naxan si findi.

select-too-few-options = Mu suxu kore { $numToSelect } tomboŋ noo kore { $numOptions } gbansan konyi.

select-from-sequence-too-few-values = Mu suxu kanti { $numToSelect } tombo noo sinsanyi konyi naxan jamfa mu { $length } ra.

select-from-sequence-indices-count-mismatch = Indices yatɛ naxan landixi select ra, wo fata a ki tonyi tombonyi yatɛ ma

select-from-sequence-indices-not-integers = Indices bɛɛ naxee landixi select ra, wonu fata a ki findi kanti timmatɛxi ra

select-from-sequence-index-excluded = selectfromsequence taamasenyi landixi tarata bota

select-from-sequence-indices-excluded-combination = selectfromsequence indices landixinu tarata ki findi rakelenxi bota ra

select-from-sequence-coprime-not-positive-integers = Mu suxu coprime rakelenxie tombo noo bara kanti nafexi timmatɛxie mu tomboxi.

select-from-sequence-coprime-common-factor = Mu suxu coprime kantinu tombo noo. Kanti bɛɛ naxee si findi, faktɛr kereni nan ide bɛɛ bara. ("from" waraxa "to" kanti landixinu fata a ki findi coprime ra "step" xa.)

select-from-sequence-coprime-single-number = Mu suxu coprime rakelenxie tombo noo kanti kereni konyi naxan mu findi 1 ra.

select-from-sequence-excluded-too-many-combinations = Rakelenxi 70% ki tɛmɛn wo ra bota selectFromSequence konyi

select-from-sequence-coprime-none-found = Mu coprime kantinu tombo noo. Kanti bɛɛ naxee si findi, faktɛr kereni nan ide bɛɛ bara.

select-from-sequence-too-few-unique-values = Mu suxu kanti fɛlɛnxi { $numToSelect } tombo noo sinsanyi konyi naxan jamfa mu { $numPossibleValues } ra

select-prime-numbers-too-few-values = Mu suxu kanti { $numToSelect } tombo noo prime kanti sinsanyi konyi naxan jamfa mu { $numValues } ra

select-prime-numbers-values-count-mismatch = Kanti yatɛ naxan landixi select ra, wo fata a ki tonyi tombonyi yatɛ ma

select-prime-numbers-values-not-prime = Kanti bɛɛ naxee landixi select prime number ra, wonu fata a ki findi prime kanti sinsanyi konyi

select-prime-numbers-values-excluded-combination = selectPrimeNumbers kanti landixinu tarata ki findi rakelenxi bota ra

select-prime-numbers-excluded-too-many-combinations = Rakelenxi 70% ki tɛmɛn wo ra bota selectPrimeNumbers konyi

select-random-combination-fluke = Fɛn naxan mu si findi noo muk, wo xa mu kanti gbansan rakelenxi tombo noo

select-random-value-fluke = Fɛn naxan mu si findi noo muk, wo xa mu kanti gbansanxi tombo noo
