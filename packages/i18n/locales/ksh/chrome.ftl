# Colognian (Kölsch) viewer chrome: buttons, panel headers, and the other UI
# the reader interacts with. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file writes the convention the Akademie för uns Kölsche
# Sproch publishes in. Three things in it are spelling rather than decoration:
# «ß» is kept and is not resolved to «ss»; a doubled vowel marks length and
# distinguishes words («Versöök», «Antwood», «Naam»); and «j» stands where
# Standard German writes «g» at the start of a word or a syllable — «jroß»,
# «jrön», «jelade», «jefunge». That last one is the loudest visible
# break from `locales/de`, and it is the quickest way to check whether a
# sentence here is still Kölsch.
#
# **This must not be edited toward Standard German.** Kölsch is a Ripuarian
# language of its own and not a pronunciation of German, and a corrector who
# smooths it out is writing a different catalog. The words that go first when
# that happens, and which are correct as they stand here: «nit» and not
# «nicht», «kütt» and not «kommt», «Sigg» and not «Seite», «Beld» and not
# «Bild», «Fähler» and not «Fehler», «däm» and not «dem». Also «un», «met»,
# «op», «vun», «öm», «nix», «jitt», «wääde».
#
# **Number — and the one thing this catalog has that the rest of its batch
# does not.** CLDR gives `ksh` three plural categories: `zero`, `one` and
# `other`. `zero` selects at n = 0. Two mechanisms can pick out a count of
# nothing in Fluent and they are not the same thing:
#
#   * an explicit `[0]` variant is matched against **the number itself**, and
#     works in every locale whatever its rules are;
#   * a `[zero]` variant is matched against **the CLDR plural category**, and
#     only ever selects in a locale whose own rules have that category.
#
# Colognian is the only locale in this fifteen-locale batch, and one of very
# few in the whole repository, where the second is truthfully available. Where
# English already writes an explicit `[0]` — `attempts-remaining` below — that
# literal is kept and **no** `[zero]` branch is added beside it: two mechanisms
# selecting the same number is a trap, and the literal already wins. The
# genuine `[zero]` branch is in `editor.ftl`, on `help-suggestions-footer`,
# where English has no `[0]` and the count can really be nothing.
#
# `[two]`, `[few]` and `[many]` are never written here: `ksh` has none of them,
# and such a branch would be dead text.
#
# Every **symbolic** selector key — `[none]`, `[dark]`, `[line]`, `[lines]`,
# `[other]` — is kept byte for byte from English. So are the names `WCAG AA`
# and `DoenetML`.


## Answer submission

answer-checking = Am Pröfe…
answer-submitting = Am Schecke…

answer-checking-status = De Antwood weed jepröf
answer-submitting-status = De Antwood weed jescheck

answer-correct = Richtich
answer-incorrect = Verkiehrt

answer-response-saved = Antwood jespeichert

answer-percent-credit = { $percent }% Punkte
answer-percent-correct = { $percent }% richtich
answer-percent-short = { $percent } %

max-credit-available = Maximal ze krieje: { $percent }%

attempts-remaining =
    { $count ->
        [0] kei Versöök mieh övrich
        [one] noch { $count } Versöök övrich
       *[other] noch { $count } Versöök övrich
    }

validation-correct = (Richtich)
validation-incorrect = (Verkiehrt)
validation-partially-correct = (Deilwies richtich)

answer-show-responses =
    { $count ->
        [one] { $count } Antwood op { $answerId } zeije
       *[other] { $count } Antwoode op { $answerId } zeije
    }


## Disclosure panels

feedback-heading = Rückmeldung

collapsible-click-to-open = (klick zom Opmaache)
collapsible-click-to-close = (klick zom Zomaache)

collapsible-initializing = Weed opjebout…

footnote-show = Fooßnoot zeije
footnote-hide = Fooßnoot verstoppe

description-more-information = mieh ze wesse


## Controls

slider-previous = Retour
slider-next = Wigger

keyboard-open = Tastatur opmaache
keyboard-close = Tastatur zomaache

choice-input-remove-choice = { $choice } eruusnemme

matrix-remove-row = Reih eruusnemme
matrix-add-row = Reih dobei donn
matrix-remove-column = Spalt eruusnemme
matrix-add-column = Spalt dobei donn

subset-add-remove-points = Pünkte dobei donn odder eruusnemme
subset-toggle-points-intervals = Zwesche Pünkte un Intervalle wähßele
subset-move-points = Pünkte verschebbe
subset-clear = Leddich maache

orbital-add-row = Reih dobei donn
orbital-remove-row = Reih eruusnemme
orbital-add-box = Kaste dobei donn
orbital-remove-box = Kaste eruusnemme
orbital-add-up-arrow = Pfiel noh bovve dobei donn
orbital-add-down-arrow = Pfiel noh onge dobei donn
orbital-remove-arrow = Pfiel eruusnemme

orbital-row-label = Beschreftung för Reih { $row }

pretzel-answer = Antwood



## Math input

math-input-preview-region = Vörschau vun däm mathematische Ussdrock
math-input-preview = Vörschau
math-input-invalid-expression = Ungültije Ussdrock:


## Document status

viewer-initializing = Weed opjebout…


## Errors

error-heading = Fähler

error-found-at =
    { $span ->
        [line] Jefunge en Reih { $startLine }.
       *[lines] Jefunge en de Reije { $startLine }–{ $endLine }.
    }

document-contains-errors = En däm Dokemänt sin Fähler dren!

diagnostic-heading-error = Fähler
diagnostic-heading-warning = Warnung
diagnostic-heading-information = Info
diagnostic-heading-hint = Tipp

accessibility-heading-level-1 = WCAG AA Verstoß jäjen de Barrierefreiheit
accessibility-heading-level-2 = Hiwies zur Barrierefreiheit

something-went-wrong = Do es jet scheef jelaufe.

renderer-load-failed = en Darstellung kunnt nit jelade wääde. Lad de Sigg bitte noch ens.

core-start-failed = Dat Dokemänt kunnt nit jestart wääde. Lad de Sigg bitte noch ens.

core-start-failed-busy = Dat Dokemänt kunnt nit jestart wääde. Et sin mieh Dokemänte op eimol aanjejange, un op enem langsame Jerät duurt dat dann lang. Wann de andere fäädich sin, hilf et velleich, de Sigg noch ens ze lade.

core-start-failed-retry = Dat Dokemänt kunnt nit jestart wääde.

core-start-failed-busy-retry = Dat Dokemänt kunnt nit jestart wääde. Et sin mieh Dokemänte op eimol aanjejange, un op enem langsame Jerät duurt dat dann lang.

core-start-retry = Noch ens probeere

saved-state-unavailable = Ding jespeicherte Arbeid kunnt nit jelade wääde.
