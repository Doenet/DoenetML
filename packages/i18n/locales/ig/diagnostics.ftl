# Igbo diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Igbo has a single plural category and marks no number on the noun, so a
# countable message needs no selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = A na-eleghara { $attributes } anya mgbe e depụtara ntụpọ ọgwụgwụ abụọ

line-segment-attributes-ignored-with-endpoint-and-midpoint = A na-eleghara { $attributes } anya mgbe e depụtara ntụpọ ọgwụgwụ na ntụpọ etiti ha abụọ

line-segment-midpoint-offset-without-midpoint = midpointOffset enweghị mmetụta n'enweghị ntụpọ etiti

## `<line>`

line-points-undetermined-dimensions = Ahịrị na-agafe ntụpọ ndị a na-amaghị nha ha.

line-points-too-few-dimensions = Ahịrị ga-agafe ntụpọ nwere opekempe nha abụọ.

line-points-depend-on-variables = Ahịrị na-agafe ntụpọ dabere na mgbanwe: { $variables }.

line-equation-invalid-format = Ụdị na-ezighị ezi maka nhata ahịrị na mgbanwe { $variable1 } na { $variable2 }.

## `<ray>`

ray-overprescribed-through = E ji through, endpoint na direction kọwaa ụzarụ ọnụ. A na-eleghara through e depụtara anya.

ray-dimension-mismatch = numDimensions adabaghị n'ụzarụ.

## `<vector>`

vector-overprescribed-head = E ji head, tail na displacement kọwaa vekta ọnụ. A na-eleghara head e depụtara anya.

vector-dimension-mismatch = numDimensions adabaghị na vekta.

## Attracting and constraining

attract-to-without-nearest-point = Enweghị ike ịdọta na `<{ $component }>` n'ihi na o nweghị mgbanwe ọnọdụ a na-akpọ nearestPoint.

constrain-to-without-nearest-point = Enweghị ike ịmachi na `<{ $component }>` n'ihi na o nweghị mgbanwe ọnọdụ a na-akpọ nearestPoint.

constrain-to-interior-without-nearest-point = Enweghị ike ịmachi n'ime `<{ $component }>` n'ihi na o nweghị mgbanwe ọnọdụ a na-akpọ nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = A na-eleghara labelPosition anya maka choiceInput na-adịghị n'otu ahịrị

## Ordering children by index

choice-input-indices-count-mismatch = A na-eleghara ọnụọgụ e depụtara maka choiceInput anya n'ihi na ọnụọgụ ha adabaghị na ọnụọgụ ụmụ choice.

pretzel-indices-count-mismatch = A na-eleghara ọnụọgụ e depụtara maka problem anya n'ihi na ọnụọgụ ha adabaghị na ọnụọgụ ụmụ problem.

shuffle-indices-count-mismatch = A na-eleghara ọnụọgụ e depụtara maka shuffle anya n'ihi na ọnụọgụ ha adabaghị na ọnụọgụ akụkụ.

indices-ignored-out-of-range = A na-eleghara ọnụọgụ e depụtara maka { $component } anya n'ihi na ụfọdụ dị n'èzí oke.

pretzel-indices-repeated = A na-eleghara ọnụọgụ e depụtara maka pretzel anya n'ihi na e kwughachiri ụfọdụ.

pretzel-circuit-first-index = A na-eleghara ọnụọgụ e depụtara maka pretzel n'ọnọdụ circuit anya n'ihi na nke mbụ ga-abụ 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ka `<{ $component }>` wee rụọ ọrụ na ụmụ ụdị string, a ga-edepụta àgwà `type`.

invalid-type-defaulting-to-math = type { $type } ezighi ezi maka akụkụ { $component }. Ọ ga-abụ otu n'ime math, text, number ma ọ bụ boolean. A na-edobe ya na math.

string-not-valid-component-to-arrange = String "{ $value }" abụghị akụkụ ziri ezi maka { $component }. A na-eleghara ya anya.

## Types and variables

invalid-type-defaulting-to-number = type { $type } ezighi ezi, a na-edobe type na number.

invalid-variable-value = Uru mgbanwe na-ezighị ezi: `{ $value }`

## Variants

variant-index-must-be-number = Ọnụọgụ ụdị { $index } ga-abụ nọmba

variant-index-must-be-integer = Ọnụọgụ ụdị { $index } ga-abụ nọmba zuru ezu

## `<sideBySide>`

side-by-side-absolute-widths = Emebeghị `<{ $component }>` maka nha zuru ezu. A na-edobe obosara na nke ntụnyere.

side-by-side-absolute-margins = Emebeghị `<{ $component }>` maka nha zuru ezu. A na-edobe akụkụ na nke ntụnyere.

side-by-side-no-block-child = `<{ $component }>` ezighi ezi: ọ ga-enwe opekempe otu nwa nke ụdị blọk.

## `<label>`

label-for-ignored-on-graphical = A na-eleghara àgwà `for` na `<label>` eserese anya.

label-for-must-resolve-to-one = Àgwà `for` na `<label>` ga-ezo aka n'otu akụkụ naanị.

label-for-unresolved = Enweghị ike ime ka àgwà `for` na `<label>` zoo aka n'akụkụ ọ bụla.

label-for-answer-with-authored-inputs = Àgwà `for` na `<label>` na-ezo aka na `<answer>` nwere ntinye e dere n'ụzọ doro anya; zoo aka na ntinye ahụ kpọmkwem.

label-for-answer-without-input = Àgwà `for` na `<label>` na-ezo aka na `<answer>` enweghị ntinye a ga-akpọ aha.

label-for-must-reference-input-or-answer = Àgwà `for` na `<label>` ga-ezo aka na ntinye ma ọ bụ azịza.

## Accessibility

accessibility-short-description-or-decorative = Maka nnweta, `<{ $component }>` ga-enwe nkọwa dị mkpirikpi ma ọ bụ ka e kwuo na ọ bụ ihe ịchọ mma.

accessibility-video-short-description = Maka nnweta, `<video>` ga-enwe nkọwa dị mkpirikpi.

accessibility-input-short-description-or-label = Maka nnweta, `<{ $component }>` ga-enwe nkọwa dị mkpirikpi ma ọ bụ akara aha.

accessibility-answer-input-short-description-or-label = Maka nnweta, `<answer>` na-eke ntinye ga-enwe nkọwa dị mkpirikpi ma ọ bụ akara aha.

accessibility-short-description-contains-math = Nkọwa dị mkpirikpi ekwesịghị inwe akụkụ mgbakọ dị ka `<{ $component }>`. Kọwaa mgbakọ ọ bụla n'okwu.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } nwere ọdịiche na-ezughị maka ederede isiokwu ngalaba (ọnọdụ gbara ọchịchịrị) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ọ chọrọ opekempe { $threshold }:1).
       *[other] { $colorName } nwere ọdịiche na-ezughị maka ederede isiokwu ngalaba ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ọ chọrọ opekempe { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Emebeghị `<circle>` na-agafe ntụpọ { $count } mgbe ntụpọ ndị ahụ enweghị uru nọmba.

circle-too-many-through-points = Enweghị ike ịgbakọ okirikiri na-agafe ntụpọ karịrị 3.

circle-overprescribed-radius-center-points = Enweghị ike ịgbakọ okirikiri nwere redias, etiti na ntụpọ ọgafe e depụtara ha niile.

circle-center-with-multiple-points = Enweghị ike ịgbakọ okirikiri nwere etiti e depụtara na-agafe ntụpọ karịrị 1.

circle-radius-too-small = Enweghị ike ịgbakọ okirikiri: ebe ọ bụ na ebe dị n'etiti ntụpọ abụọ ahụ bụ { $distance }, redias { $radius } e depụtara pere mpe nke ukwuu.

circle-radius-with-many-points = Enweghị ike ike okirikiri na-agafe ntụpọ karịrị abụọ nwere redias e depụtara.

circle-invalid-center-or-through-points = Etiti ma ọ bụ ntụpọ ọgafe nke okirikiri ezighi ezi.

circle-radius-center-with-multiple-points = Enweghị ike ịgbakọ redias okirikiri nwere etiti e depụtara na-agafe ntụpọ karịrị 1.

circle-change-radius-non-numerical = Enweghị ike ịgbanwe redias okirikiri na-agafe ntụpọ na-enweghị uru nọmba

circle-radius-with-points-non-numerical = Enweghị ike ike okirikiri na-agafe ntụpọ karịrị otu nwere redias e depụtara mgbe enweghị uru nọmba.

circle-change-center-non-numerical = Emebeghị ịgbanwe etiti okirikiri na-agafe ntụpọ na-enweghị uru nọmba.

## `<function>`

function-domain-insufficient-dimensions = Nha ebe ọrụ ezughị. Ebe ahụ nwere oghere { $intervals } mana ọrụ nwere ntinye { $inputs }.

function-domain-invalid-format = Ụdị ebe ọrụ ezighi ezi.

function-ignoring-non-numerical =
    { $type ->
        [maximum] A na-eleghara uru kachasị elu nke ọrụ nke na-abụghị nọmba anya.
        [minimum] A na-eleghara uru kachasị ala nke ọrụ nke na-abụghị nọmba anya.
        [extremum] A na-eleghara uru njedebe nke ọrụ nke na-abụghị nọmba anya.
        [point] A na-eleghara ntụpọ ọrụ nke na-abụghị nọmba anya.
        [slope] A na-eleghara mkpọda ọrụ nke na-abụghị nọmba anya.
       *[other] A na-eleghara { $type } nke ọrụ nke na-abụghị nọmba anya.
    }

function-ignoring-empty =
    { $type ->
        [maximum] A na-eleghara uru kachasị elu nke ọrụ nke tọgbọrọ chakoo anya.
        [minimum] A na-eleghara uru kachasị ala nke ọrụ nke tọgbọrọ chakoo anya.
        [extremum] A na-eleghara uru njedebe nke ọrụ nke tọgbọrọ chakoo anya.
        [point] A na-eleghara ntụpọ ọrụ nke tọgbọrọ chakoo anya.
       *[other] A na-eleghara { $type } nke ọrụ nke tọgbọrọ chakoo anya.
    }

function-points-too-close = Ọrụ nwere ntụpọ abụọ dị nso nke ukwuu. Enweghị ike ịkọwa ọrụ ahụ.

function-iterates-input-output-mismatch = Nkwughachi ọrụ ga-ekwe omume naanị ma ọ bụrụ na ọnụọgụ ntinye hà ọnụọgụ mmepụta. Ọrụ a nwere ntinye { $inputs } na mmepụta { $outputs }.

## `<sequence>`

sequence-invalid-length = Ogologo usoro ezighi ezi. Ọ ga-abụ nọmba zuru ezu na-adịghị ala karịa efu.

sequence-invalid-step = Nzọụkwụ usoro ezighi ezi. Ọ ga-abụ nọmba maka usoro ụdị { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" nke usoro nọmba ezighi ezi. Ọ ga-abụ nọmba.

sequence-invalid-endpoint-letters = "{ $attribute }" nke usoro mkpụrụedemede ezighi ezi. Ọ ga-abụ ngwakọta mkpụrụedemede.

sequence-invalid-endpoint = "{ $attribute }" nke usoro ezighi ezi.

select-from-sequence-coprime-not-numbers = a na-eleghara coprime anya n'ihi na ọ bụghị nọmba ka a na-ahọrọ

select-from-sequence-coprime-with-exclude-combinations = a na-eleghara coprime anya n'ihi na e depụtara excludeCombinations

## Resolving a `target`

target-not-found = target ezighi ezi maka `<{ $source }>`: achọtaghị ihe e bu n'obi.

target-state-variable-not-found = target ezighi ezi maka `<{ $source }>`: achọtaghị mgbanwe ọnọdụ a na-akpọ "{ $property }" na `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Mgbanwe nke `<odeSystem>` ga-adị iche na mgbanwe nọọrọ onwe ya.

ode-system-duplicate-variable-names = Enweghị ike ịkọwa ọrụ ODE RHS nwere aha mgbanwe dabere nke e kwughachiri.

ode-system-rhs-function-error = Enweghị ike ịkọwa ọrụ ODE RHS. Enwere njehie n'ike ọrụ mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Enweghị ike ịkọwa akụkụ n'etiti ahịrị { $count }

angle-invalid-through-point = Ntụpọ na-ezighị ezi na through nke `<angle>`

parabola-vertex-too-many-points = Emebeghị parabola nwere ọnụ na-agafe ntụpọ karịrị 1.

parabola-too-many-points = Emebeghị parabola na-agafe ntụpọ karịrị 3.

intersection-too-many-items = Emebeghị nzukọ maka ihe karịrị abụọ

## Other math components

ionic-compound-not-two-ions = Emebeghị ngwakọta ayọn maka ihe ọ bụla ma e wezụga ayọn abụọ.

ionic-compound-needs-cation-and-anion = E mere ngwakọta ayọn naanị maka otu cation na otu anion.

solve-equations-cannot-evaluate = Enweghị ike idozi nhata n'ihi na enweghị ike ịtụle ya: { $equation }

math-operators-operand-number-required = A ga-edepụta operandNumber mgbe a na-ewepụta operand mgbakọ.

eigen-decomposition-failed = Enweghị ike ịgbakọ eigenvalue nke matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } apụtaghị n'ụkpụrụ, ya mere ọ ga-adaba na oghere efu mgbe niile.

## `<graph>`

graph-grid-invalid = `<graph>`: enweghị ike ịkọwa grid="{ $grid }". Ọ ga-abụ none, medium, dense, ma ọ bụ nọmba abụọ dị mma nke oghere kewara, dị ka grid="1 0.5". Adịghị ese grid ọ bụla.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: akwadoghị xLabelPosition="left" na ngosi prefigure; a na-eji omume ọnọdụ aka nri.

prefigure-y-label-position-unsupported = `<graph>`: akwadoghị yLabelPosition="bottom" na ngosi prefigure; a na-eji omume ọnọdụ elu.

prefigure-invalid-axis-bounds = `<graph>`: oke aksis ezighi ezi maka ntụgharị prefigure; a na-eji bbox ndabara (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: obosara ezighi ezi maka ntụgharị prefigure; a na-eji obosara eserese ndabara 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ezighi ezi maka ntụgharị prefigure; a na-eji ọnụọgụ ndabara 1.

prefigure-grid-spacing-too-fine = `<graph>`: oghere grid pere mpe nke ukwuu maka oke aksis; ewepụrụ grid na ngosi prefigure.

prefigure-annotations-not-rendered = `<graph>`: agaghị egosi ihe ndetu mgbe a na-adịghị eji ngosi PreFigure.

multiple-annotations-children = Achọtara ọtụtụ ụmụ `<annotations>` na `<graph>`; a na-eleghara ha niile anya ma e wezụga nke ikpeazụ.

## Referring to other components

copy-unrecognized-component-type = Enweghị ike ịgbatị ma ọ bụ detuo ụdị akụkụ a na-amaghị: { $type }.

copy-prop-not-found = Achọtaghị àgwà { $property } n'akụkụ ụdị { $component }

collect-no-source = Achọtaghị isi mmalite maka collect.

collect-invalid-component-type = Enweghị ike ịchịkọta akụkụ ụdị `<{ $component }>` n'ihi na ọ bụ ụdị akụkụ na-ezighị ezi.

reference-index-unavailable = Enweghị ike izo aka na ọnụọgụ `{ $reference }`

## `<callAction>`

component-action-unavailable = Enweghị ike ịkpọ { $action } n'akụkụ `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ọdịdị data ezighi ezi. Ahịrị nwere ogologo na-adịghị adaba. Achọtara ya na componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data nwere aha ogidi e kwughachiri. Achọtara ya na componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data enweghị otu aha ogidi. Achọtara ya na componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award nke azịza a dabere na azịza akara answer n'onwe ya zipụrụ, nke ga-eweta omume a na-atụghị anya ya.

answer-max-num-attempts-in-section-wide-check-work = Ịdobe `maxNumAttempts` na `<answer>` dị n'ime igbe nwere `sectionWideCheckWork` enweghị mmetụta, n'ihi na igbe ahụ na-achịkwa ọnụọgụ mgbalị. Dobe `maxNumAttempts` n'igbe ahụ kama.

nested-section-wide-check-work-max-num-attempts = Ịdobe `maxNumAttempts` n'igbe nwere `sectionWideCheckWork` dị n'ime igbe ọzọ nwere `sectionWideCheckWork` enweghị mmetụta, n'ihi na igbe dị n'èzí na-achịkwa ọnụọgụ mgbalị. Dobe `maxNumAttempts` n'igbe dị n'èzí kama.

answer-attributes-need-symbolic-equality = Àgwà { $attributes } agaghị enwe mmetụta ma ọ bụrụ na edobeghị symbolicEquality.

answer-invalid-type = Ụdị na-ezighị ezi maka azịza: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ebe ọ bụ na akụkụ `<{ $component }>` enweghị aha, enweghị ike iji ya mee àgwà module

module-attribute-name-already-defined = Enweghị ike iji akụkụ `<{ $component } name="{ $name }">` mee àgwà maka module n'ihi na ụdị akụkụ `<module>` enweelarị àgwà a na-akpọ "{ $name }".

conditional-content-condition-ignored = A na-eleghara àgwà `condition` anya n'akụkụ `<conditionalContent>` nwere ụmụ case ma ọ bụ else.

slider-markers-type-mismatch = Ụdị akara adabaghị na ụdị slider.

pretzel-problem-needs-statement-and-answer = pretzel ezighi ezi: `<problem>` ọ bụla ga-enwe otu `<statement>` na otu `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel ezighi ezi: na mode="circuit", `<problem>` mbụ enweghị ike ịbụ ihe mgbagwoju anya.

## Attribute values

attribute-invalid-values = Uru { $values } ezighi ezi maka àgwà `{ $attribute }`; a na-eleghara ya anya.

attribute-must-be-references = Uru `{ $value }` ezighi ezi maka àgwà `{ $attribute }`. Àgwà ga-enwe ntụaka ndị na-amalite na `$`.

math-input-invalid-function-names = <mathInput>: a na-eleghara aha ọrụ na-ezighị ezi na { $attribute } anya: { $names }. Akụkụ ngosi nke aha ọ bụla ga-enwe opekempe mkpụrụedemede 2 (mkpụrụedemede ma ọ bụ ahịrị njikọ); mgbakwunye `|<mathspeak alternative>` nwere ike iso.

## Building components from the source

component-type-invalid = Ụdị akụkụ na-ezighị ezi: `<{ $componentType }>`

attribute-repeated = Enweghị ike ikwughachi àgwà { $attribute }.

attribute-invalid-for-component = Àgwà "{ $attribute }" ezighi ezi maka akụkụ ụdị `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Nkọwa ụdị { $styleNumber } nwere ọdịiche na-ezughị maka { $context ->
        [text-on-background] agba ederede megide agba azụ
        [high-contrast] agba ọdịiche dị elu megide ebe ọrụ
        [line] agba ahịrị megide ebe ọrụ
        [marker] agba akara megide ebe ọrụ
       *[text-on-canvas] agba ederede megide ebe ọrụ
    }{ $mode ->
        [dark] { " (ọnọdụ gbara ọchịchịrị)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ọ chọrọ opekempe { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ọ bụ ezie na nkọwa ụdị { $styleNumber } depụtara agba nwere ọdịiche zuru ezu maka ọnọdụ ìhè, agba ọnọdụ gbara ọchịchịrị e si na ha nweta nwere ọdịiche na-ezughị n'etiti agba ederede na agba azụ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ọ chọrọ opekempe { $threshold }:1). { $suggestion ->
        [available] Ka ọdịiche zuru ezu n'ọnọdụ gbara ọchịchịrị, mee ka ọdịiche ọnọdụ ìhè dịkwuo elu (dịka ọmụmaatụ dobe { $lightAttribute }="{ $lightColor }") ma ọ bụ gbanwee agba ọnọdụ gbara ọchịchịrị (dịka ọmụmaatụ dobe { $darkAttribute }="{ $darkColor }").
       *[none] Ka ọdịiche zuru ezu n'ọnọdụ gbara ọchịchịrị, mee ka ọdịiche ọnọdụ ìhè dịkwuo elu ma ọ bụ gbanwee agba ndị e nwetara site na textColorDarkMode na/ma ọ bụ backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ọ bụ ezie na nkọwa ụdị { $styleNumber } depụtara agba ederede nwere ọdịiche zuru ezu maka ọnọdụ ìhè, agba ederede ọnọdụ gbara ọchịchịrị e si na ya nweta nwere ọdịiche na-ezughị megide ebe ọrụ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ọ chọrọ opekempe { $threshold }:1). { $suggestion ->
        [available] Ka ọdịiche zuru ezu n'ọnọdụ gbara ọchịchịrị, mee ka ọdịiche ọnọdụ ìhè dịkwuo elu (dịka ọmụmaatụ dobe textColor="{ $lightColor }") ma ọ bụ gbanwee agba ọnọdụ gbara ọchịchịrị (dịka ọmụmaatụ dobe textColorDarkMode="{ $darkColor }").
       *[none] Ka ọdịiche zuru ezu n'ọnọdụ gbara ọchịchịrị, mee ka ọdịiche ọnọdụ ìhè dịkwuo elu ma ọ bụ gbanwee agba e nwetara site na textColorDarkMode.
    }

section-multiple-style-palettes = Ngalaba nwere ike ịhọrọ naanị otu <stylePalette>; a na-eji nke ikpeazụ.

## Unique variants

variant-num-to-select-not-non-negative-integer = enweghị ike ịkọwa ụdị pụrụ iche nke { $component } n'ihi na numToSelect abụghị nọmba zuru ezu na-adịghị ala karịa efu.

variant-num-to-select-not-constant-number = enweghị ike ịkọwa ụdị pụrụ iche nke { $component } n'ihi na numToSelect abụghị nọmba na-agbanwaghị.

variant-with-replacement-not-constant-boolean = enweghị ike ịkọwa ụdị pụrụ iche nke { $component } n'ihi na withReplacement abụghị boolean na-agbanwaghị.

variant-select-weight-disables-unique = A na-agbanyụ ụdị pụrụ iche maka select ma ọ bụrụ na e nwere nhọrọ nwere selectWeight ma ọ bụ selectForVariants

variant-coprime-undetermined = enweghị ike ịkọwa ụdị pụrụ iche nke { $component } n'ihi na enweghị ike ịma na coprime bụ ụgha mgbe niile.

variant-attribute-not-constant = enweghị ike ịkọwa ụdị pụrụ iche nke { $component } n'ihi na { $attribute } abụghị ihe na-agbanwaghị.

variant-attribute-not-number = enweghị ike ịkọwa ụdị pụrụ iche nke { $component } n'ihi na { $attribute } abụghị nọmba.

variant-attribute-wrong-type-for-sequence =
    enweghị ike ịkọwa ụdị pụrụ iche nke { $component } nke ụdị { $type } n'ihi na { $attribute } abụghị { $expected ->
        [letters-combination] ngwakọta mkpụrụedemede
        [math-expression] okwu mgbakọ ziri ezi
        [integer] nọmba zuru ezu
       *[number] nọmba
    }.

variant-length-not-integer = enweghị ike ịkọwa ụdị pụrụ iche nke { $component } n'ihi na length abụghị nọmba zuru ezu.

variant-sort-not-implemented = emebeghị ụdị pụrụ iche nke { $component } nwere sort

variant-exclude-combinations-not-implemented = emebeghị ụdị pụrụ iche nke { $component } nwere excludeCombinations

variant-math-exclude-not-implemented = emebeghị ụdị pụrụ iche nke { $component } nke ụdị math nwere exclude

variant-non-constant-exclude-not-implemented = emebeghị ụdị pụrụ iche nke { $component } nwere exclude na-agbanwe agbanwe

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: akwadoghị ya na ngosi graph prefigure; a wụfere nwa ya.

prefigure-descendant-invalid-geometry = { $subject }: jiometrị na-enweghị njedebe ma ọ bụ nke na-ezughị ezu; a wụfere nwa ya.

prefigure-curve-label-omitted = { $subject }: akwadoghị akara aha n'akụkụ ahịrị gbagọrọ agbagọ e gbanwere; ewepụrụ akara aha.

prefigure-curve-unsupported-definition-type = { $subject }: akwadoghị ụdị nkọwa ọrụ ahịrị gbagọrọ agbagọ '{ $definitionType }'; a wụfere nwa ya.

prefigure-region-flip-functions-unsupported = { $subject }: akwadoghị àgwà flipFunctions na regionBetweenCurves; a wụfere nwa ya.

prefigure-region-non-formula-child = { $subject }: a na-akwado naanị ọrụ ụmụ nke ụdị formula na regionBetweenCurves; a wụfere nwa ya.

prefigure-label-position-unsupported =
    { $subject }: akwadoghị labelPosition '{ $labelPosition }' maka { $labelKind ->
        [line-family] akara aha ezinụlọ ahịrị
       *[point] akara aha ntụpọ
    }; a na-eji nhazi PreFigure ndabara.

prefigure-fill-style-unsupported = { $subject }: akwadoghị ụdị mmejupụta '{ $fillStyle }' na PreFigure; a na-alaghachi na mmejupụta siri ike.

prefigure-line-style-unknown = { $subject }: ewepụrụ ụdị ahịrị a na-amaghị '{ $lineStyle }' na mmepụta PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: e gbanwere ụdị akara '{ $markerStyle }' ka ọ bụrụ ụdị PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: akwadoghị ụdị akara '{ $markerStyle }' na PreFigure; a na-eji ụdị ndabara.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ezighi ezi; enweghị ike ịchọpụta ihe e bu n'obi. Ewepụrụ ihe ndetu.

annotation-ref-multiple-targets = `<annotation>`: `ref` zoro aka n'ọtụtụ ihe; a na-eji nke mbụ.

annotation-ref-outside-graph = `<annotation>`: `ref` ezighi ezi; ihe e bu n'obi dị n'èzí grafụ nwere ya. Ewepụrụ ihe ndetu.

annotation-ref-unsupported-target = `<annotation>`: `ref` ezighi ezi; ihe e bu n'obi abụghị ihe eserese a na-akwado na ntụgharị prefigure. Ewepụrụ ihe ndetu.

annotation-text-missing = `<annotation>`: `text` adịghị ma ọ bụ tọgbọrọ chakoo; a na-ewepụta ederede efu.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Achọpụtara ndabere gburugburu.
       *[other] Achọpụtara ndabere gburugburu metụtara akụkụ `<{ $componentType }>`.
    }

reference-no-referent = Achọtaghị ihe a na-ezo aka na ya maka ntụaka: `{ $reference }`

reference-multiple-referents = Achọtara ọtụtụ ihe a na-ezo aka na ha maka ntụaka: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ụdị ezighi ezi maka àgwà { $attribute } nke `<{ $componentType }>`.

children-invalid = Ụmụ na-ezighị ezi maka `<{ $componentType }>`: achọtara ụmụ na-ezighị ezi: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Uru `{ $value }` ezighi ezi maka àgwà `{ $attribute }`; a na-eji uru `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Achọtaghị ụdị DoenetML { $version }.
       *[other] Achọtaghị ụdị DoenetML { $version }. A na-alaghachi na ụdị { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML na-ezighị ezi: { $content }

parse-tag-missing-close-tag = DoenetML na-ezighị ezi: Akara `{ $tag }` enweghị akara mmechi. A tụrụ anya akara na-emechi onwe ya ma ọ bụ akara `</{ $tagName }>`.

parse-tag-error = DoenetML na-ezighị ezi: Njehie n'akara `<{ $tagName }>`

parse-attribute-missing-value = DoenetML na-ezighị ezi: Àgwà `{ $attribute }` na-ezighị ezi yiri ka ọ na-enweghị uru.

parse-attribute-invalid = DoenetML na-ezighị ezi: Àgwà `{ $attribute }` ezighi ezi

parse-attribute-value-invalid = DoenetML na-ezighị ezi: Uru àgwà `{ $value }` ezighi ezi

parse-attribute-value-quote-mismatch = DoenetML na-ezighị ezi: Uru àgwà `{ $value }` ezighi ezi. Akara nhota adabaghị. O yiri ka `{ $quote }` na-efu

parse-open-tag-name-missing = DoenetML na-ezighị ezi: Achọtara akara na-enweghị aha akara, dịka `<`

parse-tag-not-closed = DoenetML na-ezighị ezi: Emechighị akara `{ $tag }` (o yiri ka `>` na-efu).

parse-self-closing-tag-name-missing = DoenetML na-ezighị ezi: Achọtara akara na-enweghị aha akara `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML na-ezighị ezi: Emechighị akara `{ $tag }` (o yiri ka `/>` na-efu).

parse-tag-invalid-attributes = DoenetML na-ezighị ezi: Akara `{ $tag }` ezighi ezi. O nwere ike inwe àgwà na-ezighị ezi.

parse-close-tag-name-missing = DoenetML na-ezighị ezi: Achọtara akara mmechi na-enweghị aha akara, dịka `</`

parse-attribute-value-unquoted = A ga-etinye uru àgwà n'akara nhota: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML na-ezighị ezi: Achọtara akara mmechi `{ $tag }`, mana ọ dịghị akara mmeghe dabara ya

parse-close-tag-mismatched = DoenetML na-ezighị ezi: Akara mmechi adabaghị. A tụrụ anya `</{ $expected }>`. Achọtara `{ $found }`

parser-node-unconvertible = Enweghị ike ịgbanwe ọnụ { $node } ka ọ bụrụ ọnụ Dast.

## Names

name-attribute-invalid =
    Àgwà name='{ $name }' ezighi ezi. { $reason ->
        [characters] Aha nwere ike inwe naanị mkpụrụedemede, nọmba, ahịrị okpuru ma ọ bụ ahịrị njikọ.
       *[start] Aha ga-amalite na mkpụrụedemede.
    }

component-name-invalid-start = Aha akụkụ "{ $name }" ezighi ezi. Aha ga-amalite na mkpụrụedemede.

## `<answer>` sugar

answer-video-watched-missing-video = Azịza ụdị videoWatched ga-enwe àgwà video

answer-video-watched-video-not-reference = Azịza ụdị videoWatched ga-enwe àgwà video nke bụ ntụaka

answer-name-not-single-text = Àgwà name nke azịza ga-enwe naanị otu nwa text

## Referencing another document

external-doenetml-recursion-limit = Enweghị ike inweta DoenetML mpụga n'ihi ọtụtụ ọkwa nkwughachi. Ọ̀ nwere ntụaka gburugburu?

external-doenetml-unavailable = Enweghị ike inweta DoenetML site na { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML e nwetara site na { $attribute }="{ $uri }" ezighi ezi: ọ dabaghị na ụdị akụkụ "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Anaghịzi eji àgwà `{ $from }`; jiri `{ $to }` kama.
       *[other] [deprecation] Anaghịzi eji àgwà `{ $from }` na `<{ $component }>`; jiri `{ $to }` kama.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Anaghịzi eji àgwà `{ $from }` a na-elegharakwa ya anya n'ihi na e depụtakwara `{ $to }`.
       *[other] [deprecation] Anaghịzi eji àgwà `{ $from }` na `<{ $component }>` a na-elegharakwa ya anya n'ihi na e depụtakwara `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Anaghịzi eji àgwà `{ $attribute }` na `<{ $component }>` a na-elegharakwa ya anya.


## Language coverage

pluralize-english-only = `<pluralize>` nwere ike ime ọtụtụ naanị n'asụsụ Bekee, ya mere a na-ahapụ ederede ya ka ọ dị n'akwụkwọ e dere na { $locale }. Dee ụdị ọtụtụ kpọmkwem, ma ọ bụ dobe ya site na àgwà `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Akụkụ `<{ $tag }>` abụghị akụkụ Doenet a maara.

schema-element-not-allowed-at-root = Anaghị ekwe ka akụkụ `<{ $tag }>` dị na mgbọrọgwụ akwụkwọ.

schema-element-not-allowed-inside = Anaghị ekwe ka akụkụ `<{ $tag }>` dị n'ime `<{ $parent }>`.

schema-attribute-unrecognized = Akụkụ `<{ $tag }>` enweghị àgwà a na-akpọ `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Àgwà `{ $attribute }` nke akụkụ `<{ $tag }>` ga-abụ ndepụta nke ihe ọ bụla dị na ya bụ otu n'ime: { $allowed }
       *[other] Àgwà `{ $attribute }` nke akụkụ `<{ $tag }>` ga-abụ otu n'ime: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Aha ụdị ezighi ezi maka select. Aha ụdị { $variantName } pụtara na nhọrọ { $numOptions } mana ọnụọgụ a ga-ahọrọ bụ { $numToSelect }.

select-variant-name-without-options = E depụtara ụfọdụ ụdị maka select mana edepụtaghị nhọrọ maka aha ụdị nwere ike ime: { $variantName }.

select-variant-name-not-possible = Aha ụdị { $variantName } e depụtara maka select abụghị aha ụdị nwere ike ime.

select-too-few-options = Enweghị ike ịhọrọ akụkụ { $numToSelect } site na naanị { $numOptions }.

select-from-sequence-too-few-values = Enweghị ike ịhọrọ uru { $numToSelect } site na usoro nke ogologo ya bụ { $length }.

select-from-sequence-indices-count-mismatch = Ọnụọgụ ọnụọgụ e depụtara maka select ga-adaba na ọnụọgụ a ga-ahọrọ

select-from-sequence-indices-not-integers = Ọnụọgụ niile e depụtara maka select ga-abụ nọmba zuru ezu

select-from-sequence-index-excluded = E depụtara ọnụọgụ selectfromsequence nke ewepụrụ

select-from-sequence-indices-excluded-combination = E depụtara ọnụọgụ selectfromsequence nke bụ ngwakọta ewepụrụ

select-from-sequence-coprime-not-positive-integers = Enweghị ike ịhọrọ ngwakọta coprime n'ihi na ọ bụghị nọmba zuru ezu dị mma ka a na-ahọrọ.

select-from-sequence-coprime-common-factor = Enweghị ike ịhọrọ nọmba coprime. Uru niile nwere ike ime nwere otu ihe nkewa. (Uru "from" ma ọ bụ "to" e depụtara ga-abụ coprime na "step".)

select-from-sequence-coprime-single-number = Enweghị ike ịhọrọ ngwakọta coprime site n'otu nọmba na-abụghị 1.

select-from-sequence-excluded-too-many-combinations = Ewepụrụ ihe karịrị 70% nke ngwakọta na selectFromSequence

select-from-sequence-coprime-none-found = Enweghị ike ịhọrọ nọmba coprime. Uru niile nwere ike ime nwere otu ihe nkewa.

select-from-sequence-too-few-unique-values = Enweghị ike ịhọrọ uru pụrụ iche { $numToSelect } site na usoro nke ogologo ya bụ { $numPossibleValues }

select-prime-numbers-too-few-values = Enweghị ike ịhọrọ uru { $numToSelect } site na ndepụta nọmba mbụ nke ogologo ya bụ { $numValues }

select-prime-numbers-values-count-mismatch = Ọnụọgụ uru e depụtara maka select ga-adaba na ọnụọgụ a ga-ahọrọ

select-prime-numbers-values-not-prime = Uru niile e depụtara maka select prime number ga-adị na ndepụta nọmba mbụ

select-prime-numbers-values-excluded-combination = Uru selectPrimeNumbers e depụtara bụ ngwakọta ewepụrụ

select-prime-numbers-excluded-too-many-combinations = Ewepụrụ ihe karịrị 70% nke ngwakọta na selectPrimeNumbers

select-random-combination-fluke = Site n'ohere na-adịghị adịkarị, enweghị ike ịhọrọ ngwakọta uru enweghị usoro

select-random-value-fluke = Site n'ohere na-adịghị adịkarị, enweghị ike ịhọrọ uru enweghị usoro
