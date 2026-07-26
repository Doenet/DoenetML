# Errors and warnings surfaced to the reader or author. Produced by the worker
# but addressed to whoever is looking at the screen, so these are selected by
# `uiLocale`, not `documentLocale`.
#
# Message ids are lower-kebab-case Fluent identifiers, optionally with a
# single `.attribute` suffix (`invalid-attribute-value`).
#
# Reached by stable diagnostic code rather than by a literal `t("key")` call:
# `DIAGNOSTIC_CODES` in `src/diagnostics.ts` maps `doenet-w0001` to the id
# below, and `lint:i18n` treats that registry as the call site. Adding a
# message here without registering a code for it fails the lint as an orphan.
#
# Translators: `through`, `endpoint`, `midpointOffset`, `numDimensions` and the
# like are DoenetML attribute names. They are part of the language, not prose,
# and must be left in English exactly as written.

## `<lineSegment>`

# $attributes is a list of attribute names; $attributesCount is its length.
line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } is ignored when two endpoints are specified
       *[other] { $attributes } are ignored when two endpoints are specified
    }

# $attributes is a list of attribute names; $attributesCount is its length.
line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } is ignored when an endpoint and a midpoint are both specified
       *[other] { $attributes } are ignored when an endpoint and a midpoint are both specified
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset has no effect without a midpoint

## `<line>`

line-points-undetermined-dimensions = Line through points of undetermined dimensions.

line-points-too-few-dimensions = Line must be through points of at least two dimensions.

# $variables is a bare enumeration of variable names, not an "and" list.
line-points-depend-on-variables = Line is through points that depend on variables: { $variables }.

line-equation-invalid-format = Invalid format for equation of line in variables { $variable1 } and { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ray is prescribed by through, endpoint, and direction.  Ignoring specified through.

ray-dimension-mismatch = numDimensions mismatch in ray.

## `<vector>`

vector-overprescribed-head = Vector is prescribed by head, tail, and displacement.  Ignoring specified head.

vector-dimension-mismatch = numDimensions mismatch in vector.

## Attracting and constraining

# $component is the DoenetML tag of the child that was named, e.g. "polygon".
attract-to-without-nearest-point = Cannot attract to a `<{ $component }>` as it doesn't have a nearestPoint state variable.

constrain-to-without-nearest-point = Cannot constrain to a `<{ $component }>` as it doesn't have a nearestPoint state variable.

constrain-to-interior-without-nearest-point = Cannot constrain to interior of a `<{ $component }>` as it doesn't have a nearestPoint state variable.

## `<choiceInput>`

# Translators: `labelPosition` is an attribute name and stays in English.
choice-input-label-position-ignored = labelPosition is ignored for non-inline choiceInput

## Ordering children by index
##
## These name the component in prose rather than as a tag, matching how the
## messages have always read. The component names stay in English; the nouns
## around them are prose and should be translated.

choice-input-indices-count-mismatch = Ignoring indices specified for choiceInput as number of indices doesn't match number of choice children.

pretzel-indices-count-mismatch = Ignoring indices specified for problem as number of indices doesn't match number of problem children.

shuffle-indices-count-mismatch = Ignoring indices specified for shuffle as number of indices doesn't match number of components.

# $component is `choiceInput`, `pretzel` or `shuffle` — a DoenetML component
# name, so it stays in English.
indices-ignored-out-of-range = Ignoring indices specified for { $component } as some indices out of range.

pretzel-indices-repeated = Ignoring indices specified for pretzel as some indices are repeated.

pretzel-circuit-first-index = Ignoring indices specified for pretzel in circuit mode as the first index must be 1.

## `<shuffle>` and `<sort>`

# $component is `shuffle` or `sort`. These two components accept the same
# children and fail the same ways, so they share their messages.
string-children-need-type = For `<{ $component }>` to work with string children, a `type` attribute must be specified.

# $type is what the author wrote; math, text, number and boolean are attribute
# values and stay in English.
invalid-type-defaulting-to-math = Invalid type { $type } for { $component } component. Must be one of math, text, number, or boolean. Defaulting to math.

# $value is the string child that could not be used.
string-not-valid-component-to-arrange = String "{ $value }" is not a valid component to { $component }. Ignoring.

## Types and variables

invalid-type-defaulting-to-number = Invalid type { $type }, setting type to number.

invalid-variable-value = Invalid value of a variable: `{ $value }`

## Variants

# $index is what the author wrote, reproduced verbatim rather than as a number:
# it reached this message precisely because it was not one.
variant-index-must-be-number = Variant index { $index } must be a number

variant-index-must-be-integer = Variant index { $index } must be an integer

## `<sideBySide>`

# $component is `sideBySide` or `sbsGroup`.
side-by-side-absolute-widths = `<{ $component }>` is not implemented for absolute measurements. Setting widths to relative.

side-by-side-absolute-margins = `<{ $component }>` is not implemented for absolute measurements. Setting margins to relative.

side-by-side-no-block-child = Invalid `<{ $component }>`: it must have at least one block child.

## `<label>`

# Translators: `for` is an attribute name and stays in English.
label-for-ignored-on-graphical = The `for` attribute on graphical `<label>` is ignored.

label-for-must-resolve-to-one = The `for` attribute on `<label>` must resolve to exactly one component.

label-for-unresolved = The `for` attribute on `<label>` could not be resolved to a component.

label-for-answer-with-authored-inputs = The `for` attribute on `<label>` references an `<answer>` with explicitly authored inputs; reference the input directly.

label-for-answer-without-input = The `for` attribute on `<label>` references an `<answer>` without an input to label.

label-for-must-reference-input-or-answer = The `for` attribute on `<label>` must reference an input or an answer.

## Accessibility

# $component is a DoenetML tag, e.g. "graph" or "image".
accessibility-short-description-or-decorative = For accessibility, `<{ $component }>` must either have a short description or be specified as decorative.

accessibility-video-short-description = For accessibility, `<video>` must have a short description.

accessibility-input-short-description-or-label = For accessibility, `<{ $component }>` must have a short description or a label.

# The companion to the message above, for the input an `<answer>` creates on the
# author's behalf. Two messages rather than one with the subject passed in: the
# subject is a phrase here, not a name, and a phrase handed over as an argument
# would never reach a translator.
accessibility-answer-input-short-description-or-label = For accessibility, an `<answer>` creating an input must have a short description or a label.

accessibility-short-description-contains-math = Short descriptions should not contain math components such as `<{ $component }>`. Spell out any math with words.

# $colorName is an attribute name and stays in English. $ratio and $threshold
# are contrast ratios; $mode says which theme the shortfall was measured in,
# and is `dark` or `light`.
accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } has insufficient contrast for the section heading text (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; requires at least { $threshold }:1).
       *[other] { $colorName } has insufficient contrast for the section heading text ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; requires at least { $threshold }:1).
    }

## `<circle>`

# $count is the number of through points.
circle-through-points-non-numerical = Haven't implemented `<circle>` through { $count } points in case where the points don't have numerical values.

circle-too-many-through-points = Cannot calculate circle through more than 3 points.

circle-overprescribed-radius-center-points = Cannot calculate circle with specified radius, center and through points.

circle-center-with-multiple-points = Cannot calculate circle with specified center through more than 1 point.

# $distance and $radius arrive as strings, not numbers: $radius is the author's
# own value echoed back for diagnosis, and formatting it as a quantity would
# round a radius of 0.0001 away to 0.
circle-radius-too-small = Cannot calculate circle: given that the distance between the two points is { $distance }, the specified radius { $radius } is too small.

circle-radius-with-many-points = Cannot create circle through more than two points with a specified radius.

circle-invalid-center-or-through-points = Invalid center or through points of circle.

circle-radius-center-with-multiple-points = Cannot calculate radius of circle with specified center through more than 1 point.

circle-change-radius-non-numerical = Cannot change radius of circle with non-numerical through points

circle-radius-with-points-non-numerical = Cannot create circle through more than one point with specified radius when don't have numerical values.

circle-change-center-non-numerical = Haven't implemented changing center of circle through points with non numerical values.

## `<function>`

# Two independent counts in one sentence, so the variants multiply out. A
# select's variants each need their own line, so the inner one spans lines too;
# that is safe because newlines inside a placeable never reach the rendered
# value. Only text continuing onto a further line would.
function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Insufficient dimensions for domain for function. Domain has { $intervals } interval but the function has { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } inputs
        }.
       *[other] Insufficient dimensions for domain for function. Domain has { $intervals } intervals but the function has { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } inputs
        }.
    }

function-domain-invalid-format = Invalid format for domain for function.

# $type is what was being read off the point. It selects the wording rather
# than being substituted into it: "maximum", "slope" and the rest are English
# nouns, and a noun handed over as an argument would never reach a translator.
# The catch-all reproduces the pre-catalog behavior for a value not listed here.
function-ignoring-non-numerical =
    { $type ->
        [maximum] Ignoring non-numerical maximum of function.
        [minimum] Ignoring non-numerical minimum of function.
        [extremum] Ignoring non-numerical extremum of function.
        [point] Ignoring non-numerical point of function.
        [slope] Ignoring non-numerical slope of function.
       *[other] Ignoring non-numerical { $type } of function.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ignoring empty maximum of function.
        [minimum] Ignoring empty minimum of function.
        [extremum] Ignoring empty extremum of function.
        [point] Ignoring empty point of function.
       *[other] Ignoring empty { $type } of function.
    }

function-points-too-close = Function contains two points with locations too close together. Can't define function.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Function iterates are possible only if the number of inputs of the function is equal to the number of outputs. This function has { $inputs } input and { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } outputs
        }.
       *[other] Function iterates are possible only if the number of inputs of the function is equal to the number of outputs. This function has { $inputs } inputs and { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } outputs
        }.
    }

## `<sequence>`

sequence-invalid-length = Invalid length of sequence.  Must be a non-negative integer.

# $type is a sequence type: number, letters, or math.
sequence-invalid-step = Invalid step of sequence.  Must be a number for sequence of type { $type }.

# $attribute is `from` or `to` — an attribute name, so it stays in English.
sequence-invalid-endpoint-number = Invalid "{ $attribute }" of number sequence.  Must be a number.

sequence-invalid-endpoint-letters = Invalid "{ $attribute }" of letters sequence.  Must be a letter combination.

sequence-invalid-endpoint = Invalid "{ $attribute }" of sequence.

select-from-sequence-coprime-not-numbers = coprime ignored since not selecting numbers

select-from-sequence-coprime-with-exclude-combinations = coprime ignored since excludeCombinations specified

## Resolving a `target`
##
## Raised by the components that take a `target` attribute. They resolve it
## through the same code and fail the same two ways, so they share these two
## messages rather than spelling each one out per component: $source is the tag
## of the component that raised it, part of the DoenetML language, so it stays
## in English.

target-not-found = Invalid target for `<{ $source }>`: cannot find target.

# $property is the state variable that was looked for; $component is the tag it
# was looked for on.
target-state-variable-not-found = Invalid target for `<{ $source }>`: cannot find a state variable named "{ $property }" on a `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variables of `<odeSystem>` must be different than independent variable.

ode-system-duplicate-variable-names = Can't define ODE RHS functions with duplicate dependent variable names.

ode-system-rhs-function-error = Cannot define ODE RHS function.  Error creating mathjs function.

## `<angle>`, `<parabola>`, and `<intersection>`

# $count is how many line children were found.
angle-too-many-lines = Cannot define an angle between { $count } lines

angle-invalid-through-point = Invalid point in through of `<angle>`

parabola-vertex-too-many-points = Haven't implemented parabola with vertex through more than 1 point.

parabola-too-many-points = Haven't implemented parabola through more than 3 points.

intersection-too-many-items = Haven't implemented intersection for more than two items

## Other math components

ionic-compound-not-two-ions = Have not implemented ionic compound for anything other than two ions.

ionic-compound-needs-cation-and-anion = Ionic compound implemented only for one cation and one anion.

# $equation is the equation as the author wrote it.
solve-equations-cannot-evaluate = Cannot solve equation as could not evaluate equation: { $equation }

# Translators: `operandNumber` is an attribute name and stays in English.
math-operators-operand-number-required = Must specify a operandNumber when extracting a math operand.

eigen-decomposition-failed = Could not calculate eigenvalues of matrix

## PreFigure renderer

# Translators: xLabelPosition, yLabelPosition and their values are attribute
# names and stay in English, as does the renderer's name.
prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" is not supported in prefigure renderer; using right-position behavior.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" is not supported in prefigure renderer; using top-position behavior.

prefigure-invalid-axis-bounds = `<graph>`: invalid axis bounds for prefigure conversion; using default bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: invalid width for prefigure conversion; using default diagram width 425.

prefigure-invalid-aspect-ratio = `<graph>`: invalid aspectRatio for prefigure conversion; using default aspect ratio 1.

prefigure-annotations-not-rendered = `<graph>`: annotations will not be rendered when not using the PreFigure renderer.

multiple-annotations-children = Multiple `<annotations>` children found in `<graph>`; all but the last one are ignored.

## Referring to other components
##
## `<updateValue>`'s own "cannot find target" messages are not here: it
## resolves a target the same way `<animateFromSequence>` does and fails the
## same ways, so the two share `target-not-found` and
## `target-state-variable-not-found` above.

copy-unrecognized-component-type = Cannot extend or copy an unrecognized component type: { $type }.

copy-prop-not-found = Could not find prop { $property } on a component of type { $component }

collect-no-source = No source found for collect.

collect-invalid-component-type = Cannot collect components of type `<{ $component }>` as it is an invalid component type.

## `<dataFrame>`

# $componentIdx is an internal index, passed as a string so it is not grouped
# like a quantity; the odd spacing before the colon is reproduced from the
# original message.
data-frame-inconsistent-row-lengths = Data has invalid shape.  Rows has inconsistent lengths. Found in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data has duplicate column names.  Found in componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data is missing a column name.  Found in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = An award for this answer is based on the answer tag's own submitted response, which will lead to unexpected behavior.

# Translators: maxNumAttempts and sectionWideCheckWork are attribute names.
answer-max-num-attempts-in-section-wide-check-work = Setting `maxNumAttempts` on an `<answer>` inside a container with `sectionWideCheckWork` has no effect, as the number of attempts is controlled by the container. Set `maxNumAttempts` on the container instead.

nested-section-wide-check-work-max-num-attempts = Setting `maxNumAttempts` on a container with `sectionWideCheckWork` that is inside another container with `sectionWideCheckWork` has no effect, as the number of attempts is controlled by the outer container. Set `maxNumAttempts` on the outer container instead.

# $attributes is a list of attribute names; $attributesCount is its length.
answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] The { $attributes } attribute will have no effect without symbolicEquality set.
       *[other] The { $attributes } attributes will have no effect without symbolicEquality set.
    }

answer-invalid-type = Invalid type for answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Since the component `<{ $component }>` does not have a name, it cannot be used for a module attribute

module-attribute-name-already-defined = The component `<{ $component } name="{ $name }">` cannot be used as an attribute for a module because the `<module>` component type already has a "{ $name }" attribute defined.

conditional-content-condition-ignored = Attribute `condition` is ignored on a `<conditionalContent>` component with case or else children.

slider-markers-type-mismatch = Markers type doesn't match slider type.

pretzel-problem-needs-statement-and-answer = Invalid pretzel: each `<problem>` must contain one `<statement>` and one `<answer>`.

pretzel-circuit-first-problem-distractor = Invalid pretzel: in mode="circuit", the first `<problem>` cannot be a distractor.

## Attribute values

# $values is a list of the values that were rejected, each already in
# backticks; $valuesCount is how many there were.
attribute-invalid-values =
    { $valuesCount ->
        [one] Invalid value { $values } for attribute `{ $attribute }`; ignoring.
       *[other] Invalid values { $values } for attribute `{ $attribute }`; ignoring.
    }

attribute-must-be-references = Invalid value `{ $value }` for attribute `{ $attribute }`. Attribute must be composed of references that begin with a `$`.

# $names is a list of the rejected names, each already in single quotes.
math-input-invalid-function-names = <mathInput>: ignored invalid function name(s) in { $attribute }: { $names }. Each name's display segment must be at least 2 characters (letters or dashes); an optional `|<mathspeak alternative>` suffix may follow.
