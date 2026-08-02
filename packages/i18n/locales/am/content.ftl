# Amharic content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Amharic is written in the Ge'ez script, which runs left to right — so nothing
# here needs the right-to-left support DoenetML does not yet have (#1614).
#
# Amharic marks gender on verbs and on some adjectives, but the colour, width
# and pattern words below are the invariable kind: ቀይ is ቀይ whatever it
# describes. So `$gender` goes unused here, as it does in English. Amharic also
# does not inflect an attributive adjective for case, so `$role` goes unread
# too — the postpositions that would govern one attach to the noun.
#
# Adjectives precede the noun, as in English, so the composition messages keep
# the English order.


## Style vocabulary

color =
    .black = ጥቁር
    .white = ነጭ
    .gray = ግራጫ
    .red = ቀይ
    .orange = ብርቱካናማ
    .yellow = ቢጫ
    .green = አረንጓዴ
    .cyan = ሲያን
    .blue = ሰማያዊ
    .purple = ወይን ጠጅ
    .pink = ሮዝ
    .brown = ቡናማ

line-width =
    .thick = ወፍራም
    .thin = ቀጭን

line-style =
    .dashed = ሰረዝ ያለው
    .dotted = ነጥብ ያለው

# Noun phrases: they come in front of «ያለው» and agree with nothing.
fill-style =
    .horizontal = አግድም መስመሮች
    .vertical = ቀጥ ያሉ መስመሮች
    .diagonal = ሰያፍ መስመሮች
    .backdiagonal = ተቃራኒ ሰያፍ መስመሮች
    .dots = ነጥቦች
    .diamonds = አልማዞች

noun =
    .line = መስመር
    .line-segment = የመስመር ክፍል
    .ray = ጨረር
    .vector = ቬክተር
    .curve = ጠምዛዛ
    .function = ተግባር
    .parabola = ፓራቦላ
    .polyline = ስባሪ መስመር
    .polygon = ብዙ ጎን
    .triangle = ሦስት ማዕዘን
    .rectangle = አራት ማዕዘን
    .circle = ክብ
    .region = ክልል
    .point = ነጥብ
    .square = ካሬ
    .diamond = አልማዝ
    .cross = መስቀል
    .plus = የመደመር ምልክት

# Amharic keeps the side count in front of the noun, so the whole thing is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } ጎን ያለው ወጥ ብዙ ጎን
    }

# Amharic's adjectives here do not vary by gender, so every noun answers the
# same and the answer goes unused — as in English.
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

style-filled-word = የተሞላ

style-filled =
    { $parts ->
        [pattern] { $pattern } ያለው { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } ያለው { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } ያለው { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «ያለው» carries the "with a … border" sense itself, so Amharic needs no
# article and the `-article` branches read the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } ጠርዝ ያለው
        [and] እና { $border } ጠርዝ ያለው
        [and-article] እና { $border } ጠርዝ ያለው
       *[with] { $border } ጠርዝ ያለው
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = ያልተሞላ

style-text =
    { $parts ->
        [background] { $color } በ{ $background } ዳራ ላይ
       *[plain] { $color }
    }

style-background-none = የለም


## Boolean words

boolean-true = እውነት
boolean-false = ሐሰት


## Answer buttons

answer-submit-label = አረጋግጥ
answer-submit-label-no-correctness = መልስ ላክ


## Sectional blocks

section-name =
    .activity = እንቅስቃሴ
    .aside = ጎንዮሽ ማስታወሻ
    .cascade = ተከታታይ
    .definition = ትርጓሜ
    .example = ምሳሌ
    .exercise = መልመጃ
    .exercises = መልመጃዎች
    .given-answer = መልስ
    .note = ማስታወሻ
    .objectives = ዓላማዎች
    .paragraphs = አንቀጾች
    .part = ክፍል
    .problem = ጥያቄ
    .problems = ጥያቄዎች
    .proof = ማረጋገጫ
    .question = ጥያቄ
    .section = ንዑስ ክፍል
    .solution = መፍትሔ
    .task = ተግባር
    .theorem = ሒሳባዊ ሕግ

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = ፍንጭ


## Tables and figures

table-name =
    { $parts ->
        [numbered] ሠንጠረዥ { $enumeration }
        [numbered-title] ሠንጠረዥ { $enumeration }{ ": " }
        [unnumbered-title] ሠንጠረዥ{ ": " }
       *[unnumbered] ሠንጠረዥ
    }

figure-name =
    { $parts ->
        [numbered] ሥዕል { $enumeration }
        [numbered-caption] ሥዕል { $enumeration }{ ": " }
        [unnumbered-caption] ሥዕል{ ": " }
       *[unnumbered] ሥዕል
    }


## Paginator controls

paginator-previous = ቀዳሚ
paginator-next = ቀጣይ
paginator-page = ገጽ

paginator-page-status = { $pageLabel } { $currentPage } ከ{ $numPages }


## Piecewise functions

piecewise-condition-or = ወይም
piecewise-condition-if = ከሆነ
piecewise-condition-otherwise = ካልሆነ


## Chemistry

# `element-name` and `element-anion-name` are deliberately omitted, and those
# 130 keys fall back to English.
#
# Amharic has no settled chemical nomenclature to seed from — school chemistry
# is taught largely in English in Ethiopia, and the transliterations that do
# circulate are not standardised. Inventing a set would be worse than the
# English fallback, which is what a student would meet in a textbook anyway.
# `lint:i18n` reports the gap until a chemist who writes Amharic supplies them.
# This is the same choice Somali and Hmong Njua make, and for the same reason.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = ልክ ያልሆነ የኬሚካል ምልክት
chemistry-invalid-ionic-compound = ልክ ያልሆነ አዮኒክ ውህድ
