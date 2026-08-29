# Kosraean (kas Kosrae) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
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
# ORTHOGRAPHY. Standard modern Kosraean; `chrome.ftl`'s header is canonical.
#
# ## What this file is, and what it is not
#
# It is a **Kosraean frame around an English technical vocabulary**, and it
# should be read that way rather than as a finished translation. The recurring
# openings — the part a reader actually reads — are Kosraean:
#
#   Tia ku in …        cannot …
#   … tia fal          … is invalid, … does not fit
#   Pilesrala …        ignoring …, … is ignored
#   Soenna orekla …    … has not been implemented yet
#   Enenu in …         … must …
#   Wangin …           there is no …
#   … koneyuk          … was found; «tia koneyuk», was not found
#   ke sripen          because
#   fahkyuk            specified, stated
#   itukyang           given
#
# The nouns inside them — `line`, `point`, `circle`, `function`, `variant`,
# `sequence`, `component`, `attribute`, `value`, `type`, `index`, `dimension`,
# `contrast`, `mode` — are **English words kept as loans in English spelling**,
# not respellings. `content.ftl`'s header says why this catalog does not
# respell and why that parts company on purpose with `locales/pon`,
# `locales/mh`, `locales/chk` and `locales/gil`, which do.
#
# This is a larger debt than `locales/pon`'s, which had a dictionary to draw
# its nouns from where this seed had none, and this file says so rather than
# leaving a reader to infer it. A speaker replacing the loans is doing the work
# this file was written to make easy, and needs no permission for any of it.
#
# ## Number
#
# A Kosraean noun takes no ending after a numeral, and `Intl.PluralRules("kos")`
# has no CLDR data — it resolves against the runtime's default locale — so no
# message here writes a `[two]`, `[few]` or `[many]` branch. Where English's
# `one`/`*[other]` pair differs only in the number of the noun, **both branches
# are kept and render the same Kosraean string**, so that no branch goes
# missing and a reviewer who wants the distinction has somewhere to put it.
#
# ## Variant keys
#
# `[not-inline]`, `[expanded]`, `[on-graph]`, `[relative-width]`,
# `[text-on-background]`, `[high-contrast]`, `[line-family]`, `[integer]`,
# `[none]`, `[dark]` and the rest are symbols the core passes in, matched
# letter for letter. They are copied byte for byte from English and must stay
# that way; a translated one is a branch nothing can reach.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] Pilesrala { $attributes } ke pacl ma endpoint luo fahkyuk
       *[other] Pilesrala { $attributes } ke pacl ma endpoint luo fahkyuk
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] Pilesrala { $attributes } ke pacl ma endpoint ac midpoint kewa fahkyuk
       *[other] Pilesrala { $attributes } ke pacl ma endpoint ac midpoint kewa fahkyuk
    }

line-segment-midpoint-offset-without-midpoint = wangin sripen midpointOffset fin wangin midpoint

## `<line>`

line-points-undetermined-dimensions = Line se ma fahsr ke point ma tia etu lupan dimension lalos.

line-points-too-few-dimensions = Line enenu in fahsr ke point ma oasr dimension luo ku yohk liki.

line-points-depend-on-variables = Line se fahsr ke point ma filfilla ke variable: { $variables }.

line-equation-invalid-format = Lumah lun equation lun line ke variable { $variable1 } ac { $variable2 } tia fal.

## `<ray>`

ray-overprescribed-through = Ray se fahkyuk ke through, endpoint, ac direction.  Pilesrala through ma fahkyuk.

ray-dimension-mismatch = numDimensions tia fal in ray.

## `<vector>`

vector-overprescribed-head = Vector se fahkyuk ke head, tail, ac displacement.  Pilesrala head ma fahkyuk.

vector-dimension-mismatch = numDimensions tia fal in vector.

## Attracting and constraining

attract-to-without-nearest-point = Tia ku in amakin nu ke `<{ $component }>` ke sripen wangin state variable nearestPoint kac.

constrain-to-without-nearest-point = Tia ku in kalsrali nu ke `<{ $component }>` ke sripen wangin state variable nearestPoint kac.

constrain-to-interior-without-nearest-point = Tia ku in kalsrali nu loac ke `<{ $component }>` ke sripen wangin state variable nearestPoint kac.

## `<choiceInput>`

choice-input-label-position-ignored = pilesrala labelPosition ke choiceInput ma tia inline

## Ordering children by index

choice-input-indices-count-mismatch = Pilesrala index ma fahkyuk nu ke choiceInput ke sripen lupan index tia fal nu ke lupan choice.

pretzel-indices-count-mismatch = Pilesrala index ma fahkyuk nu ke problem ke sripen lupan index tia fal nu ke lupan problem.

shuffle-indices-count-mismatch = Pilesrala index ma fahkyuk nu ke shuffle ke sripen lupan index tia fal nu ke lupan component.

indices-ignored-out-of-range = Pilesrala index ma fahkyuk nu ke { $component } ke sripen kutu index oan likin masrol.

pretzel-indices-repeated = Pilesrala index ma fahkyuk nu ke pretzel ke sripen kutu index sifil sikyak.

pretzel-circuit-first-index = Pilesrala index ma fahkyuk nu ke pretzel in circuit mode ke sripen index se meet enenu in 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Attribute `type` enenu in fahkyuk tuh `<{ $component }>` in ku in orekma ke string.

invalid-type-defaulting-to-math = Type { $type } tia fal nu ke component { $component }. Enenu in sie sin math, text, number, ku boolean. Orekmakin math.

string-not-valid-component-to-arrange = String "{ $value }" tia sie component fal in { $component }. Pilesrala.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } tia fal, filiya type nu ke number.

invalid-variable-value = Value lun variable se tia fal: `{ $value }`

## Variants

variant-index-must-be-number = Index lun variant { $index } enenu in sie number

variant-index-must-be-integer = Index lun variant { $index } enenu in sie integer

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` soenna orekla nu ke srikasrak absolute. Filiya width nu ke relative.

side-by-side-absolute-margins = `<{ $component }>` soenna orekla nu ke srikasrak absolute. Filiya margin nu ke relative.

side-by-side-no-block-child = `<{ $component }>` tia fal: enenu in oasr kais sie block child kac.

## `<label>`

label-for-ignored-on-graphical = Pilesrala attribute `for` fin `<label>` ma oan fin graph.

label-for-must-resolve-to-one = Attribute `for` fin `<label>` enenu in fahsr nu ke component sefanna.

label-for-unresolved = Attribute `for` fin `<label>` tia ku in fahsr nu ke sie component.

label-for-answer-with-authored-inputs = Attribute `for` fin `<label>` fahsr nu ke sie `<answer>` ma oasr input ma mwet sim uh orala; fahsr nu ke input sac sifacna.

label-for-answer-without-input = Attribute `for` fin `<label>` fahsr nu ke sie `<answer>` ma wangin input in filiya ine kac.

label-for-must-reference-input-or-answer = Attribute `for` fin `<label>` enenu in fahsr nu ke sie input ku sie answer.

## Accessibility

accessibility-short-description-or-decorative = Ke ku in utyak, `<{ $component }>` enenu in oasr kas in akkalem fototo kac ku fahkyuk mu ma naweyuk.

accessibility-video-short-description = Ke ku in utyak, `<video>` enenu in oasr kas in akkalem fototo kac.

accessibility-input-short-description-or-label = Ke ku in utyak, `<{ $component }>` enenu in oasr kas in akkalem fototo ku sie ine kac.

accessibility-answer-input-short-description-or-label = Ke ku in utyak, sie `<answer>` ma orala sie input enenu in oasr kas in akkalem fototo ku sie ine kac.

accessibility-short-description-contains-math = Kas in akkalem fototo tia enenu in oasr component math oana `<{ $component }>` kac. Sim math nukewa ke kas.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Contrast lun { $colorName } tia fal nu ke kas lun sikyen tafu (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; enenu in { $threshold }:1 ku yohk liki).
       *[other] Contrast lun { $colorName } tia fal nu ke kas lun sikyen tafu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; enenu in { $threshold }:1 ku yohk liki).
    }

## `<circle>`

circle-through-points-non-numerical = Soenna orekla `<circle>` ma fahsr ke point { $count } ke pacl ma wangin value number lun point inge.

circle-too-many-through-points = Tia ku in oakla circle ma fahsr ke point yohk liki 3.

circle-overprescribed-radius-center-points = Tia ku in oakla circle ma fahkyuk radius, center, ac point kewa.

circle-center-with-multiple-points = Tia ku in oakla circle ma fahkyuk center ac fahsr ke point yohk liki 1.

circle-radius-too-small = Tia ku in oakla circle: ke sripen lusen inmasrlon point luo pa { $distance }, radius { $radius } ma fahkyuk uh srik na.

circle-radius-with-many-points = Tia ku in orala circle ma fahsr ke point yohk liki luo ac oasr radius fahkyuk.

circle-invalid-center-or-through-points = Center ku point lun circle tia fal.

circle-radius-center-with-multiple-points = Tia ku in oakla radius lun circle ma fahkyuk center ac fahsr ke point yohk liki 1.

circle-change-radius-non-numerical = Tia ku in ekulla radius lun circle ma point lal wangin value number

circle-radius-with-points-non-numerical = Tia ku in orala circle ma fahsr ke point yohk liki sie ac oasr radius fahkyuk ke pacl ma wangin value number.

circle-change-center-non-numerical = Soenna orekla ekulla lun center lun circle ma fahsr ke point ma wangin value number.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimension lun domain lun function tia fal. Oasr interval { $intervals } ke domain, a oasr { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        } ke function.
       *[other] Dimension lun domain lun function tia fal. Oasr interval { $intervals } ke domain, a oasr { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        } ke function.
    }

function-domain-invalid-format = Lumah lun domain lun function tia fal.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Pilesrala maximum lun function ma wangin value number.
        [minimum] Pilesrala minimum lun function ma wangin value number.
        [extremum] Pilesrala extremum lun function ma wangin value number.
        [point] Pilesrala point lun function ma wangin value number.
        [slope] Pilesrala slope lun function ma wangin value number.
       *[other] Pilesrala { $type } lun function ma wangin value number.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Pilesrala maximum oalal lun function.
        [minimum] Pilesrala minimum oalal lun function.
        [extremum] Pilesrala extremum oalal lun function.
        [point] Pilesrala point oalal lun function.
       *[other] Pilesrala { $type } oalal lun function.
    }

function-points-too-close = Oasr point luo ke function se inge ma apkuran na nu sie sin sie. Tia ku in oakla function.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Iterate lun function ku in orek ke pacl ma lupan input lun function oana lupan output. Function se inge oasr input { $inputs } ac { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
       *[other] Iterate lun function ku in orek ke pacl ma lupan input lun function oana lupan output. Function se inge oasr input { $inputs } ac { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Lusen sequence tia fal.  Enenu in sie integer ma tia srik liki 0.

sequence-invalid-step = Step lun sequence tia fal.  Enenu in sie number nu ke sequence lun type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" lun sequence lun number tia fal.  Enenu in sie number.

sequence-invalid-endpoint-letters = "{ $attribute }" lun sequence lun letters tia fal.  Enenu in kais sie letter.

sequence-invalid-endpoint = "{ $attribute }" lun sequence tia fal.

select-from-sequence-coprime-not-numbers = pilesrala coprime ke sripen tia sulela number

select-from-sequence-coprime-with-exclude-combinations = pilesrala coprime ke sripen excludeCombinations fahkyuk

## Resolving a `target`

target-not-found = Target lun `<{ $source }>` tia fal: tia ku in konauk target.

target-state-variable-not-found = Target lun `<{ $source }>` tia fal: tia ku in konauk sie state variable ma inel pa "{ $property }" fin sie `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variable lun `<odeSystem>` enenu in sie liki variable independent.

ode-system-duplicate-variable-names = Tia ku in oakla function RHS lun ODE ma oasr ine lun variable dependent ma sifil sikyak.

ode-system-rhs-function-error = Tia ku in oakla function RHS lun ODE.  Oasr tafongla ke orekla lun function mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Tia ku in oakla sie angle inmasrlon line { $count }

angle-invalid-through-point = Point in through lun `<angle>` tia fal

parabola-vertex-too-many-points = Soenna orekla parabola ma oasr vertex ac fahsr ke point yohk liki 1.

parabola-too-many-points = Soenna orekla parabola ma fahsr ke point yohk liki 3.

intersection-too-many-items = Soenna orekla intersection nu ke ma yohk liki luo

## Other math components

ionic-compound-not-two-ions = Soenna orekla ionic compound sayen ion luo.

ionic-compound-needs-cation-and-anion = Ionic compound orekla nu ke cation sefanna ac anion sefanna.

solve-equations-cannot-evaluate = Tia ku in aketeya equation ke sripen tia ku in oakla equation: { $equation }

math-operators-operand-number-required = Enenu in fahkyuk sie operandNumber ke eisla lun sie operand math.

eigen-decomposition-failed = Tia ku in oakla eigenvalue lun matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } tia oan in pattern, ke ma inge ac fal pacl nukewa nu ke sie acn oalal.
       *[other] `<matchesPattern>`: parameter { $parameters } tia oan in pattern, ke ma inge ac fal pacl nukewa nu ke sie acn oalal.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: tia ku in etu grid="{ $grid }". Enenu in none, medium, dense, ku number luo ma wo ac oasr acn oalal inmasrlolos, oana grid="1 0.5". Wangin grid orekla.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` enenu in oasr sie function ma oasr { $expected ->
        [one] output sefanna, slope y' ke kais sie point, oana `y - x`
       *[other] output luo, vector ke kais sie point, oana `(y, -x)`
    }, tusruktu function ma itukyang uh oasr { $found ->
        [one] output { $found }
       *[other] output { $found }
    } kac. { $alternative ->
        [none] Wangin ma orekla.
       *[other] `<{ $alternative }>` pa component fal nu ke function sac. Wangin ma orekla.
    }

field-function-attribute-ignored-with-child = Pilesrala attribute `function` ke sripen function sac itukyang pac in component sac; ma oan loac pa orekmakinyuk. Sang function sac ke sie inkanek na.

field-variables-ignored =
    `<{ $component }>`: attribute `variables` fahk ine lun variable lun sie expression ma simla in component sac sifacna. { $reason ->
        [function-child] Function se inge itukyang oana sie `<function>` child, ma fahk ine lun variable lal sifacna, ke ma inge pilesrala `variables`.
       *[no-expression] Wangin expression ouinge itukyang inge, ke ma inge pilesrala `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" tia orekmakinyuk in prefigure renderer; orekmakin ouiyen right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" tia orekmakinyuk in prefigure renderer; orekmakin ouiyen top.

prefigure-invalid-axis-bounds = `<graph>`: masrol lun axis tia fal nu ke ekulla nu ke prefigure; orekmakin bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: width tia fal nu ke ekulla nu ke prefigure; orekmakin lusen diagram 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio tia fal nu ke ekulla nu ke prefigure; orekmakin aspect ratio 1.

prefigure-grid-spacing-too-fine = `<graph>`: acn inmasrlon grid srik na nu ke masrol lun axis; wangin grid orekla in prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: annotation tia ac orekla fin tia orekmakin PreFigure renderer.

multiple-annotations-children = `<annotations>` child pus koneyuk in `<graph>`; pilesrala nukewa sayen ma safla.

## Referring to other components

copy-unrecognized-component-type = Tia ku in extend ku copy sie type lun component ma tia etu: { $type }.

copy-prop-not-found = Tia ku in konauk prop { $property } fin sie component lun type { $component }

collect-no-source = Wangin source koneyuk nu ke collect.

collect-invalid-component-type = Tia ku in collect component lun type `<{ $component }>` ke sripen tia sie type fal.

reference-index-unavailable = Tia ku in fahsr nu ke index `{ $reference }`

## `<callAction>`

component-action-unavailable = Tia ku in pangon { $action } fin component `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Lumah lun data tia fal.  Lusen row uh tia oana sie. Koneyuk in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Oasr ine lun column ma sifil sikyak in data.  Koneyuk in componentIdx :{ $componentIdx }

data-frame-missing-column-name = Wangin ine lun sie column in data.  Koneyuk in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Sie award lun answer se inge oakwuki fin topuk lun answer sac sifacna, ac ma inge ac oru sie ouiya su tia sikyak oana ma kom nunku.

answer-max-num-attempts-in-section-wide-check-work = Wangin sripen filiya lun `maxNumAttempts` fin sie `<answer>` in sie container ma oasr `sectionWideCheckWork` kac, ke sripen container sac pa oakla lupan srike. Filiya `maxNumAttempts` fin container sac.

nested-section-wide-check-work-max-num-attempts = Wangin sripen filiya lun `maxNumAttempts` fin sie container ma oasr `sectionWideCheckWork` kac ac oan in sie pac container ma oasr `sectionWideCheckWork` kac, ke sripen container se lik pa oakla lupan srike. Filiya `maxNumAttempts` fin container se lik.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Wangin sripen attribute { $attributes } fin tia filiya symbolicEquality.
       *[other] Wangin sripen attribute { $attributes } fin tia filiya symbolicEquality.
    }

answer-invalid-type = Type lun answer tia fal: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ke sripen wangin ine lun component `<{ $component }>`, tia ku in orekmakinyuk oana sie attribute lun module

module-attribute-name-already-defined = Component `<{ $component } name="{ $name }">` tia ku in orekmakinyuk oana sie attribute lun module ke sripen oasr tari attribute "{ $name }" ke type lun component `<module>`.

conditional-content-condition-ignored = Pilesrala attribute `condition` fin sie component `<conditionalContent>` ma oasr case ku else child kac.

slider-markers-type-mismatch = Type lun marker tia fal nu ke type lun slider.

pretzel-problem-needs-statement-and-answer = Pretzel tia fal: kais sie `<problem>` enenu in oasr sie `<statement>` ac sie `<answer>` kac.

pretzel-circuit-first-problem-distractor = Pretzel tia fal: in mode="circuit", `<problem>` se meet tia ku in sie distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Value { $values } tia fal nu ke attribute `{ $attribute }`; pilesrala.
       *[other] Value { $values } tia fal nu ke attribute `{ $attribute }`; pilesrala.
    }

attribute-must-be-references = Value `{ $value }` tia fal nu ke attribute `{ $attribute }`. Attribute enenu in orekla ke reference ma mutawauk ke sie `$`.

math-input-invalid-function-names = <mathInput>: pilesrala ine lun function ma tia fal in { $attribute }: { $names }. Ip in akkalem lun kais sie ine enenu in oasr letter ku dash luo ku pus liki; sie `|<mathspeak alternative>` ku in fahsr tok.

## Building components from the source

component-type-invalid = Type lun component tia fal: `<{ $componentType }>`

attribute-repeated = Tia ku in sifil sim attribute { $attribute }.

attribute-invalid-for-component = Attribute "{ $attribute }" tia fal nu ke sie component lun type `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Contrast lun style definition { $styleNumber } tia fal nu ke { $context ->
        [text-on-background] color lun kas lain color lun acn tok
        [high-contrast] color high-contrast lain canvas
        [line] color lun line lain canvas
        [marker] color lun marker lain canvas
       *[text-on-canvas] color lun kas lain canvas
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; enenu in { $threshold }:1 ku yohk liki).

style-definition-dark-mode-text-background-contrast =
    Style definition { $styleNumber } fahkyuk ke color ma fal nu ke light mode, tusruktu color lun dark mode ma tuku kac uh wangin contrast fal inmasrlon color lun kas ac color lun acn tok ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; enenu in { $threshold }:1 ku yohk liki). { $suggestion ->
        [available] In oasr contrast fal in dark mode, akyokye contrast lun light mode (srikasrak, filiya { $lightAttribute }="{ $lightColor }") ku ekulla color lun dark mode (srikasrak, filiya { $darkAttribute }="{ $darkColor }").
       *[none] In oasr contrast fal in dark mode, akyokye contrast lun light mode ku ekulla color ma tuku kac ke textColorDarkMode ac/ku backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Style definition { $styleNumber } fahkyuk ke color lun kas ma fal nu ke light mode, tusruktu color lun kas in dark mode ma tuku kac uh wangin contrast fal lain canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; enenu in { $threshold }:1 ku yohk liki). { $suggestion ->
        [available] In oasr contrast fal in dark mode, akyokye contrast lun light mode (srikasrak, filiya textColor="{ $lightColor }") ku ekulla color lun dark mode (srikasrak, filiya textColorDarkMode="{ $darkColor }").
       *[none] In oasr contrast fal in dark mode, akyokye contrast lun light mode ku ekulla color ma tuku kac ke textColorDarkMode.
    }

section-multiple-style-palettes = Sie tafu ku in sulela <stylePalette> sefanna; orekmakin ma safla.

## Unique variants

variant-num-to-select-not-non-negative-integer = tia ku in etu variant sefanna lun { $component } ke sripen numToSelect tia sie integer ma tia srik liki 0.

variant-num-to-select-not-constant-number = tia ku in etu variant sefanna lun { $component } ke sripen numToSelect tia sie number ma tia ekulla.

variant-with-replacement-not-constant-boolean = tia ku in etu variant sefanna lun { $component } ke sripen withReplacement tia sie boolean ma tia ekulla.

variant-select-weight-disables-unique = Variant sefanna lun select tia orekma fin oasr sie option ma fahkyuk selectWeight ku selectForVariants kac

variant-coprime-undetermined = tia ku in etu variant sefanna lun { $component } ke sripen tia ku in etu lah coprime uh tia pwaye pacl nukewa.

variant-attribute-not-constant = tia ku in etu variant sefanna lun { $component } ke sripen { $attribute } ekulla.

variant-attribute-not-number = tia ku in etu variant sefanna lun { $component } ke sripen { $attribute } tia sie number.

variant-attribute-wrong-type-for-sequence =
    tia ku in etu variant sefanna lun { $component } lun type { $type } ke sripen { $attribute } tia { $expected ->
        [letters-combination] sie ip in letter
        [math-expression] sie expression math ma fal
        [integer] sie integer
       *[number] sie number
    }.

variant-length-not-integer = tia ku in etu variant sefanna lun { $component } ke sripen length tia sie integer.

variant-sort-not-implemented = soenna orekla variant sefanna lun sie { $component } ma oasr sort kac

variant-exclude-combinations-not-implemented = soenna orekla variant sefanna lun sie { $component } ma oasr excludeCombinations kac

variant-math-exclude-not-implemented = soenna orekla variant sefanna lun sie { $component } lun type math ma oasr exclude kac

variant-non-constant-exclude-not-implemented = soenna orekla variant sefanna lun sie { $component } ma oasr exclude ma ekulla kac

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: tia orekmakinyuk in graph prefigure renderer; pilesrala.

prefigure-descendant-invalid-geometry = { $subject }: lumah tia safla ku tia oasr saflaiya; pilesrala.

prefigure-curve-label-omitted = { $subject }: ine tia orekmakinyuk fin curve ma ekuleyukla; pilesrala ine.

prefigure-curve-unsupported-definition-type = { $subject }: type lun definition lun curve '{ $definitionType }' tia orekmakinyuk; pilesrala.

prefigure-region-flip-functions-unsupported = { $subject }: attribute flipFunctions fin regionBetweenCurves tia orekmakinyuk; pilesrala.

prefigure-region-non-formula-child = { $subject }: function child lun type formula mukena orekmakinyuk fin regionBetweenCurves; pilesrala.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' tia orekmakinyuk nu ke { $labelKind ->
        [line-family] ine lun ma in sou lun line
       *[point] ine lun point
    }; orekmakin ouiyen PreFigure.

prefigure-fill-style-unsupported = { $subject }: fill style '{ $fillStyle }' tia orekmakinyuk sin PreFigure; orekmakin fill ma sessesla.

prefigure-line-style-unknown = { $subject }: line style '{ $lineStyle }' tia etu, pilesrala liki ma PreFigure orala.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker style '{ $markerStyle }' ekuleyukla nu ke style lun PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: marker style '{ $markerStyle }' tia orekmakinyuk sin PreFigure; orekmakin style se meet.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` tia fal; tia ku in konauk target. Pilesrala annotation.

annotation-ref-multiple-targets = `<annotation>`: `ref` fahsr nu ke target pus; orekmakin target se meet.

annotation-ref-outside-graph = `<annotation>`: `ref` tia fal; target oan likin graph se ma oan we. Pilesrala annotation.

annotation-ref-unsupported-target = `<annotation>`: `ref` tia fal; target tia sie ma fin graph ma orekmakinyuk ke ekulla nu ke prefigure. Pilesrala annotation.

annotation-text-missing = `<annotation>`: wangin `text` ku oalal; orala text oalal.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Koneyuk sie dependency ma raunla nu sifacna.
       *[other] Koneyuk sie dependency ma raunla nu sifacna ac oasr component `<{ $componentType }>` kac.
    }

reference-no-referent = Wangin ma koneyuk nu ke reference: `{ $reference }`

reference-multiple-referents = Ma pus koneyuk nu ke reference: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Lumah lun attribute { $attribute } lun `<{ $componentType }>` tia fal.

children-invalid = Child tia fal nu ke `<{ $componentType }>`: Koneyuk child ma tia fal: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Value `{ $value }` tia fal nu ke attribute `{ $attribute }`, orekmakin value `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Version { $version } lun DoenetML tia koneyuk.
       *[other] Version { $version } lun DoenetML tia koneyuk. Orekmakin version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML tia fal: { $content }

parse-tag-missing-close-tag = DoenetML tia fal: Wangin closing tag lun tag `{ $tag }`. Enenu in sie tag ma kaliya sifacna ku sie tag `</{ $tagName }>`.

parse-tag-error = DoenetML tia fal: Oasr tafongla in tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML tia fal: Attribute `{ $attribute }` tia fal, ac oana in wangin value kac.

parse-attribute-invalid = DoenetML tia fal: Attribute `{ $attribute }` tia fal

parse-attribute-value-invalid = DoenetML tia fal: Value lun attribute `{ $value }` tia fal

parse-attribute-value-quote-mismatch = DoenetML tia fal: Value lun attribute `{ $value }` tia fal. Quote luo uh tia fal nu sie sin sie. Ac oana in wangin sie `{ $quote }`

parse-open-tag-name-missing = DoenetML tia fal: Koneyuk sie tag ma wangin ine kac, oana `<`

parse-tag-not-closed = DoenetML tia fal: Tag `{ $tag }` tia kaliyuki (ac oana in wangin sie `>`).

parse-self-closing-tag-name-missing = DoenetML tia fal: Koneyuk sie tag ma wangin ine kac `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML tia fal: Tag `{ $tag }` tia kaliyuki (ac oana in wangin sie `/>`).

parse-tag-invalid-attributes = DoenetML tia fal: Tag `{ $tag }` tia fal. Sahp attribute kac tia suwohs.

parse-close-tag-name-missing = DoenetML tia fal: Koneyuk sie closing tag ma wangin ine kac, oana `</`

parse-attribute-value-unquoted = Value lun attribute enenu in oan inmasrlon quote: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML tia fal: Koneyuk closing tag `{ $tag }`, tusruktu wangin opening tag fal kac

parse-close-tag-mismatched = DoenetML tia fal: Closing tag tia fal. Enenu in `</{ $expected }>`. Koneyuk `{ $found }`

parser-node-unconvertible = Tia ku in ekulla node { $node } nu ke sie Dast node.

## Names

name-attribute-invalid =
    Attribute name='{ $name }' tia fal. { $reason ->
        [characters] Ine ku in oasr letter, number, underscore, ku hyphen mukena kac.
       *[start] Ine enenu in mutawauk ke sie letter.
    }

component-name-invalid-start = Ine lun component "{ $name }" tia fal. Ine enenu in mutawauk ke sie letter.

## `<answer>` sugar

answer-video-watched-missing-video = Sie answer lun type videoWatched enenu in oasr attribute video kac

answer-video-watched-video-not-reference = Sie answer lun type videoWatched enenu in oasr attribute video ma sie reference

answer-name-not-single-text = Attribute name lun answer enenu in oasr text child sefanna

## Referencing another document

external-doenetml-recursion-limit = Tia ku in eis DoenetML saya ke sripen fol pus liki. Ya oasr sie reference ma raunla nu sifacna?

external-doenetml-unavailable = Tia ku in eis DoenetML liki { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ma tuku liki { $attribute }="{ $uri }" tia fal: tia fal nu ke type lun component "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` tia sifil orekmakinyuk; orekmakin `{ $to }`.
       *[other] [deprecation] Attribute `{ $from }` fin `<{ $component }>` tia sifil orekmakinyuk; orekmakin `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` tia sifil orekmakinyuk ac pilesrala ke sripen `{ $to }` fahkyuk pac.
       *[other] [deprecation] Attribute `{ $from }` fin `<{ $component }>` tia sifil orekmakinyuk ac pilesrala ke sripen `{ $to }` fahkyuk pac.
    }

deprecated-attribute-ignored = [deprecation] Attribute `{ $attribute }` fin `<{ $component }>` tia sifil orekmakinyuk ac pilesrala.

deprecated-attribute-to-child = [deprecation] Attribute `{ $attribute }` fin `<{ $component }>` tia sifil orekmakinyuk; orekmakin sie `<{ $child }>` child.

deprecated-attribute-value-renamed = [deprecation] Value `{ $value }` lun attribute `{ $attribute }` fin `<{ $component }>` tia sifil orekmakinyuk; orekmakin `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` ku in oru plural ke kas Engles mukena, ke ma inge kas kac oan oana ma sim uh sim in sie document ma simla ke { $locale }. Sim lumah lun plural sifacna, ku filiya ke attribute `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` tia sie element lun Doenet ma etu.

schema-element-not-allowed-at-root = Element `<{ $tag }>` tia lela in oan ke acn lucng ke document.

schema-element-not-allowed-inside = Element `<{ $tag }>` tia lela in oan in `<{ $parent }>`.

schema-attribute-unrecognized = Wangin attribute ma inel pa `{ $attribute }` fin element `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribute `{ $attribute }` lun element `<{ $tag }>` enenu in sie list ma kais sie ip kac pa sie sin: { $allowed }
       *[other] Attribute `{ $attribute }` lun element `<{ $tag }>` enenu in sie sin: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ine lun variant lun select tia fal.  Ine lun variant { $variantName } sikyak in option { $numOptions } tusruktu lupan ma in sulela pa { $numToSelect }.

select-variant-name-without-options = Kutu variant fahkyuk nu ke select tusruktu wangin option fahkyuk nu ke ine lun variant se inge: { $variantName }.

select-variant-name-not-possible = Ine lun variant { $variantName } ma fahkyuk nu ke select tia sie ine lun variant ma ku in orek.

select-too-few-options = Tia ku in sulela component { $numToSelect } liki { $numOptions } mukena.

select-from-sequence-too-few-values = Tia ku in sulela value { $numToSelect } liki sie sequence ma lusa { $length }.

select-from-sequence-indices-count-mismatch = Lupan index ma fahkyuk nu ke select enenu in fal nu ke lupan ma in sulela

select-from-sequence-indices-not-integers = Index nukewa ma fahkyuk nu ke select enenu in integer

select-from-sequence-index-excluded = Index lun selectfromsequence ma fahkyuk uh sisila tari

select-from-sequence-indices-excluded-combination = Index lun selectfromsequence ma fahkyuk uh sie combination ma sisila tari

select-from-sequence-coprime-not-positive-integers = Tia ku in sulela combination coprime ke sripen tia sulela integer ma yohk liki 0.

select-from-sequence-coprime-common-factor = Tia ku in sulela number coprime. Value nukewa ma ku in orek uh oasr sie factor ma oana sie. (Value ma fahkyuk lun "from" ku "to" enenu in coprime nu ke "step".)

select-from-sequence-coprime-single-number = Tia ku in sulela combination coprime liki sie number sefanna ma tia 1.

select-from-sequence-excluded-too-many-combinations = Sisila yohk liki 70% ke combination in selectFromSequence

select-from-sequence-coprime-none-found = Tia ku in sulela number coprime. Value nukewa ma ku in orek uh oasr sie factor ma oana sie.

select-from-sequence-too-few-unique-values = Tia ku in sulela value sefanna { $numToSelect } liki sequence ma lusa { $numPossibleValues }

select-prime-numbers-too-few-values = Tia ku in sulela value { $numToSelect } liki sie list lun prime ma lusa { $numValues }

select-prime-numbers-values-count-mismatch = Lupan value ma fahkyuk nu ke select enenu in fal nu ke lupan ma in sulela

select-prime-numbers-values-not-prime = Value nukewa ma fahkyuk nu ke select prime number enenu in oan in list lun prime

select-prime-numbers-values-excluded-combination = Value lun selectPrimeNumbers ma fahkyuk uh sie combination ma sisila tari

select-prime-numbers-excluded-too-many-combinations = Sisila yohk liki 70% ke combination in selectPrimeNumbers

select-random-combination-fluke = Ke sie ouiya ma arulana pahtpat, tia ku in sulela sie combination lun value ma sulala ke wi

select-random-value-fluke = Ke sie ouiya ma arulana pahtpat, tia ku in sulela sie value ma sulala ke wi

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` tia orekla in math sac; expression sac simla oana meet liki input uh ku in oan loac. { $reason ->
        [not-inline] Sie choice input ma `inline` mukena pa ku in oan in sie expression; fin wangin `inline`, sie block in button pa el.
        [expanded] Sie text input ma `expanded` sie box ma oasr line pus kac, na yohk liki ma ku in oan in sie expression.
        [on-graph] Fin graph, expression sac orekla oana sie mwe akul sefanna, na wangin acn nu ke sie ma in oru.
       *[relative-width] `width` lal relative (sie percentage ku `em`), na wangin ma in srikeya nu kac in sie expression. Sang width sac ke lupa absolute, oana `px`.
    }
