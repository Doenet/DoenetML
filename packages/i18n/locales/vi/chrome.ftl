# Vietnamese viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Vietnamese has a single plural category, so a countable message needs no
# selection — `[other]` covers every count. `[0]` is still spelled out where
# the English wording changes for zero, because that is a different sentence
# rather than a different number.
#
# Nouns are not marked for number, so `{ $count } lượt thử` is both "1 attempt"
# and "5 attempts"; a classifier is used where the noun needs one to be counted.


## Answer submission

answer-checking = Đang kiểm tra...
answer-submitting = Đang gửi...
answer-checking-status = Đang kiểm tra câu trả lời
answer-submitting-status = Đang gửi câu trả lời
answer-correct = Đúng
answer-incorrect = Sai
answer-response-saved = Đã lưu câu trả lời
answer-percent-credit = { $percent }% điểm
answer-percent-correct = { $percent }% đúng
answer-percent-short = { $percent }%
max-credit-available = Điểm tối đa có thể đạt: { $percent }%
attempts-remaining =
    { $count ->
        [0] không còn lượt thử nào
       *[other] còn { $count } lượt thử
    }
validation-correct = (Đúng)
validation-incorrect = (Sai)
validation-partially-correct = (Đúng một phần)
answer-show-responses = Hiển thị { $count } câu trả lời cho { $answerId }

## Disclosure panels

feedback-heading = Phản hồi
collapsible-click-to-open = (nhấn để mở)
collapsible-click-to-close = (nhấn để đóng)
collapsible-initializing = Đang khởi tạo...
footnote-show = Hiện chú thích
footnote-hide = Ẩn chú thích
description-more-information = thêm thông tin

## Controls

slider-previous = Trước
slider-next = Sau
keyboard-open = Mở bàn phím
keyboard-close = Đóng bàn phím
choice-input-remove-choice = Xóa { $choice }
matrix-remove-row = Xóa hàng
matrix-add-row = Thêm hàng
matrix-remove-column = Xóa cột
matrix-add-column = Thêm cột
subset-add-remove-points = Thêm/Xóa điểm
subset-toggle-points-intervals = Chuyển giữa điểm và khoảng
subset-move-points = Di chuyển điểm
subset-clear = Xóa hết
# A `box` here is one orbital, drawn as a square: ô.
orbital-add-row = Thêm hàng
orbital-remove-row = Xóa hàng
orbital-add-box = Thêm ô
orbital-remove-box = Xóa ô
orbital-add-up-arrow = Thêm mũi tên lên
orbital-add-down-arrow = Thêm mũi tên xuống
orbital-remove-arrow = Xóa mũi tên
orbital-row-label = Nhãn cho hàng { $row }
pretzel-answer = Đáp án

## Math input

math-input-preview-region = xem trước biểu thức toán
math-input-preview = Xem trước
math-input-invalid-expression = Biểu thức không hợp lệ:

## Document status

viewer-initializing = Đang khởi tạo...

## Errors

error-heading = Lỗi
error-found-at =
    { $span ->
        [line] Tìm thấy ở dòng { $startLine }.
       *[lines] Tìm thấy ở các dòng { $startLine }–{ $endLine }.
    }
document-contains-errors = Tài liệu này có lỗi!
diagnostic-heading-error = Lỗi
diagnostic-heading-warning = Cảnh báo
diagnostic-heading-information = Thông tin
diagnostic-heading-hint = Gợi ý
accessibility-heading-level-1 = Vi phạm khả năng tiếp cận WCAG AA
accessibility-heading-level-2 = Cảnh báo về khả năng tiếp cận
something-went-wrong = Đã xảy ra lỗi.
renderer-load-failed = một bộ hiển thị không tải được. Vui lòng tải lại trang.
core-start-failed = Không thể khởi động trình xem tài liệu. Vui lòng tải lại trang.
