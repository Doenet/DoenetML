# Sinhala diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# A Sinhala noun standing after a numeral takes one form whatever the numeral
# is, so the counted messages here need no selection even though the language
# has two plural categories. Where the *verb* or the sentence would change for
# a count of one, that is a `[one]` branch — and Sinhala's `one` covers zero
# as well, which is why nothing here leans on it to say "no ...".

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = කෙළවර ලක්ෂ්‍ය දෙකම දක්වා ඇති විට { $attributes } නොසලකා හරිනු ලැබේ

line-segment-attributes-ignored-with-endpoint-and-midpoint = කෙළවර ලක්ෂ්‍යයක් සහ මධ්‍ය ලක්ෂ්‍යයක් යන දෙකම දක්වා ඇති විට { $attributes } නොසලකා හරිනු ලැබේ

line-segment-midpoint-offset-without-midpoint = මධ්‍ය ලක්ෂ්‍යයක් නොමැතිව midpointOffset කිසිදු බලපෑමක් නොකරයි

## `<line>`

line-points-undetermined-dimensions = මාන නොදන්නා ලක්ෂ්‍ය හරහා යන රේඛාවකි.

line-points-too-few-dimensions = රේඛාව අවම වශයෙන් මාන දෙකක් ඇති ලක්ෂ්‍ය හරහා යා යුතුය.

line-points-depend-on-variables = රේඛාව චරයන් මත රඳා පවතින ලක්ෂ්‍ය හරහා යයි: { $variables }.

line-equation-invalid-format = { $variable1 } සහ { $variable2 } චරයන්හි රේඛා සමීකරණයේ ආකෘතිය අවලංගුය.

## `<ray>`

ray-overprescribed-through = කිරණය through, endpoint සහ direction යන තුනෙන්ම නිර්ණය කර ඇත. දක්වා ඇති through නොසලකා හරිනු ලැබේ.

ray-dimension-mismatch = කිරණයේ numDimensions නොගැලපේ.

## `<vector>`

vector-overprescribed-head = දෛශිකය head, tail සහ displacement යන තුනෙන්ම නිර්ණය කර ඇත. දක්වා ඇති head නොසලකා හරිනු ලැබේ.

vector-dimension-mismatch = දෛශිකයේ numDimensions නොගැලපේ.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` වෙත ආකර්ෂණය කළ නොහැක, එයට nearestPoint තත්ත්ව චරයක් නොමැති බැවින්.

constrain-to-without-nearest-point = `<{ $component }>` වෙත සීමා කළ නොහැක, එයට nearestPoint තත්ත්ව චරයක් නොමැති බැවින්.

constrain-to-interior-without-nearest-point = `<{ $component }>` හි අභ්‍යන්තරයට සීමා කළ නොහැක, එයට nearestPoint තත්ත්ව චරයක් නොමැති බැවින්.

## `<choiceInput>`

choice-input-label-position-ignored = inline නොවන choiceInput සඳහා labelPosition නොසලකා හරිනු ලැබේ

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput සඳහා දක්වා ඇති indices නොසලකා හරිනු ලැබේ, indices ගණන choice උප මූලද්‍රව්‍ය ගණනට නොගැලපෙන බැවින්.

pretzel-indices-count-mismatch = problem සඳහා දක්වා ඇති indices නොසලකා හරිනු ලැබේ, indices ගණන problem උප මූලද්‍රව්‍ය ගණනට නොගැලපෙන බැවින්.

shuffle-indices-count-mismatch = shuffle සඳහා දක්වා ඇති indices නොසලකා හරිනු ලැබේ, indices ගණන සංරචක ගණනට නොගැලපෙන බැවින්.

indices-ignored-out-of-range = { $component } සඳහා දක්වා ඇති indices නොසලකා හරිනු ලැබේ, සමහර indices පරාසයෙන් පිටත බැවින්.

pretzel-indices-repeated = pretzel සඳහා දක්වා ඇති indices නොසලකා හරිනු ලැබේ, සමහර indices නැවත නැවත ඇති බැවින්.

pretzel-circuit-first-index = circuit ආකාරයේ pretzel සඳහා දක්වා ඇති indices නොසලකා හරිනු ලැබේ, පළමු index එක 1 විය යුතු බැවින්.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` අක්ෂර මාලා උප මූලද්‍රව්‍ය සමඟ ක්‍රියා කිරීමට නම් `type` උපලක්ෂණය දැක්විය යුතුය.

invalid-type-defaulting-to-math = { $component } සංරචකය සඳහා { $type } යන type අවලංගුය. එය math, text, number හෝ boolean විය යුතුය. math වෙත පෙරනිමි වේ.

string-not-valid-component-to-arrange = "{ $value }" යන අක්ෂර මාලාව { $component } සඳහා වලංගු සංරචකයක් නොවේ. නොසලකා හරිනු ලැබේ.

## Types and variables

invalid-type-defaulting-to-number = { $type } යන type අවලංගුය, type එක number ලෙස සකසනු ලැබේ.

invalid-variable-value = චරයක අවලංගු අගයකි: `{ $value }`

## Variants

variant-index-must-be-number = { $index } යන variant index එක සංඛ්‍යාවක් විය යුතුය

variant-index-must-be-integer = { $index } යන variant index එක පූර්ණ සංඛ්‍යාවක් විය යුතුය

## `<sideBySide>`

side-by-side-absolute-widths = නිරපේක්ෂ මිනුම් සඳහා `<{ $component }>` ක්‍රියාත්මක කර නොමැත. පළල සාපේක්ෂ ලෙස සකසනු ලැබේ.

side-by-side-absolute-margins = නිරපේක්ෂ මිනුම් සඳහා `<{ $component }>` ක්‍රියාත්මක කර නොමැත. මායිම් සාපේක්ෂ ලෙස සකසනු ලැබේ.

side-by-side-no-block-child = අවලංගු `<{ $component }>`: එයට අවම වශයෙන් එක් බ්ලොක් උප මූලද්‍රව්‍යයක් තිබිය යුතුය.

## `<label>`

label-for-ignored-on-graphical = ග්‍රැෆික `<label>` මත ඇති `for` උපලක්ෂණය නොසලකා හරිනු ලැබේ.

label-for-must-resolve-to-one = `<label>` මත ඇති `for` උපලක්ෂණය හරියටම එක් සංරචකයකට යොමු විය යුතුය.

label-for-unresolved = `<label>` මත ඇති `for` උපලක්ෂණය කිසිදු සංරචකයකට යොමු කළ නොහැකි විය.

label-for-answer-with-authored-inputs = `<label>` මත ඇති `for` උපලක්ෂණය කතුවරයා විසින්ම ලියූ ආදාන සහිත `<answer>` එකකට යොමු වේ; ආදානයට කෙලින්ම යොමු වන්න.

label-for-answer-without-input = `<label>` මත ඇති `for` උපලක්ෂණය ලේබල් කිරීමට ආදානයක් නොමැති `<answer>` එකකට යොමු වේ.

label-for-must-reference-input-or-answer = `<label>` මත ඇති `for` උපලක්ෂණය ආදානයකට හෝ answer එකකට යොමු විය යුතුය.

## Accessibility

accessibility-short-description-or-decorative = ප්‍රවේශ්‍යතාව සඳහා `<{ $component }>` හට කෙටි විස්තරයක් තිබිය යුතුය, නැතහොත් එය අලංකාරය සඳහා යැයි දැක්විය යුතුය.

accessibility-video-short-description = ප්‍රවේශ්‍යතාව සඳහා `<video>` හට කෙටි විස්තරයක් තිබිය යුතුය.

accessibility-input-short-description-or-label = ප්‍රවේශ්‍යතාව සඳහා `<{ $component }>` හට කෙටි විස්තරයක් හෝ ලේබලයක් තිබිය යුතුය.

accessibility-answer-input-short-description-or-label = ප්‍රවේශ්‍යතාව සඳහා ආදානයක් සාදන `<answer>` එකකට කෙටි විස්තරයක් හෝ ලේබලයක් තිබිය යුතුය.

accessibility-short-description-contains-math = කෙටි විස්තරවල `<{ $component }>` වැනි ගණිත සංරචක නොතිබිය යුතුය. ගණිතය වචනවලින් ලියන්න.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] කොටසේ ශීර්ෂ පාඨය සඳහා { $colorName } හි ප්‍රතිසමතාව ප්‍රමාණවත් නොවේ (අඳුරු ආකාරය) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; අවම වශයෙන් { $threshold }:1 අවශ්‍යයි).
       *[other] කොටසේ ශීර්ෂ පාඨය සඳහා { $colorName } හි ප්‍රතිසමතාව ප්‍රමාණවත් නොවේ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; අවම වශයෙන් { $threshold }:1 අවශ්‍යයි).
    }

## `<circle>`

circle-through-points-non-numerical = ලක්ෂ්‍යවලට සංඛ්‍යාත්මක අගයන් නොමැති අවස්ථාවේ ලක්ෂ්‍ය { $count } හරහා යන `<circle>` ක්‍රියාත්මක කර නොමැත.

circle-too-many-through-points = ලක්ෂ්‍ය 3කට වඩා හරහා යන වෘත්තයක් ගණනය කළ නොහැක.

circle-overprescribed-radius-center-points = දක්වා ඇති අරය, කේන්ද්‍රය සහ ලක්ෂ්‍ය සමඟ වෘත්තයක් ගණනය කළ නොහැක.

circle-center-with-multiple-points = දක්වා ඇති කේන්ද්‍රය සමඟ ලක්ෂ්‍ය 1කට වඩා හරහා යන වෘත්තයක් ගණනය කළ නොහැක.

circle-radius-too-small = වෘත්තය ගණනය කළ නොහැක: ලක්ෂ්‍ය දෙක අතර දුර { $distance } වන බැවින්, දක්වා ඇති අරය { $radius } ඉතා කුඩාය.

circle-radius-with-many-points = දක්වා ඇති අරයක් සමඟ ලක්ෂ්‍ය දෙකකට වඩා හරහා යන වෘත්තයක් සෑදිය නොහැක.

circle-invalid-center-or-through-points = වෘත්තයේ කේන්ද්‍රය හෝ එය හරහා යන ලක්ෂ්‍ය අවලංගුය.

circle-radius-center-with-multiple-points = දක්වා ඇති කේන්ද්‍රය සමඟ ලක්ෂ්‍ය 1කට වඩා හරහා යන වෘත්තයේ අරය ගණනය කළ නොහැක.

circle-change-radius-non-numerical = සංඛ්‍යාත්මක නොවන ලක්ෂ්‍ය හරහා යන වෘත්තයක අරය වෙනස් කළ නොහැක

circle-radius-with-points-non-numerical = සංඛ්‍යාත්මක අගයන් නොමැති විට දක්වා ඇති අරයක් සමඟ ලක්ෂ්‍ය එකකට වඩා හරහා යන වෘත්තයක් සෑදිය නොහැක.

circle-change-center-non-numerical = සංඛ්‍යාත්මක නොවන ලක්ෂ්‍ය හරහා යන වෘත්තයක කේන්ද්‍රය වෙනස් කිරීම ක්‍රියාත්මක කර නොමැත.

## `<function>`

function-domain-insufficient-dimensions = ශ්‍රිතයේ ප්‍රාන්තය සඳහා මාන ප්‍රමාණවත් නොවේ. ප්‍රාන්තයේ අන්තර { $intervals }ක් ඇත, නමුත් ශ්‍රිතයට ආදාන { $inputs }ක් ඇත.

function-domain-invalid-format = ශ්‍රිතයේ ප්‍රාන්තයේ ආකෘතිය අවලංගුය.

function-ignoring-non-numerical =
    { $type ->
        [maximum] ශ්‍රිතයේ සංඛ්‍යාත්මක නොවන උපරිමය නොසලකා හරිනු ලැබේ.
        [minimum] ශ්‍රිතයේ සංඛ්‍යාත්මක නොවන අවමය නොසලකා හරිනු ලැබේ.
        [extremum] ශ්‍රිතයේ සංඛ්‍යාත්මක නොවන අන්ත අගය නොසලකා හරිනු ලැබේ.
        [point] ශ්‍රිතයේ සංඛ්‍යාත්මක නොවන ලක්ෂ්‍යය නොසලකා හරිනු ලැබේ.
        [slope] ශ්‍රිතයේ සංඛ්‍යාත්මක නොවන අනුක්‍රමණය නොසලකා හරිනු ලැබේ.
       *[other] ශ්‍රිතයේ සංඛ්‍යාත්මක නොවන { $type } නොසලකා හරිනු ලැබේ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] ශ්‍රිතයේ හිස් උපරිමය නොසලකා හරිනු ලැබේ.
        [minimum] ශ්‍රිතයේ හිස් අවමය නොසලකා හරිනු ලැබේ.
        [extremum] ශ්‍රිතයේ හිස් අන්ත අගය නොසලකා හරිනු ලැබේ.
        [point] ශ්‍රිතයේ හිස් ලක්ෂ්‍යය නොසලකා හරිනු ලැබේ.
       *[other] ශ්‍රිතයේ හිස් { $type } නොසලකා හරිනු ලැබේ.
    }

function-points-too-close = ශ්‍රිතයේ එකිනෙකට ඉතා ළඟින් පිහිටි ලක්ෂ්‍ය දෙකක් ඇත. ශ්‍රිතය නිර්වචනය කළ නොහැක.

function-iterates-input-output-mismatch = ශ්‍රිත පුනරාවර්තන කළ හැක්කේ ශ්‍රිතයේ ආදාන ගණන ප්‍රතිදාන ගණනට සමාන නම් පමණි. මෙම ශ්‍රිතයට ආදාන { $inputs }ක් සහ ප්‍රතිදාන { $outputs }ක් ඇත.

## `<sequence>`

sequence-invalid-length = අනුක්‍රමයේ දිග අවලංගුය. එය ඍණ නොවන පූර්ණ සංඛ්‍යාවක් විය යුතුය.

sequence-invalid-step = අනුක්‍රමයේ පියවර අවලංගුය. { $type } වර්ගයේ අනුක්‍රමයක් සඳහා එය සංඛ්‍යාවක් විය යුතුය.

sequence-invalid-endpoint-number = සංඛ්‍යා අනුක්‍රමයේ "{ $attribute }" අවලංගුය. එය සංඛ්‍යාවක් විය යුතුය.

sequence-invalid-endpoint-letters = අක්ෂර අනුක්‍රමයේ "{ $attribute }" අවලංගුය. එය අක්ෂර සංයෝගයක් විය යුතුය.

sequence-invalid-endpoint = අනුක්‍රමයේ "{ $attribute }" අවලංගුය.

select-from-sequence-coprime-not-numbers = සංඛ්‍යා තෝරා නොගන්නා බැවින් coprime නොසලකා හරිනු ලැබේ

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations දක්වා ඇති බැවින් coprime නොසලකා හරිනු ලැබේ

## Resolving a `target`

target-not-found = `<{ $source }>` සඳහා අවලංගු target: target සොයාගත නොහැක.

target-state-variable-not-found = `<{ $source }>` සඳහා අවලංගු target: `<{ $component }>` මත "{ $property }" නමැති තත්ත්ව චරයක් සොයාගත නොහැක.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` හි චරයන් ස්වායත්ත චරයට වඩා වෙනස් විය යුතුය.

ode-system-duplicate-variable-names = එකම පරාධීන චර නාම දෙකක් සමඟ ODE දකුණු පස ශ්‍රිත නිර්වචනය කළ නොහැක.

ode-system-rhs-function-error = ODE දකුණු පස ශ්‍රිතය නිර්වචනය කළ නොහැක. mathjs ශ්‍රිතය සෑදීමේදී දෝෂයකි.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = රේඛා { $count }ක් අතර කෝණයක් නිර්වචනය කළ නොහැක

angle-invalid-through-point = `<angle>` හි through තුළ අවලංගු ලක්ෂ්‍යයකි

parabola-vertex-too-many-points = ශීර්ෂයක් සමඟ ලක්ෂ්‍ය 1කට වඩා හරහා යන පරාවලයක් ක්‍රියාත්මක කර නොමැත.

parabola-too-many-points = ලක්ෂ්‍ය 3කට වඩා හරහා යන පරාවලයක් ක්‍රියාත්මක කර නොමැත.

intersection-too-many-items = අයිතම දෙකකට වඩා සඳහා ඡේදනය ක්‍රියාත්මක කර නොමැත

## Other math components

ionic-compound-not-two-ions = අයන දෙකක් හැර වෙනත් කිසිවක් සඳහා අයනික සංයෝගය ක්‍රියාත්මක කර නොමැත.

ionic-compound-needs-cation-and-anion = අයනික සංයෝගය ක්‍රියාත්මක වන්නේ එක් කැටායනයක් සහ එක් ඇනායනයක් සඳහා පමණි.

solve-equations-cannot-evaluate = සමීකරණය ඇගයිය නොහැකි වූ බැවින් එය විසඳිය නොහැක: { $equation }

math-operators-operand-number-required = ගණිත මෙහෙයුම් පදයක් උපුටා ගැනීමේදී operandNumber දැක්විය යුතුය.

eigen-decomposition-failed = න්‍යාසයේ අයිගන් අගයන් ගණනය කළ නොහැකි විය

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } යන පරාමිතිය රටාවේ නොමැති බැවින්, එය සැමවිටම හිස් අගයකට ගැලපේ.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" අර්ථ නිරූපණය කළ නොහැක. එය none, medium, dense හෝ ඉඩකින් වෙන් කළ ධන සංඛ්‍යා දෙකක් විය යුතුය, උදා: grid="1 0.5". ජාලකයක් නොඅඳිනු ලැබේ.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure විදහාපාන්නා තුළ xLabelPosition="left" සහාය නොදක්වයි; දකුණු පස පිහිටීමේ හැසිරීම භාවිතා වේ.

prefigure-y-label-position-unsupported = `<graph>`: prefigure විදහාපාන්නා තුළ yLabelPosition="bottom" සහාය නොදක්වයි; ඉහළ පිහිටීමේ හැසිරීම භාවිතා වේ.

prefigure-invalid-axis-bounds = `<graph>`: prefigure බවට පරිවර්තනය සඳහා අක්ෂ සීමා අවලංගුය; පෙරනිමි bbox (-10,-10,10,10) භාවිතා වේ.

prefigure-invalid-width = `<graph>`: prefigure බවට පරිවර්තනය සඳහා පළල අවලංගුය; පෙරනිමි රූප සටහන් පළල 425 භාවිතා වේ.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure බවට පරිවර්තනය සඳහා aspectRatio අවලංගුය; පෙරනිමි අනුපාතය 1 භාවිතා වේ.

prefigure-grid-spacing-too-fine = `<graph>`: අක්ෂ සීමා සඳහා ජාලක පරතරය ඉතා සියුම්ය; prefigure විදහාපාන්නා තුළ ජාලකය ඉවත් කරනු ලැබේ.

prefigure-annotations-not-rendered = `<graph>`: PreFigure විදහාපාන්නා භාවිතා නොකරන විට විවරණ නොපෙන්වනු ලැබේ.

multiple-annotations-children = `<graph>` තුළ `<annotations>` උප මූලද්‍රව්‍ය කිහිපයක් හමු විය; අවසාන එක හැර සියල්ල නොසලකා හරිනු ලැබේ.

## Referring to other components

copy-unrecognized-component-type = හඳුනා නොගත් සංරචක වර්ගයක් දිගු කිරීමට හෝ පිටපත් කිරීමට නොහැක: { $type }.

copy-prop-not-found = { $component } වර්ගයේ සංරචකයක { $property } නමැති prop එක සොයාගත නොහැක

collect-no-source = collect සඳහා මූලාශ්‍රයක් හමු නොවීය.

collect-invalid-component-type = `<{ $component }>` වර්ගයේ සංරචක එකතු කළ නොහැක, එය අවලංගු සංරචක වර්ගයක් බැවින්.

reference-index-unavailable = `{ $reference }` යන index එකට යොමු විය නොහැක

## `<callAction>`

component-action-unavailable = `{ $reference }` සංරචකය මත { $action } ඇමතිය නොහැක

## `<dataFrame>`

data-frame-inconsistent-row-lengths = දත්තවල හැඩය අවලංගුය. පේළිවල දිග අසමානය. componentIdx :{ $componentIdx } හි හමු විය

data-frame-duplicate-column-names = දත්තවල එකම තීරු නාම දෙකක් ඇත. componentIdx :{ $componentIdx } හි හමු විය

data-frame-missing-column-name = දත්තවල තීරු නාමයක් නොමැත. componentIdx :{ $componentIdx } හි හමු විය

## `<answer>` and scoring

answer-award-depends-on-own-response = මෙම පිළිතුර සඳහා වන award එක answer ටැගයේම යොමු කළ පිළිතුර මත පදනම් වේ, එය අනපේක්ෂිත හැසිරීමකට හේතු වේ.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` සහිත බහාලුමක් තුළ ඇති `<answer>` එකක් මත `maxNumAttempts` සැකසීම කිසිදු බලපෑමක් නොකරයි, උත්සාහ ගණන බහාලුම විසින් පාලනය වන බැවින්. ඒ වෙනුවට බහාලුම මත `maxNumAttempts` සකසන්න.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` සහිත තවත් බහාලුමක් තුළ ඇති `sectionWideCheckWork` සහිත බහාලුමක් මත `maxNumAttempts` සැකසීම කිසිදු බලපෑමක් නොකරයි, උත්සාහ ගණන පිටත බහාලුම විසින් පාලනය වන බැවින්. ඒ වෙනුවට පිටත බහාලුම මත `maxNumAttempts` සකසන්න.

answer-attributes-need-symbolic-equality = symbolicEquality සකසා නොමැතිව { $attributes } උපලක්ෂණය කිසිදු බලපෑමක් නොකරයි.

answer-invalid-type = answer සඳහා අවලංගු වර්ගයකි: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` සංරචකයට නමක් නොමැති බැවින්, එය module උපලක්ෂණයක් ලෙස භාවිතා කළ නොහැක

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` සංරචකය module එකක උපලක්ෂණයක් ලෙස භාවිතා කළ නොහැක, `<module>` සංරචක වර්ගයට දැනටමත් "{ $name }" උපලක්ෂණයක් නිර්වචනය කර ඇති බැවින්.

conditional-content-condition-ignored = case හෝ else උප මූලද්‍රව්‍ය සහිත `<conditionalContent>` සංරචකයක් මත `condition` උපලක්ෂණය නොසලකා හරිනු ලැබේ.

slider-markers-type-mismatch = සලකුණු වර්ගය slider වර්ගයට නොගැලපේ.

pretzel-problem-needs-statement-and-answer = අවලංගු pretzel: සෑම `<problem>` එකකම `<statement>` එකක් සහ `<answer>` එකක් තිබිය යුතුය.

pretzel-circuit-first-problem-distractor = අවලංගු pretzel: mode="circuit" තුළ පළමු `<problem>` එක distractor එකක් විය නොහැක.

## Attribute values

attribute-invalid-values = `{ $attribute }` උපලක්ෂණය සඳහා { $values } අවලංගු අගයකි; නොසලකා හරිනු ලැබේ.

attribute-must-be-references = `{ $attribute }` උපලක්ෂණය සඳහා `{ $value }` අවලංගු අගයකි. උපලක්ෂණය `$` කින් ආරම්භ වන යොමු වලින් සැදිය යුතුය.

math-input-invalid-function-names = <mathInput>: { $attribute } තුළ අවලංගු ශ්‍රිත නාම නොසලකා හරින ලදී: { $names }. සෑම නමකම දර්ශන කොටස අවම වශයෙන් අක්ෂර 2ක් (අකුරු හෝ ඉරි) විය යුතුය; අවශ්‍ය නම් `|<mathspeak alternative>` යන පසුබැඳුම යෙදිය හැක.

## Building components from the source

component-type-invalid = අවලංගු සංරචක වර්ගයකි: `<{ $componentType }>`

attribute-repeated = { $attribute } උපලක්ෂණය නැවත යෙදිය නොහැක.

attribute-invalid-for-component = `<{ $componentType }>` වර්ගයේ සංරචකයක් සඳහා "{ $attribute }" උපලක්ෂණය අවලංගුය.

## Style definition contrast

style-definition-insufficient-contrast =
    ශෛලි නිර්වචනය { $styleNumber } හි { $context ->
        [text-on-background] පසුබිම් වර්ණයට එරෙහිව පාඨ වර්ණය
        [high-contrast] කැන්වසයට එරෙහිව ඉහළ ප්‍රතිසමතා වර්ණය
        [line] කැන්වසයට එරෙහිව රේඛා වර්ණය
        [marker] කැන්වසයට එරෙහිව සලකුණු වර්ණය
       *[text-on-canvas] කැන්වසයට එරෙහිව පාඨ වර්ණය
    } සඳහා ප්‍රතිසමතාව ප්‍රමාණවත් නොවේ{ $mode ->
        [dark] { " (අඳුරු ආකාරය)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; අවම වශයෙන් { $threshold }:1 අවශ්‍යයි).

style-definition-dark-mode-text-background-contrast =
    ශෛලි නිර්වචනය { $styleNumber } ආලෝකමත් ආකාරය සඳහා ප්‍රමාණවත් ප්‍රතිසමතාවක් ඇති වර්ණ දක්වා තිබුණද, එම අගයන්ගෙන් ව්‍යුත්පන්න වූ අඳුරු ආකාරයේ වර්ණවල පසුබිම් වර්ණයට එරෙහිව පාඨ වර්ණය සඳහා ප්‍රතිසමතාව ප්‍රමාණවත් නොවේ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; අවම වශයෙන් { $threshold }:1 අවශ්‍යයි). { $suggestion ->
        [available] අඳුරු ආකාරයේ ප්‍රමාණවත් ප්‍රතිසමතාවක් සහතික කිරීමට, ආලෝකමත් ආකාරයේ ප්‍රතිසමතාව වැඩි කරන්න (උදා: { $lightAttribute }="{ $lightColor }" ලෙස සකසන්න) හෝ අඳුරු ආකාරයේ වර්ණය ප්‍රතිස්ථාපනය කරන්න (උදා: { $darkAttribute }="{ $darkColor }" ලෙස සකසන්න).
       *[none] අඳුරු ආකාරයේ ප්‍රමාණවත් ප්‍රතිසමතාවක් සහතික කිරීමට, ආලෝකමත් ආකාරයේ ප්‍රතිසමතාව වැඩි කරන්න හෝ ව්‍යුත්පන්න වර්ණ textColorDarkMode සහ/හෝ backgroundColorDarkMode මගින් ප්‍රතිස්ථාපනය කරන්න.
    }

style-definition-dark-mode-text-canvas-contrast =
    ශෛලි නිර්වචනය { $styleNumber } ආලෝකමත් ආකාරය සඳහා ප්‍රමාණවත් ප්‍රතිසමතාවක් ඇති පාඨ වර්ණයක් දක්වා තිබුණද, එම අගයෙන් ව්‍යුත්පන්න වූ අඳුරු ආකාරයේ පාඨ වර්ණයේ කැන්වසයට එරෙහිව ප්‍රතිසමතාව ප්‍රමාණවත් නොවේ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; අවම වශයෙන් { $threshold }:1 අවශ්‍යයි). { $suggestion ->
        [available] අඳුරු ආකාරයේ ප්‍රමාණවත් ප්‍රතිසමතාවක් සහතික කිරීමට, ආලෝකමත් ආකාරයේ ප්‍රතිසමතාව වැඩි කරන්න (උදා: textColor="{ $lightColor }" ලෙස සකසන්න) හෝ අඳුරු ආකාරයේ වර්ණය ප්‍රතිස්ථාපනය කරන්න (උදා: textColorDarkMode="{ $darkColor }" ලෙස සකසන්න).
       *[none] අඳුරු ආකාරයේ ප්‍රමාණවත් ප්‍රතිසමතාවක් සහතික කිරීමට, ආලෝකමත් ආකාරයේ ප්‍රතිසමතාව වැඩි කරන්න හෝ ව්‍යුත්පන්න වර්ණය textColorDarkMode මගින් ප්‍රතිස්ථාපනය කරන්න.
    }

section-multiple-style-palettes = කොටසකට තෝරාගත හැක්කේ එක් <stylePalette> එකක් පමණි; අවසාන එක භාවිතා වේ.

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect ඍණ නොවන පූර්ණ සංඛ්‍යාවක් නොවන බැවින් { $component } හි අනන්‍ය variant නිර්ණය කළ නොහැක.

variant-num-to-select-not-constant-number = numToSelect නියත සංඛ්‍යාවක් නොවන බැවින් { $component } හි අනන්‍ය variant නිර්ණය කළ නොහැක.

variant-with-replacement-not-constant-boolean = withReplacement නියත boolean අගයක් නොවන බැවින් { $component } හි අනන්‍ය variant නිර්ණය කළ නොහැක.

variant-select-weight-disables-unique = selectWeight හෝ selectForVariants දක්වා ඇති option එකක් තිබේ නම් select සඳහා අනන්‍ය variant අක්‍රිය වේ

variant-coprime-undetermined = coprime සැමවිටම අසත්‍ය බව නිර්ණය කළ නොහැකි බැවින් { $component } හි අනන්‍ය variant නිර්ණය කළ නොහැක.

variant-attribute-not-constant = { $attribute } නියතයක් නොවන බැවින් { $component } හි අනන්‍ය variant නිර්ණය කළ නොහැක.

variant-attribute-not-number = { $attribute } සංඛ්‍යාවක් නොවන බැවින් { $component } හි අනන්‍ය variant නිර්ණය කළ නොහැක.

variant-attribute-wrong-type-for-sequence =
    { $attribute } { $expected ->
        [letters-combination] අක්ෂර සංයෝගයක්
        [math-expression] වලංගු ගණිත ප්‍රකාශනයක්
        [integer] පූර්ණ සංඛ්‍යාවක්
       *[number] සංඛ්‍යාවක්
    } නොවන බැවින් { $type } වර්ගයේ { $component } හි අනන්‍ය variant නිර්ණය කළ නොහැක.

variant-length-not-integer = length පූර්ණ සංඛ්‍යාවක් නොවන බැවින් { $component } හි අනන්‍ය variant නිර්ණය කළ නොහැක.

variant-sort-not-implemented = sort සහිත { $component } එකක අනන්‍ය variant ක්‍රියාත්මක කර නොමැත

variant-exclude-combinations-not-implemented = excludeCombinations සහිත { $component } එකක අනන්‍ය variant ක්‍රියාත්මක කර නොමැත

variant-math-exclude-not-implemented = exclude සහිත math වර්ගයේ { $component } එකක අනන්‍ය variant ක්‍රියාත්මක කර නොමැත

variant-non-constant-exclude-not-implemented = නියත නොවන exclude සහිත { $component } එකක අනන්‍ය variant ක්‍රියාත්මක කර නොමැත

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ප්‍රස්තාර prefigure විදහාපාන්නා තුළ සහාය නොදක්වයි; පහළ මූලද්‍රව්‍යය මඟ හරිනු ලැබේ.

prefigure-descendant-invalid-geometry = { $subject }: අනන්ත හෝ අසම්පූර්ණ ජ්‍යාමිතියකි; පහළ මූලද්‍රව්‍යය මඟ හරිනු ලැබේ.

prefigure-curve-label-omitted = { $subject }: පරිවර්තිත වක්‍ර මූලද්‍රව්‍ය මත ලේබල සහාය නොදක්වයි; ලේබලය ඉවත් කරනු ලැබේ.

prefigure-curve-unsupported-definition-type = { $subject }: '{ $definitionType }' යන වක්‍ර ශ්‍රිත නිර්වචන වර්ගය සහාය නොදක්වයි; පහළ මූලද්‍රව්‍යය මඟ හරිනු ලැබේ.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves මත flipFunctions උපලක්ෂණය සහාය නොදක්වයි; පහළ මූලද්‍රව්‍යය මඟ හරිනු ලැබේ.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves මත සහාය දක්වන්නේ සූත්‍ර වර්ගයේ උප මූලද්‍රව්‍ය ශ්‍රිත පමණි; පහළ මූලද්‍රව්‍යය මඟ හරිනු ලැබේ.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] රේඛා පවුලේ ලේබලය
       *[point] ලක්ෂ්‍ය ලේබලය
    } සඳහා '{ $labelPosition }' යන labelPosition සහාය නොදක්වයි; පෙරනිමි PreFigure පෙළගැස්ම භාවිතා වේ.

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' යන පිරවුම් ශෛලියට PreFigure සහාය නොදක්වයි; ඒ වෙනුවට ඝන පිරවුමක් භාවිතා වේ.

prefigure-line-style-unknown = { $subject }: '{ $lineStyle }' යන නොදන්නා රේඛා ශෛලිය PreFigure ප්‍රතිදානයෙන් ඉවත් කරන ලදී.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' යන සලකුණු ශෛලිය PreFigure හි 'diamond' ශෛලියට සිතියම්ගත කරන ලදී.

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' යන සලකුණු ශෛලියට PreFigure සහාය නොදක්වයි; පෙරනිමි ශෛලිය භාවිතා වේ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: අවලංගු `ref`; ඉලක්කය සොයාගත නොහැක. විවරණය ඉවත් කරනු ලැබේ.

annotation-ref-multiple-targets = `<annotation>`: `ref` ඉලක්ක කිහිපයකට යොමු විය; පළමු ඉලක්කය භාවිතා වේ.

annotation-ref-outside-graph = `<annotation>`: අවලංගු `ref`; ඉලක්කය අඩංගු ප්‍රස්තාරයෙන් පිටත ය. විවරණය ඉවත් කරනු ලැබේ.

annotation-ref-unsupported-target = `<annotation>`: අවලංගු `ref`; ඉලක්කය prefigure පරිවර්තනයේ සහාය දක්වන ග්‍රැෆික වස්තුවක් නොවේ. විවරණය ඉවත් කරනු ලැබේ.

annotation-text-missing = `<annotation>`: `text` නොමැත හෝ හිස්ය; හිස් පෙළක් නිකුත් කරනු ලැබේ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] චක්‍රීය පරාධීනතාවක් හඳුනාගන්නා ලදී.
       *[other] `<{ $componentType }>` සංරචකය ඇතුළත් චක්‍රීය පරාධීනතාවක් හඳුනාගන්නා ලදී.
    }

reference-no-referent = යොමුව සඳහා යොමු වන දෙයක් හමු නොවීය: `{ $reference }`

reference-multiple-referents = යොමුව සඳහා යොමු වන දේවල් කිහිපයක් හමු විය: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` හි { $attribute } උපලක්ෂණයේ ආකෘතිය අවලංගුය.

children-invalid = `<{ $componentType }>` සඳහා අවලංගු උප මූලද්‍රව්‍ය: අවලංගු උප මූලද්‍රව්‍ය හමු විය: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` උපලක්ෂණය සඳහා `{ $value }` අවලංගු අගයකි, `{ $default }` අගය භාවිතා වේ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML අනුවාදය { $version } හමු නොවීය.
       *[other] DoenetML අනුවාදය { $version } හමු නොවීය. ඒ වෙනුවට { $fallback } අනුවාදය භාවිතා වේ
    }

## Reading the DoenetML

parse-invalid-doenetml = අවලංගු DoenetML: { $content }

parse-tag-missing-close-tag = අවලංගු DoenetML: `{ $tag }` ටැගයට වසන ටැගයක් නොමැත. ස්වයං-වසන ටැගයක් හෝ `</{ $tagName }>` ටැගයක් අපේක්ෂා කෙරේ.

parse-tag-error = අවලංගු DoenetML: `<{ $tagName }>` ටැගයේ දෝෂයකි

parse-attribute-missing-value = අවලංගු DoenetML: `{ $attribute }` යන අවලංගු උපලක්ෂණයට අගයක් නොමැති බව පෙනේ.

parse-attribute-invalid = අවලංගු DoenetML: `{ $attribute }` යනු අවලංගු උපලක්ෂණයකි

parse-attribute-value-invalid = අවලංගු DoenetML: `{ $value }` යනු අවලංගු උපලක්ෂණ අගයකි

parse-attribute-value-quote-mismatch = අවලංගු DoenetML: `{ $value }` යනු අවලංගු උපලක්ෂණ අගයකි. උද්ධෘත ලකුණු නොගැලපේ. `{ $quote }` එකක් නොමැති බව පෙනේ

parse-open-tag-name-missing = අවලංගු DoenetML: ටැග නාමයක් නොමැති ටැගයක් හමු විය, උදා: `<`

parse-tag-not-closed = අවලංගු DoenetML: `{ $tag }` ටැගය වසා නොමැත (`>` එකක් නොමැති බව පෙනේ).

parse-self-closing-tag-name-missing = අවලංගු DoenetML: ටැග නාමයක් නොමැති ටැගයක් හමු විය `<{ $content }>`

parse-self-closing-tag-not-closed = අවලංගු DoenetML: `{ $tag }` ටැගය වසා නොමැත (`/>` නොමැති බව පෙනේ).

parse-tag-invalid-attributes = අවලංගු DoenetML: `{ $tag }` ටැගය වලංගු නොවේ. එහි වැරදි උපලක්ෂණ තිබිය හැක.

parse-close-tag-name-missing = අවලංගු DoenetML: ටැග නාමයක් නොමැති වසන ටැගයක් හමු විය, උදා: `</`

parse-attribute-value-unquoted = උපලක්ෂණ අගයන් උද්ධෘත ලකුණු තුළ තිබිය යුතුය: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = අවලංගු DoenetML: `{ $tag }` වසන ටැගය හමු විය, නමුත් ඊට අනුරූප විවෘත ටැගයක් නොමැත

parse-close-tag-mismatched = අවලංගු DoenetML: වසන ටැගය නොගැලපේ. `</{ $expected }>` අපේක්ෂා කෙරිණි. `{ $found }` හමු විය

parser-node-unconvertible = { $node } නෝඩය Dast නෝඩයක් බවට පරිවර්තනය කළ නොහැකි විය.

## Names

name-attribute-invalid =
    අවලංගු උපලක්ෂණයකි name='{ $name }'. { $reason ->
        [characters] නාමවල අකුරු, ඉලක්කම්, යටි ඉරි හෝ ඉරි පමණක් තිබිය හැක.
       *[start] නාම අකුරකින් ආරම්භ විය යුතුය.
    }

component-name-invalid-start = "{ $name }" යනු අවලංගු සංරචක නාමයකි. නාම අකුරකින් ආරම්භ විය යුතුය.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched වර්ගයේ answer එකකට video උපලක්ෂණයක් තිබිය යුතුය

answer-video-watched-video-not-reference = videoWatched වර්ගයේ answer එකක video උපලක්ෂණය යොමුවක් විය යුතුය

answer-name-not-single-text = answer හි name උපලක්ෂණයට තනි පෙළ උප මූලද්‍රව්‍යයක් තිබිය යුතුය

## Referencing another document

external-doenetml-recursion-limit = පුනරාවර්තන මට්ටම් ඉතා වැඩි බැවින් බාහිර DoenetML ලබාගත නොහැක. චක්‍රීය යොමුවක් තිබේද?

external-doenetml-unavailable = { $attribute }="{ $uri }" වෙතින් DoenetML ලබාගත නොහැක

external-doenetml-type-mismatch = { $attribute }="{ $uri }" වෙතින් ලබාගත් DoenetML අවලංගුය: එය "{ $componentType }" සංරචක වර්ගයට නොගැලපිණි

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` උපලක්ෂණය අත්හැර දමා ඇත; ඒ වෙනුවට `{ $to }` භාවිතා කරන්න.
       *[other] [deprecation] `<{ $component }>` මත ඇති `{ $from }` උපලක්ෂණය අත්හැර දමා ඇත; ඒ වෙනුවට `{ $to }` භාවිතා කරන්න.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` ද දක්වා ඇති බැවින් `{ $from }` උපලක්ෂණය අත්හැර දමා ඇති අතර නොසලකා හරිනු ලැබේ.
       *[other] [deprecation] `{ $to }` ද දක්වා ඇති බැවින් `<{ $component }>` මත ඇති `{ $from }` උපලක්ෂණය අත්හැර දමා ඇති අතර නොසලකා හරිනු ලැබේ.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` මත ඇති `{ $attribute }` උපලක්ෂණය අත්හැර දමා ඇති අතර නොසලකා හරිනු ලැබේ.


## Language coverage

pluralize-english-only = `<pluralize>` හට බහුවචන කළ හැක්කේ ඉංග්‍රීසි පමණි, එබැවින් { $locale } භාෂාවෙන් ලියූ ලේඛනයක එහි පෙළ වෙනස් නොකර තබනු ලැබේ. බහුවචන ස්වරූපය කෙලින්ම ලියන්න, නැතහොත් `pluralForm` උපලක්ෂණයෙන් එය සකසන්න.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` මූලද්‍රව්‍යය හඳුනාගත් Doenet මූලද්‍රව්‍යයක් නොවේ.

schema-element-not-allowed-at-root = `<{ $tag }>` මූලද්‍රව්‍යය ලේඛනයේ මුලට අවසර නැත.

schema-element-not-allowed-inside = `<{ $tag }>` මූලද්‍රව්‍යය `<{ $parent }>` තුළට අවසර නැත.

schema-attribute-unrecognized = `<{ $tag }>` මූලද්‍රව්‍යයට `{ $attribute }` නමැති උපලක්ෂණයක් නොමැත.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` මූලද්‍රව්‍යයේ `{ $attribute }` උපලක්ෂණය, එහි එක් එක් අයිතමය මින් එකක් වන ලැයිස්තුවක් විය යුතුය: { $allowed }
       *[other] `<{ $tag }>` මූලද්‍රව්‍යයේ `{ $attribute }` උපලක්ෂණය මින් එකක් විය යුතුය: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select සඳහා අවලංගු variant නාමයකි. { $variantName } යන variant නාමය option { $numOptions }ක දිස්වේ, නමුත් තෝරාගත යුතු ගණන { $numToSelect } වේ.

select-variant-name-without-options = select සඳහා සමහර variant දක්වා ඇත, නමුත් හැකි variant නාමය සඳහා option දක්වා නොමැත: { $variantName }.

select-variant-name-not-possible = select සඳහා දක්වා ඇති { $variantName } යන variant නාමය හැකි variant නාමයක් නොවේ.

select-too-few-options = { $numOptions } කින් පමණක් සංරචක { $numToSelect }ක් තෝරාගත නොහැක.

select-from-sequence-too-few-values = දිග { $length } වන අනුක්‍රමයකින් අගයන් { $numToSelect }ක් තෝරාගත නොහැක.

select-from-sequence-indices-count-mismatch = select සඳහා දක්වා ඇති indices ගණන තෝරාගත යුතු ගණනට සමාන විය යුතුය

select-from-sequence-indices-not-integers = select සඳහා දක්වා ඇති සියලු indices පූර්ණ සංඛ්‍යා විය යුතුය

select-from-sequence-index-excluded = selectfromsequence හි දක්වා ඇති index එක බැහැර කර ඇත

select-from-sequence-indices-excluded-combination = selectfromsequence හි දක්වා ඇති indices බැහැර කළ සංයෝගයක් විය

select-from-sequence-coprime-not-positive-integers = ධන පූර්ණ සංඛ්‍යා තෝරා නොගන්නා බැවින් සාපේක්ෂ ප්‍රථමක සංයෝග තෝරාගත නොහැක.

select-from-sequence-coprime-common-factor = සාපේක්ෂ ප්‍රථමක සංඛ්‍යා තෝරාගත නොහැක. හැකි සියලු අගයන්ට පොදු සාධකයක් ඇත. (දක්වා ඇති "from" හෝ "to" අගයන් "step" සමඟ සාපේක්ෂ ප්‍රථමක විය යුතුය.)

select-from-sequence-coprime-single-number = 1 නොවන තනි සංඛ්‍යාවකින් සාපේක්ෂ ප්‍රථමක සංයෝග තෝරාගත නොහැක.

select-from-sequence-excluded-too-many-combinations = selectFromSequence හි සංයෝගවලින් 70%කට වඩා බැහැර කර ඇත

select-from-sequence-coprime-none-found = සාපේක්ෂ ප්‍රථමක සංඛ්‍යා තෝරාගත නොහැකි විය. හැකි සියලු අගයන්ට පොදු සාධකයක් ඇත.

select-from-sequence-too-few-unique-values = දිග { $numPossibleValues } වන අනුක්‍රමයකින් අනන්‍ය අගයන් { $numToSelect }ක් තෝරාගත නොහැක

select-prime-numbers-too-few-values = දිග { $numValues } වන ප්‍රථමක සංඛ්‍යා ලැයිස්තුවකින් අගයන් { $numToSelect }ක් තෝරාගත නොහැක

select-prime-numbers-values-count-mismatch = select සඳහා දක්වා ඇති අගයන් ගණන තෝරාගත යුතු ගණනට සමාන විය යුතුය

select-prime-numbers-values-not-prime = select ප්‍රථමක සංඛ්‍යා සඳහා දක්වා ඇති සියලු අගයන් ප්‍රථමක සංඛ්‍යා ලැයිස්තුවේ තිබිය යුතුය

select-prime-numbers-values-excluded-combination = selectPrimeNumbers හි දක්වා ඇති අගයන් බැහැර කළ සංයෝගයක් විය

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers හි සංයෝගවලින් 70%කට වඩා බැහැර කර ඇත

select-random-combination-fluke = අතිශය දුර්ලභ අහම්බයකින්, අහඹු අගයන්ගේ සංයෝගයක් තෝරාගත නොහැකි විය

select-random-value-fluke = අතිශය දුර්ලභ අහම්බයකින්, අහඹු අගයක් තෝරාගත නොහැකි විය
