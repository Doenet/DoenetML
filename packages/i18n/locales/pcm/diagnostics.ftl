# Nigerian Pidgin diagnostics: errors and warnings surfaced to the reader or
# author. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and attribute values — `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `math`, `text` and the rest —
# are part of the language rather than prose, and stay in English exactly as
# written. In this catalog that rule has to be applied by eye rather than by
# looking for a foreign word, since the prose is English-lexified too.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] wi dey ignọ { $attributes } wen yu don gi two ẹndpoint
       *[other] wi dey ignọ { $attributes } wen yu don gi two ẹndpoint
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] wi dey ignọ { $attributes } wen yu gi ẹndpoint an midpoint togẹda
       *[other] wi dey ignọ { $attributes } wen yu gi ẹndpoint an midpoint togẹda
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset no dey do enitin if midpoint no dey

## `<line>`

line-points-undetermined-dimensions = Lain wey pass point wey wi no sabi dia daimẹnshọn.

line-points-too-few-dimensions = Lain must pass point wey gẹt at list two daimẹnshọn.

line-points-depend-on-variables = Lain dey pass point wey dipẹnd ọn vẹriabul dem: { $variables }.

line-equation-invalid-format = Di fọmat of di lain ikweshọn no korẹkt fọ vẹriabul { $variable1 } an { $variable2 }.

## `<ray>`

ray-overprescribed-through = Yu don gi di re through, endpoint an direction.  Wi dey ignọ di through wey yu gi.

ray-dimension-mismatch = numDimensions no mach fọ di re.

## `<vector>`

vector-overprescribed-head = Yu don gi di vẹkta head, tail an displacement.  Wi dey ignọ di head wey yu gi.

vector-dimension-mismatch = numDimensions no mach fọ di vẹkta.

## Attracting and constraining

attract-to-without-nearest-point = Wi no fit atrakt to `<{ $component }>` bikọs e no gẹt nearestPoint stet vẹriabul.

constrain-to-without-nearest-point = Wi no fit kọnstren to `<{ $component }>` bikọs e no gẹt nearestPoint stet vẹriabul.

constrain-to-interior-without-nearest-point = Wi no fit kọnstren to di insai of `<{ $component }>` bikọs e no gẹt nearestPoint stet vẹriabul.

## `<choiceInput>`

choice-input-label-position-ignored = wi dey ignọ labelPosition fọ choiceInput wey no bi inline

## Ordering children by index

choice-input-indices-count-mismatch = Wi dey ignọ di indices wey yu gi choiceInput bikọs di nọmba of indices no mach di nọmba of choice pikin.

pretzel-indices-count-mismatch = Wi dey ignọ di indices wey yu gi problem bikọs di nọmba of indices no mach di nọmba of problem pikin.

shuffle-indices-count-mismatch = Wi dey ignọ di indices wey yu gi shuffle bikọs di nọmba of indices no mach di nọmba of kọmponẹnt.

indices-ignored-out-of-range = Wi dey ignọ di indices wey yu gi { $component } bikọs sọm of dem dey aut of renj.

pretzel-indices-repeated = Wi dey ignọ di indices wey yu gi pretzel bikọs sọm of dem ripit.

pretzel-circuit-first-index = Wi dey ignọ di indices wey yu gi pretzel fọ mode="circuit" bikọs di fẹst index must bi 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Fọ make `<{ $component }>` wọk wit string pikin, yu must gi am `type` attribute.

invalid-type-defaulting-to-math = Taip { $type } no korẹkt fọ { $component } kọmponẹnt. E must bi math, text, number ọ boolean. Wi go yuz math.

string-not-valid-component-to-arrange = String "{ $value }" no bi kọmponẹnt wey korẹkt fọ { $component }. Wi dey ignọ am.

## Types and variables

invalid-type-defaulting-to-number = Taip { $type } no korẹkt, wi don sẹt di taip to number.

invalid-variable-value = Vẹriabul valyu wey no korẹkt: `{ $value }`

## Variants

variant-index-must-be-number = Vẹriant index { $index } must bi nọmba

variant-index-must-be-integer = Vẹriant index { $index } must bi hol nọmba

## `<sideBySide>`

side-by-side-absolute-widths = Wi neva impliment `<{ $component }>` fọ absolut mẹzhọmẹnt. Wi don sẹt di widt to rẹlativ.

side-by-side-absolute-margins = Wi neva impliment `<{ $component }>` fọ absolut mẹzhọmẹnt. Wi don sẹt di majin to rẹlativ.

side-by-side-no-block-child = `<{ $component }>` no korẹkt: e must gẹt at list wan block pikin.

## `<label>`

label-for-ignored-on-graphical = Wi dey ignọ di `for` attribute ọn grafikal `<label>`.

label-for-must-resolve-to-one = Di `for` attribute ọn `<label>` must point to ẹgzaktli wan kọmponẹnt.

label-for-unresolved = Di `for` attribute ọn `<label>` no fit point to eni kọmponẹnt.

label-for-answer-with-authored-inputs = Di `for` attribute ọn `<label>` dey point to `<answer>` wey gẹt input wey di ọtọ rait wit im on han; point to di input dairẹkt.

label-for-answer-without-input = Di `for` attribute ọn `<label>` dey point to `<answer>` wey no gẹt input to lebul.

label-for-must-reference-input-or-answer = Di `for` attribute ọn `<label>` must point to input ọ answer.

## Accessibility

accessibility-short-description-or-decorative = Fọ aksẹsibiliti, `<{ $component }>` must gẹt shọt dẹskripshọn ọ yu must mak am as decorative.

accessibility-video-short-description = Fọ aksẹsibiliti, `<video>` must gẹt shọt dẹskripshọn.

accessibility-input-short-description-or-label = Fọ aksẹsibiliti, `<{ $component }>` must gẹt shọt dẹskripshọn ọ lebul.

accessibility-answer-input-short-description-or-label = Fọ aksẹsibiliti, `<answer>` wey dey krieat input must gẹt shọt dẹskripshọn ọ lebul.

accessibility-short-description-contains-math = Shọt dẹskripshọn no supoz gẹt mat kọmponẹnt lai `<{ $component }>`. Rait di mat wit wọd.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } no gẹt inọf kọntrast fọ di sẹkshọn hedin tẹks (dak mod) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e nid at list { $threshold }:1).
       *[other] { $colorName } no gẹt inọf kọntrast fọ di sẹkshọn hedin tẹks ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e nid at list { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Wi neva impliment `<circle>` wey pass { $count } point wen di point dem no gẹt nọmba valyu.

circle-too-many-through-points = Wi no fit kalkulet raun wey pass mọ dan 3 point.

circle-overprescribed-radius-center-points = Wi no fit kalkulet raun wen yu gi radius, sẹnta an point togẹda.

circle-center-with-multiple-points = Wi no fit kalkulet raun wit sẹnta wey pass mọ dan 1 point.

circle-radius-too-small = Wi no fit kalkulet di raun: sins di distans bitwin di two point na { $distance }, di radius { $radius } wey yu gi smọl too mọch.

circle-radius-with-many-points = Wi no fit krieat raun wey pass mọ dan two point wit radius wey yu gi.

circle-invalid-center-or-through-points = Di sẹnta ọ di point dem of di raun no korẹkt.

circle-radius-center-with-multiple-points = Wi no fit kalkulet di radius of raun wit sẹnta wey pass mọ dan 1 point.

circle-change-radius-non-numerical = Wi no fit chenj di radius of raun wey di point dem no gẹt nọmba valyu

circle-radius-with-points-non-numerical = Wi no fit krieat raun wey pass mọ dan wan point wit radius wen nọmba valyu no dey.

circle-change-center-non-numerical = Wi neva impliment chenjin di sẹnta of raun wey pass point wey no gẹt nọmba valyu.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Di daimẹnshọn no inọf fọ di domain of di fọnkshọn. Di domain gẹt { $intervals } intaval bọt di fọnkshọn gẹt { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } input
        }.
       *[other] Di daimẹnshọn no inọf fọ di domain of di fọnkshọn. Di domain gẹt { $intervals } intaval bọt di fọnkshọn gẹt { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } input
        }.
    }

function-domain-invalid-format = Di fọmat of di domain of di fọnkshọn no korẹkt.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Wi dey ignọ di maksimọm of di fọnkshọn wey no bi nọmba.
        [minimum] Wi dey ignọ di minimọm of di fọnkshọn wey no bi nọmba.
        [extremum] Wi dey ignọ di ẹkstrimọm of di fọnkshọn wey no bi nọmba.
        [point] Wi dey ignọ di point of di fọnkshọn wey no bi nọmba.
        [slope] Wi dey ignọ di slop of di fọnkshọn wey no bi nọmba.
       *[other] Wi dey ignọ di { $type } of di fọnkshọn wey no bi nọmba.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Wi dey ignọ di ẹmti maksimọm of di fọnkshọn.
        [minimum] Wi dey ignọ di ẹmti minimọm of di fọnkshọn.
        [extremum] Wi dey ignọ di ẹmti ẹkstrimọm of di fọnkshọn.
        [point] Wi dey ignọ di ẹmti point of di fọnkshọn.
       *[other] Wi dey ignọ di ẹmti { $type } of di fọnkshọn.
    }

function-points-too-close = Di fọnkshọn gẹt two point wey nia dẹmsẹf too mọch. Wi no fit difain di fọnkshọn.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Fọnkshọn itaret dey posibul ọnli if di nọmba of input mach di nọmba of output. Dis fọnkshọn gẹt { $inputs } input an { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } output
        }.
       *[other] Fọnkshọn itaret dey posibul ọnli if di nọmba of input mach di nọmba of output. Dis fọnkshọn gẹt { $inputs } input an { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } output
        }.
    }

## `<sequence>`

sequence-invalid-length = Di lẹnt of di sequence no korẹkt.  E must bi hol nọmba wey no dey bilo ziro.

sequence-invalid-step = Di step of di sequence no korẹkt.  E must bi nọmba fọ sequence of type { $type }.

sequence-invalid-endpoint-number = Di "{ $attribute }" of di number sequence no korẹkt.  E must bi nọmba.

sequence-invalid-endpoint-letters = Di "{ $attribute }" of di letters sequence no korẹkt.  E must bi lẹta kọmbineshọn.

sequence-invalid-endpoint = Di "{ $attribute }" of di sequence no korẹkt.

select-from-sequence-coprime-not-numbers = wi dey ignọ coprime bikọs wi no dey pik nọmba

select-from-sequence-coprime-with-exclude-combinations = wi dey ignọ coprime bikọs yu don gi excludeCombinations

## Resolving a `target`

target-not-found = Di target fọ `<{ $source }>` no korẹkt: wi no fit si di target.

target-state-variable-not-found = Di target fọ `<{ $source }>` no korẹkt: wi no fit si stet vẹriabul wey nem bi "{ $property }" ọn `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Di vẹriabul of `<odeSystem>` must difrẹnt frọm di indipẹndẹnt vẹriabul.

ode-system-duplicate-variable-names = Wi no fit difain ODE RHS fọnkshọn wit dipẹndẹnt vẹriabul nem wey ripit.

ode-system-rhs-function-error = Wi no fit difain ODE RHS fọnkshọn.  Ẹra dey wen wi dey krieat di mathjs fọnkshọn.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Wi no fit difain angul bitwin { $count } lain

angle-invalid-through-point = Di point fọ di through of `<angle>` no korẹkt

parabola-vertex-too-many-points = Wi neva impliment parabola wit vertex wey pass mọ dan 1 point.

parabola-too-many-points = Wi neva impliment parabola wey pass mọ dan 3 point.

intersection-too-many-items = Wi neva impliment intasẹkshọn fọ mọ dan two tin

## Other math components

ionic-compound-not-two-ions = Wi neva impliment ayọnik kompaun fọ enitin ọda dan two ayọn.

ionic-compound-needs-cation-and-anion = Wi impliment ayọnik kompaun ọnli fọ wan katayọn an wan anayọn.

solve-equations-cannot-evaluate = Wi no fit sọlv di ikweshọn bikọs wi no fit ivaluet am: { $equation }

math-operators-operand-number-required = Yu must gi operandNumber wen yu dey ẹkstrakt mat operand.

eigen-decomposition-failed = Wi no fit kalkulet di aigẹnvalyu of di matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: di parameter { $parameters } no dey insai di patan, so e go ọlweiz mach blank.
       *[other] `<matchesPattern>`: di parameter { $parameters } no dey insai di patan, so dem go ọlweiz mach blank.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: wi no fit ọndastand grid="{ $grid }". E must bi none, medium, dense, ọ two positiv nọmba wey spes divaid dem, lai grid="1 0.5". Wi no go draw eni grid.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" no dey wọk fọ di prefigure rẹndara; wi dey yuz di rait-sait bihevia.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" no dey wọk fọ di prefigure rẹndara; wi dey yuz di tọp bihevia.

prefigure-invalid-axis-bounds = `<graph>`: di aksis baun no korẹkt fọ prefigure; wi dey yuz di difọlt bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: di widt no korẹkt fọ prefigure; wi dey yuz di difọlt daiagram widt 425.

prefigure-invalid-aspect-ratio = `<graph>`: di aspectRatio no korẹkt fọ prefigure; wi dey yuz di difọlt aspẹkt reshio 1.

prefigure-grid-spacing-too-fine = `<graph>`: di grid spesin fain too mọch fọ di aksis limit; wi no go put di grid fọ di prefigure rẹndara.

prefigure-annotations-not-rendered = `<graph>`: annotations no go sho if yu no dey yuz di PreFigure rẹndara.

multiple-annotations-children = Wi si many `<annotations>` pikin insai `<graph>`; wi dey ignọ ọl ẹksẹpt di last wan.

## Referring to other components

copy-unrecognized-component-type = Wi no fit ẹkstẹnd ọ kopi kọmponẹnt taip wey wi no sabi: { $type }.

copy-prop-not-found = Wi no fit si prop { $property } ọn kọmponẹnt of taip { $component }

collect-no-source = Wi no si sọs fọ collect.

collect-invalid-component-type = Wi no fit kolẹkt kọmponẹnt of taip `<{ $component }>` bikọs di taip no korẹkt.

reference-index-unavailable = Wi no fit rẹfrẹns index `{ $reference }`

## `<callAction>`

component-action-unavailable = Wi no fit kọl { $action } ọn kọmponẹnt `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Di data shep no korẹkt.  Di ro dem gẹt difrẹnt lẹnt. Wi si am fọ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Di data gẹt kọlum nem wey ripit.  Wi si am fọ componentIdx :{ $componentIdx }

data-frame-missing-column-name = Wan kọlum nem no dey fọ di data.  Wi si am fọ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Wan award fọ dis ansa dey bes ọn di answer tag ọn ansa wey dem sẹnd, an dat wan go kọz wahala wey yu no ẹkspẹkt.

answer-max-num-attempts-in-section-wide-check-work = If yu sẹt `maxNumAttempts` ọn `<answer>` wey dey insai kọntena wey gẹt `sectionWideCheckWork`, e no go do enitin, bikọs na di kọntena dey kọntrol di nọmba of tray. Sẹt `maxNumAttempts` ọn di kọntena instẹd.

nested-section-wide-check-work-max-num-attempts = If yu sẹt `maxNumAttempts` ọn kọntena wey gẹt `sectionWideCheckWork` an wey dey insai anoda kọntena wey gẹt `sectionWideCheckWork`, e no go do enitin, bikọs na di autsai kọntena dey kọntrol di nọmba of tray. Sẹt `maxNumAttempts` ọn di autsai kọntena instẹd.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Di { $attributes } attribute no go do enitin if symbolicEquality no dey sẹt.
       *[other] Di { $attributes } attribute no go do enitin if symbolicEquality no dey sẹt.
    }

answer-invalid-type = Di taip fọ di ansa no korẹkt: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sins di kọmponẹnt `<{ $component }>` no gẹt nem, yu no fit yuz am fọ module attribute

module-attribute-name-already-defined = Yu no fit yuz di kọmponẹnt `<{ $component } name="{ $name }">` as attribute fọ module bikọs `<module>` don gẹt "{ $name }" attribute.

conditional-content-condition-ignored = Wi dey ignọ di `condition` attribute ọn `<conditionalContent>` wey gẹt case ọ else pikin.

slider-markers-type-mismatch = Di markers taip no mach di slider taip.

pretzel-problem-needs-statement-and-answer = Di pretzel no korẹkt: ich `<problem>` must gẹt wan `<statement>` an wan `<answer>`.

pretzel-circuit-first-problem-distractor = Di pretzel no korẹkt: fọ mode="circuit", di fẹst `<problem>` no fit bi distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Di valyu { $values } no korẹkt fọ attribute `{ $attribute }`; wi dey ignọ am.
       *[other] Di valyu { $values } no korẹkt fọ attribute `{ $attribute }`; wi dey ignọ dem.
    }

attribute-must-be-references = Di valyu `{ $value }` no korẹkt fọ attribute `{ $attribute }`. Di attribute must bi rẹfrẹns wey stat wit `$`.

math-input-invalid-function-names = <mathInput>: wi dey ignọ fọnkshọn nem wey no korẹkt fọ { $attribute }: { $names }. Ich nem sho-pat must gẹt at list 2 karakta (lẹta ọ dash); `|<mathspeak alternative>` fit fọlo am.

## Building components from the source

component-type-invalid = Di kọmponẹnt taip no korẹkt: `<{ $componentType }>`

attribute-repeated = Yu no fit ripit di attribute { $attribute }.

attribute-invalid-for-component = Di attribute "{ $attribute }" no korẹkt fọ kọmponẹnt of taip `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stail dẹfinishọn { $styleNumber } no gẹt inọf kọntrast fọ { $context ->
        [text-on-background] di tẹks kọla agenst di bakgraun kọla
        [high-contrast] di hai-kọntrast kọla agenst di kanvas
        [line] di lain kọla agenst di kanvas
        [marker] di maka kọla agenst di kanvas
       *[text-on-canvas] di tẹks kọla agenst di kanvas
    }{ $mode ->
        [dark] { " (dak mod)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e nid at list { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Even dou stail dẹfinishọn { $styleNumber } gẹt kọla wey gẹt inọf kọntrast fọ lait mod, di dak-mod kọla wey kọm frọm dem no gẹt inọf kọntrast fọ di tẹks kọla agenst di bakgraun kọla ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e nid at list { $threshold }:1). { $suggestion ->
        [available] To gẹt inọf kọntrast fọ dak mod, eda yu inkris di lait-mod kọntrast (fọ ẹgzampul, sẹt { $lightAttribute }="{ $lightColor }") ọ yu ovarait di dak-mod kọla (fọ ẹgzampul, sẹt { $darkAttribute }="{ $darkColor }").
       *[none] To gẹt inọf kọntrast fọ dak mod, inkris di lait-mod kọntrast ọ ovarait di kọla wit textColorDarkMode an/ọ backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Even dou stail dẹfinishọn { $styleNumber } gẹt tẹks kọla wey gẹt inọf kọntrast fọ lait mod, di dak-mod tẹks kọla wey kọm frọm am no gẹt inọf kọntrast agenst di kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e nid at list { $threshold }:1). { $suggestion ->
        [available] To gẹt inọf kọntrast fọ dak mod, eda yu inkris di lait-mod kọntrast (fọ ẹgzampul, sẹt textColor="{ $lightColor }") ọ yu ovarait di dak-mod kọla (fọ ẹgzampul, sẹt textColorDarkMode="{ $darkColor }").
       *[none] To gẹt inọf kọntrast fọ dak mod, inkris di lait-mod kọntrast ọ ovarait di kọla wit textColorDarkMode.
    }

section-multiple-style-palettes = Wan sẹkshọn fit pik ọnli wan <stylePalette>; wi dey yuz di last wan.

## Unique variants

variant-num-to-select-not-non-negative-integer = wi no fit sabi di yunik vẹriant of { $component } bikọs numToSelect no bi hol nọmba wey no dey bilo ziro.

variant-num-to-select-not-constant-number = wi no fit sabi di yunik vẹriant of { $component } bikọs numToSelect no bi kọnstant nọmba.

variant-with-replacement-not-constant-boolean = wi no fit sabi di yunik vẹriant of { $component } bikọs withReplacement no bi kọnstant boolean.

variant-select-weight-disables-unique = Yunik vẹriant fọ select dey ọf if eni option gẹt selectWeight ọ selectForVariants

variant-coprime-undetermined = wi no fit sabi di yunik vẹriant of { $component } bikọs wi no fit sabi sey coprime ọlweiz bi fọls.

variant-attribute-not-constant = wi no fit sabi di yunik vẹriant of { $component } bikọs { $attribute } no bi kọnstant.

variant-attribute-not-number = wi no fit sabi di yunik vẹriant of { $component } bikọs { $attribute } no bi nọmba.

variant-attribute-wrong-type-for-sequence =
    wi no fit sabi di yunik vẹriant of { $component } of { $type } taip bikọs { $attribute } no bi { $expected ->
        [letters-combination] lẹta kọmbineshọn
        [math-expression] mat ẹkspreshọn wey korẹkt
        [integer] hol nọmba
       *[number] nọmba
    }.

variant-length-not-integer = wi no fit sabi di yunik vẹriant of { $component } bikọs length no bi hol nọmba.

variant-sort-not-implemented = wi neva impliment yunik vẹriant fọ { $component } wit sort

variant-exclude-combinations-not-implemented = wi neva impliment yunik vẹriant fọ { $component } wit excludeCombinations

variant-math-exclude-not-implemented = wi neva impliment yunik vẹriant fọ { $component } of taip math wit exclude

variant-non-constant-exclude-not-implemented = wi neva impliment yunik vẹriant fọ { $component } wit exclude wey no bi kọnstant

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: e no dey wọk fọ di graph prefigure rẹndara; wi don skip di dẹsẹndant.

prefigure-descendant-invalid-geometry = { $subject }: di jiọmẹtri no finit ọ e no kọmplit; wi don skip di dẹsẹndant.

prefigure-curve-label-omitted = { $subject }: lebul no dey wọk fọ curve ẹlimẹnt wey wi kọnvat; wi don lef di lebul.

prefigure-curve-unsupported-definition-type = { $subject }: di curve fọnkshọn dẹfinishọn taip '{ $definitionType }' no dey wọk; wi don skip di dẹsẹndant.

prefigure-region-flip-functions-unsupported = { $subject }: di flipFunctions attribute ọn regionBetweenCurves no dey wọk; wi don skip di dẹsẹndant.

prefigure-region-non-formula-child = { $subject }: na ọnli formula-taip pikin fọnkshọn dey wọk ọn regionBetweenCurves; wi don skip di dẹsẹndant.

prefigure-label-position-unsupported =
    { $subject }: di labelPosition '{ $labelPosition }' no dey wọk fọ { $labelKind ->
        [line-family] lain-famili lebul
       *[point] point lebul
    }; wi dey yuz di difọlt PreFigure alainmẹnt.

prefigure-fill-style-unsupported = { $subject }: PreFigure no sabi di fil stail '{ $fillStyle }'; wi dey fọlbak to solid fil.

prefigure-line-style-unknown = { $subject }: wi no sabi di lain stail '{ $lineStyle }', so wi lef am aut of di PreFigure autput.

prefigure-marker-style-mapped-to-diamond = { $subject }: wi don map di maka stail '{ $markerStyle }' to di PreFigure stail 'diamond'.

prefigure-marker-style-unsupported = { $subject }: PreFigure no sabi di maka stail '{ $markerStyle }'; wi dey yuz di difọlt stail.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: di `ref` no korẹkt; wi no fit si di target. Wi don lef di annotation.

annotation-ref-multiple-targets = `<annotation>`: di `ref` point to many target; wi dey yuz di fẹst wan.

annotation-ref-outside-graph = `<annotation>`: di `ref` no korẹkt; di target dey autsai di graph. Wi don lef di annotation.

annotation-ref-unsupported-target = `<annotation>`: di `ref` no korẹkt; di target no bi grafikal ọbjẹkt wey prefigure sabi. Wi don lef di annotation.

annotation-text-missing = `<annotation>`: di `text` no dey ọ e ẹmti; wi dey put ẹmti tẹks.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Wi si sakula dipẹndẹnsi.
       *[other] Wi si sakula dipẹndẹnsi wey invọlv `<{ $componentType }>` kọmponẹnt.
    }

reference-no-referent = Wi no si wetin dis rẹfrẹns dey point to: `{ $reference }`

reference-multiple-referents = Wi si many tin wey dis rẹfrẹns fit dey point to: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Di fọmat of di attribute { $attribute } of `<{ $componentType }>` no korẹkt.

children-invalid = Di pikin of `<{ $componentType }>` no korẹkt: Wi si pikin wey no korẹkt: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Di valyu `{ $value }` no korẹkt fọ attribute `{ $attribute }`, wi dey yuz `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Wi no si DoenetML vẹrshọn { $version }.
       *[other] Wi no si DoenetML vẹrshọn { $version }. Wi go fọlbak to vẹrshọn { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML no korẹkt: { $content }

parse-tag-missing-close-tag = DoenetML no korẹkt: Di tag `{ $tag }` no gẹt klosin tag. Wi ẹkspẹkt sẹlf-klosin tag ọ `</{ $tagName }>` tag.

parse-tag-error = DoenetML no korẹkt: Ẹra dey insai tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML no korẹkt: Di attribute `{ $attribute }` no korẹkt, e lai sey e no gẹt valyu.

parse-attribute-invalid = DoenetML no korẹkt: Di attribute `{ $attribute }` no korẹkt

parse-attribute-value-invalid = DoenetML no korẹkt: Di attribute valyu `{ $value }` no korẹkt

parse-attribute-value-quote-mismatch = DoenetML no korẹkt: Di attribute valyu `{ $value }` no korẹkt. Di kwot mak no mach. E lai sey `{ $quote }` no dey

parse-open-tag-name-missing = DoenetML no korẹkt: Wi si tag wey no gẹt nem, lai `<`

parse-tag-not-closed = DoenetML no korẹkt: Dem no klos di tag `{ $tag }` (e lai sey `>` no dey).

parse-self-closing-tag-name-missing = DoenetML no korẹkt: Wi si tag wey no gẹt nem `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML no korẹkt: Dem no klos di tag `{ $tag }` (e lai sey `/>` no dey).

parse-tag-invalid-attributes = DoenetML no korẹkt: Di tag `{ $tag }` no korẹkt. E fit gẹt attribute wey no korẹkt.

parse-close-tag-name-missing = DoenetML no korẹkt: Wi si klosin tag wey no gẹt nem, lai `</`

parse-attribute-value-unquoted = Attribute valyu must dey insai kwot: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML no korẹkt: Wi si klosin tag `{ $tag }`, bọt opinin tag no dey

parse-close-tag-mismatched = DoenetML no korẹkt: Di klosin tag no mach. Wi ẹkspẹkt `</{ $expected }>`. Wi si `{ $found }`

parser-node-unconvertible = Wi no fit kọnvat node { $node } to Dast node.

## Names

name-attribute-invalid =
    Di attribute name='{ $name }' no korẹkt. { $reason ->
        [characters] Nem fit gẹt ọnli lẹta, nọmba, ọndaskọ ọ haifẹn.
       *[start] Nem must stat wit lẹta.
    }

component-name-invalid-start = Di kọmponẹnt nem "{ $name }" no korẹkt. Nem must stat wit lẹta.

## `<answer>` sugar

answer-video-watched-missing-video = Answer wey gẹt type videoWatched must gẹt video attribute

answer-video-watched-video-not-reference = Answer wey gẹt type videoWatched must gẹt video attribute wey bi rẹfrẹns

answer-name-not-single-text = Di answer name attribute must gẹt wan text pikin

## Referencing another document

external-doenetml-recursion-limit = Wi no fit gẹt di ẹkstanal DoenetML bikọs rikọshọn plẹnti too mọch. Sakula rẹfrẹns dey?

external-doenetml-unavailable = Wi no fit gẹt DoenetML frọm { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Di DoenetML wey wi gẹt frọm { $attribute }="{ $uri }" no korẹkt: e no mach di kọmponẹnt taip "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Di attribute `{ $from }` don ol; yuz `{ $to }` instẹd.
       *[other] [deprecation] Di attribute `{ $from }` ọn `<{ $component }>` don ol; yuz `{ $to }` instẹd.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Di attribute `{ $from }` don ol an wi dey ignọ am bikọs `{ $to }` dey too.
       *[other] [deprecation] Di attribute `{ $from }` ọn `<{ $component }>` don ol an wi dey ignọ am bikọs `{ $to }` dey too.
    }

deprecated-attribute-ignored = [deprecation] Di attribute `{ $attribute }` ọn `<{ $component }>` don ol an wi dey ignọ am.

deprecated-attribute-to-child = [deprecation] Di attribute `{ $attribute }` ọn `<{ $component }>` don ol; yuz `<{ $child }>` pikin instẹd.

deprecated-attribute-value-renamed = [deprecation] Di valyu `{ $value }` of attribute `{ $attribute }` ọn `<{ $component }>` don ol; yuz `{ $to }` instẹd.


## Language coverage

pluralize-english-only = `<pluralize>` fit ọnli pluralaiz Inglish, so e lef di tẹks di way yu rait am fọ dọkyumẹnt wey dem rait fọ { $locale }. Rait di plural fọm dairẹkt, ọ sẹt am wit di `pluralForm` attribute.


## Checking against the schema

schema-element-unrecognized = Di ẹlimẹnt `<{ $tag }>` no bi Doenet ẹlimẹnt wey wi sabi.

schema-element-not-allowed-at-root = Dem no alaw di ẹlimẹnt `<{ $tag }>` fọ di rut of di dọkyumẹnt.

schema-element-not-allowed-inside = Dem no alaw di ẹlimẹnt `<{ $tag }>` insai `<{ $parent }>`.

schema-attribute-unrecognized = Di ẹlimẹnt `<{ $tag }>` no gẹt attribute wey dem kọl `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Di attribute `{ $attribute }` of ẹlimẹnt `<{ $tag }>` must bi list wey ich aitẹm insai am bi wan of dis: { $allowed }
       *[other] Di attribute `{ $attribute }` of ẹlimẹnt `<{ $tag }>` must bi wan of dis: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Di vẹriant nem fọ select no korẹkt.  Di vẹriant nem { $variantName } dey sho fọ { $numOptions } option bọt di nọmba wey wi go pik na { $numToSelect }.

select-variant-name-without-options = Yu don gi select sọm vẹriant bọt yu no gi eni option fọ di posibul vẹriant nem: { $variantName }.

select-variant-name-not-possible = Di vẹriant nem { $variantName } wey yu gi select no bi posibul vẹriant nem.

select-too-few-options = Wi no fit pik { $numToSelect } kọmponẹnt frọm ọnli { $numOptions }.

select-from-sequence-too-few-values = Wi no fit pik { $numToSelect } valyu frọm sequence wey lẹnt bi { $length }.

select-from-sequence-indices-count-mismatch = Di nọmba of indices wey yu gi select must mach di nọmba wey wi go pik

select-from-sequence-indices-not-integers = Ọl di indices wey yu gi select must bi hol nọmba

select-from-sequence-index-excluded = Yu gi selectfromsequence index wey dem don ẹksklud

select-from-sequence-indices-excluded-combination = Yu gi selectfromsequence indices wey bi kọmbineshọn wey dem don ẹksklud

select-from-sequence-coprime-not-positive-integers = Wi no fit pik coprime kọmbineshọn bikọs wi no dey pik positiv hol nọmba.

select-from-sequence-coprime-common-factor = Wi no fit pik coprime nọmba. Ọl di posibul valyu dey shea wan kọmọn faktọ. (Di valyu wey yu gi fọ "from" ọ "to" must bi coprime wit "step".)

select-from-sequence-coprime-single-number = Wi no fit pik coprime kọmbineshọn frọm sinjul nọmba wey no bi 1.

select-from-sequence-excluded-too-many-combinations = Dem don ẹksklud ova 70% of di kọmbineshọn insai selectFromSequence

select-from-sequence-coprime-none-found = Wi no fit pik coprime nọmba. Ọl di posibul valyu dey shea wan kọmọn faktọ.

select-from-sequence-too-few-unique-values = Wi no fit pik { $numToSelect } yunik valyu frọm sequence wey lẹnt bi { $numPossibleValues }

select-prime-numbers-too-few-values = Wi no fit pik { $numToSelect } valyu frọm praim list wey lẹnt bi { $numValues }

select-prime-numbers-values-count-mismatch = Di nọmba of valyu wey yu gi select must mach di nọmba wey wi go pik

select-prime-numbers-values-not-prime = Ọl di valyu wey yu gi select prime number must dey insai di praim list

select-prime-numbers-values-excluded-combination = Di valyu wey yu gi selectPrimeNumbers bi kọmbineshọn wey dem don ẹksklud

select-prime-numbers-excluded-too-many-combinations = Dem don ẹksklud ova 70% of di kọmbineshọn insai selectPrimeNumbers

select-random-combination-fluke = Na wanda wey no supoz hapun: wi no fit pik kọmbineshọn of randọm valyu

select-random-value-fluke = Na wanda wey no supoz hapun: wi no fit pik randọm valyu
