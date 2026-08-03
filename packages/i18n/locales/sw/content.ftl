# Swahili content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Swahili has no masculine or feminine, and it agrees an adjective with its
# noun harder than any language this repository has translated so far. What it
# agrees with is the noun's **class**, so this catalog reads `$gender` as the
# class token rather than as a gender: `noun-gender` answers `c3`, `c5`, `c6`,
# `c7` or `c9`, and every adjective that carries a concord selects on it. The
# argument needed no widening — a token set is a token set — which is the whole
# reason it was named for a position rather than for a case.
#
# The concords this catalog writes out:
#
#          c3 (m-/mi-)  c5 (ji-/ma-)  c6 (ma-)  c7 (ki-/vi-)  c9 (N)
#   -nene   mnene        nene          manene    kinene        nene
#   -embamba mwembamba   jembamba      membamba  chembamba     membamba
#   -eusi   mweusi       jeusi         meusi     cheusi        nyeusi
#   -eupe   mweupe       jeupe         meupe     cheupe        nyeupe
#   -ekundu mwekundu     jekundu       mekundu   chekundu      nyekundu
#   -jazwa  uliojazwa    lililojazwa   yaliyojazwa kilichojazwa iliyojazwa
#
# `c9` is the default, because that is the class a loanword joins — and an
# author's own `markerStyleWord`, which this catalog has never seen, is a
# loanword as far as it is concerned.
#
# Adjectives follow the noun, so the composition messages put the noun first.
# `$role` goes unused: Swahili marks no case, and the three clause positions
# each arrive with the class of their own noun already set.
#
# `sw` is the macrolanguage, which is what a reader arrives under from a
# browser and what an author types. `swh` — Coastal Swahili, the individual
# code — reaches English rather than this file, and deliberately so: nothing
# canonicalizes it, and an alias is a second catalog's job rather than a
# rewrite of this one's name.
#
# The one place the seed is stiff on purpose: only the three colours with a
# native adjective stem — black, white, red — take a concord. The rest are
# invariable nouns, and attributively Swahili joins them with the associative
# particle of the class («mstari mnene *wa* kijani»). The particle is
# computable from `$gender`, but the same string is also what `backgroundColor`
# reports standing alone, where a bare associative would be ungrammatical, and
# nothing in `$role` tells the two apart — the position a colour lands in is
# `standalone` in both. So the colour nouns are written bare, which is what a
# label or a legend says in Swahili anyway.


## Style vocabulary

# Only the three with a native adjective stem inflect. The rest are nouns and
# do not change shape for anything.
color =
    .black =
        { $gender ->
            [c3] mweusi
            [c5] jeusi
            [c6] meusi
            [c7] cheusi
           *[c9] nyeusi
        }
    .white =
        { $gender ->
            [c3] mweupe
            [c5] jeupe
            [c6] meupe
            [c7] cheupe
           *[c9] nyeupe
        }
    .gray = kijivu
    .red =
        { $gender ->
            [c3] mwekundu
            [c5] jekundu
            [c6] mekundu
            [c7] chekundu
           *[c9] nyekundu
        }
    .orange = machungwa
    .yellow = njano
    .green = kijani
    .cyan = samawati
    .blue = buluu
    .purple = zambarau
    .pink = waridi
    .brown = kahawia

line-width =
    .thick =
        { $gender ->
            [c3] mnene
            [c5] nene
            [c6] manene
            [c7] kinene
           *[c9] nene
        }
    .thin =
        { $gender ->
            [c3] mwembamba
            [c5] jembamba
            [c6] membamba
            [c7] chembamba
           *[c9] membamba
        }

# Written as an invariable «kwa …» phrase rather than as an adjective, so that
# it agrees with nothing and can close the phrase. `style-stroke` puts it last
# for that reason.
line-style =
    .dashed = kwa vipande
    .dotted = kwa vitone

# Noun phrases: they follow «kwa» or «na» and modify nothing.
fill-style =
    .horizontal = mistari mlalo
    .vertical = mistari wima
    .diagonal = mistari mshazari
    .backdiagonal = mistari mshazari kinyume
    .dots = vitone
    .diamonds = rombi

noun =
    .line = mstari
    .line-segment = kipande cha mstari
    .ray = mwale
    .vector = vekta
    .curve = mkunjo
    .function = fanksheni
    .parabola = parabola
    .polyline = mstari wa vipande
    .polygon = pembenyingi
    .triangle = pembetatu
    .rectangle = mstatili
    .circle = duara
    .region = eneo
    .point = nukta
    .square = mraba
    .diamond = rombi
    .cross = msalaba
    .plus = alama ya kujumlisha

# The side count goes in the tail, behind the adjectives, because «yenye pande
# 5» is a relative phrase and Swahili closes a noun phrase with it rather than
# opening one: «pembenyingi sawa nyekundu yenye pande 5».
noun-regular-polygon =
    { $part ->
        [tail] yenye pande { $numSides }
       *[head] pembenyingi sawa
    }

# The noun class, which is what an adjective agrees with. `c9` is the default
# and the class of every loanword, including a word an author supplies.
noun-gender =
    { $noun ->
        [line] c3
        [ray] c3
        [curve] c3
        [polyline] c3
        [rectangle] c3
        [square] c3
        [cross] c3
        [border] c3
        [fill] c3
        [line-segment] c7
        [circle] c5
        [region] c5
        [text] c6
       *[other] c9
    }


## Style composition

# The dash pattern is a «kwa …» phrase and closes the description, so it moves
# behind the colour rather than sitting between the width and it.
style-stroke =
    { $parts ->
        [width-style-color] { $width } { $color } { $lineStyle }
        [width-color] { $width } { $color }
        [style-color] { $color } { $lineStyle }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

# The noun leads and its adjectives follow, with the noun's own relative
# complement closing the phrase: «pembenyingi sawa nyekundu yenye pande 5».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word =
    { $gender ->
        [c3] uliojazwa
        [c5] lililojazwa
        [c6] yaliyojazwa
        [c7] kilichojazwa
       *[c9] iliyojazwa
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } na { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } na { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } na { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «mpaka» is class 3 and leads its own adjectives, so the border's words agree
# with it and not with the shape it surrounds. Swahili has no article and joins
# a complement with the invariable «na» rather than with a concording relative,
# so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] na mpaka { $border }
        [and] na mpaka { $border }
        [and-article] na mpaka { $border }
       *[with] na mpaka { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = bila kujazwa

style-text =
    { $parts ->
        [background] { $color } juu ya mandharinyuma { $background }
       *[plain] { $color }
    }

style-background-none = hakuna


## Boolean words

boolean-true = kweli
boolean-false = uongo


## Answer buttons

answer-submit-label = Angalia Kazi
answer-submit-label-no-correctness = Wasilisha Jibu


## Sectional blocks

section-name =
    .activity = Shughuli
    .aside = Pembeni
    .cascade = Mtiririko
    .definition = Fasili
    .example = Mfano
    .exercise = Zoezi
    .exercises = Mazoezi
    .given-answer = Jibu
    .note = Dokezo
    .objectives = Malengo
    .paragraphs = Aya
    .part = Sehemu
    .problem = Swali
    .problems = Maswali
    .proof = Uthibitisho
    .question = Swali
    .section = Kifungu
    .solution = Suluhisho
    .task = Kazi
    .theorem = Nadharia

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Kidokezo


## Tables and figures

table-name =
    { $parts ->
        [numbered] Jedwali { $enumeration }
        [numbered-title] Jedwali { $enumeration }{ ": " }
        [unnumbered-title] Jedwali{ ": " }
       *[unnumbered] Jedwali
    }

figure-name =
    { $parts ->
        [numbered] Kielelezo { $enumeration }
        [numbered-caption] Kielelezo { $enumeration }{ ": " }
        [unnumbered-caption] Kielelezo{ ": " }
       *[unnumbered] Kielelezo
    }


## Paginator controls

paginator-previous = Iliyotangulia
paginator-next = Ifuatayo
paginator-page = Ukurasa

paginator-page-status = { $pageLabel } { $currentPage } kati ya { $numPages }


## Piecewise functions

piecewise-condition-or = au
piecewise-condition-if = ikiwa
piecewise-condition-otherwise = vinginevyo


## Chemistry

# The Swahilized names Tanzanian and Kenyan chemistry textbooks print, which
# adapt the international forms to Swahili spelling rather than translating
# them. A handful keep a Latin stem the English word does not — ferumu,
# kupro, plumbo — which is the same choice Malay makes and not a
# transliteration of English.
element-name =
    .h = hidrojeni
    .he = heliamu
    .li = lithiamu
    .be = beriliamu
    .b = boroni
    .c = kaboni
    .n = naitrojeni
    .o = oksijeni
    .f = florini
    .ne = neoni
    .na = sodiamu
    .mg = magnesiamu
    .al = aluminiamu
    .si = silikoni
    .p = fosforasi
    .s = salfa
    .cl = klorini
    .ar = agoni
    .k = potasiamu
    .ca = kalsiamu
    .sc = skandiamu
    .ti = titaniamu
    .v = vanadiamu
    .cr = kromiamu
    .mn = manganisi
    .fe = ferumu
    .co = kobalti
    .ni = nikeli
    .cu = kupro
    .zn = zinki
    .ga = galiamu
    .ge = jemaniamu
    .as = arseniki
    .se = seleniamu
    .br = bromini
    .kr = kriptoni
    .rb = rubidiamu
    .sr = strontiamu
    .y = itriamu
    .zr = zirkoniamu
    .nb = niobiamu
    .mo = molibdenamu
    .tc = teknetiamu
    .ru = ratheniamu
    .rh = rodiamu
    .pd = paladiamu
    .ag = fedha
    .cd = kadmiamu
    .in = indiamu
    .sn = bati
    .sb = antimoni
    .te = teluriamu
    .i = ayodini
    .xe = zenoni
    .cs = sesiamu
    .ba = bariamu
    .la = lanthanamu
    .ce = seriamu
    .pr = praseodimiamu
    .nd = neodimiamu
    .pm = promethiamu
    .sm = samariamu
    .eu = uropiamu
    .gd = gadoliniamu
    .tb = terbiamu
    .dy = disprosiamu
    .ho = holmiamu
    .er = erbiamu
    .tm = thuliamu
    .yb = iterbiamu
    .lu = lutetiamu
    .hf = hafniamu
    .ta = tantalamu
    .w = tungsteni
    .re = rheniamu
    .os = osmiamu
    .ir = iridiamu
    .pt = platinamu
    .au = dhahabu
    .hg = zebaki
    .tl = thaliamu
    .pb = plumbo
    .bi = bismathi
    .po = poloniamu
    .at = astatini
    .rn = radoni
    .fr = fransiamu
    .ra = radiamu
    .ac = aktiniamu
    .th = thoriamu
    .pa = protaktiniamu
    .u = uraniamu
    .np = neptuniamu
    .pu = plutoniamu
    .am = amerisiamu
    .cm = kuriamu
    .bk = berkeliamu
    .cf = kaliforniamu
    .es = ainstainiamu
    .fm = fermiamu
    .md = mendeleviamu
    .no = nobeliamu
    .lr = lorensiamu
    .rf = ratherfodiamu
    .db = dubniamu
    .sg = siborgiamu
    .bh = bohriamu
    .hs = hassiamu
    .mt = maitneriamu
    .ds = damstadtiamu
    .rg = rontgeniamu
    .cn = koperinisiamu
    .nh = nihoniamu
    .fl = fleroviamu
    .mc = moskoviamu
    .lv = livermoriamu
    .ts = tenesini
    .og = oganesoni

element-anion-name =
    .h = hidraidi
    .c = kabaidi
    .n = naitraidi
    .o = oksaidi
    .f = floraidi
    .p = fosfaidi
    .s = salfaidi
    .cl = kloraidi
    .br = bromaidi
    .i = ayodaidi
    .at = astataidi
    .ts = tenesaidi

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Alama ya Kikemikali Isiyo Sahihi
chemistry-invalid-ionic-compound = Kiwanja Ayoni Kisicho Sahihi
