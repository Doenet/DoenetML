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
