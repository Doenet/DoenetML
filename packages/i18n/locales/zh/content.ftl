# Chinese content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Chinese has no grammatical gender and no adjective agreement, so `$gender`
# goes unused here exactly as it does in English, and every adjective is one
# word. Modifiers precede the noun and are joined to it directly, with no
# space: `{ $description }{ $noun }` rather than `{ $description } { $noun }`.
# The composition messages below differ from the English ones in order as well:
# a 带…的 clause has to precede what it modifies, so a fill pattern leads the
# description it appears in, and a colour leads a stroke's rather than trailing
# it.


## Style vocabulary

color =
    .black = 黑色
    .white = 白色
    .gray = 灰色
    .red = 红色
    .orange = 橙色
    .yellow = 黄色
    .green = 绿色
    .cyan = 青色
    .blue = 蓝色
    .purple = 紫色
    .pink = 粉色
    .brown = 棕色

line-width =
    .thick = 粗
    .thin = 细

line-style =
    .dashed = 虚线
    .dotted = 点线

# Noun phrases: they follow 带 and modify nothing.
fill-style =
    .horizontal = 水平线
    .vertical = 垂直线
    .diagonal = 斜线
    .backdiagonal = 反向斜线
    .dots = 圆点
    .diamonds = 菱形

noun =
    .line = 直线
    .line-segment = 线段
    .ray = 射线
    .vector = 向量
    .curve = 曲线
    .function = 函数
    .parabola = 抛物线
    .polyline = 折线
    .polygon = 多边形
    .triangle = 三角形
    .rectangle = 矩形
    .circle = 圆
    .region = 区域
    .point = 点
    .square = 正方形
    .diamond = 菱形
    .cross = 十字
    .plus = 加号

# Chinese puts the side count in front of the noun, so the whole thing is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] 正 { $numSides } 边形
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
        [pattern] 带{ $pattern }的{ $color }{ $filled }
       *[plain] { $color }{ $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] 带{ $pattern }的{ $color }{ $filled }{ $noun }
        [plain-tail] { $color }{ $filled }{ $noun }{ $nounTail }
        [pattern-tail] 带{ $pattern }的{ $color }{ $filled }{ $noun }{ $nounTail }
       *[plain] { $color }{ $filled }{ $noun }
    }

# The code appends this clause to the description with a plain space, which is
# the one join no catalog owns, so Chinese gets a space it would not write:
# 带圆点的蓝色填充圆 和红色边框. Closing it means the code passing the join to
# the catalog the way it passes every other one.
style-border-clause =
    { $parts ->
        [with-article] 带{ $border }边框
        [and] 和{ $border }边框
        [and-article] 和{ $border }边框
       *[with] 带{ $border }边框
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

style-background-none = 无


## Boolean words

boolean-true = 真
boolean-false = 假


## Answer buttons

answer-submit-label = 检查
answer-submit-label-no-correctness = 提交回答


## Sectional blocks

section-name =
    .activity = 活动
    .aside = 旁注
    .cascade = 级联
    .definition = 定义
    .example = 例
    .exercise = 练习
    .exercises = 练习
    .given-answer = 答案
    .note = 注
    .objectives = 学习目标
    .paragraphs = 段落
    .part = 部分
    .problem = 习题
    .problems = 习题
    .proof = 证明
    .question = 问题
    .section = 节
    .solution = 解答
    .task = 任务
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
        [numbered] 图 { $enumeration }
        [numbered-caption] 图 { $enumeration }{ "：" }
        [unnumbered-caption] 图{ "：" }
       *[unnumbered] 图
    }


## Paginator controls

paginator-previous = 上一页
paginator-next = 下一页
paginator-page = 页

# Chinese counts pages with the label on both halves — 第 3 页，共 5 页 — so
# `$pageLabel` appears twice. It is the `pageLabel` attribute, which an author
# may have written themselves, and a word they chose has to be the word in
# both halves.
paginator-page-status = 第 { $currentPage } { $pageLabel }，共 { $numPages } { $pageLabel }


## Piecewise functions

piecewise-condition-or = 或
piecewise-condition-if = 当
piecewise-condition-otherwise = 其他情况


## Chemistry

element-name =
    .h = 氢
    .he = 氦
    .li = 锂
    .be = 铍
    .b = 硼
    .c = 碳
    .n = 氮
    .o = 氧
    .f = 氟
    .ne = 氖
    .na = 钠
    .mg = 镁
    .al = 铝
    .si = 硅
    .p = 磷
    .s = 硫
    .cl = 氯
    .ar = 氩
    .k = 钾
    .ca = 钙
    .sc = 钪
    .ti = 钛
    .v = 钒
    .cr = 铬
    .mn = 锰
    .fe = 铁
    .co = 钴
    .ni = 镍
    .cu = 铜
    .zn = 锌
    .ga = 镓
    .ge = 锗
    .as = 砷
    .se = 硒
    .br = 溴
    .kr = 氪
    .rb = 铷
    .sr = 锶
    .y = 钇
    .zr = 锆
    .nb = 铌
    .mo = 钼
    .tc = 锝
    .ru = 钌
    .rh = 铑
    .pd = 钯
    .ag = 银
    .cd = 镉
    .in = 铟
    .sn = 锡
    .sb = 锑
    .te = 碲
    .i = 碘
    .xe = 氙
    .cs = 铯
    .ba = 钡
    .la = 镧
    .ce = 铈
    .pr = 镨
    .nd = 钕
    .pm = 钷
    .sm = 钐
    .eu = 铕
    .gd = 钆
    .tb = 铽
    .dy = 镝
    .ho = 钬
    .er = 铒
    .tm = 铥
    .yb = 镱
    .lu = 镥
    .hf = 铪
    .ta = 钽
    .w = 钨
    .re = 铼
    .os = 锇
    .ir = 铱
    .pt = 铂
    .au = 金
    .hg = 汞
    .tl = 铊
    .pb = 铅
    .bi = 铋
    .po = 钋
    .at = 砹
    .rn = 氡
    .fr = 钫
    .ra = 镭
    .ac = 锕
    .th = 钍
    .pa = 镤
    .u = 铀
    .np = 镎
    .pu = 钚
    .am = 镅
    .cm = 锔
    .bk = 锫
    .cf = 锎
    .es = 锿
    .fm = 镄
    .md = 钔
    .no = 锘
    .lr = 铹
    .rf = 𬬻
    .db = 𬭊
    .sg = 𬭳
    .bh = 𬭛
    .hs = 𬭶
    .mt = 鿏
    .ds = 𫟼
    .rg = 𬬭
    .cn = 鿔
    .nh = 鉨
    .fl = 𫓧
    .mc = 镆
    .lv = 𫟷
    .ts = 鿬
    .og = 鿫

element-anion-name =
    .h = 氢化物
    .c = 碳化物
    .n = 氮化物
    .o = 氧化物
    .f = 氟化物
    .p = 磷化物
    .s = 硫化物
    .cl = 氯化物
    .br = 溴化物
    .i = 碘化物
    .at = 砹化物
    .ts = 鿬化物

ion-name-oxidation-state = { $name }（{ $numeral }）

chemistry-invalid-symbol = 无效的化学符号
chemistry-invalid-ionic-compound = 无效的离子化合物
