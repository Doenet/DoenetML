# Kanuri content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `kr` is Kanuri, of Borno and the Lake Chad basin — north-eastern Nigeria,
# eastern Niger, western Chad and northern Cameroon. It is the one
# Nilo-Saharan catalog in this batch, and it is the second thing this file has
# to say about itself: **it is a macrolanguage**, like `qu`, `ff`, `bik`, `kok`
# and `doi` before it. The catalog is Central Kanuri, which is `knc` — the
# variety CLDR fills a bare `kr` in as and the one member ICU folds on its own
# — and `negotiate.ts` sends the other three members here too.
#
# **Manga Kanuri is the script debt, and it is a real one.** `kby` maximizes to
# `kby-Arab`: CLDR's own data says a Manga reader most likely arrives in Ajami,
# and what they get from here is Latin. That is `locales/ha`'s asymmetry and
# `locales/ff`'s `ff-Adlm` exactly, and the answer to it is a second catalog
# beside this one rather than a rename of this one.
#
# Kanuri has no grammatical gender, no noun class and no case that these words
# fall into, so `$gender` and `$role` go unused exactly as they do in English.
# It sits in this batch beside three catalogs that fork on a Bantu class, two
# that fork on a Gur one and one that forks through a Tiv particle, and it is
# the outside evidence for what they add up to: a region says nothing about
# agreement, and neither does a continent.
#
# Adjectives follow the noun, so the composition messages put the noun first.
#
# **The vocabulary is the least confident part of this file** and should be the
# first thing a speaker reads. The mathematical nouns lean on the English loans
# Nigerian schooling supplies; the colour and quality words are the ones most
# likely to be wrong.


## Style vocabulary

color =
    .black = sǝlim
    .white = bul
    .gray = kǝrbu
    .red = kime
    .orange = lemu
    .yellow = zawu
    .green = shuwuri
    .cyan = sayan
    .blue = bulu
    .purple = papul
    .pink = pinki
    .brown = burawun
line-width =
    .thick = kura
    .thin = dibi
# Written as invariable «-be» phrases rather than as qualifiers, so that they
# can close the description. `style-stroke` puts them last.
line-style =
    .dashed = kǝska-be
    .dotted = tǝndi-be
fill-style =
    .horizontal = layinwa kǝlanzǝ
    .vertical = layinwa dǝganzǝ
    .diagonal = layinwa gǝnyinzǝ
    .backdiagonal = layinwa gǝnyinzǝ kǝskabe
    .dots = tǝndiwa
    .diamonds = dayamonwa
noun =
    .line = layin
    .line-segment = layin fartu
    .ray = rei
    .vector = bekta
    .curve = layin gǝnyinbe
    .function = fankshan
    .parabola = parabola
    .polyline = layin fartuwa
    .polygon = poligon
    .triangle = trayangul
    .rectangle = rektangul
    .circle = sekul
    .region = kǝla
    .point = poyint
    .square = sikwe
    .diamond = dayamon
    .cross = kurus
    .plus = alama zawube
# The side count is a relative and closes the noun phrase behind the describing
# words rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] kǝskawa { $numSides } jinzǝ
       *[head] poligon lawanbe
    }
# No grammatical gender, so this answers one token for every noun and the
# answer goes unused — the shape `locales/en` has.
noun-gender = tilo

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
style-filled-word = dinzǝ
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern }-a
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } { $pattern }-a
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } { $pattern }-a
       *[plain] { $noun } { $filled } { $color }
    }
# Kanuri has no article, and joins this clause with the invariable «-a»
# whatever came before it, so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] kǝska { $border }-a
        [and] kǝska { $border }-a
        [and-article] kǝska { $border }-a
       *[with] kǝska { $border }-a
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = dinzǝni
style-text =
    { $parts ->
        [background] { $color } kǝska { $background }-be
       *[plain] { $color }
    }
style-background-none = ndu bago

## Boolean words

boolean-true = haqqa
boolean-false = kǝzǝna

## Answer buttons

answer-submit-label = Kalakce Jiliwu
answer-submit-label-no-correctness = Jawab Sadi

## Sectional blocks

section-name =
    .activity = Jiliwu
    .aside = Zawu
    .cascade = Tǝrtiwu
    .definition = Fasar
    .example = Misal
    .exercise = Karangi
    .exercises = Karangiwa
    .given-answer = Jawab
    .note = Alama
    .objectives = Nyiya
    .paragraphs = Kalamwa
    .part = Fartu
    .problem = Mashakal
    .problems = Mashakalwa
    .proof = Shaida
    .question = Lardu
    .section = Fartu
    .solution = Kǝlanzǝ
    .task = Jiliwu
    .theorem = Tiyorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Alama

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tebur { $enumeration }
        [numbered-title] Tebur { $enumeration }{ ": " }
        [unnumbered-title] Tebur{ ": " }
       *[unnumbered] Tebur
    }
figure-name =
    { $parts ->
        [numbered] Suratu { $enumeration }
        [numbered-caption] Suratu { $enumeration }{ ": " }
        [unnumbered-caption] Suratu{ ": " }
       *[unnumbered] Suratu
    }

## Paginator controls

paginator-previous = Ngǝwube
paginator-next = Waube
paginator-page = Bela
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = ya
piecewise-condition-if = adǝga
piecewise-condition-otherwise = kǝlawa dǝga

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case, and across four ministries rather than one: Nigeria
## teaches secondary science in English, Niger and Chad in French, and Cameroon
## in both — though Kanuri's range there is the francophone Far North. So a
## Kanuri speaker meets the periodic table in one or the other and the fallback
## *is* one of the two curricula. `locales/mnk`'s header records the sharper
## version of the same shape, where the three mediums leave nothing for a
## fallback to be; here one of the two is English, which is what the fallback
## already is.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Alama Kemistiribe Ngǝlani
chemistry-invalid-ionic-compound = Ayon Kǝlanzǝbe Ngǝlani
