# Garo (A·chik ku·rang) diagnostics: the warnings and errors the worker raises,
# addressed to whoever is looking at the screen and so selected by `uiLocale`
# rather than by `documentLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator, and
# no permission is needed to fix it.
#
# **Script: Latin.** ICU maximizes a bare `grt` to `grt-Beng`; this catalog
# writes Latin anyway, because Latin is what a Garo reader in Meghalaya reads.
# `chrome.ftl` carries the full argument, and a conversion to Bengali letters
# is a conversion of all four files at once. The raka is the middle dot «·».
#
# **Every DoenetML name in these messages stays in English exactly as
# written** — `through`, `endpoint`, `midpointOffset`, `numDimensions`,
# `selectFromSequence`, `sectionWideCheckWork`, `WCAG AA`, the `[deprecation]`
# marker, and every tag, attribute and attribute value beside them. They are
# part of the language, not prose.
#
# **Most of the remaining technical vocabulary is an English loan too, and
# that is stated rather than hidden.** Meghalaya teaches mathematics and
# secondary science in English, so circle, point, function, sequence, matrix,
# domain, interval, index, format and their neighbours are written here as
# English: those are the words the classroom uses. The Garo in this file is
# the frame, and it is used consistently: «man·ja» cannot, «man·jaha» could
# not, «nanga» must, «ra·gija» is ignored, «baha·a» use, «man·aha» found,
# «dongja» there is none, «mikkang ka·ja» does not match, «maina» because,
# «indiba» but, «ba» or, «aro» and, «uni gimin» so, «-oni» ablative, «-chi»
# instrumental, «-ko» accusative, «-o» locative, «-rang» plural, «-gipa» the
# attributive. A third, smaller group is Assamese- or Bengali-derived and is
# the register Garo prose already carries: «bhul», «sabdanani», «khali»,
# «somadan», «nirbhor», «bhagyo».
#
# **Nothing in this file selects on a count.** A Garo noun is unmarked after a
# numeral, and CLDR has no plural data for `grt`, so every English plural
# select is collapsed to its `*[other]` wording, keeping the placeables that
# wording uses. The one numeric literal is `[1]` in
# `field-function-wrong-num-outputs`, which is a count of outputs rather than
# a plural category, and it stays exactly where English has it.
#
# Words a reviewer should check first here: «sabdanani» for a warning,
# «ong·gijagipa» for *invalid* — a transparent "not being so" rather than a
# word — and «bang·ani» for *number of*.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = gni endpoint on·ahani gimin { $attributes }-ko ra·gija

line-segment-attributes-ignored-with-endpoint-and-midpoint = sa endpoint aro sa midpoint gnianibaba on·ahani gimin { $attributes }-ko ra·gija

line-segment-midpoint-offset-without-midpoint = midpoint dongjaode midpointOffset kam ka·ja

## `<line>`

line-points-undetermined-dimensions = Dimension-rangko sikna man·gija point-rangchi re·gipa lain.

line-points-too-few-dimensions = Lain kamsa gni dimension gnanggipa point-rangchi re·na nanga.

line-points-depend-on-variables = Lain ia variable-rango nirbhor ka·gipa point-rangchi re·a: { $variables }.

line-equation-invalid-format = { $variable1 } aro { $variable2 } variable-rango lain-ni equation-ni gimin ong·gijagipa format.

## `<ray>`

ray-overprescribed-through = Ray-ko through, endpoint aro direction-chi songaha.  On·ahagipa through-ko ra·gija.

ray-dimension-mismatch = Ray-o numDimensions mikkang ka·ja.

## `<vector>`

vector-overprescribed-head = Vector-ko head, tail aro displacement-chi songaha.  On·ahagipa head-ko ra·gija.

vector-dimension-mismatch = Vector-o numDimensions mikkang ka·ja.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>`-chi attract ka·na man·ja, maina uo nearestPoint state variable dongja.

constrain-to-without-nearest-point = `<{ $component }>`-chi constrain ka·na man·ja, maina uo nearestPoint state variable dongja.

constrain-to-interior-without-nearest-point = `<{ $component }>`-ni bitcho constrain ka·na man·ja, maina uo nearestPoint state variable dongja.

## `<choiceInput>`

choice-input-label-position-ignored = inline ong·gija choiceInput-ni gimin labelPosition-ko ra·gija

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-ni gimin on·ahagipa indices-ko ra·gija, maina indices-ni bang·ani choice bi·sarangni bang·anichi mikkang ka·ja.

pretzel-indices-count-mismatch = problem-ni gimin on·ahagipa indices-ko ra·gija, maina indices-ni bang·ani problem bi·sarangni bang·anichi mikkang ka·ja.

shuffle-indices-count-mismatch = shuffle-ni gimin on·ahagipa indices-ko ra·gija, maina indices-ni bang·ani component-rangni bang·anichi mikkang ka·ja.

indices-ignored-out-of-range = { $component }-ni gimin on·ahagipa indices-ko ra·gija, maina maisa indices range-ni gisepo dongja.

pretzel-indices-repeated = pretzel-ni gimin on·ahagipa indices-ko ra·gija, maina maisa indices sa·bsa re·baha.

pretzel-circuit-first-index = circuit mode-o pretzel-ni gimin on·ahagipa indices-ko ra·gija, maina skanggipa index 1 ong·na nanga.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` string bi·sarangchi kam ka·na `type` attribute-ko on·na nanga.

invalid-type-defaulting-to-math = { $component } component-ni gimin ong·gijagipa type { $type }. Ua math, text, number ba boolean-ni giseponi sa ong·na nanga. math-ko bahaenga.

string-not-valid-component-to-arrange = "{ $value }" string { $component } ka·na kamgipa component ong·ja. Ra·gija.

## Types and variables

invalid-type-defaulting-to-number = Ong·gijagipa type { $type }, type-ko number ka·enga.

invalid-variable-value = Variable-ni ong·gijagipa man: `{ $value }`

## Variants

variant-index-must-be-number = Variant index { $index } number ong·na nanga

variant-index-must-be-integer = Variant index { $index } integer ong·na nanga

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` absolute maprangni gimin dakahani dongja. Width-rangko relative ka·enga.

side-by-side-absolute-margins = `<{ $component }>` absolute maprangni gimin dakahani dongja. Margin-rangko relative ka·enga.

side-by-side-no-block-child = Ong·gijagipa `<{ $component }>`: iao kamsa sa block bi·sa dongna nanga.

## `<label>`

label-for-ignored-on-graphical = Graphical `<label>`-o `for` attribute-ko ra·gija.

label-for-must-resolve-to-one = `<label>`-o `for` attribute kamsa sa component-onosa sokna nanga.

label-for-unresolved = `<label>`-o `for` attribute-ko component-o sokatna man·jaha.

label-for-answer-with-authored-inputs = `<label>`-o `for` attribute author-ni an·tangon seahagipa input gnanggipa `<answer>`-ko sikpiengaha; input-onosa reference ka·bo.

label-for-answer-without-input = `<label>`-o `for` attribute label ka·na input gnanggija `<answer>`-ko sikpiengaha.

label-for-must-reference-input-or-answer = `<label>`-o `for` attribute input ba answer-ko reference ka·na nanga.

## Accessibility

accessibility-short-description-or-decorative = Sokna man·anini gimin, `<{ $component }>`-o chon·gipa bewalani dongna nanga ba uako decorative gita songna nanga.

accessibility-video-short-description = Sokna man·anini gimin, `<video>`-o chon·gipa bewalani dongna nanga.

accessibility-input-short-description-or-label = Sokna man·anini gimin, `<{ $component }>`-o chon·gipa bewalani ba label dongna nanga.

accessibility-answer-input-short-description-or-label = Sokna man·anini gimin, input dakgipa `<answer>`-o chon·gipa bewalani ba label dongna nanga.

accessibility-short-description-contains-math = Chon·gipa bewalanirango `<{ $component }>` gita math component-rang dongna nangja. Math-ko ku·rangchi segatbo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName }-ni contrast bibag-ni khoro ku·rani gimin man·gija (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kamsa { $threshold }:1 nanga).
       *[other] { $colorName }-ni contrast bibag-ni khoro ku·rani gimin man·gija ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kamsa { $threshold }:1 nanga).
    }

## `<circle>`

circle-through-points-non-numerical = Point-rango numerical man dongjaode `<circle>`-ko { $count } point-rangchi dakahani dongja.

circle-too-many-through-points = 3-oni bang·bata point-rangchi re·gipa circle-ko hisap ka·na man·ja.

circle-overprescribed-radius-center-points = On·ahagipa radius, center aro through point-rangchi circle-ko hisap ka·na man·ja.

circle-center-with-multiple-points = On·ahagipa center-chi 1-oni bang·bata point-rangchi re·gipa circle-ko hisap ka·na man·ja.

circle-radius-too-small = Circle-ko hisap ka·na man·ja: gni point-rangni gisepni distance { $distance } ong·ani gimin, on·ahagipa radius { $radius } buktuk chon·a.

circle-radius-with-many-points = On·ahagipa radius-chi gni-oni bang·bata point-rangchi re·gipa circle-ko dakna man·ja.

circle-invalid-center-or-through-points = Circle-ni ong·gijagipa center ba through point-rang.

circle-radius-center-with-multiple-points = On·ahagipa center-chi 1-oni bang·bata point-rangchi re·gipa circle-ni radius-ko hisap ka·na man·ja.

circle-change-radius-non-numerical = Numerical ong·gija through point-rang gnanggipa circle-ni radius-ko salna man·ja

circle-radius-with-points-non-numerical = Numerical man dongjaode on·ahagipa radius-chi sa-oni bang·bata point-rangchi re·gipa circle-ko dakna man·ja.

circle-change-center-non-numerical = Numerical ong·gija point-rangchi re·gipa circle-ni center-ko salani da·o dakahani dongja.

## `<function>`

# No count select: a Garo noun is unmarked after a numeral, so English's two
# nested plurals collapse to one wording that keeps both placeables.
function-domain-insufficient-dimensions = Function-ni domain-ni gimin dimension-rang man·gija. Domain-o { $intervals } interval donga indiba function-o { $inputs } input donga.

function-domain-invalid-format = Function-ni domain-ni gimin ong·gijagipa format.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Function-ni numerical ong·gija maximum-ko ra·gija.
        [minimum] Function-ni numerical ong·gija minimum-ko ra·gija.
        [extremum] Function-ni numerical ong·gija extremum-ko ra·gija.
        [point] Function-ni numerical ong·gija point-ko ra·gija.
        [slope] Function-ni numerical ong·gija slope-ko ra·gija.
       *[other] Function-ni numerical ong·gija { $type }-ko ra·gija.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Function-ni khaligipa maximum-ko ra·gija.
        [minimum] Function-ni khaligipa minimum-ko ra·gija.
        [extremum] Function-ni khaligipa extremum-ko ra·gija.
        [point] Function-ni khaligipa point-ko ra·gija.
       *[other] Function-ni khaligipa { $type }-ko ra·gija.
    }

function-points-too-close = Function-o buktuk bak·bakgija bakon donggipa gni point donga. Function-ko songna man·ja.

function-iterates-input-output-mismatch = Function iterate-rang function-ni input-rangni bang·ani output-rangni bang·anichi sakkise ong·ode-sa man·gen. Ia function-o { $inputs } input aro { $outputs } output donga.

## `<sequence>`

sequence-invalid-length = Sequence-ni ong·gijagipa length.  Ua 0-oni chon·gija integer ong·na nanga.

sequence-invalid-step = Sequence-ni ong·gijagipa step.  { $type } type-ni sequence-ni gimin ua number ong·na nanga.

sequence-invalid-endpoint-number = Number sequence-ni ong·gijagipa "{ $attribute }".  Ua number ong·na nanga.

sequence-invalid-endpoint-letters = Letters sequence-ni ong·gijagipa "{ $attribute }".  Ua akkor-rangni songjotani ong·na nanga.

sequence-invalid-endpoint = Sequence-ni ong·gijagipa "{ $attribute }".

select-from-sequence-coprime-not-numbers = number-rangko sikgija ong·ani gimin coprime-ko ra·gija

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations-ko songahani gimin coprime-ko ra·gija

## Resolving a `target`

target-not-found = `<{ $source }>`-ni gimin ong·gijagipa target: target-ko nikna man·ja.

target-state-variable-not-found = `<{ $source }>`-ni gimin ong·gijagipa target: `<{ $component }>`-o "{ $property }" bimung gnanggipa state variable-ko nikna man·ja.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-ni variable-rang independent variable-chi dingtang ong·na nanga.

ode-system-duplicate-variable-names = Sa·gita dependent variable bimung gnanggipa ODE RHS function-rangko songna man·ja.

ode-system-rhs-function-error = ODE RHS function-ko songna man·ja.  mathjs function dakengon bhul ong·aha.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } lain-rangni gisepo angle-ko songna man·ja

angle-invalid-through-point = `<angle>`-ni through-o ong·gijagipa point

parabola-vertex-too-many-points = Vertex-chi 1-oni bang·bata point-rangchi re·gipa parabola-ni dakahani dongja.

parabola-too-many-points = 3-oni bang·bata point-rangchi re·gipa parabola-ni dakahani dongja.

intersection-too-many-items = Gni-oni bang·bata jinis-rangni gimin intersection-ni dakahani dongja

## Other math components

ionic-compound-not-two-ions = Gni ion-ko cha·gija gipin jinis-rangni gimin ionic compound-ni dakahani dongja.

ionic-compound-needs-cation-and-anion = Ionic compound sa cation aro sa anion-ni gimin-sa dakaha.

solve-equations-cannot-evaluate = Equation-ko hisap ka·na man·jani gimin equation-ko somadan ka·na man·ja: { $equation }

math-operators-operand-number-required = Math operand-ko ra·katengon operandNumber-ko songna nanga.

eigen-decomposition-failed = Matrix-ni eigenvalue-rangko hisap ka·na man·jaha

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } parameter pattern-o dongja, uni gimin ua somoy pilakon khali jinis-chisa mikkang ka·gen.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }"-ko bujina man·ja. Ua none, medium, dense, ba space-chi bak·ahagipa gni positive number ong·na nanga, dakko grid="1 0.5". Maiba grid-ko seja.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>`-na { $expected ->
        [1] sa output — point sa·sao slope y', dakko `y - x` — gnanggipa
       *[other] gni output — point sa·sao vector, dakko `(y, -x)` — gnanggipa
    } function nanga, indiba on·ahagipa function-o { $found } output donga. { $alternative ->
        [none] Maiba seja.
       *[other] Ua function-ni gimin `<{ $alternative }>` ong·gipa component. Maiba seja.
    }

field-function-attribute-ignored-with-child = `function` attribute-ko ra·gija maina function-ko component-ni bitchoba on·aha; bitchogipako bahaenga. Function-ko gni dakni giseponi sa·chisa on·bo.

field-variables-ignored =
    `<{ $component }>`: `variables` attribute component-ni bitcho seahagipa expression-ni variable-rangko bimung on·a. { $reason ->
        [function-child] Iao function-ko `<function>` bi·sa gita on·aha, aro ua an·tangni variable-rangko bimung on·a, uni gimin `variables`-ko ra·gija.
       *[no-expression] Iao ua gita expression on·gija, uni gimin `variables`-ko ra·gija.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure renderer-o xLabelPosition="left"-ko ra·na man·ja; right-position dakanikon bahaenga.

prefigure-y-label-position-unsupported = `<graph>`: prefigure renderer-o yLabelPosition="bottom"-ko ra·na man·ja; top-position dakanikon bahaenga.

prefigure-invalid-axis-bounds = `<graph>`: prefigure-o salatna ong·gijagipa axis bound-rang; skanggipa bbox (-10,-10,10,10)-ko bahaenga.

prefigure-invalid-width = `<graph>`: prefigure-o salatna ong·gijagipa width; skanggipa diagram width 425-ko bahaenga.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure-o salatna ong·gijagipa aspectRatio; skanggipa aspect ratio 1-ko bahaenga.

prefigure-grid-spacing-too-fine = `<graph>`: axis-ni seng·rangni gimin grid-ni gisepni bak buktuk chon·a; prefigure renderer-o grid-ko ra·gija.

prefigure-annotations-not-rendered = `<graph>`: PreFigure renderer-ko bahagijaode annotation-rangko seja.

multiple-annotations-children = `<graph>`-o bang·gipa `<annotations>` bi·sarangko man·aha; ja·mangipa sa·kosa ra·aha, gipin pilakko ra·gija.

## Referring to other components

copy-unrecognized-component-type = Sikna man·gija component type-ko extend ba copy ka·na man·ja: { $type }.

copy-prop-not-found = { $component } type-ni component-o { $property } prop-ko nikna man·jaha

collect-no-source = collect-ni gimin source man·jaha.

collect-invalid-component-type = `<{ $component }>` type-ni component-rangko collect ka·na man·ja, maina ua ong·gijagipa component type.

reference-index-unavailable = `{ $reference }` index-ko reference ka·na man·ja

## `<callAction>`

component-action-unavailable = `{ $reference }` component-o { $action }-ko call ka·na man·ja

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data-ni shape ong·gija.  Row-rangni length sakkise ong·ja. componentIdx :{ $componentIdx }-o man·aha

data-frame-duplicate-column-names = Data-o sa·gita column bimung-rang donga.  componentIdx :{ $componentIdx }-o man·aha

data-frame-missing-column-name = Data-o column-ni bimung dongja.  componentIdx :{ $componentIdx }-o man·aha

## `<answer>` and scoring

answer-award-depends-on-own-response = Ia answer-ni award an·tangni answer tag-ni on·ahagipa aganchakanio nirbhor ka·a, aro ua ni·gija dakanikon dakatgen.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` gnanggipa container-ni bitcho donggipa `<answer>`-o `maxNumAttempts`-ko songani kam ka·ja, maina chesotani-ni bang·anikon container-a nianga. `maxNumAttempts`-ko container-osa songbo.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` gnanggipa gipin container-ni bitcho donggipa `sectionWideCheckWork` gnanggipa container-o `maxNumAttempts`-ko songani kam ka·ja, maina chesotani-ni bang·anikon agalgipa container-a nianga. `maxNumAttempts`-ko agalgipa container-osa songbo.

answer-attributes-need-symbolic-equality = symbolicEquality-ko songgijaode { $attributes } attribute kam ka·ja.

answer-invalid-type = Answer-ni gimin ong·gijagipa type: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` component-o bimung dongjani gimin, uako module-ni attribute gita bahana man·ja

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` component-ko module-ni attribute gita bahana man·ja, maina `<module>` component type-o "{ $name }" attribute skangonba songaha.

conditional-content-condition-ignored = case ba else bi·sarang gnanggipa `<conditionalContent>` component-o `condition` attribute-ko ra·gija.

slider-markers-type-mismatch = Marker-rangni type slider-ni type-chi mikkang ka·ja.

pretzel-problem-needs-statement-and-answer = Ong·gijagipa pretzel: `<problem>` sa·sao sa `<statement>` aro sa `<answer>` dongna nanga.

pretzel-circuit-first-problem-distractor = Ong·gijagipa pretzel: mode="circuit"-o skanggipa `<problem>` distractor ong·na man·ja.

## Attribute values

attribute-invalid-values = `{ $attribute }` attribute-ni gimin ong·gijagipa man { $values }; ra·gija.

attribute-must-be-references = `{ $attribute }` attribute-ni gimin ong·gijagipa man `{ $value }`. Attribute `$`-chi ja·rikatgipa reference-rangchi songa ong·na nanga.

math-input-invalid-function-names = <mathInput>: { $attribute }-o ong·gijagipa function bimung-rangko ra·gija: { $names }. Bimung sa·sani pinigipa bak kamsa gni akkor (letter ba dash) ong·na nanga; uni ja·mano `|<mathspeak alternative>` re·baba man·gen.

## Building components from the source

component-type-invalid = Ong·gijagipa component type: `<{ $componentType }>`

attribute-repeated = { $attribute } attribute-ko sa·bsa seana man·ja.

attribute-invalid-for-component = `<{ $componentType }>` type-ni component-ni gimin ong·gijagipa attribute "{ $attribute }".

## Style definition contrast

style-definition-insufficient-contrast =
    Style definition { $styleNumber }-o { $context ->
        [text-on-background] background-ni rong-chi text-ni rong
        [high-contrast] canvas-chi high-contrast rong
        [line] canvas-chi lain-ni rong
        [marker] canvas-chi marker-ni rong
       *[text-on-canvas] canvas-chi text-ni rong
    }-ni contrast man·gija{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kamsa { $threshold }:1 nanga).

style-definition-dark-mode-text-background-contrast =
    Style definition { $styleNumber }-o light mode-ni gimin man·gipa contrast gnanggipa rong-rangko songahaba, ia man-rangoni ra·ahagipa dark-mode rong-rango background-ni rong-chi text-ni rong-ni contrast man·gija ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kamsa { $threshold }:1 nanga). { $suggestion ->
        [available] Dark mode-o contrast man·china, ba light-mode-ni contrast-ko bang·atbo (dakko { $lightAttribute }="{ $lightColor }" songbo) ba dark-mode-ni rong-ko salatbo (dakko { $darkAttribute }="{ $darkColor }" songbo).
       *[none] Dark mode-o contrast man·china, light-mode-ni contrast-ko bang·atbo ba ra·ahagipa rong-rangko textColorDarkMode aro/ba backgroundColorDarkMode-chi salatbo.
    }

style-definition-dark-mode-text-canvas-contrast =
    Style definition { $styleNumber }-o light mode-ni gimin man·gipa contrast gnanggipa text-ni rong-ko songahaba, ia man-oni ra·ahagipa dark-mode text-ni rong-ni contrast canvas-chi man·gija ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kamsa { $threshold }:1 nanga). { $suggestion ->
        [available] Dark mode-o contrast man·china, ba light-mode-ni contrast-ko bang·atbo (dakko textColor="{ $lightColor }" songbo) ba dark-mode-ni rong-ko salatbo (dakko textColorDarkMode="{ $darkColor }" songbo).
       *[none] Dark mode-o contrast man·china, light-mode-ni contrast-ko bang·atbo ba ra·ahagipa rong-ko textColorDarkMode-chi salatbo.
    }

section-multiple-style-palettes = Bibag sa <stylePalette>-kosa sikna man·a; ja·mangipa sa·kosa bahaenga.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component }-ni dingtanggipa variant-rangko sikna man·ja maina numToSelect 0-oni chon·gija integer ong·ja.

variant-num-to-select-not-constant-number = { $component }-ni dingtanggipa variant-rangko sikna man·ja maina numToSelect sasa donggipa number ong·ja.

variant-with-replacement-not-constant-boolean = { $component }-ni dingtanggipa variant-rangko sikna man·ja maina withReplacement sasa donggipa boolean ong·ja.

variant-select-weight-disables-unique = selectWeight ba selectForVariants gnanggipa option dongode select-ni dingtanggipa variant-rangko bondho ka·a

variant-coprime-undetermined = { $component }-ni dingtanggipa variant-rangko sikna man·ja maina coprime somoy pilakon ong·ja ong·anikon sikna man·ja.

variant-attribute-not-constant = { $component }-ni dingtanggipa variant-rangko sikna man·ja maina { $attribute } sasa donggipa ong·ja.

variant-attribute-not-number = { $component }-ni dingtanggipa variant-rangko sikna man·ja maina { $attribute } number ong·ja.

variant-attribute-wrong-type-for-sequence =
    { $type } type-ni { $component }-ni dingtanggipa variant-rangko sikna man·ja maina { $attribute } { $expected ->
        [letters-combination] akkor-rangni songjotani
        [math-expression] kamgipa math expression
        [integer] integer
       *[number] number
    } ong·ja.

variant-length-not-integer = { $component }-ni dingtanggipa variant-rangko sikna man·ja maina length integer ong·ja.

variant-sort-not-implemented = sort gnanggipa { $component }-ni dingtanggipa variant-rangni dakahani dongja

variant-exclude-combinations-not-implemented = excludeCombinations gnanggipa { $component }-ni dingtanggipa variant-rangni dakahani dongja

variant-math-exclude-not-implemented = exclude gnanggipa math type-ni { $component }-ni dingtanggipa variant-rangni dakahani dongja

variant-non-constant-exclude-not-implemented = sasa donggija exclude gnanggipa { $component }-ni dingtanggipa variant-rangni dakahani dongja

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure renderer-o ra·na man·ja; bi·sako ra·gija.

prefigure-descendant-invalid-geometry = { $subject }: sakkigija ba chinggija geometry; bi·sako ra·gija.

prefigure-curve-label-omitted = { $subject }: salatahagipa curve element-rango label-rangko ra·na man·ja; label-ko ra·gija.

prefigure-curve-unsupported-definition-type = { $subject }: ra·na man·gija curve function definition type '{ $definitionType }'; bi·sako ra·gija.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves-o ra·na man·gija flipFunctions attribute; bi·sako ra·gija.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves-o formula type-ni bi·sa function-rangkosa ra·na man·a; bi·sako ra·gija.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] lain-ni bakni label
       *[point] point-ni label
    }-ni gimin ra·na man·gija labelPosition '{ $labelPosition }'; skanggipa PreFigure alignment-ko bahaaha.

prefigure-fill-style-unsupported = { $subject }: fill style '{ $fillStyle }'-ko PreFigure ra·na man·ja; solid fill-chi salaha.

prefigure-line-style-unknown = { $subject }: sikna man·gija line style '{ $lineStyle }'-ko PreFigure output-oni ra·gija.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker style '{ $markerStyle }'-ko PreFigure-ni 'diamond' style-chi salataha.

prefigure-marker-style-unsupported = { $subject }: marker style '{ $markerStyle }'-ko PreFigure ra·na man·ja; skanggipa style-ko bahaaha.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ong·gijagipa `ref`; target-ko sokatna man·ja. Annotation-ko ra·gija.

annotation-ref-multiple-targets = `<annotation>`: `ref` bang·gipa target-rango sokaha; skanggipa target-kosa bahaenga.

annotation-ref-outside-graph = `<annotation>`: ong·gijagipa `ref`; target graph-ni agalo donga. Annotation-ko ra·gija.

annotation-ref-unsupported-target = `<annotation>`: ong·gijagipa `ref`; prefigure salatanio target ra·na man·gija graphical jinis ong·a. Annotation-ko ra·gija.

annotation-text-missing = `<annotation>`: `text` dongja ba khali; khali text-ko on·enga.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Girikgipa nirbhoranikon man·aha.
       *[other] `<{ $componentType }>` component-ko cha·gipa girikgipa nirbhoranikon man·aha.
    }

reference-no-referent = Ia reference-ni gimin maiba man·jaha: `{ $reference }`

reference-multiple-referents = Ia reference-ni gimin bang·gipa jinis man·aha: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>`-ni { $attribute } attribute-ni gimin ong·gijagipa format.

children-invalid = `<{ $componentType }>`-ni gimin ong·gijagipa bi·sarang: Ong·gijagipa bi·sarangko man·aha: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` attribute-ni gimin ong·gijagipa man `{ $value }`, `{ $default }` man-ko bahaenga

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML version { $version } man·jaha.
       *[other] DoenetML version { $version } man·jaha. Version { $fallback }-ko bahaenga
    }

## Reading the DoenetML

parse-invalid-doenetml = Ong·gijagipa DoenetML: { $content }

parse-tag-missing-close-tag = Ong·gijagipa DoenetML: `{ $tag }` tag-o bondho ka·gipa tag dongja. An·tangon bondho ong·gipa tag ba `</{ $tagName }>` tag nangaha.

parse-tag-error = Ong·gijagipa DoenetML: `<{ $tagName }>` tag-o bhul

parse-attribute-missing-value = Ong·gijagipa DoenetML: Ong·gijagipa attribute `{ $attribute }`-o man dongja gita nika.

parse-attribute-invalid = Ong·gijagipa DoenetML: Ong·gijagipa attribute `{ $attribute }`

parse-attribute-value-invalid = Ong·gijagipa DoenetML: Ong·gijagipa attribute-ni man `{ $value }`

parse-attribute-value-quote-mismatch = Ong·gijagipa DoenetML: Ong·gijagipa attribute-ni man `{ $value }`. Quote chinho-rang mikkang ka·ja. Na·a `{ $quote }`-ko sea·gija gita nika

parse-open-tag-name-missing = Ong·gijagipa DoenetML: Bimung gnanggija tag-ko man·aha, dakko `<`

parse-tag-not-closed = Ong·gijagipa DoenetML: `{ $tag }` tag-ko bondho ka·jaha (`>` dongja gita nika).

parse-self-closing-tag-name-missing = Ong·gijagipa DoenetML: Bimung gnanggija tag-ko man·aha `<{ $content }>`

parse-self-closing-tag-not-closed = Ong·gijagipa DoenetML: `{ $tag }` tag-ko bondho ka·jaha (`/>` dongja gita nika).

parse-tag-invalid-attributes = Ong·gijagipa DoenetML: `{ $tag }` tag kamgija. Uni attribute-rang bhul ong·na man·gen.

parse-close-tag-name-missing = Ong·gijagipa DoenetML: Bimung gnanggija bondho ka·gipa tag-ko man·aha, dakko `</`

parse-attribute-value-unquoted = Attribute-ni man-rangko quote-ni bitcho dongatna nanga: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ong·gijagipa DoenetML: Bondho ka·gipa tag `{ $tag }`-ko man·aha, indiba uni khegipa tag dongja

parse-close-tag-mismatched = Ong·gijagipa DoenetML: Bondho ka·gipa tag mikkang ka·ja. `</{ $expected }>` nangaha. `{ $found }`-ko man·aha

parser-node-unconvertible = { $node } node-ko Dast node-chi salatna man·jaha.

## Names

name-attribute-invalid =
    Ong·gijagipa attribute name='{ $name }'. { $reason ->
        [characters] Bimung-rango akkor, number, underscore ba hyphen-kosa dongna man·a.
       *[start] Bimung-rang akkor-chi ja·rikatna nanga.
    }

component-name-invalid-start = Ong·gijagipa component-ni bimung "{ $name }". Bimung-rang akkor-chi ja·rikatna nanga.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched type gnanggipa answer-o video attribute dongna nanga

answer-video-watched-video-not-reference = videoWatched type gnanggipa answer-ni video attribute reference ong·na nanga

answer-name-not-single-text = Answer-ni name attribute-o sa text bi·sa dongna nanga

## Referencing another document

external-doenetml-recursion-limit = Bang·gipa laboro girikaniko cha·ani gimin agalgipa DoenetML-ko ra·na man·jaha. Girikgipa reference donga ma?

external-doenetml-unavailable = { $attribute }="{ $uri }"-oni DoenetML-ko ra·na man·jaha

external-doenetml-type-mismatch = { $attribute }="{ $uri }"-oni ra·ahagipa DoenetML ong·gija: ua "{ $componentType }" component type-chi mikkang ka·jaha

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` attribute-ko da·o ra·gija; uni bakon `{ $to }`-ko bahabo.
       *[other] [deprecation] `<{ $component }>`-o `{ $from }` attribute-ko da·o ra·gija; uni bakon `{ $to }`-ko bahabo.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }`-koba songahani gimin `{ $from }` attribute-ko da·o ra·gija.
       *[other] [deprecation] `{ $to }`-koba songahani gimin `<{ $component }>`-o `{ $from }` attribute-ko da·o ra·gija.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`-o `{ $attribute }` attribute-ko da·o ra·gija.

deprecated-attribute-to-child = [deprecation] `<{ $component }>`-o `{ $attribute }` attribute-ko da·o ra·gija; uni bakon `<{ $child }>` bi·sako bahabo.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>`-o `{ $attribute }` attribute-ni `{ $value }` man-ko da·o ra·gija; uni bakon `{ $to }`-ko bahabo.


## Language coverage

pluralize-english-only = `<pluralize>` English-kosa plural ka·na man·a, uni gimin { $locale }-o seahagipa dokumento uni text-ko salgija donga. Plural form-ko an·tangon seabo, ba `pluralForm` attribute-chi songbo.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` element sikna man·gipa Doenet element ong·ja.

schema-element-not-allowed-at-root = `<{ $tag }>` element-ko dokumento-ni ja·rikatani laboro dongatna man·ja.

schema-element-not-allowed-inside = `<{ $tag }>` element-ko `<{ $parent }>`-ni bitcho dongatna man·ja.

schema-attribute-unrecognized = `<{ $tag }>` element-o `{ $attribute }` bimung gnanggipa attribute dongja.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` element-ni `{ $attribute }` attribute list ong·na nanga, aro uni jinis sa·sa iarangni giseponi sa ong·na nanga: { $allowed }
       *[other] `<{ $tag }>` element-ni `{ $attribute }` attribute iarangni giseponi sa ong·na nanga: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select-ni gimin ong·gijagipa variant bimung.  { $variantName } variant bimung { $numOptions } option-rango donga indiba sikna nanggipa bang·ani { $numToSelect }.

select-variant-name-without-options = Select-ni gimin maisa variant-rangko songaha indiba ia man·na man·gipa variant bimung-ni gimin option dongja: { $variantName }.

select-variant-name-not-possible = Select-ni gimin songahagipa { $variantName } variant bimung man·na man·gipa variant bimung ong·ja.

select-too-few-options = { $numOptions }-onisa { $numToSelect } component-rangko sikna man·ja.

select-from-sequence-too-few-values = { $length } length gnanggipa sequence-oni { $numToSelect } man-rangko sikna man·ja.

select-from-sequence-indices-count-mismatch = Select-ni gimin songahagipa indices-ni bang·ani sikna nanggipa bang·anichi mikkang ka·na nanga

select-from-sequence-indices-not-integers = Select-ni gimin songahagipa indices pilak integer ong·na nanga

select-from-sequence-index-excluded = Ra·gijagipa selectfromsequence-ni index-ko songaha

select-from-sequence-indices-excluded-combination = Ra·gijagipa songjotani ong·gipa selectfromsequence-ni indices-ko songaha

select-from-sequence-coprime-not-positive-integers = Positive integer-rangko sikgija ong·ani gimin coprime songjotani-rangko sikna man·ja.

select-from-sequence-coprime-common-factor = Coprime number-rangko sikna man·ja. Man·na man·gipa man pilako sa·gipa factor donga. ("from" ba "to"-ni songahagipa man-rang "step"-chi coprime ong·na nanga.)

select-from-sequence-coprime-single-number = 1 ong·gija sa number-oni coprime songjotani-rangko sikna man·ja.

select-from-sequence-excluded-too-many-combinations = selectFromSequence-o songjotani-rangni 70%-oni bang·bata ra·gija

select-from-sequence-coprime-none-found = Coprime number-rangko sikna man·jaha. Man·na man·gipa man pilako sa·gipa factor donga.

select-from-sequence-too-few-unique-values = { $numPossibleValues } length gnanggipa sequence-oni { $numToSelect } dingtanggipa man-rangko sikna man·ja

select-prime-numbers-too-few-values = { $numValues } length gnanggipa prime-rangni list-oni { $numToSelect } man-rangko sikna man·ja

select-prime-numbers-values-count-mismatch = Select-ni gimin songahagipa man-rangni bang·ani sikna nanggipa bang·anichi mikkang ka·na nanga

select-prime-numbers-values-not-prime = Select prime number-ni gimin songahagipa man pilak prime-rangni list-o dongna nanga

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-ni songahagipa man-rang ra·gijagipa songjotani ong·aha

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-o songjotani-rangni 70%-oni bang·bata ra·gija

select-random-combination-fluke = Buktuk ong·na man·gija bhagyo-ni gimin, random man-rangni songjotanikon sikna man·jaha

select-random-value-fluke = Buktuk ong·na man·gija bhagyo-ni gimin, random man-ko sikna man·jaha

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Ia `<{ $component }>`-ko pinija maina ua math-ni bitcho donga aro `inline` ong·ja. `inline`-ko dongatbo, uni gimin ua drop-down list ong·gen, aro ua expression-ni bitcho cha·gen.
        [expanded] Ia `<{ $component }>`-ko pinija maina ua math-ni bitcho donga aro `expanded` ong·a. `expanded`-ko ra·katbo; bang·gipa lain gnanggipa boks expression-ni bitcho cha·ja.
        [on-graph] Ia `<{ $component }>`-ko pinija maina ua graph-o segipa math-ni bitcho donga, aro uo input-ni gimin bak dongja.
       *[relative-width] Ia `<{ $component }>`-ko pinija maina ua math-ni bitcho donga aro uni width relative ong·a. Width-ko `px` gita absolute unit-chi on·bo.
    }
