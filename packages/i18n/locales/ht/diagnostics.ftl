# Haitian Creole diagnostics. Translated from `locales/en/diagnostics.ftl`,
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
# Creole has no plural suffix, so a counted message whose only difference in
# English is the noun's number renders one string here and the select is
# dropped. Where the verb or the surrounding sentence differs — «li inyore»
# against «yo inyore» — the select stays, because that difference is real.
#
# Creole punctuates as English does: no space before `:`, `;`, `?` or `!`.


## `<lineSegment>`

# No select: «yo inyore» is the impersonal, which does not agree with what is
# ignored, and the list itself carries no number. One string covers both English
# categories. The count still arrives.
line-segment-attributes-ignored-with-endpoints = yo inyore { $attributes } lè de bout yo espesifye

line-segment-attributes-ignored-with-endpoint-and-midpoint = yo inyore { $attributes } lè yon bout ak yon mitan tou de espesifye

line-segment-midpoint-offset-without-midpoint = midpointOffset pa gen efè san yon mitan

## `<line>`

line-points-undetermined-dimensions = Liy ki pase nan pwen ki gen dimansyon yo pa detèmine.

line-points-too-few-dimensions = Liy lan dwe pase nan pwen ki gen omwen de dimansyon.

line-points-depend-on-variables = Liy lan pase nan pwen ki depann de varyab: { $variables }.

line-equation-invalid-format = Fòma ki pa valab pou ekwasyon liy nan varyab { $variable1 } ak { $variable2 }.

## `<ray>`

ray-overprescribed-through = Demi-dwat lan preskri pa through, endpoint ak direction.  Y ap inyore through ki espesifye a.

ray-dimension-mismatch = numDimensions pa koresponn nan demi-dwat lan.

## `<vector>`

vector-overprescribed-head = Vektè a preskri pa head, tail ak displacement.  Y ap inyore head ki espesifye a.

vector-dimension-mismatch = numDimensions pa koresponn nan vektè a.

## Attracting and constraining

attract-to-without-nearest-point = Pa ka atire sou yon `<{ $component }>` paske li pa gen yon varyab deta nearestPoint.

constrain-to-without-nearest-point = Pa ka kontrenn sou yon `<{ $component }>` paske li pa gen yon varyab deta nearestPoint.

constrain-to-interior-without-nearest-point = Pa ka kontrenn nan enteryè yon `<{ $component }>` paske li pa gen yon varyab deta nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = yo inyore labelPosition pou yon choiceInput ki pa inline

## Ordering children by index

choice-input-indices-count-mismatch = Y ap inyore indices ki espesifye pou choiceInput paske kantite endis pa koresponn ak kantite pitit choice.

pretzel-indices-count-mismatch = Y ap inyore indices ki espesifye pou problem paske kantite endis pa koresponn ak kantite pitit problem.

shuffle-indices-count-mismatch = Y ap inyore indices ki espesifye pou shuffle paske kantite endis pa koresponn ak kantite konpozan.

indices-ignored-out-of-range = Y ap inyore indices ki espesifye pou { $component } paske kèk endis deyò limit.

pretzel-indices-repeated = Y ap inyore indices ki espesifye pou pretzel paske kèk endis repete.

pretzel-circuit-first-index = Y ap inyore indices ki espesifye pou pretzel nan mòd circuit paske premye endis lan dwe se 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pou `<{ $component }>` mache ak pitit ki se chèn karaktè, ou dwe espesifye yon atribi `type`.

invalid-type-defaulting-to-math = Tip { $type } pa valab pou konpozan { $component }. Li dwe se youn nan math, text, number oswa boolean. Y ap pran math.

string-not-valid-component-to-arrange = Chèn "{ $value }" pa yon konpozan valab pou { $component }. Y ap inyore l.

## Types and variables

invalid-type-defaulting-to-number = Tip { $type } pa valab, y ap mete tip lan sou number.

invalid-variable-value = Valè yon varyab ki pa valab: `{ $value }`

## Variants

variant-index-must-be-number = Endis varyant { $index } dwe se yon nonm

variant-index-must-be-integer = Endis varyant { $index } dwe se yon antye

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` pa aplike pou mezi absoli. Y ap mete lajè yo relatif.

side-by-side-absolute-margins = `<{ $component }>` pa aplike pou mezi absoli. Y ap mete maj yo relatif.

side-by-side-no-block-child = `<{ $component }>` pa valab: li dwe gen omwen yon pitit blòk.

## `<label>`

label-for-ignored-on-graphical = Yo inyore atribi `for` sou yon `<label>` grafik.

label-for-must-resolve-to-one = Atribi `for` sou `<label>` dwe rezoud sou yon sèl konpozan.

label-for-unresolved = Atribi `for` sou `<label>` pa t kapab rezoud sou yon konpozan.

label-for-answer-with-authored-inputs = Atribi `for` sou `<label>` refere a yon `<answer>` ki gen antre otè a te ekri limenm; refere a antre a dirèkteman.

label-for-answer-without-input = Atribi `for` sou `<label>` refere a yon `<answer>` ki pa gen antre pou etikte.

label-for-must-reference-input-or-answer = Atribi `for` sou `<label>` dwe refere a yon antre oswa a yon repons.

## Accessibility

accessibility-short-description-or-decorative = Pou aksesibilite, `<{ $component }>` dwe gen yon deskripsyon kout oswa dwe espesifye kòm dekoratif.

accessibility-video-short-description = Pou aksesibilite, `<video>` dwe gen yon deskripsyon kout.

accessibility-input-short-description-or-label = Pou aksesibilite, `<{ $component }>` dwe gen yon deskripsyon kout oswa yon etikèt.

accessibility-answer-input-short-description-or-label = Pou aksesibilite, yon `<answer>` k ap kreye yon antre dwe gen yon deskripsyon kout oswa yon etikèt.

accessibility-short-description-contains-math = Deskripsyon kout pa ta dwe gen konpozan matematik tankou `<{ $component }>` ladan yo. Eple nenpòt matematik ak mo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } pa gen ase kontras pou tèks tit seksyon an (mòd fènwa) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; li mande omwen { $threshold }:1).
       *[other] { $colorName } pa gen ase kontras pou tèks tit seksyon an ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; li mande omwen { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Yo poko aplike `<circle>` ki pase nan { $count } pwen nan ka kote pwen yo pa gen valè nimerik.

circle-too-many-through-points = Pa ka kalkile yon sèk ki pase nan plis pase 3 pwen.

circle-overprescribed-radius-center-points = Pa ka kalkile yon sèk ki gen reyon, sant ak pwen espesifye ansanm.

circle-center-with-multiple-points = Pa ka kalkile yon sèk ki gen yon sant espesifye epi ki pase nan plis pase 1 pwen.

circle-radius-too-small = Pa ka kalkile sèk lan: piske distans ant de pwen yo se { $distance }, reyon { $radius } ki espesifye a twò piti.

circle-radius-with-many-points = Pa ka kreye yon sèk ki pase nan plis pase de pwen ak yon reyon espesifye.

circle-invalid-center-or-through-points = Sant oswa pwen sèk lan pa valab.

circle-radius-center-with-multiple-points = Pa ka kalkile reyon yon sèk ki gen yon sant espesifye epi ki pase nan plis pase 1 pwen.

circle-change-radius-non-numerical = Pa ka chanje reyon yon sèk ki pase nan pwen ki pa nimerik

circle-radius-with-points-non-numerical = Pa ka kreye yon sèk ki pase nan plis pase yon pwen ak yon reyon espesifye lè valè nimerik yo pa la.

circle-change-center-non-numerical = Yo poko aplike chanjman sant yon sèk ki pase nan pwen ki pa gen valè nimerik.

## `<function>`

# English's two counts multiply out to four sentences; Creole has one, because
# «entèval» and «antre» are invariant. Both selects are dropped and both counts
# still arrive and are still formatted.
function-domain-insufficient-dimensions = Dimansyon domèn fonksyon an pa ase. Domèn lan gen { $intervals } entèval men fonksyon an gen { $inputs } antre.

function-domain-invalid-format = Fòma domèn fonksyon an pa valab.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Y ap inyore maksimòm fonksyon an ki pa nimerik.
        [minimum] Y ap inyore minimòm fonksyon an ki pa nimerik.
        [extremum] Y ap inyore ekstremòm fonksyon an ki pa nimerik.
        [point] Y ap inyore pwen fonksyon an ki pa nimerik.
        [slope] Y ap inyore pant fonksyon an ki pa nimerik.
       *[other] Y ap inyore { $type } fonksyon an ki pa nimerik.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Y ap inyore maksimòm fonksyon an ki vid.
        [minimum] Y ap inyore minimòm fonksyon an ki vid.
        [extremum] Y ap inyore ekstremòm fonksyon an ki vid.
        [point] Y ap inyore pwen fonksyon an ki vid.
       *[other] Y ap inyore { $type } fonksyon an ki vid.
    }

function-points-too-close = Fonksyon an gen de pwen ki twò pre youn lòt. Pa ka defini fonksyon an.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Iterasyon fonksyon posib sèlman si kantite antre fonksyon an egal kantite sòti li. Fonksyon sa a gen { $inputs } antre ak { $outputs } sòti.

## `<sequence>`

sequence-invalid-length = Longè sekans lan pa valab.  Li dwe se yon antye ki pa negatif.

sequence-invalid-step = Pa sekans lan pa valab.  Li dwe se yon nonm pou yon sekans tip { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" pa valab pou yon sekans nonm.  Li dwe se yon nonm.

sequence-invalid-endpoint-letters = "{ $attribute }" pa valab pou yon sekans lèt.  Li dwe se yon konbinezon lèt.

sequence-invalid-endpoint = "{ $attribute }" pa valab pou sekans lan.

select-from-sequence-coprime-not-numbers = yo inyore coprime paske se pa nonm y ap chwazi

select-from-sequence-coprime-with-exclude-combinations = yo inyore coprime paske excludeCombinations espesifye

## Resolving a `target`

target-not-found = target pa valab pou `<{ $source }>`: pa ka jwenn target lan.

target-state-variable-not-found = target pa valab pou `<{ $source }>`: pa ka jwenn yon varyab deta ki rele "{ $property }" sou yon `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Varyab `<odeSystem>` yo dwe diferan de varyab endepandan an.

ode-system-duplicate-variable-names = Pa ka defini fonksyon RHS ODE ak non varyab depandan ki repete.

ode-system-rhs-function-error = Pa ka defini fonksyon RHS ODE.  Erè nan kreye fonksyon mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Pa ka defini yon ang ant { $count } liy

angle-invalid-through-point = Pwen ki pa valab nan through yon `<angle>`

parabola-vertex-too-many-points = Yo poko aplike yon parabòl ki gen yon somè epi ki pase nan plis pase 1 pwen.

parabola-too-many-points = Yo poko aplike yon parabòl ki pase nan plis pase 3 pwen.

intersection-too-many-items = Yo poko aplike entèseksyon pou plis pase de eleman

## Other math components

ionic-compound-not-two-ions = Yo poko aplike konpoze yonik pou lòt bagay pase de yon.

ionic-compound-needs-cation-and-anion = Konpoze yonik aplike sèlman pou yon katyon ak yon anyon.

solve-equations-cannot-evaluate = Pa ka rezoud ekwasyon an paske yo pa t kapab evalye l: { $equation }

math-operators-operand-number-required = Ou dwe espesifye yon operandNumber lè w ap ekstrè yon operand matematik.

eigen-decomposition-failed = Yo pa t kapab kalkile valè pwòp matris lan

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: paramèt { $parameters } pa parèt nan modèl lan, kidonk li ap toujou koresponn ak yon blan.
       *[other] `<matchesPattern>`: paramèt { $parameters } pa parèt nan modèl lan, kidonk yo ap toujou koresponn ak yon blan.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: pa ka entèprete grid="{ $grid }". Li dwe se none, medium, dense, oswa de nonm pozitif separe pa yon espas, tankou grid="1 0.5". Yo pa desine okenn kadriyaj.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" pa sipòte nan randè prefigure a; y ap sèvi ak konpòtman pozisyon dwat lan.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" pa sipòte nan randè prefigure a; y ap sèvi ak konpòtman pozisyon anwo a.

prefigure-invalid-axis-bounds = `<graph>`: limit aks yo pa valab pou konvèsyon prefigure; y ap sèvi ak bbox pa defo (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lajè a pa valab pou konvèsyon prefigure; y ap sèvi ak lajè dyagram pa defo 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio pa valab pou konvèsyon prefigure; y ap sèvi ak rapò aspè pa defo 1.

prefigure-grid-spacing-too-fine = `<graph>`: espasman kadriyaj lan twò fen pou limit aks yo; yo kite kadriyaj lan deyò nan randè prefigure a.

prefigure-annotations-not-rendered = `<graph>`: yo pa p rann anotasyon lè yo pa sèvi ak randè PreFigure a.

multiple-annotations-children = Yo jwenn plizyè pitit `<annotations>` nan `<graph>`; yo inyore tout eksepte dènye a.

## Referring to other components

copy-unrecognized-component-type = Pa ka pwolonje oswa kopye yon tip konpozan yo pa rekonèt: { $type }.

copy-prop-not-found = Yo pa t kapab jwenn prop { $property } sou yon konpozan tip { $component }

collect-no-source = Yo pa jwenn okenn sous pou collect.

collect-invalid-component-type = Pa ka kolekte konpozan tip `<{ $component }>` paske se yon tip konpozan ki pa valab.

reference-index-unavailable = Pa ka refere a endis `{ $reference }`

## `<callAction>`

component-action-unavailable = Pa ka rele { $action } sou konpozan `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Done yo gen yon fòm ki pa valab.  Ranje yo gen longè ki pa konsistan. Jwenn nan componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Done yo gen non kolòn ki repete.  Jwenn nan componentIdx :{ $componentIdx }

data-frame-missing-column-name = Done yo manke yon non kolòn.  Jwenn nan componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Yon award pou repons sa a baze sou repons tag repons lan limenm te voye, sa ap mennen nan konpòtman ou pa t atann.

answer-max-num-attempts-in-section-wide-check-work = Mete `maxNumAttempts` sou yon `<answer>` andedan yon kontenè ki gen `sectionWideCheckWork` pa gen efè, paske kontenè a kontwole kantite esè. Mete `maxNumAttempts` sou kontenè a pito.

nested-section-wide-check-work-max-num-attempts = Mete `maxNumAttempts` sou yon kontenè ki gen `sectionWideCheckWork` epi ki andedan yon lòt kontenè ki gen `sectionWideCheckWork` pa gen efè, paske kontenè deyò a kontwole kantite esè. Mete `maxNumAttempts` sou kontenè deyò a pito.

# No select: «atribi» is invariant and «pa p gen efè» does not agree.
answer-attributes-need-symbolic-equality = Atribi { $attributes } pa p gen efè san symbolicEquality mete.

answer-invalid-type = Tip ki pa valab pou repons lan: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Piske konpozan `<{ $component }>` pa gen yon non, yo pa ka sèvi ak li pou yon atribi module

module-attribute-name-already-defined = Yo pa ka sèvi ak konpozan `<{ $component } name="{ $name }">` kòm yon atribi pou yon module paske tip konpozan `<module>` gen yon atribi "{ $name }" ki deja defini.

conditional-content-condition-ignored = Yo inyore atribi `condition` sou yon konpozan `<conditionalContent>` ki gen pitit case oswa else.

slider-markers-type-mismatch = Tip makè yo pa koresponn ak tip slider lan.

pretzel-problem-needs-statement-and-answer = pretzel pa valab: chak `<problem>` dwe gen yon `<statement>` ak yon `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel pa valab: nan mode="circuit", premye `<problem>` lan pa ka se yon distraktè.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valè { $values } pa valab pou atribi `{ $attribute }`; y ap inyore l.
       *[other] Valè { $values } pa valab pou atribi `{ $attribute }`; y ap inyore yo.
    }

attribute-must-be-references = Valè `{ $value }` pa valab pou atribi `{ $attribute }`. Atribi a dwe fòme ak referans ki kòmanse ak yon `$`.

math-input-invalid-function-names = <mathInput>: yo inyore non fonksyon ki pa valab nan { $attribute }: { $names }. Segman afichaj chak non dwe gen omwen 2 karaktè (lèt oswa tirè); yon sifiks `|<mathspeak alternative>` opsyonèl ka swiv.

## Building components from the source

component-type-invalid = Tip konpozan ki pa valab: `<{ $componentType }>`

attribute-repeated = Pa ka repete atribi { $attribute }.

attribute-invalid-for-component = Atribi "{ $attribute }" pa valab pou yon konpozan tip `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definisyon stil { $styleNumber } pa gen ase kontras pou { $context ->
        [text-on-background] koulè tèks kont koulè fon
        [high-contrast] koulè gwo kontras kont kanva a
        [line] koulè liy kont kanva a
        [marker] koulè makè kont kanva a
       *[text-on-canvas] koulè tèks kont kanva a
    }{ $mode ->
        [dark] { " (mòd fènwa)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; li mande omwen { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Byenke definisyon stil { $styleNumber } espesifye koulè ki bay ase kontras pou mòd klè, koulè mòd fènwa yo ki soti nan valè sa yo pa gen ase kontras pou koulè tèks kont koulè fon ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; li mande omwen { $threshold }:1). { $suggestion ->
        [available] Pou asire ase kontras nan mòd fènwa, ou mèt ogmante kontras mòd klè a (pa egzanp, mete { $lightAttribute }="{ $lightColor }") oswa ranplase koulè mòd fènwa a (pa egzanp, mete { $darkAttribute }="{ $darkColor }").
       *[none] Pou asire ase kontras nan mòd fènwa, ogmante kontras mòd klè a oswa ranplase koulè ki soti yo ak textColorDarkMode ak/oswa backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Byenke definisyon stil { $styleNumber } espesifye yon koulè tèks ki bay ase kontras pou mòd klè, koulè tèks mòd fènwa a ki soti nan valè sa a pa gen ase kontras kont kanva a ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; li mande omwen { $threshold }:1). { $suggestion ->
        [available] Pou asire ase kontras nan mòd fènwa, ou mèt ogmante kontras mòd klè a (pa egzanp, mete textColor="{ $lightColor }") oswa ranplase koulè mòd fènwa a (pa egzanp, mete textColorDarkMode="{ $darkColor }").
       *[none] Pou asire ase kontras nan mòd fènwa, ogmante kontras mòd klè a oswa ranplase koulè ki soti a ak textColorDarkMode.
    }

section-multiple-style-palettes = Yon seksyon ka chwazi yon sèl <stylePalette>; y ap sèvi ak dènye a.

## Unique variants

variant-num-to-select-not-non-negative-integer = pa ka detèmine varyant inik { $component } paske numToSelect pa yon antye ki pa negatif.

variant-num-to-select-not-constant-number = pa ka detèmine varyant inik { $component } paske numToSelect pa yon nonm konstan.

variant-with-replacement-not-constant-boolean = pa ka detèmine varyant inik { $component } paske withReplacement pa yon boulean konstan.

variant-select-weight-disables-unique = Varyant inik pou select dezaktive si gen yon opsyon ki gen selectWeight oswa selectForVariants espesifye

variant-coprime-undetermined = pa ka detèmine varyant inik { $component } paske yo pa ka detèmine si coprime toujou fo.

variant-attribute-not-constant = pa ka detèmine varyant inik { $component } paske { $attribute } pa yon konstan.

variant-attribute-not-number = pa ka detèmine varyant inik { $component } paske { $attribute } pa yon nonm.

variant-attribute-wrong-type-for-sequence =
    pa ka detèmine varyant inik { $component } tip { $type } paske { $attribute } pa { $expected ->
        [letters-combination] yon konbinezon lèt
        [math-expression] yon ekspresyon matematik valab
        [integer] yon antye
       *[number] yon nonm
    }.

variant-length-not-integer = pa ka detèmine varyant inik { $component } paske length pa yon antye.

variant-sort-not-implemented = yo poko aplike varyant inik yon { $component } ak sort

variant-exclude-combinations-not-implemented = yo poko aplike varyant inik yon { $component } ak excludeCombinations

variant-math-exclude-not-implemented = yo poko aplike varyant inik yon { $component } tip math ak exclude

variant-non-constant-exclude-not-implemented = yo poko aplike varyant inik yon { $component } ak yon exclude ki pa konstan

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: pa sipòte nan randè prefigure graph lan; yo sote desandan an.

prefigure-descendant-invalid-geometry = { $subject }: jeyometri ki pa fini oswa ki pa fini nan valè; yo sote desandan an.

prefigure-curve-label-omitted = { $subject }: yo pa sipòte etikèt sou eleman koub ki konvèti; yo kite etikèt lan deyò.

prefigure-curve-unsupported-definition-type = { $subject }: tip definisyon fonksyon koub '{ $definitionType }' pa sipòte; yo sote desandan an.

prefigure-region-flip-functions-unsupported = { $subject }: atribi flipFunctions pa sipòte sou regionBetweenCurves; yo sote desandan an.

prefigure-region-non-formula-child = { $subject }: se sèlman pitit fonksyon tip fòmil yo sipòte sou regionBetweenCurves; yo sote desandan an.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' pa sipòte pou { $labelKind ->
        [line-family] yon etikèt fanmi liy
       *[point] yon etikèt pwen
    }; y ap sèvi ak aliyman PreFigure pa defo.

prefigure-fill-style-unsupported = { $subject }: PreFigure pa sipòte stil ranpli '{ $fillStyle }'; y ap tonbe sou yon ranpli plen.

prefigure-line-style-unknown = { $subject }: stil liy '{ $lineStyle }' yo pa konnen kite deyò nan sòti PreFigure a.

prefigure-marker-style-mapped-to-diamond = { $subject }: stil makè '{ $markerStyle }' korespondan ak stil PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: PreFigure pa sipòte stil makè '{ $markerStyle }'; y ap sèvi ak stil pa defo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` pa valab; pa ka rezoud sib lan. Yo kite anotasyon an deyò.

annotation-ref-multiple-targets = `<annotation>`: `ref` rezoud sou plizyè sib; y ap sèvi ak premye sib lan.

annotation-ref-outside-graph = `<annotation>`: `ref` pa valab; sib lan deyò graph ki kontni l lan. Yo kite anotasyon an deyò.

annotation-ref-unsupported-target = `<annotation>`: `ref` pa valab; sib lan pa yon objè grafik ki sipòte nan konvèsyon prefigure. Yo kite anotasyon an deyò.

annotation-text-missing = `<annotation>`: `text` manke oswa vid; y ap bay yon tèks vid.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Yo detekte yon depandans sikilè.
       *[other] Yo detekte yon depandans sikilè ki enplike yon konpozan `<{ $componentType }>`.
    }

reference-no-referent = Yo pa jwenn okenn referan pou referans lan: `{ $reference }`

reference-multiple-referents = Yo jwenn plizyè referan pou referans lan: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Fòma ki pa valab pou atribi { $attribute } yon `<{ $componentType }>`.

children-invalid = Pitit ki pa valab pou `<{ $componentType }>`: Yo jwenn pitit ki pa valab: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valè `{ $value }` pa valab pou atribi `{ $attribute }`, y ap sèvi ak valè `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Yo pa jwenn vèsyon DoenetML { $version }.
       *[other] Yo pa jwenn vèsyon DoenetML { $version }. Y ap tonbe sou vèsyon { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ki pa valab: { $content }

parse-tag-missing-close-tag = DoenetML ki pa valab: Tag `{ $tag }` pa gen tag fèmti. Yo te atann yon tag ki fèmen tèt li oswa yon tag `</{ $tagName }>`.

parse-tag-error = DoenetML ki pa valab: Erè nan tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ki pa valab: Atribi `{ $attribute }` ki pa valab sanble manke yon valè.

parse-attribute-invalid = DoenetML ki pa valab: Atribi `{ $attribute }` pa valab

parse-attribute-value-invalid = DoenetML ki pa valab: Valè atribi `{ $value }` pa valab

parse-attribute-value-quote-mismatch = DoenetML ki pa valab: Valè atribi `{ $value }` pa valab. Gimè yo pa koresponn. Sanble ou manke yon `{ $quote }`

parse-open-tag-name-missing = DoenetML ki pa valab: Yo jwenn yon tag san non tag, pa egzanp `<`

parse-tag-not-closed = DoenetML ki pa valab: Tag `{ $tag }` pa t fèmen (sanble yon `>` manke).

parse-self-closing-tag-name-missing = DoenetML ki pa valab: Yo jwenn yon tag san non tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ki pa valab: Tag `{ $tag }` pa t fèmen (sanble `/>` manke).

parse-tag-invalid-attributes = DoenetML ki pa valab: Tag `{ $tag }` pa valab. Li ka gen atribi ki pa kòrèk.

parse-close-tag-name-missing = DoenetML ki pa valab: Yo jwenn yon tag fèmti san non tag, pa egzanp `</`

parse-attribute-value-unquoted = Valè atribi dwe nan gimè: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ki pa valab: Yo jwenn tag fèmti `{ $tag }`, men pa gen tag ouvèti ki koresponn

parse-close-tag-mismatched = DoenetML ki pa valab: Tag fèmti pa koresponn. Yo te atann `</{ $expected }>`. Yo jwenn `{ $found }`

parser-node-unconvertible = Yo pa t kapab konvèti nœud { $node } an nœud Dast.

## Names

name-attribute-invalid =
    Atribi name='{ $name }' pa valab. { $reason ->
        [characters] Non ka gen sèlman lèt, chif, tirè anba oswa tirè.
       *[start] Non dwe kòmanse ak yon lèt.
    }

component-name-invalid-start = Non konpozan "{ $name }" pa valab. Non dwe kòmanse ak yon lèt.

## `<answer>` sugar

answer-video-watched-missing-video = Yon repons tip videoWatched dwe gen yon atribi video

answer-video-watched-video-not-reference = Yon repons tip videoWatched dwe gen yon atribi video ki se yon referans

answer-name-not-single-text = Atribi name yon repons dwe gen yon sèl pitit tèks

## Referencing another document

external-doenetml-recursion-limit = Yo pa t kapab jwenn DoenetML deyò a paske gen twòp nivo rekisyon. Èske gen yon referans sikilè?

external-doenetml-unavailable = Yo pa t kapab jwenn DoenetML nan { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ki pa valab jwenn nan { $attribute }="{ $uri }": li pa t koresponn ak tip konpozan "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribi `{ $from }` demode; sèvi ak `{ $to }` pito.
       *[other] [deprecation] Atribi `{ $from }` sou `<{ $component }>` demode; sèvi ak `{ $to }` pito.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribi `{ $from }` demode epi yo inyore l paske `{ $to }` espesifye tou.
       *[other] [deprecation] Atribi `{ $from }` sou `<{ $component }>` demode epi yo inyore l paske `{ $to }` espesifye tou.
    }

deprecated-attribute-ignored = [deprecation] Atribi `{ $attribute }` sou `<{ $component }>` demode epi yo inyore l.

deprecated-attribute-to-child = [deprecation] Atribi `{ $attribute }` sou `<{ $component }>` demode; sèvi ak yon pitit `<{ $child }>` pito.

deprecated-attribute-value-renamed = [deprecation] Valè `{ $value }` atribi `{ $attribute }` sou `<{ $component }>` demode; sèvi ak `{ $to }` pito.


## Language coverage

pluralize-english-only = `<pluralize>` ka mete sèlman angle nan pliryèl, kidonk tèks li rete jan l ye nan yon dokiman ki ekri an { $locale }. Ekri fòm pliryèl lan dirèkteman, oswa mete l ak atribi `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Eleman `<{ $tag }>` pa yon eleman Doenet yo rekonèt.

schema-element-not-allowed-at-root = Eleman `<{ $tag }>` pa pèmèt nan rasin dokiman an.

schema-element-not-allowed-inside = Eleman `<{ $tag }>` pa pèmèt andedan `<{ $parent }>`.

schema-attribute-unrecognized = Eleman `<{ $tag }>` pa gen yon atribi ki rele `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribi `{ $attribute }` eleman `<{ $tag }>` dwe se yon lis kote chak atik se youn nan: { $allowed }
       *[other] Atribi `{ $attribute }` eleman `<{ $tag }>` dwe se youn nan: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Non varyant pa valab pou select.  Non varyant { $variantName } parèt nan { $numOptions } opsyon men kantite pou chwazi se { $numToSelect }.

select-variant-name-without-options = Kèk varyant espesifye pou select men pa gen okenn opsyon espesifye pou non varyant posib: { $variantName }.

select-variant-name-not-possible = Non varyant { $variantName } ki espesifye pou select pa yon non varyant posib.

select-too-few-options = Pa ka chwazi { $numToSelect } konpozan nan sèlman { $numOptions }.

select-from-sequence-too-few-values = Pa ka chwazi { $numToSelect } valè nan yon sekans longè { $length }.

select-from-sequence-indices-count-mismatch = Kantite endis espesifye pou select dwe koresponn ak kantite pou chwazi

select-from-sequence-indices-not-integers = Tout endis espesifye pou select dwe se antye

select-from-sequence-index-excluded = Endis selectfromsequence ki espesifye a te eskli

select-from-sequence-indices-excluded-combination = Endis selectfromsequence ki espesifye yo te yon konbinezon eskli

select-from-sequence-coprime-not-positive-integers = Pa ka chwazi konbinezon koprim paske se pa antye pozitif y ap chwazi.

select-from-sequence-coprime-common-factor = Pa ka chwazi nonm koprim. Tout valè posib yo pataje yon faktè komen. (Valè "from" oswa "to" ki espesifye dwe koprim ak "step".)

select-from-sequence-coprime-single-number = Pa ka chwazi konbinezon koprim nan yon sèl nonm ki pa 1.

select-from-sequence-excluded-too-many-combinations = Plis pase 70% konbinezon yo eskli nan selectFromSequence

select-from-sequence-coprime-none-found = Yo pa t kapab chwazi nonm koprim. Tout valè posib yo pataje yon faktè komen.

select-from-sequence-too-few-unique-values = Pa ka chwazi { $numToSelect } valè inik nan yon sekans longè { $numPossibleValues }

select-prime-numbers-too-few-values = Pa ka chwazi { $numToSelect } valè nan yon lis nonm premye longè { $numValues }

select-prime-numbers-values-count-mismatch = Kantite valè espesifye pou select dwe koresponn ak kantite pou chwazi

select-prime-numbers-values-not-prime = Tout valè espesifye pou select nonm premye dwe nan lis nonm premye yo

select-prime-numbers-values-excluded-combination = Valè selectPrimeNumbers ki espesifye yo te yon konbinezon eskli

select-prime-numbers-excluded-too-many-combinations = Plis pase 70% konbinezon yo eskli nan selectPrimeNumbers

select-random-combination-fluke = Pa yon chans ekstrèmman ra, yo pa t kapab chwazi yon konbinezon valè o aza

select-random-value-fluke = Pa yon chans ekstrèmman ra, yo pa t kapab chwazi yon valè o aza
