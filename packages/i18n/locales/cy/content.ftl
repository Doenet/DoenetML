# Welsh content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Welsh puts its adjectives after the noun and softens them there: a feminine
# singular noun triggers the **soft mutation** on what follows it, so «coch»
# becomes «goch» and «du» becomes «ddu». Every describing word therefore
# selects on `$gender` and nothing selects on `$role`, which is the shape
# `locales/ga` and `locales/gd` arrive at from the same Celtic grammar.
#
# Welsh goes one step further than they do: a handful of adjectives have a
# feminine form of their own *before* the mutation applies, so «gwyn» becomes
# «gwen» and then «wen», and «melyn» becomes «melen» and then «felen». The
# feminine branch below is that finished form, not the mutation alone.
#
# The soft mutation moves `p` `t` `c` `b` `d` `g` `m` `ll` `rh` and nothing
# else, so «llwyd» becomes «lwyd» but «oren» — a vowel — reads alike in both
# branches, as would any word in `n`, `s` or `ff`.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] ddu
           *[m] du
        }
    .white =
        { $gender ->
            [f] wen
           *[m] gwyn
        }
    .gray =
        { $gender ->
            [f] lwyd
           *[m] llwyd
        }
    .red =
        { $gender ->
            [f] goch
           *[m] coch
        }
    .orange = oren
    .yellow =
        { $gender ->
            [f] felen
           *[m] melyn
        }
    .green =
        { $gender ->
            [f] werdd
           *[m] gwyrdd
        }
    .cyan =
        { $gender ->
            [f] werddlas
           *[m] gwyrddlas
        }
    .blue =
        { $gender ->
            [f] las
           *[m] glas
        }
    .purple =
        { $gender ->
            [f] borffor
           *[m] porffor
        }
    .pink =
        { $gender ->
            [f] binc
           *[m] pinc
        }
    .brown =
        { $gender ->
            [f] frown
           *[m] brown
        }
line-width =
    .thick =
        { $gender ->
            [f] drwchus
           *[m] trwchus
        }
    .thin =
        { $gender ->
            [f] denau
           *[m] tenau
        }
line-style =
    .dashed =
        { $gender ->
            [f] doredig
           *[m] toredig
        }
    .dotted =
        { $gender ->
            [f] ddotiog
           *[m] dotiog
        }
# Noun phrases standing behind «â», which takes the aspirate mutation. None of
# these words begins with `c`, `p` or `t`, so none of them shows it.
fill-style =
    .horizontal = llinellau llorweddol
    .vertical = llinellau fertigol
    .diagonal = llinellau croeslinol
    .backdiagonal = llinellau croeslinol gwrthdro
    .dots = dotiau
    .diamonds = diemwntau
noun =
    .line = llinell
    .line-segment = segment llinell
    .ray = pelydryn
    .vector = fector
    .curve = cromlin
    .function = ffwythiant
    .parabola = parabola
    .polyline = amlinell
    .polygon = polygon
    .triangle = triongl
    .rectangle = petryal
    .circle = cylch
    .region = rhanbarth
    .point = pwynt
    .square = sgwâr
    .diamond = diemwnt
    .cross = croes
    .plus = plws
# The side count follows the style adjectives, so the head and the tail split
# around them.
#
# The tail is the bare count and its noun rather than «â»/«ag» plus one: which
# of that pair is right depends on the sound the numeral is read with, and the
# numeral is a placeable the catalog never sees. Juxtaposing the count is the
# ordinary Welsh way to say it and asks nothing of the value.
noun-regular-polygon =
    { $part ->
        [tail] { $numSides } ochr
       *[head] polygon rheolaidd
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (polygon, m) or the
# head of a phrase the description never names: `border` (ffin, f), `fill`
# (llenwad, m), `text` (testun, m), `background` (cefndir, m).
noun-gender =
    { $noun ->
        [line] f
        [curve] f
        [polyline] f
        [cross] f
        [border] f
       *[other] m
    }

## Style composition

# The adjectives follow their noun, colour first: «llinell goch drwchus
# doredig».
#
# The colour leads on purpose, and it is not English's order carried over: a
# Welsh string of adjectives runs in roughly the reverse of the English one,
# the most closely defining word nearest the noun — «ci du mawr» for "a big
# black dog". Do not reorder these to width-style-colour to match the English
# or the other Celtic catalogs.
style-stroke =
    { $parts ->
        [width-style-color] { $color } { $width } { $lineStyle }
        [width-color] { $color } { $width }
        [style-color] { $color } { $lineStyle }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
# The infixed pronoun in this phrase agrees with what is filled: the masculine
# «ei» softens «llenwi» to «lenwi» and the feminine leaves it alone. So this
# selects on `$gender` like the adjectives, even though it is a
# past-participle phrase rather than an adjective.
style-filled-word =
    { $gender ->
        [f] wedi'i llenwi
       *[m] wedi'i lenwi
    }
style-filled =
    { $parts ->
        [pattern] { $color } { $filled } â { $pattern }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } â { $pattern }
        [plain-tail] { $noun } { $color } { $filled } { $nounTail }
        [pattern-tail] { $noun } { $color } { $filled } { $nounTail } â { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }
# «ffin» is feminine, so the border's adjectives soften after it whatever the
# shape around it is. Welsh has no indefinite article, so the two `-article`
# branches read like the two without; what changes between the pairs is the
# conjunction, which the two `and` branches put in front as «ac» — the form
# «a» takes before the vowel of «â».
style-border-clause =
    { $parts ->
        [with-article] â ffin { $border }
        [and] ac â ffin { $border }
        [and-article] ac â ffin { $border }
       *[with] â ffin { $border }
    }
style-fill =
    { $parts ->
        [pattern] llenwad { $color } â { $pattern }
       *[plain] { $color }
    }
# This one is given no `$gender`, so it cannot agree with the shape it
# describes. «heb lenwad» — "without a fill" — reads the same whatever that
# shape turns out to be, where «heb ei lenwi» would have committed to a
# masculine pronoun.
style-unfilled = heb lenwad
# «â» takes the aspirate mutation, and «cefndir» begins with `c`, so it is
# «â chefndir» here and «cefndir» anywhere else. The colour after it is
# masculine and unmutated.
style-text =
    { $parts ->
        [background] { $color } â chefndir { $background }
       *[plain] { $color }
    }
style-background-none = dim

## Boolean words

boolean-true = gwir
boolean-false = gau

## Answer buttons

answer-submit-label = Gwirio
answer-submit-label-no-correctness = Cyflwyno'r ymateb

## Sectional blocks

section-name =
    .activity = Gweithgaredd
    .aside = Sylw ymylol
    .cascade = Rhaeadr
    .definition = Diffiniad
    .example = Enghraifft
    .exercise = Ymarfer
    .exercises = Ymarferion
    .given-answer = Ateb
    .note = Nodyn
    .objectives = Amcanion
    .paragraphs = Paragraffau
    .part = Rhan
    .problem = Problem
    .problems = Problemau
    .proof = Prawf
    .question = Cwestiwn
    .section = Adran
    .solution = Datrysiad
    .task = Tasg
    .theorem = Theorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Awgrym

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabl { $enumeration }
        [numbered-title] Tabl { $enumeration }{ ": " }
        [unnumbered-title] Tabl{ ": " }
       *[unnumbered] Tabl
    }
figure-name =
    { $parts ->
        [numbered] Ffigur { $enumeration }
        [numbered-caption] Ffigur { $enumeration }{ ": " }
        [unnumbered-caption] Ffigur{ ": " }
       *[unnumbered] Ffigur
    }

## Paginator controls

paginator-previous = Blaenorol
paginator-next = Nesaf
paginator-page = Tudalen
paginator-page-status = { $pageLabel } { $currentPage } o { $numPages }

## Piecewise functions

piecewise-condition-or = neu
piecewise-condition-if = os
piecewise-condition-otherwise = fel arall

## Chemistry

element-name =
    .h = Hydrogen
    .he = Heliwm
    .li = Lithiwm
    .be = Beryliwm
    .b = Boron
    .c = Carbon
    .n = Nitrogen
    .o = Ocsigen
    .f = Fflworin
    .ne = Neon
    .na = Sodiwm
    .mg = Magnesiwm
    .al = Alwminiwm
    .si = Silicon
    .p = Ffosfforws
    .s = Sylffwr
    .cl = Clorin
    .ar = Argon
    .k = Potasiwm
    .ca = Calsiwm
    .sc = Sgandiwm
    .ti = Titaniwm
    .v = Fanadiwm
    .cr = Cromiwm
    .mn = Manganîs
    .fe = Haearn
    .co = Cobalt
    .ni = Nicel
    .cu = Copr
    .zn = Sinc
    .ga = Galiwm
    .ge = Germaniwm
    .as = Arsenig
    .se = Seleniwm
    .br = Bromin
    .kr = Crypton
    .rb = Rwbidiwm
    .sr = Strontiwm
    .y = Ytriwm
    .zr = Sirconiwm
    .nb = Niobiwm
    .mo = Molybdenwm
    .tc = Technetiwm
    .ru = Rwtheniwm
    .rh = Rhodiwm
    .pd = Paladiwm
    .ag = Arian
    .cd = Cadmiwm
    .in = Indiwm
    .sn = Tun
    .sb = Antimoni
    .te = Telwriwm
    .i = Ïodin
    .xe = Senon
    .cs = Cesiwm
    .ba = Bariwm
    .la = Lanthanwm
    .ce = Ceriwm
    .pr = Praseodymiwm
    .nd = Neodymiwm
    .pm = Promethiwm
    .sm = Samariwm
    .eu = Ewropiwm
    .gd = Gadoliniwm
    .tb = Terbiwm
    .dy = Dysprosiwm
    .ho = Holmiwm
    .er = Erbiwm
    .tm = Thwliwm
    .yb = Yterbiwm
    .lu = Lwtetiwm
    .hf = Haffniwm
    .ta = Tantalwm
    .w = Twngsten
    .re = Rheniwm
    .os = Osmiwm
    .ir = Iridiwm
    .pt = Platinwm
    .au = Aur
    .hg = Mercwri
    .tl = Thaliwm
    .pb = Plwm
    .bi = Bismwth
    .po = Poloniwm
    .at = Astatin
    .rn = Radon
    .fr = Ffranciwm
    .ra = Radiwm
    .ac = Actiniwm
    .th = Thoriwm
    .pa = Protactiniwm
    .u = Wraniwm
    .np = Neptwniwm
    .pu = Plwtoniwm
    .am = Americiwm
    .cm = Cwriwm
    .bk = Berceliwm
    .cf = Californiwm
    .es = Einsteiniwm
    .fm = Ffermiwm
    .md = Mendeleviwm
    .no = Nobeliwm
    .lr = Lawrenciwm
    .rf = Rutherffordiwm
    .db = Dwbniwm
    .sg = Seaborgiwm
    .bh = Bohriwm
    .hs = Hasiwm
    .mt = Meitneriwm
    .ds = Darmstadtiwm
    .rg = Roentgeniwm
    .cn = Coperniciwm
    .nh = Nihoniwm
    .fl = Fflerofiwm
    .mc = Moscofiwm
    .lv = Livermoriwm
    .ts = Tenesin
    .og = Oganeson
element-anion-name =
    .h = Hydrid
    .c = Carbid
    .n = Nitrid
    .o = Ocsid
    .f = Fflworid
    .p = Ffosffid
    .s = Sylffid
    .cl = Clorid
    .br = Bromid
    .i = Ïodid
    .at = Astatid
    .ts = Tenesid
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Symbol cemegol annilys
chemistry-invalid-ionic-compound = Cyfansoddyn ïonig annilys
