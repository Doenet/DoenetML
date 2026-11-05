# Wakhi (Xik zik) diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
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
# **Orthography.** The Latin practice of Pakistan, in the plain diacritic-free
# form `chrome.ftl`'s header sets out in full — basic Latin letters plus the
# digraphs `sh ch zh kh gh th dh ts ng`, and none of the diacritics a fuller
# Wakhi Latin uses. Wakhi's other live orthography is the **Cyrillic of
# Tajikistan**; a reader there, in Afghanistan or in Xinjiang may not
# recognize these spellings. **No Cyrillic and no Perso-Arabic anywhere.**
# Converting the catalog means converting all four files at once, and changing
# the loans' source language from Urdu/English to Tajik/Russian along with it.
#
# **The frames.** This file is 220 sentences built out of a dozen recurring
# frames, and reading the frames is the fastest way to review it:
#
#     … nazarandoz.        it is ignored
#     … namumkin.          cannot / is impossible
#     … zarur.             must / is required
#     Ghalat …             invalid …
#     … peydo nast.        not found
#     … nast.              there is no …
#     … yast.              there is …
#     … asar nast.         has no effect
#     … barobar nast.      does not match
#     … hanuz tayor nast.  has not been implemented
#     chunki …             because …
#     … iste'mol.          … is used
#
# Every action is the single verb **«tsar-»** ('to do') after a loan noun, the
# infinitive is written **«tsarn»**, and the sentences are **verbless nominal
# predications** — a speaker should supply the copula. Word order is
# verb-final, modifiers precede their head, and the postpositions are «-ir»
# (to, for) and «-dar» (in, on). Both are invariant, so this file does write
# them against a placeable — `{ $component }-ir`, `{ $componentIdx }-dar` —
# which is adjacency rather than agreement; see `chrome.ftl`'s header.
#
# **Counting.** CLDR has no plural data for `wbl`, so `Intl.PluralRules` would
# resolve it against the runtime's default locale, and a noun after a numeral
# is unmarked in Wakhi in any case. Every counted message here therefore
# writes a **single `*[other]`** branch rather than two identical ones. No
# `[zero]`, `[two]`, `[few]` or `[many]` branch appears anywhere.
#
# **Loans.** The technical nouns are English throughout — `line`, `point`,
# `vector`, `circle`, `function`, `domain`, `interval`, `input`, `output`,
# `sequence`, `matrix`, `component`, `attribute`, `value`, `type`, `variable`,
# `index`, `pattern`, `label`, `grid`, `renderer`, `accessibility`,
# `contrast`, `style`, `variant`, `reference`, `column`, `row`, `data`, and
# the PreFigure vocabulary. The abstract vocabulary between them is Urdu and
# Persian: «ghalat», «ghalati», «nazarandoz», «namumkin», «zarur», «ta'yin»
# (specified), «peydo» (found), «barobar» (equal), «hisob» (calculation),
# «hushdor», «ma'lumot», «tamom» (all), «bisyor» (many), «kam» (few),
# «ziyot» (more), «dubora» (again), «har» (each), «faqat» (only), «lekin»
# (but), «chunki» (because), «hanuz» (yet), «nomalum» (undetermined).
# What is Wakhi is the frame around them.


## `<lineSegment>`

# $attributes is a list of attribute names; $attributesCount is its length.
line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] Buy endpoint ta'yin, yaw waqt { $attributes } nazarandoz.
    }

# $attributes is a list of attribute names; $attributesCount is its length.
line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] Endpoint at midpoint har buy ta'yin, yaw waqt { $attributes } nazarandoz.
    }

line-segment-midpoint-offset-without-midpoint = midpoint nast, midpointOffset asar nast


## `<line>`

line-points-undetermined-dimensions = Nomalum dimension point-dar khat.

line-points-too-few-dimensions = Khat kam az kam buy dimension point-dar zarur.

# $variables is a bare enumeration of variable names, not an "and" list.
line-points-depend-on-variables = Khat yem variable-ir bogh point-dar: { $variables }.

line-equation-invalid-format = { $variable1 } at { $variable2 } variable-dar khat equation-ir ghalat format.


## `<ray>`

ray-overprescribed-through = Ray through, endpoint at direction-en ta'yin.  Ta'yin shuda through nazarandoz.

ray-dimension-mismatch = Ray-dar numDimensions barobar nast.


## `<vector>`

vector-overprescribed-head = Vector head, tail at displacement-en ta'yin.  Ta'yin shuda head nazarandoz.

vector-dimension-mismatch = Vector-dar numDimensions barobar nast.


## Attracting and constraining

# $component is the DoenetML tag of the child that was named.
attract-to-without-nearest-point = `<{ $component }>`-ir attract namumkin, chunki yaw-dar nearestPoint state variable nast.

constrain-to-without-nearest-point = `<{ $component }>`-ir constrain namumkin, chunki yaw-dar nearestPoint state variable nast.

constrain-to-interior-without-nearest-point = `<{ $component }>`-i andarun-ir constrain namumkin, chunki yaw-dar nearestPoint state variable nast.


## `<choiceInput>`

choice-input-label-position-ignored = non-inline choiceInput-ir labelPosition nazarandoz


## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-ir ta'yin shuda indices nazarandoz, chunki indices at choice child tadod barobar nast.

pretzel-indices-count-mismatch = problem-ir ta'yin shuda indices nazarandoz, chunki indices at problem child tadod barobar nast.

shuffle-indices-count-mismatch = shuffle-ir ta'yin shuda indices nazarandoz, chunki indices at component tadod barobar nast.

# $component is `choiceInput`, `pretzel` or `shuffle` — a DoenetML component
# name, so it stays in English.
indices-ignored-out-of-range = { $component }-ir ta'yin shuda indices nazarandoz, chunki tsond index had-i tashqor.

pretzel-indices-repeated = pretzel-ir ta'yin shuda indices nazarandoz, chunki tsond index dubora.

pretzel-circuit-first-index = circuit mode-dar pretzel-ir ta'yin shuda indices nazarandoz, chunki awwalin index 1 zarur.


## Types

string-children-need-type = `<{ $component }>` string child-en kor tsarn-ir `type` attribute zarur.

invalid-type-defaulting-to-math = { $component } component-ir ghalat type { $type }. math, text, number yo boolean az yiw zarur. math iste'mol.

string-not-valid-component-to-arrange = "{ $value }" string { $component }-ir drust component nast. Nazarandoz.

invalid-type-defaulting-to-number = Ghalat type { $type }, type number tanzim.

invalid-variable-value = Variable-i ghalat value: `{ $value }`

variant-index-must-be-number = Variant index { $index } number zarur

variant-index-must-be-integer = Variant index { $index } integer zarur


## Layout

side-by-side-absolute-widths = `<{ $component }>` absolute andoza-ir hanuz tayor nast. Width relative tanzim.

side-by-side-absolute-margins = `<{ $component }>` absolute andoza-ir hanuz tayor nast. Margin relative tanzim.

side-by-side-no-block-child = Ghalat `<{ $component }>`: kam az kam yiw block child zarur.


## `<label>`

label-for-ignored-on-graphical = Graphical `<label>`-dar `for` attribute nazarandoz.

label-for-must-resolve-to-one = `<label>`-dar `for` attribute faqat yiw component-ir hal zarur.

label-for-unresolved = `<label>`-dar `for` attribute yiw component-ir hal namumkin.

label-for-answer-with-authored-inputs = `<label>`-dar `for` attribute yem `<answer>`-ir reference, yaw-dar author-i niwishta input yast; input-ir sida reference tsar.

label-for-answer-without-input = `<label>`-dar `for` attribute yem `<answer>`-ir reference, lekin label-ir input nast.

label-for-must-reference-input-or-answer = `<label>`-dar `for` attribute input yo answer-ir reference zarur.


## Accessibility

accessibility-short-description-or-decorative = Accessibility-ir `<{ $component }>`-dar kotoh tafsil yo decorative ta'yin zarur.

accessibility-video-short-description = Accessibility-ir `<video>`-dar kotoh tafsil zarur.

accessibility-input-short-description-or-label = Accessibility-ir `<{ $component }>`-dar kotoh tafsil yo label zarur.

accessibility-answer-input-short-description-or-label = Accessibility-ir input tsart `<answer>`-dar kotoh tafsil yo label zarur.

accessibility-short-description-contains-math = Kotoh tafsil-dar `<{ $component }>` barin math component na zarur. Math tamom lafz-en niwis.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName }-dar section heading text-ir kofi contrast nast (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kam az kam { $threshold }:1 zarur).
       *[other] { $colorName }-dar section heading text-ir kofi contrast nast ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kam az kam { $threshold }:1 zarur).
    }


## `<circle>`

circle-through-points-non-numerical = { $count } point-dar `<circle>`, at point-dar number value nast — yem hol hanuz tayor nast.

circle-too-many-through-points = 3 az ziyot point-dar doira hisob namumkin.

circle-overprescribed-radius-center-points = Ta'yin shuda radius, center at through point-en doira hisob namumkin.

circle-center-with-multiple-points = Ta'yin shuda center at 1 az ziyot point-dar doira hisob namumkin.

circle-radius-too-small = Doira hisob namumkin: buy point-i miyon masofa { $distance }, at ta'yin shuda radius { $radius } bisyor kam.

circle-radius-with-many-points = Ta'yin shuda radius-en buy az ziyot point-dar doira tsarn namumkin.

circle-invalid-center-or-through-points = Doira-i ghalat center yo through point.

circle-radius-center-with-multiple-points = Ta'yin shuda center at 1 az ziyot point-dar doira radius hisob namumkin.

circle-change-radius-non-numerical = Number value nast through point-en doira radius badal namumkin

circle-radius-with-points-non-numerical = Number value nast, yaw waqt ta'yin shuda radius-en yiw az ziyot point-dar doira tsarn namumkin.

circle-change-center-non-numerical = Number value nast point-dar doira center badal tsarn hanuz tayor nast.


## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] Function domain-ir dimension kam. Domain-dar { $intervals } interval, lekin function-dar { $inputs ->
           *[other] { $inputs } input
        }.
    }

function-domain-invalid-format = Function domain-ir ghalat format.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Function-i number nast maximum nazarandoz.
        [minimum] Function-i number nast minimum nazarandoz.
        [extremum] Function-i number nast extremum nazarandoz.
        [point] Function-i number nast point nazarandoz.
        [slope] Function-i number nast slope nazarandoz.
       *[other] Function-i number nast { $type } nazarandoz.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Function-i kholi maximum nazarandoz.
        [minimum] Function-i kholi minimum nazarandoz.
        [extremum] Function-i kholi extremum nazarandoz.
        [point] Function-i kholi point nazarandoz.
       *[other] Function-i kholi { $type } nazarandoz.
    }

function-points-too-close = Function-dar buy point-i jay bisyor nizd. Function ta'rif namumkin.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] Function iterate faqat yaw waqt mumkin, agar input at output tadod barobar. Yem function-dar { $inputs } input at { $outputs ->
           *[other] { $outputs } output
        }.
    }


## `<sequence>` and `<selectFromSequence>`

sequence-invalid-length = Sequence-i ghalat length.  Manfi nast integer zarur.

sequence-invalid-step = Sequence-i ghalat step.  { $type } type sequence-ir number zarur.

sequence-invalid-endpoint-number = Number sequence-i ghalat "{ $attribute }".  Number zarur.

sequence-invalid-endpoint-letters = Letters sequence-i ghalat "{ $attribute }".  Harf-i jur zarur.

sequence-invalid-endpoint = Sequence-i ghalat "{ $attribute }".

select-from-sequence-coprime-not-numbers = coprime nazarandoz, chunki number intikhob nast

select-from-sequence-coprime-with-exclude-combinations = coprime nazarandoz, chunki excludeCombinations ta'yin


## References and targets

target-not-found = `<{ $source }>`-ir ghalat target: target peydo nast.

target-state-variable-not-found = `<{ $source }>`-ir ghalat target: `<{ $component }>`-dar "{ $property }" nung state variable peydo nast.


## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-i variable independent variable az digar zarur.

ode-system-duplicate-variable-names = Yiw barin dependent variable nung-en ODE RHS function ta'rif namumkin.

ode-system-rhs-function-error = ODE RHS function ta'rif namumkin.  mathjs function tsarn-dar ghalati.


## Other geometry

angle-too-many-lines = { $count } khat-i miyon angle ta'rif namumkin

angle-invalid-through-point = `<angle>`-i through-dar ghalat point

parabola-vertex-too-many-points = Vertex at 1 az ziyot point-dar parabola hanuz tayor nast.

parabola-too-many-points = 3 az ziyot point-dar parabola hanuz tayor nast.

intersection-too-many-items = Buy az ziyot item-ir intersection hanuz tayor nast


## Chemistry

ionic-compound-not-two-ions = Buy ion az digar chiz-ir ionic compound hanuz tayor nast.

ionic-compound-needs-cation-and-anion = Ionic compound faqat yiw cation at yiw anion-ir tayor.


## Mathematics

solve-equations-cannot-evaluate = Equation hal namumkin, chunki equation hisob namumkin: { $equation }

math-operators-operand-number-required = Math operand kashn-ir operandNumber ta'yin zarur.

eigen-decomposition-failed = Matrix-i eigenvalue hisob namumkin

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: { $parameters } parameter pattern-dar nast, yaw sababi yaw hamesha kholi-ir match.
    }


## `<graph>` and fields

graph-grid-invalid = `<graph>`: grid="{ $grid }" fahm namumkin. none, medium, dense yo yiw jay-en juda buy musbat number zarur, misol grid="1 0.5". Grid na kashn.

field-function-wrong-num-outputs =
    `<{ $component }>`-ir yem function zarur: { $expected ->
        [one] yiw output, har point-dar y' slope, misol `y - x`
       *[other] buy output, har point-dar vector, misol `(y, -x)`
    }, lekin dodi shuda function-dar { $found ->
       *[other] { $found } output
    }. { $alternative ->
        [none] Chiz na kashn.
       *[other] Yaw function-ir `<{ $alternative }>` component. Chiz na kashn.
    }

field-function-attribute-ignored-with-child = `function` attribute nazarandoz, chunki function component-i andarun ham dodi; andarun-i iste'mol. Function faqat yiw roh-en dod.

field-variables-ignored =
    `<{ $component }>`: `variables` attribute component-i andarun sida niwishta expression-i variable nung tsart. { $reason ->
        [function-child] Dram function `<function>` child barin dodi, at yaw-i variable yaw sida nung tsart, yaw sababi `variables` nazarandoz.
       *[no-expression] Dram yaw barin expression nast, yaw sababi `variables` nazarandoz.
    }


## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure renderer-dar xLabelPosition="left" tayor nast; right-position amal iste'mol.

prefigure-y-label-position-unsupported = `<graph>`: prefigure renderer-dar yLabelPosition="bottom" tayor nast; top-position amal iste'mol.

prefigure-invalid-axis-bounds = `<graph>`: prefigure badal-ir ghalat axis bound; default bbox (-10,-10,10,10) iste'mol.

prefigure-invalid-width = `<graph>`: prefigure badal-ir ghalat width; default diagram width 425 iste'mol.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure badal-ir ghalat aspectRatio; default aspect ratio 1 iste'mol.

prefigure-grid-spacing-too-fine = `<graph>`: axis had-ir grid spacing bisyor borik; prefigure renderer-dar grid nazarandoz.

prefigure-annotations-not-rendered = `<graph>`: PreFigure renderer nast, yaw waqt annotation na kashn.

multiple-annotations-children = `<graph>`-dar bisyor `<annotations>` child peydo; okhirin az digar tamom nazarandoz.


## Copying and collecting

copy-unrecognized-component-type = Nomalum component type extend yo copy namumkin: { $type }.

copy-prop-not-found = { $component } type component-dar { $property } prop peydo nast

collect-no-source = collect-ir source peydo nast.

collect-invalid-component-type = `<{ $component }>` type component collect namumkin, chunki yaw ghalat component type.

reference-index-unavailable = `{ $reference }` index reference namumkin

component-action-unavailable = `{ $reference }` component-dar { $action } sadaw namumkin


## Data frames

data-frame-inconsistent-row-lengths = Data-i shakl ghalat.  Row-i length barobar nast. componentIdx :{ $componentIdx }-dar peydo

data-frame-duplicate-column-names = Data-dar yiw barin column nung.  componentIdx :{ $componentIdx }-dar peydo

data-frame-missing-column-name = Data-dar yiw column nung nast.  componentIdx :{ $componentIdx }-dar peydo


## `<answer>`

answer-award-depends-on-own-response = Yem answer-i award answer tag-i sida ravon shuda jawab-dar bogh, at yaw nomalum amal-ir sabab.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` yast container-i andarun `<answer>`-dar `maxNumAttempts` tanzim asar nast, chunki koshish tadod container-en tanzim. `maxNumAttempts` container-dar tanzim tsar.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` yast container digar `sectionWideCheckWork` container-i andarun, yaw-dar `maxNumAttempts` tanzim asar nast, chunki koshish tadod tashqori container-en tanzim. `maxNumAttempts` tashqori container-dar tanzim tsar.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] symbolicEquality tanzim nast, { $attributes } attribute-i asar nast.
    }

answer-invalid-type = Answer-ir ghalat type: { $type }


## `<module>`

module-attribute-child-needs-name = `<{ $component }>` component-dar nung nast, yaw sababi yaw module attribute-ir iste'mol namumkin

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` component module-ir attribute barin iste'mol namumkin, chunki `<module>` component type-dar "{ $name }" attribute pesh az yem ta'rif.


## Conditional content, sliders, pretzels

conditional-content-condition-ignored = case yo else child yast `<conditionalContent>` component-dar `condition` attribute nazarandoz.

slider-markers-type-mismatch = Marker type at slider type barobar nast.

pretzel-problem-needs-statement-and-answer = Ghalat pretzel: har `<problem>`-dar yiw `<statement>` at yiw `<answer>` zarur.

pretzel-circuit-first-problem-distractor = Ghalat pretzel: mode="circuit"-dar awwalin `<problem>` distractor na wost.


## Attributes

attribute-invalid-values =
    { $valuesCount ->
       *[other] `{ $attribute }` attribute-ir ghalat value { $values }; nazarandoz.
    }

attribute-must-be-references = `{ $attribute }` attribute-ir ghalat value `{ $value }`. Attribute `$`-en shuru tsart reference-en jur zarur.

math-input-invalid-function-names = <mathInput>: { $attribute }-dar ghalat function nung nazarandoz: { $names }. Har nung-i display hissa kam az kam 2 harf (harf yo dash) zarur; ba'd yaw ikhtiyori `|<mathspeak alternative>` mumkin.

component-type-invalid = Ghalat component type: `<{ $componentType }>`

attribute-repeated = { $attribute } attribute dubora namumkin.

attribute-invalid-for-component = `<{ $componentType }>` type component-ir ghalat attribute "{ $attribute }".


## Style definitions

style-definition-insufficient-contrast =
    Style definition { $styleNumber }-dar { $context ->
        [text-on-background] background color-i muqobil text color
        [high-contrast] canvas-i muqobil high-contrast color
        [line] canvas-i muqobil line color
        [marker] canvas-i muqobil marker color
       *[text-on-canvas] canvas-i muqobil text color
    }-ir kofi contrast nast{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kam az kam { $threshold }:1 zarur).

style-definition-dark-mode-text-background-contrast =
    Style definition { $styleNumber }-dar ta'yin shuda color light mode-ir kofi contrast dodi, lekin yaw value-az kashta dark-mode color-dar background color-i muqobil text color-ir kofi contrast nast ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kam az kam { $threshold }:1 zarur). { $suggestion ->
        [available] Dark mode-dar kofi contrast-ir yo light-mode contrast ziyot tsar (misol { $lightAttribute }="{ $lightColor }" tanzim), yo dark-mode color badal tsar (misol { $darkAttribute }="{ $darkColor }" tanzim).
       *[none] Dark mode-dar kofi contrast-ir light-mode contrast ziyot tsar, yo kashta color textColorDarkMode at/yo backgroundColorDarkMode-en badal tsar.
    }

style-definition-dark-mode-text-canvas-contrast =
    Style definition { $styleNumber }-dar ta'yin shuda text color light mode-ir kofi contrast dodi, lekin yaw value-az kashta dark-mode text color-ir canvas-i muqobil kofi contrast nast ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kam az kam { $threshold }:1 zarur). { $suggestion ->
        [available] Dark mode-dar kofi contrast-ir yo light-mode contrast ziyot tsar (misol textColor="{ $lightColor }" tanzim), yo dark-mode color badal tsar (misol textColorDarkMode="{ $darkColor }" tanzim).
       *[none] Dark mode-dar kofi contrast-ir light-mode contrast ziyot tsar, yo kashta color textColorDarkMode-en badal tsar.
    }

section-multiple-style-palettes = Yiw section faqat yiw <stylePalette> intikhob tsart; okhirin iste'mol.


## Unique variants

variant-num-to-select-not-non-negative-integer = { $component }-i yagona variant ta'yin namumkin, chunki numToSelect manfi nast integer nast.

variant-num-to-select-not-constant-number = { $component }-i yagona variant ta'yin namumkin, chunki numToSelect sobit number nast.

variant-with-replacement-not-constant-boolean = { $component }-i yagona variant ta'yin namumkin, chunki withReplacement sobit boolean nast.

variant-select-weight-disables-unique = selectWeight yo selectForVariants ta'yin option yast, yaw waqt select-ir yagona variant band

variant-coprime-undetermined = { $component }-i yagona variant ta'yin namumkin, chunki coprime hamesha durugh — yem ta'yin namumkin.

variant-attribute-not-constant = { $component }-i yagona variant ta'yin namumkin, chunki { $attribute } sobit nast.

variant-attribute-not-number = { $component }-i yagona variant ta'yin namumkin, chunki { $attribute } number nast.

variant-attribute-wrong-type-for-sequence =
    { $type } type { $component }-i yagona variant ta'yin namumkin, chunki { $attribute } yem nast: { $expected ->
        [letters-combination] harf-i jur
        [math-expression] drust math expression
        [integer] integer
       *[number] number
    }.

variant-length-not-integer = { $component }-i yagona variant ta'yin namumkin, chunki length integer nast.

variant-sort-not-implemented = sort yast { $component }-i yagona variant hanuz tayor nast

variant-exclude-combinations-not-implemented = excludeCombinations yast { $component }-i yagona variant hanuz tayor nast

variant-math-exclude-not-implemented = exclude yast math type { $component }-i yagona variant hanuz tayor nast

variant-non-constant-exclude-not-implemented = sobit nast exclude yast { $component }-i yagona variant hanuz tayor nast


## PreFigure descendants

prefigure-descendant-unsupported = { $subject }: graph prefigure renderer-dar tayor nast; descendant nazarandoz.

prefigure-descendant-invalid-geometry = { $subject }: geometry nomahdud yo notamom; descendant nazarandoz.

prefigure-curve-label-omitted = { $subject }: badal shuda curve element-dar label tayor nast; label nazarandoz.

prefigure-curve-unsupported-definition-type = { $subject }: curve function definition type '{ $definitionType }' tayor nast; descendant nazarandoz.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves-dar flipFunctions attribute tayor nast; descendant nazarandoz.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves-dar faqat formula type child function tayor; descendant nazarandoz.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] line-family label
       *[point] point label
    }-ir labelPosition '{ $labelPosition }' tayor nast; default PreFigure alignment iste'mol.

prefigure-fill-style-unsupported = { $subject }: fill style '{ $fillStyle }' PreFigure-dar tayor nast; solid fill iste'mol.

prefigure-line-style-unknown = { $subject }: nomalum line style '{ $lineStyle }' PreFigure output-az nazarandoz.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker style '{ $markerStyle }' PreFigure style 'diamond'-ir badal.

prefigure-marker-style-unsupported = { $subject }: marker style '{ $markerStyle }' PreFigure-dar tayor nast; default style iste'mol.


## `<annotation>`

annotation-ref-unresolvable = `<annotation>`: ghalat `ref`; target hal namumkin. Annotation nazarandoz.

annotation-ref-multiple-targets = `<annotation>`: `ref` bisyor target-ir hal; awwalin target iste'mol.

annotation-ref-outside-graph = `<annotation>`: ghalat `ref`; target graph-i tashqor. Annotation nazarandoz.

annotation-ref-unsupported-target = `<annotation>`: ghalat `ref`; prefigure badal-dar target tayor graphical object nast. Annotation nazarandoz.

annotation-text-missing = `<annotation>`: `text` nast yo kholi; kholi text kashn.


## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Doiragi dependency peydo.
       *[other] `<{ $componentType }>` component-en bogh doiragi dependency peydo.
    }

reference-no-referent = Yem reference-ir referent peydo nast: `{ $reference }`

reference-multiple-referents = Yem reference-ir bisyor referent peydo: `{ $reference }`

children-invalid-attribute-format = `<{ $componentType }>`-i { $attribute } attribute-ir ghalat format.

children-invalid = `<{ $componentType }>`-ir ghalat child: ghalat child peydo: { $children }

attribute-value-invalid-using-default = `{ $attribute }` attribute-ir ghalat value `{ $value }`, `{ $default }` value iste'mol


## DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML version { $version } peydo nast.
       *[other] DoenetML version { $version } peydo nast. Version { $fallback } iste'mol
    }


## Parsing

parse-invalid-doenetml = Ghalat DoenetML: { $content }

parse-tag-missing-close-tag = Ghalat DoenetML: `{ $tag }` tag-dar band tag nast. Sida band tsart tag yo `</{ $tagName }>` tag zarur.

parse-tag-error = Ghalat DoenetML: `<{ $tagName }>` tag-dar ghalati

parse-attribute-missing-value = Ghalat DoenetML: ghalat attribute `{ $attribute }`-dar value nast.

parse-attribute-invalid = Ghalat DoenetML: ghalat attribute `{ $attribute }`

parse-attribute-value-invalid = Ghalat DoenetML: ghalat attribute value `{ $value }`

parse-attribute-value-quote-mismatch = Ghalat DoenetML: ghalat attribute value `{ $value }`. Quote nishon barobar nast. Yiw `{ $quote }` nast.

parse-open-tag-name-missing = Ghalat DoenetML: nung nast tag peydo, misol `<`

parse-tag-not-closed = Ghalat DoenetML: `{ $tag }` tag band nast (yiw `>` nast).

parse-self-closing-tag-name-missing = Ghalat DoenetML: nung nast tag peydo `<{ $content }>`

parse-self-closing-tag-not-closed = Ghalat DoenetML: `{ $tag }` tag band nast (`/>` nast).

parse-tag-invalid-attributes = Ghalat DoenetML: `{ $tag }` tag drust nast. Yaw-dar ghalat attribute mumkin.

parse-close-tag-name-missing = Ghalat DoenetML: nung nast band tag peydo, misol `</`

parse-attribute-value-unquoted = Attribute value quote-i andarun zarur: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ghalat DoenetML: `{ $tag }` band tag peydo, lekin yaw-i kusho tag nast

parse-close-tag-mismatched = Ghalat DoenetML: band tag barobar nast. `</{ $expected }>` zarur. `{ $found }` peydo

parser-node-unconvertible = { $node } node Dast node-ir badal namumkin.


## Names

name-attribute-invalid =
    Ghalat attribute name='{ $name }'. { $reason ->
        [characters] Nung-dar faqat harf, number, underscore yo hyphen mumkin.
       *[start] Nung harf-en shuru zarur.
    }

component-name-invalid-start = Ghalat component nung "{ $name }". Nung harf-en shuru zarur.


## Answers with special types

answer-video-watched-missing-video = videoWatched type answer-dar video attribute zarur

answer-video-watched-video-not-reference = videoWatched type answer-i video attribute reference zarur

answer-name-not-single-text = Answer-i name attribute-dar faqat yiw text child zarur


## External DoenetML

external-doenetml-recursion-limit = Bisyor recursion darja sababi tashqori DoenetML kashn namumkin. Doiragi reference yast?

external-doenetml-unavailable = { $attribute }="{ $uri }"-az DoenetML kashn namumkin

external-doenetml-type-mismatch = { $attribute }="{ $uri }"-az kashta DoenetML ghalat: yaw "{ $componentType }" component type-en barobar nast


## Deprecations

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` attribute kuhna; yaw jay-dar `{ $to }` iste'mol tsar.
       *[other] [deprecation] `<{ $component }>`-dar `{ $from }` attribute kuhna; yaw jay-dar `{ $to }` iste'mol tsar.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` attribute kuhna at nazarandoz, chunki `{ $to }` ham ta'yin.
       *[other] [deprecation] `<{ $component }>`-dar `{ $from }` attribute kuhna at nazarandoz, chunki `{ $to }` ham ta'yin.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`-dar `{ $attribute }` attribute kuhna at nazarandoz.

deprecated-attribute-to-child = [deprecation] `<{ $component }>`-dar `{ $attribute }` attribute kuhna; yaw jay-dar `<{ $child }>` child iste'mol tsar.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>`-dar `{ $attribute }` attribute-i `{ $value }` value kuhna; yaw jay-dar `{ $to }` iste'mol tsar.


## `<pluralize>`

pluralize-english-only = `<pluralize>` faqat English-ir kor tsart, yaw sababi { $locale }-dar niwishta document-dar yaw-i text badal nast. Bisyor shakl sida niwis, yo `pluralForm` attribute-en tanzim tsar.


## Schema

schema-element-unrecognized = `<{ $tag }>` element Doenet-i malum element nast.

schema-element-not-allowed-at-root = `<{ $tag }>` element document-i bekh-dar ijozat nast.

schema-element-not-allowed-inside = `<{ $tag }>` element `<{ $parent }>`-i andarun ijozat nast.

schema-attribute-unrecognized = `<{ $tag }>` element-dar `{ $attribute }` nung attribute nast.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` element-i `{ $attribute }` attribute yem list zarur, at yaw-i har item yem-az yiw: { $allowed }
       *[other] `<{ $tag }>` element-i `{ $attribute }` attribute yem-az yiw zarur: { $allowed }
    }


## `<select>`

select-variant-name-option-count-mismatch = select-ir ghalat variant nung.  Variant nung { $variantName } { $numOptions } option-dar peydo, lekin intikhob tadod { $numToSelect }.

select-variant-name-without-options = select-ir tsond variant ta'yin, lekin mumkin variant nung { $variantName }-ir option ta'yin nast.

select-variant-name-not-possible = select-ir ta'yin shuda variant nung { $variantName } mumkin variant nung nast.

select-too-few-options = Faqat { $numOptions }-az { $numToSelect } component intikhob namumkin.

select-from-sequence-too-few-values = { $length } length sequence-az { $numToSelect } value intikhob namumkin.

select-from-sequence-indices-count-mismatch = select-ir ta'yin shuda indices tadod at intikhob tadod barobar zarur

select-from-sequence-indices-not-integers = select-ir ta'yin shuda tamom indices integer zarur

select-from-sequence-index-excluded = selectfromsequence-i ta'yin shuda index tashqor tsarak

select-from-sequence-indices-excluded-combination = selectfromsequence-i ta'yin shuda indices tashqor tsarak jur

select-from-sequence-coprime-not-positive-integers = Coprime jur intikhob namumkin, chunki musbat integer intikhob nast.

select-from-sequence-coprime-common-factor = Coprime number intikhob namumkin. Tamom mumkin value-dar yiw barin factor. ("from" yo "to"-i ta'yin shuda value "step"-en coprime zarur.)

select-from-sequence-coprime-single-number = 1 nast yiw number-az coprime jur intikhob namumkin.

select-from-sequence-excluded-too-many-combinations = selectFromSequence-dar jur-az 70%-az ziyot tashqor

select-from-sequence-coprime-none-found = Coprime number intikhob namumkin. Tamom mumkin value-dar yiw barin factor.

select-from-sequence-too-few-unique-values = { $numPossibleValues } length sequence-az { $numToSelect } yagona value intikhob namumkin

select-prime-numbers-too-few-values = { $numValues } length prime list-az { $numToSelect } value intikhob namumkin

select-prime-numbers-values-count-mismatch = select-ir ta'yin shuda value tadod at intikhob tadod barobar zarur

select-prime-numbers-values-not-prime = select prime number-ir ta'yin shuda tamom value prime list-dar zarur

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-i ta'yin shuda value tashqor tsarak jur

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-dar jur-az 70%-az ziyot tashqor

select-random-combination-fluke = Bisyor kam mumkin ittifoq sababi random value-i jur intikhob namumkin

select-random-value-fluke = Bisyor kam mumkin ittifoq sababi random value intikhob namumkin


## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` math-i andarun na kashn; expression pesh barin kashn, input andarun tsarn az pesh. { $reason ->
        [not-inline] Faqat `inline` choice input expression-i andarun jay; `inline` nast yaw button-i block.
        [expanded] `expanded` text input bisyor line box, at yaw expression-i andarun-ir bisyor lup.
        [on-graph] Graph-dar expression yiw surat barin kashn, at yaw-dar control-ir jay nast.
       *[relative-width] Yaw-i `width` relative (percentage yo `em`), at expression-i andarun yaw-ir andoza chiz nast. Width absolute andoza-en dod, misol `px`.
    }
