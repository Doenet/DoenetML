# Mandinka diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`
# and the rest — are part of the language rather than prose, and stay in
# English exactly as written. So does the `[deprecation]` marker.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } buka muta niŋ labaŋ tombondiŋ fula landita
       *[other] { $attributes } buka muta niŋ labaŋ tombondiŋ fula landita
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } buka muta niŋ labaŋ tombondiŋo niŋ teema tombondiŋo bee landita
       *[other] { $attributes } buka muta niŋ labaŋ tombondiŋo niŋ teema tombondiŋo bee landita
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset buka dookuu niŋ teema tombondiŋo te jee

## `<line>`

line-points-undetermined-dimensions = Laayinoo ka tambi tombondiŋolu la meŋ waroo maŋ loŋ.

line-points-too-few-dimensions = Laayinoo ñanta tambi la tombondiŋolu la meŋ waroo si ke fula ti waraŋ ka tambi wo la.

line-points-depend-on-variables = Laayinoo ka tambi tombondiŋolu la meŋ jikita faliŋ feŋolu kaŋ: { $variables }.

line-equation-invalid-format = Laayin kaañaŋo daajikoo maŋ beŋ faliŋ feŋolu { $variable1 } niŋ { $variable2 } kono.

## `<ray>`

ray-overprescribed-through = Reyoo landita niŋ through, endpoint aniŋ direction la.  Ntolu buka through landiriŋo muta.

ray-dimension-mismatch = numDimensions maŋ beŋ reyoo kono.

## `<vector>`

vector-overprescribed-head = Wektaroo landita niŋ head, tail aniŋ displacement la.  Ntolu buka head landiriŋo muta.

vector-dimension-mismatch = numDimensions maŋ beŋ wektaroo kono.

## Attracting and constraining

attract-to-without-nearest-point = Ntolu buka naa noo `<{ $component }>` kaŋ, kaatu nearestPoint taamanseeroo te a bala.

constrain-to-without-nearest-point = Ntolu buka a bali noo `<{ $component }>` kaŋ, kaatu nearestPoint taamanseeroo te a bala.

constrain-to-interior-without-nearest-point = Ntolu buka a bali noo `<{ $component }>` kono, kaatu nearestPoint taamanseeroo te a bala.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition buka muta choiceInput kaŋ meŋ te laayinoo kono

## Ordering children by index

choice-input-indices-count-mismatch = Ntolu buka indices landiriŋolu muta choiceInput kaŋ kaatu indices yaatewo maŋ beŋ choice diŋolu yaatewo ma.

pretzel-indices-count-mismatch = Ntolu buka indices landiriŋolu muta problem kaŋ kaatu indices yaatewo maŋ beŋ problem diŋolu yaatewo ma.

shuffle-indices-count-mismatch = Ntolu buka indices landiriŋolu muta shuffle kaŋ kaatu indices yaatewo maŋ beŋ karoolu yaatewo ma.

indices-ignored-out-of-range = Ntolu buka indices landiriŋolu muta { $component } kaŋ kaatu doolu bota naanewo bala.

pretzel-indices-repeated = Ntolu buka indices landiriŋolu muta pretzel kaŋ kaatu doolu seyinkaŋta.

pretzel-circuit-first-index = Ntolu buka indices landiriŋolu muta pretzel kaŋ mode="circuit" kono kaatu foloo ñanta ke la 1 ti.

## `<shuffle>` and `<sort>`

string-children-need-type = Fo `<{ $component }>` si dookuu noo niŋ kumakaŋ diŋolu la, `type` taamanseeroo ñanta landi la.

invalid-type-defaulting-to-math = Siifaa { $type } maŋ beŋ { $component } kaŋ. A ñanta ke la math, text, number waraŋ boolean ti. Ntolu ka muru math kaŋ.

string-not-valid-component-to-arrange = Kumakaŋo "{ $value }" maŋ ke karo betoo ti { $component } kaŋ. Ntolu buka a muta.

## Types and variables

invalid-type-defaulting-to-number = Siifaa { $type } maŋ beŋ, ntolu ka siifaa landi number kaŋ.

invalid-variable-value = Faliŋ feŋo konteroo maŋ beŋ: `{ $value }`

## Variants

variant-index-must-be-number = Siifaa taamanseeroo { $index } ñanta ke la konteroo ti

variant-index-must-be-integer = Siifaa taamanseeroo { $index } ñanta ke la kontero timmariŋo ti

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` maŋ dadaa niŋ sumandiri bambandiŋolu la. Ntolu ka fanoo landi sumandiroo kaŋ.

side-by-side-absolute-margins = `<{ $component }>` maŋ dadaa niŋ sumandiri bambandiŋolu la. Ntolu ka naanewolu landi sumandiroo kaŋ.

side-by-side-no-block-child = `<{ $component }>` maŋ beŋ: a ñanta karo diŋ kiliŋ soto la.

## `<label>`

label-for-ignored-on-graphical = `for` taamanseeroo buka muta natamb `<label>` kaŋ.

label-for-must-resolve-to-one = `for` taamanseeroo `<label>` kaŋ ñanta karo kiliŋ doroŋ yitandi la.

label-for-unresolved = `for` taamanseeroo `<label>` kaŋ maŋ karoo yitandi noo.

label-for-answer-with-authored-inputs = `for` taamanseeroo `<label>` kaŋ ka `<answer>` yitandi meŋ ye duŋolu soto safeerilaa faŋo ye mennu safee; duŋo faŋo yitandi.

label-for-answer-without-input = `for` taamanseeroo `<label>` kaŋ ka `<answer>` yitandi meŋ maŋ duŋo soto ka too laa a kaŋ.

label-for-must-reference-input-or-answer = `for` taamanseeroo `<label>` kaŋ ñanta duŋo waraŋ jaabiroo yitandi la.

## Accessibility

accessibility-short-description-or-decorative = Futandiroo kamma, `<{ $component }>` ñanta kotoo sutuŋo soto la waraŋ a landi ko ñiiñandiri feŋo.

accessibility-video-short-description = Futandiroo kamma, `<video>` ñanta kotoo sutuŋo soto la.

accessibility-input-short-description-or-label = Futandiroo kamma, `<{ $component }>` ñanta kotoo sutuŋo waraŋ too soto la.

accessibility-answer-input-short-description-or-label = Futandiroo kamma, `<answer>` meŋ ka duŋo dadaa, wo ñanta kotoo sutuŋo waraŋ too soto la.

accessibility-short-description-contains-math = Kotoo sutuŋolu maŋ ñaŋ na konter karoolu soto la ko `<{ $component }>`. Konteroolu bee safee niŋ kumakaŋolu la.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } maŋ faasaroo soto meŋ kaañanta karandiri kunto kumakaŋolu ye (diboo kono) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka { $threshold }:1 ñininkaa).
       *[other] { $colorName } maŋ faasaroo soto meŋ kaañanta karandiri kunto kumakaŋolu ye ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka { $threshold }:1 ñininkaa).
    }

## `<circle>`

circle-through-points-non-numerical = Ntolu maŋ `<circle>` dadaa foloo meŋ ka tambi tombondiŋ { $count } la niŋ konteroo te tombondiŋolu bala.

circle-too-many-through-points = Ntolu buka muruŋo konte noo meŋ ka tambi tombondiŋ 3 la ka tambi.

circle-overprescribed-radius-center-points = Ntolu buka muruŋo konte noo meŋ ye reyoo, teema dulaa aniŋ tombondiŋolu bee soto.

circle-center-with-multiple-points = Ntolu buka muruŋo konte noo meŋ ye teema dulaa soto ka tambi tombondiŋ 1 la.

circle-radius-too-small = Ntolu buka muruŋo konte noo: tombondiŋ fuloo teemoo mu { $distance } ti, reyoo { $radius } landiriŋo dooyaata baake.

circle-radius-with-many-points = Ntolu buka muruŋo dadaa noo meŋ ka tambi tombondiŋ fula la niŋ reyoo landiriŋo la.

circle-invalid-center-or-through-points = Muruŋo teema dulaa waraŋ a tombondiŋolu maŋ beŋ.

circle-radius-center-with-multiple-points = Ntolu buka muruŋo reyoo konte noo meŋ ye teema dulaa soto ka tambi tombondiŋ 1 la.

circle-change-radius-non-numerical = Ntolu buka muruŋo reyoo faliŋ noo niŋ konteroo te a tombondiŋolu bala

circle-radius-with-points-non-numerical = Ntolu buka muruŋo dadaa noo meŋ ka tambi tombondiŋ kiliŋ la niŋ reyoo landiriŋo la niŋ konteroo te jee.

circle-change-center-non-numerical = Ntolu maŋ muruŋo teema dulaa faliŋo dadaa foloo niŋ konteroo te a tombondiŋolu bala.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Waroo maŋ futa fankisoŋo dinkiraa ma. Dinkiraa ye tembendiroo { $intervals } soto bari fankisoŋo ye { $inputs ->
            [one] duŋo { $inputs }
           *[other] duŋo { $inputs }
        } soto.
       *[other] Waroo maŋ futa fankisoŋo dinkiraa ma. Dinkiraa ye tembendiroo { $intervals } soto bari fankisoŋo ye { $inputs ->
            [one] duŋo { $inputs }
           *[other] duŋo { $inputs }
        } soto.
    }

function-domain-invalid-format = Fankisoŋo dinkiraa daajikoo maŋ beŋ.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ntolu buka fankisoŋo santo baa muta meŋ maŋ konteroo soto.
        [minimum] Ntolu buka fankisoŋo duuma baa muta meŋ maŋ konteroo soto.
        [extremum] Ntolu buka fankisoŋo labaŋo muta meŋ maŋ konteroo soto.
        [point] Ntolu buka fankisoŋo tombondiŋo muta meŋ maŋ konteroo soto.
        [slope] Ntolu buka fankisoŋo jenkoo muta meŋ maŋ konteroo soto.
       *[other] Ntolu buka fankisoŋo { $type } muta meŋ maŋ konteroo soto.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ntolu buka fankisoŋo santo baa kenseŋo muta.
        [minimum] Ntolu buka fankisoŋo duuma baa kenseŋo muta.
        [extremum] Ntolu buka fankisoŋo labaŋ kenseŋo muta.
        [point] Ntolu buka fankisoŋo tombondiŋ kenseŋo muta.
       *[other] Ntolu buka fankisoŋo { $type } kenseŋo muta.
    }

function-points-too-close = Fankisoŋo ye tombondiŋ fula soto mennu sutiyaata ñoo la baake. Ntolu buka fankisoŋo landi noo.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Fankisoŋo seyinkaŋo si ke noo doroŋ niŋ duŋolu yaatewo benta bondiŋolu yaatewo ma. Ñiŋ fankisoŋo ye duŋo { $inputs } niŋ { $outputs ->
            [one] bondiŋo { $outputs }
           *[other] bondiŋo { $outputs }
        } soto.
       *[other] Fankisoŋo seyinkaŋo si ke noo doroŋ niŋ duŋolu yaatewo benta bondiŋolu yaatewo ma. Ñiŋ fankisoŋo ye duŋo { $inputs } niŋ { $outputs ->
            [one] bondiŋo { $outputs }
           *[other] bondiŋo { $outputs }
        } soto.
    }

## `<sequence>`

sequence-invalid-length = Tembendiroo jamfoo maŋ beŋ.  A ñanta ke la kontero timmariŋo ti meŋ te zeeroo duuma.

sequence-invalid-step = Tembendiroo simfaa maŋ beŋ.  A ñanta ke la konteroo ti tembendiroo kaŋ meŋ siifaa mu { $type } ti.

sequence-invalid-endpoint-number = Kontero tembendiroo "{ $attribute }" maŋ beŋ.  A ñanta ke la konteroo ti.

sequence-invalid-endpoint-letters = Safeerandiŋ tembendiroo "{ $attribute }" maŋ beŋ.  A ñanta ke la safeerandiŋ ñabuŋo ti.

sequence-invalid-endpoint = Tembendiroo "{ $attribute }" maŋ beŋ.

select-from-sequence-coprime-not-numbers = coprime maŋ muta kaatu konteroolu buka tomboŋ

select-from-sequence-coprime-with-exclude-combinations = coprime maŋ muta kaatu excludeCombinations landita

## Resolving a `target`

target-not-found = target maŋ beŋ `<{ $source }>` kaŋ: ntolu maŋ target je.

target-state-variable-not-found = target maŋ beŋ `<{ $source }>` kaŋ: ntolu maŋ taamanseeroo je meŋ too mu "{ $property }" ti `<{ $component }>` kaŋ.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` faliŋ feŋolu ñanta faasaa la faliŋ feŋ faŋ-fansuŋo la.

ode-system-duplicate-variable-names = Ntolu buka ODE RHS fankisoŋolu landi noo mennu faliŋ feŋ toolu seyinkaŋta.

ode-system-rhs-function-error = Ntolu buka ODE RHS fankisoŋo landi noo.  Filoo mathjs fankisoŋo dadaaroo kono.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ntolu buka tuŋo landi noo laayinoolu { $count } teema

angle-invalid-through-point = Tombondiŋ kuruŋo `<angle>` through kono

parabola-vertex-too-many-points = Ntolu maŋ paraboloo dadaa foloo meŋ ye tuŋo soto ka tambi tombondiŋ 1 la.

parabola-too-many-points = Ntolu maŋ paraboloo dadaa foloo meŋ ka tambi tombondiŋ 3 la.

intersection-too-many-items = Ntolu maŋ beŋo dadaa foloo feŋ fula ye ka tambi

## Other math components

ionic-compound-not-two-ions = Ntolu maŋ ayoŋ ñaboo dadaa foloo feŋ ye meŋ maŋ ke ayoŋ fula ti.

ionic-compound-needs-cation-and-anion = Ayoŋ ñaboo dadaata katiyoŋ kiliŋ niŋ aniyoŋ kiliŋ doroŋ ye.

solve-equations-cannot-evaluate = Ntolu buka kaañaŋo bondi noo kaatu a maŋ konte noo: { $equation }

math-operators-operand-number-required = I ñanta operandNumber landi la niŋ i be konter operand bondi kaŋ.

eigen-decomposition-failed = Ntolu maŋ matiriks eigenvalues konte noo

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameetaroo { $parameters } te pattern kono, wo kamma a be beŋ na kenseŋo ma waati bee.
       *[other] `<matchesPattern>`: parameetaroolu { $parameters } te pattern kono, wo kamma ì be beŋ na kenseŋo ma waati bee.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ntolu buka grid="{ $grid }" fahaamu noo. A ñanta ke la none, medium, dense, waraŋ kontero beteyaariŋ fula ti mennu talaata niŋ dulaa la, ko grid="1 0.5". Girido te dadaa la.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" maŋ soobeeyaa prefigure yitandirilaa kono; ntolu ka dookuu ko bulubaa karoo la.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" maŋ soobeeyaa prefigure yitandirilaa kono; ntolu ka dookuu ko santo karoo la.

prefigure-invalid-axis-bounds = `<graph>`: aksisi naanewolu maŋ beŋ prefigure falindiroo ye; ntolu ka dookuu niŋ bbox foloriŋo la (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: fanoo maŋ beŋ prefigure falindiroo ye; ntolu ka dookuu niŋ natamb fano foloriŋo la 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio maŋ beŋ prefigure falindiroo ye; ntolu ka dookuu niŋ sumandiri foloriŋo la 1.

prefigure-grid-spacing-too-fine = `<graph>`: girido teemoo dooyaata baake aksisi naanewolu ye; girido te dadaa la prefigure yitandirilaa kono.

prefigure-annotations-not-rendered = `<graph>`: kotoolu te dadaa la niŋ PreFigure yitandirilaa buka dookuu.

multiple-annotations-children = `<annotations>` diŋ jamaa jeta `<graph>` kono; bee maŋ muta fo labaŋo.

## Referring to other components

copy-unrecognized-component-type = Ntolu buka karo siifaa lafaa noo waraŋ ka a kopi meŋ maŋ loŋ: { $type }.

copy-prop-not-found = Ntolu maŋ prop { $property } je karoo kaŋ meŋ siifaa mu { $component } ti

collect-no-source = collect suloo maŋ je.

collect-invalid-component-type = Ntolu buka karoolu kafu noo mennu siifaa mu `<{ $component }>` ti kaatu a mu siifaa kuruŋo ti.

reference-index-unavailable = Ntolu buka taamanseeroo `{ $reference }` yitandi noo

## `<callAction>`

component-action-unavailable = Ntolu buka { $action } kumandi noo karoo `{ $reference }` kaŋ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Kibaaroolu daajikoo maŋ beŋ.  Laayinoolu jamfoo maŋ beŋ ñoo ma. A jeta componentIdx :{ $componentIdx } kono

data-frame-duplicate-column-names = Kibaaroolu ye kolon too seyinkaŋriŋolu soto.  A jeta componentIdx :{ $componentIdx } kono

data-frame-missing-column-name = Kolon too te kibaaroolu bala.  A jeta componentIdx :{ $componentIdx } kono

## `<answer>` and scoring

answer-award-depends-on-own-response = Ñiŋ jaabiroo poyintoolu jikita tago faŋo ye jaabiroo meŋ kii, wo kaŋ, aniŋ wo be feŋ ne naati la meŋ maŋ ñaŋ.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` landoo `<answer>` kaŋ meŋ be karoo kono niŋ `sectionWideCheckWork` la, wo buka feŋ ke, kaatu karoo le ka kata yaatewo maabo. `maxNumAttempts` landi karoo kaŋ.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` landoo karoo kaŋ niŋ `sectionWideCheckWork` la meŋ be karo doo kono niŋ `sectionWideCheckWork` la, wo buka feŋ ke, kaatu banta karoo le ka kata yaatewo maabo. `maxNumAttempts` landi banta karoo kaŋ.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Taamanseeroo { $attributes } te feŋ ke la niŋ symbolicEquality maŋ landi.
       *[other] Taamanseeroolu { $attributes } te feŋ ke la niŋ symbolicEquality maŋ landi.
    }

answer-invalid-type = Jaabiroo siifaa kuruŋo: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Kaatu too te karoo `<{ $component }>` bala, a te ke noo la module taamanseeroo ti

module-attribute-name-already-defined = Karoo `<{ $component } name="{ $name }">` te ke noo la module taamanseeroo ti kaatu `<module>` siifaa ye taamanseeroo "{ $name }" soto le fokabaŋ.

conditional-content-condition-ignored = `condition` taamanseeroo buka muta `<conditionalContent>` kaŋ meŋ ye case waraŋ else diŋolu soto.

slider-markers-type-mismatch = Taamanseeroolu siifaa maŋ beŋ slider siifaa ma.

pretzel-problem-needs-statement-and-answer = pretzel maŋ beŋ: `<problem>`-wo-`<problem>` ñanta `<statement>` kiliŋ niŋ `<answer>` kiliŋ soto la.

pretzel-circuit-first-problem-distractor = pretzel maŋ beŋ: mode="circuit" kono, `<problem>` foloo te ke noo la distractor ti.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Kontero kuruŋo { $values } taamanseeroo `{ $attribute }` kaŋ; ntolu buka a muta.
       *[other] Kontero kuruŋolu { $values } taamanseeroo `{ $attribute }` kaŋ; ntolu buka ì muta.
    }

attribute-must-be-references = Konteroo `{ $value }` maŋ beŋ taamanseeroo `{ $attribute }` kaŋ. Taamanseeroo ñanta dadaa la niŋ yitandiroolu la mennu ka dati niŋ `$` la.

math-input-invalid-function-names = <mathInput>: ntolu maŋ fankisoŋ too kuruŋolu muta { $attribute } kono: { $names }. Too-wo-too yitandiri karoo ñanta safeerandiŋ 2 soto la waraŋ ka tambi wo la (safeerandiŋolu waraŋ tirewolu); i si `|<mathspeak alternative>` lafaa a kaŋ.

## Building components from the source

component-type-invalid = Karoo siifaa kuruŋo: `<{ $componentType }>`

attribute-repeated = Ntolu buka taamanseeroo { $attribute } seyinkaŋ noo.

attribute-invalid-for-component = Taamanseeroo "{ $attribute }" maŋ beŋ karoo kaŋ meŋ siifaa mu `<{ $componentType }>` ti.

## Style definition contrast

style-definition-insufficient-contrast =
    Siifaa { $styleNumber } kotoo maŋ faasaroo soto meŋ kaañanta { $context ->
        [text-on-background] kumakaŋ kuloroo kooma kuloroo kaŋ
        [high-contrast] faasari baa kuloroo walaa kaŋ
        [line] laayin kuloroo walaa kaŋ
        [marker] taamanseer kuloroo walaa kaŋ
       *[text-on-canvas] kumakaŋ kuloroo walaa kaŋ
    } ye{ $mode ->
        [dark] { " (diboo kono)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka { $threshold }:1 ñininkaa).

style-definition-dark-mode-text-background-contrast =
    Hani niŋ siifaa { $styleNumber } kotoo ye kuloroolu soto mennu ka faasaroo dii maloo kono, dib kuloroolu mennu bota ì bala, faasaroo te ì la kumakaŋ kuloroo niŋ kooma kuloroo teema ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka { $threshold }:1 ñininkaa). { $suggestion ->
        [available] Fo faasaroo si kaañaŋ diboo kono, maloo faasaroo lafaa (misaali la, { $lightAttribute }="{ $lightColor }" landi) waraŋ dib kuloroo faliŋ (misaali la, { $darkAttribute }="{ $darkColor }" landi).
       *[none] Fo faasaroo si kaañaŋ diboo kono, maloo faasaroo lafaa waraŋ kuloro bondiŋolu faliŋ niŋ textColorDarkMode waraŋ backgroundColorDarkMode la.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hani niŋ siifaa { $styleNumber } kotoo ye kumakaŋ kuloroo soto meŋ ka faasaroo dii maloo kono, dib kumakaŋ kuloroo meŋ bota a bala, faasaroo te a la walaa kaŋ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka { $threshold }:1 ñininkaa). { $suggestion ->
        [available] Fo faasaroo si kaañaŋ diboo kono, maloo faasaroo lafaa (misaali la, textColor="{ $lightColor }" landi) waraŋ dib kuloroo faliŋ (misaali la, textColorDarkMode="{ $darkColor }" landi).
       *[none] Fo faasaroo si kaañaŋ diboo kono, maloo faasaroo lafaa waraŋ kuloro bondiŋo faliŋ niŋ textColorDarkMode la.
    }

section-multiple-style-palettes = Karandiroo si <stylePalette> kiliŋ doroŋ tomboŋ noo; ntolu ka dookuu niŋ labaŋo la.

## Unique variants

variant-num-to-select-not-non-negative-integer = ntolu buka { $component } siifaa faasariŋolu loŋ noo kaatu numToSelect maŋ ke kontero timmariŋo ti meŋ te zeeroo duuma.

variant-num-to-select-not-constant-number = ntolu buka { $component } siifaa faasariŋolu loŋ noo kaatu numToSelect maŋ ke konteroo ti meŋ buka faliŋ.

variant-with-replacement-not-constant-boolean = ntolu buka { $component } siifaa faasariŋolu loŋ noo kaatu withReplacement maŋ ke boolean ti meŋ buka faliŋ.

variant-select-weight-disables-unique = select siifaa faasariŋolu ka bali niŋ tombondiroo ye selectWeight waraŋ selectForVariants soto

variant-coprime-undetermined = ntolu buka { $component } siifaa faasariŋolu loŋ noo kaatu ntolu buka a loŋ noo ko coprime mu false ti waati bee.

variant-attribute-not-constant = ntolu buka { $component } siifaa faasariŋolu loŋ noo kaatu { $attribute } ka faliŋ.

variant-attribute-not-number = ntolu buka { $component } siifaa faasariŋolu loŋ noo kaatu { $attribute } maŋ ke konteroo ti.

variant-attribute-wrong-type-for-sequence =
    ntolu buka { $component } meŋ siifaa mu { $type } ti, a siifaa faasariŋolu loŋ noo kaatu { $attribute } maŋ ke { $expected ->
        [letters-combination] safeerandiŋ ñabuŋo
        [math-expression] konter kumakaŋ soobeeyaariŋo
        [integer] kontero timmariŋo
       *[number] konteroo
    } ti.

variant-length-not-integer = ntolu buka { $component } siifaa faasariŋolu loŋ noo kaatu length maŋ ke kontero timmariŋo ti.

variant-sort-not-implemented = ntolu maŋ { $component } meŋ ye sort soto, a siifaa faasariŋolu dadaa foloo

variant-exclude-combinations-not-implemented = ntolu maŋ { $component } meŋ ye excludeCombinations soto, a siifaa faasariŋolu dadaa foloo

variant-math-exclude-not-implemented = ntolu maŋ { $component } meŋ siifaa mu math ti aniŋ meŋ ye exclude soto, a siifaa faasariŋolu dadaa foloo

variant-non-constant-exclude-not-implemented = ntolu maŋ { $component } meŋ ye exclude faliŋtaa soto, a siifaa faasariŋolu dadaa foloo

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: a maŋ soobeeyaa graph prefigure yitandirilaa kono; koomalankoo tambita.

prefigure-descendant-invalid-geometry = { $subject }: dulaa daajikoo maŋ naanewo soto waraŋ a maŋ timma; koomalankoo tambita.

prefigure-curve-label-omitted = { $subject }: toolu maŋ soobeeyaa laayin jenkeriŋ falindiŋolu kaŋ; too bondita.

prefigure-curve-unsupported-definition-type = { $subject }: laayin jenkeriŋo kotoo siifaa '{ $definitionType }' maŋ soobeeyaa; koomalankoo tambita.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions taamanseeroo maŋ soobeeyaa regionBetweenCurves kaŋ; koomalankoo tambita.

prefigure-region-non-formula-child = { $subject }: diŋ fankisoŋolu doroŋ mennu siifaa mu formula ti, wolu le soobeeyaata regionBetweenCurves kaŋ; koomalankoo tambita.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' maŋ soobeeyaa { $labelKind ->
        [line-family] laayin kaabiiloo too
       *[point] tombondiŋo too
    } ye; ntolu ka dookuu niŋ PreFigure benoo foloriŋo la.

prefigure-fill-style-unsupported = { $subject }: faaroo siifaa '{ $fillStyle }' maŋ soobeeyaa PreFigure kaŋ; ntolu ka muru faari bambandiŋo kaŋ.

prefigure-line-style-unknown = { $subject }: laayin siifaa lombaloo '{ $lineStyle }' bondita PreFigure bondiroo kono.

prefigure-marker-style-mapped-to-diamond = { $subject }: taamanseer siifaa '{ $markerStyle }' falinta ka ke PreFigure siifaa 'diamond' ti.

prefigure-marker-style-unsupported = { $subject }: taamanseer siifaa '{ $markerStyle }' maŋ soobeeyaa PreFigure kaŋ; ntolu ka dookuu niŋ siifaa foloriŋo la.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` maŋ beŋ; ntolu maŋ a yitandiriŋo je. Kotoo bondita.

annotation-ref-multiple-targets = `<annotation>`: `ref` ka feŋ jamaa yitandi; ntolu ka dookuu niŋ foloo la.

annotation-ref-outside-graph = `<annotation>`: `ref` maŋ beŋ; a yitandiriŋo be graph banta la. Kotoo bondita.

annotation-ref-unsupported-target = `<annotation>`: `ref` maŋ beŋ; a yitandiriŋo maŋ ke natamb feŋo ti meŋ soobeeyaata prefigure falindiroo kono. Kotoo bondita.

annotation-text-missing = `<annotation>`: `text` te jee waraŋ a kenseŋo le mu; ntolu ka kumakaŋ kenseŋo bondi.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ntolu ye jikoo je meŋ ka muruŋ-muruŋ.
       *[other] Ntolu ye jikoo je meŋ ka muruŋ-muruŋ niŋ karoo `<{ $componentType }>` la.
    }

reference-no-referent = Feŋ maŋ je yitandiroo la: `{ $reference }`

reference-multiple-referents = Feŋ jamaa jeta yitandiroo la: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` taamanseeroo { $attribute } daajikoo maŋ beŋ.

children-invalid = `<{ $componentType }>` diŋolu maŋ beŋ: Ntolu ye diŋ kuruŋolu je: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Konteroo `{ $value }` maŋ beŋ taamanseeroo `{ $attribute }` kaŋ, ntolu ka dookuu niŋ konteroo `{ $default }` la

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML siifaa { $version } maŋ je.
       *[other] DoenetML siifaa { $version } maŋ je. Ntolu ka muru siifaa { $fallback } kaŋ
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML kuruŋo: { $content }

parse-tag-missing-close-tag = DoenetML kuruŋo: Tagoo `{ $tag }` maŋ soroŋ tagoo soto. Ntolu tarata tagoo batu kaŋ meŋ ka a faŋ soroŋ waraŋ tagoo `</{ $tagName }>`.

parse-tag-error = DoenetML kuruŋo: Filoo tagoo `<{ $tagName }>` kono

parse-attribute-missing-value = DoenetML kuruŋo: Taamanseer kuruŋo `{ $attribute }` ka munta ko konteroo te a bala.

parse-attribute-invalid = DoenetML kuruŋo: Taamanseeroo `{ $attribute }` maŋ beŋ

parse-attribute-value-invalid = DoenetML kuruŋo: Taamanseeroo konteroo `{ $value }` maŋ beŋ

parse-attribute-value-quote-mismatch = DoenetML kuruŋo: Taamanseeroo konteroo `{ $value }` maŋ beŋ. Kumakaŋ taamanseeroolu maŋ beŋ. A ka munta ko `{ $quote }` te i bulu

parse-open-tag-name-missing = DoenetML kuruŋo: Ntolu ye tagoo je meŋ maŋ too soto, ko `<`

parse-tag-not-closed = DoenetML kuruŋo: Tagoo `{ $tag }` maŋ soroŋ (a ka munta ko `>` te jee).

parse-self-closing-tag-name-missing = DoenetML kuruŋo: Ntolu ye tagoo je meŋ maŋ too soto `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML kuruŋo: Tagoo `{ $tag }` maŋ soroŋ (a ka munta ko `/>` te jee).

parse-tag-invalid-attributes = DoenetML kuruŋo: Tagoo `{ $tag }` maŋ beŋ. A si taamanseer kuruŋolu soto noo.

parse-close-tag-name-missing = DoenetML kuruŋo: Ntolu ye soroŋ tagoo je meŋ maŋ too soto, ko `</`

parse-attribute-value-unquoted = Taamanseeroo konteroolu ñanta landi la kumakaŋ taamanseeroolu teema: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML kuruŋo: Ntolu ye soroŋ tagoo `{ $tag }` je, bari yele tagoo benneriŋo te jee

parse-close-tag-mismatched = DoenetML kuruŋo: Soroŋ tagoo maŋ beŋ. Ntolu tarata `</{ $expected }>` batu kaŋ. Ntolu ye `{ $found }` je

parser-node-unconvertible = Ntolu maŋ node { $node } faliŋ noo ka ke Dast node ti.

## Names

name-attribute-invalid =
    Too name='{ $name }' maŋ beŋ. { $reason ->
        [characters] Toolu si safeerandiŋolu, konteroolu, duuma tirewolu waraŋ tirewolu doroŋ soto noo.
       *[start] Toolu ñanta dati la niŋ safeerandiŋo la.
    }

component-name-invalid-start = Karoo too "{ $name }" maŋ beŋ. Toolu ñanta dati la niŋ safeerandiŋo la.

## `<answer>` sugar

answer-video-watched-missing-video = Jaabiroo meŋ siifaa mu videoWatched ti, wo ñanta video taamanseeroo soto la

answer-video-watched-video-not-reference = Jaabiroo meŋ siifaa mu videoWatched ti, wo ñanta video taamanseeroo soto la meŋ mu yitandiroo ti

answer-name-not-single-text = Jaabiroo name taamanseeroo ñanta kumakaŋ diŋ kiliŋ soto la

## Referencing another document

external-doenetml-recursion-limit = Ntolu maŋ banta DoenetML soto noo kaatu seyinkaŋo siyaata baake. Fo yitandiroo doo be muruŋ-muruŋ kaŋ baŋ?

external-doenetml-unavailable = Ntolu maŋ DoenetML soto noo { $attribute }="{ $uri }" to

external-doenetml-type-mismatch = DoenetML meŋ sotota { $attribute }="{ $uri }" to, wo maŋ beŋ: a maŋ beŋ karoo siifaa "{ $componentType }" ma

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Taamanseeroo `{ $from }` buka dookuu kotenke; `{ $to }` taa.
       *[other] [deprecation] Taamanseeroo `{ $from }` `<{ $component }>` kaŋ buka dookuu kotenke; `{ $to }` taa.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Taamanseeroo `{ $from }` buka dookuu kotenke aniŋ a buka muta kaatu `{ $to }` fanaa landita.
       *[other] [deprecation] Taamanseeroo `{ $from }` `<{ $component }>` kaŋ buka dookuu kotenke aniŋ a buka muta kaatu `{ $to }` fanaa landita.
    }

deprecated-attribute-ignored = [deprecation] Taamanseeroo `{ $attribute }` `<{ $component }>` kaŋ buka dookuu kotenke aniŋ a buka muta.

deprecated-attribute-to-child = [deprecation] Taamanseeroo `{ $attribute }` `<{ $component }>` kaŋ buka dookuu kotenke; diŋo `<{ $child }>` taa.

deprecated-attribute-value-renamed = [deprecation] Taamanseeroo `{ $attribute }` konteroo `{ $value }` `<{ $component }>` kaŋ buka dookuu kotenke; `{ $to }` taa.


## Language coverage

pluralize-english-only = `<pluralize>` si siyaaroo ke noo Aŋgalekaŋo doroŋ na, wo kamma a kumakaŋolu ka tu ko safeerilaa ye ì safee ñaameŋ kitaaboo kono meŋ safeeta { $locale } la. Siyaaroo safee i faŋo, waraŋ a landi niŋ `pluralForm` taamanseeroo la.


## Checking against the schema

schema-element-unrecognized = Karoo `<{ $tag }>` maŋ ke Doenet karo lonnooriŋo ti.

schema-element-not-allowed-at-root = Karoo `<{ $tag }>` maŋ soobeeyaa kitaaboo suloo to.

schema-element-not-allowed-inside = Karoo `<{ $tag }>` maŋ soobeeyaa `<{ $parent }>` kono.

schema-attribute-unrecognized = Taamanseeroo meŋ too mu `{ $attribute }` ti, wo te karoo `<{ $tag }>` bala.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Karoo `<{ $tag }>` taamanseeroo `{ $attribute }` ñanta ke la tembendiroo ti meŋ feŋ-wo-feŋ mu kiliŋ ti ñinnu kono: { $allowed }
       *[other] Karoo `<{ $tag }>` taamanseeroo `{ $attribute }` ñanta ke la kiliŋ ti ñinnu kono: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select siifaa too maŋ beŋ.  Siifaa too { $variantName } be tombondiri { $numOptions } kono bari tombondiri yaatewo mu { $numToSelect } ti.

select-variant-name-without-options = Siifaa doolu landita select kaŋ bari tombondiri maŋ landi siifaa too kaŋ meŋ si ke noo: { $variantName }.

select-variant-name-not-possible = Siifaa too { $variantName } meŋ landita select kaŋ, wo maŋ ke siifaa too ti meŋ si ke noo.

select-too-few-options = Ntolu buka karoo { $numToSelect } tomboŋ noo karoo { $numOptions } doroŋ kono.

select-from-sequence-too-few-values = Ntolu buka konteroo { $numToSelect } tomboŋ noo tembendiroo kono meŋ jamfoo mu { $length } ti.

select-from-sequence-indices-count-mismatch = Indices yaatewo meŋ landita select kaŋ, wo ñanta beŋ na tombondiri yaatewo ma

select-from-sequence-indices-not-integers = Indices bee mennu landita select kaŋ, wolu ñanta ke la kontero timmariŋolu ti

select-from-sequence-index-excluded = selectfromsequence taamanseeroo landiriŋo tarata bondiriŋ

select-from-sequence-indices-excluded-combination = selectfromsequence indices landiriŋolu tarata ke la ñabuŋ bondiriŋo ti

select-from-sequence-coprime-not-positive-integers = Ntolu buka coprime ñabuŋolu tomboŋ noo kaatu kontero beteyaari timmariŋolu buka tomboŋ.

select-from-sequence-coprime-common-factor = Ntolu buka coprime konteroolu tomboŋ noo. Kontero bee mennu si ke noo, faktar kiliŋ ne be ì bee bala. ("from" waraŋ "to" kontero landiriŋolu ñanta ke la coprime ti "step" fee.)

select-from-sequence-coprime-single-number = Ntolu buka coprime ñabuŋolu tomboŋ noo kontero kiliŋ kono meŋ maŋ ke 1 ti.

select-from-sequence-excluded-too-many-combinations = Ñabuŋ 70% ka tambi wo la bondita selectFromSequence kono

select-from-sequence-coprime-none-found = Ntolu maŋ coprime konteroolu tomboŋ noo. Kontero bee mennu si ke noo, faktar kiliŋ ne be ì bee bala.

select-from-sequence-too-few-unique-values = Ntolu buka kontero faasariŋ { $numToSelect } tomboŋ noo tembendiroo kono meŋ jamfoo mu { $numPossibleValues } ti

select-prime-numbers-too-few-values = Ntolu buka konteroo { $numToSelect } tomboŋ noo prime kontero tembendiroo kono meŋ jamfoo mu { $numValues } ti

select-prime-numbers-values-count-mismatch = Kontero yaatewo meŋ landita select kaŋ, wo ñanta beŋ na tombondiri yaatewo ma

select-prime-numbers-values-not-prime = Kontero bee mennu landita select prime number kaŋ, wolu ñanta ke la prime kontero tembendiroo kono

select-prime-numbers-values-excluded-combination = selectPrimeNumbers kontero landiriŋolu tarata ke la ñabuŋ bondiriŋo ti

select-prime-numbers-excluded-too-many-combinations = Ñabuŋ 70% ka tambi wo la bondita selectPrimeNumbers kono

select-random-combination-fluke = Kuu meŋ buka ke noo muk, wo kamma ntolu maŋ kontero kenseŋ ñabuŋo tomboŋ noo

select-random-value-fluke = Kuu meŋ buka ke noo muk, wo kamma ntolu maŋ kontero kenseŋo tomboŋ noo
