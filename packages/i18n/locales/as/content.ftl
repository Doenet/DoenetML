# Assamese content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Assamese is written in the Bengali-Assamese script but is a language of its
# own, so it is catalogued as `as` rather than as a script of `bn`: the two
# share letters, not words, and a Bangla catalog is not a partial Assamese one.
# Note ৰ and ৱ, which are Assamese letters where Bangla writes র and ব.
#
# Like Bangla it has no grammatical gender and does not inflect an attributive
# adjective, so both `$gender` and `$role` go unused exactly as in English.
# What case there is lands on the noun as a suffix — পটভূমিত — and never on the
# adjectives in front of it.
#
# The element names are deliberately absent; see the note above `element-name`.
#
# CLDR counts Assamese in Bengali digits, and DoenetML does not: every number
# renders in Latin digits under Assamese's own grouping, which is India's twos
# above the first thousand (#1615).


## Style vocabulary

color =
    .black = ক'লা
    .white = বগা
    .gray = ধূসৰ
    .red = ৰঙা
    .orange = কমলা
    .yellow = হালধীয়া
    .green = সেউজীয়া
    .cyan = চিয়ান
    .blue = নীলা
    .purple = বেঙুনীয়া
    .pink = গুলপীয়া
    .brown = মটীয়া

line-width =
    .thick = ডাঠ
    .thin = পাতল

line-style =
    .dashed = ডেচযুক্ত
    .dotted = বিন্দুযুক্ত

# Noun phrases rather than adjectives: they are introduced by ৰে ("using"),
# which takes a bare noun.
fill-style =
    .horizontal = অনুভূমিক ৰেখা
    .vertical = উলম্ব ৰেখা
    .diagonal = কৰ্ণ ৰেখা
    .backdiagonal = বিপৰীত কৰ্ণ ৰেখা
    .dots = বিন্দু
    .diamonds = ৰম্বচ

noun =
    .line = ৰেখা
    .line-segment = ৰেখাখণ্ড
    .ray = ৰশ্মি
    .vector = ভেক্টৰ
    .curve = বক্ৰৰেখা
    .function = ফলন
    .parabola = পৰাবৃত্ত
    .polyline = বহুৰেখা
    .polygon = বহুভুজ
    .triangle = ত্ৰিভুজ
    .rectangle = আয়তক্ষেত্ৰ
    .circle = বৃত্ত
    .region = অঞ্চল
    .point = বিন্দু
    .square = বৰ্গক্ষেত্ৰ
    .diamond = ৰম্বচ
    .cross = ক্ৰছ
    .plus = যোগ চিহ্ন

# বাহুবিশিষ্ট ("having sides") attaches the count to the noun that follows, so
# the whole phrase is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } বাহুবিশিষ্ট সুষম বহুভুজ
    }

# Assamese has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English.
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

style-filled-word = ভৰোৱা

# ৰে follows the pattern it applies to, so the clause English appends comes to
# the front here.
style-filled =
    { $parts ->
        [pattern] { $pattern }ৰে { $filled } { $color }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern }ৰে { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern }ৰে { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }

# সৈতে is a postposition, so it follows প্ৰান্ত rather than preceding it as
# English's `with` does. Assamese has no article, which leaves the `-article`
# branches reading exactly like the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } প্ৰান্তৰ সৈতে
        [and] আৰু { $border } প্ৰান্তৰ সৈতে
        [and-article] আৰু { $border } প্ৰান্তৰ সৈতে
       *[with] { $border } প্ৰান্তৰ সৈতে
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = ভৰোৱা নহোৱা

# The locative -ত marks পটভূমি, and the colour word in front of it is
# untouched by that.
style-text =
    { $parts ->
        [background] { $background } পটভূমিত { $color }
       *[plain] { $color }
    }

style-background-none = নাই


## Boolean words

boolean-true = সঁচা
boolean-false = মিছা


## Answer buttons

answer-submit-label = পৰীক্ষা কৰক
answer-submit-label-no-correctness = উত্তৰ দাখিল কৰক


## Sectional blocks

section-name =
    .activity = কাৰ্যকলাপ
    .aside = পাৰ্শ্বটোকা
    .cascade = কেছকেড
    .definition = সংজ্ঞা
    .example = উদাহৰণ
    .exercise = অনুশীলনী
    .exercises = অনুশীলনী
    .given-answer = উত্তৰ
    .note = টোকা
    .objectives = উদ্দেশ্য
    .paragraphs = অনুচ্ছেদ
    .part = অংশ
    .problem = সমস্যা
    .problems = সমস্যা
    .proof = প্ৰমাণ
    .question = প্ৰশ্ন
    .section = খণ্ড
    .solution = সমাধান
    .task = কাম
    .theorem = উপপাদ্য

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = ইংগিত


## Tables and figures

table-name =
    { $parts ->
        [numbered] তালিকা { $enumeration }
        [numbered-title] তালিকা { $enumeration }{ ": " }
        [unnumbered-title] তালিকা{ ": " }
       *[unnumbered] তালিকা
    }

figure-name =
    { $parts ->
        [numbered] চিত্ৰ { $enumeration }
        [numbered-caption] চিত্ৰ { $enumeration }{ ": " }
        [unnumbered-caption] চিত্ৰ{ ": " }
       *[unnumbered] চিত্ৰ
    }


## Paginator controls

paginator-previous = পূৰ্বৱৰ্তী
paginator-next = পৰৱৰ্তী
paginator-page = পৃষ্ঠা

# «X-ৰ ভিতৰত Y» — "Y out of X" — puts the total first, so the two counts
# change places.
paginator-page-status = { $numPages }-ৰ ভিতৰত { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = বা

piecewise-condition-if = যদি

piecewise-condition-otherwise = অন্যথা


## Chemistry

# `element-name` and `element-anion-name` are deliberately omitted, and those
# 130 keys fall back to English.
#
# Assamese has no settled chemical nomenclature to seed from: chemistry in
# Assam is taught largely from English element names, and the transliterations
# that circulate are not standardised. Inventing a set would be worse than the
# English fallback, which is what a student meets in a textbook anyway.
# `lint:i18n` reports the gap until a chemist who writes Assamese supplies
# them. This is the choice Somali, Hmong Njua and Amharic already make, and for
# the same reason. Bangla, whose script this shares, does have such a set and
# supplies it — the two languages part company here, which is exactly why they
# are two catalogs.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = অবৈধ ৰাসায়নিক চিহ্ন
chemistry-invalid-ionic-compound = অবৈধ আয়নিক যৌগ
