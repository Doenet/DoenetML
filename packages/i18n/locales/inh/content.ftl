# Ingush content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Ingush (гӀалгӀай мотт), a Nakh language of Ingushetia, written in Cyrillic
# with the palochka Ӏ — the orthography the republic's schools, its publishing
# and CLDR all use (`inh` maximizes to `inh-Cyrl-RU`). The palochka is a
# letter, not a Latin capital I and not a digit 1.
#
# **This catalog's exemplar is `locales/ce`, and that is the closest exemplar
# relationship anywhere in the roster — one language over rather than one
# family over.** Ingush and Chechen are the two Vainakh languages: partly
# mutually intelligible, sharing the в-/й-/б-/д- class system and most of the
# vocabulary a file like this needs. So a reader deserves to be told two
# things. The first is that where the two coincide here, the coincidence is
# correct rather than copied: «Ӏаьржа», «можа», «сира», «тӀадам», «сиз» are the
# word in both languages, and writing something else to look different would
# have been worse than agreeing. The second is that Ingush's own literary norm
# is followed wherever it differs — the negative participle is «доаца» and not
# Chechen's «доцу», the participle "filled" is «дизза» and not «дуьзна», a page
# is «оагӀув» and not «агӀо», «кийчду» and not «кечдо», «нагахьа» and not
# «нагахь санна». Some entries below are more confidently Ingush than others,
# and the two paragraphs after this say which.
#
# **Ingush has a real grammatical class system and this catalog forks on it.**
# Nouns fall into classes marked by в-, й-, б- and д-, and an agreeing word
# carries the class marker at the *front*. What agrees is a short list, and it
# is not the same list a Bantu catalog forks: Ingush's colour and width
# adjectives — «Ӏаьржа», «сийна», «дуькъа», «дораха» — take no class prefix and
# hold still after every noun, so the colour and width vocabulary below forks
# nowhere, exactly as `locales/ce` reports for Chechen. What does agree is a
# *participle*, and there are two of them here rather than one:
#
#   * `style-filled-word` — «дизза», filled — forks four ways, which is the
#     same word `locales/ce` forks.
#   * `line-style.dashed` — «кагдаь», broken — is a past participle of the same
#     shape and agrees the same way, so it forks too. **This is the one place
#     this catalog forks something `locales/ce` leaves flat.** Chechen's
#     «кагйина» in that slot is the same kind of word and the same argument
#     reaches it; whether that catalog should fork it as well is a question for
#     a Chechen speaker rather than something this file changed.
#
# `.dotted` beside it is «тӀадамашца», an instrumental noun phrase rather than
# a participle, so nothing in it can agree and no fork is written. The
# `fill-style` phrases are nouns for the same reason.
#
# `style-unfilled` would agree in the language — «дизза боаца», «дизза йоаца»,
# «дизза воаца» — and cannot here: `describeFill` renders it with no arguments
# at all, so no noun exists for `$gender` to come from and a select there could
# only ever reach its default branch. The д-class form is written flat, which
# is what every agreeing catalog in the roster does with that message.
#
# **`noun-gender`'s table is the least certain thing in this file and is where
# a speaker should start.** The four class markers and the agreeing forms of
# both participles are what this seed could check; the class of each individual
# geometric noun is what it could not. A half-remembered class table is worse
# than an admitted gap, so only the entries this seed is reasonably confident
# of are listed and everything else defaults to `d`, the largest class. Filling
# one in costs a speaker one line, and the forks that read it are already
# written.
#
# **The other soft spots, named so they are not mistaken for settled Ingush.**
# The polygon vocabulary follows the shared Vainakh «сонера» ("cornered"), and
# it is the item here most likely to be a Chechen habit rather than an Ingush
# one. «цӀе-можа», «сийна-цӀе» and «цӀе-кӀай» for orange, purple and pink are
# transparent compounds written because the style pipeline needs twelve
# separate colour words and Ingush does not split its colour vocabulary at
# those twelve points; a speaker may well prefer the Russian loans that school
# writing uses. `noun.curve` is «нийса доаца сиз», "a line that is not
# straight" — a description rather than a term, chosen so that it cannot be
# confused with «нийса сиз» beside it.


## Style vocabulary
##
## The colour and width words take no class prefix, so none of them forks. That
## is a fact about Ingush adjectives rather than about Ingush agreement — the
## agreement is a few lines below, in `line-style`.

color =
    .black = Ӏаьржа
    .white = кӀай
    .gray = сира
    .red = цӀе
    .orange = цӀе-можа
    .yellow = можа
    .green = баьццара
    .cyan = сирла сийна
    .blue = сийна
    .purple = сийна-цӀе
    .pink = цӀе-кӀай
    .brown = мора
line-width =
    .thick = дуькъа
    .thin = дораха
# «кагдаь» is a past participle and carries the class of what it describes, so
# it forks; «тӀадамашца» is an instrumental noun and cannot agree, so it does
# not. See the header for why this is the one fork `locales/ce` does not write.
line-style =
    .dashed =
        { $gender ->
            [v] кагваь
            [j] кагйаь
            [b] кагбаь
           *[d] кагдаь
        }
    .dotted = тӀадамашца
# Noun phrases: they stand in front of the thing they describe and agree with
# nothing.
fill-style =
    .horizontal = горизонталан сизаш
    .vertical = вертикалан сизаш
    .diagonal = диагоналан сизаш
    .backdiagonal = духьал диагоналан сизаш
    .dots = тӀадамаш
    .diamonds = ромбаш
noun =
    .line = нийса сиз
    .line-segment = сизан дакъа
    .ray = луч
    .vector = вектор
    .curve = нийса доаца сиз
    .function = функци
    .slope-field = наклонан аре
    .vector-field = векторан аре
    .parabola = парабола
    .polyline = кагдаь сиз
    .polygon = дукха сонера
    .triangle = кхо сонера
    .rectangle = нийса сонера
    .circle = го
    .region = моттиг
    .point = тӀадам
    .square = квадрат
    .diamond = ромб
    .cross = жӀар
    .plus = плюс
# Ingush builds the whole word in front of the noun, so all of it is the head
# and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] нийса { $numSides } сонера
    }
# The class of the noun being described, handed to every word that agrees with
# it. See the header: only the entries this seed could check are written out,
# and everything else falls to `d`.
noun-gender =
    { $noun ->
        [point] b
        [cross] b
        [line] d
        [line-segment] d
        [ray] d
        [border] d
        [fill] d
        [text] d
        [background] d
       *[other] d
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
# «дизза» — full, filled — carries the class of the shape it fills at the front
# of the word, which is why `$gender` is read here at all.
style-filled-word =
    { $gender ->
        [v] визза
        [j] йизза
        [b] бизза
       *[d] дизза
    }
style-filled =
    { $parts ->
        [pattern] { $pattern } сурташца { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } сурташца { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } сурташца { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «йистеца» — "with an edge" — is a case form of a noun this catalog writes, so
# nothing is welded to a placeable and no article is wanted. Ingush's «а» is an
# enclitic and follows what it conjoins, so the two `and` branches end in it
# rather than opening with it — which is where they part from `locales/ce`.
style-border-clause =
    { $parts ->
        [with-article] { $border } йистеца
        [and] { $border } йистеца а
        [and-article] { $border } йистеца а
       *[with] { $border } йистеца
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } сурташца { $color } бос
       *[plain] { $color } бос
    }
# The negated participle agrees in the language exactly as the positive one
# does — «бизза боаца», «йизза йоаца», «визза воаца» — but this message
# describes a fill standing on its own, with no noun and so no `$gender`
# reaching it. The д-class form is written flat; a fork here could only ever
# render its default branch.
style-unfilled = дизза доаца
# «тӀа» — "on" — is a postposition and follows the background colour, so
# nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } фон тӀа { $color }
       *[plain] { $color }
    }
style-background-none = дац

## Boolean words

boolean-true = бакъ
boolean-false = харц

## Answer buttons

answer-submit-label = Таллар
answer-submit-label-no-correctness = Жоп дӀадала

## Sectional blocks

section-name =
    .activity = ГӀулакх
    .aside = ОагӀорара дош
    .cascade = Каскад
    .definition = Билгалдаккхар
    .example = Масал
    .exercise = Упражнени
    .exercises = Упражненеш
    .given-answer = Жоп
    .note = Билгалдар
    .objectives = Ӏалашонаш
    .paragraphs = Абзацаш
    .part = Дакъа
    .problem = Задача
    .problems = Задачаш
    .proof = ТӀачӀоагӀадар
    .question = Хаттар
    .section = Корта
    .solution = Сацам
    .task = Дехар
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
hint-title = Хьехам

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
        [numbered] Сурт { $enumeration }
        [numbered-caption] Сурт { $enumeration }{ ". " }
        [unnumbered-caption] Сурт{ ". " }
       *[unnumbered] Сурт
    }

## Paginator controls

paginator-previous = Хьалха
paginator-next = ТӀехьа
paginator-page = ОагӀув
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## Ingush's conditional «нагахьа» opens the clause it conditions, so this key
## lands where the renderer puts it — before the mathematics it introduces —
## and needs none of the caveat `locales/sah`, `locales/tyv`, `locales/udm`,
## `locales/kv` and `locales/chm` record for a clause-final "if". Chechen's
## «нагахь санна» is clause-initial too, so the two Vainakh catalogs agree
## here as well.

piecewise-condition-or = е
piecewise-condition-if = нагахьа
piecewise-condition-otherwise = кхыча тайпара

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Ingushetia is taught
## in Russian, so the element names an Ingush-speaking pupil actually meets are
## the Russian ones, and the English fallback beside the symbol is nearer that
## curriculum than 118 invented Ingush coinages would be. This is the
## school-system case the whole batch shares.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Нийса доаца химин хьаьрк
chemistry-invalid-ionic-compound = Нийса доаца ионий цхьанкхетар
