# Slovenian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Slovenian inflects for six cases and has three genders, so every describing
# word below selects on `$role` first and only then, where it matters, on
# `$gender`:
#
#   standalone          nominative: `-∅` m, `-a` f, `-o`/`-e` n
#   border-clause       after «z», which governs the instrumental, of «rob» —
#                       masculine: `-im`
#   background-clause   after «na», locative here, of «ozadje» — neuter: `-em`
#   text-clause         nominative neuter, agreeing with «besedilo»
#
# Slovenian is the one in this batch whose text and background are *both*
# neuter, so its `text-clause` is a plain nominative neuter and its
# `background-clause` a locative of the same gender. `locales/hr` and
# `locales/sr` both have a feminine background and a masculine text, and
# `locales/ru` a masculine background; four Slavic catalogs, four arrangements,
# none of which anything outside them had to know.
#
# The fill patterns carry their own preposition. Slovenian picks «z» or «s» by
# the sound that follows — «s pikami» but «z rombi» — and nothing in Fluent can
# compute that from a placeable, so the choice is made once per pattern where
# the word itself is, and the messages that place them supply no preposition of
# their own.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] črnim
            [background-clause] črnem
            [text-clause] črno
           *[standalone]
                { $gender ->
                    [f] črna
                    [n] črno
                   *[m] črn
                }
        }
    .white =
        { $role ->
            [border-clause] belim
            [background-clause] belem
            [text-clause] belo
           *[standalone]
                { $gender ->
                    [f] bela
                    [n] belo
                   *[m] bel
                }
        }
    .gray =
        { $role ->
            [border-clause] sivim
            [background-clause] sivem
            [text-clause] sivo
           *[standalone]
                { $gender ->
                    [f] siva
                    [n] sivo
                   *[m] siv
                }
        }
    .red =
        { $role ->
            [border-clause] rdečim
            [background-clause] rdečem
            [text-clause] rdeče
           *[standalone]
                { $gender ->
                    [f] rdeča
                    [n] rdeče
                   *[m] rdeč
                }
        }
    .orange =
        { $role ->
            [border-clause] oranžnim
            [background-clause] oranžnem
            [text-clause] oranžno
           *[standalone]
                { $gender ->
                    [f] oranžna
                    [n] oranžno
                   *[m] oranžen
                }
        }
    .yellow =
        { $role ->
            [border-clause] rumenim
            [background-clause] rumenem
            [text-clause] rumeno
           *[standalone]
                { $gender ->
                    [f] rumena
                    [n] rumeno
                   *[m] rumen
                }
        }
    .green =
        { $role ->
            [border-clause] zelenim
            [background-clause] zelenem
            [text-clause] zeleno
           *[standalone]
                { $gender ->
                    [f] zelena
                    [n] zeleno
                   *[m] zelen
                }
        }
    .cyan =
        { $role ->
            [border-clause] turkiznim
            [background-clause] turkiznem
            [text-clause] turkizno
           *[standalone]
                { $gender ->
                    [f] turkizna
                    [n] turkizno
                   *[m] turkizen
                }
        }
    .blue =
        { $role ->
            [border-clause] modrim
            [background-clause] modrem
            [text-clause] modro
           *[standalone]
                { $gender ->
                    [f] modra
                    [n] modro
                   *[m] moder
                }
        }
    .purple =
        { $role ->
            [border-clause] vijoličnim
            [background-clause] vijoličnem
            [text-clause] vijolično
           *[standalone]
                { $gender ->
                    [f] vijolična
                    [n] vijolično
                   *[m] vijoličen
                }
        }
    .pink =
        { $role ->
            [border-clause] rožnatim
            [background-clause] rožnatem
            [text-clause] rožnato
           *[standalone]
                { $gender ->
                    [f] rožnata
                    [n] rožnato
                   *[m] rožnat
                }
        }
    .brown =
        { $role ->
            [border-clause] rjavim
            [background-clause] rjavem
            [text-clause] rjavo
           *[standalone]
                { $gender ->
                    [f] rjava
                    [n] rjavo
                   *[m] rjav
                }
        }
line-width =
    .thick =
        { $role ->
            [border-clause] debelim
            [background-clause] debelem
            [text-clause] debelo
           *[standalone]
                { $gender ->
                    [f] debela
                    [n] debelo
                   *[m] debel
                }
        }
    .thin =
        { $role ->
            [border-clause] tankim
            [background-clause] tankem
            [text-clause] tanko
           *[standalone]
                { $gender ->
                    [f] tanka
                    [n] tanko
                   *[m] tanek
                }
        }
line-style =
    .dashed =
        { $role ->
            [border-clause] črtkanim
            [background-clause] črtkanem
            [text-clause] črtkano
           *[standalone]
                { $gender ->
                    [f] črtkana
                    [n] črtkano
                   *[m] črtkan
                }
        }
    .dotted =
        { $role ->
            [border-clause] pikčastim
            [background-clause] pikčastem
            [text-clause] pikčasto
           *[standalone]
                { $gender ->
                    [f] pikčasta
                    [n] pikčasto
                   *[m] pikčast
                }
        }
# Instrumental plurals, each carrying the preposition that governs it — «s»
# before a voiceless sound and «z» before a voiced one, which is a fact about
# the following word and so is settled here rather than where the pattern is
# placed. They agree with nothing.
fill-style =
    .horizontal = z vodoravnimi črtami
    .vertical = z navpičnimi črtami
    .diagonal = z diagonalnimi črtami
    .backdiagonal = z obratnimi diagonalnimi črtami
    .dots = s pikami
    .diamonds = z rombi
noun =
    .line = premica
    .line-segment = daljica
    .ray = poltrak
    .vector = vektor
    .curve = krivulja
    .function = funkcija
    .parabola = parabola
    .polyline = lomljenka
    .polygon = mnogokotnik
    .triangle = trikotnik
    .rectangle = pravokotnik
    .circle = krožnica
    .region = območje
    .point = točka
    .square = kvadrat
    .diamond = romb
    .cross = križ
    .plus = plus
# Slovenian keeps the side count in front of the noun, so the whole of it is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] pravilni { $numSides }-kotnik
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (mnogokotnik, m) or
# the head of a phrase the description never names: `border` (rob, m), `fill`
# (polnilo, n), `text` (besedilo, n), `background` (ozadje, n).
noun-gender =
    { $noun ->
        [line] f
        [line-segment] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [circle] f
        [point] f
        [region] n
        [fill] n
        [text] n
        [background] n
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
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
# Only ever said of the shape itself, so it is standalone in every description
# and takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] zapolnjena
        [n] zapolnjeno
       *[m] zapolnjen
    }
# `{ $pattern }` arrives with its own preposition, so none is written here.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «rob» is masculine, so the border's adjectives agree with it and not with the
# shape it surrounds. Slovenian has no article, so the two `-article` branches
# read like the two without.
style-border-clause =
    { $parts ->
        [with-article] z { $border } robom
        [and] in { $border } robom
        [and-article] in { $border } robom
       *[with] z { $border } robom
    }
# The fill-pattern words are instrumental plurals, so this message supplies a
# noun for the colour to hang off — «polnilo», neuter, which is the gender
# `noun-gender` already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] { $color } polnilo { $pattern }
       *[plain] { $color } polnilo
    }
style-unfilled = nezapolnjen
style-text =
    { $parts ->
        [background] { $color } na { $background } ozadju
       *[plain] { $color }
    }
style-background-none = brez

## Boolean words

boolean-true = resnično
boolean-false = neresnično

## Answer buttons

answer-submit-label = Preveri
answer-submit-label-no-correctness = Pošlji odgovor

## Sectional blocks

section-name =
    .activity = Dejavnost
    .aside = Ekskurz
    .cascade = Kaskada
    .definition = Definicija
    .example = Zgled
    .exercise = Vaja
    .exercises = Vaje
    .given-answer = Odgovor
    .note = Opomba
    .objectives = Cilji
    .paragraphs = Odstavki
    .part = Del
    .problem = Naloga
    .problems = Naloge
    .proof = Dokaz
    .question = Vprašanje
    .section = Razdelek
    .solution = Rešitev
    .task = Naloga
    .theorem = Izrek
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Namig

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabela { $enumeration }
        [numbered-title] Tabela { $enumeration }{ ": " }
        [unnumbered-title] Tabela{ ": " }
       *[unnumbered] Tabela
    }
figure-name =
    { $parts ->
        [numbered] Slika { $enumeration }
        [numbered-caption] Slika { $enumeration }{ ": " }
        [unnumbered-caption] Slika{ ": " }
       *[unnumbered] Slika
    }

## Paginator controls

paginator-previous = Prejšnja
paginator-next = Naslednja
paginator-page = Stran
paginator-page-status = { $pageLabel } { $currentPage } od { $numPages }

## Piecewise functions

piecewise-condition-or = ali
piecewise-condition-if = če
piecewise-condition-otherwise = sicer

## Chemistry

element-name =
    .h = Vodik
    .he = Helij
    .li = Litij
    .be = Berilij
    .b = Bor
    .c = Ogljik
    .n = Dušik
    .o = Kisik
    .f = Fluor
    .ne = Neon
    .na = Natrij
    .mg = Magnezij
    .al = Aluminij
    .si = Silicij
    .p = Fosfor
    .s = Žveplo
    .cl = Klor
    .ar = Argon
    .k = Kalij
    .ca = Kalcij
    .sc = Skandij
    .ti = Titan
    .v = Vanadij
    .cr = Krom
    .mn = Mangan
    .fe = Železo
    .co = Kobalt
    .ni = Nikelj
    .cu = Baker
    .zn = Cink
    .ga = Galij
    .ge = Germanij
    .as = Arzen
    .se = Selen
    .br = Brom
    .kr = Kripton
    .rb = Rubidij
    .sr = Stroncij
    .y = Itrij
    .zr = Cirkonij
    .nb = Niobij
    .mo = Molibden
    .tc = Tehnecij
    .ru = Rutenij
    .rh = Rodij
    .pd = Paladij
    .ag = Srebro
    .cd = Kadmij
    .in = Indij
    .sn = Kositer
    .sb = Antimon
    .te = Telur
    .i = Jod
    .xe = Ksenon
    .cs = Cezij
    .ba = Barij
    .la = Lantan
    .ce = Cerij
    .pr = Prazeodim
    .nd = Neodim
    .pm = Prometij
    .sm = Samarij
    .eu = Evropij
    .gd = Gadolinij
    .tb = Terbij
    .dy = Disprozij
    .ho = Holmij
    .er = Erbij
    .tm = Tulij
    .yb = Iterbij
    .lu = Lutecij
    .hf = Hafnij
    .ta = Tantal
    .w = Volfram
    .re = Renij
    .os = Osmij
    .ir = Iridij
    .pt = Platina
    .au = Zlato
    .hg = Živo srebro
    .tl = Talij
    .pb = Svinec
    .bi = Bizmut
    .po = Polonij
    .at = Astat
    .rn = Radon
    .fr = Francij
    .ra = Radij
    .ac = Aktinij
    .th = Torij
    .pa = Protaktinij
    .u = Uran
    .np = Neptunij
    .pu = Plutonij
    .am = Americij
    .cm = Kirij
    .bk = Berkelij
    .cf = Kalifornij
    .es = Ajnštajnij
    .fm = Fermij
    .md = Mendelevij
    .no = Nobelij
    .lr = Lavrencij
    .rf = Raderfordij
    .db = Dubnij
    .sg = Siborgij
    .bh = Borij
    .hs = Hasij
    .mt = Majtnerij
    .ds = Darmštadtij
    .rg = Rentgenij
    .cn = Kopernicij
    .nh = Nihonij
    .fl = Flerovij
    .mc = Moskovij
    .lv = Livermorij
    .ts = Tenesin
    .og = Oganeson
element-anion-name =
    .h = Hidrid
    .c = Karbid
    .n = Nitrid
    .o = Oksid
    .f = Fluorid
    .p = Fosfid
    .s = Sulfid
    .cl = Klorid
    .br = Bromid
    .i = Jodid
    .at = Astatid
    .ts = Tenesid
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Neveljaven kemijski simbol
chemistry-invalid-ionic-compound = Neveljavna ionska spojina
