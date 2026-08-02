# Uyghur warnings and errors. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `through`, `endpoint`, `midpointOffset`, `numDimensions` and the like are
# DoenetML attribute names. They are part of the language, not prose, and are
# left in English exactly as written.
#
# Uyghur separates with «،». Brackets, quotes and the full stop are the same
# characters as in English and are written opening-first, in logical order; the
# bidi algorithm turns them around when the text is drawn.
#
# Uyghur marks its cases with suffixes, and a suffix cannot attach to a
# placeable. Where English reads "for `<{ $component }>`", the Uyghur either
# reaches for a real postposition — «ئۈچۈن», «بىلەن», each a word of its own
# that can stand beside a placeable — or writes the dative «غا» detached after
# the argument, which is what Uyghur does with a Latin-script foreign word
# anyway. «غا» is a case suffix rather than a postposition, so detaching it is
# the concession the placeable forces; it is left unharmonized, since the word
# it follows is not known here.
#
# Where English distinguishes a singular from a plural only in the verb — "is
# ignored" against "are ignored" — Uyghur says one thing, and the select is
# dropped rather than written out twice identically. The count argument then
# goes unused, which is harmless: it stays in the English message for the
# languages that need it.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = ئىككى ئاخىرقى نۇقتا بەلگىلەنگەندە { $attributes } پەرۋا قىلىنمايدۇ

line-segment-attributes-ignored-with-endpoint-and-midpoint = بىر ئاخىرقى نۇقتا بىلەن بىر ئوتتۇرا نۇقتا تەڭ بەلگىلەنگەندە { $attributes } پەرۋا قىلىنمايدۇ

line-segment-midpoint-offset-without-midpoint = ئوتتۇرا نۇقتا بولمىسا midpointOffset نىڭ تەسىرى يوق

## `<line>`

line-points-undetermined-dimensions = ئۆلچىمى ئېنىقلانمىغان نۇقتىلاردىن ئۆتىدىغان سىزىق.

line-points-too-few-dimensions = سىزىق ئاز دېگەندە ئىككى ئۆلچەملىك نۇقتىلاردىن ئۆتۈشى كېرەك.

line-points-depend-on-variables = سىزىق ئۆزگەرگۈچىلەرگە باغلىق نۇقتىلاردىن ئۆتىدۇ: { $variables }.

line-equation-invalid-format = { $variable1 } ۋە { $variable2 } ئۆزگەرگۈچىلىرىدىكى سىزىق تەڭلىمىسىنىڭ شەكلى ئىناۋەتسىز.

## `<ray>`

ray-overprescribed-through = نۇر through، endpoint ۋە direction بىلەن بەلگىلەنگەن. بەلگىلەنگەن through غا پەرۋا قىلىنمايدۇ.

ray-dimension-mismatch = نۇردا numDimensions ماس كەلمىدى.

## `<vector>`

vector-overprescribed-head = ۋېكتور head، tail ۋە displacement بىلەن بەلگىلەنگەن. بەلگىلەنگەن head غا پەرۋا قىلىنمايدۇ.

vector-dimension-mismatch = ۋېكتوردا numDimensions ماس كەلمىدى.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` غا تارتىلغىلى بولمايدۇ، چۈنكى ئۇنىڭدا nearestPoint ھالەت ئۆزگەرگۈچىسى يوق.

constrain-to-without-nearest-point = `<{ $component }>` غا چەكلىگىلى بولمايدۇ، چۈنكى ئۇنىڭدا nearestPoint ھالەت ئۆزگەرگۈچىسى يوق.

constrain-to-interior-without-nearest-point = `<{ $component }>` نىڭ ئىچىگە چەكلىگىلى بولمايدۇ، چۈنكى ئۇنىڭدا nearestPoint ھالەت ئۆزگەرگۈچىسى يوق.

## `<choiceInput>`

choice-input-label-position-ignored = قۇر ئىچىدە بولمىغان choiceInput دا labelPosition غا پەرۋا قىلىنمايدۇ

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput دا بەلگىلەنگەن indices غا پەرۋا قىلىنمايدۇ، چۈنكى تەرتىپ سانلىرىنىڭ سانى choice بالىلىرىنىڭ سانىغا ماس كەلمەيدۇ.

pretzel-indices-count-mismatch = problem دا بەلگىلەنگەن indices غا پەرۋا قىلىنمايدۇ، چۈنكى تەرتىپ سانلىرىنىڭ سانى problem بالىلىرىنىڭ سانىغا ماس كەلمەيدۇ.

shuffle-indices-count-mismatch = shuffle دا بەلگىلەنگەن indices غا پەرۋا قىلىنمايدۇ، چۈنكى تەرتىپ سانلىرىنىڭ سانى بۆلەكلەرنىڭ سانىغا ماس كەلمەيدۇ.

indices-ignored-out-of-range = { $component } دا بەلگىلەنگەن indices غا پەرۋا قىلىنمايدۇ، چۈنكى بەزى تەرتىپ سانلىرى دائىرىدىن چىقىپ كەتكەن.

pretzel-indices-repeated = pretzel دا بەلگىلەنگەن indices غا پەرۋا قىلىنمايدۇ، چۈنكى بەزى تەرتىپ سانلىرى تەكرارلانغان.

pretzel-circuit-first-index = circuit ھالىتىدە pretzel نىڭ بەلگىلەنگەن indices غا پەرۋا قىلىنمايدۇ، چۈنكى بىرىنچى تەرتىپ سانى 1 بولۇشى كېرەك.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` نىڭ تېكىست بالىلىرى بىلەن ئىشلىشى ئۈچۈن type خاسلىقى بەلگىلىنىشى كېرەك.

invalid-type-defaulting-to-math = { $component } بۆلىكى ئۈچۈن { $type } تىپى ئىناۋەتسىز. ئۇ math، text، number ياكى boolean نىڭ بىرى بولۇشى كېرەك. math ئىشلىتىلىۋاتىدۇ.

string-not-valid-component-to-arrange = "{ $value }" تېكىستى { $component } رەتلىيەلەيدىغان ئىناۋەتلىك بۆلەك ئەمەس. ئۇنىڭغا پەرۋا قىلىنمايدۇ.

## Types and variables

invalid-type-defaulting-to-number = { $type } تىپى ئىناۋەتسىز، تىپ number قىلىپ بەلگىلىنىدۇ.

invalid-variable-value = بىر ئۆزگەرگۈچىنىڭ ئىناۋەتسىز قىممىتى: `{ $value }`

## Variants

variant-index-must-be-number = نۇسخا تەرتىپ سانى { $index } سان بولۇشى كېرەك

variant-index-must-be-integer = نۇسخا تەرتىپ سانى { $index } پۈتۈن سان بولۇشى كېرەك

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` مۇتلەق ئۆلچەملەر ئۈچۈن ئىشلەنمىگەن. كەڭلىكلەر نىسپىي قىلىپ بەلگىلىنىدۇ.

side-by-side-absolute-margins = `<{ $component }>` مۇتلەق ئۆلچەملەر ئۈچۈن ئىشلەنمىگەن. گىرۋەكلەر نىسپىي قىلىپ بەلگىلىنىدۇ.

side-by-side-no-block-child = `<{ $component }>` ئىناۋەتسىز: ئۇنىڭدا ئاز دېگەندە بىر بۆلەك بالىسى بولۇشى كېرەك.

## `<label>`

label-for-ignored-on-graphical = گرافىكىلىق `<label>` دىكى `for` خاسلىقىغا پەرۋا قىلىنمايدۇ.

label-for-must-resolve-to-one = `<label>` دىكى `for` خاسلىقى دەل بىر بۆلەكنى كۆرسىتىشى كېرەك.

label-for-unresolved = `<label>` دىكى `for` خاسلىقى ھېچقانداق بۆلەككە يەتمىدى.

label-for-answer-with-authored-inputs = `<label>` دىكى `for` خاسلىقى كىرگۈزۈشلىرى ئوچۇق يېزىلغان `<answer>` نى كۆرسىتىدۇ؛ كىرگۈزۈشنىڭ ئۆزىنى كۆرسىتىڭ.

label-for-answer-without-input = `<label>` دىكى `for` خاسلىقى ئىسىم قويغىلى بولىدىغان كىرگۈزۈشى يوق `<answer>` نى كۆرسىتىدۇ.

label-for-must-reference-input-or-answer = `<label>` دىكى `for` خاسلىقى بىر كىرگۈزۈشنى ياكى بىر `<answer>` نى كۆرسىتىشى كېرەك.

## Accessibility

accessibility-short-description-or-decorative = زىيارەت قۇلايلىقى ئۈچۈن `<{ $component }>` دا قىسقا چۈشەندۈرۈش بولۇشى، ياكى ئۇ بېزەك دەپ بەلگىلىنىشى كېرەك.

accessibility-video-short-description = زىيارەت قۇلايلىقى ئۈچۈن `<video>` دا قىسقا چۈشەندۈرۈش بولۇشى كېرەك.

accessibility-input-short-description-or-label = زىيارەت قۇلايلىقى ئۈچۈن `<{ $component }>` دا قىسقا چۈشەندۈرۈش ياكى ئىسىم بولۇشى كېرەك.

accessibility-answer-input-short-description-or-label = زىيارەت قۇلايلىقى ئۈچۈن كىرگۈزۈش ھاسىل قىلىدىغان `<answer>` دا قىسقا چۈشەندۈرۈش ياكى ئىسىم بولۇشى كېرەك.

accessibility-short-description-contains-math = قىسقا چۈشەندۈرۈشتە `<{ $component }>` دەك ماتېماتىكىلىق بۆلەكلەر بولماسلىقى كېرەك. ماتېماتىكىنى سۆز بىلەن يېزىڭ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] بۆلۈم ماۋزۇسىنىڭ تېكىستى ئۈچۈن { $colorName } نىڭ سېلىشتۇرمىسى يېتەرلىك ئەمەس (قاراڭغۇ ھالەت) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ ئاز دېگەندە { $threshold }:1 كېرەك).
       *[other] بۆلۈم ماۋزۇسىنىڭ تېكىستى ئۈچۈن { $colorName } نىڭ سېلىشتۇرمىسى يېتەرلىك ئەمەس ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ ئاز دېگەندە { $threshold }:1 كېرەك).
    }

## `<circle>`

circle-through-points-non-numerical = نۇقتىلارنىڭ سانلىق قىممىتى بولمىغاندا { $count } نۇقتىدىن ئۆتىدىغان `<circle>` ئىشلەنمىگەن.

circle-too-many-through-points = 3 دىن ئارتۇق نۇقتىدىن ئۆتىدىغان چەمبەرنى ھېسابلىغىلى بولمايدۇ.

circle-overprescribed-radius-center-points = بەلگىلەنگەن رادىئۇس، مەركەز ۋە ئۆتىدىغان نۇقتىلار بىلەن چەمبەرنى ھېسابلىغىلى بولمايدۇ.

circle-center-with-multiple-points = بەلگىلەنگەن مەركەز بىلەن بىردىن ئارتۇق نۇقتىدىن ئۆتىدىغان چەمبەرنى ھېسابلىغىلى بولمايدۇ.

circle-radius-too-small = چەمبەرنى ھېسابلىغىلى بولمايدۇ: ئىككى نۇقتا ئارىسىدىكى ئارىلىق { $distance } بولغاچقا، بەلگىلەنگەن رادىئۇس { $radius } بەك كىچىك.

circle-radius-with-many-points = بەلگىلەنگەن رادىئۇس بىلەن ئىككىدىن ئارتۇق نۇقتىدىن ئۆتىدىغان چەمبەر ھاسىل قىلغىلى بولمايدۇ.

circle-invalid-center-or-through-points = چەمبەرنىڭ مەركىزى ياكى ئۆتىدىغان نۇقتىلىرى ئىناۋەتسىز.

circle-radius-center-with-multiple-points = بەلگىلەنگەن مەركەز بىلەن بىردىن ئارتۇق نۇقتىدىن ئۆتىدىغان چەمبەرنىڭ رادىئۇسىنى ھېسابلىغىلى بولمايدۇ.

circle-change-radius-non-numerical = سانلىق قىممىتى يوق نۇقتىلاردىن ئۆتىدىغان چەمبەرنىڭ رادىئۇسىنى ئۆزگەرتكىلى بولمايدۇ

circle-radius-with-points-non-numerical = سانلىق قىممەت بولمىغاندا بەلگىلەنگەن رادىئۇس بىلەن بىردىن ئارتۇق نۇقتىدىن ئۆتىدىغان چەمبەر ھاسىل قىلغىلى بولمايدۇ.

circle-change-center-non-numerical = سانلىق قىممىتى يوق نۇقتىلاردىن ئۆتىدىغان چەمبەرنىڭ مەركىزىنى ئۆزگەرتىش ئىشلەنمىگەن.

## `<function>`

function-domain-insufficient-dimensions = فۇنكسىيەنىڭ ئېنىقلىنىش دائىرىسى ئۈچۈن ئۆلچەم يېتەرلىك ئەمەس. دائىرىدە { $intervals } ئارىلىق بار، فۇنكسىيەدە بولسا { $inputs } كىرگۈزۈش بار.

function-domain-invalid-format = فۇنكسىيەنىڭ ئېنىقلىنىش دائىرىسىنىڭ شەكلى ئىناۋەتسىز.

function-ignoring-non-numerical =
    { $type ->
        [maximum] فۇنكسىيەنىڭ سانلىق بولمىغان ئەڭ چوڭ قىممىتىگە پەرۋا قىلىنمايدۇ.
        [minimum] فۇنكسىيەنىڭ سانلىق بولمىغان ئەڭ كىچىك قىممىتىگە پەرۋا قىلىنمايدۇ.
        [extremum] فۇنكسىيەنىڭ سانلىق بولمىغان چەك قىممىتىگە پەرۋا قىلىنمايدۇ.
        [point] فۇنكسىيەنىڭ سانلىق بولمىغان نۇقتىسىغا پەرۋا قىلىنمايدۇ.
        [slope] فۇنكسىيەنىڭ سانلىق بولمىغان يانتۇلۇقىغا پەرۋا قىلىنمايدۇ.
       *[other] فۇنكسىيەنىڭ سانلىق بولمىغان { $type } ئىگە پەرۋا قىلىنمايدۇ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] فۇنكسىيەنىڭ قۇرۇق ئەڭ چوڭ قىممىتىگە پەرۋا قىلىنمايدۇ.
        [minimum] فۇنكسىيەنىڭ قۇرۇق ئەڭ كىچىك قىممىتىگە پەرۋا قىلىنمايدۇ.
        [extremum] فۇنكسىيەنىڭ قۇرۇق چەك قىممىتىگە پەرۋا قىلىنمايدۇ.
        [point] فۇنكسىيەنىڭ قۇرۇق نۇقتىسىغا پەرۋا قىلىنمايدۇ.
       *[other] فۇنكسىيەنىڭ قۇرۇق { $type } ئىگە پەرۋا قىلىنمايدۇ.
    }

function-points-too-close = فۇنكسىيەدە ئورنى بەك يېقىن ئىككى نۇقتا بار. فۇنكسىيەنى ئېنىقلىغىلى بولمايدۇ.

function-iterates-input-output-mismatch = فۇنكسىيە تەكرارلىنىشى پەقەت كىرگۈزۈش سانى چىقىرىش سانىغا تەڭ بولغاندىلا مۇمكىن. بۇ فۇنكسىيەدە { $inputs } كىرگۈزۈش ۋە { $outputs } چىقىرىش بار.

## `<sequence>`

sequence-invalid-length = تىزمىنىڭ ئۇزۇنلۇقى ئىناۋەتسىز. ئۇ مەنپىي بولمىغان پۈتۈن سان بولۇشى كېرەك.

sequence-invalid-step = تىزمىنىڭ قەدىمى ئىناۋەتسىز. { $type } تىپىدىكى تىزما ئۈچۈن ئۇ سان بولۇشى كېرەك.

sequence-invalid-endpoint-number = سانلىق تىزمىنىڭ "{ $attribute }" قىممىتى ئىناۋەتسىز. ئۇ سان بولۇشى كېرەك.

sequence-invalid-endpoint-letters = ھەرپ تىزمىسىنىڭ "{ $attribute }" قىممىتى ئىناۋەتسىز. ئۇ ھەرپلەر بىرىكمىسى بولۇشى كېرەك.

sequence-invalid-endpoint = تىزمىنىڭ "{ $attribute }" قىممىتى ئىناۋەتسىز.

select-from-sequence-coprime-not-numbers = coprime غا پەرۋا قىلىنمىدى، چۈنكى تاللاش سانلاردىن ئەمەس

select-from-sequence-coprime-with-exclude-combinations = coprime غا پەرۋا قىلىنمىدى، چۈنكى excludeCombinations بەلگىلەنگەن

## Resolving a `target`

target-not-found = `<{ $source }>` دىكى target قىممىتى ئىناۋەتسىز: نىشان تېپىلمىدى.

target-state-variable-not-found = `<{ $source }>` دىكى target قىممىتى ئىناۋەتسىز: `<{ $component }>` دا "{ $property }" ئىسىملىك ھالەت ئۆزگەرگۈچىسى تېپىلمىدى.

## `<odeSystem>`

# «ئوڭ تەرەپ» is the right-hand side of the equation and stays the right one:
# mathematics is a left-to-right island inside a Uyghur document, so the
# equation the phrase names is drawn the same way round as in English.
ode-system-variables-match-independent = `<odeSystem>` نىڭ ئۆزگەرگۈچىلىرى ئەركىن ئۆزگەرگۈچىدىن پەرقلىق بولۇشى كېرەك.

ode-system-duplicate-variable-names = دىففېرېنسىئال تەڭلىمىنىڭ ئوڭ تەرەپ فۇنكسىيەلىرىنى تەكرارلانغان تايىنىدىغان ئۆزگەرگۈچى ئىسىملىرى بىلەن ئېنىقلىغىلى بولمايدۇ.

ode-system-rhs-function-error = دىففېرېنسىئال تەڭلىمىنىڭ ئوڭ تەرەپ فۇنكسىيەسىنى ئېنىقلىغىلى بولمايدۇ. mathjs فۇنكسىيەسى قۇرۇشتا خاتالىق.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } سىزىق ئارىسىدىكى بۇلۇڭنى ئېنىقلىغىلى بولمايدۇ

angle-invalid-through-point = `<angle>` نىڭ through ىدا ئىناۋەتسىز نۇقتا

parabola-vertex-too-many-points = بەلگىلەنگەن چوققا بىلەن بىردىن ئارتۇق نۇقتىدىن ئۆتىدىغان پارابولا ئىشلەنمىگەن.

parabola-too-many-points = 3 تىن ئارتۇق نۇقتىدىن ئۆتىدىغان پارابولا ئىشلەنمىگەن.

intersection-too-many-items = ئىككىدىن ئارتۇق نەرسىنىڭ كېسىشىشى ئىشلەنمىگەن

## Other math components

ionic-compound-not-two-ions = ئىككى ئىئوندىن باشقا ھالەت ئۈچۈن ئىئون بىرىكمىسى ئىشلەنمىگەن.

ionic-compound-needs-cation-and-anion = ئىئون بىرىكمىسى پەقەت بىر كاتىئون ۋە بىر ئانىئون ئۈچۈنلا ئىشلەنگەن.

solve-equations-cannot-evaluate = تەڭلىمىنى يېشەلمىدى، چۈنكى ئۇنىڭ قىممىتىنى ھېسابلىغىلى بولمىدى: { $equation }

math-operators-operand-number-required = ماتېماتىكىلىق ئوپېراند ئاجرىتىۋالغاندا operandNumber بەلگىلىنىشى كېرەك.

eigen-decomposition-failed = ماترىتسىنىڭ خاس قىممەتلىرىنى ھېسابلىغىلى بولمىدى

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } پارامېتىرى ئەندىزىدە كۆرۈلمەيدۇ، شۇڭا ئۇ ھەمىشە قۇرۇق ئورۇنغا ماس كېلىدۇ.
       *[other] `<matchesPattern>`: { $parameters } پارامېتىرلىرى ئەندىزىدە كۆرۈلمەيدۇ، شۇڭا ئۇلار ھەمىشە قۇرۇق ئورۇنغا ماس كېلىدۇ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" نى چۈشەنگىلى بولمىدى. ئۇ none، medium، dense بولۇشى، ياكى بوشلۇق بىلەن ئايرىلغان ئىككى مۇسبەت سان بولۇشى كېرەك، مەسىلەن grid="1 0.5". ھېچقانداق تور سىزىلمايدۇ.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure كۆرگۈچىدە xLabelPosition="left" قوللانمايدۇ؛ right ئورنىنىڭ ئىش ھەرىكىتى ئىشلىتىلىدۇ.

prefigure-y-label-position-unsupported = `<graph>`: prefigure كۆرگۈچىدە yLabelPosition="bottom" قوللانمايدۇ؛ top ئورنىنىڭ ئىش ھەرىكىتى ئىشلىتىلىدۇ.

prefigure-invalid-axis-bounds = `<graph>`: prefigure غا ئايلاندۇرۇش ئۈچۈن ئوق چېگرالىرى ئىناۋەتسىز؛ كۆڭۈلدىكى bbox (-10,-10,10,10) ئىشلىتىلىدۇ.

prefigure-invalid-width = `<graph>`: prefigure غا ئايلاندۇرۇش ئۈچۈن كەڭلىك ئىناۋەتسىز؛ كۆڭۈلدىكى دىئاگرامما كەڭلىكى 425 ئىشلىتىلىدۇ.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure غا ئايلاندۇرۇش ئۈچۈن aspectRatio ئىناۋەتسىز؛ كۆڭۈلدىكى نىسبەت 1 ئىشلىتىلىدۇ.

prefigure-grid-spacing-too-fine = `<graph>`: ئوق چېگرالىرىغا سېلىشتۇرغاندا تور ئارىلىقى بەك مايىن؛ prefigure كۆرگۈچىدە تور چىقىرىۋېتىلىدۇ.

prefigure-annotations-not-rendered = `<graph>`: PreFigure كۆرگۈچى ئىشلىتىلمىگەندە ئىزاھاتلار سىزىلمايدۇ.

multiple-annotations-children = `<graph>` ئىچىدە بىردىن ئارتۇق `<annotations>` بالىسى تېپىلدى؛ ئاخىرقىسىدىن باشقىسىغا پەرۋا قىلىنمايدۇ.

## Referring to other components

copy-unrecognized-component-type = تونۇلمىغان بۆلەك تىپىنى كېڭەيتكىلى ياكى كۆچۈرگىلى بولمايدۇ: { $type }.

copy-prop-not-found = { $component } تىپىدىكى بۆلەكتە { $property } خاسلىقى تېپىلمىدى

collect-no-source = collect ئۈچۈن مەنبە تېپىلمىدى.

collect-invalid-component-type = `<{ $component }>` تىپىدىكى بۆلەكلەرنى يىغقىلى بولمايدۇ، چۈنكى ئۇ ئىناۋەتسىز تىپ.

reference-index-unavailable = `{ $reference }` تەرتىپ سانىنى كۆرسەتكىلى بولمايدۇ

## `<callAction>`

component-action-unavailable = `{ $reference }` بۆلىكىدە { $action } نى چاقىرغىلى بولمايدۇ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = سانلىق مەلۇماتنىڭ شەكلى ئىناۋەتسىز. قۇر ئۇزۇنلۇقلىرى بىردەك ئەمەس. componentIdx :{ $componentIdx } دا تېپىلدى

data-frame-duplicate-column-names = سانلىق مەلۇماتتا تەكرارلانغان ئىستون ئىسىملىرى بار. componentIdx :{ $componentIdx } دا تېپىلدى

data-frame-missing-column-name = سانلىق مەلۇماتتا بىر ئىستون ئىسمى كەم. componentIdx :{ $componentIdx } دا تېپىلدى

## `<answer>` and scoring

answer-award-depends-on-own-response = بۇ جاۋابنىڭ بىر award ى answer نىڭ ئۆزى يوللىغان جاۋابقا تايىنىدۇ، بۇ كۈتۈلمىگەن ئىش ھەرىكەتنى كەلتۈرۈپ چىقىرىدۇ.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` بار قاچىنىڭ ئىچىدىكى `<answer>` غا `maxNumAttempts` بەلگىلەشنىڭ تەسىرى يوق، چۈنكى سىناش سانىنى قاچا بەلگىلەيدۇ. ئۇنىڭ ئورنىغا `maxNumAttempts` نى قاچىغا بەلگىلەڭ.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` بار، ئۆزى يەنە شۇنداق بىر قاچىنىڭ ئىچىدە تۇرغان قاچىغا `maxNumAttempts` بەلگىلەشنىڭ تەسىرى يوق، چۈنكى سىناش سانىنى سىرتقى قاچا بەلگىلەيدۇ. `maxNumAttempts` نى سىرتقى قاچىغا بەلگىلەڭ.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality بەلگىلەنمىسە { $attributes } خاسلىقىنىڭ تەسىرى بولمايدۇ.
       *[other] symbolicEquality بەلگىلەنمىسە { $attributes } خاسلىقلىرىنىڭ تەسىرى بولمايدۇ.
    }

answer-invalid-type = جاۋاب ئۈچۈن ئىناۋەتسىز تىپ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` بۆلىكىنىڭ ئىسمى بولمىغاچقا، ئۇنى module نىڭ خاسلىقى قىلىپ ئىشلەتكىلى بولمايدۇ

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` بۆلىكىنى module نىڭ خاسلىقى قىلىپ ئىشلەتكىلى بولمايدۇ، چۈنكى `<module>` تىپىدا "{ $name }" ئىسىملىك خاسلىق ئاللىبۇرۇن بار.

conditional-content-condition-ignored = case ياكى else بالىلىرى بار `<conditionalContent>` بۆلىكىدە `condition` خاسلىقىغا پەرۋا قىلىنمايدۇ.

slider-markers-type-mismatch = بەلگىلەرنىڭ تىپى سىيرىغۇچنىڭ تىپىغا ماس كەلمەيدۇ.

pretzel-problem-needs-statement-and-answer = ئىناۋەتسىز pretzel: ھەر بىر `<problem>` دا بىر `<statement>` ۋە بىر `<answer>` بولۇشى كېرەك.

pretzel-circuit-first-problem-distractor = ئىناۋەتسىز pretzel: mode="circuit" دا بىرىنچى `<problem>` ئالدامچى بولالمايدۇ.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` خاسلىقى ئۈچۈن { $values } قىممىتى ئىناۋەتسىز؛ ئۇنىڭغا پەرۋا قىلىنمايدۇ.
       *[other] `{ $attribute }` خاسلىقى ئۈچۈن { $values } قىممەتلىرى ئىناۋەتسىز؛ ئۇلارغا پەرۋا قىلىنمايدۇ.
    }

attribute-must-be-references = `{ $attribute }` خاسلىقى ئۈچۈن `{ $value }` قىممىتى ئىناۋەتسىز. خاسلىق `$` بىلەن باشلىنىدىغان نەقىللەردىن تۈزۈلۈشى كېرەك.

math-input-invalid-function-names = <mathInput>: { $attribute } دىكى ئىناۋەتسىز فۇنكسىيە ئىسىملىرىغا پەرۋا قىلىنمىدى: { $names }. ھەر بىر ئىسىمنىڭ كۆرسىتىلىدىغان قىسمى ئاز دېگەندە ئىككى بەلگە بولۇشى كېرەك (ھەرپ ياكى سىزىقچە)؛ ئۇنىڭدىن كېيىن تاللانما `|<mathspeak alternative>` كېلىشى مۇمكىن.

## Building components from the source

component-type-invalid = ئىناۋەتسىز بۆلەك تىپى: `<{ $componentType }>`

attribute-repeated = { $attribute } خاسلىقىنى تەكرارلىغىلى بولمايدۇ.

attribute-invalid-for-component = `<{ $componentType }>` تىپىدىكى بۆلەك ئۈچۈن "{ $attribute }" خاسلىقى ئىناۋەتسىز.

## Style definition contrast

style-definition-insufficient-contrast =
    ئۇسلۇب ئېنىقلىمىسى { $styleNumber } دە { $context ->
        [text-on-background] تېكىست رەڭگىنىڭ تەگلىك رەڭگىگە سېلىشتۇرغاندا
        [high-contrast] يۇقىرى سېلىشتۇرما رەڭنىڭ تاختىغا سېلىشتۇرغاندا
        [line] سىزىق رەڭگىنىڭ تاختىغا سېلىشتۇرغاندا
        [marker] بەلگە رەڭگىنىڭ تاختىغا سېلىشتۇرغاندا
       *[text-on-canvas] تېكىست رەڭگىنىڭ تاختىغا سېلىشتۇرغاندا
    } سېلىشتۇرمىسى يېتەرلىك ئەمەس{ $mode ->
        [dark] { " (قاراڭغۇ ھالەت)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ ئاز دېگەندە { $threshold }:1 كېرەك).

style-definition-dark-mode-text-background-contrast =
    ئۇسلۇب ئېنىقلىمىسى { $styleNumber } يورۇق ھالەتتە يېتەرلىك سېلىشتۇرما بېرىدىغان رەڭلەرنى بەلگىلىگەن بولسىمۇ، ئۇلاردىن كېلىپ چىققان قاراڭغۇ ھالەت رەڭلىرى تېكىست بىلەن تەگلىك رەڭگى ئارىسىدا يېتەرلىك سېلىشتۇرما بەرمەيدۇ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ ئاز دېگەندە { $threshold }:1 كېرەك). { $suggestion ->
        [available] قاراڭغۇ ھالەتتە يېتەرلىك سېلىشتۇرما ئۈچۈن يا يورۇق ھالەتنىڭ سېلىشتۇرمىسىنى ئاشۇرۇڭ (مەسىلەن { $lightAttribute }="{ $lightColor }")، يا قاراڭغۇ ھالەت رەڭگىنى ئۆزىڭىز بەلگىلەڭ (مەسىلەن { $darkAttribute }="{ $darkColor }").
       *[none] قاراڭغۇ ھالەتتە يېتەرلىك سېلىشتۇرما ئۈچۈن يورۇق ھالەتنىڭ سېلىشتۇرمىسىنى ئاشۇرۇڭ ياكى كېلىپ چىققان رەڭلەرنى textColorDarkMode ۋە/ياكى backgroundColorDarkMode بىلەن ئالماشتۇرۇڭ.
    }

style-definition-dark-mode-text-canvas-contrast =
    ئۇسلۇب ئېنىقلىمىسى { $styleNumber } يورۇق ھالەتتە يېتەرلىك سېلىشتۇرما بېرىدىغان تېكىست رەڭگىنى بەلگىلىگەن بولسىمۇ، ئۇنىڭدىن كېلىپ چىققان قاراڭغۇ ھالەت تېكىست رەڭگى تاختىغا سېلىشتۇرغاندا يېتەرلىك سېلىشتۇرما بەرمەيدۇ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ ئاز دېگەندە { $threshold }:1 كېرەك). { $suggestion ->
        [available] قاراڭغۇ ھالەتتە يېتەرلىك سېلىشتۇرما ئۈچۈن يا يورۇق ھالەتنىڭ سېلىشتۇرمىسىنى ئاشۇرۇڭ (مەسىلەن textColor="{ $lightColor }")، يا قاراڭغۇ ھالەت رەڭگىنى ئۆزىڭىز بەلگىلەڭ (مەسىلەن textColorDarkMode="{ $darkColor }").
       *[none] قاراڭغۇ ھالەتتە يېتەرلىك سېلىشتۇرما ئۈچۈن يورۇق ھالەتنىڭ سېلىشتۇرمىسىنى ئاشۇرۇڭ ياكى كېلىپ چىققان رەڭنى textColorDarkMode بىلەن ئالماشتۇرۇڭ.
    }

section-multiple-style-palettes = بىر بۆلۈم پەقەت بىرلا <stylePalette> تاللىيالايدۇ؛ ئاخىرقىسى ئىشلىتىلىدۇ.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } بۆلىكىنىڭ يەككە نۇسخىلىرىنى بېكىتكىلى بولمايدۇ، چۈنكى numToSelect مەنپىي بولمىغان پۈتۈن سان ئەمەس.

variant-num-to-select-not-constant-number = { $component } بۆلىكىنىڭ يەككە نۇسخىلىرىنى بېكىتكىلى بولمايدۇ، چۈنكى numToSelect تۇراقلىق سان ئەمەس.

variant-with-replacement-not-constant-boolean = { $component } بۆلىكىنىڭ يەككە نۇسخىلىرىنى بېكىتكىلى بولمايدۇ، چۈنكى withReplacement تۇراقلىق لوگىكىلىق قىممەت ئەمەس.

variant-select-weight-disables-unique = بىر تاللانمىدا selectWeight ياكى selectForVariants بەلگىلەنسە، select نىڭ يەككە نۇسخىلىرى توختايدۇ

variant-coprime-undetermined = { $component } بۆلىكىنىڭ يەككە نۇسخىلىرىنى بېكىتكىلى بولمايدۇ، چۈنكى coprime نىڭ ھەمىشە يالغان ئىكەنلىكىنى ئېنىقلىغىلى بولمىدى.

variant-attribute-not-constant = { $component } بۆلىكىنىڭ يەككە نۇسخىلىرىنى بېكىتكىلى بولمايدۇ، چۈنكى { $attribute } تۇراقلىق ئەمەس.

variant-attribute-not-number = { $component } بۆلىكىنىڭ يەككە نۇسخىلىرىنى بېكىتكىلى بولمايدۇ، چۈنكى { $attribute } سان ئەمەس.

variant-attribute-wrong-type-for-sequence =
    { $type } تىپىدىكى { $component } بۆلىكىنىڭ يەككە نۇسخىلىرىنى بېكىتكىلى بولمايدۇ، چۈنكى { $attribute } { $expected ->
        [letters-combination] ھەرپلەر بىرىكمىسى
        [math-expression] ئىناۋەتلىك ماتېماتىكىلىق ئىپادە
        [integer] پۈتۈن سان
       *[number] سان
    } ئەمەس.

variant-length-not-integer = { $component } بۆلىكىنىڭ يەككە نۇسخىلىرىنى بېكىتكىلى بولمايدۇ، چۈنكى length پۈتۈن سان ئەمەس.

variant-sort-not-implemented = sort بىلەن { $component } نىڭ يەككە نۇسخىلىرى ئىشلەنمىگەن

variant-exclude-combinations-not-implemented = excludeCombinations بىلەن { $component } نىڭ يەككە نۇسخىلىرى ئىشلەنمىگەن

variant-math-exclude-not-implemented = exclude بىلەن math تىپىدىكى { $component } نىڭ يەككە نۇسخىلىرى ئىشلەنمىگەن

variant-non-constant-exclude-not-implemented = تۇراقسىز exclude بىلەن { $component } نىڭ يەككە نۇسخىلىرى ئىشلەنمىگەن

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: دىئاگراممىنىڭ prefigure كۆرگۈچىسىدە قوللانمايدۇ؛ تارماق ئېلېمېنت ئۆتكۈزۈۋېتىلدى.

prefigure-descendant-invalid-geometry = { $subject }: چەكسىز ياكى تولۇق بولمىغان گېئومېتىرىيە؛ تارماق ئېلېمېنت ئۆتكۈزۈۋېتىلدى.

prefigure-curve-label-omitted = { $subject }: ئايلاندۇرۇلغان ئەگرى سىزىق ئېلېمېنتلىرىدا ئىسىم قوللانمايدۇ؛ ئىسىم چىقىرىۋېتىلدى.

prefigure-curve-unsupported-definition-type = { $subject }: ئەگرى سىزىق فۇنكسىيەسىنىڭ ئېنىقلىما تىپى '{ $definitionType }' قوللانمايدۇ؛ تارماق ئېلېمېنت ئۆتكۈزۈۋېتىلدى.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves دا flipFunctions خاسلىقى قوللانمايدۇ؛ تارماق ئېلېمېنت ئۆتكۈزۈۋېتىلدى.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves دا پەقەت فورمۇلا بىلەن ئېنىقلانغان بالا فۇنكسىيەلەرلا قوللىنىلىدۇ؛ تارماق ئېلېمېنت ئۆتكۈزۈۋېتىلدى.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] سىزىق ئائىلىسىنىڭ ئىسمى
       *[point] نۇقتىنىڭ ئىسمى
    } ئۈچۈن labelPosition '{ $labelPosition }' قوللانمايدۇ؛ PreFigure نىڭ كۆڭۈلدىكى تىزىلىشى ئىشلىتىلدى.

prefigure-fill-style-unsupported = { $subject }: تولدۇرۇش ئۇسلۇبى '{ $fillStyle }' PreFigure دا قوللانمايدۇ؛ بىردەك تولدۇرۇش ئىشلىتىلىدۇ.

prefigure-line-style-unknown = { $subject }: سىزىق ئۇسلۇبى '{ $lineStyle }' نامەلۇم ۋە PreFigure چىقىرىشىدىن چىقىرىۋېتىلدى.

prefigure-marker-style-mapped-to-diamond = { $subject }: بەلگە ئۇسلۇبى '{ $markerStyle }' PreFigure نىڭ 'diamond' ئۇسلۇبىغا ئايلاندۇرۇلدى.

prefigure-marker-style-unsupported = { $subject }: بەلگە ئۇسلۇبى '{ $markerStyle }' PreFigure دا قوللانمايدۇ؛ كۆڭۈلدىكى ئۇسلۇب ئىشلىتىلدى.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ئىناۋەتسىز؛ نىشاننى ئېنىقلىغىلى بولمىدى. ئىزاھات چىقىرىۋېتىلدى.

annotation-ref-multiple-targets = `<annotation>`: `ref` بىردىن ئارتۇق نىشانغا يەتتى؛ بىرىنچى نىشان ئىشلىتىلىدۇ.

annotation-ref-outside-graph = `<annotation>`: `ref` ئىناۋەتسىز؛ نىشان ئۆز دىئاگراممىسىنىڭ سىرتىدا. ئىزاھات چىقىرىۋېتىلدى.

annotation-ref-unsupported-target = `<annotation>`: `ref` ئىناۋەتسىز؛ نىشان prefigure ئايلاندۇرۇشىدا قوللىنىلىدىغان گرافىكىلىق ئوبيېكت ئەمەس. ئىزاھات چىقىرىۋېتىلدى.

annotation-text-missing = `<annotation>`: `text` يوق ياكى قۇرۇق؛ قۇرۇق تېكىست چىقىرىلىدۇ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] دەۋرىي تايىنىش بايقالدى.
       *[other] `<{ $componentType }>` بۆلىكىنى ئۆز ئىچىگە ئالغان دەۋرىي تايىنىش بايقالدى.
    }

reference-no-referent = نەقىل ئۈچۈن كۆرسىتىلگۈچى تېپىلمىدى: `{ $reference }`

reference-multiple-referents = نەقىل ئۈچۈن بىردىن ئارتۇق كۆرسىتىلگۈچى تېپىلدى: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` نىڭ { $attribute } خاسلىقىنىڭ شەكلى ئىناۋەتسىز.

children-invalid = `<{ $componentType }>` ئۈچۈن ئىناۋەتسىز بالىلار: ئىناۋەتسىز بالىلار تېپىلدى: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` خاسلىقى ئۈچۈن `{ $value }` قىممىتى ئىناۋەتسىز، `{ $default }` قىممىتى ئىشلىتىلىدۇ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML نىڭ { $version } نەشرى تېپىلمىدى.
       *[other] DoenetML نىڭ { $version } نەشرى تېپىلمىدى. { $fallback } نەشرى ئىشلىتىلىدۇ
    }

## Reading the DoenetML

parse-invalid-doenetml = ئىناۋەتسىز DoenetML: { $content }

parse-tag-missing-close-tag = ئىناۋەتسىز DoenetML: `{ $tag }` بەلگىسىنىڭ يېپىش بەلگىسى يوق. ئۆزى يېپىلىدىغان بەلگە ياكى `</{ $tagName }>` بەلگىسى كۈتۈلگەن.

parse-tag-error = ئىناۋەتسىز DoenetML: `<{ $tagName }>` بەلگىسىدە خاتالىق

parse-attribute-missing-value = ئىناۋەتسىز DoenetML: ئىناۋەتسىز `{ $attribute }` خاسلىقىنىڭ قىممىتى كەمدەك قىلىدۇ.

parse-attribute-invalid = ئىناۋەتسىز DoenetML: `{ $attribute }` خاسلىقى ئىناۋەتسىز

parse-attribute-value-invalid = ئىناۋەتسىز DoenetML: خاسلىق قىممىتى `{ $value }` ئىناۋەتسىز

parse-attribute-value-quote-mismatch = ئىناۋەتسىز DoenetML: خاسلىق قىممىتى `{ $value }` ئىناۋەتسىز. تىرناقلار ماس كەلمەيدۇ. بىر `{ $quote }` كەمدەك قىلىدۇ

parse-open-tag-name-missing = ئىناۋەتسىز DoenetML: ئىسمى يوق بەلگە تېپىلدى، مەسىلەن `<`

parse-tag-not-closed = ئىناۋەتسىز DoenetML: `{ $tag }` بەلگىسى يېپىلمىدى (`>` كەمدەك قىلىدۇ).

parse-self-closing-tag-name-missing = ئىناۋەتسىز DoenetML: ئىسمى يوق بەلگە تېپىلدى `<{ $content }>`

parse-self-closing-tag-not-closed = ئىناۋەتسىز DoenetML: `{ $tag }` بەلگىسى يېپىلمىدى (`/>` كەمدەك قىلىدۇ).

parse-tag-invalid-attributes = ئىناۋەتسىز DoenetML: `{ $tag }` بەلگىسى ئىناۋەتلىك ئەمەس. خاسلىقلىرى خاتا بولۇشى مۇمكىن.

parse-close-tag-name-missing = ئىناۋەتسىز DoenetML: ئىسمى يوق يېپىش بەلگىسى تېپىلدى، مەسىلەن `</`

parse-attribute-value-unquoted = خاسلىق قىممەتلىرى تىرناق ئىچىدە بولۇشى كېرەك: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = ئىناۋەتسىز DoenetML: `{ $tag }` يېپىش بەلگىسى تېپىلدى، بىراق ئۇنىڭغا ماس ئېچىش بەلگىسى يوق

parse-close-tag-mismatched = ئىناۋەتسىز DoenetML: يېپىش بەلگىسى ماس كەلمىدى. `</{ $expected }>` كۈتۈلگەن. `{ $found }` تېپىلدى

parser-node-unconvertible = { $node } تۈگۈنىنى Dast تۈگۈنىگە ئايلاندۇرغىلى بولمىدى.

## Names

name-attribute-invalid =
    name='{ $name }' خاسلىقى ئىناۋەتسىز. { $reason ->
        [characters] ئىسىملاردا پەقەت ھەرپ، سان، ئاستى سىزىق ياكى سىزىقچە بولالايدۇ.
       *[start] ئىسىملار ھەرپ بىلەن باشلىنىشى كېرەك.
    }

component-name-invalid-start = بۆلەك ئىسمى "{ $name }" ئىناۋەتسىز. ئىسىملار ھەرپ بىلەن باشلىنىشى كېرەك.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched تىپىدىكى جاۋابتا video خاسلىقى بولۇشى كېرەك

answer-video-watched-video-not-reference = videoWatched تىپىدىكى جاۋابنىڭ video خاسلىقى نەقىل بولۇشى كېرەك

answer-name-not-single-text = جاۋابنىڭ name خاسلىقىدا بىرلا تېكىست بالىسى بولۇشى كېرەك

## Referencing another document

external-doenetml-recursion-limit = رېكۇرسىيە قەۋىتى بەك كۆپ بولغاچقا سىرتقى DoenetML نى ئالغىلى بولمىدى. دەۋرىي نەقىل بارمۇ؟

external-doenetml-unavailable = { $attribute }="{ $uri }" دىن DoenetML نى ئالغىلى بولمىدى

external-doenetml-type-mismatch = { $attribute }="{ $uri }" دىن ئېلىنغان DoenetML ئىناۋەتسىز: ئۇ "{ $componentType }" تىپىغا ماس كەلمەيدۇ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` خاسلىقى ۋاز كېچىلگەن؛ ئۇنىڭ ئورنىغا `{ $to }` نى ئىشلىتىڭ.
       *[other] [deprecation] `<{ $component }>` دىكى `{ $from }` خاسلىقى ۋاز كېچىلگەن؛ ئۇنىڭ ئورنىغا `{ $to }` نى ئىشلىتىڭ.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` خاسلىقى ۋاز كېچىلگەن ۋە پەرۋا قىلىنمىدى، چۈنكى `{ $to }` مۇ بەلگىلەنگەن.
       *[other] [deprecation] `<{ $component }>` دىكى `{ $from }` خاسلىقى ۋاز كېچىلگەن ۋە پەرۋا قىلىنمىدى، چۈنكى `{ $to }` مۇ بەلگىلەنگەن.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` دىكى `{ $attribute }` خاسلىقى ۋاز كېچىلگەن ۋە پەرۋا قىلىنمىدى.


## Language coverage

pluralize-english-only = `<pluralize>` پەقەت ئىنگلىزچە سۆزلەرنىلا كۆپلۈك قىلالايدۇ، شۇڭا { $locale } تىلىدا يېزىلغان ھۆججەتتە ئۇنىڭ تېكىستى ئۆزگەرمەي قالىدۇ. كۆپلۈك شەكلىنى بىۋاسىتە يېزىڭ، ياكى ئۇنى `pluralForm` خاسلىقى بىلەن بەلگىلەڭ.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` ئېلېمېنتى Doenet نىڭ تونۇلغان ئېلېمېنتى ئەمەس.

schema-element-not-allowed-at-root = `<{ $tag }>` ئېلېمېنتىغا ھۆججەتنىڭ يىلتىزىدا يول قويۇلمايدۇ.

schema-element-not-allowed-inside = `<{ $tag }>` ئېلېمېنتىغا `<{ $parent }>` ئىچىدە يول قويۇلمايدۇ.

schema-attribute-unrecognized = `<{ $tag }>` ئېلېمېنتىدا `{ $attribute }` ئىسىملىك خاسلىق يوق.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` ئېلېمېنتىنىڭ `{ $attribute }` خاسلىقى ھەر بىر ئەزاسى تۆۋەندىكىلەرنىڭ بىرى بولغان تىزىملىك بولۇشى كېرەك: { $allowed }
       *[other] `<{ $tag }>` ئېلېمېنتىنىڭ `{ $attribute }` خاسلىقى تۆۋەندىكىلەرنىڭ بىرى بولۇشى كېرەك: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ئۈچۈن ئىناۋەتسىز نۇسخا ئىسمى. نۇسخا ئىسمى { $variantName } { $numOptions } تاللانمىدا كۆرۈلىدۇ، بىراق تاللاش سانى { $numToSelect }.

select-variant-name-without-options = select ئۈچۈن بەزى نۇسخىلار بەلگىلەنگەن، بىراق مۇمكىن بولغان نۇسخا ئىسمى ئۈچۈن تاللانما بەلگىلەنمىگەن: { $variantName }.

select-variant-name-not-possible = select ئۈچۈن بەلگىلەنگەن نۇسخا ئىسمى { $variantName } مۇمكىن بولغان ئىسىم ئەمەس.

select-too-few-options = پەقەت { $numOptions } دىن { $numToSelect } بۆلەكنى تاللىغىلى بولمايدۇ.

select-from-sequence-too-few-values = ئۇزۇنلۇقى { $length } بولغان تىزمىدىن { $numToSelect } قىممەتنى تاللىغىلى بولمايدۇ.

select-from-sequence-indices-count-mismatch = select ئۈچۈن بەلگىلەنگەن تەرتىپ سانلىرىنىڭ سانى تاللاش سانىغا ماس كېلىشى كېرەك

select-from-sequence-indices-not-integers = select ئۈچۈن بەلگىلەنگەن بارلىق تەرتىپ سانلىرى پۈتۈن سان بولۇشى كېرەك

select-from-sequence-index-excluded = selectfromsequence نىڭ بەلگىلەنگەن تەرتىپ سانى چىقىرىۋېتىلگەن ئىدى

select-from-sequence-indices-excluded-combination = selectfromsequence نىڭ بەلگىلەنگەن تەرتىپ سانلىرى چىقىرىۋېتىلگەن بىرىكمە ئىدى

select-from-sequence-coprime-not-positive-integers = ئۆزئارا تۇتاش بىرىكمىلەرنى تاللىغىلى بولمايدۇ، چۈنكى تاللاش مۇسبەت پۈتۈن سانلاردىن ئەمەس.

select-from-sequence-coprime-common-factor = ئۆزئارا تۇتاش سانلارنى تاللىغىلى بولمايدۇ. بارلىق مۇمكىن قىممەتلەرنىڭ ئورتاق كۆپەيتكۈچىسى بار. ("from" ياكى "to" نىڭ بەلگىلەنگەن قىممىتى "step" بىلەن ئۆزئارا تۇتاش بولۇشى كېرەك.)

select-from-sequence-coprime-single-number = 1 بولمىغان يالغۇز ساندىن ئۆزئارا تۇتاش بىرىكمىلەرنى تاللىغىلى بولمايدۇ.

select-from-sequence-excluded-too-many-combinations = selectFromSequence دا بىرىكمىلەرنىڭ 70% دىن ئارتۇقى چىقىرىۋېتىلدى

select-from-sequence-coprime-none-found = ئۆزئارا تۇتاش سانلارنى تاللىغىلى بولمىدى. بارلىق مۇمكىن قىممەتلەرنىڭ ئورتاق كۆپەيتكۈچىسى بار.

select-from-sequence-too-few-unique-values = ئۇزۇنلۇقى { $numPossibleValues } بولغان تىزمىدىن { $numToSelect } يەككە قىممەتنى تاللىغىلى بولمايدۇ

select-prime-numbers-too-few-values = ئۇزۇنلۇقى { $numValues } بولغان تۈپ سانلار تىزىملىكىدىن { $numToSelect } قىممەتنى تاللىغىلى بولمايدۇ

select-prime-numbers-values-count-mismatch = select ئۈچۈن بەلگىلەنگەن قىممەتلەرنىڭ سانى تاللاش سانىغا ماس كېلىشى كېرەك

select-prime-numbers-values-not-prime = select prime number ئۈچۈن بەلگىلەنگەن بارلىق قىممەتلەر تۈپ سانلار تىزىملىكىدە بولۇشى كېرەك

select-prime-numbers-values-excluded-combination = selectPrimeNumbers نىڭ بەلگىلەنگەن قىممەتلىرى چىقىرىۋېتىلگەن بىرىكمە ئىدى

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers دا بىرىكمىلەرنىڭ 70% دىن ئارتۇقى چىقىرىۋېتىلدى

select-random-combination-fluke = ئىنتايىن ئاز ئۇچرايدىغان تاسادىپىيلىق تۈپەيلىدىن، تاسادىپىي قىممەتلەر بىرىكمىسىنى تاللىغىلى بولمىدى

select-random-value-fluke = ئىنتايىن ئاز ئۇچرايدىغان تاسادىپىيلىق تۈپەيلىدىن، تاسادىپىي قىممەتنى تاللىغىلى بولمىدى
