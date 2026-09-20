# Kannada content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Kannada has no adjective agreement, so `$gender` and `$role` go unused here
# exactly as they do in English. Adjectives precede their noun, as in English,
# so the composition messages keep the English order.
#
# What moves is the adposition. Kannada postposes: "with a thick red border"
# is «ದಪ್ಪ ಕೆಂಪು ಅಂಚಿನೊಂದಿಗೆ», the marker suffixed to the noun rather than a
# word in front of it. Where the noun it attaches to is a fixed word the suffix
# is written onto it; where it is an argument, the free postposition «ಜೊತೆಗೆ»
# is used instead, since the sandhi at that join depends on a word this
# catalog never sees. The two `-article` branches read like the ones without —
# Kannada has no article.
#
# Numbers render in Latin digits rather than in Kannada numerals, which is the
# digit policy in the package README (#1615).
#
# The element names are deliberately absent; see the note above the chemistry
# section.


## Style vocabulary

# Kannada uses the bare colour word attributively — «ಕೆಂಪು ಗೆರೆ» — so these
# need no adjectival form of their own.
color =
    .black = ಕಪ್ಪು
    .white = ಬಿಳಿ
    .gray = ಬೂದು
    .red = ಕೆಂಪು
    .orange = ಕಿತ್ತಳೆ
    .yellow = ಹಳದಿ
    .green = ಹಸಿರು
    .cyan = ನೀಲಿಹಸಿರು
    .blue = ನೀಲಿ
    .purple = ನೇರಳೆ
    .pink = ಗುಲಾಬಿ
    .brown = ಕಂದು
line-width =
    .thick = ದಪ್ಪ
    .thin = ತೆಳು
line-style =
    .dashed = ತುಂಡು ಗೆರೆಯ
    .dotted = ಚುಕ್ಕಿಯ
# Noun phrases: they stand in front of the «ಜೊತೆಗೆ» the composition messages
# supply, and modify nothing.
fill-style =
    .horizontal = ಅಡ್ಡ ಗೆರೆಗಳು
    .vertical = ಲಂಬ ಗೆರೆಗಳು
    .diagonal = ಕರ್ಣ ಗೆರೆಗಳು
    .backdiagonal = ವಿರುದ್ಧ ಕರ್ಣ ಗೆರೆಗಳು
    .dots = ಚುಕ್ಕಿಗಳು
    .diamonds = ವಜ್ರಾಕೃತಿಗಳು
noun =
    .line = ಸರಳರೇಖೆ
    .line-segment = ರೇಖಾಖಂಡ
    .ray = ಕಿರಣ
    .vector = ಸದಿಶ
    .curve = ವಕ್ರರೇಖೆ
    .function = ಉತ್ಪನ್ನ
    .parabola = ಪರವಲಯ
    .polyline = ಬಹುರೇಖೆ
    .polygon = ಬಹುಭುಜಾಕೃತಿ
    .triangle = ತ್ರಿಭುಜ
    .rectangle = ಆಯತ
    .circle = ವೃತ್ತ
    .region = ಪ್ರದೇಶ
    .point = ಬಿಂದು
    .square = ಚೌಕ
    .diamond = ವಜ್ರಾಕೃತಿ
    .cross = ಅಡ್ಡಗುರುತು
    .plus = ಕೂಡಿಸು ಗುರುತು
# The side count precedes the noun, as every modifier in Kannada does, so it
# folds into the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } ಬಾಹುಗಳ ಸಮ ಬಹುಭುಜಾಕೃತಿ
    }
# Kannada marks gender on verbs and pronouns, not on the adjectives in these
# phrases, so every noun answers the same and the answer goes unused — as in
# English.
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
style-filled-word = ತುಂಬಿದ
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern } ಜೊತೆಗೆ
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern } ಜೊತೆಗೆ
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern } ಜೊತೆಗೆ
       *[plain] { $filled } { $color } { $noun }
    }
# «ಅಂಚು» is a fixed word, so the comitative is written onto it directly, and
# «ಮತ್ತು» opens the further clause where English opens it with "and". Kannada
# has no article, so the two `-article` branches read like the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } ಅಂಚಿನೊಂದಿಗೆ
        [and] ಮತ್ತು { $border } ಅಂಚಿನೊಂದಿಗೆ
        [and-article] ಮತ್ತು { $border } ಅಂಚಿನೊಂದಿಗೆ
       *[with] { $border } ಅಂಚಿನೊಂದಿಗೆ
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = ತುಂಬದ
# «ಹಿನ್ನೆಲೆ» takes the locative -ಯಲ್ಲಿ, so the background leads and the text
# colour follows it.
style-text =
    { $parts ->
        [background] { $background } ಹಿನ್ನೆಲೆಯಲ್ಲಿ { $color }
       *[plain] { $color }
    }
style-background-none = ಯಾವುದೂ ಇಲ್ಲ

## Boolean words

boolean-true = ನಿಜ
boolean-false = ಸುಳ್ಳು

## Answer buttons

answer-submit-label = ಪರಿಶೀಲಿಸು
answer-submit-label-no-correctness = ಉತ್ತರ ಸಲ್ಲಿಸು

## Sectional blocks

section-name =
    .activity = ಚಟುವಟಿಕೆ
    .aside = ಪಕ್ಕಟಿಪ್ಪಣಿ
    .cascade = ಸರಣಿ
    .definition = ವ್ಯಾಖ್ಯೆ
    .example = ಉದಾಹರಣೆ
    .exercise = ಅಭ್ಯಾಸ
    .exercises = ಅಭ್ಯಾಸಗಳು
    .given-answer = ಉತ್ತರ
    .note = ಟಿಪ್ಪಣಿ
    .objectives = ಉದ್ದೇಶಗಳು
    .paragraphs = ಪ್ಯಾರಾಗಳು
    .part = ಭಾಗ
    .problem = ಸಮಸ್ಯೆ
    .problems = ಸಮಸ್ಯೆಗಳು
    .proof = ಸಾಧನೆ
    .question = ಪ್ರಶ್ನೆ
    .section = ವಿಭಾಗ
    .solution = ಪರಿಹಾರ
    .task = ಕಾರ್ಯ
    .theorem = ಪ್ರಮೇಯ
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = ಸುಳಿವು

## Tables and figures

table-name =
    { $parts ->
        [numbered] ಕೋಷ್ಟಕ { $enumeration }
        [numbered-title] ಕೋಷ್ಟಕ { $enumeration }{ ": " }
        [unnumbered-title] ಕೋಷ್ಟಕ{ ": " }
       *[unnumbered] ಕೋಷ್ಟಕ
    }
figure-name =
    { $parts ->
        [numbered] ಚಿತ್ರ { $enumeration }
        [numbered-caption] ಚಿತ್ರ { $enumeration }{ ": " }
        [unnumbered-caption] ಚಿತ್ರ{ ": " }
       *[unnumbered] ಚಿತ್ರ
    }

## Paginator controls

paginator-previous = ಹಿಂದಿನದು
paginator-next = ಮುಂದಿನದು
paginator-page = ಪುಟ
# The total leads, marked with the locative -ರಲ್ಲಿ, which is how Kannada says
# "3 of 5".
paginator-page-status = { $numPages } ರಲ್ಲಿ { $pageLabel } { $currentPage }

## Piecewise functions

piecewise-condition-or = ಅಥವಾ
piecewise-condition-if = ಒಂದು ವೇಳೆ
piecewise-condition-otherwise = ಇಲ್ಲದಿದ್ದರೆ

## Chemistry


# `element-name` and `element-anion-name` are deliberately omitted, and the 130
# keys fall back to English.
#
# Not for want of a nomenclature but because Kannada has two that a textbook
# may draw on in the same chapter: the native coinages — ಜಲಜನಕ, ಆಮ್ಲಜನಕ,
# ಸಾರಜನಕ, ಇಂಗಾಲ — which reach only the dozen elements a school chemistry
# course names in Kannada, and the transliterated international names, which
# reach all 118. Seeding the coinages would leave a hundred names to invent in
# a register they have never been written in; seeding the transliterations
# would teach past the words a Kannada-medium student actually reads. Neither
# is a translation, so the English fallback stands until a chemist who writes
# Kannada settles it, and `lint:i18n` reports the gap in the meantime.
#
# This is a decision per language and not per script: Telugu, written in
# letters this close to these, supplies the names its textbooks use.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = ಅಮಾನ್ಯ ರಾಸಾಯನಿಕ ಸಂಕೇತ
chemistry-invalid-ionic-compound = ಅಮಾನ್ಯ ಅಯಾನಿಕ ಸಂಯುಕ್ತ
