# Dzongkha content catalog: the prose the core computes into the document.
# Selected by `documentLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Tibetan script, which is Dzongkha's only script and what CLDR
# fills a bare `dz` in as. `dzo` is the ISO 639-3 code and
# `Intl.getCanonicalLocales` folds it to `dz` on its own, so no alias is
# needed. Left to right, so `direction.ts` is untouched.
#
# **Dzongkha is a separate directory from `bo` rather than a variety of it**,
# and it is the `hr`-against-`sr` case a fifth time: two standard languages
# with two vocabularies and two orthographic habits sharing one script.
# `locales/dz` writes ཧོནམ where `locales/bo` writes སྔོན་པོ, སྦོམ where it
# writes མཐུག་པོ, and ལུ་ where it writes ལ་. The Dzongkha adjectival suffix
# -མ / -པ stands where Tibetan writes -པོ / -མོ in ཧོནམ, རིངམ, བཀངམ and ཕྲམ,
# but it is a tendency rather than a rule: five colour terms here keep -པོ.
# Copying either catalog over the other would be wrong in both.
#
# Like Tibetan, `Intl.PluralRules("dz")` reports exactly one category, so no
# counted message selects and the `[0]` branches that survive are matched by
# number rather than by category. And like Tibetan, the phrases this file
# composes use only the case particles that have **one shape** — དང་, ལུ་,
# ནང་ — because the agentive and genitive change form according to the final
# letter of the syllable before them, which beside a placeable the catalog
# cannot see. See `locales/bo/content.ftl` for the full statement of that
# rule, and for where the other three files cannot keep it.
#
# Adjectives follow the noun, so `style-with-noun` puts the description after
# it.


## Style vocabulary

color =
    .black = གནགཔོ
    .white = དཀརཔོ
    .gray = ཐལཝ
    .red = དམརཔོ
    .orange = ལི་ཝང
    .yellow = སེརཔོ
    .green = ལྗང་ཁུ
    .cyan = སྔོ་ལྗང
    .blue = ཧོནམ
    .purple = རྒྱ་སྨུག
    .pink = ཟིང་སྐྱ
    .brown = སྨུག་པོ

line-width =
    .thick = སྦོམ
    .thin = ཕྲམ

line-style =
    .dashed = ཆད་ལྷུག
    .dotted = ཚེག་ཅན

fill-style =
    .horizontal = འཕྲང་ཐིག
    .vertical = ཐད་ཐིག
    .diagonal = ཟུར་ཐིག
    .backdiagonal = ལོག་ཟུར་ཐིག
    .dots = ཚེག
    .diamonds = ཕ་ལམ་གཟུགས

noun =
    .line = གྲལ་ཐིག
    .line-segment = ཐིག་དུམ
    .ray = འོད་ཟེར
    .vector = ཕྱོགས་ཚད
    .curve = གུག་ཐིག
    .function = བྱེད་ལས
    .parabola = པ་ར་བོ་ལ
    .polyline = ཐིག་མང
    .polygon = ཟུར་མང
    .triangle = ཟུར་གསུམ
    .rectangle = གྲུ་བཞི་རིངམ
    .circle = སྒོར་ཐིག
    .region = ས་ཁོངས
    .point = ཚག
    .square = གྲུ་བཞི
    .diamond = ཕ་ལམ་གཟུགས
    .cross = བསྒྱུར་རྟགས
    .plus = ཁ་སྐོང་རྟགས

# The count is a complement that follows the whole phrase, so the head carries
# the noun alone and the tail carries the count.
noun-regular-polygon =
    { $part ->
        [tail] ཟུར་ { $numSides } ཡོདཔ
       *[head] ཚད་མཉམ་ཟུར་མང
    }

# Nothing selects on it: Dzongkha has no grammatical gender.
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
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = བཀངམ

# «དང་» is invariant whatever precedes it.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern } དང་བཅསཔ
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } { $pattern } དང་བཅསཔ
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } { $pattern } དང་བཅསཔ
       *[plain] { $noun } { $filled } { $color }
    }

# Dzongkha has no article, so the `-article` branches read like their
# neighbours.
style-border-clause =
    { $parts ->
        [with-article] མཐའ་ { $border } དང་བཅསཔ
        [and] ད་རུང་མཐའ་ { $border } དང་བཅསཔ
        [and-article] ད་རུང་མཐའ་ { $border } དང་བཅསཔ
       *[with] མཐའ་ { $border } དང་བཅསཔ
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = མ་བཀངམ

# «ལུ་», the Dzongkha dative, is invariant too.
style-text =
    { $parts ->
        [background] རྒྱབ་གཞི་ { $background } ལུ་ { $color }
       *[plain] { $color }
    }

style-background-none = ག་ནི་ཡང་མེད


## Boolean words

boolean-true = བདེན་པ
boolean-false = རྫུན་པ


## Answer buttons

answer-submit-label = ཞིབ་དཔྱད
answer-submit-label-no-correctness = ལན་བཏང


## Sectional blocks

section-name =
    .activity = ལས་སྣ
    .aside = ཟུར་བཤད
    .cascade = རིམ་བབ
    .definition = ངོས་འཛིན
    .example = དཔེ
    .exercise = སྦྱོང་ལཱ
    .exercises = སྦྱོང་ལཱ
    .given-answer = ལན
    .note = དྲན་གསོ
    .objectives = དམིགས་དོན
    .paragraphs = དོན་མཚམས
    .part = ཡན་ལག
    .problem = དཀའ་ངལ
    .problems = དཀའ་ངལ
    .proof = སྒྲུབ་བྱེད
    .question = དྲི་བ
    .section = དབྱེ་ཚན
    .solution = ཐབས་ལམ
    .task = ལཱ
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

hint-title = བརྡ་མཚོན


## Tables and figures

table-name =
    { $parts ->
        [numbered] ཐིག་ཁྲམ { $enumeration }
        [numbered-title] ཐིག་ཁྲམ { $enumeration }{ ": " }
        [unnumbered-title] ཐིག་ཁྲམ{ ": " }
       *[unnumbered] ཐིག་ཁྲམ
    }

figure-name =
    { $parts ->
        [numbered] པར་རིས { $enumeration }
        [numbered-caption] པར་རིས { $enumeration }{ ": " }
        [unnumbered-caption] པར་རིས{ ": " }
       *[unnumbered] པར་རིས
    }


## Paginator controls

paginator-previous = ཧེ་མམ
paginator-next = ཤུལ་མམ
paginator-page = ཤོག་ལེབ

# «X ནང་ Y» — "Y of X" — puts the total first; «ནང་» is invariant.
paginator-page-status = { $numPages } ནང་ { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = ཡང་ན

piecewise-condition-if = པ་ཅིན

piecewise-condition-otherwise = དེ་མིན


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## **Dzongkha is not the Tibetan case, and the two catalogs part company here.**
## Bhutan teaches every subject but Dzongkha itself in English from the first
## grade, so secondary chemistry is English-medium and the periodic table
## reaches a Dzongkha-speaking student in English. The fallback *is* the
## curriculum, which is the plain school-system case the sub-Saharan and
## Indo-Aryan batches record — while `locales/bo` beside it is partial for the
## opposite reason, having the names and no single convention to reproduce.
## Two catalogs in one script, two different reasons for the same gap.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = ནུས་རྫས་ཀྱི་བརྡ་རྟགས་ནོར་བ
chemistry-invalid-ionic-compound = རླུང་རྡུལ་འདུས་རྫས་ནོར་བ
