# Tongan diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# The fakauʻa «ʻ» is U+02BB and the toloi is the macron; see `chrome.ftl`.
# Tongan marks no number on the noun, so a counted message whose only English
# difference is the noun's number renders one string here and the select is
# dropped.


## `<lineSegment>`

# No select: «taʻetokangaʻi» does not agree with what is ignored, and the list
# carries no number of its own.
line-segment-attributes-ignored-with-endpoints = ʻoku taʻetokangaʻi ʻa e { $attributes } ʻi he taimi kuo pau ai ʻa e ngataʻanga ʻe ua

line-segment-attributes-ignored-with-endpoint-and-midpoint = ʻoku taʻetokangaʻi ʻa e { $attributes } ʻi he taimi kuo pau ai ʻa e ngataʻanga ʻe taha mo e lotolotonga

line-segment-midpoint-offset-without-midpoint = ʻoku ʻikai ha ola ʻo e midpointOffset ʻo kapau ʻoku ʻikai ha lotolotonga

## `<line>`

line-points-undetermined-dimensions = Laine ʻoku ʻalu ʻi ha ngaahi poini ʻoku ʻikai ʻiloa honau ngaahi fua.

line-points-too-few-dimensions = Kuo pau ke ʻalu ʻa e laine ʻi ha ngaahi poini ʻoku fua ʻe ua pe lahi ange.

line-points-depend-on-variables = ʻOku ʻalu ʻa e laine ʻi ha ngaahi poini ʻoku fakatuʻunga ki he ngaahi fetongi: { $variables }.

line-equation-invalid-format = Fakafuofua taʻetotonu ki he laine ʻi he fetongi { $variable1 } mo e { $variable2 }.

## `<ray>`

ray-overprescribed-through = ʻOku fakapapauʻi ʻa e huelo ʻe he through, endpoint mo e direction.  ʻOku taʻetokangaʻi ʻa e through kuo fakapapauʻi.

ray-dimension-mismatch = ʻoku ʻikai fetaulaki ʻa e numDimensions ʻi he huelo.

## `<vector>`

vector-overprescribed-head = ʻOku fakapapauʻi ʻa e veketā ʻe he head, tail mo e displacement.  ʻOku taʻetokangaʻi ʻa e head kuo fakapapauʻi.

vector-dimension-mismatch = ʻoku ʻikai fetaulaki ʻa e numDimensions ʻi he veketā.

## Attracting and constraining

attract-to-without-nearest-point = ʻE ʻikai lava ke toho ki ha `<{ $component }>` he ʻoku ʻikai haʻane fetongi tuʻunga nearestPoint.

constrain-to-without-nearest-point = ʻE ʻikai lava ke fakangatangata ki ha `<{ $component }>` he ʻoku ʻikai haʻane fetongi tuʻunga nearestPoint.

constrain-to-interior-without-nearest-point = ʻE ʻikai lava ke fakangatangata ki loto ʻi ha `<{ $component }>` he ʻoku ʻikai haʻane fetongi tuʻunga nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = ʻoku taʻetokangaʻi ʻa e labelPosition ki ha choiceInput ʻoku ʻikai inline

## Ordering children by index

choice-input-indices-count-mismatch = ʻOku taʻetokangaʻi ʻa e ngaahi index ki he choiceInput he ʻoku ʻikai fetaulaki ʻa e lau ʻo e index mo e lau ʻo e ngaahi fili.

pretzel-indices-count-mismatch = ʻOku taʻetokangaʻi ʻa e ngaahi index ki he problem he ʻoku ʻikai fetaulaki ʻa e lau ʻo e index mo e lau ʻo e ngaahi problem.

shuffle-indices-count-mismatch = ʻOku taʻetokangaʻi ʻa e ngaahi index ki he shuffle he ʻoku ʻikai fetaulaki ʻa e lau ʻo e index mo e lau ʻo e ngaahi konga.

indices-ignored-out-of-range = ʻOku taʻetokangaʻi ʻa e ngaahi index ki he { $component } he ʻoku ʻi ai ha index ʻoku ʻalu ʻi tuʻa.

pretzel-indices-repeated = ʻOku taʻetokangaʻi ʻa e ngaahi index ki he pretzel he ʻoku ʻi ai ha index kuo toe fai.

pretzel-circuit-first-index = ʻOku taʻetokangaʻi ʻa e ngaahi index ki he pretzel ʻi he mode circuit he kuo pau ke 1 ʻa e index ʻuluaki.

## `<shuffle>` and `<sort>`

string-children-need-type = Ke ngāue ʻa e `<{ $component }>` mo e ngaahi fānau string, kuo pau ke fakapapauʻi ʻa e ʻatilipiuti `type`.

invalid-type-defaulting-to-math = Ko e type { $type } ʻoku taʻetotonu ki he konga { $component }. Kuo pau ke taha ʻi he math, text, number, pe boolean. ʻOku ngāueʻaki ʻa e math.

string-not-valid-component-to-arrange = Ko e string "{ $value }" ʻoku ʻikai ko ha konga totonu ki he { $component }. ʻOku taʻetokangaʻi.

## Types and variables

invalid-type-defaulting-to-number = Ko e type { $type } ʻoku taʻetotonu, ʻoku fokotuʻu ʻa e type ki he number.

invalid-variable-value = Mahuʻinga taʻetotonu ʻo ha fetongi: `{ $value }`

## Variants

variant-index-must-be-number = Kuo pau ke fika ʻa e index ʻo e kehekehe { $index }

variant-index-must-be-integer = Kuo pau ke fika kakato ʻa e index ʻo e kehekehe { $index }

## `<sideBySide>`

side-by-side-absolute-widths = ʻOku teʻeki fakahoko ʻa e `<{ $component }>` ki he fua fakapapau. ʻOku fokotuʻu ʻa e maokupu ki he fakatatau.

side-by-side-absolute-margins = ʻOku teʻeki fakahoko ʻa e `<{ $component }>` ki he fua fakapapau. ʻOku fokotuʻu ʻa e kapa ki he fakatatau.

side-by-side-no-block-child = Ko e `<{ $component }>` taʻetotonu: kuo pau ke ʻi ai haʻane fānau block ʻe taha.

## `<label>`

label-for-ignored-on-graphical = ʻOku taʻetokangaʻi ʻa e ʻatilipiuti `for` ʻi ha `<label>` fakatātā.

label-for-must-resolve-to-one = Kuo pau ke tuhu ʻa e ʻatilipiuti `for` ʻi he `<label>` ki ha konga pē ʻe taha.

label-for-unresolved = Naʻe ʻikai lava ʻa e ʻatilipiuti `for` ʻi he `<label>` ke tuhu ki ha konga.

label-for-answer-with-authored-inputs = ʻOku tuhu ʻa e ʻatilipiuti `for` ʻi he `<label>` ki ha `<answer>` ʻoku ʻi ai ha input naʻe tohi ʻe he tokotaha fatu; tuhu terus ki he input.

label-for-answer-without-input = ʻOku tuhu ʻa e ʻatilipiuti `for` ʻi he `<label>` ki ha `<answer>` ʻoku ʻikai haʻane input ke fakaʻilongaʻi.

label-for-must-reference-input-or-answer = Kuo pau ke tuhu ʻa e ʻatilipiuti `for` ʻi he `<label>` ki ha input pe ki ha answer.

## Accessibility

accessibility-short-description-or-decorative = Ki he aʻusia, kuo pau ke ʻi ai ha fakamatala nounou ʻa e `<{ $component }>` pe ke fakapapauʻi ko e teuteu.

accessibility-video-short-description = Ki he aʻusia, kuo pau ke ʻi ai ha fakamatala nounou ʻa e `<video>`.

accessibility-input-short-description-or-label = Ki he aʻusia, kuo pau ke ʻi ai ha fakamatala nounou pe fakaʻilonga ʻa e `<{ $component }>`.

accessibility-answer-input-short-description-or-label = Ki he aʻusia, kuo pau ke ʻi ai ha fakamatala nounou pe fakaʻilonga ʻa ha `<answer>` ʻoku ne fakatupu ha input.

accessibility-short-description-contains-math = ʻOku ʻikai totonu ke ʻi ai ha konga fika hangē ko e `<{ $component }>` ʻi ha fakamatala nounou. Tohi ʻa e fika ʻaki ʻa e ngaahi lea.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] ʻOku ʻikai feʻunga ʻa e faikehekehe ʻo e { $colorName } ki he tohi ʻo e kaveinga vahe (mode fakapoʻuli) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ʻoku fiemaʻu ʻa e { $threshold }:1 pe lahi ange).
       *[other] ʻOku ʻikai feʻunga ʻa e faikehekehe ʻo e { $colorName } ki he tohi ʻo e kaveinga vahe ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ʻoku fiemaʻu ʻa e { $threshold }:1 pe lahi ange).
    }

## `<circle>`

circle-through-points-non-numerical = ʻOku teʻeki fakahoko ʻa e `<circle>` ʻoku ʻalu ʻi he poini ʻe { $count } ʻo kapau ʻoku ʻikai ha mahuʻinga fika ʻa e ngaahi poini.

circle-too-many-through-points = ʻE ʻikai lava ke fika ha fuopotopoto ʻoku ʻalu ʻi ha poini lahi hake ʻi he 3.

circle-overprescribed-radius-center-points = ʻE ʻikai lava ke fika ha fuopotopoto ʻoku fakapapauʻi hono lahi, hono loto mo e ngaahi poini ʻoku ʻalu ai.

circle-center-with-multiple-points = ʻE ʻikai lava ke fika ha fuopotopoto ʻoku fakapapauʻi hono loto ka ʻoku ʻalu ʻi ha poini lahi hake ʻi he 1.

circle-radius-too-small = ʻE ʻikai lava ke fika ʻa e fuopotopoto: koeʻuhi ko e mamaʻo ʻo e poini ʻe ua ko e { $distance }, ʻoku siʻi fau ʻa e lahi { $radius } kuo fakapapauʻi.

circle-radius-with-many-points = ʻE ʻikai lava ke fakatupu ha fuopotopoto ʻoku ʻalu ʻi ha poini lahi hake ʻi he ua mo ha lahi kuo fakapapauʻi.

circle-invalid-center-or-through-points = ʻOku taʻetotonu ʻa e loto pe ko e ngaahi poini ʻoku ʻalu ai ʻa e fuopotopoto.

circle-radius-center-with-multiple-points = ʻE ʻikai lava ke fika ʻa e lahi ʻo ha fuopotopoto ʻoku fakapapauʻi hono loto ka ʻoku ʻalu ʻi ha poini lahi hake ʻi he 1.

circle-change-radius-non-numerical = ʻE ʻikai lava ke liliu ʻa e lahi ʻo ha fuopotopoto ʻoku ʻalu ʻi ha ngaahi poini taʻefika

circle-radius-with-points-non-numerical = ʻE ʻikai lava ke fakatupu ha fuopotopoto ʻoku ʻalu ʻi ha poini lahi hake ʻi he taha mo ha lahi kuo fakapapauʻi ʻo kapau ʻoku ʻikai ha mahuʻinga fika.

circle-change-center-non-numerical = ʻOku teʻeki fakahoko ʻa e liliu ʻo e loto ʻo ha fuopotopoto ʻoku ʻalu ʻi ha ngaahi poini ʻoku ʻikai haʻanau mahuʻinga fika.

## `<function>`

# English's two counts multiply out to four sentences; Tongan has one, because
# «vahaʻa» and «input» do not change for number. Both selects are dropped and
# both counts still arrive.
function-domain-insufficient-dimensions = ʻOku ʻikai feʻunga ʻa e fua ʻo e domain ki he ngāue fika. ʻOku ʻi he domain ʻa e vahaʻa ʻe { $intervals } ka ʻoku ʻi he ngāue fika ʻa e input ʻe { $inputs }.

function-domain-invalid-format = Fakafuofua taʻetotonu ʻo e domain ki he ngāue fika.

function-ignoring-non-numerical =
    { $type ->
        [maximum] ʻOku taʻetokangaʻi ʻa e lahi taha taʻefika ʻo e ngāue fika.
        [minimum] ʻOku taʻetokangaʻi ʻa e siʻi taha taʻefika ʻo e ngāue fika.
        [extremum] ʻOku taʻetokangaʻi ʻa e ngataʻanga taʻefika ʻo e ngāue fika.
        [point] ʻOku taʻetokangaʻi ʻa e poini taʻefika ʻo e ngāue fika.
        [slope] ʻOku taʻetokangaʻi ʻa e hekeheke taʻefika ʻo e ngāue fika.
       *[other] ʻOku taʻetokangaʻi ʻa e { $type } taʻefika ʻo e ngāue fika.
    }

function-ignoring-empty =
    { $type ->
        [maximum] ʻOku taʻetokangaʻi ʻa e lahi taha maha ʻo e ngāue fika.
        [minimum] ʻOku taʻetokangaʻi ʻa e siʻi taha maha ʻo e ngāue fika.
        [extremum] ʻOku taʻetokangaʻi ʻa e ngataʻanga maha ʻo e ngāue fika.
        [point] ʻOku taʻetokangaʻi ʻa e poini maha ʻo e ngāue fika.
       *[other] ʻOku taʻetokangaʻi ʻa e { $type } maha ʻo e ngāue fika.
    }

function-points-too-close = ʻOku ʻi he ngāue fika ha poini ʻe ua ʻoku ofi fau. ʻE ʻikai lava ke fakamatalaʻi ʻa e ngāue fika.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = ʻE lava pē ʻa e toe fai ʻo e ngāue fika ʻo kapau ʻoku tatau ʻa e lau ʻo e input mo e lau ʻo e output. ʻOku ʻi he ngāue fika ko ʻeni ʻa e input ʻe { $inputs } mo e output ʻe { $outputs }.

## `<sequence>`

sequence-invalid-length = Loloa taʻetotonu ʻo e sequence.  Kuo pau ke fika kakato taʻefakafuofua siʻi hifo ʻi he noa.

sequence-invalid-step = step taʻetotonu ʻo e sequence.  Kuo pau ke fika ki ha sequence type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" taʻetotonu ʻo ha sequence fika.  Kuo pau ke fika.

sequence-invalid-endpoint-letters = "{ $attribute }" taʻetotonu ʻo ha sequence mataʻitohi.  Kuo pau ke ko ha fakataha mataʻitohi.

sequence-invalid-endpoint = "{ $attribute }" taʻetotonu ʻo e sequence.

select-from-sequence-coprime-not-numbers = ʻoku taʻetokangaʻi ʻa e coprime he ʻoku ʻikai ko ha fika ʻoku fili

select-from-sequence-coprime-with-exclude-combinations = ʻoku taʻetokangaʻi ʻa e coprime he kuo fakapapauʻi ʻa e excludeCombinations

## Resolving a `target`

target-not-found = target taʻetotonu ki he `<{ $source }>`: ʻoku ʻikai maʻu ʻa e target.

target-state-variable-not-found = target taʻetotonu ki he `<{ $source }>`: ʻoku ʻikai maʻu ha fetongi tuʻunga ko hono hingoa "{ $property }" ʻi ha `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Kuo pau ke kehe ʻa e ngaahi fetongi ʻo e `<odeSystem>` mei he fetongi tauʻatāina.

ode-system-duplicate-variable-names = ʻE ʻikai lava ke fakamatalaʻi ʻa e ngaahi ngāue RHS ʻo e ODE ʻoku tatau honau hingoa fetongi.

ode-system-rhs-function-error = ʻE ʻikai lava ke fakamatalaʻi ʻa e ngāue RHS ʻo e ODE.  Naʻe hala ʻa e fakatupu ʻo e ngāue mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = ʻE ʻikai lava ke fakamatalaʻi ha tuliki ʻi he vahaʻa ʻo e laine ʻe { $count }

angle-invalid-through-point = Poini taʻetotonu ʻi he through ʻo e `<angle>`

parabola-vertex-too-many-points = ʻOku teʻeki fakahoko ʻa e palapola ʻoku ʻi ai hono tumutumu ka ʻoku ʻalu ʻi ha poini lahi hake ʻi he 1.

parabola-too-many-points = ʻOku teʻeki fakahoko ʻa e palapola ʻoku ʻalu ʻi ha poini lahi hake ʻi he 3.

intersection-too-many-items = ʻOku teʻeki fakahoko ʻa e fetaulakiʻanga ki ha meʻa lahi hake ʻi he ua

## Other math components

ionic-compound-not-two-ions = ʻOku teʻeki fakahoko ʻa e fefiofi ʻaioniki ki ha meʻa kehe mei he ʻaione ʻe ua.

ionic-compound-needs-cation-and-anion = Naʻe fakahoko pē ʻa e fefiofi ʻaioniki ki ha katione ʻe taha mo ha ʻanione ʻe taha.

solve-equations-cannot-evaluate = ʻE ʻikai lava ke solova ʻa e fakafuofua he naʻe ʻikai lava ke sivi: { $equation }

math-operators-operand-number-required = Kuo pau ke fakapapauʻi ʻa e operandNumber ʻi he taimi ʻoku toʻo ai ha operand fika.

eigen-decomposition-failed = Naʻe ʻikai lava ke fika ʻa e eigenvalue ʻo e matiliki

## `<matchesPattern>`

# No select: the parameter list carries no number that the noun would show.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: ʻoku ʻikai hā ʻa e parameter { $parameters } ʻi he pattern, ko ia ʻe fetaulaki maʻu pē ia mo ha maha.

## `<graph>`

graph-grid-invalid = `<graph>`: ʻoku ʻikai mahino ʻa e grid="{ $grid }". Kuo pau ke none, medium, dense, pe ko ha fika lelei ʻe ua kuo vaheʻi ʻaki ha vā, hangē ko e grid="1 0.5". ʻOku ʻikai ha grid ʻoku tā.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: ʻoku ʻikai poupouʻi ʻa e xLabelPosition="left" ʻi he renderer prefigure; ʻoku ngāueʻaki ʻa e tuʻunga ʻo e potu toʻomataʻu.

prefigure-y-label-position-unsupported = `<graph>`: ʻoku ʻikai poupouʻi ʻa e yLabelPosition="bottom" ʻi he renderer prefigure; ʻoku ngāueʻaki ʻa e tuʻunga ʻo e potu ʻi ʻolunga.

prefigure-invalid-axis-bounds = `<graph>`: ngataʻanga taʻetotonu ʻo e ʻakisi ki he liliu prefigure; ʻoku ngāueʻaki ʻa e bbox angamaheni (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: maokupu taʻetotonu ki he liliu prefigure; ʻoku ngāueʻaki ʻa e maokupu angamaheni 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio taʻetotonu ki he liliu prefigure; ʻoku ngāueʻaki ʻa e aspect ratio angamaheni 1.

prefigure-grid-spacing-too-fine = `<graph>`: ʻoku ofi fau ʻa e vā ʻo e grid ki he ngataʻanga ʻo e ʻakisi; ʻoku ʻikai tā ʻa e grid ʻi he renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: ʻe ʻikai tā ʻa e annotation ʻo kapau ʻoku ʻikai ngāueʻaki ʻa e renderer PreFigure.

multiple-annotations-children = Naʻe maʻu ha fānau `<annotations>` lahi ʻi he `<graph>`; ʻoku taʻetokangaʻi kotoa tuku kehe ʻa e ki mui taha.

## Referring to other components

copy-unrecognized-component-type = ʻE ʻikai lava ke fakalahi pe hiki ha faʻahinga konga ʻoku ʻikai ʻiloa: { $type }.

copy-prop-not-found = Naʻe ʻikai maʻu ʻa e prop { $property } ʻi ha konga faʻahinga { $component }

collect-no-source = Naʻe ʻikai maʻu ha source ki he collect.

collect-invalid-component-type = ʻE ʻikai lava ke tānaki ʻa e ngaahi konga faʻahinga `<{ $component }>` he ʻoku taʻetotonu ʻa e faʻahinga konga.

reference-index-unavailable = ʻE ʻikai lava ke fakasino ki he index `{ $reference }`

## `<callAction>`

component-action-unavailable = ʻE ʻikai lava ke ui ʻa e { $action } ʻi he konga `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ʻOku taʻetotonu ʻa e anga ʻo e ngaahi fakamatala.  ʻOku ʻikai tatau ʻa e loloa ʻo e ngaahi laine. Naʻe maʻu ʻi he componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = ʻOku ʻi he fakamatala ha hingoa kolomu tatau.  Naʻe maʻu ʻi he componentIdx :{ $componentIdx }

data-frame-missing-column-name = ʻOku ʻikai ha hingoa ʻo ha kolomu ʻi he fakamatala.  Naʻe maʻu ʻi he componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = ʻOku fakatuʻunga ʻa e award ʻo e tali ni ki he tali ʻa e answer tag tonu, pea ʻe iku ia ki ha ʻulungaanga taʻeʻamanekina.

answer-max-num-attempts-in-section-wide-check-work = ʻOku ʻikai ha ola ʻo hono fokotuʻu ʻo e `maxNumAttempts` ʻi ha `<answer>` ʻoku ʻi loto ʻi ha kato ʻoku ʻi ai ʻa e `sectionWideCheckWork`, he ko e kato ia ʻoku ne puleʻi ʻa e lau ʻo e feinga. Fokotuʻu ʻa e `maxNumAttempts` ʻi he kato.

nested-section-wide-check-work-max-num-attempts = ʻOku ʻikai ha ola ʻo hono fokotuʻu ʻo e `maxNumAttempts` ʻi ha kato ʻoku ʻi ai ʻa e `sectionWideCheckWork` pea ʻoku ʻi loto ia ʻi ha kato kehe ʻoku ʻi ai ʻa e `sectionWideCheckWork`, he ko e kato ʻi tuʻa ia ʻoku ne puleʻi ʻa e lau ʻo e feinga. Fokotuʻu ʻa e `maxNumAttempts` ʻi he kato ʻi tuʻa.

# No select: «ʻatilipiuti» is the same word for one and for many.
answer-attributes-need-symbolic-equality = ʻE ʻikai ha ola ʻo e ʻatilipiuti { $attributes } ʻo kapau ʻoku ʻikai fokotuʻu ʻa e symbolicEquality.

answer-invalid-type = Faʻahinga taʻetotonu ki he tali: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Koeʻuhi ʻoku ʻikai ha hingoa ʻo e konga `<{ $component }>`, ʻe ʻikai lava ke ngāueʻaki ia ki ha ʻatilipiuti ʻo e module

module-attribute-name-already-defined = ʻE ʻikai lava ke ngāueʻaki ʻa e konga `<{ $component } name="{ $name }">` ko ha ʻatilipiuti ʻo e module he ʻoku ʻi he faʻahinga konga `<module>` ʻa e ʻatilipiuti "{ $name }" ʻi ai.

conditional-content-condition-ignored = ʻOku taʻetokangaʻi ʻa e ʻatilipiuti `condition` ʻi ha konga `<conditionalContent>` ʻoku ʻi ai ha fānau case pe else.

slider-markers-type-mismatch = ʻOku ʻikai fetaulaki ʻa e faʻahinga ʻo e marker mo e faʻahinga ʻo e slider.

pretzel-problem-needs-statement-and-answer = Pretzel taʻetotonu: kuo pau ke ʻi he `<problem>` taki taha ha `<statement>` ʻe taha mo ha `<answer>` ʻe taha.

pretzel-circuit-first-problem-distractor = Pretzel taʻetotonu: ʻi he mode="circuit", ʻe ʻikai lava ke distractor ʻa e `<problem>` ʻuluaki.

## Attribute values

# No select: «mahuʻinga» is the same word for one and for many.
attribute-invalid-values = Mahuʻinga taʻetotonu { $values } ki he ʻatilipiuti `{ $attribute }`; ʻoku taʻetokangaʻi.

attribute-must-be-references = Mahuʻinga taʻetotonu `{ $value }` ki he ʻatilipiuti `{ $attribute }`. Kuo pau ke fakatupu ʻa e ʻatilipiuti mei ha ngaahi fakasino ʻoku kamata ʻaki ha `$`.

math-input-invalid-function-names = <mathInput>: naʻe taʻetokangaʻi ʻa e hingoa ngāue fika taʻetotonu ʻi he { $attribute }: { $names }. Kuo pau ke ʻi ai ha mataʻitohi ʻe 2 pe lahi ange ʻi he hingoa taki taha (mataʻitohi pe kohi); ʻe lava ke muimui ha suffix `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Faʻahinga konga taʻetotonu: `<{ $componentType }>`

attribute-repeated = ʻE ʻikai lava ke toe fai ʻa e ʻatilipiuti { $attribute }.

attribute-invalid-for-component = ʻAtilipiuti taʻetotonu "{ $attribute }" ki ha konga faʻahinga `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    ʻOku ʻikai feʻunga ʻa e faikehekehe ʻo e sitaila { $styleNumber } ki he { $context ->
        [text-on-background] lanu ʻo e tohi ki he lanu ʻo e tuʻunga
        [high-contrast] lanu faikehekehe māʻolunga ki he kanivasi
        [line] lanu ʻo e laine ki he kanivasi
        [marker] lanu ʻo e marker ki he kanivasi
       *[text-on-canvas] lanu ʻo e tohi ki he kanivasi
    }{ $mode ->
        [dark] { " (mode fakapoʻuli)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ʻoku fiemaʻu ʻa e { $threshold }:1 pe lahi ange).

style-definition-dark-mode-text-background-contrast =
    Neongo ʻoku ʻi he sitaila { $styleNumber } ha ngaahi lanu kuo fakapapauʻi mo feʻunga honau faikehekehe ki he mode maama, ʻoku ʻikai feʻunga ʻa e faikehekehe ʻo e lanu ʻo e tohi ki he lanu ʻo e tuʻunga ʻi he ngaahi lanu naʻe toʻo ki he mode fakapoʻuli ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ʻoku fiemaʻu ʻa e { $threshold }:1 pe lahi ange). { $suggestion ->
        [available] Ke feʻunga ʻa e faikehekehe ʻi he mode fakapoʻuli, fakalahi ʻa e faikehekehe ʻo e mode maama (hangē, fokotuʻu ʻa e { $lightAttribute }="{ $lightColor }") pe fetongi ʻa e lanu ʻo e mode fakapoʻuli (hangē, fokotuʻu ʻa e { $darkAttribute }="{ $darkColor }").
       *[none] Ke feʻunga ʻa e faikehekehe ʻi he mode fakapoʻuli, fakalahi ʻa e faikehekehe ʻo e mode maama pe fetongi ʻa e ngaahi lanu naʻe toʻo ʻaki ʻa e textColorDarkMode mo/pe ko e backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Neongo ʻoku ʻi he sitaila { $styleNumber } ha lanu tohi kuo fakapapauʻi mo feʻunga hono faikehekehe ki he mode maama, ʻoku ʻikai feʻunga ʻa e faikehekehe ʻo e lanu tohi naʻe toʻo ki he mode fakapoʻuli ki he kanivasi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ʻoku fiemaʻu ʻa e { $threshold }:1 pe lahi ange). { $suggestion ->
        [available] Ke feʻunga ʻa e faikehekehe ʻi he mode fakapoʻuli, fakalahi ʻa e faikehekehe ʻo e mode maama (hangē, fokotuʻu ʻa e textColor="{ $lightColor }") pe fetongi ʻa e lanu ʻo e mode fakapoʻuli (hangē, fokotuʻu ʻa e textColorDarkMode="{ $darkColor }").
       *[none] Ke feʻunga ʻa e faikehekehe ʻi he mode fakapoʻuli, fakalahi ʻa e faikehekehe ʻo e mode maama pe fetongi ʻa e lanu naʻe toʻo ʻaki ʻa e textColorDarkMode.
    }

section-multiple-style-palettes = ʻE lava pē ke fili ʻe ha vahe ha <stylePalette> ʻe taha; ʻoku ngāueʻaki ʻa e ki mui taha.

## Unique variants

variant-num-to-select-not-non-negative-integer = ʻe ʻikai lava ke fakapapauʻi ʻa e ngaahi kehekehe taha pē ʻo e { $component } he ʻoku ʻikai ko ha fika kakato taʻesiʻi hifo ʻi he noa ʻa e numToSelect.

variant-num-to-select-not-constant-number = ʻe ʻikai lava ke fakapapauʻi ʻa e ngaahi kehekehe taha pē ʻo e { $component } he ʻoku ʻikai ko ha fika tuʻumaʻu ʻa e numToSelect.

variant-with-replacement-not-constant-boolean = ʻe ʻikai lava ke fakapapauʻi ʻa e ngaahi kehekehe taha pē ʻo e { $component } he ʻoku ʻikai ko ha boolean tuʻumaʻu ʻa e withReplacement.

variant-select-weight-disables-unique = ʻOku taʻofi ʻa e ngaahi kehekehe taha pē ki he select ʻo kapau ʻoku ʻi ai ha fili kuo fakapapauʻi ʻa e selectWeight pe selectForVariants

variant-coprime-undetermined = ʻe ʻikai lava ke fakapapauʻi ʻa e ngaahi kehekehe taha pē ʻo e { $component } he ʻoku ʻikai lava ke fakapapauʻi ʻoku false maʻu pē ʻa e coprime.

variant-attribute-not-constant = ʻe ʻikai lava ke fakapapauʻi ʻa e ngaahi kehekehe taha pē ʻo e { $component } he ʻoku ʻikai tuʻumaʻu ʻa e { $attribute }.

variant-attribute-not-number = ʻe ʻikai lava ke fakapapauʻi ʻa e ngaahi kehekehe taha pē ʻo e { $component } he ʻoku ʻikai ko ha fika ʻa e { $attribute }.

variant-attribute-wrong-type-for-sequence =
    ʻe ʻikai lava ke fakapapauʻi ʻa e ngaahi kehekehe taha pē ʻo e { $component } faʻahinga { $type } he ʻoku ʻikai ko ha { $expected ->
        [letters-combination] fakataha mataʻitohi
        [math-expression] fakamatala fika totonu
        [integer] fika kakato
       *[number] fika
    } ʻa e { $attribute }.

variant-length-not-integer = ʻe ʻikai lava ke fakapapauʻi ʻa e ngaahi kehekehe taha pē ʻo e { $component } he ʻoku ʻikai ko ha fika kakato ʻa e length.

variant-sort-not-implemented = ʻoku teʻeki fakahoko ʻa e ngaahi kehekehe taha pē ʻo ha { $component } ʻoku ʻi ai ha sort

variant-exclude-combinations-not-implemented = ʻoku teʻeki fakahoko ʻa e ngaahi kehekehe taha pē ʻo ha { $component } ʻoku ʻi ai ha excludeCombinations

variant-math-exclude-not-implemented = ʻoku teʻeki fakahoko ʻa e ngaahi kehekehe taha pē ʻo ha { $component } faʻahinga math ʻoku ʻi ai ha exclude

variant-non-constant-exclude-not-implemented = ʻoku teʻeki fakahoko ʻa e ngaahi kehekehe taha pē ʻo ha { $component } ʻoku ʻi ai ha exclude taʻetuʻumaʻu

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ʻoku ʻikai poupouʻi ʻi he renderer prefigure ʻo e graph; naʻe fakalaka ʻa e hako.

prefigure-descendant-invalid-geometry = { $subject }: ʻoku taʻengata pe taʻekakato ʻa e sino fua; naʻe fakalaka ʻa e hako.

prefigure-curve-label-omitted = { $subject }: ʻoku ʻikai poupouʻi ʻa e fakaʻilonga ʻi he ngaahi pikopiko kuo liliu; naʻe taʻetokangaʻi ʻa e fakaʻilonga.

prefigure-curve-unsupported-definition-type = { $subject }: faʻahinga fakamatala pikopiko '{ $definitionType }' ʻoku ʻikai poupouʻi; naʻe fakalaka ʻa e hako.

prefigure-region-flip-functions-unsupported = { $subject }: ʻoku ʻikai poupouʻi ʻa e ʻatilipiuti flipFunctions ʻi he regionBetweenCurves; naʻe fakalaka ʻa e hako.

prefigure-region-non-formula-child = { $subject }: ko e fānau ngāue fika faʻahinga formula pē ʻoku poupouʻi ʻi he regionBetweenCurves; naʻe fakalaka ʻa e hako.

prefigure-label-position-unsupported =
    { $subject }: ʻoku ʻikai poupouʻi ʻa e labelPosition '{ $labelPosition }' ki he { $labelKind ->
        [line-family] fakaʻilonga ʻo e fāmili laine
       *[point] fakaʻilonga ʻo e poini
    }; ʻoku ngāueʻaki ʻa e fakahangatonu angamaheni ʻa PreFigure.

prefigure-fill-style-unsupported = { $subject }: ʻoku ʻikai poupouʻi ʻe PreFigure ʻa e sitaila fonu '{ $fillStyle }'; ʻoku foki ki he fonu kakato.

prefigure-line-style-unknown = { $subject }: sitaila laine '{ $lineStyle }' ʻoku ʻikai ʻiloa, naʻe taʻetokangaʻi mei he output ʻa PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: naʻe fakafehokotaki ʻa e sitaila marker '{ $markerStyle }' ki he sitaila 'diamond' ʻa PreFigure.

prefigure-marker-style-unsupported = { $subject }: ʻoku ʻikai poupouʻi ʻe PreFigure ʻa e sitaila marker '{ $markerStyle }'; ʻoku ngāueʻaki ʻa e sitaila angamaheni.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` taʻetotonu; ʻe ʻikai lava ke tuhu ki he target. Naʻe taʻetokangaʻi ʻa e annotation.

annotation-ref-multiple-targets = `<annotation>`: naʻe tuhu ʻa e `ref` ki ha target lahi; ʻoku ngāueʻaki ʻa e target ʻuluaki.

annotation-ref-outside-graph = `<annotation>`: `ref` taʻetotonu; ʻoku ʻi tuʻa ʻa e target mei he graph ʻoku ne maʻu ia. Naʻe taʻetokangaʻi ʻa e annotation.

annotation-ref-unsupported-target = `<annotation>`: `ref` taʻetotonu; ʻoku ʻikai ko ha meʻa fakatātā ʻoku poupouʻi ʻa e target ʻi he liliu prefigure. Naʻe taʻetokangaʻi ʻa e annotation.

annotation-text-missing = `<annotation>`: ʻoku ʻikai pe maha ʻa e `text`; ʻoku ʻoatu ha tohi maha.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Naʻe maʻu ha fakatuʻunga takatakai.
       *[other] Naʻe maʻu ha fakatuʻunga takatakai ʻoku kau ki ai ʻa e konga `<{ $componentType }>`.
    }

reference-no-referent = Naʻe ʻikai maʻu ha meʻa ʻoku tuhu ki ai ʻa e fakasino: `{ $reference }`

reference-multiple-referents = Naʻe maʻu ha meʻa lahi ʻoku tuhu ki ai ʻa e fakasino: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Fakafuofua taʻetotonu ʻo e ʻatilipiuti { $attribute } ʻo e `<{ $componentType }>`.

children-invalid = Fānau taʻetotonu ʻo e `<{ $componentType }>`: naʻe maʻu ha fānau taʻetotonu: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Mahuʻinga taʻetotonu `{ $value }` ki he ʻatilipiuti `{ $attribute }`, ʻoku ngāueʻaki ʻa e mahuʻinga `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Naʻe ʻikai maʻu ʻa e fatu DoenetML { $version }.
       *[other] Naʻe ʻikai maʻu ʻa e fatu DoenetML { $version }. ʻOku foki ki he fatu { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML taʻetotonu: { $content }

parse-tag-missing-close-tag = DoenetML taʻetotonu: ʻOku ʻikai ha tag tāpuni ʻo e tag `{ $tag }`. Naʻe ʻamanekina ha tag ʻoku ne tāpuni ia pe ko ha tag `</{ $tagName }>`.

parse-tag-error = DoenetML taʻetotonu: Naʻe ʻi ai ha hala ʻi he tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML taʻetotonu: ʻOku hangē ʻoku ʻikai ha mahuʻinga ʻo e ʻatilipiuti taʻetotonu `{ $attribute }`.

parse-attribute-invalid = DoenetML taʻetotonu: ʻAtilipiuti taʻetotonu `{ $attribute }`

parse-attribute-value-invalid = DoenetML taʻetotonu: Mahuʻinga ʻatilipiuti taʻetotonu `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML taʻetotonu: Mahuʻinga ʻatilipiuti taʻetotonu `{ $value }`. ʻOku ʻikai fetaulaki ʻa e fakaʻilonga lea. ʻOku hangē ʻoku ʻikai ha `{ $quote }`

parse-open-tag-name-missing = DoenetML taʻetotonu: Naʻe maʻu ha tag ʻoku ʻikai hano hingoa, hangē ko e `<`

parse-tag-not-closed = DoenetML taʻetotonu: Naʻe ʻikai tāpuni ʻa e tag `{ $tag }` (ʻoku hangē ʻoku ʻikai ha `>`).

parse-self-closing-tag-name-missing = DoenetML taʻetotonu: Naʻe maʻu ha tag ʻoku ʻikai hano hingoa `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML taʻetotonu: Naʻe ʻikai tāpuni ʻa e tag `{ $tag }` (ʻoku hangē ʻoku ʻikai ha `/>`).

parse-tag-invalid-attributes = DoenetML taʻetotonu: ʻOku taʻetotonu ʻa e tag `{ $tag }`. Mahalo ʻoku hala hono ngaahi ʻatilipiuti.

parse-close-tag-name-missing = DoenetML taʻetotonu: Naʻe maʻu ha tag tāpuni ʻoku ʻikai hano hingoa, hangē ko e `</`

parse-attribute-value-unquoted = Kuo pau ke tuku ʻa e mahuʻinga ʻo e ʻatilipiuti ʻi loto ʻi he fakaʻilonga lea: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML taʻetotonu: Naʻe maʻu ha tag tāpuni `{ $tag }`, ka ʻoku ʻikai hano tag fakaava fetaulaki

parse-close-tag-mismatched = DoenetML taʻetotonu: ʻOku ʻikai fetaulaki ʻa e tag tāpuni. Naʻe ʻamanekina ʻa e `</{ $expected }>`. Naʻe maʻu ʻa e `{ $found }`

parser-node-unconvertible = Naʻe ʻikai lava ke liliu ʻa e node { $node } ki ha node Dast.

## Names

name-attribute-invalid =
    ʻAtilipiuti taʻetotonu name='{ $name }'. { $reason ->
        [characters] ʻE lava pē ke ʻi he hingoa ha mataʻitohi, fika, kohi ʻi lalo pe kohi.
       *[start] Kuo pau ke kamata ʻa e hingoa ʻaki ha mataʻitohi.
    }

component-name-invalid-start = Hingoa konga taʻetotonu "{ $name }". Kuo pau ke kamata ʻa e hingoa ʻaki ha mataʻitohi.

## `<answer>` sugar

answer-video-watched-missing-video = Kuo pau ke ʻi ai ha ʻatilipiuti video ʻa e answer ʻoku type videoWatched

answer-video-watched-video-not-reference = Kuo pau ke ko ha fakasino ʻa e ʻatilipiuti video ʻo e answer ʻoku type videoWatched

answer-name-not-single-text = Kuo pau ke ʻi ai ha fānau text pē ʻe taha ʻa e ʻatilipiuti name ʻo e answer

## Referencing another document

external-doenetml-recursion-limit = Naʻe ʻikai lava ke toʻo ʻa e DoenetML mei tuʻa koeʻuhi ko e lahi fau ʻo e ngaahi tuʻunga toe fai. ʻOku ʻi ai ha fakasino takatakai?

external-doenetml-unavailable = Naʻe ʻikai lava ke toʻo ʻa e DoenetML mei he { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML taʻetotonu naʻe toʻo mei he { $attribute }="{ $uri }": naʻe ʻikai fetaulaki mo e faʻahinga konga "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ʻOku ʻikai toe ngāueʻaki ʻa e ʻatilipiuti `{ $from }`; ngāueʻaki ʻa e `{ $to }`.
       *[other] [deprecation] ʻOku ʻikai toe ngāueʻaki ʻa e ʻatilipiuti `{ $from }` ʻi he `<{ $component }>`; ngāueʻaki ʻa e `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] ʻOku ʻikai toe ngāueʻaki ʻa e ʻatilipiuti `{ $from }` pea ʻoku taʻetokangaʻi he kuo fakapapauʻi foki mo e `{ $to }`.
       *[other] [deprecation] ʻOku ʻikai toe ngāueʻaki ʻa e ʻatilipiuti `{ $from }` ʻi he `<{ $component }>` pea ʻoku taʻetokangaʻi he kuo fakapapauʻi foki mo e `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] ʻOku ʻikai toe ngāueʻaki ʻa e ʻatilipiuti `{ $attribute }` ʻi he `<{ $component }>` pea ʻoku taʻetokangaʻi.

deprecated-attribute-to-child = [deprecation] ʻOku ʻikai toe ngāueʻaki ʻa e ʻatilipiuti `{ $attribute }` ʻi he `<{ $component }>`; ngāueʻaki ha fānau `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] ʻOku ʻikai toe ngāueʻaki ʻa e mahuʻinga `{ $value }` ʻo e ʻatilipiuti `{ $attribute }` ʻi he `<{ $component }>`; ngāueʻaki ʻa e `{ $to }`.


## Language coverage

pluralize-english-only = ʻOku lava pē ʻe he `<pluralize>` ke fakalahi ʻa e lea faka-Pilitānia, ko ia ʻoku ʻikai liliu hono tohi ʻi ha pepa kuo tohi ʻi he { $locale }. Tohi tonu ʻa e foʻi lea lahi, pe fokotuʻu ia ʻaki ʻa e ʻatilipiuti `pluralForm`.


## Checking against the schema

schema-element-unrecognized = ʻOku ʻikai ko ha elemēniti Doenet ʻoku ʻiloa ʻa e `<{ $tag }>`.

schema-element-not-allowed-at-root = ʻOku ʻikai fakangofua ʻa e elemēniti `<{ $tag }>` ʻi he tefito ʻo e pepa.

schema-element-not-allowed-inside = ʻOku ʻikai fakangofua ʻa e elemēniti `<{ $tag }>` ʻi loto ʻi he `<{ $parent }>`.

schema-attribute-unrecognized = ʻOku ʻikai ha ʻatilipiuti ko hono hingoa `{ $attribute }` ʻa e elemēniti `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Kuo pau ke ko ha lisi ʻa e ʻatilipiuti `{ $attribute }` ʻo e elemēniti `<{ $tag }>` ʻa ia ko hono meʻa taki taha ko e taha ʻi he: { $allowed }
       *[other] Kuo pau ke taha ʻi he ngaahi meʻa ni ʻa e ʻatilipiuti `{ $attribute }` ʻo e elemēniti `<{ $tag }>`: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Hingoa kehekehe taʻetotonu ki he select.  ʻOku hā ʻa e hingoa kehekehe { $variantName } ʻi he fili ʻe { $numOptions } ka ko e lau ke fili ko e { $numToSelect }.

select-variant-name-without-options = Kuo fakapapauʻi ha kehekehe ki he select ka ʻoku ʻikai ha fili kuo fakapapauʻi ki he hingoa kehekehe: { $variantName }.

select-variant-name-not-possible = Ko e hingoa kehekehe { $variantName } kuo fakapapauʻi ki he select ʻoku ʻikai ko ha hingoa kehekehe ʻe lava.

select-too-few-options = ʻE ʻikai lava ke fili ha konga ʻe { $numToSelect } mei he { $numOptions } pē.

select-from-sequence-too-few-values = ʻE ʻikai lava ke fili ha mahuʻinga ʻe { $numToSelect } mei ha sequence ko hono loloa ko e { $length }.

select-from-sequence-indices-count-mismatch = Kuo pau ke fetaulaki ʻa e lau ʻo e index kuo fakapapauʻi ki he select mo e lau ke fili

select-from-sequence-indices-not-integers = Kuo pau ke fika kakato ʻa e index kotoa kuo fakapapauʻi ki he select

select-from-sequence-index-excluded = Ko e index ʻo e selectfromsequence kuo fakapapauʻi naʻe fakataʻeʻaongaʻi

select-from-sequence-indices-excluded-combination = Ko e ngaahi index ʻo e selectfromsequence kuo fakapapauʻi ko ha fakataha kuo fakataʻeʻaongaʻi

select-from-sequence-coprime-not-positive-integers = ʻE ʻikai lava ke fili ha fakataha coprime he ʻoku ʻikai ko ha fika kakato lelei ʻoku fili.

select-from-sequence-coprime-common-factor = ʻE ʻikai lava ke fili ha fika coprime. ʻOku ʻi he mahuʻinga kotoa ha faktoa tatau. (Kuo pau ke coprime ʻa e mahuʻinga "from" pe "to" mo e "step".)

select-from-sequence-coprime-single-number = ʻE ʻikai lava ke fili ha fakataha coprime mei ha fika pē ʻe taha ʻoku ʻikai ko e 1.

select-from-sequence-excluded-too-many-combinations = Naʻe fakataʻeʻaongaʻi ʻa e laka hake ʻi he 70% ʻo e ngaahi fakataha ʻi he selectFromSequence

select-from-sequence-coprime-none-found = Naʻe ʻikai lava ke fili ha fika coprime. ʻOku ʻi he mahuʻinga kotoa ha faktoa tatau.

select-from-sequence-too-few-unique-values = ʻE ʻikai lava ke fili ha mahuʻinga makehe ʻe { $numToSelect } mei ha sequence ko hono loloa ko e { $numPossibleValues }

select-prime-numbers-too-few-values = ʻE ʻikai lava ke fili ha mahuʻinga ʻe { $numToSelect } mei ha lisi fika totonu ko hono loloa ko e { $numValues }

select-prime-numbers-values-count-mismatch = Kuo pau ke fetaulaki ʻa e lau ʻo e mahuʻinga kuo fakapapauʻi ki he select mo e lau ke fili

select-prime-numbers-values-not-prime = Kuo pau ke ʻi he lisi fika totonu ʻa e mahuʻinga kotoa kuo fakapapauʻi ki he select prime number

select-prime-numbers-values-excluded-combination = Ko e mahuʻinga ʻo e selectPrimeNumbers kuo fakapapauʻi ko ha fakataha kuo fakataʻeʻaongaʻi

select-prime-numbers-excluded-too-many-combinations = Naʻe fakataʻeʻaongaʻi ʻa e laka hake ʻi he 70% ʻo e ngaahi fakataha ʻi he selectPrimeNumbers

select-random-combination-fluke = Koeʻuhi ko ha monūʻia taʻeʻamanekina ʻaupito, naʻe ʻikai lava ke fili ha fakataha ʻo e mahuʻinga taʻefokotuʻu

select-random-value-fluke = Koeʻuhi ko ha monūʻia taʻeʻamanekina ʻaupito, naʻe ʻikai lava ke fili ha mahuʻinga taʻefokotuʻu
