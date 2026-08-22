# Erzya content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic, which is the orthography Mordovia's schools and
# publishing use and what CLDR fills a bare `myv` in as.
#
# **Erzya and Moksha are two languages, not two spellings of one.** ISO 639-3
# gives them `myv` and `mdf` separately, there is no macrolanguage code over
# them that this repository could name a catalog after, and a Moksha reader
# arriving under `mdf` therefore reaches English rather than this file. That is
# the membership rule in `negotiate.ts` working rather than a gap in it — the
# same place `fat` and `alq` land — and the answer to it is a `locales/mdf`
# beside this one, not a widening of this one.
#
# Erzya has no grammatical gender and does not inflect an attributive
# adjective, so `$gender` and `$role` go unused — the answer every non-Nakh
# catalog in this batch gives.


## Style vocabulary

color =
    .black = раужо
    .white = ашо
    .gray = серой
    .red = якстере
    .orange = тюжа
    .yellow = ожо
    .green = пиже
    .cyan = валдо сэнь
    .blue = сэнь
    .purple = фиолетовой
    .pink = розовой
    .brown = коричневой
line-width =
    .thick = эчке
    .thin = човине
line-style =
    .dashed = сезнезь
    .dotted = точкань
# Noun phrases: they stand in front of «мазылгавтомасо» and modify nothing.
fill-style =
    .horizontal = горизонтальной линия
    .vertical = вертикальной линия
    .diagonal = диагональной линия
    .backdiagonal = каршо диагональной линия
    .dots = точка
    .diamonds = ромб
noun =
    .line = виде линия
    .line-segment = пелькске
    .ray = луч
    .vector = вектор
    .curve = кичкере линия
    .function = функция
    .parabola = парабола
    .polyline = синдезь линия
    .polygon = ламо ужо
    .triangle = колмо ужо
    .rectangle = виде ужо
    .circle = круг
    .region = тарка
    .point = точка
    .square = квадрат
    .diamond = ромб
    .cross = крёст
    .plus = плюс
# Erzya builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] видестэ { $numSides } ужо
    }
# Erzya has no grammatical gender, so every noun answers the same and the
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
style-filled-word = артозь
style-filled =
    { $parts ->
        [pattern] { $pattern } мазылгавтомасо { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } мазылгавтомасо { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } мазылгавтомасо { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «чиресэ» is the inessive of «чире», "edge", and carries the whole of "with a
# border" in its own suffix — the same shape `locales/udm` and `locales/kv`
# use, arriving from the other end of Uralic.
style-border-clause =
    { $parts ->
        [with-article] { $border } чиресэ
        [and] ды { $border } чиресэ
        [and-article] ды { $border } чиресэ
       *[with] { $border } чиресэ
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } мазылгавтомасо { $color } артома
       *[plain] { $color } артома
    }
style-unfilled = апак арта
# «лангсо» — "on" — is a postposition and follows the background colour, so
# nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } фон лангсо { $color }
       *[plain] { $color }
    }
style-background-none = арась

## Boolean words

boolean-true = виде
boolean-false = а виде

## Answer buttons

answer-submit-label = Ванномс
answer-submit-label-no-correctness = Каршо валонть кучомс

## Sectional blocks

section-name =
    .activity = Тев
    .aside = Ёно тешкстамо
    .cascade = Каскад
    .definition = Мерема
    .example = Невтевкс
    .exercise = Упражнения
    .exercises = Упражненият
    .given-answer = Каршо вал
    .note = Тешкстамо
    .objectives = Цельть
    .paragraphs = Абзацт
    .part = Пелькс
    .problem = Задача
    .problems = Задачат
    .proof = Кемекстамо
    .question = Кевкстема
    .section = Пелькске
    .solution = Решения
    .task = Задания
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
hint-title = Невтевкске

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
        [numbered] Артовкс { $enumeration }
        [numbered-caption] Артовкс { $enumeration }{ ". " }
        [unnumbered-caption] Артовкс{ ". " }
       *[unnumbered] Артовкс
    }

## Paginator controls

paginator-previous = Икелень
paginator-next = Сы
paginator-page = Лопа
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## Erzya's conditional «бути» is clause-initial, as Buryat's and Kalmyk's are,
## so this key lands where the renderer puts it — unlike the two Permic
## catalogs beside it, `locales/udm` and `locales/kv`, whose «ке» and «кӧ»
## follow their clause and record a limit there — as `locales/chm`'s «гын»
## does too. Four Uralic catalogs in one batch, three of them recording the
## limit and this one not, so word order rather than family decides.

piecewise-condition-or = эли
piecewise-condition-if = бути
piecewise-condition-otherwise = лия таркава

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Mordovia is taught in
## Russian, so the element names an Erzya-speaking pupil meets are the Russian
## ones — the school-system case this batch shares throughout.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = А виде химиянь тешкс
chemistry-invalid-ionic-compound = А виде иононь сюлмавкс
