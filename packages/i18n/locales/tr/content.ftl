# Turkish content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Turkish has no grammatical gender and does not inflect an attributive
# adjective for case or number, so both `$gender` and `$role` go unused here
# exactly as they do in English. Adjectives precede the noun, as in English, so
# the composition messages keep the English order.
#
# Turkish is agglutinative, and the suffixes that would matter here attach to
# the *noun*, not to the adjectives in front of it — which is why nothing below
# has to vary. `kenarlıklı` ("bordered") carries its own suffix and takes the
# border's description in front of it unchanged.


## Style vocabulary

color =
    .black = siyah
    .white = beyaz
    .gray = gri
    .red = kırmızı
    .orange = turuncu
    .yellow = sarı
    .green = yeşil
    .cyan = camgöbeği
    .blue = mavi
    .purple = mor
    .pink = pembe
    .brown = kahverengi

line-width =
    .thick = kalın
    .thin = ince

line-style =
    .dashed = kesikli
    .dotted = noktalı

# Noun phrases: they precede `desenli` and modify nothing.
fill-style =
    .horizontal = yatay çizgi
    .vertical = dikey çizgi
    .diagonal = çapraz çizgi
    .backdiagonal = ters çapraz çizgi
    .dots = nokta
    .diamonds = baklava dilimi

noun =
    .line = doğru
    .line-segment = doğru parçası
    .ray = ışın
    .vector = vektör
    .curve = eğri
    .function = fonksiyon
    .parabola = parabol
    .polyline = kırık çizgi
    .polygon = çokgen
    .triangle = üçgen
    .rectangle = dikdörtgen
    .circle = çember
    .region = bölge
    .point = nokta
    .square = kare
    .diamond = eşkenar dörtgen
    .cross = çarpı
    .plus = artı

# Turkish builds the word from the side count itself — düzgün beşgen — so the
# whole thing is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] düzgün { $numSides }-gen
    }

# Turkish has no grammatical gender, so every noun answers the same and the
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

style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

style-filled-word = dolgulu

style-filled =
    { $parts ->
        [pattern] { $pattern } desenli { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } desenli { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } desenli { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# `kenarlıklı` carries the "with a border" sense in its own suffix, so no
# preposition and no article is needed — which makes all four branches the same
# except for the connective English needs and Turkish does not.
style-border-clause =
    { $parts ->
        [with-article] { $border } kenarlıklı
        [and] ve { $border } kenarlıklı
        [and-article] ve { $border } kenarlıklı
       *[with] { $border } kenarlıklı
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = dolgusuz

style-text =
    { $parts ->
        [background] { $background } zemin üzerinde { $color }
       *[plain] { $color }
    }

style-background-none = yok


## Boolean words

boolean-true = doğru
boolean-false = yanlış


## Answer buttons

answer-submit-label = Kontrol et
answer-submit-label-no-correctness = Yanıtı gönder


## Sectional blocks

section-name =
    .activity = Etkinlik
    .aside = Yan not
    .cascade = Kaskat
    .definition = Tanım
    .example = Örnek
    .exercise = Alıştırma
    .exercises = Alıştırmalar
    .given-answer = Cevap
    .note = Not
    .objectives = Hedefler
    .paragraphs = Paragraflar
    .part = Bölüm
    .problem = Problem
    .problems = Problemler
    .proof = İspat
    .question = Soru
    .section = Kısım
    .solution = Çözüm
    .task = Görev
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
        [numbered] Tablo { $enumeration }
        [numbered-title] Tablo { $enumeration }{ ": " }
        [unnumbered-title] Tablo{ ": " }
       *[unnumbered] Tablo
    }

figure-name =
    { $parts ->
        [numbered] Şekil { $enumeration }
        [numbered-caption] Şekil { $enumeration }{ ": " }
        [unnumbered-caption] Şekil{ ": " }
       *[unnumbered] Şekil
    }


## Paginator controls

paginator-previous = Önceki
paginator-next = Sonraki
paginator-page = Sayfa

paginator-page-status = { $numPages } { $pageLabel } içinden { $currentPage }


## Piecewise functions

piecewise-condition-or = veya
piecewise-condition-if = eğer
piecewise-condition-otherwise = aksi halde


## Chemistry

element-name =
    .h = Hidrojen
    .he = Helyum
    .li = Lityum
    .be = Berilyum
    .b = Bor
    .c = Karbon
    .n = Azot
    .o = Oksijen
    .f = Flor
    .ne = Neon
    .na = Sodyum
    .mg = Magnezyum
    .al = Alüminyum
    .si = Silisyum
    .p = Fosfor
    .s = Kükürt
    .cl = Klor
    .ar = Argon
    .k = Potasyum
    .ca = Kalsiyum
    .sc = Skandiyum
    .ti = Titanyum
    .v = Vanadyum
    .cr = Krom
    .mn = Manganez
    .fe = Demir
    .co = Kobalt
    .ni = Nikel
    .cu = Bakır
    .zn = Çinko
    .ga = Galyum
    .ge = Germanyum
    .as = Arsenik
    .se = Selenyum
    .br = Brom
    .kr = Kripton
    .rb = Rubidyum
    .sr = Stronsiyum
    .y = İtriyum
    .zr = Zirkonyum
    .nb = Niyobyum
    .mo = Molibden
    .tc = Teknesyum
    .ru = Rutenyum
    .rh = Rodyum
    .pd = Paladyum
    .ag = Gümüş
    .cd = Kadmiyum
    .in = İndiyum
    .sn = Kalay
    .sb = Antimon
    .te = Tellür
    .i = İyot
    .xe = Ksenon
    .cs = Sezyum
    .ba = Baryum
    .la = Lantan
    .ce = Seryum
    .pr = Praseodim
    .nd = Neodim
    .pm = Prometyum
    .sm = Samaryum
    .eu = Evropiyum
    .gd = Gadolinyum
    .tb = Terbiyum
    .dy = Disprosyum
    .ho = Holmiyum
    .er = Erbiyum
    .tm = Tulyum
    .yb = İterbiyum
    .lu = Lutesyum
    .hf = Hafniyum
    .ta = Tantal
    .w = Tungsten
    .re = Renyum
    .os = Osmiyum
    .ir = İridyum
    .pt = Platin
    .au = Altın
    .hg = Cıva
    .tl = Talyum
    .pb = Kurşun
    .bi = Bizmut
    .po = Polonyum
    .at = Astatin
    .rn = Radon
    .fr = Fransiyum
    .ra = Radyum
    .ac = Aktinyum
    .th = Toryum
    .pa = Protaktinyum
    .u = Uranyum
    .np = Neptünyum
    .pu = Plütonyum
    .am = Amerikyum
    .cm = Küriyum
    .bk = Berkelyum
    .cf = Kaliforniyum
    .es = Aynştaynyum
    .fm = Fermiyum
    .md = Mendelevyum
    .no = Nobelyum
    .lr = Lavrensiyum
    .rf = Rutherfordiyum
    .db = Dubniyum
    .sg = Seaborgiyum
    .bh = Bohriyum
    .hs = Hassiyum
    .mt = Meitneriyum
    .ds = Darmstadtiyum
    .rg = Röntgenyum
    .cn = Kopernikyum
    .nh = Nihonyum
    .fl = Flerovyum
    .mc = Moskovyum
    .lv = Livermoryum
    .ts = Tennessin
    .og = Oganesson

element-anion-name =
    .h = Hidrür
    .c = Karbür
    .n = Nitrür
    .o = Oksit
    .f = Florür
    .p = Fosfür
    .s = Sülfür
    .cl = Klorür
    .br = Bromür
    .i = İyodür
    .at = Astatür
    .ts = Tennessür

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Geçersiz kimyasal sembol
chemistry-invalid-ionic-compound = Geçersiz iyonik bileşik
