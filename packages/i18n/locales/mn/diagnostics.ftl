# Mongolian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Mongolian counts in the same two categories English does, so every selection
# below keeps both branches — but a noun after a numeral stays singular, so the
# two usually differ only in the number they print.
#
# Mongolian marks case with a suffix, and the suffix harmonizes with the vowels
# of the word it lands on — so it can never be welded to a placeable, whose
# value this catalog never sees. Every case ending below therefore sits on a
# noun this file writes itself: «бүрэлдэхүүн» for a component or tag name,
# «үйлдэл» for an action, «атрибут» for an attribute, «утга» for a value,
# «сонголт» for an option. The ordinal «-р» is the one exception, and only
# because it is invariant and lands on a number.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] хоёр төгсгөлийн цэг хоёулаа өгөгдсөн үед { $attributes } тооцогдохгүй
       *[other] хоёр төгсгөлийн цэг хоёулаа өгөгдсөн үед { $attributes } тооцогдохгүй
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] төгсгөлийн цэг ба дунд цэг хоёулаа өгөгдсөн үед { $attributes } тооцогдохгүй
       *[other] төгсгөлийн цэг ба дунд цэг хоёулаа өгөгдсөн үед { $attributes } тооцогдохгүй
    }

line-segment-midpoint-offset-without-midpoint = дунд цэггүйгээр midpointOffset нөлөөлөхгүй

## `<line>`

line-points-undetermined-dimensions = Хэмжээс нь тодорхойгүй цэгүүдээр дайрсан шулуун.

line-points-too-few-dimensions = Шулуун нь дор хаяж хоёр хэмжээст цэгүүдээр дайрах ёстой.

line-points-depend-on-variables = Шулуун нь хувьсагчдаас хамаарах цэгүүдээр дайрч байна: { $variables }.

line-equation-invalid-format = { $variable1 } ба { $variable2 } хувьсагчид дахь шулууны тэгшитгэлийн буруу хэлбэр.

## `<ray>`

ray-overprescribed-through = Цацраг нь through, endpoint болон direction-оор өгөгдсөн. Өгөгдсөн through тооцогдохгүй.

ray-dimension-mismatch = цацраг дахь numDimensions таарахгүй байна.

## `<vector>`

vector-overprescribed-head = Вектор нь head, tail болон displacement-ээр өгөгдсөн. Өгөгдсөн head тооцогдохгүй.

vector-dimension-mismatch = вектор дахь numDimensions таарахгүй байна.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` бүрэлдэхүүнд татах боломжгүй, учир нь түүнд nearestPoint төлөвийн хувьсагч алга.

constrain-to-without-nearest-point = `<{ $component }>` бүрэлдэхүүнээр хязгаарлах боломжгүй, учир нь түүнд nearestPoint төлөвийн хувьсагч алга.

constrain-to-interior-without-nearest-point = `<{ $component }>` бүрэлдэхүүний дотор талаар хязгаарлах боломжгүй, учир нь түүнд nearestPoint төлөвийн хувьсагч алга.

## `<choiceInput>`

choice-input-label-position-ignored = мөр дотор биш choiceInput-д labelPosition тооцогдохгүй

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-д өгсөн индексүүд тооцогдохгүй, учир нь тэдгээрийн тоо choice хүү элементүүдийн тоотой таарахгүй байна.

pretzel-indices-count-mismatch = problem-д өгсөн индексүүд тооцогдохгүй, учир нь тэдгээрийн тоо problem хүү элементүүдийн тоотой таарахгүй байна.

shuffle-indices-count-mismatch = shuffle-д өгсөн индексүүд тооцогдохгүй, учир нь тэдгээрийн тоо бүрэлдэхүүнүүдийн тоотой таарахгүй байна.

indices-ignored-out-of-range = { $component } бүрэлдэхүүнд өгсөн индексүүд тооцогдохгүй, учир нь зарим нь мужаас гадуур байна.

pretzel-indices-repeated = pretzel-д өгсөн индексүүд тооцогдохгүй, учир нь зарим нь давтагдаж байна.

pretzel-circuit-first-index = circuit горимд pretzel-д өгсөн индексүүд тооцогдохгүй, учир нь эхний индекс 1 байх ёстой.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текст хүү элементүүдтэй ажиллахын тулд `type` атрибутыг заах ёстой.

invalid-type-defaulting-to-math = { $component } бүрэлдэхүүнд буруу төрөл { $type }. Энэ нь math, text, number эсвэл boolean байх ёстой. math ашиглагдана.

string-not-valid-component-to-arrange = «{ $value }» мөр нь { $component } үйлдэлд тохирох бүрэлдэхүүн биш. Тооцогдохгүй.

## Types and variables

invalid-type-defaulting-to-number = Буруу төрөл { $type }, төрлийг number болгож тохируулав.

invalid-variable-value = Хувьсагчийн буруу утга: `{ $value }`

## Variants

variant-index-must-be-number = Хувилбарын индекс { $index } тоо байх ёстой

variant-index-must-be-integer = Хувилбарын индекс { $index } бүхэл тоо байх ёстой

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` нь үнэмлэхүй хэмжээст зориулж хэрэгжүүлэгдээгүй. Өргөнүүд харьцангуй болно.

side-by-side-absolute-margins = `<{ $component }>` нь үнэмлэхүй хэмжээст зориулж хэрэгжүүлэгдээгүй. Захын зайнууд харьцангуй болно.

side-by-side-no-block-child = Буруу `<{ $component }>`: түүнд дор хаяж нэг блок хүү элемент байх ёстой.

## `<label>`

label-for-ignored-on-graphical = График `<label>` дээрх `for` атрибут тооцогдохгүй.

label-for-must-resolve-to-one = `<label>` дээрх `for` атрибут яг нэг бүрэлдэхүүнийг заах ёстой.

label-for-unresolved = `<label>` дээрх `for` атрибутыг бүрэлдэхүүнтэй холбож чадсангүй.

label-for-answer-with-authored-inputs = `<label>` дээрх `for` атрибут нь зохиогчийн бичсэн оруулах талбартай `<answer>`-ийг зааж байна; талбарыг шууд заана уу.

label-for-answer-without-input = `<label>` дээрх `for` атрибут нь шошголох оруулах талбаргүй `<answer>`-ийг зааж байна.

label-for-must-reference-input-or-answer = `<label>` дээрх `for` атрибут нь оруулах талбар эсвэл хариултыг заах ёстой.

## Accessibility

accessibility-short-description-or-decorative = Хүртээмжийн үүднээс `<{ $component }>` нь богино тайлбартай байх, эсвэл чимэглэл гэж заагдсан байх ёстой.

accessibility-video-short-description = Хүртээмжийн үүднээс `<video>` нь богино тайлбартай байх ёстой.

accessibility-input-short-description-or-label = Хүртээмжийн үүднээс `<{ $component }>` нь богино тайлбар эсвэл шошготой байх ёстой.

accessibility-answer-input-short-description-or-label = Хүртээмжийн үүднээс оруулах талбар үүсгэдэг `<answer>` нь богино тайлбар эсвэл шошготой байх ёстой.

accessibility-short-description-contains-math = Богино тайлбарт `<{ $component }>` мэт математик бүрэлдэхүүн байх ёсгүй. Математикийг үгээр бичнэ үү.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } нь бүлгийн гарчгийн текстэд хангалттай тодрол өгөхгүй байна (харанхуй горим) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; дор хаяж { $threshold }:1 шаардлагатай).
       *[other] { $colorName } нь бүлгийн гарчгийн текстэд хангалттай тодрол өгөхгүй байна ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; дор хаяж { $threshold }:1 шаардлагатай).
    }

## `<circle>`

circle-through-points-non-numerical = Цэгүүд тоон утгагүй үед { $count } цэгээр дайрсан `<circle>` хэрэгжүүлэгдээгүй.

circle-too-many-through-points = 3-аас олон цэгээр дайрсан тойргийг тооцоолох боломжгүй.

circle-overprescribed-radius-center-points = Өгөгдсөн радиус, төв ба цэгүүдтэй тойргийг тооцоолох боломжгүй.

circle-center-with-multiple-points = Өгөгдсөн төвтэй, 1-ээс олон цэгээр дайрсан тойргийг тооцоолох боломжгүй.

circle-radius-too-small = Тойргийг тооцоолох боломжгүй: хоёр цэгийн хоорондох зай { $distance } тул өгөгдсөн радиус { $radius } хэтэрхий бага байна.

circle-radius-with-many-points = Өгөгдсөн радиустай, хоёроос олон цэгээр дайрсан тойрог үүсгэх боломжгүй.

circle-invalid-center-or-through-points = Тойргийн төв эсвэл цэгүүд буруу.

circle-radius-center-with-multiple-points = Өгөгдсөн төвтэй, 1-ээс олон цэгээр дайрсан тойргийн радиусыг тооцоолох боломжгүй.

circle-change-radius-non-numerical = Тоон бус цэгүүдтэй тойргийн радиусыг өөрчлөх боломжгүй

circle-radius-with-points-non-numerical = Тоон утга байхгүй үед өгөгдсөн радиустай, нэгээс олон цэгээр дайрсан тойрог үүсгэх боломжгүй.

circle-change-center-non-numerical = Тоон бус цэгүүдээр дайрсан тойргийн төвийг өөрчлөх нь хэрэгжүүлэгдээгүй.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцийн тодорхойлогдох мужийн хэмжээс хангалтгүй. Мужид { $intervals } завсар байгаа бол функцид { $inputs ->
            [one] { $inputs } оролт
           *[other] { $inputs } оролт
        } байна.
       *[other] Функцийн тодорхойлогдох мужийн хэмжээс хангалтгүй. Мужид { $intervals } завсар байгаа бол функцид { $inputs ->
            [one] { $inputs } оролт
           *[other] { $inputs } оролт
        } байна.
    }

function-domain-invalid-format = Функцийн тодорхойлогдох мужийн буруу хэлбэр.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцийн тоон бус максимумыг тооцохгүй.
        [minimum] Функцийн тоон бус минимумыг тооцохгүй.
        [extremum] Функцийн тоон бус экстремумыг тооцохгүй.
        [point] Функцийн тоон бус цэгийг тооцохгүй.
        [slope] Функцийн тоон бус налууг тооцохгүй.
       *[other] Функцийн тоон бус { $type } утгыг тооцохгүй.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцийн хоосон максимумыг тооцохгүй.
        [minimum] Функцийн хоосон минимумыг тооцохгүй.
        [extremum] Функцийн хоосон экстремумыг тооцохгүй.
        [point] Функцийн хоосон цэгийг тооцохгүй.
       *[other] Функцийн хоосон { $type } утгыг тооцохгүй.
    }

function-points-too-close = Функцид хоорондоо хэт ойрхон хоёр цэг байна. Функцийг тодорхойлох боломжгүй.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функцийн давталт нь оролтын тоо гаралтын тоотой тэнцүү үед л боломжтой. Энэ функцид { $inputs } оролт ба { $outputs ->
            [one] { $outputs } гаралт
           *[other] { $outputs } гаралт
        } байна.
       *[other] Функцийн давталт нь оролтын тоо гаралтын тоотой тэнцүү үед л боломжтой. Энэ функцид { $inputs } оролт ба { $outputs ->
            [one] { $outputs } гаралт
           *[other] { $outputs } гаралт
        } байна.
    }

## `<sequence>`

sequence-invalid-length = Дарааллын урт буруу байна. Энэ нь сөрөг бус бүхэл тоо байх ёстой.

sequence-invalid-step = Дарааллын алхам буруу байна. { $type } төрлийн дарааллын хувьд энэ нь тоо байх ёстой.

sequence-invalid-endpoint-number = Тоон дарааллын «{ $attribute }» утга буруу байна. Энэ нь тоо байх ёстой.

sequence-invalid-endpoint-letters = Үсгэн дарааллын «{ $attribute }» утга буруу байна. Энэ нь үсгүүдийн хослол байх ёстой.

sequence-invalid-endpoint = Дарааллын «{ $attribute }» утга буруу байна.

select-from-sequence-coprime-not-numbers = тоо сонгогдохгүй тул coprime тооцогдохгүй

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations заагдсан тул coprime тооцогдохгүй

## Resolving a `target`

target-not-found = `<{ $source }>` бүрэлдэхүүнд буруу target: бай олдсонгүй.

target-state-variable-not-found = `<{ $source }>` бүрэлдэхүүнд буруу target: `<{ $component }>` дээр «{ $property }» нэртэй төлөвийн хувьсагч олдсонгүй.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-ийн хувьсагчид үл хамаарах хувьсагчаас ялгаатай байх ёстой.

ode-system-duplicate-variable-names = Хамаарах хувьсагчдын давхардсан нэрсээр дифференциал тэгшитгэлийн баруун талын функцүүдийг тодорхойлох боломжгүй.

ode-system-rhs-function-error = дифференциал тэгшитгэлийн баруун талын функцийг тодорхойлох боломжгүй. mathjs функц үүсгэхэд алдаа гарлаа.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } шулууны хоорондох өнцгийг тодорхойлох боломжгүй

angle-invalid-through-point = `<angle>`-ийн through дотор буруу цэг

parabola-vertex-too-many-points = Өгөгдсөн оройтой, 1-ээс олон цэгээр дайрсан парабол хэрэгжүүлэгдээгүй.

parabola-too-many-points = 3-аас олон цэгээр дайрсан парабол хэрэгжүүлэгдээгүй.

intersection-too-many-items = Хоёроос олон объектын огтлолцол хэрэгжүүлэгдээгүй

## Other math components

ionic-compound-not-two-ions = Хоёр ионоос бусад ионы нэгдэл хэрэгжүүлэгдээгүй.

ionic-compound-needs-cation-and-anion = Ионы нэгдэл зөвхөн нэг катион ба нэг анионд хэрэгжүүлэгдсэн.

solve-equations-cannot-evaluate = Тэгшитгэлийг бодох боломжгүй, учир нь түүнийг тооцоолж чадсангүй: { $equation }

math-operators-operand-number-required = Математик операндыг ялгахын тулд operandNumber-ийг заах ёстой.

eigen-decomposition-failed = Матрицын хувийн утгуудыг тооцоолж чадсангүй

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр загварт таарахгүй тул тэр үргэлж хоосонтой тохирно.
       *[other] `<matchesPattern>`: { $parameters } параметрүүд загварт таарахгүй тул тэдгээр үргэлж хоосонтой тохирно.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" утгыг тайлбарлах боломжгүй. Энэ нь none, medium, dense эсвэл хоосон зайгаар тусгаарласан хоёр эерэг тоо байх ёстой, жишээ нь grid="1 0.5". Тор зурагдахгүй.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure дүрслэгчид xLabelPosition="left" дэмжигдэхгүй; баруун байрлалын үйлдэл хэрэглэгдэнэ.

prefigure-y-label-position-unsupported = `<graph>`: prefigure дүрслэгчид yLabelPosition="bottom" дэмжигдэхгүй; дээд байрлалын үйлдэл хэрэглэгдэнэ.

prefigure-invalid-axis-bounds = `<graph>`: prefigure хөрвүүлэлтэд тэнхлэгийн хязгаар буруу; анхны bbox (-10,-10,10,10) хэрэглэгдэнэ.

prefigure-invalid-width = `<graph>`: prefigure хөрвүүлэлтэд өргөн буруу; диаграммын анхны өргөн 425 хэрэглэгдэнэ.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure хөрвүүлэлтэд aspectRatio буруу; анхны талын харьцаа 1 хэрэглэгдэнэ.

prefigure-grid-spacing-too-fine = `<graph>`: торны алхам тэнхлэгийн хязгаарт хэт нарийн; prefigure дүрслэгчид тор орхигдоно.

prefigure-annotations-not-rendered = `<graph>`: PreFigure дүрслэгч ашиглагдаагүй үед тайлбарууд зурагдахгүй.

multiple-annotations-children = `<graph>` дотор хэд хэдэн `<annotations>` хүү элемент олдлоо; сүүлчийнхээс бусад нь тооцогдохгүй.

## Referring to other components

copy-unrecognized-component-type = Танигдаагүй бүрэлдэхүүний төрлийг өргөтгөх буюу хуулах боломжгүй: { $type }.

copy-prop-not-found = { $component } төрлийн бүрэлдэхүүнээс { $property } шинж олдсонгүй

collect-no-source = collect-д эх сурвалж олдсонгүй.

collect-invalid-component-type = `<{ $component }>` төрлийн бүрэлдэхүүнүүдийг цуглуулах боломжгүй, учир нь энэ нь буруу бүрэлдэхүүний төрөл.

reference-index-unavailable = `{ $reference }` индексийг лавлах боломжгүй

## `<callAction>`

component-action-unavailable = `{ $reference }` бүрэлдэхүүн дээр { $action } үйлдлийг дуудах боломжгүй

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Өгөгдлийн хэлбэр буруу. Мөрүүдийн урт өөр өөр байна. componentIdx :{ $componentIdx } дотор олдлоо

data-frame-duplicate-column-names = Өгөгдөлд давхардсан баганын нэр байна. componentIdx :{ $componentIdx } дотор олдлоо

data-frame-missing-column-name = Өгөгдөлд баганын нэр дутуу байна. componentIdx :{ $componentIdx } дотор олдлоо

## `<answer>` and scoring

answer-award-depends-on-own-response = Энэ хариултын award нь answer тагийн өөрийнх нь илгээсэн хариултад тулгуурладаг тул санаанд оромгүй үйлдэлд хүргэнэ.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` бүхий сав доторх `<answer>` дээр `maxNumAttempts` тохируулах нь нөлөөлөхгүй, учир нь оролдлогын тоог сав тодорхойлдог. `maxNumAttempts`-ыг сав дээр тохируулна уу.

nested-section-wide-check-work-max-num-attempts = Өөр `sectionWideCheckWork` савны дотор байгаа `sectionWideCheckWork` сав дээр `maxNumAttempts` тохируулах нь нөлөөлөхгүй, учир нь оролдлогын тоог гадна сав тодорхойлдог. `maxNumAttempts`-ыг гадна сав дээр тохируулна уу.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality тохируулаагүй бол { $attributes } атрибут нөлөөлөхгүй.
       *[other] symbolicEquality тохируулаагүй бол { $attributes } атрибутууд нөлөөлөхгүй.
    }

answer-invalid-type = answer-д буруу төрөл: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` бүрэлдэхүүн нэргүй тул түүнийг модулийн атрибут болгон ашиглах боломжгүй

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` бүрэлдэхүүнийг модулийн атрибут болгон ашиглах боломжгүй, учир нь `<module>` бүрэлдэхүүний төрөлд «{ $name }» атрибут аль хэдийн тодорхойлогдсон.

conditional-content-condition-ignored = case эсвэл else хүү элементтэй `<conditionalContent>` бүрэлдэхүүн дээр `condition` атрибут тооцогдохгүй.

slider-markers-type-mismatch = Маркеруудын төрөл гүйлгэгчийн төрөлтэй таарахгүй байна.

pretzel-problem-needs-statement-and-answer = Буруу pretzel: `<problem>` бүр нэг `<statement>` ба нэг `<answer>` агуулах ёстой.

pretzel-circuit-first-problem-distractor = Буруу pretzel: mode="circuit" горимд эхний `<problem>` сатаагч байж болохгүй.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибутад буруу утга { $values }; тооцогдохгүй.
       *[other] `{ $attribute }` атрибутад буруу утгууд { $values }; тооцогдохгүй.
    }

attribute-must-be-references = `{ $attribute }` атрибутад буруу утга `{ $value }`. Атрибут нь `$`-аар эхэлсэн лавлагаануудаас бүрдэх ёстой.

math-input-invalid-function-names = <mathInput>: { $attribute } доторх буруу функцийн нэрсийг тооцсонгүй: { $names }. Нэр бүрийн харагдах хэсэг дор хаяж 2 тэмдэгт байх ёстой (үсэг эсвэл зураас); ард нь сонголтоор `|<mathspeak хувилбар>` дагавар орж болно.

## Building components from the source

component-type-invalid = Буруу бүрэлдэхүүний төрөл: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутыг давтаж болохгүй.

attribute-invalid-for-component = `<{ $componentType }>` төрлийн бүрэлдэхүүнд буруу атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber }-р загварын тодорхойлолтод { $context ->
        [text-on-background] текстийн өнгө болон дэвсгэрийн өнгөний
        [high-contrast] өндөр тодролтой өнгө болон зурагны талбарын
        [line] шугамын өнгө болон зурагны талбарын
        [marker] маркерын өнгө болон зурагны талбарын
       *[text-on-canvas] текстийн өнгө болон зурагны талбарын
    } хоорондох тодрол хангалтгүй{ $mode ->
        [dark] { " (харанхуй горим)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; дор хаяж { $threshold }:1 шаардлагатай).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber }-р загварын тодорхойлолтод өгөгдсөн өнгөнүүд цайвар горимд хангалттай тодрол өгч байгаа ч тэдгээрээс гаргасан харанхуй горимын өнгөнүүд текст ба дэвсгэрийн хооронд хангалтгүй тодрол өгч байна ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; дор хаяж { $threshold }:1 шаардлагатай). { $suggestion ->
        [available] Харанхуй горимд хангалттай тодрол авахын тулд цайвар горимын тодролыг нэмэгдүүлэх (жишээ нь { $lightAttribute }="{ $lightColor }"), эсвэл харанхуй горимын өнгийг дарж бичнэ үү (жишээ нь { $darkAttribute }="{ $darkColor }").
       *[none] Харанхуй горимд хангалттай тодрол авахын тулд цайвар горимын тодролыг нэмэгдүүлэх, эсвэл гарсан өнгөнүүдийг textColorDarkMode ба/эсвэл backgroundColorDarkMode-оор дарж бичнэ үү.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber }-р загварын тодорхойлолтод өгөгдсөн текстийн өнгө цайвар горимд хангалттай тодрол өгч байгаа ч түүнээс гаргасан харанхуй горимын текстийн өнгө зурагны талбартай хангалтгүй тодрол өгч байна ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; дор хаяж { $threshold }:1 шаардлагатай). { $suggestion ->
        [available] Харанхуй горимд хангалттай тодрол авахын тулд цайвар горимын тодролыг нэмэгдүүлэх (жишээ нь textColor="{ $lightColor }"), эсвэл харанхуй горимын өнгийг дарж бичнэ үү (жишээ нь textColorDarkMode="{ $darkColor }").
       *[none] Харанхуй горимд хангалттай тодрол авахын тулд цайвар горимын тодролыг нэмэгдүүлэх, эсвэл гарсан өнгийг textColorDarkMode-оор дарж бичнэ үү.
    }

section-multiple-style-palettes = Бүлэг зөвхөн нэг <stylePalette> сонгож чадна; сүүлчийнх нь хэрэглэгдэнэ.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } бүрэлдэхүүний давтагдашгүй хувилбаруудыг тодорхойлох боломжгүй, учир нь numToSelect сөрөг бус бүхэл тоо биш.

variant-num-to-select-not-constant-number = { $component } бүрэлдэхүүний давтагдашгүй хувилбаруудыг тодорхойлох боломжгүй, учир нь numToSelect тогтмол тоо биш.

variant-with-replacement-not-constant-boolean = { $component } бүрэлдэхүүний давтагдашгүй хувилбаруудыг тодорхойлох боломжгүй, учир нь withReplacement тогтмол логик утга биш.

variant-select-weight-disables-unique = аль нэг сонголтод selectWeight эсвэл selectForVariants заагдсан бол select-ийн давтагдашгүй хувилбарууд идэвхгүй болно

variant-coprime-undetermined = { $component } бүрэлдэхүүний давтагдашгүй хувилбаруудыг тодорхойлох боломжгүй, учир нь coprime үргэлж худал эсэхийг тогтоох боломжгүй.

variant-attribute-not-constant = { $component } бүрэлдэхүүний давтагдашгүй хувилбаруудыг тодорхойлох боломжгүй, учир нь { $attribute } тогтмол биш.

variant-attribute-not-number = { $component } бүрэлдэхүүний давтагдашгүй хувилбаруудыг тодорхойлох боломжгүй, учир нь { $attribute } тоо биш.

variant-attribute-wrong-type-for-sequence =
    { $type } төрлийн { $component } бүрэлдэхүүний давтагдашгүй хувилбаруудыг тодорхойлох боломжгүй, учир нь { $attribute } нь { $expected ->
        [letters-combination] үсгүүдийн хослол
        [math-expression] зөв математик илэрхийлэл
        [integer] бүхэл тоо
       *[number] тоо
    } биш.

variant-length-not-integer = { $component } бүрэлдэхүүний давтагдашгүй хувилбаруудыг тодорхойлох боломжгүй, учир нь length бүхэл тоо биш.

variant-sort-not-implemented = sort бүхий { $component } бүрэлдэхүүний давтагдашгүй хувилбарууд хэрэгжүүлэгдээгүй

variant-exclude-combinations-not-implemented = excludeCombinations бүхий { $component } бүрэлдэхүүний давтагдашгүй хувилбарууд хэрэгжүүлэгдээгүй

variant-math-exclude-not-implemented = exclude бүхий math төрлийн { $component } бүрэлдэхүүний давтагдашгүй хувилбарууд хэрэгжүүлэгдээгүй

variant-non-constant-exclude-not-implemented = тогтмол бус exclude бүхий { $component } бүрэлдэхүүний давтагдашгүй хувилбарууд хэрэгжүүлэгдээгүй

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графикийн prefigure дүрслэгчид дэмжигдэхгүй; удам алгасагдлаа.

prefigure-descendant-invalid-geometry = { $subject }: төгсгөлгүй эсвэл бүрэн бус геометр; удам алгасагдлаа.

prefigure-curve-label-omitted = { $subject }: хөрвүүлсэн муруйн элементүүдэд шошго дэмжигдэхгүй; шошго орхигдлоо.

prefigure-curve-unsupported-definition-type = { $subject }: дэмжигдэхгүй муруйн функцийн тодорхойлолтын төрөл «{ $definitionType }»; удам алгасагдлаа.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves дээрх flipFunctions атрибут дэмжигдэхгүй; удам алгасагдлаа.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves зөвхөн томьёогоор өгөгдсөн хүү функцүүдийг дэмждэг; удам алгасагдлаа.

prefigure-label-position-unsupported =
    { $subject }: дэмжигдэхгүй labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] шулуунуудын бүлгийн шошгонд
       *[point] цэгийн шошгонд
    }; PreFigure-ийн анхны эгнүүлэлт хэрэглэгдэнэ.

prefigure-fill-style-unsupported = { $subject }: дүүргэлтийн загвар «{ $fillStyle }» PreFigure-д дэмжигдэхгүй; бүтэн дүүргэлт рүү шилжинэ.

prefigure-line-style-unknown = { $subject }: тодорхойгүй шугамын загвар «{ $lineStyle }» PreFigure гаралтаас хасагдлаа.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркерын загвар «{ $markerStyle }» PreFigure-ийн «diamond» загвартай тааруулагдлаа.

prefigure-marker-style-unsupported = { $subject }: маркерын загвар «{ $markerStyle }» PreFigure-д дэмжигдэхгүй; анхны загвар хэрэглэгдэнэ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: буруу `ref`; байг холбох боломжгүй. Тайлбар орхигдлоо.

annotation-ref-multiple-targets = `<annotation>`: `ref` хэд хэдэн бай холбов; эхнийх нь хэрэглэгдэнэ.

annotation-ref-outside-graph = `<annotation>`: буруу `ref`; бай нь агуулагч графикаас гадуур байна. Тайлбар орхигдлоо.

annotation-ref-unsupported-target = `<annotation>`: буруу `ref`; бай нь prefigure хөрвүүлэлтэд дэмжигддэг график объект биш. Тайлбар орхигдлоо.

annotation-text-missing = `<annotation>`: `text` алга эсвэл хоосон; хоосон текст гаргана.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Мөчлөгт хамаарал илрүүлэв.
       *[other] `<{ $componentType }>` бүрэлдэхүүнийг хамарсан мөчлөгт хамаарал илрүүлэв.
    }

reference-no-referent = Лавлагаанд тохирох объект олдсонгүй: `{ $reference }`

reference-multiple-referents = Лавлагаанд тохирох хэд хэдэн объект олдлоо: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` бүрэлдэхүүний { $attribute } атрибутын хэлбэр буруу.

children-invalid = `<{ $componentType }>` бүрэлдэхүүнд буруу хүү элементүүд: буруу хүү элементүүд олдлоо: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутад буруу утга `{ $value }`; `{ $default }` утга хэрэглэгдэнэ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } хувилбар олдсонгүй.
       *[other] DoenetML { $version } хувилбар олдсонгүй. { $fallback } хувилбар хэрэглэгдэнэ
    }

## Reading the DoenetML

parse-invalid-doenetml = Буруу DoenetML: { $content }

parse-tag-missing-close-tag = Буруу DoenetML: `{ $tag }` тагд хаах таг алга. Өөрөө хаагдах таг эсвэл `</{ $tagName }>` таг хүлээгдэж байсан.

parse-tag-error = Буруу DoenetML: `<{ $tagName }>` тагд алдаа

parse-attribute-missing-value = Буруу DoenetML: `{ $attribute }` атрибутад утга дутуу байх шиг байна.

parse-attribute-invalid = Буруу DoenetML: буруу атрибут `{ $attribute }`

parse-attribute-value-invalid = Буруу DoenetML: атрибутын буруу утга `{ $value }`

parse-attribute-value-quote-mismatch = Буруу DoenetML: атрибутын буруу утга `{ $value }`. Хашилтууд таарахгүй байна. `{ $quote }` дутуу байх шиг байна

parse-open-tag-name-missing = Буруу DoenetML: нэргүй таг олдлоо, жишээ нь `<`

parse-tag-not-closed = Буруу DoenetML: `{ $tag }` таг хаагдаагүй (`>` дутуу байх шиг байна).

parse-self-closing-tag-name-missing = Буруу DoenetML: нэргүй таг олдлоо `<{ $content }>`

parse-self-closing-tag-not-closed = Буруу DoenetML: `{ $tag }` таг хаагдаагүй (`/>` дутуу байх шиг байна).

parse-tag-invalid-attributes = Буруу DoenetML: `{ $tag }` таг зөв биш. Түүний атрибутууд буруу байж болно.

parse-close-tag-name-missing = Буруу DoenetML: нэргүй хаах таг олдлоо, жишээ нь `</`

parse-attribute-value-unquoted = Атрибутын утгууд хашилтад байх ёстой: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Буруу DoenetML: `{ $tag }` хаах таг олдсон ч түүнд тохирох нээх таг алга

parse-close-tag-mismatched = Буруу DoenetML: таарахгүй хаах таг. `</{ $expected }>` хүлээгдэж байсан. `{ $found }` олдлоо

parser-node-unconvertible = { $node } зангилааг Dast зангилаа болгон хөрвүүлж чадсангүй.

## Names

name-attribute-invalid =
    Буруу атрибут name='{ $name }'. { $reason ->
        [characters] Нэрэнд зөвхөн үсэг, тоо, доогуур зураас эсвэл зураас байж болно.
       *[start] Нэр үсгээр эхлэх ёстой.
    }

component-name-invalid-start = Буруу бүрэлдэхүүний нэр «{ $name }». Нэр үсгээр эхлэх ёстой.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched төрлийн answer нь video атрибуттай байх ёстой

answer-video-watched-video-not-reference = videoWatched төрлийн answer-ийн video атрибут лавлагаа байх ёстой

answer-name-not-single-text = answer-ийн name атрибут яг нэг текст хүү элементтэй байх ёстой

## Referencing another document

external-doenetml-recursion-limit = Рекурсийн түвшин хэт олон тул гадаад DoenetML-ийг авч чадсангүй. Мөчлөгт лавлагаа байна уу?

external-doenetml-unavailable = { $attribute }="{ $uri }" хаягаас DoenetML-ийг авч чадсангүй

external-doenetml-type-mismatch = { $attribute }="{ $uri }" хаягаас буруу DoenetML авлаа: энэ нь «{ $componentType }» бүрэлдэхүүний төрөлтэй таарсангүй

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут хуучирсан; оронд нь `{ $to }` атрибутыг ашиглана уу.
       *[other] [deprecation] `<{ $component }>` дээрх `{ $from }` атрибут хуучирсан; оронд нь `{ $to }` атрибутыг ашиглана уу.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут хуучирсан бөгөөд тооцогдохгүй, учир нь `{ $to }` ч бас заагдсан.
       *[other] [deprecation] `<{ $component }>` дээрх `{ $from }` атрибут хуучирсан бөгөөд тооцогдохгүй, учир нь `{ $to }` ч бас заагдсан.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` дээрх `{ $attribute }` атрибут хуучирсан бөгөөд тооцогдохгүй.


## Language coverage

pluralize-english-only = `<pluralize>` зөвхөн англи хэл дээр олон тоо үүсгэж чаддаг тул { $locale } хэлээр бичсэн баримт бичигт түүний текст өөрчлөгдөхгүй үлдэнэ. Олон тооны хэлбэрийг өөрөө бичих, эсвэл `pluralForm` атрибутаар зааж өгнө үү.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент нь танигдсан Doenet элемент биш.

schema-element-not-allowed-at-root = `<{ $tag }>` элементийг баримт бичгийн үндэст зөвшөөрөхгүй.

schema-element-not-allowed-inside = `<{ $tag }>` элементийг `<{ $parent }>` дотор зөвшөөрөхгүй.

schema-attribute-unrecognized = `<{ $tag }>` элементэд `{ $attribute }` нэртэй атрибут алга.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементийн `{ $attribute }` атрибут нь гишүүн бүр нь дараахын аль нэг байх жагсаалт байх ёстой: { $allowed }
       *[other] `<{ $tag }>` элементийн `{ $attribute }` атрибут нь дараахын аль нэг байх ёстой: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select-д буруу хувилбарын нэр. { $variantName } хувилбарын нэр { $numOptions } сонголтод тохиолдож байгаа бол сонгох тоо { $numToSelect } байна.

select-variant-name-without-options = select-д хувилбарууд заагдсан ч боломжит хувилбарын нэрэнд ямар ч сонголт алга: { $variantName }.

select-variant-name-not-possible = select-д заасан { $variantName } хувилбарын нэр нь боломжит хувилбарын нэр биш.

select-too-few-options = Ердөө { $numOptions } сонголтоос { $numToSelect } бүрэлдэхүүн сонгох боломжгүй.

select-from-sequence-too-few-values = Урт нь { $length } дарааллаас { $numToSelect } утга сонгох боломжгүй.

select-from-sequence-indices-count-mismatch = select-д заасан индексүүдийн тоо сонгох тоотой таарах ёстой

select-from-sequence-indices-not-integers = select-д заасан бүх индекс бүхэл тоо байх ёстой

select-from-sequence-index-excluded = selectfromsequence-д заасан индекс хассан байсан

select-from-sequence-indices-excluded-combination = selectfromsequence-д заасан индексүүд хассан хослол байсан

select-from-sequence-coprime-not-positive-integers = Эерэг бүхэл тоо сонгогдохгүй тул харилцан анхны хослолуудыг сонгох боломжгүй.

select-from-sequence-coprime-common-factor = Харилцан анхны тоонуудыг сонгох боломжгүй. Бүх боломжит утгууд нийтлэг хуваагчтай. (Заасан "from" эсвэл "to" утгууд "step"-тэй харилцан анхны байх ёстой.)

select-from-sequence-coprime-single-number = 1 биш ганц тооноос харилцан анхны хослолуудыг сонгох боломжгүй.

select-from-sequence-excluded-too-many-combinations = selectFromSequence дотор хослолуудын 70%-иас илүү нь хасагдсан

select-from-sequence-coprime-none-found = Харилцан анхны тоонуудыг сонгож чадсангүй. Бүх боломжит утгууд нийтлэг хуваагчтай.

select-from-sequence-too-few-unique-values = Урт нь { $numPossibleValues } дарааллаас { $numToSelect } өөр утга сонгох боломжгүй

select-prime-numbers-too-few-values = Урт нь { $numValues } анхны тоонуудын жагсаалтаас { $numToSelect } утга сонгох боломжгүй

select-prime-numbers-values-count-mismatch = select-д заасан утгуудын тоо сонгох тоотой таарах ёстой

select-prime-numbers-values-not-prime = select prime number-д заасан бүх утга анхны тоонуудын жагсаалтад байх ёстой

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-д заасан утгууд хассан хослол байсан

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers дотор хослолуудын 70%-иас илүү нь хасагдсан

select-random-combination-fluke = Туйлын магадлал багатай тохиолдлын улмаас санамсаргүй утгуудын хослолыг сонгож чадсангүй

select-random-value-fluke = Туйлын магадлал багатай тохиолдлын улмаас санамсаргүй утгыг сонгож чадсангүй
