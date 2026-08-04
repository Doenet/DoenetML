# Uzbek diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Uzbek counts in the same two categories English does, so every selection below
# keeps both branches — but a noun after a numeral stays singular, so the two
# usually differ only in the number they print.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] ikkala uchi ham berilganda { $attributes } eʼtiborga olinmaydi
       *[other] ikkala uchi ham berilganda { $attributes } eʼtiborga olinmaydi
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] uchi ham, oʻrta nuqtasi ham berilganda { $attributes } eʼtiborga olinmaydi
       *[other] uchi ham, oʻrta nuqtasi ham berilganda { $attributes } eʼtiborga olinmaydi
    }

line-segment-midpoint-offset-without-midpoint = oʻrta nuqtasiz midpointOffset hech narsaga taʼsir qilmaydi

## `<line>`

line-points-undetermined-dimensions = Oʻlchami aniqlanmagan nuqtalardan oʻtuvchi toʻgʻri chiziq.

line-points-too-few-dimensions = Toʻgʻri chiziq kamida ikki oʻlchamli nuqtalardan oʻtishi kerak.

line-points-depend-on-variables = Toʻgʻri chiziq oʻzgaruvchilarga bogʻliq nuqtalardan oʻtadi: { $variables }.

line-equation-invalid-format = { $variable1 } va { $variable2 } oʻzgaruvchilaridagi toʻgʻri chiziq tenglamasining formati yaroqsiz.

## `<ray>`

ray-overprescribed-through = Nur through, endpoint va direction orqali berilgan. Berilgan through eʼtiborga olinmaydi.

ray-dimension-mismatch = nurda numDimensions mos kelmaydi.

## `<vector>`

vector-overprescribed-head = Vektor head, tail va displacement orqali berilgan. Berilgan head eʼtiborga olinmaydi.

vector-dimension-mismatch = vektorda numDimensions mos kelmaydi.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` elementiga tortib boʻlmaydi, chunki uning nearestPoint holat oʻzgaruvchisi yoʻq.

constrain-to-without-nearest-point = `<{ $component }>` elementi bilan cheklab boʻlmaydi, chunki uning nearestPoint holat oʻzgaruvchisi yoʻq.

constrain-to-interior-without-nearest-point = `<{ $component }>` elementining ichki qismi bilan cheklab boʻlmaydi, chunki uning nearestPoint holat oʻzgaruvchisi yoʻq.

## `<choiceInput>`

choice-input-label-position-ignored = satr ichida boʻlmagan choiceInput uchun labelPosition eʼtiborga olinmaydi

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput uchun berilgan indekslar eʼtiborga olinmaydi, chunki ularning soni choice avlodlari soniga mos kelmaydi.

pretzel-indices-count-mismatch = problem uchun berilgan indekslar eʼtiborga olinmaydi, chunki ularning soni problem avlodlari soniga mos kelmaydi.

shuffle-indices-count-mismatch = shuffle uchun berilgan indekslar eʼtiborga olinmaydi, chunki ularning soni komponentlar soniga mos kelmaydi.

indices-ignored-out-of-range = { $component } uchun berilgan indekslar eʼtiborga olinmaydi, chunki baʼzilari diapazondan tashqarida.

pretzel-indices-repeated = pretzel uchun berilgan indekslar eʼtiborga olinmaydi, chunki baʼzilari takrorlanadi.

pretzel-circuit-first-index = circuit rejimida pretzel uchun berilgan indekslar eʼtiborga olinmaydi, chunki birinchi indeks 1 boʻlishi kerak.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` matnli avlodlar bilan ishlashi uchun `type` atributi berilishi kerak.

invalid-type-defaulting-to-math = { $component } komponenti uchun yaroqsiz tur { $type }. U math, text, number yoki boolean boʻlishi kerak. math ishlatiladi.

string-not-valid-component-to-arrange = «{ $value }» satri { $component } uchun yaroqli komponent emas. Eʼtiborga olinmaydi.

## Types and variables

invalid-type-defaulting-to-number = Yaroqsiz tur { $type }, tur number qilib qoʻyiladi.

invalid-variable-value = Oʻzgaruvchining yaroqsiz qiymati: `{ $value }`

## Variants

variant-index-must-be-number = Variant indeksi { $index } son boʻlishi kerak

variant-index-must-be-integer = Variant indeksi { $index } butun son boʻlishi kerak

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` mutlaq oʻlchamlar uchun amalga oshirilmagan. Enlar nisbiy qilinadi.

side-by-side-absolute-margins = `<{ $component }>` mutlaq oʻlchamlar uchun amalga oshirilmagan. Chet maydonlari nisbiy qilinadi.

side-by-side-no-block-child = Yaroqsiz `<{ $component }>`: uning kamida bitta blok avlodi boʻlishi kerak.

## `<label>`

label-for-ignored-on-graphical = Grafik `<label>` elementidagi `for` atributi eʼtiborga olinmaydi.

label-for-must-resolve-to-one = `<label>` elementidagi `for` atributi aynan bitta komponentga ishora qilishi kerak.

label-for-unresolved = `<label>` elementidagi `for` atributini komponent bilan bogʻlab boʻlmadi.

label-for-answer-with-authored-inputs = `<label>` elementidagi `for` atributi muallif yozgan kiritish maydonlari bor `<answer>` elementiga ishora qiladi; maydonga toʻgʻridan-toʻgʻri ishora qiling.

label-for-answer-without-input = `<label>` elementidagi `for` atributi yorliqlanadigan kiritish maydoni yoʻq `<answer>` elementiga ishora qiladi.

label-for-must-reference-input-or-answer = `<label>` elementidagi `for` atributi kiritish maydoniga yoki javobga ishora qilishi kerak.

## Accessibility

accessibility-short-description-or-decorative = Foydalanuvchanlik uchun `<{ $component }>` yoki qisqa tavsifga ega boʻlishi, yoki bezak sifatida belgilanishi kerak.

accessibility-video-short-description = Foydalanuvchanlik uchun `<video>` qisqa tavsifga ega boʻlishi kerak.

accessibility-input-short-description-or-label = Foydalanuvchanlik uchun `<{ $component }>` qisqa tavsifga yoki yorliqqa ega boʻlishi kerak.

accessibility-answer-input-short-description-or-label = Foydalanuvchanlik uchun kiritish maydoni yaratadigan `<answer>` qisqa tavsifga yoki yorliqqa ega boʻlishi kerak.

accessibility-short-description-contains-math = Qisqa tavsiflarda `<{ $component }>` kabi matematik komponentlar boʻlmasligi kerak. Matematikani soʻz bilan yozing.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } boʻlim sarlavhasi matni uchun yetarli kontrast bermaydi (qorongʻi mavzu) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kamida { $threshold }:1 talab qilinadi).
       *[other] { $colorName } boʻlim sarlavhasi matni uchun yetarli kontrast bermaydi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kamida { $threshold }:1 talab qilinadi).
    }

## `<circle>`

circle-through-points-non-numerical = Nuqtalarning sonli qiymatlari boʻlmaganda { $count } nuqtadan oʻtuvchi `<circle>` amalga oshirilmagan.

circle-too-many-through-points = 3 tadan ortiq nuqtadan oʻtuvchi aylanani hisoblab boʻlmaydi.

circle-overprescribed-radius-center-points = Berilgan radius, markaz va nuqtalar bilan aylanani hisoblab boʻlmaydi.

circle-center-with-multiple-points = Berilgan markaz bilan 1 tadan ortiq nuqtadan oʻtuvchi aylanani hisoblab boʻlmaydi.

circle-radius-too-small = Aylanani hisoblab boʻlmaydi: ikki nuqta orasidagi masofa { $distance } boʻlgani uchun berilgan radius { $radius } juda kichik.

circle-radius-with-many-points = Berilgan radius bilan ikkitadan ortiq nuqtadan oʻtuvchi aylana yaratib boʻlmaydi.

circle-invalid-center-or-through-points = Aylananing markazi yoki nuqtalari yaroqsiz.

circle-radius-center-with-multiple-points = Berilgan markaz bilan 1 tadan ortiq nuqtadan oʻtuvchi aylananing radiusini hisoblab boʻlmaydi.

circle-change-radius-non-numerical = Sonli boʻlmagan nuqtali aylananing radiusini oʻzgartirib boʻlmaydi

circle-radius-with-points-non-numerical = Sonli qiymatlar boʻlmaganda berilgan radius bilan bittadan ortiq nuqtadan oʻtuvchi aylana yaratib boʻlmaydi.

circle-change-center-non-numerical = Sonli boʻlmagan nuqtalardan oʻtuvchi aylananing markazini oʻzgartirish amalga oshirilmagan.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Funksiyaning aniqlanish sohasining oʻlchami yetarli emas. Sohada { $intervals } oraliq bor, funksiyada esa { $inputs ->
            [one] { $inputs } kirish
           *[other] { $inputs } kirish
        }.
       *[other] Funksiyaning aniqlanish sohasining oʻlchami yetarli emas. Sohada { $intervals } oraliq bor, funksiyada esa { $inputs ->
            [one] { $inputs } kirish
           *[other] { $inputs } kirish
        }.
    }

function-domain-invalid-format = Funksiyaning aniqlanish sohasining formati yaroqsiz.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funksiyaning sonli boʻlmagan maksimumi eʼtiborga olinmaydi.
        [minimum] Funksiyaning sonli boʻlmagan minimumi eʼtiborga olinmaydi.
        [extremum] Funksiyaning sonli boʻlmagan ekstremumi eʼtiborga olinmaydi.
        [point] Funksiyaning sonli boʻlmagan nuqtasi eʼtiborga olinmaydi.
        [slope] Funksiyaning sonli boʻlmagan burchak koeffitsiyenti eʼtiborga olinmaydi.
       *[other] Funksiyaning sonli boʻlmagan { $type } qiymati eʼtiborga olinmaydi.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funksiyaning boʻsh maksimumi eʼtiborga olinmaydi.
        [minimum] Funksiyaning boʻsh minimumi eʼtiborga olinmaydi.
        [extremum] Funksiyaning boʻsh ekstremumi eʼtiborga olinmaydi.
        [point] Funksiyaning boʻsh nuqtasi eʼtiborga olinmaydi.
       *[other] Funksiyaning boʻsh { $type } qiymati eʼtiborga olinmaydi.
    }

function-points-too-close = Funksiyada bir-biriga juda yaqin ikki nuqta bor. Funksiyani aniqlab boʻlmaydi.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funksiya iteratsiyalari faqat kirishlar soni chiqishlar soniga teng boʻlgandagina mumkin. Bu funksiyada { $inputs } kirish va { $outputs ->
            [one] { $outputs } chiqish
           *[other] { $outputs } chiqish
        } bor.
       *[other] Funksiya iteratsiyalari faqat kirishlar soni chiqishlar soniga teng boʻlgandagina mumkin. Bu funksiyada { $inputs } kirish va { $outputs ->
            [one] { $outputs } chiqish
           *[other] { $outputs } chiqish
        } bor.
    }

## `<sequence>`

sequence-invalid-length = Ketma-ketlikning uzunligi yaroqsiz. U manfiy boʻlmagan butun son boʻlishi kerak.

sequence-invalid-step = Ketma-ketlikning qadami yaroqsiz. { $type } turidagi ketma-ketlik uchun u son boʻlishi kerak.

sequence-invalid-endpoint-number = Sonli ketma-ketlikning «{ $attribute }» qiymati yaroqsiz. U son boʻlishi kerak.

sequence-invalid-endpoint-letters = Harfli ketma-ketlikning «{ $attribute }» qiymati yaroqsiz. U harflar birikmasi boʻlishi kerak.

sequence-invalid-endpoint = Ketma-ketlikning «{ $attribute }» qiymati yaroqsiz.

select-from-sequence-coprime-not-numbers = sonlar tanlanmagani uchun coprime eʼtiborga olinmaydi

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations berilgani uchun coprime eʼtiborga olinmaydi

## Resolving a `target`

target-not-found = `<{ $source }>` uchun yaroqsiz target: nishon topilmadi.

target-state-variable-not-found = `<{ $source }>` uchun yaroqsiz target: `<{ $component }>` elementida «{ $property }» nomli holat oʻzgaruvchisi topilmadi.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` oʻzgaruvchilari erkli oʻzgaruvchidan farq qilishi kerak.

ode-system-duplicate-variable-names = Bogʻliq oʻzgaruvchilarning takrorlanuvchi nomlari bilan DT oʻng tomon funksiyalarini aniqlab boʻlmaydi.

ode-system-rhs-function-error = DT oʻng tomon funksiyasini aniqlab boʻlmaydi. mathjs funksiyasini yaratishda xato.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } toʻgʻri chiziq orasidagi burchakni aniqlab boʻlmaydi

angle-invalid-through-point = `<angle>` elementining through qiymatida yaroqsiz nuqta

parabola-vertex-too-many-points = Berilgan uchi bilan 1 tadan ortiq nuqtadan oʻtuvchi parabola amalga oshirilmagan.

parabola-too-many-points = 3 tadan ortiq nuqtadan oʻtuvchi parabola amalga oshirilmagan.

intersection-too-many-items = Ikkitadan ortiq obyektning kesishmasi amalga oshirilmagan

## Other math components

ionic-compound-not-two-ions = Ikki iondan boshqa ion birikmalari amalga oshirilmagan.

ionic-compound-needs-cation-and-anion = Ion birikmalari faqat bitta kation va bitta anion uchun amalga oshirilgan.

solve-equations-cannot-evaluate = Tenglamani yechib boʻlmaydi, chunki uni hisoblab boʻlmadi: { $equation }

math-operators-operand-number-required = Matematik operandni ajratib olish uchun operandNumber berilishi kerak.

eigen-decomposition-failed = Matritsaning xos qiymatlarini hisoblab boʻlmadi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } parametri shablonda uchramaydi, shuning uchun u doim boʻsh qiymatga mos keladi.
       *[other] `<matchesPattern>`: { $parameters } parametrlari shablonda uchramaydi, shuning uchun ular doim boʻsh qiymatga mos keladi.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" qiymatini talqin qilib boʻlmaydi. U none, medium, dense yoki boʻsh joy bilan ajratilgan ikki musbat son boʻlishi kerak, masalan grid="1 0.5". Toʻr chizilmaydi.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure tasvirlagichida xLabelPosition="left" qoʻllab-quvvatlanmaydi; oʻng joylashuv xatti-harakati ishlatiladi.

prefigure-y-label-position-unsupported = `<graph>`: prefigure tasvirlagichida yLabelPosition="bottom" qoʻllab-quvvatlanmaydi; yuqori joylashuv xatti-harakati ishlatiladi.

prefigure-invalid-axis-bounds = `<graph>`: prefigure oʻgirishi uchun oʻqlarning chegaralari yaroqsiz; standart bbox (-10,-10,10,10) ishlatiladi.

prefigure-invalid-width = `<graph>`: prefigure oʻgirishi uchun en yaroqsiz; diagrammaning standart eni 425 ishlatiladi.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure oʻgirishi uchun aspectRatio yaroqsiz; standart tomonlar nisbati 1 ishlatiladi.

prefigure-grid-spacing-too-fine = `<graph>`: toʻr qadami oʻqlarning chegaralari uchun juda mayda; prefigure tasvirlagichida toʻr tashlab ketiladi.

prefigure-annotations-not-rendered = `<graph>`: PreFigure tasvirlagichi ishlatilmaganda izohlar chizilmaydi.

multiple-annotations-children = `<graph>` ichida bir nechta `<annotations>` avlodi topildi; oxirgisidan boshqasi eʼtiborga olinmaydi.

## Referring to other components

copy-unrecognized-component-type = Tanilmagan komponent turini kengaytirib yoki nusxalab boʻlmaydi: { $type }.

copy-prop-not-found = { $component } turidagi komponentda { $property } xossasi topilmadi

collect-no-source = collect uchun manba topilmadi.

collect-invalid-component-type = `<{ $component }>` turidagi komponentlarni toʻplab boʻlmaydi, chunki bu yaroqsiz komponent turi.

reference-index-unavailable = `{ $reference }` indeksiga havola qilib boʻlmaydi

## `<callAction>`

component-action-unavailable = `{ $reference }` komponentida { $action } chaqirib boʻlmaydi

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Maʼlumotlarning shakli yaroqsiz. Qatorlarning uzunliklari har xil. Topildi componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Maʼlumotlarda takrorlanuvchi ustun nomlari bor. Topildi componentIdx :{ $componentIdx }

data-frame-missing-column-name = Maʼlumotlarda ustun nomi yetishmaydi. Topildi componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Bu javobning award qiymati answer tegining oʻz yuborilgan javobiga asoslangan, bu esa kutilmagan xatti-harakatga olib keladi.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` bor konteyner ichidagi `<answer>` elementiga `maxNumAttempts` qoʻyish taʼsir qilmaydi, chunki urinishlar sonini konteyner belgilaydi. `maxNumAttempts` qiymatini konteynerga qoʻying.

nested-section-wide-check-work-max-num-attempts = Boshqa `sectionWideCheckWork` konteyneri ichida turgan `sectionWideCheckWork` konteyneriga `maxNumAttempts` qoʻyish taʼsir qilmaydi, chunki urinishlar sonini tashqi konteyner belgilaydi. `maxNumAttempts` qiymatini tashqi konteynerga qoʻying.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality qoʻyilmasa, { $attributes } atributi hech narsaga taʼsir qilmaydi.
       *[other] symbolicEquality qoʻyilmasa, { $attributes } atributlari hech narsaga taʼsir qilmaydi.
    }

answer-invalid-type = answer uchun yaroqsiz tur: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` komponentining nomi yoʻqligi sababli uni modul atributi sifatida ishlatib boʻlmaydi

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` komponentini modul atributi sifatida ishlatib boʻlmaydi, chunki `<module>` komponent turida «{ $name }» atributi allaqachon aniqlangan.

conditional-content-condition-ignored = case yoki else avlodlari bor `<conditionalContent>` komponentida `condition` atributi eʼtiborga olinmaydi.

slider-markers-type-mismatch = Markerlarning turi surgichning turiga mos kelmaydi.

pretzel-problem-needs-statement-and-answer = Yaroqsiz pretzel: har bir `<problem>` bitta `<statement>` va bitta `<answer>` ni oʻz ichiga olishi kerak.

pretzel-circuit-first-problem-distractor = Yaroqsiz pretzel: mode="circuit" rejimida birinchi `<problem>` chalgʻituvchi boʻla olmaydi.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` atributi uchun yaroqsiz qiymat { $values }; eʼtiborga olinmaydi.
       *[other] `{ $attribute }` atributi uchun yaroqsiz qiymatlar { $values }; eʼtiborga olinmaydi.
    }

attribute-must-be-references = `{ $attribute }` atributi uchun yaroqsiz qiymat `{ $value }`. Atribut `$` belgisi bilan boshlanadigan havolalardan iborat boʻlishi kerak.

math-input-invalid-function-names = <mathInput>: { $attribute } ichidagi yaroqsiz funksiya nomlari eʼtiborga olinmadi: { $names }. Har bir nomning koʻrsatiladigan qismi kamida 2 belgi boʻlishi kerak (harflar yoki chiziqchalar); undan keyin ixtiyoriy `|<mathspeak muqobil>` qoʻshimchasi kelishi mumkin.

## Building components from the source

component-type-invalid = Yaroqsiz komponent turi: `<{ $componentType }>`

attribute-repeated = { $attribute } atributini takrorlab boʻlmaydi.

attribute-invalid-for-component = `<{ $componentType }>` turidagi komponent uchun yaroqsiz atribut «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } uslub taʼrifida { $context ->
        [text-on-background] matn rangi bilan fon rangi
        [high-contrast] yuqori kontrastli rang bilan kanvas
        [line] chiziq rangi bilan kanvas
        [marker] marker rangi bilan kanvas
       *[text-on-canvas] matn rangi bilan kanvas
    } orasidagi kontrast yetarli emas{ $mode ->
        [dark] { " (qorongʻi mavzu)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kamida { $threshold }:1 talab qilinadi).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } uslub taʼrifida berilgan ranglar yorugʻ mavzu uchun yetarli kontrast bersa-da, ulardan olingan qorongʻi mavzu ranglari matn bilan fon orasida yetarli kontrast bermaydi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kamida { $threshold }:1 talab qilinadi). { $suggestion ->
        [available] Qorongʻi mavzuda yetarli kontrast uchun yo yorugʻ mavzudagi kontrastni oshiring (masalan { $lightAttribute }="{ $lightColor }"), yo qorongʻi mavzu rangini almashtiring (masalan { $darkAttribute }="{ $darkColor }").
       *[none] Qorongʻi mavzuda yetarli kontrast uchun yorugʻ mavzudagi kontrastni oshiring yoki olingan ranglarni textColorDarkMode va/yoki backgroundColorDarkMode bilan almashtiring.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } uslub taʼrifida berilgan matn rangi yorugʻ mavzu uchun yetarli kontrast bersa-da, undan olingan qorongʻi mavzu matn rangi kanvas bilan yetarli kontrast bermaydi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kamida { $threshold }:1 talab qilinadi). { $suggestion ->
        [available] Qorongʻi mavzuda yetarli kontrast uchun yo yorugʻ mavzudagi kontrastni oshiring (masalan textColor="{ $lightColor }"), yo qorongʻi mavzu rangini almashtiring (masalan textColorDarkMode="{ $darkColor }").
       *[none] Qorongʻi mavzuda yetarli kontrast uchun yorugʻ mavzudagi kontrastni oshiring yoki olingan rangni textColorDarkMode bilan almashtiring.
    }

section-multiple-style-palettes = Boʻlim faqat bitta <stylePalette> tanlay oladi; oxirgisi ishlatiladi.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } uchun noyob variantlarni aniqlab boʻlmaydi, chunki numToSelect manfiy boʻlmagan butun son emas.

variant-num-to-select-not-constant-number = { $component } uchun noyob variantlarni aniqlab boʻlmaydi, chunki numToSelect oʻzgarmas son emas.

variant-with-replacement-not-constant-boolean = { $component } uchun noyob variantlarni aniqlab boʻlmaydi, chunki withReplacement oʻzgarmas mantiqiy qiymat emas.

variant-select-weight-disables-unique = biror variantda selectWeight yoki selectForVariants berilgan boʻlsa, select uchun noyob variantlar oʻchiriladi

variant-coprime-undetermined = { $component } uchun noyob variantlarni aniqlab boʻlmaydi, chunki coprime doim yolgʻon ekanini aniqlab boʻlmaydi.

variant-attribute-not-constant = { $component } uchun noyob variantlarni aniqlab boʻlmaydi, chunki { $attribute } oʻzgarmas emas.

variant-attribute-not-number = { $component } uchun noyob variantlarni aniqlab boʻlmaydi, chunki { $attribute } son emas.

variant-attribute-wrong-type-for-sequence =
    { $type } turidagi { $component } uchun noyob variantlarni aniqlab boʻlmaydi, chunki { $attribute } { $expected ->
        [letters-combination] harflar birikmasi
        [math-expression] yaroqli matematik ifoda
        [integer] butun son
       *[number] son
    } emas.

variant-length-not-integer = { $component } uchun noyob variantlarni aniqlab boʻlmaydi, chunki length butun son emas.

variant-sort-not-implemented = sort bor { $component } uchun noyob variantlar amalga oshirilmagan

variant-exclude-combinations-not-implemented = excludeCombinations bor { $component } uchun noyob variantlar amalga oshirilmagan

variant-math-exclude-not-implemented = exclude bor math turidagi { $component } uchun noyob variantlar amalga oshirilmagan

variant-non-constant-exclude-not-implemented = oʻzgarmas boʻlmagan exclude bor { $component } uchun noyob variantlar amalga oshirilmagan

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: grafikning prefigure tasvirlagichida qoʻllab-quvvatlanmaydi; avlod tashlab ketildi.

prefigure-descendant-invalid-geometry = { $subject }: cheksiz yoki toʻliq boʻlmagan geometriya; avlod tashlab ketildi.

prefigure-curve-label-omitted = { $subject }: oʻgirilgan egri elementlarida yorliqlar qoʻllab-quvvatlanmaydi; yorliq tashlab ketildi.

prefigure-curve-unsupported-definition-type = { $subject }: qoʻllab-quvvatlanmaydigan egri funksiya taʼrifi turi «{ $definitionType }»; avlod tashlab ketildi.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves elementidagi flipFunctions atributi qoʻllab-quvvatlanmaydi; avlod tashlab ketildi.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves faqat formula bilan berilgan avlod funksiyalarni qoʻllab-quvvatlaydi; avlod tashlab ketildi.

prefigure-label-position-unsupported =
    { $subject }: qoʻllab-quvvatlanmaydigan labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] chiziqlar oilasi yorligʻi uchun
       *[point] nuqta yorligʻi uchun
    }; PreFigure standart tekislashi ishlatiladi.

prefigure-fill-style-unsupported = { $subject }: toʻldirish uslubi «{ $fillStyle }» PreFigure tomonidan qoʻllab-quvvatlanmaydi; yaxlit toʻldirishga oʻtiladi.

prefigure-line-style-unknown = { $subject }: nomaʼlum chiziq uslubi «{ $lineStyle }» PreFigure chiqishidan olib tashlandi.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker uslubi «{ $markerStyle }» PreFigure «diamond» uslubiga moslashtirildi.

prefigure-marker-style-unsupported = { $subject }: marker uslubi «{ $markerStyle }» PreFigure tomonidan qoʻllab-quvvatlanmaydi; standart uslub ishlatiladi.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: yaroqsiz `ref`; nishonni bogʻlab boʻlmaydi. Izoh tashlab ketildi.

annotation-ref-multiple-targets = `<annotation>`: `ref` bir nechta nishon bilan bogʻlandi; birinchisi ishlatiladi.

annotation-ref-outside-graph = `<annotation>`: yaroqsiz `ref`; nishon uni oʻz ichiga olgan grafikdan tashqarida. Izoh tashlab ketildi.

annotation-ref-unsupported-target = `<annotation>`: yaroqsiz `ref`; nishon prefigure oʻgirishida qoʻllab-quvvatlanadigan grafik obyekt emas. Izoh tashlab ketildi.

annotation-text-missing = `<annotation>`: `text` yoʻq yoki boʻsh; boʻsh matn chiqariladi.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Aylanma bogʻliqlik aniqlandi.
       *[other] `<{ $componentType }>` komponentini oʻz ichiga olgan aylanma bogʻliqlik aniqlandi.
    }

reference-no-referent = Havola uchun obyekt topilmadi: `{ $reference }`

reference-multiple-referents = Havola uchun bir nechta obyekt topildi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` elementining { $attribute } atributining formati yaroqsiz.

children-invalid = `<{ $componentType }>` uchun yaroqsiz avlodlar: yaroqsiz avlodlar topildi: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` atributi uchun yaroqsiz qiymat `{ $value }`; `{ $default }` qiymati ishlatiladi

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } versiyasi topilmadi.
       *[other] DoenetML { $version } versiyasi topilmadi. { $fallback } versiyasi ishlatiladi
    }

## Reading the DoenetML

parse-invalid-doenetml = Yaroqsiz DoenetML: { $content }

parse-tag-missing-close-tag = Yaroqsiz DoenetML: `{ $tag }` tegining yopuvchi tegi yoʻq. Oʻzi yopiladigan teg yoki `</{ $tagName }>` tegi kutilgan edi.

parse-tag-error = Yaroqsiz DoenetML: `<{ $tagName }>` tegida xato

parse-attribute-missing-value = Yaroqsiz DoenetML: `{ $attribute }` atributida qiymat yetishmayotganga oʻxshaydi.

parse-attribute-invalid = Yaroqsiz DoenetML: yaroqsiz atribut `{ $attribute }`

parse-attribute-value-invalid = Yaroqsiz DoenetML: yaroqsiz atribut qiymati `{ $value }`

parse-attribute-value-quote-mismatch = Yaroqsiz DoenetML: yaroqsiz atribut qiymati `{ $value }`. Qoʻshtirnoqlar mos kelmaydi. `{ $quote }` yetishmayotganga oʻxshaydi

parse-open-tag-name-missing = Yaroqsiz DoenetML: nomsiz teg topildi, masalan `<`

parse-tag-not-closed = Yaroqsiz DoenetML: `{ $tag }` tegi yopilmagan (`>` yetishmayotganga oʻxshaydi).

parse-self-closing-tag-name-missing = Yaroqsiz DoenetML: nomsiz teg topildi `<{ $content }>`

parse-self-closing-tag-not-closed = Yaroqsiz DoenetML: `{ $tag }` tegi yopilmagan (`/>` yetishmayotganga oʻxshaydi).

parse-tag-invalid-attributes = Yaroqsiz DoenetML: `{ $tag }` tegi yaroqli emas. Uning atributlari notoʻgʻri boʻlishi mumkin.

parse-close-tag-name-missing = Yaroqsiz DoenetML: nomsiz yopuvchi teg topildi, masalan `</`

parse-attribute-value-unquoted = Atribut qiymatlari qoʻshtirnoq ichida boʻlishi kerak: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Yaroqsiz DoenetML: `{ $tag }` yopuvchi tegi topildi, lekin unga mos ochuvchi teg yoʻq

parse-close-tag-mismatched = Yaroqsiz DoenetML: mos kelmaydigan yopuvchi teg. `</{ $expected }>` kutilgan edi. `{ $found }` topildi

parser-node-unconvertible = { $node } tugunini Dast tuguniga oʻgirib boʻlmadi.

## Names

name-attribute-invalid =
    Yaroqsiz atribut name='{ $name }'. { $reason ->
        [characters] Nomlarda faqat harflar, raqamlar, pastki chiziqlar yoki chiziqchalar boʻlishi mumkin.
       *[start] Nomlar harf bilan boshlanishi kerak.
    }

component-name-invalid-start = Yaroqsiz komponent nomi «{ $name }». Nomlar harf bilan boshlanishi kerak.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched turidagi answer-ning video atributi boʻlishi kerak

answer-video-watched-video-not-reference = videoWatched turidagi answer-ning video atributi havola boʻlishi kerak

answer-name-not-single-text = answer-ning name atributida aynan bitta matnli avlod boʻlishi kerak

## Referencing another document

external-doenetml-recursion-limit = Rekursiya darajalari juda koʻp boʻlgani uchun tashqi DoenetML olinmadi. Aylanma havola yoʻqmi?

external-doenetml-unavailable = { $attribute }="{ $uri }" manzilidan DoenetML olinmadi

external-doenetml-type-mismatch = { $attribute }="{ $uri }" manzilidan yaroqsiz DoenetML olindi: u «{ $componentType }» komponent turiga mos kelmadi

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` atributi eskirgan; uning oʻrniga `{ $to }` ishlating.
       *[other] [deprecation] `<{ $component }>` elementidagi `{ $from }` atributi eskirgan; uning oʻrniga `{ $to }` ishlating.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` atributi eskirgan va eʼtiborga olinmaydi, chunki `{ $to }` ham berilgan.
       *[other] [deprecation] `<{ $component }>` elementidagi `{ $from }` atributi eskirgan va eʼtiborga olinmaydi, chunki `{ $to }` ham berilgan.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` elementidagi `{ $attribute }` atributi eskirgan va eʼtiborga olinmaydi.


## Language coverage

pluralize-english-only = `<pluralize>` faqat ingliz tilida koʻplik yasay oladi, shuning uchun { $locale } tilida yozilgan hujjatda uning matni oʻzgarishsiz qoladi. Koʻplik shaklini oʻzingiz yozing yoki `pluralForm` atributi bilan bering.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` elementi tanilgan Doenet elementi emas.

schema-element-not-allowed-at-root = `<{ $tag }>` elementiga hujjatning ildizida ruxsat berilmaydi.

schema-element-not-allowed-inside = `<{ $tag }>` elementiga `<{ $parent }>` ichida ruxsat berilmaydi.

schema-attribute-unrecognized = `<{ $tag }>` elementida `{ $attribute }` nomli atribut yoʻq.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` elementining `{ $attribute }` atributi har bir elementi quyidagilardan biri boʻlgan roʻyxat boʻlishi kerak: { $allowed }
       *[other] `<{ $tag }>` elementining `{ $attribute }` atributi quyidagilardan biri boʻlishi kerak: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select uchun yaroqsiz variant nomi. { $variantName } variant nomi { $numOptions } variantda uchraydi, tanlanadigan son esa { $numToSelect }.

select-variant-name-without-options = select uchun variantlar berilgan, lekin mumkin boʻlgan variant nomi uchun birorta tanlov yoʻq: { $variantName }.

select-variant-name-not-possible = select uchun berilgan { $variantName } variant nomi mumkin boʻlgan variant nomi emas.

select-too-few-options = Bor-yoʻgʻi { $numOptions } ichidan { $numToSelect } komponentni tanlab boʻlmaydi.

select-from-sequence-too-few-values = Uzunligi { $length } ketma-ketlikdan { $numToSelect } qiymatni tanlab boʻlmaydi.

select-from-sequence-indices-count-mismatch = select uchun berilgan indekslar soni tanlanadigan songa mos kelishi kerak

select-from-sequence-indices-not-integers = select uchun berilgan barcha indekslar butun son boʻlishi kerak

select-from-sequence-index-excluded = selectfromsequence uchun berilgan indeks chiqarib tashlangan edi

select-from-sequence-indices-excluded-combination = selectfromsequence uchun berilgan indekslar chiqarib tashlangan birikma edi

select-from-sequence-coprime-not-positive-integers = Musbat butun sonlar tanlanmagani uchun oʻzaro tub birikmalarni tanlab boʻlmaydi.

select-from-sequence-coprime-common-factor = Oʻzaro tub sonlarni tanlab boʻlmaydi. Barcha mumkin boʻlgan qiymatlarning umumiy boʻluvchisi bor. (Berilgan "from" yoki "to" qiymatlari "step" bilan oʻzaro tub boʻlishi kerak.)

select-from-sequence-coprime-single-number = 1 dan boshqa yagona sondan oʻzaro tub birikmalarni tanlab boʻlmaydi.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ichida birikmalarning 70% dan ortigʻi chiqarib tashlangan

select-from-sequence-coprime-none-found = Oʻzaro tub sonlarni tanlab boʻlmadi. Barcha mumkin boʻlgan qiymatlarning umumiy boʻluvchisi bor.

select-from-sequence-too-few-unique-values = Uzunligi { $numPossibleValues } ketma-ketlikdan { $numToSelect } har xil qiymatni tanlab boʻlmaydi

select-prime-numbers-too-few-values = Uzunligi { $numValues } tub sonlar roʻyxatidan { $numToSelect } qiymatni tanlab boʻlmaydi

select-prime-numbers-values-count-mismatch = select uchun berilgan qiymatlar soni tanlanadigan songa mos kelishi kerak

select-prime-numbers-values-not-prime = select prime number uchun berilgan barcha qiymatlar tub sonlar roʻyxatida boʻlishi kerak

select-prime-numbers-values-excluded-combination = selectPrimeNumbers uchun berilgan qiymatlar chiqarib tashlangan birikma edi

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ichida birikmalarning 70% dan ortigʻi chiqarib tashlangan

select-random-combination-fluke = Nihoyatda ehtimoldan yiroq tasodif tufayli tasodifiy qiymatlar birikmasini tanlab boʻlmadi

select-random-value-fluke = Nihoyatda ehtimoldan yiroq tasodif tufayli tasodifiy qiymatni tanlab boʻlmadi
