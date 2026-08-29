# Kildin Sami content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Kildin Sami is a Sami language written in **Cyrillic**, which puts it in the
# family of `locales/se`, `locales/sma`, `locales/smj` and `locales/smn` and in
# the script of `locales/koi`, `locales/mdf` and `locales/mrj` at the same
# time; `chrome.ftl` sets out what that costs and what it explains, including
# the plural difference — CLDR gives `sjd` only `one` and `other`, so no
# message in these four files selects on a dual, though the language has one —
# and why this is the least certain catalog of its group.
#
# Kildin has no grammatical gender, and a Sami adjective standing in front of a
# noun takes an **attributive** form that agrees with nothing at all: not with
# the noun's case, not with its number, and there is no gender for it to agree
# with. So `$gender` and `$role` both go unused here, `noun-gender` below is
# flat, and the colour table is one word per colour — the same answer
# `locales/se` and `locales/sms` give in Latin script, and the same one
# `locales/myv` gives in Cyrillic.
#
# The attributive is not the same word as the predicative, and this catalog
# writes the attributive throughout, so `backgroundColor` and `textColor`
# reported as bare state variables read as the front half of a phrase whose
# noun has not arrived. That is the trade every Sami catalog here makes:
# `$role` cannot tell the two positions apart, because `standalone` is both.
#
# The borrowed colours — «оранжевэй», «бирюзовэй», «фиолетовэй», «розовэй» —
# come in through Russian and are cited in one shape. That the table is uneven
# is a fact about which colour words Kildin inherited and which it borrowed,
# and it is the same unevenness `locales/se` records for the Latin-script
# Sami colours.
#
# **`line-style.dotted` is the least certain word in the style tables.** It
# stands in `style-stroke`, in front of a noun, where Kildin wants an
# attributive; the seed first wrote the comitative «точкагуэйм», which is the
# form `fill-style` supplies and means "with dots" — a "with" in a slot that
# has nothing to be with. What stands there now, «точечнэ», is built by this
# catalog's own productive pattern for a borrowed adjective — Russian stem plus
# `-нэ`, as in «горизонтальнэ», «диагональнэ», «относительнэ» — rather than by
# the native derivation «са̄рркма» beside it uses, because no native Kildin
# word for "dotted" could be established. A reviewer should expect to replace
# it with a native form.


## Style vocabulary

color =
    .black = чāхкесь
    .white = вӣллькесь
    .gray = рāнесь
    .red = рупсесь
    .orange = оранжевэй
    .yellow = фискесь
    .green = руэнэсь
    .cyan = бирюзовэй
    .blue = алльк
    .purple = фиолетовэй
    .pink = розовэй
    .brown = руэшкесь
line-width =
    .thick = эhкесь
    .thin = сēггесь
line-style =
    .dashed = са̄рркма
    .dotted = точечнэ
# Comitative plurals. The `-гуэйм` ending is Kildin's own word for "with",
# which is why `style-filled` below places these straight after the colour and
# writes no preposition of its own: the ending already said it.
fill-style =
    .horizontal = горизонтальнэ линиегуэйм
    .vertical = вертикальнэ линиегуэйм
    .diagonal = диагональнэ линиегуэйм
    .backdiagonal = нӯббь пēлля диагональнэ линиегуэйм
    .dots = точкагуэйм
    .diamonds = ромбагуэйм
noun =
    .line = линия
    .line-segment = отрезок
    .ray = луч
    .vector = вектор
    .curve = кривая
    .function = функция
    .slope-field = наклон-поле
    .vector-field = векторнэ поле
    .parabola = парабола
    .polyline = мāҏhа линия
    .polygon = многоугольник
    .triangle = коллм чēгк
    .rectangle = прямоугольник
    .circle = окружность
    .region = вӯдт
    .point = точка
    .square = квадрат
    .diamond = ромб
    .cross = рӯсс
    .plus = плюс
# Kildin keeps the side count in front of the noun, so the whole of it is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] правильнэ { $numSides }-пēльлса многоугольник
    }
# Sami has no grammatical gender, so nothing above reads this and every noun
# answers alike. It is here because the argument is passed to every adjective
# and a message that resolves to nothing would render `{noun-gender}`.
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
style-filled-word = тēвдма
# The pattern words carry their own «with» in their comitative ending, so
# nothing is written between them and what they follow.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «рāввтэгуэйм» is «рāввьт», a border, in the comitative — the case that
# carries "with" — so the clause needs no preposition either. Kildin has no
# article, so the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] { $border } рāввтэгуэйм
        [and] я { $border } рāввтэгуэйм
        [and-article] я { $border } рāввтэгуэйм
       *[with] { $border } рāввтэгуэйм
    }
style-fill =
    { $parts ->
        [pattern] { $color } тēвдэм { $pattern }
       *[plain] { $color } тēвдэм
    }
style-unfilled = тēвдтэгуэдтҍ
style-text =
    { $parts ->
        [background] { $color } { $background } фонэсьт
       *[plain] { $color }
    }
style-background-none = ей ля

## Boolean words

boolean-true = вӯййкесь
boolean-false = пāстэй

## Answer buttons

answer-submit-label = Та̄ррькхэ рāботт
answer-submit-label-no-correctness = Вӯлльктэ вāсьт

## Sectional blocks

section-name =
    .activity = Рāботт
    .aside = Лāссь тēкст
    .cascade = Каскад
    .definition = Мēрртэм
    .example = Оудтэм
    .exercise = Упражнения
    .exercises = Упражненияh
    .given-answer = Вāсьт
    .note = Мērка
    .objectives = Мēрр
    .paragraphs = Тēкстча̄ссҍ
    .part = Ча̄ссҍ
    .problem = Задача
    .problems = Задачаh
    .proof = Тōhтма
    .question = Кыррьй
    .section = Ча̄ссҍ
    .solution = Чōввтэм
    .task = Рāботт
    .theorem = Теорема
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Ноаллэсэсс

## Tables and figures

table-name =
    { $parts ->
        [numbered] Таблиц { $enumeration }
        [numbered-title] Таблиц { $enumeration }{ ": " }
        [unnumbered-title] Таблиц{ ": " }
       *[unnumbered] Таблиц
    }
figure-name =
    { $parts ->
        [numbered] Кāртт { $enumeration }
        [numbered-caption] Кāртт { $enumeration }{ ": " }
        [unnumbered-caption] Кāртт{ ": " }
       *[unnumbered] Кāртт
    }

## Paginator controls

paginator-previous = Оуддэль
paginator-next = Пуэдтҍе
paginator-page = Лӣстт
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## «кōhт» opens the clause it conditions and so places straight in front of the
## mathematics, which is where the renderer puts it — none of the trouble
## `locales/kv` and `locales/chm` record with a clause-final conditional
## particle arises here. That is one of the few places where being a Sami
## language rather than a Permic one makes this catalog's life easier.

piecewise-condition-or = елле
piecewise-condition-if = кōhт
piecewise-condition-otherwise = нӯббь на̄лле

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry on the Kola Peninsula is
## taught in **Russian**, so the element names a Kildin-speaking pupil meets
## are the Russian ones — the same school-system case `locales/kv`,
## `locales/koi` and `locales/myv` record, and one that lands harder here,
## because Kildin-medium teaching does not reach secondary school at all.
## Inventing 118 Kildin coinages would put a word in front of that pupil that
## nobody in their classroom uses.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Пāстэй химическэ мērка
chemistry-invalid-ionic-compound = Пāстэй ионнэ соединения
