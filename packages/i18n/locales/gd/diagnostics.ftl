# Scottish Gaelic diagnostics. Translated from `locales/en/diagnostics.ftl`,
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
# Gaelic counts in four plural categories, but only `few` — three to ten —
# takes a plural noun after a numeral; `one`, `two` and `other` all leave it
# singular. So a counted noun below branches on `few` against a default rather
# than on the English one/other split, and a message whose two English branches
# would read alike in Gaelic drops the select entirely.

## `<lineSegment>`

# Gaelic covers "is ignored" and "are ignored" with the one form, so the
# English count select has nothing to choose between and is dropped.
line-segment-attributes-ignored-with-endpoints = thathar a' leigeil seachad { $attributes } nuair a shònraichear dà cheann-phuing

line-segment-attributes-ignored-with-endpoint-and-midpoint = thathar a' leigeil seachad { $attributes } nuair a shònraichear ceann-phuing agus meadhan-phuing le chèile

line-segment-midpoint-offset-without-midpoint = chan eil buaidh aig midpointOffset gun mheadhan-phuing

## `<line>`

line-points-undetermined-dimensions = Loidhne tro phuingean aig nach eil tomhasan aithnichte.

line-points-too-few-dimensions = Feumaidh an loidhne a dhol tro phuingean aig a bheil dà thomhas air a' char as lugha.

line-points-depend-on-variables = Tha an loidhne a' dol tro phuingean a tha an eisimeil chaochladairean: { $variables }.

line-equation-invalid-format = Fòrmat mì-dhligheach airson co-aontar loidhne sna caochladairean { $variable1 } agus { $variable2 }.

## `<ray>`

ray-overprescribed-through = Tha an gath air a shònrachadh le through, endpoint agus direction.  A' leigeil seachad an through a chaidh a shònrachadh.

ray-dimension-mismatch = Mì-fhreagairt numDimensions sa ghath.

## `<vector>`

vector-overprescribed-head = Tha am beactar air a shònrachadh le head, tail agus displacement.  A' leigeil seachad an head a chaidh a shònrachadh.

vector-dimension-mismatch = Mì-fhreagairt numDimensions sa bheactar.

## Attracting and constraining

attract-to-without-nearest-point = Chan urrainnear tarraing gu `<{ $component }>` on nach eil caochladair staid nearestPoint aige.

constrain-to-without-nearest-point = Chan urrainnear cuingealachadh gu `<{ $component }>` on nach eil caochladair staid nearestPoint aige.

constrain-to-interior-without-nearest-point = Chan urrainnear cuingealachadh gu taobh a-staigh `<{ $component }>` on nach eil caochladair staid nearestPoint aige.

## `<choiceInput>`

choice-input-label-position-ignored = Thathar a' leigeil seachad labelPosition airson choiceInput nach eil inline

## Ordering children by index

choice-input-indices-count-mismatch = A' leigeil seachad nan clàr-amas a chaidh a shònrachadh airson choiceInput on nach eil an àireamh dhiubh a' freagairt ri àireamh nan cloinne choice.

pretzel-indices-count-mismatch = A' leigeil seachad nan clàr-amas a chaidh a shònrachadh airson problem on nach eil an àireamh dhiubh a' freagairt ri àireamh nan cloinne problem.

shuffle-indices-count-mismatch = A' leigeil seachad nan clàr-amas a chaidh a shònrachadh airson shuffle on nach eil an àireamh dhiubh a' freagairt ri àireamh nan co-phàirtean.

indices-ignored-out-of-range = A' leigeil seachad nan clàr-amas a chaidh a shònrachadh airson { $component } on a tha cuid dhiubh taobh a-muigh an rainse.

pretzel-indices-repeated = A' leigeil seachad nan clàr-amas a chaidh a shònrachadh airson pretzel on a tha cuid dhiubh air an ath-aithris.

pretzel-circuit-first-index = A' leigeil seachad nan clàr-amas a chaidh a shònrachadh airson pretzel ann am modh circuit on a dh'fheumas a' chiad chlàr-amas a bhith na 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Gus an obraich `<{ $component }>` le cloinn shreangan, feumar buadh `type` a shònrachadh.

invalid-type-defaulting-to-math = Seòrsa mì-dhligheach { $type } airson na co-phàirt { $component }. Feumaidh e bhith na aon de math, text, number no boolean. A' tilleadh gu math.

string-not-valid-component-to-arrange = Chan e co-phàirt dhligheach airson { $component } a th' anns an t-sreang "{ $value }". 'Ga leigeil seachad.

## Types and variables

invalid-type-defaulting-to-number = Seòrsa mì-dhligheach { $type }, a' suidheachadh an t-seòrsa gu number.

invalid-variable-value = Luach mì-dhligheach caochladair: `{ $value }`

## Variants

variant-index-must-be-number = Feumaidh clàr-amas an tionndaidh { $index } a bhith na àireamh

variant-index-must-be-integer = Feumaidh clàr-amas an tionndaidh { $index } a bhith na shlànuimhir

## `<sideBySide>`

side-by-side-absolute-widths = Cha deach `<{ $component }>` a chur an gnìomh airson tomhasan absaloideach. A' suidheachadh nan leudan gu dàimheach.

side-by-side-absolute-margins = Cha deach `<{ $component }>` a chur an gnìomh airson tomhasan absaloideach. A' suidheachadh nam marghan gu dàimheach.

side-by-side-no-block-child = `<{ $component }>` mì-dhligheach: feumaidh co-dhiù aon leanabh bloca a bhith aige.

## `<label>`

label-for-ignored-on-graphical = Thathar a' leigeil seachad na buaidh `for` air `<label>` grafaigeach.

label-for-must-resolve-to-one = Feumaidh a' bhuadh `for` air `<label>` fuasgladh gu dìreach aon cho-phàirt.

label-for-unresolved = Cha b' urrainnear a' bhuadh `for` air `<label>` fhuasgladh gu co-phàirt.

label-for-answer-with-authored-inputs = Tha a' bhuadh `for` air `<label>` a' toirt iomradh air `<answer>` aig a bheil ion-chuir sgrìobhte; thoir iomradh air an ion-chur fhèin.

label-for-answer-without-input = Tha a' bhuadh `for` air `<label>` a' toirt iomradh air `<answer>` aig nach eil ion-chur ri leubaileadh.

label-for-must-reference-input-or-answer = Feumaidh a' bhuadh `for` air `<label>` iomradh a thoirt air ion-chur no air freagairt.

## Accessibility

accessibility-short-description-or-decorative = A chum so-ruigsinneachd, feumaidh tuairisgeul goirid a bhith aig `<{ $component }>` no feumar a shònrachadh mar sgeadachail.

accessibility-video-short-description = A chum so-ruigsinneachd, feumaidh tuairisgeul goirid a bhith aig `<video>`.

accessibility-input-short-description-or-label = A chum so-ruigsinneachd, feumaidh tuairisgeul goirid no leubail a bhith aig `<{ $component }>`.

accessibility-answer-input-short-description-or-label = A chum so-ruigsinneachd, feumaidh tuairisgeul goirid no leubail a bhith aig `<answer>` a chruthaicheas ion-chur.

accessibility-short-description-contains-math = Cha bu chòir co-phàirtean matamataigeach mar `<{ $component }>` a bhith ann an tuairisgeul goirid. Sgrìobh matamataig sam bith a-mach ann am faclan.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Chan eil iomsgaradh gu leòr aig { $colorName } airson teacsa ceann-sgrìobhaidh na h-earrainn (modh dorcha) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; feumar { $threshold }:1 air a' char as lugha).
       *[other] Chan eil iomsgaradh gu leòr aig { $colorName } airson teacsa ceann-sgrìobhaidh na h-earrainn ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; feumar { $threshold }:1 air a' char as lugha).
    }

## `<circle>`

circle-through-points-non-numerical = Cha deach `<circle>` tro { $count } puingean a chur an gnìomh far nach eil luachan àireamhail aig na puingean.

circle-too-many-through-points = Chan urrainnear cearcall tro chòrr air 3 puingean àireamhachadh.

circle-overprescribed-radius-center-points = Chan urrainnear cearcall àireamhachadh le rèideas, meadhan agus puingean troimhe uile air an sònrachadh.

circle-center-with-multiple-points = Chan urrainnear cearcall àireamhachadh le meadhan sònraichte tro chòrr air aon phuing.

circle-radius-too-small = Chan urrainnear an cearcall àireamhachadh: on as e { $distance } an t-astar eadar an dà phuing, tha an rèideas sònraichte { $radius } ro bheag.

circle-radius-with-many-points = Chan urrainnear cearcall tro chòrr air dà phuing a chruthachadh le rèideas sònraichte.

circle-invalid-center-or-through-points = Meadhan no puingean troimhe mì-dhligheach airson a' chearcaill.

circle-radius-center-with-multiple-points = Chan urrainnear rèideas cearcaill àireamhachadh le meadhan sònraichte tro chòrr air aon phuing.

circle-change-radius-non-numerical = Chan urrainnear rèideas cearcaill atharrachadh far nach eil luachan àireamhail aig na puingean troimhe

circle-radius-with-points-non-numerical = Chan urrainnear cearcall tro chòrr air aon phuing a chruthachadh le rèideas sònraichte far nach eil luachan àireamhail ann.

circle-change-center-non-numerical = Cha deach atharrachadh meadhan cearcaill tro phuingean gun luachan àireamhail a chur an gnìomh.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [few] Chan eil tomhasan gu leòr san raon-cleachdaidh airson na foincsein. Tha { $intervals } eadaramhan aig an raon-cleachdaidh ach tha { $inputs ->
            [few] { $inputs } ion-chuir
           *[other] { $inputs } ion-chur
        } aig an fhoincsean.
       *[other] Chan eil tomhasan gu leòr san raon-cleachdaidh airson na foincsein. Tha { $intervals } eadaramh aig an raon-cleachdaidh ach tha { $inputs ->
            [few] { $inputs } ion-chuir
           *[other] { $inputs } ion-chur
        } aig an fhoincsean.
    }

function-domain-invalid-format = Fòrmat mì-dhligheach airson raon-cleachdaidh na foincsein.

function-ignoring-non-numerical =
    { $type ->
        [maximum] A' leigeil seachad as motha neo-àireamhail na foincsein.
        [minimum] A' leigeil seachad as lugha neo-àireamhail na foincsein.
        [extremum] A' leigeil seachad foircinn neo-àireamhail na foincsein.
        [point] A' leigeil seachad puing neo-àireamhail na foincsein.
        [slope] A' leigeil seachad leathad neo-àireamhail na foincsein.
       *[other] A' leigeil seachad { $type } neo-àireamhail na foincsein.
    }

function-ignoring-empty =
    { $type ->
        [maximum] A' leigeil seachad as motha falamh na foincsein.
        [minimum] A' leigeil seachad as lugha falamh na foincsein.
        [extremum] A' leigeil seachad foircinn falamh na foincsein.
        [point] A' leigeil seachad puing fhalamh na foincsein.
       *[other] A' leigeil seachad { $type } falamh na foincsein.
    }

function-points-too-close = Tha dà phuing san fhoincsean a tha ro fhaisg air a chèile. Chan urrainnear an fhoincsean a mhìneachadh.

function-iterates-input-output-mismatch =
    { $inputs ->
        [few] Chan eil ath-obrachaidhean foincsein comasach ach nuair a tha an aon àireamh de ion-chuir agus de às-chuir aig an fhoincsean. Tha { $inputs } ion-chuir agus { $outputs ->
            [few] { $outputs } às-chuir
           *[other] { $outputs } às-chur
        } aig an fhoincsean seo.
       *[other] Chan eil ath-obrachaidhean foincsein comasach ach nuair a tha an aon àireamh de ion-chuir agus de às-chuir aig an fhoincsean. Tha { $inputs } ion-chur agus { $outputs ->
            [few] { $outputs } às-chuir
           *[other] { $outputs } às-chur
        } aig an fhoincsean seo.
    }

## `<sequence>`

sequence-invalid-length = Faid mhì-dhligheach sreath-leantainn.  Feumaidh e bhith na shlànuimhir neo-àicheil.

sequence-invalid-step = Ceum mì-dhligheach sreath-leantainn.  Feumaidh e bhith na àireamh airson sreath-leantainn den t-seòrsa { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" mì-dhligheach de shreath-leantainn àireamhan.  Feumaidh e bhith na àireamh.

sequence-invalid-endpoint-letters = "{ $attribute }" mì-dhligheach de shreath-leantainn litrichean.  Feumaidh e bhith na cho-mheasgachadh litrichean.

sequence-invalid-endpoint = "{ $attribute }" mì-dhligheach de shreath-leantainn.

select-from-sequence-coprime-not-numbers = thathar a' leigeil seachad coprime on nach e àireamhan a thathar a' taghadh

select-from-sequence-coprime-with-exclude-combinations = thathar a' leigeil seachad coprime on a chaidh excludeCombinations a shònrachadh

## Resolving a `target`

target-not-found = Targaid mhì-dhligheach airson `<{ $source }>`: chan urrainnear an targaid a lorg.

target-state-variable-not-found = Targaid mhì-dhligheach airson `<{ $source }>`: chan urrainnear caochladair staid air a bheil "{ $property }" a lorg air `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Feumaidh caochladairean `<odeSystem>` a bhith eadar-dhealaichte bhon chaochladair neo-eisimeileach.

ode-system-duplicate-variable-names = Chan urrainnear foincseanan RHS ODE a mhìneachadh le ainmean caochladairean eisimeileach dùbailte.

ode-system-rhs-function-error = Chan urrainnear foincsean RHS ODE a mhìneachadh.  Mearachd a' cruthachadh foincsean mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Chan urrainnear ceàrn eadar { $count } loidhnichean a mhìneachadh

angle-invalid-through-point = Puing mhì-dhligheach ann an through de `<angle>`

parabola-vertex-too-many-points = Cha deach parabola le beàrn tro chòrr air aon phuing a chur an gnìomh.

parabola-too-many-points = Cha deach parabola tro chòrr air 3 puingean a chur an gnìomh.

intersection-too-many-items = Cha deach eadar-ghearradh airson còrr air dà nì a chur an gnìomh

## Other math components

ionic-compound-not-two-ions = Cha deach todhar ianach a chur an gnìomh ach airson dà ian.

ionic-compound-needs-cation-and-anion = Cha deach todhar ianach a chur an gnìomh ach airson aon chatian agus aon anian.

solve-equations-cannot-evaluate = Chan urrainnear an co-aontar fhuasgladh on nach b' urrainnear a luachadh: { $equation }

math-operators-operand-number-required = Feumar operandNumber a shònrachadh nuair a thathar a' toirt a-mach oibreachaidh matamataigich.

eigen-decomposition-failed = Cha b' urrainnear luachan dualach a' mhaitreis àireamhachadh

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: chan eil am paramadair { $parameters } a' nochdadh sa phàtran, agus mar sin freagraidh e beàrn an-còmhnaidh.
       *[other] `<matchesPattern>`: chan eil na paramadairean { $parameters } a' nochdadh sa phàtran, agus mar sin freagraidh iad beàrn an-còmhnaidh.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: chan urrainnear grid="{ $grid }" a mhìneachadh. Feumaidh e bhith na none, medium, dense, no dà àireamh dhearbh air an sgaradh le beàrn, mar grid="1 0.5". Cha tèid griod a tharraing.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: chan eil taic ri xLabelPosition="left" san reandaraiche prefigure; a' cleachdadh giùlan an t-suidheachaidh dheis.

prefigure-y-label-position-unsupported = `<graph>`: chan eil taic ri yLabelPosition="bottom" san reandaraiche prefigure; a' cleachdadh giùlan an t-suidheachaidh uachdaraich.

prefigure-invalid-axis-bounds = `<graph>`: crìochan aiseil mì-dhligheach airson tionndadh prefigure; a' cleachdadh bbox bunaiteach (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: leud mì-dhligheach airson tionndadh prefigure; a' cleachdadh leud bunaiteach dhealbh 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio mì-dhligheach airson tionndadh prefigure; a' cleachdadh a' chomharra-cumaidh bhunaitich 1.

prefigure-grid-spacing-too-fine = `<graph>`: tha beàrnadh a' ghriod ro mhìn airson crìochan na h-aise; fàgar an griod a-mach san reandaraiche prefigure.

prefigure-annotations-not-rendered = `<graph>`: cha tèid nòtaichean a reandaradh mur eil an reandaraiche PreFigure ga chleachdadh.

multiple-annotations-children = Chaidh iomadh leanabh `<annotations>` a lorg ann an `<graph>`; thathar a' leigeil seachad a h-uile gin ach an tè mu dheireadh.

## Referring to other components

copy-unrecognized-component-type = Chan urrainnear seòrsa co-phàirt neo-aithnichte a leudachadh no a lethbhreacadh: { $type }.

copy-prop-not-found = Cha b' urrainnear am prop { $property } a lorg air co-phàirt den t-seòrsa { $component }

collect-no-source = Cha deach tùs a lorg airson collect.

collect-invalid-component-type = Chan urrainnear co-phàirtean den t-seòrsa `<{ $component }>` a chruinneachadh on as e seòrsa co-phàirt mì-dhligheach a th' ann.

reference-index-unavailable = Chan urrainnear iomradh a thoirt air a' chlàr-amas `{ $reference }`

## `<callAction>`

component-action-unavailable = Chan urrainnear { $action } a ghairm air a' cho-phàirt `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Tha cumadh mì-dhligheach aig an dàta.  Tha faidean neo-chunbhalach aig na sreathan. Air a lorg ann an componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Tha ainmean cuilbh dhùbailte san dàta.  Air a lorg ann an componentIdx :{ $componentIdx }

data-frame-missing-column-name = Tha ainm cuilbh a dhìth san dàta.  Air a lorg ann an componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Tha duais airson na freagairt seo stèidhichte air an fhreagairt a chuir an taga answer fhèin, rud a bheir giùlan ris nach eilear an dùil.

answer-max-num-attempts-in-section-wide-check-work = Chan eil buaidh sam bith aig `maxNumAttempts` air `<answer>` taobh a-staigh soithich le `sectionWideCheckWork`, on as e an soitheach a stiùireas àireamh nan oidhirpean. Suidhich `maxNumAttempts` air an t-soitheach na àite.

nested-section-wide-check-work-max-num-attempts = Chan eil buaidh sam bith aig `maxNumAttempts` air soitheach le `sectionWideCheckWork` a tha taobh a-staigh soithich eile le `sectionWideCheckWork`, on as e an soitheach a-muigh a stiùireas àireamh nan oidhirpean. Suidhich `maxNumAttempts` air an t-soitheach a-muigh na àite.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Cha bhi buaidh sam bith aig a' bhuadh { $attributes } gun symbolicEquality air a shuidheachadh.
       *[other] Cha bhi buaidh sam bith aig na buadhan { $attributes } gun symbolicEquality air a shuidheachadh.
    }

answer-invalid-type = Seòrsa mì-dhligheach airson na freagairt: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = On nach eil ainm air a' cho-phàirt `<{ $component }>`, chan urrainnear a chleachdadh mar bhuadh mhodail

module-attribute-name-already-defined = Chan urrainnear a' cho-phàirt `<{ $component } name="{ $name }">` a chleachdadh mar bhuadh airson modail on a tha buadh "{ $name }" mìnichte mar-thà aig an t-seòrsa co-phàirt `<module>`.

conditional-content-condition-ignored = Thathar a' leigeil seachad na buaidh `condition` air co-phàirt `<conditionalContent>` aig a bheil clann case no else.

slider-markers-type-mismatch = Chan eil seòrsa nan comharran a' freagairt ri seòrsa an t-sleamhnachain.

pretzel-problem-needs-statement-and-answer = Pretzel mì-dhligheach: feumaidh aon `<statement>` agus aon `<answer>` a bhith anns gach `<problem>`.

pretzel-circuit-first-problem-distractor = Pretzel mì-dhligheach: ann am mode="circuit", chan fhaod a' chiad `<problem>` a bhith na bhuaireadair.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Luach mì-dhligheach { $values } airson na buaidh `{ $attribute }`; ga leigeil seachad.
       *[other] Luachan mì-dhligheach { $values } airson na buaidh `{ $attribute }`; gan leigeil seachad.
    }

attribute-must-be-references = Luach mì-dhligheach `{ $value }` airson na buaidh `{ $attribute }`. Feumaidh a' bhuadh a bhith air a dèanamh de dh'iomraidhean a thòisicheas le `$`.

math-input-invalid-function-names = <mathInput>: chaidh ainm(ean) foincsein mì-dhligheach a leigeil seachad ann an { $attribute }: { $names }. Feumaidh co-dhiù 2 charactar (litrichean no tàthanan) a bhith ann an earrann taisbeanaidh gach ainm; faodaidh iar-leasachan roghainneil `|<mathspeak alternative>` a leantainn.

## Building components from the source

component-type-invalid = Seòrsa co-phàirt mì-dhligheach: `<{ $componentType }>`

attribute-repeated = Chan urrainnear a' bhuadh { $attribute } ath-aithris.

attribute-invalid-for-component = Buadh mhì-dhligheach "{ $attribute }" airson co-phàirt den t-seòrsa `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Chan eil iomsgaradh gu leòr aig mìneachadh stoidhle { $styleNumber } airson { $context ->
        [text-on-background] dath an teacsa an aghaidh dath a' chùlaibh
        [high-contrast] an dath àrd-iomsgaraidh an aghaidh a' chanabhais
        [line] dath na loidhne an aghaidh a' chanabhais
        [marker] dath a' chomharra an aghaidh a' chanabhais
       *[text-on-canvas] dath an teacsa an aghaidh a' chanabhais
    }{ $mode ->
        [dark] { " (modh dorcha)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; feumar { $threshold }:1 air a' char as lugha).

style-definition-dark-mode-text-background-contrast =
    Ged a tha dathan sònraichte aig mìneachadh stoidhle { $styleNumber } a bheir iomsgaradh gu leòr sa mhodh shoilleir, chan eil iomsgaradh gu leòr aig dathan a' mhodha dhuirch a thig asta eadar dath an teacsa agus dath a' chùlaibh ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; feumar { $threshold }:1 air a' char as lugha). { $suggestion ->
        [available] Gus iomsgaradh gu leòr a dhèanamh cinnteach sa mhodh dhorcha, meudaich iomsgaradh a' mhodha shoilleir (m.e. suidhich { $lightAttribute }="{ $lightColor }") no cuir thairis air dath a' mhodha dhuirch (m.e. suidhich { $darkAttribute }="{ $darkColor }").
       *[none] Gus iomsgaradh gu leòr a dhèanamh cinnteach sa mhodh dhorcha, meudaich iomsgaradh a' mhodha shoilleir no cuir thairis air na dathan a thig asta le textColorDarkMode agus/no backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ged a tha dath teacsa sònraichte aig mìneachadh stoidhle { $styleNumber } a bheir iomsgaradh gu leòr sa mhodh shoilleir, chan eil iomsgaradh gu leòr aig dath teacsa a' mhodha dhuirch a thig às an aghaidh a' chanabhais ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; feumar { $threshold }:1 air a' char as lugha). { $suggestion ->
        [available] Gus iomsgaradh gu leòr a dhèanamh cinnteach sa mhodh dhorcha, meudaich iomsgaradh a' mhodha shoilleir (m.e. suidhich textColor="{ $lightColor }") no cuir thairis air dath a' mhodha dhuirch (m.e. suidhich textColorDarkMode="{ $darkColor }").
       *[none] Gus iomsgaradh gu leòr a dhèanamh cinnteach sa mhodh dhorcha, meudaich iomsgaradh a' mhodha shoilleir no cuir thairis air an dath a thig às le textColorDarkMode.
    }

section-multiple-style-palettes = Chan urrainn do dh'earrann ach aon <stylePalette> a thaghadh; a' cleachdadh na tè mu dheireadh.

## Unique variants

variant-num-to-select-not-non-negative-integer = chan urrainnear tionndaidhean sònraichte de { $component } a dhearbhadh on nach e slànuimhir neo-àicheil a th' ann an numToSelect.

variant-num-to-select-not-constant-number = chan urrainnear tionndaidhean sònraichte de { $component } a dhearbhadh on nach e àireamh sheasmhach a th' ann an numToSelect.

variant-with-replacement-not-constant-boolean = chan urrainnear tionndaidhean sònraichte de { $component } a dhearbhadh on nach e Boole seasmhach a th' ann an withReplacement.

variant-select-weight-disables-unique = Thathar a' cur à comas tionndaidhean sònraichte airson select ma tha roghainn ann le selectWeight no selectForVariants air a shònrachadh

variant-coprime-undetermined = chan urrainnear tionndaidhean sònraichte de { $component } a dhearbhadh on nach urrainnear dearbhadh gu bheil coprime breugach an-còmhnaidh.

variant-attribute-not-constant = chan urrainnear tionndaidhean sònraichte de { $component } a dhearbhadh on nach e seasmhach a th' ann an { $attribute }.

variant-attribute-not-number = chan urrainnear tionndaidhean sònraichte de { $component } a dhearbhadh on nach e àireamh a th' ann an { $attribute }.

variant-attribute-wrong-type-for-sequence =
    chan urrainnear tionndaidhean sònraichte de { $component } den t-seòrsa { $type } a dhearbhadh on nach e { $expected ->
        [letters-combination] co-mheasgachadh litrichean
        [math-expression] abairt mhatamataigeach dhligheach
        [integer] slànuimhir
       *[number] àireamh
    } a th' ann an { $attribute }.

variant-length-not-integer = chan urrainnear tionndaidhean sònraichte de { $component } a dhearbhadh on nach e slànuimhir a th' ann an length.

variant-sort-not-implemented = cha deach tionndaidhean sònraichte de { $component } le sort a chur an gnìomh

variant-exclude-combinations-not-implemented = cha deach tionndaidhean sònraichte de { $component } le excludeCombinations a chur an gnìomh

variant-math-exclude-not-implemented = cha deach tionndaidhean sònraichte de { $component } den t-seòrsa math le exclude a chur an gnìomh

variant-non-constant-exclude-not-implemented = cha deach tionndaidhean sònraichte de { $component } le exclude neo-sheasmhach a chur an gnìomh

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: chan eil taic ris san reandaraiche prefigure airson a' ghraf; leumadh thairis air an t-sliochdaire.

prefigure-descendant-invalid-geometry = { $subject }: geoimeatras neo-chrìochnach no neo-choileanta; leumadh thairis air an t-sliochdaire.

prefigure-curve-label-omitted = { $subject }: chan eil taic ri leubailean air eileamaidean lùib air an tionndadh; dh'fhàgadh an leubail a-mach.

prefigure-curve-unsupported-definition-type = { $subject }: seòrsa mìneachaidh foincsein lùib gun taic '{ $definitionType }'; leumadh thairis air an t-sliochdaire.

prefigure-region-flip-functions-unsupported = { $subject }: chan eil taic ris a' bhuadh flipFunctions air regionBetweenCurves; leumadh thairis air an t-sliochdaire.

prefigure-region-non-formula-child = { $subject }: chan eil taic ach ri leanabh-fhoincseanan den t-seòrsa formula air regionBetweenCurves; leumadh thairis air an t-sliochdaire.

prefigure-label-position-unsupported =
    { $subject }: labelPosition gun taic '{ $labelPosition }' airson { $labelKind ->
        [line-family] leubail de theaghlach nan loidhnichean
       *[point] leubail puinge
    }; chleachdadh co-thaobhadh bunaiteach PreFigure.

prefigure-fill-style-unsupported = { $subject }: chan eil taic aig PreFigure ris an stoidhle lìonaidh '{ $fillStyle }'; a' tilleadh gu lìonadh soladach.

prefigure-line-style-unknown = { $subject }: dh'fhàgadh stoidhle loidhne neo-aithnichte '{ $lineStyle }' a-mach à às-chur PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: chaidh stoidhle a' chomharra '{ $markerStyle }' a mhapadh gu stoidhle PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: chan eil taic aig PreFigure ri stoidhle a' chomharra '{ $markerStyle }'; chleachdadh an stoidhle bhunaiteach.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` mì-dhligheach; chan urrainnear an targaid fhuasgladh. Dh'fhàgadh an nòta a-mach.

annotation-ref-multiple-targets = `<annotation>`: dh'fhuasgail `ref` gu iomadh targaid; a' cleachdadh na ciad tè.

annotation-ref-outside-graph = `<annotation>`: `ref` mì-dhligheach; tha an targaid taobh a-muigh a' ghraf mun cuairt. Dh'fhàgadh an nòta a-mach.

annotation-ref-unsupported-target = `<annotation>`: `ref` mì-dhligheach; chan e nì grafaigeach le taic san tionndadh prefigure a th' anns an targaid. Dh'fhàgadh an nòta a-mach.

annotation-text-missing = `<annotation>`: `text` a dhìth no falamh; a' cur a-mach teacsa falamh.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Chaidh eisimeileachd chuairteach a lorg.
       *[other] Chaidh eisimeileachd chuairteach a lorg a tha a' gabhail a-steach co-phàirt `<{ $componentType }>`.
    }

reference-no-referent = Cha deach adhbhar-iomraidh a lorg airson: `{ $reference }`

reference-multiple-referents = Chaidh iomadh adhbhar-iomraidh a lorg airson: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Fòrmat mì-dhligheach airson na buaidh { $attribute } de `<{ $componentType }>`.

children-invalid = Clann mhì-dhligheach airson `<{ $componentType }>`: Chaidh clann mhì-dhligheach a lorg: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Luach mì-dhligheach `{ $value }` airson na buaidh `{ $attribute }`, a' cleachdadh an luach `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Cha deach tionndadh DoenetML { $version } a lorg.
       *[other] Cha deach tionndadh DoenetML { $version } a lorg. A' tilleadh gu tionndadh { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML mì-dhligheach: { $content }

parse-tag-missing-close-tag = DoenetML mì-dhligheach: Chan eil taga dùnaidh aig an taga `{ $tag }`. Bhathar an dùil ri taga fèin-dhùnaidh no ri taga `</{ $tagName }>`.

parse-tag-error = DoenetML mì-dhligheach: Mearachd san taga `<{ $tagName }>`

parse-attribute-missing-value = DoenetML mì-dhligheach: Tha coltas gu bheil luach a dhìth air a' bhuadh mhì-dhligheach `{ $attribute }`.

parse-attribute-invalid = DoenetML mì-dhligheach: Buadh mhì-dhligheach `{ $attribute }`

parse-attribute-value-invalid = DoenetML mì-dhligheach: Luach buaidh mì-dhligheach `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML mì-dhligheach: Luach buaidh mì-dhligheach `{ $value }`. Chan eil na comharran-labhairt a' freagairt ri chèile. Tha coltas gu bheil `{ $quote }` a dhìth ort

parse-open-tag-name-missing = DoenetML mì-dhligheach: Chaidh taga gun ainm a lorg, m.e. `<`

parse-tag-not-closed = DoenetML mì-dhligheach: Cha deach an taga `{ $tag }` a dhùnadh (tha coltas gu bheil `>` a dhìth).

parse-self-closing-tag-name-missing = DoenetML mì-dhligheach: Chaidh taga gun ainm a lorg `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML mì-dhligheach: Cha deach an taga `{ $tag }` a dhùnadh (tha coltas gu bheil `/>` a dhìth).

parse-tag-invalid-attributes = DoenetML mì-dhligheach: Chan eil an taga `{ $tag }` dligheach. Dh'fhaodadh gu bheil buadhan ceàrr air.

parse-close-tag-name-missing = DoenetML mì-dhligheach: Chaidh taga dùnaidh gun ainm a lorg, m.e. `</`

parse-attribute-value-unquoted = Feumar luachan buaidh a chur eadar comharran-labhairt: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML mì-dhligheach: Chaidh an taga dùnaidh `{ $tag }` a lorg, ach chan eil taga fosglaidh co-fhreagarrach ann

parse-close-tag-mismatched = DoenetML mì-dhligheach: Taga dùnaidh nach freagair. Bhathar an dùil ri `</{ $expected }>`. Chaidh `{ $found }` a lorg

parser-node-unconvertible = Cha b' urrainnear an nòd { $node } a thionndadh gu nòd Dast.

## Names

name-attribute-invalid =
    Ainm buaidh mì-dhligheach name='{ $name }'. { $reason ->
        [characters] Chan fhaod ach litrichean, àireamhan, fo-loidhnichean no tàthanan a bhith ann an ainmean.
       *[start] Feumaidh ainmean tòiseachadh le litir.
    }

component-name-invalid-start = Ainm co-phàirt mì-dhligheach "{ $name }". Feumaidh ainmean tòiseachadh le litir.

## `<answer>` sugar

answer-video-watched-missing-video = Feumaidh buadh video a bhith aig freagairt den t-seòrsa videoWatched

answer-video-watched-video-not-reference = Feumaidh a' bhuadh video air freagairt den t-seòrsa videoWatched a bhith na iomradh

answer-name-not-single-text = Feumaidh aon leanabh teacsa a bhith aig buadh name na freagairt

## Referencing another document

external-doenetml-recursion-limit = Chan urrainnear DoenetML on taobh a-muigh fhaighinn air sgàth cus ìrean ath-chùrsaidh. A bheil iomradh cuairteach ann?

external-doenetml-unavailable = Chan urrainnear DoenetML fhaighinn o { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML mì-dhligheach air fhaighinn o { $attribute }="{ $uri }": cha do fhreagair e ris an t-seòrsa co-phàirt "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Tha a' bhuadh `{ $from }` o fheum; cleachd `{ $to }` na h-àite.
       *[other] [deprecation] Tha a' bhuadh `{ $from }` air `<{ $component }>` o fheum; cleachd `{ $to }` na h-àite.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Tha a' bhuadh `{ $from }` o fheum agus thathar ga leigeil seachad on a chaidh `{ $to }` a shònrachadh cuideachd.
       *[other] [deprecation] Tha a' bhuadh `{ $from }` air `<{ $component }>` o fheum agus thathar ga leigeil seachad on a chaidh `{ $to }` a shònrachadh cuideachd.
    }

deprecated-attribute-ignored = [deprecation] Tha a' bhuadh `{ $attribute }` air `<{ $component }>` o fheum agus thathar ga leigeil seachad.


## Language coverage

pluralize-english-only = Chan urrainn do `<pluralize>` ach Beurla a chur san iolra, agus mar sin fàgar an teacsa aige gun atharrachadh ann an sgrìobhainn a chaidh a sgrìobhadh sa chànan { $locale }. Sgrìobh am foirm iolra gu dìreach, no suidhich e leis a' bhuadh `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Chan e eileamaid Doenet aithnichte a th' anns an eileamaid `<{ $tag }>`.

schema-element-not-allowed-at-root = Chan fhaodar an eileamaid `<{ $tag }>` a chur aig freumh na sgrìobhainn.

schema-element-not-allowed-inside = Chan fhaodar an eileamaid `<{ $tag }>` a chur am broinn `<{ $parent }>`.

schema-attribute-unrecognized = Chan eil buadh air a bheil `{ $attribute }` aig an eileamaid `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Feumaidh a' bhuadh `{ $attribute }` den eileamaid `<{ $tag }>` a bhith na liosta far a bheil gach nì na aon de: { $allowed }
       *[other] Feumaidh a' bhuadh `{ $attribute }` den eileamaid `<{ $tag }>` a bhith na aon de: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ainm tionndaidh mì-dhligheach airson select.  Tha an t-ainm tionndaidh { $variantName } a' nochdadh ann an { $numOptions } roghainnean ach is e { $numToSelect } an àireamh ri thaghadh.

select-variant-name-without-options = Chaidh tionndaidhean a shònrachadh airson select ach cha deach roghainn a shònrachadh airson an ainm tionndaidh a dh'fhaodadh a bhith ann: { $variantName }.

select-variant-name-not-possible = Chan e ainm tionndaidh a dh'fhaodadh a bhith ann a th' anns an ainm tionndaidh { $variantName } a chaidh a shònrachadh airson select.

select-too-few-options = Chan urrainnear { $numToSelect } co-phàirtean a thaghadh à { $numOptions } a-mhàin.

select-from-sequence-too-few-values = Chan urrainnear { $numToSelect } luachan a thaghadh à sreath-leantainn aig a bheil faid { $length }.

select-from-sequence-indices-count-mismatch = Feumaidh àireamh nan clàr-amas a chaidh a shònrachadh airson select freagairt ris an àireamh ri thaghadh

select-from-sequence-indices-not-integers = Feumaidh gach clàr-amas a chaidh a shònrachadh airson select a bhith na shlànuimhir

select-from-sequence-index-excluded = Chaidh clàr-amas de selectfromsequence a shònrachadh a chaidh fhàgail a-mach

select-from-sequence-indices-excluded-combination = Chaidh clàran-amais de selectfromsequence a shònrachadh a bha nan co-mheasgachadh air fhàgail a-mach

select-from-sequence-coprime-not-positive-integers = Chan urrainnear co-mheasgachaidhean co-phrìomhach a thaghadh on nach e slànuimhirean dearbh a thathar a' taghadh.

select-from-sequence-coprime-common-factor = Chan urrainnear àireamhan co-phrìomhach a thaghadh. Tha factar cumanta aig a h-uile luach a dh'fhaodadh a bhith ann. (Feumaidh na luachan sònraichte de "from" no "to" a bhith co-phrìomhach le "step".)

select-from-sequence-coprime-single-number = Chan urrainnear co-mheasgachaidhean co-phrìomhach a thaghadh à aon àireamh nach e 1.

select-from-sequence-excluded-too-many-combinations = Chaidh còrr air 70% de na co-mheasgachaidhean fhàgail a-mach ann an selectFromSequence

select-from-sequence-coprime-none-found = Cha b' urrainnear àireamhan co-phrìomhach a thaghadh. Tha factar cumanta aig a h-uile luach a dh'fhaodadh a bhith ann.

select-from-sequence-too-few-unique-values = Chan urrainnear { $numToSelect } luachan sònraichte a thaghadh à sreath-leantainn aig a bheil faid { $numPossibleValues }

select-prime-numbers-too-few-values = Chan urrainnear { $numToSelect } luachan a thaghadh à liosta phrìomh-àireamhan aig a bheil faid { $numValues }

select-prime-numbers-values-count-mismatch = Feumaidh àireamh nan luachan a chaidh a shònrachadh airson select freagairt ris an àireamh ri thaghadh

select-prime-numbers-values-not-prime = Feumaidh gach luach a chaidh a shònrachadh airson select prime number a bhith air liosta nam prìomh-àireamhan

select-prime-numbers-values-excluded-combination = Bha na luachan a chaidh a shònrachadh airson selectPrimeNumbers nan co-mheasgachadh air fhàgail a-mach

select-prime-numbers-excluded-too-many-combinations = Chaidh còrr air 70% de na co-mheasgachaidhean fhàgail a-mach ann an selectPrimeNumbers

select-random-combination-fluke = Le tuiteamas anabarrach eu-coltach, cha b' urrainnear co-mheasgachadh de luachan tuaireamach a thaghadh

select-random-value-fluke = Le tuiteamas anabarrach eu-coltach, cha b' urrainnear luach tuaireamach a thaghadh
