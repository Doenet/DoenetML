# Garhwali (गढ़वळि) content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Devanagari**, which is the only script Garhwali is written in.
#
# ## Method, and what this file can only say in Hindi
#
# गढ़वळि is spoken in the Garhwal division of Uttarakhand and schooled in Hindi: it has no settled
# register for mathematics, and the geometry words here — रेखा, रेखाखंड,
# किरण, सदिश, वक्र, फलन, परवलय, बहुभुज, त्रिभुज, आयत, वृत्त, समचतुर्भुज — are
# the Hindi terms a student meets in class, written as they stand. The same is
# true of सारणी, चित्र, पृष्ठभूमि, भराव and the whole of `section-name`. What
# is गढ़वळि here is the grammar written over that vocabulary:
# the genitive कु / की / का, the object marker तैं, the copula च
# (plural छन), the negative नि, मा for *in*, बटि for *from*, दगड़ि for
# *with*, अर for *and*, and जु for *if*
# — together with the adjective forms below. **A reviewer should start with
# the adjectives and the section words**: those are the places where a
# गढ़वळि word may exist and the seed has used the Hindi one.
#
# ## Word order
#
# **The adjectives precede the noun**, exactly as they do in English and in
# Hindi: «मोटु लाल रेखा» is *thick red line*. So
# `style-with-noun` and `style-filled-with-noun` keep English's order of
# `{ $description }` and `{ $noun }`, and `style-stroke` keeps English's
# internal order of width, dash pattern and colour, because that is this
# language's order too. What does move is everything governed by a
# postposition: a postposition follows its noun, so the border clause and the
# background clause come out reversed from English.
#
# **`[noun-tail]` is unused.** `noun-regular-polygon` puts the side count in
# front of the noun — «{ $numSides } भुजाओं वळु सम बहुभुज» — so the whole of it is
# one `head` and `tail` is empty, as in English and in Hindi. The
# `-tail` variants of `style-with-noun` and `style-filled-with-noun` are still
# written out, because they are what a partly-translated locale falls back to.
#
# ## Gender and role: the fork is deliberately not taken
#
# गढ़वळि **does** inflect a marked adjective for gender and for the
# direct/oblique distinction, the way Hindi does — the -ओ/-उ masculine here has
# a feminine in -ी and an oblique in -ा — so English's `$gender` and `$role`
# arguments are not idle in this language, and the shape Hindi's catalog uses
# would be the right shape here.
#
# **This seed does not fork on either, and writes the masculine singular
# direct form throughout.** That is a decision about what a seed can honestly
# claim, not a claim that the language has no agreement. Forking would require
# a trustworthy gender for every noun in `noun` in *this* language rather than
# in Hindi, plus an oblique paradigm the seed is sure of for each of the three
# clause positions; the seed has neither, and a confidently wrong agreement
# table is harder for a reviewer to repair than a uniformly unagreed one.
# **This is the single largest gap in the file.** A reviewer who supplies the
# genders can lift Hindi's `{ $role -> … { $gender -> … } }` shape verbatim.
#
# For the same reason `noun-gender` answers the bare token `neuter` that
# English answers: no adjective in this file selects on it, so a gender table
# here would be inert until the fork above is taken.
#
# ## Number
#
# **Nothing selects on a count.** CLDR has no plural data for `gbm`, so
# `lint:i18n` would reject a plural category outright — and nothing in this
# file counts in any case. Numbers render in Latin digits, never in Devanagari
# numerals, which is what DoenetML pins for every locale (`src/intl.ts`).
#
# ## Chemistry
#
# `element-name` and `element-anion-name` are **deliberately absent**, so
# those 130 keys fall back to English. Chemistry is taught here out of Hindi
# textbooks, so the element names a गढ़वळि student meets are the Hindi
# ones, and a table under this tag would be a claim about spelling rather than
# about the language. Hindi's own table is in `locales/hi/content.ftl` for
# anyone who wants to start from it.

## Style vocabulary

color =
    .black = कालु
    .white = सफ़ेद
    .gray = स्लेटी
    .red = लाल
    .orange = नारंगी
    .yellow = पीलु
    .green = हरु
    .cyan = फ़िरोज़ी
    .blue = नीलु
    .purple = बैंगनी
    .pink = गुलाबी
    .brown = भूरु

line-width =
    .thick = मोटु
    .thin = पातलु

line-style =
    .dashed = खंडित
    .dotted = बिंदुदार

# Oblique plural noun phrases, because their other use is in front of «वळु»
# in `style-filled` and `style-fill`. They are the Hindi forms: the seed has
# no गढ़वळि oblique plural for them that it trusts.
fill-style =
    .horizontal = क्षैतिज रेखाओं
    .vertical = ऊर्ध्वाधर रेखाओं
    .diagonal = विकर्ण रेखाओं
    .backdiagonal = विपरीत विकर्ण रेखाओं
    .dots = बिंदुओं
    .diamonds = समचतुर्भुजों

noun =
    .line = रेखा
    .line-segment = रेखाखंड
    .ray = किरण
    .vector = सदिश
    .curve = वक्र
    .function = फलन
    .slope-field = प्रवणता क्षेत्र
    .vector-field = सदिश क्षेत्र
    .parabola = परवलय
    .polyline = बहुरेखा
    .polygon = बहुभुज
    .triangle = त्रिभुज
    .rectangle = आयत
    .circle = वृत्त
    .region = क्षेत्र
    .point = बिंदु
    .square = वर्ग
    .diamond = समचतुर्भुज
    .cross = क्रॉस
    .plus = धन चिह्न

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } भुजाओं वळु सम बहुभुज
    }

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

style-filled-word = भर्युं

style-filled =
    { $parts ->
        [pattern] { $pattern } वळु { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } वळु { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } वळु { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# The postposition follows its noun, so the whole clause comes out after the
# adjective and English's preposition-first order is reversed. There is no
# article, so the `-article` branches read the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } किनारा दगड़ि
        [and] अर { $border } किनारा दगड़ि
        [and-article] अर { $border } किनारा दगड़ि
       *[with] { $border } किनारा दगड़ि
    }

# The fill-pattern words are oblique plurals, so this message supplies «भराव»
# for them to hang off rather than printing them bare.
style-fill =
    { $parts ->
        [pattern] { $pattern } वळु { $color } भराव
       *[plain] { $color } भराव
    }

style-unfilled = बिना भराव

style-text =
    { $parts ->
        [background] { $background } पृष्ठभूमि मा { $color }
       *[plain] { $color }
    }

style-background-none = कुछ नि


## Boolean words

boolean-true = सत्य
boolean-false = असत्य


## Answer buttons

answer-submit-label = जाँचा
answer-submit-label-no-correctness = उत्तर भेजा


## Sectional blocks

section-name =
    .activity = गतिविधि
    .aside = पार्श्व टिप्पणी
    .cascade = क्रमिका
    .definition = परिभाषा
    .example = उदाहरण
    .exercise = अभ्यास
    .exercises = अभ्यास
    .given-answer = उत्तर
    .note = टिप्पणी
    .objectives = उद्देश्य
    .paragraphs = अनुच्छेद
    .part = भाग
    .problem = प्रश्न
    .problems = प्रश्न
    .proof = प्रमाण
    .question = सवाल
    .section = अनुभाग
    .solution = हल
    .task = काम
    .theorem = प्रमेय

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = संकेत


## Tables and figures

table-name =
    { $parts ->
        [numbered] सारणी { $enumeration }
        [numbered-title] सारणी { $enumeration }{ ": " }
        [unnumbered-title] सारणी{ ": " }
       *[unnumbered] सारणी
    }

figure-name =
    { $parts ->
        [numbered] चित्र { $enumeration }
        [numbered-caption] चित्र { $enumeration }{ ": " }
        [unnumbered-caption] चित्र{ ": " }
       *[unnumbered] चित्र
    }


## Paginator controls

paginator-previous = पिछलु
paginator-next = अगलु
paginator-page = पृष्ठ

paginator-page-status = { $numPages } मा बटि { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = या

piecewise-condition-if = जु

piecewise-condition-otherwise = नितर


## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = अमान्य रासायनिक संकेत
chemistry-invalid-ionic-compound = अमान्य आयनिक यौगिक


## Inputs embedded in math

math-embedded-input-blank = रिक्त

math-embedded-input-blank-ordinal = { $total } मा बटि रिक्त { $ordinal }
