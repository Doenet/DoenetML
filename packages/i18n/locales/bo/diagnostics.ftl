# Tibetan diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# One plural category, so every counted select here is a single branch; see
# `content.ftl`'s header, and the note there on the case particles this catalog
# restricts itself to. DoenetML element, attribute and value names stay in
# English exactly as written, and so does the `[deprecation]` marker.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] མཐའ་ཚེག་གཉིས་ཀ་བཀོད་ཡོད་ན་ { $attributes } སྣང་མེད་དུ་འཇོག
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] མཐའ་ཚེག་དང་དབུས་ཚེག་གཉིས་ཀ་བཀོད་ཡོད་ན་ { $attributes } སྣང་མེད་དུ་འཇོག
    }

line-segment-midpoint-offset-without-midpoint = དབུས་ཚེག་མེད་ན་ midpointOffset ལ་ནུས་པ་མེད

## `<line>`

line-points-undetermined-dimensions = རྒྱ་ཁྱོན་མ་ངེས་པའི་ཚེག་བརྒྱུད་པའི་ཐིག

line-points-too-few-dimensions = ཐིག་ནི་ཉུང་མཐར་རྒྱ་ཁྱོན་གཉིས་ཡོད་པའི་ཚེག་བརྒྱུད་དགོས།

line-points-depend-on-variables = ཐིག་ནི་འགྱུར་ཚད་ལ་བརྟེན་པའི་ཚེག་བརྒྱུད་ཡོད། { $variables }

line-equation-invalid-format = འགྱུར་ཚད་ { $variable1 } དང་ { $variable2 } ནང་ཐིག་གི་མཉམ་བྱེད་ཀྱི་རྣམ་པ་ནོར་བ།

## `<ray>`

ray-overprescribed-through = འོད་ཟེར་ནི་ through དང་ endpoint དང་ direction གསུམ་ཀས་བཀོད་ཡོད། བཀོད་པའི་ through སྣང་མེད་དུ་བཞག

ray-dimension-mismatch = འོད་ཟེར་ནང་ numDimensions མི་མཐུན།

## `<vector>`

vector-overprescribed-head = ཕྱོགས་ཚད་ནི་ head དང་ tail དང་ displacement གསུམ་ཀས་བཀོད་ཡོད། བཀོད་པའི་ head སྣང་མེད་དུ་བཞག

vector-dimension-mismatch = ཕྱོགས་ཚད་ནང་ numDimensions མི་མཐུན།

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ནང་ nearestPoint ཞེས་པའི་གནས་སྟངས་འགྱུར་ཚད་མེད་པས། དེར་འགུགས་མི་ཐུབ།

constrain-to-without-nearest-point = `<{ $component }>` ནང་ nearestPoint ཞེས་པའི་གནས་སྟངས་འགྱུར་ཚད་མེད་པས། དེར་བཀག་སྡོམ་མི་ཐུབ།

constrain-to-interior-without-nearest-point = `<{ $component }>` ནང་ nearestPoint ཞེས་པའི་གནས་སྟངས་འགྱུར་ཚད་མེད་པས། དེའི་ནང་ཁུལ་དུ་བཀག་སྡོམ་མི་ཐུབ།

## `<choiceInput>`

choice-input-label-position-ignored = ཕྲེང་ནང་མིན་པའི་ choiceInput ལ་ labelPosition སྣང་མེད་དུ་འཇོག

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput ལ་བཀོད་པའི་གྲངས་རྟགས་སྣང་མེད་དུ་འཇོག རྒྱུ་མཚན་ནི་གྲངས་རྟགས་ཀྱི་གྲངས་ཀ་དང་འདེམས་ཁ་ཕྲུ་གུའི་གྲངས་ཀ་མི་མཐུན་པས་སོ།

pretzel-indices-count-mismatch = problem ལ་བཀོད་པའི་གྲངས་རྟགས་སྣང་མེད་དུ་འཇོག རྒྱུ་མཚན་ནི་གྲངས་རྟགས་ཀྱི་གྲངས་ཀ་དང་ problem ཕྲུ་གུའི་གྲངས་ཀ་མི་མཐུན་པས་སོ།

shuffle-indices-count-mismatch = shuffle ལ་བཀོད་པའི་གྲངས་རྟགས་སྣང་མེད་དུ་འཇོག རྒྱུ་མཚན་ནི་གྲངས་རྟགས་ཀྱི་གྲངས་ཀ་དང་ཆ་ཤས་ཀྱི་གྲངས་ཀ་མི་མཐུན་པས་སོ།

indices-ignored-out-of-range = { $component } ལ་བཀོད་པའི་གྲངས་རྟགས་སྣང་མེད་དུ་འཇོག རྒྱུ་མཚན་ནི་གྲངས་རྟགས་འགའ་ཞིག་ཁྱབ་ཚད་ལས་བརྒལ་བས་སོ།

pretzel-indices-repeated = pretzel ལ་བཀོད་པའི་གྲངས་རྟགས་སྣང་མེད་དུ་འཇོག རྒྱུ་མཚན་ནི་གྲངས་རྟགས་འགའ་ཞིག་ཡང་བསྐྱར་བྱུང་བས་སོ།

pretzel-circuit-first-index = circuit སྒོ་ནང་ pretzel ལ་བཀོད་པའི་གྲངས་རྟགས་སྣང་མེད་དུ་འཇོག རྒྱུ་མཚན་ནི་གྲངས་རྟགས་དང་པོ་ 1 ཡིན་དགོས་པས་སོ།

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` ཡིག་ཕྲེང་ཕྲུ་གུ་དང་མཉམ་དུ་ལས་ཀ་བྱེད་པར་ `type` ཁྱད་ཆོས་བཀོད་དགོས།

invalid-type-defaulting-to-math = { $component } ཆ་ཤས་ལ་ { $type } རིགས་ནོར་བ། math, text, number, boolean ནང་ནས་གཅིག་ཡིན་དགོས། སྔོན་སྒྲིག་ཏུ་ math བླངས།

string-not-valid-component-to-arrange = ཡིག་ཕྲེང་ "{ $value }" ནི་ { $component } ལ་ཆོག་པའི་ཆ་ཤས་མིན། སྣང་མེད་དུ་བཞག

## Types and variables

invalid-type-defaulting-to-number = { $type } རིགས་ནོར་བ། རིགས་ number ལ་བསྒྱུར།

invalid-variable-value = འགྱུར་ཚད་ཀྱི་གནས་གོང་ནོར་བ། `{ $value }`

## Variants

variant-index-must-be-number = རྣམ་པའི་གྲངས་རྟགས་ { $index } གྲངས་ཀ་ཞིག་ཡིན་དགོས

variant-index-must-be-integer = རྣམ་པའི་གྲངས་རྟགས་ { $index } ཧྲིལ་གྲངས་ཤིག་ཡིན་དགོས

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ནི་གདོན་མི་ཟ་བའི་ཚད་ལ་བཟོས་མེད། ཞེང་ཚད་ལྟོས་བཅས་སུ་བསྒྱུར།

side-by-side-absolute-margins = `<{ $component }>` ནི་གདོན་མི་ཟ་བའི་ཚད་ལ་བཟོས་མེད། མཐའ་སྟོང་ལྟོས་བཅས་སུ་བསྒྱུར།

side-by-side-no-block-child = `<{ $component }>` ནོར་བ། འདིའི་ནང་ཉུང་མཐར་སྒྲོམ་ཕྲུ་གུ་གཅིག་ཡོད་དགོས།

## `<label>`

label-for-ignored-on-graphical = རི་མོའི་ `<label>` སྟེང་ `for` ཁྱད་ཆོས་སྣང་མེད་དུ་འཇོག

label-for-must-resolve-to-one = `<label>` སྟེང་གི་ `for` ཁྱད་ཆོས་ཀྱིས་ཆ་ཤས་གཅིག་ཁོ་ན་སྟོན་དགོས།

label-for-unresolved = `<label>` སྟེང་གི་ `for` ཁྱད་ཆོས་ཀྱིས་ཆ་ཤས་གང་ཡང་སྟོན་མ་ཐུབ།

label-for-answer-with-authored-inputs = `<label>` སྟེང་གི་ `for` ཁྱད་ཆོས་ཀྱིས་རྩོམ་པ་པོས་རང་ཉིད་ནས་ནང་འཇུག་བྲིས་པའི་ `<answer>` སྟོན་གྱི་ཡོད། ནང་འཇུག་ཐད་ཀར་སྟོན་རོགས།

label-for-answer-without-input = `<label>` སྟེང་གི་ `for` ཁྱད་ཆོས་ཀྱིས་མིང་བྱང་འཇོག་རུང་བའི་ནང་འཇུག་མེད་པའི་ `<answer>` སྟོན་གྱི་ཡོད།

label-for-must-reference-input-or-answer = `<label>` སྟེང་གི་ `for` ཁྱད་ཆོས་ཀྱིས་ནང་འཇུག་གམ་ལན་ཞིག་སྟོན་དགོས།

## Accessibility

accessibility-short-description-or-decorative = བདེ་སྤྱོད་ཀྱི་ཆེད་དུ་ `<{ $component }>` ལ་འགྲེལ་བཤད་ཐུང་ངུ་ཞིག་ཡོད་དགོས། ཡང་ན་ decorative ཞེས་བཀོད་དགོས།

accessibility-video-short-description = བདེ་སྤྱོད་ཀྱི་ཆེད་དུ་ `<video>` ལ་འགྲེལ་བཤད་ཐུང་ངུ་ཞིག་ཡོད་དགོས།

accessibility-input-short-description-or-label = བདེ་སྤྱོད་ཀྱི་ཆེད་དུ་ `<{ $component }>` ལ་འགྲེལ་བཤད་ཐུང་ངུ་འམ་མིང་བྱང་ཞིག་ཡོད་དགོས།

accessibility-answer-input-short-description-or-label = བདེ་སྤྱོད་ཀྱི་ཆེད་དུ་ནང་འཇུག་བཟོ་བའི་ `<answer>` ལ་འགྲེལ་བཤད་ཐུང་ངུ་འམ་མིང་བྱང་ཞིག་ཡོད་དགོས།

accessibility-short-description-contains-math = འགྲེལ་བཤད་ཐུང་ངུའི་ནང་ `<{ $component }>` ལྟ་བུའི་རྩིས་ཀྱི་ཆ་ཤས་ཡོད་མི་རུང་། རྩིས་དེ་ཚིག་གིས་འབྲི་རོགས།

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] ལེ་ཚན་གྱི་ཁ་བྱང་ཡི་གེ་ལ་ { $colorName } གྱི་ཁྱད་པར་མི་འདང་ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ཉུང་མཐར་ { $threshold }:1 དགོས) (ནག་སྒོ)།
       *[other] ལེ་ཚན་གྱི་ཁ་བྱང་ཡི་གེ་ལ་ { $colorName } གྱི་ཁྱད་པར་མི་འདང་ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ཉུང་མཐར་ { $threshold }:1 དགོས)།
    }

## `<circle>`

circle-through-points-non-numerical = ཚེག་ལ་གྲངས་ཀའི་གནས་གོང་མེད་པའི་སྐབས་སུ་ཚེག་ { $count } བརྒྱུད་པའི་ `<circle>` ད་བར་བཟོས་མེད།

circle-too-many-through-points = ཚེག་གསུམ་ལས་མང་བ་བརྒྱུད་པའི་ཟླུམ་སྐོར་རྩིས་མི་ཐུབ།

circle-overprescribed-radius-center-points = བཀོད་པའི་ཟུར་ཐིག་དང་ལྟེ་བ་དང་ཚེག་གསུམ་ཀ་དང་མཉམ་དུ་ཟླུམ་སྐོར་རྩིས་མི་ཐུབ།

circle-center-with-multiple-points = བཀོད་པའི་ལྟེ་བ་དང་མཉམ་དུ་ཚེག་གཅིག་ལས་མང་བ་བརྒྱུད་པའི་ཟླུམ་སྐོར་རྩིས་མི་ཐུབ།

circle-radius-too-small = ཟླུམ་སྐོར་རྩིས་མི་ཐུབ། ཚེག་གཉིས་བར་གྱི་རྒྱང་ཚད་ { $distance } ཡིན་པས། བཀོད་པའི་ཟུར་ཐིག་ { $radius } ཧ་ཅང་ཆུང་།

circle-radius-with-many-points = བཀོད་པའི་ཟུར་ཐིག་དང་མཉམ་དུ་ཚེག་གཉིས་ལས་མང་བ་བརྒྱུད་པའི་ཟླུམ་སྐོར་བཟོ་མི་ཐུབ།

circle-invalid-center-or-through-points = ཟླུམ་སྐོར་གྱི་ལྟེ་བའམ་ཚེག་ནོར་བ།

circle-radius-center-with-multiple-points = བཀོད་པའི་ལྟེ་བ་དང་མཉམ་དུ་ཚེག་གཅིག་ལས་མང་བ་བརྒྱུད་པའི་ཟླུམ་སྐོར་གྱི་ཟུར་ཐིག་རྩིས་མི་ཐུབ།

circle-change-radius-non-numerical = གྲངས་ཀ་མིན་པའི་ཚེག་བརྒྱུད་པའི་ཟླུམ་སྐོར་གྱི་ཟུར་ཐིག་བསྒྱུར་མི་ཐུབ

circle-radius-with-points-non-numerical = གྲངས་ཀའི་གནས་གོང་མེད་ན། བཀོད་པའི་ཟུར་ཐིག་དང་མཉམ་དུ་ཚེག་གཅིག་ལས་མང་བ་བརྒྱུད་པའི་ཟླུམ་སྐོར་བཟོ་མི་ཐུབ།

circle-change-center-non-numerical = གྲངས་ཀ་མིན་པའི་གནས་གོང་གི་ཚེག་བརྒྱུད་པའི་ཟླུམ་སྐོར་གྱི་ལྟེ་བ་བསྒྱུར་བ་ད་བར་བཟོས་མེད།

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] བྱེད་རྩིས་ཀྱི་ཁྱབ་ཁོངས་ལ་རྒྱ་ཁྱོན་མི་འདང་། ཁྱབ་ཁོངས་ནང་བར་མཚམས་ { $intervals } ཡོད་ཀྱང་བྱེད་རྩིས་ལ་ནང་འཇུག་ { $inputs ->
           *[other] { $inputs }
        } ཡོད།
    }

function-domain-invalid-format = བྱེད་རྩིས་ཀྱི་ཁྱབ་ཁོངས་ཀྱི་རྣམ་པ་ནོར་བ།

function-ignoring-non-numerical =
    { $type ->
        [maximum] བྱེད་རྩིས་ཀྱི་གྲངས་ཀ་མིན་པའི་མཐོ་ཤོས་སྣང་མེད་དུ་བཞག
        [minimum] བྱེད་རྩིས་ཀྱི་གྲངས་ཀ་མིན་པའི་དམའ་ཤོས་སྣང་མེད་དུ་བཞག
        [extremum] བྱེད་རྩིས་ཀྱི་གྲངས་ཀ་མིན་པའི་མཐའ་ཚད་སྣང་མེད་དུ་བཞག
        [point] བྱེད་རྩིས་ཀྱི་གྲངས་ཀ་མིན་པའི་ཚེག་སྣང་མེད་དུ་བཞག
        [slope] བྱེད་རྩིས་ཀྱི་གྲངས་ཀ་མིན་པའི་གཞོལ་ཚད་སྣང་མེད་དུ་བཞག
       *[other] བྱེད་རྩིས་ཀྱི་གྲངས་ཀ་མིན་པའི་ { $type } སྣང་མེད་དུ་བཞག
    }

function-ignoring-empty =
    { $type ->
        [maximum] བྱེད་རྩིས་ཀྱི་སྟོང་པའི་མཐོ་ཤོས་སྣང་མེད་དུ་བཞག
        [minimum] བྱེད་རྩིས་ཀྱི་སྟོང་པའི་དམའ་ཤོས་སྣང་མེད་དུ་བཞག
        [extremum] བྱེད་རྩིས་ཀྱི་སྟོང་པའི་མཐའ་ཚད་སྣང་མེད་དུ་བཞག
        [point] བྱེད་རྩིས་ཀྱི་སྟོང་པའི་ཚེག་སྣང་མེད་དུ་བཞག
       *[other] བྱེད་རྩིས་ཀྱི་སྟོང་པའི་ { $type } སྣང་མེད་དུ་བཞག
    }

function-points-too-close = བྱེད་རྩིས་ནང་ཚེག་གཉིས་ཧ་ཅང་ཉེ་བར་ཡོད། བྱེད་རྩིས་ངེས་འཛིན་མི་ཐུབ།

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] བྱེད་རྩིས་ཡང་བསྐྱར་བྱེད་པ་ནི་ནང་འཇུག་གི་གྲངས་ཀ་དང་ཕྱིར་འདོན་གྱི་གྲངས་ཀ་མཉམ་པའི་སྐབས་ཁོ་ནར་ཐུབ། བྱེད་རྩིས་འདིར་ནང་འཇུག་ { $inputs } དང་ཕྱིར་འདོན་ { $outputs ->
           *[other] { $outputs }
        } ཡོད།
    }

## `<sequence>`

sequence-invalid-length = གོ་རིམ་གྱི་རིང་ཚད་ནོར་བ། མ་ཉུང་བའི་ཧྲིལ་གྲངས་ཤིག་ཡིན་དགོས།

sequence-invalid-step = གོ་རིམ་གྱི་གོམ་པ་ནོར་བ། { $type } རིགས་ཀྱི་གོ་རིམ་ལ་གྲངས་ཀ་ཞིག་ཡིན་དགོས།

sequence-invalid-endpoint-number = གྲངས་ཀའི་གོ་རིམ་གྱི་ "{ $attribute }" ནོར་བ། གྲངས་ཀ་ཞིག་ཡིན་དགོས།

sequence-invalid-endpoint-letters = ཡི་གེའི་གོ་རིམ་གྱི་ "{ $attribute }" ནོར་བ། ཡི་གེའི་སྡེབ་སྦྱོར་ཞིག་ཡིན་དགོས།

sequence-invalid-endpoint = གོ་རིམ་གྱི་ "{ $attribute }" ནོར་བ།

select-from-sequence-coprime-not-numbers = གྲངས་ཀ་མི་འདེམས་པས་ coprime སྣང་མེད་དུ་བཞག

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations བཀོད་ཡོད་པས་ coprime སྣང་མེད་དུ་བཞག

## Resolving a `target`

target-not-found = `<{ $source }>` ལ་དམིགས་ཡུལ་ནོར་བ། དམིགས་ཡུལ་མ་རྙེད།

target-state-variable-not-found = `<{ $source }>` ལ་དམིགས་ཡུལ་ནོར་བ། `<{ $component }>` སྟེང་ "{ $property }" ཞེས་པའི་གནས་སྟངས་འགྱུར་ཚད་མ་རྙེད།

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` གྱི་འགྱུར་ཚད་རྣམས་རང་དབང་འགྱུར་ཚད་དང་མི་འདྲ་བ་ཡིན་དགོས།

ode-system-duplicate-variable-names = ཡང་བསྐྱར་བྱུང་བའི་བརྟེན་འགྱུར་ཚད་ཀྱི་མིང་དང་མཉམ་དུ་ ODE RHS བྱེད་རྩིས་ངེས་འཛིན་མི་ཐུབ།

ode-system-rhs-function-error = ODE RHS བྱེད་རྩིས་ངེས་འཛིན་མི་ཐུབ། mathjs བྱེད་རྩིས་བཟོ་བར་ནོར་འཁྲུལ།

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = ཐིག་ { $count } བར་གྱི་ཟུར་ཚད་ངེས་འཛིན་མི་ཐུབ

angle-invalid-through-point = `<angle>` གི་ through ནང་ཚེག་ནོར་བ

parabola-vertex-too-many-points = རྩེ་མོ་དང་མཉམ་དུ་ཚེག་གཅིག་ལས་མང་བ་བརྒྱུད་པའི་པ་ར་བོ་ལ་ད་བར་བཟོས་མེད།

parabola-too-many-points = ཚེག་གསུམ་ལས་མང་བ་བརྒྱུད་པའི་པ་ར་བོ་ལ་ད་བར་བཟོས་མེད།

intersection-too-many-items = དངོས་པོ་གཉིས་ལས་མང་བའི་གཅོད་མཚམས་ད་བར་བཟོས་མེད

## Other math components

ionic-compound-not-two-ions = རླུང་རྡུལ་གཉིས་མིན་པའི་གཞན་ལ་རླུང་རྡུལ་འདུས་རྫས་ད་བར་བཟོས་མེད།

ionic-compound-needs-cation-and-anion = རླུང་རྡུལ་འདུས་རྫས་ནི་རླུང་རྡུལ་ཡོད་ཆ་གཅིག་དང་མེད་ཆ་གཅིག་ལ་ཁོ་ན་བཟོས་ཡོད།

solve-equations-cannot-evaluate = མཉམ་བྱེད་ཀྱི་གནས་གོང་རྩིས་མ་ཐུབ་པས་དེ་སེལ་མི་ཐུབ། { $equation }

math-operators-operand-number-required = རྩིས་ཀྱི་བྱེད་རྒྱུ་འདོན་པར་ operandNumber བཀོད་དགོས།

eigen-decomposition-failed = དྲྭ་གྲངས་ཀྱི་རང་གནས་གོང་རྩིས་མ་ཐུབ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: ཚད་འཛིན་ { $parameters } དཔེ་རིས་ནང་མེད་པས། དེ་རྟག་ཏུ་སྟོང་པ་དང་མཐུན་པར་འགྱུར།
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" གོ་མ་ཐུབ། དེ་ནི་ none, medium, dense, ཡང་ན་སྟོང་ཆས་ཀྱིས་བར་བཅད་པའི་ཡོད་ཆའི་གྲངས་ཀ་གཉིས་ཡིན་དགོས། དཔེར་ན་ grid="1 0.5"། དྲྭ་མིག་གང་ཡང་མ་བྲིས།

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure སྟོན་བྱེད་ནང་ xLabelPosition="left" མི་འཐུས། right གྱི་བྱེད་སྟངས་བླངས།

prefigure-y-label-position-unsupported = `<graph>`: prefigure སྟོན་བྱེད་ནང་ yLabelPosition="bottom" མི་འཐུས། top གྱི་བྱེད་སྟངས་བླངས།

prefigure-invalid-axis-bounds = `<graph>`: prefigure བསྒྱུར་བར་སྲོག་ཤིང་གི་མཐའ་ཚད་ནོར་བ། སྔོན་སྒྲིག་ bbox (-10,-10,10,10) བླངས།

prefigure-invalid-width = `<graph>`: prefigure བསྒྱུར་བར་ཞེང་ཚད་ནོར་བ། སྔོན་སྒྲིག་རི་མོའི་ཞེང་ཚད་ 425 བླངས།

prefigure-invalid-aspect-ratio = `<graph>`: prefigure བསྒྱུར་བར་ aspectRatio ནོར་བ། སྔོན་སྒྲིག་ཚད་འཇལ་ 1 བླངས།

prefigure-grid-spacing-too-fine = `<graph>`: སྲོག་ཤིང་གི་མཐའ་ཚད་ལ་དྲྭ་མིག་གི་བར་ཐག་ཧ་ཅང་ཕྲ་བས། prefigure སྟོན་བྱེད་ནང་དྲྭ་མིག་བོར།

prefigure-annotations-not-rendered = `<graph>`: PreFigure སྟོན་བྱེད་མ་བཀོལ་ན་མཆན་འགྲེལ་མི་འབྲི།

multiple-annotations-children = `<graph>` ནང་ `<annotations>` ཕྲུ་གུ་མང་པོ་རྙེད་བྱུང་། མཐའ་མ་མ་གཏོགས་ཚང་མ་སྣང་མེད་དུ་བཞག

## Referring to other components

copy-unrecognized-component-type = ངོས་མ་ཟིན་པའི་ཆ་ཤས་རིགས་རྒྱ་བསྐྱེད་དམ་འདྲ་བཤུས་བྱེད་མི་ཐུབ། { $type }

copy-prop-not-found = { $component } རིགས་ཀྱི་ཆ་ཤས་སྟེང་ { $property } ཁྱད་ཆོས་མ་རྙེད

collect-no-source = collect ལ་འབྱུང་ཁུངས་གང་ཡང་མ་རྙེད།

collect-invalid-component-type = `<{ $component }>` རིགས་ཀྱི་ཆ་ཤས་བསྡུ་མི་ཐུབ། རྒྱུ་མཚན་ནི་དེ་ནི་ཆ་ཤས་རིགས་ནོར་བ་ཡིན་པས་སོ།

reference-index-unavailable = གྲངས་རྟགས་ `{ $reference }` ལ་འདྲེན་མི་ཐུབ

## `<callAction>`

component-action-unavailable = ཆ་ཤས་ `{ $reference }` སྟེང་ { $action } བཀོལ་མི་ཐུབ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = གཞི་གྲངས་ཀྱི་དབྱིབས་ནོར་བ། ཕྲེང་གི་རིང་ཚད་མི་མཐུན། componentIdx :{ $componentIdx } ནང་རྙེད་བྱུང་

data-frame-duplicate-column-names = གཞི་གྲངས་ནང་ཡང་བསྐྱར་བྱུང་བའི་སྟར་མིང་ཡོད། componentIdx :{ $componentIdx } ནང་རྙེད་བྱུང་

data-frame-missing-column-name = གཞི་གྲངས་ནང་སྟར་མིང་ཞིག་མེད། componentIdx :{ $componentIdx } ནང་རྙེད་བྱུང་

## `<answer>` and scoring

answer-award-depends-on-own-response = ལན་འདིའི་ award ཞིག་ནི་ answer ཏིག་འདི་རང་གིས་སྐུར་བའི་ལན་ལ་བརྟེན་ཡོད་པས། རེ་བ་ལས་འགལ་བའི་འབྲས་བུ་འབྱུང་ངེས།

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` ཡོད་པའི་སྣོད་ཀྱི་ནང་གི་ `<answer>` སྟེང་ `maxNumAttempts` བཀོད་ཀྱང་ནུས་པ་མེད། རྒྱུ་མཚན་ནི་འབད་བརྩོན་གྱི་གྲངས་ཀ་སྣོད་ཀྱིས་ཚོད་འཛིན་བྱེད་པས་སོ། `maxNumAttempts` སྣོད་སྟེང་བཀོད་རོགས།

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` སྣོད་གཞན་ཞིག་གི་ནང་གི་ `sectionWideCheckWork` སྣོད་སྟེང་ `maxNumAttempts` བཀོད་ཀྱང་ནུས་པ་མེད། རྒྱུ་མཚན་ནི་འབད་བརྩོན་གྱི་གྲངས་ཀ་ཕྱི་རོལ་གྱི་སྣོད་ཀྱིས་ཚོད་འཛིན་བྱེད་པས་སོ། `maxNumAttempts` ཕྱི་རོལ་གྱི་སྣོད་སྟེང་བཀོད་རོགས།

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] symbolicEquality མེད་ན་ { $attributes } ཁྱད་ཆོས་ལ་ནུས་པ་མི་འབྱུང་།
    }

answer-invalid-type = ལན་ལ་རིགས་ནོར་བ། { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` ཆ་ཤས་ལ་མིང་མེད་པས། དེ་ module གི་ཁྱད་ཆོས་སུ་བཀོལ་མི་ཐུབ

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` ཆ་ཤས་ནི་ module གི་ཁྱད་ཆོས་སུ་བཀོལ་མི་ཐུབ། རྒྱུ་མཚན་ནི་ `<module>` ཆ་ཤས་རིགས་ནང་ "{ $name }" ཁྱད་ཆོས་སྔར་ནས་ངེས་འཛིན་ཟིན་པས་སོ།

conditional-content-condition-ignored = case ཡང་ན་ else ཕྲུ་གུ་ཡོད་པའི་ `<conditionalContent>` ཆ་ཤས་སྟེང་ `condition` ཁྱད་ཆོས་སྣང་མེད་དུ་འཇོག

slider-markers-type-mismatch = རྟགས་ཀྱི་རིགས་དང་ slider གྱི་རིགས་མི་མཐུན།

pretzel-problem-needs-statement-and-answer = pretzel ནོར་བ། `<problem>` རེ་རེའི་ནང་ `<statement>` གཅིག་དང་ `<answer>` གཅིག་ཡོད་དགོས།

pretzel-circuit-first-problem-distractor = pretzel ནོར་བ། mode="circuit" ནང་ `<problem>` དང་པོ་ནི་གཡོ་སློང་ཞིག་ཡིན་མི་རུང་།

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] `{ $attribute }` ཁྱད་ཆོས་ལ་གནས་གོང་ནོར་བ་ { $values }། སྣང་མེད་དུ་བཞག
    }

attribute-must-be-references = `{ $attribute }` ཁྱད་ཆོས་ལ་ `{ $value }` ནི་གནས་གོང་ནོར་བ་ཡིན། ཁྱད་ཆོས་ནི་ `$` ནས་འགོ་ཚུགས་པའི་ཞིབ་འཇུག་གིས་གྲུབ་དགོས།

math-input-invalid-function-names = <mathInput>: { $attribute } ནང་བྱེད་རྩིས་མིང་ནོར་བ་སྣང་མེད་དུ་བཞག { $names }། མིང་རེ་རེའི་སྟོན་ཆའི་ནང་ཉུང་མཐར་ཡི་གེ་གཉིས་ (ཡི་གེའམ་ཐིག་རྟགས) ཡོད་དགོས། དེའི་རྗེས་སུ་ `|<mathspeak alternative>` འཇུག་ཆོག

## Building components from the source

component-type-invalid = ཆ་ཤས་རིགས་ནོར་བ། `<{ $componentType }>`

attribute-repeated = ཁྱད་ཆོས་ { $attribute } ཡང་བསྐྱར་བཀོད་མི་ཆོག

attribute-invalid-for-component = `<{ $componentType }>` རིགས་ཀྱི་ཆ་ཤས་ལ་ "{ $attribute }" ཁྱད་ཆོས་ནོར་བ།

## Style definition contrast

style-definition-insufficient-contrast =
    བཟོ་ལྟའི་ངེས་ཚིག་ { $styleNumber } ནང་ { $context ->
        [text-on-background] རྒྱབ་ལྗོངས་ཚོན་མདངས་ལ་བལྟས་པའི་ཡི་གེའི་ཚོན་མདངས
        [high-contrast] རས་གཞིར་བལྟས་པའི་ཁྱད་པར་ཆེ་བའི་ཚོན་མདངས
        [line] རས་གཞིར་བལྟས་པའི་ཐིག་གི་ཚོན་མདངས
        [marker] རས་གཞིར་བལྟས་པའི་རྟགས་ཀྱི་ཚོན་མདངས
       *[text-on-canvas] རས་གཞིར་བལྟས་པའི་ཡི་གེའི་ཚོན་མདངས
    } ཀྱི་ཁྱད་པར་མི་འདང་{ $mode ->
        [dark] { " (ནག་སྒོ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ཉུང་མཐར་ { $threshold }:1 དགོས)།

style-definition-dark-mode-text-background-contrast =
    བཟོ་ལྟའི་ངེས་ཚིག་ { $styleNumber } ནང་བཀོད་པའི་ཚོན་མདངས་རྣམས་དཀར་སྒོར་ཁྱད་པར་འདང་ངེས་སྤྲོད་ཀྱང་། དེ་དག་ལས་བྱུང་བའི་ནག་སྒོའི་ཚོན་མདངས་ལ་རྒྱབ་ལྗོངས་ཚོན་མདངས་ལ་བལྟས་པའི་ཡི་གེའི་ཚོན་མདངས་ཀྱི་ཁྱད་པར་མི་འདང་ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ཉུང་མཐར་ { $threshold }:1 དགོས)། { $suggestion ->
        [available] ནག་སྒོར་ཁྱད་པར་འདང་བ་ཞིག་ལ་དཀར་སྒོའི་ཁྱད་པར་སྤར་རོགས་ (དཔེར་ན་ { $lightAttribute }="{ $lightColor }")། ཡང་ན་ནག་སྒོའི་ཚོན་མདངས་རང་ཉིད་ནས་བཀོད་རོགས་ (དཔེར་ན་ { $darkAttribute }="{ $darkColor }")།
       *[none] ནག་སྒོར་ཁྱད་པར་འདང་བ་ཞིག་ལ་དཀར་སྒོའི་ཁྱད་པར་སྤར་རོགས། ཡང་ན་བྱུང་བའི་ཚོན་མདངས་ textColorDarkMode དང་། ཡང་ན་ backgroundColorDarkMode ཡིས་རང་ཉིད་ནས་བཀོད་རོགས།
    }

style-definition-dark-mode-text-canvas-contrast =
    བཟོ་ལྟའི་ངེས་ཚིག་ { $styleNumber } ནང་བཀོད་པའི་ཡི་གེའི་ཚོན་མདངས་དཀར་སྒོར་ཁྱད་པར་འདང་ངེས་སྤྲོད་ཀྱང་། དེ་ལས་བྱུང་བའི་ནག་སྒོའི་ཡི་གེའི་ཚོན་མདངས་ལ་རས་གཞིར་བལྟས་པའི་ཁྱད་པར་མི་འདང་ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ཉུང་མཐར་ { $threshold }:1 དགོས)། { $suggestion ->
        [available] ནག་སྒོར་ཁྱད་པར་འདང་བ་ཞིག་ལ་དཀར་སྒོའི་ཁྱད་པར་སྤར་རོགས་ (དཔེར་ན་ textColor="{ $lightColor }")། ཡང་ན་ནག་སྒོའི་ཚོན་མདངས་རང་ཉིད་ནས་བཀོད་རོགས་ (དཔེར་ན་ textColorDarkMode="{ $darkColor }")།
       *[none] ནག་སྒོར་ཁྱད་པར་འདང་བ་ཞིག་ལ་དཀར་སྒོའི་ཁྱད་པར་སྤར་རོགས། ཡང་ན་བྱུང་བའི་ཚོན་མདངས་ textColorDarkMode ཡིས་རང་ཉིད་ནས་བཀོད་རོགས།
    }

section-multiple-style-palettes = ལེ་ཚན་གཅིག་གིས་ <stylePalette> གཅིག་ཁོ་ན་འདེམས་ཐུབ། མཐའ་མ་བླངས།

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } གི་རྣམ་པ་མི་འདྲ་བ་ངེས་འཛིན་མི་ཐུབ། རྒྱུ་མཚན་ནི་ numToSelect མ་ཉུང་བའི་ཧྲིལ་གྲངས་མིན་པས་སོ།

variant-num-to-select-not-constant-number = { $component } གི་རྣམ་པ་མི་འདྲ་བ་ངེས་འཛིན་མི་ཐུབ། རྒྱུ་མཚན་ནི་ numToSelect བརྟན་པའི་གྲངས་ཀ་མིན་པས་སོ།

variant-with-replacement-not-constant-boolean = { $component } གི་རྣམ་པ་མི་འདྲ་བ་ངེས་འཛིན་མི་ཐུབ། རྒྱུ་མཚན་ནི་ withReplacement བརྟན་པའི་བུ་ལིན་མིན་པས་སོ།

variant-select-weight-disables-unique = གདམ་ཁ་ཞིག་ལ་ selectWeight ཡང་ན་ selectForVariants བཀོད་ཡོད་ན་ select གྱི་རྣམ་པ་མི་འདྲ་བ་བཀག

variant-coprime-undetermined = { $component } གི་རྣམ་པ་མི་འདྲ་བ་ངེས་འཛིན་མི་ཐུབ། རྒྱུ་མཚན་ནི་ coprime རྟག་ཏུ་རྫུན་པ་ཡིན་མིན་ཐག་གཅོད་མི་ཐུབ་པས་སོ།

variant-attribute-not-constant = { $component } གི་རྣམ་པ་མི་འདྲ་བ་ངེས་འཛིན་མི་ཐུབ། རྒྱུ་མཚན་ནི་ { $attribute } བརྟན་པོ་མིན་པས་སོ།

variant-attribute-not-number = { $component } གི་རྣམ་པ་མི་འདྲ་བ་ངེས་འཛིན་མི་ཐུབ། རྒྱུ་མཚན་ནི་ { $attribute } གྲངས་ཀ་མིན་པས་སོ།

variant-attribute-wrong-type-for-sequence =
    { $type } རིགས་ཀྱི་ { $component } གི་རྣམ་པ་མི་འདྲ་བ་ངེས་འཛིན་མི་ཐུབ། རྒྱུ་མཚན་ནི་ { $attribute } ནི་{ $expected ->
        [letters-combination] ཡི་གེའི་སྡེབ་སྦྱོར
        [math-expression] ཆོག་པའི་རྩིས་བརྗོད
        [integer] ཧྲིལ་གྲངས
       *[number] གྲངས་ཀ
    } མིན་པས་སོ།

variant-length-not-integer = { $component } གི་རྣམ་པ་མི་འདྲ་བ་ངེས་འཛིན་མི་ཐུབ། རྒྱུ་མཚན་ནི་ length ཧྲིལ་གྲངས་མིན་པས་སོ།

variant-sort-not-implemented = sort ཡོད་པའི་ { $component } གི་རྣམ་པ་མི་འདྲ་བ་ད་བར་བཟོས་མེད

variant-exclude-combinations-not-implemented = excludeCombinations ཡོད་པའི་ { $component } གི་རྣམ་པ་མི་འདྲ་བ་ད་བར་བཟོས་མེད

variant-math-exclude-not-implemented = exclude ཡོད་པའི་ math རིགས་ཀྱི་ { $component } གི་རྣམ་པ་མི་འདྲ་བ་ད་བར་བཟོས་མེད

variant-non-constant-exclude-not-implemented = མི་བརྟན་པའི་ exclude ཡོད་པའི་ { $component } གི་རྣམ་པ་མི་འདྲ་བ་ད་བར་བཟོས་མེད

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure སྟོན་བྱེད་ནང་མི་འཐུས། རྒྱུད་འཛིན་བོར།

prefigure-descendant-invalid-geometry = { $subject }: མཐའ་མེད་དམ་མ་ཚང་བའི་དབྱིབས་རྩིས། རྒྱུད་འཛིན་བོར།

prefigure-curve-label-omitted = { $subject }: བསྒྱུར་ཟིན་པའི་ཡོ་ཐིག་ཆ་ཤས་སྟེང་མིང་བྱང་མི་འཐུས། མིང་བྱང་བོར།

prefigure-curve-unsupported-definition-type = { $subject }: ཡོ་ཐིག་བྱེད་རྩིས་ངེས་ཚིག་རིགས་ '{ $definitionType }' མི་འཐུས། རྒྱུད་འཛིན་བོར།

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves སྟེང་ flipFunctions ཁྱད་ཆོས་མི་འཐུས། རྒྱུད་འཛིན་བོར།

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves སྟེང་ formula རིགས་ཀྱི་ཕྲུ་གུའི་བྱེད་རྩིས་ཁོ་ན་འཐུས། རྒྱུད་འཛིན་བོར།

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] ཐིག་རིགས་ཀྱི་མིང་བྱང་
       *[point] ཚེག་གི་མིང་བྱང་
    } ལ་ labelPosition '{ $labelPosition }' མི་འཐུས། སྔོན་སྒྲིག་ PreFigure གཤིབ་སྒྲིག་བླངས།

prefigure-fill-style-unsupported = { $subject }: བཀང་ལུགས་ '{ $fillStyle }' PreFigure ནང་མི་འཐུས། རྒྱུན་ལྡན་བཀང་ལུགས་བླངས།

prefigure-line-style-unknown = { $subject }: ངོས་མ་ཟིན་པའི་ཐིག་ལུགས་ '{ $lineStyle }' PreFigure ཕྱིར་འདོན་ནས་བོར།

prefigure-marker-style-mapped-to-diamond = { $subject }: རྟགས་ལུགས་ '{ $markerStyle }' PreFigure གི་ 'diamond' ལུགས་སུ་བསྒྱུར།

prefigure-marker-style-unsupported = { $subject }: རྟགས་ལུགས་ '{ $markerStyle }' PreFigure ནང་མི་འཐུས། སྔོན་སྒྲིག་ལུགས་བླངས།

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ནོར་བ། དམིགས་ཡུལ་མ་རྙེད། མཆན་འགྲེལ་བོར།

annotation-ref-multiple-targets = `<annotation>`: `ref` ནས་དམིགས་ཡུལ་མང་པོ་རྙེད་བྱུང་། དམིགས་ཡུལ་དང་པོ་བླངས།

annotation-ref-outside-graph = `<annotation>`: `ref` ནོར་བ། དམིགས་ཡུལ་ནི་ graph དེའི་ཕྱི་ན་ཡོད། མཆན་འགྲེལ་བོར།

annotation-ref-unsupported-target = `<annotation>`: `ref` ནོར་བ། prefigure བསྒྱུར་བའི་ནང་དམིགས་ཡུལ་ནི་འཐུས་པའི་རི་མོའི་དངོས་པོ་མིན། མཆན་འགྲེལ་བོར།

annotation-text-missing = `<annotation>`: `text` མེད་དམ་སྟོང་པ། ཡི་གེ་སྟོང་པ་བཏང་།

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] འཁོར་བའི་བརྟེན་ཚུལ་རྙེད་བྱུང་།
       *[other] `<{ $componentType }>` ཆ་ཤས་དང་འབྲེལ་བའི་འཁོར་བའི་བརྟེན་ཚུལ་རྙེད་བྱུང་།
    }

reference-no-referent = ཞིབ་འཇུག་གི་དམིགས་ཡུལ་མ་རྙེད། `{ $reference }`

reference-multiple-referents = ཞིབ་འཇུག་གི་དམིགས་ཡུལ་མང་པོ་རྙེད་བྱུང་། `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` གི་ { $attribute } ཁྱད་ཆོས་ཀྱི་རྣམ་པ་ནོར་བ།

children-invalid = `<{ $componentType }>` ལ་ཕྲུ་གུ་ནོར་བ། ཕྲུ་གུ་ནོར་བ་རྙེད་བྱུང་། { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` ཁྱད་ཆོས་ལ་ `{ $value }` གནས་གོང་ནོར་བ། `{ $default }` གནས་གོང་བླངས

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML པར་གཞི་ { $version } མ་རྙེད།
       *[other] DoenetML པར་གཞི་ { $version } མ་རྙེད། པར་གཞི་ { $fallback } བླངས
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ནོར་བ། { $content }

parse-tag-missing-close-tag = DoenetML ནོར་བ། ཏིག་ `{ $tag }` ལ་སྒོ་རྒྱག་ཏིག་མེད། རང་སྒོ་རྒྱག་ཏིག་གམ་ `</{ $tagName }>` ཏིག་དགོས།

parse-tag-error = DoenetML ནོར་བ། ཏིག་ `<{ $tagName }>` ནང་ནོར་འཁྲུལ

parse-attribute-missing-value = DoenetML ནོར་བ། ཁྱད་ཆོས་ནོར་བ་ `{ $attribute }` ལ་གནས་གོང་མེད་པར་སྣང་།

parse-attribute-invalid = DoenetML ནོར་བ། ཁྱད་ཆོས་ནོར་བ་ `{ $attribute }`

parse-attribute-value-invalid = DoenetML ནོར་བ། ཁྱད་ཆོས་ཀྱི་གནས་གོང་ནོར་བ་ `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML ནོར་བ། ཁྱད་ཆོས་ཀྱི་གནས་གོང་ནོར་བ་ `{ $value }`། འདྲེན་རྟགས་མི་མཐུན། `{ $quote }` ཆད་པར་སྣང་

parse-open-tag-name-missing = DoenetML ནོར་བ། ཏིག་མིང་མེད་པའི་ཏིག་རྙེད་བྱུང་། དཔེར་ན་ `<`

parse-tag-not-closed = DoenetML ནོར་བ། ཏིག་ `{ $tag }` སྒོ་མ་བརྒྱབ་ (`>` ཆད་པར་སྣང་)།

parse-self-closing-tag-name-missing = DoenetML ནོར་བ། ཏིག་མིང་མེད་པའི་ཏིག་རྙེད་བྱུང་ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ནོར་བ། ཏིག་ `{ $tag }` སྒོ་མ་བརྒྱབ་ (`/>` ཆད་པར་སྣང་)།

parse-tag-invalid-attributes = DoenetML ནོར་བ། ཏིག་ `{ $tag }` ཆོག་པ་མིན། དེའི་ཁྱད་ཆོས་ནོར་བར་སྲིད།

parse-close-tag-name-missing = DoenetML ནོར་བ། ཏིག་མིང་མེད་པའི་སྒོ་རྒྱག་ཏིག་རྙེད་བྱུང་། དཔེར་ན་ `</`

parse-attribute-value-unquoted = ཁྱད་ཆོས་ཀྱི་གནས་གོང་འདྲེན་རྟགས་ནང་བཞག་དགོས། `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ནོར་བ། སྒོ་རྒྱག་ཏིག་ `{ $tag }` རྙེད་བྱུང་། འོན་ཀྱང་དེ་དང་མཐུན་པའི་སྒོ་ཕྱེ་ཏིག་མེད

parse-close-tag-mismatched = DoenetML ནོར་བ། སྒོ་རྒྱག་ཏིག་མི་མཐུན། `</{ $expected }>` དགོས། `{ $found }` རྙེད་བྱུང་

parser-node-unconvertible = ཚིགས་ { $node } Dast ཚིགས་སུ་བསྒྱུར་མ་ཐུབ།

## Names

name-attribute-invalid =
    ཁྱད་ཆོས་ནོར་བ་ name='{ $name }'། { $reason ->
        [characters] མིང་ནང་ཡི་གེ་དང་གྲངས་ཀ་དང་འོག་ཐིག་གམ་ཐིག་རྟགས་ཁོ་ན་ཡོད་ཆོག
       *[start] མིང་ནི་ཡི་གེ་ཞིག་ནས་འགོ་ཚུགས་དགོས།
    }

component-name-invalid-start = ཆ་ཤས་ཀྱི་མིང་ནོར་བ་ "{ $name }"། མིང་ནི་ཡི་གེ་ཞིག་ནས་འགོ་ཚུགས་དགོས།

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched རིགས་ཀྱི་ལན་ལ་ video ཁྱད་ཆོས་ཡོད་དགོས

answer-video-watched-video-not-reference = videoWatched རིགས་ཀྱི་ལན་གྱི་ video ཁྱད་ཆོས་ནི་ཞིབ་འཇུག་ཞིག་ཡིན་དགོས

answer-name-not-single-text = ལན་གྱི་ name ཁྱད་ཆོས་ལ་ཡི་གེའི་ཕྲུ་གུ་གཅིག་ཁོ་ན་ཡོད་དགོས

## Referencing another document

external-doenetml-recursion-limit = རིམ་པ་ཧ་ཅང་མང་བའི་ལོག་འཁོར་གྱིས་ཕྱི་རོལ་གྱི་ DoenetML ལེན་མ་ཐུབ། འཁོར་བའི་ཞིབ་འཇུག་ཡོད་དམ།

external-doenetml-unavailable = { $attribute }="{ $uri }" ནས་ DoenetML ལེན་མ་ཐུབ

external-doenetml-type-mismatch = { $attribute }="{ $uri }" ནས་བླངས་པའི་ DoenetML ནོར་བ། དེ་ནི་ "{ $componentType }" ཆ་ཤས་རིགས་དང་མི་མཐུན

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ཁྱད་ཆོས་ `{ $from }` བོར་ཟིན། དེའི་ཚབ་ལ་ `{ $to }` བཀོལ་རོགས།
       *[other] [deprecation] `<{ $component }>` སྟེང་ཁྱད་ཆོས་ `{ $from }` བོར་ཟིན། དེའི་ཚབ་ལ་ `{ $to }` བཀོལ་རོགས།
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] ཁྱད་ཆོས་ `{ $from }` བོར་ཟིན་ཅིང་སྣང་མེད་དུ་བཞག `{ $to }` ཡང་བཀོད་ཡོད་པས་སོ།
       *[other] [deprecation] `<{ $component }>` སྟེང་ཁྱད་ཆོས་ `{ $from }` བོར་ཟིན་ཅིང་སྣང་མེད་དུ་བཞག `{ $to }` ཡང་བཀོད་ཡོད་པས་སོ།
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` སྟེང་ཁྱད་ཆོས་ `{ $attribute }` བོར་ཟིན་ཅིང་སྣང་མེད་དུ་བཞག

deprecated-attribute-to-child = [deprecation] `<{ $component }>` སྟེང་ཁྱད་ཆོས་ `{ $attribute }` བོར་ཟིན། དེའི་ཚབ་ལ་ `<{ $child }>` ཕྲུ་གུ་བཀོལ་རོགས།

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` སྟེང་ཁྱད་ཆོས་ `{ $attribute }` གི་གནས་གོང་ `{ $value }` བོར་ཟིན། དེའི་ཚབ་ལ་ `{ $to }` བཀོལ་རོགས།


## Language coverage

pluralize-english-only = `<pluralize>` ཡིས་དབྱིན་ཇིའི་མང་ཚིག་ཁོ་ན་བཟོ་ཐུབ་པས། { $locale } ནང་བྲིས་པའི་ཡིག་ཆའི་ནང་དེའི་ཡི་གེ་མ་བསྒྱུར་བར་གནས། མང་ཚིག་གི་རྣམ་པ་ཐད་ཀར་འབྲི་རོགས། ཡང་ན་ `pluralForm` ཁྱད་ཆོས་ཀྱིས་བཀོད་རོགས།


## Checking against the schema

schema-element-unrecognized = ཆ་ཤས་ `<{ $tag }>` ནི་ངོས་ཟིན་པའི་ Doenet ཆ་ཤས་མིན།

schema-element-not-allowed-at-root = ཆ་ཤས་ `<{ $tag }>` ཡིག་ཆའི་རྩ་བར་མི་ཆོག

schema-element-not-allowed-inside = ཆ་ཤས་ `<{ $tag }>` `<{ $parent }>` གི་ནང་མི་ཆོག

schema-attribute-unrecognized = ཆ་ཤས་ `<{ $tag }>` ལ་ `{ $attribute }` ཞེས་པའི་ཁྱད་ཆོས་མེད།

schema-attribute-value-not-allowed =
    { $isList ->
        [true] ཆ་ཤས་ `<{ $tag }>` གི་ `{ $attribute }` ཁྱད་ཆོས་ནི་རྒྱུ་ཆ་རེ་རེ་འདི་དག་ནང་ནས་གཅིག་ཡིན་པའི་ཐོ་གཞུང་ཞིག་ཡིན་དགོས། { $allowed }
       *[other] ཆ་ཤས་ `<{ $tag }>` གི་ `{ $attribute }` ཁྱད་ཆོས་འདི་དག་ནང་ནས་གཅིག་ཡིན་དགོས། { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ལ་རྣམ་པའི་མིང་ནོར་བ། རྣམ་པའི་མིང་ { $variantName } ནི་གདམ་ཁ་ { $numOptions } ནང་འབྱུང་ཡང་འདེམས་དགོས་པའི་གྲངས་ཀ་ནི་ { $numToSelect } ཡིན།

select-variant-name-without-options = select ལ་རྣམ་པ་འགའ་བཀོད་ཡོད་ཀྱང་སྲིད་པའི་རྣམ་པའི་མིང་ { $variantName } ལ་གདམ་ཁ་གང་ཡང་མ་བཀོད།

select-variant-name-not-possible = select ལ་བཀོད་པའི་རྣམ་པའི་མིང་ { $variantName } ནི་སྲིད་པའི་རྣམ་པའི་མིང་མིན།

select-too-few-options = { $numOptions } ཁོ་ནའི་ནང་ནས་ཆ་ཤས་ { $numToSelect } འདེམས་མི་ཐུབ།

select-from-sequence-too-few-values = རིང་ཚད་ { $length } ཡོད་པའི་གོ་རིམ་ནས་གནས་གོང་ { $numToSelect } འདེམས་མི་ཐུབ།

select-from-sequence-indices-count-mismatch = select ལ་བཀོད་པའི་གྲངས་རྟགས་ཀྱི་གྲངས་ཀ་དང་འདེམས་དགོས་པའི་གྲངས་ཀ་མཐུན་དགོས

select-from-sequence-indices-not-integers = select ལ་བཀོད་པའི་གྲངས་རྟགས་ཚང་མ་ཧྲིལ་གྲངས་ཡིན་དགོས

select-from-sequence-index-excluded = selectfromsequence གི་བཀོད་པའི་གྲངས་རྟགས་ནི་ཕུད་ཟིན་པ་ཞིག་རེད

select-from-sequence-indices-excluded-combination = selectfromsequence གི་བཀོད་པའི་གྲངས་རྟགས་ནི་ཕུད་ཟིན་པའི་སྡེབ་སྦྱོར་ཞིག་རེད

select-from-sequence-coprime-not-positive-integers = ཡོད་ཆའི་ཧྲིལ་གྲངས་མི་འདེམས་པས་སོ་སོར་མ་དག་པའི་སྡེབ་སྦྱོར་འདེམས་མི་ཐུབ།

select-from-sequence-coprime-common-factor = སོ་སོར་མ་དག་པའི་གྲངས་ཀ་འདེམས་མི་ཐུབ། སྲིད་པའི་གནས་གོང་ཚང་མར་བགོ་རྟགས་མཐུན་པ་ཞིག་ཡོད། ("from" ཡང་ན་ "to" གི་བཀོད་པའི་གནས་གོང་ནི་ "step" དང་སོ་སོར་མ་དག་པ་ཡིན་དགོས།)

select-from-sequence-coprime-single-number = 1 མིན་པའི་གྲངས་ཀ་གཅིག་པུ་ནས་སོ་སོར་མ་དག་པའི་སྡེབ་སྦྱོར་འདེམས་མི་ཐུབ།

select-from-sequence-excluded-too-many-combinations = selectFromSequence ནང་སྡེབ་སྦྱོར་གྱི་ 70% ལས་མང་བ་ཕུད་ཟིན

select-from-sequence-coprime-none-found = སོ་སོར་མ་དག་པའི་གྲངས་ཀ་འདེམས་མ་ཐུབ། སྲིད་པའི་གནས་གོང་ཚང་མར་བགོ་རྟགས་མཐུན་པ་ཞིག་ཡོད།

select-from-sequence-too-few-unique-values = རིང་ཚད་ { $numPossibleValues } ཡོད་པའི་གོ་རིམ་ནས་གནས་གོང་མི་འདྲ་བ་ { $numToSelect } འདེམས་མི་ཐུབ

select-prime-numbers-too-few-values = རིང་ཚད་ { $numValues } ཡོད་པའི་གཙོ་གྲངས་ཐོ་གཞུང་ནས་གནས་གོང་ { $numToSelect } འདེམས་མི་ཐུབ

select-prime-numbers-values-count-mismatch = select ལ་བཀོད་པའི་གནས་གོང་གི་གྲངས་ཀ་དང་འདེམས་དགོས་པའི་གྲངས་ཀ་མཐུན་དགོས

select-prime-numbers-values-not-prime = select prime number ལ་བཀོད་པའི་གནས་གོང་ཚང་མ་གཙོ་གྲངས་ཐོ་གཞུང་ནང་ཡོད་དགོས

select-prime-numbers-values-excluded-combination = selectPrimeNumbers གི་བཀོད་པའི་གནས་གོང་ནི་ཕུད་ཟིན་པའི་སྡེབ་སྦྱོར་ཞིག་རེད

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ནང་སྡེབ་སྦྱོར་གྱི་ 70% ལས་མང་བ་ཕུད་ཟིན

select-random-combination-fluke = ཧ་ཅང་སྲིད་དཀའ་བའི་གོ་སྐབས་ཤིག་གིས་བབ་ཅོལ་གནས་གོང་གི་སྡེབ་སྦྱོར་འདེམས་མ་ཐུབ

select-random-value-fluke = ཧ་ཅང་སྲིད་དཀའ་བའི་གོ་སྐབས་ཤིག་གིས་བབ་ཅོལ་གནས་གོང་འདེམས་མ་ཐུབ
