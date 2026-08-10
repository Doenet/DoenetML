# Dzongkha diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# One plural category, so every counted message here is written flat; see
# `content.ftl`'s header, and `locales/bo/content.ftl` for the case-particle
# rule both Tibetan-script catalogs follow. DoenetML element, attribute and
# value names stay in English exactly as written, and so does the
# `[deprecation]` marker.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = མཐའ་ཚག་གཉིས་ཆ་ར་བཀོད་ཡོད་པ་ཅིན་ { $attributes } སྣང་མེད་བཞག

line-segment-attributes-ignored-with-endpoint-and-midpoint = མཐའ་ཚག་དང་དབུས་ཚག་གཉིས་ཆ་ར་བཀོད་ཡོད་པ་ཅིན་ { $attributes } སྣང་མེད་བཞག

line-segment-midpoint-offset-without-midpoint = དབུས་ཚག་མེད་པ་ཅིན་ midpointOffset ལུ་ནུས་པ་མེད

## `<line>`

line-points-undetermined-dimensions = རྒྱ་ཁྱོན་གཏན་འབེབས་མེད་པའི་ཚག་བརྒྱུད་པའི་གྲལ་ཐིག

line-points-too-few-dimensions = གྲལ་ཐིག་འདི་ཉུང་མཐའ་རྒྱ་ཁྱོན་གཉིས་ཡོད་པའི་ཚག་བརྒྱུད་དགོ

line-points-depend-on-variables = གྲལ་ཐིག་འདི་འགྱུར་ཅན་ལུ་བརྟེན་པའི་ཚག་བརྒྱུད་ཡོད། { $variables }

line-equation-invalid-format = འགྱུར་ཅན་ { $variable1 } དང་ { $variable2 } ནང་གྲལ་ཐིག་གི་མཉམ་བྱེད་ཀྱི་རྩ་སྒྲིག་ནོར་བ།

## `<ray>`

ray-overprescribed-through = འོད་ཟེར་འདི་ through དང་ endpoint དང་ direction གསུམ་ཆ་ར་གིས་བཀོད་ཡོད། བཀོད་ཡོད་པའི་ through སྣང་མེད་བཞག

ray-dimension-mismatch = འོད་ཟེར་ནང་ numDimensions མི་མཐུན།

## `<vector>`

vector-overprescribed-head = ཕྱོགས་ཚད་འདི་ head དང་ tail དང་ displacement གསུམ་ཆ་ར་གིས་བཀོད་ཡོད། བཀོད་ཡོད་པའི་ head སྣང་མེད་བཞག

vector-dimension-mismatch = ཕྱོགས་ཚད་ནང་ numDimensions མི་མཐུན།

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ནང་ nearestPoint ཟེར་བའི་གནས་སྟངས་འགྱུར་ཅན་མེད་ནི་དེ་གིས། དེ་ལུ་འགུག་མི་ཚུགས།

constrain-to-without-nearest-point = `<{ $component }>` ནང་ nearestPoint ཟེར་བའི་གནས་སྟངས་འགྱུར་ཅན་མེད་ནི་དེ་གིས། དེ་ལུ་བཀག་ཆ་འབད་མི་ཚུགས།

constrain-to-interior-without-nearest-point = `<{ $component }>` ནང་ nearestPoint ཟེར་བའི་གནས་སྟངས་འགྱུར་ཅན་མེད་ནི་དེ་གིས། དེའི་ནང་ཁར་བཀག་ཆ་འབད་མི་ཚུགས།

## `<choiceInput>`

choice-input-label-position-ignored = ཐིག་ནང་མིན་པའི་ choiceInput ལུ་ labelPosition སྣང་མེད་བཞག

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput ལུ་བཀོད་ཡོད་པའི་ཟུར་ཨང་སྣང་མེད་བཞག ཟུར་ཨང་གི་གྲངས་ཀ་དང་གདམ་ཁའི་ཆ་ལག་གི་གྲངས་ཀ་མི་མཐུན་ནི་དེ་གིས།

pretzel-indices-count-mismatch = problem ལུ་བཀོད་ཡོད་པའི་ཟུར་ཨང་སྣང་མེད་བཞག ཟུར་ཨང་གི་གྲངས་ཀ་དང་ problem ཆ་ལག་གི་གྲངས་ཀ་མི་མཐུན་ནི་དེ་གིས།

shuffle-indices-count-mismatch = shuffle ལུ་བཀོད་ཡོད་པའི་ཟུར་ཨང་སྣང་མེད་བཞག ཟུར་ཨང་གི་གྲངས་ཀ་དང་ཡན་ལག་གི་གྲངས་ཀ་མི་མཐུན་ནི་དེ་གིས།

indices-ignored-out-of-range = { $component } ལུ་བཀོད་ཡོད་པའི་ཟུར་ཨང་སྣང་མེད་བཞག ཟུར་ཨང་ལ་ལུ་ཅིག་ཁྱབ་ཚད་ལས་ཕྱི་ཁར་ཡོད་ནི་དེ་གིས།

pretzel-indices-repeated = pretzel ལུ་བཀོད་ཡོད་པའི་ཟུར་ཨང་སྣང་མེད་བཞག ཟུར་ཨང་ལ་ལུ་ཅིག་ལོག་འབྱུང་ཡོད་ནི་དེ་གིས།

pretzel-circuit-first-index = circuit ཐབས་ལམ་ནང་ pretzel ལུ་བཀོད་ཡོད་པའི་ཟུར་ཨང་སྣང་མེད་བཞག ཟུར་ཨང་དང་པམ་འདི་ 1 ཨིན་དགོ་ནི་དེ་གིས།

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` འདི་ཡིག་ཕྲེང་ཆ་ལག་དང་གཅིག་ཁར་ལཱ་འབད་ནི་ལུ་ `type` ཁྱད་ཆོས་བཀོད་དགོ

invalid-type-defaulting-to-math = { $component } ཡན་ལག་ལུ་ { $type } དབྱེ་བ་ནོར་བ། math, text, number, boolean ནང་ལས་གཅིག་ཨིན་དགོ སྔོན་སྒྲིག་སྦེ་ math བླངས་ཡི།

string-not-valid-component-to-arrange = ཡིག་ཕྲེང་ "{ $value }" འདི་ { $component } ལུ་ཆོག་པའི་ཡན་ལག་མེན། སྣང་མེད་བཞག

## Types and variables

invalid-type-defaulting-to-number = { $type } དབྱེ་བ་ནོར་བ། དབྱེ་བ་ number ལུ་བསྒྱུར་ཡི།

invalid-variable-value = འགྱུར་ཅན་གྱི་བེ་ལུ་ནོར་བ། `{ $value }`

## Variants

variant-index-must-be-number = རིགས་ཀྱི་ཟུར་ཨང་ { $index } གྲངས་ཀ་ཅིག་ཨིན་དགོ

variant-index-must-be-integer = རིགས་ཀྱི་ཟུར་ཨང་ { $index } ཧྲིལ་གྲངས་ཅིག་ཨིན་དགོ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` འདི་ཐད་ཀར་ཚད་ལུ་བཟོ་བཟོཝ་མེན། རྒྱ་ཚད་ལྟོས་བཅས་སུ་བསྒྱུར་ཡི།

side-by-side-absolute-margins = `<{ $component }>` འདི་ཐད་ཀར་ཚད་ལུ་བཟོ་བཟོཝ་མེན། མཐའ་སྟོང་ལྟོས་བཅས་སུ་བསྒྱུར་ཡི།

side-by-side-no-block-child = `<{ $component }>` ནོར་བ། འདི་ནང་ཉུང་མཐའ་སྒྲོམ་གྱི་ཆ་ལག་གཅིག་ཡོད་དགོ

## `<label>`

label-for-ignored-on-graphical = པར་རིས་ཀྱི་ `<label>` གུ་ `for` ཁྱད་ཆོས་སྣང་མེད་བཞག

label-for-must-resolve-to-one = `<label>` གུ་གི་ `for` ཁྱད་ཆོས་ཀྱིས་ཡན་ལག་གཅིག་རྐྱངམ་ཅིག་སྟོན་དགོ

label-for-unresolved = `<label>` གུ་གི་ `for` ཁྱད་ཆོས་ཀྱིས་ཡན་ལག་ག་ནི་ཡང་སྟོན་མ་ཚུགས།

label-for-answer-with-authored-inputs = `<label>` གུ་གི་ `for` ཁྱད་ཆོས་ཀྱིས་རྩོམ་པ་པོ་གིས་རང་གིས་བཙུགས་སྤྱོད་བྲིས་ཡོད་པའི་ `<answer>` སྟོནམ་ཨིན། བཙུགས་སྤྱོད་ཐད་ཀར་སྟོན་གནང་།

label-for-answer-without-input = `<label>` གུ་གི་ `for` ཁྱད་ཆོས་ཀྱིས་ཁ་ཡིག་བཀལ་ཚུགས་པའི་བཙུགས་སྤྱོད་མེད་པའི་ `<answer>` སྟོནམ་ཨིན།

label-for-must-reference-input-or-answer = `<label>` གུ་གི་ `for` ཁྱད་ཆོས་ཀྱིས་བཙུགས་སྤྱོད་ཅིག་གམ་ལན་ཅིག་སྟོན་དགོ

## Accessibility

accessibility-short-description-or-decorative = འཛུལ་སྤྱོད་ཀྱི་དོན་ལུ་ `<{ $component }>` ལུ་འགྲེལ་བཤད་ཐུང་ཀུ་ཅིག་ཡོད་དགོ ཡང་ན་ decorative ཟེར་བཀོད་དགོ

accessibility-video-short-description = འཛུལ་སྤྱོད་ཀྱི་དོན་ལུ་ `<video>` ལུ་འགྲེལ་བཤད་ཐུང་ཀུ་ཅིག་ཡོད་དགོ

accessibility-input-short-description-or-label = འཛུལ་སྤྱོད་ཀྱི་དོན་ལུ་ `<{ $component }>` ལུ་འགྲེལ་བཤད་ཐུང་ཀུ་ཅིག་གམ་ཁ་ཡིག་ཅིག་ཡོད་དགོ

accessibility-answer-input-short-description-or-label = འཛུལ་སྤྱོད་ཀྱི་དོན་ལུ་བཙུགས་སྤྱོད་བཟོ་མི་ `<answer>` ལུ་འགྲེལ་བཤད་ཐུང་ཀུ་ཅིག་གམ་ཁ་ཡིག་ཅིག་ཡོད་དགོ

accessibility-short-description-contains-math = འགྲེལ་བཤད་ཐུང་ཀུའི་ནང་ `<{ $component }>` བཟུམ་གྱི་ཨང་རྩིས་ཡན་ལག་ཡོད་མི་ཆོག ཨང་རྩིས་འདི་ཚིག་གིས་བྲིས་གནང་།

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] དབྱེ་ཚན་གྱི་མགོ་མིང་ཚིག་ཡིག་ལུ་ { $colorName } གི་ཁྱད་པར་ལངམ་མིན་འདུག ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ཉུང་མཐའ་ { $threshold }:1 དགོ) (གནག་ཐབས)།
       *[other] དབྱེ་ཚན་གྱི་མགོ་མིང་ཚིག་ཡིག་ལུ་ { $colorName } གི་ཁྱད་པར་ལངམ་མིན་འདུག ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ཉུང་མཐའ་ { $threshold }:1 དགོ)།
    }

## `<circle>`

circle-through-points-non-numerical = ཚག་ལུ་གྲངས་ཀའི་བེ་ལུ་མེད་པའི་སྐབས་ཚག་ { $count } བརྒྱུད་པའི་ `<circle>` ད་ཚུན་བཟོ་བཟོཝ་མེན།

circle-too-many-through-points = ཚག་གསུམ་ལས་མང་བ་བརྒྱུད་པའི་སྒོར་ཐིག་རྩིས་མི་ཚུགས།

circle-overprescribed-radius-center-points = བཀོད་ཡོད་པའི་ཟུར་ཐིག་དང་ལྟེ་བ་དང་ཚག་གསུམ་ཆ་ར་དང་གཅིག་ཁར་སྒོར་ཐིག་རྩིས་མི་ཚུགས།

circle-center-with-multiple-points = བཀོད་ཡོད་པའི་ལྟེ་བ་དང་གཅིག་ཁར་ཚག་གཅིག་ལས་མང་བ་བརྒྱུད་པའི་སྒོར་ཐིག་རྩིས་མི་ཚུགས།

circle-radius-too-small = སྒོར་ཐིག་རྩིས་མི་ཚུགས། ཚག་གཉིས་ཀྱི་བར་ན་རྒྱང་ཚད་ { $distance } ཨིན་ནི་དེ་གིས། བཀོད་ཡོད་པའི་ཟུར་ཐིག་ { $radius } ཧ་ཅང་ཆུང་ཀུ།

circle-radius-with-many-points = བཀོད་ཡོད་པའི་ཟུར་ཐིག་དང་གཅིག་ཁར་ཚག་གཉིས་ལས་མང་བ་བརྒྱུད་པའི་སྒོར་ཐིག་བཟོ་མི་ཚུགས།

circle-invalid-center-or-through-points = སྒོར་ཐིག་གི་ལྟེ་བའམ་ཚག་ནོར་བ།

circle-radius-center-with-multiple-points = བཀོད་ཡོད་པའི་ལྟེ་བ་དང་གཅིག་ཁར་ཚག་གཅིག་ལས་མང་བ་བརྒྱུད་པའི་སྒོར་ཐིག་གི་ཟུར་ཐིག་རྩིས་མི་ཚུགས།

circle-change-radius-non-numerical = གྲངས་ཀ་མེན་པའི་ཚག་བརྒྱུད་པའི་སྒོར་ཐིག་གི་ཟུར་ཐིག་སོར་མི་ཚུགས

circle-radius-with-points-non-numerical = གྲངས་ཀའི་བེ་ལུ་མེད་པ་ཅིན། བཀོད་ཡོད་པའི་ཟུར་ཐིག་དང་གཅིག་ཁར་ཚག་གཅིག་ལས་མང་བ་བརྒྱུད་པའི་སྒོར་ཐིག་བཟོ་མི་ཚུགས།

circle-change-center-non-numerical = གྲངས་ཀ་མེན་པའི་བེ་ལུ་གི་ཚག་བརྒྱུད་པའི་སྒོར་ཐིག་གི་ལྟེ་བ་སོར་ནི་ད་ཚུན་བཟོ་བཟོཝ་མེན།

## `<function>`

function-domain-insufficient-dimensions = བྱེད་ལས་ཀྱི་ཁྱབ་ཁོངས་ལུ་རྒྱ་ཁྱོན་ལངམ་མིན་འདུག ཁྱབ་ཁོངས་ནང་བར་མཚམས་ { $intervals } ཡོད་རུང་བྱེད་ལས་ནང་བཙུགས་སྤྱོད་ { $inputs } ཡོད།

function-domain-invalid-format = བྱེད་ལས་ཀྱི་ཁྱབ་ཁོངས་ཀྱི་རྩ་སྒྲིག་ནོར་བ།

function-ignoring-non-numerical =
    { $type ->
        [maximum] བྱེད་ལས་ཀྱི་གྲངས་ཀ་མེན་པའི་མང་ཤོས་སྣང་མེད་བཞག
        [minimum] བྱེད་ལས་ཀྱི་གྲངས་ཀ་མེན་པའི་ཉུང་ཤོས་སྣང་མེད་བཞག
        [extremum] བྱེད་ལས་ཀྱི་གྲངས་ཀ་མེན་པའི་མཐའ་ཚད་སྣང་མེད་བཞག
        [point] བྱེད་ལས་ཀྱི་གྲངས་ཀ་མེན་པའི་ཚག་སྣང་མེད་བཞག
        [slope] བྱེད་ལས་ཀྱི་གྲངས་ཀ་མེན་པའི་གཡོ་ཚད་སྣང་མེད་བཞག
       *[other] བྱེད་ལས་ཀྱི་གྲངས་ཀ་མེན་པའི་ { $type } སྣང་མེད་བཞག
    }

function-ignoring-empty =
    { $type ->
        [maximum] བྱེད་ལས་ཀྱི་སྟོངམ་མང་ཤོས་སྣང་མེད་བཞག
        [minimum] བྱེད་ལས་ཀྱི་སྟོངམ་ཉུང་ཤོས་སྣང་མེད་བཞག
        [extremum] བྱེད་ལས་ཀྱི་སྟོངམ་མཐའ་ཚད་སྣང་མེད་བཞག
        [point] བྱེད་ལས་ཀྱི་སྟོངམ་ཚག་སྣང་མེད་བཞག
       *[other] བྱེད་ལས་ཀྱི་སྟོངམ་ { $type } སྣང་མེད་བཞག
    }

function-points-too-close = བྱེད་ལས་ནང་ཚག་གཉིས་ཧ་ཅང་ཉེ་བར་འདུག བྱེད་ལས་ངོས་འཛིན་འབད་མི་ཚུགས།

function-iterates-input-output-mismatch = བྱེད་ལས་ལོག་བསྐྱར་འབད་ནི་འདི་བཙུགས་སྤྱོད་ཀྱི་གྲངས་ཀ་དང་ཐོན་སྐྱེད་ཀྱི་གྲངས་ཀ་མཉམ་པའི་སྐབས་རྐྱངམ་ཅིག་ཚུགས། བྱེད་ལས་འདི་ནང་བཙུགས་སྤྱོད་ { $inputs } དང་ཐོན་སྐྱེད་ { $outputs } ཡོད།

## `<sequence>`

sequence-invalid-length = གོ་རིམ་གྱི་རིང་ཚད་ནོར་བ། མ་ཉུང་བའི་ཧྲིལ་གྲངས་ཅིག་ཨིན་དགོ

sequence-invalid-step = གོ་རིམ་གྱི་གོམ་པ་ནོར་བ། { $type } དབྱེ་བའི་གོ་རིམ་ལུ་གྲངས་ཀ་ཅིག་ཨིན་དགོ

sequence-invalid-endpoint-number = གྲངས་ཀའི་གོ་རིམ་གྱི་ "{ $attribute }" ནོར་བ། གྲངས་ཀ་ཅིག་ཨིན་དགོ

sequence-invalid-endpoint-letters = ཡིག་འབྲུའི་གོ་རིམ་གྱི་ "{ $attribute }" ནོར་བ། ཡིག་འབྲུའི་སྡེབ་སྦྱོར་ཅིག་ཨིན་དགོ

sequence-invalid-endpoint = གོ་རིམ་གྱི་ "{ $attribute }" ནོར་བ།

select-from-sequence-coprime-not-numbers = གྲངས་ཀ་མི་གདམ་ནི་དེ་གིས་ coprime སྣང་མེད་བཞག

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations བཀོད་ཡོད་ནི་དེ་གིས་ coprime སྣང་མེད་བཞག

## Resolving a `target`

target-not-found = `<{ $source }>` ལུ་དམིགས་གཏད་ནོར་བ། དམིགས་གཏད་མ་ཐོབ།

target-state-variable-not-found = `<{ $source }>` ལུ་དམིགས་གཏད་ནོར་བ། `<{ $component }>` གུ་ "{ $property }" ཟེར་བའི་གནས་སྟངས་འགྱུར་ཅན་མ་ཐོབ།

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` གི་འགྱུར་ཅན་ཚུ་རང་དབང་འགྱུར་ཅན་དང་མ་འདྲཝ་ཨིན་དགོ

ode-system-duplicate-variable-names = ལོག་འབྱུང་ཡོད་པའི་རྟེན་འགྱུར་ཅན་གྱི་མིང་དང་གཅིག་ཁར་ ODE RHS བྱེད་ལས་ངོས་འཛིན་འབད་མི་ཚུགས།

ode-system-rhs-function-error = ODE RHS བྱེད་ལས་ངོས་འཛིན་འབད་མི་ཚུགས། mathjs བྱེད་ལས་བཟོ་ནི་ལུ་འཛོལ་བ།

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = གྲལ་ཐིག་ { $count } གི་བར་ན་ཟུར་ཚད་ངོས་འཛིན་འབད་མི་ཚུགས

angle-invalid-through-point = `<angle>` གི་ through ནང་ཚག་ནོར་བ

parabola-vertex-too-many-points = རྩེ་མོ་དང་གཅིག་ཁར་ཚག་གཅིག་ལས་མང་བ་བརྒྱུད་པའི་པ་ར་བོ་ལ་ད་ཚུན་བཟོ་བཟོཝ་མེན།

parabola-too-many-points = ཚག་གསུམ་ལས་མང་བ་བརྒྱུད་པའི་པ་ར་བོ་ལ་ད་ཚུན་བཟོ་བཟོཝ་མེན།

intersection-too-many-items = རྣམ་གྲངས་གཉིས་ལས་མང་བའི་གཅོད་མཚམས་ད་ཚུན་བཟོ་བཟོཝ་མེན

## Other math components

ionic-compound-not-two-ions = རླུང་རྡུལ་གཉིས་མེན་པའི་གཞན་ལུ་རླུང་རྡུལ་འདུས་རྫས་ད་ཚུན་བཟོ་བཟོཝ་མེན།

ionic-compound-needs-cation-and-anion = རླུང་རྡུལ་འདུས་རྫས་འདི་རླུང་རྡུལ་ཡོད་ཆ་གཅིག་དང་མེད་ཆ་གཅིག་ལུ་རྐྱངམ་ཅིག་བཟོ་བཟོཝ་ཨིན།

solve-equations-cannot-evaluate = མཉམ་བྱེད་ཀྱི་བེ་ལུ་རྩིས་མ་ཚུགས་ནི་དེ་གིས་དེ་སེལ་མི་ཚུགས། { $equation }

math-operators-operand-number-required = ཨང་རྩིས་ཀྱི་བྱེད་རྒྱུ་འདོན་ནི་ལུ་ operandNumber བཀོད་དགོ

eigen-decomposition-failed = དྲྭ་གྲངས་ཀྱི་རང་བེ་ལུ་རྩིས་མ་ཚུགས

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: ཚད་བཟུང་ { $parameters } དཔེ་གཞི་ནང་མིན་འདུག དེ་འབད་ནི་དེ་གིས་དེ་ཨ་རྟག་ར་སྟོངམ་དང་མཐུནམ་ཨིན།

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" གོ་མ་ཚུགས། འདི་ none, medium, dense, ཡང་ན་བར་སྟོང་གིས་སོ་སོར་ཕྱེ་བའི་ཡོད་ཆའི་གྲངས་ཀ་གཉིས་ཨིན་དགོ དཔེར་ན་ grid="1 0.5"། དྲྭ་མིག་ག་ནི་ཡང་མ་བྲིས།

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure སྟོན་བྱེད་ནང་ xLabelPosition="left" མི་ཚུགས། right གི་བྱེད་ཐངས་བླངས་ཡི།

prefigure-y-label-position-unsupported = `<graph>`: prefigure སྟོན་བྱེད་ནང་ yLabelPosition="bottom" མི་ཚུགས། top གི་བྱེད་ཐངས་བླངས་ཡི།

prefigure-invalid-axis-bounds = `<graph>`: prefigure བསྒྱུར་ནི་ལུ་སྲོག་ཤིང་གི་མཐའ་ཚད་ནོར་བ། སྔོན་སྒྲིག་ bbox (-10,-10,10,10) བླངས་ཡི།

prefigure-invalid-width = `<graph>`: prefigure བསྒྱུར་ནི་ལུ་རྒྱ་ཚད་ནོར་བ། སྔོན་སྒྲིག་པར་རིས་ཀྱི་རྒྱ་ཚད་ 425 བླངས་ཡི།

prefigure-invalid-aspect-ratio = `<graph>`: prefigure བསྒྱུར་ནི་ལུ་ aspectRatio ནོར་བ། སྔོན་སྒྲིག་ཚད་འཇལ་ 1 བླངས་ཡི།

prefigure-grid-spacing-too-fine = `<graph>`: སྲོག་ཤིང་གི་མཐའ་ཚད་ལུ་དྲྭ་མིག་གི་བར་ཐག་ཧ་ཅང་ཕྲམ། prefigure སྟོན་བྱེད་ནང་དྲྭ་མིག་བཞག་བཞགཔ།

prefigure-annotations-not-rendered = `<graph>`: PreFigure སྟོན་བྱེད་མ་ལག་ལེན་འཐབ་པ་ཅིན་མཆན་འགྲེལ་མི་བྲི།

multiple-annotations-children = `<graph>` ནང་ `<annotations>` ཆ་ལག་མང་རབས་ཅིག་ཐོབ་ཅི། མཇུག་མམ་མ་གཏོགས་ཆ་མཉམ་སྣང་མེད་བཞག

## Referring to other components

copy-unrecognized-component-type = ངོས་འཛིན་མེད་པའི་ཡན་ལག་གི་དབྱེ་བ་རྒྱ་བསྐྱེད་དམ་འདྲ་བཤུས་འབད་མི་ཚུགས། { $type }

copy-prop-not-found = { $component } དབྱེ་བའི་ཡན་ལག་གུ་ { $property } ཁྱད་ཆོས་མ་ཐོབ

collect-no-source = collect ལུ་འབྱུང་ཁུངས་ག་ནི་ཡང་མ་ཐོབ།

collect-invalid-component-type = `<{ $component }>` དབྱེ་བའི་ཡན་ལག་བསྡུ་མི་ཚུགས། འདི་ཡན་ལག་གི་དབྱེ་བ་ནོར་བ་ཨིན་ནི་དེ་གིས།

reference-index-unavailable = ཟུར་ཨང་ `{ $reference }` ལུ་གཞི་བསྟུན་འབད་མི་ཚུགས

## `<callAction>`

component-action-unavailable = ཡན་ལག་ `{ $reference }` གུ་ { $action } ལག་ལེན་འཐབ་མི་ཚུགས

## `<dataFrame>`

data-frame-inconsistent-row-lengths = གནས་སྡུད་ཀྱི་གཟུགས་ནོར་བ། གྲལ་ཐིག་གི་རིང་ཚད་མི་མཐུན། componentIdx :{ $componentIdx } ནང་ཐོབ་ཅི

data-frame-duplicate-column-names = གནས་སྡུད་ནང་ལོག་འབྱུང་ཡོད་པའི་ཀེར་ཐིག་གི་མིང་འདུག componentIdx :{ $componentIdx } ནང་ཐོབ་ཅི

data-frame-missing-column-name = གནས་སྡུད་ནང་ཀེར་ཐིག་གི་མིང་ཅིག་མིན་འདུག componentIdx :{ $componentIdx } ནང་ཐོབ་ཅི

## `<answer>` and scoring

answer-award-depends-on-own-response = ལན་འདི་གི་ award ཅིག་ answer ཏིག་འདི་རང་གིས་བཏང་བའི་ལན་ལུ་བརྟེན་ཡོད་ནི་དེ་གིས། རེ་བ་མེད་པའི་གྲུབ་འབྲས་འོང་།

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` ཡོད་པའི་སྣོད་ཀྱི་ནང་ན་གི་ `<answer>` གུ་ `maxNumAttempts` བཀོད་རུང་ནུས་པ་མེད། འབད་རྩོལ་གྱི་གྲངས་ཀ་སྣོད་ཀྱིས་ཚད་འཛིན་འབདཝ་ཨིན་ནི་དེ་གིས། `maxNumAttempts` སྣོད་གུ་བཀོད་གནང་།

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` སྣོད་གཞན་ཅིག་གི་ནང་ན་གི་ `sectionWideCheckWork` སྣོད་གུ་ `maxNumAttempts` བཀོད་རུང་ནུས་པ་མེད། འབད་རྩོལ་གྱི་གྲངས་ཀ་ཕྱི་ཁའི་སྣོད་ཀྱིས་ཚད་འཛིན་འབདཝ་ཨིན་ནི་དེ་གིས། `maxNumAttempts` ཕྱི་ཁའི་སྣོད་གུ་བཀོད་གནང་།

answer-attributes-need-symbolic-equality = symbolicEquality མེད་པ་ཅིན་ { $attributes } ཁྱད་ཆོས་ལུ་ནུས་པ་མི་འབྱུང་།

answer-invalid-type = ལན་ལུ་དབྱེ་བ་ནོར་བ། { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` ཡན་ལག་ལུ་མིང་མེད་ནི་དེ་གིས། འདི་ module གི་ཁྱད་ཆོས་སྦེ་ལག་ལེན་འཐབ་མི་ཚུགས

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` ཡན་ལག་འདི་ module གི་ཁྱད་ཆོས་སྦེ་ལག་ལེན་འཐབ་མི་ཚུགས། `<module>` ཡན་ལག་གི་དབྱེ་བ་ནང་ "{ $name }" ཁྱད་ཆོས་ཧེ་མ་ལས་ངོས་འཛིན་འབད་དེ་ཡོད་ནི་དེ་གིས།

conditional-content-condition-ignored = case ཡང་ན་ else ཆ་ལག་ཡོད་པའི་ `<conditionalContent>` ཡན་ལག་གུ་ `condition` ཁྱད་ཆོས་སྣང་མེད་བཞག

slider-markers-type-mismatch = རྟགས་ཀྱི་དབྱེ་བ་དང་ slider གི་དབྱེ་བ་མི་མཐུན།

pretzel-problem-needs-statement-and-answer = pretzel ནོར་བ། `<problem>` རེ་རེའི་ནང་ `<statement>` གཅིག་དང་ `<answer>` གཅིག་ཡོད་དགོ

pretzel-circuit-first-problem-distractor = pretzel ནོར་བ། mode="circuit" ནང་ `<problem>` དང་པམ་འདི་གཡོ་སློང་ཅིག་ཨིན་མི་ཆོག

## Attribute values

attribute-invalid-values = `{ $attribute }` ཁྱད་ཆོས་ལུ་བེ་ལུ་ནོར་བ་ { $values }། སྣང་མེད་བཞག

attribute-must-be-references = `{ $attribute }` ཁྱད་ཆོས་ལུ་ `{ $value }` འདི་བེ་ལུ་ནོར་བ་ཨིན། ཁྱད་ཆོས་འདི་ `$` ལས་འགོ་བཙུགས་པའི་གཞི་བསྟུན་གྱིས་གྲུབ་དགོ

math-input-invalid-function-names = <mathInput>: { $attribute } ནང་བྱེད་ལས་ཀྱི་མིང་ནོར་བ་སྣང་མེད་བཞག { $names }། མིང་རེ་རེའི་སྟོན་ཆའི་ནང་ཉུང་མཐའ་ཡིག་འབྲུ་གཉིས་ (ཡིག་འབྲུའམ་ཐིག་རྟགས) ཡོད་དགོ དེའི་ཤུལ་ལས་ `|<mathspeak alternative>` བཙུགས་ཆོག

## Building components from the source

component-type-invalid = ཡན་ལག་གི་དབྱེ་བ་ནོར་བ། `<{ $componentType }>`

attribute-repeated = ཁྱད་ཆོས་ { $attribute } ལོག་བཀོད་མི་ཆོག

attribute-invalid-for-component = `<{ $componentType }>` དབྱེ་བའི་ཡན་ལག་ལུ་ "{ $attribute }" ཁྱད་ཆོས་ནོར་བ།

## Style definition contrast

style-definition-insufficient-contrast =
    བཟོ་རྣམ་གྱི་ངོས་འཛིན་ { $styleNumber } ནང་ { $context ->
        [text-on-background] རྒྱབ་གཞིའི་ཚོས་གཞི་ལུ་བལྟས་པའི་ཚིག་ཡིག་གི་ཚོས་གཞི
        [high-contrast] ཡོལ་གོའི་སྟེང་ཁྱད་པར་ཆེ་བའི་ཚོས་གཞི
        [line] ཡོལ་གོའི་སྟེང་གྲལ་ཐིག་གི་ཚོས་གཞི
        [marker] ཡོལ་གོའི་སྟེང་རྟགས་ཀྱི་ཚོས་གཞི
       *[text-on-canvas] ཡོལ་གོའི་སྟེང་ཚིག་ཡིག་གི་ཚོས་གཞི
    } གི་ཁྱད་པར་ལངམ་མིན་འདུག{ $mode ->
        [dark] { " (གནག་ཐབས)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ཉུང་མཐའ་ { $threshold }:1 དགོ)།

style-definition-dark-mode-text-background-contrast =
    བཟོ་རྣམ་གྱི་ངོས་འཛིན་ { $styleNumber } ནང་བཀོད་ཡོད་པའི་ཚོས་གཞི་ཚུ་གིས་དཀར་ཐབས་ལུ་ཁྱད་པར་ལངམ་སྦེ་སྤྲོད་རུང་། དེ་ཚུ་ལས་བྱུང་བའི་གནག་ཐབས་ཀྱི་ཚོས་གཞི་ནང་རྒྱབ་གཞིའི་ཚོས་གཞི་ལུ་བལྟས་པའི་ཚིག་ཡིག་གི་ཚོས་གཞིའི་ཁྱད་པར་ལངམ་མིན་འདུག ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ཉུང་མཐའ་ { $threshold }:1 དགོ)། { $suggestion ->
        [available] གནག་ཐབས་ནང་ཁྱད་པར་ལངམ་འབད་ནི་ལུ་དཀར་ཐབས་ཀྱི་ཁྱད་པར་ཡར་སེང་འབད་གནང་ (དཔེར་ན་ { $lightAttribute }="{ $lightColor }")། ཡང་ན་གནག་ཐབས་ཀྱི་ཚོས་གཞི་རང་གིས་བཀོད་གནང་ (དཔེར་ན་ { $darkAttribute }="{ $darkColor }")།
       *[none] གནག་ཐབས་ནང་ཁྱད་པར་ལངམ་འབད་ནི་ལུ་དཀར་ཐབས་ཀྱི་ཁྱད་པར་ཡར་སེང་འབད་གནང་། ཡང་ན་བྱུང་བའི་ཚོས་གཞི་ textColorDarkMode དང་ཡང་ན་ backgroundColorDarkMode གིས་རང་གིས་བཀོད་གནང་།
    }

style-definition-dark-mode-text-canvas-contrast =
    བཟོ་རྣམ་གྱི་ངོས་འཛིན་ { $styleNumber } ནང་བཀོད་ཡོད་པའི་ཚིག་ཡིག་གི་ཚོས་གཞི་གིས་དཀར་ཐབས་ལུ་ཁྱད་པར་ལངམ་སྦེ་སྤྲོད་རུང་། དེ་ལས་བྱུང་བའི་གནག་ཐབས་ཀྱི་ཚིག་ཡིག་གི་ཚོས་གཞི་ལུ་ཡོལ་གོའི་སྟེང་ཁྱད་པར་ལངམ་མིན་འདུག ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ཉུང་མཐའ་ { $threshold }:1 དགོ)། { $suggestion ->
        [available] གནག་ཐབས་ནང་ཁྱད་པར་ལངམ་འབད་ནི་ལུ་དཀར་ཐབས་ཀྱི་ཁྱད་པར་ཡར་སེང་འབད་གནང་ (དཔེར་ན་ textColor="{ $lightColor }")། ཡང་ན་གནག་ཐབས་ཀྱི་ཚོས་གཞི་རང་གིས་བཀོད་གནང་ (དཔེར་ན་ textColorDarkMode="{ $darkColor }")།
       *[none] གནག་ཐབས་ནང་ཁྱད་པར་ལངམ་འབད་ནི་ལུ་དཀར་ཐབས་ཀྱི་ཁྱད་པར་ཡར་སེང་འབད་གནང་། ཡང་ན་བྱུང་བའི་ཚོས་གཞི་ textColorDarkMode གིས་རང་གིས་བཀོད་གནང་།
    }

section-multiple-style-palettes = དབྱེ་ཚན་གཅིག་གིས་ <stylePalette> གཅིག་རྐྱངམ་ཅིག་གདམ་ཚུགས། མཇུག་མམ་བླངས་ཡི།

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } གི་རིགས་མི་འདྲཝ་ངོས་འཛིན་འབད་མི་ཚུགས། numToSelect འདི་མ་ཉུང་བའི་ཧྲིལ་གྲངས་མེན་ནི་དེ་གིས།

variant-num-to-select-not-constant-number = { $component } གི་རིགས་མི་འདྲཝ་ངོས་འཛིན་འབད་མི་ཚུགས། numToSelect འདི་བརྟན་པའི་གྲངས་ཀ་མེན་ནི་དེ་གིས།

variant-with-replacement-not-constant-boolean = { $component } གི་རིགས་མི་འདྲཝ་ངོས་འཛིན་འབད་མི་ཚུགས། withReplacement འདི་བརྟན་པའི་བུ་ལིན་མེན་ནི་དེ་གིས།

variant-select-weight-disables-unique = གདམ་ཁ་ཅིག་ལུ་ selectWeight ཡང་ན་ selectForVariants བཀོད་ཡོད་པ་ཅིན་ select གྱི་རིགས་མི་འདྲཝ་བཀག

variant-coprime-undetermined = { $component } གི་རིགས་མི་འདྲཝ་ངོས་འཛིན་འབད་མི་ཚུགས། coprime འདི་ཨ་རྟག་ར་རྫུན་པ་ཨིན་ན་མེན་ན་གཏན་འབེབས་འབད་མ་ཚུགས་ནི་དེ་གིས།

variant-attribute-not-constant = { $component } གི་རིགས་མི་འདྲཝ་ངོས་འཛིན་འབད་མི་ཚུགས། { $attribute } བརྟནམ་མེན་ནི་དེ་གིས།

variant-attribute-not-number = { $component } གི་རིགས་མི་འདྲཝ་ངོས་འཛིན་འབད་མི་ཚུགས། { $attribute } གྲངས་ཀ་མེན་ནི་དེ་གིས།

variant-attribute-wrong-type-for-sequence =
    { $type } དབྱེ་བའི་ { $component } གི་རིགས་མི་འདྲཝ་ངོས་འཛིན་འབད་མི་ཚུགས། { $attribute } འདི་{ $expected ->
        [letters-combination] ཡིག་འབྲུའི་སྡེབ་སྦྱོར
        [math-expression] ཆོག་པའི་ཨང་རྩིས་བརྗོད་པ
        [integer] ཧྲིལ་གྲངས
       *[number] གྲངས་ཀ
    } མེན་ནི་དེ་གིས།

variant-length-not-integer = { $component } གི་རིགས་མི་འདྲཝ་ངོས་འཛིན་འབད་མི་ཚུགས། length ཧྲིལ་གྲངས་མེན་ནི་དེ་གིས།

variant-sort-not-implemented = sort ཡོད་པའི་ { $component } གི་རིགས་མི་འདྲཝ་ད་ཚུན་བཟོ་བཟོཝ་མེན

variant-exclude-combinations-not-implemented = excludeCombinations ཡོད་པའི་ { $component } གི་རིགས་མི་འདྲཝ་ད་ཚུན་བཟོ་བཟོཝ་མེན

variant-math-exclude-not-implemented = exclude ཡོད་པའི་ math དབྱེ་བའི་ { $component } གི་རིགས་མི་འདྲཝ་ད་ཚུན་བཟོ་བཟོཝ་མེན

variant-non-constant-exclude-not-implemented = མ་བརྟན་པའི་ exclude ཡོད་པའི་ { $component } གི་རིགས་མི་འདྲཝ་ད་ཚུན་བཟོ་བཟོཝ་མེན

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure སྟོན་བྱེད་ནང་མི་ཚུགས། རྒྱུད་འཛིན་བཞག

prefigure-descendant-invalid-geometry = { $subject }: མཐའ་མེད་དམ་མ་ཚང་བའི་དབྱིབས་རྩིས། རྒྱུད་འཛིན་བཞག

prefigure-curve-label-omitted = { $subject }: བསྒྱུར་ཚར་བའི་གུག་ཐིག་གི་ཡན་ལག་གུ་ཁ་ཡིག་མི་ཚུགས། ཁ་ཡིག་བཞག

prefigure-curve-unsupported-definition-type = { $subject }: གུག་ཐིག་གི་བྱེད་ལས་ངོས་འཛིན་གྱི་དབྱེ་བ་ '{ $definitionType }' མི་ཚུགས། རྒྱུད་འཛིན་བཞག

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves གུ་ flipFunctions ཁྱད་ཆོས་མི་ཚུགས། རྒྱུད་འཛིན་བཞག

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves གུ་ formula དབྱེ་བའི་ཆ་ལག་གི་བྱེད་ལས་རྐྱངམ་ཅིག་ཚུགས། རྒྱུད་འཛིན་བཞག

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] གྲལ་ཐིག་རིགས་ཀྱི་ཁ་ཡིག་
       *[point] ཚག་གི་ཁ་ཡིག་
    } ལུ་ labelPosition '{ $labelPosition }' མི་ཚུགས། སྔོན་སྒྲིག་ PreFigure གཤིབ་སྒྲིག་བླངས་ཡི།

prefigure-fill-style-unsupported = { $subject }: བཀང་ལུགས་ '{ $fillStyle }' PreFigure ནང་མི་ཚུགས། རྒྱུན་ལྡན་བཀང་ལུགས་བླངས་ཡི།

prefigure-line-style-unknown = { $subject }: ངོས་འཛིན་མེད་པའི་གྲལ་ཐིག་ལུགས་ '{ $lineStyle }' PreFigure ཐོན་སྐྱེད་ནང་ལས་བཞག

prefigure-marker-style-mapped-to-diamond = { $subject }: རྟགས་ཀྱི་ལུགས་ '{ $markerStyle }' PreFigure གི་ 'diamond' ལུགས་སུ་བསྒྱུར་ཡི།

prefigure-marker-style-unsupported = { $subject }: རྟགས་ཀྱི་ལུགས་ '{ $markerStyle }' PreFigure ནང་མི་ཚུགས། སྔོན་སྒྲིག་ལུགས་བླངས་ཡི།

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ནོར་བ། དམིགས་གཏད་མ་ཐོབ། མཆན་འགྲེལ་བཞག

annotation-ref-multiple-targets = `<annotation>`: `ref` ལས་དམིགས་གཏད་མང་རབས་ཅིག་ཐོབ་ཅི། དམིགས་གཏད་དང་པམ་བླངས་ཡི།

annotation-ref-outside-graph = `<annotation>`: `ref` ནོར་བ། དམིགས་གཏད་འདི་ graph དེའི་ཕྱི་ཁར་འདུག མཆན་འགྲེལ་བཞག

annotation-ref-unsupported-target = `<annotation>`: `ref` ནོར་བ། prefigure བསྒྱུར་ནི་ནང་དམིགས་གཏད་འདི་ཚུགས་པའི་པར་རིས་ཀྱི་རྣམ་གྲངས་མེན། མཆན་འགྲེལ་བཞག

annotation-text-missing = `<annotation>`: `text` མིན་འདུག ཡང་ན་སྟོངམ་ཨིན། ཚིག་ཡིག་སྟོངམ་བཏང་ཡི།

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] འཁོར་བའི་བརྟེན་ཐངས་ཐོབ་ཅི།
       *[other] `<{ $componentType }>` ཡན་ལག་དང་འབྲེལ་བའི་འཁོར་བའི་བརྟེན་ཐངས་ཐོབ་ཅི།
    }

reference-no-referent = གཞི་བསྟུན་གྱི་དམིགས་གཏད་མ་ཐོབ། `{ $reference }`

reference-multiple-referents = གཞི་བསྟུན་གྱི་དམིགས་གཏད་མང་རབས་ཅིག་ཐོབ་ཅི། `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` གི་ { $attribute } ཁྱད་ཆོས་ཀྱི་རྩ་སྒྲིག་ནོར་བ།

children-invalid = `<{ $componentType }>` ལུ་ཆ་ལག་ནོར་བ། ཆ་ལག་ནོར་བ་ཐོབ་ཅི། { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` ཁྱད་ཆོས་ལུ་ `{ $value }` བེ་ལུ་ནོར་བ། `{ $default }` བེ་ལུ་བླངས་ཡི

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML ཐོན་རིམ་ { $version } མ་ཐོབ།
       *[other] DoenetML ཐོན་རིམ་ { $version } མ་ཐོབ། ཐོན་རིམ་ { $fallback } བླངས་ཡི
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ནོར་བ། { $content }

parse-tag-missing-close-tag = DoenetML ནོར་བ། ཏིག་ `{ $tag }` ལུ་ཁ་བསྡམ་ཏིག་མིན་འདུག རང་ཁ་བསྡམ་ཏིག་ཅིག་གམ་ `</{ $tagName }>` ཏིག་དགོ

parse-tag-error = DoenetML ནོར་བ། ཏིག་ `<{ $tagName }>` ནང་འཛོལ་བ

parse-attribute-missing-value = DoenetML ནོར་བ། ཁྱད་ཆོས་ནོར་བ་ `{ $attribute }` ལུ་བེ་ལུ་མེད་པར་འདུག

parse-attribute-invalid = DoenetML ནོར་བ། ཁྱད་ཆོས་ནོར་བ་ `{ $attribute }`

parse-attribute-value-invalid = DoenetML ནོར་བ། ཁྱད་ཆོས་ཀྱི་བེ་ལུ་ནོར་བ་ `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML ནོར་བ། ཁྱད་ཆོས་ཀྱི་བེ་ལུ་ནོར་བ་ `{ $value }`། འདྲེན་རྟགས་མི་མཐུན། `{ $quote }` ཆད་པར་འདུག

parse-open-tag-name-missing = DoenetML ནོར་བ། ཏིག་གི་མིང་མེད་པའི་ཏིག་ཅིག་ཐོབ་ཅི། དཔེར་ན་ `<`

parse-tag-not-closed = DoenetML ནོར་བ། ཏིག་ `{ $tag }` ཁ་མ་བསྡམས་ (`>` ཆད་པར་འདུག)།

parse-self-closing-tag-name-missing = DoenetML ནོར་བ། ཏིག་གི་མིང་མེད་པའི་ཏིག་ཅིག་ཐོབ་ཅི་ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ནོར་བ། ཏིག་ `{ $tag }` ཁ་མ་བསྡམས་ (`/>` ཆད་པར་འདུག)།

parse-tag-invalid-attributes = DoenetML ནོར་བ། ཏིག་ `{ $tag }` ཆོགཔ་མེན། དེའི་ཁྱད་ཆོས་ནོར་བ་འོང་སྲིད།

parse-close-tag-name-missing = DoenetML ནོར་བ། ཏིག་གི་མིང་མེད་པའི་ཁ་བསྡམ་ཏིག་ཅིག་ཐོབ་ཅི། དཔེར་ན་ `</`

parse-attribute-value-unquoted = ཁྱད་ཆོས་ཀྱི་བེ་ལུ་འདྲེན་རྟགས་ནང་བཞག་དགོ `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ནོར་བ། ཁ་བསྡམ་ཏིག་ `{ $tag }` ཐོབ་ཅི། དེ་འབདཝ་ད་དེ་དང་མཐུན་པའི་ཁ་ཕྱེ་ཏིག་མིན་འདུག

parse-close-tag-mismatched = DoenetML ནོར་བ། ཁ་བསྡམ་ཏིག་མི་མཐུན། `</{ $expected }>` དགོ `{ $found }` ཐོབ་ཅི

parser-node-unconvertible = ཚིགས་ { $node } Dast ཚིགས་སུ་བསྒྱུར་མ་ཚུགས།

## Names

name-attribute-invalid =
    ཁྱད་ཆོས་ནོར་བ་ name='{ $name }'། { $reason ->
        [characters] མིང་ནང་ཡིག་འབྲུ་དང་གྲངས་ཀ་དང་འོག་ཐིག་གམ་ཐིག་རྟགས་རྐྱངམ་ཅིག་ཡོད་ཆོག
       *[start] མིང་འདི་ཡིག་འབྲུ་ཅིག་ལས་འགོ་བཙུགས་དགོ
    }

component-name-invalid-start = ཡན་ལག་གི་མིང་ནོར་བ་ "{ $name }"། མིང་འདི་ཡིག་འབྲུ་ཅིག་ལས་འགོ་བཙུགས་དགོ

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched དབྱེ་བའི་ལན་ལུ་ video ཁྱད་ཆོས་ཡོད་དགོ

answer-video-watched-video-not-reference = videoWatched དབྱེ་བའི་ལན་གྱི་ video ཁྱད་ཆོས་འདི་གཞི་བསྟུན་ཅིག་ཨིན་དགོ

answer-name-not-single-text = ལན་གྱི་ name ཁྱད་ཆོས་ལུ་ཚིག་ཡིག་གི་ཆ་ལག་གཅིག་རྐྱངམ་ཅིག་ཡོད་དགོ

## Referencing another document

external-doenetml-recursion-limit = གནས་རིམ་ཧ་ཅང་མང་བའི་ལོག་འཁོར་གྱིས་ཕྱི་ཁའི་ DoenetML ལེན་མ་ཚུགས། འཁོར་བའི་གཞི་བསྟུན་ཅིག་འདུག་ག

external-doenetml-unavailable = { $attribute }="{ $uri }" ལས་ DoenetML ལེན་མ་ཚུགས

external-doenetml-type-mismatch = { $attribute }="{ $uri }" ལས་བླངས་པའི་ DoenetML ནོར་བ། འདི་ "{ $componentType }" ཡན་ལག་གི་དབྱེ་བ་དང་མི་མཐུན

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ཁྱད་ཆོས་ `{ $from }` བཞག་ཡི། དེའི་ཚབ་ལུ་ `{ $to }` ལག་ལེན་འཐབ་གནང་།
       *[other] [deprecation] `<{ $component }>` གུ་ཁྱད་ཆོས་ `{ $from }` བཞག་ཡི། དེའི་ཚབ་ལུ་ `{ $to }` ལག་ལེན་འཐབ་གནང་།
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] ཁྱད་ཆོས་ `{ $from }` བཞག་ཞིནམ་ལས་སྣང་མེད་བཞག `{ $to }` ཡང་བཀོད་ཡོད་ནི་དེ་གིས།
       *[other] [deprecation] `<{ $component }>` གུ་ཁྱད་ཆོས་ `{ $from }` བཞག་ཞིནམ་ལས་སྣང་མེད་བཞག `{ $to }` ཡང་བཀོད་ཡོད་ནི་དེ་གིས།
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` གུ་ཁྱད་ཆོས་ `{ $attribute }` བཞག་ཞིནམ་ལས་སྣང་མེད་བཞག

deprecated-attribute-to-child = [deprecation] `<{ $component }>` གུ་ཁྱད་ཆོས་ `{ $attribute }` བཞག་ཡི། དེའི་ཚབ་ལུ་ `<{ $child }>` ཆ་ལག་ལག་ལེན་འཐབ་གནང་།

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` གུ་ཁྱད་ཆོས་ `{ $attribute }` གི་བེ་ལུ་ `{ $value }` བཞག་ཡི། དེའི་ཚབ་ལུ་ `{ $to }` ལག་ལེན་འཐབ་གནང་།


## Language coverage

pluralize-english-only = `<pluralize>` གིས་ཨིང་ལིཤ་ཀྱི་མང་ཚིག་རྐྱངམ་ཅིག་བཟོ་ཚུགས་ནི་དེ་གིས། { $locale } ནང་བྲིས་པའི་ཡིག་ཆའི་ནང་དེའི་ཚིག་ཡིག་མ་སོར་བར་སྡོདཔ་ཨིན། མང་ཚིག་གི་རྣམ་པ་ཐད་ཀར་བྲིས་གནང་། ཡང་ན་ `pluralForm` ཁྱད་ཆོས་ཀྱིས་བཀོད་གནང་།


## Checking against the schema

schema-element-unrecognized = ཡན་ལག་ `<{ $tag }>` འདི་ངོས་འཛིན་ཡོད་པའི་ Doenet ཡན་ལག་མེན།

schema-element-not-allowed-at-root = ཡན་ལག་ `<{ $tag }>` ཡིག་ཆའི་རྩ་བ་ལུ་མི་ཆོག

schema-element-not-allowed-inside = ཡན་ལག་ `<{ $tag }>` `<{ $parent }>` གི་ནང་ན་མི་ཆོག

schema-attribute-unrecognized = ཡན་ལག་ `<{ $tag }>` ལུ་ `{ $attribute }` ཟེར་བའི་ཁྱད་ཆོས་མིན་འདུག

schema-attribute-value-not-allowed =
    { $isList ->
        [true] ཡན་ལག་ `<{ $tag }>` གི་ `{ $attribute }` ཁྱད་ཆོས་འདི་རྣམ་གྲངས་རེ་རེ་འདི་ཚུ་ནང་ལས་གཅིག་ཨིན་པའི་ཐོ་ཡིག་ཅིག་ཨིན་དགོ { $allowed }
       *[other] ཡན་ལག་ `<{ $tag }>` གི་ `{ $attribute }` ཁྱད་ཆོས་འདི་ཚུ་ནང་ལས་གཅིག་ཨིན་དགོ { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ལུ་རིགས་ཀྱི་མིང་ནོར་བ། རིགས་ཀྱི་མིང་ { $variantName } འདི་གདམ་ཁ་ { $numOptions } ནང་འབྱུང་རུང་གདམ་དགོ་པའི་གྲངས་ཀ་ { $numToSelect } ཨིན།

select-variant-name-without-options = select ལུ་རིགས་ལ་ལུ་ཅིག་བཀོད་ཡོད་རུང་འབྱུང་སྲིད་པའི་རིགས་ཀྱི་མིང་ { $variantName } ལུ་གདམ་ཁ་ག་ནི་ཡང་མ་བཀོད།

select-variant-name-not-possible = select ལུ་བཀོད་ཡོད་པའི་རིགས་ཀྱི་མིང་ { $variantName } འདི་འབྱུང་སྲིད་པའི་རིགས་ཀྱི་མིང་མེན།

select-too-few-options = { $numOptions } རྐྱངམ་ཅིག་ནང་ལས་ཡན་ལག་ { $numToSelect } གདམ་མི་ཚུགས།

select-from-sequence-too-few-values = རིང་ཚད་ { $length } ཡོད་པའི་གོ་རིམ་ནང་ལས་བེ་ལུ་ { $numToSelect } གདམ་མི་ཚུགས།

select-from-sequence-indices-count-mismatch = select ལུ་བཀོད་ཡོད་པའི་ཟུར་ཨང་གི་གྲངས་ཀ་དང་གདམ་དགོ་པའི་གྲངས་ཀ་མཐུན་དགོ

select-from-sequence-indices-not-integers = select ལུ་བཀོད་ཡོད་པའི་ཟུར་ཨང་ཆ་མཉམ་ཧྲིལ་གྲངས་ཨིན་དགོ

select-from-sequence-index-excluded = selectfromsequence གི་བཀོད་ཡོད་པའི་ཟུར་ཨང་འདི་ཕྱིར་བཏོན་འབད་ཡོདཔ་ཨིན

select-from-sequence-indices-excluded-combination = selectfromsequence གི་བཀོད་ཡོད་པའི་ཟུར་ཨང་འདི་ཕྱིར་བཏོན་འབད་ཡོད་པའི་སྡེབ་སྦྱོར་ཅིག་ཨིན

select-from-sequence-coprime-not-positive-integers = ཡོད་ཆའི་ཧྲིལ་གྲངས་མི་གདམ་ནི་དེ་གིས་སོ་སོར་མ་དག་པའི་སྡེབ་སྦྱོར་གདམ་མི་ཚུགས།

select-from-sequence-coprime-common-factor = སོ་སོར་མ་དག་པའི་གྲངས་ཀ་གདམ་མི་ཚུགས། འབྱུང་སྲིད་པའི་བེ་ལུ་ཆ་མཉམ་ལུ་བགོ་རྟགས་མཐུནམ་ཅིག་འདུག ("from" ཡང་ན་ "to" གི་བཀོད་ཡོད་པའི་བེ་ལུ་འདི་ "step" དང་སོ་སོར་མ་དག་པ་ཨིན་དགོ)

select-from-sequence-coprime-single-number = 1 མེན་པའི་གྲངས་ཀ་གཅིག་རྐྱངམ་ཅིག་ལས་སོ་སོར་མ་དག་པའི་སྡེབ་སྦྱོར་གདམ་མི་ཚུགས།

select-from-sequence-excluded-too-many-combinations = selectFromSequence ནང་སྡེབ་སྦྱོར་གྱི་ 70% ལས་མང་བ་ཕྱིར་བཏོན་འབད་ཡི

select-from-sequence-coprime-none-found = སོ་སོར་མ་དག་པའི་གྲངས་ཀ་གདམ་མ་ཚུགས། འབྱུང་སྲིད་པའི་བེ་ལུ་ཆ་མཉམ་ལུ་བགོ་རྟགས་མཐུནམ་ཅིག་འདུག

select-from-sequence-too-few-unique-values = རིང་ཚད་ { $numPossibleValues } ཡོད་པའི་གོ་རིམ་ནང་ལས་བེ་ལུ་མི་འདྲཝ་ { $numToSelect } གདམ་མི་ཚུགས

select-prime-numbers-too-few-values = རིང་ཚད་ { $numValues } ཡོད་པའི་གཙོ་གྲངས་ཐོ་ཡིག་ནང་ལས་བེ་ལུ་ { $numToSelect } གདམ་མི་ཚུགས

select-prime-numbers-values-count-mismatch = select ལུ་བཀོད་ཡོད་པའི་བེ་ལུ་གི་གྲངས་ཀ་དང་གདམ་དགོ་པའི་གྲངས་ཀ་མཐུན་དགོ

select-prime-numbers-values-not-prime = select prime number ལུ་བཀོད་ཡོད་པའི་བེ་ལུ་ཆ་མཉམ་གཙོ་གྲངས་ཀྱི་ཐོ་ཡིག་ནང་ཡོད་དགོ

select-prime-numbers-values-excluded-combination = selectPrimeNumbers གི་བཀོད་ཡོད་པའི་བེ་ལུ་འདི་ཕྱིར་བཏོན་འབད་ཡོད་པའི་སྡེབ་སྦྱོར་ཅིག་ཨིན

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ནང་སྡེབ་སྦྱོར་གྱི་ 70% ལས་མང་བ་ཕྱིར་བཏོན་འབད་ཡི

select-random-combination-fluke = ཧ་ཅང་འབྱུང་དཀའ་བའི་གོ་སྐབས་ཅིག་གིས་གང་བྱུང་བེ་ལུ་གི་སྡེབ་སྦྱོར་གདམ་མ་ཚུགས

select-random-value-fluke = ཧ་ཅང་འབྱུང་དཀའ་བའི་གོ་སྐབས་ཅིག་གིས་གང་བྱུང་བེ་ལུ་གདམ་མ་ཚུགས
