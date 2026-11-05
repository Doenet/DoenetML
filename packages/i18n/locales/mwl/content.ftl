# Mirandese (mirandés) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Mirandese is Asturleonese, not Portuguese** — co-official in the Tierra de
# Miranda since 1999, but descended from the Astur-Leonese of León, with
# `locales/ast` rather than `locales/pt` as its nearest relative. **Script:
# Latin, in the Convenção Ortográfica da Língua Mirandesa** (1999), which is
# the only codified orthography it has: «lh-» for initial l, «ç» where
# Portuguese writes s or c, the diphthongs «ie» and «uo», the article «l» /
# «la» / «ls» / «las». Digits are Latin and a number is grouped by the locale's
# own rules, as `src/intl.ts` pins for every locale.
#
# ## Word order and agreement
#
# **Mirandese puts its adjectives after the noun and agrees them with it**, as
# Asturian does. So every composition message inverts the English order and
# every describing word that inflects selects on `$gender`:
# `style-with-noun` renders «lhinha grossa traceijada burmeilha» for *thick
# dashed red line*, and the same words with no noun read «grosso traceijado
# burmeilho». The agreement is **real** — a genuine -o/-a ending, not an
# invariant form standing in for one.
#
# Five colour words are invariable in Mirandese and are cited in one shape:
# «laranja», «berde», «ciano», «azul», «cor-de-rosa». That is the language,
# not a gap.
#
# **Nothing selects on `$role`.** A clause position is carried by a preposition
# — «cun ua borda», «cun un fondo» — and never by the adjective, so the three
# clause positions render exactly as `standalone` does. This is the shape
# `locales/ast` and `locales/pt` both arrive at.
#
# **`noun-regular-polygon` splits.** The side count follows the adjectives so
# that they stay beside the noun they agree with: the head is «polígono
# regular» and the tail «de N lhados».
#
# ## Counts
#
# CLDR has **no plural data for `mwl`**. Nothing in this file counts, and no
# `[zero]`, `[one]`, `[two]`, `[few]` or `[many]` branch appears anywhere in
# this catalog.
#
# ## Where the seed leans on Portuguese
#
# The colours, the everyday words and the shapes a child names are Mirandese:
# «negro», «branco», «burmeilho», «amarielho», «berde», «azul», «castanho»;
# «lhinha», «punto», «cruç», «quadrado», «círclo», «páigina», «berdadeiro»,
# «falso». The mathematical nouns are **Portuguese**, and that is declared:
# «betor», «funcion», «parabóla», «polígono», «triángulo», «retángulo»,
# «teorema», «iónico» are the words a Mirandese pupil meets in a
# Portuguese-medium mathematics lesson, respelled to the Convenção where it
# supplies a form («funcion» and «region» for `-ão`/`-ião`, «çquerda`-type
# initial «ç»). Nothing has been coined.
#
# **Weakest first.** «traceijado» and «puntiado» for *dashed* and *dotted*,
# «anchido» for *filled*, «lousango» for *diamond*, «campo de declibes» for
# *slope field* and «cascata» for *cascade* are the seed's guesses and should
# be checked before anything else.
#
# ## The chemistry element tables
#
# `element-name` and `element-anion-name` are **omitted**. Mirandese has no
# settled published list of all 118 elements — the Anstituto de la Lhéngua
# Mirandesa's work has not gone there — and a pupil in Miranda do Douro meets
# the periodic table **in Portuguese**, which is the language of secondary
# science in the Tierra de Miranda. The keys therefore do not appear here and
# fall back to `locales/en`; a host that wants Portuguese names should point
# `documentLocale` at `pt`. The surrounding prose keys are translated.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] negra
           *[m] negro
        }
    .white =
        { $gender ->
            [f] branca
           *[m] branco
        }
    .gray =
        { $gender ->
            [f] cinzenta
           *[m] cinzento
        }
    .red =
        { $gender ->
            [f] burmeilha
           *[m] burmeilho
        }
    .orange = laranja
    .yellow =
        { $gender ->
            [f] amarielha
           *[m] amarielho
        }
    .green = berde
    .cyan = ciano
    .blue = azul
    .purple =
        { $gender ->
            [f] roxa
           *[m] roxo
        }
    .pink = cor-de-rosa
    .brown =
        { $gender ->
            [f] castanha
           *[m] castanho
        }
line-width =
    .thick =
        { $gender ->
            [f] grossa
           *[m] grosso
        }
    .thin =
        { $gender ->
            [f] fina
           *[m] fino
        }
line-style =
    .dashed =
        { $gender ->
            [f] traceijada
           *[m] traceijado
        }
    .dotted =
        { $gender ->
            [f] puntiada
           *[m] puntiado
        }
# Noun phrases standing behind «cun». They modify nothing and so take no
# gender.
fill-style =
    .horizontal = lhinhas horizontales
    .vertical = lhinhas berticales
    .diagonal = lhinhas diagonales
    .backdiagonal = lhinhas diagonales al alrobés
    .dots = puntos
    .diamonds = lousangos
noun =
    .line = lhinha
    .line-segment = segmento de lhinha
    .ray = raio
    .vector = betor
    .curve = curba
    .function = funcion
    .slope-field = campo de declibes
    .vector-field = campo de betores
    .parabola = parabóla
    .polyline = lhinha poligonal
    .polygon = polígono
    .triangle = triángulo
    .rectangle = retángulo
    .circle = círclo
    .region = region
    .point = punto
    .square = quadrado
    .diamond = lousango
    .cross = cruç
    .plus = mais
noun-regular-polygon =
    { $part ->
        [tail] de { $numSides } lhados
       *[head] polígono regular
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (polígono, m) or
# the head of a phrase the description never names: `border` (borda, f), `fill`
# (anchimiento, m), `text` (testo, m), `background` (fondo, m).
noun-gender =
    { $noun ->
        [line] f
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

# The adjectives follow their noun and keep English's order among themselves:
# «lhinha grossa traceijada burmeilha».
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
# The noun leads and the adjectives follow it, which is the reverse of English
# and the reason this message exists rather than a concatenation.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
# A past participle used attributively, so it agrees with the shape it
# describes exactly as the colour words do.
style-filled-word =
    { $gender ->
        [f] anchida
       *[m] anchido
    }
style-filled =
    { $parts ->
        [pattern] { $color } { $filled } cun { $pattern }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } cun { $pattern }
        [plain-tail] { $noun } { $color } { $filled } { $nounTail }
        [pattern-tail] { $noun } { $color } { $filled } { $nounTail } cun { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }
# «borda» is feminine, so the border's adjectives take the feminine whatever
# the shape around it is. The indefinite article is «ua», and it is present in
# all four branches because Mirandese wants it here; what changes between the
# pairs is the conjunction.
style-border-clause =
    { $parts ->
        [with-article] cun ua borda { $border }
        [and] i ua borda { $border }
        [and-article] i ua borda { $border }
       *[with] cun ua borda { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = sin anchimiento
style-text =
    { $parts ->
        [background] { $color } cun un fondo { $background }
       *[plain] { $color }
    }
style-background-none = niun

## Boolean words

boolean-true = berdadeiro
boolean-false = falso

## Answer buttons

answer-submit-label = Berificar l trabalho
answer-submit-label-no-correctness = Ambiar la repuosta

## Sectional blocks

section-name =
    .activity = Atebidade
    .aside = Nota lhateral
    .cascade = Cascata
    .definition = Definiçon
    .example = Ejemplo
    .exercise = Eiercício
    .exercises = Eiercícios
    .given-answer = Repuosta
    .note = Nota
    .objectives = Oubjetibos
    .paragraphs = Parágrafos
    .part = Parte
    .problem = Porblema
    .problems = Porblemas
    .proof = Proba
    .question = Pregunta
    .section = Secçon
    .solution = Soluçon
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
hint-title = Sugestion

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

paginator-previous = Anterior
paginator-next = Seguinte
paginator-page = Páigina
paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }

## Piecewise functions

piecewise-condition-or = ó
piecewise-condition-if = se
piecewise-condition-otherwise = senó

## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Símbolo químico nun bálido
chemistry-invalid-ionic-compound = Cumposto iónico nun bálido

## Inputs embedded in math

math-embedded-input-blank = spácio
math-embedded-input-blank-ordinal = spácio { $ordinal } de { $total }
