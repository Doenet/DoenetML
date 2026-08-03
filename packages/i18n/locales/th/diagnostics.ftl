# Thai diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Thai has a single plural category, so a countable message needs no selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } จะถูกละเว้นเมื่อระบุจุดปลายทั้งสอง

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } จะถูกละเว้นเมื่อระบุทั้งจุดปลายและจุดกึ่งกลาง

line-segment-midpoint-offset-without-midpoint = midpointOffset ไม่มีผลเมื่อไม่มีจุดกึ่งกลาง

## `<line>`

line-points-undetermined-dimensions = เส้นตรงผ่านจุดที่มีมิติไม่ชัดเจน

line-points-too-few-dimensions = เส้นตรงต้องผ่านจุดที่มีอย่างน้อยสองมิติ

line-points-depend-on-variables = เส้นตรงผ่านจุดที่ขึ้นกับตัวแปร: { $variables }

line-equation-invalid-format = รูปแบบสมการของเส้นตรงในตัวแปร { $variable1 } และ { $variable2 } ไม่ถูกต้อง

## `<ray>`

ray-overprescribed-through = รังสีถูกกำหนดด้วย through, endpoint และ direction พร้อมกัน จะละเว้น through ที่ระบุ

ray-dimension-mismatch = numDimensions ในรังสีไม่ตรงกัน

## `<vector>`

vector-overprescribed-head = เวกเตอร์ถูกกำหนดด้วย head, tail และ displacement พร้อมกัน จะละเว้น head ที่ระบุ

vector-dimension-mismatch = numDimensions ในเวกเตอร์ไม่ตรงกัน

## Attracting and constraining

attract-to-without-nearest-point = ดึงดูดเข้าหา `<{ $component }>` ไม่ได้ เพราะไม่มีตัวแปรสถานะ nearestPoint

constrain-to-without-nearest-point = จำกัดให้อยู่บน `<{ $component }>` ไม่ได้ เพราะไม่มีตัวแปรสถานะ nearestPoint

constrain-to-interior-without-nearest-point = จำกัดให้อยู่ภายใน `<{ $component }>` ไม่ได้ เพราะไม่มีตัวแปรสถานะ nearestPoint

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition จะถูกละเว้นสำหรับ choiceInput ที่ไม่ใช่แบบอินไลน์

## Ordering children by index

choice-input-indices-count-mismatch = ละเว้นดัชนีที่ระบุให้ choiceInput เพราะจำนวนดัชนีไม่ตรงกับจำนวนลูกที่เป็น choice

pretzel-indices-count-mismatch = ละเว้นดัชนีที่ระบุให้ problem เพราะจำนวนดัชนีไม่ตรงกับจำนวนลูกที่เป็น problem

shuffle-indices-count-mismatch = ละเว้นดัชนีที่ระบุให้ shuffle เพราะจำนวนดัชนีไม่ตรงกับจำนวนองค์ประกอบ

indices-ignored-out-of-range = ละเว้นดัชนีที่ระบุให้ { $component } เพราะบางดัชนีอยู่นอกช่วง

pretzel-indices-repeated = ละเว้นดัชนีที่ระบุให้ pretzel เพราะมีดัชนีซ้ำกัน

pretzel-circuit-first-index = ละเว้นดัชนีที่ระบุให้ pretzel ในโหมด circuit เพราะดัชนีแรกต้องเป็น 1

## `<shuffle>` and `<sort>`

string-children-need-type = เพื่อให้ `<{ $component }>` ทำงานกับลูกที่เป็นสตริง ต้องระบุแอตทริบิวต์ `type`

invalid-type-defaulting-to-math = { $type } เป็น type ที่ไม่ถูกต้องสำหรับองค์ประกอบ { $component } ต้องเป็นอย่างใดอย่างหนึ่งใน math, text, number หรือ boolean จะตั้งเป็น math

string-not-valid-component-to-arrange = สตริง "{ $value }" ไม่ใช่องค์ประกอบที่ { $component } ได้ จะละเว้น

## Types and variables

invalid-type-defaulting-to-number = { $type } เป็น type ที่ไม่ถูกต้อง จะตั้ง type เป็น number

invalid-variable-value = ค่าของตัวแปรไม่ถูกต้อง: `{ $value }`

## Variants

variant-index-must-be-number = ดัชนีรูปแบบ { $index } ต้องเป็นจำนวน

variant-index-must-be-integer = ดัชนีรูปแบบ { $index } ต้องเป็นจำนวนเต็ม

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ยังไม่รองรับการวัดแบบสัมบูรณ์ จะตั้งความกว้างเป็นแบบสัมพัทธ์

side-by-side-absolute-margins = `<{ $component }>` ยังไม่รองรับการวัดแบบสัมบูรณ์ จะตั้งระยะขอบเป็นแบบสัมพัทธ์

side-by-side-no-block-child = `<{ $component }>` ไม่ถูกต้อง: ต้องมีลูกแบบบล็อกอย่างน้อยหนึ่งรายการ

## `<label>`

label-for-ignored-on-graphical = แอตทริบิวต์ `for` บน `<label>` แบบกราฟิกจะถูกละเว้น

label-for-must-resolve-to-one = แอตทริบิวต์ `for` บน `<label>` ต้องระบุได้เป็นองค์ประกอบเดียวเท่านั้น

label-for-unresolved = ระบุแอตทริบิวต์ `for` บน `<label>` เป็นองค์ประกอบใดไม่ได้

label-for-answer-with-authored-inputs = แอตทริบิวต์ `for` บน `<label>` อ้างถึง `<answer>` ที่เขียนอินพุตไว้อย่างชัดเจน ให้อ้างถึงอินพุตโดยตรง

label-for-answer-without-input = แอตทริบิวต์ `for` บน `<label>` อ้างถึง `<answer>` ที่ไม่มีอินพุตให้ตั้งชื่อ

label-for-must-reference-input-or-answer = แอตทริบิวต์ `for` บน `<label>` ต้องอ้างถึงอินพุตหรือคำตอบ

## Accessibility

accessibility-short-description-or-decorative = เพื่อการเข้าถึง `<{ $component }>` ต้องมีคำอธิบายสั้นหรือระบุว่าเป็นการตกแต่ง

accessibility-video-short-description = เพื่อการเข้าถึง `<video>` ต้องมีคำอธิบายสั้น

accessibility-input-short-description-or-label = เพื่อการเข้าถึง `<{ $component }>` ต้องมีคำอธิบายสั้นหรือชื่อกำกับ

accessibility-answer-input-short-description-or-label = เพื่อการเข้าถึง `<answer>` ที่สร้างอินพุตต้องมีคำอธิบายสั้นหรือชื่อกำกับ

accessibility-short-description-contains-math = คำอธิบายสั้นไม่ควรมีองค์ประกอบคณิตศาสตร์อย่าง `<{ $component }>` ให้เขียนคณิตศาสตร์ด้วยคำพูด

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } มีความต่างสีไม่พอสำหรับข้อความหัวข้อ (โหมดมืด) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ต้องอย่างน้อย { $threshold }:1)
       *[other] { $colorName } มีความต่างสีไม่พอสำหรับข้อความหัวข้อ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ต้องอย่างน้อย { $threshold }:1)
    }

## `<circle>`

circle-through-points-non-numerical = ยังไม่ได้ทำ `<circle>` ที่ผ่าน { $count } จุด ในกรณีที่จุดไม่มีค่าเชิงตัวเลข

circle-too-many-through-points = คำนวณวงกลมที่ผ่านมากกว่า 3 จุดไม่ได้

circle-overprescribed-radius-center-points = คำนวณวงกลมที่ระบุทั้งรัศมี จุดศูนย์กลาง และจุดที่ผ่านไม่ได้

circle-center-with-multiple-points = คำนวณวงกลมที่ระบุจุดศูนย์กลางและผ่านมากกว่า 1 จุดไม่ได้

circle-radius-too-small = คำนวณวงกลมไม่ได้: เมื่อระยะระหว่างสองจุดเท่ากับ { $distance } รัศมี { $radius } ที่ระบุจึงเล็กเกินไป

circle-radius-with-many-points = สร้างวงกลมที่ผ่านมากกว่าสองจุดโดยระบุรัศมีไม่ได้

circle-invalid-center-or-through-points = จุดศูนย์กลางหรือจุดที่วงกลมผ่านไม่ถูกต้อง

circle-radius-center-with-multiple-points = คำนวณรัศมีของวงกลมที่ระบุจุดศูนย์กลางและผ่านมากกว่า 1 จุดไม่ได้

circle-change-radius-non-numerical = เปลี่ยนรัศมีของวงกลมที่ผ่านจุดซึ่งไม่มีค่าเชิงตัวเลขไม่ได้

circle-radius-with-points-non-numerical = เมื่อไม่มีค่าเชิงตัวเลข จะสร้างวงกลมที่ผ่านมากกว่าหนึ่งจุดโดยระบุรัศมีไม่ได้

circle-change-center-non-numerical = ยังไม่ได้ทำการเปลี่ยนจุดศูนย์กลางของวงกลมที่ผ่านจุดซึ่งไม่มีค่าเชิงตัวเลข

## `<function>`

function-domain-insufficient-dimensions = มิติของโดเมนของฟังก์ชันไม่พอ โดเมนมี { $intervals } ช่วง แต่ฟังก์ชันมี { $inputs } อินพุต

function-domain-invalid-format = รูปแบบโดเมนของฟังก์ชันไม่ถูกต้อง

function-ignoring-non-numerical =
    { $type ->
        [maximum] ละเว้นค่าสูงสุดของฟังก์ชันที่ไม่เป็นตัวเลข
        [minimum] ละเว้นค่าต่ำสุดของฟังก์ชันที่ไม่เป็นตัวเลข
        [extremum] ละเว้นค่าสุดขีดของฟังก์ชันที่ไม่เป็นตัวเลข
        [point] ละเว้นจุดของฟังก์ชันที่ไม่เป็นตัวเลข
        [slope] ละเว้นความชันของฟังก์ชันที่ไม่เป็นตัวเลข
       *[other] ละเว้น { $type } ของฟังก์ชันที่ไม่เป็นตัวเลข
    }

function-ignoring-empty =
    { $type ->
        [maximum] ละเว้นค่าสูงสุดของฟังก์ชันที่ว่างเปล่า
        [minimum] ละเว้นค่าต่ำสุดของฟังก์ชันที่ว่างเปล่า
        [extremum] ละเว้นค่าสุดขีดของฟังก์ชันที่ว่างเปล่า
        [point] ละเว้นจุดของฟังก์ชันที่ว่างเปล่า
       *[other] ละเว้น { $type } ของฟังก์ชันที่ว่างเปล่า
    }

function-points-too-close = ฟังก์ชันมีสองจุดที่อยู่ใกล้กันเกินไป จึงนิยามฟังก์ชันไม่ได้

function-iterates-input-output-mismatch = การวนซ้ำฟังก์ชันทำได้ก็ต่อเมื่อจำนวนอินพุตเท่ากับจำนวนเอาต์พุต ฟังก์ชันนี้มี { $inputs } อินพุต และ { $outputs } เอาต์พุต

## `<sequence>`

sequence-invalid-length = ความยาวของลำดับไม่ถูกต้อง ต้องเป็นจำนวนเต็มที่ไม่เป็นลบ

sequence-invalid-step = ขั้นของลำดับไม่ถูกต้อง สำหรับลำดับชนิด { $type } ต้องเป็นจำนวน

sequence-invalid-endpoint-number = "{ $attribute }" ของลำดับจำนวนไม่ถูกต้อง ต้องเป็นจำนวน

sequence-invalid-endpoint-letters = "{ $attribute }" ของลำดับตัวอักษรไม่ถูกต้อง ต้องเป็นการรวมตัวอักษร

sequence-invalid-endpoint = "{ $attribute }" ของลำดับไม่ถูกต้อง

select-from-sequence-coprime-not-numbers = ละเว้น coprime เพราะไม่ได้เลือกจำนวน

select-from-sequence-coprime-with-exclude-combinations = ละเว้น coprime เพราะระบุ excludeCombinations ไว้

## Resolving a `target`

target-not-found = target ของ `<{ $source }>` ไม่ถูกต้อง: หาเป้าหมายไม่พบ

target-state-variable-not-found = target ของ `<{ $source }>` ไม่ถูกต้อง: หาตัวแปรสถานะชื่อ "{ $property }" บน `<{ $component }>` ไม่พบ

## `<odeSystem>`

ode-system-variables-match-independent = ตัวแปรของ `<odeSystem>` ต้องต่างจากตัวแปรอิสระ

ode-system-duplicate-variable-names = นิยามฟังก์ชัน ODE RHS ที่มีชื่อตัวแปรตามซ้ำกันไม่ได้

ode-system-rhs-function-error = นิยามฟังก์ชัน ODE RHS ไม่ได้ เกิดข้อผิดพลาดขณะสร้างฟังก์ชัน mathjs

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = นิยามมุมระหว่างเส้นตรง { $count } เส้นไม่ได้

angle-invalid-through-point = จุดใน through ของ `<angle>` ไม่ถูกต้อง

parabola-vertex-too-many-points = ยังไม่ได้ทำพาราโบลาที่มีจุดยอดและผ่านมากกว่า 1 จุด

parabola-too-many-points = ยังไม่ได้ทำพาราโบลาที่ผ่านมากกว่า 3 จุด

intersection-too-many-items = ยังไม่ได้ทำการหาส่วนตัดของสิ่งของมากกว่าสองรายการ

## Other math components

ionic-compound-not-two-ions = ยังไม่ได้ทำสารประกอบไอออนิกสำหรับกรณีอื่นนอกจากสองไอออน

ionic-compound-needs-cation-and-anion = สารประกอบไอออนิกทำไว้สำหรับแคตไอออนหนึ่งตัวและแอนไอออนหนึ่งตัวเท่านั้น

solve-equations-cannot-evaluate = แก้สมการไม่ได้เพราะหาค่าสมการไม่ได้: { $equation }

math-operators-operand-number-required = ต้องระบุ operandNumber เมื่อดึงตัวถูกดำเนินการทางคณิตศาสตร์

eigen-decomposition-failed = คำนวณค่าลักษณะเฉพาะของเมทริกซ์ไม่ได้

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: พารามิเตอร์ { $parameters } ไม่ปรากฏในแบบรูป จึงจะจับคู่กับช่องว่างเสมอ

## `<graph>`

graph-grid-invalid = `<graph>`: ตีความ grid="{ $grid }" ไม่ได้ ต้องเป็น none, medium, dense หรือจำนวนบวกสองจำนวนคั่นด้วยช่องว่าง เช่น grid="1 0.5" จะไม่วาดเส้นตาราง

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: ตัวแสดงผล prefigure ไม่รองรับ xLabelPosition="left" จะใช้พฤติกรรมของตำแหน่งขวาแทน

prefigure-y-label-position-unsupported = `<graph>`: ตัวแสดงผล prefigure ไม่รองรับ yLabelPosition="bottom" จะใช้พฤติกรรมของตำแหน่งบนแทน

prefigure-invalid-axis-bounds = `<graph>`: ขอบเขตแกนสำหรับการแปลง prefigure ไม่ถูกต้อง จะใช้ bbox เริ่มต้น (-10,-10,10,10)

prefigure-invalid-width = `<graph>`: ความกว้างสำหรับการแปลง prefigure ไม่ถูกต้อง จะใช้ความกว้างแผนภาพเริ่มต้น 425

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio สำหรับการแปลง prefigure ไม่ถูกต้อง จะใช้อัตราส่วนเริ่มต้น 1

prefigure-grid-spacing-too-fine = `<graph>`: ระยะห่างของเส้นตารางละเอียดเกินไปสำหรับขอบเขตแกน จะไม่วาดเส้นตารางในตัวแสดงผล prefigure

prefigure-annotations-not-rendered = `<graph>`: คำอธิบายประกอบจะไม่ถูกแสดงเมื่อไม่ได้ใช้ตัวแสดงผล PreFigure

multiple-annotations-children = พบลูก `<annotations>` หลายรายการใน `<graph>` จะละเว้นทั้งหมดยกเว้นรายการสุดท้าย

## Referring to other components

copy-unrecognized-component-type = ขยายหรือคัดลอกองค์ประกอบชนิดที่ไม่รู้จักไม่ได้: { $type }

copy-prop-not-found = หาสมบัติ { $property } บนองค์ประกอบชนิด { $component } ไม่พบ

collect-no-source = หาแหล่งที่มาสำหรับ collect ไม่พบ

collect-invalid-component-type = เก็บรวบรวมองค์ประกอบชนิด `<{ $component }>` ไม่ได้ เพราะเป็นชนิดที่ไม่ถูกต้อง

reference-index-unavailable = อ้างถึงดัชนี `{ $reference }` ไม่ได้

## `<callAction>`

component-action-unavailable = เรียก { $action } บนองค์ประกอบ `{ $reference }` ไม่ได้

## `<dataFrame>`

data-frame-inconsistent-row-lengths = รูปร่างของข้อมูลไม่ถูกต้อง ความยาวของแถวไม่สอดคล้องกัน พบใน componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = ข้อมูลมีชื่อหลักซ้ำกัน พบใน componentIdx :{ $componentIdx }

data-frame-missing-column-name = ข้อมูลขาดชื่อหลักไปหนึ่งชื่อ พบใน componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award ของคำตอบนี้อ้างอิงคำตอบที่แท็ก answer เดียวกันส่งไป ซึ่งจะทำให้เกิดพฤติกรรมที่ไม่คาดคิด

answer-max-num-attempts-in-section-wide-check-work = การตั้ง `maxNumAttempts` บน `<answer>` ที่อยู่ในภาชนะซึ่งมี `sectionWideCheckWork` ไม่มีผล เพราะจำนวนครั้งถูกควบคุมโดยภาชนะนั้น ให้ตั้ง `maxNumAttempts` ที่ภาชนะแทน

nested-section-wide-check-work-max-num-attempts = การตั้ง `maxNumAttempts` บนภาชนะที่มี `sectionWideCheckWork` ซึ่งอยู่ในภาชนะอื่นที่มี `sectionWideCheckWork` ไม่มีผล เพราะจำนวนครั้งถูกควบคุมโดยภาชนะชั้นนอก ให้ตั้ง `maxNumAttempts` ที่ภาชนะชั้นนอกแทน

answer-attributes-need-symbolic-equality = แอตทริบิวต์ { $attributes } จะไม่มีผลหากไม่ได้ตั้ง symbolicEquality

answer-invalid-type = ชนิดของคำตอบไม่ถูกต้อง: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = องค์ประกอบ `<{ $component }>` ไม่มีชื่อ จึงใช้เป็นแอตทริบิวต์ของ module ไม่ได้

module-attribute-name-already-defined = ใช้องค์ประกอบ `<{ $component } name="{ $name }">` เป็นแอตทริบิวต์ของ module ไม่ได้ เพราะองค์ประกอบชนิด `<module>` มีแอตทริบิวต์ชื่อ "{ $name }" อยู่แล้ว

conditional-content-condition-ignored = แอตทริบิวต์ `condition` จะถูกละเว้นบนองค์ประกอบ `<conditionalContent>` ที่มีลูกเป็น case หรือ else

slider-markers-type-mismatch = ชนิดของเครื่องหมายไม่ตรงกับชนิดของ slider

pretzel-problem-needs-statement-and-answer = pretzel ไม่ถูกต้อง: แต่ละ `<problem>` ต้องมี `<statement>` หนึ่งรายการและ `<answer>` หนึ่งรายการ

pretzel-circuit-first-problem-distractor = pretzel ไม่ถูกต้อง: ใน mode="circuit" `<problem>` แรกเป็นตัวลวงไม่ได้

## Attribute values

attribute-invalid-values = ค่า { $values } ของแอตทริบิวต์ `{ $attribute }` ไม่ถูกต้อง จะละเว้น

attribute-must-be-references = ค่า `{ $value }` ของแอตทริบิวต์ `{ $attribute }` ไม่ถูกต้อง แอตทริบิวต์นี้ต้องประกอบด้วยการอ้างอิงที่ขึ้นต้นด้วย `$`

math-input-invalid-function-names = <mathInput>: ละเว้นชื่อฟังก์ชันที่ไม่ถูกต้องใน { $attribute }: { $names } ส่วนที่แสดงของแต่ละชื่อต้องยาวอย่างน้อย 2 อักขระ (ตัวอักษรหรือขีดกลาง) และอาจตามด้วยส่วนท้าย `|<mathspeak alternative>` ก็ได้

## Building components from the source

component-type-invalid = ชนิดขององค์ประกอบไม่ถูกต้อง: `<{ $componentType }>`

attribute-repeated = ระบุแอตทริบิวต์ { $attribute } ซ้ำไม่ได้

attribute-invalid-for-component = "{ $attribute }" เป็นแอตทริบิวต์ที่ไม่ถูกต้องสำหรับองค์ประกอบชนิด `<{ $componentType }>`

## Style definition contrast

style-definition-insufficient-contrast =
    นิยามสไตล์ { $styleNumber } มีความต่างสีไม่พอสำหรับ{ $context ->
        [text-on-background] สีข้อความเทียบกับสีพื้นหลัง
        [high-contrast] สีความต่างสูงเทียบกับผืนผ้าใบ
        [line] สีเส้นเทียบกับผืนผ้าใบ
        [marker] สีเครื่องหมายเทียบกับผืนผ้าใบ
       *[text-on-canvas] สีข้อความเทียบกับผืนผ้าใบ
    }{ $mode ->
        [dark] { " (โหมดมืด)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ต้องอย่างน้อย { $threshold }:1)

style-definition-dark-mode-text-background-contrast =
    แม้นิยามสไตล์ { $styleNumber } จะระบุสีที่มีความต่างเพียงพอสำหรับโหมดสว่าง แต่สีของโหมดมืดที่ได้จากค่าเหล่านั้นมีความต่างไม่พอระหว่างสีข้อความกับสีพื้นหลัง ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ต้องอย่างน้อย { $threshold }:1) { $suggestion ->
        [available] เพื่อให้ความต่างสีในโหมดมืดเพียงพอ ให้เพิ่มความต่างในโหมดสว่าง (เช่น ตั้ง { $lightAttribute }="{ $lightColor }") หรือกำหนดสีของโหมดมืดทับ (เช่น ตั้ง { $darkAttribute }="{ $darkColor }")
       *[none] เพื่อให้ความต่างสีในโหมดมืดเพียงพอ ให้เพิ่มความต่างในโหมดสว่าง หรือกำหนดสีที่ได้มาทับด้วย textColorDarkMode และ/หรือ backgroundColorDarkMode
    }

style-definition-dark-mode-text-canvas-contrast =
    แม้นิยามสไตล์ { $styleNumber } จะระบุสีข้อความที่มีความต่างเพียงพอสำหรับโหมดสว่าง แต่สีข้อความของโหมดมืดที่ได้จากค่านั้นมีความต่างไม่พอเมื่อเทียบกับผืนผ้าใบ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ต้องอย่างน้อย { $threshold }:1) { $suggestion ->
        [available] เพื่อให้ความต่างสีในโหมดมืดเพียงพอ ให้เพิ่มความต่างในโหมดสว่าง (เช่น ตั้ง textColor="{ $lightColor }") หรือกำหนดสีของโหมดมืดทับ (เช่น ตั้ง textColorDarkMode="{ $darkColor }")
       *[none] เพื่อให้ความต่างสีในโหมดมืดเพียงพอ ให้เพิ่มความต่างในโหมดสว่าง หรือกำหนดสีที่ได้มาทับด้วย textColorDarkMode
    }

section-multiple-style-palettes = หัวข้อหนึ่งเลือก <stylePalette> ได้เพียงอันเดียว จะใช้อันสุดท้าย

## Unique variants

variant-num-to-select-not-non-negative-integer = ระบุรูปแบบเฉพาะของ { $component } ไม่ได้ เพราะ numToSelect ไม่ใช่จำนวนเต็มที่ไม่เป็นลบ

variant-num-to-select-not-constant-number = ระบุรูปแบบเฉพาะของ { $component } ไม่ได้ เพราะ numToSelect ไม่ใช่จำนวนคงตัว

variant-with-replacement-not-constant-boolean = ระบุรูปแบบเฉพาะของ { $component } ไม่ได้ เพราะ withReplacement ไม่ใช่ boolean คงตัว

variant-select-weight-disables-unique = รูปแบบเฉพาะของ select จะถูกปิดหากมีตัวเลือกที่ระบุ selectWeight หรือ selectForVariants

variant-coprime-undetermined = ระบุรูปแบบเฉพาะของ { $component } ไม่ได้ เพราะบอกไม่ได้ว่า coprime เป็นเท็จเสมอ

variant-attribute-not-constant = ระบุรูปแบบเฉพาะของ { $component } ไม่ได้ เพราะ { $attribute } ไม่ใช่ค่าคงตัว

variant-attribute-not-number = ระบุรูปแบบเฉพาะของ { $component } ไม่ได้ เพราะ { $attribute } ไม่ใช่จำนวน

variant-attribute-wrong-type-for-sequence =
    ระบุรูปแบบเฉพาะของ { $component } ชนิด { $type } ไม่ได้ เพราะ { $attribute } ไม่ใช่{ $expected ->
        [letters-combination] การรวมตัวอักษร
        [math-expression] นิพจน์คณิตศาสตร์ที่ถูกต้อง
        [integer] จำนวนเต็ม
       *[number] จำนวน
    }

variant-length-not-integer = ระบุรูปแบบเฉพาะของ { $component } ไม่ได้ เพราะ length ไม่ใช่จำนวนเต็ม

variant-sort-not-implemented = ยังไม่ได้ทำรูปแบบเฉพาะของ { $component } ที่มี sort

variant-exclude-combinations-not-implemented = ยังไม่ได้ทำรูปแบบเฉพาะของ { $component } ที่มี excludeCombinations

variant-math-exclude-not-implemented = ยังไม่ได้ทำรูปแบบเฉพาะของ { $component } ชนิด math ที่มี exclude

variant-non-constant-exclude-not-implemented = ยังไม่ได้ทำรูปแบบเฉพาะของ { $component } ที่มี exclude ซึ่งไม่คงตัว

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ตัวแสดงผล graph prefigure ไม่รองรับ จะข้ามลูกหลานนี้

prefigure-descendant-invalid-geometry = { $subject }: เรขาคณิตไม่จำกัดหรือไม่ครบถ้วน จะข้ามลูกหลานนี้

prefigure-curve-label-omitted = { $subject }: องค์ประกอบเส้นโค้งที่แปลงแล้วไม่รองรับชื่อกำกับ จะละเว้นชื่อกำกับ

prefigure-curve-unsupported-definition-type = { $subject }: ชนิดนิยามฟังก์ชันเส้นโค้ง '{ $definitionType }' ไม่รองรับ จะข้ามลูกหลานนี้

prefigure-region-flip-functions-unsupported = { $subject }: แอตทริบิวต์ flipFunctions บน regionBetweenCurves ไม่รองรับ จะข้ามลูกหลานนี้

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves รองรับเฉพาะฟังก์ชันลูกชนิดสูตร จะข้ามลูกหลานนี้

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ไม่รองรับสำหรับ{ $labelKind ->
        [line-family] ชื่อกำกับของตระกูลเส้น
       *[point] ชื่อกำกับของจุด
    } จะใช้การจัดวางเริ่มต้นของ PreFigure

prefigure-fill-style-unsupported = { $subject }: PreFigure ไม่รองรับสไตล์การระบายสี '{ $fillStyle }' จะกลับไปใช้การระบายสีทึบ

prefigure-line-style-unknown = { $subject }: สไตล์เส้น '{ $lineStyle }' ไม่รู้จัก จะละเว้นจากผลลัพธ์ PreFigure

prefigure-marker-style-mapped-to-diamond = { $subject }: สไตล์เครื่องหมาย '{ $markerStyle }' ถูกจับคู่กับสไตล์ 'diamond' ของ PreFigure

prefigure-marker-style-unsupported = { $subject }: PreFigure ไม่รองรับสไตล์เครื่องหมาย '{ $markerStyle }' จะใช้สไตล์เริ่มต้น

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ไม่ถูกต้อง ระบุเป้าหมายไม่ได้ จะละเว้นคำอธิบายประกอบ

annotation-ref-multiple-targets = `<annotation>`: `ref` ระบุได้หลายเป้าหมาย จะใช้เป้าหมายแรก

annotation-ref-outside-graph = `<annotation>`: `ref` ไม่ถูกต้อง เป้าหมายอยู่นอกกราฟที่บรรจุอยู่ จะละเว้นคำอธิบายประกอบ

annotation-ref-unsupported-target = `<annotation>`: `ref` ไม่ถูกต้อง เป้าหมายไม่ใช่วัตถุกราฟิกที่รองรับในการแปลง prefigure จะละเว้นคำอธิบายประกอบ

annotation-text-missing = `<annotation>`: ไม่มี `text` หรือว่างเปล่า จะให้ข้อความว่าง

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] พบการพึ่งพากันเป็นวง
       *[other] พบการพึ่งพากันเป็นวงที่เกี่ยวข้องกับองค์ประกอบ `<{ $componentType }>`
    }

reference-no-referent = ไม่พบสิ่งที่การอ้างอิงนี้ชี้ถึง: `{ $reference }`

reference-multiple-referents = พบสิ่งที่การอ้างอิงนี้ชี้ถึงหลายรายการ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = รูปแบบของแอตทริบิวต์ { $attribute } ของ `<{ $componentType }>` ไม่ถูกต้อง

children-invalid = ลูกของ `<{ $componentType }>` ไม่ถูกต้อง: พบลูกที่ไม่ถูกต้อง: { $children }

## Falling back to a default

attribute-value-invalid-using-default = ค่า `{ $value }` ของแอตทริบิวต์ `{ $attribute }` ไม่ถูกต้อง จะใช้ค่า `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] ไม่พบ DoenetML รุ่น { $version }
       *[other] ไม่พบ DoenetML รุ่น { $version } จะใช้รุ่น { $fallback } แทน
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ไม่ถูกต้อง: { $content }

parse-tag-missing-close-tag = DoenetML ไม่ถูกต้อง: แท็ก `{ $tag }` ไม่มีแท็กปิด ต้องเป็นแท็กที่ปิดในตัวเองหรือมีแท็ก `</{ $tagName }>`

parse-tag-error = DoenetML ไม่ถูกต้อง: เกิดข้อผิดพลาดในแท็ก `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ไม่ถูกต้อง: แอตทริบิวต์ `{ $attribute }` ที่ไม่ถูกต้องดูเหมือนจะขาดค่า

parse-attribute-invalid = DoenetML ไม่ถูกต้อง: แอตทริบิวต์ `{ $attribute }` ไม่ถูกต้อง

parse-attribute-value-invalid = DoenetML ไม่ถูกต้อง: ค่าแอตทริบิวต์ `{ $value }` ไม่ถูกต้อง

parse-attribute-value-quote-mismatch = DoenetML ไม่ถูกต้อง: ค่าแอตทริบิวต์ `{ $value }` ไม่ถูกต้อง เครื่องหมายอัญประกาศไม่เข้าคู่กัน ดูเหมือนจะขาด `{ $quote }`

parse-open-tag-name-missing = DoenetML ไม่ถูกต้อง: พบแท็กที่ไม่มีชื่อ เช่น `<`

parse-tag-not-closed = DoenetML ไม่ถูกต้อง: แท็ก `{ $tag }` ยังไม่ปิด (ดูเหมือนจะขาด `>`)

parse-self-closing-tag-name-missing = DoenetML ไม่ถูกต้อง: พบแท็กที่ไม่มีชื่อ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ไม่ถูกต้อง: แท็ก `{ $tag }` ยังไม่ปิด (ดูเหมือนจะขาด `/>`)

parse-tag-invalid-attributes = DoenetML ไม่ถูกต้อง: แท็ก `{ $tag }` ไม่ถูกต้อง แอตทริบิวต์อาจผิด

parse-close-tag-name-missing = DoenetML ไม่ถูกต้อง: พบแท็กปิดที่ไม่มีชื่อ เช่น `</`

parse-attribute-value-unquoted = ค่าแอตทริบิวต์ต้องอยู่ในเครื่องหมายอัญประกาศ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ไม่ถูกต้อง: พบแท็กปิด `{ $tag }` แต่ไม่มีแท็กเปิดที่คู่กัน

parse-close-tag-mismatched = DoenetML ไม่ถูกต้อง: แท็กปิดไม่เข้าคู่กัน ต้องเป็น `</{ $expected }>` แต่พบ `{ $found }`

parser-node-unconvertible = แปลงโหนด { $node } เป็นโหนด Dast ไม่ได้

## Names

name-attribute-invalid =
    แอตทริบิวต์ name='{ $name }' ไม่ถูกต้อง { $reason ->
        [characters] ชื่อประกอบด้วยตัวอักษร ตัวเลข ขีดล่าง หรือขีดกลางเท่านั้น
       *[start] ชื่อต้องขึ้นต้นด้วยตัวอักษร
    }

component-name-invalid-start = ชื่อองค์ประกอบ "{ $name }" ไม่ถูกต้อง ชื่อต้องขึ้นต้นด้วยตัวอักษร

## `<answer>` sugar

answer-video-watched-missing-video = คำตอบชนิด videoWatched ต้องมีแอตทริบิวต์ video

answer-video-watched-video-not-reference = คำตอบชนิด videoWatched ต้องมีแอตทริบิวต์ video ที่เป็นการอ้างอิง

answer-name-not-single-text = แอตทริบิวต์ name ของคำตอบต้องมีลูกที่เป็น text เพียงรายการเดียว

## Referencing another document

external-doenetml-recursion-limit = ดึง DoenetML ภายนอกไม่ได้เพราะมีการวนซ้อนกันหลายชั้นเกินไป มีการอ้างอิงเป็นวงหรือไม่

external-doenetml-unavailable = ดึง DoenetML จาก { $attribute }="{ $uri }" ไม่ได้

external-doenetml-type-mismatch = DoenetML ที่ดึงจาก { $attribute }="{ $uri }" ไม่ถูกต้อง: ไม่ตรงกับองค์ประกอบชนิด "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] แอตทริบิวต์ `{ $from }` กำลังจะเลิกใช้ ให้ใช้ `{ $to }` แทน
       *[other] [deprecation] แอตทริบิวต์ `{ $from }` บน `<{ $component }>` กำลังจะเลิกใช้ ให้ใช้ `{ $to }` แทน
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] แอตทริบิวต์ `{ $from }` กำลังจะเลิกใช้และถูกละเว้น เพราะระบุ `{ $to }` ไว้ด้วย
       *[other] [deprecation] แอตทริบิวต์ `{ $from }` บน `<{ $component }>` กำลังจะเลิกใช้และถูกละเว้น เพราะระบุ `{ $to }` ไว้ด้วย
    }

deprecated-attribute-ignored = [deprecation] แอตทริบิวต์ `{ $attribute }` บน `<{ $component }>` กำลังจะเลิกใช้และถูกละเว้น


## Language coverage

pluralize-english-only = `<pluralize>` ทำพหูพจน์ได้เฉพาะภาษาอังกฤษ ข้อความจึงคงเดิมในเอกสารที่เขียนด้วยภาษา { $locale } ให้เขียนรูปพหูพจน์โดยตรง หรือกำหนดด้วยแอตทริบิวต์ `pluralForm`


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` ไม่ใช่องค์ประกอบของ Doenet ที่รู้จัก

schema-element-not-allowed-at-root = องค์ประกอบ `<{ $tag }>` ไม่อนุญาตที่รากของเอกสาร

schema-element-not-allowed-inside = องค์ประกอบ `<{ $tag }>` ไม่อนุญาตภายใน `<{ $parent }>`

schema-attribute-unrecognized = องค์ประกอบ `<{ $tag }>` ไม่มีแอตทริบิวต์ชื่อ `{ $attribute }`

schema-attribute-value-not-allowed =
    { $isList ->
        [true] แอตทริบิวต์ `{ $attribute }` ขององค์ประกอบ `<{ $tag }>` ต้องเป็นรายการที่แต่ละสมาชิกเป็นหนึ่งใน: { $allowed }
       *[other] แอตทริบิวต์ `{ $attribute }` ขององค์ประกอบ `<{ $tag }>` ต้องเป็นหนึ่งใน: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = ชื่อรูปแบบของ select ไม่ถูกต้อง ชื่อรูปแบบ { $variantName } ปรากฏใน { $numOptions } ตัวเลือก แต่จำนวนที่ต้องเลือกคือ { $numToSelect }

select-variant-name-without-options = ระบุรูปแบบบางอย่างให้ select ไว้ แต่ไม่ได้ระบุตัวเลือกสำหรับชื่อรูปแบบที่เป็นไปได้: { $variantName }

select-variant-name-not-possible = ชื่อรูปแบบ { $variantName } ที่ระบุให้ select ไม่ใช่ชื่อรูปแบบที่เป็นไปได้

select-too-few-options = เลือก { $numToSelect } องค์ประกอบจากเพียง { $numOptions } ไม่ได้

select-from-sequence-too-few-values = เลือก { $numToSelect } ค่าจากลำดับความยาว { $length } ไม่ได้

select-from-sequence-indices-count-mismatch = จำนวนดัชนีที่ระบุให้ select ต้องเท่ากับจำนวนที่ต้องเลือก

select-from-sequence-indices-not-integers = ดัชนีทั้งหมดที่ระบุให้ select ต้องเป็นจำนวนเต็ม

select-from-sequence-index-excluded = ระบุดัชนีของ selectfromsequence ที่ถูกกันออกไว้

select-from-sequence-indices-excluded-combination = ระบุดัชนีของ selectfromsequence ที่เป็นการรวมซึ่งถูกกันออก

select-from-sequence-coprime-not-positive-integers = เลือกการรวมที่เป็นจำนวนเฉพาะสัมพัทธ์ไม่ได้ เพราะไม่ได้เลือกจำนวนเต็มบวก

select-from-sequence-coprime-common-factor = เลือกจำนวนเฉพาะสัมพัทธ์ไม่ได้ ค่าที่เป็นไปได้ทั้งหมดมีตัวประกอบร่วมกัน (ค่าของ "from" หรือ "to" ที่ระบุต้องเป็นจำนวนเฉพาะสัมพัทธ์กับ "step")

select-from-sequence-coprime-single-number = เลือกการรวมที่เป็นจำนวนเฉพาะสัมพัทธ์จากจำนวนเดียวที่ไม่ใช่ 1 ไม่ได้

select-from-sequence-excluded-too-many-combinations = กันการรวมออกไปเกิน 70% ใน selectFromSequence

select-from-sequence-coprime-none-found = เลือกจำนวนเฉพาะสัมพัทธ์ไม่ได้ ค่าที่เป็นไปได้ทั้งหมดมีตัวประกอบร่วมกัน

select-from-sequence-too-few-unique-values = เลือก { $numToSelect } ค่าที่ไม่ซ้ำกันจากลำดับความยาว { $numPossibleValues } ไม่ได้

select-prime-numbers-too-few-values = เลือก { $numToSelect } ค่าจากรายการจำนวนเฉพาะความยาว { $numValues } ไม่ได้

select-prime-numbers-values-count-mismatch = จำนวนค่าที่ระบุให้ select ต้องเท่ากับจำนวนที่ต้องเลือก

select-prime-numbers-values-not-prime = ค่าทั้งหมดที่ระบุให้ select prime number ต้องอยู่ในรายการจำนวนเฉพาะ

select-prime-numbers-values-excluded-combination = ค่าที่ระบุให้ selectPrimeNumbers เป็นการรวมซึ่งถูกกันออก

select-prime-numbers-excluded-too-many-combinations = กันการรวมออกไปเกิน 70% ใน selectPrimeNumbers

select-random-combination-fluke = ด้วยความบังเอิญที่แทบเป็นไปไม่ได้ จึงเลือกการรวมของค่าสุ่มไม่ได้

select-random-value-fluke = ด้วยความบังเอิญที่แทบเป็นไปไม่ได้ จึงเลือกค่าสุ่มไม่ได้
