# Shughni (Шугнонӣ, х̌уг̌нӯн зивод) content catalog: the prose the core computes
# into the document. Selected by `documentLocale` — the language the activity
# was written in, not the reader's UI language.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# ## Orthography
#
# Cyrillic, in the practice of Gorno-Badakhshan, Tajikistan: Tajik Cyrillic as
# the base, with the extra Pamiri letters (`х̌`, `ғ̌`, `ҙ`, `ҫ`, `ӡ`, `ҵ`, `ц`,
# `w`) where a Shughni word needs them — which, given how much of this seed is
# loanwords, is almost nowhere. A **Latin** practice and an **Arabic-script**
# practice are also in use, chiefly among Shughni speakers in Afghanistan.
# Either would be a legitimate choice for this locale; neither may be *mixed
# into* the Cyrillic. Converting means converting all four files at once.
#
# ## Word order and how modifiers attach — the one place this is not Tajik
#
# **The adjective precedes the noun**: `ғафс сурх хат`, in that order, the way
# English stacks them and the reverse of what Tajik does. This is the single
# structural decision in the file that is Shughni rather than borrowed, and it
# is why `style-with-noun` and `style-filled-with-noun` read
# `{ $description } { $noun }` and not the Tajik izafat frame that
# `locales/tg` uses. Stacked adjectives are simply juxtaposed; **nothing is
# welded onto a placeable anywhere in this file**, so no message depends on how
# the word substituted into it happens to end. The ezāfe-type linkage Shughni
# does have in Tajik-influenced phrasing is deliberately not used here, because
# this seed cannot say confidently when it is required and when it is not.
#
# ## Gender and number
#
# Shughni **does** distinguish gender — in the demonstratives, in some nouns,
# and through vowel alternation in parts of the verb. This seed does **not**
# fork on `$gender` anywhere, and `noun-gender` answers a single token for
# every noun. That is not a claim that Shughni has no gender; it is an
# admission that this seed cannot assign the right gender to `line`, `curve`,
# `region` and the rest, and would rather leave the agreement flat than get it
# wrong in eighty places. A speaker who wants agreement will need to fill in
# `noun-gender` per noun first and then fork the adjectives on it — the
# machinery is already wired for exactly that.
#
# `$role` is likewise not forked: with no case endings written and no izafat
# used, a describing word standing alone and the same word inside a border or
# background clause come out identical.
#
# **Number**: Shughni marks plural with `-ен`, but a noun after a numeral is
# left unmarked, as in Iranian languages generally. CLDR has no plural data and
# no display name for `sgh`, so `Intl.PluralRules` falls back to the default
# and only `one`/`other` are reachable at all. Every count in this locale is
# written with a single `*[other]` form (a `[one]` branch is kept where English
# has one, spelled identically, rather than silently collapsed). Explicit `[0]`
# branches are numeric literals and are kept.
#
# ## The chemistry element tables are deliberately absent
#
# `element-name` and `element-anion-name` are the only English keys this file
# does not define. Shughni has no settled, checkable list of the 118 elements:
# chemistry in Badakhshan is taught in **Tajik** and **Russian**, and the
# element names a Shughni-speaking pupil learns are the Tajik and Russian ones.
# Transliterating that list into Cyrillic Shughni would produce a nomenclature
# nobody uses and nobody could check, which is the one thing this batch is not
# allowed to do. Both keys fall back to English, which is honest about being
# untranslated. `ion-name-oxidation-state` and the two invalid-symbol messages
# are frames rather than vocabulary and are translated below.
#
# ## Loans kept, since a Shughni word could not be established
#
# **From Tajik** (the great majority of the running text, including nearly all
# of `section-name`, the style vocabulary and the colour words): `сиёҳ`,
# `сафед`, `хокистарранг`, `сурх`, `норинҷранг`, `зард`, `сабз`, `кабуд`,
# `бунафш`, `гулгун`, `қаҳваранг`, `ғафс`, `борик`, `нуқта`, `хат`, `доира`,
# `секунҷа`, `росткунҷа`, `минтақа`, `ҳошия`, `пуршуда`, `холӣ`, `Ҷадвал`,
# `Расм`, `Саҳифа`, `Мисол`, `Машқ`, `Масъала`, `Исбот`, `Савол`, `Боб`,
# `Ҳал`, `Теорема`, `дуруст`, `нодуруст`, and the frame words `бо` and `дар`.
#
# **From Russian** (through Tajik, in their Cyrillic spelling): `вектор`,
# `функсия`, `парабола`, `квадрат`, `ромб`, `диагоналӣ`, `плюс`, `Каскад`,
# `Активият`-type internationalisms, `ион`.
#
# **Shughni's own**, and about the only words in the file that are: the
# conjunction `ат` "and", `йо` "or", and `агар` "if" (itself an old Persian
# borrowing, but the ordinary Shughni word).


## Style vocabulary

color =
    .black = сиёҳ
    .white = сафед
    .gray = хокистарранг
    .red = сурх
    .orange = норинҷранг
    .yellow = зард
    .green = сабз
    .cyan = фирӯза
    .blue = кабуд
    .purple = бунафш
    .pink = гулгун
    .brown = қаҳваранг

line-width =
    .thick = ғафс
    .thin = борик

line-style =
    .dashed = хат-хат
    .dotted = нуқтадор

fill-style =
    .horizontal = уфуқӣ хатҳо
    .vertical = амудӣ хатҳо
    .diagonal = диагоналӣ хатҳо
    .backdiagonal = баръакс диагоналӣ хатҳо
    .dots = нуқтаҳо
    .diamonds = ромбҳо

noun =
    .line = хат
    .line-segment = порчаи хат
    .ray = нур
    .vector = вектор
    .curve = каҷхат
    .function = функсия
    .slope-field = майдони нишебӣ
    .vector-field = майдони векторӣ
    .parabola = парабола
    .polyline = шикаста хат
    .polygon = бисёркунҷа
    .triangle = секунҷа
    .rectangle = росткунҷа
    .circle = доира
    .region = минтақа
    .point = нуқта
    .square = квадрат
    .diamond = ромб
    .cross = чорхат
    .plus = плюс

# The side count stands in front of the noun with the other modifiers, so the
# head carries the whole phrase and the tail is empty, as in English.
# `$numSides` is a real number and is formatted by the locale's own rules.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-тарафа мунтазам бисёркунҷа
    }

# One token for every noun: this seed does not assign gender. See the header.
noun-gender = neuter


## Style composition
##
## Adjectives precede the noun and are simply juxtaposed, in the order English
## uses. No `$role` fork and no `$gender` fork; nothing is welded to a
## placeable.

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

style-filled-word = пуршуда

style-filled =
    { $parts ->
        [pattern] { $filled } { $color }, бо нақши { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun }, бо нақши { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail }, бо нақши { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# Shughni has no indefinite article, so the two `-article` branches read like
# the two without them. `ат` is the Shughni conjunction.
style-border-clause =
    { $parts ->
        [with-article] бо { $border } ҳошия
        [and] ат бо { $border } ҳошия
        [and-article] ат бо { $border } ҳошия
       *[with] бо { $border } ҳошия
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = холӣ

style-text =
    { $parts ->
        [background] { $color }, дар { $background } замина
       *[plain] { $color }
    }

style-background-none = нест


## Boolean words
##
## What the reader sees. `true` and `false` remain DoenetML syntax everywhere
## and are not what these words replace.

boolean-true = дуруст
boolean-false = нодуруст


## Answer buttons

answer-submit-label = Санҷидан
answer-submit-label-no-correctness = Ҷавобро фиристодан


## Sectional blocks

section-name =
    .activity = Фаъолият
    .aside = Эзоҳи канорӣ
    .cascade = Каскад
    .definition = Таъриф
    .example = Мисол
    .exercise = Машқ
    .exercises = Машқҳо
    .given-answer = Ҷавоб
    .note = Эзоҳ
    .objectives = Ҳадафҳо
    .paragraphs = Сархатҳо
    .part = Қисм
    .problem = Масъала
    .problems = Масъалаҳо
    .proof = Исбот
    .question = Савол
    .section = Боб
    .solution = Ҳал
    .task = Супориш
    .theorem = Теорема

# `$sectionNumber` arrives as text: it is a counter-built identifier, not a
# quantity. A period separates the heading from the title, which is the usual
# punctuation in Cyrillic-script practice here.
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Маслиҳат


## Tables and figures
##
## The name and the number are one message. `$enumeration` is text, not a
## number: it identifies the table.

table-name =
    { $parts ->
        [numbered] Ҷадвали { $enumeration }
        [numbered-title] Ҷадвали { $enumeration }{ ". " }
        [unnumbered-title] Ҷадвал{ ". " }
       *[unnumbered] Ҷадвал
    }

figure-name =
    { $parts ->
        [numbered] Расми { $enumeration }
        [numbered-caption] Расми { $enumeration }{ ". " }
        [unnumbered-caption] Расм{ ". " }
       *[unnumbered] Расм
    }


## Paginator controls

paginator-previous = Қаблӣ
paginator-next = Навбатӣ
paginator-page = Саҳифа

# `$pageLabel` may be an author's own word; the counts arrive as text.
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions
##
## `йо` and `агар` are the ordinary Shughni words; `вагарна` is the Tajik one,
## kept because no Shughni single-word equivalent could be established.

piecewise-condition-or = йо
piecewise-condition-if = агар
piecewise-condition-otherwise = вагарна


## Chemistry
##
## `element-name` and `element-anion-name` are absent on purpose — see the
## header. What is here is frames, not nomenclature.

# The Roman numeral is IUPAC notation and is the same in every language.
ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Нодуруст химиявӣ аломат
chemistry-invalid-ionic-compound = Нодуруст ионӣ пайвастагӣ


## Inputs embedded in math

math-embedded-input-blank = ҷои холӣ
math-embedded-input-blank-ordinal = ҷои холӣ { $ordinal } аз { $total }
