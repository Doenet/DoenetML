# Turkish diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# A noun counted by a numeral stays singular in Turkish, so a `{ $count }`
# message reads the same in both plural branches and needs no selection.
#
# Turkish suffixes agree with the vowels of the word they attach to, which
# cannot be done to a placeable whose value is not known — an element or
# attribute name quoted from the author's source. Those are left to stand on
# their own rather than given a suffix that would be wrong half the time.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = İki uç nokta belirtildiğinde { $attributes } yok sayılır

line-segment-attributes-ignored-with-endpoint-and-midpoint = Bir uç nokta ile bir orta nokta birlikte belirtildiğinde { $attributes } yok sayılır

line-segment-midpoint-offset-without-midpoint = Orta nokta olmadan midpointOffset etkisizdir

## `<line>`

line-points-undetermined-dimensions = Boyutları belirsiz noktalardan geçen doğru.

line-points-too-few-dimensions = Doğru, en az iki boyutlu noktalardan geçmelidir.

line-points-depend-on-variables = Doğru, değişkenlere bağlı noktalardan geçiyor: { $variables }.

line-equation-invalid-format = { $variable1 } ve { $variable2 } değişkenleriyle yazılan doğru denkleminin biçimi geçersiz.

## `<ray>`

ray-overprescribed-through = Işın aynı anda through, endpoint ve direction ile belirlenmiş. Belirtilen through yok sayılıyor.

ray-dimension-mismatch = Işında numDimensions uyuşmuyor.

## `<vector>`

vector-overprescribed-head = Vektör aynı anda head, tail ve displacement ile belirlenmiş. Belirtilen head yok sayılıyor.

vector-dimension-mismatch = Vektörde numDimensions uyuşmuyor.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ögesine çekilemiyor; nearestPoint durum değişkeni yok.

constrain-to-without-nearest-point = `<{ $component }>` ögesine kısıtlanamıyor; nearestPoint durum değişkeni yok.

constrain-to-interior-without-nearest-point = `<{ $component }>` ögesinin içine kısıtlanamıyor; nearestPoint durum değişkeni yok.

## `<choiceInput>`

choice-input-label-position-ignored = Satır içi olmayan choiceInput için labelPosition yok sayılır

## Ordering children by index

choice-input-indices-count-mismatch = indices sayısı choice alt ögelerinin sayısıyla uyuşmadığı için choiceInput için belirtilen indices yok sayılıyor.

pretzel-indices-count-mismatch = indices sayısı problem alt ögelerinin sayısıyla uyuşmadığı için problem için belirtilen indices yok sayılıyor.

shuffle-indices-count-mismatch = indices sayısı bileşen sayısıyla uyuşmadığı için shuffle için belirtilen indices yok sayılıyor.

indices-ignored-out-of-range = Bazı dizinler aralık dışında olduğu için { $component } için belirtilen indices yok sayılıyor.

pretzel-indices-repeated = Bazı dizinler yinelendiği için pretzel için belirtilen indices yok sayılıyor.

pretzel-circuit-first-index = circuit kipinde ilk dizin 1 olmak zorunda olduğu için pretzel için belirtilen indices yok sayılıyor.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` ögesinin dizge alt ögeleriyle çalışabilmesi için `type` özniteliği belirtilmelidir.

invalid-type-defaulting-to-math = { $component } bileşeni için { $type } türü geçersiz. math, text, number veya boolean olmalıdır. math kullanılıyor.

string-not-valid-component-to-arrange = "{ $value }" dizgesi { $component } için geçerli bir bileşen değil. Yok sayılıyor.

## Types and variables

invalid-type-defaulting-to-number = { $type } türü geçersiz; tür number olarak ayarlanıyor.

invalid-variable-value = Bir değişkenin değeri geçersiz: `{ $value }`

## Variants

variant-index-must-be-number = Varyant dizini { $index } bir sayı olmalıdır

variant-index-must-be-integer = Varyant dizini { $index } bir tam sayı olmalıdır

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` mutlak ölçüler için gerçeklenmedi. Genişlikler göreli değerlere ayarlanıyor.

side-by-side-absolute-margins = `<{ $component }>` mutlak ölçüler için gerçeklenmedi. Kenar boşlukları göreli değerlere ayarlanıyor.

side-by-side-no-block-child = `<{ $component }>` geçersiz: en az bir blok alt ögesi olmalıdır.

## `<label>`

label-for-ignored-on-graphical = Grafik `<label>` üzerindeki `for` özniteliği yok sayılır.

label-for-must-resolve-to-one = `<label>` üzerindeki `for` özniteliği tam olarak bir bileşene çözümlenmelidir.

label-for-unresolved = `<label>` üzerindeki `for` özniteliği bir bileşene çözümlenemedi.

label-for-answer-with-authored-inputs = `<label>` üzerindeki `for` özniteliği, girdileri açıkça yazılmış bir `<answer>` ögesine başvuruyor; doğrudan o girdiye başvurun.

label-for-answer-without-input = `<label>` üzerindeki `for` özniteliği, etiketlenecek girdisi olmayan bir `<answer>` ögesine başvuruyor.

label-for-must-reference-input-or-answer = `<label>` üzerindeki `for` özniteliği bir girdiye ya da bir yanıta başvurmalıdır.

## Accessibility

accessibility-short-description-or-decorative = Erişilebilirlik için `<{ $component }>` ögesinin kısa bir açıklaması olmalı ya da süsleyici olarak belirtilmelidir.

accessibility-video-short-description = Erişilebilirlik için `<video>` ögesinin kısa bir açıklaması olmalıdır.

accessibility-input-short-description-or-label = Erişilebilirlik için `<{ $component }>` ögesinin kısa bir açıklaması ya da etiketi olmalıdır.

accessibility-answer-input-short-description-or-label = Erişilebilirlik için girdi oluşturan bir `<answer>` ögesinin kısa bir açıklaması ya da etiketi olmalıdır.

accessibility-short-description-contains-math = Kısa açıklamalar `<{ $component }>` gibi matematik bileşenleri içermemelidir. Matematiği sözcüklerle yazın.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } bölüm başlığı metni için yetersiz karşıtlığa sahip (koyu kip) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; en az { $threshold }:1 gerekir).
       *[other] { $colorName } bölüm başlığı metni için yetersiz karşıtlığa sahip ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; en az { $threshold }:1 gerekir).
    }

## `<circle>`

circle-through-points-non-numerical = Noktaların sayısal değerleri olmadığında { $count } noktadan geçen `<circle>` henüz gerçeklenmedi.

circle-too-many-through-points = 3'ten fazla noktadan geçen çember hesaplanamaz.

circle-overprescribed-radius-center-points = Yarıçapı, merkezi ve geçtiği noktaları birlikte belirtilmiş çember hesaplanamaz.

circle-center-with-multiple-points = Merkezi belirtilmiş ve 1'den fazla noktadan geçen çember hesaplanamaz.

circle-radius-too-small = Çember hesaplanamıyor: iki nokta arasındaki uzaklık { $distance } olduğuna göre, belirtilen { $radius } yarıçapı çok küçük.

circle-radius-with-many-points = Yarıçapı belirtilmiş, ikiden fazla noktadan geçen çember oluşturulamaz.

circle-invalid-center-or-through-points = Çemberin merkezi ya da geçtiği noktalar geçersiz.

circle-radius-center-with-multiple-points = Merkezi belirtilmiş ve 1'den fazla noktadan geçen çemberin yarıçapı hesaplanamaz.

circle-change-radius-non-numerical = Geçtiği noktalar sayısal olmayan bir çemberin yarıçapı değiştirilemez

circle-radius-with-points-non-numerical = Sayısal değerler yokken, yarıçapı belirtilmiş ve birden fazla noktadan geçen çember oluşturulamaz.

circle-change-center-non-numerical = Sayısal olmayan noktalardan geçen bir çemberin merkezini değiştirmek henüz gerçeklenmedi.

## `<function>`

function-domain-insufficient-dimensions = Fonksiyonun tanım kümesi için boyutlar yetersiz. Tanım kümesinde { $intervals } aralık var, ancak fonksiyonun { $inputs } girdisi var.

function-domain-invalid-format = Fonksiyonun tanım kümesinin biçimi geçersiz.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Fonksiyonun sayısal olmayan en büyük değeri yok sayılıyor.
        [minimum] Fonksiyonun sayısal olmayan en küçük değeri yok sayılıyor.
        [extremum] Fonksiyonun sayısal olmayan uç değeri yok sayılıyor.
        [point] Fonksiyonun sayısal olmayan noktası yok sayılıyor.
        [slope] Fonksiyonun sayısal olmayan eğimi yok sayılıyor.
       *[other] Fonksiyonun sayısal olmayan { $type } değeri yok sayılıyor.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Fonksiyonun boş en büyük değeri yok sayılıyor.
        [minimum] Fonksiyonun boş en küçük değeri yok sayılıyor.
        [extremum] Fonksiyonun boş uç değeri yok sayılıyor.
        [point] Fonksiyonun boş noktası yok sayılıyor.
       *[other] Fonksiyonun boş { $type } değeri yok sayılıyor.
    }

function-points-too-close = Fonksiyonda konumları birbirine çok yakın iki nokta var. Fonksiyon tanımlanamıyor.

function-iterates-input-output-mismatch = Fonksiyon yinelemesi ancak girdi sayısı çıktı sayısına eşitse olanaklıdır. Bu fonksiyonun { $inputs } girdisi ve { $outputs } çıktısı var.

## `<sequence>`

sequence-invalid-length = Dizinin uzunluğu geçersiz. Negatif olmayan bir tam sayı olmalıdır.

sequence-invalid-step = Dizinin adımı geçersiz. { $type } türündeki bir dizi için bir sayı olmalıdır.

sequence-invalid-endpoint-number = Sayı dizisinin "{ $attribute }" değeri geçersiz. Bir sayı olmalıdır.

sequence-invalid-endpoint-letters = Harf dizisinin "{ $attribute }" değeri geçersiz. Bir harf birleşimi olmalıdır.

sequence-invalid-endpoint = Dizinin "{ $attribute }" değeri geçersiz.

select-from-sequence-coprime-not-numbers = Sayı seçilmediği için coprime yok sayıldı

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations belirtildiği için coprime yok sayıldı

## Resolving a `target`

target-not-found = `<{ $source }>` için target geçersiz: hedef bulunamıyor.

target-state-variable-not-found = `<{ $source }>` için target geçersiz: bir `<{ $component }>` üzerinde "{ $property }" adlı bir durum değişkeni bulunamıyor.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` değişkenleri bağımsız değişkenden farklı olmalıdır.

ode-system-duplicate-variable-names = Yinelenen bağımlı değişken adlarıyla ODE sağ taraf fonksiyonları tanımlanamaz.

ode-system-rhs-function-error = ODE sağ taraf fonksiyonu tanımlanamıyor. mathjs fonksiyonu oluşturulurken hata oluştu.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } doğru arasındaki açı tanımlanamaz

angle-invalid-through-point = `<angle>` ögesinin through değerinde geçersiz nokta var

parabola-vertex-too-many-points = Tepe noktası belirtilmiş ve 1'den fazla noktadan geçen parabol henüz gerçeklenmedi.

parabola-too-many-points = 3'ten fazla noktadan geçen parabol henüz gerçeklenmedi.

intersection-too-many-items = İkiden fazla nesnenin kesişimi henüz gerçeklenmedi

## Other math components

ionic-compound-not-two-ions = İki iyon dışındaki iyonik bileşikler henüz gerçeklenmedi.

ionic-compound-needs-cation-and-anion = İyonik bileşik yalnızca bir katyon ve bir anyon için gerçeklendi.

solve-equations-cannot-evaluate = Denklem değerlendirilemediği için çözülemiyor: { $equation }

math-operators-operand-number-required = Bir matematik işleneni çıkarılırken operandNumber belirtilmelidir.

eigen-decomposition-failed = Matrisin özdeğerleri hesaplanamadı

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } parametresi örüntüde geçmiyor, bu yüzden her zaman boşlukla eşleşecek.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" yorumlanamıyor. none, medium, dense ya da boşlukla ayrılmış iki pozitif sayı olmalıdır; örneğin grid="1 0.5". Izgara çizilmiyor.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure görüntüleyicisinde xLabelPosition="left" desteklenmiyor; sağ konum davranışı kullanılıyor.

prefigure-y-label-position-unsupported = `<graph>`: prefigure görüntüleyicisinde yLabelPosition="bottom" desteklenmiyor; üst konum davranışı kullanılıyor.

prefigure-invalid-axis-bounds = `<graph>`: prefigure dönüşümü için eksen sınırları geçersiz; varsayılan bbox (-10,-10,10,10) kullanılıyor.

prefigure-invalid-width = `<graph>`: prefigure dönüşümü için genişlik geçersiz; varsayılan diyagram genişliği 425 kullanılıyor.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure dönüşümü için aspectRatio geçersiz; varsayılan en boy oranı 1 kullanılıyor.

prefigure-grid-spacing-too-fine = `<graph>`: ızgara aralığı eksen sınırlarına göre çok ince; prefigure görüntüleyicisinde ızgara atlanıyor.

prefigure-annotations-not-rendered = `<graph>`: PreFigure görüntüleyicisi kullanılmadığında açıklamalar çizilmez.

multiple-annotations-children = `<graph>` içinde birden çok `<annotations>` alt ögesi bulundu; sonuncusu dışındakiler yok sayılıyor.

## Referring to other components

copy-unrecognized-component-type = Tanınmayan bir bileşen türü genişletilemez ya da kopyalanamaz: { $type }.

copy-prop-not-found = { $component } türündeki bir bileşende { $property } özelliği bulunamadı

collect-no-source = collect için kaynak bulunamadı.

collect-invalid-component-type = `<{ $component }>` geçerli bir bileşen türü olmadığı için bu türdeki bileşenler toplanamaz.

reference-index-unavailable = `{ $reference }` dizinine başvurulamıyor

## `<callAction>`

component-action-unavailable = `{ $reference }` bileşeninde { $action } çağrılamıyor

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Verinin biçimi geçersiz. Satır uzunlukları tutarsız. componentIdx :{ $componentIdx } içinde bulundu

data-frame-duplicate-column-names = Veride yinelenen sütun adları var. componentIdx :{ $componentIdx } içinde bulundu

data-frame-missing-column-name = Veride bir sütun adı eksik. componentIdx :{ $componentIdx } içinde bulundu

## `<answer>` and scoring

answer-award-depends-on-own-response = Bu yanıtın bir award ögesi, answer etiketinin kendi gönderdiği yanıta dayanıyor; bu beklenmedik davranışa yol açar.

answer-max-num-attempts-in-section-wide-check-work = Deneme sayısı kapsayıcı tarafından denetlendiği için, `sectionWideCheckWork` bulunan bir kapsayıcı içindeki `<answer>` ögesinde `maxNumAttempts` ayarlamanın etkisi olmaz. `maxNumAttempts` değerini kapsayıcıda ayarlayın.

nested-section-wide-check-work-max-num-attempts = Deneme sayısı dıştaki kapsayıcı tarafından denetlendiği için, `sectionWideCheckWork` bulunan başka bir kapsayıcının içindeki `sectionWideCheckWork` kapsayıcısında `maxNumAttempts` ayarlamanın etkisi olmaz. `maxNumAttempts` değerini dıştaki kapsayıcıda ayarlayın.

answer-attributes-need-symbolic-equality = symbolicEquality ayarlanmadan { $attributes } özniteliğinin etkisi olmaz.

answer-invalid-type = answer için tür geçersiz: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` bileşeninin adı olmadığı için modül özniteliği olarak kullanılamaz

module-attribute-name-already-defined = `<module>` bileşen türü zaten bir "{ $name }" özniteliği tanımladığı için `<{ $component } name="{ $name }">` bileşeni bir modülün özniteliği olarak kullanılamaz.

conditional-content-condition-ignored = case ya da else alt ögeleri bulunan bir `<conditionalContent>` bileşeninde `condition` özniteliği yok sayılır.

slider-markers-type-mismatch = İşaretçilerin türü kaydırıcının türüyle uyuşmuyor.

pretzel-problem-needs-statement-and-answer = pretzel geçersiz: her `<problem>` bir `<statement>` ve bir `<answer>` içermelidir.

pretzel-circuit-first-problem-distractor = pretzel geçersiz: mode="circuit" durumunda ilk `<problem>` bir çeldirici olamaz.

## Attribute values

attribute-invalid-values = `{ $attribute }` özniteliği için { $values } değeri geçersiz; yok sayılıyor.

attribute-must-be-references = `{ $attribute }` özniteliği için `{ $value }` değeri geçersiz. Öznitelik `$` ile başlayan başvurulardan oluşmalıdır.

math-input-invalid-function-names = <mathInput>: { $attribute } içindeki geçersiz fonksiyon adları yok sayıldı: { $names }. Her adın görünen bölümü en az 2 karakter (harf ya da kısa çizgi) olmalıdır; ardından isteğe bağlı bir `|<mathspeak seçeneği>` soneki gelebilir.

## Building components from the source

component-type-invalid = Bileşen türü geçersiz: `<{ $componentType }>`

attribute-repeated = { $attribute } özniteliği yinelenemez.

attribute-invalid-for-component = "{ $attribute }" özniteliği `<{ $componentType }>` türündeki bir bileşen için geçersiz.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } numaralı stil tanımı { $context ->
        [text-on-background] arka plan rengine karşı metin rengi
        [high-contrast] tuvale karşı yüksek karşıtlıklı renk
        [line] tuvale karşı çizgi rengi
        [marker] tuvale karşı işaretçi rengi
       *[text-on-canvas] tuvale karşı metin rengi
    } için yetersiz karşıtlığa sahip{ $mode ->
        [dark] { " (koyu kip)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; en az { $threshold }:1 gerekir).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } numaralı stil tanımı açık kip için yeterli karşıtlık sağlayan renkler belirtmiş olsa da, bu değerlerden türetilen koyu kip renkleri metin rengi ile arka plan rengi arasında yetersiz karşıtlığa sahip ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; en az { $threshold }:1 gerekir). { $suggestion ->
        [available] Koyu kipte yeterli karşıtlığı sağlamak için ya açık kip karşıtlığını artırın (örneğin { $lightAttribute }="{ $lightColor }" ayarlayın) ya da koyu kip rengini geçersiz kılın (örneğin { $darkAttribute }="{ $darkColor }" ayarlayın).
       *[none] Koyu kipte yeterli karşıtlığı sağlamak için açık kip karşıtlığını artırın ya da türetilen renkleri textColorDarkMode ve/veya backgroundColorDarkMode ile geçersiz kılın.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } numaralı stil tanımı açık kip için yeterli karşıtlık sağlayan bir metin rengi belirtmiş olsa da, bu değerden türetilen koyu kip metin rengi tuvale karşı yetersiz karşıtlığa sahip ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; en az { $threshold }:1 gerekir). { $suggestion ->
        [available] Koyu kipte yeterli karşıtlığı sağlamak için ya açık kip karşıtlığını artırın (örneğin textColor="{ $lightColor }" ayarlayın) ya da koyu kip rengini geçersiz kılın (örneğin textColorDarkMode="{ $darkColor }" ayarlayın).
       *[none] Koyu kipte yeterli karşıtlığı sağlamak için açık kip karşıtlığını artırın ya da türetilen rengi textColorDarkMode ile geçersiz kılın.
    }

section-multiple-style-palettes = Bir kısım yalnızca bir <stylePalette> seçebilir; sonuncusu kullanılıyor.

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect negatif olmayan bir tam sayı olmadığı için { $component } ögesinin benzersiz varyantları belirlenemiyor.

variant-num-to-select-not-constant-number = numToSelect sabit olmadığı için { $component } ögesinin benzersiz varyantları belirlenemiyor.

variant-with-replacement-not-constant-boolean = withReplacement sabit bir mantıksal değer olmadığı için { $component } ögesinin benzersiz varyantları belirlenemiyor.

variant-select-weight-disables-unique = Bir seçenek selectWeight ya da selectForVariants belirtirse select ögesinin benzersiz varyantları devre dışı kalır

variant-coprime-undetermined = coprime değerinin her zaman yanlış olduğu belirlenemediği için { $component } ögesinin benzersiz varyantları belirlenemiyor.

variant-attribute-not-constant = { $attribute } sabit olmadığı için { $component } ögesinin benzersiz varyantları belirlenemiyor.

variant-attribute-not-number = { $attribute } bir sayı olmadığı için { $component } ögesinin benzersiz varyantları belirlenemiyor.

variant-attribute-wrong-type-for-sequence =
    { $attribute } bir { $expected ->
        [letters-combination] harf birleşimi
        [math-expression] geçerli matematiksel ifade
        [integer] tam sayı
       *[number] sayı
    } olmadığı için { $type } türündeki { $component } ögesinin benzersiz varyantları belirlenemiyor.

variant-length-not-integer = length bir tam sayı olmadığı için { $component } ögesinin benzersiz varyantları belirlenemiyor.

variant-sort-not-implemented = sort bulunan bir { $component } ögesinin benzersiz varyantları henüz gerçeklenmedi

variant-exclude-combinations-not-implemented = excludeCombinations bulunan bir { $component } ögesinin benzersiz varyantları henüz gerçeklenmedi

variant-math-exclude-not-implemented = exclude bulunan math türündeki bir { $component } ögesinin benzersiz varyantları henüz gerçeklenmedi

variant-non-constant-exclude-not-implemented = Sabit olmayan exclude bulunan bir { $component } ögesinin benzersiz varyantları henüz gerçeklenmedi

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: grafik prefigure görüntüleyicisinde desteklenmiyor; alt öge atlandı.

prefigure-descendant-invalid-geometry = { $subject }: geometri sonlu değil ya da eksik; alt öge atlandı.

prefigure-curve-label-omitted = { $subject }: dönüştürülmüş eğri ögelerinde etiketler desteklenmiyor; etiket atlandı.

prefigure-curve-unsupported-definition-type = { $subject }: desteklenmeyen eğri fonksiyonu tanım türü '{ $definitionType }'; alt öge atlandı.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves üzerinde flipFunctions özniteliği desteklenmiyor; alt öge atlandı.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves yalnızca formül türündeki alt fonksiyonları destekler; alt öge atlandı.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] doğru ailesi etiketi
       *[point] nokta etiketi
    } için labelPosition '{ $labelPosition }' desteklenmiyor; PreFigure varsayılan hizalaması kullanılıyor.

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' dolgu stili PreFigure tarafından desteklenmiyor; düz dolguya geçiliyor.

prefigure-line-style-unknown = { $subject }: bilinmeyen '{ $lineStyle }' çizgi stili PreFigure çıktısından atlandı.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' işaretçi stili PreFigure'ün 'diamond' stiline eşlendi.

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' işaretçi stili PreFigure tarafından desteklenmiyor; varsayılan stil kullanılıyor.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` geçersiz; hedef çözümlenemiyor. Açıklama atlandı.

annotation-ref-multiple-targets = `<annotation>`: `ref` birden çok hedefe çözümlendi; ilk hedef kullanılıyor.

annotation-ref-outside-graph = `<annotation>`: `ref` geçersiz; hedef, onu içeren grafiğin dışında. Açıklama atlandı.

annotation-ref-unsupported-target = `<annotation>`: `ref` geçersiz; prefigure dönüşümünde hedef desteklenen bir grafik nesnesi değil. Açıklama atlandı.

annotation-text-missing = `<annotation>`: `text` eksik ya da boş; boş metin üretiliyor.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Döngüsel bağımlılık saptandı.
       *[other] `<{ $componentType }>` bileşenini içeren döngüsel bağımlılık saptandı.
    }

reference-no-referent = Başvuru için gönderge bulunamadı: `{ $reference }`

reference-multiple-referents = Başvuru için birden çok gönderge bulundu: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ögesinin { $attribute } özniteliğinin biçimi geçersiz.

children-invalid = `<{ $componentType }>` için alt ögeler geçersiz: geçersiz alt ögeler bulundu: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` özniteliği için `{ $value }` değeri geçersiz; `{ $default }` değeri kullanılıyor

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } sürümü bulunamadı.
       *[other] DoenetML { $version } sürümü bulunamadı. { $fallback } sürümüne dönülüyor
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML geçersiz: { $content }

parse-tag-missing-close-tag = DoenetML geçersiz: `{ $tag }` etiketinin kapanış etiketi yok. Kendiliğinden kapanan bir etiket ya da bir `</{ $tagName }>` etiketi bekleniyordu.

parse-tag-error = DoenetML geçersiz: `<{ $tagName }>` etiketinde hata var

parse-attribute-missing-value = DoenetML geçersiz: `{ $attribute }` özniteliğinin değeri eksik görünüyor.

parse-attribute-invalid = DoenetML geçersiz: `{ $attribute }` özniteliği geçersiz

parse-attribute-value-invalid = DoenetML geçersiz: `{ $value }` öznitelik değeri geçersiz

parse-attribute-value-quote-mismatch = DoenetML geçersiz: `{ $value }` öznitelik değeri geçersiz. Tırnak işaretleri eşleşmiyor. Bir `{ $quote }` eksik görünüyor

parse-open-tag-name-missing = DoenetML geçersiz: etiket adı olmayan bir etiket bulundu; örneğin `<`

parse-tag-not-closed = DoenetML geçersiz: `{ $tag }` etiketi kapatılmamış (bir `>` eksik görünüyor).

parse-self-closing-tag-name-missing = DoenetML geçersiz: etiket adı olmayan bir etiket bulundu `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML geçersiz: `{ $tag }` etiketi kapatılmamış (`/>` eksik görünüyor).

parse-tag-invalid-attributes = DoenetML geçersiz: `{ $tag }` etiketi geçerli değil. Öznitelikleri hatalı olabilir.

parse-close-tag-name-missing = DoenetML geçersiz: etiket adı olmayan bir kapanış etiketi bulundu; örneğin `</`

parse-attribute-value-unquoted = Öznitelik değerleri tırnak içine alınmalıdır: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML geçersiz: `{ $tag }` kapanış etiketi bulundu, ancak buna karşılık gelen bir açılış etiketi yok

parse-close-tag-mismatched = DoenetML geçersiz: kapanış etiketi eşleşmiyor. `</{ $expected }>` bekleniyordu. `{ $found }` bulundu

parser-node-unconvertible = { $node } düğümü bir Dast düğümüne dönüştürülemedi.

## Names

name-attribute-invalid =
    name='{ $name }' özniteliği geçersiz. { $reason ->
        [characters] Adlar yalnızca harf, rakam, alt çizgi ya da kısa çizgi içerebilir.
       *[start] Adlar bir harfle başlamalıdır.
    }

component-name-invalid-start = "{ $name }" bileşen adı geçersiz. Adlar bir harfle başlamalıdır.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched türündeki bir answer ögesinin video özniteliği olmalıdır

answer-video-watched-video-not-reference = videoWatched türündeki bir answer ögesinin video özniteliği bir başvuru olmalıdır

answer-name-not-single-text = answer ögesinin name özniteliğinin tek bir metin alt ögesi olmalıdır

## Referencing another document

external-doenetml-recursion-limit = Özyineleme düzeyi çok fazla olduğu için dış DoenetML alınamıyor. Döngüsel bir başvuru olabilir mi?

external-doenetml-unavailable = { $attribute }="{ $uri }" adresinden DoenetML alınamıyor

external-doenetml-type-mismatch = { $attribute }="{ $uri }" adresinden alınan DoenetML geçersiz: "{ $componentType }" bileşen türüyle eşleşmedi

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` özniteliği kullanımdan kaldırıldı; yerine `{ $to }` kullanın.
       *[other] [deprecation] `<{ $component }>` üzerindeki `{ $from }` özniteliği kullanımdan kaldırıldı; yerine `{ $to }` kullanın.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` de belirtildiği için `{ $from }` özniteliği kullanımdan kaldırıldı ve yok sayıldı.
       *[other] [deprecation] `{ $to }` de belirtildiği için `<{ $component }>` üzerindeki `{ $from }` özniteliği kullanımdan kaldırıldı ve yok sayıldı.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` üzerindeki `{ $attribute }` özniteliği kullanımdan kaldırıldı ve yok sayıldı.


## Language coverage

pluralize-english-only = `<pluralize>` yalnızca İngilizce çoğul yapabildiği için, { $locale } dilinde yazılmış bir belgede metni olduğu gibi kalır. Çoğul biçimi doğrudan yazın ya da `pluralForm` özniteliğiyle belirtin.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` ögesi tanınan bir Doenet ögesi değil.

schema-element-not-allowed-at-root = `<{ $tag }>` ögesine belgenin kökünde izin verilmez.

schema-element-not-allowed-inside = `<{ $tag }>` ögesine `<{ $parent }>` içinde izin verilmez.

schema-attribute-unrecognized = `<{ $tag }>` ögesinin `{ $attribute }` adlı bir özniteliği yok.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` ögesinin `{ $attribute }` özniteliği, her ögesi şunlardan biri olan bir liste olmalıdır: { $allowed }
       *[other] `<{ $tag }>` ögesinin `{ $attribute }` özniteliği şunlardan biri olmalıdır: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select için varyant adı geçersiz. { $variantName } varyant adı { $numOptions } seçenekte geçiyor, ancak seçilecek sayı { $numToSelect }.

select-variant-name-without-options = select için varyantlar belirtilmiş, ancak olası varyant adı { $variantName } için seçenek yok.

select-variant-name-not-possible = select için belirtilen { $variantName } varyant adı olası bir varyant adı değil.

select-too-few-options = Yalnızca { $numOptions } bileşenden { $numToSelect } tanesi seçilemez.

select-from-sequence-too-few-values = Uzunluğu { $length } olan bir diziden { $numToSelect } değer seçilemez.

select-from-sequence-indices-count-mismatch = select için belirtilen dizin sayısı, seçilecek sayıyla eşleşmelidir

select-from-sequence-indices-not-integers = select için belirtilen tüm dizinler tam sayı olmalıdır

select-from-sequence-index-excluded = selectfromsequence için belirtilen dizin dışlananlardandı

select-from-sequence-indices-excluded-combination = selectfromsequence için belirtilen dizinler dışlanan bir birleşim oluşturuyordu

select-from-sequence-coprime-not-positive-integers = Pozitif tam sayılar seçilmediği için aralarında asal birleşimler seçilemez.

select-from-sequence-coprime-common-factor = Aralarında asal sayılar seçilemiyor. Olası değerlerin tümünün ortak bir çarpanı var. (Belirtilen "from" ya da "to" değerleri "step" ile aralarında asal olmalıdır.)

select-from-sequence-coprime-single-number = 1 olmayan tek bir sayıdan aralarında asal birleşimler seçilemez.

select-from-sequence-excluded-too-many-combinations = selectFromSequence içinde birleşimlerin %70'inden fazlası dışlandı

select-from-sequence-coprime-none-found = Aralarında asal sayılar seçilemedi. Olası değerlerin tümünün ortak bir çarpanı var.

select-from-sequence-too-few-unique-values = Uzunluğu { $numPossibleValues } olan bir diziden { $numToSelect } farklı değer seçilemez

select-prime-numbers-too-few-values = Uzunluğu { $numValues } olan bir asal sayı listesinden { $numToSelect } değer seçilemez

select-prime-numbers-values-count-mismatch = select için belirtilen değer sayısı, seçilecek sayıyla eşleşmelidir

select-prime-numbers-values-not-prime = select prime number için belirtilen tüm değerler asal sayı listesinde bulunmalıdır

select-prime-numbers-values-excluded-combination = selectPrimeNumbers için belirtilen değerler dışlanan bir birleşim oluşturuyordu

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers içinde birleşimlerin %70'inden fazlası dışlandı

select-random-combination-fluke = Son derece düşük bir olasılıkla, rastgele değerlerin bir birleşimi seçilemedi

select-random-value-fluke = Son derece düşük bir olasılıkla, rastgele bir değer seçilemedi
