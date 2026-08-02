# Slovak content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Slovak inflects for gender *and* for case, so every adjective below selects
# on `$role` first — which position the words are going into — and then on
# `$gender` where the answer still depends on one:
#
#   standalone          nominative, agreeing with the noun described:
#                       `-ý` m, `-á` f, `-é` n
#   border-clause       instrumental after «s», of «okraj» — masculine: `-ým`
#   background-clause   locative after «na», of «pozadie» — neuter: `-om`
#   text-clause         nominative masculine, agreeing with «text»
#
# The last three need no gender branch: each is used of exactly one noun, and
# that noun's gender is fixed.
#
# A preposition whose form depends on the word after it cannot be written
# beside a placeable. Slovak vocalizes «v» to «vo» and «s» to «so» before
# certain consonants, and the catalog cannot see which word the argument will
# turn out to be — so the words that land after them are chosen not to trigger
# it, which is why the pattern for horizontal lines is «horizontálne čiary» and
# not «vodorovné čiary».
#
# Adjectives precede their noun, as in English, so the composition messages
# keep the English order.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] čiernym
            [background-clause] čiernom
            [text-clause] čierny
           *[standalone]
                { $gender ->
                    [f] čierna
                    [n] čierne
                   *[m] čierny
                }
        }
    .white =
        { $role ->
            [border-clause] bielym
            [background-clause] bielom
            [text-clause] biely
           *[standalone]
                { $gender ->
                    [f] biela
                    [n] biele
                   *[m] biely
                }
        }
    .gray =
        { $role ->
            [border-clause] sivým
            [background-clause] sivom
            [text-clause] sivý
           *[standalone]
                { $gender ->
                    [f] sivá
                    [n] sivé
                   *[m] sivý
                }
        }
    .red =
        { $role ->
            [border-clause] červeným
            [background-clause] červenom
            [text-clause] červený
           *[standalone]
                { $gender ->
                    [f] červená
                    [n] červené
                   *[m] červený
                }
        }
    .orange =
        { $role ->
            [border-clause] oranžovým
            [background-clause] oranžovom
            [text-clause] oranžový
           *[standalone]
                { $gender ->
                    [f] oranžová
                    [n] oranžové
                   *[m] oranžový
                }
        }
    .yellow =
        { $role ->
            [border-clause] žltým
            [background-clause] žltom
            [text-clause] žltý
           *[standalone]
                { $gender ->
                    [f] žltá
                    [n] žlté
                   *[m] žltý
                }
        }
    .green =
        { $role ->
            [border-clause] zeleným
            [background-clause] zelenom
            [text-clause] zelený
           *[standalone]
                { $gender ->
                    [f] zelená
                    [n] zelené
                   *[m] zelený
                }
        }
    .cyan =
        { $role ->
            [border-clause] azúrovým
            [background-clause] azúrovom
            [text-clause] azúrový
           *[standalone]
                { $gender ->
                    [f] azúrová
                    [n] azúrové
                   *[m] azúrový
                }
        }
    .blue =
        { $role ->
            [border-clause] modrým
            [background-clause] modrom
            [text-clause] modrý
           *[standalone]
                { $gender ->
                    [f] modrá
                    [n] modré
                   *[m] modrý
                }
        }
    .purple =
        { $role ->
            [border-clause] fialovým
            [background-clause] fialovom
            [text-clause] fialový
           *[standalone]
                { $gender ->
                    [f] fialová
                    [n] fialové
                   *[m] fialový
                }
        }
    .pink =
        { $role ->
            [border-clause] ružovým
            [background-clause] ružovom
            [text-clause] ružový
           *[standalone]
                { $gender ->
                    [f] ružová
                    [n] ružové
                   *[m] ružový
                }
        }
    .brown =
        { $role ->
            [border-clause] hnedým
            [background-clause] hnedom
            [text-clause] hnedý
           *[standalone]
                { $gender ->
                    [f] hnedá
                    [n] hnedé
                   *[m] hnedý
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] hrubým
            [background-clause] hrubom
            [text-clause] hrubý
           *[standalone]
                { $gender ->
                    [f] hrubá
                    [n] hrubé
                   *[m] hrubý
                }
        }
    .thin =
        { $role ->
            [border-clause] tenkým
            [background-clause] tenkom
            [text-clause] tenký
           *[standalone]
                { $gender ->
                    [f] tenká
                    [n] tenké
                   *[m] tenký
                }
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] čiarkovaným
            [background-clause] čiarkovanom
            [text-clause] čiarkovaný
           *[standalone]
                { $gender ->
                    [f] čiarkovaná
                    [n] čiarkované
                   *[m] čiarkovaný
                }
        }
    .dotted =
        { $role ->
            [border-clause] bodkovaným
            [background-clause] bodkovanom
            [text-clause] bodkovaný
           *[standalone]
                { $gender ->
                    [f] bodkovaná
                    [n] bodkované
                   *[m] bodkovaný
                }
        }

# Noun phrases in the accusative plural, which is the case «v» takes when it
# names a pattern — «v bodky», the way Slovak describes patterned cloth. The
# accusative plural of an inanimate noun is spelled like the nominative, so the
# same words serve `style-fill`, where they stand on their own.
fill-style =
    .horizontal = horizontálne čiary
    .vertical = zvislé čiary
    .diagonal = šikmé čiary
    .backdiagonal = opačne šikmé čiary
    .dots = bodky
    .diamonds = kosoštvorce

noun =
    .line = priamka
    .line-segment = úsečka
    .ray = polpriamka
    .vector = vektor
    .curve = krivka
    .function = funkcia
    .parabola = parabola
    .polyline = lomená čiara
    .polygon = mnohouholník
    .triangle = trojuholník
    .rectangle = obdĺžnik
    .circle = kružnica
    .region = oblasť
    .point = bod
    .square = štvorec
    .diamond = kosoštvorec
    .cross = krížik
    .plus = plus

# Slovak names a regular polygon by its side count in one word — «pravidelný
# 5-uholník» — so the count stays in the head and there is no tail, exactly as
# in English. Czech next door splits it, which is the point of `$part` being a
# per-catalog decision rather than a per-family one.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] pravidelný { $numSides }-uholník
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (mnohouholník, m)
# or the head of a phrase the description never names: `border` (okraj, m),
# `fill` (výplň, f), `text` (text, m), `background` (pozadie, n).
noun-gender =
    { $noun ->
        [line] f
        [line-segment] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [circle] f
        [region] f
        [fill] f
        [plus] n
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
        [f] vyplnená
        [n] vyplnené
       *[m] vyplnený
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } v { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } v { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } v { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «s» governs the instrumental, which the `border-clause` branch of every
# adjective supplies. Slovak has no article, so the `-article` branches read
# the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] s { $border } okrajom
        [and] a s { $border } okrajom
        [and-article] a s { $border } okrajom
       *[with] s { $border } okrajom
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = nevyplnený

# «na» governs the locative, which is what the `background-clause` branch of
# every adjective supplies — «na čiernom pozadí».
style-text =
    { $parts ->
        [background] { $color } na { $background } pozadí
       *[plain] { $color }
    }

style-background-none = žiadne


## Boolean words

boolean-true = pravda
boolean-false = nepravda


## Answer buttons

answer-submit-label = Skontrolovať
answer-submit-label-no-correctness = Odoslať odpoveď


## Sectional blocks

section-name =
    .activity = Aktivita
    .aside = Poznámka na okraj
    .cascade = Kaskáda
    .definition = Definícia
    .example = Príklad
    .exercise = Cvičenie
    .exercises = Cvičenia
    .given-answer = Odpoveď
    .note = Poznámka
    .objectives = Ciele
    .paragraphs = Odseky
    .part = Časť
    .problem = Úloha
    .problems = Úlohy
    .proof = Dôkaz
    .question = Otázka
    .section = Kapitola
    .solution = Riešenie
    .task = Zadanie
    .theorem = Veta

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Pomôcka


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabuľka { $enumeration }
        [numbered-title] Tabuľka { $enumeration }{ ": " }
        [unnumbered-title] Tabuľka{ ": " }
       *[unnumbered] Tabuľka
    }

figure-name =
    { $parts ->
        [numbered] Obrázok { $enumeration }
        [numbered-caption] Obrázok { $enumeration }{ ": " }
        [unnumbered-caption] Obrázok{ ": " }
       *[unnumbered] Obrázok
    }


## Paginator controls

paginator-previous = Predchádzajúca
paginator-next = Ďalšia
paginator-page = Strana

paginator-page-status = { $pageLabel } { $currentPage } z { $numPages }


## Piecewise functions

piecewise-condition-or = alebo
piecewise-condition-if = ak
piecewise-condition-otherwise = inak


## Chemistry

element-name =
    .h = Vodík
    .he = Hélium
    .li = Lítium
    .be = Berýlium
    .b = Bór
    .c = Uhlík
    .n = Dusík
    .o = Kyslík
    .f = Fluór
    .ne = Neón
    .na = Sodík
    .mg = Horčík
    .al = Hliník
    .si = Kremík
    .p = Fosfor
    .s = Síra
    .cl = Chlór
    .ar = Argón
    .k = Draslík
    .ca = Vápnik
    .sc = Skandium
    .ti = Titán
    .v = Vanád
    .cr = Chróm
    .mn = Mangán
    .fe = Železo
    .co = Kobalt
    .ni = Nikel
    .cu = Meď
    .zn = Zinok
    .ga = Gálium
    .ge = Germánium
    .as = Arzén
    .se = Selén
    .br = Bróm
    .kr = Kryptón
    .rb = Rubídium
    .sr = Stroncium
    .y = Ytrium
    .zr = Zirkónium
    .nb = Niób
    .mo = Molybdén
    .tc = Technécium
    .ru = Ruténium
    .rh = Ródium
    .pd = Paládium
    .ag = Striebro
    .cd = Kadmium
    .in = Indium
    .sn = Cín
    .sb = Antimón
    .te = Telúr
    .i = Jód
    .xe = Xenón
    .cs = Cézium
    .ba = Bárium
    .la = Lantán
    .ce = Cér
    .pr = Prazeodým
    .nd = Neodým
    .pm = Prométium
    .sm = Samárium
    .eu = Európium
    .gd = Gadolínium
    .tb = Terbium
    .dy = Dysprózium
    .ho = Holmium
    .er = Erbium
    .tm = Túlium
    .yb = Yterbium
    .lu = Lutécium
    .hf = Hafnium
    .ta = Tantal
    .w = Volfrám
    .re = Rénium
    .os = Osmium
    .ir = Irídium
    .pt = Platina
    .au = Zlato
    .hg = Ortuť
    .tl = Tálium
    .pb = Olovo
    .bi = Bizmut
    .po = Polónium
    .at = Astát
    .rn = Radón
    .fr = Francium
    .ra = Rádium
    .ac = Aktínium
    .th = Tórium
    .pa = Protaktínium
    .u = Urán
    .np = Neptúnium
    .pu = Plutónium
    .am = Amerícium
    .cm = Curium
    .bk = Berkelium
    .cf = Kalifornium
    .es = Einsteinium
    .fm = Fermium
    .md = Mendelevium
    .no = Nobelium
    .lr = Lawrencium
    .rf = Ruterfordium
    .db = Dubnium
    .sg = Seaborgium
    .bh = Bohrium
    .hs = Hassium
    .mt = Meitnerium
    .ds = Darmstadtium
    .rg = Roentgenium
    .cn = Kopernicium
    .nh = Nihonium
    .fl = Flerovium
    .mc = Moscovium
    .lv = Livermorium
    .ts = Tennessín
    .og = Oganesson

element-anion-name =
    .h = Hydrid
    .c = Karbid
    .n = Nitrid
    .o = Oxid
    .f = Fluorid
    .p = Fosfid
    .s = Sulfid
    .cl = Chlorid
    .br = Bromid
    .i = Jodid
    .at = Astatid
    .ts = Tennessid

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Neplatná chemická značka
chemistry-invalid-ionic-compound = Neplatná iónová zlúčenina
