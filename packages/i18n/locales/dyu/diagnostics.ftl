# Dyula diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] { $attributes } tɛ jate ni kuncɛ pɔn fila bilalen don
       *[other] { $attributes } tɛ jate ni kuncɛ pɔn fila bilalen don
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } tɛ jate ni kuncɛ pɔn ni cɛmancɛ pɔn bɛɛ bilalen don
       *[other] { $attributes } tɛ jate ni kuncɛ pɔn ni cɛmancɛ pɔn bɛɛ bilalen don
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset tɛ baara kɛ ni cɛmancɛ pɔn tɛ yen

## `<line>`

line-points-undetermined-dimensions = Layini bɛ tɛmɛ pɔnw kan minnu bonya ma dɔn.

line-points-too-few-dimensions = Layini ka kan ka tɛmɛ pɔnw kan minnu bonya ye fila ye walima ka tɛmɛ o kan.

line-points-depend-on-variables = Layini bɛ tɛmɛ pɔnw kan minnu sinsinnen bɛ falenfɛnw kan: { $variables }.

line-equation-invalid-format = Layini ekwasiyɔn cogoya man ɲi falenfɛnw { $variable1 } ni { $variable2 } la.

## `<ray>`

ray-overprescribed-through = Reyɔn bilala ni through, endpoint ni direction ye.  An tɛ through bilalen jate.

ray-dimension-mismatch = numDimensions tɛ bɛn reyɔn kɔnɔ.

## `<vector>`

vector-overprescribed-head = Wɛkitɛri bilala ni head, tail ni displacement ye.  An tɛ head bilalen jate.

vector-dimension-mismatch = numDimensions tɛ bɛn wɛkitɛri kɔnɔ.

## Attracting and constraining

attract-to-without-nearest-point = An tɛ se ka sama `<{ $component }>` ma, katuguni nearestPoint taamasere tɛ a la.

constrain-to-without-nearest-point = An tɛ se ka bali `<{ $component }>` la, katuguni nearestPoint taamasere tɛ a la.

constrain-to-interior-without-nearest-point = An tɛ se ka bali `<{ $component }>` kɔnɔ, katuguni nearestPoint taamasere tɛ a la.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition tɛ jate choiceInput min tɛ layini kɔnɔ

## Ordering children by index

choice-input-indices-count-mismatch = An tɛ indices bilalenw jate choiceInput kan katuguni indices hakɛ tɛ bɛn choice denw hakɛ ma.

pretzel-indices-count-mismatch = An tɛ indices bilalenw jate problem kan katuguni indices hakɛ tɛ bɛn problem denw hakɛ ma.

shuffle-indices-count-mismatch = An tɛ indices bilalenw jate shuffle kan katuguni indices hakɛ tɛ bɛn yɔrɔw hakɛ ma.

indices-ignored-out-of-range = An tɛ indices bilalenw jate { $component } kan katuguni dɔw bɔra dan kɔ.

pretzel-indices-repeated = An tɛ indices bilalenw jate pretzel kan katuguni dɔw seginna ka na.

pretzel-circuit-first-index = An tɛ indices bilalenw jate pretzel kan mode="circuit" kɔnɔ katuguni fɔlɔ ka kan ka kɛ 1 ye.

## `<shuffle>` and `<sort>`

string-children-need-type = Walisa `<{ $component }>` ka baara kɛ ni kuma denw ye, `type` taamasere ka kan ka bila.

invalid-type-defaulting-to-math = Suguya { $type } man ɲi { $component } kan. A ka kan ka kɛ math, text, number walima boolean ye. An bɛ segin math kan.

string-not-valid-component-to-arrange = Kuma "{ $value }" tɛ yɔrɔ ɲuman ye { $component } kan. An tɛ a jate.

## Types and variables

invalid-type-defaulting-to-number = Suguya { $type } man ɲi, an bɛ suguya bila number kan.

invalid-variable-value = Falenfɛn jate man ɲi: `{ $value }`

## Variants

variant-index-must-be-number = Cogoya taamasere { $index } ka kan ka kɛ jate ye

variant-index-must-be-integer = Cogoya taamasere { $index } ka kan ka kɛ jate dafalen ye

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ma dilan ni sumanikɛlan minnu tɛ falen ye. An bɛ bonya bila suman kan.

side-by-side-absolute-margins = `<{ $component }>` ma dilan ni sumanikɛlan minnu tɛ falen ye. An bɛ dankanw bila suman kan.

side-by-side-no-block-child = `<{ $component }>` man ɲi: den kelen dɔrɔn ka kan ka kɛ a la.

## `<label>`

label-for-ignored-on-graphical = `for` taamasere tɛ jate ja `<label>` kan.

label-for-must-resolve-to-one = `for` taamasere `<label>` kan ka kan ka yɔrɔ kelen dɔrɔn jira.

label-for-unresolved = `for` taamasere `<label>` kan ma se ka yɔrɔ jira.

label-for-answer-with-authored-inputs = `for` taamasere `<label>` kan bɛ `<answer>` jira min ye donniw sɔrɔ sɛbɛnnikɛla fɛ; donni yɛrɛ jira.

label-for-answer-without-input = `for` taamasere `<label>` kan bɛ `<answer>` jira min tɛ ni donni ye walisa ka tɔgɔ da a la.

label-for-must-reference-input-or-answer = `for` taamasere `<label>` kan ka kan ka donni walima jaabi jira.

## Accessibility

accessibility-short-description-or-decorative = Sekokɔrɔ kosɔn, `<{ $component }>` ka kan ka kɛ ni ɲɛfɔli surun ye walima a bila i n'a fɔ masiri fɛn.

accessibility-video-short-description = Sekokɔrɔ kosɔn, `<video>` ka kan ka kɛ ni ɲɛfɔli surun ye.

accessibility-input-short-description-or-label = Sekokɔrɔ kosɔn, `<{ $component }>` ka kan ka kɛ ni ɲɛfɔli surun walima tɔgɔ ye.

accessibility-answer-input-short-description-or-label = Sekokɔrɔ kosɔn, `<answer>` min bɛ donni dilan, o ka kan ka kɛ ni ɲɛfɔli surun walima tɔgɔ ye.

accessibility-short-description-contains-math = Ɲɛfɔli surunw man kan ka kɛ ni jatebɔ yɔrɔw ye i n'a fɔ `<{ $component }>`. Jatebɔ bɛɛ sɛbɛn ni kumaw ye.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } danfara ma bɔ tila kunsɛbɛn kumaw kan (dibi la) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a bɛ { $threshold }:1 ɲini).
       *[other] { $colorName } danfara ma bɔ tila kunsɛbɛn kumaw kan ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a bɛ { $threshold }:1 ɲini).
    }

## `<circle>`

circle-through-points-non-numerical = An ma `<circle>` dilan fɔlɔ min bɛ tɛmɛ pɔn { $count } kan ni jate tɛ pɔnw la.

circle-too-many-through-points = An tɛ se ka serekili jate min bɛ tɛmɛ pɔn 3 kan ka tɛmɛ.

circle-overprescribed-radius-center-points = An tɛ se ka serekili jate min bɛ ni reyɔn, cɛmancɛ yɔrɔ ni pɔnw bɛɛ ye.

circle-center-with-multiple-points = An tɛ se ka serekili jate min bɛ ni cɛmancɛ yɔrɔ ye ka tɛmɛ pɔn 1 kan.

circle-radius-too-small = An tɛ se ka serekili jate: pɔn fila cɛ ye { $distance } ye, reyɔn { $radius } bilalen ka dɔgɔ kojugu.

circle-radius-with-many-points = An tɛ se ka serekili dilan min bɛ tɛmɛ pɔn fila kan ni reyɔn bilalen ye.

circle-invalid-center-or-through-points = Serekili cɛmancɛ yɔrɔ walima a pɔnw man ɲi.

circle-radius-center-with-multiple-points = An tɛ se ka serekili reyɔn jate min bɛ ni cɛmancɛ yɔrɔ ye ka tɛmɛ pɔn 1 kan.

circle-change-radius-non-numerical = An tɛ se ka serekili reyɔn falen ni a pɔnw tɛ ni jate ye

circle-radius-with-points-non-numerical = An tɛ se ka serekili dilan min bɛ tɛmɛ pɔn kelen kan ni reyɔn bilalen ye ni jate tɛ yen.

circle-change-center-non-numerical = An ma serekili cɛmancɛ yɔrɔ falenni dilan fɔlɔ ni a pɔnw tɛ ni jate ye.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Bonya ma se fɔnksiyɔn yɔrɔ ma. Yɔrɔ bɛ ni tilayɔrɔ { $intervals } ye nka fɔnksiyɔn bɛ ni { $inputs ->
            [one] donni { $inputs }
           *[other] donni { $inputs }
        } ye.
       *[other] Bonya ma se fɔnksiyɔn yɔrɔ ma. Yɔrɔ bɛ ni tilayɔrɔ { $intervals } ye nka fɔnksiyɔn bɛ ni { $inputs ->
            [one] donni { $inputs }
           *[other] donni { $inputs }
        } ye.
    }

function-domain-invalid-format = Fɔnksiyɔn yɔrɔ cogoya man ɲi.

function-ignoring-non-numerical =
    { $type ->
        [maximum] An tɛ fɔnksiyɔn sanfɛta jate min tɛ ni jate ye.
        [minimum] An tɛ fɔnksiyɔn dugumata jate min tɛ ni jate ye.
        [extremum] An tɛ fɔnksiyɔn kuncɛ jate min tɛ ni jate ye.
        [point] An tɛ fɔnksiyɔn pɔn jate min tɛ ni jate ye.
        [slope] An tɛ fɔnksiyɔn jɛngɛnni jate min tɛ ni jate ye.
       *[other] An tɛ fɔnksiyɔn { $type } jate min tɛ ni jate ye.
    }

function-ignoring-empty =
    { $type ->
        [maximum] An tɛ fɔnksiyɔn sanfɛta lakolon jate.
        [minimum] An tɛ fɔnksiyɔn dugumata lakolon jate.
        [extremum] An tɛ fɔnksiyɔn kuncɛ lakolon jate.
        [point] An tɛ fɔnksiyɔn pɔn lakolon jate.
       *[other] An tɛ fɔnksiyɔn { $type } lakolon jate.
    }

function-points-too-close = Pɔn fila bɛ fɔnksiyɔn na minnu ka surun ɲɔgɔn na kojugu. An tɛ se ka fɔnksiyɔn bila.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Fɔnksiyɔn seginni bɛ se ka kɛ dɔrɔn ni donni hakɛ bɛnna bɔli hakɛ ma. Nin fɔnksiyɔn bɛ ni donni { $inputs } ni { $outputs ->
            [one] bɔli { $outputs }
           *[other] bɔli { $outputs }
        } ye.
       *[other] Fɔnksiyɔn seginni bɛ se ka kɛ dɔrɔn ni donni hakɛ bɛnna bɔli hakɛ ma. Nin fɔnksiyɔn bɛ ni donni { $inputs } ni { $outputs ->
            [one] bɔli { $outputs }
           *[other] bɔli { $outputs }
        } ye.
    }

## `<sequence>`

sequence-invalid-length = Tulon janya man ɲi.  A ka kan ka kɛ jate dafalen ye min tɛ zero jukɔrɔ.

sequence-invalid-step = Tulon sen man ɲi.  A ka kan ka kɛ jate ye tulon suguya { $type } kan.

sequence-invalid-endpoint-number = Jate tulon "{ $attribute }" man ɲi.  A ka kan ka kɛ jate ye.

sequence-invalid-endpoint-letters = Sɛbɛnden tulon "{ $attribute }" man ɲi.  A ka kan ka kɛ sɛbɛnden ɲagaminen ye.

sequence-invalid-endpoint = Tulon "{ $attribute }" man ɲi.

select-from-sequence-coprime-not-numbers = coprime ma jate katuguni jatew tɛ woloma

select-from-sequence-coprime-with-exclude-combinations = coprime ma jate katuguni excludeCombinations bilala

## Resolving a `target`

target-not-found = target man ɲi `<{ $source }>` kan: an ma target sɔrɔ.

target-state-variable-not-found = target man ɲi `<{ $source }>` kan: an ma taamasere sɔrɔ min tɔgɔ ye "{ $property }" ye `<{ $component }>` kan.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` falenfɛnw ka kan ka danfara ni falenfɛn yɛrɛmahɔrɔn ye.

ode-system-duplicate-variable-names = An tɛ se ka ODE RHS fɔnksiyɔnw bila minnu falenfɛn tɔgɔw seginna ka na.

ode-system-rhs-function-error = An tɛ se ka ODE RHS fɔnksiyɔn bila.  Fili mathjs fɔnksiyɔn dilanni na.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = An tɛ se ka kɔrɔn bila layini { $count } cɛ

angle-invalid-through-point = Pɔn jugu `<angle>` through kɔnɔ

parabola-vertex-too-many-points = An ma parabɔli dilan fɔlɔ min bɛ ni kɔrɔn ye ka tɛmɛ pɔn 1 kan.

parabola-too-many-points = An ma parabɔli dilan fɔlɔ min bɛ tɛmɛ pɔn 3 kan.

intersection-too-many-items = An ma tɛmɛsira dilan fɔlɔ fɛn fila ye ka tɛmɛ

## Other math components

ionic-compound-not-two-ions = An ma ayɔn ɲagaminen dilan fɔlɔ fɛn min tɛ ayɔn fila ye.

ionic-compound-needs-cation-and-anion = Ayɔn ɲagaminen dilanna katiyɔn kelen ni aniyɔn kelen dɔrɔn kan.

solve-equations-cannot-evaluate = An tɛ se ka ekwasiyɔn ɲɛnabɔ katuguni an ma se ka a jate: { $equation }

math-operators-operand-number-required = I ka kan ka operandNumber bila ni i bɛ jatebɔ operand bɔ.

eigen-decomposition-failed = An ma se ka matirisi eigenvalues jate

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: paramɛtiri { $parameters } tɛ pattern kɔnɔ, o de la a bɛna bɛn lakolon ma tuma bɛɛ.
       *[other] `<matchesPattern>`: paramɛtiri { $parameters } tɛ pattern kɔnɔ, o de la u bɛna bɛn lakolon ma tuma bɛɛ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: an tɛ se ka grid="{ $grid }" faamu. A ka kan ka kɛ none, medium, dense, walima jate ɲuman fila ye minnu tilalen don ni yɔrɔ ye, i n'a fɔ grid="1 0.5". Grid si tɛ dilan.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" tɛ daga prefigure jirala kɔnɔ; an bɛ baara kɛ i n'a fɔ kinin fɛ.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" tɛ daga prefigure jirala kɔnɔ; an bɛ baara kɛ i n'a fɔ sanfɛ.

prefigure-invalid-axis-bounds = `<graph>`: aksi danw man ɲi prefigure falenni na; an bɛ baara kɛ ni bbox fɔlɔfɔlɔta ye (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: bonya man ɲi prefigure falenni na; an bɛ baara kɛ ni ja bonya fɔlɔfɔlɔta ye 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio man ɲi prefigure falenni na; an bɛ baara kɛ ni suman fɔlɔfɔlɔta ye 1.

prefigure-grid-spacing-too-fine = `<graph>`: grid yɔrɔ ka dɔgɔ kojugu aksi danw kan; grid tɛ dilan prefigure jirala kɔnɔ.

prefigure-annotations-not-rendered = `<graph>`: ɲɛfɔliw tɛ dilan ni PreFigure jirala tɛ baara kɛ.

multiple-annotations-children = `<annotations>` den caman sɔrɔla `<graph>` kɔnɔ; bɛɛ ma jate fo laban.

## Referring to other components

copy-unrecognized-component-type = An tɛ se ka yɔrɔ suguya kura walima ka a kopi min ma dɔn: { $type }.

copy-prop-not-found = An ma prop { $property } sɔrɔ yɔrɔ kan min suguya ye { $component } ye

collect-no-source = collect sinsinyɔrɔ ma sɔrɔ.

collect-invalid-component-type = An tɛ se ka yɔrɔ suguya `<{ $component }>` lajɛ katuguni o ye suguya jugu ye.

reference-index-unavailable = An tɛ se ka taamasere `{ $reference }` jira

## `<callAction>`

component-action-unavailable = An tɛ se ka { $action } wele yɔrɔ `{ $reference }` kan

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Kunnafoniw cogoya man ɲi.  Layiniw janya tɛ bɛn ɲɔgɔn ma. A sɔrɔla componentIdx :{ $componentIdx } kɔnɔ

data-frame-duplicate-column-names = Kunnafoniw kolɔni tɔgɔw seginna ka na.  A sɔrɔla componentIdx :{ $componentIdx } kɔnɔ

data-frame-missing-column-name = Kolɔni tɔgɔ tɛ kunnafoniw la.  A sɔrɔla componentIdx :{ $componentIdx } kɔnɔ

## `<answer>` and scoring

answer-award-depends-on-own-response = Nin jaabi pɔnw sinsinnen bɛ tagi yɛrɛ ye jaabi min ci, o kan, ani o bɛna fɛn dilan min tɛ jate.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` bilali `<answer>` kan min bɛ yɔrɔ kɔnɔ ni `sectionWideCheckWork` ye, o tɛ foyi kɛ, katuguni yɔrɔ de bɛ kɛcogo hakɛ mara. `maxNumAttempts` bila yɔrɔ kan.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` bilali yɔrɔ kan ni `sectionWideCheckWork` ye min bɛ yɔrɔ wɛrɛ kɔnɔ ni `sectionWideCheckWork` ye, o tɛ foyi kɛ, katuguni kɛnɛma yɔrɔ de bɛ kɛcogo hakɛ mara. `maxNumAttempts` bila kɛnɛma yɔrɔ kan.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Taamasere { $attributes } tɛna foyi kɛ ni symbolicEquality ma bila.
       *[other] Taamasere { $attributes } tɛna foyi kɛ ni symbolicEquality ma bila.
    }

answer-invalid-type = Jaabi suguya jugu: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Katuguni tɔgɔ tɛ yɔrɔ `<{ $component }>` la, a tɛ se ka kɛ module taamasere ye

module-attribute-name-already-defined = Yɔrɔ `<{ $component } name="{ $name }">` tɛ se ka kɛ module taamasere ye katuguni `<module>` suguya bɛ ni taamasere "{ $name }" ye ka ban.

conditional-content-condition-ignored = `condition` taamasere tɛ jate `<conditionalContent>` kan min bɛ ni case walima else denw ye.

slider-markers-type-mismatch = Taamaserew suguya tɛ bɛn slider suguya ma.

pretzel-problem-needs-statement-and-answer = pretzel man ɲi: `<problem>` kelen-kelen bɛɛ ka kan ka kɛ ni `<statement>` kelen ni `<answer>` kelen ye.

pretzel-circuit-first-problem-distractor = pretzel man ɲi: mode="circuit" kɔnɔ, `<problem>` fɔlɔ tɛ se ka kɛ distractor ye.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Jate jugu { $values } taamasere `{ $attribute }` kan; an tɛ a jate.
       *[other] Jate jugu { $values } taamasere `{ $attribute }` kan; an tɛ u jate.
    }

attribute-must-be-references = Jate `{ $value }` man ɲi taamasere `{ $attribute }` kan. Taamasere ka kan ka dilan ni jiraliw ye minnu bɛ daminɛ ni `$` ye.

math-input-invalid-function-names = <mathInput>: an ma fɔnksiyɔn tɔgɔ jugu jate { $attribute } kɔnɔ: { $names }. Tɔgɔ kelen-kelen bɛɛ jirali yɔrɔ ka kan ka kɛ ni sɛbɛnden 2 ye walima ka tɛmɛ (sɛbɛnden walima tirɛ); i bɛ se ka `|<mathspeak alternative>` fara a kan.

## Building components from the source

component-type-invalid = Yɔrɔ suguya jugu: `<{ $componentType }>`

attribute-repeated = An tɛ se ka taamasere { $attribute } segin.

attribute-invalid-for-component = Taamasere "{ $attribute }" man ɲi yɔrɔ kan min suguya ye `<{ $componentType }>` ye.

## Style definition contrast

style-definition-insufficient-contrast =
    Cogoya { $styleNumber } ɲɛfɔli danfara ma bɔ { $context ->
        [text-on-background] kuma kulɛri kɔfɛla kulɛri kan
        [high-contrast] danfara belebele kulɛri walan kan
        [line] layini kulɛri walan kan
        [marker] taamasere kulɛri walan kan
       *[text-on-canvas] kuma kulɛri walan kan
    } kan{ $mode ->
        [dark] { " (dibi la)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a bɛ { $threshold }:1 ɲini).

style-definition-dark-mode-text-background-contrast =
    Hali ni cogoya { $styleNumber } ɲɛfɔli bɛ ni kulɛriw ye minnu bɛ danfara di yeelen na, dibi kulɛriw minnu bɔra olu la, danfara tɛ u la kuma kulɛri ni kɔfɛla kulɛri cɛ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a bɛ { $threshold }:1 ɲini). { $suggestion ->
        [available] Walisa danfara ka bɔ dibi la, yeelen danfara bonya (misali la, { $lightAttribute }="{ $lightColor }" bila) walima dibi kulɛri falen (misali la, { $darkAttribute }="{ $darkColor }" bila).
       *[none] Walisa danfara ka bɔ dibi la, yeelen danfara bonya walima kulɛri bɔlenw falen ni textColorDarkMode walima backgroundColorDarkMode ye.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hali ni cogoya { $styleNumber } ɲɛfɔli bɛ ni kuma kulɛri ye min bɛ danfara di yeelen na, dibi kuma kulɛri min bɔra a la, danfara tɛ a la walan kan ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a bɛ { $threshold }:1 ɲini). { $suggestion ->
        [available] Walisa danfara ka bɔ dibi la, yeelen danfara bonya (misali la, textColor="{ $lightColor }" bila) walima dibi kulɛri falen (misali la, textColorDarkMode="{ $darkColor }" bila).
       *[none] Walisa danfara ka bɔ dibi la, yeelen danfara bonya walima kulɛri bɔlen falen ni textColorDarkMode ye.
    }

section-multiple-style-palettes = Tila bɛ se ka <stylePalette> kelen dɔrɔn woloma; an bɛ baara kɛ ni laban ye.

## Unique variants

variant-num-to-select-not-non-negative-integer = an tɛ se ka { $component } cogoya danfaralenw dɔn katuguni numToSelect tɛ jate dafalen ye min tɛ zero jukɔrɔ.

variant-num-to-select-not-constant-number = an tɛ se ka { $component } cogoya danfaralenw dɔn katuguni numToSelect tɛ jate ye min tɛ falen.

variant-with-replacement-not-constant-boolean = an tɛ se ka { $component } cogoya danfaralenw dɔn katuguni withReplacement tɛ boolean ye min tɛ falen.

variant-select-weight-disables-unique = select cogoya danfaralenw bɛ bali ni wolomali bɛ ni selectWeight walima selectForVariants ye

variant-coprime-undetermined = an tɛ se ka { $component } cogoya danfaralenw dɔn katuguni an tɛ se ka a dɔn ko coprime ye false ye tuma bɛɛ.

variant-attribute-not-constant = an tɛ se ka { $component } cogoya danfaralenw dɔn katuguni { $attribute } bɛ falen.

variant-attribute-not-number = an tɛ se ka { $component } cogoya danfaralenw dɔn katuguni { $attribute } tɛ jate ye.

variant-attribute-wrong-type-for-sequence =
    an tɛ se ka { $component } min suguya ye { $type } ye, o cogoya danfaralenw dɔn katuguni { $attribute } tɛ { $expected ->
        [letters-combination] sɛbɛnden ɲagaminen
        [math-expression] jatebɔ kuma dagalen
        [integer] jate dafalen
       *[number] jate
    } ye.

variant-length-not-integer = an tɛ se ka { $component } cogoya danfaralenw dɔn katuguni length tɛ jate dafalen ye.

variant-sort-not-implemented = an ma { $component } min bɛ ni sort ye, o cogoya danfaralenw dilan fɔlɔ

variant-exclude-combinations-not-implemented = an ma { $component } min bɛ ni excludeCombinations ye, o cogoya danfaralenw dilan fɔlɔ

variant-math-exclude-not-implemented = an ma { $component } min suguya ye math ye ka kɛ ni exclude ye, o cogoya danfaralenw dilan fɔlɔ

variant-non-constant-exclude-not-implemented = an ma { $component } min bɛ ni exclude falenta ye, o cogoya danfaralenw dilan fɔlɔ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: a tɛ daga graph prefigure jirala kɔnɔ; bɔlen tɛmɛna.

prefigure-descendant-invalid-geometry = { $subject }: yɔrɔ cogoya dan tɛ walima a ma dafa; bɔlen tɛmɛna.

prefigure-curve-label-omitted = { $subject }: tɔgɔw tɛ daga kurubu falenlenw kan; tɔgɔ bɔra.

prefigure-curve-unsupported-definition-type = { $subject }: kurubu ɲɛfɔli suguya '{ $definitionType }' tɛ daga; bɔlen tɛmɛna.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions taamasere tɛ daga regionBetweenCurves kan; bɔlen tɛmɛna.

prefigure-region-non-formula-child = { $subject }: den fɔnksiyɔnw minnu suguya ye formula ye, olu dɔrɔn de daga regionBetweenCurves kan; bɔlen tɛmɛna.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' tɛ daga { $labelKind ->
        [line-family] layini somɔgɔw tɔgɔ
       *[point] pɔn tɔgɔ
    } kan; an bɛ baara kɛ ni PreFigure bɛnni fɔlɔfɔlɔta ye.

prefigure-fill-style-unsupported = { $subject }: falenni cogoya '{ $fillStyle }' tɛ daga PreFigure kan; an bɛ segin falenni gɛlɛn kan.

prefigure-line-style-unknown = { $subject }: layini cogoya dɔnbali '{ $lineStyle }' bɔra PreFigure bɔli la.

prefigure-marker-style-mapped-to-diamond = { $subject }: taamasere cogoya '{ $markerStyle }' falenna ka kɛ PreFigure cogoya 'diamond' ye.

prefigure-marker-style-unsupported = { $subject }: taamasere cogoya '{ $markerStyle }' tɛ daga PreFigure kan; an bɛ baara kɛ ni cogoya fɔlɔfɔlɔta ye.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` man ɲi; an ma a jiralen sɔrɔ. Ɲɛfɔli bɔra.

annotation-ref-multiple-targets = `<annotation>`: `ref` bɛ fɛn caman jira; an bɛ baara kɛ ni fɔlɔ ye.

annotation-ref-outside-graph = `<annotation>`: `ref` man ɲi; a jiralen bɛ graph kɔfɛ. Ɲɛfɔli bɔra.

annotation-ref-unsupported-target = `<annotation>`: `ref` man ɲi; a jiralen tɛ ja fɛn ye min daga prefigure falenni na. Ɲɛfɔli bɔra.

annotation-text-missing = `<annotation>`: `text` tɛ yen walima a lakolon don; an bɛ kuma lakolon bɔ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] An ye sinsinni sɔrɔ min bɛ munumunu.
       *[other] An ye sinsinni sɔrɔ min bɛ munumunu ni yɔrɔ `<{ $componentType }>` ye.
    }

reference-no-referent = Foyi ma sɔrɔ jirali la: `{ $reference }`

reference-multiple-referents = Fɛn caman sɔrɔla jirali la: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` taamasere { $attribute } cogoya man ɲi.

children-invalid = `<{ $componentType }>` denw man ɲi: An ye den juguw sɔrɔ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Jate `{ $value }` man ɲi taamasere `{ $attribute }` kan, an bɛ baara kɛ ni jate `{ $default }` ye

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML cogoya { $version } ma sɔrɔ.
       *[other] DoenetML cogoya { $version } ma sɔrɔ. An bɛ segin cogoya { $fallback } kan
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML jugu: { $content }

parse-tag-missing-close-tag = DoenetML jugu: Tagi `{ $tag }` tɛ ni datugu tagi ye. An tun bɛ tagi makɔnɔ min bɛ a yɛrɛ datugu walima tagi `</{ $tagName }>`.

parse-tag-error = DoenetML jugu: Fili tagi `<{ $tagName }>` kɔnɔ

parse-attribute-missing-value = DoenetML jugu: Taamasere jugu `{ $attribute }` bɛ i n'a fɔ jate tɛ a la.

parse-attribute-invalid = DoenetML jugu: Taamasere `{ $attribute }` man ɲi

parse-attribute-value-invalid = DoenetML jugu: Taamasere jate `{ $value }` man ɲi

parse-attribute-value-quote-mismatch = DoenetML jugu: Taamasere jate `{ $value }` man ɲi. Kuma taamaserew tɛ bɛn. A bɛ i n'a fɔ `{ $quote }` tɛ i bolo

parse-open-tag-name-missing = DoenetML jugu: An ye tagi sɔrɔ min tɛ ni tɔgɔ ye, i n'a fɔ `<`

parse-tag-not-closed = DoenetML jugu: Tagi `{ $tag }` ma datugu (a bɛ i n'a fɔ `>` tɛ yen).

parse-self-closing-tag-name-missing = DoenetML jugu: An ye tagi sɔrɔ min tɛ ni tɔgɔ ye `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML jugu: Tagi `{ $tag }` ma datugu (a bɛ i n'a fɔ `/>` tɛ yen).

parse-tag-invalid-attributes = DoenetML jugu: Tagi `{ $tag }` man ɲi. Taamasere juguw bɛ se ka kɛ a la.

parse-close-tag-name-missing = DoenetML jugu: An ye datugu tagi sɔrɔ min tɛ ni tɔgɔ ye, i n'a fɔ `</`

parse-attribute-value-unquoted = Taamasere jatew ka kan ka bila kuma taamaserew cɛ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML jugu: An ye datugu tagi `{ $tag }` sɔrɔ, nka dawuli tagi bɛnnen tɛ yen

parse-close-tag-mismatched = DoenetML jugu: Datugu tagi tɛ bɛn. An tun bɛ `</{ $expected }>` makɔnɔ. An ye `{ $found }` sɔrɔ

parser-node-unconvertible = An ma se ka node { $node } falen ka kɛ Dast node ye.

## Names

name-attribute-invalid =
    Tɔgɔ name='{ $name }' man ɲi. { $reason ->
        [characters] Tɔgɔw bɛ se ka kɛ ni sɛbɛndenw, jatew, jukɔrɔ tirɛ walima tirɛ dɔrɔn ye.
       *[start] Tɔgɔw ka kan ka daminɛ ni sɛbɛnden ye.
    }

component-name-invalid-start = Yɔrɔ tɔgɔ "{ $name }" man ɲi. Tɔgɔw ka kan ka daminɛ ni sɛbɛnden ye.

## `<answer>` sugar

answer-video-watched-missing-video = Jaabi min suguya ye videoWatched ye, o ka kan ka kɛ ni video taamasere ye

answer-video-watched-video-not-reference = Jaabi min suguya ye videoWatched ye, o ka kan ka kɛ ni video taamasere ye min ye jirali ye

answer-name-not-single-text = Jaabi name taamasere ka kan ka kɛ ni kuma den kelen ye

## Referencing another document

external-doenetml-recursion-limit = An ma se ka kɛnɛma DoenetML sɔrɔ katuguni seginni ka ca kojugu. Jirali dɔ bɛ munumunu wa?

external-doenetml-unavailable = An ma se ka DoenetML sɔrɔ { $attribute }="{ $uri }" la

external-doenetml-type-mismatch = DoenetML min sɔrɔla { $attribute }="{ $uri }" la, o man ɲi: a ma bɛn yɔrɔ suguya "{ $componentType }" ma

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Taamasere `{ $from }` tɛ baara kɛ tugun; `{ $to }` kɛ.
       *[other] [deprecation] Taamasere `{ $from }` `<{ $component }>` kan tɛ baara kɛ tugun; `{ $to }` kɛ.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Taamasere `{ $from }` tɛ baara kɛ tugun ani a tɛ jate katuguni `{ $to }` fana bilala.
       *[other] [deprecation] Taamasere `{ $from }` `<{ $component }>` kan tɛ baara kɛ tugun ani a tɛ jate katuguni `{ $to }` fana bilala.
    }

deprecated-attribute-ignored = [deprecation] Taamasere `{ $attribute }` `<{ $component }>` kan tɛ baara kɛ tugun ani a tɛ jate.

deprecated-attribute-to-child = [deprecation] Taamasere `{ $attribute }` `<{ $component }>` kan tɛ baara kɛ tugun; den `<{ $child }>` kɛ.

deprecated-attribute-value-renamed = [deprecation] Taamasere `{ $attribute }` jate `{ $value }` `<{ $component }>` kan tɛ baara kɛ tugun; `{ $to }` kɛ.


## Language coverage

pluralize-english-only = `<pluralize>` bɛ se ka caya kɛ Angilɛkan dɔrɔn na, o de la a kumaw bɛ to i n'a fɔ sɛbɛnnikɛla ye u sɛbɛn cogo min na sɛbɛn kɔnɔ min sɛbɛnna { $locale } la. Caya sɛbɛn i yɛrɛ, walima a bila ni `pluralForm` taamasere ye.


## Checking against the schema

schema-element-unrecognized = Yɔrɔ `<{ $tag }>` tɛ Doenet yɔrɔ dɔnnen ye.

schema-element-not-allowed-at-root = Yɔrɔ `<{ $tag }>` tɛ daga sɛbɛn juu la.

schema-element-not-allowed-inside = Yɔrɔ `<{ $tag }>` tɛ daga `<{ $parent }>` kɔnɔ.

schema-attribute-unrecognized = Taamasere min tɔgɔ ye `{ $attribute }` ye, o tɛ yɔrɔ `<{ $tag }>` la.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Yɔrɔ `<{ $tag }>` taamasere `{ $attribute }` ka kan ka kɛ tulon ye min fɛn kelen-kelen bɛɛ ye kelen ye ninnu na: { $allowed }
       *[other] Yɔrɔ `<{ $tag }>` taamasere `{ $attribute }` ka kan ka kɛ kelen ye ninnu na: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select cogoya tɔgɔ man ɲi.  Cogoya tɔgɔ { $variantName } bɛ wolomali { $numOptions } kɔnɔ nka wolomali hakɛ ye { $numToSelect } ye.

select-variant-name-without-options = Cogoya dɔw bilala select kan nka wolomali si ma bila cogoya tɔgɔ kan min bɛ se ka kɛ: { $variantName }.

select-variant-name-not-possible = Cogoya tɔgɔ { $variantName } min bilala select kan, o tɛ cogoya tɔgɔ ye min bɛ se ka kɛ.

select-too-few-options = An tɛ se ka yɔrɔ { $numToSelect } woloma yɔrɔ { $numOptions } dɔrɔn na.

select-from-sequence-too-few-values = An tɛ se ka jate { $numToSelect } woloma tulon na min janya ye { $length } ye.

select-from-sequence-indices-count-mismatch = Indices hakɛ min bilala select kan, o ka kan ka bɛn wolomali hakɛ ma

select-from-sequence-indices-not-integers = Indices bɛɛ minnu bilala select kan, olu ka kan ka kɛ jate dafalenw ye

select-from-sequence-index-excluded = selectfromsequence taamasere bilalen tun bɔra kɛnɛma

select-from-sequence-indices-excluded-combination = selectfromsequence indices bilalenw tun ye ɲagaminen bɔlen ye

select-from-sequence-coprime-not-positive-integers = An tɛ se ka coprime ɲagaminenw woloma katuguni jate ɲuman dafalenw tɛ woloma.

select-from-sequence-coprime-common-factor = An tɛ se ka coprime jatew woloma. Jate bɛɛ minnu bɛ se ka kɛ, faktɛri kelen bɛ olu bɛɛ la. ("from" walima "to" jate bilalenw ka kan ka kɛ coprime ye ni "step" ye.)

select-from-sequence-coprime-single-number = An tɛ se ka coprime ɲagaminenw woloma jate kelen na min tɛ 1 ye.

select-from-sequence-excluded-too-many-combinations = Ɲagaminen 70% ni ka tɛmɛ bɔra selectFromSequence kɔnɔ

select-from-sequence-coprime-none-found = An ma se ka coprime jatew woloma. Jate bɛɛ minnu bɛ se ka kɛ, faktɛri kelen bɛ olu bɛɛ la.

select-from-sequence-too-few-unique-values = An tɛ se ka jate { $numToSelect } danfaralenw woloma tulon na min janya ye { $numPossibleValues } ye

select-prime-numbers-too-few-values = An tɛ se ka jate { $numToSelect } woloma prime jate tulon na min janya ye { $numValues } ye

select-prime-numbers-values-count-mismatch = Jate hakɛ min bilala select kan, o ka kan ka bɛn wolomali hakɛ ma

select-prime-numbers-values-not-prime = Jate bɛɛ minnu bilala select prime number kan, olu ka kan ka kɛ prime jate tulon kɔnɔ

select-prime-numbers-values-excluded-combination = selectPrimeNumbers jate bilalenw tun ye ɲagaminen bɔlen ye

select-prime-numbers-excluded-too-many-combinations = Ɲagaminen 70% ni ka tɛmɛ bɔra selectPrimeNumbers kɔnɔ

select-random-combination-fluke = Ko min tɛ se ka kɛ abada, o kosɔn an ma se ka jate lakolonw ɲagaminen woloma

select-random-value-fluke = Ko min tɛ se ka kɛ abada, o kosɔn an ma se ka jate lakolon woloma
