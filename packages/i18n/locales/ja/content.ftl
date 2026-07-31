# Japanese content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Japanese has no grammatical gender and no adjective agreement, so `$gender`
# goes unused here exactly as it does in English. Modifiers precede the noun.
#
# Every style word below is a *noun* rather than an adjective — 太め, 破線,
# 赤色 — and the catalog joins them with の, so each branch of the composition
# messages is a well-formed noun phrase on its own as well as in front of a
# noun. Writing 太い as an i-adjective would read better in the branches that
# end in a noun and be ungrammatical in the one that does not (`太いの円`),
# and the catalog cannot tell which branch it is in.
#
# The known cost of that choice: a dashed line renders 赤色の太めの破線の直線,
# where 破線 and 直線 say "line" twice. The English it comes from does the same
# thing ("thick dashed line" + "line"), and Chinese ships with it too; a
# reviewer who wants it gone should change `style-with-noun`, not the words.


## Style vocabulary

color =
    .black = 黒色
    .white = 白色
    .gray = 灰色
    .red = 赤色
    .orange = オレンジ色
    .yellow = 黄色
    .green = 緑色
    .cyan = シアン
    .blue = 青色
    .purple = 紫色
    .pink = ピンク色
    .brown = 茶色

line-width =
    .thick = 太め
    .thin = 細め

line-style =
    .dashed = 破線
    .dotted = 点線

# Noun phrases: they precede 入り and modify nothing.
fill-style =
    .horizontal = 横線
    .vertical = 縦線
    .diagonal = 斜線
    .backdiagonal = 逆斜線
    .dots = ドット
    .diamonds = ひし形

noun =
    .line = 直線
    .line-segment = 線分
    .ray = 半直線
    .vector = ベクトル
    .curve = 曲線
    .function = 関数
    .parabola = 放物線
    .polyline = 折れ線
    .polygon = 多角形
    .triangle = 三角形
    .rectangle = 長方形
    .circle = 円
    .region = 領域
    .point = 点
    .square = 正方形
    .diamond = ひし形
    .cross = 十字
    .plus = プラス記号

# Japanese puts the side count inside the noun itself — 正5角形 — so the whole
# thing is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] 正 { $numSides } 角形
    }

# Japanese has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English.
noun-gender = neuter


## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $color }の{ $width }の{ $lineStyle }
        [width-color] { $color }の{ $width }
        [style-color] { $color }の{ $lineStyle }
        [width-style] { $width }の{ $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

# The modifier precedes the noun and is joined to it with の.
style-with-noun =
    { $parts ->
        [noun-tail] { $description }の{ $noun }{ $nounTail }
       *[noun] { $description }の{ $noun }
    }

style-filled-word = 塗りつぶし

style-filled =
    { $parts ->
        [pattern] { $pattern }入りの{ $color }の{ $filled }
       *[plain] { $color }の{ $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern }入りの{ $color }の{ $filled }の{ $noun }
        [plain-tail] { $color }の{ $filled }の{ $noun }{ $nounTail }
        [pattern-tail] { $pattern }入りの{ $color }の{ $filled }の{ $noun }{ $nounTail }
       *[plain] { $color }の{ $filled }の{ $noun }
    }

# Japanese needs no article, so the `-article` branches read the same as the
# ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border }の枠線付き
        [and] と{ $border }の枠線
        [and-article] と{ $border }の枠線
       *[with] { $border }の枠線付き
    }

style-fill =
    { $parts ->
        [pattern] { $color }の{ $pattern }
       *[plain] { $color }
    }

style-unfilled = 塗りつぶしなし

style-text =
    { $parts ->
        [background] { $color }（背景は{ $background }）
       *[plain] { $color }
    }

style-background-none = なし


## Boolean words

boolean-true = 真
boolean-false = 偽


## Answer buttons

answer-submit-label = 解答を確認
answer-submit-label-no-correctness = 解答を送信


## Sectional blocks

section-name =
    .activity = 活動
    .aside = 補足
    .cascade = カスケード
    .definition = 定義
    .example = 例
    .exercise = 練習問題
    .exercises = 練習問題
    .given-answer = 答え
    .note = 注
    .objectives = 学習目標
    .paragraphs = 段落
    .part = 部
    .problem = 問題
    .problems = 問題
    .proof = 証明
    .question = 問い
    .section = 節
    .solution = 解答
    .task = 課題
    .theorem = 定理

# A space separates the word from its number, because the number is Latin
# digits. A title follows the full-width colon Japanese punctuates with, which
# carries its own trailing space. A bare number keeps the ASCII period, which
# is the punctuation the number itself is already written in.
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ "：" }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ "：" }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = ヒント


## Tables and figures

table-name =
    { $parts ->
        [numbered] 表 { $enumeration }
        [numbered-title] 表 { $enumeration }{ "：" }
        [unnumbered-title] 表{ "：" }
       *[unnumbered] 表
    }

figure-name =
    { $parts ->
        [numbered] 図 { $enumeration }
        [numbered-caption] 図 { $enumeration }{ "：" }
        [unnumbered-caption] 図{ "：" }
       *[unnumbered] 図
    }


## Paginator controls

paginator-previous = 前へ
paginator-next = 次へ
paginator-page = ページ

# `$pageLabel` is the `pageLabel` attribute, which an author may have written
# themselves, so it leads and the counts follow it.
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = または
# Precedes the inequality the renderer writes after it, so it has to be a word
# that can come first — もし rather than the clause-final のとき.
piecewise-condition-if = もし
piecewise-condition-otherwise = それ以外


## Chemistry

element-name =
    .h = 水素
    .he = ヘリウム
    .li = リチウム
    .be = ベリリウム
    .b = ホウ素
    .c = 炭素
    .n = 窒素
    .o = 酸素
    .f = フッ素
    .ne = ネオン
    .na = ナトリウム
    .mg = マグネシウム
    .al = アルミニウム
    .si = ケイ素
    .p = リン
    .s = 硫黄
    .cl = 塩素
    .ar = アルゴン
    .k = カリウム
    .ca = カルシウム
    .sc = スカンジウム
    .ti = チタン
    .v = バナジウム
    .cr = クロム
    .mn = マンガン
    .fe = 鉄
    .co = コバルト
    .ni = ニッケル
    .cu = 銅
    .zn = 亜鉛
    .ga = ガリウム
    .ge = ゲルマニウム
    .as = ヒ素
    .se = セレン
    .br = 臭素
    .kr = クリプトン
    .rb = ルビジウム
    .sr = ストロンチウム
    .y = イットリウム
    .zr = ジルコニウム
    .nb = ニオブ
    .mo = モリブデン
    .tc = テクネチウム
    .ru = ルテニウム
    .rh = ロジウム
    .pd = パラジウム
    .ag = 銀
    .cd = カドミウム
    .in = インジウム
    .sn = スズ
    .sb = アンチモン
    .te = テルル
    .i = ヨウ素
    .xe = キセノン
    .cs = セシウム
    .ba = バリウム
    .la = ランタン
    .ce = セリウム
    .pr = プラセオジム
    .nd = ネオジム
    .pm = プロメチウム
    .sm = サマリウム
    .eu = ユウロピウム
    .gd = ガドリニウム
    .tb = テルビウム
    .dy = ジスプロシウム
    .ho = ホルミウム
    .er = エルビウム
    .tm = ツリウム
    .yb = イッテルビウム
    .lu = ルテチウム
    .hf = ハフニウム
    .ta = タンタル
    .w = タングステン
    .re = レニウム
    .os = オスミウム
    .ir = イリジウム
    .pt = 白金
    .au = 金
    .hg = 水銀
    .tl = タリウム
    .pb = 鉛
    .bi = ビスマス
    .po = ポロニウム
    .at = アスタチン
    .rn = ラドン
    .fr = フランシウム
    .ra = ラジウム
    .ac = アクチニウム
    .th = トリウム
    .pa = プロトアクチニウム
    .u = ウラン
    .np = ネプツニウム
    .pu = プルトニウム
    .am = アメリシウム
    .cm = キュリウム
    .bk = バークリウム
    .cf = カリホルニウム
    .es = アインスタイニウム
    .fm = フェルミウム
    .md = メンデレビウム
    .no = ノーベリウム
    .lr = ローレンシウム
    .rf = ラザホージウム
    .db = ドブニウム
    .sg = シーボーギウム
    .bh = ボーリウム
    .hs = ハッシウム
    .mt = マイトネリウム
    .ds = ダームスタチウム
    .rg = レントゲニウム
    .cn = コペルニシウム
    .nh = ニホニウム
    .fl = フレロビウム
    .mc = モスコビウム
    .lv = リバモリウム
    .ts = テネシン
    .og = オガネソン

element-anion-name =
    .h = 水素化物
    .c = 炭化物
    .n = 窒化物
    .o = 酸化物
    .f = フッ化物
    .p = リン化物
    .s = 硫化物
    .cl = 塩化物
    .br = 臭化物
    .i = ヨウ化物
    .at = アスタチン化物
    .ts = テネシン化物

ion-name-oxidation-state = { $name }（{ $numeral }）

chemistry-invalid-symbol = 無効な化学記号
chemistry-invalid-ionic-compound = 無効なイオン化合物
