# Finnish viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Finnish counts in two plural categories, but the `other` branch is not a
# plural: after any numeral above one the noun stands in the partitive
# **singular** — «5 yritystä», never «5 yritykset». So the two branches differ
# in case rather than in number, and both are still needed.
#
# Register: the second-person imperative, which is what Finnish software uses.


## Answer submission

answer-checking = Tarkistetaan…
answer-submitting = Lähetetään…
answer-checking-status = Vastausta tarkistetaan
answer-submitting-status = Vastausta lähetetään
answer-correct = Oikein
answer-incorrect = Väärin
answer-response-saved = Vastaus tallennettu
answer-percent-credit = { $percent } % pisteistä
answer-percent-correct = { $percent } % oikein
answer-percent-short = { $percent } %
max-credit-available = Suurin saatavilla oleva pistemäärä: { $percent } %
attempts-remaining =
    { $count ->
        [0] ei yrityksiä jäljellä
        [one] { $count } yritys jäljellä
       *[other] { $count } yritystä jäljellä
    }
validation-correct = (Oikein)
validation-incorrect = (Väärin)
validation-partially-correct = (Osittain oikein)
# «kohteeseen» rather than a case ending on the answer's name: the illative
# harmonizes with the word it attaches to, and that word is an argument.
answer-show-responses =
    { $count ->
        [one] Näytä { $count } vastaus kohteeseen { $answerId }
       *[other] Näytä { $count } vastausta kohteeseen { $answerId }
    }

## Disclosure panels

feedback-heading = Palaute
collapsible-click-to-open = (avaa napsauttamalla)
collapsible-click-to-close = (sulje napsauttamalla)
collapsible-initializing = Alustetaan…
footnote-show = Näytä alaviite
footnote-hide = Piilota alaviite
description-more-information = lisätietoja

## Controls

slider-previous = Edell.
slider-next = Seur.
keyboard-open = Avaa näppäimistö
keyboard-close = Sulje näppäimistö
choice-input-remove-choice = Poista { $choice }
matrix-remove-row = Poista rivi
matrix-add-row = Lisää rivi
matrix-remove-column = Poista sarake
matrix-add-column = Lisää sarake
subset-add-remove-points = Lisää/poista pisteitä
subset-toggle-points-intervals = Vaihda pisteiden ja välien välillä
subset-move-points = Siirrä pisteitä
subset-clear = Tyhjennä
orbital-add-row = Lisää rivi
orbital-remove-row = Poista rivi
orbital-add-box = Lisää ruutu
orbital-remove-box = Poista ruutu
orbital-add-up-arrow = Lisää ylöspäin osoittava nuoli
orbital-add-down-arrow = Lisää alaspäin osoittava nuoli
orbital-remove-arrow = Poista nuoli
orbital-row-label = Rivin { $row } nimike
pretzel-answer = Vastaus

## Math input

math-input-preview-region = matemaattisen lausekkeen esikatselu
math-input-preview = Esikatselu
math-input-invalid-expression = Virheellinen lauseke:

## Document status

viewer-initializing = Alustetaan…

## Errors

error-heading = Virhe
error-found-at =
    { $span ->
        [line] Löytyi riviltä { $startLine }.
       *[lines] Löytyi riveiltä { $startLine }–{ $endLine }.
    }
document-contains-errors = Tässä asiakirjassa on virheitä!
diagnostic-heading-error = Virhe
diagnostic-heading-warning = Varoitus
diagnostic-heading-information = Tieto
diagnostic-heading-hint = Vihje
accessibility-heading-level-1 = WCAG AA -saavutettavuusrikkomus
accessibility-heading-level-2 = Saavutettavuushuomautus
something-went-wrong = Jokin meni pieleen.
renderer-load-failed = piirtomoduulin lataus epäonnistui. Lataa sivu uudelleen.
core-start-failed = Asiakirjan katselinta ei voitu käynnistää. Lataa sivu uudelleen.
