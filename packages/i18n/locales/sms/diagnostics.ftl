# Skolt Sami diagnostics. Translated from `locales/en/diagnostics.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
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
# Written with Skolt's own letters and the palatalisation mark `ʹ`; see
# `chrome.ftl` for what that mark is and for how much of this vocabulary is
# derived from Northern Sami rather than attested in Skolt. The technical nouns
# are the international ones a Skolt-speaking author meets in the DoenetML
# documentation and in a Finnish schoolbook — «komponeʹntt», «attribuutt»,
# «funktio», «indeks» — rather than coinages this seed would have had to make
# up.
#
# Skolt counts in three categories, `one`, `two` and `other`, and a message
# here writes them out only where they differ. Where English separates a
# singular from a plural in the verb alone — "is ignored" against "are
# ignored" — Skolt marks number on the verb too, so `one` and `*[other]` are
# kept; the dual is not written out beside them, because the verb's dual is not
# what a list of two attribute names selects.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ij vääldâst lokku ko kueʹhtt ǩeäčččuõkkâz lie uʹvddum
       *[other] { $attributes } jiâ vääldâst lokku ko kueʹhtt ǩeäčččuõkkâz lie uʹvddum
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ij vääldâst lokku ko sooǥǥas ǩeäčččuõkkâz da kõskkčuõkkâz lie uʹvddum
       *[other] { $attributes } jiâ vääldâst lokku ko sooǥǥas ǩeäčččuõkkâz da kõskkčuõkkâz lie uʹvddum
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ij tuâjjad kõskkčuõkkâz tääʹvv

## `<line>`

line-points-undetermined-dimensions = Linjj čuõkkâzi mieʹldd koin dimensio jiâ leäkku meäʹrtõllum.

line-points-too-few-dimensions = Linjj õõlǥat mõõnnâd čuõkkâzi mieʹldd koin lie uuʹccmõsân kueʹhtt dimensio.

line-points-depend-on-variables = Linjj mâânn čuõkkâzi mieʹldd kook lie sorjjâd variaabelin: { $variables }.

line-equation-invalid-format = Kuõskteʹmes hämm linjj tässõʹsse variaabelin { $variable1 } da { $variable2 }.

## `<ray>`

ray-overprescribed-through = Peällinjj lij meäʹrtõllum through, endpoint da direction pääiʹǩ. Uʹvddum through ij vääldâst lokku.

ray-dimension-mismatch = numDimensions ij šeât ray:est.

## `<vector>`

vector-overprescribed-head = Vektor lij meäʹrtõllum head, tail da displacement pääiʹǩ. Uʹvddum head ij vääldâst lokku.

vector-dimension-mismatch = numDimensions ij šeât vector:est.

## Attracting and constraining

attract-to-without-nearest-point = Ij vueiʹt kuõsstjed tän: `<{ $component }>` tõn diõtt ko tõʹst ij leäkku nearestPoint stäättvariaabel.

constrain-to-without-nearest-point = Ij vueiʹt rääʹjjed tän: `<{ $component }>` tõn diõtt ko tõʹst ij leäkku nearestPoint stäättvariaabel.

constrain-to-interior-without-nearest-point = Ij vueiʹt rääʹjjed tän seʹst: `<{ $component }>` tõn diõtt ko tõʹst ij leäkku nearestPoint stäättvariaabel.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ij vääldâst lokku choiceInput:est mii ij leäkku inline

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput:e uʹvddum indeeʹks jiâ vääldâst lokku tõn diõtt ko indeeʹksi mieʹrr ij šeât choice-päärnai miârra.

pretzel-indices-count-mismatch = problem:e uʹvddum indeeʹks jiâ vääldâst lokku tõn diõtt ko indeeʹksi mieʹrr ij šeât problem-päärnai miârra.

shuffle-indices-count-mismatch = shuffle:e uʹvddum indeeʹks jiâ vääldâst lokku tõn diõtt ko indeeʹksi mieʹrr ij šeât komponeeʹnti miârra.

indices-ignored-out-of-range = { $component }:e uʹvddum indeeʹks jiâ vääldâst lokku tõn diõtt ko mõõn-ne indeeʹks lie rääʹj oouʹdbeäʹlnn.

pretzel-indices-repeated = pretzel:e uʹvddum indeeʹks jiâ vääldâst lokku tõn diõtt ko mõõn-ne indeeʹks mainnâʹstte ođđsest.

pretzel-circuit-first-index = pretzel:e mode="circuit":est uʹvddum indeeʹks jiâ vääldâst lokku tõn diõtt ko vuõssmõs indeks õõlǥat leeʹd 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Vai `<{ $component }>` tuâjjad teekstpäärnaivuiʹm, õõlǥat attribuutt `type` leeʹd uʹvddum.

invalid-type-defaulting-to-math = Kuõskteʹmes type { $type } komponeeʹntest { $component }. Õõlǥat leeʹd math, text, number leʹbe boolean. Piijât math:n.

string-not-valid-component-to-arrange = Tekst "{ $value }" ij leäkku kuõskki komponeʹntt tän: { $component }. Ij vääldâst lokku.

## Types and variables

invalid-type-defaulting-to-number = Kuõskteʹmes type { $type }, type piijât number:n.

invalid-variable-value = Kuõskteʹmes variaabel äärv: `{ $value }`

## Variants

variant-index-must-be-number = Variantt indeks { $index } õõlǥat leeʹd nomm

variant-index-must-be-integer = Variantt indeks { $index } õõlǥat leeʹd tiuddnomm

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ij leäkku tuejjuum absoluutt mieʹttid. Vijldvuõđ piijât relatiivlažžân.

side-by-side-absolute-margins = `<{ $component }>` ij leäkku tuejjuum absoluutt mieʹttid. Rääʹd piijât relatiivlažžân.

side-by-side-no-block-child = Kuõskteʹmes `<{ $component }>`: tõʹst õõlǥat leeʹd uuʹccmõsân õhtt blokkpäärnaž.

## `<label>`

label-for-ignored-on-graphical = Attribuutt `for` graafflaž `<label>`:est ij vääldâst lokku.

label-for-must-resolve-to-one = Attribuutt `for` `<label>`:est õõlǥat vuäǯǯted tuõđi õhtte komponeʹnte.

label-for-unresolved = Attribuutt `for` `<label>`:est ij vuäittam vuäǯǯted komponeʹnte.

label-for-answer-with-authored-inputs = Attribuutt `for` `<label>`:est vuäǯǯat `<answer>`:e koʹst lie jiiʹjjes ǩeeʹrjtum sizzpiijjmõõžž; vuäǯǯet pâi sizzpiijjmõʹšše.

label-for-answer-without-input = Attribuutt `for` `<label>`:est vuäǯǯat `<answer>`:e koʹst ij leäkku sizzpiijjmõš maid miârkkad.

label-for-must-reference-input-or-answer = Attribuutt `for` `<label>`:est õõlǥat vuäǯǯted sizzpiijjmõʹšše leʹbe answer:e.

## Accessibility

accessibility-short-description-or-decorative = Vuäǯǯamvuõđ diõtt õõlǥat `<{ $component }>` leeʹd vuäʹnkõs čiõlǥtõs leʹbe leeʹd miârkkuum čeäppõssân.

accessibility-video-short-description = Vuäǯǯamvuõđ diõtt õõlǥat `<video>`:est leeʹd vuäʹnkõs čiõlǥtõs.

accessibility-input-short-description-or-label = Vuäǯǯamvuõđ diõtt õõlǥat `<{ $component }>`:est leeʹd vuäʹnkõs čiõlǥtõs leʹbe nõmmtõs.

accessibility-answer-input-short-description-or-label = Vuäǯǯamvuõđ diõtt õõlǥat `<answer>`:est mii tuejjad sizzpiijjmõõžž leeʹd vuäʹnkõs čiõlǥtõs leʹbe nõmmtõs.

accessibility-short-description-contains-math = Vuäʹnkõs čiõlǥtõõzzin jiâ âʹlǧǧe leeʹd matemaattlaž komponeeʹnt mâʹte `<{ $component }>`. Ǩeeʹrjet matematiikk sääʹnnivuiʹm.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kontraast ij leäkku tuõmmâs kapiittel pââibeäʹllǩeeʹrjtõõzz teeksta (seuʹnnjes modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ââʹnet uuʹccmõsân { $threshold }:1).
       *[other] { $colorName } kontraast ij leäkku tuõmmâs kapiittel pââibeäʹllǩeeʹrjtõõzz teeksta ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ââʹnet uuʹccmõsân { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` { $count } čuõkkâz mieʹldd ij leäkku tuejjuum tõn tiʹllest ko čuõkkâzin jiâ leäkku numeeʹrlaž äärv.

circle-too-many-through-points = Ij vueiʹt ceälkkad ǩirmmâz jäänab ko 3 čuõkkâz mieʹldd.

circle-overprescribed-radius-center-points = Ij vueiʹt ceälkkad ǩirmmâz uʹvddum radiusin, kõõskin da čuõkkâzivuiʹm.

circle-center-with-multiple-points = Ij vueiʹt ceälkkad ǩirmmâz uʹvddum kõõskin jäänab ko 1 čuõkkâz mieʹldd.

circle-radius-too-small = Ij vueiʹt ceälkkad ǩirmmâz: ko kõskk kuõiʹt čuõkkâz kõskkâst lij { $distance }, uʹvddum radius { $radius } lij liâdǥas uʹcc.

circle-radius-with-many-points = Ij vueiʹt tuejjeed ǩirmmâz jäänab ko kuõiʹt čuõkkâz mieʹldd uʹvddum radiusin.

circle-invalid-center-or-through-points = Kuõskteʹmes kõõskk leʹbe kuõskteʹmes čuõkkâz ǩirmmâzest.

circle-radius-center-with-multiple-points = Ij vueiʹt ceälkkad ǩirmmâz radius uʹvddum kõõskin jäänab ko 1 čuõkkâz mieʹldd.

circle-change-radius-non-numerical = Ij vueiʹt mõõnted ǩirmmâz radius ko čuõkkâz jiâ leäkku numeeʹrlaž

circle-radius-with-points-non-numerical = Ij vueiʹt tuejjeed ǩirmmâz jäänab ko õõut čuõkkâz mieʹldd uʹvddum radiusin ko äärv jiâ leäkku numeeʹrlaž.

circle-change-center-non-numerical = Ǩirmmâz kõõskk mõõntummuš čuõkkâzi mieʹldd koin jiâ leäkku numeeʹrlaž äärv ij leäkku tuejjuum.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ij tuõmmâs dimensio funktio meäʹrtemvuuʹd diõtt. Meäʹrtemvuuʹdest lij { $intervals } kõskk, leša funktioost { $inputs ->
            [one] lij { $inputs } sizzpiijjmõš
           *[other] lie { $inputs } sizzpiijjmõõžž
        }.
       *[other] Ij tuõmmâs dimensio funktio meäʹrtemvuuʹd diõtt. Meäʹrtemvuuʹdest lie { $intervals } kõõsk, leša funktioost { $inputs ->
            [one] lij { $inputs } sizzpiijjmõš
           *[other] lie { $inputs } sizzpiijjmõõžž
        }.
    }

function-domain-invalid-format = Kuõskteʹmes hämm funktio meäʹrtemvuuʹdest.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funktio numeeʹrlažtäävv maksim ij vääldâst lokku.
        [minimum] Funktio numeeʹrlažtäävv minim ij vääldâst lokku.
        [extremum] Funktio numeeʹrlažtäävv ekstrem ij vääldâst lokku.
        [point] Funktio numeeʹrlažtäävv čuõkkâz ij vääldâst lokku.
        [slope] Funktio numeeʹrlažtäävv luâđđam ij vääldâst lokku.
       *[other] Funktio numeeʹrlažtäävv { $type } ij vääldâst lokku.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funktio kuâss maksim ij vääldâst lokku.
        [minimum] Funktio kuâss minim ij vääldâst lokku.
        [extremum] Funktio kuâss ekstrem ij vääldâst lokku.
        [point] Funktio kuâss čuõkkâz ij vääldâst lokku.
       *[other] Funktio kuâss { $type } ij vääldâst lokku.
    }

function-points-too-close = Funktioost lie kueʹhtt čuõkkâz kook lie liâdǥas âlddsest. Funktio ij vueiʹt meäʹrtõõllâd.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funktio jueʹtǩǩummuš lij vueiʹtlvaž pâi jõs sizzpiijjmõõžži mieʹrr lij seämma ko oouʹdepuuʹtʼtõõzzi mieʹrr. Tän funktioost lij { $inputs } sizzpiijjmõš da { $outputs ->
            [one] { $outputs } oouʹdepuuʹtʼtõs
           *[other] { $outputs } oouʹdepuuʹtʼtõõzz
        }.
       *[other] Funktio jueʹtǩǩummuš lij vueiʹtlvaž pâi jõs sizzpiijjmõõžži mieʹrr lij seämma ko oouʹdepuuʹtʼtõõzzi mieʹrr. Tän funktioost lie { $inputs } sizzpiijjmõõžž da { $outputs ->
            [one] { $outputs } oouʹdepuuʹtʼtõs
           *[other] { $outputs } oouʹdepuuʹtʼtõõzz
        }.
    }

## `<sequence>`

sequence-invalid-length = Kuõskteʹmes kookkâdvuõtt raajja. Õõlǥat leeʹd negatiivlažtäävv tiuddnomm.

sequence-invalid-step = Kuõskteʹmes lääʹǩǩ raajjâst. Õõlǥat leeʹd nomm raajja koʹst lij šlaajj { $type }.

sequence-invalid-endpoint-number = Kuõskteʹmes "{ $attribute }" nommraajjâst. Õõlǥat leeʹd nomm.

sequence-invalid-endpoint-letters = Kuõskteʹmes "{ $attribute }" bukvraajjâst. Õõlǥat leeʹd bukvai kombinaatio.

sequence-invalid-endpoint = Kuõskteʹmes "{ $attribute }" raajjâst.

select-from-sequence-coprime-not-numbers = coprime ij vääldâst lokku tõn diõtt ko jiâ vaʹlljuku nomm

select-from-sequence-coprime-with-exclude-combinations = coprime ij vääldâst lokku tõn diõtt ko excludeCombinations lij uʹvddum

## Resolving a `target`

target-not-found = Kuõskteʹmes target tän: `<{ $source }>`: täävtõs ij kaunnu.

target-state-variable-not-found = Kuõskteʹmes target tän: `<{ $source }>`: ij kaunnu stäättvariaabel nõõmin "{ $property }" tän ool: `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` variaabel õõlǥte leeʹd jeeʹres ko sorjjteʹmes variaabel.

ode-system-duplicate-variable-names = Ij vueiʹt meäʹrtõõllâd ODE oʹlǧǧbeäʹl funktioid ko sorjjâd variaabeli nõõm mainnâʹstte ođđsest.

ode-system-rhs-function-error = Ij vueiʹt meäʹrtõõllâd ODE oʹlǧǧbeäʹl funktio. Puästtõs mathjs-funktio tuejjummšest.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ij vueiʹt meäʹrtõõllâd čiõkk { $count } linjj kõskkâst

angle-invalid-through-point = Kuõskteʹmes čuõkkâz `<angle>` through:est

parabola-vertex-too-many-points = Parabol čokkin jäänab ko 1 čuõkkâz mieʹldd ij leäkku tuejjuum.

parabola-too-many-points = Parabol jäänab ko 3 čuõkkâz mieʹldd ij leäkku tuejjuum.

intersection-too-many-items = Jäänab ko kuõiʹt diõtt čuõppâmvuõtt ij leäkku tuejjuum

## Other math components

ionic-compound-not-two-ions = Ioonlaž õhttvuõtt ij leäkku tuejjuum jeeʹres ko kuõiʹt iooʹne.

ionic-compound-needs-cation-and-anion = Ioonlaž õhttvuõtt lij tuejjuum pâi õõut katioone da õõut anioone.

solve-equations-cannot-evaluate = Ij vueiʹt čåuddâd tässõõzz tõn diõtt ko tõn ij vuäittam ceälkkad: { $equation }

math-operators-operand-number-required = Õõlǥat uʹvdded operandNumber ko vaaʹldak meädda matemaattlaž operand.

eigen-decomposition-failed = Ij vuäittam ceälkkad matriis jiiʹjjesäärvid

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameeter { $parameters } ij leäkku minstrest, nuʹtt ǥu tõt õõut jäʹrjjsteʹmes šeât kuâssa.
       *[other] `<matchesPattern>`: parameeter { $parameters } jiâ leäkku minstrest, nuʹtt ǥu tõk õõut jäʹrjjsteʹmes šiõtte kuâssa.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ij vueiʹt tuʹlǩǩeed grid="{ $grid }". Õõlǥat leeʹd none, medium, dense leʹbe kueʹhtt positiivlaž nomm kõskkin jueʹǩǩum, ouddmiârkkân grid="1 0.5". Ruõkk ij särggu.

## Vector and slope fields

field-function-wrong-num-outputs =
    `<{ $component }>` taarbaš funktio koʹst lij { $expected ->
        [one] õhtt oouʹdepuuʹtʼtõs, luâđđam y' juõʹǩǩ čuõkkâzest, ouddmiârkkân `y - x`
       *[other] kueʹhtt oouʹdepuuʹtʼtõõzz, vektor juõʹǩǩ čuõkkâzest, ouddmiârkkân `(y, -x)`
    }, leša uʹvddum funktioost lij { $found ->
        [one] { $found } oouʹdepuuʹtʼtõs
       *[other] { $found } oouʹdepuuʹtʼtõõzz
    }. { $alternative ->
        [none] Ij mõõnn särggu.
       *[other] `<{ $alternative }>` lij komponeʹntt tõn funktio diõtt. Ij mõõnn särggu.
    }

field-function-attribute-ignored-with-child = Attribuutt `function` ij vääldâst lokku tõn diõtt ko funktio lij uʹvddum še komponeeʹnt seʹst; ââʹnet tõn mii lij seʹst. Uʹvdd funktio pâi õõut naaʹlin.

field-variables-ignored =
    `<{ $component }>`: attribuutt `variables` nõõmat variaabelid ceälkkâzest mii lij ǩeeʹrjtum njuõlggâld komponeeʹnt seʹst. { $reason ->
        [function-child] Funktio lij täʹst uʹvddum `<function>`-päärnžen, mii nõõmat jiiʹjjes variaabelid, nuʹtt ǥu `variables` ij vääldâst lokku.
       *[no-expression] Seämmanallšem ceälkkâz ij leäkku täʹst uʹvddum, nuʹtt ǥu `variables` ij vääldâst lokku.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ij leäkku tuärjjuum prefigure-čuäʹjteeʹjest; ââʹnet oʹlǧǧbeäʹl sââʹj.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ij leäkku tuärjjuum prefigure-čuäʹjteeʹjest; ââʹnet pââibeäʹl sââʹj.

prefigure-invalid-axis-bounds = `<graph>`: kuõskteʹmes akselrääʹj prefigure-mõõntummša; ââʹnet standard bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: kuõskteʹmes vijldvuõtt prefigure-mõõntummša; ââʹnet standard vijldvuõtt 425.

prefigure-invalid-aspect-ratio = `<graph>`: kuõskteʹmes aspectRatio prefigure-mõõntummša; ââʹnet standard kõskkvuõtt 1.

prefigure-grid-spacing-too-fine = `<graph>`: ruõkk kõõsk lie liâdǥas uuʹcc akselrääʹji ǩiõččeen; ruõkk kuâđđai meädda prefigure-čuäʹjteeʹjest.

prefigure-annotations-not-rendered = `<graph>`: miârkkšõõvvmõõžž jiâ čuäʹjtõõvv ko PreFigure-čuäʹjteei ij ââʹnet.

multiple-annotations-children = Määŋg `<annotations>`-päärnaž kaunnâm `<graph>`:est; puk jeeʹres ko mââimõs jiâ vääldâst lokku.

## Referring to other components

copy-unrecognized-component-type = Ij vueiʹt viiddeed leʹbe mäŋgted tobddteʹmes komponeʹnttšlaaj: { $type }.

copy-prop-not-found = Ij kaunnâm jiiʹjjesvuõtt { $property } komponeeʹntest koʹst lij šlaajj { $component }

collect-no-source = Ij kaunnâm käʹldd tän: collect.

collect-invalid-component-type = Ij vueiʹt noorrâd komponeeʹntid šlaajâst `<{ $component }>` tõn diõtt ko tõt lij kuõskteʹmes komponeʹnttšlaajj.

reference-index-unavailable = Ij vueiʹt vuäǯǯted indeeʹkse `{ $reference }`

## `<callAction>`

component-action-unavailable = Ij vueiʹt kååččad { $action } komponeeʹntest `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Tuâjjteâđain lij kuõskteʹmes hämm. Linjji kookkâdvuõđ jiâ leäkku seämmanallšem. Kaunnâm täʹst: componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Tuâjjteâđain lie mainnâʹstum ceäkknõõm. Kaunnâm täʹst: componentIdx :{ $componentIdx }

data-frame-missing-column-name = Tuâjjteâđain vääžžai ceäkknõmm. Kaunnâm täʹst: componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Õhtt award tän vaʹsttõʹsse vuâđđad answer-miârk jiiʹjjes vuõltteemvaʹsttõʹsse, mii tuejjad vueʹrddteʹmes viõkk.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` piijjmõš `<answer>`:e mii lij `sectionWideCheckWork`-kaartt seʹst ij tuâjjad, tõn diõtt ko ǩiõččlõddmõõžži mieʹr håidd kaartt. Piijj `maxNumAttempts` kaartte.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` piijjmõš kaartte koʹst lij `sectionWideCheckWork` da mii lij nuuʹbb `sectionWideCheckWork`-kaartt seʹst ij tuâjjad, tõn diõtt ko ǩiõččlõddmõõžži mieʹr håidd oolǥbeäʹl kaartt. Piijj `maxNumAttempts` oolǥbeäʹl kaartte.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attribuutt { $attributes } ij tuâjjad jõs symbolicEquality ij leäkku piijjum.
       *[other] Attribuutt { $attributes } jiâ tuâjjad jõs symbolicEquality ij leäkku piijjum.
    }

answer-invalid-type = Kuõskteʹmes šlaajj vaʹsttõʹsse: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ko komponeeʹntest `<{ $component }>` ij leäkku nõmm, tõn ij vueiʹt ââʹnned moodul attribuuttân

module-attribute-name-already-defined = Komponeeʹnt `<{ $component } name="{ $name }">` ij vueiʹt ââʹnned moodul attribuuttân tõn diõtt ko komponeʹnttšlaajâst `<module>` juʹn lij attribuutt "{ $name }".

conditional-content-condition-ignored = Attribuutt `condition` ij vääldâst lokku `<conditionalContent>`:est koʹst lie case- leʹbe else-päärna.

slider-markers-type-mismatch = Miârkki šlaajj ij šeât slider:a šlaajja.

pretzel-problem-needs-statement-and-answer = Kuõskteʹmes pretzel: juõʹǩǩ `<problem>`:est õõlǥat leeʹd õhtt `<statement>` da õhtt `<answer>`.

pretzel-circuit-first-problem-distractor = Kuõskteʹmes pretzel: mode="circuit":est ij vueiʹt vuõssmõs `<problem>` leeʹd pieʹttai.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Kuõskteʹmes äärv { $values } attribuutte `{ $attribute }`; ij vääldâst lokku.
       *[other] Kuõskteʹmes äärv { $values } attribuutte `{ $attribute }`; jiâ vääldâst lokku.
    }

attribute-must-be-references = Kuõskteʹmes äärv `{ $value }` attribuutte `{ $attribute }`. Attribuutt õõlǥat leeʹd noorrum vuäǯǯtõõzzin kook aʹlǧǧe miârkin `$`.

math-input-invalid-function-names = <mathInput>: kuõskteʹmes funktionõõm täʹst { $attribute } jiâ välddum lokku: { $names }. Juõʹǩǩ nõõm čuäʹjtemvueʹss õõlǥat leeʹd uuʹccmõsân 2 miârk (bukv leʹbe särrgg); tõn mâŋŋa vuäitt čuâvvad ooccâmvueʹjj mieʹldd `|<mathspeak alternatiiv>`.

## Building components from the source

component-type-invalid = Kuõskteʹmes komponeʹnttšlaajj: `<{ $componentType }>`

attribute-repeated = Ij vueiʹt mainnâʹsted attribuutt { $attribute } ođđsest.

attribute-invalid-for-component = Kuõskteʹmes attribuutt "{ $attribute }" komponeʹnte koʹst lij šlaajj `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stiilmeäʹrtõõzzâst { $styleNumber } ij leäkku tuõmmâs kontraast tän: { $context ->
        [text-on-background] teekstkåållõõzz tuâǥǥažkåållõõzz ǩiõččeen
        [high-contrast] jõnn kontraast kåållõõzz tuâǥǥaž ǩiõččeen
        [line] linjjkåållõõzz tuâǥǥaž ǩiõččeen
        [marker] miârkkåållõõzz tuâǥǥaž ǩiõččeen
       *[text-on-canvas] teekstkåållõõzz tuâǥǥaž ǩiõččeen
    }{ $mode ->
        [dark] { " (seuʹnnjes modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ââʹnet uuʹccmõsân { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Håʹt stiilmeäʹrtõõzzâst { $styleNumber } lie kåållõõzz koin lij tuõmmâs kontraast čuvggâd modusa, seuʹnnjes modus kåållõõzzin kook tõin ceälkkjõʹvve ij leäkku tuõmmâs kontraast teekstkåållõõzz da tuâǥǥažkåållõõzz kõskkâst ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ââʹnet uuʹccmõsân { $threshold }:1). { $suggestion ->
        [available] Vai kontraast lij tuõmmâs seuʹnnjes modusâst, lââʹzzet čuvggâd modus kontraast (ouddmiârkkân piijj { $lightAttribute }="{ $lightColor }") leʹbe pââʹjjǩiõčč seuʹnnjes modus kåållõõzz (ouddmiârkkân piijj { $darkAttribute }="{ $darkColor }").
       *[none] Vai kontraast lij tuõmmâs seuʹnnjes modusâst, lââʹzzet čuvggâd modus kontraast leʹbe pââʹjjǩiõčč ceälkkjum kåållõõzzid textColorDarkMode da/leʹbe backgroundColorDarkMode pääiʹǩ.
    }

style-definition-dark-mode-text-canvas-contrast =
    Håʹt stiilmeäʹrtõõzzâst { $styleNumber } lij teekstkåållõs koʹst lij tuõmmâs kontraast čuvggâd modusa, seuʹnnjes modus teekstkåållõõzzâst mii tõʹst ceälkkjââvv ij leäkku tuõmmâs kontraast tuâǥǥaž ǩiõččeen ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ââʹnet uuʹccmõsân { $threshold }:1). { $suggestion ->
        [available] Vai kontraast lij tuõmmâs seuʹnnjes modusâst, lââʹzzet čuvggâd modus kontraast (ouddmiârkkân piijj textColor="{ $lightColor }") leʹbe pââʹjjǩiõčč seuʹnnjes modus kåållõõzz (ouddmiârkkân piijj textColorDarkMode="{ $darkColor }").
       *[none] Vai kontraast lij tuõmmâs seuʹnnjes modusâst, lââʹzzet čuvggâd modus kontraast leʹbe pââʹjjǩiõčč ceälkkjum kåållõõzz textColorDarkMode pääiʹǩ.
    }

section-multiple-style-palettes = Kapiittel vuäitt vaʹlljed pâi õõut <stylePalette>; ââʹnet mââimõs.

## Unique variants

variant-num-to-select-not-non-negative-integer = ij vueiʹt meäʹrtõõllâd { $component } jiiʹjjeslaž variantt tõn diõtt ko numToSelect ij leäkku negatiivlažtäävv tiuddnomm.

variant-num-to-select-not-constant-number = ij vueiʹt meäʹrtõõllâd { $component } jiiʹjjeslaž variantt tõn diõtt ko numToSelect ij leäkku põõšši nomm.

variant-with-replacement-not-constant-boolean = ij vueiʹt meäʹrtõõllâd { $component } jiiʹjjeslaž variantt tõn diõtt ko withReplacement ij leäkku põõšši boolean.

variant-select-weight-disables-unique = select jiiʹjjeslaž variantt lie jaukkuum jõs mõõn-ne vaʹlljummšest lij selectWeight leʹbe selectForVariants uʹvddum

variant-coprime-undetermined = ij vueiʹt meäʹrtõõllâd { $component } jiiʹjjeslaž variantt tõn diõtt ko ij vueiʹt meäʹrtõõllâd što coprime lij õõut jäʹrjjsteʹmes puästtai.

variant-attribute-not-constant = ij vueiʹt meäʹrtõõllâd { $component } jiiʹjjeslaž variantt tõn diõtt ko { $attribute } ij leäkku põõšši.

variant-attribute-not-number = ij vueiʹt meäʹrtõõllâd { $component } jiiʹjjeslaž variantt tõn diõtt ko { $attribute } ij leäkku nomm.

variant-attribute-wrong-type-for-sequence =
    ij vueiʹt meäʹrtõõllâd { $component } jiiʹjjeslaž variantt koʹst lij šlaajj { $type } tõn diõtt ko { $attribute } ij leäkku { $expected ->
        [letters-combination] bukvai kombinaatio
        [math-expression] kuõskki matemaattlaž ceälkkâz
        [integer] tiuddnomm
       *[number] nomm
    }.

variant-length-not-integer = ij vueiʹt meäʹrtõõllâd { $component } jiiʹjjeslaž variantt tõn diõtt ko length ij leäkku tiuddnomm.

variant-sort-not-implemented = { $component } jiiʹjjeslaž variantt sort:in jiâ leäkku tuejjuum

variant-exclude-combinations-not-implemented = { $component } jiiʹjjeslaž variantt excludeCombinations:in jiâ leäkku tuejjuum

variant-math-exclude-not-implemented = { $component } jiiʹjjeslaž variantt šlaajâst math exclude:in jiâ leäkku tuejjuum

variant-non-constant-exclude-not-implemented = { $component } jiiʹjjeslaž variantt põõššiteʹmes exclude:in jiâ leäkku tuejjuum

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ij leäkku tuärjjuum graaff prefigure-čuäʹjteeʹjest; mâŋŋpueʹtti kuâđđai pââʹjjel.

prefigure-descendant-invalid-geometry = { $subject }: geometria ij leäkku tiudd leʹbe ij leäkku rääʹjjum; mâŋŋpueʹtti kuâđđai pââʹjjel.

prefigure-curve-label-omitted = { $subject }: nõmmtõõzz jiâ leäkku tuärjjuum mõõnntum kuurvelemeeʹntin; nõmmtõs kuâđđai meädda.

prefigure-curve-unsupported-definition-type = { $subject }: tuärjjteʹmes kuurvfunktio meäʹrtemšlaajj '{ $definitionType }'; mâŋŋpueʹtti kuâđđai pââʹjjel.

prefigure-region-flip-functions-unsupported = { $subject }: tuärjjteʹmes attribuutt flipFunctions regionBetweenCurves:est; mâŋŋpueʹtti kuâđđai pââʹjjel.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves:est lie tuärjjuum pâi päärnaž-funktio kook lie uʹvddum formeelin; mâŋŋpueʹtti kuâđđai pââʹjjel.

prefigure-label-position-unsupported =
    { $subject }: tuärjjteʹmes labelPosition '{ $labelPosition }' tän: { $labelKind ->
        [line-family] linjjjoouk nõmmtõs
       *[point] čuõkkâz nõmmtõs
    }; ââʹnet standard PreFigure-vuâlggsââʹjj.

prefigure-fill-style-unsupported = { $subject }: teâvvtemstiil '{ $fillStyle }' ij leäkku tuärjjuum PreFigure:est; ââʹnet tiudd teâvvtõs.

prefigure-line-style-unknown = { $subject }: tobddteʹmes linjjstiil '{ $lineStyle }' kuõđđji meädda PreFigure-puuʹtʼtõõzzâst.

prefigure-marker-style-mapped-to-diamond = { $subject }: miârkstiil '{ $markerStyle }' serddji PreFigure-stiile 'diamond'.

prefigure-marker-style-unsupported = { $subject }: miârkstiil '{ $markerStyle }' ij leäkku tuärjjuum PreFigure:est; ââʹnet standardstiil.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: kuõskteʹmes `ref`; täävtõõzz ij vueiʹt kaunnâd. Miârkkšõõvvmõš kuâđđai meädda.

annotation-ref-multiple-targets = `<annotation>`: `ref` vuäǯǯti määŋg täävtõʹsse; ââʹnet vuõssmõs.

annotation-ref-outside-graph = `<annotation>`: kuõskteʹmes `ref`; täävtõs lij oolǥbeäʹlnn graaff koʹst tõt lij. Miârkkšõõvvmõš kuâđđai meädda.

annotation-ref-unsupported-target = `<annotation>`: kuõskteʹmes `ref`; täävtõs ij leäkku tuärjjuum graaffâlaž objeʹktt prefigure-mõõntummšest. Miârkkšõõvvmõš kuâđđai meädda.

annotation-text-missing = `<annotation>`: `text` vääžžai leʹbe lij kuâss; puuʹtʼtet kuâss tekst.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kruuggsorjjâdvuõtt lij kaunnâm.
       *[other] Kruuggsorjjâdvuõtt kaunnâm koʹst lij mieʹldd `<{ $componentType }>`-komponeʹntt.
    }

reference-no-referent = Ij kaunnâm vuäǯǯtõõzz uʹvddi: `{ $reference }`

reference-multiple-referents = Kaunneʹšše määŋg vuäǯǯtõõzz uʹvddi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Kuõskteʹmes hämm attribuutte { $attribute } tän ool: `<{ $componentType }>`.

children-invalid = Kuõskteʹmes päärna tän: `<{ $componentType }>`: kaunneʹšše kuõskteʹmes päärna: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Kuõskteʹmes äärv `{ $value }` attribuutte `{ $attribute }`, ââʹnet äärv `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML veršâm { $version } ij kaunnâm.
       *[other] DoenetML veršâm { $version } ij kaunnâm. Ââʹnet veršâm { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Kuõskteʹmes DoenetML: { $content }

parse-tag-missing-close-tag = Kuõskteʹmes DoenetML: miârkâst `{ $tag }` ij leäkku ǩiddeemmiârk. Vuõrddum jiiʹjjes ǩiddeei miârk leʹbe `</{ $tagName }>`-miârk.

parse-tag-error = Kuõskteʹmes DoenetML: puästtõs miârkâst `<{ $tagName }>`

parse-attribute-missing-value = Kuõskteʹmes DoenetML: attribuuttâst `{ $attribute }` õrr vääžžmen äärv.

parse-attribute-invalid = Kuõskteʹmes DoenetML: kuõskteʹmes attribuutt `{ $attribute }`

parse-attribute-value-invalid = Kuõskteʹmes DoenetML: kuõskteʹmes attribuuttäärv `{ $value }`

parse-attribute-value-quote-mismatch = Kuõskteʹmes DoenetML: kuõskteʹmes attribuuttäärv `{ $value }`. Sitaattmiârk jiâ šeât õõutsââʹje. Õrr vääžžmen `{ $quote }`

parse-open-tag-name-missing = Kuõskteʹmes DoenetML: kaunnji miârk koʹst ij leäkku nõmm, ouddmiârkkân `<`

parse-tag-not-closed = Kuõskteʹmes DoenetML: miârk `{ $tag }` ij ǩiddjum (õrr vääžžmen `>`).

parse-self-closing-tag-name-missing = Kuõskteʹmes DoenetML: kaunnji miârk koʹst ij leäkku nõmm `<{ $content }>`

parse-self-closing-tag-not-closed = Kuõskteʹmes DoenetML: miârk `{ $tag }` ij ǩiddjum (õrr vääžžmen `/>`).

parse-tag-invalid-attributes = Kuõskteʹmes DoenetML: miârk `{ $tag }` ij leäkku kuõskki. Tõʹst vuäiʹtte leeʹd kuõskteʹmes attribuutt.

parse-close-tag-name-missing = Kuõskteʹmes DoenetML: kaunnji ǩiddeemmiârk koʹst ij leäkku nõmm, ouddmiârkkân `</`

parse-attribute-value-unquoted = Attribuuttäärv õõlǥte leeʹd sitaattmiârkki seʹst: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Kuõskteʹmes DoenetML: kaunnji ǩiddeemmiârk `{ $tag }`, leša ij kaunnâm vaʹsttõõđi ääʹvteemmiârk

parse-close-tag-mismatched = Kuõskteʹmes DoenetML: ǩiddeemmiârk ij šeât. Vuõrddum `</{ $expected }>`. Kaunnji `{ $found }`

parser-node-unconvertible = Ij vuäittam mõõnted čuõkkâz { $node } Dast-čuõkkâzin.

## Names

name-attribute-invalid =
    Kuõskteʹmes attribuutt name='{ $name }'. { $reason ->
        [characters] Nõõmin vuäiʹtte leeʹd pâi bukv, nomm, vuâlaʹsärrǧǧ leʹbe särrgg.
       *[start] Nõõm õõlǥte aalǥted bukvin.
    }

component-name-invalid-start = Kuõskteʹmes komponeʹnttnõmm "{ $name }". Nõõm õõlǥte aalǥted bukvin.

## `<answer>` sugar

answer-video-watched-missing-video = Answer koʹst lij šlaajj videoWatched õõlǥat leeʹd attribuutt video

answer-video-watched-video-not-reference = Answer koʹst lij šlaajj videoWatched õõlǥat leeʹd attribuutt video mii lij vuäǯǯtõs

answer-name-not-single-text = Answer attribuuttâst name õõlǥat leeʹd õhtt teekstpäärnaž

## Referencing another document

external-doenetml-recursion-limit = Ij vueiʹt vuäǯǯad oolǥbeäʹl DoenetML tõn diõtt ko lie liâdǥas määŋg rekursiivlaž tääʹzz. Leäkku-a täʹst kruuggvuäǯǯtõs?

external-doenetml-unavailable = Ij vueiʹt vuäǯǯad DoenetML täʹst { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Kuõskteʹmes DoenetML vuäǯǯum täʹst { $attribute }="{ $uri }": tõt ij šõõttâm komponeʹnttšlaajja "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribuutt `{ $from }` lij puärrsmam; ââʹn pâi `{ $to }`.
       *[other] [deprecation] Attribuutt `{ $from }` tän ool `<{ $component }>` lij puärrsmam; ââʹn pâi `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribuutt `{ $from }` lij puärrsmam da ij vääldâst lokku tõn diõtt ko še `{ $to }` lij uʹvddum.
       *[other] [deprecation] Attribuutt `{ $from }` tän ool `<{ $component }>` lij puärrsmam da ij vääldâst lokku tõn diõtt ko še `{ $to }` lij uʹvddum.
    }

deprecated-attribute-ignored = [deprecation] Attribuutt `{ $attribute }` tän ool `<{ $component }>` lij puärrsmam da ij vääldâst lokku.

deprecated-attribute-to-child = [deprecation] Attribuutt `{ $attribute }` tän ool `<{ $component }>` lij puärrsmam; ââʹn pâi `<{ $child }>`-päärnaž.

deprecated-attribute-value-renamed = [deprecation] Äärv `{ $value }` attribuuttâst `{ $attribute }` tän ool `<{ $component }>` lij puärrsmam; ââʹn pâi `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` vuäitt tuejjeed määŋgeslååǥǥ pâi eŋgglõsǩiõʹlle, nuʹtt ǥu tõn tekst pååcc mõõntteʹmes teâttǩeʹrjjest mii lij ǩeeʹrjtum tän ǩiõʹlle: { $locale }. Ǩeeʹrjet määŋgeslååǥǥ hääʹm njuõlggâld, leʹbe uʹvdd tõn attribuuttin `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemeʹntt `<{ $tag }>` ij leäkku tobddum Doenet-elemeʹntt.

schema-element-not-allowed-at-root = Elemeʹntt `<{ $tag }>` ij leäkku lååʹpplaž teâttǩeeʹrj maadârest.

schema-element-not-allowed-inside = Elemeʹntt `<{ $tag }>` ij leäkku lååʹpplaž tän seʹst: `<{ $parent }>`.

schema-attribute-unrecognized = Elemeeʹntest `<{ $tag }>` ij leäkku attribuutt nõõmin `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribuutt `{ $attribute }` elemeeʹntest `<{ $tag }>` õõlǥat leeʹd liistt koʹst juõʹǩǩ vuäzzlaž lij õhtt täin: { $allowed }
       *[other] Attribuutt `{ $attribute }` elemeeʹntest `<{ $tag }>` õõlǥat leeʹd õhtt täin: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Kuõskteʹmes variantnõmm tän: select. Variantnõmm { $variantName } lij { $numOptions } vaʹlljummšest, leša vaʹlljeemmieʹrr lij { $numToSelect }.

select-variant-name-without-options = Mõõn-ne variantt lie uʹvddum tän: select, leša vaʹlljummuž jiâ leäkku uʹvddum vueiʹtlvaž variantnõʹmme: { $variantName }.

select-variant-name-not-possible = Variantnõmm { $variantName } mii lij uʹvddum tän: select ij leäkku vueiʹtlvaž variantnõmm.

select-too-few-options = Ij vueiʹt vaʹlljed { $numToSelect } komponeeʹnt pâi { $numOptions } kõskkâst.

select-from-sequence-too-few-values = Ij vueiʹt vaʹlljed { $numToSelect } äärv raajjâst koʹst lij kookkâdvuõtt { $length }.

select-from-sequence-indices-count-mismatch = Indeeʹksi mieʹrr mii lij uʹvddum tän: select õõlǥat šõddâd vaʹlljeemmiârra

select-from-sequence-indices-not-integers = Puk indeeʹks kook lie uʹvddum tän: select õõlǥte leeʹd tiuddnomm

select-from-sequence-index-excluded = Uʹvddum selectfromsequence-indeks leäi meädlõddum

select-from-sequence-indices-excluded-combination = Uʹvddum selectfromsequence-indeeʹks leʹjje meädlõddum kombinaatio

select-from-sequence-coprime-not-positive-integers = Ij vueiʹt vaʹlljed õhttsažfaktorteʹmes kombinaatioid tõn diõtt ko jiâ vaʹlljuku positiivlaž tiuddnomm.

select-from-sequence-coprime-common-factor = Ij vueiʹt vaʹlljed õhttsažfaktorteʹmes nommid. Puk vueiʹtlvaž äärvin lij õhttsaž faktor. ("from" leʹbe "to" uʹvddum äärv õõlǥte leeʹd õhttsažfaktorteʹmes "step" ǩiõččeen.)

select-from-sequence-coprime-single-number = Ij vueiʹt vaʹlljed õhttsažfaktorteʹmes kombinaatioid õõut nommâst mii ij leäkku 1.

select-from-sequence-excluded-too-many-combinations = Jäänab ko 70% kombinaatioin meädlõsttum selectFromSequence:est

select-from-sequence-coprime-none-found = Ij vuäittam vaʹlljed õhttsažfaktorteʹmes nommid. Puk vueiʹtlvaž äärvin lij õhttsaž faktor.

select-from-sequence-too-few-unique-values = Ij vueiʹt vaʹlljed { $numToSelect } jiiʹjjeslaž äärv raajjâst koʹst lij kookkâdvuõtt { $numPossibleValues }

select-prime-numbers-too-few-values = Ij vueiʹt vaʹlljed { $numToSelect } äärv priimnommliisttest koʹst lij kookkâdvuõtt { $numValues }

select-prime-numbers-values-count-mismatch = Äärvi mieʹrr mii lij uʹvddum tän: select õõlǥat šõddâd vaʹlljeemmiârra

select-prime-numbers-values-not-prime = Puk äärv kook lie uʹvddum priimnomm vaʹlljummša õõlǥte leeʹd priimnommliisttest

select-prime-numbers-values-excluded-combination = Uʹvddum selectPrimeNumbers-äärv leʹjje meädlõddum kombinaatio

select-prime-numbers-excluded-too-many-combinations = Jäänab ko 70% kombinaatioin meädlõsttum selectPrimeNumbers:est

select-random-combination-fluke = Samai jåʹttteʹmes soottâm ij vuäittam vaʹlljed sååʹrmes äärvi kombinaatio

select-random-value-fluke = Samai jåʹttteʹmes soottâm ij vuäittam vaʹlljed sååʹrmes äärv
