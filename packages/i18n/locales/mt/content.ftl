# Maltese content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Maltese is the one Semitic language this repository writes in the Latin
# alphabet, and it behaves here like its Romance neighbours: two genders, no
# case, adjectives after the noun. So every describing word that inflects
# selects on `$gender` — the borrowed colours «blu», «vjola», «roża»,
# «kannella», «oranġjo» and «ċjan» do not inflect and are written once —
# nothing selects on `$role`, and the composition messages are reordered from
# the English with the noun leading.
#
# What is Semitic about the agreement is the *shape* of it. A Maltese adjective
# does not take a suffix for the feminine, it changes its vowels: «iswed»
# becomes «sewda», «aħmar» becomes «ħamra», «oħxon» becomes «ħoxna». The two
# branches below are therefore two spellings of one root rather than a stem and
# an ending, which is why neither can be derived from the other.
#
# The definite article `il-` assimilates to a following sun letter — `id-`,
# `is-`, `ir-` and the rest. No style description writes it: such a description
# is indefinite, and Maltese has no indefinite article, so the two `-article`
# branches read like the two without. Where the article does appear elsewhere in
# this file it sits in front of a word written here, never in front of an
# argument.
#
# `bi` keeps its vowel before a word beginning with the same letter or with a
# consonant cluster and elides to `b'` elsewhere, which is why the border clause
# reads «bi bordura» while the fill patterns give «b'linji», «b'tikek» and
# «b'rombi» — every word that can land behind it is one this catalog chose. The
# side count of a regular polygon is a value this catalog does not choose, so
# it is introduced by «ta'», which never changes shape.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] sewda
           *[m] iswed
        }
    .white =
        { $gender ->
            [f] bajda
           *[m] abjad
        }
    .gray =
        { $gender ->
            [f] griża
           *[m] griż
        }
    .red =
        { $gender ->
            [f] ħamra
           *[m] aħmar
        }
    .orange = oranġjo
    .yellow =
        { $gender ->
            [f] safra
           *[m] isfar
        }
    .green =
        { $gender ->
            [f] ħadra
           *[m] aħdar
        }
    .cyan = ċjan
    .blue = blu
    .purple = vjola
    .pink = roża
    .brown = kannella

line-width =
    .thick =
        { $gender ->
            [f] ħoxna
           *[m] oħxon
        }
    .thin =
        { $gender ->
            [f] rqiqa
           *[m] irqiq
        }

line-style =
    .dashed =
        { $gender ->
            [f] maqtugħa
           *[m] maqtugħ
        }
    .dotted =
        { $gender ->
            [f] ittikkjata
           *[m] ittikkjat
        }

# Noun phrases standing behind «b'». They modify nothing and take no gender.
fill-style =
    .horizontal = linji orizzontali
    .vertical = linji vertikali
    .diagonal = linji djagonali
    .backdiagonal = linji djagonali maqluba
    .dots = tikek
    .diamonds = rombi

noun =
    .line = linja
    .line-segment = segment
    .ray = raġġ
    .vector = vettur
    .curve = kurva
    .function = funzjoni
    .parabola = parabola
    .polyline = polilinja
    .polygon = poligonu
    .triangle = trijangolu
    .rectangle = rettangolu
    .circle = ċirku
    .region = reġjun
    .point = punt
    .square = kwadrat
    .diamond = rombu
    .cross = salib
    .plus = plus

# The side count follows the style adjectives so that they stay beside the noun
# they agree with.
noun-regular-polygon =
    { $part ->
        [tail] ta' { $numSides } naħat
       *[head] poligonu regolari
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (poligonu, m) or
# the head of a phrase the description never names: `border` (bordura, f),
# `fill` (mili, m), `text` (test, m), `background` (sfond, m).
noun-gender =
    { $noun ->
        [line] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [border] f
       *[other] m
    }


## Style composition

# Quality before colour, which is the ordinary Maltese order: a thick dashed
# red line is «linja ħoxna maqtugħa ħamra».
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

style-filled-word =
    { $gender ->
        [f] mimlija
       *[m] mimli
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } b'{ $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } b'{ $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } b'{ $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «bordura» is feminine, so the border's adjectives agree with it and not with
# the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] bi bordura { $border }
        [and] u bordura { $border }
        [and-article] u bordura { $border }
       *[with] bi bordura { $border }
    }

style-fill =
    { $parts ->
        [pattern] mili { $color } b'{ $pattern }
       *[plain] { $color }
    }

style-unfilled = mhux mimli

style-text =
    { $parts ->
        [background] { $color } fuq sfond { $background }
       *[plain] { $color }
    }

style-background-none = xejn


## Boolean words

boolean-true = veru
boolean-false = falz


## Answer buttons

answer-submit-label = Iċċekkja
answer-submit-label-no-correctness = Ibgħat it-tweġiba


## Sectional blocks

section-name =
    .activity = Attività
    .aside = Nota fil-ġenb
    .cascade = Kaskata
    .definition = Definizzjoni
    .example = Eżempju
    .exercise = Eżerċizzju
    .exercises = Eżerċizzji
    .given-answer = Tweġiba
    .note = Nota
    .objectives = Objettivi
    .paragraphs = Paragrafi
    .part = Parti
    .problem = Problema
    .problems = Problemi
    .proof = Prova
    .question = Mistoqsija
    .section = Taqsima
    .solution = Soluzzjoni
    .task = Kompitu
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

hint-title = Ħjiel


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabella { $enumeration }
        [numbered-title] Tabella { $enumeration }{ ": " }
        [unnumbered-title] Tabella{ ": " }
       *[unnumbered] Tabella
    }

figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ": " }
        [unnumbered-caption] Figura{ ": " }
       *[unnumbered] Figura
    }


## Paginator controls

paginator-previous = Ta' qabel
paginator-next = Li jmiss
paginator-page = Paġna

paginator-page-status = { $pageLabel } { $currentPage } minn { $numPages }


## Piecewise functions

piecewise-condition-or = jew
piecewise-condition-if = jekk
piecewise-condition-otherwise = inkella


## Chemistry

element-name =
    .h = Idroġenu
    .he = Elju
    .li = Litju
    .be = Berillju
    .b = Boron
    .c = Karbonju
    .n = Nitroġenu
    .o = Ossiġenu
    .f = Fluworu
    .ne = Neon
    .na = Sodju
    .mg = Manjeżju
    .al = Aluminju
    .si = Silikon
    .p = Fosforu
    .s = Kubrit
    .cl = Kloru
    .ar = Argon
    .k = Potassju
    .ca = Kalċju
    .sc = Skandju
    .ti = Titanju
    .v = Vanadju
    .cr = Kromju
    .mn = Manganiż
    .fe = Ħadid
    .co = Kobalt
    .ni = Nikel
    .cu = Ram
    .zn = Żingu
    .ga = Gallju
    .ge = Ġermanju
    .as = Arseniku
    .se = Selenju
    .br = Bromu
    .kr = Kripton
    .rb = Rubidju
    .sr = Stronzju
    .y = Ittriju
    .zr = Żirkonju
    .nb = Nijobju
    .mo = Molibdenu
    .tc = Teknezju
    .ru = Rutenju
    .rh = Rodju
    .pd = Palladju
    .ag = Fidda
    .cd = Kadmju
    .in = Indju
    .sn = Landa
    .sb = Antimonju
    .te = Tellurju
    .i = Jodju
    .xe = Ksenon
    .cs = Ċesju
    .ba = Barju
    .la = Lantanju
    .ce = Ċerju
    .pr = Praseodimju
    .nd = Neodimju
    .pm = Prometju
    .sm = Samarju
    .eu = Ewropju
    .gd = Gadolinju
    .tb = Terbju
    .dy = Disprosju
    .ho = Holmju
    .er = Erbju
    .tm = Tulju
    .yb = Itterbju
    .lu = Lutezju
    .hf = Hafnju
    .ta = Tantalu
    .w = Tungstenu
    .re = Renju
    .os = Osmju
    .ir = Iridju
    .pt = Platinu
    .au = Deheb
    .hg = Merkurju
    .tl = Tallju
    .pb = Ċomb
    .bi = Bismut
    .po = Polonju
    .at = Astatin
    .rn = Radon
    .fr = Franċju
    .ra = Radju
    .ac = Attinju
    .th = Torju
    .pa = Protattinju
    .u = Uranju
    .np = Nettunju
    .pu = Plutonju
    .am = Amerikju
    .cm = Kurju
    .bk = Berkelju
    .cf = Kalifornju
    .es = Ajnstajnju
    .fm = Fermju
    .md = Mendelevju
    .no = Nobelju
    .lr = Lawrenzju
    .rf = Rutherfordju
    .db = Dubnju
    .sg = Seaborgju
    .bh = Bohrju
    .hs = Hassju
    .mt = Meitnerju
    .ds = Darmstadtju
    .rg = Roentgenju
    .cn = Kopernikju
    .nh = Nihonju
    .fl = Flerovju
    .mc = Moskovju
    .lv = Livermorju
    .ts = Tenessin
    .og = Oganesson

element-anion-name =
    .h = Idrur
    .c = Karbur
    .n = Nitrur
    .o = Ossidu
    .f = Fluworur
    .p = Fosfur
    .s = Sulfur
    .cl = Klorur
    .br = Bromur
    .i = Jodur
    .at = Astatur
    .ts = Tenessur

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Simbolu kimiku invalidu
chemistry-invalid-ionic-compound = Kompost joniku invalidu
