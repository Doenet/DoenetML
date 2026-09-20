# Czech content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Czech inflects for gender *and* for case, so every adjective below selects on
# `$role` first — which position the words are going into — and then on
# `$gender` where the answer still depends on one:
#
#   standalone          nominative, agreeing with the noun described:
#                       `-ý` m, `-á` f, `-é` n
#   border-clause       instrumental after «s», of «okraj» — masculine: `-ým`
#   background-clause   locative after «na», of «pozadí» — neuter: `-ém`
#   text-clause         nominative masculine, agreeing with «text»
#
# The last three need no gender branch: each is used of exactly one noun, and
# that noun's gender is fixed.
#
# A preposition whose form depends on the word after it cannot be written
# beside a placeable. Czech vocalizes «v» to «ve» and «s» to «se» before
# certain consonant clusters, and the catalog cannot see which word the
# argument will turn out to be — so the words that land after them are chosen
# not to trigger it. That is why the pattern for horizontal lines is
# «horizontální čáry» and not «vodorovné čáry»: «v vodorovné» would want «ve».
#
# Adjectives precede their noun, as in English, so the composition messages
# keep the English order.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] černým
            [background-clause] černém
            [text-clause] černý
           *[standalone]
                { $gender ->
                    [f] černá
                    [n] černé
                   *[m] černý
                }
        }
    .white =
        { $role ->
            [border-clause] bílým
            [background-clause] bílém
            [text-clause] bílý
           *[standalone]
                { $gender ->
                    [f] bílá
                    [n] bílé
                   *[m] bílý
                }
        }
    .gray =
        { $role ->
            [border-clause] šedým
            [background-clause] šedém
            [text-clause] šedý
           *[standalone]
                { $gender ->
                    [f] šedá
                    [n] šedé
                   *[m] šedý
                }
        }
    .red =
        { $role ->
            [border-clause] červeným
            [background-clause] červeném
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
            [background-clause] oranžovém
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
            [border-clause] žlutým
            [background-clause] žlutém
            [text-clause] žlutý
           *[standalone]
                { $gender ->
                    [f] žlutá
                    [n] žluté
                   *[m] žlutý
                }
        }
    .green =
        { $role ->
            [border-clause] zeleným
            [background-clause] zeleném
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
            [border-clause] azurovým
            [background-clause] azurovém
            [text-clause] azurový
           *[standalone]
                { $gender ->
                    [f] azurová
                    [n] azurové
                   *[m] azurový
                }
        }
    .blue =
        { $role ->
            [border-clause] modrým
            [background-clause] modrém
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
            [background-clause] fialovém
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
            [border-clause] růžovým
            [background-clause] růžovém
            [text-clause] růžový
           *[standalone]
                { $gender ->
                    [f] růžová
                    [n] růžové
                   *[m] růžový
                }
        }
    .brown =
        { $role ->
            [border-clause] hnědým
            [background-clause] hnědém
            [text-clause] hnědý
           *[standalone]
                { $gender ->
                    [f] hnědá
                    [n] hnědé
                   *[m] hnědý
                }
        }
line-width =
    .thick =
        { $role ->
            [border-clause] tlustým
            [background-clause] tlustém
            [text-clause] tlustý
           *[standalone]
                { $gender ->
                    [f] tlustá
                    [n] tlusté
                   *[m] tlustý
                }
        }
    .thin =
        { $role ->
            [border-clause] tenkým
            [background-clause] tenkém
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
            [border-clause] čárkovaným
            [background-clause] čárkovaném
            [text-clause] čárkovaný
           *[standalone]
                { $gender ->
                    [f] čárkovaná
                    [n] čárkované
                   *[m] čárkovaný
                }
        }
    .dotted =
        { $role ->
            [border-clause] tečkovaným
            [background-clause] tečkovaném
            [text-clause] tečkovaný
           *[standalone]
                { $gender ->
                    [f] tečkovaná
                    [n] tečkované
                   *[m] tečkovaný
                }
        }
# Noun phrases in the accusative plural, which is the case «v» takes when it
# names a pattern — «v kostky», «v puntíky», the way Czech describes patterned
# cloth. The accusative plural of an inanimate noun is spelled like the
# nominative, so the same words serve `style-fill`, where they stand alone.
fill-style =
    .horizontal = horizontální čáry
    .vertical = svislé čáry
    .diagonal = šikmé čáry
    .backdiagonal = opačně šikmé čáry
    .dots = tečky
    .diamonds = kosočtverce
noun =
    .line = přímka
    .line-segment = úsečka
    .ray = polopřímka
    .vector = vektor
    .curve = křivka
    .function = funkce
    .parabola = parabola
    .polyline = lomená čára
    .polygon = mnohoúhelník
    .triangle = trojúhelník
    .rectangle = obdélník
    .circle = kružnice
    .region = oblast
    .point = bod
    .square = čtverec
    .diamond = kosočtverec
    .cross = křížek
    .plus = plus
# Czech counts the sides after the noun, so the count closes the phrase behind
# the adjectives: «tlustý červený pravidelný mnohoúhelník o 5 stranách». «o»
# and the locative rather than «s» and the instrumental, so the phrase does not
# collide with the border clause, which is already «s».
noun-regular-polygon =
    { $part ->
        [tail] o { $numSides } stranách
       *[head] pravidelný mnohoúhelník
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (mnohoúhelník, m)
# or the head of a phrase the description never names: `border` (okraj, m),
# `fill` (výplň, f), `text` (text, m), `background` (pozadí, n).
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
        [f] vyplněná
        [n] vyplněné
       *[m] vyplněný
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
# adjective supplies. Czech has no article, so the `-article` branches read the
# same as the ones without.
#
# The `and-` branches keep an «s» of their own: the pattern clause before them
# is «v» and the accusative, and that preposition cannot reach the instrumental
# behind it.
style-border-clause =
    { $parts ->
        [with-article] s { $border } okrajem
        [and] a s { $border } okrajem
        [and-article] a s { $border } okrajem
       *[with] s { $border } okrajem
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = nevyplněný
# «na» governs the locative, which is what the `background-clause` branch of
# every adjective supplies — «na černém pozadí».
style-text =
    { $parts ->
        [background] { $color } na { $background } pozadí
       *[plain] { $color }
    }
style-background-none = žádné

## Boolean words

boolean-true = pravda
boolean-false = nepravda

## Answer buttons

answer-submit-label = Zkontrolovat
answer-submit-label-no-correctness = Odeslat odpověď

## Sectional blocks

section-name =
    .activity = Aktivita
    .aside = Poznámka na okraj
    .cascade = Kaskáda
    .definition = Definice
    .example = Příklad
    .exercise = Cvičení
    .exercises = Cvičení
    .given-answer = Odpověď
    .note = Poznámka
    .objectives = Cíle
    .paragraphs = Odstavce
    .part = Část
    .problem = Úloha
    .problems = Úlohy
    .proof = Důkaz
    .question = Otázka
    .section = Kapitola
    .solution = Řešení
    .task = Úkol
    .theorem = Věta
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Nápověda

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabulka { $enumeration }
        [numbered-title] Tabulka { $enumeration }{ ": " }
        [unnumbered-title] Tabulka{ ": " }
       *[unnumbered] Tabulka
    }
figure-name =
    { $parts ->
        [numbered] Obrázek { $enumeration }
        [numbered-caption] Obrázek { $enumeration }{ ": " }
        [unnumbered-caption] Obrázek{ ": " }
       *[unnumbered] Obrázek
    }

## Paginator controls

paginator-previous = Předchozí
paginator-next = Další
paginator-page = Stránka
paginator-page-status = { $pageLabel } { $currentPage } z { $numPages }

## Piecewise functions

piecewise-condition-or = nebo
piecewise-condition-if = pokud
piecewise-condition-otherwise = jinak

## Chemistry

element-name =
    .h = Vodík
    .he = Helium
    .li = Lithium
    .be = Beryllium
    .b = Bor
    .c = Uhlík
    .n = Dusík
    .o = Kyslík
    .f = Fluor
    .ne = Neon
    .na = Sodík
    .mg = Hořčík
    .al = Hliník
    .si = Křemík
    .p = Fosfor
    .s = Síra
    .cl = Chlor
    .ar = Argon
    .k = Draslík
    .ca = Vápník
    .sc = Skandium
    .ti = Titan
    .v = Vanad
    .cr = Chrom
    .mn = Mangan
    .fe = Železo
    .co = Kobalt
    .ni = Nikl
    .cu = Měď
    .zn = Zinek
    .ga = Gallium
    .ge = Germanium
    .as = Arsen
    .se = Selen
    .br = Brom
    .kr = Krypton
    .rb = Rubidium
    .sr = Stroncium
    .y = Yttrium
    .zr = Zirkonium
    .nb = Niob
    .mo = Molybden
    .tc = Technecium
    .ru = Ruthenium
    .rh = Rhodium
    .pd = Palladium
    .ag = Stříbro
    .cd = Kadmium
    .in = Indium
    .sn = Cín
    .sb = Antimon
    .te = Tellur
    .i = Jod
    .xe = Xenon
    .cs = Cesium
    .ba = Baryum
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
    .lu = Lutecium
    .hf = Hafnium
    .ta = Tantal
    .w = Wolfram
    .re = Rhenium
    .os = Osmium
    .ir = Iridium
    .pt = Platina
    .au = Zlato
    .hg = Rtuť
    .tl = Thallium
    .pb = Olovo
    .bi = Bismut
    .po = Polonium
    .at = Astat
    .rn = Radon
    .fr = Francium
    .ra = Radium
    .ac = Aktinium
    .th = Thorium
    .pa = Protaktinium
    .u = Uran
    .np = Neptunium
    .pu = Plutonium
    .am = Americium
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
    .cn = Kopernicium
    .nh = Nihonium
    .fl = Flerovium
    .mc = Moscovium
    .lv = Livermorium
    .ts = Tennessin
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
chemistry-invalid-ionic-compound = Neplatná iontová sloučenina
