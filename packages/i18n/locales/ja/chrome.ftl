# Japanese viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Japanese has a single plural category, so a countable message needs no
# selection — `[other]` covers every count. `[0]` is still spelled out where
# the English wording changes for zero, because that is a different sentence
# rather than a different number.
#
# A count takes a classifier: `残り { $count } 回` rather than a bare number.
#
# A run of Latin text or digits is set off from the Japanese around it with a
# space — `残り { $count } 回` — while a unit stays tight against the number it
# measures: `{ $percent }%`, never `{ $percent } %`.
#
# Sentence punctuation is full-width (、。). A colon introducing a value keeps
# the half-width `:` and writes the space after it, since what follows is a
# Latin run. `content.ftl`'s title separators use the full-width `：` instead,
# which carries its own trailing space.


## Answer submission

answer-checking = 確認中...
answer-submitting = 送信中...
answer-checking-status = 解答を確認しています
answer-submitting-status = 解答を送信しています
answer-correct = 正解
answer-incorrect = 不正解
answer-response-saved = 解答を保存しました
answer-percent-credit = { $percent }% の得点
answer-percent-correct = { $percent }% 正解
answer-percent-short = { $percent }%
max-credit-available = 獲得可能な最高得点: { $percent }%
attempts-remaining =
    { $count ->
        [0] 残りの試行回数はありません
       *[other] 残り { $count } 回
    }
validation-correct = （正解）
validation-incorrect = （不正解）
validation-partially-correct = （部分正解）
answer-show-responses = { $answerId } の解答 { $count } 件を表示

## Disclosure panels

feedback-heading = フィードバック
collapsible-click-to-open = （クリックで開く）
collapsible-click-to-close = （クリックで閉じる）
collapsible-initializing = 初期化中...
footnote-show = 脚注を表示
footnote-hide = 脚注を非表示
description-more-information = 詳細情報

## Controls

slider-previous = 前へ
slider-next = 次へ
keyboard-open = キーボードを開く
keyboard-close = キーボードを閉じる
choice-input-remove-choice = { $choice } を削除
matrix-remove-row = 行を削除
matrix-add-row = 行を追加
matrix-remove-column = 列を削除
matrix-add-column = 列を追加
subset-add-remove-points = 点の追加・削除
subset-toggle-points-intervals = 点と区間を切り替え
subset-move-points = 点を移動
subset-clear = クリア
# A `box` here is one orbital, drawn as a square: ボックス.
orbital-add-row = 行を追加
orbital-remove-row = 行を削除
orbital-add-box = ボックスを追加
orbital-remove-box = ボックスを削除
orbital-add-up-arrow = 上向き矢印を追加
orbital-add-down-arrow = 下向き矢印を追加
orbital-remove-arrow = 矢印を削除
orbital-row-label = { $row } 行目のラベル
pretzel-answer = 解答

## Math input

math-input-preview-region = 数式のプレビュー
math-input-preview = プレビュー
math-input-invalid-expression = 無効な数式:

## Document status

viewer-initializing = 初期化中...

## Errors

error-heading = エラー
error-found-at =
    { $span ->
        [line] { $startLine } 行目で見つかりました。
       *[lines] { $startLine }–{ $endLine } 行目で見つかりました。
    }
document-contains-errors = この文書にはエラーがあります。
diagnostic-heading-error = エラー
diagnostic-heading-warning = 警告
diagnostic-heading-information = 情報
diagnostic-heading-hint = ヒント
accessibility-heading-level-1 = WCAG AA アクセシビリティ違反
accessibility-heading-level-2 = アクセシビリティに関する注意
something-went-wrong = 問題が発生しました。
renderer-load-failed = 描画コンポーネントの読み込みに失敗しました。ページを再読み込みしてください。
core-start-failed = 文書ビューアーを起動できませんでした。ページを再読み込みしてください。
