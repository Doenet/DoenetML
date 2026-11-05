# Romanian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Two things reshape this catalog, and neither is about vocabulary.
#
# **Adjectives follow their noun.** So every composition message reorders:
# «dreaptă roșie groasă», not «groasă roșie dreaptă». `style-with-noun` and
# `style-filled-with-noun` put `{ $noun }` first, and `style-fill` puts the
# pattern before the colour that describes it.
#
# **The definite article is a suffix.** «secțiune» → «secțiunea», «tabel» →
# «tabelul». A suffix cannot be attached to a placeable, and
# `section-title-prefix` receives the block's name as `{ $sectionName }` — so
# the article has to be inside `section-name` itself or nowhere. It is inside:
# every entry there is written definite, because the numbered heading
# («Exemplul 2», «Secțiunea 1.3») is the common case and a bare «Exemplul»
# still reads as a heading. The same reasoning puts the article on «Tabelul»
# and «Figura», where the noun is a literal and there was never a choice.
#
# `$role` needs only one distinction. All three clause positions describe a
# neuter singular noun — «chenar», «fundal», «text» — which in Romanian agrees
# like a masculine, so the three coincide in one form and only `standalone`
# selects on `$gender`. A neuter noun is masculine in the singular throughout,
# which is why `noun-gender` never answers `n`.
#
# «gri», «verde», «roz», «maro» and «subțire» do not inflect for gender and are
# written once.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] negru
            [background-clause] negru
            [text-clause] negru
           *[standalone]
                { $gender ->
                    [f] neagră
                   *[m] negru
                }
        }
    .white =
        { $role ->
            [border-clause] alb
            [background-clause] alb
            [text-clause] alb
           *[standalone]
                { $gender ->
                    [f] albă
                   *[m] alb
                }
        }
    .gray = gri
    .red =
        { $role ->
            [border-clause] roșu
            [background-clause] roșu
            [text-clause] roșu
           *[standalone]
                { $gender ->
                    [f] roșie
                   *[m] roșu
                }
        }
    .orange =
        { $role ->
            [border-clause] portocaliu
            [background-clause] portocaliu
            [text-clause] portocaliu
           *[standalone]
                { $gender ->
                    [f] portocalie
                   *[m] portocaliu
                }
        }
    .yellow =
        { $role ->
            [border-clause] galben
            [background-clause] galben
            [text-clause] galben
           *[standalone]
                { $gender ->
                    [f] galbenă
                   *[m] galben
                }
        }
    .green = verde
    .cyan =
        { $role ->
            [border-clause] azuriu
            [background-clause] azuriu
            [text-clause] azuriu
           *[standalone]
                { $gender ->
                    [f] azurie
                   *[m] azuriu
                }
        }
    .blue =
        { $role ->
            [border-clause] albastru
            [background-clause] albastru
            [text-clause] albastru
           *[standalone]
                { $gender ->
                    [f] albastră
                   *[m] albastru
                }
        }
    .purple =
        { $role ->
            [border-clause] violet
            [background-clause] violet
            [text-clause] violet
           *[standalone]
                { $gender ->
                    [f] violetă
                   *[m] violet
                }
        }
    .pink = roz
    .brown = maro
line-width =
    .thick =
        { $role ->
            [border-clause] gros
            [background-clause] gros
            [text-clause] gros
           *[standalone]
                { $gender ->
                    [f] groasă
                   *[m] gros
                }
        }
    .thin = subțire
line-style =
    .dashed =
        { $role ->
            [border-clause] întrerupt
            [background-clause] întrerupt
            [text-clause] întrerupt
           *[standalone]
                { $gender ->
                    [f] întreruptă
                   *[m] întrerupt
                }
        }
    .dotted =
        { $role ->
            [border-clause] punctat
            [background-clause] punctat
            [text-clause] punctat
           *[standalone]
                { $gender ->
                    [f] punctată
                   *[m] punctat
                }
        }
fill-style =
    .horizontal = linii orizontale
    .vertical = linii verticale
    .diagonal = linii diagonale
    .backdiagonal = linii diagonale inverse
    .dots = puncte
    .diamonds = romburi
noun =
    .line = dreaptă
    .line-segment = segment
    .ray = semidreaptă
    .vector = vector
    .curve = curbă
    .function = funcție
    .parabola = parabolă
    .polyline = linie frântă
    .polygon = poligon
    .triangle = triunghi
    .rectangle = dreptunghi
    .circle = cerc
    .region = regiune
    .point = punct
    .square = pătrat
    .diamond = romb
    .cross = cruce
    .plus = plus
# The side count is a counted noun, so it takes «de» above nineteen — «cu 20 de
# laturi» against «cu 19 laturi». `$numSides` is a real number, so the catalog
# can select on it and get that right without the code knowing the rule.
noun-regular-polygon =
    { $part ->
        [tail]
            { $numSides ->
                [one] cu { $numSides } latură
                [few] cu { $numSides } laturi
               *[other] cu { $numSides } de laturi
            }
       *[head] poligon regulat
    }
# A neuter noun agrees like a masculine in the singular, and every description
# here is singular, so `n` is never answered. `$noun` can also be
# `regular-polygon` (poligon, n) or a head the description never names:
# `border` (chenar, n), `fill` (umplere, f), `text` (text, n), `background`
# (fundal, n).
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [region] f
        [cross] f
        [fill] f
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
# The noun comes first and the adjectives follow it, which is the whole of
# Romanian's reordering.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
# Only ever said of the shape itself, so it is standalone in every description
# and takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] umplută
       *[m] umplut
    }
style-filled =
    { $parts ->
        [pattern] { $color } { $filled } cu { $pattern }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } cu { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } cu { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }
# «un» is a word of its own and stands before the noun, so unlike the definite
# article it can be written here — and the distinction English draws between
# the `-article` branches and the others survives into Romanian.
style-border-clause =
    { $parts ->
        [with-article] cu un chenar { $border }
        [and] și chenar { $border }
        [and-article] și un chenar { $border }
       *[with] cu chenar { $border }
    }
# The pattern is the noun and the colour describes it, so the colour follows.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = neumplut
style-text =
    { $parts ->
        [background] { $color } pe fundal { $background }
       *[plain] { $color }
    }
style-background-none = niciunul

## Boolean words

boolean-true = adevărat
boolean-false = fals

## Answer buttons

answer-submit-label = Verifică
answer-submit-label-no-correctness = Trimite răspunsul

## Sectional blocks
##
## Written definite — «Exemplul», not «Exemplu» — because the enclitic article
## cannot be added by `section-title-prefix`, which receives the name as an
## argument. See the note at the top of this file.

section-name =
    .activity = Activitatea
    .aside = Digresiunea
    .cascade = Cascada
    .definition = Definiția
    .example = Exemplul
    .exercise = Exercițiul
    .exercises = Exercițiile
    .given-answer = Răspunsul
    .note = Nota
    .objectives = Obiectivele
    .paragraphs = Paragrafele
    .part = Partea
    .problem = Problema
    .problems = Problemele
    .proof = Demonstrația
    .question = Întrebarea
    .section = Secțiunea
    .solution = Soluția
    .task = Sarcina
    .theorem = Teorema
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Indiciu

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabelul { $enumeration }
        [numbered-title] Tabelul { $enumeration }{ ": " }
        [unnumbered-title] Tabelul{ ": " }
       *[unnumbered] Tabelul
    }
figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ": " }
        [unnumbered-caption] Figura{ ": " }
       *[unnumbered] Figura
    }

## Paginator controls

paginator-previous = Anterioară
paginator-next = Următoare
paginator-page = Pagina
paginator-page-status = { $pageLabel } { $currentPage } din { $numPages }

## Piecewise functions

piecewise-condition-or = sau
piecewise-condition-if = dacă
piecewise-condition-otherwise = altfel

## Chemistry

element-name =
    .h = Hidrogen
    .he = Heliu
    .li = Litiu
    .be = Beriliu
    .b = Bor
    .c = Carbon
    .n = Azot
    .o = Oxigen
    .f = Fluor
    .ne = Neon
    .na = Sodiu
    .mg = Magneziu
    .al = Aluminiu
    .si = Siliciu
    .p = Fosfor
    .s = Sulf
    .cl = Clor
    .ar = Argon
    .k = Potasiu
    .ca = Calciu
    .sc = Scandiu
    .ti = Titan
    .v = Vanadiu
    .cr = Crom
    .mn = Mangan
    .fe = Fier
    .co = Cobalt
    .ni = Nichel
    .cu = Cupru
    .zn = Zinc
    .ga = Galiu
    .ge = Germaniu
    .as = Arsen
    .se = Seleniu
    .br = Brom
    .kr = Cripton
    .rb = Rubidiu
    .sr = Stronțiu
    .y = Ytriu
    .zr = Zirconiu
    .nb = Niobiu
    .mo = Molibden
    .tc = Tehnețiu
    .ru = Ruteniu
    .rh = Rodiu
    .pd = Paladiu
    .ag = Argint
    .cd = Cadmiu
    .in = Indiu
    .sn = Staniu
    .sb = Stibiu
    .te = Telur
    .i = Iod
    .xe = Xenon
    .cs = Cesiu
    .ba = Bariu
    .la = Lantan
    .ce = Ceriu
    .pr = Praseodim
    .nd = Neodim
    .pm = Promețiu
    .sm = Samariu
    .eu = Europiu
    .gd = Gadoliniu
    .tb = Terbiu
    .dy = Disprosiu
    .ho = Holmiu
    .er = Erbiu
    .tm = Tuliu
    .yb = Yterbiu
    .lu = Lutețiu
    .hf = Hafniu
    .ta = Tantal
    .w = Wolfram
    .re = Reniu
    .os = Osmiu
    .ir = Iridiu
    .pt = Platină
    .au = Aur
    .hg = Mercur
    .tl = Taliu
    .pb = Plumb
    .bi = Bismut
    .po = Poloniu
    .at = Astatiniu
    .rn = Radon
    .fr = Franciu
    .ra = Radiu
    .ac = Actiniu
    .th = Toriu
    .pa = Protactiniu
    .u = Uraniu
    .np = Neptuniu
    .pu = Plutoniu
    .am = Americiu
    .cm = Curiu
    .bk = Berkeliu
    .cf = Californiu
    .es = Einsteiniu
    .fm = Fermiu
    .md = Mendeleviu
    .no = Nobeliu
    .lr = Lawrenciu
    .rf = Rutherfordiu
    .db = Dubniu
    .sg = Seaborgiu
    .bh = Bohriu
    .hs = Hassiu
    .mt = Meitneriu
    .ds = Darmstadtiu
    .rg = Roentgeniu
    .cn = Coperniciu
    .nh = Nihoniu
    .fl = Fleroviu
    .mc = Moscoviu
    .lv = Livermoriu
    .ts = Tenesiu
    .og = Oganesson
element-anion-name =
    .h = Hidrură
    .c = Carbură
    .n = Nitrură
    .o = Oxid
    .f = Fluorură
    .p = Fosfură
    .s = Sulfură
    .cl = Clorură
    .br = Bromură
    .i = Iodură
    .at = Astatură
    .ts = Tenesură
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbol chimic nevalid
chemistry-invalid-ionic-compound = Compus ionic nevalid
