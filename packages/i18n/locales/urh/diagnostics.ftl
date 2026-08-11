# Urhobo diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `chrome.ftl`'s header for the family (Southwestern Edoid, Volta-Niger),
# the pairing with `locales/bin`, the no-agreement finding, and the note on
# how thin online Urhobo lexical coverage is. This file is the most affected
# by that gap: it is almost entirely technical prose (parser and schema
# diagnostics, component names) that no dictionary available to this seed
# covers, so a heavier share of it than `chrome.ftl` or `content.ftl` leans on
# short, consistent Urhobo templates ("X ro fioma" for "invalid X", "a sa vwo
# … fa" for "cannot …") built around the confirmed vocabulary rather than on
# attested idiomatic phrasing. DoenetML tag names, attribute names and
# identifiers are left in English throughout, exactly as the English source
# requires.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] A vwo werhie { $attributes } phrẹ ọke a vwo dje ẹkpẹrọ ivbe
       *[other] A vwo werhie { $attributes } phrẹ ọke a vwo dje ẹkpẹrọ ivbe
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] A vwo werhie { $attributes } phrẹ ọke a vwo dje ẹkpẹrọ vẹ orere-udu
       *[other] A vwo werhie { $attributes } phrẹ ọke a vwo dje ẹkpẹrọ vẹ orere-udu
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset o vwo mudiane-e bọdẹ orere-udu ovwan

## `<line>`

line-points-undetermined-dimensions = Layin vwẹ ẹkpo re a che vwo mrẹ oghwẹkuvwẹ ẹrhọ.

line-points-too-few-dimensions = Layin ọ gbe vwẹ ẹkpo re vwo oghwẹkuvwẹ ivẹ kpobọ.

line-points-depend-on-variables = Layin vwẹ ẹkpo re rherie vwẹ ivarieboli: { $variables }.

line-equation-invalid-format = Fọmatti ro fioma kẹ ekueshini rẹ layin vwẹ ivarieboli { $variable1 } vẹ { $variable2 }.

## `<ray>`

ray-overprescribed-through = A vwo dje through, endpoint, vẹ direction kẹ rey vevẹ obo vuọvo.  A yen werhie through ro yen dje phrẹ.

ray-dimension-mismatch = numDimensions o sioma-e vwẹ rey.

## `<vector>`

vector-overprescribed-head = A vwo dje head, tail, vẹ displacement kẹ vẹkto vevẹ obo vuọvo.  A yen werhie head ro yen dje phrẹ.

vector-dimension-mismatch = numDimensions o sioma-e vwẹ vẹkto.

## Attracting and constraining

attract-to-without-nearest-point = A sa vwo attract kpo `<{ $component }>` fa, kidie ọ vwo nearestPoint state variable ovwan-o.

constrain-to-without-nearest-point = A sa vwo constrain kpo `<{ $component }>` fa, kidie ọ vwo nearestPoint state variable ovwan-o.

constrain-to-interior-without-nearest-point = A sa vwo constrain kpo obo rẹ `<{ $component }>` fa, kidie ọ vwo nearestPoint state variable ovwan-o.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition a vwo werhie phrẹ kẹ choiceInput ro guọnọ inline-e

## Ordering children by index

choice-input-indices-count-mismatch = A vwo werhie indices ro yen dje kẹ choiceInput phrẹ, kidie obaro indices na o sioma vẹ obaro emọ choice-e.

pretzel-indices-count-mismatch = A vwo werhie indices ro yen dje kẹ problem phrẹ, kidie obaro indices na o sioma vẹ obaro emọ problem-e.

shuffle-indices-count-mismatch = A vwo werhie indices ro yen dje kẹ shuffle phrẹ, kidie obaro indices na o sioma vẹ obaro ikọmpọnẹnti-e.

indices-ignored-out-of-range = A vwo werhie indices ro yen dje kẹ { $component } phrẹ, kidie indices efa che kpo ẹkẹ.

pretzel-indices-repeated = A vwo werhie indices ro yen dje kẹ pretzel phrẹ, kidie indices efa che dje kugbe.

pretzel-circuit-first-index = A vwo werhie indices ro yen dje kẹ pretzel phrẹ vwẹ circuit mode, kidie index ọsiọvo ọ gbe rẹ 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Re `<{ $component }>` re ru vwẹ emọ ro yen string, a gbe dje atiribiuti `type`.

invalid-type-defaulting-to-math = Uyovwin { $type } ro fioma kẹ ikọmpọnẹnti { $component }. O gbe rẹ ovo vwẹ math, text, number, yẹrẹ boolean. A yen werhie kpo math.

string-not-valid-component-to-arrange = String "{ $value }" a fioma kẹ ikọmpọnẹnti ro sa { $component }-en. A yen werhie phrẹ.

## Types and variables

invalid-type-defaulting-to-number = Uyovwin { $type } ro fioma, a yen werhie uyovwin kpo number.

invalid-variable-value = Erọ ro fioma rẹ ivarieboli: `{ $value }`

## Variants

variant-index-must-be-number = Index rẹ variant { $index } o gbe rẹ number

variant-index-must-be-integer = Index rẹ variant { $index } o gbe rẹ integer

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` a che ru kẹ absolute measurements-e. A yen werhie widths kpo relative.

side-by-side-absolute-margins = `<{ $component }>` a che ru kẹ absolute measurements-e. A yen werhie margins kpo relative.

side-by-side-no-block-child = `<{ $component }>` ro fioma: o gbe vwo ọvo block child kpobọ.

## `<label>`

label-for-ignored-on-graphical = Atiribiuti `for` vwẹ `<label>` ro graphical, a vwo werhie phrẹ.

label-for-must-resolve-to-one = Atiribiuti `for` vwẹ `<label>` o gbe kobọ kpo ikọmpọnẹnti ọvo.

label-for-unresolved = A sa vwo kobọ atiribiuti `for` vwẹ `<label>` kpo ikọmpọnẹnti-e.

label-for-answer-with-authored-inputs = Atiribiuti `for` vwẹ `<label>` yen kpahọn `<answer>` ro vwo eyin input a nabọ mudiane; kobọ input na obo vuọvo.

label-for-answer-without-input = Atiribiuti `for` vwẹ `<label>` yen kpahọn `<answer>` ro vwo input ro sa label-en ovwan-o.

label-for-must-reference-input-or-answer = Atiribiuti `for` vwẹ `<label>` o gbe kpahọn input yẹrẹ answer.

## Accessibility

accessibility-short-description-or-decorative = Rẹ iruemu-erhirhie, `<{ $component }>` o gbe vwo short description yẹrẹ a nabọ mudiane phi kpahọn decorative.

accessibility-video-short-description = Rẹ iruemu-erhirhie, `<video>` o gbe vwo short description.

accessibility-input-short-description-or-label = Rẹ iruemu-erhirhie, `<{ $component }>` o gbe vwo short description yẹrẹ label.

accessibility-answer-input-short-description-or-label = Rẹ iruemu-erhirhie, input ro `<answer>` mudiane phi o gbe vwo short description yẹrẹ label.

accessibility-short-description-contains-math = Short description a gbe vwo ikọmpọnẹnti math bọdẹ `<{ $component }>` ovwan-e. Kere math na vwẹ eme.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } o vwo contrast ro te-e kẹ odẹ rẹ ẹkẹ (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; o guọnọ { $threshold }:1 kpobọ).
       *[other] { $colorName } o vwo contrast ro te-e kẹ odẹ rẹ ẹkẹ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; o guọnọ { $threshold }:1 kpobọ).
    }

## `<circle>`

circle-through-points-non-numerical = A che ru `<circle>` bọdẹ ẹkpo { $count } vwẹ oborẹ ẹkpo na vwo erọ number-e ovwan.

circle-too-many-through-points = A sa vwo kalikuletti sakul bọdẹ ẹkpo ro rhirie 3 fa.

circle-overprescribed-radius-center-points = A sa vwo kalikuletti sakul vwẹ radius, center vẹ ẹkpo re a dje fa.

circle-center-with-multiple-points = A sa vwo kalikuletti sakul vwẹ center re bọdẹ ẹkpo ro rhirie 1 fa.

circle-radius-too-small = A sa vwo kalikuletti sakul fa: kidie oke-ẹrhẹvwe rẹ ẹkpo ivẹ na yen { $distance }, radius { $radius } ro yen dje o dinrin vwerhen.

circle-radius-with-many-points = A sa vwo mudiane sakul phi bọdẹ ẹkpo ro rhirie ivẹ vwẹ radius ro yen dje fa.

circle-invalid-center-or-through-points = Center yẹrẹ ẹkpo rẹ sakul ro fioma.

circle-radius-center-with-multiple-points = A sa vwo kalikuletti radius rẹ sakul vwẹ center re bọdẹ ẹkpo ro rhirie 1 fa.

circle-change-radius-non-numerical = A sa vwo werhie radius rẹ sakul re vwo ẹkpo re number-e ovwan fa

circle-radius-with-points-non-numerical = A sa vwo mudiane sakul phi bọdẹ ẹkpo ro rhirie ivẹ vwẹ radius ro yen dje ọke ẹkpo na number-e ovwan-o.

circle-change-center-non-numerical = A che ru werhie center rẹ sakul re vwo ẹkpo re number-e ovwan-o.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Oghwẹkuvwẹ o te-e kẹ domain rẹ function. Domain vwo ẹkẹ { $intervals } dẹ fọkshọn na vwo { $inputs ->
            [one] input { $inputs }
           *[other] eyin input { $inputs }
        }.
       *[other] Oghwẹkuvwẹ o te-e kẹ domain rẹ function. Domain vwo eyin ẹkẹ { $intervals } dẹ fọkshọn na vwo { $inputs ->
            [one] input { $inputs }
           *[other] eyin input { $inputs }
        }.
    }

function-domain-invalid-format = Fọmatti ro fioma kẹ domain rẹ function.

function-ignoring-non-numerical =
    { $type ->
        [maximum] A yen werhie maximum ro number-e ovwan rẹ function phrẹ.
        [minimum] A yen werhie minimum ro number-e ovwan rẹ function phrẹ.
        [extremum] A yen werhie extremum ro number-e ovwan rẹ function phrẹ.
        [point] A yen werhie point ro number-e ovwan rẹ function phrẹ.
        [slope] A yen werhie slope ro number-e ovwan rẹ function phrẹ.
       *[other] A yen werhie { $type } ro number-e ovwan rẹ function phrẹ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] A yen werhie maximum ro ovwan-e rẹ function phrẹ.
        [minimum] A yen werhie minimum ro ovwan-e rẹ function phrẹ.
        [extremum] A yen werhie extremum ro ovwan-e rẹ function phrẹ.
        [point] A yen werhie point ro ovwan-e rẹ function phrẹ.
       *[other] A yen werhie { $type } ro ovwan-e rẹ function phrẹ.
    }

function-points-too-close = Fọkshọn na vwo ẹkpo ivẹ re ekẹ ihwe kokobiẹ-o. A sa vwo mudiane fọkshọn na phi fa.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Function iterates o sa dabọ-e ọfiotọ ọkpọ ọtiọvo obaro input rẹ fọkshọn na sioma vẹ obaro output. Fọkshọn nana vwo input { $inputs } vẹ { $outputs ->
            [one] output { $outputs }
           *[other] eyin output { $outputs }
        }.
       *[other] Function iterates o sa dabọ-e ọfiotọ ọkpọ ọtiọvo obaro input rẹ fọkshọn na sioma vẹ obaro output. Fọkshọn nana vwo eyin input { $inputs } vẹ { $outputs ->
            [one] output { $outputs }
           *[other] eyin output { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Ọdjekuvwẹ rẹ sequence ro fioma.  O gbe rẹ integer ro sa negative-en ovwan.

sequence-invalid-step = Step rẹ sequence ro fioma.  O gbe rẹ number kẹ sequence uyovwin { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" rẹ number sequence ro fioma.  O gbe rẹ number.

sequence-invalid-endpoint-letters = "{ $attribute }" rẹ letters sequence ro fioma.  O gbe rẹ letter combination.

sequence-invalid-endpoint = "{ $attribute }" rẹ sequence ro fioma.

select-from-sequence-coprime-not-numbers = A yen werhie coprime phrẹ kidie a che vwo yọnrẹ numbers-e

select-from-sequence-coprime-with-exclude-combinations = A yen werhie coprime phrẹ kidie a vwo dje excludeCombinations

## Resolving a `target`

target-not-found = Target ro fioma kẹ `<{ $source }>`: a sa vwo mrẹ target-e.

target-state-variable-not-found = Target ro fioma kẹ `<{ $source }>`: a sa vwo mrẹ state variable ro yen odẹ "{ $property }" vwẹ `<{ $component }>` fa.

## `<odeSystem>`

ode-system-variables-match-independent = Ivarieboli rẹ `<odeSystem>` o gbe sioma vẹ independent variable-e.

ode-system-duplicate-variable-names = A sa vwo mudiane ODE RHS fọkshọn re vwo odẹ ro dje kugbe fa.

ode-system-rhs-function-error = A sa vwo mudiane ODE RHS function phi fa.  Otọfa vwẹ mathjs function.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = A sa vwo mudiane angle kẹ ọtiọvo eyin layin { $count } fa

angle-invalid-through-point = Ẹkpo ro fioma vwẹ through rẹ `<angle>`

parabola-vertex-too-many-points = A che ru parabola re vwo vertex bọdẹ ẹkpo ro rhirie 1 ovwan-o.

parabola-too-many-points = A che ru parabola bọdẹ ẹkpo ro rhirie 3 ovwan-o.

intersection-too-many-items = A che ru intersection kẹ eyin ro rhirie ivẹ ovwan-o

## Other math components

ionic-compound-not-two-ions = A che ru ionic compound bọdẹ obo efa rọvo ẹdo aiọni ivẹ ovwan-o.

ionic-compound-needs-cation-and-anion = A ru ionic compound bọdẹ cation ọvo vẹ anion ọvo kpobọ.

solve-equations-cannot-evaluate = A sa vwo solve ekueshini na fa kidie a sa vwo evaluate ekueshini na fa: { $equation }

math-operators-operand-number-required = O gbe dje operandNumber ọke a vwo extract math operand.

eigen-decomposition-failed = A sa vwo kalikuletti eigenvalues rẹ matrix fa

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } o vwẹ pattern na ovwan-o, kidie ọ che match blank kugbe.
       *[other] `<matchesPattern>`: eyin parameter { $parameters } a vwẹ pattern na ovwan-o, kidie ẹrẹ che match blank kugbe.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: a sa vwo kpahọn grid="{ $grid }" fa. O gbe rẹ none, medium, dense, yẹrẹ numbers ivẹ ro positive-e re ekẹ ovwan-oghẹ, bọdẹ grid="1 0.5". A che se grid-e.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" a che support-e vwẹ prefigure renderer; a yen werhie kpo right-position.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" a che support-e vwẹ prefigure renderer; a yen werhie kpo top-position.

prefigure-invalid-axis-bounds = `<graph>`: axis bounds ro fioma kẹ prefigure conversion; a yen werhie kpo default bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: width ro fioma kẹ prefigure conversion; a yen werhie kpo default diagram width 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ro fioma kẹ prefigure conversion; a yen werhie kpo default aspect ratio 1.

prefigure-grid-spacing-too-fine = `<graph>`: grid spacing ro dinrin vwerhen kẹ axis limits; a yen werhie grid phrẹ vwẹ prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: annotations a che odjro-en ọke a che vwo prefigure renderer.

multiple-annotations-children = A mrẹ eyin `<annotations>` child buebun vwẹ `<graph>`; a yen werhie ihworo, akpọ ọsiọvo ọfa a yen dje.

## Referring to other components

copy-unrecognized-component-type = A sa vwo extend yẹrẹ copy ikọmpọnẹnti ro a che mudiane-en fa: { $type }.

copy-prop-not-found = A sa vwo mrẹ prop { $property } vwẹ ikọmpọnẹnti uyovwin { $component } fa

collect-no-source = A mrẹ source ọvo-o kẹ collect.

collect-invalid-component-type = A sa vwo collect ikọmpọnẹnti uyovwin `<{ $component }>` fa kidie ọ fioma.

reference-index-unavailable = A sa vwo kpahọn index `{ $reference }` fa

## `<callAction>`

component-action-unavailable = A sa vwo kpe { $action } vwẹ ikọmpọnẹnti `{ $reference }` fa

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Erọ na fioma vwẹ oghwẹkuvwẹ.  Eka na vwo ọdjekuvwẹ ro sioma-e. A mrẹ vwẹ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Erọ na vwo odẹ ọfẹ ro dje kugbe. A mrẹ vwẹ componentIdx :{ $componentIdx }

data-frame-missing-column-name = Erọ na o vwo odẹ ọfẹ ovwan-o. A mrẹ vwẹ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award kẹ answer nana ọ mudiane phi vwẹ ẹkpahọnphiyọ ro yen sọmit vwẹ answer obo vuọvo, ọ che nẹrhẹ oborẹ a che guọnọ-en phi.

answer-max-num-attempts-in-section-wide-check-work = A vwo werhie `maxNumAttempts` vwẹ `<answer>` re vwẹ obo rẹ container vwo `sectionWideCheckWork`, ọ mudiane phi-e, kidie container yen kpahọn obaro utuja. Werhie `maxNumAttempts` vwẹ container obo vuọvo.

nested-section-wide-check-work-max-num-attempts = A vwo werhie `maxNumAttempts` vwẹ container vwo `sectionWideCheckWork` re vwẹ obo rẹ container ọfẹ vwo `sectionWideCheckWork`, ọ mudiane phi-e, kidie container ro ke yen kpahọn obaro utuja. Werhie `maxNumAttempts` vwẹ container ro ke obo vuọvo.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atiribiuti { $attributes } ọ mudiane phi-e bọdẹ a vwo dje symbolicEquality ovwan.
       *[other] Eyin atiribiuti { $attributes } ẹrẹ mudiane phi-e bọdẹ a vwo dje symbolicEquality ovwan.
    }

answer-invalid-type = Uyovwin ro fioma kẹ answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Kidie ikọmpọnẹnti `<{ $component }>` a vwo odẹ ovwan, a sa vwo mudiane phi kẹ atiribiuti rẹ module fa

module-attribute-name-already-defined = A sa vwo mudiane ikọmpọnẹnti `<{ $component } name="{ $name }">` phi kpahọn atiribiuti rẹ module fa kidie ikọmpọnẹnti uyovwin `<module>` yen vwo atiribiuti "{ $name }" kugbe.

conditional-content-condition-ignored = A vwo werhie atiribiuti `condition` phrẹ vwẹ `<conditionalContent>` re vwo emọ case yẹrẹ else.

slider-markers-type-mismatch = Uyovwin rẹ markers o sioma vẹ uyovwin rẹ slider-e.

pretzel-problem-needs-statement-and-answer = Pretzel ro fioma: `<problem>` ovuovo o gbe vwo `<statement>` ọvo vẹ `<answer>` ọvo.

pretzel-circuit-first-problem-distractor = Pretzel ro fioma: vwẹ mode="circuit", `<problem>` ọsiọvo a sa rẹ distractor-e.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Erọ { $values } ro fioma kẹ atiribiuti `{ $attribute }`; a yen werhie phrẹ.
       *[other] Erọ { $values } ro fioma kẹ atiribiuti `{ $attribute }`; a yen werhie phrẹ.
    }

attribute-must-be-references = Erọ `{ $value }` ro fioma kẹ atiribiuti `{ $attribute }`. Atiribiuti o gbe rẹ ekẹ-rherhe re mrẹ ẹkẹ vwẹ `$`.

math-input-invalid-function-names = <mathInput>: a yen werhie odẹ fọkshọn re fioma phrẹ vwẹ { $attribute }: { $names }. Ẹkpẹrọ display rẹ odẹ ovuovo o gbe vwo letter yẹrẹ dash ivẹ kpobọ; a sa dje ẹkpẹrọ `|<mathspeak alternative>` phi.

## Building components from the source

component-type-invalid = Uyovwin ro fioma kẹ ikọmpọnẹnti: `<{ $componentType }>`

attribute-repeated = A sa vwo dje atiribiuti { $attribute } kugbe fa.

attribute-invalid-for-component = Atiribiuti "{ $attribute }" ro fioma kẹ ikọmpọnẹnti uyovwin `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Style definition { $styleNumber } o vwo contrast ro te-e kẹ { $context ->
        [text-on-background] color rẹ text vwẹ obo color rẹ ẹkẹ-otọ
        [high-contrast] color ro high-contrast vwẹ obo canvas
        [line] color rẹ layin vwẹ obo canvas
        [marker] color rẹ marker vwẹ obo canvas
       *[text-on-canvas] color rẹ text vwẹ obo canvas
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; o guọnọ { $threshold }:1 kpobọ).

style-definition-dark-mode-text-background-contrast =
    Style definition { $styleNumber } yen dje erọ color re vwo contrast ro te vwẹ light mode, ẹkẹ color rẹ dark-mode ro yen mudiane phi vwẹ erọ nana ọ vwo contrast ro te-e kẹ color rẹ text vwẹ obo color rẹ ẹkẹ-otọ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; o guọnọ { $threshold }:1 kpobọ). { $suggestion ->
        [available] Re contrast te vwẹ dark mode, werhie contrast rẹ light-mode kobọrọ (bọdẹ, dje { $lightAttribute }="{ $lightColor }") yẹrẹ werhie color rẹ dark-mode ({ $darkAttribute }="{ $darkColor }").
       *[none] Re contrast te vwẹ dark mode, werhie contrast rẹ light-mode kobọrọ yẹrẹ werhie erọ color re yen mudiane phi vwẹ textColorDarkMode vẹ/yẹrẹ backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Style definition { $styleNumber } yen dje color rẹ text re vwo contrast ro te vwẹ light mode, ẹkẹ color rẹ text rẹ dark-mode ro yen mudiane phi vwẹ erọ nana ọ vwo contrast ro te-e kẹ obo canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; o guọnọ { $threshold }:1 kpobọ). { $suggestion ->
        [available] Re contrast te vwẹ dark mode, werhie contrast rẹ light-mode kobọrọ (bọdẹ, dje textColor="{ $lightColor }") yẹrẹ werhie color rẹ dark-mode (textColorDarkMode="{ $darkColor }").
       *[none] Re contrast te vwẹ dark mode, werhie contrast rẹ light-mode kobọrọ yẹrẹ werhie erọ ro yen mudiane phi vwẹ textColorDarkMode.
    }

section-multiple-style-palettes = Ẹkẹ ọvo sa nabọ <stylePalette> ọvo kpobọ; a yen werhie ro yen dje ihworo.

## Unique variants

variant-num-to-select-not-non-negative-integer = a sa vwo mrẹ ivarianti unique rẹ { $component } fa kidie numToSelect a rẹ integer ro sa negative-en ovwan-e.

variant-num-to-select-not-constant-number = a sa vwo mrẹ ivarianti unique rẹ { $component } fa kidie numToSelect a rẹ constant number-e.

variant-with-replacement-not-constant-boolean = a sa vwo mrẹ ivarianti unique rẹ { $component } fa kidie withReplacement a rẹ constant boolean-e.

variant-select-weight-disables-unique = A che dje ivarianti unique kẹ select-e ọke option ọvo vwo selectWeight yẹrẹ selectForVariants

variant-coprime-undetermined = a sa vwo mrẹ ivarianti unique rẹ { $component } fa kidie a sa vwo mrẹ coprime ro rẹ false ọvuọvo fa.

variant-attribute-not-constant = a sa vwo mrẹ ivarianti unique rẹ { $component } fa kidie { $attribute } a rẹ constant-e.

variant-attribute-not-number = a sa vwo mrẹ ivarianti unique rẹ { $component } fa kidie { $attribute } a rẹ number-e.

variant-attribute-wrong-type-for-sequence =
    a sa vwo mrẹ ivarianti unique rẹ { $component } uyovwin { $type } fa kidie { $attribute } a rẹ { $expected ->
        [letters-combination] combination rẹ letters
        [math-expression] otọfa math ro dogba
        [integer] integer
       *[number] number
    } ovwan-e.

variant-length-not-integer = a sa vwo mrẹ ivarianti unique rẹ { $component } fa kidie length a rẹ integer-e.

variant-sort-not-implemented = a che ru ivarianti unique rẹ { $component } vwo sort ovwan-o

variant-exclude-combinations-not-implemented = a che ru ivarianti unique rẹ { $component } vwo excludeCombinations ovwan-o

variant-math-exclude-not-implemented = a che ru ivarianti unique rẹ { $component } uyovwin math vwo exclude ovwan-o

variant-non-constant-exclude-not-implemented = a che ru ivarianti unique rẹ { $component } vwo exclude re constant-e ovwan-o

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: a che support-e vwẹ graph prefigure renderer; a yen werhie descendant phrẹ.

prefigure-descendant-invalid-geometry = { $subject }: geometry ro non-finite yẹrẹ ovwan; a yen werhie descendant phrẹ.

prefigure-curve-label-omitted = { $subject }: a che support labels vwẹ ikọmpọnẹnti curve re yen converti-e; a yen werhie label phrẹ.

prefigure-curve-unsupported-definition-type = { $subject }: uyovwin definition rẹ curve function '{ $definitionType }' a che support-e; a yen werhie descendant phrẹ.

prefigure-region-flip-functions-unsupported = { $subject }: atiribiuti flipFunctions vwẹ regionBetweenCurves a che support-e; a yen werhie descendant phrẹ.

prefigure-region-non-formula-child = { $subject }: emọ fọkshọn re uyovwin formula-e ọvo a support-en vwẹ regionBetweenCurves; a yen werhie descendant phrẹ.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' a che support-e kẹ { $labelKind ->
        [line-family] label rẹ line-family
       *[point] label rẹ point
    }; a yen vwo default alignment rẹ PreFigure.

prefigure-fill-style-unsupported = { $subject }: fill style '{ $fillStyle }' a che support-e vwẹ PreFigure; a yen werhie kpo solid fill.

prefigure-line-style-unknown = { $subject }: line style '{ $lineStyle }' a che mudiane phi-e vwẹ PreFigure output; a yen werhie phrẹ.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker style '{ $markerStyle }' a yen werhie kpo PreFigure style 'diamond'.

prefigure-marker-style-unsupported = { $subject }: marker style '{ $markerStyle }' a che support-e vwẹ PreFigure; a yen vwo default style.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ro fioma; a sa vwo kobọ target-e. A yen werhie annotation phrẹ.

annotation-ref-multiple-targets = `<annotation>`: `ref` yen kobọ kpo eyin target buebun; a yen vwo target ọsiọvo.

annotation-ref-outside-graph = `<annotation>`: `ref` ro fioma; target vwẹ ihworo rẹ graph re yen dje. A yen werhie annotation phrẹ.

annotation-ref-unsupported-target = `<annotation>`: `ref` ro fioma; target a support-en vwẹ prefigure conversion ovwan-e. A yen werhie annotation phrẹ.

annotation-text-missing = `<annotation>`: `text` ovwan yẹrẹ blank-e; a yen odjro text ro ovwan-e.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] A mrẹ circular dependency.
       *[other] A mrẹ circular dependency re yen kpahọn ikọmpọnẹnti `<{ $componentType }>`.
    }

reference-no-referent = A mrẹ orere ovwan-o kẹ ẹkẹ-rherhe: `{ $reference }`

reference-multiple-referents = A mrẹ orere buebun kẹ ẹkẹ-rherhe: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Fọmatti ro fioma kẹ atiribiuti { $attribute } rẹ `<{ $componentType }>`.

children-invalid = Emọ ro fioma kẹ `<{ $componentType }>`: A mrẹ emọ ro fioma: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Erọ `{ $value }` ro fioma kẹ atiribiuti `{ $attribute }`, a yen vwo erọ `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] A sa vwo mrẹ DoenetML ivarianti { $version } fa.
       *[other] A sa vwo mrẹ DoenetML ivarianti { $version } fa. A yen werhie kpo ivarianti { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ro fioma: { $content }

parse-tag-missing-close-tag = DoenetML ro fioma: Tag `{ $tag }` a vwo closing tag ovwan-o. A ru guọnọ tag ro self-closing yẹrẹ tag `</{ $tagName }>`.

parse-tag-error = DoenetML ro fioma: Otọfa vwẹ tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ro fioma: Atiribiuti ro fioma `{ $attribute }` ọdjekọ ọ vwo erọ ovwan-o.

parse-attribute-invalid = DoenetML ro fioma: Atiribiuti ro fioma `{ $attribute }`

parse-attribute-value-invalid = DoenetML ro fioma: Erọ ro fioma kẹ atiribiuti `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML ro fioma: Erọ ro fioma kẹ atiribiuti `{ $value }`. Quote marks na o sioma-e. Ọdjekọ wọ vwo `{ $quote }` ovwan-e

parse-open-tag-name-missing = DoenetML ro fioma: A mrẹ tag re odẹ ovwan-o, bọdẹ `<`

parse-tag-not-closed = DoenetML ro fioma: Tag `{ $tag }` a yen closing-e (ọ dje `>` ovwan-e).

parse-self-closing-tag-name-missing = DoenetML ro fioma: A mrẹ tag re odẹ ovwan-o `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ro fioma: Tag `{ $tag }` a yen closing-e (ọ dje `/>` ovwan-e).

parse-tag-invalid-attributes = DoenetML ro fioma: Tag `{ $tag }` a fioma-e. Atiribiuti eje sa fioma.

parse-close-tag-name-missing = DoenetML ro fioma: A mrẹ closing tag re odẹ ovwan-o, bọdẹ `</`

parse-attribute-value-unquoted = Erọ atiribiuti o gbe vwẹ obo quote marks: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ro fioma: A mrẹ closing tag `{ $tag }`, o vwo opening tag ro dogba ovwan-o

parse-close-tag-mismatched = DoenetML ro fioma: Closing tag ro sioma-e. A guọnọ `</{ $expected }>`. A mrẹ `{ $found }`

parser-node-unconvertible = A sa vwo convert node { $node } kpo Dast node fa.

## Names

name-attribute-invalid =
    Odẹ ro fioma name='{ $name }'. { $reason ->
        [characters] Odẹ o sa vwo vwo letter, number, underscore, yẹrẹ hyphen kpobọ.
       *[start] Odẹ o gbe muegbe vwẹ letter.
    }

component-name-invalid-start = Odẹ rẹ ikọmpọnẹnti "{ $name }" ro fioma. Odẹ o gbe muegbe vwẹ letter.

## `<answer>` sugar

answer-video-watched-missing-video = Answer ro uyovwin videoWatched o gbe vwo atiribiuti video

answer-video-watched-video-not-reference = Answer ro uyovwin videoWatched o gbe vwo atiribiuti video ro rẹ ẹkẹ-rherhe

answer-name-not-single-text = Atiribiuti odẹ rẹ answer o gbe vwo text child ọvo kpobọ

## Referencing another document

external-doenetml-recursion-limit = A sa vwo mrẹ DoenetML ephiare fa kidie recursion na buebun vwerhen. Ẹkẹ-rherhe ro circular vwo ẹrhọ?

external-doenetml-unavailable = A sa vwo mrẹ DoenetML vwẹ { $attribute }="{ $uri }" fa

external-doenetml-type-mismatch = DoenetML ro fioma re a mrẹ vwẹ { $attribute }="{ $uri }": ọ sioma vẹ ikọmpọnẹnti uyovwin "{ $componentType }" e-e

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atiribiuti `{ $from }` a che vwo-en; werhie `{ $to }` obo vuọvo.
       *[other] [deprecation] Atiribiuti `{ $from }` vwẹ `<{ $component }>` a che vwo-en; werhie `{ $to }` obo vuọvo.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atiribiuti `{ $from }` a che vwo-en, a yen werhie phrẹ kidie `{ $to }` je yen dje.
       *[other] [deprecation] Atiribiuti `{ $from }` vwẹ `<{ $component }>` a che vwo-en, a yen werhie phrẹ kidie `{ $to }` je yen dje.
    }

deprecated-attribute-ignored = [deprecation] Atiribiuti `{ $attribute }` vwẹ `<{ $component }>` a che vwo-en, a yen werhie phrẹ.

deprecated-attribute-to-child = [deprecation] Atiribiuti `{ $attribute }` vwẹ `<{ $component }>` a che vwo-en; werhie child `<{ $child }>` obo vuọvo.

deprecated-attribute-value-renamed = [deprecation] Erọ `{ $value }` rẹ atiribiuti `{ $attribute }` vwẹ `<{ $component }>` a che vwo-en; werhie `{ $to }` obo vuọvo.


## Language coverage

pluralize-english-only = `<pluralize>` sa pluralize English ọvo kpobọ, kidie ọ vwẹ ẹbe ro yen kere vwẹ { $locale }, ẹme na a yen werhie phrẹ ọke ọ dje. Kere plural na wọ obo vuọvo, yẹrẹ dje vwẹ atiribiuti `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` a rẹ element rẹ Doenet ro a mudiane phi-e ovwan-e.

schema-element-not-allowed-at-root = Element `<{ $tag }>` a vwo yọnrẹ-e vwẹ ubru rẹ ẹbe.

schema-element-not-allowed-inside = Element `<{ $tag }>` a vwo yọnrẹ-e vwẹ obo `<{ $parent }>`.

schema-attribute-unrecognized = Element `<{ $tag }>` a vwo atiribiuti ro yen odẹ `{ $attribute }` ovwan-o.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atiribiuti `{ $attribute }` rẹ element `<{ $tag }>` o gbe rẹ list re ọvo ovuovo rẹ: { $allowed }
       *[other] Atiribiuti `{ $attribute }` rẹ element `<{ $tag }>` o gbe rẹ ọvo vwẹ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Odẹ variant ro fioma kẹ select.  Odẹ variant { $variantName } yen dje vwẹ option { $numOptions } dẹ obaro ro guọnọ a select rẹ { $numToSelect }.

select-variant-name-without-options = A dje ivarianti kẹ select, o vwo option ovwan kẹ odẹ variant ro sa dje: { $variantName }.

select-variant-name-not-possible = Odẹ variant { $variantName } ro yen dje kẹ select a rẹ odẹ variant ro sa dje-e.

select-too-few-options = A sa vwo select { $numToSelect } ikọmpọnẹnti vwẹ option { $numOptions } kpobọ fa.

select-from-sequence-too-few-values = A sa vwo select { $numToSelect } erọ vwẹ sequence ro rẹ ọdjekuvwẹ { $length } fa.

select-from-sequence-indices-count-mismatch = Obaro indices ro yen dje kẹ select o gbe sioma vẹ obaro ro guọnọ a select

select-from-sequence-indices-not-integers = Indices eje ro yen dje kẹ select o gbe rẹ integer ovuovo

select-from-sequence-index-excluded = Index rẹ selectfromsequence ro yen dje ro yen exclude

select-from-sequence-indices-excluded-combination = Indices rẹ selectfromsequence ro yen dje re yen combination ro exclude

select-from-sequence-coprime-not-positive-integers = A sa vwo select combinations coprime fa kidie a che vwo select positive integers-e

select-from-sequence-coprime-common-factor = A sa vwo select numbers coprime fa. Erọ ovuovo re sa dje vwo factor ro dje kugbe. (Erọ ro yen dje rẹ "from" yẹrẹ "to" o gbe rẹ coprime vẹ "step".)

select-from-sequence-coprime-single-number = A sa vwo select combinations coprime vwẹ number ọvo ro sa 1-en ovwan fa.

select-from-sequence-excluded-too-many-combinations = A yen exclude combinations rẹ selectFromSequence ro rhirie 70%

select-from-sequence-coprime-none-found = A sa vwo select numbers coprime fa. Erọ ovuovo re sa dje vwo factor ro dje kugbe.

select-from-sequence-too-few-unique-values = A sa vwo select { $numToSelect } erọ unique vwẹ sequence ro rẹ ọdjekuvwẹ { $numPossibleValues } kpobọ fa

select-prime-numbers-too-few-values = A sa vwo select { $numToSelect } erọ vwẹ list rẹ primes ro rẹ ọdjekuvwẹ { $numValues } kpobọ fa

select-prime-numbers-values-count-mismatch = Obaro erọ ro yen dje kẹ select o gbe sioma vẹ obaro ro guọnọ a select

select-prime-numbers-values-not-prime = Erọ eje ro yen dje kẹ select prime number o gbe vwẹ list rẹ primes

select-prime-numbers-values-excluded-combination = Erọ rẹ selectPrimeNumbers ro yen dje ọ rẹ combination ro exclude

select-prime-numbers-excluded-too-many-combinations = A yen exclude combinations rẹ selectPrimeNumbers ro rhirie 70%

select-random-combination-fluke = Vwẹ oborẹ ro sa dabọ-en fioghere, a sa vwo select combination rẹ erọ random fa

select-random-value-fluke = Vwẹ oborẹ ro sa dabọ-en fioghere, a sa vwo select erọ random fa
