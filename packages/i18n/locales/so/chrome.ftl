# Somali viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register: a control takes the bare singular imperative — `Fur`, `Ku dar`,
# `Muuji` — which is how Somali names an action, and a status takes a verbal
# noun or the impersonal `waa la` construction (`Waa la hubinayaa`), which
# reports without naming who is doing it.


## Answer submission

answer-checking = Waa la hubinayaa...
answer-submitting = Waa la dirayaa...
answer-checking-status = Jawaabta waa la hubinayaa
answer-submitting-status = Jawaabta waa la dirayaa
answer-correct = Sax
answer-incorrect = Qalad
answer-response-saved = Jawaabta waa la keydiyay
answer-percent-credit = { $percent }% dhibcood
answer-percent-correct = { $percent }% sax
answer-percent-short = { $percent } %
max-credit-available = Ugu badnaan la heli karo: { $percent }%
attempts-remaining =
    { $count ->
        [0] isku day ma harin
        [one] { $count } isku day ayaa harsan
       *[other] { $count } isku day ayaa harsan
    }
validation-correct = (Sax)
validation-incorrect = (Qalad)
validation-partially-correct = (Qayb ahaan sax)
answer-show-responses =
    { $count ->
        [one] Muuji { $count } jawaab oo { $answerId } ah
       *[other] Muuji { $count } jawaab oo { $answerId } ah
    }

## Disclosure panels

feedback-heading = Faallo
collapsible-click-to-open = (guji si aad u furto)
collapsible-click-to-close = (guji si aad u xirto)
collapsible-initializing = Waa la bilaabayaa...
footnote-show = Muuji faallada hoose
footnote-hide = Qari faallada hoose
description-more-information = macluumaad dheeraad ah

## Controls

slider-previous = Hore
slider-next = Xiga
keyboard-open = Fur kiiboodhka
keyboard-close = Xir kiiboodhka
choice-input-remove-choice = Ka saar { $choice }
matrix-remove-row = Ka saar saf
matrix-add-row = Ku dar saf
matrix-remove-column = Ka saar tiir
matrix-add-column = Ku dar tiir
subset-add-remove-points = Ku dar/ka saar dhibcaha
subset-toggle-points-intervals = Isku beddel dhibco iyo waqti-xilliyeed
subset-move-points = Dhaqaaji dhibcaha
subset-clear = Nadiifi
# A `box` here is one orbital, drawn as a square: `sanduuq`.
orbital-add-row = Ku dar saf
orbital-remove-row = Ka saar saf
orbital-add-box = Ku dar sanduuq
orbital-remove-box = Ka saar sanduuq
orbital-add-up-arrow = Ku dar fallaadh kor u socota
orbital-add-down-arrow = Ku dar fallaadh hoos u socota
orbital-remove-arrow = Ka saar fallaadh
orbital-row-label = Summad safka { $row }
pretzel-answer = Jawaab

## Math input

math-input-preview-region = horudhac tibaaxda xisaabta
math-input-preview = Horudhac
math-input-invalid-expression = Tibaax aan sax ahayn:

## Document status

viewer-initializing = Waa la bilaabayaa...

## Errors

error-heading = Qalad
error-found-at =
    { $span ->
        [line] Waxaa laga helay sadarka { $startLine }.
       *[lines] Waxaa laga helay sadarrada { $startLine }–{ $endLine }.
    }
document-contains-errors = Dukumentigan waxaa ku jira qaladaad!
diagnostic-heading-error = Qalad
diagnostic-heading-warning = Digniin
diagnostic-heading-information = Macluumaad
diagnostic-heading-hint = Tilmaan
accessibility-heading-level-1 = Xadgudub helitaanka WCAG AA
accessibility-heading-level-2 = Digniin ku saabsan helitaanka
something-went-wrong = Wax baa qaldamay.
renderer-load-failed = qayb muujineed lama soo rari karin. Fadlan bogga dib u cusboonaysii.
core-start-failed = Daawadaha dukumentiga lama bilaabi karin. Fadlan bogga dib u cusboonaysii.
