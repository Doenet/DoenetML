# Bhojpuri content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Devanagari, which is what CLDR fills a bare `bho` in as and what
# Bhojpuri publishing uses. Kaithi is the language's own historical script and
# is no longer in general use; a reader arriving under `bho-Kthi` reaches this
# catalog and gets Devanagari.
#
# Bhojpuri selects on neither `$gender` nor `$role`. Its colour and width words
# — उजर, हरियर, पियर, लाल, नील, मोट, पातर — do not inflect, and an adjective
# before a postposition is the same word as one standing alone. The two that
# would test that are करिया and खैरा: both are -आ-final, and खैरा has a
# feminine खैरी. This seed writes them invariant, which is the first thing to
# put to a speaker. It is the same
# answer `locales/mai` gives, arrived at independently: these are two languages
# rather than one, and `locales/bho` writes के where `locales/mai` writes क,
# भा where it writes वा, and बा where it writes अछि.
#
# **`Intl.PluralRules` has Bhojpuri data and reports `one` and `other`**, and
# it puts 0 in `one` rather than in `other` as the English rule does — so the
# category is the language's rather than a fallback. Three of the twelve in
# this batch get the fallback instead — `mai`, `sa` and `mni`, for which
# `Intl.PluralRules` resolves to `en-US`. The wording of a counted message is
# still chosen to read correctly under either branch, because Bhojpuri leaves a
# noun unmarked after a numeral.
#
# Numbers render in Latin digits (#1615). Grouping comes from CLDR per
# locale, and CLDR gives Bhojpuri the Western thousands — `1,234,567`, not
# India's `12,34,567`, which `hi`, `sa`, `kok` and `brx` get.


## Style vocabulary

color =
    .black = करिया
    .white = उजर
    .gray = भूर
    .red = लाल
    .orange = नारंगी
    .yellow = पियर
    .green = हरियर
    .cyan = सायन
    .blue = नील
    .purple = बैंगनी
    .pink = गुलाबी
    .brown = खैरा
line-width =
    .thick = मोट
    .thin = पातर
line-style =
    .dashed = टूटल
    .dotted = बिंदुदार
fill-style =
    .horizontal = आड़ी रेखा
    .vertical = खड़ी रेखा
    .diagonal = तिरछी रेखा
    .backdiagonal = उलटी तिरछी रेखा
    .dots = बिंदु
    .diamonds = समचतुर्भुज
noun =
    .line = रेखा
    .line-segment = रेखाखंड
    .ray = किरण
    .vector = सदिश
    .curve = वक्र
    .function = फलन
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
    .cross = गुना के चिन्ह
    .plus = जोड़ के चिन्ह
# «-भुजा वाला» takes the count and stands in front of the noun, so nothing
# follows the adjectives and the tail is empty.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-भुजा वाला समबहुभुज
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
style-filled-word = भरल
# «से» is a postposition and follows what it governs, so the pattern moves to
# the front of the phrase where English appends it.
style-filled =
    { $parts ->
        [pattern] { $pattern } से { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } से { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } से { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# Bhojpuri has no article, so the two `-article` branches read like their
# neighbours.
style-border-clause =
    { $parts ->
        [with-article] { $border } किनारी सहित
        [and] आ { $border } किनारी सहित
        [and-article] आ { $border } किनारी सहित
       *[with] { $border } किनारी सहित
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } से { $color } भराई
       *[plain] { $color } भराई
    }
style-unfilled = बिना भरल
style-text =
    { $parts ->
        [background] { $background } पृष्ठभूमि पर { $color }
       *[plain] { $color }
    }
style-background-none = कुछ ना

## Boolean words

boolean-true = सही
boolean-false = गलत

## Answer buttons

answer-submit-label = जाँचीं
answer-submit-label-no-correctness = जवाब भेजीं

## Sectional blocks

section-name =
    .activity = गतिविधि
    .aside = बगल के टीप
    .cascade = शृंखला
    .definition = परिभाषा
    .example = उदाहरण
    .exercise = अभ्यास
    .exercises = अभ्यास
    .given-answer = जवाब
    .note = टीप
    .objectives = उद्देश्य
    .paragraphs = अनुच्छेद
    .part = भाग
    .problem = सवाल
    .problems = सवाल
    .proof = उपपत्ति
    .question = प्रश्न
    .section = खंड
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

paginator-previous = पहिले वाला
paginator-next = अगिला
paginator-page = पन्ना
# «X में से Y» — "Y out of X" — puts the total first, so the two counts change
# places.
paginator-page-status = { $numPages } में से { $pageLabel } { $currentPage }

## Piecewise functions

piecewise-condition-or = भा
piecewise-condition-if = अगर
piecewise-condition-otherwise = ना त

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Bhojpuri is a mother tongue across eastern Uttar Pradesh, western Bihar and
## Nepal's Terai, and it is not the medium of secondary schooling anywhere:
## chemistry is taught in Hindi or English on the Indian side and in Nepali or
## English on the Nepali side. So a Bhojpuri-speaking student meets the
## periodic table in one of those, and `locales/hi` and `locales/ne` carry
## those names. That is the school-system case, and Bhojpuri's is the plainest
## instance of it in this batch: nothing about the language is in question.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = अमान्य रासायनिक चिन्ह
chemistry-invalid-ionic-compound = अमान्य आयनिक यौगिक
