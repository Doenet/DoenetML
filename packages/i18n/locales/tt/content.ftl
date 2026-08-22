# Tatar content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic, which is the orthography Tatarstan's schools and
# publishing use and what CLDR fills a bare `tt` in as.
#
# Tatar has no grammatical gender and does not inflect an attributive
# adjective, so both `$gender` and `$role` go unused here exactly as they do in
# English and Turkish. Adjectives precede the noun, so the composition messages
# keep the English order.
#
# The two clauses are marked by a suffix on the *noun* — «кырыйлы», «фонда» —
# and that noun is one this catalog writes, so nothing is welded to a placeable.


## Style vocabulary

color =
    .black = кара
    .white = ак
    .gray = соры
    .red = кызыл
    .orange = кызгылт сары
    .yellow = сары
    .green = яшел
    .cyan = ачык зәңгәр
    .blue = зәңгәр
    .purple = шәмәхә
    .pink = алсу
    .brown = көрән
line-width =
    .thick = юан
    .thin = нечкә
line-style =
    .dashed = өзек
    .dotted = нокталы
# Noun phrases: they stand in front of «бизәкле» and modify nothing.
fill-style =
    .horizontal = горизонталь сызык
    .vertical = вертикаль сызык
    .diagonal = диагональ сызык
    .backdiagonal = кире диагональ сызык
    .dots = нокта
    .diamonds = ромб
noun =
    .line = туры сызык
    .line-segment = кисемтә
    .ray = нур
    .vector = вектор
    .curve = кәкре сызык
    .function = функция
    .parabola = парабола
    .polyline = сынык сызык
    .polygon = күпмөйешлек
    .triangle = өчпочмак
    .rectangle = турыпочмаклык
    .circle = әйләнә
    .region = өлкә
    .point = нокта
    .square = квадрат
    .diamond = ромб
    .cross = кисешү тамгасы
    .plus = плюс
# Tatar builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] дөрес { $numSides } мөйешлек
    }
# Tatar has no grammatical gender, so every noun answers the same and the answer
# goes unused — as in English and Turkish.
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
style-filled-word = буялган
style-filled =
    { $parts ->
        [pattern] { $pattern } бизәкле { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } бизәкле { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } бизәкле { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «кырыйлы» — "bordered" — carries the "with a border" sense in its own suffix,
# so neither a preposition nor an article is wanted, and all four branches read
# alike except for the connective English needs and Tatar does not.
style-border-clause =
    { $parts ->
        [with-article] { $border } кырыйлы
        [and] һәм { $border } кырыйлы
        [and-article] һәм { $border } кырыйлы
       *[with] { $border } кырыйлы
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } бизәкле { $color } буяу
       *[plain] { $color } буяу
    }
style-unfilled = буялмаган
# «фонда» is the locative of «фон» and says "on the background" by itself, so
# nothing stands between the two colours.
style-text =
    { $parts ->
        [background] { $background } фонда { $color }
       *[plain] { $color }
    }
style-background-none = юк

## Boolean words

boolean-true = дөрес
boolean-false = ялгыш

## Answer buttons

answer-submit-label = Тикшерү
answer-submit-label-no-correctness = Җавапны җибәрү

## Sectional blocks

section-name =
    .activity = Эшчәнлек
    .aside = Читтән искәрмә
    .cascade = Каскад
    .definition = Билгеләмә
    .example = Мисал
    .exercise = Күнегү
    .exercises = Күнегүләр
    .given-answer = Җавап
    .note = Искәрмә
    .objectives = Максатлар
    .paragraphs = Абзацлар
    .part = Өлеш
    .problem = Мәсьәлә
    .problems = Мәсьәләләр
    .proof = Дәлилләү
    .question = Сорау
    .section = Бүлек
    .solution = Чишелеш
    .task = Бирем
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
hint-title = Киңәш

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
        [numbered] Рәсем { $enumeration }
        [numbered-caption] Рәсем { $enumeration }{ ". " }
        [unnumbered-caption] Рәсем{ ". " }
       *[unnumbered] Рәсем
    }

## Paginator controls

paginator-previous = Алдагы
paginator-next = Киләсе
paginator-page = Бит
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = яки
piecewise-condition-if = әгәр
piecewise-condition-otherwise = юкса

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
    .s = Күкерт
    .cl = Хлор
    .ar = Аргон
    .k = Калий
    .ca = Кальций
    .sc = Скандий
    .ti = Титан
    .v = Ванадий
    .cr = Хром
    .mn = Марганец
    .fe = Тимер
    .co = Кобальт
    .ni = Никель
    .cu = Бакыр
    .zn = Цинк
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
    .ag = Көмеш
    .cd = Кадмий
    .in = Индий
    .sn = Калай
    .sb = Сөрмә
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
    .hg = Терекөмеш
    .tl = Таллий
    .pb = Кургаш
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
chemistry-invalid-symbol = Дөрес булмаган химик билге
chemistry-invalid-ionic-compound = Дөрес булмаган ион кушылмасы
