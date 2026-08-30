# Maranao (Basa a Mëranaw) diagnostics. Translated from
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
# **The schwa is written «ë» (U+00EB)**, as `chrome.ftl`'s header sets out.
# Print also writes it **e**, **e'** or **u**; respell rather than
# retranslate, and respell all four files at once.
#
# **The frames.** This file is some 220 sentences built out of a dozen
# recurring frames, and reading the frames is the fastest way to review it:
#
#     Di pëkhagamit so …      it is ignored — literally 'is not used'
#     Di khagaga a …          cannot / is not possible
#     Paliyogat a …           must / is required
#     Di ontol a …            invalid …
#     Da mailay so …          not found — literally 'is not seen'
#     Da a …                  there is no …
#     Aden a …                there is …
#     Da a epekto iyan        has no effect
#     Da pën mapasad so …     has not been implemented
#     sabap ko …              because of …
#     … a miyatëndo           … that was specified
#     Pëkhagamit so …         … is used
#
# Two of those are **paraphrases rather than translations**, and both are
# worth replacing first because each carries dozens of messages: "ignored"
# reads 'is not used', and "not found" reads 'is not seen'. The seed had no
# Maranao verb for either that it could vouch for, and each is one search.
#
# **The technical nouns are English, and that is the register rather than a
# gap** — Lanao's schools teach these subjects in English. `component`,
# `attribute`, `value`, `type`, `version`, `index`, `matrix`, `expression`,
# `dimension`, `function`, `region`, `color`, `line`, `point`, `row`,
# `column`, `input`, `output`, `renderer`, `grid`, `default`, `mode`,
# `state variable` are kept as they stand. A few Spanish loans reach Maranao
# through Filipino and are used where they are what is said: «impormasyon»,
# «problema», «kredito», «nota». Nothing was coined.
#
# **No plural-category branches.** CLDR has no plural data for `mrw`, so a
# `[one]` branch would be text selected by English's rules; and Maranao leaves
# a noun unmarked after a numeral, so one form is correct anyway. Every
# `$…Count` and `$count` select is collapsed to a single `*[other]`. The
# explicit numeric literals English forks on are kept where the branch is a
# real distinction rather than a plural rule.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] di pëkhagamit so { $attributes } amay ka dowa a endpoint i miyatëndo
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] di pëkhagamit so { $attributes } amay ka miyatëndo so endpoint go so midpoint
    }

line-segment-midpoint-offset-without-midpoint = da a epekto o midpointOffset amay ka da a midpoint

## `<line>`

line-points-undetermined-dimensions = Line a somasagad ko manga point a di matëndo i dimension iyan.

line-points-too-few-dimensions = Paliyogat a somagad so line ko manga point a dowa bo i dimension iyan.

line-points-depend-on-variables = Somasagad so line ko manga point a sarig ko manga variable: { $variables }.

line-equation-invalid-format = Di ontol a format o equation o line ko manga variable a { $variable1 } go { $variable2 }.

## `<ray>`

ray-overprescribed-through = So ray na miyatëndo sabap ko through, endpoint, go direction.  Di pëkhagamit so miyatëndo a through.

ray-dimension-mismatch = Di makaphagayon so numDimensions ko ray.

## `<vector>`

vector-overprescribed-head = So vector na miyatëndo sabap ko head, tail, go displacement.  Di pëkhagamit so miyatëndo a head.

vector-dimension-mismatch = Di makaphagayon so numDimensions ko vector.

## Attracting and constraining

attract-to-without-nearest-point = Di khagaga a makaokit ko `<{ $component }>` sabap ko da a nearestPoint a state variable iyan.

constrain-to-without-nearest-point = Di khagaga a marëkët ko `<{ $component }>` sabap ko da a nearestPoint a state variable iyan.

constrain-to-interior-without-nearest-point = Di khagaga a marëkët ko soled o `<{ $component }>` sabap ko da a nearestPoint a state variable iyan.

## `<choiceInput>`

choice-input-label-position-ignored = di pëkhagamit so labelPosition ko choiceInput a di inline

## Ordering children by index

choice-input-indices-count-mismatch = Di pëkhagamit so manga index a miyatëndo ko choiceInput sabap ko di makaphagayon so bilangan o manga index go so bilangan o manga wata a choice.

pretzel-indices-count-mismatch = Di pëkhagamit so manga index a miyatëndo ko problem sabap ko di makaphagayon so bilangan o manga index go so bilangan o manga wata a problem.

shuffle-indices-count-mismatch = Di pëkhagamit so manga index a miyatëndo ko shuffle sabap ko di makaphagayon so bilangan o manga index go so bilangan o manga component.

indices-ignored-out-of-range = Di pëkhagamit so manga index a miyatëndo ko { $component } sabap ko aden a manga index a liyo ko range.

pretzel-indices-repeated = Di pëkhagamit so manga index a miyatëndo ko pretzel sabap ko aden a manga index a miyakadowa.

pretzel-circuit-first-index = Di pëkhagamit so manga index a miyatëndo ko pretzel ko circuit mode sabap ko paliyogat a 1 so paganay a index.

## `<shuffle>` and `<sort>`

string-children-need-type = A an makagalëbëk so `<{ $component }>` ago so manga wata a string, paliyogat a matëndo so `type` a attribute.

invalid-type-defaulting-to-math = Di ontol a type { $type } ko { $component } a component. Paliyogat a isa ko math, text, number, odi na boolean. Pëkhagamit so math.

string-not-valid-component-to-arrange = So string a "{ $value }" na di ontol a component ko { $component }. Di pëkhagamit.

## Types and variables

invalid-type-defaulting-to-number = Di ontol a type { $type }, pëtagoon so type sa number.

invalid-variable-value = Di ontol a value o isa a variable: `{ $value }`

## Variants

variant-index-must-be-number = So variant index a { $index } na paliyogat a number

variant-index-must-be-integer = So variant index a { $index } na paliyogat a integer

## `<sideBySide>`

side-by-side-absolute-widths = Da pën mapasad so `<{ $component }>` ko manga absolute a sokatan. Pëtagoon so manga width sa relative.

side-by-side-absolute-margins = Da pën mapasad so `<{ $component }>` ko manga absolute a sokatan. Pëtagoon so manga margin sa relative.

side-by-side-no-block-child = Di ontol a `<{ $component }>`: paliyogat a aden a isa bo a wata iyan a block.

## `<label>`

label-for-ignored-on-graphical = Di pëkhagamit so `for` a attribute ko graphical a `<label>`.

label-for-must-resolve-to-one = So `for` a attribute ko `<label>` na paliyogat a mitoro ko isa bo a component.

label-for-unresolved = Di khagaga a mitoro ko isa a component so `for` a attribute ko `<label>`.

label-for-answer-with-authored-inputs = So `for` a attribute ko `<label>` na pëtoro ko `<answer>` a aden a manga input a siyorat o author; toro-a so input a ginawa niyan.

label-for-answer-without-input = So `for` a attribute ko `<label>` na pëtoro ko `<answer>` a da a input a khalabelan.

label-for-must-reference-input-or-answer = So `for` a attribute ko `<label>` na paliyogat a pëtoro ko isa a input odi na ko isa a answer.

## Accessibility

accessibility-short-description-or-decorative = Makapantag ko accessibility, so `<{ $component }>` na paliyogat a aden a maikot a description iyan odi na matëndo a decorative.

accessibility-video-short-description = Makapantag ko accessibility, so `<video>` na paliyogat a aden a maikot a description iyan.

accessibility-input-short-description-or-label = Makapantag ko accessibility, so `<{ $component }>` na paliyogat a aden a maikot a description iyan odi na label.

accessibility-answer-input-short-description-or-label = Makapantag ko accessibility, so `<answer>` a pëmbaal sa input na paliyogat a aden a maikot a description iyan odi na label.

accessibility-short-description-contains-math = Di paliyogat a aden a math component a datar o `<{ $component }>` ko manga maikot a description. Isorat sa katharo so langon a math.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Di makatarotop so contrast o { $colorName } ko text o section heading (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; paliyogat a { $threshold }:1 pën).
       *[other] Di makatarotop so contrast o { $colorName } ko text o section heading ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; paliyogat a { $threshold }:1 pën).
    }

## `<circle>`

circle-through-points-non-numerical = Da pën mapasad so `<circle>` a somasagad ko { $count } a point amay ka da a numerical a value o manga point.

circle-too-many-through-points = Di khagaga a makalkula so circle a somasagad ko labi ko 3 a point.

circle-overprescribed-radius-center-points = Di khagaga a makalkula so circle a miyatëndo i radius, center, go manga through point iyan.

circle-center-with-multiple-points = Di khagaga a makalkula so circle a miyatëndo i center iyan go somasagad ko labi ko 1 a point.

circle-radius-too-small = Di khagaga a makalkula so circle: sabap ko so kawatan o dowa a point na { $distance }, so miyatëndo a radius a { $radius } na maito a maito.

circle-radius-with-many-points = Di khagaga a mabaal so circle a somasagad ko labi ko dowa a point a miyatëndo i radius iyan.

circle-invalid-center-or-through-points = Di ontol a center odi na manga through point o circle.

circle-radius-center-with-multiple-points = Di khagaga a makalkula so radius o circle a miyatëndo i center iyan go somasagad ko labi ko 1 a point.

circle-change-radius-non-numerical = Di khagaga a masambian so radius o circle a di numerical so manga through point iyan

circle-radius-with-points-non-numerical = Di khagaga a mabaal so circle a somasagad ko labi ko isa a point a miyatëndo i radius iyan amay ka da a numerical a value.

circle-change-center-non-numerical = Da pën mapasad so kasambi ko center o circle a somasagad ko manga point a di numerical.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] Di makatarotop so dimension o domain o function. So domain na aden a { $intervals } a interval iyan ogaid na so function na aden a { $inputs ->
           *[other] { $inputs } a input
        } iyan.
    }

function-domain-invalid-format = Di ontol a format o domain o function.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Di pëkhagamit so maximum o function a di numerical.
        [minimum] Di pëkhagamit so minimum o function a di numerical.
        [extremum] Di pëkhagamit so extremum o function a di numerical.
        [point] Di pëkhagamit so point o function a di numerical.
        [slope] Di pëkhagamit so slope o function a di numerical.
       *[other] Di pëkhagamit so { $type } o function a di numerical.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Di pëkhagamit so maximum o function a da a soled iyan.
        [minimum] Di pëkhagamit so minimum o function a da a soled iyan.
        [extremum] Di pëkhagamit so extremum o function a da a soled iyan.
        [point] Di pëkhagamit so point o function a da a soled iyan.
       *[other] Di pëkhagamit so { $type } o function a da a soled iyan.
    }

function-points-too-close = Aden a dowa a point o function a marani a marani i darpa iyan. Di khagaga a matëndo so function.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] So manga iterate o function na khagaga bo amay ka lagid o bilangan o input so bilangan o output. Sangkai a function na aden a { $inputs } a input go { $outputs ->
           *[other] { $outputs } a output
        }.
    }

## `<sequence>`

sequence-invalid-length = Di ontol a length o sequence.  Paliyogat a integer a di negative.

sequence-invalid-step = Di ontol a step o sequence.  Paliyogat a number ko sequence a { $type } i type iyan.

sequence-invalid-endpoint-number = Di ontol a "{ $attribute }" o number a sequence.  Paliyogat a number.

sequence-invalid-endpoint-letters = Di ontol a "{ $attribute }" o letters a sequence.  Paliyogat a combination a manga letter.

sequence-invalid-endpoint = Di ontol a "{ $attribute }" o sequence.

select-from-sequence-coprime-not-numbers = di pëkhagamit so coprime sabap ko di manga number so pëpilin

select-from-sequence-coprime-with-exclude-combinations = di pëkhagamit so coprime sabap ko miyatëndo so excludeCombinations

## Resolving a `target`

target-not-found = Di ontol a target ko `<{ $source }>`: da mailay so target.

target-state-variable-not-found = Di ontol a target ko `<{ $source }>`: da mailay so state variable a "{ $property }" i ngaran iyan ko isa a `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = So manga variable o `<odeSystem>` na paliyogat a salakaw ko independent variable.

ode-system-duplicate-variable-names = Di khagaga a matëndo so manga ODE RHS a function a lagid i ngaran o dependent variable iyan.

ode-system-rhs-function-error = Di khagaga a matëndo so ODE RHS a function.  Aden a kasalaan ko kambaal ko mathjs a function.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Di khagaga a matëndo so angle ko lët o { $count } a line

angle-invalid-through-point = Di ontol a point ko through o `<angle>`

parabola-vertex-too-many-points = Da pën mapasad so parabola a aden a vertex iyan go somasagad ko labi ko 1 a point.

parabola-too-many-points = Da pën mapasad so parabola a somasagad ko labi ko 3 a point.

intersection-too-many-items = Da pën mapasad so intersection ko labi ko dowa a shay

## Other math components

ionic-compound-not-two-ions = Da pën mapasad so ionic compound a di dowa a ion.

ionic-compound-needs-cation-and-anion = Miyapasad bo so ionic compound ko isa a cation go isa a anion.

solve-equations-cannot-evaluate = Di khagaga a masolba so equation sabap ko di khagaga a ma-evaluate: { $equation }

math-operators-operand-number-required = Paliyogat a matëndo so operandNumber amay ka pëkhowa so isa a math operand.

eigen-decomposition-failed = Di khagaga a makalkula so manga eigenvalue o matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: so parameter a { $parameters } na da ko pattern, na blangko i khaphagayonan iyan sa dayon sa dayon.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: di khagaga a masabot so grid="{ $grid }". Paliyogat a none, medium, dense, odi na dowa a positive a number a miyabëlag o isa a space, a datar o grid="1 0.5". Da a grid a miyabaal.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    So `<{ $component }>` na paliyogat a aden a function iyan a aden a { $expected ->
        [1] isa a output, so slope a y' ko oman i point, a datar o `y - x`
       *[other] dowa a output, so vector ko oman i point, a datar o `(y, -x)`
    }, ogaid na so miyabëgay a function na aden a { $found ->
       *[other] { $found } a output
    } iyan. { $alternative ->
        [none] Da a miyabaal.
       *[other] So `<{ $alternative }>` i component ko oto a function. Da a miyabaal.
    }

field-function-attribute-ignored-with-child = Di pëkhagamit so `function` a attribute sabap ko miyabëgay mambo so function ko soled o component; so soled i pëkhagamit. Isa bo ko dowa a okit i kabëgi ko function.

field-variables-ignored =
    `<{ $component }>`: so `variables` a attribute na pëngaranan iyan so manga variable o expression a siyorat ko mismo a soled o component. { $reason ->
        [function-child] So function sii na miyabëgay a wata a `<function>`, a pëngaranan iyan so manga variable iyan a ginawa niyan, na di pëkhagamit so `variables`.
       *[no-expression] Da a datar oto a expression sii, na di pëkhagamit so `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: da masuporta so xLabelPosition="left" ko prefigure renderer; pëkhagamit so okit o right-position.

prefigure-y-label-position-unsupported = `<graph>`: da masuporta so yLabelPosition="bottom" ko prefigure renderer; pëkhagamit so okit o top-position.

prefigure-invalid-axis-bounds = `<graph>`: di ontol a manga axis bound ko prefigure conversion; pëkhagamit so default a bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: di ontol a width ko prefigure conversion; pëkhagamit so default a diagram width a 425.

prefigure-invalid-aspect-ratio = `<graph>`: di ontol a aspectRatio ko prefigure conversion; pëkhagamit so default a aspect ratio a 1.

prefigure-grid-spacing-too-fine = `<graph>`: maikot a maikot so lët o grid ko manga axis limit; di pëkhagamit so grid ko prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: di khabaal so manga annotation amay ka di PreFigure renderer i pëkhagamit.

multiple-annotations-children = Madakël a wata a `<annotations>` i miyailay ko `<graph>`; di pëkhagamit so langon inonta bo so oriyan.

## Referring to other components

copy-unrecognized-component-type = Di khagaga a ma-extend odi na makopya so di kakatawan a component type: { $type }.

copy-prop-not-found = Da mailay so prop a { $property } ko isa a component a { $component } i type iyan

collect-no-source = Da mailay a source ko collect.

collect-invalid-component-type = Di khagaga a matimo so manga component a `<{ $component }>` i type iyan sabap ko di ontol a component type.

reference-index-unavailable = Di khagaga a matoro so index a `{ $reference }`

## `<callAction>`

component-action-unavailable = Di khagaga a matawag so { $action } ko component a `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Di ontol i baay o data.  Di makaphagayon so length o manga row. Miyailay ko componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Aden a lagid a manga ngaran a column ko data.  Miyailay ko componentIdx :{ $componentIdx }

data-frame-missing-column-name = Da a isa a ngaran a column ko data.  Miyailay ko componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = So isa a award ko sangkai a answer na sarig ko sëmbag a miyasogo o answer tag a ginawa niyan, na khabaloy oto a di khatandaan a galëbëk.

answer-max-num-attempts-in-section-wide-check-work = Da a epekto o katago ko `maxNumAttempts` ko isa a `<answer>` a soled o isa a container a aden a `sectionWideCheckWork` iyan, sabap ko so container i pëthanggong ko bilangan o sobok. Tagoi so `maxNumAttempts` ko container.

nested-section-wide-check-work-max-num-attempts = Da a epekto o katago ko `maxNumAttempts` ko isa a container a aden a `sectionWideCheckWork` iyan a soled o salakaw a container a aden mambo a `sectionWideCheckWork` iyan, sabap ko so container ko liyo i pëthanggong ko bilangan o sobok. Tagoi so `maxNumAttempts` ko container ko liyo.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] Da a epekto o { $attributes } a attribute amay ka da matago so symbolicEquality.
    }

answer-invalid-type = Di ontol a type ko answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sabap ko da a ngaran o component a `<{ $component }>`, di khagaga a magamit oto a attribute o module

module-attribute-name-already-defined = Di khagaga a magamit so component a `<{ $component } name="{ $name }">` a attribute o module sabap ko aden den a "{ $name }" a attribute o `<module>` a component type.

conditional-content-condition-ignored = Di pëkhagamit so `condition` a attribute ko `<conditionalContent>` a component a aden a manga wata iyan a case odi na else.

slider-markers-type-mismatch = Di makaphagayon so type o manga marker go so type o slider.

pretzel-problem-needs-statement-and-answer = Di ontol a pretzel: so oman i `<problem>` na paliyogat a aden a isa a `<statement>` go isa a `<answer>` iyan.

pretzel-circuit-first-problem-distractor = Di ontol a pretzel: ko mode="circuit", di khagaga a distractor so paganay a `<problem>`.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] Di ontol a value a { $values } ko `{ $attribute }` a attribute; di pëkhagamit.
    }

attribute-must-be-references = Di ontol a value a `{ $value }` ko `{ $attribute }` a attribute. Paliyogat a mabaal so attribute a phoon ko manga reference a `$` i pëphoonan iyan.

math-input-invalid-function-names = <mathInput>: di pëkhagamit so manga di ontol a ngaran a function ko { $attribute }: { $names }. So pakaphayag a bagi o oman i ngaran na paliyogat a dowa a character pën (manga letter odi na manga dash); khaonot so `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Di ontol a component type: `<{ $componentType }>`

attribute-repeated = Di khagaga a maphakadowa so { $attribute } a attribute.

attribute-invalid-for-component = Di ontol a "{ $attribute }" a attribute ko isa a component a `<{ $componentType }>` i type iyan.

## Style definition contrast

style-definition-insufficient-contrast =
    So style definition a { $styleNumber } na di makatarotop so contrast iyan ko { $context ->
        [text-on-background] color o text a i-ayon ko color o background
        [high-contrast] high-contrast a color a i-ayon ko canvas
        [line] color o line a i-ayon ko canvas
        [marker] color o marker a i-ayon ko canvas
       *[text-on-canvas] color o text a i-ayon ko canvas
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; paliyogat a { $threshold }:1 pën).

style-definition-dark-mode-text-background-contrast =
    Apiya pën so style definition a { $styleNumber } na aden a manga color iyan a makatarotop i contrast ko light mode, so manga dark-mode a color a miyaphoon sangkai a manga value na di makatarotop so contrast o color o text a i-ayon ko color o background ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; paliyogat a { $threshold }:1 pën). { $suggestion ->
        [available] A an makatarotop so contrast ko dark mode, pakaporo-a so contrast ko light mode (datar o katago ko { $lightAttribute }="{ $lightColor }") odi na sambii so dark-mode a color (datar o katago ko { $darkAttribute }="{ $darkColor }").
       *[none] A an makatarotop so contrast ko dark mode, pakaporo-a so contrast ko light mode odi na sambii so manga miyaphoon a color sa textColorDarkMode go/odi na backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Apiya pën so style definition a { $styleNumber } na aden a text color iyan a makatarotop i contrast ko light mode, so dark-mode a text color a miyaphoon sangkai a value na di makatarotop so contrast iyan a i-ayon ko canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; paliyogat a { $threshold }:1 pën). { $suggestion ->
        [available] A an makatarotop so contrast ko dark mode, pakaporo-a so contrast ko light mode (datar o katago ko textColor="{ $lightColor }") odi na sambii so dark-mode a color (datar o katago ko textColorDarkMode="{ $darkColor }").
       *[none] A an makatarotop so contrast ko dark mode, pakaporo-a so contrast ko light mode odi na sambii so miyaphoon a color sa textColorDarkMode.
    }

section-multiple-style-palettes = Isa bo a <stylePalette> i khapili o isa a section; pëkhagamit so oriyan.

## Unique variants

variant-num-to-select-not-non-negative-integer = di matëndo so manga unique variant o { $component } sabap ko so numToSelect na di integer a di negative.

variant-num-to-select-not-constant-number = di matëndo so manga unique variant o { $component } sabap ko so numToSelect na di constant a number.

variant-with-replacement-not-constant-boolean = di matëndo so manga unique variant o { $component } sabap ko so withReplacement na di constant a boolean.

variant-select-weight-disables-unique = Di khagaga so manga unique variant ko select amay ka aden a option a miyatëndo i selectWeight odi na selectForVariants iyan

variant-coprime-undetermined = di matëndo so manga unique variant o { $component } sabap ko di matëndo o so coprime na false sa dayon sa dayon.

variant-attribute-not-constant = di matëndo so manga unique variant o { $component } sabap ko so { $attribute } na di constant.

variant-attribute-not-number = di matëndo so manga unique variant o { $component } sabap ko so { $attribute } na di number.

variant-attribute-wrong-type-for-sequence =
    di matëndo so manga unique variant o { $component } a { $type } i type iyan sabap ko so { $attribute } na di { $expected ->
        [letters-combination] combination a manga letter
        [math-expression] ontol a math expression
        [integer] integer
       *[number] number
    }.

variant-length-not-integer = di matëndo so manga unique variant o { $component } sabap ko so length na di integer.

variant-sort-not-implemented = da pën mapasad so manga unique variant o isa a { $component } a aden a sort iyan

variant-exclude-combinations-not-implemented = da pën mapasad so manga unique variant o isa a { $component } a aden a excludeCombinations iyan

variant-math-exclude-not-implemented = da pën mapasad so manga unique variant o isa a { $component } a math i type iyan a aden a exclude iyan

variant-non-constant-exclude-not-implemented = da pën mapasad so manga unique variant o isa a { $component } a di constant so exclude iyan

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: da masuporta ko graph prefigure renderer; miyalëpasan so descendant.

prefigure-descendant-invalid-geometry = { $subject }: di makatarotop odi na di khadaan a geometry; miyalëpasan so descendant.

prefigure-curve-label-omitted = { $subject }: da masuporta so manga label ko manga miyasambian a curve element; da matago so label.

prefigure-curve-unsupported-definition-type = { $subject }: da masuporta a curve function definition type a '{ $definitionType }'; miyalëpasan so descendant.

prefigure-region-flip-functions-unsupported = { $subject }: da masuporta a flipFunctions a attribute ko regionBetweenCurves; miyalëpasan so descendant.

prefigure-region-non-formula-child = { $subject }: so manga wata a function a formula i type iyan bo i masuporta ko regionBetweenCurves; miyalëpasan so descendant.

prefigure-label-position-unsupported =
    { $subject }: da masuporta a labelPosition a '{ $labelPosition }' ko { $labelKind ->
        [line-family] label o line-family
       *[point] label o point
    }; pëkhagamit so default a alignment o PreFigure.

prefigure-fill-style-unsupported = { $subject }: da masuporta o PreFigure so fill style a '{ $fillStyle }'; pëkhagamit so solid a fill.

prefigure-line-style-unknown = { $subject }: di kakatawan a line style a '{ $lineStyle }'; da matago ko output o PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: so marker style a '{ $markerStyle }' na miyasambi ko 'diamond' a style o PreFigure.

prefigure-marker-style-unsupported = { $subject }: da masuporta o PreFigure so marker style a '{ $markerStyle }'; pëkhagamit so default a style.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: di ontol a `ref`; di khagaga a matoon so target. Da matago so annotation.

annotation-ref-multiple-targets = `<annotation>`: madakël a target i miyaphoon ko `ref`; pëkhagamit so paganay a target.

annotation-ref-outside-graph = `<annotation>`: di ontol a `ref`; so target na liyo ko graph a katatagoan iyan. Da matago so annotation.

annotation-ref-unsupported-target = `<annotation>`: di ontol a `ref`; so target na di masuporta a graphical object ko prefigure conversion. Da matago so annotation.

annotation-text-missing = `<annotation>`: da odi na blangko so `text`; blangko a text i miyabaal.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Aden a miyailay a circular dependency.
       *[other] Aden a miyailay a circular dependency a khaonotan o `<{ $componentType }>` a component.
    }

reference-no-referent = Da mailay a pëtoroon o reference: `{ $reference }`

reference-multiple-referents = Madakël a pëtoroon a miyailay o reference: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Di ontol a format o { $attribute } a attribute o `<{ $componentType }>`.

children-invalid = Di ontol a manga wata ko `<{ $componentType }>`: Miyailay so manga di ontol a wata: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Di ontol a value a `{ $value }` ko `{ $attribute }` a attribute, pëkhagamit so value a `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Da mailay so DoenetML version a { $version }.
       *[other] Da mailay so DoenetML version a { $version }. Pëkhagamit so version a { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Di ontol a DoenetML: { $content }

parse-tag-missing-close-tag = Di ontol a DoenetML: Da a closing tag o tag a `{ $tag }`. Paliyogat a self-closing a tag odi na `</{ $tagName }>` a tag.

parse-tag-error = Di ontol a DoenetML: Aden a kasalaan ko tag a `<{ $tagName }>`

parse-attribute-missing-value = Di ontol a DoenetML: So di ontol a attribute a `{ $attribute }` na datar o da a value iyan.

parse-attribute-invalid = Di ontol a DoenetML: Di ontol a attribute a `{ $attribute }`

parse-attribute-value-invalid = Di ontol a DoenetML: Di ontol a attribute value a `{ $value }`

parse-attribute-value-quote-mismatch = Di ontol a DoenetML: Di ontol a attribute value a `{ $value }`. Di makaphagayon so manga quote mark. Datar o da a isa a `{ $quote }`

parse-open-tag-name-missing = Di ontol a DoenetML: Miyailay so isa a tag a da a ngaran iyan, datar o `<`

parse-tag-not-closed = Di ontol a DoenetML: Da masara so tag a `{ $tag }` (datar o da a `>`).

parse-self-closing-tag-name-missing = Di ontol a DoenetML: Miyailay so isa a tag a da a ngaran iyan `<{ $content }>`

parse-self-closing-tag-not-closed = Di ontol a DoenetML: Da masara so tag a `{ $tag }` (datar o da a `/>`).

parse-tag-invalid-attributes = Di ontol a DoenetML: Di ontol so tag a `{ $tag }`. Khabaloy a di ontol so manga attribute iyan.

parse-close-tag-name-missing = Di ontol a DoenetML: Miyailay so isa a closing tag a da a ngaran iyan, datar o `</`

parse-attribute-value-unquoted = Paliyogat a matago ko manga quote so manga attribute value: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Di ontol a DoenetML: Miyailay so closing tag a `{ $tag }`, ogaid na da a mapëmbaal iyan a opening tag

parse-close-tag-mismatched = Di ontol a DoenetML: Di makaphagayon so closing tag. Aantapën so `</{ $expected }>`. Miyailay so `{ $found }`

parser-node-unconvertible = Di khagaga a masambi so node a { $node } sa Dast node.

## Names

name-attribute-invalid =
    Di ontol a attribute a name='{ $name }'. { $reason ->
        [characters] So manga ngaran na khatagoan bo sa manga letter, manga number, underscore odi na hyphen.
       *[start] Paliyogat a phoon ko isa a letter so manga ngaran.
    }

component-name-invalid-start = Di ontol a ngaran a component a "{ $name }". Paliyogat a phoon ko isa a letter so manga ngaran.

## `<answer>` sugar

answer-video-watched-missing-video = So answer a videoWatched i type iyan na paliyogat a aden a video a attribute iyan

answer-video-watched-video-not-reference = So answer a videoWatched i type iyan na paliyogat a so video a attribute iyan na isa a reference

answer-name-not-single-text = So name a attribute o answer na paliyogat a aden a isa bo a wata iyan a text

## Referencing another document

external-doenetml-recursion-limit = Di khagaga a makowa so DoenetML ko liyo sabap ko madakël a maito a level o recursion. Ba aden a circular reference?

external-doenetml-unavailable = Di khagaga a makowa so DoenetML a phoon ko { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Di ontol a DoenetML i miyakowa phoon ko { $attribute }="{ $uri }": da makaphagayon ko "{ $componentType }" a component type

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Deprecated den so `{ $from }` a attribute; gamita so `{ $to }`.
       *[other] [deprecation] Deprecated den so `{ $from }` a attribute ko `<{ $component }>`; gamita so `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Deprecated den so `{ $from }` a attribute go di pëkhagamit sabap ko miyatëndo mambo so `{ $to }`.
       *[other] [deprecation] Deprecated den so `{ $from }` a attribute ko `<{ $component }>` go di pëkhagamit sabap ko miyatëndo mambo so `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Deprecated den so `{ $attribute }` a attribute ko `<{ $component }>` go di pëkhagamit.

deprecated-attribute-to-child = [deprecation] Deprecated den so `{ $attribute }` a attribute ko `<{ $component }>`; gamita so isa a wata a `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Deprecated den so value a `{ $value }` o `{ $attribute }` a attribute ko `<{ $component }>`; gamita so `{ $to }`.


## Language coverage

pluralize-english-only = So `<pluralize>` na khagaga niyan bo a pakadakëlën so Ingles, na di pëkhasambian so text iyan ko document a miyasorat sa { $locale }. Isorat a ginawa niyan so plural form, odi na tagoi oto ko `pluralForm` a attribute.


## Checking against the schema

schema-element-unrecognized = So element a `<{ $tag }>` na di kakatawan a element o Doenet.

schema-element-not-allowed-at-root = Di khibëgay so element a `<{ $tag }>` ko root o document.

schema-element-not-allowed-inside = Di khibëgay so element a `<{ $tag }>` ko soled o `<{ $parent }>`.

schema-attribute-unrecognized = So element a `<{ $tag }>` na da a attribute iyan a `{ $attribute }` i ngaran iyan.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] So `{ $attribute }` a attribute o element a `<{ $tag }>` na paliyogat a list a so oman i item iyan na isa ko: { $allowed }
       *[other] So `{ $attribute }` a attribute o element a `<{ $tag }>` na paliyogat a isa ko: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Di ontol a variant name ko select.  So variant name a { $variantName } na pëkhailay ko { $numOptions } a option ogaid na so bilangan a khapili na { $numToSelect }.

select-variant-name-without-options = Aden a manga variant a miyatëndo ko select ogaid na da a option a miyatëndo ko khabaloy a variant name: { $variantName }.

select-variant-name-not-possible = So variant name a { $variantName } a miyatëndo ko select na di khabaloy a variant name.

select-too-few-options = Di khagaga a mapili so { $numToSelect } a component ko { $numOptions } bo.

select-from-sequence-too-few-values = Di khagaga a mapili so { $numToSelect } a value ko sequence a { $length } i length iyan.

select-from-sequence-indices-count-mismatch = Paliyogat a makaphagayon so bilangan o manga index a miyatëndo ko select go so bilangan a khapili

select-from-sequence-indices-not-integers = Paliyogat a manga integer so langon a index a miyatëndo ko select

select-from-sequence-index-excluded = Miyatëndo so index o selectfromsequence a miyaawa

select-from-sequence-indices-excluded-combination = Miyatëndo so manga index o selectfromsequence a miyaawa a combination

select-from-sequence-coprime-not-positive-integers = Di khagaga a mapili so manga coprime a combination sabap ko di manga positive a integer so pëpilin.

select-from-sequence-coprime-common-factor = Di khagaga a mapili so manga coprime a number. So langon a khabaloy a value na lagid i factor iyan. (Paliyogat a coprime ko "step" so miyatëndo a manga value o "from" odi na "to".)

select-from-sequence-coprime-single-number = Di khagaga a mapili so manga coprime a combination ko isa bo a number a di 1.

select-from-sequence-excluded-too-many-combinations = Miyaawa so labi ko 70% o manga combination ko selectFromSequence

select-from-sequence-coprime-none-found = Da khagaga a mapili so manga coprime a number. So langon a khabaloy a value na lagid i factor iyan.

select-from-sequence-too-few-unique-values = Di khagaga a mapili so { $numToSelect } a unique a value ko sequence a { $numPossibleValues } i length iyan

select-prime-numbers-too-few-values = Di khagaga a mapili so { $numToSelect } a value ko list o manga prime a { $numValues } i length iyan

select-prime-numbers-values-count-mismatch = Paliyogat a makaphagayon so bilangan o manga value a miyatëndo ko select go so bilangan a khapili

select-prime-numbers-values-not-prime = Paliyogat a matago ko list o manga prime so langon a value a miyatëndo ko select prime number

select-prime-numbers-values-excluded-combination = Miyatëndo so manga value o selectPrimeNumbers a miyaawa a combination

select-prime-numbers-excluded-too-many-combinations = Miyaawa so labi ko 70% o manga combination ko selectPrimeNumbers

select-random-combination-fluke = Sabap ko tanto a di khatandaan a kiyaokitan, da khapili so combination o manga random a value

select-random-value-fluke = Sabap ko tanto a di khatandaan a kiyaokitan, da khapili so random a value

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Di pëkhailay ini a `<{ $component }>` sabap ko matatago ko math go di `inline`. Omani sa `inline` a an mabaloy a drop-down list, a khatago ko soled o isa a expression.
        [expanded] Di pëkhailay ini a `<{ $component }>` sabap ko matatago ko math go `expanded`. Awa-a so `expanded`; di khatago ko soled o isa a expression so box a madakël i line.
        [on-graph] Di pëkhailay ini a `<{ $component }>` sabap ko matatago ko math a miyabaal ko isa a graph, a da a darpa niyan a bagian o input.
       *[relative-width] Di pëkhailay ini a `<{ $component }>` sabap ko matatago ko math go relative i width iyan. Bëgi so width sa manga absolute a unit, a datar o `px`.
    }
