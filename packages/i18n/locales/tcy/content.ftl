# Tulu (ತುಳು) content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in, not
# the language of the reader's chrome.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Kannada, not Tigalari**, for the three reasons `chrome.ftl`'s
# header sets out in full — what a Tulu reader actually reads, Tigalari's
# near-absent browser font coverage, and the fact that Tigalari orthography
# for modern Tulu is still being settled by the revival. A conversion is a
# conversion of all four files at once, and a real conversion rather than a
# transliteration.
#
# ## Word order
#
# **Modifiers precede the noun and postpositions follow it.** Tulu is
# Dravidian, verb-final and strictly left-branching, so `style-with-noun` and
# `style-filled-with-noun` keep English's order of `{ $description }` before
# `{ $noun }`, and `style-stroke` keeps English's internal sequence of width,
# dash pattern, colour. What moves is every one of English's prepositions:
# `with` becomes the postposition ಒಟ್ಟುಗು and `on`/`in` the locative -ಡ್, so
# `style-border-clause`, `style-filled` and `style-text` all put the value in
# front of the word English puts it behind. That reordering is the whole of
# the difference between this file and a word-for-word rendering.
#
# **`[noun-tail]` is unused.** `noun-regular-polygon` fills `head` with
# «{ $numSides } ಬರಿತ ಸಮ ಬಹುಭುಜ» and leaves `tail` empty, exactly as English
# does: the side count is a modifier and a Dravidian modifier goes in front,
# so there is nothing to place after the adjectives and no reason to split the
# noun. The `[noun-tail]` branches in the two composition messages are kept
# because a partly-translated locale falls back through them, not because
# anything here selects them.
#
# ## Gender, role and number
#
# **Neither `$gender` nor `$role` is selected on.** Tulu marks gender on
# *verbs and pronouns*, in a three-way system it shares with Kannada and
# Malayalam, and not on the adjectives in these phrases: an attributive word
# in front of a noun does not agree with it in anything. So `noun-gender`
# answers the single token `neuter` and every style word is written once. Nor
# does a Tulu modifier change shape for the position its phrase is going into:
# the case a clause position wants is a suffix on the *last word of the noun
# phrase*, which is a word this catalog writes rather than one it receives, so
# ದಪ್ಪ ಕೆಂಪು reads the same standing alone as it does before ಒಟ್ಟುಗು. That is
# `locales/eu`'s reason arriving from Dravidian. Both are claims about the
# language, not gaps in the seed.
#
# **Nothing selects on a count.** A Tulu noun is not marked for number after a
# numeral — «ರಡ್ಡ್ ಗೆರೆ», not a pluralized noun — and CLDR has no plural data
# for `tcy` in any case, so a `one` branch here would be text selected by
# Kannada's rules. There are no plural branches anywhere in this catalog.
#
# ## Vocabulary, and what this file does not know
#
# **The geometry words are Kannada, declared as such.** There is no
# Tulu-medium schooling, so ಗೆರೆ, ಬಿಂದು, ವಕ್ರರೇಖೆ, ಬಹುಭುಜ, ಸದಿಶ, ಪರವಲಯ and
# ಉತ್ಪನ್ನ are the words a Tulu reader has met — in Kannada — and coining Tulu
# equivalents would put unfamiliar words in front of a reader who already has
# familiar ones. This file is a **Tulu frame around a declared Kannada
# technical register**, which is the honest description of it.
#
# **The colours are where Tulu shows, and only partly.** ಬೊಲ್ದು (white),
# ಮಂಜಲ್ (yellow), ಪಚ್ಚೆ (green) and ಕಪ್ಪು (black) are Tulu; ಕೆಂಪು (red) and
# ನೀಲಿ (blue) are shared with Kannada; the remaining six are Kannada or
# English loans, and ಸಯಾನ್ is a transliteration. Six of twelve is a fact about
# the seed's knowledge rather than about the language: Tulu certainly has more
# of its own colour words than six, and supplying them is a bigger improvement
# to this file than anything else in it.
#
# **The grammar is where the rest of the Tulu is**: ಇಜ್ಜಿ for negation and
# absence, ಉಂಡು for presence, the negative verb in -ಜಿ, ಬೊಕ್ಕ for *and*,
# ಅತ್ತ್ಂಡ for *or*, ಒಟ್ಟುಗು for *with*, the locative -ಡ್ and the genitive -ದ.
# **ಬೊಕ್ಕ does double duty** — it is both *and* and *next/after* — so
# `slider-next` and `piecewise-condition-or` in the sibling files share a root
# on purpose rather than by mistake. A message where Kannada's ಮತ್ತು, ಅಥವಾ or
# ಇಲ್ಲ has crept back in is a defect.
#
# **`style-filled-word` and `style-unfilled` are the Tulu participle pair**
# ತುಂಬಿನ / ತುಂಬಂದಿನ, positive and negative of one verb, which is how Tulu
# builds an attributive out of a verb and is why they are not two unrelated
# words as English's *filled* and *unfilled* are.
#
# **The chemistry tables are absent.** `element-name` and `element-anion-name`
# are not translated here, and the reason is the school-system one: chemistry
# in coastal Karnataka is taught in Kannada and English, the periodic table a
# Tulu pupil meets is one of those two, and there is no Tulu nomenclature for
# 118 elements to reproduce. Coining one would invent names no reader has met
# and would hide the fact that the reader already has a language for them.
# **The neighbour does not supply them either**, which is worth saying because
# it would be the obvious place to look: `locales/kn` omits both tables too,
# and for a different reason — Kannada has *two* nomenclatures, the native
# coinages that reach a dozen elements and the transliterated international
# names, and a seed cannot choose between them. So a Tulu reader who wants
# the periodic table in Kannada does not get it from this roster at all; they
# get it from a textbook. The three messages that are *frames* rather than names —
# `ion-name-oxidation-state`, `chemistry-invalid-symbol` and
# `chemistry-invalid-ionic-compound` — are translated, on the standing ground
# that a frame is the catalog's business whether or not the names in it are.
#
# **Numbers render in Latin digits** under the locale's own grouping, which is
# the digit policy in the package README (#1615).


## Style vocabulary

# Tulu uses the bare colour word attributively — «ಕೆಂಪು ಗೆರೆ» — so these need
# no adjectival form of their own.
color =
    .black = ಕಪ್ಪು
    .white = ಬೊಲ್ದು
    .gray = ಬೂದು
    .red = ಕೆಂಪು
    .orange = ಕಿತ್ತಳೆ
    .yellow = ಮಂಜಲ್
    .green = ಪಚ್ಚೆ
    .cyan = ಸಯಾನ್
    .blue = ನೀಲಿ
    .purple = ನೇರಳೆ
    .pink = ಗುಲಾಬಿ
    .brown = ಕಂದು
line-width =
    .thick = ದಪ್ಪ
    .thin = ತೆಳ್ಳ
line-style =
    .dashed = ತುಂಡು ತುಂಡುದ
    .dotted = ಚುಕ್ಕಿದ
# Noun phrases rather than adjectives: they stand in front of the
# postposition ಒಟ್ಟುಗು that the composition messages supply, and modify
# nothing.
fill-style =
    .horizontal = ಅಡ್ಡ ಗೆರೆಲು
    .vertical = ನಿಲುವು ಗೆರೆಲು
    .diagonal = ಕರ್ಣ ಗೆರೆಲು
    .backdiagonal = ಎದುರು ಕರ್ಣ ಗೆರೆಲು
    .dots = ಚುಕ್ಕಿಲು
    .diamonds = ವಜ್ರಾಕೃತಿಲು
noun =
    .line = ಗೆರೆ
    .line-segment = ಗೆರೆತುಂಡು
    .ray = ಕಿರಣ
    .vector = ಸದಿಶ
    .curve = ವಕ್ರರೇಖೆ
    .function = ಉತ್ಪನ್ನ
    .slope-field = ಇಳಿಜಾರು ಕ್ಷೇತ್ರ
    .vector-field = ಸದಿಶ ಕ್ಷೇತ್ರ
    .parabola = ಪರವಲಯ
    .polyline = ಬಹುಗೆರೆ
    .polygon = ಬಹುಭುಜ
    .triangle = ಮೂಜಿಬರಿ
    .rectangle = ಆಯತ
    .circle = ವೃತ್ತ
    .region = ಪ್ರದೇಶ
    .point = ಬಿಂದು
    .square = ಚೌಕ
    .diamond = ವಜ್ರಾಕೃತಿ
    .cross = ಅಡ್ಡಗುರುತು
    .plus = ಕೂಡ್ಪುನ ಗುರುತು
# ಬರಿತ ("of sides") attaches the count to the noun that follows it, so the
# whole phrase is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } ಬರಿತ ಸಮ ಬಹುಭುಜ
    }
# Tulu marks gender on verbs and pronouns, not on the adjectives in these
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
style-filled-word = ತುಂಬಿನ
# ಒಟ್ಟುಗು is a postposition, so the pattern comes to the front of the clause
# English appends at the end.
style-filled =
    { $parts ->
        [pattern] { $pattern } ಒಟ್ಟುಗು { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } ಒಟ್ಟುಗು { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } ಒಟ್ಟುಗು { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# ಒಟ್ಟುಗು follows ಅಂಚಿ rather than preceding it as English's `with` does, and
# ಬೊಕ್ಕ opens the further clause. Tulu has no article, which leaves the two
# `-article` branches reading exactly like the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } ಅಂಚಿದ ಒಟ್ಟುಗು
        [and] ಬೊಕ್ಕ { $border } ಅಂಚಿದ ಒಟ್ಟುಗು
        [and-article] ಬೊಕ್ಕ { $border } ಅಂಚಿದ ಒಟ್ಟುಗು
       *[with] { $border } ಅಂಚಿದ ಒಟ್ಟುಗು
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
# The negative participle of the same verb `style-filled-word` writes, which
# is how Tulu forms this pair.
style-unfilled = ತುಂಬಂದಿನ
# The locative -ಡ್ marks ಹಿನ್ನೆಲೆ, so the background leads and the text colour
# follows it.
style-text =
    { $parts ->
        [background] { $background } ಹಿನ್ನೆಲೆಡ್ { $color }
       *[plain] { $color }
    }
style-background-none = ಒವ್ವೂ ಇಜ್ಜಿ


## Boolean words

# ಸತ್ಯ and ಸುಳ್ಳು are the Kannada-register pair, declared as a loan: the seed
# does not know a settled Tulu pair for a displayed boolean. The DoenetML
# values `true` and `false` an author writes are untouched by this.
boolean-true = ಸತ್ಯ
boolean-false = ಸುಳ್ಳು


## Answer buttons

answer-submit-label = ಕೆಲಸ ಪರಿಶೀಲನೆ ಮಲ್ಪುಲೆ
answer-submit-label-no-correctness = ಉತ್ತರ ಕಡಪುಡುಲೆ


## Sectional blocks

section-name =
    .activity = ಚಟುವಟಿಕೆ
    .aside = ಪಕ್ಕದ ಟಿಪ್ಪಣಿ
    .cascade = ಸರಣಿ
    .definition = ವ್ಯಾಖ್ಯೆ
    .example = ಉದಾಹರಣೆ
    .exercise = ಅಭ್ಯಾಸ
    .exercises = ಅಭ್ಯಾಸೊಲು
    .given-answer = ಉತ್ತರ
    .note = ಟಿಪ್ಪಣಿ
    .objectives = ಉದ್ದೇಶೊಲು
    .paragraphs = ಪ್ಯಾರಾಲು
    .part = ಭಾಗ
    .problem = ಸಮಸ್ಯೆ
    .problems = ಸಮಸ್ಯೆಲು
    .proof = ಸಾಧನೆ
    .question = ಪ್ರಶ್ನೆ
    .section = ವಿಭಾಗ
    .solution = ಪರಿಹಾರ
    .task = ಕೆಲಸ
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

paginator-previous = ದುಂಬುದ
paginator-next = ಬೊಕ್ಕದ
paginator-page = ಪುಟ
# «of» is not a word here: the total precedes and the locative -ಡ್ links it,
# which is how Tulu builds this phrase.
paginator-page-status = { $numPages }ಡ್ { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = ಅತ್ತ್ಂಡ
# Tulu's own conditional is a clause-final suffix -ಂಡ, and the renderer places
# this word *before* the mathematics it introduces, so the native construction
# cannot be reached from inside the catalog. ಒಂದುವೇಳೆ is the clause-initial
# Kannada-register conditional, which is grammatical here and lands correctly;
# it is a declared loan, and the limit is recorded here rather than hidden.
piecewise-condition-if = ಒಂದುವೇಳೆ
piecewise-condition-otherwise = ಇಜ್ಜಾಂಡ


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent; the header
## says why. Only the frames are here.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = ತಪ್ಪು ರಾಸಾಯನಿಕ ಚಿಹ್ನೆ
chemistry-invalid-ionic-compound = ತಪ್ಪು ಅಯಾನಿಕ ಸಂಯುಕ್ತ


## Inputs embedded in math

math-embedded-input-blank = ಖಾಲಿ
math-embedded-input-blank-ordinal = { $total }ಡ್ { $ordinal }ನೇ ಖಾಲಿ
