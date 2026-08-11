# Fon diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] È nɔ jó { $attributes } dó hwenu e è ɖɔ nùwlé wè é
       *[other] È nɔ jó { $attributes } dó hwenu e è ɖɔ nùwlé wè é
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] È nɔ jó { $attributes } dó hwenu e è ɖɔ nùwlé kpó tɛntin kpó é
       *[other] È nɔ jó { $attributes } dó hwenu e è ɖɔ nùwlé kpó tɛntin kpó é
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset má nɔ w'azɔ̌ ǎ enyi tɛntin ɖé ma ɖè ǎ

## `<line>`

line-points-undetermined-dimensions = Dlɛ̌n gbɔn tɛ́n e sín ɖaxó è má tuùn ǎ lɛ́ é jí.

line-points-too-few-dimensions = Dlɛ̌n ɖó ná gbɔn tɛ́n e ɖó ɖaxó wè ɖibla lɛ́ é jí.

line-points-depend-on-variables = Dlɛ̌n gbɔn tɛ́n e ɖò nǔɖyɔ́ lɛ́ sí lɛ́ é jí: { $variables }.

line-equation-invalid-format = Dlɛ̌n sín équation sín alɔkpa má sɔgbe ǎ ɖò { $variable1 } kpó { $variable2 } kpó mɛ.

## `<ray>`

ray-overprescribed-through = È ɖɔ wězé ɔ́ gbɔn through, endpoint kpó direction kpó jí.  È jó through e è ɖɔ é dó.

ray-dimension-mismatch = numDimensions má sɔgbe ǎ ɖò wězé mɛ.

## `<vector>`

vector-overprescribed-head = È ɖɔ vecteur ɔ́ gbɔn head, tail kpó displacement kpó jí.  È jó head e è ɖɔ é dó.

vector-dimension-mismatch = numDimensions má sɔgbe ǎ ɖò vecteur mɛ.

## Attracting and constraining

attract-to-without-nearest-point = È má sixú dɔn dó `<{ $component }>` wú ǎ, ɖó é ɖó nearestPoint ǎ.

constrain-to-without-nearest-point = È má sixú blá dó `<{ $component }>` wú ǎ, ɖó é ɖó nearestPoint ǎ.

constrain-to-interior-without-nearest-point = È má sixú blá dó `<{ $component }>` mɛ ǎ, ɖó é ɖó nearestPoint ǎ.

## `<choiceInput>`

choice-input-label-position-ignored = È nɔ jó labelPosition dó nú choiceInput e má nyí inline ǎ é

## Ordering children by index

choice-input-indices-count-mismatch = È jó indices e è ɖɔ nú choiceInput lɛ́ é dó, ɖó indices sín kɛ́n má sɔgbe kpó choice ví lɛ́ sín kɛ́n kpó ǎ.

pretzel-indices-count-mismatch = È jó indices e è ɖɔ nú problem lɛ́ é dó, ɖó indices sín kɛ́n má sɔgbe kpó problem ví lɛ́ sín kɛ́n kpó ǎ.

shuffle-indices-count-mismatch = È jó indices e è ɖɔ nú shuffle lɛ́ é dó, ɖó indices sín kɛ́n má sɔgbe kpó nǔ lɛ́ sín kɛ́n kpó ǎ.

indices-ignored-out-of-range = È jó indices e è ɖɔ nú { $component } lɛ́ é dó, ɖó ɖě lɛ́ ɖò dodó ɔ́ gudo.

pretzel-indices-repeated = È jó indices e è ɖɔ nú pretzel lɛ́ é dó, ɖó ɖě lɛ́ vɔ́ wá.

pretzel-circuit-first-index = È jó indices e è ɖɔ nú pretzel ɖò mode="circuit" mɛ lɛ́ é dó, ɖó index nukɔntɔ́n ɔ́ ɖó ná nyí 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Bó ná dó bló nú `<{ $component }>` ná w'azɔ̌ kpó string ví lɛ́ kpó ɔ́, è ɖó ná ɖɔ attribute `type`.

invalid-type-defaulting-to-math = Type { $type } má sɔgbe ǎ nú nǔ { $component }. É ɖó ná nyí math, text, number, alǒ boolean. È ná zán math.

string-not-valid-component-to-arrange = String "{ $value }" má nyí nǔ e sɔgbe nú { $component } é ǎ. È jó dó.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } má sɔgbe ǎ, è sɔ́ type ɔ́ dó number.

invalid-variable-value = Nǔɖyɔ́ ɖé sín nǔ má sɔgbe ǎ: `{ $value }`

## Variants

variant-index-must-be-number = Alɔkpa sín index { $index } ɖó ná nyí kɛ́n

variant-index-must-be-integer = Alɔkpa sín index { $index } ɖó ná nyí kɛ́n blebu

## `<sideBySide>`

side-by-side-absolute-widths = È má bló `<{ $component }>` nú jlɛ̌ blebu lɛ́ ǎ. È sɔ́ gbagbá lɛ́ dó jlɛ̌ ɖóxá tɔ̀n.

side-by-side-absolute-margins = È má bló `<{ $component }>` nú jlɛ̌ blebu lɛ́ ǎ. È sɔ́ dodó lɛ́ dó jlɛ̌ ɖóxá tɔ̀n.

side-by-side-no-block-child = `<{ $component }>` má sɔgbe ǎ: é ɖó ná ɖó block ví ɖokpo ɖibla.

## `<label>`

label-for-ignored-on-graphical = È nɔ jó attribute `for` e ɖò `<label>` ɖiɖe tɔ̀n jí é dó.

label-for-must-resolve-to-one = Attribute `for` e ɖò `<label>` jí é ɖó ná yì nǔ ɖokpo géé jí.

label-for-unresolved = Attribute `for` e ɖò `<label>` jí é má sixú mɔ nǔ ɖé ǎ.

label-for-answer-with-authored-inputs = Attribute `for` e ɖò `<label>` jí é ɖɔ xó dó `<answer>` e ɖó input e è wlan lɛ́ é wú; ɖɔ xó dó input ɔ́ tlolo wú.

label-for-answer-without-input = Attribute `for` e ɖò `<label>` jí é ɖɔ xó dó `<answer>` e ɖó input ɖé ǎ é wú.

label-for-must-reference-input-or-answer = Attribute `for` e ɖò `<label>` jí é ɖó ná ɖɔ xó dó input alǒ answer wú.

## Accessibility

accessibility-short-description-or-decorative = Nú sisɛkpɔ́ wútu ɔ́, `<{ $component }>` ɖó ná ɖó tinmɛ kpɛví alǒ è ɖó ná ɖɔ ɖɔ é nyí decorative.

accessibility-video-short-description = Nú sisɛkpɔ́ wútu ɔ́, `<video>` ɖó ná ɖó tinmɛ kpɛví.

accessibility-input-short-description-or-label = Nú sisɛkpɔ́ wútu ɔ́, `<{ $component }>` ɖó ná ɖó tinmɛ kpɛví alǒ nyikɔ́.

accessibility-answer-input-short-description-or-label = Nú sisɛkpɔ́ wútu ɔ́, `<answer>` e nɔ bló input é ɖó ná ɖó tinmɛ kpɛví alǒ nyikɔ́.

accessibility-short-description-contains-math = Tinmɛ kpɛví lɛ́ má ɖó ná ɖó nǔnywɛ́ sín nǔ lɛ́ ɖi `<{ $component }>` ǎ. Wlan nǔnywɛ́ ɔ́ kpó xógbe kpó.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } má ɖó vogbingbɔn e kpé é ǎ nú akpáxwé ta sín xógbe (mode zizí tɔ̀n) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; é byɔ́ { $threshold }:1 ɖibla).
       *[other] { $colorName } má ɖó vogbingbɔn e kpé é ǎ nú akpáxwé ta sín xógbe ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; é byɔ́ { $threshold }:1 ɖibla).
    }

## `<circle>`

circle-through-points-non-numerical = È má ko bló `<circle>` gbɔn tɛ́n { $count } jí hwenu e tɛ́n lɛ́ má ɖó kɛ́n ǎ é ǎ.

circle-too-many-through-points = È má sixú bló lɛ̌lɛ̌ gbɔn tɛ́n 3 jɛ nukɔ́n jí ǎ.

circle-overprescribed-radius-center-points = È má sixú bló lɛ̌lɛ̌ kpó radius, tɛntin kpó tɛ́n lɛ́ kpó ǎ.

circle-center-with-multiple-points = È má sixú bló lɛ̌lɛ̌ kpó tɛntin kpó gbɔn tɛ́n 1 jɛ nukɔ́n jí ǎ.

circle-radius-too-small = È má sixú bló lɛ̌lɛ̌ ǎ: ɖó zɔ e ɖò tɛ́n wè lɛ́ tɛntin é nyí { $distance }, radius { $radius } e è ɖɔ é kpɛ́ dín.

circle-radius-with-many-points = È má sixú bló lɛ̌lɛ̌ gbɔn tɛ́n wè jɛ nukɔ́n jí kpó radius e è ɖɔ é kpó ǎ.

circle-invalid-center-or-through-points = Lɛ̌lɛ̌ sín tɛntin alǒ tɛ́n lɛ́ má sɔgbe ǎ.

circle-radius-center-with-multiple-points = È má sixú bló lɛ̌lɛ̌ sín radius kpó tɛntin kpó gbɔn tɛ́n 1 jɛ nukɔ́n jí ǎ.

circle-change-radius-non-numerical = È má sixú ɖyɔ́ lɛ̌lɛ̌ sín radius kpó tɛ́n e má ɖó kɛ́n ǎ lɛ́ kpó ǎ

circle-radius-with-points-non-numerical = È má sixú bló lɛ̌lɛ̌ gbɔn tɛ́n ɖokpo jɛ nukɔ́n jí kpó radius kpó hwenu e kɛ́n má ɖè ǎ é ǎ.

circle-change-center-non-numerical = È má ko bló lɛ̌lɛ̌ sín tɛntin ɖiɖyɔ́ gbɔn tɛ́n e má ɖó kɛ́n ǎ lɛ́ é jí ǎ.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ðaxó má kpé nú fonction sín domain ǎ. Domain ɖó hwenu { $intervals } amɔ̌ fonction ɔ́ ɖó { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
       *[other] Ðaxó má kpé nú fonction sín domain ǎ. Domain ɖó hwenu { $intervals } amɔ̌ fonction ɔ́ ɖó { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
    }

function-domain-invalid-format = Fonction sín domain sín alɔkpa má sɔgbe ǎ.

function-ignoring-non-numerical =
    { $type ->
        [maximum] È jó fonction sín ɖaxó e má ɖó kɛ́n ǎ é dó.
        [minimum] È jó fonction sín kpɛví e má ɖó kɛ́n ǎ é dó.
        [extremum] È jó fonction sín dodó e má ɖó kɛ́n ǎ é dó.
        [point] È jó fonction sín tɛ́n e má ɖó kɛ́n ǎ é dó.
        [slope] È jó fonction sín gbɔnkpo e má ɖó kɛ́n ǎ é dó.
       *[other] È jó fonction sín { $type } e má ɖó kɛ́n ǎ é dó.
    }

function-ignoring-empty =
    { $type ->
        [maximum] È jó fonction sín ɖaxó e ɖò vɔ̌ é dó.
        [minimum] È jó fonction sín kpɛví e ɖò vɔ̌ é dó.
        [extremum] È jó fonction sín dodó e ɖò vɔ̌ é dó.
        [point] È jó fonction sín tɛ́n e ɖò vɔ̌ é dó.
       *[other] È jó fonction sín { $type } e ɖò vɔ̌ é dó.
    }

function-points-too-close = Fonction ɖó tɛ́n wè e sɛkpɔ́ yeɖée dín lɛ́ é. È má sixú tinmɛ fonction ɔ́ ǎ.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] È sixú vɔ́ fonction bló kaka enyi input lɛ́ sín kɛ́n sɔgbe kpó output lɛ́ sín kɛ́n kpó géé wɛ. Fonction élɔ́ ɖó input { $inputs } kpó { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        } kpó.
       *[other] È sixú vɔ́ fonction bló kaka enyi input lɛ́ sín kɛ́n sɔgbe kpó output lɛ́ sín kɛ́n kpó géé wɛ. Fonction élɔ́ ɖó input { $inputs } kpó { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        } kpó.
    }

## `<sequence>`

sequence-invalid-length = Sequence sín gaga má sɔgbe ǎ.  É ɖó ná nyí kɛ́n blebu e má hwe ɖò 0 wú ǎ é.

sequence-invalid-step = Sequence sín step má sɔgbe ǎ.  É ɖó ná nyí kɛ́n nú sequence type { $type } tɔ̀n.

sequence-invalid-endpoint-number = Number sequence sín "{ $attribute }" má sɔgbe ǎ.  É ɖó ná nyí kɛ́n.

sequence-invalid-endpoint-letters = Letters sequence sín "{ $attribute }" má sɔgbe ǎ.  É ɖó ná nyí wékwín kplékplé.

sequence-invalid-endpoint = Sequence sín "{ $attribute }" má sɔgbe ǎ.

select-from-sequence-coprime-not-numbers = È jó coprime dó ɖó è má ɖò kɛ́n cyán wɛ ǎ

select-from-sequence-coprime-with-exclude-combinations = È jó coprime dó ɖó è ɖɔ excludeCombinations

## Resolving a `target`

target-not-found = `<{ $source }>` sín target má sɔgbe ǎ: è má mɔ target ɔ́ ǎ.

target-state-variable-not-found = `<{ $source }>` sín target má sɔgbe ǎ: è má mɔ nǔɖyɔ́ e nɔ nyí "{ $property }" é ɖò `<{ $component }>` jí ǎ.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` sín nǔɖyɔ́ lɛ́ ɖó ná gbɔn vo nú nǔɖyɔ́ mɛɖéesúsú tɔ̀n ɔ́.

ode-system-duplicate-variable-names = È má sixú tinmɛ ODE sín RHS fonction lɛ́ kpó nǔɖyɔ́ nyikɔ́ e vɔ́ wá lɛ́ é kpó ǎ.

ode-system-rhs-function-error = È má sixú tinmɛ ODE sín RHS fonction ǎ.  Nùwaɖókpɔ́ ɖò mathjs fonction bibló mɛ.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = È má sixú tinmɛ agɔ ɖé ɖò dlɛ̌n { $count } tɛntin ǎ

angle-invalid-through-point = Tɛ́n má sɔgbe ǎ ɖò `<angle>` sín through mɛ

parabola-vertex-too-many-points = È má ko bló parabole kpó vertex kpó gbɔn tɛ́n 1 jɛ nukɔ́n jí ǎ.

parabola-too-many-points = È má ko bló parabole gbɔn tɛ́n 3 jɛ nukɔ́n jí ǎ.

intersection-too-many-items = È má ko bló nǔ wè jɛ nukɔ́n sín gbɔnkpo ǎ

## Other math components

ionic-compound-not-two-ions = È má ko bló ion kplékplé nú nǔ ɖěvo e má nyí ion wè ǎ é ǎ.

ionic-compound-needs-cation-and-anion = È bló ion kplékplé nú cation ɖokpo kpó anion ɖokpo kpó géé.

solve-equations-cannot-evaluate = È má sixú ɖè équation ɔ́ gbɔn ǎ ɖó è má sixú jlɛ́ é ǎ: { $equation }

math-operators-operand-number-required = È ɖó ná ɖɔ operandNumber hwenu e è ɖò nǔnywɛ́ sín operand ɖè wɛ é.

eigen-decomposition-failed = È má sixú jlɛ́ matrice ɔ́ sín eigenvalue lɛ́ ǎ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } má ɖò kpɔ́ndéwú ɔ́ mɛ ǎ, énɛ́ wú ɔ́ é ná sɔgbe kpó vɔ̌ kpó hwebǐnu.
       *[other] `<matchesPattern>`: parameter { $parameters } má ɖò kpɔ́ndéwú ɔ́ mɛ ǎ, énɛ́ wú ɔ́ yě ná sɔgbe kpó vɔ̌ kpó hwebǐnu.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: è má sixú mɔ nukúnnú jɛ grid="{ $grid }" mɛ ǎ. É ɖó ná nyí none, medium, dense, alǒ kɛ́n wè e hú 0 bɔ tɛnmɛ ɖé klán yě lɛ́ é, ɖi grid="1 0.5". È má bló grid ǎ.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" má nɔ w'azɔ̌ ɖò prefigure ɖiɖexlɛ́tɔ́ mɛ ǎ; è zán ɖisí sín tɛnmɛ.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" má nɔ w'azɔ̌ ɖò prefigure ɖiɖexlɛ́tɔ́ mɛ ǎ; è zán aji sín tɛnmɛ.

prefigure-invalid-axis-bounds = `<graph>`: axis sín dodó má sɔgbe ǎ nú prefigure; è zán bbox e ɖ'ayǐ é (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: gbagbá má sɔgbe ǎ nú prefigure; è zán gbagbá e ɖ'ayǐ é 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio má sɔgbe ǎ nú prefigure; è zán aspect ratio e ɖ'ayǐ é 1.

prefigure-grid-spacing-too-fine = `<graph>`: grid sín tɛnmɛ kpɛ́ dín nú axis sín dodó lɛ́; è ɖè grid ɔ́ sín prefigure ɖiɖexlɛ́tɔ́ mɛ.

prefigure-annotations-not-rendered = `<graph>`: è má ná ɖè annotations lɛ́ xlɛ́ ǎ enyi è ma ɖò PreFigure ɖiɖexlɛ́tɔ́ zán wɛ ǎ.

multiple-annotations-children = È mɔ `<annotations>` ví gègě ɖò `<graph>` mɛ; è jó yě bǐ dó bó hɛn nukɔntɔ́n gudo tɔ́n ɔ́ géé.

## Referring to other components

copy-unrecognized-component-type = È má sixú gbló alǒ kpɔ́n nǔ sín alɔkpa e è má tuùn ǎ é ǎ: { $type }.

copy-prop-not-found = È má mɔ prop { $property } ɖò nǔ alɔkpa { $component } tɔ̀n jí ǎ

collect-no-source = È má mɔ dodó ɖé nú collect ǎ.

collect-invalid-component-type = È má sixú kplé nǔ alɔkpa `<{ $component }>` tɔ̀n lɛ́ ǎ ɖó alɔkpa ɔ́ má sɔgbe ǎ.

reference-index-unavailable = È má sixú ɖɔ xó dó index `{ $reference }` wú ǎ

## `<callAction>`

component-action-unavailable = È má sixú ylɔ́ { $action } ɖò nǔ `{ $reference }` jí ǎ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Nǔmɔnú lɛ́ sín alɔkpa má sɔgbe ǎ.  Línu lɛ́ sín gaga má sɔgbe ǎ. È mɔ ɖò componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Nǔmɔnú lɛ́ ɖó kɔ́ nyikɔ́ e vɔ́ wá lɛ́ é.  È mɔ ɖò componentIdx :{ $componentIdx }

data-frame-missing-column-name = Nǔmɔnú lɛ́ ɖó kɔ́ nyikɔ́ ɖé ǎ.  È mɔ ɖò componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Xósin élɔ́ sín award junjɔn xósin e answer tag ɔ́ ɖésú sɛ́dó é jí, énɛ́ ná dɔn nǔ e è má ɖó nukún ǎ é wá.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` sisɔ́ dó `<answer>` e ɖò nǔ ɖé kpó `sectionWideCheckWork` kpó mɛ é jí má nɔ w'azɔ̌ ǎ, ɖó nǔ ɔ́ wɛ nɔ kpé nukún dó tɛnkpɔ́n lɛ́ sín kɛ́n wú. Sɔ́ `maxNumAttempts` dó nǔ ɔ́ jí.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` sisɔ́ dó nǔ ɖé kpó `sectionWideCheckWork` kpó e ɖò nǔ ɖěvo kpó `sectionWideCheckWork` kpó mɛ é jí má nɔ w'azɔ̌ ǎ, ɖó nǔ e ɖò gudo é wɛ nɔ kpé nukún dó tɛnkpɔ́n lɛ́ sín kɛ́n wú. Sɔ́ `maxNumAttempts` dó nǔ e ɖò gudo é jí.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attribute { $attributes } má ná w'azɔ̌ ǎ enyi è ma sɔ́ symbolicEquality ǎ.
       *[other] Attribute { $attributes } má ná w'azɔ̌ ǎ enyi è ma sɔ́ symbolicEquality ǎ.
    }

answer-invalid-type = Xósin sín type má sɔgbe ǎ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ðó nǔ `<{ $component }>` ɖó nyikɔ́ ǎ wútu ɔ́, è má sixú zán ɛ ɖi module sín attribute ǎ

module-attribute-name-already-defined = È má sixú zán nǔ `<{ $component } name="{ $name }">` ɖi module sín attribute ǎ ɖó `<module>` alɔkpa ko ɖó attribute "{ $name }".

conditional-content-condition-ignored = È nɔ jó attribute `condition` dó ɖò `<conditionalContent>` e ɖó case alǒ else ví lɛ́ é jí.

slider-markers-type-mismatch = Markers sín type má sɔgbe kpó slider sín type kpó ǎ.

pretzel-problem-needs-statement-and-answer = Pretzel má sɔgbe ǎ: `<problem>` ɖokpo ɖokpo ɖó ná ɖó `<statement>` ɖokpo kpó `<answer>` ɖokpo kpó.

pretzel-circuit-first-problem-distractor = Pretzel má sɔgbe ǎ: ɖò mode="circuit" mɛ ɔ́, `<problem>` nukɔntɔ́n ɔ́ má sixú nyí distractor ǎ.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Nǔ { $values } má sɔgbe ǎ nú attribute `{ $attribute }`; è jó dó.
       *[other] Nǔ { $values } má sɔgbe ǎ nú attribute `{ $attribute }`; è jó dó.
    }

attribute-must-be-references = Nǔ `{ $value }` má sɔgbe ǎ nú attribute `{ $attribute }`. Attribute ɖó ná nyí zɔnlin e nɔ bɛ́ kpó `$` kpó lɛ́ é.

math-input-invalid-function-names = <mathInput>: è jó fonction nyikɔ́ e má sɔgbe ǎ lɛ́ é dó ɖò { $attribute } mɛ: { $names }. Nyikɔ́ ɖokpo ɖokpo ɖó ná ɖó wékwín 2 ɖibla (wékwín alǒ dodólin); `|<mathspeak alternative>` sixú bɔ dó.

## Building components from the source

component-type-invalid = Nǔ sín alɔkpa má sɔgbe ǎ: `<{ $componentType }>`

attribute-repeated = È má sixú vɔ́ attribute { $attribute } ɖɔ ǎ.

attribute-invalid-for-component = Attribute "{ $attribute }" má sɔgbe ǎ nú nǔ alɔkpa `<{ $componentType }>` tɔ̀n.

## Style definition contrast

style-definition-insufficient-contrast =
    Alɔkpa tinmɛ { $styleNumber } má ɖó vogbingbɔn e kpé é ǎ nú { $context ->
        [text-on-background] xógbe sín sinmɛ ɖò gudo sín sinmɛ jí
        [high-contrast] vogbingbɔn ɖaxó sín sinmɛ ɖò kanvasi jí
        [line] dlɛ̌n sín sinmɛ ɖò kanvasi jí
        [marker] wlɛ́n sín sinmɛ ɖò kanvasi jí
       *[text-on-canvas] xógbe sín sinmɛ ɖò kanvasi jí
    }{ $mode ->
        [dark] { " (mode zizí tɔ̀n)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; é byɔ́ { $threshold }:1 ɖibla).

style-definition-dark-mode-text-background-contrast =
    Alɔkpa tinmɛ { $styleNumber } ɖó sinmɛ e ná vogbingbɔn e kpé é nú mode wěwé tɔ̀n nugbó, amɔ̌ mode zizí tɔ̀n sín sinmɛ e è ɖè sín yě mɛ lɛ́ é má ɖó vogbingbɔn e kpé é ǎ ɖò xógbe sín sinmɛ kpó gudo sín sinmɛ kpó tɛntin ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; é byɔ́ { $threshold }:1 ɖibla). { $suggestion ->
        [available] Bó ná dó mɔ vogbingbɔn e kpé é ɖò mode zizí tɔ̀n mɛ ɔ́, jǐ mode wěwé tɔ̀n sín vogbingbɔn (ɖi, sɔ́ { $lightAttribute }="{ $lightColor }") alǒ ɖyɔ́ mode zizí tɔ̀n sín sinmɛ (ɖi, sɔ́ { $darkAttribute }="{ $darkColor }").
       *[none] Bó ná dó mɔ vogbingbɔn e kpé é ɖò mode zizí tɔ̀n mɛ ɔ́, jǐ mode wěwé tɔ̀n sín vogbingbɔn alǒ ɖyɔ́ sinmɛ lɛ́ kpó textColorDarkMode alǒ backgroundColorDarkMode kpó.
    }

style-definition-dark-mode-text-canvas-contrast =
    Alɔkpa tinmɛ { $styleNumber } ɖó xógbe sín sinmɛ e ná vogbingbɔn e kpé é nú mode wěwé tɔ̀n nugbó, amɔ̌ mode zizí tɔ̀n sín xógbe sinmɛ e è ɖè sín mɛ é má ɖó vogbingbɔn e kpé é ǎ ɖò kanvasi jí ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; é byɔ́ { $threshold }:1 ɖibla). { $suggestion ->
        [available] Bó ná dó mɔ vogbingbɔn e kpé é ɖò mode zizí tɔ̀n mɛ ɔ́, jǐ mode wěwé tɔ̀n sín vogbingbɔn (ɖi, sɔ́ textColor="{ $lightColor }") alǒ ɖyɔ́ mode zizí tɔ̀n sín sinmɛ (ɖi, sɔ́ textColorDarkMode="{ $darkColor }").
       *[none] Bó ná dó mɔ vogbingbɔn e kpé é ɖò mode zizí tɔ̀n mɛ ɔ́, jǐ mode wěwé tɔ̀n sín vogbingbɔn alǒ ɖyɔ́ sinmɛ ɔ́ kpó textColorDarkMode kpó.
    }

section-multiple-style-palettes = Akpáxwé ɖé sixú cyán <stylePalette> ɖokpo géé; è zán gudo tɔ́n ɔ́.

## Unique variants

variant-num-to-select-not-non-negative-integer = è má sixú tuùn { $component } sín alɔkpa vovo lɛ́ ǎ ɖó numToSelect má nyí kɛ́n blebu e má hwe ɖò 0 wú ǎ é ǎ.

variant-num-to-select-not-constant-number = è má sixú tuùn { $component } sín alɔkpa vovo lɛ́ ǎ ɖó numToSelect má nyí kɛ́n e má nɔ ɖyɔ́ ǎ é ǎ.

variant-with-replacement-not-constant-boolean = è má sixú tuùn { $component } sín alɔkpa vovo lɛ́ ǎ ɖó withReplacement má nyí boolean e má nɔ ɖyɔ́ ǎ é ǎ.

variant-select-weight-disables-unique = È nɔ sú select sín alɔkpa vovo lɛ́ enyi option ɖé ɖó selectWeight alǒ selectForVariants

variant-coprime-undetermined = è má sixú tuùn { $component } sín alɔkpa vovo lɛ́ ǎ ɖó è má sixú tuùn ɖɔ coprime nyí adingban hwebǐnu ǎ.

variant-attribute-not-constant = è má sixú tuùn { $component } sín alɔkpa vovo lɛ́ ǎ ɖó { $attribute } nɔ ɖyɔ́.

variant-attribute-not-number = è má sixú tuùn { $component } sín alɔkpa vovo lɛ́ ǎ ɖó { $attribute } má nyí kɛ́n ǎ.

variant-attribute-wrong-type-for-sequence =
    è má sixú tuùn { $component } type { $type } tɔ̀n sín alɔkpa vovo lɛ́ ǎ ɖó { $attribute } má nyí { $expected ->
        [letters-combination] wékwín kplékplé
        [math-expression] nǔnywɛ́xó e sɔgbe é
        [integer] kɛ́n blebu
       *[number] kɛ́n
    } ǎ.

variant-length-not-integer = è má sixú tuùn { $component } sín alɔkpa vovo lɛ́ ǎ ɖó length má nyí kɛ́n blebu ǎ.

variant-sort-not-implemented = è má ko bló { $component } kpó sort kpó sín alɔkpa vovo lɛ́ ǎ

variant-exclude-combinations-not-implemented = è má ko bló { $component } kpó excludeCombinations kpó sín alɔkpa vovo lɛ́ ǎ

variant-math-exclude-not-implemented = è má ko bló { $component } type math tɔ̀n kpó exclude kpó sín alɔkpa vovo lɛ́ ǎ

variant-non-constant-exclude-not-implemented = è má ko bló { $component } kpó exclude e nɔ ɖyɔ́ é kpó sín alɔkpa vovo lɛ́ ǎ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: é má nɔ w'azɔ̌ ɖò graph sín prefigure ɖiɖexlɛ́tɔ́ mɛ ǎ; è jó ví ɔ́ dó.

prefigure-descendant-invalid-geometry = { $subject }: alɔkpa má sɔgbe alǒ é ma kpé ǎ; è jó ví ɔ́ dó.

prefigure-curve-label-omitted = { $subject }: nyikɔ́ lɛ́ má nɔ w'azɔ̌ ɖò curve nǔ e è ɖyɔ́ lɛ́ é jí ǎ; è ɖè nyikɔ́ ɔ́ sín mɛ.

prefigure-curve-unsupported-definition-type = { $subject }: curve sín tinmɛ alɔkpa '{ $definitionType }' má nɔ w'azɔ̌ ǎ; è jó ví ɔ́ dó.

prefigure-region-flip-functions-unsupported = { $subject }: attribute flipFunctions ɖò regionBetweenCurves jí má nɔ w'azɔ̌ ǎ; è jó ví ɔ́ dó.

prefigure-region-non-formula-child = { $subject }: fonction ví e ɖó formula lɛ́ é géé wɛ nɔ w'azɔ̌ ɖò regionBetweenCurves jí; è jó ví ɔ́ dó.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' má nɔ w'azɔ̌ ǎ nú { $labelKind ->
        [line-family] dlɛ̌n hɛnnu sín nyikɔ́
       *[point] tɛ́n sín nyikɔ́
    }; è zán PreFigure sín tɛnmɛ e ɖ'ayǐ é.

prefigure-fill-style-unsupported = { $subject }: gɔ́gɔ́ sín alɔkpa '{ $fillStyle }' má nɔ w'azɔ̌ ɖò PreFigure mɛ ǎ; è zán gɔ́gɔ́ blebu.

prefigure-line-style-unknown = { $subject }: dlɛ̌n sín alɔkpa '{ $lineStyle }' e è má tuùn ǎ é, è ɖè sín PreFigure mɛ.

prefigure-marker-style-mapped-to-diamond = { $subject }: wlɛ́n sín alɔkpa '{ $markerStyle }' hɛn è ɖyɔ́ dó PreFigure sín 'diamond'.

prefigure-marker-style-unsupported = { $subject }: wlɛ́n sín alɔkpa '{ $markerStyle }' má nɔ w'azɔ̌ ɖò PreFigure mɛ ǎ; è zán alɔkpa e ɖ'ayǐ é.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` má sɔgbe ǎ; è má sixú mɔ target ɔ́ ǎ. È ɖè annotation ɔ́ sín mɛ.

annotation-ref-multiple-targets = `<annotation>`: `ref` mɔ target gègě; è zán nukɔntɔ́n ɔ́.

annotation-ref-outside-graph = `<annotation>`: `ref` má sɔgbe ǎ; target ɔ́ ɖò graph ɔ́ gudo. È ɖè annotation ɔ́ sín mɛ.

annotation-ref-unsupported-target = `<annotation>`: `ref` má sɔgbe ǎ; target ɔ́ má nyí ɖiɖe sín nǔ e nɔ w'azɔ̌ ɖò prefigure mɛ é ǎ. È ɖè annotation ɔ́ sín mɛ.

annotation-text-missing = `<annotation>`: `text` má ɖè alǒ é ɖò vɔ̌; è wlan xógbe vɔ̌.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] È mɔ lɛ̌lɛ̌ sín kanbyɔ́.
       *[other] È mɔ lɛ̌lɛ̌ sín kanbyɔ́ kpó nǔ `<{ $componentType }>` kpó.
    }

reference-no-referent = È má mɔ nǔ ɖé nú zɔnlin ǎ: `{ $reference }`

reference-multiple-referents = È mɔ nǔ gègě nú zɔnlin: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` sín attribute { $attribute } sín alɔkpa má sɔgbe ǎ.

children-invalid = `<{ $componentType }>` sín ví lɛ́ má sɔgbe ǎ: È mɔ ví e má sɔgbe ǎ lɛ́ é: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nǔ `{ $value }` má sɔgbe ǎ nú attribute `{ $attribute }`, è zán `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] È má mɔ DoenetML alɔkpa { $version } ǎ.
       *[other] È má mɔ DoenetML alɔkpa { $version } ǎ. È ná zán alɔkpa { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML má sɔgbe ǎ: { $content }

parse-tag-missing-close-tag = DoenetML má sɔgbe ǎ: Tag `{ $tag }` ɖó tag sisú ǎ. È ɖó nukún tag e nɔ sú éɖée é alǒ tag `</{ $tagName }>`.

parse-tag-error = DoenetML má sɔgbe ǎ: Nùwaɖókpɔ́ ɖò tag `<{ $tagName }>` mɛ

parse-attribute-missing-value = DoenetML má sɔgbe ǎ: Attribute `{ $attribute }` má sɔgbe ǎ, é cí ɖɔ é ɖó nǔ ɖé ǎ ɖɔhun.

parse-attribute-invalid = DoenetML má sɔgbe ǎ: Attribute `{ $attribute }` má sɔgbe ǎ

parse-attribute-value-invalid = DoenetML má sɔgbe ǎ: Attribute sín nǔ `{ $value }` má sɔgbe ǎ

parse-attribute-value-quote-mismatch = DoenetML má sɔgbe ǎ: Attribute sín nǔ `{ $value }` má sɔgbe ǎ. Xóɖiɖɔ sín wlɛ́n lɛ́ má sɔgbe ǎ. É cí ɖɔ `{ $quote }` ɖé hwedó ɖɔhun

parse-open-tag-name-missing = DoenetML má sɔgbe ǎ: È mɔ tag e ɖó nyikɔ́ ǎ é, ɖi `<`

parse-tag-not-closed = DoenetML má sɔgbe ǎ: È má sú tag `{ $tag }` ǎ (é cí ɖɔ `>` hwedó ɖɔhun).

parse-self-closing-tag-name-missing = DoenetML má sɔgbe ǎ: È mɔ tag e ɖó nyikɔ́ ǎ é `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML má sɔgbe ǎ: È má sú tag `{ $tag }` ǎ (é cí ɖɔ `/>` hwedó ɖɔhun).

parse-tag-invalid-attributes = DoenetML má sɔgbe ǎ: Tag `{ $tag }` má sɔgbe ǎ. É sixú ɖó attribute e má sɔgbe ǎ lɛ́ é.

parse-close-tag-name-missing = DoenetML má sɔgbe ǎ: È mɔ tag sisú e ɖó nyikɔ́ ǎ é, ɖi `</`

parse-attribute-value-unquoted = Attribute sín nǔ lɛ́ ɖó ná ɖò xóɖiɖɔ sín wlɛ́n mɛ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML má sɔgbe ǎ: È mɔ tag sisú `{ $tag }`, amɔ̌ tag hùnhún ɖé má ɖè ǎ

parse-close-tag-mismatched = DoenetML má sɔgbe ǎ: Tag sisú má sɔgbe ǎ. È ɖó nukún `</{ $expected }>`. È mɔ `{ $found }`

parser-node-unconvertible = È má sixú ɖyɔ́ node { $node } dó Dast sín node ǎ.

## Names

name-attribute-invalid =
    Nyikɔ́ name='{ $name }' má sɔgbe ǎ. { $reason ->
        [characters] Nyikɔ́ lɛ́ sixú ɖó wékwín, kɛ́n, dodólin dò tɔ̀n alǒ dodólin géé.
       *[start] Nyikɔ́ lɛ́ ɖó ná bɛ́ kpó wékwín kpó.
    }

component-name-invalid-start = Nǔ sín nyikɔ́ "{ $name }" má sɔgbe ǎ. Nyikɔ́ lɛ́ ɖó ná bɛ́ kpó wékwín kpó.

## `<answer>` sugar

answer-video-watched-missing-video = Answer type videoWatched tɔ̀n ɖó ná ɖó attribute video

answer-video-watched-video-not-reference = Answer type videoWatched tɔ̀n ɖó ná ɖó attribute video e nyí zɔnlin é

answer-name-not-single-text = Answer sín attribute name ɖó ná ɖó text ví ɖokpo géé

## Referencing another document

external-doenetml-recursion-limit = È má sixú mɔ DoenetML tɔ́n tɔ̀n ǎ ɖó vivɔ́ dín. Zɔnlin lɛ̌lɛ̌ tɔ̀n ɖé ɖè à?

external-doenetml-unavailable = È má sixú mɔ DoenetML sín { $attribute }="{ $uri }" ǎ

external-doenetml-type-mismatch = DoenetML e è mɔ sín { $attribute }="{ $uri }" é má sɔgbe ǎ: é má sɔgbe kpó nǔ alɔkpa "{ $componentType }" kpó ǎ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] È jó attribute `{ $from }` dó; zán `{ $to }`.
       *[other] [deprecation] È jó attribute `{ $from }` e ɖò `<{ $component }>` jí é dó; zán `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] È jó attribute `{ $from }` dó bo jó é dó ɖó è ɖɔ `{ $to }` lɔ.
       *[other] [deprecation] È jó attribute `{ $from }` e ɖò `<{ $component }>` jí é dó bo jó é dó ɖó è ɖɔ `{ $to }` lɔ.
    }

deprecated-attribute-ignored = [deprecation] È jó attribute `{ $attribute }` e ɖò `<{ $component }>` jí é dó bo jó é dó.

deprecated-attribute-to-child = [deprecation] È jó attribute `{ $attribute }` e ɖò `<{ $component }>` jí é dó; zán `<{ $child }>` ví ɖé.

deprecated-attribute-value-renamed = [deprecation] È jó nǔ `{ $value }` attribute `{ $attribute }` tɔ̀n e ɖò `<{ $component }>` jí é dó; zán `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` sixú bló Glɛnsigbe géé sín gègě, énɛ́ wú ɔ́ é jó xógbe tɔ́n dó ɖò wema e è wlan ɖò { $locale } mɛ é mɛ. Wlan gègě sín xógbe ɔ́ tlolo, alǒ sɔ́ ɛ kpó attribute `pluralForm` kpó.


## Checking against the schema

schema-element-unrecognized = Nǔ `<{ $tag }>` má nyí Doenet sín nǔ e è tuùn é ǎ.

schema-element-not-allowed-at-root = È má yí gbè nú nǔ `<{ $tag }>` ɖò wema ɔ́ tá ǎ.

schema-element-not-allowed-inside = È má yí gbè nú nǔ `<{ $tag }>` ɖò `<{ $parent }>` mɛ ǎ.

schema-attribute-unrecognized = Nǔ `<{ $tag }>` má ɖó attribute e nɔ nyí `{ $attribute }` é ǎ.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Nǔ `<{ $tag }>` sín attribute `{ $attribute }` ɖó ná nyí kplékplé ɖé bɔ nǔ tɔ́n ɖokpo ɖokpo ɖó ná nyí ɖokpo ɖò yě mɛ: { $allowed }
       *[other] Nǔ `<{ $tag }>` sín attribute `{ $attribute }` ɖó ná nyí ɖokpo ɖò yě mɛ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select sín alɔkpa nyikɔ́ má sɔgbe ǎ.  Alɔkpa nyikɔ́ { $variantName } tɔ́n ɖò option { $numOptions } mɛ amɔ̌ kɛ́n e è ná cyán é nyí { $numToSelect }.

select-variant-name-without-options = È ɖɔ alɔkpa ɖé lɛ́ nú select amɔ̌ è má ɖɔ option ɖé nú alɔkpa nyikɔ́ e sixú ɖè é ǎ: { $variantName }.

select-variant-name-not-possible = Alɔkpa nyikɔ́ { $variantName } e è ɖɔ nú select é má nyí alɔkpa nyikɔ́ e sixú ɖè é ǎ.

select-too-few-options = È má sixú cyán nǔ { $numToSelect } ɖò { $numOptions } géé mɛ ǎ.

select-from-sequence-too-few-values = È má sixú cyán nǔ { $numToSelect } ɖò sequence e sín gaga nyí { $length } é mɛ ǎ.

select-from-sequence-indices-count-mismatch = Indices e è ɖɔ nú select lɛ́ é sín kɛ́n ɖó ná sɔgbe kpó kɛ́n e è ná cyán é kpó

select-from-sequence-indices-not-integers = Indices e è ɖɔ nú select lɛ́ é bǐ ɖó ná nyí kɛ́n blebu

select-from-sequence-index-excluded = È ɖɔ selectfromsequence sín index e è ɖè sín mɛ é

select-from-sequence-indices-excluded-combination = È ɖɔ selectfromsequence sín indices e nyí kplékplé e è ɖè sín mɛ é

select-from-sequence-coprime-not-positive-integers = È má sixú cyán coprime kplékplé lɛ́ ǎ ɖó è má ɖò kɛ́n blebu e hú 0 lɛ́ é cyán wɛ ǎ.

select-from-sequence-coprime-common-factor = È má sixú cyán coprime kɛ́n lɛ́ ǎ. Kɛ́n e sixú ɖè lɛ́ é bǐ ɖó facteur ɖokpo. ("from" alǒ "to" sín nǔ e è ɖɔ é ɖó ná nyí coprime kpó "step" kpó.)

select-from-sequence-coprime-single-number = È má sixú cyán coprime kplékplé sín kɛ́n ɖokpo géé e má nyí 1 ǎ é mɛ ǎ.

select-from-sequence-excluded-too-many-combinations = È ɖè kplékplé lɛ́ 70% jɛ nukɔ́n sín selectFromSequence mɛ

select-from-sequence-coprime-none-found = È má sixú cyán coprime kɛ́n lɛ́ ǎ. Kɛ́n e sixú ɖè lɛ́ é bǐ ɖó facteur ɖokpo.

select-from-sequence-too-few-unique-values = È má sixú cyán nǔ vovo { $numToSelect } ɖò sequence e sín gaga nyí { $numPossibleValues } é mɛ ǎ

select-prime-numbers-too-few-values = È má sixú cyán nǔ { $numToSelect } ɖò prime kɛ́n kplékplé e sín gaga nyí { $numValues } é mɛ ǎ

select-prime-numbers-values-count-mismatch = Nǔ e è ɖɔ nú select lɛ́ é sín kɛ́n ɖó ná sɔgbe kpó kɛ́n e è ná cyán é kpó

select-prime-numbers-values-not-prime = Nǔ e è ɖɔ nú select prime number lɛ́ é bǐ ɖó ná ɖò prime kɛ́n kplékplé ɔ́ mɛ

select-prime-numbers-values-excluded-combination = È ɖɔ selectPrimeNumbers sín nǔ e nyí kplékplé e è ɖè sín mɛ é

select-prime-numbers-excluded-too-many-combinations = È ɖè kplékplé lɛ́ 70% jɛ nukɔ́n sín selectPrimeNumbers mɛ

select-random-combination-fluke = Gbɔn nǔ e má nɔ jɛ ǎ é gblamɛ, è má sixú cyán kɛ́n mɛɖéesúsú tɔ̀n lɛ́ sín kplékplé ǎ

select-random-value-fluke = Gbɔn nǔ e má nɔ jɛ ǎ é gblamɛ, è má sixú cyán kɛ́n mɛɖéesúsú tɔ̀n ɖé ǎ
