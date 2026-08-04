# Irish content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Irish puts its adjectives *after* the noun, so every composition message
# below is reordered from the English, and the noun a description names comes
# first rather than last.
#
# What the noun then does to those adjectives is not agreement but **lenition**:
# a feminine singular noun softens the first consonant of everything following
# it — «dearg» becomes «dhearg», «tiubh» becomes «thiubh» — and a masculine one
# leaves it alone. So every describing word selects on `$gender`, exactly as a
# Romance or Slavic catalog does, and the two branches differ in one letter
# rather than in an ending.
#
# Not every word can show it: `l`, `n`, `r` and a vowel have no lenited form,
# and neither do `sc-`, `sm-`, `sp-` and `st-`. «liath» and «oráiste» are
# therefore written once with no select at all, which is a fact about Irish
# spelling and not an untranslated string.
#
# Nothing here selects on `$role`. Irish has a genitive and a vocative but no
# case that an attributive adjective takes from the position of the phrase it
# sits in: what a position does to a Celtic adjective is done by the noun in
# front of it, and that noun's gender is already the token. No message below
# mentions `$role`, so the three clause positions render exactly as
# `standalone` does.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] dhubh
           *[m] dubh
        }
    .white =
        { $gender ->
            [f] bhán
           *[m] bán
        }
    .gray = liath
    .red =
        { $gender ->
            [f] dhearg
           *[m] dearg
        }
    .orange = oráiste
    .yellow =
        { $gender ->
            [f] bhuí
           *[m] buí
        }
    .green =
        { $gender ->
            [f] ghlas
           *[m] glas
        }
    .cyan =
        { $gender ->
            [f] chian
           *[m] cian
        }
    .blue =
        { $gender ->
            [f] ghorm
           *[m] gorm
        }
    .purple =
        { $gender ->
            [f] chorcra
           *[m] corcra
        }
    .pink =
        { $gender ->
            [f] bhándearg
           *[m] bándearg
        }
    .brown =
        { $gender ->
            [f] dhonn
           *[m] donn
        }

line-width =
    .thick =
        { $gender ->
            [f] thiubh
           *[m] tiubh
        }
    .thin =
        { $gender ->
            [f] thanaí
           *[m] tanaí
        }

line-style =
    .dashed =
        { $gender ->
            [f] bhriste
           *[m] briste
        }
    .dotted =
        { $gender ->
            [f] phoncaithe
           *[m] poncaithe
        }

# Noun phrases standing behind «le», which is where the composition messages
# put them. They modify nothing and so take no gender.
fill-style =
    .horizontal = línte cothrománacha
    .vertical = línte ingearacha
    .diagonal = línte trasnánacha
    .backdiagonal = línte trasnánacha droim ar ais
    .dots = poncanna
    .diamonds = muileataí

noun =
    .line = líne
    .line-segment = mírlíne
    .ray = ga
    .vector = veicteoir
    .curve = cuar
    .function = feidhm
    .parabola = parabóil
    .polyline = illíne
    .polygon = polagán
    .triangle = triantán
    .rectangle = dronuilleog
    .circle = ciorcal
    .region = réigiún
    .point = pointe
    .square = cearnóg
    .diamond = muileata
    .cross = cros
    .plus = plus

# «polagán rialta» is the noun and its own adjective; the side count follows
# the style adjectives as a prepositional phrase, so the head and the tail
# split around them the way Spanish's does.
#
# «taobh» stays singular after the numeral, as any counted noun does, and stays
# unlenited: 2 to 6 would lenite it and 7 to 10 would leave it alone, and the
# side count is a value this catalog never sees, so no mutation can be welded
# onto it.
noun-regular-polygon =
    { $part ->
        [tail] le { $numSides } taobh
       *[head] polagán rialta
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (polagán, m) or the
# head of a phrase the description never names: `border` (imlíne, f), `fill`
# (líonadh, m), `text` (téacs, m), `background` (cúlra, m).
noun-gender =
    { $noun ->
        [line] f
        [line-segment] f
        [function] f
        [parabola] f
        [polyline] f
        [rectangle] f
        [square] f
        [cross] f
        [border] f
       *[other] m
    }


## Style composition

# The adjectives follow their noun rather than preceding it, and among
# themselves they keep the order English uses, with the colour last:
# «líne thiubh bhriste dhearg», as «carr beag dearg» puts size before colour.
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

# The noun leads and the adjectives follow it, which is the reverse of English
# and the reason this message exists rather than a concatenation.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

# «líonta» begins with `l`, which has no lenited form, so it reads the same
# after a feminine noun as after a masculine one and needs no branch.
style-filled-word = líonta

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

# «imlíne» is feminine, so the border's adjectives lenite after it whatever the
# shape around it is. It also begins with a vowel, and «le» prefixes h- to a
# vowel while «agus» does not — so the same noun is «le himlíne» in one pair of
# branches and «agus imlíne» in the other. Irish has no indefinite article, so
# the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] le himlíne { $border }
        [and] agus imlíne { $border }
        [and-article] agus imlíne { $border }
       *[with] le himlíne { $border }
    }

# The pattern words are plural nouns, so this supplies «líonadh» — masculine,
# the gender `noun-gender` already answers for `fill` — for the colour to
# follow, and hangs the pattern off it with «le».
style-fill =
    { $parts ->
        [pattern] líonadh { $color } le { $pattern }
       *[plain] { $color }
    }

style-unfilled = gan líonadh

# «cúlra» is masculine, so the background colour does not lenite, and «le»
# leaves a consonant alone.
style-text =
    { $parts ->
        [background] { $color } le cúlra { $background }
       *[plain] { $color }
    }

style-background-none = gan aon cheann


## Boolean words

boolean-true = fíor
boolean-false = bréagach


## Answer buttons

answer-submit-label = Seiceáil an obair
answer-submit-label-no-correctness = Seol an freagra


## Sectional blocks

section-name =
    .activity = Gníomhaíocht
    .aside = Nóta Taoibh
    .cascade = Cascáid
    .definition = Sainmhíniú
    .example = Sampla
    .exercise = Cleachtadh
    .exercises = Cleachtaí
    .given-answer = Freagra
    .note = Nóta
    .objectives = Cuspóirí
    .paragraphs = Ailt
    .part = Cuid
    .problem = Fadhb
    .problems = Fadhbanna
    .proof = Cruthúnas
    .question = Ceist
    .section = Rannán
    .solution = Réiteach
    .task = Tasc
    .theorem = Teoirim

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Leid


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tábla { $enumeration }
        [numbered-title] Tábla { $enumeration }{ ": " }
        [unnumbered-title] Tábla{ ": " }
       *[unnumbered] Tábla
    }

figure-name =
    { $parts ->
        [numbered] Fíor { $enumeration }
        [numbered-caption] Fíor { $enumeration }{ ": " }
        [unnumbered-caption] Fíor{ ": " }
       *[unnumbered] Fíor
    }


## Paginator controls

paginator-previous = Roimhe seo
paginator-next = Ar aghaidh
paginator-page = Leathanach

paginator-page-status = { $pageLabel } { $currentPage } as { $numPages }


## Piecewise functions

piecewise-condition-or = nó
piecewise-condition-if = má
piecewise-condition-otherwise = ar shlí eile


## Chemistry

element-name =
    .h = Hidrigin
    .he = Héiliam
    .li = Litiam
    .be = Beirilliam
    .b = Bórón
    .c = Carbón
    .n = Nítrigin
    .o = Ocsaigin
    .f = Fluairín
    .ne = Neon
    .na = Sóidiam
    .mg = Maignéisiam
    .al = Alúmanam
    .si = Sileacan
    .p = Fosfar
    .s = Sulfar
    .cl = Clóirín
    .ar = Argón
    .k = Potaisiam
    .ca = Cailciam
    .sc = Scandiam
    .ti = Tíotáiniam
    .v = Vanaidiam
    .cr = Cróimiam
    .mn = Mangainéis
    .fe = Iarann
    .co = Cóbalt
    .ni = Nicil
    .cu = Copar
    .zn = Sinc
    .ga = Gailliam
    .ge = Gearmáiniam
    .as = Arsanaic
    .se = Seiléiniam
    .br = Bróimín
    .kr = Crioptón
    .rb = Rubaidiam
    .sr = Strointiam
    .y = Itriam
    .zr = Sorcóiniam
    .nb = Niaibiam
    .mo = Molaibdéineam
    .tc = Teicnéitiam
    .ru = Rutéiniam
    .rh = Ródiam
    .pd = Pallaidiam
    .ag = Airgead
    .cd = Caidmiam
    .in = Indiam
    .sn = Stán
    .sb = Antamón
    .te = Teallúiriam
    .i = Iaidín
    .xe = Xeanón
    .cs = Caeisiam
    .ba = Bairiam
    .la = Lantanam
    .ce = Céiriam
    .pr = Praiséidimiam
    .nd = Neaidimiam
    .pm = Próiméitiam
    .sm = Samáiriam
    .eu = Eorpaiam
    .gd = Gadailliniam
    .tb = Teirbiam
    .dy = Diospróisiam
    .ho = Holmiam
    .er = Eirbiam
    .tm = Túiliam
    .yb = Itéirbiam
    .lu = Lúitéisiam
    .hf = Haifniam
    .ta = Tantalam
    .w = Tungstan
    .re = Réiniam
    .os = Oismiam
    .ir = Iridiam
    .pt = Platanam
    .au = Ór
    .hg = Mearcair
    .tl = Tailliam
    .pb = Luaidhe
    .bi = Biosmat
    .po = Polóiniam
    .at = Astaitín
    .rn = Radón
    .fr = Fraincniam
    .ra = Raidiam
    .ac = Achtainiam
    .th = Tóiriam
    .pa = Prótachtainiam
    .u = Úráiniam
    .np = Neiptiúiniam
    .pu = Plútóiniam
    .am = Ameraiciam
    .cm = Cúiriam
    .bk = Beircéiliam
    .cf = Calafoirniam
    .es = Einstéiniam
    .fm = Feirmiam
    .md = Mendeiléiviam
    .no = Nóibéiliam
    .lr = Láirinciam
    .rf = Rutarfoirdiam
    .db = Dúbniam
    .sg = Seabóirgiam
    .bh = Bóiriam
    .hs = Haisiam
    .mt = Méitnéiriam
    .ds = Darmstaidiam
    .rg = Roentgeiniam
    .cn = Copairniciam
    .nh = Nihoiniam
    .fl = Fleiroviam
    .mc = Moscoviam
    .lv = Livearmóiriam
    .ts = Teinisein
    .og = Oganasan

element-anion-name =
    .h = Hidríd
    .c = Cairbíd
    .n = Nítríd
    .o = Ocsaíd
    .f = Fluairíd
    .p = Fosfíd
    .s = Sulfíd
    .cl = Clóiríd
    .br = Bróimíd
    .i = Iaidíd
    .at = Astaitíd
    .ts = Teiniséid

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Siombail cheimiceach neamhbhailí
chemistry-invalid-ionic-compound = Comhdhúil ianach neamhbhailí
