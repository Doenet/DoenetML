# Traditional Chinese viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Named for the script, not a region: `zh-TW`, `zh-HK` and `zh-MO` all
# negotiate here, and a Hong Kong reader gets Taiwan's wording, which is the
# usual arrangement and the reason to review this against `zh-Hans` rather than
# to split it further. `zh-Hans` is not in this catalog's fallback chain —
# `zh-Hant` negotiates to `["zh-Hant", "en"]` — so a key missing here renders
# in English, never in Simplified.
#
# Wording follows Taiwan usage where it and mainland usage diverge, which is
# more than character conversion. In this file: 資訊 not 信息, 載入 not 加载,
# 儲存 not 保存, 元件 not 组件, 檢視 not 查看. Those are the lines to check
# first when reviewing this against `zh-Hans`.
#
# Rows and columns are the trap. Taiwan writes a table's row as 列 and its
# column as 欄 — the opposite assignment to 行/列 in the mainland — so the
# matrix and orbital controls below read as though row and column had been
# swapped. They have not. A line of *source text* is 行 in both, and stays 行.
#
# Chinese has a single plural category, so a countable message needs no
# selection — `[other]` covers every count. `[0]` is still spelled out where
# the English wording changes for zero, because that is a different sentence
# rather than a different number.
#
# A run of Latin text or digits is set off from the Chinese around it with a
# space — `還剩 { $count } 次嘗試` — while a unit stays tight against the number
# it measures: `{ $percent }%`, never `{ $percent } %`.


## Answer submission

answer-checking = 正在檢查……
answer-submitting = 正在提交……
answer-checking-status = 正在檢查答案
answer-submitting-status = 正在提交答案
answer-correct = 正確
answer-incorrect = 錯誤
answer-response-saved = 作答已儲存
answer-percent-credit = { $percent }% 得分
answer-percent-correct = { $percent }% 正確
answer-percent-short = { $percent }%
max-credit-available = 最高可得分數：{ $percent }%
attempts-remaining =
    { $count ->
        [0] 沒有剩餘的嘗試次數
       *[other] 還剩 { $count } 次嘗試
    }
validation-correct = （正確）
validation-incorrect = （錯誤）
validation-partially-correct = （部分正確）
answer-show-responses = 顯示 { $answerId } 的 { $count } 筆作答

## Disclosure panels

feedback-heading = 回饋
collapsible-click-to-open = （點擊展開）
collapsible-click-to-close = （點擊收合）
collapsible-initializing = 正在初始化……
footnote-show = 顯示註腳
footnote-hide = 隱藏註腳
description-more-information = 更多資訊

## Controls

slider-previous = 上一個
slider-next = 下一個
keyboard-open = 開啟鍵盤
keyboard-close = 關閉鍵盤
choice-input-remove-choice = 刪除 { $choice }
# 列 is the row and 欄 the column — see the note on rows and columns above.
matrix-remove-row = 刪除列
matrix-add-row = 新增列
matrix-remove-column = 刪除欄
matrix-add-column = 新增欄
subset-add-remove-points = 新增/刪除點
subset-toggle-points-intervals = 切換點與區間
subset-move-points = 移動點
subset-clear = 清除
# A `box` here is one orbital, drawn as a square: 方框.
orbital-add-row = 新增列
orbital-remove-row = 刪除列
orbital-add-box = 新增方框
orbital-remove-box = 刪除方框
orbital-add-up-arrow = 新增向上箭頭
orbital-add-down-arrow = 新增向下箭頭
orbital-remove-arrow = 刪除箭頭
orbital-row-label = 第 { $row } 列的標籤
pretzel-answer = 答案

## Math input

math-input-preview-region = 數學式預覽
math-input-preview = 預覽
math-input-invalid-expression = 無效的數學式：

## Document status

viewer-initializing = 正在初始化……

## Errors

error-heading = 錯誤
# A line of source text, which Taiwan counts with 行 exactly as the mainland
# does. Only a table's rows and columns swap — see the note above.
error-found-at =
    { $span ->
        [line] 位於第 { $startLine } 行。
       *[lines] 位於第 { $startLine }–{ $endLine } 行。
    }
document-contains-errors = 本文件包含錯誤！
diagnostic-heading-error = 錯誤
diagnostic-heading-warning = 警告
diagnostic-heading-information = 資訊
diagnostic-heading-hint = 提示
accessibility-heading-level-1 = 違反 WCAG AA 無障礙標準
accessibility-heading-level-2 = 無障礙提醒
something-went-wrong = 發生錯誤。
renderer-load-failed = 某個繪製元件載入失敗。請重新載入頁面。
core-start-failed = 無法啟動文件檢視器。請重新載入頁面。
