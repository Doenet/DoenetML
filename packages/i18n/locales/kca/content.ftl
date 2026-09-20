# Khanty content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `kca` is Khanty (also Ostyak in older English writing); the language's own
# name for itself is хӑнты ясӑӈ. It is Ob-Ugric, and with Mansi (`locales/mns`,
# seeded beside this one) it forms the closest living kin of Hungarian. These
# two are the roster's first Ob-Ugric catalogs. `locales/hu` was of no help in
# writing either of them — Ugric split deep enough that Hungarian shares no
# usable vocabulary, no orthography and none of the technical register with
# Khanty, so nothing here was carried over from it.
#
# Written in Cyrillic towards the **Kazym** literary norm, with Khanty's ӑ, ә,
# ө, ӈ, ў and the lateral ԓ. Khanty's other norms — Shuryshkary and Middle Ob
# in the north, Surgut and Vakh in the east — are far enough apart that a
# Surgut reader will not simply read this as their own; ISO 639-3 covers them
# all with the single code `kca`, so one catalog is what can be written.
#
# THIS IS AMONG THE LEAST CERTAIN CATALOGS IN THE ROSTER. `locales/xal` and
# `locales/lom` set the precedent for saying so in the file's own header rather
# than letting a reader discover it. Khanty is severely endangered, its written
# output is small and almost entirely literary, and **a good deal of the editor
# and diagnostics vocabulary here is coined rather than attested**:
#
#   * «вошты ясӑӈ» "returning word" for *answer*, a descriptive coinage;
#   * «нётты ясӑӈ» "helping word" for *hint*, and «инщӑсты ясӑӈ» "asking word"
#     for *question*, built the same way;
#   * «пас» "mark" for the geometric *point*, and «хӑнши» "something drawn" for
#     *line*, both stretched past their attested sense;
#   * «сир» "kind" for *type*, «арат» "amount" for *number*, «вєр» "matter"
#     for *value*, «нӑврєм» "child" for an element's XML children;
#   * «ӑнт ўԓа» "is not taken" for *is ignored*, and «ӑнт рӑхӑԓ» "is not
#     permitted" for *cannot*.
#
# Where a term has no attested Khanty equivalent at all, the seed prefers a
# transparent descriptive coinage of that sort; where written Khanty already
# borrows from Russian it borrows here too, which is why the technical nouns
# below are «компонент», «атрибут», «функция», «индекс», «документ», and why
# the geometric and colour vocabulary past питы, нови, вўрты and васты is
# Russian. Khanty's own colour words do not partition the spectrum the way this
# catalog's twelve `color` attributes need, and inventing eight more would have
# been a worse answer than the loans a Khanty text would actually use. A
# borrowed colour word is given in its Russian citation form — «жёлтый», not an
# oblique «жёлтой» — because `style-filled` sets it in front of a noun
# uninflected, the position an unadapted loan occupies in a Khanty sentence.
#
# **The Russian in this file goes further than that, and a speaker should read
# the surplus as a gap rather than as a decision.** Alongside the technical,
# geometric and colour vocabulary above, these are still bare Russian:
# «Ошибка» for *error*, «строка» for a source *line*, «Страница» for a *page*,
# «Рисунок» for a *figure*, «массив элемент» for an array entry, and the
# school-genre section names «Определение», «Пример», «Упражнение», «Задача»,
# «Доказательство» and «Решение». Every other Cyrillic catalog in this batch
# either translates these or adapts the ending — `locales/mrj` writes
# «Йоҥылыш», «Ластык» and «Упражнений», `locales/mdf` «Ильведефкс» and «Лопа»,
# `locales/koi` «Тшыкӧдчӧм» and «Лист бок» — and this seed could establish no
# Khanty form for them, so it left the loan standing rather than coin one.
# `locales/mns` renders the same set with the same Russian words for the same
# reason; the two agreeing is not evidence that either is right.
#
# Khanty has no grammatical gender and does not inflect an attributive
# adjective, so `$gender` and `$role` go unused here, as in every other Uralic
# catalog in the roster — `locales/kpv`, `locales/udm`, `locales/myv`,
# `locales/mhr`, `locales/mrj`, `locales/mns`.


# **«сир» carries three senses, and one message reads "the colour's colour".**
# The coinage list below declares «сир», "kind", for *type*. The seed also
# reached for it as the word for a colour in `diagnostics.ftl`'s contrast
# messages — «текст сир па ԓыпӑс сир», «(питы сир)» — and it is the
# comparison word «ит сир», "the same", besides. No Khanty word for a colour
# could be established, and the file's stated policy is to leave a loan
# standing rather than invent, so «сир» stands in all three; a reviewer
# should give the colour its own word, which would clear the self-reference
# in `style-definition-dark-mode-text-canvas-contrast` at a stroke.
#
# «пас» and «вєр» are loaded the same way, though neither produces a
# contradiction: «пас» is a point, a mark, a note, an annotation and a
# character, and «вєр» is a value, a matter, a task, an object and the
# `<accessibility>` of «юхӑтты рӑхты вєр». Both are declared below and used
# consistently, which is why they are worth naming here rather than fixing.


## Style vocabulary

color =
    .black = питы
    .white = нови
    .gray = серый
    .red = вўрты
    .orange = оранжевый
    .yellow = жёлтый
    .green = васты
    .cyan = нови синий
    .blue = синий
    .purple = фиолетовый
    .pink = розовый
    .brown = коричневый
line-width =
    .thick = вөн
    .thin = ай
line-style =
    .dashed = сєвӑрман
    .dotted = пасӑӈ
# Noun phrases: they stand in front of «хӑншиӈ» and modify nothing.
fill-style =
    .horizontal = веськат хӑнши
    .vertical = нух хӑнши
    .diagonal = сўӈ хӑнши
    .backdiagonal = йухԓы сўӈ хӑнши
    .dots = пас
    .diamonds = ромб
noun =
    .line = веськат хӑнши
    .line-segment = хӑнши пєлӑк
    .ray = луч
    .vector = вектор
    .curve = кєрԓӑм хӑнши
    .function = функция
    .slope-field = сўӈ мўв
    .vector-field = вектор мўв
    .parabola = парабола
    .polyline = сўӈӑӈ хӑнши
    .polygon = ар сўӈӑп
    .triangle = хөԓӑм сўӈӑп
    .rectangle = веськат ньӑԓ сўӈӑп
    .circle = круг
    .region = мўв
    .point = пас
    .square = квадрат
    .diamond = ромб
    .cross = крест
    .plus = плюс
# Khanty builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] ит сир { $numSides } сўӈӑп
    }
# Khanty has no grammatical gender, so every noun answers the same and the
# answer goes unused — the answer `locales/myv` gives, and the answer every
# Uralic catalog gives.
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
style-filled-word = тэԓ
style-filled =
    { $parts ->
        [pattern] { $pattern } хӑншиӈ { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } хӑншиӈ { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } хӑншиӈ { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «-ӈ» — "having" — carries the whole of "with a border" in its own suffix, so
# neither a preposition nor an article is wanted.
style-border-clause =
    { $parts ->
        [with-article] { $border } кӑтԓӑӈ
        [and] па { $border } кӑтԓӑӈ
        [and-article] па { $border } кӑтԓӑӈ
       *[with] { $border } кӑтԓӑӈ
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } хӑншиӈ { $color } хӑнши
       *[plain] { $color } хӑнши
    }
style-unfilled = тэԓ ӑнтөм
# «хуща» — "on, at" — is a postposition and follows the background colour, so
# nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } ԓыпӑс хуща { $color }
       *[plain] { $color }
    }
style-background-none = ӑнтөм

## Boolean words

boolean-true = вөԓ
boolean-false = ӑнтөм

## Answer buttons

answer-submit-label = Вантты
answer-submit-label-no-correctness = Вошты ясӑӈ китты

## Sectional blocks

section-name =
    .activity = Рупата
    .aside = Па пас
    .cascade = Каскад
    .definition = Определение
    .example = Пример
    .exercise = Упражнение
    .exercises = Упражнениет
    .given-answer = Вошты ясӑӈ
    .note = Пас
    .objectives = Мосты вєрӑт
    .paragraphs = Абзацӑт
    .part = Пєлӑк
    .problem = Задача
    .problems = Задачаӑт
    .proof = Доказательство
    .question = Инщӑсты ясӑӈ
    .section = Ух пєлӑк
    .solution = Решение
    .task = Вєр
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
hint-title = Нётты ясӑӈ

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
        [numbered] Рисунок { $enumeration }
        [numbered-caption] Рисунок { $enumeration }{ ". " }
        [unnumbered-caption] Рисунок{ ". " }
       *[unnumbered] Рисунок
    }

## Paginator controls

paginator-previous = Оԓӑӈмет
paginator-next = Кимет
paginator-page = Страница
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## `piecewise-condition-if` is the same limit `locales/kpv`, `locales/udm`,
## `locales/mhr` and `locales/mrj` record, now in an Ob-Ugric language: Khanty's
## conditional «ки» is an enclitic that closes the clause it conditions, and the
## renderer places this key before the mathematics. Nothing can be written here
## that will stand in front of the condition and still be Khanty, so «ки» is
## printed where the renderer wants it and a reader will meet it early.

piecewise-condition-or = муй
piecewise-condition-if = ки
piecewise-condition-otherwise = па сирӑн

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Khanty-Mansiysk and
## Yamalo-Nenets is taught in Russian — Khanty is a subject, not the medium —
## so the element names a Khanty-speaking pupil meets are the Russian ones, and
## the English fallback stands closer to that pupil's own textbook than 118
## coinages of this seed's making would. This is the school-system case the
## batch shares throughout.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Ям ӑнтөм химия пас
chemistry-invalid-ionic-compound = Ям ӑнтөм ион акӑтман
