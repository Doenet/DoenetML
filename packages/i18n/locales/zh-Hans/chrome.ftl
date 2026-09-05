# Simplified Chinese viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Named for the script, not a region: `zh-CN` and `zh-SG` negotiate here, as
# does a bare `zh`, which is `zh-Hans-CN` once CLDR fills in what it left out.
# The Traditional regions reach `zh-Hant` beside it. Why the pair is named by
# script and neither half is named `zh` is in the package README, and
# `negotiate.test.ts` holds it.
#
# Keep this catalog complete. `zh-CN` and `zh-SG` negotiate to
# `["zh-Hans", "zh-Hant", "en"]` — filtering negotiation offers every `zh-*`
# catalog it has — so on a page holding both, a key dropped from here surfaces
# in Traditional rather than in English. The reverse cannot happen: every
# Traditional tag negotiates to `["zh-Hant", "en"]`.
#
# Chinese has a single plural category, so a countable message needs no
# selection — `[other]` covers every count. `[0]` is still spelled out where
# the English wording changes for zero, because that is a different sentence
# rather than a different number.
#
# A run of Latin text or digits is set off from the Chinese around it with a
# space — `还剩 { $count } 次尝试` — while a unit stays tight against the number
# it measures: `{ $percent }%`, never `{ $percent } %`.


## Answer submission

answer-checking = 正在检查……
answer-submitting = 正在提交……
answer-checking-status = 正在检查答案
answer-submitting-status = 正在提交答案
answer-correct = 正确
answer-incorrect = 错误
answer-response-saved = 回答已保存
answer-percent-credit = { $percent }% 得分
answer-percent-correct = { $percent }% 正确
answer-percent-short = { $percent }%
max-credit-available = 最高可得分数：{ $percent }%
attempts-remaining =
    { $count ->
        [0] 没有剩余尝试次数
       *[other] 还剩 { $count } 次尝试
    }
validation-correct = （正确）
validation-incorrect = （错误）
validation-partially-correct = （部分正确）
answer-show-responses = 显示 { $answerId } 的 { $count } 条回答

## Disclosure panels

feedback-heading = 反馈
collapsible-click-to-open = （点击展开）
collapsible-click-to-close = （点击收起）
collapsible-initializing = 正在初始化……
footnote-show = 显示脚注
footnote-hide = 隐藏脚注
description-more-information = 更多信息

## Controls

slider-previous = 上一个
slider-next = 下一个
keyboard-open = 打开键盘
keyboard-close = 关闭键盘
choice-input-remove-choice = 删除 { $choice }
matrix-remove-row = 删除行
matrix-add-row = 添加行
matrix-remove-column = 删除列
matrix-add-column = 添加列
subset-add-remove-points = 添加/删除点
subset-toggle-points-intervals = 切换点与区间
subset-move-points = 移动点
subset-clear = 清除
# A `box` here is one orbital, drawn as a square: 方框.
orbital-add-row = 添加行
orbital-remove-row = 删除行
orbital-add-box = 添加方框
orbital-remove-box = 删除方框
orbital-add-up-arrow = 添加向上箭头
orbital-add-down-arrow = 添加向下箭头
orbital-remove-arrow = 删除箭头
orbital-row-label = 第 { $row } 行的标签
pretzel-answer = 答案

## Math input

math-input-preview-region = 数学表达式预览
math-input-preview = 预览
math-input-invalid-expression = 无效的表达式：

## Document status

viewer-initializing = 正在初始化……

## Errors

error-heading = 错误
error-found-at =
    { $span ->
        [line] 位于第 { $startLine } 行。
       *[lines] 位于第 { $startLine }–{ $endLine } 行。
    }
document-contains-errors = 本文档包含错误！
diagnostic-heading-error = 错误
diagnostic-heading-warning = 警告
diagnostic-heading-information = 信息
diagnostic-heading-hint = 提示
accessibility-heading-level-1 = 违反 WCAG AA 无障碍标准
accessibility-heading-level-2 = 无障碍提醒
something-went-wrong = 出错了。
renderer-load-failed = 某个渲染组件加载失败。请重新加载页面。
core-start-failed = 无法启动文档查看器。请重新加载页面。
