# Tetum content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Tetun Dili, the co-official variety; see `chrome.ftl`'s header.
#
# Tetum has no grammatical gender and no case, so `noun-gender` answers one
# token for every noun and nothing here selects on `$gender` or on `$role`. Note
# that the **Portuguese loans keep their Portuguese shape but not its
# agreement**: «azúl» and «matak» do not change for the noun beside them, so a
# borrowed adjective is as invariant here as a native one. That is worth saying
# because a corrector who reads «regulár» and reaches for «regulares» would be
# translating Portuguese rather than Tetum.
#
# The adjectives **follow** the noun — «liña mean», a red line — so every
# composition message inverts the English order.
#
# The geometry vocabulary is Portuguese-derived, which is what Timorese
# schooling carries; the colours and the everyday words are Tetum's own, and
# `.blue` is the one colour in the table that is a loan, because Tetum's own
# «matak» covers blue and green together. This catalog assigns «matak» to green
# and the loan «azúl» to blue, which is what Timorese school materials do, and
# it is a partition of the spectrum rather than a translation of two English
# words — the same shape `locales/gn` and `locales/oj` record for their own
# colour tables.


## Style vocabulary

color =
    .black = metan
    .white = mutin
    .gray = sinza
    .red = mean
    .orange = laranja
    .yellow = kinur
    .green = matak
    .cyan = sian
    .blue = azúl
    .purple = roxu
    .pink = rosa
    .brown = kastañu

line-width =
    .thick = grosu
    .thin = finu

line-style =
    .dashed = traku-traku
    .dotted = pontu-pontu

# Noun phrases. Tetum marks no plural on the noun, so «liña» is the word for one
# line and for many alike.
fill-style =
    .horizontal = liña orizontál
    .vertical = liña vertikál
    .diagonal = liña diagonál
    .backdiagonal = liña diagonál kotuk
    .dots = pontu
    .diamonds = losangu

noun =
    .line = liña
    .line-segment = segmentu liña
    .ray = raiu
    .vector = vetór
    .curve = kurva
    .function = funsaun
    .parabola = parábola
    .polyline = liña keta-ketak
    .polygon = polígonu
    .triangle = triángulu
    .rectangle = retángulu
    .circle = sírkulu
    .region = rejiaun
    .point = pontu
    .square = kuadradu
    .diamond = losangu
    .cross = kruz
    .plus = plus

# The side count follows the adjectives as a complement, so that they stay
# beside the noun they describe.
noun-regular-polygon =
    { $part ->
        [tail] ho sorin { $numSides }
       *[head] polígonu regulár
    }

# One answer for every noun: Tetum has no grammatical gender, and its borrowed
# adjectives do not agree either.
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

style-filled-word = nakonu

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ho { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ho { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } ho { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# Tetum has no article, so the two `-article` branches say what the other two
# say. They are kept apart because English's distinction is between a first
# clause and a further one, which this file does mark: «ho» against «no».
style-border-clause =
    { $parts ->
        [with-article] ho sorin-lalais { $border }
        [and] no sorin-lalais { $border }
        [and-article] no sorin-lalais { $border }
       *[with] ho sorin-lalais { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = la nakonu

style-text =
    { $parts ->
        [background] { $color } ho fundu { $background }
       *[plain] { $color }
    }

style-background-none = laiha


## Boolean words

boolean-true = loos
boolean-false = sala


## Answer buttons

answer-submit-label = Verifika serbisu
answer-submit-label-no-correctness = Haruka resposta


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Tetum's plural is the postposed «sira», and a heading does not carry it.
section-name =
    .activity = Atividade
    .aside = Nota sorin
    .cascade = Kaskata
    .definition = Definisaun
    .example = Ezemplu
    .exercise = Ezersísiu
    .exercises = Ezersísiu
    .given-answer = Resposta
    .note = Nota
    .objectives = Objetivu
    .paragraphs = Parágrafu
    .part = Parte
    .problem = Problema
    .problems = Problema
    .proof = Prova
    .question = Pergunta
    .section = Seksaun
    .solution = Solusaun
    .task = Tarefa
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

hint-title = Matadalan


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabela { $enumeration }
        [numbered-title] Tabela { $enumeration }{ ": " }
        [unnumbered-title] Tabela{ ": " }
       *[unnumbered] Tabela
    }

figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ": " }
        [unnumbered-caption] Figura{ ": " }
       *[unnumbered] Figura
    }


## Paginator controls

paginator-previous = Uluk
paginator-next = Tuirmai
paginator-page = Pájina

paginator-page-status = { $pageLabel } { $currentPage } husi { $numPages }


## Piecewise functions

piecewise-condition-or = ka
piecewise-condition-if = se
piecewise-condition-otherwise = se lae


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Timorese secondary science is taught in Portuguese, out of
## Portuguese textbooks, so the chemical vocabulary a pupil meets is
## `locales/pt`'s. Tetum is the language of the early grades and of the
## classroom talk around the lesson; there is no settled Tetum table for a seed
## to reproduce. That is the `locales/ht` case exactly, one colonial language
## over.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Símbolu kímiku la válidu
chemistry-invalid-ionic-compound = Kompostu ióniku la válidu
