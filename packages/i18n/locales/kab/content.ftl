# Kabyle content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `kab` is Taqbaylit, the Berber language of Kabylia in northern Algeria. It is
# written here in the **Berber Latin alphabet** — the orthography Kabyle
# publishing, the Algerian curriculum and CLDR all use, and what a bare `kab`
# maximizes to. Kabyle is also written in Tifinagh and in Arabic letters, so a
# reader arriving under `kab-Tfng` or `kab-Arab` reaches this catalog and gets
# Latin; the answer to that is a second catalog beside this one rather than a
# rename of it. The two Tifinagh catalogs of this batch, `locales/zgh` and
# `locales/shi`, are the other side of the same coin: **three Berber languages,
# two scripts, and CLDR decides which is which** — not this repository.
#
# The letters ɛ, ɣ, ḥ, ṣ, ṭ, ḍ, ẓ, č and ǧ are part of the alphabet, not
# decorated Latin letters: «azeggaɣ» (red) and «azeggag» are not the same word.
#
# **Kabyle has two genders and agrees an adjective for them**, so `noun-gender`
# answers `m` or `f` and every adjective with a Berber stem selects on it. A
# masculine adjective opens in a- and its feminine counterpart is wrapped in
# t…t: «azeggaɣ» / «tazeggaɣt». Six of the twelve colours have such a stem and
# fork; the other six are loans, invariable in Kabyle as they are in the
# language they came from, and they are written flat rather than given an
# inflection they do not have. That is `locales/ts`'s narrow fork reached from
# a different family.
#
# **It selects on `$gender` alone, and the reason is worth reading**, because
# Kabyle does have exactly the kind of alternation `$role` exists for. A noun
# governed by a preposition goes into the *état d'annexion* — «tawinest»
# becomes «twinest» after «n», «aḍris» becomes «weḍris» — so a clause position
# really does change a word's shape here. What it changes is the **noun**, and
# every noun a clause position lands on is one this catalog writes out
# («tama», «agilal», «aḍris»), so the annexed form is written into the message
# that places it and no adjective ever moves. A `$role` branch would render
# what the `$gender` branch underneath it already renders — `locales/gu`'s case
# and `locales/doi`'s, arriving from Afro-Asiatic.
#
# **The annexed state is also this catalog's affix problem, and the way out is
# a new one.** `$pattern` is a value this file never sees, and it lands after
# the preposition «s», which governs annexation. The catalog cannot inflect an
# unknown word — so instead it makes the *position* uniform: every one of the
# four places a fill pattern is placed puts it behind the same «s», and
# `fill-style` writes its words already annexed. One written form is then right
# in all four. That is *choose the words that land there* — `locales/tg`'s way
# out — with the extra step of arranging that only one position exists to
# choose for.
#
# Adjectives follow the noun, so the composition messages put the noun first.


## Style vocabulary

# The six with a Berber stem inflect. The six loans do not: they are invariable
# in Kabyle, and writing a feminine for them would be inventing one.
color =
    .black =
        { $gender ->
            [f] taberkant
           *[m] aberkan
        }
    .white =
        { $gender ->
            [f] tamellalt
           *[m] amellal
        }
    .gray = rmadi
    .red =
        { $gender ->
            [f] tazeggaɣt
           *[m] azeggaɣ
        }
    .orange = purtuqali
    .yellow =
        { $gender ->
            [f] tawraɣt
           *[m] awraɣ
        }
    .green =
        { $gender ->
            [f] tazegzawt
           *[m] azegzaw
        }
    .cyan = siyan
    .blue =
        { $gender ->
            [f] tanilit
           *[m] anili
        }
    .purple = purpuri
    .pink = wardi
    .brown = qahwi
line-width =
    .thick =
        { $gender ->
            [f] tazurant
           *[m] azuran
        }
    .thin =
        { $gender ->
            [f] tarqaqt
           *[m] arqaq
        }
# Prepositional phrases rather than adjectives, so that they agree with nothing
# and can close the description. The nouns inside them are already in the
# annexed state «s» governs.
line-style =
    .dashed = s tegzumin
    .dotted = s tenqiḍin
# Written in the annexed state, because every place these words are placed puts
# them behind «s»; see this file's header.
fill-style =
    .horizontal = yizirigen iglayanen
    .vertical = yizirigen ibedden
    .diagonal = yizirigen izgen
    .backdiagonal = yizirigen izgen s tama nniḍen
    .dots = tenqiḍin
    .diamonds = telmasin
noun =
    .line = izirig
    .line-segment = agzum n yizirig
    .ray = azrar
    .vector = avektur
    .curve = izirig aknan
    .function = tawuri
    .parabola = tapirabult
    .polyline = izirig n yigzumen
    .polygon = ameggetsdis
    .triangle = akraḍiran
    .rectangle = amkuẓ azeglan
    .circle = tawinest
    .region = tamnaḍt
    .point = tanqiḍt
    .square = amkuẓ
    .diamond = talmast
    .cross = amgrid
    .plus = azamul n urnu
# The side count is a complement introduced by «s», so it follows the whole
# phrase rather than opening it, and the noun inside it is annexed.
#
# «amectu» is the word `locales/zgh` and `locales/shi` use for *regular* here.
# It is written rather than «aɣbalu», which this catalog already uses for
# *source* in `collect-no-source` and which would read as "source polygon".
noun-regular-polygon =
    { $part ->
        [tail] s { $numSides } n yidisan
       *[head] ameggetsdis amectu
    }
# The grammatical gender of the noun being described. Masculine is the default
# and the gender a loanword takes, which is what an author's own
# `markerStyleWord` is as far as this catalog is concerned.
noun-gender =
    { $noun ->
        [function] f
        [circle] f
        [region] f
        [point] f
        [diamond] f
        [border] f
        [parabola] f
       *[other] m
    }

## Style composition

# The dash pattern is an «s …» phrase and closes the description, so it moves
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
        [f] teččuṛ
       *[m] iččuṛ
    }
# Every branch that places `$pattern` puts it behind «s», which is what lets
# `fill-style` write one annexed form apiece.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } s { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } s { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } s { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «tama» is feminine, so the border's adjectives agree with it rather than with
# the shape it surrounds, and it stands here in the annexed state «s» governs.
# Kabyle has no indefinite article, so the two `-article` branches read like
# their neighbours.
style-border-clause =
    { $parts ->
        [with-article] s tema { $border }
        [and] d tema { $border }
        [and-article] d tema { $border }
       *[with] s tema { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $color } s { $pattern }
       *[plain] { $color }
    }
style-unfilled = ur yeččuṛ ara
# «ugilal» is «agilal» in the annexed state, which «ɣef» governs.
style-text =
    { $parts ->
        [background] { $color } ɣef ugilal { $background }
       *[plain] { $color }
    }
style-background-none = ulac

## Boolean words

boolean-true = tidet
boolean-false = lekdeb

## Answer buttons

answer-submit-label = Senqed Ammud
answer-submit-label-no-correctness = Azen Tiririt

## Sectional blocks

section-name =
    .activity = Armud
    .aside = Tamerna
    .cascade = Adeg
    .definition = Tabadut
    .example = Amedya
    .exercise = Tazrawt
    .exercises = Tizrawin
    .given-answer = Tiririt
    .note = Tazmilt
    .objectives = Iswiyen
    .paragraphs = Iferdisen
    .part = Aḥric
    .problem = Ugur
    .problems = Uguren
    .proof = Asenqed
    .question = Asteqsi
    .section = Tigezmi
    .solution = Tifrat
    .task = Ammud
    .theorem = Aḥric usnan
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Talɣut

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tafelwit { $enumeration }
        [numbered-title] Tafelwit { $enumeration }{ ": " }
        [unnumbered-title] Tafelwit{ ": " }
       *[unnumbered] Tafelwit
    }
figure-name =
    { $parts ->
        [numbered] Tugna { $enumeration }
        [numbered-caption] Tugna { $enumeration }{ ": " }
        [unnumbered-caption] Tugna{ ": " }
       *[unnumbered] Tugna
    }

## Paginator controls

paginator-previous = Uzwir
paginator-next = Uḍfir
paginator-page = Asebter
paginator-page-status = { $pageLabel } { $currentPage } seg { $numPages }

## Piecewise functions

piecewise-condition-or = neɣ
piecewise-condition-if = ma yella
piecewise-condition-otherwise = neɣ mulac

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Algeria teaches secondary science in Arabic, with
## French in the university years; Tamazight is taught as a subject rather than
## used as a medium, so a Kabyle speaker meets the periodic table in one of
## those two and the fallback *is* the curriculum. That is the same sentence
## `locales/zgh` and `locales/shi` earn on the other side of the border, in a
## school system that answers the same way.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Azamul akimyan arameɣtu
chemistry-invalid-ionic-compound = Asdukkel ayunan arameɣtu
