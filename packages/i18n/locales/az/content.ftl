# Azerbaijani content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Latin alphabet, which is Azerbaijan's official one and what
# CLDR fills a bare `az` in as. A reader arriving under `az-Cyrl` or `az-Arab`
# reaches this catalog and gets Latin — the same asymmetry `locales/pa` and
# `locales/ha` already have, and the answer to it is a second catalog rather
# than a differently named first one.
#
# Azerbaijani has no grammatical gender and does not inflect an attributive
# adjective, so both `$gender` and `$role` go unused here exactly as they do in
# English and Turkish. Adjectives precede the noun, so the composition messages
# keep the English order.
#
# What the two clauses are marked with is a suffix on the *noun* — «haşiyəli»,
# «üzərində» — and the noun is one this catalog writes, so nothing has to be
# welded to a placeable. The suffix's own vowels follow the word it attaches
# to, which is why they are spelled out here rather than derived.


## Style vocabulary

color =
    .black = qara
    .white = ağ
    .gray = boz
    .red = qırmızı
    .orange = narıncı
    .yellow = sarı
    .green = yaşıl
    .cyan = firuzəyi
    .blue = mavi
    .purple = bənövşəyi
    .pink = çəhrayı
    .brown = qəhvəyi

line-width =
    .thick = qalın
    .thin = nazik

line-style =
    .dashed = qırıq-qırıq
    .dotted = nöqtəli

# Noun phrases: they stand in front of «naxışlı» and modify nothing.
fill-style =
    .horizontal = üfüqi xətt
    .vertical = şaquli xətt
    .diagonal = diaqonal xətt
    .backdiagonal = əks diaqonal xətt
    .dots = nöqtə
    .diamonds = romb

noun =
    .line = düz xətt
    .line-segment = parça
    .ray = şüa
    .vector = vektor
    .curve = əyri
    .function = funksiya
    .parabola = parabola
    .polyline = sınıq xətt
    .polygon = çoxbucaqlı
    .triangle = üçbucaq
    .rectangle = düzbucaqlı
    .circle = çevrə
    .region = sahə
    .point = nöqtə
    .square = kvadrat
    .diamond = romb
    .cross = çarpaz
    .plus = plus

# Azerbaijani builds the word from the side count in front of the noun, so the
# whole of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] düzgün { $numSides }-bucaqlı
    }

# Azerbaijani has no grammatical gender, so every noun answers the same and the
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

style-filled-word = doldurulmuş

style-filled =
    { $parts ->
        [pattern] { $pattern } naxışlı { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } naxışlı { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } naxışlı { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «haşiyəli» — "bordered" — carries the "with a border" sense in its own suffix,
# so neither a preposition nor an article is wanted, and all four branches read
# alike except for the connective English needs and Azerbaijani does not.
style-border-clause =
    { $parts ->
        [with-article] { $border } haşiyəli
        [and] və { $border } haşiyəli
        [and-article] və { $border } haşiyəli
       *[with] { $border } haşiyəli
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } naxışlı { $color } dolğu
       *[plain] { $color } dolğu
    }

style-unfilled = doldurulmamış

style-text =
    { $parts ->
        [background] { $background } fon üzərində { $color }
       *[plain] { $color }
    }

style-background-none = yoxdur


## Boolean words

boolean-true = doğru
boolean-false = yanlış


## Answer buttons

answer-submit-label = Yoxla
answer-submit-label-no-correctness = Cavabı göndər


## Sectional blocks

section-name =
    .activity = Fəaliyyət
    .aside = Kənar qeyd
    .cascade = Kaskad
    .definition = Tərif
    .example = Misal
    .exercise = Çalışma
    .exercises = Çalışmalar
    .given-answer = Cavab
    .note = Qeyd
    .objectives = Məqsədlər
    .paragraphs = Abzaslar
    .part = Hissə
    .problem = Məsələ
    .problems = Məsələlər
    .proof = İsbat
    .question = Sual
    .section = Bölmə
    .solution = Həll
    .task = Tapşırıq
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

hint-title = İpucu


## Tables and figures

table-name =
    { $parts ->
        [numbered] Cədvəl { $enumeration }
        [numbered-title] Cədvəl { $enumeration }{ ": " }
        [unnumbered-title] Cədvəl{ ": " }
       *[unnumbered] Cədvəl
    }

figure-name =
    { $parts ->
        [numbered] Şəkil { $enumeration }
        [numbered-caption] Şəkil { $enumeration }{ ": " }
        [unnumbered-caption] Şəkil{ ": " }
       *[unnumbered] Şəkil
    }


## Paginator controls

paginator-previous = Əvvəlki
paginator-next = Sonrakı
paginator-page = Səhifə

paginator-page-status = { $numPages } { $pageLabel } içərisindən { $currentPage }


## Piecewise functions

piecewise-condition-or = və ya
piecewise-condition-if = əgər
piecewise-condition-otherwise = əks halda


## Chemistry

element-name =
    .h = Hidrogen
    .he = Helium
    .li = Litium
    .be = Berillium
    .b = Bor
    .c = Karbon
    .n = Azot
    .o = Oksigen
    .f = Flüor
    .ne = Neon
    .na = Natrium
    .mg = Maqnezium
    .al = Alüminium
    .si = Silisium
    .p = Fosfor
    .s = Kükürd
    .cl = Xlor
    .ar = Arqon
    .k = Kalium
    .ca = Kalsium
    .sc = Skandium
    .ti = Titan
    .v = Vanadium
    .cr = Xrom
    .mn = Manqan
    .fe = Dəmir
    .co = Kobalt
    .ni = Nikel
    .cu = Mis
    .zn = Sink
    .ga = Qallium
    .ge = Germanium
    .as = Arsen
    .se = Selen
    .br = Brom
    .kr = Kripton
    .rb = Rubidium
    .sr = Stronsium
    .y = İttrium
    .zr = Sirkonium
    .nb = Niobium
    .mo = Molibden
    .tc = Texnesium
    .ru = Rutenium
    .rh = Rodium
    .pd = Palladium
    .ag = Gümüş
    .cd = Kadmium
    .in = İndium
    .sn = Qalay
    .sb = Stibium
    .te = Tellur
    .i = Yod
    .xe = Ksenon
    .cs = Sezium
    .ba = Barium
    .la = Lantan
    .ce = Serium
    .pr = Prazeodim
    .nd = Neodim
    .pm = Prometium
    .sm = Samarium
    .eu = Evropium
    .gd = Qadolinium
    .tb = Terbium
    .dy = Disprozium
    .ho = Holmium
    .er = Erbium
    .tm = Tulium
    .yb = İtterbium
    .lu = Lütesium
    .hf = Hafnium
    .ta = Tantal
    .w = Volfram
    .re = Renium
    .os = Osmium
    .ir = İridium
    .pt = Platin
    .au = Qızıl
    .hg = Civə
    .tl = Tallium
    .pb = Qurğuşun
    .bi = Bismut
    .po = Polonium
    .at = Astat
    .rn = Radon
    .fr = Fransium
    .ra = Radium
    .ac = Aktinium
    .th = Torium
    .pa = Protaktinium
    .u = Uran
    .np = Neptunium
    .pu = Plutonium
    .am = Amerisium
    .cm = Kürium
    .bk = Berkelium
    .cf = Kalifornium
    .es = Eynşteynium
    .fm = Fermium
    .md = Mendelevium
    .no = Nobelium
    .lr = Lourensium
    .rf = Rezerfordium
    .db = Dubnium
    .sg = Siborgium
    .bh = Borium
    .hs = Hassium
    .mt = Maytnerium
    .ds = Darmştadtium
    .rg = Rentgenium
    .cn = Kopernisium
    .nh = Nihonium
    .fl = Flerovium
    .mc = Moskovium
    .lv = Livermorium
    .ts = Tennessin
    .og = Oqanesson

element-anion-name =
    .h = Hidrid
    .c = Karbid
    .n = Nitrid
    .o = Oksid
    .f = Florid
    .p = Fosfid
    .s = Sulfid
    .cl = Xlorid
    .br = Bromid
    .i = Yodid
    .at = Astatid
    .ts = Tennessid

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Yanlış kimyəvi simvol
chemistry-invalid-ionic-compound = Yanlış ion birləşməsi
