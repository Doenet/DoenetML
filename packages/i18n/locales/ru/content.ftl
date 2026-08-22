# Russian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Russian inflects, and it has three genders. Adjectives precede their noun and
# agree with it in gender and in the case their position governs, so every
# adjective below selects on `$role` first — which position the words are going
# into — and only then, where it matters, on `$gender`:
#
#   standalone          a phrase in the nominative: `-ый`/`-ой` m, `-ая` f,
#                       `-ое` n
#   border-clause       after «с», which governs the instrumental, of
#                       «граница» — feminine: `-ой`
#   background-clause   after «на … фоне», prepositional, of «фон» —
#                       masculine: `-ом` (`-ем` after a soft stem)
#   text-clause         nominative masculine, agreeing with «текст»
#
# The last three need no gender branch: each is only ever used of one noun, and
# that noun's gender is fixed.
#
# This replaces the `insf` token an earlier seed carried inside `$gender`. One
# token could hold a gender or a case but not both, so whichever of the two
# positions it was tuned for, the other came out wrong (#1606).


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] чёрной
            [background-clause] чёрном
            [text-clause] чёрный
           *[standalone]
                { $gender ->
                    [f] чёрная
                    [n] чёрное
                   *[m] чёрный
                }
        }
    .white =
        { $role ->
            [border-clause] белой
            [background-clause] белом
            [text-clause] белый
           *[standalone]
                { $gender ->
                    [f] белая
                    [n] белое
                   *[m] белый
                }
        }
    .gray =
        { $role ->
            [border-clause] серой
            [background-clause] сером
            [text-clause] серый
           *[standalone]
                { $gender ->
                    [f] серая
                    [n] серое
                   *[m] серый
                }
        }
    .red =
        { $role ->
            [border-clause] красной
            [background-clause] красном
            [text-clause] красный
           *[standalone]
                { $gender ->
                    [f] красная
                    [n] красное
                   *[m] красный
                }
        }
    .orange =
        { $role ->
            [border-clause] оранжевой
            [background-clause] оранжевом
            [text-clause] оранжевый
           *[standalone]
                { $gender ->
                    [f] оранжевая
                    [n] оранжевое
                   *[m] оранжевый
                }
        }
    .yellow =
        { $role ->
            [border-clause] жёлтой
            [background-clause] жёлтом
            [text-clause] жёлтый
           *[standalone]
                { $gender ->
                    [f] жёлтая
                    [n] жёлтое
                   *[m] жёлтый
                }
        }
    .green =
        { $role ->
            [border-clause] зелёной
            [background-clause] зелёном
            [text-clause] зелёный
           *[standalone]
                { $gender ->
                    [f] зелёная
                    [n] зелёное
                   *[m] зелёный
                }
        }
    .cyan =
        { $role ->
            [border-clause] голубой
            [background-clause] голубом
            [text-clause] голубой
           *[standalone]
                { $gender ->
                    [f] голубая
                    [n] голубое
                   *[m] голубой
                }
        }
    .blue =
        { $role ->
            [border-clause] синей
            [background-clause] синем
            [text-clause] синий
           *[standalone]
                { $gender ->
                    [f] синяя
                    [n] синее
                   *[m] синий
                }
        }
    .purple =
        { $role ->
            [border-clause] фиолетовой
            [background-clause] фиолетовом
            [text-clause] фиолетовый
           *[standalone]
                { $gender ->
                    [f] фиолетовая
                    [n] фиолетовое
                   *[m] фиолетовый
                }
        }
    .pink =
        { $role ->
            [border-clause] розовой
            [background-clause] розовом
            [text-clause] розовый
           *[standalone]
                { $gender ->
                    [f] розовая
                    [n] розовое
                   *[m] розовый
                }
        }
    .brown =
        { $role ->
            [border-clause] коричневой
            [background-clause] коричневом
            [text-clause] коричневый
           *[standalone]
                { $gender ->
                    [f] коричневая
                    [n] коричневое
                   *[m] коричневый
                }
        }
line-width =
    .thick =
        { $role ->
            [border-clause] толстой
            [background-clause] толстом
            [text-clause] толстый
           *[standalone]
                { $gender ->
                    [f] толстая
                    [n] толстое
                   *[m] толстый
                }
        }
    .thin =
        { $role ->
            [border-clause] тонкой
            [background-clause] тонком
            [text-clause] тонкий
           *[standalone]
                { $gender ->
                    [f] тонкая
                    [n] тонкое
                   *[m] тонкий
                }
        }
line-style =
    .dashed =
        { $role ->
            [border-clause] штриховой
            [background-clause] штриховом
            [text-clause] штриховой
           *[standalone]
                { $gender ->
                    [f] штриховая
                    [n] штриховое
                   *[m] штриховой
                }
        }
    .dotted =
        { $role ->
            [border-clause] пунктирной
            [background-clause] пунктирном
            [text-clause] пунктирный
           *[standalone]
                { $gender ->
                    [f] пунктирная
                    [n] пунктирное
                   *[m] пунктирный
                }
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
# Every one of them answers a plain gender now. `border` used to answer a case
# instead — `insf` — because its adjectives are rendered in two positions and a
# single token could only suit one of them; it was tuned for the clause, so the
# standalone `borderStyleDescription` came out instrumental. `background` kept
# its plain gender and so was wrong the other way round, nominative behind
# «на». `$role` carries the distinction now, and this message is back to
# answering the one question its name asks (#1606).
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
        [border] f
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
# Only ever said of the shape itself, so it is standalone in every
# description and takes no `$role` branch.
style-filled-word =
    { $gender ->
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
# The fill-pattern words are instrumental plurals, because their other use is
# the «с { $pattern }» clause in `style-filled`. So this message supplies a
# noun for them to hang off — «заливка», feminine, which is the gender
# `noun-gender` already answers for `fill`, so the colour agrees with it in
# both variants.
style-fill =
    { $parts ->
        [pattern] { $color } заливка с { $pattern }
       *[plain] { $color } заливка
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
