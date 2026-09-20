# Bosnian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Bosnian inflects for seven cases and has three genders. Adjectives precede
# their noun and agree with it in gender and in the case its position governs,
# so every describing word below selects on `$role` first — which position the
# words are going into — and only then, where it matters, on `$gender`:
#
#   standalone          nominative: `-∅` m, `-a` f
#   border-clause       after «sa», which governs the instrumental, of «ivica»
#                       — feminine: `-om`
#   background-clause   after «na», locative here, of «pozadina» — feminine:
#                       `-oj`
#   text-clause         nominative masculine, agreeing with «tekst»
#
# The last three need no gender branch: each is only ever used of one noun, and
# that noun's gender is fixed. This is the shape `locales/hr` and `locales/ru`
# already have, with two cases of Bosnian's own in the two clauses — and the
# border's is not Croatian's, because `locales/hr` calls a border «rub», which
# is masculine, and this catalog calls it «ivica», which is not.
#
# There is no neuter branch anywhere below, and that is a fact about the word
# list rather than about Bosnian: no noun `noun-gender` can answer with is
# neuter, so a `[n]` variant would be one nothing could select. Adding a neuter
# noun to the table means adding the branch back to every adjective.
#
# Bosnian and Croatian are two standard languages, and this file is not a copy
# of `locales/hr` with its diacritics moved: it writes «tačka» where that one
# writes «točka», «tabela» for «tablica», «narandžast» for «narančast»,
# «kalaj» for «kositar», and «hemijski» for «kemijski».


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] crnom
            [background-clause] crnoj
            [text-clause] crn
           *[standalone]
                { $gender ->
                    [f] crna
                   *[m] crn
                }
        }
    .white =
        { $role ->
            [border-clause] bijelom
            [background-clause] bijeloj
            [text-clause] bijel
           *[standalone]
                { $gender ->
                    [f] bijela
                   *[m] bijel
                }
        }
    .gray =
        { $role ->
            [border-clause] sivom
            [background-clause] sivoj
            [text-clause] siv
           *[standalone]
                { $gender ->
                    [f] siva
                   *[m] siv
                }
        }
    .red =
        { $role ->
            [border-clause] crvenom
            [background-clause] crvenoj
            [text-clause] crven
           *[standalone]
                { $gender ->
                    [f] crvena
                   *[m] crven
                }
        }
    .orange =
        { $role ->
            [border-clause] narandžastom
            [background-clause] narandžastoj
            [text-clause] narandžast
           *[standalone]
                { $gender ->
                    [f] narandžasta
                   *[m] narandžast
                }
        }
    .yellow =
        { $role ->
            [border-clause] žutom
            [background-clause] žutoj
            [text-clause] žut
           *[standalone]
                { $gender ->
                    [f] žuta
                   *[m] žut
                }
        }
    .green =
        { $role ->
            [border-clause] zelenom
            [background-clause] zelenoj
            [text-clause] zelen
           *[standalone]
                { $gender ->
                    [f] zelena
                   *[m] zelen
                }
        }
    .cyan =
        { $role ->
            [border-clause] tirkiznom
            [background-clause] tirkiznoj
            [text-clause] tirkizan
           *[standalone]
                { $gender ->
                    [f] tirkizna
                   *[m] tirkizan
                }
        }
    .blue =
        { $role ->
            [border-clause] plavom
            [background-clause] plavoj
            [text-clause] plav
           *[standalone]
                { $gender ->
                    [f] plava
                   *[m] plav
                }
        }
    .purple =
        { $role ->
            [border-clause] ljubičastom
            [background-clause] ljubičastoj
            [text-clause] ljubičast
           *[standalone]
                { $gender ->
                    [f] ljubičasta
                   *[m] ljubičast
                }
        }
    .pink =
        { $role ->
            [border-clause] ružičastom
            [background-clause] ružičastoj
            [text-clause] ružičast
           *[standalone]
                { $gender ->
                    [f] ružičasta
                   *[m] ružičast
                }
        }
    .brown =
        { $role ->
            [border-clause] smeđom
            [background-clause] smeđoj
            [text-clause] smeđ
           *[standalone]
                { $gender ->
                    [f] smeđa
                   *[m] smeđ
                }
        }
line-width =
    .thick =
        { $role ->
            [border-clause] debelom
            [background-clause] debeloj
            [text-clause] debeo
           *[standalone]
                { $gender ->
                    [f] debela
                   *[m] debeo
                }
        }
    .thin =
        { $role ->
            [border-clause] tankom
            [background-clause] tankoj
            [text-clause] tanak
           *[standalone]
                { $gender ->
                    [f] tanka
                   *[m] tanak
                }
        }
line-style =
    .dashed =
        { $role ->
            [border-clause] iscrtkanom
            [background-clause] iscrtkanoj
            [text-clause] iscrtkan
           *[standalone]
                { $gender ->
                    [f] iscrtkana
                   *[m] iscrtkan
                }
        }
    .dotted =
        { $role ->
            [border-clause] tačkastom
            [background-clause] tačkastoj
            [text-clause] tačkast
           *[standalone]
                { $gender ->
                    [f] tačkasta
                   *[m] tačkast
                }
        }
# Noun phrases in the instrumental, which is the case «sa» takes. They agree
# with nothing.
fill-style =
    .horizontal = vodoravnim linijama
    .vertical = uspravnim linijama
    .diagonal = dijagonalnim linijama
    .backdiagonal = obrnutim dijagonalnim linijama
    .dots = tačkama
    .diamonds = rombovima
noun =
    .line = prava
    .line-segment = duž
    .ray = poluprava
    .vector = vektor
    .curve = kriva
    .function = funkcija
    .parabola = parabola
    .polyline = izlomljena linija
    .polygon = mnogougao
    .triangle = trougao
    .rectangle = pravougaonik
    .circle = kružnica
    .region = oblast
    .point = tačka
    .square = kvadrat
    .diamond = romb
    .cross = križ
    .plus = plus
# Bosnian keeps the side count in front of the noun, so the whole of it is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] pravilni { $numSides }-ougao
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (mnogougao, m) or
# the head of a phrase the description never names: `border` (ivica, f), `fill`
# (ispuna, f), `text` (tekst, m), `background` (pozadina, f).
#
# Nothing here is neuter, which is why no adjective above writes an `[n]`
# branch. A neuter noun added to this table needs those branches added with it.
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
        [point] f
        [border] f
        [fill] f
        [background] f
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
        [f] ispunjena
       *[m] ispunjen
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } sa { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } sa { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } sa { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «ivica» is feminine, so the border's adjectives agree with it and not with the
# shape it surrounds — and they are in the instrumental, which «sa» governs.
# Bosnian has no article, so the two `-article` branches read like the two
# without.
style-border-clause =
    { $parts ->
        [with-article] sa { $border } ivicom
        [and] i { $border } ivicom
        [and-article] i { $border } ivicom
       *[with] sa { $border } ivicom
    }
# The fill-pattern words are instrumental plurals, because their other use is
# the «sa { $pattern }» clause in `style-filled`. So this message supplies a
# noun for them to hang off — «ispuna», feminine, which is the gender
# `noun-gender` already answers for `fill`, so the colour agrees with it in
# both variants.
style-fill =
    { $parts ->
        [pattern] { $color } ispuna sa { $pattern }
       *[plain] { $color } ispuna
    }
style-unfilled = neispunjen
style-text =
    { $parts ->
        [background] { $color } na { $background } pozadini
       *[plain] { $color }
    }
style-background-none = nema

## Boolean words
##
## What a `<boolean>` displays, so these are the words a reader meets rather
## than the `true`/`false` an author writes. «tačno»/«netačno» is what a Bosnian
## school answer key says; `locales/hr` chooses «istina»/«laž», which is the
## same decision made the other way.

boolean-true = tačno
boolean-false = netačno

## Answer buttons

answer-submit-label = Provjeri
answer-submit-label-no-correctness = Pošalji odgovor

## Sectional blocks

section-name =
    .activity = Aktivnost
    .aside = Digresija
    .cascade = Kaskada
    .definition = Definicija
    .example = Primjer
    .exercise = Vježba
    .exercises = Vježbe
    .given-answer = Odgovor
    .note = Napomena
    .objectives = Ciljevi
    .paragraphs = Pasusi
    .part = Dio
    .problem = Zadatak
    .problems = Zadaci
    .proof = Dokaz
    .question = Pitanje
    .section = Odjeljak
    .solution = Rješenje
    .task = Zadatak
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
hint-title = Savjet

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabela { $enumeration }
        [numbered-title] Tabela { $enumeration }{ ". " }
        [unnumbered-title] Tabela{ ". " }
       *[unnumbered] Tabela
    }
figure-name =
    { $parts ->
        [numbered] Slika { $enumeration }
        [numbered-caption] Slika { $enumeration }{ ". " }
        [unnumbered-caption] Slika{ ". " }
       *[unnumbered] Slika
    }

## Paginator controls

paginator-previous = Prethodna
paginator-next = Sljedeća
paginator-page = Stranica
paginator-page-status = { $pageLabel } { $currentPage } od { $numPages }

## Piecewise functions

piecewise-condition-or = ili
piecewise-condition-if = ako
piecewise-condition-otherwise = inače

## Chemistry
##
## Bosnian is the one locale in its batch that supplies these, because it is
## the one whose schools teach chemistry in it out of textbooks that print the
## whole table. The list is close to `locales/hr`'s and not identical to it:
## «kalaj» for tin against Croatian's «kositar», «Hlor» against «Klor», and —
## in the two messages at the foot of the file — «hemijski» for «kemijski» and
## «jonski» for «ionski».

element-name =
    .h = Vodik
    .he = Helij
    .li = Litij
    .be = Berilij
    .b = Bor
    .c = Ugljik
    .n = Dušik
    .o = Kisik
    .f = Fluor
    .ne = Neon
    .na = Natrij
    .mg = Magnezij
    .al = Aluminij
    .si = Silicij
    .p = Fosfor
    .s = Sumpor
    .cl = Hlor
    .ar = Argon
    .k = Kalij
    .ca = Kalcij
    .sc = Skandij
    .ti = Titanij
    .v = Vanadij
    .cr = Hrom
    .mn = Mangan
    .fe = Željezo
    .co = Kobalt
    .ni = Nikl
    .cu = Bakar
    .zn = Cink
    .ga = Galij
    .ge = Germanij
    .as = Arsen
    .se = Selenij
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
    .sn = Kalaj
    .sb = Antimon
    .te = Telurij
    .i = Jod
    .xe = Ksenon
    .cs = Cezij
    .ba = Barij
    .la = Lantan
    .ce = Cerij
    .pr = Prazeodimij
    .nd = Neodimij
    .pm = Prometij
    .sm = Samarij
    .eu = Europij
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
    .hg = Živa
    .tl = Talij
    .pb = Olovo
    .bi = Bizmut
    .po = Polonij
    .at = Astat
    .rn = Radon
    .fr = Francij
    .ra = Radij
    .ac = Aktinij
    .th = Torij
    .pa = Protaktinij
    .u = Uranij
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
    .lr = Lorencij
    .rf = Raderfordij
    .db = Dubnij
    .sg = Siborgij
    .bh = Borij
    .hs = Hasij
    .mt = Majtnerij
    .ds = Darmštatij
    .rg = Rendgenij
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
    .cl = Hlorid
    .br = Bromid
    .i = Jodid
    .at = Astatid
    .ts = Tenesid
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Neispravan hemijski simbol
chemistry-invalid-ionic-compound = Neispravan jonski spoj
