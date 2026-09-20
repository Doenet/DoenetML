# Javanese content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# SPEECH LEVEL. Written in **ngoko**, the plain level, throughout — see the
# header of `chrome.ftl` for why the choice is made once for the whole locale
# rather than left open.
#
# Javanese has no grammatical gender, no adjective agreement, no article and no
# case, so `$gender` and `$role` go unused here exactly as they do in English,
# and the two `-article` branches read like the ones without.
#
# Adjectives *follow* the noun they modify — «garis kandel abang» — so the
# composition messages put the noun first, as Indonesian does, and keep the
# English order among the adjectives themselves.


## Style vocabulary

color =
    .black = ireng
    .white = putih
    .gray = abu-abu
    .red = abang
    .orange = oranye
    .yellow = kuning
    .green = ijo
    .cyan = sian
    .blue = biru
    .purple = ungu
    .pink = jambon
    .brown = soklat
line-width =
    .thick = kandel
    .thin = tipis
line-style =
    .dashed = pedhot-pedhot
    .dotted = titik-titik
# Noun phrases: they follow «karo» and modify nothing.
fill-style =
    .horizontal = garis mendhatar
    .vertical = garis jejeg
    .diagonal = garis miring
    .backdiagonal = garis miring walikan
    .dots = titik
    .diamonds = wajik
noun =
    .line = garis
    .line-segment = ruas garis
    .ray = sinar
    .vector = vèktor
    .curve = kurva
    .function = fungsi
    .parabola = parabola
    .polyline = garis pathah
    .polygon = poligon
    .triangle = segitiga
    .rectangle = pesagi dawa
    .circle = bunder
    .region = wilayah
    .point = titik
    .square = pesagi
    .diamond = wajik
    .cross = tandha silang
    .plus = tandha tambah
# The side count follows the noun and precedes its adjectives, so it folds into
# the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligon ajeg sisi { $numSides }
    }
# Javanese has no grammatical gender, so every noun answers the same and the
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
# The noun leads and its adjectives follow: «garis kandel pedhot-pedhot abang».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = kebak
style-filled =
    { $parts ->
        [pattern] { $color } { $filled } karo { $pattern }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } karo { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } karo { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }
# Javanese needs no article, so the `-article` branches read like the ones
# without.
style-border-clause =
    { $parts ->
        [with-article] karo pinggiran { $border }
        [and] lan pinggiran { $border }
        [and-article] lan pinggiran { $border }
       *[with] karo pinggiran { $border }
    }
# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = ora kebak
style-text =
    { $parts ->
        [background] { $color } karo latar { $background }
       *[plain] { $color }
    }
style-background-none = ora ana

## Boolean words

boolean-true = bener
boolean-false = salah

## Answer buttons

answer-submit-label = Priksa Garapan
answer-submit-label-no-correctness = Kirim Wangsulan

## Sectional blocks

section-name =
    .activity = Kagiyatan
    .aside = Sisipan
    .cascade = Runtutan
    .definition = Definisi
    .example = Tuladha
    .exercise = Gladhèn
    .exercises = Gladhèn
    .given-answer = Wangsulan
    .note = Cathetan
    .objectives = Ancas
    .paragraphs = Paragraf
    .part = Pérangan
    .problem = Soal
    .problems = Soal
    .proof = Bukti
    .question = Pitakon
    .section = Bagéan
    .solution = Pamecahan
    .task = Tugas
    .theorem = Tèoréma
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
        [numbered] Tabèl { $enumeration }
        [numbered-title] Tabèl { $enumeration }{ ": " }
        [unnumbered-title] Tabèl{ ": " }
       *[unnumbered] Tabèl
    }
figure-name =
    { $parts ->
        [numbered] Gambar { $enumeration }
        [numbered-caption] Gambar { $enumeration }{ ": " }
        [unnumbered-caption] Gambar{ ": " }
       *[unnumbered] Gambar
    }

## Paginator controls

paginator-previous = Sadurungé
paginator-next = Sabanjuré
paginator-page = Kaca
paginator-page-status = { $pageLabel } { $currentPage } saka { $numPages }

## Piecewise functions

piecewise-condition-or = utawa
piecewise-condition-if = yèn
piecewise-condition-otherwise = liyané

## Chemistry
##
## Javanese school chemistry is taught out of Indonesian-language textbooks, so
## the scientific names here are the Indonesian ones — which is what a Javanese
## text writing about chemistry uses, and what `locales/id` already supplies.
##
## The exceptions are the substances Java knew long before their elements were
## isolated, and those keep their own Javanese words rather than the Indonesian
## scientific ones: «wesi» iron, «tembaga» copper, «salaka» silver, «emas»
## gold, «timah» tin, «timbel» lead, «raksa» mercury, «walirang» sulfur, «seng»
## zinc and «warangan» arsenic — the last of which is a Javanese word in its own
## right rather than a borrowing.

element-name =
    .h = Hidrogèn
    .he = Hèlium
    .li = Litium
    .be = Bèrilium
    .b = Boron
    .c = Karbon
    .n = Nitrogèn
    .o = Oksigèn
    .f = Fluorin
    .ne = Nèon
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
    .fe = Wesi
    .co = Kobalt
    .ni = Nikel
    .cu = Tembaga
    .zn = Seng
    .ga = Galium
    .ge = Gèrmanium
    .as = Warangan
    .se = Sèlenium
    .br = Bromin
    .kr = Kripton
    .rb = Rubidium
    .sr = Stronsium
    .y = Itrium
    .zr = Zirkonium
    .nb = Niobium
    .mo = Molibdenum
    .tc = Tèknesium
    .ru = Rutènium
    .rh = Rodium
    .pd = Paladium
    .ag = Salaka
    .cd = Kadmium
    .in = Indium
    .sn = Timah
    .sb = Antimon
    .te = Telurium
    .i = Iodin
    .xe = Xènon
    .cs = Sèsium
    .ba = Barium
    .la = Lantanum
    .ce = Sèrium
    .pr = Praseodimium
    .nd = Nèodimium
    .pm = Promètium
    .sm = Samarium
    .eu = Èuropium
    .gd = Gadolinium
    .tb = Tèrbium
    .dy = Disprosium
    .ho = Holmium
    .er = Èrbium
    .tm = Tulium
    .yb = Itèrbium
    .lu = Lutèsium
    .hf = Hafnium
    .ta = Tantalum
    .w = Wolfram
    .re = Rènium
    .os = Osmium
    .ir = Iridium
    .pt = Platina
    .au = Emas
    .hg = Raksa
    .tl = Talium
    .pb = Timbel
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
    .np = Nèptunium
    .pu = Plutonium
    .am = Amèrisium
    .cm = Kurium
    .bk = Bèrkelium
    .cf = Kalifornium
    .es = Èinsteinium
    .fm = Fèrmium
    .md = Mèndelevium
    .no = Nobelium
    .lr = Lawrènsium
    .rf = Rutèrfordium
    .db = Dubnium
    .sg = Seaborgium
    .bh = Bohrium
    .hs = Hasium
    .mt = Meitnerium
    .ds = Darmstadtium
    .rg = Roentgenium
    .cn = Kopèrnisium
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
chemistry-invalid-symbol = Simbol Kimia Ora Bener
chemistry-invalid-ionic-compound = Senyawa Ionik Ora Bener
