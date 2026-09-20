# Central Kurdish (Sorani) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Kurdo-Arabic alphabet, the fully vowelled Arabic-script
# orthography standardized in the Kurdistan Region of Iraq and the one CLDR
# gives `ckb`. `ckb` maximizes to `ckb-Arab-IQ` and is **right to left**. See
# the Direction section of the README for what that does and does not change:
# nothing about the file format, and the text is written in logical order with
# no direction marks placed by hand.
#
# Northern Kurdish (Kurmanji) is `locales/kmr`, left to right in Latin. `ckb`
# is a member of the `ku` macrolanguage but is deliberately kept out of the
# roster's fold onto Kurmanji, because a Sorani reader has this catalog to
# reach — and because it does, the Kurmanji catalog is named for the individual
# language, `kmr`, rather than for the macrolanguage. A document that writes
# `ku` still reaches it.
#
# **Sorani has no grammatical gender.** It lost the masculine/feminine
# distinction Kurmanji keeps, so `noun-gender` below answers with a single
# token, nothing forks on `$gender` or `$role`, and `locales/kmr` beside it
# writes a full gender table for the same macrolanguage. Two catalogs of one
# macrolanguage, one of which agrees and one of which does not.
#
# Two plural categories, `one` and `other`. A noun after a numeral stays
# singular, so no message here needs a count branch.
#
# Numbers are Latin digits everywhere, per the README's "Digits are Latin,
# separators are not". A Sorani reader would ordinarily expect ٠١٢٣ in print;
# none is written here and no message names a numbering system.
#
# **The ezafe is the shape of this file.** An attributive adjective follows
# its noun and is linked to it by the ezafe, written as a ـی suffix on the
# noun — «هێڵی سوور», a red line. Unlike Persian's, it is written in every
# environment rather than being an unspoken vowel a space can carry, so
# `style-with-noun` cannot simply reverse the two halves and leave the space
# to do the work. It cannot be welded onto `{ $noun }` either: a placeable is
# not a word. The way out is the one the Berber catalogs take — make the
# position uniform, then write the words already inflected for it. `$noun`
# lands in exactly one place, immediately before the adjectives that describe
# it, so every entry in the `noun` table below is written **with its ezafe
# already on it** and the composition messages add nothing. The known cost is
# an author's own `markerStyleWord`, which the catalog has never seen and
# which therefore arrives unlinked; that is a real gap and the first thing to
# check if a description reads wrong.
#
# The definiteness suffix ـەکە is the same constraint from the other side and
# is simply not used: no message here makes a placeable definite, so every
# description is indefinite or generic. Where English wants an indefinite
# article — `style-border-clause`'s `-article` branches — Kurdish *can* say
# it, because the head is «لێوار», a word this catalog writes, so ـێک goes on
# and the branches genuinely differ.


## Style vocabulary

# «شین» historically spans blue and green in Kurdish and «سەوز» is the
# narrower green; the pair below is the modern split, not the older one. There
# is no inherited word for cyan, so «فیرۆزەیی» — turquoise — is a coinage
# chosen the way Persian chose «فیروزه‌ای», and is the least settled word here.
color =
    .black = ڕەش
    .white = سپی
    .gray = خۆڵەمێشی
    .red = سوور
    .orange = پرتەقاڵی
    .yellow = زەرد
    .green = سەوز
    .cyan = فیرۆزەیی
    .blue = شین
    .purple = مۆر
    .pink = پەمەیی
    .brown = قاوەیی
line-width =
    .thick = ئەستوور
    .thin = باریک
line-style =
    .dashed = پچڕپچڕ
    .dotted = خاڵخاڵ
fill-style =
    .horizontal = هێڵی ئاسۆیی
    .vertical = هێڵی ستوونی
    .diagonal = هێڵی لار
    .backdiagonal = هێڵی لاری پێچەوانە
    .dots = خاڵ
    .diamonds = لۆزەنگ
# Every entry carries its ezafe, for the reason the header gives. None of them
# is rendered on its own — a noun reaches the reader only through
# `style-with-noun` or `style-filled-with-noun`, and in both it stands
# immediately in front of the adjectives it is linked to. The words were also
# chosen to end in a consonant or in ـە, so that the ezafe is a plain ـی
# everywhere: after a ـی-final noun standard Sorani doubles the letter
# («کورسیی»), which is written inconsistently in practice and is a wobble this
# table avoids rather than settles.
noun =
    .line = هێڵی
    .line-segment = پارچەهێڵی
    .ray = نیوەهێڵی
    .vector = ڤێکتۆری
    .curve = چەماوەی
    .function = فەنکشنی
    .slope-field = کێڵگەی لاری
    .vector-field = کێڵگەی ڤێکتۆری
    .parabola = پارابۆلی
    .polyline = فرەهێڵی
    .polygon = فرەلایەنەی
    .triangle = سێگۆشەی
    .rectangle = لاکێشەی
    .circle = بازنەی
    .region = ناوچەی
    .point = خاڵی
    .square = چوارگۆشەی
    .diamond = لۆزەنگی
    .cross = خاچی
    .plus = نیشانەی کۆی
# The side count follows the adjectives rather than sitting inside the noun,
# so that they stay against the word they describe: «فرەلایەنەی ڕێکی سوور و
# ئەستوور بە 5 لایەنەوە». The head carries its ezafe like the table above.
# Kurdish counts with a singular noun, so nothing here agrees with the count.
noun-regular-polygon =
    { $part ->
        [tail] بە { $numSides } لایەنەوە
       *[head] فرەلایەنەی ڕێکی
    }
# Sorani has no grammatical gender. The token is written out anyway rather
# than left to fall back, so that this catalog says so on purpose and no
# adjective above has to carry a branch nothing reads.
noun-gender = neuter

## Style composition

# The adjectives are chained with «و» rather than with further ezafes: the
# noun's own ezafe links the first of them, and «و» links the rest without
# needing to know what word precedes it. The order mirrors English, so the
# adjective English puts nearest the noun is the one Kurdish puts nearest it.
style-stroke =
    { $parts ->
        [width-style-color] { $color } و { $lineStyle } و { $width }
        [width-color] { $color } و { $width }
        [style-color] { $color } و { $lineStyle }
        [width-style] { $lineStyle } و { $width }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = پڕکراو
style-filled =
    { $parts ->
        [pattern] { $filled } و { $color } بە نەخشی { $pattern }
       *[plain] { $filled } و { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } و { $color } بە نەخشی { $pattern }
        [plain-tail] { $noun } { $filled } و { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } و { $color } { $nounTail } بە نەخشی { $pattern }
       *[plain] { $noun } { $filled } و { $color }
    }
# «لێوار» is written by this catalog, so the indefinite ـێک and the ezafe both
# have a word to sit on and the `-article` branches say something the plain
# ones do not.
style-border-clause =
    { $parts ->
        [with-article] بە لێوارێکی { $border }
        [and] و لێواری { $border }
        [and-article] و لێوارێکی { $border }
       *[with] بە لێواری { $border }
    }
# «بە ڕەنگی» — "in the color of" — rather than an adjective against the
# pattern: the ezafe linking the pattern to a color adjective would have to be
# written onto `{ $pattern }`, and nothing can be attached to a placeable.
style-fill =
    { $parts ->
        [pattern] { $pattern } بە ڕەنگی { $color }
       *[plain] { $color }
    }
# Written flat: `describeFill` calls this with no arguments, so there is no
# noun to agree with even in a language that agreed.
style-unfilled = پڕنەکراو
style-text =
    { $parts ->
        [background] { $color } لەسەر پاشبنەمای { $background }
       *[plain] { $color }
    }
style-background-none = هیچ

## Boolean words

boolean-true = ڕاست
boolean-false = ناڕاست

## Answer buttons

answer-submit-label = پشکنینی کار
answer-submit-label-no-correctness = ناردنی وەڵام

## Sectional blocks

# Sorani calls both a "part" and a "section" «بەش». They are kept apart here
# because the two blocks nest, and a heading that read the same word twice
# would be worse than the slightly narrower «پارچە» for `part`. That choice is
# this seed's, not the language's.
section-name =
    .activity = چالاکی
    .aside = لاوەکی
    .cascade = زنجیرە
    .definition = پێناسە
    .example = نموونە
    .exercise = ڕاهێنان
    .exercises = ڕاهێنانەکان
    .given-answer = وەڵام
    .note = تێبینی
    .objectives = ئامانجەکان
    .paragraphs = بڕگەکان
    .part = پارچە
    .problem = مەسەلە
    .problems = مەسەلەکان
    .proof = سەلماندن
    .question = پرسیار
    .section = بەش
    .solution = چارەسەر
    .task = ئەرک
    .theorem = تیۆرەم
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = ڕێنوێنی

## Tables and figures

table-name =
    { $parts ->
        [numbered] خشتەی { $enumeration }
        [numbered-title] خشتەی { $enumeration }{ ": " }
        [unnumbered-title] خشتە{ ": " }
       *[unnumbered] خشتە
    }
figure-name =
    { $parts ->
        [numbered] وێنەی { $enumeration }
        [numbered-caption] وێنەی { $enumeration }{ ": " }
        [unnumbered-caption] وێنە{ ": " }
       *[unnumbered] وێنە
    }

## Paginator controls

paginator-previous = پێشوو
paginator-next = دواتر
paginator-page = لاپەڕە
paginator-page-status = { $pageLabel } { $currentPage } لە { $numPages }

## Piecewise functions

piecewise-condition-or = یان
# Kurdish «ئەگەر» opens its clause, as English "if" does, so the renderer
# placing this before the mathematics lands correctly.
piecewise-condition-if = ئەگەر
piecewise-condition-otherwise = ئەگەرنا

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, and the
## reason is not the one the rest of this batch gives. Central Kurdish *is* the
## medium of secondary science teaching in the Kurdistan Region of Iraq, and
## its schools print the periodic table in Sorani, so the names exist and a
## student meets them in their own textbook. What this seed cannot supply is a
## settled convention rather than an invented one: the published lists differ
## in how far they transliterate and from which language, and an unreviewed
## guess written in a script the reader cannot check against the English beside
## it is worse than the English. So the 130 keys fall back to English and
## `lint:i18n` reports the gap. This is the first place a Sorani speaker should
## look, and the one where a correction is worth the most.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = هێمای کیمیایی نادروست
chemistry-invalid-ionic-compound = پێکهاتەی ئایۆنی نادروست
