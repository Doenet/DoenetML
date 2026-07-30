# Chinese editor and language-server surfaces. Translated from
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
# Chinese has a single plural category, so a countable message needs no
# selection — `[other]` covers every count.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] 重置
       *[update] 更新
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word }预览
       *[other] { $word }预览 { $shortcut }
    }


## The variant picker

editor-variant = 变体
editor-variant-filter = 筛选……
editor-variant-next = 选择下一个变体
editor-variant-previous = 选择上一个变体


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] 发现违反 WCAG AA 无障碍标准的问题。点击以{ $action ->
            [close] 关闭
           *[open] 打开
        }无障碍报告。
        [advisories] 点击以{ $action ->
            [close] 关闭
           *[open] 打开
        }无障碍报告。未发现违反 WCAG AA 的问题，但有其他无障碍建议。
       *[clean] 点击以{ $action ->
            [close] 关闭
           *[open] 打开
        }无障碍报告。未发现无障碍问题。
    }

editor-accessibility-label =
    { $status ->
        [violations] 发现违反 WCAG AA 无障碍标准的问题。共发现 { $count } 项 WCAG AA 违规。点击以{ $action ->
            [close] 关闭
           *[open] 打开
        }无障碍报告。
        [advisories] 未发现违反 WCAG AA 的问题。共发现 { $count } 项其他无障碍建议。点击以{ $action ->
            [close] 关闭
           *[open] 打开
        }无障碍报告。
       *[clean] 未发现违反 WCAG AA 的问题。点击以{ $action ->
            [close] 关闭
           *[open] 打开
        }无障碍报告。
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML 版本 { $version }

editor-tab-help = 上下文帮助
editor-tab-help-short = 上下文
editor-tab-errors = 错误
editor-tab-warnings = 警告
editor-tab-info = 信息
editor-tab-accessibility = 无障碍
editor-tab-responses = 已提交的回答

editor-tab-with-count = { $label }：{ $count }

editor-options = 编辑器选项
editor-format-as-doenetml = 按 DoenetML 格式化
editor-format-as-xml = 按 XML 格式化


## The diagnostics panel

editor-diagnostic-line = 第 { $line } 行

editor-no-errors = 没有错误
editor-no-warnings = 没有警告
editor-no-info = 没有信息类诊断

editor-show-info-annotations = 在编辑器中显示信息类诊断
editor-show-accessibility-annotations = 在编辑器中显示无障碍诊断

editor-accessibility-learn-more = 了解 Doenet 如何对待无障碍

editor-accessibility-violations-heading = 无障碍违规（{ $standard }）

editor-accessibility-other-heading = 其他无障碍问题
editor-none-found = 未找到任何内容


## Submitted responses

editor-no-responses = 尚无已提交的回答
editor-response-answer-id = 答案 Id
editor-response-response = 回答
editor-response-credit = 得分
editor-response-submitted = 提交时间


## The context-help panel

help-placeholder = 将光标放在标签名、属性或 { $ref } 上以查看文档。

help-unsupported-ref-chain = 暂不支持 { $example } 这类多段引用的帮助。

help-unresolved-ref =
    { $reason ->
        [notFound] 未找到该引用所指的对象：{ $ref }。
        [multiple] 该引用指向了多个对象：{ $ref }。
       *[indeterminate] 无法确定 { $ref } 所指的对象。
    }

help-learn-about-references = 了解引用 →
help-reference-page = 参考页面 →

help-suggestions-header =
    { $location ->
        [inside] 在 { $element } 内部
       *[top] 在顶层
    }{ $allowed ->
        [none] { "——这里不能放任何内容。" }
        [text] { "——可以在这里输入文本。" }
        [text-and-components] { "——可以在这里输入文本，或试试：" }
       *[components] { "——可以试试：" }
    }

help-suggestions-footer = 按 { $shortcut } 查看全部 { $total } 个组件。

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } 是对 { $target } 的引用。
       *[other] { $ref } 是对 { $target } 的引用（第 { $line } 行）。
    }

help-ref-derived-from =
    { $line ->
        [none] 由 { $owner } 以 { $role } 的形式引入。
       *[other] 由 { $owner } 在第 { $line } 行以 { $role } 的形式引入。
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } 是对 { $element } 的 { $property } 属性的引用。
       *[other] { $ref } 是对 { $element } 的 { $property } 属性的引用（第 { $line } 行）。
    }

help-kind-attribute = 属性
help-kind-snippet = 代码片段
help-kind-array-entry = 数组项

help-default = 默认值：
help-active-default = 生效的默认值：

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] 允许的值（每项一个）：
       *[other] 允许的值：
    }

help-suggested-values = 建议的值：

help-inserts = 插入：

help-coordinates = 坐标：

help-type = 类型：

help-resolved-style = 解析后的样式（styleNumber { $styleNumber }）：

help-resolved-function-names = 解析后的函数名：
help-reset-list = 此输入的重置列表：
help-added-on-input = 在此输入上新增：
help-removed-on-input = 在此输入上移除：

help-reset-overrides = { $reset } 优先于 { $additional } 和 { $removed }。
