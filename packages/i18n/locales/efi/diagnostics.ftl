# Efik diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the family (Cross River, Delta-Cross),
# orthography, and the finding that Efik has no adjective-noun agreement —
# none of that is exercised here since nothing in this catalog carries
# `$gender` or `$role`, but the orthographic notes still apply.
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`
# and the rest — are part of the language rather than prose, and stay in
# English exactly as written. So does the `[deprecation]` marker.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] Owo isịn { $attributes } udọn̄ oro edieke ẹkenọde ntọt iba
       *[other] Owo isịn mme { $attributes } udọn̄ oro edieke ẹkenọde ntọt iba
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] Owo isịn { $attributes } udọn̄ oro edieke ẹkenọde ntọt-utịt ye ntọt-ufọt
       *[other] Owo isịn mme { $attributes } udọn̄ oro edieke ẹkenọde ntọt-utịt ye ntọt-ufọt
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset inyeneke uduak edieke mîdụhe midpoint

## `<line>`

line-points-undetermined-dimensions = Ọfụhọ ọdụk mme ntọt eke owo mîfiọkke iba udọk mmọ.

line-points-too-few-dimensions = Ọfụhọ ana ọdụk mme ntọt eke ẹnyenede udọk iba m̀mê akan.

line-points-depend-on-variables = Ọfụhọ ọdụk mme ntọt eke idude ke ubọk mme n̄kpọ-usiak: { $variables }.

line-equation-invalid-format = Ndise equation ntak ọfụhọ ke mme n̄kpọ-usiak { $variable1 } ye { $variable2 } idotke.

## `<ray>`

ray-overprescribed-through = Ẹsịn un̄wan̄a udọk, ntọt-utịt, ye usụn̄ n̄kpọ nte owo. Owo osio through eke ẹkewetde.

ray-dimension-mismatch = numDimensions inanke ke un̄wan̄a.

## `<vector>`

vector-overprescribed-head = Ẹsịn fektọ ibuot, iso, ye usụn̄ n̄kpọ nte owo. Owo osio head eke ẹkewetde.

vector-dimension-mismatch = numDimensions inanke ke fektọ.

## Attracting and constraining

attract-to-without-nearest-point = Ikemke ndidian ye `<{ $component }>` koro enye inyeneke state variable oro ekerede nearestPoint.

constrain-to-without-nearest-point = Ikemke nditịm ye `<{ $component }>` koro enye inyeneke state variable oro ekerede nearestPoint.

constrain-to-interior-without-nearest-point = Ikemke nditịm esịt eke `<{ $component }>` koro enye inyeneke state variable oro ekerede nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = Owo isịn labelPosition udọn̄ ntak choiceInput oro mîdide eke usụn̄ kiet

## Ordering children by index

choice-input-indices-count-mismatch = Owo osio mme index oro ẹkenọde choiceInput koro ediwak index mînanke ye ediwak eyen orụk choice.

pretzel-indices-count-mismatch = Owo osio mme index oro ẹkenọde problem koro ediwak index mînanke ye ediwak eyen orụk problem.

shuffle-indices-count-mismatch = Owo osio mme index oro ẹkenọde shuffle koro ediwak index mînanke ye ediwak eyen n̄kpọ.

indices-ignored-out-of-range = Owo osio mme index oro ẹkenọde { $component } koro ndusụk index mîdụkke ke udọk.

pretzel-indices-repeated = Owo osio mme index oro ẹkenọde pretzel koro ndusụk index ẹfiakde ẹwet.

pretzel-circuit-first-index = Owo osio mme index oro ẹkenọde pretzel ke usụn̄ circuit koro akpa index ana edi 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Man `<{ $component }>` anam utom ye eyen orụk string, ana ẹwet attribute oro ekerede type.

invalid-type-defaulting-to-math = Type { $type } idotke ntak { $component }. Ana edi kiet ke math, text, number, m̀mê boolean. Owo ada math nte akpa.

string-not-valid-component-to-arrange = String "{ $value }" idịghe eyen n̄kpọ oro ekemede { $component }. Owo osio.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } idotke, owo esịn type nte number.

invalid-variable-value = Uduak n̄kpọ-usiak idotke: `{ $value }`

## Variants

variant-index-must-be-number = Variant index { $index } ana edi number

variant-index-must-be-integer = Variant index { $index } ana edi integer

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` idotke ntak mme ibat oro ẹdide absolute. Owo esịn mme udọk nte relative.

side-by-side-absolute-margins = `<{ $component }>` idotke ntak mme ibat oro ẹdide absolute. Owo esịn mme margin nte relative.

side-by-side-no-block-child = `<{ $component }>` idotke: enye ana enyene ke akpanikọn̄ kiet eyen block.

## `<label>`

label-for-ignored-on-graphical = Owo osio attribute `for` oro ẹdude ke `<label>` eke ndise.

label-for-must-resolve-to-one = Attribute `for` ke `<label>` ana ọsọn̄ọde nte n̄kpọ kiet.

label-for-unresolved = Ikemke ndisọn̄ọ attribute `for` ke `<label>` nte n̄kpọ.

label-for-answer-with-authored-inputs = Attribute `for` ke `<label>` ọdọhọ `<answer>` oro enyenede mme input eke owo ekewetde; da input emi ke idem.

label-for-answer-without-input = Attribute `for` ke `<label>` ọdọhọ `<answer>` oro mîdụhe input oro ekemde ndise.

label-for-must-reference-input-or-answer = Attribute `for` ke `<label>` ana ọdọhọ input m̀mê answer.

## Accessibility

accessibility-short-description-or-decorative = Man kpukpru owo ẹkeme ndise, `<{ $component }>` ana enyene ekpri ntịn̄ m̀mê ẹdọhọ enye edi decorative.

accessibility-video-short-description = Man kpukpru owo ẹkeme ndise, `<video>` ana enyene ekpri ntịn̄.

accessibility-input-short-description-or-label = Man kpukpru owo ẹkeme ndise, `<{ $component }>` ana enyene ekpri ntịn̄ m̀mê label.

accessibility-answer-input-short-description-or-label = Man kpukpru owo ẹkeme ndise, input eke `<answer>` anamde ana enyene ekpri ntịn̄ m̀mê label.

accessibility-short-description-contains-math = Ekpri ntịn̄ isịnke n̄kpọ math nte `<{ $component }>`. Wet math efep ye mme ikọ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } inyeneke ukpọn̄kpọn̄ oro ekemde ntak enyịn̄ ikpehe (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ana enyene ke ekemede { $threshold }:1).
       *[other] { $colorName } inyeneke ukpọn̄kpọn̄ oro ekemde ntak enyịn̄ ikpehe ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ana enyene ke ekemede { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Owo mîkenamke `<circle>` udọk { $count } ntọt ke ebiet emi ntọt mîdụhede uduak number.

circle-too-many-through-points = Ikemke ndise ekpịkpa udọk ntọt oro akande ita.

circle-overprescribed-radius-center-points = Ikemke ndise ekpịkpa ye radius, esịt, ye ntọt udọk oro ẹkenọde kiet ekiet.

circle-center-with-multiple-points = Ikemke ndise ekpịkpa ye esịt udọk ntọt oro akande kiet.

circle-radius-too-small = Ikemke ndise ekpịkpa: ke adan̄a { $distance } odude ke ufọt ntọt iba, radius { $radius } eke ẹkenọde esịmke.

circle-radius-with-many-points = Ikemke nnam ekpịkpa udọk ntọt oro akande iba ye radius eke ẹkenọde.

circle-invalid-center-or-through-points = Esịt m̀mê ntọt udọk ekpịkpa idotke.

circle-radius-center-with-multiple-points = Ikemke ndise radius ekpịkpa ye esịt udọk ntọt oro akande kiet.

circle-change-radius-non-numerical = Ikemke nsiak radius ekpịkpa oro ntọt udọk mmọ mîdụhede uduak number

circle-radius-with-points-non-numerical = Ikemke nnam ekpịkpa udọk ntọt oro akande kiet ye radius eke ẹkenọde ke ntọt mîdụhede uduak number.

circle-change-center-non-numerical = Owo mîkenamke usụn̄ ndisiak esịt ekpịkpa udọk ntọt oro mîdụhede uduak number.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Domain inyeneke udọk oro ekemde ntak function. Domain enyene ufan̄ { $intervals } edi function enyene { $inputs ->
            [one] input { $inputs }
           *[other] mme input { $inputs }
        }.
       *[other] Domain inyeneke udọk oro ekemde ntak function. Domain enyene mme ufan̄ { $intervals } edi function enyene { $inputs ->
            [one] input { $inputs }
           *[other] mme input { $inputs }
        }.
    }

function-domain-invalid-format = Ndise domain ntak function idotke.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Owo osio uku akpakịp function eke mîdụhede uduak number.
        [minimum] Owo osio uku akpasịn function eke mîdụhede uduak number.
        [extremum] Owo osio uku akpakan function eke mîdụhede uduak number.
        [point] Owo osio ntọt function eke mîdụhede uduak number.
        [slope] Owo osio slope function eke mîdụhede uduak number.
       *[other] Owo osio { $type } function eke mîdụhede uduak number.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Owo osio uku akpakịp function eke idụhe n̄kpọ.
        [minimum] Owo osio uku akpasịn function eke idụhe n̄kpọ.
        [extremum] Owo osio uku akpakan function eke idụhe n̄kpọ.
        [point] Owo osio ntọt function eke idụhe n̄kpọ.
       *[other] Owo osio { $type } function eke idụhe n̄kpọ.
    }

function-points-too-close = Function enyene ntọt iba oro ẹdude ekperede kpang. Ikemke n̄wụt function.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Function iterates ẹkeme n̄kpọ edieke ediwak input function ọnọde adan̄a ye ediwak output. Function emi enyene input { $inputs } ye { $outputs ->
            [one] output { $outputs }
           *[other] mme output { $outputs }
        }.
       *[other] Function iterates ẹkeme n̄kpọ edieke ediwak input function ọnọde adan̄a ye ediwak output. Function emi enyene mme input { $inputs } ye { $outputs ->
            [one] output { $outputs }
           *[other] mme output { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Udọk sequence idotke. Ana edi non-negative integer.

sequence-invalid-step = Step sequence idotke. Ana edi number ntak sequence orụk { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ntak number sequence idotke. Ana edi number.

sequence-invalid-endpoint-letters = "{ $attribute }" ntak letters sequence idotke. Ana edi udian n̄wed.

sequence-invalid-endpoint = "{ $attribute }" ntak sequence idotke.

select-from-sequence-coprime-not-numbers = Owo osio coprime koro owo mîmekke number

select-from-sequence-coprime-with-exclude-combinations = Owo osio coprime koro ẹkenọde excludeCombinations

## Resolving a `target`

target-not-found = Target ntak `<{ $source }>` idotke: ikemke n̄kụt target.

target-state-variable-not-found = Target ntak `<{ $source }>` idotke: ikemke n̄kụt state variable oro ekerede "{ $property }" ke `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Mme n̄kpọ-usiak `<odeSystem>` ana ẹkpụhọde ye n̄kpọ-usiak oro imisịnke ke ubọk n̄kpọ efen.

ode-system-duplicate-variable-names = Ikemke n̄wụt ODE RHS functions ye enyịn̄ n̄kpọ-usiak oro ẹfiakde ẹwet.

ode-system-rhs-function-error = Ikemke n̄wụt ODE RHS function. Ndudue ke ndinam mathjs function.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ikemke n̄wụt angle ufọt mme ọfụhọ { $count }

angle-invalid-through-point = Ntọt idotke ke through eke `<angle>`

parabola-vertex-too-many-points = Owo mîkenamke parabola oro vertex esịnde udọk ntọt oro akande kiet.

parabola-too-many-points = Owo mîkenamke parabola udọk ntọt oro akande ita.

intersection-too-many-items = Owo mîkenamke intersection ntak n̄kpọ oro akande iba

## Other math components

ionic-compound-not-two-ions = Owo mîkenamke ionic compound ntak n̄kpọ efen adiaha ion iba.

ionic-compound-needs-cation-and-anion = Ionic compound anamde utom ntak cation kiet ye anion kiet.

solve-equations-cannot-evaluate = Ikemke ndibiere equation koro ikemke ndise uduak equation: { $equation }

math-operators-operand-number-required = Ana ẹwet operandNumber ke ini ẹmende math operand.

eigen-decomposition-failed = Ikemke ndise eigenvalue matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } idụhe ke pattern, ntre enye eyesobo ebiet oro asakke n̄kanika kpukpru ini.
       *[other] `<matchesPattern>`: mme parameter { $parameters } idụhe ke pattern, ntre mmọ ẹyesobo ebiet oro asakke n̄kanika kpukpru ini.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ikemke ndise grid="{ $grid }". Ana edi none, medium, dense, m̀mê number iba oro ẹsịnede space ufọt mmọ, ntre grid="1 0.5". Idụhe grid oro ẹdide ndise.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" idotke ke prefigure renderer; owo ada usụn̄ right-position.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" idotke ke prefigure renderer; owo ada usụn̄ top-position.

prefigure-invalid-axis-bounds = `<graph>`: udọk axis oro ẹkenọde ntak prefigure conversion idotke; owo ada default bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ibat oro ẹkenọde ntak prefigure conversion idotke; owo ada default diagram width 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio oro ẹkenọde ntak prefigure conversion idotke; owo ada default aspect ratio 1.

prefigure-grid-spacing-too-fine = `<graph>`: ufan̄ grid esịmde ntak udọk axis; owo osio grid ke prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: idikemke ndise annotations edieke owo mîdade PreFigure renderer.

multiple-annotations-children = Ẹkụt ediwak eyen `<annotations>` ke `<graph>`; owo osio kpukpru mmọ ke ibiere utịt.

## Referring to other components

copy-unrecognized-component-type = Ikemke ndikpon̄ m̀mê ndifiak nnam orụk n̄kpọ oro owo mîfiọkke: { $type }.

copy-prop-not-found = Ikemke n̄kụt prop { $property } ke n̄kpọ orụk { $component }

collect-no-source = Ikụtke source ntak collect.

collect-invalid-component-type = Ikemke ndibon̄ọ n̄kpọ orụk `<{ $component }>` koro enye edi orụk n̄kpọ oro idotke.

reference-index-unavailable = Ikemke ndida reference nnyụn̄ n̄kụt index `{ $reference }`

## `<callAction>`

component-action-unavailable = Ikemke ndikot { $action } ke n̄kpọ `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = N̄kpọ enyene orụk oro idotke. Ubọk enyene udọk oro mînanke. Ẹkụt ke componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = N̄kpọ enyene enyịn̄ ọtọn̄ọ oro ẹfiakde ẹwet. Ẹkụt ke componentIdx :{ $componentIdx }

data-frame-missing-column-name = N̄kpọ imenke enyịn̄ ọtọn̄ọ. Ẹkụt ke componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award ntak answer emi ọkọn̄ọde ke ibọrọ answer emi ke idem, emi eyenam n̄kpọ eke owo mîdorike enyịn̄.

answer-max-num-attempts-in-section-wide-check-work = Ndisịn `maxNumAttempts` ke `<answer>` ke esịt container oro enyenede `sectionWideCheckWork` inyeneke uduak, koro ediwak ndomo ẹdi ke ubọk container. Sịn `maxNumAttempts` ke container ke idem.

nested-section-wide-check-work-max-num-attempts = Ndisịn `maxNumAttempts` ke container oro enyenede `sectionWideCheckWork` emi odude ke esịt container efen oro enyenede `sectionWideCheckWork` inyeneke uduak, koro ediwak ndomo ẹdi ke ubọk container eke enyọn̄. Sịn `maxNumAttempts` ke container eke enyọn̄ ke idem.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attribute { $attributes } inyeneke uduak edieke owo mîsịnke symbolicEquality.
       *[other] Mme attribute { $attributes } inyeneke uduak edieke owo mîsịnke symbolicEquality.
    }

answer-invalid-type = Type ntak answer idotke: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sia n̄kpọ `<{ $component }>` mîdụhede enyịn̄, ikemke ndida enye nte attribute ntak module

module-attribute-name-already-defined = Ikemke ndida `<{ $component } name="{ $name }">` nte attribute ntak module koro orụk n̄kpọ `<module>` mma ọdi enyene attribute "{ $name }" ke mbemiso.

conditional-content-condition-ignored = Owo osio attribute `condition` ke `<conditionalContent>` oro enyenede case m̀mê else eyen.

slider-markers-type-mismatch = Type markers inyeneke uduak ye type slider.

pretzel-problem-needs-statement-and-answer = `<pretzel>` idotke: kpukpru `<problem>` ana enyene `<statement>` kiet ye `<answer>` kiet.

pretzel-circuit-first-problem-distractor = `<pretzel>` idotke: ke mode="circuit", akpa `<problem>` ikemke ndidi distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Uduak { $values } idotke ntak attribute `{ $attribute }`; owo osio.
       *[other] Mme uduak { $values } ẹdotke ntak attribute `{ $attribute }`; owo osio.
    }

attribute-must-be-references = Uduak `{ $value }` idotke ntak attribute `{ $attribute }`. Attribute ana ọdi ke mme reference oro ọtọn̄ọde ye `$`.

math-input-invalid-function-names = <mathInput>: owo osio enyịn̄ function oro idotke ke { $attribute }: { $names }. Ubak ndise enyịn̄ kiet kiet ana enyene ke ikan̄ n̄wed iba (n̄wed m̀mê mme dash); usụn̄ `|<mathspeak eke efen>` ekeme ndidọk edem.

## Building components from the source

component-type-invalid = Orụk n̄kpọ idotke: `<{ $componentType }>`

attribute-repeated = Ikemke ndifiak ndiwet attribute { $attribute }.

attribute-invalid-for-component = Attribute "{ $attribute }" idotke ntak n̄kpọ orụk `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Style definition { $styleNumber } inyeneke ukpọn̄kpọn̄ oro ekemde ntak { $context ->
        [text-on-background] enyịn̄ text ye enyịn̄ efep
        [high-contrast] enyịn̄ high-contrast ye canvas
        [line] enyịn̄ ọfụhọ ye canvas
        [marker] enyịn̄ marker ye canvas
       *[text-on-canvas] enyịn̄ text ye canvas
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ana enyene ke ekemede { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Okposụkedi style definition { $styleNumber } ekesịnde mme enyịn̄ oro ẹnọde ukpọn̄kpọn̄ oro ekemde ntak light mode, mme enyịn̄ dark-mode oro ẹdade ke uduak emi inyeneke ukpọn̄kpọn̄ oro ekemde ntak enyịn̄ text ye enyịn̄ efep ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ana enyene ke ekemede { $threshold }:1). { $suggestion ->
        [available] Man ọnọ ukpọn̄kpọn̄ oro ekemde ke dark mode, kponi ukpọn̄kpọn̄ light-mode (ke uwụtn̄kpọ, sịn { $lightAttribute }="{ $lightColor }") m̀mê fiak nnam enyịn̄ dark-mode (ke uwụtn̄kpọ, sịn { $darkAttribute }="{ $darkColor }").
       *[none] Man ọnọ ukpọn̄kpọn̄ oro ekemde ke dark mode, kponi ukpọn̄kpọn̄ light-mode m̀mê fiak nnam mme enyịn̄ oro ẹdade ye textColorDarkMode ye/m̀mê backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Okposụkedi style definition { $styleNumber } ekesịnde enyịn̄ text oro ẹnọde ukpọn̄kpọn̄ oro ekemde ntak light mode, enyịn̄ text dark-mode oro ẹdade ke uduak emi inyeneke ukpọn̄kpọn̄ oro ekemde ye canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ana enyene ke ekemede { $threshold }:1). { $suggestion ->
        [available] Man ọnọ ukpọn̄kpọn̄ oro ekemde ke dark mode, kponi ukpọn̄kpọn̄ light-mode (ke uwụtn̄kpọ, sịn textColor="{ $lightColor }") m̀mê fiak nnam enyịn̄ dark-mode (ke uwụtn̄kpọ, sịn textColorDarkMode="{ $darkColor }").
       *[none] Man ọnọ ukpọn̄kpọn̄ oro ekemde ke dark mode, kponi ukpọn̄kpọn̄ light-mode m̀mê fiak nnam enyịn̄ oro ẹdade ye textColorDarkMode.
    }

section-multiple-style-palettes = Ikpehe ekeme ndimek stylePalette kiet ke idem; owo ada eke utịt.

## Unique variants

variant-num-to-select-not-non-negative-integer = ikemke ndifiọk unique variants { $component } koro numToSelect idịghe non-negative integer.

variant-num-to-select-not-constant-number = ikemke ndifiọk unique variants { $component } koro numToSelect idịghe constant number.

variant-with-replacement-not-constant-boolean = ikemke ndifiọk unique variants { $component } koro withReplacement idịghe constant boolean.

variant-select-weight-disables-unique = Unique variants ntak select isionke edieke option kiet enyenede selectWeight m̀mê selectForVariants

variant-coprime-undetermined = ikemke ndifiọk unique variants { $component } koro ikemke ndifiọk coprime esosop edi mîdịghe.

variant-attribute-not-constant = ikemke ndifiọk unique variants { $component } koro { $attribute } idịghe constant.

variant-attribute-not-number = ikemke ndifiọk unique variants { $component } koro { $attribute } idịghe number.

variant-attribute-wrong-type-for-sequence =
    ikemke ndifiọk unique variants { $component } orụk { $type } koro { $attribute } idịghe { $expected ->
        [letters-combination] udian n̄wed
        [math-expression] ikọ math oro edide
        [integer] integer
       *[number] number
    }.

variant-length-not-integer = ikemke ndifiọk unique variants { $component } koro length idịghe integer.

variant-sort-not-implemented = owo mîkenamke unique variants { $component } ye sort

variant-exclude-combinations-not-implemented = owo mîkenamke unique variants { $component } ye excludeCombinations

variant-math-exclude-not-implemented = owo mîkenamke unique variants { $component } orụk math ye exclude

variant-non-constant-exclude-not-implemented = owo mîkenamke unique variants { $component } ye exclude oro mîdịghede constant

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: idotke ke graph prefigure renderer; owo osio eyen emi.

prefigure-descendant-invalid-geometry = { $subject }: geometry idotke m̀mê isuhọke; owo osio eyen emi.

prefigure-curve-label-omitted = { $subject }: labels idotke ntak curve elements oro ẹkpụhọde; owo osio label.

prefigure-curve-unsupported-definition-type = { $subject }: type ntịn̄ function curve '{ $definitionType }' idotke; owo osio eyen emi.

prefigure-region-flip-functions-unsupported = { $subject }: attribute flipFunctions ke regionBetweenCurves idotke; owo osio eyen emi.

prefigure-region-non-formula-child = { $subject }: mme eyen function oro edide formula kpọt ẹdotke ke regionBetweenCurves; owo osio eyen emi.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' idotke ntak { $labelKind ->
        [line-family] label eke ọfụhọ
       *[point] label eke ntọt
    }; owo ada usụn̄ PreFigure alignment eke akpa.

prefigure-fill-style-unsupported = { $subject }: fill style '{ $fillStyle }' idotke ntak PreFigure; owo ada solid fill.

prefigure-line-style-unknown = { $subject }: line style '{ $lineStyle }' owo mîfiọkke; owo osio ke PreFigure output.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker style '{ $markerStyle }' owo ada nte PreFigure style 'diamond'.

prefigure-marker-style-unsupported = { $subject }: marker style '{ $markerStyle }' idotke ntak PreFigure; owo ada style eke akpa.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` idotke; ikemke ndisọn̄ọ target. Owo osio annotation.

annotation-ref-multiple-targets = `<annotation>`: `ref` ọsọn̄ọ ediwak target; owo ada target eke akpa.

annotation-ref-outside-graph = `<annotation>`: `ref` idotke; target odu ke ufan̄ graph. Owo osio annotation.

annotation-ref-unsupported-target = `<annotation>`: `ref` idotke; target idịghe n̄kpọ graphical oro ẹsọn̄de ke prefigure conversion. Owo osio annotation.

annotation-text-missing = `<annotation>`: `text` idụhe m̀mê ọfọn ikpehe; owo esio text oro ikpehe.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ẹkụt circular dependency.
       *[other] Ẹkụt circular dependency oro ọdụkde `<{ $componentType }>`.
    }

reference-no-referent = Ikụtke n̄kpọ oro reference emi ọdọhọde: `{ $reference }`

reference-multiple-referents = Ẹkụt ediwak n̄kpọ oro reference emi ọdọhọde: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ndise attribute { $attribute } ke `<{ $componentType }>` idotke.

children-invalid = Eyen n̄kpọ ntak `<{ $componentType }>` idotke: Ẹkụt mme eyen oro idotke: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Uduak `{ $value }` idotke ntak attribute `{ $attribute }`, owo ada uduak `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ikụtke DoenetML version { $version }.
       *[other] Ikụtke DoenetML version { $version }. Owo ada version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML idotke: { $content }

parse-tag-missing-close-tag = DoenetML idotke: Tag `{ $tag }` inyeneke tag eke ọfịkde. Owo ekeyom self-closing tag m̀mê `</{ $tagName }>` tag.

parse-tag-error = DoenetML idotke: Ndudue ke tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML idotke: Attribute `{ $attribute }` idotke ọsọn̄ọ imenke uduak.

parse-attribute-invalid = DoenetML idotke: Attribute `{ $attribute }` idotke

parse-attribute-value-invalid = DoenetML idotke: Uduak attribute `{ $value }` idotke

parse-attribute-value-quote-mismatch = DoenetML idotke: Uduak attribute `{ $value }` idotke. Mme quote mark inanke. Ọsọn̄ọ afo imenke `{ $quote }`

parse-open-tag-name-missing = DoenetML idotke: Ẹkụt tag oro mîdụhede enyịn̄ tag, uwụtn̄kpọ `<`

parse-tag-not-closed = DoenetML idotke: Tag `{ $tag }` mîfịkke (adan̄a enye imenke `>`).

parse-self-closing-tag-name-missing = DoenetML idotke: Ẹkụt tag oro mîdụhede enyịn̄ tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML idotke: Tag `{ $tag }` mîfịkke (adan̄a enye imenke `/>`).

parse-tag-invalid-attributes = DoenetML idotke: Tag `{ $tag }` idịghe eke edide. Ekeme ndinyene mme attribute oro idotke.

parse-close-tag-name-missing = DoenetML idotke: Ẹkụt tag oro ọfịkde oro mîdụhede enyịn̄ tag, uwụtn̄kpọ `</`

parse-attribute-value-unquoted = Uduak attribute ana ọdụk ke esịt quote: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML idotke: Ẹkụt tag oro ọfịkde `{ $tag }`, edi idụhe tag oro ọberede ntak enye

parse-close-tag-mismatched = DoenetML idotke: Tag oro ọfịkde inanke. Ọsọn̄ọ `</{ $expected }>`. Ẹkụt `{ $found }`

parser-node-unconvertible = Ikemke n̄kpụhọ node { $node } ndidi Dast node.

## Names

name-attribute-invalid =
    Enyịn̄ attribute name='{ $name }' idotke. { $reason ->
        [characters] Mme enyịn̄ ẹkeme ndidu ke n̄wed, number, underscore, m̀mê hyphen kpọt.
       *[start] Mme enyịn̄ ana ẹtọn̄ọ ke n̄wed.
    }

component-name-invalid-start = Enyịn̄ n̄kpọ "{ $name }" idotke. Mme enyịn̄ ana ẹtọn̄ọ ke n̄wed.

## `<answer>` sugar

answer-video-watched-missing-video = Answer orụk videoWatched ana enyene attribute video

answer-video-watched-video-not-reference = Answer orụk videoWatched ana enyene attribute video oro edide reference

answer-name-not-single-text = Attribute name ntak Answer ana enyene eyen text kiet kpọt

## Referencing another document

external-doenetml-recursion-limit = Ikemke ndida DoenetML eke efen koro ediwak recursion akande udọk. N̄kpọ oro esiakde idem ekeme ndidu do?

external-doenetml-unavailable = Ikemke ndida DoenetML oto { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML oro ẹdade oto { $attribute }="{ $uri }" idotke: enye inanke ye orụk n̄kpọ "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` idotke; da `{ $to }` ke idem.
       *[other] [deprecation] Attribute `{ $from }` ke `<{ $component }>` idotke; da `{ $to }` ke idem.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` idotke, owo osio koro `{ $to }` ẹkenọ n̄kpọ.
       *[other] [deprecation] Attribute `{ $from }` ke `<{ $component }>` idotke, owo osio koro `{ $to }` ẹkenọ n̄kpọ.
    }

deprecated-attribute-ignored = [deprecation] Attribute `{ $attribute }` ke `<{ $component }>` idotke, owo osio.

deprecated-attribute-to-child = [deprecation] Attribute `{ $attribute }` ke `<{ $component }>` idotke; da eyen `<{ $child }>` ke idem.

deprecated-attribute-value-renamed = [deprecation] Uduak `{ $value }` attribute `{ $attribute }` ke `<{ $component }>` idotke; da `{ $to }` ke idem.


## Language coverage

pluralize-english-only = `<pluralize>` ekeme ndinam plural ntak Ikọ Mbakara kpọt, ntre text esọn̄ọde ke n̄wed oro ẹwetde ke { $locale }. Wet plural eke idem, m̀mê sịn ye attribute `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` idịghe element Doenet oro owo ọfiọkde.

schema-element-not-allowed-at-root = Element `<{ $tag }>` isionke ke enyọn̄ n̄wed.

schema-element-not-allowed-inside = Element `<{ $tag }>` isionke ke esịt `<{ $parent }>`.

schema-attribute-unrecognized = Element `<{ $tag }>` inyeneke attribute oro ekerede `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribute `{ $attribute }` element `<{ $tag }>` ana edi urua eke mme udian esịn kiet kiet ke: { $allowed }
       *[other] Attribute `{ $attribute }` element `<{ $tag }>` ana edi kiet ke: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Enyịn̄ variant ntak select idotke. Enyịn̄ variant { $variantName } ọdụk ke option { $numOptions } edi ediwak oro ana ẹmek edi { $numToSelect }.

select-variant-name-without-options = Ẹsịn mme variant ntak select edi idụhe option ntak enyịn̄ variant oro ekeme ndidi: { $variantName }.

select-variant-name-not-possible = Enyịn̄ variant { $variantName } oro ẹsịnde ntak select idịghe enyịn̄ variant oro ekemede ndidi.

select-too-few-options = Ikemke ndimek { $numToSelect } n̄kpọ ke option { $numOptions } kpọt.

select-from-sequence-too-few-values = Ikemke ndimek { $numToSelect } uduak ke sequence oro enyenede udọk { $length }.

select-from-sequence-indices-count-mismatch = Ediwak index oro ẹsịnde ntak select ana ọnọ adan̄a ye ediwak oro ana ẹmek

select-from-sequence-indices-not-integers = Kpukpru index oro ẹsịnde ntak select ana ẹdi integer

select-from-sequence-index-excluded = Index oro ẹsịnde ntak selectfromsequence oro ẹsiode

select-from-sequence-indices-excluded-combination = Mme index oro ẹsịnde ntak selectfromsequence oro ẹdide combination eke ẹsiode

select-from-sequence-coprime-not-positive-integers = Ikemke ndimek coprime combinations koro owo mîmekke positive integers.

select-from-sequence-coprime-common-factor = Ikemke ndimek coprime numbers. Kpukpru uduak oro ekemede ẹdụk ọtọn̄ọ kiet. (Uduak oro ẹsịnde ntak "from" m̀mê "to" ana ẹdi coprime ye "step".)

select-from-sequence-coprime-single-number = Ikemke ndimek coprime combinations ke number kiet oro mîdịghede 1.

select-from-sequence-excluded-too-many-combinations = Owo osio akande 70% mme combination ke selectFromSequence

select-from-sequence-coprime-none-found = Ikemke ndimek coprime numbers. Kpukpru uduak oro ekemede ẹdụk ọtọn̄ọ kiet.

select-from-sequence-too-few-unique-values = Ikemke ndimek { $numToSelect } uduak oro ẹfiakke ke sequence oro enyenede udọk { $numPossibleValues }

select-prime-numbers-too-few-values = Ikemke ndimek { $numToSelect } uduak ke urua prime oro enyenede udọk { $numValues }

select-prime-numbers-values-count-mismatch = Ediwak uduak oro ẹsịnde ntak select ana ọnọ adan̄a ye ediwak oro ana ẹmek

select-prime-numbers-values-not-prime = Kpukpru uduak oro ẹsịnde ntak select prime number ana ẹdu ke urua prime

select-prime-numbers-values-excluded-combination = Uduak oro ẹsịnde ntak selectPrimeNumbers ẹdi combination eke ẹsiode

select-prime-numbers-excluded-too-many-combinations = Owo osio akande 70% mme combination ke selectPrimeNumbers

select-random-combination-fluke = Ke ndudue oro isọn̄ke, ikemke ndimek combination uduak eke owo mîdorike enyịn̄

select-random-value-fluke = Ke ndudue oro isọn̄ke, ikemke ndimek uduak eke owo mîdorike enyịn̄
