# Kyrgyz content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Kyrgyz has no grammatical gender and does not inflect an attributive
# adjective, so both `$gender` and `$role` go unused here exactly as they do in
# English and Turkish. Adjectives precede the noun, so the composition messages
# keep the English order.
#
# The two clauses are marked by a suffix on the *noun* — «жээктүү», «фондо» — and
# that noun is one this catalog writes, so no suffix has to agree with a
# placeable. `noun-regular-polygon`, `table-name` and `figure-name` do write a
# word directly against one — «{ $numSides }-бурчтук», «{ $enumeration }-таблица» —
# but that is adjacency rather than agreement: both arguments are numbers, so
# the word after the hyphen is the same whatever lands in front of it.
# `locales/kk` is the closest parallel text to this file: the grammar is the
# same and the vocabulary is not, so a correction to the *shape* of a message
# here is usually a correction to that file too, while a correction to a word
# is usually a correction to this one alone.


## Style vocabulary

color =
    .black = кара
    .white = ак
    .gray = боз
    .red = кызыл
    .orange = кызгылт сары
    .yellow = сары
    .green = жашыл
    .cyan = көгүлтүр
    .blue = көк
    .purple = кызгылт көк
    .pink = ачык кызгылт
    .brown = күрөң

line-width =
    .thick = калың
    .thin = ичке

line-style =
    .dashed = үзүк
    .dotted = чекиттүү

# Noun phrases: they stand in front of «оюмдуу» and modify nothing.
fill-style =
    .horizontal = туурасынан сызык
    .vertical = тигинен сызык
    .diagonal = диагоналдык сызык
    .backdiagonal = карама-каршы диагоналдык сызык
    .dots = чекит
    .diamonds = ромб

noun =
    .line = түз сызык
    .line-segment = кесинди
    .ray = нур
    .vector = вектор
    .curve = ийри сызык
    .function = функция
    .parabola = парабола
    .polyline = сынык сызык
    .polygon = көп бурчтук
    .triangle = үч бурчтук
    .rectangle = тик бурчтук
    .circle = айлана
    .region = аймак
    .point = чекит
    .square = чарчы
    .diamond = ромб
    .cross = крест
    .plus = плюс

# Kyrgyz builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] туура { $numSides }-бурчтук
    }

# Kyrgyz has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English and Turkish.
noun-gender = neuter


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

style-filled-word = боёлгон

style-filled =
    { $parts ->
        [pattern] { $pattern } оюмдуу { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } оюмдуу { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } оюмдуу { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «жээктүү» — "bordered" — carries the "with a border" sense in its own suffix,
# so neither a preposition nor an article is wanted, and all four branches read
# alike except for the connective English needs and Kyrgyz does not.
style-border-clause =
    { $parts ->
        [with-article] { $border } жээктүү
        [and] жана { $border } жээктүү
        [and-article] жана { $border } жээктүү
       *[with] { $border } жээктүү
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } оюмдуу { $color } боёк
       *[plain] { $color } боёк
    }

style-unfilled = боёлбогон

# «фондо» is the locative of «фон» and says "on the background" by itself, so
# nothing stands between the two colours.
style-text =
    { $parts ->
        [background] { $background } фондо { $color }
       *[plain] { $color }
    }

style-background-none = жок


## Boolean words

boolean-true = чын
boolean-false = жалган


## Answer buttons

answer-submit-label = Текшерүү
answer-submit-label-no-correctness = Жоопту жөнөтүү


## Sectional blocks

section-name =
    .activity = Иш-аракет
    .aside = Чегинүү
    .cascade = Каскад
    .definition = Аныктама
    .example = Мисал
    .exercise = Көнүгүү
    .exercises = Көнүгүүлөр
    .given-answer = Жооп
    .note = Эскертүү
    .objectives = Максаттар
    .paragraphs = Абзацтар
    .part = Бөлүк
    .problem = Маселе
    .problems = Маселелер
    .proof = Далилдөө
    .question = Суроо
    .section = Бөлүм
    .solution = Чыгарылышы
    .task = Тапшырма
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

hint-title = Кеңеш


## Tables and figures

table-name =
    { $parts ->
        [numbered] { $enumeration }-таблица
        [numbered-title] { $enumeration }-таблица{ ". " }
        [unnumbered-title] Таблица{ ". " }
       *[unnumbered] Таблица
    }

figure-name =
    { $parts ->
        [numbered] { $enumeration }-сүрөт
        [numbered-caption] { $enumeration }-сүрөт{ ". " }
        [unnumbered-caption] Сүрөт{ ". " }
       *[unnumbered] Сүрөт
    }


## Paginator controls

paginator-previous = Мурунку
paginator-next = Кийинки
paginator-page = Бет

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = же
piecewise-condition-if = эгер
piecewise-condition-otherwise = болбосо


## Chemistry

element-name =
    .h = Суутек
    .he = Гелий
    .li = Литий
    .be = Бериллий
    .b = Бор
    .c = Көмүртек
    .n = Азот
    .o = Кычкылтек
    .f = Фтор
    .ne = Неон
    .na = Натрий
    .mg = Магний
    .al = Алюминий
    .si = Кремний
    .p = Фосфор
    .s = Күкүрт
    .cl = Хлор
    .ar = Аргон
    .k = Калий
    .ca = Кальций
    .sc = Скандий
    .ti = Титан
    .v = Ванадий
    .cr = Хром
    .mn = Марганец
    .fe = Темир
    .co = Кобальт
    .ni = Никель
    .cu = Жез
    .zn = Мырыш
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
    .ag = Күмүш
    .cd = Кадмий
    .in = Индий
    .sn = Калай
    .sb = Сурьма
    .te = Теллур
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
    .au = Алтын
    .hg = Сымап
    .tl = Таллий
    .pb = Коргошун
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
    .i = Йодид
    .at = Астатид
    .ts = Теннессид

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Жараксыз химиялык белги
chemistry-invalid-ionic-compound = Жараксыз иондук кошулма
