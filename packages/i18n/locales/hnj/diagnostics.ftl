# Hmong Njua diagnostics. Translated from `locales/en/diagnostics.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
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
# Hmong does not inflect for number, so a countable message needs no selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } raug muab tso tseg thaum teev ob lub ntsis

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } raug muab tso tseg thaum teev ib lub ntsis thiab ib lub plawv

line-segment-midpoint-offset-without-midpoint = midpointOffset tsis muaj nqi yog tsis muaj lub plawv

## `<line>`

line-points-undetermined-dimensions = Kab hla cov taw uas tsis paub tias muaj pes tsawg sab.

line-points-too-few-dimensions = Ib kab yuav tsum hla cov taw uas muaj tsawg kawg ob sab.

line-points-depend-on-variables = Kab hla cov taw uas cuam tshuam nrog cov hloov pauv: { $variables }.

line-equation-invalid-format = Cov qauv tsis raug rau kab li lus zauv nyob hauv cov hloov pauv { $variable1 } thiab { $variable2 }.

## `<ray>`

ray-overprescribed-through = Kab tshav teev los ntawm through, endpoint thiab direction. Cov through uas teev raug muab tso tseg.

ray-dimension-mismatch = numDimensions tsis sib haum hauv kab tshav.

## `<vector>`

vector-overprescribed-head = Kab qhia kev teev los ntawm head, tail thiab displacement. Cov head uas teev raug muab tso tseg.

vector-dimension-mismatch = numDimensions tsis sib haum hauv kab qhia kev.

## Attracting and constraining

attract-to-without-nearest-point = Tsis tuaj yeem nyiam mus rau `<{ $component }>`, vim nws tsis muaj tus hloov pauv xwm txheej nearestPoint.

constrain-to-without-nearest-point = Tsis tuaj yeem txwv rau `<{ $component }>`, vim nws tsis muaj tus hloov pauv xwm txheej nearestPoint.

constrain-to-interior-without-nearest-point = Tsis tuaj yeem txwv rau hauv `<{ $component }>`, vim nws tsis muaj tus hloov pauv xwm txheej nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition raug muab tso tseg rau choiceInput uas tsis nyob hauv kab

## Ordering children by index

choice-input-indices-count-mismatch = Cov indices uas teev rau choiceInput raug muab tso tseg, vim tus naj npawb tsis phim tus naj npawb ntawm cov menyuam choice.

pretzel-indices-count-mismatch = Cov indices uas teev rau problem raug muab tso tseg, vim tus naj npawb tsis phim tus naj npawb ntawm cov menyuam problem.

shuffle-indices-count-mismatch = Cov indices uas teev rau shuffle raug muab tso tseg, vim tus naj npawb tsis phim tus naj npawb ntawm cov feem.

indices-ignored-out-of-range = Cov indices uas teev rau { $component } raug muab tso tseg, vim qee qhov dhau caij.

pretzel-indices-repeated = Cov indices uas teev rau pretzel raug muab tso tseg, vim qee qhov rov qab.

pretzel-circuit-first-index = Cov indices uas teev rau pretzel hauv hom circuit raug muab tso tseg, vim thawj tus index yuav tsum yog 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Kom `<{ $component }>` ua tau nrog cov menyuam ntawv, yuav tsum teev tus cwj pwm `type`.

invalid-type-defaulting-to-math = Hom { $type } tsis raug rau feem { $component }. Nws yuav tsum yog math, text, number los yog boolean. Siv math.

string-not-valid-component-to-arrange = Cov ntawv "{ $value }" tsis yog ib feem raug rau { $component }. Muab tso tseg.

## Types and variables

invalid-type-defaulting-to-number = Hom { $type } tsis raug; hom raug teem ua number.

invalid-variable-value = Tus nqi hloov pauv tsis raug: `{ $value }`

## Variants

variant-index-must-be-number = Tus index ntawm hom { $index } yuav tsum yog tus naj npawb

variant-index-must-be-integer = Tus index ntawm hom { $index } yuav tsum yog tus lej tag nrho

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` tsis tau ua rau cov ntsuas tseeb. Cov dav raug hloov ua nqi sib txuas.

side-by-side-absolute-margins = `<{ $component }>` tsis tau ua rau cov ntsuas tseeb. Cov npoo raug hloov ua nqi sib txuas.

side-by-side-no-block-child = `<{ $component }>` tsis raug: nws yuav tsum muaj tsawg kawg ib tug menyuam bloke.

## `<label>`

label-for-ignored-on-graphical = Tus cwj pwm `for` ntawm `<label>` duab raug muab tso tseg.

label-for-must-resolve-to-one = Tus cwj pwm `for` ntawm `<label>` yuav tsum ncaj nraim mus rau ib feem.

label-for-unresolved = Tus cwj pwm `for` ntawm `<label>` tsis tuaj yeem ntsib ib feem.

label-for-answer-with-authored-inputs = Tus cwj pwm `for` ntawm `<label>` hais txog `<answer>` uas muaj cov gelin sau tseeb; hais ncaj qha rau cov gelin.

label-for-answer-without-input = Tus cwj pwm `for` ntawm `<label>` hais txog `<answer>` uas tsis muaj gelin los sau npe.

label-for-must-reference-input-or-answer = Tus cwj pwm `for` ntawm `<label>` yuav tsum hais txog ib qhov gelin los yog ib lo lus teb.

## Accessibility

accessibility-short-description-or-decorative = Vim kev nkag tau, `<{ $component }>` yuav tsum muaj ib lo lus qhia luv los yog raug teev ua qhov kho kom zoo nkauj.

accessibility-video-short-description = Vim kev nkag tau, `<video>` yuav tsum muaj ib lo lus qhia luv.

accessibility-input-short-description-or-label = Vim kev nkag tau, `<{ $component }>` yuav tsum muaj ib lo lus qhia luv los yog ib lub npe.

accessibility-answer-input-short-description-or-label = Vim kev nkag tau, ib tug `<answer>` uas tsim gelin yuav tsum muaj ib lo lus qhia luv los yog ib lub npe.

accessibility-short-description-contains-math = Cov lus qhia luv tsis txhob muaj cov feem lej li `<{ $component }>`. Sau cov lej ua lus.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } qhov txawv tsis txaus rau cov ntawv npe ntu (hom tsaus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; xav kom tsawg kawg { $threshold }:1).
       *[other] { $colorName } qhov txawv tsis txaus rau cov ntawv npe ntu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; xav kom tsawg kawg { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` hla { $count } lub taw tsis tau ua thaum cov taw tsis muaj nqi lej.

circle-too-many-through-points = Tsis tuaj yeem xam lub voj voog hla ntau tshaj 3 lub taw.

circle-overprescribed-radius-center-points = Tsis tuaj yeem xam lub voj voog uas teev cov kwv, plawv thiab cov taw.

circle-center-with-multiple-points = Tsis tuaj yeem xam lub voj voog uas teev lub plawv thiab hla ntau tshaj 1 lub taw.

circle-radius-too-small = Tsis tuaj yeem xam lub voj voog: vim qhov ntev ntawm ob lub taw yog { $distance }, tus kwv teev { $radius } me dhau.

circle-radius-with-many-points = Tsis tuaj yeem tsim lub voj voog hla ntau tshaj ob lub taw nrog tus kwv teev.

circle-invalid-center-or-through-points = Lub plawv los yog cov taw hla ntawm lub voj voog tsis raug.

circle-radius-center-with-multiple-points = Tsis tuaj yeem xam tus kwv ntawm lub voj voog uas teev lub plawv thiab hla ntau tshaj 1 lub taw.

circle-change-radius-non-numerical = Tsis tuaj yeem hloov tus kwv ntawm lub voj voog uas cov taw tsis yog lej

circle-radius-with-points-non-numerical = Tsis tuaj yeem tsim lub voj voog hla ntau tshaj ib lub taw nrog tus kwv teev thaum tsis muaj nqi lej.

circle-change-center-non-numerical = Kev hloov lub plawv ntawm lub voj voog hla cov taw tsis yog lej tsis tau ua.

## `<function>`

function-domain-insufficient-dimensions = Tsis muaj sab txaus rau thaj tsam ntawm kev suav. Thaj tsam muaj { $intervals } ntu tab sis kev suav muaj { $inputs } qhov nkag.

function-domain-invalid-format = Cov qauv tsis raug rau thaj tsam ntawm kev suav.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Qhov siab tshaj plaws tsis yog lej ntawm kev suav raug muab tso tseg.
        [minimum] Qhov qis tshaj plaws tsis yog lej ntawm kev suav raug muab tso tseg.
        [extremum] Qhov kawg tsis yog lej ntawm kev suav raug muab tso tseg.
        [point] Lub taw tsis yog lej ntawm kev suav raug muab tso tseg.
        [slope] Qhov nqes tsis yog lej ntawm kev suav raug muab tso tseg.
       *[other] { $type } tsis yog lej ntawm kev suav raug muab tso tseg.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Qhov siab tshaj plaws khoob ntawm kev suav raug muab tso tseg.
        [minimum] Qhov qis tshaj plaws khoob ntawm kev suav raug muab tso tseg.
        [extremum] Qhov kawg khoob ntawm kev suav raug muab tso tseg.
        [point] Lub taw khoob ntawm kev suav raug muab tso tseg.
       *[other] { $type } khoob ntawm kev suav raug muab tso tseg.
    }

function-points-too-close = Kev suav muaj ob lub taw uas nyob ze dhau. Tsis tuaj yeem txhais kev suav.

function-iterates-input-output-mismatch = Kev rov ua kev suav yuav ua tau yog tias tus naj npawb ntawm cov nkag sib npaug tus naj npawb ntawm cov tawm. Kev suav no muaj { $inputs } qhov nkag thiab { $outputs } qhov tawm.

## `<sequence>`

sequence-invalid-length = Qhov ntev ntawm cov txheej txheem tsis raug. Nws yuav tsum yog ib tug lej tag nrho uas tsis tsawg dua xoom.

sequence-invalid-step = Cov kauj ruam ntawm cov txheej txheem tsis raug. Nws yuav tsum yog tus naj npawb rau cov txheej txheem hom { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" tsis raug rau cov txheej txheem naj npawb. Nws yuav tsum yog tus naj npawb.

sequence-invalid-endpoint-letters = "{ $attribute }" tsis raug rau cov txheej txheem tsiaj ntawv. Nws yuav tsum yog cov tsiaj ntawv sib xyaw.

sequence-invalid-endpoint = "{ $attribute }" tsis raug rau cov txheej txheem.

select-from-sequence-coprime-not-numbers = coprime raug muab tso tseg vim tsis xaiv cov naj npawb

select-from-sequence-coprime-with-exclude-combinations = coprime raug muab tso tseg vim teev excludeCombinations

## Resolving a `target`

target-not-found = target tsis raug rau `<{ $source }>`: tsis pom lub hom phiaj.

target-state-variable-not-found = target tsis raug rau `<{ $source }>`: tsis pom tus hloov pauv xwm txheej npe "{ $property }" ntawm `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Cov hloov pauv ntawm `<odeSystem>` yuav tsum txawv ntawm tus hloov pauv ywj pheej.

ode-system-duplicate-variable-names = Tsis tuaj yeem txhais cov ODE sab xis nrog cov npe hloov pauv rov qab.

ode-system-rhs-function-error = Tsis tuaj yeem txhais ODE sab xis. Muaj yuam kev thaum tsim kev suav mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Tsis tuaj yeem txhais lub kaum ntawm { $count } kab

angle-invalid-through-point = Lub taw tsis raug hauv through ntawm `<angle>`

parabola-vertex-too-many-points = Parabola nrog lub ntsis teev hla ntau tshaj 1 lub taw tsis tau ua.

parabola-too-many-points = Parabola hla ntau tshaj 3 lub taw tsis tau ua.

intersection-too-many-items = Kev sib tshuam ntawm ntau tshaj ob yam tsis tau ua

## Other math components

ionic-compound-not-two-ions = Cov tshuaj ion uas tsis yog ob lub ion tsis tau ua.

ionic-compound-needs-cation-and-anion = Cov tshuaj ion tsuas ua rau ib lub cation thiab ib lub anion.

solve-equations-cannot-evaluate = Tsis tuaj yeem daws li lus zauv vim tsis tuaj yeem xam nws: { $equation }

math-operators-operand-number-required = Yuav tsum teev operandNumber thaum rho ib qho lej.

eigen-decomposition-failed = Tsis tuaj yeem xam cov nqi eigen ntawm matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: tus tsis pom hauv tus qauv { $parameters }, yog li nws yuav phim qhov khoob txhua zaus.

## `<graph>`

graph-grid-invalid = `<graph>`: tsis tuaj yeem txhais grid="{ $grid }". Nws yuav tsum yog none, medium, dense, los yog ob tug naj npawb zoo cais nrog ib qho chaw, xws li grid="1 0.5". Tsis muaj cov kab txaij raug kos.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" tsis txhawb nqa hauv qhov muaj prefigure; siv tus cwj pwm ntawm sab xis.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" tsis txhawb nqa hauv qhov muaj prefigure; siv tus cwj pwm ntawm sab saum.

prefigure-invalid-axis-bounds = `<graph>`: cov ciam teb kab tsis raug rau kev hloov prefigure; siv bbox ib txwm (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: qhov dav tsis raug rau kev hloov prefigure; siv qhov dav ib txwm 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio tsis raug rau kev hloov prefigure; siv qhov piv ib txwm 1.

prefigure-grid-spacing-too-fine = `<graph>`: cov kab txaij nyob ze dhau rau cov ciam teb kab; cov kab txaij raug tso tseg hauv qhov muaj prefigure.

prefigure-annotations-not-rendered = `<graph>`: cov ntawv sau ntxiv tsis muaj thaum tsis siv qhov muaj PreFigure.

multiple-annotations-children = Pom ntau tus menyuam `<annotations>` hauv `<graph>`; txhua tus tsuas tshuav tus kawg raug muab tso tseg.

## Referring to other components

copy-unrecognized-component-type = Tsis tuaj yeem txuas ntxiv los yog theej ib hom feem uas tsis paub: { $type }.

copy-prop-not-found = Tsis pom qhov { $property } ntawm ib feem hom { $component }

collect-no-source = Tsis pom lub hauv paus rau collect.

collect-invalid-component-type = Tsis tuaj yeem khaws cov feem hom `<{ $component }>` vim nws tsis yog hom feem raug.

reference-index-unavailable = Tsis tuaj yeem hais txog tus index `{ $reference }`

## `<callAction>`

component-action-unavailable = Tsis tuaj yeem hu { $action } ntawm feem `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Cov ntaub ntawv muaj cov qauv tsis raug. Cov kab ntev tsis sib xws. Pom hauv componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Cov ntaub ntawv muaj cov npe kem rov qab. Pom hauv componentIdx :{ $componentIdx }

data-frame-missing-column-name = Cov ntaub ntawv tsis muaj ib lub npe kem. Pom hauv componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ib qho award ntawm lo lus teb no cuam tshuam nrog lo lus teb uas tag answer xa tuaj, uas yuav ua rau muaj kev tsis xav txog.

answer-max-num-attempts-in-section-wide-check-work = Teem `maxNumAttempts` rau ib tug `<answer>` uas nyob hauv ib lub thawv nrog `sectionWideCheckWork` tsis muaj nqi, vim tus naj npawb sim raug tswj los ntawm lub thawv. Teem `maxNumAttempts` rau lub thawv.

nested-section-wide-check-work-max-num-attempts = Teem `maxNumAttempts` rau ib lub thawv nrog `sectionWideCheckWork` uas nyob hauv lwm lub thawv nrog `sectionWideCheckWork` tsis muaj nqi, vim tus naj npawb sim raug tswj los ntawm lub thawv sab nraud. Teem `maxNumAttempts` rau lub thawv sab nraud.

answer-attributes-need-symbolic-equality = Tus cwj pwm { $attributes } tsis muaj nqi yog tsis muaj symbolicEquality.

answer-invalid-type = Hom tsis raug rau answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Vim feem `<{ $component }>` tsis muaj npe, nws tsis tuaj yeem siv ua ib tus cwj pwm module

module-attribute-name-already-defined = Feem `<{ $component } name="{ $name }">` tsis tuaj yeem siv ua ib tus cwj pwm rau module, vim hom feem `<module>` twb muaj ib tus cwj pwm "{ $name }" lawm.

conditional-content-condition-ignored = Tus cwj pwm `condition` raug muab tso tseg ntawm feem `<conditionalContent>` uas muaj cov menyuam case los yog else.

slider-markers-type-mismatch = Hom cov cim tsis phim hom tus slider.

pretzel-problem-needs-statement-and-answer = pretzel tsis raug: txhua `<problem>` yuav tsum muaj ib `<statement>` thiab ib `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel tsis raug: hauv mode="circuit", thawj `<problem>` tsis tuaj yeem ua tus ntxias.

## Attribute values

attribute-invalid-values = Tus nqi { $values } tsis raug rau tus cwj pwm `{ $attribute }`; muab tso tseg.

attribute-must-be-references = Tus nqi `{ $value }` tsis raug rau tus cwj pwm `{ $attribute }`. Tus cwj pwm yuav tsum muaj cov tswv yim uas pib nrog `$`.

math-input-invalid-function-names = <mathInput>: muab cov npe kev suav tsis raug hauv { $attribute } tso tseg: { $names }. Feem qhia ntawm txhua lub npe yuav tsum muaj tsawg kawg 2 tus cim (tsiaj ntawv los yog jiid); tom qab ntawd tuaj yeem muaj lifaaq `|<lwm txoj mathspeak>`.

## Building components from the source

component-type-invalid = Hom feem tsis raug: `<{ $componentType }>`

attribute-repeated = Tus cwj pwm { $attribute } tsis tuaj yeem rov qab.

attribute-invalid-for-component = Tus cwj pwm "{ $attribute }" tsis raug rau ib feem hom `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Qhov txhais tus qauv { $styleNumber } qhov txawv tsis txaus rau { $context ->
        [text-on-background] xim ntawv piv rau xim keeb
        [high-contrast] xim txawv siab piv rau daim phiaj
        [line] xim kab piv rau daim phiaj
        [marker] xim cim piv rau daim phiaj
       *[text-on-canvas] xim ntawv piv rau daim phiaj
    }{ $mode ->
        [dark] { " (hom tsaus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; xav kom tsawg kawg { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Txawm hais tias qhov txhais tus qauv { $styleNumber } tau teev cov xim uas muaj qhov txawv txaus rau hom kaj, cov xim hom tsaus uas tau los ntawm cov nqi ntawd muaj qhov txawv tsis txaus rau xim ntawv piv rau xim keeb ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; xav kom tsawg kawg { $threshold }:1). { $suggestion ->
        [available] Kom muaj qhov txawv txaus hauv hom tsaus, muab qhov txawv hom kaj tsav ntxiv (piv txwv, teem { $lightAttribute }="{ $lightColor }") los yog hloov xim hom tsaus (piv txwv, teem { $darkAttribute }="{ $darkColor }").
       *[none] Kom muaj qhov txawv txaus hauv hom tsaus, muab qhov txawv hom kaj tsav ntxiv los yog hloov cov xim uas tau los siv textColorDarkMode thiab/los yog backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Txawm hais tias qhov txhais tus qauv { $styleNumber } tau teev ib xim ntawv uas muaj qhov txawv txaus rau hom kaj, xim ntawv hom tsaus uas tau los ntawm tus nqi ntawd muaj qhov txawv tsis txaus piv rau daim phiaj ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; xav kom tsawg kawg { $threshold }:1). { $suggestion ->
        [available] Kom muaj qhov txawv txaus hauv hom tsaus, muab qhov txawv hom kaj tsav ntxiv (piv txwv, teem textColor="{ $lightColor }") los yog hloov xim hom tsaus (piv txwv, teem textColorDarkMode="{ $darkColor }").
       *[none] Kom muaj qhov txawv txaus hauv hom tsaus, muab qhov txawv hom kaj tsav ntxiv los yog hloov xim uas tau los siv textColorDarkMode.
    }

section-multiple-style-palettes = Ib ntu tsuas xaiv tau ib qho <stylePalette>; siv qhov kawg.

## Unique variants

variant-num-to-select-not-non-negative-integer = tsis tuaj yeem paub cov hom tshwj xeeb ntawm { $component }, vim numToSelect tsis yog ib tug lej tag nrho uas tsis tsawg dua xoom.

variant-num-to-select-not-constant-number = tsis tuaj yeem paub cov hom tshwj xeeb ntawm { $component }, vim numToSelect tsis yog tus naj npawb nyob ruaj.

variant-with-replacement-not-constant-boolean = tsis tuaj yeem paub cov hom tshwj xeeb ntawm { $component }, vim withReplacement tsis yog tus nqi boole nyob ruaj.

variant-select-weight-disables-unique = Cov hom tshwj xeeb rau select raug kaw yog tias ib qho kev xaiv teev selectWeight los yog selectForVariants

variant-coprime-undetermined = tsis tuaj yeem paub cov hom tshwj xeeb ntawm { $component }, vim tsis tuaj yeem paub tias coprime yog cuav txhua zaus.

variant-attribute-not-constant = tsis tuaj yeem paub cov hom tshwj xeeb ntawm { $component }, vim { $attribute } tsis nyob ruaj.

variant-attribute-not-number = tsis tuaj yeem paub cov hom tshwj xeeb ntawm { $component }, vim { $attribute } tsis yog tus naj npawb.

variant-attribute-wrong-type-for-sequence =
    tsis tuaj yeem paub cov hom tshwj xeeb ntawm { $component } hom { $type }, vim { $attribute } tsis yog { $expected ->
        [letters-combination] cov tsiaj ntawv sib xyaw
        [math-expression] cov lej raug
        [integer] tus lej tag nrho
       *[number] tus naj npawb
    }.

variant-length-not-integer = tsis tuaj yeem paub cov hom tshwj xeeb ntawm { $component }, vim length tsis yog tus lej tag nrho.

variant-sort-not-implemented = cov hom tshwj xeeb ntawm { $component } nrog sort tsis tau ua

variant-exclude-combinations-not-implemented = cov hom tshwj xeeb ntawm { $component } nrog excludeCombinations tsis tau ua

variant-math-exclude-not-implemented = cov hom tshwj xeeb ntawm { $component } hom math nrog exclude tsis tau ua

variant-non-constant-exclude-not-implemented = cov hom tshwj xeeb ntawm { $component } nrog exclude uas tsis nyob ruaj tsis tau ua

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: tsis txhawb nqa hauv qhov muaj prefigure ntawm daim duab; hla tus xeeb ntxwv.

prefigure-descendant-invalid-geometry = { $subject }: cov qauv tsis kawg los yog tsis tiav; hla tus xeeb ntxwv.

prefigure-curve-label-omitted = { $subject }: cov npe tsis txhawb nqa ntawm cov kab nkhaus uas hloov lawm; tso lub npe tseg.

prefigure-curve-unsupported-definition-type = { $subject }: hom txhais kev suav kab nkhaus '{ $definitionType }' tsis txhawb nqa; hla tus xeeb ntxwv.

prefigure-region-flip-functions-unsupported = { $subject }: tus cwj pwm flipFunctions ntawm regionBetweenCurves tsis txhawb nqa; hla tus xeeb ntxwv.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves tsuas txhawb nqa cov kev suav menyuam uas yog qauv lej; hla tus xeeb ntxwv.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' tsis txhawb nqa rau { $labelKind ->
        [line-family] lub npe ntawm tsev neeg kab
       *[point] lub npe taw
    }; siv PreFigure kev sib npaug ib txwm.

prefigure-fill-style-unsupported = { $subject }: hom ntim '{ $fillStyle }' PreFigure tsis txhawb nqa; siv ib qho ntim xim ib yam.

prefigure-line-style-unknown = { $subject }: hom kab '{ $lineStyle }' tsis paub, tso tseg ntawm cov tawm PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: hom cim '{ $markerStyle }' hloov mus ua hom PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: hom cim '{ $markerStyle }' PreFigure tsis txhawb nqa; siv hom ib txwm.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` tsis raug; tsis tuaj yeem ntsib lub hom phiaj. Tso cov ntawv sau ntxiv tseg.

annotation-ref-multiple-targets = `<annotation>`: `ref` ntsib ntau lub hom phiaj; siv thawj lub.

annotation-ref-outside-graph = `<annotation>`: `ref` tsis raug; lub hom phiaj nyob sab nraud daim duab. Tso cov ntawv sau ntxiv tseg.

annotation-ref-unsupported-target = `<annotation>`: `ref` tsis raug; lub hom phiaj tsis yog ib yam duab uas txhawb nqa hauv kev hloov prefigure. Tso cov ntawv sau ntxiv tseg.

annotation-text-missing = `<annotation>`: `text` tsis muaj los yog khoob; tso cov ntawv khoob tawm.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Pom kev cuam tshuam voj voog.
       *[other] Pom kev cuam tshuam voj voog uas muaj feem `<{ $componentType }>`.
    }

reference-no-referent = Tsis pom qhov uas tswv yim hais txog: `{ $reference }`

reference-multiple-referents = Pom ntau qhov uas tswv yim hais txog: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Cov qauv tsis raug rau tus cwj pwm { $attribute } ntawm `<{ $componentType }>`.

children-invalid = Cov menyuam tsis raug rau `<{ $componentType }>`: pom cov menyuam tsis raug: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Tus nqi `{ $value }` tsis raug rau tus cwj pwm `{ $attribute }`; siv tus nqi `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Tsis pom DoenetML tus lej { $version }.
       *[other] Tsis pom DoenetML tus lej { $version }. Rov qab mus rau tus lej { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML tsis raug: { $content }

parse-tag-missing-close-tag = DoenetML tsis raug: tag `{ $tag }` tsis muaj tag kaw. Xav kom muaj ib tag kaw nws tus kheej los yog ib tag `</{ $tagName }>`.

parse-tag-error = DoenetML tsis raug: muaj yuam kev hauv tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML tsis raug: tus cwj pwm `{ $attribute }` zoo li tsis muaj tus nqi.

parse-attribute-invalid = DoenetML tsis raug: tus cwj pwm `{ $attribute }` tsis raug

parse-attribute-value-invalid = DoenetML tsis raug: tus nqi cwj pwm `{ $value }` tsis raug

parse-attribute-value-quote-mismatch = DoenetML tsis raug: tus nqi cwj pwm `{ $value }` tsis raug. Cov cim hais lus tsis sib haum. Zoo li tsis muaj ib qho `{ $quote }`

parse-open-tag-name-missing = DoenetML tsis raug: pom ib tag tsis muaj npe, piv txwv `<`

parse-tag-not-closed = DoenetML tsis raug: tag `{ $tag }` tsis raug kaw (zoo li tsis muaj `>`).

parse-self-closing-tag-name-missing = DoenetML tsis raug: pom ib tag tsis muaj npe `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML tsis raug: tag `{ $tag }` tsis raug kaw (zoo li tsis muaj `/>`).

parse-tag-invalid-attributes = DoenetML tsis raug: tag `{ $tag }` tsis raug. Nws cov cwj pwm tej zaum tsis raug.

parse-close-tag-name-missing = DoenetML tsis raug: pom ib tag kaw tsis muaj npe, piv txwv `</`

parse-attribute-value-unquoted = Cov nqi cwj pwm yuav tsum nyob hauv cov cim hais lus: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML tsis raug: pom tag kaw `{ $tag }`, tab sis tsis muaj tag qhib phim

parse-close-tag-mismatched = DoenetML tsis raug: tag kaw tsis phim. Xav kom muaj `</{ $expected }>`. Pom `{ $found }`

parser-node-unconvertible = Tsis tuaj yeem hloov lub node { $node } ua ib lub node Dast.

## Names

name-attribute-invalid =
    Tus cwj pwm name='{ $name }' tsis raug. { $reason ->
        [characters] Cov npe tsuas muaj tau tsiaj ntawv, naj npawb, hauv qab jiid los yog jiid.
       *[start] Cov npe yuav tsum pib nrog ib tug tsiaj ntawv.
    }

component-name-invalid-start = Lub npe feem "{ $name }" tsis raug. Cov npe yuav tsum pib nrog ib tug tsiaj ntawv.

## `<answer>` sugar

answer-video-watched-missing-video = Ib tug answer hom videoWatched yuav tsum muaj ib tus cwj pwm video

answer-video-watched-video-not-reference = Ib tug answer hom videoWatched yuav tsum muaj ib tus cwj pwm video uas yog ib qho tswv yim

answer-name-not-single-text = Tus cwj pwm name ntawm ib tug answer yuav tsum muaj ib tug menyuam ntawv xwb

## Referencing another document

external-doenetml-recursion-limit = Tsis tuaj yeem muab DoenetML sab nraud vim muaj ntau theem rov qab dhau. Puas muaj ib qho tswv yim voj voog?

external-doenetml-unavailable = Tsis tuaj yeem muab DoenetML ntawm { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML tsis raug uas muab ntawm { $attribute }="{ $uri }": nws tsis phim hom feem "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Tus cwj pwm `{ $from }` twb qub lawm; siv `{ $to }`.
       *[other] [deprecation] Tus cwj pwm `{ $from }` ntawm `<{ $component }>` twb qub lawm; siv `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Tus cwj pwm `{ $from }` twb qub lawm thiab raug muab tso tseg, vim `{ $to }` kuj raug teev.
       *[other] [deprecation] Tus cwj pwm `{ $from }` ntawm `<{ $component }>` twb qub lawm thiab raug muab tso tseg, vim `{ $to }` kuj raug teev.
    }

deprecated-attribute-ignored = [deprecation] Tus cwj pwm `{ $attribute }` ntawm `<{ $component }>` twb qub lawm thiab raug muab tso tseg.


## Language coverage

pluralize-english-only = `<pluralize>` tsuas ua tau ntau tus rau lus Askiv, yog li nws cov ntawv nyob li qub hauv ib daim ntawv sau ua { $locale }. Sau daim ntawv ntau tus ncaj qha, los yog teem nws nrog tus cwj pwm `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Lub caij `<{ $tag }>` tsis yog ib lub caij Doenet uas paub.

schema-element-not-allowed-at-root = Lub caij `<{ $tag }>` tsis raug tso cai nyob hauv hauv paus ntawm daim ntawv.

schema-element-not-allowed-inside = Lub caij `<{ $tag }>` tsis raug tso cai nyob hauv `<{ $parent }>`.

schema-attribute-unrecognized = Lub caij `<{ $tag }>` tsis muaj ib tus cwj pwm npe `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Tus cwj pwm `{ $attribute }` ntawm lub caij `<{ $tag }>` yuav tsum yog ib daim ntawv teev uas txhua yam yog ib qho ntawm: { $allowed }
       *[other] Tus cwj pwm `{ $attribute }` ntawm lub caij `<{ $tag }>` yuav tsum yog ib qho ntawm: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Lub npe hom tsis raug rau select. Lub npe hom { $variantName } tshwm hauv { $numOptions } qhov xaiv, tab sis tus naj npawb xaiv yog { $numToSelect }.

select-variant-name-without-options = Teev cov hom rau select, tab sis tsis teev qhov xaiv rau lub npe hom uas ua tau: { $variantName }.

select-variant-name-not-possible = Lub npe hom { $variantName } uas teev rau select tsis yog ib lub npe hom uas ua tau.

select-too-few-options = Tsis tuaj yeem xaiv { $numToSelect } feem ntawm tsuas yog { $numOptions }.

select-from-sequence-too-few-values = Tsis tuaj yeem xaiv { $numToSelect } tus nqi ntawm ib cov txheej txheem ntev { $length }.

select-from-sequence-indices-count-mismatch = Tus naj npawb indices uas teev rau select yuav tsum phim tus naj npawb xaiv

select-from-sequence-indices-not-integers = Txhua tus indices uas teev rau select yuav tsum yog cov lej tag nrho

select-from-sequence-index-excluded = Tus index uas teev rau selectfromsequence raug tshem tawm

select-from-sequence-indices-excluded-combination = Cov indices uas teev rau selectfromsequence yog ib qho sib xyaw uas raug tshem tawm

select-from-sequence-coprime-not-positive-integers = Tsis tuaj yeem xaiv cov sib xyaw coprime vim tsis xaiv cov lej tag nrho zoo.

select-from-sequence-coprime-common-factor = Tsis tuaj yeem xaiv cov naj npawb coprime. Txhua tus nqi uas ua tau muaj ib qho faib sib xws. (Cov nqi uas teev rau "from" los yog "to" yuav tsum coprime nrog "step".)

select-from-sequence-coprime-single-number = Tsis tuaj yeem xaiv cov sib xyaw coprime ntawm ib tug naj npawb uas tsis yog 1.

select-from-sequence-excluded-too-many-combinations = Tshem tawm ntau tshaj 70% ntawm cov sib xyaw hauv selectFromSequence

select-from-sequence-coprime-none-found = Tsis tuaj yeem xaiv cov naj npawb coprime. Txhua tus nqi uas ua tau muaj ib qho faib sib xws.

select-from-sequence-too-few-unique-values = Tsis tuaj yeem xaiv { $numToSelect } tus nqi txawv ntawm ib cov txheej txheem ntev { $numPossibleValues }

select-prime-numbers-too-few-values = Tsis tuaj yeem xaiv { $numToSelect } tus nqi ntawm ib daim ntawv teev cov naj npawb tseem ntev { $numValues }

select-prime-numbers-values-count-mismatch = Tus naj npawb nqi uas teev rau select yuav tsum phim tus naj npawb xaiv

select-prime-numbers-values-not-prime = Txhua tus nqi uas teev rau select prime number yuav tsum nyob hauv daim ntawv teev cov naj npawb tseem

select-prime-numbers-values-excluded-combination = Cov nqi uas teev rau selectPrimeNumbers yog ib qho sib xyaw uas raug tshem tawm

select-prime-numbers-excluded-too-many-combinations = Tshem tawm ntau tshaj 70% ntawm cov sib xyaw hauv selectPrimeNumbers

select-random-combination-fluke = Vim ib qho tshwm sim tsis tshua muaj, tsis tuaj yeem xaiv ib qho sib xyaw ntawm cov nqi random

select-random-value-fluke = Vim ib qho tshwm sim tsis tshua muaj, tsis tuaj yeem xaiv ib tug nqi random
