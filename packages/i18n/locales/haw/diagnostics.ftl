# Hawaiian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Hawaiian marks number on the article rather than on the noun, so the counted
# messages here need no selection — see the header of `chrome.ftl`.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = ʻAʻole i mālama ʻia { $attributes } ke hoʻonoho ʻia nā wēlau ʻelua

line-segment-attributes-ignored-with-endpoint-and-midpoint = ʻAʻole i mālama ʻia { $attributes } ke hoʻonoho pū ʻia ka wēlau a me ke kiko waena

line-segment-midpoint-offset-without-midpoint = ʻAʻohe hopena o midpointOffset ke ʻole he kiko waena

## `<line>`

line-points-undetermined-dimensions = He laina ma waena o nā kiko i maopopo ʻole nā ana.

line-points-too-few-dimensions = Pono ka laina e hele ma waena o nā kiko me nā ana ʻelua ma ka liʻiliʻi loa.

line-points-depend-on-variables = Hele ka laina ma waena o nā kiko e hilinaʻi ana i nā ʻano loli: { $variables }.

line-equation-invalid-format = Kūpono ʻole ke ʻano o ka haʻilula laina ma nā ʻano loli { $variable1 } a me { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ua hoʻonoho ʻia ke kukuna ma o through, endpoint a me direction. ʻAʻole e mālama ʻia ka through i hoʻonoho ʻia.

ray-dimension-mismatch = ʻAʻole kūlike ka numDimensions i loko o ke kukuna.

## `<vector>`

vector-overprescribed-head = Ua hoʻonoho ʻia ka wekekona ma o head, tail a me displacement. ʻAʻole e mālama ʻia ka head i hoʻonoho ʻia.

vector-dimension-mismatch = ʻAʻole kūlike ka numDimensions i loko o ka wekekona.

## Attracting and constraining

attract-to-without-nearest-point = ʻAʻole hiki ke huki i ka `<{ $component }>` no ka mea ʻaʻohe ona ʻano loli kūlana nearestPoint.

constrain-to-without-nearest-point = ʻAʻole hiki ke kaupalena i ka `<{ $component }>` no ka mea ʻaʻohe ona ʻano loli kūlana nearestPoint.

constrain-to-interior-without-nearest-point = ʻAʻole hiki ke kaupalena i loko o ka `<{ $component }>` no ka mea ʻaʻohe ona ʻano loli kūlana nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = ʻAʻole i mālama ʻia ka labelPosition no ka choiceInput ʻaʻole inline

## Ordering children by index

choice-input-indices-count-mismatch = ʻAʻole i mālama ʻia nā indices i hoʻonoho ʻia no ka choiceInput no ka mea ʻaʻole kūlike ka nui o nā indices me ka nui o nā keiki choice.

pretzel-indices-count-mismatch = ʻAʻole i mālama ʻia nā indices i hoʻonoho ʻia no ka problem no ka mea ʻaʻole kūlike ka nui o nā indices me ka nui o nā keiki problem.

shuffle-indices-count-mismatch = ʻAʻole i mālama ʻia nā indices i hoʻonoho ʻia no ka shuffle no ka mea ʻaʻole kūlike ka nui o nā indices me ka nui o nā ʻāpana.

indices-ignored-out-of-range = ʻAʻole i mālama ʻia nā indices i hoʻonoho ʻia no ka { $component } no ka mea aia kekahi mau indices ma waho o ka palena.

pretzel-indices-repeated = ʻAʻole i mālama ʻia nā indices i hoʻonoho ʻia no ka pretzel no ka mea ua pālua kekahi mau indices.

pretzel-circuit-first-index = ʻAʻole i mālama ʻia nā indices i hoʻonoho ʻia no ka pretzel ma ke ʻano circuit no ka mea pono ka index mua he 1.

## `<shuffle>` and `<sort>`

string-children-need-type = I hana ka `<{ $component }>` me nā keiki kikokikona, pono e hoʻonoho ʻia ka ʻano `type`.

invalid-type-defaulting-to-math = Kūpono ʻole ka type { $type } no ka ʻāpana { $component }. Pono he math, text, number, a i ʻole boolean. E hoʻohana ʻia ka math.

string-not-valid-component-to-arrange = ʻAʻole he ʻāpana kūpono ka kikokikona "{ $value }" no ka { $component }. ʻAʻole e mālama ʻia.

## Types and variables

invalid-type-defaulting-to-number = Kūpono ʻole ka type { $type }, e hoʻonoho ʻia ka type i number.

invalid-variable-value = Waiwai kūpono ʻole o kahi ʻano loli: `{ $value }`

## Variants

variant-index-must-be-number = Pono ka index variant { $index } he helu

variant-index-must-be-integer = Pono ka index variant { $index } he helu piha

## `<sideBySide>`

side-by-side-absolute-widths = ʻAʻole i hana ʻia ka `<{ $component }>` no nā ana paʻa. E hoʻonoho ʻia nā ākea ma ke ʻano pili.

side-by-side-absolute-margins = ʻAʻole i hana ʻia ka `<{ $component }>` no nā ana paʻa. E hoʻonoho ʻia nā lihi ma ke ʻano pili.

side-by-side-no-block-child = Kūpono ʻole ka `<{ $component }>`: pono kekahi keiki poloka hoʻokahi ma ka liʻiliʻi loa.

## `<label>`

label-for-ignored-on-graphical = ʻAʻole i mālama ʻia ka ʻano `for` ma ka `<label>` kiʻi.

label-for-must-resolve-to-one = Pono ka ʻano `for` ma ka `<label>` e kuhikuhi i hoʻokahi wale nō ʻāpana.

label-for-unresolved = ʻAʻole hiki i ka ʻano `for` ma ka `<label>` ke kuhikuhi i kekahi ʻāpana.

label-for-answer-with-authored-inputs = Kuhikuhi ka ʻano `for` ma ka `<label>` i kahi `<answer>` me nā komo i kākau ʻia e ka mea kākau; e kuhikuhi pololei i ke komo.

label-for-answer-without-input = Kuhikuhi ka ʻano `for` ma ka `<label>` i kahi `<answer>` ʻaʻohe ona komo e inoa ai.

label-for-must-reference-input-or-answer = Pono ka ʻano `for` ma ka `<label>` e kuhikuhi i kahi komo a i ʻole answer.

## Accessibility

accessibility-short-description-or-decorative = No ka hiki ke komo, pono ka `<{ $component }>` i wehewehe pōkole a i ʻole e hoʻonoho ʻia he mea hoʻonani.

accessibility-video-short-description = No ka hiki ke komo, pono ka `<video>` i wehewehe pōkole.

accessibility-input-short-description-or-label = No ka hiki ke komo, pono ka `<{ $component }>` i wehewehe pōkole a i ʻole inoa.

accessibility-answer-input-short-description-or-label = No ka hiki ke komo, pono ka `<answer>` e hana ana i komo i wehewehe pōkole a i ʻole inoa.

accessibility-short-description-contains-math = ʻAʻole pono nā wehewehe pōkole e loaʻa nā ʻāpana makemakika e like me ka `<{ $component }>`. E kākau i ka makemakika ma nā huaʻōlelo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] ʻAʻole lawa ka ʻokoʻa o { $colorName } no ka kikokikona poʻo māhele (ʻano pōʻeleʻele) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pono ma ka liʻiliʻi loa he { $threshold }:1).
       *[other] ʻAʻole lawa ka ʻokoʻa o { $colorName } no ka kikokikona poʻo māhele ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pono ma ka liʻiliʻi loa he { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = ʻAʻole i hana ʻia ka `<circle>` ma waena o { $count } kiko ke ʻaʻohe waiwai helu o nā kiko.

circle-too-many-through-points = ʻAʻole hiki ke helu i ka pōʻai ma waena o nā kiko ʻoi aku ma mua o 3.

circle-overprescribed-radius-center-points = ʻAʻole hiki ke helu i ka pōʻai me ka pihi, ke kikowaena a me nā kiko i hoʻonoho ʻia.

circle-center-with-multiple-points = ʻAʻole hiki ke helu i ka pōʻai me ke kikowaena i hoʻonoho ʻia ma waena o nā kiko ʻoi aku ma mua o 1.

circle-radius-too-small = ʻAʻole hiki ke helu i ka pōʻai: no ka mea he { $distance } ka mamao ma waena o nā kiko ʻelua, liʻiliʻi loa ka pihi { $radius } i hoʻonoho ʻia.

circle-radius-with-many-points = ʻAʻole hiki ke hana i ka pōʻai ma waena o nā kiko ʻoi aku ma mua o ʻelua me ka pihi i hoʻonoho ʻia.

circle-invalid-center-or-through-points = Kūpono ʻole ke kikowaena a i ʻole nā kiko o ka pōʻai.

circle-radius-center-with-multiple-points = ʻAʻole hiki ke helu i ka pihi o ka pōʻai me ke kikowaena i hoʻonoho ʻia ma waena o nā kiko ʻoi aku ma mua o 1.

circle-change-radius-non-numerical = ʻAʻole hiki ke hoʻololi i ka pihi o ka pōʻai me nā kiko helu ʻole

circle-radius-with-points-non-numerical = ʻAʻole hiki ke hana i ka pōʻai ma waena o nā kiko ʻoi aku ma mua o hoʻokahi me ka pihi i hoʻonoho ʻia ke ʻaʻohe waiwai helu.

circle-change-center-non-numerical = ʻAʻole i hana ʻia ka hoʻololi ʻana i ke kikowaena o ka pōʻai ma waena o nā kiko helu ʻole.

## `<function>`

function-domain-insufficient-dimensions = ʻAʻole lawa nā ana o ka domain no ka hana. He { $intervals } kaʻawale ko ka domain akā he { $inputs } komo ko ka hana.

function-domain-invalid-format = Kūpono ʻole ke ʻano o ka domain no ka hana.

function-ignoring-non-numerical =
    { $type ->
        [maximum] ʻAʻole i mālama ʻia ka nui loa helu ʻole o ka hana.
        [minimum] ʻAʻole i mālama ʻia ka liʻiliʻi loa helu ʻole o ka hana.
        [extremum] ʻAʻole i mālama ʻia ka wēlau helu ʻole o ka hana.
        [point] ʻAʻole i mālama ʻia ke kiko helu ʻole o ka hana.
        [slope] ʻAʻole i mālama ʻia ka hio helu ʻole o ka hana.
       *[other] ʻAʻole i mālama ʻia ka { $type } helu ʻole o ka hana.
    }

function-ignoring-empty =
    { $type ->
        [maximum] ʻAʻole i mālama ʻia ka nui loa hakahaka o ka hana.
        [minimum] ʻAʻole i mālama ʻia ka liʻiliʻi loa hakahaka o ka hana.
        [extremum] ʻAʻole i mālama ʻia ka wēlau hakahaka o ka hana.
        [point] ʻAʻole i mālama ʻia ke kiko hakahaka o ka hana.
       *[other] ʻAʻole i mālama ʻia ka { $type } hakahaka o ka hana.
    }

function-points-too-close = Aia nā kiko ʻelua o ka hana e kokoke loa ana. ʻAʻole hiki ke wehewehe i ka hana.

function-iterates-input-output-mismatch = Hiki ke hana hou i ka hana inā like ka nui o nā komo me ka nui o nā puka. He { $inputs } komo a he { $outputs } puka ko kēia hana.

## `<sequence>`

sequence-invalid-length = Kūpono ʻole ka lōʻihi o ke kaʻina. Pono he helu piha ʻaʻole hōʻole.

sequence-invalid-step = Kūpono ʻole ke kaʻi o ke kaʻina. Pono he helu no ke kaʻina ʻano { $type }.

sequence-invalid-endpoint-number = Kūpono ʻole ka "{ $attribute }" o ke kaʻina helu. Pono he helu.

sequence-invalid-endpoint-letters = Kūpono ʻole ka "{ $attribute }" o ke kaʻina hua palapala. Pono he hui hua palapala.

sequence-invalid-endpoint = Kūpono ʻole ka "{ $attribute }" o ke kaʻina.

select-from-sequence-coprime-not-numbers = ʻAʻole i mālama ʻia ka coprime no ka mea ʻaʻole e koho ʻia ana nā helu

select-from-sequence-coprime-with-exclude-combinations = ʻAʻole i mālama ʻia ka coprime no ka mea ua hoʻonoho ʻia ka excludeCombinations

## Resolving a `target`

target-not-found = Kūpono ʻole ka target no ka `<{ $source }>`: ʻaʻole i loaʻa ka target.

target-state-variable-not-found = Kūpono ʻole ka target no ka `<{ $source }>`: ʻaʻole i loaʻa kahi ʻano loli kūlana i kapa ʻia "{ $property }" ma ka `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Pono nā ʻano loli o ka `<odeSystem>` e ʻokoʻa mai ka ʻano loli kūʻokoʻa.

ode-system-duplicate-variable-names = ʻAʻole hiki ke wehewehe i nā hana ʻaoʻao ʻākau o ka ODE me nā inoa ʻano loli hilinaʻi pālua.

ode-system-rhs-function-error = ʻAʻole hiki ke wehewehe i ka hana ʻaoʻao ʻākau o ka ODE. He hewa i ka hana ʻana i ka hana mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = ʻAʻole hiki ke wehewehe i kahi huina ma waena o { $count } laina

angle-invalid-through-point = Kiko kūpono ʻole i loko o ka through o ka `<angle>`

parabola-vertex-too-many-points = ʻAʻole i hana ʻia ka parapola me ka piko ma waena o nā kiko ʻoi aku ma mua o 1.

parabola-too-many-points = ʻAʻole i hana ʻia ka parapola ma waena o nā kiko ʻoi aku ma mua o 3.

intersection-too-many-items = ʻAʻole i hana ʻia ka hui ʻana no nā mea ʻoi aku ma mua o ʻelua

## Other math components

ionic-compound-not-two-ions = ʻAʻole i hana ʻia ka huikau ionika no kekahi mea ʻē aʻe ma mua o nā ion ʻelua.

ionic-compound-needs-cation-and-anion = Ua hana ʻia ka huikau ionika no hoʻokahi cation a me hoʻokahi anion wale nō.

solve-equations-cannot-evaluate = ʻAʻole hiki ke hoʻoponopono i ka haʻilula no ka mea ʻaʻole hiki ke helu: { $equation }

math-operators-operand-number-required = Pono e hoʻonoho i kahi operandNumber ke unuhi i kahi operand makemakika.

eigen-decomposition-failed = ʻAʻole hiki ke helu i nā waiwai eigen o ka matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: ʻaʻole loaʻa ka parameter { $parameters } i loko o ke ʻano, no laila e kūlike mau ia me kahi hakahaka.

## `<graph>`

graph-grid-invalid = `<graph>`: ʻaʻole hiki ke wehewehe i ka grid="{ $grid }". Pono he none, medium, dense, a i ʻole ʻelua helu maikaʻi i hoʻokaʻawale ʻia e kahi hakahaka, e like me grid="1 0.5". ʻAʻohe mākia i kaha ʻia.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: ʻaʻole kākoʻo ʻia ka xLabelPosition="left" i loko o ka mea hōʻike prefigure; e hoʻohana ʻia ke ʻano o ke kūlana ʻākau.

prefigure-y-label-position-unsupported = `<graph>`: ʻaʻole kākoʻo ʻia ka yLabelPosition="bottom" i loko o ka mea hōʻike prefigure; e hoʻohana ʻia ke ʻano o ke kūlana luna.

prefigure-invalid-axis-bounds = `<graph>`: kūpono ʻole nā palena axis no ka hoʻololi prefigure; e hoʻohana ʻia ka bbox maʻamau (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: kūpono ʻole ka ākea no ka hoʻololi prefigure; e hoʻohana ʻia ka ākea kiʻikuhi maʻamau 425.

prefigure-invalid-aspect-ratio = `<graph>`: kūpono ʻole ka aspectRatio no ka hoʻololi prefigure; e hoʻohana ʻia ka lākiō maʻamau 1.

prefigure-grid-spacing-too-fine = `<graph>`: pili loa ka mokuna o ka mākia no nā palena axis; ua hoʻokuʻu ʻia ka mākia i loko o ka mea hōʻike prefigure.

prefigure-annotations-not-rendered = `<graph>`: ʻaʻole e hōʻike ʻia nā ʻōlelo hoʻākāka ke hoʻohana ʻole ʻia ka mea hōʻike PreFigure.

multiple-annotations-children = Ua loaʻa nā keiki `<annotations>` he nui i loko o ka `<graph>`; ʻaʻole i mālama ʻia nā mea a pau koe ka mea hope loa.

## Referring to other components

copy-unrecognized-component-type = ʻAʻole hiki ke hoʻonui a kope paha i kahi ʻano ʻāpana ʻike ʻole ʻia: { $type }.

copy-prop-not-found = ʻAʻole i loaʻa ka prop { $property } ma kahi ʻāpana ʻano { $component }

collect-no-source = ʻAʻohe kumu i loaʻa no ka collect.

collect-invalid-component-type = ʻAʻole hiki ke hōʻiliʻili i nā ʻāpana ʻano `<{ $component }>` no ka mea he ʻano ʻāpana kūpono ʻole ia.

reference-index-unavailable = ʻAʻole hiki ke kuhikuhi i ka index `{ $reference }`

## `<callAction>`

component-action-unavailable = ʻAʻole hiki ke kāhea i ka { $action } ma ka ʻāpana `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Kūpono ʻole ke ʻano o ka ʻikepili. ʻAʻole like ka lōʻihi o nā lālani. Ua loaʻa ma componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = He mau inoa kolamu pālua ko ka ʻikepili. Ua loaʻa ma componentIdx :{ $componentIdx }

data-frame-missing-column-name = ʻAʻohe inoa kolamu o ka ʻikepili. Ua loaʻa ma componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Hilinaʻi ka award no kēia pane i ka pane a ka answer ponoʻī i hoʻouna ai, a e hiki mai ana kahi ʻano i manaʻo ʻole ʻia.

answer-max-num-attempts-in-section-wide-check-work = ʻAʻohe hopena o ka hoʻonoho ʻana i ka `maxNumAttempts` ma kahi `<answer>` i loko o kahi ipu me ka `sectionWideCheckWork`, no ka mea na ka ipu e hoʻomalu i ka nui o nā hoʻāʻo. E hoʻonoho i ka `maxNumAttempts` ma ka ipu.

nested-section-wide-check-work-max-num-attempts = ʻAʻohe hopena o ka hoʻonoho ʻana i ka `maxNumAttempts` ma kahi ipu me ka `sectionWideCheckWork` i loko o kekahi ipu ʻē aʻe me ka `sectionWideCheckWork`, no ka mea na ka ipu waho e hoʻomalu i ka nui o nā hoʻāʻo. E hoʻonoho i ka `maxNumAttempts` ma ka ipu waho.

answer-attributes-need-symbolic-equality = ʻAʻohe hopena o ka ʻano { $attributes } ke hoʻonoho ʻole ʻia ka symbolicEquality.

answer-invalid-type = ʻAno kūpono ʻole no ka answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = No ka mea ʻaʻohe inoa o ka ʻāpana `<{ $component }>`, ʻaʻole hiki ke hoʻohana ʻia i ʻano no ka module

module-attribute-name-already-defined = ʻAʻole hiki ke hoʻohana i ka ʻāpana `<{ $component } name="{ $name }">` i ʻano no ka module no ka mea ua loaʻa i ke ʻano `<module>` ka ʻano "{ $name }".

conditional-content-condition-ignored = ʻAʻole i mālama ʻia ka ʻano `condition` ma kahi ʻāpana `<conditionalContent>` me nā keiki case a i ʻole else.

slider-markers-type-mismatch = ʻAʻole kūlike ke ʻano o nā māka me ke ʻano o ka slider.

pretzel-problem-needs-statement-and-answer = Kūpono ʻole ka pretzel: pono kēlā me kēia `<problem>` i hoʻokahi `<statement>` a me hoʻokahi `<answer>`.

pretzel-circuit-first-problem-distractor = Kūpono ʻole ka pretzel: ma ka mode="circuit", ʻaʻole hiki i ka `<problem>` mua ke lilo i distractor.

## Attribute values

attribute-invalid-values = Waiwai kūpono ʻole { $values } no ka ʻano `{ $attribute }`; ʻaʻole e mālama ʻia.

attribute-must-be-references = Waiwai kūpono ʻole `{ $value }` no ka ʻano `{ $attribute }`. Pono e hana ʻia ka ʻano me nā kuhikuhi e hoʻomaka ana me ka `$`.

math-input-invalid-function-names = <mathInput>: ʻaʻole i mālama ʻia nā inoa hana kūpono ʻole i loko o ka { $attribute }: { $names }. Pono ka māhele hōʻike o kēlā me kēia inoa he 2 hua palapala ma ka liʻiliʻi loa (nā hua palapala a i ʻole nā kaha); hiki ke hoʻohui i ka `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = ʻAno ʻāpana kūpono ʻole: `<{ $componentType }>`

attribute-repeated = ʻAʻole hiki ke hana hou i ka ʻano { $attribute }.

attribute-invalid-for-component = Kūpono ʻole ka ʻano "{ $attribute }" no kahi ʻāpana ʻano `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    ʻAʻole lawa ka ʻokoʻa o ka wehewehe kaila { $styleNumber } no ka { $context ->
        [text-on-background] waihoʻoluʻu kikokikona ma luna o ka waihoʻoluʻu kua
        [high-contrast] waihoʻoluʻu ʻokoʻa nui ma luna o ka pale
        [line] waihoʻoluʻu laina ma luna o ka pale
        [marker] waihoʻoluʻu māka ma luna o ka pale
       *[text-on-canvas] waihoʻoluʻu kikokikona ma luna o ka pale
    }{ $mode ->
        [dark] { " (ʻano pōʻeleʻele)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pono ma ka liʻiliʻi loa he { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    ʻOiai ua hoʻonoho ka wehewehe kaila { $styleNumber } i nā waihoʻoluʻu me ka ʻokoʻa lawa no ke ʻano mālamalama, ʻaʻole lawa ka ʻokoʻa o nā waihoʻoluʻu ʻano pōʻeleʻele i loaʻa mai ia mau waiwai no ka waihoʻoluʻu kikokikona ma luna o ka waihoʻoluʻu kua ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pono ma ka liʻiliʻi loa he { $threshold }:1). { $suggestion ->
        [available] I lawa ka ʻokoʻa ma ke ʻano pōʻeleʻele, e hoʻonui i ka ʻokoʻa o ke ʻano mālamalama (e laʻa, e hoʻonoho { $lightAttribute }="{ $lightColor }") a i ʻole e hoʻololi i ka waihoʻoluʻu ʻano pōʻeleʻele (e laʻa, e hoʻonoho { $darkAttribute }="{ $darkColor }").
       *[none] I lawa ka ʻokoʻa ma ke ʻano pōʻeleʻele, e hoʻonui i ka ʻokoʻa o ke ʻano mālamalama a i ʻole e hoʻololi i nā waihoʻoluʻu i loaʻa mai me ka textColorDarkMode a/a i ʻole ka backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    ʻOiai ua hoʻonoho ka wehewehe kaila { $styleNumber } i kahi waihoʻoluʻu kikokikona me ka ʻokoʻa lawa no ke ʻano mālamalama, ʻaʻole lawa ka ʻokoʻa o ka waihoʻoluʻu kikokikona ʻano pōʻeleʻele i loaʻa mai ia waiwai ma luna o ka pale ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pono ma ka liʻiliʻi loa he { $threshold }:1). { $suggestion ->
        [available] I lawa ka ʻokoʻa ma ke ʻano pōʻeleʻele, e hoʻonui i ka ʻokoʻa o ke ʻano mālamalama (e laʻa, e hoʻonoho textColor="{ $lightColor }") a i ʻole e hoʻololi i ka waihoʻoluʻu ʻano pōʻeleʻele (e laʻa, e hoʻonoho textColorDarkMode="{ $darkColor }").
       *[none] I lawa ka ʻokoʻa ma ke ʻano pōʻeleʻele, e hoʻonui i ka ʻokoʻa o ke ʻano mālamalama a i ʻole e hoʻololi i ka waihoʻoluʻu i loaʻa mai me ka textColorDarkMode.
    }

section-multiple-style-palettes = Hoʻokahi wale nō <stylePalette> e hiki i kahi māhele ke koho; e hoʻohana ʻia ka mea hope loa.

## Unique variants

variant-num-to-select-not-non-negative-integer = ʻaʻole hiki ke wehewehe i nā variant kūʻokoʻa o ka { $component } no ka mea ʻaʻole he helu piha ʻaʻole hōʻole ka numToSelect.

variant-num-to-select-not-constant-number = ʻaʻole hiki ke wehewehe i nā variant kūʻokoʻa o ka { $component } no ka mea ʻaʻole he helu paʻa ka numToSelect.

variant-with-replacement-not-constant-boolean = ʻaʻole hiki ke wehewehe i nā variant kūʻokoʻa o ka { $component } no ka mea ʻaʻole he boolean paʻa ka withReplacement.

variant-select-weight-disables-unique = Ua pio nā variant kūʻokoʻa no ka select inā aia kahi option me ka selectWeight a i ʻole selectForVariants

variant-coprime-undetermined = ʻaʻole hiki ke wehewehe i nā variant kūʻokoʻa o ka { $component } no ka mea ʻaʻole hiki ke hoʻoholo he wahaheʻe mau ka coprime.

variant-attribute-not-constant = ʻaʻole hiki ke wehewehe i nā variant kūʻokoʻa o ka { $component } no ka mea ʻaʻole paʻa ka { $attribute }.

variant-attribute-not-number = ʻaʻole hiki ke wehewehe i nā variant kūʻokoʻa o ka { $component } no ka mea ʻaʻole he helu ka { $attribute }.

variant-attribute-wrong-type-for-sequence =
    ʻaʻole hiki ke wehewehe i nā variant kūʻokoʻa o ka { $component } ʻano { $type } no ka mea ʻaʻole he { $expected ->
        [letters-combination] hui hua palapala
        [math-expression] hōʻike makemakika kūpono
        [integer] helu piha
       *[number] helu
    } ka { $attribute }.

variant-length-not-integer = ʻaʻole hiki ke wehewehe i nā variant kūʻokoʻa o ka { $component } no ka mea ʻaʻole he helu piha ka length.

variant-sort-not-implemented = ʻaʻole i hana ʻia nā variant kūʻokoʻa o kahi { $component } me ka sort

variant-exclude-combinations-not-implemented = ʻaʻole i hana ʻia nā variant kūʻokoʻa o kahi { $component } me ka excludeCombinations

variant-math-exclude-not-implemented = ʻaʻole i hana ʻia nā variant kūʻokoʻa o kahi { $component } ʻano math me ka exclude

variant-non-constant-exclude-not-implemented = ʻaʻole i hana ʻia nā variant kūʻokoʻa o kahi { $component } me kahi exclude paʻa ʻole

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ʻaʻole kākoʻo ʻia i loko o ka mea hōʻike prefigure o ka graph; ua lele ʻia ka mamo.

prefigure-descendant-invalid-geometry = { $subject }: he ʻano ʻaoʻao palena ʻole a piha ʻole paha; ua lele ʻia ka mamo.

prefigure-curve-label-omitted = { $subject }: ʻaʻole kākoʻo ʻia nā inoa ma nā ʻāpana laina piʻo i hoʻololi ʻia; ua hoʻokuʻu ʻia ka inoa.

prefigure-curve-unsupported-definition-type = { $subject }: ʻaʻole kākoʻo ʻia ke ʻano wehewehe hana laina piʻo '{ $definitionType }'; ua lele ʻia ka mamo.

prefigure-region-flip-functions-unsupported = { $subject }: ʻaʻole kākoʻo ʻia ka ʻano flipFunctions ma ka regionBetweenCurves; ua lele ʻia ka mamo.

prefigure-region-non-formula-child = { $subject }: ʻo nā hana keiki ʻano haʻilula wale nō ka mea kākoʻo ʻia ma ka regionBetweenCurves; ua lele ʻia ka mamo.

prefigure-label-position-unsupported =
    { $subject }: ʻaʻole kākoʻo ʻia ka labelPosition '{ $labelPosition }' no ka { $labelKind ->
        [line-family] inoa ʻohana laina
       *[point] inoa kiko
    }; e hoʻohana ʻia ka hoʻonohonoho maʻamau a PreFigure.

prefigure-fill-style-unsupported = { $subject }: ʻaʻole kākoʻo ʻia e PreFigure ke kaila piha '{ $fillStyle }'; e hoʻi i kahi piha paʻa.

prefigure-line-style-unknown = { $subject }: ʻike ʻole ʻia ke kaila laina '{ $lineStyle }', ua hoʻokuʻu ʻia mai ka puka o PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ua hoʻololi ʻia ke kaila māka '{ $markerStyle }' i ke kaila 'diamond' a PreFigure.

prefigure-marker-style-unsupported = { $subject }: ʻaʻole kākoʻo ʻia e PreFigure ke kaila māka '{ $markerStyle }'; e hoʻohana ʻia ke kaila maʻamau.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: kūpono ʻole ka `ref`; ʻaʻole hiki ke loaʻa ka target. Ua hoʻokuʻu ʻia ka ʻōlelo hoʻākāka.

annotation-ref-multiple-targets = `<annotation>`: ua kuhikuhi ka `ref` i nā target he nui; e hoʻohana ʻia ka target mua.

annotation-ref-outside-graph = `<annotation>`: kūpono ʻole ka `ref`; aia ka target ma waho o ka graph. Ua hoʻokuʻu ʻia ka ʻōlelo hoʻākāka.

annotation-ref-unsupported-target = `<annotation>`: kūpono ʻole ka `ref`; ʻaʻole he mea kiʻi kākoʻo ʻia ka target i ka hoʻololi prefigure. Ua hoʻokuʻu ʻia ka ʻōlelo hoʻākāka.

annotation-text-missing = `<annotation>`: nalowale a hakahaka paha ka `text`; e hoʻopuka ʻia he kikokikona hakahaka.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ua loaʻa kahi hilinaʻi pōʻai.
       *[other] Ua loaʻa kahi hilinaʻi pōʻai e pili ana i ka ʻāpana `<{ $componentType }>`.
    }

reference-no-referent = ʻAʻohe mea i loaʻa i kuhikuhi ʻia e ke kuhikuhi: `{ $reference }`

reference-multiple-referents = He nui nā mea i loaʻa i kuhikuhi ʻia e ke kuhikuhi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Kūpono ʻole ke ʻano o ka ʻano { $attribute } o ka `<{ $componentType }>`.

children-invalid = Nā keiki kūpono ʻole no ka `<{ $componentType }>`: ua loaʻa nā keiki kūpono ʻole: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Waiwai kūpono ʻole `{ $value }` no ka ʻano `{ $attribute }`, e hoʻohana ʻia ka waiwai `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] ʻAʻole i loaʻa ka DoenetML mana { $version }.
       *[other] ʻAʻole i loaʻa ka DoenetML mana { $version }. E hoʻi i ka mana { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML kūpono ʻole: { $content }

parse-tag-missing-close-tag = DoenetML kūpono ʻole: ʻAʻohe tag pani o ka tag `{ $tag }`. Ua manaʻo ʻia he tag pani iā ia iho a i ʻole he tag `</{ $tagName }>`.

parse-tag-error = DoenetML kūpono ʻole: He hewa i loko o ka tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML kūpono ʻole: Me he mea lā ua nalowale ka waiwai o ka ʻano kūpono ʻole `{ $attribute }`.

parse-attribute-invalid = DoenetML kūpono ʻole: ʻAno kūpono ʻole `{ $attribute }`

parse-attribute-value-invalid = DoenetML kūpono ʻole: Waiwai ʻano kūpono ʻole `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML kūpono ʻole: Waiwai ʻano kūpono ʻole `{ $value }`. ʻAʻole kūlike nā kaha puana. Me he mea lā ua nalowale kahi `{ $quote }`

parse-open-tag-name-missing = DoenetML kūpono ʻole: Ua loaʻa kahi tag me ka inoa ʻole, e laʻa `<`

parse-tag-not-closed = DoenetML kūpono ʻole: ʻAʻole i pani ʻia ka tag `{ $tag }` (me he mea lā ua nalowale kahi `>`).

parse-self-closing-tag-name-missing = DoenetML kūpono ʻole: Ua loaʻa kahi tag me ka inoa ʻole `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML kūpono ʻole: ʻAʻole i pani ʻia ka tag `{ $tag }` (me he mea lā ua nalowale ka `/>`).

parse-tag-invalid-attributes = DoenetML kūpono ʻole: Kūpono ʻole ka tag `{ $tag }`. Malia paha he hewa kona mau ʻano.

parse-close-tag-name-missing = DoenetML kūpono ʻole: Ua loaʻa kahi tag pani me ka inoa ʻole, e laʻa `</`

parse-attribute-value-unquoted = Pono e hoʻopuni ʻia nā waiwai ʻano i nā kaha puana: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML kūpono ʻole: Ua loaʻa ka tag pani `{ $tag }`, akā ʻaʻohe tag wehe kūlike

parse-close-tag-mismatched = DoenetML kūpono ʻole: ʻAʻole kūlike ka tag pani. Ua manaʻo ʻia `</{ $expected }>`. Ua loaʻa `{ $found }`

parser-node-unconvertible = ʻAʻole hiki ke hoʻololi i ka node { $node } i node Dast.

## Names

name-attribute-invalid =
    ʻAno kūpono ʻole name='{ $name }'. { $reason ->
        [characters] Hiki i nā inoa ke loaʻa nā hua palapala, nā helu, nā kaha lalo a me nā kaha wale nō.
       *[start] Pono nā inoa e hoʻomaka me kahi hua palapala.
    }

component-name-invalid-start = Inoa ʻāpana kūpono ʻole "{ $name }". Pono nā inoa e hoʻomaka me kahi hua palapala.

## `<answer>` sugar

answer-video-watched-missing-video = Pono ka answer ʻano videoWatched i kahi ʻano video

answer-video-watched-video-not-reference = Pono ka answer ʻano videoWatched i kahi ʻano video he kuhikuhi

answer-name-not-single-text = Pono ka ʻano name o ka answer i hoʻokahi keiki kikokikona

## Referencing another document

external-doenetml-recursion-limit = ʻAʻole hiki ke kiʻi i ka DoenetML mai waho no ka nui loa o nā papa hana hou. Aia paha kahi kuhikuhi pōʻai?

external-doenetml-unavailable = ʻAʻole hiki ke kiʻi i ka DoenetML mai { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Kūpono ʻole ka DoenetML i kiʻi ʻia mai { $attribute }="{ $uri }": ʻaʻole kūlike me ke ʻano ʻāpana "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ua hoʻopau ʻia ka ʻano `{ $from }`; e hoʻohana i ka `{ $to }`.
       *[other] [deprecation] Ua hoʻopau ʻia ka ʻano `{ $from }` ma ka `<{ $component }>`; e hoʻohana i ka `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ua hoʻopau ʻia ka ʻano `{ $from }` a ʻaʻole i mālama ʻia no ka mea ua hoʻonoho pū ʻia ka `{ $to }`.
       *[other] [deprecation] Ua hoʻopau ʻia ka ʻano `{ $from }` ma ka `<{ $component }>` a ʻaʻole i mālama ʻia no ka mea ua hoʻonoho pū ʻia ka `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Ua hoʻopau ʻia ka ʻano `{ $attribute }` ma ka `<{ $component }>` a ʻaʻole i mālama ʻia.


## Language coverage

pluralize-english-only = Hiki i ka `<pluralize>` ke hana i ka helu nui ma ka ʻōlelo Pelekania wale nō, no laila ua waiho ʻia kāna kikokikona me ka hoʻololi ʻole i loko o kahi palapala i kākau ʻia ma ka { $locale }. E kākau pololei i ke ʻano helu nui, a i ʻole e hoʻonoho me ka ʻano `pluralForm`.


## Checking against the schema

schema-element-unrecognized = ʻAʻole he element Doenet ʻike ʻia ka element `<{ $tag }>`.

schema-element-not-allowed-at-root = ʻAʻole ʻae ʻia ka element `<{ $tag }>` ma ke kumu o ka palapala.

schema-element-not-allowed-inside = ʻAʻole ʻae ʻia ka element `<{ $tag }>` i loko o ka `<{ $parent }>`.

schema-attribute-unrecognized = ʻAʻohe ʻano i kapa ʻia `{ $attribute }` o ka element `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Pono ka ʻano `{ $attribute }` o ka element `<{ $tag }>` he papa inoa a he hoʻokahi kēia mau mea kēlā me kēia: { $allowed }
       *[other] Pono ka ʻano `{ $attribute }` o ka element `<{ $tag }>` he hoʻokahi o kēia mau mea: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Inoa variant kūpono ʻole no ka select. Aia ka inoa variant { $variantName } i loko o { $numOptions } option akā ʻo { $numToSelect } ka nui e koho ai.

select-variant-name-without-options = Ua hoʻonoho ʻia kekahi mau variant no ka select akā ʻaʻohe option no ka inoa variant hiki: { $variantName }.

select-variant-name-not-possible = ʻAʻole he inoa variant hiki ka inoa variant { $variantName } i hoʻonoho ʻia no ka select.

select-too-few-options = ʻAʻole hiki ke koho i { $numToSelect } ʻāpana mai { $numOptions } wale nō.

select-from-sequence-too-few-values = ʻAʻole hiki ke koho i { $numToSelect } waiwai mai kahi kaʻina lōʻihi { $length }.

select-from-sequence-indices-count-mismatch = Pono ka nui o nā indices i hoʻonoho ʻia no ka select e like me ka nui e koho ai

select-from-sequence-indices-not-integers = Pono nā indices a pau i hoʻonoho ʻia no ka select he mau helu piha

select-from-sequence-index-excluded = Ua kāpae ʻia ka index i hoʻonoho ʻia no ka selectfromsequence

select-from-sequence-indices-excluded-combination = He hui i kāpae ʻia nā indices i hoʻonoho ʻia no ka selectfromsequence

select-from-sequence-coprime-not-positive-integers = ʻAʻole hiki ke koho i nā hui coprime no ka mea ʻaʻole e koho ʻia ana nā helu piha maikaʻi.

select-from-sequence-coprime-common-factor = ʻAʻole hiki ke koho i nā helu coprime. He mea like ko nā waiwai a pau. (Pono nā waiwai "from" a "to" i hoʻonoho ʻia e coprime me ka "step".)

select-from-sequence-coprime-single-number = ʻAʻole hiki ke koho i nā hui coprime mai kahi helu hoʻokahi ʻaʻole ʻo 1.

select-from-sequence-excluded-too-many-combinations = Ua kāpae ʻia ma mua o 70% o nā hui i loko o ka selectFromSequence

select-from-sequence-coprime-none-found = ʻAʻole hiki ke koho i nā helu coprime. He mea like ko nā waiwai a pau.

select-from-sequence-too-few-unique-values = ʻAʻole hiki ke koho i { $numToSelect } waiwai kūʻokoʻa mai kahi kaʻina lōʻihi { $numPossibleValues }

select-prime-numbers-too-few-values = ʻAʻole hiki ke koho i { $numToSelect } waiwai mai kahi papa inoa helu kumu lōʻihi { $numValues }

select-prime-numbers-values-count-mismatch = Pono ka nui o nā waiwai i hoʻonoho ʻia no ka select e like me ka nui e koho ai

select-prime-numbers-values-not-prime = Pono nā waiwai a pau i hoʻonoho ʻia no ka select helu kumu e waiho i loko o ka papa inoa helu kumu

select-prime-numbers-values-excluded-combination = He hui i kāpae ʻia nā waiwai i hoʻonoho ʻia no ka selectPrimeNumbers

select-prime-numbers-excluded-too-many-combinations = Ua kāpae ʻia ma mua o 70% o nā hui i loko o ka selectPrimeNumbers

select-random-combination-fluke = Ma muli o kahi mea kakaʻikahi loa, ʻaʻole i hiki ke koho i kahi hui o nā waiwai kaulele

select-random-value-fluke = Ma muli o kahi mea kakaʻikahi loa, ʻaʻole i hiki ke koho i kahi waiwai kaulele
