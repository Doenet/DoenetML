# Chichewa diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
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
# Where English separates a singular from a plural only in the verb, the
# Chichewa verb takes its subject concord from the noun class rather than from
# the count, so those selects are dropped and the count argument goes unused.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } zimanyalanyazidwa pamene mfundo ziwiri zotsiriza zafotokozedwa

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } zimanyalanyazidwa pamene mfundo yotsiriza ndi mfundo yapakati zonse zafotokozedwa

line-segment-midpoint-offset-without-midpoint = midpointOffset ilibe phindu popanda mfundo yapakati

## `<line>`

line-points-undetermined-dimensions = Mzere umadutsa pa mfundo zomwe miyeso yake sikudziwika.

line-points-too-few-dimensions = Mzere uyenera kudutsa pa mfundo zokhala ndi miyeso iwiri osachepera.

line-points-depend-on-variables = Mzere umadutsa pa mfundo zomwe zimadalira zosintha: { $variables }.

line-equation-invalid-format = Mawonekedwe olakwika a fanizo la mzere mu zosintha { $variable1 } ndi { $variable2 }.

## `<ray>`

ray-overprescribed-through = Cheza chafotokozedwa ndi through, endpoint ndi direction nthawi imodzi. through yofotokozedwayo ikunyalanyazidwa.

ray-dimension-mismatch = numDimensions sikugwirizana mu cheza.

## `<vector>`

vector-overprescribed-head = Vekitala yafotokozedwa ndi head, tail ndi displacement nthawi imodzi. head yofotokozedwayo ikunyalanyazidwa.

vector-dimension-mismatch = numDimensions sikugwirizana mu vekitala.

## Attracting and constraining

attract-to-without-nearest-point = Sizingatheke kukoka ku `<{ $component }>` chifukwa ilibe chosintha cha mkhalidwe chotchedwa nearestPoint.

constrain-to-without-nearest-point = Sizingatheke kumangirira ku `<{ $component }>` chifukwa ilibe chosintha cha mkhalidwe chotchedwa nearestPoint.

constrain-to-interior-without-nearest-point = Sizingatheke kumangirira mkati mwa `<{ $component }>` chifukwa ilibe chosintha cha mkhalidwe chotchedwa nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition imanyalanyazidwa pa choiceInput yomwe siili pa mzere umodzi

## Ordering children by index

choice-input-indices-count-mismatch = Manambala ofotokozedwa a choiceInput akunyalanyazidwa chifukwa chiwerengero chawo sichigwirizana ndi chiwerengero cha ana a choice.

pretzel-indices-count-mismatch = Manambala ofotokozedwa a problem akunyalanyazidwa chifukwa chiwerengero chawo sichigwirizana ndi chiwerengero cha ana a problem.

shuffle-indices-count-mismatch = Manambala ofotokozedwa a shuffle akunyalanyazidwa chifukwa chiwerengero chawo sichigwirizana ndi chiwerengero cha zigawo.

indices-ignored-out-of-range = Manambala ofotokozedwa a { $component } akunyalanyazidwa chifukwa ena ali kunja kwa malire.

pretzel-indices-repeated = Manambala ofotokozedwa a pretzel akunyalanyazidwa chifukwa ena abwerezedwa.

pretzel-circuit-first-index = Manambala ofotokozedwa a pretzel mu mode circuit akunyalanyazidwa chifukwa nambala yoyamba iyenera kukhala 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Kuti `<{ $component }>` igwire ntchito ndi ana a mtundu wa string, mbali `type` iyenera kufotokozedwa.

invalid-type-defaulting-to-math = type { $type } siyololedwa pa chigawo { $component }. Iyenera kukhala imodzi mwa math, text, number kapena boolean. Ikuikidwa ku math.

string-not-valid-component-to-arrange = String "{ $value }" si chigawo chovomerezeka cha { $component }. Ikunyalanyazidwa.

## Types and variables

invalid-type-defaulting-to-number = type { $type } siyololedwa, type ikuikidwa ku number.

invalid-variable-value = Mtengo wa chosintha ndi wolakwika: `{ $value }`

## Variants

variant-index-must-be-number = Nambala ya mtundu { $index } iyenera kukhala nambala

variant-index-must-be-integer = Nambala ya mtundu { $index } iyenera kukhala nambala yathunthu

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` sinapangidwe pa miyeso yathunthu. Mulifupi ukuikidwa pa yoyerekeza.

side-by-side-absolute-margins = `<{ $component }>` sinapangidwe pa miyeso yathunthu. Malire akuikidwa pa oyerekeza.

side-by-side-no-block-child = `<{ $component }>` ndi yolakwika: iyenera kukhala ndi mwana mmodzi osachepera wa mtundu wa buloko.

## `<label>`

label-for-ignored-on-graphical = Mbali `for` pa `<label>` ya chithunzi imanyalanyazidwa.

label-for-must-resolve-to-one = Mbali `for` pa `<label>` iyenera kulozera ku chigawo chimodzi chokha.

label-for-unresolved = Mbali `for` pa `<label>` sinathe kulozera ku chigawo chilichonse.

label-for-answer-with-authored-inputs = Mbali `for` pa `<label>` imalozera ku `<answer>` yokhala ndi zolowetsa zolembedwa momveka; lozerani ku cholowetsacho mwachindunji.

label-for-answer-without-input = Mbali `for` pa `<label>` imalozera ku `<answer>` yopanda cholowetsa choti chidziwitsidwe.

label-for-must-reference-input-or-answer = Mbali `for` pa `<label>` iyenera kulozera ku cholowetsa kapena ku yankho.

## Accessibility

accessibility-short-description-or-decorative = Chifukwa cha kupezeka, `<{ $component }>` iyenera kukhala ndi kufotokoza kwakufupi kapena kufotokozedwa ngati yokongoletsa.

accessibility-video-short-description = Chifukwa cha kupezeka, `<video>` iyenera kukhala ndi kufotokoza kwakufupi.

accessibility-input-short-description-or-label = Chifukwa cha kupezeka, `<{ $component }>` iyenera kukhala ndi kufotokoza kwakufupi kapena chizindikiro.

accessibility-answer-input-short-description-or-label = Chifukwa cha kupezeka, `<answer>` yomwe imapanga cholowetsa iyenera kukhala ndi kufotokoza kwakufupi kapena chizindikiro.

accessibility-short-description-contains-math = Kufotokoza kwakufupi sikuyenera kukhala ndi zigawo za masamu ngati `<{ $component }>`. Fotokozani masamu aliwonse m'mawu.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ili ndi kusiyana kosakwanira pa mawu a mutu wa chigawo (mawonekedwe akuda) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; zimafuna osachepera { $threshold }:1).
       *[other] { $colorName } ili ndi kusiyana kosakwanira pa mawu a mutu wa chigawo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; zimafuna osachepera { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` yodutsa pa mfundo { $count } sinapangidwe pamene mfundozo zilibe mtengo wa manambala.

circle-too-many-through-points = Sizingatheke kuwerengera bwalo lodutsa pa mfundo zoposa 3.

circle-overprescribed-radius-center-points = Sizingatheke kuwerengera bwalo lokhala ndi utali wapakati, pakati ndi mfundo zodutsa zonse zofotokozedwa.

circle-center-with-multiple-points = Sizingatheke kuwerengera bwalo lokhala ndi pakati pofotokozedwa lodutsa pa mfundo zoposa imodzi.

circle-radius-too-small = Sizingatheke kuwerengera bwalo: popeza mtunda pakati pa mfundo ziwirizo ndi { $distance }, utali wapakati wofotokozedwa { $radius } ndi wochepa kwambiri.

circle-radius-with-many-points = Sizingatheke kupanga bwalo lodutsa pa mfundo zoposa ziwiri ndi utali wapakati wofotokozedwa.

circle-invalid-center-or-through-points = Pakati kapena mfundo zodutsa za bwalo ndi zolakwika.

circle-radius-center-with-multiple-points = Sizingatheke kuwerengera utali wapakati wa bwalo lokhala ndi pakati pofotokozedwa lodutsa pa mfundo zoposa imodzi.

circle-change-radius-non-numerical = Sizingatheke kusintha utali wapakati wa bwalo lodutsa pa mfundo zopanda mtengo wa manambala

circle-radius-with-points-non-numerical = Sizingatheke kupanga bwalo lodutsa pa mfundo zoposa imodzi ndi utali wapakati wofotokozedwa pamene palibe mtengo wa manambala.

circle-change-center-non-numerical = Kusintha pakati pa bwalo lodutsa pa mfundo zopanda mtengo wa manambala sikunapangidwe.

## `<function>`

function-domain-insufficient-dimensions = Miyeso ya malo a ntchito sikwanira. Malo ali ndi mipata { $intervals } koma ntchito ili ndi zolowetsa { $inputs }.

function-domain-invalid-format = Mawonekedwe a malo a ntchito ndi olakwika.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Kukunyalanyazidwa mtengo wapamwamba wa ntchito womwe si nambala.
        [minimum] Kukunyalanyazidwa mtengo wotsika wa ntchito womwe si nambala.
        [extremum] Kukunyalanyazidwa mtengo wam'mphepete wa ntchito womwe si nambala.
        [point] Kukunyalanyazidwa mfundo ya ntchito yomwe si nambala.
        [slope] Kukunyalanyazidwa kutsetsereka kwa ntchito komwe si nambala.
       *[other] Kukunyalanyazidwa { $type } ya ntchito yomwe si nambala.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Kukunyalanyazidwa mtengo wapamwamba wa ntchito wopanda kanthu.
        [minimum] Kukunyalanyazidwa mtengo wotsika wa ntchito wopanda kanthu.
        [extremum] Kukunyalanyazidwa mtengo wam'mphepete wa ntchito wopanda kanthu.
        [point] Kukunyalanyazidwa mfundo ya ntchito yopanda kanthu.
       *[other] Kukunyalanyazidwa { $type } ya ntchito yopanda kanthu.
    }

function-points-too-close = Ntchito ili ndi mfundo ziwiri zomwe zili pafupi kwambiri. Ntchito singafotokozedwe.

function-iterates-input-output-mismatch = Kubwereza ntchito kumatheka pokhapokha ngati chiwerengero cha zolowetsa chikugwirizana ndi chiwerengero cha zotulukapo. Ntchito iyi ili ndi zolowetsa { $inputs } ndi zotulukapo { $outputs }.

## `<sequence>`

sequence-invalid-length = Kutalika kwa ndandanda ndi kolakwika. Kuyenera kukhala nambala yathunthu yosakhala yochepera zero.

sequence-invalid-step = Sitepe ya ndandanda ndi yolakwika. Iyenera kukhala nambala pa ndandanda ya mtundu { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ya ndandanda ya manambala ndi yolakwika. Iyenera kukhala nambala.

sequence-invalid-endpoint-letters = "{ $attribute }" ya ndandanda ya zilembo ndi yolakwika. Iyenera kukhala kuphatikiza kwa zilembo.

sequence-invalid-endpoint = "{ $attribute }" ya ndandanda ndi yolakwika.

select-from-sequence-coprime-not-numbers = coprime ikunyalanyazidwa chifukwa si manambala omwe akusankhidwa

select-from-sequence-coprime-with-exclude-combinations = coprime ikunyalanyazidwa chifukwa excludeCombinations yafotokozedwa

## Resolving a `target`

target-not-found = target ndi yolakwika pa `<{ $source }>`: cholingacho sichinapezeke.

target-state-variable-not-found = target ndi yolakwika pa `<{ $source }>`: chosintha cha mkhalidwe chotchedwa "{ $property }" sichinapezeke pa `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Zosintha za `<odeSystem>` ziyenera kusiyana ndi chosintha chodziyimira paokha.

ode-system-duplicate-variable-names = Sizingatheke kufotokoza ntchito za ODE RHS zokhala ndi maina a zosintha zodalira obwerezedwa.

ode-system-rhs-function-error = Sizingatheke kufotokoza ntchito ya ODE RHS. Panali cholakwika popanga ntchito ya mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Sizingatheke kufotokoza ngodya pakati pa mizere { $count }

angle-invalid-through-point = Mfundo yolakwika mu through ya `<angle>`

parabola-vertex-too-many-points = Parabola yokhala ndi msonga yodutsa pa mfundo zoposa imodzi sinapangidwe.

parabola-too-many-points = Parabola yodutsa pa mfundo zoposa 3 sinapangidwe.

intersection-too-many-items = Kudutsana kwa zinthu zoposa ziwiri sikunapangidwe

## Other math components

ionic-compound-not-two-ions = Chophatikiza cha ayoni cha chinthu china chosakhala ayoni ziwiri sichinapangidwe.

ionic-compound-needs-cation-and-anion = Chophatikiza cha ayoni chinapangidwa pa cation imodzi ndi anion imodzi yokha.

solve-equations-cannot-evaluate = Sizingatheke kuthetsa fanizo chifukwa fanizolo silinathe kuyesedwa: { $equation }

math-operators-operand-number-required = operandNumber iyenera kufotokozedwa potulutsa operand ya masamu.

eigen-decomposition-failed = Sizinatheke kuwerengera ma eigenvalue a matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } sikupezeka mu mawonekedwe, choncho idzagwirizana ndi malo opanda kanthu nthawi zonse.

## `<graph>`

graph-grid-invalid = `<graph>`: sizingatheke kumasulira grid="{ $grid }". Iyenera kukhala none, medium, dense, kapena manambala awiri abwino olekanitsidwa ndi malo, ngati grid="1 0.5". Palibe gridi yojambulidwa.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" sichithandizidwa mu chiwonetsero cha prefigure; kukugwiritsidwa ntchito khalidwe la malo a kumanja.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" sichithandizidwa mu chiwonetsero cha prefigure; kukugwiritsidwa ntchito khalidwe la malo a pamwamba.

prefigure-invalid-axis-bounds = `<graph>`: malire a mzere waukulu ndi olakwika pa kutembenuza kwa prefigure; kukugwiritsidwa ntchito bbox yachikhazikitso (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: mulifupi ndi wolakwika pa kutembenuza kwa prefigure; kukugwiritsidwa ntchito mulifupi wachikhazikitso wa chithunzi 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ndi yolakwika pa kutembenuza kwa prefigure; kukugwiritsidwa ntchito chiyerekezo chachikhazikitso 1.

prefigure-grid-spacing-too-fine = `<graph>`: mipata ya gridi ndi yochepa kwambiri pa malire a mzere waukulu; gridi yasiyidwa mu chiwonetsero cha prefigure.

prefigure-annotations-not-rendered = `<graph>`: zolemba sizidzawonetsedwa pamene chiwonetsero cha PreFigure sichikugwiritsidwa ntchito.

multiple-annotations-children = Apezeka ana `<annotations>` ambiri mu `<graph>`; onse akunyalanyazidwa kupatula womaliza.

## Referring to other components

copy-unrecognized-component-type = Sizingatheke kukulitsa kapena kukopera mtundu wa chigawo wosadziwika: { $type }.

copy-prop-not-found = Mbali { $property } sinapezeke pa chigawo cha mtundu { $component }

collect-no-source = Palibe gwero lomwe lapezeka la collect.

collect-invalid-component-type = Sizingatheke kusonkhanitsa zigawo za mtundu `<{ $component }>` chifukwa ndi mtundu wa chigawo wolakwika.

reference-index-unavailable = Sizingatheke kulozera nambala `{ $reference }`

## `<callAction>`

component-action-unavailable = Sizingatheke kuyitana { $action } pa chigawo `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Mawonekedwe a deta ndi olakwika. Mizere ili ndi kutalika kosiyana. Zapezeka mu componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Deta ili ndi maina a ndime obwerezedwa. Zapezeka mu componentIdx :{ $componentIdx }

data-frame-missing-column-name = Deta ikusowa dzina la ndime. Zapezeka mu componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award ya yankho ili yakhazikitsidwa pa yankho lotumizidwa ndi tagi answer yomweyo, zomwe zidzabweretsa khalidwe losayembekezereka.

answer-max-num-attempts-in-section-wide-check-work = Kuika `maxNumAttempts` pa `<answer>` yomwe ili mkati mwa chidebe chokhala ndi `sectionWideCheckWork` kulibe phindu, chifukwa chiwerengero cha zoyesa chimayendetsedwa ndi chidebecho. Ikani `maxNumAttempts` pa chidebe m'malo mwake.

nested-section-wide-check-work-max-num-attempts = Kuika `maxNumAttempts` pa chidebe chokhala ndi `sectionWideCheckWork` chomwe chili mkati mwa chidebe china chokhala ndi `sectionWideCheckWork` kulibe phindu, chifukwa chiwerengero cha zoyesa chimayendetsedwa ndi chidebe chakunja. Ikani `maxNumAttempts` pa chidebe chakunja m'malo mwake.

answer-attributes-need-symbolic-equality = Mbali { $attributes } sizidzakhala ndi phindu popanda symbolicEquality yoikidwa.

answer-invalid-type = Mtundu wolakwika wa yankho: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Popeza chigawo `<{ $component }>` chilibe dzina, sichingagwiritsidwe ntchito ngati mbali ya module

module-attribute-name-already-defined = Chigawo `<{ $component } name="{ $name }">` sichingagwiritsidwe ntchito ngati mbali ya module chifukwa mtundu wa chigawo `<module>` uli kale ndi mbali yotchedwa "{ $name }".

conditional-content-condition-ignored = Mbali `condition` imanyalanyazidwa pa chigawo `<conditionalContent>` chokhala ndi ana a case kapena else.

slider-markers-type-mismatch = Mtundu wa zizindikiro sugwirizana ndi mtundu wa slider.

pretzel-problem-needs-statement-and-answer = pretzel ndi yolakwika: `<problem>` iliyonse iyenera kukhala ndi `<statement>` imodzi ndi `<answer>` imodzi.

pretzel-circuit-first-problem-distractor = pretzel ndi yolakwika: mu mode="circuit", `<problem>` yoyamba singakhale yosokoneza.

## Attribute values

attribute-invalid-values = Mtengo { $values } ndi wolakwika pa mbali `{ $attribute }`; ukunyalanyazidwa.

attribute-must-be-references = Mtengo `{ $value }` ndi wolakwika pa mbali `{ $attribute }`. Mbali iyenera kupangidwa ndi zolozera zomwe zimayamba ndi `$`.

math-input-invalid-function-names = <mathInput>: kukunyalanyazidwa maina a ntchito olakwika mu { $attribute }: { $names }. Chigawo chowonetsa cha dzina lililonse chiyenera kukhala ndi zilembo 2 osachepera (zilembo kapena zolumikizira); chowonjezera `|<mathspeak alternative>` chikhoza kutsatira.

## Building components from the source

component-type-invalid = Mtundu wa chigawo ndi wolakwika: `<{ $componentType }>`

attribute-repeated = Mbali { $attribute } singabwerezedwe.

attribute-invalid-for-component = Mbali "{ $attribute }" ndi yolakwika pa chigawo cha mtundu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kufotokoza kwa kalembedwe { $styleNumber } kuli ndi kusiyana kosakwanira pa { $context ->
        [text-on-background] mtundu wa mawu poyerekeza ndi mtundu wa kumbuyo
        [high-contrast] mtundu wa kusiyana kwakukulu poyerekeza ndi bwalo
        [line] mtundu wa mzere poyerekeza ndi bwalo
        [marker] mtundu wa chizindikiro poyerekeza ndi bwalo
       *[text-on-canvas] mtundu wa mawu poyerekeza ndi bwalo
    }{ $mode ->
        [dark] { " (mawonekedwe akuda)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; zimafuna osachepera { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ngakhale kufotokoza kwa kalembedwe { $styleNumber } kwapereka mitundu yokhala ndi kusiyana kokwanira pa mawonekedwe owala, mitundu ya mawonekedwe akuda yochokera pamenepo ili ndi kusiyana kosakwanira pakati pa mtundu wa mawu ndi mtundu wa kumbuyo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; zimafuna osachepera { $threshold }:1). { $suggestion ->
        [available] Kuti kusiyana kukhale kokwanira mu mawonekedwe akuda, kwezani kusiyana kwa mawonekedwe owala (mwachitsanzo ikani { $lightAttribute }="{ $lightColor }") kapena sinthani mtundu wa mawonekedwe akuda (mwachitsanzo ikani { $darkAttribute }="{ $darkColor }").
       *[none] Kuti kusiyana kukhale kokwanira mu mawonekedwe akuda, kwezani kusiyana kwa mawonekedwe owala kapena sinthani mitundu yochokerayo ndi textColorDarkMode ndi/kapena backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ngakhale kufotokoza kwa kalembedwe { $styleNumber } kwapereka mtundu wa mawu wokhala ndi kusiyana kokwanira pa mawonekedwe owala, mtundu wa mawu wa mawonekedwe akuda wochokera pamenepo uli ndi kusiyana kosakwanira poyerekeza ndi bwalo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; zimafuna osachepera { $threshold }:1). { $suggestion ->
        [available] Kuti kusiyana kukhale kokwanira mu mawonekedwe akuda, kwezani kusiyana kwa mawonekedwe owala (mwachitsanzo ikani textColor="{ $lightColor }") kapena sinthani mtundu wa mawonekedwe akuda (mwachitsanzo ikani textColorDarkMode="{ $darkColor }").
       *[none] Kuti kusiyana kukhale kokwanira mu mawonekedwe akuda, kwezani kusiyana kwa mawonekedwe owala kapena sinthani mtundu wochokerawo ndi textColorDarkMode.
    }

section-multiple-style-palettes = Chigawo chikhoza kusankha <stylePalette> imodzi yokha; kukugwiritsidwa ntchito yomaliza.

## Unique variants

variant-num-to-select-not-non-negative-integer = sizingatheke kudziwa mitundu yapadera ya { $component } chifukwa numToSelect si nambala yathunthu yosakhala yochepera zero.

variant-num-to-select-not-constant-number = sizingatheke kudziwa mitundu yapadera ya { $component } chifukwa numToSelect si nambala yosasintha.

variant-with-replacement-not-constant-boolean = sizingatheke kudziwa mitundu yapadera ya { $component } chifukwa withReplacement si boolean yosasintha.

variant-select-weight-disables-unique = Mitundu yapadera ya select imazimitsidwa ngati pali chosankha chokhala ndi selectWeight kapena selectForVariants

variant-coprime-undetermined = sizingatheke kudziwa mitundu yapadera ya { $component } chifukwa sizingatheke kudziwa kuti coprime nthawi zonse ndi yabodza.

variant-attribute-not-constant = sizingatheke kudziwa mitundu yapadera ya { $component } chifukwa { $attribute } si chinthu chosasintha.

variant-attribute-not-number = sizingatheke kudziwa mitundu yapadera ya { $component } chifukwa { $attribute } si nambala.

variant-attribute-wrong-type-for-sequence =
    sizingatheke kudziwa mitundu yapadera ya { $component } ya mtundu { $type } chifukwa { $attribute } si { $expected ->
        [letters-combination] kuphatikiza kwa zilembo
        [math-expression] mawu a masamu ovomerezeka
        [integer] nambala yathunthu
       *[number] nambala
    }.

variant-length-not-integer = sizingatheke kudziwa mitundu yapadera ya { $component } chifukwa length si nambala yathunthu.

variant-sort-not-implemented = mitundu yapadera ya { $component } yokhala ndi sort sinapangidwe

variant-exclude-combinations-not-implemented = mitundu yapadera ya { $component } yokhala ndi excludeCombinations sinapangidwe

variant-math-exclude-not-implemented = mitundu yapadera ya { $component } ya mtundu math yokhala ndi exclude sinapangidwe

variant-non-constant-exclude-not-implemented = mitundu yapadera ya { $component } yokhala ndi exclude yosinthasintha sinapangidwe

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: sichithandizidwa mu chiwonetsero cha graph prefigure; mbadwa yadumphidwa.

prefigure-descendant-invalid-geometry = { $subject }: jiyometule yopanda malire kapena yosakwanira; mbadwa yadumphidwa.

prefigure-curve-label-omitted = { $subject }: zizindikiro sizithandizidwa pa zigawo za mzere wopindika zosinthidwa; chizindikiro chasiyidwa.

prefigure-curve-unsupported-definition-type = { $subject }: mtundu wa kufotokoza ntchito ya mzere wopindika '{ $definitionType }' sichithandizidwa; mbadwa yadumphidwa.

prefigure-region-flip-functions-unsupported = { $subject }: mbali flipFunctions pa regionBetweenCurves sichithandizidwa; mbadwa yadumphidwa.

prefigure-region-non-formula-child = { $subject }: zimathandizidwa ntchito za ana za mtundu formula zokha pa regionBetweenCurves; mbadwa yadumphidwa.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' sichithandizidwa pa { $labelKind ->
        [line-family] chizindikiro cha banja la mzere
       *[point] chizindikiro cha mfundo
    }; kukugwiritsidwa ntchito kulinganiza kwachikhazikitso kwa PreFigure.

prefigure-fill-style-unsupported = { $subject }: kalembedwe ka kudzaza '{ $fillStyle }' sikathandizidwa ndi PreFigure; kukubwerera ku kudzaza kolimba.

prefigure-line-style-unknown = { $subject }: kalembedwe ka mzere kosadziwika '{ $lineStyle }' kasiyidwa pa zotulukapo za PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: kalembedwe ka chizindikiro '{ $markerStyle }' kasinthidwa kukhala kalembedwe ka PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: kalembedwe ka chizindikiro '{ $markerStyle }' sikathandizidwa ndi PreFigure; kukugwiritsidwa ntchito kalembedwe kachikhazikitso.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ndi yolakwika; cholinga sichingadziwike. Cholemba chasiyidwa.

annotation-ref-multiple-targets = `<annotation>`: `ref` yalozera ku zolinga zambiri; kukugwiritsidwa ntchito choyamba.

annotation-ref-outside-graph = `<annotation>`: `ref` ndi yolakwika; cholinga chili kunja kwa gulafu chomwe chili nacho. Cholemba chasiyidwa.

annotation-ref-unsupported-target = `<annotation>`: `ref` ndi yolakwika; cholinga si chinthu cha chithunzi chothandizidwa mu kutembenuza kwa prefigure. Cholemba chasiyidwa.

annotation-text-missing = `<annotation>`: `text` yasowa kapena ilibe kanthu; kukutulutsidwa mawu opanda kanthu.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kwapezeka kudalirana kozungulira.
       *[other] Kwapezeka kudalirana kozungulira komwe kumakhudza chigawo `<{ $componentType }>`.
    }

reference-no-referent = Palibe cholozedwa chomwe chapezeka pa cholozera: `{ $reference }`

reference-multiple-referents = Zapezeka zolozedwa zambiri pa cholozera: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Mawonekedwe olakwika a mbali { $attribute } ya `<{ $componentType }>`.

children-invalid = Ana olakwika a `<{ $componentType }>`: apezeka ana olakwika: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Mtengo `{ $value }` ndi wolakwika pa mbali `{ $attribute }`; kukugwiritsidwa ntchito mtengo `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Mtundu wa DoenetML { $version } sunapezeke.
       *[other] Mtundu wa DoenetML { $version } sunapezeke. Kukubwerera ku mtundu { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML yolakwika: { $content }

parse-tag-missing-close-tag = DoenetML yolakwika: Tagi `{ $tag }` ilibe tagi yotseka. Kunayembekezeredwa tagi yodzitseka kapena tagi `</{ $tagName }>`.

parse-tag-error = DoenetML yolakwika: Cholakwika mu tagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML yolakwika: Mbali yolakwika `{ $attribute }` ikuoneka ngati ikusowa mtengo.

parse-attribute-invalid = DoenetML yolakwika: Mbali `{ $attribute }` ndi yolakwika

parse-attribute-value-invalid = DoenetML yolakwika: Mtengo wa mbali `{ $value }` ndi wolakwika

parse-attribute-value-quote-mismatch = DoenetML yolakwika: Mtengo wa mbali `{ $value }` ndi wolakwika. Zizindikiro za mawu sizigwirizana. Zikuoneka kuti `{ $quote }` ikusowa

parse-open-tag-name-missing = DoenetML yolakwika: Yapezeka tagi yopanda dzina la tagi, mwachitsanzo `<`

parse-tag-not-closed = DoenetML yolakwika: Tagi `{ $tag }` sinatsekedwe (zikuoneka kuti `>` ikusowa).

parse-self-closing-tag-name-missing = DoenetML yolakwika: Yapezeka tagi yopanda dzina la tagi `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML yolakwika: Tagi `{ $tag }` sinatsekedwe (zikuoneka kuti `/>` ikusowa).

parse-tag-invalid-attributes = DoenetML yolakwika: Tagi `{ $tag }` ndi yolakwika. Ikhoza kukhala ndi mbali zolakwika.

parse-close-tag-name-missing = DoenetML yolakwika: Yapezeka tagi yotseka yopanda dzina la tagi, mwachitsanzo `</`

parse-attribute-value-unquoted = Mtengo wa mbali uyenera kuikidwa mu zizindikiro za mawu: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML yolakwika: Yapezeka tagi yotseka `{ $tag }`, koma palibe tagi yotsegula yogwirizana

parse-close-tag-mismatched = DoenetML yolakwika: Tagi yotseka sikugwirizana. Kunayembekezeredwa `</{ $expected }>`. Yapezeka `{ $found }`

parser-node-unconvertible = Sizinatheke kusintha node { $node } kukhala node ya Dast.

## Names

name-attribute-invalid =
    Mbali name='{ $name }' ndi yolakwika. { $reason ->
        [characters] Maina akhoza kukhala ndi zilembo, manambala, mizere yapansi kapena zolumikizira zokha.
       *[start] Maina ayenera kuyamba ndi chilembo.
    }

component-name-invalid-start = Dzina la chigawo "{ $name }" ndi lolakwika. Maina ayenera kuyamba ndi chilembo.

## `<answer>` sugar

answer-video-watched-missing-video = Yankho la mtundu videoWatched liyenera kukhala ndi mbali video

answer-video-watched-video-not-reference = Yankho la mtundu videoWatched liyenera kukhala ndi mbali video yomwe ndi cholozera

answer-name-not-single-text = Mbali name ya yankho iyenera kukhala ndi mwana text mmodzi yekha

## Referencing another document

external-doenetml-recursion-limit = Sizingatheke kutenga DoenetML yakunja chifukwa cha magawo ambiri obwereza. Kodi pali cholozera chozungulira?

external-doenetml-unavailable = Sizingatheke kutenga DoenetML kuchokera ku { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML yotengedwa kuchokera ku { $attribute }="{ $uri }" ndi yolakwika: sikugwirizana ndi mtundu wa chigawo "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Mbali `{ $from }` sikugwiritsidwanso ntchito; gwiritsani ntchito `{ $to }` m'malo mwake.
       *[other] [deprecation] Mbali `{ $from }` pa `<{ $component }>` sikugwiritsidwanso ntchito; gwiritsani ntchito `{ $to }` m'malo mwake.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Mbali `{ $from }` sikugwiritsidwanso ntchito ndipo ikunyalanyazidwa chifukwa `{ $to }` nayonso yafotokozedwa.
       *[other] [deprecation] Mbali `{ $from }` pa `<{ $component }>` sikugwiritsidwanso ntchito ndipo ikunyalanyazidwa chifukwa `{ $to }` nayonso yafotokozedwa.
    }

deprecated-attribute-ignored = [deprecation] Mbali `{ $attribute }` pa `<{ $component }>` sikugwiritsidwanso ntchito ndipo ikunyalanyazidwa.


## Language coverage

pluralize-english-only = `<pluralize>` ingathe kuchulukitsa Chingerezi chokha, choncho mawu ake amasiyidwa osasinthidwa mu chikalata cholembedwa mu { $locale }. Lembani mawonekedwe ochuluka mwachindunji, kapena muwaike ndi mbali `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Chigawo `<{ $tag }>` si chigawo cha Doenet chodziwika.

schema-element-not-allowed-at-root = Chigawo `<{ $tag }>` sichiloledwa pa muzu wa chikalata.

schema-element-not-allowed-inside = Chigawo `<{ $tag }>` sichiloledwa mkati mwa `<{ $parent }>`.

schema-attribute-unrecognized = Chigawo `<{ $tag }>` chilibe mbali yotchedwa `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Mbali `{ $attribute }` ya chigawo `<{ $tag }>` iyenera kukhala mndandanda womwe chinthu chilichonse ndi chimodzi mwa: { $allowed }
       *[other] Mbali `{ $attribute }` ya chigawo `<{ $tag }>` iyenera kukhala chimodzi mwa: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Dzina la mtundu ndi lolakwika pa select. Dzina la mtundu { $variantName } limapezeka mu zosankha { $numOptions } koma chiwerengero choti chisankhidwe ndi { $numToSelect }.

select-variant-name-without-options = Mitundu ina yafotokozedwa pa select koma palibe zosankha zofotokozedwa pa dzina la mtundu lotheka: { $variantName }.

select-variant-name-not-possible = Dzina la mtundu { $variantName } lofotokozedwa pa select si dzina la mtundu lotheka.

select-too-few-options = Sizingatheke kusankha zigawo { $numToSelect } mwa { $numOptions } zokha.

select-from-sequence-too-few-values = Sizingatheke kusankha mtengo { $numToSelect } mu ndandanda ya kutalika { $length }.

select-from-sequence-indices-count-mismatch = Chiwerengero cha manambala ofotokozedwa a select chiyenera kugwirizana ndi chiwerengero choti chisankhidwe

select-from-sequence-indices-not-integers = Manambala onse ofotokozedwa a select ayenera kukhala manambala athunthu

select-from-sequence-index-excluded = Yafotokozedwa nambala ya selectfromsequence yomwe inachotsedwa

select-from-sequence-indices-excluded-combination = Yafotokozedwa manambala a selectfromsequence omwe anali kuphatikiza kochotsedwa

select-from-sequence-coprime-not-positive-integers = Sizingatheke kusankha kuphatikiza kwa coprime chifukwa si manambala athunthu abwino omwe akusankhidwa.

select-from-sequence-coprime-common-factor = Sizingatheke kusankha manambala a coprime. Mtengo wonse wotheka umagawana chinthu chimodzi. (Mtengo wofotokozedwa wa "from" kapena "to" uyenera kukhala coprime ndi "step".)

select-from-sequence-coprime-single-number = Sizingatheke kusankha kuphatikiza kwa coprime pa nambala imodzi yomwe si 1.

select-from-sequence-excluded-too-many-combinations = Zoposa 70% za kuphatikiza zachotsedwa mu selectFromSequence

select-from-sequence-coprime-none-found = Sizinatheke kusankha manambala a coprime. Mtengo wonse wotheka umagawana chinthu chimodzi.

select-from-sequence-too-few-unique-values = Sizingatheke kusankha mtengo wapadera { $numToSelect } mu ndandanda ya kutalika { $numPossibleValues }

select-prime-numbers-too-few-values = Sizingatheke kusankha mtengo { $numToSelect } mu mndandanda wa manambala oyambirira wa kutalika { $numValues }

select-prime-numbers-values-count-mismatch = Chiwerengero cha mtengo wofotokozedwa wa select chiyenera kugwirizana ndi chiwerengero choti chisankhidwe

select-prime-numbers-values-not-prime = Mtengo wonse wofotokozedwa wa select prime number uyenera kukhala mu mndandanda wa manambala oyambirira

select-prime-numbers-values-excluded-combination = Mtengo wofotokozedwa wa selectPrimeNumbers unali kuphatikiza kochotsedwa

select-prime-numbers-excluded-too-many-combinations = Zoposa 70% za kuphatikiza zachotsedwa mu selectPrimeNumbers

select-random-combination-fluke = Mwa mwayi wosayembekezereka kwambiri, sizinatheke kusankha kuphatikiza kwa mtengo wosasankhika

select-random-value-fluke = Mwa mwayi wosayembekezereka kwambiri, sizinatheke kusankha mtengo wosasankhika
