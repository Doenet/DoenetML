# Dagbani content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `dag` is Dagbani, of northern Ghana. CLDR carries no language name for it, so
# the roster reads its English name once rather than twice — the `ss`, `ve` and
# `ts` case again.
#
# `$gender` is a noun class and the concord is a **suffix**, as in
# `locales/mos`: Dagbani is Gur too, and the two files should be read against
# each other. What they do not share is how many classes the core's nouns
# reach. Mooré forks four ways here and Dagbani three, which is the Gur form of
# a fact the Bantu catalogs have shown nineteen times over — a class inventory
# is a fact about which nouns a catalog happens to name, not about a family.
#
# The tokens are this catalog's own, indexing Dagbani's suffix sets:
#
#            c1 (-li)    c2 (-ga)    c3 (-m)
#   sabin-    sabinli     sabinga     sabinim
#   piɛl-     piɛlli      piɛlga      piɛlim
#   ʒee-      ʒeeli       ʒeega       ʒeem
#   tita-     titali      titaga      titam
#   bil-      billi       bilga       bilim
#
# **A Dagbani noun phrase can also be compounded**, the noun dropping to its
# bare stem and the class suffix carried by the last modifier alone. This
# catalog writes the juxtaposed construction instead, for `locales/mos`'s
# reason and in its words: the last element of a description is often a
# placeable, and a suffix cannot be welded to a word the catalog never sees.
#
# The loanwords are the other thing to read beside `locales/mos`. Both
# catalogs borrow their mathematical vocabulary, and they borrow from different
# languages — Mooré from French and Dagbani from English — because a border
# runs between Burkina Faso and Ghana and the schools on either side of it
# teach in different languages. That is the same fact the chemistry paragraph
# at the foot of this file records, arriving in the vocabulary rather than in a
# gap.
#
# Describing words follow the noun. `$role` goes unused: Dagbani marks no case.


## Style vocabulary

# Only the three with a Dagbani stem inflect.
color =
    .black =
        { $gender ->
            [c2] sabinga
            [c3] sabinim
           *[c1] sabinli
        }
    .white =
        { $gender ->
            [c2] piɛlga
            [c3] piɛlim
           *[c1] piɛlli
        }
    .gray = tampiɛlim
    .red =
        { $gender ->
            [c2] ʒeega
            [c3] ʒeem
           *[c1] ʒeeli
        }
    .orange = ɔrenji
    .yellow = yɛlo
    .green = griin
    .cyan = sayan
    .blue = buluu
    .purple = pɔpul
    .pink = piŋk
    .brown = braun

line-width =
    .thick =
        { $gender ->
            [c2] titaga
            [c3] titam
           *[c1] titali
        }
    .thin =
        { $gender ->
            [c2] bilga
            [c3] bilim
           *[c1] billi
        }

# Written as an invariable «ni …» phrase, so that it agrees with nothing and
# can close the description; `style-stroke` puts it last for that reason. That
# is also what keeps the class suffix off the end of the phrase, where a
# placeable often stands.
line-style =
    .dashed = ni dasɛs
    .dotted = ni dɔts

fill-style =
    .horizontal = layinnima din doya
    .vertical = layinnima din ʒe
    .diagonal = layinnima din gbaai
    .backdiagonal = layinnima din gbaai luɣ' shɛli
    .dots = dɔts
    .diamonds = dayamɔnnima

noun =
    .line = layin
    .line-segment = layin sɛgmɛnti
    .ray = reyi
    .vector = vɛktɔ
    .curve = layin din gbaai
    .function = fɔnkshɔn
    .parabola = parabola
    .polyline = polilayin
    .polygon = poligɔn
    .triangle = trayaŋgul
    .rectangle = rɛktaŋgul
    .circle = gilli
    .region = luɣili
    .point = pɔyint
    .square = sikwɛɛ
    .diamond = dayamɔn
    .cross = daantalli
    .plus = pahibu maka

# The side count is a relative and closes the noun phrase behind the describing
# words rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] din mali kpaŋa { $numSides }
       *[head] poligɔn din kpaŋa nyɛla yim
    }

# The noun class, read off the noun's own suffix. `c1` is the default and the
# class a loanword joins, which is what an author's own `markerStyleWord` is as
# far as this catalog is concerned.
noun-gender =
    { $noun ->
        [circle] c1
        [region] c1
        [border] c1
        [square] c2
        [diamond] c2
        [point] c2
        [cross] c2
        [text] c3
        [fill] c3
       *[other] c1
    }


## Style composition

# The dash pattern is a «ni …» phrase and closes the description, so it moves
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
        [c2] palliga
        [c3] pallim
       *[c1] palli
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

# «nɔli» is the border and leads its own describing words, so they agree with
# it rather than with the shape it surrounds. Dagbani has no article and joins
# this clause with the invariable «ni», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] ni nɔli { $border }
        [and] ni nɔli { $border }
        [and-article] ni nɔli { $border }
       *[with] ni nɔli { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = bi palli

style-text =
    { $parts ->
        [background] { $color } nyaaŋa { $background }
       *[plain] { $color }
    }

style-background-none = shɛli ka nyaaŋa


## Boolean words

boolean-true = yɛlimaŋli
boolean-false = ʒiri


## Answer buttons

answer-submit-label = Yuli Tuma
answer-submit-label-no-correctness = Tim Lahabali


## Sectional blocks

section-name =
    .activity = Tuma
    .aside = Pahibu
    .cascade = Tarima
    .definition = Bachi
    .example = Kotomsi
    .exercise = Dihibu
    .exercises = Dihibunima
    .given-answer = Lahabali
    .note = Gbaabu
    .objectives = Bihigu
    .paragraphs = Yɛtɔɣa
    .part = Pirigili
    .problem = Yɛlli
    .problems = Yɛla
    .proof = Dahima
    .question = Bɔhigu
    .section = Pirigili
    .solution = Ŋmaabu
    .task = Tuma
    .theorem = Tiyorɛm

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Maka


## Tables and figures

table-name =
    { $parts ->
        [numbered] Teebul { $enumeration }
        [numbered-title] Teebul { $enumeration }{ ": " }
        [unnumbered-title] Teebul{ ": " }
       *[unnumbered] Teebul
    }

figure-name =
    { $parts ->
        [numbered] Ŋmahiŋga { $enumeration }
        [numbered-caption] Ŋmahiŋga { $enumeration }{ ": " }
        [unnumbered-caption] Ŋmahiŋga{ ": " }
       *[unnumbered] Ŋmahiŋga
    }


## Paginator controls

paginator-previous = Din daŋ
paginator-next = Din pahi
paginator-page = Peji

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = bee

piecewise-condition-if = di yi niŋ

piecewise-condition-otherwise = luɣ' shɛŋa kam


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Ghana teaches secondary science in English, so a
## Dagbani speaker meets the periodic table there and the fallback *is* the
## curriculum — the same answer `locales/ak`, `locales/ee` and `locales/gaa`
## give from the same ministry, and the answer `locales/mos` gives in French
## one border away.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Kɛmistiri Maka Din Bi Tuhi
chemistry-invalid-ionic-compound = Ayɔn Laɣimbu Din Bi Tuhi
