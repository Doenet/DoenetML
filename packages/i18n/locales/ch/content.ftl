# Chamorro content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Guam orthography; see `chrome.ftl`'s header.
#
# Chamorro has no grammatical gender and no case, so `noun-gender` answers one
# token for every noun and nothing here selects on `$gender` or on `$role`.
#
# The adjectives **follow** the noun — «liña agaga'», a red line — so every
# composition message inverts the English order.
#
# **This is the batch's most heavily Spanish catalog, and the loans are the
# language rather than a shortcut in it.** Three centuries of contact left
# Chamorro with Spanish colour words («betde», «asut», «amariyu»), Spanish
# numerals in most counting, and Spanish geometry vocabulary — and they are
# fully Chamorro words now, taking Chamorro affixes and Chamorro spelling. So
# the seam this file runs along is not Chamorro-against-Spanish; it is where the
# native word survives beside the loan, as «attelong» does beside no loan at
# all and «å'paka'» does beside «blanko». Those choices are the ones a speaker
# should check.


## Style vocabulary

color =
    .black = attelong
    .white = å'paka'
    .gray = kulot senisa
    .red = agaga'
    .orange = kulot nåranha
    .yellow = amariyu
    .green = betde
    .cyan = siyan
    .blue = asut
    .purple = lila
    .pink = rosåda
    .brown = kulot chukulåti
line-width =
    .thick = damo'
    .thin = dilikåo
line-style =
    .dashed = ma'ipe'-ipe'
    .dotted = tuntos-tuntos
# Noun phrases. Chamorro marks no plural on the noun, so «liña» is the word for
# one line and for many alike.
fill-style =
    .horizontal = liña orisontåt
    .vertical = liña bettikåt
    .diagonal = liña diagonåt
    .backdiagonal = liña diagonåt ma'atrasa
    .dots = tuntos
    .diamonds = diamånti
noun =
    .line = liña
    .line-segment = pidåson liña
    .ray = raya
    .vector = bektot
    .curve = kotba
    .function = funsion
    .parabola = paråbola
    .polyline = liña ma'ipe'
    .polygon = poligono
    .triangle = triånggulo
    .rectangle = rektånggulo
    .circle = sirkulo
    .region = rehion
    .point = punto
    .square = kuadrao
    .diamond = diamånti
    .cross = kilu'us
    .plus = mås
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they describe.
noun-regular-polygon =
    { $part ->
        [tail] ni guaha { $numSides } na kanton
       *[head] poligono regulåt
    }
# One answer for every noun: Chamorro has no grammatical gender, and its Spanish
# loans do not carry Spanish agreement either.
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
style-filled-word = bula
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } yan { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } yan { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } yan { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Chamorro's «i» is the definite article and is not what English's "a" is doing
# here, so all four branches read alike but for the connective: «yan» opens the
# first clause and «yan lokkue'» a further one.
style-border-clause =
    { $parts ->
        [with-article] yan kanton { $border }
        [and] yan lokkue' kanton { $border }
        [and-article] yan lokkue' kanton { $border }
       *[with] yan kanton { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = ti bula
style-text =
    { $parts ->
        [background] { $color } yan i tatte { $background }
       *[plain] { $color }
    }
style-background-none = taya'

## Boolean words

boolean-true = magåhet
boolean-false = dinagi

## Answer buttons

answer-submit-label = Cheki i che'cho'
answer-submit-label-no-correctness = Na'hålom i ineppe'

## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Chamorro's plural is «siha», and a heading does not carry it.
section-name =
    .activity = Aktibidåt
    .aside = Nota gi kanton
    .cascade = Kaskåda
    .definition = Definasion
    .example = Ehemplo
    .exercise = Ehetsisiu
    .exercises = Ehetsisiu
    .given-answer = Ineppe'
    .note = Nota
    .objectives = Ineppok
    .paragraphs = Parafo
    .part = Patte
    .problem = Problema
    .problems = Problema
    .proof = Prueba
    .question = Faisen
    .section = Seksion
    .solution = Solusion
    .task = Cho'cho'
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
hint-title = Hinasso

## Tables and figures

table-name =
    { $parts ->
        [numbered] Låmasa { $enumeration }
        [numbered-title] Låmasa { $enumeration }{ ": " }
        [unnumbered-title] Låmasa{ ": " }
       *[unnumbered] Låmasa
    }
figure-name =
    { $parts ->
        [numbered] Litråtu { $enumeration }
        [numbered-caption] Litråtu { $enumeration }{ ": " }
        [unnumbered-caption] Litråtu{ ": " }
       *[unnumbered] Litråtu
    }

## Paginator controls

paginator-previous = Antes
paginator-next = Sigiente
paginator-page = Påhina
paginator-page-status = { $pageLabel } { $currentPage } gi { $numPages }

## Piecewise functions

piecewise-condition-or = pat
piecewise-condition-if = yanggen
piecewise-condition-otherwise = yanggen ti

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Guam and the Northern Marianas teach secondary science in English,
## and Chamorro has no settled list of all 118 to seed from. The Spanish loans
## this catalog carries elsewhere are no help here: the periodic table arrived
## through the English-medium school system rather than through Spanish, so
## there is neither a Chamorro table nor a Spanish one behind it.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Ti maolek na simbolon kimika
chemistry-invalid-ionic-compound = Ti maolek na kompuesto ioniko
