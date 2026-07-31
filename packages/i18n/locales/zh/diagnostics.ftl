# Chinese diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Chinese has a single plural category, so a countable message needs no
# selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = 指定两个端点时，{ $attributes } 会被忽略

line-segment-attributes-ignored-with-endpoint-and-midpoint = 同时指定端点和中点时，{ $attributes } 会被忽略

line-segment-midpoint-offset-without-midpoint = 没有中点时 midpointOffset 不起作用

## `<line>`

line-points-undetermined-dimensions = 直线经过的点维数不确定。

line-points-too-few-dimensions = 直线必须经过至少二维的点。

line-points-depend-on-variables = 直线经过的点依赖于变量：{ $variables }。

line-equation-invalid-format = 以变量 { $variable1 } 和 { $variable2 } 表示的直线方程格式无效。

## `<ray>`

ray-overprescribed-through = 射线同时由 through、endpoint 和 direction 确定。忽略所指定的 through。

ray-dimension-mismatch = 射线中的 numDimensions 不一致。

## `<vector>`

vector-overprescribed-head = 向量同时由 head、tail 和 displacement 确定。忽略所指定的 head。

vector-dimension-mismatch = 向量中的 numDimensions 不一致。

## Attracting and constraining

attract-to-without-nearest-point = 无法吸附到 `<{ $component }>`，因为它没有 nearestPoint 状态变量。

constrain-to-without-nearest-point = 无法约束到 `<{ $component }>`，因为它没有 nearestPoint 状态变量。

constrain-to-interior-without-nearest-point = 无法约束到 `<{ $component }>` 的内部，因为它没有 nearestPoint 状态变量。

## `<choiceInput>`

choice-input-label-position-ignored = 对于非内联的 choiceInput，labelPosition 会被忽略

## Ordering children by index

choice-input-indices-count-mismatch = 忽略为 choiceInput 指定的 indices，因为其数量与 choice 子元素的数量不符。

pretzel-indices-count-mismatch = 忽略为 problem 指定的 indices，因为其数量与 problem 子元素的数量不符。

shuffle-indices-count-mismatch = 忽略为 shuffle 指定的 indices，因为其数量与组件数量不符。

indices-ignored-out-of-range = 忽略为 { $component } 指定的 indices，因为有些超出范围。

pretzel-indices-repeated = 忽略为 pretzel 指定的 indices，因为有些重复。

pretzel-circuit-first-index = 忽略在 circuit 模式下为 pretzel 指定的 indices，因为第一个索引必须是 1。

## `<shuffle>` and `<sort>`

string-children-need-type = 要让 `<{ $component }>` 支持字符串子元素，必须指定 `type` 属性。

invalid-type-defaulting-to-math = 组件 { $component } 的类型 { $type } 无效。它必须是 math、text、number 或 boolean 之一。改用 math。

string-not-valid-component-to-arrange = 字符串“{ $value }”不是 { $component } 的有效组件。已忽略。

## Types and variables

invalid-type-defaulting-to-number = 类型 { $type } 无效，类型改设为 number。

invalid-variable-value = 变量的值无效：`{ $value }`

## Variants

variant-index-must-be-number = 变体索引 { $index } 必须是数字

variant-index-must-be-integer = 变体索引 { $index } 必须是整数

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` 未实现绝对尺寸。宽度改为相对值。

side-by-side-absolute-margins = `<{ $component }>` 未实现绝对尺寸。边距改为相对值。

side-by-side-no-block-child = 无效的 `<{ $component }>`：它必须至少有一个块级子元素。

## `<label>`

label-for-ignored-on-graphical = 图形 `<label>` 上的 `for` 属性会被忽略。

label-for-must-resolve-to-one = `<label>` 上的 `for` 属性必须恰好解析为一个组件。

label-for-unresolved = `<label>` 上的 `for` 属性无法解析为组件。

label-for-answer-with-authored-inputs = `<label>` 上的 `for` 属性引用了一个显式书写了输入的 `<answer>`；请直接引用该输入。

label-for-answer-without-input = `<label>` 上的 `for` 属性引用了一个没有可标注输入的 `<answer>`。

label-for-must-reference-input-or-answer = `<label>` 上的 `for` 属性必须引用一个输入或一个答案。

## Accessibility

accessibility-short-description-or-decorative = 为了无障碍，`<{ $component }>` 必须有简短描述，或被标为装饰性元素。

accessibility-video-short-description = 为了无障碍，`<video>` 必须有简短描述。

accessibility-input-short-description-or-label = 为了无障碍，`<{ $component }>` 必须有简短描述或标签。

accessibility-answer-input-short-description-or-label = 为了无障碍，创建输入的 `<answer>` 必须有简短描述或标签。

accessibility-short-description-contains-math = 简短描述中不应包含 `<{ $component }>` 这类数学组件。请用文字把数学内容写出来。

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } 对小节标题文字的对比度不足（深色模式）（{ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1；至少需要 { $threshold }:1）。
       *[other] { $colorName } 对小节标题文字的对比度不足（{ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1；至少需要 { $threshold }:1）。
    }

## `<circle>`

circle-through-points-non-numerical = 当各点没有数值时，尚未实现经过 { $count } 个点的 `<circle>`。

circle-too-many-through-points = 无法计算经过 3 个以上点的圆。

circle-overprescribed-radius-center-points = 无法计算同时指定了半径、圆心和经过点的圆。

circle-center-with-multiple-points = 无法计算指定圆心且经过 1 个以上点的圆。

circle-radius-too-small = 无法计算该圆：两点间距离为 { $distance }，所指定的半径 { $radius } 太小。

circle-radius-with-many-points = 无法在指定半径的情况下创建经过两个以上点的圆。

circle-invalid-center-or-through-points = 圆的圆心或经过点无效。

circle-radius-center-with-multiple-points = 无法计算指定圆心且经过 1 个以上点的圆的半径。

circle-change-radius-non-numerical = 无法更改经过点非数值的圆的半径

circle-radius-with-points-non-numerical = 在没有数值的情况下，无法在指定半径时创建经过一个以上点的圆。

circle-change-center-non-numerical = 尚未实现更改经过非数值点的圆的圆心。

## `<function>`

function-domain-insufficient-dimensions = 函数定义域的维数不足。定义域有 { $intervals } 个区间，而该函数有 { $inputs } 个输入。

function-domain-invalid-format = 函数定义域的格式无效。

function-ignoring-non-numerical =
    { $type ->
        [maximum] 忽略函数的非数值最大值。
        [minimum] 忽略函数的非数值最小值。
        [extremum] 忽略函数的非数值极值。
        [point] 忽略函数的非数值点。
        [slope] 忽略函数的非数值斜率。
       *[other] 忽略函数的非数值 { $type }。
    }

function-ignoring-empty =
    { $type ->
        [maximum] 忽略函数的空最大值。
        [minimum] 忽略函数的空最小值。
        [extremum] 忽略函数的空极值。
        [point] 忽略函数的空点。
       *[other] 忽略函数的空 { $type }。
    }

function-points-too-close = 函数中有两个点位置过于接近，无法定义该函数。

function-iterates-input-output-mismatch = 只有输入个数等于输出个数时才能进行函数迭代。该函数有 { $inputs } 个输入和 { $outputs } 个输出。

## `<sequence>`

sequence-invalid-length = 数列长度无效。它必须是非负整数。

sequence-invalid-step = 数列步长无效。对于类型为 { $type } 的数列，它必须是数字。

sequence-invalid-endpoint-number = 数字数列的“{ $attribute }”无效。它必须是数字。

sequence-invalid-endpoint-letters = 字母数列的“{ $attribute }”无效。它必须是字母组合。

sequence-invalid-endpoint = 数列的“{ $attribute }”无效。

select-from-sequence-coprime-not-numbers = 忽略 coprime，因为所选的不是数字

select-from-sequence-coprime-with-exclude-combinations = 忽略 coprime，因为已指定 excludeCombinations

## Resolving a `target`

target-not-found = `<{ $source }>` 的 target 无效：找不到目标。

target-state-variable-not-found = `<{ $source }>` 的 target 无效：在 `<{ $component }>` 上找不到名为“{ $property }”的状态变量。

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` 的变量必须不同于自变量。

ode-system-duplicate-variable-names = 无法用重复的因变量名定义 ODE 右端函数。

ode-system-rhs-function-error = 无法定义 ODE 右端函数。创建 mathjs 函数时出错。

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = 无法定义 { $count } 条直线之间的角

angle-invalid-through-point = `<angle>` 的 through 中有无效的点

parabola-vertex-too-many-points = 尚未实现指定顶点且经过 1 个以上点的抛物线。

parabola-too-many-points = 尚未实现经过 3 个以上点的抛物线。

intersection-too-many-items = 尚未实现两个以上对象的交集

## Other math components

ionic-compound-not-two-ions = 尚未实现两个离子以外的离子化合物。

ionic-compound-needs-cation-and-anion = 离子化合物仅实现了一个阳离子和一个阴离子的情形。

solve-equations-cannot-evaluate = 无法求解方程，因为无法对其求值：{ $equation }

math-operators-operand-number-required = 提取数学运算对象时必须指定 operandNumber。

eigen-decomposition-failed = 无法计算矩阵的特征值

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`：参数 { $parameters } 未出现在模式中，因此总是会匹配空白。

## `<graph>`

graph-grid-invalid = `<graph>`：无法解析 grid="{ $grid }"。它必须是 none、medium、dense，或以空格分隔的两个正数，例如 grid="1 0.5"。不绘制网格。

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`：prefigure 渲染器不支持 xLabelPosition="left"；改用右侧位置的行为。

prefigure-y-label-position-unsupported = `<graph>`：prefigure 渲染器不支持 yLabelPosition="bottom"；改用顶部位置的行为。

prefigure-invalid-axis-bounds = `<graph>`：prefigure 转换的坐标轴范围无效；改用默认 bbox (-10,-10,10,10)。

prefigure-invalid-width = `<graph>`：prefigure 转换的宽度无效；改用默认图形宽度 425。

prefigure-invalid-aspect-ratio = `<graph>`：prefigure 转换的 aspectRatio 无效；改用默认宽高比 1。

prefigure-grid-spacing-too-fine = `<graph>`：相对于坐标轴范围，网格间距过密；prefigure 渲染器中省略网格。

prefigure-annotations-not-rendered = `<graph>`：不使用 PreFigure 渲染器时不会绘制批注。

multiple-annotations-children = 在 `<graph>` 中发现多个 `<annotations>` 子元素；除最后一个外全部忽略。

## Referring to other components

copy-unrecognized-component-type = 无法扩展或复制无法识别的组件类型：{ $type }。

copy-prop-not-found = 在类型为 { $component } 的组件上找不到属性 { $property }

collect-no-source = 未找到 collect 的来源。

collect-invalid-component-type = 无法收集类型为 `<{ $component }>` 的组件，因为这不是有效的组件类型。

reference-index-unavailable = 无法引用索引 `{ $reference }`

## `<callAction>`

component-action-unavailable = 无法在组件 `{ $reference }` 上调用 { $action }

## `<dataFrame>`

data-frame-inconsistent-row-lengths = 数据形状无效。各行长度不一致。发现于 componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = 数据中有重复的列名。发现于 componentIdx :{ $componentIdx }

data-frame-missing-column-name = 数据缺少列名。发现于 componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = 该答案的某个 award 依赖于 answer 标签自身提交的回答，这会导致意外行为。

answer-max-num-attempts-in-section-wide-check-work = 在带 `sectionWideCheckWork` 的容器内的 `<answer>` 上设置 `maxNumAttempts` 不起作用，因为尝试次数由容器控制。请改在容器上设置 `maxNumAttempts`。

nested-section-wide-check-work-max-num-attempts = 在位于另一个带 `sectionWideCheckWork` 的容器内、且自身也带 `sectionWideCheckWork` 的容器上设置 `maxNumAttempts` 不起作用，因为尝试次数由外层容器控制。请在外层容器上设置 `maxNumAttempts`。

answer-attributes-need-symbolic-equality = 未设置 symbolicEquality 时，{ $attributes } 属性不会起作用。

answer-invalid-type = answer 的类型无效：{ $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = 由于组件 `<{ $component }>` 没有名称，它不能用作模块属性

module-attribute-name-already-defined = 组件 `<{ $component } name="{ $name }">` 不能用作模块的属性，因为组件类型 `<module>` 已经定义了名为“{ $name }”的属性。

conditional-content-condition-ignored = 在带有 case 或 else 子元素的 `<conditionalContent>` 组件上，`condition` 属性会被忽略。

slider-markers-type-mismatch = 标记的类型与滑块的类型不匹配。

pretzel-problem-needs-statement-and-answer = 无效的 pretzel：每个 `<problem>` 必须包含一个 `<statement>` 和一个 `<answer>`。

pretzel-circuit-first-problem-distractor = 无效的 pretzel：在 mode="circuit" 下，第一个 `<problem>` 不能是干扰项。

## Attribute values

attribute-invalid-values = 属性 `{ $attribute }` 的值 { $values } 无效；已忽略。

attribute-must-be-references = 属性 `{ $attribute }` 的值 `{ $value }` 无效。该属性必须由以 `$` 开头的引用组成。

math-input-invalid-function-names = <mathInput>：已忽略 { $attribute } 中无效的函数名：{ $names }。每个名称的显示部分至少要有 2 个字符（字母或连字符）；其后可跟一个可选的 `|<mathspeak 替代读法>` 后缀。

## Building components from the source

component-type-invalid = 组件类型无效：`<{ $componentType }>`

attribute-repeated = 属性 { $attribute } 不能重复。

attribute-invalid-for-component = 属性“{ $attribute }”对类型为 `<{ $componentType }>` 的组件无效。

## Style definition contrast

style-definition-insufficient-contrast =
    样式定义 { $styleNumber } 的对比度不足：{ $context ->
        [text-on-background] 文字颜色相对于背景色
        [high-contrast] 高对比度颜色相对于画布
        [line] 线条颜色相对于画布
        [marker] 标记颜色相对于画布
       *[text-on-canvas] 文字颜色相对于画布
    }{ $mode ->
        [dark] { "（深色模式）" }
       *[light] { "" }
    }（{ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1；至少需要 { $threshold }:1）。

style-definition-dark-mode-text-background-contrast =
    样式定义 { $styleNumber } 所指定的颜色在浅色模式下对比度足够，但由这些值推导出的深色模式颜色使文字与背景之间的对比度不足（{ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1；至少需要 { $threshold }:1）。{ $suggestion ->
        [available] 为确保深色模式下对比度足够，可以提高浅色模式的对比度（例如设置 { $lightAttribute }="{ $lightColor }"），或覆盖深色模式的颜色（例如设置 { $darkAttribute }="{ $darkColor }"）。
       *[none] 为确保深色模式下对比度足够，请提高浅色模式的对比度，或用 textColorDarkMode 和/或 backgroundColorDarkMode 覆盖推导出的颜色。
    }

style-definition-dark-mode-text-canvas-contrast =
    样式定义 { $styleNumber } 所指定的文字颜色在浅色模式下对比度足够，但由该值推导出的深色模式文字颜色相对于画布对比度不足（{ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1；至少需要 { $threshold }:1）。{ $suggestion ->
        [available] 为确保深色模式下对比度足够，可以提高浅色模式的对比度（例如设置 textColor="{ $lightColor }"），或覆盖深色模式的颜色（例如设置 textColorDarkMode="{ $darkColor }"）。
       *[none] 为确保深色模式下对比度足够，请提高浅色模式的对比度，或用 textColorDarkMode 覆盖推导出的颜色。
    }

section-multiple-style-palettes = 一个小节只能选择一个 <stylePalette>；使用最后一个。

## Unique variants

variant-num-to-select-not-non-negative-integer = 无法确定 { $component } 的唯一变体，因为 numToSelect 不是非负整数。

variant-num-to-select-not-constant-number = 无法确定 { $component } 的唯一变体，因为 numToSelect 不是常数。

variant-with-replacement-not-constant-boolean = 无法确定 { $component } 的唯一变体，因为 withReplacement 不是常量布尔值。

variant-select-weight-disables-unique = 若某个选项指定了 selectWeight 或 selectForVariants，则 select 的唯一变体将被禁用

variant-coprime-undetermined = 无法确定 { $component } 的唯一变体，因为无法确定 coprime 始终为假。

variant-attribute-not-constant = 无法确定 { $component } 的唯一变体，因为 { $attribute } 不是常量。

variant-attribute-not-number = 无法确定 { $component } 的唯一变体，因为 { $attribute } 不是数字。

variant-attribute-wrong-type-for-sequence =
    无法确定类型为 { $type } 的 { $component } 的唯一变体，因为 { $attribute } 不是{ $expected ->
        [letters-combination] 字母组合
        [math-expression] 有效的数学表达式
        [integer] 整数
       *[number] 数字
    }。

variant-length-not-integer = 无法确定 { $component } 的唯一变体，因为 length 不是整数。

variant-sort-not-implemented = 尚未实现带 sort 的 { $component } 的唯一变体

variant-exclude-combinations-not-implemented = 尚未实现带 excludeCombinations 的 { $component } 的唯一变体

variant-math-exclude-not-implemented = 尚未实现带 exclude 的 math 类型 { $component } 的唯一变体

variant-non-constant-exclude-not-implemented = 尚未实现 exclude 非常量的 { $component } 的唯一变体

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }：图形 prefigure 渲染器不支持；已跳过该后代。

prefigure-descendant-invalid-geometry = { $subject }：几何数据非有限或不完整；已跳过该后代。

prefigure-curve-label-omitted = { $subject }：转换后的曲线元素不支持标签；已省略标签。

prefigure-curve-unsupported-definition-type = { $subject }：不支持的曲线函数定义类型“{ $definitionType }”；已跳过该后代。

prefigure-region-flip-functions-unsupported = { $subject }：不支持 regionBetweenCurves 上的 flipFunctions 属性；已跳过该后代。

prefigure-region-non-formula-child = { $subject }：regionBetweenCurves 只支持公式类型的子函数；已跳过该后代。

prefigure-label-position-unsupported =
    { $subject }：{ $labelKind ->
        [line-family] 直线族标签
       *[point] 点标签
    }不支持 labelPosition“{ $labelPosition }”；改用 PreFigure 默认对齐方式。

prefigure-fill-style-unsupported = { $subject }：PreFigure 不支持填充样式“{ $fillStyle }”；改用纯色填充。

prefigure-line-style-unknown = { $subject }：未知的线条样式“{ $lineStyle }”已从 PreFigure 输出中省略。

prefigure-marker-style-mapped-to-diamond = { $subject }：标记样式“{ $markerStyle }”已映射为 PreFigure 样式“diamond”。

prefigure-marker-style-unsupported = { $subject }：PreFigure 不支持标记样式“{ $markerStyle }”；改用默认样式。

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`：`ref` 无效；无法解析目标。已省略该批注。

annotation-ref-multiple-targets = `<annotation>`：`ref` 解析到多个目标；使用第一个目标。

annotation-ref-outside-graph = `<annotation>`：`ref` 无效；目标位于所属图形之外。已省略该批注。

annotation-ref-unsupported-target = `<annotation>`：`ref` 无效；在 prefigure 转换中，目标不是受支持的图形对象。已省略该批注。

annotation-text-missing = `<annotation>`：`text` 缺失或为空；输出空文本。

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] 检测到循环依赖。
       *[other] 检测到涉及 `<{ $componentType }>` 组件的循环依赖。
    }

reference-no-referent = 未找到该引用所指的对象：`{ $reference }`

reference-multiple-referents = 该引用指向了多个对象：`{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` 的属性 { $attribute } 格式无效。

children-invalid = `<{ $componentType }>` 的子元素无效：发现无效的子元素：{ $children }

## Falling back to a default

attribute-value-invalid-using-default = 属性 `{ $attribute }` 的值 `{ $value }` 无效，改用值 `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] 找不到 DoenetML 版本 { $version }。
       *[other] 找不到 DoenetML 版本 { $version }。回退到版本 { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML 无效：{ $content }

parse-tag-missing-close-tag = DoenetML 无效：标签 `{ $tag }` 没有结束标签。应为自闭合标签或 `</{ $tagName }>` 标签。

parse-tag-error = DoenetML 无效：标签 `<{ $tagName }>` 中有错误

parse-attribute-missing-value = DoenetML 无效：属性 `{ $attribute }` 似乎缺少值。

parse-attribute-invalid = DoenetML 无效：属性 `{ $attribute }` 无效

parse-attribute-value-invalid = DoenetML 无效：属性值 `{ $value }` 无效

parse-attribute-value-quote-mismatch = DoenetML 无效：属性值 `{ $value }` 无效。引号不匹配，似乎缺少一个 `{ $quote }`

parse-open-tag-name-missing = DoenetML 无效：发现没有标签名的标签，例如 `<`

parse-tag-not-closed = DoenetML 无效：标签 `{ $tag }` 未闭合（似乎缺少 `>`）。

parse-self-closing-tag-name-missing = DoenetML 无效：发现没有标签名的标签 `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML 无效：标签 `{ $tag }` 未闭合（似乎缺少 `/>`）。

parse-tag-invalid-attributes = DoenetML 无效：标签 `{ $tag }` 无效，其属性可能有误。

parse-close-tag-name-missing = DoenetML 无效：发现没有标签名的结束标签，例如 `</`

parse-attribute-value-unquoted = 属性值必须用引号括起来：`{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML 无效：发现结束标签 `{ $tag }`，但没有对应的开始标签

parse-close-tag-mismatched = DoenetML 无效：结束标签不匹配。应为 `</{ $expected }>`，实际为 `{ $found }`

parser-node-unconvertible = 无法将节点 { $node } 转换为 Dast 节点。

## Names

name-attribute-invalid =
    属性 name='{ $name }' 无效。{ $reason ->
        [characters] 名称只能包含字母、数字、下划线或连字符。
       *[start] 名称必须以字母开头。
    }

component-name-invalid-start = 组件名称“{ $name }”无效。名称必须以字母开头。

## `<answer>` sugar

answer-video-watched-missing-video = 类型为 videoWatched 的 answer 必须有 video 属性

answer-video-watched-video-not-reference = 类型为 videoWatched 的 answer 的 video 属性必须是一个引用

answer-name-not-single-text = answer 的 name 属性必须只有一个文本子元素

## Referencing another document

external-doenetml-recursion-limit = 递归层数过多，无法获取外部 DoenetML。是否存在循环引用？

external-doenetml-unavailable = 无法从 { $attribute }="{ $uri }" 获取 DoenetML

external-doenetml-type-mismatch = 从 { $attribute }="{ $uri }" 获取的 DoenetML 无效：它与组件类型“{ $componentType }”不匹配

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] 属性 `{ $from }` 已弃用；请改用 `{ $to }`。
       *[other] [deprecation] `<{ $component }>` 上的属性 `{ $from }` 已弃用；请改用 `{ $to }`。
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] 属性 `{ $from }` 已弃用并被忽略，因为同时指定了 `{ $to }`。
       *[other] [deprecation] `<{ $component }>` 上的属性 `{ $from }` 已弃用并被忽略，因为同时指定了 `{ $to }`。
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` 上的属性 `{ $attribute }` 已弃用并被忽略。


## Language coverage

pluralize-english-only = `<pluralize>` 只能处理英语的复数形式，因此在以 { $locale } 撰写的文档中，其文本保持不变。请直接写出复数形式，或用 `pluralForm` 属性指定。


## Checking against the schema

schema-element-unrecognized = 元素 `<{ $tag }>` 不是可识别的 Doenet 元素。

schema-element-not-allowed-at-root = 元素 `<{ $tag }>` 不能出现在文档的根部。

schema-element-not-allowed-inside = 元素 `<{ $tag }>` 不能出现在 `<{ $parent }>` 内部。

schema-attribute-unrecognized = 元素 `<{ $tag }>` 没有名为 `{ $attribute }` 的属性。

schema-attribute-value-not-allowed =
    { $isList ->
        [true] 元素 `<{ $tag }>` 的属性 `{ $attribute }` 必须是一个列表，其中每一项都是以下之一：{ $allowed }
       *[other] 元素 `<{ $tag }>` 的属性 `{ $attribute }` 必须是以下之一：{ $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select 的变体名称无效。变体名称 { $variantName } 出现在 { $numOptions } 个选项中，但要选择的数量是 { $numToSelect }。

select-variant-name-without-options = 为 select 指定了变体，但没有为可能的变体名称指定选项：{ $variantName }。

select-variant-name-not-possible = 为 select 指定的变体名称 { $variantName } 不是可能的变体名称。

select-too-few-options = 无法从仅有的 { $numOptions } 个组件中选择 { $numToSelect } 个。

select-from-sequence-too-few-values = 无法从长度为 { $length } 的数列中选择 { $numToSelect } 个值。

select-from-sequence-indices-count-mismatch = 为 select 指定的索引数量必须与要选择的数量一致

select-from-sequence-indices-not-integers = 为 select 指定的所有索引必须是整数

select-from-sequence-index-excluded = 为 selectfromsequence 指定的索引已被排除

select-from-sequence-indices-excluded-combination = 为 selectfromsequence 指定的索引构成了被排除的组合

select-from-sequence-coprime-not-positive-integers = 无法选择互质组合，因为所选的不是正整数。

select-from-sequence-coprime-common-factor = 无法选择互质的数。所有可能的值都有公因数。（指定的 "from" 或 "to" 必须与 "step" 互质。）

select-from-sequence-coprime-single-number = 无法从单个不为 1 的数中选择互质组合。

select-from-sequence-excluded-too-many-combinations = selectFromSequence 中排除了超过 70% 的组合

select-from-sequence-coprime-none-found = 未能选出互质的数。所有可能的值都有公因数。

select-from-sequence-too-few-unique-values = 无法从长度为 { $numPossibleValues } 的数列中选择 { $numToSelect } 个互不相同的值

select-prime-numbers-too-few-values = 无法从长度为 { $numValues } 的素数表中选择 { $numToSelect } 个值

select-prime-numbers-values-count-mismatch = 为 select 指定的值的数量必须与要选择的数量一致

select-prime-numbers-values-not-prime = 为 select prime number 指定的所有值都必须在素数表中

select-prime-numbers-values-excluded-combination = 为 selectPrimeNumbers 指定的值构成了被排除的组合

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers 中排除了超过 70% 的组合

select-random-combination-fluke = 由于极其罕见的巧合，未能选出随机值的组合

select-random-value-fluke = 由于极其罕见的巧合，未能选出随机值
