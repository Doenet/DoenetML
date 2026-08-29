# Dargwa content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Dargwa is a diverse group of varieties, and this catalog is the
# Akusha-based literary standard** — the norm Dagestan's schools teach, the
# republic's Dargwa press is set in, and CLDR fills a bare `dar` in as
# (`dar-Cyrl-RU`). Kajtag, Kubachi, Itsari, Chirag, Megeb and Sirhwa Dargwa
# differ from it far enough that several are counted as separate languages by
# linguists who work on them; a reader from one of those is being served the
# Akusha standard here, and this file does not pretend otherwise.
#
# Written in Cyrillic. The palochka Ӏ is a letter — not a Latin capital I, not
# a digit 1.
#
# **Dargwa has a grammatical class system, and the interesting thing about it
# is that this catalog still forks almost nowhere.** Dargwa nouns fall into
# three singular classes marked by в- (class I, male humans), р- (class II,
# female humans) and б- (class III, everything else), with б-/д- in the plural.
# Unlike Chechen's six lexical classes, the Dargwa split is *semantically
# transparent*: a noun is class III precisely because it is not a person. Every
# noun the core ever names — a line, a circle, a border, a fill, a background —
# is a thing, so all of them are class III, and `noun-gender` therefore answers
# `b` for the whole roster with nothing to select between. It is written flat
# below for that reason, not because the class system was skipped.
#
# **One word here genuinely agrees, and it is the participle, not the
# adjectives.** Dargwa colour and size adjectives — «цӀудара», «хӀунтӀена»,
# «халаси» — take no class prefix and hold still in front of any noun, so the
# style vocabulary forks nowhere. «бицӀибси», *filled*, is a participle of
# «бицӀес», and its first letter *is* the class marker: «вицӀибси» of a man,
# «рицӀибси» of a woman, «бицӀибси» of a thing. So `style-filled-word` is
# written as a real fork on `$gender`, with the understanding that only its
# `[b]` branch can be reached from this catalog's own `noun-gender` — it is
# written and waiting, the way `locales/ce` leaves its own table waiting.
#
# `style-unfilled` is the message that would agree and cannot: `describeFill`
# renders it with no arguments at all, so no noun and therefore no `$gender`
# ever reaches it. The class-III form is written flat, as every other agreeing
# catalog in the roster does for that message.
#
# **Dargwa attributive adjectives stand before the noun** (the language is
# consistently head-final), so the style descriptions below run in the same
# order English does — width, dash, colour, noun — and that is Dargwa's own
# order rather than English's showing through.
#
# **The colour table is the least certain thing in this file.** Five of the
# twelve are native words this seed can stand behind: «цӀудара» black, «цӀуба»
# white, «хӀунтӀена» red, «шиниша» green and «хьанцӀа» blue. «шиниша» does not
# split where the style pipeline splits — traditionally it covers the green and
# blue range together, and «хьанцӀа» is the blue side of it — so the two
# entries below are a modern narrowing rather than a translation. The other
# seven are written as the Russian colour words a Dargwa speaker schooled in
# Russian actually reaches for; a speaker who knows the native terms should
# replace them, and that is the single most valuable edit this file can
# receive.
#
# The geometric nouns are the Russian ones for the same reason the chemistry
# table is missing: school mathematics in Dagestan is taught in Russian, so
# these are the words a Dargwa-speaking pupil has actually met. Where a Dargwa
# word exists and is ordinary — «мер» for a region, «бутӀа» for a part, «дуб»
# for an edge — it is used.


## Style vocabulary
##
## None of these adjectives takes a class prefix, so none of them forks. That
## is a fact about Dargwa adjectives, not about Dargwa agreement.

color =
    .black = цӀудара
    .white = цӀуба
    .gray = сераси
    .red = хӀунтӀена
    .orange = оранжевый
    .yellow = жёлтый
    .green = шиниша
    .cyan = голубой
    .blue = хьанцӀа
    .purple = фиолетовый
    .pink = розовый
    .brown = коричневый
line-width =
    .thick = халаси
    .thin = биштӀаси
line-style =
    .dashed = кӀапӀбикибси
    .dotted = точкабала
# Noun phrases: they stand in front of «суратуначил» in the composing messages
# below and modify nothing, so they carry no agreement of their own.
fill-style =
    .horizontal = горизонталла линиуни
    .vertical = вертикалла линиуни
    .diagonal = диагоналла линиуни
    .backdiagonal = гӀелабси диагоналла линиуни
    .dots = точкаби
    .diamonds = ромбуни
noun =
    .line = линия
    .line-segment = линияла бутӀа
    .ray = луч
    .vector = вектор
    .curve = кривая
    .function = функция
    .slope-field = наклонна майдан
    .vector-field = векторла майдан
    .parabola = парабола
    .polyline = ломаная
    .polygon = многоугольник
    .triangle = треугольник
    .rectangle = прямоугольник
    .circle = окружность
    .region = мер
    .point = точка
    .square = квадрат
    .diamond = ромб
    .cross = крест
    .plus = плюс
# Dargwa puts the side count in front of the noun, as it puts every other
# modifier there, so the whole of the phrase is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } дубла бархьси многоугольник
    }
# The class of the noun being described. Dargwa's classes are semantic — male
# human, female human, everything else — and every noun the core names is a
# thing, so all of them answer class III and there is nothing to select
# between. Written flat for that reason; see the note at the top of this file.
noun-gender = b

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
# The one word in this catalog whose first letter is a class marker. Only the
# `[b]` branch is reachable from `noun-gender` above, because everything the
# core describes is a thing; the other two are written out so that a speaker
# who extends the table finds them already correct.
style-filled-word =
    { $gender ->
        [v] вицӀибси
        [r] рицӀибси
       *[b] бицӀибси
    }
# «суратуначил» — "with the figures" — is a word this catalog writes, standing
# after the pattern name so that the comitative ending lands on it rather than
# being welded onto a value the catalog never sees.
style-filled =
    { $parts ->
        [pattern] { $pattern } суратуначил { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } суратуначил { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } суратуначил { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «дубличил» — "with an edge" — is a case form of a noun this catalog writes,
# so nothing is welded to a placeable, and Dargwa wants no article.
style-border-clause =
    { $parts ->
        [with-article] { $border } дубличил
        [and] ва { $border } дубличил
        [and-article] ва { $border } дубличил
       *[with] { $border } дубличил
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } суратуначил { $color } ранг
       *[plain] { $color } ранг
    }
# The negated participle agrees in the language exactly as the positive one
# does — «вицӀибси ахӀенси», «рицӀибси ахӀенси» — but this message describes a
# fill standing on its own, and `describeFill` hands it no noun and therefore
# no `$gender`. The class-III form is written flat; a fork here could only ever
# render its own default.
style-unfilled = бицӀибси ахӀенси
# «фонничиб» — "on the background" — is a locative on a word this catalog
# writes, and it precedes the colour because Dargwa modifiers precede.
style-text =
    { $parts ->
        [background] { $background } фонничиб { $color }
       *[plain] { $color }
    }
style-background-none = агара

## Boolean words

boolean-true = бархьси
boolean-false = къяна

## Answer buttons

answer-submit-label = Ахтарбара
answer-submit-label-no-correctness = Жаваб бархьа

## Sectional blocks

section-name =
    .activity = ХӀянчи
    .aside = Шалила белкӀ
    .cascade = Каскад
    .definition = Баян
    .example = Мисал
    .exercise = Упражнение
    .exercises = Упражнениеби
    .given-answer = Жаваб
    .note = БелкӀ
    .objectives = Мурадуни
    .paragraphs = Абзацуни
    .part = БутӀа
    .problem = Масъала
    .problems = Масъалаби
    .proof = Далил
    .question = Суал
    .section = БекӀ
    .solution = Решение
    .task = Задание
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
hint-title = Гьанбушни

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
        [numbered] Сурат { $enumeration }
        [numbered-caption] Сурат { $enumeration }{ ". " }
        [unnumbered-caption] Сурат{ ". " }
       *[unnumbered] Сурат
    }

## Paginator controls

paginator-previous = Гьалаб
paginator-next = ГӀергъи
paginator-page = БяхӀ
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## Dargwa's own conditional is a *suffix* on the verb — «-алли» — and it closes
## the clause it conditions, which is the shape `locales/sah`, `locales/tyv`,
## `locales/udm`, `locales/kv` and `locales/chm` record for their own
## conditionals. What saves this key is that Dargwa also has the borrowed
## clause-initial conjunction «эгер», which opens the clause the way the
## renderer needs and which is what is written below. There is no verb in the
## mathematics that follows for «-алли» to sit on, so «эгер» is not a
## workaround here but the only available construction; a speaker should still
## know that the bare conjunction without its suffix reads as an incomplete
## conditional in ordinary Dargwa prose.

piecewise-condition-or = яра
piecewise-condition-if = эгер
piecewise-condition-otherwise = цархӀилли

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Dagestan is taught in
## Russian, so a Dargwa-speaking pupil meets the Russian element names in their
## own textbook and has never met a Dargwa list; inventing 118 coinages here
## would put something in front of them that no classroom, no dictionary and no
## examination uses, and would be further from their curriculum than the
## English fallback is.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Бархьси ахӀенси химияла лишан
chemistry-invalid-ionic-compound = Бархьси ахӀенси ионтала цалабикни
