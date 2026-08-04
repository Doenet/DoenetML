# Lao content catalog: the prose the core computes into the document. Selected
# by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Lao has no grammatical gender, no adjective agreement, no article and no
# case, so `$gender` and `$role` go unused here exactly as they do in English,
# and the two `-article` branches read like the ones without.
#
# Adjectives *follow* the noun they modify — «ເສັ້ນຊື່ໜາສີແດງ» — so the
# composition messages put the noun first, as Khmer and Thai do, and keep the
# English order among the adjectives themselves.
#
# Lao is written without spaces inside a phrase, so a placeable sits flush
# against the word in front of it wherever the two belong to one phrase, and a
# space appears only where the phrase genuinely breaks.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

# «ສີ» is the word for colour, and a Lao colour term is normally named with it.
# It is carried inside each word here rather than written into the composition
# messages, because a colour that did not come from this table — a CSS keyword
# asked for by name, or a word an author wrote into `lineColorWord` — arrives
# untranslated and would be left with a stranded «ສີ» in front of it.
color =
    .black = ສີດຳ
    .white = ສີຂາວ
    .gray = ສີຂີ້ເຖົ່າ
    .red = ສີແດງ
    .orange = ສີສົ້ມ
    .yellow = ສີເຫຼືອງ
    .green = ສີຂຽວ
    .cyan = ສີຟ້າອົມຂຽວ
    .blue = ສີນ້ຳເງິນ
    .purple = ສີມ່ວງ
    .pink = ສີບົວ
    .brown = ສີນ້ຳຕານ

line-width =
    .thick = ໜາ
    .thin = ບາງ

line-style =
    .dashed = ຂີດຂາດ
    .dotted = ຈຸດ

# Noun phrases: they follow «ພ້ອມ» and modify nothing.
fill-style =
    .horizontal = ເສັ້ນນອນ
    .vertical = ເສັ້ນຕັ້ງ
    .diagonal = ເສັ້ນທະແຍງ
    .backdiagonal = ເສັ້ນທະແຍງກັບ
    .dots = ຈຸດ
    .diamonds = ຮູບຂ້າວຫຼາມຕັດ

noun =
    .line = ເສັ້ນຊື່
    .line-segment = ພາກຂອງເສັ້ນຊື່
    .ray = ລັງສີ
    .vector = ເວັກເຕີ
    .curve = ເສັ້ນໂຄ້ງ
    .function = ຟັງຊັນ
    .parabola = ພາຣາໂບລາ
    .polyline = ເສັ້ນຫັກຫຼາຍທ່ອນ
    .polygon = ຮູບຫຼາຍແຫຼ່ຽມ
    .triangle = ຮູບສາມແຫຼ່ຽມ
    .rectangle = ຮູບສີ່ແຫຼ່ຽມມຸມສາກ
    .circle = ວົງມົນ
    .region = ພື້ນທີ່
    .point = ຈຸດ
    .square = ຮູບສີ່ແຫຼ່ຽມຈັດຕຸລັດ
    .diamond = ຮູບຂ້າວຫຼາມຕັດ
    .cross = ເຄື່ອງໝາຍກາກະບາດ
    .plus = ເຄື່ອງໝາຍບວກ

# The count and the word it counts — «ດ້ານ», side — sit together immediately
# after the noun and in front of any adjective, so they fold into the head and
# there is no tail. Putting them after the adjectives would separate «ດ້ານ»
# from the number counting it.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] ຮູບຫຼາຍແຫຼ່ຽມດ້ານເທົ່າ { $numSides } ດ້ານ
    }

# Lao has no grammatical gender, so every noun answers the same and the answer
# goes unused — as in English.
noun-gender = neuter


## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width }{ $lineStyle }{ $color }
        [width-color] { $width }{ $color }
        [style-color] { $lineStyle }{ $color }
        [width-style] { $width }{ $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

# The noun leads and its adjectives follow: «ເສັ້ນຊື່ໜາຂີດຂາດສີແດງ».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun }{ $description }{ $nounTail }
       *[noun] { $noun }{ $description }
    }

# «ລະບາຍ» is the verb for laying colour on a surface, and every colour word
# above already carries its own «ສີ», so the composition reads «ລະບາຍສີຟ້າ»
# with the colour word said once. A colour that did not come from that table
# brings no «ສີ» with it, and «ລະບາຍ» stands in front of it unaided.
# `style-unfilled` stands on its own and keeps the full «ບໍ່ລະບາຍສີ».
style-filled-word = ລະບາຍ

style-filled =
    { $parts ->
        [pattern] { $filled }{ $color } ພ້ອມ{ $pattern }
       *[plain] { $filled }{ $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun }{ $filled }{ $color } ພ້ອມ{ $pattern }
        [plain-tail] { $noun }{ $nounTail }{ $filled }{ $color }
        [pattern-tail] { $noun }{ $nounTail }{ $filled }{ $color } ພ້ອມ{ $pattern }
       *[plain] { $noun }{ $filled }{ $color }
    }

# «ຂອບ» leads its own adjectives, the way every noun here does. Lao has no
# article, so the `-article` branches read like the ones without.
style-border-clause =
    { $parts ->
        [with-article] ພ້ອມຂອບ{ $border }
        [and] ແລະຂອບ{ $border }
        [and-article] ແລະຂອບ{ $border }
       *[with] ພ້ອມຂອບ{ $border }
    }

# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern }{ $color }
       *[plain] { $color }
    }

style-unfilled = ບໍ່ລະບາຍສີ

style-text =
    { $parts ->
        [background] { $color }ເທິງພື້ນຫຼັງ{ $background }
       *[plain] { $color }
    }

style-background-none = ບໍ່ມີ


## Boolean words

boolean-true = ຈິງ
boolean-false = ເທັດ


## Answer buttons

answer-submit-label = ກວດຄຳຕອບ
answer-submit-label-no-correctness = ສົ່ງຄຳຕອບ


## Sectional blocks

section-name =
    .activity = ກິດຈະກຳ
    .aside = ໝາຍເຫດຂ້າງ
    .cascade = ລຳດັບ
    .definition = ນິຍາມ
    .example = ຕົວຢ່າງ
    .exercise = ແບບຝຶກຫັດ
    .exercises = ແບບຝຶກຫັດ
    .given-answer = ຄຳຕອບ
    .note = ໝາຍເຫດ
    .objectives = ຈຸດປະສົງ
    .paragraphs = ວັກ
    .part = ພາກ
    .problem = ບັນຫາ
    .problems = ບັນຫາ
    .proof = ການພິສູດ
    .question = ຄຳຖາມ
    .section = ພາກສ່ວນ
    .solution = ວິທີແກ້
    .task = ໜ້າວຽກ
    .theorem = ທິດສະດີບົດ

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = ຄຳໃບ້


## Tables and figures

table-name =
    { $parts ->
        [numbered] ຕາຕະລາງທີ { $enumeration }
        [numbered-title] ຕາຕະລາງທີ { $enumeration }{ ": " }
        [unnumbered-title] ຕາຕະລາງ{ ": " }
       *[unnumbered] ຕາຕະລາງ
    }

figure-name =
    { $parts ->
        [numbered] ຮູບທີ { $enumeration }
        [numbered-caption] ຮູບທີ { $enumeration }{ ": " }
        [unnumbered-caption] ຮູບ{ ": " }
       *[unnumbered] ຮູບ
    }


## Paginator controls

paginator-previous = ກ່ອນໜ້າ
paginator-next = ຕໍ່ໄປ
paginator-page = ໜ້າ

paginator-page-status = { $pageLabel } { $currentPage } ຈາກ { $numPages }


## Piecewise functions

piecewise-condition-or = ຫຼື
piecewise-condition-if = ຖ້າ
piecewise-condition-otherwise = ກໍລະນີອື່ນ


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Lao secondary chemistry is taught in Lao and its textbooks print Lao
## transcriptions of the element names. What is missing is a transcription
## convention this seed could reproduce rather than invent: an unreviewed guess
## written in a script the reader cannot check against the English beside it is
## worse than the English itself. This is the first thing a Lao speaker should
## fill in, and filling it in needs no permission.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = ສັນຍາລັກເຄມີບໍ່ຖືກຕ້ອງ
chemistry-invalid-ionic-compound = ສານປະກອບໄອອອນບໍ່ຖືກຕ້ອງ
