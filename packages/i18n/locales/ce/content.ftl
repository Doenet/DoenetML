# Chechen content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with Ӏ (palochka), which is the orthography Chechnya's
# schools and publishing use and what CLDR fills a bare `ce` in as. The
# palochka is a letter, not a Latin capital I and not a digit 1; a catalog that
# spells «Ӏаьржа» with either has quietly become unreadable.
#
# **THIS IS THE ONE CATALOG IN ITS BATCH THAT SELECTS ON `$gender`, AND THAT IS
# THE FACT WORTH READING.** Every other language seeded beside it — four
# Turkic, two Mongolic, four Uralic, one Iranian — answers the agreement
# question with a flat "no". Chechen is Nakh, and it has a real grammatical
# class system: nouns fall into classes marked by the prefixes в-, й-, б- and
# д-, and a word agreeing with a noun carries its class at the *front*. So
# `noun-gender` returns a class here rather than one token, and the words that
# agree fork on it. Eleven catalogs in one region and one script, and the
# twelfth forks — which is the sentence `locales/ts` and `locales/ktu` already
# earned inside Bantu, restated in the Caucasus. (`locales/luo` is the mirror
# image and not a third example: Dholuo sits between two Bantu catalogs that
# fork on three classes each and selects on neither argument.)
#
# **What agrees is a much shorter list than in a Bantu catalog, and the header
# has to be honest about which part of this file is confident.** Chechen's
# colour and width adjectives — «Ӏаьржа», «дуькъа», «дораха» — are
# non-agreeing: they take no class prefix and hold still after every noun, so
# the style vocabulary below forks nowhere. What does agree is the participle
# «дуьзна», "filled", and `style-filled-word` is the one message where
# `$gender` is used. Its negation agrees too, in the language — but
# `style-unfilled` is rendered with no arguments at all (`describeFill` has no
# noun to hand it when there is nothing filled), so the catalog cannot select
# there and writes the д-class form flat, as every other agreeing catalog in
# the roster does.
#
# **`noun-gender`'s table is the least certain thing here and a speaker should
# check it first.** This seed could verify the four class markers and the
# agreeing forms of the participle; it could not verify the class of every
# geometric noun it needed, and a half-remembered class table is worse than an
# admitted gap — the judgement `locales/ewo` made for Ewondo and `locales/ks`
# made for Kashmiri's feminine forms. So the table below lists only the nouns
# whose class this seed is reasonably confident of and defaults everything else
# to `d`, the largest class. Correcting an entry needs no permission, and the
# fork it feeds is already written.


## Style vocabulary
##
## None of these words takes a class prefix, so none of them forks. That is a
## fact about Chechen adjectives rather than about Chechen agreement.

color =
    .black = Ӏаьржа
    .white = кӀайн
    .gray = сира
    .red = цӀен
    .orange = цӀен-можа
    .yellow = можа
    .green = баьццара
    .cyan = сирла сийна
    .blue = сийна
    .purple = сийна-цӀен
    .pink = цӀен-кӀайн
    .brown = мора

line-width =
    .thick = дуькъа
    .thin = дораха

line-style =
    .dashed = кагйина
    .dotted = тӀадамашца

# Noun phrases: they stand in front of «сурташца» and modify nothing.
fill-style =
    .horizontal = горизонталан сиз
    .vertical = вертикалан сиз
    .diagonal = диагоналан сиз
    .backdiagonal = дуьхьал диагоналан сиз
    .dots = тӀадам
    .diamonds = ромб

noun =
    .line = нийса сиз
    .line-segment = сизан дакъа
    .ray = луч
    .vector = вектор
    .curve = къевлина сиз
    .function = функци
    .parabola = парабола
    .polyline = кагйина сиз
    .polygon = дукха сонера
    .triangle = кхо сонера
    .rectangle = нийса сонера
    .circle = гуо
    .region = меттиг
    .point = тӀадам
    .square = квадрат
    .diamond = ромб
    .cross = жӀар
    .plus = плюс

# Chechen builds the word from the side count in front of the noun, so the
# whole of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] нийса { $numSides } сонера
    }

# The class of the noun being described, handed to every word that agrees with
# it. See the note at the top of this file: only the entries this seed could
# check are written out, and everything else falls to `d`.
noun-gender =
    { $noun ->
        [point] b
        [square] b
        [cross] b
        [circle] d
        [line] d
        [line-segment] d
        [ray] d
        [border] d
        [fill] d
        [text] d
        [background] d
       *[other] d
    }


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

# The one word in this catalog that carries a class prefix, and the reason
# `$gender` exists here at all.
style-filled-word =
    { $gender ->
        [b] буьзна
        [j] юьзна
        [v] вуьзна
       *[d] дуьзна
    }

style-filled =
    { $parts ->
        [pattern] { $pattern } сурташца { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } сурташца { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } сурташца { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «йистеца» — "with an edge" — is a case form of a noun this catalog writes, so
# nothing is welded to a placeable and no article is wanted.
style-border-clause =
    { $parts ->
        [with-article] { $border } йистеца
        [and] а { $border } йистеца
        [and-article] а { $border } йистеца
       *[with] { $border } йистеца
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } сурташца { $color } бос
       *[plain] { $color } бос
    }

# The negated participle agrees in the language exactly as the positive one
# does — «буьзна боцу», «юьзна йоцу», «вуьзна воцу» — but this message
# describes a fill standing on its own, with no noun and therefore no
# `$gender` reaching it. So the д-class form is written flat, and a fork here
# would only ever render its default branch.
style-unfilled = дуьзна доцу

# «тӀехь» — "on" — is a postposition and follows the background colour, so
# nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } фон тӀехь { $color }
       *[plain] { $color }
    }

style-background-none = дац


## Boolean words

boolean-true = бакъ
boolean-false = харц


## Answer buttons

answer-submit-label = Таллар
answer-submit-label-no-correctness = Жоп дӀадахьийта


## Sectional blocks

section-name =
    .activity = ГӀуллакх
    .aside = АгӀор билгалдар
    .cascade = Каскад
    .definition = Билгалдаккхар
    .example = Масал
    .exercise = Упражнени
    .exercises = Упражненеш
    .given-answer = Жоп
    .note = Билгалдар
    .objectives = Ӏалашонаш
    .paragraphs = Абзацаш
    .part = Дакъа
    .problem = Задача
    .problems = Задачаш
    .proof = ТӀечӀагӀдар
    .question = Хаттар
    .section = Корта
    .solution = Сацам
    .task = Дехар
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

hint-title = Хьехам


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
        [numbered] Сурт { $enumeration }
        [numbered-caption] Сурт { $enumeration }{ ". " }
        [unnumbered-caption] Сурт{ ". " }
       *[unnumbered] Сурт
    }


## Paginator controls

paginator-previous = Хьалха
paginator-next = ТӀаьхьа
paginator-page = АгӀо

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions
##
## Chechen's conditional «нагахь санна» is clause-initial, so this key lands
## where the renderer puts it, as `locales/os`, `locales/bua`, `locales/xal`
## and `locales/myv` do and unlike the five catalogs of this batch whose
## conditional closes its clause.

piecewise-condition-or = я
piecewise-condition-if = нагахь санна
piecewise-condition-otherwise = кхечу агӀор


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Chechnya is taught in
## Russian, so the element names a Chechen-speaking pupil meets are the Russian
## ones — the school-system case this batch shares throughout.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Нийса доцу химин хьаьрк
chemistry-invalid-ionic-compound = Нийса доцу ионан цхьаьнакхетар
