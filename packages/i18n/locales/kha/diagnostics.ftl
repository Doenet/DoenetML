# Khasi (Ka Ktien Khasi) diagnostics catalog: the warnings and errors the
# worker, the parser and the schema checker raise. Produced by the worker but
# addressed to whoever is looking at the screen, so these are selected by
# `uiLocale`, not `documentLocale`.
#
# Translated from `locales/en/diagnostics.ftl`, which is the source of truth.
# Message ids, `.attribute` names, select variant keys, placeable names and
# `NUMBER()` are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator, and
# no permission is needed to change a word.
#
# **Orthography: Roman, with its diacritics.** Khasi has been written in the
# Roman alphabet since the Welsh Presbyterian mission, and no other script is
# at issue for it. `ï` (U+00EF), `ñ` (U+00F1) and the ASCII apostrophe `'`
# (U+0027) for the glottal stop are used consistently; the typographic
# apostrophe U+2019 appears nowhere.
#
# **DoenetML's own words stay in English.** `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `selectFromSequence`,
# `sectionWideCheckWork`, `WCAG AA`, the `[deprecation]` marker and every tag,
# attribute and attribute value written into these messages are part of the
# language an author types, not prose. They are left exactly as written.
#
# **Beyond those, much of the technical vocabulary is an English loan, and that
# is declared rather than disguised.** Meghalaya teaches mathematics and
# computing in English, so `component`, `attribute`, `reference`, `function`,
# `matrix`, `variant`, `index`, `interval`, `sequence` and their neighbours are
# written here as English. What is Khasi is the frame that carries them: «ïa»
# the object marker, «ban» the infinitive, «na» *from*, «jong» *of*, «bad»
# *with/and*, «ne» *or*, «lada» *if*, «namar» *because*, «hynrei» *but*, «ym»
# the negative, «ym lah ban» *cannot*, «ym don» *there is none*, «la shem»
# *was found*, «ym la shem» *was not found*, «ym pdiang» *not accepted* for
# English's *ignoring*, «leit lyngba» *passed over* for a skipped descendant,
# «donkam» *needed*, «dei» *is/belongs*, «beit» *correct* and «ba ym beit»
# *invalid*.
#
# **Words to check first:** «error» is left as the English loan throughout, for
# want of a Khasi noun the seed was confident of; «ym pdiang» for *ignoring* is
# built from «pdiang» *to accept* and a reviewer may prefer a different verb;
# «duna kyrpad» for *deprecated* is a coinage; and «dienshohnud» for a quote
# mark is the seed's least confident word in the file.
#
# No message here selects on a plural category: CLDR has no plural data for
# `kha`, and a Khasi noun is not marked for number after a numeral, so every
# English count fork is collapsed to its `*[other]` wording with its placeables
# kept. `field-function-wrong-num-outputs` keeps its fork, in the one form
# that survives having no plural rules: English selects `$expected` on the
# category `[one]`, and this catalog writes the numeric literal `[1]` in its
# place, which Fluent matches against the number itself.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } ym pdiang haba la pyni ar tylli ki endpoint

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } ym pdiang haba la pyni baroh ar ka endpoint bad ka midpoint

line-segment-midpoint-offset-without-midpoint = midpointOffset kam trei khlem ka midpoint

## `<line>`

line-points-undetermined-dimensions = Ka lain ka leit lyngba ki point kiba ym tip ki dimension.

line-points-too-few-dimensions = Ka lain ka dei ban leit lyngba ki point kiba don ar tylli ki dimension halor.

line-points-depend-on-variables = Ka lain ka leit lyngba ki point kiba iadei bad ki variable: { $variables }.

line-equation-invalid-format = Format ba ym beit ïa ka equation jong ka lain ha ki variable { $variable1 } bad { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ka ray ka la pyni da through, endpoint, bad direction.  Ym pdiang ïa ka through ba la pyni.

ray-dimension-mismatch = numDimensions ym iaseng ha ka ray.

## `<vector>`

vector-overprescribed-head = Ka vector ka la pyni da head, tail, bad displacement.  Ym pdiang ïa ka head ba la pyni.

vector-dimension-mismatch = numDimensions ym iaseng ha ka vector.

## Attracting and constraining

attract-to-without-nearest-point = Ym lah ban attract sha ka `<{ $component }>` namar kam don ka state variable nearestPoint.

constrain-to-without-nearest-point = Ym lah ban constrain sha ka `<{ $component }>` namar kam don ka state variable nearestPoint.

constrain-to-interior-without-nearest-point = Ym lah ban constrain sha ka bynta khlaw jong ka `<{ $component }>` namar kam don ka state variable nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ym pdiang ïa ka choiceInput babym inline

## Ordering children by index

choice-input-indices-count-mismatch = Ym pdiang ki index ba la pyni ïa ka choiceInput namar ka rukom ki index kam iaseng bad ka rukom ki khun choice.

pretzel-indices-count-mismatch = Ym pdiang ki index ba la pyni ïa ka problem namar ka rukom ki index kam iaseng bad ka rukom ki khun problem.

shuffle-indices-count-mismatch = Ym pdiang ki index ba la pyni ïa ka shuffle namar ka rukom ki index kam iaseng bad ka rukom ki component.

indices-ignored-out-of-range = Ym pdiang ki index ba la pyni ïa { $component } namar don ki index kiba mih na ka jaka.

pretzel-indices-repeated = Ym pdiang ki index ba la pyni ïa ka pretzel namar don ki index kiba la thoh biang.

pretzel-circuit-first-index = Ym pdiang ki index ba la pyni ïa ka pretzel ha ka circuit mode namar ka index banyngkong ka dei ban long 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ban ka `<{ $component }>` ka trei bad ki khun string, ka attribute `type` ka donkam ban la pyni.

invalid-type-defaulting-to-math = Type { $type } ba ym beit ïa ka component { $component }. Ka dei ban long math, text, number, ne boolean. Da ka default ka long math.

string-not-valid-component-to-arrange = Ka string "{ $value }" kam dei ka component babeit ban { $component }. Ym pdiang.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } ba ym beit, ka type ka long number.

invalid-variable-value = Bynta ba ym beit jong ka variable: `{ $value }`

## Variants

variant-index-must-be-number = Ka variant index { $index } ka dei ban long ka number

variant-index-must-be-integer = Ka variant index { $index } ka dei ban long ka integer

## `<sideBySide>`

side-by-side-absolute-widths = Ka `<{ $component }>` kam la pynlong ïa ki jingthik absolute. Ki width ki long relative.

side-by-side-absolute-margins = Ka `<{ $component }>` kam la pynlong ïa ki jingthik absolute. Ki margin ki long relative.

side-by-side-no-block-child = Ka `<{ $component }>` ba ym beit: ka donkam ban don shisien ka khun block.

## `<label>`

label-for-ignored-on-graphical = Ka attribute `for` halor ka `<label>` graphical ym pdiang.

label-for-must-resolve-to-one = Ka attribute `for` halor ka `<label>` ka dei ban dei shisien ka component.

label-for-unresolved = Ym lah ban pynbeit ïa ka attribute `for` halor ka `<label>` sha kano kano ka component.

label-for-answer-with-authored-inputs = Ka attribute `for` halor ka `<label>` ka iadei bad ka `<answer>` kaba don ki input ba la thoh da u nongthoh; iadei bad ka input hi.

label-for-answer-without-input = Ka attribute `for` halor ka `<label>` ka iadei bad ka `<answer>` kaba ym don ka input ban ai kyrteng.

label-for-must-reference-input-or-answer = Ka attribute `for` halor ka `<label>` ka dei ban iadei bad ka input ne ka answer.

## Accessibility

accessibility-short-description-or-decorative = Ïa ka aksesibiliti, ka `<{ $component }>` ka dei ban don ka jingbatai bakhyndiat ne ban la pyni kum ka decorative.

accessibility-video-short-description = Ïa ka aksesibiliti, ka `<video>` ka dei ban don ka jingbatai bakhyndiat.

accessibility-input-short-description-or-label = Ïa ka aksesibiliti, ka `<{ $component }>` ka dei ban don ka jingbatai bakhyndiat ne ka label.

accessibility-answer-input-short-description-or-label = Ïa ka aksesibiliti, ka `<answer>` kaba pynlong ka input ka dei ban don ka jingbatai bakhyndiat ne ka label.

accessibility-short-description-contains-math = Ki jingbatai bakhyndiat kim dei ban don ki component math kum ka `<{ $component }>`. Batai ïa ka math da ki ktien.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kam don ka contrast bakhraw biang ïa ka ktien khlieh jong ka section (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; donkam halor { $threshold }:1).
       *[other] { $colorName } kam don ka contrast bakhraw biang ïa ka ktien khlieh jong ka section ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; donkam halor { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Ym la pynlong ïa ka `<circle>` ba leit lyngba { $count } ki point haba ki point kim don ki bynta number.

circle-too-many-through-points = Ym lah ban pynkhreh ïa ka circle ba leit lyngba kham bun ban 3 ki point.

circle-overprescribed-radius-center-points = Ym lah ban pynkhreh ïa ka circle bad ka radius, ka center bad ki through point baroh ba la pyni.

circle-center-with-multiple-points = Ym lah ban pynkhreh ïa ka circle bad ka center ba la pyni ba leit lyngba kham bun ban 1 ka point.

circle-radius-too-small = Ym lah ban pynkhreh ïa ka circle: namar ka jinglong jngai hapdeng ki ar tylli ki point ka long { $distance }, ka radius { $radius } ba la pyni ka rit eh.

circle-radius-with-many-points = Ym lah ban pynlong ïa ka circle ba leit lyngba kham bun ban ar tylli ki point bad ka radius ba la pyni.

circle-invalid-center-or-through-points = Ka center ne ki through point jong ka circle ki ym beit.

circle-radius-center-with-multiple-points = Ym lah ban pynkhreh ïa ka radius jong ka circle bad ka center ba la pyni ba leit lyngba kham bun ban 1 ka point.

circle-change-radius-non-numerical = Ym lah ban pynkylla ïa ka radius jong ka circle ba don ki through point kiba ym number

circle-radius-with-points-non-numerical = Ym lah ban pynlong ïa ka circle ba leit lyngba kham bun ban shi tylli ka point bad ka radius ba la pyni haba ym don ki bynta number.

circle-change-center-non-numerical = Ym la pynlong ïa ka jingpynkylla ka center jong ka circle ba leit lyngba ki point kiba ym number.

## `<function>`

function-domain-insufficient-dimensions = Ym don ki dimension biang ïa ka domain jong ka function. Ka domain ka don { $intervals } ki interval hynrei ka function ka don { $inputs } ki input.

function-domain-invalid-format = Format ba ym beit ïa ka domain jong ka function.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ym pdiang ïa ka maximum babym number jong ka function.
        [minimum] Ym pdiang ïa ka minimum babym number jong ka function.
        [extremum] Ym pdiang ïa ka extremum babym number jong ka function.
        [point] Ym pdiang ïa ka point babym number jong ka function.
        [slope] Ym pdiang ïa ka slope babym number jong ka function.
       *[other] Ym pdiang ïa ka { $type } babym number jong ka function.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ym pdiang ïa ka maximum bathang jong ka function.
        [minimum] Ym pdiang ïa ka minimum bathang jong ka function.
        [extremum] Ym pdiang ïa ka extremum bathang jong ka function.
        [point] Ym pdiang ïa ka point bathang jong ka function.
       *[other] Ym pdiang ïa ka { $type } bathang jong ka function.
    }

function-points-too-close = Ka function ka don ar tylli ki point kiba shong marjan eh. Ym lah ban pynlong ïa ka function.

function-iterates-input-output-mismatch = Ki function iterate ki lah tang lada ka rukom ki input jong ka function ka iaseng bad ka rukom ki output. Kane ka function ka don { $inputs } ki input bad { $outputs } ki output.

## `<sequence>`

sequence-invalid-length = Ka jinglong jrong jong ka sequence ka ym beit.  Ka dei ban long ka integer babym duna ban 0.

sequence-invalid-step = Ka step jong ka sequence ka ym beit.  Ka dei ban long ka number ïa ka sequence jong ka type { $type }.

sequence-invalid-endpoint-number = Ka "{ $attribute }" jong ka number sequence ka ym beit.  Ka dei ban long ka number.

sequence-invalid-endpoint-letters = Ka "{ $attribute }" jong ka letters sequence ka ym beit.  Ka dei ban long ka jingiasoh ki lettar.

sequence-invalid-endpoint = Ka "{ $attribute }" jong ka sequence ka ym beit.

select-from-sequence-coprime-not-numbers = coprime ym pdiang namar ym jied ki number

select-from-sequence-coprime-with-exclude-combinations = coprime ym pdiang namar la pyni excludeCombinations

## Resolving a `target`

target-not-found = Ka target ba ym beit ïa ka `<{ $source }>`: ym lah ban shem ïa ka target.

target-state-variable-not-found = Ka target ba ym beit ïa ka `<{ $source }>`: ym lah ban shem ka state variable kaba kyrteng "{ $property }" halor ka `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Ki variable jong ka `<odeSystem>` ki dei ban pher na ka independent variable.

ode-system-duplicate-variable-names = Ym lah ban pynlong ki ODE RHS function bad ki kyrteng dependent variable kiba iaman.

ode-system-rhs-function-error = Ym lah ban pynlong ïa ka ODE RHS function.  Don ka error ha ka jingpynlong function mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ym lah ban pynlong ka angle hapdeng { $count } ki lain

angle-invalid-through-point = Ka point ba ym beit ha ka through jong ka `<angle>`

parabola-vertex-too-many-points = Ym la pynlong ïa ka parabola bad ka vertex ba leit lyngba kham bun ban 1 ka point.

parabola-too-many-points = Ym la pynlong ïa ka parabola ba leit lyngba kham bun ban 3 ki point.

intersection-too-many-items = Ym la pynlong ïa ka intersection ïa kham bun ban ar tylli ki jingei

## Other math components

ionic-compound-not-two-ions = Ym la pynlong ïa ka ionic compound ïa kaei kaei bakwah na ki ar tylli ki ion.

ionic-compound-needs-cation-and-anion = Ka ionic compound ka la pynlong tang ïa shi tylli ka cation bad shi tylli ka anion.

solve-equations-cannot-evaluate = Ym lah ban solve ïa ka equation namar ym lah ban pynkhreh ïa ka equation: { $equation }

math-operators-operand-number-required = Ka donkam ban pyni ka operandNumber haba mih ka math operand.

eigen-decomposition-failed = Ym lah ban pynkhreh ki eigenvalue jong ka matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: ki parameter { $parameters } kim mih ha ka pattern, kumta ki'n ïaseng bad ka jaka thang baroh ka por.

## `<graph>`

graph-grid-invalid = `<graph>`: ym lah ban sngewthuh ïa ka grid="{ $grid }". Ka dei ban long none, medium, dense, ne ar tylli ki number babym duna kiba iasuh da ka jaka thang, kum ka grid="1 0.5". Ym la thoh ka grid.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    Ka `<{ $component }>` ka donkam ka function bad { $expected ->
        [1] shi tylli ka output, ka slope y' ha man la ka point, kum ka `y - x`
       *[other] ar tylli ki output, ka vector ha man la ka point, kum ka `(y, -x)`
    }, hynrei ka function ba la ai ka don { $found } ki output. { $alternative ->
        [none] Ym la thoh ei ei.
       *[other] Ka `<{ $alternative }>` ka dei ka component ïa kata ka function. Ym la thoh ei ei.
    }

field-function-attribute-ignored-with-child = Ka attribute `function` ym pdiang namar ka function ka la ai ruh ha ka bynta khlaw jong ka component; kaba ha khlaw ka trei. Ai ïa ka function tang da shi arasi.

field-variables-ignored =
    `<{ $component }>`: ka attribute `variables` ka ai kyrteng ïa ki variable jong ka expression ba la thoh hi ha ka bynta khlaw jong ka component. { $reason ->
        [function-child] Ka function hangne ka la ai kum ka khun `<function>`, kaba ai kyrteng ïa ki variable jong ka lade, kumta `variables` ym pdiang.
       *[no-expression] Ym don kata ka expression hangne, kumta `variables` ym pdiang.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" kam trei ha ka prefigure renderer; ka rukom right-position ka trei.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" kam trei ha ka prefigure renderer; ka rukom top-position ka trei.

prefigure-invalid-axis-bounds = `<graph>`: ki axis bound ki ym beit ïa ka jingkylla prefigure; da ka default ka bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ka width ka ym beit ïa ka jingkylla prefigure; da ka default ka diagram width 425.

prefigure-invalid-aspect-ratio = `<graph>`: ka aspectRatio ka ym beit ïa ka jingkylla prefigure; da ka default ka aspect ratio 1.

prefigure-grid-spacing-too-fine = `<graph>`: ka jaka thang hapdeng ki lain jong ka grid ka rit eh ïa ki axis limit; ka grid ka mihnoh ha ka prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: ki annotation kim mih lada ym pyndonkam ïa ka PreFigure renderer.

multiple-annotations-children = La shem bun ki khun `<annotations>` ha ka `<graph>`; ym pdiang baroh hynrei tang kaba khadduh.

## Referring to other components

copy-unrecognized-component-type = Ym lah ban extend ne copy ïa ka component type babym tip: { $type }.

copy-prop-not-found = Ym lah ban shem ka prop { $property } halor ka component jong ka type { $component }

collect-no-source = Ym la shem ka source ïa ka collect.

collect-invalid-component-type = Ym lah ban collect ki component jong ka type `<{ $component }>` namar ka dei ka component type ba ym beit.

reference-index-unavailable = Ym lah ban iadei bad ka index `{ $reference }`

## `<callAction>`

component-action-unavailable = Ym lah ban khot { $action } halor ka component `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ka data ka don ka jinglong ba ym beit.  Ki ro ki don ki jinglong jrong kiba pher. La shem ha ka componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Ka data ka don ki kyrteng kolom kiba iaman.  La shem ha ka componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ka data kam don ka kyrteng kolom.  La shem ha ka componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ka award ïa kane ka answer ka iadei bad ka jingjubab jong ka answer tag hi, kaba'n pynmih ki jingjia babym kwah.

answer-max-num-attempts-in-section-wide-check-work = Ka jingbuh `maxNumAttempts` halor ka `<answer>` ha ka bynta ba don `sectionWideCheckWork` kam trei, namar ka rukom ki jingpyrshang ka la buh da ka bynta bakhraw. Buh ïa ka `maxNumAttempts` halor ka bynta bakhraw hi.

nested-section-wide-check-work-max-num-attempts = Ka jingbuh `maxNumAttempts` halor ka bynta ba don `sectionWideCheckWork` kaba shong ha ka bynta kawei pat ba don `sectionWideCheckWork` kam trei, namar ka rukom ki jingpyrshang ka la buh da ka bynta ba shabar. Buh ïa ka `maxNumAttempts` halor ka bynta ba shabar.

answer-attributes-need-symbolic-equality = Ki attribute { $attributes } kim trei khlem ka symbolicEquality ba la buh.

answer-invalid-type = Ka type ba ym beit ïa ka answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Namar ka component `<{ $component }>` kam don ka kyrteng, kam lah ban pyndonkam kum ka attribute jong ka module

module-attribute-name-already-defined = Ka component `<{ $component } name="{ $name }">` kam lah ban pyndonkam kum ka attribute jong ka module namar ka component type `<module>` ka la don ka attribute "{ $name }" mynta.

conditional-content-condition-ignored = Ka attribute `condition` ym pdiang halor ka component `<conditionalContent>` kaba don ki khun case ne else.

slider-markers-type-mismatch = Ka type ki marker kam iaseng bad ka type jong ka slider.

pretzel-problem-needs-statement-and-answer = Ka pretzel ba ym beit: man la ka `<problem>` ka dei ban don shi tylli ka `<statement>` bad shi tylli ka `<answer>`.

pretzel-circuit-first-problem-distractor = Ka pretzel ba ym beit: ha ka mode="circuit", ka `<problem>` banyngkong kam lah ban long ka distractor.

## Attribute values

attribute-invalid-values = Ki bynta { $values } ki ym beit ïa ka attribute `{ $attribute }`; ym pdiang.

attribute-must-be-references = Ka bynta `{ $value }` ka ym beit ïa ka attribute `{ $attribute }`. Ka attribute ka dei ban long ki reference kiba sdang da ka `$`.

math-input-invalid-function-names = <mathInput>: ym pdiang ki kyrteng function kiba ym beit ha { $attribute }: { $names }. Man la ka kyrteng ka dei ban don halor 2 ki lettar (ki lettar ne ki hyphen) ha ka bynta ba paw; ka lah ban bud ka `|<mathspeak alternative>` lada kwah.

## Building components from the source

component-type-invalid = Ka component type ba ym beit: `<{ $componentType }>`

attribute-repeated = Ym lah ban thoh biang ïa ka attribute { $attribute }.

attribute-invalid-for-component = Ka attribute "{ $attribute }" ka ym beit ïa ka component jong ka type `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Ka style definition { $styleNumber } kam don ka contrast bakhraw biang ïa { $context ->
        [text-on-background] ka rong ktien halor ka rong bakgrawnd
        [high-contrast] ka rong high-contrast halor ka canvas
        [line] ka rong lain halor ka canvas
        [marker] ka rong marker halor ka canvas
       *[text-on-canvas] ka rong ktien halor ka canvas
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; donkam halor { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Lehse ka style definition { $styleNumber } ka la pyni ki rong kiba ai ka contrast bakhraw biang ïa ka light mode, ki rong dark mode kiba mih na kine ki bynta kim don ka contrast bakhraw biang ïa ka rong ktien halor ka rong bakgrawnd ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; donkam halor { $threshold }:1). { $suggestion ->
        [available] Ban ai ka contrast bakhraw biang ha ka dark mode, pynkhraw ïa ka contrast jong ka light mode (kum ka { $lightAttribute }="{ $lightColor }") ne pynkylla ïa ka rong dark mode (kum ka { $darkAttribute }="{ $darkColor }").
       *[none] Ban ai ka contrast bakhraw biang ha ka dark mode, pynkhraw ïa ka contrast jong ka light mode ne pynkylla ïa ki rong ba mih da ka textColorDarkMode bad/ne ka backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Lehse ka style definition { $styleNumber } ka la pyni ka rong ktien kaba ai ka contrast bakhraw biang ïa ka light mode, ka rong ktien dark mode kaba mih na kane ka bynta kam don ka contrast bakhraw biang halor ka canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; donkam halor { $threshold }:1). { $suggestion ->
        [available] Ban ai ka contrast bakhraw biang ha ka dark mode, pynkhraw ïa ka contrast jong ka light mode (kum ka textColor="{ $lightColor }") ne pynkylla ïa ka rong dark mode (kum ka textColorDarkMode="{ $darkColor }").
       *[none] Ban ai ka contrast bakhraw biang ha ka dark mode, pynkhraw ïa ka contrast jong ka light mode ne pynkylla ïa ka rong ba mih da ka textColorDarkMode.
    }

section-multiple-style-palettes = Ka section ka lah ban jied tang shi tylli ka <stylePalette>; kaba khadduh ka trei.

## Unique variants

variant-num-to-select-not-non-negative-integer = ym lah ban tip ki unique variant jong { $component } namar ka numToSelect kam dei ka integer babym duna ban 0.

variant-num-to-select-not-constant-number = ym lah ban tip ki unique variant jong { $component } namar ka numToSelect kam dei ka number babym kylla.

variant-with-replacement-not-constant-boolean = ym lah ban tip ki unique variant jong { $component } namar ka withReplacement kam dei ka boolean babym kylla.

variant-select-weight-disables-unique = Ki unique variant ïa ka select ki ym trei lada don ka option bad ka selectWeight ne ka selectForVariants ba la pyni

variant-coprime-undetermined = ym lah ban tip ki unique variant jong { $component } namar ym lah ban tip ba ka coprime ka long bakhlem hok baroh ka por.

variant-attribute-not-constant = ym lah ban tip ki unique variant jong { $component } namar ka { $attribute } kam dei kaba ym kylla.

variant-attribute-not-number = ym lah ban tip ki unique variant jong { $component } namar ka { $attribute } kam dei ka number.

variant-attribute-wrong-type-for-sequence =
    ym lah ban tip ki unique variant jong { $component } jong ka type { $type } namar ka { $attribute } kam dei { $expected ->
        [letters-combination] ka jingiasoh ki lettar
        [math-expression] ka math expression babeit
        [integer] ka integer
       *[number] ka number
    }.

variant-length-not-integer = ym lah ban tip ki unique variant jong { $component } namar ka length kam dei ka integer.

variant-sort-not-implemented = ym la pynlong ki unique variant jong ka { $component } bad ka sort

variant-exclude-combinations-not-implemented = ym la pynlong ki unique variant jong ka { $component } bad ka excludeCombinations

variant-math-exclude-not-implemented = ym la pynlong ki unique variant jong ka { $component } jong ka type math bad ka exclude

variant-non-constant-exclude-not-implemented = ym la pynlong ki unique variant jong ka { $component } bad ka exclude kaba kylla

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: kam trei ha ka graph prefigure renderer; la leit lyngba ïa ka khun.

prefigure-descendant-invalid-geometry = { $subject }: ka geometry ka ym dep ne kam don ka jinglong; la leit lyngba ïa ka khun.

prefigure-curve-label-omitted = { $subject }: ki label kim trei halor ki curve element ba la pynkylla; la mihnoh ïa ka label.

prefigure-curve-unsupported-definition-type = { $subject }: ka curve function definition type '{ $definitionType }' kam trei; la leit lyngba ïa ka khun.

prefigure-region-flip-functions-unsupported = { $subject }: ka attribute flipFunctions halor ka regionBetweenCurves kam trei; la leit lyngba ïa ka khun.

prefigure-region-non-formula-child = { $subject }: tang ki khun function jong ka type formula ki trei halor ka regionBetweenCurves; la leit lyngba ïa ka khun.

prefigure-label-position-unsupported =
    { $subject }: ka labelPosition '{ $labelPosition }' kam trei ïa ka { $labelKind ->
        [line-family] label jong ka rukom lain
       *[point] label jong ka point
    }; da ka default ka jingiaseng PreFigure.

prefigure-fill-style-unsupported = { $subject }: ka fill style '{ $fillStyle }' kam trei ha ka PreFigure; da ka fill ba dap ka trei.

prefigure-line-style-unknown = { $subject }: ka line style '{ $lineStyle }' babym tip la mihnoh na ka output PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ka marker style '{ $markerStyle }' la pynkylla sha ka style PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: ka marker style '{ $markerStyle }' kam trei ha ka PreFigure; da ka default ka style ka trei.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ka `ref` ka ym beit; ym lah ban shem ïa ka target. La mihnoh ïa ka annotation.

annotation-ref-multiple-targets = `<annotation>`: ka `ref` ka poi sha bun ki target; kaba nyngkong ka trei.

annotation-ref-outside-graph = `<annotation>`: ka `ref` ka ym beit; ka target ka shong shabar ka graph. La mihnoh ïa ka annotation.

annotation-ref-unsupported-target = `<annotation>`: ka `ref` ka ym beit; ka target kam dei ka jingei graphical kaba trei ha ka jingkylla prefigure. La mihnoh ïa ka annotation.

annotation-text-missing = `<annotation>`: ka `text` ka duh ne ka thang; la ai ka ktien bathang.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] La shem ka circular dependency.
       *[other] La shem ka circular dependency kaba iadei bad ka component `<{ $componentType }>`.
    }

reference-no-referent = Ym la shem ei ei ba dei ka reference: `{ $reference }`

reference-multiple-referents = La shem bun ki jingdei ïa ka reference: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format ba ym beit ïa ka attribute { $attribute } jong ka `<{ $componentType }>`.

children-invalid = Ki khun ki ym beit ïa ka `<{ $componentType }>`: La shem ki khun kiba ym beit: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ka bynta `{ $value }` ka ym beit ïa ka attribute `{ $attribute }`, da ka bynta `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ym la shem ka DoenetML version { $version }.
       *[other] Ym la shem ka DoenetML version { $version }. Da ka version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Ka DoenetML ka ym beit: { $content }

parse-tag-missing-close-tag = Ka DoenetML ka ym beit: Ka tag `{ $tag }` kam don ka tag ba khang. Ka donkam ka tag ba khang lade ne ka tag `</{ $tagName }>`.

parse-tag-error = Ka DoenetML ka ym beit: Don ka error ha ka tag `<{ $tagName }>`

parse-attribute-missing-value = Ka DoenetML ka ym beit: Ka attribute `{ $attribute }` ba ym beit ka lang kum ba kam don ka bynta.

parse-attribute-invalid = Ka DoenetML ka ym beit: Ka attribute `{ $attribute }` ka ym beit

parse-attribute-value-invalid = Ka DoenetML ka ym beit: Ka bynta attribute `{ $value }` ka ym beit

parse-attribute-value-quote-mismatch = Ka DoenetML ka ym beit: Ka bynta attribute `{ $value }` ka ym beit. Ki dienshohnud quote kim iaseng. Ka lang kum ba duh ka `{ $quote }`

parse-open-tag-name-missing = Ka DoenetML ka ym beit: La shem ka tag khlem kyrteng tag, kum ka `<`

parse-tag-not-closed = Ka DoenetML ka ym beit: Ka tag `{ $tag }` ka ym la khang (ka lang kum ba duh ka `>`).

parse-self-closing-tag-name-missing = Ka DoenetML ka ym beit: La shem ka tag khlem kyrteng tag `<{ $content }>`

parse-self-closing-tag-not-closed = Ka DoenetML ka ym beit: Ka tag `{ $tag }` ka ym la khang (ka lang kum ba duh ka `/>`).

parse-tag-invalid-attributes = Ka DoenetML ka ym beit: Ka tag `{ $tag }` ka ym beit. Ki attribute jong ka ki lah ban ym beit.

parse-close-tag-name-missing = Ka DoenetML ka ym beit: La shem ka tag ba khang khlem kyrteng tag, kum ka `</`

parse-attribute-value-unquoted = Ki bynta attribute ki dei ban shong ha ki dienshohnud quote: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ka DoenetML ka ym beit: La shem ka tag ba khang `{ $tag }`, hynrei ym don ka tag ba plie kaba iaseng

parse-close-tag-mismatched = Ka DoenetML ka ym beit: Ka tag ba khang kam iaseng. Ka donkam ka `</{ $expected }>`. La shem ka `{ $found }`

parser-node-unconvertible = Ym lah ban pynkylla ïa ka node { $node } sha ka Dast node.

## Names

name-attribute-invalid =
    Ka kyrteng attribute name='{ $name }' ka ym beit. { $reason ->
        [characters] Ki kyrteng ki lah ban don tang ki lettar, ki number, ki underscore ne ki hyphen.
       *[start] Ki kyrteng ki dei ban sdang da ka lettar.
    }

component-name-invalid-start = Ka kyrteng component "{ $name }" ka ym beit. Ki kyrteng ki dei ban sdang da ka lettar.

## `<answer>` sugar

answer-video-watched-missing-video = Ka answer jong ka type videoWatched ka dei ban don ka attribute video

answer-video-watched-video-not-reference = Ka answer jong ka type videoWatched ka dei ban don ka attribute video kaba dei ka reference

answer-name-not-single-text = Ka attribute name jong ka answer ka dei ban don shi tylli ka khun text

## Referencing another document

external-doenetml-recursion-limit = Ym lah ban shem ïa ka DoenetML ba shabar namar bun eh ki daw jong ka recursion. Don ka circular reference?

external-doenetml-unavailable = Ym lah ban shem ïa ka DoenetML na { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Ka DoenetML ba la shem na { $attribute }="{ $uri }" ka ym beit: kam iaseng bad ka component type "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ka attribute `{ $from }` ka la duna kyrpad; pyndonkam ïa ka `{ $to }` hi.
       *[other] [deprecation] Ka attribute `{ $from }` halor ka `<{ $component }>` ka la duna kyrpad; pyndonkam ïa ka `{ $to }` hi.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ka attribute `{ $from }` ka la duna kyrpad bad ym pdiang namar la pyni ruh ka `{ $to }`.
       *[other] [deprecation] Ka attribute `{ $from }` halor ka `<{ $component }>` ka la duna kyrpad bad ym pdiang namar la pyni ruh ka `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Ka attribute `{ $attribute }` halor ka `<{ $component }>` ka la duna kyrpad bad ym pdiang.

deprecated-attribute-to-child = [deprecation] Ka attribute `{ $attribute }` halor ka `<{ $component }>` ka la duna kyrpad; pyndonkam ïa ka khun `<{ $child }>` hi.

deprecated-attribute-value-renamed = [deprecation] Ka bynta `{ $value }` jong ka attribute `{ $attribute }` halor ka `<{ $component }>` ka la duna kyrpad; pyndonkam ïa ka `{ $to }` hi.


## Language coverage

pluralize-english-only = Ka `<pluralize>` ka lah ban pynbun tang ïa ka ktien Anglisa, kumta ka ktien jong ka ka sah kumba la thoh ha ka dokumen ba la thoh ha ka { $locale }. Thoh ïa ka rukom babun hi, ne buh ïa ka da ka attribute `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ka element `<{ $tag }>` kam dei ka element Doenet babym tip.

schema-element-not-allowed-at-root = Ka element `<{ $tag }>` kam lah ban shong ha ka jaka bakhraw tam jong ka dokumen.

schema-element-not-allowed-inside = Ka element `<{ $tag }>` kam lah ban shong ha ka bynta khlaw jong ka `<{ $parent }>`.

schema-attribute-unrecognized = Ka element `<{ $tag }>` kam don ka attribute kaba kyrteng `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ka attribute `{ $attribute }` jong ka element `<{ $tag }>` ka dei ban long ka list kaba man la ka bynta jong ka ka dei shi tylli na kine: { $allowed }
       *[other] Ka attribute `{ $attribute }` jong ka element `<{ $tag }>` ka dei ban long shi tylli na kine: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ka kyrteng variant ka ym beit ïa ka select.  Ka kyrteng variant { $variantName } ka mih ha { $numOptions } ki option hynrei ka rukom ban jied ka long { $numToSelect }.

select-variant-name-without-options = La pyni ki variant ïa ka select hynrei ym la pyni ki option ïa ka kyrteng variant kaba lah: { $variantName }.

select-variant-name-not-possible = Ka kyrteng variant { $variantName } ba la pyni ïa ka select kam dei ka kyrteng variant kaba lah.

select-too-few-options = Ym lah ban jied { $numToSelect } ki component tang na { $numOptions }.

select-from-sequence-too-few-values = Ym lah ban jied { $numToSelect } ki bynta na ka sequence kaba jrong { $length }.

select-from-sequence-indices-count-mismatch = Ka rukom ki index ba la pyni ïa ka select ka dei ban iaseng bad ka rukom ban jied

select-from-sequence-indices-not-integers = Baroh ki index ba la pyni ïa ka select ki dei ban long ki integer

select-from-sequence-index-excluded = La pyni ka index jong ka selectfromsequence kaba la mihnoh

select-from-sequence-indices-excluded-combination = La pyni ki index jong ka selectfromsequence kiba dei ka jingiasoh ba la mihnoh

select-from-sequence-coprime-not-positive-integers = Ym lah ban jied ki jingiasoh coprime namar ym jied ki integer babym duna.

select-from-sequence-coprime-common-factor = Ym lah ban jied ki number coprime. Baroh ki bynta kiba lah ki don ka factor ba iaman. (Ki bynta ba la pyni jong ka "from" ne ka "to" ki dei ban long coprime bad ka "step".)

select-from-sequence-coprime-single-number = Ym lah ban jied ki jingiasoh coprime na shi tylli ka number kaba ym long 1.

select-from-sequence-excluded-too-many-combinations = La mihnoh halor 70% ki jingiasoh ha ka selectFromSequence

select-from-sequence-coprime-none-found = Ym lah ban jied ki number coprime. Baroh ki bynta kiba lah ki don ka factor ba iaman.

select-from-sequence-too-few-unique-values = Ym lah ban jied { $numToSelect } ki bynta unique na ka sequence kaba jrong { $numPossibleValues }

select-prime-numbers-too-few-values = Ym lah ban jied { $numToSelect } ki bynta na ka list ki prime kaba jrong { $numValues }

select-prime-numbers-values-count-mismatch = Ka rukom ki bynta ba la pyni ïa ka select ka dei ban iaseng bad ka rukom ban jied

select-prime-numbers-values-not-prime = Baroh ki bynta ba la pyni ïa ka select prime number ki dei ban shong ha ka list ki prime

select-prime-numbers-values-excluded-combination = Ki bynta ba la pyni jong ka selectPrimeNumbers ki dei ka jingiasoh ba la mihnoh

select-prime-numbers-excluded-too-many-combinations = La mihnoh halor 70% ki jingiasoh ha ka selectPrimeNumbers

select-random-combination-fluke = Da ka jingjia babym kwah eh, ym lah ban jied ka jingiasoh ki bynta random

select-random-value-fluke = Da ka jingjia babym kwah eh, ym lah ban jied ka bynta random

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Kane ka `<{ $component }>` kam paw namar ka shong ha ka math bad kam dei `inline`. Buh ïa ka `inline` khnang ba ka'n long ka drop-down list, kaba shong ha ka expression.
        [expanded] Kane ka `<{ $component }>` kam paw namar ka shong ha ka math bad ka dei `expanded`. Rah noh ïa ka `expanded`; ka box bunlain kam shong ha ka expression.
        [on-graph] Kane ka `<{ $component }>` kam paw namar ka shong ha ka math kaba la thoh halor ka graph, kaba ym don ka jaka ïa ka input.
       *[relative-width] Kane ka `<{ $component }>` kam paw namar ka shong ha ka math bad ka don ka width relative. Ai ïa ka width da ki jingthik absolute, kum ka `px`.
    }
