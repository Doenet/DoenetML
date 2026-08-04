# Lithuanian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Lithuanian inflects for seven cases and has two genders. Adjectives precede
# their noun and agree with it in gender and in the case its position governs,
# so every describing word below selects on `$role` first and only then, where
# it matters, on `$gender`:
#
#   standalone          nominative: `-as`/`-is` m, `-a`/`-ė` f
#   border-clause       after «su», which governs the instrumental, of
#                       «rėmelis» — masculine: `-u`/`-iu`
#   background-clause   the locative of «fonas» — masculine: `-ame`/`-iame`.
#                       Lithuanian marks that position with a case ending
#                       rather than with a preposition, so nothing stands in
#                       front of the colour there.
#   text-clause         nominative masculine, agreeing with «tekstas»
#
# All four of the heads this catalog needs — «rėmelis», «užpildas», «tekstas»
# and «fonas» — are masculine, so the clause branches take no gender fork.
# `locales/lv`, its closest relative here, splits them across two genders and
# needs a different case in each.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] juodu
            [background-clause] juodame
            [text-clause] juodas
           *[standalone]
                { $gender ->
                    [f] juoda
                   *[m] juodas
                }
        }
    .white =
        { $role ->
            [border-clause] baltu
            [background-clause] baltame
            [text-clause] baltas
           *[standalone]
                { $gender ->
                    [f] balta
                   *[m] baltas
                }
        }
    .gray =
        { $role ->
            [border-clause] pilku
            [background-clause] pilkame
            [text-clause] pilkas
           *[standalone]
                { $gender ->
                    [f] pilka
                   *[m] pilkas
                }
        }
    .red =
        { $role ->
            [border-clause] raudonu
            [background-clause] raudoname
            [text-clause] raudonas
           *[standalone]
                { $gender ->
                    [f] raudona
                   *[m] raudonas
                }
        }
    .orange =
        { $role ->
            [border-clause] oranžiniu
            [background-clause] oranžiniame
            [text-clause] oranžinis
           *[standalone]
                { $gender ->
                    [f] oranžinė
                   *[m] oranžinis
                }
        }
    .yellow =
        { $role ->
            [border-clause] geltonu
            [background-clause] geltoname
            [text-clause] geltonas
           *[standalone]
                { $gender ->
                    [f] geltona
                   *[m] geltonas
                }
        }
    .green =
        { $role ->
            [border-clause] žaliu
            [background-clause] žaliame
            [text-clause] žalias
           *[standalone]
                { $gender ->
                    [f] žalia
                   *[m] žalias
                }
        }
    .cyan =
        { $role ->
            [border-clause] žydru
            [background-clause] žydrame
            [text-clause] žydras
           *[standalone]
                { $gender ->
                    [f] žydra
                   *[m] žydras
                }
        }
    .blue =
        { $role ->
            [border-clause] mėlynu
            [background-clause] mėlyname
            [text-clause] mėlynas
           *[standalone]
                { $gender ->
                    [f] mėlyna
                   *[m] mėlynas
                }
        }
    .purple =
        { $role ->
            [border-clause] violetiniu
            [background-clause] violetiniame
            [text-clause] violetinis
           *[standalone]
                { $gender ->
                    [f] violetinė
                   *[m] violetinis
                }
        }
    .pink =
        { $role ->
            [border-clause] rožiniu
            [background-clause] rožiniame
            [text-clause] rožinis
           *[standalone]
                { $gender ->
                    [f] rožinė
                   *[m] rožinis
                }
        }
    .brown =
        { $role ->
            [border-clause] rudu
            [background-clause] rudame
            [text-clause] rudas
           *[standalone]
                { $gender ->
                    [f] ruda
                   *[m] rudas
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] storu
            [background-clause] storame
            [text-clause] storas
           *[standalone]
                { $gender ->
                    [f] stora
                   *[m] storas
                }
        }
    .thin =
        { $role ->
            [border-clause] plonu
            [background-clause] ploname
            [text-clause] plonas
           *[standalone]
                { $gender ->
                    [f] plona
                   *[m] plonas
                }
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] brūkšniniu
            [background-clause] brūkšniniame
            [text-clause] brūkšninis
           *[standalone]
                { $gender ->
                    [f] brūkšninė
                   *[m] brūkšninis
                }
        }
    .dotted =
        { $role ->
            [border-clause] taškiniu
            [background-clause] taškiniame
            [text-clause] taškinis
           *[standalone]
                { $gender ->
                    [f] taškinė
                   *[m] taškinis
                }
        }

# Noun phrases in the instrumental, which is the case «su» takes. They agree
# with nothing.
fill-style =
    .horizontal = horizontaliomis linijomis
    .vertical = vertikaliomis linijomis
    .diagonal = įstrižomis linijomis
    .backdiagonal = atvirkštinėmis įstrižomis linijomis
    .dots = taškais
    .diamonds = rombais

noun =
    .line = tiesė
    .line-segment = atkarpa
    .ray = spindulys
    .vector = vektorius
    .curve = kreivė
    .function = funkcija
    .parabola = parabolė
    .polyline = laužtė
    .polygon = daugiakampis
    .triangle = trikampis
    .rectangle = stačiakampis
    .circle = apskritimas
    .region = sritis
    .point = taškas
    .square = kvadratas
    .diamond = rombas
    .cross = kryžius
    .plus = pliusas

# Lithuanian keeps the side count in front of the noun, so the whole of it is
# one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] taisyklingasis { $numSides }-kampis
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (daugiakampis, m)
# or the head of a phrase the description never names: `border` (rėmelis, m),
# `fill` (užpildas, m), `text` (tekstas, m), `background` (fonas, m).
noun-gender =
    { $noun ->
        [line] f
        [line-segment] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [region] f
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
        [f] užpildyta
       *[m] užpildytas
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } su { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } su { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } su { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «rėmelis» is masculine, so the border's adjectives agree with it and not with
# the shape it surrounds. Lithuanian has no article, so the two `-article`
# branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] su { $border } rėmeliu
        [and] ir { $border } rėmeliu
        [and-article] ir { $border } rėmeliu
       *[with] su { $border } rėmeliu
    }

# The fill-pattern words are instrumental plurals, because their other use is
# the «su { $pattern }» clause in `style-filled`. So this message supplies a
# noun for them to hang off — «užpildas», masculine, which is the gender
# `noun-gender` already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] { $color } užpildas su { $pattern }
       *[plain] { $color } užpildas
    }

style-unfilled = neužpildytas

# The background sits in the locative and carries no preposition of its own, so
# the two colours simply follow one another.
style-text =
    { $parts ->
        [background] { $color } { $background } fone
       *[plain] { $color }
    }

style-background-none = nėra


## Boolean words

boolean-true = tiesa
boolean-false = netiesa


## Answer buttons

answer-submit-label = Tikrinti
answer-submit-label-no-correctness = Pateikti atsakymą


## Sectional blocks

section-name =
    .activity = Veikla
    .aside = Intarpas
    .cascade = Kaskada
    .definition = Apibrėžimas
    .example = Pavyzdys
    .exercise = Pratimas
    .exercises = Pratimai
    .given-answer = Atsakymas
    .note = Pastaba
    .objectives = Tikslai
    .paragraphs = Pastraipos
    .part = Dalis
    .problem = Uždavinys
    .problems = Uždaviniai
    .proof = Įrodymas
    .question = Klausimas
    .section = Skyrius
    .solution = Sprendimas
    .task = Užduotis
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

hint-title = Užuomina


## Tables and figures

table-name =
    { $parts ->
        [numbered] { $enumeration } lentelė
        [numbered-title] { $enumeration } lentelė{ ". " }
        [unnumbered-title] Lentelė{ ". " }
       *[unnumbered] Lentelė
    }

figure-name =
    { $parts ->
        [numbered] { $enumeration } pav.
        [numbered-caption] { $enumeration } pav{ ". " }
        [unnumbered-caption] Paveikslas{ ". " }
       *[unnumbered] Paveikslas
    }


## Paginator controls

paginator-previous = Ankstesnis
paginator-next = Kitas
paginator-page = Puslapis

paginator-page-status = { $pageLabel } { $currentPage } iš { $numPages }


## Piecewise functions

piecewise-condition-or = arba
piecewise-condition-if = jei
piecewise-condition-otherwise = kitaip


## Chemistry

element-name =
    .h = Vandenilis
    .he = Helis
    .li = Litis
    .be = Berilis
    .b = Boras
    .c = Anglis
    .n = Azotas
    .o = Deguonis
    .f = Fluoras
    .ne = Neonas
    .na = Natris
    .mg = Magnis
    .al = Aliuminis
    .si = Silicis
    .p = Fosforas
    .s = Siera
    .cl = Chloras
    .ar = Argonas
    .k = Kalis
    .ca = Kalcis
    .sc = Skandis
    .ti = Titanas
    .v = Vanadis
    .cr = Chromas
    .mn = Manganas
    .fe = Geležis
    .co = Kobaltas
    .ni = Nikelis
    .cu = Varis
    .zn = Cinkas
    .ga = Galis
    .ge = Germanis
    .as = Arsenas
    .se = Selenas
    .br = Bromas
    .kr = Kriptonas
    .rb = Rubidis
    .sr = Stroncis
    .y = Itris
    .zr = Cirkonis
    .nb = Niobis
    .mo = Molibdenas
    .tc = Technecis
    .ru = Rutenis
    .rh = Rodis
    .pd = Paladis
    .ag = Sidabras
    .cd = Kadmis
    .in = Indis
    .sn = Alavas
    .sb = Stibis
    .te = Telūras
    .i = Jodas
    .xe = Ksenonas
    .cs = Cezis
    .ba = Baris
    .la = Lantanas
    .ce = Ceris
    .pr = Prazeodimis
    .nd = Neodimis
    .pm = Prometis
    .sm = Samaris
    .eu = Europis
    .gd = Gadolinis
    .tb = Terbis
    .dy = Disprozis
    .ho = Holmis
    .er = Erbis
    .tm = Tulis
    .yb = Iterbis
    .lu = Liutecis
    .hf = Hafnis
    .ta = Tantalas
    .w = Volframas
    .re = Renis
    .os = Osmis
    .ir = Iridis
    .pt = Platina
    .au = Auksas
    .hg = Gyvsidabris
    .tl = Talis
    .pb = Švinas
    .bi = Bismutas
    .po = Polonis
    .at = Astatas
    .rn = Radonas
    .fr = Prancis
    .ra = Radis
    .ac = Aktinis
    .th = Toris
    .pa = Protaktinis
    .u = Uranas
    .np = Neptūnis
    .pu = Plutonis
    .am = Americis
    .cm = Kiuris
    .bk = Berkelis
    .cf = Kalifornis
    .es = Einšteinis
    .fm = Fermis
    .md = Mendelevis
    .no = Nobelis
    .lr = Laurencis
    .rf = Rezerfordis
    .db = Dubnis
    .sg = Siborgis
    .bh = Boris
    .hs = Hasis
    .mt = Meitneris
    .ds = Darmštatis
    .rg = Rentgenis
    .cn = Kopernicis
    .nh = Nihonis
    .fl = Flerovis
    .mc = Moskovis
    .lv = Livermoris
    .ts = Tenesinas
    .og = Oganesonas

element-anion-name =
    .h = Hidridas
    .c = Karbidas
    .n = Nitridas
    .o = Oksidas
    .f = Fluoridas
    .p = Fosfidas
    .s = Sulfidas
    .cl = Chloridas
    .br = Bromidas
    .i = Jodidas
    .at = Astatidas
    .ts = Tenesidas

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Netinkamas cheminis simbolis
chemistry-invalid-ionic-compound = Netinkamas joninis junginys
