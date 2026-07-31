# Vietnamese diagnostics. Translated from `locales/en/diagnostics.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
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
# Vietnamese has a single plural category, so a countable message needs no
# selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } bị bỏ qua khi đã chỉ định hai đầu mút

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } bị bỏ qua khi đã chỉ định cả đầu mút lẫn trung điểm

line-segment-midpoint-offset-without-midpoint = midpointOffset không có tác dụng khi không có trung điểm

## `<line>`

line-points-undetermined-dimensions = Đường thẳng đi qua các điểm có số chiều không xác định.

line-points-too-few-dimensions = Đường thẳng phải đi qua các điểm có ít nhất hai chiều.

line-points-depend-on-variables = Đường thẳng đi qua các điểm phụ thuộc vào biến: { $variables }.

line-equation-invalid-format = Định dạng phương trình đường thẳng theo biến { $variable1 } và { $variable2 } không hợp lệ.

## `<ray>`

ray-overprescribed-through = Tia được xác định đồng thời bởi through, endpoint và direction. Bỏ qua through đã chỉ định.

ray-dimension-mismatch = numDimensions trong tia không khớp nhau.

## `<vector>`

vector-overprescribed-head = Vectơ được xác định đồng thời bởi head, tail và displacement. Bỏ qua head đã chỉ định.

vector-dimension-mismatch = numDimensions trong vectơ không khớp nhau.

## Attracting and constraining

attract-to-without-nearest-point = Không thể hút vào `<{ $component }>` vì nó không có biến trạng thái nearestPoint.

constrain-to-without-nearest-point = Không thể ràng buộc vào `<{ $component }>` vì nó không có biến trạng thái nearestPoint.

constrain-to-interior-without-nearest-point = Không thể ràng buộc vào phần trong của `<{ $component }>` vì nó không có biến trạng thái nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition bị bỏ qua với choiceInput không nội tuyến

## Ordering children by index

choice-input-indices-count-mismatch = Bỏ qua indices đã chỉ định cho choiceInput vì số lượng indices không khớp số phần tử con choice.

pretzel-indices-count-mismatch = Bỏ qua indices đã chỉ định cho problem vì số lượng indices không khớp số phần tử con problem.

shuffle-indices-count-mismatch = Bỏ qua indices đã chỉ định cho shuffle vì số lượng indices không khớp số thành phần.

indices-ignored-out-of-range = Bỏ qua indices đã chỉ định cho { $component } vì có chỉ số nằm ngoài phạm vi.

pretzel-indices-repeated = Bỏ qua indices đã chỉ định cho pretzel vì có chỉ số bị lặp.

pretzel-circuit-first-index = Bỏ qua indices đã chỉ định cho pretzel ở chế độ circuit vì chỉ số đầu tiên phải là 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Để `<{ $component }>` hoạt động với phần tử con dạng chuỗi, phải chỉ định thuộc tính `type`.

invalid-type-defaulting-to-math = Kiểu { $type } không hợp lệ cho thành phần { $component }. Phải là một trong math, text, number hoặc boolean. Dùng math thay thế.

string-not-valid-component-to-arrange = Chuỗi "{ $value }" không phải là thành phần hợp lệ để { $component }. Bỏ qua.

## Types and variables

invalid-type-defaulting-to-number = Kiểu { $type } không hợp lệ, đặt kiểu thành number.

invalid-variable-value = Giá trị của biến không hợp lệ: `{ $value }`

## Variants

variant-index-must-be-number = Chỉ số biến thể { $index } phải là một số

variant-index-must-be-integer = Chỉ số biến thể { $index } phải là số nguyên

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` chưa hỗ trợ kích thước tuyệt đối. Chuyển chiều rộng sang giá trị tương đối.

side-by-side-absolute-margins = `<{ $component }>` chưa hỗ trợ kích thước tuyệt đối. Chuyển lề sang giá trị tương đối.

side-by-side-no-block-child = `<{ $component }>` không hợp lệ: nó phải có ít nhất một phần tử con dạng khối.

## `<label>`

label-for-ignored-on-graphical = Thuộc tính `for` trên `<label>` dạng đồ họa bị bỏ qua.

label-for-must-resolve-to-one = Thuộc tính `for` trên `<label>` phải phân giải đúng về một thành phần.

label-for-unresolved = Không thể phân giải thuộc tính `for` trên `<label>` về một thành phần.

label-for-answer-with-authored-inputs = Thuộc tính `for` trên `<label>` tham chiếu tới một `<answer>` có đầu vào được viết tường minh; hãy tham chiếu trực tiếp tới đầu vào đó.

label-for-answer-without-input = Thuộc tính `for` trên `<label>` tham chiếu tới một `<answer>` không có đầu vào để gắn nhãn.

label-for-must-reference-input-or-answer = Thuộc tính `for` trên `<label>` phải tham chiếu tới một đầu vào hoặc một câu trả lời.

## Accessibility

accessibility-short-description-or-decorative = Vì khả năng tiếp cận, `<{ $component }>` phải có mô tả ngắn hoặc được đánh dấu là trang trí.

accessibility-video-short-description = Vì khả năng tiếp cận, `<video>` phải có mô tả ngắn.

accessibility-input-short-description-or-label = Vì khả năng tiếp cận, `<{ $component }>` phải có mô tả ngắn hoặc nhãn.

accessibility-answer-input-short-description-or-label = Vì khả năng tiếp cận, một `<answer>` tạo ra đầu vào phải có mô tả ngắn hoặc nhãn.

accessibility-short-description-contains-math = Mô tả ngắn không nên chứa các thành phần toán học như `<{ $component }>`. Hãy diễn đạt nội dung toán bằng lời.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } có độ tương phản không đủ cho chữ tiêu đề mục (chế độ tối) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; cần ít nhất { $threshold }:1).
       *[other] { $colorName } có độ tương phản không đủ cho chữ tiêu đề mục ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; cần ít nhất { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Chưa hỗ trợ `<circle>` đi qua { $count } điểm khi các điểm không có giá trị số.

circle-too-many-through-points = Không thể tính đường tròn đi qua hơn 3 điểm.

circle-overprescribed-radius-center-points = Không thể tính đường tròn khi đã chỉ định đồng thời bán kính, tâm và các điểm đi qua.

circle-center-with-multiple-points = Không thể tính đường tròn có tâm đã chỉ định và đi qua hơn 1 điểm.

circle-radius-too-small = Không thể tính đường tròn: khoảng cách giữa hai điểm là { $distance }, nên bán kính { $radius } đã chỉ định là quá nhỏ.

circle-radius-with-many-points = Không thể tạo đường tròn đi qua hơn hai điểm với bán kính đã chỉ định.

circle-invalid-center-or-through-points = Tâm hoặc các điểm đi qua của đường tròn không hợp lệ.

circle-radius-center-with-multiple-points = Không thể tính bán kính của đường tròn có tâm đã chỉ định và đi qua hơn 1 điểm.

circle-change-radius-non-numerical = Không thể thay đổi bán kính của đường tròn có các điểm đi qua không phải giá trị số

circle-radius-with-points-non-numerical = Không thể tạo đường tròn đi qua hơn một điểm với bán kính đã chỉ định khi không có giá trị số.

circle-change-center-non-numerical = Chưa hỗ trợ thay đổi tâm của đường tròn đi qua các điểm không phải giá trị số.

## `<function>`

function-domain-insufficient-dimensions = Số chiều của tập xác định không đủ cho hàm số. Tập xác định có { $intervals } khoảng nhưng hàm số có { $inputs } đầu vào.

function-domain-invalid-format = Định dạng tập xác định của hàm số không hợp lệ.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Bỏ qua giá trị lớn nhất không phải số của hàm số.
        [minimum] Bỏ qua giá trị nhỏ nhất không phải số của hàm số.
        [extremum] Bỏ qua cực trị không phải số của hàm số.
        [point] Bỏ qua điểm không phải số của hàm số.
        [slope] Bỏ qua hệ số góc không phải số của hàm số.
       *[other] Bỏ qua { $type } không phải số của hàm số.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Bỏ qua giá trị lớn nhất rỗng của hàm số.
        [minimum] Bỏ qua giá trị nhỏ nhất rỗng của hàm số.
        [extremum] Bỏ qua cực trị rỗng của hàm số.
        [point] Bỏ qua điểm rỗng của hàm số.
       *[other] Bỏ qua { $type } rỗng của hàm số.
    }

function-points-too-close = Hàm số có hai điểm nằm quá gần nhau. Không thể xác định hàm số.

function-iterates-input-output-mismatch = Chỉ có thể lặp hàm số khi số đầu vào bằng số đầu ra. Hàm số này có { $inputs } đầu vào và { $outputs } đầu ra.

## `<sequence>`

sequence-invalid-length = Độ dài của dãy không hợp lệ. Phải là số nguyên không âm.

sequence-invalid-step = Bước của dãy không hợp lệ. Phải là một số đối với dãy kiểu { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" của dãy số không hợp lệ. Phải là một số.

sequence-invalid-endpoint-letters = "{ $attribute }" của dãy chữ cái không hợp lệ. Phải là một tổ hợp chữ cái.

sequence-invalid-endpoint = "{ $attribute }" của dãy không hợp lệ.

select-from-sequence-coprime-not-numbers = coprime bị bỏ qua vì không chọn các số

select-from-sequence-coprime-with-exclude-combinations = coprime bị bỏ qua vì đã chỉ định excludeCombinations

## Resolving a `target`

target-not-found = target của `<{ $source }>` không hợp lệ: không tìm thấy mục tiêu.

target-state-variable-not-found = target của `<{ $source }>` không hợp lệ: không tìm thấy biến trạng thái tên "{ $property }" trên `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Các biến của `<odeSystem>` phải khác với biến độc lập.

ode-system-duplicate-variable-names = Không thể định nghĩa các hàm vế phải của ODE khi tên biến phụ thuộc bị trùng.

ode-system-rhs-function-error = Không thể định nghĩa hàm vế phải của ODE. Lỗi khi tạo hàm mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Không thể xác định góc giữa { $count } đường thẳng

angle-invalid-through-point = through của `<angle>` có điểm không hợp lệ

parabola-vertex-too-many-points = Chưa hỗ trợ parabol có đỉnh đã chỉ định và đi qua hơn 1 điểm.

parabola-too-many-points = Chưa hỗ trợ parabol đi qua hơn 3 điểm.

intersection-too-many-items = Chưa hỗ trợ giao của hơn hai đối tượng

## Other math components

ionic-compound-not-two-ions = Chưa hỗ trợ hợp chất ion với số ion khác hai.

ionic-compound-needs-cation-and-anion = Hợp chất ion chỉ được hỗ trợ với một cation và một anion.

solve-equations-cannot-evaluate = Không thể giải phương trình vì không tính được giá trị của nó: { $equation }

math-operators-operand-number-required = Phải chỉ định operandNumber khi trích xuất một toán hạng toán học.

eigen-decomposition-failed = Không thể tính giá trị riêng của ma trận

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: tham số { $parameters } không xuất hiện trong mẫu, nên sẽ luôn khớp với khoảng trống.

## `<graph>`

graph-grid-invalid = `<graph>`: không đọc được grid="{ $grid }". Nó phải là none, medium, dense, hoặc hai số dương cách nhau bởi dấu cách, ví dụ grid="1 0.5". Không vẽ lưới.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: bộ hiển thị prefigure không hỗ trợ xLabelPosition="left"; dùng hành vi của vị trí bên phải.

prefigure-y-label-position-unsupported = `<graph>`: bộ hiển thị prefigure không hỗ trợ yLabelPosition="bottom"; dùng hành vi của vị trí phía trên.

prefigure-invalid-axis-bounds = `<graph>`: giới hạn trục không hợp lệ khi chuyển đổi sang prefigure; dùng bbox mặc định (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: chiều rộng không hợp lệ khi chuyển đổi sang prefigure; dùng chiều rộng hình mặc định 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio không hợp lệ khi chuyển đổi sang prefigure; dùng tỉ lệ khung hình mặc định 1.

prefigure-grid-spacing-too-fine = `<graph>`: khoảng cách lưới quá mịn so với giới hạn trục; lưới bị bỏ qua trong bộ hiển thị prefigure.

prefigure-annotations-not-rendered = `<graph>`: chú giải sẽ không được vẽ khi không dùng bộ hiển thị PreFigure.

multiple-annotations-children = Tìm thấy nhiều phần tử con `<annotations>` trong `<graph>`; bỏ qua tất cả trừ phần tử cuối cùng.

## Referring to other components

copy-unrecognized-component-type = Không thể mở rộng hoặc sao chép kiểu thành phần không nhận dạng được: { $type }.

copy-prop-not-found = Không tìm thấy thuộc tính { $property } trên thành phần kiểu { $component }

collect-no-source = Không tìm thấy nguồn cho collect.

collect-invalid-component-type = Không thể thu thập các thành phần kiểu `<{ $component }>` vì đây không phải là kiểu thành phần hợp lệ.

reference-index-unavailable = Không thể tham chiếu chỉ số `{ $reference }`

## `<callAction>`

component-action-unavailable = Không thể gọi { $action } trên thành phần `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Dữ liệu có hình dạng không hợp lệ. Các hàng có độ dài không đồng nhất. Tìm thấy ở componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Dữ liệu có tên cột bị trùng. Tìm thấy ở componentIdx :{ $componentIdx }

data-frame-missing-column-name = Dữ liệu thiếu tên cột. Tìm thấy ở componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Một award của câu trả lời này dựa trên chính câu trả lời đã gửi của thẻ answer, điều này sẽ dẫn tới hành vi ngoài mong đợi.

answer-max-num-attempts-in-section-wide-check-work = Đặt `maxNumAttempts` trên một `<answer>` nằm trong vùng chứa có `sectionWideCheckWork` không có tác dụng, vì số lượt thử do vùng chứa kiểm soát. Hãy đặt `maxNumAttempts` trên vùng chứa.

nested-section-wide-check-work-max-num-attempts = Đặt `maxNumAttempts` trên một vùng chứa có `sectionWideCheckWork` mà lại nằm trong một vùng chứa khác cũng có `sectionWideCheckWork` thì không có tác dụng, vì số lượt thử do vùng chứa bên ngoài kiểm soát. Hãy đặt `maxNumAttempts` trên vùng chứa bên ngoài.

answer-attributes-need-symbolic-equality = Thuộc tính { $attributes } sẽ không có tác dụng nếu không đặt symbolicEquality.

answer-invalid-type = Kiểu của answer không hợp lệ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Vì thành phần `<{ $component }>` không có tên, nó không thể dùng làm thuộc tính của mô-đun

module-attribute-name-already-defined = Thành phần `<{ $component } name="{ $name }">` không thể dùng làm thuộc tính của một mô-đun vì kiểu thành phần `<module>` đã định nghĩa thuộc tính "{ $name }".

conditional-content-condition-ignored = Thuộc tính `condition` bị bỏ qua trên thành phần `<conditionalContent>` có phần tử con case hoặc else.

slider-markers-type-mismatch = Kiểu của các điểm đánh dấu không khớp kiểu của thanh trượt.

pretzel-problem-needs-statement-and-answer = pretzel không hợp lệ: mỗi `<problem>` phải chứa một `<statement>` và một `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel không hợp lệ: ở mode="circuit", `<problem>` đầu tiên không thể là phương án nhiễu.

## Attribute values

attribute-invalid-values = Giá trị { $values } của thuộc tính `{ $attribute }` không hợp lệ; bỏ qua.

attribute-must-be-references = Giá trị `{ $value }` của thuộc tính `{ $attribute }` không hợp lệ. Thuộc tính phải gồm các tham chiếu bắt đầu bằng `$`.

math-input-invalid-function-names = <mathInput>: đã bỏ qua tên hàm không hợp lệ trong { $attribute }: { $names }. Phần hiển thị của mỗi tên phải có ít nhất 2 ký tự (chữ cái hoặc dấu gạch nối); có thể theo sau bởi hậu tố tùy chọn `|<mathspeak thay thế>`.

## Building components from the source

component-type-invalid = Kiểu thành phần không hợp lệ: `<{ $componentType }>`

attribute-repeated = Không thể lặp lại thuộc tính { $attribute }.

attribute-invalid-for-component = Thuộc tính "{ $attribute }" không hợp lệ với thành phần kiểu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Định nghĩa kiểu { $styleNumber } có độ tương phản không đủ cho { $context ->
        [text-on-background] màu chữ so với màu nền
        [high-contrast] màu tương phản cao so với khung vẽ
        [line] màu đường so với khung vẽ
        [marker] màu điểm đánh dấu so với khung vẽ
       *[text-on-canvas] màu chữ so với khung vẽ
    }{ $mode ->
        [dark] { " (chế độ tối)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; cần ít nhất { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Mặc dù định nghĩa kiểu { $styleNumber } đã chỉ định các màu có độ tương phản đủ cho chế độ sáng, các màu chế độ tối suy ra từ những giá trị này lại có độ tương phản không đủ giữa màu chữ và màu nền ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; cần ít nhất { $threshold }:1). { $suggestion ->
        [available] Để bảo đảm độ tương phản đủ ở chế độ tối, hãy tăng độ tương phản của chế độ sáng (ví dụ đặt { $lightAttribute }="{ $lightColor }") hoặc ghi đè màu của chế độ tối (ví dụ đặt { $darkAttribute }="{ $darkColor }").
       *[none] Để bảo đảm độ tương phản đủ ở chế độ tối, hãy tăng độ tương phản của chế độ sáng hoặc ghi đè các màu suy ra bằng textColorDarkMode và/hoặc backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Mặc dù định nghĩa kiểu { $styleNumber } đã chỉ định màu chữ có độ tương phản đủ cho chế độ sáng, màu chữ chế độ tối suy ra từ giá trị này lại có độ tương phản không đủ so với khung vẽ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; cần ít nhất { $threshold }:1). { $suggestion ->
        [available] Để bảo đảm độ tương phản đủ ở chế độ tối, hãy tăng độ tương phản của chế độ sáng (ví dụ đặt textColor="{ $lightColor }") hoặc ghi đè màu của chế độ tối (ví dụ đặt textColorDarkMode="{ $darkColor }").
       *[none] Để bảo đảm độ tương phản đủ ở chế độ tối, hãy tăng độ tương phản của chế độ sáng hoặc ghi đè màu suy ra bằng textColorDarkMode.
    }

section-multiple-style-palettes = Một mục chỉ có thể chọn một <stylePalette>; dùng cái cuối cùng.

## Unique variants

variant-num-to-select-not-non-negative-integer = không xác định được các biến thể duy nhất của { $component } vì numToSelect không phải số nguyên không âm.

variant-num-to-select-not-constant-number = không xác định được các biến thể duy nhất của { $component } vì numToSelect không phải hằng số.

variant-with-replacement-not-constant-boolean = không xác định được các biến thể duy nhất của { $component } vì withReplacement không phải giá trị boolean hằng.

variant-select-weight-disables-unique = các biến thể duy nhất của select bị tắt nếu một lựa chọn có chỉ định selectWeight hoặc selectForVariants

variant-coprime-undetermined = không xác định được các biến thể duy nhất của { $component } vì không xác định được coprime luôn sai.

variant-attribute-not-constant = không xác định được các biến thể duy nhất của { $component } vì { $attribute } không phải hằng số.

variant-attribute-not-number = không xác định được các biến thể duy nhất của { $component } vì { $attribute } không phải một số.

variant-attribute-wrong-type-for-sequence =
    không xác định được các biến thể duy nhất của { $component } kiểu { $type } vì { $attribute } không phải { $expected ->
        [letters-combination] một tổ hợp chữ cái
        [math-expression] một biểu thức toán hợp lệ
        [integer] một số nguyên
       *[number] một số
    }.

variant-length-not-integer = không xác định được các biến thể duy nhất của { $component } vì length không phải số nguyên.

variant-sort-not-implemented = chưa hỗ trợ các biến thể duy nhất của { $component } có sort

variant-exclude-combinations-not-implemented = chưa hỗ trợ các biến thể duy nhất của { $component } có excludeCombinations

variant-math-exclude-not-implemented = chưa hỗ trợ các biến thể duy nhất của { $component } kiểu math có exclude

variant-non-constant-exclude-not-implemented = chưa hỗ trợ các biến thể duy nhất của { $component } có exclude không phải hằng

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: không được bộ hiển thị prefigure của đồ thị hỗ trợ; đã bỏ qua phần tử con này.

prefigure-descendant-invalid-geometry = { $subject }: dữ liệu hình học không hữu hạn hoặc không đầy đủ; đã bỏ qua phần tử con này.

prefigure-curve-label-omitted = { $subject }: phần tử đường cong sau chuyển đổi không hỗ trợ nhãn; đã bỏ nhãn.

prefigure-curve-unsupported-definition-type = { $subject }: không hỗ trợ kiểu định nghĩa hàm đường cong '{ $definitionType }'; đã bỏ qua phần tử con này.

prefigure-region-flip-functions-unsupported = { $subject }: không hỗ trợ thuộc tính flipFunctions trên regionBetweenCurves; đã bỏ qua phần tử con này.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves chỉ hỗ trợ hàm con kiểu công thức; đã bỏ qua phần tử con này.

prefigure-label-position-unsupported =
    { $subject }: không hỗ trợ labelPosition '{ $labelPosition }' cho { $labelKind ->
        [line-family] nhãn của họ đường thẳng
       *[point] nhãn của điểm
    }; dùng căn chỉnh mặc định của PreFigure.

prefigure-fill-style-unsupported = { $subject }: PreFigure không hỗ trợ kiểu tô '{ $fillStyle }'; chuyển sang tô đặc.

prefigure-line-style-unknown = { $subject }: kiểu nét không xác định '{ $lineStyle }' đã bị bỏ khỏi kết quả PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: kiểu điểm đánh dấu '{ $markerStyle }' được ánh xạ sang kiểu 'diamond' của PreFigure.

prefigure-marker-style-unsupported = { $subject }: PreFigure không hỗ trợ kiểu điểm đánh dấu '{ $markerStyle }'; dùng kiểu mặc định.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` không hợp lệ; không phân giải được mục tiêu. Đã bỏ chú giải này.

annotation-ref-multiple-targets = `<annotation>`: `ref` phân giải ra nhiều mục tiêu; dùng mục tiêu đầu tiên.

annotation-ref-outside-graph = `<annotation>`: `ref` không hợp lệ; mục tiêu nằm ngoài đồ thị chứa nó. Đã bỏ chú giải này.

annotation-ref-unsupported-target = `<annotation>`: `ref` không hợp lệ; mục tiêu không phải đối tượng đồ họa được hỗ trợ trong chuyển đổi prefigure. Đã bỏ chú giải này.

annotation-text-missing = `<annotation>`: `text` thiếu hoặc rỗng; xuất ra văn bản rỗng.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Phát hiện phụ thuộc vòng.
       *[other] Phát hiện phụ thuộc vòng liên quan đến thành phần `<{ $componentType }>`.
    }

reference-no-referent = Không tìm thấy đối tượng cho tham chiếu: `{ $reference }`

reference-multiple-referents = Tìm thấy nhiều đối tượng cho tham chiếu: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Định dạng thuộc tính { $attribute } của `<{ $componentType }>` không hợp lệ.

children-invalid = Phần tử con của `<{ $componentType }>` không hợp lệ: Tìm thấy phần tử con không hợp lệ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Giá trị `{ $value }` của thuộc tính `{ $attribute }` không hợp lệ, dùng giá trị `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Không tìm thấy DoenetML phiên bản { $version }.
       *[other] Không tìm thấy DoenetML phiên bản { $version }. Quay về phiên bản { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML không hợp lệ: { $content }

parse-tag-missing-close-tag = DoenetML không hợp lệ: Thẻ `{ $tag }` không có thẻ đóng. Cần một thẻ tự đóng hoặc một thẻ `</{ $tagName }>`.

parse-tag-error = DoenetML không hợp lệ: Lỗi trong thẻ `<{ $tagName }>`

parse-attribute-missing-value = DoenetML không hợp lệ: Thuộc tính `{ $attribute }` không hợp lệ, có vẻ thiếu giá trị.

parse-attribute-invalid = DoenetML không hợp lệ: Thuộc tính `{ $attribute }` không hợp lệ

parse-attribute-value-invalid = DoenetML không hợp lệ: Giá trị thuộc tính `{ $value }` không hợp lệ

parse-attribute-value-quote-mismatch = DoenetML không hợp lệ: Giá trị thuộc tính `{ $value }` không hợp lệ. Dấu nháy không khớp nhau. Có vẻ bạn thiếu một `{ $quote }`

parse-open-tag-name-missing = DoenetML không hợp lệ: Tìm thấy một thẻ không có tên thẻ, ví dụ `<`

parse-tag-not-closed = DoenetML không hợp lệ: Thẻ `{ $tag }` chưa được đóng (có vẻ thiếu `>`).

parse-self-closing-tag-name-missing = DoenetML không hợp lệ: Tìm thấy một thẻ không có tên thẻ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML không hợp lệ: Thẻ `{ $tag }` chưa được đóng (có vẻ thiếu `/>`).

parse-tag-invalid-attributes = DoenetML không hợp lệ: Thẻ `{ $tag }` không hợp lệ. Có thể nó có thuộc tính sai.

parse-close-tag-name-missing = DoenetML không hợp lệ: Tìm thấy một thẻ đóng không có tên thẻ, ví dụ `</`

parse-attribute-value-unquoted = Giá trị thuộc tính phải được đặt trong dấu nháy: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML không hợp lệ: Tìm thấy thẻ đóng `{ $tag }` nhưng không có thẻ mở tương ứng

parse-close-tag-mismatched = DoenetML không hợp lệ: Thẻ đóng không khớp. Cần `</{ $expected }>`. Tìm thấy `{ $found }`

parser-node-unconvertible = Không thể chuyển nút { $node } thành nút Dast.

## Names

name-attribute-invalid =
    Thuộc tính name='{ $name }' không hợp lệ. { $reason ->
        [characters] Tên chỉ có thể chứa chữ cái, chữ số, dấu gạch dưới hoặc dấu gạch nối.
       *[start] Tên phải bắt đầu bằng một chữ cái.
    }

component-name-invalid-start = Tên thành phần "{ $name }" không hợp lệ. Tên phải bắt đầu bằng một chữ cái.

## `<answer>` sugar

answer-video-watched-missing-video = answer kiểu videoWatched phải có thuộc tính video

answer-video-watched-video-not-reference = answer kiểu videoWatched phải có thuộc tính video là một tham chiếu

answer-name-not-single-text = Thuộc tính name của answer phải có đúng một phần tử con dạng văn bản

## Referencing another document

external-doenetml-recursion-limit = Không thể lấy DoenetML bên ngoài vì đệ quy quá nhiều tầng. Có tham chiếu vòng không?

external-doenetml-unavailable = Không thể lấy DoenetML từ { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML lấy từ { $attribute }="{ $uri }" không hợp lệ: nó không khớp kiểu thành phần "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Thuộc tính `{ $from }` đã lỗi thời; hãy dùng `{ $to }`.
       *[other] [deprecation] Thuộc tính `{ $from }` trên `<{ $component }>` đã lỗi thời; hãy dùng `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Thuộc tính `{ $from }` đã lỗi thời và bị bỏ qua vì `{ $to }` cũng được chỉ định.
       *[other] [deprecation] Thuộc tính `{ $from }` trên `<{ $component }>` đã lỗi thời và bị bỏ qua vì `{ $to }` cũng được chỉ định.
    }

deprecated-attribute-ignored = [deprecation] Thuộc tính `{ $attribute }` trên `<{ $component }>` đã lỗi thời và bị bỏ qua.


## Language coverage

pluralize-english-only = `<pluralize>` chỉ tạo được số nhiều tiếng Anh, nên văn bản của nó giữ nguyên trong tài liệu viết bằng { $locale }. Hãy viết thẳng dạng số nhiều, hoặc đặt nó bằng thuộc tính `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Phần tử `<{ $tag }>` không phải là phần tử Doenet được nhận dạng.

schema-element-not-allowed-at-root = Phần tử `<{ $tag }>` không được phép ở gốc của tài liệu.

schema-element-not-allowed-inside = Phần tử `<{ $tag }>` không được phép nằm trong `<{ $parent }>`.

schema-attribute-unrecognized = Phần tử `<{ $tag }>` không có thuộc tính nào tên `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Thuộc tính `{ $attribute }` của phần tử `<{ $tag }>` phải là một danh sách mà mỗi mục là một trong: { $allowed }
       *[other] Thuộc tính `{ $attribute }` của phần tử `<{ $tag }>` phải là một trong: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Tên biến thể của select không hợp lệ. Tên biến thể { $variantName } xuất hiện trong { $numOptions } lựa chọn nhưng số lượng cần chọn là { $numToSelect }.

select-variant-name-without-options = Đã chỉ định biến thể cho select nhưng không có lựa chọn nào cho tên biến thể khả dĩ: { $variantName }.

select-variant-name-not-possible = Tên biến thể { $variantName } đã chỉ định cho select không phải là tên biến thể khả dĩ.

select-too-few-options = Không thể chọn { $numToSelect } thành phần từ chỉ { $numOptions }.

select-from-sequence-too-few-values = Không thể chọn { $numToSelect } giá trị từ một dãy có độ dài { $length }.

select-from-sequence-indices-count-mismatch = Số lượng chỉ số chỉ định cho select phải khớp với số lượng cần chọn

select-from-sequence-indices-not-integers = Mọi chỉ số chỉ định cho select đều phải là số nguyên

select-from-sequence-index-excluded = Chỉ số đã chỉ định cho selectfromsequence nằm trong phần bị loại trừ

select-from-sequence-indices-excluded-combination = Các chỉ số đã chỉ định cho selectfromsequence tạo thành một tổ hợp bị loại trừ

select-from-sequence-coprime-not-positive-integers = Không thể chọn các tổ hợp nguyên tố cùng nhau vì không chọn các số nguyên dương.

select-from-sequence-coprime-common-factor = Không thể chọn các số nguyên tố cùng nhau. Mọi giá trị khả dĩ đều có ước chung. (Giá trị "from" hoặc "to" đã chỉ định phải nguyên tố cùng nhau với "step".)

select-from-sequence-coprime-single-number = Không thể chọn tổ hợp nguyên tố cùng nhau từ một số duy nhất khác 1.

select-from-sequence-excluded-too-many-combinations = Đã loại trừ hơn 70% số tổ hợp trong selectFromSequence

select-from-sequence-coprime-none-found = Không chọn được các số nguyên tố cùng nhau. Mọi giá trị khả dĩ đều có ước chung.

select-from-sequence-too-few-unique-values = Không thể chọn { $numToSelect } giá trị khác nhau từ dãy có độ dài { $numPossibleValues }

select-prime-numbers-too-few-values = Không thể chọn { $numToSelect } giá trị từ danh sách số nguyên tố có độ dài { $numValues }

select-prime-numbers-values-count-mismatch = Số lượng giá trị chỉ định cho select phải khớp với số lượng cần chọn

select-prime-numbers-values-not-prime = Mọi giá trị chỉ định cho select prime number đều phải nằm trong danh sách số nguyên tố

select-prime-numbers-values-excluded-combination = Các giá trị đã chỉ định cho selectPrimeNumbers tạo thành một tổ hợp bị loại trừ

select-prime-numbers-excluded-too-many-combinations = Đã loại trừ hơn 70% số tổ hợp trong selectPrimeNumbers

select-random-combination-fluke = Do một trùng hợp cực kỳ hiếm, không chọn được tổ hợp giá trị ngẫu nhiên

select-random-value-fluke = Do một trùng hợp cực kỳ hiếm, không chọn được giá trị ngẫu nhiên
