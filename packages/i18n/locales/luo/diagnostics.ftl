# Luo diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] { $attributes } ok kwan ka tong' ariyo mag giko oket
       *[other] { $attributes } ok kwan ka tong' ariyo mag giko oket
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ok kwan ka tong' mar giko gi tong' mar diere duto oket
       *[other] { $attributes } ok kwan ka tong' mar giko gi tong' mar diere duto oket
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset onge tiende ka onge tong' mar diere

## `<line>`

line-points-undetermined-dimensions = Laini makadho e tong' ma rangnie ok ng'ere.

line-points-too-few-dimensions = Laini nyaka kadh e tong' man-gi rang ariyo kata mokalo.

line-points-depend-on-variables = Laini kadho e tong' motenore kuom gik malokore: { $variables }.

line-equation-invalid-format = Chal ma ok kare mar ikweno mar laini e gik malokore { $variable1 } gi { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ray oket gi through, endpoint kod direction.  Through moket ok kwan.

ray-dimension-mismatch = numDimensions ok owinjre e ray.

## `<vector>`

vector-overprescribed-head = Vekta oket gi head, tail kod displacement.  Head moket ok kwan.

vector-dimension-mismatch = numDimensions ok owinjre e vekta.

## Attracting and constraining

attract-to-without-nearest-point = Ok inyal ywayo ir `<{ $component }>` nikech onge gima lokore mar nearestPoint.

constrain-to-without-nearest-point = Ok inyal geng'o ir `<{ $component }>` nikech onge gima lokore mar nearestPoint.

constrain-to-interior-without-nearest-point = Ok inyal geng'o ei `<{ $component }>` nikech onge gima lokore mar nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ok kwan e choiceInput ma ok mar inline

## Ordering children by index

choice-input-indices-count-mismatch = Namba moket e choiceInput ok kwan nikech kwan mar namba ok romre gi kwan mar nyithindo mag yiero.

pretzel-indices-count-mismatch = Namba moket e problem ok kwan nikech kwan mar namba ok romre gi kwan mar nyithindo mag problem.

shuffle-indices-count-mismatch = Namba moket e shuffle ok kwan nikech kwan mar namba ok romre gi kwan mar bethe.

indices-ignored-out-of-range = Namba moket e { $component } ok kwan nikech moko ni oko mar rapim.

pretzel-indices-repeated = Namba moket e pretzel ok kwan nikech moko onwoyore.

pretzel-circuit-first-index = Namba moket e pretzel e mode mar circuit ok kwan nikech namba mokwongo nyaka bed 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Mondo `<{ $component }>` oti gi nyithindo mag weche, alama mar `type` nyaka ket.

invalid-type-defaulting-to-math = Kit { $type } ok kare e bath { $component }. Nyaka obed achiel kuom math, text, number kata boolean. Math ema iketo kaka machon.

string-not-valid-component-to-arrange = Wach "{ $value }" ok en bath moyie e { $component }. Ok okwan.

## Types and variables

invalid-type-defaulting-to-number = Kit { $type } ok kare, kit iketo ni number.

invalid-variable-value = Kwan ma ok kare mar gima lokore: `{ $value }`

## Variants

variant-index-must-be-number = Namba mar kit { $index } nyaka bed kwan

variant-index-must-be-integer = Namba mar kit { $index } nyaka bed kwan mangima

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ok olos ne rapim motegno. Lach iketo ni mar pim.

side-by-side-absolute-margins = `<{ $component }>` ok olos ne rapim motegno. Giko iketo ni mar pim.

side-by-side-no-block-child = `<{ $component }>` ma ok kare: nyaka obed gi nyathi achiel mar bloko kata mokalo.

## `<label>`

label-for-ignored-on-graphical = Alama mar `for` e `<label>` mar picha ok kwan.

label-for-must-resolve-to-one = Alama mar `for` e `<label>` nyaka nyis bath achiel kende.

label-for-unresolved = Alama mar `for` e `<label>` ok onyal nyiso bath moro.

label-for-answer-with-authored-inputs = Alama mar `for` e `<label>` nyiso `<answer>` man-gi donjo ma jandiko ondiko; nyis donjo owuon.

label-for-answer-without-input = Alama mar `for` e `<label>` nyiso `<answer>` maonge gi donjo minyalo ket nying.

label-for-must-reference-input-or-answer = Alama mar `for` e `<label>` nyaka nyis donjo kata duoko.

## Accessibility

accessibility-short-description-or-decorative = Mar chopo, `<{ $component }>` nyaka bed gi lero machiek kata oket kaka decorative.

accessibility-video-short-description = Mar chopo, `<video>` nyaka bed gi lero machiek.

accessibility-input-short-description-or-label = Mar chopo, `<{ $component }>` nyaka bed gi lero machiek kata nying.

accessibility-answer-input-short-description-or-label = Mar chopo, `<answer>` machweyo donjo nyaka bed gi lero machiek kata nying.

accessibility-short-description-contains-math = Lero machiek ok onego bed gi bethe mag kwan kaka `<{ $component }>`. Ndik kwan gi weche.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } onge pogruok moromo mar ndiko mar wich mar bath (yo marateng') ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; dwarore { $threshold }:1 kata mokalo).
       *[other] { $colorName } onge pogruok moromo mar ndiko mar wich mar bath ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; dwarore { $threshold }:1 kata mokalo).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` makadho e tong' { $count } pok olos kama tong' onge gi kwan mag namba.

circle-too-many-through-points = Ok inyal kwano duol makadho e tong' moloyo adek.

circle-overprescribed-radius-center-points = Ok inyal kwano duol gi radius, diere kod tong' moket.

circle-center-with-multiple-points = Ok inyal kwano duol gi diere moket makadho e tong' moloyo achiel.

circle-radius-too-small = Ok inyal kwano duol: nikech bor e kind tong' ariyo en { $distance }, radius { $radius } moket tin ahinya.

circle-radius-with-many-points = Ok inyal chweyo duol makadho e tong' moloyo ariyo gi radius moket.

circle-invalid-center-or-through-points = Diere kata tong' mag duol ok kare.

circle-radius-center-with-multiple-points = Ok inyal kwano radius mar duol gi diere moket makadho e tong' moloyo achiel.

circle-change-radius-non-numerical = Ok inyal loko radius mar duol makadho e tong' maonge gi namba

circle-radius-with-points-non-numerical = Ok inyal chweyo duol makadho e tong' moloyo achiel gi radius moket ka onge kwan mag namba.

circle-change-center-non-numerical = Loko diere mar duol makadho e tong' maonge gi kwan mag namba pok olos.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Rang ok romo ne kar tich. Kar nigi kind { $intervals } to tich nigi { $inputs ->
            [one] donjo { $inputs }
           *[other] donjo { $inputs }
        }.
       *[other] Rang ok romo ne kar tich. Kar nigi kind { $intervals } to tich nigi { $inputs ->
            [one] donjo { $inputs }
           *[other] donjo { $inputs }
        }.
    }

function-domain-invalid-format = Chal ma ok kare mar kar tich.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Kwan maduong' ma ok mar namba mar tich ok kwan.
        [minimum] Kwan matin ma ok mar namba mar tich ok kwan.
        [extremum] Kwan mogik ma ok mar namba mar tich ok kwan.
        [point] Tong' ma ok mar namba mar tich ok kwan.
        [slope] Podho ma ok mar namba mar tich ok kwan.
       *[other] { $type } ma ok mar namba mar tich ok kwan.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Kwan maduong' maonge gimoro mar tich ok kwan.
        [minimum] Kwan matin maonge gimoro mar tich ok kwan.
        [extremum] Kwan mogik maonge gimoro mar tich ok kwan.
        [point] Tong' maonge gimoro mar tich ok kwan.
       *[other] { $type } maonge gimoro mar tich ok kwan.
    }

function-points-too-close = Tich nigi tong' ariyo machiegni ahinya. Ok inyal lero tich.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Nwoyo tich nyalore mana ka kwan mar donjo romre gi kwan mar wuok. Tichni nigi donjo { $inputs } gi { $outputs ->
            [one] wuok { $outputs }
           *[other] wuok { $outputs }
        }.
       *[other] Nwoyo tich nyalore mana ka kwan mar donjo romre gi kwan mar wuok. Tichni nigi donjo { $inputs } gi { $outputs ->
            [one] wuok { $outputs }
           *[other] wuok { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Bor ma ok kare mar chenro.  Nyaka bed kwan mangima ma ok ni e bwo nono.

sequence-invalid-step = Okang' ma ok kare mar chenro.  Nyaka bed kwan e chenro mar kit { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ma ok kare mar chenro mar kwan.  Nyaka bed kwan.

sequence-invalid-endpoint-letters = "{ $attribute }" ma ok kare mar chenro mar nukta.  Nyaka bed riwruok mar nukta.

sequence-invalid-endpoint = "{ $attribute }" ma ok kare mar chenro.

select-from-sequence-coprime-not-numbers = coprime ok kwan nikech ok iyier kwan

select-from-sequence-coprime-with-exclude-combinations = coprime ok kwan nikech excludeCombinations oket

## Resolving a `target`

target-not-found = Kama ochomo ok kare mar `<{ $source }>`: kama ochomo ok oyudi.

target-state-variable-not-found = Kama ochomo ok kare mar `<{ $source }>`: ok oyud gima lokore miluongo ni "{ $property }" e `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Gik malokore mag `<odeSystem>` nyaka pogre gi gima lokore machung' kende.

ode-system-duplicate-variable-names = Ok inyal lero tije mag ODE RHS gi nying gik malokore monwoyore.

ode-system-rhs-function-error = Ok inyal lero tich mar ODE RHS.  Bayo e chweyo tich mar mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ok inyal lero angili e kind laini { $count }

angle-invalid-through-point = Tong' ma ok kare e through mar `<angle>`

parabola-vertex-too-many-points = Parabola gi wich makadho e tong' moloyo achiel pok olos.

parabola-too-many-points = Parabola makadho e tong' moloyo adek pok olos.

intersection-too-many-items = Romruok mar gik moloyo ariyo pok olos

## Other math components

ionic-compound-not-two-ions = Riwruok mar ayon ma ok mar ayon ariyo pok olos.

ionic-compound-needs-cation-and-anion = Riwruok mar ayon olos mana mar katayon achiel gi anayon achiel.

solve-equations-cannot-evaluate = Ok inyal loso ikweno nikech ok onyal pime: { $equation }

math-operators-operand-number-required = Nyaka iket operandNumber ka igolo operand mar kwan.

eigen-decomposition-failed = Ok onyal kwano kwan mag eigen mag metriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameta { $parameters } onge e chal, omiyo obiro romre gi kama nono kinde duto.
       *[other] `<matchesPattern>`: parameta { $parameters } onge e chal, omiyo gibiro romre gi kama nono kinde duto.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ok inyal winjo grid="{ $grid }". Nyaka bed none, medium, dense, kata kwan ariyo madongo moloyo nono mopog gi thuolo, kaka grid="1 0.5". Onge grid mogor.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ok yudo kony e janyis mar prefigure; itiyo gi yor right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ok yudo kony e janyis mar prefigure; itiyo gi yor top.

prefigure-invalid-axis-bounds = `<graph>`: giko mag akis ok kare mar loko mar prefigure; itiyo gi bbox machon (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lach ma ok kare mar loko mar prefigure; itiyo gi lach machon mar 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ma ok kare mar loko mar prefigure; itiyo gi rapim machon mar 1.

prefigure-grid-spacing-too-fine = `<graph>`: thuolo mar grid tin ahinya ne giko mag akis; grid owe e janyis mar prefigure.

prefigure-annotations-not-rendered = `<graph>`: lero ok nonyis ka ok itiyo gi janyis mar PreFigure.

multiple-annotations-children = Oyud nyithindo mang'eny mag `<annotations>` e `<graph>`; duto makmana mogik ok kwan.

## Referring to other components

copy-unrecognized-component-type = Ok inyal medo kata nwoyo kit bath ma ok ng'ere: { $type }.

copy-prop-not-found = Ok oyud alama { $property } e bath mar kit { $component }

collect-no-source = Onge soko moyudi mar collect.

collect-invalid-component-type = Ok inyal choko bethe mag kit `<{ $component }>` nikech en kit bath ma ok kare.

reference-index-unavailable = Ok inyal nyiso namba `{ $reference }`

## `<callAction>`

component-action-unavailable = Ok inyal luongo { $action } e bath `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data nigi chal ma ok kare.  Laini nigi bor mopogore. Oyudi e componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data nigi nying siro monwoyore.  Oyudi e componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data onge gi nying siro.  Oyudi e componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award mar duokoni otenore kuom duoko mar tag mar answer owuon, mano biro kelo timbe ma ok ogen.

answer-max-num-attempts-in-section-wide-check-work = Keto `maxNumAttempts` e `<answer>` man ei ohinga man-gi `sectionWideCheckWork` onge tiende, nikech kwan mar tem ochiki gi ohinga. Ket `maxNumAttempts` e ohinga.

nested-section-wide-check-work-max-num-attempts = Keto `maxNumAttempts` e ohinga man-gi `sectionWideCheckWork` man ei machielo man-gi `sectionWideCheckWork` onge tiende, nikech kwan mar tem ochiki gi ohinga mar oko. Ket `maxNumAttempts` e ohinga mar oko.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Alama mar { $attributes } ok bi bedo gi tiende ka onge symbolicEquality.
       *[other] Alama mag { $attributes } ok bi bedo gi tiende ka onge symbolicEquality.
    }

answer-invalid-type = Kit ma ok kare mar duoko: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Nikech bath `<{ $component }>` onge gi nying, ok inyal tiyo kode kaka alama mar module

module-attribute-name-already-defined = Bath `<{ $component } name="{ $name }">` ok inyal tiyo kode kaka alama mar module nikech kit bath mar `<module>` osebedo gi alama mar "{ $name }".

conditional-content-condition-ignored = Alama mar `condition` ok kwan e bath mar `<conditionalContent>` man-gi nyithindo mag case kata else.

slider-markers-type-mismatch = Kit ranyisi ok owinjre gi kit slider.

pretzel-problem-needs-statement-and-answer = pretzel ma ok kare: `<problem>` moro ka moro nyaka bed gi `<statement>` achiel gi `<answer>` achiel.

pretzel-circuit-first-problem-distractor = pretzel ma ok kare: e mode="circuit", `<problem>` mokwongo ok nyal bedo jawuond.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Kwan ma ok kare { $values } mar alama `{ $attribute }`; ok okwan.
       *[other] Kwan ma ok kare { $values } mag alama `{ $attribute }`; ok okwan.
    }

attribute-must-be-references = Kwan ma ok kare `{ $value }` mar alama `{ $attribute }`. Alama nyaka los gi ranyisi machakore gi `$`.

math-input-invalid-function-names = <mathInput>: nying tije ma ok kare ok okwan e { $attribute }: { $names }. Bath nyiso mar nying moro ka moro nyaka bed gi nukta ariyo kata mokalo (nukta kata laini); `|<mathspeak alternative>` nyalo luwo.

## Building components from the source

component-type-invalid = Kit bath ma ok kare: `<{ $componentType }>`

attribute-repeated = Ok inyal nwoyo alama { $attribute }.

attribute-invalid-for-component = Alama ma ok kare "{ $attribute }" mar bath mar kit `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Lero mar kit { $styleNumber } onge pogruok moromo mar { $context ->
        [text-on-background] rangi mar ndiko kuom rangi mar ng'e
        [high-contrast] rangi mar pogruok maduong' kuom kanvas
        [line] rangi mar laini kuom kanvas
        [marker] rangi mar ranyisi kuom kanvas
       *[text-on-canvas] rangi mar ndiko kuom kanvas
    }{ $mode ->
        [dark] { " (yo marateng')" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; dwarore { $threshold }:1 kata mokalo).

style-definition-dark-mode-text-background-contrast =
    Kata obedo ni lero mar kit { $styleNumber } oketo rangi man-gi pogruok moromo mar yo marler, rangi mag yo marateng' moa kuom kwanogi onge pogruok moromo mar rangi mar ndiko kuom rangi mar ng'e ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; dwarore { $threshold }:1 kata mokalo). { $suggestion ->
        [available] Mondo pogruok orom e yo marateng', med pogruok mar yo marler (kaka, ket { $lightAttribute }="{ $lightColor }") kata lok rangi mar yo marateng' (kaka, ket { $darkAttribute }="{ $darkColor }").
       *[none] Mondo pogruok orom e yo marateng', med pogruok mar yo marler kata lok rangi moa gi textColorDarkMode kata/gi backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Kata obedo ni lero mar kit { $styleNumber } oketo rangi mar ndiko man-gi pogruok moromo mar yo marler, rangi mar ndiko mar yo marateng' moa kuom kwanoni onge pogruok moromo kuom kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; dwarore { $threshold }:1 kata mokalo). { $suggestion ->
        [available] Mondo pogruok orom e yo marateng', med pogruok mar yo marler (kaka, ket textColor="{ $lightColor }") kata lok rangi mar yo marateng' (kaka, ket textColorDarkMode="{ $darkColor }").
       *[none] Mondo pogruok orom e yo marateng', med pogruok mar yo marler kata lok rangi moa gi textColorDarkMode.
    }

section-multiple-style-palettes = Bath nyalo yiero <stylePalette> achiel kende; itiyo gi mogik.

## Unique variants

variant-num-to-select-not-non-negative-integer = ok inyal ng'eyo kit mopogore mag { $component } nikech numToSelect ok en kwan mangima ma ok ni e bwo nono.

variant-num-to-select-not-constant-number = ok inyal ng'eyo kit mopogore mag { $component } nikech numToSelect ok en kwan ma ok lokre.

variant-with-replacement-not-constant-boolean = ok inyal ng'eyo kit mopogore mag { $component } nikech withReplacement ok en boolean ma ok lokre.

variant-select-weight-disables-unique = Kit mopogore mag select ogeng'i ka nitie yiero man-gi selectWeight kata selectForVariants

variant-coprime-undetermined = ok inyal ng'eyo kit mopogore mag { $component } nikech ok inyal ng'eyo ni coprime en miriambo kinde duto.

variant-attribute-not-constant = ok inyal ng'eyo kit mopogore mag { $component } nikech { $attribute } ok siki machalre.

variant-attribute-not-number = ok inyal ng'eyo kit mopogore mag { $component } nikech { $attribute } ok en kwan.

variant-attribute-wrong-type-for-sequence =
    ok inyal ng'eyo kit mopogore mag { $component } mar kit { $type } nikech { $attribute } ok en { $expected ->
        [letters-combination] riwruok mar nukta
        [math-expression] wach kwan moyie
        [integer] kwan mangima
       *[number] kwan
    }.

variant-length-not-integer = ok inyal ng'eyo kit mopogore mag { $component } nikech length ok en kwan mangima.

variant-sort-not-implemented = kit mopogore mag { $component } man-gi sort pok olos

variant-exclude-combinations-not-implemented = kit mopogore mag { $component } man-gi excludeCombinations pok olos

variant-math-exclude-not-implemented = kit mopogore mag { $component } mar kit math man-gi exclude pok olos

variant-non-constant-exclude-not-implemented = kit mopogore mag { $component } man-gi exclude malokore pok olos

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ok yudo kony e janyis mar graph prefigure; nyakwar owe.

prefigure-descendant-invalid-geometry = { $subject }: jiometri ma ok gik kata ma ok orom; nyakwar owe.

prefigure-curve-label-omitted = { $subject }: nying ok yudo kony e bethe mag laini modolore molok; nying owe.

prefigure-curve-unsupported-definition-type = { $subject }: kit lero mar tich mar laini modolore '{ $definitionType }' ok yud kony; nyakwar owe.

prefigure-region-flip-functions-unsupported = { $subject }: alama mar flipFunctions e regionBetweenCurves ok yud kony; nyakwar owe.

prefigure-region-non-formula-child = { $subject }: mana tije mag nyithindo mag kit formula ema yudo kony e regionBetweenCurves; nyakwar owe.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ok yud kony e { $labelKind ->
        [line-family] nying anywola mar laini
       *[point] nying tong'
    }; itiyo gi chenro machon mar PreFigure.

prefigure-fill-style-unsupported = { $subject }: kit pong' '{ $fillStyle }' ok yud kony kuom PreFigure; iduogo e pong' motegno.

prefigure-line-style-unknown = { $subject }: kit laini ma ok ng'ere '{ $lineStyle }' owe e wuok mar PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: kit ranyisi '{ $markerStyle }' olok ni kit PreFigure mar 'diamond'.

prefigure-marker-style-unsupported = { $subject }: kit ranyisi '{ $markerStyle }' ok yud kony kuom PreFigure; itiyo gi kit machon.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ma ok kare; ok inyal yudo kama ochomo. Lero owe.

annotation-ref-multiple-targets = `<annotation>`: `ref` onyiso kuonde mang'eny; itiyo gi mokwongo.

annotation-ref-outside-graph = `<annotation>`: `ref` ma ok kare; kama ochomo ni oko mar graph momake. Lero owe.

annotation-ref-unsupported-target = `<annotation>`: `ref` ma ok kare; kama ochomo ok en gir picha moyud kony e loko mar prefigure. Lero owe.

annotation-text-missing = `<annotation>`: `text` onge kata onge gimoro; iwuok gi ndiko maonge gimoro.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Oyud tenruok malworore.
       *[other] Oyud tenruok malworore man-gi bath mar `<{ $componentType }>`.
    }

reference-no-referent = Onge gima oyudi kuom ranyisi: `{ $reference }`

reference-multiple-referents = Oyud gik mang'eny kuom ranyisi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Chal ma ok kare mar alama { $attribute } mar `<{ $componentType }>`.

children-invalid = Nyithindo ma ok kare mag `<{ $componentType }>`: Oyud nyithindo ma ok kare: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Kwan ma ok kare `{ $value }` mar alama `{ $attribute }`, itiyo gi kwan `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Kit DoenetML mar { $version } ok oyudi.
       *[other] Kit DoenetML mar { $version } ok oyudi. Iduogo e kit { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ma ok kare: { $content }

parse-tag-missing-close-tag = DoenetML ma ok kare: Tag `{ $tag }` onge gi tag mar umo. Nogen tag maumore owuon kata tag mar `</{ $tagName }>`.

parse-tag-error = DoenetML ma ok kare: Bayo e tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ma ok kare: Alama ma ok kare `{ $attribute }` nenore ka onge gi kwan.

parse-attribute-invalid = DoenetML ma ok kare: Alama ma ok kare `{ $attribute }`

parse-attribute-value-invalid = DoenetML ma ok kare: Kwan mar alama ma ok kare `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML ma ok kare: Kwan mar alama ma ok kare `{ $value }`. Ranyisi mag kuoto ok romre. Nenore ni orem `{ $quote }`

parse-open-tag-name-missing = DoenetML ma ok kare: Oyud tag maonge nying, kaka `<`

parse-tag-not-closed = DoenetML ma ok kare: Tag `{ $tag }` ok oum (nenore ni orem `>`).

parse-self-closing-tag-name-missing = DoenetML ma ok kare: Oyud tag maonge nying `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ma ok kare: Tag `{ $tag }` ok oum (nenore ni orem `/>`).

parse-tag-invalid-attributes = DoenetML ma ok kare: Tag `{ $tag }` ok oyie. Onyalo bedo gi alama ma ok kare.

parse-close-tag-name-missing = DoenetML ma ok kare: Oyud tag mar umo maonge nying, kaka `</`

parse-attribute-value-unquoted = Kwan mag alama nyaka bed ei ranyisi mag kuoto: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ma ok kare: Oyud tag mar umo `{ $tag }`, to onge tag mar yawo mowinjore

parse-close-tag-mismatched = DoenetML ma ok kare: Tag mar umo ok owinjre. Nogen `</{ $expected }>`. Oyud `{ $found }`

parser-node-unconvertible = Ok onyal loko nod { $node } obed nod mar Dast.

## Names

name-attribute-invalid =
    Nying alama ok kare name='{ $name }'. { $reason ->
        [characters] Nying nyalo bedo mana gi nukta, namba, laini mar piny kata laini.
       *[start] Nying nyaka chak gi nukta.
    }

component-name-invalid-start = Nying bath ok kare "{ $name }". Nying nyaka chak gi nukta.

## `<answer>` sugar

answer-video-watched-missing-video = Duoko mar kit videoWatched nyaka bed gi alama mar video

answer-video-watched-video-not-reference = Duoko mar kit videoWatched nyaka bed gi alama mar video ma en ranyisi

answer-name-not-single-text = Alama mar name mar duoko nyaka bed gi nyathi achiel mar ndiko

## Referencing another document

external-doenetml-recursion-limit = Ok onyal kelo DoenetML mar oko nikech okang' mag nwoyo ng'eny ahinya. Be nitie ranyisi malworore?

external-doenetml-unavailable = Ok onyal kelo DoenetML koa e { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML mokel koa e { $attribute }="{ $uri }" ok kare: ok owinjre gi kit bath mar "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Alama `{ $from }` ok ti kendo; ti gi `{ $to }` kar mano.
       *[other] [deprecation] Alama `{ $from }` e `<{ $component }>` ok ti kendo; ti gi `{ $to }` kar mano.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Alama `{ $from }` ok ti kendo kendo ok okwan nikech `{ $to }` bende oket.
       *[other] [deprecation] Alama `{ $from }` e `<{ $component }>` ok ti kendo kendo ok okwan nikech `{ $to }` bende oket.
    }

deprecated-attribute-ignored = [deprecation] Alama `{ $attribute }` e `<{ $component }>` ok ti kendo kendo ok okwan.

deprecated-attribute-to-child = [deprecation] Alama `{ $attribute }` e `<{ $component }>` ok ti kendo; ti gi nyathi mar `<{ $child }>` kar mano.

deprecated-attribute-value-renamed = [deprecation] Kwan `{ $value }` mar alama `{ $attribute }` e `<{ $component }>` ok ti kendo; ti gi `{ $to }` kar mano.


## Language coverage

pluralize-english-only = `<pluralize>` nyalo loko mana ng'eny mar Kingereza, omiyo ndikone ok lokre e ndiko mondiki gi { $locale }. Ndik chal mar ng'eny owuon, kata ikete gi alama mar `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Bath `<{ $tag }>` ok en bath mar Doenet mong'ere.

schema-element-not-allowed-at-root = Bath `<{ $tag }>` ok oyie e tiend ndiko.

schema-element-not-allowed-inside = Bath `<{ $tag }>` ok oyie ei `<{ $parent }>`.

schema-attribute-unrecognized = Bath `<{ $tag }>` onge gi alama miluongo ni `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Alama `{ $attribute }` mar bath `<{ $tag }>` nyaka bed chenro ma gige moro ka moro en achiel kuom: { $allowed }
       *[other] Alama `{ $attribute }` mar bath `<{ $tag }>` nyaka bed achiel kuom: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nying kit ok kare e select.  Nying kit { $variantName } nenore e yiero { $numOptions } to kwan miyier en { $numToSelect }.

select-variant-name-without-options = Kit moko oket e select to onge yiero moket mar nying kit manyalore: { $variantName }.

select-variant-name-not-possible = Nying kit { $variantName } moket e select ok en nying kit manyalore.

select-too-few-options = Ok inyal yiero bethe { $numToSelect } kuom { $numOptions } kende.

select-from-sequence-too-few-values = Ok inyal yiero kwan { $numToSelect } kuom chenro mar bor mar { $length }.

select-from-sequence-indices-count-mismatch = Kwan mar namba moket e select nyaka romre gi kwan miyier

select-from-sequence-indices-not-integers = Namba duto moket e select nyaka bed kwan mangima

select-from-sequence-index-excluded = Namba moket mar selectfromsequence nogol oko

select-from-sequence-indices-excluded-combination = Namba moket mag selectfromsequence ne en riwruok mogol oko

select-from-sequence-coprime-not-positive-integers = Ok inyal yiero riwruok mag coprime nikech ok iyier kwan mangima madongo moloyo nono.

select-from-sequence-coprime-common-factor = Ok inyal yiero kwan mag coprime. Kwan duto manyalore nigi gima pogogi machalre. (Kwan moket mag "from" kata "to" nyaka bed coprime gi "step".)

select-from-sequence-coprime-single-number = Ok inyal yiero riwruok mag coprime koa e kwan achiel ma ok 1.

select-from-sequence-excluded-too-many-combinations = Ogol oko moloyo 70% mar riwruok e selectFromSequence

select-from-sequence-coprime-none-found = Ok onyal yiero kwan mag coprime. Kwan duto manyalore nigi gima pogogi machalre.

select-from-sequence-too-few-unique-values = Ok inyal yiero kwan mopogore { $numToSelect } kuom chenro mar bor mar { $numPossibleValues }

select-prime-numbers-too-few-values = Ok inyal yiero kwan { $numToSelect } kuom chenro mar namba mag prime mar bor mar { $numValues }

select-prime-numbers-values-count-mismatch = Kwan mar kwan moket e select nyaka romre gi kwan miyier

select-prime-numbers-values-not-prime = Kwan duto moket e select prime number nyaka bed e chenro mar namba mag prime

select-prime-numbers-values-excluded-combination = Kwan moket mag selectPrimeNumbers ne en riwruok mogol oko

select-prime-numbers-excluded-too-many-combinations = Ogol oko moloyo 70% mar riwruok e selectPrimeNumbers

select-random-combination-fluke = Kuom gima ok ogen ahinya, ok onyal yiero riwruok mar kwan moyier nono

select-random-value-fluke = Kuom gima ok ogen ahinya, ok onyal yiero kwan moyier nono
