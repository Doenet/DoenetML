# Adyghe (West Circassian) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with Ӏ (palochka), which is the orthography Adygea's
# schools, its publishing and CLDR all use — `ady` maximizes to `ady-Cyrl-RU`.
# The palochka is a letter of the alphabet, not a Latin capital I and not a
# digit 1, and Adyghe leans on it harder than most: шӀуцӀэ, Ӏужъу, пӀуакӀэ,
# ӀофшӀэн, УпчӀэ and шхъуантӀэ are all ordinary words. A catalog that spells
# any of them with `I` or `1` has quietly become unreadable, and the two look
# alike enough in most editor fonts that nothing on screen would say so.
#
# **Adyghe has no grammatical gender and no noun class**, and an attributive
# adjective does not agree with its head in anything. So `noun-gender` returns
# one token, nothing forks on `$gender`, and nothing forks on `$role` either —
# what a clause position asks for in Adyghe lands as a suffix on a *noun*, and
# every noun a position lands on is one this catalog writes out («гъунэ»,
# «фон»). That is the flat answer eleven of the twelve Cyrillic catalogs
# already give; Adyghe is Northwest Caucasian and gives it too, so the Nakh
# class system in `locales/ce` stays the exception rather than a Caucasian
# trait.
#
# **Word order is where this catalog differs from every Cyrillic one beside
# it, and it is the thing to check first.** Adyghe splits its modifiers in
# two:
#
#   * a *qualitative* adjective FOLLOWS its noun — «линие занкӀэ», a straight
#     line; «гъунэ Ӏужъу плъыжьы», a thick red border;
#   * a *relational* modifier, itself a noun, PRECEDES it as a compound —
#     «горизонталь линиехэр», «вектор поле».
#
# So `style-with-noun` and `style-filled-with-noun` put the noun first and the
# description after it, which is the reverse of English and of `locales/ba`
# and `locales/ce`, while `fill-style`'s phrases keep the English order for
# the opposite reason.
#
# **The limit that order runs into is recorded rather than papered over.** A
# postnominal qualitative adjective in Adyghe is normally written *together*
# with its noun as one word — «унэшхо», a big house — and the noun here is
# `{ $noun }`, a placeable this catalog never sees. There is no reaching
# inside a placeable to weld anything to it, so every description below writes
# the adjective as a separate word after the noun. That is grammatical and
# legible, and it is one space away from the compound a speaker would write.
# Splitting the noun would not fix it either: the affix belongs to whatever
# word lands last, and that word is a placeable too.
#
# **The colour terms are a choice and not a translation.** «шхъуантӀэ» covers
# green and blue together — the Circassian colour the style pipeline has no
# single slot for — and «шхъо» covers grey and a pale blue. The pipeline needs
# green, cyan and blue as three separate words, so this catalog assigns
# «шхъуантӀэ» to blue and writes the transparent compound «уцышъо»
# (grass-colour) for green, as `locales/sah` writes «от күөх» for Sakha's
# «күөх» and `locales/os` writes «кæрдæгхуыз» for Ossetian's «цъæх». Orange,
# purple and pink are written as two-colour compounds for the same reason.
# A speaker should expect to change these first.
#
# **The geometric vocabulary is the least certain thing in the file.** Adygea
# teaches secondary mathematics in Russian, so a pupil meets «отрезок»,
# «вектор» and «парабола» rather than a native coinage, and this catalog
# writes the Russian term wherever it could not check a native one. Where a
# native word is confident it is used — «хъурай» for circle, «чӀыпӀэ» for
# region, «джор» for cross, «лъэныкъуабэ» and «лъэныкъуищ» built on
# «лъэныкъо», side. Which of those a speaker would actually accept is exactly
# what this seed could not verify.


## Style vocabulary
##
## Nothing here agrees with anything, so nothing forks. Qualitative adjectives
## (colours, widths, dash patterns) are written in the form that follows a
## noun; the fill patterns are noun phrases and precede nothing.

color =
    .black = шӀуцӀэ
    .white = фыжьы
    .gray = шхъо
    .red = плъыжьы
    .orange = гъожьы-плъыжьы
    .yellow = гъожьы
    .green = уцышъо
    .cyan = шхъуантӀэ нэфы
    .blue = шхъуантӀэ
    .purple = плъыжьы-шхъуантӀэ
    .pink = плъыжьы-фыжьы
    .brown = гъуабжэ
line-width =
    .thick = Ӏужъу
    .thin = пӀуакӀэ
line-style =
    .dashed = зэпыугъэ
    .dotted = точкэ зэхэлъ
# Noun phrases, not adjectives: the relational word precedes its head here,
# which is the opposite of what the colours and widths above do.
fill-style =
    .horizontal = горизонталь линиехэр
    .vertical = вертикаль линиехэр
    .diagonal = диагональ линиехэр
    .backdiagonal = къэгъэзэжьыгъэ диагональ линиехэр
    .dots = точкэхэр
    .diamonds = ромбхэр
noun =
    .line = линие занкӀэ
    .line-segment = отрезок
    .ray = луч
    .vector = вектор
    .curve = кривая
    .function = функцие
    .slope-field = наклон поле
    .vector-field = вектор поле
    .parabola = парабола
    .polyline = ломаная
    .polygon = лъэныкъуабэ
    .triangle = лъэныкъуищ
    .rectangle = прямоугольник
    .circle = хъурай
    .region = чӀыпӀэ
    .point = точкэ
    .square = квадрат
    .diamond = ромб
    .cross = джор
    .plus = плюс
# The side count folds into the head, so there is no tail. Adyghe normally
# puts a numeral *after* the noun it counts — «лъэныкъуищ», three sides — and
# that construction cannot be built around `{ $numSides }`, which arrives as a
# formatted number rather than as a word this catalog could suffix. So the
# count is written in front of the noun as a compound, the way a Russian
# loan-formation would, and «тэрэз» follows the noun as a qualitative
# adjective should.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-лъэныкъуабэ тэрэз
    }
# Adyghe has no gender and no noun class, so every noun answers the same and
# the answer goes unused — as in English, Bashkir and Ossetian, and unlike
# `locales/ce` beside it.
noun-gender = neuter


## Style composition
##
## The noun leads and its adjectives follow, which is the reverse of the
## English frame. See the note at the top of this file about the compound the
## adjective would form with the noun if the noun were a word rather than a
## placeable.

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
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word = гъэзыгъэ
# «теплъэкӀэ» — "in the appearance of" — carries the instrumental suffix on a
# word this catalog writes, so nothing is welded to `{ $pattern }`.
style-filled =
    { $parts ->
        [pattern] { $pattern } теплъэкӀэ { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } теплъэкӀэ { $noun } { $color } { $filled }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $pattern } теплъэкӀэ { $noun } { $nounTail } { $color } { $filled }
       *[plain] { $noun } { $color } { $filled }
    }
# «гъунэ … зиӀэ» — "having an edge that is …" — puts the noun first and the
# adjectives after it, so the border's description lands in Adyghe's own
# order and no article is wanted. The four branches differ only in the
# connective English needs and Adyghe does not.
style-border-clause =
    { $parts ->
        [with-article] гъунэ { $border } зиӀэ
        [and] ыкӀи гъунэ { $border } зиӀэ
        [and-article] ыкӀи гъунэ { $border } зиӀэ
       *[with] гъунэ { $border } зиӀэ
    }
# The pattern is the head noun here and the colour follows it, which is why
# this message reverses English rather than repeating `style-filled`'s shape.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = мыгъэзыгъэ
# «фон … зиӀэ» is the same construction `style-border-clause` uses, and for
# the same reason: the suffix falls on «фон», a word this catalog writes.
style-text =
    { $parts ->
        [background] фон { $background } зиӀэ { $color }
       *[plain] { $color }
    }
style-background-none = щыӀэп


## Boolean words

boolean-true = шъыпкъ
boolean-false = пцӀы


## Answer buttons

answer-submit-label = УплъэкӀун
answer-submit-label-no-correctness = Джэуапыр гъэкӀон


## Sectional blocks

section-name =
    .activity = ӀофшӀэн
    .aside = ГущыӀэ гуадзэ
    .cascade = Каскад
    .definition = Гъэнэфэныгъ
    .example = Щысэ
    .exercise = Упражнение
    .exercises = Упражнениехэр
    .given-answer = Джэуап
    .note = ХэгъэунэфыкӀыгъ
    .objectives = Пшъэрылъхэр
    .paragraphs = Абзацхэр
    .part = Ӏахь
    .problem = Задачэ
    .problems = Задачэхэр
    .proof = Гъэшъыпкъэжьын
    .question = УпчӀэ
    .section = Пычыгъо
    .solution = ЗэшӀохыгъ
    .task = Ӏоф
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
hint-title = ӀэпыӀэгъу


## Tables and figures

table-name =
    { $parts ->
        [numbered] Таблицэ { $enumeration }
        [numbered-title] Таблицэ { $enumeration }{ ". " }
        [unnumbered-title] Таблицэ{ ". " }
       *[unnumbered] Таблицэ
    }
figure-name =
    { $parts ->
        [numbered] Сурэт { $enumeration }
        [numbered-caption] Сурэт { $enumeration }{ ". " }
        [unnumbered-caption] Сурэт{ ". " }
       *[unnumbered] Сурэт
    }


## Paginator controls

paginator-previous = Ыпэрэ
paginator-next = Ыужырэ
paginator-page = НэкӀубгъо
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions
##
## `piecewise-condition-if` is placed by the renderer *before* the mathematics
## it introduces, and Adyghe cannot put a word there. The conditional in
## Adyghe is a verbal suffix, -мэ, and the free form built on it — «хъумэ»,
## "if it is so" — closes the clause it conditions rather than opening it. So
## the word below lands on the wrong side of its mathematics, exactly as
## `locales/sah`, `locales/tyv`, `locales/udm`, `locales/kv` and `locales/chm`
## record for their own clause-final conditionals. Splitting the key into a
## prefix and a suffix would fix it; nothing here can, and inventing a
## clause-initial particle Adyghe does not have would be worse than a limit
## written down.

piecewise-condition-or = е
piecewise-condition-if = хъумэ
piecewise-condition-otherwise = нэмыкӀэу


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Adygea is taught in
## Russian, so the element names an Adyghe-speaking pupil meets are the
## Russian ones, and the English fallback beside a Russian textbook is nearer
## the curriculum than 118 unreviewed coinages would be — the school-system
## case this batch and the Cyrillic batch before it share throughout.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Химическэ символ мытэрэз
chemistry-invalid-ionic-compound = Ионнэ зэхэлъ мытэрэз
