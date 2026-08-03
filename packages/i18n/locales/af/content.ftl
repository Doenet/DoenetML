# Afrikaans content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Afrikaans is `locales/nl` with the agreement taken out, and it is worth
# saying so because the two files otherwise look alike. Dutch splits its nouns
# into de-words and het-words and inflects an attributive adjective against
# that split, which is why its catalog selects on `$gender` for every colour.
# Afrikaans kept the words and dropped the split: there is one article, `die`,
# and the colour and width adjectives here — rooi, swart, dik, dun — never
# change shape. So this catalog selects on `$gender` nowhere, exactly as
# English does, and `$role` goes unused with it.
#
# What Afrikaans did keep is the `-e` on a longer or derived attributive
# adjective, which is why «gestreepte» and «gevulde» are spelled that way. That
# ending is a fact about the adjective rather than about the noun in front of
# it, so it is written in and nothing selects on anything to produce it.
#
# Adjectives precede the noun, as in English and Dutch.


## Style vocabulary

color =
    .black = swart
    .white = wit
    .gray = grys
    .red = rooi
    .orange = oranje
    .yellow = geel
    .green = groen
    .cyan = siaan
    .blue = blou
    .purple = pers
    .pink = pienk
    .brown = bruin

line-width =
    .thick = dik
    .thin = dun

line-style =
    .dashed = gestreepte
    .dotted = gestippelde

fill-style =
    .horizontal = horisontale lyne
    .vertical = vertikale lyne
    .diagonal = diagonale lyne
    .backdiagonal = omgekeerde diagonale lyne
    .dots = kolletjies
    .diamonds = ruite

noun =
    .line = lyn
    .line-segment = lynsegment
    .ray = straal
    .vector = vektor
    .curve = kromme
    .function = funksie
    .parabola = parabool
    .polyline = veellyn
    .polygon = veelhoek
    .triangle = driehoek
    .rectangle = reghoek
    .circle = sirkel
    .region = gebied
    .point = punt
    .square = vierkant
    .diamond = ruit
    .cross = kruis
    .plus = plusteken

# The side count folds into the head, as English does: Afrikaans writes a
# compound — «5-sydige reëlmatige veelhoek» — and there is nothing to put
# after the adjectives.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-sydige reëlmatige veelhoek
    }

# Afrikaans has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English, and unlike Dutch.
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

style-filled-word = gevulde

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } met { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } met { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } met { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

style-border-clause =
    { $parts ->
        [with-article] met 'n { $border } rand
        [and] en { $border } rand
        [and-article] en 'n { $border } rand
       *[with] met { $border } rand
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = ongevuld

style-text =
    { $parts ->
        [background] { $color } op 'n { $background } agtergrond
       *[plain] { $color }
    }

style-background-none = geen


## Boolean words

boolean-true = waar
boolean-false = onwaar


## Answer buttons

answer-submit-label = Kontroleer Werk
answer-submit-label-no-correctness = Dien Antwoord In


## Sectional blocks

section-name =
    .activity = Aktiwiteit
    .aside = Sytoevoeging
    .cascade = Kaskade
    .definition = Definisie
    .example = Voorbeeld
    .exercise = Oefening
    .exercises = Oefeninge
    .given-answer = Antwoord
    .note = Nota
    .objectives = Doelwitte
    .paragraphs = Paragrawe
    .part = Deel
    .problem = Probleem
    .problems = Probleme
    .proof = Bewys
    .question = Vraag
    .section = Afdeling
    .solution = Oplossing
    .task = Taak
    .theorem = Stelling

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Wenk


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabel { $enumeration }
        [numbered-title] Tabel { $enumeration }{ ": " }
        [unnumbered-title] Tabel{ ": " }
       *[unnumbered] Tabel
    }

figure-name =
    { $parts ->
        [numbered] Figuur { $enumeration }
        [numbered-caption] Figuur { $enumeration }{ ": " }
        [unnumbered-caption] Figuur{ ": " }
       *[unnumbered] Figuur
    }


## Paginator controls

paginator-previous = Vorige
paginator-next = Volgende
paginator-page = Bladsy

paginator-page-status = { $pageLabel } { $currentPage } van { $numPages }


## Piecewise functions

piecewise-condition-or = of
piecewise-condition-if = as
piecewise-condition-otherwise = andersins


## Chemistry

# The Afrikaans names South African chemistry textbooks print, spelled as the
# Afrikaanse Woordelys en Spelreëls has them. Three patterns cover the list:
# the `-ium` metals keep the ending and lose the English spelling around it
# (litium, berillium, natrium); the halogens and the light non-metals have
# Afrikaans words of their own (fluoor, chloor, broom, waterstof, suurstof,
# stikstof, koolstof); and the metals known before the nomenclature was
# regularized keep theirs — yster, koper, silwer, goud, lood, tin, kwik.
#
# The anions below take `-ied` where English takes `-ide`.
element-name =
    .h = waterstof
    .he = helium
    .li = litium
    .be = berillium
    .b = boor
    .c = koolstof
    .n = stikstof
    .o = suurstof
    .f = fluoor
    .ne = neon
    .na = natrium
    .mg = magnesium
    .al = aluminium
    .si = silikon
    .p = fosfor
    .s = swael
    .cl = chloor
    .ar = argon
    .k = kalium
    .ca = kalsium
    .sc = skandium
    .ti = titaan
    .v = vanadium
    .cr = chroom
    .mn = mangaan
    .fe = yster
    .co = kobalt
    .ni = nikkel
    .cu = koper
    .zn = sink
    .ga = gallium
    .ge = germanium
    .as = arseen
    .se = seleen
    .br = broom
    .kr = kripton
    .rb = rubidium
    .sr = strontium
    .y = yttrium
    .zr = sirkonium
    .nb = niobium
    .mo = molibdeen
    .tc = tegnesium
    .ru = rutenium
    .rh = rodium
    .pd = palladium
    .ag = silwer
    .cd = kadmium
    .in = indium
    .sn = tin
    .sb = antimoon
    .te = telluur
    .i = jodium
    .xe = xenon
    .cs = sesium
    .ba = barium
    .la = lantaan
    .ce = serium
    .pr = praseodimium
    .nd = neodimium
    .pm = prometium
    .sm = samarium
    .eu = europium
    .gd = gadolinium
    .tb = terbium
    .dy = disprosium
    .ho = holmium
    .er = erbium
    .tm = tulium
    .yb = itterbium
    .lu = lutetium
    .hf = hafnium
    .ta = tantaal
    .w = wolfram
    .re = renium
    .os = osmium
    .ir = iridium
    .pt = platinum
    .au = goud
    .hg = kwik
    .tl = tallium
    .pb = lood
    .bi = bismut
    .po = polonium
    .at = astaat
    .rn = radon
    .fr = frankium
    .ra = radium
    .ac = aktinium
    .th = torium
    .pa = protaktinium
    .u = uraan
    .np = neptunium
    .pu = plutonium
    .am = amerisium
    .cm = curium
    .bk = berkelium
    .cf = kalifornium
    .es = einsteinium
    .fm = fermium
    .md = mendelevium
    .no = nobelium
    .lr = lawrensium
    .rf = rutherfordium
    .db = dubnium
    .sg = seaborgium
    .bh = bohrium
    .hs = hassium
    .mt = meitnerium
    .ds = darmstadtium
    .rg = roentgenium
    .cn = kopernisium
    .nh = nihonium
    .fl = flerovium
    .mc = moskovium
    .lv = livermorium
    .ts = tennessien
    .og = oganesson

element-anion-name =
    .h = hidried
    .c = karbied
    .n = nitried
    .o = oksied
    .f = fluoried
    .p = fosfied
    .s = sulfied
    .cl = chloried
    .br = bromied
    .i = jodied
    .at = astatied
    .ts = tennessied

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ongeldige Chemiese Simbool
chemistry-invalid-ionic-compound = Ongeldige Ioniese Verbinding
