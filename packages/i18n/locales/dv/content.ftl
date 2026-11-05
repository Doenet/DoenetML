# Dhivehi content catalog: the prose the core computes into the document.
# Selected by `documentLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in **Thaana**, which is the only script Dhivehi is written in today
# and what CLDR fills a bare `dv` in as. `directionOf` already answers `rtl`
# from two directions at once — Thaana is in `RTL_SCRIPTS` and `dv` is in
# `RTL_LANGUAGES` — so `direction.ts` needed nothing, and this is the roster's
# tenth right-to-left catalog. The file is written in logical order; brackets
# are written opening-first and the bidi algorithm turns them around at render
# time. Digits stay Latin.
#
# `dv` is the batch's one locale whose **endonym comes back as its English
# name**: CLDR has no Dhivehi-language data to answer with, so `endonym` equals
# `englishName` and the roster reads "Divehi" once rather than twice. That is
# `locales/co`'s case, with the same twist Klingon has — Dhivehi has a
# perfectly well-known endonym, «ދިވެހި», and CLDR simply does not carry it.
#
# Dhivehi selects on neither argument: no grammatical gender, no adjective
# agreement, and adjectives stand in front of the noun.
#
# **One thing this catalog gets wrong and cannot fix from here.** Dhivehi's
# conditional particle «ނަމަ» is *clause-final* — the condition comes first and
# the particle closes it — but `piecewise-condition-if` is a word the renderer
# places *before* the mathematics it introduces. So «ނަމަ» reads on the wrong
# side, and no wording in this file can move it. It is the `locales/tpi` shape:
# a distinction the composition messages do not expose, recorded here rather
# than worked around. Splitting that key into a prefix and a suffix is a change
# to the worker that no existing catalog needs and this one would use.


## Style vocabulary

color =
    .black = ކަޅު
    .white = ހުދު
    .gray = އަޅި
    .red = ރަތް
    .orange = އޮރެންޖު
    .yellow = ރީނދޫ
    .green = ފެހި
    .cyan = ސަޔާން
    .blue = ނޫ
    .purple = ދަނބު
    .pink = ފިޔާތޮށި
    .brown = މުށި
line-width =
    .thick = ބޯ
    .thin = ތުނި
line-style =
    .dashed = ކެނޑިކެނޑިގެން
    .dotted = ތިކިޖެހި
fill-style =
    .horizontal = އަރިމަތީ ރޮނގު
    .vertical = ސީދާ ރޮނގު
    .diagonal = ކަނާތު ބުރި ރޮނގު
    .backdiagonal = ވާތު ބުރި ރޮނގު
    .dots = ތިކި
    .diamonds = މުއްބަރު
noun =
    .line = ރޮނގު
    .line-segment = ރޮނގުކޮޅު
    .ray = ދޯދި
    .vector = ވެކްޓަރު
    .curve = ގުދު ރޮނގު
    .function = ފަންކްޝަން
    .parabola = ޕެރެބޮލާ
    .polyline = ގިނަ ރޮނގު
    .polygon = ގިނަކަން
    .triangle = ތިންކަން
    .rectangle = ހަތަރެސްކަން
    .circle = ބުރު
    .region = ސަރަހައްދު
    .point = ނުކުތާ
    .square = މުރައްބައު
    .diamond = މުއްބަރު
    .cross = ގުނަކުރުމުގެ ނިޝާން
    .plus = އެއްކުރުމުގެ ނިޝާން
# «-ކަން ހުރި» takes the count and stands in front of the noun, so nothing
# follows the adjectives and the tail is empty.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } ކަން ހުރި ހަމަހަމަ ގިނަކަން
    }
# Nothing selects on it: Dhivehi has no grammatical gender.
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
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
style-filled-word = ފުރިފައިވާ
# «އިން» ("with, by means of") follows what it governs, so the pattern moves to
# the front of the phrase where English appends it. It has one shape whatever
# precedes it.
style-filled =
    { $parts ->
        [pattern] { $pattern } އިން { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } އިން { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } އިން { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# Dhivehi has no article, so the two `-article` branches read like their
# neighbours; «އަދި» is the conjunction and stands in front.
style-border-clause =
    { $parts ->
        [with-article] { $border } އަރިމަތްޗާއެކު
        [and] އަދި { $border } އަރިމަތްޗާއެކު
        [and-article] އަދި { $border } އަރިމަތްޗާއެކު
       *[with] { $border } އަރިމަތްޗާއެކު
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } އިން { $color } ފުރުން
       *[plain] { $color } ފުރުން
    }
style-unfilled = ނުފުރޭ
# «-ގައި» is the locative and has one shape too.
style-text =
    { $parts ->
        [background] { $background } ބެކްގްރައުންޑުގައި { $color }
       *[plain] { $color }
    }
style-background-none = އެއްވެސް އެއްޗެއް ނެތް

## Boolean words

boolean-true = ތެދު
boolean-false = ދޮގު

## Answer buttons

answer-submit-label = ބައްލަވާ
answer-submit-label-no-correctness = ޖަވާބު ފޮނުވާ

## Sectional blocks

section-name =
    .activity = ހަރަކާތް
    .aside = އަރިމަތީ ނޯޓު
    .cascade = ސިލްސިލާ
    .definition = މާނަ
    .example = މިސާލު
    .exercise = ފަރިތަކުރުން
    .exercises = ފަރިތަކުރުން
    .given-answer = ޖަވާބު
    .note = ނޯޓު
    .objectives = މަގުސަދު
    .paragraphs = ޕެރެގްރާފު
    .part = ބައި
    .problem = މައްސަލަ
    .problems = މައްސަލަ
    .proof = ސާބިތުކުރުން
    .question = ސުވާލު
    .section = ބައި
    .solution = ހައްލު
    .task = މަސައްކަތް
    .theorem = ނަޒަރިއްޔާ
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = އިޝާރާތް

## Tables and figures

table-name =
    { $parts ->
        [numbered] ތާވަލު { $enumeration }
        [numbered-title] ތާވަލު { $enumeration }{ ": " }
        [unnumbered-title] ތާވަލު{ ": " }
       *[unnumbered] ތާވަލު
    }
figure-name =
    { $parts ->
        [numbered] ތަސްވީރު { $enumeration }
        [numbered-caption] ތަސްވީރު { $enumeration }{ ": " }
        [unnumbered-caption] ތަސްވީރު{ ": " }
       *[unnumbered] ތަސްވީރު
    }

## Paginator controls

paginator-previous = ކުރީގެ
paginator-next = ދެން
paginator-page = ސަފުހާ
# «X ން Y» — "Y out of X" — puts the total first, so the two counts change
# places.
paginator-page-status = { $numPages } ން { $pageLabel } { $currentPage }

## Piecewise functions

piecewise-condition-or = ނުވަތަ
# Clause-final in Dhivehi and placed before the mathematics by the renderer;
# see the header. The word is right and its position is not.
piecewise-condition-if = ނަމަ
piecewise-condition-otherwise = އެހެންނޫންނަމަ

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Dhivehi is the Maldives' national language and the medium of the primary
## grades; secondary science is taught in English throughout the country, so
## the periodic table reaches a Dhivehi-speaking student in English and the
## fallback *is* the curriculum. Beside that, there is no settled Dhivehi list
## of all 118 to seed from. Both halves are true here, which puts `dv` where
## `locales/to` and `locales/fj` already are — an English-medium school system
## and no table waiting behind it.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = ސައްހަނޫން ކެމިކަލް ނިޝާން
chemistry-invalid-ionic-compound = ސައްހަނޫން އަޔޮނިކް މުރައްކަބު
