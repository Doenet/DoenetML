# Karakalpak content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Karakalpak** (qaraqalpaq tili), a Kipchak Turkic language of the Aral
# region, close to Kazakh in structure and to Uzbek in its borrowings.
#
# SCRIPT. Two orthographies are official at once — Cyrillic and Latin — and the
# changeover has been legislated and put off more than once, so both are in
# real use. This catalog commits to the **current Latin alphabet**: `á ó ú`,
# dotless `ı` against dotted `i`, `ǵ`, `ń`, and the digraphs `sh` and `ch`. It
# is the alphabet of Karakalpakstan's schoolbooks and of new official
# publication, which is the register these strings belong to. A corrector
# should keep it: no Cyrillic letters mixed in, and none of the earlier Latin
# drafts that wrote `ǵ` as `ğ` or `ń` as `ñ`.
#
# WORD ORDER. Karakalpak is a left-branching Turkic language: every modifier
# stands in front of what it modifies, and nothing follows the head noun except
# case and possessive suffixes. "thick red line" is `qalıń qızıl sızıq`, in
# that order and with no agreement between the adjectives and the noun. This is
# why `noun-regular-polygon` has no tail: the side count goes in front of the
# noun with the rest of the modifiers, so the whole phrase is one head.
# Relations English marks with a preposition are marked here by a postposition
# after the noun or by a suffix on it — hence `{ $border } shegaralı` for "with
# a border" (literally "border-having") and `{ $background } fon ústinde` for
# "on a background".
#
# GENDER AND NUMBER. Karakalpak has no grammatical gender and does not inflect
# an attributive adjective, so `$gender` and `$role` are received and ignored
# throughout, as in every other Turkic catalog in the tree. A noun after a
# numeral stays singular.
#
# CHEMISTRY. `element-name` and `element-anion-name` are deliberately **left
# out**, so their ~130 keys fall back to English. Karakalpak has no settled,
# checkable list of all 118 element names: chemistry in Karakalpakstan's
# secondary schools is taught out of Uzbek and Russian textbooks, and the names
# a Karakalpak-speaking pupil actually meets are the Uzbek or Russian ones. A
# nomenclature is not something this seed may invent, so the frames around the
# names — `ion-name-oxidation-state` and the two invalid-input messages — are
# translated and the vocabulary is not.
#
# LOANS KEPT. `vektor`, `funkciya`, `parabola`, `kvadrat`, `romb`, `krest`,
# `plyus`, `gorizontal`, `vertikal`, `diagonal`, `fon`, `abzac`, `teorema`,
# `kaskad`, `variant` and `statistika` are the Russian technical words as
# Karakalpak writes them. They are not laziness: they are what the language
# uses for these ideas, and replacing them with coinages would move the
# catalog away from Karakalpak rather than towards it.
#
# CONFIDENCE. The colour list is the thinnest part of this file. `qızǵılt sarı`
# (orange) and `pushtı` (pink) are the forms this seed is least sure of — a
# speaker may use `qızǵılt` for pink and something else for orange, or simply
# the Russian `rozovıy` and `oranjevıy`, which is common in speech.


## Style vocabulary

color =
    .black = qara
    .white = aq
    .gray = sur
    .red = qızıl
    .orange = qızǵılt sarı
    .yellow = sarı
    .green = jasıl
    .cyan = ashıq kók
    .blue = kók
    .purple = fiolet
    .pink = pushtı
    .brown = qońır
line-width =
    .thick = qalıń
    .thin = jińishke
line-style =
    .dashed = úzik-úzik
    .dotted = noqatlı
# Noun phrases: they stand in front of the word for the fill and modify
# nothing themselves.
fill-style =
    .horizontal = gorizontal sızıqlar
    .vertical = vertikal sızıqlar
    .diagonal = diagonal sızıqlar
    .backdiagonal = keri diagonal sızıqlar
    .dots = noqatlar
    .diamonds = romblar
noun =
    .line = tuwrı sızıq
    .line-segment = kesindi
    .ray = nur
    .vector = vektor
    .curve = iymek sızıq
    .function = funkciya
    .slope-field = baǵıt maydanı
    .vector-field = vektor maydanı
    .parabola = parabola
    .polyline = sınıq sızıq
    .polygon = kóp múyeshlik
    .triangle = úsh múyeshlik
    .rectangle = tuwrı múyeshlik
    .circle = sheńber
    .region = aymaq
    .point = noqat
    .square = kvadrat
    .diamond = romb
    .cross = krest
    .plus = plyus
# The side count is a modifier like any other and stands in front of the noun,
# so the whole phrase is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] durıs { $numSides } múyeshlik
    }
# Karakalpak has no grammatical gender, so every noun answers the same and the
# answer goes unused.
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
style-filled-word = boyalǵan
# `menen` — "with" — is a postposition, so the pattern and its postposition
# move to the front of the phrase instead of trailing it as English's "with"
# clause does.
style-filled =
    { $parts ->
        [pattern] { $pattern } menen { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } menen { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } menen { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# `shegaralı` — "border-having" — carries the whole of "with a border" in its
# own suffix, so neither a preposition nor an article is wanted, and the
# `-article` branches read exactly like the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } shegaralı
        [and] hám { $border } shegaralı
        [and-article] hám { $border } shegaralı
       *[with] { $border } shegaralı
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = boyalmaǵan
# `ústinde` — "on top of" — is a postposition and follows the background
# colour, so nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } fon ústinde { $color }
       *[plain] { $color }
    }
style-background-none = joq


## Boolean words

boolean-true = rás
boolean-false = jalǵan


## Answer buttons

answer-submit-label = Tekseriw
answer-submit-label-no-correctness = Juwaptı jiberiw


## Sectional blocks

section-name =
    .activity = Jumıs
    .aside = Qosımsha
    .cascade = Kaskad
    .definition = Anıqlama
    .example = Mısal
    .exercise = Shınıǵıw
    .exercises = Shınıǵıwlar
    .given-answer = Juwap
    .note = Eskertiw
    .objectives = Maqsetler
    .paragraphs = Abzaclar
    .part = Bólek
    .problem = Másele
    .problems = Máseleler
    .proof = Dálillew
    .question = Soraw
    .section = Bólim
    .solution = Sheshim
    .task = Tapsırma
    .theorem = Teorema
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Kórsetpe


## Tables and figures

table-name =
    { $parts ->
        [numbered] { $enumeration }-keste
        [numbered-title] { $enumeration }-keste{ ". " }
        [unnumbered-title] Keste{ ". " }
       *[unnumbered] Keste
    }
figure-name =
    { $parts ->
        [numbered] { $enumeration }-súwret
        [numbered-caption] { $enumeration }-súwret{ ". " }
        [unnumbered-caption] Súwret{ ". " }
       *[unnumbered] Súwret
    }


## Paginator controls

paginator-previous = Aldıńǵı
paginator-next = Keyingi
paginator-page = Bet
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = yamasa
piecewise-condition-if = eger
piecewise-condition-otherwise = basqa jaǵdayda


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent; see the
## header for why. These three are frames rather than vocabulary, so they are
## translated whether or not the names ever are.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Nadurıs ximiyalıq belgi
chemistry-invalid-ionic-compound = Nadurıs ion birikpesi


## Inputs embedded in math

math-embedded-input-blank = bos orın
math-embedded-input-blank-ordinal = { $total } bos orınnan { $ordinal }-si
