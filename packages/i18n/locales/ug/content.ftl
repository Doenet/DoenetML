# Uyghur content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written right to left, in the Arabic script, but Turkic: Uyghur has no
# grammatical gender, puts its adjectives *before* the noun as English does,
# and marks its cases with suffixes rather than with prepositions.
#
# Those suffixes are the one thing that shapes this catalog. A suffix attaches
# to the word it follows, and an argument is not a word — so where a case would
# have to land on a placeable, the message uses a postposition, which is a word
# of its own and can stand beside one.
#
# Adjectives take no branch at all: nothing in Uyghur agrees with the noun it
# describes, so `$gender` and `$role` both go unread.
#
# The 118 element names and 12 anion names are deliberately absent, as they are
# for Somali, Hmong Njua, Amharic, Assamese, Nepali, Burmese, Pashto and
# Sindhi: there is no settled Uyghur chemical nomenclature to seed from, and
# inventing one would be worse than the English a student meets in their own
# textbook.
#
# Numbers reach the reader in Latin digits, as everywhere in these catalogs.


## Style vocabulary

color =
    .black = قارا
    .white = ئاق
    .gray = كۈلرەڭ
    .red = قىزىل
    .orange = قىزغۇچ سېرىق
    .yellow = سېرىق
    .green = يېشىل
    .cyan = كۆكۈچ
    .blue = كۆك
    .purple = بىنەپشە
    .pink = ھالرەڭ
    .brown = قوڭۇر

line-width =
    .thick = قېلىن
    .thin = ئىنچىكە

line-style =
    .dashed = ئۈزۈك
    .dotted = چېكىتلىك

fill-style =
    .horizontal = توغرا سىزىقلار
    .vertical = تىك سىزىقلار
    .diagonal = يانتۇ سىزىقلار
    .backdiagonal = تەتۈر يانتۇ سىزىقلار
    .dots = چېكىتلەر
    .diamonds = رومبىلار

noun =
    .line = سىزىق
    .line-segment = سىزىق بۆلىكى
    .ray = نۇر
    .vector = ۋېكتور
    .curve = ئەگرى سىزىق
    .function = فۇنكسىيە
    .parabola = پارابولا
    .polyline = سۇنۇق سىزىق
    .polygon = كۆپ بۇلۇڭلۇق
    .triangle = ئۈچ بۇلۇڭ
    .rectangle = تىك تۆت بۇرجەك
    .circle = چەمبەر
    .region = رايون
    .point = نۇقتا
    .square = كۋادرات
    .diamond = رومبا
    .cross = كرېست
    .plus = قوشۇش بەلگىسى

# Uyghur keeps the side count in front of the noun, so the whole thing is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } تەرەپلىك مۇنتىزىم كۆپ بۇلۇڭلۇق
    }

# Uyghur has no grammatical gender. The token is defined anyway rather than
# left to fall back, so that this catalog says so on purpose.
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

style-filled-word = تولدۇرۇلغان

# «بىلەن» is a postposition and a word of its own, so it can follow a
# placeable where a case suffix could not.
style-filled =
    { $parts ->
        [pattern] { $color } { $filled }، { $pattern } بىلەن
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $color } { $filled } { $noun }، { $pattern } بىلەن
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $color } { $filled } { $noun } { $nounTail }، { $pattern } بىلەن
       *[plain] { $color } { $filled } { $noun }
    }

# Uyghur has no article, so the two `-article` branches say what their plain
# counterparts do.
style-border-clause =
    { $parts ->
        [with-article] { $border } گىرۋەك بىلەن
        [and] ۋە { $border } گىرۋەك بىلەن
        [and-article] ۋە { $border } گىرۋەك بىلەن
       *[with] { $border } گىرۋەك بىلەن
    }

# The pattern is a plural noun and the colour an adjective in front of it, so
# the two fall in the same order they do in English.
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = تولدۇرۇلمىغان

style-text =
    { $parts ->
        [background] { $color }، { $background } تەگلىك بىلەن
       *[plain] { $color }
    }

style-background-none = يوق


## Boolean words

boolean-true = راست
boolean-false = يالغان


## Answer buttons

answer-submit-label = جاۋابنى تەكشۈرۈش
answer-submit-label-no-correctness = جاۋابنى يوللاش


## Sectional blocks

section-name =
    .activity = پائالىيەت
    .aside = چەت ئىزاھات
    .cascade = تىزما
    .definition = تەبىر
    .example = مىسال
    .exercise = مەشىق
    .exercises = مەشىقلەر
    .given-answer = جاۋاب
    .note = ئىزاھات
    .objectives = نىشانلار
    .paragraphs = ئابزاسلار
    .part = قىسىم
    .problem = مەسىلە
    .problems = مەسىلىلەر
    .proof = ئىسپات
    .question = سوئال
    .section = بۆلۈم
    .solution = يېشىم
    .task = ۋەزىپە
    .theorem = تېئورېما

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = كۆرسەتمە


## Tables and figures

table-name =
    { $parts ->
        [numbered] جەدۋەل { $enumeration }
        [numbered-title] جەدۋەل { $enumeration }{ ": " }
        [unnumbered-title] جەدۋەل{ ": " }
       *[unnumbered] جەدۋەل
    }

figure-name =
    { $parts ->
        [numbered] رەسىم { $enumeration }
        [numbered-caption] رەسىم { $enumeration }{ ": " }
        [unnumbered-caption] رەسىم{ ": " }
       *[unnumbered] رەسىم
    }


## Paginator controls

paginator-previous = ئالدىنقى
paginator-next = كېيىنكى
paginator-page = بەت

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = ياكى

piecewise-condition-if = ئەگەر

piecewise-condition-otherwise = بولمىسا


## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = ئىناۋەتسىز خىمىيىلىك بەلگە
chemistry-invalid-ionic-compound = ئىناۋەتسىز ئىئون بىرىكمىسى
