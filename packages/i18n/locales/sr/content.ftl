# Serbian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic, which is what CLDR fills a bare `sr` in as, and in the
# Ekavian standard. A reader arriving under `sr-Latn` reaches this catalog and
# gets Cyrillic — the same asymmetry `locales/pa` already has for Shahmukhi,
# and the answer to it is a second catalog rather than a differently named
# first one. Nothing canonicalizes the two, and `sh` — the deprecated tag —
# canonicalizes to `sr-Latn` on its own, so it lands here too.
#
# Serbian inflects for seven cases and has three genders, so every describing
# word below selects on `$role` first and only then, where it matters, on
# `$gender`:
#
#   standalone          nominative: `-∅` m, `-а` f, `-о`/`-е` n
#   border-clause       after «са», which governs the instrumental, of «ивица»
#                       — feminine: `-ом`
#   background-clause   after «на», locative here, of «позадина» — feminine:
#                       `-ој`
#   text-clause         nominative masculine, agreeing with «текст»
#
# `locales/hr` is the near-identical grammar with a different word for the
# border: «руб» is masculine there and takes `-им` in the same position where
# «ивица» takes `-ом` here. Neither catalog had to know that about the other,
# which is what `noun-gender` answering per catalog buys.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] црном
            [background-clause] црној
            [text-clause] црн
           *[standalone]
                { $gender ->
                    [f] црна
                    [n] црно
                   *[m] црн
                }
        }
    .white =
        { $role ->
            [border-clause] белом
            [background-clause] белој
            [text-clause] бео
           *[standalone]
                { $gender ->
                    [f] бела
                    [n] бело
                   *[m] бео
                }
        }
    .gray =
        { $role ->
            [border-clause] сивом
            [background-clause] сивој
            [text-clause] сив
           *[standalone]
                { $gender ->
                    [f] сива
                    [n] сиво
                   *[m] сив
                }
        }
    .red =
        { $role ->
            [border-clause] црвеном
            [background-clause] црвеној
            [text-clause] црвен
           *[standalone]
                { $gender ->
                    [f] црвена
                    [n] црвено
                   *[m] црвен
                }
        }
    .orange =
        { $role ->
            [border-clause] наранџастом
            [background-clause] наранџастој
            [text-clause] наранџаст
           *[standalone]
                { $gender ->
                    [f] наранџаста
                    [n] наранџасто
                   *[m] наранџаст
                }
        }
    .yellow =
        { $role ->
            [border-clause] жутом
            [background-clause] жутој
            [text-clause] жут
           *[standalone]
                { $gender ->
                    [f] жута
                    [n] жуто
                   *[m] жут
                }
        }
    .green =
        { $role ->
            [border-clause] зеленом
            [background-clause] зеленој
            [text-clause] зелен
           *[standalone]
                { $gender ->
                    [f] зелена
                    [n] зелено
                   *[m] зелен
                }
        }
    .cyan =
        { $role ->
            [border-clause] тиркизном
            [background-clause] тиркизној
            [text-clause] тиркизан
           *[standalone]
                { $gender ->
                    [f] тиркизна
                    [n] тиркизно
                   *[m] тиркизан
                }
        }
    .blue =
        { $role ->
            [border-clause] плавом
            [background-clause] плавој
            [text-clause] плав
           *[standalone]
                { $gender ->
                    [f] плава
                    [n] плаво
                   *[m] плав
                }
        }
    .purple =
        { $role ->
            [border-clause] љубичастом
            [background-clause] љубичастој
            [text-clause] љубичаст
           *[standalone]
                { $gender ->
                    [f] љубичаста
                    [n] љубичасто
                   *[m] љубичаст
                }
        }
    .pink =
        { $role ->
            [border-clause] ружичастом
            [background-clause] ружичастој
            [text-clause] ружичаст
           *[standalone]
                { $gender ->
                    [f] ружичаста
                    [n] ружичасто
                   *[m] ружичаст
                }
        }
    .brown =
        { $role ->
            [border-clause] смеђом
            [background-clause] смеђој
            [text-clause] смеђ
           *[standalone]
                { $gender ->
                    [f] смеђа
                    [n] смеђе
                   *[m] смеђ
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] дебелом
            [background-clause] дебелој
            [text-clause] дебео
           *[standalone]
                { $gender ->
                    [f] дебела
                    [n] дебело
                   *[m] дебео
                }
        }
    .thin =
        { $role ->
            [border-clause] танком
            [background-clause] танкој
            [text-clause] танак
           *[standalone]
                { $gender ->
                    [f] танка
                    [n] танко
                   *[m] танак
                }
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] испрекиданом
            [background-clause] испрекиданој
            [text-clause] испрекидан
           *[standalone]
                { $gender ->
                    [f] испрекидана
                    [n] испрекидано
                   *[m] испрекидан
                }
        }
    .dotted =
        { $role ->
            [border-clause] тачкастом
            [background-clause] тачкастој
            [text-clause] тачкаст
           *[standalone]
                { $gender ->
                    [f] тачкаста
                    [n] тачкасто
                   *[m] тачкаст
                }
        }

# Noun phrases in the instrumental, which is the case «са» takes. They agree
# with nothing.
fill-style =
    .horizontal = хоризонталним линијама
    .vertical = вертикалним линијама
    .diagonal = дијагоналним линијама
    .backdiagonal = обрнутим дијагоналним линијама
    .dots = тачкама
    .diamonds = ромбовима

noun =
    .line = права
    .line-segment = дуж
    .ray = полуправа
    .vector = вектор
    .curve = крива
    .function = функција
    .parabola = парабола
    .polyline = изломљена линија
    .polygon = многоугао
    .triangle = троугао
    .rectangle = правоугаоник
    .circle = кружница
    .region = област
    .point = тачка
    .square = квадрат
    .diamond = ромб
    .cross = крст
    .plus = плус

# Serbian keeps the side count in front of the noun, so the whole of it is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] правилни { $numSides }-угао
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (многоугао, m) or
# the head of a phrase the description never names: `border` (ивица, f), `fill`
# (испуна, f), `text` (текст, m), `background` (позадина, f).
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
        [fill] f
        [background] f
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
        [f] испуњена
        [n] испуњено
       *[m] испуњен
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } са { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } са { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } са { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «ивица» is feminine, so the border's adjectives agree with it and not with
# the shape it surrounds. Serbian has no article, so the two `-article`
# branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] са { $border } ивицом
        [and] и { $border } ивицом
        [and-article] и { $border } ивицом
       *[with] са { $border } ивицом
    }

# The fill-pattern words are instrumental plurals, because their other use is
# the «са { $pattern }» clause in `style-filled`. So this message supplies a
# noun for them to hang off — «испуна», feminine, which is the gender
# `noun-gender` already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] { $color } испуна са { $pattern }
       *[plain] { $color } испуна
    }

style-unfilled = неиспуњен

style-text =
    { $parts ->
        [background] { $color } на { $background } позадини
       *[plain] { $color }
    }

style-background-none = нема


## Boolean words

boolean-true = тачно
boolean-false = нетачно


## Answer buttons

answer-submit-label = Провери
answer-submit-label-no-correctness = Пошаљи одговор


## Sectional blocks

section-name =
    .activity = Активност
    .aside = Дигресија
    .cascade = Каскада
    .definition = Дефиниција
    .example = Пример
    .exercise = Вежба
    .exercises = Вежбе
    .given-answer = Одговор
    .note = Напомена
    .objectives = Циљеви
    .paragraphs = Пасуси
    .part = Део
    .problem = Задатак
    .problems = Задаци
    .proof = Доказ
    .question = Питање
    .section = Одељак
    .solution = Решење
    .task = Задатак
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

hint-title = Савет


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
paginator-next = Следећа
paginator-page = Страница

paginator-page-status = { $pageLabel } { $currentPage } од { $numPages }


## Piecewise functions

piecewise-condition-or = или
piecewise-condition-if = ако
piecewise-condition-otherwise = иначе


## Chemistry

element-name =
    .h = Водоник
    .he = Хелијум
    .li = Литијум
    .be = Берилијум
    .b = Бор
    .c = Угљеник
    .n = Азот
    .o = Кисеоник
    .f = Флуор
    .ne = Неон
    .na = Натријум
    .mg = Магнезијум
    .al = Алуминијум
    .si = Силицијум
    .p = Фосфор
    .s = Сумпор
    .cl = Хлор
    .ar = Аргон
    .k = Калијум
    .ca = Калцијум
    .sc = Скандијум
    .ti = Титанијум
    .v = Ванадијум
    .cr = Хром
    .mn = Манган
    .fe = Гвожђе
    .co = Кобалт
    .ni = Никл
    .cu = Бакар
    .zn = Цинк
    .ga = Галијум
    .ge = Германијум
    .as = Арсен
    .se = Селен
    .br = Бром
    .kr = Криптон
    .rb = Рубидијум
    .sr = Стронцијум
    .y = Итријум
    .zr = Цирконијум
    .nb = Ниобијум
    .mo = Молибден
    .tc = Технецијум
    .ru = Рутенијум
    .rh = Родијум
    .pd = Паладијум
    .ag = Сребро
    .cd = Кадмијум
    .in = Индијум
    .sn = Калај
    .sb = Антимон
    .te = Телур
    .i = Јод
    .xe = Ксенон
    .cs = Цезијум
    .ba = Баријум
    .la = Лантан
    .ce = Церијум
    .pr = Празеодијум
    .nd = Неодијум
    .pm = Прометијум
    .sm = Самаријум
    .eu = Европијум
    .gd = Гадолинијум
    .tb = Тербијум
    .dy = Диспрозијум
    .ho = Холмијум
    .er = Ербијум
    .tm = Тулијум
    .yb = Итербијум
    .lu = Лутецијум
    .hf = Хафнијум
    .ta = Тантал
    .w = Волфрам
    .re = Ренијум
    .os = Осмијум
    .ir = Иридијум
    .pt = Платина
    .au = Злато
    .hg = Жива
    .tl = Талијум
    .pb = Олово
    .bi = Бизмут
    .po = Полонијум
    .at = Астат
    .rn = Радон
    .fr = Францијум
    .ra = Радијум
    .ac = Актинијум
    .th = Торијум
    .pa = Протактинијум
    .u = Уранијум
    .np = Нептунијум
    .pu = Плутонијум
    .am = Америцијум
    .cm = Киријум
    .bk = Берклијум
    .cf = Калифорнијум
    .es = Ајнштајнијум
    .fm = Фермијум
    .md = Мендељевијум
    .no = Нобелијум
    .lr = Лоренсијум
    .rf = Радерфордијум
    .db = Дубнијум
    .sg = Сиборгијум
    .bh = Боријум
    .hs = Хасијум
    .mt = Мајтнеријум
    .ds = Дармштатијум
    .rg = Рендгенијум
    .cn = Коперницијум
    .nh = Нихонијум
    .fl = Флеровијум
    .mc = Московијум
    .lv = Ливерморијум
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

chemistry-invalid-symbol = Неисправан хемијски симбол
chemistry-invalid-ionic-compound = Неисправно јонско једињење
