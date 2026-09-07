# Latvian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Latvian has a CLDR `zero` category — `locales/ar` is the only other catalog
# here that does — and it does not mean "none": it covers every number ending
# in 0 and the whole of the teens, all of which take a bare noun
# («10 mēģinājumu», «11 mēģinājumu»). `one` is any number ending in 1 except
# 11, so 21 and 101 take the singular. Every `{ $count -> … }` below that
# prints its number therefore spells out all three.
#
# The explicit `[0]` branch is still needed, and this is the language that
# shows why most clearly: zero does select `zero`, but the English wording
# changes for zero as well as the noun, and a category cannot say that.
#
# Register: the second-person plural imperative — «Pārlādējiet lapu».


## Answer submission

answer-checking = Notiek pārbaude…
answer-submitting = Notiek iesniegšana…
answer-checking-status = Atbildes pārbaude
answer-submitting-status = Atbildes iesniegšana
answer-correct = Pareizi
answer-incorrect = Nepareizi
answer-response-saved = Atbilde saglabāta
answer-percent-credit = { $percent }% no punktiem
answer-percent-correct = { $percent }% pareizi
answer-percent-short = { $percent } %
max-credit-available = Lielākais iespējamais punktu skaits: { $percent }%
attempts-remaining =
    { $count ->
        [0] mēģinājumu vairs nav
        [zero] atlikuši { $count } mēģinājumu
        [one] atlicis { $count } mēģinājums
       *[other] atlikuši { $count } mēģinājumi
    }
validation-correct = (Pareizi)
validation-incorrect = (Nepareizi)
validation-partially-correct = (Daļēji pareizi)
answer-show-responses =
    { $count ->
        [zero] Rādīt { $count } atbilžu uz { $answerId }
        [one] Rādīt { $count } atbildi uz { $answerId }
       *[other] Rādīt { $count } atbildes uz { $answerId }
    }

## Disclosure panels

feedback-heading = Atgriezeniskā saite
collapsible-click-to-open = (noklikšķiniet, lai atvērtu)
collapsible-click-to-close = (noklikšķiniet, lai aizvērtu)
collapsible-initializing = Notiek sagatavošana…
footnote-show = Rādīt piezīmi
footnote-hide = Slēpt piezīmi
description-more-information = vairāk informācijas

## Controls

slider-previous = Atpakaļ
slider-next = Uz priekšu
keyboard-open = Atvērt tastatūru
keyboard-close = Aizvērt tastatūru
choice-input-remove-choice = Noņemt { $choice }
matrix-remove-row = Noņemt rindu
matrix-add-row = Pievienot rindu
matrix-remove-column = Noņemt kolonnu
matrix-add-column = Pievienot kolonnu
subset-add-remove-points = Pievienot/noņemt punktus
subset-toggle-points-intervals = Pārslēgt starp punktiem un intervāliem
subset-move-points = Pārvietot punktus
subset-clear = Notīrīt
orbital-add-row = Pievienot rindu
orbital-remove-row = Noņemt rindu
orbital-add-box = Pievienot lodziņu
orbital-remove-box = Noņemt lodziņu
orbital-add-up-arrow = Pievienot bultu uz augšu
orbital-add-down-arrow = Pievienot bultu uz leju
orbital-remove-arrow = Noņemt bultu
orbital-row-label = { $row }. rindas apzīmējums
pretzel-answer = Atbilde

## Math input

math-input-preview-region = matemātiskās izteiksmes priekšskatījums
math-input-preview = Priekšskatījums
math-input-invalid-expression = Nederīga izteiksme:

## Document status

viewer-initializing = Notiek sagatavošana…

## Errors

error-heading = Kļūda
error-found-at =
    { $span ->
        [line] Atrasta { $startLine }. rindā.
       *[lines] Atrasta { $startLine }.–{ $endLine }. rindā.
    }
document-contains-errors = Šajā dokumentā ir kļūdas!
diagnostic-heading-error = Kļūda
diagnostic-heading-warning = Brīdinājums
diagnostic-heading-information = Informācija
diagnostic-heading-hint = Padoms
accessibility-heading-level-1 = WCAG AA piekļūstamības pārkāpums
accessibility-heading-level-2 = Piekļūstamības paziņojums
something-went-wrong = Kaut kas nogāja greizi.
renderer-load-failed = neizdevās ielādēt attēlošanas moduli. Pārlādējiet lapu.
core-start-failed = Neizdevās palaist dokumenta skatītāju. Pārlādējiet lapu.
