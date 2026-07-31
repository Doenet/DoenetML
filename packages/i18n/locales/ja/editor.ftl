# Japanese editor and language-server surfaces. Translated from
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
# Japanese has a single plural category, so a countable message needs no
# selection — `[other]` covers every count.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] リセット
       *[update] 更新
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] ビューアーを{ $word }
       *[other] ビューアーを{ $word } { $shortcut }
    }


## The variant picker

editor-variant = バリアント
editor-variant-filter = 絞り込み...
editor-variant-next = 次のバリアントを選択
editor-variant-previous = 前のバリアントを選択


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA アクセシビリティ違反が見つかりました。クリックでアクセシビリティレポートを{ $action ->
            [close] 閉じます
           *[open] 開きます
        }。
        [advisories] クリックでアクセシビリティレポートを{ $action ->
            [close] 閉じます
           *[open] 開きます
        }。WCAG AA 違反はありませんが、その他のアクセシビリティに関する推奨があります。
       *[clean] クリックでアクセシビリティレポートを{ $action ->
            [close] 閉じます
           *[open] 開きます
        }。アクセシビリティの問題は見つかりませんでした。
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA アクセシビリティ違反が見つかりました。WCAG AA 違反が { $count } 件あります。クリックでアクセシビリティレポートを{ $action ->
            [close] 閉じます
           *[open] 開きます
        }。
        [advisories] WCAG AA 違反はありません。その他のアクセシビリティに関する推奨が { $count } 件あります。クリックでアクセシビリティレポートを{ $action ->
            [close] 閉じます
           *[open] 開きます
        }。
       *[clean] WCAG AA 違反はありません。クリックでアクセシビリティレポートを{ $action ->
            [close] 閉じます
           *[open] 開きます
        }。
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML バージョン { $version }

editor-tab-help = 文脈に応じたヘルプ
editor-tab-help-short = 文脈
editor-tab-errors = エラー
editor-tab-warnings = 警告
editor-tab-info = 情報
editor-tab-accessibility = アクセシビリティ
editor-tab-responses = 送信済みの解答

editor-tab-with-count = { $label }: { $count }

editor-options = エディターの設定
editor-format-as-doenetml = DoenetML として整形
editor-format-as-xml = XML として整形


## The diagnostics panel

editor-diagnostic-line = { $line } 行目

editor-no-errors = エラーはありません
editor-no-warnings = 警告はありません
editor-no-info = 情報診断はありません

editor-show-info-annotations = エディターに情報診断を表示
editor-show-accessibility-annotations = エディターにアクセシビリティ診断を表示

editor-accessibility-learn-more = Doenet のアクセシビリティに対する考え方を見る

editor-accessibility-violations-heading = アクセシビリティ違反（{ $standard }）

editor-accessibility-other-heading = その他のアクセシビリティの問題
editor-none-found = 見つかりませんでした


## Submitted responses

editor-no-responses = 送信済みの解答はまだありません
editor-response-answer-id = Answer Id
editor-response-response = 解答
editor-response-credit = 得点
editor-response-submitted = 送信日時


## The context-help panel

help-placeholder = タグ名・属性・{ $ref } のいずれかにカーソルを合わせるとドキュメントが表示されます。

help-unsupported-ref-chain = { $example } のような多段参照のヘルプにはまだ対応していません。

help-unresolved-ref =
    { $reason ->
        [notFound] 参照先が見つかりません: { $ref }。
        [multiple] 参照先が複数見つかりました: { $ref }。
       *[indeterminate] { $ref } の参照先を特定できません。
    }

help-learn-about-references = 参照について学ぶ →
help-reference-page = リファレンスページ →

help-suggestions-header =
    { $location ->
        [inside] { $element } の内部
       *[top] 最上位
    }{ $allowed ->
        [none] { " — ここには何も置けません。" }
        [text] { " — ここにはテキストを入力できます。" }
        [text-and-components] { " — ここにはテキストを入力できます。または次を試してください:" }
       *[components] { " — 次を試してください:" }
    }

help-suggestions-footer = { $shortcut } を押すと { $total } 個のコンポーネントすべてを表示します。

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } は { $target } への参照です。
       *[other] { $ref } は { $target } への参照です（{ $line } 行目）。
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } によって { $role } として導入されました。
       *[other] { $owner } によって { $line } 行目で { $role } として導入されました。
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } は { $element } の { $property } プロパティへの参照です。
       *[other] { $ref } は { $element } の { $property } プロパティへの参照です（{ $line } 行目）。
    }

help-kind-attribute = 属性
help-kind-snippet = スニペット
help-kind-array-entry = 配列要素

help-default = 既定値:
help-active-default = 有効な既定値:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] 使用できる値（項目ごとに 1 つ）:
       *[other] 使用できる値:
    }

help-suggested-values = 推奨される値:

help-inserts = 挿入:

help-coordinates = 座標:

help-type = 型:

help-resolved-style = 解決済みのスタイル（styleNumber { $styleNumber }）:

help-resolved-function-names = 解決済みの関数名:
help-reset-list = この入力のリセット一覧:
help-added-on-input = この入力で追加:
help-removed-on-input = この入力で削除:

help-reset-overrides = { $reset } は { $additional } と { $removed } より優先されます。
