# Manx (Gaelg) content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, traditional Manx orthography** — Cregeen's and Kelly's
# spelling, the only one Manx has, as in every file of this catalog. Digits are
# Latin and a number is grouped by the locale's own rules, which is what
# DoenetML pins for every locale in `src/intl.ts`.
#
# ## Word order and agreement
#
# **Manx puts its adjectives after the noun**, so every composition message is
# reordered from the English and the noun a description names comes first
# rather than last: `style-with-noun` renders «linney chiu vrisht yiarg» for
# *thick dashed red line*. Among themselves the adjectives keep English's
# order — width, dash pattern, colour — as `locales/ga` and `locales/gd` do.
#
# **The agreement is real, and it is lenition rather than an ending.** A
# feminine singular noun softens the first consonant of what follows it:
# b→v, c→ch, d→gh, g→gh, j→y, m→v, p→ph, s→h, t→h. So «brisht» becomes
# «vrisht» after «linney», «jiarg» becomes «yiarg», «bane» becomes «vane»,
# «doo» becomes «ghoo». Every describing word whose initial can move selects on
# `$gender`; «lheeah», «oranje», «thanney» and «chiu» begin with `lh`, a vowel,
# `th` and `ch`, which have no further lenited form, and are written once with
# no select at all. That is Manx spelling, not an untranslated string.
#
# **Nothing selects on `$role`.** As in the other Goidelic catalogs, what a
# clause position does to a Manx adjective is done by the noun in front of it,
# and that noun's gender is already the token. The three clause positions
# render exactly as `standalone` does.
#
# **`noun-regular-polygon` splits.** The side count follows the style
# adjectives, so the head is «polygon kiart» and the tail «lesh N cheu» —
# «cheu» singular after a numeral, as any counted Manx noun is.
#
# ## Counts
#
# Nothing in this file counts, so none of Manx's plural categories is selected
# here; `chrome.ftl`'s header sets out which integers reach `one`, `two` and
# `few`, and why no `[many]` branch exists anywhere in this catalog.
#
# ## Borrowing, declared
#
# The colours, the shapes a schoolchild names and the everyday words are Manx:
# «doo», «bane», «lheeah», «jiarg», «buigh», «geayney», «gorrym», «dhone»;
# «linney», «kiarkyl», «kerrin», «crosh», «poynt», «duillag», «claare»,
# «jalloo», «firrinagh», «foalsey». The mathematical nouns are **English loans
# in Manx spelling** — «vectoyr», «funshoon», «parabola», «polygon»,
# «theorem», «ionagh» — because Cregeen and Kelly predate them and Culture
# Vannin's word lists do not cover analytic geometry; a Manx-medium pupil meets
# them in English.
#
# **Weakest first.** «cam-linney» for *curve*, «magher liargagh» for *slope
# field*, «kerrin liauyr» for *rectangle*, «cooylrey» for *background* and
# «fuassley» for *solution* are the seed's own compounds and should be checked
# before anything else.
#
# ## The chemistry element tables
#
# `element-name` and `element-anion-name` are **omitted**. Manx has no settled
# published list of all 118 elements, and a pupil on the Isle of Man meets the
# periodic table **in English**, in an English-medium science lesson — even at
# the Bunscoill Ghaelgagh, whose Manx-medium teaching does not extend to
# secondary chemistry. The keys therefore do not appear here and fall back to
# `locales/en`. The surrounding prose keys are translated.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] ghoo
           *[m] doo
        }
    .white =
        { $gender ->
            [f] vane
           *[m] bane
        }
    .gray = lheeah
    .red =
        { $gender ->
            [f] yiarg
           *[m] jiarg
        }
    .orange = oranje
    .yellow =
        { $gender ->
            [f] vuigh
           *[m] buigh
        }
    .green =
        { $gender ->
            [f] gheayney
           *[m] geayney
        }
    .cyan =
        { $gender ->
            [f] ghorrym-lheeah
           *[m] gorrym-lheeah
        }
    .blue =
        { $gender ->
            [f] ghorrym
           *[m] gorrym
        }
    .purple =
        { $gender ->
            [f] ghorrym-jiarg
           *[m] gorrym-jiarg
        }
    .pink =
        { $gender ->
            [f] vane-jiarg
           *[m] bane-jiarg
        }
    .brown = dhone
line-width =
    .thick = chiu
    .thin = thanney
line-style =
    .dashed =
        { $gender ->
            [f] vrisht
           *[m] brisht
        }
    .dotted =
        { $gender ->
            [f] phoyntit
           *[m] poyntit
        }
# Noun phrases standing behind «lesh», which does not lenite in Manx. They
# modify nothing and so take no gender.
fill-style =
    .horizontal = linnaghyn corrym
    .vertical = linnaghyn jeeragh
    .diagonal = linnaghyn trooid-chorneilagh
    .backdiagonal = linnaghyn trooid-chorneilagh cheu-hoshtal
    .dots = poyntyn
    .diamonds = daaymonyn
noun =
    .line = linney
    .line-segment = peesh linney
    .ray = goull
    .vector = vectoyr
    .curve = cam-linney
    .function = funshoon
    .slope-field = magher liargagh
    .vector-field = magher vectoyr
    .parabola = parabola
    .polyline = ymmodee-linney
    .polygon = polygon
    .triangle = trihoarnane
    .rectangle = kerrin liauyr
    .circle = kiarkyl
    .region = ard
    .point = poynt
    .square = kerrin
    .diamond = daaymon
    .cross = crosh
    .plus = plus
noun-regular-polygon =
    { $part ->
        [tail] lesh { $numSides } cheu
       *[head] polygon kiart
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (polygon, m) or the
# head of a phrase the description never names: `border` (oirr, f), `fill`
# (lhieeney, m), `text` (teks, m), `background` (cooylrey, m).
noun-gender =
    { $noun ->
        [line] f
        [line-segment] f
        [curve] f
        [polyline] f
        [cross] f
        [border] f
       *[other] m
    }

## Style composition

# The adjectives follow their noun and keep English's order among themselves:
# «linney chiu vrisht yiarg».
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
# The noun leads and the adjectives follow it, which is the reverse of English
# and the reason this message exists rather than a concatenation.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
# «lhieent» begins with `lh`, which has no further lenited form, so it reads
# the same after a feminine noun as after a masculine one.
style-filled-word = lhieent
style-filled =
    { $parts ->
        [pattern] { $color } { $filled } lesh { $pattern }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } lesh { $pattern }
        [plain-tail] { $noun } { $color } { $filled } { $nounTail }
        [pattern-tail] { $noun } { $color } { $filled } { $nounTail } lesh { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }
# «oirr» is feminine, so the border's adjectives lenite after it whatever the
# shape around it is. Manx has no indefinite article, so the two `-article`
# branches read like the two without; what changes between the pairs is the
# conjunction.
style-border-clause =
    { $parts ->
        [with-article] lesh oirr { $border }
        [and] as oirr { $border }
        [and-article] as oirr { $border }
       *[with] lesh oirr { $border }
    }
# The pattern words are plural nouns, so this supplies «lhieeney» — masculine,
# the gender `noun-gender` already answers for `fill` — for the colour to
# follow, and hangs the pattern off it with «lesh».
style-fill =
    { $parts ->
        [pattern] lhieeney { $color } lesh { $pattern }
       *[plain] { $color }
    }
style-unfilled = gyn lhieeney
# «cooylrey» is masculine, so the background colour does not lenite.
style-text =
    { $parts ->
        [background] { $color } lesh cooylrey { $background }
       *[plain] { $color }
    }
style-background-none = veg

## Boolean words

boolean-true = firrinagh
boolean-false = foalsey

## Answer buttons

answer-submit-label = Prow yn obbyr
answer-submit-label-no-correctness = Cur ansoor stiagh

## Sectional blocks

section-name =
    .activity = Gnaghey
    .aside = Er-lhiattee
    .cascade = Tuittym-ushtey
    .definition = Bun-ockle
    .example = Sampleyr
    .exercise = Ymmyd
    .exercises = Ymmydyn
    .given-answer = Ansoor
    .note = Notey
    .objectives = Kiarailyn
    .paragraphs = Rannyn
    .part = Ayrn
    .problem = Doilleeid
    .problems = Doilleeidyn
    .proof = Prowal
    .question = Feysht
    .section = Rheynn
    .solution = Fuassley
    .task = Obbyr-laue
    .theorem = Theorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Cowrey

## Tables and figures

table-name =
    { $parts ->
        [numbered] Claare { $enumeration }
        [numbered-title] Claare { $enumeration }{ ": " }
        [unnumbered-title] Claare{ ": " }
       *[unnumbered] Claare
    }
figure-name =
    { $parts ->
        [numbered] Jalloo { $enumeration }
        [numbered-caption] Jalloo { $enumeration }{ ": " }
        [unnumbered-caption] Jalloo{ ": " }
       *[unnumbered] Jalloo
    }

## Paginator controls

paginator-previous = Roie
paginator-next = Nah
paginator-page = Duillag
paginator-page-status = { $pageLabel } { $currentPage } jeh { $numPages }

## Piecewise functions

piecewise-condition-or = ny
piecewise-condition-if = my
piecewise-condition-otherwise = er-nonney

## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Cowrey chymmagh neu-chair
chemistry-invalid-ionic-compound = Co-vestey ionagh neu-chair

## Inputs embedded in math

math-embedded-input-blank = follym
math-embedded-input-blank-ordinal = follym { $ordinal } jeh { $total }
