# Venda diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] { $attributes } i a fhelelwa musi dziphoinnti mbili dza magumo dzo bulwa
       *[other] { $attributes } dzi a fhelelwa musi dziphoinnti mbili dza magumo dzo bulwa
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } i a fhelelwa musi phoinnti ya magumo na phoinnti ya vhukati dzo bulwa dzoṱhe
       *[other] { $attributes } dzi a fhelelwa musi phoinnti ya magumo na phoinnti ya vhukati dzo bulwa dzoṱhe
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset a i na mvelelo hu si na phoinnti ya vhukati

## `<line>`

line-points-undetermined-dimensions = Mutalo u fhiraho kha dziphoinnti dza vhuhulu vhu sa ḓivhiwi.

line-points-too-few-dimensions = Mutalo u fanela u fhira kha dziphoinnti dza vhuhulu ha mbili u ya fhasi.

line-points-depend-on-variables = Mutalo u fhira kha dziphoinnti dzi ḓitikaho nga zwishandukisi: { $variables }.

line-equation-invalid-format = Tshivhumbeo tsho khakheaho tsha ikweishini ya mutalo kha zwishandukisi { $variable1 } na { $variable2 }.

## `<ray>`

ray-overprescribed-through = Reyi yo bulwa nga through, endpoint na direction.  Hu khou fhelelwa through yo bulwaho.

ray-dimension-mismatch = numDimensions a i tshimbilelani kha reyi.

## `<vector>`

vector-overprescribed-head = Vhekhithara yo bulwa nga head, tail na displacement.  Hu khou fhelelwa head yo bulwaho.

vector-dimension-mismatch = numDimensions a i tshimbilelani kha vhekhithara.

## Attracting and constraining

attract-to-without-nearest-point = A zwi konadzei u kokodza kha `<{ $component }>` ngauri a i na tshishandukisi tsha vhuimo tsha nearestPoint.

constrain-to-without-nearest-point = A zwi konadzei u thivhela kha `<{ $component }>` ngauri a i na tshishandukisi tsha vhuimo tsha nearestPoint.

constrain-to-interior-without-nearest-point = A zwi konadzei u thivhela nga ngomu ha `<{ $component }>` ngauri a i na tshishandukisi tsha vhuimo tsha nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition i a fhelelwa kha choiceInput i si ya inline

## Ordering children by index

choice-input-indices-count-mismatch = Hu khou fhelelwa dzinomboro dzo bulwaho kha choiceInput ngauri tshivhalo tsha dzinomboro a tshi tshimbilelani na tshivhalo tsha vhana vha khetho.

pretzel-indices-count-mismatch = Hu khou fhelelwa dzinomboro dzo bulwaho kha problem ngauri tshivhalo tsha dzinomboro a tshi tshimbilelani na tshivhalo tsha vhana vha problem.

shuffle-indices-count-mismatch = Hu khou fhelelwa dzinomboro dzo bulwaho kha shuffle ngauri tshivhalo tsha dzinomboro a tshi tshimbilelani na tshivhalo tsha zwiteṅwa.

indices-ignored-out-of-range = Hu khou fhelelwa dzinomboro dzo bulwaho kha { $component } ngauri dziṅwe dzi nnḓa ha muhaṱo.

pretzel-indices-repeated = Hu khou fhelelwa dzinomboro dzo bulwaho kha pretzel ngauri dziṅwe dzo dovholololwa.

pretzel-circuit-first-index = Hu khou fhelelwa dzinomboro dzo bulwaho kha pretzel kha mode wa circuit ngauri nomboro ya u thoma i fanela u vha 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Uri `<{ $component }>` i shume na vhana vha maipfi, tshiteṅwa tsha `type` tshi fanela u bulwa.

invalid-type-defaulting-to-math = Lushaka { $type } lwo khakhea kha tshiteṅwa tsha { $component }. Lu fanela u vha luṅwe lwa math, text, number kana boolean. Hu khou vhewa math sa zwa kale.

string-not-valid-component-to-arrange = Ipfi "{ $value }" a si tshiteṅwa tshi tendelwaho kha { $component }. Hu khou fhelelwa.

## Types and variables

invalid-type-defaulting-to-number = Lushaka { $type } lwo khakhea, lushaka lu khou vhewa kha number.

invalid-variable-value = Ndeme yo khakheaho ya tshishandukisi: `{ $value }`

## Variants

variant-index-must-be-number = Nomboro ya lushaka { $index } i fanela u vha tshivhalo

variant-index-must-be-integer = Nomboro ya lushaka { $index } i fanela u vha tshivhalo tsho fhelelaho

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` a yo ngo itelwa milingo yo fhelelaho. Vhuphara vhu khou vhewa kha ha vhulinganyi.

side-by-side-absolute-margins = `<{ $component }>` a yo ngo itelwa milingo yo fhelelaho. Mikano i khou vhewa kha ya vhulinganyi.

side-by-side-no-block-child = `<{ $component }>` yo khakheaho: i fanela u vha na ṅwana muthihi wa buloko u ya fhasi.

## `<label>`

label-for-ignored-on-graphical = Tshiteṅwa tsha `for` kha `<label>` ya tshifanyiso tshi a fhelelwa.

label-for-must-resolve-to-one = Tshiteṅwa tsha `for` kha `<label>` tshi fanela u sumbedza kha tshiteṅwa tshithihi fhedzi.

label-for-unresolved = Tshiteṅwa tsha `for` kha `<label>` a tsho ngo kona u sumbedza kha tshiteṅwa.

label-for-answer-with-authored-inputs = Tshiteṅwa tsha `for` kha `<label>` tshi sumbedza kha `<answer>` i re na ndzheniso dzo ṅwalwaho nga muṅwali; sumbedza kha ndzheniso zwi tou livha.

label-for-answer-without-input = Tshiteṅwa tsha `for` kha `<label>` tshi sumbedza kha `<answer>` i si na ndzheniso ine ya nga vhewa dzina.

label-for-must-reference-input-or-answer = Tshiteṅwa tsha `for` kha `<label>` tshi fanela u sumbedza kha ndzheniso kana kha phindulo.

## Accessibility

accessibility-short-description-or-decorative = U itela u swikelela, `<{ $component }>` i fanela u vha na ṱhalutshedzo pfufhi kana i bulwe sa decorative.

accessibility-video-short-description = U itela u swikelela, `<video>` i fanela u vha na ṱhalutshedzo pfufhi.

accessibility-input-short-description-or-label = U itela u swikelela, `<{ $component }>` i fanela u vha na ṱhalutshedzo pfufhi kana dzina.

accessibility-answer-input-short-description-or-label = U itela u swikelela, `<answer>` i sikaho ndzheniso i fanela u vha na ṱhalutshedzo pfufhi kana dzina.

accessibility-short-description-contains-math = Ṱhalutshedzo pfufhi a dzi fanelwi u vha na zwiteṅwa zwa mbalo sa `<{ $component }>`. Ṅwala mbalo nga maipfi.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } a i na phambano yo linganaho ya maṅwalwa a ṱhoho ya khethekanyo (nḓila swifha) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; hu ṱoḓea { $threshold }:1 u ya fhasi).
       *[other] { $colorName } a i na phambano yo linganaho ya maṅwalwa a ṱhoho ya khethekanyo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; hu ṱoḓea { $threshold }:1 u ya fhasi).
    }

## `<circle>`

circle-through-points-non-numerical = A ho ngo itwa `<circle>` i fhiraho kha dziphoinnti dza { $count } hune dziphoinnti dza sa vhe na ndeme dza tshivhalo.

circle-too-many-through-points = A zwi konadzei u vhala tshiṱenderedzwa tshi fhiraho kha dziphoinnti dzi fhiraho tharu.

circle-overprescribed-radius-center-points = A zwi konadzei u vhala tshiṱenderedzwa nga radiasi, vhukati na dziphoinnti dzo bulwaho.

circle-center-with-multiple-points = A zwi konadzei u vhala tshiṱenderedzwa nga vhukati ho bulwaho tshi fhiraho kha phoinnti i fhiraho nthihi.

circle-radius-too-small = A zwi konadzei u vhala tshiṱenderedzwa: samusi lapfu vhukati ha dziphoinnti mbili ndi { $distance }, radiasi { $radius } yo bulwaho ndi ṱhukhu vhukuma.

circle-radius-with-many-points = A zwi konadzei u sika tshiṱenderedzwa tshi fhiraho kha dziphoinnti dzi fhiraho mbili nga radiasi yo bulwaho.

circle-invalid-center-or-through-points = Vhukati kana dziphoinnti dza tshiṱenderedzwa zwo khakhea.

circle-radius-center-with-multiple-points = A zwi konadzei u vhala radiasi ya tshiṱenderedzwa nga vhukati ho bulwaho tshi fhiraho kha phoinnti i fhiraho nthihi.

circle-change-radius-non-numerical = A zwi konadzei u shandula radiasi ya tshiṱenderedzwa tshi fhiraho kha dziphoinnti dzi si na tshivhalo

circle-radius-with-points-non-numerical = A zwi konadzei u sika tshiṱenderedzwa tshi fhiraho kha phoinnti i fhiraho nthihi nga radiasi yo bulwaho arali hu si na ndeme dza tshivhalo.

circle-change-center-non-numerical = A ho ngo itwa u shandula vhukati ha tshiṱenderedzwa tshi fhiraho kha dziphoinnti dzi si na ndeme dza tshivhalo.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Vhuhulu a vhu ngo lingana kha fhethu ha mushumo. Fhethu hu na tshifhinga tsha { $intervals } fhedzi mushumo u na { $inputs ->
            [one] ndzheniso ya { $inputs }
           *[other] ndzheniso dza { $inputs }
        }.
       *[other] Vhuhulu a vhu ngo lingana kha fhethu ha mushumo. Fhethu hu na zwifhinga zwa { $intervals } fhedzi mushumo u na { $inputs ->
            [one] ndzheniso ya { $inputs }
           *[other] ndzheniso dza { $inputs }
        }.
    }

function-domain-invalid-format = Tshivhumbeo tsho khakheaho tsha fhethu ha mushumo.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Hu khou fhelelwa ndeme khulwane i si ya tshivhalo ya mushumo.
        [minimum] Hu khou fhelelwa ndeme ṱhukhu i si ya tshivhalo ya mushumo.
        [extremum] Hu khou fhelelwa ndeme ya magumo i si ya tshivhalo ya mushumo.
        [point] Hu khou fhelelwa phoinnti i si ya tshivhalo ya mushumo.
        [slope] Hu khou fhelelwa u sendama hu si ha tshivhalo ha mushumo.
       *[other] Hu khou fhelelwa { $type } i si ya tshivhalo ya mushumo.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Hu khou fhelelwa ndeme khulwane i si na tshithu ya mushumo.
        [minimum] Hu khou fhelelwa ndeme ṱhukhu i si na tshithu ya mushumo.
        [extremum] Hu khou fhelelwa ndeme ya magumo i si na tshithu ya mushumo.
        [point] Hu khou fhelelwa phoinnti i si na tshithu ya mushumo.
       *[other] Hu khou fhelelwa { $type } i si na tshithu ya mushumo.
    }

function-points-too-close = Mushumo u na dziphoinnti mbili dzi re tsini vhukuma. A zwi konadzei u ṱalutshedza mushumo.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] U dovholola ha mushumo hu a konadzea fhedzi arali tshivhalo tsha ndzheniso tsho lingana na tshivhalo tsha mbuyelo. Mushumo uyu u na ndzheniso ya { $inputs } na { $outputs ->
            [one] mbuyelo ya { $outputs }
           *[other] mbuyelo dza { $outputs }
        }.
       *[other] U dovholola ha mushumo hu a konadzea fhedzi arali tshivhalo tsha ndzheniso tsho lingana na tshivhalo tsha mbuyelo. Mushumo uyu u na ndzheniso dza { $inputs } na { $outputs ->
            [one] mbuyelo ya { $outputs }
           *[other] mbuyelo dza { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Vhulapfu ho khakheaho ha tevhekano.  Hu fanela u vha tshivhalo tsho fhelelaho tshi si fhasi ha mbila.

sequence-invalid-step = Ganḓa ḽo khakheaho ḽa tevhekano.  Ḽi fanela u vha tshivhalo kha tevhekano ya lushaka lwa { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" yo khakheaho ya tevhekano ya zwivhalo.  I fanela u vha tshivhalo.

sequence-invalid-endpoint-letters = "{ $attribute }" yo khakheaho ya tevhekano ya maḽeḓere.  I fanela u vha ṱhanganelo ya maḽeḓere.

sequence-invalid-endpoint = "{ $attribute }" yo khakheaho ya tevhekano.

select-from-sequence-coprime-not-numbers = coprime yo fhelelwa ngauri a hu khou nangwa zwivhalo

select-from-sequence-coprime-with-exclude-combinations = coprime yo fhelelwa ngauri excludeCombinations yo bulwa

## Resolving a `target`

target-not-found = Tshipikwa tsho khakheaho tsha `<{ $source }>`: tshipikwa a tshi wanali.

target-state-variable-not-found = Tshipikwa tsho khakheaho tsha `<{ $source }>`: a hu wanali tshishandukisi tsha vhuimo tshi pfi "{ $property }" kha `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Zwishandukisi zwa `<odeSystem>` zwi fanela u fhambana na tshishandukisi tshi ḓiimisaho.

ode-system-duplicate-variable-names = A zwi konadzei u ṱalutshedza mishumo ya ODE RHS nga madzina a zwishandukisi o dovhololwaho.

ode-system-rhs-function-error = A zwi konadzei u ṱalutshedza mushumo wa ODE RHS.  Vhukhakhi kha u sika mushumo wa mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = A zwi konadzei u ṱalutshedza engele vhukati ha mitalo ya { $count }

angle-invalid-through-point = Phoinnti yo khakheaho kha through ya `<angle>`

parabola-vertex-too-many-points = A ho ngo itwa pharabola na ṱhoho i fhiraho kha phoinnti i fhiraho nthihi.

parabola-too-many-points = A ho ngo itwa pharabola i fhiraho kha dziphoinnti dzi fhiraho tharu.

intersection-too-many-items = A ho ngo itwa u sedzana ha zwithu zwi fhiraho zwivhili

## Other math components

ionic-compound-not-two-ions = A ho ngo itwa ṱhanganelo ya ayoni nga nnḓa ha ya dziayoni mbili.

ionic-compound-needs-cation-and-anion = Ṱhanganelo ya ayoni yo itwa fhedzi ya cation nthihi na anion nthihi.

solve-equations-cannot-evaluate = A zwi konadzei u tandulula ikweishini ngauri a zwo ngo konadzea u i sedza: { $equation }

math-operators-operand-number-required = Ni fanela u bula operandNumber musi ni tshi bvisa operand ya mbalo.

eigen-decomposition-failed = A zwo ngo konadzea u vhala ndeme dza eigen dza methiriksi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: pharamitha { $parameters } a i ho kha tshivhumbeo, nga zwenezwo i ḓo dzula i tshi tshimbilelana na fhethu hu si na tshithu.
       *[other] `<matchesPattern>`: dziphararmitha { $parameters } a dzi ho kha tshivhumbeo, nga zwenezwo dzi ḓo dzula dzi tshi tshimbilelana na fhethu hu si na tshithu.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: a zwi konadzei u pfesesa grid="{ $grid }". I fanela u vha none, medium, dense, kana zwivhalo zwivhili zwi fhiraho mbila zwo fhandekanywaho nga tshikhala, sa grid="1 0.5". A ho ngo olwa girithi.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" a i tikedzwi kha tshisumbedzi tsha prefigure; hu khou shumiswa nḓila ya right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" a i tikedzwi kha tshisumbedzi tsha prefigure; hu khou shumiswa nḓila ya top.

prefigure-invalid-axis-bounds = `<graph>`: mikano ya akisi yo khakheaho ya u shandukisa ha prefigure; hu khou shumiswa bbox ya kale (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: vhuphara ho khakheaho ha u shandukisa ha prefigure; hu khou shumiswa vhuphara ha kale ha 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio yo khakheaho ya u shandukisa ha prefigure; hu khou shumiswa muhaṱo wa kale wa 1.

prefigure-grid-spacing-too-fine = `<graph>`: tshikhala tsha girithi ndi tshiṱuku vhukuma kha mikano ya dziakisi; girithi yo siiwa kha tshisumbedzi tsha prefigure.

prefigure-annotations-not-rendered = `<graph>`: ṱhalutshedzo a dzi nga sumbedzwi arali hu sa shumiswi tshisumbedzi tsha PreFigure.

multiple-annotations-children = Ho wanala vhana vhanzhi vha `<annotations>` kha `<graph>`; vhoṱhe nga nnḓa ha wa u fhedza vho fhelelwa.

## Referring to other components

copy-unrecognized-component-type = A zwi konadzei u engedza kana u kopa lushaka lwa tshiteṅwa lu sa ḓivhiwi: { $type }.

copy-prop-not-found = A hu wanali tshiteṅwa { $property } kha tshiteṅwa tsha lushaka lwa { $component }

collect-no-source = A ho ngo wanala tshisima tsha collect.

collect-invalid-component-type = A zwi konadzei u kuvhanganya zwiteṅwa zwa lushaka lwa `<{ $component }>` ngauri ndi lushaka lwa tshiteṅwa lwo khakheaho.

reference-index-unavailable = A zwi konadzei u sumbedza nomboro `{ $reference }`

## `<callAction>`

component-action-unavailable = A zwi konadzei u vhidza { $action } kha tshiteṅwa `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data i na tshivhumbeo tsho khakheaho.  Mitalo i na vhulapfu vhu fhambanaho. Yo wanala kha componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data i na madzina a dzikholomo o dovhololwaho.  Yo wanala kha componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data a i na dzina ḽa kholomo.  Yo wanala kha componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award ya phindulo iyi yo ḓitika kha phindulo ya thegi ya answer nga yone, zwenezwo zwi ḓo ḓisa vhuḓifari vhu sa lavhelelwi.

answer-max-num-attempts-in-section-wide-check-work = U vhea `maxNumAttempts` kha `<answer>` i re nga ngomu ha tshiṱangadzime tshi re na `sectionWideCheckWork` a zwi na mvelelo, ngauri tshivhalo tsha u lingedza tshi laulwa nga tshiṱangadzime. Vhea `maxNumAttempts` kha tshiṱangadzime.

nested-section-wide-check-work-max-num-attempts = U vhea `maxNumAttempts` kha tshiṱangadzime tshi re na `sectionWideCheckWork` tshi re nga ngomu ha tshiṅwe tshi re na `sectionWideCheckWork` a zwi na mvelelo, ngauri tshivhalo tsha u lingedza tshi laulwa nga tshiṱangadzime tsha nnḓa. Vhea `maxNumAttempts` kha tshiṱangadzime tsha nnḓa.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Tshiteṅwa tsha { $attributes } a tshi nga vhi na mvelelo hu si na symbolicEquality.
       *[other] Zwiteṅwa zwa { $attributes } a zwi nga vhi na mvelelo hu si na symbolicEquality.
    }

answer-invalid-type = Lushaka lwo khakheaho lwa phindulo: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Samusi tshiteṅwa `<{ $component }>` tshi si na dzina, a tshi nga shumiswi sa tshiteṅwa tsha module

module-attribute-name-already-defined = Tshiteṅwa `<{ $component } name="{ $name }">` a tshi nga shumiswi sa tshiteṅwa tsha module ngauri lushaka lwa tshiteṅwa lwa `<module>` lwo no vha na tshiteṅwa tsha "{ $name }".

conditional-content-condition-ignored = Tshiteṅwa tsha `condition` tshi a fhelelwa kha tshiteṅwa tsha `<conditionalContent>` tshi re na vhana vha case kana vha else.

slider-markers-type-mismatch = Lushaka lwa zwiga a lu tshimbilelani na lushaka lwa slider.

pretzel-problem-needs-statement-and-answer = pretzel yo khakheaho: `<problem>` iṅwe na iṅwe i fanela u vha na `<statement>` nthihi na `<answer>` nthihi.

pretzel-circuit-first-problem-distractor = pretzel yo khakheaho: kha mode="circuit", `<problem>` ya u thoma a i nga vhi tshidzimbudzi.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ndeme yo khakheaho { $values } ya tshiteṅwa `{ $attribute }`; hu khou fhelelwa.
       *[other] Ndeme dzo khakheaho { $values } dza tshiteṅwa `{ $attribute }`; hu khou fhelelwa.
    }

attribute-must-be-references = Ndeme yo khakheaho `{ $value }` ya tshiteṅwa `{ $attribute }`. Tshiteṅwa tshi fanela u vhumbwa nga masumbedzo a thomaho nga `$`.

math-input-invalid-function-names = <mathInput>: ho fhelelwa madzina a mishumo o khakheaho kha { $attribute }: { $names }. Tshipiḓa tsha u sumbedza tsha dzina ḽiṅwe na ḽiṅwe tshi fanela u vha na maḽeḓere mavhili u ya fhasi (maḽeḓere kana miṱalo); `|<mathspeak alternative>` i nga tevhela.

## Building components from the source

component-type-invalid = Lushaka lwo khakheaho lwa tshiteṅwa: `<{ $componentType }>`

attribute-repeated = A zwi konadzei u dovholola tshiteṅwa { $attribute }.

attribute-invalid-for-component = Tshiteṅwa tsho khakheaho "{ $attribute }" tsha tshiteṅwa tsha lushaka lwa `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Ṱhalutshedzo ya sitaela { $styleNumber } a i na phambano yo linganaho ya { $context ->
        [text-on-background] muvhala wa maṅwalwa kha muvhala wa murahu
        [high-contrast] muvhala wa phambano khulwane kha khenvasi
        [line] muvhala wa mutalo kha khenvasi
        [marker] muvhala wa tshiga kha khenvasi
       *[text-on-canvas] muvhala wa maṅwalwa kha khenvasi
    }{ $mode ->
        [dark] { " (nḓila swifha)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; hu ṱoḓea { $threshold }:1 u ya fhasi).

style-definition-dark-mode-text-background-contrast =
    Naho ṱhalutshedzo ya sitaela { $styleNumber } yo bula mivhala i re na phambano yo linganaho ya nḓila i vhonalaho, mivhala ya nḓila swifha yo bvaho kha ndeme idzi a i na phambano yo linganaho ya muvhala wa maṅwalwa kha muvhala wa murahu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; hu ṱoḓea { $threshold }:1 u ya fhasi). { $suggestion ->
        [available] U itela phambano yo linganaho kha nḓila swifha, engedzani phambano ya nḓila i vhonalaho (tsumbo, vhea { $lightAttribute }="{ $lightColor }") kana ni shandule muvhala wa nḓila swifha (tsumbo, vhea { $darkAttribute }="{ $darkColor }").
       *[none] U itela phambano yo linganaho kha nḓila swifha, engedzani phambano ya nḓila i vhonalaho kana ni shandule mivhala yo bvaho nga textColorDarkMode na/kana backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Naho ṱhalutshedzo ya sitaela { $styleNumber } yo bula muvhala wa maṅwalwa u re na phambano yo linganaho ya nḓila i vhonalaho, muvhala wa maṅwalwa wa nḓila swifha wo bvaho kha ndeme iyi a u na phambano yo linganaho kha khenvasi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; hu ṱoḓea { $threshold }:1 u ya fhasi). { $suggestion ->
        [available] U itela phambano yo linganaho kha nḓila swifha, engedzani phambano ya nḓila i vhonalaho (tsumbo, vhea textColor="{ $lightColor }") kana ni shandule muvhala wa nḓila swifha (tsumbo, vhea textColorDarkMode="{ $darkColor }").
       *[none] U itela phambano yo linganaho kha nḓila swifha, engedzani phambano ya nḓila i vhonalaho kana ni shandule muvhala wo bvaho nga textColorDarkMode.
    }

section-multiple-style-palettes = Khethekanyo i nga nanga <stylePalette> nthihi fhedzi; hu khou shumiswa ya u fhedza.

## Unique variants

variant-num-to-select-not-non-negative-integer = a zwi konadzei u ḓivha dzinḓila dzo khetheaho dza { $component } ngauri numToSelect a si tshivhalo tsho fhelelaho tshi si fhasi ha mbila.

variant-num-to-select-not-constant-number = a zwi konadzei u ḓivha dzinḓila dzo khetheaho dza { $component } ngauri numToSelect a si tshivhalo tshi sa shanduki.

variant-with-replacement-not-constant-boolean = a zwi konadzei u ḓivha dzinḓila dzo khetheaho dza { $component } ngauri withReplacement a si boolean i sa shanduki.

variant-select-weight-disables-unique = Dzinḓila dzo khetheaho dza select dzi a valwa arali hu na khetho i re na selectWeight kana selectForVariants

variant-coprime-undetermined = a zwi konadzei u ḓivha dzinḓila dzo khetheaho dza { $component } ngauri a zwi konadzei u ḓivha uri coprime i dzula i mazwifhi.

variant-attribute-not-constant = a zwi konadzei u ḓivha dzinḓila dzo khetheaho dza { $component } ngauri { $attribute } a i dzuli i tshi fana.

variant-attribute-not-number = a zwi konadzei u ḓivha dzinḓila dzo khetheaho dza { $component } ngauri { $attribute } a si tshivhalo.

variant-attribute-wrong-type-for-sequence =
    a zwi konadzei u ḓivha dzinḓila dzo khetheaho dza { $component } ya lushaka lwa { $type } ngauri { $attribute } a si { $expected ->
        [letters-combination] ṱhanganelo ya maḽeḓere
        [math-expression] mubvumo wa mbalo u tendelwaho
        [integer] tshivhalo tsho fhelelaho
       *[number] tshivhalo
    }.

variant-length-not-integer = a zwi konadzei u ḓivha dzinḓila dzo khetheaho dza { $component } ngauri length a si tshivhalo tsho fhelelaho.

variant-sort-not-implemented = a ho ngo itwa dzinḓila dzo khetheaho dza { $component } i re na sort

variant-exclude-combinations-not-implemented = a ho ngo itwa dzinḓila dzo khetheaho dza { $component } i re na excludeCombinations

variant-math-exclude-not-implemented = a ho ngo itwa dzinḓila dzo khetheaho dza { $component } ya lushaka lwa math i re na exclude

variant-non-constant-exclude-not-implemented = a ho ngo itwa dzinḓila dzo khetheaho dza { $component } i re na exclude i shandukaho

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: a i tikedzwi kha tshisumbedzi tsha graph prefigure; muḓuhulu o siiwa.

prefigure-descendant-invalid-geometry = { $subject }: jiyomethiri i sa fheli kana i so ngo fhelela; muḓuhulu o siiwa.

prefigure-curve-label-omitted = { $subject }: madzina a tikedzwi kha zwiteṅwa zwa mutalo wo kokovhaho zwo shandukiswaho; dzina ḽo siiwa.

prefigure-curve-unsupported-definition-type = { $subject }: lushaka lwa ṱhalutshedzo ya mushumo wa mutalo wo kokovhaho '{ $definitionType }' a lu tikedzwi; muḓuhulu o siiwa.

prefigure-region-flip-functions-unsupported = { $subject }: tshiteṅwa tsha flipFunctions kha regionBetweenCurves a tshi tikedzwi; muḓuhulu o siiwa.

prefigure-region-non-formula-child = { $subject }: hu tikedzwa fhedzi mishumo ya vhana ya lushaka lwa formula kha regionBetweenCurves; muḓuhulu o siiwa.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' a i tikedzwi kha { $labelKind ->
        [line-family] dzina ḽa muṱa wa mitalo
       *[point] dzina ḽa phoinnti
    }; hu khou shumiswa u linganya ha kale ha PreFigure.

prefigure-fill-style-unsupported = { $subject }: sitaela ya u ḓadza '{ $fillStyle }' a i tikedzwi nga PreFigure; hu khou humelwa kha u ḓadza ho khwaṱhaho.

prefigure-line-style-unknown = { $subject }: sitaela ya mutalo i sa ḓivhiwi '{ $lineStyle }' yo siiwa kha mbuyelo ya PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: sitaela ya tshiga '{ $markerStyle }' yo shandukiselwa kha sitaela ya PreFigure ya 'diamond'.

prefigure-marker-style-unsupported = { $subject }: sitaela ya tshiga '{ $markerStyle }' a i tikedzwi nga PreFigure; hu khou shumiswa sitaela ya kale.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` yo khakheaho; a zwi konadzei u wana tshipikwa. Ṱhalutshedzo yo siiwa.

annotation-ref-multiple-targets = `<annotation>`: `ref` yo sumbedza kha zwipikwa zwinzhi; hu khou shumiswa tshipikwa tsha u thoma.

annotation-ref-outside-graph = `<annotation>`: `ref` yo khakheaho; tshipikwa tshi nnḓa ha graph i tshi farelaho. Ṱhalutshedzo yo siiwa.

annotation-ref-unsupported-target = `<annotation>`: `ref` yo khakheaho; tshipikwa a si tshithu tsha tshifanyiso tshi tikedzwaho kha u shandukiswa ha prefigure. Ṱhalutshedzo yo siiwa.

annotation-text-missing = `<annotation>`: `text` a i ho kana a i na tshithu; hu khou bviswa maṅwalwa a si na tshithu.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ho wanala u ḓitika ho ṱenderedzaho.
       *[other] Ho wanala u ḓitika ho ṱenderedzaho hu katelaho tshiteṅwa tsha `<{ $componentType }>`.
    }

reference-no-referent = A ho ngo wanala tshithu kha tshisumbedzo: `{ $reference }`

reference-multiple-referents = Ho wanala zwithu zwinzhi kha tshisumbedzo: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Tshivhumbeo tsho khakheaho tsha tshiteṅwa { $attribute } tsha `<{ $componentType }>`.

children-invalid = Vhana vho khakheaho vha `<{ $componentType }>`: Ho wanala vhana vho khakheaho: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ndeme yo khakheaho `{ $value }` ya tshiteṅwa `{ $attribute }`, hu khou shumiswa ndeme `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Vheseni ya DoenetML { $version } a i wanali.
       *[other] Vheseni ya DoenetML { $version } a i wanali. Hu khou humelwa kha vheseni { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML yo khakheaho: { $content }

parse-tag-missing-close-tag = DoenetML yo khakheaho: Thegi `{ $tag }` a i na thegi ya u vala. Ho vha hu tshi lavhelelwa thegi i ḓivalaho kana thegi ya `</{ $tagName }>`.

parse-tag-error = DoenetML yo khakheaho: Vhukhakhi kha thegi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML yo khakheaho: Tshiteṅwa tsho khakheaho `{ $attribute }` tshi vhonala tshi si na ndeme.

parse-attribute-invalid = DoenetML yo khakheaho: Tshiteṅwa tsho khakheaho `{ $attribute }`

parse-attribute-value-invalid = DoenetML yo khakheaho: Ndeme ya tshiteṅwa yo khakheaho `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML yo khakheaho: Ndeme ya tshiteṅwa yo khakheaho `{ $value }`. Zwiga zwa u redza a zwi tshimbilelani. Zwi vhonala hu tshi ṱoḓea `{ $quote }`

parse-open-tag-name-missing = DoenetML yo khakheaho: Ho wanala thegi i si na dzina, tsumbo `<`

parse-tag-not-closed = DoenetML yo khakheaho: Thegi `{ $tag }` a yo ngo valwa (zwi vhonala `>` i tshi ṱoḓea).

parse-self-closing-tag-name-missing = DoenetML yo khakheaho: Ho wanala thegi i si na dzina `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML yo khakheaho: Thegi `{ $tag }` a yo ngo valwa (zwi vhonala `/>` i tshi ṱoḓea).

parse-tag-invalid-attributes = DoenetML yo khakheaho: Thegi `{ $tag }` a i tendelwi. I nga vha na zwiteṅwa zwo khakheaho.

parse-close-tag-name-missing = DoenetML yo khakheaho: Ho wanala thegi ya u vala i si na dzina, tsumbo `</`

parse-attribute-value-unquoted = Ndeme dza zwiteṅwa dzi fanela u vha nga ngomu ha zwiga zwa u redza: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML yo khakheaho: Ho wanala thegi ya u vala `{ $tag }`, fhedzi a hu na thegi ya u vula i tshimbilelanaho

parse-close-tag-mismatched = DoenetML yo khakheaho: Thegi ya u vala a i tshimbilelani. Ho vha hu tshi lavhelelwa `</{ $expected }>`. Ho wanala `{ $found }`

parser-node-unconvertible = A zwo ngo konadzea u shandukisa nodo { $node } uri i vhe nodo ya Dast.

## Names

name-attribute-invalid =
    Dzina ḽa tshiteṅwa ḽo khakhea name='{ $name }'. { $reason ->
        [characters] Madzina a nga vha na maḽeḓere, zwivhalo, zwiga zwa u ṱanganya kana miṱalo fhedzi.
       *[start] Madzina a fanela u thoma nga ḽeḓere.
    }

component-name-invalid-start = Dzina ḽa tshiteṅwa ḽo khakhea "{ $name }". Madzina a fanela u thoma nga ḽeḓere.

## `<answer>` sugar

answer-video-watched-missing-video = Phindulo ya lushaka lwa videoWatched i fanela u vha na tshiteṅwa tsha video

answer-video-watched-video-not-reference = Phindulo ya lushaka lwa videoWatched i fanela u vha na tshiteṅwa tsha video tshi re tshisumbedzo

answer-name-not-single-text = Tshiteṅwa tsha name tsha phindulo tshi fanela u vha na ṅwana muthihi wa maṅwalwa

## Referencing another document

external-doenetml-recursion-limit = A zwo ngo konadzea u wana DoenetML ya nnḓa nga nṱhani ha maimo manzhi vhukuma a u dovholola. Naa hu na tshisumbedzo tsho ṱenderedzaho?

external-doenetml-unavailable = A zwo ngo konadzea u wana DoenetML kha { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML yo wanalaho kha { $attribute }="{ $uri }" yo khakhea: a yo ngo tshimbilelana na lushaka lwa tshiteṅwa lwa "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Tshiteṅwa `{ $from }` a tshi tsha shumiswa; shumisa `{ $to }` vhudzuloni hatsho.
       *[other] [deprecation] Tshiteṅwa `{ $from }` kha `<{ $component }>` a tshi tsha shumiswa; shumisa `{ $to }` vhudzuloni hatsho.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Tshiteṅwa `{ $from }` a tshi tsha shumiswa nahone tshi a fhelelwa ngauri na `{ $to }` tsho bulwa.
       *[other] [deprecation] Tshiteṅwa `{ $from }` kha `<{ $component }>` a tshi tsha shumiswa nahone tshi a fhelelwa ngauri na `{ $to }` tsho bulwa.
    }

deprecated-attribute-ignored = [deprecation] Tshiteṅwa `{ $attribute }` kha `<{ $component }>` a tshi tsha shumiswa nahone tshi a fhelelwa.

deprecated-attribute-to-child = [deprecation] Tshiteṅwa `{ $attribute }` kha `<{ $component }>` a tshi tsha shumiswa; shumisa ṅwana wa `<{ $child }>` vhudzuloni hatsho.

deprecated-attribute-value-renamed = [deprecation] Ndeme `{ $value }` ya tshiteṅwa `{ $attribute }` kha `<{ $component }>` a i tsha shumiswa; shumisa `{ $to }` vhudzuloni hayo.


## Language coverage

pluralize-english-only = `<pluralize>` i nga ita vhunzhi ha Luisimane fhedzi, nga zwenezwo maṅwalwa ayo a siiwa a sa shandukiswi kha ḽiṅwalo ḽo ṅwalwaho nga { $locale }. Ṅwala tshivhumbeo tsha vhunzhi zwi tshi tou livha, kana ni tshi vhee nga tshiteṅwa tsha `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Tshiteṅwa `<{ $tag }>` a si tshiteṅwa tsha Doenet tshi ḓivhiwaho.

schema-element-not-allowed-at-root = Tshiteṅwa `<{ $tag }>` a tshi tendelwi kha mudzi wa ḽiṅwalo.

schema-element-not-allowed-inside = Tshiteṅwa `<{ $tag }>` a tshi tendelwi nga ngomu ha `<{ $parent }>`.

schema-attribute-unrecognized = Tshiteṅwa `<{ $tag }>` a tshi na tshiteṅwa tshi pfi `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Tshiteṅwa `{ $attribute }` tsha tshiteṅwa `<{ $tag }>` tshi fanela u vha mutevhe une zwithu zwawo zwa vha tshiṅwe tsha: { $allowed }
       *[other] Tshiteṅwa `{ $attribute }` tsha tshiteṅwa `<{ $tag }>` tshi fanela u vha tshiṅwe tsha: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Dzina ḽa lushaka ḽo khakhea kha select.  Dzina ḽa lushaka { $variantName } ḽi bvelela kha khetho dza { $numOptions } fhedzi tshivhalo tsha u nanga ndi { $numToSelect }.

select-variant-name-without-options = Dzinḓila dziṅwe dzo bulwa kha select fhedzi a hu na khetho dzo bulwaho dza dzina ḽa lushaka ḽi konadzeaho: { $variantName }.

select-variant-name-not-possible = Dzina ḽa lushaka { $variantName } ḽo bulwaho kha select a si dzina ḽa lushaka ḽi konadzeaho.

select-too-few-options = A zwi konadzei u nanga zwiteṅwa zwa { $numToSelect } kha zwa { $numOptions } fhedzi.

select-from-sequence-too-few-values = A zwi konadzei u nanga ndeme dza { $numToSelect } kha tevhekano ya vhulapfu ha { $length }.

select-from-sequence-indices-count-mismatch = Tshivhalo tsha dzinomboro dzo bulwaho kha select tshi fanela u tshimbilelana na tshivhalo tsha u nanga

select-from-sequence-indices-not-integers = Dzinomboro dzoṱhe dzo bulwaho kha select dzi fanela u vha zwivhalo zwo fhelelaho

select-from-sequence-index-excluded = Nomboro yo bulwaho ya selectfromsequence yo vha yo bviswa

select-from-sequence-indices-excluded-combination = Dzinomboro dzo bulwaho dza selectfromsequence dzo vha dzi ṱhanganelo yo bviswaho

select-from-sequence-coprime-not-positive-integers = A zwi konadzei u nanga ṱhanganelo dza coprime ngauri a hu khou nangwa zwivhalo zwo fhelelaho zwi fhiraho mbila.

select-from-sequence-coprime-common-factor = A zwi konadzei u nanga zwivhalo zwa coprime. Ndeme dzoṱhe dzi konadzeaho dzi na tshiteṅwa tshi fanaho. (Ndeme dzo bulwaho dza "from" kana "to" dzi fanela u vha coprime na "step".)

select-from-sequence-coprime-single-number = A zwi konadzei u nanga ṱhanganelo dza coprime kha tshivhalo tshithihi tshi si 1.

select-from-sequence-excluded-too-many-combinations = Ho bviswa u fhira 70% ya ṱhanganelo kha selectFromSequence

select-from-sequence-coprime-none-found = A zwo ngo konadzea u nanga zwivhalo zwa coprime. Ndeme dzoṱhe dzi konadzeaho dzi na tshiteṅwa tshi fanaho.

select-from-sequence-too-few-unique-values = A zwi konadzei u nanga ndeme dzo khetheaho dza { $numToSelect } kha tevhekano ya vhulapfu ha { $numPossibleValues }

select-prime-numbers-too-few-values = A zwi konadzei u nanga ndeme dza { $numToSelect } kha mutevhe wa zwivhalo zwa prime wa vhulapfu ha { $numValues }

select-prime-numbers-values-count-mismatch = Tshivhalo tsha ndeme dzo bulwaho kha select tshi fanela u tshimbilelana na tshivhalo tsha u nanga

select-prime-numbers-values-not-prime = Ndeme dzoṱhe dzo bulwaho kha select prime number dzi fanela u vha kha mutevhe wa zwivhalo zwa prime

select-prime-numbers-values-excluded-combination = Ndeme dzo bulwaho dza selectPrimeNumbers dzo vha dzi ṱhanganelo yo bviswaho

select-prime-numbers-excluded-too-many-combinations = Ho bviswa u fhira 70% ya ṱhanganelo kha selectPrimeNumbers

select-random-combination-fluke = Nga tshiitisi tshi sa lavhelelwi vhukuma, a zwo ngo konadzea u nanga ṱhanganelo ya ndeme dzi sa lavhelelwi

select-random-value-fluke = Nga tshiitisi tshi sa lavhelelwi vhukuma, a zwo ngo konadzea u nanga ndeme i sa lavhelelwi
