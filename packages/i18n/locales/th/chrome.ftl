# Thai viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Thai has a single plural category, so a countable message needs no selection —
# `[other]` covers every count. `[0]` is still spelled out where the English
# wording changes for zero, because that is a different sentence rather than a
# different number.
#
# Nouns are not marked for number, so «{ $count } ครั้ง» is both "1 attempt" and
# "5 attempts"; the classifier ครั้ง is what counts them.
#
# Numbers render in Latin digits rather than in Thai numerals, which is the
# digit policy in the package README (#1615).


## Answer submission

answer-checking = กำลังตรวจ...
answer-submitting = กำลังส่ง...
answer-checking-status = กำลังตรวจคำตอบ
answer-submitting-status = กำลังส่งคำตอบ
answer-correct = ถูก
answer-incorrect = ผิด
answer-response-saved = บันทึกคำตอบแล้ว
answer-percent-credit = { $percent }% ของคะแนน
answer-percent-correct = { $percent }% ถูก
answer-percent-short = { $percent }%
max-credit-available = คะแนนสูงสุดที่ทำได้: { $percent }%
attempts-remaining =
    { $count ->
        [0] ไม่เหลือโอกาสตอบ
       *[other] เหลืออีก { $count } ครั้ง
    }
validation-correct = (ถูก)
validation-incorrect = (ผิด)
validation-partially-correct = (ถูกบางส่วน)
answer-show-responses = แสดงคำตอบ { $count } รายการของ { $answerId }

## Disclosure panels

feedback-heading = ผลตอบกลับ
collapsible-click-to-open = (คลิกเพื่อเปิด)
collapsible-click-to-close = (คลิกเพื่อปิด)
collapsible-initializing = กำลังเริ่มต้น...
footnote-show = แสดงเชิงอรรถ
footnote-hide = ซ่อนเชิงอรรถ
description-more-information = ข้อมูลเพิ่มเติม

## Controls

slider-previous = ก่อนหน้า
slider-next = ถัดไป
keyboard-open = เปิดแป้นพิมพ์
keyboard-close = ปิดแป้นพิมพ์
choice-input-remove-choice = เอา { $choice } ออก
matrix-remove-row = ลบแถว
matrix-add-row = เพิ่มแถว
matrix-remove-column = ลบหลัก
matrix-add-column = เพิ่มหลัก
subset-add-remove-points = เพิ่ม/ลบจุด
subset-toggle-points-intervals = สลับระหว่างจุดกับช่วง
subset-move-points = ย้ายจุด
subset-clear = ล้าง
# A `box` here is one orbital, drawn as a square: ช่อง.
orbital-add-row = เพิ่มแถว
orbital-remove-row = ลบแถว
orbital-add-box = เพิ่มช่อง
orbital-remove-box = ลบช่อง
orbital-add-up-arrow = เพิ่มลูกศรขึ้น
orbital-add-down-arrow = เพิ่มลูกศรลง
orbital-remove-arrow = ลบลูกศร
orbital-row-label = ชื่อของแถวที่ { $row }
pretzel-answer = คำตอบ

## Math input

math-input-preview-region = ตัวอย่างนิพจน์คณิตศาสตร์
math-input-preview = ตัวอย่าง
math-input-invalid-expression = นิพจน์ไม่ถูกต้อง:

## Document status

viewer-initializing = กำลังเริ่มต้น...

## Errors

error-heading = ข้อผิดพลาด
error-found-at =
    { $span ->
        [line] พบที่บรรทัด { $startLine }
       *[lines] พบที่บรรทัด { $startLine }–{ $endLine }
    }
document-contains-errors = เอกสารนี้มีข้อผิดพลาด!
diagnostic-heading-error = ข้อผิดพลาด
diagnostic-heading-warning = คำเตือน
diagnostic-heading-information = ข้อมูล
diagnostic-heading-hint = คำใบ้
accessibility-heading-level-1 = การละเมิดการเข้าถึงตาม WCAG AA
accessibility-heading-level-2 = คำเตือนด้านการเข้าถึง
something-went-wrong = เกิดข้อผิดพลาดบางอย่าง
renderer-load-failed = โหลดตัวแสดงผลไม่สำเร็จ กรุณาโหลดหน้านี้ใหม่
core-start-failed = เริ่มต้นตัวแสดงเอกสารไม่สำเร็จ กรุณาโหลดหน้านี้ใหม่
