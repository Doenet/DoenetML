# Ojibwe content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Fiero double-vowel orthography, which is the one Ojibwe
# language programs across Minnesota, Wisconsin and Ontario teach and publish in.
# That is a written standard over a wide dialect spread — Southwestern, Central,
# Odawa, Oji-Cree all differ — so it is the `locales/sc` case: a deployment
# wanting one supplies its own catalog as `localeResources`.
#
# **This is the catalog where `$gender` earns its name least and its argument
# most.** Ojibwe has grammatical gender, and it is not masculine and feminine: it
# is **animate and inanimate**, it runs through the whole language, and the words
# that describe a thing are *verbs* that agree with it. So `noun-gender` answers
# `anim` or `inan`, and every describing word below selects on it — «miskozi» for
# an animate thing that is red, «miskwaa» for an inanimate one. That is the
# `locales/sw` precedent exactly: the argument was named for a position rather
# than for a case, and a token set is a token set.
#
# Which of the two a given shape is, is not derivable from anything. A star is
# animate in Ojibwe and a rock is inanimate; the assignment for the geometric
# nouns here is a guess, and it is the single most useful thing a speaker could
# correct in this file, because every adjective downstream follows it.
#
# **The colour table is the worst fit in the whole roster, and it is worth being
# precise about why.** Ojibwe does not divide the spectrum where English does:
#
#   - «ozhaawashkozi/-shkwaa» covers what English calls both blue and green.
#   - «ozaawi/-zaawaa» covers yellow *and* orange *and* brown.
#
# So five of English's twelve keys are served by two Ojibwe stems. This catalog
# writes the modifier the language itself uses to narrow them — «ozhaawashko-
# gizhigaa» for the blue of the sky against plain «ozhaawashkwaa» for green — and
# for `.orange` and `.brown` it writes compounds. None of that is a translation
# of the English word; it is a different partition forced into English's table,
# and no amount of correcting individual entries fixes the shape of the table.
# Four languages in this batch have some version of this seam and none of them
# has it as sharply as Ojibwe.
#
# Ojibwe is polysynthetic, and a describing verb normally *incorporates* the
# noun rather than standing beside it. This catalog does not build those
# compounds: the stem that would go inside one is chosen by the noun, so a
# compound cannot be assembled around a placeable. Every message below writes
# two words where the language would often write one, and that is the plainest
# consequence of the README's affix rule anywhere in the roster.
#
# There is no `$role` fork: what English marks with a preposition Ojibwe marks
# on the verb or with a preverb, never on the describing word.


## Style vocabulary

# Each colour is a verb, so each selects on animacy. The `anim` forms end in
# `-zi`/`-shkozi` and the `inan` forms in `-aa`/`-shkwaa`, which is the same
# alternation throughout.
#
# «ozaawi-» is yellow, orange and brown at once: `.yellow` is the bare stem,
# `.orange` narrows it with «misko-» (red) and `.brown` with «makade-» (dark).
# «ozhaawashko-» is green and blue at once: `.green` is the bare stem and `.blue`
# narrows it with «gizhigaa» (of the sky). Five of English's keys are served by
# two Ojibwe stems, which is the fact this table cannot record.
#
# A comment cannot be indented under an attribute here — Fluent would make it
# part of the pattern, and `lint:i18n` rejects that — which is why these notes
# sit above the message rather than beside the entries they describe.
color =
    .black =
        { $gender ->
            [anim] makadewizi
           *[inan] makadewaa
        }
    .white =
        { $gender ->
            [anim] waabishkizi
           *[inan] waabishkaa
        }
    .gray =
        { $gender ->
            [anim] azhaashkozi
           *[inan] azhaashkwaa
        }
    .red =
        { $gender ->
            [anim] miskozi
           *[inan] miskwaa
        }
    .orange =
        { $gender ->
            [anim] misko-ozaawizi
           *[inan] misko-ozaawaa
        }
    .yellow =
        { $gender ->
            [anim] ozaawizi
           *[inan] ozaawaa
        }
    .green =
        { $gender ->
            [anim] ozhaawashkozi
           *[inan] ozhaawashkwaa
        }
    .cyan =
        { $gender ->
            [anim] waabi-ozhaawashkozi
           *[inan] waabi-ozhaawashkwaa
        }
    .blue =
        { $gender ->
            [anim] ozhaawashko-gizhigizi
           *[inan] ozhaawashko-gizhigaa
        }
    .purple =
        { $gender ->
            [anim] miinaandezi
           *[inan] miinaandeg
        }
    .pink =
        { $gender ->
            [anim] waabi-miskozi
           *[inan] waabi-miskwaa
        }
    .brown =
        { $gender ->
            [anim] makade-ozaawizi
           *[inan] makade-ozaawaa
        }

line-width =
    .thick =
        { $gender ->
            [anim] gipagizi
           *[inan] gipagaa
        }
    .thin =
        { $gender ->
            [anim] bibagizi
           *[inan] bibagaa
        }

line-style =
    .dashed =
        { $gender ->
            [anim] bakwezhigizi
           *[inan] bakwezhigaa
        }
    .dotted =
        { $gender ->
            [anim] agwaawaadizi
           *[inan] agwaawaadaan
        }

# Noun phrases, and the plural is the inanimate plural `-an`/`-oon`, because
# these are things rather than beings. This is one of the two places animacy is
# visible in the noun itself rather than only in the verb agreeing with it.
fill-style =
    .horizontal = shingishinoon jiigaatigoon
    .vertical = gaabawiwan jiigaatigoon
    .diagonal = aazhawaakwaan jiigaatigoon
    .backdiagonal = aazhawaakwaan jiigaatigoon aanjisejig
    .dots = agwaawaadeg
    .diamonds = wiingashkoon

noun =
    .line = jiigaatig
    .line-segment = jiigaatig bakwezhigan
    .ray = waaseyaasing
    .vector = bekitoor
    .curve = waagaatig
    .function = anokiiwin
    .parabola = paraboolaa
    .polyline = niibiwa jiigaatigoon
    .polygon = niibiwa-wiikwaan
    .triangle = nisoowiikwaan
    .rectangle = niiyoowiikwaan ginwaa
    .circle = waawiyeyaa
    .region = akiiwan
    .point = mazina'igaans
    .square = niiyoowiikwaan
    .diamond = wiingashk
    .cross = aazhidebide'igan
    .plus = agindaasowin-mazina'igan

# The side count precedes the noun, so the head holds it and the `[tail]` branch
# is empty — English's shape.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } endaso-wiikwaan naasaab
    }

# **Animacy, not masculine and feminine.** Nothing here is derivable: Ojibwe
# assigns animacy word by word, and a shape's assignment is a fact about the word
# rather than about the shape. Every entry below is a guess this file is asking a
# speaker to check, because each one decides which form of every colour and width
# gets rendered beside it.
#
# Besides `noun`'s attributes, `$noun` can be `regular-polygon` or the head of a
# phrase the description never names: `border`, `fill`, `text`, `background` —
# all four treated as inanimate here.
noun-gender =
    { $noun ->
        [circle] anim
        [point] anim
        [diamond] anim
        [cross] anim
       *[other] inan
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

# The describing verbs precede the noun, which is English's order — but they are
# verbs standing beside it rather than modifiers of it, and Ojibwe would more
# usually fold them in. See this file's header for why they are not folded.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

style-filled-word =
    { $gender ->
        [anim] mooshkinezi
       *[inan] mooshkinebii
    }

# «gaye», "and also", joins the pattern rather than a case marker: nothing can be
# welded to `$pattern`, and no preverb can be chosen without seeing it.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color }, gaye { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun }, gaye { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail }, gaye { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «jiigaatigwaan», the border, is inanimate, so the border's own describing verbs
# agree with *it* rather than with the shape it surrounds — which is exactly what
# the `border` entry in `noun-gender` is for.
#
# Ojibwe has no article, so English's article distinction collapses; what does
# not collapse is the `and` one. `style-filled-with-noun` already joins the fill
# pattern with «gaye», so a border reached by the `[and]` branches is the *second*
# thing joined to the same sentence, and repeating «gaye» there would read as one
# list of two rather than as two clauses. «miinawaa» — "and furthermore" — is what
# the language uses for that, and it is why these four branches are two distinct
# strings rather than one.
style-border-clause =
    { $parts ->
        [with-article] gaye { $border } jiigaatigwaan
        [and] miinawaa { $border } jiigaatigwaan
        [and-article] miinawaa { $border } jiigaatigwaan
       *[with] gaye { $border } jiigaatigwaan
    }

# Here the pattern is the head, so the colour precedes it and the phrase needs
# nothing.
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = gaawiin mooshkinebiisinoon

style-text =
    { $parts ->
        [background] { $color }, { $background } atesing
       *[plain] { $color }
    }

style-background-none = gaawiin gegoo


## Boolean words

boolean-true = geget
boolean-false = gaawiin geget


## Answer buttons

answer-submit-label = Nanaa'ichige
answer-submit-label-no-correctness = Izhinizha'amaw nakwetamowin


## Sectional blocks

# The Ojibwe plural is «-an»/«-oon» for inanimates, so `.exercises` and
# `.problems` do differ from their singulars here — unlike every other catalog in
# this batch, where number is unmarked.
section-name =
    .activity = Izhichigewin
    .aside = Bakaan ikidowin
    .cascade = Gaagige-bawitig
    .definition = Wiindamaagewin
    .example = Waabanda'iwewin
    .exercise = Gagwedaagewin
    .exercises = Gagwedaagewinan
    .given-answer = Nakwetamowin
    .note = Ozhibii'igaans
    .objectives = Nandagikendamowinan
    .paragraphs = Ozhibii'iganan
    .part = Onji-ayi'ii
    .problem = Zanagendamowin
    .problems = Zanagendamowinan
    .proof = Debwewin-waabanda'iwewin
    .question = Gagwedwewin
    .section = Onaakonigan
    .solution = Nanaa'igewin
    .task = Anokiiwin
    .theorem = Teyoorem

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Wiidookaagewin


## Tables and figures

table-name =
    { $parts ->
        [numbered] Adoopowin { $enumeration }
        [numbered-title] Adoopowin { $enumeration }{ ": " }
        [unnumbered-title] Adoopowin{ ": " }
       *[unnumbered] Adoopowin
    }

figure-name =
    { $parts ->
        [numbered] Mazinaakizon { $enumeration }
        [numbered-caption] Mazinaakizon { $enumeration }{ ": " }
        [unnumbered-caption] Mazinaakizon{ ": " }
       *[unnumbered] Mazinaakizon
    }


## Paginator controls

paginator-previous = Ishkweyaang
paginator-next = Niigaan
paginator-page = Bezhig-mazina'igan

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = gemaa
piecewise-condition-if = giishpin
piecewise-condition-otherwise = bakaan igo


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Ojibwe-medium schooling is immersion and language-revitalization
## programming, and it stops below the grades where the periodic table is taught;
## secondary chemistry is in English across Minnesota, Wisconsin, Michigan and
## Ontario, so the fallback *is* the curriculum. There is no Ojibwe table for a
## seed to reproduce, and coining 118 entries in a polysynthetic language — where
## a coinage is a whole descriptive verb rather than a name — would be worse than
## the English a student meets in their own textbook.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Gaawiin gwayak mazina'igan (chemistry)
chemistry-invalid-ionic-compound = Gaawiin gwayak ionic-mamaw-ayi'ii
