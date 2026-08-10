# Dagbani diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] Bɛ chɛri { $attributes } di yi niŋ ka bɛ zaŋ nahigu pɔyint ayi
       *[other] Bɛ chɛri { $attributes } di yi niŋ ka bɛ zaŋ nahigu pɔyint ayi
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] Bɛ chɛri { $attributes } di yi niŋ ka bɛ zaŋ nahigu pɔyint ni sunsuuni pɔyint zaa
       *[other] Bɛ chɛri { $attributes } di yi niŋ ka bɛ zaŋ nahigu pɔyint ni sunsuuni pɔyint zaa
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset bi tumdi sunsuuni pɔyint yi ka ni

## `<line>`

line-points-undetermined-dimensions = Layin gari pɔyintnima din galim ka bɛ mi.

line-points-too-few-dimensions = Layin simdi ka di gari pɔyintnima din galim nyɛ ayi bee gari lala.

line-points-depend-on-variables = Layin gari pɔyintnima din dolsi binshɛŋa din taɣira: { $variables }.

line-equation-invalid-format = Layin ikweshɔn balli din bi tuhi binshɛŋa din taɣira { $variable1 } ni { $variable2 } ni.

## `<ray>`

ray-overprescribed-through = Bɛ zaŋ through, endpoint ni direction n-mali reyi maa.  Ti chɛrila through maa.

ray-dimension-mismatch = numDimensions bi tuhi reyi ni.

## `<vector>`

vector-overprescribed-head = Bɛ zaŋ head, tail ni displacement n-mali vɛktɔ maa.  Ti chɛrila head maa.

vector-dimension-mismatch = numDimensions bi tuhi vɛktɔ ni.

## Attracting and constraining

attract-to-without-nearest-point = Ti ku tooi vuui n-chaŋ `<{ $component }>` sani, dama di ka nearestPoint maka.

constrain-to-without-nearest-point = Ti ku tooi mɔŋ `<{ $component }>` zuɣu, dama di ka nearestPoint maka.

constrain-to-interior-without-nearest-point = Ti ku tooi mɔŋ `<{ $component }>` puuni, dama di ka nearestPoint maka.

## `<choiceInput>`

choice-input-label-position-ignored = Bɛ chɛrila labelPosition choiceInput din ka layin ni zuɣu

## Ordering children by index

choice-input-indices-count-mismatch = Ti chɛrila indices din be choiceInput zuɣu dama indices kalinli bi tuhi ni choice bihi kalinli.

pretzel-indices-count-mismatch = Ti chɛrila indices din be problem zuɣu dama indices kalinli bi tuhi ni problem bihi kalinli.

shuffle-indices-count-mismatch = Ti chɛrila indices din be shuffle zuɣu dama indices kalinli bi tuhi ni pirigilinima kalinli.

indices-ignored-out-of-range = Ti chɛrila indices din be { $component } zuɣu dama shɛŋa be yɛɣili maa yaaŋa.

pretzel-indices-repeated = Ti chɛrila indices din be pretzel zuɣu dama bɛ labsi shɛŋa yiŋŋa.

pretzel-circuit-first-index = Ti chɛrila indices din be pretzel zuɣu mode="circuit" ni dama din daŋ simdi ka di nyɛ 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ka `<{ $component }>` ni tum ni yɛtɔɣa bihi, bɛ simdi ka bɛ zaŋ `type` maka.

invalid-type-defaulting-to-math = Balli { $type } bi tuhi { $component } zuɣu. Di simdi ka di nyɛ math, text, number bee boolean. Ti labsirila math.

string-not-valid-component-to-arrange = Yɛtɔɣa "{ $value }" pala pirigili din tuhi { $component } zuɣu. Ti chɛri li.

## Types and variables

invalid-type-defaulting-to-number = Balli { $type } bi tuhi, ti zaŋdi balli maa n-niŋ number.

invalid-variable-value = Binshɛli din taɣira kalinli bi tuhi: `{ $value }`

## Variants

variant-index-must-be-number = Balli maka { $index } simdi ka di nyɛ kalinli

variant-index-must-be-integer = Balli maka { $index } simdi ka di nyɛ kalinli din pali

## `<sideBySide>`

side-by-side-absolute-widths = Bɛ na bi mali `<{ $component }>` ni tariga din bi taɣira. Ti zaŋdila yɛɣisim n-niŋ ŋmaŋŋa zuɣu.

side-by-side-absolute-margins = Bɛ na bi mali `<{ $component }>` ni tariga din bi taɣira. Ti zaŋdila nɔya n-niŋ ŋmaŋŋa zuɣu.

side-by-side-no-block-child = `<{ $component }>` bi tuhi: di simdi ka di mali pirigili biɛɣu kɔŋko.

## `<label>`

label-for-ignored-on-graphical = Bɛ chɛrila `for` maka ŋmahiŋga `<label>` zuɣu.

label-for-must-resolve-to-one = `for` maka `<label>` zuɣu simdi ka di wuhi pirigili yino kɔŋko.

label-for-unresolved = `for` maka `<label>` zuɣu ku tooi wuhi pirigili.

label-for-answer-with-authored-inputs = `for` maka `<label>` zuɣu wuhirila `<answer>` din mali kpɛhibunima sabira ni sabi shɛŋa; wuhimi kpɛhibu maa maŋa.

label-for-answer-without-input = `for` maka `<label>` zuɣu wuhirila `<answer>` din ka kpɛhibu ni bɛ ti li yuli.

label-for-must-reference-input-or-answer = `for` maka `<label>` zuɣu simdi ka di wuhi kpɛhibu bee lahabali.

## Accessibility

accessibility-short-description-or-decorative = Paabu zuɣu, `<{ $component }>` simdi ka di mali bachi bila bee ka bɛ zaŋ li n-niŋ nachinsi binshɛli.

accessibility-video-short-description = Paabu zuɣu, `<video>` simdi ka di mali bachi bila.

accessibility-input-short-description-or-label = Paabu zuɣu, `<{ $component }>` simdi ka di mali bachi bila bee yuli.

accessibility-answer-input-short-description-or-label = Paabu zuɣu, `<answer>` din mali kpɛhibu simdi ka di mali bachi bila bee yuli.

accessibility-short-description-contains-math = Bachi bihi bi simdi ka bɛ mali kalinli pirigilinima kaman `<{ $component }>`. Sabimi kalinli zaa ni yɛtɔɣa.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ka wolgibu din saɣindi pirigili zuɣuyuli yɛtɔɣa zuɣu (zibisim ni) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; di bɔri { $threshold }:1 bee gari lala).
       *[other] { $colorName } ka wolgibu din saɣindi pirigili zuɣuyuli yɛtɔɣa zuɣu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; di bɔri { $threshold }:1 bee gari lala).
    }

## `<circle>`

circle-through-points-non-numerical = Ti na bi mali `<circle>` din gari pɔyint { $count } pɔyintnima yi ka kalinli.

circle-too-many-through-points = Ti ku tooi kali gilli din gari pɔyint gari 3.

circle-overprescribed-radius-center-points = Ti ku tooi kali gilli din mali reyisi, sunsuuni luɣili ni pɔyintnima zaa.

circle-center-with-multiple-points = Ti ku tooi kali gilli din mali sunsuuni luɣili ka gari pɔyint gari 1.

circle-radius-too-small = Ti ku tooi kali gilli maa: pɔyint ayi maa sunsuuni katiŋ nyɛla { $distance }, ka reyisi { $radius } maa bila pam.

circle-radius-with-many-points = Ti ku tooi mali gilli din gari pɔyint gari ayi ka mali reyisi maa.

circle-invalid-center-or-through-points = Gilli sunsuuni luɣili bee di pɔyintnima bi tuhi.

circle-radius-center-with-multiple-points = Ti ku tooi kali gilli din mali sunsuuni luɣili reyisi ka gari pɔyint gari 1.

circle-change-radius-non-numerical = Ti ku tooi taɣi gilli din mali pɔyintnima din ka kalinli reyisi

circle-radius-with-points-non-numerical = Ti ku tooi mali gilli din gari pɔyint gari yino ka mali reyisi maa kalinli yi ka ni.

circle-change-center-non-numerical = Ti na bi mali gilli din gari pɔyintnima din ka kalinli sunsuuni luɣili taɣibu.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Galinsim bi saɣindi fɔnkshɔn luɣili zuɣu. Luɣili maa mali pirigili { $intervals } amaa fɔnkshɔn maa mali { $inputs ->
            [one] kpɛhibu { $inputs }
           *[other] kpɛhibu { $inputs }
        }.
       *[other] Galinsim bi saɣindi fɔnkshɔn luɣili zuɣu. Luɣili maa mali pirigilinima { $intervals } amaa fɔnkshɔn maa mali { $inputs ->
            [one] kpɛhibu { $inputs }
           *[other] kpɛhibu { $inputs }
        }.
    }

function-domain-invalid-format = Fɔnkshɔn luɣili balli bi tuhi.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ti chɛrila fɔnkshɔn zuɣusaa din ka kalinli.
        [minimum] Ti chɛrila fɔnkshɔn tiŋgbani din ka kalinli.
        [extremum] Ti chɛrila fɔnkshɔn nahigu din ka kalinli.
        [point] Ti chɛrila fɔnkshɔn pɔyint din ka kalinli.
        [slope] Ti chɛrila fɔnkshɔn gbaabu din ka kalinli.
       *[other] Ti chɛrila fɔnkshɔn { $type } din ka kalinli.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ti chɛrila fɔnkshɔn zuɣusaa din nyɛ zaɣim.
        [minimum] Ti chɛrila fɔnkshɔn tiŋgbani din nyɛ zaɣim.
        [extremum] Ti chɛrila fɔnkshɔn nahigu din nyɛ zaɣim.
        [point] Ti chɛrila fɔnkshɔn pɔyint din nyɛ zaɣim.
       *[other] Ti chɛrila fɔnkshɔn { $type } din nyɛ zaɣim.
    }

function-points-too-close = Fɔnkshɔn maa mali pɔyint ayi din miri taba pam. Ti ku tooi mali fɔnkshɔn.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Fɔnkshɔn labsibu tooi niŋdi mi kpɛhibu kalinli yi tuhi ni yihibu kalinli. Fɔnkshɔn ŋɔ mali kpɛhibu { $inputs } ni { $outputs ->
            [one] yihibu { $outputs }
           *[other] yihibu { $outputs }
        }.
       *[other] Fɔnkshɔn labsibu tooi niŋdi mi kpɛhibu kalinli yi tuhi ni yihibu kalinli. Fɔnkshɔn ŋɔ mali kpɛhibu { $inputs } ni { $outputs ->
            [one] yihibu { $outputs }
           *[other] yihibu { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Tarima woɣilim bi tuhi.  Di simdi ka di nyɛ kalinli din pali ka bi be zɛro tiŋgbani.

sequence-invalid-step = Tarima chandi bi tuhi.  Di simdi ka di nyɛ kalinli tarima din nyɛ balli { $type } zuɣu.

sequence-invalid-endpoint-number = Kalinli tarima "{ $attribute }" bi tuhi.  Di simdi ka di nyɛ kalinli.

sequence-invalid-endpoint-letters = Gbaŋ-maka tarima "{ $attribute }" bi tuhi.  Di simdi ka di nyɛ gbaŋ-maka laɣimbu.

sequence-invalid-endpoint = Tarima "{ $attribute }" bi tuhi.

select-from-sequence-coprime-not-numbers = Bɛ chɛ coprime dama bɛ bi piihi kalinli

select-from-sequence-coprime-with-exclude-combinations = Bɛ chɛ coprime dama bɛ zaŋ excludeCombinations

## Resolving a `target`

target-not-found = target bi tuhi `<{ $source }>` zuɣu: ti bi nya target.

target-state-variable-not-found = target bi tuhi `<{ $source }>` zuɣu: ti bi nya maka din yuli nyɛ "{ $property }" `<{ $component }>` zuɣu.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` binshɛŋa din taɣira simdi ka di ŋmalgi ni binshɛli din taɣira ka je.

ode-system-duplicate-variable-names = Ti ku tooi mali ODE RHS fɔnkshɔnnima din mali binshɛŋa din taɣira yula din labsi yiŋŋa.

ode-system-rhs-function-error = Ti ku tooi mali ODE RHS fɔnkshɔn.  Taali mathjs fɔnkshɔn maligu ni.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ti ku tooi mali kpaŋa layinnima { $count } sunsuuni

angle-invalid-through-point = Pɔyint din bi tuhi `<angle>` through ni

parabola-vertex-too-many-points = Ti na bi mali parabola din mali kpaŋa ka gari pɔyint gari 1.

parabola-too-many-points = Ti na bi mali parabola din gari pɔyint gari 3.

intersection-too-many-items = Ti na bi mali laɣimbu binshɛŋa gari ayi zuɣu

## Other math components

ionic-compound-not-two-ions = Ti na bi mali ayɔn laɣimbu binshɛli din pala ayɔn ayi zuɣu.

ionic-compound-needs-cation-and-anion = Bɛ mali ayɔn laɣimbu katiyɔn yini ni aniyɔn yini kɔŋko zuɣu.

solve-equations-cannot-evaluate = Ti ku tooi ŋmaai ikweshɔn maa dama ti ku tooi kali li: { $equation }

math-operators-operand-number-required = A simdi ka a zaŋ operandNumber a yi yihiri kalinli operand.

eigen-decomposition-failed = Ti ku tooi kali matrix eigenvalues

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametɛ { $parameters } ka pattern ni, dinzuɣu di ni tuhi ni zaɣim saha kam.
       *[other] `<matchesPattern>`: parametɛnima { $parameters } ka pattern ni, dinzuɣu bɛ ni tuhi ni zaɣim saha kam.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ti ku tooi baŋ grid="{ $grid }" gbinni. Di simdi ka di nyɛ none, medium, dense, bee kalinli viɛla ayi din wolgi ni luɣili, kaman grid="1 0.5". Bɛ ku mali grid.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" bi saɣindi prefigure wuhira ni; ti tumdila kaman nudirigu polo.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" bi saɣindi prefigure wuhira ni; ti tumdila kaman zuɣusaa polo.

prefigure-invalid-axis-bounds = `<graph>`: layin titali nɔya bi tuhi prefigure taɣibu zuɣu; ti tumdila ni bbox din daa be (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: yɛɣisim bi tuhi prefigure taɣibu zuɣu; ti tumdila ni ŋmahiŋga yɛɣisim din daa be 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio bi tuhi prefigure taɣibu zuɣu; ti tumdila ni ŋmaŋŋa din daa be 1.

prefigure-grid-spacing-too-fine = `<graph>`: grid sunsuuni bila pam layin titali nɔya zuɣu; bɛ ku mali grid prefigure wuhira ni.

prefigure-annotations-not-rendered = `<graph>`: bɛ ku mali bachinima PreFigure wuhira yi bi tumdi.

multiple-annotations-children = Bɛ nya `<annotations>` bihi pam `<graph>` ni; bɛ chɛrila zaa naɣila din nyaaŋa.

## Referring to other components

copy-unrecognized-component-type = Ti ku tooi yɛɣisi bee n-kopi pirigili balli bɛ ni bi mi: { $type }.

copy-prop-not-found = Ti bi nya prop { $property } pirigili din nyɛ balli { $component } zuɣu

collect-no-source = Bɛ bi nya collect yiŋgbani.

collect-invalid-component-type = Ti ku tooi laɣim pirigilinima din nyɛ balli `<{ $component }>` dama di nyɛla balli din bi tuhi.

reference-index-unavailable = Ti ku tooi wuhi maka `{ $reference }`

## `<callAction>`

component-action-unavailable = Ti ku tooi boli { $action } pirigili `{ $reference }` zuɣu

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Lahabali balli bi tuhi.  Layinnima mali woɣilim din bi tuhi taba. Bɛ nya li componentIdx :{ $componentIdx } ni

data-frame-duplicate-column-names = Lahabali mali kɔlum yula din labsi yiŋŋa.  Bɛ nya li componentIdx :{ $componentIdx } ni

data-frame-missing-column-name = Lahabali ka kɔlum yuli.  Bɛ nya li componentIdx :{ $componentIdx } ni

## `<answer>` and scoring

answer-award-depends-on-own-response = Lahabali ŋɔ pɔyintnima dolsirila tagi maŋa ni tim lahabali shɛli, ka dina ni tahi binshɛli din bi tuhi na.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` zaŋbu n-niŋ `<answer>` din be pirigili din mali `sectionWideCheckWork` ni bi tumdi shɛli, dama pirigili maa n-gbibi dihibu kalinli. Zaŋmi `maxNumAttempts` n-niŋ pirigili maa zuɣu.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` zaŋbu n-niŋ pirigili din mali `sectionWideCheckWork` din be pirigili shɛli din mali `sectionWideCheckWork` ni bi tumdi shɛli, dama yaaŋa pirigili maa n-gbibi dihibu kalinli. Zaŋmi `maxNumAttempts` n-niŋ yaaŋa pirigili maa zuɣu.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Maka { $attributes } ku tum shɛli symbolicEquality yi ka ni.
       *[other] Makanima { $attributes } ku tum shɛli symbolicEquality yi ka ni.
    }

answer-invalid-type = Lahabali balli din bi tuhi: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Dama pirigili `<{ $component }>` ka yuli, di ku tooi tum kaman module maka

module-attribute-name-already-defined = Pirigili `<{ $component } name="{ $name }">` ku tooi tum kaman module maka dama `<module>` balli pun mali maka "{ $name }".

conditional-content-condition-ignored = Bɛ chɛrila `condition` maka `<conditionalContent>` din mali case bee else bihi zuɣu.

slider-markers-type-mismatch = Makanima balli bi tuhi ni slider balli.

pretzel-problem-needs-statement-and-answer = pretzel bi tuhi: `<problem>` kam simdi ka di mali `<statement>` yini ni `<answer>` yini.

pretzel-circuit-first-problem-distractor = pretzel bi tuhi: mode="circuit" ni, `<problem>` din daŋ ku tooi nyɛ distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Kalinli din bi tuhi { $values } maka `{ $attribute }` zuɣu; ti chɛri li.
       *[other] Kalinli din bi tuhi { $values } maka `{ $attribute }` zuɣu; ti chɛri li.
    }

attribute-must-be-references = Kalinli `{ $value }` bi tuhi maka `{ $attribute }` zuɣu. Maka simdi ka bɛ mali li ni wuhibunima din piligi ni `$`.

math-input-invalid-function-names = <mathInput>: ti chɛ fɔnkshɔn yula din bi tuhi { $attribute } ni: { $names }. Yuli kam wuhibu pirigili simdi ka di mali gbaŋ-maka ayi bee gari lala (gbaŋ-maka bee dashi); a tooi pahirila `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Pirigili balli bi tuhi: `<{ $componentType }>`

attribute-repeated = Ti ku tooi labsi maka { $attribute } yiŋŋa.

attribute-invalid-for-component = Maka "{ $attribute }" bi tuhi pirigili din nyɛ balli `<{ $componentType }>` zuɣu.

## Style definition contrast

style-definition-insufficient-contrast =
    Balli { $styleNumber } bachi ka wolgibu din saɣindi { $context ->
        [text-on-background] yɛtɔɣa nyɔɣu nyaaŋa nyɔɣu zuɣu
        [high-contrast] wolgibu titali nyɔɣu gbaŋ zuɣu
        [line] layin nyɔɣu gbaŋ zuɣu
        [marker] maka nyɔɣu gbaŋ zuɣu
       *[text-on-canvas] yɛtɔɣa nyɔɣu gbaŋ zuɣu
    } zuɣu{ $mode ->
        [dark] { " (zibisim ni)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; di bɔri { $threshold }:1 bee gari lala).

style-definition-dark-mode-text-background-contrast =
    Hali ni balli { $styleNumber } bachi mali nyɔɣuri din tiri wolgibu din saɣindi neesim ni, zibisim nyɔɣuri din yi bɛ ni na ka wolgibu din saɣindi yɛtɔɣa nyɔɣu ni nyaaŋa nyɔɣu sunsuuni ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; di bɔri { $threshold }:1 bee gari lala). { $suggestion ->
        [available] Ka wolgibu ti saɣindi zibisim ni, pahimi neesim wolgibu (kotomsi, zaŋmi { $lightAttribute }="{ $lightColor }") bee a taɣi zibisim nyɔɣu maa (kotomsi, zaŋmi { $darkAttribute }="{ $darkColor }").
       *[none] Ka wolgibu ti saɣindi zibisim ni, pahimi neesim wolgibu bee a taɣi nyɔɣuri din yi bɛ ni na ni textColorDarkMode bee backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hali ni balli { $styleNumber } bachi mali yɛtɔɣa nyɔɣu din tiri wolgibu din saɣindi neesim ni, zibisim yɛtɔɣa nyɔɣu din yi di ni na ka wolgibu din saɣindi gbaŋ zuɣu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; di bɔri { $threshold }:1 bee gari lala). { $suggestion ->
        [available] Ka wolgibu ti saɣindi zibisim ni, pahimi neesim wolgibu (kotomsi, zaŋmi textColor="{ $lightColor }") bee a taɣi zibisim nyɔɣu maa (kotomsi, zaŋmi textColorDarkMode="{ $darkColor }").
       *[none] Ka wolgibu ti saɣindi zibisim ni, pahimi neesim wolgibu bee a taɣi nyɔɣu din yi di ni na ni textColorDarkMode.
    }

section-multiple-style-palettes = Pirigili tooi piihirila <stylePalette> yini kɔŋko; ti tumdila ni din nyaaŋa.

## Unique variants

variant-num-to-select-not-non-negative-integer = ti ku tooi baŋ { $component } balli din bi labsira dama numToSelect pala kalinli din pali ka bi be zɛro tiŋgbani.

variant-num-to-select-not-constant-number = ti ku tooi baŋ { $component } balli din bi labsira dama numToSelect pala kalinli din bi taɣira.

variant-with-replacement-not-constant-boolean = ti ku tooi baŋ { $component } balli din bi labsira dama withReplacement pala boolean din bi taɣira.

variant-select-weight-disables-unique = Bɛ mɔŋdila select balli din bi labsira piihibu yi mali selectWeight bee selectForVariants

variant-coprime-undetermined = ti ku tooi baŋ { $component } balli din bi labsira dama ti ku tooi baŋ ni coprime nyɛla false saha kam.

variant-attribute-not-constant = ti ku tooi baŋ { $component } balli din bi labsira dama { $attribute } taɣirami.

variant-attribute-not-number = ti ku tooi baŋ { $component } balli din bi labsira dama { $attribute } pala kalinli.

variant-attribute-wrong-type-for-sequence =
    ti ku tooi baŋ { $component } din nyɛ balli { $type } balli din bi labsira dama { $attribute } pala { $expected ->
        [letters-combination] gbaŋ-maka laɣimbu
        [math-expression] kalinli yɛtɔɣa din saɣi
        [integer] kalinli din pali
       *[number] kalinli
    }.

variant-length-not-integer = ti ku tooi baŋ { $component } balli din bi labsira dama length pala kalinli din pali.

variant-sort-not-implemented = ti na bi mali { $component } din mali sort balli din bi labsira

variant-exclude-combinations-not-implemented = ti na bi mali { $component } din mali excludeCombinations balli din bi labsira

variant-math-exclude-not-implemented = ti na bi mali { $component } din nyɛ balli math ka mali exclude balli din bi labsira

variant-non-constant-exclude-not-implemented = ti na bi mali { $component } din mali exclude din taɣira balli din bi labsira

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: bi saɣindi graph prefigure wuhira ni; bɛ chɛ bidibiga.

prefigure-descendant-invalid-geometry = { $subject }: luɣili balli ka nahigu bee di bi pali; bɛ chɛ bidibiga.

prefigure-curve-label-omitted = { $subject }: yula bi saɣindi kɔɔv din taɣi zuɣu; bɛ chɛ yuli maa.

prefigure-curve-unsupported-definition-type = { $subject }: kɔɔv bachi balli '{ $definitionType }' bi saɣindi; bɛ chɛ bidibiga.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions maka bi saɣindi regionBetweenCurves zuɣu; bɛ chɛ bidibiga.

prefigure-region-non-formula-child = { $subject }: bihi fɔnkshɔnnima din nyɛ balli formula kɔŋko n-saɣindi regionBetweenCurves zuɣu; bɛ chɛ bidibiga.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' bi saɣindi { $labelKind ->
        [line-family] layin dɔɣim yuli
       *[point] pɔyint yuli
    } zuɣu; ti tumdila ni PreFigure laɣimbu din daa be.

prefigure-fill-style-unsupported = { $subject }: palibu balli '{ $fillStyle }' bi saɣindi PreFigure zuɣu; ti labsirila palibu din kpɛma.

prefigure-line-style-unknown = { $subject }: layin balli bɛ ni bi mi '{ $lineStyle }' bɛ yihi li PreFigure yihibu ni.

prefigure-marker-style-mapped-to-diamond = { $subject }: maka balli '{ $markerStyle }' bɛ taɣi li n-niŋ PreFigure balli 'diamond'.

prefigure-marker-style-unsupported = { $subject }: maka balli '{ $markerStyle }' bi saɣindi PreFigure zuɣu; ti tumdila ni balli din daa be.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` bi tuhi; ti bi nya din di wuhira. Bɛ chɛ bachi maa.

annotation-ref-multiple-targets = `<annotation>`: `ref` wuhirila binshɛŋa pam; ti tumdila ni din daŋ.

annotation-ref-outside-graph = `<annotation>`: `ref` bi tuhi; din di wuhira be graph maa yaaŋa. Bɛ chɛ bachi maa.

annotation-ref-unsupported-target = `<annotation>`: `ref` bi tuhi; din di wuhira pala ŋmahiŋga binshɛli din saɣindi prefigure taɣibu ni. Bɛ chɛ bachi maa.

annotation-text-missing = `<annotation>`: `text` ka ni bee di nyɛ zaɣim; ti yihirila yɛtɔɣa zaɣim.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ti nya dolsibu din gili n-labsira.
       *[other] Ti nya dolsibu din gili n-labsira ni pirigili `<{ $componentType }>`.
    }

reference-no-referent = Bɛ bi nya shɛli wuhibu zuɣu: `{ $reference }`

reference-multiple-referents = Bɛ nya binshɛŋa pam wuhibu zuɣu: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` maka { $attribute } balli bi tuhi.

children-invalid = `<{ $componentType }>` bihi bi tuhi: Ti nya bihi din bi tuhi: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Kalinli `{ $value }` bi tuhi maka `{ $attribute }` zuɣu, ti tumdila ni kalinli `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Bɛ bi nya DoenetML balli { $version }.
       *[other] Bɛ bi nya DoenetML balli { $version }. Ti labsirila balli { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML din bi tuhi: { $content }

parse-tag-missing-close-tag = DoenetML din bi tuhi: Tagi `{ $tag }` ka yɔhibu tagi. Ti guhirila tagi din yɔhiri di maŋa bee tagi `</{ $tagName }>`.

parse-tag-error = DoenetML din bi tuhi: Taali tagi `<{ $tagName }>` ni

parse-attribute-missing-value = DoenetML din bi tuhi: Maka `{ $attribute }` din bi tuhi ŋmani kaman di ka kalinli.

parse-attribute-invalid = DoenetML din bi tuhi: Maka `{ $attribute }` bi tuhi

parse-attribute-value-invalid = DoenetML din bi tuhi: Maka kalinli `{ $value }` bi tuhi

parse-attribute-value-quote-mismatch = DoenetML din bi tuhi: Maka kalinli `{ $value }` bi tuhi. Yɛtɔɣa makanima bi tuhi taba. Di ŋmani kaman a ka `{ $quote }`

parse-open-tag-name-missing = DoenetML din bi tuhi: Ti nya tagi din ka yuli, kaman `<`

parse-tag-not-closed = DoenetML din bi tuhi: Bɛ bi yɔhi tagi `{ $tag }` (di ŋmani kaman `>` ka ni).

parse-self-closing-tag-name-missing = DoenetML din bi tuhi: Ti nya tagi din ka yuli `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML din bi tuhi: Bɛ bi yɔhi tagi `{ $tag }` (di ŋmani kaman `/>` ka ni).

parse-tag-invalid-attributes = DoenetML din bi tuhi: Tagi `{ $tag }` bi tuhi. Di tooi malila makanima din bi tuhi.

parse-close-tag-name-missing = DoenetML din bi tuhi: Ti nya yɔhibu tagi din ka yuli, kaman `</`

parse-attribute-value-unquoted = Bɛ simdi ka bɛ zaŋ maka kalinli niŋ yɛtɔɣa makanima ni: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML din bi tuhi: Ti nya yɔhibu tagi `{ $tag }`, amaa yoobu tagi din tuhi ka ni

parse-close-tag-mismatched = DoenetML din bi tuhi: Yɔhibu tagi bi tuhi. Ti guhirila `</{ $expected }>`. Ti nya `{ $found }`

parser-node-unconvertible = Ti ku tooi taɣi node { $node } n-niŋ Dast node.

## Names

name-attribute-invalid =
    Yuli name='{ $name }' bi tuhi. { $reason ->
        [characters] Yula tooi malila gbaŋ-maka, kalinli, tiŋgbani dashi bee dashi kɔŋko.
       *[start] Yula simdi ka di piligi ni gbaŋ-maka.
    }

component-name-invalid-start = Pirigili yuli "{ $name }" bi tuhi. Yula simdi ka di piligi ni gbaŋ-maka.

## `<answer>` sugar

answer-video-watched-missing-video = Lahabali din nyɛ balli videoWatched simdi ka di mali video maka

answer-video-watched-video-not-reference = Lahabali din nyɛ balli videoWatched simdi ka di mali video maka din nyɛ wuhibu

answer-name-not-single-text = Lahabali name maka simdi ka di mali yɛtɔɣa biɛɣu kɔŋko

## Referencing another document

external-doenetml-recursion-limit = Ti ku tooi nya yaaŋa DoenetML dama labsibu maa yɛɣi tariga. Wuhibu shɛli n-gili n-labsira?

external-doenetml-unavailable = Ti ku tooi nya DoenetML { $attribute }="{ $uri }" ni

external-doenetml-type-mismatch = DoenetML bɛ ni nya { $attribute }="{ $uri }" ni bi tuhi: di bi tuhi ni pirigili balli "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Bɛ ku lan tum ni maka `{ $from }`; tummi ni `{ $to }`.
       *[other] [deprecation] Bɛ ku lan tum ni maka `{ $from }` `<{ $component }>` zuɣu; tummi ni `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Bɛ ku lan tum ni maka `{ $from }` ka bɛ chɛri li dama bɛ zaŋ `{ $to }` gba.
       *[other] [deprecation] Bɛ ku lan tum ni maka `{ $from }` `<{ $component }>` zuɣu ka bɛ chɛri li dama bɛ zaŋ `{ $to }` gba.
    }

deprecated-attribute-ignored = [deprecation] Bɛ ku lan tum ni maka `{ $attribute }` `<{ $component }>` zuɣu ka bɛ chɛri li.

deprecated-attribute-to-child = [deprecation] Bɛ ku lan tum ni maka `{ $attribute }` `<{ $component }>` zuɣu; tummi ni biɛɣu `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Bɛ ku lan tum ni maka `{ $attribute }` kalinli `{ $value }` `<{ $component }>` zuɣu; tummi ni `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` tooi malila pam-yuli Silimiinsi ni kɔŋko, dinzuɣu di yɛtɔɣa kpalimdi mi kaman sabira ni sabi li shɛm gbaŋ din bɛ sabi { $locale } ni. Sabimi pam-yuli maa a maŋa, bee a zaŋ li niŋ `pluralForm` maka ni.


## Checking against the schema

schema-element-unrecognized = Pirigili `<{ $tag }>` pala Doenet pirigili bɛ ni mi.

schema-element-not-allowed-at-root = Bɛ bi saɣiri pirigili `<{ $tag }>` gbaŋ nyiŋgbaŋ zuɣu.

schema-element-not-allowed-inside = Bɛ bi saɣiri pirigili `<{ $tag }>` `<{ $parent }>` puuni.

schema-attribute-unrecognized = Pirigili `<{ $tag }>` ka maka din yuli nyɛ `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Pirigili `<{ $tag }>` maka `{ $attribute }` simdi ka di nyɛ tarima ka di binshɛŋa kam nyɛ yini ŋɔ ni: { $allowed }
       *[other] Pirigili `<{ $tag }>` maka `{ $attribute }` simdi ka di nyɛ yini ŋɔ ni: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select balli yuli bi tuhi.  Balli yuli { $variantName } be piihibu { $numOptions } ni amaa piihibu kalinli nyɛla { $numToSelect }.

select-variant-name-without-options = Bɛ zaŋ balli shɛŋa select zuɣu amaa bɛ bi zaŋ piihibu balli yuli din tooi be zuɣu: { $variantName }.

select-variant-name-not-possible = Balli yuli { $variantName } bɛ ni zaŋ select zuɣu pala balli yuli din tooi be.

select-too-few-options = Ti ku tooi piihi pirigilinima { $numToSelect } pirigilinima { $numOptions } kɔŋko ni.

select-from-sequence-too-few-values = Ti ku tooi piihi kalinli { $numToSelect } tarima din woɣilim nyɛ { $length } ni.

select-from-sequence-indices-count-mismatch = Indices kalinli bɛ ni zaŋ select zuɣu simdi ka di tuhi ni piihibu kalinli

select-from-sequence-indices-not-integers = Indices zaa bɛ ni zaŋ select zuɣu simdi ka di nyɛ kalinli din pali

select-from-sequence-index-excluded = Bɛ zaŋ selectfromsequence maka bɛ ni yihi

select-from-sequence-indices-excluded-combination = Bɛ zaŋ selectfromsequence indices din nyɛ laɣimbu bɛ ni yihi

select-from-sequence-coprime-not-positive-integers = Ti ku tooi piihi coprime laɣimbu dama bɛ bi piihiri kalinli viɛla din pali.

select-from-sequence-coprime-common-factor = Ti ku tooi piihi coprime kalinli. Kalinli zaa din tooi be mali faktɔ yini. (Kalinli bɛ ni zaŋ "from" bee "to" simdi ka di nyɛ coprime ni "step".)

select-from-sequence-coprime-single-number = Ti ku tooi piihi coprime laɣimbu kalinli yini din pala 1 ni.

select-from-sequence-excluded-too-many-combinations = Bɛ yihi laɣimbu din gari 70% selectFromSequence ni

select-from-sequence-coprime-none-found = Ti ku tooi piihi coprime kalinli. Kalinli zaa din tooi be mali faktɔ yini.

select-from-sequence-too-few-unique-values = Ti ku tooi piihi kalinli { $numToSelect } din bi labsira tarima din woɣilim nyɛ { $numPossibleValues } ni

select-prime-numbers-too-few-values = Ti ku tooi piihi kalinli { $numToSelect } prime kalinli tarima din woɣilim nyɛ { $numValues } ni

select-prime-numbers-values-count-mismatch = Kalinli kalinli bɛ ni zaŋ select zuɣu simdi ka di tuhi ni piihibu kalinli

select-prime-numbers-values-not-prime = Kalinli zaa bɛ ni zaŋ select prime number zuɣu simdi ka di be prime kalinli tarima ni

select-prime-numbers-values-excluded-combination = Kalinli bɛ ni zaŋ selectPrimeNumbers zuɣu nyɛla laɣimbu bɛ ni yihi

select-prime-numbers-excluded-too-many-combinations = Bɛ yihi laɣimbu din gari 70% selectPrimeNumbers ni

select-random-combination-fluke = Ni binshɛli din ku tooi niŋ pam, ti ku tooi piihi zaɣim kalinli laɣimbu

select-random-value-fluke = Ni binshɛli din ku tooi niŋ pam, ti ku tooi piihi zaɣim kalinli
