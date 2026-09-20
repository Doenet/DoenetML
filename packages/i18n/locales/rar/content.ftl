# Rarotongan / Cook Islands Māori (Te reo Māori Kūki ʻĀirani) content catalog:
# the prose the core computes into the document. Selected by `documentLocale`
# — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The variety, the orthography, the amata character (U+02BB), the
# correspondence table against `locales/mi` and `locales/ty`, the number
# situation and the loan policy are all set out once in the header of
# `chrome.ftl` and are not repeated here. Read that file first.
#
# **This file is the canonical vocabulary for all four.** The `noun` table
# below is what `diagnostics.ftl` and `editor.ftl` reach for when they need a
# word for a line, a point, a region or a function, and a change here should
# be carried into them.
#
# **No grammatical gender.** `noun-gender` answers one token, no adjective in
# these files forks on `$gender`, and there is no `$role` fork either: a
# Rarotongan describing word is the same standing alone and inside a clause.
#
# **Word order: the noun leads and its describing words follow it** —
# «rārangi mātotoru muramura», where English says «thick red line». That is
# what `locales/mi`, `locales/ty`, `locales/sm` and `locales/to` all do, and
# it is the one thing in this file checked against the siblings rather than
# inferred. The composition messages at the foot of the file are where that
# shows, and they are the part of this catalog a speaker is most likely to
# keep.
#
# **Colour.** «ʻereʻere», «teatea», «matie», «ninamu», «renga», «muramura»
# and «parauri» are the everyday colour words. Two things a reviewer should
# look at: `.cyan` is written «ninamu matie», a **coinage**, because Rarotongan
# divides the blue-green range differently from English and «ninamu» covers
# much of it on its own; and `.purple` and `.pink` are **English loans spelled
# to Rarotongan phonology** — «pāpura», «pīniki» — which is where this file
# parts company with `locales/ty`, whose «vaiorete» and «roze» are French. The
# loans are marked rather than dressed up, and a speaker who has the real
# words should put them in.
#
# **The geometry and analysis vocabulary is where the seed stops.** Cook
# Islands secondary mathematics is taught in English, and this seed could not
# reach settled Rarotongan terms for *vector*, *function*, *parabola*,
# *polygon*, *polyline*, *slope field* or *vector field*. Those seven keep the
# **English word, in English spelling**, and are marked here rather than given
# an invented Polynesian form — the `locales/kos` policy applied to one seam
# instead of to a whole residue. Everything a Rarotongan speaker has a word for —
# line, point, edge, region, triangle, square, circle, curve — is written in
# Rarotongan. That seam is the first thing to judge.
#
# **Coinages in this file, for a reviewer to confirm or replace:** «porotaka»
# circle, «tapavā ʻaiteite» square, «tapavā roa» rectangle, «tuʻanga rārangi»
# line segment, «rārangi tū» vertical line beside «rārangi ʻāpapa» horizontal
# one, «papa muri» background, «ʻakakāʻiroʻanga» compound. The one derived by
# **sound correspondence rather than found** is `.ray` «ʻiʻi», regularly from
# the «hihi» both siblings write; that is `locales/sms`'s method and carries
# `locales/sms`'s warning with it.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are not written here, so those 130 keys fall back to
# English and `lint:i18n` reports the gap. Chemistry in Cook Islands schools
# is taught in English, out of English textbooks, and there is no settled
# Rarotongan periodic table for a seed to reproduce; a column of invented
# element names would report a fact about a curriculum that does not exist
# rather than a fact about the language. That is `locales/ty`'s case with
# English on the other side of it instead of French, and it is also
# `locales/sm`'s and `locales/mi`'s. Every other key in
# `locales/en/content.ftl` is covered, including the two new
# `math-embedded-input-blank` keys.
#
# `noun-regular-polygon` reaches `[tail]`, as `locales/ty` does and unlike
# `locales/mi`: a side count in Rarotongan is a clause of possession — «e 5
# tapa tōna», "it has five sides" — and a clause follows the whole phrase
# rather than folding into the head. That is the deliberate disagreement with
# the Māori sibling in this file.


## Style vocabulary

color =
    .black = ʻereʻere
    .white = teatea
    .gray = rehu
    .red = muramura
    .orange = ʻanani
    .yellow = renga
    .green = matie
    .cyan = ninamu matie
    .blue = ninamu
    .purple = pāpura
    .pink = pīniki
    .brown = parauri
line-width =
    .thick = mātotoru
    .thin = rairai
line-style =
    .dashed = motumotu
    .dotted = ira
# Noun phrases. Rarotongan marks no number on the noun, so «rārangi» is the
# word for one line and for many alike.
fill-style =
    .horizontal = rārangi ʻāpapa
    .vertical = rārangi tū
    .diagonal = rārangi piʻo
    .backdiagonal = rārangi piʻo huri
    .dots = ira
    .diamonds = taimana
# `.vector`, `.function`, `.slope-field`, `.vector-field`, `.parabola` and
# `.polygon`/`.polyline` keep the English word; the file header says why.
noun =
    .line = rārangi
    .line-segment = tuʻanga rārangi
    .ray = ʻiʻi
    .vector = vector
    .curve = piʻo
    .function = function
    .slope-field = slope field
    .vector-field = vector field
    .parabola = parabola
    .polyline = polyline
    .polygon = polygon
    .triangle = tapatoru
    .rectangle = tapavā roa
    .circle = porotaka
    .region = ngāʻi
    .point = ira
    .square = tapavā ʻaiteite
    .diamond = taimana
    .cross = ripeka
    .plus = tāpaʻo tāpiri
# The side count is a clause of possession and follows the whole phrase, so it
# is the tail rather than the head: «polygon ʻaiteite mātotoru e 5 tapa tōna».
noun-regular-polygon =
    { $part ->
        [tail] e { $numSides } tapa tōna
       *[head] polygon ʻaiteite
    }
# One answer for every noun: Rarotongan has no grammatical gender.
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
# The noun leads and its describing words follow it, which is the opposite of
# English: «rārangi mātotoru muramura».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = kī
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ma { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ma { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } ma { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «te» is the article and is not doing what English's "a" does here, so all
# four branches read alike but for the connective: «ma» opens the first clause
# and «e ma» a further one.
style-border-clause =
    { $parts ->
        [with-article] ma te tapa { $border }
        [and] e ma te tapa { $border }
        [and-article] e ma te tapa { $border }
       *[with] ma te tapa { $border }
    }
# The pattern is the noun and the colour follows it, as everywhere else here.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = kī kore
style-text =
    { $parts ->
        [background] { $color } i runga i te papa muri { $background }
       *[plain] { $color }
    }
style-background-none = kāre

## Boolean words

boolean-true = mou
boolean-false = mou kore

## Answer buttons

answer-submit-label = ʻAkara i te angaʻanga
answer-submit-label-no-correctness = Tuku i te pauʻanga

## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Rarotongan marks no number on the noun.
section-name =
    .activity = Angaʻanga
    .aside = Tuatua ʻaoʻao
    .cascade = Cascade
    .definition = ʻAkatakaʻanga
    .example = ʻAkaraʻanga
    .exercise = Tāmataʻanga
    .exercises = Tāmataʻanga
    .given-answer = Pauʻanga
    .note = Tuatua poto
    .objectives = ʻAkakoroʻanga
    .paragraphs = Parakarafa
    .part = Tuʻanga
    .problem = Manamanatā
    .problems = Manamanatā
    .proof = ʻAkapapūʻanga
    .question = Uiʻanga
    .section = Tuʻanga
    .solution = Ravenga
    .task = Angaʻanga
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
hint-title = Aratakiʻanga

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tāpura { $enumeration }
        [numbered-title] Tāpura { $enumeration }{ ": " }
        [unnumbered-title] Tāpura{ ": " }
       *[unnumbered] Tāpura
    }
figure-name =
    { $parts ->
        [numbered] Tūtū { $enumeration }
        [numbered-caption] Tūtū { $enumeration }{ ": " }
        [unnumbered-caption] Tūtū{ ": " }
       *[unnumbered] Tūtū
    }

## Paginator controls

paginator-previous = Mua
paginator-next = Muri
paginator-page = Kapi
paginator-page-status = { $pageLabel } { $currentPage } o { $numPages }

## Piecewise functions

# «me kore» stands between the two domains, which is where the core writes it
# and where Rarotongan wants it. «me» opens the clause it introduces, so
# `piecewise-condition-if` lands correctly here — unlike the clause-final
# particles `locales/dv`, `locales/kca` and `locales/mns` had to record.
piecewise-condition-or = me kore
piecewise-condition-if = me
piecewise-condition-otherwise = me kāre i te reira

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately not written here;
## the file header says why. The three keys below are prose rather than a
## periodic table, so they are covered. «kemitiri» is an English loan spelled
## to Rarotongan phonology, and so is «ionika».

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Tāpaʻo kemitiri tano kore
chemistry-invalid-ionic-compound = ʻAkakāʻiroʻanga ionika tano kore

## Inputs embedded in math

# «vā» is the gap or space between two things, and is short enough to be read
# aloud inside an expression without swamping it.
math-embedded-input-blank = vā
math-embedded-input-blank-ordinal = vā { $ordinal } o { $total }
