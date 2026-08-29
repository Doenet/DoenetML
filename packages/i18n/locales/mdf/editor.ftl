# Moksha editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
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
# `locales/myv` than a Moksha speaker will want it to. Three residues are known
# rather than guessed at, and are the next things to fix: the ablative is still
# written Erzya-style `-де/-до` outside the numerals («нетнеде»,
# «сюлмафкстнеде», «3-де») where Moksha writes `-да`; the abessive is `-втомо`
# («таркавтомо», «точкавтомо») where Moksha writes `-фтома`; and "equal" is
# «вейкетть», an Erzya form this seed could not confidently replace. The
# numerals and their ablative have been corrected, so what is left is in the
# other endings rather than in the stems.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Moksha counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Мекев велявтомс
       *[update] Одкстомтомс
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Ваныцять { $word }
       *[other] Ваныцять { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Кочкамо…
editor-variant-next = Сай вариантоть кочкамс
editor-variant-previous = Инголень вариантоть кочкамс


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA пачкодемань коламо муф. Пачкодемань отчётоть { $action ->
            [close] пекстамга
           *[open] панжомга
        } лепштик.
        [advisories] Пачкодемань отчётоть { $action ->
            [close] пекстамга
           *[open] панжомга
        } лепштик. WCAG AA коламот эзть муеве, аньцек улить поладкс невтефкст.
       *[clean] Пачкодемань отчётоть { $action ->
            [close] пекстамга
           *[open] панжомга
        } лепштик. Пачкодемань кефкстемат эзть муеве.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA пачкодемань коламо муф. { $count ->
            [one] { $count } WCAG AA коламо
           *[other] { $count } WCAG AA коламо
        } муф. Пачкодемань отчётоть { $action ->
            [close] пекстамга
           *[open] панжомга
        } лепштик.
        [advisories] WCAG AA коламот эзть муеве. { $count ->
            [one] { $count } поладкс невтефкс
           *[other] { $count } поладкс невтефкс
        } муф. Пачкодемань отчётоть { $action ->
            [close] пекстамга
           *[open] панжомга
        } лепштик.
       *[clean] WCAG AA коламот эзть муеве. Пачкодемань отчётоть { $action ->
            [close] пекстамга
           *[open] панжомга
        } лепштик.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версия { $version }

editor-tab-help = Контекстэнь лезкс
editor-tab-help-short = Контекст
editor-tab-errors = Ильведефкст
editor-tab-warnings = Икелев пелькстамот
editor-tab-info = Тевпаро
editor-tab-accessibility = Пачкодема
editor-tab-responses = Кучф каршо валт

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторонь анокстамот
editor-format-as-doenetml = DoenetML ладса форматировамс
editor-format-as-xml = XML ладса форматировамс


## The diagnostics panel

editor-diagnostic-line = { $line }-це ряд

editor-no-errors = Ильведефкст арасть
editor-no-warnings = Икелев пелькстамот арасть
editor-no-info = Тевпаронь ёвтамот арасть

editor-show-info-annotations = Тевпаронь ёвтамотнень редакторса невтемс
editor-show-accessibility-annotations = Пачкодемань ёвтамотнень редакторса невтемс

editor-accessibility-learn-more = Doenet пачкодемантень кода вансты

editor-accessibility-violations-heading = Пачкодемань коламот ({ $standard })

editor-accessibility-other-heading = Лия пачкодемань кефкстемат
editor-none-found = Мезеяк изь муеве


## Submitted responses

editor-no-responses = Течис кучф каршо валт арасть
editor-response-answer-id = Каршо валонь Id
editor-response-response = Каршо вал
editor-response-credit = Балл
editor-response-submitted = Кучф


## The context-help panel

help-placeholder = Документациять неемга курсороть путык тег лем ланкс, атрибут ланкс эли { $ref } ланкс.

help-unsupported-ref-chain = { $example } ладса лама пельксэнь сюлмафкстненень лезкс зярс аш.

help-unresolved-ref =
    { $reason ->
        [notFound] Сюлмафксонтень объект изь муеве: { $ref }.
        [multiple] Сюлмафксонтень лама объект муф: { $ref }.
       *[indeterminate] { $ref } объектэть содамс изь маштово.
    }

help-learn-about-references = Сюлмафкстнеде содамс →
help-reference-page = Невтемань лопа →

help-suggestions-header =
    { $location ->
        [inside] { $element } потса
       *[top] Сехте верде
    }{ $allowed ->
        [none] { " — теса мезеяк аф кельги." }
        [text] { " — теса текст сёрмадомс маштови." }
        [text-and-components] { " — теса текст сёрмадомс маштови, эли неть варчик:" }
       *[components] { " — неть варчемс маштови:" }
    }

help-suggestions-footer = Весе { $total } компонентэть неемга { $shortcut } лепштик.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объект ланкс сюлмафкс.
       *[other] { $ref } — { $target } объект ланкс сюлмафкс ({ $line }-це ряд).
    }

help-ref-derived-from =
    { $line ->
        [none] Сонза { $owner } { $role } ладса совавтызе.
       *[other] Сонза { $owner } { $line }-це рядса { $role } ладса совавтызе.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементэнь { $property } свойствать ланкс сюлмафкс.
       *[other] { $ref } — { $element } элементэнь { $property } свойствать ланкс сюлмафкс ({ $line }-це ряд).
    }

help-kind-attribute = атрибут
help-kind-snippet = пелькске
help-kind-array-entry = массивень элемент

help-default = Основнай питне:
help-active-default = Неень основнай питне:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Мерезь питнеть (эрьва элементэнтень фкя):
       *[other] Мерезь питнеть:
    }

help-suggested-values = Невтезь питнеть:

help-inserts = Полады:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатат:
    }

help-type = Лад:

help-resolved-style = Лисьф стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Лисьф функциянь лемть:
help-reset-list = Те таркань мекев велявтомань список:
help-added-on-input = Те таркаса поладозь:
help-removed-on-input = Те таркаста сяф:

help-reset-overrides = { $reset } — { $additional } и { $removed } лангса изни.
