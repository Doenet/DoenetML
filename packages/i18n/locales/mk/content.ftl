# Macedonian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Macedonian has three genders and, like Bulgarian, no noun cases. So every
# describing word below forks on `$gender` and never on `$role`, for the reason
# `locales/bg` sets out at length: `noun-gender` already answers for the head
# each position belongs to, and nothing about that head changes when the phrase
# is embedded.
#
# Where it parts from Bulgarian is which gender those heads are. «позадина» is
# feminine here and «фон» is masculine there, so the two catalogs put different
# forms of the same colour behind the same preposition — which is the argument
# doing its job, since neither catalog had to say anything about the other.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] црна
            [n] црно
           *[m] црн
        }
    .white =
        { $gender ->
            [f] бела
            [n] бело
           *[m] бел
        }
    .gray =
        { $gender ->
            [f] сива
            [n] сиво
           *[m] сив
        }
    .red =
        { $gender ->
            [f] црвена
            [n] црвено
           *[m] црвен
        }
    .orange =
        { $gender ->
            [f] портокалова
            [n] портокалово
           *[m] портокалов
        }
    .yellow =
        { $gender ->
            [f] жолта
            [n] жолто
           *[m] жолт
        }
    .green =
        { $gender ->
            [f] зелена
            [n] зелено
           *[m] зелен
        }
    .cyan =
        { $gender ->
            [f] светлосина
            [n] светлосино
           *[m] светлосин
        }
    .blue =
        { $gender ->
            [f] сина
            [n] сино
           *[m] син
        }
    .purple =
        { $gender ->
            [f] виолетова
            [n] виолетово
           *[m] виолетов
        }
    .pink =
        { $gender ->
            [f] розова
            [n] розово
           *[m] розов
        }
    .brown =
        { $gender ->
            [f] кафеава
            [n] кафеаво
           *[m] кафеав
        }
line-width =
    .thick =
        { $gender ->
            [f] дебела
            [n] дебело
           *[m] дебел
        }
    .thin =
        { $gender ->
            [f] тенка
            [n] тенко
           *[m] тенок
        }
line-style =
    .dashed =
        { $gender ->
            [f] испрекината
            [n] испрекинато
           *[m] испрекинат
        }
    .dotted =
        { $gender ->
            [f] точкеста
            [n] точкесто
           *[m] точкест
        }
# Bare plural noun phrases. Macedonian puts nothing on a noun behind «со», so
# the words that follow that preposition in `style-filled` are the same ones
# that stand alone in `style-fill`.
fill-style =
    .horizontal = хоризонтални линии
    .vertical = вертикални линии
    .diagonal = дијагонални линии
    .backdiagonal = обратни дијагонални линии
    .dots = точки
    .diamonds = ромбови
noun =
    .line = права
    .line-segment = отсечка
    .ray = полуправа
    .vector = вектор
    .curve = крива
    .function = функција
    .parabola = парабола
    .polyline = искршена линија
    .polygon = многуаголник
    .triangle = триаголник
    .rectangle = правоаголник
    .circle = кружница
    .region = област
    .point = точка
    .square = квадрат
    .diamond = ромб
    .cross = крст
    .plus = плус
# Macedonian keeps the side count in front of the noun, so the whole of it is
# one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] правилен { $numSides }-аголник
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (многуаголник, m)
# or the head of a phrase the description never names: `border` (граница, f),
# `fill` (исполнување, n), `text` (текст, m), `background` (позадина, f).
noun-gender =
    { $noun ->
        [line] f
        [line-segment] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [circle] f
        [region] f
        [point] f
        [border] f
        [background] f
        [fill] n
       *[other] m
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
style-filled-word =
    { $gender ->
        [f] исполнета
        [n] исполнето
       *[m] исполнет
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } со { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } со { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } со { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «граница» is feminine, so the border's adjectives agree with it rather than
# with the shape it surrounds. The article is a suffix and is not used here, so
# the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] со { $border } граница
        [and] и { $border } граница
        [and-article] и { $border } граница
       *[with] со { $border } граница
    }
# The fill-pattern words need a noun to hang off when they stand on their own,
# so this supplies «исполнување» — neuter, which is the gender `noun-gender`
# already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] { $color } исполнување со { $pattern }
       *[plain] { $color } исполнување
    }
style-unfilled = неисполнет
# «текст» is masculine and «позадина» feminine, so the two colours here take
# two different endings — from `noun-gender` alone, with no `$role` involved.
style-text =
    { $parts ->
        [background] { $color } на { $background } позадина
       *[plain] { $color }
    }
style-background-none = нема

## Boolean words

boolean-true = точно
boolean-false = неточно

## Answer buttons

answer-submit-label = Провери
answer-submit-label-no-correctness = Испрати одговор

## Sectional blocks

section-name =
    .activity = Активност
    .aside = Осврт
    .cascade = Каскада
    .definition = Дефиниција
    .example = Пример
    .exercise = Вежба
    .exercises = Вежби
    .given-answer = Одговор
    .note = Забелешка
    .objectives = Цели
    .paragraphs = Пасуси
    .part = Дел
    .problem = Задача
    .problems = Задачи
    .proof = Доказ
    .question = Прашање
    .section = Оддел
    .solution = Решение
    .task = Задача
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
hint-title = Совет

## Tables and figures

table-name =
    { $parts ->
        [numbered] Табела { $enumeration }
        [numbered-title] Табела { $enumeration }{ ". " }
        [unnumbered-title] Табела{ ". " }
       *[unnumbered] Табела
    }
figure-name =
    { $parts ->
        [numbered] Слика { $enumeration }
        [numbered-caption] Слика { $enumeration }{ ". " }
        [unnumbered-caption] Слика{ ". " }
       *[unnumbered] Слика
    }

## Paginator controls

paginator-previous = Претходна
paginator-next = Следна
paginator-page = Страница
paginator-page-status = { $pageLabel } { $currentPage } од { $numPages }

## Piecewise functions

piecewise-condition-or = или
piecewise-condition-if = ако
piecewise-condition-otherwise = инаку

## Chemistry

element-name =
    .h = Водород
    .he = Хелиум
    .li = Литиум
    .be = Берилиум
    .b = Бор
    .c = Јаглерод
    .n = Азот
    .o = Кислород
    .f = Флуор
    .ne = Неон
    .na = Натриум
    .mg = Магнезиум
    .al = Алуминиум
    .si = Силициум
    .p = Фосфор
    .s = Сулфур
    .cl = Хлор
    .ar = Аргон
    .k = Калиум
    .ca = Калциум
    .sc = Скандиум
    .ti = Титан
    .v = Ванадиум
    .cr = Хром
    .mn = Манган
    .fe = Железо
    .co = Кобалт
    .ni = Никел
    .cu = Бакар
    .zn = Цинк
    .ga = Галиум
    .ge = Германиум
    .as = Арсен
    .se = Селен
    .br = Бром
    .kr = Криптон
    .rb = Рубидиум
    .sr = Стронциум
    .y = Итриум
    .zr = Циркониум
    .nb = Ниобиум
    .mo = Молибден
    .tc = Технециум
    .ru = Рутениум
    .rh = Родиум
    .pd = Паладиум
    .ag = Сребро
    .cd = Кадмиум
    .in = Индиум
    .sn = Калај
    .sb = Антимон
    .te = Телур
    .i = Јод
    .xe = Ксенон
    .cs = Цезиум
    .ba = Бариум
    .la = Лантан
    .ce = Цериум
    .pr = Празеодиум
    .nd = Неодиум
    .pm = Прометиум
    .sm = Самариум
    .eu = Европиум
    .gd = Гадолиниум
    .tb = Тербиум
    .dy = Диспрозиум
    .ho = Холмиум
    .er = Ербиум
    .tm = Тулиум
    .yb = Итербиум
    .lu = Лутециум
    .hf = Хафниум
    .ta = Тантал
    .w = Волфрам
    .re = Рениум
    .os = Осмиум
    .ir = Иридиум
    .pt = Платина
    .au = Злато
    .hg = Жива
    .tl = Талиум
    .pb = Олово
    .bi = Бизмут
    .po = Полониум
    .at = Астат
    .rn = Радон
    .fr = Франциум
    .ra = Радиум
    .ac = Актиниум
    .th = Ториум
    .pa = Протактиниум
    .u = Ураниум
    .np = Нептуниум
    .pu = Плутониум
    .am = Америциум
    .cm = Кириум
    .bk = Берклиум
    .cf = Калифорниум
    .es = Ајнштајниум
    .fm = Фермиум
    .md = Менделевиум
    .no = Нобелиум
    .lr = Лоренсиум
    .rf = Радерфордиум
    .db = Дубниум
    .sg = Сиборгиум
    .bh = Бориум
    .hs = Хасиум
    .mt = Мајтнериум
    .ds = Дармштатиум
    .rg = Рентгениум
    .cn = Копернициум
    .nh = Нихониум
    .fl = Флеровиум
    .mc = Московиум
    .lv = Ливермориум
    .ts = Тенесин
    .og = Оганесон
element-anion-name =
    .h = Хидрид
    .c = Карбид
    .n = Нитрид
    .o = Оксид
    .f = Флуорид
    .p = Фосфид
    .s = Сулфид
    .cl = Хлорид
    .br = Бромид
    .i = Јодид
    .at = Астатид
    .ts = Тенесид
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Невалиден хемиски симбол
chemistry-invalid-ionic-compound = Невалидно јонско соединение
