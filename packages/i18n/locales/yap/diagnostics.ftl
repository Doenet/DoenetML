# Yapese (thin nu Waqab) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file writes the **standard Yapese orthography** — the
# one settled in Jensen's grammar and Yapese–English dictionary (1977) and used
# by the Yap State Department of Education since. Two of its conventions are
# spelling and not decoration:
#
#   * the **glottal stop is the letter «q»**, which is why the island and the
#     people are «Waqab» and not «Wa'ab». It is a consonant of the language and
#     is written everywhere it is heard, including word-initially.
#   * the **underlined series «ḏ», «ḻ», «ṉ», «ṟ»** (Jensen prints a bar under
#     the letter) are letters of their own, distinct from plain «d», «l», «n»,
#     «r», and «th» and «ch» are single letters too.
#
# Printed Yapese today is inconsistent about both: much of it substitutes an
# apostrophe for «q» and drops the underlines altogether. A reviewer who
# prefers that spelling should convert the whole file rather than mix the two
# systems. Many of the words this seed commits to do contain one of the four —
# `content.ftl`'s style tables alone account for nine, which its header names
# one by one — and the edition of Jensen they were quoted from prints no
# underline anywhere, so the plain letter is written throughout. That is a
# known and findable error rather than a claim, and a reviewer replacing the
# loans below will need all four letters.
#
# **Yapese is Oceanic but it is not Micronesian in the narrow sense.** Yap is a
# state of the Federated States of Micronesia, and this batch seeds catalogs
# for its neighbours — `mh`, `chk`, `pon`, `kos`, `gil` — but Yapese is not a
# Nuclear Micronesian language: its position inside Oceanic is disputed and it
# is best treated as an isolate branch, and its lexicon is unlike its
# neighbours' word for word. **So no form here was borrowed from those
# catalogs**, and none should be. Sharing a flag is not a sound correspondence.
# That is the method `locales/sms` used from Northern Sami running the other
# way, and it is the same refusal `locales/na` makes for Nauruan — this file
# agrees with `locales/na` about method and shares none of its vocabulary.
#
# **What this seed could not establish, said plainly once.** Published Yapese
# lexical material is thin and hard to reach, and this seed could not find
# Yapese words for the technical vocabulary these catalogs are made of. So
# **every technical term below is kept as the English word, in English
# spelling, and is a loan rather than a translation.** That is a real fact
# about Yap — schooling, and mathematics teaching in particular, are in
# English — but it is also a confession, and respelling English by an invented
# loan phonology would have presented a guess as a fact. The **frame** is this
# file's contribution — word order, the linker, the absence of gender and of
# number agreement, the variant keys — and the **lexicon** is the debt. A
# speaker replacing the nouns and verbs below is doing the work this file was
# written to make easy, and needs no permission for any of it.
#
# The only Yapese words this seed commits to are:
#   «Waqab»    Yap, the island group and the language's home
#   «thin»     word, speech, language — «thin nu Waqab», the Yapese language
#   «nu»       of, from (as in «thin nu Waqab»)
#   «e»        the common-noun determiner, the commonest word in Yapese text
#   «ni»       the linker that joins a head noun to the modifier or relative
#              clause following it. This is the one productive rule the seed
#              applies, and it applies it only where a modifier plainly
#              follows a noun.
#   «nge»      and, with — joining nouns and joining a phrase to what
#              accompanies it.
# Everything else below is a loan. Check «e» and «nge» first: both are frequent
# enough that a wrong choice is wrong in many places at once. (`content.ftl`'s
# style tables are the one place this seed writes more Yapese than that: its
# colour and width words and two of its shape nouns are attested basic
# vocabulary, sourced word by word in that file's header.)
#
# **Word order: the modifier follows the noun**, linked by «ni». So a style
# description is built as noun + «ni» + description — the opposite of English's
# order, and the opposite of every catalog in the Uralic batch. The `content`
# file is where that shows.
#
# **No grammatical gender.** Yapese has none, so `noun-gender` answers one
# token, and no adjective in these files forks on `$gender`. **No `$role` fork**
# either: nothing here changes shape between a standalone position and a
# clause.
#
# **Counting, and how this seed avoided it.** Yapese counts with an obligatory
# **numeral-classifier** system: a numeral is compounded with a classifier
# chosen by what is being counted (humans, long things, flat things, general
# things), and possession is marked by a second, separate set of **possessive
# classifiers**. A spelled-out Yapese numeral therefore cannot be written
# without deciding what kind of thing follows it. This seed never spells a
# numeral: every count reaches the reader as the `{ $count }` placeable, which
# Fluent renders in digits, so no classifier is ever forced and none is
# invented. A reviewer who wants spelled numerals has to supply the classifier
# with them — and cannot do it inside a placeable, which is the affix rule in
# the README.
#
# **Number.** A Yapese noun is not marked for number by a numeral in front of
# it, so a count changes nothing about the word beside it, and a single
# unselected form is right wherever English forks. `Intl.PluralRules` has no
# CLDR data for `yap` and resolves against the runtime's default locale, so a
# `[two]`, `[few]` or `[many]` branch here would be text nothing could select.
# Only `one`, `other` and explicit digit literals appear, and where English
# forks on number for grammar this file keeps the fork only because the
# English words in the branches differ.
#
# **A named debt.** The piecewise connectives — `piecewise-condition-if`,
# `-or`, `-otherwise` — are basic grammar rather than technical vocabulary, and
# are exactly where a frame contribution belongs; this seed still left them in
# English because it could not establish the Yapese conditional and
# disjunctive particles with any confidence. They are the first three lines a
# speaker should fix, and fixing them costs three lines.


line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } is ignored when two endpoints are specified
       *[other] { $attributes } are ignored when two endpoints are specified
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } is ignored when an endpoint and a midpoint are both specified
       *[other] { $attributes } are ignored when an endpoint and a midpoint are both specified
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset has no effect without a midpoint


line-points-undetermined-dimensions = Line through points of undetermined dimensions.

line-points-too-few-dimensions = Line must be through points of at least two dimensions.

line-points-depend-on-variables = Line is through points that depend on variables: { $variables }.

line-equation-invalid-format = Invalid format for equation of line in variables { $variable1 } and { $variable2 }.


ray-overprescribed-through = Ray is prescribed by through, endpoint, and direction.  Ignoring specified through.

ray-dimension-mismatch = numDimensions mismatch in ray.


vector-overprescribed-head = Vector is prescribed by head, tail, and displacement.  Ignoring specified head.

vector-dimension-mismatch = numDimensions mismatch in vector.


attract-to-without-nearest-point = Cannot attract to a `<{ $component }>` as it doesn't have a nearestPoint state variable.

constrain-to-without-nearest-point = Cannot constrain to a `<{ $component }>` as it doesn't have a nearestPoint state variable.

constrain-to-interior-without-nearest-point = Cannot constrain to interior of a `<{ $component }>` as it doesn't have a nearestPoint state variable.


choice-input-label-position-ignored = labelPosition is ignored for non-inline choiceInput


choice-input-indices-count-mismatch = Ignoring indices specified for choiceInput as number of indices doesn't match number of choice children.

pretzel-indices-count-mismatch = Ignoring indices specified for problem as number of indices doesn't match number of problem children.

shuffle-indices-count-mismatch = Ignoring indices specified for shuffle as number of indices doesn't match number of components.

indices-ignored-out-of-range = Ignoring indices specified for { $component } as some indices out of range.

pretzel-indices-repeated = Ignoring indices specified for pretzel as some indices are repeated.

pretzel-circuit-first-index = Ignoring indices specified for pretzel in circuit mode as the first index must be 1.


string-children-need-type = For `<{ $component }>` to work with string children, a `type` attribute must be specified.

invalid-type-defaulting-to-math = Invalid type { $type } for { $component } component. Must be one of math, text, number, or boolean. Defaulting to math.

string-not-valid-component-to-arrange = String "{ $value }" is not a valid component to { $component }. Ignoring.


invalid-type-defaulting-to-number = Invalid type { $type }, setting type to number.

invalid-variable-value = Invalid value of a variable: `{ $value }`


variant-index-must-be-number = Variant index { $index } must be a number

variant-index-must-be-integer = Variant index { $index } must be an integer


side-by-side-absolute-widths = `<{ $component }>` is not implemented for absolute measurements. Setting widths to relative.

side-by-side-absolute-margins = `<{ $component }>` is not implemented for absolute measurements. Setting margins to relative.

side-by-side-no-block-child = Invalid `<{ $component }>`: it must have at least one block child.


label-for-ignored-on-graphical = The `for` attribute on graphical `<label>` is ignored.

label-for-must-resolve-to-one = The `for` attribute on `<label>` must resolve to exactly one component.

label-for-unresolved = The `for` attribute on `<label>` could not be resolved to a component.

label-for-answer-with-authored-inputs = The `for` attribute on `<label>` references an `<answer>` with explicitly authored inputs; reference the input directly.

label-for-answer-without-input = The `for` attribute on `<label>` references an `<answer>` without an input to label.

label-for-must-reference-input-or-answer = The `for` attribute on `<label>` must reference an input or an answer.


accessibility-short-description-or-decorative = For accessibility, `<{ $component }>` must either have a short description or be specified as decorative.

accessibility-video-short-description = For accessibility, `<video>` must have a short description.

accessibility-input-short-description-or-label = For accessibility, `<{ $component }>` must have a short description or a label.

accessibility-answer-input-short-description-or-label = For accessibility, an `<answer>` creating an input must have a short description or a label.

accessibility-short-description-contains-math = Short descriptions should not contain math components such as `<{ $component }>`. Spell out any math with words.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } has insufficient contrast for the section heading text (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; requires at least { $threshold }:1).
       *[other] { $colorName } has insufficient contrast for the section heading text ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; requires at least { $threshold }:1).
    }


circle-through-points-non-numerical = Haven't implemented `<circle>` through { $count } points in case where the points don't have numerical values.

circle-too-many-through-points = Cannot calculate circle through more than 3 points.

circle-overprescribed-radius-center-points = Cannot calculate circle with specified radius, center and through points.

circle-center-with-multiple-points = Cannot calculate circle with specified center through more than 1 point.

circle-radius-too-small = Cannot calculate circle: given that the distance between the two points is { $distance }, the specified radius { $radius } is too small.

circle-radius-with-many-points = Cannot create circle through more than two points with a specified radius.

circle-invalid-center-or-through-points = Invalid center or through points of circle.

circle-radius-center-with-multiple-points = Cannot calculate radius of circle with specified center through more than 1 point.

circle-change-radius-non-numerical = Cannot change radius of circle with non-numerical through points

circle-radius-with-points-non-numerical = Cannot create circle through more than one point with specified radius when don't have numerical values.

circle-change-center-non-numerical = Haven't implemented changing center of circle through points with non numerical values.


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


sequence-invalid-length = Invalid length of sequence.  Must be a non-negative integer.

sequence-invalid-step = Invalid step of sequence.  Must be a number for sequence of type { $type }.

sequence-invalid-endpoint-number = Invalid "{ $attribute }" of number sequence.  Must be a number.

sequence-invalid-endpoint-letters = Invalid "{ $attribute }" of letters sequence.  Must be a letter combination.

sequence-invalid-endpoint = Invalid "{ $attribute }" of sequence.

select-from-sequence-coprime-not-numbers = coprime ignored since not selecting numbers

select-from-sequence-coprime-with-exclude-combinations = coprime ignored since excludeCombinations specified


target-not-found = Invalid target for `<{ $source }>`: cannot find target.

target-state-variable-not-found = Invalid target for `<{ $source }>`: cannot find a state variable named "{ $property }" on a `<{ $component }>`.


ode-system-variables-match-independent = Variables of `<odeSystem>` must be different than independent variable.

ode-system-duplicate-variable-names = Can't define ODE RHS functions with duplicate dependent variable names.

ode-system-rhs-function-error = Cannot define ODE RHS function.  Error creating mathjs function.


angle-too-many-lines = Cannot define an angle between { $count } lines

angle-invalid-through-point = Invalid point in through of `<angle>`

parabola-vertex-too-many-points = Haven't implemented parabola with vertex through more than 1 point.

parabola-too-many-points = Haven't implemented parabola through more than 3 points.

intersection-too-many-items = Haven't implemented intersection for more than two items


ionic-compound-not-two-ions = Have not implemented ionic compound for anything other than two ions.

ionic-compound-needs-cation-and-anion = Ionic compound implemented only for one cation and one anion.

solve-equations-cannot-evaluate = Cannot solve equation as could not evaluate equation: { $equation }

math-operators-operand-number-required = Must specify a operandNumber when extracting a math operand.

eigen-decomposition-failed = Could not calculate eigenvalues of matrix


matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: the parameter { $parameters } does not occur in the pattern, so it will always match a blank.
       *[other] `<matchesPattern>`: the parameters { $parameters } do not occur in the pattern, so they will always match a blank.
    }


graph-grid-invalid = `<graph>`: cannot interpret grid="{ $grid }". It must be none, medium, dense, or two positive numbers separated by a space, such as grid="1 0.5". No grid is drawn.


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

field-function-attribute-ignored-with-child = The `function` attribute is ignored because the function is also given inside the component; the one inside is used. Give the function only one of the two ways.

field-variables-ignored =
    `<{ $component }>`: the `variables` attribute names the variables of an expression written directly inside the component. { $reason ->
        [function-child] The function here is given as a `<function>` child, which names its own variables, so `variables` is ignored.
       *[no-expression] No such expression is given here, so `variables` is ignored.
    }


prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" is not supported in prefigure renderer; using right-position behavior.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" is not supported in prefigure renderer; using top-position behavior.

prefigure-invalid-axis-bounds = `<graph>`: invalid axis bounds for prefigure conversion; using default bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: invalid width for prefigure conversion; using default diagram width 425.

prefigure-invalid-aspect-ratio = `<graph>`: invalid aspectRatio for prefigure conversion; using default aspect ratio 1.

prefigure-grid-spacing-too-fine = `<graph>`: the grid spacing is too fine for the axis limits; the grid is omitted in the prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: annotations will not be rendered when not using the PreFigure renderer.

multiple-annotations-children = Multiple `<annotations>` children found in `<graph>`; all but the last one are ignored.


copy-unrecognized-component-type = Cannot extend or copy an unrecognized component type: { $type }.

copy-prop-not-found = Could not find prop { $property } on a component of type { $component }

collect-no-source = No source found for collect.

collect-invalid-component-type = Cannot collect components of type `<{ $component }>` as it is an invalid component type.

reference-index-unavailable = Cannot reference index `{ $reference }`


component-action-unavailable = Cannot call { $action } on component `{ $reference }`


data-frame-inconsistent-row-lengths = Data has invalid shape.  Rows has inconsistent lengths. Found in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data has duplicate column names.  Found in componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data is missing a column name.  Found in componentIdx :{ $componentIdx }


answer-award-depends-on-own-response = An award for this answer is based on the answer tag's own submitted response, which will lead to unexpected behavior.

answer-max-num-attempts-in-section-wide-check-work = Setting `maxNumAttempts` on an `<answer>` inside a container with `sectionWideCheckWork` has no effect, as the number of attempts is controlled by the container. Set `maxNumAttempts` on the container instead.

nested-section-wide-check-work-max-num-attempts = Setting `maxNumAttempts` on a container with `sectionWideCheckWork` that is inside another container with `sectionWideCheckWork` has no effect, as the number of attempts is controlled by the outer container. Set `maxNumAttempts` on the outer container instead.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] The { $attributes } attribute will have no effect without symbolicEquality set.
       *[other] The { $attributes } attributes will have no effect without symbolicEquality set.
    }

answer-invalid-type = Invalid type for answer: { $type }


module-attribute-child-needs-name = Since the component `<{ $component }>` does not have a name, it cannot be used for a module attribute

module-attribute-name-already-defined = The component `<{ $component } name="{ $name }">` cannot be used as an attribute for a module because the `<module>` component type already has a "{ $name }" attribute defined.

conditional-content-condition-ignored = Attribute `condition` is ignored on a `<conditionalContent>` component with case or else children.

slider-markers-type-mismatch = Markers type doesn't match slider type.

pretzel-problem-needs-statement-and-answer = Invalid pretzel: each `<problem>` must contain one `<statement>` and one `<answer>`.

pretzel-circuit-first-problem-distractor = Invalid pretzel: in mode="circuit", the first `<problem>` cannot be a distractor.


attribute-invalid-values =
    { $valuesCount ->
        [one] Invalid value { $values } for attribute `{ $attribute }`; ignoring.
       *[other] Invalid values { $values } for attribute `{ $attribute }`; ignoring.
    }

attribute-must-be-references = Invalid value `{ $value }` for attribute `{ $attribute }`. Attribute must be composed of references that begin with a `$`.

math-input-invalid-function-names = <mathInput>: ignored invalid function name(s) in { $attribute }: { $names }. Each name's display segment must be at least 2 characters (letters or dashes); an optional `|<mathspeak alternative>` suffix may follow.


component-type-invalid = Invalid component type: `<{ $componentType }>`

attribute-repeated = Cannot repeat attribute { $attribute }.

attribute-invalid-for-component = Invalid attribute "{ $attribute }" for a component of type `<{ $componentType }>`.


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


variant-num-to-select-not-non-negative-integer = cannot determine unique variants of { $component } as numToSelect isn't a non-negative integer.

variant-num-to-select-not-constant-number = cannot determine unique variants of { $component } as numToSelect isn't constant number.

variant-with-replacement-not-constant-boolean = cannot determine unique variants of { $component } as withReplacement isn't constant boolean.

variant-select-weight-disables-unique = Unique variants for select disabled if have an option with selectWeight or selectForVariants specified

variant-coprime-undetermined = cannot determine unique variants of { $component } as cannot determine coprime is always false.

variant-attribute-not-constant = cannot determine unique variants of { $component } as { $attribute } isn't a constant.

variant-attribute-not-number = cannot determine unique variants of { $component } as { $attribute } isn't a number.

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


prefigure-descendant-unsupported = { $subject }: unsupported in graph prefigure renderer; descendant skipped.

prefigure-descendant-invalid-geometry = { $subject }: non-finite or incomplete geometry; descendant skipped.

prefigure-curve-label-omitted = { $subject }: labels are not supported on converted curve elements; label omitted.

prefigure-curve-unsupported-definition-type = { $subject }: unsupported curve function definition type '{ $definitionType }'; descendant skipped.

prefigure-region-flip-functions-unsupported = { $subject }: unsupported flipFunctions attribute on regionBetweenCurves; descendant skipped.

prefigure-region-non-formula-child = { $subject }: only formula-typed child functions are supported on regionBetweenCurves; descendant skipped.

prefigure-label-position-unsupported =
    { $subject }: unsupported labelPosition '{ $labelPosition }' for { $labelKind ->
        [line-family] line-family label
       *[point] point label
    }; default PreFigure alignment used.

prefigure-fill-style-unsupported = { $subject }: fill style '{ $fillStyle }' is unsupported by PreFigure; falling back to a solid fill.

prefigure-line-style-unknown = { $subject }: unknown line style '{ $lineStyle }' omitted from PreFigure output.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker style '{ $markerStyle }' mapped to PreFigure style 'diamond'.

prefigure-marker-style-unsupported = { $subject }: marker style '{ $markerStyle }' is unsupported by PreFigure; default style used.


annotation-ref-unresolvable = `<annotation>`: invalid `ref`; cannot resolve target. Annotation omitted.

annotation-ref-multiple-targets = `<annotation>`: `ref` resolved to multiple targets; using the first target.

annotation-ref-outside-graph = `<annotation>`: invalid `ref`; target is outside the containing graph. Annotation omitted.

annotation-ref-unsupported-target = `<annotation>`: invalid `ref`; target is not a supported graphical object in prefigure conversion. Annotation omitted.

annotation-text-missing = `<annotation>`: missing or empty `text`; emitting empty text.


composite-circular-dependency =
    { $componentType ->
        [none] Circular dependency detected.
       *[other] Circular dependency detected involving `<{ $componentType }>` component.
    }

reference-no-referent = No referent found for reference: `{ $reference }`

reference-multiple-referents = Multiple referents found for reference: `{ $reference }`


children-invalid-attribute-format = Invalid format for attribute { $attribute } of `<{ $componentType }>`.

children-invalid = Invalid children for `<{ $componentType }>`: Found invalid children: { $children }


attribute-value-invalid-using-default = Invalid value `{ $value }` for attribute `{ $attribute }`, using value `{ $default }`


doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML version { $version } not found.
       *[other] DoenetML version { $version } not found. Falling back to version { $fallback }
    }


parse-invalid-doenetml = Invalid DoenetML: { $content }

parse-tag-missing-close-tag = Invalid DoenetML: The tag `{ $tag }` has no closing tag. Expected a self-closing tag or a `</{ $tagName }>` tag.

parse-tag-error = Invalid DoenetML: Error in tag `<{ $tagName }>`

parse-attribute-missing-value = Invalid DoenetML: Invalid attribute `{ $attribute }` appears to be missing a value.

parse-attribute-invalid = Invalid DoenetML: Invalid attribute `{ $attribute }`

parse-attribute-value-invalid = Invalid DoenetML: Invalid attribute value `{ $value }`

parse-attribute-value-quote-mismatch = Invalid DoenetML: Invalid attribute value `{ $value }`. The quote marks do not match. You appear to be missing a `{ $quote }`

parse-open-tag-name-missing = Invalid DoenetML: Found a tag without a tag name, e.g. `<`

parse-tag-not-closed = Invalid DoenetML: Tag `{ $tag }` was not closed (a `>` appears to be missing).

parse-self-closing-tag-name-missing = Invalid DoenetML: Found a tag without a tag name `<{ $content }>`

parse-self-closing-tag-not-closed = Invalid DoenetML: Tag `{ $tag }` was not closed (`/>` appears to be missing).

parse-tag-invalid-attributes = Invalid DoenetML: Tag `{ $tag }` is not valid. It may have incorrect attributes.

parse-close-tag-name-missing = Invalid DoenetML: Found a closing tag without a tag name, e.g. `</`

parse-attribute-value-unquoted = Attribute values must be enclosed in quotes: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Invalid DoenetML: Found closing tag `{ $tag }`, but no corresponding opening tag

parse-close-tag-mismatched = Invalid DoenetML: Mismatched closing tag. Expected `</{ $expected }>`. Found `{ $found }`

parser-node-unconvertible = Could not convert node { $node } to Dast node.


name-attribute-invalid =
    Invalid attribute name='{ $name }'. { $reason ->
        [characters] Names can contain only letters, numbers, underscores or hyphens.
       *[start] Names must start with a letter.
    }

component-name-invalid-start = Invalid component name "{ $name }". Names must start with a letter.


answer-video-watched-missing-video = Answer with type videoWatched must have a video attribute

answer-video-watched-video-not-reference = Answer with type videoWatched must have video attribute that is a reference

answer-name-not-single-text = Answer name attribute must have a single text child


external-doenetml-recursion-limit = Unable to retrieve external DoenetML due to too many levels of recursion. Is there a circular reference?

external-doenetml-unavailable = Unable to retrieve DoenetML from { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Invalid DoenetML retrieved from { $attribute }="{ $uri }": it did not match the component type "{ $componentType }"


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


deprecated-attribute-to-child = [deprecation] Attribute `{ $attribute }` on `<{ $component }>` is deprecated; use a `<{ $child }>` child instead.


deprecated-attribute-value-renamed = [deprecation] Value `{ $value }` of attribute `{ $attribute }` on `<{ $component }>` is deprecated; use `{ $to }` instead.


pluralize-english-only = `<pluralize>` can only pluralize English, so its text is left unchanged in a document written in { $locale }. Write the plural form directly, or set it with the `pluralForm` attribute.


schema-element-unrecognized = Element `<{ $tag }>` is not a recognized Doenet element.

schema-element-not-allowed-at-root = Element `<{ $tag }>` is not allowed at the root of the document.

schema-element-not-allowed-inside = Element `<{ $tag }>` is not allowed inside of `<{ $parent }>`.

schema-attribute-unrecognized = Element `<{ $tag }>` doesn't have an attribute called `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribute `{ $attribute }` of element `<{ $tag }>` must be a list whose items are each one of: { $allowed }
       *[other] Attribute `{ $attribute }` of element `<{ $tag }>` must be one of: { $allowed }
    }


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

select-from-sequence-coprime-common-factor = Cannot select coprime numbers. All possible values share a common factor. (Specified values of "from" or "to" must be coprime with "step".)

select-from-sequence-coprime-single-number = Cannot select coprime combinations from a single number that is not 1.

select-from-sequence-excluded-too-many-combinations = Excluded over 70% of combinations in selectFromSequence

select-from-sequence-coprime-none-found = Could not select coprime numbers. All possible values share a common factor.

select-from-sequence-too-few-unique-values = Cannot select { $numToSelect } unique values from sequence of length { $numPossibleValues }

select-prime-numbers-too-few-values = Cannot select { $numToSelect } values from a list of primes of length { $numValues }

select-prime-numbers-values-count-mismatch = Number of values specified for select must match number to select

select-prime-numbers-values-not-prime = All values specified for select prime number must be in the list of primes

select-prime-numbers-values-excluded-combination = Specified values of selectPrimeNumbers was an excluded combination

select-prime-numbers-excluded-too-many-combinations = Excluded over 70% of combinations in selectPrimeNumbers

select-random-combination-fluke = By extremely unlikely fluke, couldn't select combination of random values

select-random-value-fluke = By extremely unlikely fluke, couldn't select random value


math-embedded-input-shape-unsuitable =
    `<{ $component }>` is not drawn inside the math; the expression is typeset as it was before inputs could be embedded. { $reason ->
        [not-inline] Only an `inline` choice input fits inside an expression; without `inline` it is a block of buttons.
        [expanded] An `expanded` text input is a multi-line box, which is too large to sit inside an expression.
        [on-graph] On a graph the expression is drawn as a single picture, which has no room for a control.
       *[relative-width] Its `width` is relative (a percentage or `em`), which has nothing to measure against inside an expression. Give the width in absolute units, such as `px`, instead.
    }
