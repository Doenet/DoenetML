# Nyankole content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `nyn` is Runyankore, of south-western Uganda. The roster reads
# "Nyankole (Runyankore)" — CLDR knows both names, and they are one language.
#
# `$gender` is the noun **class**, as in every Bantu catalog here, and
# `noun-gender` answers `c3`, `c5`, `c7`, `c9` or `c12` — five classes, where
# `locales/lg` answers six and most of the group answers four. The fifth is the
# diminutive: «akadomo», the point, is class 12, which is where Ganda puts its
# point too, so the two files are worth reading against each other.
#
# Two concord sets, and which set a word takes is a fact about the word:
#
#   adjective concord (-hango, -kye)   c3 mu-  c5 ri-  c7 ki-  c9 e-  c12 ka-
#   associative particle (the colours) c3 w'   c5 ry'  c7 ky'  c9 y'  c12 k'
#
# The colours are nouns rather than adjectives, so they take the associative
# particle: «w'omukara» carries the class the same way «muhango» does. That is
# `locales/rw`'s and `locales/rn`'s decision rather than `locales/sw`'s, and it
# costs the same thing — `backgroundColor` reports «y'omukara» on its own,
# where the particle wants a head in front of it. `$role` cannot separate that
# citation position from the attributive one, so the two are written alike; see
# `locales/tpi`'s header for the same limit reached from the other side of the
# world.
#
# «omukara», «obwera», «eivu», «omutukura» and «ekiragara» are Runyankore
# words; the other seven colours are adapted loans this seed had nothing else
# to reach for. The mathematical nouns are the same mix, and are the first
# thing to check.
#
# Describing words follow the noun, so the composition messages put the noun
# first. `$role` goes unused: Runyankore marks no case.


## Style vocabulary

color =
    .black =
        { $gender ->
            [c3] w'omukara
            [c5] ry'omukara
            [c7] ky'omukara
            [c12] k'omukara
           *[c9] y'omukara
        }
    .white =
        { $gender ->
            [c3] w'obwera
            [c5] ry'obwera
            [c7] ky'obwera
            [c12] k'obwera
           *[c9] y'obwera
        }
    .gray =
        { $gender ->
            [c3] w'eivu
            [c5] ry'eivu
            [c7] ky'eivu
            [c12] k'eivu
           *[c9] y'eivu
        }
    .red =
        { $gender ->
            [c3] w'omutukura
            [c5] ry'omutukura
            [c7] ky'omutukura
            [c12] k'omutukura
           *[c9] y'omutukura
        }
    .orange =
        { $gender ->
            [c3] wa orenji
            [c5] rya orenji
            [c7] kya orenji
            [c12] ka orenji
           *[c9] ya orenji
        }
    .yellow =
        { $gender ->
            [c3] wa yero
            [c5] rya yero
            [c7] kya yero
            [c12] ka yero
           *[c9] ya yero
        }
    .green =
        { $gender ->
            [c3] w'ekiragara
            [c5] ry'ekiragara
            [c7] ky'ekiragara
            [c12] k'ekiragara
           *[c9] y'ekiragara
        }
    .cyan =
        { $gender ->
            [c3] wa sayani
            [c5] rya sayani
            [c7] kya sayani
            [c12] ka sayani
           *[c9] ya sayani
        }
    .blue =
        { $gender ->
            [c3] wa buruu
            [c5] rya buruu
            [c7] kya buruu
            [c12] ka buruu
           *[c9] ya buruu
        }
    .purple =
        { $gender ->
            [c3] wa paapuro
            [c5] rya paapuro
            [c7] kya paapuro
            [c12] ka paapuro
           *[c9] ya paapuro
        }
    .pink =
        { $gender ->
            [c3] wa pinki
            [c5] rya pinki
            [c7] kya pinki
            [c12] ka pinki
           *[c9] ya pinki
        }
    .brown =
        { $gender ->
            [c3] wa buraawuni
            [c5] rya buraawuni
            [c7] kya buraawuni
            [c12] ka buraawuni
           *[c9] ya buraawuni
        }

# The adjective concord, which is not the particle the colours take.
line-width =
    .thick =
        { $gender ->
            [c3] muhango
            [c5] rihango
            [c7] kihango
            [c12] kahango
           *[c9] ehango
        }
    .thin =
        { $gender ->
            [c3] mukye
            [c5] rikye
            [c7] kikye
            [c12] kakye
           *[c9] ekye
        }

# Written as an invariable «na …» phrase, so that it agrees with nothing and
# can close the description; `style-stroke` puts it last for that reason.
line-style =
    .dashed = na tubaraaza
    .dotted = na tudomo

fill-style =
    .horizontal = emirongo eyegamiire
    .vertical = emirongo eyemereire
    .diagonal = emirongo eyeserekera
    .backdiagonal = emirongo eyeserekera oruhande orundi
    .dots = tudomo
    .diamonds = amadaimonde

noun =
    .line = omurongo
    .line-segment = ekicweka ky'omurongo
    .ray = omurasho
    .vector = vekita
    .curve = omurongo ogugombire
    .function = fonkishoni
    .parabola = parabora
    .polyline = omurongo gw'ebicweka
    .polygon = ekishushani ky'empande nyingi
    .triangle = ekya mpande ishatu
    .rectangle = ekya mpande ina
    .circle = eriziga
    .region = ekicweka
    .point = akadomo
    .square = esikweya
    .diamond = edaimonde
    .cross = omusaraba
    .plus = ekimanyiso ky'okwongyeraho

# The side count is a relative and closes the noun phrase behind the describing
# words rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] ekiine empande { $numSides }
       *[head] ekishushani ekingana empande
    }

# The noun class. `c9` is the default and the class a loanword joins, which is
# what an author's own `markerStyleWord` is as far as this catalog is
# concerned.
noun-gender =
    { $noun ->
        [line] c3
        [ray] c3
        [curve] c3
        [polyline] c3
        [cross] c3
        [border] c3
        [circle] c5
        [diamond] c5
        [line-segment] c7
        [polygon] c7
        [regular-polygon] c7
        [triangle] c7
        [rectangle] c7
        [region] c7
        [plus] c7
        [text] c7
        [fill] c7
        [point] c12
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
        [c3] ogwijwire
        [c5] eryijwire
        [c7] ekyijwire
        [c12] akijwire
       *[c9] eyijwire
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

# «omupaka» is class 3, as `locales/rn`'s «umupaka» and `locales/lua`'s
# «mukalu» are, and it leads its own describing words, so they agree with it
# rather than with the shape it surrounds. Runyankore has no article and joins
# this clause with the invariable «na», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] n'omupaka { $border }
        [and] n'omupaka { $border }
        [and-article] n'omupaka { $border }
       *[with] n'omupaka { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = tikyijwire

style-text =
    { $parts ->
        [background] { $color } aha nyima { $background }
       *[plain] { $color }
    }

style-background-none = tihariho


## Boolean words

boolean-true = ni buzima
boolean-false = ti buzima


## Answer buttons

answer-submit-label = Cenderezamu Omurimo
answer-submit-label-no-correctness = Ohereza Eky'okugarukamu


## Sectional blocks

section-name =
    .activity = Omurimo
    .aside = Ekyongyeirweho
    .cascade = Orukurikirana
    .definition = Okushoboorora
    .example = Eky'okureeberaho
    .exercise = Okwetendeka
    .exercises = Okwetendeka
    .given-answer = Eky'okugarukamu
    .note = Ekyokwetegyereza
    .objectives = Ebigyendererwa
    .paragraphs = Ebicweka
    .part = Ekicweka
    .problem = Ekibazo
    .problems = Ebibazo
    .proof = Obujurizi
    .question = Ekibuuzo
    .section = Ekicweka
    .solution = Eky'okukiza
    .task = Omurimo
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

hint-title = Akamanyiso


## Tables and figures

table-name =
    { $parts ->
        [numbered] Etaburo { $enumeration }
        [numbered-title] Etaburo { $enumeration }{ ": " }
        [unnumbered-title] Etaburo{ ": " }
       *[unnumbered] Etaburo
    }

figure-name =
    { $parts ->
        [numbered] Ekishushani { $enumeration }
        [numbered-caption] Ekishushani { $enumeration }{ ": " }
        [unnumbered-caption] Ekishushani{ ": " }
       *[unnumbered] Ekishushani
    }


## Paginator controls

paginator-previous = Ekihweireho
paginator-next = Ekirikukuratsya
paginator-page = Orupapura

paginator-page-status = { $pageLabel } { $currentPage } aha { $numPages }


## Piecewise functions

piecewise-condition-or = nari

piecewise-condition-if = ku

piecewise-condition-otherwise = ahandi hoona


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Uganda teaches secondary science in English, so a
## Runyankore speaker meets the periodic table there and the fallback *is* the
## curriculum — the same answer `locales/lg` gives from the same ministry.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ekimanyiso kya Kemistule Ekitari Kyo
chemistry-invalid-ionic-compound = Enteeraniso y'Ayoni Etari Yo
