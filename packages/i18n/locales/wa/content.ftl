# Walloon (walon) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script, in the *rifondou walon* unified
# spelling, exactly as `chrome.ftl` sets it out: «å», «ae», «xh», «dj»,
# «tch», «sh», and the space after a clitic apostrophe («l' roye»,
# «d' costés»). The **Feller system**, the dialect-by-dialect notation of the
# printed literature, is the alternative and none of it is mixed in here.
#
# **Word order: the adjective follows the noun.** Walloon is Gallo-Romance
# and postposes its describing words, so the composition messages at the foot
# of this file **invert** the English order: `style-with-noun` and
# `style-filled-with-noun` put «{ $noun }» in front of «{ $description }».
#
# **The catalog really agrees.** Walloon has two genders and a live feminine
# in `-e`, so every adjective below selects on `$gender`: «noer/noere»,
# «blanc/blanke», «vert/verte», «bleu/bleuwe», «violet/violete»,
# «brun/brune», «gris/grise», «spès/spesse», «fén/fene»,
# «rimpli/rimpleye». Four colour words are **invariable** — «rodje»,
# «djaene», «rôze», «orandje», plus the loan «cyan» — and are cited in one
# shape. The uneven table is a fact about Walloon adjective morphology, not
# an unfinished branch. Nothing selects on `$role`: a clause position is
# carried by a preposition here, never by the adjective's own form.
#
# **The two dash patterns are prepositional phrases, not adjectives.**
# «a trets» (dashed) and «a ponts» (dotted) are how Walloon says it, and
# a phrase cannot sit between two adjectives, so `style-stroke` **reorders**
# the pieces to width – colour – pattern. A thick dashed red line therefore
# reads «roye spesse rodje a trets», not the English width-style-colour
# order. This is the one place the catalog changes the sequence of the
# description rather than only its word forms.
#
# **The word for a line.** `noun.line` is «roye» (f) — the Walloon word for a
# drawn line, a stripe, a row — because this file describes *strokes on a
# page*. `diagnostics.ftl` says «droete» where the `<line>` component is
# meant as a geometric object. The split is deliberate and is stated in both
# headers; a reviewer who wants one word throughout should pick «droete» and
# say so.
#
# `noun-regular-polygon` splits the way French does: the head is «poligone
# regulî» and the tail «a N costés», and `style-with-noun` puts the tail
# straight after the head so the complement stays beside the noun it belongs
# to rather than being stranded behind the adjectives.
#
# **What is borrowed.** The colours, the shapes, the everyday words and the
# connectives are Walloon: «roye», «pont», «cwåré», «lozindje», «croes»,
# «coûbe», «boirdeure», «costé», «fond», «avou», «sins», «so», «ou», «si»,
# «ôtrumint», «vraiy», «fås», «rén». The mathematical and editorial nouns are
# **French, respelled by rifondou rules**: «segmint», «vecteur», «fonccion»,
# «parabole», «poligone», «triyangue», «rectangue», «ceke», «redjon»,
# «orizontå», «verticå», «diyagonå», «activité», «definicion», «egzimpe»,
# «egzercice», «objectif», «paragrafe», «teyorinme», «solucion», «cascåde»,
# «tåvlea», «figure», «simbole», «compôzé», «ionike». «ceke» for *circle* and
# «rimplixhaedje» for *fill* are the two least certain words in the file.
#
# **Counts.** CLDR has its own plural data for `wa` (`one`, `other`), and
# Walloon's `one` covers zero as well as one. Nothing in this file counts,
# so no message here writes a plural select at all; `noun-regular-polygon`
# says «a 1 costé» and «a 5 costés» with one word, since the numeral does the
# work and this catalog does not inflect around it.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# There is no published Walloon list of the hundred and eighteen elements,
# and secondary science in Wallonia is taught in **French**, from French
# textbooks — the periodic table a Walloon pupil actually meets is
# `locales/fr`'s. `lint:i18n` reporting the two keys as missing coverage is
# the correct report. `ion-name-oxidation-state` and the two invalid-symbol
# messages **are** covered: they are frames, not vocabulary.
#
# Walloon punctuates as French does, with a space before `:`, `;`, `?` and
# `!`; `section-title-prefix` and the table and figure names carry that space
# in their separators.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] noere
           *[m] noer
        }
    .white =
        { $gender ->
            [f] blanke
           *[m] blanc
        }
    .gray =
        { $gender ->
            [f] grise
           *[m] gris
        }
    .red = rodje
    .orange = orandje
    .yellow = djaene
    .green =
        { $gender ->
            [f] verte
           *[m] vert
        }
    .cyan = cyan
    .blue =
        { $gender ->
            [f] bleuwe
           *[m] bleu
        }
    .purple =
        { $gender ->
            [f] violete
           *[m] violet
        }
    .pink = rôze
    .brown =
        { $gender ->
            [f] brune
           *[m] brun
        }
line-width =
    .thick =
        { $gender ->
            [f] spesse
           *[m] spès
        }
    .thin =
        { $gender ->
            [f] fene
           *[m] fén
        }
# Prepositional phrases, not adjectives: they agree with nothing, and
# `style-stroke` moves them behind the colour for that reason.
line-style =
    .dashed = a trets
    .dotted = a ponts
# Plural noun phrases, which is what follows «avou» in `style-filled`. They
# agree with nothing.
fill-style =
    .horizontal = royes orizontåles
    .vertical = royes verticåles
    .diagonal = royes diyagonåles
    .backdiagonal = royes diyagonåles al riviêre
    .dots = ponts
    .diamonds = lozindjes
noun =
    .line = roye
    .line-segment = segmint
    .ray = dimeye-droete
    .vector = vecteur
    .curve = coûbe
    .function = fonccion
    .slope-field = tchamp des pintes
    .vector-field = tchamp des vecteurs
    .parabola = parabole
    .polyline = roye brizeye
    .polygon = poligone
    .triangle = triyangue
    .rectangle = rectangue
    .circle = ceke
    .region = redjon
    .point = pont
    .square = cwåré
    .diamond = lozindje
    .cross = croes
    .plus = sene di plus
# The head carries the agreement and the tail closes the phrase, so the side
# count stays beside its own noun. «costé» is regular: «a 1 costé»,
# «a 5 costés» — the numeral does the counting and the noun follows it.
noun-regular-polygon =
    { $part ->
        [tail] a { $numSides } costés
       *[head] poligone regulî
    }
# Besides the nouns above, `$noun` can be `regular-polygon` («poligone», m)
# or the head of a phrase the description never names: `border` («boirdeure»,
# f), `fill` («rimplixhaedje», m), `text` («tecse», m), `background»
# («fond», m).
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [region] f
        [diamond] f
        [cross] f
        [border] f
       *[other] m
    }

## Style composition

# The order is width – colour – pattern, not English's width – pattern –
# colour: «a trets» and «a ponts» are prepositional phrases and cannot stand
# between two adjectives.
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
# A noun that splits keeps its complement beside its own head: «poligone
# regulî a 5 costés spès rodje».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [f] rimpleye
       *[m] rimpli
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } avou des { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } avou des { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } avou des { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «boirdeure» is feminine, so the border's adjectives agree with it and not
# with the shape it surrounds. Walloon wants the article in every branch, so
# only the conjunction tells the four apart.
style-border-clause =
    { $parts ->
        [with-article] avou ene boirdeure { $border }
        [and] et ene boirdeure { $border }
        [and-article] et ene boirdeure { $border }
       *[with] avou ene boirdeure { $border }
    }
# The fill-pattern words are plural nouns, because their other use is the
# «avou des { $pattern }» clause above. So this message supplies a noun for
# the colour to hang off — «rimplixhaedje», masculine, which is the gender
# `noun-gender` already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] rimplixhaedje { $color } avou des { $pattern }
       *[plain] rimplixhaedje { $color }
    }
style-unfilled = nén rimpli
style-text =
    { $parts ->
        [background] { $color } so on fond { $background }
       *[plain] { $color }
    }
style-background-none = pont

## Boolean words

boolean-true = vraiy
boolean-false = fås

## Answer buttons

answer-submit-label = Verifyî l' ovraedje
answer-submit-label-no-correctness = Evoyî l' response

## Sectional blocks

section-name =
    .activity = Activité
    .aside = Note a costé
    .cascade = Cascåde
    .definition = Definicion
    .example = Egzimpe
    .exercise = Egzercice
    .exercises = Egzercices
    .given-answer = Response
    .note = Note
    .objectives = Buts
    .paragraphs = Paragrafes
    .part = Pårteye
    .problem = Problinme
    .problems = Problinmes
    .proof = Preuve
    .question = Kesse
    .section = Seccion
    .solution = Solucion
    .task = Bouye
    .theorem = Teyorinme
# Walloon puts a space before a colon, which is why the separator is not the
# English one.
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ " : " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ " : " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Indice

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tåvlea { $enumeration }
        [numbered-title] Tåvlea { $enumeration }{ " : " }
        [unnumbered-title] Tåvlea{ " : " }
       *[unnumbered] Tåvlea
    }
figure-name =
    { $parts ->
        [numbered] Figure { $enumeration }
        [numbered-caption] Figure { $enumeration }{ " : " }
        [unnumbered-caption] Figure{ " : " }
       *[unnumbered] Figure
    }

## Paginator controls

paginator-previous = Divant
paginator-next = Shuvant
paginator-page = Pådje
paginator-page-status = { $pageLabel } { $currentPage } so { $numPages }

## Piecewise functions

piecewise-condition-or = ou
piecewise-condition-if = si
piecewise-condition-otherwise = ôtrumint

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Secondary science in Wallonia is taught in French, out of French
## textbooks, so the chemical vocabulary a pupil meets is `locales/fr`'s
## rather than a Walloon table — there is nothing settled here for a seed to
## reproduce. See the header.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbole chimike nén valåbe
chemistry-invalid-ionic-compound = Compôzé ionike nén valåbe

## Inputs embedded in math

math-embedded-input-blank = blanc
math-embedded-input-blank-ordinal = blanc { $ordinal } so { $total }
