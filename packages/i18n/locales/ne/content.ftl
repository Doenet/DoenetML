# Nepali content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Nepali shares Devanagari with Hindi and Marathi and shares neither of their
# agreement systems. Its -ो adjectives — रातो, निलो, बाक्लो — do have a
# feminine in -ी, but it is used of animate nouns; a shape, a line and a
# background all take the -ो form. And an attributive adjective does not go
# oblique before a postposition the way a Hindi or Marathi one does: किनारासहित
# leaves बाक्लो रातो standing exactly as it stands alone.
#
# So neither `$gender` nor `$role` is selected on here, and every style word is
# written once. What moves instead is the *word order*: -सहित and -मा follow
# their noun where English's `with` and `on` precede it.
#
# The element names are deliberately absent; see the note above `element-name`.
#
# CLDR counts Nepali in Devanagari digits, and DoenetML does not: every number
# renders in Latin digits under Nepali's own grouping (#1615).


## Style vocabulary

color =
    .black = कालो
    .white = सेतो
    .gray = फुस्रो
    .red = रातो
    .orange = सुन्तले
    .yellow = पहेँलो
    .green = हरियो
    .cyan = सायन
    .blue = निलो
    .purple = बैजनी
    .pink = गुलाबी
    .brown = खैरो
line-width =
    .thick = बाक्लो
    .thin = पातलो
line-style =
    .dashed = धर्के
    .dotted = थोप्ले
# Plural nouns rather than adjectives: «प्रयोग गरी» ("using") takes them bare.
fill-style =
    .horizontal = तेर्सा रेखा
    .vertical = ठाडा रेखा
    .diagonal = विकर्ण रेखा
    .backdiagonal = उल्टो विकर्ण रेखा
    .dots = थोप्ला
    .diamonds = समचतुर्भुज
noun =
    .line = रेखा
    .line-segment = रेखाखण्ड
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
    .point = बिन्दु
    .square = वर्ग
    .diamond = समचतुर्भुज
    .cross = क्रस
    .plus = जोड चिन्ह
# The side count attaches to the noun that follows, so the whole phrase is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } भुजा भएको नियमित बहुभुज
    }
# Nepali marks gender on an adjective only for an animate noun, and nothing
# described here is one, so every noun answers the same and the answer goes
# unused — as in English.
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
style-filled-word = भरिएको
# «प्रयोग गरी» ("using") is invariable and takes the pattern bare, so the
# clause English appends comes to the front here.
style-filled =
    { $parts ->
        [pattern] { $pattern } प्रयोग गरी { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } प्रयोग गरी { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } प्रयोग गरी { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# -सहित follows किनारा, where English's `with` precedes its noun. Nepali has no
# article, which leaves the `-article` branches reading like the others.
style-border-clause =
    { $parts ->
        [with-article] { $border } किनारासहित
        [and] र { $border } किनारासहित
        [and-article] र { $border } किनारासहित
       *[with] { $border } किनारासहित
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = नभरिएको
# The locative -मा marks पृष्ठभूमि, and the colour word in front of it is
# untouched by that.
style-text =
    { $parts ->
        [background] { $background } पृष्ठभूमिमा { $color }
       *[plain] { $color }
    }
style-background-none = कुनै पनि छैन

## Boolean words

boolean-true = सत्य
boolean-false = असत्य

## Answer buttons

answer-submit-label = जाँच्नुहोस्
answer-submit-label-no-correctness = उत्तर पठाउनुहोस्

## Sectional blocks

section-name =
    .activity = क्रियाकलाप
    .aside = छेउटिप्पणी
    .cascade = क्यास्केड
    .definition = परिभाषा
    .example = उदाहरण
    .exercise = अभ्यास
    .exercises = अभ्यास
    .given-answer = उत्तर
    .note = टिप्पणी
    .objectives = उद्देश्य
    .paragraphs = अनुच्छेद
    .part = भाग
    .problem = समस्या
    .problems = समस्या
    .proof = प्रमाण
    .question = प्रश्न
    .section = खण्ड
    .solution = समाधान
    .task = कार्य
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
        [numbered] तालिका { $enumeration }
        [numbered-title] तालिका { $enumeration }{ ": " }
        [unnumbered-title] तालिका{ ": " }
       *[unnumbered] तालिका
    }
figure-name =
    { $parts ->
        [numbered] चित्र { $enumeration }
        [numbered-caption] चित्र { $enumeration }{ ": " }
        [unnumbered-caption] चित्र{ ": " }
       *[unnumbered] चित्र
    }

## Paginator controls

paginator-previous = अघिल्लो
paginator-next = अर्को
paginator-page = पृष्ठ
# «X मध्ये Y» — "Y of X" — puts the total first, so the two counts change
# places.
paginator-page-status = { $numPages } मध्ये { $pageLabel } { $currentPage }

## Piecewise functions

piecewise-condition-or = वा
piecewise-condition-if = यदि
piecewise-condition-otherwise = अन्यथा

## Chemistry


# `element-name` and `element-anion-name` are deliberately omitted, and those
# 130 keys fall back to English.
#
# Nepali has no settled chemical nomenclature to seed from: secondary science
# in Nepal is taught largely from English element names, and the
# transliterations that circulate are not standardised. Inventing a set would
# be worse than the English fallback, which is what a student meets in a
# textbook anyway. `lint:i18n` reports the gap until a chemist who writes
# Nepali supplies them. This is the choice Somali, Hmong Njua, Amharic and
# Assamese already make, and for the same reason. Marathi and Hindi, whose
# script this shares, do have such a set and supply it.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = अमान्य रासायनिक चिन्ह
chemistry-invalid-ionic-compound = अमान्य आयनिक यौगिक
