# Igbo content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Igbo has no grammatical gender, no noun class and no adjective agreement, so
# `$gender` and `$role` go unused here exactly as they do in English.
# Describing words *follow* the noun — «ahịrị ọkpụrụkpụ uhie» — so the
# composition messages put the noun first.
#
# Igbo has no article, so the two `-article` branches read like the ones
# without.
#
# The colours are written bare rather than in the «na-acha … » frame a full
# sentence would use: what these strings label is a shape in a legend, and a
# legend in Igbo names the colour without the verb around it.
#
# The dots under ị, ọ and ụ are part of the spelling, not decoration.


## Style vocabulary

color =
    .black = ojii
    .white = ọcha
    .gray = ntụ ntụ
    .red = uhie
    .orange = oroma
    .yellow = odo odo
    .green = akwụkwọ ndụ
    .cyan = sayaan
    .blue = anụnụ anụnụ
    .purple = odo anụnụ
    .pink = pinki
    .brown = aja aja
line-width =
    .thick = ọkpụrụkpụ
    .thin = gịrịgịrị
line-style =
    .dashed = nwere nkejị
    .dotted = nwere ntụpọ
# Noun phrases: they follow «na» and modify nothing.
fill-style =
    .horizontal = ahịrị ndina
    .vertical = ahịrị ọtọ
    .diagonal = ahịrị nkwụgharị
    .backdiagonal = ahịrị nkwụgharị azụ
    .dots = ntụpọ
    .diamonds = daịmọnd
noun =
    .line = ahịrị
    .line-segment = akụkụ ahịrị
    .ray = ụzarụ
    .vector = vekta
    .curve = ahịrị gbagọrọ agbagọ
    .function = ọrụ
    .parabola = parabola
    .polyline = ahịrị nwere akụkụ
    .polygon = ọdịdị nwere akụkụ ọtụtụ
    .triangle = akụkụ atọ
    .rectangle = akụkụ anọ ogologo
    .circle = okirikiri
    .region = mpaghara
    .point = ntụpọ
    .square = akụkụ anọ nhata
    .diamond = daịmọnd
    .cross = obe
    .plus = akara mgbakwunye
# The side count goes in the tail, behind the describing words: «ọdịdị nhata
# uhie nwere akụkụ 5».
noun-regular-polygon =
    { $part ->
        [tail] nwere akụkụ { $numSides }
       *[head] ọdịdị nhata
    }
# Igbo has no grammatical gender, so every noun answers the same and the answer
# goes unused — as in English.
noun-gender = neuter

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
style-filled-word = juputara
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
# «oke» leads its own describing words, the same way every noun here does.
style-border-clause =
    { $parts ->
        [with-article] na oke { $border }
        [and] na oke { $border }
        [and-article] na oke { $border }
       *[with] na oke { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = ejupụtaghị
style-text =
    { $parts ->
        [background] { $color } n'okpuru { $background }
       *[plain] { $color }
    }
style-background-none = ọ dịghị

## Boolean words

boolean-true = eziokwu
boolean-false = ụgha

## Answer buttons

answer-submit-label = Lelee Ọrụ
answer-submit-label-no-correctness = Zipu Azịza

## Sectional blocks

section-name =
    .activity = Ọrụ
    .aside = Ihe agbakwunyere
    .cascade = Usoro
    .definition = Nkọwa
    .example = Ihe atụ
    .exercise = Mmega
    .exercises = Mmega
    .given-answer = Azịza
    .note = Ihe ncheta
    .objectives = Ebumnuche
    .paragraphs = Paragraf
    .part = Akụkụ
    .problem = Nsogbu
    .problems = Nsogbu
    .proof = Ihe àmà
    .question = Ajụjụ
    .section = Ngalaba
    .solution = Ngwọta
    .task = Ọrụ
    .theorem = Ụkpụrụ
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Ndụmọdụ

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tebụl { $enumeration }
        [numbered-title] Tebụl { $enumeration }{ ": " }
        [unnumbered-title] Tebụl{ ": " }
       *[unnumbered] Tebụl
    }
figure-name =
    { $parts ->
        [numbered] Eserese { $enumeration }
        [numbered-caption] Eserese { $enumeration }{ ": " }
        [unnumbered-caption] Eserese{ ": " }
       *[unnumbered] Eserese
    }

## Paginator controls

paginator-previous = Nke gara aga
paginator-next = Nke ọzọ
paginator-page = Peeji
paginator-page-status = { $pageLabel } { $currentPage } n'ime { $numPages }

## Piecewise functions

piecewise-condition-or = ma ọ bụ
piecewise-condition-if = ọ bụrụ na
piecewise-condition-otherwise = ma ọ bụghị ya

## Chemistry


# Igbo is one of the catalogs that leaves `element-name` and
# `element-anion-name` out, so those 130 keys fall back to English. Nigerian
# secondary chemistry is taught in English, and no Igbo list of the elements
# has reached a classroom to seed from.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Akara Kemịkal Na-ezighị Ezi
chemistry-invalid-ionic-compound = Ngwakọta Ayọn Na-ezighị Ezi
