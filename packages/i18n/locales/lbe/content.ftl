# Lak content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Lak (лакку маз) is Northeast Caucasian, spoken in central Dagestan, and is
# written in Cyrillic with the palochka. That has been the standard since 1938
# and is what the republic's schools, the Lak-language press and CLDR all use;
# `lbe` maximizes to `lbe-Cyrl-RU`. The palochka Ӏ is a letter of the alphabet
# — not a Latin capital I and not a digit 1 — and «тӀайласса», «кӀицӀ» and
# «кӀяласса» are unreadable if it is replaced by either.
#
# Lak resolves two plural categories, `one` and `other`, and nothing in this
# file counts, so no message here selects on a count.
#
# **Lak agrees, and this catalog does not fork. That gap is deliberate and is
# the first thing a speaker should read.** Lak has four noun classes —
# I masculine human, II feminine human, III and IV non-human — and an agreeing
# word carries the class as a marker at its *front*: singular в- (I), б- (II
# and III), д- (IV); plural б- (I and II), д- (III and IV). Only two of the
# four could ever be reached from here, since nothing the core names is human.
#
# What actually carries a marker in this file is a very short list. Lak's
# attributive adjectives are the -сса forms — «лухӀисса», «ятӀулсса»,
# «хъунмасса» — and they are invariable, so the whole style vocabulary below
# agrees with nothing, exactly as Chechen's does in `locales/ce`. The one word
# that would agree is the participle «дувцӀусса», "filled", whose initial д- is
# a class-IV marker and would be б- for a class-III shape. That is the single
# message a fork belongs in.
#
# It is not written, because `noun-gender` cannot honestly feed it. This seed
# could establish Lak's class markers and the shape of the participle; it could
# not establish the class of a single one of the geometric nouns it needed —
# and a half-remembered class table is worse than an admitted gap, which is the
# judgement `locales/ce` made about the entries it left out and `locales/ewo`
# made about Ewondo. So `noun-gender` answers `d` for everything and
# `style-filled-word` is written flat in its class-IV form. **If that form is
# wrong for a shape, it is wrong everywhere rather than in scattered places**,
# which is the failure mode that is findable. Filling the table in costs one
# `{ $noun -> … }` table here and one `{ $gender -> [b] бувцӀусса *[d]
# дувцӀусса }` select in `style-filled-word`; nothing else in the file changes.
#
# The second-least certain thing here is the colour vocabulary, and for a
# reason worth recording. Lak's attested core is small — «кӀяла» white, «лухӀи»
# black, «ятӀул» red, «хъахъи» yellow, «щюлли» — and «щюлли» covers green and
# blue together, where the style pipeline needs them as two separate words.
# So this catalog writes transparent compounds that split them, «урттул
# щюллисса» (grass-green) and «ссавнил щюллисса» (sky-green), the way
# `locales/sah` splits Sakha's «күөх» and `locales/os` splits Ossetian's
# «цъæх». That is a choice, not a translation, and the remaining families —
# grey, orange, cyan, purple, pink, brown — are built out of the core the same
# way. «Бинавшасса» for purple is the one loan among them.
#
# Third: Lak's own words for thick and thin were not attestable here, so the
# stroke widths are written with the size adjectives «хъунмасса» and
# «чӀивисса». The mathematical nouns are the Russian ones — «линия»,
# «отрезок», «луч», «вектор», «функция», «круг», «квадрат» — which is what
# written Lak uses for them, and the case endings on those loans («строкалул»,
# «векторданул», «фондалий») are the other thing to check.


## Style vocabulary
##
## Lak's attributive adjectives end in -сса and stand *before* the noun, so
## the composition messages below keep English's order. None of these words
## takes a class marker, so none of them forks.

color =
    .black = лухӀисса
    .white = кӀяласса
    .gray = лухӀи-кӀяласса
    .red = ятӀулсса
    .orange = ятӀул-хъахъисса
    .yellow = хъахъисса
    .green = урттул щюллисса
    .cyan = кӀяла ссавнил щюллисса
    .blue = ссавнил щюллисса
    .purple = бинавшасса
    .pink = ятӀул-кӀяласса
    .brown = ятӀул-лухӀисса
line-width =
    .thick = хъунмасса
    .thin = чӀивисса
line-style =
    .dashed = кьуркьусса
    .dotted = нукьтардал
# Noun phrases, all of them plural: the composing messages put «дусса»
# ("having") after them rather than a case suffix, so nothing is welded to a
# value and the class marker on «дусса» is the д- that classes III and IV
# share in the plural.
fill-style =
    .horizontal = горизонталлул линиярду
    .vertical = вертикаллул линиярду
    .diagonal = диагоналлул линиярду
    .backdiagonal = махъунмай диагоналлул линиярду
    .dots = нукьтарду
    .diamonds = ромбру
noun =
    .line = линия
    .line-segment = отрезок
    .ray = луч
    .vector = вектор
    .curve = кривая
    .function = функция
    .slope-field = наклоннал майдан
    .vector-field = векторданул майдан
    .parabola = парабола
    .polyline = мурцӀурдал линия
    .polygon = чӀявумурцӀу
    .triangle = шамамурцӀу
    .rectangle = тӀайласса мукьвамурцӀу
    .circle = круг
    .region = кӀану
    .point = нукьта
    .square = квадрат
    .diamond = ромб
    .cross = крест
    .plus = плюс
# Lak builds the side count into a prenominal phrase, so the whole noun is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } мурцӀу дусса барабарсса чӀявумурцӀу
    }
# One token for every noun, and the reason is in this file's header: Lak's
# four-class system is real, and the class of these particular nouns is what
# this seed could not check. `d` is class IV, the default the participle below
# is written in.
noun-gender = d

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
# The one word in this file that carries a class marker — the д- of class IV —
# and the one message a `{ $gender -> … }` select belongs in the day
# `noun-gender` above can answer for a class-III shape with «бувцӀусса».
style-filled-word = дувцӀусса
style-filled =
    { $parts ->
        [pattern] { $pattern } дусса { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } дусса { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } дусса { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# «дазущал» — "with a border" — is the comitative of a noun this catalog
# writes, so no affix lands on a value. Lak has no articles, so the two
# `-article` branches read exactly as the two without one.
style-border-clause =
    { $parts ->
        [with-article] { $border } дазущал
        [and] ва { $border } дазущал
        [and-article] ва { $border } дазущал
       *[with] { $border } дазущал
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
# The negation is written with the prefix къа-, which has one shape. This
# message describes a fill standing on its own — `describeFill` hands it no
# arguments at all — so no noun and therefore no `$gender` reaches it, and the
# class-IV form is written flat. A fork here could only ever render its
# default branch.
style-unfilled = къадувцӀусса
# «фондалий» — "on the background" — is a case form of a word this catalog
# writes, and the colour follows it, so the two words keep Lak's own order.
style-text =
    { $parts ->
        [background] { $background } фондалий { $color }
       *[plain] { $color }
    }
style-background-none = дакъар

## Boolean words

boolean-true = тӀайла
boolean-false = къатӀайла

## Answer buttons

answer-submit-label = Даву ххал дан
answer-submit-label-no-correctness = Жаваб гьан бан

## Sectional blocks

section-name =
    .activity = Даву
    .aside = Чулухасса кӀицӀ
    .cascade = Каскад
    .definition = Баян баву
    .example = Мисал
    .exercise = Упражнение
    .exercises = Упражнениярду
    .given-answer = Жаваб
    .note = КӀицӀ
    .objectives = Мурадру
    .paragraphs = Абзацру
    .part = БутӀа
    .problem = Масъала
    .problems = Масъалартту
    .proof = Исбат баву
    .question = Суал
    .section = Раздел
    .solution = Щаллу баву
    .task = Тапшуру
    .theorem = Теорема
# Lak follows the Russian typographic convention its textbooks are set in, so
# a heading separates its title with a period rather than with a colon.
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

paginator-previous = ХьхьичӀмур
paginator-next = Махъмур
paginator-page = ЧӀапӀи
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## **`piecewise-condition-if` cannot land correctly in Lak, and no wording here
## fixes it.** Lak marks a condition on the *verb that closes the clause* — the
## conditional converb, «духьурча» "if it is" — so the word belongs after the
## mathematics rather than in front of it, and the renderer places this message
## before. That is the limit `locales/sah`, `locales/tyv`, `locales/udm`,
## `locales/kpv` and `locales/mhr` record for the same reason; splitting the key
## into a prefix and a suffix would fix it and nothing in the composition
## messages exposes the distinction today. The Lak form is written out anyway,
## so a reader sees a Lak word in the wrong position rather than an English one.

piecewise-condition-or = я
piecewise-condition-if = духьурча
piecewise-condition-otherwise = цамур ишираву

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Dagestan is taught in
## Russian — Lak is a subject in the lower grades and not the medium the
## periodic table arrives in — so the element names a Lak-speaking pupil meets
## are the Russian ones, and the English fallback sits nearer their curriculum
## than an invented Lak list would.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = КъатӀайласса химиялул ишара
chemistry-invalid-ionic-compound = КъатӀайласса ионнал цачӀуншиву
