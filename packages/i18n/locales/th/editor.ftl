# Thai editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Thai has a single plural category, so a countable message needs no selection.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ตั้งใหม่
       *[update] อัปเดต
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word }ตัวแสดงผล
       *[other] { $word }ตัวแสดงผล { $shortcut }
    }


## The variant picker

editor-variant = รูปแบบ
editor-variant-filter = กรอง...
editor-variant-next = เลือกรูปแบบถัดไป
editor-variant-previous = เลือกรูปแบบก่อนหน้า


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] พบการละเมิดการเข้าถึงตาม WCAG AA คลิกเพื่อ{ $action ->
            [close] ปิด
           *[open] เปิด
        }รายงานการเข้าถึง
        [advisories] คลิกเพื่อ{ $action ->
            [close] ปิด
           *[open] เปิด
        }รายงานการเข้าถึง ไม่พบการละเมิด WCAG AA แต่มีข้อเสนอแนะด้านการเข้าถึงเพิ่มเติม
       *[clean] คลิกเพื่อ{ $action ->
            [close] ปิด
           *[open] เปิด
        }รายงานการเข้าถึง ไม่พบปัญหาด้านการเข้าถึง
    }

editor-accessibility-label =
    { $status ->
        [violations] พบการละเมิดการเข้าถึงตาม WCAG AA พบการละเมิด WCAG AA { $count } รายการ คลิกเพื่อ{ $action ->
            [close] ปิด
           *[open] เปิด
        }รายงานการเข้าถึง
        [advisories] ไม่พบการละเมิด WCAG AA พบข้อเสนอแนะด้านการเข้าถึงเพิ่มเติม { $count } รายการ คลิกเพื่อ{ $action ->
            [close] ปิด
           *[open] เปิด
        }รายงานการเข้าถึง
       *[clean] ไม่พบการละเมิด WCAG AA คลิกเพื่อ{ $action ->
            [close] ปิด
           *[open] เปิด
        }รายงานการเข้าถึง
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML รุ่น { $version }

editor-tab-help = ความช่วยเหลือตามบริบท
editor-tab-help-short = บริบท
editor-tab-errors = ข้อผิดพลาด
editor-tab-warnings = คำเตือน
editor-tab-info = ข้อมูล
editor-tab-accessibility = การเข้าถึง
editor-tab-responses = คำตอบที่ส่งแล้ว

editor-tab-with-count = { $label }: { $count }

editor-options = ตัวเลือกตัวแก้ไข
editor-format-as-doenetml = จัดรูปแบบเป็น DoenetML
editor-format-as-xml = จัดรูปแบบเป็น XML


## The diagnostics panel

editor-diagnostic-line = บรรทัด #{ $line }

editor-no-errors = ไม่มีข้อผิดพลาด
editor-no-warnings = ไม่มีคำเตือน
editor-no-info = ไม่มีข้อวินิจฉัยเชิงข้อมูล

editor-show-info-annotations = แสดงข้อวินิจฉัยเชิงข้อมูลในตัวแก้ไข
editor-show-accessibility-annotations = แสดงข้อวินิจฉัยด้านการเข้าถึงในตัวแก้ไข

editor-accessibility-learn-more = เรียนรู้แนวทางด้านการเข้าถึงของ Doenet

editor-accessibility-violations-heading = การละเมิดด้านการเข้าถึง ({ $standard })

editor-accessibility-other-heading = ปัญหาด้านการเข้าถึงอื่น ๆ
editor-none-found = ไม่พบรายการใด


## Submitted responses

editor-no-responses = ยังไม่มีคำตอบที่ส่ง
editor-response-answer-id = Id ของคำตอบ
editor-response-response = คำตอบ
editor-response-credit = คะแนน
editor-response-submitted = ส่งแล้ว


## The context-help panel

help-placeholder = วางเคอร์เซอร์บนชื่อแท็ก แอตทริบิวต์ หรือ { $ref } เพื่อดูเอกสารประกอบ

help-unsupported-ref-chain = ยังไม่รองรับความช่วยเหลือสำหรับการอ้างอิงหลายส่วนอย่าง { $example }

help-unresolved-ref =
    { $reason ->
        [notFound] ไม่พบสิ่งที่การอ้างอิงนี้ชี้ถึง: { $ref }
        [multiple] พบสิ่งที่การอ้างอิงนี้ชี้ถึงหลายรายการ: { $ref }
       *[indeterminate] ระบุสิ่งที่ { $ref } ชี้ถึงไม่ได้
    }

help-learn-about-references = เรียนรู้เรื่องการอ้างอิง →
help-reference-page = หน้าอ้างอิง →

help-suggestions-header =
    { $location ->
        [inside] ภายใน { $element }
       *[top] ที่ระดับบนสุด
    }{ $allowed ->
        [none] { " — ที่นี่ใส่อะไรไม่ได้" }
        [text] { " — พิมพ์ข้อความที่นี่ได้" }
        [text-and-components] { " — พิมพ์ข้อความที่นี่ได้ หรือลองสิ่งเหล่านี้:" }
       *[components] { " — ลองสิ่งเหล่านี้:" }
    }

help-suggestions-footer = กด { $shortcut } เพื่อดูองค์ประกอบทั้งหมด { $total } รายการ

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } เป็นการอ้างอิงถึง { $target }
       *[other] { $ref } เป็นการอ้างอิงถึง { $target } (บรรทัด { $line })
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } นำเข้ามาในฐานะ { $role }
       *[other] { $owner } นำเข้ามาที่บรรทัด { $line } ในฐานะ { $role }
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } เป็นการอ้างอิงถึงสมบัติ { $property } ของ { $element }
       *[other] { $ref } เป็นการอ้างอิงถึงสมบัติ { $property } ของ { $element } (บรรทัด { $line })
    }

help-kind-attribute = แอตทริบิวต์
help-kind-snippet = ส่วนย่อย
help-kind-array-entry = รายการในแถวลำดับ

help-default = ค่าเริ่มต้น:
help-active-default = ค่าเริ่มต้นที่ใช้อยู่:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ค่าที่อนุญาต (หนึ่งค่าต่อหนึ่งรายการ):
       *[other] ค่าที่อนุญาต:
    }

help-suggested-values = ค่าที่แนะนำ:

help-inserts = แทรก:

help-coordinates = พิกัด:

help-type = ชนิด:

help-resolved-style = สไตล์ที่ระบุได้ (styleNumber { $styleNumber }):

help-resolved-function-names = ชื่อฟังก์ชันที่ระบุได้:
help-reset-list = รายการที่ตั้งใหม่บนอินพุตนี้:
help-added-on-input = ที่เพิ่มบนอินพุตนี้:
help-removed-on-input = ที่เอาออกจากอินพุตนี้:

help-reset-overrides = { $reset } มีผลเหนือ { $additional } และ { $removed }
