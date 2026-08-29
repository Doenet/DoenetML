# Adyghe (West Circassian) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with Ӏ (palochka), which is a letter and not a Latin I
# or a digit 1. See `content.ftl`'s header for the rest of the orthographic
# note and for the word order the style descriptions use.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Adyghe has no gender and no noun class, so nothing here forks on `$gender`;
# it counts in two plural categories, so every `{ $count -> … }` keeps both
# branches. A noun after a numeral stays singular and the numeral follows it,
# so the two branches of a count usually read alike.
#
# **The technical vocabulary is Russian, and deliberately.** Adygea teaches
# secondary mathematics and computing in Russian, and Adyghe has no settled
# native terms for most of what this file names — «компонент», «атрибут»,
# «функцие», «переменнэ», «последовательность», «индекс», «ссылк». Coining a
# hundred of them for an unreviewed seed would produce a file no Adyghe reader
# could check against the English beside it. Where a native word is confident
# it is used: «щыуагъ» for error, «цӀэ» for name, «пчъагъ» for number,
# «сатыр» for line, «мытэрэз» for invalid.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] кӀэух точкитӀу гъэнэфагъэ хъумэ { $attributes } хэлъытагъэ хъурэп
       *[other] кӀэух точкитӀу гъэнэфагъэ хъумэ { $attributes } хэлъытагъэ хъурэп
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] кӀэух точкэри гузэгу точкэри зэдэгъэнэфагъэ хъумэ { $attributes } хэлъытагъэ хъурэп
       *[other] кӀэух точкэри гузэгу точкэри зэдэгъэнэфагъэ хъумэ { $attributes } хэлъытагъэ хъурэп
    }

line-segment-midpoint-offset-without-midpoint = гузэгу точкэ имыӀэу midpointOffset зи къышӀырэп

## `<line>`

line-points-undetermined-dimensions = Линиер измерениехэр зыгъэнэфагъэ мыхъугъэ точкэхэм апхыры кӀуагъэ.

line-points-too-few-dimensions = Линиер измерениитӀумэ анахь макӀэ зимыӀэ точкэхэм апхырыкӀон фае.

line-points-depend-on-variables = Линиер переменнэхэм ялъытыгъэ точкэхэм апхыры кӀуагъэ: { $variables }.

line-equation-invalid-format = { $variable1 } ыкӀи { $variable2 } переменнэхэмкӀэ линием иуравнение иформат мытэрэз.

## `<ray>`

ray-overprescribed-through = Лучыр through, endpoint ыкӀи direction зэдэгъэнэфагъэ. Гъэнэфэгъэ through хэлъытагъэ хъурэп.

ray-dimension-mismatch = Лучым numDimensions зэтефэрэп.

## `<vector>`

vector-overprescribed-head = Векторыр head, tail ыкӀи displacement зэдэгъэнэфагъэ. Гъэнэфэгъэ head хэлъытагъэ хъурэп.

vector-dimension-mismatch = Векторым numDimensions зэтефэрэп.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` фэпщэн плъэкӀыщтэп, nearestPoint зыфиӀорэ гъэуцугъэ имыӀэшъ.

constrain-to-without-nearest-point = `<{ $component }>` къыгъэуцун плъэкӀыщтэп, nearestPoint зыфиӀорэ гъэуцугъэ имыӀэшъ.

constrain-to-interior-without-nearest-point = `<{ $component }>` ыкӀоцӀ къыгъэуцун плъэкӀыщтэп, nearestPoint зыфиӀорэ гъэуцугъэ имыӀэшъ.

## `<choiceInput>`

choice-input-label-position-ignored = инлайн мыхъурэ choiceInput-мкӀэ labelPosition хэлъытагъэ хъурэп

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-м фэгъэнэфэгъэ индексхэр хэлъытагъэ хъурэп, индексхэм япчъагъэрэ choice сабыйхэм япчъагъэрэ зэтемыфэшъ.

pretzel-indices-count-mismatch = problem-м фэгъэнэфэгъэ индексхэр хэлъытагъэ хъурэп, индексхэм япчъагъэрэ problem сабыйхэм япчъагъэрэ зэтемыфэшъ.

shuffle-indices-count-mismatch = shuffle-м фэгъэнэфэгъэ индексхэр хэлъытагъэ хъурэп, индексхэм япчъагъэрэ компонентхэм япчъагъэрэ зэтемыфэшъ.

indices-ignored-out-of-range = { $component } фэгъэнэфэгъэ индексхэр хэлъытагъэ хъурэп, заулэмэ гъунапкъэр аухыгъэшъ.

pretzel-indices-repeated = pretzel-м фэгъэнэфэгъэ индексхэр хэлъытагъэ хъурэп, заулэ къыкӀэлъэкӀужьышъ.

pretzel-circuit-first-index = circuit режимым итэу pretzel-м фэгъэнэфэгъэ индексхэр хэлъытагъэ хъурэп, апэрэ индексыр 1 хъун фаешъ.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` строкэ сабыйхэм адэлэжьэным пае `type` атрибутыр гъэнэфагъэ хъун фае.

invalid-type-defaulting-to-math = { $component } компонентым итип { $type } мытэрэз. math, text, number е boolean ащыщ хъун фае. math ашъхьадэкӀы.

string-not-valid-component-to-arrange = "{ $value }" строкэр { $component } зыфэдэ компонент тэрэзэп. Хэлъытагъэ хъурэп.

## Types and variables

invalid-type-defaulting-to-number = { $type } тип мытэрэз, типыр number ашъхьадэкӀы.

invalid-variable-value = Переменнэм имэхьанэ мытэрэз: `{ $value }`

## Variants

variant-index-must-be-number = Вариантым индекс { $index } пчъагъэ хъун фае

variant-index-must-be-integer = Вариантым индекс { $index } целэ пчъагъэ хъун фае

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолютнэ мардэхэмкӀэ гъэпсыгъэп. Шъомбгъуагъэхэр относительнэ ашӀых.

side-by-side-absolute-margins = `<{ $component }>` абсолютнэ мардэхэмкӀэ гъэпсыгъэп. Гъунапкъэхэр относительнэ ашӀых.

side-by-side-no-block-child = `<{ $component }>` мытэрэз: зы блок сабый нахь мышӀэми иӀэн фае.

## `<label>`

label-for-ignored-on-graphical = График `<label>`-м `for` атрибутыр хэлъытагъэ хъурэп.

label-for-must-resolve-to-one = `<label>`-м и `for` атрибут зы компонент ныӀэп къыгъэлъэгъон фае.

label-for-unresolved = `<label>`-м и `for` атрибут компонент горэм фэгъэзэгъэ хъугъэп.

label-for-answer-with-authored-inputs = `<label>`-м и `for` атрибут авторым иӀэкӀэ ытхыгъэ инпутхэр зиӀэ `<answer>` фэгъэзагъ; инпутым занкӀэу фэгъазэ.

label-for-answer-without-input = `<label>`-м и `for` атрибут инпут зимыӀэ `<answer>` фэгъэзагъ.

label-for-must-reference-input-or-answer = `<label>`-м и `for` атрибут инпут е джэуап фэгъэзагъэ хъун фае.

## Accessibility

accessibility-short-description-or-decorative = ДоступностымкӀэ `<{ $component }>` кӀэкӀ гъэнэфэн иӀэн е гъэдэхакӀэу гъэнэфагъэ хъун фае.

accessibility-video-short-description = ДоступностымкӀэ `<video>` кӀэкӀ гъэнэфэн иӀэн фае.

accessibility-input-short-description-or-label = ДоступностымкӀэ `<{ $component }>` кӀэкӀ гъэнэфэн е ярлык иӀэн фае.

accessibility-answer-input-short-description-or-label = ДоступностымкӀэ инпут зыгъэпсырэ `<answer>` кӀэкӀ гъэнэфэн е ярлык иӀэн фае.

accessibility-short-description-contains-math = КӀэкӀ гъэнэфэнхэм `<{ $component }>` фэдэ математическэ компонентхэр ахэмытын фае. Математикэр гущыӀэкӀэ къыӀотэн.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } пычыгъом ишъхьэ тхыгъэ икъурэ контраст фыриӀэп (шӀункӀы режим) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; анахь макӀэу { $threshold }:1 ищыкӀагъ).
       *[other] { $colorName } пычыгъом ишъхьэ тхыгъэ икъурэ контраст фыриӀэп ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; анахь макӀэу { $threshold }:1 ищыкӀагъ).
    }

## `<circle>`

circle-through-points-non-numerical = Точкэхэм пчъагъэ мэхьанэ ямыӀэ хъумэ, точкэ { $count } апхырыкӀырэ `<circle>` гъэпсыгъэ хъугъэп.

circle-too-many-through-points = Точкищмэ анахьыбэмэ апхырыкӀырэ хъурай къэлъытэн плъэкӀыщтэп.

circle-overprescribed-radius-center-points = Радиусыр, гупчэр ыкӀи пхырыкӀыпӀэ точкэхэр зэдэгъэнэфагъэу хъурай къэлъытэн плъэкӀыщтэп.

circle-center-with-multiple-points = Гупчэр гъэнэфагъэу зы точкэм анахьыбэмэ апхырыкӀырэ хъурай къэлъытэн плъэкӀыщтэп.

circle-radius-too-small = Хъурайр къэлъытэн плъэкӀыщтэп: точкитӀумэ азыфагу { $distance } зэрэдэлъым тетэу, гъэнэфэгъэ радиус { $radius } макӀэ дэд.

circle-radius-with-many-points = Радиусыр гъэнэфагъэу точкитӀумэ анахьыбэмэ апхырыкӀырэ хъурай гъэпсын плъэкӀыщтэп.

circle-invalid-center-or-through-points = Хъурайм игупчэ е ипхырыкӀыпӀэ точкэхэр мытэрэзых.

circle-radius-center-with-multiple-points = Гупчэр гъэнэфагъэу зы точкэм анахьыбэмэ апхырыкӀырэ хъурайм ирадиус къэлъытэн плъэкӀыщтэп.

circle-change-radius-non-numerical = Пчъагъэ мэхьанэ зимыӀэ точкэхэм апхырыкӀырэ хъурайм ирадиус зэхъокӀын плъэкӀыщтэп

circle-radius-with-points-non-numerical = Пчъагъэ мэхьанэхэр щымыӀэ зыхъукӀэ, радиусыр гъэнэфагъэу зы точкэм анахьыбэмэ апхырыкӀырэ хъурай гъэпсын плъэкӀыщтэп.

circle-change-center-non-numerical = Пчъагъэ мэхьанэ зимыӀэ точкэхэм апхырыкӀырэ хъурайм игупчэ зэхъокӀыныр гъэпсыгъэ хъугъэп.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцием иобласть измерениехэр икъурэп. Областым интервал { $intervals } иӀ, функцием { $inputs ->
            [one] инпут { $inputs }
           *[other] инпут { $inputs }
        } иӀэ хъуми.
       *[other] Функцием иобласть измерениехэр икъурэп. Областым интервал { $intervals } иӀ, функцием { $inputs ->
            [one] инпут { $inputs }
           *[other] инпут { $inputs }
        } иӀэ хъуми.
    }

function-domain-invalid-format = Функцием иобласть иформат мытэрэз.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцием ипчъагъэ мыхъурэ максимум хэлъытагъэ хъурэп.
        [minimum] Функцием ипчъагъэ мыхъурэ минимум хэлъытагъэ хъурэп.
        [extremum] Функцием ипчъагъэ мыхъурэ экстремум хэлъытагъэ хъурэп.
        [point] Функцием ипчъагъэ мыхъурэ точкэ хэлъытагъэ хъурэп.
        [slope] Функцием ипчъагъэ мыхъурэ наклон хэлъытагъэ хъурэп.
       *[other] Функцием ипчъагъэ мыхъурэ { $type } хэлъытагъэ хъурэп.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцием инэкӀы максимум хэлъытагъэ хъурэп.
        [minimum] Функцием инэкӀы минимум хэлъытагъэ хъурэп.
        [extremum] Функцием инэкӀы экстремум хэлъытагъэ хъурэп.
        [point] Функцием инэкӀы точкэ хэлъытагъэ хъурэп.
       *[other] Функцием инэкӀы { $type } хэлъытагъэ хъурэп.
    }

function-points-too-close = Функцием зэпэблэгъэ дэдэ точкитӀу хэт. Функциер гъэнэфэн плъэкӀыщтэп.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функцием иитерациехэр хъущтых инпутхэм япчъагъэрэ аутпутхэм япчъагъэрэ зэфэдэ зыхъукӀэ ныӀэп. Мы функцием инпут { $inputs } ыкӀи { $outputs ->
            [one] аутпут { $outputs }
           *[other] аутпут { $outputs }
        } иӀ.
       *[other] Функцием иитерациехэр хъущтых инпутхэм япчъагъэрэ аутпутхэм япчъагъэрэ зэфэдэ зыхъукӀэ ныӀэп. Мы функцием инпут { $inputs } ыкӀи { $outputs ->
            [one] аутпут { $outputs }
           *[other] аутпут { $outputs }
        } иӀ.
    }

## `<sequence>`

sequence-invalid-length = Последовательностым икӀыхьагъэ мытэрэз. Ныкъоу мыхъурэ целэ пчъагъэ хъун фае.

sequence-invalid-step = Последовательностым ишъэхъу мытэрэз. { $type } типым иӀэ последовательностымкӀэ пчъагъэ хъун фае.

sequence-invalid-endpoint-number = Пчъагъэ последовательностым и "{ $attribute }" мытэрэз. Пчъагъэ хъун фае.

sequence-invalid-endpoint-letters = Буквэ последовательностым и "{ $attribute }" мытэрэз. Буквэ зэхэлъ хъун фае.

sequence-invalid-endpoint = Последовательностым и "{ $attribute }" мытэрэз.

select-from-sequence-coprime-not-numbers = пчъагъэхэр къыхэмыхыгъэ зэрэхъурэм пае coprime хэлъытагъэ хъурэп

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations гъэнэфагъэ зэрэхъугъэм пае coprime хэлъытагъэ хъурэп

## Resolving a `target`

target-not-found = `<{ $source }>`-м итарget мытэрэз: тарget къэгъотыгъэ хъурэп.

target-state-variable-not-found = `<{ $source }>`-м итарget мытэрэз: `<{ $component }>`-м "{ $property }" зыфиӀорэ гъэуцугъэ къыщыгъотыгъэ хъурэп.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-м ипеременнэхэр зэхэмылъ переменнэм фэмыдэу щытын фае.

ode-system-duplicate-variable-names = Зэтемыфэ лъытэныгъэ переменнэ цӀэхэр зиӀэ ОДУ ижъабгъу лъэныкъо функциехэр гъэнэфэн плъэкӀыщтэп.

ode-system-rhs-function-error = ОДУ ижъабгъу лъэныкъо функцие гъэнэфэн плъэкӀыщтэп. mathjs функциер гъэпсыгъэ хъумэ щыуагъ.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Линие { $count } зэфагу илъ ку гъэнэфэн плъэкӀыщтэп

angle-invalid-through-point = `<angle>`-м и through-м точкэ мытэрэз хэт

parabola-vertex-too-many-points = Вершинэр иӀэу зы точкэм анахьыбэмэ апхырыкӀырэ параболэ гъэпсыгъэ хъугъэп.

parabola-too-many-points = Точкищмэ анахьыбэмэ апхырыкӀырэ параболэ гъэпсыгъэ хъугъэп.

intersection-too-many-items = ТӀумэ анахьыбэ пкъыгъомэ азэпэуцужьыпӀэ гъэпсыгъэ хъугъэп

## Other math components

ionic-compound-not-two-ions = Ион зэхэлъыр ионитӀумэ нэмыкӀэу гъэпсыгъэ хъугъэп.

ionic-compound-needs-cation-and-anion = Ион зэхэлъыр зы катионрэ зы анионрэ ныӀэп зэрэгъэпсыгъэр.

solve-equations-cannot-evaluate = Уравнениер къэлъытэгъэ мыхъушъутэу зэшӀохын плъэкӀыщтэп: { $equation }

math-operators-operand-number-required = Математическэ операнд къыхэпхыным пае operandNumber гъэнэфагъэ хъун фае.

eigen-decomposition-failed = Матрицэм исобственнэ мэхьанэхэр къэлъытэгъэ хъугъэп

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: параметр { $parameters } шаблоным хэтэп, ащ къыхэкӀэу сыдигъуи нэкӀыгъэм фэдэщт.
       *[other] `<matchesPattern>`: параметрхэр { $parameters } шаблоным хэтхэп, ащ къыхэкӀэу сыдигъуи нэкӀыгъэм фэдэщтых.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" гурыӀогъошӀу хъурэп. none, medium, dense е зы пробелкӀэ зэпыгъэчыгъэ пчъагъитӀу хъун фае, щысэу grid="1 0.5". Сеткэ къэшӀыгъэ хъурэп.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>`-м { $expected ->
        [one] зы аутпут — точкэ пэпчъ ынаклон y', щысэу `y - x`
       *[other] аутпутитӀу — точкэ пэпчъ ивектор, щысэу `(y, -x)`
    } зиӀэ функцие ищыкӀагъ, ау къыратыгъэ функцием { $found ->
        [one] аутпут { $found }
       *[other] аутпут { $found }
    } иӀ. { $alternative ->
        [none] Зи къэшӀыгъэ хъурэп.
       *[other] А функциемкӀэ компонентыр `<{ $alternative }>`. Зи къэшӀыгъэ хъурэп.
    }

field-function-attribute-ignored-with-child = `function` атрибутыр хэлъытагъэ хъурэп, функциер компонентым ыкӀоцӀи къызэрэратыгъэм пае; ыкӀоцӀ илъыр агъэфедэ. Функциер тӀумэ ащыщ зыкӀэ ныӀэп къэптын фаер.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибутым компонентым занкӀэу ыкӀоцӀ итхэгъэ выражением ипеременнэхэр къеӀуалӀэ. { $reason ->
        [function-child] Мыщ функциер `<function>` сабыеу къэтыгъэ, ащ ежь ипеременнэхэр къеӀуалӀэх, ащ къыхэкӀэу `variables` хэлъытагъэ хъурэп.
       *[no-expression] Мыщ ащ фэдэ выражение къэтыгъэп, ащ къыхэкӀэу `variables` хэлъытагъэ хъурэп.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure рендерерым xLabelPosition="left" ыдерэп; жъабгъу лъэныкъом ишӀыкӀэ агъэфедэ.

prefigure-y-label-position-unsupported = `<graph>`: prefigure рендерерым yLabelPosition="bottom" ыдерэп; шъхьагърэ лъэныкъом ишӀыкӀэ агъэфедэ.

prefigure-invalid-axis-bounds = `<graph>`: prefigure зэрэшӀыгъэным пае осьхэм ягъунапкъэхэр мытэрэзых; ыпэрапшӀэ bbox (-10,-10,10,10) агъэфедэ.

prefigure-invalid-width = `<graph>`: prefigure зэрэшӀыгъэным пае шъомбгъуагъэр мытэрэз; ыпэрапшӀэ диаграммэ шъомбгъуагъэу 425 агъэфедэ.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure зэрэшӀыгъэным пае aspectRatio мытэрэз; ыпэрапшӀэ зэпэлъытыгъэу 1 агъэфедэ.

prefigure-grid-spacing-too-fine = `<graph>`: осьхэм ягъунапкъэхэмкӀэ сеткэм изэфагу цӀыкӀу дэд; prefigure рендерерым сеткэр къыщыхэнэ.

prefigure-annotations-not-rendered = `<graph>`: PreFigure рендерерыр агъэмыфедэ зыхъукӀэ аннотациехэр къэшӀыгъэ хъущтхэп.

multiple-annotations-children = `<graph>`-м `<annotations>` сабый заулэ къыщагъотыгъ; аужырэм фэшъхьафхэр хэлъытагъэ хъурэп.

## Referring to other components

copy-unrecognized-component-type = ГурыӀогъошӀоу мыхъугъэ компонент тип къэпгъэкӀэрэкӀэн е къэпхын плъэкӀыщтэп: { $type }.

copy-prop-not-found = { $component } типым иӀэ компонентым { $property } проп къыщыгъотыгъэ хъугъэп

collect-no-source = collect-мкӀэ источник къэгъотыгъэ хъугъэп.

collect-invalid-component-type = `<{ $component }>` типым иӀэ компонентхэр зэхэпхьажьын плъэкӀыщтэп, ар компонент тип мытэрэзышъ.

reference-index-unavailable = `{ $reference }` индексым уфэгъэзэн плъэкӀыщтэп

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентым { $action } щыпшӀэн плъэкӀыщтэп

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Даннэхэм яшӀыкӀэ мытэрэз. Сатырхэм якӀыхьагъэхэр зэтемыфэх. Къыщагъотыгъ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Даннэхэм зэтефэрэ колонкэ цӀэхэр яӀэх. Къыщагъотыгъ componentIdx :{ $componentIdx }

data-frame-missing-column-name = Даннэхэм колонкэм ыцӀэ ащыщэп. Къыщагъотыгъ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Мы джэуапым ибалл ежь answer тегым ыгъэкӀогъэ джэуапым тетэу гъэпсыгъ, ащ гухэлъым имыдэ ӀофшӀакӀэ къыхьыщт.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` зиӀэ контейнерым ыкӀоцӀ ит `<answer>`-м `maxNumAttempts` фэбгъэнэфэным зи къышӀырэп, попыткэхэм япчъагъэ контейнерым ыгъэнафэшъ. `maxNumAttempts` контейнерым фэгъэнэфэн.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` зиӀэ нэмыкӀ контейнерым ыкӀоцӀ ит, `sectionWideCheckWork` зиӀэ контейнерым `maxNumAttempts` фэбгъэнэфэным зи къышӀырэп, попыткэхэм япчъагъэ иужьырэ контейнерым ыгъэнафэшъ. `maxNumAttempts` ыкӀыб ит контейнерым фэгъэнэфэн.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality гъэнэфагъэ мыхъумэ { $attributes } атрибутым зи къышӀыщтэп.
       *[other] symbolicEquality гъэнэфагъэ мыхъумэ { $attributes } атрибутхэм зи къашӀыщтэп.
    }

answer-invalid-type = Джэуапым итип мытэрэз: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентым ыцӀэ зэрэщымыӀэм пае, модулым иатрибутэу гъэфедагъэ хъун плъэкӀыщтэп

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентыр модулым иатрибутэу гъэфедагъэ хъун плъэкӀыщтэп, `<module>` компонент типым "{ $name }" атрибутыр гъэнэфагъэу иӀэшъ.

conditional-content-condition-ignored = case е else сабыйхэр зиӀэ `<conditionalContent>` компонентым `condition` атрибутыр хэлъытагъэ хъурэп.

slider-markers-type-mismatch = Маркерхэм ятип слайдерым итип зэтефэрэп.

pretzel-problem-needs-statement-and-answer = Pretzel мытэрэз: `<problem>` пэпчъ зы `<statement>` ыкӀи зы `<answer>` хэтын фае.

pretzel-circuit-first-problem-distractor = Pretzel мытэрэз: mode="circuit" зыхъукӀэ, апэрэ `<problem>` дистрактор хъун плъэкӀыщтэп.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибутымкӀэ мэхьанэ { $values } мытэрэз; хэлъытагъэ хъурэп.
       *[other] `{ $attribute }` атрибутымкӀэ мэхьанэхэр { $values } мытэрэзых; хэлъытагъэ хъурэп.
    }

attribute-must-be-references = `{ $attribute }` атрибутымкӀэ `{ $value }` мэхьанэр мытэрэз. Атрибутыр `$`-мкӀэ къезыгъажьэрэ ссылкэхэм ахэлъын фае.

math-input-invalid-function-names = <mathInput>: { $attribute }-м хэт мытэрэз функцие цӀэхэр хэлъытагъэ хъугъэхэп: { $names }. ЦӀэ пэпчъ икъэгъэлъэгъон Ӏахьэ анахь макӀэу символитӀу (буквэхэр е дефисхэр) хъун фае; ыуж `|<mathspeak alternative>` кӀэлъыкӀон плъэкӀыщт.

## Building components from the source

component-type-invalid = Компонент тип мытэрэз: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутыр къэпӀожьын плъэкӀыщтэп.

attribute-invalid-for-component = `<{ $componentType }>` типым иӀэ компонентымкӀэ "{ $attribute }" атрибутыр мытэрэз.

## Style definition contrast

style-definition-insufficient-contrast =
    Стиль гъэнэфэн { $styleNumber } икъурэ контраст фыриӀэп мыщкӀэ: { $context ->
        [text-on-background] тхыгъэм ышъо фон шъом дэлъытагъэу
        [high-contrast] контраст лъагэ зиӀэ шъор канвэм дэлъытагъэу
        [line] линием ышъо канвэм дэлъытагъэу
        [marker] маркерым ышъо канвэм дэлъытагъэу
       *[text-on-canvas] тхыгъэм ышъо канвэм дэлъытагъэу
    }{ $mode ->
        [dark] { " (шӀункӀы режим)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; анахь макӀэу { $threshold }:1 ищыкӀагъ).

style-definition-dark-mode-text-background-contrast =
    Стиль гъэнэфэн { $styleNumber } нэфы режимымкӀэ икъурэ контраст зиӀэ шъохэр гъэнэфагъэу иӀэ нахь мышӀэми, а мэхьанэхэм къатекӀыгъэ шӀункӀы режим шъохэмкӀэ тхыгъэм ышъо фон шъом икъурэ контраст фыриӀэп ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; анахь макӀэу { $threshold }:1 ищыкӀагъ). { $suggestion ->
        [available] ШӀункӀы режимым икъурэ контраст щыӀэным пае е нэфы режимым иконтраст гъэпытэн (щысэу { $lightAttribute }="{ $lightColor }" гъэнэфэн), е шӀункӀы режимым ышъо зэблэхъун (щысэу { $darkAttribute }="{ $darkColor }" гъэнэфэн).
       *[none] ШӀункӀы режимым икъурэ контраст щыӀэным пае нэфы режимым иконтраст гъэпытэн, е къытекӀыгъэ шъохэр textColorDarkMode ыкӀи/е backgroundColorDarkMode-мкӀэ зэблэхъун.
    }

style-definition-dark-mode-text-canvas-contrast =
    Стиль гъэнэфэн { $styleNumber } нэфы режимымкӀэ икъурэ контраст зиӀэ тхыгъэ шъо гъэнэфагъэу иӀэ нахь мышӀэми, а мэхьанэм къытекӀыгъэ шӀункӀы режим тхыгъэ шъом канвэм дэлъытагъэу икъурэ контраст фыриӀэп ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; анахь макӀэу { $threshold }:1 ищыкӀагъ). { $suggestion ->
        [available] ШӀункӀы режимым икъурэ контраст щыӀэным пае е нэфы режимым иконтраст гъэпытэн (щысэу textColor="{ $lightColor }" гъэнэфэн), е шӀункӀы режимым ышъо зэблэхъун (щысэу textColorDarkMode="{ $darkColor }" гъэнэфэн).
       *[none] ШӀункӀы режимым икъурэ контраст щыӀэным пае нэфы режимым иконтраст гъэпытэн, е къытекӀыгъэ шъор textColorDarkMode-мкӀэ зэблэхъун.
    }

section-multiple-style-palettes = Пычыгъом зы <stylePalette> ныӀэп къыхихын ылъэкӀыщтыр; аужырэр агъэфедэ.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } иунэе вариантхэр гъэнэфэн плъэкӀыщтэп, numToSelect ныкъоу мыхъурэ целэ пчъагъэ мыхъушъ.

variant-num-to-select-not-constant-number = { $component } иунэе вариантхэр гъэнэфэн плъэкӀыщтэп, numToSelect зэмыхъокӀырэ пчъагъэ мыхъушъ.

variant-with-replacement-not-constant-boolean = { $component } иунэе вариантхэр гъэнэфэн плъэкӀыщтэп, withReplacement зэмыхъокӀырэ булев мэхьанэ мыхъушъ.

variant-select-weight-disables-unique = selectWeight е selectForVariants гъэнэфагъэу зиӀэ вариант щыӀэ зыхъукӀэ select-м иунэе вариантхэр гъэнэфагъэ хъухэрэп

variant-coprime-undetermined = { $component } иунэе вариантхэр гъэнэфэн плъэкӀыщтэп, coprime сыдигъуи пцӀы зэрэхъурэр гъэнэфагъэ мыхъушъ.

variant-attribute-not-constant = { $component } иунэе вариантхэр гъэнэфэн плъэкӀыщтэп, { $attribute } зэмыхъокӀыжьырэ мыхъушъ.

variant-attribute-not-number = { $component } иунэе вариантхэр гъэнэфэн плъэкӀыщтэп, { $attribute } пчъагъэ мыхъушъ.

variant-attribute-wrong-type-for-sequence =
    { $type } типым иӀэ { $component } иунэе вариантхэр гъэнэфэн плъэкӀыщтэп, { $attribute } { $expected ->
        [letters-combination] буквэ зэхэлъ
        [math-expression] тэрэз математическэ выражение
        [integer] целэ пчъагъэ
       *[number] пчъагъэ
    } мыхъушъ.

variant-length-not-integer = { $component } иунэе вариантхэр гъэнэфэн плъэкӀыщтэп, length целэ пчъагъэ мыхъушъ.

variant-sort-not-implemented = sort зиӀэ { $component } иунэе вариантхэр гъэпсыгъэ хъугъэхэп

variant-exclude-combinations-not-implemented = excludeCombinations зиӀэ { $component } иунэе вариантхэр гъэпсыгъэ хъугъэхэп

variant-math-exclude-not-implemented = exclude зиӀэ math типым иӀэ { $component } иунэе вариантхэр гъэпсыгъэ хъугъэхэп

variant-non-constant-exclude-not-implemented = зэмыхъокӀырэ мыхъурэ exclude зиӀэ { $component } иунэе вариантхэр гъэпсыгъэ хъугъэхэп

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: график prefigure рендерерым ыдерэп; къытекӀыгъэр къыхэнагъ.

prefigure-descendant-invalid-geometry = { $subject }: геометриер икъурэп е гъунапкъэ иӀэп; къытекӀыгъэр къыхэнагъ.

prefigure-curve-label-omitted = { $subject }: зэблэхъугъэ кривая элементхэм ярлыкхэр адыдэрэп; ярлыкыр къыхэнагъ.

prefigure-curve-unsupported-definition-type = { $subject }: кривая функцием игъэнэфэн тип '{ $definitionType }' ыдерэп; къытекӀыгъэр къыхэнагъ.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves-м и flipFunctions атрибут ыдерэп; къытекӀыгъэр къыхэнагъ.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves-м формулэ типым иӀэ сабый функциехэр ныӀэп ыдэрэр; къытекӀыгъэр къыхэнагъ.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] линие лъэпкъым иярлык
       *[point] точкэм иярлык
    }-мкӀэ labelPosition '{ $labelPosition }' ыдерэп; PreFigure иыпэрапшӀэ зэтегъэуцуакӀэ агъэфедэ.

prefigure-fill-style-unsupported = { $subject }: гъэзын стиль '{ $fillStyle }' PreFigure ыдерэп; зэпыу зимыӀэ гъэзыныр агъэфедэ.

prefigure-line-style-unknown = { $subject }: гурыӀогъошӀу мыхъурэ линие стиль '{ $lineStyle }' PreFigure иаутпут къыхэнагъ.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер стиль '{ $markerStyle }' PreFigure истиль 'diamond' фагъэзагъ.

prefigure-marker-style-unsupported = { $subject }: маркер стиль '{ $markerStyle }' PreFigure ыдерэп; ыпэрапшӀэ стилыр агъэфедэ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` мытэрэз; тарget къэгъотыгъэ хъурэп. Аннотациер къыхэнагъ.

annotation-ref-multiple-targets = `<annotation>`: `ref` тарget заулэ фэгъэзагъ; апэрэ тарget агъэфедэ.

annotation-ref-outside-graph = `<annotation>`: `ref` мытэрэз; тарget къэзыубытырэ графикым ыкӀыб ит. Аннотациер къыхэнагъ.

annotation-ref-unsupported-target = `<annotation>`: `ref` мытэрэз; prefigure зэблэхъунымкӀэ тарget адырэ график пкъыгъо хъурэп. Аннотациер къыхэнагъ.

annotation-text-missing = `<annotation>`: `text` щыӀэп е нэкӀ; нэкӀы текст къатыгъ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Хъурае лъытэныгъэ къэгъотыгъэ хъугъ.
       *[other] `<{ $componentType }>` компонентыр хэтэу хъурае лъытэныгъэ къэгъотыгъэ хъугъ.
    }

reference-no-referent = Ссылкэм ызыфигъазэрэр къэгъотыгъэ хъугъэп: `{ $reference }`

reference-multiple-referents = Ссылкэм ызыфигъазэрэ зыбгъупш къэгъотыгъэ хъугъ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>`-м и { $attribute } атрибут иформат мытэрэз.

children-invalid = `<{ $componentType }>`-м исабыйхэр мытэрэзых: мытэрэз сабыйхэр къэгъотыгъэх: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутымкӀэ `{ $value }` мэхьанэр мытэрэз, `{ $default }` мэхьанэр агъэфедэ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML иверсие { $version } къэгъотыгъэ хъугъэп.
       *[other] DoenetML иверсие { $version } къэгъотыгъэ хъугъэп. Версие { $fallback } агъэфедэ
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML мытэрэз: { $content }

parse-tag-missing-close-tag = DoenetML мытэрэз: `{ $tag }` тегым зэфэшӀыжьырэ тег иӀэп. Ежь зызэфэзышӀыжьырэ тег е `</{ $tagName }>` тег щыӀэн фэягъ.

parse-tag-error = DoenetML мытэрэз: `<{ $tagName }>` тегым щыуагъ хэт

parse-attribute-missing-value = DoenetML мытэрэз: `{ $attribute }` атрибут мытэрэзым мэхьанэ иӀэ хъумэ фэд.

parse-attribute-invalid = DoenetML мытэрэз: `{ $attribute }` атрибут мытэрэз

parse-attribute-value-invalid = DoenetML мытэрэз: `{ $value }` атрибут мэхьанэ мытэрэз

parse-attribute-value-quote-mismatch = DoenetML мытэрэз: `{ $value }` атрибут мэхьанэ мытэрэз. Кавычкэхэр зэтефэрэп. `{ $quote }` щыӀэ хъумэ фэд

parse-open-tag-name-missing = DoenetML мытэрэз: тег цӀэ зимыӀэ тег къэгъотыгъэ хъугъ, щысэу `<`

parse-tag-not-closed = DoenetML мытэрэз: `{ $tag }` тегыр зэфэшӀыжьыгъэ хъугъэп (`>` щыӀэ хъумэ фэд).

parse-self-closing-tag-name-missing = DoenetML мытэрэз: тег цӀэ зимыӀэ тег къэгъотыгъэ хъугъ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML мытэрэз: `{ $tag }` тегыр зэфэшӀыжьыгъэ хъугъэп (`/>` щыӀэ хъумэ фэд).

parse-tag-invalid-attributes = DoenetML мытэрэз: `{ $tag }` тегыр тэрэзэп. Атрибут мытэрэзхэр иӀэнхэ ылъэкӀыщт.

parse-close-tag-name-missing = DoenetML мытэрэз: тег цӀэ зимыӀэ зэфэшӀыжьырэ тег къэгъотыгъэ хъугъ, щысэу `</`

parse-attribute-value-unquoted = Атрибут мэхьанэхэр кавычкэхэм ахэлъын фае: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML мытэрэз: `{ $tag }` зэфэшӀыжьырэ тег къэгъотыгъэ хъугъ, ау къезыгъажьэрэ тег иӀэп

parse-close-tag-mismatched = DoenetML мытэрэз: зэфэшӀыжьырэ тегыр зэтефэрэп. `</{ $expected }>` щыӀэн фэягъ. Къэгъотыгъэр `{ $found }`

parser-node-unconvertible = { $node } нодэр Dast нодэ ашӀын плъэкӀыщтэп.

## Names

name-attribute-invalid =
    name='{ $name }' атрибут цӀэ мытэрэз. { $reason ->
        [characters] ЦӀэхэм буквэхэр, пчъагъэхэр, чӀэгъ шъуашъохэр е дефисхэр ныӀэп ахэлъын злъэкӀыщтхэр.
       *[start] ЦӀэхэр буквэмкӀэ къежьэн фае.
    }

component-name-invalid-start = Компонент цӀэ "{ $name }" мытэрэз. ЦӀэхэр буквэмкӀэ къежьэн фае.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched типым иӀэ джэуапым video атрибут иӀэн фае

answer-video-watched-video-not-reference = videoWatched типым иӀэ джэуапым ссылк зыфэдэ video атрибут иӀэн фае

answer-name-not-single-text = Джэуапым и name атрибут зы текст сабый ныӀэп иӀэн фаер

## Referencing another document

external-doenetml-recursion-limit = Ӏэгъо-благъо DoenetML къэхьыгъэ хъурэп, рекурсием илъэгапӀэхэр бэ дэдэшъ. Хъурае ссылк щыӀа?

external-doenetml-unavailable = { $attribute }="{ $uri }"-м DoenetML къыхэхыгъэ хъурэп

external-doenetml-type-mismatch = { $attribute }="{ $uri }"-м къыхэхыгъэ DoenetML мытэрэз: "{ $componentType }" компонент типым зэтефагъэп

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибутыр щыӀэжьэп; ащ ычӀыпӀэ `{ $to }` гъэфедэн.
       *[other] [deprecation] `<{ $component }>`-м и `{ $from }` атрибут щыӀэжьэп; ащ ычӀыпӀэ `{ $to }` гъэфедэн.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибутыр щыӀэжьэп ыкӀи хэлъытагъэ хъурэп, `{ $to }` ащ дэжь гъэнэфагъэшъ.
       *[other] [deprecation] `<{ $component }>`-м и `{ $from }` атрибут щыӀэжьэп ыкӀи хэлъытагъэ хъурэп, `{ $to }` ащ дэжь гъэнэфагъэшъ.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`-м и `{ $attribute }` атрибут щыӀэжьэп ыкӀи хэлъытагъэ хъурэп.

deprecated-attribute-to-child = [deprecation] `<{ $component }>`-м и `{ $attribute }` атрибут щыӀэжьэп; ащ ычӀыпӀэ `<{ $child }>` сабый гъэфедэн.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>`-м и `{ $attribute }` атрибут имэхьанэу `{ $value }` щыӀэжьэп; ащ ычӀыпӀэ `{ $to }` гъэфедэн.


## Language coverage

pluralize-english-only = `<pluralize>` инджылызыбзэр ныӀэп бэрэ зышӀын ылъэкӀыщтыр, ащ къыхэкӀэу { $locale } бзэмкӀэ тхыгъэ документым итекст зэрэщытэу къэнэ. Бэрэ шӀыгъэ формэр занкӀэу тх, е `pluralForm` атрибуткӀэ гъэнэфэн.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элементыр Doenet иэлемент хъурэп.

schema-element-not-allowed-at-root = `<{ $tag }>` элементыр документым ылъапсэ дэжь щыгъэфедагъэ хъурэп.

schema-element-not-allowed-inside = `<{ $tag }>` элементыр `<{ $parent }>` ыкӀоцӀ ит хъун плъэкӀыщтэп.

schema-attribute-unrecognized = `<{ $tag }>` элементым `{ $attribute }` зыфиӀорэ атрибут иӀэп.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементым и `{ $attribute }` атрибут спискэ хъун фае, ипкъыгъо пэпчъи мыхэм ащыщ: { $allowed }
       *[other] `<{ $tag }>` элементым и `{ $attribute }` атрибут мыхэм ащыщ хъун фае: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select-мкӀэ вариант цӀэ мытэрэз. Вариант цӀэ { $variantName } опцие { $numOptions } къахэфэ, къыхэпхын фаер { $numToSelect } хъуми.

select-variant-name-without-options = select-м вариант заулэ фэгъэнэфагъ, ау хъун ылъэкӀыщт вариант цӀэ { $variantName } фэдэмкӀэ опцие гъэнэфагъэ щыӀэп.

select-variant-name-not-possible = select-м фэгъэнэфэгъэ вариант цӀэ { $variantName } хъун ылъэкӀыщт вариант цӀэ хъурэп.

select-too-few-options = { $numOptions } ныӀэп щыӀэу компонент { $numToSelect } къыхэпхын плъэкӀыщтэп.

select-from-sequence-too-few-values = КӀыхьагъэу { $length } зиӀэ последовательностым мэхьанэу { $numToSelect } къыхэпхын плъэкӀыщтэп.

select-from-sequence-indices-count-mismatch = select-м фэгъэнэфэгъэ индексхэм япчъагъэ къыхэпхын фаем ыпчъагъэ зэтефэн фае

select-from-sequence-indices-not-integers = select-м фэгъэнэфэгъэ индексхэр зэкӀэ целэ пчъагъэ хъунхэ фае

select-from-sequence-index-excluded = selectfromsequence-м игъэнэфэгъэ индекс хэгъэкӀыгъагъ

select-from-sequence-indices-excluded-combination = selectfromsequence-м игъэнэфэгъэ индексхэр хэгъэкӀыгъэ зэхэлъыгъэх

select-from-sequence-coprime-not-positive-integers = Ныкъоу мыхъурэ целэ пчъагъэхэр къыхэмыхыгъэ зэрэхъурэм пае coprime зэхэлъыгъэхэр къыхэпхын плъэкӀыщтэп.

select-from-sequence-coprime-common-factor = Coprime пчъагъэхэр къыхэпхын плъэкӀыщтэп. Хъун ылъэкӀыщт мэхьанэхэм зэдиӀыгъ множитель яӀ. ("from" е "to"-м ямэхьанэ гъэнэфагъэхэр "step"-м coprime фэхъунхэ фае.)

select-from-sequence-coprime-single-number = 1 мыхъурэ зы пчъагъэм coprime зэхэлъыгъэхэр къыхэпхын плъэкӀыщтэп.

select-from-sequence-excluded-too-many-combinations = selectFromSequence-м зэхэлъыгъэхэм япроцент 70-м нахьыбэ хагъэкӀыгъ

select-from-sequence-coprime-none-found = Coprime пчъагъэхэр къыхэхыгъэ хъугъэхэп. Хъун ылъэкӀыщт мэхьанэхэм зэдиӀыгъ множитель яӀ.

select-from-sequence-too-few-unique-values = КӀыхьагъэу { $numPossibleValues } зиӀэ последовательностым унэе мэхьанэу { $numToSelect } къыхэпхын плъэкӀыщтэп

select-prime-numbers-too-few-values = КӀыхьагъэу { $numValues } зиӀэ простой пчъагъэ спискэм мэхьанэу { $numToSelect } къыхэпхын плъэкӀыщтэп

select-prime-numbers-values-count-mismatch = select-м фэгъэнэфэгъэ мэхьанэхэм япчъагъэ къыхэпхын фаем ыпчъагъэ зэтефэн фае

select-prime-numbers-values-not-prime = select prime number-м фэгъэнэфэгъэ мэхьанэхэр зэкӀэ простой пчъагъэ спискэм хэтын фае

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-м игъэнэфэгъэ мэхьанэхэр хэгъэкӀыгъэ зэхэлъыгъэх

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-м зэхэлъыгъэхэм япроцент 70-м нахьыбэ хагъэкӀыгъ

select-random-combination-fluke = Хъун зылъэкӀыщтыгъэр макӀэ дэдэу, тхьамыкӀагъокӀэ пчъагъэ зэпэмышӀыжьхэм язэхэлъыгъэ къыхэхыгъэ хъугъэп

select-random-value-fluke = Хъун зылъэкӀыщтыгъэр макӀэ дэдэу, тхьамыкӀагъокӀэ зэпэмышӀыжь мэхьанэ къыхэхыгъэ хъугъэп
