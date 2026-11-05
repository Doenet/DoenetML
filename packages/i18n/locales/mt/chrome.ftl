# Maltese viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Maltese counts in five plural categories — `one`, `two`, `few`, `many` and
# `other` — and they are not a scale of size. Three to ten take the plural,
# eleven to nineteen go back to the singular with an `-il` on the numeral, and
# twenty and up stay singular. So `many` here is the 11–19 branch and reads
# with a singular noun, which is what separates it from `few`.


## Answer submission

answer-checking = Qed jiġi ċċekkjat…
answer-submitting = Qed jintbagħat…
answer-checking-status = It-tweġiba qed tiġi ċċekkjata
answer-submitting-status = It-tweġiba qed tintbagħat
answer-correct = Korretta
answer-incorrect = Mhux korretta
answer-response-saved = It-tweġiba ġiet salvata
answer-percent-credit = { $percent }% tal-punteġġ
answer-percent-correct = { $percent }% korrett
answer-percent-short = { $percent } %
max-credit-available = L-ogħla punteġġ disponibbli: { $percent }%
attempts-remaining =
    { $count ->
        [0] ma fadal l-ebda prova
        [one] fadal { $count } prova
        [two] fadal { $count } provi
        [few] fadal { $count } provi
        [many] fadal { $count }-il prova
       *[other] fadal { $count } prova
    }
validation-correct = (Korretta)
validation-incorrect = (Mhux korretta)
validation-partially-correct = (Parzjalment korretta)
answer-show-responses =
    { $count ->
        [one] Uri { $count } tweġiba għal { $answerId }
        [two] Uri { $count } tweġibiet għal { $answerId }
        [few] Uri { $count } tweġibiet għal { $answerId }
        [many] Uri { $count }-il tweġiba għal { $answerId }
       *[other] Uri { $count } tweġiba għal { $answerId }
    }

## Disclosure panels

feedback-heading = Rispons
collapsible-click-to-open = (ikklikkja biex tiftaħ)
collapsible-click-to-close = (ikklikkja biex tagħlaq)
collapsible-initializing = Qed jinbeda…
footnote-show = Uri n-nota f'qiegħ il-paġna
footnote-hide = Aħbi n-nota f'qiegħ il-paġna
description-more-information = aktar informazzjoni

## Controls

slider-previous = Ta' qabel
slider-next = Li jmiss
keyboard-open = Iftaħ it-tastiera
keyboard-close = Agħlaq it-tastiera
choice-input-remove-choice = Neħħi { $choice }
matrix-remove-row = Neħħi ringiela
matrix-add-row = Żid ringiela
matrix-remove-column = Neħħi kolonna
matrix-add-column = Żid kolonna
subset-add-remove-points = Żid/neħħi punti
subset-toggle-points-intervals = Aqleb bejn punti u intervalli
subset-move-points = Mexxi l-punti
subset-clear = Ħassar
orbital-add-row = Żid ringiela
orbital-remove-row = Neħħi ringiela
orbital-add-box = Żid kaxxa
orbital-remove-box = Neħħi kaxxa
orbital-add-up-arrow = Żid vleġġa 'l fuq
orbital-add-down-arrow = Żid vleġġa 'l isfel
orbital-remove-arrow = Neħħi vleġġa
orbital-row-label = Tikketta għar-ringiela { $row }
pretzel-answer = Tweġiba

## Math input

math-input-preview-region = previżjoni tal-espressjoni matematika
math-input-preview = Previżjoni
math-input-invalid-expression = Espressjoni invalida:

## Document status

viewer-initializing = Qed jinbeda…

## Errors

error-heading = Żball
error-found-at =
    { $span ->
        [line] Instab fil-linja { $startLine }.
       *[lines] Instab fil-linji { $startLine }–{ $endLine }.
    }
document-contains-errors = Dan id-dokument fih żbalji!
diagnostic-heading-error = Żball
diagnostic-heading-warning = Twissija
diagnostic-heading-information = Informazzjoni
diagnostic-heading-hint = Ħjiel
accessibility-heading-level-1 = Ksur tal-aċċessibbiltà WCAG AA
accessibility-heading-level-2 = Twissija dwar l-aċċessibbiltà
something-went-wrong = Xi ħaġa marret ħażin.
renderer-load-failed = renderer ma setax jitgħabba. Jekk jogħġbok, erġa' għabbi l-paġna.
core-start-failed = Il-viewer tad-dokument ma setax jinbeda. Jekk jogħġbok, erġa' għabbi l-paġna.
