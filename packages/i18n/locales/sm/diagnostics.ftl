# Samoan diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# A Samoan noun takes no ending for number, so the counted messages here need
# no selection — see the header of `chrome.ftl`.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = E lē amanaʻia { $attributes } pe a uma ona faʻamaoti pito e lua

line-segment-attributes-ignored-with-endpoint-and-midpoint = E lē amanaʻia { $attributes } pe a faʻamaoti faʻatasi le pito ma le poini ogatotonu

line-segment-midpoint-offset-without-midpoint = E leai se aogā o le midpointOffset pe afai e leai se poini ogatotonu

## `<line>`

line-points-undetermined-dimensions = O se laina e ui i poini e lē o iloa o latou fua.

line-points-too-few-dimensions = E tatau ona ui le laina i poini e lua ni ona fua i le itiiti ifo.

line-points-depend-on-variables = E ui le laina i poini e faalagolago i suiga: { $variables }.

line-equation-invalid-format = E lē saʻo le faatulagaga o le faatusa laina i suiga { $variable1 } ma { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ua faamaoti le aū e ala i le through, endpoint ma le direction. E lē amanaʻia le through na faamaoti.

ray-dimension-mismatch = E lē fetaui le numDimensions i le aū.

## `<vector>`

vector-overprescribed-head = Ua faamaoti le veta e ala i le head, tail ma le displacement. E lē amanaʻia le head na faamaoti.

vector-dimension-mismatch = E lē fetaui le numDimensions i le veta.

## Attracting and constraining

attract-to-without-nearest-point = E lē mafai ona tosina i le `<{ $component }>` ona e leai sana suiga tulaga nearestPoint.

constrain-to-without-nearest-point = E lē mafai ona faatapulaa i le `<{ $component }>` ona e leai sana suiga tulaga nearestPoint.

constrain-to-interior-without-nearest-point = E lē mafai ona faatapulaa i totonu o le `<{ $component }>` ona e leai sana suiga tulaga nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = E lē amanaʻia le labelPosition mo se choiceInput e lē o inline

## Ordering children by index

choice-input-indices-count-mismatch = E lē amanaʻia indices na faamaoti mo le choiceInput ona e lē fetaui le aofaʻi o indices ma le aofaʻi o fanau choice.

pretzel-indices-count-mismatch = E lē amanaʻia indices na faamaoti mo le problem ona e lē fetaui le aofaʻi o indices ma le aofaʻi o fanau problem.

shuffle-indices-count-mismatch = E lē amanaʻia indices na faamaoti mo le shuffle ona e lē fetaui le aofaʻi o indices ma le aofaʻi o vaega.

indices-ignored-out-of-range = E lē amanaʻia indices na faamaoti mo le { $component } ona o loʻo iai nisi indices i fafo atu o le tapulaʻa.

pretzel-indices-repeated = E lē amanaʻia indices na faamaoti mo le pretzel ona o loʻo toe faia nisi indices.

pretzel-circuit-first-index = E lē amanaʻia indices na faamaoti mo le pretzel i le mode circuit ona e tatau ona 1 le index muamua.

## `<shuffle>` and `<sort>`

string-children-need-type = Ina ia galue le `<{ $component }>` ma fanau o ni upu, e tatau ona faamaoti le uiga `type`.

invalid-type-defaulting-to-math = E lē saʻo le type { $type } mo le vaega { $component }. E tatau ona avea ma math, text, number pe boolean. O le a faʻaaogā le math.

string-not-valid-component-to-arrange = O le upu "{ $value }" e lē o se vaega saʻo mo le { $component }. E lē amanaʻia.

## Types and variables

invalid-type-defaulting-to-number = E lē saʻo le type { $type }, o le a faatulaga le type i le number.

invalid-variable-value = E lē saʻo le tau o se suiga: `{ $value }`

## Variants

variant-index-must-be-number = E tatau ona avea le index variant { $index } ma numera

variant-index-must-be-integer = E tatau ona avea le index variant { $index } ma numera atoa

## `<sideBySide>`

side-by-side-absolute-widths = E leʻi faia le `<{ $component }>` mo fuataga tumau. O le a faatulaga le lautele i le faatusatusa.

side-by-side-absolute-margins = E leʻi faia le `<{ $component }>` mo fuataga tumau. O le a faatulaga tuaoi i le faatusatusa.

side-by-side-no-block-child = E lē saʻo le `<{ $component }>`: e tatau ona iai se tamaititi poloka e tasi i le itiiti ifo.

## `<label>`

label-for-ignored-on-graphical = E lē amanaʻia le uiga `for` i luga o se `<label>` ata.

label-for-must-resolve-to-one = E tatau i le uiga `for` i luga o le `<label>` ona faasino i se vaega e tasi.

label-for-unresolved = E leʻi mafai e le uiga `for` i luga o le `<label>` ona faasino i se vaega.

label-for-answer-with-authored-inputs = O loʻo faasino le uiga `for` i luga o le `<label>` i se `<answer>` e iai ni faaofiga na tusia e le tusitala; faasino saʻo i le faaofiga.

label-for-answer-without-input = O loʻo faasino le uiga `for` i luga o le `<label>` i se `<answer>` e leai sana faaofiga e faaigoa.

label-for-must-reference-input-or-answer = E tatau i le uiga `for` i luga o le `<label>` ona faasino i se faaofiga poʻo se answer.

## Accessibility

accessibility-short-description-or-decorative = Mo avanoa faigofie, e tatau i le `<{ $component }>` ona iai se faamatalaga puupuu pe faamaoti o se teuteuga.

accessibility-video-short-description = Mo avanoa faigofie, e tatau i le `<video>` ona iai se faamatalaga puupuu.

accessibility-input-short-description-or-label = Mo avanoa faigofie, e tatau i le `<{ $component }>` ona iai se faamatalaga puupuu poʻo se igoa.

accessibility-answer-input-short-description-or-label = Mo avanoa faigofie, e tatau i se `<answer>` e faia se faaofiga ona iai se faamatalaga puupuu poʻo se igoa.

accessibility-short-description-contains-math = E lē tatau i faamatalaga puupuu ona iai ni vaega matematika e pei o le `<{ $component }>`. Tusi le matematika i upu.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] E lē lava le eseesega o le { $colorName } mo le tusitusiga o le ulutala vaega (mode pogisa) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e manaʻomia le { $threshold }:1 i le itiiti ifo).
       *[other] E lē lava le eseesega o le { $colorName } mo le tusitusiga o le ulutala vaega ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e manaʻomia le { $threshold }:1 i le itiiti ifo).
    }

## `<circle>`

circle-through-points-non-numerical = E leʻi faia le `<circle>` e ui i poini e { $count } pe a leai ni tau numera o poini.

circle-too-many-through-points = E lē mafai ona fuafua se liʻo e ui i poini e sili atu i le 3.

circle-overprescribed-radius-center-points = E lē mafai ona fuafua se liʻo pe a faamaoti le radius, le ogatotonu ma poini.

circle-center-with-multiple-points = E lē mafai ona fuafua se liʻo ma le ogatotonu faamaoti e ui i poini e sili atu i le 1.

circle-radius-too-small = E lē mafai ona fuafua le liʻo: talu ai o le mamao i le va o poini e lua o le { $distance }, ua laʻitiiti tele le radius { $radius } na faamaoti.

circle-radius-with-many-points = E lē mafai ona fai se liʻo e ui i poini e sili atu i le lua ma se radius faamaoti.

circle-invalid-center-or-through-points = E lē saʻo le ogatotonu poʻo poini e ui ai le liʻo.

circle-radius-center-with-multiple-points = E lē mafai ona fuafua le radius o se liʻo ma le ogatotonu faamaoti e ui i poini e sili atu i le 1.

circle-change-radius-non-numerical = E lē mafai ona sui le radius o se liʻo e lē o ni numera ona poini

circle-radius-with-points-non-numerical = E lē mafai ona fai se liʻo e ui i poini e sili atu i le tasi ma se radius faamaoti pe a leai ni tau numera.

circle-change-center-non-numerical = E leʻi faia le suiga o le ogatotonu o se liʻo e ui i poini e lē o ni numera.

## `<function>`

function-domain-insufficient-dimensions = E lē lava fua o le domain mo le galuega. E { $intervals } vaitaimi o le domain ae e { $inputs } faaofiga o le galuega.

function-domain-invalid-format = E lē saʻo le faatulagaga o le domain mo le galuega.

function-ignoring-non-numerical =
    { $type ->
        [maximum] E lē amanaʻia le maualuga e lē o se numera o le galuega.
        [minimum] E lē amanaʻia le maualalo e lē o se numera o le galuega.
        [extremum] E lē amanaʻia le tulaga pito e lē o se numera o le galuega.
        [point] E lē amanaʻia le poini e lē o se numera o le galuega.
        [slope] E lē amanaʻia le faasitepu e lē o se numera o le galuega.
       *[other] E lē amanaʻia le { $type } e lē o se numera o le galuega.
    }

function-ignoring-empty =
    { $type ->
        [maximum] E lē amanaʻia le maualuga gaogao o le galuega.
        [minimum] E lē amanaʻia le maualalo gaogao o le galuega.
        [extremum] E lē amanaʻia le tulaga pito gaogao o le galuega.
        [point] E lē amanaʻia le poini gaogao o le galuega.
       *[other] E lē amanaʻia le { $type } gaogao o le galuega.
    }

function-points-too-close = E iai ni poini se lua o le galuega e latalata tele. E lē mafai ona faamaoti le galuega.

function-iterates-input-output-mismatch = E mafai ona toe faia le galuega pe afai e tutusa le aofaʻi o faaofiga ma le aofaʻi o faaiuga. O lenei galuega e { $inputs } faaofiga ma { $outputs } faaiuga.

## `<sequence>`

sequence-invalid-length = E lē saʻo le umi o le faasologa. E tatau ona avea ma numera atoa e lē tau leaga.

sequence-invalid-step = E lē saʻo le laasaga o le faasologa. E tatau ona avea ma numera mo se faasologa ituaiga { $type }.

sequence-invalid-endpoint-number = E lē saʻo le "{ $attribute }" o le faasologa numera. E tatau ona avea ma numera.

sequence-invalid-endpoint-letters = E lē saʻo le "{ $attribute }" o le faasologa mataitusi. E tatau ona avea ma tuufaatasiga o mataitusi.

sequence-invalid-endpoint = E lē saʻo le "{ $attribute }" o le faasologa.

select-from-sequence-coprime-not-numbers = E lē amanaʻia le coprime ona e lē o filifilia ni numera

select-from-sequence-coprime-with-exclude-combinations = E lē amanaʻia le coprime ona ua faamaoti le excludeCombinations

## Resolving a `target`

target-not-found = E lē saʻo le target mo le `<{ $source }>`: e lē maua le target.

target-state-variable-not-found = E lē saʻo le target mo le `<{ $source }>`: e lē maua se suiga tulaga e igoa "{ $property }" i luga o le `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = E tatau i suiga o le `<odeSystem>` ona ese mai le suiga tutoatasi.

ode-system-duplicate-variable-names = E lē mafai ona faamaoti galuega itu taumatau o le ODE ma igoa suiga faalagolago e tutusa.

ode-system-rhs-function-error = E lē mafai ona faamaoti le galuega itu taumatau o le ODE. Sa iai se mea sesē i le faia o le galuega mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = E lē mafai ona faamaoti se tulimanu i le va o laina e { $count }

angle-invalid-through-point = E lē saʻo se poini i le through o le `<angle>`

parabola-vertex-too-many-points = E leʻi faia se parapola ma se tumutumu e ui i poini e sili atu i le 1.

parabola-too-many-points = E leʻi faia se parapola e ui i poini e sili atu i le 3.

intersection-too-many-items = E leʻi faia le fetaulaiga mo mea e sili atu i le lua

## Other math components

ionic-compound-not-two-ions = E leʻi faia le tuufaatasiga ionika mo se isi mea e ese mai i le lua ion.

ionic-compound-needs-cation-and-anion = Na o le tasi le cation ma le tasi le anion e faia ai le tuufaatasiga ionika.

solve-equations-cannot-evaluate = E lē mafai ona foia le faatusa ona e lē mafai ona iloilo: { $equation }

math-operators-operand-number-required = E tatau ona faamaoti se operandNumber pe a aveese se vaega matematika.

eigen-decomposition-failed = E lē mafai ona fuafua tau eigen o le matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: e lē o iai le parameter { $parameters } i le mamanu, o lea o le a fetaui pea ma se avanoa gaogao.

## `<graph>`

graph-grid-invalid = `<graph>`: e lē mafai ona faauigaina le grid="{ $grid }". E tatau ona avea ma none, medium, dense, poʻo ni numera lelei se lua ua tuueseese i se avanoa, e pei o le grid="1 0.5". E leai se mataʻitusi e tusia.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: e lē lagolagoina le xLabelPosition="left" i le renderer prefigure; o le a faaaogā le amio o le tulaga taumatau.

prefigure-y-label-position-unsupported = `<graph>`: e lē lagolagoina le yLabelPosition="bottom" i le renderer prefigure; o le a faaaogā le amio o le tulaga i luga.

prefigure-invalid-axis-bounds = `<graph>`: e lē saʻo tapulaʻa o le axis mo le liua i le prefigure; o le a faaaogā le bbox masani (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: e lē saʻo le lautele mo le liua i le prefigure; o le a faaaogā le lautele masani o le ata 425.

prefigure-invalid-aspect-ratio = `<graph>`: e lē saʻo le aspectRatio mo le liua i le prefigure; o le a faaaogā le fuataga masani 1.

prefigure-grid-spacing-too-fine = `<graph>`: ua vaapiapi tele le va o le mata mo tapulaʻa o le axis; e aveese le mata i le renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: e lē faaalia faamatalaga pe a lē faaaogāina le renderer PreFigure.

multiple-annotations-children = E tele fanau `<annotations>` na maua i totonu o le `<graph>`; e lē amanaʻia uma vagana ai le mea mulimuli.

## Referring to other components

copy-unrecognized-component-type = E lē mafai ona faalautele pe kopi se ituaiga vaega e lē iloa: { $type }.

copy-prop-not-found = E lē maua le prop { $property } i se vaega ituaiga { $component }

collect-no-source = E leai se puna na maua mo le collect.

collect-invalid-component-type = E lē mafai ona aoina vaega ituaiga `<{ $component }>` ona o se ituaiga vaega lē saʻo.

reference-index-unavailable = E lē mafai ona faasino i le index `{ $reference }`

## `<callAction>`

component-action-unavailable = E lē mafai ona valaʻau le { $action } i luga o le vaega `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = E lē saʻo le foliga o faamaumauga. E lē tutusa le umi o laina. Na maua i le componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = E tutusa ni igoa koluma o faamaumauga. Na maua i le componentIdx :{ $componentIdx }

data-frame-missing-column-name = E leai se igoa koluma o faamaumauga. Na maua i le componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = O le award mo lenei tali e faavae i le tali na lafo e le answer lava ia, o le a oo atu ai i se amio e lē faamoemoeina.

answer-max-num-attempts-in-section-wide-check-work = E leai se aogā o le faatulagaina o le `maxNumAttempts` i luga o se `<answer>` i totonu o se pusa e iai le `sectionWideCheckWork`, ona e pulea e le pusa le aofaʻi o taumafaiga. Faatulaga le `maxNumAttempts` i luga o le pusa.

nested-section-wide-check-work-max-num-attempts = E leai se aogā o le faatulagaina o le `maxNumAttempts` i luga o se pusa e iai le `sectionWideCheckWork` o loʻo i totonu o se isi pusa e iai foʻi le `sectionWideCheckWork`, ona e pulea e le pusa i fafo le aofaʻi o taumafaiga. Faatulaga le `maxNumAttempts` i luga o le pusa i fafo.

answer-attributes-need-symbolic-equality = E leai se aogā o le uiga { $attributes } pe a lē faatulagaina le symbolicEquality.

answer-invalid-type = E lē saʻo le ituaiga mo le answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Talu ai e leai se igoa o le vaega `<{ $component }>`, e lē mafai ona faaaogā e fai ma uiga o se module

module-attribute-name-already-defined = E lē mafai ona faaaogā le vaega `<{ $component } name="{ $name }">` e fai ma uiga o se module ona ua iai i le ituaiga `<module>` le uiga "{ $name }".

conditional-content-condition-ignored = E lē amanaʻia le uiga `condition` i luga o se vaega `<conditionalContent>` e iai fanau case pe else.

slider-markers-type-mismatch = E lē fetaui le ituaiga o faailoga ma le ituaiga o le slider.

pretzel-problem-needs-statement-and-answer = E lē saʻo le pretzel: e tatau i `<problem>` taitasi ona iai se `<statement>` e tasi ma se `<answer>` e tasi.

pretzel-circuit-first-problem-distractor = E lē saʻo le pretzel: i le mode="circuit", e lē mafai e le `<problem>` muamua ona avea ma distractor.

## Attribute values

attribute-invalid-values = E lē saʻo le tau { $values } mo le uiga `{ $attribute }`; e lē amanaʻia.

attribute-must-be-references = E lē saʻo le tau `{ $value }` mo le uiga `{ $attribute }`. E tatau ona fausia le uiga i ni faasinomaga e amata i le `$`.

math-input-invalid-function-names = <mathInput>: e lē amanaʻia igoa galuega lē saʻo i totonu o le { $attribute }: { $names }. E tatau i le vaega faaalia o igoa taitasi ona 2 mataitusi i le itiiti ifo (mataitusi pe ni tulaga); e mafai ona sosoo ai le `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = E lē saʻo le ituaiga vaega: `<{ $componentType }>`

attribute-repeated = E lē mafai ona toe faia le uiga { $attribute }.

attribute-invalid-for-component = E lē saʻo le uiga "{ $attribute }" mo se vaega ituaiga `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    E lē lava le eseesega o le faauigaga o le sitaili { $styleNumber } mo le { $context ->
        [text-on-background] lanu o tusitusiga i le lanu o le pito i tua
        [high-contrast] lanu eseese maualuga i le laupapa
        [line] lanu o le laina i le laupapa
        [marker] lanu o le faailoga i le laupapa
       *[text-on-canvas] lanu o tusitusiga i le laupapa
    }{ $mode ->
        [dark] { " (mode pogisa)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e manaʻomia le { $threshold }:1 i le itiiti ifo).

style-definition-dark-mode-text-background-contrast =
    E ui ina ua faamaoti e le faauigaga o le sitaili { $styleNumber } ni lanu e lava le eseesega mo le mode malamalama, ae e lē lava le eseesega o lanu mo le mode pogisa na maua mai i na tau mo le lanu o tusitusiga i le lanu o le pito i tua ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e manaʻomia le { $threshold }:1 i le itiiti ifo). { $suggestion ->
        [available] Ina ia lava le eseesega i le mode pogisa, faateleina le eseesega i le mode malamalama (mo se faataitaiga, faatulaga { $lightAttribute }="{ $lightColor }") pe suia le lanu o le mode pogisa (mo se faataitaiga, faatulaga { $darkAttribute }="{ $darkColor }").
       *[none] Ina ia lava le eseesega i le mode pogisa, faateleina le eseesega i le mode malamalama pe suia lanu na maua mai i le textColorDarkMode ma/poʻo le backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    E ui ina ua faamaoti e le faauigaga o le sitaili { $styleNumber } se lanu tusitusiga e lava le eseesega mo le mode malamalama, ae e lē lava le eseesega o le lanu tusitusiga mo le mode pogisa na maua mai i lena tau i le laupapa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e manaʻomia le { $threshold }:1 i le itiiti ifo). { $suggestion ->
        [available] Ina ia lava le eseesega i le mode pogisa, faateleina le eseesega i le mode malamalama (mo se faataitaiga, faatulaga textColor="{ $lightColor }") pe suia le lanu o le mode pogisa (mo se faataitaiga, faatulaga textColorDarkMode="{ $darkColor }").
       *[none] Ina ia lava le eseesega i le mode pogisa, faateleina le eseesega i le mode malamalama pe suia le lanu na maua mai i le textColorDarkMode.
    }

section-multiple-style-palettes = E na o le tasi le <stylePalette> e mafai e se vaega ona filifilia; o le a faaaogā le mea mulimuli.

## Unique variants

variant-num-to-select-not-non-negative-integer = e lē mafai ona faamaoti variant tulaga ese o le { $component } ona e lē o se numera atoa e lē tau leaga le numToSelect.

variant-num-to-select-not-constant-number = e lē mafai ona faamaoti variant tulaga ese o le { $component } ona e lē o se numera tumau le numToSelect.

variant-with-replacement-not-constant-boolean = e lē mafai ona faamaoti variant tulaga ese o le { $component } ona e lē o se boolean tumau le withReplacement.

variant-select-weight-disables-unique = E tapeina variant tulaga ese mo le select pe afai e iai se option ua faamaoti ai le selectWeight poʻo le selectForVariants

variant-coprime-undetermined = e lē mafai ona faamaoti variant tulaga ese o le { $component } ona e lē mafai ona faamaoti e sesē pea le coprime.

variant-attribute-not-constant = e lē mafai ona faamaoti variant tulaga ese o le { $component } ona e lē tumau le { $attribute }.

variant-attribute-not-number = e lē mafai ona faamaoti variant tulaga ese o le { $component } ona e lē o se numera le { $attribute }.

variant-attribute-wrong-type-for-sequence =
    e lē mafai ona faamaoti variant tulaga ese o le { $component } ituaiga { $type } ona e lē o se { $expected ->
        [letters-combination] tuufaatasiga o mataitusi
        [math-expression] faamatalaga matematika saʻo
        [integer] numera atoa
       *[number] numera
    } le { $attribute }.

variant-length-not-integer = e lē mafai ona faamaoti variant tulaga ese o le { $component } ona e lē o se numera atoa le length.

variant-sort-not-implemented = e leʻi faia variant tulaga ese o se { $component } ma le sort

variant-exclude-combinations-not-implemented = e leʻi faia variant tulaga ese o se { $component } ma le excludeCombinations

variant-math-exclude-not-implemented = e leʻi faia variant tulaga ese o se { $component } ituaiga math ma le exclude

variant-non-constant-exclude-not-implemented = e leʻi faia variant tulaga ese o se { $component } ma se exclude e lē tumau

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: e lē lagolagoina i le renderer prefigure o le graph; ua misia le suli.

prefigure-descendant-invalid-geometry = { $subject }: o se geometry e lē gata pe lē atoatoa; ua misia le suli.

prefigure-curve-label-omitted = { $subject }: e lē lagolagoina igoa i luga o vaega piʻo ua liua; ua aveese le igoa.

prefigure-curve-unsupported-definition-type = { $subject }: e lē lagolagoina le ituaiga faauigaga galuega piʻo '{ $definitionType }'; ua misia le suli.

prefigure-region-flip-functions-unsupported = { $subject }: e lē lagolagoina le uiga flipFunctions i luga o le regionBetweenCurves; ua misia le suli.

prefigure-region-non-formula-child = { $subject }: e na o galuega fanau ituaiga fua faatatau e lagolagoina i luga o le regionBetweenCurves; ua misia le suli.

prefigure-label-position-unsupported =
    { $subject }: e lē lagolagoina le labelPosition '{ $labelPosition }' mo le { $labelKind ->
        [line-family] igoa o le aiga laina
       *[point] igoa poini
    }; o le a faaaogā le faatulagaga masani a PreFigure.

prefigure-fill-style-unsupported = { $subject }: e lē lagolagoina e PreFigure le sitaili faatumu '{ $fillStyle }'; o le a toe foʻi i se faatumu atoa.

prefigure-line-style-unknown = { $subject }: e lē iloa le sitaili laina '{ $lineStyle }', ua aveese mai le faaiuga a PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ua liliu le sitaili faailoga '{ $markerStyle }' i le sitaili 'diamond' a PreFigure.

prefigure-marker-style-unsupported = { $subject }: e lē lagolagoina e PreFigure le sitaili faailoga '{ $markerStyle }'; o le a faaaogā le sitaili masani.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: e lē saʻo le `ref`; e lē maua le target. Ua aveese le faamatalaga.

annotation-ref-multiple-targets = `<annotation>`: ua faasino le `ref` i ni target se tele; o le a faaaogā le target muamua.

annotation-ref-outside-graph = `<annotation>`: e lē saʻo le `ref`; o loʻo i fafo le target o le graph. Ua aveese le faamatalaga.

annotation-ref-unsupported-target = `<annotation>`: e lē saʻo le `ref`; e lē o se mea ata e lagolagoina i le liua i le prefigure le target. Ua aveese le faamatalaga.

annotation-text-missing = `<annotation>`: ua misi pe gaogao le `text`; o le a tuʻuina atu se tusitusiga gaogao.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ua maua se faalagolago taamilo.
       *[other] Ua maua se faalagolago taamilo e aofia ai le vaega `<{ $componentType }>`.
    }

reference-no-referent = E leai se mea na maua e faasino i ai le faasinomaga: `{ $reference }`

reference-multiple-referents = E tele mea na maua e faasino i ai le faasinomaga: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = E lē saʻo le faatulagaga o le uiga { $attribute } o le `<{ $componentType }>`.

children-invalid = E lē saʻo fanau mo le `<{ $componentType }>`: na maua fanau lē saʻo: { $children }

## Falling back to a default

attribute-value-invalid-using-default = E lē saʻo le tau `{ $value }` mo le uiga `{ $attribute }`, o le a faaaogā le tau `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] E lē maua le DoenetML lomiga { $version }.
       *[other] E lē maua le DoenetML lomiga { $version }. O le a toe foʻi i le lomiga { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML lē saʻo: { $content }

parse-tag-missing-close-tag = DoenetML lē saʻo: E leai se tag tapuni o le tag `{ $tag }`. E faamoemoeina se tag e tapuni ia lava pe o se tag `</{ $tagName }>`.

parse-tag-error = DoenetML lē saʻo: E iai se mea sesē i le tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML lē saʻo: E foliga mai ua misi se tau o le uiga lē saʻo `{ $attribute }`.

parse-attribute-invalid = DoenetML lē saʻo: E lē saʻo le uiga `{ $attribute }`

parse-attribute-value-invalid = DoenetML lē saʻo: E lē saʻo le tau o le uiga `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML lē saʻo: E lē saʻo le tau o le uiga `{ $value }`. E lē fetaui faailoga sitaili. E foliga mai ua misi se `{ $quote }`

parse-open-tag-name-missing = DoenetML lē saʻo: Na maua se tag e leai se igoa, mo se faataitaiga `<`

parse-tag-not-closed = DoenetML lē saʻo: E leʻi tapunia le tag `{ $tag }` (e foliga mai ua misi se `>`).

parse-self-closing-tag-name-missing = DoenetML lē saʻo: Na maua se tag e leai se igoa `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML lē saʻo: E leʻi tapunia le tag `{ $tag }` (e foliga mai ua misi se `/>`).

parse-tag-invalid-attributes = DoenetML lē saʻo: E lē saʻo le tag `{ $tag }`. Atonu e sesē ona uiga.

parse-close-tag-name-missing = DoenetML lē saʻo: Na maua se tag tapuni e leai se igoa, mo se faataitaiga `</`

parse-attribute-value-unquoted = E tatau ona faapipiiina tau o uiga i faailoga sitaili: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML lē saʻo: Na maua le tag tapuni `{ $tag }`, ae e leai se tag tatala e fetaui

parse-close-tag-mismatched = DoenetML lē saʻo: E lē fetaui le tag tapuni. Sa faamoemoeina `</{ $expected }>`. Na maua `{ $found }`

parser-node-unconvertible = E lē mafai ona liua le node { $node } i se node Dast.

## Names

name-attribute-invalid =
    E lē saʻo le uiga name='{ $name }'. { $reason ->
        [characters] E na o mataitusi, numera, laina i lalo pe laina puupuu e mafai ona iai i igoa.
       *[start] E tatau ona amata igoa i se mataitusi.
    }

component-name-invalid-start = E lē saʻo le igoa vaega "{ $name }". E tatau ona amata igoa i se mataitusi.

## `<answer>` sugar

answer-video-watched-missing-video = E tatau i se answer ituaiga videoWatched ona iai se uiga video

answer-video-watched-video-not-reference = E tatau i se answer ituaiga videoWatched ona iai se uiga video o se faasinomaga

answer-name-not-single-text = E tatau i le uiga name o le answer ona iai se tamaititi tusitusiga e tasi

## Referencing another document

external-doenetml-recursion-limit = E lē mafai ona aumai le DoenetML mai fafo ona ua tele naua tulaga o le toe faia. Pe iai se faasinomaga taamilo?

external-doenetml-unavailable = E lē mafai ona aumai le DoenetML mai le { $attribute }="{ $uri }"

external-doenetml-type-mismatch = E lē saʻo le DoenetML na aumai mai le { $attribute }="{ $uri }": e lē fetaui ma le ituaiga vaega "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ua lē toe faaaogāina le uiga `{ $from }`; faaaogā le `{ $to }`.
       *[other] [deprecation] Ua lē toe faaaogāina le uiga `{ $from }` i luga o le `<{ $component }>`; faaaogā le `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ua lē toe faaaogāina ma ua lē amanaʻia le uiga `{ $from }` ona ua faamaoti foʻi le `{ $to }`.
       *[other] [deprecation] Ua lē toe faaaogāina ma ua lē amanaʻia le uiga `{ $from }` i luga o le `<{ $component }>` ona ua faamaoti foʻi le `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Ua lē toe faaaogāina ma ua lē amanaʻia le uiga `{ $attribute }` i luga o le `<{ $component }>`.


## Language coverage

pluralize-english-only = E na o le faaPeretania e mafai e `<pluralize>` ona faatele, o lea e tuʻu ai lana tusitusiga e lē suia i se pepa ua tusia i le { $locale }. Tusi saʻo le foliga tele, pe faatulaga i le uiga `pluralForm`.


## Checking against the schema

schema-element-unrecognized = O le element `<{ $tag }>` e lē o se element Doenet e iloa.

schema-element-not-allowed-at-root = E lē faatagaina le element `<{ $tag }>` i le aʻa o le pepa.

schema-element-not-allowed-inside = E lē faatagaina le element `<{ $tag }>` i totonu o le `<{ $parent }>`.

schema-attribute-unrecognized = E leai se uiga e igoa `{ $attribute }` o le element `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] E tatau i le uiga `{ $attribute }` o le element `<{ $tag }>` ona avea ma lisi e tasi o nei mea taitasi ona vaega: { $allowed }
       *[other] E tatau i le uiga `{ $attribute }` o le element `<{ $tag }>` ona avea ma se tasi o: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = E lē saʻo le igoa variant mo le select. O loʻo aliali le igoa variant { $variantName } i option e { $numOptions } ae o le aofaʻi e filifili o le { $numToSelect }.

select-variant-name-without-options = Ua faamaoti nisi variant mo le select ae e leai se option mo le igoa variant e mafai: { $variantName }.

select-variant-name-not-possible = O le igoa variant { $variantName } na faamaoti mo le select e lē o se igoa variant e mafai.

select-too-few-options = E lē mafai ona filifili vaega e { $numToSelect } mai le { $numOptions } na o ia.

select-from-sequence-too-few-values = E lē mafai ona filifili tau e { $numToSelect } mai se faasologa e umi { $length }.

select-from-sequence-indices-count-mismatch = E tatau i le aofaʻi o indices na faamaoti mo le select ona tutusa ma le aofaʻi e filifili

select-from-sequence-indices-not-integers = E tatau i indices uma na faamaoti mo le select ona avea ma numera atoa

select-from-sequence-index-excluded = Ua aveesea le index na faamaoti mo le selectfromsequence

select-from-sequence-indices-excluded-combination = O indices na faamaoti mo le selectfromsequence o se tuufaatasiga na aveesea

select-from-sequence-coprime-not-positive-integers = E lē mafai ona filifili tuufaatasiga coprime ona e lē o filifilia ni numera atoa lelei.

select-from-sequence-coprime-common-factor = E lē mafai ona filifili numera coprime. E iai se vaega masani o tau uma e mafai. (E tatau i tau "from" pe "to" na faamaoti ona coprime ma le "step".)

select-from-sequence-coprime-single-number = E lē mafai ona filifili tuufaatasiga coprime mai se numera e tasi e lē o le 1.

select-from-sequence-excluded-too-many-combinations = Ua sili atu i le 70% o tuufaatasiga na aveesea i le selectFromSequence

select-from-sequence-coprime-none-found = E lē mafai ona filifili numera coprime. E iai se vaega masani o tau uma e mafai.

select-from-sequence-too-few-unique-values = E lē mafai ona filifili tau tulaga ese e { $numToSelect } mai se faasologa e umi { $numPossibleValues }

select-prime-numbers-too-few-values = E lē mafai ona filifili tau e { $numToSelect } mai se lisi o numera muamua e umi { $numValues }

select-prime-numbers-values-count-mismatch = E tatau i le aofaʻi o tau na faamaoti mo le select ona tutusa ma le aofaʻi e filifili

select-prime-numbers-values-not-prime = E tatau i tau uma na faamaoti mo le select numera muamua ona iai i le lisi o numera muamua

select-prime-numbers-values-excluded-combination = O tau na faamaoti mo le selectPrimeNumbers o se tuufaatasiga na aveesea

select-prime-numbers-excluded-too-many-combinations = Ua sili atu i le 70% o tuufaatasiga na aveesea i le selectPrimeNumbers

select-random-combination-fluke = Ona o se mea e seasea tupu, e leʻi mafai ona filifili se tuufaatasiga o tau faafuaseʻi

select-random-value-fluke = Ona o se mea e seasea tupu, e leʻi mafai ona filifili se tau faafuaseʻi
