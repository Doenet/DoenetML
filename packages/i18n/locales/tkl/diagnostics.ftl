# Tokelauan (Gagana Tokelau) diagnostics. Translated from
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
# **Orthography.** The standard spelling taught in Tokelau and used by the
# Tokelau Dictionary: the five vowels a e i o u, **macrons on the long
# vowels** (ā ē ī ō ū), and the velar nasal written **`g`** — never `ng` — so
# the language names itself «Gagana Tokelau». **Tokelauan has no glottal stop
# and none is written here**: the koma liliu «ʻ» that is part of Samoan
# spelling has no counterpart in this language, and a «ʻ» anywhere in these
# four files would be an error rather than a variant. A macron is part of the
# spelling and not decoration; where this seed has left one out it is a
# mistake to fix.
#
# **Samoan is the nearest existing catalog, and this file is not a copy of
# it.** Tokelauan and Samoan are both Samoic-Outlier Polynesian and share a
# great deal of inherited vocabulary, so a word that comes out the same in
# both is often simply right: «tali», «togi», «lanu», «laina», «igoa»,
# «vaega», «muamua», «taumafai» are the two languages' common inheritance and
# stand here because they are Tokelauan, not because `locales/sm` has them.
# What must never come out the same is anything the regular correspondences
# touch:
#
#   Samoan «s»  → Tokelauan «h»   sesē → hehē, sili → hili, sino → hino,
#                                 tasi → tahi, tutusa → tutuha,
#                                 faʻamalositino → fakamalohitino
#   Samoan «ʻ»  → Tokelauan «k»   where the glottal continues PPn *k:
#                                 faʻa- → faka-, aʻoaʻo → akoako,
#                                 piʻo → piko, tuaoi → tuakoi,
#                                 tuʻu → tuku, ʻafai → kafai,
#                                 amata → kamata, ʻese → kehe
#   Samoan «ʻ»  → nothing         where it does not: vaʻai → vaai,
#                                 faʻafitauli's «-fitauli» is untouched
#
# **That last pair is this seed's largest single risk.** The Samoan koma
# liliu has two histories and only one of them surfaces as a Tokelauan «k»,
# and this seed had to judge which applied word by word. Where it judged
# wrong the result is not a misspelling but a different word. The words it is
# least sure of are named at the foot of this header.
#
# **Tokelauan has no t/k register split.** Samoan's colloquial register turns
# «t» into «k» and «n» into «g»; Tokelauan does not, so there is one spelling
# here rather than a formal and an informal one, and every «k» in these files
# is a real «k».
#
# **`locales/tvl` (Tuvaluan) is a sibling in this same batch, and the two
# catalogs are expected to look alike.** Tuvaluan is Tokelauan's closest
# relative and the same correspondences run through it, so agreement between
# the two files is what relatedness predicts and is **not evidence that
# either is right** — two seeds can be wrong together in the same way. Check
# this file against Tokelauan, never against `tvl`.
#
# **No grammatical gender.** `noun-gender` answers one token and no adjective
# in these files forks on `$gender`. **No `$role` fork** either: nothing here
# changes shape between standing alone and sitting inside a clause.
#
# **Number.** A numeral in front of a Tokelauan noun leaves the noun alone —
# «tahi taumafai», «lua taumafai» — so a count never changes the word beside
# it, and the counted messages here are written as a single unselected form.
# Tokelauan does mark plural, but on the article («te» → «nā») and, in a
# family of adjectives, by **reduplicating a syllable**: «lahi» → «lalahi»,
# «loa» → «loloa», «poto» → «popoto». Every description these messages build
# is of one thing, so the singular is right throughout; a message about
# several things would want the reduplicated form, and no argument these
# messages receive would tell a translator so. `Intl.PluralRules` has no CLDR
# data for `tkl` and resolves against the runtime's default locale, so a
# `[two]`, `[few]` or `[many]` branch here would be text nothing could
# select.
#
# **Adjectives follow the noun**, as they do in Samoan — «laina mafiafia
# kula» — so the composition messages in `content.ftl` put the noun first and
# keep the English order among the adjectives themselves. That agreement with
# `locales/sm` is a real fact about both languages rather than a copy.
#
# **Loans, named rather than hidden.** Mathematics and computing are taught
# in Tokelau largely in English, so the technical nouns here are loans
# adapted to Tokelauan spelling and are marked as loans: «poini», «veta»,
# «poligoni», «parapola», «matematika», «kipoti», «lipoti», «etita»,
# «palakalafa», «numela», «koluhe», «matrix», «element». A loan takes «l» and
# never «r», Tokelauan having no /r/.
#
# **The words this seed is least sure of**, where a reviewer should start:
# «liko» (circle, from Samoan «liʻo» by the *k rule, which may not apply
# here), «fakataitaiga» (example — the same rule might make it
# «fakatakitakiga»), «lapatakiga» (warning), «hamahama» (yellow), «lanu
# meamata» (green), «enaena» (brown), «hoko» (next), «ka leai» (otherwise),
# «hakega» (slope, a coinage), «manatu fakafoki» (feedback, a coinage),
# «fakailoga tuhi» (the editor's cursor, a coinage), and «fakamama» (filter)
# beside «fakamamā» (clear), which differ only by a macron. None of these is
# attested by this seed; each is a derivation or a description.
#
# The counted messages here take a single unselected form, for the reason the
# `chrome.ftl` header gives: a numeral leaves a Tokelauan noun alone. The
# counts that are *not* counts — `$expected` in `field-function-wrong-num-
# outputs`, which chooses between two different sentences rather than between
# two shapes of one — keep both of their branches.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = E lē amanakia { $attributes } kafai kua fakamaoti pito e lua

line-segment-attributes-ignored-with-endpoint-and-midpoint = E lē amanakia { $attributes } kafai kua fakamaoti fakatahi he pito ma he poini ogatotonu

line-segment-midpoint-offset-without-midpoint = E leai he aogā o te midpointOffset kafai e leai he poini ogatotonu

## `<line>`

line-points-undetermined-dimensions = Ko he laina e ui i poini e lē iloa ona fua.

line-points-too-few-dimensions = E tatau ona ui te laina i poini e lua ona fua i te itiiti ifo.

line-points-depend-on-variables = E ui te laina i poini e fakalagolago ki huiga: { $variables }.

line-equation-invalid-format = E lē hako te fakatulagaga o te fakatuha o te laina i huiga { $variable1 } ma { $variable2 }.

## `<ray>`

ray-overprescribed-through = Kua fakamaoti te ū e ala i te through, te endpoint ma te direction. E lē amanakia te through na fakamaoti.

ray-dimension-mismatch = E lē fetaui te numDimensions i te ū.

## `<vector>`

vector-overprescribed-head = Kua fakamaoti te veta e ala i te head, te tail ma te displacement. E lē amanakia te head na fakamaoti.

vector-dimension-mismatch = E lē fetaui te numDimensions i te veta.

## Attracting and constraining

attract-to-without-nearest-point = E lē mafai ona tohina ki te `<{ $component }>` he auā e leai hana huiga tulaga nearestPoint.

constrain-to-without-nearest-point = E lē mafai ona fakatapulaka ki te `<{ $component }>` he auā e leai hana huiga tulaga nearestPoint.

constrain-to-interior-without-nearest-point = E lē mafai ona fakatapulaka ki loto o te `<{ $component }>` he auā e leai hana huiga tulaga nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = E lē amanakia te labelPosition mo he choiceInput e lē ko he inline

## Ordering children by index

choice-input-indices-count-mismatch = E lē amanakia nā indices na fakamaoti mo te choiceInput he auā e lē fetaui te aofaki o indices ma te aofaki o fanau choice.

pretzel-indices-count-mismatch = E lē amanakia nā indices na fakamaoti mo te problem he auā e lē fetaui te aofaki o indices ma te aofaki o fanau problem.

shuffle-indices-count-mismatch = E lē amanakia nā indices na fakamaoti mo te shuffle he auā e lē fetaui te aofaki o indices ma te aofaki o vaega.

indices-ignored-out-of-range = E lē amanakia nā indices na fakamaoti mo te { $component } he auā e i ai ni indices i tua o te tapulaka.

pretzel-indices-repeated = E lē amanakia nā indices na fakamaoti mo te pretzel he auā e toe fai ni indices.

pretzel-circuit-first-index = E lē amanakia nā indices na fakamaoti mo te pretzel i te mode circuit he auā e tatau ona 1 te index muamua.

## `<shuffle>` and `<sort>`

string-children-need-type = Ke gālue te `<{ $component }>` ma ni fanau ko ni kupu, e tatau ona fakamaoti te uiga `type`.

invalid-type-defaulting-to-math = E lē hako te type { $type } mo te vaega { $component }. E tatau ona ko he math, text, number pe boolean. Ka fakaaogā te math.

string-not-valid-component-to-arrange = Ko te kupu "{ $value }" e lē ko he vaega hako mo te { $component }. E lē amanakia.

## Types and variables

invalid-type-defaulting-to-number = E lē hako te type { $type }, ka fakatū te type ki te number.

invalid-variable-value = E lē hako te tau o he huiga: `{ $value }`

## Variants

variant-index-must-be-number = E tatau ona ko he numela te index variant { $index }

variant-index-must-be-integer = E tatau ona ko he numela kātoa te index variant { $index }

## `<sideBySide>`

side-by-side-absolute-widths = E heki fai te `<{ $component }>` mo ni fuataga tumau. Ka fakatū nā lautele ki te fakatuha.

side-by-side-absolute-margins = E heki fai te `<{ $component }>` mo ni fuataga tumau. Ka fakatū nā tuakoi ki te fakatuha.

side-by-side-no-block-child = E lē hako te `<{ $component }>`: e tatau ona i ai he fanau poloka e tahi i te itiiti ifo.

## `<label>`

label-for-ignored-on-graphical = E lē amanakia te uiga `for` i luga o he `<label>` ata.

label-for-must-resolve-to-one = E tatau i te uiga `for` i luga o te `<label>` ona fakahino ki he vaega e tahi.

label-for-unresolved = E heki mafai e te uiga `for` i luga o te `<label>` ona fakahino ki he vaega.

label-for-answer-with-authored-inputs = E fakahino te uiga `for` i luga o te `<label>` ki he `<answer>` e i ai ni fakaofiga na tuhi e te tuhitala; fakahino tonu ki te fakaofiga.

label-for-answer-without-input = E fakahino te uiga `for` i luga o te `<label>` ki he `<answer>` e leai hana fakaofiga e fakaigoa.

label-for-must-reference-input-or-answer = E tatau i te uiga `for` i luga o te `<label>` ona fakahino ki he fakaofiga pe ko he answer.

## Accessibility

accessibility-short-description-or-decorative = Mo te avanoa faigofie, e tatau i te `<{ $component }>` ona i ai he fakamatalaga poto pe fakamaoti ko he teuteuga.

accessibility-video-short-description = Mo te avanoa faigofie, e tatau i te `<video>` ona i ai he fakamatalaga poto.

accessibility-input-short-description-or-label = Mo te avanoa faigofie, e tatau i te `<{ $component }>` ona i ai he fakamatalaga poto pe ko he igoa.

accessibility-answer-input-short-description-or-label = Mo te avanoa faigofie, e tatau i he `<answer>` e fai ai he fakaofiga ona i ai he fakamatalaga poto pe ko he igoa.

accessibility-short-description-contains-math = E lē tatau i ni fakamatalaga poto ona i ai ni vaega matematika e pēnā mo te `<{ $component }>`. Tuhi te matematika ki ni kupu.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] E lē lava te kehekehega o te { $colorName } mo te tuhituhiga o te ulutala o te vaega (mode pouliuli) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e manakomia te { $threshold }:1 i te itiiti ifo).
       *[other] E lē lava te kehekehega o te { $colorName } mo te tuhituhiga o te ulutala o te vaega ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e manakomia te { $threshold }:1 i te itiiti ifo).
    }

## `<circle>`

circle-through-points-non-numerical = E heki fai te `<circle>` e ui i poini e { $count } kafai e leai ni tau numela o nā poini.

circle-too-many-through-points = E lē mafai ona fuafua he liko e ui i poini e hili atu i te 3.

circle-overprescribed-radius-center-points = E lē mafai ona fuafua he liko kafai kua fakamaoti te radius, te ogatotonu ma nā poini.

circle-center-with-multiple-points = E lē mafai ona fuafua he liko ma he ogatotonu fakamaoti e ui i poini e hili atu i te 1.

circle-radius-too-small = E lē mafai ona fuafua te liko: he auā ko te mamao i te vā o poini e lua ko te { $distance }, kua foliki tele te radius { $radius } na fakamaoti.

circle-radius-with-many-points = E lē mafai ona fai he liko e ui i poini e hili atu i te lua ma he radius fakamaoti.

circle-invalid-center-or-through-points = E lē hako te ogatotonu pe ko nā poini e ui ai te liko.

circle-radius-center-with-multiple-points = E lē mafai ona fuafua te radius o he liko ma he ogatotonu fakamaoti e ui i poini e hili atu i te 1.

circle-change-radius-non-numerical = E lē mafai ona hui te radius o he liko e lē ko ni numela ona poini

circle-radius-with-points-non-numerical = E lē mafai ona fai he liko e ui i poini e hili atu i te tahi ma he radius fakamaoti kafai e leai ni tau numela.

circle-change-center-non-numerical = E heki fai te huiga o te ogatotonu o he liko e ui i poini e lē ko ni numela.

## `<function>`

function-domain-insufficient-dimensions = E lē lava nā fua o te domain mo te gāluega. E { $intervals } vā o te domain kae e { $inputs } fakaofiga o te gāluega.

function-domain-invalid-format = E lē hako te fakatulagaga o te domain mo te gāluega.

function-ignoring-non-numerical =
    { $type ->
        [maximum] E lē amanakia te maualuga e lē ko he numela o te gāluega.
        [minimum] E lē amanakia te maualalo e lē ko he numela o te gāluega.
        [extremum] E lē amanakia te tulaga pito e lē ko he numela o te gāluega.
        [point] E lē amanakia te poini e lē ko he numela o te gāluega.
        [slope] E lē amanakia te hakega e lē ko he numela o te gāluega.
       *[other] E lē amanakia te { $type } e lē ko he numela o te gāluega.
    }

function-ignoring-empty =
    { $type ->
        [maximum] E lē amanakia te maualuga gaogao o te gāluega.
        [minimum] E lē amanakia te maualalo gaogao o te gāluega.
        [extremum] E lē amanakia te tulaga pito gaogao o te gāluega.
        [point] E lē amanakia te poini gaogao o te gāluega.
       *[other] E lē amanakia te { $type } gaogao o te gāluega.
    }

function-points-too-close = E i ai ni poini e lua o te gāluega e pili tele o lāua tulaga. E lē mafai ona fakamaoti te gāluega.

function-iterates-input-output-mismatch = E mafai ona toe fai te gāluega kafai e tutuha te aofaki o fakaofiga ma te aofaki o fakaiuga. E { $inputs } fakaofiga ma { $outputs } fakaiuga o te gāluega nei.

## `<sequence>`

sequence-invalid-length = E lē hako te umi o te fakahologa. E tatau ona ko he numela kātoa e lē maualalo ifo i te 0.

sequence-invalid-step = E lē hako te laka o te fakahologa. E tatau ona ko he numela mo he fakahologa ituaiga { $type }.

sequence-invalid-endpoint-number = E lē hako te "{ $attribute }" o te fakahologa numela. E tatau ona ko he numela.

sequence-invalid-endpoint-letters = E lē hako te "{ $attribute }" o te fakahologa matakituhi. E tatau ona ko he tukufakatahiga o matakituhi.

sequence-invalid-endpoint = E lē hako te "{ $attribute }" o te fakahologa.

select-from-sequence-coprime-not-numbers = E lē amanakia te coprime he auā e lē o filifilia ni numela

select-from-sequence-coprime-with-exclude-combinations = E lē amanakia te coprime he auā kua fakamaoti te excludeCombinations

## Resolving a `target`

target-not-found = E lē hako te target mo te `<{ $source }>`: e lē maua te target.

target-state-variable-not-found = E lē hako te target mo te `<{ $source }>`: e lē maua he huiga tulaga e igoa ki te "{ $property }" i luga o he `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = E tatau i huiga o te `<odeSystem>` ona kehe mai te huiga tutokatahi.

ode-system-duplicate-variable-names = E lē mafai ona fakamaoti gāluega itu tautau o te ODE ma ni igoa huiga fakalagolago e tutuha.

ode-system-rhs-function-error = E lē mafai ona fakamaoti te gāluega itu tautau o te ODE. Na i ai he mea hehē i te faiga o te gāluega mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = E lē mafai ona fakamaoti he tulimanu i te vā o laina e { $count }

angle-invalid-through-point = E lē hako he poini i te through o te `<angle>`

parabola-vertex-too-many-points = E heki fai he parapola ma he tumutumu e ui i poini e hili atu i te 1.

parabola-too-many-points = E heki fai he parapola e ui i poini e hili atu i te 3.

intersection-too-many-items = E heki fai te fetaulaga mo ni mea e hili atu i te lua

## Other math components

ionic-compound-not-two-ions = E heki fai te tukufakatahiga ionika mo he mea e kehe mai te lua ion.

ionic-compound-needs-cation-and-anion = E na ko te tahi cation ma te tahi anion e fai ai te tukufakatahiga ionika.

solve-equations-cannot-evaluate = E lē mafai ona foki te fakatuha he auā e lē mafai ona iloilo te fakatuha: { $equation }

math-operators-operand-number-required = E tatau ona fakamaoti he operandNumber kafai e ave kehe he operand matematika.

eigen-decomposition-failed = E lē mafai ona fuafua nā tau eigen o te matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: e lē i ai te parameter { $parameters } i te mamanu, ko lāhē ka fetaui pea ma he avanoa gaogao.

## `<graph>`

graph-grid-invalid = `<graph>`: e lē mafai ona fakauiga te grid="{ $grid }". E tatau ona ko he none, medium, dense, pe ko ni numela lelei e lua kua vahega i he avanoa, e pēnā mo te grid="1 0.5". E leai he mata e tuhi.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    E manakomia e te `<{ $component }>` he gāluega e { $expected ->
        [one] tahi tena fakaiuga, ko te hakega y' i poini takitahi, e pēnā mo te `y - x`
       *[other] lua ona fakaiuga, ko te veta i poini takitahi, e pēnā mo te `(y, -x)`
    }, kae e { $found } ona fakaiuga o te gāluega na tuku ki ei. { $alternative ->
        [none] E leai he mea e tuhi.
       *[other] Ko te `<{ $alternative }>` te vaega mo te gāluega tēnā. E leai he mea e tuhi.
    }

field-function-attribute-ignored-with-child = E lē amanakia te uiga `function` he auā kua tuku foki te gāluega i loto o te vaega; ko te mea i loto e fakaaogā. Tuku te gāluega i he tahi na auala.

field-variables-ignored =
    `<{ $component }>`: e fakaigoa e te uiga `variables` nā huiga o he fakamatalaga na tuhi tonu i loto o te vaega. { $reason ->
        [function-child] Ko te gāluega i heinei kua tuku o he fanau `<function>`, e fakaigoa e ia ona lava huiga, ko lāhē e lē amanakia te `variables`.
       *[no-expression] E leai he fakamatalaga pēnā i heinei, ko lāhē e lē amanakia te `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: e lē lagolagoina te xLabelPosition="left" i te renderer prefigure; ka fakaaogā te amio o te tulaga tautau.

prefigure-y-label-position-unsupported = `<graph>`: e lē lagolagoina te yLabelPosition="bottom" i te renderer prefigure; ka fakaaogā te amio o te tulaga i luga.

prefigure-invalid-axis-bounds = `<graph>`: e lē hako nā tapulaka o te axis mo te liuaga ki te prefigure; ka fakaaogā te bbox masani (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: e lē hako te lautele mo te liuaga ki te prefigure; ka fakaaogā te lautele masani o te ata 425.

prefigure-invalid-aspect-ratio = `<graph>`: e lē hako te aspectRatio mo te liuaga ki te prefigure; ka fakaaogā te fuataga masani 1.

prefigure-grid-spacing-too-fine = `<graph>`: kua vāpipi tele te vā o te mata mo nā tapulaka o te axis; e ave kehe te mata i te renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: e lē fakaalia nā fakamatalaga kafai e lē fakaaogāina te renderer PreFigure.

multiple-annotations-children = E uke fanau `<annotations>` na maua i loto o te `<graph>`; e lē amanakia uma vagana ko te mea fakamuli.

## Referring to other components

copy-unrecognized-component-type = E lē mafai ona fakalautele pe kopi he ituaiga vaega e lē iloa: { $type }.

copy-prop-not-found = E lē maua te prop { $property } i he vaega ituaiga { $component }

collect-no-source = E leai he puna na maua mo te collect.

collect-invalid-component-type = E lē mafai ona aoaki vaega ituaiga `<{ $component }>` he auā ko he ituaiga vaega e lē hako.

reference-index-unavailable = E lē mafai ona fakahino ki te index `{ $reference }`

## `<callAction>`

component-action-unavailable = E lē mafai ona valo te { $action } i luga o te vaega `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = E lē hako te foliga o nā fakamaumauga. E lē tutuha te umi o laina. Na maua i te componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = E tutuha ni igoa koluma o nā fakamaumauga. Na maua i te componentIdx :{ $componentIdx }

data-frame-missing-column-name = E leai he igoa koluma o nā fakamaumauga. Na maua i te componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ko te award mo te tali nei e fakavae ki te tali na lafo e te answer lava ia, ka oko ai ki he amio e lē fakamoemoeina.

answer-max-num-attempts-in-section-wide-check-work = E leai he aogā o te fakatūga o te `maxNumAttempts` i luga o he `<answer>` i loto o he pusa e i ai te `sectionWideCheckWork`, he auā e pule te pusa ki te aofaki o taumafai. Fakatū te `maxNumAttempts` i luga o te pusa.

nested-section-wide-check-work-max-num-attempts = E leai he aogā o te fakatūga o te `maxNumAttempts` i luga o he pusa e i ai te `sectionWideCheckWork` e i loto o he tahi pusa e i ai foki te `sectionWideCheckWork`, he auā e pule te pusa i tua ki te aofaki o taumafai. Fakatū te `maxNumAttempts` i luga o te pusa i tua.

answer-attributes-need-symbolic-equality = E leai he aogā o te uiga { $attributes } kafai e lē fakatūina te symbolicEquality.

answer-invalid-type = E lē hako te ituaiga mo te answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = He auā e leai he igoa o te vaega `<{ $component }>`, e lē mafai ona fakaaogā mo he uiga o he module

module-attribute-name-already-defined = E lē mafai ona fakaaogā te vaega `<{ $component } name="{ $name }">` mo he uiga o he module he auā kua i ai i te ituaiga `<module>` te uiga "{ $name }".

conditional-content-condition-ignored = E lē amanakia te uiga `condition` i luga o he vaega `<conditionalContent>` e i ai ni fanau case pe else.

slider-markers-type-mismatch = E lē fetaui te ituaiga o nā fakailoga ma te ituaiga o te slider.

pretzel-problem-needs-statement-and-answer = E lē hako te pretzel: e tatau i `<problem>` takitahi ona i ai he `<statement>` e tahi ma he `<answer>` e tahi.

pretzel-circuit-first-problem-distractor = E lē hako te pretzel: i te mode="circuit", e lē mafai e te `<problem>` muamua ona fai mo distractor.

## Attribute values

attribute-invalid-values = E lē hako te tau { $values } mo te uiga `{ $attribute }`; e lē amanakia.

attribute-must-be-references = E lē hako te tau `{ $value }` mo te uiga `{ $attribute }`. E tatau ona fauhia te uiga i ni fakahinomaga e kamata i he `$`.

math-input-invalid-function-names = <mathInput>: e lē amanakia igoa gāluega e lē hako i loto o te { $attribute }: { $names }. E tatau i te vaega fakaali o igoa takitahi ona 2 matakituhi i te itiiti ifo (matakituhi pe ni laina poto); e mafai ona hoko mai te `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = E lē hako te ituaiga vaega: `<{ $componentType }>`

attribute-repeated = E lē mafai ona toe fai te uiga { $attribute }.

attribute-invalid-for-component = E lē hako te uiga "{ $attribute }" mo he vaega ituaiga `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    E lē lava te kehekehega o te fakauigaga o te hitaili { $styleNumber } mo te { $context ->
        [text-on-background] lanu o te tuhituhiga ki te lanu o te tua
        [high-contrast] lanu kehekehe maualuga ki te laupapa
        [line] lanu o te laina ki te laupapa
        [marker] lanu o te fakailoga ki te laupapa
       *[text-on-canvas] lanu o te tuhituhiga ki te laupapa
    }{ $mode ->
        [dark] { " (mode pouliuli)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e manakomia te { $threshold }:1 i te itiiti ifo).

style-definition-dark-mode-text-background-contrast =
    E ui kua fakamaoti e te fakauigaga o te hitaili { $styleNumber } ni lanu e lava te kehekehega mo te mode mālamalama, kae e lē lava te kehekehega o nā lanu mo te mode pouliuli na maua mai i nā tau tēnā mo te lanu o te tuhituhiga ki te lanu o te tua ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e manakomia te { $threshold }:1 i te itiiti ifo). { $suggestion ->
        [available] Ke lava te kehekehega i te mode pouliuli, fakatele te kehekehega i te mode mālamalama (mo he fakataitaiga, fakatū { $lightAttribute }="{ $lightColor }") pe hui te lanu o te mode pouliuli (mo he fakataitaiga, fakatū { $darkAttribute }="{ $darkColor }").
       *[none] Ke lava te kehekehega i te mode pouliuli, fakatele te kehekehega i te mode mālamalama pe hui nā lanu na maua mai i te textColorDarkMode ma/pe ko te backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    E ui kua fakamaoti e te fakauigaga o te hitaili { $styleNumber } he lanu tuhituhiga e lava te kehekehega mo te mode mālamalama, kae e lē lava te kehekehega o te lanu tuhituhiga mo te mode pouliuli na maua mai i te tau tēnā ki te laupapa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e manakomia te { $threshold }:1 i te itiiti ifo). { $suggestion ->
        [available] Ke lava te kehekehega i te mode pouliuli, fakatele te kehekehega i te mode mālamalama (mo he fakataitaiga, fakatū textColor="{ $lightColor }") pe hui te lanu o te mode pouliuli (mo he fakataitaiga, fakatū textColorDarkMode="{ $darkColor }").
       *[none] Ke lava te kehekehega i te mode pouliuli, fakatele te kehekehega i te mode mālamalama pe hui te lanu na maua mai i te textColorDarkMode.
    }

section-multiple-style-palettes = E na ko te tahi <stylePalette> e mafai e he vaega ona filifili; ka fakaaogā te mea fakamuli.

## Unique variants

variant-num-to-select-not-non-negative-integer = e lē mafai ona fakamaoti nā variant tulaga kehe o te { $component } he auā e lē ko he numela kātoa e lē maualalo ifo i te 0 te numToSelect.

variant-num-to-select-not-constant-number = e lē mafai ona fakamaoti nā variant tulaga kehe o te { $component } he auā e lē ko he numela tumau te numToSelect.

variant-with-replacement-not-constant-boolean = e lē mafai ona fakamaoti nā variant tulaga kehe o te { $component } he auā e lē ko he boolean tumau te withReplacement.

variant-select-weight-disables-unique = E tape nā variant tulaga kehe mo te select kafai e i ai he option kua fakamaoti ai te selectWeight pe ko te selectForVariants

variant-coprime-undetermined = e lē mafai ona fakamaoti nā variant tulaga kehe o te { $component } he auā e lē mafai ona fakamaoti e hehē pea te coprime.

variant-attribute-not-constant = e lē mafai ona fakamaoti nā variant tulaga kehe o te { $component } he auā e lē tumau te { $attribute }.

variant-attribute-not-number = e lē mafai ona fakamaoti nā variant tulaga kehe o te { $component } he auā e lē ko he numela te { $attribute }.

variant-attribute-wrong-type-for-sequence =
    e lē mafai ona fakamaoti nā variant tulaga kehe o te { $component } ituaiga { $type } he auā e lē ko he { $expected ->
        [letters-combination] tukufakatahiga o matakituhi
        [math-expression] fakamatalaga matematika hako
        [integer] numela kātoa
       *[number] numela
    } te { $attribute }.

variant-length-not-integer = e lē mafai ona fakamaoti nā variant tulaga kehe o te { $component } he auā e lē ko he numela kātoa te length.

variant-sort-not-implemented = e heki fai nā variant tulaga kehe o he { $component } ma te sort

variant-exclude-combinations-not-implemented = e heki fai nā variant tulaga kehe o he { $component } ma te excludeCombinations

variant-math-exclude-not-implemented = e heki fai nā variant tulaga kehe o he { $component } ituaiga math ma te exclude

variant-non-constant-exclude-not-implemented = e heki fai nā variant tulaga kehe o he { $component } ma he exclude e lē tumau

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: e lē lagolagoina i te renderer prefigure o te graph; kua tuku kehe te huli.

prefigure-descendant-invalid-geometry = { $subject }: ko he geometry e lē gata pe lē kātoa; kua tuku kehe te huli.

prefigure-curve-label-omitted = { $subject }: e lē lagolagoina ni igoa i luga o vaega piko kua liua; kua ave kehe te igoa.

prefigure-curve-unsupported-definition-type = { $subject }: e lē lagolagoina te ituaiga fakauigaga gāluega piko '{ $definitionType }'; kua tuku kehe te huli.

prefigure-region-flip-functions-unsupported = { $subject }: e lē lagolagoina te uiga flipFunctions i luga o te regionBetweenCurves; kua tuku kehe te huli.

prefigure-region-non-formula-child = { $subject }: e na ko gāluega fanau ituaiga fua fakatatau e lagolagoina i luga o te regionBetweenCurves; kua tuku kehe te huli.

prefigure-label-position-unsupported =
    { $subject }: e lē lagolagoina te labelPosition '{ $labelPosition }' mo te { $labelKind ->
        [line-family] igoa o te kāiga laina
       *[point] igoa poini
    }; ka fakaaogā te fakatulagaga masani a PreFigure.

prefigure-fill-style-unsupported = { $subject }: e lē lagolagoina e PreFigure te hitaili fakatumu '{ $fillStyle }'; ka toe foki ki he fakatumu kātoa.

prefigure-line-style-unknown = { $subject }: e lē iloa te hitaili laina '{ $lineStyle }', kua ave kehe mai te fakaiuga a PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: kua liua te hitaili fakailoga '{ $markerStyle }' ki te hitaili 'diamond' a PreFigure.

prefigure-marker-style-unsupported = { $subject }: e lē lagolagoina e PreFigure te hitaili fakailoga '{ $markerStyle }'; ka fakaaogā te hitaili masani.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: e lē hako te `ref`; e lē maua te target. Kua ave kehe te fakamatalaga.

annotation-ref-multiple-targets = `<annotation>`: kua fakahino te `ref` ki ni target e uke; ka fakaaogā te target muamua.

annotation-ref-outside-graph = `<annotation>`: e lē hako te `ref`; e i tua o te graph te target. Kua ave kehe te fakamatalaga.

annotation-ref-unsupported-target = `<annotation>`: e lē hako te `ref`; e lē ko he mea ata e lagolagoina i te liuaga ki te prefigure te target. Kua ave kehe te fakamatalaga.

annotation-text-missing = `<annotation>`: kua galo pe gaogao te `text`; ka tuku atu he tuhituhiga gaogao.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kua maua he fakalagolago takamilo.
       *[other] Kua maua he fakalagolago takamilo e aofia ai te vaega `<{ $componentType }>`.
    }

reference-no-referent = E leai he mea na maua e fakahino ki ei te fakahinomaga: `{ $reference }`

reference-multiple-referents = E uke mea na maua e fakahino ki ei te fakahinomaga: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = E lē hako te fakatulagaga o te uiga { $attribute } o te `<{ $componentType }>`.

children-invalid = E lē hako nā fanau mo te `<{ $componentType }>`: na maua ni fanau e lē hako: { $children }

## Falling back to a default

attribute-value-invalid-using-default = E lē hako te tau `{ $value }` mo te uiga `{ $attribute }`, ka fakaaogā te tau `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] E lē maua te DoenetML lomiga { $version }.
       *[other] E lē maua te DoenetML lomiga { $version }. Ka toe foki ki te lomiga { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML e lē hako: { $content }

parse-tag-missing-close-tag = DoenetML e lē hako: E leai he tag tapuni o te tag `{ $tag }`. Na fakamoemoe ki he tag e tapuni ia lava pe ko he tag `</{ $tagName }>`.

parse-tag-error = DoenetML e lē hako: E i ai he mea hehē i te tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML e lē hako: E foliga mai kua galo he tau o te uiga e lē hako `{ $attribute }`.

parse-attribute-invalid = DoenetML e lē hako: E lē hako te uiga `{ $attribute }`

parse-attribute-value-invalid = DoenetML e lē hako: E lē hako te tau o te uiga `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML e lē hako: E lē hako te tau o te uiga `{ $value }`. E lē fetaui nā fakailoga tautau. E foliga mai kua galo he `{ $quote }`

parse-open-tag-name-missing = DoenetML e lē hako: Na maua he tag e leai hana igoa, e pēnā mo te `<`

parse-tag-not-closed = DoenetML e lē hako: E heki tapunia te tag `{ $tag }` (e foliga mai kua galo he `>`).

parse-self-closing-tag-name-missing = DoenetML e lē hako: Na maua he tag e leai hana igoa `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML e lē hako: E heki tapunia te tag `{ $tag }` (e foliga mai kua galo he `/>`).

parse-tag-invalid-attributes = DoenetML e lē hako: E lē hako te tag `{ $tag }`. Kāiga e hehē ona uiga.

parse-close-tag-name-missing = DoenetML e lē hako: Na maua he tag tapuni e leai hana igoa, e pēnā mo te `</`

parse-attribute-value-unquoted = E tatau ona tuku nā tau o uiga i loto o ni fakailoga tautau: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML e lē hako: Na maua te tag tapuni `{ $tag }`, kae e leai he tag tatala e fetaui

parse-close-tag-mismatched = DoenetML e lē hako: E lē fetaui te tag tapuni. Na fakamoemoe ki te `</{ $expected }>`. Na maua te `{ $found }`

parser-node-unconvertible = E lē mafai ona liua te node { $node } ki he node Dast.

## Names

name-attribute-invalid =
    E lē hako te uiga name='{ $name }'. { $reason ->
        [characters] E na ko matakituhi, numela, laina i lalo pe laina poto e mafai ona i ai i igoa.
       *[start] E tatau ona kamata nā igoa i he matakituhi.
    }

component-name-invalid-start = E lē hako te igoa vaega "{ $name }". E tatau ona kamata nā igoa i he matakituhi.

## `<answer>` sugar

answer-video-watched-missing-video = E tatau i he answer ituaiga videoWatched ona i ai he uiga video

answer-video-watched-video-not-reference = E tatau i he answer ituaiga videoWatched ona i ai he uiga video e ko he fakahinomaga

answer-name-not-single-text = E tatau i te uiga name o te answer ona i ai he fanau tuhituhiga e tahi

## Referencing another document

external-doenetml-recursion-limit = E lē mafai ona tō mai te DoenetML mai tua he auā kua uke naua nā tulaga o te toe faiga. Pe i ai he fakahinomaga takamilo?

external-doenetml-unavailable = E lē mafai ona tō mai te DoenetML mai te { $attribute }="{ $uri }"

external-doenetml-type-mismatch = E lē hako te DoenetML na tō mai te { $attribute }="{ $uri }": e lē fetaui ma te ituaiga vaega "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Kua lē toe fakaaogāina te uiga `{ $from }`; fakaaogā te `{ $to }`.
       *[other] [deprecation] Kua lē toe fakaaogāina te uiga `{ $from }` i luga o te `<{ $component }>`; fakaaogā te `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Kua lē toe fakaaogāina ma kua lē amanakia te uiga `{ $from }` he auā kua fakamaoti foki te `{ $to }`.
       *[other] [deprecation] Kua lē toe fakaaogāina ma kua lē amanakia te uiga `{ $from }` i luga o te `<{ $component }>` he auā kua fakamaoti foki te `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Kua lē toe fakaaogāina ma kua lē amanakia te uiga `{ $attribute }` i luga o te `<{ $component }>`.

deprecated-attribute-to-child = [deprecation] Kua lē toe fakaaogāina te uiga `{ $attribute }` i luga o te `<{ $component }>`; fakaaogā he fanau `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Kua lē toe fakaaogāina te tau `{ $value }` o te uiga `{ $attribute }` i luga o te `<{ $component }>`; fakaaogā te `{ $to }`.


## Language coverage

pluralize-english-only = E na ko te fakaPeletania e mafai e te `<pluralize>` ona fakauke, ko lāhē e tuku tana tuhituhiga e lē hui i he pepa na tuhi i te { $locale }. Tuhi tonu te foliga uke, pe fakatū i te uiga `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ko te element `<{ $tag }>` e lē ko he element Doenet e iloa.

schema-element-not-allowed-at-root = E lē fakatagaina te element `<{ $tag }>` i te aka o te pepa.

schema-element-not-allowed-inside = E lē fakatagaina te element `<{ $tag }>` i loto o te `<{ $parent }>`.

schema-attribute-unrecognized = E leai he uiga e igoa ki te `{ $attribute }` o te element `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] E tatau i te uiga `{ $attribute }` o te element `<{ $tag }>` ona ko he lisi e tahi o nei mea takitahi ona vaega: { $allowed }
       *[other] E tatau i te uiga `{ $attribute }` o te element `<{ $tag }>` ona ko he tahi o nei: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = E lē hako te igoa variant mo te select. E aliali te igoa variant { $variantName } i option e { $numOptions } kae ko te aofaki e filifili ko te { $numToSelect }.

select-variant-name-without-options = Kua fakamaoti ni variant mo te select kae e leai he option mo te igoa variant e mafai: { $variantName }.

select-variant-name-not-possible = Ko te igoa variant { $variantName } na fakamaoti mo te select e lē ko he igoa variant e mafai.

select-too-few-options = E lē mafai ona filifili vaega e { $numToSelect } mai te { $numOptions } e na ko ia.

select-from-sequence-too-few-values = E lē mafai ona filifili tau e { $numToSelect } mai he fakahologa e umi { $length }.

select-from-sequence-indices-count-mismatch = E tatau i te aofaki o indices na fakamaoti mo te select ona tutuha ma te aofaki e filifili

select-from-sequence-indices-not-integers = E tatau i indices uma na fakamaoti mo te select ona ko ni numela kātoa

select-from-sequence-index-excluded = Kua ave kehe te index na fakamaoti mo te selectfromsequence

select-from-sequence-indices-excluded-combination = Ko nā indices na fakamaoti mo te selectfromsequence ko he tukufakatahiga na ave kehe

select-from-sequence-coprime-not-positive-integers = E lē mafai ona filifili tukufakatahiga coprime he auā e lē o filifilia ni numela kātoa lelei.

select-from-sequence-coprime-common-factor = E lē mafai ona filifili numela coprime. E i ai he vaega tutuha o nā tau uma e mafai. (E tatau i nā tau "from" pe "to" na fakamaoti ona coprime ma te "step".)

select-from-sequence-coprime-single-number = E lē mafai ona filifili tukufakatahiga coprime mai he numela e tahi e lē ko te 1.

select-from-sequence-excluded-too-many-combinations = Kua hili atu i te 70% o nā tukufakatahiga na ave kehe i te selectFromSequence

select-from-sequence-coprime-none-found = E lē mafai ona filifili numela coprime. E i ai he vaega tutuha o nā tau uma e mafai.

select-from-sequence-too-few-unique-values = E lē mafai ona filifili tau tulaga kehe e { $numToSelect } mai he fakahologa e umi { $numPossibleValues }

select-prime-numbers-too-few-values = E lē mafai ona filifili tau e { $numToSelect } mai he lisi o numela muamua e umi { $numValues }

select-prime-numbers-values-count-mismatch = E tatau i te aofaki o tau na fakamaoti mo te select ona tutuha ma te aofaki e filifili

select-prime-numbers-values-not-prime = E tatau i tau uma na fakamaoti mo te select numela muamua ona i ai i te lisi o numela muamua

select-prime-numbers-values-excluded-combination = Ko nā tau na fakamaoti mo te selectPrimeNumbers ko he tukufakatahiga na ave kehe

select-prime-numbers-excluded-too-many-combinations = Kua hili atu i te 70% o nā tukufakatahiga na ave kehe i te selectPrimeNumbers

select-random-combination-fluke = He auā ko he mea e hēai lava e tupu, e heki mafai ona filifili he tukufakatahiga o tau fakafuaheki

select-random-value-fluke = He auā ko he mea e hēai lava e tupu, e heki mafai ona filifili he tau fakafuaheki

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    E lē tuhi te `<{ $component }>` i loto o te matematika; ka fakatū te fakamatalaga e pēnā mo te taimi na heki mafai ai ona tuku ni fakaofiga ki loto. { $reason ->
        [not-inline] E na ko he choice input `inline` e ofi ki loto o he fakamatalaga; kafai e leai he `inline` ko he poloka o kiliki.
        [expanded] Ko he text input `expanded` ko he pusa e uke ona laina, e lahi tele ke nofo i loto o he fakamatalaga.
        [on-graph] I luga o he graph e tuhi te fakamatalaga o he ata e tahi, e leai hona avanoa mo he mea pule.
       *[relative-width] Ko tona `width` e fakatuha (ko he pahene pe ko he `em`), e leai hana mea e fua ki ei i loto o he fakamatalaga. Tuku te lautele i ni fua tumau, e pēnā mo te `px`.
    }
