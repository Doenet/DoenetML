# Bulgarian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Bulgarian has three genders and no noun cases: alone among the Slavic
# languages it lost the case system, and an adjective in front of a noun is
# spelled the same wherever the phrase lands. So every describing word below
# forks on `$gender` and on nothing else, and `$role` is never consulted.
#
# That is the whole shape of this catalog against `locales/ru`, which writes a
# `$role` branch before every gender fork. The two arguments are independent,
# and Bulgarian is the case that needs exactly one of them: the border's
# adjectives agree with «граница» (f) and the background's with «фон» (m)
# whether they stand alone or sit inside a clause, because `noun-gender`
# already answers for the head each position belongs to. `locales/et` is the
# mirror — case and no gender.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] черна
            [n] черно
           *[m] черен
        }
    .white =
        { $gender ->
            [f] бяла
            [n] бяло
           *[m] бял
        }
    .gray =
        { $gender ->
            [f] сива
            [n] сиво
           *[m] сив
        }
    .red =
        { $gender ->
            [f] червена
            [n] червено
           *[m] червен
        }
    .orange =
        { $gender ->
            [f] оранжева
            [n] оранжево
           *[m] оранжев
        }
    .yellow =
        { $gender ->
            [f] жълта
            [n] жълто
           *[m] жълт
        }
    .green =
        { $gender ->
            [f] зелена
            [n] зелено
           *[m] зелен
        }
    .cyan =
        { $gender ->
            [f] светлосиня
            [n] светлосиньо
           *[m] светлосин
        }
    .blue =
        { $gender ->
            [f] синя
            [n] синьо
           *[m] син
        }
    .purple =
        { $gender ->
            [f] лилава
            [n] лилаво
           *[m] лилав
        }
    .pink =
        { $gender ->
            [f] розова
            [n] розово
           *[m] розов
        }
    .brown =
        { $gender ->
            [f] кафява
            [n] кафяво
           *[m] кафяв
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
            [f] тънка
            [n] тънко
           *[m] тънък
        }

line-style =
    .dashed =
        { $gender ->
            [f] прекъсната
            [n] прекъснато
           *[m] прекъснат
        }
    .dotted =
        { $gender ->
            [f] пунктирана
            [n] пунктирано
           *[m] пунктиран
        }

# Bare plural noun phrases. They follow «с» in `style-filled`, and Bulgarian
# puts nothing on a noun after a preposition, so the same words stand alone in
# `style-fill`.
fill-style =
    .horizontal = хоризонтални линии
    .vertical = вертикални линии
    .diagonal = диагонални линии
    .backdiagonal = обратни диагонални линии
    .dots = точки
    .diamonds = ромбове

noun =
    .line = линия
    .line-segment = отсечка
    .ray = лъч
    .vector = вектор
    .curve = крива
    .function = функция
    .parabola = парабола
    .polyline = начупена линия
    .polygon = многоъгълник
    .triangle = триъгълник
    .rectangle = правоъгълник
    .circle = окръжност
    .region = област
    .point = точка
    .square = квадрат
    .diamond = ромб
    .cross = кръст
    .plus = плюс

# Bulgarian keeps the side count in front of the noun, so the whole of it is
# one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] правилен { $numSides }-ъгълник
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (многоъгълник, m)
# or the head of a phrase the description never names: `border` (граница, f),
# `fill` (запълване, n), `text` (текст, m), `background` (фон, m).
noun-gender =
    { $noun ->
        [line] f
        [line-segment] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [circle] f
        [region] f
        [point] f
        [border] f
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
        [f] запълнена
        [n] запълнено
       *[m] запълнен
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } с { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } с { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } с { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «граница» is feminine, so the border's adjectives agree with it rather than
# with the shape it surrounds. Bulgarian has an article but attaches it as a
# suffix and does not use it here, so the two `-article` branches read like the
# two without.
style-border-clause =
    { $parts ->
        [with-article] с { $border } граница
        [and] и { $border } граница
        [and-article] и { $border } граница
       *[with] с { $border } граница
    }

# The fill-pattern words need a noun to hang off when they stand on their own,
# so this supplies «запълване» — neuter, which is the gender `noun-gender`
# already answers for `fill`, so the colour agrees with it in both variants.
style-fill =
    { $parts ->
        [pattern] { $color } запълване с { $pattern }
       *[plain] { $color } запълване
    }

style-unfilled = незапълнен

# «текст» and «фон» are both masculine, and neither moves behind «на», so both
# colours here are the plain masculine `noun-gender` supplies.
style-text =
    { $parts ->
        [background] { $color } на { $background } фон
       *[plain] { $color }
    }

style-background-none = няма


## Boolean words

boolean-true = истина
boolean-false = лъжа


## Answer buttons

answer-submit-label = Провери
answer-submit-label-no-correctness = Изпрати отговора


## Sectional blocks

section-name =
    .activity = Дейност
    .aside = Отклонение
    .cascade = Каскада
    .definition = Определение
    .example = Пример
    .exercise = Упражнение
    .exercises = Упражнения
    .given-answer = Отговор
    .note = Забележка
    .objectives = Цели
    .paragraphs = Абзаци
    .part = Част
    .problem = Задача
    .problems = Задачи
    .proof = Доказателство
    .question = Въпрос
    .section = Раздел
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

hint-title = Подсказка


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
        [numbered] Фигура { $enumeration }
        [numbered-caption] Фигура { $enumeration }{ ". " }
        [unnumbered-caption] Фигура{ ". " }
       *[unnumbered] Фигура
    }


## Paginator controls

paginator-previous = Назад
paginator-next = Напред
paginator-page = Страница

paginator-page-status = { $pageLabel } { $currentPage } от { $numPages }


## Piecewise functions

piecewise-condition-or = или
piecewise-condition-if = ако
piecewise-condition-otherwise = иначе


## Chemistry

element-name =
    .h = Водород
    .he = Хелий
    .li = Литий
    .be = Берилий
    .b = Бор
    .c = Въглерод
    .n = Азот
    .o = Кислород
    .f = Флуор
    .ne = Неон
    .na = Натрий
    .mg = Магнезий
    .al = Алуминий
    .si = Силиций
    .p = Фосфор
    .s = Сяра
    .cl = Хлор
    .ar = Аргон
    .k = Калий
    .ca = Калций
    .sc = Скандий
    .ti = Титан
    .v = Ванадий
    .cr = Хром
    .mn = Манган
    .fe = Желязо
    .co = Кобалт
    .ni = Никел
    .cu = Мед
    .zn = Цинк
    .ga = Галий
    .ge = Германий
    .as = Арсен
    .se = Селен
    .br = Бром
    .kr = Криптон
    .rb = Рубидий
    .sr = Стронций
    .y = Итрий
    .zr = Цирконий
    .nb = Ниобий
    .mo = Молибден
    .tc = Технеций
    .ru = Рутений
    .rh = Родий
    .pd = Паладий
    .ag = Сребро
    .cd = Кадмий
    .in = Индий
    .sn = Калай
    .sb = Антимон
    .te = Телур
    .i = Йод
    .xe = Ксенон
    .cs = Цезий
    .ba = Барий
    .la = Лантан
    .ce = Церий
    .pr = Празеодим
    .nd = Неодим
    .pm = Прометий
    .sm = Самарий
    .eu = Европий
    .gd = Гадолиний
    .tb = Тербий
    .dy = Диспрозий
    .ho = Холмий
    .er = Ербий
    .tm = Тулий
    .yb = Итербий
    .lu = Лутеций
    .hf = Хафний
    .ta = Тантал
    .w = Волфрам
    .re = Рений
    .os = Осмий
    .ir = Иридий
    .pt = Платина
    .au = Злато
    .hg = Живак
    .tl = Талий
    .pb = Олово
    .bi = Бисмут
    .po = Полоний
    .at = Астат
    .rn = Радон
    .fr = Франций
    .ra = Радий
    .ac = Актиний
    .th = Торий
    .pa = Протактиний
    .u = Уран
    .np = Нептуний
    .pu = Плутоний
    .am = Америций
    .cm = Кюрий
    .bk = Берклий
    .cf = Калифорний
    .es = Айнщайний
    .fm = Фермий
    .md = Менделеевий
    .no = Нобелий
    .lr = Лоуренсий
    .rf = Ръдърфордий
    .db = Дубний
    .sg = Сиборгий
    .bh = Борий
    .hs = Хасий
    .mt = Майтнерий
    .ds = Дармщатий
    .rg = Рьонтгений
    .cn = Коперниций
    .nh = Нихоний
    .fl = Флеровий
    .mc = Московий
    .lv = Ливерморий
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
    .i = Йодид
    .at = Астатид
    .ts = Тенесид

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Невалиден химичен символ
chemistry-invalid-ionic-compound = Невалидно йонно съединение
