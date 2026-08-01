# Vietnamese editor and language-server surfaces. Translated from
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
# Vietnamese has a single plural category, so a countable message needs no
# selection — `[other]` covers every count.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Đặt lại
       *[update] Cập nhật
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } trình xem
       *[other] { $word } trình xem { $shortcut }
    }


## The variant picker

editor-variant = Biến thể
editor-variant-filter = Lọc...
editor-variant-next = Chọn biến thể tiếp theo
editor-variant-previous = Chọn biến thể trước đó


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Đã phát hiện vi phạm khả năng tiếp cận WCAG AA. Nhấn để { $action ->
            [close] đóng
           *[open] mở
        } báo cáo khả năng tiếp cận.
        [advisories] Nhấn để { $action ->
            [close] đóng
           *[open] mở
        } báo cáo khả năng tiếp cận. Không có vi phạm WCAG AA nào, nhưng có thêm khuyến nghị về khả năng tiếp cận.
       *[clean] Nhấn để { $action ->
            [close] đóng
           *[open] mở
        } báo cáo khả năng tiếp cận. Không tìm thấy vấn đề nào về khả năng tiếp cận.
    }

editor-accessibility-label =
    { $status ->
        [violations] Đã phát hiện vi phạm khả năng tiếp cận WCAG AA. Tìm thấy { $count } vi phạm WCAG AA. Nhấn để { $action ->
            [close] đóng
           *[open] mở
        } báo cáo khả năng tiếp cận.
        [advisories] Không có vi phạm WCAG AA nào. Tìm thấy { $count } khuyến nghị bổ sung về khả năng tiếp cận. Nhấn để { $action ->
            [close] đóng
           *[open] mở
        } báo cáo khả năng tiếp cận.
       *[clean] Không có vi phạm WCAG AA nào. Nhấn để { $action ->
            [close] đóng
           *[open] mở
        } báo cáo khả năng tiếp cận.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML phiên bản { $version }

editor-tab-help = Trợ giúp theo ngữ cảnh
editor-tab-help-short = Ngữ cảnh
editor-tab-errors = Lỗi
editor-tab-warnings = Cảnh báo
editor-tab-info = Thông tin
editor-tab-accessibility = Khả năng tiếp cận
editor-tab-responses = Câu trả lời đã gửi

editor-tab-with-count = { $label }: { $count }

editor-options = Tùy chọn trình soạn thảo
editor-format-as-doenetml = Định dạng theo DoenetML
editor-format-as-xml = Định dạng theo XML


## The diagnostics panel

editor-diagnostic-line = Dòng #{ $line }

editor-no-errors = Không có lỗi
editor-no-warnings = Không có cảnh báo
editor-no-info = Không có chẩn đoán thông tin

editor-show-info-annotations = Hiện chẩn đoán thông tin trong trình soạn thảo
editor-show-accessibility-annotations = Hiện chẩn đoán khả năng tiếp cận trong trình soạn thảo

editor-accessibility-learn-more = Tìm hiểu quan điểm của Doenet về khả năng tiếp cận

editor-accessibility-violations-heading = Vi phạm khả năng tiếp cận ({ $standard })

editor-accessibility-other-heading = Các vấn đề khác về khả năng tiếp cận
editor-none-found = Không tìm thấy mục nào


## Submitted responses

editor-no-responses = Chưa có câu trả lời nào được gửi
editor-response-answer-id = Id câu trả lời
editor-response-response = Câu trả lời
editor-response-credit = Điểm
editor-response-submitted = Đã gửi


## The context-help panel

help-placeholder = Đặt con trỏ lên tên thẻ, thuộc tính hoặc { $ref } để xem tài liệu.

help-unsupported-ref-chain = Chưa hỗ trợ trợ giúp cho tham chiếu nhiều phần như { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Không tìm thấy đối tượng cho tham chiếu: { $ref }.
        [multiple] Tìm thấy nhiều đối tượng cho tham chiếu: { $ref }.
       *[indeterminate] Không xác định được đối tượng cho { $ref }.
    }

help-learn-about-references = Tìm hiểu về tham chiếu →
help-reference-page = Trang tham khảo →

help-suggestions-header =
    { $location ->
        [inside] Bên trong { $element }
       *[top] Ở cấp cao nhất
    }{ $allowed ->
        [none] { " — không đặt được gì ở đây." }
        [text] { " — có thể nhập văn bản ở đây." }
        [text-and-components] { " — có thể nhập văn bản ở đây, hoặc thử:" }
       *[components] { " — có thể thử:" }
    }

help-suggestions-footer = Nhấn { $shortcut } để xem tất cả { $total } thành phần.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } là tham chiếu đến { $target }.
       *[other] { $ref } là tham chiếu đến { $target } (dòng { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Được { $owner } đưa vào với vai trò { $role }.
       *[other] Được { $owner } đưa vào ở dòng { $line } với vai trò { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } là tham chiếu đến thuộc tính { $property } của { $element }.
       *[other] { $ref } là tham chiếu đến thuộc tính { $property } của { $element } (dòng { $line }).
    }

help-kind-attribute = thuộc tính
help-kind-snippet = đoạn mã
help-kind-array-entry = phần tử mảng

help-default = Mặc định:
help-active-default = Mặc định đang áp dụng:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Giá trị cho phép (mỗi mục một giá trị):
       *[other] Giá trị cho phép:
    }

help-suggested-values = Giá trị gợi ý:

help-inserts = Chèn:

help-coordinates = Tọa độ:

help-type = Kiểu:

help-resolved-style = Kiểu đã phân giải (styleNumber { $styleNumber }):

help-resolved-function-names = Tên hàm đã phân giải:
help-reset-list = Danh sách đặt lại cho đầu vào này:
help-added-on-input = Được thêm vào đầu vào này:
help-removed-on-input = Được loại khỏi đầu vào này:

help-reset-overrides = { $reset } được ưu tiên hơn { $additional } và { $removed }.
