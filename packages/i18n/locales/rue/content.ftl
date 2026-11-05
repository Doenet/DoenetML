# Rusyn (русиньскый язык) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Prešov (Pryashiv) codification in Cyrillic, with «ы»,
# «ї», «ё» and the soft sign «ь» as letters of the alphabet; see `chrome.ftl`
# for the full note, for why this file writes one codification rather than
# mixing the Slovak, Polish (Lemko) and Transcarpathian norms, and for the
# words that keep it from drifting into Ukrainian or Slovak.
#
# **Direction.** Left to right; `direction.ts` needs no entry for `rue`.
#
# **Number.** CLDR has no plural rules for `rue`, so no `zero`, `two`, `few` or
# `many` branch appears anywhere in this catalog. Rusyn does have a real
# `few`/`many` split, which is exactly what nothing could select, so the gap is
# recorded rather than papered over.
#
# Rusyn inflects for gender *and* for case, so every adjective below selects on
# `$role` first — which position the words are going into — and then on
# `$gender` where the answer still depends on one, the structure
# `locales/szl/content.ftl` and `locales/uk/content.ftl` use:
#
#   standalone          nominative, agreeing with the noun described:
#                       `-ый` m, `-а` f, `-е` n
#   border-clause       instrumental after «з», of «рамка» — feminine: `-ов`
#                       («з чорнов рамков»), not Ukrainian `-ою`
#   background-clause   locative after «на», of «тло» — neuter: `-ім`
#                       («на чорнім тлї»)
#   text-clause         nominative masculine, agreeing with «текст»
#
# The last three need no gender branch: each is used of exactly one noun, and
# that noun's gender is fixed.
#
# «синїй» is the one soft-stem adjective here, so its endings are spelled
# `-я`/`-є`/`-ьов`/`-їм` where the hard stems take `-а`/`-е`/`-ов`/`-ім`.
#
# Adjectives precede their noun, as in English, so the composition messages
# keep the English order.
#
# **The periodic table is left to fall back to English.** Secondary science
# across Rusyn's range is taught in Slovak, in Polish or in Ukrainian depending
# on which state the school is in, so there is no one table a Rusyn speaker
# meets: it is `locales/sk`'s in Slovakia, `locales/pl`'s in Poland and
# `locales/uk`'s in Transcarpathia. That is a fact about three school systems
# rather than about the language, and those three files are the parallel texts
# to read before anyone fills the names in here.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] чорнов
            [background-clause] чорнім
            [text-clause] чорный
           *[standalone]
                { $gender ->
                    [f] чорна
                    [n] чорне
                   *[m] чорный
                }
        }
    .white =
        { $role ->
            [border-clause] білов
            [background-clause] білім
            [text-clause] білый
           *[standalone]
                { $gender ->
                    [f] біла
                    [n] біле
                   *[m] білый
                }
        }
    .gray =
        { $role ->
            [border-clause] сивов
            [background-clause] сивім
            [text-clause] сивый
           *[standalone]
                { $gender ->
                    [f] сива
                    [n] сиве
                   *[m] сивый
                }
        }
    .red =
        { $role ->
            [border-clause] червенов
            [background-clause] червенім
            [text-clause] червеный
           *[standalone]
                { $gender ->
                    [f] червена
                    [n] червене
                   *[m] червеный
                }
        }
    .orange =
        { $role ->
            [border-clause] оранжовов
            [background-clause] оранжовім
            [text-clause] оранжовый
           *[standalone]
                { $gender ->
                    [f] оранжова
                    [n] оранжове
                   *[m] оранжовый
                }
        }
    .yellow =
        { $role ->
            [border-clause] жовтов
            [background-clause] жовтім
            [text-clause] жовтый
           *[standalone]
                { $gender ->
                    [f] жовта
                    [n] жовте
                   *[m] жовтый
                }
        }
    .green =
        { $role ->
            [border-clause] зеленов
            [background-clause] зеленім
            [text-clause] зеленый
           *[standalone]
                { $gender ->
                    [f] зелена
                    [n] зелене
                   *[m] зеленый
                }
        }
    .cyan =
        { $role ->
            [border-clause] ціановов
            [background-clause] ціановім
            [text-clause] ціановый
           *[standalone]
                { $gender ->
                    [f] ціанова
                    [n] ціанове
                   *[m] ціановый
                }
        }
    .blue =
        { $role ->
            [border-clause] синьов
            [background-clause] синїм
            [text-clause] синїй
           *[standalone]
                { $gender ->
                    [f] синя
                    [n] синє
                   *[m] синїй
                }
        }
    .purple =
        { $role ->
            [border-clause] фіалковов
            [background-clause] фіалковім
            [text-clause] фіалковый
           *[standalone]
                { $gender ->
                    [f] фіалкова
                    [n] фіалкове
                   *[m] фіалковый
                }
        }
    .pink =
        { $role ->
            [border-clause] рожовов
            [background-clause] рожовім
            [text-clause] рожовый
           *[standalone]
                { $gender ->
                    [f] рожова
                    [n] рожове
                   *[m] рожовый
                }
        }
    .brown =
        { $role ->
            [border-clause] брунатнов
            [background-clause] брунатнім
            [text-clause] брунатный
           *[standalone]
                { $gender ->
                    [f] брунатна
                    [n] брунатне
                   *[m] брунатный
                }
        }
line-width =
    .thick =
        { $role ->
            [border-clause] грубов
            [background-clause] грубім
            [text-clause] грубый
           *[standalone]
                { $gender ->
                    [f] груба
                    [n] грубе
                   *[m] грубый
                }
        }
    .thin =
        { $role ->
            [border-clause] тонков
            [background-clause] тонкім
            [text-clause] тонкый
           *[standalone]
                { $gender ->
                    [f] тонка
                    [n] тонке
                   *[m] тонкый
                }
        }
line-style =
    .dashed =
        { $role ->
            [border-clause] чарковов
            [background-clause] чарковім
            [text-clause] чарковый
           *[standalone]
                { $gender ->
                    [f] чаркова
                    [n] чаркове
                   *[m] чарковый
                }
        }
    .dotted =
        { $role ->
            [border-clause] крапковов
            [background-clause] крапковім
            [text-clause] крапковый
           *[standalone]
                { $gender ->
                    [f] крапкова
                    [n] крапкове
                   *[m] крапковый
                }
        }
fill-style =
    .horizontal = горізонталны лінії
    .vertical = вертікалны лінії
    .diagonal = діаґоналны лінії
    .backdiagonal = обернуты діаґоналны лінії
    .dots = крапкы
    .diamonds = ромбы
noun =
    .line = лінїя
    .line-segment = одсек
    .ray = полпряма
    .vector = вектор
    .curve = крива
    .function = функція
    .slope-field = поле склонів
    .vector-field = векторове поле
    .parabola = парабола
    .polyline = ламана
    .polygon = многоуголник
    .triangle = трикутник
    .rectangle = прямоуголник
    .circle = круг
    .region = область
    .point = точка
    .square = квадрат
    .diamond = ромб
    .cross = кріж
    .plus = плюс
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they agree with: «грубый червеный правилный многоуголник о 5
# боках».
noun-regular-polygon =
    { $part ->
        [tail] о { $numSides } боках
       *[head] правилный многоуголник
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (многоуголник, m)
# or the head of a phrase the description never names: `border` (рамка, f),
# `fill` (выповнїня, n), `text` (текст, m), `background` (тло, n).
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [region] f
        [point] f
        [border] f
        [slope-field] n
        [vector-field] n
        [fill] n
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
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
# Only ever said of the shape itself, so it is standalone in every description
# and takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] выповнена
        [n] выповнене
       *[m] выповненый
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
# «з» governs the instrumental, which the `border-clause` branch of every
# adjective supplies in the feminine, agreeing with «рамка». Rusyn has no
# article, so the `-article` branches read the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] з { $border } рамков
        [and] а з { $border } рамков
        [and-article] а з { $border } рамков
       *[with] з { $border } рамков
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = невыповненый
style-text =
    { $parts ->
        [background] { $color } на { $background } тлї
       *[plain] { $color }
    }
style-background-none = жадне

## Boolean words

boolean-true = правда
boolean-false = неправда

## Answer buttons

answer-submit-label = Провірити роботу
answer-submit-label-no-correctness = Послати одповідь

## Sectional blocks

section-name =
    .activity = Актівіта
    .aside = Бічна помітка
    .cascade = Каскада
    .definition = Дефініція
    .example = Приклад
    .exercise = Вправа
    .exercises = Вправы
    .given-answer = Одповідь
    .note = Помітка
    .objectives = Цїлї
    .paragraphs = Одставцї
    .part = Часть
    .problem = Задача
    .problems = Задачі
    .proof = Доказ
    .question = Вопрос
    .section = Роздїл
    .solution = Рїшіня
    .task = Робота
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
hint-title = Порада

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
        [numbered] Образок { $enumeration }
        [numbered-caption] Образок { $enumeration }{ ": " }
        [unnumbered-caption] Образок{ ": " }
       *[unnumbered] Образок
    }

## Paginator controls

paginator-previous = Попереднїй
paginator-next = Наступный
paginator-page = Сторінка
paginator-page-status = { $pageLabel } { $currentPage } з { $numPages }

## Piecewise functions

piecewise-condition-or = або
piecewise-condition-if = кідь
piecewise-condition-otherwise = інакше

## Chemistry
##
## The 118 element names and the 12 anion names fall back to English.
## Secondary science across Rusyn's range is taught in Slovak, in Polish or in
## Ukrainian depending on the state, so there is no one periodic table a Rusyn
## speaker meets — `locales/sk`, `locales/pl` and `locales/uk` are the three
## parallel texts. That is a fact about three school systems rather than about
## the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Неправилный хемічный сімвол
chemistry-invalid-ionic-compound = Неправилна йонова злучіна

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = порожнє
math-embedded-input-blank-ordinal = порожнє { $ordinal } з { $total }
