# Hungarian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Hungarian has no grammatical gender, and an attributive adjective does not
# inflect for case or number, so `$gender` and `$role` go unused here exactly
# as they do in English. Adjectives precede the noun, so the composition
# messages keep the English order.
#
# What Hungarian does instead is agglutinate, and the suffixes attach to the
# **noun**. Where that noun is written here — «keret», «háttér» — the suffix is
# written with it and there is nothing to decide: «kerettel», «háttéren».
# Where it is an argument, the suffix has nowhere to attach, because vowel
# harmony picks its shape from the word it lands on. Two messages are
# restructured for that reason:
#
# - The fill pattern would be «rombuszokkal kitöltött» — an instrumental on the
#   pattern name. Instead the pattern modifies the noun «minta», which is
#   written here and can carry the suffix: «rombusz mintával kitöltött».
# - `paginator-page-status` would read «5-ből», an elative on a numeral, and
#   which of «-ból»/«-ből» a numeral takes depends on how the digit is *read*.
#   It uses a slash instead.
#
# A regular polygon's side count is a separate word («5 oldalú»), so it needs
# nothing of the sort.


## Style vocabulary

color =
    .black = fekete
    .white = fehér
    .gray = szürke
    .red = piros
    .orange = narancssárga
    .yellow = sárga
    .green = zöld
    .cyan = ciánkék
    .blue = kék
    .purple = lila
    .pink = rózsaszín
    .brown = barna

line-width =
    .thick = vastag
    .thin = vékony

line-style =
    .dashed = szaggatott
    .dotted = pontozott

# Bare singular nouns, because they are used as compound modifiers of «minta»
# rather than as nouns of their own: «rombusz mintával», «pont mintával». That
# is what lets the instrumental suffix stay on a word this catalog writes.
fill-style =
    .horizontal = vízszintes vonal
    .vertical = függőleges vonal
    .diagonal = átlós vonal
    .backdiagonal = fordított átlós vonal
    .dots = pont
    .diamonds = rombusz

noun =
    .line = egyenes
    .line-segment = szakasz
    .ray = félegyenes
    .vector = vektor
    .curve = görbe
    .function = függvény
    .parabola = parabola
    .polyline = töröttvonal
    .polygon = sokszög
    .triangle = háromszög
    .rectangle = téglalap
    .circle = kör
    .region = tartomány
    .point = pont
    .square = négyzet
    .diamond = rombusz
    .cross = kereszt
    .plus = plusz

# «5 oldalú sokszög» — the count and the word for "sided" are separate words in
# front of the noun, so the whole phrase is a head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] szabályos { $numSides } oldalú sokszög
    }

# Hungarian has no grammatical gender, so this answer goes unused. It is here
# because the source catalog defines the key and a missing key would fall back
# to English rather than to nothing.
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

style-filled-word = kitöltött

# The pattern clause moves to the front, because «mintával kitöltött» is a
# participle phrase and everything modifying the noun stands before it.
style-filled =
    { $parts ->
        [pattern] { $pattern } mintával { $filled } { $color }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } mintával { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } mintával { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }

# «keret» is written here, so it carries the instrumental itself. Hungarian
# has no indefinite article in this position, so the `-article` branches read
# the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } kerettel
        [and] és { $border } kerettel
        [and-article] és { $border } kerettel
       *[with] { $border } kerettel
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern } minta
       *[plain] { $color }
    }

style-unfilled = kitöltetlen

# «háttér» takes the superessive, and it is written here: «háttéren».
style-text =
    { $parts ->
        [background] { $color } { $background } háttéren
       *[plain] { $color }
    }

style-background-none = nincs


## Boolean words

boolean-true = igaz
boolean-false = hamis


## Answer buttons

answer-submit-label = Ellenőrzés
answer-submit-label-no-correctness = Válasz beküldése


## Sectional blocks

section-name =
    .activity = Tevékenység
    .aside = Kitérő
    .cascade = Kaszkád
    .definition = Definíció
    .example = Példa
    .exercise = Gyakorlat
    .exercises = Gyakorlatok
    .given-answer = Válasz
    .note = Megjegyzés
    .objectives = Célok
    .paragraphs = Bekezdések
    .part = Rész
    .problem = Feladat
    .problems = Feladatok
    .proof = Bizonyítás
    .question = Kérdés
    .section = Fejezet
    .solution = Megoldás
    .task = Teendő
    .theorem = Tétel

# Hungarian puts the number in front of the word it counts, with an ordinal
# period: «2. példa», not «Példa 2».
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionNumber }. { $sectionName }{ ": " }
       *[name-number] { $sectionNumber }. { $sectionName }
    }

hint-title = Segítség


## Tables and figures
##
## The number precedes the word here too: «2. táblázat», «3. ábra».

table-name =
    { $parts ->
        [numbered] { $enumeration }. táblázat
        [numbered-title] { $enumeration }. táblázat{ ": " }
        [unnumbered-title] Táblázat{ ": " }
       *[unnumbered] Táblázat
    }

figure-name =
    { $parts ->
        [numbered] { $enumeration }. ábra
        [numbered-caption] { $enumeration }. ábra{ ": " }
        [unnumbered-caption] Ábra{ ": " }
       *[unnumbered] Ábra
    }


## Paginator controls

paginator-previous = Előző
paginator-next = Következő
paginator-page = Oldal

# A slash rather than «-ból/-ből»: the elative harmonizes with how the numeral
# is read, which the catalog cannot see.
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = vagy
piecewise-condition-if = ha
piecewise-condition-otherwise = egyébként


## Chemistry

element-name =
    .h = Hidrogén
    .he = Hélium
    .li = Lítium
    .be = Berillium
    .b = Bór
    .c = Szén
    .n = Nitrogén
    .o = Oxigén
    .f = Fluor
    .ne = Neon
    .na = Nátrium
    .mg = Magnézium
    .al = Alumínium
    .si = Szilícium
    .p = Foszfor
    .s = Kén
    .cl = Klór
    .ar = Argon
    .k = Kálium
    .ca = Kalcium
    .sc = Szkandium
    .ti = Titán
    .v = Vanádium
    .cr = Króm
    .mn = Mangán
    .fe = Vas
    .co = Kobalt
    .ni = Nikkel
    .cu = Réz
    .zn = Cink
    .ga = Gallium
    .ge = Germánium
    .as = Arzén
    .se = Szelén
    .br = Bróm
    .kr = Kripton
    .rb = Rubídium
    .sr = Stroncium
    .y = Ittrium
    .zr = Cirkónium
    .nb = Nióbium
    .mo = Molibdén
    .tc = Technécium
    .ru = Ruténium
    .rh = Ródium
    .pd = Palládium
    .ag = Ezüst
    .cd = Kadmium
    .in = Indium
    .sn = Ón
    .sb = Antimon
    .te = Tellúr
    .i = Jód
    .xe = Xenon
    .cs = Cézium
    .ba = Bárium
    .la = Lantán
    .ce = Cérium
    .pr = Prazeodímium
    .nd = Neodímium
    .pm = Prométium
    .sm = Szamárium
    .eu = Európium
    .gd = Gadolínium
    .tb = Terbium
    .dy = Diszprózium
    .ho = Holmium
    .er = Erbium
    .tm = Túlium
    .yb = Itterbium
    .lu = Lutécium
    .hf = Hafnium
    .ta = Tantál
    .w = Volfrám
    .re = Rénium
    .os = Ozmium
    .ir = Irídium
    .pt = Platina
    .au = Arany
    .hg = Higany
    .tl = Tallium
    .pb = Ólom
    .bi = Bizmut
    .po = Polónium
    .at = Asztácium
    .rn = Radon
    .fr = Francium
    .ra = Rádium
    .ac = Aktínium
    .th = Tórium
    .pa = Protaktínium
    .u = Urán
    .np = Neptúnium
    .pu = Plutónium
    .am = Amerícium
    .cm = Kűrium
    .bk = Berkélium
    .cf = Kalifornium
    .es = Einsteinium
    .fm = Fermium
    .md = Mendelévium
    .no = Nobélium
    .lr = Laurencium
    .rf = Ruterfordium
    .db = Dubnium
    .sg = Seaborgium
    .bh = Bohrium
    .hs = Hassium
    .mt = Meitnerium
    .ds = Darmstadtium
    .rg = Röntgenium
    .cn = Kopernícium
    .nh = Nihónium
    .fl = Fleróvium
    .mc = Moszkóvium
    .lv = Livermórium
    .ts = Tenesszin
    .og = Oganesszon

element-anion-name =
    .h = Hidrid
    .c = Karbid
    .n = Nitrid
    .o = Oxid
    .f = Fluorid
    .p = Foszfid
    .s = Szulfid
    .cl = Klorid
    .br = Bromid
    .i = Jodid
    .at = Asztatid
    .ts = Tenesszid

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Érvénytelen vegyjel
chemistry-invalid-ionic-compound = Érvénytelen ionvegyület
