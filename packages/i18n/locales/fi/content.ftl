# Finnish content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Finnish has no grammatical gender, so `$gender` goes unused. `$role` does
# not: unlike Hungarian and Turkish, a Finnish attributive adjective agrees
# with its noun in **case**, so the adjective changes shape with the position
# the phrase goes into.
#
#   standalone          nominative: «musta»
#   border-clause       adessive, agreeing with «reuna»: «mustalla»
#   background-clause   adessive, agreeing with «tausta»: «mustalla»
#   text-clause         nominative, agreeing with «teksti»: «musta»
#
# Two pairs coincide, and that is a fact about which cases these four positions
# happen to govern rather than about Finnish. Consonant gradation runs through
# the adessive forms — «violetti» → «violetilla», «ohut» → «ohuella» — so they
# are not the nominative plus an ending.
#
# **A compound cannot be welded to a placeable.** Finnish would name a fill
# pattern as one word, «vinoneliökuviolla», and the catalog has only the
# argument. So the pattern is named in a relative clause instead — «jossa on
# vinoneliöitä» — whose verb governs the partitive plural, which is the form
# `fill-style` therefore supplies.
#
# An ending *after* a placeable is fine when its shape does not depend on what
# lands in front of it: «{ $numSides }-kulmio» is written that way and is
# correct for every side count. The problem is agreement, not adjacency.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] mustalla
            [background-clause] mustalla
           *[standalone] musta
        }
    .white =
        { $role ->
            [border-clause] valkoisella
            [background-clause] valkoisella
           *[standalone] valkoinen
        }
    .gray =
        { $role ->
            [border-clause] harmaalla
            [background-clause] harmaalla
           *[standalone] harmaa
        }
    .red =
        { $role ->
            [border-clause] punaisella
            [background-clause] punaisella
           *[standalone] punainen
        }
    .orange =
        { $role ->
            [border-clause] oranssilla
            [background-clause] oranssilla
           *[standalone] oranssi
        }
    .yellow =
        { $role ->
            [border-clause] keltaisella
            [background-clause] keltaisella
           *[standalone] keltainen
        }
    .green =
        { $role ->
            [border-clause] vihreällä
            [background-clause] vihreällä
           *[standalone] vihreä
        }
    .cyan =
        { $role ->
            [border-clause] syaanilla
            [background-clause] syaanilla
           *[standalone] syaani
        }
    .blue =
        { $role ->
            [border-clause] sinisellä
            [background-clause] sinisellä
           *[standalone] sininen
        }
    .purple =
        { $role ->
            [border-clause] violetilla
            [background-clause] violetilla
           *[standalone] violetti
        }
    .pink =
        { $role ->
            [border-clause] vaaleanpunaisella
            [background-clause] vaaleanpunaisella
           *[standalone] vaaleanpunainen
        }
    .brown =
        { $role ->
            [border-clause] ruskealla
            [background-clause] ruskealla
           *[standalone] ruskea
        }
line-width =
    .thick =
        { $role ->
            [border-clause] paksulla
            [background-clause] paksulla
           *[standalone] paksu
        }
    .thin =
        { $role ->
            [border-clause] ohuella
            [background-clause] ohuella
           *[standalone] ohut
        }
line-style =
    .dashed =
        { $role ->
            [border-clause] katkoviivaisella
            [background-clause] katkoviivaisella
           *[standalone] katkoviivainen
        }
    .dotted =
        { $role ->
            [border-clause] pisteviivaisella
            [background-clause] pisteviivaisella
           *[standalone] pisteviivainen
        }
# Partitive plural, which is what «jossa on» governs — see the note at the top
# of this file.
fill-style =
    .horizontal = vaakaviivoja
    .vertical = pystyviivoja
    .diagonal = vinoviivoja
    .backdiagonal = vastakkaisia vinoviivoja
    .dots = pisteitä
    .diamonds = vinoneliöitä
noun =
    .line = suora
    .line-segment = jana
    .ray = puolisuora
    .vector = vektori
    .curve = käyrä
    .function = funktio
    .parabola = paraabeli
    .polyline = murtoviiva
    .polygon = monikulmio
    .triangle = kolmio
    .rectangle = suorakulmio
    .circle = ympyrä
    .region = alue
    .point = piste
    .square = neliö
    .diamond = vinoneliö
    .cross = risti
    .plus = plus
# «5-kulmio» — Finnish writes a numeral-headed compound with a hyphen, and the
# word after it is the same whatever the numeral, so the whole phrase is a head
# and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] säännöllinen { $numSides }-kulmio
    }
# Finnish has no grammatical gender, so this answer goes unused. It is here
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
style-filled-word = täytetty
style-filled =
    { $parts ->
        [pattern] { $filled } { $color }, jossa on { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun }, jossa on { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail }, jossa on { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «reuna» takes the adessive, which the `border-clause` branch of every
# adjective agrees with. Finnish has no article, so the `-article` branches
# read the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } reunalla
        [and] ja { $border } reunalla
        [and-article] ja { $border } reunalla
       *[with] { $border } reunalla
    }
style-fill =
    { $parts ->
        [pattern] { $color } täyttö, jossa on { $pattern }
       *[plain] { $color }
    }
style-unfilled = täyttämätön
# «tausta» takes the adessive too, so the colour in front of it agrees with it
# the same way the border's does.
style-text =
    { $parts ->
        [background] { $color } { $background } taustalla
       *[plain] { $color }
    }
style-background-none = ei mitään

## Boolean words

boolean-true = tosi
boolean-false = epätosi

## Answer buttons

answer-submit-label = Tarkista
answer-submit-label-no-correctness = Lähetä vastaus

## Sectional blocks

section-name =
    .activity = Aktiviteetti
    .aside = Sivuhuomautus
    .cascade = Kaskadi
    .definition = Määritelmä
    .example = Esimerkki
    .exercise = Harjoitus
    .exercises = Harjoitukset
    .given-answer = Vastaus
    .note = Huomautus
    .objectives = Tavoitteet
    .paragraphs = Kappaleet
    .part = Osa
    .problem = Tehtävä
    .problems = Tehtävät
    .proof = Todistus
    .question = Kysymys
    .section = Luku
    .solution = Ratkaisu
    .task = Tehtävänanto
    .theorem = Lause
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Vihje

## Tables and figures

table-name =
    { $parts ->
        [numbered] Taulukko { $enumeration }
        [numbered-title] Taulukko { $enumeration }{ ": " }
        [unnumbered-title] Taulukko{ ": " }
       *[unnumbered] Taulukko
    }
figure-name =
    { $parts ->
        [numbered] Kuva { $enumeration }
        [numbered-caption] Kuva { $enumeration }{ ": " }
        [unnumbered-caption] Kuva{ ": " }
       *[unnumbered] Kuva
    }

## Paginator controls

paginator-previous = Edellinen
paginator-next = Seuraava
paginator-page = Sivu
# A slash rather than «-sta/-stä»: the elative harmonizes with how the numeral
# is read, which the catalog cannot see.
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = tai
piecewise-condition-if = jos
piecewise-condition-otherwise = muutoin

## Chemistry

element-name =
    .h = Vety
    .he = Helium
    .li = Litium
    .be = Beryllium
    .b = Boori
    .c = Hiili
    .n = Typpi
    .o = Happi
    .f = Fluori
    .ne = Neon
    .na = Natrium
    .mg = Magnesium
    .al = Alumiini
    .si = Pii
    .p = Fosfori
    .s = Rikki
    .cl = Kloori
    .ar = Argon
    .k = Kalium
    .ca = Kalsium
    .sc = Skandium
    .ti = Titaani
    .v = Vanadiini
    .cr = Kromi
    .mn = Mangaani
    .fe = Rauta
    .co = Koboltti
    .ni = Nikkeli
    .cu = Kupari
    .zn = Sinkki
    .ga = Gallium
    .ge = Germanium
    .as = Arseeni
    .se = Seleeni
    .br = Bromi
    .kr = Krypton
    .rb = Rubidium
    .sr = Strontium
    .y = Yttrium
    .zr = Zirkonium
    .nb = Niobi
    .mo = Molybdeeni
    .tc = Teknetium
    .ru = Rutenium
    .rh = Rodium
    .pd = Palladium
    .ag = Hopea
    .cd = Kadmium
    .in = Indium
    .sn = Tina
    .sb = Antimoni
    .te = Telluuri
    .i = Jodi
    .xe = Ksenon
    .cs = Cesium
    .ba = Barium
    .la = Lantaani
    .ce = Cerium
    .pr = Praseodyymi
    .nd = Neodyymi
    .pm = Prometium
    .sm = Samarium
    .eu = Europium
    .gd = Gadolinium
    .tb = Terbium
    .dy = Dysprosium
    .ho = Holmium
    .er = Erbium
    .tm = Tulium
    .yb = Ytterbium
    .lu = Lutetium
    .hf = Hafnium
    .ta = Tantaali
    .w = Volframi
    .re = Renium
    .os = Osmium
    .ir = Iridium
    .pt = Platina
    .au = Kulta
    .hg = Elohopea
    .tl = Tallium
    .pb = Lyijy
    .bi = Vismutti
    .po = Polonium
    .at = Astatiini
    .rn = Radon
    .fr = Frankium
    .ra = Radium
    .ac = Aktinium
    .th = Torium
    .pa = Protaktinium
    .u = Uraani
    .np = Neptunium
    .pu = Plutonium
    .am = Amerikium
    .cm = Curium
    .bk = Berkelium
    .cf = Kalifornium
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
    .cn = Kopernikium
    .nh = Nihonium
    .fl = Flerovium
    .mc = Moskovium
    .lv = Livermorium
    .ts = Tennessiini
    .og = Oganesson
element-anion-name =
    .h = Hydridi
    .c = Karbidi
    .n = Nitridi
    .o = Oksidi
    .f = Fluoridi
    .p = Fosfidi
    .s = Sulfidi
    .cl = Kloridi
    .br = Bromidi
    .i = Jodidi
    .at = Astatidi
    .ts = Tennessidi
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Virheellinen kemiallinen merkki
chemistry-invalid-ionic-compound = Virheellinen ioniyhdiste
