# Punjabi content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Gurmukhi, and named `pa` rather than `pa-Guru` because only one
# script is translated here: the README names a directory for a script only
# where two scripts of one language are translated separately, which today is
# Chinese alone. A Shahmukhi reader negotiating `pa-Arab` reaches this catalog
# and gets Gurmukhi, which is the same asymmetry `zh-CN` already has, and the
# answer to it is a second catalog rather than a differently named first one.
#
# Punjabi has two genders, and an adjective ending in -ਾ agrees with its noun:
# ਕਾਲਾ m, ਕਾਲੀ f. Adjectives precede the noun, as in English, so only the
# words change and not their order.
#
# `$role` matters for one of the four positions, and only in `color`. A
# postposition governs the oblique, and a masculine adjective in -ਾ takes -ੇ
# there; a feminine one in -ੀ spells the two alike. Of the three clause
# positions, only `background-clause` lands on a masculine noun, so it is the
# only branch written out:
#
#   standalone          direct; also what `border-clause` and `text-clause`
#                       fall through to, since ਕਿਨਾਰੀ and ਲਿਖਤ are feminine and
#                       arrive with `$gender` saying so
#   background-clause   ਪਿਛੋਕੜ — masculine, oblique before ਉੱਤੇ: `-ੇ`
#
# Half the colour words do not agree at all. ਲਾਲ, ਸਲੇਟੀ, ਸੰਤਰੀ, ਅਸਮਾਨੀ,
# ਜਾਮਨੀ and ਗੁਲਾਬੀ end in a consonant or in -ੀ and are invariant, so they are
# written once and every branch reads the same.
#
# Numbers render in Latin digits rather than in Gurmukhi numerals, which is the
# digit policy in the package README (#1615).
#
# The element names are deliberately absent; see the note above the chemistry
# section.


## Style vocabulary

color =
    .black =
        { $role ->
            [background-clause] ਕਾਲੇ
           *[standalone]
                { $gender ->
                    [f] ਕਾਲੀ
                   *[m] ਕਾਲਾ
                }
        }
    .white =
        { $role ->
            [background-clause] ਚਿੱਟੇ
           *[standalone]
                { $gender ->
                    [f] ਚਿੱਟੀ
                   *[m] ਚਿੱਟਾ
                }
        }
    .gray = ਸਲੇਟੀ
    .red = ਲਾਲ
    .orange = ਸੰਤਰੀ
    .yellow =
        { $role ->
            [background-clause] ਪੀਲੇ
           *[standalone]
                { $gender ->
                    [f] ਪੀਲੀ
                   *[m] ਪੀਲਾ
                }
        }
    .green =
        { $role ->
            [background-clause] ਹਰੇ
           *[standalone]
                { $gender ->
                    [f] ਹਰੀ
                   *[m] ਹਰਾ
                }
        }
    .cyan = ਅਸਮਾਨੀ
    .blue =
        { $role ->
            [background-clause] ਨੀਲੇ
           *[standalone]
                { $gender ->
                    [f] ਨੀਲੀ
                   *[m] ਨੀਲਾ
                }
        }
    .purple = ਜਾਮਨੀ
    .pink = ਗੁਲਾਬੀ
    .brown =
        { $role ->
            [background-clause] ਭੂਰੇ
           *[standalone]
                { $gender ->
                    [f] ਭੂਰੀ
                   *[m] ਭੂਰਾ
                }
        }

# No `$role` fork on these two or on `line-style` below, unlike the colours: a
# width and a dash pattern are only ever said of a stroke, which is placed
# `standalone` or in `border-clause` and never in the one clause position that
# goes oblique. A `[background-clause]` branch here could not be reached.
line-width =
    .thick =
        { $gender ->
            [f] ਮੋਟੀ
           *[m] ਮੋਟਾ
        }
    .thin =
        { $gender ->
            [f] ਪਤਲੀ
           *[m] ਪਤਲਾ
        }

# ਬਿੰਦੀਦਾਰ ends in a consonant and never changes; ਟੁੱਟਵਾਂ does.
line-style =
    .dashed =
        { $gender ->
            [f] ਟੁੱਟਵੀਂ
           *[m] ਟੁੱਟਵਾਂ
        }
    .dotted = ਬਿੰਦੀਦਾਰ

# Noun phrases: they stand in front of the «ਨਾਲ» the composition messages
# supply, or in front of the «ਵਾਲੀ» in `style-fill`, and agree with nothing
# themselves.
fill-style =
    .horizontal = ਖਿਤਿਜੀ ਲਕੀਰਾਂ
    .vertical = ਲੰਬਕਾਰੀ ਲਕੀਰਾਂ
    .diagonal = ਵਿਕਰਣ ਲਕੀਰਾਂ
    .backdiagonal = ਉਲਟ ਵਿਕਰਣ ਲਕੀਰਾਂ
    .dots = ਬਿੰਦੀਆਂ
    .diamonds = ਹੀਰੇ

noun =
    .line = ਰੇਖਾ
    .line-segment = ਰੇਖਾਖੰਡ
    .ray = ਕਿਰਨ
    .vector = ਸਦਿਸ਼
    .curve = ਵਕਰਰੇਖਾ
    .function = ਫਲਨ
    .parabola = ਪਰਵਲਯ
    .polyline = ਬਹੁਰੇਖਾ
    .polygon = ਬਹੁਭੁਜ
    .triangle = ਤਿਕੋਣ
    .rectangle = ਆਇਤ
    .circle = ਚੱਕਰ
    .region = ਖੇਤਰ
    .point = ਬਿੰਦੂ
    .square = ਵਰਗ
    .diamond = ਹੀਰਾ
    .cross = ਕਾਟਾ
    .plus = ਜਮ੍ਹਾਂ ਚਿੰਨ੍ਹ

# The side count precedes the noun, as every modifier in Punjabi does, so it
# folds into the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } ਭੁਜਾਵਾਂ ਵਾਲਾ ਨਿਯਮਿਤ ਬਹੁਭੁਜ
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (ਬਹੁਭੁਜ, m) or the
# head of a phrase: `border` (ਕਿਨਾਰੀ, f), `fill` (ਭਰਾਈ, f), `text` (ਲਿਖਤ, f),
# `background` (ਪਿਛੋਕੜ, m). English leaves all four unnamed; the composition
# messages below write out the three this catalog needs a noun for.
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [polyline] f
        [border] f
        [fill] f
        [text] f
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

style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

# Said only of the shape itself, so it takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] ਭਰੀ
       *[m] ਭਰਿਆ
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern } ਨਾਲ
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern } ਨਾਲ
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern } ਨਾਲ
       *[plain] { $filled } { $color } { $noun }
    }

# «ਕਿਨਾਰੀ» is feminine, so the border's adjectives agree with it and not with
# the shape it surrounds. Punjabi has no article, so the two `-article`
# branches read like the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } ਕਿਨਾਰੀ ਨਾਲ
        [and] ਅਤੇ { $border } ਕਿਨਾਰੀ ਨਾਲ
        [and-article] ਅਤੇ { $border } ਕਿਨਾਰੀ ਨਾਲ
       *[with] { $border } ਕਿਨਾਰੀ ਨਾਲ
    }

# The colour arrives agreeing with `fill`, which `noun-gender` answers feminine
# — but the pattern words are plural nouns of their own gender (ਹੀਰੇ m), so
# putting the colour straight in front of one would disagree with it. So the
# message supplies «ਭਰਾਈ» for the colour to agree with and hangs the pattern
# off it, which is what `hi` does with the same message.
style-fill =
    { $parts ->
        [pattern] { $pattern } ਵਾਲੀ { $color } ਭਰਾਈ
       *[plain] { $color } ਭਰਾਈ
    }

# The other answer the same variable gives, and it takes no `$gender`, so it
# names the noun rather than inflecting an adjective for a gender it was not
# told — as «बिना भराव» does in `hi`.
style-unfilled = ਬਿਨਾਂ ਭਰਾਈ

# «ਪਿਛੋਕੜ» is masculine and takes the postposition «ਉੱਤੇ», which is what puts
# its colour in the oblique.
style-text =
    { $parts ->
        [background] { $background } ਪਿਛੋਕੜ ਉੱਤੇ { $color }
       *[plain] { $color }
    }

style-background-none = ਕੋਈ ਨਹੀਂ


## Boolean words

boolean-true = ਸਹੀ
boolean-false = ਗਲਤ


## Answer buttons

answer-submit-label = ਜਾਂਚੋ
answer-submit-label-no-correctness = ਜਵਾਬ ਭੇਜੋ


## Sectional blocks

section-name =
    .activity = ਸਰਗਰਮੀ
    .aside = ਪਾਸੇ ਦੀ ਟਿੱਪਣੀ
    .cascade = ਲੜੀ
    .definition = ਪਰਿਭਾਸ਼ਾ
    .example = ਉਦਾਹਰਨ
    .exercise = ਅਭਿਆਸ
    .exercises = ਅਭਿਆਸ
    .given-answer = ਜਵਾਬ
    .note = ਟਿੱਪਣੀ
    .objectives = ਉਦੇਸ਼
    .paragraphs = ਪੈਰੇ
    .part = ਭਾਗ
    .problem = ਸਵਾਲ
    .problems = ਸਵਾਲ
    .proof = ਸਬੂਤ
    .question = ਪ੍ਰਸ਼ਨ
    .section = ਖੰਡ
    .solution = ਹੱਲ
    .task = ਕਾਰਜ
    .theorem = ਪ੍ਰਮੇਯ

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = ਸੰਕੇਤ


## Tables and figures

table-name =
    { $parts ->
        [numbered] ਸਾਰਣੀ { $enumeration }
        [numbered-title] ਸਾਰਣੀ { $enumeration }{ ": " }
        [unnumbered-title] ਸਾਰਣੀ{ ": " }
       *[unnumbered] ਸਾਰਣੀ
    }

figure-name =
    { $parts ->
        [numbered] ਚਿੱਤਰ { $enumeration }
        [numbered-caption] ਚਿੱਤਰ { $enumeration }{ ": " }
        [unnumbered-caption] ਚਿੱਤਰ{ ": " }
       *[unnumbered] ਚਿੱਤਰ
    }


## Paginator controls

paginator-previous = ਪਿਛਲਾ
paginator-next = ਅਗਲਾ
paginator-page = ਸਫ਼ਾ

# The total leads, marked with «ਵਿੱਚੋਂ», which is how Punjabi says "3 of 5".
paginator-page-status = { $numPages } ਵਿੱਚੋਂ { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = ਜਾਂ
piecewise-condition-if = ਜੇ
piecewise-condition-otherwise = ਨਹੀਂ ਤਾਂ


## Chemistry

# `element-name` and `element-anion-name` are deliberately omitted, and the 130
# keys fall back to English.
#
# Punjabi-medium schooling in Punjab teaches science through Punjabi in the
# early years and moves to English terminology by the secondary chemistry
# course, so there is no settled Gurmukhi set covering all 118 elements to seed
# from — only the dozen a general-science chapter names. Transliterating the
# rest would invent a nomenclature no textbook prints, and the English fallback
# is what a student meets in the class where the periodic table first appears.
# `lint:i18n` reports the gap until a chemist who writes Punjabi supplies them.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = ਗਲਤ ਰਸਾਇਣਕ ਚਿੰਨ੍ਹ
chemistry-invalid-ionic-compound = ਗਲਤ ਆਇਓਨਿਕ ਯੌਗਿਕ
