# Jamaican Creole (Patwa, «Jamiekan») content catalog: the prose the core
# computes into the document. Selected by `documentLocale` — the language the
# activity was written in, not the reader's UI language.
#
# `locales/en/content.ftl` is the source of truth: `lint:i18n` rejects a key
# that does not exist there. Message ids and `.attribute` suffixes are never
# translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file is written in the **Cassidy phonemic
# orthography** (Cassidy 1961, as regularized by the Jamaican Language Unit at
# UWI Mona), the same system as the other three files in this directory. It is
# not written in English-based spelling. Most everyday written Jamaican — song
# lyrics, social media, advertising, published dialogue — uses English
# spelling conventions instead, so this catalog does not look like what a
# Jamaican reader usually sees written. A reviewer who chooses the
# English-based system would **respell** the entire catalog rather than
# retranslate it, so that choice has to be made once and applied to all four
# files together. `chrome.ftl`'s header sets the system out: five vowels
# `i e a o u`, long vowels doubled («tii», «taak», «tuu»), three diphthongs
# `ie ai ou` («niem», «brait», «tou»), palatal `ky` and `gy` («kyaan»,
# «gyal»), `h` written only where it is pronounced, and no apostrophes for
# "missing" English letters. No diacritics are used.
#
# Two Cassidy spellings appear a great deal in this file and are worth naming
# so they are not read as slips: English *tr-* is «chr-» in Jamaican, so
# *triangle* is «chraiangl» and *true* is «chruu»; and English *dr-* is «jr-».
#
# **Word order: the modifier comes before the noun.** A Jamaican Creole
# attributive adjective stands in front of its head, exactly as in English —
# «big hous», «red lain», «tik red lain». So every composition message here
# **keeps the English order**; none of them is reversed.
#
# **No agreement.** Jamaican Creole has no grammatical gender and an
# attributive adjective takes no ending, so no message in this file forks on
# `$gender` or `$role`. `noun-gender` answers a single token that nothing
# reads.
#
# **Number.** `Intl.PluralRules` has no CLDR data of its own for `jam`; the
# probe resolves it to `en-US` and reports `['one', 'other']`. Jamaican Creole
# does not inflect a noun after a numeral — «tuu buk» — and marks plurality
# with the postposed particle «dem» («di buk dem»), which a count does not
# trigger. The two branches would therefore be word-for-word identical, which
# is why no count-driven select is written anywhere in these four files.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the two English keys this file does not cover.
# School science in Jamaica is taught in English, from English textbooks and
# to English-language examinations; there is no settled Jamaican Creole
# periodic table and no published Cassidy spelling for the hundred and
# eighteen element names. Writing one out would be inventing a nomenclature
# and presenting it as an existing one. `lint:i18n` reports the two keys as
# missing coverage and that is the correct report. `ion-name-oxidation-state`,
# `chemistry-invalid-symbol` and `chemistry-invalid-ionic-compound` **are**
# covered: they are frames, not vocabulary.
#
# **Loans kept, rather than coined.** The mathematical and technical
# vocabulary comes from English, which is normal for Jamaican and is not a
# defect; it is written in Cassidy spelling with Jamaican grammar around it:
# «fongkshan», «vekta», «paligan», «parabola», «rektangl», «sorkl», «kov»,
# «riijan», «kompuonent», «atribyut», «sekshan», «definishan», «tiirem».
# **«saian»** for *cyan* is the weakest word in the file — there is no settled
# Jamaican word for it, and a speaker may prefer a phrase built on «bluu». So
# is **«pwaint»** for *point*: the vowel of English *point* has no separate
# letter in the five-vowel system, and «pwaint» is the shape Cassidy's «bwai»
# *boy* implies. A reviewer should look at both of those first.
#
# The technical vocabulary here is **an English loan set carried in Jamaican
# Creole's own grammar and written in Cassidy spelling**. The loans are the
# words the language actually uses; the sentences around them are Jamaican,
# not English. A Cassidy-spelled English loan is correct. An English sentence
# anywhere in these four files is a defect.


## Style vocabulary

color =
    .black = blak
    .white = wait
    .gray = grie
    .red = red
    .orange = arinj
    .yellow = yelo
    .green = griin
    .cyan = saian
    .blue = bluu
    .purple = popl
    .pink = pink
    .brown = brong

line-width =
    .thick = tik
    .thin = tin

line-style =
    .dashed = dash-dash
    .dotted = dat-dat

fill-style =
    .horizontal = arizantal lain
    .vertical = votikal lain
    .diagonal = daiaganal lain
    .backdiagonal = bakwod daiaganal lain
    .dots = dat
    .diamonds = daiman

noun =
    .line = lain
    .line-segment = lain sigment
    .ray = rie
    .vector = vekta
    .curve = kov
    .function = fongkshan
    .slope-field = sluop fiil
    .vector-field = vekta fiil
    .parabola = parabola
    .polyline = palilain
    .polygon = paligan
    .triangle = chraiangl
    .rectangle = rektangl
    .circle = sorkl
    .region = riijan
    .point = pwaint
    .square = skwier
    .diamond = daiman
    .cross = kraas
    .plus = plos

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-said reglar paligan
    }

noun-gender = nyuuta


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

style-filled-word = ful-op

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } wid { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } wid { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } wid { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

style-border-clause =
    { $parts ->
        [with-article] wid wan { $border } baada
        [and] an { $border } baada
        [and-article] an wan { $border } baada
       *[with] wid { $border } baada
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = no ful op

style-text =
    { $parts ->
        [background] { $color } wid wan { $background } bakgrong
       *[plain] { $color }
    }

style-background-none = non


## Boolean words

boolean-true = chruu
boolean-false = faals


## Answer buttons

answer-submit-label = Chek Di Wok
answer-submit-label-no-correctness = Sen Di Ansa


## Sectional blocks

section-name =
    .activity = Aktiviti
    .aside = Said Nuot
    .cascade = Kaskied
    .definition = Definishan
    .example = Egzampl
    .exercise = Egzasaiz
    .exercises = Egzasaiz Dem
    .given-answer = Ansa
    .note = Nuot
    .objectives = Objektiv Dem
    .paragraphs = Parigraaf Dem
    .part = Paat
    .problem = Prablem
    .problems = Prablem Dem
    .proof = Pruuf
    .question = Kwestyan
    .section = Sekshan
    .solution = Soluushan
    .task = Taask
    .theorem = Tiirem

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Hint


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tiebl { $enumeration }
        [numbered-title] Tiebl { $enumeration }{ ": " }
        [unnumbered-title] Tiebl{ ": " }
       *[unnumbered] Tiebl
    }

figure-name =
    { $parts ->
        [numbered] Figa { $enumeration }
        [numbered-caption] Figa { $enumeration }{ ": " }
        [unnumbered-caption] Figa{ ": " }
       *[unnumbered] Figa
    }


## Paginator controls

paginator-previous = Bak
paginator-next = Neks
paginator-page = Piej

paginator-page-status = { $pageLabel } { $currentPage } outa { $numPages }


## Piecewise functions

piecewise-condition-or = ar
piecewise-condition-if = if
piecewise-condition-otherwise = adawaiz


## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Kemikal Simbal We No Valid
chemistry-invalid-ionic-compound = Aianik Kompong We No Valid


## Inputs embedded in math

math-embedded-input-blank = blangk

math-embedded-input-blank-ordinal = blangk { $ordinal } outa { $total }
