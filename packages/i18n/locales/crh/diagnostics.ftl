# Crimean Tatar (qırımtatar tili) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script.** The Latin alphabet standardized for Crimean Tatar in Ukraine in
# 2021: `q` for the uvular stop, `ñ` for the velar nasal, `i`/`ı` as two
# letters, and `ğ ş ç ö ü`. The **Cyrillic orthography is equally current** in
# Crimea; a reviewer who prefers it must convert all four files of this locale
# together and must never mix the two inside one catalog. `chrome.ftl`'s
# header states this in full.
#
# **Number.** A Crimean Tatar noun after a numeral is unmarked, so English's
# `one` and `other` branches would be identical word for word here and every
# one of them is written as **a single unselected form**. `Intl.PluralRules`
# has no CLDR data for `crh`, so no `[zero]`, `[two]`, `[few]` or `[many]`
# branch appears anywhere.
#
# **Suffixes and placeables.** Crimean Tatar suffixes harmonize with the
# vowels of the word they attach to. An element name, attribute name or value
# quoted from the author's own source arrives as a placeable whose vowels this
# catalog cannot see, so **no case ending is welded onto one**: those names are
# left to stand on their own, and the sentence is built around them with
# separate words instead. That is a recorded debt rather than a preference.
#
# **Vocabulary.** The technical register here is largely borrowed, which is
# what Crimean Tatar itself does: «komponent», «atribut», «funktsiya»,
# «indeks», «variant», «matritsa», «rekursiya», «annotatsiya», «versiya»,
# «domen», «kontrast», «konteyner», «slayder», «shablon», «prost sayı»
# (a prime, after Russian «простое число»), «format», «tip» and the PreFigure
# and DoenetML names themselves. Where a native word exists it is used —
# «keçersiz» invalid, «tapılmadı» not found, «esapqa alınmay» is ignored,
# «amelge keçirilmedi» not implemented, «kösterici» renderer, «bala element»
# child element. The last three are calques and are the ones a reviewer should
# read first.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = Eki uç noqta belgilengende { $attributes } esapqa alınmay

line-segment-attributes-ignored-with-endpoint-and-midpoint = Bir uç noqta ve bir orta noqta birden belgilengende { $attributes } esapqa alınmay

line-segment-midpoint-offset-without-midpoint = Orta noqta olmadan midpointOffset iş körmey

## `<line>`

line-points-undetermined-dimensions = Ölçemleri belgisiz noqtalardan keçken doğru.

line-points-too-few-dimensions = Doğru eñ az eki ölçemli noqtalardan keçmeli.

line-points-depend-on-variables = Doğru deñişkenlerge bağlı noqtalardan keçe: { $variables }.

line-equation-invalid-format = { $variable1 } ve { $variable2 } deñişkenlerinen yazılğan doğru tenleminiñ formatı keçersiz.

## `<ray>`

ray-overprescribed-through = Işın aynı vaqıtta through, endpoint ve direction ile belgilengen. Belgilengen through esapqa alınmay.

ray-dimension-mismatch = Işında numDimensions uyğun kelmey.

## `<vector>`

vector-overprescribed-head = Vektor aynı vaqıtta head, tail ve displacement ile belgilengen. Belgilengen head esapqa alınmay.

vector-dimension-mismatch = Vektorda numDimensions uyğun kelmey.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` komponentine tartılamay: onıñ nearestPoint durum deñişkeni yoq.

constrain-to-without-nearest-point = `<{ $component }>` komponentine sıñırlanamay: onıñ nearestPoint durum deñişkeni yoq.

constrain-to-interior-without-nearest-point = `<{ $component }>` komponentiniñ içine sıñırlanamay: onıñ nearestPoint durum deñişkeni yoq.

## `<choiceInput>`

choice-input-label-position-ignored = Satır içi olmağan choiceInput içün labelPosition esapqa alınmay

## Ordering children by index

choice-input-indices-count-mismatch = indices sayısı choice bala elementleriniñ sayısına uyğun kelmegeni içün choiceInput içün belgilengen indices esapqa alınmay.

pretzel-indices-count-mismatch = indices sayısı problem bala elementleriniñ sayısına uyğun kelmegeni içün problem içün belgilengen indices esapqa alınmay.

shuffle-indices-count-mismatch = indices sayısı komponent sayısına uyğun kelmegeni içün shuffle içün belgilengen indices esapqa alınmay.

indices-ignored-out-of-range = Bazı indeksler aralıq tışında olğanı içün { $component } içün belgilengen indices esapqa alınmay.

pretzel-indices-repeated = Bazı indeksler tekrarlanğanı içün pretzel içün belgilengen indices esapqa alınmay.

pretzel-circuit-first-index = circuit rejiminde birinci indeks mıtlaqa 1 olmalı olğanı içün pretzel içün belgilengen indices esapqa alınmay.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` metin bala elementlerinen çalışsın dep, `type` atributı belgilenmeli.

invalid-type-defaulting-to-math = { $component } komponenti içün { $type } tipi keçersiz. math, text, number yaki boolean olmalı. math qullanıla.

string-not-valid-component-to-arrange = "{ $value }" metni { $component } içün keçerli bir komponent degil. Esapqa alınmay.

## Types and variables

invalid-type-defaulting-to-number = { $type } tipi keçersiz; tip number olaraq belgilene.

invalid-variable-value = Deñişkenniñ qıymeti keçersiz: `{ $value }`

## Variants

variant-index-must-be-number = { $index } variant indeksi bir sayı olmalı

variant-index-must-be-integer = { $index } variant indeksi bir tam sayı olmalı

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` mutlaq ölçüler içün amelge keçirilmedi. Kenişlikler nisbiy qıymetlerge çevirile.

side-by-side-absolute-margins = `<{ $component }>` mutlaq ölçüler içün amelge keçirilmedi. Kenar boşluqları nisbiy qıymetlerge çevirile.

side-by-side-no-block-child = `<{ $component }>` keçersiz: eñ az bir blok bala elementi olmalı.

## `<label>`

label-for-ignored-on-graphical = Grafik `<label>` üzerindeki `for` atributı esapqa alınmay.

label-for-must-resolve-to-one = `<label>` üzerindeki `for` atributı tam bir komponentke çözülmeli.

label-for-unresolved = `<label>` üzerindeki `for` atributı bir komponentke çözülamadı.

label-for-answer-with-authored-inputs = `<label>` üzerindeki `for` atributı kirişleri açıqtan yazılğan bir `<answer>` üzerine köstere; doğrudan o kirişke köster.

label-for-answer-without-input = `<label>` üzerindeki `for` atributı etiketlenecek kirişi olmağan bir `<answer>` üzerine köstere.

label-for-must-reference-input-or-answer = `<label>` üzerindeki `for` atributı bir kirişke yaki bir cevapqa köstermeli.

## Accessibility

accessibility-short-description-or-decorative = İrişimlik içün `<{ $component }>` ya qısqa bir tarifke saip olmalı, ya da bezev olaraq belgilenmeli.

accessibility-video-short-description = İrişimlik içün `<video>` qısqa bir tarifke saip olmalı.

accessibility-input-short-description-or-label = İrişimlik içün `<{ $component }>` qısqa bir tarifke yaki bir etiketke saip olmalı.

accessibility-answer-input-short-description-or-label = İrişimlik içün kiriş yaratqan `<answer>` qısqa bir tarifke yaki bir etiketke saip olmalı.

accessibility-short-description-contains-math = Qısqa tarifler `<{ $component }>` kibi matematik komponentlerni içermemeli. Matematikni sözlernen yazıñız.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } bölük başlığı metni içün yeterli kontrastqa saip degil (qarañğı rejim) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; eñ az { $threshold }:1 kerek).
       *[other] { $colorName } bölük başlığı metni içün yeterli kontrastqa saip degil ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; eñ az { $threshold }:1 kerek).
    }

## `<circle>`

circle-through-points-non-numerical = Noqtalarnıñ sayısal qıymetleri olmağanda { $count } noqtadan keçken `<circle>` ale amelge keçirilmedi.

circle-too-many-through-points = 3 noqtadan çoq noqtadan keçken çember esaplanamay.

circle-overprescribed-radius-center-points = Radiusı, merkezi ve keçken noqtaları birden belgilengen çember esaplanamay.

circle-center-with-multiple-points = Merkezi belgilengen ve 1 noqtadan çoq noqtadan keçken çember esaplanamay.

circle-radius-too-small = Çember esaplanamay: eki noqta arasındaki mesafe { $distance } olğanına köre, belgilengen { $radius } radiusı pek kiçik.

circle-radius-with-many-points = Radiusı belgilengen ve ekiden çoq noqtadan keçken çember yaratılamay.

circle-invalid-center-or-through-points = Çemberniñ merkezi yaki keçken noqtaları keçersiz.

circle-radius-center-with-multiple-points = Merkezi belgilengen ve 1 noqtadan çoq noqtadan keçken çemberniñ radiusı esaplanamay.

circle-change-radius-non-numerical = Keçken noqtaları sayısal olmağan çemberniñ radiusı deñiştirilamay

circle-radius-with-points-non-numerical = Sayısal qıymetler yoq eken, radiusı belgilengen ve birden çoq noqtadan keçken çember yaratılamay.

circle-change-center-non-numerical = Sayısal olmağan noqtalardan keçken çemberniñ merkezini deñiştirmek ale amelge keçirilmedi.

## `<function>`

function-domain-insufficient-dimensions = Funktsiyanıñ domeni içün ölçemler yeterli degil. Domende { $intervals } aralıq bar, amma funktsiyanıñ { $inputs } kirişi bar.

function-domain-invalid-format = Funktsiyanıñ domeniniñ formatı keçersiz.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funktsiyanıñ sayısal olmağan eñ büyük qıymeti esapqa alınmay.
        [minimum] Funktsiyanıñ sayısal olmağan eñ kiçik qıymeti esapqa alınmay.
        [extremum] Funktsiyanıñ sayısal olmağan uç qıymeti esapqa alınmay.
        [point] Funktsiyanıñ sayısal olmağan noqtası esapqa alınmay.
        [slope] Funktsiyanıñ sayısal olmağan eğimi esapqa alınmay.
       *[other] Funktsiyanıñ sayısal olmağan { $type } qıymeti esapqa alınmay.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funktsiyanıñ boş eñ büyük qıymeti esapqa alınmay.
        [minimum] Funktsiyanıñ boş eñ kiçik qıymeti esapqa alınmay.
        [extremum] Funktsiyanıñ boş uç qıymeti esapqa alınmay.
        [point] Funktsiyanıñ boş noqtası esapqa alınmay.
       *[other] Funktsiyanıñ boş { $type } qıymeti esapqa alınmay.
    }

function-points-too-close = Funktsiyada yerleri biri-birine pek yaqın eki noqta bar. Funktsiya belgilenamay.

function-iterates-input-output-mismatch = Funktsiya iteratsiyaları ancaq kiriş sayısı çıqış sayısına teñ olsa mümkün. Bu funktsiyanıñ { $inputs } kirişi ve { $outputs } çıqışı bar.

## `<sequence>`

sequence-invalid-length = Sıranıñ uzunlığı keçersiz. Menfiy olmağan tam sayı olmalı.

sequence-invalid-step = Sıranıñ adımı keçersiz. { $type } tipindeki sıra içün bir sayı olmalı.

sequence-invalid-endpoint-number = Sayı sırasınıñ "{ $attribute }" qıymeti keçersiz. Bir sayı olmalı.

sequence-invalid-endpoint-letters = Arif sırasınıñ "{ $attribute }" qıymeti keçersiz. Ariflerniñ birleşmesi olmalı.

sequence-invalid-endpoint = Sıranıñ "{ $attribute }" qıymeti keçersiz.

select-from-sequence-coprime-not-numbers = Sayılar saylanmağanı içün coprime esapqa alınmadı

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations belgilengeni içün coprime esapqa alınmadı

## Resolving a `target`

target-not-found = `<{ $source }>` içün target keçersiz: maqsat tapılmay.

target-state-variable-not-found = `<{ $source }>` içün target keçersiz: `<{ $component }>` üzerinde "{ $property }" adlı durum deñişkeni tapılmay.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` deñişkenleri baqımsız deñişkenden farqlı olmalı.

ode-system-duplicate-variable-names = Tekrarlanğan bağlı deñişken adlarınen ODE oñ taraf funktsiyaları belgilenamay.

ode-system-rhs-function-error = ODE oñ taraf funktsiyası belgilenamay. mathjs funktsiyasını yaratqanda hata oldı.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } doğru arasındaki açı belgilenamay

angle-invalid-through-point = `<angle>` elementiniñ through qıymetinde keçersiz noqta bar

parabola-vertex-too-many-points = Tepe noqtası belgilengen ve 1 noqtadan çoq noqtadan keçken parabola ale amelge keçirilmedi.

parabola-too-many-points = 3 noqtadan çoq noqtadan keçken parabola ale amelge keçirilmedi.

intersection-too-many-items = Ekiden çoq nesneniñ kesişmesi ale amelge keçirilmedi

## Other math components

ionic-compound-not-two-ions = Eki iondan başqa ion bileşimleri ale amelge keçirilmedi.

ionic-compound-needs-cation-and-anion = Ion bileşimi tek bir kation ve bir anion içün amelge keçirilgen.

solve-equations-cannot-evaluate = Tenlem esaplanamağanı içün çezilamay: { $equation }

math-operators-operand-number-required = Matematik operand alınğanda operandNumber belgilenmeli.

eigen-decomposition-failed = Matritsanıñ öz qıymetleri esaplanamadı

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } parametrleri shablonda keçmey, onıñ içün er zaman boşnen uyğun kelecek.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" añlaşılamay. none, medium, dense yaki boşluqnen ayırılğan eki müsbet sayı olmalı, mesela grid="1 0.5". Tor sızılmay.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` içün { $expected ->
        [one] bir çıqışı — er noqtada y' eğimi, mesela `y - x` — olğan funktsiya
       *[other] eki çıqışı — er noqtada vektor, mesela `(y, -x)` — olğan funktsiya
    } kerek, amma berilgen funktsiyanıñ { $found } çıqışı bar. { $alternative ->
        [none] İç bir şey sızılmay.
       *[other] Bu funktsiya içün uyğun komponent — `<{ $alternative }>`. İç bir şey sızılmay.
    }

field-function-attribute-ignored-with-child = Funktsiya komponentniñ içinde de berilgeni içün `function` atributı esapqa alınmay; içtekisi qullanıla. Funktsiyanı bu eki yoldan tek biri ile beriñiz.

field-variables-ignored =
    `<{ $component }>`: `variables` atributı komponentniñ içinde doğrudan yazılğan ifadeniñ deñişkenlerini adlandıra. { $reason ->
        [function-child] Mındaki funktsiya `<function>` bala elementi olaraq berilgen ve öz deñişkenlerini özü adlandıra, onıñ içün `variables` esapqa alınmay.
       *[no-expression] Mında böyle bir ifade berilmegen, onıñ içün `variables` esapqa alınmay.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure köstericisinde xLabelPosition="left" desteklenmey; oñ taraf davranışı qullanıla.

prefigure-y-label-position-unsupported = `<graph>`: prefigure köstericisinde yLabelPosition="bottom" desteklenmey; üst taraf davranışı qullanıla.

prefigure-invalid-axis-bounds = `<graph>`: prefigure çevirmesi içün oq sıñırları keçersiz; ög belgilengen bbox (-10,-10,10,10) qullanıla.

prefigure-invalid-width = `<graph>`: prefigure çevirmesi içün kenişlik keçersiz; ög belgilengen diagramma kenişligi 425 qullanıla.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure çevirmesi içün aspectRatio keçersiz; ög belgilengen en-boy nisbeti 1 qullanıla.

prefigure-grid-spacing-too-fine = `<graph>`: tor aralığı oq sıñırlarına köre pek ince; prefigure köstericisinde tor sızılmay.

prefigure-annotations-not-rendered = `<graph>`: PreFigure köstericisi qullanılmağanda annotatsiyalar sızılmay.

multiple-annotations-children = `<graph>` içinde birden çoq `<annotations>` bala elementi tapıldı; soñuncısından ğayrısı esapqa alınmay.

## Referring to other components

copy-unrecognized-component-type = Tanılmağan komponent tipi keñişletilamay yaki kopiyalanamay: { $type }.

copy-prop-not-found = { $component } tipindeki komponentte { $property } hasiyeti tapılmadı

collect-no-source = collect içün menba tapılmadı.

collect-invalid-component-type = `<{ $component }>` keçerli komponent tipi olmağanı içün bu tiptekiler cıyılamay.

reference-index-unavailable = `{ $reference }` indeksine kösterilamay

## `<callAction>`

component-action-unavailable = `{ $reference }` komponentinde { $action } çağırılamay

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Berilgenlerniñ şekli keçersiz. Satır uzunlıqları uyğun kelmey. componentIdx :{ $componentIdx } içinde tapıldı

data-frame-duplicate-column-names = Berilgenlerde tekrarlanğan sutun adları bar. componentIdx :{ $componentIdx } içinde tapıldı

data-frame-missing-column-name = Berilgenlerde bir sutun adı eksik. componentIdx :{ $componentIdx } içinde tapıldı

## `<answer>` and scoring

answer-award-depends-on-own-response = Bu cevapnıñ bir award elementi answer tegniñ özü yibergen cevapqa tayana; bu beklenmegen davranışqa alıp bara.

answer-max-num-attempts-in-section-wide-check-work = Deñeme sayısı konteyner tarafından idare etilgeni içün, `sectionWideCheckWork` olğan konteyner içindeki `<answer>` üzerinde `maxNumAttempts` belgilemekniñ tesiri yoq. `maxNumAttempts` qıymetini konteynerde belgileñiz.

nested-section-wide-check-work-max-num-attempts = Deñeme sayısı tıştaki konteyner tarafından idare etilgeni içün, `sectionWideCheckWork` olğan başqa bir konteynerniñ içindeki `sectionWideCheckWork` konteynerinde `maxNumAttempts` belgilemekniñ tesiri yoq. `maxNumAttempts` qıymetini tıştaki konteynerde belgileñiz.

answer-attributes-need-symbolic-equality = symbolicEquality belgilenmeden { $attributes } atributlarınıñ tesiri olmay.

answer-invalid-type = answer içün tip keçersiz: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` komponentiniñ adı olmağanı içün modul atributı olaraq qullanılamay

module-attribute-name-already-defined = `<module>` komponent tipinde endi bir "{ $name }" atributı belgilengeni içün `<{ $component } name="{ $name }">` komponenti modulniñ atributı olaraq qullanılamay.

conditional-content-condition-ignored = case yaki else bala elementleri olğan `<conditionalContent>` komponentinde `condition` atributı esapqa alınmay.

slider-markers-type-mismatch = İşaretçilerniñ tipi slayderniñ tipine uyğun kelmey.

pretzel-problem-needs-statement-and-answer = pretzel keçersiz: er `<problem>` bir `<statement>` ve bir `<answer>` içermeli.

pretzel-circuit-first-problem-distractor = pretzel keçersiz: mode="circuit" olğanda birinci `<problem>` çelgi ola bilmez.

## Attribute values

attribute-invalid-values = `{ $attribute }` atributı içün { $values } qıymetleri keçersiz; esapqa alınmay.

attribute-must-be-references = `{ $attribute }` atributı içün `{ $value }` qıymeti keçersiz. Atribut `$` ile başlağan referenslardan ibaret olmalı.

math-input-invalid-function-names = <mathInput>: { $attribute } içindeki keçersiz funktsiya adları esapqa alınmadı: { $names }. Er adnıñ körünen qısmı eñ az 2 işaretten (arif yaki tire) ibaret olmalı; soñunda isteğe bağlı `|<mathspeak alternativi>` kelip ola.

## Building components from the source

component-type-invalid = Komponent tipi keçersiz: `<{ $componentType }>`

attribute-repeated = { $attribute } atributı tekrarlanamay.

attribute-invalid-for-component = "{ $attribute }" atributı `<{ $componentType }>` tipindeki komponent içün keçersiz.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } nomerli stil tarifi { $context ->
        [text-on-background] zemin rengine qarşı metin rengi
        [high-contrast] kanvasqa qarşı yüksek kontrastlı renk
        [line] kanvasqa qarşı sızıq rengi
        [marker] kanvasqa qarşı işaretçi rengi
       *[text-on-canvas] kanvasqa qarşı metin rengi
    } içün yeterli kontrastqa saip degil{ $mode ->
        [dark] { " (qarañğı rejim)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; eñ az { $threshold }:1 kerek).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } nomerli stil tarifi açıq rejim içün yeterli kontrast bergen renkler belgilegen olsa da, bu qıymetlerden alınğan qarañğı rejim renkleri metin rengi ile zemin rengi arasında yeterli kontrastqa saip degil ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; eñ az { $threshold }:1 kerek). { $suggestion ->
        [available] Qarañğı rejimde yeterli kontrast olsun dep, ya açıq rejim kontrastını arttırıñız (mesela { $lightAttribute }="{ $lightColor }" belgileñiz), ya da qarañğı rejim rengini bastırıñız (mesela { $darkAttribute }="{ $darkColor }" belgileñiz).
       *[none] Qarañğı rejimde yeterli kontrast olsun dep, açıq rejim kontrastını arttırıñız yaki alınğan renklerni textColorDarkMode ve/yaki backgroundColorDarkMode ile bastırıñız.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } nomerli stil tarifi açıq rejim içün yeterli kontrast bergen metin rengi belgilegen olsa da, bu qıymetten alınğan qarañğı rejim metin rengi kanvasqa qarşı yeterli kontrastqa saip degil ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; eñ az { $threshold }:1 kerek). { $suggestion ->
        [available] Qarañğı rejimde yeterli kontrast olsun dep, ya açıq rejim kontrastını arttırıñız (mesela textColor="{ $lightColor }" belgileñiz), ya da qarañğı rejim rengini bastırıñız (mesela textColorDarkMode="{ $darkColor }" belgileñiz).
       *[none] Qarañğı rejimde yeterli kontrast olsun dep, açıq rejim kontrastını arttırıñız yaki alınğan renkni textColorDarkMode ile bastırıñız.
    }

section-multiple-style-palettes = Bir bölük tek bir <stylePalette> saylap ola; soñuncısı qullanıla.

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect menfiy olmağan tam sayı olmağanı içün { $component } elementiniñ tek variantları belgilenamay.

variant-num-to-select-not-constant-number = numToSelect sabit sayı olmağanı içün { $component } elementiniñ tek variantları belgilenamay.

variant-with-replacement-not-constant-boolean = withReplacement sabit boolean qıymet olmağanı içün { $component } elementiniñ tek variantları belgilenamay.

variant-select-weight-disables-unique = Bir opsiyada selectWeight yaki selectForVariants belgilense, select içün tek variantlar qapatıla

variant-coprime-undetermined = coprime er zaman yañlış olğanı belgilenamağanı içün { $component } elementiniñ tek variantları belgilenamay.

variant-attribute-not-constant = { $attribute } sabit olmağanı içün { $component } elementiniñ tek variantları belgilenamay.

variant-attribute-not-number = { $attribute } sayı olmağanı içün { $component } elementiniñ tek variantları belgilenamay.

variant-attribute-wrong-type-for-sequence =
    { $attribute } { $expected ->
        [letters-combination] ariflerniñ birleşmesi
        [math-expression] keçerli matematik ifade
        [integer] tam sayı
       *[number] sayı
    } olmağanı içün { $type } tipindeki { $component } elementiniñ tek variantları belgilenamay.

variant-length-not-integer = length tam sayı olmağanı içün { $component } elementiniñ tek variantları belgilenamay.

variant-sort-not-implemented = sort olğan { $component } elementiniñ tek variantları ale amelge keçirilmedi

variant-exclude-combinations-not-implemented = excludeCombinations olğan { $component } elementiniñ tek variantları ale amelge keçirilmedi

variant-math-exclude-not-implemented = exclude olğan math tipindeki { $component } elementiniñ tek variantları ale amelge keçirilmedi

variant-non-constant-exclude-not-implemented = Sabit olmağan exclude olğan { $component } elementiniñ tek variantları ale amelge keçirilmedi

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: grafik prefigure köstericisinde desteklenmey; bala element atlandı.

prefigure-descendant-invalid-geometry = { $subject }: geometriya sonlu degil yaki eksik; bala element atlandı.

prefigure-curve-label-omitted = { $subject }: çevrilgen egri elementlerinde etiketler desteklenmey; etiket atlandı.

prefigure-curve-unsupported-definition-type = { $subject }: desteklenmegen egri funktsiyası tarif tipi '{ $definitionType }'; bala element atlandı.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves üzerinde flipFunctions atributı desteklenmey; bala element atlandı.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves tek formula tipindeki bala funktsiyalarnı destekley; bala element atlandı.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] doğru ailesi etiketi
       *[point] noqta etiketi
    } içün labelPosition '{ $labelPosition }' desteklenmey; PreFigure ög belgilengen tizüvi qullanıla.

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' toldurma stili PreFigure tarafından desteklenmey; tegiz toldurmağa keçile.

prefigure-line-style-unknown = { $subject }: bilinmegen '{ $lineStyle }' sızıq stili PreFigure çıqışından atlandı.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' işaretçi stili PreFigure'niñ 'diamond' stiline uyğunlaştırıldı.

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' işaretçi stili PreFigure tarafından desteklenmey; ög belgilengen stil qullanıla.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` keçersiz; maqsat çözülamay. Annotatsiya atlandı.

annotation-ref-multiple-targets = `<annotation>`: `ref` birden çoq maqsatqa çözüldi; birinci maqsat qullanıla.

annotation-ref-outside-graph = `<annotation>`: `ref` keçersiz; maqsat onı içergen grafikniñ tışında. Annotatsiya atlandı.

annotation-ref-unsupported-target = `<annotation>`: `ref` keçersiz; prefigure çevirmesinde maqsat desteklengen grafik nesne degil. Annotatsiya atlandı.

annotation-text-missing = `<annotation>`: `text` eksik yaki boş; boş metin çıqarıla.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Aylanma bağlılıq tapıldı.
       *[other] `<{ $componentType }>` komponentini içergen aylanma bağlılıq tapıldı.
    }

reference-no-referent = Referens içün gönderme tapılmadı: `{ $reference }`

reference-multiple-referents = Referens içün birden çoq gönderme tapıldı: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` elementiniñ { $attribute } atributınıñ formatı keçersiz.

children-invalid = `<{ $componentType }>` içün bala elementler keçersiz: keçersiz bala elementler tapıldı: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` atributı içün `{ $value }` qıymeti keçersiz; `{ $default }` qıymeti qullanıla

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } versiyası tapılmadı.
       *[other] DoenetML { $version } versiyası tapılmadı. { $fallback } versiyasına qaytıla
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML keçersiz: { $content }

parse-tag-missing-close-tag = DoenetML keçersiz: `{ $tag }` tegniñ qapanış tegi yoq. Özü qapanğan teg yaki `</{ $tagName }>` tegi beklene edi.

parse-tag-error = DoenetML keçersiz: `<{ $tagName }>` teginde hata bar

parse-attribute-missing-value = DoenetML keçersiz: `{ $attribute }` atributınıñ qıymeti eksik körüne.

parse-attribute-invalid = DoenetML keçersiz: `{ $attribute }` atributı keçersiz

parse-attribute-value-invalid = DoenetML keçersiz: `{ $value }` atribut qıymeti keçersiz

parse-attribute-value-quote-mismatch = DoenetML keçersiz: `{ $value }` atribut qıymeti keçersiz. Tırnaqlar uyğun kelmey. Bir `{ $quote }` eksik körüne

parse-open-tag-name-missing = DoenetML keçersiz: teg adı olmağan teg tapıldı, mesela `<`

parse-tag-not-closed = DoenetML keçersiz: `{ $tag }` tegi qapatılmağan (bir `>` eksik körüne).

parse-self-closing-tag-name-missing = DoenetML keçersiz: teg adı olmağan teg tapıldı `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML keçersiz: `{ $tag }` tegi qapatılmağan (`/>` eksik körüne).

parse-tag-invalid-attributes = DoenetML keçersiz: `{ $tag }` tegi keçerli degil. Atributları hatalı ola bilir.

parse-close-tag-name-missing = DoenetML keçersiz: teg adı olmağan qapanış tegi tapıldı, mesela `</`

parse-attribute-value-unquoted = Atribut qıymetleri tırnaq içine alınmalı: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML keçersiz: `{ $tag }` qapanış tegi tapıldı, amma oña uyğun açılış tegi yoq

parse-close-tag-mismatched = DoenetML keçersiz: qapanış tegi uyğun kelmey. `</{ $expected }>` beklene edi. `{ $found }` tapıldı

parser-node-unconvertible = { $node } tüyüni Dast tüyünine çevirilamadı.

## Names

name-attribute-invalid =
    name='{ $name }' atributı keçersiz. { $reason ->
        [characters] Adlar tek arif, raqam, alt sızıq yaki tire içerip ola.
       *[start] Adlar arifnen başlamalı.
    }

component-name-invalid-start = "{ $name }" komponent adı keçersiz. Adlar arifnen başlamalı.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched tipindeki answer elementiniñ video atributı olmalı

answer-video-watched-video-not-reference = videoWatched tipindeki answer elementiniñ video atributı referens olmalı

answer-name-not-single-text = answer elementiniñ name atributınıñ tek bir metin bala elementi olmalı

## Referencing another document

external-doenetml-recursion-limit = Rekursiya seviyesi pek çoq olğanı içün tıştaki DoenetML alınamay. Aylanma referens barmı?

external-doenetml-unavailable = { $attribute }="{ $uri }" adresinden DoenetML alınamay

external-doenetml-type-mismatch = { $attribute }="{ $uri }" adresinden alınğan DoenetML keçersiz: "{ $componentType }" komponent tipine uyğun kelmedi

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` atributı qullanıştan çıqarıldı; yerine `{ $to }` qullanıñız.
       *[other] [deprecation] `<{ $component }>` üzerindeki `{ $from }` atributı qullanıştan çıqarıldı; yerine `{ $to }` qullanıñız.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` de belgilengeni içün `{ $from }` atributı qullanıştan çıqarıldı ve esapqa alınmadı.
       *[other] [deprecation] `{ $to }` de belgilengeni içün `<{ $component }>` üzerindeki `{ $from }` atributı qullanıştan çıqarıldı ve esapqa alınmadı.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` üzerindeki `{ $attribute }` atributı qullanıştan çıqarıldı ve esapqa alınmay.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` üzerindeki `{ $attribute }` atributı qullanıştan çıqarıldı; yerine `<{ $child }>` bala elementini qullanıñız.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` üzerindeki `{ $attribute }` atributınıñ `{ $value }` qıymeti qullanıştan çıqarıldı; yerine `{ $to }` qullanıñız.


## Language coverage

pluralize-english-only = `<pluralize>` tek İnglizce kelimelerni çoqluqqa çevire bilgeni içün, { $locale } tilinde yazılğan vesiqada metin deñişmeden qala. Çoqluq şeklini doğrudan yazıñız yaki `pluralForm` atributınen belgileñiz.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` elementi tanılğan Doenet elementi degil.

schema-element-not-allowed-at-root = `<{ $tag }>` elementine vesiqanıñ tamırında ruhset berilmey.

schema-element-not-allowed-inside = `<{ $tag }>` elementine `<{ $parent }>` içinde ruhset berilmey.

schema-attribute-unrecognized = `<{ $tag }>` elementiniñ `{ $attribute }` adlı atributı yoq.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` elementiniñ `{ $attribute }` atributı er elementi şunlardan biri olğan cetvel olmalı: { $allowed }
       *[other] `<{ $tag }>` elementiniñ `{ $attribute }` atributı şunlardan biri olmalı: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select içün variant adı keçersiz. { $variantName } variant adı { $numOptions } opsiyada keçe, amma saylanacaq sayı { $numToSelect }.

select-variant-name-without-options = select içün variantlar belgilengen, amma mümkün olğan { $variantName } variant adı içün opsiya yoq.

select-variant-name-not-possible = select içün belgilengen { $variantName } variant adı mümkün olğan variant adı degil.

select-too-few-options = Tek { $numOptions } komponentten { $numToSelect } tanesi saylanamay.

select-from-sequence-too-few-values = Uzunlığı { $length } olğan sıradan { $numToSelect } qıymet saylanamay.

select-from-sequence-indices-count-mismatch = select içün belgilengen indeks sayısı saylanacaq sayığa uyğun kelmeli

select-from-sequence-indices-not-integers = select içün belgilengen bütün indeksler tam sayı olmalı

select-from-sequence-index-excluded = selectfromsequence içün belgilengen indeks tışlanğanlardan edi

select-from-sequence-indices-excluded-combination = selectfromsequence içün belgilengen indeksler tışlanğan birleşme edi

select-from-sequence-coprime-not-positive-integers = Müsbet tam sayılar saylanmağanı içün aralarında prost birleşmeler saylanamay.

select-from-sequence-coprime-common-factor = Aralarında prost sayılar saylanamay. Mümkün olğan qıymetlerniñ episiniñ umumiy bölücisi bar. (Belgilengen "from" yaki "to" qıymetleri "step" ile aralarında prost olmalı.)

select-from-sequence-coprime-single-number = 1 olmağan tek bir sayıdan aralarında prost birleşmeler saylanamay.

select-from-sequence-excluded-too-many-combinations = selectFromSequence içinde birleşmelerniñ 70%-inden çoğu tışlandı

select-from-sequence-coprime-none-found = Aralarında prost sayılar saylanamadı. Mümkün olğan qıymetlerniñ episiniñ umumiy bölücisi bar.

select-from-sequence-too-few-unique-values = Uzunlığı { $numPossibleValues } olğan sıradan { $numToSelect } farqlı qıymet saylanamay

select-prime-numbers-too-few-values = Uzunlığı { $numValues } olğan prost sayılar cetvelinden { $numToSelect } qıymet saylanamay

select-prime-numbers-values-count-mismatch = select içün belgilengen qıymet sayısı saylanacaq sayığa uyğun kelmeli

select-prime-numbers-values-not-prime = select prime number içün belgilengen bütün qıymetler prost sayılar cetvelinde olmalı

select-prime-numbers-values-excluded-combination = selectPrimeNumbers içün belgilengen qıymetler tışlanğan birleşme edi

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers içinde birleşmelerniñ 70%-inden çoğu tışlandı

select-random-combination-fluke = Pek az itimal olsa da, tesadüfiy qıymetlerniñ birleşmesi saylanamadı

select-random-value-fluke = Pek az itimal olsa da, tesadüfiy qıymet saylanamadı

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` matematikniñ içinde sızılmay; ifade, kirişler içine yerleştirilip olmağan devirdeki kibi yazıla. { $reason ->
        [not-inline] İfadeniñ içine tek `inline` saylav kirişi sığa; `inline` olmadan o dögme blokıdır.
        [expanded] `expanded` metin kirişi bir qaç satırlı qutudır ve ifadeniñ içine sığmaycaq qadar büyüktir.
        [on-graph] Grafikte ifade bütün bir resim olaraq sızıla ve onda kontrol içün yer yoq.
       *[relative-width] Onıñ `width` qıymeti nisbiydir (protsent yaki `em`) ve ifadeniñ içinde ölçenecek bir şey yoqtır. Kenişlikni `px` kibi mutlaq birliklernen beriñiz.
    }
