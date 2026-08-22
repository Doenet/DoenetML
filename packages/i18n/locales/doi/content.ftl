# Dogri content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `doi` is an ISO 639-3 **macrolanguage** over Dogri proper (`dgo`) and Kangri
# (`xnr`), so it joins `MACROLANGUAGE_MEMBERS` for the same published reason
# `kok`, `qu` and `bik` did. This catalog is **Dogri proper in Devanagari**,
# the standard the Jammu and Kashmir Academy of Art, Culture and Languages
# publishes in and the one the Eighth Schedule names; a Kangri reader arriving
# under `xnr` reaches it. `Intl.getCanonicalLocales` already folds `dgo` to
# `doi` on its own, and it is listed anyway so the group reads as a whole.
#
# Dogri is also written in the Perso-Arabic script and in the Dogra Akkhar
# script of its own; a reader arriving under `doi-Arab` or `doi-Dogr` reaches
# this catalog and gets Devanagari.
#
# **Dogri selects on `$gender` and not on `$role`, and the reason is the trap
# the README names rather than a fact about the language.** Its adjectives in
# -आ do take an oblique — काला becomes काले — but that form is masculine only,
# and none of the three clause positions lands on a masculine oblique here: the
# border is «किनारी» and the background «पृष्ठभूमि», both feminine, and the
# text colour agrees with «पाठ» in the direct masculine. A `$role` branch would
# render exactly what the `$gender` branch underneath it already renders. It is
# `locales/gu`'s case: whether a language inflects is not the question, and
# what decides is which words the positions land on. A new entry in `noun` that
# put a masculine oblique in one of those positions would be the thing that
# changes the answer.
#
# Numbers render in Latin digits (#1615). Grouping comes from CLDR per
# locale, and CLDR gives Dogri the Western thousands — `1,234,567`, not
# India's `12,34,567`, which `hi`, `sa`, `kok` and `brx` get.


## Style vocabulary

# लाल, संतरी, सायन, जामनी, गुलाबी and स्लेटी do not end in -आ and never
# change, so they answer the same in every branch.
color =
    .black =
        { $gender ->
            [f] काली
           *[m] काला
        }
    .white =
        { $gender ->
            [f] चिट्टी
           *[m] चिट्टा
        }
    .gray = स्लेटी
    .red = लाल
    .orange = संतरी
    .yellow =
        { $gender ->
            [f] पीली
           *[m] पीला
        }
    .green =
        { $gender ->
            [f] हरी
           *[m] हरा
        }
    .cyan = सायन
    .blue =
        { $gender ->
            [f] नीली
           *[m] नीला
        }
    .purple = जामनी
    .pink = गुलाबी
    .brown =
        { $gender ->
            [f] भूरी
           *[m] भूरा
        }
line-width =
    .thick =
        { $gender ->
            [f] मोटी
           *[m] मोटा
        }
    .thin =
        { $gender ->
            [f] पतली
           *[m] पतला
        }
# Neither ends in -आ, so neither changes.
line-style =
    .dashed = टुकड़ेदार
    .dotted = बिंदुदार
# Plural nouns rather than adjectives, so they carry their own agreement and
# «कन्नै» takes them bare.
fill-style =
    .horizontal = आड़ियां लकीरां
    .vertical = खड़ियां लकीरां
    .diagonal = तिरछियां लकीरां
    .backdiagonal = उल्टियां तिरछियां लकीरां
    .dots = बिंदू
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
    .point = बिंदू
    .square = वर्ग
    .diamond = समचतुर्भुज
    .cross = गुणा दा निशान
    .plus = जोड़ दा निशान
# «भुजाएं आला» takes the count and stands in front of the noun, so nothing
# follows the adjectives and the tail is empty.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } भुजाएं आला समबहुभुज
    }
# Besides the nouns above, `$noun` may be «regular-polygon» (बहुभुज, m) or the
# head of a phrase the description does not name: «border» (किनारी, f), «fill»
# (भराई, f), «text» (पाठ, m), «background» (पृष्ठभूमि, f).
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [polyline] f
        [border] f
        [background] f
        [fill] f
       *[other] m
    }

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
style-filled-word =
    { $gender ->
        [f] भरेई
       *[m] भरेआ
    }
# «कन्नै» ("with") is a postposition and follows what it governs, so the
# pattern moves to the front of the phrase where English appends it.
style-filled =
    { $parts ->
        [pattern] { $pattern } कन्नै { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } कन्नै { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } कन्नै { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# Dogri has no article, so the two `-article` branches read like their
# neighbours; «ते» is the conjunction and stands in front.
style-border-clause =
    { $parts ->
        [with-article] { $border } किनारी कन्नै
        [and] ते { $border } किनारी कन्नै
        [and-article] ते { $border } किनारी कन्नै
       *[with] { $border } किनारी कन्नै
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } कन्नै { $color } भराई
       *[plain] { $color } भराई
    }
style-unfilled = बिन भरेआ
style-text =
    { $parts ->
        [background] { $background } पृष्ठभूमि पर { $color }
       *[plain] { $color }
    }
style-background-none = कुसै किस्म दा नेईं

## Boolean words

boolean-true = सच्च
boolean-false = झूठ

## Answer buttons

answer-submit-label = जाँचो
answer-submit-label-no-correctness = जवाब भेजो

## Sectional blocks

section-name =
    .activity = गतिविधि
    .aside = कनारे दी टिप्पणी
    .cascade = शृंखला
    .definition = परिभाशा
    .example = मसाल
    .exercise = अभ्यास
    .exercises = अभ्यास
    .given-answer = जवाब
    .note = टिप्पणी
    .objectives = मकसद
    .paragraphs = अनुच्छेद
    .part = हिस्सा
    .problem = सवाल
    .problems = सवाल
    .proof = सबूत
    .question = प्रश्न
    .section = खंड
    .solution = हल
    .task = कम्म
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
hint-title = इशारा

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

paginator-previous = पिछला
paginator-next = अगला
paginator-page = सफा
# «X चा Y» — "Y of X" — puts the total first, so the two counts change places.
paginator-page-status = { $numPages } चा { $pageLabel } { $currentPage }

## Piecewise functions

piecewise-condition-or = जां
piecewise-condition-if = जेकर
piecewise-condition-otherwise = नैं ते

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Dogri is taught as a subject across Jammu and is the medium of nothing above
## the primary grades: secondary science in Jammu and Kashmir is English-,
## Hindi- or Urdu-medium, so the periodic table reaches a Dogri-speaking
## student in one of those three. `locales/hi` and `locales/ur` carry two of
## them. That is the school-system case, and it is the same one `mai`, `bho`
## and `kok` record — four languages, four education systems, one sentence.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = गलत रसायनिक निशान
chemistry-invalid-ionic-compound = गलत आयनिक यौगिक
