# Haitian Creole content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was written
# in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the official orthography of 1979.
#
# This is the most **analytic** catalog in the roster, and it is worth saying so
# plainly: not one message in it selects on `$gender` or on `$role`. Creole has
# no grammatical gender, no case, no adjective agreement and no plural suffix,
# so `noun-gender` answers one token for every noun and every describing word is
# cited once. What the composition messages below do is order and choose —
# nothing more — and that is the whole of the work here.
#
# The adjectives **follow** the noun, so those messages invert the English
# order. Because nothing agrees, the fill-pattern words can be postposed
# directly — «dyaman ble» for "blue diamonds" — where `locales/oc` had to
# supply a head noun for its plural pattern words to hang off.
#
# `noun-regular-polygon` splits the way `locales/es` does: the head is «poligòn
# regilye» and the side count follows the adjectives as a relative clause, «ki
# gen N kote», so the adjectives stay beside the noun. That is the `[noun-tail]`
# branch of `style-with-noun`, and it is reached in a language with no agreement
# to protect — the split turns out to be about word order as much as about
# agreement.


## Style vocabulary

color =
    .black = nwa
    .white = blan
    .gray = gri
    .red = wouj
    .orange = zoranj
    .yellow = jòn
    .green = vèt
    .cyan = sian
    .blue = ble
    .purple = vyolèt
    .pink = woz
    .brown = mawon

line-width =
    .thick = epè
    .thin = fen

line-style =
    .dashed = an tirè
    .dotted = an pwentiye

# Noun phrases. «liy» is the same word for one line and for many, so these are
# not plurals of anything — they are what the language says in both places.
fill-style =
    .horizontal = liy orizontal
    .vertical = liy vètikal
    .diagonal = liy dyagonal
    .backdiagonal = liy dyagonal envès
    .dots = pwen
    .diamonds = dyaman

noun =
    .line = liy
    .line-segment = segman
    .ray = demi-dwat
    .vector = vektè
    .curve = koub
    .function = fonksyon
    .parabola = parabòl
    .polyline = liy brize
    .polygon = poligòn
    .triangle = triyang
    .rectangle = rektang
    .circle = sèk
    .region = rejyon
    .point = pwen
    .square = kare
    .diamond = dyaman
    .cross = kwa
    .plus = plis

noun-regular-polygon =
    { $part ->
        [tail] ki gen { $numSides } kote
       *[head] poligòn regilye
    }

# One answer for every noun: Creole has no grammatical gender, so nothing
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

# The noun first and the adjectives after it, which is the opposite of English.
# The regular polygon's complement follows both.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = ranpli

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ak { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ak { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } ak { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

style-border-clause =
    { $parts ->
        [with-article] ak yon bòdi { $border }
        [and] epi bòdi { $border }
        [and-article] epi yon bòdi { $border }
       *[with] ak bòdi { $border }
    }

# The pattern words are postposed straight onto the colour — «dyaman ble» —
# because there is no agreement for a head noun to carry. That is the one place
# this catalog is shorter than a Romance one rather than merely different.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = san ranpli

style-text =
    { $parts ->
        [background] { $color } ak yon fon { $background }
       *[plain] { $color }
    }

style-background-none = anyen


## Boolean words

boolean-true = vre
boolean-false = fo


## Answer buttons

answer-submit-label = Tcheke travay la
answer-submit-label-no-correctness = Voye repons la


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are the same
# word: the plural is «yo» and a heading does not carry it. Two ids with one
# translation is what a language with no plural suffix looks like here, not a
# copy-paste.
section-name =
    .activity = Aktivite
    .aside = Nòt sou kote
    .cascade = Kaskad
    .definition = Definisyon
    .example = Egzanp
    .exercise = Egzèsis
    .exercises = Egzèsis
    .given-answer = Repons
    .note = Nòt
    .objectives = Objektif
    .paragraphs = Paragraf
    .part = Pati
    .problem = Pwoblèm
    .problems = Pwoblèm
    .proof = Prèv
    .question = Kesyon
    .section = Seksyon
    .solution = Solisyon
    .task = Travay
    .theorem = Teyorèm

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Endikasyon


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tablo { $enumeration }
        [numbered-title] Tablo { $enumeration }{ ": " }
        [unnumbered-title] Tablo{ ": " }
       *[unnumbered] Tablo
    }

figure-name =
    { $parts ->
        [numbered] Figi { $enumeration }
        [numbered-caption] Figi { $enumeration }{ ": " }
        [unnumbered-caption] Figi{ ": " }
       *[unnumbered] Figi
    }


## Paginator controls

paginator-previous = Anvan
paginator-next = Apre
paginator-page = Paj

paginator-page-status = { $pageLabel } { $currentPage } sou { $numPages }


## Piecewise functions

piecewise-condition-or = oswa
piecewise-condition-if = si
piecewise-condition-otherwise = sinon


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Haitian secondary science is taught in French, out of French
## textbooks, so the chemical vocabulary a pupil meets is `locales/fr`'s. Creole
## is the language of the early grades and of the classroom talk around the
## lesson; the periodic table on the wall is in French, and there is no settled
## Creole table for a seed to reproduce.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Senbòl chimik ki pa valab
chemistry-invalid-ionic-compound = Konpoze yonik ki pa valab
