# Luganda diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Where English separates a singular from a plural only in the verb — "is
# ignored" against "are ignored" — the Luganda verb takes its subject concord
# from the noun class rather than from the count, and the argument is a list
# either way. So those selects are dropped and the count argument goes unused.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } tebifaayo ng'obutonnyeze bwombi obw'enkomerero bulagiddwa

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } tebifaayo ng'akatonnyeze k'enkomerero n'akatonnyeze ak'omu makkati byombi bilagiddwa

line-segment-midpoint-offset-without-midpoint = midpointOffset tekikola nga tewali katonnyeze ak'omu makkati

## `<line>`

line-points-undetermined-dimensions = Olunyiriri luyita mu butonnyeze obutamanyiddwa obunene bwabwo.

line-points-too-few-dimensions = Olunyiriri lulina okuyita mu butonnyeze obulina waakiri obunene bubiri.

line-points-depend-on-variables = Olunyiriri luyita mu butonnyeze obwesigama ku bikyukakyuka: { $variables }.

line-equation-invalid-format = Endabika tetuufu ku kwenkanya kw'olunyiriri mu bikyukakyuka { $variable1 } ne { $variable2 }.

## `<ray>`

ray-overprescribed-through = Akasaale kalagiddwa ne through, endpoint ne direction byonna wamu. through elagiddwa tefaayo.

ray-dimension-mismatch = numDimensions tekituukagana mu kasaale.

## `<vector>`

vector-overprescribed-head = Vekita elagiddwa ne head, tail ne displacement byonna wamu. head elagiddwa tefaayo.

vector-dimension-mismatch = numDimensions tekituukagana mu vekita.

## Attracting and constraining

attract-to-without-nearest-point = Tekisoboka kusikirizibwa ku `<{ $component }>` kubanga terina kikyukakyuka ky'embeera nearestPoint.

constrain-to-without-nearest-point = Tekisoboka kukwatibwa ku `<{ $component }>` kubanga terina kikyukakyuka ky'embeera nearestPoint.

constrain-to-interior-without-nearest-point = Tekisoboka kukwatibwa munda mu `<{ $component }>` kubanga terina kikyukakyuka ky'embeera nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition tefaayo ku choiceInput etali ya lunyiriri lumu

## Ordering children by index

choice-input-indices-count-mismatch = Obubonero obulagiddwa ku choiceInput tebufaayo kubanga omuwendo gw'obubonero tegutuukagana n'omuwendo gw'abaana ba choice.

pretzel-indices-count-mismatch = Obubonero obulagiddwa ku problem tebufaayo kubanga omuwendo gw'obubonero tegutuukagana n'omuwendo gw'abaana ba problem.

shuffle-indices-count-mismatch = Obubonero obulagiddwa ku shuffle tebufaayo kubanga omuwendo gw'obubonero tegutuukagana n'omuwendo gw'ebintu.

indices-ignored-out-of-range = Obubonero obulagiddwa ku { $component } tebufaayo kubanga obumu ku bubonero buli ebweru w'ekigero.

pretzel-indices-repeated = Obubonero obulagiddwa ku pretzel tebufaayo kubanga obumu ku bubonero buddiŋŋanyiziddwa.

pretzel-circuit-first-index = Obubonero obulagiddwa ku pretzel mu mutindo circuit tebufaayo kubanga akabonero akasooka kalina okuba 1.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` okukola n'abaana ab'ekika ky'ebigambo, engeri `type` erina okulagibwa.

invalid-type-defaulting-to-math = type { $type } tetuufu ku kintu { $component }. Erina okuba emu ku math, text, number oba boolean. Eteekebwako math.

string-not-valid-component-to-arrange = Ebigambo "{ $value }" si kintu kya { $component } ekituufu. Tekifaayo.

## Types and variables

invalid-type-defaulting-to-number = type { $type } tetuufu, type eteekebwako number.

invalid-variable-value = Omuwendo gw'ekikyukakyuka si mutuufu: `{ $value }`

## Variants

variant-index-must-be-number = Akabonero k'engeri { $index } kalina okuba omuwendo

variant-index-must-be-integer = Akabonero k'engeri { $index } kalina okuba omuwendo omulamba

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` tekikoleddwa n'ebipimo ebikakafu. Obugazi buteekebwako mu bitundu.

side-by-side-absolute-margins = `<{ $component }>` tekikoleddwa n'ebipimo ebikakafu. Ensalo ziteekebwako mu bitundu.

side-by-side-no-block-child = `<{ $component }>` tetuufu: kirina okuba n'omwana omu waakiri ow'ekika kya bbulooka.

## `<label>`

label-for-ignored-on-graphical = Engeri `for` ku `<label>` ey'ekifaananyi tefaayo.

label-for-must-resolve-to-one = Engeri `for` ku `<label>` erina okulaga ekintu kimu kyokka.

label-for-unresolved = Engeri `for` ku `<label>` teyasobodde kulaga kintu kyonna.

label-for-answer-with-authored-inputs = Engeri `for` ku `<label>` eraga `<answer>` erina ebiyingizibwa ebiwandiikiddwa; laga ekiyingizibwa kyennyini.

label-for-answer-without-input = Engeri `for` ku `<label>` eraga `<answer>` etalina kiyingizibwa kya kutuuma.

label-for-must-reference-input-or-answer = Engeri `for` ku `<label>` erina okulaga ekiyingizibwa oba eky'okuddamu.

## Accessibility

accessibility-short-description-or-decorative = Olw'okutuukirira, `<{ $component }>` kirina okuba n'ennyinyonnyola empi oba kirageddwa nga kya kuwoomya.

accessibility-video-short-description = Olw'okutuukirira, `<video>` erina okuba n'ennyinyonnyola empi.

accessibility-input-short-description-or-label = Olw'okutuukirira, `<{ $component }>` kirina okuba n'ennyinyonnyola empi oba erinnya.

accessibility-answer-input-short-description-or-label = Olw'okutuukirira, `<answer>` ekola ekiyingizibwa erina okuba n'ennyinyonnyola empi oba erinnya.

accessibility-short-description-contains-math = Ennyinyonnyola empi terina kubaamu bintu bya kubala nga `<{ $component }>`. Nnyonnyola okubala kwonna n'ebigambo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } terina njawulo emala ku bigambo by'omutwe gw'ekitundu (embeera ey'ekizikiza) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kyetaaga waakiri { $threshold }:1).
       *[other] { $colorName } terina njawulo emala ku bigambo by'omutwe gw'ekitundu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kyetaaga waakiri { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` eyita mu butonnyeze { $count } tennakolebwa ng'obutonnyeze obwo tebulina miwendo gya kubala.

circle-too-many-through-points = Tekisoboka kubala nkulungo eyita mu butonnyeze obusukka mu 3.

circle-overprescribed-radius-center-points = Tekisoboka kubala nkulungo erina lediyaasi, wakati n'obutonnyeze obw'okuyitamu byonna nga bilagiddwa.

circle-center-with-multiple-points = Tekisoboka kubala nkulungo erina wakati alagiddwa nga eyita mu butonnyeze obusukka mu 1.

circle-radius-too-small = Tekisoboka kubala nkulungo: olw'okuba ebbanga wakati w'obutonnyeze bwombi ni { $distance }, lediyaasi { $radius } elagiddwa ntono nnyo.

circle-radius-with-many-points = Tekisoboka kukola nkulungo eyita mu butonnyeze obusukka mu bubiri erina lediyaasi elagiddwa.

circle-invalid-center-or-through-points = Wakati w'enkulungo oba obutonnyeze bwayo obw'okuyitamu si butuufu.

circle-radius-center-with-multiple-points = Tekisoboka kubala lediyaasi y'enkulungo erina wakati alagiddwa nga eyita mu butonnyeze obusukka mu 1.

circle-change-radius-non-numerical = Tekisoboka kukyusa lediyaasi y'enkulungo eyita mu butonnyeze obutalina miwendo gya kubala

circle-radius-with-points-non-numerical = Tekisoboka kukola nkulungo eyita mu butonnyeze obusukka mu bumu erina lediyaasi elagiddwa nga tewali miwendo gya kubala.

circle-change-center-non-numerical = Okukyusa wakati w'enkulungo eyita mu butonnyeze obutalina miwendo gya kubala tekunnakolebwa.

## `<function>`

function-domain-insufficient-dimensions = Obunene bw'ekitundu ky'omulimu tebumala. Ekitundu kirina amabanga { $intervals } naye omulimu gulina ebiyingizibwa { $inputs }.

function-domain-invalid-format = Endabika y'ekitundu ky'omulimu tetuufu.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Enkomerero ya waggulu ey'omulimu etali ya kubala tefaayo.
        [minimum] Enkomerero ya wansi ey'omulimu etali ya kubala tefaayo.
        [extremum] Enkomerero y'omulimu etali ya kubala tefaayo.
        [point] Akatonnyeze k'omulimu akatali ka kubala tekafaayo.
        [slope] Okusenza kw'omulimu okutali kwa kubala tekufaayo.
       *[other] { $type } ey'omulimu etali ya kubala tefaayo.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Enkomerero ya waggulu ey'omulimu enkalu tefaayo.
        [minimum] Enkomerero ya wansi ey'omulimu enkalu tefaayo.
        [extremum] Enkomerero y'omulimu enkalu tefaayo.
        [point] Akatonnyeze k'omulimu akakalu tekafaayo.
       *[other] { $type } ey'omulimu enkalu tefaayo.
    }

function-points-too-close = Omulimu gulina obutonnyeze bubiri obuli kumpi nnyo. Omulimu tegusobola kunnyonnyolwa.

function-iterates-input-output-mismatch = Okuddiŋŋana kw'omulimu kusoboka bwe kuba nti omuwendo gw'ebiyingizibwa gwenkanankana n'omuwendo gw'ebifuluma. Omulimu guno gulina ebiyingizibwa { $inputs } n'ebifuluma { $outputs }.

## `<sequence>`

sequence-invalid-length = Obuwanvu bw'olusa si butuufu. Bulina okuba omuwendo omulamba ogutali wansi wa zeero.

sequence-invalid-step = Ekigere ky'olusa si kituufu. Mu lusa olw'ekika { $type } kirina okuba omuwendo.

sequence-invalid-endpoint-number = "{ $attribute }" ey'olusa lw'emiwendo si ntuufu. Erina okuba omuwendo.

sequence-invalid-endpoint-letters = "{ $attribute }" ey'olusa lw'ennukuta si ntuufu. Erina okuba ennukuta.

sequence-invalid-endpoint = "{ $attribute }" ey'olusa si ntuufu.

select-from-sequence-coprime-not-numbers = coprime tefaayo kubanga si miwendo egirondebwa

select-from-sequence-coprime-with-exclude-combinations = coprime tefaayo kubanga excludeCombinations elagiddwa

## Resolving a `target`

target-not-found = target tetuufu ku `<{ $source }>`: ekigendererwa tekizuuliddwa.

target-state-variable-not-found = target tetuufu ku `<{ $source }>`: ekikyukakyuka ky'embeera ekiyitibwa "{ $property }" tekizuuliddwa ku `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Ebikyukakyuka bya `<odeSystem>` birina okwawukana ku kikyukakyuka ekyetwala.

ode-system-duplicate-variable-names = Tekisoboka kunnyonnyola mirimu gya ODE RHS egirina amannya g'ebikyukakyuka agaddiŋŋanyiziddwa.

ode-system-rhs-function-error = Tekisoboka kunnyonnyola mulimu gwa ODE RHS. Ensobi mu kukola omulimu gwa mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Tekisoboka kunnyonnyola nsonda wakati w'ennyiriri { $count }

angle-invalid-through-point = Akatonnyeze tekatuufu mu through eya `<angle>`

parabola-vertex-too-many-points = Paraboola erina enkomerero eyita mu butonnyeze obusukka mu 1 tennakolebwa.

parabola-too-many-points = Paraboola eyita mu butonnyeze obusukka mu 3 tennakolebwa.

intersection-too-many-items = Okusisinkana kw'ebintu ebisukka mu bibiri tekunnakolebwa

## Other math components

ionic-compound-not-two-ions = Ekitabuliddwa kya ayoni ekisukka mu ayoni bbiri tekinnakolebwa.

ionic-compound-needs-cation-and-anion = Ekitabuliddwa kya ayoni kikoleddwa ku katiyoni emu ne anayoni emu zokka.

solve-equations-cannot-evaluate = Tekisoboka kugonjoola kwenkanya kubanga okwenkanya tekusobodde kubalibwa: { $equation }

math-operators-operand-number-required = operandNumber erina okulagibwa nga eggyibwako operandi ey'okubala.

eigen-decomposition-failed = Tekisoboka kubala miwendo gya eigen egya matiriki

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameeta { $parameters } tezirabika mu ndabika, bwe kityo zijja kutuukagana n'obwereere buli kiseera.

## `<graph>`

graph-grid-invalid = `<graph>`: tekisoboka kutegeera grid="{ $grid }". Erina okuba none, medium, dense, oba emiwendo ebiri emirungi egyawuliddwa n'ekifo, nga grid="1 0.5". Tewali giriidi ekubibwa.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" tewagirwa mu mulaga wa prefigure; embeera ey'oku ddyo ekozesebwa.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" tewagirwa mu mulaga wa prefigure; embeera ey'oku ntikko ekozesebwa.

prefigure-invalid-axis-bounds = `<graph>`: ensalo z'akasaale si ntuufu ku nkyukakyuka ya prefigure; bbox (-10,-10,10,10) ekozesebwa.

prefigure-invalid-width = `<graph>`: obugazi si butuufu ku nkyukakyuka ya prefigure; obugazi bw'ekifaananyi 425 bukozesebwa.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio si ntuufu ku nkyukakyuka ya prefigure; ekigero 1 kikozesebwa.

prefigure-grid-spacing-too-fine = `<graph>`: amabanga ga giriidi matono nnyo ku nsalo z'akasaale; giriidi elekeddwa mu mulaga wa prefigure.

prefigure-annotations-not-rendered = `<graph>`: ebijjukizo tebijja kulagibwa ng'omulaga wa PreFigure takozesebwa.

multiple-annotations-children = Abaana bangi aba `<annotations>` bazuuliddwa mu `<graph>`; bonna tebafaayo okuggyako ow'enkomerero.

## Referring to other components

copy-unrecognized-component-type = Tekisoboka kugaziya oba kukoppa kika kya kintu ekitamanyiddwa: { $type }.

copy-prop-not-found = Engeri { $property } tezuuliddwa ku kintu eky'ekika { $component }

collect-no-source = Tewali nsibuko ezuuliddwa ku collect.

collect-invalid-component-type = Tekisoboka kukuŋŋaanya bintu bya kika `<{ $component }>` kubanga kika kya kintu ekitali kituufu.

reference-index-unavailable = Tekisoboka kulaga kabonero `{ $reference }`

## `<callAction>`

component-action-unavailable = Tekisoboka kuyita { $action } ku kintu `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Endabika ya data si ntuufu. Ennyiriri zirina obuwanvu obutatuukagana. Kizuuliddwa ku componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data erina amannya g'ennyiriri eziyimiridde agaddiŋŋanyiziddwa. Kizuuliddwa ku componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data ebulwako erinnya ly'olunyiriri oluyimiridde. Kizuuliddwa ku componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award emu ey'eky'okuddamu kino yesigama ku ky'okuddamu ekyaweerezebwa tagi answer yennyini, era ekyo kijja kuleeta embeera etasuubirwa.

answer-max-num-attempts-in-section-wide-check-work = Okuteeka `maxNumAttempts` ku `<answer>` eri munda mu kisenge ekirina `sectionWideCheckWork` tekikola kintu, kubanga ekisenge ekyo kye kifuga omuwendo gw'emirundi. Teeka `maxNumAttempts` ku kisenge kyennyini.

nested-section-wide-check-work-max-num-attempts = Okuteeka `maxNumAttempts` ku kisenge ekirina `sectionWideCheckWork` ekiri munda mu kisenge ekirala ekirina `sectionWideCheckWork` tekikola kintu, kubanga ekisenge eky'ebweru kye kifuga omuwendo gw'emirundi. Teeka `maxNumAttempts` ku kisenge eky'ebweru.

answer-attributes-need-symbolic-equality = Engeri { $attributes } tezijja kukola kintu nga symbolicEquality teteekeddwako.

answer-invalid-type = Ekika tekituufu ku ky'okuddamu: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Olw'okuba ekintu `<{ $component }>` tekirina linnya, tekisobola kukozesebwa nga ngeri ya module

module-attribute-name-already-defined = Ekintu `<{ $component } name="{ $name }">` tekisobola kukozesebwa nga ngeri ya module kubanga ekika ky'ekintu `<module>` kirina dda engeri eyitibwa "{ $name }".

conditional-content-condition-ignored = Engeri `condition` tefaayo ku kintu `<conditionalContent>` ekirina abaana ba case oba else.

slider-markers-type-mismatch = Ekika ky'obubonero tekituukagana n'ekika kya slider.

pretzel-problem-needs-statement-and-answer = pretzel tetuufu: buli `<problem>` erina okuba n'`<statement>` emu n'`<answer>` emu.

pretzel-circuit-first-problem-distractor = pretzel tetuufu: mu mode="circuit", `<problem>` esooka tesobola kuba ya kubuzaabuza.

## Attribute values

attribute-invalid-values = Emiwendo { $values } si mituufu ku ngeri `{ $attribute }`; tegifaayo.

attribute-must-be-references = Omuwendo `{ $value }` si mutuufu ku ngeri `{ $attribute }`. Engeri erina okukolebwa n'obulaga obutandika ne `$`.

math-input-invalid-function-names = <mathInput>: amannya g'emirimu agatali matuufu mu { $attribute } tegafaayo: { $names }. Ekitundu ekiraga ekya buli linnya kirina okuba n'ennukuta 2 waakiri (ennukuta oba akalago); `|<mathspeak alternative>` esobola okugoberera.

## Building components from the source

component-type-invalid = Ekika ky'ekintu tekituufu: `<{ $componentType }>`

attribute-repeated = Engeri { $attribute } tesobola kuddiŋŋanyizibwa.

attribute-invalid-for-component = Engeri "{ $attribute }" tetuufu ku kintu eky'ekika `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Ennyinyonnyola y'endabika { $styleNumber } terina njawulo emala ku { $context ->
        [text-on-background] langi y'ebigambo ku langi y'emabega
        [high-contrast] langi ey'enjawulo ennene ku lubaawo
        [line] langi y'olunyiriri ku lubaawo
        [marker] langi y'akabonero ku lubaawo
       *[text-on-canvas] langi y'ebigambo ku lubaawo
    }{ $mode ->
        [dark] { " (embeera ey'ekizikiza)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kyetaaga waakiri { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Wadde ennyinyonnyola y'endabika { $styleNumber } yalaga langi eziwa enjawulo emala mu mbeera ey'omusana, langi ez'embeera ey'ekizikiza ezivaamu tezirina njawulo emala ku langi y'ebigambo ku langi y'emabega ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kyetaaga waakiri { $threshold }:1). { $suggestion ->
        [available] Okukakasa enjawulo emala mu mbeera ey'ekizikiza, yongera enjawulo ey'embeera ey'omusana (ng'ekyokulabirako teeka { $lightAttribute }="{ $lightColor }") oba kyusa langi ey'embeera ey'ekizikiza (ng'ekyokulabirako teeka { $darkAttribute }="{ $darkColor }").
       *[none] Okukakasa enjawulo emala mu mbeera ey'ekizikiza, yongera enjawulo ey'embeera ey'omusana oba kyusa langi ezivaamu ne textColorDarkMode ne/oba backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Wadde ennyinyonnyola y'endabika { $styleNumber } yalaga langi y'ebigambo ewa enjawulo emala mu mbeera ey'omusana, langi y'ebigambo ey'embeera ey'ekizikiza evaamu terina njawulo emala ku lubaawo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kyetaaga waakiri { $threshold }:1). { $suggestion ->
        [available] Okukakasa enjawulo emala mu mbeera ey'ekizikiza, yongera enjawulo ey'embeera ey'omusana (ng'ekyokulabirako teeka textColor="{ $lightColor }") oba kyusa langi ey'embeera ey'ekizikiza (ng'ekyokulabirako teeka textColorDarkMode="{ $darkColor }").
       *[none] Okukakasa enjawulo emala mu mbeera ey'ekizikiza, yongera enjawulo ey'embeera ey'omusana oba kyusa langi evaamu ne textColorDarkMode.
    }

section-multiple-style-palettes = Ekitundu kisobola kulonda <stylePalette> emu yokka; ey'enkomerero ye ekozesebwa.

## Unique variants

variant-num-to-select-not-non-negative-integer = tekisoboka kunnyonnyola ngeri za njawulo eza { $component } kubanga numToSelect si muwendo mulamba ogutali wansi wa zeero.

variant-num-to-select-not-constant-number = tekisoboka kunnyonnyola ngeri za njawulo eza { $component } kubanga numToSelect si muwendo ogutakyuka.

variant-with-replacement-not-constant-boolean = tekisoboka kunnyonnyola ngeri za njawulo eza { $component } kubanga withReplacement si buliyaani etakyuka.

variant-select-weight-disables-unique = Engeri za njawulo eza select ziggalwawo bwe wabaawo okulonda okulina selectWeight oba selectForVariants ekulagiddwa

variant-coprime-undetermined = tekisoboka kunnyonnyola ngeri za njawulo eza { $component } kubanga tekisoboka kukakasa nti coprime bulimba buli kiseera.

variant-attribute-not-constant = tekisoboka kunnyonnyola ngeri za njawulo eza { $component } kubanga { $attribute } tenywevu.

variant-attribute-not-number = tekisoboka kunnyonnyola ngeri za njawulo eza { $component } kubanga { $attribute } si muwendo.

variant-attribute-wrong-type-for-sequence =
    tekisoboka kunnyonnyola ngeri za njawulo eza { $component } ez'ekika { $type } kubanga { $attribute } si { $expected ->
        [letters-combination] ntabula ya nnukuta
        [math-expression] bigambo bya kubala ebituufu
        [integer] muwendo mulamba
       *[number] muwendo
    }.

variant-length-not-integer = tekisoboka kunnyonnyola ngeri za njawulo eza { $component } kubanga length si muwendo mulamba.

variant-sort-not-implemented = engeri za njawulo eza { $component } ezirina sort tezinnakolebwa

variant-exclude-combinations-not-implemented = engeri za njawulo eza { $component } ezirina excludeCombinations tezinnakolebwa

variant-math-exclude-not-implemented = engeri za njawulo eza { $component } ez'ekika math ezirina exclude tezinnakolebwa

variant-non-constant-exclude-not-implemented = engeri za njawulo eza { $component } ezirina exclude etanywevu tezinnakolebwa

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: tekiwagirwa mu mulaga wa graph prefigure; omuzzukulu abuukiddwa.

prefigure-descendant-invalid-geometry = { $subject }: jiyomeetule etaliiko nsalo oba etatuukiridde; omuzzukulu abuukiddwa.

prefigure-curve-label-omitted = { $subject }: amannya tegawagirwa ku bintu bya kikoona ebikyusiddwa; erinnya lirekeddwa.

prefigure-curve-unsupported-definition-type = { $subject }: ekika ky'ennyinyonnyola y'omulimu gw'ekikoona '{ $definitionType }' tekiwagirwa; omuzzukulu abuukiddwa.

prefigure-region-flip-functions-unsupported = { $subject }: engeri flipFunctions ku regionBetweenCurves tewagirwa; omuzzukulu abuukiddwa.

prefigure-region-non-formula-child = { $subject }: emirimu gy'abaana ab'ekika formula gyokka gye giwagirwa ku regionBetweenCurves; omuzzukulu abuukiddwa.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' tewagirwa ku { $labelKind ->
        [line-family] erinnya ly'ekika ky'olunyiriri
       *[point] erinnya ly'akatonnyeze
    }; entegeka ya PreFigure ekozesebwa.

prefigure-fill-style-unsupported = { $subject }: endabika y'okujjuza '{ $fillStyle }' tewagirwa PreFigure; edda ku kujjuza kwa langi emu.

prefigure-line-style-unknown = { $subject }: endabika y'olunyiriri '{ $lineStyle }' temanyiddwa era erekeddwa mu bivaamu bya PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: endabika y'akabonero '{ $markerStyle }' egeraageranyiziddwa n'endabika ya PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: endabika y'akabonero '{ $markerStyle }' tewagirwa PreFigure; endabika eriwo edda ekozesebwa.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` tetuufu; ekigendererwa tekisobola kumanyibwa. Ekijjukizo kirekeddwa.

annotation-ref-multiple-targets = `<annotation>`: `ref` yalaga ebigendererwa bingi; ekigendererwa ekisooka kye kikozesebwa.

annotation-ref-outside-graph = `<annotation>`: `ref` tetuufu; ekigendererwa kiri ebweru wa girafu ekikirimu. Ekijjukizo kirekeddwa.

annotation-ref-unsupported-target = `<annotation>`: `ref` tetuufu; ekigendererwa si kintu kya kifaananyi ekiwagirwa mu nkyukakyuka ya prefigure. Ekijjukizo kirekeddwa.

annotation-text-missing = `<annotation>`: `text` tewali oba nkalu; ebigambo ebikalu bye bifulumizibwa.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Okwesigama okwetooloola kuzuuliddwa.
       *[other] Okwesigama okwetooloola okuzingiramu ekintu `<{ $componentType }>` kuzuuliddwa.
    }

reference-no-referent = Tewali kizuuliddwa ku kulaga: `{ $reference }`

reference-multiple-referents = Ebintu bingi bizuuliddwa ku kulaga: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Endabika tetuufu ku ngeri { $attribute } eya `<{ $componentType }>`.

children-invalid = Abaana si batuufu ku `<{ $componentType }>`: Abaana abatali batuufu bazuuliddwa: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Omuwendo `{ $value }` si mutuufu ku ngeri `{ $attribute }`, omuwendo `{ $default }` gukozesebwa

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML engeri { $version } tezuuliddwa.
       *[other] DoenetML engeri { $version } tezuuliddwa. Edda ku ngeri { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML tetuufu: { $content }

parse-tag-missing-close-tag = DoenetML tetuufu: Tagi `{ $tag }` terina tagi ya kuggalawo. Twali tusuubira tagi eyeeggalawo oba tagi `</{ $tagName }>`.

parse-tag-error = DoenetML tetuufu: Ensobi mu tagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML tetuufu: Engeri `{ $attribute }` etali ntuufu erabika ng'ebulwako omuwendo.

parse-attribute-invalid = DoenetML tetuufu: Engeri `{ $attribute }` tetuufu

parse-attribute-value-invalid = DoenetML tetuufu: Omuwendo gw'engeri `{ $value }` si mutuufu

parse-attribute-value-quote-mismatch = DoenetML tetuufu: Omuwendo gw'engeri `{ $value }` si mutuufu. Obubonero bw'ebigambo tebutuukagana. Kirabika `{ $quote }` ebuze

parse-open-tag-name-missing = DoenetML tetuufu: Tagi etaliiko linnya ezuuliddwa, ng'ekyokulabirako `<`

parse-tag-not-closed = DoenetML tetuufu: Tagi `{ $tag }` teggaliddwawo (kirabika `>` ebuze).

parse-self-closing-tag-name-missing = DoenetML tetuufu: Tagi etaliiko linnya ezuuliddwa `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML tetuufu: Tagi `{ $tag }` teggaliddwawo (kirabika `/>` ebuze).

parse-tag-invalid-attributes = DoenetML tetuufu: Tagi `{ $tag }` tetuufu. Oboolyawo erina engeri ezitali ntuufu.

parse-close-tag-name-missing = DoenetML tetuufu: Tagi ey'okuggalawo etaliiko linnya ezuuliddwa, ng'ekyokulabirako `</`

parse-attribute-value-unquoted = Emiwendo gy'engeri girina okuteekebwa munda mu bubonero bw'ebigambo: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML tetuufu: Tagi ey'okuggalawo `{ $tag }` ezuuliddwa, naye tewali tagi ya kuggulawo etuukagana nayo

parse-close-tag-mismatched = DoenetML tetuufu: Tagi ey'okuggalawo tetuukagana. Twali tusuubira `</{ $expected }>`. Kizuuliddwa `{ $found }`

parser-node-unconvertible = Tekisobose kukyusa nnoodi { $node } okufuuka nnoodi ya Dast.

## Names

name-attribute-invalid =
    Engeri name='{ $name }' tetuufu. { $reason ->
        [characters] Amannya gasobola okuba n'ennukuta, emiwendo, obulago obw'omunda oba obulago bwokka.
       *[start] Amannya galina okutandika n'ennukuta.
    }

component-name-invalid-start = Erinnya ly'ekintu "{ $name }" si ttuufu. Amannya galina okutandika n'ennukuta.

## `<answer>` sugar

answer-video-watched-missing-video = Eky'okuddamu eky'ekika videoWatched kirina okuba n'engeri video

answer-video-watched-video-not-reference = Eky'okuddamu eky'ekika videoWatched kirina okuba n'engeri video eri okulaga

answer-name-not-single-text = Engeri name ey'eky'okuddamu erina okuba n'omwana text omu yekka

## Referencing another document

external-doenetml-recursion-limit = Tekisoboka kufuna DoenetML ey'ebweru olw'okuddiŋŋana okungi ennyo. Waliwo okulaga okwetooloola?

external-doenetml-unavailable = Tekisoboka kufuna DoenetML okuva ku { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML eyafunibwa okuva ku { $attribute }="{ $uri }" si ntuufu: tetuukagana n'ekika ky'ekintu "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Engeri `{ $from }` ekaddiye; kozesa `{ $to }`.
       *[other] [deprecation] Engeri `{ $from }` ku `<{ $component }>` ekaddiye; kozesa `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Engeri `{ $from }` ekaddiye era tefaayo kubanga `{ $to }` nayo elagiddwa.
       *[other] [deprecation] Engeri `{ $from }` ku `<{ $component }>` ekaddiye era tefaayo kubanga `{ $to }` nayo elagiddwa.
    }

deprecated-attribute-ignored = [deprecation] Engeri `{ $attribute }` ku `<{ $component }>` ekaddiye era tefaayo.

deprecated-attribute-to-child = [deprecation] Engeri `{ $attribute }` ku `<{ $component }>` ekaddiye; kozesa omwana `<{ $child }>`.


## Language coverage

pluralize-english-only = `<pluralize>` esobola okukola obungi mu Lungereza kyokka, bwe kityo ebigambo byayo bisigala nga bwe biri mu kiwandiiko ekyawandiikibwa mu { $locale }. Wandiika endabika y'obungi ggwe kennyini, oba gitekeko ku ngeri `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ekintu `<{ $tag }>` si kintu kya Doenet ekimanyiddwa.

schema-element-not-allowed-at-root = Ekintu `<{ $tag }>` tekikkirizibwa ku musingi gw'ekiwandiiko.

schema-element-not-allowed-inside = Ekintu `<{ $tag }>` tekikkirizibwa munda mu `<{ $parent }>`.

schema-attribute-unrecognized = Ekintu `<{ $tag }>` tekirina ngeri eyitibwa `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Engeri `{ $attribute }` ey'ekintu `<{ $tag }>` erina okuba olukalala nga buli kintu kirimu kimu ku bino: { $allowed }
       *[other] Engeri `{ $attribute }` ey'ekintu `<{ $tag }>` erina okuba kimu ku bino: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Erinnya ly'engeri si ttuufu ku select. Erinnya ly'engeri { $variantName } lirabika mu bulonzi { $numOptions } naye omuwendo gw'okulonda ni { $numToSelect }.

select-variant-name-without-options = Engeri ezimu zilagiddwa ku select naye tewali kulonda kulagiddwa ku rinnya ly'engeri erisoboka: { $variantName }.

select-variant-name-not-possible = Erinnya ly'engeri { $variantName } eryalagiddwa ku select si rinnya lya ngeri erisoboka.

select-too-few-options = Tekisoboka kulonda bintu { $numToSelect } okuva mu { $numOptions } byokka.

select-from-sequence-too-few-values = Tekisoboka kulonda miwendo { $numToSelect } mu lusa olulina obuwanvu { $length }.

select-from-sequence-indices-count-mismatch = Omuwendo gw'obubonero obulagiddwa ku select gulina okutuukagana n'omuwendo gw'okulonda

select-from-sequence-indices-not-integers = Obubonero bwonna obulagiddwa ku select bulina okuba emiwendo emiramba

select-from-sequence-index-excluded = Akabonero ka selectfromsequence akaggyiddwawo kalagiddwa

select-from-sequence-indices-excluded-combination = Obubonero bwa selectfromsequence obwali ntabula eyaggyibwawo bulagiddwa

select-from-sequence-coprime-not-positive-integers = Tekisoboka kulonda ntabula za miwendo egitagabana kubanga si miwendo mirungi mirambe egirondebwa.

select-from-sequence-coprime-common-factor = Tekisoboka kulonda miwendo egitagabana. Emiwendo gyonna egisoboka gigabana omugabanya gumu. (Emiwendo egilagiddwa egya "from" oba "to" girina obutagabana ne "step".)

select-from-sequence-coprime-single-number = Tekisoboka kulonda ntabula za miwendo egitagabana okuva ku muwendo gumu ogutali 1.

select-from-sequence-excluded-too-many-combinations = Okusukka mu 70% ez'entabula ziggyiddwawo mu selectFromSequence

select-from-sequence-coprime-none-found = Tekisobose kulonda miwendo egitagabana. Emiwendo gyonna egisoboka gigabana omugabanya gumu.

select-from-sequence-too-few-unique-values = Tekisoboka kulonda miwendo egy'enjawulo { $numToSelect } mu lusa olulina obuwanvu { $numPossibleValues }

select-prime-numbers-too-few-values = Tekisoboka kulonda miwendo { $numToSelect } mu lukalala lw'emiwendo egy'obusika olulina obuwanvu { $numValues }

select-prime-numbers-values-count-mismatch = Omuwendo gw'emiwendo egilagiddwa ku select gulina okutuukagana n'omuwendo gw'okulonda

select-prime-numbers-values-not-prime = Emiwendo gyonna egilagiddwa ku select prime number girina okuba mu lukalala lw'emiwendo egy'obusika

select-prime-numbers-values-excluded-combination = Emiwendo gya selectPrimeNumbers egyalagiddwa gyali ntabula eyaggyibwawo

select-prime-numbers-excluded-too-many-combinations = Okusukka mu 70% ez'entabula ziggyiddwawo mu selectPrimeNumbers

select-random-combination-fluke = Mu ngeri etatera kubaawo, tekisobose kulonda ntabula ya miwendo egitalondeddwa

select-random-value-fluke = Mu ngeri etatera kubaawo, tekisobose kulonda muwendo ogutalondeddwa
