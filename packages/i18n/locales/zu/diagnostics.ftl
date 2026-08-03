# Zulu diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Zulu prefixes a borrowed noun rather than suffixing it, and the prefix goes
# on a word this catalog writes — «i-{ $component }» would weld one to a value
# instead, so these messages name the thing («ingxenye `<{ $component }>`») and
# put the prefix on the word they name.
#
# Where English separates a singular from a plural only in the verb, the Zulu
# verb takes its subject concord from the noun class rather than from the
# count, so those selects are dropped and the count argument goes unused.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } kuyaziywa uma kucaciswe amaphuzu amabili okugcina

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } kuyaziywa uma kucaciswe kokubili iphuzu lokugcina nephuzu eliphakathi

line-segment-midpoint-offset-without-midpoint = midpointOffset ayinamthelela ngaphandle kwephuzu eliphakathi

## `<line>`

line-points-undetermined-dimensions = Umugqa udlula emaphuzwini anobukhulu obungaziwa.

line-points-too-few-dimensions = Umugqa kufanele udlule emaphuzwini anobukhulu obungenani obubili.

line-points-depend-on-variables = Umugqa udlula emaphuzwini axhomeke kokuguqukayo: { $variables }.

line-equation-invalid-format = Ifomethi engavumelekile yesibalo somugqa kokuguqukayo { $variable1 } no-{ $variable2 }.

## `<ray>`

ray-overprescribed-through = Umsebe uchazwe ngo-through, endpoint no-direction kanyekanye. U-through ocacisiwe uyaziywa.

ray-dimension-mismatch = numDimensions ayihambisani emsebeni.

## `<vector>`

vector-overprescribed-head = Ivektha ichazwe ngo-head, tail no-displacement kanyekanye. U-head ocacisiwe uyaziywa.

vector-dimension-mismatch = numDimensions ayihambisani kuvektha.

## Attracting and constraining

attract-to-without-nearest-point = Akukwazeki ukudonsela engxenyeni `<{ $component }>` ngoba ayinakho okuguqukayo kwesimo okuthiwa nearestPoint.

constrain-to-without-nearest-point = Akukwazeki ukukhawulela engxenyeni `<{ $component }>` ngoba ayinakho okuguqukayo kwesimo okuthiwa nearestPoint.

constrain-to-interior-without-nearest-point = Akukwazeki ukukhawulela ngaphakathi kwengxenye `<{ $component }>` ngoba ayinakho okuguqukayo kwesimo okuthiwa nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition iyaziywa ku-choiceInput engekho emugqeni owodwa

## Ordering children by index

choice-input-indices-count-mismatch = Izinkomba ezicacisiwe ze-choiceInput ziyaziywa ngoba inani lezinkomba alihambisani nenani labantwana be-choice.

pretzel-indices-count-mismatch = Izinkomba ezicacisiwe ze-problem ziyaziywa ngoba inani lezinkomba alihambisani nenani labantwana be-problem.

shuffle-indices-count-mismatch = Izinkomba ezicacisiwe ze-shuffle ziyaziywa ngoba inani lezinkomba alihambisani nenani lezingxenye.

indices-ignored-out-of-range = Izinkomba ezicacisiwe ze-{ $component } ziyaziywa ngoba ezinye izinkomba ziphuma ebangeni.

pretzel-indices-repeated = Izinkomba ezicacisiwe ze-pretzel ziyaziywa ngoba ezinye izinkomba ziphindwe kabili.

pretzel-circuit-first-index = Izinkomba ezicacisiwe ze-pretzel kumodi circuit ziyaziywa ngoba inkomba yokuqala kufanele ibe ngu-1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ukuze `<{ $component }>` isebenze nabantwana bohlobo lwe-string, isici `type` kufanele sicaciswe.

invalid-type-defaulting-to-math = type { $type } ayivumelekile engxenyeni { $component }. Kufanele ibe ngenye ya-math, text, number noma boolean. Isethwa ku-math.

string-not-valid-component-to-arrange = I-string "{ $value }" akuyona ingxenye evumelekile ye-{ $component }. Iyaziywa.

## Types and variables

invalid-type-defaulting-to-number = type { $type } ayivumelekile, type isethwa ku-number.

invalid-variable-value = Inani lokuguqukayo alivumelekile: `{ $value }`

## Variants

variant-index-must-be-number = Inkomba yohlobo { $index } kufanele ibe yinombolo

variant-index-must-be-integer = Inkomba yohlobo { $index } kufanele ibe yinombolo ephelele

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ayikasetshenziswa ezilinganisweni eziphelele. Ububanzi busethwa kokuhambisanayo.

side-by-side-absolute-margins = `<{ $component }>` ayikasetshenziswa ezilinganisweni eziphelele. Imikhawulo isethwa kokuhambisanayo.

side-by-side-no-block-child = `<{ $component }>` ayivumelekile: kufanele ibe nomntwana oyedwa okungenani ohlobo lwebhulokhi.

## `<label>`

label-for-ignored-on-graphical = Isici `for` ku-`<label>` yomdwebo siyaziywa.

label-for-must-resolve-to-one = Isici `for` ku-`<label>` kufanele sinqume ingxenye eyodwa kuphela.

label-for-unresolved = Isici `for` ku-`<label>` asikwazanga ukunqunywa kube yingxenye.

label-for-answer-with-authored-inputs = Isici `for` ku-`<label>` sikhomba ku-`<answer>` enokufakwa okubhalwe ngokusobala; khomba lokho kufakwa ngqo.

label-for-answer-without-input = Isici `for` ku-`<label>` sikhomba ku-`<answer>` engenakho ukufakwa okungalejulwa.

label-for-must-reference-input-or-answer = Isici `for` ku-`<label>` kufanele sikhombe ukufakwa noma impendulo.

## Accessibility

accessibility-short-description-or-decorative = Ngenxa yokufinyeleleka, `<{ $component }>` kufanele ibe nencazelo emfushane noma icaciswe njengehlobisayo.

accessibility-video-short-description = Ngenxa yokufinyeleleka, `<video>` kufanele ibe nencazelo emfushane.

accessibility-input-short-description-or-label = Ngenxa yokufinyeleleka, `<{ $component }>` kufanele ibe nencazelo emfushane noma ilebula.

accessibility-answer-input-short-description-or-label = Ngenxa yokufinyeleleka, i-`<answer>` edala ukufakwa kufanele ibe nencazelo emfushane noma ilebula.

accessibility-short-description-contains-math = Izincazelo ezimfushane akufanele zibe nezingxenye zezibalo ezifana no-`<{ $component }>`. Chaza noma yiziphi izibalo ngamagama.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } inomehluko ongenele wombhalo wesihloko sesigaba (imodi emnyama) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; idinga okungenani { $threshold }:1).
       *[other] { $colorName } inomehluko ongenele wombhalo wesihloko sesigaba ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; idinga okungenani { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` edlula emaphuzwini angu-{ $count } ayikasetshenziswa lapho amaphuzu enganawo amanani ezinombolo.

circle-too-many-through-points = Akukwazeki ukubala isiyingi esidlula emaphuzwini angaphezu kwama-3.

circle-overprescribed-radius-center-points = Akukwazeki ukubala isiyingi esinerediyasi, isikhungo namaphuzu okudlula kucaciswe konke.

circle-center-with-multiple-points = Akukwazeki ukubala isiyingi esinesikhungo esicacisiwe esidlula ephuzwini elingaphezu kwelilodwa.

circle-radius-too-small = Akukwazeki ukubala isiyingi: njengoba ibanga phakathi kwamaphuzu amabili lingu-{ $distance }, irediyasi ecacisiwe engu-{ $radius } incane kakhulu.

circle-radius-with-many-points = Akukwazeki ukudala isiyingi esidlula emaphuzwini angaphezu kwamabili sinerediyasi ecacisiwe.

circle-invalid-center-or-through-points = Isikhungo noma amaphuzu okudlula esiyingi awavumelekile.

circle-radius-center-with-multiple-points = Akukwazeki ukubala irediyasi yesiyingi esinesikhungo esicacisiwe esidlula ephuzwini elingaphezu kwelilodwa.

circle-change-radius-non-numerical = Akukwazeki ukushintsha irediyasi yesiyingi esidlula emaphuzwini angenawo amanani ezinombolo

circle-radius-with-points-non-numerical = Akukwazeki ukudala isiyingi esidlula ephuzwini elingaphezu kwelilodwa sinerediyasi ecacisiwe uma kungekho amanani ezinombolo.

circle-change-center-non-numerical = Ukushintsha isikhungo sesiyingi esidlula emaphuzwini angenawo amanani ezinombolo akukasetshenziswa.

## `<function>`

function-domain-insufficient-dimensions = Ubukhulu bendawo yomsebenzi abenele. Indawo inezikhala ezingu-{ $intervals } kodwa umsebenzi unokufakwa okungu-{ $inputs }.

function-domain-invalid-format = Ifomethi yendawo yomsebenzi ayivumelekile.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Kuziywa ukuphakama okuphezulu komsebenzi okungeyona inombolo.
        [minimum] Kuziywa ukuphansi komsebenzi okungeyona inombolo.
        [extremum] Kuziywa ukugcina komsebenzi okungeyona inombolo.
        [point] Kuziywa iphuzu lomsebenzi elingeyona inombolo.
        [slope] Kuziywa uthambeka lomsebenzi olungeyona inombolo.
       *[other] Kuziywa { $type } yomsebenzi engeyona inombolo.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Kuziywa ukuphakama okuphezulu komsebenzi okungenalutho.
        [minimum] Kuziywa ukuphansi komsebenzi okungenalutho.
        [extremum] Kuziywa ukugcina komsebenzi okungenalutho.
        [point] Kuziywa iphuzu lomsebenzi elingenalutho.
       *[other] Kuziywa { $type } yomsebenzi engenalutho.
    }

function-points-too-close = Umsebenzi unamaphuzu amabili aseduze kakhulu. Umsebenzi awukwazi ukuchazwa.

function-iterates-input-output-mismatch = Ukuphindaphinda komsebenzi kungenzeka kuphela uma inani lokufakwa lilingana nenani lokuphuma. Lo msebenzi unokufakwa okungu-{ $inputs } nokuphuma okungu-{ $outputs }.

## `<sequence>`

sequence-invalid-length = Ubude bolandelano abuvumelekile. Kufanele bube yinombolo ephelele engeyona engenhla kwezero.

sequence-invalid-step = Isinyathelo solandelano asivumelekile. Kufanele sibe yinombolo kulandelano lohlobo { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" yolandelano lwezinombolo ayivumelekile. Kufanele ibe yinombolo.

sequence-invalid-endpoint-letters = "{ $attribute }" yolandelano lwezinhlamvu ayivumelekile. Kufanele ibe yinhlanganisela yezinhlamvu.

sequence-invalid-endpoint = "{ $attribute }" yolandelano ayivumelekile.

select-from-sequence-coprime-not-numbers = coprime iyaziywa ngoba akuzona izinombolo ezikhethwayo

select-from-sequence-coprime-with-exclude-combinations = coprime iyaziywa ngoba excludeCombinations icacisiwe

## Resolving a `target`

target-not-found = target ayivumelekile ku-`<{ $source }>`: okuhlosiwe akutholakali.

target-state-variable-not-found = target ayivumelekile ku-`<{ $source }>`: okuguqukayo kwesimo okuthiwa "{ $property }" akutholakali ku-`<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Okuguqukayo kwe-`<odeSystem>` kufanele kwehluke kokuguqukayo okuzimele.

ode-system-duplicate-variable-names = Akukwazeki ukuchaza imisebenzi ye-ODE RHS enamagama okuguqukayo okuxhomekile aphindiwe.

ode-system-rhs-function-error = Akukwazeki ukuchaza umsebenzi we-ODE RHS. Kube nephutha ekudaleni umsebenzi we-mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Akukwazeki ukuchaza i-engeli phakathi kwemigqa engu-{ $count }

angle-invalid-through-point = Iphuzu elingavumelekile ku-through ye-`<angle>`

parabola-vertex-too-many-points = Iparabhola enesiqongo esidlula ephuzwini elingaphezu kwelilodwa ayikasetshenziswa.

parabola-too-many-points = Iparabhola edlula emaphuzwini angaphezu kwama-3 ayikasetshenziswa.

intersection-too-many-items = Ukuhlangana kwezinto ezingaphezu kwezimbili akukasetshenziswa

## Other math components

ionic-compound-not-two-ions = Inhlanganisela ye-ayoni yanoma yini ngaphandle kwama-ayoni amabili ayikasetshenziswa.

ionic-compound-needs-cation-and-anion = Inhlanganisela ye-ayoni isetshenziswe kuphela ku-cation eyodwa ne-anion eyodwa.

solve-equations-cannot-evaluate = Akukwazeki ukuxazulula isibalo ngoba isibalo asikwazanga ukuhlolwa: { $equation }

math-operators-operand-number-required = operandNumber kufanele icaciswe uma kukhishwa i-operand yezibalo.

eigen-decomposition-failed = Akukwazekanga ukubala ama-eigenvalue emethriksi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: i-parameter { $parameters } ayiveli kuphethini, ngakho izohlala ihambisana nesikhala esingenalutho.

## `<graph>`

graph-grid-invalid = `<graph>`: akukwazeki ukuhumusha grid="{ $grid }". Kufanele kube none, medium, dense, noma izinombolo ezimbili ezinhle ezihlukaniswe ngesikhala, njenge-grid="1 0.5". Ayikho igridi edwetshwayo.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ayisekelwe kusibonisi se-prefigure; kusetshenziswa ukuziphatha kwesikhundla sesokudla.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ayisekelwe kusibonisi se-prefigure; kusetshenziswa ukuziphatha kwesikhundla esiphezulu.

prefigure-invalid-axis-bounds = `<graph>`: imikhawulo ye-aksisi ayivumelekile ekuguqulweni kwe-prefigure; kusetshenziswa i-bbox ezenzakalelayo (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ububanzi abuvumelekile ekuguqulweni kwe-prefigure; kusetshenziswa ububanzi bomdwebo obuzenzakalelayo obungu-425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ayivumelekile ekuguqulweni kwe-prefigure; kusetshenziswa isilinganiso esizenzakalelayo esingu-1.

prefigure-grid-spacing-too-fine = `<graph>`: isikhala segridi sincane kakhulu kule mikhawulo ye-aksisi; igridi ishiywe ngaphandle kusibonisi se-prefigure.

prefigure-annotations-not-rendered = `<graph>`: amanothi ngeke aboniswe uma kungasetshenziswa isibonisi se-PreFigure.

multiple-annotations-children = Kutholakale abantwana be-`<annotations>` abaningi ku-`<graph>`; bonke bayaziywa ngaphandle kowokugcina.

## Referring to other components

copy-unrecognized-component-type = Akukwazeki ukwelula noma ukukopisha uhlobo lwengxenye olungaziwa: { $type }.

copy-prop-not-found = Isici { $property } asitholakalanga engxenyeni yohlobo { $component }

collect-no-source = Awukho umthombo otholakele we-collect.

collect-invalid-component-type = Akukwazeki ukuqoqa izingxenye zohlobo `<{ $component }>` ngoba luwuhlobo lwengxenye olungavumelekile.

reference-index-unavailable = Akukwazeki ukukhomba inkomba `{ $reference }`

## `<callAction>`

component-action-unavailable = Akukwazeki ukubiza u-{ $action } engxenyeni `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Idatha inesimo esingavumelekile. Imigqa inobude obungafani. Kutholakale ku-componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Idatha inamagama amakholomu aphindiwe. Kutholakale ku-componentIdx :{ $componentIdx }

data-frame-missing-column-name = Idatha ishoda ngegama lekholomu. Kutholakale ku-componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = I-award yale mpendulo isekelwe empendulweni ethunyelwe yithegi answer ngokwayo, okuzoholela ekuziphatheni okungalindelekile.

answer-max-num-attempts-in-section-wide-check-work = Ukusetha `maxNumAttempts` ku-`<answer>` engaphakathi kwesitsha esine-`sectionWideCheckWork` akunamthelela, ngoba inani lemizamo lilawulwa yisitsha. Setha `maxNumAttempts` esitsheni esikhundleni salokho.

nested-section-wide-check-work-max-num-attempts = Ukusetha `maxNumAttempts` esitsheni esine-`sectionWideCheckWork` esingaphakathi kwesinye isitsha esine-`sectionWideCheckWork` akunamthelela, ngoba inani lemizamo lilawulwa yisitsha sangaphandle. Setha `maxNumAttempts` esitsheni sangaphandle esikhundleni salokho.

answer-attributes-need-symbolic-equality = Izici { $attributes } ngeke zibe namthelela ngaphandle kokuba symbolicEquality isethiwe.

answer-invalid-type = Uhlobo alukavumeleki empendulweni: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Njengoba ingxenye `<{ $component }>` ingenalo igama, ayikwazi ukusetshenziswa njengesici se-module

module-attribute-name-already-defined = Ingxenye `<{ $component } name="{ $name }">` ayikwazi ukusetshenziswa njengesici se-module ngoba uhlobo lwengxenye `<module>` selunesici esithiwa "{ $name }".

conditional-content-condition-ignored = Isici `condition` siyaziywa engxenyeni `<conditionalContent>` enabantwana be-case noma be-else.

slider-markers-type-mismatch = Uhlobo lwezimpawu aluhambisani nohlobo lwe-slider.

pretzel-problem-needs-statement-and-answer = i-pretzel ayivumelekile: i-`<problem>` ngayinye kufanele ibe ne-`<statement>` eyodwa ne-`<answer>` eyodwa.

pretzel-circuit-first-problem-distractor = i-pretzel ayivumelekile: ku-mode="circuit", i-`<problem>` yokuqala ayikwazi ukuba yisiphazamiso.

## Attribute values

attribute-invalid-values = Inani { $values } alivumelekile esicini `{ $attribute }`; liyaziywa.

attribute-must-be-references = Inani `{ $value }` alivumelekile esicini `{ $attribute }`. Isici kufanele sakhiwe ngezinkomba eziqala ngo-`$`.

math-input-invalid-function-names = <mathInput>: kuziywa amagama emisebenzi angavumelekile ku-{ $attribute }: { $names }. Ingxenye ebonisayo yegama ngalinye kufanele ibe nezinhlamvu ezingu-2 okungenani (izinhlamvu noma ohayifana); isijobelelo `|<mathspeak alternative>` singalandela.

## Building components from the source

component-type-invalid = Uhlobo lwengxenye alukavumeleki: `<{ $componentType }>`

attribute-repeated = Isici { $attribute } asikwazi ukuphindwa.

attribute-invalid-for-component = Isici "{ $attribute }" asivumelekile engxenyeni yohlobo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Incazelo yesitayela { $styleNumber } inomehluko ongenele we-{ $context ->
        [text-on-background] mbala wombhalo ngokumelene nombala wangemuva
        [high-contrast] mbala womehluko ophezulu ngokumelene nekhanvasi
        [line] mbala womugqa ngokumelene nekhanvasi
        [marker] mbala wophawu ngokumelene nekhanvasi
       *[text-on-canvas] mbala wombhalo ngokumelene nekhanvasi
    }{ $mode ->
        [dark] { " (imodi emnyama)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; idinga okungenani { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Nakuba incazelo yesitayela { $styleNumber } icacise imibala enomehluko owanele wemodi ekhanyayo, imibala yemodi emnyama esuselwe kuyo inomehluko ongenele wombala wombhalo ngokumelene nombala wangemuva ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; idinga okungenani { $threshold }:1). { $suggestion ->
        [available] Ukuze uqinisekise umehluko owanele kumodi emnyama, khulisa umehluko wemodi ekhanyayo (isibonelo setha { $lightAttribute }="{ $lightColor }") noma ushintshe umbala wemodi emnyama (isibonelo setha { $darkAttribute }="{ $darkColor }").
       *[none] Ukuze uqinisekise umehluko owanele kumodi emnyama, khulisa umehluko wemodi ekhanyayo noma ushintshe imibala esuselwe kuyo nge-textColorDarkMode kanye/noma i-backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Nakuba incazelo yesitayela { $styleNumber } icacise umbala wombhalo onomehluko owanele wemodi ekhanyayo, umbala wombhalo wemodi emnyama osuselwe kuwo unomehluko ongenele ngokumelene nekhanvasi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; idinga okungenani { $threshold }:1). { $suggestion ->
        [available] Ukuze uqinisekise umehluko owanele kumodi emnyama, khulisa umehluko wemodi ekhanyayo (isibonelo setha textColor="{ $lightColor }") noma ushintshe umbala wemodi emnyama (isibonelo setha textColorDarkMode="{ $darkColor }").
       *[none] Ukuze uqinisekise umehluko owanele kumodi emnyama, khulisa umehluko wemodi ekhanyayo noma ushintshe umbala osuselwe kuwo nge-textColorDarkMode.
    }

section-multiple-style-palettes = Isigaba singakhetha i-<stylePalette> eyodwa kuphela; kusetshenziswa eyokugcina.

## Unique variants

variant-num-to-select-not-non-negative-integer = akukwazeki ukunquma izinhlobo eziyingqayizivele ze-{ $component } ngoba numToSelect akuyona inombolo ephelele engeyona engenhla kwezero.

variant-num-to-select-not-constant-number = akukwazeki ukunquma izinhlobo eziyingqayizivele ze-{ $component } ngoba numToSelect akuyona inombolo engaguquki.

variant-with-replacement-not-constant-boolean = akukwazeki ukunquma izinhlobo eziyingqayizivele ze-{ $component } ngoba withReplacement akuyona i-boolean engaguquki.

variant-select-weight-disables-unique = Izinhlobo eziyingqayizivele ze-select ziyavalwa uma kukhona inketho enocacisiwe u-selectWeight noma u-selectForVariants

variant-coprime-undetermined = akukwazeki ukunquma izinhlobo eziyingqayizivele ze-{ $component } ngoba akukwazeki ukunquma ukuthi coprime ihlala ingamanga.

variant-attribute-not-constant = akukwazeki ukunquma izinhlobo eziyingqayizivele ze-{ $component } ngoba { $attribute } akuyona into engaguquki.

variant-attribute-not-number = akukwazeki ukunquma izinhlobo eziyingqayizivele ze-{ $component } ngoba { $attribute } akuyona inombolo.

variant-attribute-wrong-type-for-sequence =
    akukwazeki ukunquma izinhlobo eziyingqayizivele ze-{ $component } yohlobo { $type } ngoba { $attribute } akuyona { $expected ->
        [letters-combination] inhlanganisela yezinhlamvu
        [math-expression] inkulumo yezibalo evumelekile
        [integer] inombolo ephelele
       *[number] inombolo
    }.

variant-length-not-integer = akukwazeki ukunquma izinhlobo eziyingqayizivele ze-{ $component } ngoba length akuyona inombolo ephelele.

variant-sort-not-implemented = izinhlobo eziyingqayizivele ze-{ $component } ene-sort azikasetshenziswa

variant-exclude-combinations-not-implemented = izinhlobo eziyingqayizivele ze-{ $component } ene-excludeCombinations azikasetshenziswa

variant-math-exclude-not-implemented = izinhlobo eziyingqayizivele ze-{ $component } yohlobo math ene-exclude azikasetshenziswa

variant-non-constant-exclude-not-implemented = izinhlobo eziyingqayizivele ze-{ $component } ene-exclude eguqukayo azikasetshenziswa

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ayisekelwe kusibonisi se-graph prefigure; inzalo yeqiwe.

prefigure-descendant-invalid-geometry = { $subject }: ijiyomethri engapheli noma engaphelele; inzalo yeqiwe.

prefigure-curve-label-omitted = { $subject }: amalebula awasekelwe ezingxenyeni zejika eziguquliwe; ilebula lishiywe ngaphandle.

prefigure-curve-unsupported-definition-type = { $subject }: uhlobo lwencazelo yomsebenzi wejika '{ $definitionType }' alusekelwe; inzalo yeqiwe.

prefigure-region-flip-functions-unsupported = { $subject }: isici flipFunctions ku-regionBetweenCurves asisekelwe; inzalo yeqiwe.

prefigure-region-non-formula-child = { $subject }: kusekelwa kuphela imisebenzi engabantwana yohlobo formula ku-regionBetweenCurves; inzalo yeqiwe.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ayisekelwe ku-{ $labelKind ->
        [line-family] lebula lomndeni womugqa
       *[point] lebula lephuzu
    }; kusetshenziswa ukuqondanisa okuzenzakalelayo kwe-PreFigure.

prefigure-fill-style-unsupported = { $subject }: isitayela sokugcwalisa '{ $fillStyle }' asisekelwe yi-PreFigure; kubuyelwa ekugcwaliseni okuqinile.

prefigure-line-style-unknown = { $subject }: isitayela somugqa esingaziwa '{ $lineStyle }' sishiywe ngaphandle kokuphuma kwe-PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: isitayela sophawu '{ $markerStyle }' sishintshelwe kusitayela se-PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: isitayela sophawu '{ $markerStyle }' asisekelwe yi-PreFigure; kusetshenziswa isitayela esizenzakalelayo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ayivumelekile; okuhlosiwe akukwazi ukunqunywa. Inothi lishiywe ngaphandle.

annotation-ref-multiple-targets = `<annotation>`: `ref` inqume okuhlosiwe okuningi; kusetshenziswa okokuqala.

annotation-ref-outside-graph = `<annotation>`: `ref` ayivumelekile; okuhlosiwe kungaphandle kwegrafu ekuqukethe. Inothi lishiywe ngaphandle.

annotation-ref-unsupported-target = `<annotation>`: `ref` ayivumelekile; okuhlosiwe akuyona into yomdwebo esekelwayo ekuguqulweni kwe-prefigure. Inothi lishiywe ngaphandle.

annotation-text-missing = `<annotation>`: `text` ayikho noma ayinalutho; kukhishwa umbhalo ongenalutho.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kutholakale ukuxhomeka okuyindilinga.
       *[other] Kutholakale ukuxhomeka okuyindilinga okuhilela ingxenye `<{ $componentType }>`.
    }

reference-no-referent = Ayikho into ekhonjiwe etholakele kule nkomba: `{ $reference }`

reference-multiple-referents = Kutholakale izinto eziningi ezikhonjiwe kule nkomba: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ifomethi ayivumelekile esicini { $attribute } se-`<{ $componentType }>`.

children-invalid = Abantwana abavumelekile be-`<{ $componentType }>`: kutholakale abantwana abangavumelekile: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Inani `{ $value }` alivumelekile esicini `{ $attribute }`; kusetshenziswa inani `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Inguqulo ye-DoenetML { $version } ayitholakalanga.
       *[other] Inguqulo ye-DoenetML { $version } ayitholakalanga. Kubuyelwa enguqulweni { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = I-DoenetML ayivumelekile: { $content }

parse-tag-missing-close-tag = I-DoenetML ayivumelekile: Ithegi `{ $tag }` ayinayo ithegi yokuvala. Bekulindeleke ithegi ezivalayo noma ithegi `</{ $tagName }>`.

parse-tag-error = I-DoenetML ayivumelekile: Iphutha kuthegi `<{ $tagName }>`

parse-attribute-missing-value = I-DoenetML ayivumelekile: Isici esingavumelekile `{ $attribute }` sibonakala sishoda ngenani.

parse-attribute-invalid = I-DoenetML ayivumelekile: Isici `{ $attribute }` asivumelekile

parse-attribute-value-invalid = I-DoenetML ayivumelekile: Inani lesici `{ $value }` alivumelekile

parse-attribute-value-quote-mismatch = I-DoenetML ayivumelekile: Inani lesici `{ $value }` alivumelekile. Izimpawu zokucaphuna azihambisani. Kubonakala sengathi kushoda u-`{ $quote }`

parse-open-tag-name-missing = I-DoenetML ayivumelekile: Kutholakale ithegi engenalo igama lethegi, isibonelo `<`

parse-tag-not-closed = I-DoenetML ayivumelekile: Ithegi `{ $tag }` ayivalwanga (kubonakala kushoda u-`>`).

parse-self-closing-tag-name-missing = I-DoenetML ayivumelekile: Kutholakale ithegi engenalo igama lethegi `<{ $content }>`

parse-self-closing-tag-not-closed = I-DoenetML ayivumelekile: Ithegi `{ $tag }` ayivalwanga (kubonakala kushoda u-`/>`).

parse-tag-invalid-attributes = I-DoenetML ayivumelekile: Ithegi `{ $tag }` ayivumelekile. Kungenzeka inezici ezingalungile.

parse-close-tag-name-missing = I-DoenetML ayivumelekile: Kutholakale ithegi yokuvala engenalo igama lethegi, isibonelo `</`

parse-attribute-value-unquoted = Amanani ezici kufanele afakwe ezimpawini zokucaphuna: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = I-DoenetML ayivumelekile: Kutholakale ithegi yokuvala `{ $tag }`, kodwa ayikho ithegi yokuvula ehambisanayo

parse-close-tag-mismatched = I-DoenetML ayivumelekile: Ithegi yokuvala ayihambisani. Bekulindeleke u-`</{ $expected }>`. Kutholakale u-`{ $found }`

parser-node-unconvertible = Akukwazekanga ukuguqula inodi { $node } ibe yinodi ye-Dast.

## Names

name-attribute-invalid =
    Isici name='{ $name }' asivumelekile. { $reason ->
        [characters] Amagama angaba nezinhlamvu, izinombolo, ondlelambili noma ohayifana kuphela.
       *[start] Amagama kufanele aqale ngenhlamvu.
    }

component-name-invalid-start = Igama lengxenye "{ $name }" alivumelekile. Amagama kufanele aqale ngenhlamvu.

## `<answer>` sugar

answer-video-watched-missing-video = Impendulo yohlobo videoWatched kufanele ibe nesici video

answer-video-watched-video-not-reference = Impendulo yohlobo videoWatched kufanele ibe nesici video esiyinkomba

answer-name-not-single-text = Isici name sempendulo kufanele sibe nomntwana we-text oyedwa kuphela

## Referencing another document

external-doenetml-recursion-limit = Akukwazeki ukuthola i-DoenetML yangaphandle ngenxa yamazinga amaningi kakhulu okuphindaphindeka. Ingabe kunenkomba eyindilinga?

external-doenetml-unavailable = Akukwazeki ukuthola i-DoenetML ku-{ $attribute }="{ $uri }"

external-doenetml-type-mismatch = I-DoenetML etholakele ku-{ $attribute }="{ $uri }" ayivumelekile: ayihambisani nohlobo lwengxenye "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Isici `{ $from }` asisasetshenziswa; sebenzisa `{ $to }` esikhundleni salo.
       *[other] [deprecation] Isici `{ $from }` ku-`<{ $component }>` asisasetshenziswa; sebenzisa `{ $to }` esikhundleni salo.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Isici `{ $from }` asisasetshenziswa futhi siyaziywa ngoba no-`{ $to }` ucacisiwe.
       *[other] [deprecation] Isici `{ $from }` ku-`<{ $component }>` asisasetshenziswa futhi siyaziywa ngoba no-`{ $to }` ucacisiwe.
    }

deprecated-attribute-ignored = [deprecation] Isici `{ $attribute }` ku-`<{ $component }>` asisasetshenziswa futhi siyaziywa.


## Language coverage

pluralize-english-only = `<pluralize>` ingenza ubuningi kwisiNgisi kuphela, ngakho umbhalo wayo ushiywa unjalo embhalweni obhalwe ngo-{ $locale }. Bhala uhlobo lobuningi ngqo, noma ulusethe ngesici `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ingxenye `<{ $tag }>` akuyona ingxenye ye-Doenet eyaziwayo.

schema-element-not-allowed-at-root = Ingxenye `<{ $tag }>` ayivunyelwe empandeni yombhalo.

schema-element-not-allowed-inside = Ingxenye `<{ $tag }>` ayivunyelwe ngaphakathi kwe-`<{ $parent }>`.

schema-attribute-unrecognized = Ingxenye `<{ $tag }>` ayinaso isici esithiwa `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Isici `{ $attribute }` sengxenye `<{ $tag }>` kufanele sibe uhlu okuthi into ngayinye kulo ibe ngenye ya-: { $allowed }
       *[other] Isici `{ $attribute }` sengxenye `<{ $tag }>` kufanele sibe ngenye ya-: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Igama lohlobo alivumelekile ku-select. Igama lohlobo { $variantName } livela ezinkethweni ezingu-{ $numOptions } kodwa inani okufanele likhethwe lingu-{ $numToSelect }.

select-variant-name-without-options = Ezinye izinhlobo zicacisiwe ku-select kodwa azikho izinketho ezicacisiwe zegama lohlobo elingenzeka: { $variantName }.

select-variant-name-not-possible = Igama lohlobo { $variantName } elicacisiwe ku-select akulona igama lohlobo elingenzeka.

select-too-few-options = Akukwazeki ukukhetha izingxenye ezingu-{ $numToSelect } kwezingu-{ $numOptions } kuphela.

select-from-sequence-too-few-values = Akukwazeki ukukhetha amanani angu-{ $numToSelect } kulandelano olunobude obungu-{ $length }.

select-from-sequence-indices-count-mismatch = Inani lezinkomba ezicacisiwe ze-select kufanele lihambisane nenani okufanele likhethwe

select-from-sequence-indices-not-integers = Zonke izinkomba ezicacisiwe ze-select kufanele zibe izinombolo eziphelele

select-from-sequence-index-excluded = Kucacisiwe inkomba ye-selectfromsequence ebikhishiwe

select-from-sequence-indices-excluded-combination = Kucacisiwe izinkomba ze-selectfromsequence ebeziyinhlanganisela ekhishiwe

select-from-sequence-coprime-not-positive-integers = Akukwazeki ukukhetha izinhlanganisela ze-coprime ngoba akuzona izinombolo eziphelele ezinhle ezikhethwayo.

select-from-sequence-coprime-common-factor = Akukwazeki ukukhetha izinombolo ze-coprime. Wonke amanani angenzeka abelana ngesici esifanayo. (Amanani acacisiwe e-"from" noma e-"to" kufanele abe yi-coprime no-"step".)

select-from-sequence-coprime-single-number = Akukwazeki ukukhetha izinhlanganisela ze-coprime enombolweni eyodwa engeyona u-1.

select-from-sequence-excluded-too-many-combinations = Kukhishwe ngaphezu kuka-70% wezinhlanganisela ku-selectFromSequence

select-from-sequence-coprime-none-found = Akukwazekanga ukukhetha izinombolo ze-coprime. Wonke amanani angenzeka abelana ngesici esifanayo.

select-from-sequence-too-few-unique-values = Akukwazeki ukukhetha amanani ayingqayizivele angu-{ $numToSelect } kulandelano olunobude obungu-{ $numPossibleValues }

select-prime-numbers-too-few-values = Akukwazeki ukukhetha amanani angu-{ $numToSelect } ohlwini lwezinombolo eziyisisekelo olunobude obungu-{ $numValues }

select-prime-numbers-values-count-mismatch = Inani lamanani acacisiwe e-select kufanele lihambisane nenani okufanele likhethwe

select-prime-numbers-values-not-prime = Wonke amanani acacisiwe e-select prime number kufanele abe sohlwini lwezinombolo eziyisisekelo

select-prime-numbers-values-excluded-combination = Amanani acacisiwe e-selectPrimeNumbers abeyinhlanganisela ekhishiwe

select-prime-numbers-excluded-too-many-combinations = Kukhishwe ngaphezu kuka-70% wezinhlanganisela ku-selectPrimeNumbers

select-random-combination-fluke = Ngenhlanhla engalindelekile neze, akukwazekanga ukukhetha inhlanganisela yamanani angahleliwe

select-random-value-fluke = Ngenhlanhla engalindelekile neze, akukwazekanga ukukhetha inani elingahleliwe
