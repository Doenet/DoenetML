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
        [one] ikkala uchi ham berilganda { $attributes } e’tiborga olinmaydi
       *[other] ikkala uchi ham berilganda { $attributes } e’tiborga olinmaydi
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] uchi ham, o‘rta nuqtasi ham berilganda { $attributes } e’tiborga olinmaydi
       *[other] uchi ham, o‘rta nuqtasi ham berilganda { $attributes } e’tiborga olinmaydi
    }

line-segment-midpoint-offset-without-midpoint = o‘rta nuqtasiz midpointOffset hech narsaga ta’sir qilmaydi

## `<line>`

line-points-undetermined-dimensions = O‘lchami aniqlanmagan nuqtalardan o‘tuvchi to‘g‘ri chiziq.

line-points-too-few-dimensions = To‘g‘ri chiziq kamida ikki o‘lchamli nuqtalardan o‘tishi kerak.

line-points-depend-on-variables = To‘g‘ri chiziq o‘zgaruvchilarga bog‘liq nuqtalardan o‘tadi: { $variables }.

line-equation-invalid-format = { $variable1 } va { $variable2 } o‘zgaruvchilaridagi to‘g‘ri chiziq tenglamasining formati yaroqsiz.

## `<ray>`

ray-overprescribed-through = Nur through, endpoint va direction orqali berilgan. Berilgan through e’tiborga olinmaydi.

ray-dimension-mismatch = nurda numDimensions mos kelmaydi.

## `<vector>`

vector-overprescribed-head = Vektor head, tail va displacement orqali berilgan. Berilgan head e’tiborga olinmaydi.

vector-dimension-mismatch = vektorda numDimensions mos kelmaydi.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` elementiga tortib bo‘lmaydi, chunki uning nearestPoint holat o‘zgaruvchisi yo‘q.

constrain-to-without-nearest-point = `<{ $component }>` elementi bilan cheklab bo‘lmaydi, chunki uning nearestPoint holat o‘zgaruvchisi yo‘q.

constrain-to-interior-without-nearest-point = `<{ $component }>` elementining ichki qismi bilan cheklab bo‘lmaydi, chunki uning nearestPoint holat o‘zgaruvchisi yo‘q.

## `<choiceInput>`

choice-input-label-position-ignored = satr ichida bo‘lmagan choiceInput uchun labelPosition e’tiborga olinmaydi

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput uchun berilgan indekslar e’tiborga olinmaydi, chunki ularning soni choice avlodlari soniga mos kelmaydi.

pretzel-indices-count-mismatch = problem uchun berilgan indekslar e’tiborga olinmaydi, chunki ularning soni problem avlodlari soniga mos kelmaydi.

shuffle-indices-count-mismatch = shuffle uchun berilgan indekslar e’tiborga olinmaydi, chunki ularning soni komponentlar soniga mos kelmaydi.

indices-ignored-out-of-range = { $component } uchun berilgan indekslar e’tiborga olinmaydi, chunki ba’zilari diapazondan tashqarida.

pretzel-indices-repeated = pretzel uchun berilgan indekslar e’tiborga olinmaydi, chunki ba’zilari takrorlanadi.

pretzel-circuit-first-index = circuit rejimida pretzel uchun berilgan indekslar e’tiborga olinmaydi, chunki birinchi indeks 1 bo‘lishi kerak.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` matnli avlodlar bilan ishlashi uchun `type` atributi berilishi kerak.

invalid-type-defaulting-to-math = { $component } komponenti uchun yaroqsiz tur { $type }. U math, text, number yoki boolean bo‘lishi kerak. math ishlatiladi.

string-not-valid-component-to-arrange = «{ $value }» satri { $component } uchun yaroqli komponent emas. E’tiborga olinmaydi.

## Types and variables

invalid-type-defaulting-to-number = Yaroqsiz tur { $type }, tur number qilib qo‘yiladi.

invalid-variable-value = O‘zgaruvchining yaroqsiz qiymati: `{ $value }`

## Variants

variant-index-must-be-number = Variant indeksi { $index } son bo‘lishi kerak

variant-index-must-be-integer = Variant indeksi { $index } butun son bo‘lishi kerak

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` mutlaq o‘lchamlar uchun amalga oshirilmagan. Enlar nisbiy qilinadi.

side-by-side-absolute-margins = `<{ $component }>` mutlaq o‘lchamlar uchun amalga oshirilmagan. Chet maydonlari nisbiy qilinadi.

side-by-side-no-block-child = Yaroqsiz `<{ $component }>`: uning kamida bitta blok avlodi bo‘lishi kerak.

## `<label>`

label-for-ignored-on-graphical = Grafik `<label>` elementidagi `for` atributi e’tiborga olinmaydi.

label-for-must-resolve-to-one = `<label>` elementidagi `for` atributi aynan bitta komponentga ishora qilishi kerak.

label-for-unresolved = `<label>` elementidagi `for` atributini komponent bilan bog‘lab bo‘lmadi.

label-for-answer-with-authored-inputs = `<label>` elementidagi `for` atributi muallif yozgan kiritish maydonlari bor `<answer>` elementiga ishora qiladi; maydonga to‘g‘ridan-to‘g‘ri ishora qiling.

label-for-answer-without-input = `<label>` elementidagi `for` atributi yorliqlanadigan kiritish maydoni yo‘q `<answer>` elementiga ishora qiladi.

label-for-must-reference-input-or-answer = `<label>` elementidagi `for` atributi kiritish maydoniga yoki javobga ishora qilishi kerak.

## Accessibility

accessibility-short-description-or-decorative = Foydalanuvchanlik uchun `<{ $component }>` yoki qisqa tavsifga ega bo‘lishi, yoki bezak sifatida belgilanishi kerak.

accessibility-video-short-description = Foydalanuvchanlik uchun `<video>` qisqa tavsifga ega bo‘lishi kerak.

accessibility-input-short-description-or-label = Foydalanuvchanlik uchun `<{ $component }>` qisqa tavsifga yoki yorliqqa ega bo‘lishi kerak.

accessibility-answer-input-short-description-or-label = Foydalanuvchanlik uchun kiritish maydoni yaratadigan `<answer>` qisqa tavsifga yoki yorliqqa ega bo‘lishi kerak.

accessibility-short-description-contains-math = Qisqa tavsiflarda `<{ $component }>` kabi matematik komponentlar bo‘lmasligi kerak. Matematikani so‘z bilan yozing.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } bo‘lim sarlavhasi matni uchun yetarli kontrast bermaydi (qorong‘i mavzu) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kamida { $threshold }:1 talab qilinadi).
       *[other] { $colorName } bo‘lim sarlavhasi matni uchun yetarli kontrast bermaydi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kamida { $threshold }:1 talab qilinadi).
    }

## `<circle>`

circle-through-points-non-numerical = Nuqtalarning sonli qiymatlari bo‘lmaganda { $count } nuqtadan o‘tuvchi `<circle>` amalga oshirilmagan.

circle-too-many-through-points = 3 tadan ortiq nuqtadan o‘tuvchi aylanani hisoblab bo‘lmaydi.

circle-overprescribed-radius-center-points = Berilgan radius, markaz va nuqtalar bilan aylanani hisoblab bo‘lmaydi.

circle-center-with-multiple-points = Berilgan markaz bilan 1 tadan ortiq nuqtadan o‘tuvchi aylanani hisoblab bo‘lmaydi.

circle-radius-too-small = Aylanani hisoblab bo‘lmaydi: ikki nuqta orasidagi masofa { $distance } bo‘lgani uchun berilgan radius { $radius } juda kichik.

circle-radius-with-many-points = Berilgan radius bilan ikkitadan ortiq nuqtadan o‘tuvchi aylana yaratib bo‘lmaydi.

circle-invalid-center-or-through-points = Aylananing markazi yoki nuqtalari yaroqsiz.

circle-radius-center-with-multiple-points = Berilgan markaz bilan 1 tadan ortiq nuqtadan o‘tuvchi aylananing radiusini hisoblab bo‘lmaydi.

circle-change-radius-non-numerical = Sonli bo‘lmagan nuqtali aylananing radiusini o‘zgartirib bo‘lmaydi

circle-radius-with-points-non-numerical = Sonli qiymatlar bo‘lmaganda berilgan radius bilan bittadan ortiq nuqtadan o‘tuvchi aylana yaratib bo‘lmaydi.

circle-change-center-non-numerical = Sonli bo‘lmagan nuqtalardan o‘tuvchi aylananing markazini o‘zgartirish amalga oshirilmagan.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Funksiyaning aniqlanish sohasining o‘lchami yetarli emas. Sohada { $intervals } oraliq bor, funksiyada esa { $inputs ->
            [one] { $inputs } kirish
           *[other] { $inputs } kirish
        }.
       *[other] Funksiyaning aniqlanish sohasining o‘lchami yetarli emas. Sohada { $intervals } oraliq bor, funksiyada esa { $inputs ->
            [one] { $inputs } kirish
           *[other] { $inputs } kirish
        }.
    }

function-domain-invalid-format = Funksiyaning aniqlanish sohasining formati yaroqsiz.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funksiyaning sonli bo‘lmagan maksimumi e’tiborga olinmaydi.
        [minimum] Funksiyaning sonli bo‘lmagan minimumi e’tiborga olinmaydi.
        [extremum] Funksiyaning sonli bo‘lmagan ekstremumi e’tiborga olinmaydi.
        [point] Funksiyaning sonli bo‘lmagan nuqtasi e’tiborga olinmaydi.
        [slope] Funksiyaning sonli bo‘lmagan burchak koeffitsiyenti e’tiborga olinmaydi.
       *[other] Funksiyaning sonli bo‘lmagan { $type } qiymati e’tiborga olinmaydi.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funksiyaning bo‘sh maksimumi e’tiborga olinmaydi.
        [minimum] Funksiyaning bo‘sh minimumi e’tiborga olinmaydi.
        [extremum] Funksiyaning bo‘sh ekstremumi e’tiborga olinmaydi.
        [point] Funksiyaning bo‘sh nuqtasi e’tiborga olinmaydi.
       *[other] Funksiyaning bo‘sh { $type } qiymati e’tiborga olinmaydi.
    }

function-points-too-close = Funksiyada bir-biriga juda yaqin ikki nuqta bor. Funksiyani aniqlab bo‘lmaydi.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funksiya iteratsiyalari faqat kirishlar soni chiqishlar soniga teng bo‘lgandagina mumkin. Bu funksiyada { $inputs } kirish va { $outputs ->
            [one] { $outputs } chiqish
           *[other] { $outputs } chiqish
        } bor.
       *[other] Funksiya iteratsiyalari faqat kirishlar soni chiqishlar soniga teng bo‘lgandagina mumkin. Bu funksiyada { $inputs } kirish va { $outputs ->
            [one] { $outputs } chiqish
           *[other] { $outputs } chiqish
        } bor.
    }

## `<sequence>`

sequence-invalid-length = Ketma-ketlikning uzunligi yaroqsiz. U manfiy bo‘lmagan butun son bo‘lishi kerak.

sequence-invalid-step = Ketma-ketlikning qadami yaroqsiz. { $type } turidagi ketma-ketlik uchun u son bo‘lishi kerak.

sequence-invalid-endpoint-number = Sonli ketma-ketlikning «{ $attribute }» qiymati yaroqsiz. U son bo‘lishi kerak.

sequence-invalid-endpoint-letters = Harfli ketma-ketlikning «{ $attribute }» qiymati yaroqsiz. U harflar birikmasi bo‘lishi kerak.

sequence-invalid-endpoint = Ketma-ketlikning «{ $attribute }» qiymati yaroqsiz.

select-from-sequence-coprime-not-numbers = sonlar tanlanmagani uchun coprime e’tiborga olinmaydi

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations berilgani uchun coprime e’tiborga olinmaydi

## Resolving a `target`

target-not-found = `<{ $source }>` uchun yaroqsiz target: nishon topilmadi.

target-state-variable-not-found = `<{ $source }>` uchun yaroqsiz target: `<{ $component }>` elementida «{ $property }» nomli holat o‘zgaruvchisi topilmadi.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` o‘zgaruvchilari erkli o‘zgaruvchidan farq qilishi kerak.

ode-system-duplicate-variable-names = Bog‘liq o‘zgaruvchilarning takrorlanuvchi nomlari bilan DT o‘ng tomon funksiyalarini aniqlab bo‘lmaydi.

ode-system-rhs-function-error = DT o‘ng tomon funksiyasini aniqlab bo‘lmaydi. mathjs funksiyasini yaratishda xato.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } to‘g‘ri chiziq orasidagi burchakni aniqlab bo‘lmaydi

angle-invalid-through-point = `<angle>` elementining through qiymatida yaroqsiz nuqta

parabola-vertex-too-many-points = Berilgan uchi bilan 1 tadan ortiq nuqtadan o‘tuvchi parabola amalga oshirilmagan.

parabola-too-many-points = 3 tadan ortiq nuqtadan o‘tuvchi parabola amalga oshirilmagan.

intersection-too-many-items = Ikkitadan ortiq obyektning kesishmasi amalga oshirilmagan

## Other math components

ionic-compound-not-two-ions = Ikki iondan boshqa ion birikmalari amalga oshirilmagan.

ionic-compound-needs-cation-and-anion = Ion birikmalari faqat bitta kation va bitta anion uchun amalga oshirilgan.

solve-equations-cannot-evaluate = Tenglamani yechib bo‘lmaydi, chunki uni hisoblab bo‘lmadi: { $equation }

math-operators-operand-number-required = Matematik operandni ajratib olish uchun operandNumber berilishi kerak.

eigen-decomposition-failed = Matritsaning xos qiymatlarini hisoblab bo‘lmadi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } parametri shablonda uchramaydi, shuning uchun u doim bo‘sh qiymatga mos keladi.
       *[other] `<matchesPattern>`: { $parameters } parametrlari shablonda uchramaydi, shuning uchun ular doim bo‘sh qiymatga mos keladi.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" qiymatini talqin qilib bo‘lmaydi. U none, medium, dense yoki bo‘sh joy bilan ajratilgan ikki musbat son bo‘lishi kerak, masalan grid="1 0.5". To‘r chizilmaydi.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure tasvirlagichida xLabelPosition="left" qo‘llab-quvvatlanmaydi; o‘ng joylashuv xatti-harakati ishlatiladi.

prefigure-y-label-position-unsupported = `<graph>`: prefigure tasvirlagichida yLabelPosition="bottom" qo‘llab-quvvatlanmaydi; yuqori joylashuv xatti-harakati ishlatiladi.

prefigure-invalid-axis-bounds = `<graph>`: prefigure o‘girishi uchun o‘qlarning chegaralari yaroqsiz; standart bbox (-10,-10,10,10) ishlatiladi.

prefigure-invalid-width = `<graph>`: prefigure o‘girishi uchun en yaroqsiz; diagrammaning standart eni 425 ishlatiladi.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure o‘girishi uchun aspectRatio yaroqsiz; standart tomonlar nisbati 1 ishlatiladi.

prefigure-grid-spacing-too-fine = `<graph>`: to‘r qadami o‘qlarning chegaralari uchun juda mayda; prefigure tasvirlagichida to‘r tashlab ketiladi.

prefigure-annotations-not-rendered = `<graph>`: PreFigure tasvirlagichi ishlatilmaganda izohlar chizilmaydi.

multiple-annotations-children = `<graph>` ichida bir nechta `<annotations>` avlodi topildi; oxirgisidan boshqasi e’tiborga olinmaydi.

## Referring to other components

copy-unrecognized-component-type = Tanilmagan komponent turini kengaytirib yoki nusxalab bo‘lmaydi: { $type }.

copy-prop-not-found = { $component } turidagi komponentda { $property } xossasi topilmadi

collect-no-source = collect uchun manba topilmadi.

collect-invalid-component-type = `<{ $component }>` turidagi komponentlarni to‘plab bo‘lmaydi, chunki bu yaroqsiz komponent turi.

reference-index-unavailable = `{ $reference }` indeksiga havola qilib bo‘lmaydi

## `<callAction>`

component-action-unavailable = `{ $reference }` komponentida { $action } chaqirib bo‘lmaydi

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ma’lumotlarning shakli yaroqsiz. Qatorlarning uzunliklari har xil. Topildi componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Ma’lumotlarda takrorlanuvchi ustun nomlari bor. Topildi componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ma’lumotlarda ustun nomi yetishmaydi. Topildi componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Bu javobning award qiymati answer tegining o‘z yuborilgan javobiga asoslangan, bu esa kutilmagan xatti-harakatga olib keladi.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` bor konteyner ichidagi `<answer>` elementiga `maxNumAttempts` qo‘yish ta’sir qilmaydi, chunki urinishlar sonini konteyner belgilaydi. `maxNumAttempts` qiymatini konteynerga qo‘ying.

nested-section-wide-check-work-max-num-attempts = Boshqa `sectionWideCheckWork` konteyneri ichida turgan `sectionWideCheckWork` konteyneriga `maxNumAttempts` qo‘yish ta’sir qilmaydi, chunki urinishlar sonini tashqi konteyner belgilaydi. `maxNumAttempts` qiymatini tashqi konteynerga qo‘ying.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality qo‘yilmasa, { $attributes } atributi hech narsaga ta’sir qilmaydi.
       *[other] symbolicEquality qo‘yilmasa, { $attributes } atributlari hech narsaga ta’sir qilmaydi.
    }

answer-invalid-type = answer uchun yaroqsiz tur: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` komponentining nomi yo‘qligi sababli uni modul atributi sifatida ishlatib bo‘lmaydi

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` komponentini modul atributi sifatida ishlatib bo‘lmaydi, chunki `<module>` komponent turida «{ $name }» atributi allaqachon aniqlangan.

conditional-content-condition-ignored = case yoki else avlodlari bor `<conditionalContent>` komponentida `condition` atributi e’tiborga olinmaydi.

slider-markers-type-mismatch = Markerlarning turi surgichning turiga mos kelmaydi.

pretzel-problem-needs-statement-and-answer = Yaroqsiz pretzel: har bir `<problem>` bitta `<statement>` va bitta `<answer>` ni o‘z ichiga olishi kerak.

pretzel-circuit-first-problem-distractor = Yaroqsiz pretzel: mode="circuit" rejimida birinchi `<problem>` chalg‘ituvchi bo‘la olmaydi.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` atributi uchun yaroqsiz qiymat { $values }; e’tiborga olinmaydi.
       *[other] `{ $attribute }` atributi uchun yaroqsiz qiymatlar { $values }; e’tiborga olinmaydi.
    }

attribute-must-be-references = `{ $attribute }` atributi uchun yaroqsiz qiymat `{ $value }`. Atribut `$` belgisi bilan boshlanadigan havolalardan iborat bo‘lishi kerak.

math-input-invalid-function-names = <mathInput>: { $attribute } ichidagi yaroqsiz funksiya nomlari e’tiborga olinmadi: { $names }. Har bir nomning ko‘rsatiladigan qismi kamida 2 belgi bo‘lishi kerak (harflar yoki chiziqchalar); undan keyin ixtiyoriy `|<mathspeak muqobil>` qo‘shimchasi kelishi mumkin.

## Building components from the source

component-type-invalid = Yaroqsiz komponent turi: `<{ $componentType }>`

attribute-repeated = { $attribute } atributini takrorlab bo‘lmaydi.

attribute-invalid-for-component = `<{ $componentType }>` turidagi komponent uchun yaroqsiz atribut «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } uslub ta’rifida { $context ->
        [text-on-background] matn rangi bilan fon rangi
        [high-contrast] yuqori kontrastli rang bilan kanvas
        [line] chiziq rangi bilan kanvas
        [marker] marker rangi bilan kanvas
       *[text-on-canvas] matn rangi bilan kanvas
    } orasidagi kontrast yetarli emas{ $mode ->
        [dark] { " (qorong‘i mavzu)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kamida { $threshold }:1 talab qilinadi).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } uslub ta’rifida berilgan ranglar yorug‘ mavzu uchun yetarli kontrast bersa-da, ulardan olingan qorong‘i mavzu ranglari matn bilan fon orasida yetarli kontrast bermaydi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kamida { $threshold }:1 talab qilinadi). { $suggestion ->
        [available] Qorong‘i mavzuda yetarli kontrast uchun yo yorug‘ mavzudagi kontrastni oshiring (masalan { $lightAttribute }="{ $lightColor }"), yo qorong‘i mavzu rangini almashtiring (masalan { $darkAttribute }="{ $darkColor }").
       *[none] Qorong‘i mavzuda yetarli kontrast uchun yorug‘ mavzudagi kontrastni oshiring yoki olingan ranglarni textColorDarkMode va/yoki backgroundColorDarkMode bilan almashtiring.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } uslub ta’rifida berilgan matn rangi yorug‘ mavzu uchun yetarli kontrast bersa-da, undan olingan qorong‘i mavzu matn rangi kanvas bilan yetarli kontrast bermaydi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kamida { $threshold }:1 talab qilinadi). { $suggestion ->
        [available] Qorong‘i mavzuda yetarli kontrast uchun yo yorug‘ mavzudagi kontrastni oshiring (masalan textColor="{ $lightColor }"), yo qorong‘i mavzu rangini almashtiring (masalan textColorDarkMode="{ $darkColor }").
       *[none] Qorong‘i mavzuda yetarli kontrast uchun yorug‘ mavzudagi kontrastni oshiring yoki olingan rangni textColorDarkMode bilan almashtiring.
    }

section-multiple-style-palettes = Bo‘lim faqat bitta <stylePalette> tanlay oladi; oxirgisi ishlatiladi.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } uchun noyob variantlarni aniqlab bo‘lmaydi, chunki numToSelect manfiy bo‘lmagan butun son emas.

variant-num-to-select-not-constant-number = { $component } uchun noyob variantlarni aniqlab bo‘lmaydi, chunki numToSelect o‘zgarmas son emas.

variant-with-replacement-not-constant-boolean = { $component } uchun noyob variantlarni aniqlab bo‘lmaydi, chunki withReplacement o‘zgarmas mantiqiy qiymat emas.

variant-select-weight-disables-unique = biror variantda selectWeight yoki selectForVariants berilgan bo‘lsa, select uchun noyob variantlar o‘chiriladi

variant-coprime-undetermined = { $component } uchun noyob variantlarni aniqlab bo‘lmaydi, chunki coprime doim yolg‘on ekanini aniqlab bo‘lmaydi.

variant-attribute-not-constant = { $component } uchun noyob variantlarni aniqlab bo‘lmaydi, chunki { $attribute } o‘zgarmas emas.

variant-attribute-not-number = { $component } uchun noyob variantlarni aniqlab bo‘lmaydi, chunki { $attribute } son emas.

variant-attribute-wrong-type-for-sequence =
    { $type } turidagi { $component } uchun noyob variantlarni aniqlab bo‘lmaydi, chunki { $attribute } { $expected ->
        [letters-combination] harflar birikmasi
        [math-expression] yaroqli matematik ifoda
        [integer] butun son
       *[number] son
    } emas.

variant-length-not-integer = { $component } uchun noyob variantlarni aniqlab bo‘lmaydi, chunki length butun son emas.

variant-sort-not-implemented = sort bor { $component } uchun noyob variantlar amalga oshirilmagan

variant-exclude-combinations-not-implemented = excludeCombinations bor { $component } uchun noyob variantlar amalga oshirilmagan

variant-math-exclude-not-implemented = exclude bor math turidagi { $component } uchun noyob variantlar amalga oshirilmagan

variant-non-constant-exclude-not-implemented = o‘zgarmas bo‘lmagan exclude bor { $component } uchun noyob variantlar amalga oshirilmagan

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: grafikning prefigure tasvirlagichida qo‘llab-quvvatlanmaydi; avlod tashlab ketildi.

prefigure-descendant-invalid-geometry = { $subject }: cheksiz yoki to‘liq bo‘lmagan geometriya; avlod tashlab ketildi.

prefigure-curve-label-omitted = { $subject }: o‘girilgan egri elementlarida yorliqlar qo‘llab-quvvatlanmaydi; yorliq tashlab ketildi.

prefigure-curve-unsupported-definition-type = { $subject }: qo‘llab-quvvatlanmaydigan egri funksiya ta’rifi turi «{ $definitionType }»; avlod tashlab ketildi.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves elementidagi flipFunctions atributi qo‘llab-quvvatlanmaydi; avlod tashlab ketildi.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves faqat formula bilan berilgan avlod funksiyalarni qo‘llab-quvvatlaydi; avlod tashlab ketildi.

prefigure-label-position-unsupported =
    { $subject }: qo‘llab-quvvatlanmaydigan labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] chiziqlar oilasi yorlig‘i uchun
       *[point] nuqta yorlig‘i uchun
    }; PreFigure standart tekislashi ishlatiladi.

prefigure-fill-style-unsupported = { $subject }: to‘ldirish uslubi «{ $fillStyle }» PreFigure tomonidan qo‘llab-quvvatlanmaydi; yaxlit to‘ldirishga o‘tiladi.

prefigure-line-style-unknown = { $subject }: noma’lum chiziq uslubi «{ $lineStyle }» PreFigure chiqishidan olib tashlandi.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker uslubi «{ $markerStyle }» PreFigure «diamond» uslubiga moslashtirildi.

prefigure-marker-style-unsupported = { $subject }: marker uslubi «{ $markerStyle }» PreFigure tomonidan qo‘llab-quvvatlanmaydi; standart uslub ishlatiladi.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: yaroqsiz `ref`; nishonni bog‘lab bo‘lmaydi. Izoh tashlab ketildi.

annotation-ref-multiple-targets = `<annotation>`: `ref` bir nechta nishon bilan bog‘landi; birinchisi ishlatiladi.

annotation-ref-outside-graph = `<annotation>`: yaroqsiz `ref`; nishon uni o‘z ichiga olgan grafikdan tashqarida. Izoh tashlab ketildi.

annotation-ref-unsupported-target = `<annotation>`: yaroqsiz `ref`; nishon prefigure o‘girishida qo‘llab-quvvatlanadigan grafik obyekt emas. Izoh tashlab ketildi.

annotation-text-missing = `<annotation>`: `text` yo‘q yoki bo‘sh; bo‘sh matn chiqariladi.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Aylanma bog‘liqlik aniqlandi.
       *[other] `<{ $componentType }>` komponentini o‘z ichiga olgan aylanma bog‘liqlik aniqlandi.
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

parse-tag-missing-close-tag = Yaroqsiz DoenetML: `{ $tag }` tegining yopuvchi tegi yo‘q. O‘zi yopiladigan teg yoki `</{ $tagName }>` tegi kutilgan edi.

parse-tag-error = Yaroqsiz DoenetML: `<{ $tagName }>` tegida xato

parse-attribute-missing-value = Yaroqsiz DoenetML: `{ $attribute }` atributida qiymat yetishmayotganga o‘xshaydi.

parse-attribute-invalid = Yaroqsiz DoenetML: yaroqsiz atribut `{ $attribute }`

parse-attribute-value-invalid = Yaroqsiz DoenetML: yaroqsiz atribut qiymati `{ $value }`

parse-attribute-value-quote-mismatch = Yaroqsiz DoenetML: yaroqsiz atribut qiymati `{ $value }`. Qo‘shtirnoqlar mos kelmaydi. `{ $quote }` yetishmayotganga o‘xshaydi

parse-open-tag-name-missing = Yaroqsiz DoenetML: nomsiz teg topildi, masalan `<`

parse-tag-not-closed = Yaroqsiz DoenetML: `{ $tag }` tegi yopilmagan (`>` yetishmayotganga o‘xshaydi).

parse-self-closing-tag-name-missing = Yaroqsiz DoenetML: nomsiz teg topildi `<{ $content }>`

parse-self-closing-tag-not-closed = Yaroqsiz DoenetML: `{ $tag }` tegi yopilmagan (`/>` yetishmayotganga o‘xshaydi).

parse-tag-invalid-attributes = Yaroqsiz DoenetML: `{ $tag }` tegi yaroqli emas. Uning atributlari noto‘g‘ri bo‘lishi mumkin.

parse-close-tag-name-missing = Yaroqsiz DoenetML: nomsiz yopuvchi teg topildi, masalan `</`

parse-attribute-value-unquoted = Atribut qiymatlari qo‘shtirnoq ichida bo‘lishi kerak: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Yaroqsiz DoenetML: `{ $tag }` yopuvchi tegi topildi, lekin unga mos ochuvchi teg yo‘q

parse-close-tag-mismatched = Yaroqsiz DoenetML: mos kelmaydigan yopuvchi teg. `</{ $expected }>` kutilgan edi. `{ $found }` topildi

parser-node-unconvertible = { $node } tugunini Dast tuguniga o‘girib bo‘lmadi.

## Names

name-attribute-invalid =
    Yaroqsiz atribut name='{ $name }'. { $reason ->
        [characters] Nomlarda faqat harflar, raqamlar, pastki chiziqlar yoki chiziqchalar bo‘lishi mumkin.
       *[start] Nomlar harf bilan boshlanishi kerak.
    }

component-name-invalid-start = Yaroqsiz komponent nomi «{ $name }». Nomlar harf bilan boshlanishi kerak.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched turidagi answer-ning video atributi bo‘lishi kerak

answer-video-watched-video-not-reference = videoWatched turidagi answer-ning video atributi havola bo‘lishi kerak

answer-name-not-single-text = answer-ning name atributida aynan bitta matnli avlod bo‘lishi kerak

## Referencing another document

external-doenetml-recursion-limit = Rekursiya darajalari juda ko‘p bo‘lgani uchun tashqi DoenetML olinmadi. Aylanma havola yo‘qmi?

external-doenetml-unavailable = { $attribute }="{ $uri }" manzilidan DoenetML olinmadi

external-doenetml-type-mismatch = { $attribute }="{ $uri }" manzilidan yaroqsiz DoenetML olindi: u «{ $componentType }» komponent turiga mos kelmadi

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` atributi eskirgan; uning o‘rniga `{ $to }` ishlating.
       *[other] [deprecation] `<{ $component }>` elementidagi `{ $from }` atributi eskirgan; uning o‘rniga `{ $to }` ishlating.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` atributi eskirgan va e’tiborga olinmaydi, chunki `{ $to }` ham berilgan.
       *[other] [deprecation] `<{ $component }>` elementidagi `{ $from }` atributi eskirgan va e’tiborga olinmaydi, chunki `{ $to }` ham berilgan.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` elementidagi `{ $attribute }` atributi eskirgan va e’tiborga olinmaydi.


## Language coverage

pluralize-english-only = `<pluralize>` faqat ingliz tilida ko‘plik yasay oladi, shuning uchun { $locale } tilida yozilgan hujjatda uning matni o‘zgarishsiz qoladi. Ko‘plik shaklini o‘zingiz yozing yoki `pluralForm` atributi bilan bering.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` elementi tanilgan Doenet elementi emas.

schema-element-not-allowed-at-root = `<{ $tag }>` elementiga hujjatning ildizida ruxsat berilmaydi.

schema-element-not-allowed-inside = `<{ $tag }>` elementiga `<{ $parent }>` ichida ruxsat berilmaydi.

schema-attribute-unrecognized = `<{ $tag }>` elementida `{ $attribute }` nomli atribut yo‘q.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` elementining `{ $attribute }` atributi har bir elementi quyidagilardan biri bo‘lgan ro‘yxat bo‘lishi kerak: { $allowed }
       *[other] `<{ $tag }>` elementining `{ $attribute }` atributi quyidagilardan biri bo‘lishi kerak: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select uchun yaroqsiz variant nomi. { $variantName } variant nomi { $numOptions } variantda uchraydi, tanlanadigan son esa { $numToSelect }.

select-variant-name-without-options = select uchun variantlar berilgan, lekin mumkin bo‘lgan variant nomi uchun birorta tanlov yo‘q: { $variantName }.

select-variant-name-not-possible = select uchun berilgan { $variantName } variant nomi mumkin bo‘lgan variant nomi emas.

select-too-few-options = Bor-yo‘g‘i { $numOptions } ichidan { $numToSelect } komponentni tanlab bo‘lmaydi.

select-from-sequence-too-few-values = Uzunligi { $length } ketma-ketlikdan { $numToSelect } qiymatni tanlab bo‘lmaydi.

select-from-sequence-indices-count-mismatch = select uchun berilgan indekslar soni tanlanadigan songa mos kelishi kerak

select-from-sequence-indices-not-integers = select uchun berilgan barcha indekslar butun son bo‘lishi kerak

select-from-sequence-index-excluded = selectfromsequence uchun berilgan indeks chiqarib tashlangan edi

select-from-sequence-indices-excluded-combination = selectfromsequence uchun berilgan indekslar chiqarib tashlangan birikma edi

select-from-sequence-coprime-not-positive-integers = Musbat butun sonlar tanlanmagani uchun o‘zaro tub birikmalarni tanlab bo‘lmaydi.

select-from-sequence-coprime-common-factor = O‘zaro tub sonlarni tanlab bo‘lmaydi. Barcha mumkin bo‘lgan qiymatlarning umumiy bo‘luvchisi bor. (Berilgan "from" yoki "to" qiymatlari "step" bilan o‘zaro tub bo‘lishi kerak.)

select-from-sequence-coprime-single-number = 1 dan boshqa yagona sondan o‘zaro tub birikmalarni tanlab bo‘lmaydi.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ichida birikmalarning 70% dan ortig‘i chiqarib tashlangan

select-from-sequence-coprime-none-found = O‘zaro tub sonlarni tanlab bo‘lmadi. Barcha mumkin bo‘lgan qiymatlarning umumiy bo‘luvchisi bor.

select-from-sequence-too-few-unique-values = Uzunligi { $numPossibleValues } ketma-ketlikdan { $numToSelect } har xil qiymatni tanlab bo‘lmaydi

select-prime-numbers-too-few-values = Uzunligi { $numValues } tub sonlar ro‘yxatidan { $numToSelect } qiymatni tanlab bo‘lmaydi

select-prime-numbers-values-count-mismatch = select uchun berilgan qiymatlar soni tanlanadigan songa mos kelishi kerak

select-prime-numbers-values-not-prime = select prime number uchun berilgan barcha qiymatlar tub sonlar ro‘yxatida bo‘lishi kerak

select-prime-numbers-values-excluded-combination = selectPrimeNumbers uchun berilgan qiymatlar chiqarib tashlangan birikma edi

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ichida birikmalarning 70% dan ortig‘i chiqarib tashlangan

select-random-combination-fluke = Nihoyatda ehtimoldan yiroq tasodif tufayli tasodifiy qiymatlar birikmasini tanlab bo‘lmadi

select-random-value-fluke = Nihoyatda ehtimoldan yiroq tasodif tufayli tasodifiy qiymatni tanlab bo‘lmadi
