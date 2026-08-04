# Sundanese content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# SPEECH LEVEL. Written in **loma**, the neutral level, throughout — see the
# header of `chrome.ftl` for why the choice is made once for the whole locale
# rather than left open.
#
# Sundanese has no grammatical gender, no adjective agreement, no article and
# no case, so `$gender` and `$role` go unused here exactly as they do in
# English, and the two `-article` branches read like the ones without.
#
# Adjectives *follow* the noun they modify — «garis kandel beureum» — so the
# composition messages put the noun first, as Indonesian and Javanese do, and
# keep the English order among the adjectives themselves.


## Style vocabulary

color =
    .black = hideung
    .white = bodas
    .gray = kulawu
    .red = beureum
    .orange = oranye
    .yellow = konéng
    .green = héjo
    .cyan = sian
    .blue = biru
    .purple = ungu
    .pink = beureum ngora
    .brown = coklat

line-width =
    .thick = kandel
    .thin = ipis

line-style =
    .dashed = pegat-pegat
    .dotted = titik-titik

# Noun phrases: they follow «jeung» and modify nothing.
fill-style =
    .horizontal = garis ngadatar
    .vertical = garis nangtung
    .diagonal = garis miring
    .backdiagonal = garis miring sabalikna
    .dots = titik
    .diamonds = wajit

noun =
    .line = garis
    .line-segment = ruas garis
    .ray = sinar
    .vector = véktor
    .curve = kurva
    .function = fungsi
    .parabola = parabola
    .polyline = garis patah
    .polygon = poligon
    .triangle = segitilu
    .rectangle = pasagi panjang
    .circle = bunderan
    .region = wewengkon
    .point = titik
    .square = pasagi
    .diamond = wajit
    .cross = tanda silang
    .plus = tanda tambah

# The side count follows the noun and precedes its adjectives, so it folds into
# the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligon teratur sisi { $numSides }
    }

# Sundanese has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English.
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

# The noun leads and its adjectives follow: «garis kandel pegat-pegat beureum».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

# The participle, matching `style-unfilled`'s «teu dieusian» below; «eusi» on
# its own is the noun for the contents rather than a word describing the shape.
style-filled-word = dieusian

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } jeung { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } jeung { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } jeung { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

# Sundanese needs no article, so the `-article` branches read like the ones
# without. The border is «pinggir», the rim, and not «sisi»: «sisi» is the word
# `noun-regular-polygon` above counts, so a bordered pentagon would otherwise
# describe its outline with the same word as the five sides it is drawn from.
style-border-clause =
    { $parts ->
        [with-article] jeung pinggir { $border }
        [and] jeung pinggir { $border }
        [and-article] jeung pinggir { $border }
       *[with] jeung pinggir { $border }
    }

# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = teu dieusian

style-text =
    { $parts ->
        [background] { $color } dina latar { $background }
       *[plain] { $color }
    }

style-background-none = euweuh


## Boolean words

boolean-true = bener
boolean-false = salah


## Answer buttons

answer-submit-label = Pariksa Pagawéan
answer-submit-label-no-correctness = Kirim Jawaban


## Sectional blocks

section-name =
    .activity = Kagiatan
    .aside = Selingan
    .cascade = Runtuyan
    .definition = Watesan
    .example = Conto
    .exercise = Latihan
    .exercises = Latihan
    .given-answer = Jawaban
    .note = Catetan
    .objectives = Tujuan
    .paragraphs = Paragraf
    .part = Bagian
    .problem = Soal
    .problems = Soal
    .proof = Bukti
    .question = Pananya
    .section = Bagian
    .solution = Pamecahan
    .task = Pancén
    .theorem = Téoréma

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Pituduh


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabél { $enumeration }
        [numbered-title] Tabél { $enumeration }{ ": " }
        [unnumbered-title] Tabél{ ": " }
       *[unnumbered] Tabél
    }

figure-name =
    { $parts ->
        [numbered] Gambar { $enumeration }
        [numbered-caption] Gambar { $enumeration }{ ": " }
        [unnumbered-caption] Gambar{ ": " }
       *[unnumbered] Gambar
    }


## Paginator controls

paginator-previous = Saméméhna
paginator-next = Salajengna
paginator-page = Kaca

paginator-page-status = { $pageLabel } { $currentPage } ti { $numPages }


## Piecewise functions

piecewise-condition-or = atawa
piecewise-condition-if = lamun
piecewise-condition-otherwise = salian ti éta


## Chemistry
##
## Sundanese school chemistry is taught out of Indonesian-language textbooks,
## so the scientific names here are the Indonesian ones — which is what a
## Sundanese text writing about chemistry uses, and what `locales/id` already
## supplies.
##
## The exceptions are the substances known long before their elements were
## isolated, which keep their own Sundanese words: «beusi» iron, «tambaga»
## copper, «pérak» silver, «emas» gold, «timah» tin, «timah hideung» lead, «cai
## raksa» mercury, «walirang» sulfur, «seng» zinc and «warangan» arsenic.

element-name =
    .h = Hidrogén
    .he = Hélium
    .li = Litium
    .be = Bérilium
    .b = Boron
    .c = Karbon
    .n = Nitrogén
    .o = Oksigén
    .f = Fluorin
    .ne = Néon
    .na = Natrium
    .mg = Magnésium
    .al = Aluminium
    .si = Silikon
    .p = Fosforus
    .s = Walirang
    .cl = Klorin
    .ar = Argon
    .k = Kalium
    .ca = Kalsium
    .sc = Skandium
    .ti = Titanium
    .v = Vanadium
    .cr = Kromium
    .mn = Mangan
    .fe = Beusi
    .co = Kobalt
    .ni = Nikel
    .cu = Tambaga
    .zn = Seng
    .ga = Galium
    .ge = Gérmanium
    .as = Warangan
    .se = Sélénium
    .br = Bromin
    .kr = Kripton
    .rb = Rubidium
    .sr = Stronsium
    .y = Itrium
    .zr = Zirkonium
    .nb = Niobium
    .mo = Molibdenum
    .tc = Téknesium
    .ru = Ruténium
    .rh = Rodium
    .pd = Paladium
    .ag = Pérak
    .cd = Kadmium
    .in = Indium
    .sn = Timah
    .sb = Antimon
    .te = Telurium
    .i = Iodin
    .xe = Xénon
    .cs = Sésium
    .ba = Barium
    .la = Lantanum
    .ce = Sérium
    .pr = Praseodimium
    .nd = Néodimium
    .pm = Prométium
    .sm = Samarium
    .eu = Éuropium
    .gd = Gadolinium
    .tb = Térbium
    .dy = Disprosium
    .ho = Holmium
    .er = Érbium
    .tm = Tulium
    .yb = Itérbium
    .lu = Lutésium
    .hf = Hafnium
    .ta = Tantalum
    .w = Wolfram
    .re = Rénium
    .os = Osmium
    .ir = Iridium
    .pt = Platina
    .au = Emas
    .hg = Cai raksa
    .tl = Talium
    .pb = Timah hideung
    .bi = Bismut
    .po = Polonium
    .at = Astatin
    .rn = Radon
    .fr = Fransium
    .ra = Radium
    .ac = Aktinium
    .th = Torium
    .pa = Protaktinium
    .u = Uranium
    .np = Néptunium
    .pu = Plutonium
    .am = Amérisium
    .cm = Kurium
    .bk = Bérkelium
    .cf = Kalifornium
    .es = Éinsteinium
    .fm = Férmium
    .md = Méndelevium
    .no = Nobelium
    .lr = Lawrénsium
    .rf = Rutérfordium
    .db = Dubnium
    .sg = Seaborgium
    .bh = Bohrium
    .hs = Hasium
    .mt = Meitnerium
    .ds = Darmstadtium
    .rg = Roentgenium
    .cn = Kopérnisium
    .nh = Nihonium
    .fl = Flerovium
    .mc = Moskovium
    .lv = Livermorium
    .ts = Tenesin
    .og = Oganeson

element-anion-name =
    .h = Hidrida
    .c = Karbida
    .n = Nitrida
    .o = Oksida
    .f = Fluorida
    .p = Fosfida
    .s = Sulfida
    .cl = Klorida
    .br = Bromida
    .i = Iodida
    .at = Astatida
    .ts = Tenesida

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Simbol Kimia Teu Bener
chemistry-invalid-ionic-compound = Sanyawa Ionik Teu Bener
