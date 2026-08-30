# Northern Kurdish (Kurmanji) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Named `kmr`, not `ku`.** `ku` is the macrolanguage over Northern, Central
# and Southern Kurdish, and Central Kurdish (Sorani) ships beside this catalog
# as `locales/ckb`; a directory called `ku` would claim to cover a sibling it
# cannot serve. `negotiate.ts` aliases `ku` onto `kmr`, so a document written
# with either tag reaches this catalog. See `locales/kmr/content.ftl` for the
# full note.
#
# Northern Kurdish (Kurmanji) in the Hawar Latin alphabet — the orthography
# Kurmanji publishing uses in Turkey, Syria and the diaspora, and what CLDR
# fills a bare `ku` in as (`ku` maximizes to `ku-Latn-TR`). This catalog is
# **left to right**; a reader arriving under `ku-Arab` reaches it and gets
# Latin, and the answer to that is a second catalog beside this one rather than
# a rename of it. Central Kurdish (Sorani) is `locales/ckb`, a separate
# right-to-left catalog.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Kurmanji counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` keeps the shape English gives it. The direct-case plural is
# unmarked, so several of those pairs differ only in the verb agreeing with the
# count, and a few read alike.
#
# Kurmanji's gender agreement does not reach this file: nothing here describes
# a noun the catalog itself supplies, so no message forks. The fork lives in
# `content.ftl`, on the ezafe particle, and that file's header says why.
#
# The technical vocabulary is the one Kurdish computing prose uses:
# «pêkhate» component, «taybetmendî» attribute, «hêman» element, «guhêrbar»
# variable, «referans» reference, «nirx» value.

## `<lineSegment>`

# $attributes is a list of attribute names; $attributesCount is its length.
line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] gava du xalên dawî bên diyarkirin { $attributes } tê paşguhkirin
       *[other] gava du xalên dawî bên diyarkirin { $attributes } tên paşguhkirin
    }

# $attributes is a list of attribute names; $attributesCount is its length.
line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] gava hem xaleke dawî hem jî xala navîn bên diyarkirin { $attributes } tê paşguhkirin
       *[other] gava hem xaleke dawî hem jî xala navîn bên diyarkirin { $attributes } tên paşguhkirin
    }

line-segment-midpoint-offset-without-midpoint = bêyî xaleke navîn midpointOffset bandorê nake

## `<line>`

line-points-undetermined-dimensions = Xêz di nav xalên bi dîmensiyonên nediyar re derbas dibe.

line-points-too-few-dimensions = Divê xêz di nav xalên bi kêmî du dîmensiyonan re derbas bibe.

# $variables is a bare enumeration of variable names, not an "and" list.
line-points-depend-on-variables = Xêz di nav xalên ku bi van guhêrbaran ve girêdayî ne re derbas dibe: { $variables }.

line-equation-invalid-format = Formata hevkêşeya xêzê ya bi guhêrbarên { $variable1 } û { $variable2 } nederbasdar e.

## `<ray>`

ray-overprescribed-through = Tîrêj bi through, endpoint û direction ve hatiye diyarkirin.  Through ya diyarkirî tê paşguhkirin.

ray-dimension-mismatch = Di tîrêjê de numDimensions li hev nake.

## `<vector>`

vector-overprescribed-head = Vektor bi head, tail û displacement ve hatiye diyarkirin.  Head ya diyarkirî tê paşguhkirin.

vector-dimension-mismatch = Di vektorê de numDimensions li hev nake.

## Attracting and constraining

# $component is the DoenetML tag of the child that was named, e.g. "polygon".
attract-to-without-nearest-point = Nikare ber bi `<{ $component }>` ve bikişîne, ji ber ku guhêrbara rewşê ya nearestPoint tune.

constrain-to-without-nearest-point = Nikare bi `<{ $component }>` ve sînordar bike, ji ber ku guhêrbara rewşê ya nearestPoint tune.

constrain-to-interior-without-nearest-point = Nikare bi hundirê `<{ $component }>` ve sînordar bike, ji ber ku guhêrbara rewşê ya nearestPoint tune.

## `<choiceInput>`

# Translators: `labelPosition` is an attribute name and stays in English.
choice-input-label-position-ignored = ji bo choiceInput ya ne-inline labelPosition tê paşguhkirin

## Ordering children by index

choice-input-indices-count-mismatch = Ji bo choiceInput îndeksên diyarkirî tên paşguhkirin, ji ber ku hejmara îndeksan bi hejmara zarokên choice re li hev nake.

pretzel-indices-count-mismatch = Ji bo problem îndeksên diyarkirî tên paşguhkirin, ji ber ku hejmara îndeksan bi hejmara zarokên problem re li hev nake.

shuffle-indices-count-mismatch = Ji bo shuffle îndeksên diyarkirî tên paşguhkirin, ji ber ku hejmara îndeksan bi hejmara pêkhateyan re li hev nake.

# $component is `choiceInput`, `pretzel` or `shuffle` — a DoenetML component
# name, so it stays in English.
indices-ignored-out-of-range = Ji bo { $component } îndeksên diyarkirî tên paşguhkirin, ji ber ku hin îndeks derveyî navberê ne.

pretzel-indices-repeated = Ji bo pretzel îndeksên diyarkirî tên paşguhkirin, ji ber ku hin îndeks dubare ne.

pretzel-circuit-first-index = Ji bo pretzel ya di moda circuit de îndeksên diyarkirî tên paşguhkirin, ji ber ku divê îndeksa yekem 1 be.

## `<shuffle>` and `<sort>`

# $component is `shuffle` or `sort`.
string-children-need-type = Ji bo ku `<{ $component }>` bi zarokên rêzikê re bixebite, divê taybetmendiya `type` bê diyarkirin.

# $type is what the author wrote; math, text, number and boolean are attribute
# values and stay in English.
invalid-type-defaulting-to-math = Ji bo pêkhateya { $component } cureyê { $type } nederbasdar e. Divê yek ji van be: math, text, number an boolean. Math tê bikaranîn.

# $value is the string child that could not be used.
string-not-valid-component-to-arrange = Rêzika "{ $value }" ji bo { $component } ne pêkhateyeke derbasdar e. Tê paşguhkirin.

## Types and variables

invalid-type-defaulting-to-number = Cureyê { $type } nederbasdar e, cure wekî number tê danîn.

invalid-variable-value = Nirxa guhêrbarê nederbasdar e: `{ $value }`

## Variants

# $index is what the author wrote, reproduced verbatim rather than as a number.
variant-index-must-be-number = Divê îndeksa varyantê { $index } hejmarek be

variant-index-must-be-integer = Divê îndeksa varyantê { $index } hejmareke tam be

## `<sideBySide>`

# $component is `sideBySide` or `sbsGroup`.
side-by-side-absolute-widths = `<{ $component }>` ji bo pîvanên mutleq nehatiye pêkanîn. Firehî wekî nisbî tên danîn.

side-by-side-absolute-margins = `<{ $component }>` ji bo pîvanên mutleq nehatiye pêkanîn. Kêlek wekî nisbî tên danîn.

side-by-side-no-block-child = `<{ $component }>` nederbasdar e: divê bi kêmî zarokeke blokê hebe.

## `<label>`

# Translators: `for` is an attribute name and stays in English.
label-for-ignored-on-graphical = Taybetmendiya `for` ya li ser `<label>` ya grafîkî tê paşguhkirin.

label-for-must-resolve-to-one = Divê taybetmendiya `for` ya li ser `<label>` tenê bibe yek pêkhate.

label-for-unresolved = Taybetmendiya `for` ya li ser `<label>` nehate girêdan bi tu pêkhateyekê.

label-for-answer-with-authored-inputs = Taybetmendiya `for` ya li ser `<label>` referansê dide `<answer>`-ekê ku têketinên wê bi eşkereyî hatine nivîsîn; rasterast referansê bide têketinê.

label-for-answer-without-input = Taybetmendiya `for` ya li ser `<label>` referansê dide `<answer>`-ekê ku têketineke wê ya bi navnîşan tune.

label-for-must-reference-input-or-answer = Divê taybetmendiya `for` ya li ser `<label>` referansê bide têketinekê an bersivekê.

## Accessibility

# $component is a DoenetML tag, e.g. "graph" or "image".
accessibility-short-description-or-decorative = Ji bo gihîştinê, divê `<{ $component }>` an danasîneke kurt hebe an jî wekî xemilandin bê diyarkirin.

accessibility-video-short-description = Ji bo gihîştinê, divê `<video>` danasîneke kurt hebe.

accessibility-input-short-description-or-label = Ji bo gihîştinê, divê `<{ $component }>` danasîneke kurt an etîketek hebe.

accessibility-answer-input-short-description-or-label = Ji bo gihîştinê, divê `<answer>`-a ku têketinekê çêdike danasîneke kurt an etîketek hebe.

accessibility-short-description-contains-math = Divê danasînên kurt pêkhateyên matematîkî yên wekî `<{ $component }>` nehewînin. Matematîkê bi peyvan binivîse.

# $colorName is an attribute name and stays in English.
accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ji bo nivîsa sernavê beşê kontrasteke têrê nake (moda tarî) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bi kêmî { $threshold }:1 divê).
       *[other] { $colorName } ji bo nivîsa sernavê beşê kontrasteke têrê nake ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bi kêmî { $threshold }:1 divê).
    }

## `<circle>`

# $count is the number of through points.
circle-through-points-non-numerical = `<circle>`-a di nav { $count } xalan re, gava xal nirxên hejmarî nînin, nehatiye pêkanîn.

circle-too-many-through-points = Nikare bazineyeke di nav zêdetirî 3 xalan re hesab bike.

circle-overprescribed-radius-center-points = Nikare bazineyeke bi tîrêj, navend û xalên diyarkirî hesab bike.

circle-center-with-multiple-points = Nikare bazineyeke bi navenda diyarkirî di nav zêdetirî 1 xalê re hesab bike.

# $distance and $radius arrive as strings, not numbers.
circle-radius-too-small = Nikare bazineyê hesab bike: ji ber ku dûrahiya di navbera her du xalan de { $distance } e, tîrêja diyarkirî { $radius } pir biçûk e.

circle-radius-with-many-points = Nikare bazineyeke bi tîrêja diyarkirî di nav zêdetirî du xalan re çêbike.

circle-invalid-center-or-through-points = Navend an xalên derbasbûnê yên bazineyê nederbasdar in.

circle-radius-center-with-multiple-points = Nikare tîrêja bazineya bi navenda diyarkirî di nav zêdetirî 1 xalê re hesab bike.

circle-change-radius-non-numerical = Nikare tîrêja bazineya bi xalên nehejmarî biguherîne

circle-radius-with-points-non-numerical = Gava nirxên hejmarî tune bin, nikare bazineyeke bi tîrêja diyarkirî di nav zêdetirî yek xalê re çêbike.

circle-change-center-non-numerical = Guherandina navenda bazineya di nav xalên bi nirxên nehejmarî re nehatiye pêkanîn.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ji bo fonksiyonê dîmensiyonên domênê têrê nakin. Domên { $intervals } navber heye lê fonksiyonê { $inputs ->
            [one] { $inputs } têketin
           *[other] { $inputs } têketin
        } heye.
       *[other] Ji bo fonksiyonê dîmensiyonên domênê têrê nakin. Domên { $intervals } navber hene lê fonksiyonê { $inputs ->
            [one] { $inputs } têketin
           *[other] { $inputs } têketin
        } heye.
    }

function-domain-invalid-format = Formata domêna fonksiyonê nederbasdar e.

# $type selects the wording rather than being substituted into it.
function-ignoring-non-numerical =
    { $type ->
        [maximum] Maksîmuma nehejmarî ya fonksiyonê tê paşguhkirin.
        [minimum] Mînîmuma nehejmarî ya fonksiyonê tê paşguhkirin.
        [extremum] Ekstremuma nehejmarî ya fonksiyonê tê paşguhkirin.
        [point] Xala nehejmarî ya fonksiyonê tê paşguhkirin.
        [slope] Hêla nehejmarî ya fonksiyonê tê paşguhkirin.
       *[other] { $type }-a nehejmarî ya fonksiyonê tê paşguhkirin.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Maksîmuma vala ya fonksiyonê tê paşguhkirin.
        [minimum] Mînîmuma vala ya fonksiyonê tê paşguhkirin.
        [extremum] Ekstremuma vala ya fonksiyonê tê paşguhkirin.
        [point] Xala vala ya fonksiyonê tê paşguhkirin.
       *[other] { $type }-a vala ya fonksiyonê tê paşguhkirin.
    }

function-points-too-close = Fonksiyon du xalên ku cihên wan pir nêzîkî hev in dihewîne. Fonksiyon nayê pênasekirin.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Dubarekirinên fonksiyonê tenê gava hejmara têketinan bi hejmara derketinan re wekhev be pêkan in. Vê fonksiyonê { $inputs } têketin û { $outputs ->
            [one] { $outputs } derketin
           *[other] { $outputs } derketin
        } hene.
       *[other] Dubarekirinên fonksiyonê tenê gava hejmara têketinan bi hejmara derketinan re wekhev be pêkan in. Vê fonksiyonê { $inputs } têketin û { $outputs ->
            [one] { $outputs } derketin
           *[other] { $outputs } derketin
        } hene.
    }

## `<sequence>`

sequence-invalid-length = Dirêjahiya rêzeyê nederbasdar e.  Divê hejmareke tam a ne-neyînî be.

# $type is a sequence type: number, letters, or math.
sequence-invalid-step = Gava rêzeyê nederbasdar e.  Ji bo rêzeya bi cureyê { $type } divê hejmarek be.

# $attribute is `from` or `to` — an attribute name, so it stays in English.
sequence-invalid-endpoint-number = "{ $attribute }" ya rêzeya hejmaran nederbasdar e.  Divê hejmarek be.

sequence-invalid-endpoint-letters = "{ $attribute }" ya rêzeya tîpan nederbasdar e.  Divê hevgirtineke tîpan be.

sequence-invalid-endpoint = "{ $attribute }" ya rêzeyê nederbasdar e.

select-from-sequence-coprime-not-numbers = ji ber ku hejmar nayên hilbijartin coprime tê paşguhkirin

select-from-sequence-coprime-with-exclude-combinations = ji ber ku excludeCombinations hatiye diyarkirin coprime tê paşguhkirin

## Resolving a `target`

target-not-found = Ji bo `<{ $source }>` armanc nederbasdar e: armanc nayê dîtin.

# $property is the state variable that was looked for.
target-state-variable-not-found = Ji bo `<{ $source }>` armanc nederbasdar e: li ser `<{ $component }>`-ekê guhêrbareke rewşê bi navê "{ $property }" nayê dîtin.

## `<odeSystem>`

ode-system-variables-match-independent = Divê guhêrbarên `<odeSystem>` ji guhêrbara serbixwe cuda bin.

ode-system-duplicate-variable-names = Bi navên guhêrbarên girêdayî yên dubare fonksiyonên ODE RHS nayên pênasekirin.

ode-system-rhs-function-error = Fonksiyona ODE RHS nayê pênasekirin.  Di çêkirina fonksiyona mathjs de çewtî.

## `<angle>`, `<parabola>`, and `<intersection>`

# $count is how many line children were found.
angle-too-many-lines = Nikare goşeyeke di navbera { $count } xêzan de pênase bike

angle-invalid-through-point = Di through ya `<angle>` de xala nederbasdar

parabola-vertex-too-many-points = Parabola bi kelekê di nav zêdetirî 1 xalê re nehatiye pêkanîn.

parabola-too-many-points = Parabola di nav zêdetirî 3 xalan re nehatiye pêkanîn.

intersection-too-many-items = Ji bo zêdetirî du hêmanan hevbirrîn nehatiye pêkanîn

## Other math components

ionic-compound-not-two-ions = Ji bilî du îyonan, pêkhateya îyonî ji bo tiştekî din nehatiye pêkanîn.

ionic-compound-needs-cation-and-anion = Pêkhateya îyonî tenê ji bo yek katyon û yek anyonê hatiye pêkanîn.

# $equation is the equation as the author wrote it.
solve-equations-cannot-evaluate = Hevkêşe nayê çareserkirin ji ber ku nehate hesibandin: { $equation }

# Translators: `operandNumber` is an attribute name and stays in English.
math-operators-operand-number-required = Gava operandeke matematîkî tê derxistin, divê operandNumber bê diyarkirin.

eigen-decomposition-failed = Nirxên taybet ên matrîsê nehatin hesibandin

## `<matchesPattern>`

# Translators: `parameters` is an attribute name and stays in English.
matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametreya { $parameters } di nexşeyê de dernakeve, loma wê her tim bi valahiyekê re li hev bike.
       *[other] `<matchesPattern>`: parametreyên { $parameters } di nexşeyê de dernakevin, loma wê her tim bi valahiyekê re li hev bikin.
    }

## `<graph>`

# Translators: grid is an attribute name and none, medium and dense are its
# values; all four stay in English, as does the example.
graph-grid-invalid = `<graph>`: grid="{ $grid }" nayê şirovekirin. Divê none, medium, dense an du hejmarên erênî yên bi valahiyekê ji hev cuda be, wekî grid="1 0.5". Tu tor nayê xêzkirin.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` fonksiyoneke bi { $expected ->
        [one] yek derketinê, hêla y' ya li her xalê, wekî `y - x`
       *[other] du derketinan, vektora li her xalê, wekî `(y, -x)`
    } dixwaze, lê fonksiyona ku jê re hatiye dayîn { $found ->
        [one] { $found } derketin
       *[other] { $found } derketin
    } heye. { $alternative ->
        [none] Tiştek nayê xêzkirin.
       *[other] Ji bo wê fonksiyonê pêkhate `<{ $alternative }>` e. Tiştek nayê xêzkirin.
    }

# Translators: retired. `function` is an attribute name and stays in English.
field-function-attribute-ignored-with-child = Taybetmendiya `function` tê paşguhkirin ji ber ku fonksiyon di nav pêkhateyê de jî hatiye dayîn; ya hundir tê bikaranîn. Fonksiyonê tenê bi yek ji van du awayan bide.

# Translators: `variables` and `function` are a DoenetML attribute and tag and
# stay in English, as does $component, the field's own tag.
field-variables-ignored =
    `<{ $component }>`: taybetmendiya `variables` navê guhêrbarên îfadeyeke rasterast di nav pêkhateyê de nivîsandî dide. { $reason ->
        [function-child] Fonksiyon li vir wekî zarokeke `<function>` hatiye dayîn û ew guhêrbarên xwe bi xwe bi nav dike, loma `variables` tê paşguhkirin.
       *[no-expression] Li vir îfadeyeke wisa nehatiye dayîn, loma `variables` tê paşguhkirin.
    }

## PreFigure renderer

# Translators: xLabelPosition, yLabelPosition and their values are attribute
# names and stay in English, as does the renderer's name.
prefigure-x-label-position-unsupported = `<graph>`: di nîşanderê prefigure de xLabelPosition="left" nayê piştgirîkirin; tevgera cihê rastê tê bikaranîn.

prefigure-y-label-position-unsupported = `<graph>`: di nîşanderê prefigure de yLabelPosition="bottom" nayê piştgirîkirin; tevgera cihê jorîn tê bikaranîn.

prefigure-invalid-axis-bounds = `<graph>`: ji bo veguhastina prefigure sînorên tewereyê nederbasdar in; bbox ya standard (-10,-10,10,10) tê bikaranîn.

prefigure-invalid-width = `<graph>`: ji bo veguhastina prefigure firehî nederbasdar e; firehiya diagramê ya standard 425 tê bikaranîn.

prefigure-invalid-aspect-ratio = `<graph>`: ji bo veguhastina prefigure aspectRatio nederbasdar e; rêjeya standard 1 tê bikaranîn.

# Translators: the renderer's name, prefigure, stays in English.
prefigure-grid-spacing-too-fine = `<graph>`: navbera torê ji bo sînorên tewereyê pir teng e; di nîşanderê prefigure de tor tê hiştin.

prefigure-annotations-not-rendered = `<graph>`: gava nîşanderê PreFigure neyê bikaranîn şirove nayên xêzkirin.

multiple-annotations-children = Di `<graph>` de çend zarokên `<annotations>` hatin dîtin; ji bilî ya dawî hemû tên paşguhkirin.

## Referring to other components

copy-unrecognized-component-type = Cureyeke pêkhateyê ya nenas nayê dirêjkirin an kopîkirin: { $type }.

copy-prop-not-found = Li ser pêkhateyeke bi cureyê { $component } prop ya { $property } nehate dîtin

collect-no-source = Ji bo collect tu çavkanî nehate dîtin.

collect-invalid-component-type = Pêkhateyên bi cureyê `<{ $component }>` nayên berhevkirin, ji ber ku ev cureyeke pêkhateyê ya nederbasdar e.

# $reference is the reference exactly as the author wrote it, `$` and all.
reference-index-unavailable = Îndeksa `{ $reference }` referans nayê dayîn

## `<callAction>`

# $action is the `actionName` the author asked for.
component-action-unavailable = { $action } li ser pêkhateya `{ $reference }` nayê bangkirin

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Şiklê daneyan nederbasdar e.  Dirêjahiya rêzan li hev nake. Di componentIdx de hate dîtin :{ $componentIdx }

data-frame-duplicate-column-names = Di daneyan de navên stûnan dubare ne.  Di componentIdx de hate dîtin :{ $componentIdx }

data-frame-missing-column-name = Di daneyan de navê stûnekê kêm e.  Di componentIdx de hate dîtin :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Xelateke vê bersivê li ser bersiva şandî ya `<answer>`-a xwe hatiye avakirin, û ev ê bibe sedema tevgereke nediyar.

# Translators: maxNumAttempts and sectionWideCheckWork are attribute names.
answer-max-num-attempts-in-section-wide-check-work = Danîna `maxNumAttempts` li ser `<answer>`-eke di nav hilgireke bi `sectionWideCheckWork` de bandorê nake, ji ber ku hejmara ceribandinan ji aliyê hilgirê ve tê kontrolkirin. Li şûna wê `maxNumAttempts` li ser hilgirê deyne.

nested-section-wide-check-work-max-num-attempts = Danîna `maxNumAttempts` li ser hilgireke bi `sectionWideCheckWork` ya di nav hilgireke din a bi `sectionWideCheckWork` de bandorê nake, ji ber ku hejmara ceribandinan ji aliyê hilgirê derve ve tê kontrolkirin. Li şûna wê `maxNumAttempts` li ser hilgirê derve deyne.

# $attributes is a list of attribute names; $attributesCount is its length.
answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Bêyî ku symbolicEquality bê danîn, taybetmendiya { $attributes } bandorê nake.
       *[other] Bêyî ku symbolicEquality bê danîn, taybetmendiyên { $attributes } bandorê nakin.
    }

answer-invalid-type = Ji bo bersivê cure nederbasdar e: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ji ber ku pêkhateya `<{ $component }>` navekî wê tune, ew ji bo taybetmendiyeke modulê nayê bikaranîn

module-attribute-name-already-defined = Pêkhateya `<{ $component } name="{ $name }">` wekî taybetmendiyeke modulê nayê bikaranîn, ji ber ku cureyê pêkhateyê ya `<module>` jixwe taybetmendiyeke bi navê "{ $name }" heye.

conditional-content-condition-ignored = Li ser pêkhateyeke `<conditionalContent>` ya bi zarokên case an else, taybetmendiya `condition` tê paşguhkirin.

slider-markers-type-mismatch = Cureyê nîşankeran bi cureyê slider re li hev nake.

pretzel-problem-needs-statement-and-answer = Pretzel nederbasdar e: divê her `<problem>` yek `<statement>` û yek `<answer>` bihewîne.

pretzel-circuit-first-problem-distractor = Pretzel nederbasdar e: di mode="circuit" de `<problem>`-a yekem nikare bibe distractor.

## Attribute values

# $values is a list of the values that were rejected, each already in
# backticks; $valuesCount is how many there were.
attribute-invalid-values =
    { $valuesCount ->
        [one] Ji bo taybetmendiya `{ $attribute }` nirxa { $values } nederbasdar e; tê paşguhkirin.
       *[other] Ji bo taybetmendiya `{ $attribute }` nirxên { $values } nederbasdar in; tên paşguhkirin.
    }

attribute-must-be-references = Ji bo taybetmendiya `{ $attribute }` nirxa `{ $value }` nederbasdar e. Divê taybetmendî ji referansên ku bi `$` dest pê dikin pêk were.

# $names is a list of the rejected names, each already in single quotes.
math-input-invalid-function-names = <mathInput>: di { $attribute } de navên fonksiyonan ên nederbasdar hatin paşguhkirin: { $names }. Divê para nîşandanê ya her navî bi kêmî 2 tîp be (tîp an xêzik); pişt re dikare paşgireke bijarte ya `|<mathspeak alternative>` bê.

## Building components from the source

component-type-invalid = Cureyê pêkhateyê nederbasdar e: `<{ $componentType }>`

attribute-repeated = Taybetmendiya { $attribute } nayê dubarekirin.

attribute-invalid-for-component = Ji bo pêkhateyeke bi cureyê `<{ $componentType }>` taybetmendiya "{ $attribute }" nederbasdar e.

## Style definition contrast

style-definition-insufficient-contrast =
    Pênaseya şêwazê { $styleNumber } ji bo { $context ->
        [text-on-background] rengê nivîsê li hember rengê paşxanê
        [high-contrast] rengê kontrasta bilind li hember kanvasê
        [line] rengê xêzê li hember kanvasê
        [marker] rengê nîşankerê li hember kanvasê
       *[text-on-canvas] rengê nivîsê li hember kanvasê
    } kontrasteke têrê nake{ $mode ->
        [dark] { " (moda tarî)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bi kêmî { $threshold }:1 divê).

# $suggestion says whether a concrete replacement colour could be computed.
style-definition-dark-mode-text-background-contrast =
    Her çend pênaseya şêwazê { $styleNumber } ji bo moda ronî rengên bi kontrasta têr diyar kiribe jî, rengên moda tarî yên ji van nirxan hatine derxistin ji bo rengê nivîsê li hember rengê paşxanê kontrasteke têrê nakin ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bi kêmî { $threshold }:1 divê). { $suggestion ->
        [available] Ji bo kontrasteke têr di moda tarî de, an kontrasta moda ronî zêde bike (mînak, { $lightAttribute }="{ $lightColor }" deyne) an jî rengê moda tarî binivîse (mînak, { $darkAttribute }="{ $darkColor }" deyne).
       *[none] Ji bo kontrasteke têr di moda tarî de, kontrasta moda ronî zêde bike an jî rengên derxistî bi textColorDarkMode û/an backgroundColorDarkMode ve biguherîne.
    }

style-definition-dark-mode-text-canvas-contrast =
    Her çend pênaseya şêwazê { $styleNumber } ji bo moda ronî rengê nivîsê bi kontrasta têr diyar kiribe jî, rengê nivîsê yê moda tarî yê ji vê nirxê hatiye derxistin li hember kanvasê kontrasteke têrê nake ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bi kêmî { $threshold }:1 divê). { $suggestion ->
        [available] Ji bo kontrasteke têr di moda tarî de, an kontrasta moda ronî zêde bike (mînak, textColor="{ $lightColor }" deyne) an jî rengê moda tarî binivîse (mînak, textColorDarkMode="{ $darkColor }" deyne).
       *[none] Ji bo kontrasteke têr di moda tarî de, kontrasta moda ronî zêde bike an jî rengê derxistî bi textColorDarkMode ve biguherîne.
    }

section-multiple-style-palettes = Beşek tenê dikare yek <stylePalette> hilbijêre; ya dawî tê bikaranîn.

## Unique variants

variant-num-to-select-not-non-negative-integer = varyantên yekta yên { $component } nayên diyarkirin ji ber ku numToSelect ne hejmareke tam a ne-neyînî ye.

variant-num-to-select-not-constant-number = varyantên yekta yên { $component } nayên diyarkirin ji ber ku numToSelect ne hejmareke sabit e.

variant-with-replacement-not-constant-boolean = varyantên yekta yên { $component } nayên diyarkirin ji ber ku withReplacement ne boolean-eke sabit e.

variant-select-weight-disables-unique = Gava vebijarkek bi selectWeight an selectForVariants hebe, varyantên yekta yên select tên girtin

variant-coprime-undetermined = varyantên yekta yên { $component } nayên diyarkirin ji ber ku nayê diyarkirin ka coprime her tim şaş e.

# $attribute is an attribute name and stays as written.
variant-attribute-not-constant = varyantên yekta yên { $component } nayên diyarkirin ji ber ku { $attribute } ne sabit e.

variant-attribute-not-number = varyantên yekta yên { $component } nayên diyarkirin ji ber ku { $attribute } ne hejmar e.

variant-attribute-wrong-type-for-sequence =
    varyantên yekta yên { $component }-a bi cureyê { $type } nayên diyarkirin ji ber ku { $attribute } ne { $expected ->
        [letters-combination] hevgirtineke tîpan
        [math-expression] îfadeyeke matematîkî ya derbasdar
        [integer] hejmareke tam
       *[number] hejmarek
    } e.

variant-length-not-integer = varyantên yekta yên { $component } nayên diyarkirin ji ber ku length ne hejmareke tam e.

variant-sort-not-implemented = varyantên yekta yên { $component }-eke bi sort nehatine pêkanîn

variant-exclude-combinations-not-implemented = varyantên yekta yên { $component }-eke bi excludeCombinations nehatine pêkanîn

variant-math-exclude-not-implemented = varyantên yekta yên { $component }-eke bi cureyê math a bi exclude nehatine pêkanîn

variant-non-constant-exclude-not-implemented = varyantên yekta yên { $component }-eke bi exclude ya nesabit nehatine pêkanîn

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: di nîşanderê prefigure yê grafîkê de nayê piştgirîkirin; dûndik tê derbaskirin.

prefigure-descendant-invalid-geometry = { $subject }: geometriyeke ne-fînît an netemam; dûndik tê derbaskirin.

prefigure-curve-label-omitted = { $subject }: li ser hêmanên xêza xwar ên veguhastî etîket nayên piştgirîkirin; etîket tê hiştin.

prefigure-curve-unsupported-definition-type = { $subject }: cureyê pênaseya fonksiyona xêza xwar '{ $definitionType }' nayê piştgirîkirin; dûndik tê derbaskirin.

prefigure-region-flip-functions-unsupported = { $subject }: li ser regionBetweenCurves taybetmendiya flipFunctions nayê piştgirîkirin; dûndik tê derbaskirin.

prefigure-region-non-formula-child = { $subject }: li ser regionBetweenCurves tenê fonksiyonên zarok ên bi cureyê formulayê tên piştgirîkirin; dûndik tê derbaskirin.

# $labelKind says which family of object carried the label.
prefigure-label-position-unsupported =
    { $subject }: ji bo { $labelKind ->
        [line-family] etîketa malbata xêzê
       *[point] etîketa xalê
    } labelPosition '{ $labelPosition }' nayê piştgirîkirin; hîzakirina standard a PreFigure tê bikaranîn.

prefigure-fill-style-unsupported = { $subject }: şêwaza dagirtinê '{ $fillStyle }' ji aliyê PreFigure ve nayê piştgirîkirin; dagirtineke tijî tê bikaranîn.

prefigure-line-style-unknown = { $subject }: şêwaza xêzê ya nenas '{ $lineStyle }' ji derketina PreFigure hate hiştin.

prefigure-marker-style-mapped-to-diamond = { $subject }: şêwaza nîşankerê '{ $markerStyle }' bo şêwaza PreFigure ya 'diamond' hate veguhastin.

prefigure-marker-style-unsupported = { $subject }: şêwaza nîşankerê '{ $markerStyle }' ji aliyê PreFigure ve nayê piştgirîkirin; şêwaza standard tê bikaranîn.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` nederbasdar e; armanc nayê girêdan. Şirove tê hiştin.

annotation-ref-multiple-targets = `<annotation>`: `ref` bû çend armanc; armanca yekem tê bikaranîn.

annotation-ref-outside-graph = `<annotation>`: `ref` nederbasdar e; armanc derveyî grafîka hilgir e. Şirove tê hiştin.

annotation-ref-unsupported-target = `<annotation>`: `ref` nederbasdar e; di veguhastina prefigure de armanc ne tişteke grafîkî ya piştgirîkirî ye. Şirove tê hiştin.

annotation-text-missing = `<annotation>`: `text` kêm e an vala ye; nivîseke vala tê dayîn.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Girêdayîbûneke çemberî hate dîtin.
       *[other] Girêdayîbûneke çemberî ya bi pêkhateya `<{ $componentType }>` ve hate dîtin.
    }

# $reference is the reference as the author wrote it, already carrying its `$`.
reference-no-referent = Ji bo referansê tu armanc nehate dîtin: `{ $reference }`

reference-multiple-referents = Ji bo referansê çend armanc hatin dîtin: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ji bo taybetmendiya { $attribute } ya `<{ $componentType }>` format nederbasdar e.

# $children is the list of child types that did not match, already joined.
children-invalid = Ji bo `<{ $componentType }>` zarok nederbasdar in: zarokên nederbasdar hatin dîtin: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ji bo taybetmendiya `{ $attribute }` nirxa `{ $value }` nederbasdar e, nirxa `{ $default }` tê bikaranîn

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Guhertoya DoenetML { $version } nehate dîtin.
       *[other] Guhertoya DoenetML { $version } nehate dîtin. Vedigere guhertoya { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML nederbasdar: { $content }

parse-tag-missing-close-tag = DoenetML nederbasdar: Etîketa `{ $tag }` etîketeke girtinê tune. Etîketeke xwe-girtî an etîketeke `</{ $tagName }>` dihate hêvîkirin.

parse-tag-error = DoenetML nederbasdar: Di etîketa `<{ $tagName }>` de çewtî

parse-attribute-missing-value = DoenetML nederbasdar: Wisa xuya dike ku nirxa taybetmendiya nederbasdar `{ $attribute }` kêm e.

parse-attribute-invalid = DoenetML nederbasdar: Taybetmendiya nederbasdar `{ $attribute }`

parse-attribute-value-invalid = DoenetML nederbasdar: Nirxa taybetmendiyê ya nederbasdar `{ $value }`

# $quote is the quote character that would balance the pair: `"` or `'`.
parse-attribute-value-quote-mismatch = DoenetML nederbasdar: Nirxa taybetmendiyê ya nederbasdar `{ $value }`. Nîşanên gotinê li hev nakin. Wisa xuya dike ku `{ $quote }` kêm e

parse-open-tag-name-missing = DoenetML nederbasdar: Etîketeke bênav hate dîtin, mînak `<`

parse-tag-not-closed = DoenetML nederbasdar: Etîketa `{ $tag }` nehate girtin (wisa xuya dike ku `>` kêm e).

parse-self-closing-tag-name-missing = DoenetML nederbasdar: Etîketeke bênav hate dîtin `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML nederbasdar: Etîketa `{ $tag }` nehate girtin (wisa xuya dike ku `/>` kêm e).

parse-tag-invalid-attributes = DoenetML nederbasdar: Etîketa `{ $tag }` ne derbasdar e. Dibe ku taybetmendiyên wê çewt bin.

parse-close-tag-name-missing = DoenetML nederbasdar: Etîketeke girtinê ya bênav hate dîtin, mînak `</`

# $attribute is the attribute name and $value the unquoted token that followed it.
parse-attribute-value-unquoted = Divê nirxên taybetmendiyan di nav nîşanên gotinê de bin: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML nederbasdar: Etîketa girtinê `{ $tag }` hate dîtin, lê etîketeke vekirinê ya wê tune

parse-close-tag-mismatched = DoenetML nederbasdar: Etîketa girtinê li hev nake. `</{ $expected }>` dihate hêvîkirin. `{ $found }` hate dîtin

# $node is the node's own name and stays as it is.
parser-node-unconvertible = Node ya { $node } nehate veguhastin bo node ya Dast.

## Names

name-attribute-invalid =
    Navê taybetmendiyê nederbasdar e name='{ $name }'. { $reason ->
        [characters] Nav tenê dikarin tîp, hejmar, binxêzik an xêzikan bihewînin.
       *[start] Divê nav bi tîpekê dest pê bikin.
    }

component-name-invalid-start = Navê pêkhateyê nederbasdar e "{ $name }". Divê nav bi tîpekê dest pê bikin.

## `<answer>` sugar

answer-video-watched-missing-video = Divê bersiva bi cureyê videoWatched taybetmendiyeke video hebe

answer-video-watched-video-not-reference = Divê taybetmendiya video ya bersiva bi cureyê videoWatched referansek be

answer-name-not-single-text = Divê taybetmendiya nav a bersivê zarokeke text a yekane hebe

## Referencing another document

external-doenetml-recursion-limit = Ji ber gelek astên dubarebûnê DoenetML ya derveyî nehate anîn. Gelo referanseke çemberî heye?

external-doenetml-unavailable = Ji { $attribute }="{ $uri }" DoenetML nehate anîn

external-doenetml-type-mismatch = DoenetML ya ji { $attribute }="{ $uri }" hatiye anîn nederbasdar e: bi cureyê pêkhateyê "{ $componentType }" re li hev nake

## Deprecated syntax

# The `[deprecation]` opening is a literal marker shared by all four messages,
# not a word: leave it as it is.

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Taybetmendiya `{ $from }` kevnare ye; li şûna wê `{ $to }` bi kar bîne.
       *[other] [deprecation] Taybetmendiya `{ $from }` ya li ser `<{ $component }>` kevnare ye; li şûna wê `{ $to }` bi kar bîne.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Taybetmendiya `{ $from }` kevnare ye û tê paşguhkirin ji ber ku `{ $to }` jî hatiye diyarkirin.
       *[other] [deprecation] Taybetmendiya `{ $from }` ya li ser `<{ $component }>` kevnare ye û tê paşguhkirin ji ber ku `{ $to }` jî hatiye diyarkirin.
    }

deprecated-attribute-ignored = [deprecation] Taybetmendiya `{ $attribute }` ya li ser `<{ $component }>` kevnare ye û tê paşguhkirin.

deprecated-attribute-to-child = [deprecation] Taybetmendiya `{ $attribute }` ya li ser `<{ $component }>` kevnare ye; li şûna wê zarokeke `<{ $child }>` bi kar bîne.

deprecated-attribute-value-renamed = [deprecation] Nirxa `{ $value }` ya taybetmendiya `{ $attribute }` ya li ser `<{ $component }>` kevnare ye; li şûna wê `{ $to }` bi kar bîne.


## Language coverage

# $locale is the document's language tag, as declared.
pluralize-english-only = `<pluralize>` tenê dikare Îngilîzî pirjimar bike, loma di belgeyeke bi { $locale } hatiye nivîsîn de nivîsa wê wekî xwe dimîne. Forma pirjimar rasterast binivîse, an bi taybetmendiya `pluralForm` diyar bike.


## Checking against the schema

schema-element-unrecognized = Hêmana `<{ $tag }>` ne hêmaneke Doenetê ya naskirî ye.

schema-element-not-allowed-at-root = Hêmana `<{ $tag }>` li rehê belgeyê nayê destûrkirin.

schema-element-not-allowed-inside = Hêmana `<{ $tag }>` di nav `<{ $parent }>` de nayê destûrkirin.

schema-attribute-unrecognized = Hêmana `<{ $tag }>` taybetmendiyeke bi navê `{ $attribute }` tune.

# $allowed is the attribute's permitted values, each already in double quotes.
schema-attribute-value-not-allowed =
    { $isList ->
        [true] Divê taybetmendiya `{ $attribute }` ya hêmana `<{ $tag }>` lîsteyek be ku her hêmana wê yek ji vana be: { $allowed }
       *[other] Divê taybetmendiya `{ $attribute }` ya hêmana `<{ $tag }>` yek ji vana be: { $allowed }
    }


## The `<select>` family's error boxes
##
## Translators: component and attribute names — `selectFromSequence`,
## `selectPrimeNumbers`, `from`, `to`, `step` — are DoenetML identifiers, not
## words, and are left in English exactly as written.

select-variant-name-option-count-mismatch = Ji bo select navê varyantê nederbasdar e.  Navê varyantê { $variantName } di { $numOptions } vebijarkan de derdikeve lê hejmara hilbijartinê { $numToSelect } e.

select-variant-name-without-options = Ji bo select hin varyant hatine diyarkirin lê ji bo navê varyantê yê pêkan tu vebijark nehatine diyarkirin: { $variantName }.

select-variant-name-not-possible = Navê varyantê { $variantName } yê ji bo select hatiye diyarkirin ne navekî varyantê yê pêkan e.

select-too-few-options = Ji tenê { $numOptions } pêkhateyan { $numToSelect } pêkhate nayên hilbijartin.

select-from-sequence-too-few-values = Ji rêzeyeke bi dirêjahiya { $length } { $numToSelect } nirx nayên hilbijartin.

select-from-sequence-indices-count-mismatch = Divê hejmara îndeksên ji bo select hatine diyarkirin bi hejmara hilbijartinê re li hev bike

select-from-sequence-indices-not-integers = Divê hemû îndeksên ji bo select hatine diyarkirin hejmarên tam bin

select-from-sequence-index-excluded = Îndeksa diyarkirî ya selectfromsequence hatibû derxistin

select-from-sequence-indices-excluded-combination = Îndeksên diyarkirî yên selectfromsequence hevgirtineke derxistî bûn

select-from-sequence-coprime-not-positive-integers = Hevgirtinên coprime nayên hilbijartin ji ber ku hejmarên tam ên erênî nayên hilbijartin.

# Translators: from, to and step are attribute names.
select-from-sequence-coprime-common-factor = Hejmarên coprime nayên hilbijartin. Hemû nirxên pêkan faktoreke hevbeş parve dikin. (Divê nirxên diyarkirî yên "from" an "to" bi "step" re coprime bin.)

select-from-sequence-coprime-single-number = Ji hejmareke yekane ya ne 1 hevgirtinên coprime nayên hilbijartin.

select-from-sequence-excluded-too-many-combinations = Di selectFromSequence de ji sedî 70î zêdetir hevgirtin hatin derxistin

select-from-sequence-coprime-none-found = Hejmarên coprime nehatin hilbijartin. Hemû nirxên pêkan faktoreke hevbeş parve dikin.

select-from-sequence-too-few-unique-values = Ji rêzeyeke bi dirêjahiya { $numPossibleValues } { $numToSelect } nirxên yekta nayên hilbijartin

select-prime-numbers-too-few-values = Ji lîsteyeke hejmarên pêşîn a bi dirêjahiya { $numValues } { $numToSelect } nirx nayên hilbijartin

select-prime-numbers-values-count-mismatch = Divê hejmara nirxên ji bo select hatine diyarkirin bi hejmara hilbijartinê re li hev bike

select-prime-numbers-values-not-prime = Divê hemû nirxên ji bo hilbijartina hejmara pêşîn hatine diyarkirin di lîsteya hejmarên pêşîn de bin

select-prime-numbers-values-excluded-combination = Nirxên diyarkirî yên selectPrimeNumbers hevgirtineke derxistî bûn

select-prime-numbers-excluded-too-many-combinations = Di selectPrimeNumbers de ji sedî 70î zêdetir hevgirtin hatin derxistin

select-random-combination-fluke = Bi rasthatineke pir kêm îhtîmal, hevgirtineke nirxên tesadufî nehate hilbijartin

select-random-value-fluke = Bi rasthatineke pir kêm îhtîmal, nirxeke tesadufî nehate hilbijartin
