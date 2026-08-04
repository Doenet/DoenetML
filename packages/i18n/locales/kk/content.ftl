# Kazakh content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic, which is what Kazakhstan's schools use today and what
# CLDR fills a bare `kk` in as. The Latin orthography being introduced is a
# second catalog beside this one if it is ever seeded, rather than a rename of
# it — the same rule `locales/sr` and `locales/pa` already follow.
#
# Kazakh has no grammatical gender and does not inflect an attributive
# adjective, so both `$gender` and `$role` go unused here exactly as they do in
# English and Turkish. Adjectives precede the noun, so the composition messages
# keep the English order.
#
# The two clauses are marked by a suffix on the *noun* — «жиекті», «фонда» —
# and that noun is one this catalog writes, so nothing is welded to a placeable.
# Which vowels the suffix takes depends on the word it attaches to, which is why
# each is spelled out rather than derived.


## Style vocabulary

color =
    .black = қара
    .white = ақ
    .gray = сұр
    .red = қызыл
    .orange = қызғылт сары
    .yellow = сары
    .green = жасыл
    .cyan = көгілдір
    .blue = көк
    .purple = күлгін
    .pink = қызғылт
    .brown = қоңыр

line-width =
    .thick = қалың
    .thin = жіңішке

line-style =
    .dashed = үзік
    .dotted = нүктелі

# Noun phrases: they stand in front of «өрнекті» and modify nothing.
fill-style =
    .horizontal = көлденең сызық
    .vertical = тік сызық
    .diagonal = диагональ сызық
    .backdiagonal = кері диагональ сызық
    .dots = нүкте
    .diamonds = ромб

noun =
    .line = түзу
    .line-segment = кесінді
    .ray = сәуле
    .vector = вектор
    .curve = қисық
    .function = функция
    .parabola = парабола
    .polyline = сынық сызық
    .polygon = көпбұрыш
    .triangle = үшбұрыш
    .rectangle = тіктөртбұрыш
    .circle = шеңбер
    .region = аймақ
    .point = нүкте
    .square = шаршы
    .diamond = ромб
    .cross = айқыш
    .plus = плюс

# Kazakh builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] дұрыс { $numSides }-бұрыш
    }

# Kazakh has no grammatical gender, so every noun answers the same and the
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

style-filled-word = боялған

style-filled =
    { $parts ->
        [pattern] { $pattern } өрнекті { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } өрнекті { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } өрнекті { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «жиекті» — "bordered" — carries the "with a border" sense in its own suffix,
# so neither a preposition nor an article is wanted, and all four branches read
# alike except for the connective English needs and Kazakh does not.
style-border-clause =
    { $parts ->
        [with-article] { $border } жиекті
        [and] және { $border } жиекті
        [and-article] және { $border } жиекті
       *[with] { $border } жиекті
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } өрнекті { $color } бояу
       *[plain] { $color } бояу
    }

style-unfilled = боялмаған

# «фонда» is the locative of «фон» and says "on the background" by itself, so
# nothing stands between the two colours.
style-text =
    { $parts ->
        [background] { $background } фонда { $color }
       *[plain] { $color }
    }

style-background-none = жоқ


## Boolean words

boolean-true = ақиқат
boolean-false = жалған


## Answer buttons

answer-submit-label = Тексеру
answer-submit-label-no-correctness = Жауапты жіберу


## Sectional blocks

section-name =
    .activity = Әрекет
    .aside = Шегініс
    .cascade = Каскад
    .definition = Анықтама
    .example = Мысал
    .exercise = Жаттығу
    .exercises = Жаттығулар
    .given-answer = Жауап
    .note = Ескертпе
    .objectives = Мақсаттар
    .paragraphs = Абзацтар
    .part = Бөлік
    .problem = Есеп
    .problems = Есептер
    .proof = Дәлелдеу
    .question = Сұрақ
    .section = Бөлім
    .solution = Шешуі
    .task = Тапсырма
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

hint-title = Кеңес


## Tables and figures

table-name =
    { $parts ->
        [numbered] { $enumeration }-кесте
        [numbered-title] { $enumeration }-кесте{ ". " }
        [unnumbered-title] Кесте{ ". " }
       *[unnumbered] Кесте
    }

figure-name =
    { $parts ->
        [numbered] { $enumeration }-сурет
        [numbered-caption] { $enumeration }-сурет{ ". " }
        [unnumbered-caption] Сурет{ ". " }
       *[unnumbered] Сурет
    }


## Paginator controls

paginator-previous = Алдыңғы
paginator-next = Келесі
paginator-page = Бет

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = немесе
piecewise-condition-if = егер
piecewise-condition-otherwise = әйтпесе


## Chemistry

element-name =
    .h = Сутегі
    .he = Гелий
    .li = Литий
    .be = Бериллий
    .b = Бор
    .c = Көміртегі
    .n = Азот
    .o = Оттегі
    .f = Фтор
    .ne = Неон
    .na = Натрий
    .mg = Магний
    .al = Алюминий
    .si = Кремний
    .p = Фосфор
    .s = Күкірт
    .cl = Хлор
    .ar = Аргон
    .k = Калий
    .ca = Кальций
    .sc = Скандий
    .ti = Титан
    .v = Ванадий
    .cr = Хром
    .mn = Марганец
    .fe = Темір
    .co = Кобальт
    .ni = Никель
    .cu = Мыс
    .zn = Мырыш
    .ga = Галлий
    .ge = Германий
    .as = Күшән
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
    .ag = Күміс
    .cd = Кадмий
    .in = Индий
    .sn = Қалайы
    .sb = Сүрме
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
    .hg = Сынап
    .tl = Таллий
    .pb = Қорғасын
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

chemistry-invalid-symbol = Жарамсыз химиялық таңба
chemistry-invalid-ionic-compound = Жарамсыз иондық қосылыс
