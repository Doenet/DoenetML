# Avar content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Avar (авар мацӀ, also магӀарул мацӀ) is the largest literary language of
# Dagestan. Written here in the Cyrillic orthography with the palochka Ӏ — the
# standard the republic's schools, the Makhachkala publishing houses and the
# newspaper «ХӀакъикъат» use, and what CLDR fills a bare `av` in as
# (`av-Cyrl-RU`). The palochka is a letter of the alphabet: it is neither a
# Latin capital I nor a digit 1, and a file that spells «чӀегӀераб» with either
# has quietly stopped being Avar.
#
# Avar counts in two plural categories, `one` and `other`, so nothing in this
# file needed a category English does not have.
#
# **Avar has a real grammatical class system, it reaches further than Chechen's
# does, and this catalog still forks nowhere. That combination is the fact
# worth reading.** Avar nouns fall into three classes in the singular — в for
# male humans, й for female humans, б for everything else — plus a plural in л,
# and an agreeing word carries the marker as a *suffix*: «чӀегӀерав чи» a black
# man, «чӀегӀерай чӀужу» a black woman, «чӀегӀераб мухъ» a black line,
# «чӀегӀерал мухъал» black lines. That is already two differences from
# `locales/ce`, which is the nearest catalog on the roster: Chechen carries its
# class marker at the *front* of the word, and Chechen's colour and width
# adjectives do not agree at all, so only the participle «дуьзна» forks there.
# Every adjective written below agrees in Avar.
#
# **And every one of them is written flat, because only one class is
# reachable.** `noun-gender` answers the class of the noun being described, and
# every noun this core names — a line, a point, a square, a border, a fill, a
# text, a background — is a thing rather than a person, so all of them are
# class III and all of them answer `b`. A `{ $gender -> [v] … [j] … *[b] … }`
# here would be writing three branches nothing can select, which is the
# reachability rule `locales/ve`, `locales/ts`, `locales/ki` and `locales/bem`
# already apply to their own unreached noun classes. So the file returns one
# token and reads like a catalog with no agreement — while the agreement is in
# fact everywhere, spelled once.
#
# What a speaker needs in order to change that is small and worth naming here:
# the other forms of every adjective below are the same word with -в, -й or -л
# in place of the final -б (чӀегӀера-в, чӀегӀера-й, чӀегӀера-л), and the
# participle «цӀураб» is «цӀурав», «цӀурай», «цӀурал». If a class I or II noun
# ever enters the table above `noun-gender`, that is all the fork costs.
#
# **The colour table is the least certain thing in this file.** Avar's basic
# colour terms are the six written out plainly — чӀегӀераб, хъахӀаб, багӀараб,
# тӀогьилаб, гӀурччинаб, хъахӀилаб — and the style pipeline asks for twelve. So
# grey, orange, cyan, purple, pink and brown are written here as transparent
# two-part compounds. Those are this seed's coinages rather than attested
# words, they are the first thing a speaker should replace, and replacing one
# costs a single line.
#
# **The geometric nouns are the Russian school terms, and that is deliberate.**
# Secondary mathematics in Dagestan is taught in Russian, so «квадрат»,
# «ромб», «треугольник», «многоугольник», «парабола», «вектор», «луч» and
# «функция» are the words an Avar-speaking pupil actually meets for these
# shapes — the same argument the chemistry section at the foot of this file
# makes, applied to geometry. Where Avar has an everyday word that carries the
# meaning without help — «мухъ» a line, «тӀанкӀ» a point, «бакӀ» a place,
# «рагӀал» an edge, «кьер» a colour — that word is used instead.
#
# Attributive adjectives precede their noun in Avar, as they do in English, and
# the width–dash–colour order of `style-stroke` is kept as English has it.


## Style vocabulary
##
## Every adjective here agrees with its noun in Avar, and every one is written
## in the class III (-б) form, because that is the only class `noun-gender` can
## answer. See the header: this is one class spelled out, not an absence of
## agreement.

# The six plain terms are Avar's own basic colours; the six compounds are this
# seed's coinages and are the least certain lines in the file.
color =
    .black = чӀегӀераб
    .white = хъахӀаб
    .gray = хъахӀ-чӀегӀераб
    .red = багӀараб
    .orange = багӀар-тӀогьилаб
    .yellow = тӀогьилаб
    .green = гӀурччинаб
    .cyan = гӀурччин-хъахӀилаб
    .blue = хъахӀилаб
    .purple = багӀар-хъахӀилаб
    .pink = багӀар-хъахӀаб
    .brown = чӀегӀер-багӀараб
# Avar has no specialized pair for the thickness of a drawn line, so the
# general "big" and "small" adjectives carry it. Both agree, and both are
# written in class III for the reason the header gives.
line-width =
    .thick = кӀудияб
    .thin = гьитӀинаб
# «бекараб» is a participle — "broken" — and agrees like an adjective;
# «тӀанкӀабазул» is a genitive, "of dots", and genitives do not agree in Avar.
line-style =
    .dashed = бекараб
    .dotted = тӀанкӀабазул
# Noun phrases, not adjectives: they stand in front of «суралгун» in the
# composing messages below and modify nothing. Their own adjectives agree with
# a plural head, so they carry -л rather than -б — the one place the plural
# class is visible in this file.
fill-style =
    .horizontal = горизонталиял мухъал
    .vertical = вертикалиял мухъал
    .diagonal = диагоналиял мухъал
    .backdiagonal = данде диагоналиял мухъал
    .dots = тӀанкӀал
    .diamonds = ромбал
noun =
    .line = мухъ
    .line-segment = мухъил бутӀа
    .ray = луч
    .vector = вектор
    .curve = гъуркьараб мухъ
    .function = функция
    .slope-field = наклоналъул поле
    .vector-field = векторазул поле
    .parabola = парабола
    .polyline = жубарал мухъал
    .polygon = многоугольник
    .triangle = треугольник
    .rectangle = прямоугольник
    .circle = круг
    .region = бакӀ
    .point = тӀанкӀ
    .square = квадрат
    .diamond = ромб
    .cross = крест
    .plus = плюс
# A numeral is followed by the singular in Avar, so «{ $numSides } рахъ» is
# right for every side count, and the whole phrase stands in front of the noun.
# There is nothing left to put after the adjectives, so the tail is empty.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } рахъ бугеб битӀараб многоугольник
    }
# The class of the noun being described. Every noun this core names is a thing
# rather than a person, so every one of them is class III and this answers one
# token — see the header for what the other three classes would look like and
# for why writing them as branches here would be writing what nothing can
# select.
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
# Avar's attributive adjectives stand in front of the noun, so the description
# lands where English puts it.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
# «цӀураб» is the participle of «цӀезе», to fill. It agrees in Avar exactly as
# the colours do — «цӀурав», «цӀурай», «цӀурал» — and is written flat for the
# same reason they are: only class III is reachable here.
style-filled-word = цӀураб
# «суралгун» is "with pictures", the comitative of a word this catalog writes
# out, so the case ending sits on a word the file owns rather than on the
# placeable in front of it.
style-filled =
    { $parts ->
        [pattern] { $pattern } суралгун { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } суралгун { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } суралгун { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# «рагӀалгун» — "with an edge" — puts the comitative on a noun this catalog
# writes, so nothing is welded to a placeable and Avar wants no article.
style-border-clause =
    { $parts ->
        [with-article] { $border } рагӀалгун
        [and] ва { $border } рагӀалгун
        [and-article] ва { $border } рагӀалгун
       *[with] { $border } рагӀалгун
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } суралгун { $color }
       *[plain] { $color }
    }
# The negative participle agrees in Avar as the positive one does — «цӀечӀев»,
# «цӀечӀей», «цӀечӀел» — but `describeFill` renders this message with no
# arguments at all, so no noun and no `$gender` ever reach it. The class III
# form is written flat, as every other agreeing catalog on the roster writes
# its own.
style-unfilled = цӀечӀеб
# «фоналда» is a locative on a word this catalog writes, and the background
# stands in front of the colour it sits behind.
style-text =
    { $parts ->
        [background] { $background } фоналда { $color }
       *[plain] { $color }
    }
style-background-none = гьечӀо

## Boolean words

boolean-true = битӀараб
boolean-false = мекъаб

## Answer buttons

answer-submit-label = ХӀалтӀи хал гьабизе
answer-submit-label-no-correctness = Жаваб битӀизе

## Sectional blocks

section-name =
    .activity = ХӀалтӀи
    .aside = Рахъалдаса
    .cascade = Каскад
    .definition = Баян
    .example = Мисал
    .exercise = Упражнение
    .exercises = Упражнениял
    .given-answer = Жаваб
    .note = Бицен
    .objectives = Мурадал
    .paragraphs = Абзацал
    .part = БутӀа
    .problem = Масъала
    .problems = Масъалаби
    .proof = Бихьизаби
    .question = Суал
    .section = БетӀер
    .solution = Бахъин
    .task = Иш
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
hint-title = Ишара

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

paginator-previous = Цебесеб
paginator-next = Хадусеб
paginator-page = Гьумер
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## Avar's own conditional is the verb suffix -ни, which closes its clause — but
## the clause it closes needs a verb, and what this key introduces is
## mathematics. «нагагь» is the clause-initial particle that normally
## accompanies that suffix and can stand alone in front of a condition, so this
## key lands where the renderer puts it, as `locales/ce`'s «нагахь санна» does
## and unlike the catalogs whose only conditional is clause-final. A speaker
## writing the sentence out by hand would still mark the verb.

piecewise-condition-or = я
piecewise-condition-if = нагагь
piecewise-condition-otherwise = цогидаб мехалъ

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Dagestan is taught in
## Russian, so the element names an Avar-speaking pupil meets are the Russian
## ones, and an invented Avar list would be further from the textbook in front
## of them than the English fallback is.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Мекъаб химиялъул ишара
chemistry-invalid-ionic-compound = Мекъаб ионалъулаб цолъи
