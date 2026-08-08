# Scottish Gaelic content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The same grammar as `locales/ga` and not the same catalog: adjectives follow
# their noun, a feminine noun lenites what follows it, and no position governs
# a case an attributive adjective could take. So every describing word selects
# on `$gender` and nothing selects on `$role`.
#
# Where Gaelic parts company with Irish is in the words and in what the
# prepositions do. Irish prefixes h- to a vowel after «le» — «le himlíne» —
# and Gaelic does not: «le iomall» is written plain, and the h- Gaelic does
# prefix belongs to «na h-», «a h-» and «gu h-» instead.
#
# `l`, `n`, `r` and a vowel have no lenited form, and neither does an `s`
# before another consonant — `sg-`, `sm-`, `sp-`, `st-`. So «uaine»,
# «orainds» and «strìochagach» are written with no `$gender` select at all,
# which is a fact about Gaelic spelling and not an untranslated string.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] dhubh
           *[m] dubh
        }
    .white =
        { $gender ->
            [f] gheal
           *[m] geal
        }
    .gray =
        { $gender ->
            [f] ghlas
           *[m] glas
        }
    .red =
        { $gender ->
            [f] dhearg
           *[m] dearg
        }
    .orange = orainds
    .yellow =
        { $gender ->
            [f] bhuidhe
           *[m] buidhe
        }
    .green = uaine
    .cyan =
        { $gender ->
            [f] ghorm-uaine
           *[m] gorm-uaine
        }
    .blue =
        { $gender ->
            [f] ghorm
           *[m] gorm
        }
    .purple =
        { $gender ->
            [f] phurpaidh
           *[m] purpaidh
        }
    .pink =
        { $gender ->
            [f] phinc
           *[m] pinc
        }
    .brown =
        { $gender ->
            [f] dhonn
           *[m] donn
        }

line-width =
    .thick =
        { $gender ->
            [f] thiugh
           *[m] tiugh
        }
    .thin =
        { $gender ->
            [f] chaol
           *[m] caol
        }

line-style =
    .dashed = strìochagach
    .dotted =
        { $gender ->
            [f] dhotagach
           *[m] dotagach
        }

# Noun phrases standing behind «le». They modify nothing and take no gender.
fill-style =
    .horizontal = loidhnichean còmhnard
    .vertical = loidhnichean inghearach
    .diagonal = loidhnichean trastanach
    .backdiagonal = loidhnichean trastanach cùil
    .dots = dotagan
    .diamonds = daoimeanan

noun =
    .line = loidhne
    .line-segment = earrann-loidhne
    .ray = gath
    .vector = beactar
    .curve = lùb
    .function = foincsean
    .parabola = parabola
    .polyline = ioma-loidhne
    .polygon = ioma-cheàrnach
    .triangle = triantan
    .rectangle = ceart-cheàrnach
    .circle = cearcall
    .region = roinn
    .point = puing
    .square = ceàrnag
    .diamond = daoimean
    .cross = crois
    .plus = plus

# The side count follows the style adjectives, so the head and the tail split
# around them. Three to ten take a plural noun in Gaelic and every other count
# leaves it singular, so the tail branches on `few` alone.
noun-regular-polygon =
    { $part ->
        [tail] le { $numSides } { $numSides ->
            [few] taobhan
           *[other] taobh
        }
       *[head] ioma-cheàrnach riaghailteach
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (ioma-cheàrnach, m) or
# the head of a phrase the description never names: `border` (iomall, m),
# `fill` (lìonadh, m), `text` (teacsa, m), `background` (cùlaibh, m).
noun-gender =
    { $noun ->
        [line] f
        [line-segment] f
        [curve] f
        [parabola] f
        [polyline] f
        [region] f
        [point] f
        [square] f
        [cross] f
       *[other] m
    }


## Style composition

# The adjectives follow their noun, and among themselves Gaelic keeps the
# order English has: a size or texture word before a colour word, as «cù mòr
# dubh» does — so «loidhne thiugh dhotagach dhearg». Each of them lenites
# after a feminine noun, not only the first.
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
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

# «lìonta» begins with `l`, which has no lenited form, so it reads the same
# after either gender.
style-filled-word = lìonta

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } le { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } le { $pattern }
        [plain-tail] { $noun } { $color } { $filled } { $nounTail }
        [pattern-tail] { $noun } { $color } { $filled } { $nounTail } le { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

# «iomall» is masculine, so the border's adjectives are unlenited after it
# whatever the shape around it is. Gaelic prefixes nothing to it after «le»,
# and has no indefinite article, so all four branches differ only in the
# conjunction English needs.
style-border-clause =
    { $parts ->
        [with-article] le iomall { $border }
        [and] agus iomall { $border }
        [and-article] agus iomall { $border }
       *[with] le iomall { $border }
    }

style-fill =
    { $parts ->
        [pattern] lìonadh { $color } le { $pattern }
       *[plain] { $color }
    }

style-unfilled = gun lìonadh

style-text =
    { $parts ->
        [background] { $color } le cùlaibh { $background }
       *[plain] { $color }
    }

style-background-none = chan eil gin


## Boolean words

boolean-true = fìor
boolean-false = breugach


## Answer buttons

answer-submit-label = Dearbh an obair
answer-submit-label-no-correctness = Cuir a-steach an fhreagairt


## Sectional blocks

section-name =
    .activity = Gnìomh
    .aside = Frith-nòta
    .cascade = Casgad
    .definition = Mìneachadh
    .example = Eisimpleir
    .exercise = Eacarsaich
    .exercises = Eacarsaichean
    .given-answer = Freagairt
    .note = Nòta
    .objectives = Amasan
    .paragraphs = Paragrafan
    .part = Pàirt
    .problem = Duilgheadas
    .problems = Duilgheadasan
    .proof = Dearbhadh
    .question = Ceist
    .section = Earrann
    .solution = Fuasgladh
    .task = Obair
    .theorem = Teòirim

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Sanas


## Tables and figures

table-name =
    { $parts ->
        [numbered] Clàr { $enumeration }
        [numbered-title] Clàr { $enumeration }{ ": " }
        [unnumbered-title] Clàr{ ": " }
       *[unnumbered] Clàr
    }

figure-name =
    { $parts ->
        [numbered] Dealbh { $enumeration }
        [numbered-caption] Dealbh { $enumeration }{ ": " }
        [unnumbered-caption] Dealbh{ ": " }
       *[unnumbered] Dealbh
    }


## Paginator controls

paginator-previous = Air ais
paginator-next = Air adhart
paginator-page = Duilleag

paginator-page-status = { $pageLabel } { $currentPage } à { $numPages }


## Piecewise functions

piecewise-condition-or = no
piecewise-condition-if = ma
piecewise-condition-otherwise = air neo


## Chemistry

element-name =
    .h = Haidridean
    .he = Healium
    .li = Liteam
    .be = Beirilium
    .b = Boron
    .c = Carbon
    .n = Nitrigin
    .o = Ogsaidean
    .f = Fluorain
    .ne = Neon
    .na = Sòidiam
    .mg = Magnèisium
    .al = Alùmanam
    .si = Sileacon
    .p = Fosfar
    .s = Pronnasg
    .cl = Clòirin
    .ar = Argon
    .k = Potaisiam
    .ca = Cailciam
    .sc = Scandium
    .ti = Titànium
    .v = Bhanàdium
    .cr = Cròmium
    .mn = Mangain
    .fe = Iarann
    .co = Cobalt
    .ni = Nicil
    .cu = Copar
    .zn = Sinc
    .ga = Gailium
    .ge = Gearmànium
    .as = Arsanaig
    .se = Selenium
    .br = Bròmain
    .kr = Cripton
    .rb = Rubidium
    .sr = Stronsium
    .y = Itrium
    .zr = Siorconium
    .nb = Niobium
    .mo = Molibdenum
    .tc = Teicnetium
    .ru = Rutenium
    .rh = Ròidium
    .pd = Pallàdium
    .ag = Airgead
    .cd = Cadmium
    .in = Indium
    .sn = Staoin
    .sb = Antamon
    .te = Tellurium
    .i = Iodain
    .xe = Senon
    .cs = Ceisium
    .ba = Barium
    .la = Lantanum
    .ce = Cerium
    .pr = Praseodimium
    .nd = Neodimium
    .pm = Promethium
    .sm = Samarium
    .eu = Eòrpium
    .gd = Gadolinium
    .tb = Terbium
    .dy = Disprosium
    .ho = Holmium
    .er = Erbium
    .tm = Tulium
    .yb = Iterbium
    .lu = Lutetium
    .hf = Hafnium
    .ta = Tantalum
    .w = Tungstan
    .re = Renium
    .os = Osmium
    .ir = Iridium
    .pt = Platanam
    .au = Òr
    .hg = Airgead-beò
    .tl = Talium
    .pb = Luaidhe
    .bi = Bismut
    .po = Polonium
    .at = Astatain
    .rn = Radon
    .fr = Fraincium
    .ra = Radium
    .ac = Actinium
    .th = Tòrium
    .pa = Pròtactinium
    .u = Ùranium
    .np = Neptunium
    .pu = Plutonium
    .am = Ameraicium
    .cm = Curium
    .bk = Berkelium
    .cf = Calaifornium
    .es = Einsteinium
    .fm = Fermium
    .md = Mendelevium
    .no = Nobelium
    .lr = Lawrencium
    .rf = Rutherfordium
    .db = Dubnium
    .sg = Seaborgium
    .bh = Bohrium
    .hs = Hassium
    .mt = Meitnerium
    .ds = Darmstadtium
    .rg = Roentgenium
    .cn = Copernicium
    .nh = Nihonium
    .fl = Flerovium
    .mc = Moscovium
    .lv = Livermorium
    .ts = Tenneisin
    .og = Oganeson

element-anion-name =
    .h = Haidrid
    .c = Carbaid
    .n = Nitrid
    .o = Ogsaid
    .f = Fluorid
    .p = Fosfid
    .s = Sulfid
    .cl = Clòirid
    .br = Bròmaid
    .i = Iodaid
    .at = Astataid
    .ts = Tenneisid

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Samhla ceimigeach mì-dhligheach
chemistry-invalid-ionic-compound = Todhar ianach mì-dhligheach
