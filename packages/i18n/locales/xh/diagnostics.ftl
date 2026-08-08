# Xhosa diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
#
# Xhosa prefixes a borrowed noun rather than suffixing it, and the prefix goes
# on a word this catalog writes: these messages name the thing («icandelo
# `<{ $component }>`») rather than trying to weld a prefix to a value.
#
# Where English separates a singular from a plural only in the verb, the Xhosa
# verb takes its subject concord from the noun class rather than from the
# count, so those selects are dropped and the count argument goes unused.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } iyatyeshelwa xa kuchazwe amanqaku amabini asekugqibeleni

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } iyatyeshelwa xa kuchazwe kokubini inqaku lokugqibela nenqaku eliphakathi

line-segment-midpoint-offset-without-midpoint = midpointOffset ayinampembelelo ngaphandle kwenqaku eliphakathi

## `<line>`

line-points-undetermined-dimensions = Umgca udlula kumanqaku anemilinganiselo engaziwayo.

line-points-too-few-dimensions = Umgca kufuneka udlule kumanqaku anemilinganiselo emibini ubuncinane.

line-points-depend-on-variables = Umgca udlula kumanqaku axhomekeke kokuguqukayo: { $variables }.

line-equation-invalid-format = Ifomathi engasebenziyo yesibalo somgca kokuguqukayo { $variable1 } no-{ $variable2 }.

## `<ray>`

ray-overprescribed-through = Umtha uchazwe ngo-through, endpoint no-direction kanye kanye. U-through ochaziweyo uyatyeshelwa.

ray-dimension-mismatch = numDimensions ayihambelani kumtha.

## `<vector>`

vector-overprescribed-head = Ivektha ichazwe ngo-head, tail no-displacement kanye kanye. U-head ochaziweyo uyatyeshelwa.

vector-dimension-mismatch = numDimensions ayihambelani kwivektha.

## Attracting and constraining

attract-to-without-nearest-point = Akunakwenzeka ukutsalela kwicandelo `<{ $component }>` kuba alinakho okuguqukayo kwemeko okuthiwa nearestPoint.

constrain-to-without-nearest-point = Akunakwenzeka ukunciphisela kwicandelo `<{ $component }>` kuba alinakho okuguqukayo kwemeko okuthiwa nearestPoint.

constrain-to-interior-without-nearest-point = Akunakwenzeka ukunciphisela ngaphakathi kwecandelo `<{ $component }>` kuba alinakho okuguqukayo kwemeko okuthiwa nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition iyatyeshelwa kwi-choiceInput engekho kumgca omnye

## Ordering children by index

choice-input-indices-count-mismatch = Iindawo ezichaziweyo ze-choiceInput ziyatyeshelwa kuba inani leendawo alihambelani nenani labantwana be-choice.

pretzel-indices-count-mismatch = Iindawo ezichaziweyo ze-problem ziyatyeshelwa kuba inani leendawo alihambelani nenani labantwana be-problem.

shuffle-indices-count-mismatch = Iindawo ezichaziweyo ze-shuffle ziyatyeshelwa kuba inani leendawo alihambelani nenani lamacandelo.

indices-ignored-out-of-range = Iindawo ezichaziweyo ze-{ $component } ziyatyeshelwa kuba ezinye iindawo ziphuma kuluhlu.

pretzel-indices-repeated = Iindawo ezichaziweyo ze-pretzel ziyatyeshelwa kuba ezinye iindawo ziphindiwe.

pretzel-circuit-first-index = Iindawo ezichaziweyo ze-pretzel kwimowudi circuit ziyatyeshelwa kuba indawo yokuqala kufuneka ibe ngu-1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ukuze `<{ $component }>` isebenze nabantwana bohlobo lwe-string, impawu `type` kufuneka ichazwe.

invalid-type-defaulting-to-math = type { $type } ayisebenzi kwicandelo { $component }. Kufuneka ibe yenye ya-math, text, number okanye boolean. Imiselwa ku-math.

string-not-valid-component-to-arrange = I-string "{ $value }" ayilocandelo elisebenzayo le-{ $component }. Iyatyeshelwa.

## Types and variables

invalid-type-defaulting-to-number = type { $type } ayisebenzi, type imiselwa ku-number.

invalid-variable-value = Ixabiso lokuguqukayo alisebenzi: `{ $value }`

## Variants

variant-index-must-be-number = Indawo yohlobo { $index } kufuneka ibe linani

variant-index-must-be-integer = Indawo yohlobo { $index } kufuneka ibe linani elipheleleyo

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ayikasetyenziswa kwimilinganiselo epheleleyo. Ububanzi bumiselwa kobuhambelanayo.

side-by-side-absolute-margins = `<{ $component }>` ayikasetyenziswa kwimilinganiselo epheleleyo. Imida imiselwa kwehambelanayo.

side-by-side-no-block-child = `<{ $component }>` ayisebenzi: kufuneka ibe nomntwana omnye ubuncinane wohlobo lwebhloko.

## `<label>`

label-for-ignored-on-graphical = Impawu `for` kwi-`<label>` yomzobo iyatyeshelwa.

label-for-must-resolve-to-one = Impawu `for` kwi-`<label>` kufuneka imisele icandelo elinye kuphela.

label-for-unresolved = Impawu `for` kwi-`<label>` ayikwazanga ukumiselwa kwicandelo.

label-for-answer-with-authored-inputs = Impawu `for` kwi-`<label>` ibhekisa ku-`<answer>` enongeniso olubhalwe ngokucacileyo; bhekisa kolo ngeniso ngokuthe ngqo.

label-for-answer-without-input = Impawu `for` kwi-`<label>` ibhekisa ku-`<answer>` engenalo ungeniso olunokubhalwa.

label-for-must-reference-input-or-answer = Impawu `for` kwi-`<label>` kufuneka ibhekise kungeniso okanye kwimpendulo.

## Accessibility

accessibility-short-description-or-decorative = Ngenxa yokufikeleleka, `<{ $component }>` kufuneka ibe nenkcazelo emfutshane okanye ichazwe njengehombisayo.

accessibility-video-short-description = Ngenxa yokufikeleleka, `<video>` kufuneka ibe nenkcazelo emfutshane.

accessibility-input-short-description-or-label = Ngenxa yokufikeleleka, `<{ $component }>` kufuneka ibe nenkcazelo emfutshane okanye ilebhile.

accessibility-answer-input-short-description-or-label = Ngenxa yokufikeleleka, i-`<answer>` edala ungeniso kufuneka ibe nenkcazelo emfutshane okanye ilebhile.

accessibility-short-description-contains-math = Iinkcazelo ezimfutshane akufanele zibe namacandelo ezibalo afana no-`<{ $component }>`. Chaza nayiphi na imathematika ngamagama.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } inomahluko ongoneleyo kumbhalo wesihloko secandelo (imowudi emnyama) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ifuna ubuncinane { $threshold }:1).
       *[other] { $colorName } inomahluko ongoneleyo kumbhalo wesihloko secandelo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ifuna ubuncinane { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = I-`<circle>` edlula kumanqaku angu-{ $count } ayikasetyenziswa xa amanqaku engenawo amaxabiso amanani.

circle-too-many-through-points = Akunakwenzeka ukubala isangqa esidlula kumanqaku angaphezu kwama-3.

circle-overprescribed-radius-center-points = Akunakwenzeka ukubala isangqa esinerediyasi, umbindi namanqaku okudlula echaziwe onke.

circle-center-with-multiple-points = Akunakwenzeka ukubala isangqa esinombindi ochaziweyo esidlula kwinqaku elingaphezu kwelinye.

circle-radius-too-small = Akunakwenzeka ukubala isangqa: ekubeni umgama phakathi kwamanqaku amabini ungu-{ $distance }, irediyasi echaziweyo engu-{ $radius } incinci kakhulu.

circle-radius-with-many-points = Akunakwenzeka ukudala isangqa esidlula kumanqaku angaphezu kwamabini sinerediyasi echaziweyo.

circle-invalid-center-or-through-points = Umbindi okanye amanqaku okudlula esangqa awasebenzi.

circle-radius-center-with-multiple-points = Akunakwenzeka ukubala irediyasi yesangqa esinombindi ochaziweyo esidlula kwinqaku elingaphezu kwelinye.

circle-change-radius-non-numerical = Akunakwenzeka ukutshintsha irediyasi yesangqa esidlula kumanqaku angenawo amaxabiso amanani

circle-radius-with-points-non-numerical = Akunakwenzeka ukudala isangqa esidlula kwinqaku elingaphezu kwelinye sinerediyasi echaziweyo xa kungekho maxabiso amanani.

circle-change-center-non-numerical = Ukutshintsha umbindi wesangqa esidlula kumanqaku angenawo amaxabiso amanani akukasetyenziswa.

## `<function>`

function-domain-insufficient-dimensions = Imilinganiselo yendawo yomsebenzi ayonelanga. Indawo inezithuba ezingu-{ $intervals } kodwa umsebenzi unongeniso olungu-{ $inputs }.

function-domain-invalid-format = Ifomathi yendawo yomsebenzi ayisebenzi.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Kutyeshelwa umlinganiselo ophezulu womsebenzi ongelolinani.
        [minimum] Kutyeshelwa umlinganiselo osezantsi womsebenzi ongelolinani.
        [extremum] Kutyeshelwa umlinganiselo osemaphethelweni womsebenzi ongelolinani.
        [point] Kutyeshelwa inqaku lomsebenzi elingelolinani.
        [slope] Kutyeshelwa ukutyibilika komsebenzi okungelolinani.
       *[other] Kutyeshelwa { $type } yomsebenzi engelolinani.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Kutyeshelwa umlinganiselo ophezulu womsebenzi ongenanto.
        [minimum] Kutyeshelwa umlinganiselo osezantsi womsebenzi ongenanto.
        [extremum] Kutyeshelwa umlinganiselo osemaphethelweni womsebenzi ongenanto.
        [point] Kutyeshelwa inqaku lomsebenzi elingenanto.
       *[other] Kutyeshelwa { $type } yomsebenzi engenanto.
    }

function-points-too-close = Umsebenzi unamanqaku amabini akufuphi kakhulu. Umsebenzi awunakuchazwa.

function-iterates-input-output-mismatch = Ukuphindaphinda komsebenzi kunokwenzeka kuphela xa inani longeniso lilingana nenani lophumo. Lo msebenzi unongeniso olungu-{ $inputs } nophumo olungu-{ $outputs }.

## `<sequence>`

sequence-invalid-length = Ubude bolandelelwano abusebenzi. Kufuneka bube linani elipheleleyo elingekho ngaphantsi kweqanda.

sequence-invalid-step = Inyathelo lolandelelwano alisebenzi. Kufuneka libe linani kulandelelwano lohlobo { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" yolandelelwano lwamanani ayisebenzi. Kufuneka ibe linani.

sequence-invalid-endpoint-letters = "{ $attribute }" yolandelelwano lwezinto ezibhaliweyo ayisebenzi. Kufuneka ibe ngumxube woonobumba.

sequence-invalid-endpoint = "{ $attribute }" yolandelelwano ayisebenzi.

select-from-sequence-coprime-not-numbers = coprime iyatyeshelwa kuba akungomanani akhethwayo

select-from-sequence-coprime-with-exclude-combinations = coprime iyatyeshelwa kuba excludeCombinations ichaziwe

## Resolving a `target`

target-not-found = target ayisebenzi ku-`<{ $source }>`: ekujoliswe kuko akufumaneki.

target-state-variable-not-found = target ayisebenzi ku-`<{ $source }>`: okuguqukayo kwemeko okuthiwa "{ $property }" akufumaneki ku-`<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Okuguqukayo kwe-`<odeSystem>` kufuneka kwahluke kokuguqukayo okuzimeleyo.

ode-system-duplicate-variable-names = Akunakwenzeka ukuchaza imisebenzi ye-ODE RHS enamagama okuguqukayo okuxhomekekileyo aphindiweyo.

ode-system-rhs-function-error = Akunakwenzeka ukuchaza umsebenzi we-ODE RHS. Kubekho impazamo ekudaleni umsebenzi we-mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Akunakwenzeka ukuchaza i-engile phakathi kwemigca engu-{ $count }

angle-invalid-through-point = Inqaku elingasebenziyo ku-through ye-`<angle>`

parabola-vertex-too-many-points = Iparabhola enencopho edlula kwinqaku elingaphezu kwelinye ayikasetyenziswa.

parabola-too-many-points = Iparabhola edlula kumanqaku angaphezu kwama-3 ayikasetyenziswa.

intersection-too-many-items = Ukunqamlezana kwezinto ezingaphezu kwezibini akukasetyenziswa

## Other math components

ionic-compound-not-two-ions = Umxube weayoni wanantoni na ngaphandle kweeayoni ezibini awukasetyenziswa.

ionic-compound-needs-cation-and-anion = Umxube weayoni usetyenziswe kuphela kwi-cation enye ne-anion enye.

solve-equations-cannot-evaluate = Akunakwenzeka ukusombulula isibalo kuba isibalo asikwazanga ukuvavanywa: { $equation }

math-operators-operand-number-required = operandNumber kufuneka ichazwe xa kukhutshwa i-operand yezibalo.

eigen-decomposition-failed = Akukwazekanga ukubala ama-eigenvalue emathriksi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: i-parameter { $parameters } ayiveli kwipateni, ngoko iya kusoloko ihambelana nendawo engenanto.

## `<graph>`

graph-grid-invalid = `<graph>`: akukwazeki ukutolika grid="{ $grid }". Kufuneka ibe none, medium, dense, okanye amanani amabini alungileyo ahlulwe sisithuba, njenge-grid="1 0.5". Akukho grid izotyiweyo.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ayixhaswanga kwisibonisi se-prefigure; kusetyenziswa isimo sendawo yasekunene.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ayixhaswanga kwisibonisi se-prefigure; kusetyenziswa isimo sendawo ephezulu.

prefigure-invalid-axis-bounds = `<graph>`: imida ye-akisi ayisebenzi kuguqulelo lwe-prefigure; kusetyenziswa i-bbox ezenzekelayo (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ububanzi abusebenzi kuguqulelo lwe-prefigure; kusetyenziswa ububanzi bomzobo obuzenzekelayo obungu-425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ayisebenzi kuguqulelo lwe-prefigure; kusetyenziswa umlinganiselo ozenzekelayo ongu-1.

prefigure-grid-spacing-too-fine = `<graph>`: isithuba se-grid sincinci kakhulu kule mida ye-akisi; i-grid ishiywe ngaphandle kwisibonisi se-prefigure.

prefigure-annotations-not-rendered = `<graph>`: amanqaku acacisayo awayi kuboniswa xa kungasetyenziswa isibonisi se-PreFigure.

multiple-annotations-children = Kufunyenwe abantwana be-`<annotations>` abaninzi ku-`<graph>`; bonke bayatyeshelwa ngaphandle kowokugqibela.

## Referring to other components

copy-unrecognized-component-type = Akunakwenzeka ukwandisa okanye ukukopa uhlobo lwecandelo olungaziwayo: { $type }.

copy-prop-not-found = Impawu { $property } ayifunyenwanga kwicandelo lohlobo { $component }

collect-no-source = Akukho mthombo ufunyenweyo we-collect.

collect-invalid-component-type = Akunakwenzeka ukuqokelela amacandelo ohlobo `<{ $component }>` kuba lolohlobo lwecandelo olungasebenziyo.

reference-index-unavailable = Akunakwenzeka ukubhekisa kwindawo `{ $reference }`

## `<callAction>`

component-action-unavailable = Akunakwenzeka ukubiza u-{ $action } kwicandelo `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Idatha inesimo esingasebenziyo. Imiqolo inobude obungafaniyo. Kufunyenwe ku-componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Idatha inamagama eekholam aphindiweyo. Kufunyenwe ku-componentIdx :{ $componentIdx }

data-frame-missing-column-name = Idatha isilela ligama lekholam. Kufunyenwe ku-componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = I-award yale mpendulo isekelwe kwimpendulo engenisiweyo yethegi answer ngokwayo, into eya kukhokelela kwisimo esingalindelekanga.

answer-max-num-attempts-in-section-wide-check-work = Ukumisela `maxNumAttempts` ku-`<answer>` engaphakathi kwesikhongozeli esine-`sectionWideCheckWork` akunampembelelo, kuba inani lamalinge lilawulwa sisikhongozeli. Misela `maxNumAttempts` kwisikhongozeli endaweni yoko.

nested-section-wide-check-work-max-num-attempts = Ukumisela `maxNumAttempts` kwisikhongozeli esine-`sectionWideCheckWork` esingaphakathi kwesinye isikhongozeli esine-`sectionWideCheckWork` akunampembelelo, kuba inani lamalinge lilawulwa sisikhongozeli sangaphandle. Misela `maxNumAttempts` kwisikhongozeli sangaphandle endaweni yoko.

answer-attributes-need-symbolic-equality = Iimpawu { $attributes } aziyi kuba nampembelelo ngaphandle kokuba symbolicEquality imiselwe.

answer-invalid-type = Uhlobo alusebenzi kwimpendulo: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ekubeni icandelo `<{ $component }>` lingenalo igama, alinakusetyenziswa njengempawu ye-module

module-attribute-name-already-defined = Icandelo `<{ $component } name="{ $name }">` alinakusetyenziswa njengempawu ye-module kuba uhlobo lwecandelo `<module>` selunempawu ethiwa "{ $name }".

conditional-content-condition-ignored = Impawu `condition` iyatyeshelwa kwicandelo `<conditionalContent>` elinabantwana be-case okanye be-else.

slider-markers-type-mismatch = Uhlobo lwezimpawu aluhambelani nohlobo lwe-slider.

pretzel-problem-needs-statement-and-answer = i-pretzel ayisebenzi: i-`<problem>` nganye kufuneka ibe ne-`<statement>` enye ne-`<answer>` enye.

pretzel-circuit-first-problem-distractor = i-pretzel ayisebenzi: ku-mode="circuit", i-`<problem>` yokuqala ayinakuba sisiphazamiso.

## Attribute values

attribute-invalid-values = Ixabiso { $values } alisebenzi kwimpawu `{ $attribute }`; liyatyeshelwa.

attribute-must-be-references = Ixabiso `{ $value }` alisebenzi kwimpawu `{ $attribute }`. Impawu kufuneka yakhiwe ngeembekiselo eziqala ngo-`$`.

math-input-invalid-function-names = <mathInput>: kutyeshelwa amagama emisebenzi angasebenziyo ku-{ $attribute }: { $names }. Icandelo elibonisayo legama ngalinye kufuneka libe noonobumba abangu-2 ubuncinane (oonobumba okanye oohayifeni); isimamva `|<mathspeak alternative>` singalandela.

## Building components from the source

component-type-invalid = Uhlobo lwecandelo alusebenzi: `<{ $componentType }>`

attribute-repeated = Impawu { $attribute } ayinakuphindwa.

attribute-invalid-for-component = Impawu "{ $attribute }" ayisebenzi kwicandelo lohlobo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Inkcazelo yesimbo { $styleNumber } inomahluko ongoneleyo we-{ $context ->
        [text-on-background] mbala wombhalo ngokuchasene nombala womva
        [high-contrast] mbala womahluko ophezulu ngokuchasene nekhanvasi
        [line] mbala womgca ngokuchasene nekhanvasi
        [marker] mbala wophawu ngokuchasene nekhanvasi
       *[text-on-canvas] mbala wombhalo ngokuchasene nekhanvasi
    }{ $mode ->
        [dark] { " (imowudi emnyama)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ifuna ubuncinane { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Nangona inkcazelo yesimbo { $styleNumber } ichaze imibala enomahluko owaneleyo wemowudi ekhanyayo, imibala yemowudi emnyama esuselwe kuyo inomahluko ongoneleyo wombala wombhalo ngokuchasene nombala womva ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ifuna ubuncinane { $threshold }:1). { $suggestion ->
        [available] Ukuqinisekisa umahluko owaneleyo kwimowudi emnyama, yandisa umahluko wemowudi ekhanyayo (umzekelo misela { $lightAttribute }="{ $lightColor }") okanye utshintshe umbala wemowudi emnyama (umzekelo misela { $darkAttribute }="{ $darkColor }").
       *[none] Ukuqinisekisa umahluko owaneleyo kwimowudi emnyama, yandisa umahluko wemowudi ekhanyayo okanye utshintshe imibala esuselwe kuyo nge-textColorDarkMode kunye/okanye i-backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Nangona inkcazelo yesimbo { $styleNumber } ichaze umbala wombhalo onomahluko owaneleyo wemowudi ekhanyayo, umbala wombhalo wemowudi emnyama osuselwe kuwo unomahluko ongoneleyo ngokuchasene nekhanvasi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ifuna ubuncinane { $threshold }:1). { $suggestion ->
        [available] Ukuqinisekisa umahluko owaneleyo kwimowudi emnyama, yandisa umahluko wemowudi ekhanyayo (umzekelo misela textColor="{ $lightColor }") okanye utshintshe umbala wemowudi emnyama (umzekelo misela textColorDarkMode="{ $darkColor }").
       *[none] Ukuqinisekisa umahluko owaneleyo kwimowudi emnyama, yandisa umahluko wemowudi ekhanyayo okanye utshintshe umbala osuselwe kuwo nge-textColorDarkMode.
    }

section-multiple-style-palettes = Icandelo linokukhetha i-<stylePalette> enye kuphela; kusetyenziswa eyokugqibela.

## Unique variants

variant-num-to-select-not-non-negative-integer = akunakwenzeka ukumisela iintlobo ezizodwa ze-{ $component } kuba numToSelect ayilolinani elipheleleyo elingekho ngaphantsi kweqanda.

variant-num-to-select-not-constant-number = akunakwenzeka ukumisela iintlobo ezizodwa ze-{ $component } kuba numToSelect ayilolinani elingatshintshiyo.

variant-with-replacement-not-constant-boolean = akunakwenzeka ukumisela iintlobo ezizodwa ze-{ $component } kuba withReplacement ayiyoboolean engatshintshiyo.

variant-select-weight-disables-unique = Iintlobo ezizodwa ze-select ziyavalwa ukuba kukho ukhetho olunochaziweyo u-selectWeight okanye u-selectForVariants

variant-coprime-undetermined = akunakwenzeka ukumisela iintlobo ezizodwa ze-{ $component } kuba akunakumiselwa ukuba coprime isoloko ibubuxoki.

variant-attribute-not-constant = akunakwenzeka ukumisela iintlobo ezizodwa ze-{ $component } kuba { $attribute } ayiyonto engatshintshiyo.

variant-attribute-not-number = akunakwenzeka ukumisela iintlobo ezizodwa ze-{ $component } kuba { $attribute } ayilolinani.

variant-attribute-wrong-type-for-sequence =
    akunakwenzeka ukumisela iintlobo ezizodwa ze-{ $component } zohlobo { $type } kuba { $attribute } ayiyiyo { $expected ->
        [letters-combination] umxube woonobumba
        [math-expression] intetho yezibalo esebenzayo
        [integer] inani elipheleleyo
       *[number] inani
    }.

variant-length-not-integer = akunakwenzeka ukumisela iintlobo ezizodwa ze-{ $component } kuba length ayilolinani elipheleleyo.

variant-sort-not-implemented = iintlobo ezizodwa ze-{ $component } enesort azikasetyenziswa

variant-exclude-combinations-not-implemented = iintlobo ezizodwa ze-{ $component } ene-excludeCombinations azikasetyenziswa

variant-math-exclude-not-implemented = iintlobo ezizodwa ze-{ $component } yohlobo math ene-exclude azikasetyenziswa

variant-non-constant-exclude-not-implemented = iintlobo ezizodwa ze-{ $component } ene-exclude etshintshayo azikasetyenziswa

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ayixhaswanga kwisibonisi se-graph prefigure; inzala itsitsiwe.

prefigure-descendant-invalid-geometry = { $subject }: ijiyometri engapheliyo okanye engaphelelanga; inzala itsitsiwe.

prefigure-curve-label-omitted = { $subject }: iilebhile azixhaswanga kumacandelo ejika aguqulelweyo; ilebhile ishiywe ngaphandle.

prefigure-curve-unsupported-definition-type = { $subject }: uhlobo lwenkcazelo yomsebenzi wejika '{ $definitionType }' aluxhaswanga; inzala itsitsiwe.

prefigure-region-flip-functions-unsupported = { $subject }: impawu flipFunctions ku-regionBetweenCurves ayixhaswanga; inzala itsitsiwe.

prefigure-region-non-formula-child = { $subject }: kuxhaswa kuphela imisebenzi engabantwana yohlobo formula ku-regionBetweenCurves; inzala itsitsiwe.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ayixhaswanga kwi-{ $labelKind ->
        [line-family] lebhile yosapho lomgca
       *[point] lebhile yenqaku
    }; kusetyenziswa ukulungelelanisa okuzenzekelayo kwe-PreFigure.

prefigure-fill-style-unsupported = { $subject }: isimbo sokuzalisa '{ $fillStyle }' asixhaswanga yi-PreFigure; kubuyelwa ekuzaliseni okuqinileyo.

prefigure-line-style-unknown = { $subject }: isimbo somgca esingaziwayo '{ $lineStyle }' sishiywe ngaphandle kophumo lwe-PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: isimbo sophawu '{ $markerStyle }' sitshintshelwe kwisimbo se-PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: isimbo sophawu '{ $markerStyle }' asixhaswanga yi-PreFigure; kusetyenziswa isimbo esizenzekelayo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ayisebenzi; ekujoliswe kuko akunakumiselwa. Inqaku elicacisayo lishiywe ngaphandle.

annotation-ref-multiple-targets = `<annotation>`: `ref` imisele izinto ezininzi ekujoliswe kuzo; kusetyenziswa eyokuqala.

annotation-ref-outside-graph = `<annotation>`: `ref` ayisebenzi; ekujoliswe kuko kungaphandle kwegrafu equlethe. Inqaku elicacisayo lishiywe ngaphandle.

annotation-ref-unsupported-target = `<annotation>`: `ref` ayisebenzi; ekujoliswe kuko akuyonto yomzobo exhaswayo kuguqulelo lwe-prefigure. Inqaku elicacisayo lishiywe ngaphandle.

annotation-text-missing = `<annotation>`: `text` ayikho okanye ayinanto; kukhutshwa umbhalo ongenanto.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kufunyenwe ukuxhomekeka okusisangqa.
       *[other] Kufunyenwe ukuxhomekeka okusisangqa okubandakanya icandelo `<{ $componentType }>`.
    }

reference-no-referent = Akukho nto ibhekiselwe kuyo ifunyenweyo kule mbekiselo: `{ $reference }`

reference-multiple-referents = Kufunyenwe izinto ezininzi ekubhekiselwa kuzo kule mbekiselo: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ifomathi ayisebenzi kwimpawu { $attribute } ye-`<{ $componentType }>`.

children-invalid = Abantwana abangasebenziyo be-`<{ $componentType }>`: kufunyenwe abantwana abangasebenziyo: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ixabiso `{ $value }` alisebenzi kwimpawu `{ $attribute }`; kusetyenziswa ixabiso `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Uguqulelo lwe-DoenetML { $version } alufunyenwanga.
       *[other] Uguqulelo lwe-DoenetML { $version } alufunyenwanga. Kubuyelwa kuguqulelo { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = I-DoenetML ayisebenzi: { $content }

parse-tag-missing-close-tag = I-DoenetML ayisebenzi: Ithegi `{ $tag }` ayinayo ithegi yokuvala. Bekulindeleke ithegi ezivalayo okanye ithegi `</{ $tagName }>`.

parse-tag-error = I-DoenetML ayisebenzi: Impazamo kwithegi `<{ $tagName }>`

parse-attribute-missing-value = I-DoenetML ayisebenzi: Impawu engasebenziyo `{ $attribute }` ibonakala isilela lixabiso.

parse-attribute-invalid = I-DoenetML ayisebenzi: Impawu `{ $attribute }` ayisebenzi

parse-attribute-value-invalid = I-DoenetML ayisebenzi: Ixabiso lempawu `{ $value }` alisebenzi

parse-attribute-value-quote-mismatch = I-DoenetML ayisebenzi: Ixabiso lempawu `{ $value }` alisebenzi. Amanqaku okucaphula awahambelani. Kubonakala ngathi kusilela u-`{ $quote }`

parse-open-tag-name-missing = I-DoenetML ayisebenzi: Kufunyenwe ithegi engenalo igama lethegi, umzekelo `<`

parse-tag-not-closed = I-DoenetML ayisebenzi: Ithegi `{ $tag }` ayivalwanga (kubonakala kusilela u-`>`).

parse-self-closing-tag-name-missing = I-DoenetML ayisebenzi: Kufunyenwe ithegi engenalo igama lethegi `<{ $content }>`

parse-self-closing-tag-not-closed = I-DoenetML ayisebenzi: Ithegi `{ $tag }` ayivalwanga (kubonakala kusilela u-`/>`).

parse-tag-invalid-attributes = I-DoenetML ayisebenzi: Ithegi `{ $tag }` ayisebenzi. Kunokwenzeka inezimpawu ezingalunganga.

parse-close-tag-name-missing = I-DoenetML ayisebenzi: Kufunyenwe ithegi yokuvala engenalo igama lethegi, umzekelo `</`

parse-attribute-value-unquoted = Amaxabiso eempawu kufuneka afakwe kumanqaku okucaphula: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = I-DoenetML ayisebenzi: Kufunyenwe ithegi yokuvala `{ $tag }`, kodwa akukho thegi yokuvula ihambelanayo

parse-close-tag-mismatched = I-DoenetML ayisebenzi: Ithegi yokuvala ayihambelani. Bekulindeleke u-`</{ $expected }>`. Kufunyenwe u-`{ $found }`

parser-node-unconvertible = Akukwazekanga ukuguqula inodi { $node } ibe yinodi ye-Dast.

## Names

name-attribute-invalid =
    Impawu name='{ $name }' ayisebenzi. { $reason ->
        [characters] Amagama anokuba noonobumba, amanani, imigca engezantsi okanye oohayifeni kuphela.
       *[start] Amagama kufuneka aqale ngonobumba.
    }

component-name-invalid-start = Igama lecandelo "{ $name }" alisebenzi. Amagama kufuneka aqale ngonobumba.

## `<answer>` sugar

answer-video-watched-missing-video = Impendulo yohlobo videoWatched kufuneka ibe nempawu video

answer-video-watched-video-not-reference = Impendulo yohlobo videoWatched kufuneka ibe nempawu video eyimbekiselo

answer-name-not-single-text = Impawu name yempendulo kufuneka ibe nomntwana we-text omnye kuphela

## Referencing another document

external-doenetml-recursion-limit = Akunakwenzeka ukufumana i-DoenetML yangaphandle ngenxa yamanqanaba amaninzi kakhulu okuphindaphindeka. Ingaba kukho imbekiselo esisangqa?

external-doenetml-unavailable = Akunakwenzeka ukufumana i-DoenetML ku-{ $attribute }="{ $uri }"

external-doenetml-type-mismatch = I-DoenetML efunyenwe ku-{ $attribute }="{ $uri }" ayisebenzi: ayihambelani nohlobo lwecandelo "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Impawu `{ $from }` ayisasetyenziswa; sebenzisa `{ $to }` endaweni yayo.
       *[other] [deprecation] Impawu `{ $from }` ku-`<{ $component }>` ayisasetyenziswa; sebenzisa `{ $to }` endaweni yayo.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Impawu `{ $from }` ayisasetyenziswa yaye iyatyeshelwa kuba no-`{ $to }` uchaziwe.
       *[other] [deprecation] Impawu `{ $from }` ku-`<{ $component }>` ayisasetyenziswa yaye iyatyeshelwa kuba no-`{ $to }` uchaziwe.
    }

deprecated-attribute-ignored = [deprecation] Impawu `{ $attribute }` ku-`<{ $component }>` ayisasetyenziswa yaye iyatyeshelwa.


## Language coverage

pluralize-english-only = `<pluralize>` inokwenza ubuninzi besiNgesi kuphela, ngoko umbhalo wayo ushiywa unjalo kuxwebhu olubhalwe ngo-{ $locale }. Bhala uhlobo lobuninzi ngokuthe ngqo, okanye ulumisele ngempawu `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Icandelo `<{ $tag }>` aliloncandelo lwe-Doenet olwaziwayo.

schema-element-not-allowed-at-root = Icandelo `<{ $tag }>` alivumelekanga kwingcambu yoxwebhu.

schema-element-not-allowed-inside = Icandelo `<{ $tag }>` alivumelekanga ngaphakathi kwe-`<{ $parent }>`.

schema-attribute-unrecognized = Icandelo `<{ $tag }>` alinayo impawu ethiwa `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Impawu `{ $attribute }` yecandelo `<{ $tag }>` kufuneka ibe luluhlu apho into nganye iyenye ya-: { $allowed }
       *[other] Impawu `{ $attribute }` yecandelo `<{ $tag }>` kufuneka ibe yenye ya-: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Igama lohlobo alisebenzi ku-select. Igama lohlobo { $variantName } livela kwiinketho ezingu-{ $numOptions } kodwa inani ekufuneka likhethwe lingu-{ $numToSelect }.

select-variant-name-without-options = Ezinye iintlobo zichaziwe ku-select kodwa akukho nketho zichaziweyo zegama lohlobo elinokwenzeka: { $variantName }.

select-variant-name-not-possible = Igama lohlobo { $variantName } elichaziweyo ku-select ayilogama lohlobo elinokwenzeka.

select-too-few-options = Akunakwenzeka ukukhetha amacandelo angu-{ $numToSelect } kwangu-{ $numOptions } kuphela.

select-from-sequence-too-few-values = Akunakwenzeka ukukhetha amaxabiso angu-{ $numToSelect } kulandelelwano olunobude obungu-{ $length }.

select-from-sequence-indices-count-mismatch = Inani leendawo ezichaziweyo ze-select kufuneka lihambelane nenani ekufuneka likhethwe

select-from-sequence-indices-not-integers = Zonke iindawo ezichaziweyo ze-select kufuneka zibe ngamanani apheleleyo

select-from-sequence-index-excluded = Kuchaziwe indawo ye-selectfromsequence ebikhutshiwe

select-from-sequence-indices-excluded-combination = Kuchaziwe iindawo ze-selectfromsequence ebeziyimixube ekhutshiweyo

select-from-sequence-coprime-not-positive-integers = Akunakwenzeka ukukhetha imixube ye-coprime kuba akungomanani apheleleyo alungileyo akhethwayo.

select-from-sequence-coprime-common-factor = Akunakwenzeka ukukhetha amanani e-coprime. Onke amaxabiso anokwenzeka abelana ngesahlulo esifanayo. (Amaxabiso achaziweyo e-"from" okanye e-"to" kufuneka abe yi-coprime no-"step".)

select-from-sequence-coprime-single-number = Akunakwenzeka ukukhetha imixube ye-coprime kwinani elinye elingenguye u-1.

select-from-sequence-excluded-too-many-combinations = Kukhutshwe ngaphezu kwe-70% yemixube ku-selectFromSequence

select-from-sequence-coprime-none-found = Akukwazekanga ukukhetha amanani e-coprime. Onke amaxabiso anokwenzeka abelana ngesahlulo esifanayo.

select-from-sequence-too-few-unique-values = Akunakwenzeka ukukhetha amaxabiso azodwa angu-{ $numToSelect } kulandelelwano olunobude obungu-{ $numPossibleValues }

select-prime-numbers-too-few-values = Akunakwenzeka ukukhetha amaxabiso angu-{ $numToSelect } kuluhlu lwamanani angqalileyo olunobude obungu-{ $numValues }

select-prime-numbers-values-count-mismatch = Inani lamaxabiso achaziweyo e-select kufuneka lihambelane nenani ekufuneka likhethwe

select-prime-numbers-values-not-prime = Onke amaxabiso achaziweyo e-select prime number kufuneka abe kuluhlu lwamanani angqalileyo

select-prime-numbers-values-excluded-combination = Amaxabiso achaziweyo e-selectPrimeNumbers ebengumxube okhutshiweyo

select-prime-numbers-excluded-too-many-combinations = Kukhutshwe ngaphezu kwe-70% yemixube ku-selectPrimeNumbers

select-random-combination-fluke = Ngethamsanqa elingalindelekanga kwaphela, akukwazekanga ukukhetha umxube wamaxabiso angacwangciswanga

select-random-value-fluke = Ngethamsanqa elingalindelekanga kwaphela, akukwazekanga ukukhetha ixabiso elingacwangciswanga
