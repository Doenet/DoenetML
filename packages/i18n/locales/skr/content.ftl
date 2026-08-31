# Saraiki (سرائیکی) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in, not the reader's interface language.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and direction: Perso-Arabic, right to left**, on Urdu's letter
# inventory plus Saraiki's four implosives **ٻ ڄ ڋ ڳ**, with the implosive *ḍ*
# encoded U+068B ڋ throughout. `chrome.ftl` states the convention in full and
# all four files of this locale must keep to the one convention. Nothing about
# the file format changes for a right-to-left catalog: the text is written in
# logical order, no bidi control characters are placed by hand, and digits stay
# Latin.
#
# ## Word order
#
# **Every modifier comes before the noun**, in English's own order: «موٹی لال
# لکیر» is *thick red line*, width first, then the dash pattern, then the
# colour — and «موٹی» is feminine there because «لکیر» is. Saraiki is
# Indo-Aryan and shares Urdu's and Hindi's shape here, so
# `style-stroke`, `style-with-noun` and `style-filled-with-noun` all keep the
# sequence of placeables English uses rather than reversing it. What Saraiki
# does *not* share with English is the preposition: it is postpositional, so
# «نال» (*with*) and «تے» (*on*) follow their object, and the composition
# messages below put them after the placeable rather than in front of it.
#
# **`[noun-tail]` is unused.** `noun-regular-polygon` fills `head` with
# «{ $numSides } ضلعی باقاعدہ کثیر الاضلاع» and leaves `tail` empty, as English
# does: the side count sits in front of the noun here too, so nothing has to be
# split around the adjectives. The `-tail` variants of `style-with-noun` and
# `style-filled-with-noun` are still written out, because that is what a
# partly-translated locale falls back to.
#
# ## Gender and role — this catalog forks on both
#
# **Saraiki inflects an adjective for gender, and this catalog does too.** Its
# adjectives fall into Urdu's and Hindi's two classes. *Marked* ones end in ا
# and change — کالا / کالی / کالے, موٹا / موٹی / موٹے — while *unmarked* ones
# never do: لال, سرمئی, نارنجی, فیروزی, بنفشی, گلابی, منقطع, نقطہ دار. Only
# the marked ones select below, which is why some entries in `color` are a
# single word and others are a two-level select.
#
# A marked adjective also takes the **oblique ے** in front of a noun governed
# by a postposition, and that is what `$role` is for here:
#
#   standalone          direct, agreeing with the noun described
#   border-clause       oblique, in front of «کنارے نال»
#   background-clause   oblique, in front of «پس منظر تے»
#   text-clause         direct masculine, agreeing with متن
#
# The middle two coincide — both nouns are masculine and both sit under a
# postposition — and they are written out separately anyway: which case a
# position governs is this catalog's business, and a later rewording may
# separate them. This is `locales/ur`'s and `locales/hi`'s shape, which is the
# right one to copy rather than a convenience: Saraiki's inflection *is*
# theirs, and a correction to one of the three is usually a correction to all
# three.
#
# **What this seed is unsure of is the gender assignments, not the
# morphology.** `noun-gender` follows Urdu, on the ground that Saraiki and Urdu
# are known to agree for the words it names; a speaker may well move one
# between the classes. That is one line to change per word, and no message has
# to move with it.
#
# **Nothing selects on a count.** A Saraiki noun after a numeral stays
# unmarked, and CLDR has no plural data for `skr` in any case, so a category
# branch would be one `lint:i18n` rejects.
#
# ## The chemistry tables are deliberately absent
#
# `element-name` and `element-anion-name` are the only English keys this file
# does not cover. Saraiki is not a medium of instruction for science —
# chemistry in Pakistan is taught in Urdu and English — so a Saraiki-speaking
# pupil meets the periodic table in one of those two and there is no settled
# Saraiki list of the hundred and eighteen elements to check a translation
# against. Recording that is the honest answer; transliterating Urdu into
# Saraiki spelling and calling it a nomenclature is not. `lint:i18n` reports
# the two keys as missing coverage and that report is correct.
# `ion-name-oxidation-state` and the two invalid-symbol messages **are**
# covered: they are frames and punctuation, not vocabulary.
#
# ## Where else this seed leans on Urdu
#
# The geometry vocabulary — مثلث، مستطیل، مربع، دائرہ، شعاع، منحنی، معین،
# کثیر الاضلاع، قطعہ خط — is the Urdu mathematical vocabulary, kept rather than
# coined: Saraiki-medium schooling stops well short of geometry, and this is
# what a Saraiki-speaking pupil actually reads. The **colour and width words
# are not** — «کالا», «چٹا», «لال», «ساوا», «نیلا», «پیلا», «بھورا», «موٹا»,
# «پتلا» are the everyday Saraiki words. The marked ones among them are what
# make the `$gender` fork above necessary; «لال» is in the list because it is
# Saraiki, not because it inflects — it is one of the eight unmarked
# adjectives and takes no branch. Elsewhere too, where Saraiki has its own word this file
# uses it: «لکیر» for a line, «نقطہ» for a point, «کم» for a task, «سچ» and
# «جھوٹ» for the boolean words, «اڳلا» and «پچھلا» for next and previous, «جے»
# for *if*, «وچوں» for *out of*.


## Style vocabulary
##
## A marked adjective is written as a two-level select: `$role` first, because
## a postposition's oblique overrides gender agreement, and `$gender` only
## inside the `standalone` branch. An unmarked adjective is one word and takes
## no branch at all — writing one out four times would say Saraiki inflects it
## when it does not.

color =
    .black =
        { $role ->
            [border-clause] کالے
            [background-clause] کالے
            [text-clause] کالا
           *[standalone]
                { $gender ->
                    [f] کالی
                   *[m] کالا
                }
        }
    .white =
        { $role ->
            [border-clause] چٹے
            [background-clause] چٹے
            [text-clause] چٹا
           *[standalone]
                { $gender ->
                    [f] چٹی
                   *[m] چٹا
                }
        }
    .gray = سرمئی
    .red = لال
    .orange = نارنجی
    .yellow =
        { $role ->
            [border-clause] پیلے
            [background-clause] پیلے
            [text-clause] پیلا
           *[standalone]
                { $gender ->
                    [f] پیلی
                   *[m] پیلا
                }
        }
    .green =
        { $role ->
            [border-clause] ساوے
            [background-clause] ساوے
            [text-clause] ساوا
           *[standalone]
                { $gender ->
                    [f] ساوی
                   *[m] ساوا
                }
        }
    .cyan = فیروزی
    .blue =
        { $role ->
            [border-clause] نیلے
            [background-clause] نیلے
            [text-clause] نیلا
           *[standalone]
                { $gender ->
                    [f] نیلی
                   *[m] نیلا
                }
        }
    .purple = بنفشی
    .pink = گلابی
    .brown =
        { $role ->
            [border-clause] بھورے
            [background-clause] بھورے
            [text-clause] بھورا
           *[standalone]
                { $gender ->
                    [f] بھوری
                   *[m] بھورا
                }
        }
# Both are marked, so both select.
line-width =
    .thick =
        { $role ->
            [border-clause] موٹے
            [background-clause] موٹے
            [text-clause] موٹا
           *[standalone]
                { $gender ->
                    [f] موٹی
                   *[m] موٹا
                }
        }
    .thin =
        { $role ->
            [border-clause] پتلے
            [background-clause] پتلے
            [text-clause] پتلا
           *[standalone]
                { $gender ->
                    [f] پتلی
                   *[m] پتلا
                }
        }
# Both are unmarked, so neither inflects.
line-style =
    .dashed = منقطع
    .dotted = نقطہ دار
# Noun phrases rather than adjectives: every place a fill pattern is put, it
# stands in front of the postposition «نال», which governs the oblique — and
# the oblique plural of these is the form written here, so nothing has to be
# inflected at the point of use.
fill-style =
    .horizontal = افقی لکیراں
    .vertical = عمودی لکیراں
    .diagonal = ترچھیاں لکیراں
    .backdiagonal = مخالف ترچھیاں لکیراں
    .dots = نقطیاں
    .diamonds = معیناں
noun =
    .line = لکیر
    .line-segment = قطعہ خط
    .ray = شعاع
    .vector = ویکٹر
    .curve = منحنی
    .function = فنکشن
    .slope-field = میلان دا میدان
    .vector-field = ویکٹر دا میدان
    .parabola = پیرابولا
    .polyline = کثیر لکیر
    .polygon = کثیر الاضلاع
    .triangle = مثلث
    .rectangle = مستطیل
    .circle = دائرہ
    .region = خطہ
    .point = نقطہ
    .square = مربع
    .diamond = معین
    .cross = کراس
    .plus = جمع دا نشان
# «ضلعی» is unmarked, so the side count sits in front of the noun with the
# other modifiers and there is nothing to split off into a tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } ضلعی باقاعدہ کثیر الاضلاع
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (کثیر الاضلاع, m)
# or the head of a phrase the description never names: `border` (کنارہ, m),
# `fill` (بھراؤ, m), `text` (متن, m), `background` (پس منظر, m). The masculine
# پس منظر is what makes `background-clause` an oblique masculine above, and it
# is where Saraiki and Urdu part company with Hindi, whose पृष्ठभूमि is
# feminine. Anything not named here falls to the default, which is also what an
# author's own `markerStyleWord` gets, since the catalog has never seen it.
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [polyline] f
       *[other] m
    }


## Style composition
##
## English's own order of placeables, kept rather than reversed — Saraiki puts
## its modifiers in front of the noun as well. What moves is the preposition:
## Saraiki is postpositional, so «نال» and «تے» follow the value they govern.

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
# A marked participle, so it agrees with the shape: «بھریا ہویا مربع»,
# «بھری ہوئی لکیر». Only ever said of the shape itself, so it is standalone in
# every description and takes no `$role` branch. Its opposite, `style-unfilled`
# below, is the unmarked «خالی» and needs none.
style-filled-word =
    { $gender ->
        [f] بھری ہوئی
       *[m] بھریا ہویا
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern } نال
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern } نال
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern } نال
       *[plain] { $filled } { $color } { $noun }
    }
# «نال» is a postposition and governs the oblique, so «کنارہ» is written
# «کنارے» and its adjectives take the oblique ے too — which is exactly what
# `$role`'s `border-clause` supplies. Saraiki has no article, so the two
# `-article` branches read as their plain counterparts do; they are kept apart
# because the distinction belongs to the English message rather than to this
# one.
style-border-clause =
    { $parts ->
        [with-article] { $border } کنارے نال
        [and] تے { $border } کنارے نال
        [and-article] تے { $border } کنارے نال
       *[with] { $border } کنارے نال
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = خالی
style-text =
    { $parts ->
        [background] { $background } پس منظر تے { $color }
       *[plain] { $color }
    }
style-background-none = کوئی نہیں


## Boolean words
##
## What a `<boolean>` displays. `true` and `false` as an author writes them in
## the source stay English; only these two move.

boolean-true = سچ
boolean-false = جھوٹ


## Answer buttons

answer-submit-label = جواب پرکھو
answer-submit-label-no-correctness = جواب گھلو


## Sectional blocks

section-name =
    .activity = سرگرمی
    .aside = حاشیہ
    .cascade = سلسلہ
    .definition = تعریف
    .example = مثال
    .exercise = مشق
    .exercises = مشقاں
    .given-answer = جواب
    .note = نوٹ
    .objectives = مقصد
    .paragraphs = پیراگراف
    .part = حصہ
    .problem = مسئلہ
    .problems = مسئلے
    .proof = ثبوت
    .question = سوال
    .section = باب
    .solution = حل
    .task = کم
    .theorem = نظریہ
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ "۔ " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = اشارہ


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
        [numbered] شکل { $enumeration }
        [numbered-caption] شکل { $enumeration }{ ": " }
        [unnumbered-caption] شکل{ ": " }
       *[unnumbered] شکل
    }


## Paginator controls
##
## «وچوں» — *out of* — is a postposition, so the total comes first and the page
## label and its number follow, which is the reverse of English's order and a
## fact about Saraiki rather than a slip.

paginator-previous = پچھلا
paginator-next = اڳلا
paginator-page = صفحہ
paginator-page-status = { $numPages } وچوں { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = یا
piecewise-condition-if = جے
piecewise-condition-otherwise = ورنہ


## Chemistry
##
## The element tables are absent on purpose; see the header. What is here is
## the frames around a name, which need no nomenclature.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = غلط کیمیائی نشان
chemistry-invalid-ionic-compound = غلط آئنی مرکب


## Inputs embedded in math

math-embedded-input-blank = خالی
math-embedded-input-blank-ordinal = { $total } وچوں خالی { $ordinal }
