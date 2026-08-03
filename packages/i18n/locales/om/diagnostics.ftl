# Oromo diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
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
# Oromo is postpositional: the word joining a phrase to what it modifies
# follows it. That is why several of these sentences end where the English
# begins.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = tuqaaleen dhumaa lama yeroo ibsaman { $attributes } ni dhiifama

line-segment-attributes-ignored-with-endpoint-and-midpoint = tuqaan dhumaa fi tuqaan giddugaleessaa lamaanuu yeroo ibsaman { $attributes } ni dhiifama

line-segment-midpoint-offset-without-midpoint = midpointOffset tuqaa giddugaleessaa malee dhiibbaa hin qabu

## `<line>`

line-points-undetermined-dimensions = Sararri tuqaalee safarri isaanii hin beekamne keessa darba.

line-points-too-few-dimensions = Sararri tuqaalee yoo xiqqaate safara lama qaban keessa darbuu qaba.

line-points-depend-on-variables = Sararri tuqaalee jijjiiramtootarratti hundaa'an keessa darba: { $variables }.

line-equation-invalid-format = Bifti hiikaa sararaa jijjiiramtoota { $variable1 } fi { $variable2 } keessatti sirrii miti.

## `<ray>`

ray-overprescribed-through = Ifni sararaa through, endpoint fi direction waliin ibsameera. through ibsame ni dhiifama.

ray-dimension-mismatch = numDimensions ifa sararaa keessatti wal hin simu.

## `<vector>`

vector-overprescribed-head = Veektarri head, tail fi displacement waliin ibsameera. head ibsame ni dhiifama.

vector-dimension-mismatch = numDimensions veektara keessatti wal hin simu.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` gara ofitti harkisuun hin danda'amu sababii jijjiiramaa haala nearestPoint jedhamu hin qabneef.

constrain-to-without-nearest-point = `<{ $component }>` irratti daangessuun hin danda'amu sababii jijjiiramaa haala nearestPoint jedhamu hin qabneef.

constrain-to-interior-without-nearest-point = Keessa `<{ $component }>` irratti daangessuun hin danda'amu sababii jijjiiramaa haala nearestPoint jedhamu hin qabneef.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition choiceInput sarara tokko keessa hin jirreef ni dhiifama

## Ordering children by index

choice-input-indices-count-mismatch = Lakkoofsonni choiceInput irratti ibsaman ni dhiifamu sababii baay'inni isaanii baay'ina ijoollee choice waliin hin simneef.

pretzel-indices-count-mismatch = Lakkoofsonni problem irratti ibsaman ni dhiifamu sababii baay'inni isaanii baay'ina ijoollee problem waliin hin simneef.

shuffle-indices-count-mismatch = Lakkoofsonni shuffle irratti ibsaman ni dhiifamu sababii baay'inni isaanii baay'ina kutaalee waliin hin simneef.

indices-ignored-out-of-range = Lakkoofsonni { $component } irratti ibsaman ni dhiifamu sababii tokko tokko daangaan alatti jiraniif.

pretzel-indices-repeated = Lakkoofsonni pretzel irratti ibsaman ni dhiifamu sababii tokko tokko irra deebi'amaniif.

pretzel-circuit-first-index = Lakkoofsonni pretzel haala circuit keessatti ibsaman ni dhiifamu sababii lakkoofsi jalqabaa 1 ta'uu qabuuf.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` ijoollee gosa string waliin akka hojjatuuf, amalli `type` ibsamuu qaba.

invalid-type-defaulting-to-math = type { $type } kutaa { $component } irratti sirrii miti. math, text, number yookaan boolean keessaa tokko ta'uu qaba. math irratti qindaa'aa jira.

string-not-valid-component-to-arrange = String "{ $value }" kutaa sirrii { $component } miti. Ni dhiifama.

## Types and variables

invalid-type-defaulting-to-number = type { $type } sirrii miti, type number irratti qindaa'aa jira.

invalid-variable-value = Gatiin jijjiiramaa sirrii miti: `{ $value }`

## Variants

variant-index-must-be-number = Lakkoofsi gosaa { $index } lakkoofsa ta'uu qaba

variant-index-must-be-integer = Lakkoofsi gosaa { $index } lakkoofsa guutuu ta'uu qaba

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` safara guutuuf hin hojjatamne. Bal'inni walbira-qabbiitti qindaa'aa jira.

side-by-side-absolute-margins = `<{ $component }>` safara guutuuf hin hojjatamne. Daangaan walbira-qabbiitti qindaa'aa jira.

side-by-side-no-block-child = `<{ $component }>` sirrii miti: yoo xiqqaate ilma gosa bloki tokko qabaachuu qaba.

## `<label>`

label-for-ignored-on-graphical = Amalli `for` `<label>` fakkii irratti ni dhiifama.

label-for-must-resolve-to-one = Amalli `for` `<label>` irratti kutaa tokko qofa agarsiisuu qaba.

label-for-unresolved = Amalli `for` `<label>` irratti kutaa kamiyyuu irratti murtaa'uu hin dandeenye.

label-for-answer-with-authored-inputs = Amalli `for` `<label>` irratti `<answer>` galteewwan ifatti barreeffaman qabu agarsiisa; galtee sana kallattiin agarsiisi.

label-for-answer-without-input = Amalli `for` `<label>` irratti `<answer>` galtee mallattoo itti kennamu hin qabne agarsiisa.

label-for-must-reference-input-or-answer = Amalli `for` `<label>` irratti galtee yookaan deebii agarsiisuu qaba.

## Accessibility

accessibility-short-description-or-decorative = Argamummaadhaaf, `<{ $component }>` ibsa gabaabaa qabaachuu qaba yookaan akka miidhagsituutti ibsamuu qaba.

accessibility-video-short-description = Argamummaadhaaf, `<video>` ibsa gabaabaa qabaachuu qaba.

accessibility-input-short-description-or-label = Argamummaadhaaf, `<{ $component }>` ibsa gabaabaa yookaan mallattoo qabaachuu qaba.

accessibility-answer-input-short-description-or-label = Argamummaadhaaf, `<answer>` galtee uumu ibsa gabaabaa yookaan mallattoo qabaachuu qaba.

accessibility-short-description-contains-math = Ibsi gabaabaan kutaalee herregaa akka `<{ $component }>` qabaachuu hin qabu. Herrega kamiyyuu jechaan ibsi.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } barreeffama mata-duree kutaatiif garaagarummaa gahaa hin qabu (haala dukkanaa) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; yoo xiqqaate { $threshold }:1 barbaachisa).
       *[other] { $colorName } barreeffama mata-duree kutaatiif garaagarummaa gahaa hin qabu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; yoo xiqqaate { $threshold }:1 barbaachisa).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` tuqaalee { $count } keessa darbu yeroo tuqaaleen sun gatii lakkoofsaa hin qabne hin hojjatamne.

circle-too-many-through-points = Geengoo tuqaalee 3 ol keessa darbu shallaguun hin danda'amu.

circle-overprescribed-radius-center-points = Geengoo raadiyeesii, giddugaleessa fi tuqaalee darbaa hunda ibsaman qabu shallaguun hin danda'amu.

circle-center-with-multiple-points = Geengoo giddugaleessa ibsame qabuu fi tuqaa 1 ol keessa darbu shallaguun hin danda'amu.

circle-radius-too-small = Geengoo shallaguun hin danda'amu: fageenyi tuqaalee lamaan gidduu { $distance } waan ta'eef, raadiyeesiin { $radius } ibsame baay'ee xiqqaadha.

circle-radius-with-many-points = Geengoo tuqaalee lama ol keessa darbu raadiyeesii ibsame waliin uumuun hin danda'amu.

circle-invalid-center-or-through-points = Giddugaleessi yookaan tuqaaleen darbaa geengoo sirrii miti.

circle-radius-center-with-multiple-points = Raadiyeesii geengoo giddugaleessa ibsame qabuu fi tuqaa 1 ol keessa darbuu shallaguun hin danda'amu.

circle-change-radius-non-numerical = Raadiyeesii geengoo tuqaalee gatii lakkoofsaa hin qabne keessa darbuu jijjiiruun hin danda'amu

circle-radius-with-points-non-numerical = Yeroo gatiin lakkoofsaa hin jirre geengoo tuqaa tokko ol keessa darbu raadiyeesii ibsame waliin uumuun hin danda'amu.

circle-change-center-non-numerical = Giddugaleessa geengoo tuqaalee gatii lakkoofsaa hin qabne keessa darbuu jijjiiruun hin hojjatamne.

## `<function>`

function-domain-insufficient-dimensions = Safarri naannoo hojii gahaa miti. Naannoon giddu-gala { $intervals } qaba garuu hojiin galtee { $inputs } qaba.

function-domain-invalid-format = Bifti naannoo hojii sirrii miti.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Gatiin ol'aanaan hojii kan lakkoofsa hin taane ni dhiifama.
        [minimum] Gatiin gadi-aanaan hojii kan lakkoofsa hin taane ni dhiifama.
        [extremum] Gatiin daangaa hojii kan lakkoofsa hin taane ni dhiifama.
        [point] Tuqaan hojii kan lakkoofsa hin taane ni dhiifama.
        [slope] Gadi-jechuun hojii kan lakkoofsa hin taane ni dhiifama.
       *[other] { $type } hojii kan lakkoofsa hin taane ni dhiifama.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Gatiin ol'aanaan hojii kan duwwaa ta'e ni dhiifama.
        [minimum] Gatiin gadi-aanaan hojii kan duwwaa ta'e ni dhiifama.
        [extremum] Gatiin daangaa hojii kan duwwaa ta'e ni dhiifama.
        [point] Tuqaan hojii kan duwwaa ta'e ni dhiifama.
       *[other] { $type } hojii kan duwwaa ta'e ni dhiifama.
    }

function-points-too-close = Hojiin tuqaalee lama baay'ee wal-dhihoo qaba. Hojiin hiikamuu hin danda'u.

function-iterates-input-output-mismatch = Irra deebi'amuun hojii kan danda'amu yoo baay'inni galtee baay'ina ba'aa waliin walqixa ta'e qofa. Hojiin kun galtee { $inputs } fi ba'aa { $outputs } qaba.

## `<sequence>`

sequence-invalid-length = Dheerinni tartiibaa sirrii miti. Lakkoofsa guutuu duwwaa gadi hin taane ta'uu qaba.

sequence-invalid-step = Tarkaanfiin tartiibaa sirrii miti. Tartiiba gosa { $type } tiif lakkoofsa ta'uu qaba.

sequence-invalid-endpoint-number = "{ $attribute }" tartiiba lakkoofsaa sirrii miti. Lakkoofsa ta'uu qaba.

sequence-invalid-endpoint-letters = "{ $attribute }" tartiiba qubee sirrii miti. Walitti-makaa qubee ta'uu qaba.

sequence-invalid-endpoint = "{ $attribute }" tartiibaa sirrii miti.

select-from-sequence-coprime-not-numbers = coprime ni dhiifama sababii lakkoofsi hin filatamneef

select-from-sequence-coprime-with-exclude-combinations = coprime ni dhiifama sababii excludeCombinations ibsameef

## Resolving a `target`

target-not-found = target `<{ $source }>` irratti sirrii miti: kaayyoon hin argamne.

target-state-variable-not-found = target `<{ $source }>` irratti sirrii miti: jijjiiramaan haala "{ $property }" jedhamu `<{ $component }>` irratti hin argamne.

## `<odeSystem>`

ode-system-variables-match-independent = Jijjiiramtoonni `<odeSystem>` jijjiiramaa of-danda'e irraa adda ta'uu qabu.

ode-system-duplicate-variable-names = Hojiiwwan ODE RHS maqaalee jijjiiramtoota irratti hundaa'anii irra deebi'aman qaban hiikuun hin danda'amu.

ode-system-rhs-function-error = Hojii ODE RHS hiikuun hin danda'amu. Hojii mathjs uumuu irratti dogoggorri uumame.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Golee sararoota { $count } gidduu jiru hiikuun hin danda'amu

angle-invalid-through-point = Tuqaa sirrii hin taane through `<angle>` keessatti

parabola-vertex-too-many-points = Paaraboolaan fiixee qabuu fi tuqaa 1 ol keessa darbu hin hojjatamne.

parabola-too-many-points = Paaraboolaan tuqaalee 3 ol keessa darbu hin hojjatamne.

intersection-too-many-items = Wal-qaxxaamurri wantoota lama ol hin hojjatamne

## Other math components

ionic-compound-not-two-ions = Walmakaan ayoonii ayoonii lama malee wanta biraatiif hin hojjatamne.

ionic-compound-needs-cation-and-anion = Walmakaan ayoonii cation tokkoo fi anion tokkoof qofa hojjatameera.

solve-equations-cannot-evaluate = Hiikaa furuun hin danda'amu sababii hiikichi madaalamuu hin dandeenyeef: { $equation }

math-operators-operand-number-required = Yeroo operand herregaa baasan operandNumber ibsamuu qaba.

eigen-decomposition-failed = Eigenvalue maatiriksii shallaguun hin danda'amne

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } bifa keessatti hin mul'atu, kanaaf yeroo hunda iddoo duwwaa waliin wal-sima.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" hiikuun hin danda'amu. none, medium, dense, yookaan lakkoofsota lama gaarii iddoo duwwaadhaan adda ba'an, akka grid="1 0.5", ta'uu qaba. Girdiin hin kaafamne.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" agarsiisaa prefigure keessatti hin deggeramu; amalli iddoo mirgaa fayyadamaa jira.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" agarsiisaa prefigure keessatti hin deggeramu; amalli iddoo olii fayyadamaa jira.

prefigure-invalid-axis-bounds = `<graph>`: daangaan aksiisii jijjiirama prefigure tiif sirrii miti; bbox durtii (-10,-10,10,10) fayyadamaa jira.

prefigure-invalid-width = `<graph>`: bal'inni jijjiirama prefigure tiif sirrii miti; bal'ina fakkii durtii 425 fayyadamaa jira.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio jijjiirama prefigure tiif sirrii miti; safara durtii 1 fayyadamaa jira.

prefigure-grid-spacing-too-fine = `<graph>`: fageenyi girdii daangaa aksiisiitiif baay'ee xiqqaadha; girdiin agarsiisaa prefigure keessatti dhiifameera.

prefigure-annotations-not-rendered = `<graph>`: yeroo agarsiisaan PreFigure hin fayyadamne yaadannoowwan hin agarsiifaman.

multiple-annotations-children = Ijoolleen `<annotations>` hedduun `<graph>` keessatti argamaniiru; isa dhumaa malee hundi ni dhiifamu.

## Referring to other components

copy-unrecognized-component-type = Gosa kutaa hin beekamne babal'isuun yookaan garagalchuun hin danda'amu: { $type }.

copy-prop-not-found = Amalli { $property } kutaa gosa { $component } irratti hin argamne

collect-no-source = Madda collect tiif hin argamne.

collect-invalid-component-type = Kutaalee gosa `<{ $component }>` walitti qabuun hin danda'amu sababii gosa kutaa sirrii hin taaneef.

reference-index-unavailable = Lakkoofsa `{ $reference }` agarsiisuun hin danda'amu

## `<callAction>`

component-action-unavailable = { $action } kutaa `{ $reference }` irratti waamuun hin danda'amu

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bifti daataa sirrii miti. Tarreewwan dheerina wal hin fakkaanne qabu. componentIdx :{ $componentIdx } keessatti argame

data-frame-duplicate-column-names = Daataan maqaalee utubaa irra deebi'aman qaba. componentIdx :{ $componentIdx } keessatti argame

data-frame-missing-column-name = Daataan maqaa utubaa tokko hin qabu. componentIdx :{ $componentIdx } keessatti argame

## `<answer>` and scoring

answer-award-depends-on-own-response = award deebii kanaa deebii taagiin answer mataan isaa erge irratti hundaa'a, kunis amala hin eegamne fida.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` `<answer>` qabduu `sectionWideCheckWork` qabu keessa jiru irratti qindeessuun dhiibbaa hin qabu, sababii baay'inni yaalii qabduu sanaan too'atamuuf. Qooda kanaa `maxNumAttempts` qabduu sana irratti qindeessi.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` qabduu `sectionWideCheckWork` qabuu fi qabduu biraa `sectionWideCheckWork` qabu keessa jiru irratti qindeessuun dhiibbaa hin qabu, sababii baay'inni yaalii qabduu alaatiin too'atamuuf. Qooda kanaa `maxNumAttempts` qabduu alaa irratti qindeessi.

answer-attributes-need-symbolic-equality = Amaloonni { $attributes } symbolicEquality qindaa'e malee dhiibbaa hin qabaatan.

answer-invalid-type = Gosti deebiitiif sirrii miti: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Kutaan `<{ $component }>` maqaa waan hin qabneef, amala module tiif fayyaduu hin danda'u

module-attribute-name-already-defined = Kutaan `<{ $component } name="{ $name }">` amala module tiif fayyaduu hin danda'u sababii gosti kutaa `<module>` duraanuu amala "{ $name }" jedhamu qabuuf.

conditional-content-condition-ignored = Amalli `condition` kutaa `<conditionalContent>` ijoollee case yookaan else qabu irratti ni dhiifama.

slider-markers-type-mismatch = Gosti mallattoolee gosa slider waliin wal hin simu.

pretzel-problem-needs-statement-and-answer = pretzel sirrii miti: `<problem>` hundi `<statement>` tokkoo fi `<answer>` tokko qabaachuu qaba.

pretzel-circuit-first-problem-distractor = pretzel sirrii miti: mode="circuit" keessatti, `<problem>` jalqabaa kan burjaajessu ta'uu hin danda'u.

## Attribute values

attribute-invalid-values = Gatiin { $values } amala `{ $attribute }` irratti sirrii miti; ni dhiifama.

attribute-must-be-references = Gatiin `{ $value }` amala `{ $attribute }` irratti sirrii miti. Amalli wabiiwwan `$` n jalqaban irraa ijaaramuu qaba.

math-input-invalid-function-names = <mathInput>: maqaaleen hojii sirrii hin taane { $attribute } keessatti ni dhiifamu: { $names }. Kutaan agarsiisaa maqaa hundaa yoo xiqqaate arfii 2 (qubee yookaan sarara-walqabsiisaa) qabaachuu qaba; dabalataan `|<mathspeak alternative>` hordofuu danda'a.

## Building components from the source

component-type-invalid = Gosti kutaa sirrii miti: `<{ $componentType }>`

attribute-repeated = Amalli { $attribute } irra deebi'amuu hin danda'u.

attribute-invalid-for-component = Amalli "{ $attribute }" kutaa gosa `<{ $componentType }>` tiif sirrii miti.

## Style definition contrast

style-definition-insufficient-contrast =
    Hiikkaan bifa { $styleNumber } { $context ->
        [text-on-background] halluu barreeffamaa halluu duubbee irratti
        [high-contrast] halluu garaagarummaa ol'aanaa kanvaasii irratti
        [line] halluu sararaa kanvaasii irratti
        [marker] halluu mallattoo kanvaasii irratti
       *[text-on-canvas] halluu barreeffamaa kanvaasii irratti
    } garaagarummaa gahaa hin qabu{ $mode ->
        [dark] { " (haala dukkanaa)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; yoo xiqqaate { $threshold }:1 barbaachisa).

style-definition-dark-mode-text-background-contrast =
    Hiikkaan bifa { $styleNumber } haala ifaatiif halluuwwan garaagarummaa gahaa qaban ibsus, halluuwwan haala dukkanaa isaan irraa dhufan halluu barreeffamaa fi halluu duubbee gidduutti garaagarummaa gahaa hin qaban ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; yoo xiqqaate { $threshold }:1 barbaachisa). { $suggestion ->
        [available] Haala dukkanaa keessatti garaagarummaa gahaa mirkaneessuuf, garaagarummaa haala ifaa dabali (fakkeenyaaf { $lightAttribute }="{ $lightColor }" qindeessi) yookaan halluu haala dukkanaa jijjiiri (fakkeenyaaf { $darkAttribute }="{ $darkColor }" qindeessi).
       *[none] Haala dukkanaa keessatti garaagarummaa gahaa mirkaneessuuf, garaagarummaa haala ifaa dabali yookaan halluuwwan dhufan textColorDarkMode fi/yookaan backgroundColorDarkMode n jijjiiri.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hiikkaan bifa { $styleNumber } haala ifaatiif halluu barreeffamaa garaagarummaa gahaa qabu ibsus, halluun barreeffamaa haala dukkanaa isa irraa dhufe kanvaasii irratti garaagarummaa gahaa hin qabu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; yoo xiqqaate { $threshold }:1 barbaachisa). { $suggestion ->
        [available] Haala dukkanaa keessatti garaagarummaa gahaa mirkaneessuuf, garaagarummaa haala ifaa dabali (fakkeenyaaf textColor="{ $lightColor }" qindeessi) yookaan halluu haala dukkanaa jijjiiri (fakkeenyaaf textColorDarkMode="{ $darkColor }" qindeessi).
       *[none] Haala dukkanaa keessatti garaagarummaa gahaa mirkaneessuuf, garaagarummaa haala ifaa dabali yookaan halluu dhufe textColorDarkMode n jijjiiri.
    }

section-multiple-style-palettes = Kutaan <stylePalette> tokko qofa filachuu danda'a; isa dhumaa fayyadamaa jira.

## Unique variants

variant-num-to-select-not-non-negative-integer = gosoota adda ta'an { $component } murteessuun hin danda'amu sababii numToSelect lakkoofsa guutuu duwwaa gadi hin taane hin taaneef.

variant-num-to-select-not-constant-number = gosoota adda ta'an { $component } murteessuun hin danda'amu sababii numToSelect lakkoofsa hin jijjiiramne hin taaneef.

variant-with-replacement-not-constant-boolean = gosoota adda ta'an { $component } murteessuun hin danda'amu sababii withReplacement boolean hin jijjiiramne hin taaneef.

variant-select-weight-disables-unique = Gosoonni adda ta'an select tiif ni dhaabbatu yoo filannoon selectWeight yookaan selectForVariants ibsame qabu jiraate

variant-coprime-undetermined = gosoota adda ta'an { $component } murteessuun hin danda'amu sababii coprime yeroo hunda soba ta'uu isaa murteessuun hin danda'amneef.

variant-attribute-not-constant = gosoota adda ta'an { $component } murteessuun hin danda'amu sababii { $attribute } wanta hin jijjiiramne hin taaneef.

variant-attribute-not-number = gosoota adda ta'an { $component } murteessuun hin danda'amu sababii { $attribute } lakkoofsa hin taaneef.

variant-attribute-wrong-type-for-sequence =
    gosoota adda ta'an { $component } gosa { $type } murteessuun hin danda'amu sababii { $attribute } { $expected ->
        [letters-combination] walitti-makaa qubee
        [math-expression] ibsa herregaa sirrii
        [integer] lakkoofsa guutuu
       *[number] lakkoofsa
    } hin taaneef.

variant-length-not-integer = gosoota adda ta'an { $component } murteessuun hin danda'amu sababii length lakkoofsa guutuu hin taaneef.

variant-sort-not-implemented = gosoonni adda ta'an { $component } sort qabu hin hojjatamne

variant-exclude-combinations-not-implemented = gosoonni adda ta'an { $component } excludeCombinations qabu hin hojjatamne

variant-math-exclude-not-implemented = gosoonni adda ta'an { $component } gosa math exclude qabu hin hojjatamne

variant-non-constant-exclude-not-implemented = gosoonni adda ta'an { $component } exclude jijjiiramaa qabu hin hojjatamne

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: agarsiisaa graph prefigure keessatti hin deggeramu; sanyiin ni dabarfame.

prefigure-descendant-invalid-geometry = { $subject }: jiyoomeetirii dhuma hin qabne yookaan hin guutne; sanyiin ni dabarfame.

prefigure-curve-label-omitted = { $subject }: mallattoowwan kutaalee sarara jallataa jijjiiraman irratti hin deggeraman; mallattoon dhiifameera.

prefigure-curve-unsupported-definition-type = { $subject }: gosti hiikkaa hojii sarara jallataa '{ $definitionType }' hin deggeramu; sanyiin ni dabarfame.

prefigure-region-flip-functions-unsupported = { $subject }: amalli flipFunctions regionBetweenCurves irratti hin deggeramu; sanyiin ni dabarfame.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves irratti hojiiwwan ijoollee gosa formula qofti deggeramu; sanyiin ni dabarfame.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' { $labelKind ->
        [line-family] mallattoo maatii sararaa
       *[point] mallattoo tuqaa
    } tiif hin deggeramu; walsimsiisuun PreFigure durtii fayyadamaa jira.

prefigure-fill-style-unsupported = { $subject }: bifti guutinsaa '{ $fillStyle }' PreFigure n hin deggeramu; guutinsa jabaatti deebi'aa jira.

prefigure-line-style-unknown = { $subject }: bifti sararaa hin beekamne '{ $lineStyle }' ba'aa PreFigure keessaa dhiifameera.

prefigure-marker-style-mapped-to-diamond = { $subject }: bifti mallattoo '{ $markerStyle }' gara bifa PreFigure 'diamond' tti jijjiirameera.

prefigure-marker-style-unsupported = { $subject }: bifti mallattoo '{ $markerStyle }' PreFigure n hin deggeramu; bifa durtii fayyadamaa jira.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` sirrii miti; kaayyoon murtaa'uu hin danda'u. Yaadannoon dhiifameera.

annotation-ref-multiple-targets = `<annotation>`: `ref` kaayyoowwan hedduu agarsiise; isa jalqabaa fayyadamaa jira.

annotation-ref-outside-graph = `<annotation>`: `ref` sirrii miti; kaayyoon giraafii isa qabatee alatti argama. Yaadannoon dhiifameera.

annotation-ref-unsupported-target = `<annotation>`: `ref` sirrii miti; kaayyoon jijjiirama prefigure keessatti wanta fakkii deggeramu miti. Yaadannoon dhiifameera.

annotation-text-missing = `<annotation>`: `text` hin jiru yookaan duwwaadha; barreeffamni duwwaan ba'aa jira.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Irkoon geengoo argameera.
       *[other] Irkoon geengoo kutaa `<{ $componentType }>` hammatu argameera.
    }

reference-no-referent = Wabii `{ $reference }` irratti wanti argame hin jiru

reference-multiple-referents = Wabii `{ $reference }` irratti wantoonni hedduun argamaniiru

## Children that do not match

children-invalid-attribute-format = Bifti amala { $attribute } kan `<{ $componentType }>` sirrii miti.

children-invalid = Ijoolleen `<{ $componentType }>` sirrii miti: ijoolleen sirrii hin taane argamaniiru: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Gatiin `{ $value }` amala `{ $attribute }` irratti sirrii miti; gatii `{ $default }` fayyadamaa jira

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Gosti DoenetML { $version } hin argamne.
       *[other] Gosti DoenetML { $version } hin argamne. Gara gosa { $fallback } tti deebi'aa jira
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML sirrii miti: { $content }

parse-tag-missing-close-tag = DoenetML sirrii miti: Taagiin `{ $tag }` taagii cufaa hin qabu. Taagiin of-cufu yookaan taagiin `</{ $tagName }>` eegamee ture.

parse-tag-error = DoenetML sirrii miti: Dogoggora taagii `<{ $tagName }>` keessatti

parse-attribute-missing-value = DoenetML sirrii miti: Amalli `{ $attribute }` sirrii hin taane gatii dhabuu fakkaata.

parse-attribute-invalid = DoenetML sirrii miti: Amalli `{ $attribute }` sirrii miti

parse-attribute-value-invalid = DoenetML sirrii miti: Gatiin amalaa `{ $value }` sirrii miti

parse-attribute-value-quote-mismatch = DoenetML sirrii miti: Gatiin amalaa `{ $value }` sirrii miti. Mallattoowwan waraabbii wal hin simu. `{ $quote }` hir'achuu fakkaata

parse-open-tag-name-missing = DoenetML sirrii miti: Taagiin maqaa taagii hin qabne argame, fakkeenyaaf `<`

parse-tag-not-closed = DoenetML sirrii miti: Taagiin `{ $tag }` hin cufamne (`>` hir'achuu fakkaata).

parse-self-closing-tag-name-missing = DoenetML sirrii miti: Taagiin maqaa taagii hin qabne argame `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML sirrii miti: Taagiin `{ $tag }` hin cufamne (`/>` hir'achuu fakkaata).

parse-tag-invalid-attributes = DoenetML sirrii miti: Taagiin `{ $tag }` sirrii miti. Amaloota sirrii hin taane qabaachuu danda'a.

parse-close-tag-name-missing = DoenetML sirrii miti: Taagiin cufaa maqaa taagii hin qabne argame, fakkeenyaaf `</`

parse-attribute-value-unquoted = Gatiiwwan amalaa mallattoo waraabbii keessa galuu qabu: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML sirrii miti: Taagiin cufaa `{ $tag }` argame, garuu taagiin banaa wal-simu hin jiru

parse-close-tag-mismatched = DoenetML sirrii miti: Taagiin cufaa wal hin simu. `</{ $expected }>` eegamee ture. `{ $found }` argame

parser-node-unconvertible = Nood { $node } gara nood Dast tti jijjiiruun hin danda'amne.

## Names

name-attribute-invalid =
    Amalli name='{ $name }' sirrii miti. { $reason ->
        [characters] Maqaaleen qubee, lakkoofsa, sarara-jalaa yookaan sarara-walqabsiisaa qofa qabaachuu danda'u.
       *[start] Maqaaleen qubeedhaan jalqabuu qabu.
    }

component-name-invalid-start = Maqaan kutaa "{ $name }" sirrii miti. Maqaaleen qubeedhaan jalqabuu qabu.

## `<answer>` sugar

answer-video-watched-missing-video = Deebiin gosa videoWatched amala video qabaachuu qaba

answer-video-watched-video-not-reference = Deebiin gosa videoWatched amala video kan wabii ta'e qabaachuu qaba

answer-name-not-single-text = Amalli name deebii ilma text tokko qofa qabaachuu qaba

## Referencing another document

external-doenetml-recursion-limit = Sadarkaan irra deebi'uu baay'ee waan ta'eef DoenetML alaa argachuun hin danda'amne. Wabiin geengoo jiraa?

external-doenetml-unavailable = { $attribute }="{ $uri }" irraa DoenetML argachuun hin danda'amne

external-doenetml-type-mismatch = { $attribute }="{ $uri }" irraa DoenetML argame sirrii miti: gosa kutaa "{ $componentType }" waliin wal hin simu

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Amalli `{ $from }` hin fayyadamu; qooda isaa `{ $to }` fayyadami.
       *[other] [deprecation] Amalli `{ $from }` `<{ $component }>` irratti hin fayyadamu; qooda isaa `{ $to }` fayyadami.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Amalli `{ $from }` hin fayyadamu, `{ $to }` illee waan ibsameef ni dhiifama.
       *[other] [deprecation] Amalli `{ $from }` `<{ $component }>` irratti hin fayyadamu, `{ $to }` illee waan ibsameef ni dhiifama.
    }

deprecated-attribute-ignored = [deprecation] Amalli `{ $attribute }` `<{ $component }>` irratti hin fayyadamu, ni dhiifama.


## Language coverage

pluralize-english-only = `<pluralize>` Ingiliffa qofa baay'isuu danda'a, kanaaf barreeffamni isaa barreeffama { $locale } n barreeffame keessatti akkuma jirutti hafa. Bifa baay'inaa kallattiin barreessi, yookaan amala `pluralForm` n qindeessi.


## Checking against the schema

schema-element-unrecognized = Kutaan `<{ $tag }>` kutaa Doenet beekamaa miti.

schema-element-not-allowed-at-root = Kutaan `<{ $tag }>` hundee barreeffamaa irratti hin hayyamamu.

schema-element-not-allowed-inside = Kutaan `<{ $tag }>` `<{ $parent }>` keessatti hin hayyamamu.

schema-attribute-unrecognized = Kutaan `<{ $tag }>` amala `{ $attribute }` jedhamu hin qabu.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Amalli `{ $attribute }` kutaa `<{ $tag }>` tarree wanti tokkoon tokkoon isaa kanneen keessaa tokko ta'e ta'uu qaba: { $allowed }
       *[other] Amalli `{ $attribute }` kutaa `<{ $tag }>` kanneen keessaa tokko ta'uu qaba: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Maqaan gosaa select tiif sirrii miti. Maqaan gosaa { $variantName } filannoowwan { $numOptions } keessatti mul'ata garuu baay'inni filatamu { $numToSelect } dha.

select-variant-name-without-options = Gosoonni tokko tokko select tiif ibsamaniiru garuu maqaa gosaa danda'amuuf filannoon hin ibsamne: { $variantName }.

select-variant-name-not-possible = Maqaan gosaa { $variantName } select tiif ibsame maqaa gosaa danda'amu miti.

select-too-few-options = Kutaalee { $numToSelect } { $numOptions } qofa keessaa filachuun hin danda'amu.

select-from-sequence-too-few-values = Gatiiwwan { $numToSelect } tartiiba dheerina { $length } qabu keessaa filachuun hin danda'amu.

select-from-sequence-indices-count-mismatch = Baay'inni lakkoofsota select tiif ibsamanii baay'ina filatamu waliin wal-simuu qaba

select-from-sequence-indices-not-integers = Lakkoofsonni select tiif ibsaman hundi lakkoofsa guutuu ta'uu qabu

select-from-sequence-index-excluded = Lakkoofsi selectfromsequence kan baafame ibsameera

select-from-sequence-indices-excluded-combination = Lakkoofsonni selectfromsequence kan walitti-makaa baafame turan ibsamaniiru

select-from-sequence-coprime-not-positive-integers = Walitti-makaan coprime filachuun hin danda'amu sababii lakkoofsonni guutuun gaariin hin filatamneef.

select-from-sequence-coprime-common-factor = Lakkoofsota coprime filachuun hin danda'amu. Gatiiwwan danda'aman hundi qooddattoo tokko qabu. (Gatiiwwan "from" yookaan "to" ibsaman "step" waliin coprime ta'uu qabu.)

select-from-sequence-coprime-single-number = Walitti-makaa coprime lakkoofsa tokko kan 1 hin taane keessaa filachuun hin danda'amu.

select-from-sequence-excluded-too-many-combinations = selectFromSequence keessatti walitti-makaa 70% ol baafameera

select-from-sequence-coprime-none-found = Lakkoofsota coprime filachuun hin danda'amne. Gatiiwwan danda'aman hundi qooddattoo tokko qabu.

select-from-sequence-too-few-unique-values = Gatiiwwan adda ta'an { $numToSelect } tartiiba dheerina { $numPossibleValues } qabu keessaa filachuun hin danda'amu

select-prime-numbers-too-few-values = Gatiiwwan { $numToSelect } tarree lakkoofsota qulqulluu dheerina { $numValues } qabu keessaa filachuun hin danda'amu

select-prime-numbers-values-count-mismatch = Baay'inni gatiiwwan select tiif ibsamanii baay'ina filatamu waliin wal-simuu qaba

select-prime-numbers-values-not-prime = Gatiiwwan select prime number tiif ibsaman hundi tarree lakkoofsota qulqulluu keessa jiraachuu qabu

select-prime-numbers-values-excluded-combination = Gatiiwwan selectPrimeNumbers ibsaman walitti-makaa baafame turan

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers keessatti walitti-makaa 70% ol baafameera

select-random-combination-fluke = Carraa baay'ee hin eegamneen, walitti-makaa gatiiwwan carraa filachuun hin danda'amne

select-random-value-fluke = Carraa baay'ee hin eegamneen, gatii carraa filachuun hin danda'amne
