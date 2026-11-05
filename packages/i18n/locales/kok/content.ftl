# Konkani content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `kok` is an ISO 639-3 **macrolanguage** over Goan Konkani (`gom`) and
# Maharashtrian Konkani (`knn`), so it joins `MACROLANGUAGE_MEMBERS` for the
# same published reason `qu`, `oj` and `bik` did. This catalog is **Goan
# Konkani in Devanagari**, the standard the Goa Konkani Akademi publishes in
# and the one Goa's official-language act names; a Maharashtrian Konkani reader
# arriving under `knn` reaches it. `Intl.getCanonicalLocales` already folds
# `gom` to `kok` on its own, and it is listed anyway so the group reads as a
# whole rather than as the leftovers of one.
#
# Konkani is written in more scripts than any language in this roster but
# Sanskrit: Devanagari in Goa, Latin in the Romi tradition, Kannada in coastal
# Karnataka, Malayalam in Kerala and Perso-Arabic among Nawayathi speakers. So
# `kok-Latn`, `kok-Knda` and `kok-Mlym` all reach this catalog and get
# Devanagari. Romi Konkani is not a dead orthography and a `kok-Latn` catalog
# beside this one is the right answer for it — the same answer `pa`, `sr`, `jv`
# and `su` already get, and here it is owed rather than hypothetical.
#
# Konkani selects on both arguments, and it selects the way Marathi does rather
# than the way Hindi does. Adjectives ending in -ो inflect for **three**
# genders — काळो / काळी / काळें — and take an *oblique* -या before a noun
# governed by a postposition. Adjectives not ending in -ो — नारिंगी, सायन,
# गुलाबी, तपकिरी, जाड, बारीक, तुटक — never change.
#
#   standalone          direct, agreeing with the noun described — three ways
#   border-clause       oblique, before कडेसयत
#   background-clause   oblique, before फांटभुंयेर
#   text-clause         direct masculine, agreeing with मजकूर
#
# Numbers render in Latin digits under Indian grouping (#1615).


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] काळ्या
            [background-clause] काळ्या
            [text-clause] काळो
           *[standalone]
                { $gender ->
                    [f] काळी
                    [n] काळें
                   *[m] काळो
                }
        }
    .white =
        { $role ->
            [border-clause] धव्या
            [background-clause] धव्या
            [text-clause] धवो
           *[standalone]
                { $gender ->
                    [f] धवी
                    [n] धवें
                   *[m] धवो
                }
        }
    .gray =
        { $role ->
            [border-clause] भुऱ्या
            [background-clause] भुऱ्या
            [text-clause] भुरो
           *[standalone]
                { $gender ->
                    [f] भुरी
                    [n] भुरें
                   *[m] भुरो
                }
        }
    .red =
        { $role ->
            [border-clause] तांबड्या
            [background-clause] तांबड्या
            [text-clause] तांबडो
           *[standalone]
                { $gender ->
                    [f] तांबडी
                    [n] तांबडें
                   *[m] तांबडो
                }
        }
    .orange = नारिंगी
    .yellow =
        { $role ->
            [border-clause] पिवळ्या
            [background-clause] पिवळ्या
            [text-clause] पिवळो
           *[standalone]
                { $gender ->
                    [f] पिवळी
                    [n] पिवळें
                   *[m] पिवळो
                }
        }
    .green =
        { $role ->
            [border-clause] पाचव्या
            [background-clause] पाचव्या
            [text-clause] पाचवो
           *[standalone]
                { $gender ->
                    [f] पाचवी
                    [n] पाचवें
                   *[m] पाचवो
                }
        }
    .cyan = सायन
    .blue =
        { $role ->
            [border-clause] निळ्या
            [background-clause] निळ्या
            [text-clause] निळो
           *[standalone]
                { $gender ->
                    [f] निळी
                    [n] निळें
                   *[m] निळो
                }
        }
    .purple =
        { $role ->
            [border-clause] जांबळ्या
            [background-clause] जांबळ्या
            [text-clause] जांबळो
           *[standalone]
                { $gender ->
                    [f] जांबळी
                    [n] जांबळें
                   *[m] जांबळो
                }
        }
    .pink = गुलाबी
    .brown = तपकिरी
# Neither ends in -ो, so neither inflects.
line-width =
    .thick = जाड
    .thin = बारीक
# «तुटक» is invariable; «टिंबांचो» is a genitive adjective and inflects like
# any other word in -ो.
line-style =
    .dashed = तुटक
    .dotted =
        { $role ->
            [border-clause] टिंबांच्या
            [background-clause] टिंबांच्या
            [text-clause] टिंबांचो
           *[standalone]
                { $gender ->
                    [f] टिंबांची
                    [n] टिंबांचें
                   *[m] टिंबांचो
                }
        }
# Plural nouns rather than adjectives, with genders of their own. «वापरून»
# ("using") is invariable and takes them bare, which is what lets both
# `style-filled` and `style-fill` set them beside a colour that agrees with
# something else.
fill-style =
    .horizontal = आडव्यो रेघो
    .vertical = ऊब्यो रेघो
    .diagonal = तिरप्यो रेघो
    .backdiagonal = उरफाट्यो तिरप्यो रेघो
    .dots = टिंबां
    .diamonds = समभुज चौकोन
noun =
    .line = रेघ
    .line-segment = रेघखंड
    .ray = किरण
    .vector = सदिश
    .curve = वक्र
    .function = फलन
    .parabola = परवलय
    .polyline = बहुरेघ
    .polygon = बहुभुज
    .triangle = त्रिकोण
    .rectangle = आयत
    .circle = वर्तुळ
    .region = प्रदेश
    .point = बिंदू
    .square = चौरस
    .diamond = समभुज चौकोन
    .cross = फुली
    .plus = अधिक चिन्न
# «भुजांचो» agrees with «बहुभुज», which is masculine, so the count attaches to
# the noun that follows and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } भुजांचो नेमकीचो बहुभुज
    }
# Besides the nouns above, `$noun` may be «regular-polygon» (बहुभुज, m) or the
# head of a phrase the description does not name: «border» (कड, f), «fill»
# (भरण, n), «text» (मजकूर, m), «background» (फांटभूंय, f).
noun-gender =
    { $noun ->
        [line] f
        [polyline] f
        [cross] f
        [border] f
        [background] f
        [function] n
        [circle] n
        [plus] n
        [fill] n
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
# Only ever said of the shape itself, so it is standalone in every description
# and takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] भरिल्ली
        [n] भरिल्लें
       *[m] भरिल्लो
    }
# «वापरून» ("using") is invariable and takes the pattern bare, so the clause
# English appends comes to the front here.
style-filled =
    { $parts ->
        [pattern] { $pattern } वापरून { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } वापरून { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } वापरून { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# -सयत is a postposition, so «कड» goes oblique to «कडे-» and the adjectives in
# front of it take the oblique -या that `border-clause` supplies. Konkani has
# no article, which leaves the `-article` branches reading like the others.
style-border-clause =
    { $parts ->
        [with-article] { $border } कडेसयत
        [and] आनी { $border } कडेसयत
        [and-article] आनी { $border } कडेसयत
       *[with] { $border } कडेसयत
    }
# The colour arrives agreeing with «भरण», which is neuter, so it needs that
# noun beside it.
style-fill =
    { $parts ->
        [pattern] { $pattern } वापरून { $color } भरण
       *[plain] { $color } भरण
    }
style-unfilled = भरणाविणें
# -एर is a postposition too, so the background's colour is oblique; the text's
# own colour, which follows, agrees with «मजकूर» and is direct masculine.
style-text =
    { $parts ->
        [background] { $background } फांटभुंयेर { $color }
       *[plain] { $color }
    }
style-background-none = कांयच ना

## Boolean words

boolean-true = खरें
boolean-false = फट

## Answer buttons

answer-submit-label = तपासात
answer-submit-label-no-correctness = जाप धाडात

## Sectional blocks

section-name =
    .activity = कृती
    .aside = बाजूटीप
    .cascade = कॅस्केड
    .definition = व्याख्या
    .example = देखीक
    .exercise = अभ्यास
    .exercises = अभ्यास
    .given-answer = जाप
    .note = टीप
    .objectives = उद्दिश्टां
    .paragraphs = परिच्छेद
    .part = वांटो
    .problem = समस्या
    .problems = समस्या
    .proof = सिद्धताय
    .question = प्रस्न
    .section = विभाग
    .solution = सोडवण
    .task = काम
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
hint-title = सुचोवणी

## Tables and figures

table-name =
    { $parts ->
        [numbered] कोश्टक { $enumeration }
        [numbered-title] कोश्टक { $enumeration }{ ": " }
        [unnumbered-title] कोश्टक{ ": " }
       *[unnumbered] कोश्टक
    }
figure-name =
    { $parts ->
        [numbered] आकृती { $enumeration }
        [numbered-caption] आकृती { $enumeration }{ ": " }
        [unnumbered-caption] आकृती{ ": " }
       *[unnumbered] आकृती
    }

## Paginator controls

paginator-previous = फाटलें
paginator-next = फुडलें
paginator-page = पान
# «X पैकीं Y» — "Y out of X" — puts the total first, so the two counts change
# places. «पैकीं» is the partitive, Marathi's «पैकी»; «भितर» would read
# "inside".
paginator-page-status = { $numPages } पैकीं { $pageLabel } { $currentPage }

## Piecewise functions

piecewise-condition-or = वा
piecewise-condition-if = जर
piecewise-condition-otherwise = ना जाल्यार

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Konkani is Goa's official language and the medium of primary schooling in
## it; secondary science is English-medium, with Marathi-medium schools beside
## it, so the periodic table reaches a Konkani-speaking student in English or
## in Marathi. `locales/mr` carries the Marathi names. That is the
## school-system case, and Konkani's differs from `mai`'s and `bho`'s only in
## which other language does the teaching.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = अवैध रसायनीक चिन्न
chemistry-invalid-ionic-compound = अवैध आयनीक संयुग
