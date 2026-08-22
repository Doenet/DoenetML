# Corsican content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Corsican adjectives **follow** the noun and agree with it, so the composition
# messages invert the English order and every describing word that inflects
# selects on `$gender`. Nothing selects on `$role`: a clause position is
# carried by a preposition and never by the adjective.
#
# The adjectives that end in `-e` in the singular — «verde», «sottile» — have
# one form for both genders, as do the loans «aranciu», «cianu», «viola»,
# «rosa» and «marrone», so all of those are cited in one shape.
#
# `noun-regular-polygon` splits: the side count follows the adjectives rather
# than sitting in front of the noun, so the head is «puligonu regulare» and the
# tail «di N lati».


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] nera
           *[m] neru
        }
    .white =
        { $gender ->
            [f] bianca
           *[m] biancu
        }
    .gray =
        { $gender ->
            [f] grigia
           *[m] grigiu
        }
    .red =
        { $gender ->
            [f] rossa
           *[m] rossu
        }
    .orange = aranciu
    .yellow =
        { $gender ->
            [f] gialla
           *[m] giallu
        }
    .green = verde
    .cyan = cianu
    .blue =
        { $gender ->
            [f] turchina
           *[m] turchinu
        }
    .purple = viola
    .pink = rosa
    .brown = marrone
line-width =
    .thick =
        { $gender ->
            [f] grossa
           *[m] grossu
        }
    .thin = sottile
line-style =
    .dashed =
        { $gender ->
            [f] tratteghjata
           *[m] tratteghjatu
        }
    .dotted =
        { $gender ->
            [f] puntighjata
           *[m] puntighjatu
        }
# Plural noun phrases, which is what follows «cù» in `style-filled`. They agree
# with nothing.
fill-style =
    .horizontal = linee orizzontali
    .vertical = linee verticali
    .diagonal = linee diagunali
    .backdiagonal = linee diagunali inverse
    .dots = punti
    .diamonds = rombi
noun =
    .line = retta
    .line-segment = segmentu
    .ray = semiretta
    .vector = vettore
    .curve = curva
    .function = funzione
    .parabola = parabula
    .polyline = linea spezzata
    .polygon = puligonu
    .triangle = triangulu
    .rectangle = rettangulu
    .circle = cerchju
    .region = regione
    .point = puntu
    .square = quatratu
    .diamond = rombu
    .cross = croce
    .plus = più
noun-regular-polygon =
    { $part ->
        [tail] di { $numSides } lati
       *[head] puligonu regulare
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (puligonu, m) or
# the head of a phrase the description never names: `border` (orlu, m), `fill`
# (riempimentu, m), `text` (testu, m), `background` (fondu, m).
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
        [f] piena
       *[m] pienu
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } cù { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } cù { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } cù { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «orlu» is masculine, so the border's adjectives agree with it rather than
# with the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] cù un orlu { $border }
        [and] è orlu { $border }
        [and-article] è un orlu { $border }
       *[with] cù orlu { $border }
    }
# The fill-pattern words are plural nouns, because their other use is the
# «cù { $pattern }» clause in `style-filled`. So this message supplies a noun
# for them to hang off — «riempimentu», masculine, which is the gender
# `noun-gender` already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] riempimentu { $color } cù { $pattern }
       *[plain] riempimentu { $color }
    }
style-unfilled = micca pienu
style-text =
    { $parts ->
        [background] { $color } nantu à un fondu { $background }
       *[plain] { $color }
    }
style-background-none = nunda

## Boolean words

boolean-true = veru
boolean-false = falsu

## Answer buttons

answer-submit-label = Verificà
answer-submit-label-no-correctness = Mandà a risposta

## Sectional blocks

section-name =
    .activity = Attività
    .aside = Nota à latu
    .cascade = Cascata
    .definition = Definizione
    .example = Esempiu
    .exercise = Esercizziu
    .exercises = Esercizzii
    .given-answer = Risposta
    .note = Nota
    .objectives = Obiettivi
    .paragraphs = Paragrafi
    .part = Parte
    .problem = Prublema
    .problems = Prublemi
    .proof = Dimustrazione
    .question = Dumanda
    .section = Sezione
    .solution = Suluzione
    .task = Cumpitu
    .theorem = Teorema
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Indiziu

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tavula { $enumeration }
        [numbered-title] Tavula { $enumeration }{ ". " }
        [unnumbered-title] Tavula{ ". " }
       *[unnumbered] Tavula
    }
figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ". " }
        [unnumbered-caption] Figura{ ". " }
       *[unnumbered] Figura
    }

## Paginator controls

paginator-previous = Precedente
paginator-next = Seguente
paginator-page = Pagina
paginator-page-status = { $pageLabel } { $currentPage } di { $numPages }

## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = sè
piecewise-condition-otherwise = altrimenti

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Secondary science in Corsica is taught in French, out of French
## textbooks, so the chemical vocabulary a pupil meets is `locales/fr`'s rather
## than a Corsican table — there is nothing settled here for a seed to
## reproduce.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbulu chimicu invalidu
chemistry-invalid-ionic-compound = Cumpostu ionicu invalidu
