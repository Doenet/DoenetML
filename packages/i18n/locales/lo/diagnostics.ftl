# Lao diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Lao has a single plural category, so a countable message needs no selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } ຖືກລະເລີຍເມື່ອກຳນົດຈຸດປາຍທັງສອງ

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } ຖືກລະເລີຍເມື່ອກຳນົດທັງຈຸດປາຍ ແລະ ຈຸດກາງ

line-segment-midpoint-offset-without-midpoint = midpointOffset ບໍ່ມີຜົນຖ້າບໍ່ມີຈຸດກາງ

## `<line>`

line-points-undetermined-dimensions = ເສັ້ນຊື່ຜ່ານຈຸດທີ່ມີມິຕິບໍ່ແນ່ນອນ.

line-points-too-few-dimensions = ເສັ້ນຊື່ຕ້ອງຜ່ານຈຸດທີ່ມີຢ່າງໜ້ອຍສອງມິຕິ.

line-points-depend-on-variables = ເສັ້ນຊື່ຜ່ານຈຸດທີ່ຂຶ້ນກັບຕົວປ່ຽນ: { $variables }.

line-equation-invalid-format = ຮູບແບບສົມຜົນຂອງເສັ້ນຊື່ໃນຕົວປ່ຽນ { $variable1 } ແລະ { $variable2 } ບໍ່ຖືກຕ້ອງ.

## `<ray>`

ray-overprescribed-through = ລັງສີຖືກກຳນົດດ້ວຍ through, endpoint ແລະ direction ພ້ອມກັນ. ຈະລະເລີຍ through ທີ່ກຳນົດໄວ້.

ray-dimension-mismatch = numDimensions ໃນລັງສີບໍ່ກົງກັນ.

## `<vector>`

vector-overprescribed-head = ເວັກເຕີຖືກກຳນົດດ້ວຍ head, tail ແລະ displacement ພ້ອມກັນ. ຈະລະເລີຍ head ທີ່ກຳນົດໄວ້.

vector-dimension-mismatch = numDimensions ໃນເວັກເຕີບໍ່ກົງກັນ.

## Attracting and constraining

attract-to-without-nearest-point = ດຶງດູດເຂົ້າຫາ `<{ $component }>` ບໍ່ໄດ້ ເພາະມັນບໍ່ມີຕົວປ່ຽນສະຖານະ nearestPoint.

constrain-to-without-nearest-point = ຈຳກັດໃຫ້ຢູ່ເທິງ `<{ $component }>` ບໍ່ໄດ້ ເພາະມັນບໍ່ມີຕົວປ່ຽນສະຖານະ nearestPoint.

constrain-to-interior-without-nearest-point = ຈຳກັດໃຫ້ຢູ່ພາຍໃນ `<{ $component }>` ບໍ່ໄດ້ ເພາະມັນບໍ່ມີຕົວປ່ຽນສະຖານະ nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ຖືກລະເລີຍສຳລັບ choiceInput ທີ່ບໍ່ແມ່ນ inline

## Ordering children by index

choice-input-indices-count-mismatch = ລະເລີຍ indices ທີ່ກຳນົດສຳລັບ choiceInput ເພາະຈຳນວນ indices ບໍ່ກົງກັບຈຳນວນລູກ choice.

pretzel-indices-count-mismatch = ລະເລີຍ indices ທີ່ກຳນົດສຳລັບ problem ເພາະຈຳນວນ indices ບໍ່ກົງກັບຈຳນວນລູກ problem.

shuffle-indices-count-mismatch = ລະເລີຍ indices ທີ່ກຳນົດສຳລັບ shuffle ເພາະຈຳນວນ indices ບໍ່ກົງກັບຈຳນວນອົງປະກອບ.

indices-ignored-out-of-range = ລະເລີຍ indices ທີ່ກຳນົດສຳລັບ { $component } ເພາະມີບາງ indices ຢູ່ນອກຂອບເຂດ.

pretzel-indices-repeated = ລະເລີຍ indices ທີ່ກຳນົດສຳລັບ pretzel ເພາະມີບາງ indices ຊ້ຳກັນ.

pretzel-circuit-first-index = ລະເລີຍ indices ທີ່ກຳນົດສຳລັບ pretzel ໃນໂໝດ circuit ເພາະ index ທຳອິດຕ້ອງເປັນ 1.

## `<shuffle>` and `<sort>`

string-children-need-type = ເພື່ອໃຫ້ `<{ $component }>` ເຮັດວຽກກັບລູກທີ່ເປັນຂໍ້ຄວາມ ຕ້ອງກຳນົດແອັດທຣິບິວ `type`.

invalid-type-defaulting-to-math = type { $type } ບໍ່ຖືກຕ້ອງສຳລັບອົງປະກອບ { $component }. ຕ້ອງເປັນ math, text, number ຫຼື boolean. ຈະໃຊ້ math ເປັນຄ່າເລີ່ມຕົ້ນ.

string-not-valid-component-to-arrange = ຂໍ້ຄວາມ "{ $value }" ບໍ່ແມ່ນອົງປະກອບທີ່ຖືກຕ້ອງສຳລັບ { $component }. ຈະລະເລີຍ.

## Types and variables

invalid-type-defaulting-to-number = type { $type } ບໍ່ຖືກຕ້ອງ, ຈະຕັ້ງ type ເປັນ number.

invalid-variable-value = ຄ່າຂອງຕົວປ່ຽນບໍ່ຖືກຕ້ອງ: `{ $value }`

## Variants

variant-index-must-be-number = index ຂອງ variant { $index } ຕ້ອງເປັນຕົວເລກ

variant-index-must-be-integer = index ຂອງ variant { $index } ຕ້ອງເປັນຈຳນວນເຕັມ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ຍັງບໍ່ຮອງຮັບການວັດແທກແບບສົມບູນ. ຈະຕັ້ງຄວາມກວ້າງເປັນແບບທຽບ.

side-by-side-absolute-margins = `<{ $component }>` ຍັງບໍ່ຮອງຮັບການວັດແທກແບບສົມບູນ. ຈະຕັ້ງຂອບເປັນແບບທຽບ.

side-by-side-no-block-child = `<{ $component }>` ບໍ່ຖືກຕ້ອງ: ມັນຕ້ອງມີລູກແບບບລັອກຢ່າງໜ້ອຍໜຶ່ງ.

## `<label>`

label-for-ignored-on-graphical = ແອັດທຣິບິວ `for` ເທິງ `<label>` ໃນກຣາຟຟິກຖືກລະເລີຍ.

label-for-must-resolve-to-one = ແອັດທຣິບິວ `for` ເທິງ `<label>` ຕ້ອງອ້າງອີງເຖິງອົງປະກອບດຽວ.

label-for-unresolved = ແອັດທຣິບິວ `for` ເທິງ `<label>` ບໍ່ສາມາດອ້າງອີງເຖິງອົງປະກອບໃດໄດ້.

label-for-answer-with-authored-inputs = ແອັດທຣິບິວ `for` ເທິງ `<label>` ອ້າງອີງເຖິງ `<answer>` ທີ່ມີຊ່ອງປ້ອນຂໍ້ມູນທີ່ຜູ້ຂຽນສ້າງເອງ; ກະລຸນາອ້າງອີງຊ່ອງປ້ອນຂໍ້ມູນໂດຍກົງ.

label-for-answer-without-input = ແອັດທຣິບິວ `for` ເທິງ `<label>` ອ້າງອີງເຖິງ `<answer>` ທີ່ບໍ່ມີຊ່ອງປ້ອນຂໍ້ມູນໃຫ້ຕິດປ້າຍ.

label-for-must-reference-input-or-answer = ແອັດທຣິບິວ `for` ເທິງ `<label>` ຕ້ອງອ້າງອີງເຖິງຊ່ອງປ້ອນຂໍ້ມູນ ຫຼື answer.

## Accessibility

accessibility-short-description-or-decorative = ເພື່ອການເຂົ້າເຖິງ `<{ $component }>` ຕ້ອງມີຄຳອະທິບາຍສັ້ນ ຫຼື ຖືກກຳນົດວ່າເປັນການຕົກແຕ່ງ.

accessibility-video-short-description = ເພື່ອການເຂົ້າເຖິງ `<video>` ຕ້ອງມີຄຳອະທິບາຍສັ້ນ.

accessibility-input-short-description-or-label = ເພື່ອການເຂົ້າເຖິງ `<{ $component }>` ຕ້ອງມີຄຳອະທິບາຍສັ້ນ ຫຼື ປ້າຍ.

accessibility-answer-input-short-description-or-label = ເພື່ອການເຂົ້າເຖິງ `<answer>` ທີ່ສ້າງຊ່ອງປ້ອນຂໍ້ມູນຕ້ອງມີຄຳອະທິບາຍສັ້ນ ຫຼື ປ້າຍ.

accessibility-short-description-contains-math = ຄຳອະທິບາຍສັ້ນບໍ່ຄວນມີອົງປະກອບຄະນິດສາດເຊັ່ນ `<{ $component }>`. ກະລຸນາຂຽນຄະນິດສາດເປັນຄຳສັບ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ມີຄວາມຄົມຊັດບໍ່ພຽງພໍສຳລັບຂໍ້ຄວາມຫົວຂໍ້ພາກສ່ວນ (ໂໝດມືດ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ຕ້ອງການຢ່າງໜ້ອຍ { $threshold }:1).
       *[other] { $colorName } ມີຄວາມຄົມຊັດບໍ່ພຽງພໍສຳລັບຂໍ້ຄວາມຫົວຂໍ້ພາກສ່ວນ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ຕ້ອງການຢ່າງໜ້ອຍ { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = ຍັງບໍ່ໄດ້ຮອງຮັບ `<circle>` ຜ່ານ { $count } ຈຸດ ໃນກໍລະນີທີ່ຈຸດບໍ່ມີຄ່າເປັນຕົວເລກ.

circle-too-many-through-points = ບໍ່ສາມາດຄຳນວນວົງມົນຜ່ານຈຸດຫຼາຍກວ່າ 3 ໄດ້.

circle-overprescribed-radius-center-points = ບໍ່ສາມາດຄຳນວນວົງມົນທີ່ກຳນົດທັງລັດສະໝີ, ຈຸດສູນກາງ ແລະ ຈຸດຜ່ານໄດ້.

circle-center-with-multiple-points = ບໍ່ສາມາດຄຳນວນວົງມົນທີ່ກຳນົດຈຸດສູນກາງ ແລະ ຜ່ານຈຸດຫຼາຍກວ່າ 1 ໄດ້.

circle-radius-too-small = ບໍ່ສາມາດຄຳນວນວົງມົນໄດ້: ເມື່ອໄລຍະຫ່າງລະຫວ່າງສອງຈຸດແມ່ນ { $distance }, ລັດສະໝີ { $radius } ທີ່ກຳນົດແມ່ນນ້ອຍເກີນໄປ.

circle-radius-with-many-points = ບໍ່ສາມາດສ້າງວົງມົນຜ່ານຈຸດຫຼາຍກວ່າສອງ ພ້ອມກຳນົດລັດສະໝີໄດ້.

circle-invalid-center-or-through-points = ຈຸດສູນກາງ ຫຼື ຈຸດຜ່ານຂອງວົງມົນບໍ່ຖືກຕ້ອງ.

circle-radius-center-with-multiple-points = ບໍ່ສາມາດຄຳນວນລັດສະໝີຂອງວົງມົນທີ່ກຳນົດຈຸດສູນກາງ ແລະ ຜ່ານຈຸດຫຼາຍກວ່າ 1 ໄດ້.

circle-change-radius-non-numerical = ບໍ່ສາມາດປ່ຽນລັດສະໝີຂອງວົງມົນທີ່ມີຈຸດຜ່ານບໍ່ເປັນຕົວເລກໄດ້

circle-radius-with-points-non-numerical = ບໍ່ສາມາດສ້າງວົງມົນຜ່ານຈຸດຫຼາຍກວ່າໜຶ່ງ ພ້ອມກຳນົດລັດສະໝີ ເມື່ອບໍ່ມີຄ່າເປັນຕົວເລກໄດ້.

circle-change-center-non-numerical = ຍັງບໍ່ໄດ້ຮອງຮັບການປ່ຽນຈຸດສູນກາງຂອງວົງມົນທີ່ຜ່ານຈຸດບໍ່ເປັນຕົວເລກ.

## `<function>`

function-domain-insufficient-dimensions = ມິຕິຂອງໂດເມນສຳລັບຟັງຊັນບໍ່ພຽງພໍ. ໂດເມນມີ { $intervals } ຊ່ວງ ແຕ່ຟັງຊັນມີ { $inputs } ຂາເຂົ້າ.

function-domain-invalid-format = ຮູບແບບໂດເມນສຳລັບຟັງຊັນບໍ່ຖືກຕ້ອງ.

function-ignoring-non-numerical =
    { $type ->
        [maximum] ລະເລີຍຄ່າສູງສຸດທີ່ບໍ່ເປັນຕົວເລກຂອງຟັງຊັນ.
        [minimum] ລະເລີຍຄ່າຕ່ຳສຸດທີ່ບໍ່ເປັນຕົວເລກຂອງຟັງຊັນ.
        [extremum] ລະເລີຍຄ່າສຸດຂີດທີ່ບໍ່ເປັນຕົວເລກຂອງຟັງຊັນ.
        [point] ລະເລີຍຈຸດທີ່ບໍ່ເປັນຕົວເລກຂອງຟັງຊັນ.
        [slope] ລະເລີຍຄວາມຊັນທີ່ບໍ່ເປັນຕົວເລກຂອງຟັງຊັນ.
       *[other] ລະເລີຍ { $type } ທີ່ບໍ່ເປັນຕົວເລກຂອງຟັງຊັນ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] ລະເລີຍຄ່າສູງສຸດທີ່ວ່າງເປົ່າຂອງຟັງຊັນ.
        [minimum] ລະເລີຍຄ່າຕ່ຳສຸດທີ່ວ່າງເປົ່າຂອງຟັງຊັນ.
        [extremum] ລະເລີຍຄ່າສຸດຂີດທີ່ວ່າງເປົ່າຂອງຟັງຊັນ.
        [point] ລະເລີຍຈຸດທີ່ວ່າງເປົ່າຂອງຟັງຊັນ.
       *[other] ລະເລີຍ { $type } ທີ່ວ່າງເປົ່າຂອງຟັງຊັນ.
    }

function-points-too-close = ຟັງຊັນມີສອງຈຸດທີ່ຢູ່ໃກ້ກັນເກີນໄປ. ບໍ່ສາມາດກຳນົດຟັງຊັນໄດ້.

function-iterates-input-output-mismatch = ການເຮັດຊ້ຳຂອງຟັງຊັນເປັນໄປໄດ້ພຽງເມື່ອຈຳນວນຂາເຂົ້າເທົ່າກັບຈຳນວນຂາອອກ. ຟັງຊັນນີ້ມີ { $inputs } ຂາເຂົ້າ ແລະ { $outputs } ຂາອອກ.

## `<sequence>`

sequence-invalid-length = ຄວາມຍາວຂອງລຳດັບບໍ່ຖືກຕ້ອງ. ຕ້ອງເປັນຈຳນວນເຕັມທີ່ບໍ່ຕິດລົບ.

sequence-invalid-step = ຂັ້ນຂອງລຳດັບບໍ່ຖືກຕ້ອງ. ຕ້ອງເປັນຕົວເລກສຳລັບລຳດັບຊະນິດ { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ຂອງລຳດັບຕົວເລກບໍ່ຖືກຕ້ອງ. ຕ້ອງເປັນຕົວເລກ.

sequence-invalid-endpoint-letters = "{ $attribute }" ຂອງລຳດັບຕົວອັກສອນບໍ່ຖືກຕ້ອງ. ຕ້ອງເປັນການລວມຕົວອັກສອນ.

sequence-invalid-endpoint = "{ $attribute }" ຂອງລຳດັບບໍ່ຖືກຕ້ອງ.

select-from-sequence-coprime-not-numbers = coprime ຖືກລະເລີຍ ເພາະບໍ່ໄດ້ເລືອກຕົວເລກ

select-from-sequence-coprime-with-exclude-combinations = coprime ຖືກລະເລີຍ ເພາະໄດ້ກຳນົດ excludeCombinations

## Resolving a `target`

target-not-found = target ບໍ່ຖືກຕ້ອງສຳລັບ `<{ $source }>`: ຫາ target ບໍ່ພົບ.

target-state-variable-not-found = target ບໍ່ຖືກຕ້ອງສຳລັບ `<{ $source }>`: ຫາຕົວປ່ຽນສະຖານະຊື່ "{ $property }" ເທິງ `<{ $component }>` ບໍ່ພົບ.

## `<odeSystem>`

ode-system-variables-match-independent = ຕົວປ່ຽນຂອງ `<odeSystem>` ຕ້ອງແຕກຕ່າງຈາກຕົວປ່ຽນອິດສະຫຼະ.

ode-system-duplicate-variable-names = ບໍ່ສາມາດກຳນົດຟັງຊັນຂ້າງຂວາຂອງ ODE ທີ່ມີຊື່ຕົວປ່ຽນຂຶ້ນກັບຊ້ຳກັນໄດ້.

ode-system-rhs-function-error = ບໍ່ສາມາດກຳນົດຟັງຊັນຂ້າງຂວາຂອງ ODE ໄດ້. ເກີດຂໍ້ຜິດພາດໃນການສ້າງຟັງຊັນ mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = ບໍ່ສາມາດກຳນົດມຸມລະຫວ່າງ { $count } ເສັ້ນໄດ້

angle-invalid-through-point = ຈຸດໃນ through ຂອງ `<angle>` ບໍ່ຖືກຕ້ອງ

parabola-vertex-too-many-points = ຍັງບໍ່ໄດ້ຮອງຮັບພາຣາໂບລາທີ່ມີຈຸດຍອດ ແລະ ຜ່ານຈຸດຫຼາຍກວ່າ 1.

parabola-too-many-points = ຍັງບໍ່ໄດ້ຮອງຮັບພາຣາໂບລາຜ່ານຈຸດຫຼາຍກວ່າ 3.

intersection-too-many-items = ຍັງບໍ່ໄດ້ຮອງຮັບການຕັດກັນສຳລັບອົງປະກອບຫຼາຍກວ່າສອງ

## Other math components

ionic-compound-not-two-ions = ຍັງບໍ່ໄດ້ຮອງຮັບສານປະກອບໄອອອນສຳລັບສິ່ງອື່ນນອກຈາກສອງໄອອອນ.

ionic-compound-needs-cation-and-anion = ສານປະກອບໄອອອນຮອງຮັບພຽງແຕ່ໜຶ່ງແຄທໄອອອນ ແລະ ໜຶ່ງແອນໄອອອນ.

solve-equations-cannot-evaluate = ບໍ່ສາມາດແກ້ສົມຜົນໄດ້ ເພາະປະເມີນສົມຜົນບໍ່ໄດ້: { $equation }

math-operators-operand-number-required = ຕ້ອງກຳນົດ operandNumber ເມື່ອດຶງຕົວຖືກດຳເນີນການທາງຄະນິດສາດ.

eigen-decomposition-failed = ບໍ່ສາມາດຄຳນວນຄ່າສະເພາະຂອງແມັດຊິກໄດ້

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: ພາຣາມິເຕີ { $parameters } ບໍ່ປາກົດໃນຮູບແບບ ດັ່ງນັ້ນມັນຈະກົງກັບຄ່າວ່າງສະເໝີ.

## `<graph>`

graph-grid-invalid = `<graph>`: ບໍ່ສາມາດຕີຄວາມ grid="{ $grid }" ໄດ້. ມັນຕ້ອງເປັນ none, medium, dense ຫຼື ຕົວເລກບວກສອງຕົວແຍກດ້ວຍຍະຫວ່າງ ເຊັ່ນ grid="1 0.5". ຈະບໍ່ແຕ້ມຕາຂ່າຍ.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ບໍ່ຮອງຮັບໃນຕົວສະແດງຜົນ prefigure; ຈະໃຊ້ພຶດຕິກຳຂອງຕຳແໜ່ງຂວາ.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ບໍ່ຮອງຮັບໃນຕົວສະແດງຜົນ prefigure; ຈະໃຊ້ພຶດຕິກຳຂອງຕຳແໜ່ງເທິງ.

prefigure-invalid-axis-bounds = `<graph>`: ຂອບເຂດແກນບໍ່ຖືກຕ້ອງສຳລັບການແປງເປັນ prefigure; ຈະໃຊ້ bbox ເລີ່ມຕົ້ນ (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ຄວາມກວ້າງບໍ່ຖືກຕ້ອງສຳລັບການແປງເປັນ prefigure; ຈະໃຊ້ຄວາມກວ້າງແຜນວາດເລີ່ມຕົ້ນ 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ບໍ່ຖືກຕ້ອງສຳລັບການແປງເປັນ prefigure; ຈະໃຊ້ອັດຕາສ່ວນເລີ່ມຕົ້ນ 1.

prefigure-grid-spacing-too-fine = `<graph>`: ໄລຍະຫ່າງຕາຂ່າຍລະອຽດເກີນໄປສຳລັບຂອບເຂດແກນ; ຕາຂ່າຍຖືກຕັດອອກໃນຕົວສະແດງຜົນ prefigure.

prefigure-annotations-not-rendered = `<graph>`: ຄຳອະທິບາຍປະກອບຈະບໍ່ຖືກສະແດງເມື່ອບໍ່ໄດ້ໃຊ້ຕົວສະແດງຜົນ PreFigure.

multiple-annotations-children = ພົບລູກ `<annotations>` ຫຼາຍອັນໃນ `<graph>`; ທັງໝົດຍົກເວັ້ນອັນສຸດທ້າຍຖືກລະເລີຍ.

## Referring to other components

copy-unrecognized-component-type = ບໍ່ສາມາດຂະຫຍາຍ ຫຼື ສຳເນົາຊະນິດອົງປະກອບທີ່ບໍ່ຮູ້ຈັກ: { $type }.

copy-prop-not-found = ຫາ prop { $property } ເທິງອົງປະກອບຊະນິດ { $component } ບໍ່ພົບ

collect-no-source = ຫາແຫຼ່ງສຳລັບ collect ບໍ່ພົບ.

collect-invalid-component-type = ບໍ່ສາມາດເກັບອົງປະກອບຊະນິດ `<{ $component }>` ໄດ້ ເພາະມັນເປັນຊະນິດອົງປະກອບທີ່ບໍ່ຖືກຕ້ອງ.

reference-index-unavailable = ບໍ່ສາມາດອ້າງອີງ index `{ $reference }` ໄດ້

## `<callAction>`

component-action-unavailable = ບໍ່ສາມາດເອີ້ນ { $action } ເທິງອົງປະກອບ `{ $reference }` ໄດ້

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ຂໍ້ມູນມີຮູບຮ່າງບໍ່ຖືກຕ້ອງ. ແຖວມີຄວາມຍາວບໍ່ສະໝ່ຳສະເໝີ. ພົບຢູ່ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = ຂໍ້ມູນມີຊື່ຖັນຊ້ຳກັນ. ພົບຢູ່ componentIdx :{ $componentIdx }

data-frame-missing-column-name = ຂໍ້ມູນຂາດຊື່ຖັນ. ພົບຢູ່ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award ສຳລັບຄຳຕອບນີ້ອີງໃສ່ຄຳຕອບທີ່ answer ເອງໄດ້ສົ່ງ ເຊິ່ງຈະນຳໄປສູ່ພຶດຕິກຳທີ່ບໍ່ຄາດຄິດ.

answer-max-num-attempts-in-section-wide-check-work = ການຕັ້ງ `maxNumAttempts` ເທິງ `<answer>` ພາຍໃນຕົວບັນຈຸທີ່ມີ `sectionWideCheckWork` ບໍ່ມີຜົນ ເພາະຈຳນວນຄັ້ງຖືກຄວບຄຸມໂດຍຕົວບັນຈຸ. ໃຫ້ຕັ້ງ `maxNumAttempts` ເທິງຕົວບັນຈຸແທນ.

nested-section-wide-check-work-max-num-attempts = ການຕັ້ງ `maxNumAttempts` ເທິງຕົວບັນຈຸທີ່ມີ `sectionWideCheckWork` ເຊິ່ງຢູ່ພາຍໃນຕົວບັນຈຸອື່ນທີ່ມີ `sectionWideCheckWork` ບໍ່ມີຜົນ ເພາະຈຳນວນຄັ້ງຖືກຄວບຄຸມໂດຍຕົວບັນຈຸຊັ້ນນອກ. ໃຫ້ຕັ້ງ `maxNumAttempts` ເທິງຕົວບັນຈຸຊັ້ນນອກແທນ.

answer-attributes-need-symbolic-equality = ແອັດທຣິບິວ { $attributes } ຈະບໍ່ມີຜົນ ຖ້າບໍ່ໄດ້ຕັ້ງ symbolicEquality.

answer-invalid-type = ຊະນິດບໍ່ຖືກຕ້ອງສຳລັບ answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = ເນື່ອງຈາກອົງປະກອບ `<{ $component }>` ບໍ່ມີຊື່ ມັນຈຶ່ງບໍ່ສາມາດໃຊ້ເປັນແອັດທຣິບິວຂອງ module ໄດ້

module-attribute-name-already-defined = ອົງປະກອບ `<{ $component } name="{ $name }">` ບໍ່ສາມາດໃຊ້ເປັນແອັດທຣິບິວຂອງ module ໄດ້ ເພາະຊະນິດອົງປະກອບ `<module>` ມີແອັດທຣິບິວ "{ $name }" ຢູ່ແລ້ວ.

conditional-content-condition-ignored = ແອັດທຣິບິວ `condition` ຖືກລະເລີຍເທິງອົງປະກອບ `<conditionalContent>` ທີ່ມີລູກ case ຫຼື else.

slider-markers-type-mismatch = ຊະນິດຂອງເຄື່ອງໝາຍບໍ່ກົງກັບຊະນິດຂອງ slider.

pretzel-problem-needs-statement-and-answer = pretzel ບໍ່ຖືກຕ້ອງ: `<problem>` ແຕ່ລະອັນຕ້ອງມີ `<statement>` ໜຶ່ງ ແລະ `<answer>` ໜຶ່ງ.

pretzel-circuit-first-problem-distractor = pretzel ບໍ່ຖືກຕ້ອງ: ໃນ mode="circuit" `<problem>` ທຳອິດບໍ່ສາມາດເປັນ distractor ໄດ້.

## Attribute values

attribute-invalid-values = ຄ່າ { $values } ບໍ່ຖືກຕ້ອງສຳລັບແອັດທຣິບິວ `{ $attribute }`; ຈະລະເລີຍ.

attribute-must-be-references = ຄ່າ `{ $value }` ບໍ່ຖືກຕ້ອງສຳລັບແອັດທຣິບິວ `{ $attribute }`. ແອັດທຣິບິວຕ້ອງປະກອບດ້ວຍການອ້າງອີງທີ່ຂຶ້ນຕົ້ນດ້ວຍ `$`.

math-input-invalid-function-names = <mathInput>: ລະເລີຍຊື່ຟັງຊັນທີ່ບໍ່ຖືກຕ້ອງໃນ { $attribute }: { $names }. ສ່ວນທີ່ສະແດງຂອງແຕ່ລະຊື່ຕ້ອງມີຢ່າງໜ້ອຍ 2 ຕົວອັກສອນ (ຕົວອັກສອນ ຫຼື ຂີດກາງ); ອາດຕາມດ້ວຍສ່ວນຕໍ່ທ້າຍ `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = ຊະນິດອົງປະກອບບໍ່ຖືກຕ້ອງ: `<{ $componentType }>`

attribute-repeated = ບໍ່ສາມາດໃສ່ແອັດທຣິບິວ { $attribute } ຊ້ຳໄດ້.

attribute-invalid-for-component = ແອັດທຣິບິວ "{ $attribute }" ບໍ່ຖືກຕ້ອງສຳລັບອົງປະກອບຊະນິດ `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    ນິຍາມຮູບແບບ { $styleNumber } ມີຄວາມຄົມຊັດບໍ່ພຽງພໍສຳລັບ{ $context ->
        [text-on-background] ສີຂໍ້ຄວາມທຽບກັບສີພື້ນຫຼັງ
        [high-contrast] ສີຄວາມຄົມຊັດສູງທຽບກັບພື້ນຜ້າໃບ
        [line] ສີເສັ້ນທຽບກັບພື້ນຜ້າໃບ
        [marker] ສີເຄື່ອງໝາຍທຽບກັບພື້ນຜ້າໃບ
       *[text-on-canvas] ສີຂໍ້ຄວາມທຽບກັບພື້ນຜ້າໃບ
    }{ $mode ->
        [dark] { " (ໂໝດມືດ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ຕ້ອງການຢ່າງໜ້ອຍ { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    ເຖິງແມ່ນວ່ານິຍາມຮູບແບບ { $styleNumber } ໄດ້ກຳນົດສີທີ່ມີຄວາມຄົມຊັດພຽງພໍສຳລັບໂໝດແຈ້ງ ແຕ່ສີສຳລັບໂໝດມືດທີ່ໄດ້ມາຈາກຄ່າເຫຼົ່ານັ້ນມີຄວາມຄົມຊັດບໍ່ພຽງພໍສຳລັບສີຂໍ້ຄວາມທຽບກັບສີພື້ນຫຼັງ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ຕ້ອງການຢ່າງໜ້ອຍ { $threshold }:1). { $suggestion ->
        [available] ເພື່ອຮັບປະກັນຄວາມຄົມຊັດພຽງພໍໃນໂໝດມືດ ໃຫ້ເພີ່ມຄວາມຄົມຊັດໃນໂໝດແຈ້ງ (ເຊັ່ນ ຕັ້ງ { $lightAttribute }="{ $lightColor }") ຫຼື ແທນທີ່ສີຂອງໂໝດມືດ (ເຊັ່ນ ຕັ້ງ { $darkAttribute }="{ $darkColor }").
       *[none] ເພື່ອຮັບປະກັນຄວາມຄົມຊັດພຽງພໍໃນໂໝດມືດ ໃຫ້ເພີ່ມຄວາມຄົມຊັດໃນໂໝດແຈ້ງ ຫຼື ແທນທີ່ສີທີ່ໄດ້ມາດ້ວຍ textColorDarkMode ແລະ/ຫຼື backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    ເຖິງແມ່ນວ່ານິຍາມຮູບແບບ { $styleNumber } ໄດ້ກຳນົດສີຂໍ້ຄວາມທີ່ມີຄວາມຄົມຊັດພຽງພໍສຳລັບໂໝດແຈ້ງ ແຕ່ສີຂໍ້ຄວາມສຳລັບໂໝດມືດທີ່ໄດ້ມາຈາກຄ່ານັ້ນມີຄວາມຄົມຊັດບໍ່ພຽງພໍທຽບກັບພື້ນຜ້າໃບ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ຕ້ອງການຢ່າງໜ້ອຍ { $threshold }:1). { $suggestion ->
        [available] ເພື່ອຮັບປະກັນຄວາມຄົມຊັດພຽງພໍໃນໂໝດມືດ ໃຫ້ເພີ່ມຄວາມຄົມຊັດໃນໂໝດແຈ້ງ (ເຊັ່ນ ຕັ້ງ textColor="{ $lightColor }") ຫຼື ແທນທີ່ສີຂອງໂໝດມືດ (ເຊັ່ນ ຕັ້ງ textColorDarkMode="{ $darkColor }").
       *[none] ເພື່ອຮັບປະກັນຄວາມຄົມຊັດພຽງພໍໃນໂໝດມືດ ໃຫ້ເພີ່ມຄວາມຄົມຊັດໃນໂໝດແຈ້ງ ຫຼື ແທນທີ່ສີທີ່ໄດ້ມາດ້ວຍ textColorDarkMode.
    }

section-multiple-style-palettes = ພາກສ່ວນໜຶ່ງເລືອກ <stylePalette> ໄດ້ພຽງອັນດຽວ; ຈະໃຊ້ອັນສຸດທ້າຍ.

## Unique variants

variant-num-to-select-not-non-negative-integer = ບໍ່ສາມາດກຳນົດ variant ທີ່ບໍ່ຊ້ຳກັນຂອງ { $component } ໄດ້ ເພາະ numToSelect ບໍ່ແມ່ນຈຳນວນເຕັມທີ່ບໍ່ຕິດລົບ.

variant-num-to-select-not-constant-number = ບໍ່ສາມາດກຳນົດ variant ທີ່ບໍ່ຊ້ຳກັນຂອງ { $component } ໄດ້ ເພາະ numToSelect ບໍ່ແມ່ນຕົວເລກຄົງທີ່.

variant-with-replacement-not-constant-boolean = ບໍ່ສາມາດກຳນົດ variant ທີ່ບໍ່ຊ້ຳກັນຂອງ { $component } ໄດ້ ເພາະ withReplacement ບໍ່ແມ່ນ boolean ຄົງທີ່.

variant-select-weight-disables-unique = variant ທີ່ບໍ່ຊ້ຳກັນສຳລັບ select ຖືກປິດ ຖ້າມີ option ໃດກຳນົດ selectWeight ຫຼື selectForVariants

variant-coprime-undetermined = ບໍ່ສາມາດກຳນົດ variant ທີ່ບໍ່ຊ້ຳກັນຂອງ { $component } ໄດ້ ເພາະບໍ່ສາມາດກຳນົດວ່າ coprime ເປັນເທັດສະເໝີ.

variant-attribute-not-constant = ບໍ່ສາມາດກຳນົດ variant ທີ່ບໍ່ຊ້ຳກັນຂອງ { $component } ໄດ້ ເພາະ { $attribute } ບໍ່ແມ່ນຄ່າຄົງທີ່.

variant-attribute-not-number = ບໍ່ສາມາດກຳນົດ variant ທີ່ບໍ່ຊ້ຳກັນຂອງ { $component } ໄດ້ ເພາະ { $attribute } ບໍ່ແມ່ນຕົວເລກ.

variant-attribute-wrong-type-for-sequence =
    ບໍ່ສາມາດກຳນົດ variant ທີ່ບໍ່ຊ້ຳກັນຂອງ { $component } ຊະນິດ { $type } ໄດ້ ເພາະ { $attribute } ບໍ່ແມ່ນ{ $expected ->
        [letters-combination] ການລວມຕົວອັກສອນ
        [math-expression] ນິພົນຄະນິດສາດທີ່ຖືກຕ້ອງ
        [integer] ຈຳນວນເຕັມ
       *[number] ຕົວເລກ
    }.

variant-length-not-integer = ບໍ່ສາມາດກຳນົດ variant ທີ່ບໍ່ຊ້ຳກັນຂອງ { $component } ໄດ້ ເພາະ length ບໍ່ແມ່ນຈຳນວນເຕັມ.

variant-sort-not-implemented = ຍັງບໍ່ໄດ້ຮອງຮັບ variant ທີ່ບໍ່ຊ້ຳກັນຂອງ { $component } ທີ່ມີ sort

variant-exclude-combinations-not-implemented = ຍັງບໍ່ໄດ້ຮອງຮັບ variant ທີ່ບໍ່ຊ້ຳກັນຂອງ { $component } ທີ່ມີ excludeCombinations

variant-math-exclude-not-implemented = ຍັງບໍ່ໄດ້ຮອງຮັບ variant ທີ່ບໍ່ຊ້ຳກັນຂອງ { $component } ຊະນິດ math ທີ່ມີ exclude

variant-non-constant-exclude-not-implemented = ຍັງບໍ່ໄດ້ຮອງຮັບ variant ທີ່ບໍ່ຊ້ຳກັນຂອງ { $component } ທີ່ມີ exclude ບໍ່ຄົງທີ່

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ບໍ່ຮອງຮັບໃນຕົວສະແດງຜົນ prefigure ຂອງກຣາຟ; ຂ້າມອົງປະກອບລູກ.

prefigure-descendant-invalid-geometry = { $subject }: ເລຂາຄະນິດບໍ່ຈຳກັດ ຫຼື ບໍ່ຄົບຖ້ວນ; ຂ້າມອົງປະກອບລູກ.

prefigure-curve-label-omitted = { $subject }: ບໍ່ຮອງຮັບປ້າຍເທິງອົງປະກອບເສັ້ນໂຄ້ງທີ່ແປງແລ້ວ; ຕັດປ້າຍອອກ.

prefigure-curve-unsupported-definition-type = { $subject }: ບໍ່ຮອງຮັບຊະນິດນິຍາມຟັງຊັນເສັ້ນໂຄ້ງ '{ $definitionType }'; ຂ້າມອົງປະກອບລູກ.

prefigure-region-flip-functions-unsupported = { $subject }: ບໍ່ຮອງຮັບແອັດທຣິບິວ flipFunctions ເທິງ regionBetweenCurves; ຂ້າມອົງປະກອບລູກ.

prefigure-region-non-formula-child = { $subject }: ຮອງຮັບພຽງຟັງຊັນລູກຊະນິດສູດເທິງ regionBetweenCurves; ຂ້າມອົງປະກອບລູກ.

prefigure-label-position-unsupported =
    { $subject }: ບໍ່ຮອງຮັບ labelPosition '{ $labelPosition }' ສຳລັບ{ $labelKind ->
        [line-family] ປ້າຍຂອງຕະກູນເສັ້ນ
       *[point] ປ້າຍຈຸດ
    }; ຈະໃຊ້ການຈັດວາງເລີ່ມຕົ້ນຂອງ PreFigure.

prefigure-fill-style-unsupported = { $subject }: PreFigure ບໍ່ຮອງຮັບຮູບແບບການລະບາຍ '{ $fillStyle }'; ຈະໃຊ້ການລະບາຍແບບເຕັມແທນ.

prefigure-line-style-unknown = { $subject }: ຮູບແບບເສັ້ນ '{ $lineStyle }' ບໍ່ຮູ້ຈັກ ຖືກຕັດອອກຈາກຜົນຜະລິດ PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ຮູບແບບເຄື່ອງໝາຍ '{ $markerStyle }' ຖືກແປງເປັນຮູບແບບ 'diamond' ຂອງ PreFigure.

prefigure-marker-style-unsupported = { $subject }: PreFigure ບໍ່ຮອງຮັບຮູບແບບເຄື່ອງໝາຍ '{ $markerStyle }'; ຈະໃຊ້ຮູບແບບເລີ່ມຕົ້ນ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ບໍ່ຖືກຕ້ອງ; ຫາເປົ້າໝາຍບໍ່ພົບ. ຕັດຄຳອະທິບາຍປະກອບອອກ.

annotation-ref-multiple-targets = `<annotation>`: `ref` ອ້າງອີງເຖິງຫຼາຍເປົ້າໝາຍ; ຈະໃຊ້ເປົ້າໝາຍທຳອິດ.

annotation-ref-outside-graph = `<annotation>`: `ref` ບໍ່ຖືກຕ້ອງ; ເປົ້າໝາຍຢູ່ນອກກຣາຟທີ່ບັນຈຸ. ຕັດຄຳອະທິບາຍປະກອບອອກ.

annotation-ref-unsupported-target = `<annotation>`: `ref` ບໍ່ຖືກຕ້ອງ; ເປົ້າໝາຍບໍ່ແມ່ນວັດຖຸກຣາຟຟິກທີ່ຮອງຮັບໃນການແປງເປັນ prefigure. ຕັດຄຳອະທິບາຍປະກອບອອກ.

annotation-text-missing = `<annotation>`: `text` ຂາດ ຫຼື ວ່າງເປົ່າ; ຈະສົ່ງອອກຂໍ້ຄວາມວ່າງ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] ພົບການເພິ່ງພາເປັນວົງຈອນ.
       *[other] ພົບການເພິ່ງພາເປັນວົງຈອນທີ່ກ່ຽວຂ້ອງກັບອົງປະກອບ `<{ $componentType }>`.
    }

reference-no-referent = ຫາສິ່ງທີ່ການອ້າງອີງຊີ້ໄປບໍ່ພົບ: `{ $reference }`

reference-multiple-referents = ພົບຫຼາຍສິ່ງທີ່ການອ້າງອີງຊີ້ໄປ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = ຮູບແບບຂອງແອັດທຣິບິວ { $attribute } ຂອງ `<{ $componentType }>` ບໍ່ຖືກຕ້ອງ.

children-invalid = ລູກບໍ່ຖືກຕ້ອງສຳລັບ `<{ $componentType }>`: ພົບລູກທີ່ບໍ່ຖືກຕ້ອງ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = ຄ່າ `{ $value }` ບໍ່ຖືກຕ້ອງສຳລັບແອັດທຣິບິວ `{ $attribute }`, ຈະໃຊ້ຄ່າ `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] ຫາ DoenetML ລຸ້ນ { $version } ບໍ່ພົບ.
       *[other] ຫາ DoenetML ລຸ້ນ { $version } ບໍ່ພົບ. ຈະໃຊ້ລຸ້ນ { $fallback } ແທນ
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ບໍ່ຖືກຕ້ອງ: { $content }

parse-tag-missing-close-tag = DoenetML ບໍ່ຖືກຕ້ອງ: ແທັກ `{ $tag }` ບໍ່ມີແທັກປິດ. ຕ້ອງການແທັກທີ່ປິດໃນຕົວ ຫຼື ແທັກ `</{ $tagName }>`.

parse-tag-error = DoenetML ບໍ່ຖືກຕ້ອງ: ມີຂໍ້ຜິດພາດໃນແທັກ `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ບໍ່ຖືກຕ້ອງ: ແອັດທຣິບິວ `{ $attribute }` ບໍ່ຖືກຕ້ອງ ເບິ່ງຄືວ່າຂາດຄ່າ.

parse-attribute-invalid = DoenetML ບໍ່ຖືກຕ້ອງ: ແອັດທຣິບິວ `{ $attribute }` ບໍ່ຖືກຕ້ອງ

parse-attribute-value-invalid = DoenetML ບໍ່ຖືກຕ້ອງ: ຄ່າແອັດທຣິບິວ `{ $value }` ບໍ່ຖືກຕ້ອງ

parse-attribute-value-quote-mismatch = DoenetML ບໍ່ຖືກຕ້ອງ: ຄ່າແອັດທຣິບິວ `{ $value }` ບໍ່ຖືກຕ້ອງ. ເຄື່ອງໝາຍວົງຢືມບໍ່ກົງກັນ. ເບິ່ງຄືວ່າຂາດ `{ $quote }`

parse-open-tag-name-missing = DoenetML ບໍ່ຖືກຕ້ອງ: ພົບແທັກທີ່ບໍ່ມີຊື່ ເຊັ່ນ `<`

parse-tag-not-closed = DoenetML ບໍ່ຖືກຕ້ອງ: ແທັກ `{ $tag }` ບໍ່ໄດ້ຖືກປິດ (ເບິ່ງຄືວ່າຂາດ `>`).

parse-self-closing-tag-name-missing = DoenetML ບໍ່ຖືກຕ້ອງ: ພົບແທັກທີ່ບໍ່ມີຊື່ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ບໍ່ຖືກຕ້ອງ: ແທັກ `{ $tag }` ບໍ່ໄດ້ຖືກປິດ (ເບິ່ງຄືວ່າຂາດ `/>`).

parse-tag-invalid-attributes = DoenetML ບໍ່ຖືກຕ້ອງ: ແທັກ `{ $tag }` ບໍ່ຖືກຕ້ອງ. ມັນອາດມີແອັດທຣິບິວທີ່ຜິດ.

parse-close-tag-name-missing = DoenetML ບໍ່ຖືກຕ້ອງ: ພົບແທັກປິດທີ່ບໍ່ມີຊື່ ເຊັ່ນ `</`

parse-attribute-value-unquoted = ຄ່າແອັດທຣິບິວຕ້ອງຢູ່ໃນເຄື່ອງໝາຍວົງຢືມ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ບໍ່ຖືກຕ້ອງ: ພົບແທັກປິດ `{ $tag }` ແຕ່ບໍ່ມີແທັກເປີດທີ່ກົງກັນ

parse-close-tag-mismatched = DoenetML ບໍ່ຖືກຕ້ອງ: ແທັກປິດບໍ່ກົງກັນ. ຕ້ອງການ `</{ $expected }>` ແຕ່ພົບ `{ $found }`

parser-node-unconvertible = ບໍ່ສາມາດແປງໂນດ { $node } ເປັນໂນດ Dast ໄດ້.

## Names

name-attribute-invalid =
    ແອັດທຣິບິວ name='{ $name }' ບໍ່ຖືກຕ້ອງ. { $reason ->
        [characters] ຊື່ສາມາດມີໄດ້ພຽງຕົວອັກສອນ, ຕົວເລກ, ຂີດລຸ່ມ ຫຼື ຂີດກາງ.
       *[start] ຊື່ຕ້ອງຂຶ້ນຕົ້ນດ້ວຍຕົວອັກສອນ.
    }

component-name-invalid-start = ຊື່ອົງປະກອບ "{ $name }" ບໍ່ຖືກຕ້ອງ. ຊື່ຕ້ອງຂຶ້ນຕົ້ນດ້ວຍຕົວອັກສອນ.

## `<answer>` sugar

answer-video-watched-missing-video = answer ຊະນິດ videoWatched ຕ້ອງມີແອັດທຣິບິວ video

answer-video-watched-video-not-reference = answer ຊະນິດ videoWatched ຕ້ອງມີແອັດທຣິບິວ video ທີ່ເປັນການອ້າງອີງ

answer-name-not-single-text = ແອັດທຣິບິວ name ຂອງ answer ຕ້ອງມີລູກເປັນຂໍ້ຄວາມດຽວ

## Referencing another document

external-doenetml-recursion-limit = ບໍ່ສາມາດດຶງ DoenetML ພາຍນອກໄດ້ ເພາະມີການເອີ້ນຊ້ຳຫຼາຍຊັ້ນເກີນໄປ. ມີການອ້າງອີງເປັນວົງຈອນບໍ?

external-doenetml-unavailable = ບໍ່ສາມາດດຶງ DoenetML ຈາກ { $attribute }="{ $uri }" ໄດ້

external-doenetml-type-mismatch = DoenetML ທີ່ດຶງມາຈາກ { $attribute }="{ $uri }" ບໍ່ຖືກຕ້ອງ: ມັນບໍ່ກົງກັບຊະນິດອົງປະກອບ "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ແອັດທຣິບິວ `{ $from }` ເລີກໃຊ້ແລ້ວ; ໃຫ້ໃຊ້ `{ $to }` ແທນ.
       *[other] [deprecation] ແອັດທຣິບິວ `{ $from }` ເທິງ `<{ $component }>` ເລີກໃຊ້ແລ້ວ; ໃຫ້ໃຊ້ `{ $to }` ແທນ.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] ແອັດທຣິບິວ `{ $from }` ເລີກໃຊ້ແລ້ວ ແລະ ຖືກລະເລີຍ ເພາະໄດ້ກຳນົດ `{ $to }` ນຳ.
       *[other] [deprecation] ແອັດທຣິບິວ `{ $from }` ເທິງ `<{ $component }>` ເລີກໃຊ້ແລ້ວ ແລະ ຖືກລະເລີຍ ເພາະໄດ້ກຳນົດ `{ $to }` ນຳ.
    }

deprecated-attribute-ignored = [deprecation] ແອັດທຣິບິວ `{ $attribute }` ເທິງ `<{ $component }>` ເລີກໃຊ້ແລ້ວ ແລະ ຖືກລະເລີຍ.


## Language coverage

pluralize-english-only = `<pluralize>` ສາມາດປ່ຽນເປັນຮູບພະຫຸພົດໄດ້ພຽງພາສາອັງກິດ ດັ່ງນັ້ນຂໍ້ຄວາມຂອງມັນຈຶ່ງບໍ່ຖືກປ່ຽນ ໃນເອກະສານທີ່ຂຽນເປັນ { $locale }. ໃຫ້ຂຽນຮູບພະຫຸພົດໂດຍກົງ ຫຼື ກຳນົດມັນດ້ວຍແອັດທຣິບິວ `pluralForm`.


## Checking against the schema

schema-element-unrecognized = ອົງປະກອບ `<{ $tag }>` ບໍ່ແມ່ນອົງປະກອບ Doenet ທີ່ຮູ້ຈັກ.

schema-element-not-allowed-at-root = ອົງປະກອບ `<{ $tag }>` ບໍ່ອະນຸຍາດຢູ່ຮາກຂອງເອກະສານ.

schema-element-not-allowed-inside = ອົງປະກອບ `<{ $tag }>` ບໍ່ອະນຸຍາດຢູ່ພາຍໃນ `<{ $parent }>`.

schema-attribute-unrecognized = ອົງປະກອບ `<{ $tag }>` ບໍ່ມີແອັດທຣິບິວຊື່ `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] ແອັດທຣິບິວ `{ $attribute }` ຂອງອົງປະກອບ `<{ $tag }>` ຕ້ອງເປັນລາຍການທີ່ແຕ່ລະລາຍການເປັນໜຶ່ງໃນ: { $allowed }
       *[other] ແອັດທຣິບິວ `{ $attribute }` ຂອງອົງປະກອບ `<{ $tag }>` ຕ້ອງເປັນໜຶ່ງໃນ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = ຊື່ variant ບໍ່ຖືກຕ້ອງສຳລັບ select. ຊື່ variant { $variantName } ປາກົດໃນ { $numOptions } option ແຕ່ຈຳນວນທີ່ຕ້ອງເລືອກແມ່ນ { $numToSelect }.

select-variant-name-without-options = ມີການກຳນົດ variant ບາງອັນສຳລັບ select ແຕ່ບໍ່ມີ option ສຳລັບຊື່ variant ທີ່ເປັນໄປໄດ້: { $variantName }.

select-variant-name-not-possible = ຊື່ variant { $variantName } ທີ່ກຳນົດສຳລັບ select ບໍ່ແມ່ນຊື່ variant ທີ່ເປັນໄປໄດ້.

select-too-few-options = ບໍ່ສາມາດເລືອກ { $numToSelect } ອົງປະກອບ ຈາກພຽງ { $numOptions } ໄດ້.

select-from-sequence-too-few-values = ບໍ່ສາມາດເລືອກ { $numToSelect } ຄ່າ ຈາກລຳດັບຄວາມຍາວ { $length } ໄດ້.

select-from-sequence-indices-count-mismatch = ຈຳນວນ indices ທີ່ກຳນົດສຳລັບ select ຕ້ອງເທົ່າກັບຈຳນວນທີ່ຕ້ອງເລືອກ

select-from-sequence-indices-not-integers = indices ທັງໝົດທີ່ກຳນົດສຳລັບ select ຕ້ອງເປັນຈຳນວນເຕັມ

select-from-sequence-index-excluded = index ທີ່ກຳນົດສຳລັບ selectfromsequence ຖືກຕັດອອກ

select-from-sequence-indices-excluded-combination = indices ທີ່ກຳນົດສຳລັບ selectfromsequence ເປັນການລວມທີ່ຖືກຕັດອອກ

select-from-sequence-coprime-not-positive-integers = ບໍ່ສາມາດເລືອກການລວມທີ່ເປັນເສດສ່ວນເສີມກັນໄດ້ ເພາະບໍ່ໄດ້ເລືອກຈຳນວນເຕັມບວກ.

select-from-sequence-coprime-common-factor = ບໍ່ສາມາດເລືອກຕົວເລກທີ່ເປັນເສດສ່ວນເສີມກັນໄດ້. ຄ່າທີ່ເປັນໄປໄດ້ທັງໝົດມີຕົວປະກອບຮ່ວມ. (ຄ່າ "from" ຫຼື "to" ທີ່ກຳນົດຕ້ອງເປັນເສດສ່ວນເສີມກັນກັບ "step".)

select-from-sequence-coprime-single-number = ບໍ່ສາມາດເລືອກການລວມທີ່ເປັນເສດສ່ວນເສີມກັນຈາກຕົວເລກດຽວທີ່ບໍ່ແມ່ນ 1 ໄດ້.

select-from-sequence-excluded-too-many-combinations = ຕັດອອກຫຼາຍກວ່າ 70% ຂອງການລວມໃນ selectFromSequence

select-from-sequence-coprime-none-found = ບໍ່ສາມາດເລືອກຕົວເລກທີ່ເປັນເສດສ່ວນເສີມກັນໄດ້. ຄ່າທີ່ເປັນໄປໄດ້ທັງໝົດມີຕົວປະກອບຮ່ວມ.

select-from-sequence-too-few-unique-values = ບໍ່ສາມາດເລືອກ { $numToSelect } ຄ່າທີ່ບໍ່ຊ້ຳກັນ ຈາກລຳດັບຄວາມຍາວ { $numPossibleValues } ໄດ້

select-prime-numbers-too-few-values = ບໍ່ສາມາດເລືອກ { $numToSelect } ຄ່າ ຈາກລາຍການຈຳນວນເສີມທີ່ມີຄວາມຍາວ { $numValues } ໄດ້

select-prime-numbers-values-count-mismatch = ຈຳນວນຄ່າທີ່ກຳນົດສຳລັບ select ຕ້ອງເທົ່າກັບຈຳນວນທີ່ຕ້ອງເລືອກ

select-prime-numbers-values-not-prime = ຄ່າທັງໝົດທີ່ກຳນົດສຳລັບ select ຈຳນວນເສີມ ຕ້ອງຢູ່ໃນລາຍການຈຳນວນເສີມ

select-prime-numbers-values-excluded-combination = ຄ່າທີ່ກຳນົດສຳລັບ selectPrimeNumbers ເປັນການລວມທີ່ຖືກຕັດອອກ

select-prime-numbers-excluded-too-many-combinations = ຕັດອອກຫຼາຍກວ່າ 70% ຂອງການລວມໃນ selectPrimeNumbers

select-random-combination-fluke = ດ້ວຍເຫດບັງເອີນທີ່ຫາຍາກທີ່ສຸດ ບໍ່ສາມາດເລືອກການລວມຂອງຄ່າແບບສຸ່ມໄດ້

select-random-value-fluke = ດ້ວຍເຫດບັງເອີນທີ່ຫາຍາກທີ່ສຸດ ບໍ່ສາມາດເລືອກຄ່າແບບສຸ່ມໄດ້
