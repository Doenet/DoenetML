# Mansi content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `mns` is Mansi (Vogul in older English writing); the language's own name for
# itself is мāньси лāтыӈ. It is Ob-Ugric, and with Khanty (`locales/kca`,
# seeded beside this one) it forms the closest living kin of Hungarian. These
# two are the roster's first Ob-Ugric catalogs, and `locales/hu` was of no use
# in writing either: Ugric split deep enough that Hungarian shares no usable
# vocabulary, no orthography and none of the technical register with Mansi.
# Nothing here was carried over from it.
#
# Written in Cyrillic towards the **Sosva (Northern) literary norm**, which is
# what Mansi schoolbooks, the Луима сэрипос newspaper and essentially all
# modern published Mansi use. The other Mansi dialect groups — Upper Lozva,
# Konda, Pelym — are far apart from Northern and from one another, and Konda in
# particular is not simply readable as Northern; ISO 639-3 covers them all with
# the single code `mns`, so one catalog is what can be written.
#
# THIS IS AMONG THE LEAST CERTAIN CATALOGS IN THE ROSTER, with `locales/kca`
# beside it and `locales/xal` and `locales/lom` before it — those two set the
# precedent for saying so in the file's own header rather than letting a reader
# discover it. Mansi is severely endangered, with a few hundred fluent speakers
# and a small published output, and **a good deal of the editor and diagnostics
# vocabulary here is coined rather than attested**:
#
#   * «ювле лāтыӈ» "word back" for *answer*, a descriptive coinage;
#   * «нётнэ лāтыӈ» "helping word" for *hint* and «китыглан лāтыӈ» "asking
#     word" for *question*, built the same way;
#   * «пāс» "mark" for the geometric *point*, «сыр» "kind" for *type*,
#     «савит» "amount" for *number*, «вāрмаль» "matter" for *value*,
#     «няврам» "child" for an element's XML children;
#   * «ат ловиньтавē» "is not counted" for *is ignored*, «ат рōви» "is not
#     permitted" for *cannot*, «ōлуӈкве ēри» "must be";
#   * «ёхтуӈкве рōвнэ вāрмаль» "the being-reachable thing" for *accessibility*.
#
# Where a term has no attested Mansi equivalent, the seed prefers a transparent
# descriptive coinage of that sort. Where written Mansi already borrows from
# Russian it borrows here too, which is why the technical nouns are
# «компонент», «атрибут», «функция», «индекс», «документ», why the line-family
# geometry below is Russian (Mansi mathematics is written and taught in Russian
# terms, and a coined geometry vocabulary would serve no reader), and why the
# colour words past сэмыл, яӈк, вигыр, восрам and атыр are Russian: Mansi's own
# colour vocabulary does not partition the spectrum the way these twelve
# `color` attributes need. A borrowed colour word is given in its Russian
# citation form — «жёлтый», not an oblique «жёлтой» — because `style-filled`
# sets it in front of a noun uninflected, the position an unadapted loan
# occupies in a Mansi sentence.
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
# Mansi form for them, so it left the loan standing rather than coin one.
# `locales/kca` renders the same set with the same Russian words for the same
# reason; the two agreeing is not evidence that either is right.
#
# Mansi has no grammatical gender and does not inflect an attributive
# adjective, so `$gender` and `$role` go unused here, as in every other Uralic
# catalog in the roster — `locales/kca`, `locales/kv`, `locales/udm`,
# `locales/myv`, `locales/chm`, `locales/mrj`.


## Style vocabulary

color =
    .black = сэмыл
    .white = яӈк
    .gray = серый
    .red = вигыр
    .orange = оранжевый
    .yellow = жёлтый
    .green = восрам
    .cyan = яӈк атыр
    .blue = атыр
    .purple = фиолетовый
    .pink = розовый
    .brown = коричневый
line-width =
    .thick = яныг
    .thin = мāнь
line-style =
    .dashed = сагрым
    .dotted = пāсыӈ
# Noun phrases: they stand in front of «хансыӈ» and modify nothing.
fill-style =
    .horizontal = хосыт линия
    .vertical = нуми линия
    .diagonal = сӯӈ линия
    .backdiagonal = ювле сӯӈ линия
    .dots = пāс
    .diamonds = ромб
noun =
    .line = линия
    .line-segment = отрезок
    .ray = луч
    .vector = вектор
    .curve = кривая
    .function = функция
    .slope-field = сӯӈ мā
    .vector-field = вектор мā
    .parabola = парабола
    .polyline = ломаная
    .polygon = сав сӯӈуп
    .triangle = хӯрум сӯӈуп
    .rectangle = нила сӯӈуп
    .circle = круг
    .region = мā
    .point = пāс
    .square = квадрат
    .diamond = ромб
    .cross = крест
    .plus = плюс
# Mansi builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] аквсыр { $numSides } сӯӈуп
    }
# Mansi has no grammatical gender, so every noun answers the same and the
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
style-filled-word = тагыл
style-filled =
    { $parts ->
        [pattern] { $pattern } хансыӈ { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } хансыӈ { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } хансыӈ { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «вāтаӈ» — "having an edge" — carries the whole of "with a border" in its own
# suffix, so neither a preposition nor an article is wanted.
style-border-clause =
    { $parts ->
        [with-article] { $border } вāтаӈ
        [and] ос { $border } вāтаӈ
        [and-article] ос { $border } вāтаӈ
       *[with] { $border } вāтаӈ
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } хансыӈ { $color } ханьщи
       *[plain] { $color } ханьщи
    }
style-unfilled = ат тагыл
# «тāрмыл» — "on" — is a postposition, and a postposition needs a noun to
# govern: `$background` renders as a bare colour word, so «фон» stands between
# the two to be what «тāрмыл» is said of. The same shape `locales/kca`,
# `locales/koi`, `locales/mdf` and `locales/mrj` write.
style-text =
    { $parts ->
        [background] { $background } фон тāрмыл { $color }
       *[plain] { $color }
    }
style-background-none = ат ōлы

## Boolean words

boolean-true = ōлы
boolean-false = ат ōлы

## Answer buttons

answer-submit-label = Сунсуӈкве
answer-submit-label-no-correctness = Ювле лāтыӈ кēтуӈкве

## Sectional blocks

section-name =
    .activity = Рӯпата
    .aside = Мōт пāс
    .cascade = Каскад
    .definition = Определение
    .example = Пример
    .exercise = Упражнение
    .exercises = Упражненият
    .given-answer = Ювле лāтыӈ
    .note = Пāс
    .objectives = Ēрын вāрмалит
    .paragraphs = Абзацыт
    .part = Пēлы
    .problem = Задача
    .problems = Задачат
    .proof = Доказательство
    .question = Китыглан лāтыӈ
    .section = Яныг пēлы
    .solution = Решение
    .task = Вāрмаль
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
hint-title = Нётнэ лāтыӈ

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

paginator-previous = Ювле
paginator-next = Ēлаль
paginator-page = Страница
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## `piecewise-condition-if` is the same limit `locales/kv`, `locales/udm`,
## `locales/chm`, `locales/mrj` and `locales/kca` record: Mansi's conditional
## «ке» is an enclitic that closes the clause it conditions, and the renderer
## places this key before the mathematics. Nothing can be written here that
## will stand in front of the condition and still be Mansi, so «ке» is printed
## where the renderer wants it and a reader will meet it early. Ob-Ugric and
## Permic hit this wall for the same reason: the condition marks its clause at
## the end, not at the start.

piecewise-condition-or = манос
piecewise-condition-if = ке
piecewise-condition-otherwise = мōт сыр

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Khanty-Mansi Autonomous
## Okrug is taught in Russian — Mansi is a subject, not the medium — so the
## element names a Mansi-speaking pupil meets are the Russian ones, and the
## English fallback stands closer to that pupil's own textbook than 118
## coinages of this seed's making would. This is the school-system case the
## batch shares throughout.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Ат ёмас химия пāс
chemistry-invalid-ionic-compound = Ат ёмас ион акван-паттым
