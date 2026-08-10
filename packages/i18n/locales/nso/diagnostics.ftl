# Northern Sotho diagnostics: errors and warnings surfaced to the reader or
# author. Selected by `uiLocale`.
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
        [one] { $attributes } e hlokomologilwe ge dintlha tše pedi tša mafelelo di laeditšwe
       *[other] { $attributes } di hlokomologilwe ge dintlha tše pedi tša mafelelo di laeditšwe
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } e hlokomologilwe ge ntlha ya mafelelo le ntlha ya gare ka bobedi di laeditšwe
       *[other] { $attributes } di hlokomologilwe ge ntlha ya mafelelo le ntlha ya gare ka bobedi di laeditšwe
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ga e na khuetšo ntle le ntlha ya gare

## `<line>`

line-points-undetermined-dimensions = Mothaladi wo o fetago dintlheng tša bogolo bjo bo sa tsebjego.

line-points-too-few-dimensions = Mothaladi o swanetše go feta dintlheng tša bonyane bogolo bjo bobedi.

line-points-depend-on-variables = Mothaladi o feta dintlheng tšeo di ithekgilego ka diphapano: { $variables }.

line-equation-invalid-format = Sebopego se se fošagetšego sa tekanyo ya mothaladi diphapanong { $variable1 } le { $variable2 }.

## `<ray>`

ray-overprescribed-through = Lehlasedi le laeditšwe ka through, endpoint le direction.  Go hlokomologa through yeo e laeditšwego.

ray-dimension-mismatch = numDimensions ga e sepelelane lehlaseding.

## `<vector>`

vector-overprescribed-head = Bektara e laeditšwe ka head, tail le displacement.  Go hlokomologa head yeo e laeditšwego.

vector-dimension-mismatch = numDimensions ga e sepelelane bektareng.

## Attracting and constraining

attract-to-without-nearest-point = Ga go kgonege go goga go `<{ $component }>` ka ge e se na phapano ya boemo ya nearestPoint.

constrain-to-without-nearest-point = Ga go kgonege go thibela go `<{ $component }>` ka ge e se na phapano ya boemo ya nearestPoint.

constrain-to-interior-without-nearest-point = Ga go kgonege go thibela ka gare ga `<{ $component }>` ka ge e se na phapano ya boemo ya nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition e hlokomologilwe go choiceInput yeo e sego ya inline

## Ordering children by index

choice-input-indices-count-mismatch = Go hlokomologa dinomoro tšeo di laeditšwego go choiceInput ka ge palo ya dinomoro e sa sepelelane le palo ya bana ba dikgetho.

pretzel-indices-count-mismatch = Go hlokomologa dinomoro tšeo di laeditšwego go problem ka ge palo ya dinomoro e sa sepelelane le palo ya bana ba problem.

shuffle-indices-count-mismatch = Go hlokomologa dinomoro tšeo di laeditšwego go shuffle ka ge palo ya dinomoro e sa sepelelane le palo ya dikarolo.

indices-ignored-out-of-range = Go hlokomologa dinomoro tšeo di laeditšwego go { $component } ka ge tše dingwe di le ka ntle ga tekanyo.

pretzel-indices-repeated = Go hlokomologa dinomoro tšeo di laeditšwego go pretzel ka ge tše dingwe di boeleditšwe.

pretzel-circuit-first-index = Go hlokomologa dinomoro tšeo di laeditšwego go pretzel mokgweng wa circuit ka ge nomoro ya mathomo e swanetše go ba 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Gore `<{ $component }>` e šome le bana ba mantšu, seka sa `type` se swanetše go laetšwa.

invalid-type-defaulting-to-math = Mohuta { $type } o fošagetše go karolo ya { $component }. O swanetše go ba o mongwe wa math, text, number goba boolean. Go bewa math ka tlwaelo.

string-not-valid-component-to-arrange = Lentšu "{ $value }" ga se karolo ye e amogelegago go { $component }. Go a hlokomologa.

## Types and variables

invalid-type-defaulting-to-number = Mohuta { $type } o fošagetše, mohuta o bewa go number.

invalid-variable-value = Boleng bjo bo fošagetšego bja phapano: `{ $value }`

## Variants

variant-index-must-be-number = Nomoro ya mohuta { $index } e swanetše go ba palo

variant-index-must-be-integer = Nomoro ya mohuta { $index } e swanetše go ba palo ye e tletšego

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ga se ya dirwa bakeng sa ditekanyo tše di tiilego. Bophara bo bewa go tša tekanyetšo.

side-by-side-absolute-margins = `<{ $component }>` ga se ya dirwa bakeng sa ditekanyo tše di tiilego. Mathoko a bewa go a tekanyetšo.

side-by-side-no-block-child = `<{ $component }>` ye e fošagetšego: e swanetše go ba le bonyane ngwana o tee wa sehlopha.

## `<label>`

label-for-ignored-on-graphical = Seka sa `for` go `<label>` ya seswantšho se a hlokomologwa.

label-for-must-resolve-to-one = Seka sa `for` go `<label>` se swanetše go šupa go karolo e tee feela.

label-for-unresolved = Seka sa `for` go `<label>` ga se a kgona go šupa go karolo.

label-for-answer-with-authored-inputs = Seka sa `for` go `<label>` se šupa go `<answer>` yeo e nago le ditsenyo tšeo mongwadi a di ngwadilego; šupa go tsenyo ka go lebanya.

label-for-answer-without-input = Seka sa `for` go `<label>` se šupa go `<answer>` yeo e se nago tsenyo yeo e ka lebelwago.

label-for-must-reference-input-or-answer = Seka sa `for` go `<label>` se swanetše go šupa go tsenyo goba go karabo.

## Accessibility

accessibility-short-description-or-decorative = Bakeng sa phihlelelo, `<{ $component }>` e swanetše go ba le tlhalošo ye kopana goba e laetšwe bjalo ka decorative.

accessibility-video-short-description = Bakeng sa phihlelelo, `<video>` e swanetše go ba le tlhalošo ye kopana.

accessibility-input-short-description-or-label = Bakeng sa phihlelelo, `<{ $component }>` e swanetše go ba le tlhalošo ye kopana goba leina.

accessibility-answer-input-short-description-or-label = Bakeng sa phihlelelo, `<answer>` yeo e hlolago tsenyo e swanetše go ba le tlhalošo ye kopana goba leina.

accessibility-short-description-contains-math = Ditlhalošo tše kopana ga di swanela go ba le dikarolo tša dipalo bjalo ka `<{ $component }>`. Ngwala dipalo ka mantšu.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ga e na phapano ye e lekanego bakeng sa sengwalwa sa hlogo ya karolwana (mokgwa wa leswiswi) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; go nyakega bonyane { $threshold }:1).
       *[other] { $colorName } ga e na phapano ye e lekanego bakeng sa sengwalwa sa hlogo ya karolwana ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; go nyakega bonyane { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Ga se gwa dirwa `<circle>` yeo e fetago dintlheng tše { $count } mo dintlha di se nago boleng bja dipalo.

circle-too-many-through-points = Ga go kgonege go bala sediko se se fetago dintlheng tše fetago tše tharo.

circle-overprescribed-radius-center-points = Ga go kgonege go bala sediko ka radiase, bogare le dintlha tšeo di laeditšwego.

circle-center-with-multiple-points = Ga go kgonege go bala sediko seo se fetago ntlheng e fetago e tee ka bogare bjo bo laeditšwego.

circle-radius-too-small = Ga go kgonege go bala sediko: ka ge sekgoba magareng ga dintlha tše pedi e le { $distance }, radiase { $radius } yeo e laeditšwego e nnyane kudu.

circle-radius-with-many-points = Ga go kgonege go hlola sediko se se fetago dintlheng tše fetago tše pedi ka radiase ye e laeditšwego.

circle-invalid-center-or-through-points = Bogare goba dintlha tša sediko di fošagetše.

circle-radius-center-with-multiple-points = Ga go kgonege go bala radiase ya sediko seo se fetago ntlheng e fetago e tee ka bogare bjo bo laeditšwego.

circle-change-radius-non-numerical = Ga go kgonege go fetoša radiase ya sediko seo se fetago dintlheng tše di se nago dipalo

circle-radius-with-points-non-numerical = Ga go kgonege go hlola sediko se se fetago ntlheng e fetago e tee ka radiase ye e laeditšwego ge go se na boleng bja dipalo.

circle-change-center-non-numerical = Ga se gwa dirwa go fetoša bogare bja sediko seo se fetago dintlheng tše di se nago dipalo.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Bogolo bo bonnyane bakeng sa lefelo la tirišo. Lefelo le na le kgao e { $intervals } efela tirišo e na le { $inputs ->
            [one] tsenyo e { $inputs }
           *[other] ditsenyo tše { $inputs }
        }.
       *[other] Bogolo bo bonnyane bakeng sa lefelo la tirišo. Lefelo le na le dikgao tše { $intervals } efela tirišo e na le { $inputs ->
            [one] tsenyo e { $inputs }
           *[other] ditsenyo tše { $inputs }
        }.
    }

function-domain-invalid-format = Sebopego se se fošagetšego sa lefelo la tirišo.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Go hlokomologa boleng bjo bogolo bjo e sego bja dipalo bja tirišo.
        [minimum] Go hlokomologa boleng bjo bonnyane bjo e sego bja dipalo bja tirišo.
        [extremum] Go hlokomologa boleng bja mafelelo bjo e sego bja dipalo bja tirišo.
        [point] Go hlokomologa ntlha yeo e sego ya dipalo ya tirišo.
        [slope] Go hlokomologa setsekelo seo e sego sa dipalo sa tirišo.
       *[other] Go hlokomologa { $type } yeo e sego ya dipalo ya tirišo.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Go hlokomologa boleng bjo bogolo bjo bo se nago selo bja tirišo.
        [minimum] Go hlokomologa boleng bjo bonnyane bjo bo se nago selo bja tirišo.
        [extremum] Go hlokomologa boleng bja mafelelo bjo bo se nago selo bja tirišo.
        [point] Go hlokomologa ntlha ye e se nago selo ya tirišo.
       *[other] Go hlokomologa { $type } ye e se nago selo ya tirišo.
    }

function-points-too-close = Tirišo e na le dintlha tše pedi tšeo di lego kgauswi kudu. Ga go kgonege go hlaloša tirišo.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Diponelo tša tirišo di kgonega feela ge palo ya ditsenyo e lekana le palo ya ditšweletšo. Tirišo ye e na le tsenyo e { $inputs } le { $outputs ->
            [one] tšweletšo e { $outputs }
           *[other] ditšweletšo tše { $outputs }
        }.
       *[other] Diponelo tša tirišo di kgonega feela ge palo ya ditsenyo e lekana le palo ya ditšweletšo. Tirišo ye e na le ditsenyo tše { $inputs } le { $outputs ->
            [one] tšweletšo e { $outputs }
           *[other] ditšweletšo tše { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Botelele bjo bo fošagetšego bja tatelano.  Bo swanetše go ba palo ye e tletšego yeo e sego ya fase ga lefeela.

sequence-invalid-step = Kgato ye e fošagetšego ya tatelano.  E swanetše go ba palo bakeng sa tatelano ya mohuta wa { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ye e fošagetšego ya tatelano ya dipalo.  E swanetše go ba palo.

sequence-invalid-endpoint-letters = "{ $attribute }" ye e fošagetšego ya tatelano ya ditlhaka.  E swanetše go ba motswako wa ditlhaka.

sequence-invalid-endpoint = "{ $attribute }" ye e fošagetšego ya tatelano.

select-from-sequence-coprime-not-numbers = coprime e hlokomologilwe ka ge go sa kgethwe dipalo

select-from-sequence-coprime-with-exclude-combinations = coprime e hlokomologilwe ka ge excludeCombinations e laeditšwe

## Resolving a `target`

target-not-found = Nepo ye e fošagetšego ya `<{ $source }>`: nepo ga e hwetšwe.

target-state-variable-not-found = Nepo ye e fošagetšego ya `<{ $source }>`: ga go hwetšwe phapano ya boemo ya "{ $property }" go `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Diphapano tša `<odeSystem>` di swanetše go fapana le phapano ye e ikemetšego.

ode-system-duplicate-variable-names = Ga go kgonege go hlaloša ditirišo tša ODE RHS ka maina a diphapano a a boeleditšwego.

ode-system-rhs-function-error = Ga go kgonege go hlaloša tirišo ya ODE RHS.  Phošo go hlomeng tirišo ya mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ga go kgonege go hlaloša sekhutlo magareng ga methaladi ye { $count }

angle-invalid-through-point = Ntlha ye e fošagetšego go through ya `<angle>`

parabola-vertex-too-many-points = Ga se gwa dirwa parabola ka ntlha ya godimo yeo e fetago ntlheng e fetago e tee.

parabola-too-many-points = Ga se gwa dirwa parabola yeo e fetago dintlheng tše fetago tše tharo.

intersection-too-many-items = Ga se gwa dirwa kopano ya dilo tše fetago tše pedi

## Other math components

ionic-compound-not-two-ions = Ga se gwa dirwa motswako wa ayone ntle le wa diayone tše pedi.

ionic-compound-needs-cation-and-anion = Motswako wa ayone o dirilwe feela bakeng sa khathayone e tee le anayone e tee.

solve-equations-cannot-evaluate = Ga go kgonege go rarolla tekanyo ka ge e sa kgone go lekolwa: { $equation }

math-operators-operand-number-required = O swanetše go laetša operandNumber ge o ntšha operand ya dipalo.

eigen-decomposition-failed = Ga go a kgonega go bala dipalo tša aigene tša mmetriki

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: sedirišwa { $parameters } ga se gona mokgweng, ka gona se tla dumelelana le sekgoba ka mehla.
       *[other] `<matchesPattern>`: didirišwa { $parameters } ga di gona mokgweng, ka gona di tla dumelelana le sekgoba ka mehla.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ga go kgonege go kwešiša grid="{ $grid }". E swanetše go ba none, medium, dense, goba dipalo tše pedi tše di feletšego tšeo di aroganywago ka sekgoba, bjalo ka grid="1 0.5". Ga go marangrang ao a thalwago.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ga e thekgwe mmontšhing wa prefigure; go dirišwa mokgwa wa right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ga e thekgwe mmontšhing wa prefigure; go dirišwa mokgwa wa top.

prefigure-invalid-axis-bounds = `<graph>`: mellwane ya kutu e fošagetše bakeng sa phetošo ya prefigure; go dirišwa bbox ya tlwaelo (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: bophara bjo bo fošagetšego bja phetošo ya prefigure; go dirišwa bophara bja tlwaelo bja 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ye e fošagetšego ya phetošo ya prefigure; go dirišwa tekanyo ya tlwaelo ya 1.

prefigure-grid-spacing-too-fine = `<graph>`: sekgoba sa marangrang se sennyane kudu bakeng sa mellwane ya dikutu; marangrang a tlogetšwe mmontšhing wa prefigure.

prefigure-annotations-not-rendered = `<graph>`: dihlaloso di ka se bontšhwe ge go sa dirišwe mmontšhi wa PreFigure.

multiple-annotations-children = Go hweditšwe bana ba bantši ba `<annotations>` ka gare ga `<graph>`; ka moka ntle le wa mafelelo ba hlokomologilwe.

## Referring to other components

copy-unrecognized-component-type = Ga go kgonege go oketša goba go kopiša mohuta wa karolo wo o sa tsebjego: { $type }.

copy-prop-not-found = Ga go hwetšwe seka { $property } go karolo ya mohuta wa { $component }

collect-no-source = Ga go mothopo wo o hweditšwego bakeng sa collect.

collect-invalid-component-type = Ga go kgonege go kgoboketša dikarolo tša mohuta wa `<{ $component }>` ka ge e le mohuta wa karolo wo o fošagetšego.

reference-index-unavailable = Ga go kgonege go šupa go nomoro `{ $reference }`

## `<callAction>`

component-action-unavailable = Ga go kgonege go bitša { $action } go karolo `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Datha e na le sebopego se se fošagetšego.  Methaladi e na le botelele bjo bo sa swanego. E hweditšwe go componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Datha e na le maina a dikholomo a a boeleditšwego.  E hweditšwe go componentIdx :{ $componentIdx }

data-frame-missing-column-name = Datha e hloka leina la kholomo.  E hweditšwe go componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award ya karabo ye e theilwe godimo ga karabo ya answer ka boyona, seo se tla tliša mokgwa wo o sa letelwago.

answer-max-num-attempts-in-section-wide-check-work = Go bea `maxNumAttempts` go `<answer>` ka gare ga sekgobokedi seo se nago le `sectionWideCheckWork` ga go na khuetšo, ka ge palo ya maiteko e laolwa ke sekgobokedi. Bea `maxNumAttempts` sekgobokeding.

nested-section-wide-check-work-max-num-attempts = Go bea `maxNumAttempts` go sekgobokedi seo se nago le `sectionWideCheckWork` seo se lego ka gare ga se sengwe seo se nago le `sectionWideCheckWork` ga go na khuetšo, ka ge palo ya maiteko e laolwa ke sekgobokedi sa ka ntle. Bea `maxNumAttempts` sekgobokeding sa ka ntle.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Seka sa { $attributes } se ka se be le khuetšo ntle le symbolicEquality.
       *[other] Diseka tša { $attributes } di ka se be le khuetšo ntle le symbolicEquality.
    }

answer-invalid-type = Mohuta wo o fošagetšego wa karabo: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ka ge karolo `<{ $component }>` e se na leina, e ka se dirišwe bjalo ka seka sa module

module-attribute-name-already-defined = Karolo `<{ $component } name="{ $name }">` e ka se dirišwe bjalo ka seka sa module ka ge mohuta wa karolo wa `<module>` o šetše o na le seka sa "{ $name }".

conditional-content-condition-ignored = Seka sa `condition` se a hlokomologwa go karolo ya `<conditionalContent>` yeo e nago le bana ba case goba else.

slider-markers-type-mismatch = Mohuta wa maswao ga o sepelelane le mohuta wa slider.

pretzel-problem-needs-statement-and-answer = pretzel ye e fošagetšego: `<problem>` ye nngwe le ye nngwe e swanetše go ba le `<statement>` e tee le `<answer>` e tee.

pretzel-circuit-first-problem-distractor = pretzel ye e fošagetšego: go mode="circuit", `<problem>` ya mathomo e ka se be sešitiši.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Boleng bjo bo fošagetšego { $values } bja seka `{ $attribute }`; go a hlokomologa.
       *[other] Boleng bjo bo fošagetšego { $values } bja seka `{ $attribute }`; go a hlokomologa.
    }

attribute-must-be-references = Boleng bjo bo fošagetšego `{ $value }` bja seka `{ $attribute }`. Seka se swanetše go bopša ka ditšhupetšo tšeo di thomago ka `$`.

math-input-invalid-function-names = <mathInput>: go hlokomologilwe maina a ditirišo a a fošagetšego go { $attribute }: { $names }. Karolo ya pontšho ya leina le lengwe le le lengwe e swanetše go ba le bonyane ditlhaka tše pedi (ditlhaka goba dikgato); mafelelo a `|<mathspeak alternative>` a ka latela.

## Building components from the source

component-type-invalid = Mohuta wa karolo wo o fošagetšego: `<{ $componentType }>`

attribute-repeated = Ga go kgonege go boeletša seka { $attribute }.

attribute-invalid-for-component = Seka se se fošagetšego "{ $attribute }" bakeng sa karolo ya mohuta wa `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Tlhalošo ya setaele { $styleNumber } ga e na phapano ye e lekanego ya { $context ->
        [text-on-background] mmala wa sengwalwa kgahlanong le mmala wa bokamorago
        [high-contrast] mmala wa phapano ye kgolo kgahlanong le khanabase
        [line] mmala wa mothaladi kgahlanong le khanabase
        [marker] mmala wa leswao kgahlanong le khanabase
       *[text-on-canvas] mmala wa sengwalwa kgahlanong le khanabase
    }{ $mode ->
        [dark] { " (mokgwa wa leswiswi)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; go nyakega bonyane { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Le ge tlhalošo ya setaele { $styleNumber } e laeditše mebala yeo e nago le phapano ye e lekanego ya mokgwa wa seetša, mebala ya mokgwa wa leswiswi yeo e tšwago go boleng bjo ga e na phapano ye e lekanego magareng ga mmala wa sengwalwa le mmala wa bokamorago ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; go nyakega bonyane { $threshold }:1). { $suggestion ->
        [available] Go netefatša phapano ye e lekanego mokgweng wa leswiswi, oketša phapano ya mokgwa wa seetša (mohlala, bea { $lightAttribute }="{ $lightColor }") goba fetola mmala wa mokgwa wa leswiswi (mohlala, bea { $darkAttribute }="{ $darkColor }").
       *[none] Go netefatša phapano ye e lekanego mokgweng wa leswiswi, oketša phapano ya mokgwa wa seetša goba fetola mebala yeo e tšwago go boleng bjo ka textColorDarkMode le/goba backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Le ge tlhalošo ya setaele { $styleNumber } e laeditše mmala wa sengwalwa woo o nago le phapano ye e lekanego ya mokgwa wa seetša, mmala wa sengwalwa wa mokgwa wa leswiswi woo o tšwago go boleng bjo ga o na phapano ye e lekanego kgahlanong le khanabase ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; go nyakega bonyane { $threshold }:1). { $suggestion ->
        [available] Go netefatša phapano ye e lekanego mokgweng wa leswiswi, oketša phapano ya mokgwa wa seetša (mohlala, bea textColor="{ $lightColor }") goba fetola mmala wa mokgwa wa leswiswi (mohlala, bea textColorDarkMode="{ $darkColor }").
       *[none] Go netefatša phapano ye e lekanego mokgweng wa leswiswi, oketša phapano ya mokgwa wa seetša goba fetola mmala woo o tšwago go boleng bjo ka textColorDarkMode.
    }

section-multiple-style-palettes = Karolwana e ka kgetha <stylePalette> e tee feela; go dirišwa ya mafelelo.

## Unique variants

variant-num-to-select-not-non-negative-integer = ga go kgonege go laetša mehuta ye e ikgethilego ya { $component } ka ge numToSelect e se palo ye e tletšego yeo e sego ya fase ga lefeela.

variant-num-to-select-not-constant-number = ga go kgonege go laetša mehuta ye e ikgethilego ya { $component } ka ge numToSelect e se palo ye e sa fetogego.

variant-with-replacement-not-constant-boolean = ga go kgonege go laetša mehuta ye e ikgethilego ya { $component } ka ge withReplacement e se boolean ye e sa fetogego.

variant-select-weight-disables-unique = Mehuta ye e ikgethilego ya select e a tima ge go na le kgetho yeo e nago le selectWeight goba selectForVariants

variant-coprime-undetermined = ga go kgonege go laetša mehuta ye e ikgethilego ya { $component } ka ge go sa kgonege go laetša gore coprime ke maaka ka mehla.

variant-attribute-not-constant = ga go kgonege go laetša mehuta ye e ikgethilego ya { $component } ka ge { $attribute } e sa dule e le tee.

variant-attribute-not-number = ga go kgonege go laetša mehuta ye e ikgethilego ya { $component } ka ge { $attribute } e se palo.

variant-attribute-wrong-type-for-sequence =
    ga go kgonege go laetša mehuta ye e ikgethilego ya { $component } ya mohuta wa { $type } ka ge { $attribute } e se { $expected ->
        [letters-combination] motswako wa ditlhaka
        [math-expression] polelwana ya dipalo ye e amogelegago
        [integer] palo ye e tletšego
       *[number] palo
    }.

variant-length-not-integer = ga go kgonege go laetša mehuta ye e ikgethilego ya { $component } ka ge length e se palo ye e tletšego.

variant-sort-not-implemented = ga se gwa dirwa mehuta ye e ikgethilego ya { $component } yeo e nago le sort

variant-exclude-combinations-not-implemented = ga se gwa dirwa mehuta ye e ikgethilego ya { $component } yeo e nago le excludeCombinations

variant-math-exclude-not-implemented = ga se gwa dirwa mehuta ye e ikgethilego ya { $component } ya mohuta wa math yeo e nago le exclude

variant-non-constant-exclude-not-implemented = ga se gwa dirwa mehuta ye e ikgethilego ya { $component } yeo e nago le exclude ye e fetogago

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ga e thekgwe mmontšhing wa graph prefigure; setlogolo se tlogetšwe.

prefigure-descendant-invalid-geometry = { $subject }: tšeometri yeo e sa felego goba ye e sa felelago; setlogolo se tlogetšwe.

prefigure-curve-label-omitted = { $subject }: maina ga a thekgwe go dikarolo tša mokgopo tšeo di fetošitšwego; leina le tlogetšwe.

prefigure-curve-unsupported-definition-type = { $subject }: mohuta wa tlhalošo ya tirišo ya mokgopo '{ $definitionType }' ga o thekgwe; setlogolo se tlogetšwe.

prefigure-region-flip-functions-unsupported = { $subject }: seka sa flipFunctions go regionBetweenCurves ga se thekgwe; setlogolo se tlogetšwe.

prefigure-region-non-formula-child = { $subject }: ke ditirišo tša bana tša mohuta wa formula feela tšeo di thekgwago go regionBetweenCurves; setlogolo se tlogetšwe.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ga e thekgwe bakeng sa { $labelKind ->
        [line-family] leina la lapa la methaladi
       *[point] leina la ntlha
    }; go dirišwa tekanyetšo ya tlwaelo ya PreFigure.

prefigure-fill-style-unsupported = { $subject }: setaele sa tlatšo '{ $fillStyle }' ga se thekgwe ke PreFigure; go bušetšwa go tlatšo ye e tiilego.

prefigure-line-style-unknown = { $subject }: setaele sa mothaladi seo se sa tsebjego '{ $lineStyle }' se tlogetšwe ditšweletšong tša PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: setaele sa leswao '{ $markerStyle }' se fetošeditšwe go setaele sa PreFigure sa 'diamond'.

prefigure-marker-style-unsupported = { $subject }: setaele sa leswao '{ $markerStyle }' ga se thekgwe ke PreFigure; go dirišwa setaele sa tlwaelo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ye e fošagetšego; ga go kgonege go hwetša nepo. Tlhaloso e tlogetšwe.

annotation-ref-multiple-targets = `<annotation>`: `ref` e šupile go dinepo tše dintši; go dirišwa nepo ya mathomo.

annotation-ref-outside-graph = `<annotation>`: `ref` ye e fošagetšego; nepo e ka ntle ga graph yeo e e swerego. Tlhaloso e tlogetšwe.

annotation-ref-unsupported-target = `<annotation>`: `ref` ye e fošagetšego; nepo ga se selo sa seswantšho seo se thekgwago phetošong ya prefigure. Tlhaloso e tlogetšwe.

annotation-text-missing = `<annotation>`: `text` e hlaelela goba ga e na selo; go ntšhwa sengwalwa se se se nago selo.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Go hweditšwe boithekgo bja sediko.
       *[other] Go hweditšwe boithekgo bja sediko bjo bo akaretšago karolo ya `<{ $componentType }>`.
    }

reference-no-referent = Ga go seo se hweditšwego bakeng sa setšhupetšo: `{ $reference }`

reference-multiple-referents = Go hweditšwe dilo tše dintši bakeng sa setšhupetšo: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Sebopego se se fošagetšego sa seka { $attribute } sa `<{ $componentType }>`.

children-invalid = Bana ba ba fošagetšego ba `<{ $componentType }>`: Go hweditšwe bana ba ba fošagetšego: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Boleng bjo bo fošagetšego `{ $value }` bja seka `{ $attribute }`, go dirišwa boleng `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Tokollo ya DoenetML { $version } ga e hwetšwe.
       *[other] Tokollo ya DoenetML { $version } ga e hwetšwe. Go bušetšwa go tokollo ya { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ye e fošagetšego: { $content }

parse-tag-missing-close-tag = DoenetML ye e fošagetšego: Tag `{ $tag }` ga e na tag ya go tswalela. Go be go letetšwe tag yeo e itswalelago goba tag ya `</{ $tagName }>`.

parse-tag-error = DoenetML ye e fošagetšego: Phošo go tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ye e fošagetšego: Seka se se fošagetšego `{ $attribute }` se bonala se hloka boleng.

parse-attribute-invalid = DoenetML ye e fošagetšego: Seka se se fošagetšego `{ $attribute }`

parse-attribute-value-invalid = DoenetML ye e fošagetšego: Boleng bjo bo fošagetšego bja seka `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML ye e fošagetšego: Boleng bjo bo fošagetšego bja seka `{ $value }`. Maswao a go nagana ga a sepelelane. Go bonala o hloka `{ $quote }`

parse-open-tag-name-missing = DoenetML ye e fošagetšego: Go hweditšwe tag ye e se nago leina, mohlala `<`

parse-tag-not-closed = DoenetML ye e fošagetšego: Tag `{ $tag }` ga e a tswalelwa (go bonala `>` e hlaelela).

parse-self-closing-tag-name-missing = DoenetML ye e fošagetšego: Go hweditšwe tag ye e se nago leina `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ye e fošagetšego: Tag `{ $tag }` ga e a tswalelwa (go bonala `/>` e hlaelela).

parse-tag-invalid-attributes = DoenetML ye e fošagetšego: Tag `{ $tag }` ga e amogelege. E ka ba e na le diseka tše di fošagetšego.

parse-close-tag-name-missing = DoenetML ye e fošagetšego: Go hweditšwe tag ya go tswalela ye e se nago leina, mohlala `</`

parse-attribute-value-unquoted = Boleng bja seka bo swanetše go ba ka gare ga maswao a tsopolo: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ye e fošagetšego: Go hweditšwe tag ya go tswalela `{ $tag }`, efela ga go tag ya go bula ye e sepelelanago le yona

parse-close-tag-mismatched = DoenetML ye e fošagetšego: Tag ya go tswalela ga e sepelelane. Go be go letetšwe `</{ $expected }>`. Go hweditšwe `{ $found }`

parser-node-unconvertible = Ga go a kgonega go fetošetša nod { $node } go nod ya Dast.

## Names

name-attribute-invalid =
    Leina la seka le fošagetše name='{ $name }'. { $reason ->
        [characters] Maina a ka ba le ditlhaka, dipalo, ditlhatlhamišo goba dikgato feela.
       *[start] Maina a swanetše go thoma ka tlhaka.
    }

component-name-invalid-start = Leina la karolo le fošagetše "{ $name }". Maina a swanetše go thoma ka tlhaka.

## `<answer>` sugar

answer-video-watched-missing-video = Karabo ya mohuta wa videoWatched e swanetše go ba le seka sa video

answer-video-watched-video-not-reference = Karabo ya mohuta wa videoWatched e swanetše go ba le seka sa video seo e lego setšhupetšo

answer-name-not-single-text = Seka sa name sa karabo se swanetše go ba le ngwana o tee wa sengwalwa

## Referencing another document

external-doenetml-recursion-limit = Ga go a kgonega go hwetša DoenetML ya ka ntle ka baka la maemo a mantši kudu a boipoeletšo. Na go na le setšhupetšo sa sediko?

external-doenetml-unavailable = Ga go a kgonega go hwetša DoenetML go tšwa go { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ye e hweditšwego go { $attribute }="{ $uri }" e fošagetše: ga e a sepelelana le mohuta wa karolo wa "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Seka `{ $from }` ga se sa dirišwa; diriša `{ $to }` sebakeng sa sona.
       *[other] [deprecation] Seka `{ $from }` go `<{ $component }>` ga se sa dirišwa; diriša `{ $to }` sebakeng sa sona.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Seka `{ $from }` ga se sa dirišwa ebile se a hlokomologwa ka ge `{ $to }` le yona e laeditšwe.
       *[other] [deprecation] Seka `{ $from }` go `<{ $component }>` ga se sa dirišwa ebile se a hlokomologwa ka ge `{ $to }` le yona e laeditšwe.
    }

deprecated-attribute-ignored = [deprecation] Seka `{ $attribute }` go `<{ $component }>` ga se sa dirišwa ebile se a hlokomologwa.

deprecated-attribute-to-child = [deprecation] Seka `{ $attribute }` go `<{ $component }>` ga se sa dirišwa; diriša ngwana wa `<{ $child }>` sebakeng sa sona.

deprecated-attribute-value-renamed = [deprecation] Boleng `{ $value }` bja seka `{ $attribute }` go `<{ $component }>` ga bo sa dirišwa; diriša `{ $to }` sebakeng sa bjona.


## Language coverage

pluralize-english-only = `<pluralize>` e kgona go dira bontši bja Seisemane feela, ka gona sengwalwa sa yona ga se fetolwe tokumenteng ye e ngwadilwego ka { $locale }. Ngwala sebopego sa bontši ka go lebanya, goba se bee ka seka sa `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Karolo `<{ $tag }>` ga se karolo ya Doenet ye e tsebjago.

schema-element-not-allowed-at-root = Karolo `<{ $tag }>` ga e dumelelwe modung wa tokumente.

schema-element-not-allowed-inside = Karolo `<{ $tag }>` ga e dumelelwe ka gare ga `<{ $parent }>`.

schema-attribute-unrecognized = Karolo `<{ $tag }>` ga e na seka seo se bitšwago `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Seka `{ $attribute }` sa karolo `<{ $tag }>` se swanetše go ba lenaneo leo dilo tša lona e lego ye nngwe ya: { $allowed }
       *[other] Seka `{ $attribute }` sa karolo `<{ $tag }>` se swanetše go ba se sengwe sa: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Leina la mohuta le fošagetše go select.  Leina la mohuta { $variantName } le tšwelela dikgethong tše { $numOptions } efela palo yeo e swanetšego go kgethwa ke { $numToSelect }.

select-variant-name-without-options = Mehuta e mengwe e laeditšwe go select efela ga go dikgetho tšeo di laeditšwego bakeng sa leina la mohuta leo le kgonegago: { $variantName }.

select-variant-name-not-possible = Leina la mohuta { $variantName } leo le laeditšwego go select ga se leina la mohuta leo le kgonegago.

select-too-few-options = Ga go kgonege go kgetha dikarolo tše { $numToSelect } go tše { $numOptions } feela.

select-from-sequence-too-few-values = Ga go kgonege go kgetha boleng bjo { $numToSelect } tatelanong ya botelele bja { $length }.

select-from-sequence-indices-count-mismatch = Palo ya dinomoro tšeo di laeditšwego go select e swanetše go sepelelana le palo yeo e swanetšego go kgethwa

select-from-sequence-indices-not-integers = Dinomoro ka moka tšeo di laeditšwego go select di swanetše go ba dipalo tše di tletšego

select-from-sequence-index-excluded = Nomoro ya selectfromsequence yeo e laeditšwego e be e tlošitšwe

select-from-sequence-indices-excluded-combination = Dinomoro tša selectfromsequence tšeo di laeditšwego e be e le motswako wo o tlošitšwego

select-from-sequence-coprime-not-positive-integers = Ga go kgonege go kgetha metswako ya coprime ka ge go sa kgethwe dipalo tše di tletšego tša godimo ga lefeela.

select-from-sequence-coprime-common-factor = Ga go kgonege go kgetha dipalo tša coprime. Boleng ka moka bjo bo kgonegago bo na le sedirišwa se se swanago. (Boleng bjo bo laeditšwego bja "from" goba "to" bo swanetše go ba coprime le "step".)

select-from-sequence-coprime-single-number = Ga go kgonege go kgetha metswako ya coprime go palo e tee yeo e sego 1.

select-from-sequence-excluded-too-many-combinations = Go tlošitšwe go feta 70% ya metswako go selectFromSequence

select-from-sequence-coprime-none-found = Ga go a kgonega go kgetha dipalo tša coprime. Boleng ka moka bjo bo kgonegago bo na le sedirišwa se se swanago.

select-from-sequence-too-few-unique-values = Ga go kgonege go kgetha boleng bjo bo ikgethilego bja { $numToSelect } tatelanong ya botelele bja { $numPossibleValues }

select-prime-numbers-too-few-values = Ga go kgonege go kgetha boleng bjo { $numToSelect } lenaneong la dipalo tša mothopo la botelele bja { $numValues }

select-prime-numbers-values-count-mismatch = Palo ya boleng bjo bo laeditšwego go select e swanetše go sepelelana le palo yeo e swanetšego go kgethwa

select-prime-numbers-values-not-prime = Boleng ka moka bjo bo laeditšwego go select prime number bo swanetše go ba lenaneong la dipalo tša mothopo

select-prime-numbers-values-excluded-combination = Boleng bjo bo laeditšwego bja selectPrimeNumbers e be e le motswako wo o tlošitšwego

select-prime-numbers-excluded-too-many-combinations = Go tlošitšwe go feta 70% ya metswako go selectPrimeNumbers

select-random-combination-fluke = Ka lehlogonolo le legolo kudu, ga go a kgonega go kgetha motswako wa boleng bjo bo sa letelwago

select-random-value-fluke = Ka lehlogonolo le legolo kudu, ga go a kgonega go kgetha boleng bjo bo sa letelwago
