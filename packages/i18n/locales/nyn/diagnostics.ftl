# Nyankole diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] { $attributes } neerengwaho ku obudomo bubiri bw'empera burikuba butairweho
       *[other] { $attributes } neerengwaho ku obudomo bubiri bw'empera burikuba butairweho
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } neerengwaho ku akadomo k'empera n'ak'omu gati byombi birikuba bitairweho
       *[other] { $attributes } neerengwaho ku akadomo k'empera n'ak'omu gati byombi birikuba bitairweho
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset tirikukora kitaine kadomo k'omu gati

## `<line>`

line-points-undetermined-dimensions = Omurongo nigucwa omu budomo bw'obugyereeranwa obutamanyirwe.

line-points-too-few-dimensions = Omurongo gushemereire kucwa omu budomo bw'obugyereeranwa nibura bubiri.

line-points-depend-on-variables = Omurongo nigucwa omu budomo oburikwesigama aha birikuhinduka: { $variables }.

line-equation-invalid-format = Enshoneka etari yo y'enkyangano y'omurongo omu birikuhinduka { $variable1 } na { $variable2 }.

## `<ray>`

ray-overprescribed-through = Omurasho gutairweho na through, endpoint na direction.  Nitureengaho through eyatairweho.

ray-dimension-mismatch = numDimensions tirikuhikaana omu murasho.

## `<vector>`

vector-overprescribed-head = Vekita etairweho na head, tail na displacement.  Nitureengaho head eyatairweho.

vector-dimension-mismatch = numDimensions tirikuhikaana omuri vekita.

## Attracting and constraining

attract-to-without-nearest-point = Tikirikubaasika kukwega aha `<{ $component }>` ahakuba etaine kiranga nearestPoint.

constrain-to-without-nearest-point = Tikirikubaasika kwemeza aha `<{ $component }>` ahakuba etaine kiranga nearestPoint.

constrain-to-interior-without-nearest-point = Tikirikubaasika kwemeza omunda ya `<{ $component }>` ahakuba etaine kiranga nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition neerengwaho aha choiceInput etari ya mu murongo

## Ordering children by index

choice-input-indices-count-mismatch = Nitureengaho indices ezatairweho aha choiceInput ahakuba omubaro gw'indices gutarikuhikaana n'omubaro gw'abaana ba choice.

pretzel-indices-count-mismatch = Nitureengaho indices ezatairweho aha problem ahakuba omubaro gw'indices gutarikuhikaana n'omubaro gw'abaana ba problem.

shuffle-indices-count-mismatch = Nitureengaho indices ezatairweho aha shuffle ahakuba omubaro gw'indices gutarikuhikaana n'omubaro gw'ebicweka.

indices-ignored-out-of-range = Nitureengaho indices ezatairweho aha { $component } ahakuba ezimwe ziri aheeru y'orugyero.

pretzel-indices-repeated = Nitureengaho indices ezatairweho aha pretzel ahakuba ezimwe zigarukiirwemu.

pretzel-circuit-first-index = Nitureengaho indices ezatairweho aha pretzel omuri mode="circuit" ahakuba ey'okubanza eshemereire kuba 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Okubaasa `<{ $component }>` kukorana n'abaana b'ebigambo, ekiranga `type` kishemereire kutaho.

invalid-type-defaulting-to-math = Omuringo { $type } tigwo aha { $component }. Gushemereire kuba math, text, number nari boolean. Nitugaruka aha math.

string-not-valid-component-to-arrange = Ekigambo "{ $value }" ti kicweka kirikubaasika aha { $component }. Nitukireengaho.

## Types and variables

invalid-type-defaulting-to-number = Omuringo { $type } tigwo, nituta omuringo aha number.

invalid-variable-value = Omuhendo gw'ekirikuhinduka gutari gwo: `{ $value }`

## Variants

variant-index-must-be-number = Omubaro gw'omuringo { $index } gushemereire kuba enamba

variant-index-must-be-integer = Omubaro gw'omuringo { $index } gushemereire kuba enamba ehikire

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` tirakozirwe aha bigyero ebitarikuhinduka. Nituta obugyeya aha bugyereeranwa.

side-by-side-absolute-margins = `<{ $component }>` tirakozirwe aha bigyero ebitarikuhinduka. Nituta empera aha bugyereeranwa.

side-by-side-no-block-child = `<{ $component }>` etari yo: eshemereire kugira nibura omwana omwe w'ekicweka.

## `<label>`

label-for-ignored-on-graphical = Ekiranga `for` aha `<label>` y'ekishushani nikirengwaho.

label-for-must-resolve-to-one = Ekiranga `for` aha `<label>` kishemereire kworeka ekicweka kimwe kyonka.

label-for-unresolved = Ekiranga `for` aha `<label>` tikibaasize kworeka ekicweka.

label-for-answer-with-authored-inputs = Ekiranga `for` aha `<label>` nikyoreka `<answer>` eine ebitairwemu ebyahandiikirwe omuhandiiki; oreke ekitairwemu kyonyini.

label-for-answer-without-input = Ekiranga `for` aha `<label>` nikyoreka `<answer>` etaine kitairwemu ky'okwita eiziina.

label-for-must-reference-input-or-answer = Ekiranga `for` aha `<label>` kishemereire kworeka ekitairwemu nari eky'okugarukamu.

## Accessibility

accessibility-short-description-or-decorative = Ahabw'okuhikaho, `<{ $component }>` eshemereire kugira okushoboorora kukye nari kutaho nk'eky'okusiimisa.

accessibility-video-short-description = Ahabw'okuhikaho, `<video>` eshemereire kugira okushoboorora kukye.

accessibility-input-short-description-or-label = Ahabw'okuhikaho, `<{ $component }>` eshemereire kugira okushoboorora kukye nari eiziina.

accessibility-answer-input-short-description-or-label = Ahabw'okuhikaho, `<answer>` erikukora ekitairwemu eshemereire kugira okushoboorora kukye nari eiziina.

accessibility-short-description-contains-math = Okushoboorora kukye tikushemereire kugira ebicweka by'ebibaro nka `<{ $component }>`. Handiika ebibaro byona omu bigambo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } etaine kwahukana kuhikire aha bigambo by'omutwe gw'ekicweka (omu mwirima) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nikyetenga nibura { $threshold }:1).
       *[other] { $colorName } etaine kwahukana kuhikire aha bigambo by'omutwe gw'ekicweka ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nikyetenga nibura { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Titurakora `<circle>` erikucwa omu budomo { $count } ku obudomo burikuba butaine mihendo y'enamba.

circle-too-many-through-points = Tikirikubaasika kubara eriziga erikucwa omu budomo burikukira aha 3.

circle-overprescribed-radius-center-points = Tikirikubaasika kubara eriziga eriine radiyasi, omwanya gw'omu gati n'obudomo byona bitairweho.

circle-center-with-multiple-points = Tikirikubaasika kubara eriziga eriine omwanya gw'omu gati nirikucwa omu kadomo kakiraho 1.

circle-radius-too-small = Tikirikubaasika kubara eriziga: ahakuba omuhanda ahagati y'obudomo bubiri guri { $distance }, radiyasi { $radius } etairweho ni nkye munonga.

circle-radius-with-many-points = Tikirikubaasika kukora eriziga erikucwa omu budomo burikukira aha bubiri riine radiyasi etairweho.

circle-invalid-center-or-through-points = Omwanya gw'omu gati nari obudomo bw'eriziga tibiri byo.

circle-radius-center-with-multiple-points = Tikirikubaasika kubara radiyasi y'eriziga eriine omwanya gw'omu gati nirikucwa omu kadomo kakiraho 1.

circle-change-radius-non-numerical = Tikirikubaasika kuhindura radiyasi y'eriziga eriine obudomo butaine namba

circle-radius-with-points-non-numerical = Tikirikubaasika kukora eriziga erikucwa omu kadomo kakiraho kamwe riine radiyasi etairweho ku hataine mihendo y'enamba.

circle-change-center-non-numerical = Titurakora kuhindura omwanya gw'omu gati gw'eriziga erikucwa omu budomo butaine namba.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Obugyereeranwa tiburikuhika aha kicweka kya fonkishoni. Ekicweka kiine orubaju { $intervals } kwonka fonkishoni eine { $inputs ->
            [one] ebitairwemu { $inputs }
           *[other] ebitairwemu { $inputs }
        }.
       *[other] Obugyereeranwa tiburikuhika aha kicweka kya fonkishoni. Ekicweka kiine embaju { $intervals } kwonka fonkishoni eine { $inputs ->
            [one] ebitairwemu { $inputs }
           *[other] ebitairwemu { $inputs }
        }.
    }

function-domain-invalid-format = Enshoneka etari yo y'ekicweka kya fonkishoni.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Nitureengaho eky'ahaiguru munonga ekitaine namba ekya fonkishoni.
        [minimum] Nitureengaho eky'ahansi munonga ekitaine namba ekya fonkishoni.
        [extremum] Nitureengaho empera etaine namba ya fonkishoni.
        [point] Nitureengaho akadomo kataine namba aka fonkishoni.
        [slope] Nitureengaho okuserekera okutaine namba okwa fonkishoni.
       *[other] Nitureengaho { $type } etaine namba ya fonkishoni.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Nitureengaho eky'ahaiguru munonga eky'obusa ekya fonkishoni.
        [minimum] Nitureengaho eky'ahansi munonga eky'obusa ekya fonkishoni.
        [extremum] Nitureengaho empera y'obusa ya fonkishoni.
        [point] Nitureengaho akadomo k'obusa aka fonkishoni.
       *[other] Nitureengaho { $type } y'obusa ya fonkishoni.
    }

function-points-too-close = Fonkishoni eine obudomo bubiri buri haihi munonga. Tikirikubaasika kutaho fonkishoni.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Okugarukamu kwa fonkishoni nikubaasika kwonka ku omubaro gw'ebitairwemu gurikuhikaana n'omubaro gw'ebirikuruga. Fonkishoni egi eine ebitairwemu { $inputs } na { $outputs ->
            [one] ebirikuruga { $outputs }
           *[other] ebirikuruga { $outputs }
        }.
       *[other] Okugarukamu kwa fonkishoni nikubaasika kwonka ku omubaro gw'ebitairwemu gurikuhikaana n'omubaro gw'ebirikuruga. Fonkishoni egi eine ebitairwemu { $inputs } na { $outputs ->
            [one] ebirikuruga { $outputs }
           *[other] ebirikuruga { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Oburaingwa bw'orukurikirana tiburi bwo.  Bushemereire kuba enamba ehikire etari ahansi ya zeero.

sequence-invalid-step = Entambi y'orukurikirana tiyo.  Eshemereire kuba enamba aha rukurikirana rw'omuringo { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" y'orukurikirana rw'enamba tiyo.  Eshemereire kuba enamba.

sequence-invalid-endpoint-letters = "{ $attribute }" y'orukurikirana rw'ebibaruzo tiyo.  Eshemereire kuba enteeraniso y'ebibaruzo.

sequence-invalid-endpoint = "{ $attribute }" y'orukurikirana tiyo.

select-from-sequence-coprime-not-numbers = coprime erengiirweho ahakuba tihariho namba ezirikutooranwa

select-from-sequence-coprime-with-exclude-combinations = coprime erengiirweho ahakuba excludeCombinations etairweho

## Resolving a `target`

target-not-found = target etari yo aha `<{ $source }>`: tituzire kushanga target.

target-state-variable-not-found = target etari yo aha `<{ $source }>`: tituzire kushanga ekiranga ekyetwa "{ $property }" aha `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Ebirikuhinduka bya `<odeSystem>` bishemereire kwahukana n'ekirikuhinduka eky'obwesigye.

ode-system-duplicate-variable-names = Tikirikubaasika kutaho fonkishoni za ODE RHS ziine amaziina g'ebirikuhinduka agagarukiirwemu.

ode-system-rhs-function-error = Tikirikubaasika kutaho fonkishoni ya ODE RHS.  Ekihabo omu kukora fonkishoni ya mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Tikirikubaasika kutaho enguuti ahagati y'emirongo { $count }

angle-invalid-through-point = Akadomo katari ko omuri through ya `<angle>`

parabola-vertex-too-many-points = Titurakora parabora eine enguuti erikucwa omu kadomo kakiraho 1.

parabola-too-many-points = Titurakora parabora erikucwa omu budomo burikukira aha 3.

intersection-too-many-items = Titurakora okuhurira aha bintu birikukira aha bibiri

## Other math components

ionic-compound-not-two-ions = Titurakora enteeraniso y'ayoni aha kintu ekitari ayoni ibiri.

ionic-compound-needs-cation-and-anion = Enteeraniso y'ayoni ekozirwe kwonka aha katiyoni emwe na aniyoni emwe.

solve-equations-cannot-evaluate = Tikirikubaasika kucwa enkyangano ahakuba etabaasize kubarwa: { $equation }

math-operators-operand-number-required = Oshemereire kutaho operandNumber ku orikwiha operand y'ebibaro.

eigen-decomposition-failed = Tituzire kubaasa kubara eigenvalues za matriki

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameta { $parameters } terikushangwa omuri pattern, n'ahabw'ekyo neija kuguma ehikaine n'obusa.
       *[other] `<matchesPattern>`: parameta { $parameters } tizirikushangwa omuri pattern, n'ahabw'ekyo nizija kuguma zihikaine n'obusa.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: tikirikubaasika kwetegyereza grid="{ $grid }". Eshemereire kuba none, medium, dense, nari enamba ibiri nungi ezaahukanisiibwe omwanya, nka grid="1 0.5". Tihariho rusenga rurikushushanwa.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" terikwikirizibwa omu mworeki prefigure; nitukoresa emiringo y'oruhande rwa buryo.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" terikwikirizibwa omu mworeki prefigure; nitukoresa emiringo y'ahaiguru.

prefigure-invalid-axis-bounds = `<graph>`: empera z'omugyendo tiziri zo aha kuhindura kwa prefigure; nitukoresa bbox ey'obwire bwona (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: obugyeya tiburi bwo aha kuhindura kwa prefigure; nitukoresa obugyeya bw'ekishushani obw'obwire bwona 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio tiyo aha kuhindura kwa prefigure; nitukoresa ekigyero eky'obwire bwona 1.

prefigure-grid-spacing-too-fine = `<graph>`: omwanya gw'orusenga ni mukye munonga aha mpera z'omugyendo; orusenga tirurikushushanwa omu mworeki prefigure.

prefigure-annotations-not-rendered = `<graph>`: ebishoboororo tibirikushushanwa ku otarikukoresa omworeki PreFigure.

multiple-annotations-children = Abaana `<annotations>` baingi bashangirwe omuri `<graph>`; boona kwihaho ow'aha muheru barengiirweho.

## Referring to other components

copy-unrecognized-component-type = Tikirikubaasika kwongyera nari kukopa omuringo gw'ekicweka ogutamanyirwe: { $type }.

copy-prop-not-found = Tituzire kushanga prop { $property } aha kicweka ky'omuringo { $component }

collect-no-source = Tihariho nsimbo eshangirwe ya collect.

collect-invalid-component-type = Tikirikubaasika kwoteeranisa ebicweka by'omuringo `<{ $component }>` ahakuba guri omuringo gutari gwo.

reference-index-unavailable = Tikirikubaasika kworeka omubaro `{ $reference }`

## `<callAction>`

component-action-unavailable = Tikirikubaasika kweta { $action } aha kicweka `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ebirikuruga biine enshoneka etari yo.  Emirongo eine oburaingwa obutarikuhikaana. Bishangirwe omuri componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Ebirikuruga biine amaziina g'empagi agagarukiirwemu.  Bishangirwe omuri componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ebirikuruga bibuzireho eiziina ry'empagi.  Bishangirwe omuri componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Amanota g'eky'okugarukamu eki gashingiire aha kigarukiibwemu tagi yonyini eyohereize, ekyo nikija kureetera ebintu kutagyenda gye.

answer-max-num-attempts-in-section-wide-check-work = Okuta `maxNumAttempts` aha `<answer>` eri omu kicweka kiine `sectionWideCheckWork` tikiine ky'okumara, ahakuba omubaro gw'okugyezaho gurikwehebwa ekicweka. Ta `maxNumAttempts` aha kicweka.

nested-section-wide-check-work-max-num-attempts = Okuta `maxNumAttempts` aha kicweka kiine `sectionWideCheckWork` kiri omu kindi kicweka kiine `sectionWideCheckWork` tikiine ky'okumara, ahakuba omubaro gw'okugyezaho gurikwehebwa ekicweka eky'aheeru. Ta `maxNumAttempts` aha kicweka eky'aheeru.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Ekiranga { $attributes } tikiine ky'okumara symbolicEquality etataireho.
       *[other] Ebiranga { $attributes } tibiine ky'okumara symbolicEquality etataireho.
    }

answer-invalid-type = Omuringo gutari gwo gw'eky'okugarukamu: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ahakuba ekicweka `<{ $component }>` kitaine eiziina, tikirikubaasa kukoreswa nk'ekiranga kya module

module-attribute-name-already-defined = Ekicweka `<{ $component } name="{ $name }">` tikirikubaasa kukoreswa nk'ekiranga kya module ahakuba omuringo `<module>` gwine ekiranga "{ $name }" ekiriho.

conditional-content-condition-ignored = Ekiranga `condition` nikirengwaho aha `<conditionalContent>` eine abaana ba case nari else.

slider-markers-type-mismatch = Omuringo gw'ebimanyiso tigurikuhikaana n'omuringo gwa slider.

pretzel-problem-needs-statement-and-answer = pretzel etari yo: buri `<problem>` eshemereire kugira `<statement>` emwe na `<answer>` emwe.

pretzel-circuit-first-problem-distractor = pretzel etari yo: omuri mode="circuit", `<problem>` ey'okubanza terikubaasa kuba distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Omuhendo gutari gwo { $values } aha kiranga `{ $attribute }`; nitugurengaho.
       *[other] Emihendo etari yo { $values } aha kiranga `{ $attribute }`; nituyirengaho.
    }

attribute-must-be-references = Omuhendo `{ $value }` gutari gwo aha kiranga `{ $attribute }`. Ekiranga kishemereire kuba kikozirwe ebyoreka ebirikutandika na `$`.

math-input-invalid-function-names = <mathInput>: turengiireho amaziina ga fonkishoni agatari go omuri { $attribute }: { $names }. Ekicweka ekirikworekwa ekya buri iziina kishemereire kugira nibura ebibaruzo 2 (ebibaruzo nari obukoni); nooba noobaasa kwongyeraho `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Omuringo gw'ekicweka gutari gwo: `<{ $componentType }>`

attribute-repeated = Tikirikubaasika kugarukamu ekiranga { $attribute }.

attribute-invalid-for-component = Ekiranga "{ $attribute }" tikirikushemerera ekicweka ky'omuringo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Okushoboorora omuringo { $styleNumber } tikwine kwahukana kuhikire aha { $context ->
        [text-on-background] rangi y'ebigambo aha rangi y'omu nyima
        [high-contrast] rangi erikwahukana munonga aha kibaho
        [line] rangi y'omurongo aha kibaho
        [marker] rangi y'ekimanyiso aha kibaho
       *[text-on-canvas] rangi y'ebigambo aha kibaho
    }{ $mode ->
        [dark] { " (omu mwirima)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nikyetenga nibura { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    N'obu okushoboorora omuringo { $styleNumber } kwine rangi ezirikuha okwahukana kuhikire omu musana, rangi z'omu mwirima ezirikuruga omuriyo tiziine kwahukana kuhikire ahagati ya rangi y'ebigambo na rangi y'omu nyima ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nikyetenga nibura { $threshold }:1). { $suggestion ->
        [available] Okubaasa kugira okwahukana kuhikire omu mwirima, yongyera okwahukana kw'omu musana (nk'eky'okureeberaho, ta { $lightAttribute }="{ $lightColor }") nari ohindure rangi y'omu mwirima (nk'eky'okureeberaho, ta { $darkAttribute }="{ $darkColor }").
       *[none] Okubaasa kugira okwahukana kuhikire omu mwirima, yongyera okwahukana kw'omu musana nari ohindure rangi ezirikuruga oku okoresa textColorDarkMode nari backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    N'obu okushoboorora omuringo { $styleNumber } kwine rangi y'ebigambo erikuha okwahukana kuhikire omu musana, rangi y'ebigambo ey'omu mwirima erikuruga omuriyo tiyine kwahukana kuhikire aha kibaho ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nikyetenga nibura { $threshold }:1). { $suggestion ->
        [available] Okubaasa kugira okwahukana kuhikire omu mwirima, yongyera okwahukana kw'omu musana (nk'eky'okureeberaho, ta textColor="{ $lightColor }") nari ohindure rangi y'omu mwirima (nk'eky'okureeberaho, ta textColorDarkMode="{ $darkColor }").
       *[none] Okubaasa kugira okwahukana kuhikire omu mwirima, yongyera okwahukana kw'omu musana nari ohindure rangi erikuruga oku okoresa textColorDarkMode.
    }

section-multiple-style-palettes = Ekicweka nikibaasa kutoorana <stylePalette> emwe yonka; nitukoresa ey'aha muheru.

## Unique variants

variant-num-to-select-not-non-negative-integer = tikirikubaasika kumanya emiringo etarikugarukamu ya { $component } ahakuba numToSelect etari namba ehikire etari ahansi ya zeero.

variant-num-to-select-not-constant-number = tikirikubaasika kumanya emiringo etarikugarukamu ya { $component } ahakuba numToSelect etari namba etarikuhinduka.

variant-with-replacement-not-constant-boolean = tikirikubaasika kumanya emiringo etarikugarukamu ya { $component } ahakuba withReplacement etari boolean etarikuhinduka.

variant-select-weight-disables-unique = Emiringo etarikugarukamu ya select nehagarikwa ku hariho entoorano eine selectWeight nari selectForVariants

variant-coprime-undetermined = tikirikubaasika kumanya emiringo etarikugarukamu ya { $component } ahakuba titurikumanya ku coprime eguma eri false.

variant-attribute-not-constant = tikirikubaasika kumanya emiringo etarikugarukamu ya { $component } ahakuba { $attribute } neehinduka.

variant-attribute-not-number = tikirikubaasika kumanya emiringo etarikugarukamu ya { $component } ahakuba { $attribute } etari namba.

variant-attribute-wrong-type-for-sequence =
    tikirikubaasika kumanya emiringo etarikugarukamu ya { $component } ey'omuringo { $type } ahakuba { $attribute } etari { $expected ->
        [letters-combination] enteeraniso y'ebibaruzo
        [math-expression] ekigambo ky'ebibaro ekikirizibwe
        [integer] enamba ehikire
       *[number] enamba
    }.

variant-length-not-integer = tikirikubaasika kumanya emiringo etarikugarukamu ya { $component } ahakuba length etari namba ehikire.

variant-sort-not-implemented = titurakora emiringo etarikugarukamu ya { $component } eine sort

variant-exclude-combinations-not-implemented = titurakora emiringo etarikugarukamu ya { $component } eine excludeCombinations

variant-math-exclude-not-implemented = titurakora emiringo etarikugarukamu ya { $component } ey'omuringo math eine exclude

variant-non-constant-exclude-not-implemented = titurakora emiringo etarikugarukamu ya { $component } eine exclude erikuhinduka

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: terikwikirizibwa omu mworeki prefigure gwa graph; oruzaarwa rurengiirweho.

prefigure-descendant-invalid-geometry = { $subject }: enshoneka y'omwanya etaine mpera nari etahikire; oruzaarwa rurengiirweho.

prefigure-curve-label-omitted = { $subject }: amaziina tigarikwikirizibwa aha mirongo egombire ehinduriirwe; eiziina rirengiirweho.

prefigure-curve-unsupported-definition-type = { $subject }: omuringo gw'okushoboorora omurongo ogugombire '{ $definitionType }' tigurikwikirizibwa; oruzaarwa rurengiirweho.

prefigure-region-flip-functions-unsupported = { $subject }: ekiranga flipFunctions tikirikwikirizibwa aha regionBetweenCurves; oruzaarwa rurengiirweho.

prefigure-region-non-formula-child = { $subject }: ni fonkishoni z'abaana ez'omuringo formula zonka ezirikwikirizibwa aha regionBetweenCurves; oruzaarwa rurengiirweho.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' terikwikirizibwa aha { $labelKind ->
        [line-family] iziina ry'eka y'emirongo
       *[point] iziina ry'akadomo
    }; nitukoresa okuteeraniza kwa PreFigure okw'obwire bwona.

prefigure-fill-style-unsupported = { $subject }: omuringo gw'okwijuza '{ $fillStyle }' tigurikwikirizibwa PreFigure; nitugaruka aha kwijuza okuhamire.

prefigure-line-style-unknown = { $subject }: omuringo gw'omurongo ogutamanyirwe '{ $lineStyle }' gwihirweho omu birikuruga bya PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: omuringo gw'ekimanyiso '{ $markerStyle }' guhinduriirwe omuringo gwa PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: omuringo gw'ekimanyiso '{ $markerStyle }' tigurikwikirizibwa PreFigure; nitukoresa omuringo ogw'obwire bwona.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` etari yo; tituzire kushanga eki erikworeka. Ekishoboororo kirengiirweho.

annotation-ref-multiple-targets = `<annotation>`: `ref` yoreka ebintu bingi; nitukoresa eky'okubanza.

annotation-ref-outside-graph = `<annotation>`: `ref` etari yo; eki erikworeka kiri aheeru ya graph erimu. Ekishoboororo kirengiirweho.

annotation-ref-unsupported-target = `<annotation>`: `ref` etari yo; eki erikworeka ti kintu ky'ekishushani ekyikirizibwe omu kuhindura kwa prefigure. Ekishoboororo kirengiirweho.

annotation-text-missing = `<annotation>`: `text` ebuzireho nari y'obusa; nituruga n'ebigambo by'obusa.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Twashanga okwesigama okurikuzunguruka.
       *[other] Twashanga okwesigama okurikuzunguruka okurimu ekicweka `<{ $componentType }>`.
    }

reference-no-referent = Tihariho ekishangirwe aha kyoreka: `{ $reference }`

reference-multiple-referents = Ebintu bingi bishangirwe aha kyoreka: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Enshoneka etari yo y'ekiranga { $attribute } kya `<{ $componentType }>`.

children-invalid = Abaana batari bo ba `<{ $componentType }>`: Twashanga abaana batari bo: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Omuhendo `{ $value }` gutari gwo aha kiranga `{ $attribute }`, nitukoresa omuhendo `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Enshoneka ya DoenetML { $version } tishangirwe.
       *[other] Enshoneka ya DoenetML { $version } tishangirwe. Nitugaruka aha nshoneka { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML etari yo: { $content }

parse-tag-missing-close-tag = DoenetML etari yo: Tagi `{ $tag }` etaine tagi erikwigara. Tukaba nitwetenga tagi erikwigara yonyini nari tagi `</{ $tagName }>`.

parse-tag-error = DoenetML etari yo: Ekihabo omuri tagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML etari yo: Ekiranga `{ $attribute }` ekitari kyo nikishusha nk'ekibuzireho omuhendo.

parse-attribute-invalid = DoenetML etari yo: Ekiranga `{ $attribute }` tikiri kyo

parse-attribute-value-invalid = DoenetML etari yo: Omuhendo gw'ekiranga `{ $value }` tiguri gwo

parse-attribute-value-quote-mismatch = DoenetML etari yo: Omuhendo gw'ekiranga `{ $value }` tiguri gwo. Obumanyiso bw'ebigambo tiburikuhikaana. Nikishusha nk'obuzireho `{ $quote }`

parse-open-tag-name-missing = DoenetML etari yo: Twashanga tagi etaine iziina, nka `<`

parse-tag-not-closed = DoenetML etari yo: Tagi `{ $tag }` tiyaigairwe (nikishusha nk'ahu `>` ebuzireho).

parse-self-closing-tag-name-missing = DoenetML etari yo: Twashanga tagi etaine iziina `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML etari yo: Tagi `{ $tag }` tiyaigairwe (nikishusha nk'ahu `/>` ebuzireho).

parse-tag-invalid-attributes = DoenetML etari yo: Tagi `{ $tag }` tiyo. Nebaasa kuba eine ebiranga ebitari byo.

parse-close-tag-name-missing = DoenetML etari yo: Twashanga tagi erikwigara etaine iziina, nka `</`

parse-attribute-value-unquoted = Emihendo y'ebiranga eshemereire kutwarwa omu bumanyiso bw'ebigambo: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML etari yo: Twashanga tagi erikwigara `{ $tag }`, kwonka tihariho tagi erikwigura erikuhikaana

parse-close-tag-mismatched = DoenetML etari yo: Tagi erikwigara tirikuhikaana. Tukaba nitwetenga `</{ $expected }>`. Twashanga `{ $found }`

parser-node-unconvertible = Tituzire kubaasa kuhindura node { $node } omuri node ya Dast.

## Names

name-attribute-invalid =
    Eiziina name='{ $name }' tiriri ryo. { $reason ->
        [characters] Amaziina nigabaasa kugira ebibaruzo, enamba, obukoni bw'ahansi nari obukoni bwonka.
       *[start] Amaziina gashemereire kutandika n'ekibaruzo.
    }

component-name-invalid-start = Eiziina ry'ekicweka "{ $name }" tiriri ryo. Amaziina gashemereire kutandika n'ekibaruzo.

## `<answer>` sugar

answer-video-watched-missing-video = Eky'okugarukamu ky'omuringo videoWatched kishemereire kugira ekiranga video

answer-video-watched-video-not-reference = Eky'okugarukamu ky'omuringo videoWatched kishemereire kugira ekiranga video ekiri ekyoreka

answer-name-not-single-text = Ekiranga name ky'eky'okugarukamu kishemereire kugira omwana omwe w'ebigambo

## Referencing another document

external-doenetml-recursion-limit = Tituzire kubaasa kutunga DoenetML ey'aheeru ahabw'emirundi mingi munonga y'okugarukamu. Hariho ekyoreka ekirikuzunguruka?

external-doenetml-unavailable = Tituzire kubaasa kutunga DoenetML aha { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML etungirwe aha { $attribute }="{ $uri }" tiyo: tiyahikaanire n'omuringo gw'ekicweka "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ekiranga `{ $from }` tikirikukoreswa; koresa `{ $to }`.
       *[other] [deprecation] Ekiranga `{ $from }` aha `<{ $component }>` tikirikukoreswa; koresa `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ekiranga `{ $from }` tikirikukoreswa kandi nikirengwaho ahakuba `{ $to }` nayo etairweho.
       *[other] [deprecation] Ekiranga `{ $from }` aha `<{ $component }>` tikirikukoreswa kandi nikirengwaho ahakuba `{ $to }` nayo etairweho.
    }

deprecated-attribute-ignored = [deprecation] Ekiranga `{ $attribute }` aha `<{ $component }>` tikirikukoreswa kandi nikirengwaho.

deprecated-attribute-to-child = [deprecation] Ekiranga `{ $attribute }` aha `<{ $component }>` tikirikukoreswa; koresa omwana `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Omuhendo `{ $value }` gw'ekiranga `{ $attribute }` aha `<{ $component }>` tigurikukoreswa; koresa `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` nebaasa kukora obwingi omu Rungyereza kwonka, n'ahabw'ekyo ebigambo byayo nibiguma nk'oku omuhandiiki yaabihandiikire omu kitabo ekihandiikirwe omuri { $locale }. Handiika obwingi obwawe, nari obute n'ekiranga `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ekicweka `<{ $tag }>` ti kicweka kya Doenet ekimanyirwe.

schema-element-not-allowed-at-root = Ekicweka `<{ $tag }>` tikirikwikirizibwa aha muzi gw'ekitabo.

schema-element-not-allowed-inside = Ekicweka `<{ $tag }>` tikirikwikirizibwa omunda ya `<{ $parent }>`.

schema-attribute-unrecognized = Ekicweka `<{ $tag }>` tikiine kiranga ekyetwa `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ekiranga `{ $attribute }` ky'ekicweka `<{ $tag }>` kishemereire kuba orukurikirana orwine ebintu buri kimwe kiri kimwe aha: { $allowed }
       *[other] Ekiranga `{ $attribute }` ky'ekicweka `<{ $tag }>` kishemereire kuba kimwe aha: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Eiziina ry'omuringo tiriri ryo aha select.  Eiziina ry'omuringo { $variantName } nirishangwa omu ntoorano { $numOptions } kwonka omubaro gw'okutoorana ni { $numToSelect }.

select-variant-name-without-options = Emiringo emwe etairweho aha select kwonka tihariho ntoorano etairweho aha iziina ry'omuringo orikubaasika: { $variantName }.

select-variant-name-not-possible = Eiziina ry'omuringo { $variantName } eryatairweho aha select ti iziina ry'omuringo orikubaasika.

select-too-few-options = Tikirikubaasika kutoorana ebicweka { $numToSelect } omu bicweka { $numOptions } byonka.

select-from-sequence-too-few-values = Tikirikubaasika kutoorana emihendo { $numToSelect } omu rukurikirana rw'oburaingwa { $length }.

select-from-sequence-indices-count-mismatch = Omubaro gw'indices ezatairweho aha select gushemereire kuhikaana n'omubaro gw'okutoorana

select-from-sequence-indices-not-integers = Indices zoona ezatairweho aha select zishemereire kuba enamba ezihikire

select-from-sequence-index-excluded = Omubaro ogwatairweho ogwa selectfromsequence gukaba gwihirweho

select-from-sequence-indices-excluded-combination = Indices ezatairweho eza selectfromsequence zikaba ziri enteeraniso eyihirweho

select-from-sequence-coprime-not-positive-integers = Tikirikubaasika kutoorana enteeraniso za coprime ahakuba tihariho namba nungi ezihikire ezirikutooranwa.

select-from-sequence-coprime-common-factor = Tikirikubaasika kutoorana enamba za coprime. Emihendo yoona erikubaasika eine ekibaro kimwe. (Emihendo eyatairweho ya "from" nari "to" eshemereire kuba coprime na "step".)

select-from-sequence-coprime-single-number = Tikirikubaasika kutoorana enteeraniso za coprime omu namba emwe etari 1.

select-from-sequence-excluded-too-many-combinations = Twihireho enteeraniso ezirikukira aha 70% omuri selectFromSequence

select-from-sequence-coprime-none-found = Tituzire kubaasa kutoorana enamba za coprime. Emihendo yoona erikubaasika eine ekibaro kimwe.

select-from-sequence-too-few-unique-values = Tikirikubaasika kutoorana emihendo { $numToSelect } etarikugarukamu omu rukurikirana rw'oburaingwa { $numPossibleValues }

select-prime-numbers-too-few-values = Tikirikubaasika kutoorana emihendo { $numToSelect } omu rutonde rw'enamba za prime orw'oburaingwa { $numValues }

select-prime-numbers-values-count-mismatch = Omubaro gw'emihendo eyatairweho aha select gushemereire kuhikaana n'omubaro gw'okutoorana

select-prime-numbers-values-not-prime = Emihendo yoona eyatairweho aha select prime number eshemereire kuba omu rutonde rw'enamba za prime

select-prime-numbers-values-excluded-combination = Emihendo eyatairweho eya selectPrimeNumbers ekaba eri enteeraniso eyihirweho

select-prime-numbers-excluded-too-many-combinations = Twihireho enteeraniso ezirikukira aha 70% omuri selectPrimeNumbers

select-random-combination-fluke = Ahabw'ekintu ekitarikubaasika munonga, tituzire kubaasa kutoorana enteeraniso y'emihendo y'obutamanya

select-random-value-fluke = Ahabw'ekintu ekitarikubaasika munonga, tituzire kubaasa kutoorana omuhendo gw'obutamanya
