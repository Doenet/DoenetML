# Sinhala content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Sinhala has no grammatical gender in the sense these messages ask about — its
# one nominal division is animate against inanimate, and every noun described
# here is inanimate — and its adjectives do not inflect at all. So `$gender` and
# `$role` go unused exactly as they do in English.
#
# `$role` earns no branch for a second reason worth recording, because it is
# not the one English has: Sinhala *does* mark case, but it marks it with a
# suffix on the noun or with a postposition after it — «රතු පසුබිමක් මත», on a
# red background — and neither ever touches the adjective in front. The words
# this catalog hands to a clause are adjectives, so a `border-clause` branch
# would be identical to its `standalone` one.
#
# Adjectives *precede* the noun, as in English, so the composition messages
# keep the English order throughout.
#
# The nouns are written in their bare form («රේඛාව», the line) rather than
# with the indefinite «-ක්» («රේඛාවක්», a line): the same word is read as a
# label on its own wherever `noun` is looked up directly, and a suffix that
# suits the phrase would misread there.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black = කළු
    .white = සුදු
    .gray = අළු
    .red = රතු
    .orange = තැඹිලි
    .yellow = කහ
    .green = කොළ
    .cyan = සයන්
    .blue = නිල්
    .purple = දම්
    .pink = රෝස
    .brown = දුඹුරු
line-width =
    .thick = ඝන
    .thin = තුනී
line-style =
    .dashed = ඉරි සහිත
    .dotted = තිත් සහිත
# Noun phrases: they follow «සමඟ» and modify nothing.
fill-style =
    .horizontal = තිරස් රේඛා
    .vertical = සිරස් රේඛා
    .diagonal = විකර්ණ රේඛා
    .backdiagonal = ප්‍රතිවිකර්ණ රේඛා
    .dots = තිත්
    .diamonds = දියමන්ති
noun =
    .line = රේඛාව
    .line-segment = රේඛා ඛණ්ඩය
    .ray = කිරණය
    .vector = දෛශිකය
    .curve = වක්‍රය
    .function = ශ්‍රිතය
    .parabola = පරාවලය
    .polyline = බහුරේඛාව
    .polygon = බහුඅස්‍රය
    .triangle = ත්‍රිකෝණය
    .rectangle = සෘජුකෝණාස්‍රය
    .circle = වෘත්තය
    .region = ප්‍රදේශය
    .point = ලක්ෂ්‍යය
    .square = චතුරස්‍රය
    .diamond = දියමන්තිය
    .cross = කුරුසය
    .plus = ධන ලකුණ
# The side count is a phrase in front of the noun, as the adjectives are, so it
# folds into the head and there is no tail: «පැති 5ක් සහිත සමකෝණික බහුඅස්‍රය».
# «පැති» is the word for sides and «-ක්» the indefinite the count takes.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] පැති { $numSides }ක් සහිත සමකෝණික බහුඅස්‍රය
    }
# Sinhala adjectives do not agree, so every noun answers the same and the
# answer goes unused — as in English.
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
# «පිරවූ», the participle "filled", stands in front of the colour the way every
# other adjective here does.
style-filled-word = පිරවූ
style-filled =
    { $parts ->
        [pattern] { $pattern } සමඟ { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } සමඟ { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } සමඟ { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# «සමඟ» is a postposition and follows what it governs, so the border phrase
# comes first and the word joining it last. Sinhala has no article, so the
# `-article` branches read like the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } මායිමක් සමඟ
        [and] සහ { $border } මායිමක්
        [and-article] සහ { $border } මායිමක්
       *[with] { $border } මායිමක් සමඟ
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = නොපිරවූ
# «මත», on, is a postposition and follows the background it governs.
style-text =
    { $parts ->
        [background] { $background } පසුබිමක් මත { $color }
       *[plain] { $color }
    }
style-background-none = කිසිවක් නැත

## Boolean words

boolean-true = සත්‍ය
boolean-false = අසත්‍ය

## Answer buttons

answer-submit-label = පිළිතුර පරීක්ෂා කරන්න
answer-submit-label-no-correctness = පිළිතුර යොමු කරන්න

## Sectional blocks

section-name =
    .activity = ක්‍රියාකාරකම
    .aside = පැති සටහන
    .cascade = අනුක්‍රමය
    .definition = නිර්වචනය
    .example = උදාහරණය
    .exercise = අභ්‍යාසය
    .exercises = අභ්‍යාස
    .given-answer = පිළිතුර
    .note = සටහන
    .objectives = අරමුණු
    .paragraphs = ඡේද
    .part = භාගය
    .problem = ගැටලුව
    .problems = ගැටලු
    .proof = සාධනය
    .question = ප්‍රශ්නය
    .section = කොටස
    .solution = විසඳුම
    .task = කාර්යය
    .theorem = ප්‍රමේයය
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = ඉඟිය

## Tables and figures

table-name =
    { $parts ->
        [numbered] වගුව { $enumeration }
        [numbered-title] වගුව { $enumeration }{ ": " }
        [unnumbered-title] වගුව{ ": " }
       *[unnumbered] වගුව
    }
figure-name =
    { $parts ->
        [numbered] රූපය { $enumeration }
        [numbered-caption] රූපය { $enumeration }{ ": " }
        [unnumbered-caption] රූපය{ ": " }
       *[unnumbered] රූපය
    }

## Paginator controls

paginator-previous = පෙර
paginator-next = මීළඟ
paginator-page = පිටුව
paginator-page-status = { $numPages } න් { $pageLabel } { $currentPage }

## Piecewise functions

piecewise-condition-or = හෝ
piecewise-condition-if = නම්
piecewise-condition-otherwise = එසේ නොමැති නම්

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Sri Lankan chemistry is taught in Sinhala medium and its textbooks do print
## Sinhala transcriptions of the element names. What is missing is a
## transcription convention this seed could reproduce rather than invent: an
## unreviewed guess written in a script the reader cannot check against the
## English beside it is worse than the English itself. This is the first thing
## a Sinhala speaker should fill in, and filling it in needs no permission.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = අවලංගු රසායනික සංකේතයකි
chemistry-invalid-ionic-compound = අවලංගු අයනික සංයෝගයකි
