# Sicilian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Sicilian adjectives **follow** the noun and agree with it, so the composition
# messages invert the English order and every describing word that inflects
# selects on `$gender`. Nothing selects on `$role`: a clause position is
# carried by a preposition and never by the adjective.
#
# The adjectives that end in `-i` in the singular — «virdi», «suttili» — have
# one form for both genders, as do the loans «aranciu», «cianu», «viola»,
# «rosa» and «marruni», so all of those are cited in one shape.
#
# `noun-regular-polygon` splits: the side count follows the adjectives rather
# than sitting in front of the noun, so the head is «pulìgunu rigulari» and the
# tail «di N lati».


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] nìura
           *[m] nìuru
        }
    .white =
        { $gender ->
            [f] janca
           *[m] jancu
        }
    .gray =
        { $gender ->
            [f] grigia
           *[m] grigiu
        }
    .red =
        { $gender ->
            [f] russa
           *[m] russu
        }
    .orange = aranciu
    .yellow =
        { $gender ->
            [f] giarna
           *[m] giarnu
        }
    .green = virdi
    .cyan = cianu
    .blue =
        { $gender ->
            [f] azzurra
           *[m] azzurru
        }
    .purple = viola
    .pink = rosa
    .brown = marruni

line-width =
    .thick =
        { $gender ->
            [f] grossa
           *[m] grossu
        }
    .thin = suttili

line-style =
    .dashed =
        { $gender ->
            [f] tratteggiata
           *[m] tratteggiatu
        }
    .dotted =
        { $gender ->
            [f] puntiata
           *[m] puntiatu
        }

# Plural noun phrases, which is what follows «cu» in `style-filled`. They agree
# with nothing.
fill-style =
    .horizontal = linii orizzuntali
    .vertical = linii virticali
    .diagonal = linii diagunali
    .backdiagonal = linii diagunali 'nvirsi
    .dots = punti
    .diamonds = rummi

noun =
    .line = retta
    .line-segment = sigmentu
    .ray = simiretta
    .vector = vitturi
    .curve = curva
    .function = funzioni
    .parabola = paràbula
    .polyline = linia spizzata
    .polygon = pulìgunu
    .triangle = triàngulu
    .rectangle = rittàngulu
    .circle = circu
    .region = riggiuni
    .point = puntu
    .square = quadratu
    .diamond = rummu
    .cross = cruci
    .plus = chiù

noun-regular-polygon =
    { $part ->
        [tail] di { $numSides } lati
       *[head] pulìgunu rigulari
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (pulìgunu, m) or
# the head of a phrase the description never names: `border` (orlu, m), `fill`
# (jinchimentu, m), `text` (testu, m), `background` (sfunnu, m).
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

# The noun comes first and the adjectives after it, which is the opposite of
# English. A noun that splits — the regular polygon — puts its complement after
# the adjectives that agree with its head.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word =
    { $gender ->
        [f] jinchiuta
       *[m] jinchiutu
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } cu { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } cu { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } cu { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «orlu» is masculine, so the border's adjectives agree with it rather than
# with the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] cu n'orlu { $border }
        [and] e orlu { $border }
        [and-article] e n'orlu { $border }
       *[with] cu orlu { $border }
    }

# The fill-pattern words are plural nouns, because their other use is the
# «cu { $pattern }» clause in `style-filled`. So this message supplies a noun
# for them to hang off — «jinchimentu», masculine, which is the gender
# `noun-gender` already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] jinchimentu { $color } cu { $pattern }
       *[plain] jinchimentu { $color }
    }

style-unfilled = nun jinchiutu

style-text =
    { $parts ->
        [background] { $color } supra un sfunnu { $background }
       *[plain] { $color }
    }

style-background-none = nuddu


## Boolean words

boolean-true = veru
boolean-false = fausu


## Answer buttons

answer-submit-label = Cuntrolla
answer-submit-label-no-correctness = Manna a risposta


## Sectional blocks

section-name =
    .activity = Attività
    .aside = Nota a latu
    .cascade = Cascata
    .definition = Definizzioni
    .example = Esempiu
    .exercise = Esercizziu
    .exercises = Esercizzi
    .given-answer = Risposta
    .note = Nota
    .objectives = Obiettivi
    .paragraphs = Paràgrafi
    .part = Parti
    .problem = Prubblema
    .problems = Prubblemi
    .proof = Dimustrazzioni
    .question = Dumanna
    .section = Sizzioni
    .solution = Suluzzioni
    .task = Còmpitu
    .theorem = Tiurema

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Suggerimentu


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabbella { $enumeration }
        [numbered-title] Tabbella { $enumeration }{ ". " }
        [unnumbered-title] Tabbella{ ". " }
       *[unnumbered] Tabbella
    }

figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ". " }
        [unnumbered-caption] Figura{ ". " }
       *[unnumbered] Figura
    }


## Paginator controls

paginator-previous = Precedenti
paginator-next = Successivu
paginator-page = Pàggina

paginator-page-status = { $pageLabel } { $currentPage } di { $numPages }


## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = si
piecewise-condition-otherwise = sinnò


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Secondary science in Sicily is taught in Italian, out of Italian
## textbooks, so the chemical vocabulary a pupil meets is `locales/it`'s rather
## than a Sicilian table — there is nothing settled here for a seed to
## reproduce.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Sìmmulu chìmicu non vàlidu
chemistry-invalid-ionic-compound = Cumpostu iònicu non vàlidu
