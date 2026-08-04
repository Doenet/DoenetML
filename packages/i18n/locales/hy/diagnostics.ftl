# Armenian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Armenian counts in the same two categories English does, so every selection
# below keeps both branches — but a noun after a numeral stays singular, so the
# two branches usually differ only in the number they print.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } անտեսվում է, երբ նշված են երկու ծայրակետերը
       *[other] { $attributes } անտեսվում են, երբ նշված են երկու ծայրակետերը
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } անտեսվում է, երբ նշված են և ծայրակետը, և միջնակետը
       *[other] { $attributes } անտեսվում են, երբ նշված են և ծայրակետը, և միջնակետը
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset-ը չի ազդում առանց միջնակետի

## `<line>`

line-points-undetermined-dimensions = Ուղիղ՝ անորոշ չափողականության կետերով։

line-points-too-few-dimensions = Ուղիղը պետք է անցնի առնվազն երկչափ կետերով։

line-points-depend-on-variables = Ուղիղն անցնում է կետերով, որոնք կախված են փոփոխականներից՝ { $variables }։

line-equation-invalid-format = Ուղղի հավասարման անվավեր ձևաչափ { $variable1 } և { $variable2 } փոփոխականներով։

## `<ray>`

ray-overprescribed-through = Ճառագայթը տրված է through, endpoint և direction միջոցով։ Նշված through-ն անտեսվում է։

ray-dimension-mismatch = numDimensions-ը չի համապատասխանում ճառագայթում։

## `<vector>`

vector-overprescribed-head = Վեկտորը տրված է head, tail և displacement միջոցով։ Նշված head-ն անտեսվում է։

vector-dimension-mismatch = numDimensions-ը չի համապատասխանում վեկտորում։

## Attracting and constraining

attract-to-without-nearest-point = Հնարավոր չէ ձգել `<{ $component }>`-ին, քանի որ այն չունի nearestPoint վիճակի փոփոխական։

constrain-to-without-nearest-point = Հնարավոր չէ սահմանափակել `<{ $component }>`-ով, քանի որ այն չունի nearestPoint վիճակի փոփոխական։

constrain-to-interior-without-nearest-point = Հնարավոր չէ սահմանափակել `<{ $component }>`-ի ներսով, քանի որ այն չունի nearestPoint վիճակի փոփոխական։

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition-ն անտեսվում է ոչ ներտողային choiceInput-ի դեպքում

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-ի համար նշված ինդեքսներն անտեսվում են, քանի որ դրանց թիվը չի համապատասխանում choice զավակների թվին։

pretzel-indices-count-mismatch = problem-ի համար նշված ինդեքսներն անտեսվում են, քանի որ դրանց թիվը չի համապատասխանում problem զավակների թվին։

shuffle-indices-count-mismatch = shuffle-ի համար նշված ինդեքսներն անտեսվում են, քանի որ դրանց թիվը չի համապատասխանում բաղադրիչների թվին։

indices-ignored-out-of-range = { $component }-ի համար նշված ինդեքսներն անտեսվում են, քանի որ որոշները տիրույթից դուրս են։

pretzel-indices-repeated = pretzel-ի համար նշված ինդեքսներն անտեսվում են, քանի որ որոշները կրկնվում են։

pretzel-circuit-first-index = circuit ռեժիմում pretzel-ի համար նշված ինդեքսներն անտեսվում են, քանի որ առաջին ինդեքսը պետք է լինի 1։

## `<shuffle>` and `<sort>`

string-children-need-type = Որպեսզի `<{ $component }>`-ը աշխատի տողային զավակների հետ, պետք է նշվի `type` ատրիբուտը։

invalid-type-defaulting-to-math = Անվավեր տեսակ { $type } { $component } բաղադրիչի համար։ Պետք է լինի math, text, number կամ boolean։ Օգտագործվում է math-ը։

string-not-valid-component-to-arrange = «{ $value }» տողը { $component }-ի համար վավեր բաղադրիչ չէ։ Այն անտեսվում է։

## Types and variables

invalid-type-defaulting-to-number = Անվավեր տեսակ { $type }, տեսակը դրվում է number։

invalid-variable-value = Փոփոխականի անվավեր արժեք՝ `{ $value }`

## Variants

variant-index-must-be-number = Տարբերակի ինդեքսը { $index } պետք է լինի թիվ

variant-index-must-be-integer = Տարբերակի ինդեքսը { $index } պետք է լինի ամբողջ թիվ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>`-ը իրականացված չէ բացարձակ չափումների համար։ Լայնությունները դառնում են հարաբերական։

side-by-side-absolute-margins = `<{ $component }>`-ը իրականացված չէ բացարձակ չափումների համար։ Լուսանցքները դառնում են հարաբերական։

side-by-side-no-block-child = Անվավեր `<{ $component }>`՝ այն պետք է ունենա առնվազն մեկ բլոկային զավակ։

## `<label>`

label-for-ignored-on-graphical = Գրաֆիկական `<label>`-ի `for` ատրիբուտն անտեսվում է։

label-for-must-resolve-to-one = `<label>`-ի `for` ատրիբուտը պետք է ցույց տա ուղիղ մեկ բաղադրիչ։

label-for-unresolved = `<label>`-ի `for` ատրիբուտը չհաջողվեց կապել բաղադրիչի հետ։

label-for-answer-with-authored-inputs = `<label>`-ի `for` ատրիբուտը հղում է `<answer>`-ի, որն ունի հեղինակի գրած մուտքի դաշտեր. հղում արեք անմիջապես դաշտին։

label-for-answer-without-input = `<label>`-ի `for` ատրիբուտը հղում է `<answer>`-ի, որը չունի պիտակելու մուտքի դաշտ։

label-for-must-reference-input-or-answer = `<label>`-ի `for` ատրիբուտը պետք է հղում անի մուտքի դաշտի կամ պատասխանի։

## Accessibility

accessibility-short-description-or-decorative = Մատչելիության համար `<{ $component }>`-ը պետք է ունենա կարճ նկարագրություն կամ նշված լինի որպես դեկորատիվ։

accessibility-video-short-description = Մատչելիության համար `<video>`-ն պետք է ունենա կարճ նկարագրություն։

accessibility-input-short-description-or-label = Մատչելիության համար `<{ $component }>`-ը պետք է ունենա կարճ նկարագրություն կամ պիտակ։

accessibility-answer-input-short-description-or-label = Մատչելիության համար մուտքի դաշտ ստեղծող `<answer>`-ը պետք է ունենա կարճ նկարագրություն կամ պիտակ։

accessibility-short-description-contains-math = Կարճ նկարագրությունները չպետք է պարունակեն մաթեմատիկական բաղադրիչներ, ինչպիսին է `<{ $component }>`-ը։ Մաթեմատիկան գրեք բառերով։

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName }-ի հակադրությունը բավարար չէ բաժնի վերնագրի տեքստի համար (մուգ ոճ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; պահանջվում է առնվազն { $threshold }:1)։
       *[other] { $colorName }-ի հակադրությունը բավարար չէ բաժնի վերնագրի տեքստի համար ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; պահանջվում է առնվազն { $threshold }:1)։
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>`-ը { $count } կետով իրականացված չէ, երբ կետերը թվային արժեքներ չունեն։

circle-too-many-through-points = Հնարավոր չէ հաշվել շրջանագիծ 3-ից ավելի կետով։

circle-overprescribed-radius-center-points = Հնարավոր չէ հաշվել շրջանագիծ նշված շառավղով, կենտրոնով և կետերով։

circle-center-with-multiple-points = Հնարավոր չէ հաշվել շրջանագիծ նշված կենտրոնով 1-ից ավելի կետով։

circle-radius-too-small = Հնարավոր չէ հաշվել շրջանագիծը. քանի որ երկու կետերի հեռավորությունը { $distance } է, նշված շառավիղը { $radius } չափազանց փոքր է։

circle-radius-with-many-points = Հնարավոր չէ ստեղծել շրջանագիծ երկուսից ավելի կետով նշված շառավղով։

circle-invalid-center-or-through-points = Շրջանագծի անվավեր կենտրոն կամ կետեր։

circle-radius-center-with-multiple-points = Հնարավոր չէ հաշվել նշված կենտրոնով շրջանագծի շառավիղը 1-ից ավելի կետով։

circle-change-radius-non-numerical = Հնարավոր չէ փոխել ոչ թվային կետերով շրջանագծի շառավիղը

circle-radius-with-points-non-numerical = Հնարավոր չէ ստեղծել շրջանագիծ մեկից ավելի կետով նշված շառավղով, երբ թվային արժեքներ չկան։

circle-change-center-non-numerical = Ոչ թվային կետերով անցնող շրջանագծի կենտրոնի փոփոխությունն իրականացված չէ։

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ֆունկցիայի որոշման տիրույթի չափողականությունը բավարար չէ։ Տիրույթն ունի { $intervals } միջակայք, իսկ ֆունկցիան՝ { $inputs ->
            [one] { $inputs } մուտք
           *[other] { $inputs } մուտք
        }։
       *[other] Ֆունկցիայի որոշման տիրույթի չափողականությունը բավարար չէ։ Տիրույթն ունի { $intervals } միջակայք, իսկ ֆունկցիան՝ { $inputs ->
            [one] { $inputs } մուտք
           *[other] { $inputs } մուտք
        }։
    }

function-domain-invalid-format = Ֆունկցիայի որոշման տիրույթի անվավեր ձևաչափ։

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ֆունկցիայի ոչ թվային մաքսիմումն անտեսվում է։
        [minimum] Ֆունկցիայի ոչ թվային մինիմումն անտեսվում է։
        [extremum] Ֆունկցիայի ոչ թվային էքստրեմումն անտեսվում է։
        [point] Ֆունկցիայի ոչ թվային կետն անտեսվում է։
        [slope] Ֆունկցիայի ոչ թվային թեքությունն անտեսվում է։
       *[other] Ֆունկցիայի ոչ թվային { $type }-ն անտեսվում է։
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ֆունկցիայի դատարկ մաքսիմումն անտեսվում է։
        [minimum] Ֆունկցիայի դատարկ մինիմումն անտեսվում է։
        [extremum] Ֆունկցիայի դատարկ էքստրեմումն անտեսվում է։
        [point] Ֆունկցիայի դատարկ կետն անտեսվում է։
       *[other] Ֆունկցիայի դատարկ { $type }-ն անտեսվում է։
    }

function-points-too-close = Ֆունկցիան պարունակում է իրար չափազանց մոտ երկու կետ։ Ֆունկցիան հնարավոր չէ որոշել։

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Ֆունկցիայի կրկնումները հնարավոր են միայն այն դեպքում, երբ մուտքերի թիվը հավասար է ելքերի թվին։ Այս ֆունկցիան ունի { $inputs } մուտք և { $outputs ->
            [one] { $outputs } ելք
           *[other] { $outputs } ելք
        }։
       *[other] Ֆունկցիայի կրկնումները հնարավոր են միայն այն դեպքում, երբ մուտքերի թիվը հավասար է ելքերի թվին։ Այս ֆունկցիան ունի { $inputs } մուտք և { $outputs ->
            [one] { $outputs } ելք
           *[other] { $outputs } ելք
        }։
    }

## `<sequence>`

sequence-invalid-length = Հաջորդականության անվավեր երկարություն։ Պետք է լինի ոչ բացասական ամբողջ թիվ։

sequence-invalid-step = Հաջորդականության անվավեր քայլ։ { $type } տեսակի հաջորդականության համար պետք է լինի թիվ։

sequence-invalid-endpoint-number = Թվային հաջորդականության անվավեր «{ $attribute }»։ Պետք է լինի թիվ։

sequence-invalid-endpoint-letters = Տառային հաջորդականության անվավեր «{ $attribute }»։ Պետք է լինի տառերի համակցություն։

sequence-invalid-endpoint = Հաջորդականության անվավեր «{ $attribute }»։

select-from-sequence-coprime-not-numbers = coprime-ն անտեսվում է, քանի որ թվեր չեն ընտրվում

select-from-sequence-coprime-with-exclude-combinations = coprime-ն անտեսվում է, քանի որ նշված է excludeCombinations

## Resolving a `target`

target-not-found = `<{ $source }>`-ի անվավեր target՝ թիրախը չի գտնվել։

target-state-variable-not-found = `<{ $source }>`-ի անվավեր target՝ `<{ $component }>`-ի վրա «{ $property }» անունով վիճակի փոփոխական չի գտնվել։

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-ի փոփոխականները պետք է տարբերվեն անկախ փոփոխականից։

ode-system-duplicate-variable-names = Հնարավոր չէ որոշել ԴՀ աջ մասերի ֆունկցիաները կրկնվող կախյալ փոփոխականների անուններով։

ode-system-rhs-function-error = Հնարավոր չէ որոշել ԴՀ աջ մասի ֆունկցիան։ Սխալ mathjs ֆունկցիա ստեղծելիս։

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Հնարավոր չէ որոշել անկյուն { $count } ուղղի միջև

angle-invalid-through-point = `<angle>`-ի through-ում անվավեր կետ

parabola-vertex-too-many-points = Նշված գագաթով պարաբոլն 1-ից ավելի կետով իրականացված չէ։

parabola-too-many-points = Պարաբոլն 3-ից ավելի կետով իրականացված չէ։

intersection-too-many-items = Երկուսից ավելի օբյեկտի հատումն իրականացված չէ

## Other math components

ionic-compound-not-two-ions = Երկու իոնից բացի այլ իոնային միացություններ իրականացված չեն։

ionic-compound-needs-cation-and-anion = Իոնային միացությունները իրականացված են միայն մեկ կատիոնի և մեկ անիոնի համար։

solve-equations-cannot-evaluate = Հնարավոր չէ լուծել հավասարումը, քանի որ այն չհաջողվեց հաշվել՝ { $equation }

math-operators-operand-number-required = Մաթեմատիկական օպերանդ առանձնացնելու համար պետք է նշվի operandNumber։

eigen-decomposition-failed = Չհաջողվեց հաշվել մատրիցի սեփական արժեքները

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`՝ { $parameters } պարամետրը ձևանմուշում չի հանդիպում, ուստի այն միշտ կհամապատասխանի դատարկին։
       *[other] `<matchesPattern>`՝ { $parameters } պարամետրերը ձևանմուշում չեն հանդիպում, ուստի դրանք միշտ կհամապատասխանեն դատարկին։
    }

## `<graph>`

graph-grid-invalid = `<graph>`՝ հնարավոր չէ մեկնաբանել grid="{ $grid }"։ Այն պետք է լինի none, medium, dense կամ բացատով բաժանված երկու դրական թիվ, օրինակ՝ grid="1 0.5"։ Ցանց չի գծվում։

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`՝ xLabelPosition="left"-ը չի աջակցվում prefigure պատկերիչում. օգտագործվում է աջ դիրքի վարքը։

prefigure-y-label-position-unsupported = `<graph>`՝ yLabelPosition="bottom"-ը չի աջակցվում prefigure պատկերիչում. օգտագործվում է վերին դիրքի վարքը։

prefigure-invalid-axis-bounds = `<graph>`՝ առանցքների անվավեր սահմաններ prefigure-ի փոխարկման համար. օգտագործվում է լռելյայն bbox-ը (-10,-10,10,10)։

prefigure-invalid-width = `<graph>`՝ անվավեր լայնություն prefigure-ի փոխարկման համար. օգտագործվում է դիագրամի լռելյայն լայնությունը՝ 425։

prefigure-invalid-aspect-ratio = `<graph>`՝ անվավեր aspectRatio prefigure-ի փոխարկման համար. օգտագործվում է լռելյայն կողմերի հարաբերությունը՝ 1։

prefigure-grid-spacing-too-fine = `<graph>`՝ ցանցի քայլը չափազանց մանր է առանցքների սահմանների համար. prefigure պատկերիչում ցանցը բաց է թողնվում։

prefigure-annotations-not-rendered = `<graph>`՝ ծանոթագրությունները չեն գծվի, եթե PreFigure պատկերիչը չի օգտագործվում։

multiple-annotations-children = `<graph>`-ում գտնվել է մի քանի `<annotations>` զավակ. բոլորն անտեսվում են, բացի վերջինից։

## Referring to other components

copy-unrecognized-component-type = Հնարավոր չէ ընդլայնել կամ պատճենել անհայտ բաղադրիչի տեսակ՝ { $type }։

copy-prop-not-found = { $property } հատկությունը չի գտնվել { $component } տեսակի բաղադրիչի վրա

collect-no-source = collect-ի համար աղբյուր չի գտնվել։

collect-invalid-component-type = Հնարավոր չէ հավաքել `<{ $component }>` տեսակի բաղադրիչներ, քանի որ դա անվավեր բաղադրիչի տեսակ է։

reference-index-unavailable = Հնարավոր չէ հղում անել `{ $reference }` ինդեքսին

## `<callAction>`

component-action-unavailable = Հնարավոր չէ կանչել { $action }-ը `{ $reference }` բաղադրիչի վրա

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Տվյալներն անվավեր ձև ունեն։ Տողերի երկարությունները տարբեր են։ Գտնվել է componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Տվյալներում կան կրկնվող սյուների անուններ։ Գտնվել է componentIdx :{ $componentIdx }

data-frame-missing-column-name = Տվյալներում բացակայում է սյան անունը։ Գտնվել է componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Այս պատասխանի award-ը հիմնված է answer պիտակի սեփական ուղարկված պատասխանի վրա, ինչը կհանգեցնի անսպասելի վարքի։

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts`-ի նշումը `<answer>`-ի վրա `sectionWideCheckWork` ունեցող տարայի ներսում չի ազդում, քանի որ փորձերի թիվը որոշում է տարան։ Նշեք `maxNumAttempts`-ը տարայի վրա։

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts`-ի նշումը `sectionWideCheckWork` ունեցող տարայի վրա, որն ինքը գտնվում է `sectionWideCheckWork` ունեցող մեկ այլ տարայի ներսում, չի ազդում, քանի որ փորձերի թիվը որոշում է արտաքին տարան։ Նշեք `maxNumAttempts`-ը արտաքին տարայի վրա։

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] { $attributes } ատրիբուտը չի ազդի առանց նշված symbolicEquality-ի։
       *[other] { $attributes } ատրիբուտները չեն ազդի առանց նշված symbolicEquality-ի։
    }

answer-invalid-type = Answer-ի անվավեր տեսակ՝ { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Քանի որ `<{ $component }>` բաղադրիչը անուն չունի, այն հնարավոր չէ օգտագործել որպես մոդուլի ատրիբուտ

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` բաղադրիչը հնարավոր չէ օգտագործել որպես մոդուլի ատրիբուտ, քանի որ `<module>` բաղադրիչի տեսակն արդեն ունի «{ $name }» ատրիբուտ։

conditional-content-condition-ignored = `condition` ատրիբուտն անտեսվում է case կամ else զավակներ ունեցող `<conditionalContent>` բաղադրիչի վրա։

slider-markers-type-mismatch = Մարկերների տեսակը չի համապատասխանում սահիչի տեսակին։

pretzel-problem-needs-statement-and-answer = Անվավեր pretzel՝ յուրաքանչյուր `<problem>` պետք է պարունակի մեկ `<statement>` և մեկ `<answer>`։

pretzel-circuit-first-problem-distractor = Անվավեր pretzel՝ mode="circuit" ռեժիմում առաջին `<problem>`-ը չի կարող շեղող լինել։

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Անվավեր արժեք { $values } `{ $attribute }` ատրիբուտի համար. այն անտեսվում է։
       *[other] Անվավեր արժեքներ { $values } `{ $attribute }` ատրիբուտի համար. դրանք անտեսվում են։
    }

attribute-must-be-references = Անվավեր արժեք `{ $value }` `{ $attribute }` ատրիբուտի համար։ Ատրիբուտը պետք է կազմված լինի `$`-ով սկսվող հղումներից։

math-input-invalid-function-names = <mathInput>՝ { $attribute }-ում անվավեր ֆունկցիաների անուններն անտեսվեցին՝ { $names }։ Յուրաքանչյուր անվան ցուցադրվող մասը պետք է լինի առնվազն 2 նիշ (տառեր կամ գծիկներ). դրան կարող է հետևել ընտրովի `|<mathspeak այլընտրանք>` վերջածանցը։

## Building components from the source

component-type-invalid = Անվավեր բաղադրիչի տեսակ՝ `<{ $componentType }>`

attribute-repeated = Հնարավոր չէ կրկնել { $attribute } ատրիբուտը։

attribute-invalid-for-component = Անվավեր ատրիբուտ «{ $attribute }» `<{ $componentType }>` տեսակի բաղադրիչի համար։

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } ոճի սահմանման հակադրությունը բավարար չէ { $context ->
        [text-on-background] տեքստի գույնի համար ֆոնի գույնի նկատմամբ
        [high-contrast] բարձր հակադրության գույնի համար կտավի նկատմամբ
        [line] գծի գույնի համար կտավի նկատմամբ
        [marker] մարկերի գույնի համար կտավի նկատմամբ
       *[text-on-canvas] տեքստի գույնի համար կտավի նկատմամբ
    }{ $mode ->
        [dark] { " (մուգ ոճ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; պահանջվում է առնվազն { $threshold }:1)։

style-definition-dark-mode-text-background-contrast =
    Թեև { $styleNumber } ոճի սահմանման մեջ նշված գույները բավարար հակադրություն են ապահովում բաց ոճի համար, դրանցից ստացված մուգ ոճի գույները տեքստի և ֆոնի միջև բավարար հակադրություն չեն տալիս ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; պահանջվում է առնվազն { $threshold }:1)։ { $suggestion ->
        [available] Մուգ ոճում բավարար հակադրություն ապահովելու համար կա՛մ մեծացրեք հակադրությունը բաց ոճում (օրինակ՝ { $lightAttribute }="{ $lightColor }"), կա՛մ վերասահմանեք մուգ ոճի գույնը (օրինակ՝ { $darkAttribute }="{ $darkColor }")։
       *[none] Մուգ ոճում բավարար հակադրություն ապահովելու համար մեծացրեք հակադրությունը բաց ոճում կամ վերասահմանեք ստացված գույները textColorDarkMode-ով և/կամ backgroundColorDarkMode-ով։
    }

style-definition-dark-mode-text-canvas-contrast =
    Թեև { $styleNumber } ոճի սահմանման մեջ նշված տեքստի գույնը բավարար հակադրություն է ապահովում բաց ոճի համար, դրանից ստացված մուգ ոճի տեքստի գույնը կտավի նկատմամբ բավարար հակադրություն չի տալիս ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; պահանջվում է առնվազն { $threshold }:1)։ { $suggestion ->
        [available] Մուգ ոճում բավարար հակադրություն ապահովելու համար կա՛մ մեծացրեք հակադրությունը բաց ոճում (օրինակ՝ textColor="{ $lightColor }"), կա՛մ վերասահմանեք մուգ ոճի գույնը (օրինակ՝ textColorDarkMode="{ $darkColor }")։
       *[none] Մուգ ոճում բավարար հակադրություն ապահովելու համար մեծացրեք հակադրությունը բաց ոճում կամ վերասահմանեք ստացված գույնը textColorDarkMode-ով։
    }

section-multiple-style-palettes = Բաժինը կարող է ընտրել միայն մեկ <stylePalette>. օգտագործվում է վերջինը։

## Unique variants

variant-num-to-select-not-non-negative-integer = հնարավոր չէ որոշել { $component }-ի եզակի տարբերակները, քանի որ numToSelect-ը ոչ բացասական ամբողջ թիվ չէ։

variant-num-to-select-not-constant-number = հնարավոր չէ որոշել { $component }-ի եզակի տարբերակները, քանի որ numToSelect-ը հաստատուն թիվ չէ։

variant-with-replacement-not-constant-boolean = հնարավոր չէ որոշել { $component }-ի եզակի տարբերակները, քանի որ withReplacement-ը հաստատուն տրամաբանական արժեք չէ։

variant-select-weight-disables-unique = select-ի եզակի տարբերակներն անջատված են, եթե որևէ տարբերակի համար նշված է selectWeight կամ selectForVariants

variant-coprime-undetermined = հնարավոր չէ որոշել { $component }-ի եզակի տարբերակները, քանի որ հնարավոր չէ պարզել, թե coprime-ը միշտ կեղծ է։

variant-attribute-not-constant = հնարավոր չէ որոշել { $component }-ի եզակի տարբերակները, քանի որ { $attribute }-ը հաստատուն չէ։

variant-attribute-not-number = հնարավոր չէ որոշել { $component }-ի եզակի տարբերակները, քանի որ { $attribute }-ը թիվ չէ։

variant-attribute-wrong-type-for-sequence =
    հնարավոր չէ որոշել { $type } տեսակի { $component }-ի եզակի տարբերակները, քանի որ { $attribute }-ը { $expected ->
        [letters-combination] տառերի համակցություն
        [math-expression] վավեր մաթեմատիկական արտահայտություն
        [integer] ամբողջ թիվ
       *[number] թիվ
    } չէ։

variant-length-not-integer = հնարավոր չէ որոշել { $component }-ի եզակի տարբերակները, քանի որ length-ը ամբողջ թիվ չէ։

variant-sort-not-implemented = sort-ով { $component }-ի եզակի տարբերակներն իրականացված չեն

variant-exclude-combinations-not-implemented = excludeCombinations-ով { $component }-ի եզակի տարբերակներն իրականացված չեն

variant-math-exclude-not-implemented = exclude-ով math տեսակի { $component }-ի եզակի տարբերակներն իրականացված չեն

variant-non-constant-exclude-not-implemented = ոչ հաստատուն exclude-ով { $component }-ի եզակի տարբերակներն իրականացված չեն

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }՝ չի աջակցվում գրաֆիկի prefigure պատկերիչում. ժառանգը բաց է թողնվել։

prefigure-descendant-invalid-geometry = { $subject }՝ ոչ վերջավոր կամ թերի երկրաչափություն. ժառանգը բաց է թողնվել։

prefigure-curve-label-omitted = { $subject }՝ պիտակները չեն աջակցվում փոխարկված կորի տարրերի վրա. պիտակը բաց է թողնվել։

prefigure-curve-unsupported-definition-type = { $subject }՝ չաջակցվող կորի ֆունկցիայի սահմանման տեսակ «{ $definitionType }». ժառանգը բաց է թողնվել։

prefigure-region-flip-functions-unsupported = { $subject }՝ regionBetweenCurves-ի flipFunctions ատրիբուտը չի աջակցվում. ժառանգը բաց է թողնվել։

prefigure-region-non-formula-child = { $subject }՝ regionBetweenCurves-ը աջակցում է միայն բանաձևով տրված զավակ ֆունկցիաներ. ժառանգը բաց է թողնվել։

prefigure-label-position-unsupported =
    { $subject }՝ չաջակցվող labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] ուղիղների ընտանիքի պիտակի համար
       *[point] կետի պիտակի համար
    }. օգտագործվում է PreFigure-ի լռելյայն հավասարեցումը։

prefigure-fill-style-unsupported = { $subject }՝ լցման ոճը «{ $fillStyle }» չի աջակցվում PreFigure-ում. օգտագործվում է հոծ լցում։

prefigure-line-style-unknown = { $subject }՝ անհայտ գծի ոճ «{ $lineStyle }» բաց է թողնվել PreFigure-ի ելքից։

prefigure-marker-style-mapped-to-diamond = { $subject }՝ մարկերի ոճը «{ $markerStyle }» կապվել է PreFigure-ի «diamond» ոճին։

prefigure-marker-style-unsupported = { $subject }՝ մարկերի ոճը «{ $markerStyle }» չի աջակցվում PreFigure-ում. օգտագործվում է լռելյայն ոճը։

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`՝ անվավեր `ref`. թիրախը հնարավոր չէ կապել։ Ծանոթագրությունը բաց է թողնվել։

annotation-ref-multiple-targets = `<annotation>`՝ `ref`-ը կապվեց մի քանի թիրախի. օգտագործվում է առաջինը։

annotation-ref-outside-graph = `<annotation>`՝ անվավեր `ref`. թիրախը պարունակող գրաֆիկից դուրս է։ Ծանոթագրությունը բաց է թողնվել։

annotation-ref-unsupported-target = `<annotation>`՝ անվավեր `ref`. թիրախը prefigure-ի փոխարկման մեջ աջակցվող գրաֆիկական օբյեկտ չէ։ Ծանոթագրությունը բաց է թողնվել։

annotation-text-missing = `<annotation>`՝ `text`-ը բացակայում է կամ դատարկ է. դուրս է բերվում դատարկ տեքստ։

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Հայտնաբերվել է շրջանաձև կախվածություն։
       *[other] Հայտնաբերվել է շրջանաձև կախվածություն, որը ներառում է `<{ $componentType }>` բաղադրիչը։
    }

reference-no-referent = Հղման համար օբյեկտ չի գտնվել՝ `{ $reference }`

reference-multiple-referents = Հղման համար գտնվել է մի քանի օբյեկտ՝ `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>`-ի { $attribute } ատրիբուտի անվավեր ձևաչափ։

children-invalid = Անվավեր զավակներ `<{ $componentType }>`-ի համար՝ գտնվել են անվավեր զավակներ՝ { $children }

## Falling back to a default

attribute-value-invalid-using-default = Անվավեր արժեք `{ $value }` `{ $attribute }` ատրիբուտի համար. օգտագործվում է `{ $default }` արժեքը

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } տարբերակը չի գտնվել։
       *[other] DoenetML { $version } տարբերակը չի գտնվել։ Օգտագործվում է { $fallback } տարբերակը
    }

## Reading the DoenetML

parse-invalid-doenetml = Անվավեր DoenetML՝ { $content }

parse-tag-missing-close-tag = Անվավեր DoenetML՝ `{ $tag }` պիտակը փակող պիտակ չունի։ Սպասվում էր ինքնափակվող պիտակ կամ `</{ $tagName }>` պիտակ։

parse-tag-error = Անվավեր DoenetML՝ սխալ `<{ $tagName }>` պիտակում

parse-attribute-missing-value = Անվավեր DoenetML՝ `{ $attribute }` ատրիբուտին կարծես արժեք է պակասում։

parse-attribute-invalid = Անվավեր DoenetML՝ անվավեր ատրիբուտ `{ $attribute }`

parse-attribute-value-invalid = Անվավեր DoenetML՝ ատրիբուտի անվավեր արժեք `{ $value }`

parse-attribute-value-quote-mismatch = Անվավեր DoenetML՝ ատրիբուտի անվավեր արժեք `{ $value }`։ Չակերտները չեն համապատասխանում։ Կարծես պակասում է `{ $quote }`

parse-open-tag-name-missing = Անվավեր DoenetML՝ գտնվել է առանց անվան պիտակ, օրինակ՝ `<`

parse-tag-not-closed = Անվավեր DoenetML՝ `{ $tag }` պիտակը փակված չէ (կարծես պակասում է `>`)։

parse-self-closing-tag-name-missing = Անվավեր DoenetML՝ գտնվել է առանց անվան պիտակ `<{ $content }>`

parse-self-closing-tag-not-closed = Անվավեր DoenetML՝ `{ $tag }` պիտակը փակված չէ (կարծես պակասում է `/>`)։

parse-tag-invalid-attributes = Անվավեր DoenetML՝ `{ $tag }` պիտակը վավեր չէ։ Այն կարող է սխալ ատրիբուտներ ունենալ։

parse-close-tag-name-missing = Անվավեր DoenetML՝ գտնվել է առանց անվան փակող պիտակ, օրինակ՝ `</`

parse-attribute-value-unquoted = Ատրիբուտների արժեքները պետք է չակերտների մեջ լինեն՝ `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Անվավեր DoenetML՝ գտնվել է `{ $tag }` փակող պիտակ, բայց համապատասխան բացող պիտակ չկա

parse-close-tag-mismatched = Անվավեր DoenetML՝ չհամապատասխանող փակող պիտակ։ Սպասվում էր `</{ $expected }>`։ Գտնվել է `{ $found }`

parser-node-unconvertible = { $node } հանգույցը չհաջողվեց փոխարկել Dast հանգույցի։

## Names

name-attribute-invalid =
    Անվավեր ատրիբուտ name='{ $name }'։ { $reason ->
        [characters] Անունները կարող են պարունակել միայն տառեր, թվեր, ընդգծումներ կամ գծիկներ։
       *[start] Անունները պետք է սկսվեն տառով։
    }

component-name-invalid-start = Անվավեր բաղադրիչի անուն «{ $name }»։ Անունները պետք է սկսվեն տառով։

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched տեսակի answer-ը պետք է ունենա video ատրիբուտ

answer-video-watched-video-not-reference = videoWatched տեսակի answer-ի video ատրիբուտը պետք է հղում լինի

answer-name-not-single-text = answer-ի name ատրիբուտը պետք է ունենա ուղիղ մեկ տեքստային զավակ

## Referencing another document

external-doenetml-recursion-limit = Հնարավոր չէ ստանալ արտաքին DoenetML-ը ռեկուրսիայի չափազանց շատ մակարդակների պատճառով։ Արդյոք շրջանաձև հղում կա՞։

external-doenetml-unavailable = Հնարավոր չէ ստանալ DoenetML-ը { $attribute }="{ $uri }"-ից

external-doenetml-type-mismatch = { $attribute }="{ $uri }"-ից ստացվել է անվավեր DoenetML՝ այն չհամապատասխանեց «{ $componentType }» բաղադրիչի տեսակին

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` ատրիբուտը հնացած է. օգտագործեք `{ $to }`։
       *[other] [deprecation] `<{ $component }>`-ի `{ $from }` ատրիբուտը հնացած է. օգտագործեք `{ $to }`։
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` ատրիբուտը հնացած է և անտեսվում է, քանի որ նշված է նաև `{ $to }`։
       *[other] [deprecation] `<{ $component }>`-ի `{ $from }` ատրիբուտը հնացած է և անտեսվում է, քանի որ նշված է նաև `{ $to }`։
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`-ի `{ $attribute }` ատրիբուտը հնացած է և անտեսվում է։


## Language coverage

pluralize-english-only = `<pluralize>`-ը կարող է հոգնակի կազմել միայն անգլերենի համար, ուստի { $locale } լեզվով գրված փաստաթղթում նրա տեքստը մնում է անփոփոխ։ Գրեք հոգնակի ձևն ինքներդ կամ նշեք այն `pluralForm` ատրիբուտով։


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` տարրը Doenet-ի հայտնի տարր չէ։

schema-element-not-allowed-at-root = `<{ $tag }>` տարրը թույլատրված չէ փաստաթղթի արմատում։

schema-element-not-allowed-inside = `<{ $tag }>` տարրը թույլատրված չէ `<{ $parent }>`-ի ներսում։

schema-attribute-unrecognized = `<{ $tag }>` տարրը չունի `{ $attribute }` անունով ատրիբուտ։

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` տարրի `{ $attribute }` ատրիբուտը պետք է լինի ցանկ, որի յուրաքանչյուր տարրը հետևյալներից մեկն է՝ { $allowed }
       *[other] `<{ $tag }>` տարրի `{ $attribute }` ատրիբուտը պետք է լինի հետևյալներից մեկը՝ { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select-ի անվավեր տարբերակի անուն։ { $variantName } տարբերակի անունը հանդիպում է { $numOptions } տարբերակում, իսկ ընտրելու թիվը { $numToSelect } է։

select-variant-name-without-options = select-ի համար նշված են տարբերակներ, բայց հնարավոր տարբերակի անվան համար ոչ մի ընտրանք չկա՝ { $variantName }։

select-variant-name-not-possible = select-ի համար նշված { $variantName } տարբերակի անունը հնարավոր տարբերակի անուն չէ։

select-too-few-options = Հնարավոր չէ ընտրել { $numToSelect } բաղադրիչ ընդամենը { $numOptions }-ից։

select-from-sequence-too-few-values = Հնարավոր չէ ընտրել { $numToSelect } արժեք { $length } երկարությամբ հաջորդականությունից։

select-from-sequence-indices-count-mismatch = select-ի համար նշված ինդեքսների թիվը պետք է համապատասխանի ընտրելու թվին

select-from-sequence-indices-not-integers = select-ի համար նշված բոլոր ինդեքսները պետք է լինեն ամբողջ թվեր

select-from-sequence-index-excluded = selectfromsequence-ի նշված ինդեքսը բացառված էր

select-from-sequence-indices-excluded-combination = selectfromsequence-ի նշված ինդեքսները բացառված համակցություն էին

select-from-sequence-coprime-not-positive-integers = Հնարավոր չէ ընտրել փոխադարձ պարզ համակցություններ, քանի որ դրական ամբողջ թվեր չեն ընտրվում։

select-from-sequence-coprime-common-factor = Հնարավոր չէ ընտրել փոխադարձ պարզ թվեր։ Բոլոր հնարավոր արժեքներն ունեն ընդհանուր բաժանարար։ ("from" կամ "to" նշված արժեքները պետք է "step"-ի հետ փոխադարձ պարզ լինեն։)

select-from-sequence-coprime-single-number = Հնարավոր չէ ընտրել փոխադարձ պարզ համակցություններ մեկ թվից, որը 1 չէ։

select-from-sequence-excluded-too-many-combinations = selectFromSequence-ում բացառվել է համակցությունների ավելի քան 70%-ը

select-from-sequence-coprime-none-found = Չհաջողվեց ընտրել փոխադարձ պարզ թվեր։ Բոլոր հնարավոր արժեքներն ունեն ընդհանուր բաժանարար։

select-from-sequence-too-few-unique-values = Հնարավոր չէ ընտրել { $numToSelect } տարբեր արժեք { $numPossibleValues } երկարությամբ հաջորդականությունից

select-prime-numbers-too-few-values = Հնարավոր չէ ընտրել { $numToSelect } արժեք { $numValues } երկարությամբ պարզ թվերի ցանկից

select-prime-numbers-values-count-mismatch = select-ի համար նշված արժեքների թիվը պետք է համապատասխանի ընտրելու թվին

select-prime-numbers-values-not-prime = select prime number-ի համար նշված բոլոր արժեքները պետք է լինեն պարզ թվերի ցանկում

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-ի նշված արժեքները բացառված համակցություն էին

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-ում բացառվել է համակցությունների ավելի քան 70%-ը

select-random-combination-fluke = Չափազանց քիչ հավանական պատահականության պատճառով չհաջողվեց ընտրել պատահական արժեքների համակցություն

select-random-value-fluke = Չափազանց քիչ հավանական պատահականության պատճառով չհաջողվեց ընտրել պատահական արժեք
