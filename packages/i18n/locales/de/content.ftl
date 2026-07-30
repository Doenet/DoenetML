# German content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# German inflects, and it inflects the other way round from Spanish: attributive
# adjectives go *before* the noun and take an ending that depends on the noun's
# gender. Every description here is a standalone phrase in the nominative with
# no article, so the strong endings apply — `-er` masculine, `-e` feminine,
# `-es` neuter — and `$gender` carries all three, since German has a neuter.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] schwarze
            [n] schwarzes
            [datm] schwarzen
           *[m] schwarzer
        }
    .white =
        { $gender ->
            [f] weiße
            [n] weißes
            [datm] weißen
           *[m] weißer
        }
    .gray =
        { $gender ->
            [f] graue
            [n] graues
            [datm] grauen
           *[m] grauer
        }
    .red =
        { $gender ->
            [f] rote
            [n] rotes
            [datm] roten
           *[m] roter
        }
    .orange =
        { $gender ->
            [f] orangefarbene
            [n] orangefarbenes
            [datm] orangefarbenen
           *[m] orangefarbener
        }
    .yellow =
        { $gender ->
            [f] gelbe
            [n] gelbes
            [datm] gelben
           *[m] gelber
        }
    .green =
        { $gender ->
            [f] grüne
            [n] grünes
            [datm] grünen
           *[m] grüner
        }
    .cyan =
        { $gender ->
            [f] cyanfarbene
            [n] cyanfarbenes
            [datm] cyanfarbenen
           *[m] cyanfarbener
        }
    .blue =
        { $gender ->
            [f] blaue
            [n] blaues
            [datm] blauen
           *[m] blauer
        }
    .purple =
        { $gender ->
            [f] violette
            [n] violettes
            [datm] violetten
           *[m] violetter
        }
    .pink =
        { $gender ->
            [f] rosafarbene
            [n] rosafarbenes
            [datm] rosafarbenen
           *[m] rosafarbener
        }
    .brown =
        { $gender ->
            [f] braune
            [n] braunes
            [datm] braunen
           *[m] brauner
        }

line-width =
    .thick =
        { $gender ->
            [f] dicke
            [n] dickes
            [datm] dicken
           *[m] dicker
        }
    .thin =
        { $gender ->
            [f] dünne
            [n] dünnes
            [datm] dünnen
           *[m] dünner
        }

line-style =
    .dashed =
        { $gender ->
            [f] gestrichelte
            [n] gestricheltes
            [datm] gestrichelten
           *[m] gestrichelter
        }
    .dotted =
        { $gender ->
            [f] gepunktete
            [n] gepunktetes
            [datm] gepunkteten
           *[m] gepunkteter
        }

# Noun phrases: they follow `mit` and agree with nothing.
fill-style =
    .horizontal = waagerechten Linien
    .vertical = senkrechten Linien
    .diagonal = diagonalen Linien
    .backdiagonal = gegenläufigen diagonalen Linien
    .dots = Punkten
    .diamonds = Rauten

noun =
    .line = Linie
    .line-segment = Strecke
    .ray = Strahl
    .vector = Vektor
    .curve = Kurve
    .function = Funktion
    .parabola = Parabel
    .polyline = Streckenzug
    .polygon = Vieleck
    .triangle = Dreieck
    .rectangle = Rechteck
    .circle = Kreis
    .region = Bereich
    .point = Punkt
    .square = Quadrat
    .diamond = Raute
    .cross = Kreuz
    .plus = Pluszeichen

# German keeps the side count in front of the noun, as a compound, so the whole
# thing is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regelmäßiges { $numSides }-Eck
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (which is
# `{ $numSides }-Eck`, neuter) or the head of a phrase the description never
# names: `border` (der Rand, m), `fill` (die Füllung, f), `text` (der Text, m),
# `background` (der Hintergrund, m).
#
# `border` answers `datm` — masculine *dative* — rather than plain `m`, because
# the only place its adjectives are rendered is after `mit einem` / `und einem`
# in `style-border-clause`, and both govern the dative: „mit einem dicken
# Rand“, not „mit einem dicker Rand“. `$gender` is a single token that this
# catalog chooses the meaning of, so carrying a case in it is what the
# mechanism allows; what it cannot do is carry two, and
# `borderStyleDescription` — the state variable that renders a border's style
# on its own, with no preposition — therefore also comes out dative. Fixing
# that properly means the code passing a case alongside the gender.
noun-gender =
    { $noun ->
        [border] datm
        [line] f
        [curve] f
        [function] f
        [parabola] f
        [diamond] f
        [fill] f
        [line-segment] f
        [polygon] n
        [triangle] n
        [rectangle] n
        [square] n
        [cross] n
        [plus] n
        [region] m
        [regular-polygon] n
       *[other] m
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

# The adjectives lead and the noun closes the phrase, which is the reverse of
# Spanish and the same as English: „dicke rote Linie“.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

style-filled-word =
    { $gender ->
        [f] gefüllte
        [n] gefülltes
        [datm] gefüllten
       *[m] gefüllter
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } mit { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } mit { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } mit { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# „Rand“ is masculine, so the border's adjectives agree with it and not with
# the shape it surrounds — in the dative, which is what `noun-gender` gives it
# the `datm` token for.
#
# Every branch takes the article, including the two English leaves it off. A
# bare dative would want the strong ending („mit dickem Rand“) rather than the
# weak one, which is a second form the one `$gender` token cannot also carry;
# German is happy with the article in all four, so this collapses the
# distinction rather than getting one of them wrong.
style-border-clause =
    { $parts ->
        [with-article] mit einem { $border } Rand
        [and] und einem { $border } Rand
        [and-article] und einem { $border } Rand
       *[with] mit einem { $border } Rand
    }

# „in“ + colour avoids having to agree the colour with a plural pattern noun.
style-fill =
    { $parts ->
        [pattern] { $pattern } in { $color }
       *[plain] { $color }
    }

style-unfilled = ungefüllt

style-text =
    { $parts ->
        [background] { $color } auf { $background } Hintergrund
       *[plain] { $color }
    }

style-background-none = keiner


## Boolean words

boolean-true = wahr
boolean-false = falsch


## Answer buttons

answer-submit-label = Prüfen
answer-submit-label-no-correctness = Antwort senden


## Sectional blocks

section-name =
    .activity = Aktivität
    .aside = Einschub
    .cascade = Kaskade
    .definition = Definition
    .example = Beispiel
    .exercise = Übung
    .exercises = Übungen
    .given-answer = Antwort
    .note = Anmerkung
    .objectives = Lernziele
    .paragraphs = Absätze
    .part = Teil
    .problem = Aufgabe
    .problems = Aufgaben
    .proof = Beweis
    .question = Frage
    .section = Abschnitt
    .solution = Lösung
    .task = Aufgabe
    .theorem = Satz

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Tipp


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabelle { $enumeration }
        [numbered-title] Tabelle { $enumeration }{ ": " }
        [unnumbered-title] Tabelle{ ": " }
       *[unnumbered] Tabelle
    }

figure-name =
    { $parts ->
        [numbered] Abbildung { $enumeration }
        [numbered-caption] Abbildung { $enumeration }{ ": " }
        [unnumbered-caption] Abbildung{ ": " }
       *[unnumbered] Abbildung
    }


## Paginator controls

paginator-previous = Zurück
paginator-next = Weiter
paginator-page = Seite

paginator-page-status = { $pageLabel } { $currentPage } von { $numPages }


## Piecewise functions

piecewise-condition-or = oder
piecewise-condition-if = falls
piecewise-condition-otherwise = sonst


## Chemistry

element-name =
    .h = Wasserstoff
    .he = Helium
    .li = Lithium
    .be = Beryllium
    .b = Bor
    .c = Kohlenstoff
    .n = Stickstoff
    .o = Sauerstoff
    .f = Fluor
    .ne = Neon
    .na = Natrium
    .mg = Magnesium
    .al = Aluminium
    .si = Silicium
    .p = Phosphor
    .s = Schwefel
    .cl = Chlor
    .ar = Argon
    .k = Kalium
    .ca = Calcium
    .sc = Scandium
    .ti = Titan
    .v = Vanadium
    .cr = Chrom
    .mn = Mangan
    .fe = Eisen
    .co = Cobalt
    .ni = Nickel
    .cu = Kupfer
    .zn = Zink
    .ga = Gallium
    .ge = Germanium
    .as = Arsen
    .se = Selen
    .br = Brom
    .kr = Krypton
    .rb = Rubidium
    .sr = Strontium
    .y = Yttrium
    .zr = Zirconium
    .nb = Niob
    .mo = Molybdän
    .tc = Technetium
    .ru = Ruthenium
    .rh = Rhodium
    .pd = Palladium
    .ag = Silber
    .cd = Cadmium
    .in = Indium
    .sn = Zinn
    .sb = Antimon
    .te = Tellur
    .i = Iod
    .xe = Xenon
    .cs = Caesium
    .ba = Barium
    .la = Lanthan
    .ce = Cer
    .pr = Praseodym
    .nd = Neodym
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
    .ta = Tantal
    .w = Wolfram
    .re = Rhenium
    .os = Osmium
    .ir = Iridium
    .pt = Platin
    .au = Gold
    .hg = Quecksilber
    .tl = Thallium
    .pb = Blei
    .bi = Bismut
    .po = Polonium
    .at = Astat
    .rn = Radon
    .fr = Francium
    .ra = Radium
    .ac = Actinium
    .th = Thorium
    .pa = Protactinium
    .u = Uran
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
    .ts = Tenness
    .og = Oganesson

element-anion-name =
    .h = Hydrid
    .c = Carbid
    .n = Nitrid
    .o = Oxid
    .f = Fluorid
    .p = Phosphid
    .s = Sulfid
    .cl = Chlorid
    .br = Bromid
    .i = Iodid
    .at = Astatid
    .ts = Tennessid

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ungültiges chemisches Symbol
chemistry-invalid-ionic-compound = Ungültige Ionenverbindung
