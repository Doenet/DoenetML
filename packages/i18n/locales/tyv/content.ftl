# Tuvan content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with ң, ө and ү, which is the orthography Tuva's schools
# and publishing use and what CLDR fills a bare `tyv` in as. The roster calls
# this language **Tuvinian**, because that is what `Intl.DisplayNames` renders
# `tyv` as; Tuvan is the usual English name and the two are one language.
#
# Tuvan has no grammatical gender and does not inflect an attributive
# adjective, so `$gender` and `$role` go unused, as in every other Turkic
# catalog here.
#
# CONFIDENCE. Tuvan's colour vocabulary below leans on Russian for the two
# words its own palette does not name separately — «фиолет», «розовый» — and a
# speaker may well have native words this seed did not find. It does *not*
# have `locales/sah`'s green/blue problem: «ногаан» and «көк» are two words for
# two colours.


## Style vocabulary

color =
    .black = кара
    .white = ак
    .gray = бора
    .red = кызыл
    .orange = кызыл-сарыг
    .yellow = сарыг
    .green = ногаан
    .cyan = чырык көк
    .blue = көк
    .purple = фиолет
    .pink = розовый
    .brown = хүрең
line-width =
    .thick = кылын
    .thin = чуга
line-style =
    .dashed = үзүктелген
    .dotted = точкалыг
# Noun phrases: they stand in front of «чурумалдыг» and modify nothing.
fill-style =
    .horizontal = горизонталь шугум
    .vertical = вертикаль шугум
    .diagonal = диагональ шугум
    .backdiagonal = удурланышкак диагональ шугум
    .dots = точка
    .diamonds = ромб
noun =
    .line = дорт шугум
    .line-segment = кезек
    .ray = луч
    .vector = вектор
    .curve = кыйыг шугум
    .function = функция
    .parabola = парабола
    .polyline = сынган шугум
    .polygon = хөй булуңнуг
    .triangle = үш булуңнуг
    .rectangle = дорт булуңнуг
    .circle = тегерик
    .region = шөл
    .point = точка
    .square = дөрбелчин
    .diamond = ромб
    .cross = крест
    .plus = плюс
# Tuvan builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] дең { $numSides } булуңнуг
    }
# Tuvan has no grammatical gender, so every noun answers the same and the
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
style-filled-word = будаан
style-filled =
    { $parts ->
        [pattern] { $pattern } чурумалдыг { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } чурумалдыг { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } чурумалдыг { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «кыдыглыг» — "having an edge" — carries the "with a border" sense in its own
# suffix, so neither a preposition nor an article is wanted.
style-border-clause =
    { $parts ->
        [with-article] { $border } кыдыглыг
        [and] база { $border } кыдыглыг
        [and-article] база { $border } кыдыглыг
       *[with] { $border } кыдыглыг
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } чурумалдыг { $color } будуг
       *[plain] { $color } будуг
    }
style-unfilled = будаваан
# «кырында» — "on top of" — is a postposition and follows the background
# colour, so nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } фон кырында { $color }
       *[plain] { $color }
    }
style-background-none = чок

## Boolean words

boolean-true = шын
boolean-false = меге

## Answer buttons

answer-submit-label = Хынаар
answer-submit-label-no-correctness = Харыыны чорудар

## Sectional blocks

section-name =
    .activity = Ажыл
    .aside = Кыдыг демдеглел
    .cascade = Каскад
    .definition = Тодарадылга
    .example = Чижек
    .exercise = Мергежилге
    .exercises = Мергежилгелер
    .given-answer = Харыы
    .note = Демдеглел
    .objectives = Сорулгалар
    .paragraphs = Абзацтар
    .part = Кезээ
    .problem = Бодалга
    .problems = Бодалгалар
    .proof = Бадыткал
    .question = Айтырыг
    .section = Эге
    .solution = Шиитпир
    .task = Онаалга
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
hint-title = Сүме

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
        [numbered] Чурук { $enumeration }
        [numbered-caption] Чурук { $enumeration }{ ". " }
        [unnumbered-caption] Чурук{ ". " }
       *[unnumbered] Чурук
    }

## Paginator controls

paginator-previous = Мурнунда
paginator-next = Дараазында
paginator-page = Арын
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## `piecewise-condition-if` is `locales/sah`'s limit again and for the same
## reason: Tuvan marks a condition at the end of its clause — «болза» — and the
## renderer places this key before the mathematics it introduces. The word is
## written in its citation form so the sentence is at least readable.

piecewise-condition-or = азы
piecewise-condition-if = болза
piecewise-condition-otherwise = өске таварылгада

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Tuva is taught in
## Russian and the element names a Tuvan-speaking pupil meets are the Russian
## ones — the school-system case this whole batch shares.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Шын эвес химиктиг демдек
chemistry-invalid-ionic-compound = Шын эвес ион каттыжыышкыны
