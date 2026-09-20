# Malay content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Malay has no grammatical gender and no adjective agreement, so `$gender` and
# `$role` go unused here exactly as they do in English. Adjectives *follow* the
# noun they modify — «garis lurus tebal putus-putus merah» — so the composition
# messages put the noun first, as Vietnamese does, and keep the English order
# among the adjectives themselves.
#
# Malay has no article, so the two `-article` branches read like the ones
# without.


## Style vocabulary

color =
    .black = hitam
    .white = putih
    .gray = kelabu
    .red = merah
    .orange = jingga
    .yellow = kuning
    .green = hijau
    .cyan = biru kehijauan
    .blue = biru
    .purple = ungu
    .pink = merah jambu
    .brown = perang
line-width =
    .thick = tebal
    .thin = nipis
line-style =
    .dashed = putus-putus
    .dotted = bertitik
# Noun phrases: they follow «dengan» and modify nothing.
fill-style =
    .horizontal = garis mengufuk
    .vertical = garis menegak
    .diagonal = garis pepenjuru
    .backdiagonal = garis pepenjuru songsang
    .dots = titik
    .diamonds = rombus
noun =
    .line = garis lurus
    .line-segment = tembereng garis
    .ray = sinar
    .vector = vektor
    .curve = lengkung
    .function = fungsi
    .parabola = parabola
    .polyline = garis berbilang
    .polygon = poligon
    .triangle = segi tiga
    .rectangle = segi empat tepat
    .circle = bulatan
    .region = rantau
    .point = titik
    .square = segi empat sama
    .diamond = rombus
    .cross = tanda pangkah
    .plus = tanda campur
# The side count sits immediately after the noun — «poligon sekata bersisi 5» —
# before any adjective, so it folds into the head and there is no tail. Putting
# it after the adjectives would separate «bersisi» from the number counting it.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligon sekata bersisi { $numSides }
    }
# Malay has no grammatical gender, so every noun answers the same and the
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
# The noun leads and its adjectives follow: «garis lurus tebal putus-putus
# merah».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = berisi
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } dengan { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } dengan { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } dengan { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «sempadan» leads its own adjectives, the same way every noun here does.
style-border-clause =
    { $parts ->
        [with-article] dengan sempadan { $border }
        [and] dan sempadan { $border }
        [and-article] dan sempadan { $border }
       *[with] dengan sempadan { $border }
    }
# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = tidak berisi
style-text =
    { $parts ->
        [background] { $color } dengan latar belakang { $background }
       *[plain] { $color }
    }
style-background-none = tiada

## Boolean words

boolean-true = benar
boolean-false = palsu

## Answer buttons

answer-submit-label = Semak Jawapan
answer-submit-label-no-correctness = Hantar Jawapan

## Sectional blocks

section-name =
    .activity = Aktiviti
    .aside = Nota Tepi
    .cascade = Lata
    .definition = Takrif
    .example = Contoh
    .exercise = Latihan
    .exercises = Latihan
    .given-answer = Jawapan
    .note = Nota
    .objectives = Objektif
    .paragraphs = Perenggan
    .part = Bahagian
    .problem = Masalah
    .problems = Masalah
    .proof = Bukti
    .question = Soalan
    .section = Seksyen
    .solution = Penyelesaian
    .task = Tugasan
    .theorem = Teorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Petunjuk

## Tables and figures

table-name =
    { $parts ->
        [numbered] Jadual { $enumeration }
        [numbered-title] Jadual { $enumeration }{ ": " }
        [unnumbered-title] Jadual{ ": " }
       *[unnumbered] Jadual
    }
figure-name =
    { $parts ->
        [numbered] Rajah { $enumeration }
        [numbered-caption] Rajah { $enumeration }{ ": " }
        [unnumbered-caption] Rajah{ ": " }
       *[unnumbered] Rajah
    }

## Paginator controls

paginator-previous = Sebelumnya
paginator-next = Seterusnya
paginator-page = Halaman
paginator-page-status = { $pageLabel } { $currentPage } daripada { $numPages }

## Piecewise functions

piecewise-condition-or = atau
piecewise-condition-if = jika
piecewise-condition-otherwise = selainnya

## Chemistry

# The standardized Malay names, which are the forms Dewan Bahasa dan Pustaka
# settled and every Malaysian chemistry textbook prints. Several metals take
# the Latin stem rather than the English word — ferum, kuprum, argentum, aurum,
# stanum, plumbum — which is that standard's own choice and not a
# transliteration of English.
element-name =
    .h = hidrogen
    .he = helium
    .li = litium
    .be = berilium
    .b = boron
    .c = karbon
    .n = nitrogen
    .o = oksigen
    .f = fluorin
    .ne = neon
    .na = natrium
    .mg = magnesium
    .al = aluminium
    .si = silikon
    .p = fosforus
    .s = sulfur
    .cl = klorin
    .ar = argon
    .k = kalium
    .ca = kalsium
    .sc = skandium
    .ti = titanium
    .v = vanadium
    .cr = kromium
    .mn = mangan
    .fe = ferum
    .co = kobalt
    .ni = nikel
    .cu = kuprum
    .zn = zink
    .ga = galium
    .ge = germanium
    .as = arsenik
    .se = selenium
    .br = bromin
    .kr = kripton
    .rb = rubidium
    .sr = strontium
    .y = itrium
    .zr = zirkonium
    .nb = niobium
    .mo = molibdenum
    .tc = teknetium
    .ru = rutenium
    .rh = rodium
    .pd = paladium
    .ag = argentum
    .cd = kadmium
    .in = indium
    .sn = stanum
    .sb = antimoni
    .te = telurium
    .i = iodin
    .xe = xenon
    .cs = sesium
    .ba = barium
    .la = lantanum
    .ce = serium
    .pr = praseodimium
    .nd = neodimium
    .pm = prometium
    .sm = samarium
    .eu = europium
    .gd = gadolinium
    .tb = terbium
    .dy = disprosium
    .ho = holmium
    .er = erbium
    .tm = tulium
    .yb = iterbium
    .lu = lutetium
    .hf = hafnium
    .ta = tantalum
    .w = tungsten
    .re = renium
    .os = osmium
    .ir = iridium
    .pt = platinum
    .au = aurum
    .hg = merkuri
    .tl = talium
    .pb = plumbum
    .bi = bismut
    .po = polonium
    .at = astatin
    .rn = radon
    .fr = fransium
    .ra = radium
    .ac = aktinium
    .th = torium
    .pa = protaktinium
    .u = uranium
    .np = neptunium
    .pu = plutonium
    .am = amerisium
    .cm = kurium
    .bk = berkelium
    .cf = kalifornium
    .es = einsteinium
    .fm = fermium
    .md = mendelevium
    .no = nobelium
    .lr = lawrensium
    .rf = rutherfordium
    .db = dubnium
    .sg = seaborgium
    .bh = bohrium
    .hs = hassium
    .mt = meitnerium
    .ds = darmstadtium
    .rg = roentgenium
    .cn = kopernisium
    .nh = nihonium
    .fl = flerovium
    .mc = moskovium
    .lv = livermorium
    .ts = tennessin
    .og = oganeson
element-anion-name =
    .h = hidrida
    .c = karbida
    .n = nitrida
    .o = oksida
    .f = fluorida
    .p = fosfida
    .s = sulfida
    .cl = klorida
    .br = bromida
    .i = iodida
    .at = astatida
    .ts = tennessida
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbol Kimia Tidak Sah
chemistry-invalid-ionic-compound = Sebatian Ionik Tidak Sah
