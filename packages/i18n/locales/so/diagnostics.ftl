# Somali diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
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

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } waa la iska indhatiray marka labada dhammaad la qeexo

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } waa la iska indhatiray marka dhammaad iyo bartamaha labaduba la qeexo

line-segment-midpoint-offset-without-midpoint = midpointOffset ma shaqeeyo haddii bartame la’aan

## `<line>`

line-points-undetermined-dimensions = Xariiq maraysa dhibco cabbirradooda aan la go’aamin.

line-points-too-few-dimensions = Xariiq waa inay marto dhibco leh ugu yaraan laba cabbir.

line-points-depend-on-variables = Xariiqda waxay maraysaa dhibco ku tiirsan doorsoomayaal: { $variables }.

line-equation-invalid-format = Qaab aan sax ahayn oo isle’egta xariiqda ee doorsoomayaasha { $variable1 } iyo { $variable2 }.

## `<ray>`

ray-overprescribed-through = Fallaadhda waxay ku go’an tahay through, endpoint iyo direction. through-ga la qeexay waa la iska indhatirayaa.

ray-dimension-mismatch = numDimensions kuma waafaqsana fallaadhda.

## `<vector>`

vector-overprescribed-head = Vektarka waxuu ku go’an yahay head, tail iyo displacement. head-ka la qeexay waa la iska indhatirayaa.

vector-dimension-mismatch = numDimensions kuma waafaqsana vektarka.

## Attracting and constraining

attract-to-without-nearest-point = Ma suurtogal karo in loo soo jiito `<{ $component }>`, maadaama uusan lahayn doorsoome xaalad ah oo nearestPoint la yiraahdo.

constrain-to-without-nearest-point = Ma suurtogal karo in lagu xaddido `<{ $component }>`, maadaama uusan lahayn doorsoome xaalad ah oo nearestPoint la yiraahdo.

constrain-to-interior-without-nearest-point = Ma suurtogal karo in lagu xaddido gudaha `<{ $component }>`, maadaama uusan lahayn doorsoome xaalad ah oo nearestPoint la yiraahdo.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition waa la iska indhatirayaa choiceInput oo aan sadar-dhex ahayn

## Ordering children by index

choice-input-indices-count-mismatch = Tilmaamayaasha loo qeexay choiceInput waa la iska indhatirayaa, maadaama tiradooda aysan la mid ahayn tirada carruurta choice.

pretzel-indices-count-mismatch = Tilmaamayaasha loo qeexay problem waa la iska indhatirayaa, maadaama tiradooda aysan la mid ahayn tirada carruurta problem.

shuffle-indices-count-mismatch = Tilmaamayaasha loo qeexay shuffle waa la iska indhatirayaa, maadaama tiradooda aysan la mid ahayn tirada qaybaha.

indices-ignored-out-of-range = Tilmaamayaasha loo qeexay { $component } waa la iska indhatirayaa, maadaama qaar ka baxsan yihiin xadka.

pretzel-indices-repeated = Tilmaamayaasha loo qeexay pretzel waa la iska indhatirayaa, maadaama qaar ku celcelis yihiin.

pretzel-circuit-first-index = Tilmaamayaasha loo qeexay pretzel ee habka circuit waa la iska indhatirayaa, maadaama tilmaamaha koowaad waa inuu noqdo 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Si `<{ $component }>` u shaqeeyo carruur qoraal ah, waa in la qeexo sifada `type`.

invalid-type-defaulting-to-math = Nooca { $type } aan sax ahayn ee qaybta { $component }. Waa inuu noqdo mid ka mid ah math, text, number ama boolean. math waa la isticmaalayaa.

string-not-valid-component-to-arrange = Qoraalka "{ $value }" ma aha qayb sax ah oo { $component }. Waa la iska indhatirayaa.

## Types and variables

invalid-type-defaulting-to-number = Nooca { $type } ma sax aha; nooca waa la dhigayaa number.

invalid-variable-value = Qiime doorsoome aan sax ahayn: `{ $value }`

## Variants

variant-index-must-be-number = Tilmaamaha nooca { $index } waa inuu noqdo tiro

variant-index-must-be-integer = Tilmaamaha nooca { $index } waa inuu noqdo tiro dhan

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` lama hirgeliyay cabbirro dhab ah. Ballacyada waa la dhigayaa mid la xiriira.

side-by-side-absolute-margins = `<{ $component }>` lama hirgeliyay cabbirro dhab ah. Meelaha bannaan waa la dhigayaa mid la xiriira.

side-by-side-no-block-child = `<{ $component }>` aan sax ahayn: waa inuu leeyahay ugu yaraan hal ilmo bloke ah.

## `<label>`

label-for-ignored-on-graphical = Sifada `for` ee `<label>` sawir ah waa la iska indhatirayaa.

label-for-must-resolve-to-one = Sifada `for` ee `<label>` waa inay u xalanto si sax ah hal qayb.

label-for-unresolved = Sifada `for` ee `<label>` lama xalin karin qayb.

label-for-answer-with-authored-inputs = Sifada `for` ee `<label>` waxay tixraacaysaa `<answer>` leh gelinno si cad loo qoray; tixraac gelinta si toos ah.

label-for-answer-without-input = Sifada `for` ee `<label>` waxay tixraacaysaa `<answer>` aan lahayn gelin oo la summeeyo.

label-for-must-reference-input-or-answer = Sifada `for` ee `<label>` waa inay tixraacdo gelin ama jawaab.

## Accessibility

accessibility-short-description-or-decorative = Helitaanka awgeed, `<{ $component }>` waa inuu leeyahay sharraxaad gaaban ama loo qeexo qurxin.

accessibility-video-short-description = Helitaanka awgeed, `<video>` waa inuu leeyahay sharraxaad gaaban.

accessibility-input-short-description-or-label = Helitaanka awgeed, `<{ $component }>` waa inuu leeyahay sharraxaad gaaban ama summad.

accessibility-answer-input-short-description-or-label = Helitaanka awgeed, `<answer>` oo gelin abuuraya waa inuu leeyahay sharraxaad gaaban ama summad.

accessibility-short-description-contains-math = Sharraxaadaha gaaban waa inaysan ku jirin qaybo xisaab ah sida `<{ $component }>`. Xisaabta ku qor erayo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kala duwanaanshaha midabka kuma filna qoraalka cinwaanka qaybta (habka madow) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ugu yaraan { $threshold }:1 loo baahan yahay).
       *[other] { $colorName } kala duwanaanshaha midabka kuma filna qoraalka cinwaanka qaybta ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ugu yaraan { $threshold }:1 loo baahan yahay).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` maraysa { $count } dhibic lama hirgeliyay marka dhibcaha aysan lahayn qiimayaal tiro ah.

circle-too-many-through-points = Lama xisaabin karo goobo maraysa in ka badan 3 dhibic.

circle-overprescribed-radius-center-points = Lama xisaabin karo goobo leh gacan, xudun iyo dhibco la qeexay.

circle-center-with-multiple-points = Lama xisaabin karo goobo xudunteeda la qeexay oo maraysa in ka badan 1 dhibic.

circle-radius-too-small = Goobada lama xisaabin karo: maadaama masaafada u dhaxaysa labada dhibic ay tahay { $distance }, gacanka la qeexay { $radius } aad buu u yar yahay.

circle-radius-with-many-points = Lama abuuri karo goobo maraysa in ka badan laba dhibic oo gacan la qeexay leh.

circle-invalid-center-or-through-points = Xudun ama dhibco marin ah oo goobada aan sax ahayn.

circle-radius-center-with-multiple-points = Lama xisaabin karo gacanka goobo xudunteeda la qeexay oo maraysa in ka badan 1 dhibic.

circle-change-radius-non-numerical = Lama beddeli karo gacanka goobo leh dhibco marin ah oo aan tiro ahayn

circle-radius-with-points-non-numerical = Lama abuuri karo goobo maraysa in ka badan hal dhibic oo gacan la qeexay leh marka qiimayaal tiro ah la’aan.

circle-change-center-non-numerical = Beddelka xudunta goobo maraysa dhibco aan tiro ahayn lama hirgeliyay.

## `<function>`

function-domain-insufficient-dimensions = Cabbirro ku filan lama hayo qeybta shaqada. Qeybtu waxay leedahay { $intervals } waqti-xilli, halka shaqada leedahay { $inputs } gelin.

function-domain-invalid-format = Qaab aan sax ahayn oo qeybta shaqada.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ugu badnaanta aan tiro ahayn ee shaqada waa la iska indhatirayaa.
        [minimum] Ugu yaraanta aan tiro ahayn ee shaqada waa la iska indhatirayaa.
        [extremum] Xadka aan tiro ahayn ee shaqada waa la iska indhatirayaa.
        [point] Dhibicda aan tiro ahayn ee shaqada waa la iska indhatirayaa.
        [slope] Jiitanka aan tiro ahayn ee shaqada waa la iska indhatirayaa.
       *[other] { $type } aan tiro ahayn ee shaqada waa la iska indhatirayaa.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ugu badnaanta madhan ee shaqada waa la iska indhatirayaa.
        [minimum] Ugu yaraanta madhan ee shaqada waa la iska indhatirayaa.
        [extremum] Xadka madhan ee shaqada waa la iska indhatirayaa.
        [point] Dhibicda madhan ee shaqada waa la iska indhatirayaa.
       *[other] { $type } madhan ee shaqada waa la iska indhatirayaa.
    }

function-points-too-close = Shaqada waxay leedahay laba dhibic oo aad isugu dhow. Shaqada lama qeexi karo.

function-iterates-input-output-mismatch = Ku celcelinta shaqada waa suurtogal oo keliya haddii tirada gelinta la mid tahay tirada soo saarka. Shaqadan waxay leedahay { $inputs } gelin iyo { $outputs } soo saar.

## `<sequence>`

sequence-invalid-length = Dherer taxane aan sax ahayn. Waa inuu noqdo tiro dhan oo aan taban ahayn.

sequence-invalid-step = Tallaabo taxane aan sax ahayn. Waa inay tiro tahay taxane nooca { $type } ah.

sequence-invalid-endpoint-number = "{ $attribute }" aan sax ahayn oo taxane tirooyin ah. Waa inay tiro tahay.

sequence-invalid-endpoint-letters = "{ $attribute }" aan sax ahayn oo taxane xuruuf ah. Waa inay noqoto isku-dar xuruuf.

sequence-invalid-endpoint = "{ $attribute }" aan sax ahayn oo taxanaha.

select-from-sequence-coprime-not-numbers = coprime waa la iska indhatirayaa maadaama aan tirooyin la doorayn

select-from-sequence-coprime-with-exclude-combinations = coprime waa la iska indhatirayaa maadaama excludeCombinations la qeexay

## Resolving a `target`

target-not-found = target aan sax ahayn oo `<{ $source }>`: bartilmaameedka lama helin.

target-state-variable-not-found = target aan sax ahayn oo `<{ $source }>`: doorsoome xaalad ah oo "{ $property }" la yiraahdo lama helin `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Doorsoomayaasha `<odeSystem>` waa inay ka duwanaadaan doorsoomaha madax-bannaan.

ode-system-duplicate-variable-names = Lama qeexi karo shaqooyinka dhinaca midig ee ODE iyadoo magacyada doorsoomayaasha ku tiirsan ku celcelis yihiin.

ode-system-rhs-function-error = Lama qeexi karo shaqada dhinaca midig ee ODE. Khalad ka dhashay abuurista shaqada mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Lama qeexi karo xagal u dhexeeya { $count } xariiq

angle-invalid-through-point = Dhibic aan sax ahayn oo ku jirta through-ga `<angle>`

parabola-vertex-too-many-points = Parabola leh xagal-sare la qeexay oo maraysa in ka badan 1 dhibic lama hirgeliyay.

parabola-too-many-points = Parabola maraysa in ka badan 3 dhibic lama hirgeliyay.

intersection-too-many-items = Isgoysyada in ka badan laba shay lama hirgeliyay

## Other math components

ionic-compound-not-two-ions = Isku-dhisyada ayoonka ee aan laba ayoon ahayn lama hirgeliyay.

ionic-compound-needs-cation-and-anion = Isku-dhisyada ayoonka waxaa la hirgeliyay oo keliya hal kaatiyoon iyo hal anyoon.

solve-equations-cannot-evaluate = Isle’egta lama xalin karo maadaama aan lagu qiimayn karin: { $equation }

math-operators-operand-number-required = Waa in la qeexo operandNumber marka la soo saarayo qayb xisaab ah.

eigen-decomposition-failed = Lama xisaabin karin qiimayaasha eigen ee matriskiisa

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: halbeegga { $parameters } kama muuqdo qaabka, sidaas darteed wuxuu had iyo jeer u dhigmayaa bannaan.

## `<graph>`

graph-grid-invalid = `<graph>`: lama fahmi karo grid="{ $grid }". Waa inuu noqdo none, medium, dense, ama laba tiro togan oo bannaan ku kala qaybsan, sida grid="1 0.5". Xariiqyo shabaq ah lama sawirayo.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" lama taageerin qalabka muujinta prefigure; waxaa la isticmaalayaa habka booska midig.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" lama taageerin qalabka muujinta prefigure; waxaa la isticmaalayaa habka booska sare.

prefigure-invalid-axis-bounds = `<graph>`: xadadka dhidibbada ma sax aha beddelka prefigure; waxaa la isticmaalayaa bbox-ga caadiga ah (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ballac aan sax ahayn oo beddelka prefigure; waxaa la isticmaalayaa ballaca caadiga ah 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio aan sax ahayn oo beddelka prefigure; waxaa la isticmaalayaa saamiga caadiga ah 1.

prefigure-grid-spacing-too-fine = `<graph>`: kala-fogaanta shabaqa aad bay u yar tahay xadadka dhidibbada; shabaqa waa laga tegayaa qalabka muujinta prefigure.

prefigure-annotations-not-rendered = `<graph>`: faallooyinka lama muujinayo marka aan la isticmaalayn qalabka muujinta PreFigure.

multiple-annotations-children = Carruur `<annotations>` badan lagu helay `<graph>`; dhammaan marka laga reebo tii ugu dambeysay waa la iska indhatirayaa.

## Referring to other components

copy-unrecognized-component-type = Lama balaadhin karo ama lama koobiyeyn karo nooc qayb aan la aqoonsanayn: { $type }.

copy-prop-not-found = Sifada { $property } lama helin qayb nooceeda { $component } ah

collect-no-source = Il lama helin collect.

collect-invalid-component-type = Lama ururin karo qaybo nooca `<{ $component }>` ah, maadaama uusan ahayn nooc sax ah.

reference-index-unavailable = Lama tixraaci karo tilmaamaha `{ $reference }`

## `<callAction>`

component-action-unavailable = Lama wici karo { $action } qaybta `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Xogta waxay leedahay qaab aan sax ahayn. Safafka dhererkooda kala duwan yahay. Waxaa laga helay componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Xogta waxay leedahay magacyo tiirar ah oo ku celcelis ah. Waxaa laga helay componentIdx :{ $componentIdx }

data-frame-missing-column-name = Xogta waxay ka maqan tahay magac tiir. Waxaa laga helay componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award ee jawaabtan waxay ku salaysan tahay jawaabta la diray ee tag-ga answer laftiisa, taasoo keenaysa dhaqan aan la filayn.

answer-max-num-attempts-in-section-wide-check-work = Dejinta `maxNumAttempts` `<answer>` ku jira weel leh `sectionWideCheckWork` ma shaqayso, maadaama tirada isku dayga ay weelka xakameeyo. Ku deji `maxNumAttempts` weelka.

nested-section-wide-check-work-max-num-attempts = Dejinta `maxNumAttempts` weel leh `sectionWideCheckWork` oo isagu ku jira weel kale leh `sectionWideCheckWork` ma shaqayso, maadaama tirada isku dayga ay weelka dibadda xakameeyo. Ku deji `maxNumAttempts` weelka dibadda.

answer-attributes-need-symbolic-equality = Sifada { $attributes } ma shaqayn doonto haddii symbolicEquality la’aan.

answer-invalid-type = Nooc aan sax ahayn oo answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Maadaama qaybta `<{ $component }>` aysan magac lahayn, looma isticmaali karo sifo module

module-attribute-name-already-defined = Qaybta `<{ $component } name="{ $name }">` looma isticmaali karo sifo module, maadaama nooca qaybta `<module>` horeba u qeexay sifo "{ $name }".

conditional-content-condition-ignored = Sifada `condition` waa la iska indhatirayaa qaybta `<conditionalContent>` oo leh carruur case ama else.

slider-markers-type-mismatch = Nooca calaamadaha kuma waafaqsana nooca kortiirka.

pretzel-problem-needs-statement-and-answer = pretzel aan sax ahayn: `<problem>` kastaa waa inuu ku darsan yahay hal `<statement>` iyo hal `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel aan sax ahayn: markay mode="circuit" tahay, `<problem>` koowaad ma noqon karo mid jahwareersiiyo.

## Attribute values

attribute-invalid-values = Qiimaha { $values } aan sax ahayn oo sifada `{ $attribute }`; waa la iska indhatirayaa.

attribute-must-be-references = Qiime `{ $value }` aan sax ahayn oo sifada `{ $attribute }`. Sifadu waa inay ka koobnaato tixraacyo ku bilaabma `$`.

math-input-invalid-function-names = <mathInput>: magacyo shaqo aan sax ahayn laga iska indhatiray { $attribute }: { $names }. Qaybta la muujinayo ee magac kastaa waa inay ugu yaraan 2 xaraf ka koobnaato (xuruuf ama jiid); waxaa xigi kara lifaaq ikhtiyaari ah `|<beddelka mathspeak>`.

## Building components from the source

component-type-invalid = Nooc qayb aan sax ahayn: `<{ $componentType }>`

attribute-repeated = Sifada { $attribute } lama celceli karo.

attribute-invalid-for-component = Sifo "{ $attribute }" aan sax ahayn oo qayb nooceeda `<{ $componentType }>` ah.

## Style definition contrast

style-definition-insufficient-contrast =
    Qeexidda qaabka { $styleNumber } kala duwanaanshaha midabka kuma filna { $context ->
        [text-on-background] midabka qoraalka marka loo eego midabka gadaal
        [high-contrast] midabka kala duwanaanta sare marka loo eego shaandhada
        [line] midabka xariiqyada marka loo eego shaandhada
        [marker] midabka calaamadaha marka loo eego shaandhada
       *[text-on-canvas] midabka qoraalka marka loo eego shaandhada
    }{ $mode ->
        [dark] { " (habka madow)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ugu yaraan { $threshold }:1 loo baahan yahay).

style-definition-dark-mode-text-background-contrast =
    Inkastoo qeexidda qaabka { $styleNumber } ay qeexday midabbo kala duwanaanshahooda ku filan yahay habka iftiinka, midabbada habka madow ee laga soo saaray qiimayaashaas kala duwanaanshahooda kuma filna qoraalka marka loo eego gadaalka ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ugu yaraan { $threshold }:1 loo baahan yahay). { $suggestion ->
        [available] Si loo hubiyo kala duwanaansho ku filan habka madow, ama kor u qaad kala duwanaanshaha habka iftiinka (tusaale, deji { $lightAttribute }="{ $lightColor }") ama beddel midabka habka madow (tusaale, deji { $darkAttribute }="{ $darkColor }").
       *[none] Si loo hubiyo kala duwanaansho ku filan habka madow, kor u qaad kala duwanaanshaha habka iftiinka ama ku beddel midabbada la soo saaray textColorDarkMode iyo/ama backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Inkastoo qeexidda qaabka { $styleNumber } ay qeexday midab qoraal kala duwanaanshihiisa ku filan yahay habka iftiinka, midabka qoraalka habka madow ee laga soo saaray qiimahaas kala duwanaanshihiisa kuma filna marka loo eego shaandhada ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ugu yaraan { $threshold }:1 loo baahan yahay). { $suggestion ->
        [available] Si loo hubiyo kala duwanaansho ku filan habka madow, ama kor u qaad kala duwanaanshaha habka iftiinka (tusaale, deji textColor="{ $lightColor }") ama beddel midabka habka madow (tusaale, deji textColorDarkMode="{ $darkColor }").
       *[none] Si loo hubiyo kala duwanaansho ku filan habka madow, kor u qaad kala duwanaanshaha habka iftiinka ama ku beddel midabka la soo saaray textColorDarkMode.
    }

section-multiple-style-palettes = Qayb waxay dooran kartaa hal <stylePalette> oo keliya; tii ugu dambeysay waa la isticmaalayaa.

## Unique variants

variant-num-to-select-not-non-negative-integer = lama go’aamin karo noocyada gaarka ah ee { $component }, maadaama numToSelect uusan ahayn tiro dhan oo aan taban ahayn.

variant-num-to-select-not-constant-number = lama go’aamin karo noocyada gaarka ah ee { $component }, maadaama numToSelect uusan ahayn tiro joogto ah.

variant-with-replacement-not-constant-boolean = lama go’aamin karo noocyada gaarka ah ee { $component }, maadaama withReplacement uusan ahayn qiime boole joogto ah.

variant-select-weight-disables-unique = Noocyada gaarka ah ee select waa la joojiyaa haddii doorasho leedahay selectWeight ama selectForVariants

variant-coprime-undetermined = lama go’aamin karo noocyada gaarka ah ee { $component }, maadaama aan la hubin karin in coprime had iyo jeer been tahay.

variant-attribute-not-constant = lama go’aamin karo noocyada gaarka ah ee { $component }, maadaama { $attribute } uusan ahayn joogto.

variant-attribute-not-number = lama go’aamin karo noocyada gaarka ah ee { $component }, maadaama { $attribute } uusan ahayn tiro.

variant-attribute-wrong-type-for-sequence =
    lama go’aamin karo noocyada gaarka ah ee { $component } oo nooca { $type } ah, maadaama { $attribute } uusan ahayn { $expected ->
        [letters-combination] isku-dar xuruuf
        [math-expression] tibaax xisaab ah oo sax ah
        [integer] tiro dhan
       *[number] tiro
    }.

variant-length-not-integer = lama go’aamin karo noocyada gaarka ah ee { $component }, maadaama length uusan ahayn tiro dhan.

variant-sort-not-implemented = noocyada gaarka ah ee { $component } leh sort lama hirgeliyay

variant-exclude-combinations-not-implemented = noocyada gaarka ah ee { $component } leh excludeCombinations lama hirgeliyay

variant-math-exclude-not-implemented = noocyada gaarka ah ee { $component } oo nooca math ah leh exclude lama hirgeliyay

variant-non-constant-exclude-not-implemented = noocyada gaarka ah ee { $component } leh exclude aan joogto ahayn lama hirgeliyay

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: lama taageerin qalabka muujinta prefigure ee garaafka; farcanka waa la boodayaa.

prefigure-descendant-invalid-geometry = { $subject }: joomatari aan xaddidnayn ama aan dhamaystirnayn; farcanka waa la boodayaa.

prefigure-curve-label-omitted = { $subject }: summadaha lama taageerin qaybaha qalooca la beddelay; summadda waa laga tegayaa.

prefigure-curve-unsupported-definition-type = { $subject }: nooca qeexidda shaqada qalooca '{ $definitionType }' lama taageerin; farcanka waa la boodayaa.

prefigure-region-flip-functions-unsupported = { $subject }: sifada flipFunctions ee regionBetweenCurves lama taageerin; farcanka waa la boodayaa.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves waxay taageertaa oo keliya shaqooyin carruur ah oo qaacido ah; farcanka waa la boodayaa.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' lama taageerin { $labelKind ->
        [line-family] summad qoysaska xariiqda
       *[point] summad dhibic
    }; waxaa la isticmaalayaa habaynta caadiga ah ee PreFigure.

prefigure-fill-style-unsupported = { $subject }: qaabka buuxinta '{ $fillStyle }' PreFigure ma taageerto; waxaa la isticmaalayaa buuxin midab keli ah.

prefigure-line-style-unknown = { $subject }: qaab xariiq '{ $lineStyle }' aan la aqoon oo laga tegay soo saarka PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: qaabka calaamadda '{ $markerStyle }' waa loo beddelay qaabka PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: qaabka calaamadda '{ $markerStyle }' PreFigure ma taageerto; waxaa la isticmaalayaa qaabka caadiga ah.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` aan sax ahayn; bartilmaameedka lama xalin karo. Faallada waa laga tegayaa.

annotation-ref-multiple-targets = `<annotation>`: `ref` waxay u xalantay bartilmaameedyo badan; tii koowaad waa la isticmaalayaa.

annotation-ref-outside-graph = `<annotation>`: `ref` aan sax ahayn; bartilmaameedka wuxuu ka baxsan yahay garaafka ku jira. Faallada waa laga tegayaa.

annotation-ref-unsupported-target = `<annotation>`: `ref` aan sax ahayn; bartilmaameedka ma aha shay sawir ah oo la taageero beddelka prefigure. Faallada waa laga tegayaa.

annotation-text-missing = `<annotation>`: `text` maqan ama madhan; qoraal madhan waa la soo saarayaa.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ku tiirsanaan wareegsan waa la ogaaday.
       *[other] Ku tiirsanaan wareegsan waa la ogaaday oo ku lug leh qayb `<{ $componentType }>`.
    }

reference-no-referent = Wax lagu tixraacay lama helin tixraaca: `{ $reference }`

reference-multiple-referents = Waxaa la helay wax ka badan mid lagu tixraacay tixraaca: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Qaab aan sax ahayn oo sifada { $attribute } ee `<{ $componentType }>`.

children-invalid = Carruur aan sax ahayn oo `<{ $componentType }>`: waxaa la helay carruur aan sax ahayn: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Qiime `{ $value }` aan sax ahayn oo sifada `{ $attribute }`; qiimaha `{ $default }` waa la isticmaalayaa

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Nooca DoenetML { $version } lama helin.
       *[other] Nooca DoenetML { $version } lama helin. Waxaa loo noqonayaa nooca { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML aan sax ahayn: { $content }

parse-tag-missing-close-tag = DoenetML aan sax ahayn: tag-ga `{ $tag }` ma leh tag xiraya. Waxaa la filayay tag is-xiraya ama tag `</{ $tagName }>`.

parse-tag-error = DoenetML aan sax ahayn: khalad ku jira tag-ga `<{ $tagName }>`

parse-attribute-missing-value = DoenetML aan sax ahayn: sifada `{ $attribute }` waxay u muuqataa inay qiime ka maqan yahay.

parse-attribute-invalid = DoenetML aan sax ahayn: sifo `{ $attribute }` aan sax ahayn

parse-attribute-value-invalid = DoenetML aan sax ahayn: qiime sifo `{ $value }` aan sax ahayn

parse-attribute-value-quote-mismatch = DoenetML aan sax ahayn: qiime sifo `{ $value }` aan sax ahayn. Calaamadaha xigashada isku waafaqsanayn. Waxay u muuqataa inay ka maqan tahay `{ $quote }`

parse-open-tag-name-missing = DoenetML aan sax ahayn: tag lama helay magac, tusaale `<`

parse-tag-not-closed = DoenetML aan sax ahayn: tag-ga `{ $tag }` lama xirin (waxay u muuqataa inay `>` ka maqan tahay).

parse-self-closing-tag-name-missing = DoenetML aan sax ahayn: tag lama helay magac `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML aan sax ahayn: tag-ga `{ $tag }` lama xirin (waxay u muuqataa inay `/>` ka maqan tahay).

parse-tag-invalid-attributes = DoenetML aan sax ahayn: tag-ga `{ $tag }` ma sax aha. Waxaa laga yaabaa inay sifooyin qaldan leeyahay.

parse-close-tag-name-missing = DoenetML aan sax ahayn: tag xiraya lama helay magac, tusaale `</`

parse-attribute-value-unquoted = Qiimayaasha sifooyinka waa in lagu duudduubo calaamado xigasho: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML aan sax ahayn: waxaa la helay tag xiraya `{ $tag }`, laakiin ma jiro tag furaya la mid ah

parse-close-tag-mismatched = DoenetML aan sax ahayn: tag xiraya aan waafaqsanayn. Waxaa la filayay `</{ $expected }>`. Waxaa la helay `{ $found }`

parser-node-unconvertible = Lama beddeli karin buundada { $node } buundo Dast ah.

## Names

name-attribute-invalid =
    Sifo name='{ $name }' aan sax ahayn. { $reason ->
        [characters] Magacyada waxay ku jiri karaan oo keliya xuruuf, tirooyin, hoos-jiid ama jiid.
       *[start] Magacyada waa inay ku bilaabmaan xaraf.
    }

component-name-invalid-start = Magac qayb "{ $name }" aan sax ahayn. Magacyada waa inay ku bilaabmaan xaraf.

## `<answer>` sugar

answer-video-watched-missing-video = answer nooca videoWatched ah waa inuu leeyahay sifo video

answer-video-watched-video-not-reference = answer nooca videoWatched ah waa inuu leeyahay sifo video oo tixraac ah

answer-name-not-single-text = Sifada name ee answer waa inay leedahay hal ilmo qoraal ah oo keliya

## Referencing another document

external-doenetml-recursion-limit = Lama soo qaadan karin DoenetML dibadda ah heerar ku celcelis ah oo aad u badan awgeed. Ma jiraa tixraac wareegsan?

external-doenetml-unavailable = Lama soo qaadan karin DoenetML ka { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML aan sax ahayn oo laga soo qaaday { $attribute }="{ $uri }": kuma waafaqsanayn nooca qaybta "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Sifada `{ $from }` waa duugoobtay; isticmaal `{ $to }`.
       *[other] [deprecation] Sifada `{ $from }` ee `<{ $component }>` waa duugoobtay; isticmaal `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Sifada `{ $from }` waa duugoobtay waana la iska indhatirayaa, maadaama `{ $to }` sidoo kale la qeexay.
       *[other] [deprecation] Sifada `{ $from }` ee `<{ $component }>` waa duugoobtay waana la iska indhatirayaa, maadaama `{ $to }` sidoo kale la qeexay.
    }

deprecated-attribute-ignored = [deprecation] Sifada `{ $attribute }` ee `<{ $component }>` waa duugoobtay waana la iska indhatirayaa.


## Language coverage

pluralize-english-only = `<pluralize>` waxay kaliya wadar-yeeli kartaa Ingiriisi, sidaas darteed qoraalkeeda sida uu yahay ayuu ku sii jiraa dukumenti lagu qoray { $locale }. Qor qaabka wadarta si toos ah, ama ku deji sifada `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Qaybta `<{ $tag }>` ma aha qayb Doenet la aqoonsan yahay.

schema-element-not-allowed-at-root = Qaybta `<{ $tag }>` looma ogola xididka dukumentiga.

schema-element-not-allowed-inside = Qaybta `<{ $tag }>` looma ogola gudaha `<{ $parent }>`.

schema-attribute-unrecognized = Qaybta `<{ $tag }>` ma leh sifo `{ $attribute }` la yiraahdo.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Sifada `{ $attribute }` ee qaybta `<{ $tag }>` waa inay noqoto liis oo shay kastaa ka mid yahay: { $allowed }
       *[other] Sifada `{ $attribute }` ee qaybta `<{ $tag }>` waa inay ka mid noqoto: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Magac nooc aan sax ahayn oo select. Magaca nooca { $variantName } wuxuu ka muuqdaa { $numOptions } doorasho, laakiin tirada la doorayo waa { $numToSelect }.

select-variant-name-without-options = Noocyo waa loo qeexay select, laakiin doorasho lama qeexin magaca nooca suurtogalka ah: { $variantName }.

select-variant-name-not-possible = Magaca nooca { $variantName } oo loo qeexay select ma aha magac nooc suurtogal ah.

select-too-few-options = Lama dooran karo { $numToSelect } qayb oo laga bilaabo kaliya { $numOptions }.

select-from-sequence-too-few-values = Lama dooran karo { $numToSelect } qiime oo laga bilaabo taxane dhererkiisa { $length } yahay.

select-from-sequence-indices-count-mismatch = Tirada tilmaamayaasha loo qeexay select waa inay la mid noqoto tirada la doorayo

select-from-sequence-indices-not-integers = Dhammaan tilmaamayaasha loo qeexay select waa inay tirooyin dhan yihiin

select-from-sequence-index-excluded = Tilmaamaha loo qeexay selectfromsequence waa la reebay

select-from-sequence-indices-excluded-combination = Tilmaamayaasha loo qeexay selectfromsequence waxay ahaayeen isku-dar la reebay

select-from-sequence-coprime-not-positive-integers = Lama dooran karo isku-darro coprime ah maadaama aan la doorayn tirooyin togan oo dhan.

select-from-sequence-coprime-common-factor = Lama dooran karo tirooyin coprime ah. Dhammaan qiimayaasha suurtogalka ah waxay wadaagaan qayb-qeybiye. (Qiimayaasha la qeexay ee "from" ama "to" waa inay coprime la yihiin "step".)

select-from-sequence-coprime-single-number = Lama dooran karo isku-darro coprime ah oo laga bilaabo hal tiro oo aan 1 ahayn.

select-from-sequence-excluded-too-many-combinations = In ka badan 70% isku-darrada waa laga reebay selectFromSequence

select-from-sequence-coprime-none-found = Lama dooran karin tirooyin coprime ah. Dhammaan qiimayaasha suurtogalka ah waxay wadaagaan qayb-qeybiye.

select-from-sequence-too-few-unique-values = Lama dooran karo { $numToSelect } qiime kala duwan oo laga bilaabo taxane dhererkiisa { $numPossibleValues } yahay

select-prime-numbers-too-few-values = Lama dooran karo { $numToSelect } qiime oo laga bilaabo liis tirooyin aasaasi ah oo dhererkiisa { $numValues } yahay

select-prime-numbers-values-count-mismatch = Tirada qiimayaasha loo qeexay select waa inay la mid noqoto tirada la doorayo

select-prime-numbers-values-not-prime = Dhammaan qiimayaasha loo qeexay select prime number waa inay ku jiraan liiska tirooyinka aasaasiga ah

select-prime-numbers-values-excluded-combination = Qiimayaasha loo qeexay selectPrimeNumbers waxay ahaayeen isku-dar la reebay

select-prime-numbers-excluded-too-many-combinations = In ka badan 70% isku-darrada waa laga reebay selectPrimeNumbers

select-random-combination-fluke = Nasiib aad u yar awgeed, lama dooran karin isku-dar qiimayaal random ah

select-random-value-fluke = Nasiib aad u yar awgeed, lama dooran karin qiime random ah
