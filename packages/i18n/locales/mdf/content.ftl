# Moksha content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **This file is the answer `locales/myv`'s header asks for.** That header says
# that Erzya and Moksha are two languages, not two spellings of one; that ISO
# 639-3 gives them `myv` and `mdf` separately with no macrolanguage code over
# them; that a Moksha reader arriving under `mdf` therefore "reaches English
# rather than this file"; and that "the answer to it is a `locales/mdf` beside
# this one, not a widening of this one". This is that catalog. It is a separate
# catalog, not a widening of `locales/myv`: nothing about `locales/myv` changes,
# and neither file is a fallback for the other.
#
# Written in Cyrillic, which is the orthography Mordovia's schools and
# publishing use for Moksha and what CLDR fills a bare `mdf` in as.
#
# Moksha has no grammatical gender and does not inflect an attributive
# adjective, so `$gender` and `$role` go unused, exactly as in `locales/myv`.
#
# The seed reached Moksha through the correspondences that separate it from
# Erzya in the words these files contain:
#
#   negation                «аф», «аш» for Erzya «а», «аволь», «арась»;
#                           «изь» for Erzya «эзь»
#   participle              -ф for Erzya -зь: максф, тиф, муф, артф
#   -фкс for Erzya -вкс     сюлмафкс (myv: сюлмавкс)
#   inessive/elative        -са, -ста for Erzya -сэ/-со, -стэ/-сто:
#                           ширеса, лангса (myv: чиресэ, лангсо)
#   -нза, -ть, -тне         for Erzya -нзэ, -нть, -тнэ
#   loan adjectives         -ай for Erzya -ой: серай, фиолетовай
#   lexicon                 мархта, инкса, кда, фкя, аньцек, лама, сяда, и
#                           (myv: марто, кисэ, бути, вейке, ансяк, ламо, седе,
#                           ды)
#   numerals                фкя, кафта, колма (myv: вейке, кавто, колмо), and
#                           the ablative on them in -да: фкяда, кафтада
#                           (myv: вейкеде, кавтодо)
#
# **Where the seed did not know Moksha's own word it left the shape Moksha and
# Erzya share**, rather than inventing one. Those are the first thing a speaker
# should correct, and they are the reason this catalog reads closer to
# `locales/myv` than a Moksha speaker will want it to. Four residues are known
# rather than guessed at, and are the next things to fix: the ablative is still
# written Erzya-style `-де/-до` outside the numerals («нетнеде»,
# «сюлмафкстнеде») where Moksha writes `-да`; the abessive is `-втомо`
# («таркавтомо», «точкавтомо») where Moksha writes `-фтома`; "equal" is
# «вейкетть», an Erzya form this seed could not confidently replace; and the
# lexicon row's «лама» reached only the bare word — everything built on it is
# still Erzya-shaped («ламоксчист», «ламоксчинтень», «аламо»,
# «коламо», «ламось»), because the seed could not establish Moksha's
# abstract-noun suffix here and declined to invent the case forms. The numerals
# and their ablative have been corrected — every `-да` on a digit below is the
# Moksha ending — so what is left is in the other endings rather than in the
# stems. The demonstrative was a fifth and is fixed: this file's «тя» stood
# beside an Erzya «те» in nine messages across the other three files, and all
# nine read «тя» now, though the case endings on the nouns they modify —
# «документсэть», «функциясоть», «таркань» — are the inessive residue named
# above rather than anything the demonstrative fixed.
#
# The word for a part is a sixth, and it is the one place this file and the
# other three disagree outright: `noun.line-segment`, `.part` and `.section`
# here are «пяльксня», «Пялькс» and «Пяльксня» — the Moksha `я` the vowel
# correspondences above call for — while `chrome.ftl`, `editor.ftl` and
# `diagnostics.ftl` write the Erzya «пелькс» in nine places, in six different
# cases («пельксэнь», «пелькскень», «пелькстнень», «пельксэзэ»,
# «Пелькскесь», «пелькстне»). The stem is wrong in all nine, but Moksha's
# connecting vowels in those cases could not be established, and correcting
# only the stem would produce forms no norm has, so they are left as they
# stand. This is the same decision the «лама» row records.
#
# «Пяльксня» is also both a line segment and a section, so the two will read
# alike wherever both appear; a reviewer should give one of them a head.


## Style vocabulary

color =
    .black = равжа
    .white = акша
    .gray = серай
    .red = якстерь
    .orange = оранжевай
    .yellow = тюжя
    .green = пиже
    .cyan = валда сенем
    .blue = сенем
    .purple = фиолетовай
    .pink = розовай
    .brown = коричневай
line-width =
    .thick = эчке
    .thin = шуваня
line-style =
    .dashed = сезнеф
    .dotted = точкань
# Noun phrases: they stand in front of «мазептемаса» and modify nothing.
fill-style =
    .horizontal = горизонтальнай линия
    .vertical = вертикальнай линия
    .diagonal = диагональнай линия
    .backdiagonal = каршо диагональнай линия
    .dots = точка
    .diamonds = ромб
noun =
    .line = виде линия
    .line-segment = пяльксня
    .ray = луч
    .vector = вектор
    .curve = кичкере линия
    .function = функция
    .slope-field = наклононь пакся
    .vector-field = векторонь пакся
    .parabola = парабола
    .polyline = синдеф линия
    .polygon = лама ужа
    .triangle = колма ужа
    .rectangle = виде ужа
    .circle = круг
    .region = тарка
    .point = точка
    .square = квадрат
    .diamond = ромб
    .cross = крёст
    .plus = плюс
# Moksha builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] видеста { $numSides } ужа
    }
# Moksha has no grammatical gender, so every noun answers the same and the
# answer goes unused.
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
style-filled-word = артф
style-filled =
    { $parts ->
        [pattern] { $pattern } мазептемаса { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } мазептемаса { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } мазептемаса { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «ширеса» is the inessive of «шире», "edge", and carries the whole of "with a
# border" in its own suffix — Erzya's «чиресэ» in the sister language, and the
# same shape `locales/udm` and `locales/kv` use from the other end of Uralic.
style-border-clause =
    { $parts ->
        [with-article] { $border } ширеса
        [and] и { $border } ширеса
        [and-article] и { $border } ширеса
       *[with] { $border } ширеса
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } мазептемаса { $color } артома
       *[plain] { $color } артома
    }
style-unfilled = апак арта
# «лангса» — "on" — is a postposition and follows the background colour, so
# nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } фон лангса { $color }
       *[plain] { $color }
    }
style-background-none = аш

## Boolean words

boolean-true = виде
boolean-false = аф виде

## Answer buttons

answer-submit-label = Варжамс
answer-submit-label-no-correctness = Каршо валоть кучомс

## Sectional blocks

section-name =
    .activity = Тев
    .aside = Ширень тяшкстама
    .cascade = Каскад
    .definition = Азома
    .example = Няфтема
    .exercise = Упражнения
    .exercises = Упражненият
    .given-answer = Каршо вал
    .note = Тяшкстама
    .objectives = Цельхть
    .paragraphs = Абзацт
    .part = Пялькс
    .problem = Задача
    .problems = Задачат
    .proof = Кемекстама
    .question = Кизефкс
    .section = Пяльксня
    .solution = Решения
    .task = Задания
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
hint-title = Няфтемня

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
        [numbered] Артофкс { $enumeration }
        [numbered-caption] Артофкс { $enumeration }{ ". " }
        [unnumbered-caption] Артофкс{ ". " }
       *[unnumbered] Артофкс
    }

## Paginator controls

paginator-previous = Инголень
paginator-next = Сай
paginator-page = Лопа
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## Moksha's conditional «кда» is clause-initial, as Erzya's «бути» is, so this
## key lands where the renderer puts it and there is no limit to record here —
## unlike the Permic catalogs, `locales/udm`, `locales/kv` and `locales/koi`,
## whose «ке» and «кӧ» follow their clause. Word order rather than family
## decides.

piecewise-condition-or = эли
piecewise-condition-if = кда
piecewise-condition-otherwise = лия лаца

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Mordovia is taught in
## Russian, so the element names a Moksha-speaking pupil meets are the Russian
## ones — the school-system case this batch shares throughout.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Аф виде химиянь тяшкс
chemistry-invalid-ionic-compound = Аф виде иононь сюлмафкс
