# Breton content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The fourth Celtic catalog and the fourth time the same answer comes out: the
# adjectives follow the noun, a feminine singular noun softens what follows it,
# and no position governs a case an adjective could take. So every describing
# word selects on `$gender` and nothing selects on `$role`.
#
# Breton's soft mutation reaches further into the alphabet than Irish's or
# Welsh's — `k` `t` `p` `g` `d` `b` `m` and `gw` all move, so «du» becomes
# «zu», «melen» becomes «velen» and «gwer» becomes «wer» — and it applies to
# the *noun* after the indefinite article as well, which is why «bevenn» is
# written «ur vevenn» in the border clause below and never bare.
#
# `l`, `n`, `r`, `s` and a vowel do not move, so «ruz» and «roz» read alike in
# both branches.
#
# Among the postnominal adjectives themselves the order is size and quality
# first and colour last — «ur c'harr bras ruz», so «ul linenn dev diret ruz» —
# which is the order Irish and Gaelic take too, and which leaves `style-stroke`
# reading in the same sequence English writes. Welsh is the one of the four
# that runs the other way and puts the colour first.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] zu
           *[m] du
        }
    .white =
        { $gender ->
            [f] wenn
           *[m] gwenn
        }
    .gray =
        { $gender ->
            [f] c'hris
           *[m] gris
        }
    .red = ruz
    .orange = orañjez
    .yellow =
        { $gender ->
            [f] velen
           *[m] melen
        }
    .green =
        { $gender ->
            [f] wer
           *[m] gwer
        }
    .cyan =
        { $gender ->
            [f] c'hlaswer
           *[m] glaswer
        }
    .blue =
        { $gender ->
            [f] c'hlas
           *[m] glas
        }
    .purple = limestra
    .pink = roz
    .brown =
        { $gender ->
            [f] vrun
           *[m] brun
        }

line-width =
    .thick =
        { $gender ->
            [f] dev
           *[m] tev
        }
    .thin =
        { $gender ->
            [f] voan
           *[m] moan
        }

line-style =
    .dashed =
        { $gender ->
            [f] diret
           *[m] tiret
        }
    .dotted =
        { $gender ->
            [f] bikennaouet
           *[m] pikennaouet
        }

# Noun phrases standing behind «gant». They modify nothing and take no gender.
fill-style =
    .horizontal = linennoù a-blaen
    .vertical = linennoù a-serzh
    .diagonal = linennoù a-veskell
    .backdiagonal = linennoù a-veskell eus an tu all
    .dots = pikennoù
    .diamonds = diamantoù

noun =
    .line = linenn
    .line-segment = tamm linenn
    .ray = skin
    .vector = vektor
    .curve = krommenn
    .function = arc'hwel
    .parabola = parabolenn
    .polyline = lieslinenn
    .polygon = liestueg
    .triangle = tric'horn
    .rectangle = reizhkorn
    .circle = kelc'h
    .region = takad
    .point = poent
    .square = karrez
    .diamond = diamant
    .cross = kroaz
    .plus = plus

# The side count follows the style adjectives, so the head and the tail split
# around them.
noun-regular-polygon =
    { $part ->
        [tail] gant { $numSides } tu
       *[head] liestueg reoliek
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (liestueg, m) or
# the head of a phrase the description never names: `border` (bevenn, f),
# `fill` (leunadur, m), `text` (testenn, f), `background` (drekleur, m).
noun-gender =
    { $noun ->
        [line] f
        [curve] f
        [parabola] f
        [polyline] f
        [cross] f
        [border] f
        [text] f
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
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

# A past participle, invariable in Breton, so it needs no branch.
style-filled-word = leuniet

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } gant { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } gant { $pattern }
        [plain-tail] { $noun } { $color } { $filled } { $nounTail }
        [pattern-tail] { $noun } { $color } { $filled } { $nounTail } gant { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

# «bevenn» is feminine, so its own adjectives soften after it — and «bevenn»
# itself softens to «vevenn» after the article «ur», which is a mutation of the
# noun rather than of anything the description supplies. Breton always writes
# that article, so the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] gant ur vevenn { $border }
        [and] hag ur vevenn { $border }
        [and-article] hag ur vevenn { $border }
       *[with] gant ur vevenn { $border }
    }

style-fill =
    { $parts ->
        [pattern] leunadur { $color } gant { $pattern }
       *[plain] { $color }
    }

style-unfilled = goullo

style-text =
    { $parts ->
        [background] { $color } gant un drekleur { $background }
       *[plain] { $color }
    }

style-background-none = hini ebet


## Boolean words

boolean-true = gwir
boolean-false = faos


## Answer buttons

answer-submit-label = Gwiriañ
answer-submit-label-no-correctness = Kas ar respont


## Sectional blocks

section-name =
    .activity = Obererezh
    .aside = Notenn a-gostez
    .cascade = Lammdour
    .definition = Termenadur
    .example = Skouer
    .exercise = Poelladenn
    .exercises = Poelladennoù
    .given-answer = Respont
    .note = Notenn
    .objectives = Palioù
    .paragraphs = Rannbennadoù
    .part = Lodenn
    .problem = Kudenn
    .problems = Kudennoù
    .proof = Prouenn
    .question = Goulenn
    .section = Rann
    .solution = Diskoulm
    .task = Trevell
    .theorem = Teorem

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Kuzul


## Tables and figures

table-name =
    { $parts ->
        [numbered] Taolenn { $enumeration }
        [numbered-title] Taolenn { $enumeration }{ ": " }
        [unnumbered-title] Taolenn{ ": " }
       *[unnumbered] Taolenn
    }

figure-name =
    { $parts ->
        [numbered] Skeudenn { $enumeration }
        [numbered-caption] Skeudenn { $enumeration }{ ": " }
        [unnumbered-caption] Skeudenn{ ": " }
       *[unnumbered] Skeudenn
    }


## Paginator controls

paginator-previous = A-raok
paginator-next = War-lerc'h
paginator-page = Pajenn

paginator-page-status = { $pageLabel } { $currentPage } war { $numPages }


## Piecewise functions

piecewise-condition-or = pe
piecewise-condition-if = ma
piecewise-condition-otherwise = a-hend-all


## Chemistry

element-name =
    .h = Hidrogen
    .he = Heliom
    .li = Litiom
    .be = Beriliom
    .b = Bor
    .c = Karbon
    .n = Nitrogen
    .o = Oksigen
    .f = Fluor
    .ne = Neon
    .na = Sodiom
    .mg = Magneziom
    .al = Aluminiom
    .si = Silisiom
    .p = Fosfor
    .s = Soufr
    .cl = Klor
    .ar = Argon
    .k = Potasiom
    .ca = Kalsiom
    .sc = Skandiom
    .ti = Titan
    .v = Vanadiom
    .cr = Krom
    .mn = Mangan
    .fe = Houarn
    .co = Kobalt
    .ni = Nikel
    .cu = Kouevr
    .zn = Zink
    .ga = Galiom
    .ge = Germaniom
    .as = Arsenik
    .se = Seleniom
    .br = Brom
    .kr = Kripton
    .rb = Rubidiom
    .sr = Stronsiom
    .y = Itriom
    .zr = Zirkoniom
    .nb = Niobiom
    .mo = Molibden
    .tc = Teknesiom
    .ru = Rutheniom
    .rh = Rodiom
    .pd = Paladiom
    .ag = Arc'hant
    .cd = Kadmiom
    .in = Indiom
    .sn = Staen
    .sb = Antimon
    .te = Telluriom
    .i = Iod
    .xe = Xenon
    .cs = Sesiom
    .ba = Bariom
    .la = Lantan
    .ce = Seriom
    .pr = Praseodimiom
    .nd = Neodimiom
    .pm = Prometiom
    .sm = Samariom
    .eu = Europiom
    .gd = Gadoliniom
    .tb = Terbiom
    .dy = Disprosiom
    .ho = Holmiom
    .er = Erbiom
    .tm = Tuliom
    .yb = Iterbiom
    .lu = Lutesiom
    .hf = Hafniom
    .ta = Tantal
    .w = Tungsten
    .re = Reniom
    .os = Osmiom
    .ir = Iridiom
    .pt = Platin
    .au = Aour
    .hg = Merkur
    .tl = Taliom
    .pb = Plom
    .bi = Bismut
    .po = Poloniom
    .at = Astat
    .rn = Radon
    .fr = Fransiom
    .ra = Radiom
    .ac = Aktiniom
    .th = Toriom
    .pa = Protaktiniom
    .u = Uraniom
    .np = Neptuniom
    .pu = Plutoniom
    .am = Amerisiom
    .cm = Kuriom
    .bk = Berkeliom
    .cf = Kaliforniom
    .es = Einsteiniom
    .fm = Fermiom
    .md = Mendeleviom
    .no = Nobeliom
    .lr = Lawrensiom
    .rf = Rutherfordiom
    .db = Dubniom
    .sg = Seaborgiom
    .bh = Bohriom
    .hs = Hassiom
    .mt = Meitneriom
    .ds = Darmstadtiom
    .rg = Roentgeniom
    .cn = Koperniziom
    .nh = Nihoniom
    .fl = Fleroviom
    .mc = Moskoviom
    .lv = Livermoriom
    .ts = Tenesin
    .og = Oganeson

element-anion-name =
    .h = Hidrur
    .c = Karbur
    .n = Nitrur
    .o = Oksid
    .f = Fluorur
    .p = Fosfur
    .s = Sulfur
    .cl = Klorur
    .br = Bromur
    .i = Iodur
    .at = Astatur
    .ts = Tenesur

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Arouez kimiek direizh
chemistry-invalid-ionic-compound = Kevreadenn ionek direizh
