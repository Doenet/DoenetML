# Turkmen content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Latin alphabet, which is Turkmenistan's official one and what
# CLDR fills a bare `tk` in as.
#
# Turkmen has no grammatical gender and does not inflect an attributive
# adjective, so both `$gender` and `$role` go unused here exactly as they do in
# English and Turkish. Adjectives precede the noun, so the composition messages
# keep the English order.
#
# The two clauses are marked by a suffix on the *noun* — «gyraly», «fonda» —
# and that noun is one this catalog writes, so nothing is welded to a placeable.


## Style vocabulary

color =
    .black = gara
    .white = ak
    .gray = çal
    .red = gyzyl
    .orange = mämişi
    .yellow = sary
    .green = ýaşyl
    .cyan = açyk gök
    .blue = gök
    .purple = benewşe
    .pink = gülgüne
    .brown = goňur
line-width =
    .thick = ýogyn
    .thin = inçe
line-style =
    .dashed = kesik-kesik
    .dotted = nokatly
# Noun phrases: they stand in front of «nagyşly» and modify nothing.
fill-style =
    .horizontal = keseligine çyzyk
    .vertical = dikligine çyzyk
    .diagonal = diagonal çyzyk
    .backdiagonal = ters diagonal çyzyk
    .dots = nokat
    .diamonds = romb
noun =
    .line = göni çyzyk
    .line-segment = kesim
    .ray = şöhle
    .vector = wektor
    .curve = egri çyzyk
    .function = funksiýa
    .parabola = parabola
    .polyline = döwük çyzyk
    .polygon = köpburçluk
    .triangle = üçburçluk
    .rectangle = gönüburçluk
    .circle = tegelek
    .region = sebit
    .point = nokat
    .square = inedördül
    .diamond = romb
    .cross = haç
    .plus = plýus
# Turkmen builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] dogry { $numSides }-burçluk
    }
# Turkmen has no grammatical gender, so every noun answers the same and the
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
style-filled-word = boýalan
style-filled =
    { $parts ->
        [pattern] { $pattern } nagyşly { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } nagyşly { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } nagyşly { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «gyraly» — "bordered" — carries the "with a border" sense in its own suffix,
# so neither a preposition nor an article is wanted, and all four branches read
# alike except for the connective English needs and Turkmen does not.
style-border-clause =
    { $parts ->
        [with-article] { $border } gyraly
        [and] we { $border } gyraly
        [and-article] we { $border } gyraly
       *[with] { $border } gyraly
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } nagyşly { $color } boýag
       *[plain] { $color } boýag
    }
style-unfilled = boýalmadyk
# «fonda» is the locative of «fon» and says "on the background" by itself, so
# nothing stands between the two colours.
style-text =
    { $parts ->
        [background] { $background } fonda { $color }
       *[plain] { $color }
    }
style-background-none = ýok

## Boolean words

boolean-true = dogry
boolean-false = ýalňyş

## Answer buttons

answer-submit-label = Barla
answer-submit-label-no-correctness = Jogaby iber

## Sectional blocks

section-name =
    .activity = Işjeňlik
    .aside = Gyra bellik
    .cascade = Kaskad
    .definition = Kesgitleme
    .example = Mysal
    .exercise = Maşk
    .exercises = Maşklar
    .given-answer = Jogap
    .note = Bellik
    .objectives = Maksatlar
    .paragraphs = Abzaslar
    .part = Bölek
    .problem = Mesele
    .problems = Meseleler
    .proof = Subutnama
    .question = Sorag
    .section = Bölüm
    .solution = Çözgüt
    .task = Ýumuş
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
        [numbered] Tablisa { $enumeration }
        [numbered-title] Tablisa { $enumeration }{ ". " }
        [unnumbered-title] Tablisa{ ". " }
       *[unnumbered] Tablisa
    }
figure-name =
    { $parts ->
        [numbered] Surat { $enumeration }
        [numbered-caption] Surat { $enumeration }{ ". " }
        [unnumbered-caption] Surat{ ". " }
       *[unnumbered] Surat
    }

## Paginator controls

paginator-previous = Öňki
paginator-next = Indiki
paginator-page = Sahypa
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = ýa-da
piecewise-condition-if = eger
piecewise-condition-otherwise = bolmasa

## Chemistry

element-name =
    .h = Wodorod
    .he = Geliý
    .li = Litiý
    .be = Berilliý
    .b = Bor
    .c = Uglerod
    .n = Azot
    .o = Kislorod
    .f = Ftor
    .ne = Neon
    .na = Natriý
    .mg = Magniý
    .al = Alýuminiý
    .si = Kremniý
    .p = Fosfor
    .s = Kükürt
    .cl = Hlor
    .ar = Argon
    .k = Kaliý
    .ca = Kalsiý
    .sc = Skandiý
    .ti = Titan
    .v = Wanadiý
    .cr = Hrom
    .mn = Marganes
    .fe = Demir
    .co = Kobalt
    .ni = Nikel
    .cu = Mis
    .zn = Sink
    .ga = Galliý
    .ge = Germaniý
    .as = Myşýak
    .se = Selen
    .br = Brom
    .kr = Kripton
    .rb = Rubidiý
    .sr = Stronsiý
    .y = Ittriý
    .zr = Sirkoniý
    .nb = Niobiý
    .mo = Molibden
    .tc = Tehnesiý
    .ru = Ruteniý
    .rh = Rodiý
    .pd = Palladiý
    .ag = Kümüş
    .cd = Kadmiý
    .in = Indiý
    .sn = Galaýy
    .sb = Surma
    .te = Tellur
    .i = Ýod
    .xe = Ksenon
    .cs = Seziý
    .ba = Bariý
    .la = Lantan
    .ce = Seriý
    .pr = Prazeodim
    .nd = Neodim
    .pm = Prometiý
    .sm = Samariý
    .eu = Ýewropiý
    .gd = Gadoliniý
    .tb = Terbiý
    .dy = Disproziý
    .ho = Golmiý
    .er = Erbiý
    .tm = Tuliý
    .yb = Itterbiý
    .lu = Lýutesiý
    .hf = Gafniý
    .ta = Tantal
    .w = Wolfram
    .re = Reniý
    .os = Osmiý
    .ir = Iridiý
    .pt = Platina
    .au = Altyn
    .hg = Simap
    .tl = Talliý
    .pb = Gurşun
    .bi = Wismut
    .po = Poloniý
    .at = Astat
    .rn = Radon
    .fr = Fransiý
    .ra = Radiý
    .ac = Aktiniý
    .th = Toriý
    .pa = Protaktiniý
    .u = Uran
    .np = Neptuniý
    .pu = Plutoniý
    .am = Amerisiý
    .cm = Kýuriý
    .bk = Berkliý
    .cf = Kaliforniý
    .es = Eýnşteýniý
    .fm = Fermiý
    .md = Mendelewiý
    .no = Nobeliý
    .lr = Lourensiý
    .rf = Rezerfordiý
    .db = Dubniý
    .sg = Siborgiý
    .bh = Boriý
    .hs = Hassiý
    .mt = Meýtneriý
    .ds = Darmştadtiý
    .rg = Rentgeniý
    .cn = Kopernisiý
    .nh = Nihoniý
    .fl = Flerowiý
    .mc = Moskowiý
    .lv = Liwermoriý
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
    .cl = Hlorid
    .br = Bromid
    .i = Ýodid
    .at = Astatid
    .ts = Tennessid
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Nädogry himiki belgi
chemistry-invalid-ionic-compound = Nädogry ion birleşmesi
