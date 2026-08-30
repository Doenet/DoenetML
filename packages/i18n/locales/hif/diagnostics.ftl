# Fiji Hindi (Fiji Baat) diagnostics: the errors and warnings the core and the
# language server put in front of whoever is looking at the screen. Translated
# from `locales/en/diagnostics.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Latin script, left to right, the conventional Fiji Hindi orthography —
# the same convention the other three files of this locale state, and
# `chrome.ftl` sets out why it is Latin rather than the Devanagari ICU
# maximizes `hif` to.
#
# **Element names, attribute names and values are not words.** `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `math`, `text`, `boolean`,
# `coprime`, `selectFromSequence` and every `<tag>` written into these
# sentences are DoenetML identifiers and stay in English exactly as they are.
# The backticks and angle brackets around them are this catalog's punctuation.
#
# **This file is where the Latin script earns its keep and also where it is
# hardest to read.** A DoenetML identifier is English written in Latin letters,
# and so is the prose around it, so there is no visual boundary between the two
# the way there is in `locales/skr` and `locales/brh`. The backticks are the
# only marker, which is a reason to leave them exactly where they are.
#
# **No message here selects on a count.** CLDR has no plural data for `hif`, so
# a category branch would be one nothing could select and `lint:i18n` would
# reject; and a Fiji Hindi noun after a numeral stays unmarked in any case.
# Each such message is written once as `*[other]`, with the count kept in the
# selector so that nothing is lost from the message's shape. The `[1]` in
# `field-function-wrong-num-outputs` is a numeric literal rather than a
# category — Fluent matches it against the number itself — so it stays where
# English has it. The symbolic selectors — `$reason`, `$type`, `$mode`,
# `$suggestion`, `$isList`, `$context`, `$expected` and the rest — keep every
# branch English has, because those keys are compared letter for letter and a
# renamed one is a branch nothing can reach.
#
# **A small set of frames, chosen once and used throughout**, so that a
# correction is one search:
#
#   «… ignore karaa jaawe hai»   is ignored
#   «… set karaa hai»            is specified
#   «… galat hai»                is invalid
#   «… nai milaa»                was not found
#   «… nai hoy sake»             cannot be done
#   «… hona chaahi»              must be
#   «kaahe ki …»                 because
#
# **The technical vocabulary is English, deliberately.** `component`,
# `attribute`, `value`, `index`, `variant`, `reference`, `matrix`, `function`,
# `vector`, `type`, `list`, `contrast`, `renderer` are what a Fiji Hindi
# speaker says, because everything they were taught about computers and
# mathematics was taught in English. Coining Sanskritic replacements would
# produce Standard Hindi under this tag.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] Jab dui endpoint set karaa hai, tab { $attributes } ignore karaa jaawe hai
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] Jab ek endpoint aur ek midpoint dunu set karaa hai, tab { $attributes } ignore karaa jaawe hai
    }

line-segment-midpoint-offset-without-midpoint = Midpoint ke bina midpointOffset ke koi asar nai hai

## `<line>`

line-points-undetermined-dimensions = Lakiir uu point se jaawe hai jiske dimension pataa nai hai.

line-points-too-few-dimensions = Lakiir ke uu point se jaana chaahi jiske kam se kam dui dimension hai.

line-points-depend-on-variables = Lakiir uu point se jaawe hai jon ii variable pe nirbhar hai: { $variables }.

line-equation-invalid-format = Variable { $variable1 } aur { $variable2 } me lakiir ke equation ke format galat hai.

## `<ray>`

ray-overprescribed-through = Kiran through, endpoint aur direction se set karaa hai.  Set karaa through ignore karaa jaawe hai.

ray-dimension-mismatch = Kiran me numDimensions milaa nai.

## `<vector>`

vector-overprescribed-head = Vector head, tail aur displacement se set karaa hai.  Set karaa head ignore karaa jaawe hai.

vector-dimension-mismatch = Vector me numDimensions milaa nai.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` pe attract nai hoy sake, kaahe ki uske nearestPoint state variable nai hai.

constrain-to-without-nearest-point = `<{ $component }>` pe constrain nai hoy sake, kaahe ki uske nearestPoint state variable nai hai.

constrain-to-interior-without-nearest-point = `<{ $component }>` ke andar constrain nai hoy sake, kaahe ki uske nearestPoint state variable nai hai.

## `<choiceInput>`

choice-input-label-position-ignored = Jaun choiceInput inline nai hai, uske liye labelPosition ignore karaa jaawe hai

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput ke liye set karaa index ignore karaa jaawe hai, kaahe ki index ke ginti aur choice ke bacchan ke ginti nai milaa.

pretzel-indices-count-mismatch = problem ke liye set karaa index ignore karaa jaawe hai, kaahe ki index ke ginti aur problem ke bacchan ke ginti nai milaa.

shuffle-indices-count-mismatch = shuffle ke liye set karaa index ignore karaa jaawe hai, kaahe ki index ke ginti aur component ke ginti nai milaa.

indices-ignored-out-of-range = { $component } ke liye set karaa index ignore karaa jaawe hai, kaahe ki kuchhu index hadd se baahar hai.

pretzel-indices-repeated = pretzel ke liye set karaa index ignore karaa jaawe hai, kaahe ki kuchhu index dohraais hai.

pretzel-circuit-first-index = circuit mode me pretzel ke liye set karaa index ignore karaa jaawe hai, kaahe ki pahilaa index 1 hona chaahi.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` ke string bacchan ke saath kaam karne ke liye `type` attribute set hona chaahi.

invalid-type-defaulting-to-math = { $component } component ke liye type { $type } galat hai. Ii math, text, number ya boolean hona chaahi. Default math kaam me lawa jaawe hai.

string-not-valid-component-to-arrange = String "{ $value }" { $component } ke liye sahi component nai hai. Ignore karaa jaawe hai.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } galat hai, type number set karaa jaawe hai.

invalid-variable-value = Variable ke value galat hai: `{ $value }`

## Variants

variant-index-must-be-number = Variant ke index { $index } ek number hona chaahi

variant-index-must-be-integer = Variant ke index { $index } ek integer hona chaahi

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` absolute naap ke liye nai banaa hai. Width relative set karaa jaawe hai.

side-by-side-absolute-margins = `<{ $component }>` absolute naap ke liye nai banaa hai. Margin relative set karaa jaawe hai.

side-by-side-no-block-child = `<{ $component }>` galat hai: iske kam se kam ek block bacchaa hona chaahi.

## `<label>`

label-for-ignored-on-graphical = Graphical `<label>` pe `for` attribute ignore karaa jaawe hai.

label-for-must-resolve-to-one = `<label>` ke `for` attribute ke thiik ek component pe jaana chaahi.

label-for-unresolved = `<label>` ke `for` attribute koi component pe nai jaay sakaa.

label-for-answer-with-authored-inputs = `<label>` ke `for` attribute uu `<answer>` pe jaawe hai jiske input likhne waala khud likhis hai; siidhe input ke reference do.

label-for-answer-without-input = `<label>` ke `for` attribute uu `<answer>` pe jaawe hai jiske naam dene ke liye koi input nai hai.

label-for-must-reference-input-or-answer = `<label>` ke `for` attribute ke ek input ya ek answer pe reference dena chaahi.

## Accessibility

accessibility-short-description-or-decorative = Accessibility ke liye `<{ $component }>` ke ya to chhota description hona chaahi ya decorative set hona chaahi.

accessibility-video-short-description = Accessibility ke liye `<video>` ke chhota description hona chaahi.

accessibility-input-short-description-or-label = Accessibility ke liye `<{ $component }>` ke chhota description ya label hona chaahi.

accessibility-answer-input-short-description-or-label = Accessibility ke liye uu `<answer>` ke, jaun ek input banaawe hai, chhota description ya label hona chaahi.

accessibility-short-description-contains-math = Chhota description me `<{ $component }>` jaisan math component nai hona chaahi. Math ke shabd me likho.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } section ke heading ke text ke liye kaafi contrast nai dewe hai (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kam se kam { $threshold }:1 chaahi).
       *[other] { $colorName } section ke heading ke text ke liye kaafi contrast nai dewe hai ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kam se kam { $threshold }:1 chaahi).
    }

## `<circle>`

circle-through-points-non-numerical = Jab point ke numerical value nai hai, tab { $count } point se jaay waala `<circle>` abhi tak nai banaa hai.

circle-too-many-through-points = 3 se jaada point se jaay waala gol ke hisaab nai hoy sake.

circle-overprescribed-radius-center-points = Set karaa radius, center aur point ke saath gol ke hisaab nai hoy sake.

circle-center-with-multiple-points = Set karaa center ke saath 1 se jaada point se jaay waala gol ke hisaab nai hoy sake.

circle-radius-too-small = Gol ke hisaab nai hoy sake: dui point ke beech ke duuri { $distance } hai, is liye set karaa radius { $radius } bahut chhota hai.

circle-radius-with-many-points = Set karaa radius ke saath dui se jaada point se jaay waala gol nai ban sake.

circle-invalid-center-or-through-points = Gol ke center ya point galat hai.

circle-radius-center-with-multiple-points = Set karaa center ke saath 1 se jaada point se jaay waala gol ke radius ke hisaab nai hoy sake.

circle-change-radius-non-numerical = Jaun point ke numerical value nai hai, uu se jaay waala gol ke radius nai badal sake

circle-radius-with-points-non-numerical = Jab numerical value nai hai, tab set karaa radius ke saath ek se jaada point se jaay waala gol nai ban sake.

circle-change-center-non-numerical = Jaun point ke numerical value nai hai, uu se jaay waala gol ke center badalne ke kaam abhi tak nai banaa hai.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] Function ke domain ke liye dimension kaafi nai hai. Domain me { $intervals } interval hai lekin function ke { $inputs ->
           *[other] { $inputs } input
        } hai.
    }

function-domain-invalid-format = Function ke domain ke format galat hai.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Function ke non-numerical maximum ignore karaa jaawe hai.
        [minimum] Function ke non-numerical minimum ignore karaa jaawe hai.
        [extremum] Function ke non-numerical extremum ignore karaa jaawe hai.
        [point] Function ke non-numerical point ignore karaa jaawe hai.
        [slope] Function ke non-numerical slope ignore karaa jaawe hai.
       *[other] Function ke non-numerical { $type } ignore karaa jaawe hai.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Function ke khaali maximum ignore karaa jaawe hai.
        [minimum] Function ke khaali minimum ignore karaa jaawe hai.
        [extremum] Function ke khaali extremum ignore karaa jaawe hai.
        [point] Function ke khaali point ignore karaa jaawe hai.
       *[other] Function ke khaali { $type } ignore karaa jaawe hai.
    }

function-points-too-close = Function me dui point hai jiske jagah ek dusra ke bahut najdiik hai. Function ke paribhaasha nai hoy sake.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] Function iterate tabhi hoy sake hai jab function ke input ke ginti aur output ke ginti baraabar hoe. Ii function ke { $inputs } input aur { $outputs ->
           *[other] { $outputs } output
        } hai.
    }

## `<sequence>`

sequence-invalid-length = Sequence ke length galat hai.  Ii non-negative integer hona chaahi.

sequence-invalid-step = Sequence ke step galat hai.  { $type } type ke sequence ke liye ii ek number hona chaahi.

sequence-invalid-endpoint-number = Number sequence ke "{ $attribute }" galat hai.  Ii ek number hona chaahi.

sequence-invalid-endpoint-letters = Letters sequence ke "{ $attribute }" galat hai.  Ii akshar ke ek jorha hona chaahi.

sequence-invalid-endpoint = Sequence ke "{ $attribute }" galat hai.

select-from-sequence-coprime-not-numbers = Number nai chunaa jaay rahaa hai, is liye coprime ignore karaa jaawe hai

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations set karaa hai, is liye coprime ignore karaa jaawe hai

## Resolving a `target`

target-not-found = `<{ $source }>` ke liye target galat hai: target nai milaa.

target-state-variable-not-found = `<{ $source }>` ke liye target galat hai: `<{ $component }>` pe "{ $property }" naam ke state variable nai milaa.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` ke variable independent variable se alag hona chaahi.

ode-system-duplicate-variable-names = Dohraais dependent variable ke naam ke saath ODE RHS function ke paribhaasha nai hoy sake.

ode-system-rhs-function-error = ODE RHS function ke paribhaasha nai hoy sake.  mathjs function banaawe me galti.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } lakiir ke beech me angle ke paribhaasha nai hoy sake

angle-invalid-through-point = `<angle>` ke through me galat point

parabola-vertex-too-many-points = Vertex ke saath 1 se jaada point se jaay waala parabola abhi tak nai banaa hai.

parabola-too-many-points = 3 se jaada point se jaay waala parabola abhi tak nai banaa hai.

intersection-too-many-items = Dui se jaada chiij ke liye intersection abhi tak nai banaa hai

## Other math components

ionic-compound-not-two-ions = Dui ion ke alaawa kuchhu aur ke liye ionic compound abhi tak nai banaa hai.

ionic-compound-needs-cation-and-anion = Ionic compound sirf ek cation aur ek anion ke liye banaa hai.

solve-equations-cannot-evaluate = Equation ke hisaab nai hoy sakaa, is liye equation hal nai hoy sake: { $equation }

math-operators-operand-number-required = Math ke operand nikaalte time operandNumber set hona chaahi.

eigen-decomposition-failed = Matrix ke eigenvalue ke hisaab nai hoy sakaa

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: parameter { $parameters } pattern me nai hai, is liye ii hamesha khaali se match kari.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ke matlab samajh me nai aais. Ii none, medium, dense ya dui positive number hona chaahi jaun ek space se alag hai, jaise grid="1 0.5". Koi grid nai banaawa jaawe hai.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` ke uu function chaahi jaun { $expected ->
        [1] ek output dewe, matlab har point pe slope y', jaise `y - x`
       *[other] dui output dewe, matlab har point pe vector, jaise `(y, -x)`
    }, lekin jaun function diyaa gais hai uu { $found ->
       *[other] { $found } output
    } dewe hai. { $alternative ->
        [none] Kuchhu nai banaawa jaawe hai.
       *[other] Ii function ke liye `<{ $alternative }>` sahi component hai. Kuchhu nai banaawa jaawe hai.
    }

field-function-attribute-ignored-with-child = `function` attribute ignore karaa jaawe hai kaahe ki function component ke andar bhi diyaa gais hai; andar waala kaam me lawa jaawe hai. Function ke sirf ek tarah se do.

field-variables-ignored =
    `<{ $component }>`: `variables` attribute uu expression ke variable ke naam dewe hai jaun siidhe component ke andar likhaa hai. { $reason ->
        [function-child] Iihaan function ek `<function>` bacchaa ke roop me diyaa gais hai, aur uu apnaa variable ke naam khud dewe hai, is liye `variables` ignore karaa jaawe hai.
       *[no-expression] Iihaan aisan koi expression nai hai, is liye `variables` ignore karaa jaawe hai.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure renderer me xLabelPosition="left" nai chale hai; daahine waala vyavhaar kaam me lawa jaawe hai.

prefigure-y-label-position-unsupported = `<graph>`: prefigure renderer me yLabelPosition="bottom" nai chale hai; uupar waala vyavhaar kaam me lawa jaawe hai.

prefigure-invalid-axis-bounds = `<graph>`: prefigure me badalne ke liye axis ke hadd galat hai; default bbox (-10,-10,10,10) kaam me lawa jaawe hai.

prefigure-invalid-width = `<graph>`: prefigure me badalne ke liye width galat hai; default diagram width 425 kaam me lawa jaawe hai.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure me badalne ke liye aspectRatio galat hai; default aspect ratio 1 kaam me lawa jaawe hai.

prefigure-grid-spacing-too-fine = `<graph>`: axis ke hadd ke liye grid ke duuri bahut chhota hai; prefigure renderer me grid chhor diyaa jaawe hai.

prefigure-annotations-not-rendered = `<graph>`: jab PreFigure renderer kaam me nai lawa jaawe hai, tab annotation nai banaawa jaawe hai.

multiple-annotations-children = `<graph>` me bahut `<annotations>` bacchaa milaa; aakhri ke chhor ke sab ignore karaa jaawe hai.

## Referring to other components

copy-unrecognized-component-type = Anjaan component type ke extend ya copy nai hoy sake: { $type }.

copy-prop-not-found = { $component } type ke component pe { $property } prop nai milaa

collect-no-source = collect ke liye koi source nai milaa.

collect-invalid-component-type = `<{ $component }>` type ke component collect nai hoy sake, kaahe ki ii type galat hai.

reference-index-unavailable = Index `{ $reference }` ke reference nai diyaa jaay sake

## `<callAction>`

component-action-unavailable = Component `{ $reference }` pe { $action } nai bulaawa jaay sake

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data ke shakl galat hai.  Row ke length ek jaisan nai hai. componentIdx me milaa :{ $componentIdx }

data-frame-duplicate-column-names = Data me column ke naam dohraais hai.  componentIdx me milaa :{ $componentIdx }

data-frame-missing-column-name = Data me ek column ke naam nai hai.  componentIdx me milaa :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ii answer ke ek award apne bhejaa gais jawaab pe nirbhar hai, aur is se anokha vyavhaar hoi.

answer-max-num-attempts-in-section-wide-check-work = Jaun container me sectionWideCheckWork hai, uske andar `<answer>` pe `maxNumAttempts` set kare ke koi asar nai hai, kaahe ki mauka ke ginti container se control hoy hai. `maxNumAttempts` ke container pe set karo.

nested-section-wide-check-work-max-num-attempts = Jaun sectionWideCheckWork waala container dusra sectionWideCheckWork waala container ke andar hai, uske uupar `maxNumAttempts` set kare ke koi asar nai hai, kaahe ki mauka ke ginti baahar waala container se control hoy hai. `maxNumAttempts` ke baahar waala container pe set karo.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] symbolicEquality set kare bina { $attributes } attribute ke koi asar nai hoi.
    }

answer-invalid-type = Answer ke liye type galat hai: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` component ke koi naam nai hai, is liye uu module ke attribute ke roop me kaam me nai lawa jaay sake

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` component module ke attribute ke roop me kaam me nai lawa jaay sake, kaahe ki `<module>` component type me "{ $name }" naam ke attribute pahile se hai.

conditional-content-condition-ignored = Jaun `<conditionalContent>` component me case ya else bacchaa hai, uske uupar `condition` attribute ignore karaa jaawe hai.

slider-markers-type-mismatch = Marker ke type slider ke type se nai milaa.

pretzel-problem-needs-statement-and-answer = Pretzel galat hai: har `<problem>` me ek `<statement>` aur ek `<answer>` hona chaahi.

pretzel-circuit-first-problem-distractor = Pretzel galat hai: mode="circuit" me pahilaa `<problem>` distractor nai hoy sake.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] Attribute `{ $attribute }` ke liye galat value { $values }; ignore karaa jaawe hai.
    }

attribute-must-be-references = Attribute `{ $attribute }` ke liye value `{ $value }` galat hai. Attribute uu reference se banaa hona chaahi jaun `$` se shuru hoe.

math-input-invalid-function-names = <mathInput>: { $attribute } me galat function ke naam ignore karaa gais: { $names }. Har naam ke dekhaawe waala hissa kam se kam 2 akshar hona chaahi (akshar ya dash); uske baad ek `|<mathspeak alternative>` bhi aay sake hai.

## Building components from the source

component-type-invalid = Component type galat hai: `<{ $componentType }>`

attribute-repeated = Attribute { $attribute } dohraawa nai jaay sake.

attribute-invalid-for-component = `<{ $componentType }>` type ke component ke liye attribute "{ $attribute }" galat hai.

## Style definition contrast

style-definition-insufficient-contrast =
    Style definition { $styleNumber } me { $context ->
        [text-on-background] background ke saamne text ke colour
        [high-contrast] canvas ke saamne high-contrast colour
        [line] canvas ke saamne line ke colour
        [marker] canvas ke saamne marker ke colour
       *[text-on-canvas] canvas ke saamne text ke colour
    } ke liye kaafi contrast nai hai{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kam se kam { $threshold }:1 chaahi).

style-definition-dark-mode-text-background-contrast =
    Style definition { $styleNumber } me set karaa colour light mode ke liye kaafi contrast dewe hai, lekin unse nikaalaa gais dark mode ke colour me background ke saamne text ke colour ke contrast kaafi nai hai ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kam se kam { $threshold }:1 chaahi). { $suggestion ->
        [available] Dark mode me kaafi contrast ke liye ya to light mode ke contrast barhao (jaise { $lightAttribute }="{ $lightColor }" set karo) ya dark mode ke colour khud set karo (jaise { $darkAttribute }="{ $darkColor }" set karo).
       *[none] Dark mode me kaafi contrast ke liye light mode ke contrast barhao ya nikaalaa gais colour ke textColorDarkMode aur/ya backgroundColorDarkMode se badlo.
    }

style-definition-dark-mode-text-canvas-contrast =
    Style definition { $styleNumber } me set karaa text ke colour light mode ke liye kaafi contrast dewe hai, lekin us se nikaalaa gais dark mode ke text ke colour canvas ke saamne kaafi contrast nai dewe hai ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kam se kam { $threshold }:1 chaahi). { $suggestion ->
        [available] Dark mode me kaafi contrast ke liye ya to light mode ke contrast barhao (jaise textColor="{ $lightColor }" set karo) ya dark mode ke colour khud set karo (textColorDarkMode="{ $darkColor }" set karo).
       *[none] Dark mode me kaafi contrast ke liye light mode ke contrast barhao ya nikaalaa gais colour ke textColorDarkMode se badlo.
    }

section-multiple-style-palettes = Ek section sirf ek <stylePalette> chun sake hai; aakhri waala kaam me lawa jaawe hai.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } ke unique variant pataa nai chal sake, kaahe ki numToSelect non-negative integer nai hai.

variant-num-to-select-not-constant-number = { $component } ke unique variant pataa nai chal sake, kaahe ki numToSelect constant number nai hai.

variant-with-replacement-not-constant-boolean = { $component } ke unique variant pataa nai chal sake, kaahe ki withReplacement constant boolean nai hai.

variant-select-weight-disables-unique = Agar kono option pe selectWeight ya selectForVariants set hai to select ke liye unique variant band hoy jaawe hai

variant-coprime-undetermined = { $component } ke unique variant pataa nai chal sake, kaahe ki ii pataa nai chale hai ki coprime hamesha galat hai.

variant-attribute-not-constant = { $component } ke unique variant pataa nai chal sake, kaahe ki { $attribute } constant nai hai.

variant-attribute-not-number = { $component } ke unique variant pataa nai chal sake, kaahe ki { $attribute } number nai hai.

variant-attribute-wrong-type-for-sequence =
    { $type } type ke { $component } ke unique variant pataa nai chal sake, kaahe ki { $attribute } { $expected ->
        [letters-combination] akshar ke ek jorha
        [math-expression] ek sahi math expression
        [integer] ek integer
       *[number] ek number
    } nai hai.

variant-length-not-integer = { $component } ke unique variant pataa nai chal sake, kaahe ki length integer nai hai.

variant-sort-not-implemented = sort waala { $component } ke unique variant abhi tak nai banaa hai

variant-exclude-combinations-not-implemented = excludeCombinations waala { $component } ke unique variant abhi tak nai banaa hai

variant-math-exclude-not-implemented = exclude waala math type ke { $component } ke unique variant abhi tak nai banaa hai

variant-non-constant-exclude-not-implemented = non-constant exclude waala { $component } ke unique variant abhi tak nai banaa hai

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph ke prefigure renderer me ii nai chale hai; descendant chhor diyaa gais.

prefigure-descendant-invalid-geometry = { $subject }: geometry adhuura ya non-finite hai; descendant chhor diyaa gais.

prefigure-curve-label-omitted = { $subject }: badlaa gais curve element pe label nai chale hai; label chhor diyaa gais.

prefigure-curve-unsupported-definition-type = { $subject }: curve ke function definition type '{ $definitionType }' nai chale hai; descendant chhor diyaa gais.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves pe flipFunctions attribute nai chale hai; descendant chhor diyaa gais.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves pe sirf formula type ke child function chale hai; descendant chhor diyaa gais.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] line-family ke label
       *[point] point ke label
    } ke liye labelPosition '{ $labelPosition }' nai chale hai; PreFigure ke default alignment kaam me lawa gais.

prefigure-fill-style-unsupported = { $subject }: PreFigure me fill style '{ $fillStyle }' nai chale hai; saadaa fill kaam me lawa jaawe hai.

prefigure-line-style-unknown = { $subject }: anjaan line style '{ $lineStyle }' PreFigure ke output se chhor diyaa gais.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker style '{ $markerStyle }' PreFigure ke 'diamond' style me badlaa gais.

prefigure-marker-style-unsupported = { $subject }: PreFigure me marker style '{ $markerStyle }' nai chale hai; default style kaam me lawa gais.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` galat hai; target nai milaa. Annotation chhor diyaa gais.

annotation-ref-multiple-targets = `<annotation>`: `ref` bahut target pe gais; pahilaa target kaam me lawa jaawe hai.

annotation-ref-outside-graph = `<annotation>`: `ref` galat hai; target apne graph ke baahar hai. Annotation chhor diyaa gais.

annotation-ref-unsupported-target = `<annotation>`: `ref` galat hai; prefigure me badalte time target koi chalne waala graphical chiij nai hai. Annotation chhor diyaa gais.

annotation-text-missing = `<annotation>`: `text` nai hai ya khaali hai; khaali text diyaa jaawe hai.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Gol dependency milaa.
       *[other] `<{ $componentType }>` component ke saath gol dependency milaa.
    }

reference-no-referent = Reference `{ $reference }` ke liye koi referent nai milaa

reference-multiple-referents = Reference `{ $reference }` ke liye bahut referent milaa

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ke attribute { $attribute } ke format galat hai.

children-invalid = `<{ $componentType }>` ke liye galat bacchaa: galat bacchaa milaa: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Attribute `{ $attribute }` ke liye value `{ $value }` galat hai, value `{ $default }` kaam me lawa jaawe hai

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML version { $version } nai milaa.
       *[other] DoenetML version { $version } nai milaa. Version { $fallback } kaam me lawa jaawe hai
    }

## Reading the DoenetML

parse-invalid-doenetml = Galat DoenetML: { $content }

parse-tag-missing-close-tag = Galat DoenetML: Tag `{ $tag }` ke koi closing tag nai hai. Ya to ek self-closing tag ya ek `</{ $tagName }>` tag chaahi.

parse-tag-error = Galat DoenetML: Tag `<{ $tagName }>` me galti

parse-attribute-missing-value = Galat DoenetML: Galat attribute `{ $attribute }` ke dekh ke lage hai ki iske value nai hai.

parse-attribute-invalid = Galat DoenetML: Galat attribute `{ $attribute }`

parse-attribute-value-invalid = Galat DoenetML: Galat attribute value `{ $value }`

parse-attribute-value-quote-mismatch = Galat DoenetML: Galat attribute value `{ $value }`. Quote ke jorha nai milaa. Lage hai ki tumhaar ek `{ $quote }` chhut gais hai

parse-open-tag-name-missing = Galat DoenetML: Bina naam ke ek tag milaa, jaise `<`

parse-tag-not-closed = Galat DoenetML: Tag `{ $tag }` band nai hoy sakaa (lage hai ki ek `>` chhut gais hai).

parse-self-closing-tag-name-missing = Galat DoenetML: Bina naam ke ek tag milaa `<{ $content }>`

parse-self-closing-tag-not-closed = Galat DoenetML: Tag `{ $tag }` band nai hoy sakaa (lage hai ki `/>` chhut gais hai).

parse-tag-invalid-attributes = Galat DoenetML: Tag `{ $tag }` sahi nai hai. Lage hai ki iske attribute galat hai.

parse-close-tag-name-missing = Galat DoenetML: Bina naam ke ek closing tag milaa, jaise `</`

parse-attribute-value-unquoted = Attribute ke value quote ke andar hona chaahi: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Galat DoenetML: Closing tag `{ $tag }` milaa, lekin uske opening tag nai hai

parse-close-tag-mismatched = Galat DoenetML: Closing tag nai milaa. `</{ $expected }>` chaahi rahaa. `{ $found }` milaa

parser-node-unconvertible = Node { $node } ke Dast node me nai badlaa jaay sakaa.

## Names

name-attribute-invalid =
    Galat attribute name='{ $name }'. { $reason ->
        [characters] Naam me sirf akshar, number, underscore ya dash hoy sake hai.
       *[start] Naam ek akshar se shuru hona chaahi.
    }

component-name-invalid-start = Galat component naam "{ $name }". Naam ek akshar se shuru hona chaahi.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched type ke answer me ek video attribute hona chaahi

answer-video-watched-video-not-reference = videoWatched type ke answer ke video attribute ek reference hona chaahi

answer-name-not-single-text = Answer ke name attribute me sirf ek text bacchaa hona chaahi

## Referencing another document

external-doenetml-recursion-limit = Bahut jaada tah ke kaaran baahar ke DoenetML nai lawa jaay sakaa. Kahin koi gol reference to nai hai?

external-doenetml-unavailable = { $attribute }="{ $uri }" se DoenetML nai lawa jaay sakaa

external-doenetml-type-mismatch = { $attribute }="{ $uri }" se lawa gais DoenetML galat hai: uu "{ $componentType }" component type se nai milaa

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` puraana hoy gais hai; iske jagah `{ $to }` kaam me lao.
       *[other] [deprecation] `<{ $component }>` pe attribute `{ $from }` puraana hoy gais hai; iske jagah `{ $to }` kaam me lao.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` puraana hoy gais hai aur ignore karaa jaawe hai, kaahe ki `{ $to }` bhi set karaa hai.
       *[other] [deprecation] `<{ $component }>` pe attribute `{ $from }` puraana hoy gais hai aur ignore karaa jaawe hai, kaahe ki `{ $to }` bhi set karaa hai.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` pe attribute `{ $attribute }` puraana hoy gais hai aur ignore karaa jaawe hai.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` pe attribute `{ $attribute }` puraana hoy gais hai; iske jagah ek `<{ $child }>` bacchaa kaam me lao.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` pe attribute `{ $attribute }` ke value `{ $value }` puraana hoy gais hai; iske jagah `{ $to }` kaam me lao.


## Language coverage

pluralize-english-only = `<pluralize>` sirf English ke plural banaay sake hai, is liye { $locale } me likhaa document me uske text jaisan ke taisan rahe hai. Plural ke roop siidhe likho, ya `pluralForm` attribute se set karo.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` Doenet ke pahchaanaa gais element nai hai.

schema-element-not-allowed-at-root = Element `<{ $tag }>` document ke jarh pe nai aay sake.

schema-element-not-allowed-inside = Element `<{ $tag }>` `<{ $parent }>` ke andar nai aay sake.

schema-attribute-unrecognized = Element `<{ $tag }>` me `{ $attribute }` naam ke koi attribute nai hai.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Element `<{ $tag }>` ke attribute `{ $attribute }` ek aisan list hona chaahi jiske har chiij inme se ek hoe: { $allowed }
       *[other] Element `<{ $tag }>` ke attribute `{ $attribute }` inme se ek hona chaahi: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ke liye variant ke naam galat hai.  Variant ke naam { $variantName } { $numOptions } option me aawe hai, lekin chunne ke ginti { $numToSelect } hai.

select-variant-name-without-options = select ke liye kuchhu variant set karaa hai, lekin sambhav variant naam { $variantName } ke liye koi option set nai hai.

select-variant-name-not-possible = select ke liye set karaa variant naam { $variantName } sambhav variant naam nai hai.

select-too-few-options = Sirf { $numOptions } me se { $numToSelect } component nai chunaa jaay sake.

select-from-sequence-too-few-values = { $length } length ke sequence me se { $numToSelect } value nai chunaa jaay sake.

select-from-sequence-indices-count-mismatch = select ke liye set karaa index ke ginti chunne ke ginti se milna chaahi

select-from-sequence-indices-not-integers = select ke liye set karaa sab index integer hona chaahi

select-from-sequence-index-excluded = selectfromsequence ke set karaa index nikaalaa gais rahaa

select-from-sequence-indices-excluded-combination = selectfromsequence ke set karaa index ek nikaalaa gais jorha rahaa

select-from-sequence-coprime-not-positive-integers = Positive integer nai chunaa jaay rahaa hai, is liye coprime jorha nai chunaa jaay sake.

select-from-sequence-coprime-common-factor = Coprime number nai chunaa jaay sake. Sab sambhav value ke ek common factor hai. (Set karaa "from" ya "to" ke value "step" ke saath coprime hona chaahi.)

select-from-sequence-coprime-single-number = Aisan ek hi number me se jaun 1 nai hai, coprime jorha nai chunaa jaay sake.

select-from-sequence-excluded-too-many-combinations = selectFromSequence me 70% se jaada jorha nikaalaa gais

select-from-sequence-coprime-none-found = Coprime number nai chunaa jaay sakaa. Sab sambhav value ke ek common factor hai.

select-from-sequence-too-few-unique-values = { $numPossibleValues } length ke sequence me se { $numToSelect } unique value nai chunaa jaay sake

select-prime-numbers-too-few-values = { $numValues } length ke prime number ke list me se { $numToSelect } value nai chunaa jaay sake

select-prime-numbers-values-count-mismatch = select ke liye set karaa value ke ginti chunne ke ginti se milna chaahi

select-prime-numbers-values-not-prime = Prime number chunne ke liye set karaa sab value prime number ke list me hona chaahi

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ke set karaa value ek nikaalaa gais jorha rahaa

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers me 70% se jaada jorha nikaalaa gais

select-random-combination-fluke = Bahut anokha sanjog se, random value ke jorha nai chunaa jaay sakaa

select-random-value-fluke = Bahut anokha sanjog se, random value nai chunaa jaay sakaa

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Ii `<{ $component }>` nai dekhaawa jaawe hai kaahe ki ii math ke andar hai aur `inline` nai hai. `inline` jorho, taaki ii ek drop-down list ban jaay, jaun expression ke andar sama jaawe hai.
        [expanded] Ii `<{ $component }>` nai dekhaawa jaawe hai kaahe ki ii math ke andar hai aur `expanded` hai. `expanded` hatao; bahut line waala box expression ke andar nai samaay sake.
        [on-graph] Ii `<{ $component }>` nai dekhaawa jaawe hai kaahe ki ii graph pe banaawa gais math ke andar hai, aur uhaan input ke liye jagah nai hai.
       *[relative-width] Ii `<{ $component }>` nai dekhaawa jaawe hai kaahe ki ii math ke andar hai aur iske width relative hai. Width ke absolute unit me do, jaise `px`.
    }
