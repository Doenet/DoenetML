# Kimbundu content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `kmb` is Kimbundu, the language of Luanda and the Kwanza valley and the
# second-largest in Angola. It arrives beside `locales/umb` (Umbundu) in the
# same batch, and the pair is the point.
#
# **`$gender` is a noun class again, and it lands on a connective rather than
# on the describing word.** Kimbundu joins a describing word to its noun with a
# particle built on «-a», and the particle agrees while the stem behind it does
# not:
#
#            c5 (dya)    c7 (kya)    c9 (ya)     c10 (ja)
#   -ndombe   dya ndombe  kya ndombe  ya ndombe   ja ndombe
#   -zele     dya zele    kya zele    ya zele     ja zele
#   -nene     dya nene    kya nene    ya nene     ja nene
#
# **Two comparisons, and they cut in opposite directions.**
#
# `locales/umb` is Kimbundu's neighbour — the two largest languages of one
# country, both Bantu, both with the same class system — and Umbundu prefixes
# the class straight onto the stem («citekãva», «cinene») with no connective at
# all. So neighbours in one country diverge.
#
# `locales/kg` is a thousand kilometres north, in a different country, and does
# *exactly this*: an agreeing «-a» connective in front of an invariant stem,
# «dya ndombe» for the same word. So a distant relative converges.
#
# Family does not predict the shape of agreement, and neither does geography.
# That was `locales/kg` and `locales/ktu`'s lesson in #1686 about a creole and
# its lexifier; this is the same lesson with the creole taken out of it, which
# is what makes it a fact about Bantu rather than about creolization.
#
# `$role` goes unused: Kimbundu marks no case.
#
# The chemistry gap here is Portuguese, for the reason `locales/umb` sets out
# at the foot of its own file.
#
# The geometry leans on the Portuguese loans Angolan schooling supplies; where
# Kimbundu has its own word it is used — «kididi» a place, «kimbanza» a mark.
# They are the first thing to check.


## Style vocabulary
##
## The stem never changes; only the connective in front of it does. That is
## `locales/kg`'s shape exactly, and not `locales/umb`'s.

color =
    .black =
        { $gender ->
            [c5] dya ndombe
            [c7] kya ndombe
            [c10] ja ndombe
           *[c9] ya ndombe
        }
    .white =
        { $gender ->
            [c5] dya zele
            [c7] kya zele
            [c10] ja zele
           *[c9] ya zele
        }
    .gray =
        { $gender ->
            [c5] dya mbwe
            [c7] kya mbwe
            [c10] ja mbwe
           *[c9] ya mbwe
        }
    .red =
        { $gender ->
            [c5] dya kusuka
            [c7] kya kusuka
            [c10] ja kusuka
           *[c9] ya kusuka
        }
    .orange = ya laranja
    .yellow = ya amarelu
    .green = ya verdi
    .cyan = ya syanu
    .blue = ya azulu
    .purple = ya roxu
    .pink = ya rosa
    .brown = ya kastanyu

line-width =
    .thick =
        { $gender ->
            [c5] dya nene
            [c7] kya nene
            [c10] ja nene
           *[c9] ya nene
        }
    .thin =
        { $gender ->
            [c5] dya tetuka
            [c7] kya tetuka
            [c10] ja tetuka
           *[c9] ya tetuka
        }

# Written with the frozen class-9 «ya», the way the Portuguese loans above are:
# these describe a manner rather than a quality, and a speaker does not agree
# them with the shape. `style-stroke` puts them last so nothing follows them.
line-style =
    .dashed = ya jinlonji jitetuka
    .dotted = ya jimbanza

fill-style =
    .horizontal = jinlonji ja lala
    .vertical = jinlonji ja imana
    .diagonal = jinlonji ja bhita
    .backdiagonal = jinlonji ja bhita ku mbandu ya mukwa
    .dots = jimbanza
    .diamonds = jidiamanti

noun =
    .line = nlonji
    .line-segment = kitangana kya nlonji
    .ray = mwenyu
    .vector = vetoru
    .curve = nlonji ya kubhinda
    .function = funsau
    .parabola = parabola
    .polyline = nlonji ya jitangana
    .polygon = poligonu
    .triangle = triangulu
    .rectangle = retangulu
    .circle = kizenge
    .region = kididi
    .point = kimbanza
    .square = kwadradu
    .diamond = diamanti
    .cross = kuluzu
    .plus = kimbanza kya kubhakela

# The side count is a counted complement and closes the noun phrase behind the
# describing words, so it goes in the tail. «-a» agrees here too, but the head
# noun is always the same word, so the form is fixed and needs no fork — which
# is `locales/kg`'s note on the same message, for the same reason.
noun-regular-polygon =
    { $part ->
        [tail] ya jimbandu { $numSides }
       *[head] poligonu ya kusokela
    }

# The noun class. `c9` is the default and the class a Portuguese loan joins,
# which is what an author's own `markerStyleWord` is as far as this catalog is
# concerned.
noun-gender =
    { $noun ->
        [line-segment] c7
        [square] c7
        [region] c7
        [circle] c7
        [point] c7
        [plus] c7
        [fill] c7
        [diamond] c5
        [cross] c5
        [text] c5
        [background] c10
        [border] c10
       *[other] c9
    }


## Style composition

# The dash pattern is a «ya …» phrase and closes the description, so it moves
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

style-filled-word =
    { $gender ->
        [c5] dya kuizala
        [c7] kya kuizala
        [c10] ja kuizala
       *[c9] ya kuizala
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ni { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ni { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ni { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «jimbandu» is the border and leads its own describing words, so they agree
# with it rather than with the shape it surrounds — which is why `border`
# answers `c10` in `noun-gender`. Kimbundu has no article and joins this clause
# with the invariable «ni», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] ni jimbandu { $border }
        [and] ni jimbandu { $border }
        [and-article] ni jimbandu { $border }
       *[with] ni jimbandu { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = ki kya kuizala ko

style-text =
    { $parts ->
        [background] { $color } ni kunima { $background }
       *[plain] { $color }
    }

style-background-none = kima ki kwala ko


## Boolean words

boolean-true = kidi
boolean-false = makutu


## Answer buttons

answer-submit-label = Tala o Kikalakalu
answer-submit-label-no-correctness = Tuma o Kitambwijilu


## Sectional blocks

section-name =
    .activity = Kikalakalu
    .aside = Izwelu ya mukwa
    .cascade = Kaskata
    .definition = Kijilu
    .example = Kifika
    .exercise = Kilongelu
    .exercises = Ilongelu
    .given-answer = Kitambwijilu
    .note = Kisonekenu
    .objectives = Ibhindamenu
    .paragraphs = Itangana
    .part = Kitangana
    .problem = Kibhidi
    .problems = Ibhidi
    .proof = Umbangi
    .question = Kibhwilu
    .section = Kitangana
    .solution = Kisokololwelu
    .task = Kikalakalu
    .theorem = Teoremu

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Kikwatekesu


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabela { $enumeration }
        [numbered-title] Tabela { $enumeration }{ ": " }
        [unnumbered-title] Tabela{ ": " }
       *[unnumbered] Tabela
    }

figure-name =
    { $parts ->
        [numbered] Kifika { $enumeration }
        [numbered-caption] Kifika { $enumeration }{ ": " }
        [unnumbered-caption] Kifika{ ": " }
       *[unnumbered] Kifika
    }


## Paginator controls

paginator-previous = Ya bhitile
paginator-next = Ya kaya

paginator-page = Kibhamba

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = mba

piecewise-condition-if = se

piecewise-condition-otherwise = mu ima yoso ya mukwa


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The Portuguese case, set out in full at the foot of `locales/umb` — Angola
## teaches secondary science in Portuguese, so the English fallback is neither
## Kimbundu nor the curriculum, and filling the keys from Portuguese would be
## the substitution this seeding effort is careful not to make.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Kimbanza kya Kimika ki Kyabhonga ko
chemistry-invalid-ionic-compound = Kibhungu kya Ioni ki Kyabhonga ko
