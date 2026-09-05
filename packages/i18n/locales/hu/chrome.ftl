# Hungarian viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **A counted noun stays singular.** Hungarian says «5 próbálkozás», never
# «5 próbálkozások», so `one` and `other` would read identically and the
# select is dropped wherever the only difference English draws is number. What
# remains is `[0]`, which is a wording change rather than a grammatical one.
#
# **«a(z)» is Hungarian's own answer to the placeable problem.** The definite
# article is «a» before a consonant and «az» before a vowel, and where the next
# word is an argument the catalog cannot know which — so Hungarian writes both,
# which is the standard convention in forms and software and not a workaround
# invented here.
#
# Register: the formal address («Töltse újra az oldalt»), which is what
# Hungarian software uses.


## Answer submission

answer-checking = Ellenőrzés…
answer-submitting = Beküldés…
answer-checking-status = Válasz ellenőrzése
answer-submitting-status = Válasz beküldése
answer-correct = Helyes
answer-incorrect = Helytelen
answer-response-saved = Válasz mentve
answer-percent-credit = { $percent }% pont
answer-percent-correct = { $percent }% helyes
answer-percent-short = { $percent } %
max-credit-available = Elérhető maximális pont: { $percent }%
attempts-remaining =
    { $count ->
        [0] nincs több próbálkozás
       *[other] { $count } próbálkozás maradt
    }
validation-correct = (Helyes)
validation-incorrect = (Helytelen)
validation-partially-correct = (Részben helyes)
# «ehhez:» rather than a case suffix on the answer's name: «-hoz/-hez/-höz»
# harmonizes with the word it attaches to, and that word is an argument.
answer-show-responses = { $count } válasz megjelenítése ehhez: { $answerId }

## Disclosure panels

feedback-heading = Visszajelzés
collapsible-click-to-open = (kattintson a megnyitáshoz)
collapsible-click-to-close = (kattintson a bezáráshoz)
collapsible-initializing = Inicializálás…
footnote-show = Lábjegyzet megjelenítése
footnote-hide = Lábjegyzet elrejtése
description-more-information = további információ

## Controls

slider-previous = Előző
slider-next = Következő
keyboard-open = Billentyűzet megnyitása
keyboard-close = Billentyűzet bezárása
choice-input-remove-choice = { $choice } eltávolítása
matrix-remove-row = Sor eltávolítása
matrix-add-row = Sor hozzáadása
matrix-remove-column = Oszlop eltávolítása
matrix-add-column = Oszlop hozzáadása
subset-add-remove-points = Pontok hozzáadása/eltávolítása
subset-toggle-points-intervals = Pontok és intervallumok váltása
subset-move-points = Pontok mozgatása
subset-clear = Törlés
orbital-add-row = Sor hozzáadása
orbital-remove-row = Sor eltávolítása
orbital-add-box = Doboz hozzáadása
orbital-remove-box = Doboz eltávolítása
orbital-add-up-arrow = Felfelé mutató nyíl hozzáadása
orbital-add-down-arrow = Lefelé mutató nyíl hozzáadása
orbital-remove-arrow = Nyíl eltávolítása
orbital-row-label = A(z) { $row }. sor címkéje
pretzel-answer = Válasz

## Math input

math-input-preview-region = matematikai kifejezés előnézete
math-input-preview = Előnézet
math-input-invalid-expression = Érvénytelen kifejezés:

## Document status

viewer-initializing = Inicializálás…

## Errors

error-heading = Hiba
error-found-at =
    { $span ->
        [line] A(z) { $startLine }. sorban található.
       *[lines] A(z) { $startLine }–{ $endLine }. sorban található.
    }
document-contains-errors = Ez a dokumentum hibákat tartalmaz!
diagnostic-heading-error = Hiba
diagnostic-heading-warning = Figyelmeztetés
diagnostic-heading-information = Információ
diagnostic-heading-hint = Tipp
accessibility-heading-level-1 = WCAG AA akadálymentességi szabálysértés
accessibility-heading-level-2 = Akadálymentességi figyelmeztetés
something-went-wrong = Valami hiba történt.
renderer-load-failed = egy megjelenítőmodult nem sikerült betölteni. Töltse újra az oldalt.
core-start-failed = A dokumentummegjelenítőt nem sikerült elindítani. Töltse újra az oldalt.
