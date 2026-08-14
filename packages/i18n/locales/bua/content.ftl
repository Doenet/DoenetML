# Buryat content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with Buryat's own ү, ө and һ, which is the orthography
# Buryatia's schools and publishing use and what CLDR fills a bare `bua` in as.
# The roster calls this language **Buriat**, because that is what
# `Intl.DisplayNames` renders `bua` as; Buryat is the more usual English
# spelling and the two are one language.
#
# `bua` is an ISO 639-3 **macrolanguage** over Russia Buriat (`bxr`), China
# Buriat (`bxu`) and Mongolia Buriat (`bxm`), so it joins
# `MACROLANGUAGE_MEMBERS` in `negotiate.ts` and all three reach this catalog.
# What is written here is the Russian Buriat literary standard — the Khori
# variety Buryatia publishes in — which is a real compromise for a reader of
# the other two, and the same trade `locales/qu` and `locales/bik` already
# make. A deployment that wants another supplies it as `localeResources`.
#
# Buryat has no grammatical gender and does not inflect an attributive
# adjective, so `$gender` and `$role` go unused here — the same answer every
# Turkic catalog in this batch gives, arriving from an unrelated family.


## Style vocabulary

color =
    .black = хара
    .white = сагаан
    .gray = саарал
    .red = улаан
    .orange = улбар шара
    .yellow = шара
    .green = ногоон
    .cyan = сайбар хүхэ
    .blue = хүхэ
    .purple = нил ягаан
    .pink = ягаан
    .brown = хүрин

line-width =
    .thick = бүдүүн
    .thin = нимгэн

line-style =
    .dashed = таһаршаһан
    .dotted = сэгтэй

# Noun phrases: they stand in front of «хээтэй» and modify nothing.
fill-style =
    .horizontal = хэбтээ зурлаа
    .vertical = бодоо зурлаа
    .diagonal = диагональ зурлаа
    .backdiagonal = харша диагональ зурлаа
    .dots = сэг
    .diamonds = ромб

noun =
    .line = сэхэ зурлаа
    .line-segment = хэрчим
    .ray = сасараг
    .vector = вектор
    .curve = муруй зурлаа
    .function = функци
    .parabola = парабола
    .polyline = хухарһан зурлаа
    .polygon = олон талата
    .triangle = гурбалжан
    .rectangle = тэгшэ дүрбэлжэн
    .circle = тойрог
    .region = можо
    .point = сэг
    .square = дүрбэлжэн
    .diamond = ромб
    .cross = хэрээһэн
    .plus = плюс

# Buryat builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] тэгшэ { $numSides } талата
    }

# Buryat has no grammatical gender, so every noun answers the same and the
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

style-filled-word = будагдаһан

style-filled =
    { $parts ->
        [pattern] { $pattern } хээтэй { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } хээтэй { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } хээтэй { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «хизаартай» — "having an edge" — carries the "with a border" sense in its own
# suffix, so neither a preposition nor an article is wanted.
style-border-clause =
    { $parts ->
        [with-article] { $border } хизаартай
        [and] ба { $border } хизаартай
        [and-article] ба { $border } хизаартай
       *[with] { $border } хизаартай
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } хээтэй { $color } будаг
       *[plain] { $color } будаг
    }

style-unfilled = будагдаагүй

# «дээрэ» — "on top of" — is a postposition and follows the background colour,
# so nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } дэбисхэр дээрэ { $color }
       *[plain] { $color }
    }

style-background-none = үгы


## Boolean words

boolean-true = үнэн
boolean-false = худал


## Answer buttons

answer-submit-label = Шалгаха
answer-submit-label-no-correctness = Харюу эльгээхэ


## Sectional blocks

section-name =
    .activity = Хүдэлмэри
    .aside = Хажуугай тэмдэглэл
    .cascade = Каскад
    .definition = Тодорхойлолто
    .example = Жэшээ
    .exercise = Дасхал
    .exercises = Дасхалнууд
    .given-answer = Харюу
    .note = Тэмдэглэл
    .objectives = Зорилгонууд
    .paragraphs = Абзацууд
    .part = Хуби
    .problem = Бодолго
    .problems = Бодолгонууд
    .proof = Баталга
    .question = Асуудал
    .section = Бүлэг
    .solution = Шиидхэбэри
    .task = Даабари
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

hint-title = Заабари


## Tables and figures

table-name =
    { $parts ->
        [numbered] Хүснэгтэ { $enumeration }
        [numbered-title] Хүснэгтэ { $enumeration }{ ". " }
        [unnumbered-title] Хүснэгтэ{ ". " }
       *[unnumbered] Хүснэгтэ
    }

figure-name =
    { $parts ->
        [numbered] Зураг { $enumeration }
        [numbered-caption] Зураг { $enumeration }{ ". " }
        [unnumbered-caption] Зураг{ ". " }
       *[unnumbered] Зураг
    }


## Paginator controls

paginator-previous = Урдахи
paginator-next = Дараахи
paginator-page = Нюур

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions
##
## Buryat's conditional «хэрбээ» is a clause-*initial* particle, unlike the
## clause-final converbs `locales/sah` and `locales/tyv` record a limit for, so
## this key lands where the renderer puts it and reads correctly. Two Mongolic
## and Turkic neighbours, two different answers to the same question.

piecewise-condition-or = али
piecewise-condition-if = хэрбээ
piecewise-condition-otherwise = үгы һаа


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Buryatia is taught in
## Russian, so the element names a Buryat-speaking pupil meets are the Russian
## ones — the school-system case this batch shares throughout.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Буруу химическэ тэмдэг
chemistry-invalid-ionic-compound = Буруу ионой холбоо
