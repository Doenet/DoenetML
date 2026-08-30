# Khakas content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Khakas** (хакас тілі), a South Siberian Turkic language of the Republic of
# Khakassia. CLDR carries no name for `kjh` in any language and no plural data
# for it, so nothing about this locale comes from CLDR except the tag.
#
# SCRIPT. Cyrillic, in the standard Khakas alphabet: the Russian letters plus
# **і ғ ң ӧ ӱ ӌ**. `і` is a full letter and is not a variant of `и`, and `ӌ` is
# neither `ч` nor `дж`. All four files of this locale use exactly these six
# extra letters and nothing else; a corrector should not fold them into their
# Russian look-alikes.
#
# HOW THIN THIS IS — read before trusting anything below. Khakas has a literary
# standard and a press, but essentially no written technical register:
# secondary-school mathematics and chemistry in Khakassia are taught in
# Russian, and there is no body of Khakas software text to draw on. This
# catalog is thinner and less certain than its Turkic siblings `tyv` and `sah`,
# and much of the geometric vocabulary here is a first attempt at a calque
# rather than an attested word.
#
# WORD ORDER. Khakas is left-branching, like every Turkic language: modifiers
# stand in front of the noun and nothing follows the head but its suffixes.
# "thick red line" is `чоон хызыл сызых` in that order, and the adjectives do
# not agree with the noun in anything. That is why `noun-regular-polygon` has
# no tail — the side count is another front modifier, so the whole phrase is a
# single head. What English says with a preposition Khakas says with a
# postposition after the noun or a suffix on it: `{ $border } хырылығ` for
# "with a border" (literally "edge-having"), `{ $background } фон ӱстӱнде` for
# "on a background".
#
# GENDER AND NUMBER. No grammatical gender, and an attributive adjective does
# not inflect, so `$gender` and `$role` arrive and are ignored. A noun after a
# numeral stays singular.
#
# CHEMISTRY. `element-name` and `element-anion-name` are deliberately **left
# out** and fall back to English. Khakas has no settled list of the 118
# elements at all: chemistry is taught in Russian throughout Khakassia, and the
# names a Khakas-speaking pupil meets are the Russian ones. Inventing 118 words
# is exactly what this seed may not do. The frames around the names —
# `ion-name-oxidation-state` and the two invalid-input messages — are prose and
# are translated.
#
# LOANS KEPT. `вектор`, `функция`, `парабола`, `квадрат`, `ромб`, `крест`,
# `плюс`, `точка`, `область`, `фон`, `абзац`, `теорема`, `каскад`, `вариант`,
# `статистика`, `горизонтальнай`, `вертикальнай`, `диагональнай` are the
# Russian words in the spelling Khakas writes them in — the `-най` adjective
# ending is how Khakas naturalizes a Russian adjective. They stand because they
# are what the language uses, not for want of trying to translate them.
#
# CONFIDENCE. The least certain items are `пора` (gray), `хоор` (brown) and the
# `пулуң`-based figure names — `кӧп пулуңныг` for polygon, `ӱс пулуңныг` for
# triangle, `тӧрт пулуңныг` for rectangle — which are calques on the Khakas
# word for a corner. They read as Khakas, but a Khakas mathematics teacher
# would very likely write `треугольник` and `прямоугольник`, because that is
# what the textbook in front of them says. A speaker should decide which
# register this catalog belongs to and make it consistent.


## Style vocabulary

color =
    .black = хара
    .white = ах
    .gray = пора
    .red = хызыл
    .orange = оранжевай
    .yellow = сарығ
    .green = чазыл
    .cyan = чарых кӧк
    .blue = кӧк
    .purple = фиолетовай
    .pink = розовай
    .brown = хоор
line-width =
    .thick = чоон
    .thin = чіңге
line-style =
    .dashed = ӱзік-ӱзік
    .dotted = точкалығ
# Noun phrases: they stand in front of the word for the fill and modify
# nothing themselves.
fill-style =
    .horizontal = горизонтальнай сызыхтар
    .vertical = вертикальнай сызыхтар
    .diagonal = диагональнай сызыхтар
    .backdiagonal = удур диагональнай сызыхтар
    .dots = точкалар
    .diamonds = ромбтар
# `slope-field` and `vector-field` are omitted: no Khakas phrase for either
# could be established, and a calque here would be invention. They fall back to
# English.
noun =
    .line = тӱс сызых
    .line-segment = отрезок
    .ray = луч
    .vector = вектор
    .curve = иліг сызых
    .function = функция
    .parabola = парабола
    .polyline = сынған сызых
    .polygon = кӧп пулуңныг
    .triangle = ӱс пулуңныг
    .rectangle = тӧрт пулуңныг
    .circle = тегілек
    .region = область
    .point = точка
    .square = квадрат
    .diamond = ромб
    .cross = крест
    .plus = плюс
# The side count is another front modifier, so the whole phrase is one head and
# there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] тиң { $numSides } пулуңныг
    }
# Khakas has no grammatical gender, so every noun answers the same and the
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
style-filled-word = будалған
# `нең` — "with" — is a postposition, so the pattern and its postposition move
# to the front of the phrase rather than trailing it as English's "with"
# clause does.
style-filled =
    { $parts ->
        [pattern] { $pattern } нең { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } нең { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } нең { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# `хырылығ` — "edge-having" — carries the whole of "with a border" in its own
# suffix, so neither a preposition nor an article is wanted and the `-article`
# branches read exactly like the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } хырылығ
        [and] паза { $border } хырылығ
        [and-article] паза { $border } хырылығ
       *[with] { $border } хырылығ
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = будалбаан
# `ӱстӱнде` — "on top of" — is a postposition and follows the background
# colour, so nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } фон ӱстӱнде { $color }
       *[plain] { $color }
    }
style-background-none = чох


## Boolean words

boolean-true = сын
boolean-false = тӧгін


## Answer buttons

answer-submit-label = Тексерерге
answer-submit-label-no-correctness = Харии ызарға


## Sectional blocks

section-name =
    .activity = Тоғыс
    .aside = Хоза сӧс
    .cascade = Каскад
    .definition = Таныхтағ
    .example = Кӧстеніс
    .exercise = Хатығлағ
    .exercises = Хатығлағлар
    .given-answer = Харии
    .note = Искерме
    .objectives = Сорығлар
    .paragraphs = Абзацтар
    .part = Ӱлӱс
    .problem = Задача
    .problems = Задачалар
    .proof = Кӧргӱзіг
    .question = Сурығ
    .section = Пӧлік
    .solution = Тоос
    .task = Тапсырығ
    .theorem = Теорема
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Сӱме


## Tables and figures

table-name =
    { $parts ->
        [numbered] { $enumeration } таблица
        [numbered-title] { $enumeration } таблица{ ". " }
        [unnumbered-title] Таблица{ ". " }
       *[unnumbered] Таблица
    }
figure-name =
    { $parts ->
        [numbered] { $enumeration } чуртағ
        [numbered-caption] { $enumeration } чуртағ{ ". " }
        [unnumbered-caption] Чуртағ{ ". " }
       *[unnumbered] Чуртағ
    }


## Paginator controls

paginator-previous = Алнындағы
paginator-next = Соондағы
paginator-page = Страница
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions
##
## Khakas marks a condition at the end of its clause — `полза` — but the
## renderer places `piecewise-condition-if` in front of the mathematics it
## introduces. The word is written in its citation form so that the line is at
## least readable; a speaker who can move it should.

piecewise-condition-or = алай
piecewise-condition-if = полза
piecewise-condition-otherwise = пасха туста


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent; see the
## header. These three are frames, not vocabulary, so they are translated.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Чарабас химия белгізі
chemistry-invalid-ionic-compound = Чарабас ион холбазы


## Inputs embedded in math

math-embedded-input-blank = хуруғ орын
math-embedded-input-blank-ordinal = { $total } хуруғ орыннаң { $ordinal }-ӌызы
