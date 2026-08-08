# Ewe content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Ewe has no grammatical gender, no article and no case, so `$gender` and
# `$role` go unused here exactly as they do in English.
#
# Adjectives follow the noun — «fli lolo dzĩ» — so the composition messages put
# the noun first and keep the English order among the adjectives themselves.
#
# **The letters are letters.** `ɖ`, `ƒ`, `ɣ`, `ŋ`, `ɔ`, `ɛ` and `ʋ` are not
# decorated Latin letters that a plainer spelling could stand in for: «ɖe» and
# «de» are different words, and so are «ƒe» and «fe». The tone marks in «dzĩ»
# and «ãtɔ» are the same kind of thing. Stripping any of them is a
# mis-spelling, not a simplification.
#
# The colour words are the point where this seed is thinnest, and it is worth
# saying which are which. «yibɔ», «ɣi» and «dzĩ» — black, white, red — are
# Ewe's own basic terms. The rest are loans spelled the way Ewe writes loans,
# because Ewe names most other colours by comparing them to a thing («amagbe»,
# green, is a green leaf) and a seed cannot tell which comparison a school
# textbook settled on. A speaker should expect to replace most of this block.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black = yibɔ
    .white = ɣi
    .gray = afi
    .red = dzĩ
    .orange = ɔrenj
    .yellow = ɣiɖeɖi
    .green = amagbe
    .cyan = siyan
    .blue = blɔ
    .purple = pɔpul
    .pink = piŋk
    .brown = anyigbatɔ

line-width =
    .thick = lolo
    .thin = sue

# Written as «kple …» phrases rather than as adjectives, so that they can close
# the description. `style-stroke` puts them last for that reason.
line-style =
    .dashed = kple fli kakɛwo
    .dotted = kple dzesi sueawo

fill-style =
    .horizontal = fli mlɔamlɔwo
    .vertical = fli tsitrewo
    .diagonal = fli dzeŋgɔwo
    .backdiagonal = fli dzeŋgɔ megbetɔwo
    .dots = dzesi sueawo
    .diamonds = adzagbawo

noun =
    .line = fli
    .line-segment = fli akpa
    .ray = fli mɔ
    .vector = vɛkta
    .curve = fli gobɛ
    .function = dɔwɔfia
    .parabola = parabola
    .polyline = fli geɖe
    .polygon = axa geɖe
    .triangle = dzogoe etɔ̃
    .rectangle = dzogoe ene didi
    .circle = nugogo
    .region = nuto
    .point = nɔƒe
    .square = dzogoe ene sɔsɔ
    .diamond = adzagba
    .cross = atitsoga
    .plus = tsɔkpe dzesi

# The side count follows the adjectives, behind «si le», because Ewe closes a
# noun phrase with a relative rather than opening one: «axa geɖe sɔsɔ dzĩ si le
# axa 5».
noun-regular-polygon =
    { $part ->
        [tail] si le axa { $numSides }
       *[head] axa geɖe sɔsɔ
    }

noun-gender = neuter


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

style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = si me yɔ

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } kple { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } kple { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } kple { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# Ewe has no article and joins the complement with the invariable «kple», so
# all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] kple liƒo { $border }
        [and] kple liƒo { $border }
        [and-article] kple liƒo { $border }
       *[with] kple liƒo { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = si me meyɔ o

style-text =
    { $parts ->
        [background] { $color } le megbenu { $background } dzi
       *[plain] { $color }
    }

style-background-none = ɖeke meli o


## Boolean words

boolean-true = nyateƒe
boolean-false = alakpa


## Answer buttons

answer-submit-label = Do Dɔa Kpɔ
answer-submit-label-no-correctness = Ɖo Ŋuɖoɖoa Ɖa


## Sectional blocks

section-name =
    .activity = Dɔwɔwɔ
    .aside = Axadzinya
    .cascade = Tsidzadza
    .definition = Gɔmeɖeɖe
    .example = Kpɔɖeŋu
    .exercise = Dɔdasi
    .exercises = Dɔdasiwo
    .given-answer = Ŋuɖoɖo
    .note = Ŋkuɖodzinu
    .objectives = Taɖodzinuwo
    .paragraphs = Memamawo
    .part = Akpa
    .problem = Kuxi
    .problems = Kuxiwo
    .proof = Kpeɖodzi
    .question = Nyabiase
    .section = Memama
    .solution = Kuxikakaɖeŋu
    .task = Dɔ
    .theorem = Teorem

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Mɔfiame


## Tables and figures

table-name =
    { $parts ->
        [numbered] Kplɔ̃ { $enumeration }
        [numbered-title] Kplɔ̃ { $enumeration }{ ": " }
        [unnumbered-title] Kplɔ̃{ ": " }
       *[unnumbered] Kplɔ̃
    }

figure-name =
    { $parts ->
        [numbered] Nɔnɔmetata { $enumeration }
        [numbered-caption] Nɔnɔmetata { $enumeration }{ ": " }
        [unnumbered-caption] Nɔnɔmetata{ ": " }
       *[unnumbered] Nɔnɔmetata
    }


## Paginator controls

paginator-previous = Do ŋgɔ
paginator-next = Emegbetɔ
paginator-page = Axa

paginator-page-status = { $pageLabel } { $currentPage } le { $numPages } dome


## Piecewise functions

piecewise-condition-or = alo
piecewise-condition-if = ne
piecewise-condition-otherwise = ne menye nenema o


## Chemistry

# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English and `lint:i18n` reports the gap. Ghanaian and Togolese
# secondary science is taught in English and in French respectively, so a
# student meeting these words meets them in a European language already — and a
# seed that guessed would have to guess twice, once for each school system. A
# speaker adding a list should add it here.
ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Kemikal Dzesi Si Mesɔ O
chemistry-invalid-ionic-compound = Ion Nutsotso Si Mesɔ O
