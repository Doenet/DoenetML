# Belize Kriol (Bileez Kriol) diagnostics: the errors and warnings the worker,
# the parser and the language server put in front of whoever is looking at the
# screen. Translated from `locales/en/diagnostics.ftl`, which is the source of
# truth; the ids are reached by diagnostic code and are never translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The phonemic orthography of the Belize Kriol Council /
# National Kriol Council of Belize, set out point by point in `chrome.ftl`'s
# header: long vowels doubled, «ch» for English *tr-*, «j» for English *dr-*,
# no apostrophes, no silent letters. The English-based ad-hoc spelling in
# everyday use is not mixed into these files; a reviewer who prefers it should
# respell rather than retranslate.
#
# **DoenetML identifiers stay in English.** Tag names, attribute names and
# attribute values — `through`, `endpoint`, `midpointOffset`, `numDimensions`,
# `maxNumAttempts`, `symbolicEquality`, `math`, `text`, `number`, `boolean`,
# `none`, `medium`, `dense`, `from`, `to`, `step` — are the language, not
# prose, and are written here exactly as English writes them. So are the
# `[deprecation]` marker and the `Invalid DoenetML: ` opening's structure,
# though its words are translated.
#
# **Number.** `Intl.PluralRules("bzj")` has no CLDR data for `bzj` and falls
# back to English. A Kriol noun after a numeral does not inflect, so every
# message English selects on a count — `line-segment-attributes-ignored-*`,
# `function-domain-insufficient-dimensions`,
# `function-iterates-input-output-mismatch`,
# `matches-pattern-parameter-not-in-pattern`,
# `answer-attributes-need-symbolic-equality`, `attribute-invalid-values` — is
# written here as **one unselected form**. The one remaining `[one]` branch,
# in `field-function-wrong-num-outputs`, is not a plural: it picks between two
# different sentences about what a slope field and a vector field each need,
# and dropping it would drop the advice.
#
# **Loans.** English respelled into Kriol phonology: «komponent»,
# «atribyuut», «valyu», «dakiument», «vershan», «varyant», «indeks»,
# «paramita», «expreshan», «funkshan», «matriks», «sekwens», «dimenshan»,
# «kantras», «anotayshan», «skiima», «refrans», «prapati», «era». Where Kriol
# has its own word it carries the sentence: «noh», «fain», «tek», «se»,
# «jraa», «pas oava», «mos», «ku».
#
# **Confidence.** Kriol has no written technical prose of this kind, so every
# noun above is a respelling this seed made. What a reviewer should read for is
# the grammar: the negator «noh», the modal «ku» / «mos», and the absence of
# English inflection. Nothing here was left in English.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } noh kount wen yu se tu endpoint

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } noh kount wen yu se wan endpoint ahn wan midpoint bofa dem

line-segment-midpoint-offset-without-midpoint = midpointOffset noh du notn if no midpoint noh deh

## `<line>`

line-points-undetermined-dimensions = Lain chruu paint weh wi noh noa how moch dimenshan dehn gat.

line-points-too-few-dimensions = Di lain mos goh chruu paint weh gat tu dimenshan ar moa.

line-points-depend-on-variables = Di lain goh chruu paint weh dipen pahn verabl: { $variables }.

line-equation-invalid-format = Di fahmat fi di ikwayshan a di lain eena verabl { $variable1 } ahn { $variable2 } noh gud.

## `<ray>`

ray-overprescribed-through = Di ray get se wid through, endpoint ahn direction.  Wi pas oava di through weh yu se.

ray-dimension-mismatch = Di numDimensions noh mach eena di ray.

## `<vector>`

vector-overprescribed-head = Di vekta get se wid head, tail ahn displacement.  Wi pas oava di head weh yu se.

vector-dimension-mismatch = Di numDimensions noh mach eena di vekta.

## Attracting and constraining

attract-to-without-nearest-point = Wi kyaahn atrak tu wan `<{ $component }>` bikaaz ih noh gat wan nearestPoint stayt verabl.

constrain-to-without-nearest-point = Wi kyaahn konstrayn tu wan `<{ $component }>` bikaaz ih noh gat wan nearestPoint stayt verabl.

constrain-to-interior-without-nearest-point = Wi kyaahn konstrayn tu eenside a wan `<{ $component }>` bikaaz ih noh gat wan nearestPoint stayt verabl.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition noh kount pahn wan choiceInput weh noh inline

## Ordering children by index

choice-input-indices-count-mismatch = Wi pas oava di indices weh se fi di choiceInput bikaaz di nomba a indices noh mach di nomba a choice pikni.

pretzel-indices-count-mismatch = Wi pas oava di indices weh se fi di problem bikaaz di nomba a indices noh mach di nomba a problem pikni.

shuffle-indices-count-mismatch = Wi pas oava di indices weh se fi di shuffle bikaaz di nomba a indices noh mach di nomba a komponent.

indices-ignored-out-of-range = Wi pas oava di indices weh se fi { $component } bikaaz som a dehn deh outa rayni.

pretzel-indices-repeated = Wi pas oava di indices weh se fi di pretzel bikaaz som a dehn ripiit.

pretzel-circuit-first-index = Wi pas oava di indices weh se fi di pretzel eena circuit moad bikaaz di fos indeks mos bee 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Fi `<{ $component }>` fi wok wid schring pikni, yu mos se wan `type` atribyuut.

invalid-type-defaulting-to-math = Di type { $type } noh gud fi wan { $component } komponent. Ih mos bee math, text, number ar boolean. Wi wahn yuuz math.

string-not-valid-component-to-arrange = Di schring "{ $value }" noh wan gud komponent fi { $component }. Wi pas oava it.

## Types and variables

invalid-type-defaulting-to-number = Di type { $type } noh gud, soh wi set di type tu number.

invalid-variable-value = Di valyu a wan verabl noh gud: `{ $value }`

## Variants

variant-index-must-be-number = Di varyant indeks { $index } mos bee wan nomba

variant-index-must-be-integer = Di varyant indeks { $index } mos bee wan hoal nomba

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` noh mek fi abzalut mezhamant. Wi set di widt dehn tu relativ.

side-by-side-absolute-margins = `<{ $component }>` noh mek fi abzalut mezhamant. Wi set di maajin dehn tu relativ.

side-by-side-no-block-child = Dis `<{ $component }>` noh gud: ih mos gat wan blak pikni ar moa.

## `<label>`

label-for-ignored-on-graphical = Di `for` atribyuut noh kount pahn wan grafikal `<label>`.

label-for-must-resolve-to-one = Di `for` atribyuut pahn wan `<label>` mos poin tu jos wan komponent.

label-for-unresolved = Di `for` atribyuut pahn wan `<label>` noh mi ku fain no komponent.

label-for-answer-with-authored-inputs = Di `for` atribyuut pahn wan `<label>` di poin tu wan `<answer>` weh gat ih oan inpot rait out; poin schrayt tu di inpot.

label-for-answer-without-input = Di `for` atribyuut pahn wan `<label>` di poin tu wan `<answer>` weh noh gat no inpot fi laybl.

label-for-must-reference-input-or-answer = Di `for` atribyuut pahn wan `<label>` mos poin tu wan inpot ar wan answer.

## Accessibility

accessibility-short-description-or-decorative = Fi akseh, wan `<{ $component }>` mos gat wan shaat diskripshan ar ih mos se dekorativ.

accessibility-video-short-description = Fi akseh, wan `<video>` mos gat wan shaat diskripshan.

accessibility-input-short-description-or-label = Fi akseh, wan `<{ $component }>` mos gat wan shaat diskripshan ar wan laybl.

accessibility-answer-input-short-description-or-label = Fi akseh, wan `<answer>` weh mek wan inpot mos gat wan shaat diskripshan ar wan laybl.

accessibility-short-description-contains-math = Shaat diskripshan noh fi gat mat komponent laik `<{ $component }>` eena dehn. Spel out di mat wid werd.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } noh gat nof kantras fi di sekshan hedin teks (dark moad) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ih need { $threshold }:1 ar moa).
       *[other] { $colorName } noh gat nof kantras fi di sekshan hedin teks ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ih need { $threshold }:1 ar moa).
    }

## `<circle>`

circle-through-points-non-numerical = Wi noh mek wan `<circle>` chruu { $count } paint yet fi wen di paint dehn noh gat nomba valyu.

circle-too-many-through-points = Wi kyaahn wok out wan serkl chruu moa dan 3 paint.

circle-overprescribed-radius-center-points = Wi kyaahn wok out wan serkl wid radius, senta ahn chruu-paint aal chree se.

circle-center-with-multiple-points = Wi kyaahn wok out wan serkl wid wan senta se weh goh chruu moa dan 1 paint.

circle-radius-too-small = Wi kyaahn wok out di serkl: di distans bitwiin di tu paint da { $distance }, soh di radius { $radius } weh yu se too likl.

circle-radius-with-many-points = Wi kyaahn mek wan serkl chruu moa dan tu paint wid wan radius se.

circle-invalid-center-or-through-points = Di senta ar di chruu-paint dehn a di serkl noh gud.

circle-radius-center-with-multiple-points = Wi kyaahn wok out di radius a wan serkl wid wan senta se weh goh chruu moa dan 1 paint.

circle-change-radius-non-numerical = Wi kyaahn chaynj di radius a wan serkl weh gat chruu-paint weh noh gat nomba valyu

circle-radius-with-points-non-numerical = Wi kyaahn mek wan serkl chruu moa dan wan paint wid wan radius se wen di paint dehn noh gat nomba valyu.

circle-change-center-non-numerical = Wi noh mek wan way yet fi chaynj di senta a wan serkl weh goh chruu paint weh noh gat nomba valyu.

## `<function>`

function-domain-insufficient-dimensions = Di doamayn noh gat nof dimenshan fi di fongshan. Di doamayn gat { $intervals } intaval bot di fongshan gat { $inputs } inpot.

function-domain-invalid-format = Di fahmat fi di doamayn a di fongshan noh gud.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Wi pas oava di maksimom a di fongshan bikaaz ih noh wan nomba.
        [minimum] Wi pas oava di minimom a di fongshan bikaaz ih noh wan nomba.
        [extremum] Wi pas oava di ekschriimom a di fongshan bikaaz ih noh wan nomba.
        [point] Wi pas oava di paint a di fongshan bikaaz ih noh wan nomba.
        [slope] Wi pas oava di sloap a di fongshan bikaaz ih noh wan nomba.
       *[other] Wi pas oava di { $type } a di fongshan bikaaz ih noh wan nomba.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Wi pas oava di maksimom a di fongshan bikaaz ih emti.
        [minimum] Wi pas oava di minimom a di fongshan bikaaz ih emti.
        [extremum] Wi pas oava di ekschriimom a di fongshan bikaaz ih emti.
        [point] Wi pas oava di paint a di fongshan bikaaz ih emti.
       *[other] Wi pas oava di { $type } a di fongshan bikaaz ih emti.
    }

function-points-too-close = Di fongshan gat tu paint weh deh too kloas tugeda. Wi kyaahn difain di fongshan.

function-iterates-input-output-mismatch = Fongshan itarayt ku wok oanli if di nomba a inpot siem laik di nomba a outpot. Dis fongshan gat { $inputs } inpot ahn { $outputs } outpot.

## `<sequence>`

sequence-invalid-length = Di lent a di sekwens noh gud.  Ih mos bee wan hoal nomba weh noh negativ.

sequence-invalid-step = Di step a di sekwens noh gud.  Ih mos bee wan nomba fi wan sekwens a type { $type }.

sequence-invalid-endpoint-number = Di "{ $attribute }" a di nomba sekwens noh gud.  Ih mos bee wan nomba.

sequence-invalid-endpoint-letters = Di "{ $attribute }" a di leta sekwens noh gud.  Ih mos bee wan leta kombinayshan.

sequence-invalid-endpoint = Di "{ $attribute }" a di sekwens noh gud.

select-from-sequence-coprime-not-numbers = wi pas oava coprime bikaaz wi noh di pik nomba

select-from-sequence-coprime-with-exclude-combinations = wi pas oava coprime bikaaz excludeCombinations se

## Resolving a `target`

target-not-found = Di target fi `<{ $source }>` noh gud: wi kyaahn fain di target.

target-state-variable-not-found = Di target fi `<{ $source }>` noh gud: wi kyaahn fain no stayt verabl naym "{ $property }" pahn wan `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Di verabl dehn a wan `<odeSystem>` mos difrant fahn di indipendent verabl.

ode-system-duplicate-variable-names = Wi kyaahn difain ODE RHS fongshan wid di siem dipendent verabl naym tu taim.

ode-system-rhs-function-error = Wi kyaahn difain di ODE RHS fongshan.  Era wen wi mi di mek di mathjs fongshan.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Wi kyaahn difain wan anggl bitwiin { $count } lain

angle-invalid-through-point = Di paint eena di through a di `<angle>` noh gud

parabola-vertex-too-many-points = Wi noh mek wan parabola wid wan verteks weh goh chruu moa dan 1 paint yet.

parabola-too-many-points = Wi noh mek wan parabola chruu moa dan 3 paint yet.

intersection-too-many-items = Wi noh mek intasekshan fi moa dan tu ting yet

## Other math components

ionic-compound-not-two-ions = Wi noh mek no ayanik kompoun fi notn oada dan tu ayan yet.

ionic-compound-needs-cation-and-anion = Wi mek ayanik kompoun oanli fi wan kayan ahn wan anayan.

solve-equations-cannot-evaluate = Wi kyaahn salv di ikwayshan bikaaz wi kyaahn wok it out: { $equation }

math-operators-operand-number-required = Yu mos se wan operandNumber wen yu di tek out wan mat aparan.

eigen-decomposition-failed = Wi kyaahn wok out di aiganvalyu a di matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: di paramita { $parameters } noh deh eena di patan, soh ih wahn aalwayz mach wan blangk.

## `<graph>`

graph-grid-invalid = `<graph>`: wi kyaahn andastan grid="{ $grid }". Ih mos bee none, medium, dense, ar tu pazitiv nomba wid wan spays bitwiin dehn, laik grid="1 0.5". Wi noh jraa no grid.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` need wan fongshan wid { $expected ->
        [one] wan outpot, di sloap y' da evri paint, laik `y - x`
       *[other] tu outpot, di vekta da evri paint, laik `(y, -x)`
    }, bot di fongshan weh ih get gat { $found } outpot. { $alternative ->
        [none] Wi noh jraa notn.
       *[other] `<{ $alternative }>` da di komponent fi dat fongshan. Wi noh jraa notn.
    }

field-function-attribute-ignored-with-child = Wi pas oava di `function` atribyuut bikaaz di fongshan deh eenside di komponent tu; wi yuuz di wan eenside. Gi di fongshan oanli wan a di tu way.

field-variables-ignored =
    `<{ $component }>`: di `variables` atribyuut naym di verabl a wan expreshan weh rait schrayt eenside di komponent. { $reason ->
        [function-child] Di fongshan yaa gi az wan `<function>` pikni, ahn dat naym ih oan verabl, soh wi pas oava `variables`.
       *[no-expression] No soh expreshan noh deh yaa, soh wi pas oava `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: di prefigure renderer noh sopoat xLabelPosition="left"; wi wahn du laik right.

prefigure-y-label-position-unsupported = `<graph>`: di prefigure renderer noh sopoat yLabelPosition="bottom"; wi wahn du laik top.

prefigure-invalid-axis-bounds = `<graph>`: di aksis bong dehn noh gud fi di prefigure konvershan; wi wahn yuuz di difalt bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: di widt noh gud fi di prefigure konvershan; wi wahn yuuz di difalt daiagram widt 425.

prefigure-invalid-aspect-ratio = `<graph>`: di aspectRatio noh gud fi di prefigure konvershan; wi wahn yuuz di difalt aspek rayshiyo 1.

prefigure-grid-spacing-too-fine = `<graph>`: di grid spaysin too tait fi di aksis limit dehn; wi lef out di grid eena di prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: wi noh wahn jraa no anotayshan if wi noh di yuuz di PreFigure renderer.

multiple-annotations-children = Wi fain moa dan wan `<annotations>` pikni eena di `<graph>`; wi pas oava aal a dehn seks di laas wan.

## Referring to other components

copy-unrecognized-component-type = Wi kyaahn ekstend ar kapi wan komponent taip weh wi noh noa: { $type }.

copy-prop-not-found = Wi kyaahn fain di prop { $property } pahn wan komponent a taip { $component }

collect-no-source = Wi noh fain no soas fi di collect.

collect-invalid-component-type = Wi kyaahn kalek komponent a taip `<{ $component }>` bikaaz dat noh wan gud komponent taip.

reference-index-unavailable = Wi kyaahn refrans di indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Wi kyaahn kaal { $action } pahn di komponent `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Di dayta shayp noh gud.  Di roa dehn noh di siem lent. Fain eena componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Di dayta gat di siem kalam naym tu taim.  Fain eena componentIdx :{ $componentIdx }

data-frame-missing-column-name = Wan kalam naym mising eena di dayta.  Fain eena componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Wan award fi dis ansa dipen pahn di answer tag ih oan rispans, ahn dat wahn mek ting hapm weh yu noh expek.

answer-max-num-attempts-in-section-wide-check-work = If yu set `maxNumAttempts` pahn wan `<answer>` eenside wan kanteena weh gat `sectionWideCheckWork`, ih noh du notn, bikaaz di kanteena kanchroal di nomba a chrai. Set `maxNumAttempts` pahn di kanteena instead.

nested-section-wide-check-work-max-num-attempts = If yu set `maxNumAttempts` pahn wan kanteena weh gat `sectionWideCheckWork` weh eenside wan neks kanteena weh gat `sectionWideCheckWork`, ih noh du notn, bikaaz di outa kanteena kanchroal di nomba a chrai. Set `maxNumAttempts` pahn di outa kanteena instead.

answer-attributes-need-symbolic-equality = Di { $attributes } atribyuut noh wahn du notn if symbolicEquality noh set.

answer-invalid-type = Di taip fi di ansa noh gud: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Bikaaz di komponent `<{ $component }>` noh gat no naym, wi kyaahn yuuz it fi wan module atribyuut

module-attribute-name-already-defined = Wi kyaahn yuuz di komponent `<{ $component } name="{ $name }">` az wan atribyuut fi wan module bikaaz di `<module>` komponent taip aredi gat wan "{ $name }" atribyuut.

conditional-content-condition-ignored = Di atribyuut `condition` noh kount pahn wan `<conditionalContent>` komponent weh gat case ar else pikni.

slider-markers-type-mismatch = Di maaka taip noh mach di slaida taip.

pretzel-problem-needs-statement-and-answer = Dis pretzel noh gud: evri `<problem>` mos gat wan `<statement>` ahn wan `<answer>`.

pretzel-circuit-first-problem-distractor = Dis pretzel noh gud: eena mode="circuit", di fos `<problem>` kyaahn bee wan dischrakta.

## Attribute values

attribute-invalid-values = Di valyu { $values } fi di atribyuut `{ $attribute }` noh gud; wi pas oava it.

attribute-must-be-references = Di valyu `{ $value }` fi di atribyuut `{ $attribute }` noh gud. Di atribyuut mos mek out a refrans weh staat wid wan `$`.

math-input-invalid-function-names = <mathInput>: wi pas oava fongshan naym weh noh gud eena { $attribute }: { $names }. Evri naym ih displie paat mos gat tu karakta ar moa (leta ar dash); wan `|<mathspeak alternative>` ku fala it if yu waahn.

## Building components from the source

component-type-invalid = Dis komponent taip noh gud: `<{ $componentType }>`

attribute-repeated = Yu kyaahn ripiit di atribyuut { $attribute }.

attribute-invalid-for-component = Di atribyuut "{ $attribute }" noh gud fi wan komponent a taip `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stail definishan { $styleNumber } noh gat nof kantras fi { $context ->
        [text-on-background] di teks kola agens di bakgrong kola
        [high-contrast] di hai-kantras kola agens di kanvas
        [line] di lain kola agens di kanvas
        [marker] di maaka kola agens di kanvas
       *[text-on-canvas] di teks kola agens di kanvas
    }{ $mode ->
        [dark] { " (dark moad)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ih need { $threshold }:1 ar moa).

style-definition-dark-mode-text-background-contrast =
    Chruu stail definishan { $styleNumber } se kola weh gat nof kantras fi light moad, di dark-moad kola weh kom outa dehn noh gat nof kantras fi di teks kola agens di bakgrong kola ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ih need { $threshold }:1 ar moa). { $suggestion ->
        [available] Fi gat nof kantras eena dark moad, eeda mek di light-moad kantras moa (fi egzampl, set { $lightAttribute }="{ $lightColor }") ar oavarait di dark-moad kola (fi egzampl, set { $darkAttribute }="{ $darkColor }").
       *[none] Fi gat nof kantras eena dark moad, mek di light-moad kantras moa ar oavarait di kola dehn wid textColorDarkMode ahn/ar backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Chruu stail definishan { $styleNumber } se wan teks kola weh gat nof kantras fi light moad, di dark-moad teks kola weh kom outa it noh gat nof kantras agens di kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ih need { $threshold }:1 ar moa). { $suggestion ->
        [available] Fi gat nof kantras eena dark moad, eeda mek di light-moad kantras moa (fi egzampl, set textColor="{ $lightColor }") ar oavarait di dark-moad kola (fi egzampl, set textColorDarkMode="{ $darkColor }").
       *[none] Fi gat nof kantras eena dark moad, mek di light-moad kantras moa ar oavarait di kola wid textColorDarkMode.
    }

section-multiple-style-palettes = Wan sekshan ku pik oanli wan <stylePalette>; wi yuuz di laas wan.

## Unique variants

variant-num-to-select-not-non-negative-integer = wi kyaahn wok out di yuniik varyant a { $component } bikaaz numToSelect noh wan hoal nomba weh noh negativ.

variant-num-to-select-not-constant-number = wi kyaahn wok out di yuniik varyant a { $component } bikaaz numToSelect noh wan kanstant nomba.

variant-with-replacement-not-constant-boolean = wi kyaahn wok out di yuniik varyant a { $component } bikaaz withReplacement noh wan kanstant boolean.

variant-select-weight-disables-unique = Yuniik varyant fi select torn aaf if wan opshan gat selectWeight ar selectForVariants se

variant-coprime-undetermined = wi kyaahn wok out di yuniik varyant a { $component } bikaaz wi kyaahn tel if coprime aalwayz faals.

variant-attribute-not-constant = wi kyaahn wok out di yuniik varyant a { $component } bikaaz { $attribute } noh kanstant.

variant-attribute-not-number = wi kyaahn wok out di yuniik varyant a { $component } bikaaz { $attribute } noh wan nomba.

variant-attribute-wrong-type-for-sequence =
    wi kyaahn wok out di yuniik varyant a { $component } a { $type } taip bikaaz { $attribute } noh { $expected ->
        [letters-combination] wan kombinayshan a leta
        [math-expression] wan gud mat expreshan
        [integer] wan hoal nomba
       *[number] wan nomba
    }.

variant-length-not-integer = wi kyaahn wok out di yuniik varyant a { $component } bikaaz di length noh wan hoal nomba.

variant-sort-not-implemented = wi noh mek yuniik varyant fi wan { $component } wid sort yet

variant-exclude-combinations-not-implemented = wi noh mek yuniik varyant fi wan { $component } wid excludeCombinations yet

variant-math-exclude-not-implemented = wi noh mek yuniik varyant fi wan { $component } a taip math wid exclude yet

variant-non-constant-exclude-not-implemented = wi noh mek yuniik varyant fi wan { $component } wid wan exclude weh noh kanstant yet

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: di graph prefigure renderer noh sopoat dis; wi skip di dishendant.

prefigure-descendant-invalid-geometry = { $subject }: di jiamichri noh finait ar noh komplit; wi skip di dishendant.

prefigure-curve-label-omitted = { $subject }: laybl noh wok pahn kerv weh konvert; wi lef out di laybl.

prefigure-curve-unsupported-definition-type = { $subject }: wi noh sopoat di kerv fongshan definishan taip '{ $definitionType }'; wi skip di dishendant.

prefigure-region-flip-functions-unsupported = { $subject }: wi noh sopoat di flipFunctions atribyuut pahn regionBetweenCurves; wi skip di dishendant.

prefigure-region-non-formula-child = { $subject }: oanli fahmiula-taip pikni fongshan wok pahn regionBetweenCurves; wi skip di dishendant.

prefigure-label-position-unsupported =
    { $subject }: wi noh sopoat labelPosition '{ $labelPosition }' fi wan { $labelKind ->
        [line-family] lain-famili laybl
       *[point] paint laybl
    }; wi yuuz di difalt PreFigure alainmant.

prefigure-fill-style-unsupported = { $subject }: PreFigure noh sopoat di ful stail '{ $fillStyle }'; wi wahn yuuz wan salid ful.

prefigure-line-style-unknown = { $subject }: wi lef out di lain stail '{ $lineStyle }' weh wi noh noa fahn di PreFigure outpot.

prefigure-marker-style-mapped-to-diamond = { $subject }: wi tern di maaka stail '{ $markerStyle }' eena di PreFigure stail 'diamond'.

prefigure-marker-style-unsupported = { $subject }: PreFigure noh sopoat di maaka stail '{ $markerStyle }'; wi yuuz di difalt stail.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: di `ref` noh gud; wi kyaahn fain di target. Wi lef out di anotayshan.

annotation-ref-multiple-targets = `<annotation>`: di `ref` poin tu moa dan wan target; wi yuuz di fos wan.

annotation-ref-outside-graph = `<annotation>`: di `ref` noh gud; di target deh outside a di graph. Wi lef out di anotayshan.

annotation-ref-unsupported-target = `<annotation>`: di `ref` noh gud; di target noh wan grafikal ting weh di prefigure konvershan sopoat. Wi lef out di anotayshan.

annotation-text-missing = `<annotation>`: di `text` mising ar emti; wi wahn put out emti teks.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Wi fain wan serkl dipendensi.
       *[other] Wi fain wan serkl dipendensi weh involv wan `<{ $componentType }>` komponent.
    }

reference-no-referent = Wi noh fain notn weh dis refrans di poin tu: `{ $reference }`

reference-multiple-referents = Wi fain moa dan wan ting weh dis refrans di poin tu: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Di fahmat fi di atribyuut { $attribute } a `<{ $componentType }>` noh gud.

children-invalid = Di pikni fi `<{ $componentType }>` noh gud: wi fain pikni weh noh gud: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Di valyu `{ $value }` fi di atribyuut `{ $attribute }` noh gud, soh wi yuuz di valyu `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Wi noh fain DoenetML vershan { $version }.
       *[other] Wi noh fain DoenetML vershan { $version }. Wi wahn yuuz vershan { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Dis DoenetML noh gud: { $content }

parse-tag-missing-close-tag = Dis DoenetML noh gud: Di tag `{ $tag }` noh gat no kloazin tag. Wi expek wan tag weh kloaz ihself ar wan `</{ $tagName }>` tag.

parse-tag-error = Dis DoenetML noh gud: Era eena di tag `<{ $tagName }>`

parse-attribute-missing-value = Dis DoenetML noh gud: Di atribyuut `{ $attribute }` noh gud — luk laik ih mising wan valyu.

parse-attribute-invalid = Dis DoenetML noh gud: Di atribyuut `{ $attribute }` noh gud

parse-attribute-value-invalid = Dis DoenetML noh gud: Di atribyuut valyu `{ $value }` noh gud

parse-attribute-value-quote-mismatch = Dis DoenetML noh gud: Di atribyuut valyu `{ $value }` noh gud. Di koat maak noh mach. Luk laik yu mising wan `{ $quote }`

parse-open-tag-name-missing = Dis DoenetML noh gud: Wi fain wan tag widoutn no tag naym, laik `<`

parse-tag-not-closed = Dis DoenetML noh gud: Di tag `{ $tag }` noh kloaz (luk laik wan `>` mising).

parse-self-closing-tag-name-missing = Dis DoenetML noh gud: Wi fain wan tag widoutn no tag naym `<{ $content }>`

parse-self-closing-tag-not-closed = Dis DoenetML noh gud: Di tag `{ $tag }` noh kloaz (luk laik `/>` mising).

parse-tag-invalid-attributes = Dis DoenetML noh gud: Di tag `{ $tag }` noh gud. Ih mait gat rang atribyuut.

parse-close-tag-name-missing = Dis DoenetML noh gud: Wi fain wan kloazin tag widoutn no tag naym, laik `</`

parse-attribute-value-unquoted = Atribyuut valyu mos deh eena koat maak: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Dis DoenetML noh gud: Wi fain di kloazin tag `{ $tag }`, bot no oapnin tag noh deh fi it

parse-close-tag-mismatched = Dis DoenetML noh gud: Di kloazin tag noh mach. Wi mi expek `</{ $expected }>`. Wi fain `{ $found }`

parser-node-unconvertible = Wi kyaahn konvert di noad { $node } eena wan Dast noad.

## Names

name-attribute-invalid =
    Di atribyuut name='{ $name }' noh gud. { $reason ->
        [characters] Naym ku gat oanli leta, nomba, ondaskoa ar haifn.
       *[start] Naym mos staat wid wan leta.
    }

component-name-invalid-start = Di komponent naym "{ $name }" noh gud. Naym mos staat wid wan leta.

## `<answer>` sugar

answer-video-watched-missing-video = Wan answer a taip videoWatched mos gat wan video atribyuut

answer-video-watched-video-not-reference = Wan answer a taip videoWatched mos gat wan video atribyuut weh da wan refrans

answer-name-not-single-text = Di answer name atribyuut mos gat jos wan teks pikni

## Referencing another document

external-doenetml-recursion-limit = Wi kyaahn get di eksternal DoenetML bikaaz too moch levl a rikershan. Yu tink wan serkl refrans deh?

external-doenetml-unavailable = Wi kyaahn get no DoenetML fahn { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Di DoenetML weh wi get fahn { $attribute }="{ $uri }" noh gud: ih noh mach di komponent taip "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Di atribyuut `{ $from }` doan yuuz noh moa; yuuz `{ $to }` instead.
       *[other] [deprecation] Di atribyuut `{ $from }` pahn `<{ $component }>` doan yuuz noh moa; yuuz `{ $to }` instead.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Di atribyuut `{ $from }` doan yuuz noh moa ahn ih noh kount bikaaz `{ $to }` se tu.
       *[other] [deprecation] Di atribyuut `{ $from }` pahn `<{ $component }>` doan yuuz noh moa ahn ih noh kount bikaaz `{ $to }` se tu.
    }

deprecated-attribute-ignored = [deprecation] Di atribyuut `{ $attribute }` pahn `<{ $component }>` doan yuuz noh moa ahn ih noh kount.

deprecated-attribute-to-child = [deprecation] Di atribyuut `{ $attribute }` pahn `<{ $component }>` doan yuuz noh moa; yuuz wan `<{ $child }>` pikni instead.

deprecated-attribute-value-renamed = [deprecation] Di valyu `{ $value }` a di atribyuut `{ $attribute }` pahn `<{ $component }>` doan yuuz noh moa; yuuz `{ $to }` instead.


## Language coverage

pluralize-english-only = `<pluralize>` ku pluralaiz oanli Inglish, soh ih teks tan siem eena wan dakiument weh rait eena { $locale }. Rait di plural fahm schrayt, ar set it wid di `pluralForm` atribyuut.


## Checking against the schema

schema-element-unrecognized = Di eliment `<{ $tag }>` noh wan Doenet eliment weh wi noa.

schema-element-not-allowed-at-root = Di eliment `<{ $tag }>` kyaahn deh da di ruut a di dakiument.

schema-element-not-allowed-inside = Di eliment `<{ $tag }>` kyaahn deh eenside a `<{ $parent }>`.

schema-attribute-unrecognized = Di eliment `<{ $tag }>` noh gat no atribyuut naym `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Di atribyuut `{ $attribute }` a di eliment `<{ $tag }>` mos bee wan lis weh evri aitem da wan a dehn ya: { $allowed }
       *[other] Di atribyuut `{ $attribute }` a di eliment `<{ $tag }>` mos bee wan a dehn ya: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Di varyant naym fi di select noh gud.  Di varyant naym { $variantName } shoa op eena { $numOptions } opshan bot di nomba fi pik da { $numToSelect }.

select-variant-name-without-options = Som varyant se fi di select bot no opshan noh se fi di varyant naym: { $variantName }.

select-variant-name-not-possible = Di varyant naym { $variantName } weh se fi di select noh wan varyant naym weh ku hapm.

select-too-few-options = Wi kyaahn pik { $numToSelect } komponent outa oanli { $numOptions }.

select-from-sequence-too-few-values = Wi kyaahn pik { $numToSelect } valyu outa wan sekwens a lent { $length }.

select-from-sequence-indices-count-mismatch = Di nomba a indices weh se fi di select mos mach di nomba fi pik

select-from-sequence-indices-not-integers = Aal di indices weh se fi di select mos bee hoal nomba

select-from-sequence-index-excluded = Wan indeks a selectfromsequence se weh mi ekskluud

select-from-sequence-indices-excluded-combination = Indices a selectfromsequence se weh mi wan ekskluud kombinayshan

select-from-sequence-coprime-not-positive-integers = Wi kyaahn pik koaprime kombinayshan bikaaz wi noh di pik pazitiv hoal nomba.

select-from-sequence-coprime-common-factor = Wi kyaahn pik koaprime nomba. Aal di valyu dehn shier wan koman fakta. (Di valyu weh se fi "from" ar "to" mos bee koaprime wid "step".)

select-from-sequence-coprime-single-number = Wi kyaahn pik koaprime kombinayshan outa wan singl nomba weh noh 1.

select-from-sequence-excluded-too-many-combinations = Moa dan 70% a di kombinayshan eena selectFromSequence mi ekskluud

select-from-sequence-coprime-none-found = Wi noh mi ku pik koaprime nomba. Aal di valyu dehn shier wan koman fakta.

select-from-sequence-too-few-unique-values = Wi kyaahn pik { $numToSelect } yuniik valyu outa wan sekwens a lent { $numPossibleValues }

select-prime-numbers-too-few-values = Wi kyaahn pik { $numToSelect } valyu outa wan lis a praim nomba a lent { $numValues }

select-prime-numbers-values-count-mismatch = Di nomba a valyu weh se fi di select mos mach di nomba fi pik

select-prime-numbers-values-not-prime = Aal di valyu weh se fi select praim nomba mos deh eena di lis a praim nomba

select-prime-numbers-values-excluded-combination = Di valyu a selectPrimeNumbers weh se mi wan ekskluud kombinayshan

select-prime-numbers-excluded-too-many-combinations = Moa dan 70% a di kombinayshan eena selectPrimeNumbers mi ekskluud

select-random-combination-fluke = Bai wan chaans weh haadli evah hapm, wi noh mi ku pik wan kombinayshan a randam valyu

select-random-value-fluke = Bai wan chaans weh haadli evah hapm, wi noh mi ku pik wan randam valyu

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    Wi noh jraa di `<{ $component }>` eenside di mat; wi taipset di expreshan laik how ih mi bee bifoa inpot mi ku goh eenside. { $reason ->
        [not-inline] Oanli wan `inline` chais inpot fit eenside wan expreshan; widoutn `inline` ih da wan blak a botn.
        [expanded] Wan `expanded` teks inpot da wan baks wid moa dan wan lain, ahn dat too big fi sidong eenside wan expreshan.
        [on-graph] Pahn wan graph, wi jraa di expreshan az wan singl pikcha, ahn dat noh gat no ruum fi wan kanchroal.
       *[relative-width] Ih `width` da relativ (wan persent ar `em`), ahn dat noh gat notn fi mezha agens eenside wan expreshan. Gi di widt eena abzalut yuunit, laik `px`, instead.
    }
