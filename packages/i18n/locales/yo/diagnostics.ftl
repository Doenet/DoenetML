# Yoruba diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Yoruba has a single plural category and marks no number on the noun, so a
# countable message needs no selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = A kò ka { $attributes } sí nígbà tí a bá sọ ààmì ìparí méjì

line-segment-attributes-ignored-with-endpoint-and-midpoint = A kò ka { $attributes } sí nígbà tí a bá sọ ààmì ìparí àti ààmì àárín papọ̀

line-segment-midpoint-offset-without-midpoint = midpointOffset kò ní ipa láìsí ààmì àárín

## `<line>`

line-points-undetermined-dimensions = Ìlà ń kọjá lórí àwọn ààmì tí a kò mọ ìwọ̀n wọn.

line-points-too-few-dimensions = Ìlà gbọ́dọ̀ kọjá lórí àwọn ààmì tí ó ní ìwọ̀n méjì ó kéré tán.

line-points-depend-on-variables = Ìlà ń kọjá lórí àwọn ààmì tí ó gbáralé àwọn olùyípadà: { $variables }.

line-equation-invalid-format = Ìlànà tí kò tọ́ fún ìdọ́gba ìlà nínú àwọn olùyípadà { $variable1 } àti { $variable2 }.

## `<ray>`

ray-overprescribed-through = A ti sọ ìtànṣán pẹ̀lú through, endpoint àti direction papọ̀. A kò ka through tí a sọ sí.

ray-dimension-mismatch = numDimensions kò bá ara mu nínú ìtànṣán.

## `<vector>`

vector-overprescribed-head = A ti sọ fẹ́ktọ̀ pẹ̀lú head, tail àti displacement papọ̀. A kò ka head tí a sọ sí.

vector-dimension-mismatch = numDimensions kò bá ara mu nínú fẹ́ktọ̀.

## Attracting and constraining

attract-to-without-nearest-point = A kò lè fà sí `<{ $component }>` nítorí kò ní olùyípadà ipò tí a pè ní nearestPoint.

constrain-to-without-nearest-point = A kò lè dè mọ́ `<{ $component }>` nítorí kò ní olùyípadà ipò tí a pè ní nearestPoint.

constrain-to-interior-without-nearest-point = A kò lè dè mọ́ inú `<{ $component }>` nítorí kò ní olùyípadà ipò tí a pè ní nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = A kò ka labelPosition sí fún choiceInput tí kò sí ní ilà kan náà

## Ordering children by index

choice-input-indices-count-mismatch = A kò ka àwọn nọ́mbà tí a sọ fún choiceInput sí nítorí iye wọn kò bá iye àwọn ọmọ choice mu.

pretzel-indices-count-mismatch = A kò ka àwọn nọ́mbà tí a sọ fún problem sí nítorí iye wọn kò bá iye àwọn ọmọ problem mu.

shuffle-indices-count-mismatch = A kò ka àwọn nọ́mbà tí a sọ fún shuffle sí nítorí iye wọn kò bá iye àwọn apá mu.

indices-ignored-out-of-range = A kò ka àwọn nọ́mbà tí a sọ fún { $component } sí nítorí àwọn kan wà lóde àlà.

pretzel-indices-repeated = A kò ka àwọn nọ́mbà tí a sọ fún pretzel sí nítorí a tún àwọn kan sọ.

pretzel-circuit-first-index = A kò ka àwọn nọ́mbà tí a sọ fún pretzel ní ipò circuit sí nítorí nọ́mbà àkọ́kọ́ gbọ́dọ̀ jẹ́ 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Kí `<{ $component }>` bàa lè ṣiṣẹ́ pẹ̀lú àwọn ọmọ irúfẹ́ string, a gbọ́dọ̀ sọ ànímọ́ `type`.

invalid-type-defaulting-to-math = type { $type } kò tọ́ fún apá { $component }. Ó gbọ́dọ̀ jẹ́ ọ̀kan nínú math, text, number tàbí boolean. À ń ṣeto rẹ̀ sí math.

string-not-valid-component-to-arrange = String "{ $value }" kì í ṣe apá tí ó tọ́ fún { $component }. A kò ka sí.

## Types and variables

invalid-type-defaulting-to-number = type { $type } kò tọ́, à ń ṣeto type sí number.

invalid-variable-value = Iye olùyípadà tí kò tọ́: `{ $value }`

## Variants

variant-index-must-be-number = Nọ́mbà irúfẹ́ { $index } gbọ́dọ̀ jẹ́ nọ́mbà

variant-index-must-be-integer = Nọ́mbà irúfẹ́ { $index } gbọ́dọ̀ jẹ́ nọ́mbà pípé

## `<sideBySide>`

side-by-side-absolute-widths = A kò tí ì ṣe `<{ $component }>` fún ìwọ̀n pípé. À ń ṣeto ìbú sí ti ìfiwéra.

side-by-side-absolute-margins = A kò tí ì ṣe `<{ $component }>` fún ìwọ̀n pípé. À ń ṣeto etí sí ti ìfiwéra.

side-by-side-no-block-child = `<{ $component }>` kò tọ́: ó gbọ́dọ̀ ní ọmọ kan ó kéré tán tí ó jẹ́ irúfẹ́ blọ́kù.

## `<label>`

label-for-ignored-on-graphical = A kò ka ànímọ́ `for` lórí `<label>` àwòrán sí.

label-for-must-resolve-to-one = Ànímọ́ `for` lórí `<label>` gbọ́dọ̀ tọ́ka sí apá kan ṣoṣo.

label-for-unresolved = A kò lè tọ́ka ànímọ́ `for` lórí `<label>` sí apá kankan.

label-for-answer-with-authored-inputs = Ànímọ́ `for` lórí `<label>` tọ́ka sí `<answer>` tí ó ní àwọn ìfilọ́lẹ̀ tí a kọ ní kedere; tọ́ka sí ìfilọ́lẹ̀ náà tààrà.

label-for-answer-without-input = Ànímọ́ `for` lórí `<label>` tọ́ka sí `<answer>` tí kò ní ìfilọ́lẹ̀ láti dárúkọ.

label-for-must-reference-input-or-answer = Ànímọ́ `for` lórí `<label>` gbọ́dọ̀ tọ́ka sí ìfilọ́lẹ̀ tàbí ìdáhùn.

## Accessibility

accessibility-short-description-or-decorative = Nítorí ìwọlé, `<{ $component }>` gbọ́dọ̀ ní àpèjúwe kúkúrú tàbí kí a sọ pé ó jẹ́ ohun ọ̀ṣọ́.

accessibility-video-short-description = Nítorí ìwọlé, `<video>` gbọ́dọ̀ ní àpèjúwe kúkúrú.

accessibility-input-short-description-or-label = Nítorí ìwọlé, `<{ $component }>` gbọ́dọ̀ ní àpèjúwe kúkúrú tàbí àmì ìdámọ̀.

accessibility-answer-input-short-description-or-label = Nítorí ìwọlé, `<answer>` tí ó ń dá ìfilọ́lẹ̀ gbọ́dọ̀ ní àpèjúwe kúkúrú tàbí àmì ìdámọ̀.

accessibility-short-description-contains-math = Àwọn àpèjúwe kúkúrú kò gbọ́dọ̀ ní àwọn apá ìṣirò bíi `<{ $component }>` nínú. Kọ ìṣirò èyíkéyìí ní ọ̀rọ̀.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ní ìyàtọ̀ tí kò tó fún ọ̀rọ̀ àkọlé ìpín (ipò òkùnkùn) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ó nílò ó kéré tán { $threshold }:1).
       *[other] { $colorName } ní ìyàtọ̀ tí kò tó fún ọ̀rọ̀ àkọlé ìpín ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ó nílò ó kéré tán { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = A kò tí ì ṣe `<circle>` tí ń kọjá lórí ààmì { $count } nígbà tí àwọn ààmì náà kò ní iye nọ́mbà.

circle-too-many-through-points = A kò lè ṣírò òbìríkítí tí ń kọjá lórí ààmì tí ó ju 3 lọ.

circle-overprescribed-radius-center-points = A kò lè ṣírò òbìríkítí pẹ̀lú rédíọ̀sì, àárín àti àwọn ààmì ìkọjá tí a ti sọ gbogbo wọn.

circle-center-with-multiple-points = A kò lè ṣírò òbìríkítí pẹ̀lú àárín tí a sọ tí ń kọjá lórí ààmì tí ó ju 1 lọ.

circle-radius-too-small = A kò lè ṣírò òbìríkítí: níwọ̀n bí àlàfo láàárín àwọn ààmì méjì náà ti jẹ́ { $distance }, rédíọ̀sì { $radius } tí a sọ kéré jù.

circle-radius-with-many-points = A kò lè dá òbìríkítí tí ń kọjá lórí ààmì tí ó ju méjì lọ pẹ̀lú rédíọ̀sì tí a sọ.

circle-invalid-center-or-through-points = Àárín tàbí àwọn ààmì ìkọjá ti òbìríkítí kò tọ́.

circle-radius-center-with-multiple-points = A kò lè ṣírò rédíọ̀sì òbìríkítí pẹ̀lú àárín tí a sọ tí ń kọjá lórí ààmì tí ó ju 1 lọ.

circle-change-radius-non-numerical = A kò lè yí rédíọ̀sì òbìríkítí tí ń kọjá lórí àwọn ààmì tí kò ní iye nọ́mbà padà

circle-radius-with-points-non-numerical = A kò lè dá òbìríkítí tí ń kọjá lórí ààmì tí ó ju ọ̀kan lọ pẹ̀lú rédíọ̀sì tí a sọ nígbà tí kò sí iye nọ́mbà.

circle-change-center-non-numerical = A kò tí ì ṣe yíyí àárín òbìríkítí tí ń kọjá lórí àwọn ààmì tí kò ní iye nọ́mbà padà.

## `<function>`

function-domain-insufficient-dimensions = Ìwọ̀n agbègbè iṣẹ́ kò tó. Agbègbè ní àlàfo { $intervals } ṣùgbọ́n iṣẹ́ ní ìfilọ́lẹ̀ { $inputs }.

function-domain-invalid-format = Ìlànà agbègbè iṣẹ́ kò tọ́.

function-ignoring-non-numerical =
    { $type ->
        [maximum] A kò ka iye gíga jùlọ ti iṣẹ́ tí kì í ṣe nọ́mbà sí.
        [minimum] A kò ka iye kéré jùlọ ti iṣẹ́ tí kì í ṣe nọ́mbà sí.
        [extremum] A kò ka iye ìkángun ti iṣẹ́ tí kì í ṣe nọ́mbà sí.
        [point] A kò ka ààmì iṣẹ́ tí kì í ṣe nọ́mbà sí.
        [slope] A kò ka ìtẹ̀ba iṣẹ́ tí kì í ṣe nọ́mbà sí.
       *[other] A kò ka { $type } ti iṣẹ́ tí kì í ṣe nọ́mbà sí.
    }

function-ignoring-empty =
    { $type ->
        [maximum] A kò ka iye gíga jùlọ ti iṣẹ́ tí ó ṣófo sí.
        [minimum] A kò ka iye kéré jùlọ ti iṣẹ́ tí ó ṣófo sí.
        [extremum] A kò ka iye ìkángun ti iṣẹ́ tí ó ṣófo sí.
        [point] A kò ka ààmì iṣẹ́ tí ó ṣófo sí.
       *[other] A kò ka { $type } ti iṣẹ́ tí ó ṣófo sí.
    }

function-points-too-close = Iṣẹ́ ní ààmì méjì tí ó sún mọ́ ara wọn jù. A kò lè ṣàlàyé iṣẹ́ náà.

function-iterates-input-output-mismatch = Àtúnṣe iṣẹ́ ṣeé ṣe kìkì bí iye ìfilọ́lẹ̀ bá bá iye ìjáde mu. Iṣẹ́ yìí ní ìfilọ́lẹ̀ { $inputs } àti ìjáde { $outputs }.

## `<sequence>`

sequence-invalid-length = Gígùn ìtẹ̀lera kò tọ́. Ó gbọ́dọ̀ jẹ́ nọ́mbà pípé tí kò kéré sí òdo.

sequence-invalid-step = Ìgbésẹ̀ ìtẹ̀lera kò tọ́. Ó gbọ́dọ̀ jẹ́ nọ́mbà fún ìtẹ̀lera irúfẹ́ { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ti ìtẹ̀lera nọ́mbà kò tọ́. Ó gbọ́dọ̀ jẹ́ nọ́mbà.

sequence-invalid-endpoint-letters = "{ $attribute }" ti ìtẹ̀lera lẹ́tà kò tọ́. Ó gbọ́dọ̀ jẹ́ àkópọ̀ lẹ́tà.

sequence-invalid-endpoint = "{ $attribute }" ti ìtẹ̀lera kò tọ́.

select-from-sequence-coprime-not-numbers = a kò ka coprime sí nítorí kì í ṣe nọ́mbà ni à ń yàn

select-from-sequence-coprime-with-exclude-combinations = a kò ka coprime sí nítorí a ti sọ excludeCombinations

## Resolving a `target`

target-not-found = target kò tọ́ fún `<{ $source }>`: a kò rí ohun tí a fojú sun.

target-state-variable-not-found = target kò tọ́ fún `<{ $source }>`: a kò rí olùyípadà ipò tí a pè ní "{ $property }" lórí `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Àwọn olùyípadà `<odeSystem>` gbọ́dọ̀ yàtọ̀ sí olùyípadà òmìnira.

ode-system-duplicate-variable-names = A kò lè ṣàlàyé àwọn iṣẹ́ ODE RHS tí ó ní orúkọ olùyípadà agbáralé tí a tún sọ.

ode-system-rhs-function-error = A kò lè ṣàlàyé iṣẹ́ ODE RHS. Àṣìṣe wáyé nígbà tí à ń dá iṣẹ́ mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = A kò lè ṣàlàyé igun láàárín ìlà { $count }

angle-invalid-through-point = Ààmì tí kò tọ́ nínú through ti `<angle>`

parabola-vertex-too-many-points = A kò tí ì ṣe paràbólà pẹ̀lú orí tí ń kọjá lórí ààmì tí ó ju 1 lọ.

parabola-too-many-points = A kò tí ì ṣe paràbólà tí ń kọjá lórí ààmì tí ó ju 3 lọ.

intersection-too-many-items = A kò tí ì ṣe ìkóra fún nǹkan tí ó ju méjì lọ

## Other math components

ionic-compound-not-two-ions = A kò tí ì ṣe àdàpọ̀ áyọ́nì fún ohunkóhun yàtọ̀ sí áyọ́nì méjì.

ionic-compound-needs-cation-and-anion = A ṣe àdàpọ̀ áyọ́nì fún cation kan àti anion kan nìkan.

solve-equations-cannot-evaluate = A kò lè yanjú ìdọ́gba nítorí a kò lè ṣàyẹ̀wò rẹ̀: { $equation }

math-operators-operand-number-required = A gbọ́dọ̀ sọ operandNumber nígbà tí à ń yọ operand ìṣirò.

eigen-decomposition-failed = A kò lè ṣírò àwọn eigenvalue matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } kò farahàn nínú àwòṣe, nítorí náà yóò máa bá àyè òfìfo mu nígbà gbogbo.

## `<graph>`

graph-grid-invalid = `<graph>`: a kò lè túmọ̀ grid="{ $grid }". Ó gbọ́dọ̀ jẹ́ none, medium, dense, tàbí nọ́mbà rere méjì tí àlàfo yà sọ́tọ̀, bíi grid="1 0.5". A kò ya gírídì kankan.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: a kò ṣàtìlẹ́yìn fún xLabelPosition="left" nínú ohun ìṣàfihàn prefigure; à ń lo ìwà ipò ọ̀tún.

prefigure-y-label-position-unsupported = `<graph>`: a kò ṣàtìlẹ́yìn fún yLabelPosition="bottom" nínú ohun ìṣàfihàn prefigure; à ń lo ìwà ipò òkè.

prefigure-invalid-axis-bounds = `<graph>`: àwọn àlà ààbọ̀ kò tọ́ fún ìyípadà prefigure; à ń lo bbox àtìlẹ̀wá (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ìbú kò tọ́ fún ìyípadà prefigure; à ń lo ìbú àwòrán àtìlẹ̀wá 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio kò tọ́ fún ìyípadà prefigure; à ń lo ìpín àtìlẹ̀wá 1.

prefigure-grid-spacing-too-fine = `<graph>`: àlàfo gírídì kéré jù fún àwọn àlà ààbọ̀; a fi gírídì sílẹ̀ nínú ohun ìṣàfihàn prefigure.

prefigure-annotations-not-rendered = `<graph>`: a kò ní ṣàfihàn àwọn àkíyèsí nígbà tí a kò bá lo ohun ìṣàfihàn PreFigure.

multiple-annotations-children = A rí àwọn ọmọ `<annotations>` púpọ̀ nínú `<graph>`; a kò ka gbogbo wọn sí àyàfi ìkẹyìn.

## Referring to other components

copy-unrecognized-component-type = A kò lè fẹ̀ tàbí ṣàdàkọ irúfẹ́ apá tí a kò mọ̀: { $type }.

copy-prop-not-found = A kò rí ànímọ́ { $property } lórí apá irúfẹ́ { $component }

collect-no-source = A kò rí orísun kankan fún collect.

collect-invalid-component-type = A kò lè kó àwọn apá irúfẹ́ `<{ $component }>` jọ nítorí ó jẹ́ irúfẹ́ apá tí kò tọ́.

reference-index-unavailable = A kò lè tọ́ka sí nọ́mbà `{ $reference }`

## `<callAction>`

component-action-unavailable = A kò lè pe { $action } lórí apá `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ìrísí dátà kò tọ́. Àwọn ilà ní gígùn tí kò bá ara mu. A rí i nínú componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Dátà ní àwọn orúkọ ọ̀wọ̀n tí a tún sọ. A rí i nínú componentIdx :{ $componentIdx }

data-frame-missing-column-name = Dátà kò ní orúkọ ọ̀wọ̀n kan. A rí i nínú componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award fún ìdáhùn yìí gbáralé ìdáhùn tí àmì answer fúnra rẹ̀ fi ránṣẹ́, èyí tí yóò yọrí sí ìwà tí a kò retí.

answer-max-num-attempts-in-section-wide-check-work = Ṣíṣeto `maxNumAttempts` lórí `<answer>` tí ó wà nínú àpò tí ó ní `sectionWideCheckWork` kò ní ipa, nítorí àpò náà ni ó ń darí iye ìgbìyànjú. Ṣeto `maxNumAttempts` lórí àpò náà dípò.

nested-section-wide-check-work-max-num-attempts = Ṣíṣeto `maxNumAttempts` lórí àpò tí ó ní `sectionWideCheckWork` tí ó wà nínú àpò mìíràn tí ó ní `sectionWideCheckWork` kò ní ipa, nítorí àpò òde ni ó ń darí iye ìgbìyànjú. Ṣeto `maxNumAttempts` lórí àpò òde dípò.

answer-attributes-need-symbolic-equality = Àwọn ànímọ́ { $attributes } kò ní ní ipa láìsí symbolicEquality tí a ṣeto.

answer-invalid-type = Irúfẹ́ tí kò tọ́ fún ìdáhùn: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Níwọ̀n bí apá `<{ $component }>` kò ti ní orúkọ, a kò lè lò ó fún ànímọ́ module

module-attribute-name-already-defined = A kò lè lo apá `<{ $component } name="{ $name }">` gẹ́gẹ́ bí ànímọ́ fún module nítorí irúfẹ́ apá `<module>` ti ní ànímọ́ tí a pè ní "{ $name }" tẹ́lẹ̀.

conditional-content-condition-ignored = A kò ka ànímọ́ `condition` sí lórí apá `<conditionalContent>` tí ó ní àwọn ọmọ case tàbí else.

slider-markers-type-mismatch = Irúfẹ́ àwọn àmì kò bá irúfẹ́ slider mu.

pretzel-problem-needs-statement-and-answer = pretzel kò tọ́: `<problem>` kọ̀ọ̀kan gbọ́dọ̀ ní `<statement>` kan àti `<answer>` kan.

pretzel-circuit-first-problem-distractor = pretzel kò tọ́: nínú mode="circuit", `<problem>` àkọ́kọ́ kò lè jẹ́ olùdíwọ́.

## Attribute values

attribute-invalid-values = Iye { $values } kò tọ́ fún ànímọ́ `{ $attribute }`; a kò ka sí.

attribute-must-be-references = Iye `{ $value }` kò tọ́ fún ànímọ́ `{ $attribute }`. Ànímọ́ gbọ́dọ̀ ní àwọn ìtọ́kasí tí ó bẹ̀rẹ̀ pẹ̀lú `$`.

math-input-invalid-function-names = <mathInput>: a kò ka àwọn orúkọ iṣẹ́ tí kò tọ́ nínú { $attribute } sí: { $names }. Apá ìṣàfihàn orúkọ kọ̀ọ̀kan gbọ́dọ̀ ní lẹ́tà 2 ó kéré tán (lẹ́tà tàbí ìlà-àsopọ̀); àfikún `|<mathspeak alternative>` lè tẹ̀lé e.

## Building components from the source

component-type-invalid = Irúfẹ́ apá tí kò tọ́: `<{ $componentType }>`

attribute-repeated = A kò lè tún ànímọ́ { $attribute } sọ.

attribute-invalid-for-component = Ànímọ́ "{ $attribute }" kò tọ́ fún apá irúfẹ́ `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Ìtumọ̀ àṣà { $styleNumber } ní ìyàtọ̀ tí kò tó fún { $context ->
        [text-on-background] àwọ̀ ọ̀rọ̀ lórí àwọ̀ ẹ̀yìn
        [high-contrast] àwọ̀ ìyàtọ̀ gíga lórí ojú-iṣẹ́
        [line] àwọ̀ ìlà lórí ojú-iṣẹ́
        [marker] àwọ̀ àmì lórí ojú-iṣẹ́
       *[text-on-canvas] àwọ̀ ọ̀rọ̀ lórí ojú-iṣẹ́
    }{ $mode ->
        [dark] { " (ipò òkùnkùn)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ó nílò ó kéré tán { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Bí ó tilẹ̀ jẹ́ pé ìtumọ̀ àṣà { $styleNumber } ti sọ àwọn àwọ̀ tí ó ní ìyàtọ̀ tí ó tó fún ipò ìmọ́lẹ̀, àwọn àwọ̀ ipò òkùnkùn tí a mú láti inú wọn ní ìyàtọ̀ tí kò tó láàárín àwọ̀ ọ̀rọ̀ àti àwọ̀ ẹ̀yìn ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ó nílò ó kéré tán { $threshold }:1). { $suggestion ->
        [available] Láti rí i dájú pé ìyàtọ̀ tó ní ipò òkùnkùn, mú ìyàtọ̀ ipò ìmọ́lẹ̀ pọ̀ sí i (bí àpẹẹrẹ ṣeto { $lightAttribute }="{ $lightColor }") tàbí yí àwọ̀ ipò òkùnkùn padà (bí àpẹẹrẹ ṣeto { $darkAttribute }="{ $darkColor }").
       *[none] Láti rí i dájú pé ìyàtọ̀ tó ní ipò òkùnkùn, mú ìyàtọ̀ ipò ìmọ́lẹ̀ pọ̀ sí i tàbí yí àwọn àwọ̀ tí a mú padà pẹ̀lú textColorDarkMode àti/tàbí backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Bí ó tilẹ̀ jẹ́ pé ìtumọ̀ àṣà { $styleNumber } ti sọ àwọ̀ ọ̀rọ̀ tí ó ní ìyàtọ̀ tí ó tó fún ipò ìmọ́lẹ̀, àwọ̀ ọ̀rọ̀ ipò òkùnkùn tí a mú láti inú rẹ̀ ní ìyàtọ̀ tí kò tó lórí ojú-iṣẹ́ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ó nílò ó kéré tán { $threshold }:1). { $suggestion ->
        [available] Láti rí i dájú pé ìyàtọ̀ tó ní ipò òkùnkùn, mú ìyàtọ̀ ipò ìmọ́lẹ̀ pọ̀ sí i (bí àpẹẹrẹ ṣeto textColor="{ $lightColor }") tàbí yí àwọ̀ ipò òkùnkùn padà (bí àpẹẹrẹ ṣeto textColorDarkMode="{ $darkColor }").
       *[none] Láti rí i dájú pé ìyàtọ̀ tó ní ipò òkùnkùn, mú ìyàtọ̀ ipò ìmọ́lẹ̀ pọ̀ sí i tàbí yí àwọ̀ tí a mú padà pẹ̀lú textColorDarkMode.
    }

section-multiple-style-palettes = Ìpín kan lè yan <stylePalette> kan ṣoṣo; à ń lo ìkẹyìn.

## Unique variants

variant-num-to-select-not-non-negative-integer = a kò lè pinnu àwọn irúfẹ́ àrà ọ̀tọ̀ ti { $component } nítorí numToSelect kì í ṣe nọ́mbà pípé tí kò kéré sí òdo.

variant-num-to-select-not-constant-number = a kò lè pinnu àwọn irúfẹ́ àrà ọ̀tọ̀ ti { $component } nítorí numToSelect kì í ṣe nọ́mbà tí kò yípadà.

variant-with-replacement-not-constant-boolean = a kò lè pinnu àwọn irúfẹ́ àrà ọ̀tọ̀ ti { $component } nítorí withReplacement kì í ṣe boolean tí kò yípadà.

variant-select-weight-disables-unique = A ń pa àwọn irúfẹ́ àrà ọ̀tọ̀ fún select nígbà tí àṣàyàn kan bá ní selectWeight tàbí selectForVariants

variant-coprime-undetermined = a kò lè pinnu àwọn irúfẹ́ àrà ọ̀tọ̀ ti { $component } nítorí a kò lè pinnu pé coprime jẹ́ irọ́ nígbà gbogbo.

variant-attribute-not-constant = a kò lè pinnu àwọn irúfẹ́ àrà ọ̀tọ̀ ti { $component } nítorí { $attribute } kì í ṣe ohun tí kò yípadà.

variant-attribute-not-number = a kò lè pinnu àwọn irúfẹ́ àrà ọ̀tọ̀ ti { $component } nítorí { $attribute } kì í ṣe nọ́mbà.

variant-attribute-wrong-type-for-sequence =
    a kò lè pinnu àwọn irúfẹ́ àrà ọ̀tọ̀ ti { $component } irúfẹ́ { $type } nítorí { $attribute } kì í ṣe { $expected ->
        [letters-combination] àkópọ̀ lẹ́tà
        [math-expression] ọ̀rọ̀ ìṣirò tí ó tọ́
        [integer] nọ́mbà pípé
       *[number] nọ́mbà
    }.

variant-length-not-integer = a kò lè pinnu àwọn irúfẹ́ àrà ọ̀tọ̀ ti { $component } nítorí length kì í ṣe nọ́mbà pípé.

variant-sort-not-implemented = a kò tí ì ṣe àwọn irúfẹ́ àrà ọ̀tọ̀ ti { $component } pẹ̀lú sort

variant-exclude-combinations-not-implemented = a kò tí ì ṣe àwọn irúfẹ́ àrà ọ̀tọ̀ ti { $component } pẹ̀lú excludeCombinations

variant-math-exclude-not-implemented = a kò tí ì ṣe àwọn irúfẹ́ àrà ọ̀tọ̀ ti { $component } irúfẹ́ math pẹ̀lú exclude

variant-non-constant-exclude-not-implemented = a kò tí ì ṣe àwọn irúfẹ́ àrà ọ̀tọ̀ ti { $component } pẹ̀lú exclude tí ó ń yípadà

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: a kò ṣàtìlẹ́yìn fún un nínú ohun ìṣàfihàn graph prefigure; a fo ọmọ-ẹ̀yìn náà.

prefigure-descendant-invalid-geometry = { $subject }: geometry tí kò ní òpin tàbí tí kò pé; a fo ọmọ-ẹ̀yìn náà.

prefigure-curve-label-omitted = { $subject }: a kò ṣàtìlẹ́yìn fún àmì ìdámọ̀ lórí àwọn apá ìtẹ̀ tí a yípadà; a fi àmì ìdámọ̀ sílẹ̀.

prefigure-curve-unsupported-definition-type = { $subject }: a kò ṣàtìlẹ́yìn fún irúfẹ́ ìtumọ̀ iṣẹ́ ìtẹ̀ '{ $definitionType }'; a fo ọmọ-ẹ̀yìn náà.

prefigure-region-flip-functions-unsupported = { $subject }: a kò ṣàtìlẹ́yìn fún ànímọ́ flipFunctions lórí regionBetweenCurves; a fo ọmọ-ẹ̀yìn náà.

prefigure-region-non-formula-child = { $subject }: a ṣàtìlẹ́yìn kìkì fún àwọn iṣẹ́ ọmọ irúfẹ́ formula lórí regionBetweenCurves; a fo ọmọ-ẹ̀yìn náà.

prefigure-label-position-unsupported =
    { $subject }: a kò ṣàtìlẹ́yìn fún labelPosition '{ $labelPosition }' fún { $labelKind ->
        [line-family] àmì ìdámọ̀ ẹbí ìlà
       *[point] àmì ìdámọ̀ ààmì
    }; à ń lo ìtolẹ́sẹẹsẹ PreFigure àtìlẹ̀wá.

prefigure-fill-style-unsupported = { $subject }: a kò ṣàtìlẹ́yìn fún àṣà kíkún '{ $fillStyle }' nínú PreFigure; à ń padà sí kíkún líle.

prefigure-line-style-unknown = { $subject }: a fi àṣà ìlà tí a kò mọ̀ '{ $lineStyle }' sílẹ̀ nínú ìjáde PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: a yí àṣà àmì '{ $markerStyle }' padà sí àṣà PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: a kò ṣàtìlẹ́yìn fún àṣà àmì '{ $markerStyle }' nínú PreFigure; à ń lo àṣà àtìlẹ̀wá.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` kò tọ́; a kò lè pinnu ohun tí a fojú sun. A fi àkíyèsí sílẹ̀.

annotation-ref-multiple-targets = `<annotation>`: `ref` tọ́ka sí ohun púpọ̀; à ń lo àkọ́kọ́.

annotation-ref-outside-graph = `<annotation>`: `ref` kò tọ́; ohun tí a fojú sun wà lóde gíráàfù tí ó gbé e. A fi àkíyèsí sílẹ̀.

annotation-ref-unsupported-target = `<annotation>`: `ref` kò tọ́; ohun tí a fojú sun kì í ṣe ohun àwòrán tí a ṣàtìlẹ́yìn fún nínú ìyípadà prefigure. A fi àkíyèsí sílẹ̀.

annotation-text-missing = `<annotation>`: `text` kò sí tàbí ó ṣófo; à ń jáde ọ̀rọ̀ òfìfo.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] A rí ìgbáralé oníyípo.
       *[other] A rí ìgbáralé oníyípo tí ó kan apá `<{ $componentType }>`.
    }

reference-no-referent = A kò rí ohun tí a tọ́ka sí fún ìtọ́kasí: `{ $reference }`

reference-multiple-referents = A rí ohun púpọ̀ tí a tọ́ka sí fún ìtọ́kasí: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ìlànà kò tọ́ fún ànímọ́ { $attribute } ti `<{ $componentType }>`.

children-invalid = Àwọn ọmọ tí kò tọ́ fún `<{ $componentType }>`: a rí àwọn ọmọ tí kò tọ́: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Iye `{ $value }` kò tọ́ fún ànímọ́ `{ $attribute }`; à ń lo iye `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] A kò rí ẹ̀yà DoenetML { $version }.
       *[other] A kò rí ẹ̀yà DoenetML { $version }. À ń padà sí ẹ̀yà { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML tí kò tọ́: { $content }

parse-tag-missing-close-tag = DoenetML tí kò tọ́: Àmì `{ $tag }` kò ní àmì ìparí. A retí àmì tí ó ń pa ara rẹ̀ dé tàbí àmì `</{ $tagName }>`.

parse-tag-error = DoenetML tí kò tọ́: Àṣìṣe nínú àmì `<{ $tagName }>`

parse-attribute-missing-value = DoenetML tí kò tọ́: Ànímọ́ `{ $attribute }` tí kò tọ́ dàbí ẹni pé kò ní iye.

parse-attribute-invalid = DoenetML tí kò tọ́: Ànímọ́ `{ $attribute }` kò tọ́

parse-attribute-value-invalid = DoenetML tí kò tọ́: Iye ànímọ́ `{ $value }` kò tọ́

parse-attribute-value-quote-mismatch = DoenetML tí kò tọ́: Iye ànímọ́ `{ $value }` kò tọ́. Àwọn àmì ọ̀rọ̀-àyọlò kò bá ara mu. Ó dàbí pé `{ $quote }` kò sí

parse-open-tag-name-missing = DoenetML tí kò tọ́: A rí àmì tí kò ní orúkọ àmì, bí àpẹẹrẹ `<`

parse-tag-not-closed = DoenetML tí kò tọ́: A kò pa àmì `{ $tag }` dé (ó dàbí pé `>` kò sí).

parse-self-closing-tag-name-missing = DoenetML tí kò tọ́: A rí àmì tí kò ní orúkọ àmì `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML tí kò tọ́: A kò pa àmì `{ $tag }` dé (ó dàbí pé `/>` kò sí).

parse-tag-invalid-attributes = DoenetML tí kò tọ́: Àmì `{ $tag }` kò tọ́. Ó lè ní àwọn ànímọ́ tí kò tọ́.

parse-close-tag-name-missing = DoenetML tí kò tọ́: A rí àmì ìparí tí kò ní orúkọ àmì, bí àpẹẹrẹ `</`

parse-attribute-value-unquoted = A gbọ́dọ̀ fi àwọn iye ànímọ́ sínú àmì ọ̀rọ̀-àyọlò: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML tí kò tọ́: A rí àmì ìparí `{ $tag }`, ṣùgbọ́n kò sí àmì ìbẹ̀rẹ̀ tí ó bá a mu

parse-close-tag-mismatched = DoenetML tí kò tọ́: Àmì ìparí kò bá a mu. A retí `</{ $expected }>`. A rí `{ $found }`

parser-node-unconvertible = A kò lè yí ojú-ìsopọ̀ { $node } padà sí ojú-ìsopọ̀ Dast.

## Names

name-attribute-invalid =
    Ànímọ́ name='{ $name }' kò tọ́. { $reason ->
        [characters] Àwọn orúkọ lè ní lẹ́tà, nọ́mbà, ìlà-ìsàlẹ̀ tàbí ìlà-àsopọ̀ nìkan.
       *[start] Àwọn orúkọ gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀lú lẹ́tà.
    }

component-name-invalid-start = Orúkọ apá "{ $name }" kò tọ́. Àwọn orúkọ gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀lú lẹ́tà.

## `<answer>` sugar

answer-video-watched-missing-video = Ìdáhùn irúfẹ́ videoWatched gbọ́dọ̀ ní ànímọ́ video

answer-video-watched-video-not-reference = Ìdáhùn irúfẹ́ videoWatched gbọ́dọ̀ ní ànímọ́ video tí ó jẹ́ ìtọ́kasí

answer-name-not-single-text = Ànímọ́ name ti ìdáhùn gbọ́dọ̀ ní ọmọ text kan ṣoṣo

## Referencing another document

external-doenetml-recursion-limit = A kò lè gba DoenetML òde nítorí ipele àtúnṣe tí ó pọ̀ jù. Ṣé ìtọ́kasí oníyípo wà?

external-doenetml-unavailable = A kò lè gba DoenetML láti { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML tí a gbà láti { $attribute }="{ $uri }" kò tọ́: kò bá irúfẹ́ apá "{ $componentType }" mu

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] A kò lo ànímọ́ `{ $from }` mọ́; lo `{ $to }` dípò.
       *[other] [deprecation] A kò lo ànímọ́ `{ $from }` lórí `<{ $component }>` mọ́; lo `{ $to }` dípò.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] A kò lo ànímọ́ `{ $from }` mọ́ a kò sì ka sí nítorí a sọ `{ $to }` pẹ̀lú.
       *[other] [deprecation] A kò lo ànímọ́ `{ $from }` lórí `<{ $component }>` mọ́ a kò sì ka sí nítorí a sọ `{ $to }` pẹ̀lú.
    }

deprecated-attribute-ignored = [deprecation] A kò lo ànímọ́ `{ $attribute }` lórí `<{ $component }>` mọ́ a kò sì ka sí.


## Language coverage

pluralize-english-only = `<pluralize>` lè ṣe ọ̀pọ̀ Gẹ̀ẹ́sì nìkan, nítorí náà a fi ọ̀rọ̀ rẹ̀ sílẹ̀ láìyípadà nínú àkọsílẹ̀ tí a kọ ní { $locale }. Kọ ìrísí ọ̀pọ̀ tààrà, tàbí ṣeto rẹ̀ pẹ̀lú ànímọ́ `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Apá `<{ $tag }>` kì í ṣe apá Doenet tí a mọ̀.

schema-element-not-allowed-at-root = A kò gba apá `<{ $tag }>` láyè ní gbòǹgbò àkọsílẹ̀.

schema-element-not-allowed-inside = A kò gba apá `<{ $tag }>` láyè nínú `<{ $parent }>`.

schema-attribute-unrecognized = Apá `<{ $tag }>` kò ní ànímọ́ tí a pè ní `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ànímọ́ `{ $attribute }` ti apá `<{ $tag }>` gbọ́dọ̀ jẹ́ àkójọ tí ohun kọ̀ọ̀kan nínú rẹ̀ jẹ́ ọ̀kan nínú: { $allowed }
       *[other] Ànímọ́ `{ $attribute }` ti apá `<{ $tag }>` gbọ́dọ̀ jẹ́ ọ̀kan nínú: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Orúkọ irúfẹ́ kò tọ́ fún select. Orúkọ irúfẹ́ { $variantName } farahàn nínú àṣàyàn { $numOptions } ṣùgbọ́n iye tí a fẹ́ yàn jẹ́ { $numToSelect }.

select-variant-name-without-options = A sọ àwọn irúfẹ́ kan fún select ṣùgbọ́n a kò sọ àṣàyàn kankan fún orúkọ irúfẹ́ tí ó ṣeé ṣe: { $variantName }.

select-variant-name-not-possible = Orúkọ irúfẹ́ { $variantName } tí a sọ fún select kì í ṣe orúkọ irúfẹ́ tí ó ṣeé ṣe.

select-too-few-options = A kò lè yan apá { $numToSelect } láti inú { $numOptions } nìkan.

select-from-sequence-too-few-values = A kò lè yan iye { $numToSelect } láti inú ìtẹ̀lera tí gígùn rẹ̀ jẹ́ { $length }.

select-from-sequence-indices-count-mismatch = Iye àwọn nọ́mbà tí a sọ fún select gbọ́dọ̀ bá iye tí a fẹ́ yàn mu

select-from-sequence-indices-not-integers = Gbogbo àwọn nọ́mbà tí a sọ fún select gbọ́dọ̀ jẹ́ nọ́mbà pípé

select-from-sequence-index-excluded = A sọ nọ́mbà selectfromsequence tí a ti yọ kúrò

select-from-sequence-indices-excluded-combination = A sọ àwọn nọ́mbà selectfromsequence tí ó jẹ́ àkópọ̀ tí a yọ kúrò

select-from-sequence-coprime-not-positive-integers = A kò lè yan àkópọ̀ coprime nítorí kì í ṣe nọ́mbà pípé rere ni à ń yàn.

select-from-sequence-coprime-common-factor = A kò lè yan nọ́mbà coprime. Gbogbo àwọn iye tí ó ṣeé ṣe ní ohun-ìpín kan náà. (Àwọn iye "from" tàbí "to" tí a sọ gbọ́dọ̀ jẹ́ coprime pẹ̀lú "step".)

select-from-sequence-coprime-single-number = A kò lè yan àkópọ̀ coprime láti inú nọ́mbà kan tí kì í ṣe 1.

select-from-sequence-excluded-too-many-combinations = A yọ ó ju 70% àwọn àkópọ̀ kúrò nínú selectFromSequence

select-from-sequence-coprime-none-found = A kò lè yan nọ́mbà coprime. Gbogbo àwọn iye tí ó ṣeé ṣe ní ohun-ìpín kan náà.

select-from-sequence-too-few-unique-values = A kò lè yan iye àrà ọ̀tọ̀ { $numToSelect } láti inú ìtẹ̀lera tí gígùn rẹ̀ jẹ́ { $numPossibleValues }

select-prime-numbers-too-few-values = A kò lè yan iye { $numToSelect } láti inú àkójọ nọ́mbà àkọ́kọ́ tí gígùn rẹ̀ jẹ́ { $numValues }

select-prime-numbers-values-count-mismatch = Iye àwọn iye tí a sọ fún select gbọ́dọ̀ bá iye tí a fẹ́ yàn mu

select-prime-numbers-values-not-prime = Gbogbo àwọn iye tí a sọ fún select prime number gbọ́dọ̀ wà nínú àkójọ nọ́mbà àkọ́kọ́

select-prime-numbers-values-excluded-combination = Àwọn iye selectPrimeNumbers tí a sọ jẹ́ àkópọ̀ tí a yọ kúrò

select-prime-numbers-excluded-too-many-combinations = A yọ ó ju 70% àwọn àkópọ̀ kúrò nínú selectPrimeNumbers

select-random-combination-fluke = Nípa àǹfààní tí kò ṣeé retí rárá, a kò lè yan àkópọ̀ àwọn iye àìròtẹ́lẹ̀

select-random-value-fluke = Nípa àǹfààní tí kò ṣeé retí rárá, a kò lè yan iye àìròtẹ́lẹ̀
