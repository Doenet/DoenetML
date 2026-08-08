# Hawaiian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Hawaiian has no grammatical gender, no adjective agreement and no case
# ending, so `$gender` and `$role` go unused here exactly as they do in
# English, and the two `-article` branches read like the ones without.
#
# Adjectives *follow* the noun they modify — «laina mānoanoa ʻulaʻula» — so the
# composition messages put the noun first and keep the English order among the
# adjectives themselves.
#
# The nouns are written bare, without «ka» or «ke». Which of the two a noun
# takes is a fact about the noun, and these words are also looked up on their
# own as labels, where an article would be wrong; the article belongs to the
# sentence that uses the word, not to the word.
#
# The mathematical nouns are where a speaker should look first: Hawaiian-medium
# schooling has its own mathematics vocabulary, and where this seed has reached
# for a familiar word or a loan instead of that vocabulary's term, the term
# should replace it.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black = ʻeleʻele
    .white = keʻokeʻo
    .gray = ʻāhinahina
    .red = ʻulaʻula
    .orange = ʻalani
    .yellow = melemele
    .green = ʻōmaʻomaʻo
    .cyan = polū ʻōmaʻomaʻo
    .blue = polū
    .purple = poni
    .pink = ʻākala
    .brown = palaunu

line-width =
    .thick = mānoanoa
    .thin = lahilahi

line-style =
    .dashed = mokumoku
    .dotted = kikokiko

# Noun phrases: they follow «me» and modify nothing.
fill-style =
    .horizontal = laina moe
    .vertical = laina kū
    .diagonal = laina hio
    .backdiagonal = laina hio huli
    .dots = kiko
    .diamonds = kaimana

noun =
    .line = laina
    .line-segment = ʻāpana laina
    .ray = kukuna
    .vector = wekekona
    .curve = laina piʻo
    .function = hana
    .parabola = parapola
    .polyline = laina lehulehu
    .polygon = huinalehulehu
    .triangle = huinakolu
    .rectangle = huinahā kūpono
    .circle = pōʻai
    .region = wahi
    .point = kiko
    .square = huinahā like
    .diamond = kaimana
    .cross = keʻa
    .plus = hōʻailona hoʻohui

# The side count follows the noun and precedes its adjectives, so it folds into
# the head and there is no tail: «huinalehulehu like { $numSides } ʻaoʻao».
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] huinalehulehu like { $numSides } ʻaoʻao
    }

# Hawaiian has no grammatical gender, so every noun answers the same and the
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

# The noun leads and its adjectives follow: «laina mānoanoa mokumoku ʻulaʻula».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = piha

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } me { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } me { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } me { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

style-border-clause =
    { $parts ->
        [with-article] me ka palena { $border }
        [and] a me ka palena { $border }
        [and-article] a me ka palena { $border }
       *[with] me ka palena { $border }
    }

# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = piha ʻole

style-text =
    { $parts ->
        [background] { $color } ma luna o ke kua { $background }
       *[plain] { $color }
    }

style-background-none = ʻaʻohe


## Boolean words

boolean-true = ʻoiaʻiʻo
boolean-false = wahaheʻe


## Answer buttons

answer-submit-label = E nānā i ka hana
answer-submit-label-no-correctness = E hoʻouna i ka pane


## Sectional blocks

section-name =
    .activity = Hana
    .aside = Manaʻo ʻaoʻao
    .cascade = Kaʻina
    .definition = Wehewehe
    .example = Laʻana
    .exercise = Hoʻomaʻamaʻa
    .exercises = Hoʻomaʻamaʻa
    .given-answer = Pane
    .note = Memo
    .objectives = Pahuhopu
    .paragraphs = Paukū
    .part = Māhele
    .problem = Pilikia
    .problems = Pilikia
    .proof = Hōʻoiaʻiʻo
    .question = Nīnau
    .section = Māhele
    .solution = Hopena
    .task = Hana
    .theorem = Kumumanaʻo

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Kuhikuhi


## Tables and figures

table-name =
    { $parts ->
        [numbered] Papa { $enumeration }
        [numbered-title] Papa { $enumeration }{ ": " }
        [unnumbered-title] Papa{ ": " }
       *[unnumbered] Papa
    }

figure-name =
    { $parts ->
        [numbered] Kiʻi { $enumeration }
        [numbered-caption] Kiʻi { $enumeration }{ ": " }
        [unnumbered-caption] Kiʻi{ ": " }
       *[unnumbered] Kiʻi
    }


## Paginator controls

paginator-previous = Mua
paginator-next = Aʻe
paginator-page = ʻAoʻao

paginator-page-status = { $pageLabel } { $currentPage } o { $numPages }


## Piecewise functions

piecewise-condition-or = a i ʻole
piecewise-condition-if = inā
piecewise-condition-otherwise = a i ʻole kēlā


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Hawaiian-medium education coins terms where it needs them, but there is no
## settled list of all 118 element names to seed from, and inventing one would
## put invented words in front of a student instead of the English their
## textbook also prints. A Hawaiian chemistry list is exactly the kind of thing
## a speaker should add here.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Hōʻailona kemikala kūpono ʻole
chemistry-invalid-ionic-compound = Huikau ionika kūpono ʻole
