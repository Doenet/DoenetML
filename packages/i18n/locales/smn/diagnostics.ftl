# Inari Sami diagnostics, Latin script. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
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
# Inari Sami writes `â` and `ä` beside the `č`, `š`, `ž`, `đ` and `ŋ` it
# shares with Northern Sami. `â` is not `á`: a word that should carry one and
# carries the other is a bug, not a variant.
#
# Inari Sami counts in three categories, `one`, `two` and `other`, and a
# message here writes them out only where they differ. Where English separates
# a singular from a plural in the verb alone — "is ignored" against "are
# ignored" — Inari Sami marks number on the verb too, so `one` and `*[other]`
# are kept; the dual is not written out beside them, because the verb's dual
# is not what a list of two attribute names selects.
#
# Two choices run through the whole file and should be checked once rather
# than message by message. "Invalid" is «kelbottes», the caritive of «kelbâđ»,
# to be fit for something. "Ignored" is «ij adnuu» / «iä adnuu», literally "is
# not used", because Inari Sami has no short equivalent of the Northern idiom
# «ii váldojuvvo vuhtii»; the verb carries the number, which is why these
# messages fork on `one` at all.
#
# One more: a source line is «ravvuu» here and a geometric line is «linjá».
# Northern Sami uses one word for both; keeping them apart makes the parse
# errors readable, and is worth preserving if these strings are revised.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ij adnuu ko kyehti kiäčâčuoggá láá adelum
       *[other] { $attributes } iä adnuu ko kyehti kiäčâčuoggá láá adelum
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ij adnuu ko sehe kiäčâčuoggá já koskâčuoggá láá adelum
       *[other] { $attributes } iä adnuu ko sehe kiäčâčuoggá já koskâčuoggá láá adelum
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ij toimâ koskâčuoggá tääl

## `<line>`

line-points-undetermined-dimensions = Linjá čuoggái čooskâ moin dimensioh iä lah miäruštum.

line-points-too-few-dimensions = Linjá kalga moonnâđ čuoggái čooskâ main láá ucemustáá kyehti dimensio.

line-points-depend-on-variables = Linjá moonná čuoggái čooskâ moh láá čadnojum muttojáid: { $variables }.

line-equation-invalid-format = Kelbottes hämi linjá ohtâsâšvuotân muttojáiguin { $variable1 } já { $variable2 }.

## `<ray>`

ray-overprescribed-through = Peelilinjá lii miäruštum through, endpoint já direction peht. Adelum through ij adnuu.

ray-dimension-mismatch = numDimensions ij heivi ray:an.

## `<vector>`

vector-overprescribed-head = Vektor lii miäruštum head, tail já displacement peht. Adelum head ij adnuu.

vector-dimension-mismatch = numDimensions ij heivi vector:an.

## Attracting and constraining

attract-to-without-nearest-point = Ij pyevti kiessiđ tääsä `<{ $component }>` tastko tast ij lah nearestPoint-stáátumuttoo.

constrain-to-without-nearest-point = Ij pyevti raajediđ tääsä `<{ $component }>` tastko tast ij lah nearestPoint-stáátumuttoo.

constrain-to-interior-without-nearest-point = Ij pyevti raajediđ taan siskoveesân `<{ $component }>` tastko tast ij lah nearestPoint-stáátumuttoo.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ij adnuu choiceInput:âst mii ij lah inline

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput:an adelum indeksah iä adnuu tastko indeksâi lohomiäri ij heivi choice-päärnái lohomiärán.

pretzel-indices-count-mismatch = problem:an adelum indeksah iä adnuu tastko indeksâi lohomiäri ij heivi problem-päärnái lohomiärán.

shuffle-indices-count-mismatch = shuffle:an adelum indeksah iä adnuu tastko indeksâi lohomiäri ij heivi komponentâi lohomiärán.

indices-ignored-out-of-range = { $component } adelum indeksah iä adnuu tastko motomeh indeksah láá raaji ulguubeln.

pretzel-indices-repeated = pretzel:an adelum indeksah iä adnuu tastko motomeh indeksah láá maaŋgii adelum.

pretzel-circuit-first-index = pretzel:an adelum indeksah mode="circuit":âst iä adnuu tastko vuosmuš indeks kalga leđe 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ete `<{ $component }>` toimâččii tekstâpäärnáiguin, kalga attribuut `type` leđe adelum.

invalid-type-defaulting-to-math = Kelbottes type { $type } komponentist { $component }. Kalga leđe math, text, number teikkâ boolean. Piejoo math:in.

string-not-valid-component-to-arrange = Tekstâ "{ $value }" ij lah kelbee komponent tääsä { $component }. Ij adnuu.

## Types and variables

invalid-type-defaulting-to-number = Kelbottes type { $type }, type piejoo number:in.

invalid-variable-value = Kelbottes muttoo árvu: `{ $value }`

## Variants

variant-index-must-be-number = Variant indeks { $index } kalga leđe lohu

variant-index-must-be-integer = Variant indeks { $index } kalga leđe ollesluhu

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ij lah olášuttum absoluutlâš mihtoid. Kovdodâhah piejojeh relatiivlâžžân.

side-by-side-absolute-margins = `<{ $component }>` ij lah olášuttum absoluutlâš mihtoid. Raajah piejojeh relatiivlâžžân.

side-by-side-no-block-child = Kelbottes `<{ $component }>`: tast kalga leđe ucemustáá ohtâ blokpärni.

## `<label>`

label-for-ignored-on-graphical = Attribuut `for` gráfâlâš `<label>`:âst ij adnuu.

label-for-must-resolve-to-one = Attribuut `for` `<label>`:âst kalga čujottiđ tiuđâsávt ohtân komponentân.

label-for-unresolved = Attribuut `for` `<label>`:âst ij pottâm čujottiđ komponentân.

label-for-answer-with-authored-inputs = Attribuut `for` `<label>`:âst čujot `<answer>`:an mast láá jieijâs čalluum sisapiejâmeh; čujoot pieijâm njuolgá.

label-for-answer-without-input = Attribuut `for` `<label>`:âst čujot `<answer>`:an mast ij lah sisapiejâm maid merkkiđ.

label-for-must-reference-input-or-answer = Attribuut `for` `<label>`:âst kalga čujottiđ sisapiejâmân teikkâ answer:an.

## Accessibility

accessibility-short-description-or-decorative = Juksâmvuođâ tiet kalga `<{ $component }>` leđe uánihis čielgiittâs teikkâ leđe merkkejum hiärván.

accessibility-video-short-description = Juksâmvuođâ tiet kalga `<video>`:âst leđe uánihis čielgiittâs.

accessibility-input-short-description-or-label = Juksâmvuođâ tiet kalga `<{ $component }>`:âst leđe uánihis čielgiittâs teikkâ nommâdâs.

accessibility-answer-input-short-description-or-label = Juksâmvuođâ tiet kalga `<answer>`:âst mii rähtee sisapiejâm leđe uánihis čielgiittâs teikkâ nommâdâs.

accessibility-short-description-contains-math = Uánihis čielgiittâsâin iä kalga leđe matemaatilâš komponentah tegu `<{ $component }>`. Čäällih matematik saanijguin.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kontrast ij lah tuárvi kapittâl pajekirjottâs tekstân (sevnjis modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kaibâdâllâ ucemustáá { $threshold }:1).
       *[other] { $colorName } kontrast ij lah tuárvi kapittâl pajekirjottâs tekstân ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kaibâdâllâ ucemustáá { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` { $count } čuoggá čooskâ ij lah olášuttum tast tilálâšvuođâst ko čuoggáin iä lah numeerlâš áárvuh.

circle-too-many-through-points = Ij pyevti roknâdiđ sirkkeel ennuv ko 3 čuoggá čooskâ.

circle-overprescribed-radius-center-points = Ij pyevti roknâdiđ sirkkeel adelum raadiusáin, kuávdáin já čuoggáiguin.

circle-center-with-multiple-points = Ij pyevti roknâdiđ sirkkeel adelum kuávdáin ennuv ko 1 čuoggá čooskâ.

circle-radius-too-small = Ij pyevti roknâdiđ sirkkeel: ko kooskâ kyevti čuoggá kooskâst lii { $distance }, te adelum raadius { $radius } lii memmâ ucce.

circle-radius-with-many-points = Ij pyevti rähtiđ sirkkeel ennuv ko kyevti čuoggá čooskâ adelum raadiusáin.

circle-invalid-center-or-through-points = Kelbottes kuávdáš teikkâ kelbottes čuoggááh sirkkelist.

circle-radius-center-with-multiple-points = Ij pyevti roknâdiđ sirkkeel raadius adelum kuávdáin ennuv ko 1 čuoggá čooskâ.

circle-change-radius-non-numerical = Ij pyevti muttâđ sirkkeel raadius ko čuoggááh iä lah numeerlâšah

circle-radius-with-points-non-numerical = Ij pyevti rähtiđ sirkkeel ennuv ko ohtâ čuoggá čooskâ adelum raadiusáin ko áárvuh iä lah numeerlâšah.

circle-change-center-non-numerical = Sirkkeel kuávdáš mutâšume čuoggái čooskâ main iä lah numeerlâš áárvuh ij lah olášuttum.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Iä lah tuárvi dimensioh funktio miäruštâllâmkuávlun. Miäruštâllâmkuávlust lii { $intervals } kooskâ, mut funktiost { $inputs ->
            [one] lii { $inputs } sisapiejâm
           *[other] láá { $inputs } sisapiejâm
        }.
       *[other] Iä lah tuárvi dimensioh funktio miäruštâllâmkuávlun. Miäruštâllâmkuávlust láá { $intervals } kooskâ, mut funktiost { $inputs ->
            [one] lii { $inputs } sisapiejâm
           *[other] láá { $inputs } sisapiejâm
        }.
    }

function-domain-invalid-format = Kelbottes hämi funktio miäruštâllâmkuávlust.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funktio epinumeerlâš maksim ij adnuu.
        [minimum] Funktio epinumeerlâš minim ij adnuu.
        [extremum] Funktio epinumeerlâš ekstrem ij adnuu.
        [point] Funktio epinumeerlâš čuoggá ij adnuu.
        [slope] Funktio epinumeerlâš luoitâm ij adnuu.
       *[other] Funktio epinumeerlâš { $type } ij adnuu.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funktio kuorâs maksim ij adnuu.
        [minimum] Funktio kuorâs minim ij adnuu.
        [extremum] Funktio kuorâs ekstrem ij adnuu.
        [point] Funktio kuorâs čuoggá ij adnuu.
       *[other] Funktio kuorâs { $type } ij adnuu.
    }

function-points-too-close = Funktiost láá kyehti čuoggá moh láá memmâ maddel. Funktio ij pyevti miäruštâllâđ.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funktio kiärdusteh láá máhđulâšah tuše jis sisapiejâmij lohomiäri lii siämmáá ko ulguspyehtimij lohomiäri. Taan funktiost lii { $inputs } sisapiejâm já { $outputs ->
            [one] { $outputs } ulguspyehtim
           *[other] { $outputs } ulguspyehtim
        }.
       *[other] Funktio kiärdusteh láá máhđulâšah tuše jis sisapiejâmij lohomiäri lii siämmáá ko ulguspyehtimij lohomiäri. Taan funktiost láá { $inputs } sisapiejâm já { $outputs ->
            [one] { $outputs } ulguspyehtim
           *[other] { $outputs } ulguspyehtim
        }.
    }

## Vector and slope fields

field-function-wrong-num-outputs =
    `<{ $component }>` tarbâš funktio mast lii { $expected ->
        [one] ohtâ ulguspyehtim, luoitâm y' jyehi čuoggást, tegu `y - x`
       *[other] kyehti ulguspyehtim, vektor jyehi čuoggást, tegu `(y, -x)`
    }, mut adelum funktiost láá { $found ->
        [one] { $found } ulguspyehtim
       *[other] { $found } ulguspyehtim
    }. { $alternative ->
        [none] Ij maidnii sárgojuu.
       *[other] `<{ $alternative }>` lii komponent tot funktio várás. Ij maidnii sárgojuu.
    }

field-function-attribute-ignored-with-child = Attribuut `function` ij adnuu tastko funktio lii adelum meiddei komponent siste; tot mii lii siste adnoo. Adde funktio tuše nubben teivâst.

field-variables-ignored =
    `<{ $component }>`: attribuut `variables` noomât tot cielgâdâs muttoid mii lii čalluum njuolgá komponent siste. { $reason ->
        [function-child] Funktio lii tääbbin adelum `<function>`-pärnin, mii noomât jieijâs muttoid, já tanmaŋa `variables` ij adnuu.
       *[no-expression] Ij mihheen tegu cielgâdâs lah tääbbin adelum, já tanmaŋa `variables` ij adnuu.
    }

## `<sequence>`

sequence-invalid-length = Kelbottes kuhesvuotâ rääidun. Kalga leđe epinegatiivlâš ollesluhu.

sequence-invalid-step = Kelbottes lávki rääidust. Kalga leđe lohu rääidun mast lii šlaajâ { $type }.

sequence-invalid-endpoint-number = Kelbottes "{ $attribute }" lohorääidust. Kalga leđe lohu.

sequence-invalid-endpoint-letters = Kelbottes "{ $attribute }" puustâvrääidust. Kalga leđe puustâvij kombinaatio.

sequence-invalid-endpoint = Kelbottes "{ $attribute }" rääidust.

select-from-sequence-coprime-not-numbers = coprime ij adnuu tastko loho iä välljijuu

select-from-sequence-coprime-with-exclude-combinations = coprime ij adnuu tastko excludeCombinations lii adelum

## Resolving a `target`

target-not-found = Kelbottes target tääsä `<{ $source }>`: ulme ij kavnuu.

target-state-variable-not-found = Kelbottes target tääsä `<{ $source }>`: ij kavnuu stáátumuttoo noomáin "{ $property }" taan alne: `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` muttoo kalgeh leđe eres ko čadnâmettum muttoo.

ode-system-duplicate-variable-names = Ij pyevti miäruštâllâđ ODE olgeš pele funktioid ko čadnojum muttoi noomah láá maaŋgii.

ode-system-rhs-function-error = Ij pyevti miäruštâllâđ ODE olgeš pele funktio. Meddâdâs mathjs-funktio raahtimist.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ij pyevti miäruštâllâđ vinkkeel { $count } linjá kooskâst

angle-invalid-through-point = Kelbottes čuoggá `<angle>` through:âst

parabola-vertex-too-many-points = Parabel čokkáin ennuv ko 1 čuoggá čooskâ ij lah olášuttum.

parabola-too-many-points = Parabel ennuv ko 3 čuoggá čooskâ ij lah olášuttum.

intersection-too-many-items = Ennuv ko kyevti tiŋgâ čyeppim ij lah olášuttum

## Other math components

ionic-compound-not-two-ions = Ionlâš oovtâstâs ij lah olášuttum eres ko kyevti ionân.

ionic-compound-needs-cation-and-anion = Ionlâš oovtâstâs lii tuše ohtân kationân já ohtân anionân olášuttum.

solve-equations-cannot-evaluate = Ij pyevti čuávdiđ ohtâsâšvuođâ tastko tom ij pottâm roknâdiđ: { $equation }

math-operators-operand-number-required = Kalga addiđ operandNumber ko väldáh erâld matemaatilâš operand.

eigen-decomposition-failed = Ij pottâm roknâdiđ matriis jieččáárvuid

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } ij lah minstârist, nuuvt ete tot ain heivá kuorâsân.
       *[other] `<matchesPattern>`: parameterah { $parameters } iä lah minstârist, nuuvt ete toh ain heiveh kuorâsân.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ij pyevti tulkkuđ grid="{ $grid }". Kalga leđe none, medium, dense teikkâ kyehti positiivlâš lohu earottum kooskáin, ovdâmerkkân grid="1 0.5". Ruovtâ ij sárgojuu.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ij lah tuárjum prefigure-čäitteest; adnoo olgeš pele lääijám.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ij lah tuárjum prefigure-čäitteest; adnoo paje pele lääijám.

prefigure-invalid-axis-bounds = `<graph>`: kelbottes akselraajah prefigure-nubástittimân; adnoo standard bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: kelbottes kovdodâh prefigure-nubástittimân; adnoo standard kovdodâh 425.

prefigure-invalid-aspect-ratio = `<graph>`: kelbottes aspectRatio prefigure-nubástittimân; adnoo standard koskâvuotâ 1.

prefigure-grid-spacing-too-fine = `<graph>`: ruovtâ koskâh láá memmâ ucceh akselraajái ohtâvuođâst; ruovtâ kuáđáduvvoo prefigure-čäitteest.

prefigure-annotations-not-rendered = `<graph>`: merkkâšumeh iä čäittuu ko PreFigure-čäittee ij adnuu.

multiple-annotations-children = Maaŋgâ `<annotations>`-pärni kavnujii `<graph>`:âst; puoh eres ko majemuš iä adnuu.

## Referring to other components

copy-unrecognized-component-type = Ij pyevti vijđediđ teikkâ maaŋgistiđ tobdâmettum komponentšlaajâ: { $type }.

copy-prop-not-found = Ij kavnum iärásvuotâ { $property } komponentist mast lii šlaajâ { $component }

collect-no-source = Ij kavnum käldee tääsä collect.

collect-invalid-component-type = Ij pyevti čokkiđ komponentâid šlaajâst `<{ $component }>` tastko tot lii kelbottes komponentšlaajâ.

reference-index-unavailable = Ij pyevti čujottiđ indeksân `{ $reference }`

## `<callAction>`

component-action-unavailable = Ij pyevti kočodiđ { $action } komponentist `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Tiäđoin lii kelbottes hämi. Ravvui kuhesvuođah iä lah siämmáálágánah. Kavnum tääbbin: componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Tiäđoin láá maaŋgii siämmáá saargânoomah. Kavnum tääbbin: componentIdx :{ $componentIdx }

data-frame-missing-column-name = Tiäđoin váilu saargânommâ. Kavnum tääbbin: componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ohtâ award taan västidâsân vuáđuduvá answer-kilkkur jieijâs vuolgâttum västidâsân, mii tahá vuordâmettum lääijám.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` pieijâm `<answer>`:an mii lii `sectionWideCheckWork`-kartâ siste ij toimâ, tastko kartâ stivrii kiäččâlmij lohomiäri. Piijâ `maxNumAttempts` kartân.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` pieijâm kartân mast lii `sectionWideCheckWork` já mii lii nube `sectionWideCheckWork`-kartâ siste ij toimâ, tastko ulgomuš kartâ stivrii kiäččâlmij lohomiäri. Piijâ `maxNumAttempts` ulgomuš kartân.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attribuut { $attributes } ij toimâ jis symbolicEquality ij lah pijjum.
       *[other] Attribuutah { $attributes } iä toimâ jis symbolicEquality ij lah pijjum.
    }

answer-invalid-type = Kelbottes šlaajâ västidâsân: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ko komponentist `<{ $component }>` ij lah nommâ, te tom ij pyevti anneeđ moodul attribuutân

module-attribute-name-already-defined = Komponent `<{ $component } name="{ $name }">` ij pyevti anneeđ moodul attribuutân tastko komponentšlaajâst `<module>` juo lii attribuut "{ $name }".

conditional-content-condition-ignored = Attribuut `condition` ij adnuu `<conditionalContent>`:âst mast láá case- teikkâ else-päärnáh.

slider-markers-type-mismatch = Merkkâi šlaajâ ij heivi slider šlaajân.

pretzel-problem-needs-statement-and-answer = Kelbottes pretzel: jyehi `<problem>`:âst kalga leđe ohtâ `<statement>` já ohtâ `<answer>`.

pretzel-circuit-first-problem-distractor = Kelbottes pretzel: mode="circuit":âst ij pyevti vuosmuš `<problem>` leđe puáhtusteijee.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Kelbottes árvu { $values } attribuutân `{ $attribute }`; ij adnuu.
       *[other] Kelbottes áárvuh { $values } attribuutân `{ $attribute }`; iä adnuu.
    }

attribute-must-be-references = Kelbottes árvu `{ $value }` attribuutân `{ $attribute }`. Attribuut kalga leđe čokkejum čujottâsâin moh álgih merkkáin `$`.

math-input-invalid-function-names = <mathInput>: kelbottes funktionoomah tääbbin { $attribute } iä lah adnum: { $names }. Jyehi nommâ čäittimuási kalga leđe ucemustáá 2 merkkâ (puustâvah teikkâ sárgááh); tom maŋa puáhtá čuávvuđ iävtulâš `|<mathspeak molsâeevtu>`.

## Building components from the source

component-type-invalid = Kelbottes komponentšlaajâ: `<{ $componentType }>`

attribute-repeated = Ij pyevti addiđ attribuut { $attribute } maaŋgii.

attribute-invalid-for-component = Kelbottes attribuut "{ $attribute }" komponentân mast lii šlaajâ `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stiilmiäruštâllâmist { $styleNumber } ij lah tuárvi kontrast tääsä { $context ->
        [text-on-background] tekstâivne tuogâšivne ohtâvuođâst
        [high-contrast] alla kontrast ivne tuogâš ohtâvuođâst
        [line] linjáivne tuogâš ohtâvuođâst
        [marker] merkkâivne tuogâš ohtâvuođâst
       *[text-on-canvas] tekstâivne tuogâš ohtâvuođâst
    }{ $mode ->
        [dark] { " (sevnjis modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kaibâdâllâ ucemustáá { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Vaiko stiilmiäruštâllâmist { $styleNumber } láá ivneh main lii tuárvi kontrast čuovgâd modusân, te sevnjis modus ivnijn moh tain roknâduvvojeh ij lah tuárvi kontrast tekstâivne já tuogâšivne kooskâst ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kaibâdâllâ ucemustáá { $threshold }:1). { $suggestion ->
        [available] Ete kontrast lii tuárvi sevnjis modusist, lasseet čuovgâd modus kontrast (ovdâmerkkân piijâ { $lightAttribute }="{ $lightColor }") teikkâ pajilkeeči sevnjis modus ivne (ovdâmerkkân piijâ { $darkAttribute }="{ $darkColor }").
       *[none] Ete kontrast lii tuárvi sevnjis modusist, lasseet čuovgâd modus kontrast teikkâ pajilkeeči roknâdum ivnijd textColorDarkMode já/teikkâ backgroundColorDarkMode peht.
    }

style-definition-dark-mode-text-canvas-contrast =
    Vaiko stiilmiäruštâllâmist { $styleNumber } lii tekstâivne mast lii tuárvi kontrast čuovgâd modusân, te sevnjis modus tekstâivnest mii tast roknâduvvoo ij lah tuárvi kontrast tuogâš ohtâvuođâst ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kaibâdâllâ ucemustáá { $threshold }:1). { $suggestion ->
        [available] Ete kontrast lii tuárvi sevnjis modusist, lasseet čuovgâd modus kontrast (ovdâmerkkân piijâ textColor="{ $lightColor }") teikkâ pajilkeeči sevnjis modus ivne (ovdâmerkkân piijâ textColorDarkMode="{ $darkColor }").
       *[none] Ete kontrast lii tuárvi sevnjis modusist, lasseet čuovgâd modus kontrast teikkâ pajilkeeči roknâdum ivne textColorDarkMode peht.
    }

section-multiple-style-palettes = Kapittâl puáhtá väljiđ tuše ohtâ <stylePalette>; adnoo majemuš.

## Unique variants

variant-num-to-select-not-non-negative-integer = ij pyevti miäruštâllâđ { $component } ohtâgâsâš variantâid tastko numToSelect ij lah epinegatiivlâš ollesluhu.

variant-num-to-select-not-constant-number = ij pyevti miäruštâllâđ { $component } ohtâgâsâš variantâid tastko numToSelect ij lah pisosâš lohu.

variant-with-replacement-not-constant-boolean = ij pyevti miäruštâllâđ { $component } ohtâgâsâš variantâid tastko withReplacement ij lah pisosâš boolean.

variant-select-weight-disables-unique = select ohtâgâsâš variantah láá jáduttum jis motomin molsâeevtust lii selectWeight teikkâ selectForVariants adelum

variant-coprime-undetermined = ij pyevti miäruštâllâđ { $component } ohtâgâsâš variantâid tastko ij pyevti miäruštâllâđ ete coprime lii ain puáštu.

variant-attribute-not-constant = ij pyevti miäruštâllâđ { $component } ohtâgâsâš variantâid tastko { $attribute } ij lah pisosâš.

variant-attribute-not-number = ij pyevti miäruštâllâđ { $component } ohtâgâsâš variantâid tastko { $attribute } ij lah lohu.

variant-attribute-wrong-type-for-sequence =
    ij pyevti miäruštâllâđ { $component } ohtâgâsâš variantâid mast lii šlaajâ { $type } tastko { $attribute } ij lah { $expected ->
        [letters-combination] puustâvij kombinaatio
        [math-expression] kelbee matemaatilâš cielgâdâs
        [integer] ollesluhu
       *[number] lohu
    }.

variant-length-not-integer = ij pyevti miäruštâllâđ { $component } ohtâgâsâš variantâid tastko length ij lah ollesluhu.

variant-sort-not-implemented = { $component } ohtâgâsâš variantah sort:áin iä lah olášuttum

variant-exclude-combinations-not-implemented = { $component } ohtâgâsâš variantah excludeCombinations:áin iä lah olášuttum

variant-math-exclude-not-implemented = { $component } ohtâgâsâš variantah šlaajâst math exclude:áin iä lah olášuttum

variant-non-constant-exclude-not-implemented = { $component } ohtâgâsâš variantah epipisosâš exclude:áin iä lah olášuttum

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ij lah tuárjum gráf prefigure-čäitteest; maŋábuáttee kuáđáduvvoo.

prefigure-descendant-invalid-geometry = { $subject }: geometria ij lah ollágân teikkâ ij lah raajedum; maŋábuáttee kuáđáduvvoo.

prefigure-curve-label-omitted = { $subject }: nommâdâsah iä lah tuárjum nubástittum kurvaelementâin; nommâdâs kuáđáduvvoo.

prefigure-curve-unsupported-definition-type = { $subject }: tuárjumettum kurvafunktio miäruštâllâmšlaajâ '{ $definitionType }'; maŋábuáttee kuáđáduvvoo.

prefigure-region-flip-functions-unsupported = { $subject }: tuárjumettum attribuut flipFunctions regionBetweenCurves:âst; maŋábuáttee kuáđáduvvoo.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves:âst láá tuše pärnifunktioh tuárjum moh láá adelum formelijn; maŋábuáttee kuáđáduvvoo.

prefigure-label-position-unsupported =
    { $subject }: tuárjumettum labelPosition '{ $labelPosition }' tääsä { $labelKind ->
        [line-family] linjájuávhu nommâdâs
       *[point] čuoggá nommâdâs
    }; adnoo standard PreFigure-algâsaje.

prefigure-fill-style-unsupported = { $subject }: tevdimstiil '{ $fillStyle }' ij lah tuárjum PreFigure:âst; adnoo tievâs tevdim.

prefigure-line-style-unknown = { $subject }: tobdâmettum linjástiil '{ $lineStyle }' kuáđáduvâi PreFigure-pyevtittemist.

prefigure-marker-style-mapped-to-diamond = { $subject }: merkkâstiil '{ $markerStyle }' sirdojui PreFigure-stiilân 'diamond'.

prefigure-marker-style-unsupported = { $subject }: merkkâstiil '{ $markerStyle }' ij lah tuárjum PreFigure:âst; adnoo standardstiil.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: kelbottes `ref`; ulme ij pyevti kavnâđ. Merkkâšume kuáđáduvvoo.

annotation-ref-multiple-targets = `<annotation>`: `ref` čujottij maaŋgâ ulmen; adnoo vuosmuš.

annotation-ref-outside-graph = `<annotation>`: kelbottes `ref`; ulme lii gráf ulguubeln mast tot lii. Merkkâšume kuáđáduvvoo.

annotation-ref-unsupported-target = `<annotation>`: kelbottes `ref`; ulme ij lah tuárjum gráfâlâš objekt prefigure-nubástittimist. Merkkâšume kuáđáduvvoo.

annotation-text-missing = `<annotation>`: `text` váilu teikkâ lii kuorâs; pyevtittuvvoo kuorâs tekstâ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Pirâčadnâšume lii kavnum.
       *[other] Pirâčadnâšume kavnum mast lii `<{ $componentType }>`-komponent mieldi.
    }

reference-no-referent = Ij kavnum čujottâs ulmen: `{ $reference }`

reference-multiple-referents = Kavnujii maaŋgâ čujottâs ulme: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Kelbottes hämi attribuutân { $attribute } taan alne: `<{ $componentType }>`.

children-invalid = Kelbottes päärnáh tääsä `<{ $componentType }>`: kavnujii kelbottes päärnáh: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Kelbottes árvu `{ $value }` attribuutân `{ $attribute }`, adnoo árvu `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML verzio { $version } ij kavnum.
       *[other] DoenetML verzio { $version } ij kavnum. Adnoo verzio { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Kelbottes DoenetML: { $content }

parse-tag-missing-close-tag = Kelbottes DoenetML: kilkkurist `{ $tag }` ij lah peittimkilkkur. Vuárdojui jieš peittee kilkkur teikkâ `</{ $tagName }>`-kilkkur.

parse-tag-error = Kelbottes DoenetML: meddâdâs kilkkurist `<{ $tagName }>`

parse-attribute-missing-value = Kelbottes DoenetML: kelbottes attribuutist `{ $attribute }` orroo väilumin árvu.

parse-attribute-invalid = Kelbottes DoenetML: kelbottes attribuut `{ $attribute }`

parse-attribute-value-invalid = Kelbottes DoenetML: kelbottes attribuutárvu `{ $value }`

parse-attribute-value-quote-mismatch = Kelbottes DoenetML: kelbottes attribuutárvu `{ $value }`. Sitaatmerkkâ iä heivi oohtân. Orroo väilumin `{ $quote }`

parse-open-tag-name-missing = Kelbottes DoenetML: kavnujii kilkkur mast ij lah nommâ, ovdâmerkkân `<`

parse-tag-not-closed = Kelbottes DoenetML: kilkkur `{ $tag }` ij lah peittum (orroo väilumin `>`).

parse-self-closing-tag-name-missing = Kelbottes DoenetML: kavnujii kilkkur mast ij lah nommâ `<{ $content }>`

parse-self-closing-tag-not-closed = Kelbottes DoenetML: kilkkur `{ $tag }` ij lah peittum (orroo väilumin `/>`).

parse-tag-invalid-attributes = Kelbottes DoenetML: kilkkur `{ $tag }` ij lah kelbee. Tast pyehtih leđe kelbottes attribuutah.

parse-close-tag-name-missing = Kelbottes DoenetML: kavnujii peittimkilkkur mast ij lah nommâ, ovdâmerkkân `</`

parse-attribute-value-unquoted = Attribuutáárvuh kalgeh leđe sitaatmerkkâi siste: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Kelbottes DoenetML: kavnujii peittimkilkkur `{ $tag }`, mut ij kavnum vástideijee räppimkilkkur

parse-close-tag-mismatched = Kelbottes DoenetML: peittimkilkkur ij heivi. Vuárdojui `</{ $expected }>`. Kavnujii `{ $found }`

parser-node-unconvertible = Ij pottâm nubástittiđ čuoggá { $node } Dast-čuoggán.

## Names

name-attribute-invalid =
    Kelbottes attribuut name='{ $name }'. { $reason ->
        [characters] Noomâin pyehtih leđe tuše puustâvah, loho, vyelisárgááh teikkâ sárgááh.
       *[start] Noomah kalgeh álgiđ puustâváin.
    }

component-name-invalid-start = Kelbottes komponentnommâ "{ $name }". Noomah kalgeh álgiđ puustâváin.

## `<answer>` sugar

answer-video-watched-missing-video = Answer mast lii šlaajâ videoWatched kalga leđe attribuut video

answer-video-watched-video-not-reference = Answer mast lii šlaajâ videoWatched kalga leđe attribuut video mii lii čujottâs

answer-name-not-single-text = Answer attribuutist name kalga leđe ohtâ tekstâpärni

## Referencing another document

external-doenetml-recursion-limit = Ij pyevti vieččâđ olgomiel DoenetML tastko láá memmâ maaŋgâ rekursiivlâš tase. Lii-uv tääbbin pirâčujottâs?

external-doenetml-unavailable = Ij pyevti vieččâđ DoenetML tääbbin { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Kelbottes DoenetML vieččâlum tääbbin { $attribute }="{ $uri }": tot ij heivim komponentšlaajân "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribuut `{ $from }` lii puárásmâm; adne tot sajaan `{ $to }`.
       *[other] [deprecation] Attribuut `{ $from }` taan alne `<{ $component }>` lii puárásmâm; adne tot sajaan `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribuut `{ $from }` lii puárásmâm ige adnuu tastko meiddei `{ $to }` lii adelum.
       *[other] [deprecation] Attribuut `{ $from }` taan alne `<{ $component }>` lii puárásmâm ige adnuu tastko meiddei `{ $to }` lii adelum.
    }

deprecated-attribute-ignored = [deprecation] Attribuut `{ $attribute }` taan alne `<{ $component }>` lii puárásmâm ige adnuu.

deprecated-attribute-to-child = [deprecation] Attribuut `{ $attribute }` taan alne `<{ $component }>` lii puárásmâm; adne tot sajaan `<{ $child }>`-pärni.

deprecated-attribute-value-renamed = [deprecation] Árvu `{ $value }` attribuutist `{ $attribute }` taan alne `<{ $component }>` lii puárásmâm; adne tot sajaan `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` puáhtá rähtiđ maaŋgâlovo tuše eŋgâlâskielân, nuuvt ete ton tekstâ pääcá muttâhánnáá tovâttâsâst mii lii čalluum taan kielân: { $locale }. Čäällih maaŋgâlovo hämi njuolgá, teikkâ adde tom attribuutáin `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemeent `<{ $tag }>` ij lah tobdum Doenet-elemeent.

schema-element-not-allowed-at-root = Elemeent `<{ $tag }>` ij lah luávdum tovâttâs ruotâsist.

schema-element-not-allowed-inside = Elemeent `<{ $tag }>` ij lah luávdum taan siste: `<{ $parent }>`.

schema-attribute-unrecognized = Elemeentist `<{ $tag }>` ij lah attribuut noomáin `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribuut `{ $attribute }` elemeentist `<{ $tag }>` kalga leđe listu mast jyehi läšluu lii ohtâ tain: { $allowed }
       *[other] Attribuut `{ $attribute }` elemeentist `<{ $tag }>` kalga leđe ohtâ tain: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Kelbottes variantnommâ tääsä select. Variantnommâ { $variantName } lii { $numOptions } molsâeevtust, mut väljimlohomiäri lii { $numToSelect }.

select-variant-name-without-options = Motomeh variantah láá adelum tääsä select, mut molsâeevtuh iä lah adelum máhđulâš variantnoomân: { $variantName }.

select-variant-name-not-possible = Variantnommâ { $variantName } mii lii adelum tääsä select ij lah máhđulâš variantnommâ.

select-too-few-options = Ij pyevti väljiđ { $numToSelect } komponent tuše { $numOptions } kooskâst.

select-from-sequence-too-few-values = Ij pyevti väljiđ { $numToSelect } árvu rääidust mast lii kuhesvuotâ { $length }.

select-from-sequence-indices-count-mismatch = Indeksâi lohomiäri mii lii adelum tääsä select kalga heiviđ väljimlohomiärán

select-from-sequence-indices-not-integers = Puoh indeksah moh láá adelum tääsä select kalgeh leđe ollesloho

select-from-sequence-index-excluded = Adelum selectfromsequence-indeks lâi olgospiejum

select-from-sequence-indices-excluded-combination = Adelum selectfromsequence-indeksah lijjii olgospiejum kombinaatio

select-from-sequence-coprime-not-positive-integers = Ij pyevti väljiđ ohtsâšfaktordis kombinaatioid tastko positiivlâš ollesloho iä välljijuu.

select-from-sequence-coprime-common-factor = Ij pyevti väljiđ ohtsâšfaktordis lovoid. Puoh máhđulâš áárvuin lii ohtsâš faktor. ("from" teikkâ "to" adelum áárvuh kalgeh leđe ohtsâšfaktordis "step" ohtâvuođâst.)

select-from-sequence-coprime-single-number = Ij pyevti väljiđ ohtsâšfaktordis kombinaatioid ohtâ lovost mii ij lah 1.

select-from-sequence-excluded-too-many-combinations = Ennuv ko 70% kombinaatioin olgospiejoo selectFromSequence:âst

select-from-sequence-coprime-none-found = Ij pottâm väljiđ ohtsâšfaktordis lovoid. Puoh máhđulâš áárvuin lii ohtsâš faktor.

select-from-sequence-too-few-unique-values = Ij pyevti väljiđ { $numToSelect } ohtâgâsâš árvu rääidust mast lii kuhesvuotâ { $numPossibleValues }

select-prime-numbers-too-few-values = Ij pyevti väljiđ { $numToSelect } árvu priimuloholistust mast lii kuhesvuotâ { $numValues }

select-prime-numbers-values-count-mismatch = Áárvui lohomiäri mii lii adelum tääsä select kalga heiviđ väljimlohomiärán

select-prime-numbers-values-not-prime = Puoh áárvuh moh láá adelum priimulovo väljimân kalgeh leđe priimuloholistust

select-prime-numbers-values-excluded-combination = Adelum selectPrimeNumbers-áárvuh lijjii olgospiejum kombinaatio

select-prime-numbers-excluded-too-many-combinations = Ennuv ko 70% kombinaatioin olgospiejoo selectPrimeNumbers:âst

select-random-combination-fluke = Eromâš epijáhusâš suáttámist ij pottâm väljiđ luávdum áárvui kombinaatio

select-random-value-fluke = Eromâš epijáhusâš suáttámist ij pottâm väljiđ luávdum árvu
