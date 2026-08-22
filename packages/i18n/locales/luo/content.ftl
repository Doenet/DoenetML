# Luo content catalog: the prose the core computes into the document. Selected
# by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `luo` is Dholuo, spoken in western Kenya and northern Tanzania. The roster
# reads "Luo (Dholuo)" — CLDR knows both names, and they are one language.
#
# **This is the roster's first Nilotic language, and it selects on neither
# argument.** Dholuo has no grammatical gender and no noun classes, so the
# whole apparatus the sixteen Bantu catalogs need — `noun-gender` answering a
# class, every adjective forking on it — is absent here, and `noun-gender`
# answers one token that nothing reads. That is worth saying because Dholuo
# sits geographically between `locales/sw`, which forks on five classes, and
# `locales/ki`, which forks on three: a shared region says as little about
# agreement as a shared script does.
#
# **What it does have is a relative particle, and the particle welds onto a
# placeable.** An attributive adjective follows its noun behind «ma-», written
# as part of the following word: «laini marateng'», a black line. So
# `style-stroke` writes `ma{ $color }` and puts the prefix on a value this
# catalog never sees. That is sound for the same reason `locales/tlh`'s
# suffixes are: «ma-» has one shape and never assimilates to what follows it.
# The prefix is only ever written on a colour, and the two limits on it are
# honest rather than hidden. A vowel-initial adjective would want a
# hyphen in careful orthography, and a word that already opens with its own
# relative marker would come out doubled — so every entry in `color` is both
# consonant-initial and unmarked, and a new one has to be checked against both.
# The places it is written are `$color` in `style-stroke`, `style-filled`,
# `style-filled-with-noun`, `style-fill` and `style-text`, and `$background`
# beside it in the last of those, which `describeColor` fills from the same
# `color` table.
# `line-width` and `line-style` are the reason the prefix is not written more
# widely: their words carry the marker themselves («mabor», «mokethore»), so
# `style-stroke` places them bare.
#
# **The velar nasal is written `ng'` with a plain ASCII apostrophe throughout**,
# never with U+2019 and never as bare `ng`. The two apostrophes render nearly
# identically and compare unequal, so a mixed file is one a search cannot find
# its own words in. That is `locales/yi`'s digraph rule applied to a different
# letter.
#
# Numbers and the geometry nouns are the first thing to check. Kenya teaches
# mathematics in English from the intermediate grades, so most of the nouns
# below are adapted loans; «duol», «tol» and «kido» are Dholuo words, and a
# speaker with the mother-tongue materials in front of them should replace the
# rest.


## Style vocabulary

color =
    .black = rateng'
    .white = rachar
    .red = rakwar
    .gray = buru
    .orange = chungwa
    .yellow = ratong'
    .green = ratong'ng'ich
    .cyan = sayan
    .blue = buluu
    .purple = rambulu
    .pink = pinki
    .brown = rabuor
line-width =
    .thick = mabor
    .thin = manyilili
line-style =
    .dashed = mokethore
    .dotted = man-gi tonde
fill-style =
    .horizontal = laini monindo
    .vertical = laini mochung'
    .diagonal = laini mopadore
    .backdiagonal = laini mopadore komachielo
    .dots = tonde
    .diamonds = almaz
noun =
    .line = laini
    .line-segment = bath laini
    .ray = ray
    .vector = vekta
    .curve = laini modolore
    .function = tich
    .parabola = parabola
    .polyline = laini man-gi bethe
    .polygon = kido man-gi bethe mang'eny
    .triangle = kido mabethe adek
    .rectangle = kido mabethe ang'wen
    .circle = duol
    .region = gweng'
    .point = tong'
    .square = mraba
    .diamond = almaz
    .cross = msalaba
    .plus = ranyisi mar medo
# The side count is a relative clause and closes the noun phrase behind the
# adjectives rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] man-gi bethe { $numSides }
       *[head] kido mopogore maromre
    }
# Nothing selects on it: Dholuo has no gender and no noun classes.
noun-gender = neuter

## Style composition

# «ma-» is the relative particle and is written onto the front of `$color`,
# which arrives as a placeable. It has one shape whatever follows it, which is
# what makes that sound; see this file's header. `$width` and `$lineStyle`
# are placed bare, because `line-width` and `line-style` write their words with
# a relative marker of their own already on them.
style-stroke =
    { $parts ->
        [width-style-color] { $width } { $lineStyle } ma{ $color }
        [width-color] { $width } ma{ $color }
        [style-color] { $lineStyle } ma{ $color }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] ma{ $color }
    }
# The noun leads and its adjectives follow, with the noun's own relative
# complement closing the phrase.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = mopong'
style-filled =
    { $parts ->
        [pattern] { $filled } ma{ $color } gi { $pattern }
       *[plain] { $filled } ma{ $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } ma{ $color } gi { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } ma{ $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } ma{ $color } gi { $pattern }
       *[plain] { $noun } { $filled } ma{ $color }
    }
# Dholuo has no article, so the two `-article` branches read like their
# neighbours; «gi» joins the clause and does not change shape.
style-border-clause =
    { $parts ->
        [with-article] gi giko { $border }
        [and] gi giko { $border }
        [and-article] gi giko { $border }
       *[with] gi giko { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } ma{ $color }
       *[plain] ma{ $color }
    }
style-unfilled = ok opong'
style-text =
    { $parts ->
        [background] ma{ $color } e ng'e ma{ $background }
       *[plain] ma{ $color }
    }
style-background-none = onge

## Boolean words

boolean-true = adiera
boolean-false = miriambo

## Answer buttons

answer-submit-label = Non Tich
answer-submit-label-no-correctness = Or Duoko

## Sectional blocks

section-name =
    .activity = Tich
    .aside = Wach machielo
    .cascade = Chenro
    .definition = Tiend wach
    .example = Ranyisi
    .exercise = Tiegruok
    .exercises = Tiegruok
    .given-answer = Duoko
    .note = Ndiko
    .objectives = Chenro mag tich
    .paragraphs = Paragraf
    .part = Bath
    .problem = Chandruok
    .problems = Chandruok
    .proof = Rangeyo
    .question = Penjo
    .section = Bath
    .solution = Yoo mar loso
    .task = Tich
    .theorem = Thiorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Ranyisi

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tebulo { $enumeration }
        [numbered-title] Tebulo { $enumeration }{ ": " }
        [unnumbered-title] Tebulo{ ": " }
       *[unnumbered] Tebulo
    }
figure-name =
    { $parts ->
        [numbered] Picha { $enumeration }
        [numbered-caption] Picha { $enumeration }{ ": " }
        [unnumbered-caption] Picha{ ": " }
       *[unnumbered] Picha
    }

## Paginator controls

paginator-previous = Mokalo
paginator-next = Maluwo
paginator-page = Ich
paginator-page-status = { $pageLabel } { $currentPage } kuom { $numPages }

## Piecewise functions

piecewise-condition-or = kata
piecewise-condition-if = ka
piecewise-condition-otherwise = ka ok kamano

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case, and the same school system `locales/ki` records:
## Kenya teaches secondary science in English, so a Dholuo speaker meets the
## periodic table there and the fallback *is* the curriculum.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Ranyisi mar Kemikal ma Ok Kare
chemistry-invalid-ionic-compound = Riwruok mar Ayon ma Ok Kare
