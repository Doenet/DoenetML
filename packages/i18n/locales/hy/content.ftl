# Armenian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Armenian has seven cases and no grammatical gender, and an attributive
# adjective agrees for neither: «սև» is «սև» in front of a nominative noun and
# in front of an instrumental one alike. So both `$gender` and `$role` go
# unused here, exactly as they do in English and Turkish — and for a different
# reason than in either, since the language does inflect, only never on the
# words this file places.
#
# What carries the two clauses is a case ending on the noun, and the noun is
# one this catalog writes: «եզրագծով» is the instrumental of «եզրագիծ» and says
# "with a border" by itself, so `style-border-clause` places nothing in front of
# the colour. The background takes the genitive plus the postposition «վրա».


## Style vocabulary

color =
    .black = սև
    .white = սպիտակ
    .gray = մոխրագույն
    .red = կարմիր
    .orange = նարնջագույն
    .yellow = դեղին
    .green = կանաչ
    .cyan = փիրուզագույն
    .blue = կապույտ
    .purple = մանուշակագույն
    .pink = վարդագույն
    .brown = շագանակագույն

line-width =
    .thick = հաստ
    .thin = բարակ

line-style =
    .dashed = գծիկավոր
    .dotted = կետավոր

fill-style =
    .horizontal = հորիզոնական գծերի
    .vertical = ուղղահայաց գծերի
    .diagonal = անկյունագծային գծերի
    .backdiagonal = հակառակ անկյունագծային գծերի
    .dots = կետերի
    .diamonds = շեղանկյունների

noun =
    .line = ուղիղ
    .line-segment = հատված
    .ray = ճառագայթ
    .vector = վեկտոր
    .curve = կոր
    .function = ֆունկցիա
    .parabola = պարաբոլ
    .polyline = կոտրված գիծ
    .polygon = բազմանկյուն
    .triangle = եռանկյուն
    .rectangle = ուղղանկյուն
    .circle = շրջանագիծ
    .region = տիրույթ
    .point = կետ
    .square = քառակուսի
    .diamond = շեղանկյուն
    .cross = խաչ
    .plus = գումարած

# Armenian builds the word from the side count itself, in front of the noun, so
# the whole of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] կանոնավոր { $numSides }-անկյուն
    }

# Armenian has no grammatical gender, so every noun answers the same and the
# answer goes unused — the same thing `locales/en` and `locales/tr` do. Nor is
# there a case fork underneath it: the adjectives never move.
noun-gender = neuter


## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width } { $lineStyle } { $color }
        [width-color] { $width } { $color }
        [style-color] { $lineStyle } { $color }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

style-filled-word = լցված

# «զարդանախշով» — "with a pattern" — is instrumental, and the pattern word in
# front of it is genitive, governed by «զարդանախշով» — which is why the
# `fill-style` patterns are written in the genitive plural. Nothing is welded
# to the placeable: the ending sits on a word this catalog writes.
style-filled =
    { $parts ->
        [pattern] { $pattern } զարդանախշով { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } զարդանախշով { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } զարդանախշով { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «եզրագծով» is the instrumental of «եզրագիծ» and carries the "with" in its own
# ending, so the clause opens on the border's adjectives. Armenian has no
# indefinite article, so the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] { $border } եզրագծով
        [and] և { $border } եզրագծով
        [and-article] և { $border } եզրագծով
       *[with] { $border } եզրագծով
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } զարդանախշով { $color } լցվածք
       *[plain] { $color } լցվածք
    }

style-unfilled = չլցված

# «ֆոնի վրա» — genitive plus postposition — and the colour in front of it does
# not move, so the same word stands here and on its own.
style-text =
    { $parts ->
        [background] { $background } ֆոնի վրա { $color }
       *[plain] { $color }
    }

style-background-none = չկա


## Boolean words

boolean-true = ճշմարիտ
boolean-false = կեղծ


## Answer buttons

answer-submit-label = Ստուգել
answer-submit-label-no-correctness = Ուղարկել պատասխանը


## Sectional blocks

section-name =
    .activity = Գործունեություն
    .aside = Առանձին նշում
    .cascade = Կասկադ
    .definition = Սահմանում
    .example = Օրինակ
    .exercise = Վարժություն
    .exercises = Վարժություններ
    .given-answer = Պատասխան
    .note = Նշում
    .objectives = Նպատակներ
    .paragraphs = Պարբերություններ
    .part = Մաս
    .problem = Խնդիր
    .problems = Խնդիրներ
    .proof = Ապացույց
    .question = Հարց
    .section = Բաժին
    .solution = Լուծում
    .task = Առաջադրանք
    .theorem = Թեորեմ

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Հուշում


## Tables and figures

table-name =
    { $parts ->
        [numbered] Աղյուսակ { $enumeration }
        [numbered-title] Աղյուսակ { $enumeration }{ ". " }
        [unnumbered-title] Աղյուսակ{ ". " }
       *[unnumbered] Աղյուսակ
    }

figure-name =
    { $parts ->
        [numbered] Նկար { $enumeration }
        [numbered-caption] Նկար { $enumeration }{ ". " }
        [unnumbered-caption] Նկար{ ". " }
       *[unnumbered] Նկար
    }


## Paginator controls

paginator-previous = Նախորդը
paginator-next = Հաջորդը
paginator-page = Էջ

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = կամ
piecewise-condition-if = եթե
piecewise-condition-otherwise = հակառակ դեպքում


## Chemistry

element-name =
    .h = Ջրածին
    .he = Հելիում
    .li = Լիթիում
    .be = Բերիլիում
    .b = Բոր
    .c = Ածխածին
    .n = Ազոտ
    .o = Թթվածին
    .f = Ֆտոր
    .ne = Նեոն
    .na = Նատրիում
    .mg = Մագնեզիում
    .al = Ալյումին
    .si = Սիլիցիում
    .p = Ֆոսֆոր
    .s = Ծծումբ
    .cl = Քլոր
    .ar = Արգոն
    .k = Կալիում
    .ca = Կալցիում
    .sc = Սկանդիում
    .ti = Տիտան
    .v = Վանադիում
    .cr = Քրոմ
    .mn = Մանգան
    .fe = Երկաթ
    .co = Կոբալտ
    .ni = Նիկել
    .cu = Պղինձ
    .zn = Ցինկ
    .ga = Գալիում
    .ge = Գերմանիում
    .as = Մկնդեղ
    .se = Սելեն
    .br = Բրոմ
    .kr = Կրիպտոն
    .rb = Ռուբիդիում
    .sr = Ստրոնցիում
    .y = Իտրիում
    .zr = Ցիրկոնիում
    .nb = Նիոբիում
    .mo = Մոլիբդեն
    .tc = Տեխնեցիում
    .ru = Ռութենիում
    .rh = Ռոդիում
    .pd = Պալադիում
    .ag = Արծաթ
    .cd = Կադմիում
    .in = Ինդիում
    .sn = Անագ
    .sb = Ստիբիում
    .te = Տելուր
    .i = Յոդ
    .xe = Քսենոն
    .cs = Ցեզիում
    .ba = Բարիում
    .la = Լանթան
    .ce = Ցերիում
    .pr = Պրազեոդիմ
    .nd = Նեոդիմ
    .pm = Պրոմեթիում
    .sm = Սամարիում
    .eu = Եվրոպիում
    .gd = Գադոլինիում
    .tb = Տերբիում
    .dy = Դիսպրոզիում
    .ho = Հոլմիում
    .er = Էրբիում
    .tm = Թուլիում
    .yb = Իտերբիում
    .lu = Լյուտեցիում
    .hf = Հաֆնիում
    .ta = Տանտալ
    .w = Վոլֆրամ
    .re = Ռենիում
    .os = Օսմիում
    .ir = Իրիդիում
    .pt = Պլատին
    .au = Ոսկի
    .hg = Սնդիկ
    .tl = Թալիում
    .pb = Կապար
    .bi = Բիսմութ
    .po = Պոլոնիում
    .at = Աստատ
    .rn = Ռադոն
    .fr = Ֆրանցիում
    .ra = Ռադիում
    .ac = Ակտինիում
    .th = Թորիում
    .pa = Պրոտակտինիում
    .u = Ուրան
    .np = Նեպտունիում
    .pu = Պլուտոնիում
    .am = Ամերիցիում
    .cm = Կյուրիում
    .bk = Բերկելիում
    .cf = Կալիֆորնիում
    .es = Այնշտայնիում
    .fm = Ֆերմիում
    .md = Մենդելեվիում
    .no = Նոբելիում
    .lr = Լոուրենսիում
    .rf = Ռեզերֆորդիում
    .db = Դուբնիում
    .sg = Սիբորգիում
    .bh = Բորիում
    .hs = Հասիում
    .mt = Մայտներիում
    .ds = Դարմշտադտիում
    .rg = Ռենտգենիում
    .cn = Կոպեռնիցիում
    .nh = Նիհոնիում
    .fl = Ֆլերովիում
    .mc = Մոսկովիում
    .lv = Լիվերմորիում
    .ts = Թենեսին
    .og = Օգանեսոն

element-anion-name =
    .h = Հիդրիդ
    .c = Կարբիդ
    .n = Նիտրիդ
    .o = Օքսիդ
    .f = Ֆտորիդ
    .p = Ֆոսֆիդ
    .s = Սուլֆիդ
    .cl = Քլորիդ
    .br = Բրոմիդ
    .i = Յոդիդ
    .at = Աստատիդ
    .ts = Թենեսիդ

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Անվավեր քիմիական նշան
chemistry-invalid-ionic-compound = Անվավեր իոնային միացություն
