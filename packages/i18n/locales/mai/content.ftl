# Maithili content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Devanagari, which is what CLDR fills a bare `mai` in as and what
# Maithili publishing and Bihar's schooling use. Tirhuta (`mai-Tirh`) is the
# language's own historical script and is still written; a reader arriving
# under that tag reaches this catalog and gets Devanagari, which is the same
# asymmetry `pa`, `sr`, `jv` and `su` already have, with the same answer — a
# second catalog beside this one rather than a rename of it.
#
# **Maithili selects on neither `$gender` nor `$role`, and it is written in the
# same letters as three catalogs that select on both.** The colour and width
# words this catalog uses — उज्जर, हरियर, पीयर, लाल, नील, मोट, पातर, and the
# -ी loans बैंगनी, गुलाबी and नारंगी — do not end in -आ and do not inflect, so
# an adjective before a postposition is the same word as one standing alone.
# The one to put to a speaker is कारी, which is -ी where Hindi's कारा is -आ. That is the point worth keeping: Hindi,
# Marathi and Nepali share this script and answer the question three different
# ways, so the script says nothing about the fork.
#
# Numbers render in Latin digits (#1615). Grouping comes from CLDR per
# locale, and CLDR gives Maithili the Western thousands — `1,234,567`, not
# India's `12,34,567`, which `hi`, `sa`, `kok` and `brx` get.


## Style vocabulary

color =
    .black = कारी
    .white = उज्जर
    .gray = धूसर
    .red = लाल
    .orange = नारंगी
    .yellow = पीयर
    .green = हरियर
    .cyan = सायन
    .blue = नील
    .purple = बैंगनी
    .pink = गुलाबी
    .brown = भूर
line-width =
    .thick = मोट
    .thin = पातर
line-style =
    .dashed = टूटल
    .dotted = बिंदुदार
fill-style =
    .horizontal = आड़ी रेखा
    .vertical = ठाढ़ रेखा
    .diagonal = तिरछी रेखा
    .backdiagonal = उनटल तिरछी रेखा
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
    .cross = गुणा चिन्ह
    .plus = जोड़ चिन्ह
# «-भुजा वला» takes the count and stands in front of the noun, so nothing
# follows the adjectives and the tail is empty. The ending has one shape
# whatever number lands before it.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-भुजा वला समबहुभुज
    }
# Nothing selects on it, because no word in this catalog agrees with anything.
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
# «सँ» is a postposition and follows what it governs, so the pattern moves to
# the front of the phrase where English appends it.
style-filled =
    { $parts ->
        [pattern] { $pattern } सँ { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } सँ { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } सँ { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# Maithili has no article, so the two `-article` branches read like their
# neighbours; «आ» is the conjunction and stands in front.
style-border-clause =
    { $parts ->
        [with-article] { $border } किनार सहित
        [and] आ { $border } किनार सहित
        [and-article] आ { $border } किनार सहित
       *[with] { $border } किनार सहित
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } सँ { $color } भरनी
       *[plain] { $color } भरनी
    }
style-unfilled = बिनु भरल
style-text =
    { $parts ->
        [background] { $background } पृष्ठभूमि पर { $color }
       *[plain] { $color }
    }
style-background-none = किछु नहि

## Boolean words

boolean-true = सत्य
boolean-false = असत्य

## Answer buttons

answer-submit-label = जाँचू
answer-submit-label-no-correctness = उत्तर पठाउ

## Sectional blocks

section-name =
    .activity = क्रियाकलाप
    .aside = बगली टीप
    .cascade = शृंखला
    .definition = परिभाषा
    .example = उदाहरण
    .exercise = अभ्यास
    .exercises = अभ्यास
    .given-answer = उत्तर
    .note = टीप
    .objectives = उद्देश्य
    .paragraphs = अनुच्छेद
    .part = भाग
    .problem = समस्या
    .problems = समस्या
    .proof = उपपत्ति
    .question = प्रश्न
    .section = खंड
    .solution = हल
    .task = काज
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

paginator-previous = पछिला
paginator-next = अगिला
paginator-page = पृष्ठ
# «X मे सँ Y» — "Y out of X" — puts the total first, so the two counts change
# places.
paginator-page-status = { $numPages } मे सँ { $pageLabel } { $currentPage }

## Piecewise functions

piecewise-condition-or = वा
piecewise-condition-if = जँ
piecewise-condition-otherwise = अन्यथा

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Maithili is a mother tongue of Bihar and Nepal's Madhesh, and it is taught
## as a subject; the chemistry is not taught in it. Bihar's secondary science
## is Hindi- or English-medium and Nepal's is Nepali- or English-medium, so a
## Maithili-speaking student meets the periodic table in one of those four
## languages. `locales/hi` and `locales/ne` carry the names those curricula
## use. This is the school-system case the two sub-Saharan batches already
## record, told for the first time with another Indian language as the medium.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = अमान्य रासायनिक चिन्ह
chemistry-invalid-ionic-compound = अमान्य आयनिक यौगिक
