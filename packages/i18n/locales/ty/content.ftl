# Tahitian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Fare Vānaʻa orthography, with the ʻeta and the tārava; see
# `chrome.ftl`'s header.
#
# Tahitian has no grammatical gender and no case, so `noun-gender` answers one
# token for every noun and nothing here selects on `$gender` or on `$role`.
#
# The adjectives **follow** the noun — «reni ʻuteʻute», a red line — so every
# composition message inverts the English order, as `locales/to` and
# `locales/fj` do.
#
# **The colour words are reduplicated stems** as they are in Tongan and Fijian:
# «ʻereʻere», «teatea», «ʻuteʻute». «ninamu» is the blue of the lagoon and
# «matie» the green of growth, and the line between them is not English's line
# between blue and green; `.cyan` sits inside «ninamu» with nothing of its own,
# and what is written there is a placeholder. `.purple` and `.pink` are French
# loans, which is what Tahitian writing uses.
#
# The geometry vocabulary is largely French-derived, because schooling in French
# Polynesia is in French from the earliest grades and mathematics is taught in
# it throughout. That seam is the first thing a speaker should judge.


## Style vocabulary

color =
    .black = ʻereʻere
    .white = teatea
    .gray = rehu
    .red = ʻuteʻute
    .orange = ʻanani
    .yellow = reʻareʻa
    .green = matie
    .cyan = tianu
    .blue = ninamu
    .purple = vaiorete
    .pink = roze
    .brown = parauri
line-width =
    .thick = mātotoru
    .thin = rairai
line-style =
    .dashed = motumotu
    .dotted = tāpaʻo iti
# Noun phrases. Tahitian marks no plural on the noun, so «reni» is the word for
# one line and for many alike.
fill-style =
    .horizontal = reni tāʻōtiʻa
    .vertical = reni tiʻa
    .diagonal = reni pīʻao
    .backdiagonal = reni pīʻao huri
    .dots = tāpaʻo iti
    .diamonds = tiamane
noun =
    .line = reni
    .line-segment = tuhaʻa reni
    .ray = hihi
    .vector = vetetera
    .curve = pīʻao
    .function = fonotio
    .parabola = parabole
    .polyline = reni ʻāfaʻifaʻi
    .polygon = poligone
    .triangle = tapatoru
    .rectangle = tapafā roa
    .circle = ʻāpōpōti
    .region = tuhaʻa fenua
    .point = poini
    .square = tapafā ʻaifaito
    .diamond = tiamane
    .cross = ʻafaʻifaʻi
    .plus = tāpiʻi
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they describe.
noun-regular-polygon =
    { $part ->
        [tail] e { $numSides } hiti tōna
       *[head] poligone ʻaifaito
    }
# One answer for every noun: Tahitian has no grammatical gender.
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
# The noun first and the adjectives behind it, which is the opposite of English.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = ʻī
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } e { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } e { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } e { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Tahitian's «te» is the article and is not what English's "a" is doing here, so
# all four branches read alike but for the connective: «e» opens the first
# clause and «ʻe» a further one.
style-border-clause =
    { $parts ->
        [with-article] e hiti { $border }
        [and] ʻe hiti { $border }
        [and-article] ʻe hiti { $border }
       *[with] e hiti { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = ʻī ʻore
style-text =
    { $parts ->
        [background] { $color } e niʻa { $background }
       *[plain] { $color }
    }
style-background-none = ʻaita

## Boolean words

boolean-true = mau
boolean-false = hape

## Answer buttons

answer-submit-label = Hiʻopoʻa i te ʻohipa
answer-submit-label-no-correctness = Hōpoi i te pāhonoraʻa

## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Tahitian marks no plural on the noun.
section-name =
    .activity = ʻOhipa
    .aside = Nota hiti
    .cascade = Kasakade
    .definition = Faʻataʻaraʻa
    .example = Hiʻoraʻa
    .exercise = Tāmataraʻa
    .exercises = Tāmataraʻa
    .given-answer = Pāhonoraʻa
    .note = Nota
    .objectives = Fā
    .paragraphs = Paratarafe
    .part = Tuhaʻa
    .problem = Fifi
    .problems = Fifi
    .proof = Haʻapāpūraʻa
    .question = Uiraʻa
    .section = Tuhaʻa
    .solution = Ravaʻi
    .task = ʻOhipa rave
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
hint-title = Aratairaʻa

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
        [numbered] Hōhoʻa { $enumeration }
        [numbered-caption] Hōhoʻa { $enumeration }{ ": " }
        [unnumbered-caption] Hōhoʻa{ ": " }
       *[unnumbered] Hōhoʻa
    }

## Paginator controls

paginator-previous = I mua
paginator-next = I muri
paginator-page = ʻĀpī
paginator-page-status = { $pageLabel } { $currentPage } nō roto i te { $numPages }

## Piecewise functions

piecewise-condition-or = aore rā
piecewise-condition-if = mai te mea
piecewise-condition-otherwise = mai te mea ʻaita

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Secondary science in French Polynesia is taught in French, out of
## French textbooks, so the chemical vocabulary a pupil meets is `locales/fr`'s.
## Tahitian is the language of the early grades and of the classroom talk around
## the lesson; there is no settled Tahitian table for a seed to reproduce. That
## is the `locales/ht` case with a different colonial language on the other side
## of it.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Tāpaʻo tāʻiʻaʻi tano ʻore
chemistry-invalid-ionic-compound = Faʻaʻamuraʻa ionika tano ʻore
