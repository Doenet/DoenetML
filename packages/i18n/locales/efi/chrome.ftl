# Efik viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `efi` is Efik, a Cross River language (Niger-Congo, Delta-Cross) spoken
# around Calabar in Cross River State, Nigeria, and historically the trade and
# church language of the wider Cross River region — Efik is the language the
# earliest Bible translations in this area were made into, and much of its
# written convention still traces back to that corpus.
#
# See `content.ftl`'s header for the finding that decides `$gender` and
# `$role` in this catalog and for the chemistry-vocabulary decision; both
# apply here wherever the same style words recur.
#
# Written in the standard orthography, with the underdot consonant `n̄` (velar
# nasal) and the two underdotted vowels `ọ` and `ị`. A speaker reviewing this
# file should check the orthography first — it is the thing most likely to
# have been typed inconsistently by a machine that cannot feel the difference
# between `n̄` and a plain `n`.


## Answer submission

answer-checking = Ke ndise…
answer-submitting = Ke ndinọ…
answer-checking-status = Ke ndise ibọrọ
answer-submitting-status = Ke ndinọ ibọrọ
answer-correct = Nen
answer-incorrect = Inenke
answer-response-saved = Ẹkpọn̄ Ibọrọ
answer-percent-credit = { $percent }% Ntak
answer-percent-correct = { $percent }% Nen
answer-percent-short = { $percent } %
max-credit-available = Ata ntak oro ẹkemede ndinọ: { $percent }%
attempts-remaining =
    { $count ->
        [0] mîdụhe ndomo efen
        [one] ndomo { $count } efen odụhe
       *[other] ndomo { $count } efen ẹdụhe
    }
validation-correct = (Nen)
validation-incorrect = (Inenke)
validation-partially-correct = (Enen ke ubak ubak)
answer-show-responses =
    { $count ->
        [one] Wụt ibọrọ { $count } oro ẹnọde { $answerId }
       *[other] Wụt mme ibọrọ { $count } oro ẹnọde { $answerId }
    }

## Disclosure panels

feedback-heading = Ikọ Ntịn̄
collapsible-click-to-open = (mia man ọberede)
collapsible-click-to-close = (mia man ọfịk)
collapsible-initializing = Ke ntọn̄ọ…
footnote-show = Wụt n̄wed idak
footnote-hide = Dịbe n̄wed idak
description-more-information = adian ibat

# Placeholder inside a panel that has been opened before its contents have
# arrived from the core. Shared by `<solution>` and a collapsible `<section>`.


## Controls

slider-previous = Mbemiso
slider-next = N̄kaha
keyboard-open = Beere Keyboard
keyboard-close = Fịk Keyboard
choice-input-remove-choice = Sio { $choice }
matrix-remove-row = Sio ubọk
matrix-add-row = Dian ubọk
matrix-remove-column = Sio ọtọn̄ọ
matrix-add-column = Dian ọtọn̄ọ
subset-add-remove-points = Dian/Sio mme ntọt
subset-toggle-points-intervals = Kpụhọde mme ntọt ye mme ufan̄
subset-move-points = Domo Mme Ntọt
subset-clear = Nyat Kpụhọde
orbital-add-row = Dian Ubọk
orbital-remove-row = Sio Ubọk
orbital-add-box = Dian Ekpat
orbital-remove-box = Sio Ekpat
orbital-add-up-arrow = Dian Ọfịọn̄ Ke Enyọn̄
orbital-add-down-arrow = Dian Ọfịọn̄ Ke Idem
orbital-remove-arrow = Sio Ọfịọn̄
orbital-row-label = Enyịn̄ ubọk { $row }
pretzel-answer = Ibọrọ

## Math input

math-input-preview-region = ndise n̄kpọ ekikere mbemiso
math-input-preview = Ndise Mbemiso
math-input-invalid-expression = Ikọ ekikere emi enyeneke uduak:

## Document status

viewer-initializing = Ke ntọn̄ọ…

## Errors

error-heading = Ndudue
error-found-at =
    { $span ->
        [line] Ẹkụt ke lain { $startLine }.
       *[lines] Ẹkụt ke lain { $startLine }–{ $endLine }.
    }
document-contains-errors = N̄wed emi enyene ndudue!
diagnostic-heading-error = Ndudue
diagnostic-heading-warning = Utọt
diagnostic-heading-information = Ntọn̄ọ
diagnostic-heading-hint = Ibuot
accessibility-heading-level-1 = Ndudue WCAG AA Ntak Ekemede Ndinọ Kpukpru Owo
accessibility-heading-level-2 = Ntọt Ntak Ekemede Ndinọ Kpukpru Owo
something-went-wrong = N̄kpọ ẹkenam ke usụn̄ oro mîdotke.
renderer-load-failed = n̄kpọ oro ẹdide ẹwụt n̄wed ikọdọhọ ndụk. Buọlọ page emi.
core-start-failed = N̄wed emi mîkemeke ndịtọn̄ọ. Buọlọ page emi.
