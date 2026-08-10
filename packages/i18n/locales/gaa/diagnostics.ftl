# Ga diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] Akwɛɛɛ { $attributes } kɛji ato naagbee pɔintsii enyɔ
       *[other] Akwɛɛɛ { $attributes } kɛji ato naagbee pɔintsii enyɔ
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] Akwɛɛɛ { $attributes } kɛji ato naagbee pɔint kɛ teŋgbɛ pɔint fɛɛ
       *[other] Akwɛɛɛ { $attributes } kɛji ato naagbee pɔint kɛ teŋgbɛ pɔint fɛɛ
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset tsuuu nii kɛji teŋgbɛ pɔint bɛ

## `<line>`

line-points-undetermined-dimensions = Laiŋi lɛ tsɔɔ pɔintsii ni aleee amɛ agbo lɛ anɔ.

line-points-too-few-dimensions = Esa akɛ laiŋi lɛ tsɔ pɔintsii ni amɛ agbo lɛ ji enyɔ loo nɔ ni fe nakai anɔ.

line-points-depend-on-variables = Laiŋi lɛ tsɔ pɔintsii ni damɔ nibii ni tsakeɔ anɔ: { $variables }.

line-equation-invalid-format = Laiŋi ikweshɔn su lɛ ejaaa yɛ nibii ni tsakeɔ { $variable1 } kɛ { $variable2 } amli.

## `<ray>`

ray-overprescribed-through = Akɛ through, endpoint kɛ direction eto rei lɛ.  Wɔkwɛɛɛ through ni ato lɛ.

ray-dimension-mismatch = numDimensions kɛ rei lɛ kpãaa gbee.

## `<vector>`

vector-overprescribed-head = Akɛ head, tail kɛ displacement eto vɛktɔ lɛ.  Wɔkwɛɛɛ head ni ato lɛ.

vector-dimension-mismatch = numDimensions kɛ vɛktɔ lɛ kpãaa gbee.

## Attracting and constraining

attract-to-without-nearest-point = Wɔnyɛŋ wɔgbala kɛya `<{ $component }>` he, ejaakɛ ebɛ nearestPoint okadi.

constrain-to-without-nearest-point = Wɔnyɛŋ wɔtsi `<{ $component }>` he, ejaakɛ ebɛ nearestPoint okadi.

constrain-to-interior-without-nearest-point = Wɔnyɛŋ wɔtsi `<{ $component }>` mli, ejaakɛ ebɛ nearestPoint okadi.

## `<choiceInput>`

choice-input-label-position-ignored = Akwɛɛɛ labelPosition yɛ choiceInput ni bɛ laiŋi mli nɔ

## Ordering children by index

choice-input-indices-count-mismatch = Wɔkwɛɛɛ indices ni ato yɛ choiceInput nɔ ejaakɛ indices ayibɔ kɛ choice bii ayibɔ kpãaa gbee.

pretzel-indices-count-mismatch = Wɔkwɛɛɛ indices ni ato yɛ problem nɔ ejaakɛ indices ayibɔ kɛ problem bii ayibɔ kpãaa gbee.

shuffle-indices-count-mismatch = Wɔkwɛɛɛ indices ni ato yɛ shuffle nɔ ejaakɛ indices ayibɔ kɛ fãi ayibɔ kpãaa gbee.

indices-ignored-out-of-range = Wɔkwɛɛɛ indices ni ato yɛ { $component } nɔ ejaakɛ ekomɛi eje husu lɛ mli.

pretzel-indices-repeated = Wɔkwɛɛɛ indices ni ato yɛ pretzel nɔ ejaakɛ aŋɔ ekomɛi tsɔ shii enyɔ.

pretzel-circuit-first-index = Wɔkwɛɛɛ indices ni ato yɛ pretzel nɔ yɛ mode="circuit" mli ejaakɛ esa akɛ klɛŋklɛŋ nɔ lɛ ji 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Koni `<{ $component }>` kɛ wiemɔ bii atsu nii lɛ, esa akɛ ato `type` okadi lɛ.

invalid-type-defaulting-to-math = Sui { $type } ejaaa yɛ { $component } nɔ. Esa akɛ eji math, text, number loo boolean. Wɔkuɔ wɔsɛɛ kɛyaa math nɔ.

string-not-valid-component-to-arrange = Wiemɔ "{ $value }" jeee fã kpakpa yɛ { $component } nɔ. Wɔkwɛɛɛ lɛ.

## Types and variables

invalid-type-defaulting-to-number = Sui { $type } ejaaa, wɔmaa sui lɛ yɛ number nɔ.

invalid-variable-value = Nɔ ni tsakeɔ lɛ yibɔ ejaaa: `{ $value }`

## Variants

variant-index-must-be-number = Esa akɛ sui okadi { $index } ji yibɔ

variant-index-must-be-integer = Esa akɛ sui okadi { $index } ji yibɔ ni ye emuu

## `<sideBySide>`

side-by-side-absolute-widths = Afeko `<{ $component }>` kɛ susumɔi ni tsakeee. Wɔmaa lɛɛlɛŋ lɛ yɛ susumɔ nɔ.

side-by-side-absolute-margins = Afeko `<{ $component }>` kɛ susumɔi ni tsakeee. Wɔmaa naagbeei lɛ yɛ susumɔ nɔ.

side-by-side-no-block-child = `<{ $component }>` ejaaa: esa akɛ ená fã bi kome loo nɔ ni fe nakai.

## `<label>`

label-for-ignored-on-graphical = Akwɛɛɛ `for` okadi yɛ mfoniri `<label>` nɔ.

label-for-must-resolve-to-one = Esa akɛ `for` okadi yɛ `<label>` nɔ tsɔɔ fã kome pɛ.

label-for-unresolved = `for` okadi yɛ `<label>` nɔ nyɛko etsɔɔ fã ko.

label-for-answer-with-authored-inputs = `for` okadi yɛ `<label>` nɔ tsɔɔ `<answer>` ni yɔɔ wobɔɔi ni ŋmalɔ lɛ diɛŋtsɛ ŋma; tsɔɔmɔ wobɔɔ lɛ diɛŋtsɛ.

label-for-answer-without-input = `for` okadi yɛ `<label>` nɔ tsɔɔ `<answer>` ni bɛ wobɔɔ ni akɛbaawo gbɛi.

label-for-must-reference-input-or-answer = Esa akɛ `for` okadi yɛ `<label>` nɔ tsɔɔ wobɔɔ loo hetoo.

## Accessibility

accessibility-short-description-or-decorative = Yɛ shɛmɔ hewɔ lɛ, esa akɛ `<{ $component }>` ná shishitsɔɔmɔ kuku loo ato lɛ akɛ nɔ ni ŋɔɔ hiɛ.

accessibility-video-short-description = Yɛ shɛmɔ hewɔ lɛ, esa akɛ `<video>` ná shishitsɔɔmɔ kuku.

accessibility-input-short-description-or-label = Yɛ shɛmɔ hewɔ lɛ, esa akɛ `<{ $component }>` ná shishitsɔɔmɔ kuku loo gbɛi.

accessibility-answer-input-short-description-or-label = Yɛ shɛmɔ hewɔ lɛ, esa akɛ `<answer>` ni feɔ wobɔɔ lɛ ná shishitsɔɔmɔ kuku loo gbɛi.

accessibility-short-description-contains-math = Esaaa akɛ shishitsɔɔmɔ kukui ná yibɔi afãi tamɔ `<{ $component }>`. Ŋmaa yibɔi fɛɛ kɛ wiemɔi.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } bɛ srɔtolomɔ ni sa fã yitso wiemɔi ahe (yɛ duŋ mli) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ebiɔ { $threshold }:1 loo nɔ ni fe nakai).
       *[other] { $colorName } bɛ srɔtolomɔ ni sa fã yitso wiemɔi ahe ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ebiɔ { $threshold }:1 loo nɔ ni fe nakai).
    }

## `<circle>`

circle-through-points-non-numerical = Wɔfeko `<circle>` ni tsɔɔ pɔintsii { $count } anɔ dani kɛji pɔintsii lɛ bɛ yibɔi.

circle-too-many-through-points = Wɔnyɛŋ wɔbu kokloo ni tsɔɔ pɔintsii ni fe 3 anɔ.

circle-overprescribed-radius-center-points = Wɔnyɛŋ wɔbu kokloo ni yɔɔ rediɔs, teŋgbɛ he kɛ pɔintsii fɛɛ.

circle-center-with-multiple-points = Wɔnyɛŋ wɔbu kokloo ni yɔɔ teŋgbɛ he ni tsɔɔ pɔint ni fe 1 nɔ.

circle-radius-too-small = Wɔnyɛŋ wɔbu kokloo lɛ: pɔintsii enyɔ lɛ ateŋ ji { $distance }, ni rediɔs { $radius } ni ato lɛ bibioo tsɔ.

circle-radius-with-many-points = Wɔnyɛŋ wɔfee kokloo ni tsɔɔ pɔintsii ni fe enyɔ anɔ kɛ rediɔs ni ato lɛ.

circle-invalid-center-or-through-points = Kokloo lɛ teŋgbɛ he loo epɔintsii ejaaa.

circle-radius-center-with-multiple-points = Wɔnyɛŋ wɔbu kokloo ni yɔɔ teŋgbɛ he lɛ rediɔs ni etsɔɔ pɔint ni fe 1 nɔ.

circle-change-radius-non-numerical = Wɔnyɛŋ wɔtsake kokloo ni epɔintsii bɛ yibɔi lɛ rediɔs

circle-radius-with-points-non-numerical = Wɔnyɛŋ wɔfee kokloo ni tsɔɔ pɔint ni fe kome nɔ kɛ rediɔs ni ato lɛ kɛji yibɔi bɛ.

circle-change-center-non-numerical = Wɔfeko kokloo ni tsɔɔ pɔintsii ni bɛ yibɔi anɔ lɛ teŋgbɛ he tsakemɔ dani.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Agbo lɛ shɛɛɛ fɔŋkshɔn lɛ he lɛ he. He lɛ yɔɔ fã { $intervals } shi fɔŋkshɔn lɛ yɔɔ { $inputs ->
            [one] wobɔɔ { $inputs }
           *[other] wobɔɔi { $inputs }
        }.
       *[other] Agbo lɛ shɛɛɛ fɔŋkshɔn lɛ he lɛ he. He lɛ yɔɔ fãi { $intervals } shi fɔŋkshɔn lɛ yɔɔ { $inputs ->
            [one] wobɔɔ { $inputs }
           *[other] wobɔɔi { $inputs }
        }.
    }

function-domain-invalid-format = Fɔŋkshɔn he lɛ su ejaaa.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Wɔkwɛɛɛ fɔŋkshɔn lɛ nɔ ni kwɔ fe fɛɛ ni bɛ yibɔ.
        [minimum] Wɔkwɛɛɛ fɔŋkshɔn lɛ nɔ ni shi fe fɛɛ ni bɛ yibɔ.
        [extremum] Wɔkwɛɛɛ fɔŋkshɔn lɛ naagbee ni bɛ yibɔ.
        [point] Wɔkwɛɛɛ fɔŋkshɔn lɛ pɔint ni bɛ yibɔ.
        [slope] Wɔkwɛɛɛ fɔŋkshɔn lɛ kpemɔ ni bɛ yibɔ.
       *[other] Wɔkwɛɛɛ fɔŋkshɔn lɛ { $type } ni bɛ yibɔ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Wɔkwɛɛɛ fɔŋkshɔn lɛ nɔ ni kwɔ fe fɛɛ ni yɔɔ kwaa.
        [minimum] Wɔkwɛɛɛ fɔŋkshɔn lɛ nɔ ni shi fe fɛɛ ni yɔɔ kwaa.
        [extremum] Wɔkwɛɛɛ fɔŋkshɔn lɛ naagbee ni yɔɔ kwaa.
        [point] Wɔkwɛɛɛ fɔŋkshɔn lɛ pɔint ni yɔɔ kwaa.
       *[other] Wɔkwɛɛɛ fɔŋkshɔn lɛ { $type } ni yɔɔ kwaa.
    }

function-points-too-close = Fɔŋkshɔn lɛ yɔɔ pɔintsii enyɔ ni bɛŋkɛ amɛhe tsɔ. Wɔnyɛŋ wɔto fɔŋkshɔn.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Fɔŋkshɔn kumɔ sɛɛ baanyɛ afee kɛji wobɔɔi ayibɔ kɛ jiemɔi ayibɔ kpã gbee. Fɔŋkshɔn nɛɛ yɔɔ wobɔɔ { $inputs } kɛ { $outputs ->
            [one] jiemɔ { $outputs }
           *[other] jiemɔi { $outputs }
        }.
       *[other] Fɔŋkshɔn kumɔ sɛɛ baanyɛ afee kɛji wobɔɔi ayibɔ kɛ jiemɔi ayibɔ kpã gbee. Fɔŋkshɔn nɛɛ yɔɔ wobɔɔi { $inputs } kɛ { $outputs ->
            [one] jiemɔ { $outputs }
           *[other] jiemɔi { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Gbɛjianɔtoo lɛ kɛkɛnkɛ ejaaa.  Esa akɛ eji yibɔ ni ye emuu ni bɛ zɛro shishi.

sequence-invalid-step = Gbɛjianɔtoo lɛ nane ejaaa.  Esa akɛ eji yibɔ yɛ gbɛjianɔtoo ni esui ji { $type } nɔ.

sequence-invalid-endpoint-number = Yibɔ gbɛjianɔtoo "{ $attribute }" ejaaa.  Esa akɛ eji yibɔ.

sequence-invalid-endpoint-letters = Niŋmaa gbɛjianɔtoo "{ $attribute }" ejaaa.  Esa akɛ eji niŋmaai afatamɔ.

sequence-invalid-endpoint = Gbɛjianɔtoo "{ $attribute }" ejaaa.

select-from-sequence-coprime-not-numbers = Akwɛɛɛ coprime ejaakɛ ahalaaa yibɔi

select-from-sequence-coprime-with-exclude-combinations = Akwɛɛɛ coprime ejaakɛ ato excludeCombinations

## Resolving a `target`

target-not-found = target ejaaa yɛ `<{ $source }>` nɔ: wɔnaaa target.

target-state-variable-not-found = target ejaaa yɛ `<{ $source }>` nɔ: wɔnaaa okadi ni egbɛi ji "{ $property }" yɛ `<{ $component }>` nɔ.

## `<odeSystem>`

ode-system-variables-match-independent = Esa akɛ `<odeSystem>` nibii ni tsakeɔ lɛ srɔto kɛjɛ nɔ ni tsakeɔ ni damɔɔ ehe nɔ he.

ode-system-duplicate-variable-names = Wɔnyɛŋ wɔto ODE RHS fɔŋkshɔnii ni amɛ nibii ni tsakeɔ agbɛii tsɔ shii enyɔ.

ode-system-rhs-function-error = Wɔnyɛŋ wɔto ODE RHS fɔŋkshɔn.  Tɔmɔ yɛ mathjs fɔŋkshɔn feemɔ mli.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Wɔnyɛŋ wɔto kojiaŋ yɛ laiŋi { $count } ateŋ

angle-invalid-through-point = Pɔint ni ejaaa yɛ `<angle>` through mli

parabola-vertex-too-many-points = Wɔfeko parabola ni yɔɔ kojiaŋ ni etsɔɔ pɔint ni fe 1 nɔ dani.

parabola-too-many-points = Wɔfeko parabola ni tsɔɔ pɔintsii ni fe 3 anɔ dani.

intersection-too-many-items = Wɔfeko kpemɔ kɛha nibii ni fe enyɔ dani

## Other math components

ionic-compound-not-two-ions = Wɔfeko ayɔn fatamɔ kɛha nɔ ko ni jeee ayɔn enyɔ dani.

ionic-compound-needs-cation-and-anion = Afee ayɔn fatamɔ kɛha katiɔn kome kɛ aniɔn kome pɛ.

solve-equations-cannot-evaluate = Wɔnyɛŋ wɔtsu ikweshɔn lɛ he nii ejaakɛ wɔnyɛŋ wɔbu lɛ: { $equation }

math-operators-operand-number-required = Esa akɛ oto operandNumber kɛji ojieɔ yibɔ operand.

eigen-decomposition-failed = Wɔnyɛko wɔbu matriks eigenvalues

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametɛ { $parameters } bɛ pattern mli, no hewɔ lɛ ebaakpã gbee kɛ kwaa be fɛɛ be.
       *[other] `<matchesPattern>`: parametɛi { $parameters } bɛ pattern mli, no hewɔ lɛ amɛbaakpã gbee kɛ kwaa be fɛɛ be.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: wɔnyɛŋ wɔnu grid="{ $grid }" shishi. Esa akɛ eji none, medium, dense, loo yibɔi kpakpai enyɔ ni akɛ he egbala amɛteŋ, tamɔ grid="1 0.5". Afeee gridi ko.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: aŋmɛɛɛ xLabelPosition="left" gbɛ yɛ prefigure tsɔɔlɔ mli; wɔtsuɔ nii tamɔ ninejurɔ gbɛ nɔ.

prefigure-y-label-position-unsupported = `<graph>`: aŋmɛɛɛ yLabelPosition="bottom" gbɛ yɛ prefigure tsɔɔlɔ mli; wɔtsuɔ nii tamɔ yiteŋ gbɛ nɔ.

prefigure-invalid-axis-bounds = `<graph>`: aksis naagbeei ejaaa kɛha prefigure tsakemɔ; wɔkɛ bbox ni yɔɔ jeŋmaa tsuɔ nii (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lɛɛlɛŋ ejaaa kɛha prefigure tsakemɔ; wɔkɛ mfoniri lɛɛlɛŋ ni yɔɔ jeŋmaa tsuɔ nii 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ejaaa kɛha prefigure tsakemɔ; wɔkɛ susumɔ ni yɔɔ jeŋmaa tsuɔ nii 1.

prefigure-grid-spacing-too-fine = `<graph>`: gridi lɛ teŋ he bibioo tsɔ kɛha aksis naagbeei; afeee gridi lɛ yɛ prefigure tsɔɔlɔ mli.

prefigure-annotations-not-rendered = `<graph>`: afeee shishitsɔɔmɔi kɛji PreFigure tsɔɔlɔ lɛ tsuuu nii.

multiple-annotations-children = Ana `<annotations>` bii babaoo yɛ `<graph>` mli; akwɛɛɛ fɛɛ ja naagbee lɛ.

## Referring to other components

copy-unrecognized-component-type = Wɔnyɛŋ wɔlɛɛ loo wɔkopi fã sui ni aleee: { $type }.

copy-prop-not-found = Wɔnaaa prop { $property } yɛ fã ni esui ji { $component } nɔ

collect-no-source = Anaaa collect shishijee.

collect-invalid-component-type = Wɔnyɛŋ wɔbua fãi ni amɛ sui ji `<{ $component }>` naa ejaakɛ eji sui ni ejaaa.

reference-index-unavailable = Wɔnyɛŋ wɔtsɔɔ okadi `{ $reference }`

## `<callAction>`

component-action-unavailable = Wɔnyɛŋ wɔtsɛ { $action } yɛ fã `{ $reference }` nɔ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Saji lɛ asu ejaaa.  Laiŋi lɛ akɛkɛnkɛi kpãaa gbee. Ana yɛ componentIdx :{ $componentIdx } mli

data-frame-duplicate-column-names = Saji lɛ yɔɔ kɔlom gbɛii ni tsɔ shii enyɔ.  Ana yɛ componentIdx :{ $componentIdx } mli

data-frame-missing-column-name = Kɔlom gbɛi bɛ saji lɛ ahe.  Ana yɛ componentIdx :{ $componentIdx } mli

## `<answer>` and scoring

answer-award-depends-on-own-response = Hetoo nɛɛ pɔintsii damɔ hetoo ni tagi lɛ diɛŋtsɛ maje lɛ nɔ, ni no baaha nɔ ko ni asusuuu he aba.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` ni ato `<answer>` ni yɔɔ fã ni yɔɔ `sectionWideCheckWork` mli nɔ lɛ feee nɔ ko, ejaakɛ fã lɛ nɔŋŋ kwɛɔ kasemɔi ayibɔ nɔ. To `maxNumAttempts` yɛ fã lɛ nɔ.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` ni ato fã ni yɔɔ `sectionWideCheckWork` ni yɔɔ fã kroko ni yɔɔ `sectionWideCheckWork` mli nɔ lɛ feee nɔ ko, ejaakɛ agbo fã lɛ nɔŋŋ kwɛɔ kasemɔi ayibɔ nɔ. To `maxNumAttempts` yɛ agbo fã lɛ nɔ.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Okadi { $attributes } feŋ nɔ ko kɛji atooo symbolicEquality.
       *[other] Okadii { $attributes } feŋ nɔ ko kɛji atooo symbolicEquality.
    }

answer-invalid-type = Hetoo sui ni ejaaa: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ejaakɛ fã `<{ $component }>` bɛ gbɛi lɛ, enyɛŋ akɛtsu nii akɛ module okadi

module-attribute-name-already-defined = Fã `<{ $component } name="{ $name }">` nyɛŋ akɛtsu nii akɛ module okadi ejaakɛ `<module>` sui lɛ yɔɔ okadi "{ $name }" momo.

conditional-content-condition-ignored = Akwɛɛɛ `condition` okadi yɛ `<conditionalContent>` ni yɔɔ case loo else bii nɔ.

slider-markers-type-mismatch = Okadii asui kɛ slider sui kpãaa gbee.

pretzel-problem-needs-statement-and-answer = pretzel ejaaa: esa akɛ `<problem>` fɛɛ ná `<statement>` kome kɛ `<answer>` kome.

pretzel-circuit-first-problem-distractor = pretzel ejaaa: yɛ mode="circuit" mli lɛ, klɛŋklɛŋ `<problem>` lɛ nyɛŋ afee distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Yibɔ ni ejaaa { $values } yɛ okadi `{ $attribute }` nɔ; wɔkwɛɛɛ lɛ.
       *[other] Yibɔi ni ejaaa { $values } yɛ okadi `{ $attribute }` nɔ; wɔkwɛɛɛ amɛ.
    }

attribute-must-be-references = Yibɔ `{ $value }` ejaaa yɛ okadi `{ $attribute }` nɔ. Esa akɛ akɛ tsɔɔmɔi ni jeɔ shishi kɛ `$` fee okadi lɛ.

math-input-invalid-function-names = <mathInput>: wɔkwɛɛɛ fɔŋkshɔn gbɛii ni ejaaa yɛ { $attribute } mli: { $names }. Esa akɛ gbɛi fɛɛ gbɛi tsɔɔmɔ fã ná niŋmaai 2 loo nɔ ni fe nakai (niŋmaai loo tirei); obaanyɛ ofata `|<mathspeak alternative>` he.

## Building components from the source

component-type-invalid = Fã sui ni ejaaa: `<{ $componentType }>`

attribute-repeated = Wɔnyɛŋ wɔtsɔ okadi { $attribute } shii enyɔ.

attribute-invalid-for-component = Okadi "{ $attribute }" ejaaa yɛ fã ni esui ji `<{ $componentType }>` nɔ.

## Style definition contrast

style-definition-insufficient-contrast =
    Sui { $styleNumber } shishitsɔɔmɔ lɛ bɛ srɔtolomɔ ni sa { $context ->
        [text-on-background] wiemɔ su yɛ sɛɛgbɛ su nɔ
        [high-contrast] srɔtolomɔ agbo su yɛ kpaŋmɔ nɔ
        [line] laiŋi su yɛ kpaŋmɔ nɔ
        [marker] okadi su yɛ kpaŋmɔ nɔ
       *[text-on-canvas] wiemɔ su yɛ kpaŋmɔ nɔ
    } he{ $mode ->
        [dark] { " (yɛ duŋ mli)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ebiɔ { $threshold }:1 loo nɔ ni fe nakai).

style-definition-dark-mode-text-background-contrast =
    Eyɛ mli akɛ sui { $styleNumber } shishitsɔɔmɔ lɛ yɔɔ sui ni haa srɔtolomɔ ni sa yɛ la mli moŋ, shi duŋ sui ni jɛ amɛmli lɛ bɛ srɔtolomɔ ni sa yɛ wiemɔ su kɛ sɛɛgbɛ su ateŋ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ebiɔ { $threshold }:1 loo nɔ ni fe nakai). { $suggestion ->
        [available] Koni srɔtolomɔ lɛ asa yɛ duŋ mli lɛ, wo la mli srɔtolomɔ lɛ he (nɔkwɛmɔnɔ, to { $lightAttribute }="{ $lightColor }") loo tsake duŋ su lɛ (nɔkwɛmɔnɔ, to { $darkAttribute }="{ $darkColor }").
       *[none] Koni srɔtolomɔ lɛ asa yɛ duŋ mli lɛ, wo la mli srɔtolomɔ lɛ he loo tsake sui ni jɛ mli lɛ kɛ textColorDarkMode loo backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Eyɛ mli akɛ sui { $styleNumber } shishitsɔɔmɔ lɛ yɔɔ wiemɔ su ni haa srɔtolomɔ ni sa yɛ la mli moŋ, shi duŋ wiemɔ su ni jɛ emli lɛ bɛ srɔtolomɔ ni sa yɛ kpaŋmɔ lɛ nɔ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ebiɔ { $threshold }:1 loo nɔ ni fe nakai). { $suggestion ->
        [available] Koni srɔtolomɔ lɛ asa yɛ duŋ mli lɛ, wo la mli srɔtolomɔ lɛ he (nɔkwɛmɔnɔ, to textColor="{ $lightColor }") loo tsake duŋ su lɛ (nɔkwɛmɔnɔ, to textColorDarkMode="{ $darkColor }").
       *[none] Koni srɔtolomɔ lɛ asa yɛ duŋ mli lɛ, wo la mli srɔtolomɔ lɛ he loo tsake su ni jɛ mli lɛ kɛ textColorDarkMode.
    }

section-multiple-style-palettes = Fã baanyɛ ehala <stylePalette> kome pɛ; wɔkɛ naagbee nɔ lɛ tsuɔ nii.

## Unique variants

variant-num-to-select-not-non-negative-integer = wɔnyɛŋ wɔle { $component } sui srɔtoi ejaakɛ numToSelect jeee yibɔ ni ye emuu ni bɛ zɛro shishi.

variant-num-to-select-not-constant-number = wɔnyɛŋ wɔle { $component } sui srɔtoi ejaakɛ numToSelect jeee yibɔ ni tsakeee.

variant-with-replacement-not-constant-boolean = wɔnyɛŋ wɔle { $component } sui srɔtoi ejaakɛ withReplacement jeee boolean ni tsakeee.

variant-select-weight-disables-unique = Atsiɔ select sui srɔtoi anaa kɛji halamɔ yɔɔ selectWeight loo selectForVariants

variant-coprime-undetermined = wɔnyɛŋ wɔle { $component } sui srɔtoi ejaakɛ wɔnyɛŋ wɔle akɛ coprime ji false be fɛɛ be.

variant-attribute-not-constant = wɔnyɛŋ wɔle { $component } sui srɔtoi ejaakɛ { $attribute } tsakeɔ.

variant-attribute-not-number = wɔnyɛŋ wɔle { $component } sui srɔtoi ejaakɛ { $attribute } jeee yibɔ.

variant-attribute-wrong-type-for-sequence =
    wɔnyɛŋ wɔle { $component } ni esui ji { $type } lɛ sui srɔtoi ejaakɛ { $attribute } jeee { $expected ->
        [letters-combination] niŋmaai afatamɔ
        [math-expression] yibɔ wiemɔ ni aŋmɛ gbɛ
        [integer] yibɔ ni ye emuu
       *[number] yibɔ
    }.

variant-length-not-integer = wɔnyɛŋ wɔle { $component } sui srɔtoi ejaakɛ length jeee yibɔ ni ye emuu.

variant-sort-not-implemented = wɔfeko { $component } ni yɔɔ sort lɛ sui srɔtoi dani

variant-exclude-combinations-not-implemented = wɔfeko { $component } ni yɔɔ excludeCombinations lɛ sui srɔtoi dani

variant-math-exclude-not-implemented = wɔfeko { $component } ni esui ji math ni yɔɔ exclude lɛ sui srɔtoi dani

variant-non-constant-exclude-not-implemented = wɔfeko { $component } ni yɔɔ exclude ni tsakeɔ lɛ sui srɔtoi dani

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: aŋmɛɛɛ gbɛ yɛ graph prefigure tsɔɔlɔ mli; akwɛɛɛ shwiemɔnɔ lɛ.

prefigure-descendant-invalid-geometry = { $subject }: he su lɛ bɛ naagbee loo eyeee emuu; akwɛɛɛ shwiemɔnɔ lɛ.

prefigure-curve-label-omitted = { $subject }: aŋmɛɛɛ gbɛii gbɛ yɛ kpemɔ laiŋi ni atsake anɔ; ajie gbɛi lɛ.

prefigure-curve-unsupported-definition-type = { $subject }: kpemɔ laiŋi shishitsɔɔmɔ sui '{ $definitionType }' aŋmɛɛɛ gbɛ; akwɛɛɛ shwiemɔnɔ lɛ.

prefigure-region-flip-functions-unsupported = { $subject }: aŋmɛɛɛ flipFunctions okadi gbɛ yɛ regionBetweenCurves nɔ; akwɛɛɛ shwiemɔnɔ lɛ.

prefigure-region-non-formula-child = { $subject }: bii afɔŋkshɔnii ni amɛ sui ji formula pɛ aŋmɛ amɛ gbɛ yɛ regionBetweenCurves nɔ; akwɛɛɛ shwiemɔnɔ lɛ.

prefigure-label-position-unsupported =
    { $subject }: aŋmɛɛɛ labelPosition '{ $labelPosition }' gbɛ yɛ { $labelKind ->
        [line-family] laiŋi weku gbɛi
       *[point] pɔint gbɛi
    } he; wɔkɛ PreFigure kpãmɔ ni yɔɔ jeŋmaa tsuɔ nii.

prefigure-fill-style-unsupported = { $subject }: obɔyeli sui '{ $fillStyle }' aŋmɛɛɛ gbɛ yɛ PreFigure mli; wɔkuɔ wɔsɛɛ kɛyaa obɔyeli ni mli wa nɔ.

prefigure-line-style-unknown = { $subject }: laiŋi sui ni aleee '{ $lineStyle }' ajie yɛ PreFigure jiemɔ mli.

prefigure-marker-style-mapped-to-diamond = { $subject }: atsake okadi sui '{ $markerStyle }' kɛfee PreFigure sui 'diamond'.

prefigure-marker-style-unsupported = { $subject }: okadi sui '{ $markerStyle }' aŋmɛɛɛ gbɛ yɛ PreFigure mli; wɔkɛ sui ni yɔɔ jeŋmaa tsuɔ nii.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ejaaa; wɔnaaa nɔ ni etsɔɔ. Ajie shishitsɔɔmɔ lɛ.

annotation-ref-multiple-targets = `<annotation>`: `ref` tsɔɔ nibii babaoo; wɔkɛ klɛŋklɛŋ nɔ lɛ tsuɔ nii.

annotation-ref-outside-graph = `<annotation>`: `ref` ejaaa; nɔ ni etsɔɔ lɛ yɔɔ graph lɛ sɛɛ. Ajie shishitsɔɔmɔ lɛ.

annotation-ref-unsupported-target = `<annotation>`: `ref` ejaaa; nɔ ni etsɔɔ lɛ jeee mfoniri nɔ ni aŋmɛ gbɛ yɛ prefigure tsakemɔ mli. Ajie shishitsɔɔmɔ lɛ.

annotation-text-missing = `<annotation>`: `text` bɛ loo eyɔɔ kwaa; wɔjieɔ wiemɔ kwaa kɛjeɔ kpo.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Wɔna damɔmɔ ni kpeleɔ.
       *[other] Wɔna damɔmɔ ni kpeleɔ ni yɔɔ fã `<{ $componentType }>` mli.
    }

reference-no-referent = Anaaa nɔ ko kɛha tsɔɔmɔ: `{ $reference }`

reference-multiple-referents = Ana nibii babaoo kɛha tsɔɔmɔ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` okadi { $attribute } su ejaaa.

children-invalid = `<{ $componentType }>` bii ejaaa: Wɔna bii ni ejaaa: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Yibɔ `{ $value }` ejaaa yɛ okadi `{ $attribute }` nɔ, wɔkɛ yibɔ `{ $default }` tsuɔ nii

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Anaaa DoenetML sui { $version }.
       *[other] Anaaa DoenetML sui { $version }. Wɔkuɔ wɔsɛɛ kɛyaa sui { $fallback } nɔ
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ni ejaaa: { $content }

parse-tag-missing-close-tag = DoenetML ni ejaaa: Tagi `{ $tag }` bɛ ŋamɔ tagi. Wɔmɛɔ tagi ni ŋaa ehe loo tagi `</{ $tagName }>`.

parse-tag-error = DoenetML ni ejaaa: Tɔmɔ yɛ tagi `<{ $tagName }>` mli

parse-attribute-missing-value = DoenetML ni ejaaa: Okadi `{ $attribute }` ni ejaaa lɛ tamɔ nɔ ni bɛ yibɔ.

parse-attribute-invalid = DoenetML ni ejaaa: Okadi `{ $attribute }` ejaaa

parse-attribute-value-invalid = DoenetML ni ejaaa: Okadi yibɔ `{ $value }` ejaaa

parse-attribute-value-quote-mismatch = DoenetML ni ejaaa: Okadi yibɔ `{ $value }` ejaaa. Wiemɔ okadii lɛ kpãaa gbee. Etamɔ nɔ ni `{ $quote }` bɛ ohe

parse-open-tag-name-missing = DoenetML ni ejaaa: Wɔna tagi ni bɛ gbɛi, tamɔ `<`

parse-tag-not-closed = DoenetML ni ejaaa: Aŋako tagi `{ $tag }` (etamɔ nɔ ni `>` bɛ).

parse-self-closing-tag-name-missing = DoenetML ni ejaaa: Wɔna tagi ni bɛ gbɛi `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ni ejaaa: Aŋako tagi `{ $tag }` (etamɔ nɔ ni `/>` bɛ).

parse-tag-invalid-attributes = DoenetML ni ejaaa: Tagi `{ $tag }` ejaaa. Ekolɛ eyɔɔ okadii ni ejaaa.

parse-close-tag-name-missing = DoenetML ni ejaaa: Wɔna ŋamɔ tagi ni bɛ gbɛi, tamɔ `</`

parse-attribute-value-unquoted = Esa akɛ akɛ wiemɔ okadii awo okadii ayibɔi ateŋ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ni ejaaa: Wɔna ŋamɔ tagi `{ $tag }`, shi gbelemɔ tagi ni kpã gbee bɛ

parse-close-tag-mismatched = DoenetML ni ejaaa: Ŋamɔ tagi lɛ kpãaa gbee. Wɔmɛɔ `</{ $expected }>`. Wɔna `{ $found }`

parser-node-unconvertible = Wɔnyɛko wɔtsake node { $node } kɛfee Dast node.

## Names

name-attribute-invalid =
    Gbɛi name='{ $name }' ejaaa. { $reason ->
        [characters] Gbɛii baanyɛ aná niŋmaai, yibɔi, shishi tirei loo tirei pɛ.
       *[start] Esa akɛ gbɛii je shishi kɛ niŋmaa.
    }

component-name-invalid-start = Fã gbɛi "{ $name }" ejaaa. Esa akɛ gbɛii je shishi kɛ niŋmaa.

## `<answer>` sugar

answer-video-watched-missing-video = Esa akɛ hetoo ni esui ji videoWatched lɛ ná video okadi

answer-video-watched-video-not-reference = Esa akɛ hetoo ni esui ji videoWatched lɛ ná video okadi ni ji tsɔɔmɔ

answer-name-not-single-text = Esa akɛ hetoo name okadi lɛ ná wiemɔ bi kome

## Referencing another document

external-doenetml-recursion-limit = Wɔnyɛko wɔná agbo DoenetML ejaakɛ kumɔ sɛɛ lɛ fa tsɔ. Ani tsɔɔmɔ ko kpeleɔ?

external-doenetml-unavailable = Wɔnyɛko wɔná DoenetML yɛ { $attribute }="{ $uri }" he

external-doenetml-type-mismatch = DoenetML ni aná yɛ { $attribute }="{ $uri }" he lɛ ejaaa: ekɛ fã sui "{ $componentType }" kpãaa gbee

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Akɛ okadi `{ $from }` tsuuu nii dɔŋŋ; kɛ `{ $to }` tsu nii.
       *[other] [deprecation] Akɛ okadi `{ $from }` yɛ `<{ $component }>` nɔ tsuuu nii dɔŋŋ; kɛ `{ $to }` tsu nii.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Akɛ okadi `{ $from }` tsuuu nii dɔŋŋ ni akwɛɛɛ lɛ ejaakɛ ato `{ $to }` hu.
       *[other] [deprecation] Akɛ okadi `{ $from }` yɛ `<{ $component }>` nɔ tsuuu nii dɔŋŋ ni akwɛɛɛ lɛ ejaakɛ ato `{ $to }` hu.
    }

deprecated-attribute-ignored = [deprecation] Akɛ okadi `{ $attribute }` yɛ `<{ $component }>` nɔ tsuuu nii dɔŋŋ ni akwɛɛɛ lɛ.

deprecated-attribute-to-child = [deprecation] Akɛ okadi `{ $attribute }` yɛ `<{ $component }>` nɔ tsuuu nii dɔŋŋ; kɛ bi `<{ $child }>` tsu nii.

deprecated-attribute-value-renamed = [deprecation] Akɛ okadi `{ $attribute }` yibɔ `{ $value }` yɛ `<{ $component }>` nɔ tsuuu nii dɔŋŋ; kɛ `{ $to }` tsu nii.


## Language coverage

pluralize-english-only = `<pluralize>` baanyɛ efee babaoo yɛ Blɔfo mli pɛ, no hewɔ lɛ ewiemɔi lɛ tsɔɔ shi tamɔ bɔ ni ŋmalɔ lɛ ŋma amɛ yɛ wolo ni aŋma yɛ { $locale } mli. Ŋmaa babaoo lɛ bo diɛŋtsɛ, loo kɛ `pluralForm` okadi to lɛ.


## Checking against the schema

schema-element-unrecognized = Fã `<{ $tag }>` jeee Doenet fã ni ale.

schema-element-not-allowed-at-root = Aŋmɛɛɛ fã `<{ $tag }>` gbɛ yɛ wolo lɛ shishijee he.

schema-element-not-allowed-inside = Aŋmɛɛɛ fã `<{ $tag }>` gbɛ yɛ `<{ $parent }>` mli.

schema-attribute-unrecognized = Fã `<{ $tag }>` bɛ okadi ni egbɛi ji `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Esa akɛ fã `<{ $tag }>` okadi `{ $attribute }` ji gbɛjianɔtoo ni enɔ fɛɛ enɔ ji kome yɛ nɛɛ amli: { $allowed }
       *[other] Esa akɛ fã `<{ $tag }>` okadi `{ $attribute }` ji kome yɛ nɛɛ amli: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select sui gbɛi ejaaa.  Sui gbɛi { $variantName } yɔɔ halamɔi { $numOptions } amli shi halamɔ yibɔ ji { $numToSelect }.

select-variant-name-without-options = Ato sui komɛi yɛ select nɔ shi ato halamɔ ko yɛ sui gbɛi ni baanyɛ aba lɛ nɔ: { $variantName }.

select-variant-name-not-possible = Sui gbɛi { $variantName } ni ato yɛ select nɔ lɛ jeee sui gbɛi ni baanyɛ aba.

select-too-few-options = Wɔnyɛŋ wɔhala fãi { $numToSelect } yɛ fãi { $numOptions } pɛ amli.

select-from-sequence-too-few-values = Wɔnyɛŋ wɔhala yibɔi { $numToSelect } yɛ gbɛjianɔtoo ni ekɛkɛnkɛ ji { $length } mli.

select-from-sequence-indices-count-mismatch = Esa akɛ indices ni ato yɛ select nɔ ayibɔ kɛ halamɔ yibɔ kpã gbee

select-from-sequence-indices-not-integers = Esa akɛ indices fɛɛ ni ato yɛ select nɔ aji yibɔi ni yeɔ emuu

select-from-sequence-index-excluded = Ajie okadi ni ato yɛ selectfromsequence nɔ lɛ

select-from-sequence-indices-excluded-combination = Indices ni ato yɛ selectfromsequence nɔ lɛ ji fatamɔ ni ajie

select-from-sequence-coprime-not-positive-integers = Wɔnyɛŋ wɔhala coprime fatamɔi ejaakɛ ahalaaa yibɔi kpakpai ni yeɔ emuu.

select-from-sequence-coprime-common-factor = Wɔnyɛŋ wɔhala coprime yibɔi. Yibɔi fɛɛ ni baanyɛ aba lɛ yɔɔ faktɔ kome. (Esa akɛ "from" loo "to" yibɔi ni ato lɛ ji coprime kɛ "step".)

select-from-sequence-coprime-single-number = Wɔnyɛŋ wɔhala coprime fatamɔi yɛ yibɔ kome ni jeee 1 mli.

select-from-sequence-excluded-too-many-combinations = Ajie fatamɔi ni fe 70% yɛ selectFromSequence mli

select-from-sequence-coprime-none-found = Wɔnyɛko wɔhala coprime yibɔi. Yibɔi fɛɛ ni baanyɛ aba lɛ yɔɔ faktɔ kome.

select-from-sequence-too-few-unique-values = Wɔnyɛŋ wɔhala yibɔi srɔtoi { $numToSelect } yɛ gbɛjianɔtoo ni ekɛkɛnkɛ ji { $numPossibleValues } mli

select-prime-numbers-too-few-values = Wɔnyɛŋ wɔhala yibɔi { $numToSelect } yɛ prime yibɔi agbɛjianɔtoo ni ekɛkɛnkɛ ji { $numValues } mli

select-prime-numbers-values-count-mismatch = Esa akɛ yibɔi ni ato yɛ select nɔ ayibɔ kɛ halamɔ yibɔ kpã gbee

select-prime-numbers-values-not-prime = Esa akɛ yibɔi fɛɛ ni ato yɛ select prime number nɔ ayɔɔ prime yibɔi agbɛjianɔtoo lɛ mli

select-prime-numbers-values-excluded-combination = Yibɔi ni ato yɛ selectPrimeNumbers nɔ lɛ ji fatamɔ ni ajie

select-prime-numbers-excluded-too-many-combinations = Ajie fatamɔi ni fe 70% yɛ selectPrimeNumbers mli

select-random-combination-fluke = Yɛ nɔ ni nyɛŋ afee kɔkɔɔkɔ hewɔ lɛ, wɔnyɛko wɔhala yibɔi kwaa afatamɔ

select-random-value-fluke = Yɛ nɔ ni nyɛŋ afee kɔkɔɔkɔ hewɔ lɛ, wɔnyɛko wɔhala yibɔ kwaa
