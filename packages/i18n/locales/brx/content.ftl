# Bodo content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Devanagari, which is Bodo's official script since 1975 and what
# CLDR fills a bare `brx` in as. Bodo was written in Latin and in Assamese
# letters before that; `brx-Latn` and `brx-Beng` reach this catalog and get
# Devanagari.
#
# **Bodo is the first Tibeto-Burman language in the roster, and it selects on
# neither argument.** It has no grammatical gender and no adjective agreement
# of any kind, and its adjectives stand in front of the noun and never change.
# So this catalog needs no `$gender` fork and no `$role` fork, and it needs
# them for a different reason from `mai` and `bho` beside it: those two happen
# to use words that do not inflect, and Bodo has nothing that could.
#
# **Two vocabulary decisions are worth checking before anything else here.**
# The five colour words Bodo forms with its own adjectival गो-/गु- prefix —
# गोसो, गुफुर, गोजा, गोमो, गोथां — are the language's; the other seven are
# loans Bodo prose already uses, written in Bodo orthography. And the mathematical
# nouns are the Assamese- and Sanskrit-derived terms Bodo-medium textbooks in
# Assam carry, because that is where Bodo's geometry vocabulary comes from
# rather than from anywhere older. Which of either group a speaker would
# replace is the first question to put to this file.
#
# Numbers render in Latin digits under Indian grouping (#1615).


## Style vocabulary

color =
    .black = गोसो
    .white = गुफुर
    .gray = स्लेटि
    .red = गोजा
    .orange = नारांगि
    .yellow = गोमो
    .green = गोथां
    .cyan = साइयान
    .blue = निला
    .purple = बेगुनि
    .pink = गुलापि
    .brown = खैरा
# Bodo names a stroke's width with its ordinary words for large and small.
line-width =
    .thick = गिदिर
    .thin = फिसा
line-style =
    .dashed = बोखावनाय
    .dotted = बिन्दुजों
fill-style =
    .horizontal = आथिं सारि
    .vertical = गोजौ सारि
    .diagonal = खारसा सारि
    .backdiagonal = उल्था खारसा सारि
    .dots = बिन्दु
    .diamonds = समचतुर्भुज
noun =
    .line = सारि
    .line-segment = सारि खण्ड
    .ray = किरण
    .vector = सदिश
    .curve = बांखां सारि
    .function = फलन
    .parabola = परवलय
    .polyline = गोबां सारि
    .polygon = बहुभुज
    .triangle = त्रिभुज
    .rectangle = आयत
    .circle = बृत्त
    .region = मुगा
    .point = बिन्दु
    .square = वर्ग
    .diamond = समचतुर्भुज
    .cross = गुणन सिन
    .plus = जोड़ सिन
# «-भुजनि» takes the count and stands in front of the noun, so nothing follows
# the adjectives and the tail is empty. The ending has one shape whatever
# number lands before it.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-भुजनि समबहुभुज
    }
# Nothing selects on it: Bodo has no grammatical gender.
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
style-filled-word = आबुं
# «-जों» is the instrumental postposition and follows what it governs, so the
# pattern moves to the front of the phrase where English appends it. It has one
# shape whatever precedes it, so welding it onto a placeable is sound.
style-filled =
    { $parts ->
        [pattern] { $pattern }जों { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern }जों { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern }जों { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# Bodo has no article, so the two `-article` branches read like their
# neighbours; «आरो» is the conjunction and stands in front.
style-border-clause =
    { $parts ->
        [with-article] { $border } किनारजों
        [and] आरो { $border } किनारजों
        [and-article] आरो { $border } किनारजों
       *[with] { $border } किनारजों
    }
style-fill =
    { $parts ->
        [pattern] { $pattern }जों { $color } आबुंनाय
       *[plain] { $color } आबुंनाय
    }
style-unfilled = आबुंआ
# «-आव» is the locative postposition, and has one shape too.
style-text =
    { $parts ->
        [background] { $background } फाइलआव { $color }
       *[plain] { $color }
    }
style-background-none = जेबो गैया

## Boolean words

boolean-true = थार
boolean-false = फोसाब

## Answer buttons

answer-submit-label = आनजाद खालाम
answer-submit-label-no-correctness = फिन दैथाय

## Sectional blocks

section-name =
    .activity = मावथि
    .aside = खोन्दो टिप्पनी
    .cascade = खान्थि
    .definition = बेखेवथि
    .example = बिदिन्थि
    .exercise = सोलोंथाय
    .exercises = सोलोंथाय
    .given-answer = फिन
    .note = टिप्पनी
    .objectives = गोसोखां
    .paragraphs = अनुच्छेद
    .part = हांखो
    .problem = जिंगा
    .problems = जिंगा
    .proof = सान्दांथि
    .question = सोंथि
    .section = बाहागो
    .solution = सुस्रांथि
    .task = खामानि
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
hint-title = सिनायथि

## Tables and figures

table-name =
    { $parts ->
        [numbered] सारनी { $enumeration }
        [numbered-title] सारनी { $enumeration }{ ": " }
        [unnumbered-title] सारनी{ ": " }
       *[unnumbered] सारनी
    }
figure-name =
    { $parts ->
        [numbered] मुसुखा { $enumeration }
        [numbered-caption] मुसुखा { $enumeration }{ ": " }
        [unnumbered-caption] मुसुखा{ ": " }
       *[unnumbered] मुसुखा
    }

## Paginator controls

paginator-previous = आगोलनि
paginator-next = उननि
paginator-page = बिलाइ
# «X-निफ्राय Y» — "Y out of X" — puts the total first, so the two counts change
# places. The ablative «-निफ्राय» has one shape whatever precedes it.
paginator-page-status = { $numPages }-निफ्राय { $pageLabel } { $currentPage }

## Piecewise functions

piecewise-condition-or = एबा
piecewise-condition-if = जुदि
piecewise-condition-otherwise = एबा नङाब्ला

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Bodo-medium schooling in Assam runs to the secondary grades and the SEBA
## textbooks are translated into it, so this is **not** the school-system case
## the four Indo-Aryan catalogs beside it record. It is the Samoan case: there
## is no settled Bodo list of all 118 to seed from. What the textbooks carry is
## the Assamese-derived nomenclature for the elements a syllabus actually
## names, and reading a partial list as a whole table would report a
## convention that does not exist. `locales/as` is the nearest thing to a
## parallel text for whoever fills this in.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = गोरोन्थि रासायनिक सिन
chemistry-invalid-ionic-compound = गोरोन्थि आयनिक यौगिक
