# Kabardian (East Circassian) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Cyrillic literary standard of Kabardino-Balkaria and
# Karachay-Cherkessia. The palochka Ӏ is a letter of the alphabet, not a Latin
# capital I and not a digit 1.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Kabardian has no gender and no noun classes, so nothing here forks on
# agreement; `content.ftl` sets out why. Counted messages put the numeral after
# the noun, which is Kabardian's order.
#
# **The rule this file follows most often: a case ending is never welded onto a
# placeable.** Kabardian's oblique is «-м» after a vowel and «-ым» after a
# consonant, and its shape is decided by the last letter of the word in front
# of it — a word the catalog never sees. So where English would inflect a
# value, this file names what the value *is* and puts the ending on that word
# instead: «`<{ $component }>` компонентым», «{ $type } лӀэужьыгъуэ». Where
# even that would be clumsy the free postposition «папщӀэ» (for) carries the
# relation, since it governs nothing it has to see. The one place an ending
# does sit next to a value is after a literal `>` or a quote this catalog wrote
# itself — «`<{ $component }>`-м» — where the letter in front of the suffix is
# punctuation the catalog controls and is the same whatever the value is.
#
# The technical vocabulary is the one written Kabardian actually uses:
# Russian-derived where the school subject is taught in Russian («компонент»,
# «атрибут», «индекс», «функцэ», «интервал», «матрицэ»), naturalized with a
# final -э where the Russian ends in -а, and Kabardian where the word is not
# specialist («щыуагъэ» error, «гъэсакъыныгъэ» warning, «убзыхуа» specified,
# «къэлъытэркъым» is ignored). A speaker should check the naturalized loans
# first: whether the textbooks print «функцэ» or «функция» is a fact about
# Kabardian publishing that this seed could not verify.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] кӀэух точкитӀ убзыхуамэ { $attributes } къэлъытэркъым
       *[other] кӀэух точкитӀ убзыхуамэ { $attributes } къэлъытэркъым
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] кӀэух точкэрэ курыт точкэрэ убзыхуамэ { $attributes } къэлъытэркъым
       *[other] кӀэух точкэрэ курыт точкэрэ убзыхуамэ { $attributes } къэлъытэркъым
    }

line-segment-midpoint-offset-without-midpoint = курыт точкэ щымыӀэм деж midpointOffset зыми хуэлажьэркъым

## `<line>`

line-points-undetermined-dimensions = Мардэр убзыхуа мыхъуа точкэхэм пхыкӀ линэ занщӀэ.

line-points-too-few-dimensions = Линэ занщӀэр нэхъ мащӀэ дыдэу мардитӀ зиӀэ точкэхэм пхыкӀын хуейщ.

line-points-depend-on-variables = Линэ занщӀэр зэхъуэкӀыгъуэхэм елъыта точкэхэм пхыкӀщ: { $variables }.

line-equation-invalid-format = { $variable1 }, { $variable2 } зэхъуэкӀыгъуэхэмкӀэ тха линэ занщӀэм и уравненэм и формат тэмэмкъым.

## `<ray>`

ray-overprescribed-through = Нэбзийр through, endpoint икӀи direction яхьэлӀауэ убзыхуащ. Убзыхуа through къэлъытэркъым.

ray-dimension-mismatch = нэбзийм и numDimensions зэтехуэркъым.

## `<vector>`

vector-overprescribed-head = Векторыр head, tail икӀи displacement яхьэлӀауэ убзыхуащ. Убзыхуа head къэлъытэркъым.

vector-dimension-mismatch = векторым и numDimensions зэтехуэркъым.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` компонентым хуэшэн хъунукъым, абы nearestPoint зыфӀаща щытыкӀэ зэхъуэкӀыгъуэ иӀэкъыми.

constrain-to-without-nearest-point = `<{ $component }>` компонентым хуэгъэувын хъунукъым, абы nearestPoint зыфӀаща щытыкӀэ зэхъуэкӀыгъуэ иӀэкъыми.

constrain-to-interior-without-nearest-point = `<{ $component }>` компонентым и кӀуэцӀым хуэгъэувын хъунукъым, абы nearestPoint зыфӀаща щытыкӀэ зэхъуэкӀыгъуэ иӀэкъыми.

## `<choiceInput>`

choice-input-label-position-ignored = inline мыхъу choiceInput-м labelPosition къыщалъытэркъым

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput папщӀэ убзыхуа индексхэр къэлъытэркъым: индексхэм я бжыгъэмрэ choice кӀуэцӀ элементхэм я бжыгъэмрэ зэтехуэркъым.

pretzel-indices-count-mismatch = problem папщӀэ убзыхуа индексхэр къэлъытэркъым: индексхэм я бжыгъэмрэ problem кӀуэцӀ элементхэм я бжыгъэмрэ зэтехуэркъым.

shuffle-indices-count-mismatch = shuffle папщӀэ убзыхуа индексхэр къэлъытэркъым: индексхэм я бжыгъэмрэ компонентхэм я бжыгъэмрэ зэтехуэркъым.

indices-ignored-out-of-range = { $component } папщӀэ убзыхуа индексхэр къэлъытэркъым: зыкъом гъунапкъэм икӀащ.

pretzel-indices-repeated = pretzel папщӀэ убзыхуа индексхэр къэлъытэркъым: зыкъом къытрагъэзэжащ.

pretzel-circuit-first-index = circuit хабзэм тету лажьэ pretzel папщӀэ убзыхуа индексхэр къэлъытэркъым: япэ индексыр 1 хъун хуейщ.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` строкэ кӀуэцӀ элементхэм ядэлэжьэн папщӀэ `type` атрибут убзыхуа хъун хуейщ.

invalid-type-defaulting-to-math = { $component } компонентым и type { $type } тэмэмкъым. math, text, number е boolean хъун хуейщ. math къащтэ.

string-not-valid-component-to-arrange = "{ $value }" строкэр { $component } папщӀэ компонент тэмэмкъым. Къэлъытэркъым.

## Types and variables

invalid-type-defaulting-to-number = { $type } лӀэужьыгъуэр тэмэмкъым, number къащтэ.

invalid-variable-value = ЗэхъуэкӀыгъуэм и мыхьэнэ тэмэмкъым: `{ $value }`

## Variants

variant-index-must-be-number = Вариантым и индекс { $index } бжыгъэ хъун хуейщ

variant-index-must-be-integer = Вариантым и индекс { $index } бжыгъэ псо хъун хуейщ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют мардэхэм хуэгъэпсакъым. Бгъуагъхэр зэпэлъытауэ ягъэувщ.

side-by-side-absolute-margins = `<{ $component }>` абсолют мардэхэм хуэгъэпсакъым. Гъунапкъэхэр зэпэлъытауэ ягъэувщ.

side-by-side-no-block-child = `<{ $component }>` тэмэмкъым: блок кӀуэцӀ элементу зы нэхъ мыхъуми иӀэн хуейщ.

## `<label>`

label-for-ignored-on-graphical = Графикэ `<label>`-м тет `for` атрибутыр къэлъытэркъым.

label-for-must-resolve-to-one = `<label>`-м тет `for` атрибутым зы компонент закъуэ къигъэлъагъуэ хъун хуейщ.

label-for-unresolved = `<label>`-м тет `for` атрибутым компонент къригъэлъэгъуэн хъуакъым.

label-for-answer-with-authored-inputs = `<label>`-м тет `for` атрибутым и гугъу ищӀыр авторым езым итха хэлъхьапӀэхэр зиӀэ `<answer>`-щ; хэлъхьапӀэм занщӀэу тегъэпсыхь.

label-for-answer-without-input = `<label>`-м тет `for` атрибутым и гугъу ищӀыр хэлъхьапӀэ зимыӀэ `<answer>`-щ.

label-for-must-reference-input-or-answer = `<label>`-м тет `for` атрибутым хэлъхьапӀэ е жэуап и гугъу ищӀын хуейщ.

## Accessibility

accessibility-short-description-or-decorative = Ӏэрыхуагъэм папщӀэ `<{ $component }>` компонентым гурыӀуэгъуэ кӀэщӀ иӀэн хуейщ, армырамэ гъэщӀэрэщӀэн хуэдэу убзыхуа хъун хуейщ.

accessibility-video-short-description = Ӏэрыхуагъэм папщӀэ `<video>`-м гурыӀуэгъуэ кӀэщӀ иӀэн хуейщ.

accessibility-input-short-description-or-label = Ӏэрыхуагъэм папщӀэ `<{ $component }>` компонентым гурыӀуэгъуэ кӀэщӀ е фӀэщыгъэцӀэ иӀэн хуейщ.

accessibility-answer-input-short-description-or-label = Ӏэрыхуагъэм папщӀэ хэлъхьапӀэ къэзыгъэщӀ `<answer>`-м гурыӀуэгъуэ кӀэщӀ е фӀэщыгъэцӀэ иӀэн хуейщ.

accessibility-short-description-contains-math = ГурыӀуэгъуэ кӀэщӀхэм `<{ $component }>` хуэдэ математикэ компонентхэр хэмытын хуейщ. Математикэр псалъэкӀэ къэӀуэтэж.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Пычыгъуэм и щхьэм и текстым папщӀэ { $colorName } и контрастыр икъукъым (фӀыцӀафэ хабзэм) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; нэхъ мащӀэ дыдэу { $threshold }:1 хуейщ).
       *[other] Пычыгъуэм и щхьэм и текстым папщӀэ { $colorName } и контрастыр икъукъым ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; нэхъ мащӀэ дыдэу { $threshold }:1 хуейщ).
    }

## `<circle>`

circle-through-points-non-numerical = Точкэ { $count } пхыкӀ `<circle>`, а точкэхэм бжыгъэ мыхьэнэ ямыӀэу, иджыри зэфӀагъэкӀакъым.

circle-too-many-through-points = Точкэ 3-м нэхъыбэм пхыкӀ хъурей къэлъытэн хъунукъым.

circle-overprescribed-radius-center-points = Радиусри центри пхыкӀ точкэхэри убзыхуауэ хъурей къэлъытэн хъунукъым.

circle-center-with-multiple-points = Центр убзыхуауэ, точкэ 1-м нэхъыбэм пхыкӀ хъурей къэлъытэн хъунукъым.

circle-radius-too-small = Хъурей къэлъытэн хъунукъым: точкитӀым я зэхуакур { $distance } щыхъукӀэ, убзыхуа радиус { $radius } цӀыкӀу дыдэщ.

circle-radius-with-many-points = Радиус убзыхуауэ, точкитӀым нэхъыбэм пхыкӀ хъурей къэгъэщӀын хъунукъым.

circle-invalid-center-or-through-points = Хъурейм и центр е пхыкӀ точкэхэр тэмэмкъым.

circle-radius-center-with-multiple-points = Центр убзыхуауэ, точкэ 1-м нэхъыбэм пхыкӀ хъурейм и радиус къэлъытэн хъунукъым.

circle-change-radius-non-numerical = Бжыгъэ мыхьэнэ зимыӀэ точкэхэм пхыкӀ хъурейм и радиус зэхъуэкӀын хъунукъым

circle-radius-with-points-non-numerical = Бжыгъэ мыхьэнэ щымыӀэм деж, радиус убзыхуауэ зы точкэм нэхъыбэм пхыкӀ хъурей къэгъэщӀын хъунукъым.

circle-change-center-non-numerical = Бжыгъэ мыхьэнэ зимыӀэ точкэхэм пхыкӀ хъурейм и центр зэхъуэкӀыныр иджыри зэфӀагъэкӀакъым.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцэм и областым и мардэхэр икъукъым. Областым интервал { $intervals } иӀэщ, ауэ функцэм { $inputs ->
            [one] хэлъхьэныгъэ { $inputs }
           *[other] хэлъхьэныгъэ { $inputs }
        } иӀэщ.
       *[other] Функцэм и областым и мардэхэр икъукъым. Областым интервал { $intervals } иӀэщ, ауэ функцэм { $inputs ->
            [one] хэлъхьэныгъэ { $inputs }
           *[other] хэлъхьэныгъэ { $inputs }
        } иӀэщ.
    }

function-domain-invalid-format = Функцэм и областым и формат тэмэмкъым.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцэм и максимум бжыгъэ мыхъур къэлъытэркъым.
        [minimum] Функцэм и минимум бжыгъэ мыхъур къэлъытэркъым.
        [extremum] Функцэм и экстремум бжыгъэ мыхъур къэлъытэркъым.
        [point] Функцэм и точкэ бжыгъэ мыхъур къэлъытэркъым.
        [slope] Функцэм и наклон бжыгъэ мыхъур къэлъытэркъым.
       *[other] Функцэм и { $type } бжыгъэ мыхъур къэлъытэркъым.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцэм и максимум нэщӀыр къэлъытэркъым.
        [minimum] Функцэм и минимум нэщӀыр къэлъытэркъым.
        [extremum] Функцэм и экстремум нэщӀыр къэлъытэркъым.
        [point] Функцэм и точкэ нэщӀыр къэлъытэркъым.
       *[other] Функцэм и { $type } нэщӀыр къэлъытэркъым.
    }

function-points-too-close = Функцэм и точкитӀ зэпэгъунэгъу дыдэщ. Функцэ убзыхун хъунукъым.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функцэм и итерацэхэр хъунур хэлъхьэныгъэхэм я бжыгъэмрэ къыдэкӀыгъуэхэм я бжыгъэмрэ зэхуэдэу щытмэщ. Мы функцэм хэлъхьэныгъэ { $inputs } икӀи { $outputs ->
            [one] къыдэкӀыгъуэ { $outputs }
           *[other] къыдэкӀыгъуэ { $outputs }
        } иӀэщ.
       *[other] Функцэм и итерацэхэр хъунур хэлъхьэныгъэхэм я бжыгъэмрэ къыдэкӀыгъуэхэм я бжыгъэмрэ зэхуэдэу щытмэщ. Мы функцэм хэлъхьэныгъэ { $inputs } икӀи { $outputs ->
            [one] къыдэкӀыгъуэ { $outputs }
           *[other] къыдэкӀыгъуэ { $outputs }
        } иӀэщ.
    }

## `<sequence>`

sequence-invalid-length = ЗэкӀэлъыкӀуэныгъэм и кӀыхьагъ тэмэмкъым. Нулым нэхъ мащӀэ мыхъу бжыгъэ псо хъун хуейщ.

sequence-invalid-step = ЗэкӀэлъыкӀуэныгъэм и лъэбакъуэ тэмэмкъым. { $type } лӀэужьыгъуэ зиӀэ зэкӀэлъыкӀуэныгъэм папщӀэ бжыгъэ хъун хуейщ.

sequence-invalid-endpoint-number = Бжыгъэ зэкӀэлъыкӀуэныгъэм и "{ $attribute }" тэмэмкъым. Бжыгъэ хъун хуейщ.

sequence-invalid-endpoint-letters = Хьэрф зэкӀэлъыкӀуэныгъэм и "{ $attribute }" тэмэмкъым. Хьэрф зэгухьэныгъэ хъун хуейщ.

sequence-invalid-endpoint = ЗэкӀэлъыкӀуэныгъэм и "{ $attribute }" тэмэмкъым.

select-from-sequence-coprime-not-numbers = бжыгъэхэр къыхэмыхыу coprime къэлъытэркъым

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations убзыхуауэ coprime къэлъытэркъым

## Resolving a `target`

target-not-found = `<{ $source }>` папщӀэ target тэмэмкъым: target къэгъуэтакъым.

target-state-variable-not-found = `<{ $source }>` папщӀэ target тэмэмкъым: `<{ $component }>` компонентым "{ $property }" зыфӀаща щытыкӀэ зэхъуэкӀыгъуэ къыщагъуэтакъым.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-м и зэхъуэкӀыгъуэхэр щхьэхуит зэхъуэкӀыгъуэм щхьэщыкӀын хуейщ.

ode-system-duplicate-variable-names = Зэхуэдэ цӀэ зиӀэ зэхъуэкӀыгъуэхэр яӀэу ОДУ-м и функцэхэр убзыхун хъунукъым.

ode-system-rhs-function-error = ОДУ-м и функцэ убзыхун хъунукъым. mathjs функцэ къэгъэщӀыныгъэм щыуагъэ хэлъщ.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Линэ занщӀэ { $count } я зэхуаку дэлъ къуапэ убзыхун хъунукъым

angle-invalid-through-point = `<angle>`-м и through-м хэт точкэ тэмэмкъым

parabola-vertex-too-many-points = Вершинэ иӀэу, точкэ 1-м нэхъыбэм пхыкӀ параболэр иджыри зэфӀагъэкӀакъым.

parabola-too-many-points = Точкэ 3-м нэхъыбэм пхыкӀ параболэр иджыри зэфӀагъэкӀакъым.

intersection-too-many-items = ТӀум нэхъыбэ Ӏыхьэхэм я зэблэкӀыпӀэр иджыри зэфӀагъэкӀакъым

## Other math components

ionic-compound-not-two-ions = Ион зэгухьэныгъэр ионитӀ фӀэкӀ зимыӀэм иджыри зэфӀагъэкӀакъым.

ionic-compound-needs-cation-and-anion = Ион зэгухьэныгъэр зы катионрэ зы анионрэ фӀэкӀ хъуркъым.

solve-equations-cannot-evaluate = Уравненэр къэлъытэн зэрымыхъуам къыхэкӀыу зэхэгъэкӀын хъунукъым: { $equation }

math-operators-operand-number-required = Математикэ операнд къыхэпхын папщӀэ operandNumber убзыхун хуейщ.

eigen-decomposition-failed = Матрицэм и собственнэ мыхьэнэхэр къэлъытэн хъуакъым

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметрыр шаблоным хэткъым, аращи сыт щыгъуи нэщӀым техуэнущ.
       *[other] `<matchesPattern>`: { $parameters } параметрхэр шаблоным хэткъым, аращи сыт щыгъуи нэщӀым техуэнущ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" зэхэгъэкӀын хъунукъым. none, medium, dense е зэхуакукӀэ зэпэӀэщӀа позитив бжыгъитӀ хъун хуейщ, псалъэм папщӀэ grid="1 0.5". Сеткэ ящӀыркъым.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` компонентым { $expected ->
        [one] зы къыдэкӀыгъуэ — точкэ къэс наклон y', псалъэм папщӀэ `y - x` —
       *[other] къыдэкӀыгъуитӀ — точкэ къэс вектор, псалъэм папщӀэ `(y, -x)` —
    } зиӀэ функцэ хуейщ, ауэ къыратам { $found ->
        [one] къыдэкӀыгъуэ { $found }
       *[other] къыдэкӀыгъуэ { $found }
    } иӀэщ. { $alternative ->
        [none] Зыри ящӀыркъым.
       *[other] А функцэм папщӀэ компонентыр `<{ $alternative }>` аращ. Зыри ящӀыркъым.
    }

field-function-attribute-ignored-with-child = `function` атрибутыр къэлъытэркъым, функцэр компонентым и кӀуэцӀми итщи; кӀуэцӀым итырщ къагъэсэбэпыр. Функцэр зы щӀыкӀэкӀэ фӀэкӀ умыт.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибутым и гугъу ищӀыр компонентым и кӀуэцӀым занщӀэу итха къэгъэлъэгъуэныгъэм и зэхъуэкӀыгъуэхэрщ. { $reason ->
        [function-child] Мыбдеж функцэр `<function>` кӀуэцӀ элементу ятащ, абы езым и зэхъуэкӀыгъуэхэр къегъэлъагъуэ, аращи `variables` къэлъытэркъым.
       *[no-expression] Мыбдеж апхуэдэ къэгъэлъэгъуэныгъэ щыӀэкъым, аращи `variables` къэлъытэркъым.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure къэгъэлъэгъуакӀуэм xLabelPosition="left" щыдэӀыгъкъым; ижьымкӀэ щыт хабзэр къагъэсэбэп.

prefigure-y-label-position-unsupported = `<graph>`: prefigure къэгъэлъэгъуакӀуэм yLabelPosition="bottom" щыдэӀыгъкъым; щхьэщыгум щыт хабзэр къагъэсэбэп.

prefigure-invalid-axis-bounds = `<graph>`: prefigure зэрахъуэкӀыныгъэм папщӀэ осьхэм я гъунапкъэхэр тэмэмкъым; хабзэ bbox (-10,-10,10,10) къагъэсэбэп.

prefigure-invalid-width = `<graph>`: prefigure зэрахъуэкӀыныгъэм папщӀэ бгъуагъыр тэмэмкъым; хабзэ бгъуагъ 425 къагъэсэбэп.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure зэрахъуэкӀыныгъэм папщӀэ aspectRatio тэмэмкъым; хабзэ зэхэлъыкӀэ 1 къагъэсэбэп.

prefigure-grid-spacing-too-fine = `<graph>`: сеткэм и зэхуакухэр осьхэм я гъунапкъэхэм тещӀыхьауэ цӀыкӀу дыдэщ; prefigure къэгъэлъэгъуакӀуэм сеткэр щыхагъэкӀ.

prefigure-annotations-not-rendered = `<graph>`: PreFigure къэгъэлъэгъуакӀуэр къэмыгъэсэбэпмэ, аннотацэхэр къагъэлъэгъуэнукъым.

multiple-annotations-children = `<graph>`-м `<annotations>` кӀуэцӀ элемент зыбжанэ къыщагъуэтащ; иужьрейм фӀэкӀ къэлъытэркъым.

## Referring to other components

copy-unrecognized-component-type = КъамыцӀыху компонент лӀэужьыгъуэ хэгъэхъуэн е тещӀыкӀын хъунукъым: { $type }.

copy-prop-not-found = { $component } лӀэужьыгъуэ зиӀэ компонентым { $property } prop къыщагъуэтакъым

collect-no-source = collect папщӀэ къежьапӀэ къэгъуэтакъым.

collect-invalid-component-type = `<{ $component }>` лӀэужьыгъуэ зиӀэ компонентхэр зэхуэхьэсын хъунукъым, а лӀэужьыгъуэр тэмэмкъыми.

reference-index-unavailable = `{ $reference }` индексым и гугъу пщӀын хъунукъым

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентым { $action } щыпщӀэн хъунукъым

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Даннэхэм я теплъэ тэмэмкъым. Сатырхэм я кӀыхьагъхэр зэхуэдэкъым. Къыщагъуэтар componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Даннэхэм зэхуэдэ столбец цӀэхэр яхэтщ. Къыщагъуэтар componentIdx :{ $componentIdx }

data-frame-missing-column-name = Даннэхэм столбец цӀэ ящыщ зы щыщӀэщ. Къыщагъуэтар componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Мы жэуапым и award-р answer тегым езым игъэхьа жэуапым тещӀыхьащ, ар мыхъумыщӀэу лэжьэнущ.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` зиӀэ кӀуэцӀым щӀэт `<answer>`-м `maxNumAttempts` тегъэувэным мыхьэнэ иӀэкъым, гъэунэхуныгъэхэм я бжыгъэр кӀуэцӀым иубзыхуми. `maxNumAttempts` кӀуэцӀым тегъэувэ.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` зиӀэ нэгъуэщӀ кӀуэцӀым щӀэт, `sectionWideCheckWork` зиӀэ кӀуэцӀым `maxNumAttempts` тегъэувэным мыхьэнэ иӀэкъым, гъэунэхуныгъэхэм я бжыгъэр щӀыбагъ кӀуэцӀым иубзыхуми. `maxNumAttempts` щӀыбагъ кӀуэцӀым тегъэувэ.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality убзыхуа мыхъумэ { $attributes } атрибутым мыхьэнэ иӀэнукъым.
       *[other] symbolicEquality убзыхуа мыхъумэ { $attributes } атрибутхэм мыхьэнэ яӀэнукъым.
    }

answer-invalid-type = Жэуапым и лӀэужьыгъуэ тэмэмкъым: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентым цӀэ иӀэкъыми, модулым и атрибуту къэбгъэсэбэп хъунукъым

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентыр модулым и атрибуту къэбгъэсэбэп хъунукъым, `<module>` лӀэужьыгъуэм "{ $name }" атрибут иӀэжщи.

conditional-content-condition-ignored = case е else кӀуэцӀ элементхэр зиӀэ `<conditionalContent>` компонентым `condition` атрибутыр къыщалъытэркъым.

slider-markers-type-mismatch = Маркерхэм я лӀэужьыгъуэр слайдерым и лӀэужьыгъуэм зэтехуэркъым.

pretzel-problem-needs-statement-and-answer = pretzel тэмэмкъым: `<problem>` къэс зы `<statement>`-рэ зы `<answer>`-рэ хэтын хуейщ.

pretzel-circuit-first-problem-distractor = pretzel тэмэмкъым: mode="circuit" щыгъуэ япэ `<problem>`-р дистрактор хъун хуейкъым.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибутым и мыхьэнэ { $values } тэмэмкъым; къэлъытэркъым.
       *[other] `{ $attribute }` атрибутым и мыхьэнэхэр { $values } тэмэмкъым; къэлъытэркъым.
    }

attribute-must-be-references = `{ $attribute }` атрибутым и мыхьэнэ `{ $value }` тэмэмкъым. Атрибутыр `$`-кӀэ къыщӀэздзэ пыщӀэхэмкӀэ зэхэлъын хуейщ.

math-input-invalid-function-names = <mathInput>: { $attribute } папщӀэ функцэ цӀэ тэмэм мыхъухэр къэлъытакъым: { $names }. ЦӀэ къэс и къэгъэлъэгъуапӀэ Ӏыхьэм нэхъ мащӀэ дыдэу дамыгъитӀ (хьэрф е дефис) хэтын хуейщ; абы яужь `|<mathspeak alternative>` кӀэух къыкӀэлъыкӀуэ хъунущ.

## Building components from the source

component-type-invalid = Компонент лӀэужьыгъуэ тэмэмкъым: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутым къытебгъэзэж хъунукъым.

attribute-invalid-for-component = `<{ $componentType }>` лӀэужьыгъуэ зиӀэ компонентым папщӀэ "{ $attribute }" атрибутыр тэмэмкъым.

## Style definition contrast

style-definition-insufficient-contrast =
    Стиль убзыхуныгъэ { $styleNumber }: { $context ->
        [text-on-background] текстым и плъыфэр фоным и плъыфэм пэщӀэту
        [high-contrast] контраст лъагэ зиӀэ плъыфэр холстым пэщӀэту
        [line] линэм и плъыфэр холстым пэщӀэту
        [marker] маркерым и плъыфэр холстым пэщӀэту
       *[text-on-canvas] текстым и плъыфэр холстым пэщӀэту
    } контрастыр икъукъым{ $mode ->
        [dark] { " (фӀыцӀафэ хабзэм)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; нэхъ мащӀэ дыдэу { $threshold }:1 хуейщ).

style-definition-dark-mode-text-background-contrast =
    Стиль убзыхуныгъэ { $styleNumber }: убзыхуа плъыфэхэм нэхуфэ хабзэм папщӀэ контраст икъу яӀэ пэтми, а мыхьэнэхэм къатехъукӀа фӀыцӀафэ хабзэм и плъыфэхэм текстымрэ фонымрэ я зэхуаку контраст икъу дэлъкъым ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; нэхъ мащӀэ дыдэу { $threshold }:1 хуейщ). { $suggestion ->
        [available] ФӀыцӀафэ хабзэм контраст икъу щыгъуэтын папщӀэ, е нэхуфэ хабзэм и контрастыр гъэбагъуэ (псалъэм папщӀэ, { $lightAttribute }="{ $lightColor }" гъэув), е фӀыцӀафэ хабзэм и плъыфэр зэхъуэкӀ (псалъэм папщӀэ, { $darkAttribute }="{ $darkColor }" гъэув).
       *[none] ФӀыцӀафэ хабзэм контраст икъу щыгъуэтын папщӀэ, нэхуфэ хабзэм и контрастыр гъэбагъуэ, армырамэ къатехъукӀа плъыфэхэр textColorDarkMode икӀи/е backgroundColorDarkMode къэбгъэсэбэпкӀэ зэхъуэкӀ.
    }

style-definition-dark-mode-text-canvas-contrast =
    Стиль убзыхуныгъэ { $styleNumber }: убзыхуа текст плъыфэм нэхуфэ хабзэм папщӀэ контраст икъу иӀэ пэтми, а мыхьэнэм къытехъукӀа фӀыцӀафэ хабзэм и текст плъыфэм холстым пэщӀэту контраст икъу иӀэкъым ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; нэхъ мащӀэ дыдэу { $threshold }:1 хуейщ). { $suggestion ->
        [available] ФӀыцӀафэ хабзэм контраст икъу щыгъуэтын папщӀэ, е нэхуфэ хабзэм и контрастыр гъэбагъуэ (псалъэм папщӀэ, textColor="{ $lightColor }" гъэув), е фӀыцӀафэ хабзэм и плъыфэр зэхъуэкӀ (псалъэм папщӀэ, textColorDarkMode="{ $darkColor }" гъэув).
       *[none] ФӀыцӀафэ хабзэм контраст икъу щыгъуэтын папщӀэ, нэхуфэ хабзэм и контрастыр гъэбагъуэ, армырамэ къытехъукӀа плъыфэр textColorDarkMode къэбгъэсэбэпкӀэ зэхъуэкӀ.
    }

section-multiple-style-palettes = Пычыгъуэм зы <stylePalette> фӀэкӀ къыхихын хъунукъым; иужьрейр къагъэсэбэп.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } и вариант щхьэхуэхэр убзыхун хъунукъым, numToSelect нулым нэхъ мащӀэ мыхъу бжыгъэ псо хъуркъыми.

variant-num-to-select-not-constant-number = { $component } и вариант щхьэхуэхэр убзыхун хъунукъым, numToSelect зэмыхъуэж бжыгъэ хъуркъыми.

variant-with-replacement-not-constant-boolean = { $component } и вариант щхьэхуэхэр убзыхун хъунукъым, withReplacement зэмыхъуэж булев хъуркъыми.

variant-select-weight-disables-unique = selectWeight е selectForVariants зиӀэ вариант щыӀэмэ, select-м и вариант щхьэхуэхэр къагъэсэбэпыркъым

variant-coprime-undetermined = { $component } и вариант щхьэхуэхэр убзыхун хъунукъым, coprime сыт щыгъуи пцӀыуэ щытыныр убзыхун зэрымыхъум къыхэкӀыу.

variant-attribute-not-constant = { $component } и вариант щхьэхуэхэр убзыхун хъунукъым, { $attribute } зэмыхъуэжу щыткъыми.

variant-attribute-not-number = { $component } и вариант щхьэхуэхэр убзыхун хъунукъым, { $attribute } бжыгъэ хъуркъыми.

variant-attribute-wrong-type-for-sequence =
    { $type } лӀэужьыгъуэ зиӀэ { $component } и вариант щхьэхуэхэр убзыхун хъунукъым, { $attribute } { $expected ->
        [letters-combination] хьэрф зэгухьэныгъэ
        [math-expression] математикэ къэгъэлъэгъуэныгъэ тэмэм
        [integer] бжыгъэ псо
       *[number] бжыгъэ
    } хъуркъыми.

variant-length-not-integer = { $component } и вариант щхьэхуэхэр убзыхун хъунукъым, length бжыгъэ псо хъуркъыми.

variant-sort-not-implemented = sort зиӀэ { $component } и вариант щхьэхуэхэр иджыри зэфӀагъэкӀакъым

variant-exclude-combinations-not-implemented = excludeCombinations зиӀэ { $component } и вариант щхьэхуэхэр иджыри зэфӀагъэкӀакъым

variant-math-exclude-not-implemented = exclude зиӀэ math лӀэужьыгъуэ { $component } и вариант щхьэхуэхэр иджыри зэфӀагъэкӀакъым

variant-non-constant-exclude-not-implemented = зэхъуэкӀыж exclude зиӀэ { $component } и вариант щхьэхуэхэр иджыри зэфӀагъэкӀакъым

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure къэгъэлъэгъуакӀуэм щыдэӀыгъкъым; къытехъукӀар хагъэкӀащ.

prefigure-descendant-invalid-geometry = { $subject }: геометриер мыухауэ е бжыгъэ гъунапкъэншэу; къытехъукӀар хагъэкӀащ.

prefigure-curve-label-omitted = { $subject }: зэрахъуэкӀа линэ гъэшахэм фӀэщыгъэцӀэ ятрагъэувэн хъуркъым; фӀэщыгъэцӀэр хагъэкӀащ.

prefigure-curve-unsupported-definition-type = { $subject }: линэ гъэшам и функцэ убзыхуныгъэ лӀэужьыгъуэ '{ $definitionType }' щыдэӀыгъкъым; къытехъукӀар хагъэкӀащ.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves-м тет flipFunctions атрибутыр щыдэӀыгъкъым; къытехъукӀар хагъэкӀащ.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves-м формулэ лӀэужьыгъуэ зиӀэ функцэ кӀуэцӀ элементхэр фӀэкӀ щыдэӀыгъкъым; къытехъукӀар хагъэкӀащ.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] линэ лъэпкъым и фӀэщыгъэцӀэм
       *[point] точкэм и фӀэщыгъэцӀэм
    } папщӀэ labelPosition '{ $labelPosition }' щыдэӀыгъкъым; PreFigure и хабзэ зэгъэуцуэкӀэр къагъэсэбэп.

prefigure-fill-style-unsupported = { $subject }: изыгъэ лӀэужьыгъуэ '{ $fillStyle }' PreFigure-м щыдэӀыгъкъым; зэпымыу изыгъэ къагъэсэбэп.

prefigure-line-style-unknown = { $subject }: линэ лӀэужьыгъуэ къамыцӀыху '{ $lineStyle }' PreFigure-м и къыдэкӀыгъуэм хагъэкӀащ.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер лӀэужьыгъуэ '{ $markerStyle }' PreFigure и 'diamond' лӀэужьыгъуэм хуагъэкӀуащ.

prefigure-marker-style-unsupported = { $subject }: маркер лӀэужьыгъуэ '{ $markerStyle }' PreFigure-м щыдэӀыгъкъым; хабзэ лӀэужьыгъуэр къагъэсэбэп.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` тэмэмкъым; зыхуэгъэзар къэгъуэтын хъуакъым. Аннотацэр хагъэкӀащ.

annotation-ref-multiple-targets = `<annotation>`: `ref`-м зыхуэгъэза зыбжанэ къигъэлъэгъуащ; япэрейр къагъэсэбэп.

annotation-ref-outside-graph = `<annotation>`: `ref` тэмэмкъым; зыхуэгъэзар графикым и щӀыбагъ къонэ. Аннотацэр хагъэкӀащ.

annotation-ref-unsupported-target = `<annotation>`: `ref` тэмэмкъым; зыхуэгъэзар prefigure зэрахъуэкӀыныгъэм щыдэӀыгъ графикэ объект хъуркъым. Аннотацэр хагъэкӀащ.

annotation-text-missing = `<annotation>`: `text` щыӀэкъым е нэщӀщ; текст нэщӀ къыдагъэкӀ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Хъурей елъытыныгъэ къэгъуэтащ.
       *[other] `<{ $componentType }>` компонентым епха хъурей елъытыныгъэ къэгъуэтащ.
    }

reference-no-referent = ПыщӀэм и объект къэгъуэтакъым: `{ $reference }`

reference-multiple-referents = ПыщӀэм и объект куэд къэгъуэтащ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` и { $attribute } атрибутым и формат тэмэмкъым.

children-invalid = `<{ $componentType }>` папщӀэ кӀуэцӀ элементхэр тэмэмкъым: тэмэм мыхъу кӀуэцӀ элементхэр къэгъуэтащ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутым и мыхьэнэ `{ $value }` тэмэмкъым, `{ $default }` мыхьэнэр къагъэсэбэп

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML верси { $version } къэгъуэтакъым.
       *[other] DoenetML верси { $version } къэгъуэтакъым. Верси { $fallback } къагъэсэбэп
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML тэмэмкъым: { $content }

parse-tag-missing-close-tag = DoenetML тэмэмкъым: `{ $tag }` тегым зэхуэзыщӀыж тег иӀэкъым. Езыр зэхуэзыщӀыж тег е `</{ $tagName }>` тег хуейщ.

parse-tag-error = DoenetML тэмэмкъым: `<{ $tagName }>` тегым щыуагъэ хэлъщ

parse-attribute-missing-value = DoenetML тэмэмкъым: `{ $attribute }` атрибутыр тэмэмкъым, мыхьэнэ иӀэкъым хуэдэщ.

parse-attribute-invalid = DoenetML тэмэмкъым: `{ $attribute }` атрибутыр тэмэмкъым

parse-attribute-value-invalid = DoenetML тэмэмкъым: `{ $value }` атрибут мыхьэнэр тэмэмкъым

parse-attribute-value-quote-mismatch = DoenetML тэмэмкъым: `{ $value }` атрибут мыхьэнэр тэмэмкъым. Кавычкэхэр зэтехуэркъым. `{ $quote }` щыщӀэ хуэдэщ

parse-open-tag-name-missing = DoenetML тэмэмкъым: цӀэ зимыӀэ тег къэгъуэтащ, псалъэм папщӀэ `<`

parse-tag-not-closed = DoenetML тэмэмкъым: `{ $tag }` тегыр зэхуащӀыжакъым (`>` щыщӀэ хуэдэщ).

parse-self-closing-tag-name-missing = DoenetML тэмэмкъым: цӀэ зимыӀэ тег къэгъуэтащ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML тэмэмкъым: `{ $tag }` тегыр зэхуащӀыжакъым (`/>` щыщӀэ хуэдэщ).

parse-tag-invalid-attributes = DoenetML тэмэмкъым: `{ $tag }` тегыр тэмэмкъым. Атрибут мытэмэмхэр иӀэнкӀэ хъунущ.

parse-close-tag-name-missing = DoenetML тэмэмкъым: цӀэ зимыӀэ зэхуэщӀыж тег къэгъуэтащ, псалъэм папщӀэ `</`

parse-attribute-value-unquoted = Атрибут мыхьэнэхэр кавычкэхэм яку дэтын хуейщ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML тэмэмкъым: `{ $tag }` зэхуэщӀыж тег къэгъуэтащ, ауэ абы хуэкӀуэ Ӏуих тег щыӀэкъым

parse-close-tag-mismatched = DoenetML тэмэмкъым: зэхуэщӀыж тегыр зэтехуэркъым. `</{ $expected }>` хуейт. Къэгъуэтар `{ $found }`

parser-node-unconvertible = { $node } узелыр Dast узелу зэхъуэкӀын хъуакъым.

## Names

name-attribute-invalid =
    name='{ $name }' атрибут цӀэр тэмэмкъым. { $reason ->
        [characters] ЦӀэхэм хьэрфхэр, бжыгъэхэр, щӀэдз линэхэр е дефисхэр фӀэкӀ хэт хъунукъым.
       *[start] ЦӀэхэр хьэрфкӀэ къыщӀэдзэн хуейщ.
    }

component-name-invalid-start = Компонент цӀэ "{ $name }" тэмэмкъым. ЦӀэхэр хьэрфкӀэ къыщӀэдзэн хуейщ.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched лӀэужьыгъуэ зиӀэ жэуапым video атрибут иӀэн хуейщ

answer-video-watched-video-not-reference = videoWatched лӀэужьыгъуэ зиӀэ жэуапым и video атрибутыр пыщӀэ хъун хуейщ

answer-name-not-single-text = Жэуапым и name атрибутым зы текст кӀуэцӀ элемент закъуэ иӀэн хуейщ

## Referencing another document

external-doenetml-recursion-limit = Рекурсие тӀэгъэ куэд зэрыхъум къыхэкӀыу щӀыб DoenetML къэхьын хъуакъым. Хъурей пыщӀэныгъэ щыӀэ хъункӀэ?

external-doenetml-unavailable = { $attribute }="{ $uri }" DoenetML къыхэхын хъуакъым

external-doenetml-type-mismatch = { $attribute }="{ $uri }" къыхэха DoenetML тэмэмкъым: "{ $componentType }" компонент лӀэужьыгъуэм зэтехуэркъым

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибутыр къагъэсэбэпыжыркъым; и пӀэкӀэ `{ $to }` къэгъэсэбэп.
       *[other] [deprecation] `<{ $component }>`-м тет `{ $from }` атрибутыр къагъэсэбэпыжыркъым; и пӀэкӀэ `{ $to }` къэгъэсэбэп.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибутыр къагъэсэбэпыжыркъым икӀи къэлъытэркъым, `{ $to }` убзыхуащи.
       *[other] [deprecation] `<{ $component }>`-м тет `{ $from }` атрибутыр къагъэсэбэпыжыркъым икӀи къэлъытэркъым, `{ $to }` убзыхуащи.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`-м тет `{ $attribute }` атрибутыр къагъэсэбэпыжыркъым икӀи къэлъытэркъым.

deprecated-attribute-to-child = [deprecation] `<{ $component }>`-м тет `{ $attribute }` атрибутыр къагъэсэбэпыжыркъым; и пӀэкӀэ `<{ $child }>` кӀуэцӀ элемент къэгъэсэбэп.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>`-м тет `{ $attribute }` атрибутым и мыхьэнэ `{ $value }` къагъэсэбэпыжыркъым; и пӀэкӀэ `{ $to }` къэгъэсэбэп.


## Language coverage

pluralize-english-only = `<pluralize>` инджылызыбзэ фӀэкӀ куэдыгъэм хуэгъэкӀуэфыркъым, аращи { $locale } бзэкӀэ тха документым и текстыр зэрыщытауэ къонэ. Куэдыгъэ формэр езыр итхэ, армырамэ `pluralForm` атрибуткӀэ гъэув.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элементыр Doenet элементу къацӀыхуркъым.

schema-element-not-allowed-at-root = `<{ $tag }>` элементыр документым и лъабжьэм щыхуит хъуркъым.

schema-element-not-allowed-inside = `<{ $tag }>` элементыр `<{ $parent }>` и кӀуэцӀым щыхуит хъуркъым.

schema-attribute-unrecognized = `<{ $tag }>` элементым `{ $attribute }` зыфӀаща атрибут иӀэкъым.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементым и `{ $attribute }` атрибутыр список хъун хуейщ, абы хэт Ӏыхьэ къэс мыхэм ящыщ зы хъууэ: { $allowed }
       *[other] `<{ $tag }>` элементым и `{ $attribute }` атрибутыр мыхэм ящыщ зы хъун хуейщ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select папщӀэ вариант цӀэр тэмэмкъым. Вариант цӀэ { $variantName } зыхэт вариантхэм я бжыгъэр { $numOptions }, къыхэхын хуейр { $numToSelect }.

select-variant-name-without-options = select папщӀэ вариантхэр убзыхуащ, ауэ хъуну вариант цӀэ { $variantName } папщӀэ вариант убзыхуакъым.

select-variant-name-not-possible = select папщӀэ убзыхуа вариант цӀэ { $variantName } хъуну вариант цӀэкъым.

select-too-few-options = Компонент { $numOptions } фӀэкӀ щымыӀэм деж компонент { $numToSelect } къыхэхын хъунукъым.

select-from-sequence-too-few-values = КӀыхьагъыр { $length } хъу зэкӀэлъыкӀуэныгъэм мыхьэнэ { $numToSelect } къыхэхын хъунукъым.

select-from-sequence-indices-count-mismatch = select папщӀэ убзыхуа индексхэм я бжыгъэр къыхэхын хуейм и бжыгъэм зэтехуэн хуейщ

select-from-sequence-indices-not-integers = select папщӀэ убзыхуа индекс псори бжыгъэ псо хъун хуейщ

select-from-sequence-index-excluded = selectfromsequence-м и убзыхуа индексыр хагъэкӀат

select-from-sequence-indices-excluded-combination = selectfromsequence-м и убзыхуа индексхэр хагъэкӀа зэгухьэныгъэт

select-from-sequence-coprime-not-positive-integers = Позитив бжыгъэ псохэр къыхамыхыу coprime зэгухьэныгъэхэр къыхэхын хъунукъым.

select-from-sequence-coprime-common-factor = Coprime бжыгъэхэр къыхэхын хъунукъым. Хъуну мыхьэнэ псоми зэхуэдэ множитель яӀэщ. ("from" е "to" я убзыхуа мыхьэнэхэр "step"-м coprime хуэхъун хуейщ.)

select-from-sequence-coprime-single-number = 1 мыхъу зы бжыгъэ закъуэм coprime зэгухьэныгъэхэр къыхэхын хъунукъым.

select-from-sequence-excluded-too-many-combinations = selectFromSequence-м зэгухьэныгъэхэм я 70%-м нэхъыбэ хагъэкӀащ

select-from-sequence-coprime-none-found = Coprime бжыгъэхэр къыхэхын хъуакъым. Хъуну мыхьэнэ псоми зэхуэдэ множитель яӀэщ.

select-from-sequence-too-few-unique-values = КӀыхьагъыр { $numPossibleValues } хъу зэкӀэлъыкӀуэныгъэм мыхьэнэ щхьэхуэ { $numToSelect } къыхэхын хъунукъым

select-prime-numbers-too-few-values = КӀыхьагъыр { $numValues } хъу прост бжыгъэ спискым мыхьэнэ { $numToSelect } къыхэхын хъунукъым

select-prime-numbers-values-count-mismatch = select папщӀэ убзыхуа мыхьэнэхэм я бжыгъэр къыхэхын хуейм и бжыгъэм зэтехуэн хуейщ

select-prime-numbers-values-not-prime = select prime number папщӀэ убзыхуа мыхьэнэ псори прост бжыгъэ спискым хэтын хуейщ

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-м и убзыхуа мыхьэнэхэр хагъэкӀа зэгухьэныгъэт

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-м зэгухьэныгъэхэм я 70%-м нэхъыбэ хагъэкӀащ

select-random-combination-fluke = Хъуфыну мыхъуну насыпыншагъэкӀэ, зэрымыубзыхуа мыхьэнэхэм я зэгухьэныгъэ къыхэхын хъуакъым

select-random-value-fluke = Хъуфыну мыхъуну насыпыншагъэкӀэ, зэрымыубзыхуа мыхьэнэ къыхэхын хъуакъым
