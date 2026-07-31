# Japanese diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Japanese has a single plural category, so a countable message needs no
# selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = 端点が 2 つ指定されている場合、{ $attributes } は無視されます

line-segment-attributes-ignored-with-endpoint-and-midpoint = 端点と中点の両方が指定されている場合、{ $attributes } は無視されます

line-segment-midpoint-offset-without-midpoint = 中点がない場合、midpointOffset は効果がありません

## `<line>`

line-points-undetermined-dimensions = 次元が確定していない点を通る直線です。

line-points-too-few-dimensions = 直線は少なくとも 2 次元の点を通らなければなりません。

line-points-depend-on-variables = 直線は変数に依存する点を通っています: { $variables }。

line-equation-invalid-format = 変数 { $variable1 } と { $variable2 } による直線の方程式の書式が無効です。

## `<ray>`

ray-overprescribed-through = 半直線が through、endpoint、direction によって同時に指定されています。指定された through を無視します。

ray-dimension-mismatch = 半直線の numDimensions が一致しません。

## `<vector>`

vector-overprescribed-head = ベクトルが head、tail、displacement によって同時に指定されています。指定された head を無視します。

vector-dimension-mismatch = ベクトルの numDimensions が一致しません。

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` には nearestPoint 状態変数がないため、吸着できません。

constrain-to-without-nearest-point = `<{ $component }>` には nearestPoint 状態変数がないため、拘束できません。

constrain-to-interior-without-nearest-point = `<{ $component }>` には nearestPoint 状態変数がないため、その内部に拘束できません。

## `<choiceInput>`

choice-input-label-position-ignored = インラインでない choiceInput では labelPosition は無視されます

## Ordering children by index

choice-input-indices-count-mismatch = indices の個数が choice 子要素の個数と一致しないため、choiceInput に指定された indices を無視します。

pretzel-indices-count-mismatch = indices の個数が problem 子要素の個数と一致しないため、problem に指定された indices を無視します。

shuffle-indices-count-mismatch = indices の個数がコンポーネントの個数と一致しないため、shuffle に指定された indices を無視します。

indices-ignored-out-of-range = 範囲外の添字があるため、{ $component } に指定された indices を無視します。

pretzel-indices-repeated = 重複した添字があるため、pretzel に指定された indices を無視します。

pretzel-circuit-first-index = circuit モードでは最初の添字が 1 でなければならないため、pretzel に指定された indices を無視します。

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` が文字列の子要素を扱うには、`type` 属性を指定する必要があります。

invalid-type-defaulting-to-math = { $component } コンポーネントの型 { $type } は無効です。math、text、number、boolean のいずれかでなければなりません。math を使用します。

string-not-valid-component-to-arrange = 文字列「{ $value }」は { $component } の対象として有効なコンポーネントではありません。無視します。

## Types and variables

invalid-type-defaulting-to-number = 型 { $type } は無効です。型を number に設定します。

invalid-variable-value = 変数の値が無効です: `{ $value }`

## Variants

variant-index-must-be-number = バリアントの添字 { $index } は数値でなければなりません

variant-index-must-be-integer = バリアントの添字 { $index } は整数でなければなりません

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` は絶対寸法に未対応です。幅を相対値に変更します。

side-by-side-absolute-margins = `<{ $component }>` は絶対寸法に未対応です。余白を相対値に変更します。

side-by-side-no-block-child = `<{ $component }>` が無効です: 少なくとも 1 つのブロック子要素が必要です。

## `<label>`

label-for-ignored-on-graphical = 図形の `<label>` の `for` 属性は無視されます。

label-for-must-resolve-to-one = `<label>` の `for` 属性はちょうど 1 つのコンポーネントに解決されなければなりません。

label-for-unresolved = `<label>` の `for` 属性をコンポーネントに解決できませんでした。

label-for-answer-with-authored-inputs = `<label>` の `for` 属性が、入力を明示的に記述した `<answer>` を参照しています。その入力を直接参照してください。

label-for-answer-without-input = `<label>` の `for` 属性が、ラベルを付ける入力を持たない `<answer>` を参照しています。

label-for-must-reference-input-or-answer = `<label>` の `for` 属性は入力または解答を参照しなければなりません。

## Accessibility

accessibility-short-description-or-decorative = アクセシビリティのため、`<{ $component }>` には短い説明を付けるか、装飾用として指定する必要があります。

accessibility-video-short-description = アクセシビリティのため、`<video>` には短い説明が必要です。

accessibility-input-short-description-or-label = アクセシビリティのため、`<{ $component }>` には短い説明またはラベルが必要です。

accessibility-answer-input-short-description-or-label = アクセシビリティのため、入力を作る `<answer>` には短い説明またはラベルが必要です。

accessibility-short-description-contains-math = 短い説明に `<{ $component }>` のような数学コンポーネントを含めるべきではありません。数式は言葉で書き表してください。

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } は節見出しの文字に対してコントラストが不足しています（ダークモード）（{ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1、最低 { $threshold }:1 が必要）。
       *[other] { $colorName } は節見出しの文字に対してコントラストが不足しています（{ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1、最低 { $threshold }:1 が必要）。
    }

## `<circle>`

circle-through-points-non-numerical = 点が数値を持たない場合の、{ $count } 点を通る `<circle>` は未実装です。

circle-too-many-through-points = 3 点を超える点を通る円は計算できません。

circle-overprescribed-radius-center-points = 半径・中心・通過点をすべて指定した円は計算できません。

circle-center-with-multiple-points = 中心を指定して 1 点を超える点を通る円は計算できません。

circle-radius-too-small = 円を計算できません: 2 点間の距離が { $distance } であるため、指定された半径 { $radius } は小さすぎます。

circle-radius-with-many-points = 半径を指定して 2 点を超える点を通る円は作成できません。

circle-invalid-center-or-through-points = 円の中心または通過点が無効です。

circle-radius-center-with-multiple-points = 中心を指定して 1 点を超える点を通る円の半径は計算できません。

circle-change-radius-non-numerical = 通過点が数値でない円の半径は変更できません

circle-radius-with-points-non-numerical = 数値が得られない状態で、半径を指定して 1 点を超える点を通る円は作成できません。

circle-change-center-non-numerical = 数値でない点を通る円の中心の変更は未実装です。

## `<function>`

function-domain-insufficient-dimensions = 関数の定義域の次元が不足しています。定義域には区間が { $intervals } 個ありますが、関数の入力は { $inputs } 個です。

function-domain-invalid-format = 関数の定義域の書式が無効です。

function-ignoring-non-numerical =
    { $type ->
        [maximum] 数値でない関数の最大値を無視します。
        [minimum] 数値でない関数の最小値を無視します。
        [extremum] 数値でない関数の極値を無視します。
        [point] 数値でない関数の点を無視します。
        [slope] 数値でない関数の傾きを無視します。
       *[other] 数値でない関数の { $type } を無視します。
    }

function-ignoring-empty =
    { $type ->
        [maximum] 空の関数の最大値を無視します。
        [minimum] 空の関数の最小値を無視します。
        [extremum] 空の関数の極値を無視します。
        [point] 空の関数の点を無視します。
       *[other] 空の関数の { $type } を無視します。
    }

function-points-too-close = 関数に位置が近すぎる 2 点があります。関数を定義できません。

function-iterates-input-output-mismatch = 関数の反復は入力の個数と出力の個数が等しい場合にのみ可能です。この関数の入力は { $inputs } 個、出力は { $outputs } 個です。

## `<sequence>`

sequence-invalid-length = 数列の長さが無効です。非負整数でなければなりません。

sequence-invalid-step = 数列の刻み幅が無効です。型 { $type } の数列では数値でなければなりません。

sequence-invalid-endpoint-number = 数値数列の「{ $attribute }」が無効です。数値でなければなりません。

sequence-invalid-endpoint-letters = 文字数列の「{ $attribute }」が無効です。文字の組み合わせでなければなりません。

sequence-invalid-endpoint = 数列の「{ $attribute }」が無効です。

select-from-sequence-coprime-not-numbers = 数値を選択していないため coprime を無視します

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations が指定されているため coprime を無視します

## Resolving a `target`

target-not-found = `<{ $source }>` の target が無効です: ターゲットが見つかりません。

target-state-variable-not-found = `<{ $source }>` の target が無効です: `<{ $component }>` に「{ $property }」という状態変数が見つかりません。

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` の変数は独立変数と異なっていなければなりません。

ode-system-duplicate-variable-names = 従属変数名が重複しているため、ODE の右辺関数を定義できません。

ode-system-rhs-function-error = ODE の右辺関数を定義できません。mathjs 関数の作成時にエラーが発生しました。

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } 本の直線がなす角は定義できません

angle-invalid-through-point = `<angle>` の through に無効な点があります

parabola-vertex-too-many-points = 頂点を指定して 1 点を超える点を通る放物線は未実装です。

parabola-too-many-points = 3 点を超える点を通る放物線は未実装です。

intersection-too-many-items = 2 つを超える対象の共通部分は未実装です

## Other math components

ionic-compound-not-two-ions = 2 つのイオン以外のイオン化合物は未実装です。

ionic-compound-needs-cation-and-anion = イオン化合物は陽イオン 1 つと陰イオン 1 つの場合のみ実装されています。

solve-equations-cannot-evaluate = 方程式を評価できないため解けません: { $equation }

math-operators-operand-number-required = 数学のオペランドを取り出すには operandNumber を指定しなければなりません。

eigen-decomposition-failed = 行列の固有値を計算できませんでした

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: パラメータ { $parameters } はパターンに現れないため、常に空白に一致します。

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" を解釈できません。none、medium、dense、または空白で区切られた 2 つの正の数（例: grid="1 0.5"）でなければなりません。グリッドは描画されません。

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure レンダラーは xLabelPosition="left" に未対応です。右位置の挙動を使用します。

prefigure-y-label-position-unsupported = `<graph>`: prefigure レンダラーは yLabelPosition="bottom" に未対応です。上位置の挙動を使用します。

prefigure-invalid-axis-bounds = `<graph>`: prefigure 変換の軸範囲が無効です。既定の bbox (-10,-10,10,10) を使用します。

prefigure-invalid-width = `<graph>`: prefigure 変換の幅が無効です。既定の図の幅 425 を使用します。

prefigure-invalid-aspect-ratio = `<graph>`: prefigure 変換の aspectRatio が無効です。既定の縦横比 1 を使用します。

prefigure-grid-spacing-too-fine = `<graph>`: 軸の範囲に対してグリッド間隔が細かすぎます。prefigure レンダラーではグリッドを省略します。

prefigure-annotations-not-rendered = `<graph>`: PreFigure レンダラーを使用しない場合、注釈は描画されません。

multiple-annotations-children = `<graph>` 内に複数の `<annotations>` 子要素が見つかりました。最後の 1 つを除いてすべて無視します。

## Referring to other components

copy-unrecognized-component-type = 認識できないコンポーネント型は拡張もコピーもできません: { $type }。

copy-prop-not-found = 型 { $component } のコンポーネントにプロパティ { $property } が見つかりません

collect-no-source = collect の対象が見つかりません。

collect-invalid-component-type = `<{ $component }>` は有効なコンポーネント型ではないため、その型のコンポーネントは収集できません。

reference-index-unavailable = 添字 `{ $reference }` は参照できません

## `<callAction>`

component-action-unavailable = コンポーネント `{ $reference }` に対して { $action } を呼び出せません

## `<dataFrame>`

data-frame-inconsistent-row-lengths = データの形状が無効です。行の長さが揃っていません。componentIdx :{ $componentIdx } で検出

data-frame-duplicate-column-names = データに重複した列名があります。componentIdx :{ $componentIdx } で検出

data-frame-missing-column-name = データに列名がありません。componentIdx :{ $componentIdx } で検出

## `<answer>` and scoring

answer-award-depends-on-own-response = この解答の award が answer タグ自身の送信済み解答に基づいており、予期しない動作を引き起こします。

answer-max-num-attempts-in-section-wide-check-work = 試行回数はコンテナによって制御されるため、`sectionWideCheckWork` を持つコンテナ内の `<answer>` に `maxNumAttempts` を設定しても効果はありません。コンテナ側に `maxNumAttempts` を設定してください。

nested-section-wide-check-work-max-num-attempts = 試行回数は外側のコンテナによって制御されるため、`sectionWideCheckWork` を持つ別のコンテナの中にある `sectionWideCheckWork` 付きコンテナに `maxNumAttempts` を設定しても効果はありません。外側のコンテナに `maxNumAttempts` を設定してください。

answer-attributes-need-symbolic-equality = symbolicEquality が設定されていない場合、{ $attributes } 属性は効果がありません。

answer-invalid-type = answer の型が無効です: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = コンポーネント `<{ $component }>` には名前がないため、モジュールの属性として使用できません

module-attribute-name-already-defined = `<module>` コンポーネント型には既に「{ $name }」属性が定義されているため、コンポーネント `<{ $component } name="{ $name }">` をモジュールの属性として使用できません。

conditional-content-condition-ignored = case または else の子要素を持つ `<conditionalContent>` コンポーネントでは `condition` 属性は無視されます。

slider-markers-type-mismatch = マーカーの型がスライダーの型と一致しません。

pretzel-problem-needs-statement-and-answer = pretzel が無効です: 各 `<problem>` は `<statement>` 1 つと `<answer>` 1 つを含まなければなりません。

pretzel-circuit-first-problem-distractor = pretzel が無効です: mode="circuit" では最初の `<problem>` をダミー選択肢にはできません。

## Attribute values

attribute-invalid-values = 属性 `{ $attribute }` の値 { $values } は無効です。無視します。

attribute-must-be-references = 属性 `{ $attribute }` の値 `{ $value }` は無効です。この属性は `$` で始まる参照で構成されていなければなりません。

math-input-invalid-function-names = <mathInput>: { $attribute } 内の無効な関数名を無視しました: { $names }。各名前の表示部分は 2 文字以上（英字またはハイフン）でなければならず、その後に任意で `|<mathspeak 代替読み>` を続けられます。

## Building components from the source

component-type-invalid = コンポーネント型が無効です: `<{ $componentType }>`

attribute-repeated = 属性 { $attribute } を繰り返すことはできません。

attribute-invalid-for-component = 属性「{ $attribute }」は型 `<{ $componentType }>` のコンポーネントには無効です。

## Style definition contrast

style-definition-insufficient-contrast =
    スタイル定義 { $styleNumber } は{ $context ->
        [text-on-background] 背景色に対する文字色
        [high-contrast] キャンバスに対する高コントラスト色
        [line] キャンバスに対する線の色
        [marker] キャンバスに対するマーカーの色
       *[text-on-canvas] キャンバスに対する文字色
    }のコントラストが不足しています{ $mode ->
        [dark] { "（ダークモード）" }
       *[light] { "" }
    }（{ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1、最低 { $threshold }:1 が必要）。

style-definition-dark-mode-text-background-contrast =
    スタイル定義 { $styleNumber } はライトモードでは十分なコントラストの色を指定していますが、その値から導かれるダークモードの色は文字色と背景色の間のコントラストが不足しています（{ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1、最低 { $threshold }:1 が必要）。{ $suggestion ->
        [available] ダークモードで十分なコントラストを確保するには、ライトモードのコントラストを上げる（例: { $lightAttribute }="{ $lightColor }" を設定）か、ダークモードの色を上書きしてください（例: { $darkAttribute }="{ $darkColor }" を設定）。
       *[none] ダークモードで十分なコントラストを確保するには、ライトモードのコントラストを上げるか、textColorDarkMode や backgroundColorDarkMode で導出色を上書きしてください。
    }

style-definition-dark-mode-text-canvas-contrast =
    スタイル定義 { $styleNumber } はライトモードでは十分なコントラストの文字色を指定していますが、その値から導かれるダークモードの文字色はキャンバスに対するコントラストが不足しています（{ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1、最低 { $threshold }:1 が必要）。{ $suggestion ->
        [available] ダークモードで十分なコントラストを確保するには、ライトモードのコントラストを上げる（例: textColor="{ $lightColor }" を設定）か、ダークモードの色を上書きしてください（例: textColorDarkMode="{ $darkColor }" を設定）。
       *[none] ダークモードで十分なコントラストを確保するには、ライトモードのコントラストを上げるか、textColorDarkMode で導出色を上書きしてください。
    }

section-multiple-style-palettes = 1 つの節が選択できる <stylePalette> は 1 つだけです。最後のものを使用します。

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect が非負整数でないため、{ $component } の一意なバリアントを決定できません。

variant-num-to-select-not-constant-number = numToSelect が定数でないため、{ $component } の一意なバリアントを決定できません。

variant-with-replacement-not-constant-boolean = withReplacement が定数の真偽値でないため、{ $component } の一意なバリアントを決定できません。

variant-select-weight-disables-unique = いずれかの選択肢が selectWeight または selectForVariants を指定している場合、select の一意なバリアントは無効になります

variant-coprime-undetermined = coprime が常に偽であると確定できないため、{ $component } の一意なバリアントを決定できません。

variant-attribute-not-constant = { $attribute } が定数でないため、{ $component } の一意なバリアントを決定できません。

variant-attribute-not-number = { $attribute } が数値でないため、{ $component } の一意なバリアントを決定できません。

variant-attribute-wrong-type-for-sequence =
    { $attribute } が{ $expected ->
        [letters-combination] 文字の組み合わせ
        [math-expression] 有効な数式
        [integer] 整数
       *[number] 数値
    }でないため、型 { $type } の { $component } の一意なバリアントを決定できません。

variant-length-not-integer = length が整数でないため、{ $component } の一意なバリアントを決定できません。

variant-sort-not-implemented = sort を伴う { $component } の一意なバリアントは未実装です

variant-exclude-combinations-not-implemented = excludeCombinations を伴う { $component } の一意なバリアントは未実装です

variant-math-exclude-not-implemented = exclude を伴う math 型の { $component } の一意なバリアントは未実装です

variant-non-constant-exclude-not-implemented = 定数でない exclude を伴う { $component } の一意なバリアントは未実装です

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: グラフの prefigure レンダラーでは未対応です。この子孫要素をスキップしました。

prefigure-descendant-invalid-geometry = { $subject }: 幾何データが有限でないか不完全です。この子孫要素をスキップしました。

prefigure-curve-label-omitted = { $subject }: 変換後の曲線要素はラベルに未対応です。ラベルを省略しました。

prefigure-curve-unsupported-definition-type = { $subject }: 曲線関数の定義型「{ $definitionType }」は未対応です。この子孫要素をスキップしました。

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves の flipFunctions 属性は未対応です。この子孫要素をスキップしました。

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves は formula 型の子関数のみに対応しています。この子孫要素をスキップしました。

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] 直線族のラベル
       *[point] 点のラベル
    }では labelPosition「{ $labelPosition }」は未対応です。PreFigure の既定の配置を使用します。

prefigure-fill-style-unsupported = { $subject }: 塗りつぶしスタイル「{ $fillStyle }」は PreFigure では未対応です。単色の塗りつぶしに切り替えます。

prefigure-line-style-unknown = { $subject }: 不明な線スタイル「{ $lineStyle }」を PreFigure の出力から省略しました。

prefigure-marker-style-mapped-to-diamond = { $subject }: マーカースタイル「{ $markerStyle }」を PreFigure のスタイル「diamond」に対応付けました。

prefigure-marker-style-unsupported = { $subject }: マーカースタイル「{ $markerStyle }」は PreFigure では未対応です。既定のスタイルを使用します。

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` が無効です。ターゲットを解決できません。この注釈を省略しました。

annotation-ref-multiple-targets = `<annotation>`: `ref` が複数のターゲットに解決されました。最初のターゲットを使用します。

annotation-ref-outside-graph = `<annotation>`: `ref` が無効です。ターゲットが所属するグラフの外にあります。この注釈を省略しました。

annotation-ref-unsupported-target = `<annotation>`: `ref` が無効です。prefigure 変換では、ターゲットが対応している図形オブジェクトではありません。この注釈を省略しました。

annotation-text-missing = `<annotation>`: `text` が欠落しているか空です。空のテキストを出力します。

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] 循環依存を検出しました。
       *[other] `<{ $componentType }>` コンポーネントが関わる循環依存を検出しました。
    }

reference-no-referent = 参照先が見つかりません: `{ $reference }`

reference-multiple-referents = 参照先が複数見つかりました: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` の属性 { $attribute } の書式が無効です。

children-invalid = `<{ $componentType }>` の子要素が無効です: 無効な子要素が見つかりました: { $children }

## Falling back to a default

attribute-value-invalid-using-default = 属性 `{ $attribute }` の値 `{ $value }` は無効です。値 `{ $default }` を使用します

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML バージョン { $version } が見つかりません。
       *[other] DoenetML バージョン { $version } が見つかりません。バージョン { $fallback } に戻します
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML が無効です: { $content }

parse-tag-missing-close-tag = DoenetML が無効です: タグ `{ $tag }` に終了タグがありません。自己終了タグか `</{ $tagName }>` タグが必要です。

parse-tag-error = DoenetML が無効です: タグ `<{ $tagName }>` にエラーがあります

parse-attribute-missing-value = DoenetML が無効です: 属性 `{ $attribute }` に値がないようです。

parse-attribute-invalid = DoenetML が無効です: 属性 `{ $attribute }` が無効です

parse-attribute-value-invalid = DoenetML が無効です: 属性値 `{ $value }` が無効です

parse-attribute-value-quote-mismatch = DoenetML が無効です: 属性値 `{ $value }` が無効です。引用符が対応していません。`{ $quote }` が足りないようです

parse-open-tag-name-missing = DoenetML が無効です: タグ名のないタグが見つかりました（例: `<`）

parse-tag-not-closed = DoenetML が無効です: タグ `{ $tag }` が閉じられていません（`>` が足りないようです）。

parse-self-closing-tag-name-missing = DoenetML が無効です: タグ名のないタグが見つかりました `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML が無効です: タグ `{ $tag }` が閉じられていません（`/>` が足りないようです）。

parse-tag-invalid-attributes = DoenetML が無効です: タグ `{ $tag }` が無効です。属性が正しくない可能性があります。

parse-close-tag-name-missing = DoenetML が無効です: タグ名のない終了タグが見つかりました（例: `</`）

parse-attribute-value-unquoted = 属性値は引用符で囲まなければなりません: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML が無効です: 終了タグ `{ $tag }` が見つかりましたが、対応する開始タグがありません

parse-close-tag-mismatched = DoenetML が無効です: 終了タグが対応していません。`</{ $expected }>` が必要ですが、`{ $found }` が見つかりました

parser-node-unconvertible = ノード { $node } を Dast ノードに変換できませんでした。

## Names

name-attribute-invalid =
    属性 name='{ $name }' が無効です。{ $reason ->
        [characters] 名前には英字・数字・アンダースコア・ハイフンのみを使用できます。
       *[start] 名前は英字で始まらなければなりません。
    }

component-name-invalid-start = コンポーネント名「{ $name }」が無効です。名前は英字で始まらなければなりません。

## `<answer>` sugar

answer-video-watched-missing-video = 型 videoWatched の answer には video 属性が必要です

answer-video-watched-video-not-reference = 型 videoWatched の answer の video 属性は参照でなければなりません

answer-name-not-single-text = answer の name 属性はテキストの子要素をちょうど 1 つ持たなければなりません

## Referencing another document

external-doenetml-recursion-limit = 再帰の階層が深すぎるため、外部の DoenetML を取得できません。循環参照はありませんか。

external-doenetml-unavailable = { $attribute }="{ $uri }" から DoenetML を取得できません

external-doenetml-type-mismatch = { $attribute }="{ $uri }" から取得した DoenetML が無効です: コンポーネント型「{ $componentType }」と一致しませんでした

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] 属性 `{ $from }` は非推奨です。代わりに `{ $to }` を使用してください。
       *[other] [deprecation] `<{ $component }>` の属性 `{ $from }` は非推奨です。代わりに `{ $to }` を使用してください。
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` も指定されているため、属性 `{ $from }` は非推奨として無視されます。
       *[other] [deprecation] `{ $to }` も指定されているため、`<{ $component }>` の属性 `{ $from }` は非推奨として無視されます。
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` の属性 `{ $attribute }` は非推奨として無視されます。


## Language coverage

pluralize-english-only = `<pluralize>` は英語の複数形しか作れないため、{ $locale } で書かれた文書ではテキストがそのまま残ります。複数形を直接書くか、`pluralForm` 属性で指定してください。


## Checking against the schema

schema-element-unrecognized = 要素 `<{ $tag }>` は認識される Doenet 要素ではありません。

schema-element-not-allowed-at-root = 要素 `<{ $tag }>` は文書のルートには置けません。

schema-element-not-allowed-inside = 要素 `<{ $tag }>` は `<{ $parent }>` の中には置けません。

schema-attribute-unrecognized = 要素 `<{ $tag }>` に `{ $attribute }` という属性はありません。

schema-attribute-value-not-allowed =
    { $isList ->
        [true] 要素 `<{ $tag }>` の属性 `{ $attribute }` は、各項目が次のいずれかであるリストでなければなりません: { $allowed }
       *[other] 要素 `<{ $tag }>` の属性 `{ $attribute }` は次のいずれかでなければなりません: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select のバリアント名が無効です。バリアント名 { $variantName } は { $numOptions } 個の選択肢に現れますが、選択する数は { $numToSelect } です。

select-variant-name-without-options = select にバリアントが指定されていますが、可能なバリアント名 { $variantName } に対する選択肢がありません。

select-variant-name-not-possible = select に指定されたバリアント名 { $variantName } は、可能なバリアント名ではありません。

select-too-few-options = わずか { $numOptions } 個のコンポーネントから { $numToSelect } 個は選択できません。

select-from-sequence-too-few-values = 長さ { $length } の数列から { $numToSelect } 個の値は選択できません。

select-from-sequence-indices-count-mismatch = select に指定する添字の個数は、選択する数と一致しなければなりません

select-from-sequence-indices-not-integers = select に指定する添字はすべて整数でなければなりません

select-from-sequence-index-excluded = selectfromsequence に指定された添字は除外されたものでした

select-from-sequence-indices-excluded-combination = selectfromsequence に指定された添字は除外された組み合わせでした

select-from-sequence-coprime-not-positive-integers = 正の整数を選択していないため、互いに素な組み合わせは選択できません。

select-from-sequence-coprime-common-factor = 互いに素な数を選択できません。可能な値がすべて公約数を持っています。（指定された "from" または "to" は "step" と互いに素でなければなりません。）

select-from-sequence-coprime-single-number = 1 でない単一の数から互いに素な組み合わせは選択できません。

select-from-sequence-excluded-too-many-combinations = selectFromSequence で組み合わせの 70% 以上が除外されています

select-from-sequence-coprime-none-found = 互いに素な数を選択できませんでした。可能な値がすべて公約数を持っています。

select-from-sequence-too-few-unique-values = 長さ { $numPossibleValues } の数列から相異なる値を { $numToSelect } 個は選択できません

select-prime-numbers-too-few-values = 長さ { $numValues } の素数表から { $numToSelect } 個の値は選択できません

select-prime-numbers-values-count-mismatch = select に指定する値の個数は、選択する数と一致しなければなりません

select-prime-numbers-values-not-prime = select prime number に指定する値はすべて素数表に含まれていなければなりません

select-prime-numbers-values-excluded-combination = selectPrimeNumbers に指定された値は除外された組み合わせでした

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers で組み合わせの 70% 以上が除外されています

select-random-combination-fluke = きわめて稀な偶然により、ランダムな値の組み合わせを選択できませんでした

select-random-value-fluke = きわめて稀な偶然により、ランダムな値を選択できませんでした
