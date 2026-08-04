# Tigrinya content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Tigrinya is the one language in this batch that uses `$gender` for what the
# argument is named after. It is Semitic, it marks masculine and feminine on
# the noun, and an adjective agrees with the noun it describes: «ጸሊም መስመር» but
# «ጸላም ነጥቢ». So the tokens here are `m` and `f`, the same ones `locales/ar` and
# `locales/es` use, and `m` is the default.
#
# The agreement is internal rather than suffixed — «ጸሊም» becomes «ጸላም»,
# «ቀይሕ» becomes «ቀያሕ», «ረጒድ» becomes «ረጓድ» — so the feminine cannot be
# derived from the masculine by a rule and each pair is written out.
#
# **Adjectives precede the noun**, which is the other thing that sets this
# catalog apart from the rest of the batch: every other language seeded
# alongside it puts them after. So the composition messages keep the English
# order, with the description first and the noun behind it.
#
# `$role` goes unused. Tigrinya does mark the three clause positions, but with
# a preposition or a prefix on the noun — «ኣብ ቀይሕ ድሕረ-ባይታ» — and neither ever
# touches the adjective in front of it, so no branch here would differ.
#
# The script is Ge'ez and reads left to right, so nothing in `direction.ts`
# treats it specially.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] ጸላም
           *[m] ጸሊም
        }
    .white = ጻዕዳ
    .gray = ሓሙኽሽታይ
    .red =
        { $gender ->
            [f] ቀያሕ
           *[m] ቀይሕ
        }
    .orange = ብርቱኳናይ
    .yellow = ብጫ
    .green = ቀጠልያ
    .cyan = ሳያን
    .blue = ሰማያዊ
    .purple = ወይናይ
    .pink = ሮዛ
    .brown = ቡናዊ

line-width =
    .thick =
        { $gender ->
            [f] ረጓድ
           *[m] ረጒድ
        }
    .thin =
        { $gender ->
            [f] ቀጣን
           *[m] ቀጢን
        }

# Written as «ብ …» phrases rather than as adjectives, so that they agree with
# nothing. They close the description, which is why `style-stroke` moves them
# behind the colour.
line-style =
    .dashed = ብስንጥቕ
    .dotted = ብነጥብታት

fill-style =
    .horizontal = ደቀኛ መስመራት
    .vertical = ቀጥ ዝበሉ መስመራት
    .diagonal = ሰያፍ መስመራት
    .backdiagonal = ንድሕሪት ዝሰየፉ መስመራት
    .dots = ነጥብታት
    .diamonds = ኣልማዛት

noun =
    .line = መስመር
    .line-segment = ክፍሊ መስመር
    .ray = ጩራ
    .vector = ቬክተር
    .curve = ጥውይዋይ
    .function = ተግባር
    .parabola = ፓራቦላ
    .polyline = ብዙሕ መስመር
    .polygon = ፖሊጎን
    .triangle = ሰለስተ ኩርናዕ
    .rectangle = ኣርባዕተ ኩርናዕ
    .circle = ክቢ
    .region = ከባቢ
    .point = ነጥቢ
    .square = ካሬ
    .diamond = ኣልማዝ
    .cross = መስቀል
    .plus = ምልክት ምድማር

# Tigrinya folds the side count into the head, in front of the noun, the way
# English does — «5 ጎድኒ ዘለዎ ስሩዕ ፖሊጎን» — so there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } ጎድኒ ዘለዎ ስሩዕ ፖሊጎን
    }

noun-gender =
    { $noun ->
        [point] f
        [circle] f
        [parabola] f
        [curve] f
        [region] f
        [background] f
       *[other] m
    }


## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width } { $color } { $lineStyle }
        [width-color] { $width } { $color }
        [style-color] { $color } { $lineStyle }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

# The adjectives lead and the noun follows, as in English.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

style-filled-word =
    { $gender ->
        [f] ምልእቲ
       *[m] ምሉእ
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ምስ { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } ምስ { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } ምስ { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «ዶብ» is masculine and leads its own adjectives, so the border's words agree
# with it and not with the shape it surrounds. Tigrinya has no indefinite
# article, so the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] ምስ { $border } ዶብ
        [and] ከምኡ'ውን { $border } ዶብ
        [and-article] ከምኡ'ውን { $border } ዶብ
       *[with] ምስ { $border } ዶብ
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = ዘይመልአ

style-text =
    { $parts ->
        [background] { $color } ምስ { $background } ድሕረ-ባይታ
       *[plain] { $color }
    }

style-background-none = የልቦን


## Boolean words

boolean-true = ሓቂ
boolean-false = ሓሶት


## Answer buttons

answer-submit-label = ስራሕ ኣረጋግጽ
answer-submit-label-no-correctness = መልሲ ልኣኽ


## Sectional blocks

section-name =
    .activity = ንጥፈት
    .aside = ጎድናዊ ሓሳብ
    .cascade = ካስኬድ
    .definition = ትርጉም
    .example = ኣብነት
    .exercise = ልምምድ
    .exercises = ልምምዳት
    .given-answer = መልሲ
    .note = መዘኻኸሪ
    .objectives = ዕላማታት
    .paragraphs = ሕጡበ-ጽሑፋት
    .part = ክፋል
    .problem = ጸገም
    .problems = ጸገማት
    .proof = መርትዖ
    .question = ሕቶ
    .section = ክፍሊ
    .solution = መፍትሒ
    .task = ዕማም
    .theorem = ቲዮረም

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = ፍንጪ


## Tables and figures

table-name =
    { $parts ->
        [numbered] ሰንጠረዥ { $enumeration }
        [numbered-title] ሰንጠረዥ { $enumeration }{ ": " }
        [unnumbered-title] ሰንጠረዥ{ ": " }
       *[unnumbered] ሰንጠረዥ
    }

figure-name =
    { $parts ->
        [numbered] ስእሊ { $enumeration }
        [numbered-caption] ስእሊ { $enumeration }{ ": " }
        [unnumbered-caption] ስእሊ{ ": " }
       *[unnumbered] ስእሊ
    }


## Paginator controls

paginator-previous = ዝሓለፈ
paginator-next = ዝቕጽል
paginator-page = ገጽ

paginator-page-status = { $pageLabel } { $currentPage } ካብ { $numPages }


## Piecewise functions

piecewise-condition-or = ወይ
piecewise-condition-if = እንተ
piecewise-condition-otherwise = እንተዘይኮይኑ


## Chemistry

# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English and `lint:i18n` reports the gap. Secondary science in Eritrea
# and in Tigray is taught in English, so a student meeting these words meets
# them in English already, and the seed has no settled Tigrinya list to
# reproduce — an unreviewed guess written in Ge'ez, which the reader cannot
# check against the English beside it, would be worse than the English. A
# speaker adding a list should add it here.
ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = ዘይቅቡል ኬሚካላዊ ምልክት
chemistry-invalid-ionic-compound = ዘይቅቡል ኣዮናዊ ውህደት
