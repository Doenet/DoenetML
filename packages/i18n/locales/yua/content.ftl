# Yucatec Maya (Maayaʼ tʼàan) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in. English, in `locales/en/content.ftl`, is the source of truth:
# `lint:i18n` rejects a key that does not exist there.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The ALMY/INALI unified orthography; see `chrome.ftl`'s
# header for the alphabet and the doubled long vowels. Every apostrophe inside
# a Maya word is **U+02BC MODIFIER LETTER APOSTROPHE `ʼ`**, never U+2019 `’`;
# the two are homoglyphs in most fonts, so check the codepoint rather than the
# shape. Straight ASCII `'` is English's own punctuation carried through where
# a message quotes a value, and is not a Maya letter. The language is named «Maayaʼ tʼàan», whose
# grave marks the falling tone and is not part of ordinary ALMY spelling
# («maayaʼ tʼaan»).
#
# **Number.** No message here selects on a count. `Intl.PluralRules` has no
# CLDR data for `yua` and falls back to categories Yucatec does not select, and
# a Yucatec noun after a numeral takes no plural suffix, so a `[one]`/`[other]`
# pair would be two copies of one string. Where English writes one, this file
# writes **one unselected form**. `noun-regular-polygon` prints `{ $numSides }`
# before an unmarked «tsel» for that reason.
#
# **Word order.** The modifier **precedes** the noun in Yucatec — «chak nal»,
# red maize — which is English's order too. The composition messages
# (`style-stroke`, `style-with-noun`, `style-filled*`, `style-border-clause`,
# `style-fill`, `style-text`) therefore keep the order English gives them, and
# a reviewer should read that as a decision rather than as an untouched string.
# «yéetel» is the preposition in all of them.
#
# **Loans.** Yucatec has no native geometry or software register; the register
# actually used for this material in Yucatán is Spanish. The shape and style
# nouns here are therefore **Spanish loans written in the ALMY orthography and
# carried in a Yucatec frame**: «línea», «segmento», «rayo», «bektor»,
# «kurba», «funsión», «parábola», «polilínea», «polígono», «triángulo»,
# «rektángulo», «sírkulo», «rejión», «punto», «kwadrado», «rombo», «kurus»,
# «borde», «fondo», «patrón», «sekción», «tabla», «figura», «páajina». The
# words that are not loans are native: «pim» thick, «jaay» thin, «chupaʼan»
# filled, «jaaj» true, «kʼáatchiʼ» question, «meyaj» activity, «jaats» part,
# «tsel» side. `rayaʼan` (dashed) and `puntaʼan` (dotted) are Spanish stems
# taking the native participial `-aʼan`, which is a productive pattern; a
# reviewer may prefer plain loans there.
#
# **What is left out, and why.**
#
#   * `element-name` and `element-anion-name` — the 118 chemical elements — are
#     omitted: chemistry is schooled in Spanish in Yucatán and there is no
#     published Yucatec list of the elements.
#   * The colour table is filled in full, but only six of the twelve families
#     are Yucatec words. «yaʼax» spans green and blue-green and is assigned to
#     `.green`; `.blue` is «chʼoj», the darker blue. That is a genuine seam and
#     not a translation of either English word. Gray, orange, cyan, purple,
#     pink and brown are the Spanish loans a speaker actually says — «gris»,
#     «naranja», «siyan», «morado», «rosa», «kafé» — written as loans rather
#     than coined.
#   * `noun-gender` answers one token, «neutro». Yucatec has no grammatical
#     gender, so nothing in this catalog selects on it.
#   * The three piecewise words are the weakest entries here: Yucatec «wa»
#     covers both *if* and *or*, so `piecewise-condition-if` and
#     `piecewise-condition-or` are the same word, and a reviewer who knows a
#     contrast the seed does not should overwrite both.


## Style vocabulary

color =
    .black = box
    .white = sak
    .gray = gris
    .red = chak
    .orange = naranja
    .yellow = kʼan
    .green = yaʼax
    .cyan = siyan
    .blue = chʼoj
    .purple = morado
    .pink = rosa
    .brown = kafé

line-width =
    .thick = pim
    .thin = jaay

line-style =
    .dashed = rayaʼan
    .dotted = puntaʼan

fill-style =
    .horizontal = líneaʼob orisontal
    .vertical = líneaʼob bertikal
    .diagonal = líneaʼob diagonal
    .backdiagonal = líneaʼob diagonal tu paach
    .dots = puntoʼob
    .diamonds = romboʼob

noun =
    .line = línea
    .line-segment = segmento
    .ray = rayo
    .vector = bektor
    .curve = kurba
    .function = funsión
    .slope-field = kampo tiʼ pendiente
    .vector-field = kampo bektorial
    .parabola = parábola
    .polyline = polilínea
    .polygon = polígono
    .triangle = triángulo
    .rectangle = rektángulo
    .circle = sírkulo
    .region = rejión
    .point = punto
    .square = kwadrado
    .diamond = rombo
    .cross = kurus
    .plus = signo maas

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } tsel polígono regular
    }

noun-gender = neutro


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

style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

style-filled-word = chupaʼan

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } yéetel { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } yéetel { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } yéetel { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

style-border-clause =
    { $parts ->
        [with-article] yéetel junpʼéel { $border } borde
        [and] yéetel xan { $border } borde
        [and-article] yéetel xan junpʼéel { $border } borde
       *[with] yéetel { $border } borde
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = maʼ chupaʼaniʼ

style-text =
    { $parts ->
        [background] { $color } yéetel junpʼéel { $background } fondo
       *[plain] { $color }
    }

style-background-none = minaʼan


## Boolean words

boolean-true = jaaj
boolean-false = maʼ jaajiʼ


## Answer buttons

answer-submit-label = Ils a meyaj
answer-submit-label-no-correctness = Túuxt a núuk


## Sectional blocks

section-name =
    .activity = Meyaj
    .aside = Uláakʼ tʼaan
    .cascade = Kaskada
    .definition = Definisión
    .example = Eʼesajil
    .exercise = Ejersisio
    .exercises = Ejersisioʼob
    .given-answer = Núuk
    .note = Nota
    .objectives = Objetiboʼob
    .paragraphs = Párrafoʼob
    .part = Jaats
    .problem = Problema
    .problems = Problemaʼob
    .proof = Prueba
    .question = Kʼáatchiʼ
    .section = Sekción
    .solution = Solusión
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

hint-title = Áantaj


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
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ": " }
        [unnumbered-caption] Figura{ ": " }
       *[unnumbered] Figura
    }


## Paginator controls

paginator-previous = Paachil
paginator-next = Táanil
paginator-page = Páajina

paginator-page-status = { $pageLabel } { $currentPage } tiʼ { $numPages }


## Piecewise functions

piecewise-condition-or = wa

piecewise-condition-if = wa

piecewise-condition-otherwise = wa maʼeʼ


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately omitted; see the
## header. What is here is the prose around them.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Símbolo kímiko maʼ maʼalobiʼ
chemistry-invalid-ionic-compound = Kompuesto iónico maʼ maʼalobiʼ


## Inputs embedded in math

math-embedded-input-blank = blanko

math-embedded-input-blank-ordinal = blanko { $ordinal } tiʼ { $total }
