# Awadhi (अवधी) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Devanagari**, as in every file of this catalog. Digits are Latin
# and a number is grouped by the locale's own rules (`1,000`), which is what
# DoenetML pins for every locale in `src/intl.ts`.
#
# ## Word order
#
# **The description comes first and the noun last**, as in English and as in
# Hindi: «मोट खंडित लाल रेखा» is *thick dashed red line*. So `style-with-noun`
# and `style-filled-with-noun` keep English's order of placeables, and
# `style-stroke` keeps English's internal order of width, dash pattern and
# colour, because that is Awadhi's order too.
#
# **`[noun-tail]` is unused.** `noun-regular-polygon` fills `head` with
# «{ $numSides } भुजा वाला सम बहुभुज» and leaves `tail` empty, as English
# does: the side count goes in front of the noun here, so nothing has to be
# split around the adjectives.
#
# ## Gender, role and number
#
# **Neither `$gender` nor `$role` forks, and that is half a claim about the
# language and half a gap.** The claim: Awadhi's own colour and width words
# are the invariant **-अ** shapes — «करिया», «उजर», «पियर», «हरियर», «मोट»,
# «पातर» — which agree with nothing, so where `locales/hi` forks काला /
# काली / काले this file writes «करिया» once. That is the clearest way this
# catalog is not Hindi in a hat, and `noun-gender` answers the single token
# `neuter` because nothing downstream needs to select on it.
#
# The gap: four words in this file **are** marked in Awadhi and are written
# here in their direct-masculine form regardless — the two colour loans
# «नीला» and «भूरा», the participle «भरा» in `style-filled-word`, and «वाला»
# in `style-filled`. «बिंदुन वाला रेखा» should be «बिंदुन वाली रेखा», and
# «नीला रेखा» should be «नीली रेखा». A reviewer who wants that fixed has to
# reintroduce the `$gender` fork on those four spots and a `$role` fork for
# the oblique «नीले» / «भरे» / «वाले» that `style-border-clause` wants, and give
# `noun-gender` a real table — रेखा, किरण and बहुरेखा are feminine, and so is
# पृष्ठभूमि. This is the largest single defect in the file.
#
# **Nothing selects on a count.** CLDR has no plural data for `awa`, and an
# Awadhi noun is unmarked after a numeral anyway.
#
# ## Vocabulary, and what this file does not know
#
# **The geometry and chemistry register is Hindi and Sanskrit, declared as
# such**: «रेखा», «रेखाखंड», «किरण», «सदिश», «वक्र», «फलन», «परवलय»,
# «बहुभुज», «त्रिभुज», «आयत», «वृत्त», «समचतुर्भुज». Awadhi-medium schooling
# does not exist, so these are the words an Awadhi student has actually met,
# and inventing Awadhi coinages would put words in front of a reader nobody
# uses. What is Awadhi here is everything around them: «जवाब», «सवाल»,
# «जदि», «नाहीं त», «क» for the genitive, «अउर», «खातिर», and the oblique
# plural in **-न** («रेखन», «बिंदुन»), which is the shape the fill patterns
# take because their other use is in front of «वाला».
#
# **The two chemistry tables are absent.** `element-name` and
# `element-anion-name` — 130 messages between them — are not translated in
# this batch, so this catalog sits at 445/575 keys with every other file in
# it. The element names an Awadhi reader would use are the Hindi ones, and a
# seed that copied them over would be claiming a review it has not had; the
# renderer already falls back to English for a missing key.


## Style vocabulary

color =
    .black = करिया
    .white = उजर
    .gray = सलेटी
    .red = लाल
    .orange = नारंगी
    .yellow = पियर
    .green = हरियर
    .cyan = फिरोजी
    .blue = नीला
    .purple = बैंगनी
    .pink = गुलाबी
    .brown = भूरा
# Both are invariant in Awadhi, so neither takes a fork.
line-width =
    .thick = मोट
    .thin = पातर
line-style =
    .dashed = खंडित
    .dotted = बिंदुदार
# Oblique plurals in -न, because their other use is in front of «वाला», a
# postpositional word that governs the oblique. They agree with nothing, so
# `style-fill` gives them a noun to hang off rather than printing them bare.
fill-style =
    .horizontal = आड़ी रेखन
    .vertical = खड़ी रेखन
    .diagonal = विकर्ण रेखन
    .backdiagonal = उलटी विकर्ण रेखन
    .dots = बिंदुन
    .diamonds = समचतुर्भुजन
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
    .plus = जोड़ चिह्न
# The side count goes in front of the noun, so the whole phrase is one head
# and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } भुजा वाला सम बहुभुज
    }
# A single token: nothing in this file selects on gender, so there is no
# table to fill in. Awadhi does have gender — रेखा, किरण, बहुरेखा and
# पृष्ठभूमि are feminine, किनारा, भराव and पाठ masculine — and a reviewer who
# reinstates agreement has to write that table here first.
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
# Adjectives precede the noun, as in English.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
# Said only of the shape itself, so it is standalone everywhere. «भरा» is a
# marked adjective in Awadhi and ought to agree with the shape; the seed
# writes the masculine throughout. See the header.
style-filled-word = भरा
# «वाला» belongs to the shape rather than to the pattern in front of it, and
# in Awadhi it agrees with the shape — «बिंदुन वाली रेखा», «बिंदुन वाला
# वर्ग». The seed writes «वाला» unagreed; see the header.
style-filled =
    { $parts ->
        [pattern] { $pattern } वाला { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } वाला { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } वाला { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «क संग» is postpositional, so «किनारा» stands in the oblique «किनारे». The
# adjective in front of it should go oblique too, and does not: that is the
# `$role` gap the header names. Awadhi has no article, so the `-article`
# branches read the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } किनारे क संग
        [and] अउर { $border } किनारे क संग
        [and-article] अउर { $border } किनारे क संग
       *[with] { $border } किनारे क संग
    }
# The fill-pattern words are oblique plurals, so this message supplies a noun
# for them to hang off — «भराव» — rather than printing them bare.
style-fill =
    { $parts ->
        [pattern] { $pattern } वाला { $color } भराव
       *[plain] { $color } भराव
    }
style-unfilled = बिना भराव
style-text =
    { $parts ->
        [background] { $background } पृष्ठभूमि पर { $color }
       *[plain] { $color }
    }
style-background-none = कउनो नाहीं


## Boolean words

boolean-true = सत्य
boolean-false = असत्य


## Answer buttons

answer-submit-label = जाँचौ
answer-submit-label-no-correctness = जवाब पठावौ


## Sectional blocks

section-name =
    .activity = गतिविधि
    .aside = बगल क बात
    .cascade = क्रमिका
    .definition = परिभाषा
    .example = उदाहरण
    .exercise = अभ्यास
    .exercises = अभ्यास
    .given-answer = जवाब
    .note = टिप्पणी
    .objectives = उद्देस
    .paragraphs = अनुच्छेद
    .part = भाग
    .problem = सवाल
    .problems = सवाल
    .proof = प्रमाण
    .question = परसन
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

paginator-previous = पहिले
paginator-next = आगे
paginator-page = पन्ना
paginator-page-status = { $numPages } मा से { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = या
piecewise-condition-if = जदि
piecewise-condition-otherwise = नाहीं त


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent; see the
## header. What is left is the prose around them.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = अमान्य रासायनिक संकेत
chemistry-invalid-ionic-compound = अमान्य आयनिक यौगिक


## Inputs embedded in math

math-embedded-input-blank = खाली जगह
math-embedded-input-blank-ordinal = { $total } मा से { $ordinal } खाली जगह
