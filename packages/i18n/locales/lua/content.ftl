# Luba-Lulua content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `lua` is Ciluba, one of the four national languages of the Democratic
# Republic of the Congo, written with ⟨c⟩ for the sound Swahili writes ⟨ch⟩.
#
# `$gender` is the noun **class**, as in every Bantu catalog here, and
# `noun-gender` answers `c3`, `c5`, `c7` or `c9`. One concord set rather than
# the two `locales/rw` and `locales/rn` keep apart, because the words this
# catalog inflects are all adjectives:
#
#              c3 (mu-)    c5 (di-)    c7 (ci-)    c9 (N-)
#   -fike       mufike      difike      cifike      nfike
#   -toke       mutoke      ditoke      citoke      ntoke
#   -kunze      mukunze     dikunze     cikunze     nkunze
#   -nene       munene      dinene      cinene      nene
#   -kese       mukese      dikese      cikese      nkese
#
# Only the three colours with a native stem take the concord; the rest are
# nouns and are written bare, for `locales/sw`'s reason — the associative
# particle that would join them attributively is ungrammatical in the
# standalone position `backgroundColor` reports them in, and `$role` cannot
# tell the two positions apart. That is the opposite of what `locales/rw` and
# `locales/rn` decided about the same choice; the two answers sit side by side
# on purpose, so that a speaker can see the trade rather than infer it.
#
# «mulongo», «cijengu», «citupa» and «cimfuanyi» are Ciluba words. The rest of
# the mathematical vocabulary is adapted from the French a Congolese classroom
# teaches mathematics in, and is the first thing to check.
#
# Describing words follow the noun, so the composition messages put the noun
# first. `$role` goes unused: Ciluba marks no case.


## Style vocabulary

# Only the three with a native stem inflect.
color =
    .black =
        { $gender ->
            [c3] mufike
            [c5] difike
            [c7] cifike
           *[c9] nfike
        }
    .white =
        { $gender ->
            [c3] mutoke
            [c5] ditoke
            [c7] citoke
           *[c9] ntoke
        }
    .gray = dibue dia butu
    .red =
        { $gender ->
            [c3] mukunze
            [c5] dikunze
            [c7] cikunze
           *[c9] nkunze
        }
    .orange = orasi
    .yellow = jone
    .green = ditamba
    .cyan = siani
    .blue = bulu
    .purple = purupure
    .pink = roze
    .brown = maro
line-width =
    .thick =
        { $gender ->
            [c3] munene
            [c5] dinene
            [c7] cinene
           *[c9] nene
        }
    .thin =
        { $gender ->
            [c3] mukese
            [c5] dikese
            [c7] cikese
           *[c9] nkese
        }
# Written as an invariable «ne …» phrase, so that it agrees with nothing and
# can close the description; `style-stroke` puts it last for that reason.
line-style =
    .dashed = ne tutupa
    .dotted = ne tuntonga
fill-style =
    .horizontal = milongo milaale
    .vertical = milongo mimane
    .diagonal = milongo miendakane
    .backdiagonal = milongo miendakane ku lubadi lukuabo
    .dots = tuntonga
    .diamonds = madiama
noun =
    .line = mulongo
    .line-segment = citupa cia mulongo
    .ray = leyo
    .vector = vekitere
    .curve = mulongo mukonyike
    .function = fonksio
    .parabola = parabole
    .polyline = mulongo wa bitupa
    .polygon = cimfuanyi cia mpanga ya bungi
    .triangle = cimfuanyi cia mpanga isatu
    .rectangle = cimfuanyi cia mpanga inayi
    .circle = cijengu
    .region = citupa
    .point = pwente
    .square = kare
    .diamond = diama
    .cross = kulusu
    .plus = cimanyinu cia dibueja
# The side count is a relative and closes the noun phrase behind the describing
# words rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] cidi ne mpanga { $numSides }
       *[head] cimfuanyi cia mpanga mifuanangane
    }
# The noun class. `c9` is the default and the class a loanword joins, which is
# what an author's own `markerStyleWord` is as far as this catalog is
# concerned.
noun-gender =
    { $noun ->
        [line] c3
        [curve] c3
        [polyline] c3
        [border] c3
        [line-segment] c7
        [polygon] c7
        [regular-polygon] c7
        [triangle] c7
        [rectangle] c7
        [circle] c7
        [region] c7
        [plus] c7
        [text] c7
        [fill] c7
        [diamond] c5
       *[other] c9
    }

## Style composition

# The dash pattern is a «ne …» phrase and closes the description, so it moves
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
        [c3] muwule
        [c5] diwule
        [c7] ciwule
       *[c9] nwule
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ne { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ne { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ne { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «mukalu» is class 3 and leads its own describing words, so they agree with it
# rather than with the shape it surrounds. Ciluba has no article and joins this
# clause with the invariable «ne», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] ne mukalu { $border }
        [and] ne mukalu { $border }
        [and-article] ne mukalu { $border }
       *[with] ne mukalu { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = kacidi ciwule
style-text =
    { $parts ->
        [background] { $color } ku nyima { $background }
       *[plain] { $color }
    }
style-background-none = katuena ne cintu

## Boolean words

boolean-true = bulelela
boolean-false = dishima

## Answer buttons

answer-submit-label = Tangila Mudimu
answer-submit-label-no-correctness = Tuma Diandamuna

## Sectional blocks

section-name =
    .activity = Mudimu
    .aside = Cibuejibue
    .cascade = Mulongolodi
    .definition = Dijingulula
    .example = Cilejilu
    .exercise = Didiyisha
    .exercises = Madiyisha
    .given-answer = Diandamuna
    .note = Cifundilu
    .objectives = Bipatshila
    .paragraphs = Bitupa
    .part = Citupa
    .problem = Lukelu
    .problems = Nkelu
    .proof = Bujadiki
    .question = Lukonko
    .section = Citupa
    .solution = Disungula
    .task = Mudimu
    .theorem = Teoreme
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Cimanyinu

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabelo { $enumeration }
        [numbered-title] Tabelo { $enumeration }{ ": " }
        [unnumbered-title] Tabelo{ ": " }
       *[unnumbered] Tabelo
    }
figure-name =
    { $parts ->
        [numbered] Cimfuanyi { $enumeration }
        [numbered-caption] Cimfuanyi { $enumeration }{ ": " }
        [unnumbered-caption] Cimfuanyi{ ": " }
       *[unnumbered] Cimfuanyi
    }

## Paginator controls

paginator-previous = Cidi kumpala
paginator-next = Cidi kunyima
paginator-page = Dibeji
paginator-page-status = { $pageLabel } { $currentPage } munkatshi mua { $numPages }

## Piecewise functions

piecewise-condition-or = anyi
piecewise-condition-if = bikala
piecewise-condition-otherwise = miaba mikuabo yonso

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. The Democratic Republic of the Congo teaches
## secondary science in French, so a Ciluba speaker meets the periodic table
## there and the fallback *is* the curriculum — the same answer `locales/ln`
## and `locales/ktu` give from the same ministry.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Cimanyinu cia Shimi Kacidi Cimpe
chemistry-invalid-ionic-compound = Disangisha dia Ayoni Kadidi Dimpe
