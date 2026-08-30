# Mískito content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
# English, in `locales/en/content.ftl`, is the source of truth.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard Latin orthography of the Nicaraguan Caribbean
# coast; see `chrome.ftl`'s header for the alphabet, for `ng`, for the `aw` and
# `ai` diphthongs, and for the pronounced `h`. `c`, `f`, `g`, `j`, `q`, `v`,
# `x` and `z` are not in the alphabet, so every loan below is respelled: `g`
# becomes `k` («triánguo» → «trianklu»), `v` becomes `b` («vector» →
# «bektar»), `j` and Spanish `g`-before-`i` become `h` («ejemplo» → «ehemplu»,
# «región» → «rehion»), `z` and `c`-before-`e`/`i` become `s` («círculo» →
# «sirkulu»), and `f` becomes `p` («párrafo» → «parapu»).
#
# **Number.** `Intl.PluralRules` has no CLDR data for `miq`; it falls back to
# the default locale and reports `one` and `other`, categories Mískito does not
# select. Nothing here writes a plural select on a count: a Mískito noun after
# a numeral takes no plural marker, so one unselected form is what a counted
# message would say. Numerals **follow** the noun in Mískito — «utla wal», two
# houses — which is why `noun-regular-polygon` reads «ladu { $numSides }» and
# why `section-title-prefix` keeps English's order of word and number.
#
# **Word order.** The modifier **follows** the noun in Mískito — «utla pihni»,
# white house — so the composition messages **reverse English's order**:
# `style-with-noun`, `style-filled-with-noun` and their `-tail` variants put
# `{ $noun }` first and `{ $description }` after it, and `style-border-clause`
# puts the head noun «bordi» before the adjectives that describe it. Within a
# run of modifiers the English order is kept (width, dash pattern, colour). The
# adjectival colour words carry the `-ni` suffix — «pihni», «pauni»,
# «lalahni», «sangni» — and «siksa» does not.
#
# **Loans.** The geometry and style vocabulary is borrowed, mostly from Spanish
# (geometry is schooled in Spanish on the Nicaraguan coast): «lain»,
# «sekmentu», «rayu», «bektar», «kurba», «punsion», «kampu», «parabula»,
# «polilain», «polikunu», «trianklu», «rektanklu», «sirkulu», «rehion»,
# «puntu», «kwadradu», «diamanti», «krus», «bordi», «orisontal», «bertikal»,
# «diakonal», «raya», «kris», «naranha», «siyan», «murada», «blanku», and the
# sectional words «aktibidad», «kaskada», «tanka marikanka», «ehemplu»,
# «ehersisiu», «ubhetibu», «parapu», «parti», «problema», «prueba»,
# «seksion», «solusion», «teorema», «tabla», «estadistika». From English come
# «blu», «pink», «brawn», «bakrawn», «sait», «nut», «wark» and «ansa». The
# frame is Mískito throughout: native verbs, the negator «apia» after what it
# negates, the partitive «wina», and the copula `sa`.
#
# **What is kept native.** The five colour words a Mískito speaker already has
# — «siksa» black, «pihni» white, «pauni» red, «lalahni» yellow, «sangni»
# green — stand as they are. «sangni» spans what English splits into green and
# blue, so `.blue` takes the English loan «blu» rather than being folded into
# «sangni»; that seam is the one `locales/quc` and `locales/kek` also record.
# `line-width` uses «tara» big and «sirpi» small for *thick* and *thin*,
# which is how a stroke's weight is said. «lilka», the ordinary word for a
# picture, names a `<figure>`; «wahia», a leaf, names a page.
#
# **What is left out.** `element-name` and `element-anion-name`, the 118
# chemical elements: chemistry is schooled in Spanish and there is no published
# Mískito list. Everything else in the English catalog is translated.
#
# **Confidence.** `piecewise-condition-if` is the weakest key here. Mískito's
# conditional marker «kaka» is clause-final, and the renderer places this word
# *before* the inequality, so «kaka» reads out of position; a speaker should
# decide whether to leave it, or to accept the mismatch as the price of the
# renderer's fixed order. «Aisanka» for *feedback* and «Saura» for *error* in
# `chrome.ftl` have the same weakness. `noun-gender` answers one token,
# «apu», because Mískito has no grammatical gender and nothing selects on it.


## Style vocabulary

color =
    .black = siksa
    .white = pihni
    .gray = kris
    .red = pauni
    .orange = naranha
    .yellow = lalahni
    .green = sangni
    .cyan = siyan
    .blue = blu
    .purple = murada
    .pink = pink
    .brown = brawn

line-width =
    .thick = tara
    .thin = sirpi

line-style =
    .dashed = raya nani
    .dotted = puntu nani

fill-style =
    .horizontal = lain nani orisontal
    .vertical = lain nani bertikal
    .diagonal = lain nani diakonal
    .backdiagonal = lain nani diakonal wala
    .dots = puntu nani
    .diamonds = diamanti nani

noun =
    .line = lain
    .line-segment = lain sekmentu
    .ray = rayu
    .vector = bektar
    .curve = kurba
    .function = punsion
    .slope-field = kampu pendienti
    .vector-field = kampu bektar
    .parabola = parabula
    .polyline = polilain
    .polygon = polikunu
    .triangle = trianklu
    .rectangle = rektanklu
    .circle = sirkulu
    .region = rehion
    .point = puntu
    .square = kwadradu
    .diamond = diamanti
    .cross = krus
    .plus = plus

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] polikunu rekular ladu { $numSides }
    }

noun-gender = apu


## Style composition
##
## The noun comes first and its modifiers follow it, which is the reverse of
## English; see the Word order paragraph in this file's header.

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

style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }

style-filled-word = yenu

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } { $pattern } wal
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } { $pattern } wal
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } { $pattern } wal
       *[plain] { $noun } { $color } { $filled }
    }

style-border-clause =
    { $parts ->
        [with-article] bordi { $border } wal
        [and] bara bordi { $border }
        [and-article] bara bordi { $border }
       *[with] bordi { $border } wal
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = yenu apia

style-text =
    { $parts ->
        [background] { $color }, bakrawn { $background } wal
       *[plain] { $color }
    }

style-background-none = apu


## Boolean words

boolean-true = kasak
boolean-false = kasak apia


## Answer buttons

answer-submit-label = Wark ba kaiks
answer-submit-label-no-correctness = Ansa ba bliks


## Sectional blocks

section-name =
    .activity = Aktibidad
    .aside = Sait nut
    .cascade = Kaskada
    .definition = Tanka marikanka
    .example = Ehemplu
    .exercise = Ehersisiu
    .exercises = Ehersisiu nani
    .given-answer = Ansa
    .note = Nut
    .objectives = Ubhetibu nani
    .paragraphs = Parapu nani
    .part = Parti
    .problem = Problema
    .problems = Problema nani
    .proof = Prueba
    .question = Makabi walanka
    .section = Seksion
    .solution = Solusion
    .task = Wark
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
        [numbered] Lilka { $enumeration }
        [numbered-caption] Lilka { $enumeration }{ ": " }
        [unnumbered-caption] Lilka{ ": " }
       *[unnumbered] Lilka
    }


## Paginator controls

paginator-previous = Pas
paginator-next = Wala
paginator-page = Wahia
paginator-page-status = { $numPages } wina { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = apia kaka
piecewise-condition-if = kaka
piecewise-condition-otherwise = baha apia kaka


## Chemistry
##
## `element-name` and `element-anion-name` are left out: chemistry is schooled
## in Spanish and there is no published Mískito list of the 118 elements.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbulu kimiku pain apia
chemistry-invalid-ionic-compound = Kompwestu ioniku pain apia


## Inputs embedded in math

math-embedded-input-blank = blanku
math-embedded-input-blank-ordinal = { $total } wina blanku { $ordinal }
