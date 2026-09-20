# Qʼeqchiʼ content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
# English, in `locales/en/content.ftl`, is the source of truth.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The ALMG alphabet; see `chrome.ftl`'s header for the
# inventory and for the ejective digraphs. Every apostrophe inside a Qʼeqchiʼ
# word is U+02BC MODIFIER LETTER APOSTROPHE `ʼ`, never U+2019 `’`; the two are
# homoglyphs in most fonts, so a reviewer who retypes a word should check the
# codepoint rather than the shape. Straight ASCII `'` is English's own
# punctuation carried through where a message quotes a value, and is not a
# Qʼeqchiʼ letter. `q` and `k` are two
# different sounds and each keeps its own letter, and long vowels are doubled.
# The colonial-era spellings are not mixed in: no `qu` for `k`, no `hu` for
# `w`, no `k` standing for uvular `q`, no `4` or `ɜ` for an ejective. The
# language is named «Qʼeqchiʼ», spelled exactly that way.
#
# **Number.** `Intl.PluralRules` has no CLDR data for `kek` and falls back to
# the default locale, reporting `one` and `other` — categories Qʼeqchiʼ does not
# select. A noun after a numeral is not marked for plural, so nothing here
# writes a plural select; `noun-regular-polygon` carries `{ $numSides }` in one
# unselected form.
#
# **Word order.** The modifier **precedes** the noun in Qʼeqchiʼ — «raxsutzʼ»,
# a green cloud — so the composition messages keep English's order rather than
# reversing it: `style-stroke`, `style-with-noun`, `style-filled*` and
# `style-fill` all put the description in front of the thing described, and
# `noun-regular-polygon` holds the side count in its `[head]` with an empty
# `[tail]`. The one place the order is not simply English's is the possessive
# prefix, the constraint `locales/quc`'s header describes and which Qʼeqchiʼ
# shares: «rix», a border, is already a possessed form, and a pattern cannot be
# attached to a shape by a prefix that would have to see `{ $pattern }`'s first
# sound. So a pattern is joined with «rikʼin», the free comitative, and nothing
# is welded onto a placeable.
#
# **Loans.** The geometry and layout nouns are Spanish loans written to ALMG
# spelling — «sirkulo», «bektor», «punto», «funsion», «parabola», «poligono»,
# «rektangulo», «rombo», «kampo», «tabla», «figura», «seksion», «teorema»,
# «definision», «ehersisio», «obhetibo», «parrapo», «prweba», «kaskada» — set
# inside a Qʼeqchiʼ frame with native verbs and native modifiers. Where a shape
# does have a Qʼeqchiʼ name it keeps it: «raqal» a line, «oxibʼ xukut» a
# triangle, «kaahibʼ xukut» a square, «naʼajej» a region, «nujenaq» filled.
#
# **Colour.** «rax» spans what English splits into green and blue and takes
# `.green` here. `.blue` is filled with «asul», the Spanish loan present-day
# speech actually uses; that is a record of current usage, not a translation of
# the English word, and the seam between the two categories is real. The same
# seam is recorded in `locales/quc`, which resolves it the same way.
#
# **Gender.** Qʼeqchiʼ has no grammatical gender and no adjective agreement, so
# `noun-gender` answers a single token and nothing in this file selects on it,
# nor on `$role`.
#
# **Confidence.** `element-name` and `element-anion-name` are left out: chemistry
# is schooled in Spanish and there is no published Qʼeqchiʼ list of the 118
# elements, so those keys fall back to English. Everything else is answered.
# The weakest entries are `.cascade`, `.aside` and `.objectives` in
# `section-name`, which name a written-document register Qʼeqchiʼ is only
# beginning to have.


## Style vocabulary

color =
    .black = qʼeq
    .white = saq
    .gray = qʼeqsaq
    .red = kaq
    .orange = kaqqʼan
    .yellow = qʼan
    .green = rax
    .cyan = syan
    .blue = asul
    .purple = morad
    .pink = kaqsaq
    .brown = kape

line-width =
    .thick = pim
    .thin = jay

line-style =
    .dashed = jachbʼil
    .dotted = tzʼuubʼ

fill-style =
    .horizontal = raqal orisontal
    .vertical = raqal bertikal
    .diagonal = raqal diagonal
    .backdiagonal = raqal diagonal sukʼisinbʼil
    .dots = tzʼuubʼ
    .diamonds = rombo

noun =
    .line = raqal
    .line-segment = jachal raqal
    .ray = raqal junpakʼal
    .vector = bektor
    .curve = kotkʼo raqal
    .function = funsion
    .slope-field = kampo re pendiente
    .vector-field = kampo re bektor
    .parabola = parabola
    .polyline = polilinea
    .polygon = poligono
    .triangle = oxibʼ xukut
    .rectangle = rektangulo
    .circle = sirkulo
    .region = naʼajej
    .point = punto
    .square = kaahibʼ xukut
    .diamond = rombo
    .cross = kurus
    .plus = mas

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } xukut poligono regular
    }

noun-gender = junaj


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

style-filled-word = nujenaq

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } rikʼin { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } rikʼin { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } rikʼin { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

style-border-clause =
    { $parts ->
        [with-article] rikʼin jun { $border } rix
        [and] ut { $border } rix
        [and-article] ut jun { $border } rix
       *[with] rikʼin { $border } rix
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = inkʼaʼ nujenaq

style-text =
    { $parts ->
        [background] { $color } rikʼin jun { $background } chi rix
       *[plain] { $color }
    }

style-background-none = maakʼaʼ


## Boolean words

boolean-true = yaal
boolean-false = moko yaal ta


## Answer buttons

answer-submit-label = Ilomaq li kʼanjel
answer-submit-label-no-correctness = Taqla li sumenk


## Sectional blocks

section-name =
    .activity = Kʼanjelank
    .aside = Tzʼaqonk chi xkʼatq
    .cascade = Kaskada
    .definition = Definision
    .example = Eetalil
    .exercise = Ehersisio
    .exercises = Ehersisio
    .given-answer = Sumenk
    .note = Nota
    .objectives = Obhetibo
    .paragraphs = Parrapo
    .part = Jachal
    .problem = Chʼaʼajkilal
    .problems = Chʼaʼajkilal
    .proof = Prweba
    .question = Patzʼom
    .section = Seksion
    .solution = Sumenkil
    .task = Kʼanjelil
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

hint-title = Tenqʼ


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

paginator-previous = Junxil
paginator-next = Moqon
paginator-page = Perel

paginator-page-status = { $pageLabel } { $currentPage } re { $numPages }


## Piecewise functions

piecewise-condition-or = malaj

piecewise-condition-if = wi

piecewise-condition-otherwise = wi inkʼaʼ


## Chemistry
##
## `element-name` and `element-anion-name` are omitted: chemistry is schooled in
## Spanish in Alta Verapaz and the Petén, and there is no published Qʼeqchiʼ
## list of the 118 elements to translate them from.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Inkʼaʼ us li reetalil kimiko
chemistry-invalid-ionic-compound = Inkʼaʼ us li kʼuubʼanbʼil ioniko

## Inputs embedded in math

math-embedded-input-blank = blanko

math-embedded-input-blank-ordinal = blanko { $ordinal } re { $total }
