# Mongolian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic, which is Mongolia's official script and what CLDR fills a
# bare `mn` in as. A reader arriving under `mn-Mong` — the traditional vertical
# script, which is taught again and is used in Inner Mongolia — reaches this
# catalog and gets Cyrillic; a traditional-script translation is a second
# catalog beside this one rather than a rename of it, the same rule
# `locales/sr` and `locales/pa` already follow.
#
# Mongolian is not Turkic but behaves the same way in everything this file
# needs: no grammatical gender, no inflection on an attributive adjective, and
# case marked by a suffix on the noun. So both `$gender` and `$role` go unused,
# and the adjectives keep the English order in front of what they describe.
#
# «хүрээтэй» is the comitative of «хүрээ» and says "with a border" by itself;
# its vowels follow that noun rather than anything handed in, so writing it out
# here is safe. That is the general rule here: a Mongolian suffix harmonizes
# with the word it lands on, so every ending below sits on a noun this catalog
# writes and nothing is welded to a placeable.
#
# The element names drop a final -й — «Гели», «Лити», «Сканди» — which is what
# the great majority of the list already did, so the outliers were brought into
# line rather than the other way round.


## Style vocabulary

color =
    .black = хар
    .white = цагаан
    .gray = саарал
    .red = улаан
    .orange = улбар шар
    .yellow = шар
    .green = ногоон
    .cyan = цэнхэр
    .blue = хөх
    .purple = нил ягаан
    .pink = ягаан
    .brown = бор

line-width =
    .thick = бүдүүн
    .thin = нарийн

line-style =
    .dashed = тасалдсан
    .dotted = цэгэн

# Noun phrases: they stand in front of «хээтэй» and modify nothing.
fill-style =
    .horizontal = хэвтээ шугам
    .vertical = босоо шугам
    .diagonal = диагональ шугам
    .backdiagonal = эсрэг диагональ шугам
    .dots = цэг
    .diamonds = ромб

noun =
    .line = шулуун
    .line-segment = хэрчим
    .ray = цацраг
    .vector = вектор
    .curve = муруй
    .function = функц
    .parabola = парабол
    .polyline = хугархай шугам
    .polygon = олон өнцөгт
    .triangle = гурвалжин
    .rectangle = тэгш өнцөгт
    .circle = тойрог
    .region = муж
    .point = цэг
    .square = дөрвөлжин
    .diamond = ромб
    .cross = загалмай
    .plus = нэмэх

# Mongolian builds the word from the side count in front of the noun, so the
# whole of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] зөв { $numSides } өнцөгт
    }

# Mongolian has no grammatical gender, so every noun answers the same and the
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

style-filled-word = дүүргэлттэй

style-filled =
    { $parts ->
        [pattern] { $pattern } хээтэй { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } хээтэй { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } хээтэй { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# The comitative carries the "with" in its own ending, so neither a preposition
# nor an article is wanted, and all four branches read alike except for the
# connective English needs and Mongolian does not.
style-border-clause =
    { $parts ->
        [with-article] { $border } хүрээтэй
        [and] ба { $border } хүрээтэй
        [and-article] ба { $border } хүрээтэй
       *[with] { $border } хүрээтэй
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } хээтэй { $color } дүүргэлт
       *[plain] { $color } дүүргэлт
    }

style-unfilled = дүүргэлтгүй

# «дэвсгэр дээр» — the postposition follows the noun, and the colour in front of
# it does not move.
style-text =
    { $parts ->
        [background] { $background } дэвсгэр дээр { $color }
       *[plain] { $color }
    }

style-background-none = байхгүй


## Boolean words

boolean-true = үнэн
boolean-false = худал


## Answer buttons

answer-submit-label = Шалгах
answer-submit-label-no-correctness = Хариултаа илгээх


## Sectional blocks

section-name =
    .activity = Үйл ажиллагаа
    .aside = Хажуугийн тэмдэглэл
    .cascade = Каскад
    .definition = Тодорхойлолт
    .example = Жишээ
    .exercise = Дасгал
    .exercises = Дасгалууд
    .given-answer = Хариулт
    .note = Тэмдэглэл
    .objectives = Зорилтууд
    .paragraphs = Догол мөрүүд
    .part = Хэсэг
    .problem = Бодлого
    .problems = Бодлогууд
    .proof = Баталгаа
    .question = Асуулт
    .section = Бүлэг
    .solution = Бодолт
    .task = Даалгавар
    .theorem = Теорем

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Зөвлөмж


## Tables and figures

table-name =
    { $parts ->
        [numbered] Хүснэгт { $enumeration }
        [numbered-title] Хүснэгт { $enumeration }{ ". " }
        [unnumbered-title] Хүснэгт{ ". " }
       *[unnumbered] Хүснэгт
    }

figure-name =
    { $parts ->
        [numbered] Зураг { $enumeration }
        [numbered-caption] Зураг { $enumeration }{ ". " }
        [unnumbered-caption] Зураг{ ". " }
       *[unnumbered] Зураг
    }


## Paginator controls

paginator-previous = Өмнөх
paginator-next = Дараах
paginator-page = Хуудас

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = эсвэл
piecewise-condition-if = хэрэв
piecewise-condition-otherwise = бусад тохиолдолд


## Chemistry

element-name =
    .h = Устөрөгч
    .he = Гели
    .li = Лити
    .be = Берилли
    .b = Бор
    .c = Нүүрстөрөгч
    .n = Азот
    .o = Хүчилтөрөгч
    .f = Фтор
    .ne = Неон
    .na = Натри
    .mg = Магни
    .al = Хөнгөн цагаан
    .si = Цахиур
    .p = Фосфор
    .s = Хүхэр
    .cl = Хлор
    .ar = Аргон
    .k = Кали
    .ca = Кальци
    .sc = Сканди
    .ti = Титан
    .v = Ванади
    .cr = Хром
    .mn = Марганец
    .fe = Төмөр
    .co = Кобальт
    .ni = Никель
    .cu = Зэс
    .zn = Цайр
    .ga = Галли
    .ge = Германи
    .as = Хүнцэл
    .se = Селен
    .br = Бром
    .kr = Криптон
    .rb = Рубиди
    .sr = Стронци
    .y = Иттри
    .zr = Циркони
    .nb = Ниоби
    .mo = Молибден
    .tc = Технеци
    .ru = Рутени
    .rh = Роди
    .pd = Паллади
    .ag = Мөнгө
    .cd = Кадми
    .in = Инди
    .sn = Цагаан тугалга
    .sb = Сурьма
    .te = Теллур
    .i = Иод
    .xe = Ксенон
    .cs = Цези
    .ba = Бари
    .la = Лантан
    .ce = Цери
    .pr = Празеодим
    .nd = Неодим
    .pm = Промети
    .sm = Самари
    .eu = Европи
    .gd = Гадолини
    .tb = Терби
    .dy = Диспрози
    .ho = Гольми
    .er = Эрби
    .tm = Тули
    .yb = Иттерби
    .lu = Лютеци
    .hf = Гафни
    .ta = Тантал
    .w = Вольфрам
    .re = Рени
    .os = Осми
    .ir = Ириди
    .pt = Цагаан алт
    .au = Алт
    .hg = Мөнгөн ус
    .tl = Талли
    .pb = Хар тугалга
    .bi = Висмут
    .po = Полони
    .at = Астат
    .rn = Радон
    .fr = Франци
    .ra = Ради
    .ac = Актини
    .th = Тори
    .pa = Протактини
    .u = Уран
    .np = Нептуни
    .pu = Плутони
    .am = Америци
    .cm = Кюри
    .bk = Беркли
    .cf = Калифорни
    .es = Эйнштейни
    .fm = Ферми
    .md = Менделеви
    .no = Нобели
    .lr = Лоуренси
    .rf = Резерфорди
    .db = Дубни
    .sg = Сиборги
    .bh = Бори
    .hs = Хасси
    .mt = Мейтнери
    .ds = Дармштадти
    .rg = Рентгени
    .cn = Коперници
    .nh = Нихони
    .fl = Флерови
    .mc = Москови
    .lv = Ливермори
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

chemistry-invalid-symbol = Буруу химийн тэмдэг
chemistry-invalid-ionic-compound = Буруу ионы нэгдэл
