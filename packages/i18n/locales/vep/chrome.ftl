# Veps viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** alphabet, with ä ö ü, č š ž and the apostrophe that
# marks palatalization («kel'», «pol'»). Veps is a language of the Russian
# Federation that is not written in Cyrillic: its modern orthography has been
# Latin since 1989, it is what the Republic of Karelia's Veps schoolbooks,
# «Kodima» and the Veps dictionaries use, and it is what CLDR fills a bare
# `vep` in as. The 1930s Latin alphabet and the short-lived 1990s Cyrillic
# experiment are both history; nothing here should be transliterated into
# Cyrillic.
#
# Veps is Finnic but it is not Karelian: it is a separate ISO 639-3 language
# with no macrolanguage over it, and `locales/krl`, `locales/olo` and this file
# are three catalogs for three languages. Veps has lost the final vowel of most
# stems — «must», «vauged», «sanged» against Finnish «musta», «valkoinen»,
# «paksu» — and a Karelian file transliterated into Veps spelling would be
# wrong in nearly every word.
#
# Veps counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps both branches. As in the rest of Finnic the
# `other` branch is not really a plural — after any numeral above one the noun
# stands in the partitive **singular** — so the two branches differ in case
# rather than in number, and both are still needed.
#
# CLDR ships no plural rules for `vep`, so `Intl.PluralRules("vep")` falls back
# to the root's `one`/`other`. That is the right pair for Veps, but it is a
# fallback rather than data about the language.
#
# **The vocabulary least certain in this seed is the technical one.** Veps has
# no settled words for a good deal of software and mathematics, and where the
# language has not fixed one this catalog writes the Russian-mediated loan the
# Veps press actually uses — «komponent», «atribut», «funkcii», «klaviatur»,
# «dokument» — rather than inventing a native compound. A reviewer should
# expect to change those first.


## Answer submission

answer-checking = Tarkištadas…
answer-submitting = Oigetas…
answer-checking-status = Vastust tarkištadas
answer-submitting-status = Vastust oigetas
answer-correct = Oikti
answer-incorrect = Ei oikti
answer-response-saved = Vastuz om pandud muštho
answer-percent-credit = { $percent } % bal'oiš
answer-percent-correct = { $percent } % oikti
answer-percent-short = { $percent } %
max-credit-available = Suremb sadai ballmär: { $percent } %
attempts-remaining =
    { $count ->
        [0] ei ole jänud kokendoid
        [one] { $count } kokend om jänu
       *[other] { $count } kokendad om jänu
    }
validation-correct = (Oikti)
validation-incorrect = (Ei oikti)
validation-partially-correct = (Ozaks oikti)
# «kohtale» rather than a case ending on the answer's own name: the allative
# harmonizes with the word it attaches to, and that word is an argument.
answer-show-responses =
    { $count ->
        [one] Ozuta { $count } vastuz kohtale { $answerId }
       *[other] Ozuta { $count } vastust kohtale { $answerId }
    }


## Disclosure panels

feedback-heading = Otziv
collapsible-click-to-open = (avaida painmal)
collapsible-click-to-close = (saupta painmal)
collapsible-initializing = Zavodidas…
footnote-show = Ozuta alviit
footnote-hide = Peita alviit
description-more-information = enamba tedoid


## Controls

slider-previous = Ed.
slider-next = Jäl.
keyboard-open = Avaida klaviatur
keyboard-close = Saupta klaviatur
choice-input-remove-choice = Heitä { $choice }
matrix-remove-row = Heitä rid
matrix-add-row = Ližadä rid
matrix-remove-column = Heitä pacaz
matrix-add-column = Ližadä pacaz
subset-add-remove-points = Ližadä/heitä punktoid
subset-toggle-points-intervals = Vajehta punktoiden da välidoiden keskes
subset-move-points = Sirda punktoid
subset-clear = Tühjenda
orbital-add-row = Ližadä rid
orbital-remove-row = Heitä rid
orbital-add-box = Ližadä laudik
orbital-remove-box = Heitä laudik
orbital-add-up-arrow = Ližadä ülähäks ozutai nol'
orbital-add-down-arrow = Ližadä alahaks ozutai nol'
orbital-remove-arrow = Heitä nol'
orbital-row-label = Ridan { $row } nimikaz
pretzel-answer = Vastuz


## Math input

math-input-preview-region = matematižen vertusen edelkacund
math-input-preview = Edelkacund
math-input-invalid-expression = Vär vertuz:


## Document status

viewer-initializing = Zavodidas…


## Errors

error-heading = Vig
error-found-at =
    { $span ->
        [line] Löutihe ridal { $startLine }.
       *[lines] Löutihe ridoil { $startLine }–{ $endLine }.
    }
document-contains-errors = Necoš dokumentas oma vigad!
diagnostic-heading-error = Vig
diagnostic-heading-warning = Varutez
diagnostic-heading-information = Ted
diagnostic-heading-hint = Nevond
accessibility-heading-level-1 = WCAG AA -sadatoin rikkond
accessibility-heading-level-2 = Sadatoiden homaiduz
something-went-wrong = Midä-se mäni väriš.
renderer-load-failed = piirdmoduld ei voitud ladida. Ladi lehtpol' udes.
core-start-failed = Necidä dokumentad ei voitud käinduzoitta. Ladi lehtpol' udes.
core-start-failed-busy = Necidä dokumentad ei voitud käinduzoitta. Ühtes aigas käinduzoittihe äi dokumentad, mi voib kestta hätkemba hillhal laitehel. Lehtpolen udes ladind voib abutada, konz toižed dokumentad oma valmhed.
core-start-failed-retry = Necidä dokumentad ei voitud käinduzoitta.
core-start-failed-busy-retry = Necidä dokumentad ei voitud käinduzoitta. Ühtes aigas käinduzoittihe äi dokumentad, mi voib kestta hätkemba hillhal laitehel.
core-start-retry = Kokka völ kerdan
saved-state-unavailable = Muštho pandud radod ei voitud ladida.
