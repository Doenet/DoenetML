# Pashto content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written right to left, in the Arabic script but sharing none of Arabic's
# grammar: Pashto has two genders, puts its adjectives *before* the noun, and
# counts in two plural categories.
#
# Adjectives agree with the noun in gender. Only the ones that inflect select
# below; a borrowed adjective ending in ي — نارنجي، نیلي، بنفشي، ګلابي،
# نسواري، اسماني — is the same in both genders and takes no branch.
#
# `$role` matters for one of the four positions and one gender. Every Pashto
# adposition governs the oblique, and a feminine adjective in ـه takes ـې
# there — «توره کرښه» standing alone against «له تورې کرښې سره» after the
# circumposition in `style-border-clause`. A masculine adjective spells the two
# alike, and so does a feminine one in ـۍ, so `border-clause` is the only
# branch written out:
#
#   standalone          direct; also what `background-clause` and
#                       `text-clause` fall through to, since «شاليد» and
#                       «متن» are masculine and spell their oblique the same
#   border-clause       oblique, before «څنډې سره» — «څنډه» is feminine
#
# The 118 element names and 12 anion names are deliberately absent, as they are
# for Somali, Hmong Njua, Amharic, Assamese, Nepali and Burmese: there is no
# settled Pashto chemical nomenclature to seed from, and inventing one would be
# worse than the English a student meets in their own textbook. Those keys fall
# back to English and `lint:i18n` reports the gap.
#
# Numbers reach the reader in Latin digits, as everywhere in these catalogs.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause]
                { $gender ->
                    [f] تورې
                   *[m] تور
                }
           *[standalone]
                { $gender ->
                    [f] توره
                   *[m] تور
                }
        }
    .white =
        { $role ->
            [border-clause]
                { $gender ->
                    [f] سپینې
                   *[m] سپین
                }
           *[standalone]
                { $gender ->
                    [f] سپینه
                   *[m] سپین
                }
        }
    .gray =
        { $role ->
            [border-clause]
                { $gender ->
                    [f] خړې
                   *[m] خړ
                }
           *[standalone]
                { $gender ->
                    [f] خړه
                   *[m] خړ
                }
        }
    .red =
        { $role ->
            [border-clause]
                { $gender ->
                    [f] سرې
                   *[m] سور
                }
           *[standalone]
                { $gender ->
                    [f] سره
                   *[m] سور
                }
        }
    .orange = نارنجي
    .yellow =
        { $role ->
            [border-clause]
                { $gender ->
                    [f] ژېړې
                   *[m] ژېړ
                }
           *[standalone]
                { $gender ->
                    [f] ژېړه
                   *[m] ژېړ
                }
        }
    .green =
        { $role ->
            [border-clause]
                { $gender ->
                    [f] شنې
                   *[m] شین
                }
           *[standalone]
                { $gender ->
                    [f] شنه
                   *[m] شین
                }
        }
    .cyan = اسماني
    .blue = نیلي
    .purple = بنفشي
    .pink = ګلابي
    .brown = نسواري

line-width =
    .thick =
        { $role ->
            [border-clause]
                { $gender ->
                    [f] پنډې
                   *[m] پنډ
                }
           *[standalone]
                { $gender ->
                    [f] پنډه
                   *[m] پنډ
                }
        }
    .thin =
        { $role ->
            [border-clause]
                { $gender ->
                    [f] نرۍ
                   *[m] نری
                }
           *[standalone]
                { $gender ->
                    [f] نرۍ
                   *[m] نری
                }
        }

# Both are reduplicated phrases rather than adjectives, so neither inflects.
line-style =
    .dashed = ټوټه ټوټه
    .dotted = ټکي ټکي

# Noun phrases rather than adjectives; they agree with nothing, so `style-fill`
# gives them a noun to hang off rather than printing them bare.
fill-style =
    .horizontal = پرتې کرښې
    .vertical = ولاړې کرښې
    .diagonal = کږې کرښې
    .backdiagonal = مخالفې کږې کرښې
    .dots = ټکي
    .diamonds = لوزنګونه

noun =
    .line = کرښه
    .line-segment = د کرښې ټوټه
    .ray = وړانګه
    .vector = ویکتور
    .curve = منحني
    .function = فنکشن
    .parabola = پارابولا
    .polyline = څو کرښه
    .polygon = څو ضلعي
    .triangle = مثلث
    .rectangle = مستطیل
    .circle = دایره
    .region = سیمه
    .point = ټکی
    .square = مربع
    .diamond = لوزنګ
    .cross = کراس
    .plus = د جمعې نښه

# Pashto keeps the side count in front of the noun, so the whole thing is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } ضلعې لرونکی منظم څو ضلعي
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (څو ضلعي, m) or the
# head of a phrase the description never names: `border` (څنډه, f), `fill`
# (ډکاو, m), `text` (متن, m), `background` (شاليد, m).
noun-gender =
    { $noun ->
        [line] f
        [line-segment] f
        [ray] f
        [parabola] f
        [polyline] f
        [circle] f
        [region] f
        [plus] f
        [border] f
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

style-filled-word =
    { $gender ->
        [f] ډکه
       *[m] ډک
    }

# «لرونکی» inflects like any adjective in ی, and it agrees with the shape
# rather than with the pattern in front of it: «ټکي لرونکې کرښه», «ټکي لرونکی
# مربع». `style-fill` writes it with no branch at all, because the noun it
# agrees with there is «ډکاو», which is always masculine.
style-filled =
    { $parts ->
        [pattern] { $pattern } { $gender ->
            [f] لرونکې
           *[m] لرونکی
        } { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } { $gender ->
            [f] لرونکې
           *[m] لرونکی
        } { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } { $gender ->
            [f] لرونکې
           *[m] لرونکی
        } { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «سره» is a postposition, so the border phrase closes with it. Pashto has no
# indefinite article, so the two `-article` branches say what their plain
# counterparts do.
style-border-clause =
    { $parts ->
        [with-article] له { $border } څنډې سره
        [and] او له { $border } څنډې سره
        [and-article] او له { $border } څنډې سره
       *[with] له { $border } څنډې سره
    }

# The pattern words agree with nothing, so this message supplies «ډکاو» —
# masculine, the gender `noun-gender` already answers for `fill` — for the
# colour to agree with in both variants.
style-fill =
    { $parts ->
        [pattern] { $pattern } لرونکی { $color } ډکاو
       *[plain] { $color } ډکاو
    }

style-unfilled = بې ډکاوه

style-text =
    { $parts ->
        [background] په { $background } شاليد کې { $color }
       *[plain] { $color }
    }

style-background-none = هیڅ


## Boolean words

boolean-true = سم
boolean-false = ناسم


## Answer buttons

answer-submit-label = ځواب وګورئ
answer-submit-label-no-correctness = ځواب واستوئ


## Sectional blocks

section-name =
    .activity = فعالیت
    .aside = څنډیزه یادونه
    .cascade = لړۍ
    .definition = تعریف
    .example = بېلګه
    .exercise = تمرین
    .exercises = تمرینونه
    .given-answer = ځواب
    .note = یادونه
    .objectives = موخې
    .paragraphs = پراګرافونه
    .part = برخه
    .problem = پوښتنه
    .problems = پوښتنې
    .proof = ثبوت
    .question = سوال
    .section = څپرکی
    .solution = حل
    .task = دنده
    .theorem = تیورم

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = اشاره


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
        [numbered] انځور { $enumeration }
        [numbered-caption] انځور { $enumeration }{ ": " }
        [unnumbered-caption] انځور{ ": " }
       *[unnumbered] انځور
    }


## Paginator controls

paginator-previous = پخوانی
paginator-next = راتلونکی
paginator-page = مخ

paginator-page-status = { $pageLabel } { $currentPage } له { $numPages } څخه


## Piecewise functions

piecewise-condition-or = یا

piecewise-condition-if = که

piecewise-condition-otherwise = په بل صورت کې


## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = ناسمه کیمیاوي نښه
chemistry-invalid-ionic-compound = ناسم آیوني ترکیب
