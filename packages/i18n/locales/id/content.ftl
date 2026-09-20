# Indonesian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Indonesian has no grammatical gender and no adjective agreement, so `$gender`
# goes unused here exactly as it does in English. Adjectives *follow* the noun
# they modify — "garis tebal putus-putus merah" — so the composition messages
# put the noun first, as Spanish does, while keeping the English order among
# the adjectives themselves.


## Style vocabulary

color =
    .black = hitam
    .white = putih
    .gray = abu-abu
    .red = merah
    .orange = oranye
    .yellow = kuning
    .green = hijau
    .cyan = sian
    .blue = biru
    .purple = ungu
    .pink = merah muda
    .brown = cokelat
line-width =
    .thick = tebal
    .thin = tipis
line-style =
    .dashed = putus-putus
    .dotted = titik-titik
# Noun phrases: they follow "dengan" and modify nothing.
fill-style =
    .horizontal = garis mendatar
    .vertical = garis tegak
    .diagonal = garis diagonal
    .backdiagonal = garis diagonal terbalik
    .dots = titik
    .diamonds = belah ketupat
noun =
    .line = garis
    .line-segment = ruas garis
    .ray = sinar
    .vector = vektor
    .curve = kurva
    .function = fungsi
    .parabola = parabola
    .polyline = garis patah
    .polygon = poligon
    .triangle = segitiga
    .rectangle = persegi panjang
    .circle = lingkaran
    .region = daerah
    .point = titik
    .square = persegi
    .diamond = belah ketupat
    .cross = silang
    .plus = tanda tambah
# `bersisi 5` binds to the noun rather than to the adjectives, so it folds into
# the head and there is no tail. Placing it after the adjectives would read as
# though the colour, not the polygon, had five sides.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligon beraturan bersisi { $numSides }
    }
# Indonesian has no grammatical gender, so every noun answers the same and the
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
# The noun leads and its adjectives follow: "garis tebal putus-putus merah".
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = terisi
style-filled =
    { $parts ->
        [pattern] { $color } { $filled } dengan { $pattern }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } dengan { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } dengan { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }
# Indonesian needs no article, so the `-article` branches read the same as the
# ones without.
style-border-clause =
    { $parts ->
        [with-article] dengan batas { $border }
        [and] dan batas { $border }
        [and-article] dan batas { $border }
       *[with] dengan batas { $border }
    }
# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = tidak terisi
style-text =
    { $parts ->
        [background] { $color } dengan latar { $background }
       *[plain] { $color }
    }
style-background-none = tidak ada

## Boolean words

boolean-true = benar
boolean-false = salah

## Answer buttons

answer-submit-label = Periksa
answer-submit-label-no-correctness = Kirim jawaban

## Sectional blocks

section-name =
    .activity = Aktivitas
    .aside = Sisipan
    .cascade = Kaskade
    .definition = Definisi
    .example = Contoh
    .exercise = Latihan
    .exercises = Latihan
    .given-answer = Jawaban
    .note = Catatan
    .objectives = Tujuan
    .paragraphs = Paragraf
    .part = Bab
    .problem = Soal
    .problems = Soal
    .proof = Bukti
    .question = Pertanyaan
    .section = Bagian
    .solution = Penyelesaian
    .task = Tugas
    .theorem = Teorema
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
        [numbered] Tabel { $enumeration }
        [numbered-title] Tabel { $enumeration }{ ": " }
        [unnumbered-title] Tabel{ ": " }
       *[unnumbered] Tabel
    }
figure-name =
    { $parts ->
        [numbered] Gambar { $enumeration }
        [numbered-caption] Gambar { $enumeration }{ ": " }
        [unnumbered-caption] Gambar{ ": " }
       *[unnumbered] Gambar
    }

## Paginator controls

paginator-previous = Sebelumnya
paginator-next = Berikutnya
paginator-page = Halaman
paginator-page-status = { $pageLabel } { $currentPage } dari { $numPages }

## Piecewise functions

piecewise-condition-or = atau
piecewise-condition-if = jika
piecewise-condition-otherwise = selainnya

## Chemistry

element-name =
    .h = Hidrogen
    .he = Helium
    .li = Litium
    .be = Berilium
    .b = Boron
    .c = Karbon
    .n = Nitrogen
    .o = Oksigen
    .f = Fluorin
    .ne = Neon
    .na = Natrium
    .mg = Magnesium
    .al = Aluminium
    .si = Silikon
    .p = Fosforus
    .s = Belerang
    .cl = Klorin
    .ar = Argon
    .k = Kalium
    .ca = Kalsium
    .sc = Skandium
    .ti = Titanium
    .v = Vanadium
    .cr = Kromium
    .mn = Mangan
    .fe = Besi
    .co = Kobalt
    .ni = Nikel
    .cu = Tembaga
    .zn = Seng
    .ga = Galium
    .ge = Germanium
    .as = Arsen
    .se = Selenium
    .br = Bromin
    .kr = Kripton
    .rb = Rubidium
    .sr = Stronsium
    .y = Itrium
    .zr = Zirkonium
    .nb = Niobium
    .mo = Molibdenum
    .tc = Teknesium
    .ru = Rutenium
    .rh = Rodium
    .pd = Paladium
    .ag = Perak
    .cd = Kadmium
    .in = Indium
    .sn = Timah
    .sb = Antimon
    .te = Telurium
    .i = Iodin
    .xe = Xenon
    .cs = Sesium
    .ba = Barium
    .la = Lantanum
    .ce = Serium
    .pr = Praseodimium
    .nd = Neodimium
    .pm = Prometium
    .sm = Samarium
    .eu = Europium
    .gd = Gadolinium
    .tb = Terbium
    .dy = Disprosium
    .ho = Holmium
    .er = Erbium
    .tm = Tulium
    .yb = Iterbium
    .lu = Lutesium
    .hf = Hafnium
    .ta = Tantalum
    .w = Wolfram
    .re = Renium
    .os = Osmium
    .ir = Iridium
    .pt = Platina
    .au = Emas
    .hg = Raksa
    .tl = Talium
    .pb = Timbal
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
    .np = Neptunium
    .pu = Plutonium
    .am = Amerisium
    .cm = Kurium
    .bk = Berkelium
    .cf = Kalifornium
    .es = Einsteinium
    .fm = Fermium
    .md = Mendelevium
    .no = Nobelium
    .lr = Lawrensium
    .rf = Ruterfordium
    .db = Dubnium
    .sg = Seaborgium
    .bh = Bohrium
    .hs = Hasium
    .mt = Meitnerium
    .ds = Darmstadtium
    .rg = Roentgenium
    .cn = Kopernisium
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
chemistry-invalid-symbol = Simbol kimia tidak valid
chemistry-invalid-ionic-compound = Senyawa ion tidak valid
