# Western Frisian viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Two plural categories, `one` and `other`, and `one` does not catch zero —
# which is why the wording for none is spelled out in `[0]`.


## Answer submission

answer-checking = Kontrolearje…
answer-submitting = Ynstjoere…
answer-checking-status = Antwurd wurdt kontrolearre
answer-submitting-status = Antwurd wurdt ynstjoerd
answer-correct = Goed
answer-incorrect = Ferkeard
answer-response-saved = Antwurd bewarre
answer-percent-credit = { $percent }% punten
answer-percent-correct = { $percent }% goed
answer-percent-short = { $percent } %
max-credit-available = Maksimaal helbere punten: { $percent }%
# Counted as "may still try N times" rather than "N attempts remain", so that
# the count sits beside «kear», which does not change after a numeral. That
# leaves `one` and `other` identical, so only the wording for none is branched.
attempts-remaining =
    { $count ->
        [0] gjin besykjen mear oer
       *[other] noch { $count } kear besykje
    }
validation-correct = (Goed)
validation-incorrect = (Ferkeard)
validation-partially-correct = (Foar in part goed)
answer-show-responses =
    { $count ->
        [one] { $count } antwurd op { $answerId } sjen litte
       *[other] { $count } antwurden op { $answerId } sjen litte
    }

## Disclosure panels

feedback-heading = Weromkeppeling
collapsible-click-to-open = (klik om iepen te dwaan)
collapsible-click-to-close = (klik om ticht te dwaan)
collapsible-initializing = Opstarte…
footnote-show = Fuotnoat sjen litte
footnote-hide = Fuotnoat ferstopje
description-more-information = mear ynformaasje

## Controls

slider-previous = Foarige
slider-next = Folgjende
keyboard-open = Toetseboerd iepenje
keyboard-close = Toetseboerd slute
choice-input-remove-choice = { $choice } fuortsmite
matrix-remove-row = Rige fuortsmite
matrix-add-row = Rige tafoegje
matrix-remove-column = Kolom fuortsmite
matrix-add-column = Kolom tafoegje
subset-add-remove-points = Punten tafoegje/fuortsmite
subset-toggle-points-intervals = Wikselje tusken punten en yntervallen
subset-move-points = Punten ferskowe
subset-clear = Leechmeitsje
orbital-add-row = Rige tafoegje
orbital-remove-row = Rige fuortsmite
orbital-add-box = Fakje tafoegje
orbital-remove-box = Fakje fuortsmite
orbital-add-up-arrow = Piel omheech tafoegje
orbital-add-down-arrow = Piel omleech tafoegje
orbital-remove-arrow = Piel fuortsmite
orbital-row-label = Namme foar rige { $row }
pretzel-answer = Antwurd

## Math input

math-input-preview-region = foarbyld fan 'e wiskundige útdrukking
math-input-preview = Foarbyld
math-input-invalid-expression = Unjildige útdrukking:

## Document status

viewer-initializing = Opstarte…

## Errors

error-heading = Flater
error-found-at =
    { $span ->
        [line] Fûn op rigel { $startLine }.
       *[lines] Fûn op rigels { $startLine }–{ $endLine }.
    }
document-contains-errors = Dit dokumint befettet flaters!
diagnostic-heading-error = Flater
diagnostic-heading-warning = Warskôging
diagnostic-heading-information = Ynfo
diagnostic-heading-hint = Oanwizing
accessibility-heading-level-1 = Skeining fan 'e tagonklikens neffens WCAG AA
accessibility-heading-level-2 = Warskôging oer tagonklikens
something-went-wrong = Der is wat misgien.
renderer-load-failed = in module foar it werjaan koe net laden wurde. Laad de side opnij.
core-start-failed = De dokumintwerjefte koe net start wurde. Laad de side opnij.
