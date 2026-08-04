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
# izafat, which is why `style-with-noun` and `style-filled-with-noun` reverse
# the two halves rather than substituting into the English frame.
#
# The izafat is where this catalog differs from `locales/fa`, and it is the one
# place in any catalog here that an affix is written onto a placeable. In
# Persian the link after a consonant is an unwritten vowel and the space carries
# it; Tajik writes it, as «-и», and writes the same «-и» whatever the word ends
# in. So `{ $noun }и` is safe for the reason `{ $numSides }-kulmio` is safe in
# Finnish: the ending does not agree with the word in front of it, it is merely
# adjacent to it. See "An affix cannot be welded to a placeable" in the README
# for the distinction. The one case this arrangement cannot cover is a noun with
# no adjectives at all — a marker whose style names no colour — where the izafat
# is left standing on its own.


## Style vocabulary

color =
    .black = сиёҳ
    .white = сафед
    .gray = хокистарӣ
    .red = сурх
    .orange = норинҷӣ
    .yellow = зард
    .green = сабз
    .cyan = фирӯзаӣ
    .blue = кабуд
    .purple = бунафш
    .pink = гулобӣ
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
    .ray = шуоъ
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
    .square = мураббаъ
    .diamond = ромб
    .cross = салиб
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
noun-gender = none


## Style composition

# The mirror of the English order, so the adjective English puts nearest the
# noun is the one Tajik puts nearest it.
style-stroke =
    { $parts ->
        [width-style-color] { $color } { $lineStyle } { $width }
        [width-color] { $color } { $width }
        [style-color] { $color } { $lineStyle }
        [width-style] { $lineStyle } { $width }
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
    .si = Силитсий
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
    .as = Мышьяк
    .se = Селен
    .br = Бром
    .kr = Криптон
    .rb = Рубидий
    .sr = Стронсий
    .y = Иттрий
    .zr = Сирконий
    .nb = Ниобий
    .mo = Молибден
    .tc = Технетсий
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
    .lu = Лютетсий
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
    .am = Америтсий
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
    .cn = Копернитсий
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
