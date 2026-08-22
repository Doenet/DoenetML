# Rundi content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The directory is `rn` rather than `run` because `Intl.getCanonicalLocales`
# rewrites `run` to `rn` before negotiation is ever reached, the service it
# already performs for `iw`, `in` and `tl`. A hand-typed `<document lang="run">`
# lands here on its own and needs no alias.
#
# `rn` is Ikirundi, Burundi's national language, and it sits beside
# `locales/rw` as `locales/hr` sits beside `locales/sr`: two standard languages
# a speaker of either can read, each with its own orthography, and so each
# writing its own table rather than one deriving from the other. Two of the
# differences run through this whole file and are the quickest way to check it:
# Kinyarwanda's ⟨cy⟩ is Kirundi's ⟨c⟩ — «cera» here for «cyera» there — and
# Kinyarwanda's class-8 ⟨by⟩ is Kirundi's ⟨vy⟩, which is why `boolean-true` is
# «ni vyo» and not «ni byo». The vocabulary differs in places the sound changes
# do not predict: an answer is «inyishu» here and «igisubizo» there.
#
# `$gender` is the noun **class**, as in every Bantu catalog here, and
# `noun-gender` answers `c3`, `c5`, `c7` or `c9`. Two concord sets, as in
# Kinyarwanda, and which set a word takes is a fact about the word:
#
#   adjective concord (-nini, -to)     c3 mu-  c5 ri-  c7 ki-/gi-  c9 n-
#   subject concord (the verbs)        c3 u-/w-  c5 ri-/ry-  c7 ki-/c-  c9 i-/y-
#
# The prefix changes shape against the stem it lands on — ki- + tukura is
# «gitukura» but ki- + irabura is «cirabura» — so each word's four forms are
# written out rather than derived.
#
# The colours that are not verbs are named with the associative particle, as
# `locales/rw` writes them: «w'icatsi» carries the class the same way
# «utukura» does. `backgroundColor` reporting «y'icatsi» on its own is the
# price, and it is the price `locales/sw` refuses and `locales/rw` pays; this
# catalog stays with its sister so that the two can be read against each other.
#
# Describing words follow the noun, so the composition messages put the noun
# first. `$role` goes unused: Kirundi marks no case.


## Style vocabulary

color =
    .black =
        { $gender ->
            [c3] wirabura
            [c5] ryirabura
            [c7] cirabura
           *[c9] yirabura
        }
    .white =
        { $gender ->
            [c3] wera
            [c5] ryera
            [c7] cera
           *[c9] yera
        }
    .gray =
        { $gender ->
            [c3] w'iminyota
            [c5] ry'iminyota
            [c7] c'iminyota
           *[c9] y'iminyota
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
            [c7] c'icunga
           *[c9] y'icunga
        }
    .yellow =
        { $gender ->
            [c3] w'umuhondo
            [c5] ry'umuhondo
            [c7] c'umuhondo
           *[c9] y'umuhondo
        }
    .green =
        { $gender ->
            [c3] w'icatsi
            [c5] ry'icatsi
            [c7] c'icatsi
           *[c9] y'icatsi
        }
    .cyan =
        { $gender ->
            [c3] wa sayani
            [c5] rya sayani
            [c7] ca sayani
           *[c9] ya sayani
        }
    .blue =
        { $gender ->
            [c3] w'ubururu
            [c5] ry'ubururu
            [c7] c'ubururu
           *[c9] y'ubururu
        }
    .purple =
        { $gender ->
            [c3] w'umuyugubwe
            [c5] ry'umuyugubwe
            [c7] c'umuyugubwe
           *[c9] y'umuyugubwe
        }
    .pink =
        { $gender ->
            [c3] wa pingi
            [c5] rya pingi
            [c7] ca pingi
           *[c9] ya pingi
        }
    .brown =
        { $gender ->
            [c3] w'ikawa
            [c5] ry'ikawa
            [c7] c'ikawa
           *[c9] y'ikawa
        }
# The adjective concord, which is not the concord the verbs above take.
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
# Written as an invariable «w'…» phrase that agrees with nothing, so it can
# close the description; `style-stroke` puts it last for that reason.
line-style =
    .dashed = w'udukona
    .dotted = w'ududomo
fill-style =
    .horizontal = imirongo iryamye
    .vertical = imirongo ihagaze
    .diagonal = imirongo iciye ku ruhande
    .backdiagonal = imirongo iciye ku rundi ruhande
    .dots = ududomo
    .diamonds = amadiyama
noun =
    .line = umurongo
    .line-segment = igice c'umurongo
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
    .plus = ikimenyetso co kwongerako
# The side count is a relative and closes the noun phrase behind the describing
# words rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] ifise impande { $numSides }
       *[head] ishusho ingana impande
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
        [text] c3
        [line-segment] c7
        [plus] c7
        [diamond] c5
       *[other] c9
    }

## Style composition

# The dash pattern is an invariable «w'…» phrase and closes the description, so
# it moves behind the colour rather than sitting between the width and it.
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
        [c7] cuzuye
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
# shape it surrounds. Kirundi has no article and joins a complement with the
# invariable «hamwe n'», so all four branches read alike.
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
        [background] { $color } ku nyuma { $background }
       *[plain] { $color }
    }
style-background-none = nta na kimwe

## Boolean words

boolean-true = ni vyo
boolean-false = si vyo

## Answer buttons

answer-submit-label = Genzura Igikorwa
answer-submit-label-no-correctness = Rungika Inyishu

## Sectional blocks

section-name =
    .activity = Igikorwa
    .aside = Icongerwako
    .cascade = Urutonde
    .definition = Insobanuro
    .example = Akarorero
    .exercise = Umwimenyerezo
    .exercises = Imyimenyerezo
    .given-answer = Inyishu
    .note = Icitonderwa
    .objectives = Imigambi
    .paragraphs = Ingingo
    .part = Igice
    .problem = Ikibazo
    .problems = Ibibazo
    .proof = Icemezo
    .question = Ikibazo
    .section = Igika
    .solution = Umuti
    .task = Igikorwa
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
hint-title = Akaboko

## Tables and figures

table-name =
    { $parts ->
        [numbered] Urutonde { $enumeration }
        [numbered-title] Urutonde { $enumeration }{ ": " }
        [unnumbered-title] Urutonde{ ": " }
       *[unnumbered] Urutonde
    }
figure-name =
    { $parts ->
        [numbered] Ishusho { $enumeration }
        [numbered-caption] Ishusho { $enumeration }{ ": " }
        [unnumbered-caption] Ishusho{ ": " }
       *[unnumbered] Ishusho
    }

## Paginator controls

paginator-previous = Iheruka
paginator-next = Ikurikira
paginator-page = Urupapuro
paginator-page-status = { $pageLabel } { $currentPage } kuri { $numPages }

## Piecewise functions

piecewise-condition-or = canke
piecewise-condition-if = igihe
piecewise-condition-otherwise = ahandi hose

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Burundi teaches secondary science in French, so a
## Kirundi speaker meets the periodic table there and the fallback *is* the
## curriculum.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Ikimenyetso ca Shimi Kitari Co
chemistry-invalid-ionic-compound = Ivanga ry'Ayoni Ritari Ryo
