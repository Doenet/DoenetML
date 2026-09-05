# Livvi-Karelian viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** alphabet, with ä ö ü and č š ž. Livvi is a language
# of the Russian Federation that is not written in Cyrillic: the Republic of
# Karelia's official orthography for it has been Latin since 1989, and it is
# the norm the Republic's own newspapers, schoolbooks and dictionaries publish
# in. Nothing here should be transliterated into Cyrillic.
#
# **`olo` and `krl` are two languages, not two spellings of one.** ISO 639-3
# gives Livvi (Olonets Karelian) `olo` and Karelian `krl` separately, and puts
# no macrolanguage code over the pair, so neither catalog is reachable from the
# other's tag and neither should pretend to serve the other's reader. What is
# written here is the **Livvi** norm — the one the Karelian Republic publishes
# in — with its own shapes: «valgei», «vihandu», «pidäy», «da» for "and", the
# merged adessive-allative in a bare `-l`, and plain `s` where the Viena norm
# of `locales/krl` writes `š`. A Livvi reader can very largely read that file
# and a Viena reader can very largely read this one, and that mutual legibility
# is exactly why the two must not be copies of each other: a copy would put one
# norm's endings in front of the other's reader under its own name.
#
# Livvi counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps both branches. As in Finnish and Karelian
# Proper, the `other` branch is not really a plural — after any numeral above
# one the noun stands in the partitive **singular** — so the two branches
# differ in case rather than in number, and both are still needed.
#
# CLDR ships no plural rules for `olo`, so `Intl.PluralRules("olo")` falls back
# to the root's `one`/`other`. That is the right pair for Livvi, but it is a
# fallback rather than data about the language.


## Answer submission

answer-checking = Tarkistetah…
answer-submitting = Työnnetäh…
answer-checking-status = Vastavustu tarkistetah
answer-submitting-status = Vastavustu työnnetäh
answer-correct = Oigieh
answer-incorrect = Viärin
answer-response-saved = Vastavus on pandu mustoh
answer-percent-credit = { $percent } % pistolois
answer-percent-correct = { $percent } % oigieh
answer-percent-short = { $percent } %
max-credit-available = Suurin suadavu pistemiäry: { $percent } %
attempts-remaining =
    { $count ->
        [0] ei ole jiännyh yhtän yritysty
        [one] { $count } yritys jiännyh
       *[other] { $count } yritysty jiännyh
    }
validation-correct = (Oigieh)
validation-incorrect = (Viärin)
validation-partially-correct = (Ozittain oigieh)
# «kohtehele» rather than a case ending on the answer's own name: the allative
# harmonizes with the word it attaches to, and that word is an argument.
answer-show-responses =
    { $count ->
        [one] Ozuta { $count } vastavus kohtehele { $answerId }
       *[other] Ozuta { $count } vastavustu kohtehele { $answerId }
    }


## Disclosure panels

feedback-heading = Palaute
collapsible-click-to-open = (avua painamal)
collapsible-click-to-close = (salvua painamal)
collapsible-initializing = Alustetah…
footnote-show = Ozuta alaviite
footnote-hide = Peitä alaviite
description-more-information = liziä tieduo


## Controls

slider-previous = Ielli.
slider-next = Seur.
keyboard-open = Avua klavijatuuru
keyboard-close = Salvua klavijatuuru
choice-input-remove-choice = Ota iäres { $choice }
matrix-remove-row = Ota iäres riädy
matrix-add-row = Liziä riädy
matrix-remove-column = Ota iäres pačas
matrix-add-column = Liziä pačas
subset-add-remove-points = Liziä/ota iäres pistoloi
subset-toggle-points-intervals = Vaihta pistoloin da välilöin keskes
subset-move-points = Siirrä pistoloi
subset-clear = Tyhjendä
orbital-add-row = Liziä riädy
orbital-remove-row = Ota iäres riädy
orbital-add-box = Liziä ruuttu
orbital-remove-box = Ota iäres ruuttu
orbital-add-up-arrow = Liziä ülähpäi ozuttai nuoli
orbital-add-down-arrow = Liziä alahpäi ozuttai nuoli
orbital-remove-arrow = Ota iäres nuoli
orbital-row-label = Riävyn { $row } nimikeh
pretzel-answer = Vastavus


## Math input

math-input-preview-region = matemaatiekallizen ilmavunnon ezikaččelu
math-input-preview = Ezikaččelu
math-input-invalid-expression = Viäry ilmavundu:


## Document status

viewer-initializing = Alustetah…


## Errors

error-heading = Vigu
error-found-at =
    { $span ->
        [line] Löydyi riävyl { $startLine }.
       *[lines] Löydyi riävylöil { $startLine }–{ $endLine }.
    }
document-contains-errors = Täs dokumentas on vigoi!
diagnostic-heading-error = Vigu
diagnostic-heading-warning = Varaitus
diagnostic-heading-information = Tiedo
diagnostic-heading-hint = Nevvo
accessibility-heading-level-1 = WCAG AA -suavutettavuon rikkomus
accessibility-heading-level-2 = Suavutettavuon huomivo
something-went-wrong = Midätahto meni viärin.
renderer-load-failed = piirdomoduulua ei suadu ladie. Ladie sivu uvvessah.
core-start-failed = Tädä dokumentua ei suadu käynnistiä. Ladie sivu uvvessah.
core-start-failed-busy = Tädä dokumentua ei suadu käynnistiä. Yhtes aigua käynnistyi monii dokumentua, mi voibi kestiä pitkembäh hitahal laittehel. Sivun uvvessah ladindu voibi avvuttua, konzu toizet dokumentat ollah valmehet.
core-start-failed-retry = Tädä dokumentua ei suadu käynnistiä.
core-start-failed-busy-retry = Tädä dokumentua ei suadu käynnistiä. Yhtes aigua käynnistyi monii dokumentua, mi voibi kestiä pitkembäh hitahal laittehel.
core-start-retry = Opi vie kerran
saved-state-unavailable = Mustoh pandua ruaduo ei suadu ladie.
