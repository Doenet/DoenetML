# Bambara diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Where English separates a singular from a plural only in the verb — "is
# ignored" against "are ignored" — the Bambara verb takes no number from its
# subject, and the argument is a list either way. So those selects are dropped
# and the count argument goes unused.
#
# The technical vocabulary is the French-derived one Malian schooling supplies
# — «fɔnksiyɔn», «endɛsi», «wariyabili» — beside the Bambara words for the
# things that are not technical: «liɲi» a line, «hakɛ» a value, «tɔgɔ» a name.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } tɛ jateminɛ ni dan-pɔn fila fɔra

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } tɛ jateminɛ ni dan-pɔn ni cɛmancɛ-pɔn bɛɛ fɔra

line-segment-midpoint-offset-without-midpoint = midpointOffset tɛ foyi kɛ ni cɛmancɛ-pɔn tɛ yen

## `<line>`

line-points-undetermined-dimensions = Liɲi bɛ tɛmɛ pɔn minnu kan, olu bonya ma jateminɛ.

line-points-too-few-dimensions = Liɲi ka kan ka tɛmɛ pɔn minnu kan, olu ka kan ka kɛ bonya fila ye a dɔgɔyalenba.

line-points-depend-on-variables = Liɲi bɛ tɛmɛ pɔn minnu kan, olu bɛ wariyabiliw kan: { $variables }.

line-equation-invalid-format = Cogoya tɛ ɲɛ liɲi ekuwasiyɔn na wariyabili { $variable1 } ni { $variable2 } la.

## `<ray>`

ray-overprescribed-through = Reyɔn fɔra ni through, endpoint ani direction bɛɛ ye. through fɔlen tɛ jateminɛ.

ray-dimension-mismatch = numDimensions ma bɛn reyɔn kɔnɔ.

## `<vector>`

vector-overprescribed-head = Wɛkitɛri fɔra ni head, tail ani displacement bɛɛ ye. head fɔlen tɛ jateminɛ.

vector-dimension-mismatch = numDimensions ma bɛn wɛkitɛri kɔnɔ.

## Attracting and constraining

attract-to-without-nearest-point = A tɛ se ka sama `<{ $component }>` ma sabu cogoya-wariyabili nearestPoint t'a la.

constrain-to-without-nearest-point = A tɛ se ka siri `<{ $component }>` la sabu cogoya-wariyabili nearestPoint t'a la.

constrain-to-interior-without-nearest-point = A tɛ se ka siri `<{ $component }>` kɔnɔ sabu cogoya-wariyabili nearestPoint t'a la.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition tɛ jateminɛ choiceInput min tɛ liɲi kelen ye

## Ordering children by index

choice-input-indices-count-mismatch = Endɛsi fɔlenw tɛ jateminɛ choiceInput na sabu endɛsi hakɛ ma bɛn choice den hakɛ ma.

pretzel-indices-count-mismatch = Endɛsi fɔlenw tɛ jateminɛ problem na sabu endɛsi hakɛ ma bɛn problem den hakɛ ma.

shuffle-indices-count-mismatch = Endɛsi fɔlenw tɛ jateminɛ shuffle na sabu endɛsi hakɛ ma bɛn elemanti hakɛ ma.

indices-ignored-out-of-range = Endɛsi fɔlenw tɛ jateminɛ { $component } na sabu endɛsi dɔw bɛ dancɛ kɔfɛ.

pretzel-indices-repeated = Endɛsi fɔlenw tɛ jateminɛ pretzel na sabu endɛsi dɔw seginna.

pretzel-circuit-first-index = Endɛsi fɔlenw tɛ jateminɛ pretzel na circuit cogoya la sabu endɛsi fɔlɔ ka kan ka kɛ 1 ye.

## `<shuffle>` and `<sort>`

string-children-need-type = Walasa `<{ $component }>` ka baara kɛ ni sɛbɛnni suguya denw ye, atiribi `type` ka kan ka fɔ.

invalid-type-defaulting-to-math = type { $type } tɛ ɲɛ elemanti { $component } ma. A ka kan ka kɛ math, text, number walima boolean dɔ ye. A bilala math la.

string-not-valid-component-to-arrange = Sɛbɛnni "{ $value }" tɛ { $component } elemanti bɛnnen ye. A tɛ jateminɛ.

## Types and variables

invalid-type-defaulting-to-number = type { $type } tɛ ɲɛ, type bilala number la.

invalid-variable-value = Wariyabili hakɛ tɛ ɲɛ: `{ $value }`

## Variants

variant-index-must-be-number = Cogoya endɛsi { $index } ka kan ka kɛ jate ye

variant-index-must-be-integer = Cogoya endɛsi { $index } ka kan ka kɛ jate dafalen ye

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ma labɛn ni sumani jɔlenw ye. Bonyaw bilala tilancɛ la.

side-by-side-absolute-margins = `<{ $component }>` ma labɛn ni sumani jɔlenw ye. Dafɛlaw bilala tilancɛ la.

side-by-side-no-block-child = `<{ $component }>` tɛ ɲɛ: bloki suguya den kelen ka kan ka kɛ a la a dɔgɔyalenba.

## `<label>`

label-for-ignored-on-graphical = Atiribi `for` tɛ jateminɛ ja `<label>` kan.

label-for-must-resolve-to-one = Atiribi `for` min bɛ `<label>` la, o ka kan ka elemanti kelen dɔrɔn jira.

label-for-unresolved = Atiribi `for` min bɛ `<label>` la, o ma se ka elemanti si jira.

label-for-answer-with-authored-inputs = Atiribi `for` min bɛ `<label>` la, o bɛ `<answer>` yira min donyɔrɔw sɛbɛnna; donyɔrɔ yɛrɛ yira.

label-for-answer-without-input = Atiribi `for` min bɛ `<label>` la, o bɛ `<answer>` yira min donyɔrɔ tɛ tɔgɔ da.

label-for-must-reference-input-or-answer = Atiribi `for` min bɛ `<label>` la, o ka kan ka donyɔrɔ walima jaabi yira.

## Accessibility

accessibility-short-description-or-decorative = Sɔrɔliya kama, `<{ $component }>` ka kan ka kɛ ni ɲɛfɔli surunman ye walima k'a fɔ ko masiri lo.

accessibility-video-short-description = Sɔrɔliya kama, `<video>` ka kan ka kɛ ni ɲɛfɔli surunman ye.

accessibility-input-short-description-or-label = Sɔrɔliya kama, `<{ $component }>` ka kan ka kɛ ni ɲɛfɔli surunman walima tɔgɔ ye.

accessibility-answer-input-short-description-or-label = Sɔrɔliya kama, `<answer>` min bɛ donyɔrɔ da, o ka kan ka kɛ ni ɲɛfɔli surunman walima tɔgɔ ye.

accessibility-short-description-contains-math = Ɲɛfɔli surunman man kan ka kɛ ni matematiki elemantiw ye i n'a fɔ `<{ $component }>`. Matematiki bɛɛ ɲɛfɔ ni kumaw ye.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } danfaralikɛ man ca yɔrɔ kuncɛ sɛbɛnni kama (dibi cogoya) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka kan ka kɛ { $threshold }:1 ye a dɔgɔyalenba).
       *[other] { $colorName } danfaralikɛ man ca yɔrɔ kuncɛ sɛbɛnni kama ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka kan ka kɛ { $threshold }:1 ye a dɔgɔyalenba).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` min bɛ tɛmɛ pɔn { $count } kan, o ma labɛn fɔlɔ ni jate hakɛ tɛ pɔn olu la.

circle-too-many-through-points = A tɛ se ka sɛrɛkili jate min bɛ tɛmɛ pɔn 3 ni kɔ kan.

circle-overprescribed-radius-center-points = A tɛ se ka sɛrɛkili jate ni reyɔn, cɛmancɛ ani tɛmɛ-pɔnw bɛɛ fɔra.

circle-center-with-multiple-points = A tɛ se ka sɛrɛkili jate min cɛmancɛ fɔra ani min bɛ tɛmɛ pɔn 1 ni kɔ kan.

circle-radius-too-small = A tɛ se ka sɛrɛkili jate: sabu pɔn fila ni ɲɔgɔn cɛ ye { $distance } ye, reyɔn { $radius } fɔlen ka dɔgɔ kojugu.

circle-radius-with-many-points = A tɛ se ka sɛrɛkili da min bɛ tɛmɛ pɔn fila ni kɔ kan ni reyɔn fɔlen ye.

circle-invalid-center-or-through-points = Sɛrɛkili cɛmancɛ walima a tɛmɛ-pɔnw tɛ ɲɛ.

circle-radius-center-with-multiple-points = A tɛ se ka sɛrɛkili reyɔn jate min cɛmancɛ fɔra ani min bɛ tɛmɛ pɔn 1 ni kɔ kan.

circle-change-radius-non-numerical = A tɛ se ka sɛrɛkili reyɔn yɛlɛma min bɛ tɛmɛ pɔn kan minnu jate hakɛ tɛ yen

circle-radius-with-points-non-numerical = A tɛ se ka sɛrɛkili da min bɛ tɛmɛ pɔn kelen ni kɔ kan ni reyɔn fɔlen ye ni jate hakɛ tɛ yen.

circle-change-center-non-numerical = Sɛrɛkili cɛmancɛ yɛlɛmani ma labɛn fɔlɔ min bɛ tɛmɛ pɔn kan minnu jate hakɛ tɛ yen.

## `<function>`

function-domain-insufficient-dimensions = Fɔnksiyɔn dancɛ bonyaw man ca. Dancɛ ɛntɛrɛvali hakɛ ye { $intervals } ye nka fɔnksiyɔn donyɔrɔ hakɛ ye { $inputs } ye.

function-domain-invalid-format = Fɔnksiyɔn dancɛ cogoya tɛ ɲɛ.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Fɔnksiyɔn sanfɛ-dan min tɛ jate ye, o tɛ jateminɛ.
        [minimum] Fɔnksiyɔn dugumafɛ-dan min tɛ jate ye, o tɛ jateminɛ.
        [extremum] Fɔnksiyɔn dan min tɛ jate ye, o tɛ jateminɛ.
        [point] Fɔnksiyɔn pɔn min tɛ jate ye, o tɛ jateminɛ.
        [slope] Fɔnksiyɔn jɛngɛnni min tɛ jate ye, o tɛ jateminɛ.
       *[other] Fɔnksiyɔn { $type } min tɛ jate ye, o tɛ jateminɛ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Fɔnksiyɔn sanfɛ-dan lankolon tɛ jateminɛ.
        [minimum] Fɔnksiyɔn dugumafɛ-dan lankolon tɛ jateminɛ.
        [extremum] Fɔnksiyɔn dan lankolon tɛ jateminɛ.
        [point] Fɔnksiyɔn pɔn lankolon tɛ jateminɛ.
       *[other] Fɔnksiyɔn { $type } lankolon tɛ jateminɛ.
    }

function-points-too-close = Fɔnksiyɔn pɔn fila ka surun ɲɔgɔn na kojugu. Fɔnksiyɔn tɛ se ka kɔrɔfɔ.

function-iterates-input-output-mismatch = Fɔnksiyɔn seginni bɛ se ka kɛ dɔrɔn ni donyɔrɔ hakɛ ni bɔyɔrɔ hakɛ bɛnna. Nin fɔnksiyɔn donyɔrɔ ye { $inputs } ye, a bɔyɔrɔ ye { $outputs } ye.

## `<sequence>`

sequence-invalid-length = Sekansi janya tɛ ɲɛ. A ka kan ka kɛ jate dafalen ye min tɛ dɔgɔya-jate ye.

sequence-invalid-step = Sekansi taama tɛ ɲɛ. { $type } suguya sekansi la, a ka kan ka kɛ jate ye.

sequence-invalid-endpoint-number = Jate sekansi ka "{ $attribute }" tɛ ɲɛ. A ka kan ka kɛ jate ye.

sequence-invalid-endpoint-letters = Sɛbɛnden sekansi ka "{ $attribute }" tɛ ɲɛ. A ka kan ka kɛ sɛbɛndenw ye.

sequence-invalid-endpoint = Sekansi ka "{ $attribute }" tɛ ɲɛ.

select-from-sequence-coprime-not-numbers = coprime tɛ jateminɛ sabu jate tɛ minnu bɛ sugandi

select-from-sequence-coprime-with-exclude-combinations = coprime tɛ jateminɛ sabu excludeCombinations fɔra

## Resolving a `target`

target-not-found = target tɛ ɲɛ `<{ $source }>` la: laɲini ma sɔrɔ.

target-state-variable-not-found = target tɛ ɲɛ `<{ $source }>` la: cogoya-wariyabili min tɔgɔ ye "{ $property }", o ma sɔrɔ `<{ $component }>` la.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` wariyabiliw ka kan ka danfara wariyabili yɛrɛmahɔrɔn na.

ode-system-duplicate-variable-names = ODE RHS fɔnksiyɔnw tɛ se ka kɔrɔfɔ ni wariyabili tɔgɔ seginlenw bɛ yen.

ode-system-rhs-function-error = ODE RHS fɔnksiyɔn tɛ se ka kɔrɔfɔ. Fili kɛra mathjs fɔnksiyɔn dabɔli la.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Liɲi { $count } cɛ kɔrɔnnin tɛ se ka kɔrɔfɔ

angle-invalid-through-point = Pɔn tɛ ɲɛ `<angle>` ka through kɔnɔ

parabola-vertex-too-many-points = Parabɔli min kuncɛ bɛ yen ani min bɛ tɛmɛ pɔn 1 ni kɔ kan, o ma labɛn fɔlɔ.

parabola-too-many-points = Parabɔli min bɛ tɛmɛ pɔn 3 ni kɔ kan, o ma labɛn fɔlɔ.

intersection-too-many-items = Fɛn fila ni kɔ ka tɛmɛsira ma labɛn fɔlɔ

## Other math components

ionic-compound-not-two-ions = Iyɔn fɛn-fara min bɛ tɛmɛ iyɔn fila kan, o ma labɛn fɔlɔ.

ionic-compound-needs-cation-and-anion = Iyɔn fɛn-fara labɛnna katiyɔn kelen ni aniyɔn kelen dɔrɔn kama.

solve-equations-cannot-evaluate = Ekuwasiyɔn tɛ se ka ɲɛnabɔ sabu a ma se ka jate: { $equation }

math-operators-operand-number-required = operandNumber ka kan ka fɔ ni matematiki baarafɛn bɛ bɔ.

eigen-decomposition-failed = Matirisi ka eigen hakɛw tɛ se ka jate

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: paramɛtiri { $parameters } tɛ cogoya kɔnɔ, o de kama u bɛna bɛn lankolon ma tuma bɛɛ.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" tɛ se ka kɔrɔfɔ. A ka kan ka kɛ none, medium, dense, walima jate jɔlen fila ye minnu tilalen don ni funtan ye, i n'a fɔ grid="1 0.5". Girize si tɛ ja.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" tɛ dɛmɛ sɔrɔ prefigure jirala la; kinifɛ cogoya de bɛ baara kɛ.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" tɛ dɛmɛ sɔrɔ prefigure jirala la; sanfɛ cogoya de bɛ baara kɛ.

prefigure-invalid-axis-bounds = `<graph>`: aksi dancɛw tɛ ɲɛ prefigure yɛlɛmani kama; bbox bilalen (-10,-10,10,10) de bɛ baara kɛ.

prefigure-invalid-width = `<graph>`: bonya tɛ ɲɛ prefigure yɛlɛmani kama; ja bonya bilalen 425 de bɛ baara kɛ.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio tɛ ɲɛ prefigure yɛlɛmani kama; rapɔri bilalen 1 de bɛ baara kɛ.

prefigure-grid-spacing-too-fine = `<graph>`: girize cɛtigɛw ka misɛn kojugu aksi dancɛw kama; girize bilala prefigure jirala la.

prefigure-annotations-not-rendered = `<graph>`: kɔlɔsiliw tɛna jira ni PreFigure jirala tɛ baara la.

multiple-annotations-children = `<annotations>` den caman sɔrɔla `<graph>` kɔnɔ; u bɛɛ tɛ jateminɛ fo laban.

## Referring to other components

copy-unrecognized-component-type = Elemanti suguya lɔnbali tɛ se ka yɛlɛma walima ka kopi kɛ: { $type }.

copy-prop-not-found = Atiribi { $property } ma sɔrɔ { $component } suguya elemanti la

collect-no-source = Sɔrɔyɔrɔ si ma sɔrɔ collect kama.

collect-invalid-component-type = `<{ $component }>` suguya elemantiw tɛ se ka lajɛ sabu elemanti suguya tɛ ɲɛ.

reference-index-unavailable = Endɛsi `{ $reference }` tɛ se ka yira

## `<callAction>`

component-action-unavailable = { $action } tɛ se ka wele elemanti `{ $reference }` kan

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Kunnafoni cogoya tɛ ɲɛ. Layiniw janya ma bɛn ɲɔgɔn ma. A sɔrɔla componentIdx :{ $componentIdx } la

data-frame-duplicate-column-names = Kunnafoni kɔnɔ kolɔni tɔgɔ dɔw seginna. A sɔrɔla componentIdx :{ $componentIdx } la

data-frame-missing-column-name = Kolɔni tɔgɔ tɛ kunnafoni na. A sɔrɔla componentIdx :{ $componentIdx } la

## `<answer>` and scoring

answer-award-depends-on-own-response = Nin jaabi ka award kelen bɛ jaabi kan answer tagi yɛrɛ ye min ci, o bɛna cogoya kɔnɔnata lase.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` bilali `<answer>` kan min bɛ minɛn kɔnɔ min bɛ ni `sectionWideCheckWork` ye, o tɛ foyi kɛ, sabu o minɛn de bɛ cɛsiri hakɛ mara. `maxNumAttempts` bila minɛn yɛrɛ kan.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` bilali minɛn kan min bɛ ni `sectionWideCheckWork` ye ani min bɛ minɛn wɛrɛ kɔnɔ min fana bɛ ni `sectionWideCheckWork` ye, o tɛ foyi kɛ, sabu kɛnɛma minɛn de bɛ cɛsiri hakɛ mara. `maxNumAttempts` bila kɛnɛma minɛn kan.

answer-attributes-need-symbolic-equality = Atiribi { $attributes } tɛna foyi kɛ ni symbolicEquality ma bila.

answer-invalid-type = Suguya tɛ ɲɛ jaabi la: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sabu elemanti `<{ $component }>` tɔgɔ tɛ yen, a tɛ se ka kɛ module atiribi ye

module-attribute-name-already-defined = Elemanti `<{ $component } name="{ $name }">` tɛ se ka kɛ module atiribi ye sabu elemanti suguya `<module>` bɛ ni atiribi ye kaban min tɔgɔ ye "{ $name }".

conditional-content-condition-ignored = Atiribi `condition` tɛ jateminɛ elemanti `<conditionalContent>` kan min bɛ ni case walima else denw ye.

slider-markers-type-mismatch = Taamasiɲɛw suguya ma bɛn slider suguya ma.

pretzel-problem-needs-statement-and-answer = pretzel tɛ ɲɛ: `<problem>` kelen-kelen bɛɛ ka kan ka kɛ ni `<statement>` kelen ni `<answer>` kelen ye.

pretzel-circuit-first-problem-distractor = pretzel tɛ ɲɛ: mode="circuit" la, `<problem>` fɔlɔ tɛ se ka kɛ nɛgɛnnikɛlan ye.

## Attribute values

attribute-invalid-values = Hakɛ { $values } tɛ ɲɛ atiribi `{ $attribute }` la; u tɛ jateminɛ.

attribute-must-be-references = Hakɛ `{ $value }` tɛ ɲɛ atiribi `{ $attribute }` la. Atiribi ka kan ka kɛ yiraliw ye minnu bɛ daminɛ ni `$` ye.

math-input-invalid-function-names = <mathInput>: fɔnksiyɔn tɔgɔ minnu tɛ ɲɛ { $attribute } kɔnɔ, olu tɛ jateminɛ: { $names }. Tɔgɔ kelen-kelen bɛɛ jirali yɔrɔ ka kan ka kɛ sɛbɛnden 2 ye a dɔgɔyalenba (sɛbɛnden walima jɛngɛn); `|<mathspeak alternative>` bɛ se ka tugu a kɔ ni a diyara.

## Building components from the source

component-type-invalid = Elemanti suguya tɛ ɲɛ: `<{ $componentType }>`

attribute-repeated = Atiribi { $attribute } tɛ se ka segin.

attribute-invalid-for-component = Atiribi "{ $attribute }" tɛ ɲɛ `<{ $componentType }>` suguya elemanti la.

## Style definition contrast

style-definition-insufficient-contrast =
    Cogoya kɔrɔfɔli { $styleNumber } danfaralikɛ man ca { $context ->
        [text-on-background] sɛbɛnni kulɛri ni kɔkanna kulɛri cɛ
        [high-contrast] danfaralikɛ-caman kulɛri ni jayɔrɔ cɛ
        [line] liɲi kulɛri ni jayɔrɔ cɛ
        [marker] taamasiɲɛ kulɛri ni jayɔrɔ cɛ
       *[text-on-canvas] sɛbɛnni kulɛri ni jayɔrɔ cɛ
    }{ $mode ->
        [dark] { " (dibi cogoya)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka kan ka kɛ { $threshold }:1 ye a dɔgɔyalenba).

style-definition-dark-mode-text-background-contrast =
    Hali ni cogoya kɔrɔfɔli { $styleNumber } ye kulɛriw fɔ minnu danfaralikɛ ka ca yeelen cogoya la, dibi cogoya kulɛri minnu bɔra olu la, olu danfaralikɛ man ca sɛbɛnni kulɛri ni kɔkanna kulɛri cɛ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka kan ka kɛ { $threshold }:1 ye a dɔgɔyalenba). { $suggestion ->
        [available] Walasa danfaralikɛ ka ca dibi cogoya la, yeelen cogoya danfaralikɛ caya (misali la { $lightAttribute }="{ $lightColor }" bila) walima dibi cogoya kulɛri yɛlɛma (misali la { $darkAttribute }="{ $darkColor }" bila).
       *[none] Walasa danfaralikɛ ka ca dibi cogoya la, yeelen cogoya danfaralikɛ caya walima kulɛri bɔlenw yɛlɛma ni textColorDarkMode ni/walima backgroundColorDarkMode ye.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hali ni cogoya kɔrɔfɔli { $styleNumber } ye sɛbɛnni kulɛri fɔ min danfaralikɛ ka ca yeelen cogoya la, dibi cogoya sɛbɛnni kulɛri min bɔra o la, o danfaralikɛ man ca jayɔrɔ kama ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka kan ka kɛ { $threshold }:1 ye a dɔgɔyalenba). { $suggestion ->
        [available] Walasa danfaralikɛ ka ca dibi cogoya la, yeelen cogoya danfaralikɛ caya (misali la textColor="{ $lightColor }" bila) walima dibi cogoya kulɛri yɛlɛma (misali la textColorDarkMode="{ $darkColor }" bila).
       *[none] Walasa danfaralikɛ ka ca dibi cogoya la, yeelen cogoya danfaralikɛ caya walima kulɛri bɔlen yɛlɛma ni textColorDarkMode ye.
    }

section-multiple-style-palettes = Yɔrɔ bɛ se ka <stylePalette> kelen dɔrɔn sugandi; laban de bɛ baara kɛ.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } cogoya danmakɛɲɛnenw tɛ se ka jateminɛ sabu numToSelect tɛ jate dafalen ye min tɛ dɔgɔya-jate ye.

variant-num-to-select-not-constant-number = { $component } cogoya danmakɛɲɛnenw tɛ se ka jateminɛ sabu numToSelect tɛ jate basigilen ye.

variant-with-replacement-not-constant-boolean = { $component } cogoya danmakɛɲɛnenw tɛ se ka jateminɛ sabu withReplacement tɛ buleyan basigilen ye.

variant-select-weight-disables-unique = select cogoya danmakɛɲɛnenw bɛ faga ni sugandili dɔ bɛ ni selectWeight walima selectForVariants ye

variant-coprime-undetermined = { $component } cogoya danmakɛɲɛnenw tɛ se ka jateminɛ sabu a tɛ se ka jɛya ko coprime ye galon ye tuma bɛɛ.

variant-attribute-not-constant = { $component } cogoya danmakɛɲɛnenw tɛ se ka jateminɛ sabu { $attribute } ma basigi.

variant-attribute-not-number = { $component } cogoya danmakɛɲɛnenw tɛ se ka jateminɛ sabu { $attribute } tɛ jate ye.

variant-attribute-wrong-type-for-sequence =
    { $component } cogoya danmakɛɲɛnen { $type } suguya tɛ se ka jateminɛ sabu { $attribute } tɛ { $expected ->
        [letters-combination] sɛbɛndenw
        [math-expression] matematiki fɔcogo bɛnnen
        [integer] jate dafalen
       *[number] jate
    } ye.

variant-length-not-integer = { $component } cogoya danmakɛɲɛnenw tɛ se ka jateminɛ sabu length tɛ jate dafalen ye.

variant-sort-not-implemented = { $component } cogoya danmakɛɲɛnenw ni sort ye, olu ma labɛn fɔlɔ

variant-exclude-combinations-not-implemented = { $component } cogoya danmakɛɲɛnenw ni excludeCombinations ye, olu ma labɛn fɔlɔ

variant-math-exclude-not-implemented = { $component } cogoya danmakɛɲɛnen math suguya ni exclude ye, olu ma labɛn fɔlɔ

variant-non-constant-exclude-not-implemented = { $component } cogoya danmakɛɲɛnenw ni exclude basigibali ye, olu ma labɛn fɔlɔ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: a tɛ dɛmɛ sɔrɔ graph prefigure jirala la; bɔnsɔn tɛmɛna.

prefigure-descendant-invalid-geometry = { $subject }: seyomɛtiri dan tɛ min na walima min ma dafa; bɔnsɔn tɛmɛna.

prefigure-curve-label-omitted = { $subject }: tɔgɔw tɛ dɛmɛ sɔrɔ kurubu elemanti yɛlɛmalenw kan; tɔgɔ bilala.

prefigure-curve-unsupported-definition-type = { $subject }: kurubu fɔnksiyɔn kɔrɔfɔli suguya '{ $definitionType }' tɛ dɛmɛ sɔrɔ; bɔnsɔn tɛmɛna.

prefigure-region-flip-functions-unsupported = { $subject }: atiribi flipFunctions min bɛ regionBetweenCurves la, o tɛ dɛmɛ sɔrɔ; bɔnsɔn tɛmɛna.

prefigure-region-non-formula-child = { $subject }: formula suguya den fɔnksiyɔnw dɔrɔn de bɛ dɛmɛ sɔrɔ regionBetweenCurves la; bɔnsɔn tɛmɛna.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' tɛ dɛmɛ sɔrɔ { $labelKind ->
        [line-family] liɲi somɔgɔw tɔgɔ
       *[point] pɔn tɔgɔ
    } kama; PreFigure ka bilali de bɛ baara kɛ.

prefigure-fill-style-unsupported = { $subject }: falen cogoya '{ $fillStyle }' tɛ dɛmɛ sɔrɔ PreFigure fɛ; a bɛ segin kulɛri kelen falen kan.

prefigure-line-style-unknown = { $subject }: liɲi cogoya '{ $lineStyle }' ma lɔn wa a bilala PreFigure bɔyɔrɔ la.

prefigure-marker-style-mapped-to-diamond = { $subject }: taamasiɲɛ cogoya '{ $markerStyle }' bɛnna PreFigure cogoya 'diamond' ma.

prefigure-marker-style-unsupported = { $subject }: taamasiɲɛ cogoya '{ $markerStyle }' tɛ dɛmɛ sɔrɔ PreFigure fɛ; cogoya bilalen de bɛ baara kɛ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` tɛ ɲɛ; laɲini tɛ se ka jateminɛ. Kɔlɔsili bilala.

annotation-ref-multiple-targets = `<annotation>`: `ref` ye laɲini caman fɔ; laɲini fɔlɔ de bɛ baara kɛ.

annotation-ref-outside-graph = `<annotation>`: `ref` tɛ ɲɛ; laɲini bɛ graf kɔfɛ min b'a mara. Kɔlɔsili bilala.

annotation-ref-unsupported-target = `<annotation>`: `ref` tɛ ɲɛ; laɲini tɛ ja fɛn ye min bɛ dɛmɛ sɔrɔ prefigure yɛlɛmani na. Kɔlɔsili bilala.

annotation-text-missing = `<annotation>`: `text` tɛ yen walima a lankolon don; sɛbɛnni lankolon de bɛ bɔ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kuruma-jɔyɔrɔ sɔrɔla.
       *[other] Kuruma-jɔyɔrɔ sɔrɔla min bɛ elemanti `<{ $componentType }>` la.
    }

reference-no-referent = Foyi ma sɔrɔ yirali la: `{ $reference }`

reference-multiple-referents = Fɛn caman sɔrɔla yirali la: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Cogoya tɛ ɲɛ `<{ $componentType }>` ka atiribi { $attribute } la.

children-invalid = Denw tɛ ɲɛ `<{ $componentType }>` la: Den bɛnbaliw sɔrɔla: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Hakɛ `{ $value }` tɛ ɲɛ atiribi `{ $attribute }` la, hakɛ `{ $default }` de bɛ baara kɛ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML cogoya { $version } ma sɔrɔ.
       *[other] DoenetML cogoya { $version } ma sɔrɔ. A bɛ segin cogoya { $fallback } kan
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML tɛ ɲɛ: { $content }

parse-tag-missing-close-tag = DoenetML tɛ ɲɛ: Tagi `{ $tag }` datugu-tagi tɛ yen. Tagi min bɛ a yɛrɛ datugu walima tagi `</{ $tagName }>` de tun bɛ makɔnɔ.

parse-tag-error = DoenetML tɛ ɲɛ: Fili bɛ tagi `<{ $tagName }>` la

parse-attribute-missing-value = DoenetML tɛ ɲɛ: Atiribi `{ $attribute }` min tɛ ɲɛ, a bɛ i n'a fɔ hakɛ t'a la.

parse-attribute-invalid = DoenetML tɛ ɲɛ: Atiribi `{ $attribute }` tɛ ɲɛ

parse-attribute-value-invalid = DoenetML tɛ ɲɛ: Atiribi hakɛ `{ $value }` tɛ ɲɛ

parse-attribute-value-quote-mismatch = DoenetML tɛ ɲɛ: Atiribi hakɛ `{ $value }` tɛ ɲɛ. Kuma-taamasereɲɛw ma bɛn. A bɛ i n'a fɔ `{ $quote }` tununna

parse-open-tag-name-missing = DoenetML tɛ ɲɛ: Tagi sɔrɔla min tɔgɔ tɛ yen, misali la `<`

parse-tag-not-closed = DoenetML tɛ ɲɛ: Tagi `{ $tag }` ma datugu (a bɛ i n'a fɔ `>` tununna).

parse-self-closing-tag-name-missing = DoenetML tɛ ɲɛ: Tagi sɔrɔla min tɔgɔ tɛ yen `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML tɛ ɲɛ: Tagi `{ $tag }` ma datugu (a bɛ i n'a fɔ `/>` tununna).

parse-tag-invalid-attributes = DoenetML tɛ ɲɛ: Tagi `{ $tag }` tɛ ɲɛ. A bɛ se ka kɛ ni atiribi bɛnbaliw ye.

parse-close-tag-name-missing = DoenetML tɛ ɲɛ: Datugu-tagi sɔrɔla min tɔgɔ tɛ yen, misali la `</`

parse-attribute-value-unquoted = Atiribi hakɛw ka kan ka bila kuma-taamasereɲɛw cɛ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML tɛ ɲɛ: Datugu-tagi `{ $tag }` sɔrɔla, nka a da-wuli-tagi tɛ yen

parse-close-tag-mismatched = DoenetML tɛ ɲɛ: Datugu-tagi ma bɛn. `</{ $expected }>` tun bɛ makɔnɔ. `{ $found }` de sɔrɔla

parser-node-unconvertible = Nɔdi { $node } ma se ka yɛlɛma Dast nɔdi ye.

## Names

name-attribute-invalid =
    Atiribi name='{ $name }' tɛ ɲɛ. { $reason ->
        [characters] Tɔgɔw bɛ se ka kɛ ni sɛbɛndenw, jatew, duguma-jɛngɛnw walima jɛngɛnw dɔrɔn ye.
       *[start] Tɔgɔw ka kan ka daminɛ ni sɛbɛnden ye.
    }

component-name-invalid-start = Elemanti tɔgɔ "{ $name }" tɛ ɲɛ. Tɔgɔw ka kan ka daminɛ ni sɛbɛnden ye.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched suguya jaabi ka kan ka kɛ ni atiribi video ye

answer-video-watched-video-not-reference = videoWatched suguya jaabi ka kan ka kɛ ni atiribi video ye min ye yirali ye

answer-name-not-single-text = Jaabi ka atiribi name ka kan ka kɛ ni text den kelen dɔrɔn ye

## Referencing another document

external-doenetml-recursion-limit = Kɛnɛma DoenetML tɛ se ka sɔrɔ sabu seginni ka ca kojugu. Yali yirali kuruma dɔ bɛ yen wa?

external-doenetml-unavailable = DoenetML tɛ se ka sɔrɔ { $attribute }="{ $uri }" la

external-doenetml-type-mismatch = DoenetML min sɔrɔla { $attribute }="{ $uri }" la, o tɛ ɲɛ: a ma bɛn elemanti suguya "{ $componentType }" ma

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atiribi `{ $from }` kɔrɔla; `{ $to }` de kɛ a nɔ na.
       *[other] [deprecation] Atiribi `{ $from }` min bɛ `<{ $component }>` la, o kɔrɔla; `{ $to }` de kɛ a nɔ na.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atiribi `{ $from }` kɔrɔla wa a tɛ jateminɛ sabu `{ $to }` fana fɔra.
       *[other] [deprecation] Atiribi `{ $from }` min bɛ `<{ $component }>` la, o kɔrɔla wa a tɛ jateminɛ sabu `{ $to }` fana fɔra.
    }

deprecated-attribute-ignored = [deprecation] Atiribi `{ $attribute }` min bɛ `<{ $component }>` la, o kɔrɔla wa a tɛ jateminɛ.

deprecated-attribute-to-child = [deprecation] Atiribi `{ $attribute }` min bɛ `<{ $component }>` la, o kɔrɔla; den `<{ $child }>` de kɛ a nɔ na.


## Language coverage

pluralize-english-only = `<pluralize>` bɛ se ka caya-cogoya kɛ Angilɛkan dɔrɔn na, o de kama a sɛbɛnni tora i n'a fɔ a bɛ cogo min na sɛbɛn kɔnɔ min sɛbɛnna { $locale } la. Caya-cogoya sɛbɛn i yɛrɛ ma, walima a bila atiribi `pluralForm` la.


## Checking against the schema

schema-element-unrecognized = Elemanti `<{ $tag }>` tɛ Doenet elemanti lɔnnen ye.

schema-element-not-allowed-at-root = Elemanti `<{ $tag }>` tɛ daga sɛbɛn juu la.

schema-element-not-allowed-inside = Elemanti `<{ $tag }>` tɛ daga `<{ $parent }>` kɔnɔ.

schema-attribute-unrecognized = Elemanti `<{ $tag }>` atiribi tɛ yen min tɔgɔ ye `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Elemanti `<{ $tag }>` ka atiribi `{ $attribute }` ka kan ka kɛ lisi ye min fɛn kelen-kelen bɛɛ ye ninnu dɔ ye: { $allowed }
       *[other] Elemanti `<{ $tag }>` ka atiribi `{ $attribute }` ka kan ka kɛ ninnu dɔ ye: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Cogoya tɔgɔ tɛ ɲɛ select la. Cogoya tɔgɔ { $variantName } bɛ sugandili { $numOptions } la nka sugandi hakɛ ye { $numToSelect } ye.

select-variant-name-without-options = Cogoya dɔw fɔra select kama nka sugandili si ma fɔ cogoya tɔgɔ bɛnnen kama: { $variantName }.

select-variant-name-not-possible = Cogoya tɔgɔ { $variantName } min fɔra select kama, o tɛ cogoya tɔgɔ bɛnnen ye.

select-too-few-options = Elemanti { $numToSelect } tɛ se ka sugandi { $numOptions } dɔrɔn na.

select-from-sequence-too-few-values = Hakɛ { $numToSelect } tɛ se ka sugandi sekansi la min janya ye { $length } ye.

select-from-sequence-indices-count-mismatch = Endɛsi hakɛ min fɔra select kama, o ka kan ka bɛn sugandi hakɛ ma

select-from-sequence-indices-not-integers = Endɛsi minnu bɛɛ fɔra select kama, olu ka kan ka kɛ jate dafalenw ye

select-from-sequence-index-excluded = selectfromsequence endɛsi bɔlen dɔ fɔra

select-from-sequence-indices-excluded-combination = selectfromsequence endɛsiw fɔra minnu tun ye faralen bɔlen ye

select-from-sequence-coprime-not-positive-integers = Jate bɔɲɔgɔnkow faralenw tɛ se ka sugandi sabu jate dafalen jɔlenw tɛ minnu bɛ sugandi.

select-from-sequence-coprime-common-factor = Jate bɔɲɔgɔnkow tɛ se ka sugandi. Hakɛ bɛnnenw bɛɛ bɛ ni tilanlan kelen ye. ("from" walima "to" hakɛ fɔlenw ka kan ka kɛ bɔɲɔgɔnkow ye "step" fɛ.)

select-from-sequence-coprime-single-number = Jate bɔɲɔgɔnkow faralenw tɛ se ka sugandi jate kelen na min tɛ 1 ye.

select-from-sequence-excluded-too-many-combinations = Faralenw 70% ni kɔ bɔra selectFromSequence la

select-from-sequence-coprime-none-found = Jate bɔɲɔgɔnkow ma se ka sugandi. Hakɛ bɛnnenw bɛɛ bɛ ni tilanlan kelen ye.

select-from-sequence-too-few-unique-values = Hakɛ danmakɛɲɛnen { $numToSelect } tɛ se ka sugandi sekansi la min janya ye { $numPossibleValues } ye

select-prime-numbers-too-few-values = Hakɛ { $numToSelect } tɛ se ka sugandi jate tilabaliw lisi la min janya ye { $numValues } ye

select-prime-numbers-values-count-mismatch = Hakɛ hakɛ min fɔra select kama, o ka kan ka bɛn sugandi hakɛ ma

select-prime-numbers-values-not-prime = Hakɛ minnu bɛɛ fɔra select prime number kama, olu ka kan ka kɛ jate tilabaliw lisi kɔnɔ

select-prime-numbers-values-excluded-combination = selectPrimeNumbers hakɛ fɔlenw tun ye faralen bɔlen ye

select-prime-numbers-excluded-too-many-combinations = Faralenw 70% ni kɔ bɔra selectPrimeNumbers la

select-random-combination-fluke = Ni a ma deli ka kɛ, hakɛ kɛrɛnkɛrɛnbaliw faralen ma se ka sugandi

select-random-value-fluke = Ni a ma deli ka kɛ, hakɛ kɛrɛnkɛrɛnbali ma se ka sugandi
