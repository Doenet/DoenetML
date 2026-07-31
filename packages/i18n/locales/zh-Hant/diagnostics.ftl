# Traditional Chinese diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
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
# Taiwan usage where it diverges from the mainland's, which is most of what
# separates this file from `zh-Hans` beyond the characters: 變數 not 变量
# (and 自變數/應變數 not 自变量/因变量), 常數 not 常量, 布林 not 布尔,
# 字串 not 字符串, 元件 not 组件, 參照 not 引用, 物件 not 对象, 資料 not 数据,
# 設定 not 设置, 預設 not 默认, 實作 not 实现, 質數 not 素数, 遞迴 not 递归,
# 疊代 not 迭代, 模組 not 模块, 滑桿 not 滑块, 影片 not 视频, 略過 not 跳过,
# 停用 not 禁用, 覆寫 not 覆盖, 呼叫 not 调用, 建立 not 创建, 偵測 not 检测.
#
# A `<dataFrame>` row is 列 and its column 欄, the opposite assignment to the
# mainland's 行/列 — so the row and column messages read as though they had
# been swapped against `zh-Hans`. They have not. A line of *source text* is 行
# in both, and every parse diagnostic below keeps it.
#
# Chinese has a single plural category, so a countable message needs no
# selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = 指定兩個端點時，{ $attributes } 會被忽略

line-segment-attributes-ignored-with-endpoint-and-midpoint = 同時指定端點和中點時，{ $attributes } 會被忽略

line-segment-midpoint-offset-without-midpoint = 沒有中點時 midpointOffset 不起作用

## `<line>`

line-points-undetermined-dimensions = 直線經過的點維度不確定。

line-points-too-few-dimensions = 直線必須經過至少二維的點。

line-points-depend-on-variables = 直線經過的點相依於變數：{ $variables }。

line-equation-invalid-format = 以變數 { $variable1 } 和 { $variable2 } 表示的直線方程式格式無效。

## `<ray>`

ray-overprescribed-through = 射線同時由 through、endpoint 和 direction 決定。忽略所指定的 through。

ray-dimension-mismatch = 射線中的 numDimensions 不一致。

## `<vector>`

vector-overprescribed-head = 向量同時由 head、tail 和 displacement 決定。忽略所指定的 head。

vector-dimension-mismatch = 向量中的 numDimensions 不一致。

## Attracting and constraining

attract-to-without-nearest-point = 無法吸附到 `<{ $component }>`，因為它沒有 nearestPoint 狀態變數。

constrain-to-without-nearest-point = 無法約束到 `<{ $component }>`，因為它沒有 nearestPoint 狀態變數。

constrain-to-interior-without-nearest-point = 無法約束到 `<{ $component }>` 的內部，因為它沒有 nearestPoint 狀態變數。

## `<choiceInput>`

choice-input-label-position-ignored = 對於非內嵌的 choiceInput，labelPosition 會被忽略

## Ordering children by index

choice-input-indices-count-mismatch = 忽略為 choiceInput 指定的 indices，因為其數量與 choice 子元素的數量不符。

pretzel-indices-count-mismatch = 忽略為 problem 指定的 indices，因為其數量與 problem 子元素的數量不符。

shuffle-indices-count-mismatch = 忽略為 shuffle 指定的 indices，因為其數量與元件數量不符。

indices-ignored-out-of-range = 忽略為 { $component } 指定的 indices，因為有些超出範圍。

pretzel-indices-repeated = 忽略為 pretzel 指定的 indices，因為有些重複。

pretzel-circuit-first-index = 忽略在 circuit 模式下為 pretzel 指定的 indices，因為第一個索引必須是 1。

## `<shuffle>` and `<sort>`

string-children-need-type = 要讓 `<{ $component }>` 支援字串子元素，必須指定 `type` 屬性。

invalid-type-defaulting-to-math = 元件 { $component } 的類型 { $type } 無效。它必須是 math、text、number 或 boolean 之一。改用 math。

string-not-valid-component-to-arrange = 字串「{ $value }」不是 { $component } 的有效元件。已忽略。

## Types and variables

invalid-type-defaulting-to-number = 類型 { $type } 無效，類型改設為 number。

invalid-variable-value = 變數的值無效：`{ $value }`

## Variants

variant-index-must-be-number = 變體索引 { $index } 必須是數字

variant-index-must-be-integer = 變體索引 { $index } 必須是整數

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` 尚未實作絕對尺寸。寬度改為相對值。

side-by-side-absolute-margins = `<{ $component }>` 尚未實作絕對尺寸。邊距改為相對值。

side-by-side-no-block-child = 無效的 `<{ $component }>`：它必須至少有一個區塊層級子元素。

## `<label>`

label-for-ignored-on-graphical = 圖形 `<label>` 上的 `for` 屬性會被忽略。

label-for-must-resolve-to-one = `<label>` 上的 `for` 屬性必須恰好解析為一個元件。

label-for-unresolved = `<label>` 上的 `for` 屬性無法解析為元件。

label-for-answer-with-authored-inputs = `<label>` 上的 `for` 屬性參照了一個明確寫出輸入的 `<answer>`；請直接參照該輸入。

label-for-answer-without-input = `<label>` 上的 `for` 屬性參照了一個沒有可標註輸入的 `<answer>`。

label-for-must-reference-input-or-answer = `<label>` 上的 `for` 屬性必須參照一個輸入或一個答案。

## Accessibility

accessibility-short-description-or-decorative = 為了無障礙，`<{ $component }>` 必須有簡短描述，或被標為裝飾性元素。

accessibility-video-short-description = 為了無障礙，`<video>` 必須有簡短描述。

accessibility-input-short-description-or-label = 為了無障礙，`<{ $component }>` 必須有簡短描述或標籤。

accessibility-answer-input-short-description-or-label = 為了無障礙，建立輸入的 `<answer>` 必須有簡短描述或標籤。

accessibility-short-description-contains-math = 簡短描述中不應包含 `<{ $component }>` 這類數學元件。請用文字把數學內容寫出來。

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } 對小節標題文字的對比度不足（深色模式）（{ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1；至少需要 { $threshold }:1）。
       *[other] { $colorName } 對小節標題文字的對比度不足（{ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1；至少需要 { $threshold }:1）。
    }

## `<circle>`

circle-through-points-non-numerical = 當各點沒有數值時，尚未實作經過 { $count } 個點的 `<circle>`。

circle-too-many-through-points = 無法計算經過 3 個以上點的圓。

circle-overprescribed-radius-center-points = 無法計算同時指定了半徑、圓心和經過點的圓。

circle-center-with-multiple-points = 無法計算指定圓心且經過 1 個以上點的圓。

circle-radius-too-small = 無法計算該圓：兩點間距離為 { $distance }，所指定的半徑 { $radius } 太小。

circle-radius-with-many-points = 無法在指定半徑的情況下建立經過兩個以上點的圓。

circle-invalid-center-or-through-points = 圓的圓心或經過點無效。

circle-radius-center-with-multiple-points = 無法計算指定圓心且經過 1 個以上點的圓的半徑。

circle-change-radius-non-numerical = 無法變更經過點非數值的圓的半徑

circle-radius-with-points-non-numerical = 在沒有數值的情況下，無法在指定半徑時建立經過一個以上點的圓。

circle-change-center-non-numerical = 尚未實作變更經過非數值點的圓的圓心。

## `<function>`

function-domain-insufficient-dimensions = 函數定義域的維度不足。定義域有 { $intervals } 個區間，而該函數有 { $inputs } 個輸入。

function-domain-invalid-format = 函數定義域的格式無效。

function-ignoring-non-numerical =
    { $type ->
        [maximum] 忽略函數的非數值最大值。
        [minimum] 忽略函數的非數值最小值。
        [extremum] 忽略函數的非數值極值。
        [point] 忽略函數的非數值點。
        [slope] 忽略函數的非數值斜率。
       *[other] 忽略函數的非數值 { $type }。
    }

function-ignoring-empty =
    { $type ->
        [maximum] 忽略函數的空最大值。
        [minimum] 忽略函數的空最小值。
        [extremum] 忽略函數的空極值。
        [point] 忽略函數的空點。
       *[other] 忽略函數的空 { $type }。
    }

function-points-too-close = 函數中有兩個點位置過於接近，無法定義該函數。

function-iterates-input-output-mismatch = 只有輸入個數等於輸出個數時才能進行函數疊代。該函數有 { $inputs } 個輸入和 { $outputs } 個輸出。

## `<sequence>`

sequence-invalid-length = 數列長度無效。它必須是非負整數。

sequence-invalid-step = 數列步長無效。對於類型為 { $type } 的數列，它必須是數字。

sequence-invalid-endpoint-number = 數字數列的「{ $attribute }」無效。它必須是數字。

sequence-invalid-endpoint-letters = 字母數列的「{ $attribute }」無效。它必須是字母組合。

sequence-invalid-endpoint = 數列的「{ $attribute }」無效。

select-from-sequence-coprime-not-numbers = 忽略 coprime，因為所選的不是數字

select-from-sequence-coprime-with-exclude-combinations = 忽略 coprime，因為已指定 excludeCombinations

## Resolving a `target`

target-not-found = `<{ $source }>` 的 target 無效：找不到目標。

target-state-variable-not-found = `<{ $source }>` 的 target 無效：在 `<{ $component }>` 上找不到名為「{ $property }」的狀態變數。

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` 的變數必須不同於自變數。

ode-system-duplicate-variable-names = 無法用重複的應變數名稱定義 ODE 右端函數。

ode-system-rhs-function-error = 無法定義 ODE 右端函數。建立 mathjs 函數時發生錯誤。

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = 無法定義 { $count } 條直線之間的角

angle-invalid-through-point = `<angle>` 的 through 中有無效的點

parabola-vertex-too-many-points = 尚未實作指定頂點且經過 1 個以上點的拋物線。

parabola-too-many-points = 尚未實作經過 3 個以上點的拋物線。

intersection-too-many-items = 尚未實作兩個以上物件的交集

## Other math components

ionic-compound-not-two-ions = 尚未實作兩個離子以外的離子化合物。

ionic-compound-needs-cation-and-anion = 離子化合物僅實作了一個陽離子和一個陰離子的情形。

solve-equations-cannot-evaluate = 無法求解方程式，因為無法對其求值：{ $equation }

math-operators-operand-number-required = 擷取數學運算元時必須指定 operandNumber。

eigen-decomposition-failed = 無法計算矩陣的特徵值

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`：參數 { $parameters } 未出現在模式中，因此總是會匹配空白。

## `<graph>`

graph-grid-invalid = `<graph>`：無法解析 grid="{ $grid }"。它必須是 none、medium、dense，或以空格分隔的兩個正數，例如 grid="1 0.5"。不繪製網格。

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`：prefigure 繪製器不支援 xLabelPosition="left"；改用右側位置的行為。

prefigure-y-label-position-unsupported = `<graph>`：prefigure 繪製器不支援 yLabelPosition="bottom"；改用頂部位置的行為。

prefigure-invalid-axis-bounds = `<graph>`：prefigure 轉換的座標軸範圍無效；改用預設 bbox (-10,-10,10,10)。

prefigure-invalid-width = `<graph>`：prefigure 轉換的寬度無效；改用預設圖形寬度 425。

prefigure-invalid-aspect-ratio = `<graph>`：prefigure 轉換的 aspectRatio 無效；改用預設長寬比 1。

prefigure-grid-spacing-too-fine = `<graph>`：相對於座標軸範圍，網格間距過密；prefigure 繪製器中省略網格。

prefigure-annotations-not-rendered = `<graph>`：不使用 PreFigure 繪製器時不會繪製註解。

multiple-annotations-children = 在 `<graph>` 中發現多個 `<annotations>` 子元素；除最後一個外全部忽略。

## Referring to other components

copy-unrecognized-component-type = 無法擴充或複製無法辨識的元件類型：{ $type }。

copy-prop-not-found = 在類型為 { $component } 的元件上找不到屬性 { $property }

collect-no-source = 未找到 collect 的來源。

collect-invalid-component-type = 無法收集類型為 `<{ $component }>` 的元件，因為這不是有效的元件類型。

reference-index-unavailable = 無法參照索引 `{ $reference }`

## `<callAction>`

component-action-unavailable = 無法在元件 `{ $reference }` 上呼叫 { $action }

## `<dataFrame>`

# 列 is the row and 欄 the column — see the note on rows and columns above.
data-frame-inconsistent-row-lengths = 資料形狀無效。各列長度不一致。發現於 componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = 資料中有重複的欄位名稱。發現於 componentIdx :{ $componentIdx }

data-frame-missing-column-name = 資料缺少欄位名稱。發現於 componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = 該答案的某個 award 相依於 answer 標籤自身提交的作答，這會導致非預期的行為。

answer-max-num-attempts-in-section-wide-check-work = 在帶 `sectionWideCheckWork` 的容器內的 `<answer>` 上設定 `maxNumAttempts` 不起作用，因為嘗試次數由容器控制。請改在容器上設定 `maxNumAttempts`。

nested-section-wide-check-work-max-num-attempts = 在位於另一個帶 `sectionWideCheckWork` 的容器內、且自身也帶 `sectionWideCheckWork` 的容器上設定 `maxNumAttempts` 不起作用，因為嘗試次數由外層容器控制。請在外層容器上設定 `maxNumAttempts`。

answer-attributes-need-symbolic-equality = 未設定 symbolicEquality 時，{ $attributes } 屬性不會起作用。

answer-invalid-type = answer 的類型無效：{ $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = 由於元件 `<{ $component }>` 沒有名稱，它不能用作模組屬性

module-attribute-name-already-defined = 元件 `<{ $component } name="{ $name }">` 不能用作模組的屬性，因為元件類型 `<module>` 已經定義了名為「{ $name }」的屬性。

conditional-content-condition-ignored = 在帶有 case 或 else 子元素的 `<conditionalContent>` 元件上，`condition` 屬性會被忽略。

slider-markers-type-mismatch = 標記的類型與滑桿的類型不符。

pretzel-problem-needs-statement-and-answer = 無效的 pretzel：每個 `<problem>` 必須包含一個 `<statement>` 和一個 `<answer>`。

pretzel-circuit-first-problem-distractor = 無效的 pretzel：在 mode="circuit" 下，第一個 `<problem>` 不能是誘答項。

## Attribute values

attribute-invalid-values = 屬性 `{ $attribute }` 的值 { $values } 無效；已忽略。

attribute-must-be-references = 屬性 `{ $attribute }` 的值 `{ $value }` 無效。該屬性必須由以 `$` 開頭的參照組成。

math-input-invalid-function-names = <mathInput>：已忽略 { $attribute } 中無效的函數名稱：{ $names }。每個名稱的顯示部分至少要有 2 個字元（字母或連字號）；其後可跟一個可選的 `|<mathspeak 替代讀法>` 後綴。

## Building components from the source

component-type-invalid = 元件類型無效：`<{ $componentType }>`

attribute-repeated = 屬性 { $attribute } 不能重複。

attribute-invalid-for-component = 屬性「{ $attribute }」對類型為 `<{ $componentType }>` 的元件無效。

## Style definition contrast

style-definition-insufficient-contrast =
    樣式定義 { $styleNumber } 的對比度不足：{ $context ->
        [text-on-background] 文字顏色相對於背景色
        [high-contrast] 高對比度顏色相對於畫布
        [line] 線條顏色相對於畫布
        [marker] 標記顏色相對於畫布
       *[text-on-canvas] 文字顏色相對於畫布
    }{ $mode ->
        [dark] { "（深色模式）" }
       *[light] { "" }
    }（{ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1；至少需要 { $threshold }:1）。

style-definition-dark-mode-text-background-contrast =
    樣式定義 { $styleNumber } 所指定的顏色在淺色模式下對比度足夠，但由這些值推導出的深色模式顏色使文字與背景之間的對比度不足（{ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1；至少需要 { $threshold }:1）。{ $suggestion ->
        [available] 為確保深色模式下對比度足夠，可以提高淺色模式的對比度（例如設定 { $lightAttribute }="{ $lightColor }"），或覆寫深色模式的顏色（例如設定 { $darkAttribute }="{ $darkColor }"）。
       *[none] 為確保深色模式下對比度足夠，請提高淺色模式的對比度，或用 textColorDarkMode 和/或 backgroundColorDarkMode 覆寫推導出的顏色。
    }

style-definition-dark-mode-text-canvas-contrast =
    樣式定義 { $styleNumber } 所指定的文字顏色在淺色模式下對比度足夠，但由該值推導出的深色模式文字顏色相對於畫布對比度不足（{ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1；至少需要 { $threshold }:1）。{ $suggestion ->
        [available] 為確保深色模式下對比度足夠，可以提高淺色模式的對比度（例如設定 textColor="{ $lightColor }"），或覆寫深色模式的顏色（例如設定 textColorDarkMode="{ $darkColor }"）。
       *[none] 為確保深色模式下對比度足夠，請提高淺色模式的對比度，或用 textColorDarkMode 覆寫推導出的顏色。
    }

section-multiple-style-palettes = 一個小節只能選擇一個 <stylePalette>；使用最後一個。

## Unique variants

variant-num-to-select-not-non-negative-integer = 無法確定 { $component } 的唯一變體，因為 numToSelect 不是非負整數。

variant-num-to-select-not-constant-number = 無法確定 { $component } 的唯一變體，因為 numToSelect 不是常數。

variant-with-replacement-not-constant-boolean = 無法確定 { $component } 的唯一變體，因為 withReplacement 不是常數布林值。

variant-select-weight-disables-unique = 若某個選項指定了 selectWeight 或 selectForVariants，則 select 的唯一變體將被停用

variant-coprime-undetermined = 無法確定 { $component } 的唯一變體，因為無法確定 coprime 始終為假。

variant-attribute-not-constant = 無法確定 { $component } 的唯一變體，因為 { $attribute } 不是常數。

variant-attribute-not-number = 無法確定 { $component } 的唯一變體，因為 { $attribute } 不是數字。

variant-attribute-wrong-type-for-sequence =
    無法確定類型為 { $type } 的 { $component } 的唯一變體，因為 { $attribute } 不是{ $expected ->
        [letters-combination] 字母組合
        [math-expression] 有效的數學式
        [integer] 整數
       *[number] 數字
    }。

variant-length-not-integer = 無法確定 { $component } 的唯一變體，因為 length 不是整數。

variant-sort-not-implemented = 尚未實作帶 sort 的 { $component } 的唯一變體

variant-exclude-combinations-not-implemented = 尚未實作帶 excludeCombinations 的 { $component } 的唯一變體

variant-math-exclude-not-implemented = 尚未實作帶 exclude 的 math 類型 { $component } 的唯一變體

variant-non-constant-exclude-not-implemented = 尚未實作 exclude 非常數的 { $component } 的唯一變體

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }：圖形 prefigure 繪製器不支援；已略過該後代。

prefigure-descendant-invalid-geometry = { $subject }：幾何資料非有限或不完整；已略過該後代。

prefigure-curve-label-omitted = { $subject }：轉換後的曲線元素不支援標籤；已省略標籤。

prefigure-curve-unsupported-definition-type = { $subject }：不支援的曲線函數定義類型「{ $definitionType }」；已略過該後代。

prefigure-region-flip-functions-unsupported = { $subject }：不支援 regionBetweenCurves 上的 flipFunctions 屬性；已略過該後代。

prefigure-region-non-formula-child = { $subject }：regionBetweenCurves 只支援公式類型的子函數；已略過該後代。

prefigure-label-position-unsupported =
    { $subject }：{ $labelKind ->
        [line-family] 直線族標籤
       *[point] 點標籤
    }不支援 labelPosition「{ $labelPosition }」；改用 PreFigure 預設對齊方式。

prefigure-fill-style-unsupported = { $subject }：PreFigure 不支援填充樣式「{ $fillStyle }」；改用純色填充。

prefigure-line-style-unknown = { $subject }：未知的線條樣式「{ $lineStyle }」已從 PreFigure 輸出中省略。

prefigure-marker-style-mapped-to-diamond = { $subject }：標記樣式「{ $markerStyle }」已對應為 PreFigure 樣式「diamond」。

prefigure-marker-style-unsupported = { $subject }：PreFigure 不支援標記樣式「{ $markerStyle }」；改用預設樣式。

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`：`ref` 無效；無法解析目標。已省略該註解。

annotation-ref-multiple-targets = `<annotation>`：`ref` 解析到多個目標；使用第一個目標。

annotation-ref-outside-graph = `<annotation>`：`ref` 無效；目標位於所屬圖形之外。已省略該註解。

annotation-ref-unsupported-target = `<annotation>`：`ref` 無效；在 prefigure 轉換中，目標不是受支援的圖形物件。已省略該註解。

annotation-text-missing = `<annotation>`：`text` 缺少或為空；輸出空文字。

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] 偵測到循環相依。
       *[other] 偵測到涉及 `<{ $componentType }>` 元件的循環相依。
    }

reference-no-referent = 未找到該參照所指的對象：`{ $reference }`

reference-multiple-referents = 該參照指向了多個對象：`{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` 的屬性 { $attribute } 格式無效。

children-invalid = `<{ $componentType }>` 的子元素無效：發現無效的子元素：{ $children }

## Falling back to a default

attribute-value-invalid-using-default = 屬性 `{ $attribute }` 的值 `{ $value }` 無效，改用值 `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] 找不到 DoenetML 版本 { $version }。
       *[other] 找不到 DoenetML 版本 { $version }。退回至版本 { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML 無效：{ $content }

parse-tag-missing-close-tag = DoenetML 無效：標籤 `{ $tag }` 沒有結束標籤。應為自封閉標籤或 `</{ $tagName }>` 標籤。

parse-tag-error = DoenetML 無效：標籤 `<{ $tagName }>` 中有錯誤

parse-attribute-missing-value = DoenetML 無效：屬性 `{ $attribute }` 似乎缺少值。

parse-attribute-invalid = DoenetML 無效：屬性 `{ $attribute }` 無效

parse-attribute-value-invalid = DoenetML 無效：屬性值 `{ $value }` 無效

parse-attribute-value-quote-mismatch = DoenetML 無效：屬性值 `{ $value }` 無效。引號不相符，似乎缺少一個 `{ $quote }`

parse-open-tag-name-missing = DoenetML 無效：發現沒有標籤名稱的標籤，例如 `<`

parse-tag-not-closed = DoenetML 無效：標籤 `{ $tag }` 未關閉（似乎缺少 `>`）。

parse-self-closing-tag-name-missing = DoenetML 無效：發現沒有標籤名稱的標籤 `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML 無效：標籤 `{ $tag }` 未關閉（似乎缺少 `/>`）。

parse-tag-invalid-attributes = DoenetML 無效：標籤 `{ $tag }` 無效，其屬性可能有誤。

parse-close-tag-name-missing = DoenetML 無效：發現沒有標籤名稱的結束標籤，例如 `</`

parse-attribute-value-unquoted = 屬性值必須以引號括起來：`{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML 無效：發現結束標籤 `{ $tag }`，但沒有對應的開始標籤

parse-close-tag-mismatched = DoenetML 無效：結束標籤不相符。應為 `</{ $expected }>`，實際為 `{ $found }`

parser-node-unconvertible = 無法將節點 { $node } 轉換為 Dast 節點。

## Names

name-attribute-invalid =
    屬性 name='{ $name }' 無效。{ $reason ->
        [characters] 名稱只能包含字母、數字、底線或連字號。
       *[start] 名稱必須以字母開頭。
    }

component-name-invalid-start = 元件名稱「{ $name }」無效。名稱必須以字母開頭。

## `<answer>` sugar

answer-video-watched-missing-video = 類型為 videoWatched 的 answer 必須有 video 屬性

answer-video-watched-video-not-reference = 類型為 videoWatched 的 answer 的 video 屬性必須是一個參照

answer-name-not-single-text = answer 的 name 屬性必須只有一個文字子元素

## Referencing another document

external-doenetml-recursion-limit = 遞迴層數過多，無法取得外部 DoenetML。是否存在循環參照？

external-doenetml-unavailable = 無法從 { $attribute }="{ $uri }" 取得 DoenetML

external-doenetml-type-mismatch = 從 { $attribute }="{ $uri }" 取得的 DoenetML 無效：它與元件類型「{ $componentType }」不符

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] 屬性 `{ $from }` 已棄用；請改用 `{ $to }`。
       *[other] [deprecation] `<{ $component }>` 上的屬性 `{ $from }` 已棄用；請改用 `{ $to }`。
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] 屬性 `{ $from }` 已棄用並被忽略，因為同時指定了 `{ $to }`。
       *[other] [deprecation] `<{ $component }>` 上的屬性 `{ $from }` 已棄用並被忽略，因為同時指定了 `{ $to }`。
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` 上的屬性 `{ $attribute }` 已棄用並被忽略。


## Language coverage

pluralize-english-only = `<pluralize>` 只能處理英語的複數形式，因此在以 { $locale } 撰寫的文件中，其文字保持不變。請直接寫出複數形式，或用 `pluralForm` 屬性指定。


## Checking against the schema

schema-element-unrecognized = 元素 `<{ $tag }>` 不是可辨識的 Doenet 元素。

schema-element-not-allowed-at-root = 元素 `<{ $tag }>` 不能出現在文件的根部。

schema-element-not-allowed-inside = 元素 `<{ $tag }>` 不能出現在 `<{ $parent }>` 內部。

schema-attribute-unrecognized = 元素 `<{ $tag }>` 沒有名為 `{ $attribute }` 的屬性。

schema-attribute-value-not-allowed =
    { $isList ->
        [true] 元素 `<{ $tag }>` 的屬性 `{ $attribute }` 必須是一個清單，其中每一項都是以下之一：{ $allowed }
       *[other] 元素 `<{ $tag }>` 的屬性 `{ $attribute }` 必須是以下之一：{ $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select 的變體名稱無效。變體名稱 { $variantName } 出現在 { $numOptions } 個選項中，但要選擇的數量是 { $numToSelect }。

select-variant-name-without-options = 為 select 指定了變體，但沒有為可能的變體名稱指定選項：{ $variantName }。

select-variant-name-not-possible = 為 select 指定的變體名稱 { $variantName } 不是可能的變體名稱。

select-too-few-options = 無法從僅有的 { $numOptions } 個元件中選擇 { $numToSelect } 個。

select-from-sequence-too-few-values = 無法從長度為 { $length } 的數列中選擇 { $numToSelect } 個值。

select-from-sequence-indices-count-mismatch = 為 select 指定的索引數量必須與要選擇的數量一致

select-from-sequence-indices-not-integers = 為 select 指定的所有索引必須是整數

select-from-sequence-index-excluded = 為 selectfromsequence 指定的索引已被排除

select-from-sequence-indices-excluded-combination = 為 selectfromsequence 指定的索引構成了被排除的組合

select-from-sequence-coprime-not-positive-integers = 無法選擇互質組合，因為所選的不是正整數。

select-from-sequence-coprime-common-factor = 無法選擇互質的數。所有可能的值都有公因數。（指定的 "from" 或 "to" 必須與 "step" 互質。）

select-from-sequence-coprime-single-number = 無法從單個不為 1 的數中選擇互質組合。

select-from-sequence-excluded-too-many-combinations = selectFromSequence 中排除了超過 70% 的組合

select-from-sequence-coprime-none-found = 未能選出互質的數。所有可能的值都有公因數。

select-from-sequence-too-few-unique-values = 無法從長度為 { $numPossibleValues } 的數列中選擇 { $numToSelect } 個互不相同的值

select-prime-numbers-too-few-values = 無法從長度為 { $numValues } 的質數表中選擇 { $numToSelect } 個值

select-prime-numbers-values-count-mismatch = 為 select 指定的值的數量必須與要選擇的數量一致

select-prime-numbers-values-not-prime = 為 select prime number 指定的所有值都必須在質數表中

select-prime-numbers-values-excluded-combination = 為 selectPrimeNumbers 指定的值構成了被排除的組合

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers 中排除了超過 70% 的組合

select-random-combination-fluke = 由於極為罕見的巧合，未能選出隨機值的組合

select-random-value-fluke = 由於極為罕見的巧合，未能選出隨機值
