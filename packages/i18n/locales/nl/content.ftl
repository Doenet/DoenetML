# Dutch content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Dutch inflects, but on a different axis from Spanish or German: what matters
# is not masculine against feminine but *de*-words against *het*-words. An
# attributive adjective with no article takes `-e` before a de-word and stays
# bare before a het-word — "dikke lijn" but "dik vierkant". So `$gender` here
# carries `c` (common, a de-word) and `n` (neuter, a het-word), and every
# adjective selects on it. Adjectives precede their noun, as in English.


## Style vocabulary

color =
    .black =
        { $gender ->
            [n] zwart
           *[c] zwarte
        }
    .white =
        { $gender ->
            [n] wit
           *[c] witte
        }
    .gray =
        { $gender ->
            [n] grijs
           *[c] grijze
        }
    .red =
        { $gender ->
            [n] rood
           *[c] rode
        }
    .orange =
        { $gender ->
            [n] oranje
           *[c] oranje
        }
    .yellow =
        { $gender ->
            [n] geel
           *[c] gele
        }
    .green =
        { $gender ->
            [n] groen
           *[c] groene
        }
    .cyan =
        { $gender ->
            [n] cyaan
           *[c] cyaankleurige
        }
    .blue =
        { $gender ->
            [n] blauw
           *[c] blauwe
        }
    .purple =
        { $gender ->
            [n] paars
           *[c] paarse
        }
    .pink =
        { $gender ->
            [n] roze
           *[c] roze
        }
    .brown =
        { $gender ->
            [n] bruin
           *[c] bruine
        }

line-width =
    .thick =
        { $gender ->
            [n] dik
           *[c] dikke
        }
    .thin =
        { $gender ->
            [n] dun
           *[c] dunne
        }

line-style =
    .dashed =
        { $gender ->
            [n] gestreept
           *[c] gestreepte
        }
    .dotted =
        { $gender ->
            [n] gestippeld
           *[c] gestippelde
        }

# Noun phrases: they follow `met` and agree with nothing.
fill-style =
    .horizontal = horizontale lijnen
    .vertical = verticale lijnen
    .diagonal = diagonale lijnen
    .backdiagonal = tegengesteld diagonale lijnen
    .dots = stippen
    .diamonds = ruiten

noun =
    .line = lijn
    .line-segment = lijnstuk
    .ray = halfrechte
    .vector = vector
    .curve = kromme
    .function = functie
    .parabola = parabool
    .polyline = gebroken lijn
    .polygon = veelhoek
    .triangle = driehoek
    .rectangle = rechthoek
    .circle = cirkel
    .region = gebied
    .point = punt
    .square = vierkant
    .diamond = ruit
    .cross = kruis
    .plus = plusteken

# Dutch keeps the side count in front of the noun, so the whole thing is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regelmatige { $numSides }-hoek
    }

# `het`-words are the marked case, so they are the ones listed. Besides the
# nouns above, `$noun` can be `regular-polygon` (de veelhoek) or the head of a
# phrase the description never names: `border` (de rand), `fill` (de vulling),
# `text` (de tekst), `background` (de achtergrond) — all de-words, so they fall
# to the default.
noun-gender =
    { $noun ->
        [line-segment] n
        [region] n
        [point] n
        [square] n
        [cross] n
        [plus] n
       *[other] c
    }


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

style-filled-word =
    { $gender ->
        [n] gevuld
       *[c] gevulde
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } met { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } met { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } met { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# `rand` is a de-word, so the border's adjectives agree with it and not with
# the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] met een { $border } rand
        [and] en { $border } rand
        [and-article] en een { $border } rand
       *[with] met { $border } rand
    }

# `in het` + colour avoids having to agree the colour with a plural pattern
# noun.
style-fill =
    { $parts ->
        [pattern] { $pattern } in { $color }
       *[plain] { $color }
    }

style-unfilled = niet gevuld

style-text =
    { $parts ->
        [background] { $color } op een { $background } achtergrond
       *[plain] { $color }
    }

style-background-none = geen


## Boolean words

boolean-true = waar
boolean-false = onwaar


## Answer buttons

answer-submit-label = Controleren
answer-submit-label-no-correctness = Antwoord indienen


## Sectional blocks

section-name =
    .activity = Activiteit
    .aside = Terzijde
    .cascade = Cascade
    .definition = Definitie
    .example = Voorbeeld
    .exercise = Oefening
    .exercises = Oefeningen
    .given-answer = Antwoord
    .note = Opmerking
    .objectives = Leerdoelen
    .paragraphs = Alinea's
    .part = Deel
    .problem = Opgave
    .problems = Opgaven
    .proof = Bewijs
    .question = Vraag
    .section = Paragraaf
    .solution = Oplossing
    .task = Taak
    .theorem = Stelling

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Tip


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
        [numbered] Figuur { $enumeration }
        [numbered-caption] Figuur { $enumeration }{ ": " }
        [unnumbered-caption] Figuur{ ": " }
       *[unnumbered] Figuur
    }


## Paginator controls

paginator-previous = Vorige
paginator-next = Volgende
paginator-page = Pagina

paginator-page-status = { $pageLabel } { $currentPage } van { $numPages }


## Piecewise functions

piecewise-condition-or = of
piecewise-condition-if = als
piecewise-condition-otherwise = anders


## Chemistry

element-name =
    .h = Waterstof
    .he = Helium
    .li = Lithium
    .be = Beryllium
    .b = Boor
    .c = Koolstof
    .n = Stikstof
    .o = Zuurstof
    .f = Fluor
    .ne = Neon
    .na = Natrium
    .mg = Magnesium
    .al = Aluminium
    .si = Silicium
    .p = Fosfor
    .s = Zwavel
    .cl = Chloor
    .ar = Argon
    .k = Kalium
    .ca = Calcium
    .sc = Scandium
    .ti = Titaan
    .v = Vanadium
    .cr = Chroom
    .mn = Mangaan
    .fe = IJzer
    .co = Kobalt
    .ni = Nikkel
    .cu = Koper
    .zn = Zink
    .ga = Gallium
    .ge = Germanium
    .as = Arseen
    .se = Seleen
    .br = Broom
    .kr = Krypton
    .rb = Rubidium
    .sr = Strontium
    .y = Yttrium
    .zr = Zirkonium
    .nb = Niobium
    .mo = Molybdeen
    .tc = Technetium
    .ru = Ruthenium
    .rh = Rodium
    .pd = Palladium
    .ag = Zilver
    .cd = Cadmium
    .in = Indium
    .sn = Tin
    .sb = Antimoon
    .te = Telluur
    .i = Jood
    .xe = Xenon
    .cs = Cesium
    .ba = Barium
    .la = Lanthaan
    .ce = Cerium
    .pr = Praseodymium
    .nd = Neodymium
    .pm = Promethium
    .sm = Samarium
    .eu = Europium
    .gd = Gadolinium
    .tb = Terbium
    .dy = Dysprosium
    .ho = Holmium
    .er = Erbium
    .tm = Thulium
    .yb = Ytterbium
    .lu = Lutetium
    .hf = Hafnium
    .ta = Tantaal
    .w = Wolfraam
    .re = Renium
    .os = Osmium
    .ir = Iridium
    .pt = Platina
    .au = Goud
    .hg = Kwik
    .tl = Thallium
    .pb = Lood
    .bi = Bismut
    .po = Polonium
    .at = Astaat
    .rn = Radon
    .fr = Francium
    .ra = Radium
    .ac = Actinium
    .th = Thorium
    .pa = Protactinium
    .u = Uranium
    .np = Neptunium
    .pu = Plutonium
    .am = Americium
    .cm = Curium
    .bk = Berkelium
    .cf = Californium
    .es = Einsteinium
    .fm = Fermium
    .md = Mendelevium
    .no = Nobelium
    .lr = Lawrencium
    .rf = Rutherfordium
    .db = Dubnium
    .sg = Seaborgium
    .bh = Bohrium
    .hs = Hassium
    .mt = Meitnerium
    .ds = Darmstadtium
    .rg = Roentgenium
    .cn = Copernicium
    .nh = Nihonium
    .fl = Flerovium
    .mc = Moscovium
    .lv = Livermorium
    .ts = Tennessine
    .og = Oganesson

element-anion-name =
    .h = Hydride
    .c = Carbide
    .n = Nitride
    .o = Oxide
    .f = Fluoride
    .p = Fosfide
    .s = Sulfide
    .cl = Chloride
    .br = Bromide
    .i = Jodide
    .at = Astatide
    .ts = Tennesside

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ongeldig chemisch symbool
chemistry-invalid-ionic-compound = Ongeldige ionverbinding
