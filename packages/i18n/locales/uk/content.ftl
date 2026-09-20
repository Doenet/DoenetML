# Ukrainian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Ukrainian inflects for gender *and* for case, so every adjective below
# selects on `$role` first — which position the words are going into — and then
# on `$gender` where the answer still depends on one:
#
#   standalone          nominative, agreeing with the noun described:
#                       `-ий`/`-ій` m, `-а`/`-я` f, `-е`/`-є` n
#   border-clause       instrumental after «з», of «рамка» — feminine: `-ою`
#   background-clause   locative after «на», of «тло» — neuter: `-ому`
#   text-clause         nominative masculine, agreeing with «текст»
#
# The last three need no gender branch: each is used of exactly one noun, and
# that noun's gender is fixed.
#
# «синій» is the one soft-stem adjective here, so its endings are spelled
# `-я`/`-є`/`-ьою`/`-ьому` where the hard stems take `-а`/`-е`/`-ою`/`-ому`.
#
# Adjectives precede their noun, as in English, so the composition messages
# keep the English order.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] чорною
            [background-clause] чорному
            [text-clause] чорний
           *[standalone]
                { $gender ->
                    [f] чорна
                    [n] чорне
                   *[m] чорний
                }
        }
    .white =
        { $role ->
            [border-clause] білою
            [background-clause] білому
            [text-clause] білий
           *[standalone]
                { $gender ->
                    [f] біла
                    [n] біле
                   *[m] білий
                }
        }
    .gray =
        { $role ->
            [border-clause] сірою
            [background-clause] сірому
            [text-clause] сірий
           *[standalone]
                { $gender ->
                    [f] сіра
                    [n] сіре
                   *[m] сірий
                }
        }
    .red =
        { $role ->
            [border-clause] червоною
            [background-clause] червоному
            [text-clause] червоний
           *[standalone]
                { $gender ->
                    [f] червона
                    [n] червоне
                   *[m] червоний
                }
        }
    .orange =
        { $role ->
            [border-clause] помаранчевою
            [background-clause] помаранчевому
            [text-clause] помаранчевий
           *[standalone]
                { $gender ->
                    [f] помаранчева
                    [n] помаранчеве
                   *[m] помаранчевий
                }
        }
    .yellow =
        { $role ->
            [border-clause] жовтою
            [background-clause] жовтому
            [text-clause] жовтий
           *[standalone]
                { $gender ->
                    [f] жовта
                    [n] жовте
                   *[m] жовтий
                }
        }
    .green =
        { $role ->
            [border-clause] зеленою
            [background-clause] зеленому
            [text-clause] зелений
           *[standalone]
                { $gender ->
                    [f] зелена
                    [n] зелене
                   *[m] зелений
                }
        }
    .cyan =
        { $role ->
            [border-clause] блакитною
            [background-clause] блакитному
            [text-clause] блакитний
           *[standalone]
                { $gender ->
                    [f] блакитна
                    [n] блакитне
                   *[m] блакитний
                }
        }
    .blue =
        { $role ->
            [border-clause] синьою
            [background-clause] синьому
            [text-clause] синій
           *[standalone]
                { $gender ->
                    [f] синя
                    [n] синє
                   *[m] синій
                }
        }
    .purple =
        { $role ->
            [border-clause] фіолетовою
            [background-clause] фіолетовому
            [text-clause] фіолетовий
           *[standalone]
                { $gender ->
                    [f] фіолетова
                    [n] фіолетове
                   *[m] фіолетовий
                }
        }
    .pink =
        { $role ->
            [border-clause] рожевою
            [background-clause] рожевому
            [text-clause] рожевий
           *[standalone]
                { $gender ->
                    [f] рожева
                    [n] рожеве
                   *[m] рожевий
                }
        }
    .brown =
        { $role ->
            [border-clause] коричневою
            [background-clause] коричневому
            [text-clause] коричневий
           *[standalone]
                { $gender ->
                    [f] коричнева
                    [n] коричневе
                   *[m] коричневий
                }
        }
line-width =
    .thick =
        { $role ->
            [border-clause] товстою
            [background-clause] товстому
            [text-clause] товстий
           *[standalone]
                { $gender ->
                    [f] товста
                    [n] товсте
                   *[m] товстий
                }
        }
    .thin =
        { $role ->
            [border-clause] тонкою
            [background-clause] тонкому
            [text-clause] тонкий
           *[standalone]
                { $gender ->
                    [f] тонка
                    [n] тонке
                   *[m] тонкий
                }
        }
line-style =
    .dashed =
        { $role ->
            [border-clause] штриховою
            [background-clause] штриховому
            [text-clause] штриховий
           *[standalone]
                { $gender ->
                    [f] штрихова
                    [n] штрихове
                   *[m] штриховий
                }
        }
    .dotted =
        { $role ->
            [border-clause] пунктирною
            [background-clause] пунктирному
            [text-clause] пунктирний
           *[standalone]
                { $gender ->
                    [f] пунктирна
                    [n] пунктирне
                   *[m] пунктирний
                }
        }
# Noun phrases in the accusative plural, which is the case «у» takes when it
# names a pattern — «у ромби», the way Ukrainian describes patterned cloth.
# The accusative plural of an inanimate noun is spelled like the nominative,
# so the same words serve `style-fill`, where they stand on their own.
fill-style =
    .horizontal = горизонтальні лінії
    .vertical = вертикальні лінії
    .diagonal = діагональні лінії
    .backdiagonal = зворотні діагональні лінії
    .dots = крапки
    .diamonds = ромби
noun =
    .line = пряма
    .line-segment = відрізок
    .ray = промінь
    .vector = вектор
    .curve = крива
    .function = функція
    .parabola = парабола
    .polyline = ламана
    .polygon = многокутник
    .triangle = трикутник
    .rectangle = прямокутник
    .circle = коло
    .region = область
    .point = точка
    .square = квадрат
    .diamond = ромб
    .cross = хрестик
    .plus = плюс
# Ukrainian counts the sides after the noun, so the count closes the phrase
# behind the adjectives: «товстий червоний правильний многокутник із 5
# сторонами».
noun-regular-polygon =
    { $part ->
        [tail] із { $numSides } сторонами
       *[head] правильний многокутник
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (многокутник, m) or
# the head of a phrase the description never names: `border` (рамка, f), `fill`
# (заливка, f), `text` (текст, m), `background` (тло, n).
noun-gender =
    { $noun ->
        [line] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [region] f
        [point] f
        [border] f
        [fill] f
        [circle] n
        [background] n
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
# Adjectives precede the noun, and the complement closes the phrase.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
# Only ever said of the shape itself, so it is standalone in every description
# and takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] заповнена
        [n] заповнене
       *[m] заповнений
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } у { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } у { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } у { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «з» governs the instrumental, which the `border-clause` branch of every
# adjective supplies. Ukrainian has no article, so the `-article` branches read
# the same as the ones without.
#
# The `and-` branches keep a «з» of their own. English lets one "with" cover
# both the fill pattern and the border, but Ukrainian names a pattern with «у»
# and the accusative, and that preposition cannot reach the instrumental behind
# it — so «і з … рамкою», never a bare «і».
style-border-clause =
    { $parts ->
        [with-article] з { $border } рамкою
        [and] і з { $border } рамкою
        [and-article] і з { $border } рамкою
       *[with] з { $border } рамкою
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = незаповнений
# «на» governs the locative, which is what the `background-clause` branch of
# every adjective supplies — «на чорному тлі».
style-text =
    { $parts ->
        [background] { $color } на { $background } тлі
       *[plain] { $color }
    }
style-background-none = немає

## Boolean words

boolean-true = істина
boolean-false = хиба

## Answer buttons

answer-submit-label = Перевірити
answer-submit-label-no-correctness = Надіслати відповідь

## Sectional blocks

section-name =
    .activity = Активність
    .aside = Ремарка
    .cascade = Каскад
    .definition = Означення
    .example = Приклад
    .exercise = Вправа
    .exercises = Вправи
    .given-answer = Відповідь
    .note = Зауваження
    .objectives = Цілі
    .paragraphs = Абзаци
    .part = Частина
    .problem = Задача
    .problems = Задачі
    .proof = Доведення
    .question = Питання
    .section = Розділ
    .solution = Розв'язання
    .task = Завдання
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
hint-title = Підказка

## Tables and figures

table-name =
    { $parts ->
        [numbered] Таблиця { $enumeration }
        [numbered-title] Таблиця { $enumeration }{ ": " }
        [unnumbered-title] Таблиця{ ": " }
       *[unnumbered] Таблиця
    }
figure-name =
    { $parts ->
        [numbered] Рисунок { $enumeration }
        [numbered-caption] Рисунок { $enumeration }{ ": " }
        [unnumbered-caption] Рисунок{ ": " }
       *[unnumbered] Рисунок
    }

## Paginator controls

paginator-previous = Попередня
paginator-next = Наступна
paginator-page = Сторінка
paginator-page-status = { $pageLabel } { $currentPage } з { $numPages }

## Piecewise functions

piecewise-condition-or = або
piecewise-condition-if = якщо
piecewise-condition-otherwise = інакше

## Chemistry
##
## The names Ukrainian school chemistry gives the elements themselves, which
## since the nomenclature reform are the Latin-derived forms — Гідроген,
## Карбон, Ферум — rather than the names of the simple substances (водень,
## вуглець, залізо). What the atom database keys on is the symbol, which is
## never translated either way.

element-name =
    .h = Гідроген
    .he = Гелій
    .li = Літій
    .be = Берилій
    .b = Бор
    .c = Карбон
    .n = Нітроген
    .o = Оксиген
    .f = Флуор
    .ne = Неон
    .na = Натрій
    .mg = Магній
    .al = Алюміній
    .si = Силіцій
    .p = Фосфор
    .s = Сульфур
    .cl = Хлор
    .ar = Аргон
    .k = Калій
    .ca = Кальцій
    .sc = Скандій
    .ti = Титан
    .v = Ванадій
    .cr = Хром
    .mn = Манган
    .fe = Ферум
    .co = Кобальт
    .ni = Нікель
    .cu = Купрум
    .zn = Цинк
    .ga = Галій
    .ge = Германій
    .as = Арсен
    .se = Селен
    .br = Бром
    .kr = Криптон
    .rb = Рубідій
    .sr = Стронцій
    .y = Ітрій
    .zr = Цирконій
    .nb = Ніобій
    .mo = Молібден
    .tc = Технецій
    .ru = Рутеній
    .rh = Родій
    .pd = Паладій
    .ag = Аргентум
    .cd = Кадмій
    .in = Індій
    .sn = Станум
    .sb = Стибій
    .te = Телур
    .i = Йод
    .xe = Ксенон
    .cs = Цезій
    .ba = Барій
    .la = Лантан
    .ce = Церій
    .pr = Празеодим
    .nd = Неодим
    .pm = Прометій
    .sm = Самарій
    .eu = Європій
    .gd = Гадоліній
    .tb = Тербій
    .dy = Диспрозій
    .ho = Гольмій
    .er = Ербій
    .tm = Тулій
    .yb = Ітербій
    .lu = Лютецій
    .hf = Гафній
    .ta = Тантал
    .w = Вольфрам
    .re = Реній
    .os = Осмій
    .ir = Іридій
    .pt = Платина
    .au = Аурум
    .hg = Меркурій
    .tl = Талій
    .pb = Плюмбум
    .bi = Бісмут
    .po = Полоній
    .at = Астат
    .rn = Радон
    .fr = Францій
    .ra = Радій
    .ac = Актиній
    .th = Торій
    .pa = Протактиній
    .u = Уран
    .np = Нептуній
    .pu = Плутоній
    .am = Америцій
    .cm = Кюрій
    .bk = Берклій
    .cf = Каліфорній
    .es = Ейнштейній
    .fm = Фермій
    .md = Менделевій
    .no = Нобелій
    .lr = Лоуренсій
    .rf = Резерфордій
    .db = Дубній
    .sg = Сиборгій
    .bh = Борій
    .hs = Гасій
    .mt = Мейтнерій
    .ds = Дармштадтій
    .rg = Рентгеній
    .cn = Коперніцій
    .nh = Ніхоній
    .fl = Флеровій
    .mc = Московій
    .lv = Ліверморій
    .ts = Теннессін
    .og = Оганесон
element-anion-name =
    .h = Гідрид
    .c = Карбід
    .n = Нітрид
    .o = Оксид
    .f = Фторид
    .p = Фосфід
    .s = Сульфід
    .cl = Хлорид
    .br = Бромід
    .i = Йодид
    .at = Астатид
    .ts = Теннессид
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Некоректний хімічний символ
chemistry-invalid-ionic-compound = Некоректна йонна сполука
