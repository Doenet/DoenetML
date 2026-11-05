# Papiamentu (Kòrsou/Boneiru) content catalog: the prose the core computes
# into the document. Translated from `locales/en/content.ftl`, which is the
# source of truth. Selected by `documentLocale` — the language the activity
# was written in.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This catalog is written in the **phonological orthography
# of Curaçao and Bonaire** — Papiamentu, spelled «kas», «yu», «skol», «bèk»,
# «buki», «hende». The **etymological orthography of Aruba** — Papiamento,
# «cas», «hoben», «trece» — is a real and equally official alternative and is
# deliberately **not** mixed into any of these four files. A reviewer from
# Aruba would **respell** this catalog rather than retranslate it: the words
# are the same, the spelling system is not. `chrome.ftl`'s header sets out the
# letters that carry the distinction — `k` and `s` for etymological `c`/`qu`/
# `z`, `y` for `j`/`ll`, and the vowel letters `è ò ù`. Papiamentu also writes
# an acute accent for irregular stress and tone («kámbia»; the «paña» /
# «pañá» pattern); this seed marks stress only where the standard orthography
# requires it, so accent placement is what a reviewer should check first.
#
# **Word order: the modifier FOLLOWS the noun.** A Papiamentu adjective
# stands after its head — «liña kòrá» is *red line* and «kas grandi» is *big
# house*, in that order, which is the reverse of English. So the composition
# messages here **reverse** the English order: `style-with-noun` puts
# `{ $noun }` before `{ $description }`, and `style-filled-with-noun` does the
# same, which places «yená» and the colour word after the noun as well.
# `style-fill` puts the colour after the pattern for the same reason, and
# `style-border-clause` puts the description after «rant».
#
# **No agreement.** Papiamentu has no grammatical gender and no adjective
# agreement — one form of «kòrá» serves every noun — so no message here forks
# on `$gender` or `$role`, and `noun-gender` answers a single token that
# nothing reads.
#
# **Number.** `Intl.PluralRules("pap")` resolves to `pap` and reports
# `['one','other']`. Papiamentu pluralizes with «-nan», but a noun after a
# numeral is unmarked — «dos kas», never «dos kasnan» — so both branches would
# be word-for-word identical, which is why one unselected form is written
# wherever English selects on a count. No count-driven select appears in this
# file.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# School science on Curaçao and Bonaire is taught in Dutch, from Dutch
# textbooks; there is no settled Papiamentu periodic table and no published
# Papiamentu spelling for the hundred and eighteen names. Writing one out
# would be transliterating the Dutch list and calling the result a Papiamentu
# nomenclature. `lint:i18n` reports the two keys as missing coverage and that
# is the correct report. `ion-name-oxidation-state`,
# `chemistry-invalid-symbol` and `chemistry-invalid-ionic-compound` **are**
# covered — they are frames, not vocabulary.
#
# **Loans kept, rather than coined.** Dutch- and Spanish-mediated: «funshon»,
# «vektor», «parabola», «poligon», «matriz», «komponente», «seksion»,
# «solushon», «ehèmpel», «teorema», «definishon», «aktividat», «tabel»,
# «diagrama». The grammar around them is Papiamentu: «ta / a / lo / tabata»
# before the verb, «no» for negation, «di» for possession, «pa» for purpose.
# «sian» for *cyan* is the weakest word in this file — Papiamentu has «blou»
# and no settled word for cyan, and a speaker may prefer «blou kla».
#
# **The technical vocabulary here is a lexifier loan set.** Every technical
# noun in this file is a Dutch- or Spanish-mediated loan — those are the words
# Papiamentu actually uses, not a substitute for a native term — carried in
# Papiamentu's own orthography and Papiamentu's own grammar. The sentences
# around the loans are Papiamentu, not Dutch and not Spanish.


## Style vocabulary

color =
    .black = pretu
    .white = blanku
    .gray = shinishi
    .red = kòrá
    .orange = orañe
    .yellow = geel
    .green = bèrdè
    .cyan = sian
    .blue = blou
    .purple = lila
    .pink = ros
    .brown = brùin

line-width =
    .thick = diki
    .thin = fini

line-style =
    .dashed = di strepi
    .dotted = di punto

fill-style =
    .horizontal = liña horizontal
    .vertical = liña vertikal
    .diagonal = liña diagonal
    .backdiagonal = liña diagonal invertí
    .dots = punto
    .diamonds = diamante

noun =
    .line = liña
    .line-segment = segmento di liña
    .ray = semirekta
    .vector = vektor
    .curve = kurva
    .function = funshon
    .slope-field = kampo di pendiente
    .vector-field = kampo di vektor
    .parabola = parabola
    .polyline = polilinia
    .polygon = poligon
    .triangle = triángulo
    .rectangle = rektángulo
    .circle = sirkulo
    .region = region
    .point = punto
    .square = kuadrado
    .diamond = diamante
    .cross = krus
    .plus = plus

# The side count stays in the head, as it does in English: nothing in Doenet
# asks for the tail today, and a locale that emptied the head would lose the
# count. «poligon regular di 5 banda».
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligon regular di { $numSides } banda
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

# Reversed against English: the noun comes first and the description follows
# it, because a Papiamentu adjective stands after its head.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }

style-filled-word = yená

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ku { $pattern }
       *[plain] { $filled } { $color }
    }

# Reversed for the same reason as `style-with-noun`: «sirkulo yená blou ku
# diamante».
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ku { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ku { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

style-border-clause =
    { $parts ->
        [with-article] ku un rant { $border }
        [and] i rant { $border }
        [and-article] i un rant { $border }
       *[with] ku rant { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = sin yena

style-text =
    { $parts ->
        [background] { $color } ku un fondo { $background }
       *[plain] { $color }
    }

style-background-none = niun


## Boolean words

boolean-true = bèrdat
boolean-false = falsu


## Answer buttons

answer-submit-label = Kontrolá Trabou
answer-submit-label-no-correctness = Manda Kontesta


## Sectional blocks

section-name =
    .activity = Aktividat
    .aside = Nota banda
    .cascade = Kaskada
    .definition = Definishon
    .example = Ehèmpel
    .exercise = Ehersisio
    .exercises = Ehersisionan
    .given-answer = Kontesta
    .note = Nota
    .objectives = Opjetivonan
    .paragraphs = Paragrafonan
    .part = Parti
    .problem = Problema
    .problems = Problemanan
    .proof = Prueba
    .question = Pregunta
    .section = Seksion
    .solution = Solushon
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

hint-title = Sugerensia


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabel { $enumeration }
        [numbered-title] Tabel { $enumeration }{ ": " }
        [unnumbered-title] Tabel{ ": " }
       *[unnumbered] Tabel
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
paginator-next = Siguiente
paginator-page = Página

paginator-page-status = { $pageLabel } { $currentPage } di { $numPages }


## Piecewise functions

piecewise-condition-or = of

piecewise-condition-if = si

piecewise-condition-otherwise = den otro kaso


## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Símbolo Kímiko Inválido
chemistry-invalid-ionic-compound = Kompuesto Ióniko Inválido

## Inputs embedded in math

math-embedded-input-blank = blanko

math-embedded-input-blank-ordinal = blanko { $ordinal } di { $total }
