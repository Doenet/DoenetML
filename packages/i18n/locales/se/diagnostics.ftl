# Northern Sami diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
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
# Sami counts in three categories, `one`, `two` and `other`, and a message here
# writes them out only where they differ. Where English separates a singular
# from a plural in the verb alone — "is ignored" against "are ignored" — Sami
# marks number on the verb too, so `one` and `*[other]` are kept; the dual is
# not written out beside them, because the verb's dual is not what a list of
# two attribute names selects.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ii váldojuvvo vuhtii go guokte geahčečuoggá leaba addojuvvon
       *[other] { $attributes } eai váldojuvvo vuhtii go guokte geahčečuoggá leaba addojuvvon
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ii váldojuvvo vuhtii go sihke geahčečuokkis ja gaskačuokkis leaba addojuvvon
       *[other] { $attributes } eai váldojuvvo vuhtii go sihke geahčečuokkis ja gaskačuokkis leaba addojuvvon
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ii doaimma gaskačuoggá haga

## `<line>`

line-points-undetermined-dimensions = Linnjá čuoggáid čađa main dimenšuvnnat eai leat mearriduvvon.

line-points-too-few-dimensions = Linnjá ferte mannat čuoggáid čađa main leat unnimusat guokte dimenšuvnna.

line-points-depend-on-variables = Linnjá manná čuoggáid čađa mat leat sorjavaččat variábeliin: { $variables }.

line-equation-invalid-format = Gustohis hápmi linnjá dássádussii variábeliin { $variable1 } ja { $variable2 }.

## `<ray>`

ray-overprescribed-through = Beallelinnjá lea mearriduvvon through, endpoint ja direction bokte. Addojuvvon through ii váldojuvvo vuhtii.

ray-dimension-mismatch = numDimensions ii heive ray:s.

## `<vector>`

vector-overprescribed-head = Vektor lea mearriduvvon head, tail ja displacement bokte. Addojuvvon head ii váldojuvvo vuhtii.

vector-dimension-mismatch = numDimensions ii heive vector:s.

## Attracting and constraining

attract-to-without-nearest-point = Ii sáhte geasuhit dása `<{ $component }>` danne go das ii leat nearestPoint stáhtavariábel.

constrain-to-without-nearest-point = Ii sáhte ráddjet dása `<{ $component }>` danne go das ii leat nearestPoint stáhtavariábel.

constrain-to-interior-without-nearest-point = Ii sáhte ráddjet dán siskkobeallái `<{ $component }>` danne go das ii leat nearestPoint stáhtavariábel.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ii váldojuvvo vuhtii choiceInput:as mii ii leat inline

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput:a addojuvvon indeavssat eai váldojuvvo vuhtii danne go indeavssaid lohku ii heive choice-mánáid lohkui.

pretzel-indices-count-mismatch = problem:a addojuvvon indeavssat eai váldojuvvo vuhtii danne go indeavssaid lohku ii heive problem-mánáid lohkui.

shuffle-indices-count-mismatch = shuffle:a addojuvvon indeavssat eai váldojuvvo vuhtii danne go indeavssaid lohku ii heive komponeanttaid lohkui.

indices-ignored-out-of-range = { $component } addojuvvon indeavssat eai váldojuvvo vuhtii danne go muhtin indeavssat leat olggobealde ráji.

pretzel-indices-repeated = pretzel:a addojuvvon indeavssat eai váldojuvvo vuhtii danne go muhtin indeavssat gierdduhuvvojit.

pretzel-circuit-first-index = pretzel:a addojuvvon indeavssat mode="circuit":s eai váldojuvvo vuhtii danne go vuosttaš indeaksa ferte leat 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Vai `<{ $component }>` doaibmá teakstamánáiguin, ferte attribuhtta `type` leat addojuvvon.

invalid-type-defaulting-to-math = Gustohis type { $type } komponeanttas { $component }. Ferte leat math, text, number dahje boolean. Bidjojuvvo math:n.

string-not-valid-component-to-arrange = Teaksta "{ $value }" ii leat gustovaš komponeanta dása { $component }. Ii váldojuvvo vuhtii.

## Types and variables

invalid-type-defaulting-to-number = Gustohis type { $type }, type bidjojuvvo number:n.

invalid-variable-value = Gustohis variábela árvu: `{ $value }`

## Variants

variant-index-must-be-number = Variántta indeaksa { $index } ferte leat lohku

variant-index-must-be-integer = Variántta indeaksa { $index } ferte leat ollislohku

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ii leat čađahuvvon absoluhtta mihtuide. Govdodagat bidjojuvvojit relatiivvalažžan.

side-by-side-absolute-margins = `<{ $component }>` ii leat čađahuvvon absoluhtta mihtuide. Ravddat bidjojuvvojit relatiivvalažžan.

side-by-side-no-block-child = Gustohis `<{ $component }>`: das ferte leat unnimusat okta bloakkamánná.

## `<label>`

label-for-ignored-on-graphical = Attribuhtta `for` gráfalaš `<label>`:s ii váldojuvvo vuhtii.

label-for-must-resolve-to-one = Attribuhtta `for` `<label>`:s ferte čujuhit juste ovtta komponentii.

label-for-unresolved = Attribuhtta `for` `<label>`:s ii sáhttán čujuhit komponentii.

label-for-answer-with-authored-inputs = Attribuhtta `for` `<label>`:s čujuha `<answer>`:ii mas leat ieš čállojuvvon sisabidjamat; čujut baicce sisabidjamii njuolga.

label-for-answer-without-input = Attribuhtta `for` `<label>`:s čujuha `<answer>`:ii mas ii leat sisabidjan maid merket.

label-for-must-reference-input-or-answer = Attribuhtta `for` `<label>`:s ferte čujuhit sisabidjamii dahje answer:ii.

## Accessibility

accessibility-short-description-or-decorative = Olahanvuođa dihte ferte `<{ $component }>` leat oanehis válddahus dahje leat merkejuvvon hearvan.

accessibility-video-short-description = Olahanvuođa dihte ferte `<video>`:s leat oanehis válddahus.

accessibility-input-short-description-or-label = Olahanvuođa dihte ferte `<{ $component }>`:s leat oanehis válddahus dahje namahus.

accessibility-answer-input-short-description-or-label = Olahanvuođa dihte ferte `<answer>`:s mii ráhkada sisabidjama leat oanehis válddahus dahje namahus.

accessibility-short-description-contains-math = Oanehis válddahusain eai berre leat matematihkalaš komponeanttat nugo `<{ $component }>`. Čále matematihka sániiguin.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kontrásta ii leat doarvái kapihttala bajilčállaga teavstta várás (seavdnjadis modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; gáibiduvvo unnimusat { $threshold }:1).
       *[other] { $colorName } kontrásta ii leat doarvái kapihttala bajilčállaga teavstta várás ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; gáibiduvvo unnimusat { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` { $count } čuoggá čađa ii leat čađahuvvon dan dilis go čuoggáin eai leat numeralaš árvvut.

circle-too-many-through-points = Ii sáhte rehkenastit sirkkela eanet go 3 čuoggá čađa.

circle-overprescribed-radius-center-points = Ii sáhte rehkenastit sirkkela addojuvvon radiusain, guovddážiin ja čuoggáiguin.

circle-center-with-multiple-points = Ii sáhte rehkenastit sirkkela addojuvvon guovddážiin eanet go 1 čuoggá čađa.

circle-radius-too-small = Ii sáhte rehkenastit sirkkela: go gaska guovtti čuoggá gaskkas lea { $distance }, de addojuvvon radius { $radius } lea beare unni.

circle-radius-with-many-points = Ii sáhte ráhkadit sirkkela eanet go guovtti čuoggá čađa addojuvvon radiusain.

circle-invalid-center-or-through-points = Gustohis guovddáš dahje gustohis čuoggát sirkkelis.

circle-radius-center-with-multiple-points = Ii sáhte rehkenastit sirkkela radiusa addojuvvon guovddážiin eanet go 1 čuoggá čađa.

circle-change-radius-non-numerical = Ii sáhte rievdadit sirkkela radiusa go čuoggát eai leat numeralaččat

circle-radius-with-points-non-numerical = Ii sáhte ráhkadit sirkkela eanet go ovtta čuoggá čađa addojuvvon radiusain go árvvut eai leat numeralaččat.

circle-change-center-non-numerical = Sirkkela guovddáža rievdadeapmi čuoggáid čađa main eai leat numeralaš árvvut ii leat čađahuvvon.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ii doarvái dimenšuvnnat funkšuvnna definišuvdnaguovllu várás. Definišuvdnaguovllus lea { $intervals } gaska, muhto funkšuvnnas { $inputs ->
            [one] lea { $inputs } sisabidjan
           *[other] leat { $inputs } sisabidjama
        }.
       *[other] Ii doarvái dimenšuvnnat funkšuvnna definišuvdnaguovllu várás. Definišuvdnaguovllus leat { $intervals } gaskka, muhto funkšuvnnas { $inputs ->
            [one] lea { $inputs } sisabidjan
           *[other] leat { $inputs } sisabidjama
        }.
    }

function-domain-invalid-format = Gustohis hápmi funkšuvnna definišuvdnaguovllus.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funkšuvnna numeralašmeahttun maksimuma ii váldojuvvo vuhtii.
        [minimum] Funkšuvnna numeralašmeahttun minimuma ii váldojuvvo vuhtii.
        [extremum] Funkšuvnna numeralašmeahttun ekstremuma ii váldojuvvo vuhtii.
        [point] Funkšuvnna numeralašmeahttun čuokkis ii váldojuvvo vuhtii.
        [slope] Funkšuvnna numeralašmeahttun luoitin ii váldojuvvo vuhtii.
       *[other] Funkšuvnna numeralašmeahttun { $type } ii váldojuvvo vuhtii.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funkšuvnna guoros maksimuma ii váldojuvvo vuhtii.
        [minimum] Funkšuvnna guoros minimuma ii váldojuvvo vuhtii.
        [extremum] Funkšuvnna guoros ekstremuma ii váldojuvvo vuhtii.
        [point] Funkšuvnna guoros čuokkis ii váldojuvvo vuhtii.
       *[other] Funkšuvnna guoros { $type } ii váldojuvvo vuhtii.
    }

function-points-too-close = Funkšuvnnas leat guokte čuoggá mat leat beare lahkalaga. Funkšuvnna ii sáhte meroštallat.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funkšuvnna geardduhusat leat vejolaččat dušše jos sisabidjamiid lohku lea seamma go olggosbuktimiid lohku. Dán funkšuvnnas lea { $inputs } sisabidjan ja { $outputs ->
            [one] { $outputs } olggosbuktin
           *[other] { $outputs } olggosbuktima
        }.
       *[other] Funkšuvnna geardduhusat leat vejolaččat dušše jos sisabidjamiid lohku lea seamma go olggosbuktimiid lohku. Dán funkšuvnnas leat { $inputs } sisabidjama ja { $outputs ->
            [one] { $outputs } olggosbuktin
           *[other] { $outputs } olggosbuktima
        }.
    }

## `<sequence>`

sequence-invalid-length = Gustohis guhkkodat ráidui. Ferte leat negatiivvalašmeahttun ollislohku.

sequence-invalid-step = Gustohis lávki ráidus. Ferte leat lohku ráidui mas lea šládja { $type }.

sequence-invalid-endpoint-number = Gustohis "{ $attribute }" lohkoráidus. Ferte leat lohku.

sequence-invalid-endpoint-letters = Gustohis "{ $attribute }" bustávaráidus. Ferte leat bustávaid kombinašuvdna.

sequence-invalid-endpoint = Gustohis "{ $attribute }" ráidus.

select-from-sequence-coprime-not-numbers = coprime ii váldojuvvo vuhtii danne go eai válljejuvvo logut

select-from-sequence-coprime-with-exclude-combinations = coprime ii váldojuvvo vuhtii danne go excludeCombinations lea addojuvvon

## Resolving a `target`

target-not-found = Gustohis target dása `<{ $source }>`: ulbmil ii gávdno.

target-state-variable-not-found = Gustohis target dása `<{ $source }>`: ii gávdno stáhtavariábel nammii "{ $property }" dán alde: `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` variábelat fertejit leat earát go sorjjasmeahttun variábel.

ode-system-duplicate-variable-names = Ii sáhte meroštallat ODE olgeš beali funkšuvnnaid go sorjavaš variábeliid namat gierdduhuvvojit.

ode-system-rhs-function-error = Ii sáhte meroštallat ODE olgeš beali funkšuvnna. Meattáhus mathjs-funkšuvnna ráhkadeamis.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ii sáhte meroštallat vinkkela { $count } linnjá gaskkas

angle-invalid-through-point = Gustohis čuokkis `<angle>` through:s

parabola-vertex-too-many-points = Parabola čohkáin eanet go 1 čuoggá čađa ii leat čađahuvvon.

parabola-too-many-points = Parabola eanet go 3 čuoggá čađa ii leat čađahuvvon.

intersection-too-many-items = Eanet go guovtti diŋgga čuohppaseapmi ii leat čađahuvvon

## Other math components

ionic-compound-not-two-ions = Iovnnalaš oktavuohta ii leat čađahuvvon earu go guovtti iovdnii.

ionic-compound-needs-cation-and-anion = Iovnnalaš oktavuohta lea čađahuvvon dušše ovtta katiovdnii ja ovtta aniovdnii.

solve-equations-cannot-evaluate = Ii sáhte čoavdit dássádusa danne go dan ii sáhttán rehkenastit: { $equation }

math-operators-operand-number-required = Ferte addit operandNumber go válddát eret matematihkalaš operanda.

eigen-decomposition-failed = Ii sáhttán rehkenastit matriissa iešárvvuid

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } ii leat minsttaris, nu ahte dat álo heive guorusii.
       *[other] `<matchesPattern>`: parameterat { $parameters } eai leat minsttaris, nu ahte dat álo heivejit guorusii.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ii sáhte dulkot grid="{ $grid }". Ferte leat none, medium, dense dahje guokte positiivvalaš logu earuhuvvon gaskkain, ovdamearkka dihte grid="1 0.5". Ruvttu ii sárgojuvvo.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ii leat doarjjejuvvon prefigure-čájeheaddjis; geavahuvvo olgeš beali láhtten.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ii leat doarjjejuvvon prefigure-čájeheaddjis; geavahuvvo bajit beali láhtten.

prefigure-invalid-axis-bounds = `<graph>`: gustohis akselarájit prefigure-nuppástuhttimii; geavahuvvo standárda bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: gustohis govdodat prefigure-nuppástuhttimii; geavahuvvo standárda govdodat 425.

prefigure-invalid-aspect-ratio = `<graph>`: gustohis aspectRatio prefigure-nuppástuhttimii; geavahuvvo standárda gaskavuohta 1.

prefigure-grid-spacing-too-fine = `<graph>`: ruvttu gaskkat leat beare unnit akselarájiid ektui; ruvttu guođđojuvvo eret prefigure-čájeheaddjis.

prefigure-annotations-not-rendered = `<graph>`: mearkkašumit eai čájehuvvo go PreFigure-čájeheaddji ii geavahuvvo.

multiple-annotations-children = Máŋga `<annotations>`-máná gávdnui `<graph>`:s; buot earát go maŋimuš eai váldojuvvo vuhtii.

## Referring to other components

copy-unrecognized-component-type = Ii sáhte viiddidit dahje máŋget dovdameahttun komponeantašlája: { $type }.

copy-prop-not-found = Ii gávdnon iešvuohta { $property } komponeanttas mas lea šládja { $component }

collect-no-source = Ii gávdnon gáldu dása collect.

collect-invalid-component-type = Ii sáhte čohkket komponeanttaid šlájas `<{ $component }>` danne go dat lea gustohis komponeantašládja.

reference-index-unavailable = Ii sáhte čujuhit indeavssii `{ $reference }`

## `<callAction>`

component-action-unavailable = Ii sáhte gohččut { $action } komponeanttas `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Dáhtain lea gustohis hápmi. Linnjáid guhkkodagat eai leat seammaláganat. Gávdnon dás: componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Dáhtain leat gierdduhuvvon ceahkkenamat. Gávdnon dás: componentIdx :{ $componentIdx }

data-frame-missing-column-name = Dáhtain váilu ceahkkenamma. Gávdnon dás: componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Okta award dán vástádussii vuođđuduvvá answer-gilkora iežas sáddejuvvon vástádussii, mii dagaha vuordemeahttun láhttema.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` bidjan `<answer>`:ii mii lea `sectionWideCheckWork`-koarttas siste ii doaimma, danne go geahččalemiid logu stivre koarta. Bija `maxNumAttempts` koartii.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` bidjan koartii mas lea `sectionWideCheckWork` ja mii lea nuppi `sectionWideCheckWork`-koartta siste ii doaimma, danne go geahččalemiid logu stivre olggomus koarta. Bija `maxNumAttempts` olggomus koartii.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attribuhtta { $attributes } ii doaimma jos symbolicEquality ii leat biddjojuvvon.
       *[other] Attribuhtat { $attributes } eai doaimma jos symbolicEquality ii leat biddjojuvvon.
    }

answer-invalid-type = Gustohis šládja vástádussii: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Go komponeanttas `<{ $component }>` ii leat namma, de dan ii sáhte geavahit moduvlla attribuhttan

module-attribute-name-already-defined = Komponeantta `<{ $component } name="{ $name }">` ii sáhte geavahit moduvlla attribuhttan danne go komponeantašlájas `<module>` juo lea attribuhtta "{ $name }".

conditional-content-condition-ignored = Attribuhtta `condition` ii váldojuvvo vuhtii `<conditionalContent>`:s mas leat case- dahje else-mánát.

slider-markers-type-mismatch = Mearkkaid šládja ii heive slider:a šlájii.

pretzel-problem-needs-statement-and-answer = Gustohis pretzel: juohke `<problem>`:s ferte leat okta `<statement>` ja okta `<answer>`.

pretzel-circuit-first-problem-distractor = Gustohis pretzel: mode="circuit":s ii sáhte vuosttaš `<problem>` leat fillejeaddji.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Gustohis árvu { $values } attribuhttii `{ $attribute }`; ii váldojuvvo vuhtii.
       *[other] Gustohis árvvut { $values } attribuhttii `{ $attribute }`; eai váldojuvvo vuhtii.
    }

attribute-must-be-references = Gustohis árvu `{ $value }` attribuhttii `{ $attribute }`. Attribuhtta ferte leat čohkkejuvvon čujuhusain mat álget mearkkain `$`.

math-input-invalid-function-names = <mathInput>: gustohis funkšuvdnanamat dás { $attribute } eai váldojuvvon vuhtii: { $names }. Juohke nama čájehanoassi ferte leat unnimusat 2 mearkka (bustávat dahje sárgát); dan maŋŋá sáhttá čuovvut eaktodáhtolaš `|<mathspeak molssaeaktu>`.

## Building components from the source

component-type-invalid = Gustohis komponeantašládja: `<{ $componentType }>`

attribute-repeated = Ii sáhte geardduhit attribuhta { $attribute }.

attribute-invalid-for-component = Gustohis attribuhtta "{ $attribute }" komponentii mas lea šládja `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stiilameroštallamis { $styleNumber } ii leat doarvái kontrásta dása { $context ->
        [text-on-background] teakstaivnni duogášivnni ektui
        [high-contrast] alla kontrástta ivnni duogáža ektui
        [line] linnjáivnni duogáža ektui
        [marker] mearkkaivnni duogáža ektui
       *[text-on-canvas] teakstaivnni duogáža ektui
    }{ $mode ->
        [dark] { " (seavdnjadis modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; gáibiduvvo unnimusat { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Vaikko stiilameroštallamis { $styleNumber } leat ivnnit main lea doarvái kontrásta čuvges modusii, de seavdnjadis modusa ivnniin mat dain rehkenastojuvvojit ii leat doarvái kontrásta teakstaivnni ektui duogášivnni vuostá ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; gáibiduvvo unnimusat { $threshold }:1). { $suggestion ->
        [available] Vai kontrásta lea doarvái seavdnjadis modusas, lasit čuvges modusa kontrástta (ovdamearkka dihte bija { $lightAttribute }="{ $lightColor }") dahje badjelgeahča seavdnjadis modusa ivnni (ovdamearkka dihte bija { $darkAttribute }="{ $darkColor }").
       *[none] Vai kontrásta lea doarvái seavdnjadis modusas, lasit čuvges modusa kontrástta dahje badjelgeahča rehkenastojuvvon ivnniid textColorDarkMode ja/dahje backgroundColorDarkMode bokte.
    }

style-definition-dark-mode-text-canvas-contrast =
    Vaikko stiilameroštallamis { $styleNumber } lea teakstaivdni mas lea doarvái kontrásta čuvges modusii, de seavdnjadis modusa teakstaivnnis mii das rehkenastojuvvo ii leat doarvái kontrásta duogáža vuostá ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; gáibiduvvo unnimusat { $threshold }:1). { $suggestion ->
        [available] Vai kontrásta lea doarvái seavdnjadis modusas, lasit čuvges modusa kontrástta (ovdamearkka dihte bija textColor="{ $lightColor }") dahje badjelgeahča seavdnjadis modusa ivnni (ovdamearkka dihte bija textColorDarkMode="{ $darkColor }").
       *[none] Vai kontrásta lea doarvái seavdnjadis modusas, lasit čuvges modusa kontrástta dahje badjelgeahča rehkenastojuvvon ivnni textColorDarkMode bokte.
    }

section-multiple-style-palettes = Kapihttal sáhttá válljet dušše ovtta <stylePalette>; geavahuvvo maŋimuš.

## Unique variants

variant-num-to-select-not-non-negative-integer = ii sáhte mearridit { $component } áidnalunddot variánttaid danne go numToSelect ii leat negatiivvalašmeahttun ollislohku.

variant-num-to-select-not-constant-number = ii sáhte mearridit { $component } áidnalunddot variánttaid danne go numToSelect ii leat bissovaš lohku.

variant-with-replacement-not-constant-boolean = ii sáhte mearridit { $component } áidnalunddot variánttaid danne go withReplacement ii leat bissovaš boolean.

variant-select-weight-disables-unique = select áidnalunddot variánttat leat jaddaduvvon jos muhtin molssaeavttus lea selectWeight dahje selectForVariants addojuvvon

variant-coprime-undetermined = ii sáhte mearridit { $component } áidnalunddot variánttaid danne go ii sáhte mearridit ahte coprime lea álo boasttu.

variant-attribute-not-constant = ii sáhte mearridit { $component } áidnalunddot variánttaid danne go { $attribute } ii leat bissovaš.

variant-attribute-not-number = ii sáhte mearridit { $component } áidnalunddot variánttaid danne go { $attribute } ii leat lohku.

variant-attribute-wrong-type-for-sequence =
    ii sáhte mearridit { $component } áidnalunddot variánttaid mas lea šládja { $type } danne go { $attribute } ii leat { $expected ->
        [letters-combination] bustávaid kombinašuvdna
        [math-expression] gustovaš matematihkalaš cealkka
        [integer] ollislohku
       *[number] lohku
    }.

variant-length-not-integer = ii sáhte mearridit { $component } áidnalunddot variánttaid danne go length ii leat ollislohku.

variant-sort-not-implemented = { $component } áidnalunddot variánttat sort:ain eai leat čađahuvvon

variant-exclude-combinations-not-implemented = { $component } áidnalunddot variánttat excludeCombinations:ain eai leat čađahuvvon

variant-math-exclude-not-implemented = { $component } áidnalunddot variánttat šlájas math exclude:ain eai leat čađahuvvon

variant-non-constant-exclude-not-implemented = { $component } áidnalunddot variánttat bissovašmeahttun exclude:ain eai leat čađahuvvon

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ii leat doarjjejuvvon gráfa prefigure-čájeheaddjis; maŋisboahtti guođđojuvvo badjel.

prefigure-descendant-invalid-geometry = { $subject }: geometriija ii leat ollislaš dahje ii leat ráddjejuvvon; maŋisboahtti guođđojuvvo badjel.

prefigure-curve-label-omitted = { $subject }: namahusat eai leat doarjjejuvvon nuppástuhttojuvvon kurvaelemeanttain; namahus guođđojuvvo eret.

prefigure-curve-unsupported-definition-type = { $subject }: doarjjekeahtes kurvafunkšuvnna meroštallanšládja '{ $definitionType }'; maŋisboahtti guođđojuvvo badjel.

prefigure-region-flip-functions-unsupported = { $subject }: doarjjekeahtes attribuhtta flipFunctions regionBetweenCurves:s; maŋisboahtti guođđojuvvo badjel.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves:s leat doarjjejuvvon dušše mánnáfunkšuvnnat mat leat addojuvvon formelain; maŋisboahtti guođđojuvvo badjel.

prefigure-label-position-unsupported =
    { $subject }: doarjjekeahtes labelPosition '{ $labelPosition }' dása { $labelKind ->
        [line-family] linnjájoavkku namahus
       *[point] čuoggá namahus
    }; geavahuvvo standárda PreFigure-vuolggasadji.

prefigure-fill-style-unsupported = { $subject }: deavdinstiila '{ $fillStyle }' ii leat doarjjejuvvon PreFigure:s; geavahuvvo dievva deavdin.

prefigure-line-style-unknown = { $subject }: dovdameahttun linnjástiila '{ $lineStyle }' guođđojuvvui eret PreFigure-buvttadeamis.

prefigure-marker-style-mapped-to-diamond = { $subject }: mearkastiila '{ $markerStyle }' sirdojuvvui PreFigure-stiilii 'diamond'.

prefigure-marker-style-unsupported = { $subject }: mearkastiila '{ $markerStyle }' ii leat doarjjejuvvon PreFigure:s; geavahuvvo standárdastiila.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: gustohis `ref`; ulbmila ii sáhte gávdnat. Mearkkašupmi guođđojuvvo eret.

annotation-ref-multiple-targets = `<annotation>`: `ref` čujuhii máŋgga ulbmilii; geavahuvvo vuosttaš.

annotation-ref-outside-graph = `<annotation>`: gustohis `ref`; ulbmil lea olggobealde gráfa mas dat lea. Mearkkašupmi guođđojuvvo eret.

annotation-ref-unsupported-target = `<annotation>`: gustohis `ref`; ulbmil ii leat doarjjejuvvon gráfalaš objeakta prefigure-nuppástuhttimis. Mearkkašupmi guođđojuvvo eret.

annotation-text-missing = `<annotation>`: `text` váilu dahje lea guoros; buvttaduvvo guoros teaksta.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Birrasorjavašvuohta lea gávdnon.
       *[other] Birrasorjavašvuohta gávdnon mas lea mielde `<{ $componentType }>`-komponeanta.
    }

reference-no-referent = Ii gávdnon čujuhusa oaivvildeaddji: `{ $reference }`

reference-multiple-referents = Gávdnojedje máŋga čujuhusa oaivvildeaddji: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Gustohis hápmi attribuhttii { $attribute } dán alde: `<{ $componentType }>`.

children-invalid = Gustohis mánát dása `<{ $componentType }>`: gávdnojedje gustohis mánát: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Gustohis árvu `{ $value }` attribuhttii `{ $attribute }`, geavahuvvo árvu `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML veršuvdna { $version } ii gávdnon.
       *[other] DoenetML veršuvdna { $version } ii gávdnon. Geavahuvvo veršuvdna { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Gustohis DoenetML: { $content }

parse-tag-missing-close-tag = Gustohis DoenetML: gilkoris `{ $tag }` ii leat gokčangilkor. Vurdojuvvui ieš gokčaseaddji gilkor dahje `</{ $tagName }>`-gilkor.

parse-tag-error = Gustohis DoenetML: meattáhus gilkoris `<{ $tagName }>`

parse-attribute-missing-value = Gustohis DoenetML: gustohis attribuhtas `{ $attribute }` orru váilume árvu.

parse-attribute-invalid = Gustohis DoenetML: gustohis attribuhtta `{ $attribute }`

parse-attribute-value-invalid = Gustohis DoenetML: gustohis attribuhttaárvu `{ $value }`

parse-attribute-value-quote-mismatch = Gustohis DoenetML: gustohis attribuhttaárvu `{ $value }`. Sitáhtamearkkat eai heive oktii. Orru váilume `{ $quote }`

parse-open-tag-name-missing = Gustohis DoenetML: gávdnui gilkor mas ii leat namma, ovdamearkka dihte `<`

parse-tag-not-closed = Gustohis DoenetML: gilkor `{ $tag }` ii gokčojuvvon (orru váilume `>`).

parse-self-closing-tag-name-missing = Gustohis DoenetML: gávdnui gilkor mas ii leat namma `<{ $content }>`

parse-self-closing-tag-not-closed = Gustohis DoenetML: gilkor `{ $tag }` ii gokčojuvvon (orru váilume `/>`).

parse-tag-invalid-attributes = Gustohis DoenetML: gilkor `{ $tag }` ii leat gustovaš. Das sáhttet leat gustohis attribuhtat.

parse-close-tag-name-missing = Gustohis DoenetML: gávdnui gokčangilkor mas ii leat namma, ovdamearkka dihte `</`

parse-attribute-value-unquoted = Attribuhttaárvvut fertejit leat sitáhtamearkkaid siste: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Gustohis DoenetML: gávdnui gokčangilkor `{ $tag }`, muhto ii gávdnon vástideaddji rahpangilkor

parse-close-tag-mismatched = Gustohis DoenetML: gokčangilkor ii heive. Vurdojuvvui `</{ $expected }>`. Gávdnui `{ $found }`

parser-node-unconvertible = Ii sáhttán nuppástuhttit čuoggá { $node } Dast-čuoggán.

## Names

name-attribute-invalid =
    Gustohis attribuhtta name='{ $name }'. { $reason ->
        [characters] Namain sáhttet leat dušše bustávat, logut, vuolesárgát dahje sárgát.
       *[start] Namat fertejit álgit bustávain.
    }

component-name-invalid-start = Gustohis komponeantanamma "{ $name }". Namat fertejit álgit bustávain.

## `<answer>` sugar

answer-video-watched-missing-video = Answer mas lea šládja videoWatched ferte leat attribuhtta video

answer-video-watched-video-not-reference = Answer mas lea šládja videoWatched ferte leat attribuhtta video mii lea čujuhus

answer-name-not-single-text = Answer attribuhtas name ferte leat okta teakstamánná

## Referencing another document

external-doenetml-recursion-limit = Ii sáhte viežžat olgguldas DoenetML:a danne go leat beare máŋga rekursiivvalaš dási. Leago dás birračujuhus?

external-doenetml-unavailable = Ii sáhte viežžat DoenetML:a dás { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Gustohis DoenetML vižžojuvvon dás { $attribute }="{ $uri }": dat ii heiven komponeantašládjii "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribuhtta `{ $from }` lea boarásmuvvan; geavat baicce `{ $to }`.
       *[other] [deprecation] Attribuhtta `{ $from }` dán alde `<{ $component }>` lea boarásmuvvan; geavat baicce `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribuhtta `{ $from }` lea boarásmuvvan iige váldojuvvo vuhtii danne go maiddái `{ $to }` lea addojuvvon.
       *[other] [deprecation] Attribuhtta `{ $from }` dán alde `<{ $component }>` lea boarásmuvvan iige váldojuvvo vuhtii danne go maiddái `{ $to }` lea addojuvvon.
    }

deprecated-attribute-ignored = [deprecation] Attribuhtta `{ $attribute }` dán alde `<{ $component }>` lea boarásmuvvan iige váldojuvvo vuhtii.

deprecated-attribute-to-child = [deprecation] Attribuhtta `{ $attribute }` dán alde `<{ $component }>` lea boarásmuvvan; geavat baicce `<{ $child }>`-máná.

deprecated-attribute-value-renamed = [deprecation] Árvu `{ $value }` attribuhtas `{ $attribute }` dán alde `<{ $component }>` lea boarásmuvvan; geavat baicce `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` sáhttá dahkat máŋggaidlogu dušše eŋgelasgillii, nu ahte dan teaksta báhcá rievdatkeahttá dokumeanttas mii lea čállojuvvon dán gillii: { $locale }. Čále máŋggaidlogu hámi njuolga, dahje atte dan attribuhtain `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemeanta `<{ $tag }>` ii leat dovdojuvvon Doenet-elemeanta.

schema-element-not-allowed-at-root = Elemeanta `<{ $tag }>` ii leat lobálaš dokumeantta ruohtasis.

schema-element-not-allowed-inside = Elemeanta `<{ $tag }>` ii leat lobálaš dán siste: `<{ $parent }>`.

schema-attribute-unrecognized = Elemeanttas `<{ $tag }>` ii leat attribuhtta nammii `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribuhtta `{ $attribute }` elemeanttas `<{ $tag }>` ferte leat listu mas juohke lahttu lea okta dáin: { $allowed }
       *[other] Attribuhtta `{ $attribute }` elemeanttas `<{ $tag }>` ferte leat okta dáin: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Gustohis variántanamma dása select. Variántanamma { $variantName } lea { $numOptions } molssaeavttus, muhto válljenlohku lea { $numToSelect }.

select-variant-name-without-options = Muhtin variánttat leat addojuvvon dása select, muhto molssaeavttut eai leat addojuvvon vejolaš variántanammii: { $variantName }.

select-variant-name-not-possible = Variántanamma { $variantName } mii lea addojuvvon dása select ii leat vejolaš variántanamma.

select-too-few-options = Ii sáhte válljet { $numToSelect } komponeantta dušše { $numOptions } gaskkas.

select-from-sequence-too-few-values = Ii sáhte válljet { $numToSelect } árvvu ráiddus mas lea guhkkodat { $length }.

select-from-sequence-indices-count-mismatch = Indeavssaid lohku mii lea addojuvvon dása select ferte heivet válljenlohkui

select-from-sequence-indices-not-integers = Buot indeavssat mat leat addojuvvon dása select fertejit leat ollislogut

select-from-sequence-index-excluded = Addojuvvon selectfromsequence-indeaksa lei olggušteapmi

select-from-sequence-indices-excluded-combination = Addojuvvon selectfromsequence-indeavssat ledje olggušteapmi kombinašuvdna

select-from-sequence-coprime-not-positive-integers = Ii sáhte válljet oktasašfáktorkeahtes kombinašuvnnaid danne go eai válljejuvvo positiivvalaš ollislogut.

select-from-sequence-coprime-common-factor = Ii sáhte válljet oktasašfáktorkeahtes loguid. Buot vejolaš árvvuin lea oktasaš fáktor. ("from" dahje "to" addojuvvon árvvut fertejit leat oktasašfáktorkeahtes "step" ektui.)

select-from-sequence-coprime-single-number = Ii sáhte válljet oktasašfáktorkeahtes kombinašuvnnaid ovtta logus mii ii leat 1.

select-from-sequence-excluded-too-many-combinations = Eanet go 70% kombinašuvnnain olggušteappojuvvo selectFromSequence:s

select-from-sequence-coprime-none-found = Ii sáhttán válljet oktasašfáktorkeahtes loguid. Buot vejolaš árvvuin lea oktasaš fáktor.

select-from-sequence-too-few-unique-values = Ii sáhte válljet { $numToSelect } áidnalunddot árvvu ráiddus mas lea guhkkodat { $numPossibleValues }

select-prime-numbers-too-few-values = Ii sáhte válljet { $numToSelect } árvvu primalohkolisttus mas lea guhkkodat { $numValues }

select-prime-numbers-values-count-mismatch = Árvvuid lohku mii lea addojuvvon dása select ferte heivet válljenlohkui

select-prime-numbers-values-not-prime = Buot árvvut mat leat addojuvvon primalogu válljemii fertejit leat primalohkolisttus

select-prime-numbers-values-excluded-combination = Addojuvvon selectPrimeNumbers-árvvut ledje olggušteapmi kombinašuvdna

select-prime-numbers-excluded-too-many-combinations = Eanet go 70% kombinašuvnnain olggušteappojuvvo selectPrimeNumbers:s

select-random-combination-fluke = Hui eahpejáhkehahtti soaittáhagas ii sáhttán válljet sáhtolaš árvvuid kombinašuvnna

select-random-value-fluke = Hui eahpejáhkehahtti soaittáhagas ii sáhttán válljet sáhtolaš árvvu
