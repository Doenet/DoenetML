# Mandinka content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `mnk` is Mandinka, of the Gambia, the Casamance and Guinea-Bissau. CLDR
# carries no language name for it, so the roster reads its English name once
# rather than twice.
#
# It is the third catalog here for a member of the ISO 639-3 macrolanguage
# `man`, beside `locales/bm` and `locales/dyu`, and it is the one CLDR's own
# likely-subtags points at: a bare `man` maximizes to `man-Latn-GM`, the
# Gambia, which is Mandinka's country. That is why `negotiate.ts` sends `man`
# here rather than to either of the other two — a published fact rather than a
# judgement made in this repository. Its `MACROLANGUAGE_MEMBERS` docstring says
# the rest.
#
# Mandinka has no grammatical gender, no article and no case, so `$gender` and
# `$role` go unused exactly as they do in English.
#
# What it has is the **definite suffix `-o`**, which closes a noun and closes
# the whole noun phrase when a qualifier follows: «laayinoo fiŋo». Every
# adjective here carries it, because every one of them is said of a definite
# thing. That is a suffix on a word the catalog writes, never on a placeable,
# so it is nothing like the affix rule's problem cases — but it is worth
# naming, because a reader adding a colour has to add it in the `-o` form.
#
# Adjectives follow the noun, so the composition messages put the noun first.
#
# The mathematical nouns are the first thing to check. Mandinka's range crosses
# three school systems and the loanwords lean English, which is the Gambia's;
# a Casamance or Bissau reader may want French or Portuguese shapes instead.
# The chemistry note at the foot of this file is the same fact stated where it
# does the most damage.


## Style vocabulary

color =
    .black = fiŋo
    .white = koyoo
    .gray = seboo
    .red = wuleŋo
    .orange = orenjoo
    .yellow = jalloo
    .green = jamboo
    .cyan = sayaŋo
    .blue = buluwoo
    .purple = purupuloo
    .pink = piŋkoo
    .brown = burawunoo
line-width =
    .thick = waroo
    .thin = meseŋo
# Written as invariable «niŋ …» phrases rather than as qualifiers, so that they
# take no `-o` agreement and can close the description. `style-stroke` puts
# them last.
line-style =
    .dashed = niŋ dasoolu
    .dotted = niŋ tombondiŋolu
fill-style =
    .horizontal = laayinoolu meŋ laata
    .vertical = laayinoolu meŋ loota
    .diagonal = laayinoolu meŋ jenketa
    .backdiagonal = laayinoolu meŋ jenketa karoo doo la
    .dots = tombondiŋolu
    .diamonds = dayamondoolu
noun =
    .line = laayinoo
    .line-segment = laayin kuntoo
    .ray = reyoo
    .vector = wektaroo
    .curve = laayin jenkeriŋo
    .function = fankisoŋo
    .parabola = paraboloo
    .polyline = laayin kuntu jamaa
    .polygon = poligoŋo
    .triangle = tirayangoloo
    .rectangle = rektangoloo
    .circle = muruŋo
    .region = dinkiraa
    .point = poyintoo
    .square = sikwewoo
    .diamond = dayamondoo
    .cross = kurusoo
    .plus = lafaa taamanseeroo
# The side count follows the qualifiers, behind «meŋ ye … soto», because
# Mandinka closes a noun phrase with a relative rather than opening one.
noun-regular-polygon =
    { $part ->
        [tail] meŋ ye karoo { $numSides } soto
       *[head] poligoŋ tembendiŋo
    }
# No grammatical gender, so this answers one token for every noun and the
# answer goes unused — the shape `locales/en` has.
noun-gender = kiliŋ

## Style composition

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
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = faariŋo
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } niŋ { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } niŋ { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } niŋ { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Mandinka has no article, and joins this clause with the invariable «niŋ»
# whatever came before it, so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] niŋ naanewo { $border }
        [and] niŋ naanewo { $border }
        [and-article] niŋ naanewo { $border }
       *[with] niŋ naanewo { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = meŋ maŋ faa
style-text =
    { $parts ->
        [background] { $color } niŋ kooma { $background }
       *[plain] { $color }
    }
style-background-none = feŋ te jee

## Boolean words

boolean-true = tooñaa
boolean-false = faniyaa

## Answer buttons

answer-submit-label = Dookuwo Koroosi
answer-submit-label-no-correctness = Jaabiroo Kii

## Sectional blocks

section-name =
    .activity = Dookuwo
    .aside = Lafaaroo
    .cascade = Tembendiroo
    .definition = Kotoo
    .example = Misaaloo
    .exercise = Dalitaroo
    .exercises = Dalitaroolu
    .given-answer = Jaabiroo
    .note = Hakilitoo
    .objectives = Feeroolu
    .paragraphs = Kumakaŋolu
    .part = Karoo
    .problem = Kuu koleŋo
    .problems = Kuu koleŋolu
    .proof = Seedeyaa
    .question = Ñininkaaroo
    .section = Karandiroo
    .solution = Bataa dandaŋo
    .task = Dookuwo
    .theorem = Teyoreemoo
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Yitandiroo

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabuloo { $enumeration }
        [numbered-title] Tabuloo { $enumeration }{ ": " }
        [unnumbered-title] Tabuloo{ ": " }
       *[unnumbered] Tabuloo
    }
figure-name =
    { $parts ->
        [numbered] Natamboo { $enumeration }
        [numbered-caption] Natamboo { $enumeration }{ ": " }
        [unnumbered-caption] Natamboo{ ": " }
       *[unnumbered] Natamboo
    }

## Paginator controls

paginator-previous = Meŋ tambita
paginator-next = Meŋ ka naa
paginator-page = Karataa
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = waraŋ
piecewise-condition-if = niŋ
piecewise-condition-otherwise = dulaa doolu bee to

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## **This is the one catalog in its batch that is not simply the school-system
## case, and the difference is worth keeping.** Mandinka is spoken across three
## countries with three different mediums of secondary instruction — English in
## the Gambia, French in Senegal, Portuguese in Guinea-Bissau — so there is no
## one curriculum for a fallback to *be*. Choosing any of the three would
## report which side of which border a reader's school is on, and that is a
## fact about a border rather than about the language. `locales/se` reached the
## same place between Norway, Sweden and Finland; this is that case in West
## Africa.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Kemisitiri Taamanseer Kuruŋo
chemistry-invalid-ionic-compound = Ayoŋ Ñaboo Kuruŋo
