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
