# Fon content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `fon` is Fon (Fɔngbe), the largest Gbe language of southern Benin, and the
# nearest relative of `locales/ee` (Ewe) that this repository carries. Held up
# against it, the two show how far apart two Gbe catalogs can be while
# answering `$gender` the same way — which is to say, not at all.
#
# **This catalog selects on neither argument, and the reason is a fact about
# its colour words rather than about its grammar.** Fon has no noun class and
# no gender, so nothing agrees with anything; `$role` goes unused too, since Fon
# marks no case. That much it shares with `locales/ktu` and `locales/pcm`.
#
# What is worth reading here is the shape of `color`. Fon has three basic
# colour terms and no more: «wiwi» black, «wewe» white, «vɔvɔ» red. All three
# are reduplicated — the bare stems are the verbs «wí», «wé», «vɔ̀» — and the
# reduplication is what turns a verb of quality into something that can stand
# beside a noun. The other nine colours in this file are not Fon words at all;
# they are French, which is where a Fon speaker meets them, and they are
# written bare because there is no stem to reduplicate:
#
#   reduplicated stative     wiwi, wewe, vɔvɔ, kléwún, gaga
#   bare French loan         gris, orange, jaune, vert, cyan, bleu, violet,
#                            rose, marron
#
# So the file has a visible seam running through one message, and the seam is
# morphological rather than orthographic. A speaker reviewing this should
# expect to move words across it — Fon has descriptive phrases for at least
# green («amamu», the colour of leaves) and yellow — rather than to find the
# nine loans wrong as loans.
#
# The determiner «ɔ́» closes a whole noun phrase, behind the describing words.
# It is left off throughout: these descriptions are read out of context, where
# Fon uses the bare indefinite, and welding a determiner to the end of a phrase
# that ends in a placeable is the affix problem the README describes. Choosing
# the indefinite is the way out this catalog takes.
#
# The geometry leans on the French loans Benin schooling supplies; where Fon
# has its own word it is used — «tɛnmɛ» a place, «wlɛ́n» a mark. They are the
# first thing to check.


## Style vocabulary
##
## Three reduplicated Fon statives and nine French loans; see the header.

color =
    .black = wiwi
    .white = wewe
    .gray = gris
    .red = vɔvɔ
    .orange = orange
    .yellow = jaune
    .green = vert
    .cyan = cyan
    .blue = bleu
    .purple = violet
    .pink = rose
    .brown = marron

# Both are Fon statives, and both reduplicate: «gaga» from «gá» to be big,
# «kléwún» from «klé» to be slender.
line-width =
    .thick = gaga
    .thin = kléwún

# Written as «kpó …» phrases rather than as statives, so that they close the
# description rather than sitting inside it. `style-stroke` puts them last.
line-style =
    .dashed = kpó dlɛ̌n kpɛví lɛ́
    .dotted = kpó tɛ́n lɛ́

fill-style =
    .horizontal = dlɛ̌n dòdó lɛ́
    .vertical = dlɛ̌n sítɛ́ lɛ́
    .diagonal = dlɛ̌n gbɔn lɛ́
    .backdiagonal = dlɛ̌n gbɔn ɖò alɔ ɖèvo lɛ́
    .dots = tɛ́n lɛ́
    .diamonds = diamant lɛ́

noun =
    .line = dlɛ̌n
    .line-segment = dlɛ̌n kpɛví
    .ray = wězé
    .vector = vecteur
    .curve = dlɛ̌n glɔ́n
    .function = fonction
    .parabola = parabole
    .polyline = dlɛ̌n gbǎ
    .polygon = polygone
    .triangle = triangle
    .rectangle = rectangle
    .circle = lɛ̌lɛ̌
    .region = tɛnmɛ
    .point = tɛ́n
    .square = carré
    .diamond = diamant
    .cross = akluzu
    .plus = wlɛ́n plus

# The side count follows the describing words and closes the noun phrase, so it
# goes in the tail — the position Fon's own determiner would occupy.
noun-regular-polygon =
    { $part ->
        [tail] kpó akpá { $numSides }
       *[head] polygone jɛ́jɛ́
    }

# Fon has no noun class and no gender, so every noun answers the same and the
# answer goes unused — the shape `locales/en` and `locales/ktu` have.
noun-gender = ɖokpo


## Style composition

# The dash pattern is a «kpó …» phrase and closes the description, so it moves
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

style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = gɔ́

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } kpó { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } kpó { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } kpó { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «dogbó» is the border. Fon has no indefinite article and joins this clause
# with the invariable «kpó», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] kpó dogbó { $border }
        [and] kpó dogbó { $border }
        [and-article] kpó dogbó { $border }
       *[with] kpó dogbó { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = mǎ gɔ́ ǎ

style-text =
    { $parts ->
        [background] { $color } kpó gudo { $background }
       *[plain] { $color }
    }

style-background-none = nǔ ɖé ǎ


## Boolean words

boolean-true = nugbó
boolean-false = adingban


## Answer buttons

answer-submit-label = Kpɔ́n Azɔ̌
answer-submit-label-no-correctness = Sɛ́ Xósin Dó


## Sectional blocks

section-name =
    .activity = Azɔ̌
    .aside = Xó ɖěvo
    .cascade = Kpɔ́nkpɔ́n
    .definition = Tinmɛ
    .example = Kpɔ́ndéwú
    .exercise = Azɔ̌kpɔ́n
    .exercises = Azɔ̌kpɔ́n lɛ́
    .given-answer = Xósin
    .note = Wema
    .objectives = Nǔ e è ba lɛ́
    .paragraphs = Akpáxwé lɛ́
    .part = Akpáxwé
    .problem = Tagba
    .problems = Tagba lɛ́
    .proof = Kúnnuɖenú
    .question = Kanbyɔ́
    .section = Akpáxwé
    .solution = Ali
    .task = Azɔ̌
    .theorem = Théorème

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Alɔdo


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tableau { $enumeration }
        [numbered-title] Tableau { $enumeration }{ ": " }
        [unnumbered-title] Tableau{ ": " }
       *[unnumbered] Tableau
    }

figure-name =
    { $parts ->
        [numbered] Ðiɖe { $enumeration }
        [numbered-caption] Ðiɖe { $enumeration }{ ": " }
        [unnumbered-caption] Ðiɖe{ ": " }
       *[unnumbered] Ðiɖe
    }


## Paginator controls

paginator-previous = Yɛ̌yǐ
paginator-next = Bɔ̌dó

paginator-page = Wexwɛ

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = alǒ

piecewise-condition-if = énɛ́ ɔ́

piecewise-condition-otherwise = ɖò ninɔmɛ ɖě lɛ́ bǐ mɛ


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Benin teaches secondary science in French, so a Fon
## speaker meets the periodic table there and neither Fon nor English is the
## curriculum — which is why the gap is left visible rather than filled with
## English words dressed up as Fon ones. `locales/ee` leaves the same gap for
## the Ghanaian and Togolese ministries.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Wlɛ́n Chimie Tɔ̀n E Má Nyɔ́ Ǎ
chemistry-invalid-ionic-compound = Kplékplé Ion Tɔ̀n E Má Nyɔ́ Ǎ
