# Fijian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Standard Fijian (Bauan), the variety Fijian publishing, radio and
# the school readers use. The orthography is the one the Bible translation
# settled and the Ministry of Education follows: «b», «d», «q» and «g» are the
# prenasalized and velar consonants, not the English ones, so «drokadroka» and
# «karakarawa» are spelled as they stand rather than respelled.
#
# Fijian marks no number on the noun — «e dua na laini» and «e vica na laini»
# differ in the numeral, not in the noun — so a `{ $count -> … }` whose two
# English branches differ only in the noun renders one string here and the
# select is dropped. A `[0]` branch stays wherever English has one.


## Answer submission

answer-checking = Sa vakadikevi tiko…
answer-submitting = Sa vakau tiko…
answer-checking-status = Sa vakadikevi tiko na isau
answer-submitting-status = Sa vakau tiko na isau
answer-correct = Dodonu
answer-incorrect = Sega ni dodonu
answer-response-saved = Sa maroroi na isau
answer-percent-credit = { $percent }% na ivotavota
answer-percent-correct = { $percent }% dodonu
answer-percent-short = { $percent } %
max-credit-available = Ivotavota levu duadua e rawati: { $percent }%
# No select: «itovo ni saga» is the same phrase for one and for many. The `[0]`
# branch stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] sa sega na isaga e vo
       *[other] e vo tiko e { $count } na isaga
    }
validation-correct = (Dodonu)
validation-incorrect = (Sega ni dodonu)
validation-partially-correct = (Dodonu ena dua na tikina)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Vakaraitaka e { $count } na isau me baleta na { $answerId }

## Disclosure panels

feedback-heading = Ivakamacala
collapsible-click-to-open = (kilika me dolavi)
collapsible-click-to-close = (kilika me sogoti)
collapsible-initializing = Sa tekivu tiko…
footnote-show = Vakaraitaka na footnote
footnote-hide = Vunitaka na footnote
description-more-information = itukutuku tale

## Controls

slider-previous = Liu
slider-next = Tarava
keyboard-open = Dolava na kipodi
keyboard-close = Sogota na kipodi
choice-input-remove-choice = Kau tani na { $choice }
matrix-remove-row = Kau tani na rowa
matrix-add-row = Kuria e dua na rowa
matrix-remove-column = Kau tani na duru
matrix-add-column = Kuria e dua na duru
subset-add-remove-points = Kuria/Kau tani na poini
subset-toggle-points-intervals = Veisautaka na poini kei na kalawa
subset-move-points = Toso na poini
subset-clear = Vakasavasavataka
orbital-add-row = Kuria e dua na rowa
orbital-remove-row = Kau tani na rowa
orbital-add-box = Kuria e dua na kato
orbital-remove-box = Kau tani na kato
orbital-add-up-arrow = Kuria e dua na iviri cake
orbital-add-down-arrow = Kuria e dua na iviri sobu
orbital-remove-arrow = Kau tani na iviri
orbital-row-label = Iyacana ni rowa { $row }
pretzel-answer = Isau

## Math input

math-input-preview-region = irairai taumada ni ivakamacala vakaiwiliwili
math-input-preview = Irairai taumada
math-input-invalid-expression = Ivakamacala e sega ni dodonu:

## Document status

viewer-initializing = Sa tekivu tiko…

## Errors

error-heading = Cala
error-found-at =
    { $span ->
        [line] E kune ena laini { $startLine }.
       *[lines] E kune ena laini { $startLine }–{ $endLine }.
    }
document-contains-errors = E tiko e so na cala ena ivola oqo!
diagnostic-heading-error = Cala
diagnostic-heading-warning = Ivakasalasala
diagnostic-heading-information = Itukutuku
diagnostic-heading-hint = Idusidusi
accessibility-heading-level-1 = Beitaki ni ivakatagedegede ni rawarawa WCAG AA
accessibility-heading-level-2 = Ivakasalasala me baleta na rawarawa
something-went-wrong = E dua na ka e cala.
renderer-load-failed = e dua na renderer e sega ni laveti rawa. Yalovinaka lomani tale na tabana.
core-start-failed = Sa sega ni tekivu rawa na irairai ni ivola. Yalovinaka lomani tale na tabana.
