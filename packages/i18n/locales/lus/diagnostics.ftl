# Mizo (Mizo ṭawng) diagnostics: the warnings and errors surfaced to whoever is
# looking at the screen. Produced by the worker but addressed to the reader, so
# these follow `uiLocale` rather than `documentLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin**, in the 1894 Roman orthography, with the circumflex on the
# long vowels and the subscript-dotted **ṭ**, as `chrome.ftl`'s header sets out.
#
# **Every DoenetML identifier in this file stays in English.** `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `selectFromSequence`,
# `sectionWideCheckWork`, `maxNumAttempts`, `coprime`, the tag names inside
# `<…>`, everything inside backticks and the literal `[deprecation]` marker are
# part of the language an author types, not prose, and a translated one names
# nothing. Only the sentence around them is Mizo.
#
# **The technical nouns are English too, and that is what the classroom uses.**
# «component», «attribute», «value», «type», «reference», «line», «index»,
# «variant», «pattern», «graph», «matrix», «function», «domain», «interval» —
# Mizoram teaches mathematics, science and computing in English, so these are
# the words a Mizo author reads in their own textbook. What this file
# translates is the frame: «... theih a ni lo» for *cannot*, «... dik lo» for
# *invalid*, «hnâwl a ni» for *ignored*, «... a ni tûr a ni» for *must be*,
# «siam a la ni lo» for *have not implemented*, «hmuh a ni» for *found*,
# «a aiin» for *instead*.
#
# **No plural branches.** CLDR has no plural data for `lus`, and a Mizo noun is
# unmarked after a numeral, so every English one/other count select is
# collapsed to one wording with the count standing beside it. The **`[1]` in
# `field-function-wrong-num-outputs` stays**: it forks on how many outputs a
# component *needs*, which Fluent matches against the number itself rather than
# through a plural rule, and it is the only bracketed digit in this file.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = Endpoint pahnih sawi lan a nih chuan { $attributes } chu hnâwl a ni.

line-segment-attributes-ignored-with-endpoint-and-midpoint = Endpoint leh midpoint sawi lan tel a nih chuan { $attributes } chu hnâwl a ni.

line-segment-midpoint-offset-without-midpoint = midpoint awm lo chuan midpointOffset hian nghawng a nei lo

## `<line>`

line-points-undetermined-dimensions = Dimension hriat chian loh point-ate zawha kal line.

line-points-too-few-dimensions = Line chu a tlêm berah dimension hnih nei point-ate zawha kal a ni tûr a ni.

line-points-depend-on-variables = Line chu variable-ah innghat point-ate zawha kal a ni: { $variables }.

line-equation-invalid-format = Variable { $variable1 } leh { $variable2 } hmanga line equation format dik lo.

## `<ray>`

ray-overprescribed-through = Ray chu through, endpoint leh direction hmangin sawi lan a ni. Sawi lan through chu hnâwl a ni.

ray-dimension-mismatch = Ray-ah numDimensions a inmil lo.

## `<vector>`

vector-overprescribed-head = Vector chu head, tail leh displacement hmangin sawi lan a ni. Sawi lan head chu hnâwl a ni.

vector-dimension-mismatch = Vector-ah numDimensions a inmil lo.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` lamah attract theih a ni lo, nearestPoint state variable a nei lo si a.

constrain-to-without-nearest-point = `<{ $component }>` lamah constrain theih a ni lo, nearestPoint state variable a nei lo si a.

constrain-to-interior-without-nearest-point = `<{ $component }>` chhûng lamah constrain theih a ni lo, nearestPoint state variable a nei lo si a.

## `<choiceInput>`

choice-input-label-position-ignored = Inline ni lo choiceInput tân labelPosition chu hnâwl a ni

## Ordering children by index

choice-input-indices-count-mismatch = ChoiceInput tâna sawi lan indices chu hnâwl a ni, indices zât leh choice fa zât a inmil lo si a.

pretzel-indices-count-mismatch = Problem tâna sawi lan indices chu hnâwl a ni, indices zât leh problem fa zât a inmil lo si a.

shuffle-indices-count-mismatch = Shuffle tâna sawi lan indices chu hnâwl a ni, indices zât leh component zât a inmil lo si a.

indices-ignored-out-of-range = { $component } tâna sawi lan indices chu hnâwl a ni, indices ṭhenkhat chu chin ram pêl a ni si a.

pretzel-indices-repeated = Pretzel tâna sawi lan indices chu hnâwl a ni, indices ṭhenkhat a inang leh si a.

pretzel-circuit-first-index = Circuit mode-a pretzel tâna sawi lan indices chu hnâwl a ni, index hmasa ber chu 1 a ni tûr a ni si a.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` chu string fa nena hna a thawh theih nân `type` attribute sawi lan a ngai.

invalid-type-defaulting-to-math = { $component } component tân type { $type } chu a dik lo. Math, text, number, emaw boolean zînga pakhat a ni tûr a ni. Math-ah dah a ni.

string-not-valid-component-to-arrange = String "{ $value }" chu { $component } tûra component dik a ni lo. Hnâwl a ni.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } a dik lo, type chu number-ah dah a ni.

invalid-variable-value = Variable value dik lo: `{ $value }`

## Variants

variant-index-must-be-number = Variant index { $index } chu number a ni tûr a ni

variant-index-must-be-integer = Variant index { $index } chu integer a ni tûr a ni

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` chu absolute tehna tân siam a la ni lo. Width-te chu relative-ah dah a ni.

side-by-side-absolute-margins = `<{ $component }>` chu absolute tehna tân siam a la ni lo. Margin-te chu relative-ah dah a ni.

side-by-side-no-block-child = `<{ $component }>` dik lo: a tlêm berah block fa pakhat a nei tûr a ni.

## `<label>`

label-for-ignored-on-graphical = Graphical `<label>` chunga `for` attribute chu hnâwl a ni.

label-for-must-resolve-to-one = `<label>` chunga `for` attribute chuan component pakhat chiah a kâwk tûr a ni.

label-for-unresolved = `<label>` chunga `for` attribute chuan component a kâwk chhuak thei lo.

label-for-answer-with-authored-inputs = `<label>` chunga `for` attribute chuan input ziak nei `<answer>` a kâwk; input ngei chu kâwk zâwk rawh.

label-for-answer-without-input = `<label>` chunga `for` attribute chuan label tûr input nei lo `<answer>` a kâwk.

label-for-must-reference-input-or-answer = `<label>` chunga `for` attribute chuan input emaw answer emaw a kâwk tûr a ni.

## Accessibility

accessibility-short-description-or-decorative = Accessibility avângin `<{ $component }>` chuan short description a nei tûr a ni a, a nih loh chuan decorative angin sawi lan a ni tûr a ni.

accessibility-video-short-description = Accessibility avângin `<video>` chuan short description a nei tûr a ni.

accessibility-input-short-description-or-label = Accessibility avângin `<{ $component }>` chuan short description emaw label emaw a nei tûr a ni.

accessibility-answer-input-short-description-or-label = Accessibility avângin input siamtu `<answer>` chuan short description emaw label emaw a nei tûr a ni.

accessibility-short-description-contains-math = Short description-ah `<{ $component }>` ang math component a awm tûr a ni lo. Math zawng zawng chu ṭawngkam hmangin sawi rawh.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } chuan section heading thu tân contrast a tâwk lo (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a tlêm berah { $threshold }:1 a ngai).
       *[other] { $colorName } chuan section heading thu tân contrast a tâwk lo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a tlêm berah { $threshold }:1 a ngai).
    }

## `<circle>`

circle-through-points-non-numerical = Point-te chuan number value an neih loh hunah `<circle>` chu point { $count } zawha kal siam a la ni lo.

circle-too-many-through-points = Point 3 aia tam zawha kal circle chhût theih a ni lo.

circle-overprescribed-radius-center-points = Radius, center leh through point sawi lan tel nena circle chhût theih a ni lo.

circle-center-with-multiple-points = Center sawi lan nena point 1 aia tam zawha kal circle chhût theih a ni lo.

circle-radius-too-small = Circle chhût theih a ni lo: point pahnih inkâr hla zawng chu { $distance } a nih avângin, radius sawi lan { $radius } chu a tê lutuk.

circle-radius-with-many-points = Radius sawi lan nena point pahnih aia tam zawha kal circle siam theih a ni lo.

circle-invalid-center-or-through-points = Circle center emaw through point emaw a dik lo.

circle-radius-center-with-multiple-points = Center sawi lan nena point 1 aia tam zawha kal circle radius chhût theih a ni lo.

circle-change-radius-non-numerical = Number value nei lo through point nena circle radius thlâk theih a ni lo

circle-radius-with-points-non-numerical = Number value an awm loh hunah radius sawi lan nena point pakhat aia tam zawha kal circle siam theih a ni lo.

circle-change-center-non-numerical = Number value nei lo point zawha kal circle center thlâk chu siam a la ni lo.

## `<function>`

function-domain-insufficient-dimensions = Function domain tân dimension a tâwk lo. Domain-ah interval { $intervals } a awm a, function-ah erawh input { $inputs } a awm.

function-domain-invalid-format = Function domain format a dik lo.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Function-a number ni lo maximum chu hnâwl a ni.
        [minimum] Function-a number ni lo minimum chu hnâwl a ni.
        [extremum] Function-a number ni lo extremum chu hnâwl a ni.
        [point] Function-a number ni lo point chu hnâwl a ni.
        [slope] Function-a number ni lo slope chu hnâwl a ni.
       *[other] Function-a number ni lo { $type } chu hnâwl a ni.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Function-a maximum ruak chu hnâwl a ni.
        [minimum] Function-a minimum ruak chu hnâwl a ni.
        [extremum] Function-a extremum ruak chu hnâwl a ni.
        [point] Function-a point ruak chu hnâwl a ni.
       *[other] Function-a { $type } ruak chu hnâwl a ni.
    }

function-points-too-close = Function-ah hian a hmun inhnaih lutuk point pahnih a awm. Function siam theih a ni lo.

function-iterates-input-output-mismatch = Function iterate chu function input zât leh output zât a inan a nih chauhvin a theih a ni. He function-ah hian input { $inputs } leh output { $outputs } a awm.

## `<sequence>`

sequence-invalid-length = Sequence length a dik lo. Integer chhia ni lo a ni tûr a ni.

sequence-invalid-step = Sequence step a dik lo. Type { $type } sequence tân number a ni tûr a ni.

sequence-invalid-endpoint-number = Number sequence "{ $attribute }" a dik lo. Number a ni tûr a ni.

sequence-invalid-endpoint-letters = Letters sequence "{ $attribute }" a dik lo. Hawrawp inzawmkhâwm a ni tûr a ni.

sequence-invalid-endpoint = Sequence "{ $attribute }" a dik lo.

select-from-sequence-coprime-not-numbers = Number thlan a nih loh avângin coprime chu hnâwl a ni

select-from-sequence-coprime-with-exclude-combinations = ExcludeCombinations sawi lan a nih avângin coprime chu hnâwl a ni

## Resolving a `target`

target-not-found = `<{ $source }>` tân target a dik lo: target hmuh theih a ni lo.

target-state-variable-not-found = `<{ $source }>` tân target a dik lo: `<{ $component }>` chungah "{ $property }" tia hriat state variable hmuh theih a ni lo.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` variable-te chu independent variable nên an inang lo tûr a ni.

ode-system-duplicate-variable-names = Dependent variable hming inang nena ODE RHS function siam theih a ni lo.

ode-system-rhs-function-error = ODE RHS function siam theih a ni lo. Mathjs function siamnaah thil dik lo a awm.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Line { $count } inkârah angle siam theih a ni lo

angle-invalid-through-point = `<angle>` through-ah point dik lo

parabola-vertex-too-many-points = Vertex nena point 1 aia tam zawha kal parabola chu siam a la ni lo.

parabola-too-many-points = Point 3 aia tam zawha kal parabola chu siam a la ni lo.

intersection-too-many-items = Thil pahnih aia tam tâna intersection chu siam a la ni lo

## Other math components

ionic-compound-not-two-ions = Ion pahnih ni lo tân ionic compound chu siam a la ni lo.

ionic-compound-needs-cation-and-anion = Ionic compound chu cation pakhat leh anion pakhat tân chauh siam a ni.

solve-equations-cannot-evaluate = Equation chhût theih a ni loh avângin equation chhâng theih a ni lo: { $equation }

math-operators-operand-number-required = Math operand la chhuah tûrin operandNumber sawi lan a ngai.

eigen-decomposition-failed = Matrix eigenvalue chhût theih a ni lo

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } chu pattern-ah a awm lo, chuvângin blank chu a inmil reng ang.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" hriatthiam theih a ni lo. None, medium, dense, emaw hnâr hmanga ṭhen number pahnih chhia ni lo, entîr nân grid="1 0.5", a ni tûr a ni. Grid siam a ni lo.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` chuan { $expected ->
        [1] output pakhat, point tin ah slope y', entîr nân `y - x`
       *[other] output pahnih, point tin ah vector, entîr nân `(y, -x)`
    } nei function a mamawh a, mahse function pêk chu output { $found } a nei. { $alternative ->
        [none] Engmah siam a ni lo.
       *[other] Chu function tân chuan `<{ $alternative }>` chu a component a ni. Engmah siam a ni lo.
    }

field-function-attribute-ignored-with-child = Function chu component chhûngah pêk a nih avângin `function` attribute chu hnâwl a ni; a chhûnga awm chu hman a ni. Function chu kawng pakhat chauh hmangin pe rawh.

field-variables-ignored =
    `<{ $component }>`: `variables` attribute chuan component chhûnga ziak ngei expression variable-te a kâwk. { $reason ->
        [function-child] Hetah hian function chu `<function>` fa angin pêk a ni a, chuan a variable ngei a kâwk tawh, chuvângin `variables` chu hnâwl a ni.
       *[no-expression] Hetah hian chutiang expression pêk a awm lo, chuvângin `variables` chu hnâwl a ni.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure renderer-ah xLabelPosition="left" hman theih a ni lo; right-position dân hman a ni.

prefigure-y-label-position-unsupported = `<graph>`: prefigure renderer-ah yLabelPosition="bottom" hman theih a ni lo; top-position dân hman a ni.

prefigure-invalid-axis-bounds = `<graph>`: prefigure lehlin nân axis bound a dik lo; bbox pângngai (-10,-10,10,10) hman a ni.

prefigure-invalid-width = `<graph>`: prefigure lehlin nân width a dik lo; diagram width pângngai 425 hman a ni.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure lehlin nân aspectRatio a dik lo; aspect ratio pângngai 1 hman a ni.

prefigure-grid-spacing-too-fine = `<graph>`: axis chin ram tân grid inkâr a tê lutuk; prefigure renderer-ah grid siam a ni lo.

prefigure-annotations-not-rendered = `<graph>`: PreFigure renderer hman a nih loh chuan annotation-te siam a ni lo.

multiple-annotations-children = `<graph>`-ah `<annotations>` fa tam tak hmuh a ni; a hnuhnung ber lo chu zawng zawng hnâwl a ni.

## Referring to other components

copy-unrecognized-component-type = Component type hriat loh { $type } chu extend emaw copy emaw theih a ni lo.

copy-prop-not-found = Type { $component } component chungah prop { $property } hmuh theih a ni lo

collect-no-source = Collect tân source hmuh a ni lo.

collect-invalid-component-type = Component type `<{ $component }>` chu a dik loh avângin collect theih a ni lo.

reference-index-unavailable = Index `{ $reference }` kâwk theih a ni lo

## `<callAction>`

component-action-unavailable = Component `{ $reference }` chungah { $action } ko theih a ni lo

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data shape a dik lo. Row-te chu an inang lo. componentIdx :{ $componentIdx } ah hmuh a ni

data-frame-duplicate-column-names = Data-ah column hming inang a awm. componentIdx :{ $componentIdx } ah hmuh a ni

data-frame-missing-column-name = Data-ah column hming a tlachham. componentIdx :{ $componentIdx } ah hmuh a ni

## `<answer>` and scoring

answer-award-depends-on-own-response = He answer tâna award chu answer tag ngeia chhânna thawn chungah innghat a ni a, chuan beisei loh thil a thlen ang.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` nei container chhûnga `<answer>` chungah `maxNumAttempts` dah hian nghawng a nei lo, tumna zât chu container-in a enkawl si a. `maxNumAttempts` chu container chungah dah zâwk rawh.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` nei container dang chhûnga `sectionWideCheckWork` nei container chungah `maxNumAttempts` dah hian nghawng a nei lo, tumna zât chu container pawn lam berin a enkawl si a. `maxNumAttempts` chu container pawn lam ber chungah dah zâwk rawh.

answer-attributes-need-symbolic-equality = symbolicEquality dah loh chuan { $attributes } attribute hian nghawng a nei lo vang.

answer-invalid-type = Answer tân type a dik lo: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Component `<{ $component }>` hian hming a neih loh avângin module attribute atân hman theih a ni lo

module-attribute-name-already-defined = Component `<{ $component } name="{ $name }">` chu module attribute atân hman theih a ni lo, `<module>` component type chuan "{ $name }" attribute a nei tawh si a.

conditional-content-condition-ignored = Case emaw else fa nei `<conditionalContent>` component chungah attribute `condition` chu hnâwl a ni.

slider-markers-type-mismatch = Marker type leh slider type a inmil lo.

pretzel-problem-needs-statement-and-answer = Pretzel a dik lo: `<problem>` tin hian `<statement>` pakhat leh `<answer>` pakhat a keng tûr a ni.

pretzel-circuit-first-problem-distractor = Pretzel a dik lo: mode="circuit" ah chuan `<problem>` hmasa ber chu distractor a ni thei lo.

## Attribute values

attribute-invalid-values = Attribute `{ $attribute }` tân value { $values } a dik lo; hnâwl a ni.

attribute-must-be-references = Attribute `{ $attribute }` tân value `{ $value }` a dik lo. Attribute chu `$` hmanga inṭan reference-te hmanga siam a ni tûr a ni.

math-input-invalid-function-names = <mathInput>: { $attribute } ah function hming dik lo hnâwl a ni: { $names }. Hming tin a lan dân chu a tlêm berah hawrawp 2 (hawrawp emaw hnâr emaw) a ni tûr a ni; a hnuah `|<mathspeak alternative>` a zui thei.

## Building components from the source

component-type-invalid = Component type a dik lo: `<{ $componentType }>`

attribute-repeated = Attribute { $attribute } hi tihnawn theih a ni lo.

attribute-invalid-for-component = Type `<{ $componentType }>` component tân attribute "{ $attribute }" a dik lo.

## Style definition contrast

style-definition-insufficient-contrast =
    Style definition { $styleNumber } chuan { $context ->
        [text-on-background] background color hmaa text color
        [high-contrast] canvas hmaa high-contrast color
        [line] canvas hmaa line color
        [marker] canvas hmaa marker color
       *[text-on-canvas] canvas hmaa text color
    } tân contrast a tâwk lo{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a tlêm berah { $threshold }:1 a ngai).

style-definition-dark-mode-text-background-contrast =
    Style definition { $styleNumber } chuan light mode tân contrast tâwk pêk color a sawi lan nâ chung pawhin, chûng value aṭanga chhuak dark-mode color-te chuan background color hmaa text color tân contrast an tâwk lo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a tlêm berah { $threshold }:1 a ngai). { $suggestion ->
        [available] Dark mode-a contrast a tâwk nân, light-mode contrast chu tibelh rawh (entîr nân { $lightAttribute }="{ $lightColor }" dah rawh), a nih loh chuan dark-mode color chu thlâk rawh (entîr nân { $darkAttribute }="{ $darkColor }" dah rawh).
       *[none] Dark mode-a contrast a tâwk nân, light-mode contrast chu tibelh rawh, a nih loh chuan chhuak color-te chu textColorDarkMode leh/emaw backgroundColorDarkMode hmangin thlâk rawh.
    }

style-definition-dark-mode-text-canvas-contrast =
    Style definition { $styleNumber } chuan light mode tân contrast tâwk pêk text color a sawi lan nâ chung pawhin, he value aṭanga chhuak dark-mode text color chuan canvas hmaah contrast a tâwk lo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a tlêm berah { $threshold }:1 a ngai). { $suggestion ->
        [available] Dark mode-a contrast a tâwk nân, light-mode contrast chu tibelh rawh (entîr nân textColor="{ $lightColor }" dah rawh), a nih loh chuan dark-mode color chu thlâk rawh (entîr nân textColorDarkMode="{ $darkColor }" dah rawh).
       *[none] Dark mode-a contrast a tâwk nân, light-mode contrast chu tibelh rawh, a nih loh chuan chhuak color chu textColorDarkMode hmangin thlâk rawh.
    }

section-multiple-style-palettes = Section pakhatin <stylePalette> pakhat chauh a thlang thei; a hnuhnung ber hman a ni.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } unique variant hriat chian theih a ni lo, numToSelect chu integer chhia ni lo a ni lo si a.

variant-num-to-select-not-constant-number = { $component } unique variant hriat chian theih a ni lo, numToSelect chu number inthlâk thin lo a ni lo si a.

variant-with-replacement-not-constant-boolean = { $component } unique variant hriat chian theih a ni lo, withReplacement chu boolean inthlâk thin lo a ni lo si a.

variant-select-weight-disables-unique = SelectWeight emaw selectForVariants emaw sawi lan option a awm a nih chuan select tân unique variant chu tibo a ni

variant-coprime-undetermined = { $component } unique variant hriat chian theih a ni lo, coprime chu a dik lo reng tih hriat chian theih a ni lo si a.

variant-attribute-not-constant = { $component } unique variant hriat chian theih a ni lo, { $attribute } chu inthlâk thin lo a ni lo si a.

variant-attribute-not-number = { $component } unique variant hriat chian theih a ni lo, { $attribute } chu number a ni lo si a.

variant-attribute-wrong-type-for-sequence =
    { $type } type { $component } unique variant hriat chian theih a ni lo, { $attribute } chu { $expected ->
        [letters-combination] hawrawp inzawmkhâwm
        [math-expression] math expression dik
        [integer] integer
       *[number] number
    } a ni lo si a.

variant-length-not-integer = { $component } unique variant hriat chian theih a ni lo, length chu integer a ni lo si a.

variant-sort-not-implemented = Sort nei { $component } unique variant chu siam a la ni lo

variant-exclude-combinations-not-implemented = ExcludeCombinations nei { $component } unique variant chu siam a la ni lo

variant-math-exclude-not-implemented = Exclude nei math type { $component } unique variant chu siam a la ni lo

variant-non-constant-exclude-not-implemented = Inthlâk thin exclude nei { $component } unique variant chu siam a la ni lo

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure renderer-ah hman theih a ni lo; fa chu hnâwl a ni.

prefigure-descendant-invalid-geometry = { $subject }: geometry a tâwk lo emaw a tâwp lo emaw; fa chu hnâwl a ni.

prefigure-curve-label-omitted = { $subject }: lehlin curve element-ah label hman theih a ni lo; label chu hnâwl a ni.

prefigure-curve-unsupported-definition-type = { $subject }: curve function definition type '{ $definitionType }' hman theih a ni lo; fa chu hnâwl a ni.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves chungah flipFunctions attribute hman theih a ni lo; fa chu hnâwl a ni.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves chungah formula type function fa chauh hman theih a ni; fa chu hnâwl a ni.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] line-family label
       *[point] point label
    } tân labelPosition '{ $labelPosition }' hman theih a ni lo; PreFigure alignment pângngai hman a ni.

prefigure-fill-style-unsupported = { $subject }: fill style '{ $fillStyle }' chu PreFigure-in a hmang thei lo; fill kim a lo kîr leh.

prefigure-line-style-unknown = { $subject }: line style hriat loh '{ $lineStyle }' chu PreFigure output aṭangin hnâwl a ni.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker style '{ $markerStyle }' chu PreFigure style 'diamond' ah thlâk a ni.

prefigure-marker-style-unsupported = { $subject }: marker style '{ $markerStyle }' chu PreFigure-in a hmang thei lo; style pângngai hman a ni.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` a dik lo; target kâwk chhuah theih a ni lo. Annotation chu hnâwl a ni.

annotation-ref-multiple-targets = `<annotation>`: `ref` chuan target tam tak a kâwk; target hmasa ber hman a ni.

annotation-ref-outside-graph = `<annotation>`: `ref` a dik lo; target chu graph pawn lamah a awm. Annotation chu hnâwl a ni.

annotation-ref-unsupported-target = `<annotation>`: `ref` a dik lo; target chu prefigure lehlinnaah graphical object hman theih a ni lo. Annotation chu hnâwl a ni.

annotation-text-missing = `<annotation>`: `text` a tlachham emaw a ruak emaw; text ruak chhuah a ni.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Circular dependency hmuh a ni.
       *[other] `<{ $componentType }>` component tel circular dependency hmuh a ni.
    }

reference-no-referent = Reference tân referent hmuh a ni lo: `{ $reference }`

reference-multiple-referents = Reference tân referent tam tak hmuh a ni: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` attribute { $attribute } format a dik lo.

children-invalid = `<{ $componentType }>` tân fa a dik lo: fa dik lo hmuh a ni: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Attribute `{ $attribute }` tân value `{ $value }` a dik lo, value `{ $default }` hman a ni

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML version { $version } hmuh a ni lo.
       *[other] DoenetML version { $version } hmuh a ni lo. Version { $fallback } lamah a kîr leh
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML dik lo: { $content }

parse-tag-missing-close-tag = DoenetML dik lo: Tag `{ $tag }` hian khârna tag a nei lo. Amah khârtu tag emaw `</{ $tagName }>` tag emaw a ngai.

parse-tag-error = DoenetML dik lo: Tag `<{ $tagName }>` ah thil dik lo

parse-attribute-missing-value = DoenetML dik lo: Attribute `{ $attribute }` a dik lo, value a tlachham anga lang.

parse-attribute-invalid = DoenetML dik lo: Attribute `{ $attribute }` a dik lo

parse-attribute-value-invalid = DoenetML dik lo: Attribute value `{ $value }` a dik lo

parse-attribute-value-quote-mismatch = DoenetML dik lo: Attribute value `{ $value }` a dik lo. Quote mark-te a inmil lo. `{ $quote }` a tlachham anga lang

parse-open-tag-name-missing = DoenetML dik lo: Tag hming nei lo tag hmuh a ni, entîr nân `<`

parse-tag-not-closed = DoenetML dik lo: Tag `{ $tag }` khâr a ni lo (`>` a tlachham anga lang).

parse-self-closing-tag-name-missing = DoenetML dik lo: Tag hming nei lo tag hmuh a ni `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML dik lo: Tag `{ $tag }` khâr a ni lo (`/>` a tlachham anga lang).

parse-tag-invalid-attributes = DoenetML dik lo: Tag `{ $tag }` a dik lo. Attribute dik lo a nei mai thei.

parse-close-tag-name-missing = DoenetML dik lo: Tag hming nei lo khârna tag hmuh a ni, entîr nân `</`

parse-attribute-value-unquoted = Attribute value-te chu quote chhûngah dah tûr a ni: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML dik lo: Khârna tag `{ $tag }` hmuh a ni, mahse a hawnna tag a awm lo

parse-close-tag-mismatched = DoenetML dik lo: Khârna tag a inmil lo. `</{ $expected }>` beisei a ni. `{ $found }` hmuh a ni

parser-node-unconvertible = Node { $node } chu Dast node-ah lehlin theih a ni lo.

## Names

name-attribute-invalid =
    Attribute name='{ $name }' a dik lo. { $reason ->
        [characters] Hming-ah hawrawp, number, underscore emaw hyphen emaw chauh a awm thei.
       *[start] Hming chu hawrawp hmangin a inṭan tûr a ni.
    }

component-name-invalid-start = Component hming "{ $name }" a dik lo. Hming chu hawrawp hmangin a inṭan tûr a ni.

## `<answer>` sugar

answer-video-watched-missing-video = Type videoWatched nei answer chuan video attribute a nei tûr a ni

answer-video-watched-video-not-reference = Type videoWatched nei answer chuan reference ni video attribute a nei tûr a ni

answer-name-not-single-text = Answer name attribute chuan text fa pakhat a nei tûr a ni

## Referencing another document

external-doenetml-recursion-limit = Recursion a lêt tam lutuk avângin pawn lam DoenetML la chhuah theih a ni lo. Circular reference a awm em ni?

external-doenetml-unavailable = { $attribute }="{ $uri }" aṭangin DoenetML la chhuah theih a ni lo

external-doenetml-type-mismatch = { $attribute }="{ $uri }" aṭanga la chhuah DoenetML a dik lo: component type "{ $componentType }" nên a inmil lo

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` chu hman tawh loh tûr a ni; a aiin `{ $to }` hmang rawh.
       *[other] [deprecation] `<{ $component }>` chunga attribute `{ $from }` chu hman tawh loh tûr a ni; a aiin `{ $to }` hmang rawh.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` pawh sawi lan a nih avângin attribute `{ $from }` chu hman tawh loh tûr a ni a, hnâwl a ni.
       *[other] [deprecation] `{ $to }` pawh sawi lan a nih avângin `<{ $component }>` chunga attribute `{ $from }` chu hman tawh loh tûr a ni a, hnâwl a ni.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` chunga attribute `{ $attribute }` chu hman tawh loh tûr a ni a, hnâwl a ni.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` chunga attribute `{ $attribute }` chu hman tawh loh tûr a ni; a aiin `<{ $child }>` fa hmang rawh.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` chunga attribute `{ $attribute }` value `{ $value }` chu hman tawh loh tûr a ni; a aiin `{ $to }` hmang rawh.


## Language coverage

pluralize-english-only = `<pluralize>` hian English chauh a tipung thei a, chuvângin { $locale } hmanga ziak document-ah chuan a thu chu thlâk loh a ni. Pung tak chu ziak ngei rawh, a nih loh chuan `pluralForm` attribute hmangin dah rawh.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` chu Doenet element hriat a ni lo.

schema-element-not-allowed-at-root = Element `<{ $tag }>` chu document bul beraah phal a ni lo.

schema-element-not-allowed-inside = Element `<{ $tag }>` chu `<{ $parent }>` chhûngah phal a ni lo.

schema-attribute-unrecognized = Element `<{ $tag }>` chuan `{ $attribute }` tia hriat attribute a nei lo.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Element `<{ $tag }>` attribute `{ $attribute }` chu a item tin heng zînga pakhat ni list a ni tûr a ni: { $allowed }
       *[other] Element `<{ $tag }>` attribute `{ $attribute }` chu heng zînga pakhat a ni tûr a ni: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select tân variant hming a dik lo. Variant hming { $variantName } chu option { $numOptions } ah a lang a, thlan tûr zât erawh { $numToSelect } a ni.

select-variant-name-without-options = Select tân variant ṭhenkhat sawi lan a ni, mahse variant hming theih tûr { $variantName } tân option sawi lan a awm lo.

select-variant-name-not-possible = Select tâna sawi lan variant hming { $variantName } chu variant hming theih tûr a ni lo.

select-too-few-options = { $numOptions } chauh zînga component { $numToSelect } thlang theih a ni lo.

select-from-sequence-too-few-values = Length { $length } sequence aṭangin value { $numToSelect } thlang theih a ni lo.

select-from-sequence-indices-count-mismatch = Select tâna sawi lan indices zât leh thlan tûr zât a inmil tûr a ni

select-from-sequence-indices-not-integers = Select tâna sawi lan indices zawng zawng chu integer a ni tûr a ni

select-from-sequence-index-excluded = Hnâwl tawh selectfromsequence index sawi lan a ni

select-from-sequence-indices-excluded-combination = Hnâwl tawh inzawmkhâwm ni selectfromsequence indices sawi lan a ni

select-from-sequence-coprime-not-positive-integers = Integer ṭha thlan a nih loh avângin coprime inzawmkhâwm thlang theih a ni lo.

select-from-sequence-coprime-common-factor = Coprime number thlang theih a ni lo. Value theih tûr zawng zawngin factor an nei pawlh. ("from" emaw "to" emaw value sawi lan chu "step" nên coprime a ni tûr a ni.)

select-from-sequence-coprime-single-number = 1 ni lo number pakhat aṭangin coprime inzawmkhâwm thlang theih a ni lo.

select-from-sequence-excluded-too-many-combinations = selectFromSequence-ah inzawmkhâwm 70% aia tam hnâwl a ni

select-from-sequence-coprime-none-found = Coprime number thlang theih a ni lo. Value theih tûr zawng zawngin factor an nei pawlh.

select-from-sequence-too-few-unique-values = Length { $numPossibleValues } sequence aṭangin unique value { $numToSelect } thlang theih a ni lo

select-prime-numbers-too-few-values = Length { $numValues } prime number list aṭangin value { $numToSelect } thlang theih a ni lo

select-prime-numbers-values-count-mismatch = Select tâna sawi lan value zât leh thlan tûr zât a inmil tûr a ni

select-prime-numbers-values-not-prime = Select prime number tâna sawi lan value zawng zawng chu prime number list-ah a awm tûr a ni

select-prime-numbers-values-excluded-combination = Hnâwl tawh inzawmkhâwm ni selectPrimeNumbers value sawi lan a ni

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-ah inzawmkhâwm 70% aia tam hnâwl a ni

select-random-combination-fluke = Thleng ngai lo tak angin, random value inzawmkhâwm thlang theih a ni lo

select-random-value-fluke = Thleng ngai lo tak angin, random value thlang theih a ni lo

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] He `<{ $component }>` hi entîr a ni lo, math chhûngah a awm a, `inline` a ni lo si a. Expression chhûnga inhûm thei drop-down list a nih theih nân `inline` belh rawh.
        [expanded] He `<{ $component }>` hi entîr a ni lo, math chhûngah a awm a, `expanded` a ni si a. `expanded` chu paih rawh; box lem tam chu expression chhûngah a inhûm lo.
        [on-graph] He `<{ $component }>` hi entîr a ni lo, graph chunga siam math chhûngah a awm a, chuan input tân hmun a awm lo.
       *[relative-width] He `<{ $component }>` hi entîr a ni lo, math chhûngah a awm a, width relative a nei si a. A aiin `px` ang chi absolute unit hmangin width pe rawh.
    }
