# Rundi viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the noun-class table, for what separates this
# catalog from `locales/rw`, and for what a speaker should check first.


## Answer submission

answer-checking = Kuriko birasuzumwa…
answer-submitting = Kuriko birarungikwa…
answer-checking-status = Inyishu iriko irasuzumwa
answer-submitting-status = Inyishu iriko irarungikwa
answer-correct = Ni vyo
answer-incorrect = Si vyo
answer-response-saved = Inyishu Yabitswe
answer-percent-credit = { $percent }% vy'Amanota
answer-percent-correct = { $percent }% Ni vyo
answer-percent-short = { $percent } %
max-credit-available = Amanota menshi ashoboka: { $percent }%
attempts-remaining =
    { $count ->
        [0] nta kugerageza gusigaye
        [one] hasigaye ukugerageza { $count }
       *[other] hasigaye ukugerageza { $count }
    }
validation-correct = (Ni vyo)
validation-incorrect = (Si vyo)
validation-partially-correct = (Ni vyo ku ruhande)
answer-show-responses =
    { $count ->
        [one] Erekana inyishu { $count } kuri { $answerId }
       *[other] Erekana inyishu { $count } kuri { $answerId }
    }

## Disclosure panels

feedback-heading = Iciyumviro
collapsible-click-to-open = (kanda kugira wugurure)
collapsible-click-to-close = (kanda kugira wugare)
collapsible-initializing = Kuriko biratangura…
footnote-show = Erekana icitonderwa co hasi
footnote-hide = Nyegeza icitonderwa co hasi
description-more-information = amakuru menshi

## Controls

slider-previous = Iheruka
slider-next = Ikurikira
keyboard-open = Ugurura Klaviye
keyboard-close = Ugara Klaviye
choice-input-remove-choice = Kura { $choice }
matrix-remove-row = Kura umurongo
matrix-add-row = Ongerako umurongo
matrix-remove-column = Kura inkingi
matrix-add-column = Ongerako inkingi
subset-add-remove-points = Ongerako/Kura utudomo
subset-toggle-points-intervals = Hindura utudomo n'ibiringo
subset-move-points = Imura Utudomo
subset-clear = Kurayo
orbital-add-row = Ongerako Umurongo
orbital-remove-row = Kura Umurongo
orbital-add-box = Ongerako Agasandugu
orbital-remove-box = Kura Agasandugu
orbital-add-up-arrow = Ongerako Akambi Kaja Hejuru
orbital-add-down-arrow = Ongerako Akambi Kaja Hasi
orbital-remove-arrow = Kura Akambi
orbital-row-label = Izina ry'umurongo { $row }
pretzel-answer = Inyishu

## Math input

math-input-preview-region = ukurabira imbere kw'imvugo y'imibare
math-input-preview = Kurabira imbere
math-input-invalid-expression = Imvugo itari yo:

## Document status

viewer-initializing = Kuriko biratangura…

## Errors

error-heading = Ikosa
error-found-at =
    { $span ->
        [line] Ryabonetse ku murongo { $startLine }.
       *[lines] Ryabonetse ku mirongo { $startLine }–{ $endLine }.
    }
document-contains-errors = Iki gitabu kirimwo amakosa!
diagnostic-heading-error = Ikosa
diagnostic-heading-warning = Imburi
diagnostic-heading-information = Amakuru
diagnostic-heading-hint = Akaboko
accessibility-heading-level-1 = Ukurenga kwa WCAG AA kw'Ukugerwako
accessibility-heading-level-2 = Imburi y'ukugerwako
something-went-wrong = Hari ikitagenze neza.
renderer-load-failed = umwerekanyi ntiyashitse. Turagusavye subiramwo urupapuro.
core-start-failed = Umwerekanyi w'igitabu ntiyatanguye. Turagusavye subiramwo urupapuro.
