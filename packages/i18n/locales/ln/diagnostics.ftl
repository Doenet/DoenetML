# Lingala diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Where English separates a singular from a plural only in the verb — "is
# ignored" against "are ignored" — the Lingala verb takes its subject concord
# from the noun class rather than from the count, and the argument is a list
# either way. So those selects are dropped and the count argument goes unused.
#
# The technical vocabulary is the French-derived one Kinshasa and Brazzaville
# schooling supplies — «fɔnksiɔ», «indɛkse», «variablɛ» — beside the Lingala
# words for the things that are not technical: «molɔngɔ» a line, «motuya» a
# value, «nkombo» a name.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } etalelami te soki matono mibale ya nsuka elimbolami

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } etalelami te soki litono ya nsuka mpe litono ya katikati nyonso mibale elimbolami

line-segment-midpoint-offset-without-midpoint = midpointOffset esalaka eloko te soki litono ya katikati ezali te

## `<line>`

line-points-undetermined-dimensions = Molɔngɔ eleki na matono oyo bonene na yango eyebani te.

line-points-too-few-dimensions = Molɔngɔ esengeli koleka na matono oyo ezali na bonene mibale ata.

line-points-depend-on-variables = Molɔngɔ eleki na matono oyo etali bavariablɛ: { $variables }.

line-equation-invalid-format = Lolenge ebongi te mpo na ekwasiɔ ya molɔngɔ na bavariablɛ { $variable1 } mpe { $variable2 }.

## `<ray>`

ray-overprescribed-through = Mwinda elimbolami na through, endpoint mpe direction nyonso misato. through oyo elimbolami etalelami te.

ray-dimension-mismatch = numDimensions ekokani te na kati ya mwinda.

## `<vector>`

vector-overprescribed-head = Vɛktɛrɛ elimbolami na head, tail mpe displacement nyonso misato. head oyo elimbolami etalelami te.

vector-dimension-mismatch = numDimensions ekokani te na kati ya vɛktɛrɛ.

## Attracting and constraining

attract-to-without-nearest-point = Ekoki kobendama epai ya `<{ $component }>` te mpo ezali na variablɛ ya ezaleli nearestPoint te.

constrain-to-without-nearest-point = Ekoki kokangama na `<{ $component }>` te mpo ezali na variablɛ ya ezaleli nearestPoint te.

constrain-to-interior-without-nearest-point = Ekoki kokangama na kati ya `<{ $component }>` te mpo ezali na variablɛ ya ezaleli nearestPoint te.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition etalelami te na choiceInput oyo ezali na molɔngɔ moko te

## Ordering children by index

choice-input-indices-count-mismatch = Ba-indɛkse oyo elimbolami mpo na choiceInput etalelami te mpo motango ya ba-indɛkse ekokani te na motango ya bana choice.

pretzel-indices-count-mismatch = Ba-indɛkse oyo elimbolami mpo na problem etalelami te mpo motango ya ba-indɛkse ekokani te na motango ya bana problem.

shuffle-indices-count-mismatch = Ba-indɛkse oyo elimbolami mpo na shuffle etalelami te mpo motango ya ba-indɛkse ekokani te na motango ya biloko.

indices-ignored-out-of-range = Ba-indɛkse oyo elimbolami mpo na { $component } etalelami te mpo ba-indɛkse mosusu ezali libanda ya ndelo.

pretzel-indices-repeated = Ba-indɛkse oyo elimbolami mpo na pretzel etalelami te mpo ba-indɛkse mosusu ezongelami.

pretzel-circuit-first-index = Ba-indɛkse oyo elimbolami mpo na pretzel na modi circuit etalelami te mpo indɛkse ya liboso esengeli kozala 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Mpo `<{ $component }>` esala na bana ya lolenge ya makomi, ezalela `type` esengeli kolimbolama.

invalid-type-defaulting-to-math = type { $type } ebongi te mpo na eloko { $component }. Esengeli kozala moko ya math, text, number to boolean. Ezali kotiama math.

string-not-valid-component-to-arrange = Makomi "{ $value }" ezali eloko ya { $component } ya malamu te. Etalelami te.

## Types and variables

invalid-type-defaulting-to-number = type { $type } ebongi te, type ezali kotiama number.

invalid-variable-value = Motuya ya variablɛ ebongi te: `{ $value }`

## Variants

variant-index-must-be-number = Indɛkse ya lolenge { $index } esengeli kozala motango

variant-index-must-be-integer = Indɛkse ya lolenge { $index } esengeli kozala motango mobimba

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` esalemi na bomeki ya solosolo te. Bonene ezali kotiama na ndambo.

side-by-side-absolute-margins = `<{ $component }>` esalemi na bomeki ya solosolo te. Bandelo ezali kotiama na ndambo.

side-by-side-no-block-child = `<{ $component }>` ebongi te: esengeli kozala na mwana moko ata ya lolenge ya blɔ.

## `<label>`

label-for-ignored-on-graphical = Ezalela `for` na `<label>` ya elilingi etalelami te.

label-for-must-resolve-to-one = Ezalela `for` na `<label>` esengeli kolakisa eloko moko kaka.

label-for-unresolved = Ezalela `for` na `<label>` ekokaki kolakisa eloko moko te.

label-for-answer-with-authored-inputs = Ezalela `for` na `<label>` ezali kolakisa `<answer>` oyo ezali na ba-ekɔteli oyo ekomami; lakisá ekɔteli yango moko.

label-for-answer-without-input = Ezalela `for` na `<label>` ezali kolakisa `<answer>` oyo ezali na ekɔteli ya kopesa nkombo te.

label-for-must-reference-input-or-answer = Ezalela `for` na `<label>` esengeli kolakisa ekɔteli to eyano.

## Accessibility

accessibility-short-description-or-decorative = Mpo na bokɔti, `<{ $component }>` esengeli kozala na ndimbola mokuse to elimbolama lokola ya kobongisa.

accessibility-video-short-description = Mpo na bokɔti, `<video>` esengeli kozala na ndimbola mokuse.

accessibility-input-short-description-or-label = Mpo na bokɔti, `<{ $component }>` esengeli kozala na ndimbola mokuse to nkombo.

accessibility-answer-input-short-description-or-label = Mpo na bokɔti, `<answer>` oyo ezali kosala ekɔteli esengeli kozala na ndimbola mokuse to nkombo.

accessibility-short-description-contains-math = Ndimbola mokuse esengeli kozala na biloko ya matematiki lokola `<{ $component }>` te. Limbolá matematiki nyonso na maloba.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ezali na bokeseni ekoki te mpo na makomi ya motó ya eteni (modi ya molili) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; esengeli kozala ata { $threshold }:1).
       *[other] { $colorName } ezali na bokeseni ekoki te mpo na makomi ya motó ya eteni ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; esengeli kozala ata { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` oyo eleki na matono { $count } esalemi naino te soki matono yango ezali na mituya ya motango te.

circle-too-many-through-points = Ekoki kotánga sɛrkɛlɛ oyo eleki na matono koleka 3 te.

circle-overprescribed-radius-center-points = Ekoki kotánga sɛrkɛlɛ oyo ezali na rɛyɔ, katikati mpe matono ya koleka nyonso elimbolami te.

circle-center-with-multiple-points = Ekoki kotánga sɛrkɛlɛ oyo katikati na yango elimbolami mpe oyo eleki na matono koleka 1 te.

circle-radius-too-small = Ekoki kotánga sɛrkɛlɛ te: lokola ntaka kati ya matono mibale ezali { $distance }, rɛyɔ { $radius } oyo elimbolami ezali moke mingi.

circle-radius-with-many-points = Ekoki kosala sɛrkɛlɛ oyo eleki na matono koleka mibale na rɛyɔ oyo elimbolami te.

circle-invalid-center-or-through-points = Katikati ya sɛrkɛlɛ to matono ya koleka na yango ebongi te.

circle-radius-center-with-multiple-points = Ekoki kotánga rɛyɔ ya sɛrkɛlɛ oyo katikati na yango elimbolami mpe oyo eleki na matono koleka 1 te.

circle-change-radius-non-numerical = Ekoki kobongola rɛyɔ ya sɛrkɛlɛ oyo eleki na matono oyo ezali na mituya ya motango te

circle-radius-with-points-non-numerical = Ekoki kosala sɛrkɛlɛ oyo eleki na litono koleka moko na rɛyɔ oyo elimbolami soki mituya ya motango ezali te.

circle-change-center-non-numerical = Kobongola katikati ya sɛrkɛlɛ oyo eleki na matono oyo ezali na mituya ya motango te esalemi naino te.

## `<function>`

function-domain-insufficient-dimensions = Bonene ya etuka ya fɔnksiɔ ekoki te. Etuka ezali na bantaka { $intervals } kasi fɔnksiɔ ezali na ba-ekɔteli { $inputs }.

function-domain-invalid-format = Lolenge ya etuka ya fɔnksiɔ ebongi te.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Nsɔngɛ ya likolo ya fɔnksiɔ oyo ezali motango te etalelami te.
        [minimum] Nsɔngɛ ya nse ya fɔnksiɔ oyo ezali motango te etalelami te.
        [extremum] Nsɔngɛ ya fɔnksiɔ oyo ezali motango te etalelami te.
        [point] Litono ya fɔnksiɔ oyo ezali motango te etalelami te.
        [slope] Ngwɛ ya fɔnksiɔ oyo ezali motango te etalelami te.
       *[other] { $type } ya fɔnksiɔ oyo ezali motango te etalelami te.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Nsɔngɛ ya likolo ya fɔnksiɔ oyo ezali polele etalelami te.
        [minimum] Nsɔngɛ ya nse ya fɔnksiɔ oyo ezali polele etalelami te.
        [extremum] Nsɔngɛ ya fɔnksiɔ oyo ezali polele etalelami te.
        [point] Litono ya fɔnksiɔ oyo ezali polele etalelami te.
       *[other] { $type } ya fɔnksiɔ oyo ezali polele etalelami te.
    }

function-points-too-close = Fɔnksiɔ ezali na matono mibale oyo ezali penepene mingi. Fɔnksiɔ ekoki kolimbolama te.

function-iterates-input-output-mismatch = Bozongeli ya fɔnksiɔ ekoki kosalema kaka soki motango ya ba-ekɔteli ekokani na motango ya ba-ebimeli. Fɔnksiɔ oyo ezali na ba-ekɔteli { $inputs } mpe ba-ebimeli { $outputs }.

## `<sequence>`

sequence-invalid-length = Bolai ya molɔngɔ ebongi te. Esengeli kozala motango mobimba oyo ezali na nse ya zero te.

sequence-invalid-step = Litambe ya molɔngɔ ebongi te. Na molɔngɔ ya lolenge { $type } esengeli kozala motango.

sequence-invalid-endpoint-number = "{ $attribute }" ya molɔngɔ ya mitango ebongi te. Esengeli kozala motango.

sequence-invalid-endpoint-letters = "{ $attribute }" ya molɔngɔ ya balɛtrɛ ebongi te. Esengeli kozala balɛtrɛ.

sequence-invalid-endpoint = "{ $attribute }" ya molɔngɔ ebongi te.

select-from-sequence-coprime-not-numbers = coprime etalelami te mpo ezali mitango te oyo eponami

select-from-sequence-coprime-with-exclude-combinations = coprime etalelami te mpo excludeCombinations elimbolami

## Resolving a `target`

target-not-found = target ebongi te mpo na `<{ $source }>`: eloko oyo elukami emonani te.

target-state-variable-not-found = target ebongi te mpo na `<{ $source }>`: variablɛ ya ezaleli oyo nkombo na yango ezali "{ $property }" emonani te na `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Bavariablɛ ya `<odeSystem>` esengeli kokesana na variablɛ ya bomoko.

ode-system-duplicate-variable-names = Ekoki kolimbola ba-fɔnksiɔ ya ODE RHS te soki bankombo ya bavariablɛ ezongelami.

ode-system-rhs-function-error = Ekoki kolimbola fɔnksiɔ ya ODE RHS te. Libunga esalemi na kosala fɔnksiɔ ya mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ekoki kolimbola angle kati ya milɔngɔ { $count } te

angle-invalid-through-point = Litono ebongi te na through ya `<angle>`

parabola-vertex-too-many-points = Parabolɛ oyo ezali na nsɔngɛ mpe eleki na matono koleka 1 esalemi naino te.

parabola-too-many-points = Parabolɛ oyo eleki na matono koleka 3 esalemi naino te.

intersection-too-many-items = Bokutani ya biloko koleka mibale esalemi naino te

## Other math components

ionic-compound-not-two-ions = Bosangani ya ioni oyo eleki ba-ioni mibale esalemi naino te.

ionic-compound-needs-cation-and-anion = Bosangani ya ioni esalemi kaka mpo na kation moko mpe anion moko.

solve-equations-cannot-evaluate = Ekoki kosilisa ekwasiɔ te mpo ekwasiɔ ekokaki kotángama te: { $equation }

math-operators-operand-number-required = operandNumber esengeli kolimbolama ntango ezali kobimisa operandɛ ya matematiki.

eigen-decomposition-failed = Ekoki kotánga mituya eigen ya matrisɛ te

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: baparamɛtrɛ { $parameters } ezali na kati ya lolenge te, yango wana ekokokana na polele ntango nyonso.

## `<graph>`

graph-grid-invalid = `<graph>`: ekoki kolimbola grid="{ $grid }" te. Esengeli kozala none, medium, dense, to mitango mibale ya malamu oyo ekabolami na esika mpamba, lokola grid="1 0.5". Grilɛ moko te ezali kosalema.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" endimami te na molakisi ya prefigure; ezaleli ya ngámbo ya mobali ezali kosalelama.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" endimami te na molakisi ya prefigure; ezaleli ya likolo ezali kosalelama.

prefigure-invalid-axis-bounds = `<graph>`: bandelo ya aksɛ ebongi te mpo na bobongoli ya prefigure; bbox (-10,-10,10,10) ezali kosalelama.

prefigure-invalid-width = `<graph>`: bonene ebongi te mpo na bobongoli ya prefigure; bonene ya elilingi 425 ezali kosalelama.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ebongi te mpo na bobongoli ya prefigure; bokokani 1 ezali kosalelama.

prefigure-grid-spacing-too-fine = `<graph>`: bantaka ya grilɛ ezali mikemike mingi mpo na bandelo ya aksɛ; grilɛ etikali na molakisi ya prefigure.

prefigure-annotations-not-rendered = `<graph>`: makanisi ekolakisama te soki molakisi ya PreFigure esalelami te.

multiple-annotations-children = Bana `<annotations>` ebele emonani na `<graph>`; nyonso etalelami te longola kaka ya nsuka.

## Referring to other components

copy-unrecognized-component-type = Ekoki kotanda to kokopi lolenge ya eloko oyo eyebani te: { $type }.

copy-prop-not-found = Ezalela { $property } emonani te na eloko ya lolenge { $component }

collect-no-source = Esika ya kozwa emonani te mpo na collect.

collect-invalid-component-type = Ekoki koyanganisa biloko ya lolenge `<{ $component }>` te mpo ezali lolenge ya eloko oyo ebongi te.

reference-index-unavailable = Ekoki kolakisa indɛkse `{ $reference }` te

## `<callAction>`

component-action-unavailable = Ekoki kobenga { $action } na eloko `{ $reference }` te

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Lolenge ya ba-donɛ ebongi te. Milɔngɔ ezali na bolai ekokani te. Emonani na componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Ba-donɛ ezali na bankombo ya milɔngɔ ya kotɛlɛma oyo ezongelami. Emonani na componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ba-donɛ ezangi nkombo ya molɔngɔ ya kotɛlɛma. Emonani na componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award moko ya eyano oyo etali eyano oyo tagi answer yango moko etindaki, mpe yango ekobimisa ezaleli oyo ezelami te.

answer-max-num-attempts-in-section-wide-check-work = Kotia `maxNumAttempts` na `<answer>` oyo ezali na kati ya libenga oyo ezali na `sectionWideCheckWork` esalaka eloko te, mpo libenga yango nde ezali kotala motango ya mimekano. Tiá `maxNumAttempts` na libenga yango.

nested-section-wide-check-work-max-num-attempts = Kotia `maxNumAttempts` na libenga oyo ezali na `sectionWideCheckWork` mpe ezali na kati ya libenga mosusu oyo ezali na `sectionWideCheckWork` esalaka eloko te, mpo libenga ya libanda nde ezali kotala motango ya mimekano. Tiá `maxNumAttempts` na libenga ya libanda.

answer-attributes-need-symbolic-equality = Bizalela { $attributes } ekosala eloko te soki symbolicEquality etiami te.

answer-invalid-type = Lolenge ebongi te mpo na eyano: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Lokola eloko `<{ $component }>` ezali na nkombo te, ekoki kosalelama lokola ezalela ya module te

module-attribute-name-already-defined = Eloko `<{ $component } name="{ $name }">` ekoki kosalelama lokola ezalela ya module te mpo lolenge ya eloko `<module>` esili kozala na ezalela oyo nkombo na yango ezali "{ $name }".

conditional-content-condition-ignored = Ezalela `condition` etalelami te na eloko `<conditionalContent>` oyo ezali na bana case to else.

slider-markers-type-mismatch = Lolenge ya bilembo ekokani te na lolenge ya slider.

pretzel-problem-needs-statement-and-answer = pretzel ebongi te: `<problem>` mokomoko esengeli kozala na `<statement>` moko mpe `<answer>` moko.

pretzel-circuit-first-problem-distractor = pretzel ebongi te: na mode="circuit", `<problem>` ya liboso ekoki kozala ya kobungisa nzela te.

## Attribute values

attribute-invalid-values = Mituya { $values } ebongi te mpo na ezalela `{ $attribute }`; etalelami te.

attribute-must-be-references = Motuya `{ $value }` ebongi te mpo na ezalela `{ $attribute }`. Ezalela esengeli kozala balakisi oyo ebandaka na `$`.

math-input-invalid-function-names = <mathInput>: bankombo ya fɔnksiɔ oyo ebongi te na { $attribute } etalelami te: { $names }. Eteni ya bolakisi ya nkombo mokomoko esengeli kozala na balɛtrɛ 2 ata (balɛtrɛ to bantɔkɔ); `|<mathspeak alternative>` ekoki kolanda.

## Building components from the source

component-type-invalid = Lolenge ya eloko ebongi te: `<{ $componentType }>`

attribute-repeated = Ezalela { $attribute } ekoki kozongelama te.

attribute-invalid-for-component = Ezalela "{ $attribute }" ebongi te mpo na eloko ya lolenge `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Ndimbola ya lolenge { $styleNumber } ezali na bokeseni ekoki te mpo na { $context ->
        [text-on-background] langi ya makomi likolo ya langi ya nsima
        [high-contrast] langi ya bokeseni monene likolo ya etanda
        [line] langi ya molɔngɔ likolo ya etanda
        [marker] langi ya elembo likolo ya etanda
       *[text-on-canvas] langi ya makomi likolo ya etanda
    }{ $mode ->
        [dark] { " (modi ya molili)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; esengeli kozala ata { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Atako ndimbola ya lolenge { $styleNumber } elimbolaki balangi oyo epesaka bokeseni ekoki na modi ya pole, balangi ya modi ya molili oyo ebimi na yango ezali na bokeseni ekoki te mpo na langi ya makomi likolo ya langi ya nsima ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; esengeli kozala ata { $threshold }:1). { $suggestion ->
        [available] Mpo bokeseni ekoka na modi ya molili, bakisá bokeseni ya modi ya pole (ndakisa tiá { $lightAttribute }="{ $lightColor }") to bongolá langi ya modi ya molili (ndakisa tiá { $darkAttribute }="{ $darkColor }").
       *[none] Mpo bokeseni ekoka na modi ya molili, bakisá bokeseni ya modi ya pole to bongolá balangi oyo ebimi na yango na textColorDarkMode mpe/to backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Atako ndimbola ya lolenge { $styleNumber } elimbolaki langi ya makomi oyo epesaka bokeseni ekoki na modi ya pole, langi ya makomi ya modi ya molili oyo ebimi na yango ezali na bokeseni ekoki te likolo ya etanda ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; esengeli kozala ata { $threshold }:1). { $suggestion ->
        [available] Mpo bokeseni ekoka na modi ya molili, bakisá bokeseni ya modi ya pole (ndakisa tiá textColor="{ $lightColor }") to bongolá langi ya modi ya molili (ndakisa tiá textColorDarkMode="{ $darkColor }").
       *[none] Mpo bokeseni ekoka na modi ya molili, bakisá bokeseni ya modi ya pole to bongolá langi oyo ebimi na yango na textColorDarkMode.
    }

section-multiple-style-palettes = Eteni ekoki kopona kaka <stylePalette> moko; ya nsuka ezali kosalelama.

## Unique variants

variant-num-to-select-not-non-negative-integer = ekoki koyeba balolenge ya bokeseni ya { $component } te mpo numToSelect ezali motango mobimba oyo ezali na nse ya zero te.

variant-num-to-select-not-constant-number = ekoki koyeba balolenge ya bokeseni ya { $component } te mpo numToSelect ezali motango oyo ebongwanaka te.

variant-with-replacement-not-constant-boolean = ekoki koyeba balolenge ya bokeseni ya { $component } te mpo withReplacement ezali bulean oyo ebongwanaka te.

variant-select-weight-disables-unique = Balolenge ya bokeseni ya select ekangami soki bopono moko ezali na selectWeight to selectForVariants

variant-coprime-undetermined = ekoki koyeba balolenge ya bokeseni ya { $component } te mpo ekoki kondimisa te ete coprime ezali lokuta ntango nyonso.

variant-attribute-not-constant = ekoki koyeba balolenge ya bokeseni ya { $component } te mpo { $attribute } ezali makasi te.

variant-attribute-not-number = ekoki koyeba balolenge ya bokeseni ya { $component } te mpo { $attribute } ezali motango te.

variant-attribute-wrong-type-for-sequence =
    ekoki koyeba balolenge ya bokeseni ya { $component } ya lolenge { $type } te mpo { $attribute } ezali { $expected ->
        [letters-combination] bosangani ya balɛtrɛ
        [math-expression] maloba ya matematiki ya malamu
        [integer] motango mobimba
       *[number] motango
    } te.

variant-length-not-integer = ekoki koyeba balolenge ya bokeseni ya { $component } te mpo length ezali motango mobimba te.

variant-sort-not-implemented = balolenge ya bokeseni ya { $component } oyo ezali na sort esalemi naino te

variant-exclude-combinations-not-implemented = balolenge ya bokeseni ya { $component } oyo ezali na excludeCombinations esalemi naino te

variant-math-exclude-not-implemented = balolenge ya bokeseni ya { $component } ya lolenge math oyo ezali na exclude esalemi naino te

variant-non-constant-exclude-not-implemented = balolenge ya bokeseni ya { $component } oyo ezali na exclude oyo ezali makasi te esalemi naino te

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: endimami te na molakisi ya graph prefigure; mokitani elekisami.

prefigure-descendant-invalid-geometry = { $subject }: jeometri oyo ezali na nsuka te to esili te; mokitani elekisami.

prefigure-curve-label-omitted = { $subject }: bankombo endimami te na biloko ya kurbɛ oyo ebongolami; nkombo etikali.

prefigure-curve-unsupported-definition-type = { $subject }: lolenge ya ndimbola ya fɔnksiɔ ya kurbɛ '{ $definitionType }' endimami te; mokitani elekisami.

prefigure-region-flip-functions-unsupported = { $subject }: ezalela flipFunctions na regionBetweenCurves endimami te; mokitani elekisami.

prefigure-region-non-formula-child = { $subject }: kaka ba-fɔnksiɔ bana ya lolenge formula nde endimami na regionBetweenCurves; mokitani elekisami.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' endimami te mpo na { $labelKind ->
        [line-family] nkombo ya libota ya molɔngɔ
       *[point] nkombo ya litono
    }; bobongisi ya PreFigure ezali kosalelama.

prefigure-fill-style-unsupported = { $subject }: lolenge ya kotondisa '{ $fillStyle }' endimami te na PreFigure; ezali kozonga na kotondisa na langi moko.

prefigure-line-style-unknown = { $subject }: lolenge ya molɔngɔ '{ $lineStyle }' eyebani te mpe etikali na mosala ya PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: lolenge ya elembo '{ $markerStyle }' ekokanisami na lolenge ya PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: lolenge ya elembo '{ $markerStyle }' endimami te na PreFigure; lolenge ya ebandeli ezali kosalelama.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ebongi te; eloko oyo elukami eyebani te. Likanisi etikali.

annotation-ref-multiple-targets = `<annotation>`: `ref` elimbolaki biloko ebele; ya liboso ezali kosalelama.

annotation-ref-outside-graph = `<annotation>`: `ref` ebongi te; eloko oyo elukami ezali libanda ya grafi oyo ebombi yango. Likanisi etikali.

annotation-ref-unsupported-target = `<annotation>`: `ref` ebongi te; eloko oyo elukami ezali eloko ya elilingi oyo endimami na bobongoli ya prefigure te. Likanisi etikali.

annotation-text-missing = `<annotation>`: `text` ezali te to ezali polele; makomi ya polele nde ebimi.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Botali ya zɛlɔ emonani.
       *[other] Botali ya zɛlɔ oyo etali eloko `<{ $componentType }>` emonani.
    }

reference-no-referent = Eloko moko te emonani mpo na elakisi: `{ $reference }`

reference-multiple-referents = Biloko ebele emonani mpo na elakisi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Lolenge ebongi te mpo na ezalela { $attribute } ya `<{ $componentType }>`.

children-invalid = Bana ebongi te mpo na `<{ $componentType }>`: Bana oyo ebongi te emonani: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Motuya `{ $value }` ebongi te mpo na ezalela `{ $attribute }`, motuya `{ $default }` ezali kosalelama

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML lolenge { $version } emonani te.
       *[other] DoenetML lolenge { $version } emonani te. Ezali kozonga na lolenge { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ebongi te: { $content }

parse-tag-missing-close-tag = DoenetML ebongi te: Tagi `{ $tag }` ezali na tagi ya kokanga te. Ezelamaki tagi oyo emikangaka to tagi `</{ $tagName }>`.

parse-tag-error = DoenetML ebongi te: Libunga na tagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ebongi te: Ezalela `{ $attribute }` oyo ebongi te emonani lokola ezangi motuya.

parse-attribute-invalid = DoenetML ebongi te: Ezalela `{ $attribute }` ebongi te

parse-attribute-value-invalid = DoenetML ebongi te: Motuya ya ezalela `{ $value }` ebongi te

parse-attribute-value-quote-mismatch = DoenetML ebongi te: Motuya ya ezalela `{ $value }` ebongi te. Bilembo ya maloba ekokani te. Emonani lokola `{ $quote }` ezangi

parse-open-tag-name-missing = DoenetML ebongi te: Tagi oyo ezali na nkombo te emonani, ndakisa `<`

parse-tag-not-closed = DoenetML ebongi te: Tagi `{ $tag }` ekangami te (emonani lokola `>` ezangi).

parse-self-closing-tag-name-missing = DoenetML ebongi te: Tagi oyo ezali na nkombo te emonani `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ebongi te: Tagi `{ $tag }` ekangami te (emonani lokola `/>` ezangi).

parse-tag-invalid-attributes = DoenetML ebongi te: Tagi `{ $tag }` ebongi te. Mbala mosusu ezali na bizalela oyo ebongi te.

parse-close-tag-name-missing = DoenetML ebongi te: Tagi ya kokanga oyo ezali na nkombo te emonani, ndakisa `</`

parse-attribute-value-unquoted = Mituya ya bizalela esengeli kotiama na kati ya bilembo ya maloba: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ebongi te: Tagi ya kokanga `{ $tag }` emonani, kasi tagi ya kofungola oyo ekokani ezali te

parse-close-tag-mismatched = DoenetML ebongi te: Tagi ya kokanga ekokani te. Ezelamaki `</{ $expected }>`. Emonani `{ $found }`

parser-node-unconvertible = Ekokaki kobongola nɔdi { $node } na nɔdi ya Dast te.

## Names

name-attribute-invalid =
    Ezalela name='{ $name }' ebongi te. { $reason ->
        [characters] Bankombo ekoki kozala kaka na balɛtrɛ, mitango, bantɔkɔ ya nse to bantɔkɔ.
       *[start] Bankombo esengeli kobanda na lɛtrɛ.
    }

component-name-invalid-start = Nkombo ya eloko "{ $name }" ebongi te. Bankombo esengeli kobanda na lɛtrɛ.

## `<answer>` sugar

answer-video-watched-missing-video = Eyano ya lolenge videoWatched esengeli kozala na ezalela video

answer-video-watched-video-not-reference = Eyano ya lolenge videoWatched esengeli kozala na ezalela video oyo ezali elakisi

answer-name-not-single-text = Ezalela name ya eyano esengeli kozala na mwana text moko kaka

## Referencing another document

external-doenetml-recursion-limit = Ekoki kozwa DoenetML ya libanda te mpo bozongeli ezali mingi mingi. Elakisi ya zɛlɔ ezali?

external-doenetml-unavailable = Ekoki kozwa DoenetML uta na { $attribute }="{ $uri }" te

external-doenetml-type-mismatch = DoenetML oyo ezwami uta na { $attribute }="{ $uri }" ebongi te: ekokani te na lolenge ya eloko "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ezalela `{ $from }` eleki ntango; salelá `{ $to }`.
       *[other] [deprecation] Ezalela `{ $from }` na `<{ $component }>` eleki ntango; salelá `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ezalela `{ $from }` eleki ntango mpe etalelami te mpo `{ $to }` mpe elimbolami.
       *[other] [deprecation] Ezalela `{ $from }` na `<{ $component }>` eleki ntango mpe etalelami te mpo `{ $to }` mpe elimbolami.
    }

deprecated-attribute-ignored = [deprecation] Ezalela `{ $attribute }` na `<{ $component }>` eleki ntango mpe etalelami te.

deprecated-attribute-to-child = [deprecation] Ezalela `{ $attribute }` na `<{ $component }>` eleki ntango; salelá mwana `<{ $child }>`.


## Language coverage

pluralize-english-only = `<pluralize>` ekoki kosala motango ebele kaka na Lingelesi, yango wana makomi na yango etikali ndenge ezali na mokanda oyo ekomami na { $locale }. Komá lolenge ya motango ebele yo moko, to tiá yango na ezalela `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Eloko `<{ $tag }>` ezali eloko ya Doenet oyo eyebani te.

schema-element-not-allowed-at-root = Eloko `<{ $tag }>` epesameli nzela te na mosisa ya mokanda.

schema-element-not-allowed-inside = Eloko `<{ $tag }>` epesameli nzela te na kati ya `<{ $parent }>`.

schema-attribute-unrecognized = Eloko `<{ $tag }>` ezali na ezalela oyo nkombo na yango ezali `{ $attribute }` te.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ezalela `{ $attribute }` ya eloko `<{ $tag }>` esengeli kozala molɔngɔ oyo eloko mokomoko ezali moko ya: { $allowed }
       *[other] Ezalela `{ $attribute }` ya eloko `<{ $tag }>` esengeli kozala moko ya: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nkombo ya lolenge ebongi te mpo na select. Nkombo ya lolenge { $variantName } emonani na baponi { $numOptions } kasi motango ya kopona ezali { $numToSelect }.

select-variant-name-without-options = Balolenge mosusu elimbolami mpo na select kasi bopono moko te elimbolami mpo na nkombo ya lolenge oyo ekoki kozala: { $variantName }.

select-variant-name-not-possible = Nkombo ya lolenge { $variantName } oyo elimbolami mpo na select ezali nkombo ya lolenge oyo ekoki kozala te.

select-too-few-options = Ekoki kopona biloko { $numToSelect } na kati ya { $numOptions } kaka te.

select-from-sequence-too-few-values = Ekoki kopona mituya { $numToSelect } na molɔngɔ oyo bolai na yango ezali { $length } te.

select-from-sequence-indices-count-mismatch = Motango ya ba-indɛkse oyo elimbolami mpo na select esengeli kokokana na motango ya kopona

select-from-sequence-indices-not-integers = Ba-indɛkse nyonso oyo elimbolami mpo na select esengeli kozala mitango mibimba

select-from-sequence-index-excluded = Indɛkse ya selectfromsequence oyo elongolami elimbolami

select-from-sequence-indices-excluded-combination = Ba-indɛkse ya selectfromsequence oyo ezalaki bosangani oyo elongolami elimbolami

select-from-sequence-coprime-not-positive-integers = Ekoki kopona bosangani ya mitango ya bokabwani te mpo ezali mitango mibimba ya malamu te oyo eponami.

select-from-sequence-coprime-common-factor = Ekoki kopona mitango ya bokabwani te. Mituya nyonso oyo ekoki kozala ezali na mokaboli moko. (Mituya oyo elimbolami ya "from" to "to" esengeli kozala na bokabwani na "step".)

select-from-sequence-coprime-single-number = Ekoki kopona bosangani ya mitango ya bokabwani na motango moko oyo ezali 1 te.

select-from-sequence-excluded-too-many-combinations = Koleka 70% ya bosangani elongolami na selectFromSequence

select-from-sequence-coprime-none-found = Ekokaki kopona mitango ya bokabwani te. Mituya nyonso oyo ekoki kozala ezali na mokaboli moko.

select-from-sequence-too-few-unique-values = Ekoki kopona mituya ya bokeseni { $numToSelect } na molɔngɔ oyo bolai na yango ezali { $numPossibleValues } te

select-prime-numbers-too-few-values = Ekoki kopona mituya { $numToSelect } na molɔngɔ ya mitango ya nkónzi oyo bolai na yango ezali { $numValues } te

select-prime-numbers-values-count-mismatch = Motango ya mituya oyo elimbolami mpo na select esengeli kokokana na motango ya kopona

select-prime-numbers-values-not-prime = Mituya nyonso oyo elimbolami mpo na select prime number esengeli kozala na molɔngɔ ya mitango ya nkónzi

select-prime-numbers-values-excluded-combination = Mituya ya selectPrimeNumbers oyo elimbolami ezalaki bosangani oyo elongolami

select-prime-numbers-excluded-too-many-combinations = Koleka 70% ya bosangani elongolami na selectPrimeNumbers

select-random-combination-fluke = Na likambo oyo esalemaka mingi te, ekokaki kopona bosangani ya mituya ya mbalakaka te

select-random-value-fluke = Na likambo oyo esalemaka mingi te, ekokaki kopona motuya ya mbalakaka te
