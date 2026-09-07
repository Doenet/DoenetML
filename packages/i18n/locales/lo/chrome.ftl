# Lao viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Lao has a single plural category, so a countable message needs no selection —
# `[other]` covers every count. `[0]` is still spelled out where the English
# wording changes for zero, because that is a different sentence rather than a
# different number. A noun is not marked for number, so «{ $count } ໂອກາດ» is
# both "1 attempt" and "5 attempts".
#
# Numbers render in Latin digits rather than in Lao numerals, which is the
# digit policy in the package README and what Lao schoolbooks print. Lao does
# group and mark the decimal the continental way — 12.345,6 — and that comes
# from CLDR rather than from anything written here.


## Answer submission

answer-checking = ກຳລັງກວດ...
answer-submitting = ກຳລັງສົ່ງ...
answer-checking-status = ກຳລັງກວດຄຳຕອບ
answer-submitting-status = ກຳລັງສົ່ງຄຳຕອບ
answer-correct = ຖືກຕ້ອງ
answer-incorrect = ບໍ່ຖືກຕ້ອງ
answer-response-saved = ບັນທຶກຄຳຕອບແລ້ວ
answer-percent-credit = ຄະແນນ { $percent }%
answer-percent-correct = ຖືກຕ້ອງ { $percent }%
answer-percent-short = { $percent }%
max-credit-available = ຄະແນນສູງສຸດທີ່ສາມາດໄດ້ຮັບ: { $percent }%
attempts-remaining =
    { $count ->
        [0] ບໍ່ມີໂອກາດເຫຼືອ
       *[other] ເຫຼືອ { $count } ໂອກາດ
    }
validation-correct = (ຖືກຕ້ອງ)
validation-incorrect = (ບໍ່ຖືກຕ້ອງ)
validation-partially-correct = (ຖືກຕ້ອງບາງສ່ວນ)
answer-show-responses = ສະແດງ { $count } ຄຳຕອບທີ່ສົ່ງໃຫ້ { $answerId }

## Disclosure panels

feedback-heading = ຄຳຕິຊົມ
collapsible-click-to-open = (ຄລິກເພື່ອເປີດ)
collapsible-click-to-close = (ຄລິກເພື່ອປິດ)
collapsible-initializing = ກຳລັງເລີ່ມຕົ້ນ...
footnote-show = ສະແດງໝາຍເຫດທ້າຍໜ້າ
footnote-hide = ເຊື່ອງໝາຍເຫດທ້າຍໜ້າ
description-more-information = ຂໍ້ມູນເພີ່ມເຕີມ

## Controls

slider-previous = ກ່ອນໜ້າ
slider-next = ຕໍ່ໄປ
keyboard-open = ເປີດແປ້ນພິມ
keyboard-close = ປິດແປ້ນພິມ
choice-input-remove-choice = ເອົາ { $choice } ອອກ
matrix-remove-row = ລຶບແຖວ
matrix-add-row = ເພີ່ມແຖວ
matrix-remove-column = ລຶບຖັນ
matrix-add-column = ເພີ່ມຖັນ
subset-add-remove-points = ເພີ່ມ/ລຶບຈຸດ
subset-toggle-points-intervals = ສະຫຼັບລະຫວ່າງຈຸດ ແລະ ຊ່ວງ
subset-move-points = ຍ້າຍຈຸດ
subset-clear = ລຶບລ້າງ
orbital-add-row = ເພີ່ມແຖວ
orbital-remove-row = ລຶບແຖວ
orbital-add-box = ເພີ່ມກ່ອງ
orbital-remove-box = ລຶບກ່ອງ
orbital-add-up-arrow = ເພີ່ມລູກສອນຂຶ້ນ
orbital-add-down-arrow = ເພີ່ມລູກສອນລົງ
orbital-remove-arrow = ລຶບລູກສອນ
orbital-row-label = ປ້າຍສຳລັບແຖວທີ { $row }
pretzel-answer = ຄຳຕອບ

## Math input

math-input-preview-region = ການເບິ່ງຕົວຢ່າງນິພົນຄະນິດສາດ
math-input-preview = ເບິ່ງຕົວຢ່າງ
math-input-invalid-expression = ນິພົນບໍ່ຖືກຕ້ອງ:

## Document status

viewer-initializing = ກຳລັງເລີ່ມຕົ້ນ...

## Errors

error-heading = ຂໍ້ຜິດພາດ
error-found-at =
    { $span ->
        [line] ພົບຢູ່ແຖວທີ { $startLine }.
       *[lines] ພົບຢູ່ແຖວທີ { $startLine }–{ $endLine }.
    }
document-contains-errors = ເອກະສານນີ້ມີຂໍ້ຜິດພາດ!
diagnostic-heading-error = ຂໍ້ຜິດພາດ
diagnostic-heading-warning = ຄຳເຕືອນ
diagnostic-heading-information = ຂໍ້ມູນ
diagnostic-heading-hint = ຄຳໃບ້
accessibility-heading-level-1 = ການລະເມີດການເຂົ້າເຖິງ WCAG AA
accessibility-heading-level-2 = ການແຈ້ງເຕືອນການເຂົ້າເຖິງ
something-went-wrong = ມີບາງຢ່າງຜິດພາດ.
renderer-load-failed = ໂຕສະແດງຜົນໜຶ່ງໂຫຼດບໍ່ໄດ້. ກະລຸນາໂຫຼດໜ້ານີ້ຄືນໃໝ່.
core-start-failed = ບໍ່ສາມາດເລີ່ມໂຕເບິ່ງເອກະສານໄດ້. ກະລຸນາໂຫຼດໜ້ານີ້ຄືນໃໝ່.
