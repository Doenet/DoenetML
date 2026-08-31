# Arpitan / Franco-Provençal (arpetan) content catalog: the prose the core
# computes into the document. Selected by `documentLocale` — the language the
# activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script, in **ORB** (*Orthographe de
# Référence B*, Stich 2003), the supradialectal spelling the Arpitan
# Wikipedia and the Aliance Culturèla Arpitana use, exactly as `chrome.ftl`
# sets it out: «ê é è â ô», the **«cll» / «gll» digraphs** («cèrcllo»,
# «triangllo», «rèctangllo»), silent etymological finals («pouent», «fôx»,
# «crouèx»), and the feminine in `-a`.
#
# **Word order: the adjective follows the noun.** Arpitan is Gallo-Romance
# and postposes its describing words, so the composition messages at the foot
# of this file **invert** the English order: `style-with-noun` and
# `style-filled-with-noun` put «{ $noun }» in front of «{ $description }».
#
# **The catalog really agrees.** Arpitan has two genders and a live feminine
# in `-a` / `-e`, so every adjective below selects on `$gender`:
# «nêr/nêra», «blanc/blanche», «gris/grisa», «rojo/roja», «jôno/jôna»,
# «vèrt/vèrta», «blu/blua», «violèt/violèta», «brun/bruna»,
# «èpès/èpèssa», «rempli/remplia». Three colour words are **invariable** —
# «rôsa», plus the loans «orange» and «cian» — and are cited in one shape.
# The uneven table is a fact about Arpitan adjective morphology, not an
# unfinished branch. Nothing selects on `$role`: a clause position is carried
# by a preposition here, never by the adjective's own form.
#
# **The two dash patterns are prepositional phrases, not adjectives.**
# «a trèts» (dashed) and «a pouents» (dotted) are how Arpitan says it, and a
# phrase cannot sit between two adjectives, so `style-stroke` **reorders**
# the pieces to width – colour – pattern. A thick dashed red line therefore
# reads «legne èpèssa roja a trèts», not the English width-style-colour
# order. This is the one place the catalog changes the sequence of the
# description rather than only its word forms.
#
# **The word for a line.** `noun.line` is «legne» (f) — the everyday Arpitan
# word for a drawn line or a row — because this file describes *strokes on a
# page*. `diagnostics.ftl` says «drêta» where the `<line>` component is meant
# as a geometric object. The split is deliberate and is stated in both
# headers; a reviewer who wants one word throughout should pick «drêta» and
# say so.
#
# `noun-regular-polygon` splits the way French does: the head is «polygono
# règuliér» and the tail «a N coutès», and `style-with-noun` puts the tail
# straight after the head so the complement stays beside the noun it belongs
# to rather than being stranded behind the adjectives.
#
# **What is borrowed.** The colours, the shapes, the everyday words and the
# connectives are Arpitan: «legne», «pouent», «carrâ», «crouèx», «corba»,
# «bôrdura», «coutè», «fond», «avouéc», «sen», «sur», «ou», «se»,
# «ôtrament», «veré», «fôx», «ren». The mathematical and editorial nouns are
# **French, respelled by ORB's rules**: «segment», «vèctor», «fonccion»,
# «parabola», «polygono», «triangllo», «rèctangllo», «cèrcllo», «règion»,
# «orizontâl», «vèrticâl», «diagonâl», «activitât», «dèfinicion»,
# «ègzemplo», «ègzèrcicio», «objèctif», «paragrafo», «tèorèmo», «solucion»,
# «cascada», «tablô», «figura», «symbolo», «composâ», «ionico». «losange»
# for a diamond and «remplissâjo» for a fill are the two least certain words
# in the file.
#
# **Counts.** `Intl.PluralRules` has **no CLDR data for `frp`**, so no
# `[zero]`, `[two]`, `[few]` or `[many]` branch appears anywhere in this
# catalog — and nothing in this file counts, so no message here writes a
# plural select at all. `noun-regular-polygon` says «a 1 coutè» and «a 5
# coutès» with one word: the numeral does the work and this catalog does not
# inflect around it.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# There is no published Arpitan list of the hundred and eighteen elements,
# and secondary science across the Arpitan area is taught in **French** (in
# Savoy, the Lyonnais and Romandy) or in **Italian** (in the Val d'Aosta) —
# the periodic table an Arpitan-speaking pupil actually meets is `locales/fr`'s
# or `locales/it`'s. `lint:i18n` reporting the two keys as missing coverage
# is the correct report. `ion-name-oxidation-state` and the two
# invalid-symbol messages **are** covered: they are frames, not vocabulary.
#
# Arpitan is written with French typography, with a space before `:`, `;`,
# `?` and `!`; `section-title-prefix` and the table and figure names carry
# that space in their separators.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] nêra
           *[m] nêr
        }
    .white =
        { $gender ->
            [f] blanche
           *[m] blanc
        }
    .gray =
        { $gender ->
            [f] grisa
           *[m] gris
        }
    .red =
        { $gender ->
            [f] roja
           *[m] rojo
        }
    .orange = orange
    .yellow =
        { $gender ->
            [f] jôna
           *[m] jôno
        }
    .green =
        { $gender ->
            [f] vèrta
           *[m] vèrt
        }
    .cyan = cian
    .blue =
        { $gender ->
            [f] blua
           *[m] blu
        }
    .purple =
        { $gender ->
            [f] violèta
           *[m] violèt
        }
    .pink = rôsa
    .brown =
        { $gender ->
            [f] bruna
           *[m] brun
        }
line-width =
    .thick =
        { $gender ->
            [f] èpèssa
           *[m] èpès
        }
    .thin =
        { $gender ->
            [f] fina
           *[m] fin
        }
# Prepositional phrases, not adjectives: they agree with nothing, and
# `style-stroke` moves them behind the colour for that reason.
line-style =
    .dashed = a trèts
    .dotted = a pouents
# Plural noun phrases, which is what follows «avouéc des» in `style-filled`.
# They agree with nothing.
fill-style =
    .horizontal = legnes orizontâles
    .vertical = legnes vèrticâles
    .diagonal = legnes diagonâles
    .backdiagonal = legnes diagonâles a l'envèrs
    .dots = pouents
    .diamonds = losanges
noun =
    .line = legne
    .line-segment = segment
    .ray = dèmi-drêta
    .vector = vèctor
    .curve = corba
    .function = fonccion
    .slope-field = champ des pendes
    .vector-field = champ des vèctors
    .parabola = parabola
    .polyline = legne brisiê
    .polygon = polygono
    .triangle = triangllo
    .rectangle = rèctangllo
    .circle = cèrcllo
    .region = règion
    .point = pouent
    .square = carrâ
    .diamond = losange
    .cross = crouèx
    .plus = sègno plus
# The head carries the agreement and the tail closes the phrase, so the side
# count stays beside its own noun. «coutè» is regular: «a 1 coutè»,
# «a 5 coutès» — the numeral does the counting and the noun follows it.
noun-regular-polygon =
    { $part ->
        [tail] a { $numSides } coutès
       *[head] polygono règuliér
    }
# Besides the nouns above, `$noun` can be `regular-polygon` («polygono», m)
# or the head of a phrase the description never names: `border` («bôrdura»,
# f), `fill` («remplissâjo», m), `text` («tèxto», m), `background» («fond»,
# m).
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
        [border] f
       *[other] m
    }

## Style composition

# The order is width – colour – pattern, not English's width – pattern –
# colour: «a trèts» and «a pouents» are prepositional phrases and cannot
# stand between two adjectives.
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
# The noun leads and its adjectives follow, which is the opposite of English.
# A noun that splits keeps its complement beside its own head: «polygono
# règuliér a 5 coutès èpès rojo».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [f] remplia
       *[m] rempli
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } avouéc des { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } avouéc des { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } avouéc des { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «bôrdura» is feminine, so the border's adjectives agree with it and not
# with the shape it surrounds. Arpitan wants the article in every branch, so
# only the conjunction tells the four apart.
style-border-clause =
    { $parts ->
        [with-article] avouéc una bôrdura { $border }
        [and] et una bôrdura { $border }
        [and-article] et una bôrdura { $border }
       *[with] avouéc una bôrdura { $border }
    }
# The fill-pattern words are plural nouns, because their other use is the
# «avouéc des { $pattern }» clause above. So this message supplies a noun for
# the colour to hang off — «remplissâjo», masculine, which is the gender
# `noun-gender` already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] remplissâjo { $color } avouéc des { $pattern }
       *[plain] remplissâjo { $color }
    }
style-unfilled = pas rempli
style-text =
    { $parts ->
        [background] { $color } sur un fond { $background }
       *[plain] { $color }
    }
style-background-none = gins

## Boolean words

boolean-true = veré
boolean-false = fôx

## Answer buttons

answer-submit-label = Vèrifiar lo travâly
answer-submit-label-no-correctness = Mandar la rèponsa

## Sectional blocks

section-name =
    .activity = Activitât
    .aside = Nota a coutiér
    .cascade = Cascada
    .definition = Dèfinicion
    .example = Ègzemplo
    .exercise = Ègzèrcicio
    .exercises = Ègzèrcicios
    .given-answer = Rèponsa
    .note = Nota
    .objectives = Objèctifs
    .paragraphs = Paragrafos
    .part = Partia
    .problem = Problèmo
    .problems = Problèmos
    .proof = Dèmonstracion
    .question = Quèstion
    .section = Sèccion
    .solution = Solucion
    .task = Tâche
    .theorem = Tèorèmo
# Arpitan is written with French typography and puts a space before a colon,
# which is why the separator is not the English one.
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ " : " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ " : " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Endice

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tablô { $enumeration }
        [numbered-title] Tablô { $enumeration }{ " : " }
        [unnumbered-title] Tablô{ " : " }
       *[unnumbered] Tablô
    }
figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ " : " }
        [unnumbered-caption] Figura{ " : " }
       *[unnumbered] Figura
    }

## Paginator controls

paginator-previous = Prècèdent
paginator-next = Siuvent
paginator-page = Pâge
paginator-page-status = { $pageLabel } { $currentPage } sur { $numPages }

## Piecewise functions

piecewise-condition-or = ou
piecewise-condition-if = se
piecewise-condition-otherwise = ôtrament

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Science across the Arpitan area is taught in French or, in the
## Val d'Aosta, in Italian: the periodic table on the classroom wall is one
## of those two, and there is no settled Arpitan table for a seed to
## reproduce. See the header.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Symbolo chimico pas valablo
chemistry-invalid-ionic-compound = Composâ ionico pas valablo

## Inputs embedded in math

math-embedded-input-blank = blanc
math-embedded-input-blank-ordinal = blanc { $ordinal } sur { $total }
