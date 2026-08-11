# Chuvash content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with Chuvash's own four extra letters — ă, ĕ, ç, ӳ —
# which are what its schools and publishing use and what CLDR fills a bare `cv`
# in as. Spelling «хура» as «хура» with Russian letters only is a different
# language, so those four are load-bearing rather than decorative.
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
    .white = шурă
    .gray = сăрă
    .red = хĕрлĕ
    .orange = хĕрлĕ-сарă
    .yellow = сарă
    .green = симĕс
    .cyan = çутă кăвак
    .blue = кăвак
    .purple = хĕрхĕлтĕм
    .pink = шупка хĕрлĕ
    .brown = хăмăр

line-width =
    .thick = хулăн
    .thin = çӳхе

line-style =
    .dashed = татăклă
    .dotted = пăнчăллă

# Noun phrases: they stand in front of «эрешлĕ» and modify nothing.
fill-style =
    .horizontal = горизонталь йĕр
    .vertical = вертикаль йĕр
    .diagonal = диагональ йĕр
    .backdiagonal = хирĕç диагональ йĕр
    .dots = пăнчă
    .diamonds = ромб

noun =
    .line = тӳрĕ йĕр
    .line-segment = касăк
    .ray = пайăрка
    .vector = вектор
    .curve = кукăр йĕр
    .function = функци
    .parabola = парабола
    .polyline = хуçăлнă йĕр
    .polygon = нумай кĕтеслĕх
    .triangle = виçкĕтеслĕх
    .rectangle = тӳрĕ кĕтеслĕх
    .circle = çаврашка
    .region = лаптăк
    .point = пăнчă
    .square = тăваткал
    .diamond = ромб
    .cross = хĕрес
    .plus = плюс

# Chuvash builds the word from the side count in front of the noun, so the
# whole of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] тĕрĕс { $numSides } кĕтеслĕх
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

style-filled-word = сăрланă

style-filled =
    { $parts ->
        [pattern] { $pattern } эрешлĕ { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } эрешлĕ { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } эрешлĕ { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «хĕрриллĕ» — "having an edge" — carries the "with a border" sense in its own
# suffix, so neither a preposition nor an article is wanted.
style-border-clause =
    { $parts ->
        [with-article] { $border } хĕрриллĕ
        [and] тата { $border } хĕрриллĕ
        [and-article] тата { $border } хĕрриллĕ
       *[with] { $border } хĕрриллĕ
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } эрешлĕ { $color } сăр
       *[plain] { $color } сăр
    }

style-unfilled = сăрламан

# «çинче» — "on" — is a postposition, so it follows the background colour
# rather than standing between the two words the way English's "with a" does.
style-text =
    { $parts ->
        [background] { $background } фон çинче { $color }
       *[plain] { $color }
    }

style-background-none = çук


## Boolean words

boolean-true = тĕрĕс
boolean-false = йăнăш


## Answer buttons

answer-submit-label = Тĕрĕслесе пăхас
answer-submit-label-no-correctness = Хурава ярас


## Sectional blocks

section-name =
    .activity = Ĕç
    .aside = Асăрхаттару
    .cascade = Каскад
    .definition = Ăнлантару
    .example = Тĕслĕх
    .exercise = Хăнăхтару
    .exercises = Хăнăхтарусем
    .given-answer = Хурав
    .note = Асăрхаттару çырăвĕ
    .objectives = Тĕллевсем
    .paragraphs = Абзацсем
    .part = Пайĕ
    .problem = Задача
    .problems = Задачăсем
    .proof = Кăтартса пани
    .question = Ыйту
    .section = Пай
    .solution = Татăлăхĕ
    .task = Ĕç хушни
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
        [numbered] Ӳкерчĕк { $enumeration }
        [numbered-caption] Ӳкерчĕк { $enumeration }{ ". " }
        [unnumbered-caption] Ӳкерчĕк{ ". " }
       *[unnumbered] Ӳкерчĕк
    }


## Paginator controls

paginator-previous = Малтанхи
paginator-next = Тепĕр
paginator-page = Страница

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = е
piecewise-condition-if = енчен
piecewise-condition-otherwise = урăх чухне


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

chemistry-invalid-symbol = Тĕрĕс мар хими палли
chemistry-invalid-ionic-compound = Тĕрĕс мар ион пĕрлешĕвĕ
