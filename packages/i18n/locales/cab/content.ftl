# Garifuna content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
# English, in `locales/en/content.ftl`, is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage. Message ids and `.attribute` suffixes are
# never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard Latin orthography used across the four Garifuna
# communities — Honduras, Belize, Guatemala and Nicaragua — and taught in the
# bilingual schools of Honduras and Belize:
# `a b ch d e f g h i k l m n ñ o p r s t u ü w y`. Three notes.
#
#   * **`ü` is a letter of its own**, the high central vowel, and is written
#     with the diaeresis everywhere it occurs. It is not a variant spelling of
#     `u` and the two are not interchangeable.
#   * **The falling tone is not written.** Garifuna distinguishes tone, and the
#     standard orthography leaves it unmarked; where an acute appears here it is
#     the Spanish-style stress accent Honduran practice uses on some words
#     («álügüdahani», «púntu»), not a tone mark. A reviewer should not read the
#     absence of accents as an error.
#   * `c`, `j`, `q`, `v`, `x` and `z` are **not** in the alphabet. Every Spanish
#     loan below is respelled around that: «asulu» for *azul*, «bekitoru» for
#     *vector*, «sírkulu» for *círculo*, «krusu» for *cruz*, «rehion» for
#     *región*, «kuadradu» for *cuadrado*.
#
# The language is named «Garifuna» in all four of these files. «Garínagu» is the
# name of the people rather than of the language and is not used.
#
# **Number.** `Intl.PluralRules` has no CLDR data for `cab`; it falls back to
# the default locale and reports `one` and `other`, categories Garifuna does not
# select. No message here writes a `{ $n -> }` or `{ $count -> }` select on a
# count: wherever English has a `[one]`/`[other]` pair this file writes **one
# unselected form**. Selects on non-numeric variables — `$parts`, `$part` — are
# not plural selects and keep every branch English has.
#
# **Word order.** The modifier **follows** the noun in Garifuna, as it does in
# Spanish. The composition messages therefore **reverse English's order**:
# `style-with-noun` and `style-filled-with-noun` put `{ $noun }` before
# `{ $description }`, `style-fill` puts `{ $pattern }` before `{ $color }`, and
# `fill-style` reads «línia orisontal», not the other way round. `style-stroke`
# is a bare stack of adjectives with no noun in it, so it keeps English's
# internal order.
#
# `noun-gender` answers one token. Garifuna marks gender on some nouns, but no
# adjective in this catalog agrees with a placeable whose gender the catalog can
# see, so nothing selects on the answer and no message writes a `$gender` or
# `$role` select.
#
# **Loans.** Garifuna has no native software or mathematical register, but it
# borrows freely for exactly this register in school and everyday speech —
# Spanish in Honduras, Guatemala and Nicaragua, English in Belize. This seed
# writes the technical nouns as **Spanish loans respelled to the Garifuna
# alphabet and carried in a Garifuna frame**: «bekitoru», «funsion»,
# «polígunu», «rektángulu», «parábola», «matrisi», «seksion», «tabla»,
# «fígura», «páhina», «respuesta». The frame around them is Garifuna — «lidan»
# in, «lun» to, «luma» with, «lídangiñe» from, «úati» there is none, «mama» the
# negative copula, and the privative `ma-` of «mabuiti». A Belizean speaker may
# well prefer the English loan in every one of these slots — *vector*,
# *function*, *section* — and should feel free to substitute it, but the whole
# file has to move together.
#
# **Confidence, and it is low.** Garifuna is the least-documented of the four
# languages in this batch.
#
#   * The three native colour words «haruti» (white), «wuriti» (black) and
#     «funati» (red) and the «buiti»/«mabuiti» pair are the words a speaker
#     should check first; everything built on them depends on them.
#   * The other nine colours are Spanish loans, because Garifuna's own colour
#     words either vary between the Honduran and Belizean communities or have
#     already given way to the loan in speech. They are recorded as loans, not
#     as decisions.
#   * `element-name` and `element-anion-name` — the 118 chemical elements and
#     their anions — are left out entirely: chemistry is schooled in Spanish or
#     English and there is no published Garifuna list.
#   * `noun.slope-field`, `noun.vector-field` and `noun.polyline` have no
#     Garifuna word at all; they are written as Spanish loans rather than
#     omitted, since a loan is what a speaker would actually say.


## Style vocabulary

color =
    .black = wuriti
    .white = haruti
    .gray = grisi
    .red = funati
    .orange = naranha
    .yellow = amariyu
    .green = berde
    .cyan = sian
    .blue = asulu
    .purple = moradu
    .pink = rosadu
    .brown = kafe

line-width =
    .thick = grúesu
    .thin = delgadu

line-style =
    .dashed = rayadu
    .dotted = puntiadu

# Noun phrases, and the modifier follows the head: «línia orisontal».
fill-style =
    .horizontal = línia orisontal
    .vertical = línia bertikal
    .diagonal = línia diagonal
    .backdiagonal = línia diagonal inbersa
    .dots = puntu
    .diamonds = rombu

noun =
    .line = línia
    .line-segment = segmentu
    .ray = rayu
    .vector = bekitoru
    .curve = kurba
    .function = funsion
    .slope-field = kampu pendiente
    .vector-field = kampu bekitoru
    .parabola = parábola
    .polyline = polilínia
    .polygon = polígunu
    .triangle = triángulu
    .rectangle = rektángulu
    .circle = sírkulu
    .region = rehion
    .point = puntu
    .square = kuadradu
    .diamond = rombu
    .cross = krusu
    .plus = másu

# The side count follows the head, as every other modifier does, so the whole
# noun sits in the `head` branch and the `tail` stays empty.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] polígunu regular lau { $numSides } ladu
    }

noun-gender = neutru


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

# Reversed against English: the noun leads and the description follows it.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }

style-filled-word = yenu

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } luma { $pattern }
       *[plain] { $filled } { $color }
    }

# Reversed likewise: «sírkulu yenu asulu luma rombu».
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } luma { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } luma { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «luma» is both the comitative and the ordinary conjunction, so the `and` and
# `with` branches read alike; «ában» is the numeral one, standing where English
# wants its article.
style-border-clause =
    { $parts ->
        [with-article] luma ában borde { $border }
        [and] luma borde { $border }
        [and-article] luma ában borde { $border }
       *[with] luma borde { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = mama yenu

style-text =
    { $parts ->
        [background] { $color } luma ában fondu { $background }
       *[plain] { $color }
    }

style-background-none = úati


## Boolean words
##
## `true` and `false` are DoenetML syntax and stay English in the source; only
## the displayed words move.

boolean-true = inarüni
boolean-false = mama inarüni


## Answer buttons

# «Barihi badagimanu» — "look at your work"; «Bíchiga barespuesta» — "give your
# response". Both are ordinary second-person imperatives.
answer-submit-label = Barihi badagimanu
answer-submit-label-no-correctness = Bíchiga barespuesta


## Sectional blocks

section-name =
    .activity = Wadagimanu
    .aside = Aparte
    .cascade = Kaskada
    .definition = Definision
    .example = Ehemplu
    .exercise = Ehersisiu
    .exercises = Ehersisiugu
    .given-answer = Respuesta
    .note = Nota
    .objectives = Obhetibugu
    .paragraphs = Párrafugu
    .part = Parti
    .problem = Problema
    .problems = Problemagu
    .proof = Prueba
    .question = Álügüdahani
    .section = Seksion
    .solution = Solusion
    .task = Tarea
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

hint-title = Pista


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabla { $enumeration }
        [numbered-title] Tabla { $enumeration }{ ": " }
        [unnumbered-title] Tabla{ ": " }
       *[unnumbered] Tabla
    }

figure-name =
    { $parts ->
        [numbered] Fígura { $enumeration }
        [numbered-caption] Fígura { $enumeration }{ ": " }
        [unnumbered-caption] Fígura{ ": " }
       *[unnumbered] Fígura
    }


## Paginator controls

paginator-previous = Furumiñe
paginator-next = Lárigi
paginator-page = Páhina

paginator-page-status = { $pageLabel } { $currentPage } lídangiñe { $numPages }


## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = anhein
piecewise-condition-otherwise = anhein mama


## Chemistry
##
## `element-name` and `element-anion-name` are omitted: chemistry is schooled in
## Spanish or in English and there is no published Garifuna list of the 118
## elements. The three keys below are prose rather than element names.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Símbolu kímiku mabuiti
chemistry-invalid-ionic-compound = Konpuestu ióniku mabuiti


## Inputs embedded in math

math-embedded-input-blank = blanku
math-embedded-input-blank-ordinal = blanku { $ordinal } lídangiñe { $total }
