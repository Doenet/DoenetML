# Uzbek content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Latin alphabet, which is Uzbekistan's official one and what
# CLDR fills a bare `uz` in as. A reader arriving under `uz-Cyrl` or `uz-Arab`
# reaches this catalog and gets Latin, the same way `az-Cyrl` reaches
# `locales/az`; a Cyrillic translation is a second catalog beside this one
# rather than a rename of it.
#
# Uzbek has no grammatical gender and does not inflect an attributive
# adjective, so both `$gender` and `$role` go unused here exactly as they do in
# English and Turkish. Adjectives precede the noun, so the composition messages
# keep the English order.
#
# The two clauses are marked by a suffix on the *noun* — «hoshiyali», «fonda» —
# and that noun is one this catalog writes, so nothing is welded to a placeable.


## Style vocabulary

color =
    .black = qora
    .white = oq
    .gray = kulrang
    .red = qizil
    .orange = toʻq sariq
    .yellow = sariq
    .green = yashil
    .cyan = havorang
    .blue = koʻk
    .purple = binafsha
    .pink = pushti
    .brown = jigarrang
line-width =
    .thick = qalin
    .thin = ingichka
line-style =
    .dashed = uzuq-uzuq
    .dotted = nuqtali
# Noun phrases: they stand in front of «naqshli» and modify nothing.
fill-style =
    .horizontal = gorizontal chiziq
    .vertical = vertikal chiziq
    .diagonal = diagonal chiziq
    .backdiagonal = teskari diagonal chiziq
    .dots = nuqta
    .diamonds = romb
noun =
    .line = toʻgʻri chiziq
    .line-segment = kesma
    .ray = nur
    .vector = vektor
    .curve = egri chiziq
    .function = funksiya
    .parabola = parabola
    .polyline = siniq chiziq
    .polygon = koʻpburchak
    .triangle = uchburchak
    .rectangle = toʻgʻri toʻrtburchak
    .circle = aylana
    .region = soha
    .point = nuqta
    .square = kvadrat
    .diamond = romb
    .cross = xoch
    .plus = plyus
# Uzbek builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] muntazam { $numSides }-burchak
    }
# Uzbek has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English and Turkish.
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
style-filled-word = boʻyalgan
style-filled =
    { $parts ->
        [pattern] { $pattern } naqshli { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } naqshli { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } naqshli { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «hoshiyali» — "bordered" — carries the "with a border" sense in its own
# suffix, so neither a preposition nor an article is wanted, and all four
# branches read alike except for the connective English needs and Uzbek does
# not.
style-border-clause =
    { $parts ->
        [with-article] { $border } hoshiyali
        [and] va { $border } hoshiyali
        [and-article] va { $border } hoshiyali
       *[with] { $border } hoshiyali
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } naqshli { $color } boʻyoq
       *[plain] { $color } boʻyoq
    }
style-unfilled = boʻyalmagan
# «fonda» is the locative of «fon» and says "on the background" by itself, so
# nothing stands between the two colours.
style-text =
    { $parts ->
        [background] { $background } fonda { $color }
       *[plain] { $color }
    }
style-background-none = yoʻq

## Boolean words

boolean-true = rost
boolean-false = yolgʻon

## Answer buttons

answer-submit-label = Tekshirish
answer-submit-label-no-correctness = Javobni yuborish

## Sectional blocks

section-name =
    .activity = Faoliyat
    .aside = Chekinish
    .cascade = Kaskad
    .definition = Taʼrif
    .example = Misol
    .exercise = Mashq
    .exercises = Mashqlar
    .given-answer = Javob
    .note = Izoh
    .objectives = Maqsadlar
    .paragraphs = Xatboshilar
    .part = Qism
    .problem = Masala
    .problems = Masalalar
    .proof = Isbot
    .question = Savol
    .section = Boʻlim
    .solution = Yechim
    .task = Topshiriq
    .theorem = Teorema
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Maslahat

## Tables and figures

table-name =
    { $parts ->
        [numbered] { $enumeration }-jadval
        [numbered-title] { $enumeration }-jadval{ ". " }
        [unnumbered-title] Jadval{ ". " }
       *[unnumbered] Jadval
    }
figure-name =
    { $parts ->
        [numbered] { $enumeration }-rasm
        [numbered-caption] { $enumeration }-rasm{ ". " }
        [unnumbered-caption] Rasm{ ". " }
       *[unnumbered] Rasm
    }

## Paginator controls

paginator-previous = Oldingi
paginator-next = Keyingi
paginator-page = Sahifa
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = yoki
piecewise-condition-if = agar
piecewise-condition-otherwise = aks holda

## Chemistry

element-name =
    .h = Vodorod
    .he = Geliy
    .li = Litiy
    .be = Berilliy
    .b = Bor
    .c = Uglerod
    .n = Azot
    .o = Kislorod
    .f = Ftor
    .ne = Neon
    .na = Natriy
    .mg = Magniy
    .al = Alyuminiy
    .si = Kremniy
    .p = Fosfor
    .s = Oltingugurt
    .cl = Xlor
    .ar = Argon
    .k = Kaliy
    .ca = Kalsiy
    .sc = Skandiy
    .ti = Titan
    .v = Vanadiy
    .cr = Xrom
    .mn = Marganes
    .fe = Temir
    .co = Kobalt
    .ni = Nikel
    .cu = Mis
    .zn = Rux
    .ga = Galliy
    .ge = Germaniy
    .as = Mishyak
    .se = Selen
    .br = Brom
    .kr = Kripton
    .rb = Rubidiy
    .sr = Stronsiy
    .y = Ittriy
    .zr = Sirkoniy
    .nb = Niobiy
    .mo = Molibden
    .tc = Texnesiy
    .ru = Ruteniy
    .rh = Rodiy
    .pd = Palladiy
    .ag = Kumush
    .cd = Kadmiy
    .in = Indiy
    .sn = Qalay
    .sb = Surma
    .te = Tellur
    .i = Yod
    .xe = Ksenon
    .cs = Seziy
    .ba = Bariy
    .la = Lantan
    .ce = Seriy
    .pr = Prazeodim
    .nd = Neodim
    .pm = Prometiy
    .sm = Samariy
    .eu = Yevropiy
    .gd = Gadoliniy
    .tb = Terbiy
    .dy = Disproziy
    .ho = Golmiy
    .er = Erbiy
    .tm = Tuliy
    .yb = Itterbiy
    .lu = Lyutesiy
    .hf = Gafniy
    .ta = Tantal
    .w = Volfram
    .re = Reniy
    .os = Osmiy
    .ir = Iridiy
    .pt = Platina
    .au = Oltin
    .hg = Simob
    .tl = Talliy
    .pb = Qoʻrgʻoshin
    .bi = Vismut
    .po = Poloniy
    .at = Astat
    .rn = Radon
    .fr = Fransiy
    .ra = Radiy
    .ac = Aktiniy
    .th = Toriy
    .pa = Protaktiniy
    .u = Uran
    .np = Neptuniy
    .pu = Plutoniy
    .am = Amerisiy
    .cm = Kyuriy
    .bk = Berkliy
    .cf = Kaliforniy
    .es = Eynshteyniy
    .fm = Fermiy
    .md = Mendeleviy
    .no = Nobeliy
    .lr = Lourensiy
    .rf = Rezerfordiy
    .db = Dubniy
    .sg = Siborgiy
    .bh = Boriy
    .hs = Xassiy
    .mt = Meytneriy
    .ds = Darmshtadtiy
    .rg = Rentgeniy
    .cn = Kopernisiy
    .nh = Nixoniy
    .fl = Fleroviy
    .mc = Moskoviy
    .lv = Livermoriy
    .ts = Tennessin
    .og = Oganeson
element-anion-name =
    .h = Gidrid
    .c = Karbid
    .n = Nitrid
    .o = Oksid
    .f = Ftorid
    .p = Fosfid
    .s = Sulfid
    .cl = Xlorid
    .br = Bromid
    .i = Yodid
    .at = Astatid
    .ts = Tennessid
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Yaroqsiz kimyoviy belgi
chemistry-invalid-ionic-compound = Yaroqsiz ion birikma
