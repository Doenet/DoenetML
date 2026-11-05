# Tajik content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Tajik is Persian written in Cyrillic, so `locales/fa` is the closest parallel
# text to this file and a correction to one is often a correction to both — the
# same relationship `locales/hi` and `locales/ur` have. What it does *not* share
# with the rest of this batch is the grammar: the languages around it are Turkic
# and this one is Iranian.
#
# There is no grammatical gender and an adjective does not inflect, so both
# `$gender` and `$role` go unused. Adjectives follow their noun, joined by the
# izafat, which is why `style-with-noun` and `style-filled-with-noun` put the
# noun first rather than substituting into the English frame.
#
# The izafat is where this catalog differs from `locales/fa`. In Persian the
# link after a consonant is an unwritten vowel and the space carries it; Tajik
# writes it, as «-и». That «-и» is written the same way after most endings, but
# not after every one: a ъ-final word drops the ъ before it («шуоъ» → «шуои»),
# and a ӣ-final word shortens the ӣ to и («моҳӣ» → «моҳии»). So welding it onto
# `{ $noun }` is sound because of *which words this file puts in the `noun`
# table*, not because the izafat never changes what precedes it — every entry
# there ends in a consonant or in an unstressed vowel that the izafat leaves
# untouched, and a new entry has to be checked against that. Choosing the
# vocabulary to fit the frame is the README's "Choose the words that land
# there", the escape hatch `locales/cs` takes for horizontal lines: `.ray` is
# «нур» rather than «шуоъ» and `.square` is «квадрат» rather than «мураббаъ»
# for exactly this reason. The `color` table is picked the same way, because
# `style-stroke` chains an izafat onto a colour: «хокистарранг», «норинҷранг»,
# «фирӯза» and «гулгун» stand where «хокистарӣ», «норинҷӣ», «фирӯзаӣ» and
# «гулобӣ» would have needed the ӣ shortened. The `line-style` and `line-width`
# tables are in the same frame — `style-stroke` chains an izafat onto those two
# as well — and every entry in them is consonant-final, so the same check
# applies when one is added. See "An affix cannot be welded to a placeable" in
# the README.
#
# This is not the only Tajik affix that meets a placeable — `tg/editor.ftl` and
# `tg/diagnostics.ftl` write the hyphenated «-ро» and «-и» onto identifiers in
# a good many messages — but those affixes have one form whatever stands in
# front of them, the way `{ $numSides }-kulmio` does in Finnish, so nothing
# there depends on what the value turns out to be. The lone exception is
# `editor-update-viewer-title`, which puts an unhyphenated izafat on a label
# this catalog writes itself, and its own header carries the same rule this one
# does for the `noun` table. Where the value was an
# author's own word rather than a DoenetML identifier, those two files name
# what the value is instead of welding to it.
#
# A noun with no adjectives at all — a marker whose style names no colour —
# would leave the izafat standing on its own, but it cannot
# arrive here: `attachNoun` in `styleDescriptions.ts` returns the bare noun
# without going through `style-with-noun` when the description is empty.


## Style vocabulary

color =
    .black = сиёҳ
    .white = сафед
    .gray = хокистарранг
    .red = сурх
    .orange = норинҷранг
    .yellow = зард
    .green = сабз
    .cyan = фирӯза
    .blue = кабуд
    .purple = бунафш
    .pink = гулгун
    .brown = қаҳваранг
line-width =
    .thick = ғафс
    .thin = борик
line-style =
    .dashed = хат-хат
    .dotted = нуқтадор
fill-style =
    .horizontal = хатҳои уфуқӣ
    .vertical = хатҳои амудӣ
    .diagonal = хатҳои диагоналӣ
    .backdiagonal = хатҳои диагоналии баръакс
    .dots = нуқтаҳо
    .diamonds = ромбҳо
noun =
    .line = хат
    .line-segment = порча
    .ray = нур
    .vector = вектор
    .curve = каҷхат
    .function = функсия
    .parabola = парабола
    .polyline = хати шикаста
    .polygon = бисёркунҷа
    .triangle = секунҷа
    .rectangle = росткунҷа
    .circle = доира
    .region = минтақа
    .point = нуқта
    .square = квадрат
    .diamond = ромб
    .cross = чорхат
    .plus = плюс
# The side count follows the adjectives rather than standing in front of the
# noun, so this splits in two the way Spanish's does: the head is the word the
# adjectives attach to and the tail is the complement after them.
noun-regular-polygon =
    { $part ->
        [tail] бо { $numSides } тараф
       *[head] бисёркунҷаи мунтазам
    }
# Tajik has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in Persian.
noun-gender = neuter

## Style composition

# Stacked attributives follow the noun and each non-final one carries an izafat
# of its own, the way `style-filled-with-noun` already chains «доираи пуршудаи
# кабуд» — so a chain here is «{ $color }и { $lineStyle }и { $width }», not a
# bare juxtaposition. The order is the mirror of English's, so the adjective
# English puts nearest the noun stands nearest it in Tajik.
#
# `style-filled` and `style-filled-with-noun` are the deliberate exception and
# are not mirrored: «пуршуда» is a participle predicated of the shape itself
# rather than a quality ranked with the colour, so it takes the first slot after
# the noun and the colour — which says what the filling is — follows it.
# «доираи пуршудаи кабуд» is the natural Tajik; «доираи кабуди пуршуда» would
# read as a blue circle that happens to be filled.
style-stroke =
    { $parts ->
        [width-style-color] { $color }и { $lineStyle }и { $width }
        [width-color] { $color }и { $width }
        [style-color] { $color }и { $lineStyle }
        [width-style] { $lineStyle }и { $width }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
style-with-noun =
    { $parts ->
        [noun-tail] { $noun }и { $description } { $nounTail }
       *[noun] { $noun }и { $description }
    }
style-filled-word = пуршуда
style-filled =
    { $parts ->
        [pattern] { $filled }и { $color } бо нақши { $pattern }
       *[plain] { $filled }и { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun }и { $filled }и { $color } бо нақши { $pattern }
        [plain-tail] { $noun }и { $filled }и { $color } { $nounTail }
        [pattern-tail] { $noun }и { $filled }и { $color } { $nounTail } бо нақши { $pattern }
       *[plain] { $noun }и { $filled }и { $color }
    }
# «бо ҳошияи» — "with a border of" — the izafat here sits on a word this
# catalog writes. Tajik has no indefinite article, so the two `-article`
# branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] бо ҳошияи { $border }
        [and] ва бо ҳошияи { $border }
        [and-article] ва бо ҳошияи { $border }
       *[with] бо ҳошияи { $border }
    }
style-fill =
    { $parts ->
        [pattern] пуркунии { $color } бо нақши { $pattern }
       *[plain] пуркунии { $color }
    }
style-unfilled = холӣ
style-text =
    { $parts ->
        [background] { $color } дар заминаи { $background }
       *[plain] { $color }
    }
style-background-none = нест

## Boolean words

boolean-true = дуруст
boolean-false = нодуруст

## Answer buttons

answer-submit-label = Санҷидан
answer-submit-label-no-correctness = Ҷавобро фиристодан

## Sectional blocks

section-name =
    .activity = Фаъолият
    .aside = Эзоҳи канорӣ
    .cascade = Каскад
    .definition = Таъриф
    .example = Мисол
    .exercise = Машқ
    .exercises = Машқҳо
    .given-answer = Ҷавоб
    .note = Эзоҳ
    .objectives = Ҳадафҳо
    .paragraphs = Сархатҳо
    .part = Қисм
    .problem = Масъала
    .problems = Масъалаҳо
    .proof = Исбот
    .question = Савол
    .section = Боб
    .solution = Ҳал
    .task = Супориш
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
hint-title = Маслиҳат

## Tables and figures

table-name =
    { $parts ->
        [numbered] Ҷадвали { $enumeration }
        [numbered-title] Ҷадвали { $enumeration }{ ". " }
        [unnumbered-title] Ҷадвал{ ". " }
       *[unnumbered] Ҷадвал
    }
figure-name =
    { $parts ->
        [numbered] Расми { $enumeration }
        [numbered-caption] Расми { $enumeration }{ ". " }
        [unnumbered-caption] Расм{ ". " }
       *[unnumbered] Расм
    }

## Paginator controls

paginator-previous = Қаблӣ
paginator-next = Навбатӣ
paginator-page = Саҳифа
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = ё
piecewise-condition-if = агар
piecewise-condition-otherwise = вагарна

## Chemistry

element-name =
    .h = Ҳидроген
    .he = Гелий
    .li = Литий
    .be = Бериллий
    .b = Бор
    .c = Карбон
    .n = Нитроген
    .o = Оксиген
    .f = Фтор
    .ne = Неон
    .na = Натрий
    .mg = Магний
    .al = Алюминий
    .si = Силисий
    .p = Фосфор
    .s = Сулфур
    .cl = Хлор
    .ar = Аргон
    .k = Калий
    .ca = Калсий
    .sc = Скандий
    .ti = Титан
    .v = Ванадий
    .cr = Хром
    .mn = Манган
    .fe = Оҳан
    .co = Кобалт
    .ni = Никел
    .cu = Мис
    .zn = Руҳ
    .ga = Галлий
    .ge = Германий
    .as = Арсен
    .se = Селен
    .br = Бром
    .kr = Криптон
    .rb = Рубидий
    .sr = Стронсий
    .y = Иттрий
    .zr = Сирконий
    .nb = Ниобий
    .mo = Молибден
    .tc = Технесий
    .ru = Рутений
    .rh = Родий
    .pd = Палладий
    .ag = Нуқра
    .cd = Кадмий
    .in = Индий
    .sn = Қалъагӣ
    .sb = Сурма
    .te = Теллур
    .i = Йод
    .xe = Ксенон
    .cs = Сезий
    .ba = Барий
    .la = Лантан
    .ce = Серий
    .pr = Празеодим
    .nd = Неодим
    .pm = Прометий
    .sm = Самарий
    .eu = Европий
    .gd = Гадолиний
    .tb = Тербий
    .dy = Диспрозий
    .ho = Голмий
    .er = Эрбий
    .tm = Тулий
    .yb = Иттербий
    .lu = Лютесий
    .hf = Гафний
    .ta = Тантал
    .w = Волфрам
    .re = Рений
    .os = Осмий
    .ir = Иридий
    .pt = Платина
    .au = Тилло
    .hg = Симоб
    .tl = Таллий
    .pb = Сурб
    .bi = Висмут
    .po = Полоний
    .at = Астат
    .rn = Радон
    .fr = Франсий
    .ra = Радий
    .ac = Актиний
    .th = Торий
    .pa = Протактиний
    .u = Уран
    .np = Нептуний
    .pu = Плутоний
    .am = Америсий
    .cm = Кюрий
    .bk = Берклий
    .cf = Калифорний
    .es = Эйнштейний
    .fm = Фермий
    .md = Менделевий
    .no = Нобелий
    .lr = Лоуренсий
    .rf = Резерфордий
    .db = Дубний
    .sg = Сиборгий
    .bh = Борий
    .hs = Хассий
    .mt = Мейтнерий
    .ds = Дармштадтий
    .rg = Рентгений
    .cn = Копернисий
    .nh = Нихоний
    .fl = Флеровий
    .mc = Московий
    .lv = Ливерморий
    .ts = Теннессин
    .og = Оганесон
element-anion-name =
    .h = Ҳидрид
    .c = Карбид
    .n = Нитрид
    .o = Оксид
    .f = Фторид
    .p = Фосфид
    .s = Сулфид
    .cl = Хлорид
    .br = Бромид
    .i = Йодид
    .at = Астатид
    .ts = Теннессид
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Аломати химиявии нодуруст
chemistry-invalid-ionic-compound = Пайвастагии ионии нодуруст
