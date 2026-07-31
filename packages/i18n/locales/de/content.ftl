# German content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# German inflects, and it inflects the other way round from Spanish: attributive
# adjectives go *before* the noun and take an ending that depends on the noun's
# gender and on the case its position governs.
#
# Every adjective below therefore selects on `$role` first — which position the
# words are going into — and only then, where it matters, on `$gender`:
#
#   standalone          a phrase with no article, so the strong nominative
#                       endings apply: `-er` m, `-e` f, `-es` n
#   border-clause       after `mit einem` / `und einem`, which govern the
#                       dative: `-en`, the same for every gender
#   background-clause   after a bare `auf`, dative with no article, so the
#                       strong ending: `-em`
#   text-clause         predicative, where German does not inflect at all: the
#                       bare stem, `rot auf gelbem Hintergrund`
#
# The last three need no gender branch: each is only ever used of one noun, and
# that noun's gender is fixed (der Rand, der Hintergrund, der Text).
#
# This replaces the `datm` token an earlier seed carried inside `$gender`. One
# token could hold a gender or a case but not both, so whichever of the two
# positions it was tuned for, the other came out wrong (#1606).


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] schwarzen
            [background-clause] schwarzem
            [text-clause] schwarz
            *[standalone]
                { $gender ->
                    [f] schwarze
                    [n] schwarzes
                    *[m] schwarzer
                }
        }
    .white =
        { $role ->
            [border-clause] weißen
            [background-clause] weißem
            [text-clause] weiß
            *[standalone]
                { $gender ->
                    [f] weiße
                    [n] weißes
                    *[m] weißer
                }
        }
    .gray =
        { $role ->
            [border-clause] grauen
            [background-clause] grauem
            [text-clause] grau
            *[standalone]
                { $gender ->
                    [f] graue
                    [n] graues
                    *[m] grauer
                }
        }
    .red =
        { $role ->
            [border-clause] roten
            [background-clause] rotem
            [text-clause] rot
            *[standalone]
                { $gender ->
                    [f] rote
                    [n] rotes
                    *[m] roter
                }
        }
    .orange =
        { $role ->
            [border-clause] orangefarbenen
            [background-clause] orangefarbenem
            [text-clause] orangefarben
            *[standalone]
                { $gender ->
                    [f] orangefarbene
                    [n] orangefarbenes
                    *[m] orangefarbener
                }
        }
    .yellow =
        { $role ->
            [border-clause] gelben
            [background-clause] gelbem
            [text-clause] gelb
            *[standalone]
                { $gender ->
                    [f] gelbe
                    [n] gelbes
                    *[m] gelber
                }
        }
    .green =
        { $role ->
            [border-clause] grünen
            [background-clause] grünem
            [text-clause] grün
            *[standalone]
                { $gender ->
                    [f] grüne
                    [n] grünes
                    *[m] grüner
                }
        }
    .cyan =
        { $role ->
            [border-clause] cyanfarbenen
            [background-clause] cyanfarbenem
            [text-clause] cyanfarben
            *[standalone]
                { $gender ->
                    [f] cyanfarbene
                    [n] cyanfarbenes
                    *[m] cyanfarbener
                }
        }
    .blue =
        { $role ->
            [border-clause] blauen
            [background-clause] blauem
            [text-clause] blau
            *[standalone]
                { $gender ->
                    [f] blaue
                    [n] blaues
                    *[m] blauer
                }
        }
    .purple =
        { $role ->
            [border-clause] violetten
            [background-clause] violettem
            [text-clause] violett
            *[standalone]
                { $gender ->
                    [f] violette
                    [n] violettes
                    *[m] violetter
                }
        }
    .pink =
        { $role ->
            [border-clause] rosafarbenen
            [background-clause] rosafarbenem
            [text-clause] rosafarben
            *[standalone]
                { $gender ->
                    [f] rosafarbene
                    [n] rosafarbenes
                    *[m] rosafarbener
                }
        }
    .brown =
        { $role ->
            [border-clause] braunen
            [background-clause] braunem
            [text-clause] braun
            *[standalone]
                { $gender ->
                    [f] braune
                    [n] braunes
                    *[m] brauner
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] dicken
            [background-clause] dickem
            [text-clause] dick
            *[standalone]
                { $gender ->
                    [f] dicke
                    [n] dickes
                    *[m] dicker
                }
        }
    .thin =
        { $role ->
            [border-clause] dünnen
            [background-clause] dünnem
            [text-clause] dünn
            *[standalone]
                { $gender ->
                    [f] dünne
                    [n] dünnes
                    *[m] dünner
                }
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] gestrichelten
            [background-clause] gestricheltem
            [text-clause] gestrichelt
            *[standalone]
                { $gender ->
                    [f] gestrichelte
                    [n] gestricheltes
                    *[m] gestrichelter
                }
        }
    .dotted =
        { $role ->
            [border-clause] gepunkteten
            [background-clause] gepunktetem
            [text-clause] gepunktet
            *[standalone]
                { $gender ->
                    [f] gepunktete
                    [n] gepunktetes
                    *[m] gepunkteter
                }
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
# Every one of them answers a plain gender now. `border` and `background` used
# to answer a case instead — `datm` — because each is rendered in two positions
# and a single token could only suit one of them. `$role` carries that
# distinction, so this message is back to answering the one question its name
# asks (#1606).
noun-gender =
    { $noun ->
        [border] m
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
    { $role ->
        [border-clause] gefüllten
        [background-clause] gefülltem
        [text-clause] gefüllt
        *[standalone]
            { $gender ->
                [f] gefüllte
                [n] gefülltes
                *[m] gefüllter
            }
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
# the shape it surrounds. `mit` and `und einem` govern the dative, which is
# what the `border-clause` branch of every adjective supplies.
#
# Every branch takes the article, including the two English leaves it off. A
# bare dative would want the strong ending („mit dickem Rand“) rather than the
# weak one, and that is a second form the `border-clause` branch would have to
# split to carry. German is happy with the article in all four, so keeping it
# collapses the distinction rather than getting one of them wrong — the one
# thing here that `$role` did not have to fix.
style-border-clause =
    { $parts ->
        [with-article] mit einem { $border } Rand
        [and] und einem { $border } Rand
        [and-article] und einem { $border } Rand
       *[with] mit einem { $border } Rand
    }

# The fill-pattern words are dative plurals, because their other use is the
# „mit { $pattern }“ clause in `style-filled`. So this message supplies a noun
# for them to hang off — „Füllung“, feminine, which is the gender `noun-gender`
# already answers for `fill`, so the colour agrees with it in both variants.
style-fill =
    { $parts ->
        [pattern] { $color } Füllung mit { $pattern }
       *[plain] { $color } Füllung
    }

style-unfilled = ungefüllt

# „auf“ with no article governs the strong dative, which is the
# `background-clause` ending; the text colour beside it is predicative, which
# in German is the bare stem. So this reads „rot auf gelbem Hintergrund“, where
# the `textColor` and `backgroundColor` variables — the standalone side of the
# same two words — read „roter“ and „gelber“.
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
