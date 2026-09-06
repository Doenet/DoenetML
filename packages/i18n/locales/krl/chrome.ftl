# Karelian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** alphabet, with ä ö ü and č š ž. Karelian is a
# language of the Russian Federation that is not written in Cyrillic: its
# official orthography in the Republic of Karelia has been Latin since 1989,
# and CLDR fills a bare `krl` in the same way. Nothing here should be
# transliterated into Cyrillic.
#
# **`krl` and `olo` are two languages, not two spellings of one.** ISO 639-3
# gives Karelian `krl` and Livvi `olo` separately, and puts no macrolanguage
# code over them, so neither catalog can be reached from the other's tag and
# neither should pretend to serve the other's reader. What is written here is
# the **Karelian Proper (Viena / Northern)** literary norm — «musta», «valkie»,
# «vihrie», the adessive in `-lla/-llä`. A Livvi reader can very largely read
# it, and a Karelian Proper reader can very largely read `locales/olo`, and
# that mutual legibility is exactly why the two files must not be copies of
# each other: a copy would put Livvi endings in front of a Viena reader while
# claiming to be their own norm.
#
# Karelian counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps both branches. Like Finnish, the `other` branch
# is not really a plural — after any numeral above one the noun stands in the
# partitive **singular** — so the two branches differ in case rather than in
# number, and both are still needed.
#
# CLDR ships no plural rules for `krl`, so `Intl.PluralRules("krl")` falls back
# to the root's `one`/`other`. That happens to be the right pair for Karelian,
# but it is a fallback rather than data about the language.


## Answer submission

answer-checking = Tarkistetah…
answer-submitting = Työnnetäh…
answer-checking-status = Vastausta tarkistetah
answer-submitting-status = Vastausta työnnetäh
answer-correct = Oikein
answer-incorrect = Väärin
answer-response-saved = Vastaus on pantu muistih
answer-percent-credit = { $percent } % pisteistä
answer-percent-correct = { $percent } % oikein
answer-percent-short = { $percent } %
max-credit-available = Suurin suatava pistemiärä: { $percent } %
attempts-remaining =
    { $count ->
        [0] ei yritystä jiänyn
        [one] { $count } yritys jiänyn
       *[other] { $count } yritystä jiänyn
    }
validation-correct = (Oikein)
validation-incorrect = (Väärin)
validation-partially-correct = (Ozittain oikein)
# «kohtieh» rather than a case ending on the answer's own name: the illative
# harmonizes with the word it attaches to, and that word is an argument.
answer-show-responses =
    { $count ->
        [one] Näytä { $count } vastaus kohtieh { $answerId }
       *[other] Näytä { $count } vastausta kohtieh { $answerId }
    }


## Disclosure panels

feedback-heading = Palaute
collapsible-click-to-open = (avua painamalla)
collapsible-click-to-close = (salpua painamalla)
collapsible-initializing = Alustetah…
footnote-show = Näytä alaviiteh
footnote-hide = Peitä alaviiteh
description-more-information = lisätietuo


## Controls

slider-previous = Eell.
slider-next = Seur.
keyboard-open = Avua näppäimistö
keyboard-close = Salpua näppäimistö
choice-input-remove-choice = Poista { $choice }
matrix-remove-row = Poista rivi
matrix-add-row = Ližiä rivi
matrix-remove-column = Poista pačas
matrix-add-column = Ližiä pačas
subset-add-remove-points = Ližiä/poista pistehie
subset-toggle-points-intervals = Vaihta pistehien ta välien välillä
subset-move-points = Siirrä pistehie
subset-clear = Tyhjennä
orbital-add-row = Ližiä rivi
orbital-remove-row = Poista rivi
orbital-add-box = Ližiä ruutu
orbital-remove-box = Poista ruutu
orbital-add-up-arrow = Ližiä ylähpäin ozuttaja nuoli
orbital-add-down-arrow = Ližiä alahpäin ozuttaja nuoli
orbital-remove-arrow = Poista nuoli
orbital-row-label = Rivin { $row } nimikeh
pretzel-answer = Vastaus


## Math input

math-input-preview-region = matemaattisen lausekkehen ezikatselu
math-input-preview = Ezikatselu
math-input-invalid-expression = Viärä lauseke:


## Document status

viewer-initializing = Alustetah…


## Errors

error-heading = Virheh
error-found-at =
    { $span ->
        [line] Löyty riviltä { $startLine }.
       *[lines] Löyty riviltä { $startLine }–{ $endLine }.
    }
document-contains-errors = Täššä asiakirjašša on virheitä!
diagnostic-heading-error = Virheh
diagnostic-heading-warning = Varotus
diagnostic-heading-information = Tieto
diagnostic-heading-hint = Vihjeh
accessibility-heading-level-1 = WCAG AA -šuavutettavuurikkomus
accessibility-heading-level-2 = Šuavutettavuuhuomavo
something-went-wrong = Jotain meni pieleh.
renderer-load-failed = piirtomoduulin lataus epäonnistu. Lataa sivu uuvvestah.
core-start-failed = Tätä asiakirjua ei šuatu käynnistyä. Lataa sivu uuvvestah.
core-start-failed-busy = Tätä asiakirjua ei šuatu käynnistyä. Yhtä aikua käynnisty monta asiakirjua, mi voipi kestyä kauvemmin hiaččemalla laittehella. Sivun uuvvestah lataaminen voipi auttua, konša muut asiakirjat ollah valmehet.
core-start-failed-retry = Tätä asiakirjua ei šuatu käynnistyä.
core-start-failed-busy-retry = Tätä asiakirjua ei šuatu käynnistyä. Yhtä aikua käynnisty monta asiakirjua, mi voipi kestyä kauvemmin hiaččemalla laittehella.
core-start-retry = Kokeile vielä
saved-state-unavailable = Tallennettuo ruatuo ei šuatu ladata.
