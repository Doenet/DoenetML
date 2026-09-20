# Sango content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `sg` is Sängö, co-official with French in the Central African Republic and
# the country's lingua franca. The roster reads "Sango (Sängö)".
#
# **Sango has exactly one plural category.** `Intl.PluralRules("sg")` reports
# `other` and nothing else, so no message in this catalog can select on a
# count, and every counted message is written flat — the shape `locales/bm`,
# `locales/wo`, `locales/yo` and `locales/ig` already have in this family, and
# `locales/ja` and `locales/th` outside it. The `[0]` branches that survive are
# matched by *number* rather than by category, since Fluent resolves an
# explicit number before it consults the plural rules, so a wording for none is
# still reachable.
#
# **It selects on `$gender` no more than on a count.** Sango is an Ubangian
# language with no grammatical gender, no noun classes and no adjective
# agreement of any kind; a describing word follows its noun and never changes
# shape. So `noun-gender` answers one token that nothing reads. Sango and
# `locales/luo` reach that answer from two different families, and both sit
# among sixteen Bantu catalogs that fork on three to six noun classes apiece —
# which is the sharpest form this roster has of *a region says nothing about
# agreement*.
#
# **The tone marks are part of the spelling**, not decoration: Sango writes
# â, ê, î, ô, û for the falling tone and ä, ë, ï, ö, ü for the high, and
# «kötä» (big) and «kota» are not the same word. Everything here uses the
# precomposed characters.
#
# The technical vocabulary is French-derived and openly so. The Central African
# Republic teaches secondary mathematics in French, so the geometry nouns below
# are French loans written in Sango orthography; «kâmba», «mbëtï», «lêgë» and
# «kua» are Sango words. A speaker with the mother-tongue materials in front of
# them should replace the loans first.


## Style vocabulary

color =
    .black = vukö
    .white = vurü
    .gray = gri
    .red = bengbä
    .orange = oranzi
    .yellow = zôni
    .green = ngûnzä
    .cyan = siyâni
    .blue = bulë
    .purple = viölê
    .pink = rôzo
    .brown = maröon
line-width =
    .thick = kötä
    .thin = kete
line-style =
    .dashed = na akete mbâgë
    .dotted = na apoin
fill-style =
    .horizontal = alignë so alängö
    .vertical = alignë so aluti
    .diagonal = alignë so aveke
    .backdiagonal = alignë so aveke na mbâgë ndê
    .dots = apoin
    .diamonds = adiamäan
noun =
    .line = lignë
    .line-segment = mbâgë tî lignë
    .ray = rêyon
    .vector = vektëre
    .curve = lignë so agbian
    .function = kua
    .parabola = parabôle
    .polyline = lignë tî ambâgë
    .polygon = poligöne
    .triangle = triyängle
    .rectangle = rektängle
    .circle = serkle
    .region = ndo
    .point = poin
    .square = kare
    .diamond = diamäan
    .cross = kürüzo
    .plus = fä tî bûngbi
# The side count is a relative clause and closes the noun phrase behind the
# describing words rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] so ayeke na ambâgë { $numSides }
       *[head] poligöne so alîngbi
    }
# Nothing selects on it: Sango has no gender and no noun classes.
noun-gender = neuter

## Style composition

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
# The noun leads and its describing words follow, with the noun's own relative
# complement closing the phrase.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = so asï
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } na { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } na { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } na { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Sango has no article, so the two `-article` branches read like their
# neighbours; «na» joins the clause and never changes shape.
style-border-clause =
    { $parts ->
        [with-article] na ndâmbo { $border }
        [and] na ndâmbo { $border }
        [and-article] na ndâmbo { $border }
       *[with] na ndâmbo { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = asï pëpe
style-text =
    { $parts ->
        [background] { $color } na ndö tî pekô { $background }
       *[plain] { $color }
    }
style-background-none = mbênî ye pëpe

## Boolean words

boolean-true = tâ tënë
boolean-false = mvene

## Answer buttons

answer-submit-label = Bâa Kua
answer-submit-label-no-correctness = Tokua Kîri-tënë

## Sectional blocks

section-name =
    .activity = Kua
    .aside = Tënë tî mbâgë
    .cascade = Mölöngö
    .definition = Fängö-ndâ
    .example = Tapandë
    .exercise = Egzersîsi
    .exercises = Egzersîsi
    .given-answer = Kîri-tënë
    .note = Nôte
    .objectives = Akûngbi
    .paragraphs = Aparagrâfe
    .part = Mbâgë
    .problem = Kpälë
    .problems = Akpälë
    .proof = Fä tî tâ tënë
    .question = Hûndängö-tënë
    .section = Mbâgë
    .solution = Kîrïngö-ndâ
    .task = Kua
    .theorem = Tëorêm
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Fängö-lêgë

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
        [numbered] Fôto { $enumeration }
        [numbered-caption] Fôto { $enumeration }{ ": " }
        [unnumbered-caption] Fôto{ ": " }
       *[unnumbered] Fôto
    }

## Paginator controls

paginator-previous = Kôzo
paginator-next = Na pekô
paginator-page = Lêmbëtï
paginator-page-status = { $pageLabel } { $currentPage } na yâ tî { $numPages }

## Piecewise functions

piecewise-condition-or = wala
piecewise-condition-if = tônde
piecewise-condition-otherwise = tônde ayeke tongasô pëpe

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. The Central African Republic teaches secondary
## science in French, so a Sango speaker meets the periodic table there and the
## fallback *is* the curriculum — which is `locales/ht`'s case and
## `locales/ln`'s, reached through a third education ministry.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Fä tî Shimïi so Ayeke Sïönî
chemistry-invalid-ionic-compound = Bûngbïngö tî Iôni so Ayeke Sïönî
