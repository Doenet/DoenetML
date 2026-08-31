# Romani (Romani čhib) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **`rom` is a macrolanguage tag** covering Vlax, Balkan, Carpathian, Sinte,
# Kalo and more. **The written norm here is closest to Vlax Romani**, and
# regional varieties differ in lexicon and in inflection. Do not use `rmy` for
# a Vlax deployment: it canonicalises to `rom`.
#
# **Script and orthography.** Latin script, in the **standardised international
# Romani orthography in the Hancock line** — `č š ž`, the aspirates `čh ph th
# kh`, `x` and `ř`. **Courthiade's morpho-graphs (`θ ç q ǰ`) are deliberately
# not used.** See `chrome.ftl` for the full note.
#
# **What is the language's own**: «si» / «naj», «thaj», «vaj», «te», «bi-» as
# a privative prefix, and the words that carry the descriptions — «thulo»
# (thick), «sano» (thin), «phaglo» ('broken', used here for a dashed stroke),
# «pherdo» (filled, from *pherel*), «kalo», «parno», «lolo», «rig» (side →
# border), «trušul» (cross), «kotor» (part), «buti» (task), «pučipe»
# (question), «patrin» (leaf → page), «čačo» / «xoxavno» (true / false).
#
# **What is borrowed, and from where**: the geometry — «vektoro», «funkcia»,
# «parabola», «krugo», «kvadrato», «poligono», «segmento», «intervalo» — is
# international Latin-Romance stock, which is what the Romani Union's standard
# and Romani-language teaching material use for this register. Romani has no
# geometry vocabulary of its own and this seed does not pretend otherwise.
# «punktisardo» for *dotted* is a loan stem with a Romani participle on it and
# is a coinage; a reviewer should check it first.
#
# **Counts.** CLDR has **no plural data for `rom`**, so no plural category can
# be selected: there is **no** `[zero]`, `[one]`, `[two]`, `[few]` or `[many]`
# branch anywhere in this file. Nothing here counts, so nothing is lost.
#
# **Digits.** Every number renders in Latin digits.
#
# **Adjective order and agreement.** Romani puts the attributive adjective
# **before** the noun, and **this catalog really agrees them**: an adjective in
# `-o` takes `-o` with a masculine noun and `-i` with a feminine one, which is
# Romani's own rule and not English's. «thuli phagli loli linia» is a feminine
# phrase throughout because «linia» is feminine; the same description of a
# «punkto» would read «thulo phaglo lolo punkto». **Romani has no neuter**, so
# `noun-gender` below answers only `m` or `f` and no adjective here carries an
# `n` branch.
#
# The second axis is case. Every adjective selects on `$role` first:
#
#   standalone          nominative, and then `$gender`: «loli», «lolo»
#   border-clause       before the instrumental «rigasa», so the oblique
#                       plural-and-oblique ending `-e`, the same for both
#                       genders: «jekha lole rigasa»
#   background-clause   before «fundo» after the preposition «pe», oblique
#                       again: `-e`
#   text-clause         not listed, so it falls to `standalone` and agrees
#                       with «teksto», which is masculine
#
# The oblique `-e` is Romani's own syncretism, not a simplification: the
# oblique singular and the plural of an `-o` adjective are the same form.
#
# **The periodic table is left to fall back to English.** `element-name` and
# `element-anion-name` are deliberately absent. There is no published Romani
# list of the 118 elements — not in any variety, and not from the
# standardisation effort — and inventing 130 element names would be the
# opposite of what this seed is for. Romani-speaking pupils meet the periodic
# table in the state language they are schooled in, which is Romanian,
# Hungarian, Slovak, Serbian, Bulgarian, Spanish or another depending on where
# they live; a reviewer should copy the list from that language deliberately
# rather than from English.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] kale
            [background-clause] kale
           *[standalone]
                { $gender ->
                    [f] kali
                   *[m] kalo
                }
        }
    .white =
        { $role ->
            [border-clause] parne
            [background-clause] parne
           *[standalone]
                { $gender ->
                    [f] parni
                   *[m] parno
                }
        }
    .gray =
        { $role ->
            [border-clause] sive
            [background-clause] sive
           *[standalone]
                { $gender ->
                    [f] sivi
                   *[m] sivo
                }
        }
    .red =
        { $role ->
            [border-clause] lole
            [background-clause] lole
           *[standalone]
                { $gender ->
                    [f] loli
                   *[m] lolo
                }
        }
    .orange =
        { $role ->
            [border-clause] oranže
            [background-clause] oranže
           *[standalone]
                { $gender ->
                    [f] oranži
                   *[m] oranžo
                }
        }
    .yellow =
        { $role ->
            [border-clause] galbene
            [background-clause] galbene
           *[standalone]
                { $gender ->
                    [f] galbeni
                   *[m] galbeno
                }
        }
    .green =
        { $role ->
            [border-clause] zelene
            [background-clause] zelene
           *[standalone]
                { $gender ->
                    [f] zeleni
                   *[m] zeleno
                }
        }
    .cyan =
        { $role ->
            [border-clause] cijane
            [background-clause] cijane
           *[standalone]
                { $gender ->
                    [f] cijani
                   *[m] cijano
                }
        }
    .blue =
        { $role ->
            [border-clause] vunete
            [background-clause] vunete
           *[standalone]
                { $gender ->
                    [f] vuneti
                   *[m] vuneto
                }
        }
    .purple =
        { $role ->
            [border-clause] violete
            [background-clause] violete
           *[standalone]
                { $gender ->
                    [f] violeti
                   *[m] violeto
                }
        }
    .pink =
        { $role ->
            [border-clause] roze
            [background-clause] roze
           *[standalone]
                { $gender ->
                    [f] rozi
                   *[m] rozo
                }
        }
    .brown =
        { $role ->
            [border-clause] brunave
            [background-clause] brunave
           *[standalone]
                { $gender ->
                    [f] brunavi
                   *[m] brunavo
                }
        }
line-width =
    .thick =
        { $role ->
            [border-clause] thule
            [background-clause] thule
           *[standalone]
                { $gender ->
                    [f] thuli
                   *[m] thulo
                }
        }
    .thin =
        { $role ->
            [border-clause] sane
            [background-clause] sane
           *[standalone]
                { $gender ->
                    [f] sani
                   *[m] sano
                }
        }
line-style =
    .dashed =
        { $role ->
            [border-clause] phagle
            [background-clause] phagle
           *[standalone]
                { $gender ->
                    [f] phagli
                   *[m] phaglo
                }
        }
    .dotted =
        { $role ->
            [border-clause] punktisarde
            [background-clause] punktisarde
           *[standalone]
                { $gender ->
                    [f] punktisardi
                   *[m] punktisardo
                }
        }
# These are **instrumental plurals**, because every place they are used is
# behind English's "with": «pherdo lolo rombonenca» is "filled red with
# diamonds". Romani says "with" with a case ending rather than a preposition,
# so the ending is on these words and the composition messages below carry no
# preposition at all. The adjective in front of an oblique plural noun takes
# `-e`, which is why they read «horizontale», not «horizontalo».
fill-style =
    .horizontal = horizontale linienca
    .vertical = vertikale linienca
    .diagonal = diagonale linienca
    .backdiagonal = palutne diagonale linienca
    .dots = punktenca
    .diamonds = rombonenca
noun =
    .line = linia
    .line-segment = segmento
    .ray = raza
    .vector = vektoro
    .curve = kurba
    .function = funkcia
    .slope-field = kampo la pantako
    .vector-field = kampo le vektorosko
    .parabola = parabola
    .polyline = polilinia
    .polygon = poligono
    .triangle = trianglo
    .rectangle = rektanglo
    .circle = krugo
    .region = regiono
    .point = punkto
    .square = kvadrato
    .diamond = rombo
    .cross = trušul
    .plus = plus-semno
# Romani counts the sides **after** the noun, with the instrumental plural
# «rigenca» ('with N sides'), so the noun splits: the head is what the
# adjectives agree with and stands beside them, and the count follows as the
# tail. This is the shape `locales/es` uses, and it is why the `-tail` variants
# of `style-with-noun` and `style-filled-with-noun` matter here.
noun-regular-polygon =
    { $part ->
        [tail] { $numSides } rigenca
       *[head] regulari poligono
    }
# **Romani has no neuter**: every noun is masculine or feminine, so this
# answers only `m` or `f` and no adjective above carries an `n` branch. Of the
# four heads a description builds without naming, «rig» (border) is feminine,
# and «pheripe» (fill), «teksto» (text) and «fundo» (background) are masculine
# — which is what the default answers, so only `border` needs a branch of its
# own. «regulari poligono» is masculine, and so is the head of every
# `-o` noun above.
noun-gender =
    { $noun ->
        [border] f
        [line] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
       *[other] m
    }

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
# The adjectives lead and the noun closes the phrase: «thuli phagli loli
# linia». The `-tail` variant carries the side count of a regular polygon,
# which Romani puts after the noun.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
# Only ever said of the shape itself, so it is standalone in every description
# and takes no `$role` branch — but it does agree, because «pherdo» is an
# ordinary `-o` adjective.
style-filled-word =
    { $gender ->
        [f] pherdi
       *[m] pherdo
    }
# No preposition before `{ $pattern }`: the pattern words are already
# instrumental plurals and carry the "with" themselves.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «rig» is feminine, so the border's adjectives agree with it and not with the
# shape it surrounds — and they stand before an instrumental, which is the
# `border-clause` branch of every adjective, a flat `-e` for both genders. The
# instrumental ending on «rigasa» is what carries English's "with", so there is
# no preposition; «jekha» is the oblique feminine article, which is how the two
# `-article` variants differ from the two without one.
style-border-clause =
    { $parts ->
        [with-article] jekha { $border } rigasa
        [and] thaj { $border } rigasa
        [and-article] thaj jekha { $border } rigasa
       *[with] { $border } rigasa
    }
# «pheripe» is masculine, which is the gender `noun-gender` answers for `fill`,
# so the colour agrees with it in both variants. The pattern is an instrumental
# plural and needs no preposition.
style-fill =
    { $parts ->
        [pattern] { $color } pheripe { $pattern }
       *[plain] { $color } pheripe
    }
# «bi-» is Romani's privative prefix, so this is "without a fill". Written flat
# rather than agreed, because it is reported on its own rather than beside a
# noun.
style-unfilled = bipheripnasko
# «pe» takes the oblique, which is the `background-clause` ending; the text
# colour beside it falls to `standalone` and agrees with «teksto», which is
# masculine.
style-text =
    { $parts ->
        [background] { $color } pe { $background } fundo
       *[plain] { $color }
    }
style-background-none = khanči

## Boolean words

boolean-true = čačo
boolean-false = xoxavno

## Answer buttons

answer-submit-label = Dikh e buti
answer-submit-label-no-correctness = Bičhal o phendipe

## Sectional blocks

section-name =
    .activity = Aktivitato
    .aside = Rigate
    .cascade = Kaskada
    .definition = Definicia
    .example = Eksemplo
    .exercise = Ekserciso
    .exercises = Eksercisura
    .given-answer = Phendipe
    .note = Notica
    .objectives = Objektivura
    .paragraphs = Paragrafura
    .part = Kotor
    .problem = Problemo
    .problems = Problemura
    .proof = Dokazo
    .question = Pučipe
    .section = Sekcia
    .solution = Solucia
    .task = Buti
    .theorem = Teoremo
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Sikavipe

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
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ": " }
        [unnumbered-caption] Figura{ ": " }
       *[unnumbered] Figura
    }

## Paginator controls

paginator-previous = Palpale
paginator-next = Angle
paginator-page = Patrin
paginator-page-status = { $pageLabel } { $currentPage } katar { $numPages }

## Piecewise functions

piecewise-condition-or = vaj
piecewise-condition-if = te
# The weakest word in this file. Romani has no settled adverb for "otherwise"
# in a mathematical sense; «aver» is 'other' pressed into the job. A reviewer
# should replace it with whatever their variety actually says.
piecewise-condition-otherwise = aver

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent: they fall
## back to English. There is no published Romani list of the 118 elements, and
## a Romani-speaking pupil meets the periodic table in the state language they
## are schooled in — Romanian, Hungarian, Slovak, Serbian, Bulgarian, Spanish
## — which is the parallel text a reviewer should copy from. See the header.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Bičačo chemiako simbolo
chemistry-invalid-ionic-compound = Bičači ioniko kombinacia

## Inputs embedded in math

math-embedded-input-blank = šušo than
math-embedded-input-blank-ordinal = šušo than { $ordinal } katar { $total }
