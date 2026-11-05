# Traditional Chinese content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Chinese has no grammatical gender and no adjective agreement, so `$gender`
# goes unused here exactly as it does in English, and every adjective is one
# word. Modifiers precede the noun and are joined to it directly, with no
# space: `{ $description }{ $noun }` rather than `{ $description } { $noun }`.
# The composition messages below differ from the English ones in order as well:
# a 帶…的 clause has to precede what it modifies, so a fill pattern leads the
# description it appears in, and a colour leads a stroke's rather than trailing
# it. All of that is shared with `zh-Hans`; the grammar does not differ between
# the scripts, only the wording does.
#
# The element names are where this catalog diverges from `zh-Hans` by more than
# character conversion, and are the part worth checking first. Taiwan and the
# mainland name several elements differently — 矽 not 硅 (Si), 錼 not 镎 (Np),
# 鋂 not 镅 (Am), 鉳 not 锫 (Bk), 鑀 not 锿 (Es), 鎦 not 镥 (Lu), 砈 not 砹
# (At). Check 104–118 next: those names are the newest and least settled in
# both, and most of them are written differently here. A wrong one renders as
# a wrong character rather than as a missing key, so lint cannot catch it.


## Style vocabulary

color =
    .black = 黑色
    .white = 白色
    .gray = 灰色
    .red = 紅色
    .orange = 橙色
    .yellow = 黃色
    .green = 綠色
    .cyan = 青色
    .blue = 藍色
    .purple = 紫色
    .pink = 粉紅色
    .brown = 棕色
line-width =
    .thick = 粗
    .thin = 細
line-style =
    .dashed = 虛線
    .dotted = 點線
# Noun phrases: they follow 帶 and modify nothing.
fill-style =
    .horizontal = 水平線
    .vertical = 垂直線
    .diagonal = 斜線
    .backdiagonal = 反向斜線
    .dots = 圓點
    .diamonds = 菱形
noun =
    .line = 直線
    .line-segment = 線段
    .ray = 射線
    .vector = 向量
    .curve = 曲線
    .function = 函數
    .parabola = 拋物線
    .polyline = 折線
    .polygon = 多邊形
    .triangle = 三角形
    .rectangle = 矩形
    .circle = 圓
    .region = 區域
    .point = 點
    .square = 正方形
    .diamond = 菱形
    .cross = 十字
    .plus = 加號
# Chinese puts the side count in front of the noun, so the whole thing is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] 正 { $numSides } 邊形
    }
# Chinese has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English.
noun-gender = neuter

## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $color }{ $width }{ $lineStyle }
        [width-color] { $color }{ $width }
        [style-color] { $color }{ $lineStyle }
        [width-style] { $width }{ $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
# No space between a modifier and the noun it modifies.
style-with-noun =
    { $parts ->
        [noun-tail] { $description }{ $noun }{ $nounTail }
       *[noun] { $description }{ $noun }
    }
style-filled-word = 填充
style-filled =
    { $parts ->
        [pattern] 帶{ $pattern }的{ $color }{ $filled }
       *[plain] { $color }{ $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] 帶{ $pattern }的{ $color }{ $filled }{ $noun }
        [plain-tail] { $color }{ $filled }{ $noun }{ $nounTail }
        [pattern-tail] 帶{ $pattern }的{ $color }{ $filled }{ $noun }{ $nounTail }
       *[plain] { $color }{ $filled }{ $noun }
    }
# The code appends this clause to the description with a plain space, which is
# the one join no catalog owns, so Chinese gets a space it would not write:
# 帶圓點的藍色填充圓 和紅色邊框. Closing it means the code passing the join to
# the catalog the way it passes every other one (#1605).
style-border-clause =
    { $parts ->
        [with-article] 帶{ $border }邊框
        [and] 和{ $border }邊框
        [and-article] 和{ $border }邊框
       *[with] 帶{ $border }邊框
    }
style-fill =
    { $parts ->
        [pattern] { $color }{ $pattern }
       *[plain] { $color }
    }
style-unfilled = 未填充
style-text =
    { $parts ->
        [background] { $color }，{ $background }背景
       *[plain] { $color }
    }
style-background-none = 無

## Boolean words

boolean-true = 真
boolean-false = 假

## Answer buttons

answer-submit-label = 檢查
answer-submit-label-no-correctness = 提交作答

## Sectional blocks

section-name =
    .activity = 活動
    .aside = 旁註
    .cascade = 級聯
    .definition = 定義
    .example = 例
    .exercise = 練習
    .exercises = 練習
    .given-answer = 答案
    .note = 註
    .objectives = 學習目標
    .paragraphs = 段落
    .part = 部分
    .problem = 習題
    .problems = 習題
    .proof = 證明
    .question = 問題
    .section = 節
    .solution = 解答
    .task = 任務
    .theorem = 定理
# A space separates the word from its number, because the number is Latin
# digits, and a title follows the full-width colon Chinese punctuates with. A
# bare number keeps the ASCII period, which is the punctuation the number
# itself is already written in.
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ "：" }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ "：" }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = 提示

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
        [numbered] 圖 { $enumeration }
        [numbered-caption] 圖 { $enumeration }{ "：" }
        [unnumbered-caption] 圖{ "：" }
       *[unnumbered] 圖
    }

## Paginator controls

paginator-previous = 上一頁
paginator-next = 下一頁
paginator-page = 頁
# Chinese counts pages with the label on both halves — 第 3 頁，共 5 頁 — so
# `$pageLabel` appears twice. It is the `pageLabel` attribute, which an author
# may have written themselves, and a word they chose has to be the word in
# both halves.
paginator-page-status = 第 { $currentPage } { $pageLabel }，共 { $numPages } { $pageLabel }

## Piecewise functions

piecewise-condition-or = 或
piecewise-condition-if = 當
piecewise-condition-otherwise = 其他情況

## Chemistry

element-name =
    .h = 氫
    .he = 氦
    .li = 鋰
    .be = 鈹
    .b = 硼
    .c = 碳
    .n = 氮
    .o = 氧
    .f = 氟
    .ne = 氖
    .na = 鈉
    .mg = 鎂
    .al = 鋁
    .si = 矽
    .p = 磷
    .s = 硫
    .cl = 氯
    .ar = 氬
    .k = 鉀
    .ca = 鈣
    .sc = 鈧
    .ti = 鈦
    .v = 釩
    .cr = 鉻
    .mn = 錳
    .fe = 鐵
    .co = 鈷
    .ni = 鎳
    .cu = 銅
    .zn = 鋅
    .ga = 鎵
    .ge = 鍺
    .as = 砷
    .se = 硒
    .br = 溴
    .kr = 氪
    .rb = 銣
    .sr = 鍶
    .y = 釔
    .zr = 鋯
    .nb = 鈮
    .mo = 鉬
    .tc = 鎝
    .ru = 釕
    .rh = 銠
    .pd = 鈀
    .ag = 銀
    .cd = 鎘
    .in = 銦
    .sn = 錫
    .sb = 銻
    .te = 碲
    .i = 碘
    .xe = 氙
    .cs = 銫
    .ba = 鋇
    .la = 鑭
    .ce = 鈰
    .pr = 鐠
    .nd = 釹
    .pm = 鉕
    .sm = 釤
    .eu = 銪
    .gd = 釓
    .tb = 鋱
    .dy = 鏑
    .ho = 鈥
    .er = 鉺
    .tm = 銩
    .yb = 鐿
    .lu = 鎦
    .hf = 鉿
    .ta = 鉭
    .w = 鎢
    .re = 錸
    .os = 鋨
    .ir = 銥
    .pt = 鉑
    .au = 金
    .hg = 汞
    .tl = 鉈
    .pb = 鉛
    .bi = 鉍
    .po = 釙
    .at = 砈
    .rn = 氡
    .fr = 鍅
    .ra = 鐳
    .ac = 錒
    .th = 釷
    .pa = 鏷
    .u = 鈾
    .np = 錼
    .pu = 鈽
    .am = 鋂
    .cm = 鋦
    .bk = 鉳
    .cf = 鉲
    .es = 鑀
    .fm = 鐨
    .md = 鍆
    .no = 鍩
    .lr = 鐒
    .rf = 鑪
    .db = 𨧀
    .sg = 𨭎
    .bh = 𨨏
    .hs = 𨭆
    .mt = 䥑
    .ds = 鐽
    .rg = 錀
    .cn = 鎶
    .nh = 鉨
    .fl = 鈇
    .mc = 鏌
    .lv = 鉝
    .ts = 鿬
    .og = 鿫
element-anion-name =
    .h = 氫化物
    .c = 碳化物
    .n = 氮化物
    .o = 氧化物
    .f = 氟化物
    .p = 磷化物
    .s = 硫化物
    .cl = 氯化物
    .br = 溴化物
    .i = 碘化物
    .at = 砈化物
    .ts = 鿬化物
ion-name-oxidation-state = { $name }（{ $numeral }）
chemistry-invalid-symbol = 無效的化學符號
chemistry-invalid-ionic-compound = 無效的離子化合物
