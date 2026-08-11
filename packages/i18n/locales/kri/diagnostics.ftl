# Krio diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and attribute values — `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `math`, `text` and the rest —
# are part of the language rather than prose, and stay in English exactly as
# written.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] wi de ignɔ { $attributes } we yu dɔn gi tu ɛndpɔynt
       *[other] wi de ignɔ { $attributes } we yu dɔn gi tu ɛndpɔynt
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] wi de ignɔ { $attributes } we yu gi ɛndpɔynt ɛn midpɔynt togɛda
       *[other] wi de ignɔ { $attributes } we yu gi ɛndpɔynt ɛn midpɔynt togɛda
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nɔ de du natin if midpɔynt nɔ de

## `<line>`

line-points-undetermined-dimensions = Layn we pas pɔynt dɛn we wi nɔ no dɛn daymɛnshɔn.

line-points-too-few-dimensions = Layn fɔ pas pɔynt dɛn we gɛt at lis tu daymɛnshɔn.

line-points-depend-on-variables = Layn de pas pɔynt dɛn we dipɛn pan vɛriabul dɛn: { $variables }.

line-equation-invalid-format = Di fɔmat fɔ di layn ikweshɔn nɔ kɔrɛkt fɔ vɛriabul { $variable1 } ɛn { $variable2 }.

## `<ray>`

ray-overprescribed-through = Yu dɔn gi di re through, endpoint ɛn direction.  Wi de ignɔ di through we yu gi.

ray-dimension-mismatch = numDimensions nɔ mach fɔ di re.

## `<vector>`

vector-overprescribed-head = Yu dɔn gi di vɛkta head, tail ɛn displacement.  Wi de ignɔ di head we yu gi.

vector-dimension-mismatch = numDimensions nɔ mach fɔ di vɛkta.

## Attracting and constraining

attract-to-without-nearest-point = Wi nɔ ebul fɔ atrakt to `<{ $component }>` bikɔs i nɔ gɛt nearestPoint.

constrain-to-without-nearest-point = Wi nɔ ebul fɔ kɔnstren to `<{ $component }>` bikɔs i nɔ gɛt nearestPoint.

constrain-to-interior-without-nearest-point = Wi nɔ ebul fɔ kɔnstren to di insay pan `<{ $component }>` bikɔs i nɔ gɛt nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = wi de ignɔ labelPosition fɔ choiceInput we nɔ to inline

## Ordering children by index

choice-input-indices-count-mismatch = Wi de ignɔ di indices we yu gi choiceInput bikɔs di nɔmba pan indices nɔ mach di nɔmba pan choice pikin.

pretzel-indices-count-mismatch = Wi de ignɔ di indices we yu gi problem bikɔs di nɔmba pan indices nɔ mach di nɔmba pan problem pikin.

shuffle-indices-count-mismatch = Wi de ignɔ di indices we yu gi shuffle bikɔs di nɔmba pan indices nɔ mach di nɔmba pan kɔmponɛnt.

indices-ignored-out-of-range = Wi de ignɔ di indices we yu gi { $component } bikɔs sɔm pan dɛn de ɔt pan renj.

pretzel-indices-repeated = Wi de ignɔ di indices we yu gi pretzel bikɔs sɔm pan dɛn ripit.

pretzel-circuit-first-index = Wi de ignɔ di indices we yu gi pretzel na mode="circuit" bikɔs di fɔs index fɔ bi 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Fɔ mek `<{ $component }>` wok wit string pikin, yu fɔ gi am `type` attribute.

invalid-type-defaulting-to-math = Type { $type } nɔ kɔrɛkt fɔ { $component } kɔmponɛnt. I fɔ bi math, text, number ɔ boolean. Wi go yuz math.

string-not-valid-component-to-arrange = String "{ $value }" nɔ to valid kɔmponɛnt fɔ { $component }. Wi de ignɔ am.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } nɔ kɔrɛkt, wi dɔn sɛt di type to number.

invalid-variable-value = Vɛriabul valyu we nɔ kɔrɛkt: `{ $value }`

## Variants

variant-index-must-be-number = Vɛriant index { $index } fɔ bi nɔmba

variant-index-must-be-integer = Vɛriant index { $index } fɔ bi ɔl nɔmba

## `<sideBySide>`

side-by-side-absolute-widths = Wi nɔ implimɛnt `<{ $component }>` yet fɔ absolut mɛzhɔmɛnt. Wi dɔn sɛt di wit to rɛlativ.

side-by-side-absolute-margins = Wi nɔ implimɛnt `<{ $component }>` yet fɔ absolut mɛzhɔmɛnt. Wi dɔn sɛt di majin to rɛlativ.

side-by-side-no-block-child = `<{ $component }>` nɔ kɔrɛkt: i fɔ gɛt at lis wan block pikin.

## `<label>`

label-for-ignored-on-graphical = Wi de ignɔ di `for` attribute pan grafikal `<label>`.

label-for-must-resolve-to-one = Di `for` attribute pan `<label>` fɔ pɔynt to ɛgzaktli wan kɔmponɛnt.

label-for-unresolved = Di `for` attribute pan `<label>` nɔ ebul fɔ pɔynt to ɛni kɔmponɛnt.

label-for-answer-with-authored-inputs = Di `for` attribute pan `<label>` de pɔynt to `<answer>` we gɛt input dɛn we di ɔda pɔsin rayt; pɔynt to di input daytrɛkt.

label-for-answer-without-input = Di `for` attribute pan `<label>` de pɔynt to `<answer>` we nɔ gɛt input fɔ lebul.

label-for-must-reference-input-or-answer = Di `for` attribute pan `<label>` fɔ pɔynt to input ɔ answer.

## Accessibility

accessibility-short-description-or-decorative = Fɔ aksɛsibiliti, `<{ $component }>` fɔ gɛt shɔt dɛskripshɔn ɔ yu fɔ mak am lɛk decorative.

accessibility-video-short-description = Fɔ aksɛsibiliti, `<video>` fɔ gɛt shɔt dɛskripshɔn.

accessibility-input-short-description-or-label = Fɔ aksɛsibiliti, `<{ $component }>` fɔ gɛt shɔt dɛskripshɔn ɔ lebul.

accessibility-answer-input-short-description-or-label = Fɔ aksɛsibiliti, `<answer>` we de mek input fɔ gɛt shɔt dɛskripshɔn ɔ lebul.

accessibility-short-description-contains-math = Shɔt dɛskripshɔn nɔ fɔ gɛt mat kɔmponɛnt lɛk `<{ $component }>`. Rayt di mat wit wɔd.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } nɔ gɛt inɔf kɔntras fɔ di sɛkshɔn edin tɛks (dak mod) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i nid at lis { $threshold }:1).
       *[other] { $colorName } nɔ gɛt inɔf kɔntras fɔ di sɛkshɔn edin tɛks ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i nid at lis { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Wi nɔ implimɛnt `<circle>` yet we de pas { $count } pɔynt we di pɔynt dɛn nɔ gɛt nɔmba valyu.

circle-too-many-through-points = Wi nɔ ebul fɔ kalkulet raun we de pas mɔ dan 3 pɔynt.

circle-overprescribed-radius-center-points = Wi nɔ ebul fɔ kalkulet raun we yu gi radius, sɛnta ɛn pɔynt dɛn togɛda.

circle-center-with-multiple-points = Wi nɔ ebul fɔ kalkulet raun wit sɛnta we de pas mɔ dan 1 pɔynt.

circle-radius-too-small = Wi nɔ ebul fɔ kalkulet di raun: sins di distans bitwin di tu pɔynt na { $distance }, di radius { $radius } we yu gi tumɔs smɔl.

circle-radius-with-many-points = Wi nɔ ebul fɔ mek raun we de pas mɔ dan tu pɔynt wit radius we yu gi.

circle-invalid-center-or-through-points = Di sɛnta ɔ di pɔynt dɛn pan di raun nɔ kɔrɛkt.

circle-radius-center-with-multiple-points = Wi nɔ ebul fɔ kalkulet di radius pan raun wit sɛnta we de pas mɔ dan 1 pɔynt.

circle-change-radius-non-numerical = Wi nɔ ebul fɔ chenj di radius pan raun we di pɔynt dɛn nɔ gɛt nɔmba valyu

circle-radius-with-points-non-numerical = Wi nɔ ebul fɔ mek raun we de pas mɔ dan wan pɔynt wit radius we nɔmba valyu nɔ de.

circle-change-center-non-numerical = Wi nɔ implimɛnt yet aw fɔ chenj di sɛnta pan raun we de pas pɔynt dɛn we nɔ gɛt nɔmba valyu.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Di daymɛnshɔn nɔ inɔf fɔ di domain pan di fɔnkshɔn. Di domain gɛt { $intervals } intaval bɔt di fɔnkshɔn gɛt { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } input
        }.
       *[other] Di daymɛnshɔn nɔ inɔf fɔ di domain pan di fɔnkshɔn. Di domain gɛt { $intervals } intaval bɔt di fɔnkshɔn gɛt { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } input
        }.
    }

function-domain-invalid-format = Di fɔmat pan di domain pan di fɔnkshɔn nɔ kɔrɛkt.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Wi de ignɔ di maksimɔm pan di fɔnkshɔn we nɔ to nɔmba.
        [minimum] Wi de ignɔ di minimɔm pan di fɔnkshɔn we nɔ to nɔmba.
        [extremum] Wi de ignɔ di ɛkstrimɔm pan di fɔnkshɔn we nɔ to nɔmba.
        [point] Wi de ignɔ di pɔynt pan di fɔnkshɔn we nɔ to nɔmba.
        [slope] Wi de ignɔ di slop pan di fɔnkshɔn we nɔ to nɔmba.
       *[other] Wi de ignɔ di { $type } pan di fɔnkshɔn we nɔ to nɔmba.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Wi de ignɔ di ɛmti maksimɔm pan di fɔnkshɔn.
        [minimum] Wi de ignɔ di ɛmti minimɔm pan di fɔnkshɔn.
        [extremum] Wi de ignɔ di ɛmti ɛkstrimɔm pan di fɔnkshɔn.
        [point] Wi de ignɔ di ɛmti pɔynt pan di fɔnkshɔn.
       *[other] Wi de ignɔ di ɛmti { $type } pan di fɔnkshɔn.
    }

function-points-too-close = Di fɔnkshɔn gɛt tu pɔynt we tumɔs nia dɛnsɛf. Wi nɔ ebul fɔ difayn di fɔnkshɔn.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Fɔnkshɔn itaret kin apin ɔnli if di nɔmba pan input mach di nɔmba pan output. Dis fɔnkshɔn gɛt { $inputs } input ɛn { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } output
        }.
       *[other] Fɔnkshɔn itaret kin apin ɔnli if di nɔmba pan input mach di nɔmba pan output. Dis fɔnkshɔn gɛt { $inputs } input ɛn { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } output
        }.
    }

## `<sequence>`

sequence-invalid-length = Di lɛnt pan di sequence nɔ kɔrɛkt.  I fɔ bi ɔl nɔmba we nɔ de bilo ziro.

sequence-invalid-step = Di step pan di sequence nɔ kɔrɛkt.  I fɔ bi nɔmba fɔ sequence pan type { $type }.

sequence-invalid-endpoint-number = Di "{ $attribute }" pan di number sequence nɔ kɔrɛkt.  I fɔ bi nɔmba.

sequence-invalid-endpoint-letters = Di "{ $attribute }" pan di letters sequence nɔ kɔrɛkt.  I fɔ bi lɛta kɔmbineshɔn.

sequence-invalid-endpoint = Di "{ $attribute }" pan di sequence nɔ kɔrɛkt.

select-from-sequence-coprime-not-numbers = wi de ignɔ coprime bikɔs wi nɔ de pik nɔmba

select-from-sequence-coprime-with-exclude-combinations = wi de ignɔ coprime bikɔs yu dɔn gi excludeCombinations

## Resolving a `target`

target-not-found = Di target fɔ `<{ $source }>` nɔ kɔrɛkt: wi nɔ ebul fɔ si di target.

target-state-variable-not-found = Di target fɔ `<{ $source }>` nɔ kɔrɛkt: wi nɔ ebul fɔ si stet vɛriabul we nem na "{ $property }" pan `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Di vɛriabul dɛn pan `<odeSystem>` fɔ difrɛn frɔm di indipɛndɛnt vɛriabul.

ode-system-duplicate-variable-names = Wi nɔ ebul fɔ difayn ODE RHS fɔnkshɔn wit dipɛndɛnt vɛriabul nem we ripit.

ode-system-rhs-function-error = Wi nɔ ebul fɔ difayn ODE RHS fɔnkshɔn.  Ɛra de we wi de mek di mathjs fɔnkshɔn.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Wi nɔ ebul fɔ difayn angul bitwin { $count } layn

angle-invalid-through-point = Di pɔynt na di through pan `<angle>` nɔ kɔrɛkt

parabola-vertex-too-many-points = Wi nɔ implimɛnt parabola yet wit vertex we de pas mɔ dan 1 pɔynt.

parabola-too-many-points = Wi nɔ implimɛnt parabola yet we de pas mɔ dan 3 pɔynt.

intersection-too-many-items = Wi nɔ implimɛnt intasɛkshɔn yet fɔ mɔ dan tu tin

## Other math components

ionic-compound-not-two-ions = Wi nɔ implimɛnt ayɔnik kɔmpaun yet fɔ ɛnitin ɔda dan tu ayɔn.

ionic-compound-needs-cation-and-anion = Wi implimɛnt ayɔnik kɔmpaun ɔnli fɔ wan katayɔn ɛn wan anayɔn.

solve-equations-cannot-evaluate = Wi nɔ ebul fɔ sɔlv di ikweshɔn bikɔs wi nɔ ebul fɔ ivaluet am: { $equation }

math-operators-operand-number-required = Yu fɔ gi operandNumber we yu de ɛkstrakt mat operand.

eigen-decomposition-failed = Wi nɔ ebul fɔ kalkulet di aygɛnvalyu pan di matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: di parameter { $parameters } nɔ de insay di patan, so i go ɔlwez mach blank.
       *[other] `<matchesPattern>`: di parameter { $parameters } nɔ de insay di patan, so dɛn go ɔlwez mach blank.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: wi nɔ ebul fɔ ɔndastand grid="{ $grid }". I fɔ bi none, medium, dense, ɔ tu pɔzitiv nɔmba we spes divayd dɛn, lɛk grid="1 0.5". Wi nɔ go draw ɛni grid.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" nɔ de wok fɔ di prefigure rɛndara; wi de yuz di rayt-say bihevia.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" nɔ de wok fɔ di prefigure rɛndara; wi de yuz di tɔp bihevia.

prefigure-invalid-axis-bounds = `<graph>`: di aksis baun nɔ kɔrɛkt fɔ prefigure; wi de yuz di difɔlt bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: di wit nɔ kɔrɛkt fɔ prefigure; wi de yuz di difɔlt dayagram wit 425.

prefigure-invalid-aspect-ratio = `<graph>`: di aspectRatio nɔ kɔrɛkt fɔ prefigure; wi de yuz di difɔlt aspɛkt reshio 1.

prefigure-grid-spacing-too-fine = `<graph>`: di grid spesin tumɔs fayn fɔ di aksis limit; wi nɔ go put di grid na di prefigure rɛndara.

prefigure-annotations-not-rendered = `<graph>`: annotations nɔ go sho if yu nɔ de yuz di PreFigure rɛndara.

multiple-annotations-children = Wi si bɔku `<annotations>` pikin insay `<graph>`; wi de ignɔ ɔl bɔt di las wan.

## Referring to other components

copy-unrecognized-component-type = Wi nɔ ebul fɔ ɛkstɛnd ɔ kɔpi kɔmponɛnt tayp we wi nɔ no: { $type }.

copy-prop-not-found = Wi nɔ ebul fɔ si prop { $property } pan kɔmponɛnt pan tayp { $component }

collect-no-source = Wi nɔ si sɔs fɔ collect.

collect-invalid-component-type = Wi nɔ ebul fɔ kɔlɛkt kɔmponɛnt pan tayp `<{ $component }>` bikɔs di tayp nɔ kɔrɛkt.

reference-index-unavailable = Wi nɔ ebul fɔ rɛfarɛns index `{ $reference }`

## `<callAction>`

component-action-unavailable = Wi nɔ ebul fɔ kɔl { $action } pan kɔmponɛnt `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Di data shep nɔ kɔrɛkt.  Di ro dɛn gɛt difrɛn lɛnt. Wi si am na componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Di data gɛt kɔlum nem we ripit.  Wi si am na componentIdx :{ $componentIdx }

data-frame-missing-column-name = Wan kɔlum nem nɔ de na di data.  Wi si am na componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Wan award fɔ dis ansa de bes pan di answer tag in on ansa we dɛn sɛn, ɛn dat go kɔz trɔbul we yu nɔ ɛkspɛkt.

answer-max-num-attempts-in-section-wide-check-work = If yu sɛt `maxNumAttempts` pan `<answer>` we de insay kɔntena we gɛt `sectionWideCheckWork`, i nɔ go du natin, bikɔs na di kɔntena de kɔntrol di nɔmba pan tray. Sɛt `maxNumAttempts` pan di kɔntena instɛd.

nested-section-wide-check-work-max-num-attempts = If yu sɛt `maxNumAttempts` pan kɔntena we gɛt `sectionWideCheckWork` ɛn we de insay ɔda kɔntena we gɛt `sectionWideCheckWork`, i nɔ go du natin, bikɔs na di ɔtsay kɔntena de kɔntrol di nɔmba pan tray. Sɛt `maxNumAttempts` pan di ɔtsay kɔntena instɛd.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Di { $attributes } attribute nɔ go du natin if symbolicEquality nɔ de sɛt.
       *[other] Di { $attributes } attribute nɔ go du natin if symbolicEquality nɔ de sɛt.
    }

answer-invalid-type = Di tayp fɔ di ansa nɔ kɔrɛkt: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sins di kɔmponɛnt `<{ $component }>` nɔ gɛt nem, yu nɔ ebul fɔ yuz am fɔ module attribute

module-attribute-name-already-defined = Yu nɔ ebul fɔ yuz di kɔmponɛnt `<{ $component } name="{ $name }">` lɛk attribute fɔ module bikɔs `<module>` dɔn gɛt "{ $name }" attribute.

conditional-content-condition-ignored = Wi de ignɔ di `condition` attribute pan `<conditionalContent>` we gɛt case ɔ else pikin.

slider-markers-type-mismatch = Di markers tayp nɔ mach di slider tayp.

pretzel-problem-needs-statement-and-answer = Di pretzel nɔ kɔrɛkt: ɛvri `<problem>` fɔ gɛt wan `<statement>` ɛn wan `<answer>`.

pretzel-circuit-first-problem-distractor = Di pretzel nɔ kɔrɛkt: na mode="circuit", di fɔs `<problem>` nɔ ebul fɔ bi distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Di valyu { $values } nɔ kɔrɛkt fɔ attribute `{ $attribute }`; wi de ignɔ am.
       *[other] Di valyu { $values } nɔ kɔrɛkt fɔ attribute `{ $attribute }`; wi de ignɔ dɛn.
    }

attribute-must-be-references = Di valyu `{ $value }` nɔ kɔrɛkt fɔ attribute `{ $attribute }`. Di attribute fɔ bi rɛfrɛns we stat wit `$`.

math-input-invalid-function-names = <mathInput>: wi de ignɔ fɔnkshɔn nem we nɔ kɔrɛkt na { $attribute }: { $names }. Ɛvri nem in sho-pat fɔ gɛt at lis 2 karakta (lɛta ɔ dash); `|<mathspeak alternative>` kin fala am.

## Building components from the source

component-type-invalid = Di kɔmponɛnt tayp nɔ kɔrɛkt: `<{ $componentType }>`

attribute-repeated = Yu nɔ ebul fɔ ripit di attribute { $attribute }.

attribute-invalid-for-component = Di attribute "{ $attribute }" nɔ kɔrɛkt fɔ kɔmponɛnt pan tayp `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stayl dɛfinishɔn { $styleNumber } nɔ gɛt inɔf kɔntras fɔ { $context ->
        [text-on-background] di tɛks kɔla agens di bakgrɔn kɔla
        [high-contrast] di ay-kɔntras kɔla agens di kanvas
        [line] di layn kɔla agens di kanvas
        [marker] di maka kɔla agens di kanvas
       *[text-on-canvas] di tɛks kɔla agens di kanvas
    }{ $mode ->
        [dark] { " (dak mod)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i nid at lis { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ivin dɔ stayl dɛfinishɔn { $styleNumber } gɛt kɔla dɛn we gɛt inɔf kɔntras fɔ layt mod, di dak-mod kɔla dɛn we kɔmɔt frɔm dɛn nɔ gɛt inɔf kɔntras fɔ di tɛks kɔla agens di bakgrɔn kɔla ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i nid at lis { $threshold }:1). { $suggestion ->
        [available] Fɔ gɛt inɔf kɔntras na dak mod, ɛda yu inkris di layt-mod kɔntras (fɔ ɛgzampul, sɛt { $lightAttribute }="{ $lightColor }") ɔ yu ovarayt di dak-mod kɔla (fɔ ɛgzampul, sɛt { $darkAttribute }="{ $darkColor }").
       *[none] Fɔ gɛt inɔf kɔntras na dak mod, inkris di layt-mod kɔntras ɔ ovarayt di kɔla dɛn wit textColorDarkMode ɛn/ɔ backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ivin dɔ stayl dɛfinishɔn { $styleNumber } gɛt tɛks kɔla we gɛt inɔf kɔntras fɔ layt mod, di dak-mod tɛks kɔla we kɔmɔt frɔm am nɔ gɛt inɔf kɔntras agens di kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i nid at lis { $threshold }:1). { $suggestion ->
        [available] Fɔ gɛt inɔf kɔntras na dak mod, ɛda yu inkris di layt-mod kɔntras (fɔ ɛgzampul, sɛt textColor="{ $lightColor }") ɔ yu ovarayt di dak-mod kɔla (fɔ ɛgzampul, sɛt textColorDarkMode="{ $darkColor }").
       *[none] Fɔ gɛt inɔf kɔntras na dak mod, inkris di layt-mod kɔntras ɔ ovarayt di kɔla wit textColorDarkMode.
    }

section-multiple-style-palettes = Wan sɛkshɔn kin pik ɔnli wan <stylePalette>; wi de yuz di las wan.

## Unique variants

variant-num-to-select-not-non-negative-integer = wi nɔ ebul fɔ no di yunik vɛriant pan { $component } bikɔs numToSelect nɔ to ɔl nɔmba we nɔ de bilo ziro.

variant-num-to-select-not-constant-number = wi nɔ ebul fɔ no di yunik vɛriant pan { $component } bikɔs numToSelect nɔ to kɔnstant nɔmba.

variant-with-replacement-not-constant-boolean = wi nɔ ebul fɔ no di yunik vɛriant pan { $component } bikɔs withReplacement nɔ to kɔnstant boolean.

variant-select-weight-disables-unique = Yunik vɛriant fɔ select de ɔf if ɛni option gɛt selectWeight ɔ selectForVariants

variant-coprime-undetermined = wi nɔ ebul fɔ no di yunik vɛriant pan { $component } bikɔs wi nɔ ebul fɔ no se coprime ɔlwez na fɔls.

variant-attribute-not-constant = wi nɔ ebul fɔ no di yunik vɛriant pan { $component } bikɔs { $attribute } nɔ to kɔnstant.

variant-attribute-not-number = wi nɔ ebul fɔ no di yunik vɛriant pan { $component } bikɔs { $attribute } nɔ to nɔmba.

variant-attribute-wrong-type-for-sequence =
    wi nɔ ebul fɔ no di yunik vɛriant pan { $component } pan { $type } tayp bikɔs { $attribute } nɔ to { $expected ->
        [letters-combination] lɛta kɔmbineshɔn
        [math-expression] valid mat ɛkspreshɔn
        [integer] ɔl nɔmba
       *[number] nɔmba
    }.

variant-length-not-integer = wi nɔ ebul fɔ no di yunik vɛriant pan { $component } bikɔs length nɔ to ɔl nɔmba.

variant-sort-not-implemented = wi nɔ implimɛnt yet di yunik vɛriant fɔ { $component } wit sort

variant-exclude-combinations-not-implemented = wi nɔ implimɛnt yet di yunik vɛriant fɔ { $component } wit excludeCombinations

variant-math-exclude-not-implemented = wi nɔ implimɛnt yet di yunik vɛriant fɔ { $component } pan tayp math wit exclude

variant-non-constant-exclude-not-implemented = wi nɔ implimɛnt yet di yunik vɛriant fɔ { $component } wit exclude we nɔ to kɔnstant

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: i nɔ de wok fɔ di graph prefigure rɛndara; wi dɔn skip di dɛsɛndant.

prefigure-descendant-invalid-geometry = { $subject }: di jiɔmɛtri nɔ finit ɔ i nɔ kɔmplit; wi dɔn skip di dɛsɛndant.

prefigure-curve-label-omitted = { $subject }: lebul nɔ de wok fɔ curve ɛlimɛnt we wi kɔnvat; wi dɔn lɛf di lebul.

prefigure-curve-unsupported-definition-type = { $subject }: di curve fɔnkshɔn dɛfinishɔn tayp '{ $definitionType }' nɔ de wok; wi dɔn skip di dɛsɛndant.

prefigure-region-flip-functions-unsupported = { $subject }: di flipFunctions attribute pan regionBetweenCurves nɔ de wok; wi dɔn skip di dɛsɛndant.

prefigure-region-non-formula-child = { $subject }: na ɔnli formula-tayp pikin fɔnkshɔn de wok pan regionBetweenCurves; wi dɔn skip di dɛsɛndant.

prefigure-label-position-unsupported =
    { $subject }: di labelPosition '{ $labelPosition }' nɔ de wok fɔ { $labelKind ->
        [line-family] layn-famili lebul
       *[point] pɔynt lebul
    }; wi de yuz di difɔlt PreFigure alaynmɛnt.

prefigure-fill-style-unsupported = { $subject }: PreFigure nɔ no di fil stayl '{ $fillStyle }'; wi de fɔlbak to solid fil.

prefigure-line-style-unknown = { $subject }: wi nɔ no di layn stayl '{ $lineStyle }', so wi lɛf am ɔt pan di PreFigure ɔtput.

prefigure-marker-style-mapped-to-diamond = { $subject }: wi dɔn map di maka stayl '{ $markerStyle }' to di PreFigure stayl 'diamond'.

prefigure-marker-style-unsupported = { $subject }: PreFigure nɔ no di maka stayl '{ $markerStyle }'; wi de yuz di difɔlt stayl.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: di `ref` nɔ kɔrɛkt; wi nɔ ebul fɔ si di target. Wi dɔn lɛf di annotation.

annotation-ref-multiple-targets = `<annotation>`: di `ref` pɔynt to bɔku target; wi de yuz di fɔs wan.

annotation-ref-outside-graph = `<annotation>`: di `ref` nɔ kɔrɛkt; di target de ɔtsay di graph. Wi dɔn lɛf di annotation.

annotation-ref-unsupported-target = `<annotation>`: di `ref` nɔ kɔrɛkt; di target nɔ to grafikal ɔbjɛkt we prefigure no. Wi dɔn lɛf di annotation.

annotation-text-missing = `<annotation>`: di `text` nɔ de ɔ i ɛmti; wi de put ɛmti tɛks.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Wi si sakula dipɛndɛnsi.
       *[other] Wi si sakula dipɛndɛnsi we invɔlv `<{ $componentType }>` kɔmponɛnt.
    }

reference-no-referent = Wi nɔ si wetin dis rɛfrɛns de pɔynt to: `{ $reference }`

reference-multiple-referents = Wi si bɔku tin we dis rɛfrɛns kin de pɔynt to: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Di fɔmat pan di attribute { $attribute } pan `<{ $componentType }>` nɔ kɔrɛkt.

children-invalid = Di pikin dɛn pan `<{ $componentType }>` nɔ kɔrɛkt: Wi si pikin we nɔ kɔrɛkt: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Di valyu `{ $value }` nɔ kɔrɛkt fɔ attribute `{ $attribute }`, wi de yuz `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Wi nɔ si DoenetML vɛrshɔn { $version }.
       *[other] Wi nɔ si DoenetML vɛrshɔn { $version }. Wi go fɔlbak to vɛrshɔn { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML nɔ kɔrɛkt: { $content }

parse-tag-missing-close-tag = DoenetML nɔ kɔrɛkt: Di tag `{ $tag }` nɔ gɛt klosin tag. Wi ɛkspɛkt sɛlf-klosin tag ɔ `</{ $tagName }>` tag.

parse-tag-error = DoenetML nɔ kɔrɛkt: Ɛra de insay tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML nɔ kɔrɛkt: Di attribute `{ $attribute }` nɔ kɔrɛkt, i tan lɛk se i nɔ gɛt valyu.

parse-attribute-invalid = DoenetML nɔ kɔrɛkt: Di attribute `{ $attribute }` nɔ kɔrɛkt

parse-attribute-value-invalid = DoenetML nɔ kɔrɛkt: Di attribute valyu `{ $value }` nɔ kɔrɛkt

parse-attribute-value-quote-mismatch = DoenetML nɔ kɔrɛkt: Di attribute valyu `{ $value }` nɔ kɔrɛkt. Di kwot mak nɔ mach. I tan lɛk se `{ $quote }` nɔ de

parse-open-tag-name-missing = DoenetML nɔ kɔrɛkt: Wi si tag we nɔ gɛt nem, lɛk `<`

parse-tag-not-closed = DoenetML nɔ kɔrɛkt: Dɛn nɔ klos di tag `{ $tag }` (i tan lɛk se `>` nɔ de).

parse-self-closing-tag-name-missing = DoenetML nɔ kɔrɛkt: Wi si tag we nɔ gɛt nem `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML nɔ kɔrɛkt: Dɛn nɔ klos di tag `{ $tag }` (i tan lɛk se `/>` nɔ de).

parse-tag-invalid-attributes = DoenetML nɔ kɔrɛkt: Di tag `{ $tag }` nɔ valid. I kin gɛt attribute we nɔ kɔrɛkt.

parse-close-tag-name-missing = DoenetML nɔ kɔrɛkt: Wi si klosin tag we nɔ gɛt nem, lɛk `</`

parse-attribute-value-unquoted = Attribute valyu fɔ de insay kwot: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML nɔ kɔrɛkt: Wi si klosin tag `{ $tag }`, bɔt opinin tag nɔ de

parse-close-tag-mismatched = DoenetML nɔ kɔrɛkt: Di klosin tag nɔ mach. Wi ɛkspɛkt `</{ $expected }>`. Wi si `{ $found }`

parser-node-unconvertible = Wi nɔ ebul fɔ kɔnvat node { $node } to Dast node.

## Names

name-attribute-invalid =
    Di attribute name='{ $name }' nɔ kɔrɛkt. { $reason ->
        [characters] Nem kin gɛt ɔnli lɛta, nɔmba, ɔndaskɔ ɔ ayfɛn.
       *[start] Nem fɔ stat wit lɛta.
    }

component-name-invalid-start = Di kɔmponɛnt nem "{ $name }" nɔ kɔrɛkt. Nem fɔ stat wit lɛta.

## `<answer>` sugar

answer-video-watched-missing-video = Answer we gɛt type videoWatched fɔ gɛt video attribute

answer-video-watched-video-not-reference = Answer we gɛt type videoWatched fɔ gɛt video attribute we na rɛfrɛns

answer-name-not-single-text = Di answer name attribute fɔ gɛt wan text pikin

## Referencing another document

external-doenetml-recursion-limit = Wi nɔ ebul fɔ gɛt di ɛkstanal DoenetML bikɔs rikɔshɔn tumɔs. Sakula rɛfrɛns de?

external-doenetml-unavailable = Wi nɔ ebul fɔ gɛt DoenetML frɔm { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Di DoenetML we wi gɛt frɔm { $attribute }="{ $uri }" nɔ kɔrɛkt: i nɔ mach di kɔmponɛnt tayp "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Di attribute `{ $from }` dɔn ol; yuz `{ $to }` instɛd.
       *[other] [deprecation] Di attribute `{ $from }` pan `<{ $component }>` dɔn ol; yuz `{ $to }` instɛd.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Di attribute `{ $from }` dɔn ol ɛn wi de ignɔ am bikɔs `{ $to }` de bak.
       *[other] [deprecation] Di attribute `{ $from }` pan `<{ $component }>` dɔn ol ɛn wi de ignɔ am bikɔs `{ $to }` de bak.
    }

deprecated-attribute-ignored = [deprecation] Di attribute `{ $attribute }` pan `<{ $component }>` dɔn ol ɛn wi de ignɔ am.

deprecated-attribute-to-child = [deprecation] Di attribute `{ $attribute }` pan `<{ $component }>` dɔn ol; yuz `<{ $child }>` pikin instɛd.

deprecated-attribute-value-renamed = [deprecation] Di valyu `{ $value }` pan attribute `{ $attribute }` pan `<{ $component }>` dɔn ol; yuz `{ $to }` instɛd.


## Language coverage

pluralize-english-only = `<pluralize>` kin ɔnli pluralayz Inglish, so i lɛf di tɛks di we yu rayt am na dɔkyumɛnt we dɛn rayt na { $locale }. Rayt di plural fɔm daytrɛkt, ɔ sɛt am wit di `pluralForm` attribute.


## Checking against the schema

schema-element-unrecognized = Di ɛlimɛnt `<{ $tag }>` nɔ to Doenet ɛlimɛnt we wi no.

schema-element-not-allowed-at-root = Dɛn nɔ alaw di ɛlimɛnt `<{ $tag }>` na di rut pan di dɔkyumɛnt.

schema-element-not-allowed-inside = Dɛn nɔ alaw di ɛlimɛnt `<{ $tag }>` insay `<{ $parent }>`.

schema-attribute-unrecognized = Di ɛlimɛnt `<{ $tag }>` nɔ gɛt attribute we dɛn kɔl `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Di attribute `{ $attribute }` pan ɛlimɛnt `<{ $tag }>` fɔ bi lis we ɛvri aytɛm insay am na wan pan dɛn ya: { $allowed }
       *[other] Di attribute `{ $attribute }` pan ɛlimɛnt `<{ $tag }>` fɔ bi wan pan dɛn ya: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Di vɛriant nem fɔ select nɔ kɔrɛkt.  Di vɛriant nem { $variantName } de sho na { $numOptions } option bɔt di nɔmba we wi go pik na { $numToSelect }.

select-variant-name-without-options = Yu dɔn gi select sɔm vɛriant bɔt yu nɔ gi ɛni option fɔ di posibul vɛriant nem: { $variantName }.

select-variant-name-not-possible = Di vɛriant nem { $variantName } we yu gi select nɔ to posibul vɛriant nem.

select-too-few-options = Wi nɔ ebul fɔ pik { $numToSelect } kɔmponɛnt frɔm ɔnli { $numOptions }.

select-from-sequence-too-few-values = Wi nɔ ebul fɔ pik { $numToSelect } valyu frɔm sequence we in lɛnt na { $length }.

select-from-sequence-indices-count-mismatch = Di nɔmba pan indices we yu gi select fɔ mach di nɔmba we wi go pik

select-from-sequence-indices-not-integers = Ɔl di indices we yu gi select fɔ bi ɔl nɔmba

select-from-sequence-index-excluded = Yu gi selectfromsequence index we dɛn dɔn ɛksklud

select-from-sequence-indices-excluded-combination = Yu gi selectfromsequence indices we na kɔmbineshɔn we dɛn dɔn ɛksklud

select-from-sequence-coprime-not-positive-integers = Wi nɔ ebul fɔ pik coprime kɔmbineshɔn bikɔs wi nɔ de pik pɔzitiv ɔl nɔmba.

select-from-sequence-coprime-common-factor = Wi nɔ ebul fɔ pik coprime nɔmba. Ɔl di posibul valyu de shea wan kɔmɔn faktɔ. (Di valyu we yu gi fɔ "from" ɔ "to" fɔ bi coprime wit "step".)

select-from-sequence-coprime-single-number = Wi nɔ ebul fɔ pik coprime kɔmbineshɔn frɔm sinjul nɔmba we nɔ to 1.

select-from-sequence-excluded-too-many-combinations = Dɛn dɔn ɛksklud ova 70% pan di kɔmbineshɔn insay selectFromSequence

select-from-sequence-coprime-none-found = Wi nɔ ebul fɔ pik coprime nɔmba. Ɔl di posibul valyu de shea wan kɔmɔn faktɔ.

select-from-sequence-too-few-unique-values = Wi nɔ ebul fɔ pik { $numToSelect } yunik valyu frɔm sequence we in lɛnt na { $numPossibleValues }

select-prime-numbers-too-few-values = Wi nɔ ebul fɔ pik { $numToSelect } valyu frɔm praym lis we in lɛnt na { $numValues }

select-prime-numbers-values-count-mismatch = Di nɔmba pan valyu we yu gi select fɔ mach di nɔmba we wi go pik

select-prime-numbers-values-not-prime = Ɔl di valyu we yu gi select prime number fɔ de insay di praym lis

select-prime-numbers-values-excluded-combination = Di valyu we yu gi selectPrimeNumbers na kɔmbineshɔn we dɛn dɔn ɛksklud

select-prime-numbers-excluded-too-many-combinations = Dɛn dɔn ɛksklud ova 70% pan di kɔmbineshɔn insay selectPrimeNumbers

select-random-combination-fluke = Na wanda we nɔ fɔ apin: wi nɔ ebul fɔ pik kɔmbineshɔn pan randɔm valyu

select-random-value-fluke = Na wanda we nɔ fɔ apin: wi nɔ ebul fɔ pik randɔm valyu
