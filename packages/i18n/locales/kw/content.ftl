# Cornish (Kernewek) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, Standard Written Form (Furv Skrifys Savonek, FSS/SWF)**, as
# in every file of this catalog, following Akademi Kernewek's «Gerlyver
# Kernewek». **Kernewek Kemmyn** is the alternative orthography that was not
# used. Digits are Latin and a number is grouped by the locale's own rules,
# which is what DoenetML pins for every locale in `src/intl.ts`.
#
# ## Word order and agreement
#
# **Cornish puts its adjectives after the noun**, so every composition message
# is reordered from the English and the noun a description names comes first
# rather than last: `style-with-noun` renders «linen dew derrys rudh» for
# *thick dashed red line*. Among themselves the adjectives keep English's
# order — width, dash pattern, colour — which is also the order `locales/ga`
# and `locales/gd` settle on.
#
# **The agreement is real, and it is lenition rather than an ending.** A
# feminine singular noun softens the first consonant of what follows it:
# p→b, t→d, k→g, b→v, d→dh, g→∅, m→v, gw→w. So «tew» becomes «dew» after
# «linen», «gwynn» becomes «wynn», «du» becomes «dhu». Every describing word
# whose initial can move selects on `$gender`; «loos», «rudh» and «orenj»
# begin with `l`, `r` and a vowel, which have no lenited form, and are written
# once with no select at all. That is Cornish spelling, not an untranslated
# string.
#
# **Nothing selects on `$role`.** Cornish has no case that an attributive
# adjective takes from the position of the phrase it sits in — what a position
# does to a Celtic adjective is done by the noun in front of it, and that
# noun's gender is already the token. The three clause positions therefore
# render exactly as `standalone` does.
#
# **`noun-regular-polygon` splits.** The side count follows the style
# adjectives as a prepositional phrase, so the head is «polygon rewlys» and the
# tail «gans N tenewen» — «tenewen» singular after a numeral, as any counted
# Cornish noun is, and written unmutated; whether it should fork is the open
# question the *Borrowing, declared* section below records.
#
# ## Counts
#
# Nothing in this file counts, so none of Cornish's six plural categories is
# selected here; see `chrome.ftl`'s header for what they cover.
#
# ## Borrowing, declared
#
# «vektor», «parabola», «polygon», «fonksyon», «diamont», «statistek»,
# «theorem» and «ionek» are English/international terms in SWF spelling — the
# register a Cornish pupil actually meets mathematics and chemistry in is
# English. The language's own words carry the everyday layer: the colours «du»,
# «gwynn», «loos», «rudh», «melyn», «gwyrdh», «glas», «gell»; «linen»,
# «kylgh», «trihorn», «krows», «poynt», «folen», «gwir» and «gow».
#
# `noun-regular-polygon`'s tail prints a numeral in front of «tenewen», whose
# `t` lenites after «dew» and spirantizes after «tri», and is written once
# rather than forked — the same open question `diagnostics.ftl`'s header
# records for its four `select-*` and `circle-*` messages.
#
# **Weakest first.** «terrys» (*broken*) for *dashed* and «poyntys» for
# *dotted* are participles formed here on attested roots rather than dictionary
# entries; so are «hyntyans» for *hint* and «keyndir» for *background*. «trogh»
# for *section* against «rann» for *part* is a distinction this seed imposed.
#
# ## The chemistry element tables
#
# `element-name` and `element-anion-name` are **omitted**. Cornish has no
# settled published list of all 118 elements — Akademi Kernewek's dictionary
# covers a few dozen — and a Cornish pupil meets the periodic table **in
# English**, in a Cornwall school. The keys therefore do not appear here and
# fall back to `locales/en`, which is the language the table would be read in
# anyway. `chemistry-invalid-symbol` and its siblings are prose and are
# translated.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] dhu
           *[m] du
        }
    .white =
        { $gender ->
            [f] wynn
           *[m] gwynn
        }
    .gray = loos
    .red = rudh
    .orange = orenj
    .yellow =
        { $gender ->
            [f] velyn
           *[m] melyn
        }
    .green =
        { $gender ->
            [f] wyrdh
           *[m] gwyrdh
        }
    .cyan =
        { $gender ->
            [f] laswyrdh
           *[m] glaswyrdh
        }
    .blue =
        { $gender ->
            [f] las
           *[m] glas
        }
    .purple =
        { $gender ->
            [f] burpur
           *[m] purpur
        }
    .pink =
        { $gender ->
            [f] binc
           *[m] pinc
        }
    .brown =
        { $gender ->
            [f] ell
           *[m] gell
        }
line-width =
    .thick =
        { $gender ->
            [f] dew
           *[m] tew
        }
    .thin =
        { $gender ->
            [f] danow
           *[m] tanow
        }
line-style =
    .dashed =
        { $gender ->
            [f] derrys
           *[m] terrys
        }
    .dotted =
        { $gender ->
            [f] boyntys
           *[m] poyntys
        }
# Noun phrases standing behind «gans», which causes no mutation in Cornish.
# They modify nothing and so take no gender.
fill-style =
    .horizontal = linennow kompes
    .vertical = linennow serth
    .diagonal = linennow treusek
    .backdiagonal = linennow treusek gorthdro
    .dots = poyntys
    .diamonds = diamontys
noun =
    .line = linen
    .line-segment = rann linen
    .ray = dewynn
    .vector = vektor
    .curve = krommen
    .function = fonksyon
    .slope-field = gwel ledrow
    .vector-field = gwel vektorow
    .parabola = parabola
    .polyline = polylinen
    .polygon = polygon
    .triangle = trihorn
    .rectangle = hirbedrek
    .circle = kylgh
    .region = ranndir
    .point = poynt
    .square = pedrek
    .diamond = diamont
    .cross = krows
    .plus = plus
noun-regular-polygon =
    { $part ->
        [tail] gans { $numSides } tenewen
       *[head] polygon rewlys
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (polygon, m) or the
# head of a phrase the description never names: `border` (or, f), `fill`
# (lenwyans, m), `text` (tekst, m), `background` (keyndir, m).
noun-gender =
    { $noun ->
        [line] f
        [line-segment] f
        [curve] f
        [polyline] f
        [cross] f
        [border] f
       *[other] m
    }

## Style composition

# The adjectives follow their noun and keep English's order among themselves:
# «linen dew derrys rudh».
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
# The noun leads and the adjectives follow it, which is the reverse of English
# and the reason this message exists rather than a concatenation.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
# «lenwys» begins with `l`, which has no lenited form, so it reads the same
# after a feminine noun as after a masculine one and needs no branch.
style-filled-word = lenwys
style-filled =
    { $parts ->
        [pattern] { $color } { $filled } gans { $pattern }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } gans { $pattern }
        [plain-tail] { $noun } { $color } { $filled } { $nounTail }
        [pattern-tail] { $noun } { $color } { $filled } { $nounTail } gans { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }
# «or» is feminine, so the border's adjectives lenite after it whatever the
# shape around it is. It begins with a vowel, so «ha» takes its pre-vocalic
# form «hag» in the two `and` branches. Cornish has no indefinite article, so
# the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] gans or { $border }
        [and] hag or { $border }
        [and-article] hag or { $border }
       *[with] gans or { $border }
    }
# The pattern words are plural nouns, so this supplies «lenwyans» — masculine,
# the gender `noun-gender` already answers for `fill` — for the colour to
# follow, and hangs the pattern off it with «gans».
style-fill =
    { $parts ->
        [pattern] lenwyans { $color } gans { $pattern }
       *[plain] { $color }
    }
style-unfilled = heb lenwyans
# «keyndir» is masculine, so the background colour does not lenite.
style-text =
    { $parts ->
        [background] { $color } gans keyndir { $background }
       *[plain] { $color }
    }
style-background-none = travyth

## Boolean words

boolean-true = gwir
boolean-false = gow

## Answer buttons

answer-submit-label = Checkya an ober
answer-submit-label-no-correctness = Danvon gorthyp

## Sectional blocks

section-name =
    .activity = Gwrians
    .aside = A-denewen
    .cascade = Lammdowr
    .definition = Styryans
    .example = Ensampel
    .exercise = Praktis
    .exercises = Praktisyow
    .given-answer = Gorthyp
    .note = Noten
    .objectives = Amkanow
    .paragraphs = Rannskrifow
    .part = Rann
    .problem = Kudynn
    .problems = Kudynnow
    .proof = Prov
    .question = Govynn
    .section = Trogh
    .solution = Digolmans
    .task = Oberenn
    .theorem = Theorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Hyntyans

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabel { $enumeration }
        [numbered-title] Tabel { $enumeration }{ ": " }
        [unnumbered-title] Tabel{ ": " }
       *[unnumbered] Tabel
    }
figure-name =
    { $parts ->
        [numbered] Figur { $enumeration }
        [numbered-caption] Figur { $enumeration }{ ": " }
        [unnumbered-caption] Figur{ ": " }
       *[unnumbered] Figur
    }

## Paginator controls

paginator-previous = Kyns
paginator-next = Nessa
paginator-page = Folen
paginator-page-status = { $pageLabel } { $currentPage } a { $numPages }

## Piecewise functions

piecewise-condition-or = po
piecewise-condition-if = mars
piecewise-condition-otherwise = poken

## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Arwodh gymyk anwiw
chemistry-invalid-ionic-compound = Kemyskyans ionek anwiw

## Inputs embedded in math

math-embedded-input-blank = gwag
math-embedded-input-blank-ordinal = gwag { $ordinal } a { $total }
