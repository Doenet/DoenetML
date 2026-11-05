# Northern Sami content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Northern Sami inflects a great deal and this catalog selects on neither
# `$gender` nor `$role`, for a reason that is its own rather than one of the
# reasons `locales/tr` or `locales/eu` have. A Sami adjective standing in front
# of a noun takes a special **attributive** form, and that form agrees with
# nothing at all: not with the noun's case, not with its number, and Sami has
# no gender for it to agree with. So «rukses» is the word in every position,
# and a `$role` fork would write four copies of one string.
#
# The attributive is not the same word as the predicative — «ruoksat» is what
# a line *is*, «rukses» is what goes in front of a noun — and the two positions
# these words are rendered in want different ones. Every composed description
# puts the adjective in front of a noun and wants the attributive; only
# `backgroundColor` and `textColor` standing alone, reported as bare state
# variables, would want the predicative. This catalog writes the attributive
# throughout, so those two read as the front half of a phrase whose noun has
# not arrived. That is the same trade `locales/st` and `locales/tn` make with
# their qualificative particle, and for the same reason: `$role` cannot tell
# the two positions apart, because `standalone` is both of them.
#
# Adjectives precede the noun, as in English, so the composition messages at
# the foot of the file keep the English order.
#
# The colours borrowed whole — «oránša», «ruoná», «turkosa», «fiolehtta»,
# «roosa» — have no attributive of their own and are cited in one shape. That
# the table is uneven is a fact about which colour words Sami inherited and
# which it borrowed.
#
# «sárgolaš» and «čuoggálaš» for the two dash patterns are built on the -laš
# pattern from «sárgu» and «čuokkis». They are the two words here least likely
# to be what a speaker would have written, and are the first thing to check.


## Style vocabulary

color =
    .black = čáhppes
    .white = vilges
    .gray = ránes
    .red = rukses
    .orange = oránša
    .yellow = fiskes
    .green = ruoná
    .cyan = turkosa
    .blue = alit
    .purple = fiolehtta
    .pink = roosa
    .brown = ruškes
line-width =
    .thick = asse
    .thin = seaggi
line-style =
    .dashed = sárgolaš
    .dotted = čuoggálaš
# Comitative plurals. The `-iguin` ending is Sami's own word for "with", which
# is why `style-filled` below places these straight after the colour and writes
# no preposition of its own: the ending already said it.
fill-style =
    .horizontal = horisontála sárgguiguin
    .vertical = vertikála sárgguiguin
    .diagonal = diagonála sárgguiguin
    .backdiagonal = nuppe guvlui diagonála sárgguiguin
    .dots = čuoggáiguin
    .diamonds = rombbaiguin
noun =
    .line = linnjá
    .line-segment = linnjáoassi
    .ray = beallelinnjá
    .vector = vektor
    .curve = kurva
    .function = funkšuvdna
    .parabola = parabola
    .polyline = máŋggalinnjá
    .polygon = polygona
    .triangle = golmmačiehka
    .rectangle = rektangel
    .circle = sirkkel
    .region = guovlu
    .point = čuokkis
    .square = kvadráhta
    .diamond = romba
    .cross = ruossa
    .plus = plus
# Sami keeps the side count in front of the noun, so the whole of it is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] dássedis { $numSides }-bealat polygona
    }
# Sami has no grammatical gender, so nothing above reads this and every noun
# answers alike. It is here because the argument is passed to every adjective
# and a message that resolves to nothing would render `{noun-gender}`.
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
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
style-filled-word = devdojuvvon
# The pattern words carry their own «with» in their comitative ending, so
# nothing is written between them and what they follow.
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
# «ravddain» is «ravda», a border, in the comitative — the case that carries
# "with" — so the clause needs no preposition either. Sami has no article, so
# the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] { $border } ravddain
        [and] ja { $border } ravddain
        [and-article] ja { $border } ravddain
       *[with] { $border } ravddain
    }
style-fill =
    { $parts ->
        [pattern] { $color } deavdda { $pattern }
       *[plain] { $color } deavdda
    }
style-unfilled = devdekeahtes
style-text =
    { $parts ->
        [background] { $color } { $background } duogážiin
       *[plain] { $color }
    }
style-background-none = ii mihkkiige

## Boolean words

boolean-true = duohta
boolean-false = eahpeduohta

## Answer buttons

answer-submit-label = Dárkkis barggu
answer-submit-label-no-correctness = Sádde vástádusa

## Sectional blocks

section-name =
    .activity = Doaibma
    .aside = Lasseteaksta
    .cascade = Kaskáda
    .definition = Meroštallan
    .example = Ovdamearka
    .exercise = Hárjehus
    .exercises = Hárjehusat
    .given-answer = Vástádus
    .note = Mearkkašupmi
    .objectives = Ulbmilat
    .paragraphs = Teakstaoasit
    .part = Oassi
    .problem = Bargobihttá
    .problems = Bargobihtát
    .proof = Duođaštus
    .question = Gažaldat
    .section = Kapihtal
    .solution = Čoavddus
    .task = Bargu
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
hint-title = Ráva

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabealla { $enumeration }
        [numbered-title] Tabealla { $enumeration }{ ": " }
        [unnumbered-title] Tabealla{ ": " }
       *[unnumbered] Tabealla
    }
figure-name =
    { $parts ->
        [numbered] Govva { $enumeration }
        [numbered-caption] Govva { $enumeration }{ ": " }
        [unnumbered-caption] Govva{ ": " }
       *[unnumbered] Govva
    }

## Paginator controls

paginator-previous = Ovddit
paginator-next = Boahtte
paginator-page = Siidu
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = dahje
piecewise-condition-if = jos
piecewise-condition-otherwise = muđui

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Sami-medium schooling reaches secondary science in Norway, Sweden
## and Finland, but the element names its pupils meet are the Norwegian,
## Swedish and Finnish ones, and those three differ from each other — so there
## is no one Sami table for a seed to reproduce, and choosing any of the three
## would report a fact about a border rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Gustohis kemiijalaš symbola
chemistry-invalid-ionic-compound = Gustohis iovnnalaš oktavuohta
