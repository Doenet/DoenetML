# Malayalam diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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

## `<lineSegment>`

# English separates these two only in the verb — "is ignored" against "are
# ignored" — and Malayalam covers both with one form, so the count selects
# nothing and the branch is dropped. `$attributesCount` goes unused here, as it
# does wherever a language makes no such distinction.
line-segment-attributes-ignored-with-endpoints = രണ്ട് അഗ്രബിന്ദുക്കൾ നൽകുമ്പോൾ { $attributes } അവഗണിക്കപ്പെടുന്നു

line-segment-attributes-ignored-with-endpoint-and-midpoint = ഒരു അഗ്രബിന്ദുവും ഒരു മധ്യബിന്ദുവും നൽകുമ്പോൾ { $attributes } അവഗണിക്കപ്പെടുന്നു

line-segment-midpoint-offset-without-midpoint = മധ്യബിന്ദു ഇല്ലാതെ midpointOffset നു ഒരു ഫലവുമില്ല

## `<line>`

line-points-undetermined-dimensions = നിർണയിക്കാത്ത മാനങ്ങളുള്ള ബിന്ദുക്കളിലൂടെ കടന്നുപോകുന്ന നേർരേഖ.

line-points-too-few-dimensions = നേർരേഖ കുറഞ്ഞത് രണ്ട് മാനങ്ങളുള്ള ബിന്ദുക്കളിലൂടെ കടന്നുപോകണം.

line-points-depend-on-variables = നേർരേഖ ചരങ്ങളെ ആശ്രയിക്കുന്ന ബിന്ദുക്കളിലൂടെ കടന്നുപോകുന്നു: { $variables }.

line-equation-invalid-format = { $variable1 }, { $variable2 } ചരങ്ങളിലുള്ള നേർരേഖാ സമവാക്യത്തിനു അസാധുവായ രൂപം.

## `<ray>`

ray-overprescribed-through = രശ്മി through, endpoint, direction എന്നിവയാൽ ഒരുമിച്ചു നിർദേശിക്കപ്പെട്ടിരിക്കുന്നു. നൽകിയ through അവഗണിക്കുന്നു.

ray-dimension-mismatch = രശ്മിയിൽ numDimensions ചേരുന്നില്ല.

## `<vector>`

vector-overprescribed-head = സദിശം head, tail, displacement എന്നിവയാൽ ഒരുമിച്ചു നിർദേശിക്കപ്പെട്ടിരിക്കുന്നു. നൽകിയ head അവഗണിക്കുന്നു.

vector-dimension-mismatch = സദിശത്തിൽ numDimensions ചേരുന്നില്ല.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` നു nearestPoint എന്ന അവസ്ഥാ ചരം ഇല്ലാത്തതിനാൽ അതിലേക്ക് ആകർഷിക്കാനാവില്ല.

constrain-to-without-nearest-point = `<{ $component }>` നു nearestPoint എന്ന അവസ്ഥാ ചരം ഇല്ലാത്തതിനാൽ അതിലേക്ക് പരിമിതപ്പെടുത്താനാവില്ല.

constrain-to-interior-without-nearest-point = `<{ $component }>` നു nearestPoint എന്ന അവസ്ഥാ ചരം ഇല്ലാത്തതിനാൽ അതിന്റെ ഉൾഭാഗത്തേക്ക് പരിമിതപ്പെടുത്താനാവില്ല.

## `<choiceInput>`

choice-input-label-position-ignored = ഇൻലൈൻ അല്ലാത്ത choiceInput നു labelPosition അവഗണിക്കപ്പെടുന്നു

## Ordering children by index

choice-input-indices-count-mismatch = സൂചികകളുടെ എണ്ണം choice ഉപഘടകങ്ങളുടെ എണ്ണവുമായി ചേരാത്തതിനാൽ choiceInput നു നൽകിയ സൂചികകൾ അവഗണിക്കുന്നു.

pretzel-indices-count-mismatch = സൂചികകളുടെ എണ്ണം problem ഉപഘടകങ്ങളുടെ എണ്ണവുമായി ചേരാത്തതിനാൽ problem നു നൽകിയ സൂചികകൾ അവഗണിക്കുന്നു.

shuffle-indices-count-mismatch = സൂചികകളുടെ എണ്ണം ഘടകങ്ങളുടെ എണ്ണവുമായി ചേരാത്തതിനാൽ shuffle നു നൽകിയ സൂചികകൾ അവഗണിക്കുന്നു.

indices-ignored-out-of-range = ചില സൂചികകൾ പരിധിക്കു പുറത്തായതിനാൽ { $component } നു നൽകിയ സൂചികകൾ അവഗണിക്കുന്നു.

pretzel-indices-repeated = ചില സൂചികകൾ ആവർത്തിച്ചതിനാൽ pretzel നു നൽകിയ സൂചികകൾ അവഗണിക്കുന്നു.

pretzel-circuit-first-index = circuit രീതിയിൽ ആദ്യ സൂചിക 1 ആയിരിക്കണം എന്നതിനാൽ pretzel നു നൽകിയ സൂചികകൾ അവഗണിക്കുന്നു.

## `<shuffle>` and `<sort>`

string-children-need-type = സ്ട്രിംഗ് ഉപഘടകങ്ങളുമായി `<{ $component }>` പ്രവർത്തിക്കാൻ `type` എന്ന ഗുണം നൽകണം.

invalid-type-defaulting-to-math = { $component } ഘടകത്തിനു { $type } എന്നത് അസാധുവായ type ആണ്. അത് math, text, number അല്ലെങ്കിൽ boolean എന്നിവയിലൊന്നാകണം. math ആയി സജ്ജമാക്കുന്നു.

string-not-valid-component-to-arrange = "{ $value }" എന്ന സ്ട്രിംഗ് { $component } ചെയ്യാൻ യോജിച്ച ഘടകമല്ല. അവഗണിക്കുന്നു.

## Types and variables

invalid-type-defaulting-to-number = { $type } എന്നത് അസാധുവായ type ആണ്, type number ആയി സജ്ജമാക്കുന്നു.

invalid-variable-value = ചരത്തിനു അസാധുവായ മൂല്യം: `{ $value }`

## Variants

variant-index-must-be-number = വകഭേദ സൂചിക { $index } ഒരു സംഖ്യയായിരിക്കണം

variant-index-must-be-integer = വകഭേദ സൂചിക { $index } ഒരു പൂർണസംഖ്യയായിരിക്കണം

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` നിരപേക്ഷ അളവുകൾക്കായി നടപ്പാക്കിയിട്ടില്ല. വീതികൾ ആപേക്ഷികമായി സജ്ജമാക്കുന്നു.

side-by-side-absolute-margins = `<{ $component }>` നിരപേക്ഷ അളവുകൾക്കായി നടപ്പാക്കിയിട്ടില്ല. മാർജിനുകൾ ആപേക്ഷികമായി സജ്ജമാക്കുന്നു.

side-by-side-no-block-child = അസാധുവായ `<{ $component }>`: അതിനു കുറഞ്ഞത് ഒരു ബ്ലോക്ക് ഉപഘടകമെങ്കിലും വേണം.

## `<label>`

label-for-ignored-on-graphical = ചിത്രാത്മക `<label>` ലെ `for` ഗുണം അവഗണിക്കപ്പെടുന്നു.

label-for-must-resolve-to-one = `<label>` ലെ `for` ഗുണം കൃത്യമായി ഒരു ഘടകത്തിലേക്കു നിർണയിക്കപ്പെടണം.

label-for-unresolved = `<label>` ലെ `for` ഗുണം ഒരു ഘടകത്തിലേക്കു നിർണയിക്കാനായില്ല.

label-for-answer-with-authored-inputs = `<label>` ലെ `for` ഗുണം, വ്യക്തമായി എഴുതിയ ഇൻപുട്ടുകളുള്ള `<answer>` നെ പരാമർശിക്കുന്നു; ഇൻപുട്ടിനെ നേരിട്ടു പരാമർശിക്കുക.

label-for-answer-without-input = `<label>` ലെ `for` ഗുണം, പേരു നൽകാൻ ഇൻപുട്ട് ഇല്ലാത്ത `<answer>` നെ പരാമർശിക്കുന്നു.

label-for-must-reference-input-or-answer = `<label>` ലെ `for` ഗുണം ഒരു ഇൻപുട്ടിനെയോ ഒരു ഉത്തരത്തെയോ പരാമർശിക്കണം.

## Accessibility

accessibility-short-description-or-decorative = പ്രാപ്യതയ്ക്കായി `<{ $component }>` നു ഒരു ചെറുവിവരണം വേണം അല്ലെങ്കിൽ അതിനെ അലങ്കാരമെന്നു രേഖപ്പെടുത്തണം.

accessibility-video-short-description = പ്രാപ്യതയ്ക്കായി `<video>` നു ഒരു ചെറുവിവരണം വേണം.

accessibility-input-short-description-or-label = പ്രാപ്യതയ്ക്കായി `<{ $component }>` നു ഒരു ചെറുവിവരണമോ ഒരു പേരോ വേണം.

accessibility-answer-input-short-description-or-label = പ്രാപ്യതയ്ക്കായി, ഒരു ഇൻപുട്ട് സൃഷ്ടിക്കുന്ന `<answer>` നു ഒരു ചെറുവിവരണമോ ഒരു പേരോ വേണം.

accessibility-short-description-contains-math = ചെറുവിവരണങ്ങളിൽ `<{ $component }>` പോലുള്ള ഗണിത ഘടകങ്ങൾ പാടില്ല. ഗണിതം വാക്കുകളിൽ എഴുതുക.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] വിഭാഗ ശീർഷക എഴുത്തിനു { $colorName } ന്റെ വൈരുദ്ധ്യം പോരാ (ഇരുണ്ട ശൈലി) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; കുറഞ്ഞത് { $threshold }:1 വേണം).
       *[other] വിഭാഗ ശീർഷക എഴുത്തിനു { $colorName } ന്റെ വൈരുദ്ധ്യം പോരാ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; കുറഞ്ഞത് { $threshold }:1 വേണം).
    }

## `<circle>`

circle-through-points-non-numerical = ബിന്ദുക്കൾക്കു സംഖ്യാ മൂല്യങ്ങളില്ലാത്ത സാഹചര്യത്തിൽ { $count } ബിന്ദുക്കളിലൂടെ കടന്നുപോകുന്ന `<circle>` നടപ്പാക്കിയിട്ടില്ല.

circle-too-many-through-points = 3 ൽ കൂടുതൽ ബിന്ദുക്കളിലൂടെ കടന്നുപോകുന്ന വൃത്തം കണക്കാക്കാനാവില്ല.

circle-overprescribed-radius-center-points = ആരം, കേന്ദ്രം, കടന്നുപോകുന്ന ബിന്ദുക്കൾ എന്നിവ മൂന്നും നൽകിയ വൃത്തം കണക്കാക്കാനാവില്ല.

circle-center-with-multiple-points = നൽകിയ കേന്ദ്രത്തോടെ 1 ൽ കൂടുതൽ ബിന്ദുവിലൂടെ കടന്നുപോകുന്ന വൃത്തം കണക്കാക്കാനാവില്ല.

circle-radius-too-small = വൃത്തം കണക്കാക്കാനാവില്ല: രണ്ടു ബിന്ദുക്കൾ തമ്മിലുള്ള അകലം { $distance } ആയതിനാൽ, നൽകിയ ആരം { $radius } വളരെ ചെറുതാണ്.

circle-radius-with-many-points = നൽകിയ ആരത്തോടെ രണ്ടിൽ കൂടുതൽ ബിന്ദുക്കളിലൂടെ കടന്നുപോകുന്ന വൃത്തം സൃഷ്ടിക്കാനാവില്ല.

circle-invalid-center-or-through-points = വൃത്തത്തിന്റെ കേന്ദ്രമോ കടന്നുപോകുന്ന ബിന്ദുക്കളോ അസാധുവാണ്.

circle-radius-center-with-multiple-points = നൽകിയ കേന്ദ്രത്തോടെ 1 ൽ കൂടുതൽ ബിന്ദുവിലൂടെ കടന്നുപോകുന്ന വൃത്തത്തിന്റെ ആരം കണക്കാക്കാനാവില്ല.

circle-change-radius-non-numerical = സംഖ്യാ മൂല്യമില്ലാത്ത ബിന്ദുക്കളിലൂടെ കടന്നുപോകുന്ന വൃത്തത്തിന്റെ ആരം മാറ്റാനാവില്ല

circle-radius-with-points-non-numerical = സംഖ്യാ മൂല്യങ്ങളില്ലാത്തപ്പോൾ, നൽകിയ ആരത്തോടെ ഒന്നിൽ കൂടുതൽ ബിന്ദുവിലൂടെ കടന്നുപോകുന്ന വൃത്തം സൃഷ്ടിക്കാനാവില്ല.

circle-change-center-non-numerical = സംഖ്യാ മൂല്യമില്ലാത്ത ബിന്ദുക്കളിലൂടെ കടന്നുപോകുന്ന വൃത്തത്തിന്റെ കേന്ദ്രം മാറ്റുന്നത് നടപ്പാക്കിയിട്ടില്ല.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] ഫലനത്തിന്റെ പ്രാന്തത്തിനു മതിയായ മാനങ്ങളില്ല. പ്രാന്തത്തിൽ { $intervals } ഇടവേളയുണ്ട്, എന്നാൽ ഫലനത്തിനു { $inputs ->
            [one] { $inputs } ഇൻപുട്ട്
           *[other] { $inputs } ഇൻപുട്ടുകൾ
        } ഉണ്ട്.
       *[other] ഫലനത്തിന്റെ പ്രാന്തത്തിനു മതിയായ മാനങ്ങളില്ല. പ്രാന്തത്തിൽ { $intervals } ഇടവേളകളുണ്ട്, എന്നാൽ ഫലനത്തിനു { $inputs ->
            [one] { $inputs } ഇൻപുട്ട്
           *[other] { $inputs } ഇൻപുട്ടുകൾ
        } ഉണ്ട്.
    }

function-domain-invalid-format = ഫലനത്തിന്റെ പ്രാന്തത്തിനു അസാധുവായ രൂപം.

function-ignoring-non-numerical =
    { $type ->
        [maximum] ഫലനത്തിന്റെ സംഖ്യേതര പരമാവധി അവഗണിക്കുന്നു.
        [minimum] ഫലനത്തിന്റെ സംഖ്യേതര ഏറ്റവും കുറഞ്ഞ മൂല്യം അവഗണിക്കുന്നു.
        [extremum] ഫലനത്തിന്റെ സംഖ്യേതര അന്ത്യമൂല്യം അവഗണിക്കുന്നു.
        [point] ഫലനത്തിന്റെ സംഖ്യേതര ബിന്ദു അവഗണിക്കുന്നു.
        [slope] ഫലനത്തിന്റെ സംഖ്യേതര ചരിവ് അവഗണിക്കുന്നു.
       *[other] ഫലനത്തിന്റെ സംഖ്യേതര { $type } അവഗണിക്കുന്നു.
    }

function-ignoring-empty =
    { $type ->
        [maximum] ഫലനത്തിന്റെ ശൂന്യമായ പരമാവധി അവഗണിക്കുന്നു.
        [minimum] ഫലനത്തിന്റെ ശൂന്യമായ ഏറ്റവും കുറഞ്ഞ മൂല്യം അവഗണിക്കുന്നു.
        [extremum] ഫലനത്തിന്റെ ശൂന്യമായ അന്ത്യമൂല്യം അവഗണിക്കുന്നു.
        [point] ഫലനത്തിന്റെ ശൂന്യമായ ബിന്ദു അവഗണിക്കുന്നു.
       *[other] ഫലനത്തിന്റെ ശൂന്യമായ { $type } അവഗണിക്കുന്നു.
    }

function-points-too-close = ഫലനത്തിൽ വളരെ അടുത്തടുത്തുള്ള രണ്ടു ബിന്ദുക്കളുണ്ട്. ഫലനം നിർവചിക്കാനാവില്ല.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] ഫലനത്തിന്റെ ഇൻപുട്ടുകളുടെ എണ്ണം ഔട്ട്പുട്ടുകളുടെ എണ്ണത്തിനു തുല്യമെങ്കിൽ മാത്രമേ ഫലന ആവർത്തനങ്ങൾ സാധ്യമാകൂ. ഈ ഫലനത്തിനു { $inputs } ഇൻപുട്ടും { $outputs ->
            [one] { $outputs } ഔട്ട്പുട്ടും
           *[other] { $outputs } ഔട്ട്പുട്ടുകളും
        } ഉണ്ട്.
       *[other] ഫലനത്തിന്റെ ഇൻപുട്ടുകളുടെ എണ്ണം ഔട്ട്പുട്ടുകളുടെ എണ്ണത്തിനു തുല്യമെങ്കിൽ മാത്രമേ ഫലന ആവർത്തനങ്ങൾ സാധ്യമാകൂ. ഈ ഫലനത്തിനു { $inputs } ഇൻപുട്ടുകളും { $outputs ->
            [one] { $outputs } ഔട്ട്പുട്ടും
           *[other] { $outputs } ഔട്ട്പുട്ടുകളും
        } ഉണ്ട്.
    }

## `<sequence>`

sequence-invalid-length = ശ്രേണിയുടെ നീളം അസാധുവാണ്. അത് ഒരു ഋണേതര പൂർണസംഖ്യയായിരിക്കണം.

sequence-invalid-step = ശ്രേണിയുടെ പടി അസാധുവാണ്. { $type } തരം ശ്രേണിക്കു അത് ഒരു സംഖ്യയായിരിക്കണം.

sequence-invalid-endpoint-number = സംഖ്യാ ശ്രേണിയുടെ "{ $attribute }" അസാധുവാണ്. അത് ഒരു സംഖ്യയായിരിക്കണം.

sequence-invalid-endpoint-letters = അക്ഷര ശ്രേണിയുടെ "{ $attribute }" അസാധുവാണ്. അത് ഒരു അക്ഷര സംയോഗമായിരിക്കണം.

sequence-invalid-endpoint = ശ്രേണിയുടെ "{ $attribute }" അസാധുവാണ്.

select-from-sequence-coprime-not-numbers = സംഖ്യകൾ തിരഞ്ഞെടുക്കാത്തതിനാൽ coprime അവഗണിക്കുന്നു

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations നൽകിയതിനാൽ coprime അവഗണിക്കുന്നു

## Resolving a `target`

target-not-found = `<{ $source }>` നു അസാധുവായ target: ലക്ഷ്യം കണ്ടെത്താനായില്ല.

target-state-variable-not-found = `<{ $source }>` നു അസാധുവായ target: `<{ $component }>` ൽ "{ $property }" എന്ന പേരുള്ള അവസ്ഥാ ചരം കണ്ടെത്താനായില്ല.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` ന്റെ ചരങ്ങൾ സ്വതന്ത്ര ചരത്തിൽ നിന്നു വ്യത്യസ്തമായിരിക്കണം.

ode-system-duplicate-variable-names = ഒരേ ആശ്രിത ചരനാമങ്ങളോടെ ODE RHS ഫലനങ്ങൾ നിർവചിക്കാനാവില്ല.

ode-system-rhs-function-error = ODE RHS ഫലനം നിർവചിക്കാനാവില്ല. mathjs ഫലനം സൃഷ്ടിക്കുന്നതിൽ പിശക്.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } നേർരേഖകൾക്കിടയിലുള്ള കോൺ നിർവചിക്കാനാവില്ല

angle-invalid-through-point = `<angle>` ന്റെ through ൽ അസാധുവായ ബിന്ദു

parabola-vertex-too-many-points = ശീർഷത്തോടെ 1 ൽ കൂടുതൽ ബിന്ദുവിലൂടെ കടന്നുപോകുന്ന പരവലയം നടപ്പാക്കിയിട്ടില്ല.

parabola-too-many-points = 3 ൽ കൂടുതൽ ബിന്ദുക്കളിലൂടെ കടന്നുപോകുന്ന പരവലയം നടപ്പാക്കിയിട്ടില്ല.

intersection-too-many-items = രണ്ടിൽ കൂടുതൽ ഇനങ്ങൾക്കുള്ള ഛേദനം നടപ്പാക്കിയിട്ടില്ല

## Other math components

ionic-compound-not-two-ions = രണ്ട് അയോണുകളല്ലാതെ മറ്റൊന്നിനും അയോണിക സംയുക്തം നടപ്പാക്കിയിട്ടില്ല.

ionic-compound-needs-cation-and-anion = ഒരു കാറ്റയോണിനും ഒരു ആനയോണിനും മാത്രമേ അയോണിക സംയുക്തം നടപ്പാക്കിയിട്ടുള്ളൂ.

solve-equations-cannot-evaluate = സമവാക്യം മൂല്യനിർണയം ചെയ്യാനാവാത്തതിനാൽ അതു നിർധാരണം ചെയ്യാനാവില്ല: { $equation }

math-operators-operand-number-required = ഒരു ഗണിത ഉപാംഗം വേർതിരിക്കുമ്പോൾ operandNumber നൽകണം.

eigen-decomposition-failed = മാട്രിക്സിന്റെ ഐഗൻ മൂല്യങ്ങൾ കണക്കാക്കാനായില്ല

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } എന്ന പരാമീറ്റർ മാതൃകയിൽ വരാത്തതിനാൽ അതു എപ്പോഴും ഒരു ശൂന്യതയോടു ചേരും.
       *[other] `<matchesPattern>`: { $parameters } എന്നീ പരാമീറ്ററുകൾ മാതൃകയിൽ വരാത്തതിനാൽ അവ എപ്പോഴും ഒരു ശൂന്യതയോടു ചേരും.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" വ്യാഖ്യാനിക്കാനായില്ല. അത് none, medium, dense അല്ലെങ്കിൽ ഒരു സ്പേസ് കൊണ്ടു വേർതിരിച്ച രണ്ടു ധന സംഖ്യകൾ — ഉദാഹരണത്തിനു grid="1 0.5" — ആയിരിക്കണം. ഗ്രിഡ് വരച്ചിട്ടില്ല.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure റെൻഡററിൽ xLabelPosition="left" പിന്തുണയ്ക്കുന്നില്ല; വലതു-സ്ഥാന സ്വഭാവം ഉപയോഗിക്കുന്നു.

prefigure-y-label-position-unsupported = `<graph>`: prefigure റെൻഡററിൽ yLabelPosition="bottom" പിന്തുണയ്ക്കുന്നില്ല; മുകൾ-സ്ഥാന സ്വഭാവം ഉപയോഗിക്കുന്നു.

prefigure-invalid-axis-bounds = `<graph>`: prefigure പരിവർത്തനത്തിനു അക്ഷ പരിധികൾ അസാധുവാണ്; സ്ഥിരസ്ഥിതി bbox (-10,-10,10,10) ഉപയോഗിക്കുന്നു.

prefigure-invalid-width = `<graph>`: prefigure പരിവർത്തനത്തിനു വീതി അസാധുവാണ്; സ്ഥിരസ്ഥിതി ഡയഗ്രം വീതി 425 ഉപയോഗിക്കുന്നു.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure പരിവർത്തനത്തിനു aspectRatio അസാധുവാണ്; സ്ഥിരസ്ഥിതി അനുപാതം 1 ഉപയോഗിക്കുന്നു.

prefigure-grid-spacing-too-fine = `<graph>`: അക്ഷ പരിധികൾക്കു ഗ്രിഡ് അകലം വളരെ സൂക്ഷ്മമാണ്; prefigure റെൻഡററിൽ ഗ്രിഡ് ഒഴിവാക്കുന്നു.

prefigure-annotations-not-rendered = `<graph>`: PreFigure റെൻഡറർ ഉപയോഗിക്കാത്തപ്പോൾ കുറിപ്പുകൾ കാണിക്കില്ല.

multiple-annotations-children = `<graph>` ൽ ഒന്നിലധികം `<annotations>` ഉപഘടകങ്ങൾ കണ്ടെത്തി; അവസാനത്തേതൊഴികെ ബാക്കിയെല്ലാം അവഗണിക്കുന്നു.

## Referring to other components

copy-unrecognized-component-type = തിരിച്ചറിയാത്ത ഘടക തരം വികസിപ്പിക്കാനോ പകർത്താനോ ആവില്ല: { $type }.

copy-prop-not-found = { $component } തരത്തിലുള്ള ഘടകത്തിൽ { $property } എന്ന ഗുണം കണ്ടെത്താനായില്ല

collect-no-source = collect നു സ്രോതസ്സൊന്നും കണ്ടെത്തിയില്ല.

collect-invalid-component-type = `<{ $component }>` അസാധുവായ ഘടക തരമായതിനാൽ ആ തരത്തിലുള്ള ഘടകങ്ങൾ ശേഖരിക്കാനാവില്ല.

reference-index-unavailable = `{ $reference }` എന്ന സൂചിക പരാമർശിക്കാനാവില്ല

## `<callAction>`

component-action-unavailable = `{ $reference }` ഘടകത്തിൽ { $action } വിളിക്കാനാവില്ല

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ഡാറ്റയുടെ രൂപം അസാധുവാണ്. വരികളുടെ നീളങ്ങൾ പൊരുത്തമില്ലാത്തതാണ്. componentIdx :{ $componentIdx } ൽ കണ്ടെത്തി

data-frame-duplicate-column-names = ഡാറ്റയിൽ നിരകളുടെ പേരുകൾ ആവർത്തിക്കുന്നു. componentIdx :{ $componentIdx } ൽ കണ്ടെത്തി

data-frame-missing-column-name = ഡാറ്റയിൽ ഒരു നിരയുടെ പേരില്ല. componentIdx :{ $componentIdx } ൽ കണ്ടെത്തി

## `<answer>` and scoring

answer-award-depends-on-own-response = ഈ ഉത്തരത്തിന്റെ ഒരു award, അതേ answer ടാഗ് സമർപ്പിച്ച ഉത്തരത്തെത്തന്നെ ആശ്രയിക്കുന്നു; ഇത് അപ്രതീക്ഷിത സ്വഭാവത്തിലേക്കു നയിക്കും.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` ഉള്ള ഒരു പാത്രത്തിനുള്ളിലെ `<answer>` ൽ `maxNumAttempts` സജ്ജമാക്കുന്നതിനു ഫലമില്ല; ശ്രമങ്ങളുടെ എണ്ണം ആ പാത്രമാണു നിയന്ത്രിക്കുന്നത്. `maxNumAttempts` പാത്രത്തിൽ സജ്ജമാക്കുക.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` ഉള്ള മറ്റൊരു പാത്രത്തിനുള്ളിലെ, `sectionWideCheckWork` ഉള്ള പാത്രത്തിൽ `maxNumAttempts` സജ്ജമാക്കുന്നതിനു ഫലമില്ല; ശ്രമങ്ങളുടെ എണ്ണം പുറത്തെ പാത്രമാണു നിയന്ത്രിക്കുന്നത്. `maxNumAttempts` പുറത്തെ പാത്രത്തിൽ സജ്ജമാക്കുക.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality സജ്ജമാക്കാതെ { $attributes } ഗുണത്തിനു ഫലമില്ല.
       *[other] symbolicEquality സജ്ജമാക്കാതെ { $attributes } ഗുണങ്ങൾക്കു ഫലമില്ല.
    }

answer-invalid-type = ഉത്തരത്തിനു അസാധുവായ തരം: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` ഘടകത്തിനു പേരില്ലാത്തതിനാൽ, അതിനെ module ഗുണമായി ഉപയോഗിക്കാനാവില്ല

module-attribute-name-already-defined = `<module>` ഘടക തരത്തിൽ "{ $name }" എന്ന ഗുണം നേരത്തേ നിർവചിച്ചിട്ടുള്ളതിനാൽ, `<{ $component } name="{ $name }">` എന്ന ഘടകത്തെ module ന്റെ ഗുണമായി ഉപയോഗിക്കാനാവില്ല.

conditional-content-condition-ignored = case അല്ലെങ്കിൽ else ഉപഘടകങ്ങളുള്ള `<conditionalContent>` ഘടകത്തിൽ `condition` ഗുണം അവഗണിക്കപ്പെടുന്നു.

slider-markers-type-mismatch = അടയാളങ്ങളുടെ തരം slider ന്റെ തരവുമായി ചേരുന്നില്ല.

pretzel-problem-needs-statement-and-answer = അസാധുവായ pretzel: ഓരോ `<problem>` ലും ഒരു `<statement>` ഉം ഒരു `<answer>` ഉം വേണം.

pretzel-circuit-first-problem-distractor = അസാധുവായ pretzel: mode="circuit" ൽ ആദ്യത്തെ `<problem>` ഒരു വ്യതിചലിപ്പിക്കുന്നതാകരുത്.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` ഗുണത്തിനു അസാധുവായ മൂല്യം { $values }; അവഗണിക്കുന്നു.
       *[other] `{ $attribute }` ഗുണത്തിനു അസാധുവായ മൂല്യങ്ങൾ { $values }; അവഗണിക്കുന്നു.
    }

attribute-must-be-references = `{ $attribute }` ഗുണത്തിനു `{ $value }` അസാധുവായ മൂല്യമാണ്. ആ ഗുണം `$` ൽ തുടങ്ങുന്ന പരാമർശങ്ങൾ കൊണ്ടുള്ളതായിരിക്കണം.

math-input-invalid-function-names = <mathInput>: { $attribute } ലെ അസാധുവായ ഫലന നാമ(ങ്ങ)ം അവഗണിച്ചു: { $names }. ഓരോ പേരിന്റെയും പ്രദർശന ഭാഗം കുറഞ്ഞത് 2 അക്ഷരങ്ങൾ (അക്ഷരങ്ങളോ വരകളോ) ഉള്ളതായിരിക്കണം; അതിനുശേഷം ഐച്ഛികമായി `|<mathspeak alternative>` എന്ന പ്രത്യയം വരാം.

## Building components from the source

component-type-invalid = അസാധുവായ ഘടക തരം: `<{ $componentType }>`

attribute-repeated = { $attribute } ഗുണം ആവർത്തിക്കാനാവില്ല.

attribute-invalid-for-component = `<{ $componentType }>` തരത്തിലുള്ള ഘടകത്തിനു "{ $attribute }" അസാധുവായ ഗുണമാണ്.

## Style definition contrast

style-definition-insufficient-contrast =
    ശൈലി നിർവചനം { $styleNumber } ൽ { $context ->
        [text-on-background] പശ്ചാത്തല നിറത്തിനെതിരെ എഴുത്തിന്റെ നിറത്തിന്റെ
        [high-contrast] ക്യാൻവാസിനെതിരെ ഉയർന്ന-വൈരുദ്ധ്യ നിറത്തിന്റെ
        [line] ക്യാൻവാസിനെതിരെ രേഖയുടെ നിറത്തിന്റെ
        [marker] ക്യാൻവാസിനെതിരെ അടയാളത്തിന്റെ നിറത്തിന്റെ
       *[text-on-canvas] ക്യാൻവാസിനെതിരെ എഴുത്തിന്റെ നിറത്തിന്റെ
    } വൈരുദ്ധ്യം പോരാ{ $mode ->
        [dark] { " (ഇരുണ്ട ശൈലി)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; കുറഞ്ഞത് { $threshold }:1 വേണം).

style-definition-dark-mode-text-background-contrast =
    ശൈലി നിർവചനം { $styleNumber } വെളിച്ച ശൈലിക്കു മതിയായ വൈരുദ്ധ്യം നൽകുന്ന നിറങ്ങൾ നൽകിയിട്ടുണ്ടെങ്കിലും, അവയിൽ നിന്നു ലഭിച്ച ഇരുണ്ട ശൈലിയുടെ നിറങ്ങളിൽ പശ്ചാത്തല നിറത്തിനെതിരെ എഴുത്തിന്റെ നിറത്തിന്റെ വൈരുദ്ധ്യം പോരാ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; കുറഞ്ഞത് { $threshold }:1 വേണം). { $suggestion ->
        [available] ഇരുണ്ട ശൈലിയിൽ മതിയായ വൈരുദ്ധ്യം ഉറപ്പാക്കാൻ, വെളിച്ച ശൈലിയുടെ വൈരുദ്ധ്യം കൂട്ടുക (ഉദാ. { $lightAttribute }="{ $lightColor }" സജ്ജമാക്കുക) അല്ലെങ്കിൽ ഇരുണ്ട ശൈലിയുടെ നിറം മറികടക്കുക (ഉദാ. { $darkAttribute }="{ $darkColor }" സജ്ജമാക്കുക).
       *[none] ഇരുണ്ട ശൈലിയിൽ മതിയായ വൈരുദ്ധ്യം ഉറപ്പാക്കാൻ, വെളിച്ച ശൈലിയുടെ വൈരുദ്ധ്യം കൂട്ടുക അല്ലെങ്കിൽ ലഭിച്ച നിറങ്ങൾ textColorDarkMode കൂടാതെ/അല്ലെങ്കിൽ backgroundColorDarkMode കൊണ്ടു മറികടക്കുക.
    }

style-definition-dark-mode-text-canvas-contrast =
    ശൈലി നിർവചനം { $styleNumber } വെളിച്ച ശൈലിക്കു മതിയായ വൈരുദ്ധ്യം നൽകുന്ന എഴുത്തുനിറം നൽകിയിട്ടുണ്ടെങ്കിലും, അതിൽ നിന്നു ലഭിച്ച ഇരുണ്ട ശൈലിയുടെ എഴുത്തുനിറത്തിനു ക്യാൻവാസിനെതിരെ വൈരുദ്ധ്യം പോരാ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; കുറഞ്ഞത് { $threshold }:1 വേണം). { $suggestion ->
        [available] ഇരുണ്ട ശൈലിയിൽ മതിയായ വൈരുദ്ധ്യം ഉറപ്പാക്കാൻ, വെളിച്ച ശൈലിയുടെ വൈരുദ്ധ്യം കൂട്ടുക (ഉദാ. textColor="{ $lightColor }" സജ്ജമാക്കുക) അല്ലെങ്കിൽ ഇരുണ്ട ശൈലിയുടെ നിറം മറികടക്കുക (ഉദാ. textColorDarkMode="{ $darkColor }" സജ്ജമാക്കുക).
       *[none] ഇരുണ്ട ശൈലിയിൽ മതിയായ വൈരുദ്ധ്യം ഉറപ്പാക്കാൻ, വെളിച്ച ശൈലിയുടെ വൈരുദ്ധ്യം കൂട്ടുക അല്ലെങ്കിൽ ലഭിച്ച നിറം textColorDarkMode കൊണ്ടു മറികടക്കുക.
    }

section-multiple-style-palettes = ഒരു വിഭാഗത്തിനു ഒരൊറ്റ <stylePalette> മാത്രമേ തിരഞ്ഞെടുക്കാനാവൂ; അവസാനത്തേത് ഉപയോഗിക്കുന്നു.

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect ഒരു ഋണേതര പൂർണസംഖ്യ അല്ലാത്തതിനാൽ { $component } ന്റെ അനന്യ വകഭേദങ്ങൾ നിർണയിക്കാനാവില്ല.

variant-num-to-select-not-constant-number = numToSelect ഒരു സ്ഥിര സംഖ്യ അല്ലാത്തതിനാൽ { $component } ന്റെ അനന്യ വകഭേദങ്ങൾ നിർണയിക്കാനാവില്ല.

variant-with-replacement-not-constant-boolean = withReplacement ഒരു സ്ഥിര boolean അല്ലാത്തതിനാൽ { $component } ന്റെ അനന്യ വകഭേദങ്ങൾ നിർണയിക്കാനാവില്ല.

variant-select-weight-disables-unique = selectWeight അല്ലെങ്കിൽ selectForVariants നൽകിയ ഒരു ഐച്ഛികമുണ്ടെങ്കിൽ select നു അനന്യ വകഭേദങ്ങൾ പ്രവർത്തനരഹിതമാക്കും

variant-coprime-undetermined = coprime എപ്പോഴും തെറ്റാണെന്നു നിർണയിക്കാനാവാത്തതിനാൽ { $component } ന്റെ അനന്യ വകഭേദങ്ങൾ നിർണയിക്കാനാവില്ല.

variant-attribute-not-constant = { $attribute } ഒരു സ്ഥിരാങ്കം അല്ലാത്തതിനാൽ { $component } ന്റെ അനന്യ വകഭേദങ്ങൾ നിർണയിക്കാനാവില്ല.

variant-attribute-not-number = { $attribute } ഒരു സംഖ്യ അല്ലാത്തതിനാൽ { $component } ന്റെ അനന്യ വകഭേദങ്ങൾ നിർണയിക്കാനാവില്ല.

variant-attribute-wrong-type-for-sequence =
    { $attribute } എന്നത് { $expected ->
        [letters-combination] ഒരു അക്ഷര സംയോഗം
        [math-expression] സാധുവായ ഒരു ഗണിത വ്യഞ്ജകം
        [integer] ഒരു പൂർണസംഖ്യ
       *[number] ഒരു സംഖ്യ
    } അല്ലാത്തതിനാൽ { $type } തരത്തിലുള്ള { $component } ന്റെ അനന്യ വകഭേദങ്ങൾ നിർണയിക്കാനാവില്ല.

variant-length-not-integer = length ഒരു പൂർണസംഖ്യ അല്ലാത്തതിനാൽ { $component } ന്റെ അനന്യ വകഭേദങ്ങൾ നിർണയിക്കാനാവില്ല.

variant-sort-not-implemented = sort ഉള്ള { $component } ന്റെ അനന്യ വകഭേദങ്ങൾ നടപ്പാക്കിയിട്ടില്ല

variant-exclude-combinations-not-implemented = excludeCombinations ഉള്ള { $component } ന്റെ അനന്യ വകഭേദങ്ങൾ നടപ്പാക്കിയിട്ടില്ല

variant-math-exclude-not-implemented = exclude ഉള്ള math തരത്തിലുള്ള { $component } ന്റെ അനന്യ വകഭേദങ്ങൾ നടപ്പാക്കിയിട്ടില്ല

variant-non-constant-exclude-not-implemented = സ്ഥിരമല്ലാത്ത exclude ഉള്ള { $component } ന്റെ അനന്യ വകഭേദങ്ങൾ നടപ്പാക്കിയിട്ടില്ല

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure റെൻഡററിൽ പിന്തുണയ്ക്കുന്നില്ല; പിൻഗാമിയെ ഒഴിവാക്കി.

prefigure-descendant-invalid-geometry = { $subject }: അപരിമിതമോ അപൂർണമോ ആയ ജ്യാമിതി; പിൻഗാമിയെ ഒഴിവാക്കി.

prefigure-curve-label-omitted = { $subject }: പരിവർത്തനം ചെയ്ത വക്രരേഖാ ഘടകങ്ങളിൽ പേരുകൾ പിന്തുണയ്ക്കുന്നില്ല; പേര് ഒഴിവാക്കി.

prefigure-curve-unsupported-definition-type = { $subject }: പിന്തുണയ്ക്കാത്ത വക്രരേഖാ ഫലന നിർവചന തരം '{ $definitionType }'; പിൻഗാമിയെ ഒഴിവാക്കി.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves ൽ പിന്തുണയ്ക്കാത്ത flipFunctions ഗുണം; പിൻഗാമിയെ ഒഴിവാക്കി.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves ൽ സൂത്ര തരത്തിലുള്ള ഉപഘടക ഫലനങ്ങൾ മാത്രമേ പിന്തുണയ്ക്കുന്നുള്ളൂ; പിൻഗാമിയെ ഒഴിവാക്കി.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] രേഖാ കുടുംബത്തിന്റെ പേരിനു
       *[point] ബിന്ദുവിന്റെ പേരിനു
    } പിന്തുണയ്ക്കാത്ത labelPosition '{ $labelPosition }'; സ്ഥിരസ്ഥിതി PreFigure വിന്യാസം ഉപയോഗിച്ചു.

prefigure-fill-style-unsupported = { $subject }: നിറയ്ക്കൽ ശൈലി '{ $fillStyle }' PreFigure പിന്തുണയ്ക്കുന്നില്ല; ഘന നിറയ്ക്കലിലേക്കു മടങ്ങുന്നു.

prefigure-line-style-unknown = { $subject }: അജ്ഞാത രേഖാ ശൈലി '{ $lineStyle }' PreFigure ഔട്ട്പുട്ടിൽ നിന്നു ഒഴിവാക്കി.

prefigure-marker-style-mapped-to-diamond = { $subject }: അടയാള ശൈലി '{ $markerStyle }' PreFigure ശൈലി 'diamond' ലേക്കു ചേർത്തു.

prefigure-marker-style-unsupported = { $subject }: അടയാള ശൈലി '{ $markerStyle }' PreFigure പിന്തുണയ്ക്കുന്നില്ല; സ്ഥിരസ്ഥിതി ശൈലി ഉപയോഗിച്ചു.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: അസാധുവായ `ref`; ലക്ഷ്യം നിർണയിക്കാനായില്ല. കുറിപ്പ് ഒഴിവാക്കി.

annotation-ref-multiple-targets = `<annotation>`: `ref` ഒന്നിലധികം ലക്ഷ്യങ്ങളിലേക്കു നിർണയിക്കപ്പെട്ടു; ആദ്യ ലക്ഷ്യം ഉപയോഗിക്കുന്നു.

annotation-ref-outside-graph = `<annotation>`: അസാധുവായ `ref`; ലക്ഷ്യം അതുൾക്കൊള്ളുന്ന ഗ്രാഫിനു പുറത്താണ്. കുറിപ്പ് ഒഴിവാക്കി.

annotation-ref-unsupported-target = `<annotation>`: അസാധുവായ `ref`; prefigure പരിവർത്തനത്തിൽ ലക്ഷ്യം പിന്തുണയ്ക്കുന്ന ചിത്രാത്മക വസ്തുവല്ല. കുറിപ്പ് ഒഴിവാക്കി.

annotation-text-missing = `<annotation>`: `text` ഇല്ല അല്ലെങ്കിൽ ശൂന്യമാണ്; ശൂന്യമായ എഴുത്തു നൽകുന്നു.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] വൃത്താകാര ആശ്രിതത്വം കണ്ടെത്തി.
       *[other] `<{ $componentType }>` ഘടകം ഉൾപ്പെട്ട വൃത്താകാര ആശ്രിതത്വം കണ്ടെത്തി.
    }

reference-no-referent = ഈ പരാമർശത്തിനു ഒന്നും കണ്ടെത്തിയില്ല: `{ $reference }`

reference-multiple-referents = ഈ പരാമർശത്തിനു ഒന്നിലധികം ലക്ഷ്യങ്ങൾ കണ്ടെത്തി: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ന്റെ { $attribute } ഗുണത്തിനു അസാധുവായ രൂപം.

children-invalid = `<{ $componentType }>` നു അസാധുവായ ഉപഘടകങ്ങൾ: അസാധുവായ ഉപഘടകങ്ങൾ കണ്ടെത്തി: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` ഗുണത്തിനു `{ $value }` അസാധുവായ മൂല്യമാണ്, `{ $default }` എന്ന മൂല്യം ഉപയോഗിക്കുന്നു

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML പതിപ്പ് { $version } കണ്ടെത്തിയില്ല.
       *[other] DoenetML പതിപ്പ് { $version } കണ്ടെത്തിയില്ല. പതിപ്പ് { $fallback } ഉപയോഗിക്കുന്നു
    }

## Reading the DoenetML

parse-invalid-doenetml = അസാധുവായ DoenetML: { $content }

parse-tag-missing-close-tag = അസാധുവായ DoenetML: `{ $tag }` ടാഗിനു അടയ്ക്കുന്ന ടാഗ് ഇല്ല. സ്വയം-അടയുന്ന ടാഗോ `</{ $tagName }>` ടാഗോ പ്രതീക്ഷിച്ചു.

parse-tag-error = അസാധുവായ DoenetML: `<{ $tagName }>` ടാഗിൽ പിശക്

parse-attribute-missing-value = അസാധുവായ DoenetML: `{ $attribute }` എന്ന അസാധുവായ ഗുണത്തിനു മൂല്യം ഇല്ലെന്നു തോന്നുന്നു.

parse-attribute-invalid = അസാധുവായ DoenetML: അസാധുവായ ഗുണം `{ $attribute }`

parse-attribute-value-invalid = അസാധുവായ DoenetML: അസാധുവായ ഗുണ മൂല്യം `{ $value }`

parse-attribute-value-quote-mismatch = അസാധുവായ DoenetML: അസാധുവായ ഗുണ മൂല്യം `{ $value }`. ഉദ്ധരണ ചിഹ്നങ്ങൾ ചേരുന്നില്ല. `{ $quote }` ഇല്ലെന്നു തോന്നുന്നു

parse-open-tag-name-missing = അസാധുവായ DoenetML: പേരില്ലാത്ത ഒരു ടാഗ് കണ്ടെത്തി, ഉദാ. `<`

parse-tag-not-closed = അസാധുവായ DoenetML: `{ $tag }` ടാഗ് അടച്ചിട്ടില്ല (`>` ഇല്ലെന്നു തോന്നുന്നു).

parse-self-closing-tag-name-missing = അസാധുവായ DoenetML: പേരില്ലാത്ത ഒരു ടാഗ് കണ്ടെത്തി `<{ $content }>`

parse-self-closing-tag-not-closed = അസാധുവായ DoenetML: `{ $tag }` ടാഗ് അടച്ചിട്ടില്ല (`/>` ഇല്ലെന്നു തോന്നുന്നു).

parse-tag-invalid-attributes = അസാധുവായ DoenetML: `{ $tag }` ടാഗ് സാധുവല്ല. അതിന്റെ ഗുണങ്ങൾ തെറ്റായിരിക്കാം.

parse-close-tag-name-missing = അസാധുവായ DoenetML: പേരില്ലാത്ത ഒരു അടയ്ക്കുന്ന ടാഗ് കണ്ടെത്തി, ഉദാ. `</`

parse-attribute-value-unquoted = ഗുണ മൂല്യങ്ങൾ ഉദ്ധരണ ചിഹ്നങ്ങൾക്കുള്ളിൽ വേണം: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = അസാധുവായ DoenetML: `{ $tag }` എന്ന അടയ്ക്കുന്ന ടാഗ് കണ്ടെത്തി, എന്നാൽ അതിനു ചേരുന്ന തുറക്കുന്ന ടാഗ് ഇല്ല

parse-close-tag-mismatched = അസാധുവായ DoenetML: അടയ്ക്കുന്ന ടാഗ് ചേരുന്നില്ല. `</{ $expected }>` പ്രതീക്ഷിച്ചു. `{ $found }` കണ്ടെത്തി

parser-node-unconvertible = { $node } എന്ന നോഡിനെ Dast നോഡാക്കി മാറ്റാനായില്ല.

## Names

name-attribute-invalid =
    അസാധുവായ ഗുണം name='{ $name }'. { $reason ->
        [characters] പേരുകളിൽ അക്ഷരങ്ങൾ, അക്കങ്ങൾ, അടിവരകൾ അല്ലെങ്കിൽ വരകൾ മാത്രമേ പാടുള്ളൂ.
       *[start] പേരുകൾ ഒരു അക്ഷരത്തിൽ തുടങ്ങണം.
    }

component-name-invalid-start = അസാധുവായ ഘടക നാമം "{ $name }". പേരുകൾ ഒരു അക്ഷരത്തിൽ തുടങ്ങണം.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched തരത്തിലുള്ള ഉത്തരത്തിനു ഒരു video ഗുണം വേണം

answer-video-watched-video-not-reference = videoWatched തരത്തിലുള്ള ഉത്തരത്തിന്റെ video ഗുണം ഒരു പരാമർശമായിരിക്കണം

answer-name-not-single-text = ഉത്തരത്തിന്റെ name ഗുണത്തിനു ഒരൊറ്റ text ഉപഘടകം വേണം

## Referencing another document

external-doenetml-recursion-limit = വളരെയധികം തലങ്ങളിലുള്ള ആവർത്തനം കാരണം പുറത്തുനിന്നുള്ള DoenetML ലഭ്യമാക്കാനായില്ല. വൃത്താകാര പരാമർശം വല്ലതുമുണ്ടോ?

external-doenetml-unavailable = { $attribute }="{ $uri }" ൽ നിന്നു DoenetML ലഭ്യമാക്കാനായില്ല

external-doenetml-type-mismatch = { $attribute }="{ $uri }" ൽ നിന്നു ലഭിച്ച DoenetML അസാധുവാണ്: അത് "{ $componentType }" എന്ന ഘടക തരവുമായി ചേർന്നില്ല

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` ഗുണം ഒഴിവാക്കപ്പെടുകയാണ്; പകരം `{ $to }` ഉപയോഗിക്കുക.
       *[other] [deprecation] `<{ $component }>` ലെ `{ $from }` ഗുണം ഒഴിവാക്കപ്പെടുകയാണ്; പകരം `{ $to }` ഉപയോഗിക്കുക.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` ഉം നൽകിയതിനാൽ `{ $from }` ഗുണം ഒഴിവാക്കപ്പെടുകയാണ്, അവഗണിക്കുന്നു.
       *[other] [deprecation] `{ $to }` ഉം നൽകിയതിനാൽ `<{ $component }>` ലെ `{ $from }` ഗുണം ഒഴിവാക്കപ്പെടുകയാണ്, അവഗണിക്കുന്നു.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` ലെ `{ $attribute }` ഗുണം ഒഴിവാക്കപ്പെടുകയാണ്, അവഗണിക്കുന്നു.


## Language coverage

pluralize-english-only = `<pluralize>` നു ഇംഗ്ലീഷ് മാത്രമേ ബഹുവചനമാക്കാനാവൂ, അതിനാൽ { $locale } ഭാഷയിൽ എഴുതിയ ഒരു രേഖയിൽ അതിന്റെ എഴുത്ത് മാറ്റാതെ വിടുന്നു. ബഹുവചന രൂപം നേരിട്ട് എഴുതുക, അല്ലെങ്കിൽ `pluralForm` ഗുണം കൊണ്ടു സജ്ജമാക്കുക.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` എന്നത് അംഗീകൃതമായ ഒരു Doenet ഘടകമല്ല.

schema-element-not-allowed-at-root = രേഖയുടെ മൂലത്തിൽ `<{ $tag }>` ഘടകം അനുവദനീയമല്ല.

schema-element-not-allowed-inside = `<{ $parent }>` നുള്ളിൽ `<{ $tag }>` ഘടകം അനുവദനീയമല്ല.

schema-attribute-unrecognized = `<{ $tag }>` ഘടകത്തിനു `{ $attribute }` എന്ന ഗുണമില്ല.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` ഘടകത്തിന്റെ `{ $attribute }` ഗുണം, ഓരോ ഇനവും ഇവയിലൊന്നായ ഒരു പട്ടികയായിരിക്കണം: { $allowed }
       *[other] `<{ $tag }>` ഘടകത്തിന്റെ `{ $attribute }` ഗുണം ഇവയിലൊന്നായിരിക്കണം: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select നു അസാധുവായ വകഭേദ നാമം. വകഭേദ നാമം { $variantName } എന്നത് { $numOptions } ഐച്ഛികങ്ങളിൽ വരുന്നു, എന്നാൽ തിരഞ്ഞെടുക്കേണ്ട എണ്ണം { $numToSelect } ആണ്.

select-variant-name-without-options = select നു ചില വകഭേദങ്ങൾ നൽകിയിട്ടുണ്ട്, എന്നാൽ സാധ്യമായ വകഭേദ നാമത്തിനു ഐച്ഛികങ്ങളൊന്നും നൽകിയിട്ടില്ല: { $variantName }.

select-variant-name-not-possible = select നു നൽകിയ വകഭേദ നാമം { $variantName } ഒരു സാധ്യമായ വകഭേദ നാമമല്ല.

select-too-few-options = { $numOptions } ഘടകങ്ങളിൽ നിന്നു { $numToSelect } ഘടകങ്ങൾ തിരഞ്ഞെടുക്കാനാവില്ല.

select-from-sequence-too-few-values = { $length } നീളമുള്ള ശ്രേണിയിൽ നിന്നു { $numToSelect } മൂല്യങ്ങൾ തിരഞ്ഞെടുക്കാനാവില്ല.

select-from-sequence-indices-count-mismatch = select നു നൽകിയ സൂചികകളുടെ എണ്ണം, തിരഞ്ഞെടുക്കേണ്ട എണ്ണവുമായി ചേരണം

select-from-sequence-indices-not-integers = select നു നൽകിയ എല്ലാ സൂചികകളും പൂർണസംഖ്യകളായിരിക്കണം

select-from-sequence-index-excluded = ഒഴിവാക്കിയ ഒരു selectfromsequence സൂചിക നൽകിയിരിക്കുന്നു

select-from-sequence-indices-excluded-combination = ഒഴിവാക്കിയ ഒരു സംയോഗമായിരുന്ന selectfromsequence സൂചികകൾ നൽകിയിരിക്കുന്നു

select-from-sequence-coprime-not-positive-integers = ധന പൂർണസംഖ്യകൾ തിരഞ്ഞെടുക്കാത്തതിനാൽ സഹഅഭാജ്യ സംയോഗങ്ങൾ തിരഞ്ഞെടുക്കാനാവില്ല.

select-from-sequence-coprime-common-factor = സഹഅഭാജ്യ സംഖ്യകൾ തിരഞ്ഞെടുക്കാനാവില്ല. സാധ്യമായ എല്ലാ മൂല്യങ്ങൾക്കും ഒരു പൊതു ഘടകമുണ്ട്. ("from" അല്ലെങ്കിൽ "to" നു നൽകിയ മൂല്യങ്ങൾ "step" മായി സഹഅഭാജ്യമായിരിക്കണം.)

select-from-sequence-coprime-single-number = 1 അല്ലാത്ത ഒരൊറ്റ സംഖ്യയിൽ നിന്നു സഹഅഭാജ്യ സംയോഗങ്ങൾ തിരഞ്ഞെടുക്കാനാവില്ല.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ൽ 70% ൽ കൂടുതൽ സംയോഗങ്ങൾ ഒഴിവാക്കിയിരിക്കുന്നു

select-from-sequence-coprime-none-found = സഹഅഭാജ്യ സംഖ്യകൾ തിരഞ്ഞെടുക്കാനായില്ല. സാധ്യമായ എല്ലാ മൂല്യങ്ങൾക്കും ഒരു പൊതു ഘടകമുണ്ട്.

select-from-sequence-too-few-unique-values = { $numPossibleValues } നീളമുള്ള ശ്രേണിയിൽ നിന്നു { $numToSelect } അനന്യ മൂല്യങ്ങൾ തിരഞ്ഞെടുക്കാനാവില്ല

select-prime-numbers-too-few-values = { $numValues } നീളമുള്ള അഭാജ്യ സംഖ്യകളുടെ പട്ടികയിൽ നിന്നു { $numToSelect } മൂല്യങ്ങൾ തിരഞ്ഞെടുക്കാനാവില്ല

select-prime-numbers-values-count-mismatch = select നു നൽകിയ മൂല്യങ്ങളുടെ എണ്ണം, തിരഞ്ഞെടുക്കേണ്ട എണ്ണവുമായി ചേരണം

select-prime-numbers-values-not-prime = select prime number നു നൽകിയ എല്ലാ മൂല്യങ്ങളും അഭാജ്യ സംഖ്യകളുടെ പട്ടികയിൽ ഉണ്ടായിരിക്കണം

select-prime-numbers-values-excluded-combination = selectPrimeNumbers നു നൽകിയ മൂല്യങ്ങൾ ഒഴിവാക്കിയ ഒരു സംയോഗമായിരുന്നു

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ൽ 70% ൽ കൂടുതൽ സംയോഗങ്ങൾ ഒഴിവാക്കിയിരിക്കുന്നു

select-random-combination-fluke = അത്യപൂർവമായ ഒരു യാദൃച്ഛികത കാരണം, യാദൃച്ഛിക മൂല്യങ്ങളുടെ സംയോഗം തിരഞ്ഞെടുക്കാനായില്ല

select-random-value-fluke = അത്യപൂർവമായ ഒരു യാദൃച്ഛികത കാരണം, യാദൃച്ഛിക മൂല്യം തിരഞ്ഞെടുക്കാനായില്ല
