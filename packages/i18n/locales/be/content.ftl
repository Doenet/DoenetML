# Belarusian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Belarusian inflects and has three genders. Adjectives precede their noun and
# agree with it in gender and in the case its position governs, so every
# describing word below selects on `$role` first and only then, where it
# matters, on `$gender`:
#
#   standalone          nominative: `-ы`/`-і` m, `-ая`/`-яя` f, `-ае`/`-яе` n
#   border-clause       after «з», which governs the instrumental, of «рамка» —
#                       feminine: `-ай`/`-яй`
#   background-clause   after «на … фоне», locative, of «фон» — masculine:
#                       `-ым`/`-ім`
#   text-clause         nominative masculine, agreeing with «тэкст»
#
# Written in the official orthography. This is `locales/ru`'s grammar with
# Belarusian's own words and endings, and the two catalogs pick different nouns
# for the same two clause heads — «рамка» here against «граница» there — which
# is why the border's instrumental is spelled `-ай` in one and `-ой` in the
# other.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] чорнай
            [background-clause] чорным
            [text-clause] чорны
           *[standalone]
                { $gender ->
                    [f] чорная
                    [n] чорнае
                   *[m] чорны
                }
        }
    .white =
        { $role ->
            [border-clause] белай
            [background-clause] белым
            [text-clause] белы
           *[standalone]
                { $gender ->
                    [f] белая
                    [n] белае
                   *[m] белы
                }
        }
    .gray =
        { $role ->
            [border-clause] шэрай
            [background-clause] шэрым
            [text-clause] шэры
           *[standalone]
                { $gender ->
                    [f] шэрая
                    [n] шэрае
                   *[m] шэры
                }
        }
    .red =
        { $role ->
            [border-clause] чырвонай
            [background-clause] чырвоным
            [text-clause] чырвоны
           *[standalone]
                { $gender ->
                    [f] чырвоная
                    [n] чырвонае
                   *[m] чырвоны
                }
        }
    .orange =
        { $role ->
            [border-clause] аранжавай
            [background-clause] аранжавым
            [text-clause] аранжавы
           *[standalone]
                { $gender ->
                    [f] аранжавая
                    [n] аранжавае
                   *[m] аранжавы
                }
        }
    .yellow =
        { $role ->
            [border-clause] жоўтай
            [background-clause] жоўтым
            [text-clause] жоўты
           *[standalone]
                { $gender ->
                    [f] жоўтая
                    [n] жоўтае
                   *[m] жоўты
                }
        }
    .green =
        { $role ->
            [border-clause] зялёнай
            [background-clause] зялёным
            [text-clause] зялёны
           *[standalone]
                { $gender ->
                    [f] зялёная
                    [n] зялёнае
                   *[m] зялёны
                }
        }
    .cyan =
        { $role ->
            [border-clause] блакітнай
            [background-clause] блакітным
            [text-clause] блакітны
           *[standalone]
                { $gender ->
                    [f] блакітная
                    [n] блакітнае
                   *[m] блакітны
                }
        }
    .blue =
        { $role ->
            [border-clause] сіняй
            [background-clause] сінім
            [text-clause] сіні
           *[standalone]
                { $gender ->
                    [f] сіняя
                    [n] сіняе
                   *[m] сіні
                }
        }
    .purple =
        { $role ->
            [border-clause] фіялетавай
            [background-clause] фіялетавым
            [text-clause] фіялетавы
           *[standalone]
                { $gender ->
                    [f] фіялетавая
                    [n] фіялетавае
                   *[m] фіялетавы
                }
        }
    .pink =
        { $role ->
            [border-clause] ружовай
            [background-clause] ружовым
            [text-clause] ружовы
           *[standalone]
                { $gender ->
                    [f] ружовая
                    [n] ружовае
                   *[m] ружовы
                }
        }
    .brown =
        { $role ->
            [border-clause] карычневай
            [background-clause] карычневым
            [text-clause] карычневы
           *[standalone]
                { $gender ->
                    [f] карычневая
                    [n] карычневае
                   *[m] карычневы
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] тоўстай
            [background-clause] тоўстым
            [text-clause] тоўсты
           *[standalone]
                { $gender ->
                    [f] тоўстая
                    [n] тоўстае
                   *[m] тоўсты
                }
        }
    .thin =
        { $role ->
            [border-clause] тонкай
            [background-clause] тонкім
            [text-clause] тонкі
           *[standalone]
                { $gender ->
                    [f] тонкая
                    [n] тонкае
                   *[m] тонкі
                }
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] штрыхавой
            [background-clause] штрыхавым
            [text-clause] штрыхавы
           *[standalone]
                { $gender ->
                    [f] штрыхавая
                    [n] штрыхавое
                   *[m] штрыхавы
                }
        }
    .dotted =
        { $role ->
            [border-clause] пункцірнай
            [background-clause] пункцірным
            [text-clause] пункцірны
           *[standalone]
                { $gender ->
                    [f] пункцірная
                    [n] пункцірнае
                   *[m] пункцірны
                }
        }

# Noun phrases in the instrumental, which is the case «з» takes. They agree
# with nothing.
fill-style =
    .horizontal = гарызантальнымі лініямі
    .vertical = вертыкальнымі лініямі
    .diagonal = дыяганальнымі лініямі
    .backdiagonal = адваротнымі дыяганальнымі лініямі
    .dots = кропкамі
    .diamonds = ромбамі

noun =
    .line = прамая
    .line-segment = адрэзак
    .ray = прамень
    .vector = вектар
    .curve = крывая
    .function = функцыя
    .parabola = парабала
    .polyline = ломаная
    .polygon = мнагавугольнік
    .triangle = трохвугольнік
    .rectangle = прамавугольнік
    .circle = акружнасць
    .region = вобласць
    .point = кропка
    .square = квадрат
    .diamond = ромб
    .cross = крыж
    .plus = плюс

# Belarusian keeps the side count in front of the noun, so the whole of it is
# one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] правільны { $numSides }-вугольнік
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (мнагавугольнік, m)
# or the head of a phrase the description never names: `border` (рамка, f),
# `fill` (заліўка, f), `text` (тэкст, m), `background` (фон, m).
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

# Only ever said of the shape itself, so it is standalone in every description
# and takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] зафарбаваная
        [n] зафарбаванае
       *[m] зафарбаваны
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } з { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } з { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } з { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «рамка» is feminine, so the border's adjectives agree with it and not with
# the shape it surrounds. Belarusian has no article, so the two `-article`
# branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] з { $border } рамкай
        [and] і { $border } рамкай
        [and-article] і { $border } рамкай
       *[with] з { $border } рамкай
    }

# The fill-pattern words are instrumental plurals, because their other use is
# the «з { $pattern }» clause in `style-filled`. So this message supplies a noun
# for them to hang off — «заліўка», feminine, which is the gender `noun-gender`
# already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] { $color } заліўка з { $pattern }
       *[plain] { $color } заліўка
    }

style-unfilled = незафарбаваны

style-text =
    { $parts ->
        [background] { $color } на { $background } фоне
       *[plain] { $color }
    }

style-background-none = няма


## Boolean words

boolean-true = праўда
boolean-false = няпраўда


## Answer buttons

answer-submit-label = Праверыць
answer-submit-label-no-correctness = Адправіць адказ


## Sectional blocks

section-name =
    .activity = Заданне
    .aside = Адступленне
    .cascade = Каскад
    .definition = Азначэнне
    .example = Прыклад
    .exercise = Практыкаванне
    .exercises = Практыкаванні
    .given-answer = Адказ
    .note = Заўвага
    .objectives = Мэты
    .paragraphs = Абзацы
    .part = Частка
    .problem = Задача
    .problems = Задачы
    .proof = Доказ
    .question = Пытанне
    .section = Раздзел
    .solution = Рашэнне
    .task = Задача
    .theorem = Тэарэма

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Падказка


## Tables and figures

table-name =
    { $parts ->
        [numbered] Табліца { $enumeration }
        [numbered-title] Табліца { $enumeration }{ ". " }
        [unnumbered-title] Табліца{ ". " }
       *[unnumbered] Табліца
    }

figure-name =
    { $parts ->
        [numbered] Малюнак { $enumeration }
        [numbered-caption] Малюнак { $enumeration }{ ". " }
        [unnumbered-caption] Малюнак{ ". " }
       *[unnumbered] Малюнак
    }


## Paginator controls

paginator-previous = Назад
paginator-next = Наперад
paginator-page = Старонка

paginator-page-status = { $pageLabel } { $currentPage } з { $numPages }


## Piecewise functions

piecewise-condition-or = або
piecewise-condition-if = калі
piecewise-condition-otherwise = інакш


## Chemistry

element-name =
    .h = Вадарод
    .he = Гелій
    .li = Літый
    .be = Берылій
    .b = Бор
    .c = Вуглярод
    .n = Азот
    .o = Кісларод
    .f = Фтор
    .ne = Неон
    .na = Натрый
    .mg = Магній
    .al = Алюміній
    .si = Крэмній
    .p = Фосфар
    .s = Сера
    .cl = Хлор
    .ar = Аргон
    .k = Калій
    .ca = Кальцый
    .sc = Скандый
    .ti = Тытан
    .v = Ванадый
    .cr = Хром
    .mn = Марганец
    .fe = Жалеза
    .co = Кобальт
    .ni = Нікель
    .cu = Медзь
    .zn = Цынк
    .ga = Галій
    .ge = Германій
    .as = Мыш'як
    .se = Селен
    .br = Бром
    .kr = Крыптон
    .rb = Рубідый
    .sr = Стронцый
    .y = Ітрый
    .zr = Цырконій
    .nb = Ніобій
    .mo = Малібдэн
    .tc = Тэхнецый
    .ru = Рутэній
    .rh = Родый
    .pd = Паладый
    .ag = Срэбра
    .cd = Кадмій
    .in = Індый
    .sn = Волава
    .sb = Сурма
    .te = Тэлур
    .i = Ёд
    .xe = Ксенон
    .cs = Цэзій
    .ba = Барый
    .la = Лантан
    .ce = Цэрый
    .pr = Празеадым
    .nd = Неадым
    .pm = Праметый
    .sm = Самарый
    .eu = Еўропій
    .gd = Гадалiній
    .tb = Тэрбій
    .dy = Дыспрозій
    .ho = Гольмій
    .er = Эрбій
    .tm = Тулій
    .yb = Ітэрбій
    .lu = Лютэцый
    .hf = Гафній
    .ta = Тантал
    .w = Вальфрам
    .re = Рэній
    .os = Осмій
    .ir = Ірыдый
    .pt = Плаціна
    .au = Золата
    .hg = Ртуць
    .tl = Талій
    .pb = Свінец
    .bi = Вісмут
    .po = Полоній
    .at = Астат
    .rn = Радон
    .fr = Францый
    .ra = Радый
    .ac = Актыній
    .th = Торый
    .pa = Пратактыній
    .u = Уран
    .np = Нептуній
    .pu = Плутоній
    .am = Амерыцый
    .cm = Кюрый
    .bk = Берклій
    .cf = Каліфорній
    .es = Эйнштэйній
    .fm = Фермій
    .md = Мендзялевій
    .no = Нобелій
    .lr = Лоўрэнсій
    .rf = Рэзерфордый
    .db = Дубній
    .sg = Сіборгій
    .bh = Борый
    .hs = Хасій
    .mt = Мейтнерый
    .ds = Дармштадтый
    .rg = Рэнтгеній
    .cn = Каперніцый
    .nh = Ніхоній
    .fl = Флеровій
    .mc = Маскоўій
    .lv = Лівермарый
    .ts = Тэнесін
    .og = Аганесон

element-anion-name =
    .h = Гідрыд
    .c = Карбід
    .n = Нітрыд
    .o = Аксід
    .f = Фтарыд
    .p = Фасфід
    .s = Сульфід
    .cl = Хларыд
    .br = Брамід
    .i = Ёдыд
    .at = Астатыд
    .ts = Тэнесід

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Няправільны хімічны сімвал
chemistry-invalid-ionic-compound = Няправільнае іоннае злучэнне
