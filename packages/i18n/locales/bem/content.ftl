# Bemba content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `bem` is Ichibemba, Zambia's largest language and one of its seven official
# regional languages. The roster reads "Bemba (Ichibemba)" — CLDR knows both
# names, and they are one language.
#
# `$gender` is the noun **class**, as in every Bantu catalog here, and
# `noun-gender` answers `c3`, `c5`, `c7` or `c9`. Bemba writes the class twice
# on a describing word — the noun's own prefix and then the concord — and this
# file writes the whole of each form rather than deriving it:
#
#            c3 (umu-)    c5 (ili-)    c7 (ici-)    c9 (in-)
#   -fiita    umufiita     ilifiita     icifiita     imfiita
#   -buuta    umubuuta     ilibuuta     icibuuta     imbuuta
#   -kashika  umukashika   ilikashika   icikashika   inkashika
#   -kulu     umukulu      ilikulu      icikulu      inkulu
#   -nono     umunono      ilinono      icinono      innono
#
# Only the three colours with a native stem take the concord; the rest are
# nouns, written bare for `locales/sw`'s reason — the associative particle that
# would join them attributively is ungrammatical in the standalone position
# `backgroundColor` reports them in, and `$role` cannot tell the two apart.
#
# Class 6 is absent because no noun the core names reaches it; see
# `locales/zu`'s header for the reachability rule.
#
# `c9` is the default and the class a loanword joins, which is what an author's
# own `markerStyleWord` is as far as this catalog is concerned.
#
# Describing words follow the noun, so the composition messages put the noun
# first. `$role` goes unused: Bemba marks no case.
#
# The mathematical nouns are the first thing to check: «umutalale»,
# «icizingulushi» and «umusalaba» are Bemba words, and the rest are adapted
# loans this seed had nothing else to reach for, which is the usual shape for
# a language whose secondary mathematics is taught in English.


## Style vocabulary

# Only the three with a native stem inflect.
color =
    .black =
        { $gender ->
            [c3] umufiita
            [c5] ilifiita
            [c7] icifiita
           *[c9] imfiita
        }
    .white =
        { $gender ->
            [c3] umubuuta
            [c5] ilibuuta
            [c7] icibuuta
           *[c9] imbuuta
        }
    .gray = imfuufu
    .red =
        { $gender ->
            [c3] umukashika
            [c5] ilikashika
            [c7] icikashika
           *[c9] inkashika
        }
    .orange = malanshi
    .yellow = insalu ya kaseeba
    .green = iciteete
    .cyan = sayani
    .blue = bulu
    .purple = papulo
    .pink = pingi
    .brown = burauni

line-width =
    .thick =
        { $gender ->
            [c3] umukulu
            [c5] ilikulu
            [c7] icikulu
           *[c9] inkulu
        }
    .thin =
        { $gender ->
            [c3] umunono
            [c5] ilinono
            [c7] icinono
           *[c9] innono
        }

# Written as an invariable «na …» phrase, so that it agrees with nothing and
# can close the phrase. `style-stroke` puts it last for that reason.
line-style =
    .dashed = na tuputule
    .dotted = na tundoti

fill-style =
    .horizontal = imitalale iyalaala
    .vertical = imitalale iyaiminina
    .diagonal = imitalale iyaselemuka
    .backdiagonal = imitalale iyaselemuka ku lubali lumbi
    .dots = tundoti
    .diamonds = tudayamondi

noun =
    .line = umutalale
    .line-segment = icipande ca mutalale
    .ray = mushinshi
    .vector = vekita
    .curve = umutalale wapindama
    .function = incito
    .parabola = parabola
    .polyline = umutalale wa fipande
    .polygon = icimo ca mbali ishingi
    .triangle = icamabali yatatu
    .rectangle = icamabali yane
    .circle = icizingulushi
    .region = incende
    .point = poyinti
    .square = iskwele
    .diamond = dayamondi
    .cross = umusalaba
    .plus = icishibilo ca kulundapo

# The side count is a relative complement and closes the noun phrase behind the
# describing words rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] icakwata amabali { $numSides }
       *[head] icimo icalingana
    }

# The noun class. `c9` is the default and the class of every loanword.
noun-gender =
    { $noun ->
        [line] c3
        [curve] c3
        [polyline] c3
        [ray] c3
        [cross] c3
        [border] c3
        [line-segment] c7
        [polygon] c7
        [regular-polygon] c7
        [triangle] c7
        [rectangle] c7
        [circle] c7
        [square] c7
        [plus] c7
        [text] c7
        [fill] c7
       *[other] c9
    }


## Style composition

# The dash pattern is a «na …» phrase and closes the description, so it moves
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
        [c3] uwaisula
        [c5] ilyaisula
        [c7] icaisula
       *[c9] iyaisula
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

# «umupaka» is class 3 and leads its own describing words, so the border's
# words agree with it rather than with the shape it surrounds. Bemba has no
# article and joins this clause with the invariable «na», so all four branches
# read alike.
style-border-clause =
    { $parts ->
        [with-article] na umupaka { $border }
        [and] na umupaka { $border }
        [and-article] na umupaka { $border }
       *[with] na umupaka { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = tacaisula

style-text =
    { $parts ->
        [background] { $color } pa cishinte { $background }
       *[plain] { $color }
    }

style-background-none = takuli cintu


## Boolean words

boolean-true = cine
boolean-false = bufi


## Answer buttons

answer-submit-label = Ceeceta Incito
answer-submit-label-no-correctness = Tuma Icasuko


## Sectional blocks

section-name =
    .activity = Incito
    .aside = Icalundwapo
    .cascade = Ubwiko
    .definition = Ubulondoloshi
    .example = Icilangililo
    .exercise = Ukuiteyanya
    .exercises = Ukuiteyanya
    .given-answer = Icasuko
    .note = Icalembwa
    .objectives = Ifilekwa
    .paragraphs = Ifikomo
    .part = Icipande
    .problem = Ubwafya
    .problems = Amafya
    .proof = Ubunte
    .question = Icipusho
    .section = Icipandwa
    .solution = Ukupwisha
    .task = Incito
    .theorem = Tiyoremu

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Akalangililo


## Tables and figures

table-name =
    { $parts ->
        [numbered] Itebulo { $enumeration }
        [numbered-title] Itebulo { $enumeration }{ ": " }
        [unnumbered-title] Itebulo{ ": " }
       *[unnumbered] Itebulo
    }

figure-name =
    { $parts ->
        [numbered] Icikope { $enumeration }
        [numbered-caption] Icikope { $enumeration }{ ": " }
        [unnumbered-caption] Icikope{ ": " }
       *[unnumbered] Icikope
    }


## Paginator controls

paginator-previous = Icapitapo
paginator-next = Icakonkapo
paginator-page = Ibula

paginator-page-status = { $pageLabel } { $currentPage } muli { $numPages }


## Piecewise functions

piecewise-condition-or = nangu

piecewise-condition-if = nga

piecewise-condition-otherwise = nga te fyo


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Zambia teaches secondary science in English, so a
## Bemba speaker meets the periodic table there and the fallback *is* the
## curriculum.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Icishibilo ca Kemikolo Icabipa
chemistry-invalid-ionic-compound = Ukusakanya kwa Ayoni Ukwabipa
