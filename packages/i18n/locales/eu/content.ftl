# Basque content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Basque has no grammatical gender, so `$gender` goes unused exactly as it does
# in English. Adjectives follow their noun, so the composition messages are
# reordered from the English and the noun leads.
#
# `$role` goes unused too, and for a reason worth stating: Basque has a great
# many cases, but they are suffixes on the *last word of the whole noun
# phrase*, not endings the adjective agrees in. So what a position asks for
# lands on a word this catalog writes — «batekin», «planoarekin» — and never on
# a placeable. The description itself therefore reads the same in all four
# positions.
#
# The seed writes the adjectives in their bare, article-less form. Basque would
# normally close such a phrase with the article `-a`, and that `-a` would have
# to weld onto whichever adjective came last — which is a placeable — so the
# indefinite reading is the one that keeps the rule the README states.


## Style vocabulary

color =
    .black = beltz
    .white = zuri
    .gray = gris
    .red = gorri
    .orange = laranja
    .yellow = hori
    .green = berde
    .cyan = zian
    .blue = urdin
    .purple = more
    .pink = arrosa
    .brown = marroi

line-width =
    .thick = lodi
    .thin = mehe

line-style =
    .dashed = eten
    .dotted = puntukatu

# Noun phrases already in the comitative, which is the case the composition
# messages put them in. They agree with nothing.
fill-style =
    .horizontal = marra horizontalekin
    .vertical = marra bertikalekin
    .diagonal = marra diagonalekin
    .backdiagonal = alderantzizko marra diagonalekin
    .dots = puntuekin
    .diamonds = erronboekin

noun =
    .line = marra
    .line-segment = segmentu
    .ray = zuzenerdi
    .vector = bektore
    .curve = kurba
    .function = funtzio
    .parabola = parabola
    .polyline = marra poligonal
    .polygon = poligono
    .triangle = triangelu
    .rectangle = laukizuzen
    .circle = zirkulu
    .region = eskualde
    .point = puntu
    .square = karratu
    .diamond = erronbo
    .cross = gurutze
    .plus = plus

# Basque puts a «-ko» modifier phrase *before* the noun — «5 aldeko poligono
# erregular» — so the tail is the side count and the composing messages place
# it ahead of the head rather than after the adjectives.
noun-regular-polygon =
    { $part ->
        [tail] { $numSides } aldeko
       *[head] poligono erregular
    }

# Basque has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English, Turkish and Finnish.
noun-gender = neuter


## Style composition

# The adjectives follow their noun, colour first: «marra gorri lodi eten». A
# Basque string of adjectives puts the most closely defining word nearest the
# noun, so the colour leads and the English order is not carried over — the
# same call `locales/cy` makes. Do not reorder these to width-style-colour.
style-stroke =
    { $parts ->
        [width-style-color] { $color } { $width } { $lineStyle }
        [width-color] { $color } { $width }
        [style-color] { $color } { $lineStyle }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

style-with-noun =
    { $parts ->
        [noun-tail] { $nounTail } { $noun } { $description }
       *[noun] { $noun } { $description }
    }

style-filled-word = beteta

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } { $pattern }
        [plain-tail] { $nounTail } { $noun } { $color } { $filled }
        [pattern-tail] { $nounTail } { $noun } { $color } { $filled } { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

# The comitative `-ekin` lands on «bat», the indefinite article word, which
# closes the phrase after the adjectives — so nothing is welded to a placeable
# here. Basque has no article to distinguish, so the two `-article` branches
# read like the two without.
style-border-clause =
    { $parts ->
        [with-article] ertz { $border } batekin
        [and] eta ertz { $border } batekin
        [and-article] eta ertz { $border } batekin
       *[with] ertz { $border } batekin
    }

style-fill =
    { $parts ->
        [pattern] betegarri { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = bete gabe

# The comitative closes on «planoarekin», another word this catalog writes.
# The colour reaches it through «koloreko» — "of the colour" — rather than
# taking the ending itself, which is what keeps the suffix off the placeable.
style-text =
    { $parts ->
        [background] { $color }, { $background } koloreko atzeko planoarekin
       *[plain] { $color }
    }

style-background-none = bat ere ez


## Boolean words

boolean-true = egia
boolean-false = gezurra


## Answer buttons

answer-submit-label = Egiaztatu
answer-submit-label-no-correctness = Bidali erantzuna


## Sectional blocks

section-name =
    .activity = Jarduera
    .aside = Alboko oharra
    .cascade = Kaskada
    .definition = Definizioa
    .example = Adibidea
    .exercise = Ariketa
    .exercises = Ariketak
    .given-answer = Erantzuna
    .note = Oharra
    .objectives = Helburuak
    .paragraphs = Paragrafoak
    .part = Zatia
    .problem = Problema
    .problems = Problemak
    .proof = Froga
    .question = Galdera
    .section = Atala
    .solution = Ebazpena
    .task = Zeregina
    .theorem = Teorema

# Basque counts a numbered heading the way `table-name` and `figure-name`
# already do: the ordinal comes first and the word follows it, «1.3. Atala»
# rather than «Atala 1.3».
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionNumber }. { $sectionName }{ ": " }
       *[name-number] { $sectionNumber }. { $sectionName }
    }

hint-title = Laguntza


## Tables and figures

table-name =
    { $parts ->
        [numbered] { $enumeration }. taula
        [numbered-title] { $enumeration }. taula{ ": " }
        [unnumbered-title] Taula{ ": " }
       *[unnumbered] Taula
    }

figure-name =
    { $parts ->
        [numbered] { $enumeration }. irudia
        [numbered-caption] { $enumeration }. irudia{ ": " }
        [unnumbered-caption] Irudia{ ": " }
       *[unnumbered] Irudia
    }


## Paginator controls

paginator-previous = Aurrekoa
paginator-next = Hurrengoa
paginator-page = Orrialdea

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = edo
piecewise-condition-if = baldin
piecewise-condition-otherwise = bestela


## Chemistry

element-name =
    .h = Hidrogenoa
    .he = Helioa
    .li = Litioa
    .be = Berilioa
    .b = Boroa
    .c = Karbonoa
    .n = Nitrogenoa
    .o = Oxigenoa
    .f = Fluorra
    .ne = Neoia
    .na = Sodioa
    .mg = Magnesioa
    .al = Aluminioa
    .si = Silizioa
    .p = Fosforoa
    .s = Sufrea
    .cl = Kloroa
    .ar = Argona
    .k = Potasioa
    .ca = Kaltzioa
    .sc = Eskandioa
    .ti = Titanioa
    .v = Banadioa
    .cr = Kromoa
    .mn = Manganesoa
    .fe = Burdina
    .co = Kobaltoa
    .ni = Nikela
    .cu = Kobrea
    .zn = Zinka
    .ga = Galioa
    .ge = Germanioa
    .as = Artsenikoa
    .se = Selenioa
    .br = Bromoa
    .kr = Kriptona
    .rb = Rubidioa
    .sr = Estrontzioa
    .y = Itrioa
    .zr = Zirkonioa
    .nb = Nioboa
    .mo = Molibdenoa
    .tc = Teknezioa
    .ru = Rutenioa
    .rh = Rodioa
    .pd = Paladioa
    .ag = Zilarra
    .cd = Kadmioa
    .in = Indioa
    .sn = Eztainua
    .sb = Antimonioa
    .te = Telurioa
    .i = Iodoa
    .xe = Xenona
    .cs = Zesioa
    .ba = Barioa
    .la = Lantanoa
    .ce = Zerioa
    .pr = Praseodimioa
    .nd = Neodimioa
    .pm = Prometioa
    .sm = Samarioa
    .eu = Europioa
    .gd = Gadolinioa
    .tb = Terbioa
    .dy = Disprosioa
    .ho = Holmioa
    .er = Erbioa
    .tm = Tulioa
    .yb = Iterbioa
    .lu = Lutezioa
    .hf = Hafnioa
    .ta = Tantaloa
    .w = Wolframa
    .re = Renioa
    .os = Osmioa
    .ir = Iridioa
    .pt = Platinoa
    .au = Urrea
    .hg = Merkurioa
    .tl = Talioa
    .pb = Beruna
    .bi = Bismutoa
    .po = Polonioa
    .at = Astatoa
    .rn = Radona
    .fr = Frantzioa
    .ra = Radioa
    .ac = Aktinioa
    .th = Torioa
    .pa = Protaktinioa
    .u = Uranioa
    .np = Neptunioa
    .pu = Plutonioa
    .am = Amerizioa
    .cm = Kurioa
    .bk = Berkelioa
    .cf = Kalifornioa
    .es = Einstenioa
    .fm = Fermioa
    .md = Mendelevioa
    .no = Nobelioa
    .lr = Laurentzioa
    .rf = Rutherfordioa
    .db = Dubnioa
    .sg = Seaborgioa
    .bh = Bohrioa
    .hs = Hassioa
    .mt = Meitnerioa
    .ds = Darmstadtioa
    .rg = Roentgenioa
    .cn = Kopernizioa
    .nh = Nihonioa
    .fl = Flerovioa
    .mc = Moskovioa
    .lv = Livermorioa
    .ts = Tenesoa
    .og = Oganesoa

element-anion-name =
    .h = Hidruroa
    .c = Karburoa
    .n = Nitruroa
    .o = Oxidoa
    .f = Fluoruroa
    .p = Fosfuroa
    .s = Sulfuroa
    .cl = Kloruroa
    .br = Bromuroa
    .i = Ioduroa
    .at = Astaturoa
    .ts = Tenesuroa

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ikur kimiko baliogabea
chemistry-invalid-ionic-compound = Konposatu ioniko baliogabea
