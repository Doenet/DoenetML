# Tibetan content catalog: the prose the core computes into the document.
# Selected by `documentLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Tibetan script, which is the only script Tibetan is written in
# and what CLDR fills a bare `bo` in as. `bod` is the ISO 639-3 code and
# `Intl.getCanonicalLocales` folds it to `bo` on its own, so no entry in
# `LANGUAGE_ALIASES` is needed. Tibetan is left to right, so `direction.ts` is
# untouched.
#
# **`Intl.PluralRules("bo")` reports exactly one category, `other`.** Tibetan
# does not mark number on a noun after a numeral, and ICU records that, so no
# message in this catalog can select on a count and none tries to. The `[0]`
# branches that survive are matched by *number* rather than by category, which
# Fluent resolves before it consults the plural rules — so a wording for none
# is still reachable. That makes Tibetan the first catalog in the roster whose
# every counted message is a single branch by the language's own grammar rather
# than by a translator's choice.
#
# **Tibetan's case particles change shape according to the final letter of the
# syllable before them, and that is the affix rule in its sharpest form yet.**
# The agentive is གིས་, ཀྱིས་, གྱིས་ or ཡིས་ and the genitive གི་, ཀྱི་, གྱི་
# or ཡི་, chosen by what precedes — which, beside a placeable, this catalog
# cannot see. So it uses **only the particles that have one shape**: དང་ for
# accompaniment, ལ་ for location, ནང་ for containment. That is the fifth way
# out the README lists — prefer the free allomorph over the bound one — applied
# to a particle rather than to a prefix, and it is why nothing here welds a
# genitive onto a value.
#
# Tibetan adjectives **follow** the noun: ཐིག་དམར་པོ, a red line. So
# `style-with-noun` puts the description after the noun, which is the position
# `locales/mni` also takes and no Indo-Aryan catalog in this batch does.


## Style vocabulary

color =
    .black = ནག་པོ
    .white = དཀར་པོ
    .gray = སྐྱ་བོ
    .red = དམར་པོ
    .orange = ལི་ཝང
    .yellow = སེར་པོ
    .green = ལྗང་ཁུ
    .cyan = སྔོ་ལྗང
    .blue = སྔོན་པོ
    .purple = རྒྱ་སྨུག
    .pink = ཟིང་སྐྱ
    .brown = སྨུག་པོ

line-width =
    .thick = མཐུག་པོ
    .thin = སྲབ་མོ

line-style =
    .dashed = ཆད་ལྷུག
    .dotted = ཚེག་ཅན

fill-style =
    .horizontal = འཕྲེད་ཐིག
    .vertical = གཞུང་ཐིག
    .diagonal = ཟུར་ཐིག
    .backdiagonal = ལྡོག་ཟུར་ཐིག
    .dots = ཚེག
    .diamonds = ཕ་ལམ་དབྱིབས

noun =
    .line = ཐིག
    .line-segment = ཐིག་དུམ
    .ray = འོད་ཟེར
    .vector = ཕྱོགས་ཚད
    .curve = ཡོ་ཐིག
    .function = བྱེད་རྩིས
    .parabola = པ་ར་བོ་ལ
    .polyline = ཐིག་མང
    .polygon = ཟུར་མང
    .triangle = ཟུར་གསུམ
    .rectangle = གྲུ་བཞི་རིང་པོ
    .circle = ཟླུམ་སྐོར
    .region = ས་ཁོངས
    .point = ཚེག
    .square = གྲུ་བཞི
    .diamond = ཕ་ལམ་དབྱིབས
    .cross = བསྒྱུར་རྟགས
    .plus = སྣོན་རྟགས

# The count is a complement that follows the whole phrase, so the head carries
# the noun alone and the tail carries the count. Tibetan reaches `[noun-tail]`
# for the same reason `locales/mni` does — a count is a modifier and modifiers
# follow.
noun-regular-polygon =
    { $part ->
        [tail] ཟུར་ { $numSides } ཅན
       *[head] ཆ་སྙོམས་ཟུར་མང
    }

# Nothing selects on it: Tibetan has no grammatical gender.
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

# The adjectives follow the noun, so the two halves change places against
# English, and a noun with a complement puts it last.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = བཀང་བ

# «དང་» is invariant whatever precedes it, which is why the pattern can stand
# beside a placeable here; see the header.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern } དང་བཅས་པ
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } { $pattern } དང་བཅས་པ
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } { $pattern } དང་བཅས་པ
       *[plain] { $noun } { $filled } { $color }
    }

# «མཐའ་» is the border and stands in front of its own adjective, so «དང་བཅས་པ»
# closes the clause. Tibetan has no article, so the `-article` branches read
# like their neighbours.
style-border-clause =
    { $parts ->
        [with-article] མཐའ་ { $border } དང་བཅས་པ
        [and] དེ་བཞིན་མཐའ་ { $border } དང་བཅས་པ
        [and-article] དེ་བཞིན་མཐའ་ { $border } དང་བཅས་པ
       *[with] མཐའ་ { $border } དང་བཅས་པ
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = མ་བཀང་བ

# «ལ་» is invariant too, so the background can carry it beside a value.
style-text =
    { $parts ->
        [background] རྒྱབ་ལྗོངས་ { $background } ལ་ { $color }
       *[plain] { $color }
    }

style-background-none = གང་ཡང་མེད


## Boolean words

boolean-true = བདེན་པ
boolean-false = རྫུན་པ


## Answer buttons

answer-submit-label = ཞིབ་བཤེར
answer-submit-label-no-correctness = ལན་སྐུར


## Sectional blocks

section-name =
    .activity = བྱ་བ
    .aside = ཟུར་བརྗོད
    .cascade = རིམ་བབ
    .definition = ངེས་ཚིག
    .example = དཔེར་བརྗོད
    .exercise = སྦྱོང་ཚན
    .exercises = སྦྱོང་ཚན
    .given-answer = ལན
    .note = མཆན
    .objectives = དམིགས་ཡུལ
    .paragraphs = དུམ་མཚམས
    .part = ཆ་ཤས
    .problem = དྲི་གཞི
    .problems = དྲི་གཞི
    .proof = སྒྲུབ་བྱེད
    .question = དྲི་བ
    .section = ལེ་ཚན
    .solution = ལན་ཐབས
    .task = ལས་འགན
    .theorem = གཏན་ཚིག

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = བརྡ་སྟོན


## Tables and figures

table-name =
    { $parts ->
        [numbered] རེའུ་མིག { $enumeration }
        [numbered-title] རེའུ་མིག { $enumeration }{ ": " }
        [unnumbered-title] རེའུ་མིག{ ": " }
       *[unnumbered] རེའུ་མིག
    }

figure-name =
    { $parts ->
        [numbered] རི་མོ { $enumeration }
        [numbered-caption] རི་མོ { $enumeration }{ ": " }
        [unnumbered-caption] རི་མོ{ ": " }
       *[unnumbered] རི་མོ
    }


## Paginator controls

paginator-previous = སྔོན་མ
paginator-next = རྗེས་མ
paginator-page = ཤོག་ངོས

# «X ནང་གི Y» — "Y of X" — puts the total first, so the two counts change
# places. «ནང་» is invariant.
paginator-page-status = { $numPages } ནང་ { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = ཡང་ན

piecewise-condition-if = གལ་ཏེ

piecewise-condition-otherwise = དེ་མིན


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## **Tibetan is the Khmer case, and it is the only one in this batch.** Tibetan-
## medium secondary schooling exists — in the Tibet Autonomous Region, in
## Qinghai and in the exile school system — and it teaches chemistry out of
## textbooks that print the periodic table in Tibetan. So the names exist, and
## what is missing here is not the vocabulary but a convention this seed could
## reproduce rather than invent: the terminology committees, the TAR textbooks
## and the exile curriculum do not spell every element the same way, and an
## unreviewed guess written in a script the reader cannot check against the
## English beside it is worse than the English. This is the first place a
## Tibetan speaker should look, and the largest piece of real work left in the
## catalog.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = ནུས་རྫས་རྟགས་ནོར་བ
chemistry-invalid-ionic-compound = རླུང་རྡུལ་འདུས་རྫས་ནོར་བ
