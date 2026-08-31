# Chiga (Rukiga) diagnostics: errors and warnings surfaced to the reader or
# author. Produced by the worker but addressed to whoever is looking at the
# screen, so these are selected by `uiLocale`, not `documentLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** As `chrome.ftl` sets it out: the shared
# Runyankore-Rukiga standard, `c` and not `ch` for /tʃ/, the augment written,
# Latin digits.
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`,
# `math`, `text`, `number`, `boolean` and the rest — are part of the language
# rather than prose, and stay in English exactly as written. So does the
# `[deprecation]` marker, and so does anything quoted back from the author's
# own source.
#
# **What is Rukiga here.** The frame every message is built on:
# «Tikirikubaasika …» for *cannot*, «nikirengwaho» / «Nitureengaho …» for
# *ignored* / *ignoring*, «kishemereire kuba» for *must be*, «tikirakozirwe»
# for *has not been implemented*, «tikiri kyo» / «tiri yo» for *invalid*
# (literally *it is not it*, with the concord of whatever is being talked
# about), «ahabw'okuba» for *because*, «kwonka» for *but*, «nari» for *or*,
# «omu mwanya gw'ekyo» for *instead*, «nibura» for *at least*, «obusa» for
# *empty*, «ekihabo» for an error. Native nouns doing real work: «omurongo»
# (a source line, a row, and the geometric line), «empagi» (a column),
# «eibara» (a name — the Kigezi word), «akadomo» (a point), «eriziga» (a
# circle), «enkona» (an angle), «omuhendo» (a value), «ekirikuhinduka» (a
# variable), «ekiranga» (an attribute), «ekicweka» (a component, a section, a
# piece), «orubaaho» (the canvas), «orukurikirana» (a sequence, a list).
#
# **What is borrowed, and from where.** **English**, because that is the
# register a Rukiga speaker does mathematics and computing in — Uganda teaches
# both in English from upper primary. The loans are kept openly rather than
# disguised: «fonkishoni», «vekita», «parabora», «matirikisi», «paramita»,
# «akisi», «enamba», «tagi», «node», «data», «index». Swahili is **not** the
# loan language here. Nothing below is an English word respelled to look
# Rukiga: where there was no word and no honest description, the sentence
# keeps the English identifier and describes around it.
#
# **Counts.** CLDR gives `cgg` its own plural data, with `one` and `other`.
# Rukiga marks number with a class prefix — «ekiranga» one attribute,
# «ebiranga» several; «omuhendo» one value, «emihendo» several — and the verb
# agrees with it, so both branches of every select differ in more than a
# suffix. `field-function-wrong-num-outputs` keeps the English `[one]`, since
# `cgg` really can select it.
#
# **Weakest here.** «okwegamira» for *slope* and «okutaana» for *contrast*
# are descriptions rather than established terms, and are the first two words
# a reviewer should attack. «orubaaho» for the drawing canvas is the third:
# it is the classroom blackboard, which is the right picture but may read as
# too concrete.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } neerengwaho obu obudomo bubiri bw'empera buba butairweho
       *[other] { $attributes } nibirengwaho obu obudomo bubiri bw'empera buba butairweho
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } neerengwaho obu akadomo k'empera n'ak'ahagati byombi biba bitairweho
       *[other] { $attributes } nibirengwaho obu akadomo k'empera n'ak'ahagati byombi biba bitairweho
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset tikirikukora kutaine kadomo ka hagati

## `<line>`

line-points-undetermined-dimensions = Omurongo nigucwa omu budomo bw'obugyereeranwa obutamanyirwe.

line-points-too-few-dimensions = Omurongo gushemereire kucwa omu budomo bw'obugyereeranwa nibura bubiri.

line-points-depend-on-variables = Omurongo nigucwa omu budomo oburikwesigama aha birikuhinduka: { $variables }.

line-equation-invalid-format = Enshoneka y'enkyangano y'omurongo omu birikuhinduka { $variable1 } na { $variable2 } tiri yo.

## `<ray>`

ray-overprescribed-through = Omurasho gutairweho na through, endpoint na direction.  Nitureengaho through eyatairweho.

ray-dimension-mismatch = numDimensions tirikuhikaana omu murasho.

## `<vector>`

vector-overprescribed-head = Vekita etairweho na head, tail na displacement.  Nitureengaho head eyatairweho.

vector-dimension-mismatch = numDimensions tirikuhikaana omuri vekita.

## Attracting and constraining

attract-to-without-nearest-point = Tikirikubaasika kukwega aha `<{ $component }>` ahabw'okuba etaine kiranga nearestPoint.

constrain-to-without-nearest-point = Tikirikubaasika kwemeza aha `<{ $component }>` ahabw'okuba etaine kiranga nearestPoint.

constrain-to-interior-without-nearest-point = Tikirikubaasika kwemeza omunda ya `<{ $component }>` ahabw'okuba etaine kiranga nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition neerengwaho aha choiceInput etari ya mu murongo

## Ordering children by index

choice-input-indices-count-mismatch = Nitureengaho indices ezatairweho aha choiceInput ahabw'okuba omubaro gwazo tigurikuhikaana n'omubaro gw'abaana ba choice.

pretzel-indices-count-mismatch = Nitureengaho indices ezatairweho aha problem ahabw'okuba omubaro gwazo tigurikuhikaana n'omubaro gw'abaana ba problem.

shuffle-indices-count-mismatch = Nitureengaho indices ezatairweho aha shuffle ahabw'okuba omubaro gwazo tigurikuhikaana n'omubaro gw'ebicweka.

indices-ignored-out-of-range = Nitureengaho indices ezatairweho aha { $component } ahabw'okuba ezimwe ziri aheeru y'orugyero.

pretzel-indices-repeated = Nitureengaho indices ezatairweho aha pretzel ahabw'okuba ezimwe zigarukiirwemu.

pretzel-circuit-first-index = Nitureengaho indices ezatairweho aha pretzel omuri mode="circuit" ahabw'okuba ey'okubanza eshemereire kuba 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Okubaasa `<{ $component }>` kukorana n'abaana b'ebigambo, ekiranga `type` kishemereire kutaho.

invalid-type-defaulting-to-math = Omuringo { $type } tigwo aha kicweka { $component }. Gushemereire kuba math, text, number nari boolean. Nitugaruka aha math.

string-not-valid-component-to-arrange = Ekigambo "{ $value }" ti kicweka kirikubaasika aha { $component }. Nitukireengaho.

## Types and variables

invalid-type-defaulting-to-number = Omuringo { $type } tigwo, nituta omuringo aha number.

invalid-variable-value = Omuhendo gw'ekirikuhinduka tigwo: `{ $value }`

## Variants

variant-index-must-be-number = Omubaro gw'omuringo { $index } gushemereire kuba enamba

variant-index-must-be-integer = Omubaro gw'omuringo { $index } gushemereire kuba enamba ehikire

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` tikirakozirwe aha bigyero ebihamire. Nituta obugyeya aha bugyereeranwa.

side-by-side-absolute-margins = `<{ $component }>` tikirakozirwe aha bigyero ebihamire. Nituta empera aha bugyereeranwa.

side-by-side-no-block-child = `<{ $component }>` tikiri kyo: kishemereire kugira nibura omwana omwe w'ekicweka.

## `<label>`

label-for-ignored-on-graphical = Ekiranga `for` aha `<label>` y'ekishushani nikirengwaho.

label-for-must-resolve-to-one = Ekiranga `for` aha `<label>` kishemereire kworeka ekicweka kimwe kyonka.

label-for-unresolved = Ekiranga `for` aha `<label>` tikibaasize kworeka ekicweka.

label-for-answer-with-authored-inputs = Ekiranga `for` aha `<label>` nikyoreka `<answer>` eine ebitairwemu ebyahandiikirwe omuhandiiki; oreke ekitairwemu kyonyini.

label-for-answer-without-input = Ekiranga `for` aha `<label>` nikyoreka `<answer>` etaine kitairwemu ky'okuha eibara.

label-for-must-reference-input-or-answer = Ekiranga `for` aha `<label>` kishemereire kworeka ekitairwemu nari eky'okugarukamu.

## Accessibility

accessibility-short-description-or-decorative = Ahabw'okuhikaho, `<{ $component }>` eshemereire kugira okushoboorora kukye nari kutaho nk'eky'okusiimisa.

accessibility-video-short-description = Ahabw'okuhikaho, `<video>` eshemereire kugira okushoboorora kukye.

accessibility-input-short-description-or-label = Ahabw'okuhikaho, `<{ $component }>` eshemereire kugira okushoboorora kukye nari eibara.

accessibility-answer-input-short-description-or-label = Ahabw'okuhikaho, `<answer>` erikukora ekitairwemu eshemereire kugira okushoboorora kukye nari eibara.

accessibility-short-description-contains-math = Okushoboorora kukye tikushemereire kugira ebicweka by'ebibaro nka `<{ $component }>`. Shoboorora ebibaro n'ebigambo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } teine kutaana kuhikire aha byahandiikirwe by'omutwe gw'ekicweka (omu ndeeba y'omwirima) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nihetengwa nibura { $threshold }:1).
       *[other] { $colorName } teine kutaana kuhikire aha byahandiikirwe by'omutwe gw'ekicweka ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nihetengwa nibura { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Tikirakozirwe `<circle>` erikucwa omu budomo { $count } obutaine mihendo y'enamba.

circle-too-many-through-points = Tikirikubaasika kubara eriziga erikucwa omu budomo burikukira aha bushatu.

circle-overprescribed-radius-center-points = Tikirikubaasika kubara eriziga eriine radius, omutima n'obudomo bw'okucwamu byona.

circle-center-with-multiple-points = Tikirikubaasika kubara eriziga eriine omutima erikucwa omu kadomo kakira aha kamwe.

circle-radius-too-small = Tikirikubaasika kubara eriziga: ahabw'okuba orugyendo hagati y'obudomo bubiri ni { $distance }, radius { $radius } eyatairweho ni nkye munonga.

circle-radius-with-many-points = Tikirikubaasika kukora eriziga erikucwa omu budomo bukira aha bubiri eriine radius eyatairweho.

circle-invalid-center-or-through-points = Omutima nari obudomo bw'okucwamu bw'eriziga tibiri byo.

circle-radius-center-with-multiple-points = Tikirikubaasika kubara radius y'eriziga eriine omutima erikucwa omu kadomo kakira aha kamwe.

circle-change-radius-non-numerical = Tikirikubaasika kuhindura radius y'eriziga eriine obudomo obutaine mihendo y'enamba

circle-radius-with-points-non-numerical = Tikirikubaasika kukora eriziga erikucwa omu kadomo kakira aha kamwe eriine radius eyatairweho obu emihendo y'enamba etariho.

circle-change-center-non-numerical = Tikirakozirwe kuhindura omutima gw'eriziga erikucwa omu budomo obutaine mihendo y'enamba.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Obugyereeranwa bwa domain ya fonkishoni tibumaziire. Domain eine ekicweka { $intervals } kwonka fonkishoni eine { $inputs ->
            [one] ekitairwemu { $inputs }
           *[other] ebitairwemu { $inputs }
        }.
       *[other] Obugyereeranwa bwa domain ya fonkishoni tibumaziire. Domain eine ebicweka { $intervals } kwonka fonkishoni eine { $inputs ->
            [one] ekitairwemu { $inputs }
           *[other] ebitairwemu { $inputs }
        }.
    }

function-domain-invalid-format = Enshoneka ya domain ya fonkishoni tiri yo.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Nitureengaho omuhendo gwa fonkishoni ogurikukira ogutari gwa namba.
        [minimum] Nitureengaho omuhendo gwa fonkishoni ogurikukyena ogutari gwa namba.
        [extremum] Nitureengaho omuhendo gwa fonkishoni ogw'aha mpera ogutari gwa namba.
        [point] Nitureengaho akadomo ka fonkishoni akatari ka namba.
        [slope] Nitureengaho okwegamira kwa fonkishoni okutari kwa namba.
       *[other] Nitureengaho { $type } ya fonkishoni etari ya namba.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Nitureengaho omuhendo gwa fonkishoni ogurikukira ogw'obusa.
        [minimum] Nitureengaho omuhendo gwa fonkishoni ogurikukyena ogw'obusa.
        [extremum] Nitureengaho omuhendo gwa fonkishoni ogw'aha mpera ogw'obusa.
        [point] Nitureengaho akadomo ka fonkishoni ak'obusa.
       *[other] Nitureengaho { $type } ya fonkishoni ey'obusa.
    }

function-points-too-close = Fonkishoni eine obudomo bubiri oburi haihi munonga. Tikirikubaasika kushoboorora fonkishoni.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Okugarukamu kwa fonkishoni nikubaasika obu omubaro gw'ebitairwemu gurikwingana n'ogw'ebirikuruga omu. Fonkishoni egi eine ekitairwemu { $inputs } na { $outputs ->
            [one] ekirikuruga { $outputs }
           *[other] ebirikuruga { $outputs }
        }.
       *[other] Okugarukamu kwa fonkishoni nikubaasika obu omubaro gw'ebitairwemu gurikwingana n'ogw'ebirikuruga omu. Fonkishoni egi eine ebitairwemu { $inputs } na { $outputs ->
            [one] ekirikuruga { $outputs }
           *[other] ebirikuruga { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Oburaingwa bw'orukurikirana tiburi bwo.  Bushemereire kuba enamba ehikire etari haansi ya zeero.

sequence-invalid-step = Entambi y'orukurikirana tiri yo.  Eshemereire kuba enamba aha rukurikirana rw'omuringo { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" y'orukurikirana rw'enamba tiri yo.  Eshemereire kuba enamba.

sequence-invalid-endpoint-letters = "{ $attribute }" y'orukurikirana rw'enyukuta tiri yo.  Eshemereire kuba enteeraniso y'enyukuta.

sequence-invalid-endpoint = "{ $attribute }" y'orukurikirana tiri yo.

select-from-sequence-coprime-not-numbers = coprime neerengwaho ahabw'okuba titurikutoorana namba

select-from-sequence-coprime-with-exclude-combinations = coprime neerengwaho ahabw'okuba excludeCombinations ekatahoho

## Resolving a `target`

target-not-found = Target ya `<{ $source }>` tiri yo: tikibaasize kushanga target.

target-state-variable-not-found = Target ya `<{ $source }>` tiri yo: tikibaasize kushanga ekirikuhinduka ekyetwa "{ $property }" aha `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Ebirikuhinduka bya `<odeSystem>` bishemereire kutaba nk'ekirikuhinduka ekyeyimirireho.

ode-system-duplicate-variable-names = Tikirikubaasika kushoboorora fonkishoni za ODE RHS ziine amabara g'ebirikuhinduka agarikugarukiramu.

ode-system-rhs-function-error = Tikirikubaasika kushoboorora fonkishoni ya ODE RHS.  Hariho ekihabo omu kukora fonkishoni ya mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Tikirikubaasika kushoboorora enkona hagati y'emirongo { $count }

angle-invalid-through-point = Akadomo aka through ka `<angle>` tikari ko

parabola-vertex-too-many-points = Tikirakozirwe parabora eine omutwe erikucwa omu kadomo kakira aha kamwe.

parabola-too-many-points = Tikirakozirwe parabora erikucwa omu budomo bukira aha bushatu.

intersection-too-many-items = Tikirakozirwe okusangana kw'ebintu birikukira aha bibiri

## Other math components

ionic-compound-not-two-ions = Tikirakozirwe enteeraniso y'ayoni etari ya yoni ibiri.

ionic-compound-needs-cation-and-anion = Enteeraniso y'ayoni ekozirwe aha katayoni emwe n'anayoni emwe zoonka.

solve-equations-cannot-evaluate = Tikirikubaasika kucwamu enkyangano ahabw'okuba tikibaasize kugigyereeranisa: { $equation }

math-operators-operand-number-required = Oshemereire kutaho operandNumber obu orikwiha operand y'ebibaro.

eigen-decomposition-failed = Tikibaasize kubara eigenvalues za matirikisi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: paramita { $parameters } terikubonekera omu nshoneka, n'ahabw'ekyo eryahikaana n'obusa buri kiro.
       *[other] `<matchesPattern>`: paramita { $parameters } tizirikubonekera omu nshoneka, n'ahabw'ekyo ziryahikaana n'obusa buri kiro.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: tikibaasize kwetegyereza grid="{ $grid }". Eshemereire kuba none, medium, dense, nari enamba ibiri ezirikukira aha zeero ezitaaniisibwe ahabwanya, nk'egi grid="1 0.5". Tihariho grid erikushushanwa.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` neetenga fonkishoni eine { $expected ->
        [one] ekirikuruga kimwe, okwegamira aha buri kadomo, nk'eki `y - x`
       *[other] ebirikuruga bibiri, vekita aha buri kadomo, nk'egi `(y, -x)`
    }, kwonka fonkishoni eyahairwe eine { $found ->
        [one] ekirikuruga { $found }
       *[other] ebirikuruga { $found }
    }. { $alternative ->
        [none] Tihariho ekirikushushanwa.
       *[other] `<{ $alternative }>` niyo kicweka kya fonkishoni egyo. Tihariho ekirikushushanwa.
    }

field-function-attribute-ignored-with-child = Ekiranga `function` nikirengwaho ahabw'okuba fonkishoni ekatahoho n'omunda y'ekicweka; ey'omunda niyo erikukoresibwa. Ha fonkishoni omu muringo gumwe gwonka.

field-variables-ignored =
    `<{ $component }>`: ekiranga `variables` nikyeta ebirikuhinduka by'ekyahandiikirwe ekiri omunda y'ekicweka. { $reason ->
        [function-child] Fonkishoni eri hanu ehairwe nk'omwana `<function>`, orikweta ebirikuhinduka byaayo, n'ahabw'ekyo `variables` neerengwaho.
       *[no-expression] Tihariho kyahandiikirwe nk'ekyo hanu, n'ahabw'ekyo `variables` neerengwaho.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" tikirikukorwaho omu mworeki wa prefigure; nituta ey'aha buryo.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" tikirikukorwaho omu mworeki wa prefigure; nituta ey'ahaiguru.

prefigure-invalid-axis-bounds = `<graph>`: empera za akisi tiziri zo ahabw'okuhindura kwa prefigure; nituta bbox ey'obwire bwona (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: obugyeya tiburi bwo ahabw'okuhindura kwa prefigure; nituta obugyeya bw'ekishushani obw'obwire bwona 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio tiri yo ahabw'okuhindura kwa prefigure; nituta aspect ratio ey'obwire bwona 1.

prefigure-grid-spacing-too-fine = `<graph>`: obwanya bwa grid ni bukye munonga ahabw'empera za akisi; grid neerengwaho omu mworeki wa prefigure.

prefigure-annotations-not-rendered = `<graph>`: annotations tiziryashushanwa obu otarikukoresa omworeki wa PreFigure.

multiple-annotations-children = Hashangirwe abaana `<annotations>` baingi omuri `<graph>`; boona kutariho ow'aha muheru nibarengwaho.

## Referring to other components

copy-unrecognized-component-type = Tikirikubaasika kwongyera nari kukopa omuringo gw'ekicweka ogutamanyirwe: { $type }.

copy-prop-not-found = Tikibaasize kushanga prop { $property } aha kicweka ky'omuringo { $component }

collect-no-source = Tihariho ensimburiro eshangirwe ya collect.

collect-invalid-component-type = Tikirikubaasika kwoorekana ebicweka by'omuringo `<{ $component }>` ahabw'okuba ogwo muringo tigwo.

reference-index-unavailable = Tikirikubaasika kworeka index `{ $reference }`

## `<callAction>`

component-action-unavailable = Tikirikubaasika kweta { $action } aha kicweka `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data eine enshoneka etari yo.  Emirongo eine oburaingwa oburikutaana. Kishangirwe omuri componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data eine amabara g'empagi agarikugarukiramu.  Kishangirwe omuri componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data ebuzireho eibara ry'empagi.  Kishangirwe omuri componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award y'eky'okugarukamu eki neesigama aha ky'okugarukamu kya answer yonyini, ekirikwija kureetera ebitatekateekirwe.

answer-max-num-attempts-in-section-wide-check-work = Okuta `maxNumAttempts` aha `<answer>` eri omunda y'ekicweka ekiine `sectionWideCheckWork` tikirikukora, ahabw'okuba omubaro gw'emirundi gurikutwarwa ekicweka. Ta `maxNumAttempts` aha kicweka.

nested-section-wide-check-work-max-num-attempts = Okuta `maxNumAttempts` aha kicweka kiine `sectionWideCheckWork` ekiri omunda y'ekindi kicweka kiine `sectionWideCheckWork` tikirikukora, ahabw'okuba omubaro gw'emirundi gurikutwarwa ekicweka eky'aheeru. Ta `maxNumAttempts` aha kicweka eky'aheeru.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Ekiranga { $attributes } tikiryakora symbolicEquality etatairweho.
       *[other] Ebiranga { $attributes } tibiryakora symbolicEquality etatairweho.
    }

answer-invalid-type = Omuringo gw'eky'okugarukamu tigwo: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ahabw'okuba ekicweka `<{ $component }>` tikiine eibara, tikirikubaasa kukoresibwa nk'ekiranga kya module

module-attribute-name-already-defined = Ekicweka `<{ $component } name="{ $name }">` tikirikubaasa kukoresibwa nk'ekiranga kya module ahabw'okuba ekicweka `<module>` kiine ekiranga "{ $name }" ekishoboororwa.

conditional-content-condition-ignored = Ekiranga `condition` nikirengwaho aha `<conditionalContent>` eine abaana ba case nari else.

slider-markers-type-mismatch = Omuringo gwa markers tigurikuhikaana n'ogwa slider.

pretzel-problem-needs-statement-and-answer = Pretzel tiri yo: buri `<problem>` eshemereire kugira `<statement>` emwe n'`<answer>` emwe.

pretzel-circuit-first-problem-distractor = Pretzel tiri yo: omuri mode="circuit", `<problem>` ey'okubanza teribaasa kuba distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Omuhendo { $values } gw'ekiranga `{ $attribute }` tigwo; nitugureengaho.
       *[other] Emihendo { $values } y'ekiranga `{ $attribute }` tiyo; nitugireengaho.
    }

attribute-must-be-references = Omuhendo `{ $value }` gw'ekiranga `{ $attribute }` tigwo. Ekiranga kishemereire kubaho ebyoreka ebirikutandika na `$`.

math-input-invalid-function-names = <mathInput>: hakarengwaho amabara ga fonkishoni agatari go omuri { $attribute }: { $names }. Buri ibara rishemereire kugira nibura obuhandiiko bubiri (enyukuta nari obukwato); nooyenda nowaayongyeraho `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Omuringo gw'ekicweka tigwo: `<{ $componentType }>`

attribute-repeated = Tikirikubaasika kugarukamu ekiranga { $attribute }.

attribute-invalid-for-component = Ekiranga "{ $attribute }" tikiri kya kicweka ky'omuringo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Enshoneka y'endeeba { $styleNumber } teine kutaana kuhikire aha { $context ->
        [text-on-background] rangi y'ebyahandiikirwe erikureeberwa aha rangi y'enyima
        [high-contrast] rangi y'okutaana kwingi erikureeberwa aha rubaaho
        [line] rangi y'omurongo erikureeberwa aha rubaaho
        [marker] rangi y'akamanyiso erikureeberwa aha rubaaho
       *[text-on-canvas] rangi y'ebyahandiikirwe erikureeberwa aha rubaaho
    }{ $mode ->
        [dark] { " (omu ndeeba y'omwirima)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nihetengwa nibura { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    N'obu enshoneka y'endeeba { $styleNumber } eine rangi ezirikutaana kuhikire omu ndeeba y'omushana, rangi z'omu ndeeba y'omwirima ezirugire omuriezo tiziine kutaana kuhikire aha rangi y'ebyahandiikirwe erikureeberwa aha rangi y'enyima ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nihetengwa nibura { $threshold }:1). { $suggestion ->
        [available] Okubaasa kugira okutaana kuhikire omu ndeeba y'omwirima, yongyera okutaana kw'omu ndeeba y'omushana (nk'ekyokureeberaho, ta { $lightAttribute }="{ $lightColor }") nari ohindure rangi y'omu ndeeba y'omwirima (nk'ekyokureeberaho, ta { $darkAttribute }="{ $darkColor }").
       *[none] Okubaasa kugira okutaana kuhikire omu ndeeba y'omwirima, yongyera okutaana kw'omu ndeeba y'omushana nari ohindure rangi ezirugiremu na textColorDarkMode na/nari backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    N'obu enshoneka y'endeeba { $styleNumber } eine rangi y'ebyahandiikirwe erikutaana kuhikire omu ndeeba y'omushana, rangi y'ebyahandiikirwe ey'omu ndeeba y'omwirima erugire omuriyo teine kutaana kuhikire aha rubaaho ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nihetengwa nibura { $threshold }:1). { $suggestion ->
        [available] Okubaasa kugira okutaana kuhikire omu ndeeba y'omwirima, yongyera okutaana kw'omu ndeeba y'omushana (nk'ekyokureeberaho, ta textColor="{ $lightColor }") nari ohindure rangi y'omu ndeeba y'omwirima (nk'ekyokureeberaho, ta textColorDarkMode="{ $darkColor }").
       *[none] Okubaasa kugira okutaana kuhikire omu ndeeba y'omwirima, yongyera okutaana kw'omu ndeeba y'omushana nari ohindure rangi erugiremu na textColorDarkMode.
    }

section-multiple-style-palettes = Ekicweka nikibaasa kutoorana <stylePalette> emwe yonka; nitukoresa ey'aha muheru.

## Unique variants

variant-num-to-select-not-non-negative-integer = tikirikubaasika kumanya emiringo etarikugarukiramu ya { $component } ahabw'okuba numToSelect tiri namba ehikire etari haansi ya zeero.

variant-num-to-select-not-constant-number = tikirikubaasika kumanya emiringo etarikugarukiramu ya { $component } ahabw'okuba numToSelect tiri namba ehamire.

variant-with-replacement-not-constant-boolean = tikirikubaasika kumanya emiringo etarikugarukiramu ya { $component } ahabw'okuba withReplacement tiri boolean ehamire.

variant-select-weight-disables-unique = Emiringo etarikugarukiramu ya select nezimwa obu haine ekitoorano kiine selectWeight nari selectForVariants ekitairweho

variant-coprime-undetermined = tikirikubaasika kumanya emiringo etarikugarukiramu ya { $component } ahabw'okuba tikirikubaasika kumanya ku coprime eri buri kiro etari yo.

variant-attribute-not-constant = tikirikubaasika kumanya emiringo etarikugarukiramu ya { $component } ahabw'okuba { $attribute } tehamire.

variant-attribute-not-number = tikirikubaasika kumanya emiringo etarikugarukiramu ya { $component } ahabw'okuba { $attribute } tiri namba.

variant-attribute-wrong-type-for-sequence =
    tikirikubaasika kumanya emiringo etarikugarukiramu ya { $component } ey'omuringo { $type } ahabw'okuba { $attribute } tiri { $expected ->
        [letters-combination] nteeraniso y'enyukuta
        [math-expression] kyahandiikirwe ky'ebibaro ekihikire
        [integer] namba ehikire
       *[number] namba
    }.

variant-length-not-integer = tikirikubaasika kumanya emiringo etarikugarukiramu ya { $component } ahabw'okuba length tiri namba ehikire.

variant-sort-not-implemented = tikirakozirwe kumanya emiringo etarikugarukiramu ya { $component } eine sort

variant-exclude-combinations-not-implemented = tikirakozirwe kumanya emiringo etarikugarukiramu ya { $component } eine excludeCombinations

variant-math-exclude-not-implemented = tikirakozirwe kumanya emiringo etarikugarukiramu ya { $component } ey'omuringo math eine exclude

variant-non-constant-exclude-not-implemented = tikirakozirwe kumanya emiringo etarikugarukiramu ya { $component } eine exclude etahamire

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: tikirikukorwaho omu mworeki wa prefigure gwa graph; omwana arengirweho.

prefigure-descendant-invalid-geometry = { $subject }: enshoneka teheza nari terikuhwera; omwana arengirweho.

prefigure-curve-label-omitted = { $subject }: amabara tigarikukorwaho aha mirongo egombire ehindwirwe; eibara ririkurengwaho.

prefigure-curve-unsupported-definition-type = { $subject }: omuringo gw'okushoboorora omurongo ogugombire '{ $definitionType }' tigurikukorwaho; omwana arengirweho.

prefigure-region-flip-functions-unsupported = { $subject }: ekiranga flipFunctions aha regionBetweenCurves tikirikukorwaho; omwana arengirweho.

prefigure-region-non-formula-child = { $subject }: aha regionBetweenCurves nihakorwaho fonkishoni z'omuringo gwa formula zoonka; omwana arengirweho.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' tirikukorwaho aha { $labelKind ->
        [line-family] ibara ry'eby'omurongo
       *[point] ibara ry'akadomo
    }; nituta enteekateeka ya PreFigure ey'obwire bwona.

prefigure-fill-style-unsupported = { $subject }: omuringo gw'okwijuza '{ $fillStyle }' tigurikukorwaho na PreFigure; nitugaruka aha kwijuza kuhamire.

prefigure-line-style-unknown = { $subject }: omuringo gw'omurongo '{ $lineStyle }' ogutamanyirwe gurengirweho omu birikuruga omuri PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: omuringo gw'akamanyiso '{ $markerStyle }' guhindwirwe omu muringo gwa PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: omuringo gw'akamanyiso '{ $markerStyle }' tigurikukorwaho na PreFigure; nituta ogw'obwire bwona.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` tiri yo; tikibaasize kushanga target. Annotation erengirweho.

annotation-ref-multiple-targets = `<annotation>`: `ref` ekoreka targets nyingi; nitukoresa ey'okubanza.

annotation-ref-outside-graph = `<annotation>`: `ref` tiri yo; target eri aheeru ya graph erikugitwariza. Annotation erengirweho.

annotation-ref-unsupported-target = `<annotation>`: `ref` tiri yo; target ti kintu ky'ekishushani ekirikukorwaho omu kuhindura kwa prefigure. Annotation erengirweho.

annotation-text-missing = `<annotation>`: `text` ebuzireho nari ni y'obusa; nituhamu ebigambo by'obusa.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Hashangirwe okwesigama okurikwezingurura.
       *[other] Hashangirwe okwesigama okurikwezingurura okurikutwariramu ekicweka `<{ $componentType }>`.
    }

reference-no-referent = Tihariho ekishangirwe aha kyoreka eki: `{ $reference }`

reference-multiple-referents = Hashangirwe ebintu bingi aha kyoreka eki: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Enshoneka y'ekiranga { $attribute } kya `<{ $componentType }>` tiri yo.

children-invalid = Abaana ba `<{ $componentType }>` tibari bo: hashangirwe abaana abatari bo: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Omuhendo `{ $value }` gw'ekiranga `{ $attribute }` tigwo, nitukoresa omuhendo `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Enshoneka ya DoenetML { $version } tishangirwe.
       *[other] Enshoneka ya DoenetML { $version } tishangirwe. Nitugaruka aha nshoneka { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML tiri yo: { $content }

parse-tag-missing-close-tag = DoenetML tiri yo: Tagi `{ $tag }` tiine tagi y'okugyigara. Hakaba haine tagi eyeegara nari tagi `</{ $tagName }>`.

parse-tag-error = DoenetML tiri yo: Hariho ekihabo omu tagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML tiri yo: Ekiranga `{ $attribute }` ekitari kyo nikireebeka nk'ekibuzireho omuhendo.

parse-attribute-invalid = DoenetML tiri yo: Ekiranga `{ $attribute }` tikiri kyo

parse-attribute-value-invalid = DoenetML tiri yo: Omuhendo gw'ekiranga `{ $value }` tigwo

parse-attribute-value-quote-mismatch = DoenetML tiri yo: Omuhendo gw'ekiranga `{ $value }` tigwo. Obumanyiso bw'okucwamu tiburikuhikaana. Nooshusha okuba obuzireho `{ $quote }`

parse-open-tag-name-missing = DoenetML tiri yo: Hashangirwe tagi etaine ibara, nk'egi `<`

parse-tag-not-closed = DoenetML tiri yo: Tagi `{ $tag }` tekaigazibwa (`>` neereebeka nk'ebuzireho).

parse-self-closing-tag-name-missing = DoenetML tiri yo: Hashangirwe tagi etaine ibara `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML tiri yo: Tagi `{ $tag }` tekaigazibwa (`/>` neereebeka nk'ebuzireho).

parse-tag-invalid-attributes = DoenetML tiri yo: Tagi `{ $tag }` tiri yo. Neebaasa kuba eine ebiranga ebitari byo.

parse-close-tag-name-missing = DoenetML tiri yo: Hashangirwe tagi y'okugara etaine ibara, nk'egi `</`

parse-attribute-value-unquoted = Emihendo y'ebiranga eshemereire kuba omu bumanyiso bw'okucwamu: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML tiri yo: Hashangirwe tagi y'okugara `{ $tag }`, kwonka tihariho tagi y'okwigura erikuhikaana nayo

parse-close-tag-mismatched = DoenetML tiri yo: Tagi y'okugara tirikuhikaana. Hakaba haine `</{ $expected }>`. Hashangirwe `{ $found }`

parser-node-unconvertible = Tikibaasize kuhindura node { $node } omu node ya Dast.

## Names

name-attribute-invalid =
    Eibara name='{ $name }' tiri ryo. { $reason ->
        [characters] Amabara nigabaasa kugira enyukuta, enamba, obukwato bw'ahansi nari obukwato bw'ahagati zoonka.
       *[start] Amabara gashemereire kutandika n'enyukuta.
    }

component-name-invalid-start = Eibara ry'ekicweka "{ $name }" tiri ryo. Amabara gashemereire kutandika n'enyukuta.

## `<answer>` sugar

answer-video-watched-missing-video = Answer y'omuringo videoWatched eshemereire kugira ekiranga video

answer-video-watched-video-not-reference = Answer y'omuringo videoWatched eshemereire kugira ekiranga video ekiri ekyoreka

answer-name-not-single-text = Ekiranga name kya answer kishemereire kugira omwana omwe w'ebigambo

## Referencing another document

external-doenetml-recursion-limit = Tikibaasize kwiha DoenetML y'aheeru ahabw'okwezingurura kwingi munonga. Hariho ekyoreka ekirikwezingurura?

external-doenetml-unavailable = Tikibaasize kwiha DoenetML aha { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML eyiihirwe aha { $attribute }="{ $uri }" tiri yo: tekahikaana n'omuringo gw'ekicweka "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ekiranga `{ $from }` tikikyakoresibwa; koresa `{ $to }`.
       *[other] [deprecation] Ekiranga `{ $from }` aha `<{ $component }>` tikikyakoresibwa; koresa `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ekiranga `{ $from }` tikikyakoresibwa kandi nikirengwaho ahabw'okuba `{ $to }` nayo etairweho.
       *[other] [deprecation] Ekiranga `{ $from }` aha `<{ $component }>` tikikyakoresibwa kandi nikirengwaho ahabw'okuba `{ $to }` nayo etairweho.
    }

deprecated-attribute-ignored = [deprecation] Ekiranga `{ $attribute }` aha `<{ $component }>` tikikyakoresibwa kandi nikirengwaho.

deprecated-attribute-to-child = [deprecation] Ekiranga `{ $attribute }` aha `<{ $component }>` tikikyakoresibwa; koresa omwana `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Omuhendo `{ $value }` gw'ekiranga `{ $attribute }` aha `<{ $component }>` tigukyakoresibwa; koresa `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` nebaasa kwongyera obwingi omu Rungyereza kwonka, n'ahabw'ekyo ebigambo byayo tibirikuhindurwa omu kitabo ekyahandiikirwe omu { $locale }. Handiika obwingi wenyini, nari obute n'ekiranga `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ekicweka `<{ $tag }>` ti kicweka kya Doenet ekimanyirwe.

schema-element-not-allowed-at-root = Ekicweka `<{ $tag }>` tikirikwikirizibwa aha musingye gw'ekitabo.

schema-element-not-allowed-inside = Ekicweka `<{ $tag }>` tikirikwikirizibwa omunda ya `<{ $parent }>`.

schema-attribute-unrecognized = Ekicweka `<{ $tag }>` tikiine kiranga kirikwetwa `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ekiranga `{ $attribute }` kya `<{ $tag }>` kishemereire kuba orukurikirana oruriine buri kintu kiri kimwe aha bi: { $allowed }
       *[other] Ekiranga `{ $attribute }` kya `<{ $tag }>` kishemereire kuba kimwe aha bi: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Eibara ry'omuringo rya select tiriri ryo.  Eibara ry'omuringo { $variantName } nirireeba omu bitoorano { $numOptions } kwonka omubaro gw'ebirikutooranwa ni { $numToSelect }.

select-variant-name-without-options = Emiringo emwe etairweho aha select kwonka tihariho bitoorano ebitairweho aha ibara ry'omuringo orikubaasika: { $variantName }.

select-variant-name-not-possible = Eibara ry'omuringo { $variantName } eryatairweho aha select tiriri ibara ry'omuringo orikubaasika.

select-too-few-options = Tikirikubaasika kutoorana ebicweka { $numToSelect } omu { $numOptions } byonka.

select-from-sequence-too-few-values = Tikirikubaasika kutoorana emihendo { $numToSelect } omu rukurikirana rw'oburaingwa { $length }.

select-from-sequence-indices-count-mismatch = Omubaro gwa indices ezatairweho aha select gushemereire kuhikaana n'omubaro gw'ebirikutooranwa

select-from-sequence-indices-not-integers = Indices zoona ezatairweho aha select zishemereire kuba enamba ezihikire

select-from-sequence-index-excluded = Index ya selectfromsequence eyatairweho ekaba erengirweho

select-from-sequence-indices-excluded-combination = Indices za selectfromsequence ezatairweho zikaba ziri enteeraniso erengirweho

select-from-sequence-coprime-not-positive-integers = Tikirikubaasika kutoorana enteeraniso za coprime ahabw'okuba titurikutoorana namba ezirikukira aha zeero.

select-from-sequence-coprime-common-factor = Tikirikubaasika kutoorana enamba za coprime. Emihendo yoona erikubaasika eine ekigyereeranisa kimwe. (Emihendo eyatairweho aha "from" nari "to" eshemereire kuba coprime na "step".)

select-from-sequence-coprime-single-number = Tikirikubaasika kutoorana enteeraniso za coprime omu namba emwe etari 1.

select-from-sequence-excluded-too-many-combinations = Hakarengwaho enteeraniso zirikukira aha 70% omuri selectFromSequence

select-from-sequence-coprime-none-found = Tikibaasize kutoorana enamba za coprime. Emihendo yoona erikubaasika eine ekigyereeranisa kimwe.

select-from-sequence-too-few-unique-values = Tikirikubaasika kutoorana emihendo { $numToSelect } etarikugarukiramu omu rukurikirana rw'oburaingwa { $numPossibleValues }

select-prime-numbers-too-few-values = Tikirikubaasika kutoorana emihendo { $numToSelect } omu rutonde rw'enamba za prime orw'oburaingwa { $numValues }

select-prime-numbers-values-count-mismatch = Omubaro gw'emihendo eyatairweho aha select gushemereire kuhikaana n'omubaro gw'ebirikutooranwa

select-prime-numbers-values-not-prime = Emihendo yoona eyatairweho aha select prime number eshemereire kuba omu rutonde rw'enamba za prime

select-prime-numbers-values-excluded-combination = Emihendo ya selectPrimeNumbers eyatairweho ekaba eri enteeraniso erengirweho

select-prime-numbers-excluded-too-many-combinations = Hakarengwaho enteeraniso zirikukira aha 70% omuri selectPrimeNumbers

select-random-combination-fluke = Aha mahwa g'obutabaasika, tikibaasize kutoorana enteeraniso y'emihendo etatekateekirwe

select-random-value-fluke = Aha mahwa g'obutabaasika, tikibaasize kutoorana omuhendo ogutatekateekirwe

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] `<{ $component }>` egi terikworekwa ahabw'okuba eri omunda y'ebibaro kandi ti `inline`. Ongyeraho `inline` ebone kuba orutonde rw'okucwamu, orurikutaaha omu kyahandiikirwe.
        [expanded] `<{ $component }>` egi terikworekwa ahabw'okuba eri omunda y'ebibaro kandi ni `expanded`. Ihaho `expanded`; akasanduuko k'emirongo mingi tikarikutaaha omu kyahandiikirwe.
        [on-graph] `<{ $component }>` egi terikworekwa ahabw'okuba eri omunda y'ebibaro ebishushanirwe aha graph, ahataine mwanya gw'ekitairwemu.
       *[relative-width] `<{ $component }>` egi terikworekwa ahabw'okuba eri omunda y'ebibaro kandi eine obugyeya obw'obugyereeranwa. Ha obugyeya omu bigyero ebihamire, nka `px`.
    }
