# Traditional Chinese editor and language-server surfaces. Translated from
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
# Taiwan usage where it diverges from the mainland's: 預設值 not 默认值,
# 說明 not 帮助, 元件 not 组件, 參照 not 引用, 游標 not 光标, 陣列 not 数组,
# 座標 not 坐标, 清單 not 列表, 程式碼 not 代码, 重設 not 重置. A line of
# source text stays 行, as it is in both.
#
# Chinese has a single plural category, so a countable message needs no
# selection — `[other]` covers every count.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] 重設
       *[update] 更新
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word }預覽
       *[other] { $word }預覽 { $shortcut }
    }


## The variant picker

editor-variant = 變體
editor-variant-filter = 篩選……
editor-variant-next = 選擇下一個變體
editor-variant-previous = 選擇上一個變體


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] 發現違反 WCAG AA 無障礙標準的問題。點擊以{ $action ->
            [close] 關閉
           *[open] 開啟
        }無障礙報告。
        [advisories] 點擊以{ $action ->
            [close] 關閉
           *[open] 開啟
        }無障礙報告。未發現違反 WCAG AA 的問題，但有其他無障礙建議。
       *[clean] 點擊以{ $action ->
            [close] 關閉
           *[open] 開啟
        }無障礙報告。未發現無障礙問題。
    }

editor-accessibility-label =
    { $status ->
        [violations] 發現違反 WCAG AA 無障礙標準的問題。共發現 { $count } 項 WCAG AA 違規。點擊以{ $action ->
            [close] 關閉
           *[open] 開啟
        }無障礙報告。
        [advisories] 未發現違反 WCAG AA 的問題。共發現 { $count } 項其他無障礙建議。點擊以{ $action ->
            [close] 關閉
           *[open] 開啟
        }無障礙報告。
       *[clean] 未發現違反 WCAG AA 的問題。點擊以{ $action ->
            [close] 關閉
           *[open] 開啟
        }無障礙報告。
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML 版本 { $version }

editor-tab-help = 情境說明
editor-tab-help-short = 情境
editor-tab-errors = 錯誤
editor-tab-warnings = 警告
editor-tab-info = 資訊
editor-tab-accessibility = 無障礙
editor-tab-responses = 已提交的作答

editor-tab-with-count = { $label }：{ $count }

editor-options = 編輯器選項
editor-format-as-doenetml = 依 DoenetML 格式化
editor-format-as-xml = 依 XML 格式化


## The diagnostics panel

editor-diagnostic-line = 第 { $line } 行

editor-no-errors = 沒有錯誤
editor-no-warnings = 沒有警告
editor-no-info = 沒有資訊類診斷

editor-show-info-annotations = 在編輯器中顯示資訊類診斷
editor-show-accessibility-annotations = 在編輯器中顯示無障礙診斷

editor-accessibility-learn-more = 了解 Doenet 如何看待無障礙

editor-accessibility-violations-heading = 無障礙違規（{ $standard }）

editor-accessibility-other-heading = 其他無障礙問題
editor-none-found = 未找到任何項目


## Submitted responses

editor-no-responses = 尚無已提交的作答
editor-response-answer-id = 答案 Id
editor-response-response = 作答
editor-response-credit = 得分
editor-response-submitted = 提交時間


## The context-help panel

help-placeholder = 將游標放在標籤名稱、屬性或 { $ref } 上以檢視說明文件。

help-unsupported-ref-chain = 尚未支援 { $example } 這類多段參照的說明。

help-unresolved-ref =
    { $reason ->
        [notFound] 未找到該參照所指的對象：{ $ref }。
        [multiple] 該參照指向了多個對象：{ $ref }。
       *[indeterminate] 無法確定 { $ref } 所指的對象。
    }

help-learn-about-references = 了解參照 →
help-reference-page = 參考頁面 →

help-suggestions-header =
    { $location ->
        [inside] 在 { $element } 內部
       *[top] 在頂層
    }{ $allowed ->
        [none] { "——這裡不能放任何內容。" }
        [text] { "——可以在這裡輸入文字。" }
        [text-and-components] { "——可以在這裡輸入文字，或試試：" }
       *[components] { "——可以試試：" }
    }

help-suggestions-footer = 按 { $shortcut } 檢視全部 { $total } 個元件。

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } 是對 { $target } 的參照。
       *[other] { $ref } 是對 { $target } 的參照（第 { $line } 行）。
    }

help-ref-derived-from =
    { $line ->
        [none] 由 { $owner } 以 { $role } 的形式引入。
       *[other] 由 { $owner } 在第 { $line } 行以 { $role } 的形式引入。
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } 是對 { $element } 的 { $property } 屬性的參照。
       *[other] { $ref } 是對 { $element } 的 { $property } 屬性的參照（第 { $line } 行）。
    }

help-kind-attribute = 屬性
help-kind-snippet = 程式碼片段
help-kind-array-entry = 陣列項目

help-default = 預設值：
help-active-default = 生效的預設值：

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] 允許的值（每項一個）：
       *[other] 允許的值：
    }

help-suggested-values = 建議的值：

help-inserts = 插入：

help-coordinates = 座標：

help-type = 類型：

help-resolved-style = 解析後的樣式（styleNumber { $styleNumber }）：

help-resolved-function-names = 解析後的函數名稱：
help-reset-list = 此輸入的重設清單：
help-added-on-input = 在此輸入上新增：
help-removed-on-input = 在此輸入上移除：

help-reset-overrides = { $reset } 優先於 { $additional } 和 { $removed }。
