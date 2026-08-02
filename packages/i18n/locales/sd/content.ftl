# Sindhi content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written right to left, in the Arabic script extended with letters of its own
# — ڪ، ڳ، ڏ، ٿ، ڄ — so a font that covers Arabic or Urdu does not necessarily
# cover this.
#
# Sindhi shares Urdu's shape: two genders, adjectives *before* the noun,
# postpositions after it, and two plural categories. Marked adjectives end in و
# and inflect — ڪارو / ڪاري — while borrowed ones ending in ي never change:
# خاڪي، نارنگي، آسماني، واڱڻائي، گلابي.
#
# A marked adjective takes the oblique ي before a noun governed by a
# postposition, which is why `$role` matters here. The oblique masculine and
# the feminine coincide, so the branches read alike; they are written out
# separately because which case a position governs is this catalog's business.
#
# The 118 element names and 12 anion names are deliberately absent, as they are
# for Somali, Hmong Njua, Amharic, Assamese, Nepali, Burmese and Pashto: there
# is no settled Sindhi chemical nomenclature to seed from, and inventing one
# would be worse than the English a student meets in their own textbook.
#
# Numbers reach the reader in Latin digits, as everywhere in these catalogs.
#
# Sentences end in «۔», Sindhi's own full stop, and separate with «،».


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] ڪاري
            [background-clause] ڪاري
            [text-clause] ڪارو
           *[standalone]
                { $gender ->
                    [f] ڪاري
                   *[m] ڪارو
                }
        }
    .white =
        { $role ->
            [border-clause] اڇي
            [background-clause] اڇي
            [text-clause] اڇو
           *[standalone]
                { $gender ->
                    [f] اڇي
                   *[m] اڇو
                }
        }
    .gray = خاڪي
    .red =
        { $role ->
            [border-clause] ڳاڙهي
            [background-clause] ڳاڙهي
            [text-clause] ڳاڙهو
           *[standalone]
                { $gender ->
                    [f] ڳاڙهي
                   *[m] ڳاڙهو
                }
        }
    .orange = نارنگي
    .yellow =
        { $role ->
            [border-clause] پيلي
            [background-clause] پيلي
            [text-clause] پيلو
           *[standalone]
                { $gender ->
                    [f] پيلي
                   *[m] پيلو
                }
        }
    .green =
        { $role ->
            [border-clause] سائي
            [background-clause] سائي
            [text-clause] سائو
           *[standalone]
                { $gender ->
                    [f] سائي
                   *[m] سائو
                }
        }
    .cyan = آسماني
    .blue =
        { $role ->
            [border-clause] نيري
            [background-clause] نيري
            [text-clause] نيرو
           *[standalone]
                { $gender ->
                    [f] نيري
                   *[m] نيرو
                }
        }
    .purple = واڱڻائي
    .pink = گلابي
    .brown =
        { $role ->
            [border-clause] ڀوري
            [background-clause] ڀوري
            [text-clause] ڀورو
           *[standalone]
                { $gender ->
                    [f] ڀوري
                   *[m] ڀورو
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] ٿلهي
            [background-clause] ٿلهي
            [text-clause] ٿلهو
           *[standalone]
                { $gender ->
                    [f] ٿلهي
                   *[m] ٿلهو
                }
        }
    .thin =
        { $role ->
            [border-clause] سنهي
            [background-clause] سنهي
            [text-clause] سنهو
           *[standalone]
                { $gender ->
                    [f] سنهي
                   *[m] سنهو
                }
        }

# Both are unmarked, so neither inflects.
line-style =
    .dashed = ٽٽل
    .dotted = نقطيدار

# Noun phrases in the oblique plural, because their other use is in front of
# «وارو» — a postposition that governs the oblique and inflects like a marked
# adjective itself. They agree with nothing, so `style-fill` has to give them
# something to hang off rather than print them bare.
fill-style =
    .horizontal = افقي ليڪن
    .vertical = عمودي ليڪن
    .diagonal = ترڇن ليڪن
    .backdiagonal = ابتڙ ترڇن ليڪن
    .dots = نقطن
    .diamonds = لوزن

noun =
    .line = ليڪ
    .line-segment = ليڪ جو ٽڪرو
    .ray = ڪرڻو
    .vector = ویڪٽر
    .curve = منحني
    .function = فنڪشن
    .parabola = پيرابولا
    .polyline = ٽٽل ليڪ
    .polygon = گھڻ ڪنڊو
    .triangle = ٽڪنڊو
    .rectangle = مستطيل
    .circle = دائرو
    .region = علائقو
    .point = نقطو
    .square = چورس
    .diamond = لوزو
    .cross = ڪراس
    .plus = جمع جو نشان

# Sindhi keeps the side count in front of the noun, so the whole thing is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } پاسن وارو باقاعده گھڻ ڪنڊو
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (گھڻ ڪنڊو, m) or
# the head of a phrase the description never names: `border` (ڪنارو, m),
# `fill` (ڀراءُ, m), `text` (متن, m), `background` (پس منظر, m).
noun-gender =
    { $noun ->
        [line] f
        [parabola] f
        [polyline] f
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

# Adjectives precede the noun, as in English.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

# «ڀريل» is a participle and does not inflect, so this takes no branch even
# though it is handed a gender.
style-filled-word = ڀريل

# «وارو» is a marked adjective itself, and it agrees with the shape rather than
# with the pattern in front of it: «نقطن واري ليڪ», «نقطن وارو چورس». It is
# always said of the shape, so the direct form is the only one needed here —
# `style-fill` writes it with no branch at all, because the noun it agrees with
# there is «ڀراءُ», which is always masculine.
style-filled =
    { $parts ->
        [pattern] { $pattern } { $gender ->
            [f] واري
           *[m] وارو
        } { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } { $gender ->
            [f] واري
           *[m] وارو
        } { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } { $gender ->
            [f] واري
           *[m] وارو
        } { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «سان» is a postposition, so «ڪنارو» takes the oblique «ڪناري» and so do its
# adjectives — which is what the `border-clause` branch supplies. Sindhi has no
# article, so the `-article` branches read the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } ڪناري سان
        [and] ۽ { $border } ڪناري سان
        [and-article] ۽ { $border } ڪناري سان
       *[with] { $border } ڪناري سان
    }

# The fill-pattern words are oblique plurals, so this message supplies a noun
# for them to hang off — «ڀراءُ», masculine, which is the gender `noun-gender`
# already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] { $pattern } وارو { $color } ڀراءُ
       *[plain] { $color } ڀراءُ
    }

style-unfilled = بنا ڀراءَ

style-text =
    { $parts ->
        [background] { $background } پس منظر تي { $color }
       *[plain] { $color }
    }

style-background-none = ڪجهه به نه


## Boolean words

boolean-true = صحيح
boolean-false = غلط


## Answer buttons

answer-submit-label = جواب جانچيو
answer-submit-label-no-correctness = جواب موڪليو


## Sectional blocks

section-name =
    .activity = سرگرمي
    .aside = ڪناري نوٽ
    .cascade = سلسلو
    .definition = تعريف
    .example = مثال
    .exercise = مشق
    .exercises = مشقون
    .given-answer = جواب
    .note = نوٽ
    .objectives = مقصد
    .paragraphs = پيراگراف
    .part = حصو
    .problem = مسئلو
    .problems = مسئلا
    .proof = ثبوت
    .question = سوال
    .section = باب
    .solution = حل
    .task = ڪم
    .theorem = نظريو

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ "۔ " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = اشارو


## Tables and figures

table-name =
    { $parts ->
        [numbered] جدول { $enumeration }
        [numbered-title] جدول { $enumeration }{ ": " }
        [unnumbered-title] جدول{ ": " }
       *[unnumbered] جدول
    }

figure-name =
    { $parts ->
        [numbered] شڪل { $enumeration }
        [numbered-caption] شڪل { $enumeration }{ ": " }
        [unnumbered-caption] شڪل{ ": " }
       *[unnumbered] شڪل
    }


## Paginator controls

paginator-previous = پويون
paginator-next = ايندڙ
paginator-page = صفحو

paginator-page-status = { $numPages } مان { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = يا

piecewise-condition-if = جيڪڏهن

piecewise-condition-otherwise = ٻي صورت ۾


## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = نامعتبر ڪيميائي نشان
chemistry-invalid-ionic-compound = نامعتبر آئوني مرڪب
