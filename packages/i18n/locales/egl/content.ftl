# Emilian (emiliàn) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **`egl` is the Emilian half** of what the widely-seen `eml` tag lumps
# together with Romagnol; see `chrome.ftl`. The variety is **Bolognese**, in
# the Vitali/Lepri lexicographic orthography, and the note on «â ê î ô û»,
# «å», «ä», «ç» and «ṡ» is there too.
#
# **Adjectives follow the noun**, as in every Romance language of this batch,
# and this catalog **really agrees them for gender**: the feminine is a live
# ending in Bolognese, not a copy of the masculine. Masculine `-` / feminine
# `-a` («gròs» / «gròsa», «ròs» / «róssa», «vaird» / «vairda»), and the past
# participles that serve as adjectives take masculine **`-è`** / feminine
# **`-èda`** («trategè» / «trategèda», «puntinè» / «puntinèda»). That `-è` /
# `-èda` pair is Bolognese morphology — Latin -ATU / -ATA — and is the loudest
# place this file parts company with `locales/it` in print. The composition
# messages therefore put the noun first: «lénnia gròsa trategèda róssa».
#
# The Bolognese plural is the other place this file is visibly not Italian,
# and it is why the counts in the other three files select the way they do:
# masculine nouns are largely **invariable** («al pónt» → «i pónt», «al
# tentatîv» → «i tentatîv»), while the feminine drops its `-a` («la rispòsta»
# → «äl rispòst»). No plural is selected in this file, but the fill patterns
# are written in it.
#
# `$role` goes unused: Bolognese marks no case on an adjective, and the three
# clause positions differ from `standalone` only in the preposition in front of
# the phrase, which is written in the composition message rather than in the
# word.
#
# **The periodic table is left to fall back to English.** Emilian has no
# settled published list of the 118 elements, and no standardized technical
# terminology at all — Vitali's dictionary is a dictionary of the spoken
# language, not a science vocabulary. Schooling in Emilia is in **Italian**,
# out of Italian textbooks, so the periodic table a Bolognese pupil actually
# meets is `locales/it`'s. That is a fact about a school system rather than
# about the language, and a reviewer who wants the names here should copy
# `locales/it`'s deliberately rather than have this seed guess at Emilian ones.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] nîgra
           *[m] nîgher
        }
    .white =
        { $gender ->
            [f] biânca
           *[m] biânc
        }
    .gray =
        { $gender ->
            [f] grîṡa
           *[m] grîṡ
        }
    .red =
        { $gender ->
            [f] róssa
           *[m] ròs
        }
    .orange = arànz
    .yellow =
        { $gender ->
            [f] żâla
           *[m] żâl
        }
    .green =
        { $gender ->
            [f] vairda
           *[m] vaird
        }
    .cyan = ziàn
    .blue = blò
    .purple = viôla
    .pink = ròṡa
    .brown = maròn
line-width =
    .thick =
        { $gender ->
            [f] gròsa
           *[m] gròs
        }
    .thin =
        { $gender ->
            [f] sutîla
           *[m] sutîl
        }
line-style =
    .dashed =
        { $gender ->
            [f] trategèda
           *[m] trategè
        }
    .dotted =
        { $gender ->
            [f] puntinèda
           *[m] puntinè
        }
fill-style =
    .horizontal = lénni oriżuntèl
    .vertical = lénni verticèl
    .diagonal = lénni diagonèl
    .backdiagonal = lénni diagonèl al arvêrs
    .dots = pónt
    .diamonds = ronb
noun =
    .line = lénnia
    .line-segment = segmänt
    .ray = semirèta
    .vector = vetåur
    .curve = cûrva
    .function = funziån
    .slope-field = câmp däl pendänz
    .vector-field = câmp vetorièl
    .parabola = parâbola
    .polyline = poligonèla
    .polygon = poligon
    .triangle = triàngol
    .rectangle = retàngol
    .circle = zércc
    .region = regiån
    .point = pónt
    .square = quadrè
    .diamond = ronb
    .cross = cråuṡ
    .plus = pió
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they agree with — the Romance shape `locales/it` and
# `locales/fur` already have.
noun-regular-polygon =
    { $part ->
        [tail] ed { $numSides } bänd
       *[head] poligon regolèr
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (poligon, m) or the
# head of a phrase the description never names: `border` (åurel, m), `fill`
# (impiniduréa, f), `text` (tèst, m), `background` (fånd, m). The default is
# masculine, which is also what an author's own `markerStyleWord` gets.
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [region] f
        [cross] f
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
# The noun leads and its adjectives follow: «lénnia gròsa róssa». A noun with a
# complement keeps it beside itself.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [f] pénna
       *[m] pén
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } con { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } con { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } con { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «åurel» (edge, border) is masculine, so the border's adjectives agree with it
# and not with the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] con un åurel { $border }
        [and] e åurel { $border }
        [and-article] e con un åurel { $border }
       *[with] con åurel { $border }
    }
# «ed colåur» keeps the colour from having to agree with a plural pattern noun.
style-fill =
    { $parts ->
        [pattern] { $pattern } ed colåur { $color }
       *[plain] { $color }
    }
style-unfilled = brîṡa pén
style-text =
    { $parts ->
        [background] { $color } só un fånd { $background }
       *[plain] { $color }
    }
style-background-none = inción

## Boolean words

boolean-true = vaira
boolean-false = fâls

## Answer buttons

answer-submit-label = Cuntrôla al lavurîr
answer-submit-label-no-correctness = Manda la rispòsta

## Sectional blocks

section-name =
    .activity = Ativitè
    .aside = Nòta a pèrt
    .cascade = Cascâta
    .definition = Definiziån
    .example = Eṡänpi
    .exercise = Eṡerzézzi
    .exercises = Eṡerzézzi
    .given-answer = Rispòsta
    .note = Nòta
    .objectives = Obietîv
    .paragraphs = Parâgraf
    .part = Pèrt
    .problem = Problêma
    .problems = Problêmi
    .proof = Prôva
    .question = Dmanda
    .section = Seziån
    .solution = Soluziån
    .task = Cunpétt
    .theorem = Teorêma
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Cunsélli

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabèla { $enumeration }
        [numbered-title] Tabèla { $enumeration }{ ": " }
        [unnumbered-title] Tabèla{ ": " }
       *[unnumbered] Tabèla
    }
figure-name =
    { $parts ->
        [numbered] Figûra { $enumeration }
        [numbered-caption] Figûra { $enumeration }{ ": " }
        [unnumbered-caption] Figûra{ ": " }
       *[unnumbered] Figûra
    }

## Paginator controls

paginator-previous = Precedänt
paginator-next = Pròsim
paginator-page = Pàgina
paginator-page-status = { $pageLabel } { $currentPage } ed { $numPages }

## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = s'
piecewise-condition-otherwise = se nå

## Chemistry
##
## The 118 element names and the 12 anion names fall back to English.
## Schooling in Emilia is in Italian, out of Italian textbooks, so the
## periodic table a Bolognese pupil meets is `locales/it`'s. That is a fact
## about a school system rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Sìmbol chémmic brîṡa vàlid
chemistry-invalid-ionic-compound = Cunpòst iònic brîṡa vàlid

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = vûd
math-embedded-input-blank-ordinal = vûd { $ordinal } ed { $total }
