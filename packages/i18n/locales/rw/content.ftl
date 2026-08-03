# Kinyarwanda content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Kinyarwanda reads `$gender` as the noun **class**, as `locales/sw`,
# `locales/zu`, `locales/xh` and `locales/ny` do. `noun-gender` answers `c3`,
# `c5`, `c7` or `c9`, and every describing word selects on it. There is no
# `c6` here: none of the nouns this catalog names lands in that class, and a
# token nothing answers is a branch nothing reaches.
#
# Two concord sets, as in Zulu, and again which set a word takes is a fact
# about the word:
#
#   adjective concord (-nini, -to)          c3 mu-  c5 ri-  c7 ki-/gi-  c9 n-
#   subject concord (the verbs: -tukura, -era, -uzuye)  c3 u-/w-  c5 ri-/ry-  c7 ki-/cy-/gi-  c9 i-/y-
#
# The prefix changes shape against the stem it lands on — ki- + tukura is
# «gitukura» but ki- + irabura is «cyirabura» — so each word's four forms are
# written out rather than derived.
#
# Where Swahili leaves an invariable colour noun bare, Kinyarwanda writes the
# associative particle in: only three colours are verbs, and the rest are named
# with «icyatsi», «umuhondo» and their like, which do not read as colours
# without it. So «w'icyatsi» carries the class the same way «utukura» does, and
# `backgroundColor` reporting «y'icyatsi» on its own is the price — the same
# shape Swahili's header describes and comes down on the other side of.
#
# Describing words follow the noun; `$role` goes unused.


## Style vocabulary

color =
    .black =
        { $gender ->
            [c3] wirabura
            [c5] ryirabura
            [c7] cyirabura
           *[c9] yirabura
        }
    .white =
        { $gender ->
            [c3] wera
            [c5] ryera
            [c7] cyera
           *[c9] yera
        }
    .gray =
        { $gender ->
            [c3] w'ivu
            [c5] ry'ivu
            [c7] cy'ivu
           *[c9] y'ivu
        }
    .red =
        { $gender ->
            [c3] utukura
            [c5] ritukura
            [c7] gitukura
           *[c9] itukura
        }
    .orange =
        { $gender ->
            [c3] w'icunga
            [c5] ry'icunga
            [c7] cy'icunga
           *[c9] y'icunga
        }
    .yellow =
        { $gender ->
            [c3] w'umuhondo
            [c5] ry'umuhondo
            [c7] cy'umuhondo
           *[c9] y'umuhondo
        }
    .green =
        { $gender ->
            [c3] w'icyatsi
            [c5] ry'icyatsi
            [c7] cy'icyatsi
           *[c9] y'icyatsi
        }
    .cyan =
        { $gender ->
            [c3] w'ubururu bw'icyatsi
            [c5] ry'ubururu bw'icyatsi
            [c7] cy'ubururu bw'icyatsi
           *[c9] y'ubururu bw'icyatsi
        }
    .blue =
        { $gender ->
            [c3] w'ubururu
            [c5] ry'ubururu
            [c7] cy'ubururu
           *[c9] y'ubururu
        }
    .purple =
        { $gender ->
            [c3] w'umuyugubwe
            [c5] ry'umuyugubwe
            [c7] cy'umuyugubwe
           *[c9] y'umuyugubwe
        }
    .pink =
        { $gender ->
            [c3] w'umuhengeri
            [c5] ry'umuhengeri
            [c7] cy'umuhengeri
           *[c9] y'umuhengeri
        }
    .brown =
        { $gender ->
            [c3] w'ikawa
            [c5] ry'ikawa
            [c7] cy'ikawa
           *[c9] y'ikawa
        }

# True adjectives, and so the adjective concord rather than the subject one.
line-width =
    .thick =
        { $gender ->
            [c3] munini
            [c5] rinini
            [c7] kinini
           *[c9] nini
        }
    .thin =
        { $gender ->
            [c3] muto
            [c5] rito
            [c7] gito
           *[c9] nto
        }

# An invariable «ufite …» phrase — "having …" — so that it agrees with nothing
# and can close the description. `style-stroke` puts it last for that reason.
line-style =
    .dashed = ufite uduce
    .dotted = ufite udutonyanga

fill-style =
    .horizontal = imirongo iryamye
    .vertical = imirongo ihagaze
    .diagonal = imirongo iberamye
    .backdiagonal = imirongo iberamye ku ruhande rundi
    .dots = udutonyanga
    .diamonds = amadiyama

noun =
    .line = umurongo
    .line-segment = igice cy'umurongo
    .ray = umurasire
    .vector = vegiteri
    .curve = umuzingo
    .function = fonksiyo
    .parabola = parabola
    .polyline = umurongo w'ibice
    .polygon = ishusho y'impande nyinshi
    .triangle = mpandeshatu
    .rectangle = urukiramende
    .circle = uruziga
    .region = akarere
    .point = akadomo
    .square = kare
    .diamond = idiyama
    .cross = umusaraba
    .plus = ikimenyetso cyo kongeramo

# The side count goes in the tail, behind the describing words: Kinyarwanda
# closes a noun phrase with a relative rather than opening one with it.
noun-regular-polygon =
    { $part ->
        [tail] ifite impande { $numSides }
       *[head] ishusho ingana impande
    }

noun-gender =
    { $noun ->
        [line] c3
        [ray] c3
        [curve] c3
        [polyline] c3
        [cross] c3
        [border] c3
        [text] c3
        [line-segment] c7
        [plus] c7
        [diamond] c5
       *[other] c9
    }


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

style-filled-word =
    { $gender ->
        [c3] wuzuye
        [c5] ryuzuye
        [c7] cyuzuye
       *[c9] yuzuye
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } hamwe na { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } hamwe na { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } hamwe na { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «umupaka» is class 3, so the border's words agree with it and not with the
# shape it surrounds. Kinyarwanda has no article and joins a complement with
# the invariable «hamwe n'», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] hamwe n'umupaka { $border }
        [and] hamwe n'umupaka { $border }
        [and-article] hamwe n'umupaka { $border }
       *[with] hamwe n'umupaka { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = ntiyuzuye

style-text =
    { $parts ->
        [background] { $color } ku mbuganyuma { $background }
       *[plain] { $color }
    }

style-background-none = nta na kimwe


## Boolean words

boolean-true = ni byo
boolean-false = si byo


## Answer buttons

answer-submit-label = Genzura Umurimo
answer-submit-label-no-correctness = Ohereza Igisubizo


## Sectional blocks

section-name =
    .activity = Igikorwa
    .aside = Icyongerwaho
    .cascade = Urutonde
    .definition = Ubusobanuro
    .example = Urugero
    .exercise = Umwitozo
    .exercises = Imyitozo
    .given-answer = Igisubizo
    .note = Icyitonderwa
    .objectives = Intego
    .paragraphs = Ingingo
    .part = Igice
    .problem = Ikibazo
    .problems = Ibibazo
    .proof = Igihamya
    .question = Ikibazo
    .section = Igika
    .solution = Igisubizo
    .task = Umurimo
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

hint-title = Inama


## Tables and figures

table-name =
    { $parts ->
        [numbered] Imbonerahamwe { $enumeration }
        [numbered-title] Imbonerahamwe { $enumeration }{ ": " }
        [unnumbered-title] Imbonerahamwe{ ": " }
       *[unnumbered] Imbonerahamwe
    }

figure-name =
    { $parts ->
        [numbered] Ishusho { $enumeration }
        [numbered-caption] Ishusho { $enumeration }{ ": " }
        [unnumbered-caption] Ishusho{ ": " }
       *[unnumbered] Ishusho
    }


## Paginator controls

paginator-previous = Ibanza
paginator-next = Ikurikira
paginator-page = Urupapuro

paginator-page-status = { $pageLabel } { $currentPage } kuri { $numPages }


## Piecewise functions

piecewise-condition-or = cyangwa
piecewise-condition-if = niba
piecewise-condition-otherwise = ubundi


## Chemistry

# Kinyarwanda is one of the catalogs that leaves `element-name` and
# `element-anion-name` out, so those 130 keys fall back to English. Rwandan
# secondary chemistry is taught in English, and there is no settled Kinyarwanda
# list of the elements to seed from — the fallback here is what a learner meets
# in their own textbook.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ikimenyetso cya Shimi Kitemewe
chemistry-invalid-ionic-compound = Umuvange wa Ayoni Utemewe
