# Buryat diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# The technical nouns are the Russian ones, which is what written Buryat uses
# for them: «компонент», «атрибут», «функци», «индекс».


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] хоёр үзүүрэй сэг заагдаһан үедэ { $attributes } тоологдоногүй
       *[other] хоёр үзүүрэй сэг заагдаһан үедэ { $attributes } тоологдоногүй
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] үзүүрэй сэгшье, дунда сэгшье заагдаһан үедэ { $attributes } тоологдоногүй
       *[other] үзүүрэй сэгшье, дунда сэгшье заагдаһан үедэ { $attributes } тоологдоногүй
    }

line-segment-midpoint-offset-without-midpoint = дунда сэггүй midpointOffset юуншье дээрэ нүлөөлнэгүй

## `<line>`

line-points-undetermined-dimensions = Хэмжээниинь мэдэгдээгүй сэгүүд соогуур гарадаг сэхэ зурлаа.

line-points-too-few-dimensions = Сэхэ зурлаа хамагай багадаа хоёр хэмжээтэй сэгүүд соогуур гараха ёһотой.

line-points-depend-on-variables = Сэхэ зурлаа хубилдаг хэмжээнүүдһээ дулдыдадаг сэгүүд соогуур гарана: { $variables }.

line-equation-invalid-format = { $variable1 } ба { $variable2 } хубилдаг хэмжээнүүдтэй сэхэ зурлаагай тэгшэдхэлэй формат буруу.

## `<ray>`

ray-overprescribed-through = Сасараг through, endpoint ба direction соогуур үгтэбэ. Үгтэһэн through тоологдоногүй.

ray-dimension-mismatch = сасараг дээрэ numDimensions таарангүй.

## `<vector>`

vector-overprescribed-head = Вектор head, tail ба displacement соогуур үгтэбэ. Үгтэһэн head тоологдоногүй.

vector-dimension-mismatch = вектор дээрэ numDimensions таарангүй.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элемент руу татажа шадахагүй, юундэб гэхэдэ тэрээндэ nearestPoint байдалай хубилдаг хэмжээн үгы.

constrain-to-without-nearest-point = `<{ $component }>` элементээр хизаарлажа шадахагүй, юундэб гэхэдэ тэрээндэ nearestPoint байдалай хубилдаг хэмжээн үгы.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементын дотоороо хизаарлажа шадахагүй, юундэб гэхэдэ тэрээндэ nearestPoint байдалай хубилдаг хэмжээн үгы.

## `<choiceInput>`

choice-input-label-position-ignored = мүр соохи бэшэ choiceInput дээрэ labelPosition тоологдоногүй

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput дээрэ үгтэһэн индексүүд тоологдоногүй, юундэб гэхэдэ тэдэнэй тоо choice үхибүүдэй тоодо тааранагүй.

pretzel-indices-count-mismatch = problem дээрэ үгтэһэн индексүүд тоологдоногүй, юундэб гэхэдэ тэдэнэй тоо problem үхибүүдэй тоодо тааранагүй.

shuffle-indices-count-mismatch = shuffle дээрэ үгтэһэн индексүүд тоологдоногүй, юундэб гэхэдэ тэдэнэй тоо компонентнуудай тоодо тааранагүй.

indices-ignored-out-of-range = { $component } дээрэ үгтэһэн индексүүд тоологдоногүй, юундэб гэхэдэ зариманиинь хизаарһаа гарана.

pretzel-indices-repeated = pretzel дээрэ үгтэһэн индексүүд тоологдоногүй, юундэб гэхэдэ зариманиинь дабтагдана.

pretzel-circuit-first-index = circuit горим соо pretzel дээрэ үгтэһэн индексүүд тоологдоногүй, юундэб гэхэдэ түрүүшын индекс 1 байха ёһотой.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текстын үхибүүдтэй хүдэлхын тулада `type` атрибут үгтэхэ ёһотой.

invalid-type-defaulting-to-math = { $component } компонентдо буруу түхэл { $type }. Тэрэ math, text, number али boolean байха ёһотой. math хэрэглэгдэнэ.

string-not-valid-component-to-arrange = «{ $value }» мүр { $component } дээрэ таарамжатай компонент бэшэ. Тоологдоногүй.

## Types and variables

invalid-type-defaulting-to-number = Буруу түхэл { $type }, түхэлынь number болгогдоно.

invalid-variable-value = Хубилдаг хэмжээнэй буруу утга: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариантын индекс тоо байха ёһотой

variant-index-must-be-integer = { $index } вариантын индекс бүхэли тоо байха ёһотой

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют хэмжээнүүдтэ хэгдээгүй. Үргэнүүдынь харилсуулагдана.

side-by-side-absolute-margins = `<{ $component }>` абсолют хэмжээнүүдтэ хэгдээгүй. Хизаарнуудынь харилсуулагдана.

side-by-side-no-block-child = Буруу `<{ $component }>`: тэрээндэ хамагай багадаа нэгэ блог үхибүүн байха ёһотой.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элемент дээрэхи `for` атрибут тоологдоногүй.

label-for-must-resolve-to-one = `<label>` элемент дээрэхи `for` атрибут яг нэгэ компонент дээрэ зааха ёһотой.

label-for-unresolved = `<label>` элемент дээрэхи `for` атрибудые компоненттэй холбожо шадабагүй.

label-for-answer-with-authored-inputs = `<label>` элемент дээрэхи `for` атрибут автор бэшэһэн оруулгын талмайнуудтай `<answer>` дээрэ заана; талмай дээрэ шэглүүлэн заагты.

label-for-answer-without-input = `<label>` элемент дээрэхи `for` атрибут тэмдэглэхэ оруулгын талмайгүй `<answer>` дээрэ заана.

label-for-must-reference-input-or-answer = `<label>` элемент дээрэхи `for` атрибут оруулгын талмай али харюу дээрэ зааха ёһотой.

## Accessibility

accessibility-short-description-or-decorative = Хүрэхэ аргын тулада `<{ $component }>` али богони тайлбаритай байха, али шэмэглэл гэжэ тэмдэглэгдэхэ ёһотой.

accessibility-video-short-description = Хүрэхэ аргын тулада `<video>` богони тайлбаритай байха ёһотой.

accessibility-input-short-description-or-label = Хүрэхэ аргын тулада `<{ $component }>` богони тайлбаритай али тэмдэгтэй байха ёһотой.

accessibility-answer-input-short-description-or-label = Хүрэхэ аргын тулада оруулгын талмай бүтээдэг `<answer>` богони тайлбаритай али тэмдэгтэй байха ёһотой.

accessibility-short-description-contains-math = Богони тайлбаринууд соо `<{ $component }>` шэнги математическа компонентнууд байха ёһогүй. Математикые үгөөр бэшэгты.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } бүлэгэй толгойн текстдэ хүрэхэ контраст үгэнэгүй (харанхы түхэл) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; хамагай багадаа { $threshold }:1 хэрэгтэй).
       *[other] { $colorName } бүлэгэй толгойн текстдэ хүрэхэ контраст үгэнэгүй ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; хамагай багадаа { $threshold }:1 хэрэгтэй).
    }

## `<circle>`

circle-through-points-non-numerical = Сэгүүдэй тоото утга үгы байхада { $count } сэг соогуур гарадаг `<circle>` хэгдээгүй.

circle-too-many-through-points = 3-һаа олон сэг соогуур гарадаг тойрог тооложо шадахагүй.

circle-overprescribed-radius-center-points = Үгтэһэн радиус, түб ба сэгүүдтэй тойрог тооложо шадахагүй.

circle-center-with-multiple-points = Үгтэһэн түбтэй 1-һээ олон сэг соогуур гарадаг тойрог тооложо шадахагүй.

circle-radius-too-small = Тойрог тооложо шадахагүй: хоёр сэгэй хоорондохи зай { $distance } байхада, үгтэһэн радиус { $radius } хэтэрхэй бага.

circle-radius-with-many-points = Үгтэһэн радиустай хоёрһоо олон сэг соогуур гарадаг тойрог бүтээжэ шадахагүй.

circle-invalid-center-or-through-points = Тойрогой түб али сэгүүд буруу.

circle-radius-center-with-multiple-points = Үгтэһэн түбтэй 1-һээ олон сэг соогуур гарадаг тойрогой радиус тооложо шадахагүй.

circle-change-radius-non-numerical = Тоото бэшэ сэгүүдтэй тойрогой радиус хубилгажа шадахагүй

circle-radius-with-points-non-numerical = Тоото утга үгы байхада үгтэһэн радиустай нэгэһээ олон сэг соогуур гарадаг тойрог бүтээжэ шадахагүй.

circle-change-center-non-numerical = Тоото бэшэ сэгүүд соогуур гарадаг тойрогой түб хубилгаха хэгдээгүй.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функциин тодорхойлогдодог можын хэмжээн хүрэнэгүй. Можо соо { $intervals } забһар бии, харин функци соо { $inputs ->
            [one] { $inputs } оролто
           *[other] { $inputs } оролто
        } бии.
       *[other] Функциин тодорхойлогдодог можын хэмжээн хүрэнэгүй. Можо соо { $intervals } забһар бии, харин функци соо { $inputs ->
            [one] { $inputs } оролто
           *[other] { $inputs } оролто
        } бии.
    }

function-domain-invalid-format = Функциин тодорхойлогдодог можын формат буруу.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функциин тоото бэшэ максимум тоологдоногүй.
        [minimum] Функциин тоото бэшэ минимум тоологдоногүй.
        [extremum] Функциин тоото бэшэ экстремум тоологдоногүй.
        [point] Функциин тоото бэшэ сэг тоологдоногүй.
        [slope] Функциин тоото бэшэ хазайлга тоологдоногүй.
       *[other] Функциин тоото бэшэ { $type } утга тоологдоногүй.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функциин хооһон максимум тоологдоногүй.
        [minimum] Функциин хооһон минимум тоологдоногүй.
        [extremum] Функциин хооһон экстремум тоологдоногүй.
        [point] Функциин хооһон сэг тоологдоногүй.
       *[other] Функциин хооһон { $type } утга тоологдоногүй.
    }

function-points-too-close = Функци соо бэе бэедээ хэтэрхэй ойрохон хоёр сэг бии. Функци тодорхойлжо шадахагүй.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функциин итерацинууд оролтын тоо гаралтын тоодо тэнсүү байхада лэ болоно. Энэ функци соо { $inputs } оролто ба { $outputs ->
            [one] { $outputs } гаралта
           *[other] { $outputs } гаралта
        } бии.
       *[other] Функциин итерацинууд оролтын тоо гаралтын тоодо тэнсүү байхада лэ болоно. Энэ функци соо { $inputs } оролто ба { $outputs ->
            [one] { $outputs } гаралта
           *[other] { $outputs } гаралта
        } бии.
    }

## `<sequence>`

sequence-invalid-length = Дараалалай утань буруу. Тэрэ һөрэг бэшэ бүхэли тоо байха ёһотой.

sequence-invalid-step = Дараалалай алхам буруу. { $type } түхэлтэй дараалалда тэрэ тоо байха ёһотой.

sequence-invalid-endpoint-number = Тоото дараалалай «{ $attribute }» утга буруу. Тэрэ тоо байха ёһотой.

sequence-invalid-endpoint-letters = Үзэгэй дараалалай «{ $attribute }» утга буруу. Тэрэ үзэгүүдэй холболто байха ёһотой.

sequence-invalid-endpoint = Дараалалай «{ $attribute }» утга буруу.

select-from-sequence-coprime-not-numbers = тоонууд шэлэгдээгүй тула coprime тоологдоногүй

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations үгтэһэн тула coprime тоологдоногүй

## Resolving a `target`

target-not-found = `<{ $source }>` дээрэ буруу target: зорилго олдобогүй.

target-state-variable-not-found = `<{ $source }>` дээрэ буруу target: `<{ $component }>` элемент дээрэ «{ $property }» нэрэтэй байдалай хубилдаг хэмжээн олдобогүй.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` хубилдаг хэмжээнүүдынь дулдыдангүй хэмжээнһээ ондоо байха ёһотой.

ode-system-duplicate-variable-names = Дулдыдадаг хэмжээнүүдэй нэрэнүүд дабтагдажа байхада ДТ баруун талын функцинуудые тодорхойлжо шадахагүй.

ode-system-rhs-function-error = ДТ баруун талын функци тодорхойлжо шадахагүй. mathjs функци бүтээхэдэ алдуу.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } сэхэ зурлаагай хоорондохи булан тодорхойлжо шадахагүй

angle-invalid-through-point = `<angle>` элементын through утга соо буруу сэг

parabola-vertex-too-many-points = Үгтэһэн орьёлтой 1-һээ олон сэг соогуур гарадаг парабола хэгдээгүй.

parabola-too-many-points = 3-һаа олон сэг соогуур гарадаг парабола хэгдээгүй.

intersection-too-many-items = Хоёрһоо олон объектын огтолсолго хэгдээгүй

## Other math components

ionic-compound-not-two-ions = Хоёр ионһоо бэшэ ионой холбоо хэгдээгүй.

ionic-compound-needs-cation-and-anion = Ионой холбоо нэгэ катион ба нэгэ анионой тулада лэ хэгдэһэн.

solve-equations-cannot-evaluate = Тэгшэдхэл шиидхэжэ шадахагүй, юундэб гэхэдэ тэрэниие тооложо шадабагүй: { $equation }

math-operators-operand-number-required = Математическа операнд илгаха тулада operandNumber үгтэхэ ёһотой.

eigen-decomposition-failed = Матрицын өөрын утга тооложо шадабагүй

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр загбар соо ушарнагүй, тиимэһээ тэрэ хэзээдэшье хооһондо таарана.
       *[other] `<matchesPattern>`: { $parameters } параметрнүүд загбар соо ушарнагүй, тиимэһээ тэдэ хэзээдэшье хооһондо таарана.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" утга ойлгожо шадахагүй. Тэрэ none, medium, dense али хооһон зайгаар илгагдаһан хоёр эерэг тоо байха ёһотой, жэшээнь grid="1 0.5". Тор зурагданагүй.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure зурагша дээрэ xLabelPosition="left" хэгдээгүй; баруун талын байрлал хэрэглэгдэнэ.

prefigure-y-label-position-unsupported = `<graph>`: prefigure зурагша дээрэ yLabelPosition="bottom" хэгдээгүй; дээдэ талын байрлал хэрэглэгдэнэ.

prefigure-invalid-axis-bounds = `<graph>`: prefigure хубилгалгада тэнхэлэйн хизаарнууд буруу; үндэһэн bbox (-10,-10,10,10) хэрэглэгдэнэ.

prefigure-invalid-width = `<graph>`: prefigure хубилгалгада үргэн буруу; диаграммын үндэһэн үргэн 425 хэрэглэгдэнэ.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure хубилгалгада aspectRatio буруу; үндэһэн талануудай харисаа 1 хэрэглэгдэнэ.

prefigure-grid-spacing-too-fine = `<graph>`: торой алхам тэнхэлэйн хизаарнуудта хэтэрхэй нарин; prefigure зурагша дээрэ тор гаргагданагүй.

prefigure-annotations-not-rendered = `<graph>`: PreFigure зурагша хэрэглэгдээгүй һаа тэмдэглэлнүүд зурагданагүй.

multiple-annotations-children = `<graph>` соо хэдэн `<annotations>` үхибүүн олдобо; һүүлшынһээ бэшэниинь тоологдоногүй.

## Referring to other components

copy-unrecognized-component-type = Танигдаагүй компонентын түхэл үргэдхэжэ али хуулажа шадахагүй: { $type }.

copy-prop-not-found = { $component } түхэлтэй компонент дээрэ { $property } шанар олдобогүй

collect-no-source = collect дээрэ уг олдобогүй.

collect-invalid-component-type = `<{ $component }>` түхэлтэй компонентнуудые суглуулжа шадахагүй, юундэб гэхэдэ энэ буруу компонентын түхэл.

reference-index-unavailable = `{ $reference }` индекс дээрэ холбоһон хэжэ шадахагүй

## `<callAction>`

component-action-unavailable = `{ $reference }` компонент дээрэ { $action } дуудажа шадахагүй

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Мэдээсэлэй хэлбэри буруу. Мүрнүүдэй утань ондо ондоо. Олдобо componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Мэдээсэл соо баганын нэрэнүүд дабтагдана. Олдобо componentIdx :{ $componentIdx }

data-frame-missing-column-name = Мэдээсэл соо баганын нэрэ дуталдана. Олдобо componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Энэ харюугай award утга answer тэгэй өөрын эльгээгдэһэн харюу дээрэ үндэһэлнэ, энэ хүлеэгдээгүй байдалда хүргэнэ.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` бүхы контейнер соохи `<answer>` дээрэ `maxNumAttempts` табихань нүлөөлнэгүй, юундэб гэхэдэ оролдолгын тоо контейнер тодорхойлно. `maxNumAttempts` утга контейнер дээрэ табигты.

nested-section-wide-check-work-max-num-attempts = Ондоо `sectionWideCheckWork` контейнер соо байдаг `sectionWideCheckWork` контейнер дээрэ `maxNumAttempts` табихань нүлөөлнэгүй, юундэб гэхэдэ оролдолгын тоо гадаадахи контейнер тодорхойлно. `maxNumAttempts` утга гадаадахи контейнер дээрэ табигты.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality табигдаагүй һаа { $attributes } атрибут нүлөөлхэгүй.
       *[other] symbolicEquality табигдаагүй һаа { $attributes } атрибудууд нүлөөлхэгүй.
    }

answer-invalid-type = answer дээрэ буруу түхэл: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентын нэрэ үгы тула тэрэниие модулиин атрибут болгожо хэрэглэжэ шадахагүй

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонент модулиин атрибут болгожо хэрэглэжэ шадахагүй, юундэб гэхэдэ `<module>` компонентын түхэл дээрэ «{ $name }» атрибут хэдын тодорхойлогдонхой.

conditional-content-condition-ignored = case али else үхибүүдтэй `<conditionalContent>` компонент дээрэ `condition` атрибут тоологдоногүй.

slider-markers-type-mismatch = Маркернуудай түхэл гулгуурай түхэлдэ тааранагүй.

pretzel-problem-needs-statement-and-answer = Буруу pretzel: `<problem>` бүхэн нэгэ `<statement>` ба нэгэ `<answer>` агуулха ёһотой.

pretzel-circuit-first-problem-distractor = Буруу pretzel: mode="circuit" горим соо түрүүшын `<problem>` анхарал буруулагша байжа шадахагүй.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибут дээрэ буруу утга { $values }; тоологдоногүй.
       *[other] `{ $attribute }` атрибут дээрэ буруу утганууд { $values }; тоологдоногүй.
    }

attribute-must-be-references = `{ $attribute }` атрибут дээрэ буруу утга `{ $value }`. Атрибут `$` тэмдэгһээ эхилдэг холбоһонуудһаа бүридэхэ ёһотой.

math-input-invalid-function-names = <mathInput>: { $attribute } соохи буруу функциин нэрэнүүд тоологдобогүй: { $names }. Нэрэ бүхэнэй харагдадаг хубинь хамагай багадаа 2 тэмдэг байха ёһотой (үзэгүүд али зураанууд); тэрэнэй хойно хэрэгтэй бэшэ `|<mathspeak альтернатива>` нэмэлтэ ерэжэ болохо.

## Building components from the source

component-type-invalid = Буруу компонентын түхэл: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибут дабтажа шадахагүй.

attribute-invalid-for-component = `<{ $componentType }>` түхэлтэй компонентдо буруу атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стилиин тодорхойлолто соо { $context ->
        [text-on-background] текстын үнгэ ба дэбисхэрэй үнгэ
        [high-contrast] ехэ контрасттай үнгэ ба зурагай талмай
        [line] зурлаагай үнгэ ба зурагай талмай
        [marker] маркерай үнгэ ба зурагай талмай
       *[text-on-canvas] текстын үнгэ ба зурагай талмай
    } хоорондохи контраст хүрэнэгүй{ $mode ->
        [dark] { " (харанхы түхэл)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; хамагай багадаа { $threshold }:1 хэрэгтэй).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стилиин тодорхойлолто соо үгтэһэн үнгэнүүд гэрэлтэ түхэлдэ хүрэхэ контраст үгэбэшье, тэдэнһээ гараһан харанхы түхэлэй үнгэнүүд текст ба дэбисхэрэй хоорондо хүрэхэ контраст үгэнэгүй ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; хамагай багадаа { $threshold }:1 хэрэгтэй). { $suggestion ->
        [available] Харанхы түхэлдэ хүрэхэ контрастын тулада али гэрэлтэ түхэлэй контраст ехэ болгогты (жэшээнь { $lightAttribute }="{ $lightColor }"), али харанхы түхэлэй үнгэ һэлгэгты (жэшээнь { $darkAttribute }="{ $darkColor }").
       *[none] Харанхы түхэлдэ хүрэхэ контрастын тулада гэрэлтэ түхэлэй контраст ехэ болгогты али гараһан үнгэнүүдые textColorDarkMode ба/али backgroundColorDarkMode-оор һэлгэгты.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стилиин тодорхойлолто соо үгтэһэн текстын үнгэ гэрэлтэ түхэлдэ хүрэхэ контраст үгэбэшье, тэрээнһээ гараһан харанхы түхэлэй текстын үнгэ зурагай талмайтай хүрэхэ контраст үгэнэгүй ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; хамагай багадаа { $threshold }:1 хэрэгтэй). { $suggestion ->
        [available] Харанхы түхэлдэ хүрэхэ контрастын тулада али гэрэлтэ түхэлэй контраст ехэ болгогты (жэшээнь textColor="{ $lightColor }"), али харанхы түхэлэй үнгэ һэлгэгты (жэшээнь textColorDarkMode="{ $darkColor }").
       *[none] Харанхы түхэлдэ хүрэхэ контрастын тулада гэрэлтэ түхэлэй контраст ехэ болгогты али гараһан үнгэ textColorDarkMode-оор һэлгэгты.
    }

section-multiple-style-palettes = Бүлэг ганса <stylePalette> шэлэжэ шадана; һүүлшыниинь хэрэглэгдэнэ.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } дээрэ дабтагдашагүй вариантнуудые тодорхойлжо шадахагүй, юундэб гэхэдэ numToSelect һөрэг бэшэ бүхэли тоо бэшэ.

variant-num-to-select-not-constant-number = { $component } дээрэ дабтагдашагүй вариантнуудые тодорхойлжо шадахагүй, юундэб гэхэдэ numToSelect тогтоһон тоо бэшэ.

variant-with-replacement-not-constant-boolean = { $component } дээрэ дабтагдашагүй вариантнуудые тодорхойлжо шадахагүй, юундэб гэхэдэ withReplacement тогтоһон логическа утга бэшэ.

variant-select-weight-disables-unique = ямар нэгэн шэлэлгэ дээрэ selectWeight али selectForVariants үгтэһэн һаа, select дээрэ дабтагдашагүй вариантнууд хаагдана

variant-coprime-undetermined = { $component } дээрэ дабтагдашагүй вариантнуудые тодорхойлжо шадахагүй, юундэб гэхэдэ coprime хэзээдэшье худал гү гэжэ тодорхойлжо шадахагүй.

variant-attribute-not-constant = { $component } дээрэ дабтагдашагүй вариантнуудые тодорхойлжо шадахагүй, юундэб гэхэдэ { $attribute } тогтоһон бэшэ.

variant-attribute-not-number = { $component } дээрэ дабтагдашагүй вариантнуудые тодорхойлжо шадахагүй, юундэб гэхэдэ { $attribute } тоо бэшэ.

variant-attribute-wrong-type-for-sequence =
    { $type } түхэлтэй { $component } дээрэ дабтагдашагүй вариантнуудые тодорхойлжо шадахагүй, юундэб гэхэдэ { $attribute } { $expected ->
        [letters-combination] үзэгүүдэй холболто
        [math-expression] таарамжатай математическа илэрхэйлэлгэ
        [integer] бүхэли тоо
       *[number] тоо
    } бэшэ.

variant-length-not-integer = { $component } дээрэ дабтагдашагүй вариантнуудые тодорхойлжо шадахагүй, юундэб гэхэдэ length бүхэли тоо бэшэ.

variant-sort-not-implemented = sort бүхы { $component } дээрэ дабтагдашагүй вариантнууд хэгдээгүй

variant-exclude-combinations-not-implemented = excludeCombinations бүхы { $component } дээрэ дабтагдашагүй вариантнууд хэгдээгүй

variant-math-exclude-not-implemented = exclude бүхы math түхэлтэй { $component } дээрэ дабтагдашагүй вариантнууд хэгдээгүй

variant-non-constant-exclude-not-implemented = тогтоһон бэшэ exclude бүхы { $component } дээрэ дабтагдашагүй вариантнууд хэгдээгүй

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графигай prefigure зурагша дээрэ хэгдээгүй; удамынь орхигдобо.

prefigure-descendant-invalid-geometry = { $subject }: түгэсхэлгүй али дүүрэн бэшэ геометри; удамынь орхигдобо.

prefigure-curve-label-omitted = { $subject }: хубилгагдаһан муруй элементнүүд дээрэ тэмдэгүүд хэгдээгүй; тэмдэг орхигдобо.

prefigure-curve-unsupported-definition-type = { $subject }: хэгдээгүй муруй функциин тодорхойлолтын түхэл «{ $definitionType }»; удамынь орхигдобо.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элемент дээрэхи flipFunctions атрибут хэгдээгүй; удамынь орхигдобо.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формулаар үгтэһэн үхибүүн функцинуудые лэ абана; удамынь орхигдобо.

prefigure-label-position-unsupported =
    { $subject }: хэгдээгүй labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] зурлаануудай бүлэгэй тэмдэгтэ
       *[point] сэгэй тэмдэгтэ
    }; PreFigure-эй үндэһэн тэгшэлгэ хэрэглэгдэнэ.

prefigure-fill-style-unsupported = { $subject }: дүүргэлгын стиль «{ $fillStyle }» PreFigure дээрэ хэгдээгүй; дүүрэн дүүргэлгэ руу орино.

prefigure-line-style-unknown = { $subject }: мэдэгдээгүй зурлаагай стиль «{ $lineStyle }» PreFigure-эй гаралгаһаа усадхагдаба.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркерай стиль «{ $markerStyle }» PreFigure-эй «diamond» стильтэй тааруулагдаба.

prefigure-marker-style-unsupported = { $subject }: маркерай стиль «{ $markerStyle }» PreFigure дээрэ хэгдээгүй; үндэһэн стиль хэрэглэгдэнэ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: буруу `ref`; зорилго холбожо шадахагүй. Тэмдэглэл усадхагдаба.

annotation-ref-multiple-targets = `<annotation>`: `ref` хэдэн зорилготой холбогдобо; түрүүшыниинь хэрэглэгдэнэ.

annotation-ref-outside-graph = `<annotation>`: буруу `ref`; зорилго тэрэниие агуулдаг графигай гадна. Тэмдэглэл усадхагдаба.

annotation-ref-unsupported-target = `<annotation>`: буруу `ref`; зорилго prefigure хубилгалга дээрэ хэгдэһэн график объект бэшэ. Тэмдэглэл усадхагдаба.

annotation-text-missing = `<annotation>`: `text` үгы али хооһон; хооһон текст гаргагдана.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Тойрог дулдыдал элирүүлэгдэбэ.
       *[other] `<{ $componentType }>` компонент агуулдаг тойрог дулдыдал элирүүлэгдэбэ.
    }

reference-no-referent = Холбоһондо объект олдобогүй: `{ $reference }`

reference-multiple-referents = Холбоһондо хэдэн объект олдобо: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементын { $attribute } атрибудай формат буруу.

children-invalid = `<{ $componentType }>` дээрэ буруу үхибүүд: буруу үхибүүд олдобо: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибут дээрэ буруу утга `{ $value }`; `{ $default }` утга хэрэглэгдэнэ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } хубилбари олдобогүй.
       *[other] DoenetML { $version } хубилбари олдобогүй. { $fallback } хубилбари хэрэглэгдэнэ
    }

## Reading the DoenetML

parse-invalid-doenetml = Буруу DoenetML: { $content }

parse-tag-missing-close-tag = Буруу DoenetML: `{ $tag }` тэгэй хаадаг тэг үгы. Өөрөө хаагдадаг тэг али `</{ $tagName }>` тэг хүлеэгдэһэн.

parse-tag-error = Буруу DoenetML: `<{ $tagName }>` тэг соо алдуу

parse-attribute-missing-value = Буруу DoenetML: `{ $attribute }` атрибут дээрэ утга дуталдажа байна бэшэ гү.

parse-attribute-invalid = Буруу DoenetML: буруу атрибут `{ $attribute }`

parse-attribute-value-invalid = Буруу DoenetML: атрибудай буруу утга `{ $value }`

parse-attribute-value-quote-mismatch = Буруу DoenetML: атрибудай буруу утга `{ $value }`. Хашалтанууд тааранагүй. `{ $quote }` дуталдажа байна бэшэ гү

parse-open-tag-name-missing = Буруу DoenetML: нэрэгүй тэг олдобо, жэшээнь `<`

parse-tag-not-closed = Буруу DoenetML: `{ $tag }` тэг хаагдаагүй (`>` дуталдажа байна бэшэ гү).

parse-self-closing-tag-name-missing = Буруу DoenetML: нэрэгүй тэг олдобо `<{ $content }>`

parse-self-closing-tag-not-closed = Буруу DoenetML: `{ $tag }` тэг хаагдаагүй (`/>` дуталдажа байна бэшэ гү).

parse-tag-invalid-attributes = Буруу DoenetML: `{ $tag }` тэг таарамжатай бэшэ. Тэрэнэй атрибудууд буруу байжа болохо.

parse-close-tag-name-missing = Буруу DoenetML: нэрэгүй хаадаг тэг олдобо, жэшээнь `</`

parse-attribute-value-unquoted = Атрибудай утганууд хашалта соо байха ёһотой: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Буруу DoenetML: `{ $tag }` хаадаг тэг олдобо, теэд тэрээндэ таарадаг нээдэг тэг үгы

parse-close-tag-mismatched = Буруу DoenetML: тааранагүй хаадаг тэг. `</{ $expected }>` хүлеэгдэһэн. `{ $found }` олдобо

parser-node-unconvertible = { $node } зангилаае Dast зангилаа болгожо хубилгажа шадабагүй.

## Names

name-attribute-invalid =
    Буруу атрибут name='{ $name }'. { $reason ->
        [characters] Нэрэнүүд соо үзэгүүд, тоонууд, доодо зураанууд али зураанууд лэ байжа болохо.
       *[start] Нэрэнүүд үзэгһөө эхилхэ ёһотой.
    }

component-name-invalid-start = Буруу компонентын нэрэ «{ $name }». Нэрэнүүд үзэгһөө эхилхэ ёһотой.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched түхэлтэй answer video атрибуттай байха ёһотой

answer-video-watched-video-not-reference = videoWatched түхэлтэй answer-эй video атрибут холбоһон байха ёһотой

answer-name-not-single-text = answer-эй name атрибут яг нэгэ текстын үхибүүтэй байха ёһотой

## Referencing another document

external-doenetml-recursion-limit = Рекурсиин шатанууд хэтэрхэй олон тула гадаадахи DoenetML абажа шадабагүй. Тойрог холбоһон үгы гү?

external-doenetml-unavailable = { $attribute }="{ $uri }" хаягһаа DoenetML абажа шадабагүй

external-doenetml-type-mismatch = { $attribute }="{ $uri }" хаягһаа буруу DoenetML абтаба: тэрэ «{ $componentType }» компонентын түхэлдэ тааранагүй

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут хуушарба; тэрэнэй орондо `{ $to }` хэрэглэгты.
       *[other] [deprecation] `<{ $component }>` элемент дээрэхи `{ $from }` атрибут хуушарба; тэрэнэй орондо `{ $to }` хэрэглэгты.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут хуушарба ба тоологдоногүй, юундэб гэхэдэ `{ $to }` баһа үгтэһэн.
       *[other] [deprecation] `<{ $component }>` элемент дээрэхи `{ $from }` атрибут хуушарба ба тоологдоногүй, юундэб гэхэдэ `{ $to }` баһа үгтэһэн.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элемент дээрэхи `{ $attribute }` атрибут хуушарба ба тоологдоногүй.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элемент дээрэхи `{ $attribute }` атрибут хуушарба; тэрэнэй орондо `<{ $child }>` үхибүү хэрэглэгты.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элемент дээрэхи `{ $attribute }` атрибудай `{ $value }` утга хуушарба; тэрэнэй орондо `{ $to }` хэрэглэгты.


## Language coverage

pluralize-english-only = `<pluralize>` олон тоо англи хэлэн дээрэ лэ хэжэ шадана, тиимэһээ { $locale } хэлэн дээрэ бэшэгдэһэн бэшэг соо тэрэнэй текст хубилангүй үлэнэ. Олон тоогой хэлбэри өөрөө бэшэгты али тэрэниие `pluralForm` атрибудаар үгэгты.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент танигдаһан Doenet элемент бэшэ.

schema-element-not-allowed-at-root = `<{ $tag }>` элементдэ бэшэгэй үндэһэн дээрэ зүбшөөл үгтэнэгүй.

schema-element-not-allowed-inside = `<{ $tag }>` элементдэ `<{ $parent }>` соо зүбшөөл үгтэнэгүй.

schema-attribute-unrecognized = `<{ $tag }>` элемент дээрэ `{ $attribute }` нэрэтэй атрибут үгы.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементын `{ $attribute }` атрибут элемент бүхэниинь эдэнэй нэгэн байдаг жагсаалта байха ёһотой: { $allowed }
       *[other] `<{ $tag }>` элементын `{ $attribute }` атрибут эдэнэй нэгэн байха ёһотой: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select дээрэ буруу вариантын нэрэ. { $variantName } вариантын нэрэ { $numOptions } шэлэлгэ дээрэ ушарна, харин шэлэхэ тоо { $numToSelect }.

select-variant-name-without-options = select дээрэ вариантнууд үгтэһэн, теэд боломжотой вариантын нэрэдэ нэгэшье шэлэлгэ үгы: { $variantName }.

select-variant-name-not-possible = select дээрэ үгтэһэн { $variantName } вариантын нэрэ боломжотой вариантын нэрэ бэшэ.

select-too-few-options = Ниитэ { $numOptions } сооһоо { $numToSelect } компонент шэлэжэ шадахагүй.

select-from-sequence-too-few-values = Утань { $length } дараалалһаа { $numToSelect } утга шэлэжэ шадахагүй.

select-from-sequence-indices-count-mismatch = select дээрэ үгтэһэн индексүүдэй тоо шэлэхэ тоодо таараха ёһотой

select-from-sequence-indices-not-integers = select дээрэ үгтэһэн бүхы индексүүд бүхэли тоо байха ёһотой

select-from-sequence-index-excluded = selectfromsequence дээрэ үгтэһэн индекс усадхагдаһан байгаа

select-from-sequence-indices-excluded-combination = selectfromsequence дээрэ үгтэһэн индексүүд усадхагдаһан холболто байгаа

select-from-sequence-coprime-not-positive-integers = Эерэг бүхэли тоонууд шэлэгдээгүй тула харилсан энгидэрхэй холболтонуудые шэлэжэ шадахагүй.

select-from-sequence-coprime-common-factor = Харилсан энгидэрхэй тоонуудые шэлэжэ шадахагүй. Бүхы боломжотой утганууд ниитэ хубаагшатай. (Үгтэһэн "from" али "to" утганууд "step"-тэй харилсан энгидэрхэй байха ёһотой.)

select-from-sequence-coprime-single-number = 1 бэшэ ганса тооһоо харилсан энгидэрхэй холболтонуудые шэлэжэ шадахагүй.

select-from-sequence-excluded-too-many-combinations = selectFromSequence соо холболтонуудай 70%-һээ олониинь усадхагдаба

select-from-sequence-coprime-none-found = Харилсан энгидэрхэй тоонуудые шэлэжэ шадабагүй. Бүхы боломжотой утганууд ниитэ хубаагшатай.

select-from-sequence-too-few-unique-values = Утань { $numPossibleValues } дараалалһаа { $numToSelect } ондоо утга шэлэжэ шадахагүй

select-prime-numbers-too-few-values = Утань { $numValues } энгидэрхэй тоонуудай жагсаалтаһаа { $numToSelect } утга шэлэжэ шадахагүй

select-prime-numbers-values-count-mismatch = select дээрэ үгтэһэн утгануудай тоо шэлэхэ тоодо таараха ёһотой

select-prime-numbers-values-not-prime = select prime number дээрэ үгтэһэн бүхы утганууд энгидэрхэй тоонуудай жагсаалта соо байха ёһотой

select-prime-numbers-values-excluded-combination = selectPrimeNumbers дээрэ үгтэһэн утганууд усадхагдаһан холболто байгаа

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers соо холболтонуудай 70%-һээ олониинь усадхагдаба

select-random-combination-fluke = Тон боломжогүй ушарһаа боложо тохёолдоһон утгануудай холболто шэлэжэ шадабагүй

select-random-value-fluke = Тон боломжогүй ушарһаа боложо тохёолдоһон утга шэлэжэ шадабагүй
