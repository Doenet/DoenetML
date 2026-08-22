# Mooré content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `mos` is Mooré, the language of the Mossi and the most widely spoken language
# of Burkina Faso. CLDR renders `mos` "Mossi", which is the people; the
# language is Mooré, and they are the same entry.
#
# **`$gender` is a noun class here and the concord is a suffix**, which makes
# this the second family to answer that argument from the back of the word
# rather than the front. `locales/ff` was the first, and Fula is
# Atlantic-Congo; Mooré is Gur. What the two have in common is not ancestry
# close enough to explain it but the plain fact the argument was built for:
# `$gender` names *what a word agrees with*, and where the agreement is spelled
# is the catalog's business. Nineteen Bantu catalogs spell it as a prefix, three
# Berber ones as an initial vowel, and these two as an ending.
#
# The class tokens are this catalog's own. Gur class numbering is not Bantu's,
# and nothing outside a catalog reads these values, so `c1` to `c4` here index
# Mooré's four suffix sets and mean nothing in `locales/zu`:
#
#            c1 (-ga)    c2 (-go)    c3 (-re)    c4 (-m)
#   sabl-     sablga      sablgo      sablre      sablem
#   pɛɛl-     pɛɛlga      pɛɛlgo      pɛɛlre      pɛɛlem
#   miug-     miugga      miuggo      miugre      miugum
#   bɛd-      bɛdga       bɛdgo       bɛdre       bɛdem
#   bil-      bilga       bilgo       bilre       bilem
#   pid-      pidga       pidgo       pidre       pidem
#
# **A Mooré noun phrase can also be built as a compound**, with the noun
# dropped to its bare stem and the class suffix carried by the last modifier
# alone. This catalog does not write that construction, and the reason is the
# affix rule the README states: the last element of a description is often a
# placeable — `{ $color }`, `{ $pattern }` — and a suffix cannot be welded to a
# word the catalog never sees. The juxtaposed construction, where the noun
# keeps its own suffix and each adjective agrees with it, is grammatical, is
# what a school text writes, and is right whatever lands beside it. That is
# *choose the words that land there* applied to a whole construction rather
# than to one word, which is `locales/kab`'s move reached from Gur.
#
# Only the six words with a Mooré stem inflect — three colours, both widths and
# the filled word, which is the last row of the table above; the remaining
# colours are nouns and are written bare. `$role` goes unused: Mooré marks no
# case.
#
# The mathematical vocabulary is adapted from French, which is what a Burkinabè
# classroom teaches mathematics in, except where Mooré has its own word —
# «sõore», «gilgu», «zĩiga», «bãnde». It is the first thing to check.


## Style vocabulary

# Only the three with a Mooré stem inflect.
color =
    .black =
        { $gender ->
            [c2] sablgo
            [c3] sablre
            [c4] sablem
           *[c1] sablga
        }
    .white =
        { $gender ->
            [c2] pɛɛlgo
            [c3] pɛɛlre
            [c4] pɛɛlem
           *[c1] pɛɛlga
        }
    .gray = tõmpeglem
    .red =
        { $gender ->
            [c2] miuggo
            [c3] miugre
            [c4] miugum
           *[c1] miugga
        }
    .orange = orãze
    .yellow = zãnze
    .green = vɛr
    .cyan = siã
    .blue = ble
    .purple = viole
    .pink = roze
    .brown = maroŋ
line-width =
    .thick =
        { $gender ->
            [c2] bɛdgo
            [c3] bɛdre
            [c4] bɛdem
           *[c1] bɛdga
        }
    .thin =
        { $gender ->
            [c2] bilgo
            [c3] bilre
            [c4] bilem
           *[c1] bilga
        }
# Written as an invariable «ne …» phrase, so that it agrees with nothing and
# can close the description; `style-stroke` puts it last for that reason. That
# is also what keeps the class suffix off the end of the phrase, where a
# placeable often stands.
line-style =
    .dashed = ne tirɛ
    .dotted = ne poẽ-poẽ
fill-style =
    .horizontal = sõoya sẽn gãe
    .vertical = sõoya sẽn yals
    .diagonal = sõoya sẽn kẽng zãnga
    .backdiagonal = sõoya sẽn kẽng zãnga a to wã
    .dots = poẽ-poẽ
    .diamonds = diamã
noun =
    .line = sõore
    .line-segment = sõor sɛgmã
    .ray = rayõ
    .vector = vɛktɛɛr
    .curve = sõor sẽn gob
    .function = fõksiõ
    .parabola = parabol
    .polyline = sõor sɛgmã rãmba
    .polygon = poligonre
    .triangle = triyangl
    .rectangle = rɛktangl
    .circle = gilgu
    .region = zĩiga
    .point = poẽ
    .square = kare
    .diamond = diamã
    .cross = kruwa
    .plus = paas-bãnde
# The side count is a relative and closes the noun phrase behind the describing
# words rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] sẽn tar kɩrems { $numSides }
       *[head] poligonre sẽn zems
    }
# The noun class. A Mooré noun's class is usually legible in its own suffix —
# «sõore» is `-re`, so `c3` — but the class is a fact about the noun rather
# than about its ending, and two entries here say so: «zĩiga» is `c2` despite
# `-ga`, and «sõor sẽn gob» is `c2` where the bare «sõore» it is built on is
# `c3`. The French loans carry no Mooré suffix to read at all, which is why
# they fall to the default. `c1` is that default, and what an author's own
# `markerStyleWord` gets, the catalog never having seen it.
noun-gender =
    { $noun ->
        [line] c3
        [line-segment] c3
        [polyline] c3
        [polygon] c3
        [regular-polygon] c3
        [border] c3
        [circle] c2
        [curve] c2
        [region] c2
        [text] c4
        [fill] c4
       *[other] c1
    }

## Style composition

# The dash pattern is a «ne …» phrase and closes the description, so it moves
# behind the colour rather than sitting between the width and it.
style-stroke =
    { $parts ->
        [width-style-color] { $width } { $color } { $lineStyle }
        [width-color] { $width } { $color }
        [style-color] { $color } { $lineStyle }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [c2] pidgo
        [c3] pidre
        [c4] pidem
       *[c1] pidga
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ne { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ne { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ne { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «noore» is the border and leads its own describing words, so they agree with
# it rather than with the shape it surrounds. Mooré has no article and joins
# this clause with the invariable «ne», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] ne noore { $border }
        [and] ne noore { $border }
        [and-article] ne noore { $border }
       *[with] ne noore { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = pa pid ye
style-text =
    { $parts ->
        [background] { $color } ne poorẽ { $background }
       *[plain] { $color }
    }
style-background-none = baa fʋɩ

## Boolean words

boolean-true = sɩda
boolean-false = ziri

## Answer buttons

answer-submit-label = Ges Tʋʋmdã
answer-submit-label-no-correctness = Tʋm Leoorã

## Sectional blocks

section-name =
    .activity = Tʋʋmde
    .aside = Paasgo
    .cascade = Toolgo
    .definition = Bilgri
    .example = Makre
    .exercise = Zãmsgo
    .exercises = Zãmsg rãmba
    .given-answer = Leoore
    .note = Gũusgo
    .objectives = Tʋlsem
    .paragraphs = Sull rãmba
    .part = Babga
    .problem = Zu-loɛɛga
    .problems = Zu-loees
    .proof = Kaset
    .question = Sokre
    .section = Babga
    .solution = Tɩɩm
    .task = Tʋʋmde
    .theorem = Teorɛm
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Bãnde

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tablo { $enumeration }
        [numbered-title] Tablo { $enumeration }{ ": " }
        [unnumbered-title] Tablo{ ": " }
       *[unnumbered] Tablo
    }
figure-name =
    { $parts ->
        [numbered] Fiigɩɩr { $enumeration }
        [numbered-caption] Fiigɩɩr { $enumeration }{ ": " }
        [unnumbered-caption] Fiigɩɩr{ ": " }
       *[unnumbered] Fiigɩɩr
    }

## Paginator controls

paginator-previous = Sẽn looge
paginator-next = Sẽn pʋgende
paginator-page = Seb-neng
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = wall
piecewise-condition-if = sã n yaa
piecewise-condition-otherwise = zĩis a taab fãa

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Burkina Faso teaches secondary science in French, so
## a Mooré speaker meets the periodic table there and the fallback *is* the
## curriculum — the same answer `locales/dyu` gives from a neighbouring
## ministry and `locales/dag` does not, Ghana teaching it in English.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Sɩmi Bãnd Sẽn Pa Zems
chemistry-invalid-ionic-compound = Ayõ Lagengr Sẽn Pa Zems
