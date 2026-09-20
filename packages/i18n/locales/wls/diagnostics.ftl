# Wallisian (Fakaʻuvea) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **The endonym is «Fakaʻuvea»**; CLDR has no name for `wls` in any language,
# so the roster's `LOCALE_NAME_FALLBACKS` entry is hand-written. `chrome.ftl`
# carries the whole note, the orthography (ʻokina «ʻ» U+02BB, macrons, **/ŋ/
# written «g»**, plural article «te ʻu») and the table of what this catalog
# takes from `locales/to` and where it parts company with it.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names.
#
# **The contact language is French**, so a loan here is the French-mediated one
# and not `locales/to`'s English-mediated one: «kolone» (colonne), «pasina»
# (page), «vekitele» (vecteur), «palapole» (parabole), «vēsio» (version),
# «matilise» (matrice), «kemikale» (chimique). Each is this seed's coinage by
# the ordinary loan phonology and is owed a check.
#
# **Number.** Wallisian marks no number on the noun beside a numeral, so a
# counted message whose only English difference is the noun's number renders
# **one** string here and the plural select is dropped, as `locales/to` and
# `locales/sm` do. `Intl.PluralRules("wls")` has no CLDR data, so no `[two]`,
# `[few]` or `[many]` branch appears anywhere: nothing could select one. Every
# **symbolic** selector — `$type`, `$mode`, `$reason`, `$context`,
# `$suggestion`, `$alternative`, `$fallback`, `$expected`, `$labelKind`,
# `$isList`, `$componentType` — is kept byte for byte from English, keys
# included: a translated variant key is a branch nothing can reach.
#
# **Known residue.** «aʻusia» for accessibility and «fefiofi» for a compound
# are written in their Tongan shape with ʻUvean spelling, this seed having
# found no distinctly Wallisian word for either; and English's "Please" is
# rendered as a plain imperative throughout, because the Wallisian request
# formula could not be established with enough confidence to put it in front of
# a reader.


## `<lineSegment>`

# No select: «ʻe mole tokagaʻi» does not agree with what is ignored, and the
# list carries no number of its own.
line-segment-attributes-ignored-with-endpoints = ʻe mole tokagaʻi te { $attributes } mokā kua fakapapau te gataʻaga ʻe lua

line-segment-attributes-ignored-with-endpoint-and-midpoint = ʻe mole tokagaʻi te { $attributes } mokā kua fakapapau fakatahi te gataʻaga mo te lotolotoiga

line-segment-midpoint-offset-without-midpoint = ʻe mole he ʻaoga ʻo te midpointOffset kapau ʻe mole he lotolotoiga

## `<line>`

line-points-undetermined-dimensions = Laina ʻe ʻalu ʻi te ʻu togi ʻe mole ʻiloʻi tonatou lahi.

line-points-too-few-dimensions = ʻE tonu ke ʻalu te laina ʻi te ʻu togi ʻe lua ponatou lahi pe lahi age.

line-points-depend-on-variables = ʻE ʻalu te laina ʻi te ʻu togi ʻe fakalogo ki te ʻu fetogi: { $variables }.

line-equation-invalid-format = Fakatuʻutuʻu hala ʻo te fakatatau ʻo te laina ʻi te fetogi { $variable1 } mo te { $variable2 }.

## `<ray>`

ray-overprescribed-through = ʻE fakapapau te huelo e te through, te endpoint mo te direction.  ʻE mole tokagaʻi te through kua fakapapau.

ray-dimension-mismatch = ʻe mole tatau te numDimensions ʻi te huelo.

## `<vector>`

vector-overprescribed-head = ʻE fakapapau te vekitele e te head, te tail mo te displacement.  ʻE mole tokagaʻi te head kua fakapapau.

vector-dimension-mismatch = ʻe mole tatau te numDimensions ʻi te vekitele.

## Attracting and constraining

attract-to-without-nearest-point = ʻE mole lava ke toho ki he `<{ $component }>` he ʻe mole hana fetogi tuʻuga nearestPoint.

constrain-to-without-nearest-point = ʻE mole lava ke fakagatagata ki he `<{ $component }>` he ʻe mole hana fetogi tuʻuga nearestPoint.

constrain-to-interior-without-nearest-point = ʻE mole lava ke fakagatagata ki loto ʻi he `<{ $component }>` he ʻe mole hana fetogi tuʻuga nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = ʻe mole tokagaʻi te labelPosition ki he choiceInput ʻe mole inline

## Ordering children by index

choice-input-indices-count-mismatch = ʻE mole tokagaʻi te ʻu index kua fakapapau ki te choiceInput he ʻe mole tatau te lau ʻo te index mo te lau ʻo te ʻu fānau fili.

pretzel-indices-count-mismatch = ʻE mole tokagaʻi te ʻu index kua fakapapau ki te problem he ʻe mole tatau te lau ʻo te index mo te lau ʻo te ʻu fānau problem.

shuffle-indices-count-mismatch = ʻE mole tokagaʻi te ʻu index kua fakapapau ki te shuffle he ʻe mole tatau te lau ʻo te index mo te lau ʻo te ʻu koga.

indices-ignored-out-of-range = ʻE mole tokagaʻi te ʻu index kua fakapapau ki te { $component } he ʻe ʻi ai te index ʻe ʻalu ki tuʻa.

pretzel-indices-repeated = ʻE mole tokagaʻi te ʻu index kua fakapapau ki te pretzel he ʻe ʻi ai te index kua toe fai.

pretzel-circuit-first-index = ʻE mole tokagaʻi te ʻu index kua fakapapau ki te pretzel ʻi te mode circuit he ʻe tonu ke 1 te index ʻuluaki.

## `<shuffle>` and `<sort>`

string-children-need-type = Ke gāue te `<{ $component }>` mo te ʻu fānau string, ʻe tonu ke fakapapau te ʻatilipiuti `type`.

invalid-type-defaulting-to-math = Ko te type { $type } ʻe hala ki te koga { $component }. ʻE tonu ke tahi ʻi te math, text, number, pe boolean. ʻE gāueʻaki te math.

string-not-valid-component-to-arrange = Ko te string "{ $value }" ʻe mole ko he koga totonu ki te { $component }. ʻE mole tokagaʻi.

## Types and variables

invalid-type-defaulting-to-number = Ko te type { $type } ʻe hala, ʻe fakatuʻu te type ki te number.

invalid-variable-value = Mahuʻiga hala ʻo he fetogi: `{ $value }`

## Variants

variant-index-must-be-number = ʻE tonu ke fika te index ʻo te valiā { $index }

variant-index-must-be-integer = ʻE tonu ke fika kātoa te index ʻo te valiā { $index }

## `<sideBySide>`

side-by-side-absolute-widths = ʻE mole kei fakahoko te `<{ $component }>` ki te fua fakapapau. ʻE fakatuʻu te lahi ki te fua fakatatau.

side-by-side-absolute-margins = ʻE mole kei fakahoko te `<{ $component }>` ki te fua fakapapau. ʻE fakatuʻu te kapa ki te fua fakatatau.

side-by-side-no-block-child = Ko te `<{ $component }>` ʻe hala: ʻe tonu ke ʻi ai hana fānau block e tahi.

## `<label>`

label-for-ignored-on-graphical = ʻE mole tokagaʻi te ʻatilipiuti `for` ʻi he `<label>` ʻi te ata.

label-for-must-resolve-to-one = ʻE tonu ke tuhu te ʻatilipiuti `for` ʻo te `<label>` ki he koga pē e tahi.

label-for-unresolved = Neʻe mole lava e te ʻatilipiuti `for` ʻo te `<label>` ke tuhu ki he koga.

label-for-answer-with-authored-inputs = ʻE tuhu te ʻatilipiuti `for` ʻo te `<label>` ki he `<answer>` ʻe ʻi ai te input neʻe tohi e te tagata fai tohi; tuhu hagatonu ki te input.

label-for-answer-without-input = ʻE tuhu te ʻatilipiuti `for` ʻo te `<label>` ki he `<answer>` ʻe mole hana input ke fakaʻilogaʻi.

label-for-must-reference-input-or-answer = ʻE tonu ke tuhu te ʻatilipiuti `for` ʻo te `<label>` ki he input pe ki he answer.

## Accessibility

accessibility-short-description-or-decorative = Ki te aʻusia, ʻe tonu ke ʻi ai he fakamatala nounou ʻo te `<{ $component }>` pe ke fakapapau ko he teuteu.

accessibility-video-short-description = Ki te aʻusia, ʻe tonu ke ʻi ai he fakamatala nounou ʻo te `<video>`.

accessibility-input-short-description-or-label = Ki te aʻusia, ʻe tonu ke ʻi ai he fakamatala nounou pe he fakaʻiloga ʻo te `<{ $component }>`.

accessibility-answer-input-short-description-or-label = Ki te aʻusia, ʻe tonu ke ʻi ai he fakamatala nounou pe he fakaʻiloga ʻo he `<answer>` ʻe ina fakatupu he input.

accessibility-short-description-contains-math = ʻE mole tonu ke ʻi ai he koga fika ohage ko te `<{ $component }>` ʻi he fakamatala nounou. Tohi te fika ʻaki te ʻu kupu.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] ʻE mole feʻauga te fekehekeheʻaki ʻo te { $colorName } ki te tohi ʻo te kaveiga vahe (mode fakapōʻuli) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ʻe fakaʻamu ki te { $threshold }:1 pe lahi age).
       *[other] ʻE mole feʻauga te fekehekeheʻaki ʻo te { $colorName } ki te tohi ʻo te kaveiga vahe ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ʻe fakaʻamu ki te { $threshold }:1 pe lahi age).
    }

## `<circle>`

circle-through-points-non-numerical = ʻE mole kei fakahoko te `<circle>` ʻe ʻalu ʻi te togi ʻe { $count } kapau ʻe mole he mahuʻiga fika ʻo te ʻu togi.

circle-too-many-through-points = ʻE mole lava ke fika he fuopotopoto ʻe ʻalu ʻi he togi ʻe lahi age ʻi te 3.

circle-overprescribed-radius-center-points = ʻE mole lava ke fika he fuopotopoto ʻe fakapapau tona lahi, tona loto mo te ʻu togi ʻe ʻalu ai.

circle-center-with-multiple-points = ʻE mole lava ke fika he fuopotopoto ʻe fakapapau tona loto kae ʻe ʻalu ʻi he togi ʻe lahi age ʻi te 1.

circle-radius-too-small = ʻE mole lava ke fika te fuopotopoto: he ko te mamaʻo ʻo te togi ʻe lua ko te { $distance }, ʻe veliveli fau te lahi { $radius } kua fakapapau.

circle-radius-with-many-points = ʻE mole lava ke fakatupu he fuopotopoto ʻe ʻalu ʻi he togi ʻe lahi age ʻi te lua mo he lahi kua fakapapau.

circle-invalid-center-or-through-points = ʻE hala te loto pe ko te ʻu togi ʻe ʻalu ai te fuopotopoto.

circle-radius-center-with-multiple-points = ʻE mole lava ke fika te lahi ʻo he fuopotopoto ʻe fakapapau tona loto kae ʻe ʻalu ʻi he togi ʻe lahi age ʻi te 1.

circle-change-radius-non-numerical = ʻE mole lava ke fetogi te lahi ʻo he fuopotopoto ʻe ʻalu ʻi te ʻu togi ʻe mole fika

circle-radius-with-points-non-numerical = ʻE mole lava ke fakatupu he fuopotopoto ʻe ʻalu ʻi he togi ʻe lahi age ʻi te tahi mo he lahi kua fakapapau kapau ʻe mole he mahuʻiga fika.

circle-change-center-non-numerical = ʻE mole kei fakahoko te fetogi ʻo te loto ʻo he fuopotopoto ʻe ʻalu ʻi te ʻu togi ʻe mole honatou mahuʻiga fika.

## `<function>`

# English's two counts multiply out to four sentences; Wallisian has one,
# because «vahaʻa» and «input» do not change for number. Both selects are
# dropped and both counts still arrive.
function-domain-insufficient-dimensions = ʻE mole feʻauga te lahi ʻo te domain ki te gāue fika. ʻE ʻi te domain te vahaʻa ʻe { $intervals } kae ʻe ʻi te gāue fika te input ʻe { $inputs }.

function-domain-invalid-format = Fakatuʻutuʻu hala ʻo te domain ki te gāue fika.

function-ignoring-non-numerical =
    { $type ->
        [maximum] ʻE mole tokagaʻi te lahi taha ʻe mole fika ʻo te gāue fika.
        [minimum] ʻE mole tokagaʻi te veliveli taha ʻe mole fika ʻo te gāue fika.
        [extremum] ʻE mole tokagaʻi te gataʻaga ʻe mole fika ʻo te gāue fika.
        [point] ʻE mole tokagaʻi te togi ʻe mole fika ʻo te gāue fika.
        [slope] ʻE mole tokagaʻi te hekeheke ʻe mole fika ʻo te gāue fika.
       *[other] ʻE mole tokagaʻi te { $type } ʻe mole fika ʻo te gāue fika.
    }

function-ignoring-empty =
    { $type ->
        [maximum] ʻE mole tokagaʻi te lahi taha ʻe ava noa ʻo te gāue fika.
        [minimum] ʻE mole tokagaʻi te veliveli taha ʻe ava noa ʻo te gāue fika.
        [extremum] ʻE mole tokagaʻi te gataʻaga ʻe ava noa ʻo te gāue fika.
        [point] ʻE mole tokagaʻi te togi ʻe ava noa ʻo te gāue fika.
       *[other] ʻE mole tokagaʻi te { $type } ʻe ava noa ʻo te gāue fika.
    }

function-points-too-close = ʻE ʻi te gāue fika te togi ʻe lua ʻe ovi fau. ʻE mole lava ke fakatuʻu te gāue fika.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = ʻE lava pē te toe fai ʻo te gāue fika kapau ʻe tatau te lau ʻo te input mo te lau ʻo te output. ʻE ʻi te gāue fika nei te input ʻe { $inputs } mo te output ʻe { $outputs }.

## `<sequence>`

sequence-invalid-length = Loloa hala ʻo te sequence.  ʻE tonu ke fika kātoa ʻe mole veliveli ʻi te noa.

sequence-invalid-step = step hala ʻo te sequence.  ʻE tonu ke fika ki he sequence type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" hala ʻo he sequence fika.  ʻE tonu ke fika.

sequence-invalid-endpoint-letters = "{ $attribute }" hala ʻo he sequence mataʻitohi.  ʻE tonu ke ko he fakatahiga mataʻitohi.

sequence-invalid-endpoint = "{ $attribute }" hala ʻo te sequence.

select-from-sequence-coprime-not-numbers = ʻe mole tokagaʻi te coprime he ʻe mole fili he fika

select-from-sequence-coprime-with-exclude-combinations = ʻe mole tokagaʻi te coprime he kua fakapapau te excludeCombinations

## Resolving a `target`

target-not-found = Target hala ki te `<{ $source }>`: ʻe mole maʻu te target.

target-state-variable-not-found = Target hala ki te `<{ $source }>`: ʻe mole maʻu he fetogi tuʻuga ko tona higoa "{ $property }" ʻi he `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = ʻE tonu ke kehe te ʻu fetogi ʻo te `<odeSystem>` mo te fetogi tuʻu tokotahi.

ode-system-duplicate-variable-names = ʻE mole lava ke fakatuʻu te ʻu gāue fika RHS ʻo te ODE mo te ʻu higoa fetogi ʻe tatau.

ode-system-rhs-function-error = ʻE mole lava ke fakatuʻu te gāue fika RHS ʻo te ODE.  Neʻe hala te fakatupu ʻo te gāue fika mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = ʻE mole lava ke fakatuʻu he tulutulu ʻi te vahaʻa ʻo te laina ʻe { $count }

angle-invalid-through-point = Togi hala ʻi te through ʻo te `<angle>`

parabola-vertex-too-many-points = ʻE mole kei fakahoko he palapole mo hona tumutumu ʻe ʻalu ʻi he togi ʻe lahi age ʻi te 1.

parabola-too-many-points = ʻE mole kei fakahoko he palapole ʻe ʻalu ʻi he togi ʻe lahi age ʻi te 3.

intersection-too-many-items = ʻE mole kei fakahoko te fetaulaki ki he meʻa ʻe lahi age ʻi te lua

## Other math components

ionic-compound-not-two-ions = ʻE mole kei fakahoko te fefiofi ʻioniki ki he meʻa kehe ʻi te ʻioni ʻe lua.

ionic-compound-needs-cation-and-anion = Neʻe fakahoko te fefiofi ʻioniki ki te cation e tahi mo te anion e tahi pē.

solve-equations-cannot-evaluate = ʻE mole lava ke fakatokatoka te fakatatau he neʻe mole lava ke fika te fakatatau: { $equation }

math-operators-operand-number-required = ʻE tonu ke fakapapau he operandNumber mokā toʻo he operand fika.

eigen-decomposition-failed = Neʻe mole lava ke fika te ʻu eigenvalue ʻo te matilise

## `<matchesPattern>`

# No select: the list carries no number of its own.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: ʻe mole hā te parameter { $parameters } ʻi te pattern, pea ʻe fetaulaki tuʻumaʻu anai mo he ava noa.

## `<graph>`

graph-grid-invalid = `<graph>`: ʻe mole lava ke mahino te grid="{ $grid }". ʻE tonu ke none, medium, dense, pe ko he fika lelei ʻe lua kua vaeʻi ʻaki he avanoa, ohage ko te grid="1 0.5". ʻE mole tā he grid.

## `<slopeField>` and `<vectorField>`

# `$expected` selects two different sentences rather than two numbers of one
# noun, so the select stays. `$found` counts alone, so its select is dropped.
field-function-wrong-num-outputs =
    ʻE fakaʻamu te `<{ $component }>` ki he gāue fika mo { $expected ->
        [one] te output e tahi, te hekeheke y' ʻi te togi takitahi, ohage ko te `y - x`
       *[other] te output ʻe lua, te vekitele ʻi te togi takitahi, ohage ko te `(y, -x)`
    }, kae ko te gāue fika neʻe foaki kiai ʻe ʻi ai te output ʻe { $found }. { $alternative ->
        [none] ʻE mole tā he meʻa.
       *[other] Ko te `<{ $alternative }>` te koga ki te gāue fika ʻaia. ʻE mole tā he meʻa.
    }

field-function-attribute-ignored-with-child = ʻE mole tokagaʻi te ʻatilipiuti `function` he kua foaki foki te gāue fika ʻi loto ʻi te koga; ko te meʻa ʻi loto ʻaē ʻe gāueʻaki. Foaki te gāue fika ʻi te faʻahiga e tahi pē.

field-variables-ignored =
    `<{ $component }>`: ʻe fakahigoa e te ʻatilipiuti `variables` te ʻu fetogi ʻo he fakatatau kua tohi hagatonu ʻi loto ʻi te koga. { $reason ->
        [function-child] Ko te gāue fika ʻi heni neʻe foaki ohage ko he fānau `<function>`, ʻaē ʻe ina fakahigoa tona ʻu fetogi, koia ʻe mole tokagaʻi ai te `variables`.
       *[no-expression] ʻE mole he fakatatau feiā ʻi heni, koia ʻe mole tokagaʻi ai te `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: ʻe mole lava te xLabelPosition="left" ʻi te renderer prefigure; ʻe gāueʻaki te aga ʻo te right.

prefigure-y-label-position-unsupported = `<graph>`: ʻe mole lava te yLabelPosition="bottom" ʻi te renderer prefigure; ʻe gāueʻaki te aga ʻo te top.

prefigure-invalid-axis-bounds = `<graph>`: gataʻaga hala ʻo te ʻu ʻakisi ki te liliu prefigure; ʻe gāueʻaki te bbox masani (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lahi hala ki te liliu prefigure; ʻe gāueʻaki te lahi masani ʻo te ata 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio hala ki te liliu prefigure; ʻe gāueʻaki te aspect ratio masani 1.

prefigure-grid-spacing-too-fine = `<graph>`: ʻe ovi fau te ʻu laina ʻo te grid ki te gataʻaga ʻo te ʻu ʻakisi; ʻe mole tā te grid ʻi te renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: ʻe mole tā te ʻu annotation kapau ʻe mole gāueʻaki te renderer PreFigure.

multiple-annotations-children = Neʻe maʻu te fānau `<annotations>` ʻe lahi ʻi te `<graph>`; ʻe mole tokagaʻi te ʻu tahi, ko te fakaʻosi pē.

## Referring to other components

copy-unrecognized-component-type = ʻE mole lava ke fakalahi pe hiki he faʻahiga koga ʻe mole ʻiloʻi: { $type }.

copy-prop-not-found = Neʻe mole maʻu te prop { $property } ʻi he koga faʻahiga { $component }

collect-no-source = Neʻe mole maʻu he source ki te collect.

collect-invalid-component-type = ʻE mole lava ke tānaki te ʻu koga faʻahiga `<{ $component }>` he ʻe ko he faʻahiga koga ʻe hala.

reference-index-unavailable = ʻE mole lava ke tuhu ki te index `{ $reference }`

## `<callAction>`

component-action-unavailable = ʻE mole lava ke pāui te { $action } ʻi te koga `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ʻE hala te fuʻu ʻo te ʻu fakamatala.  ʻE mole tatau te loloa ʻo te ʻu laina. Neʻe maʻu ʻi te componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = ʻE ʻi ai te ʻu higoa kolone ʻe tatau.  Neʻe maʻu ʻi te componentIdx :{ $componentIdx }

data-frame-missing-column-name = ʻE puli he higoa kolone.  Neʻe maʻu ʻi te componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ko he award ʻo te tali nei ʻe fakalogo ki te tali neʻe ʻave e te answer tag totonu, pea ʻe fua kovi anai tona ʻaoga.

answer-max-num-attempts-in-section-wide-check-work = ʻE mole he ʻaoga ʻo te fakatuʻu ʻo te `maxNumAttempts` ʻi he `<answer>` ʻi loto ʻi he koga ʻe ʻi ai te `sectionWideCheckWork`, he ʻe puleʻi te lau ʻo te faiga e te koga lahi. Fakatuʻu te `maxNumAttempts` ʻi te koga lahi.

nested-section-wide-check-work-max-num-attempts = ʻE mole he ʻaoga ʻo te fakatuʻu ʻo te `maxNumAttempts` ʻi he koga ʻe ʻi ai te `sectionWideCheckWork` kae ʻe nofo ʻi loto ʻi he tahi koga ʻe ʻi ai te `sectionWideCheckWork`, he ʻe puleʻi te lau ʻo te faiga e te koga ʻi tuʻa. Fakatuʻu te `maxNumAttempts` ʻi te koga ʻi tuʻa.

# No select: the list carries no number of its own.
answer-attributes-need-symbolic-equality = ʻE mole he ʻaoga ʻo te ʻatilipiuti { $attributes } kapau ʻe mole fakatuʻu te symbolicEquality.

answer-invalid-type = Faʻahiga hala ki te tali: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = He ʻe mole hona higoa te koga `<{ $component }>`, ʻe mole lava ke gāueʻaki ki he ʻatilipiuti ʻo he module

module-attribute-name-already-defined = ʻE mole lava ke gāueʻaki te koga `<{ $component } name="{ $name }">` ohage ko he ʻatilipiuti ʻo he module, he kua ʻi ai te ʻatilipiuti "{ $name }" ʻi te faʻahiga koga `<module>`.

conditional-content-condition-ignored = ʻE mole tokagaʻi te ʻatilipiuti `condition` ʻi he koga `<conditionalContent>` ʻe ʻi ai te fānau case pe else.

slider-markers-type-mismatch = ʻE mole tatau te type ʻo te ʻu marker mo te type ʻo te slider.

pretzel-problem-needs-statement-and-answer = Pretzel hala: ʻe tonu ke ʻi ai ʻi te `<problem>` takitahi te `<statement>` e tahi mo te `<answer>` e tahi.

pretzel-circuit-first-problem-distractor = Pretzel hala: ʻi te mode="circuit", ʻe mole lava ke ko he distractor te `<problem>` ʻuluaki.

## Attribute values

# No select: the list carries no number of its own.
attribute-invalid-values = Mahuʻiga hala { $values } ki te ʻatilipiuti `{ $attribute }`; ʻe mole tokagaʻi.

attribute-must-be-references = Mahuʻiga hala `{ $value }` ki te ʻatilipiuti `{ $attribute }`. ʻE tonu ke fakatupu te ʻatilipiuti ʻaki te ʻu tuhu ʻe kamata ʻaki te `$`.

math-input-invalid-function-names = <mathInput>: neʻe mole tokagaʻi te ʻu higoa gāue fika hala ʻi te { $attribute }: { $names }. ʻE tonu ke lua pe lahi age te mataʻitohi ʻo te koga hā ʻo te higoa takitahi (mataʻitohi pe tā fakatahi); ʻe lava ke hoko ki ai te `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Faʻahiga koga hala: `<{ $componentType }>`

attribute-repeated = ʻE mole lava ke toe fai te ʻatilipiuti { $attribute }.

attribute-invalid-for-component = ʻAtilipiuti hala "{ $attribute }" ki he koga faʻahiga `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    ʻE mole feʻauga te fekehekeheʻaki ʻo te style definition { $styleNumber } ki te { $context ->
        [text-on-background] lanu ʻo te tohi ki te lanu ʻo te tuʻuga
        [high-contrast] lanu high-contrast ki te canvas
        [line] lanu ʻo te laina ki te canvas
        [marker] lanu ʻo te marker ki te canvas
       *[text-on-canvas] lanu ʻo te tohi ki te canvas
    }{ $mode ->
        [dark] { " (mode fakapōʻuli)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ʻe fakaʻamu ki te { $threshold }:1 pe lahi age).

style-definition-dark-mode-text-background-contrast =
    Logola kua fakapapau ʻi te style definition { $styleNumber } te ʻu lanu ʻe feʻauga tonatou fekehekeheʻaki ki te mode māmā, kae ko te ʻu lanu ʻo te mode fakapōʻuli ʻe maʻu mai ai ʻe mole feʻauga tonatou fekehekeheʻaki ʻo te lanu ʻo te tohi ki te lanu ʻo te tuʻuga ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ʻe fakaʻamu ki te { $threshold }:1 pe lahi age). { $suggestion ->
        [available] Ke feʻauga te fekehekeheʻaki ʻi te mode fakapōʻuli, fakalahi te fekehekeheʻaki ʻo te mode māmā (ohage, fakatuʻu te { $lightAttribute }="{ $lightColor }") pe fetogi te lanu ʻo te mode fakapōʻuli (ohage, fakatuʻu te { $darkAttribute }="{ $darkColor }").
       *[none] Ke feʻauga te fekehekeheʻaki ʻi te mode fakapōʻuli, fakalahi te fekehekeheʻaki ʻo te mode māmā pe fetogi te ʻu lanu ʻaki te textColorDarkMode pea mo/pe ko te backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Logola kua fakapapau ʻi te style definition { $styleNumber } he lanu tohi ʻe feʻauga tona fekehekeheʻaki ki te mode māmā, kae ko te lanu tohi ʻo te mode fakapōʻuli ʻe maʻu mai ai ʻe mole feʻauga tona fekehekeheʻaki ki te canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ʻe fakaʻamu ki te { $threshold }:1 pe lahi age). { $suggestion ->
        [available] Ke feʻauga te fekehekeheʻaki ʻi te mode fakapōʻuli, fakalahi te fekehekeheʻaki ʻo te mode māmā (ohage, fakatuʻu te textColor="{ $lightColor }") pe fetogi te lanu ʻo te mode fakapōʻuli (ohage, fakatuʻu te textColorDarkMode="{ $darkColor }").
       *[none] Ke feʻauga te fekehekeheʻaki ʻi te mode fakapōʻuli, fakalahi te fekehekeheʻaki ʻo te mode māmā pe fetogi te lanu ʻaki te textColorDarkMode.
    }

section-multiple-style-palettes = ʻE lava pē e te vahe ke fili te <stylePalette> e tahi; ʻe gāueʻaki te fakaʻosi.

## Unique variants

variant-num-to-select-not-non-negative-integer = ʻe mole lava ke ʻiloʻi te ʻu valiā makehe ʻo te { $component } he ʻe mole ko he fika kātoa ʻe mole veliveli ʻi te noa te numToSelect.

variant-num-to-select-not-constant-number = ʻe mole lava ke ʻiloʻi te ʻu valiā makehe ʻo te { $component } he ʻe mole ko he fika tuʻumaʻu te numToSelect.

variant-with-replacement-not-constant-boolean = ʻe mole lava ke ʻiloʻi te ʻu valiā makehe ʻo te { $component } he ʻe mole ko he boolean tuʻumaʻu te withReplacement.

variant-select-weight-disables-unique = ʻE mole lava te ʻu valiā makehe ʻo te select kapau ʻe ʻi ai he option mo te selectWeight pe ko te selectForVariants kua fakapapau

variant-coprime-undetermined = ʻe mole lava ke ʻiloʻi te ʻu valiā makehe ʻo te { $component } he ʻe mole lava ke ʻiloʻi ʻe hala tuʻumaʻu te coprime.

variant-attribute-not-constant = ʻe mole lava ke ʻiloʻi te ʻu valiā makehe ʻo te { $component } he ʻe mole tuʻumaʻu te { $attribute }.

variant-attribute-not-number = ʻe mole lava ke ʻiloʻi te ʻu valiā makehe ʻo te { $component } he ʻe mole fika te { $attribute }.

variant-attribute-wrong-type-for-sequence =
    ʻe mole lava ke ʻiloʻi te ʻu valiā makehe ʻo te { $component } faʻahiga { $type } he ʻe mole ko te { $attribute } he { $expected ->
        [letters-combination] fakatahiga mataʻitohi
        [math-expression] fakatatau fika totonu
        [integer] fika kātoa
       *[number] fika
    }.

variant-length-not-integer = ʻe mole lava ke ʻiloʻi te ʻu valiā makehe ʻo te { $component } he ʻe mole ko he fika kātoa te length.

variant-sort-not-implemented = ʻe mole kei fakahoko te ʻu valiā makehe ʻo he { $component } mo te sort

variant-exclude-combinations-not-implemented = ʻe mole kei fakahoko te ʻu valiā makehe ʻo he { $component } mo te excludeCombinations

variant-math-exclude-not-implemented = ʻe mole kei fakahoko te ʻu valiā makehe ʻo he { $component } faʻahiga math mo te exclude

variant-non-constant-exclude-not-implemented = ʻe mole kei fakahoko te ʻu valiā makehe ʻo he { $component } mo he exclude ʻe mole tuʻumaʻu

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ʻe mole lava ʻi te renderer prefigure ʻo te graph; ʻe fakalaka te fānau.

prefigure-descendant-invalid-geometry = { $subject }: ʻe mole gata pe ʻe mole kātoa te fuʻu; ʻe fakalaka te fānau.

prefigure-curve-label-omitted = { $subject }: ʻe mole lava te ʻu fakaʻiloga ʻi te ʻu pikopiko kua liliu; ʻe mole tā te fakaʻiloga.

prefigure-curve-unsupported-definition-type = { $subject }: ʻe mole lava te faʻahiga fakatuʻu pikopiko '{ $definitionType }'; ʻe fakalaka te fānau.

prefigure-region-flip-functions-unsupported = { $subject }: ʻe mole lava te ʻatilipiuti flipFunctions ʻi te regionBetweenCurves; ʻe fakalaka te fānau.

prefigure-region-non-formula-child = { $subject }: ko te ʻu fānau gāue fika faʻahiga formula pē ʻe lava ʻi te regionBetweenCurves; ʻe fakalaka te fānau.

prefigure-label-position-unsupported =
    { $subject }: ʻe mole lava te labelPosition '{ $labelPosition }' ki te { $labelKind ->
        [line-family] fakaʻiloga ʻo te ʻu meʻa faʻahiga laina
       *[point] fakaʻiloga ʻo te togi
    }; ʻe gāueʻaki te fakatuʻu masani ʻa PreFigure.

prefigure-fill-style-unsupported = { $subject }: ʻe mole lava e PreFigure te fill style '{ $fillStyle }'; ʻe gāueʻaki he fonu maʻa.

prefigure-line-style-unknown = { $subject }: ʻe mole ʻiloʻi te line style '{ $lineStyle }', pea ʻe mole tuku ki te output ʻo PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ko te marker style '{ $markerStyle }' kua liliu ki te style 'diamond' ʻo PreFigure.

prefigure-marker-style-unsupported = { $subject }: ʻe mole lava e PreFigure te marker style '{ $markerStyle }'; ʻe gāueʻaki te style masani.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` hala; ʻe mole lava ke maʻu te target. ʻE mole tuku te annotation.

annotation-ref-multiple-targets = `<annotation>`: neʻe tuhu te `ref` ki te target ʻe lahi; ʻe gāueʻaki te target ʻuluaki.

annotation-ref-outside-graph = `<annotation>`: `ref` hala; ʻe nofo te target ʻi tuʻa ʻo te graph. ʻE mole tuku te annotation.

annotation-ref-unsupported-target = `<annotation>`: `ref` hala; ʻe mole ko he meʻa ata ʻe lava ʻi te liliu prefigure te target. ʻE mole tuku te annotation.

annotation-text-missing = `<annotation>`: ʻe puli pe ʻe ava noa te `text`; ʻe tuku he text ava noa.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Neʻe maʻu he fakalogo fakatakamilo.
       *[other] Neʻe maʻu he fakalogo fakatakamilo ʻe kau ki ai te koga `<{ $componentType }>`.
    }

reference-no-referent = Neʻe mole maʻu he meʻa ki te tuhu: `{ $reference }`

reference-multiple-referents = Neʻe maʻu te meʻa ʻe lahi ki te tuhu: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Fakatuʻutuʻu hala ʻo te ʻatilipiuti { $attribute } ʻo te `<{ $componentType }>`.

children-invalid = Fānau hala ki te `<{ $componentType }>`: neʻe maʻu te ʻu fānau hala: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Mahuʻiga hala `{ $value }` ki te ʻatilipiuti `{ $attribute }`, ʻe gāueʻaki te mahuʻiga `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Neʻe mole maʻu te vēsio DoenetML { $version }.
       *[other] Neʻe mole maʻu te vēsio DoenetML { $version }. ʻE gāueʻaki te vēsio { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML hala: { $content }

parse-tag-missing-close-tag = DoenetML hala: ʻe mole he tag tāpuni ʻo te tag `{ $tag }`. ʻE fakaʻamu ki he tag ʻe tāpuni ia totonu pe ko he tag `</{ $tagName }>`.

parse-tag-error = DoenetML hala: Hala ʻi te tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML hala: ʻE hage ʻe puli te mahuʻiga ʻo te ʻatilipiuti hala `{ $attribute }`.

parse-attribute-invalid = DoenetML hala: ʻAtilipiuti hala `{ $attribute }`

parse-attribute-value-invalid = DoenetML hala: Mahuʻiga ʻatilipiuti hala `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML hala: Mahuʻiga ʻatilipiuti hala `{ $value }`. ʻE mole tatau te ʻu fakaʻiloga lea. ʻE hage ʻe puli he `{ $quote }`

parse-open-tag-name-missing = DoenetML hala: Neʻe maʻu he tag ʻe mole hona higoa, ohage ko te `<`

parse-tag-not-closed = DoenetML hala: Neʻe mole tāpuni te tag `{ $tag }` (ʻe hage ʻe puli he `>`).

parse-self-closing-tag-name-missing = DoenetML hala: Neʻe maʻu he tag ʻe mole hona higoa `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML hala: Neʻe mole tāpuni te tag `{ $tag }` (ʻe hage ʻe puli he `/>`).

parse-tag-invalid-attributes = DoenetML hala: ʻE hala te tag `{ $tag }`. ʻE lagi hala tona ʻu ʻatilipiuti.

parse-close-tag-name-missing = DoenetML hala: Neʻe maʻu he tag tāpuni ʻe mole hona higoa, ohage ko te `</`

parse-attribute-value-unquoted = ʻE tonu ke tuku te ʻu mahuʻiga ʻatilipiuti ʻi loto ʻi te ʻu fakaʻiloga lea: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML hala: Neʻe maʻu te tag tāpuni `{ $tag }`, kae ʻe mole hona tag avahi

parse-close-tag-mismatched = DoenetML hala: ʻE mole tatau te tag tāpuni. Neʻe fakaʻamu ki te `</{ $expected }>`. Neʻe maʻu te `{ $found }`

parser-node-unconvertible = Neʻe mole lava ke liliu te node { $node } ki he node Dast.

## Names

name-attribute-invalid =
    Higoa ʻatilipiuti hala name='{ $name }'. { $reason ->
        [characters] ʻE lava pē ke ʻi ai ʻi te ʻu higoa te ʻu mataʻitohi, te ʻu fika, te underscore pe ko te tā fakatahi.
       *[start] ʻE tonu ke kamata te ʻu higoa ʻaki he mataʻitohi.
    }

component-name-invalid-start = Higoa koga hala "{ $name }". ʻE tonu ke kamata te ʻu higoa ʻaki he mataʻitohi.

## `<answer>` sugar

answer-video-watched-missing-video = ʻE tonu ke ʻi ai he ʻatilipiuti video ʻo he answer faʻahiga videoWatched

answer-video-watched-video-not-reference = ʻE tonu ke ko he tuhu te ʻatilipiuti video ʻo he answer faʻahiga videoWatched

answer-name-not-single-text = ʻE tonu ke ʻi ai te fānau text e tahi pē ʻo te ʻatilipiuti name ʻo te answer

## Referencing another document

external-doenetml-recursion-limit = ʻE mole lava ke maʻu te DoenetML ʻi tuʻa he ʻe lahi fau te ʻu tuʻuga fakatakamilo. ʻE ʻi ai koa he tuhu fakatakamilo?

external-doenetml-unavailable = ʻE mole lava ke maʻu te DoenetML mai te { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML hala neʻe maʻu mai te { $attribute }="{ $uri }": neʻe mole tatau mo te faʻahiga koga "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Kua mole kei gāueʻaki te ʻatilipiuti `{ $from }`; gāueʻaki te `{ $to }`.
       *[other] [deprecation] Kua mole kei gāueʻaki te ʻatilipiuti `{ $from }` ʻi te `<{ $component }>`; gāueʻaki te `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Kua mole kei gāueʻaki te ʻatilipiuti `{ $from }` pea ʻe mole tokagaʻi he kua fakapapau foki te `{ $to }`.
       *[other] [deprecation] Kua mole kei gāueʻaki te ʻatilipiuti `{ $from }` ʻi te `<{ $component }>` pea ʻe mole tokagaʻi he kua fakapapau foki te `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Kua mole kei gāueʻaki te ʻatilipiuti `{ $attribute }` ʻi te `<{ $component }>` pea ʻe mole tokagaʻi.

deprecated-attribute-to-child = [deprecation] Kua mole kei gāueʻaki te ʻatilipiuti `{ $attribute }` ʻi te `<{ $component }>`; gāueʻaki he fānau `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Kua mole kei gāueʻaki te mahuʻiga `{ $value }` ʻo te ʻatilipiuti `{ $attribute }` ʻi te `<{ $component }>`; gāueʻaki te `{ $to }`.


## Language coverage

pluralize-english-only = ʻE lava pē e te `<pluralize>` ke fakalahi te ʻu kupu fakapilitānia, koia ʻe mole fetogi ai tana tohi ʻi he pepa neʻe tohi ʻi te { $locale }. Tohi hagatonu te faʻahiga lahi, pe fakatuʻu ʻaki te ʻatilipiuti `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ko te element `<{ $tag }>` ʻe mole ko he element Doenet ʻe ʻiloʻi.

schema-element-not-allowed-at-root = ʻE mole lava te element `<{ $tag }>` ʻi te tafitō ʻo te pepa.

schema-element-not-allowed-inside = ʻE mole lava te element `<{ $tag }>` ʻi loto ʻi te `<{ $parent }>`.

schema-attribute-unrecognized = ʻE mole hana ʻatilipiuti ko te `{ $attribute }` te element `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] ʻE tonu ke ko he lisi te ʻatilipiuti `{ $attribute }` ʻo te element `<{ $tag }>`, pea ko te koga takitahi ʻe tonu ke tahi ʻi te: { $allowed }
       *[other] ʻE tonu ke tahi te ʻatilipiuti `{ $attribute }` ʻo te element `<{ $tag }>` ʻi te: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Higoa valiā hala ki te select.  ʻE hā te higoa valiā { $variantName } ʻi te option ʻe { $numOptions } kae ko te lau ke fili ko te { $numToSelect }.

select-variant-name-without-options = Kua fakapapau te ʻu valiā ki te select kae ʻe mole he option kua fakapapau ki te higoa valiā: { $variantName }.

select-variant-name-not-possible = Ko te higoa valiā { $variantName } kua fakapapau ki te select ʻe mole ko he higoa valiā ʻe lava.

select-too-few-options = ʻE mole lava ke fili te koga ʻe { $numToSelect } mai te { $numOptions } pē.

select-from-sequence-too-few-values = ʻE mole lava ke fili te mahuʻiga ʻe { $numToSelect } mai he sequence ko tona loloa ko te { $length }.

select-from-sequence-indices-count-mismatch = ʻE tonu ke tatau te lau ʻo te ʻu index kua fakapapau ki te select mo te lau ke fili

select-from-sequence-indices-not-integers = ʻE tonu ke fika kātoa te ʻu index fuli kua fakapapau ki te select

select-from-sequence-index-excluded = Neʻe fakapapau he index ʻo te selectfromsequence kae neʻe fakamavae

select-from-sequence-indices-excluded-combination = Neʻe fakapapau te ʻu index ʻo te selectfromsequence kae ko he fakatahiga neʻe fakamavae

select-from-sequence-coprime-not-positive-integers = ʻE mole lava ke fili te ʻu fakatahiga coprime he ʻe mole fili he fika kātoa lelei.

select-from-sequence-coprime-common-factor = ʻE mole lava ke fili te ʻu fika coprime. ʻE tahi te factor ʻo te ʻu mahuʻiga fuli. (ʻE tonu ke coprime te ʻu mahuʻiga "from" pe "to" mo te "step".)

select-from-sequence-coprime-single-number = ʻE mole lava ke fili te ʻu fakatahiga coprime mai he fika e tahi ʻe mole ko te 1.

select-from-sequence-excluded-too-many-combinations = Neʻe fakamavae te 70% pe lahi age ʻo te ʻu fakatahiga ʻi te selectFromSequence

select-from-sequence-coprime-none-found = Neʻe mole lava ke fili te ʻu fika coprime. ʻE tahi te factor ʻo te ʻu mahuʻiga fuli.

select-from-sequence-too-few-unique-values = ʻE mole lava ke fili te mahuʻiga makehe ʻe { $numToSelect } mai he sequence ko tona loloa ko te { $numPossibleValues }

select-prime-numbers-too-few-values = ʻE mole lava ke fili te mahuʻiga ʻe { $numToSelect } mai he lisi fika prime ko tona loloa ko te { $numValues }

select-prime-numbers-values-count-mismatch = ʻE tonu ke tatau te lau ʻo te ʻu mahuʻiga kua fakapapau ki te select mo te lau ke fili

select-prime-numbers-values-not-prime = ʻE tonu ke ʻi te lisi ʻo te ʻu fika prime te ʻu mahuʻiga fuli kua fakapapau ki te select prime number

select-prime-numbers-values-excluded-combination = Ko te ʻu mahuʻiga ʻo te selectPrimeNumbers kua fakapapau ko he fakatahiga neʻe fakamavae

select-prime-numbers-excluded-too-many-combinations = Neʻe fakamavae te 70% pe lahi age ʻo te ʻu fakatahiga ʻi te selectPrimeNumbers

select-random-combination-fluke = ʻI he meʻa fakaofo ʻaupito, neʻe mole lava ke fili he fakatahiga mahuʻiga fakatupu noa

select-random-value-fluke = ʻI he meʻa fakaofo ʻaupito, neʻe mole lava ke fili he mahuʻiga fakatupu noa

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    ʻE mole tā te `<{ $component }>` ʻi loto ʻi te fika; ʻe tā te fakatatau ohage ko tona ʻuhiga ʻi muʻa ʻo te lava ʻo te tuku ʻo te ʻu input ki loto. { $reason ->
        [not-inline] Ko he choice input `inline` pē ʻe lava ʻi loto ʻi he fakatatau; kapau ʻe mole `inline`, ʻe ko he block pouto ia.
        [expanded] Ko he text input `expanded` ʻe ko he puha laina lahi, pea ʻe lahi fau ki loto ʻi he fakatatau.
        [on-graph] ʻI he graph ʻe tā te fakatatau ohage ko he ata e tahi, pea ʻe mole he avanoa ai ki he meʻa gāueʻaki.
       *[relative-width] Ko tona `width` ʻe fakatatau (he pēseta pe ko he `em`), pea ʻe mole hana meʻa ke fua kiai ʻi loto ʻi he fakatatau. Foaki te lahi ʻaki he fua fakapapau, ohage ko te `px`.
    }
