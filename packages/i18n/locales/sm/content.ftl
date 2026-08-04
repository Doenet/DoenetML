# Samoan content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Samoan has no grammatical gender, no adjective agreement for gender and no
# case ending, so `$gender` and `$role` go unused here exactly as they do in
# English, and the two `-article` branches read like the ones without.
#
# What Samoan does agree in is **number**, and it does it inside the adjective
# rather than at its edge: a family of adjectives reduplicates for a plural
# subject, «tele» → «tetele», «umi» → «uumi». Every description built here is
# of a single object, so the singular is the right form throughout — but a
# translator adding a message about several objects has to reach for the other
# form, and no argument in these messages would tell them to.
#
# Adjectives *follow* the noun they modify — «laina mafiafia mūmū» — so the
# composition messages put the noun first and keep the English order among the
# adjectives themselves.
#
# The mathematical nouns lean on loans («poini», «veta», «poligoni») where
# Samoan mathematics teaching may well have its own word. That is the first
# place a speaker should look.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black = uliuli
    .white = paʻepaʻe
    .gray = efuefu
    .red = mūmū
    .orange = moli
    .yellow = samasama
    .green = lanumeamata
    .cyan = lanumoana meamata
    .blue = lanumoana
    .purple = viole
    .pink = piniki
    .brown = enaena

line-width =
    .thick = mafiafia
    .thin = manifinifi

line-style =
    .dashed = motumotu
    .dotted = togitogi

# Noun phrases: they follow «faʻatasi ma» and modify nothing.
fill-style =
    .horizontal = laina faʻalava
    .vertical = laina faʻasaʻo
    .diagonal = laina faʻapiʻo
    .backdiagonal = laina faʻapiʻo faʻafeagai
    .dots = togitogi
    .diamonds = taimane

noun =
    .line = laina
    .line-segment = vaega o le laina
    .ray = aū
    .vector = veta
    .curve = piʻo
    .function = galuega
    .parabola = parapola
    .polyline = laina soʻoso
    .polygon = poligoni
    .triangle = tafatolu
    .rectangle = tafafā faʻalava
    .circle = liʻo
    .region = vaega
    .point = poini
    .square = tafafā tutusa
    .diamond = taimane
    .cross = koluse
    .plus = faʻailoga faʻaopoopo

# The side count follows the noun and precedes its adjectives, so it folds into
# the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligoni tutusa itu e { $numSides }
    }

# Samoan has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English.
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

# The noun leads and its adjectives follow: «laina mafiafia motumotu mūmū».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = faʻatumu

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } faʻatasi ma { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } faʻatasi ma { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } faʻatasi ma { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

style-border-clause =
    { $parts ->
        [with-article] faʻatasi ma se tuaoi { $border }
        [and] ma se tuaoi { $border }
        [and-article] ma se tuaoi { $border }
       *[with] faʻatasi ma se tuaoi { $border }
    }

# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = e leʻi faʻatumuina

style-text =
    { $parts ->
        [background] { $color } i luga o se pito i tua { $background }
       *[plain] { $color }
    }

style-background-none = leai


## Boolean words

boolean-true = moni
boolean-false = sesē


## Answer buttons

answer-submit-label = Siaki le galuega
answer-submit-label-no-correctness = Lafo le tali


## Sectional blocks

section-name =
    .activity = Gaoioiga
    .aside = Faʻamatalaga i tafatafa
    .cascade = Faʻasologa
    .definition = Faʻamatalaga
    .example = Faʻataʻitaʻiga
    .exercise = Faʻamalositino
    .exercises = Faʻamalositino
    .given-answer = Tali
    .note = Manatua
    .objectives = Sini
    .paragraphs = Palakalafa
    .part = Vaega
    .problem = Faʻafitauli
    .problems = Faʻafitauli
    .proof = Faʻamaoniga
    .question = Fesili
    .section = Vaega
    .solution = Fofō
    .task = Galuega
    .theorem = Aʻoaʻoga faʻamaonia

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Fautuaga


## Tables and figures

table-name =
    { $parts ->
        [numbered] Laulau { $enumeration }
        [numbered-title] Laulau { $enumeration }{ ": " }
        [unnumbered-title] Laulau{ ": " }
       *[unnumbered] Laulau
    }

figure-name =
    { $parts ->
        [numbered] Ata { $enumeration }
        [numbered-caption] Ata { $enumeration }{ ": " }
        [unnumbered-caption] Ata{ ": " }
       *[unnumbered] Ata
    }


## Paginator controls

paginator-previous = Muamua
paginator-next = Sosoʻo
paginator-page = Itulau

paginator-page-status = { $pageLabel } { $currentPage } mai le { $numPages }


## Piecewise functions

piecewise-condition-or = pe
piecewise-condition-if = afai
piecewise-condition-otherwise = a leai


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## There is no settled Samoan list of the 118 element names to seed from —
## secondary science in Sāmoa is taught in English — so the fallback here is
## the vocabulary a student meets in their own classroom.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Faʻailoga kemikolo lē saʻo
chemistry-invalid-ionic-compound = Tuʻufaʻatasiga ionika lē saʻo
