# Russian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Russian inflects, and it has three genders. Adjectives precede their noun and
# agree with it, so every adjective below selects on `$gender` with `m`, `f`
# and `n`, and the composition messages keep the English adjective-then-noun
# order. Every description is a standalone phrase in the nominative, which is
# what lets one form per gender be enough.


## Style vocabulary

color =
    .black =
        { $gender ->
            [insf] чёрной
            [f] чёрная
            [n] чёрное
           *[m] чёрный
        }
    .white =
        { $gender ->
            [insf] белой
            [f] белая
            [n] белое
           *[m] белый
        }
    .gray =
        { $gender ->
            [insf] серой
            [f] серая
            [n] серое
           *[m] серый
        }
    .red =
        { $gender ->
            [insf] красной
            [f] красная
            [n] красное
           *[m] красный
        }
    .orange =
        { $gender ->
            [insf] оранжевой
            [f] оранжевая
            [n] оранжевое
           *[m] оранжевый
        }
    .yellow =
        { $gender ->
            [insf] жёлтой
            [f] жёлтая
            [n] жёлтое
           *[m] жёлтый
        }
    .green =
        { $gender ->
            [insf] зелёной
            [f] зелёная
            [n] зелёное
           *[m] зелёный
        }
    .cyan =
        { $gender ->
            [insf] голубой
            [f] голубая
            [n] голубое
           *[m] голубой
        }
    .blue =
        { $gender ->
            [insf] синей
            [f] синяя
            [n] синее
           *[m] синий
        }
    .purple =
        { $gender ->
            [insf] фиолетовой
            [f] фиолетовая
            [n] фиолетовое
           *[m] фиолетовый
        }
    .pink =
        { $gender ->
            [insf] розовой
            [f] розовая
            [n] розовое
           *[m] розовый
        }
    .brown =
        { $gender ->
            [insf] коричневой
            [f] коричневая
            [n] коричневое
           *[m] коричневый
        }

line-width =
    .thick =
        { $gender ->
            [insf] толстой
            [f] толстая
            [n] толстое
           *[m] толстый
        }
    .thin =
        { $gender ->
            [insf] тонкой
            [f] тонкая
            [n] тонкое
           *[m] тонкий
        }

line-style =
    .dashed =
        { $gender ->
            [insf] штриховой
            [f] штриховая
            [n] штриховое
           *[m] штриховой
        }
    .dotted =
        { $gender ->
            [insf] пунктирной
            [f] пунктирная
            [n] пунктирное
           *[m] пунктирный
        }

# Noun phrases in the instrumental, which is the case «с» takes. They agree
# with nothing.
fill-style =
    .horizontal = горизонтальными линиями
    .vertical = вертикальными линиями
    .diagonal = диагональными линиями
    .backdiagonal = обратными диагональными линиями
    .dots = точками
    .diamonds = ромбами

noun =
    .line = прямая
    .line-segment = отрезок
    .ray = луч
    .vector = вектор
    .curve = кривая
    .function = функция
    .parabola = парабола
    .polyline = ломаная
    .polygon = многоугольник
    .triangle = треугольник
    .rectangle = прямоугольник
    .circle = окружность
    .region = область
    .point = точка
    .square = квадрат
    .diamond = ромб
    .cross = крест
    .plus = знак плюс

# Russian keeps the side count in front of the noun, so the whole thing is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] правильный { $numSides }-угольник
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (многоугольник, m)
# or the head of a phrase the description never names: `border` (граница, f),
# `fill` (заливка, f), `text` (текст, m), `background` (фон, m).
#
# `border` answers `insf` — feminine *instrumental* — rather than plain `f`,
# because the only place its adjectives are rendered is after «с» in
# `style-border-clause`, and «с» governs the instrumental: «с толстой
# границей», not «с толстая границей». `$gender` is a single token that this
# catalog chooses the meaning of, so carrying a case in it is what the
# mechanism allows; what it cannot do is carry two, and
# `borderStyleDescription` — the state variable that renders a border's style
# on its own, with no preposition — therefore also comes out instrumental.
# Fixing that properly means the code passing a case alongside the gender.
noun-gender =
    { $noun ->
        [line] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [circle] f
        [region] f
        [point] f
        [border] insf
        [fill] f
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
        [insf] закрашенной
        [f] закрашенная
        [n] закрашенное
       *[m] закрашенный
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

# «граница» is feminine, so the border's adjectives agree with it and not with
# the shape it surrounds. Russian has no article, so the two article branches
# read the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] с { $border } границей
        [and] и { $border } границей
        [and-article] и { $border } границей
       *[with] с { $border } границей
    }

# «цвета» avoids having to agree the colour with a plural pattern noun.
style-fill =
    { $parts ->
        [pattern] { $pattern } цвета { $color }
       *[plain] { $color }
    }

style-unfilled = незакрашенный

style-text =
    { $parts ->
        [background] { $color } на { $background } фоне
       *[plain] { $color }
    }

style-background-none = нет


## Boolean words

boolean-true = истина
boolean-false = ложь


## Answer buttons

answer-submit-label = Проверить
answer-submit-label-no-correctness = Отправить ответ


## Sectional blocks

section-name =
    .activity = Задание
    .aside = Отступление
    .cascade = Каскад
    .definition = Определение
    .example = Пример
    .exercise = Упражнение
    .exercises = Упражнения
    .given-answer = Ответ
    .note = Замечание
    .objectives = Цели
    .paragraphs = Абзацы
    .part = Часть
    .problem = Задача
    .problems = Задачи
    .proof = Доказательство
    .question = Вопрос
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
        [numbered] Рисунок { $enumeration }
        [numbered-caption] Рисунок { $enumeration }{ ". " }
        [unnumbered-caption] Рисунок{ ". " }
       *[unnumbered] Рисунок
    }


## Paginator controls

paginator-previous = Назад
paginator-next = Вперёд
paginator-page = Страница

paginator-page-status = { $pageLabel } { $currentPage } из { $numPages }


## Piecewise functions

piecewise-condition-or = или
piecewise-condition-if = если
piecewise-condition-otherwise = иначе


## Chemistry

element-name =
    .h = Водород
    .he = Гелий
    .li = Литий
    .be = Бериллий
    .b = Бор
    .c = Углерод
    .n = Азот
    .o = Кислород
    .f = Фтор
    .ne = Неон
    .na = Натрий
    .mg = Магний
    .al = Алюминий
    .si = Кремний
    .p = Фосфор
    .s = Сера
    .cl = Хлор
    .ar = Аргон
    .k = Калий
    .ca = Кальций
    .sc = Скандий
    .ti = Титан
    .v = Ванадий
    .cr = Хром
    .mn = Марганец
    .fe = Железо
    .co = Кобальт
    .ni = Никель
    .cu = Медь
    .zn = Цинк
    .ga = Галлий
    .ge = Германий
    .as = Мышьяк
    .se = Селен
    .br = Бром
    .kr = Криптон
    .rb = Рубидий
    .sr = Стронций
    .y = Иттрий
    .zr = Цирконий
    .nb = Ниобий
    .mo = Молибден
    .tc = Технеций
    .ru = Рутений
    .rh = Родий
    .pd = Палладий
    .ag = Серебро
    .cd = Кадмий
    .in = Индий
    .sn = Олово
    .sb = Сурьма
    .te = Теллур
    .i = Иод
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
    .ho = Гольмий
    .er = Эрбий
    .tm = Тулий
    .yb = Иттербий
    .lu = Лютеций
    .hf = Гафний
    .ta = Тантал
    .w = Вольфрам
    .re = Рений
    .os = Осмий
    .ir = Иридий
    .pt = Платина
    .au = Золото
    .hg = Ртуть
    .tl = Таллий
    .pb = Свинец
    .bi = Висмут
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
    .cn = Коперниций
    .nh = Нихоний
    .fl = Флеровий
    .mc = Московий
    .lv = Ливерморий
    .ts = Теннессин
    .og = Оганесон

element-anion-name =
    .h = Гидрид
    .c = Карбид
    .n = Нитрид
    .o = Оксид
    .f = Фторид
    .p = Фосфид
    .s = Сульфид
    .cl = Хлорид
    .br = Бромид
    .i = Иодид
    .at = Астатид
    .ts = Теннессид

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Недопустимый химический символ
chemistry-invalid-ionic-compound = Недопустимое ионное соединение
