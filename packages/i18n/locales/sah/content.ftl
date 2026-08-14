# Sakha (Yakut) content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with Sakha's own extra letters — ҕ, ҥ, һ, ө, ү, and the
# digraphs дь and нь — which its schools and publishing use and which CLDR
# fills a bare `sah` in as. The roster calls this language **Yakut**, because
# that is what `Intl.DisplayNames` renders `sah` as; Sakha is what its speakers
# call it, and the two names are one language.
#
# Sakha has no grammatical gender and does not inflect an attributive
# adjective, so `$gender` and `$role` go unused, as in every Turkic catalog
# here.
#
# THE COLOUR TABLE IS THE PART OF THIS FILE TO READ FIRST. Sakha's «күөх»
# covers both green and blue — one word where the style pipeline needs two —
# so this catalog writes the two modern compounds that split it: «от күөх»
# (grass-green) for green and «халлаан күөҕэ» (sky-colour) for blue. That is a
# real choice rather than a translation, it is what written Sakha does when it
# has to distinguish them, and a speaker may well prefer other words. `cyan` is
# the hardest of the three and is written as a lightened sky-colour.
# «оранжевай» and «розовай» are Russian, which is what Sakha uses for those
# two; nothing here invents a native coinage to avoid an honest loanword.


## Style vocabulary

color =
    .black = хара
    .white = үрүҥ
    .gray = боруон
    .red = кыһыл
    .orange = оранжевай
    .yellow = араҕас
    .green = от күөх
    .cyan = сырдык халлаан күөҕэ
    .blue = халлаан күөҕэ
    .purple = фиолетовай
    .pink = розовай
    .brown = кугас

line-width =
    .thick = халыҥ
    .thin = синньигэс

line-style =
    .dashed = быстах-быстах
    .dotted = туочукалаах

# Noun phrases: they stand in front of «оҥоһуулаах» and modify nothing.
fill-style =
    .horizontal = горизонтальнай сурааһын
    .vertical = вертикальнай сурааһын
    .diagonal = диагональ сурааһын
    .backdiagonal = утары диагональ сурааһын
    .dots = туочука
    .diamonds = ромб

noun =
    .line = көнө сурааһын
    .line-segment = кэрчик
    .ray = сардаҥа
    .vector = вектор
    .curve = токур сурааһын
    .function = функция
    .parabola = парабола
    .polyline = тосторуу сурааһын
    .polygon = элбэх муннуктаах
    .triangle = үс муннуктаах
    .rectangle = көнө муннуктаах
    .circle = түгэрик
    .region = сир
    .point = туочука
    .square = квадрат
    .diamond = ромб
    .cross = кириэс
    .plus = плюс

# Sakha builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] тэҥ { $numSides } муннуктаах
    }

# Sakha has no grammatical gender, so every noun answers the same and the
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

style-filled-word = кырааскалаах

style-filled =
    { $parts ->
        [pattern] { $pattern } оҥоһуулаах { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } оҥоһуулаах { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } оҥоһуулаах { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «кыраныыстаах» — "having an edge" — carries the "with a border" sense in its
# own suffix, so neither a preposition nor an article is wanted.
style-border-clause =
    { $parts ->
        [with-article] { $border } кыраныыстаах
        [and] уонна { $border } кыраныыстаах
        [and-article] уонна { $border } кыраныыстаах
       *[with] { $border } кыраныыстаах
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } оҥоһуулаах { $color } кырааска
       *[plain] { $color } кырааска
    }

style-unfilled = кырааската суох

# «үрдүгэр» — "on top of" — is a postposition and follows the background
# colour, so nothing stands between the two words the way English's "with a"
# does.
style-text =
    { $parts ->
        [background] { $background } фон үрдүгэр { $color }
       *[plain] { $color }
    }

style-background-none = суох


## Boolean words

boolean-true = сөп
boolean-false = сыыһа


## Answer buttons

answer-submit-label = Бэрэбиэркэлээ
answer-submit-label-no-correctness = Хоруйу ыыт


## Sectional blocks

section-name =
    .activity = Дьарык
    .aside = Аһары этии
    .cascade = Каскад
    .definition = Өйдөбүл
    .example = Холобур
    .exercise = Үөрэтии
    .exercises = Үөрэтиилэр
    .given-answer = Хоруй
    .note = Бэлиэтээһин
    .objectives = Сыаллар
    .paragraphs = Абзацтар
    .part = Чааһа
    .problem = Сорудах
    .problems = Сорудахтар
    .proof = Дакаастааһын
    .question = Ыйытык
    .section = Салаа
    .solution = Быһаарыы
    .task = Үлэ
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

hint-title = Сүбэ


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
        [numbered] Ойуу { $enumeration }
        [numbered-caption] Ойуу { $enumeration }{ ". " }
        [unnumbered-caption] Ойуу{ ". " }
       *[unnumbered] Ойуу
    }


## Paginator controls

paginator-previous = Иннинээҕи
paginator-next = Аныгыскы
paginator-page = Сирэй

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions
##
## `piecewise-condition-if` records a limit rather than a choice, and it is
## `locales/dv`'s case in a different family. Sakha marks a condition with a
## converb suffix on the verb at the *end* of its clause — «буоллаҕына» — and
## the renderer places this key *before* the mathematics it introduces, which
## no wording here can fix. The word is written in its citation form so that
## the sentence is at least readable; splitting the key into a prefix and a
## suffix is a change to the worker that no existing catalog needs and this one
## would use.

piecewise-condition-or = эбэтэр
piecewise-condition-if = буоллаҕына
piecewise-condition-otherwise = атын түгэннэргэ


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Sakha is taught in
## Russian, and the element names a Sakha-speaking pupil meets are the Russian
## ones out of a Russian-language textbook — the school-system case, arriving
## in a country whose medium is Russian. Sakha-medium schooling is real and
## reaches further up the grades than most of this batch's languages, which is
## exactly why the gap is worth stating plainly rather than leaving to be
## inferred: what is missing is a settled list of all 118, not the schooling.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Сыыһа хиимийэ бэлиэтэ
chemistry-invalid-ionic-compound = Сыыһа ион холбоһуга
