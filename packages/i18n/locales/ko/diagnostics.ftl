# Korean diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Korean has a single plural category, so a countable message needs no
# selection.
#
# Where an alternating particle has to follow a placeable whose ending cannot
# be known — an element name, an attribute name — it is written in the
# 은(는) / 이(가) / 을(를) form, which is what Korean writing does in the same
# situation.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = 두 끝점이 지정되면 { $attributes }은(는) 무시됩니다

line-segment-attributes-ignored-with-endpoint-and-midpoint = 끝점과 중점이 함께 지정되면 { $attributes }은(는) 무시됩니다

line-segment-midpoint-offset-without-midpoint = 중점이 없으면 midpointOffset은 효과가 없습니다

## `<line>`

line-points-undetermined-dimensions = 차원이 확정되지 않은 점을 지나는 직선입니다.

line-points-too-few-dimensions = 직선은 적어도 2차원인 점을 지나야 합니다.

line-points-depend-on-variables = 직선이 변수에 의존하는 점을 지납니다: { $variables }.

line-equation-invalid-format = 변수 { $variable1 }와(과) { $variable2 }(으)로 나타낸 직선 방정식의 형식이 잘못되었습니다.

## `<ray>`

ray-overprescribed-through = 반직선이 through, endpoint, direction으로 동시에 지정되었습니다. 지정된 through를 무시합니다.

ray-dimension-mismatch = 반직선의 numDimensions가 일치하지 않습니다.

## `<vector>`

vector-overprescribed-head = 벡터가 head, tail, displacement로 동시에 지정되었습니다. 지정된 head를 무시합니다.

vector-dimension-mismatch = 벡터의 numDimensions가 일치하지 않습니다.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>`에는 nearestPoint 상태 변수가 없으므로 끌어당길 수 없습니다.

constrain-to-without-nearest-point = `<{ $component }>`에는 nearestPoint 상태 변수가 없으므로 제약할 수 없습니다.

constrain-to-interior-without-nearest-point = `<{ $component }>`에는 nearestPoint 상태 변수가 없으므로 그 내부로 제약할 수 없습니다.

## `<choiceInput>`

choice-input-label-position-ignored = 인라인이 아닌 choiceInput에서는 labelPosition이 무시됩니다

## Ordering children by index

choice-input-indices-count-mismatch = indices의 개수가 choice 자식 요소의 개수와 맞지 않으므로 choiceInput에 지정된 indices를 무시합니다.

pretzel-indices-count-mismatch = indices의 개수가 problem 자식 요소의 개수와 맞지 않으므로 problem에 지정된 indices를 무시합니다.

shuffle-indices-count-mismatch = indices의 개수가 구성 요소의 개수와 맞지 않으므로 shuffle에 지정된 indices를 무시합니다.

indices-ignored-out-of-range = 범위를 벗어난 색인이 있으므로 { $component }에 지정된 indices를 무시합니다.

pretzel-indices-repeated = 중복된 색인이 있으므로 pretzel에 지정된 indices를 무시합니다.

pretzel-circuit-first-index = circuit 모드에서는 첫 색인이 1이어야 하므로 pretzel에 지정된 indices를 무시합니다.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>`이(가) 문자열 자식 요소와 함께 동작하려면 `type` 속성을 지정해야 합니다.

invalid-type-defaulting-to-math = { $component } 구성 요소의 자료형 { $type }이(가) 잘못되었습니다. math, text, number, boolean 중 하나여야 합니다. math를 사용합니다.

string-not-valid-component-to-arrange = 문자열 "{ $value }"은(는) { $component }의 대상으로 유효한 구성 요소가 아닙니다. 무시합니다.

## Types and variables

invalid-type-defaulting-to-number = 자료형 { $type }이(가) 잘못되었습니다. 자료형을 number로 설정합니다.

invalid-variable-value = 변수의 값이 잘못되었습니다: `{ $value }`

## Variants

variant-index-must-be-number = 변형 색인 { $index }은(는) 수여야 합니다

variant-index-must-be-integer = 변형 색인 { $index }은(는) 정수여야 합니다

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>`은(는) 절대 치수를 지원하지 않습니다. 너비를 상대값으로 바꿉니다.

side-by-side-absolute-margins = `<{ $component }>`은(는) 절대 치수를 지원하지 않습니다. 여백을 상대값으로 바꿉니다.

side-by-side-no-block-child = `<{ $component }>`이(가) 잘못되었습니다: 적어도 하나의 블록 자식 요소가 있어야 합니다.

## `<label>`

label-for-ignored-on-graphical = 그래픽 `<label>`의 `for` 속성은 무시됩니다.

label-for-must-resolve-to-one = `<label>`의 `for` 속성은 정확히 하나의 구성 요소로 확정되어야 합니다.

label-for-unresolved = `<label>`의 `for` 속성을 구성 요소로 확정할 수 없습니다.

label-for-answer-with-authored-inputs = `<label>`의 `for` 속성이 입력을 명시적으로 작성한 `<answer>`를 참조합니다. 그 입력을 직접 참조하세요.

label-for-answer-without-input = `<label>`의 `for` 속성이 레이블을 붙일 입력이 없는 `<answer>`를 참조합니다.

label-for-must-reference-input-or-answer = `<label>`의 `for` 속성은 입력이나 답을 참조해야 합니다.

## Accessibility

accessibility-short-description-or-decorative = 접근성을 위해 `<{ $component }>`에는 짧은 설명이 있거나 장식용으로 지정되어야 합니다.

accessibility-video-short-description = 접근성을 위해 `<video>`에는 짧은 설명이 있어야 합니다.

accessibility-input-short-description-or-label = 접근성을 위해 `<{ $component }>`에는 짧은 설명이나 레이블이 있어야 합니다.

accessibility-answer-input-short-description-or-label = 접근성을 위해 입력을 만드는 `<answer>`에는 짧은 설명이나 레이블이 있어야 합니다.

accessibility-short-description-contains-math = 짧은 설명에는 `<{ $component }>` 같은 수학 구성 요소를 넣지 않아야 합니다. 수식은 말로 풀어 쓰세요.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName }은(는) 절 제목 글자에 대한 대비가 부족합니다 (다크 모드) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1, 최소 { $threshold }:1 필요).
       *[other] { $colorName }은(는) 절 제목 글자에 대한 대비가 부족합니다 ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1, 최소 { $threshold }:1 필요).
    }

## `<circle>`

circle-through-points-non-numerical = 점이 수치를 갖지 않는 경우, { $count }개의 점을 지나는 `<circle>`은 아직 지원되지 않습니다.

circle-too-many-through-points = 3개를 넘는 점을 지나는 원은 계산할 수 없습니다.

circle-overprescribed-radius-center-points = 반지름, 중심, 지나는 점을 모두 지정한 원은 계산할 수 없습니다.

circle-center-with-multiple-points = 중심을 지정하고 1개를 넘는 점을 지나는 원은 계산할 수 없습니다.

circle-radius-too-small = 원을 계산할 수 없습니다: 두 점 사이의 거리가 { $distance }이므로 지정된 반지름 { $radius }은(는) 너무 작습니다.

circle-radius-with-many-points = 반지름을 지정하고 두 개를 넘는 점을 지나는 원은 만들 수 없습니다.

circle-invalid-center-or-through-points = 원의 중심이나 지나는 점이 잘못되었습니다.

circle-radius-center-with-multiple-points = 중심을 지정하고 1개를 넘는 점을 지나는 원의 반지름은 계산할 수 없습니다.

circle-change-radius-non-numerical = 지나는 점이 수치가 아닌 원의 반지름은 바꿀 수 없습니다

circle-radius-with-points-non-numerical = 수치가 없는 상태에서 반지름을 지정하고 한 개를 넘는 점을 지나는 원은 만들 수 없습니다.

circle-change-center-non-numerical = 수치가 아닌 점을 지나는 원의 중심 변경은 아직 지원되지 않습니다.

## `<function>`

function-domain-insufficient-dimensions = 함수 정의역의 차원이 부족합니다. 정의역에는 구간이 { $intervals }개 있지만 함수의 입력은 { $inputs }개입니다.

function-domain-invalid-format = 함수 정의역의 형식이 잘못되었습니다.

function-ignoring-non-numerical =
    { $type ->
        [maximum] 수치가 아닌 함수의 최댓값을 무시합니다.
        [minimum] 수치가 아닌 함수의 최솟값을 무시합니다.
        [extremum] 수치가 아닌 함수의 극값을 무시합니다.
        [point] 수치가 아닌 함수의 점을 무시합니다.
        [slope] 수치가 아닌 함수의 기울기를 무시합니다.
       *[other] 수치가 아닌 함수의 { $type }을(를) 무시합니다.
    }

function-ignoring-empty =
    { $type ->
        [maximum] 비어 있는 함수의 최댓값을 무시합니다.
        [minimum] 비어 있는 함수의 최솟값을 무시합니다.
        [extremum] 비어 있는 함수의 극값을 무시합니다.
        [point] 비어 있는 함수의 점을 무시합니다.
       *[other] 비어 있는 함수의 { $type }을(를) 무시합니다.
    }

function-points-too-close = 함수에 위치가 너무 가까운 두 점이 있습니다. 함수를 정의할 수 없습니다.

function-iterates-input-output-mismatch = 함수의 반복은 입력의 개수와 출력의 개수가 같을 때만 가능합니다. 이 함수의 입력은 { $inputs }개, 출력은 { $outputs }개입니다.

## `<sequence>`

sequence-invalid-length = 수열의 길이가 잘못되었습니다. 음이 아닌 정수여야 합니다.

sequence-invalid-step = 수열의 간격이 잘못되었습니다. 자료형이 { $type }인 수열에서는 수여야 합니다.

sequence-invalid-endpoint-number = 수 수열의 "{ $attribute }"이(가) 잘못되었습니다. 수여야 합니다.

sequence-invalid-endpoint-letters = 문자 수열의 "{ $attribute }"이(가) 잘못되었습니다. 문자 조합이어야 합니다.

sequence-invalid-endpoint = 수열의 "{ $attribute }"이(가) 잘못되었습니다.

select-from-sequence-coprime-not-numbers = 수를 선택하고 있지 않으므로 coprime을 무시합니다

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations가 지정되었으므로 coprime을 무시합니다

## Resolving a `target`

target-not-found = `<{ $source }>`의 target이 잘못되었습니다: 대상을 찾을 수 없습니다.

target-state-variable-not-found = `<{ $source }>`의 target이 잘못되었습니다: `<{ $component }>`에서 "{ $property }"(이)라는 상태 변수를 찾을 수 없습니다.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`의 변수는 독립 변수와 달라야 합니다.

ode-system-duplicate-variable-names = 종속 변수 이름이 중복되어 ODE 우변 함수를 정의할 수 없습니다.

ode-system-rhs-function-error = ODE 우변 함수를 정의할 수 없습니다. mathjs 함수를 만드는 중 오류가 발생했습니다.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count }개의 직선이 이루는 각은 정의할 수 없습니다

angle-invalid-through-point = `<angle>`의 through에 잘못된 점이 있습니다

parabola-vertex-too-many-points = 꼭짓점을 지정하고 1개를 넘는 점을 지나는 포물선은 아직 지원되지 않습니다.

parabola-too-many-points = 3개를 넘는 점을 지나는 포물선은 아직 지원되지 않습니다.

intersection-too-many-items = 두 개를 넘는 대상의 교집합은 아직 지원되지 않습니다

## Other math components

ionic-compound-not-two-ions = 이온이 두 개가 아닌 이온 화합물은 아직 지원되지 않습니다.

ionic-compound-needs-cation-and-anion = 이온 화합물은 양이온 하나와 음이온 하나인 경우에만 지원됩니다.

solve-equations-cannot-evaluate = 방정식을 계산할 수 없어 풀 수 없습니다: { $equation }

math-operators-operand-number-required = 수학 피연산자를 꺼낼 때는 operandNumber를 지정해야 합니다.

eigen-decomposition-failed = 행렬의 고윳값을 계산할 수 없습니다

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: 매개변수 { $parameters }이(가) 패턴에 나타나지 않으므로 항상 빈 값과 일치합니다.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }"을(를) 해석할 수 없습니다. none, medium, dense이거나 공백으로 구분된 두 양수여야 합니다(예: grid="1 0.5"). 격자를 그리지 않습니다.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure 렌더러는 xLabelPosition="left"를 지원하지 않습니다. 오른쪽 위치의 동작을 사용합니다.

prefigure-y-label-position-unsupported = `<graph>`: prefigure 렌더러는 yLabelPosition="bottom"을 지원하지 않습니다. 위쪽 위치의 동작을 사용합니다.

prefigure-invalid-axis-bounds = `<graph>`: prefigure 변환의 축 범위가 잘못되었습니다. 기본 bbox (-10,-10,10,10)을 사용합니다.

prefigure-invalid-width = `<graph>`: prefigure 변환의 너비가 잘못되었습니다. 기본 그림 너비 425를 사용합니다.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure 변환의 aspectRatio가 잘못되었습니다. 기본 종횡비 1을 사용합니다.

prefigure-grid-spacing-too-fine = `<graph>`: 축 범위에 비해 격자 간격이 너무 촘촘합니다. prefigure 렌더러에서는 격자를 생략합니다.

prefigure-annotations-not-rendered = `<graph>`: PreFigure 렌더러를 사용하지 않으면 주석이 그려지지 않습니다.

multiple-annotations-children = `<graph>` 안에서 여러 개의 `<annotations>` 자식 요소가 발견되었습니다. 마지막 하나를 제외하고 모두 무시합니다.

## Referring to other components

copy-unrecognized-component-type = 인식할 수 없는 구성 요소 자료형은 확장하거나 복사할 수 없습니다: { $type }.

copy-prop-not-found = 자료형이 { $component }인 구성 요소에서 속성 { $property }을(를) 찾을 수 없습니다

collect-no-source = collect의 원본을 찾을 수 없습니다.

collect-invalid-component-type = `<{ $component }>`은(는) 유효한 구성 요소 자료형이 아니므로 그 자료형의 구성 요소는 수집할 수 없습니다.

reference-index-unavailable = 색인 `{ $reference }`은(는) 참조할 수 없습니다

## `<callAction>`

component-action-unavailable = 구성 요소 `{ $reference }`에서 { $action }을(를) 호출할 수 없습니다

## `<dataFrame>`

data-frame-inconsistent-row-lengths = 데이터의 모양이 잘못되었습니다. 행의 길이가 일정하지 않습니다. componentIdx :{ $componentIdx }에서 발견

data-frame-duplicate-column-names = 데이터에 중복된 열 이름이 있습니다. componentIdx :{ $componentIdx }에서 발견

data-frame-missing-column-name = 데이터에 열 이름이 없습니다. componentIdx :{ $componentIdx }에서 발견

## `<answer>` and scoring

answer-award-depends-on-own-response = 이 답의 award가 answer 태그 자신이 제출한 답에 근거하고 있어 예기치 않은 동작을 일으킵니다.

answer-max-num-attempts-in-section-wide-check-work = 시도 횟수는 컨테이너가 제어하므로, `sectionWideCheckWork`가 있는 컨테이너 안의 `<answer>`에 `maxNumAttempts`를 설정해도 효과가 없습니다. 컨테이너 쪽에 `maxNumAttempts`를 설정하세요.

nested-section-wide-check-work-max-num-attempts = 시도 횟수는 바깥쪽 컨테이너가 제어하므로, `sectionWideCheckWork`가 있는 다른 컨테이너 안에 있는 `sectionWideCheckWork` 컨테이너에 `maxNumAttempts`를 설정해도 효과가 없습니다. 바깥쪽 컨테이너에 `maxNumAttempts`를 설정하세요.

answer-attributes-need-symbolic-equality = symbolicEquality가 설정되지 않으면 { $attributes } 속성은 효과가 없습니다.

answer-invalid-type = answer의 자료형이 잘못되었습니다: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = 구성 요소 `<{ $component }>`에는 이름이 없으므로 모듈 속성으로 쓸 수 없습니다

module-attribute-name-already-defined = `<module>` 구성 요소 자료형에는 이미 "{ $name }" 속성이 정의되어 있으므로, 구성 요소 `<{ $component } name="{ $name }">`을(를) 모듈의 속성으로 쓸 수 없습니다.

conditional-content-condition-ignored = case나 else 자식 요소가 있는 `<conditionalContent>` 구성 요소에서는 `condition` 속성이 무시됩니다.

slider-markers-type-mismatch = 표식의 자료형이 슬라이더의 자료형과 맞지 않습니다.

pretzel-problem-needs-statement-and-answer = pretzel이 잘못되었습니다: 각 `<problem>`은 `<statement>` 하나와 `<answer>` 하나를 포함해야 합니다.

pretzel-circuit-first-problem-distractor = pretzel이 잘못되었습니다: mode="circuit"에서는 첫 `<problem>`이 오답 선택지일 수 없습니다.

## Attribute values

attribute-invalid-values = 속성 `{ $attribute }`의 값 { $values }이(가) 잘못되었습니다. 무시합니다.

attribute-must-be-references = 속성 `{ $attribute }`의 값 `{ $value }`이(가) 잘못되었습니다. 이 속성은 `$`로 시작하는 참조로 구성되어야 합니다.

math-input-invalid-function-names = <mathInput>: { $attribute }에서 잘못된 함수 이름을 무시했습니다: { $names }. 각 이름의 표시 부분은 최소 2자(영문자 또는 하이픈)여야 하며, 뒤에 선택적으로 `|<mathspeak 대체 표현>` 접미사를 붙일 수 있습니다.

## Building components from the source

component-type-invalid = 구성 요소 자료형이 잘못되었습니다: `<{ $componentType }>`

attribute-repeated = 속성 { $attribute }은(는) 반복할 수 없습니다.

attribute-invalid-for-component = 속성 "{ $attribute }"은(는) 자료형이 `<{ $componentType }>`인 구성 요소에 유효하지 않습니다.

## Style definition contrast

style-definition-insufficient-contrast =
    스타일 정의 { $styleNumber }은(는) { $context ->
        [text-on-background] 배경색 대비 글자색
        [high-contrast] 캔버스 대비 고대비 색
        [line] 캔버스 대비 선 색
        [marker] 캔버스 대비 표식 색
       *[text-on-canvas] 캔버스 대비 글자색
    }의 대비가 부족합니다{ $mode ->
        [dark] { " (다크 모드)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1, 최소 { $threshold }:1 필요).

style-definition-dark-mode-text-background-contrast =
    스타일 정의 { $styleNumber }은(는) 라이트 모드에서는 대비가 충분한 색을 지정했지만, 그 값에서 유도된 다크 모드 색은 글자색과 배경색 사이의 대비가 부족합니다 ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1, 최소 { $threshold }:1 필요). { $suggestion ->
        [available] 다크 모드에서 충분한 대비를 확보하려면 라이트 모드의 대비를 높이거나(예: { $lightAttribute }="{ $lightColor }" 설정) 다크 모드 색을 덮어쓰세요(예: { $darkAttribute }="{ $darkColor }" 설정).
       *[none] 다크 모드에서 충분한 대비를 확보하려면 라이트 모드의 대비를 높이거나 textColorDarkMode 및/또는 backgroundColorDarkMode로 유도된 색을 덮어쓰세요.
    }

style-definition-dark-mode-text-canvas-contrast =
    스타일 정의 { $styleNumber }은(는) 라이트 모드에서는 대비가 충분한 글자색을 지정했지만, 그 값에서 유도된 다크 모드 글자색은 캔버스에 대한 대비가 부족합니다 ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1, 최소 { $threshold }:1 필요). { $suggestion ->
        [available] 다크 모드에서 충분한 대비를 확보하려면 라이트 모드의 대비를 높이거나(예: textColor="{ $lightColor }" 설정) 다크 모드 색을 덮어쓰세요(예: textColorDarkMode="{ $darkColor }" 설정).
       *[none] 다크 모드에서 충분한 대비를 확보하려면 라이트 모드의 대비를 높이거나 textColorDarkMode로 유도된 색을 덮어쓰세요.
    }

section-multiple-style-palettes = 한 절은 <stylePalette>를 하나만 선택할 수 있습니다. 마지막 것을 사용합니다.

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect가 음이 아닌 정수가 아니므로 { $component }의 고유 변형을 확정할 수 없습니다.

variant-num-to-select-not-constant-number = numToSelect가 상수가 아니므로 { $component }의 고유 변형을 확정할 수 없습니다.

variant-with-replacement-not-constant-boolean = withReplacement가 상수 불리언이 아니므로 { $component }의 고유 변형을 확정할 수 없습니다.

variant-select-weight-disables-unique = 어떤 선택지가 selectWeight나 selectForVariants를 지정하면 select의 고유 변형이 비활성화됩니다

variant-coprime-undetermined = coprime이 항상 거짓임을 확정할 수 없으므로 { $component }의 고유 변형을 확정할 수 없습니다.

variant-attribute-not-constant = { $attribute }이(가) 상수가 아니므로 { $component }의 고유 변형을 확정할 수 없습니다.

variant-attribute-not-number = { $attribute }이(가) 수가 아니므로 { $component }의 고유 변형을 확정할 수 없습니다.

variant-attribute-wrong-type-for-sequence =
    { $attribute }이(가) { $expected ->
        [letters-combination] 문자 조합
        [math-expression] 유효한 수식
        [integer] 정수
       *[number] 수
    }이(가) 아니므로 자료형이 { $type }인 { $component }의 고유 변형을 확정할 수 없습니다.

variant-length-not-integer = length가 정수가 아니므로 { $component }의 고유 변형을 확정할 수 없습니다.

variant-sort-not-implemented = sort가 있는 { $component }의 고유 변형은 아직 지원되지 않습니다

variant-exclude-combinations-not-implemented = excludeCombinations가 있는 { $component }의 고유 변형은 아직 지원되지 않습니다

variant-math-exclude-not-implemented = exclude가 있는 math 자료형 { $component }의 고유 변형은 아직 지원되지 않습니다

variant-non-constant-exclude-not-implemented = 상수가 아닌 exclude가 있는 { $component }의 고유 변형은 아직 지원되지 않습니다

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: 그래프 prefigure 렌더러에서 지원되지 않습니다. 이 하위 요소를 건너뛰었습니다.

prefigure-descendant-invalid-geometry = { $subject }: 기하 데이터가 유한하지 않거나 불완전합니다. 이 하위 요소를 건너뛰었습니다.

prefigure-curve-label-omitted = { $subject }: 변환된 곡선 요소는 레이블을 지원하지 않습니다. 레이블을 생략했습니다.

prefigure-curve-unsupported-definition-type = { $subject }: 곡선 함수 정의 자료형 '{ $definitionType }'은(는) 지원되지 않습니다. 이 하위 요소를 건너뛰었습니다.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves의 flipFunctions 속성은 지원되지 않습니다. 이 하위 요소를 건너뛰었습니다.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves는 formula 자료형의 자식 함수만 지원합니다. 이 하위 요소를 건너뛰었습니다.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] 직선족 레이블
       *[point] 점 레이블
    }에서는 labelPosition '{ $labelPosition }'이(가) 지원되지 않습니다. PreFigure의 기본 정렬을 사용합니다.

prefigure-fill-style-unsupported = { $subject }: 채우기 스타일 '{ $fillStyle }'은(는) PreFigure에서 지원되지 않습니다. 단색 채우기로 바꿉니다.

prefigure-line-style-unknown = { $subject }: 알 수 없는 선 스타일 '{ $lineStyle }'을(를) PreFigure 출력에서 생략했습니다.

prefigure-marker-style-mapped-to-diamond = { $subject }: 표식 스타일 '{ $markerStyle }'을(를) PreFigure 스타일 'diamond'에 대응시켰습니다.

prefigure-marker-style-unsupported = { $subject }: 표식 스타일 '{ $markerStyle }'은(는) PreFigure에서 지원되지 않습니다. 기본 스타일을 사용합니다.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref`가 잘못되었습니다. 대상을 확정할 수 없습니다. 이 주석을 생략했습니다.

annotation-ref-multiple-targets = `<annotation>`: `ref`가 여러 대상으로 확정되었습니다. 첫 대상을 사용합니다.

annotation-ref-outside-graph = `<annotation>`: `ref`가 잘못되었습니다. 대상이 이를 포함하는 그래프 바깥에 있습니다. 이 주석을 생략했습니다.

annotation-ref-unsupported-target = `<annotation>`: `ref`가 잘못되었습니다. prefigure 변환에서 대상이 지원되는 그래픽 객체가 아닙니다. 이 주석을 생략했습니다.

annotation-text-missing = `<annotation>`: `text`가 없거나 비어 있습니다. 빈 텍스트를 출력합니다.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] 순환 의존성이 발견되었습니다.
       *[other] `<{ $componentType }>` 구성 요소가 관련된 순환 의존성이 발견되었습니다.
    }

reference-no-referent = 참조 대상을 찾을 수 없습니다: `{ $reference }`

reference-multiple-referents = 참조 대상이 여러 개 발견되었습니다: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>`의 속성 { $attribute }의 형식이 잘못되었습니다.

children-invalid = `<{ $componentType }>`의 자식 요소가 잘못되었습니다: 잘못된 자식 요소가 발견되었습니다: { $children }

## Falling back to a default

attribute-value-invalid-using-default = 속성 `{ $attribute }`의 값 `{ $value }`이(가) 잘못되었습니다. 값 `{ $default }`을(를) 사용합니다

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML 버전 { $version }을(를) 찾을 수 없습니다.
       *[other] DoenetML 버전 { $version }을(를) 찾을 수 없습니다. 버전 { $fallback }(으)로 되돌립니다
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML이 잘못되었습니다: { $content }

parse-tag-missing-close-tag = DoenetML이 잘못되었습니다: 태그 `{ $tag }`에 닫는 태그가 없습니다. 자체 닫힘 태그나 `</{ $tagName }>` 태그가 필요합니다.

parse-tag-error = DoenetML이 잘못되었습니다: 태그 `<{ $tagName }>`에 오류가 있습니다

parse-attribute-missing-value = DoenetML이 잘못되었습니다: 속성 `{ $attribute }`에 값이 없는 것 같습니다.

parse-attribute-invalid = DoenetML이 잘못되었습니다: 속성 `{ $attribute }`이(가) 잘못되었습니다

parse-attribute-value-invalid = DoenetML이 잘못되었습니다: 속성 값 `{ $value }`이(가) 잘못되었습니다

parse-attribute-value-quote-mismatch = DoenetML이 잘못되었습니다: 속성 값 `{ $value }`이(가) 잘못되었습니다. 따옴표가 짝이 맞지 않습니다. `{ $quote }`이(가) 빠진 것 같습니다

parse-open-tag-name-missing = DoenetML이 잘못되었습니다: 태그 이름이 없는 태그가 발견되었습니다(예: `<`)

parse-tag-not-closed = DoenetML이 잘못되었습니다: 태그 `{ $tag }`이(가) 닫히지 않았습니다(`>`가 빠진 것 같습니다).

parse-self-closing-tag-name-missing = DoenetML이 잘못되었습니다: 태그 이름이 없는 태그가 발견되었습니다 `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML이 잘못되었습니다: 태그 `{ $tag }`이(가) 닫히지 않았습니다(`/>`가 빠진 것 같습니다).

parse-tag-invalid-attributes = DoenetML이 잘못되었습니다: 태그 `{ $tag }`이(가) 유효하지 않습니다. 속성이 잘못되었을 수 있습니다.

parse-close-tag-name-missing = DoenetML이 잘못되었습니다: 태그 이름이 없는 닫는 태그가 발견되었습니다(예: `</`)

parse-attribute-value-unquoted = 속성 값은 따옴표로 감싸야 합니다: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML이 잘못되었습니다: 닫는 태그 `{ $tag }`이(가) 발견되었지만 대응하는 여는 태그가 없습니다

parse-close-tag-mismatched = DoenetML이 잘못되었습니다: 닫는 태그가 맞지 않습니다. `</{ $expected }>`이(가) 필요하지만 `{ $found }`이(가) 발견되었습니다

parser-node-unconvertible = 노드 { $node }을(를) Dast 노드로 변환할 수 없습니다.

## Names

name-attribute-invalid =
    속성 name='{ $name }'이(가) 잘못되었습니다. { $reason ->
        [characters] 이름에는 영문자, 숫자, 밑줄, 하이픈만 쓸 수 있습니다.
       *[start] 이름은 영문자로 시작해야 합니다.
    }

component-name-invalid-start = 구성 요소 이름 "{ $name }"이(가) 잘못되었습니다. 이름은 영문자로 시작해야 합니다.

## `<answer>` sugar

answer-video-watched-missing-video = 자료형이 videoWatched인 answer에는 video 속성이 있어야 합니다

answer-video-watched-video-not-reference = 자료형이 videoWatched인 answer의 video 속성은 참조여야 합니다

answer-name-not-single-text = answer의 name 속성에는 텍스트 자식 요소가 정확히 하나 있어야 합니다

## Referencing another document

external-doenetml-recursion-limit = 재귀 단계가 너무 깊어 외부 DoenetML을 가져올 수 없습니다. 순환 참조가 있지 않은지 확인하세요.

external-doenetml-unavailable = { $attribute }="{ $uri }"에서 DoenetML을 가져올 수 없습니다

external-doenetml-type-mismatch = { $attribute }="{ $uri }"에서 가져온 DoenetML이 잘못되었습니다: 구성 요소 자료형 "{ $componentType }"과(와) 맞지 않았습니다

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] 속성 `{ $from }`은(는) 더 이상 권장되지 않습니다. 대신 `{ $to }`을(를) 쓰세요.
       *[other] [deprecation] `<{ $component }>`의 속성 `{ $from }`은(는) 더 이상 권장되지 않습니다. 대신 `{ $to }`을(를) 쓰세요.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }`도 지정되어 있으므로 속성 `{ $from }`은(는) 더 이상 권장되지 않으며 무시됩니다.
       *[other] [deprecation] `{ $to }`도 지정되어 있으므로 `<{ $component }>`의 속성 `{ $from }`은(는) 더 이상 권장되지 않으며 무시됩니다.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`의 속성 `{ $attribute }`은(는) 더 이상 권장되지 않으며 무시됩니다.


## Language coverage

pluralize-english-only = `<pluralize>`는 영어의 복수형만 만들 수 있으므로, { $locale }(으)로 쓴 문서에서는 텍스트가 그대로 남습니다. 복수형을 직접 쓰거나 `pluralForm` 속성으로 지정하세요.


## Checking against the schema

schema-element-unrecognized = 요소 `<{ $tag }>`은(는) 인식되는 Doenet 요소가 아닙니다.

schema-element-not-allowed-at-root = 요소 `<{ $tag }>`은(는) 문서의 최상위에 올 수 없습니다.

schema-element-not-allowed-inside = 요소 `<{ $tag }>`은(는) `<{ $parent }>` 안에 올 수 없습니다.

schema-attribute-unrecognized = 요소 `<{ $tag }>`에는 `{ $attribute }`(이)라는 속성이 없습니다.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] 요소 `<{ $tag }>`의 속성 `{ $attribute }`은(는) 각 항목이 다음 중 하나인 목록이어야 합니다: { $allowed }
       *[other] 요소 `<{ $tag }>`의 속성 `{ $attribute }`은(는) 다음 중 하나여야 합니다: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select의 변형 이름이 잘못되었습니다. 변형 이름 { $variantName }은(는) { $numOptions }개의 선택지에 나타나지만 선택할 개수는 { $numToSelect }입니다.

select-variant-name-without-options = select에 변형이 지정되었지만 가능한 변형 이름 { $variantName }에 대한 선택지가 없습니다.

select-variant-name-not-possible = select에 지정된 변형 이름 { $variantName }은(는) 가능한 변형 이름이 아닙니다.

select-too-few-options = 겨우 { $numOptions }개의 구성 요소에서 { $numToSelect }개를 선택할 수 없습니다.

select-from-sequence-too-few-values = 길이가 { $length }인 수열에서 { $numToSelect }개의 값을 선택할 수 없습니다.

select-from-sequence-indices-count-mismatch = select에 지정하는 색인의 개수는 선택할 개수와 같아야 합니다

select-from-sequence-indices-not-integers = select에 지정하는 색인은 모두 정수여야 합니다

select-from-sequence-index-excluded = selectfromsequence에 지정된 색인은 제외된 것이었습니다

select-from-sequence-indices-excluded-combination = selectfromsequence에 지정된 색인은 제외된 조합이었습니다

select-from-sequence-coprime-not-positive-integers = 양의 정수를 선택하고 있지 않으므로 서로소인 조합을 선택할 수 없습니다.

select-from-sequence-coprime-common-factor = 서로소인 수를 선택할 수 없습니다. 가능한 값이 모두 공약수를 가집니다. (지정된 "from" 또는 "to"는 "step"과 서로소여야 합니다.)

select-from-sequence-coprime-single-number = 1이 아닌 하나의 수에서 서로소인 조합을 선택할 수 없습니다.

select-from-sequence-excluded-too-many-combinations = selectFromSequence에서 조합의 70% 이상이 제외되었습니다

select-from-sequence-coprime-none-found = 서로소인 수를 선택하지 못했습니다. 가능한 값이 모두 공약수를 가집니다.

select-from-sequence-too-few-unique-values = 길이가 { $numPossibleValues }인 수열에서 서로 다른 값을 { $numToSelect }개 선택할 수 없습니다

select-prime-numbers-too-few-values = 길이가 { $numValues }인 소수 목록에서 { $numToSelect }개의 값을 선택할 수 없습니다

select-prime-numbers-values-count-mismatch = select에 지정하는 값의 개수는 선택할 개수와 같아야 합니다

select-prime-numbers-values-not-prime = select prime number에 지정하는 값은 모두 소수 목록에 있어야 합니다

select-prime-numbers-values-excluded-combination = selectPrimeNumbers에 지정된 값은 제외된 조합이었습니다

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers에서 조합의 70% 이상이 제외되었습니다

select-random-combination-fluke = 지극히 드문 우연으로 임의 값의 조합을 선택하지 못했습니다

select-random-value-fluke = 지극히 드문 우연으로 임의 값을 선택하지 못했습니다
