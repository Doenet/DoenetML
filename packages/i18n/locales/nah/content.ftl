# Nahuatl content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Central Nahuatl, SEP/INALI orthography; see `chrome.ftl`'s header
# for the variety and the register.
#
# Nahuatl has no grammatical gender and no adjective agreement, so `noun-gender`
# answers one token and nothing selects on it. Nothing selects on `$role`. Its
# adjectives **precede** the noun, so `style-stroke` and `style-with-noun` are
# English's order — the third catalog in this batch for which that is true.
#
# **The absolutive is the constraint that shapes this file.** A Nahuatl noun
# standing on its own carries «-tl», «-tli» or «-li»; the moment it is compounded
# or possessed it loses that ending, and which ending it had is a fact about the
# noun. So a compound cannot be built around a value: «{ $noun }-» would need to
# know what to strip. Every place the English wanted one, this catalog writes two
# words instead — apposition, which Nahuatl allows freely — and the nouns in the
# tables below are cited in their absolutive form, which is the form
# `style-with-noun` puts them in.
#
# The same rule blocks the possessive prefix, whose shape («ī-» against «īn-»)
# depends on what follows. `chrome.ftl` and `editor.ftl` name their values rather
# than possessing them for that reason.
#
# `noun-regular-polygon` collapses to English's shape: the side count is a
# prenominal modifier, «mācuīlnacaztic», so the head holds it and the `[tail]`
# branch is empty.
#
# The colour table mixes inherited words with Spanish loans, and the inherited
# ones name a dye or a substance rather than a band of the spectrum:
# «camohpaltic» is the colour of a sweet potato, «cuappaltic» of wood,
# «nextic» of ash. Assigning them to English's twelve keys is a lossy fit, and it
# is the first thing a speaker should look at.


## Style vocabulary

color =
    .black = tlīltic
    .white = iztāc
    .gray = nextic
    .red = chīchīltic
    .orange = xōchipaltic
    .yellow = cōztic
    .green = xoxoctic
    .cyan = sian
    .blue = texohtic
    .purple = camohpaltic
    .pink = tlāztalēhualtic
    .brown = cuappaltic

line-width =
    .thick = tomāhuac
    .thin = canāhuac

line-style =
    .dashed = tlacotōctic
    .dotted = tlacuihcuiltic

# Noun phrases, which is what the head of `style-fill` is. Nahuatl does not
# pluralize these, so they are the same words for one and for many.
fill-style =
    .horizontal = tlīlli tlaīxtlapaltic
    .vertical = tlīlli tlaquetztic
    .diagonal = tlīlli tlanacaztic
    .backdiagonal = tlīlli tlanacaztic tlacuepcāyōtl
    .dots = tlīltzintli
    .diamonds = rombo

noun =
    .line = tlīlli
    .line-segment = tlīlcotōnalli
    .ray = meyalli
    .vector = bector
    .curve = tlīlcoltic
    .function = funsion
    .parabola = parabola
    .polyline = tlīlli miectic
    .polygon = miecnacaztic
    .triangle = yēinacaztic
    .rectangle = nāhuinacaztic huēyac
    .circle = yāhualtic
    .region = tlālli
    .point = tlīltzintli
    .square = nāhuinacaztic
    .diamond = rombo
    .cross = cuauhnepanōlli
    .plus = nepanōlli machiyōtl

# The side count is a prenominal modifier, so it stays in the head and the tail
# is empty — English's shape, reached by a different road.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } nacaztic tlaneneuhcāyōtl
    }

# One answer for every noun: Nahuatl has no grammatical gender, so nothing
# downstream has anything to agree with.
noun-gender = neuter


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

# The adjectives precede the noun, so this is English's order. The `[noun-tail]`
# branch is unreachable from Nahuatl's own `noun-regular-polygon`; it is kept
# because it is what a partly-corrected catalog falls back to.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

style-filled-word = tlatēmītilli

# «īca», "with", is a free word and precedes what it governs, so nothing is
# welded to `$pattern` — the absolutive stays on it and the phrase is apposition.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } īca { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } īca { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } īca { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «tenāmitl», the border, is written as its own word rather than compounded onto
# the description, for the absolutive reason in this file's header. Nahuatl has no
# article, so English's four branches are two distinct strings; all four are
# written out because they are four positions.
style-border-clause =
    { $parts ->
        [with-article] īca cē { $border } tenāmitl
        [and] īhuān { $border } tenāmitl
        [and-article] īhuān cē { $border } tenāmitl
       *[with] īca { $border } tenāmitl
    }

# Here the pattern is the head noun — "blue diamonds" — and the colour precedes
# it, so the phrase needs nothing at all.
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = ahmo tlatēmītilli

style-text =
    { $parts ->
        [background] { $color } īca cē { $background } tlacuitlapampa
       *[plain] { $color }
    }

style-background-none = ahtlein


## Boolean words

boolean-true = nelli
boolean-false = ahnelli


## Answer buttons

answer-submit-label = Xictta in tlachīhualli
answer-submit-label-no-correctness = Xictitlani in tlanānquilīlli


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are the same
# word: these nouns are inanimate and Nahuatl does not pluralize them.
section-name =
    .activity = Tlachīhualiztli
    .aside = Tlahtōlnechicōlli
    .cascade = Ātēmpan
    .definition = Tlamelāhuacāyōtl
    .example = Neīxcuitīlli
    .exercise = Tlayehyecōlli
    .exercises = Tlayehyecōlli
    .given-answer = Tlanānquilīlli
    .note = Tlahcuilōltzintli
    .objectives = Tlanequiliztli
    .paragraphs = Tlahtōltzintli
    .part = Tlacotōnalli
    .problem = Tlaohuihcāyōtl
    .problems = Tlaohuihcāyōtl
    .proof = Tlanēltilīlli
    .question = Tlahtlaniliztli
    .section = Tlaxexelōlli
    .solution = Tlanāmictīlli
    .task = Tlatequipanōlli
    .theorem = Teorema

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Tlapalēhuīlli


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tlapōhualpechtli { $enumeration }
        [numbered-title] Tlapōhualpechtli { $enumeration }{ ": " }
        [unnumbered-title] Tlapōhualpechtli{ ": " }
       *[unnumbered] Tlapōhualpechtli
    }

figure-name =
    { $parts ->
        [numbered] Tlaīxiptlayōtl { $enumeration }
        [numbered-caption] Tlaīxiptlayōtl { $enumeration }{ ": " }
        [unnumbered-caption] Tlaīxiptlayōtl{ ": " }
       *[unnumbered] Tlaīxiptlayōtl
    }


## Paginator controls

paginator-previous = Yehuā
paginator-next = Niman
paginator-page = Āmoxpechtli

paginator-page-status = { $pageLabel } { $currentPage } īhuīc { $numPages }


## Piecewise functions

piecewise-condition-or = ahnōzo
piecewise-condition-if = intlā
piecewise-condition-otherwise = ahnōzo cē


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Nahuatl-language schooling in Mexico is bilingual primary education;
## secondary chemistry is taught in Spanish out of Spanish textbooks, so the
## periodic table a pupil meets is `locales/es`'s. There is no settled Nahuatl
## table for a seed to reproduce, and coining one over 118 entries would be worse
## than the English a student can check against their own book.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Machiyōtl kimiko ahmo cualli
chemistry-invalid-ionic-compound = Tlanechicōlli ioniko ahmo cualli
