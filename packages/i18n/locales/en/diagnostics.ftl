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

## `<matchesPattern>`

# Translators: `parameters` is an attribute name and stays in English.
# $parameters lists the parameters as the author wrote them;
# $parametersCount is how many there were.
matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: the parameter { $parameters } does not occur in the pattern, so it will always match a blank.
       *[other] `<matchesPattern>`: the parameters { $parameters } do not occur in the pattern, so they will always match a blank.
    }

## `<graph>`

# Translators: grid is an attribute name and none, medium and dense are its
# values; all four stay in English, as does the example. $grid is the value the
# author wrote, reproduced verbatim — it reached this message precisely because
# it was not one of the forms listed.
graph-grid-invalid = `<graph>`: cannot interpret grid="{ $grid }". It must be none, medium, dense, or two positive numbers separated by a space, such as grid="1 0.5". No grid is drawn.

## `<slopeField>` and `<vectorField>`

# $component is the field's tag and $alternative the sibling field component's,
# or `none` when the function would not suit it either; both are DoenetML tags
# and stay in English, as do the example expressions. $expected is how many
# outputs the component needs, $found how many the given function has. What a
# field draws a mark from is the function's outputs, so the wrong number of
# them means there is nothing to draw — and the author almost always wanted the
# other component.
field-function-wrong-num-outputs =
    `<{ $component }>` needs a function with { $expected ->
        [one] one output, the slope y' at each point, such as `y - x`
       *[other] two outputs, the vector at each point, such as `(y, -x)`
    }, but the function it was given has { $found ->
        [one] { $found } output
       *[other] { $found } outputs
    }. { $alternative ->
        [none] Nothing is drawn.
       *[other] `<{ $alternative }>` is the component for that function. Nothing is drawn.
    }

# Translators: retired. `function` is an attribute name and stays in English.
# It warned that a field had been given its function both as an attribute and
# inside the component; the attribute no longer exists, so the two can no
# longer disagree. Kept because diagnostic codes are never reused.
field-function-attribute-ignored-with-child = The `function` attribute is ignored because the function is also given inside the component; the one inside is used. Give the function only one of the two ways.

# Translators: `variables` and `function` are a DoenetML attribute and tag and
# stay in English, as does $component, the field's own tag. The attribute names
# the inputs of an expression written directly inside the component; when there
# is no such expression there is nothing for it to name, and $reason says which
# of the two ways that happened.
field-variables-ignored =
    `<{ $component }>`: the `variables` attribute names the variables of an expression written directly inside the component. { $reason ->
        [function-child] The function here is given as a `<function>` child, which names its own variables, so `variables` is ignored.
       *[no-expression] No such expression is given here, so `variables` is ignored.
    }

## PreFigure renderer

# Translators: xLabelPosition, yLabelPosition and their values are attribute
# names and stay in English, as does the renderer's name.
prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" is not supported in prefigure renderer; using right-position behavior.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" is not supported in prefigure renderer; using top-position behavior.

prefigure-invalid-axis-bounds = `<graph>`: invalid axis bounds for prefigure conversion; using default bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: invalid width for prefigure conversion; using default diagram width 425.

prefigure-invalid-aspect-ratio = `<graph>`: invalid aspectRatio for prefigure conversion; using default aspect ratio 1.

# Translators: the renderer's name, prefigure, stays in English. "grid" here is
# the coordinate grid itself rather than the attribute that asks for one, so it
# is prose and is translated.
prefigure-grid-spacing-too-fine = `<graph>`: the grid spacing is too fine for the axis limits; the grid is omitted in the prefigure renderer.

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

# $reference is the reference exactly as the author wrote it, `$` and all —
# the `$p.styleDescription[1]` of `<text extend="$p.styleDescription[1]" />`.
# An index only means something applied to an array, and the thing named here
# is not one. The reference is quoted back rather than explained because the
# text in front of the author is the only part of this they can act on: the
# state variable and component index the core knows about are its own business
# and go to the console instead.
reference-index-unavailable = Cannot reference index `{ $reference }`

## `<callAction>`

# $action is the `actionName` the author asked for, part of the DoenetML
# language, so it stays in English. $reference is the `target` as written.
component-action-unavailable = Cannot call { $action } on component `{ $reference }`

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

## Building components from the source

# Raised while the source is being turned into components, by throwing rather
# than by building a record: the thrower is caught, the component becomes an
# `_error`, and the diagnostic is re-raised from it.

component-type-invalid = Invalid component type: `<{ $componentType }>`

attribute-repeated = Cannot repeat attribute { $attribute }.

attribute-invalid-for-component = Invalid attribute "{ $attribute }" for a component of type `<{ $componentType }>`.

## Style definition contrast

# $context names the pair being compared, $mode which colour scheme it was
# rendered in. Both are symbolic — the phrase is chosen here so a translator
# can rewrite it, rather than being handed over already in English.
style-definition-insufficient-contrast =
    Style definition { $styleNumber } has insufficient contrast for { $context ->
        [text-on-background] text color against background color
        [high-contrast] high-contrast color against the canvas
        [line] line color against the canvas
        [marker] marker color against the canvas
       *[text-on-canvas] text color against the canvas
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; requires at least { $threshold }:1).

# $suggestion says whether a concrete replacement colour could be computed.
# The attribute names and colour values in the `available` branch are
# DoenetML source, not prose, and stay as they are in every language.
style-definition-dark-mode-text-background-contrast =
    Although style definition { $styleNumber } has specified colors that provide sufficient contrast for light mode, the dark-mode colors derived from these values have insufficient contrast for the text color against the background color ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; requires at least { $threshold }:1). { $suggestion ->
        [available] To ensure sufficient contrast in dark mode, either increase the light-mode contrast (e.g., set { $lightAttribute }="{ $lightColor }") or override the dark-mode color (e.g., set { $darkAttribute }="{ $darkColor }").
       *[none] To ensure sufficient contrast in dark mode, increase the light-mode contrast or override the derived colors with textColorDarkMode and/or backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Although style definition { $styleNumber } has a specified text color that provides sufficient contrast for light mode, the dark-mode text color derived from this value has insufficient contrast against the canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; requires at least { $threshold }:1). { $suggestion ->
        [available] To ensure sufficient contrast in dark mode, either increase the light-mode contrast (e.g., set textColor="{ $lightColor }") or override the dark-mode color (e.g., set textColorDarkMode="{ $darkColor }").
       *[none] To ensure sufficient contrast in dark mode, increase the light-mode contrast or override the derived color with textColorDarkMode.
    }

section-multiple-style-palettes = A section can select only one <stylePalette>; using the last one.

## Unique variants

# Explanations of why a component's unique variants could not be worked out.
# $component is the tag that could not be analyzed and stays as written; the
# reason is a separate message per situation, so a host can tell them apart by
# code and a translator sees a whole sentence rather than a fragment.

variant-num-to-select-not-non-negative-integer = cannot determine unique variants of { $component } as numToSelect isn't a non-negative integer.

variant-num-to-select-not-constant-number = cannot determine unique variants of { $component } as numToSelect isn't constant number.

variant-with-replacement-not-constant-boolean = cannot determine unique variants of { $component } as withReplacement isn't constant boolean.

variant-select-weight-disables-unique = Unique variants for select disabled if have an option with selectWeight or selectForVariants specified

variant-coprime-undetermined = cannot determine unique variants of { $component } as cannot determine coprime is always false.

# $attribute is an attribute name (`from`, `to`, `step`, `sort`, `length`) and
# stays as written.
variant-attribute-not-constant = cannot determine unique variants of { $component } as { $attribute } isn't a constant.

variant-attribute-not-number = cannot determine unique variants of { $component } as { $attribute } isn't a number.

# $type is the sequence type the component was declared with. $expected names
# what the value had to be, symbolically, because which one applies depends on
# both the type and the attribute.
variant-attribute-wrong-type-for-sequence =
    cannot determine unique variants of { $component } of { $type } type as { $attribute } isn't { $expected ->
        [letters-combination] a combination of letters
        [math-expression] a valid math expression
        [integer] an integer
       *[number] a number
    }.

variant-length-not-integer = cannot determine unique variants of { $component } as length isn't an integer.

variant-sort-not-implemented = have not implemented unique variants of a { $component } with sort

variant-exclude-combinations-not-implemented = have not implemented unique variants of a { $component } with excludeCombinations

variant-math-exclude-not-implemented = have not implemented unique variants of a { $component } of type math with exclude

variant-non-constant-exclude-not-implemented = have not implemented unique variants of a { $component } with non-constant exclude

## PreFigure conversion

# $subject identifies the component the warning is about, already written as
# `<tag>` or `<tag> (name)`. It is composed in code rather than here because
# Fluent terms cannot take a variable as an argument, so a shared subject
# fragment cannot be parameterized from the catalog. It holds only a tag name,
# a component name and punctuation — never a word — which is why a descendant
# with no type reads `<?>` rather than `<unknown>`.

prefigure-descendant-unsupported = { $subject }: unsupported in graph prefigure renderer; descendant skipped.

prefigure-descendant-invalid-geometry = { $subject }: non-finite or incomplete geometry; descendant skipped.

prefigure-curve-label-omitted = { $subject }: labels are not supported on converted curve elements; label omitted.

prefigure-curve-unsupported-definition-type = { $subject }: unsupported curve function definition type '{ $definitionType }'; descendant skipped.

prefigure-region-flip-functions-unsupported = { $subject }: unsupported flipFunctions attribute on regionBetweenCurves; descendant skipped.

prefigure-region-non-formula-child = { $subject }: only formula-typed child functions are supported on regionBetweenCurves; descendant skipped.

# $labelKind says which family of object carried the label, since the advice
# is the same but the object is not.
prefigure-label-position-unsupported =
    { $subject }: unsupported labelPosition '{ $labelPosition }' for { $labelKind ->
        [line-family] line-family label
       *[point] point label
    }; default PreFigure alignment used.

prefigure-fill-style-unsupported = { $subject }: fill style '{ $fillStyle }' is unsupported by PreFigure; falling back to a solid fill.

prefigure-line-style-unknown = { $subject }: unknown line style '{ $lineStyle }' omitted from PreFigure output.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker style '{ $markerStyle }' mapped to PreFigure style 'diamond'.

prefigure-marker-style-unsupported = { $subject }: marker style '{ $markerStyle }' is unsupported by PreFigure; default style used.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: invalid `ref`; cannot resolve target. Annotation omitted.

annotation-ref-multiple-targets = `<annotation>`: `ref` resolved to multiple targets; using the first target.

annotation-ref-outside-graph = `<annotation>`: invalid `ref`; target is outside the containing graph. Annotation omitted.

annotation-ref-unsupported-target = `<annotation>`: invalid `ref`; target is not a supported graphical object in prefigure conversion. Annotation omitted.

annotation-text-missing = `<annotation>`: missing or empty `text`; emitting empty text.

## Composites and references

# $componentType is the type the composite was asked to create, when it is
# known; `none` when the composite did not say.
composite-circular-dependency =
    { $componentType ->
        [none] Circular dependency detected.
       *[other] Circular dependency detected involving `<{ $componentType }>` component.
    }

# $reference is the reference as the author wrote it, already carrying its `$`.
reference-no-referent = No referent found for reference: `{ $reference }`

reference-multiple-referents = Multiple referents found for reference: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Invalid format for attribute { $attribute } of `<{ $componentType }>`.

# $children is the list of child types that did not match, already joined.
children-invalid = Invalid children for `<{ $componentType }>`: Found invalid children: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Invalid value `{ $value }` for attribute `{ $attribute }`, using value `{ $default }`

## Loading a DoenetML version

# $fallback is the version that will be used instead, or `none` when the
# embedding page named a standalone bundle of its own.
doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML version { $version } not found.
       *[other] DoenetML version { $version } not found. Falling back to version { $fallback }
    }

## Reading the DoenetML

# The parser's own diagnostics: what the author sees before anything runs, and
# for a beginner usually the first Doenet message they ever read.
#
# The parser writes its English beside the code rather than rendering it from
# here, because `@doenet/parser` is inside the language-server bundle and a
# catalog there is dead weight on the editor's critical path
# (`packages/lsp/scripts/check-server-bundle.mjs` fails if one arrives). The
# two copies are held together by a test in that package, which parses a
# corpus and asserts every coded error renders to exactly what the parser
# wrote — so a message edited here without its counterpart fails there.
#
# $tag, $value, $attribute and their relatives quote the author's own source
# back at them and stay exactly as written. The `Invalid DoenetML: ` opening is
# repeated in each message instead of being a shared term: a term a locale
# forgets to define renders as its own name, and a prefix on fifteen messages
# is not worth that failure mode.

parse-invalid-doenetml = Invalid DoenetML: { $content }

parse-tag-missing-close-tag = Invalid DoenetML: The tag `{ $tag }` has no closing tag. Expected a self-closing tag or a `</{ $tagName }>` tag.

parse-tag-error = Invalid DoenetML: Error in tag `<{ $tagName }>`

parse-attribute-missing-value = Invalid DoenetML: Invalid attribute `{ $attribute }` appears to be missing a value.

parse-attribute-invalid = Invalid DoenetML: Invalid attribute `{ $attribute }`

parse-attribute-value-invalid = Invalid DoenetML: Invalid attribute value `{ $value }`

# $quote is the quote character that would balance the pair: `"` or `'`.
parse-attribute-value-quote-mismatch = Invalid DoenetML: Invalid attribute value `{ $value }`. The quote marks do not match. You appear to be missing a `{ $quote }`

parse-open-tag-name-missing = Invalid DoenetML: Found a tag without a tag name, e.g. `<`

parse-tag-not-closed = Invalid DoenetML: Tag `{ $tag }` was not closed (a `>` appears to be missing).

parse-self-closing-tag-name-missing = Invalid DoenetML: Found a tag without a tag name `<{ $content }>`

parse-self-closing-tag-not-closed = Invalid DoenetML: Tag `{ $tag }` was not closed (`/>` appears to be missing).

parse-tag-invalid-attributes = Invalid DoenetML: Tag `{ $tag }` is not valid. It may have incorrect attributes.

parse-close-tag-name-missing = Invalid DoenetML: Found a closing tag without a tag name, e.g. `</`

# $attribute is the attribute name and $value the unquoted token that followed
# it, shown reassembled the way the author should have written it.
parse-attribute-value-unquoted = Attribute values must be enclosed in quotes: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Invalid DoenetML: Found closing tag `{ $tag }`, but no corresponding opening tag

parse-close-tag-mismatched = Invalid DoenetML: Mismatched closing tag. Expected `</{ $expected }>`. Found `{ $found }`

# The conversion's fall-through: the syntax tree held a node shape it has no
# case for. Reaching an author means the grammar and the conversion have gone
# out of step, which is a bug in Doenet rather than in their document — hence
# `parser-` rather than the `parse-` of every message above, which is about
# what the author wrote. They are still the one looking at it, so it is
# translated like any other error. $node is the node's own name and stays as
# it is.
parser-node-unconvertible = Could not convert node { $node } to Dast node.

## Names

# $reason says which rule the name broke, as a key rather than a phrase, so the
# whole sentence is translatable rather than assembled from two halves.
name-attribute-invalid =
    Invalid attribute name='{ $name }'. { $reason ->
        [characters] Names can contain only letters, numbers, underscores or hyphens.
       *[start] Names must start with a letter.
    }

component-name-invalid-start = Invalid component name "{ $name }". Names must start with a letter.

## `<answer>` sugar

answer-video-watched-missing-video = Answer with type videoWatched must have a video attribute

answer-video-watched-video-not-reference = Answer with type videoWatched must have video attribute that is a reference

answer-name-not-single-text = Answer name attribute must have a single text child

## Referencing another document

# $attribute is the attribute the URI was written in (`copyFrom`, `extend`, …)
# and stays as written; $uri is the author's own value.

external-doenetml-recursion-limit = Unable to retrieve external DoenetML due to too many levels of recursion. Is there a circular reference?

external-doenetml-unavailable = Unable to retrieve DoenetML from { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Invalid DoenetML retrieved from { $attribute }="{ $uri }": it did not match the component type "{ $componentType }"

## Deprecated syntax

# $from and $to are attribute names and $component a tag name; all three stay
# as written. $component is `none` for a rename that applies to every component
# accepting the attribute, where naming one would be wrong.
#
# The `[deprecation]` opening is a literal marker shared by all four messages,
# not a word: leave it as it is.

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` is deprecated; use `{ $to }` instead.
       *[other] [deprecation] Attribute `{ $from }` on `<{ $component }>` is deprecated; use `{ $to }` instead.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` is deprecated and ignored because `{ $to }` is also specified.
       *[other] [deprecation] Attribute `{ $from }` on `<{ $component }>` is deprecated and ignored because `{ $to }` is also specified.
    }

deprecated-attribute-ignored = [deprecation] Attribute `{ $attribute }` on `<{ $component }>` is deprecated and ignored.

# An attribute replaced by a child element rather than by another attribute:
# $attribute and $component stay as written, and so does $child, which is the
# tag name of the child to write instead.

deprecated-attribute-to-child = [deprecation] Attribute `{ $attribute }` on `<{ $component }>` is deprecated; use a `<{ $child }>` child instead.

# One value of an attribute is deprecated while the attribute itself stays:
# $value is what the author wrote and $to what to write instead, with
# $attribute and $component naming where. All four stay as written.

deprecated-attribute-value-renamed = [deprecation] Value `{ $value }` of attribute `{ $attribute }` on `<{ $component }>` is deprecated; use `{ $to }` instead.


## Language coverage

# `<pluralize>` runs an English part-of-speech model over its text and puts the
# nouns in the plural. There is no equivalent for an arbitrary language — a
# correct plural needs that language's own morphology, and often its
# dictionary — so in a document written in anything else the word is left as
# the author typed it, and this says so rather than silently doing nothing.
#
# Raised only when there is nothing else to fall back on: a `pluralForm` is the
# author supplying their own language's plural, and that is honored in every
# language, which is why this can recommend it.
#
# $locale is the document's language tag, as declared.
pluralize-english-only = `<pluralize>` can only pluralize English, so its text is left unchanged in a document written in { $locale }. Write the plural form directly, or set it with the `pluralForm` attribute.


## Checking against the schema

# What the editor draws a squiggle under: the language server's own check of
# the document against the DoenetML schema, run on every keystroke and
# answered before anything is evaluated. A beginner meets these first, and
# usually only these, because a document that does not pass them rarely gets
# as far as producing a diagnostic from the core.
#
# `@doenet/lsp-tools` writes its English beside the code rather than rendering
# it from here, for the same reason `@doenet/parser` does: it is inside the
# language-server bundle, which `@doenet/codemirror` embeds verbatim and
# starts as a blob worker, and a catalog on the editor's critical path is what
# `packages/lsp/scripts/check-server-bundle.mjs` exists to reject. The two
# copies are held together by a test in that package, which runs the checker
# over a corpus and asserts every coded violation renders to exactly what the
# checker wrote — so a message edited here without its counterpart fails
# there.
#
# $tag, $parent and $attribute quote the author's own source back at them and
# stay exactly as written; the angle brackets and backticks around them are
# punctuation this catalog supplies, not part of the name.

schema-element-unrecognized = Element `<{ $tag }>` is not a recognized Doenet element.

schema-element-not-allowed-at-root = Element `<{ $tag }>` is not allowed at the root of the document.

schema-element-not-allowed-inside = Element `<{ $tag }>` is not allowed inside of `<{ $parent }>`.

schema-attribute-unrecognized = Element `<{ $tag }>` doesn't have an attribute called `{ $attribute }`.

# $allowed is the attribute's permitted values, each already in double quotes
# and joined for the reader's language. $isList says whether the attribute
# takes several of them at once: one situation, two sentences, because the
# reader has to be told they are choosing a whole list rather than a value.
schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribute `{ $attribute }` of element `<{ $tag }>` must be a list whose items are each one of: { $allowed }
       *[other] Attribute `{ $attribute }` of element `<{ $tag }>` must be one of: { $allowed }
    }


## The `<select>` family's error boxes
##
## The messages that replace the whole component with a red box rather than
## warning beside it: nothing can be selected, so there is nothing to render.
## They were the last uncoded `_error` path in the worker (#1581).
##
## Counts arrive as numbers rather than as text, so a language that agrees a
## noun with them can select on them. English does not agree here — it says
## "1 options" today and these messages reproduce it exactly, because the box's
## text is what the existing suites pin.
##
## Being numbers, they are grouped: a count of 1500 renders as "1,500" in
## English where the concatenated sentence these replaced wrote "1500". That is
## the one way the English moved, and it moved in the right direction — these
## are quantities, not identifiers like a line or a section number, which is
## the distinction that decides between a number and a string everywhere in
## these catalogs.
##
## Translators: component and attribute names — `selectFromSequence`,
## `selectPrimeNumbers`, `from`, `to`, `step` — are DoenetML identifiers, not
## words. They are written into these messages as they stand and must be left
## in English exactly as written.

select-variant-name-option-count-mismatch = Invalid variant name for select.  Variant name { $variantName } appears in { $numOptions } options but number to select is { $numToSelect }.

select-variant-name-without-options = Some variants are specified for select but no options are specified for possible variant name: { $variantName }.

select-variant-name-not-possible = Variant name { $variantName } that is specified for select is not a possible variant name.

select-too-few-options = Cannot select { $numToSelect } components from only { $numOptions }.

select-from-sequence-too-few-values = Cannot select { $numToSelect } values from a sequence of length { $length }.

select-from-sequence-indices-count-mismatch = Number of indices specified for select must match number to select

select-from-sequence-indices-not-integers = All indices specified for select must be integers

select-from-sequence-index-excluded = Specified index of selectfromsequence that was excluded

select-from-sequence-indices-excluded-combination = Specified indices of selectfromsequence that was an excluded combination

select-from-sequence-coprime-not-positive-integers = Cannot select coprime combinations as not selecting positive integers.

# Translators: from, to and step are attribute names. They are written into
# the message rather than passed in because these three never vary — an
# argument is for a name that changes from one call to the next.
select-from-sequence-coprime-common-factor = Cannot select coprime numbers. All possible values share a common factor. (Specified values of "from" or "to" must be coprime with "step".)

select-from-sequence-coprime-single-number = Cannot select coprime combinations from a single number that is not 1.

select-from-sequence-excluded-too-many-combinations = Excluded over 70% of combinations in selectFromSequence

# The sibling of `select-from-sequence-coprime-common-factor`, and a different
# situation rather than a rewording of it: that one is decided up front, from
# the sequence's own arithmetic. This one is what is left after two hundred
# draws found no coprime combination among values that could have supplied one.
select-from-sequence-coprime-none-found = Could not select coprime numbers. All possible values share a common factor.

select-from-sequence-too-few-unique-values = Cannot select { $numToSelect } unique values from sequence of length { $numPossibleValues }

select-prime-numbers-too-few-values = Cannot select { $numToSelect } values from a list of primes of length { $numValues }

select-prime-numbers-values-count-mismatch = Number of values specified for select must match number to select

select-prime-numbers-values-not-prime = All values specified for select prime number must be in the list of primes

select-prime-numbers-values-excluded-combination = Specified values of selectPrimeNumbers was an excluded combination

select-prime-numbers-excluded-too-many-combinations = Excluded over 70% of combinations in selectPrimeNumbers

# Both flukes are shared by `<selectFromSequence>` and `<selectPrimeNumbers>`,
# which say the same thing in the same words. Neither is reachable in practice
# — each follows two hundred independent draws — but an unreachable box is
# still a box, and it renders in whatever language the rest of the page does.
select-random-combination-fluke = By extremely unlikely fluke, couldn't select combination of random values

select-random-value-fluke = By extremely unlikely fluke, couldn't select random value

## Inputs embedded in math

# Translators: $component is the input's own DoenetML tag and stays in English,
# as do the attribute names `inline`, `expanded` and `width`. An input written
# inside `<m>` is drawn in the place it is written, inside the typeset
# expression, which makes room for it as it grows. That needs a control small
# enough to sit in a line of mathematics, with a width the expression can
# measure, in an expression that is not drawn on a graph; $reason says which of
# those this input fails. When it fails, the input is not shown at all, and the
# expression is typeset with the input's value in its place — a text input's
# text, a math input's mathematics — or with nothing there for a choice input.
math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] This `<{ $component }>` is not shown because it is inside math and is not `inline`. Add `inline` so it becomes a drop-down list, which fits inside an expression.
        [expanded] This `<{ $component }>` is not shown because it is inside math and is `expanded`. Remove `expanded`; a multi-line box does not fit inside an expression.
        [on-graph] This `<{ $component }>` is not shown because it is inside math drawn on a graph, which has no room for an input.
       *[relative-width] This `<{ $component }>` is not shown because it is inside math and has a relative width. Give the width in absolute units, such as `px`, instead.
    }

## `<sampleRandomNumbers>` and `<selectRandomNumbers>`
##
## Translators: `mean`, `standardDeviation`, `variance`, `numTotal`,
## `numSuccesses`, `numDraws`, `numTrials`, `probability` and `numSamples` are
## DoenetML attribute names. They are written into these messages as they stand
## and must be left in English exactly as written. Each of these names the
## attribute the author has to change, so a message that translated one would
## point at an attribute that does not exist.

# The spread reaches the sampler as a standard deviation however it was written,
# so a negative `variance` arrives here as a `standardDeviation` of NaN and the
# message has to name both for the author to know what to edit.
sample-gaussian-parameters-invalid =
    Invalid mean ({ $mean }) or standardDeviation ({ $standardDeviation }) for a gaussian random variable. The mean must be a finite number, and the standardDeviation (or the variance it is derived from) must be finite and non-negative. No numbers can be sampled.

# These three attributes are the only ones with no default, so leaving one out is
# the commonest way to reach this message. Each arrives either as the number the
# author wrote or as `not-set` for an attribute they left off entirely; translate
# the "not set" wording, but leave the `not-set` key that selects it untouched.
sample-hypergeometric-parameters-invalid =
    Invalid numTotal ({ $numTotal ->
        [not-set] not set
       *[other] { $numTotal }
    }), numSuccesses ({ $numSuccesses ->
        [not-set] not set
       *[other] { $numSuccesses }
    }), or numDraws ({ $numDraws ->
        [not-set] not set
       *[other] { $numDraws }
    }) for a hypergeometric random variable. numTotal must be a positive whole number, and numSuccesses and numDraws must be non-negative whole numbers no larger than numTotal. All three must also stay below about nine quadrillion, past which whole numbers can no longer be counted exactly.

# $maxDraws is the largest number of random draws allowed for a single sample.
sample-hypergeometric-draws-too-many =
    Drawing { $numDraws } items from a population of { $numTotal } would need more than { $maxDraws } random draws for each sample, which would stop the page from responding. Reduce numDraws, or bring it closer to numTotal.

sample-binomial-parameters-invalid =
    Invalid numTrials ({ $numTrials }) or probability ({ $probability }) for a binomial random variable. numTrials must be a non-negative whole number below about nine quadrillion, past which whole numbers can no longer be counted exactly, and probability must be between 0 and 1.

# $maxDraws is the largest number of random draws allowed for a single sample.
sample-binomial-trials-too-many =
    Running { $numTrials } trials would need more than { $maxDraws } random draws for each sample, which would stop the page from responding. Reduce numTrials.

sample-poisson-mean-invalid =
    Invalid mean ({ $mean }) for a poisson random variable. The mean must be a finite, non-negative number.

# $maxDraws is the largest number of random draws allowed for a single sample.
sample-poisson-mean-too-large =
    A poisson mean of { $mean } would need more than { $maxDraws } random draws for each sample, which would stop the page from responding. Reduce the mean.

# $distribution names the distribution, e.g. "binomial"; $draws is roughly how many
# random draws each value needs. Raised by both `<sampleRandomNumbers>` and
# `<selectRandomNumbers>`, which count values with `numSamples` and `numToSelect`
# respectively, so the wording names neither.
sample-distribution-slow =
    Each value from this { $distribution } distribution needs about { $draws } random draws, so sampling may be slow. Reduce the distribution's parameters, or ask for fewer values, if the page feels sluggish.

## List index operators

# Raised by the index-returning list operators (`<indexOf>`, `<searchSorted>`)
# when no `target` was given. $component names the tag the author wrote.
index-operator-missing-target =
    `{ $component }` has no `target` to look for, so it cannot report a position and gives 0.

# Raised when the operator had no values to look through — an empty list, or one
# whose only children were references that produced nothing.
index-operator-no-values =
    `{ $component }` has no values to look through, so it gives 0, which is not the index of any item.
