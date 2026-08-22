# Kituba content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `ktu` is Kituba — Kikongo ya leta — a national language of the Democratic
# Republic of the Congo and, as Munukutuba, of the Republic of the Congo.
#
# **It is the first Bantu catalog here that selects on neither argument, and
# that is the fact worth reading.** Kituba is a creole whose lexifier is
# Kikongo, and what a creole did to the concord system is exactly what this
# file records: the nouns keep their class prefixes as frozen parts of the word
# — «kima», «muntu», «nzila» — and nothing agrees with them. A describing word
# is joined by the invariable linker «ya» and never changes shape, so
# «ya ndombe» is right after every noun in the language.
#
# So `noun-gender` answers one token, the way `locales/en` does, and no message
# forks on `$gender`. Nineteen Bantu catalogs in this repository write out a
# class table, and this one cannot, because there is nothing to write: a family
# says as little about agreement as a region or a script does, which is the
# sentence `locales/luo` and `locales/sg` earned from outside Bantu and this
# one earns from inside it. `locales/ln` is the instructive neighbour — Lingala
# is the other Congolese vehicular language, it kept its concord, and its
# catalog forks where this one does not.
#
# `$role` goes unused for the ordinary reason: Kituba marks no case.
#
# Describing words follow the noun, so the composition messages put the noun
# first, and «ya» leads each of them.
#
# The vocabulary is Kikongo where Kikongo supplies it and adapted from French
# where it does not — which is the ordinary shape of Kituba's own mathematical
# register, French being the medium of instruction — and it is the first thing
# a speaker should check.


## Style vocabulary

# Invariable throughout: «ya» is the linker and nothing after it agrees.
color =
    .black = ya ndombe
    .white = ya mpembe
    .gray = ya mputulu
    .red = ya mbwaki
    .orange = ya lolanje
    .yellow = ya lunkeni
    .green = ya matiti
    .cyan = ya siani
    .blue = ya bule
    .purple = ya vyole
    .pink = ya loze
    .brown = ya mabele
line-width =
    .thick = ya nene
    .thin = ya fioti
line-style =
    .dashed = ya batini
    .dotted = ya bantoni
fill-style =
    .horizontal = balinya ya kulala
    .vertical = balinya ya kutelama
    .diagonal = balinya ya kubenda
    .backdiagonal = balinya ya kubenda na lweka ya nkaka
    .dots = bantoni
    .diamonds = badiama
noun =
    .line = linya
    .line-segment = kitini ya linya
    .ray = leyo
    .vector = vekitere
    .curve = linya ya kubenda
    .function = fonksio
    .parabola = parabole
    .polyline = linya ya bitini
    .polygon = kifwani ya bansuki mingi
    .triangle = kifwani ya bansuki tatu
    .rectangle = kifwani ya bansuki iya
    .circle = ndilu
    .region = kitini
    .point = pwente
    .square = kare
    .diamond = diama
    .cross = kuluzu
    .plus = kidimbu ya kuyika
# The side count is a relative and closes the noun phrase behind the describing
# words rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] ya kele ti bansuki { $numSides }
       *[head] kifwani ya bansuki ya kiteso mosi
    }
# One token, because Kituba has one: nothing in the language selects on the
# class a noun's frozen prefix came from. A branch for a class would be a
# variant nothing can reach — see `locales/zu`'s header for that rule stated
# where the classes are real.
noun-gender = mosi

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
style-filled-word = ya kufuluka
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ti { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ti { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ti { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Kituba has no article and joins this clause with the invariable «ti», so all
# four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] ti ndilu { $border }
        [and] ti ndilu { $border }
        [and-article] ti ndilu { $border }
       *[with] ti ndilu { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = ya kufuluka ve
style-text =
    { $parts ->
        [background] { $color } na nima { $background }
       *[plain] { $color }
    }
style-background-none = ata kima ve

## Boolean words

boolean-true = ya kyeleka
boolean-false = ya luvunu

## Answer buttons

answer-submit-label = Tala Kisalu
answer-submit-label-no-correctness = Tinda Mvutu

## Sectional blocks

section-name =
    .activity = Kisalu
    .aside = Kuyika
    .cascade = Molongo
    .definition = Ntendula
    .example = Mbandu
    .exercise = Kusala
    .exercises = Bisalu
    .given-answer = Mvutu
    .note = Nsangu
    .objectives = Balukanu
    .paragraphs = Bitini
    .part = Kitini
    .problem = Diambu
    .problems = Mambu
    .proof = Kimbangi
    .question = Kyuvu
    .section = Kitini
    .solution = Nsukulu
    .task = Kisalu
    .theorem = Teoreme
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Kidimbu

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tablo { $enumeration }
        [numbered-title] Tablo { $enumeration }{ ": " }
        [unnumbered-title] Tablo{ ": " }
       *[unnumbered] Tablo
    }
figure-name =
    { $parts ->
        [numbered] Kifwani { $enumeration }
        [numbered-caption] Kifwani { $enumeration }{ ": " }
        [unnumbered-caption] Kifwani{ ": " }
       *[unnumbered] Kifwani
    }

## Paginator controls

paginator-previous = Ya ntete
paginator-next = Ya nima
paginator-page = Lutiti
paginator-page-status = { $pageLabel } { $currentPage } na kati ya { $numPages }

## Piecewise functions

piecewise-condition-or = to
piecewise-condition-if = kana
piecewise-condition-otherwise = na bisika ya nkaka yonso

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Both Congos teach secondary science in French, so a
## Kituba speaker meets the periodic table there and the fallback *is* the
## curriculum — the same answer `locales/ln` and `locales/lua` give.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Kidimbu ya Shimi Ya Mbi
chemistry-invalid-ionic-compound = Kuvukisa ya Bayoni Ya Mbi
