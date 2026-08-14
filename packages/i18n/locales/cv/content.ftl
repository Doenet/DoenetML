# Chuvash content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with Chuvash's own four extra letters — ӑ, ӗ, ҫ, ӳ —
# which are what its schools and publishing use and what CLDR fills a bare `cv`
# in as. Spelling «шурӑ» as «шура» with Russian letters only is a different
# language, so those four are load-bearing rather than decorative.
#
# All four are **Cyrillic** codepoints — ӑ U+04D1, ӗ U+04D7, ҫ U+04AB, ӳ U+04F3
# — and not the Latin lookalikes ă U+0103, ĕ U+0115 and ç U+00E7 that legacy
# Chuvash typesetting reached for. They look alike and sort, search and
# case-fold differently, so a correction typed from a Latin keyboard layout
# would quietly split this catalog across two scripts.
#
# CONFIDENCE. Chuvash is the sole surviving Oghur Turkic language and shares
# far less vocabulary with `locales/tt` and `locales/ba` than their common
# family suggests; this seed had less written Chuvash to draw on than it had
# Tatar. The colour and shape words below are the part it is most confident of.
#
# Chuvash has no grammatical gender and does not inflect an attributive
# adjective, so both `$gender` and `$role` go unused here, as in English and in
# every other Turkic catalog in the roster. Adjectives precede the noun, so the
# composition messages keep the English order.


## Style vocabulary

color =
    .black = хура
    .white = шурӑ
    .gray = сӑрӑ
    .red = хӗрлӗ
    .orange = хӗрлӗ-сарӑ
    .yellow = сарӑ
    .green = симӗс
    .cyan = ҫутӑ кӑвак
    .blue = кӑвак
    .purple = хӗрхӗлтӗм
    .pink = шупка хӗрлӗ
    .brown = хӑмӑр

line-width =
    .thick = хулӑн
    .thin = ҫӳхе

line-style =
    .dashed = татӑклӑ
    .dotted = пӑнчӑллӑ

# Noun phrases: they stand in front of «эрешлӗ» and modify nothing.
fill-style =
    .horizontal = горизонталь йӗр
    .vertical = вертикаль йӗр
    .diagonal = диагональ йӗр
    .backdiagonal = хирӗҫ диагональ йӗр
    .dots = пӑнчӑ
    .diamonds = ромб

noun =
    .line = тӳрӗ йӗр
    .line-segment = касӑк
    .ray = пайӑрка
    .vector = вектор
    .curve = кукӑр йӗр
    .function = функци
    .parabola = парабола
    .polyline = хуҫӑлнӑ йӗр
    .polygon = нумай кӗтеслӗх
    .triangle = виҫкӗтеслӗх
    .rectangle = тӳрӗ кӗтеслӗх
    .circle = ҫаврашка
    .region = лаптӑк
    .point = пӑнчӑ
    .square = тӑваткал
    .diamond = ромб
    .cross = хӗрес
    .plus = плюс

# Chuvash builds the word from the side count in front of the noun, so the
# whole of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] тӗрӗс { $numSides } кӗтеслӗх
    }

# Chuvash has no grammatical gender, so every noun answers the same and the
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

style-filled-word = сӑрланӑ

style-filled =
    { $parts ->
        [pattern] { $pattern } эрешлӗ { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } эрешлӗ { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } эрешлӗ { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «хӗрриллӗ» — "having an edge" — carries the "with a border" sense in its own
# suffix, so neither a preposition nor an article is wanted.
style-border-clause =
    { $parts ->
        [with-article] { $border } хӗрриллӗ
        [and] тата { $border } хӗрриллӗ
        [and-article] тата { $border } хӗрриллӗ
       *[with] { $border } хӗрриллӗ
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } эрешлӗ { $color } сӑр
       *[plain] { $color } сӑр
    }

style-unfilled = сӑрламан

# «ҫинче» — "on" — is a postposition, so it follows the background colour
# rather than standing between the two words the way English's "with a" does.
style-text =
    { $parts ->
        [background] { $background } фон ҫинче { $color }
       *[plain] { $color }
    }

style-background-none = ҫук


## Boolean words

boolean-true = тӗрӗс
boolean-false = йӑнӑш


## Answer buttons

answer-submit-label = Тӗрӗслесе пӑхас
answer-submit-label-no-correctness = Хурава ярас


## Sectional blocks

section-name =
    .activity = Ӗҫ
    .aside = Асӑрхаттару
    .cascade = Каскад
    .definition = Ӑнлантару
    .example = Тӗслӗх
    .exercise = Хӑнӑхтару
    .exercises = Хӑнӑхтарусем
    .given-answer = Хурав
    .note = Асӑрхаттару ҫырӑвӗ
    .objectives = Тӗллевсем
    .paragraphs = Абзацсем
    .part = Пайӗ
    .problem = Задача
    .problems = Задачӑсем
    .proof = Кӑтартса пани
    .question = Ыйту
    .section = Пай
    .solution = Татӑлӑхӗ
    .task = Ӗҫ хушни
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

hint-title = Канаш


## Tables and figures

table-name =
    { $parts ->
        [numbered] Таблица { $enumeration }
        [numbered-title] Таблица { $enumeration }{ ". " }
        [unnumbered-title] Таблица{ ". " }
       *[unnumbered] Таблица
    }

figure-name =
    { $parts ->
        [numbered] Ӳкерчӗк { $enumeration }
        [numbered-caption] Ӳкерчӗк { $enumeration }{ ". " }
        [unnumbered-caption] Ӳкерчӗк{ ". " }
       *[unnumbered] Ӳкерчӗк
    }


## Paginator controls

paginator-previous = Малтанхи
paginator-next = Тепӗр
paginator-page = Страница

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = е
piecewise-condition-if = енчен
piecewise-condition-otherwise = урӑх чухне


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Chuvashia is taught in
## Russian, and the element names a Chuvash-speaking pupil meets are the
## Russian ones out of a Russian-language textbook. This is the school-system
## case the sub-Saharan batches already record, arriving in a country where the
## medium is Russian rather than English or French — and `locales/tt` beside it
## is the same school system answering differently, which is why the gap is a
## fact about a curriculum rather than about a language.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Тӗрӗс мар хими палли
chemistry-invalid-ionic-compound = Тӗрӗс мар ион пӗрлешӗвӗ
