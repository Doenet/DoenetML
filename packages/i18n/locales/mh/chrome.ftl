# Marshallese (Kajin M̧ajeļ) viewer chrome, Latin script. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# ## Orthography
#
# This file is written in the standard "new" orthography — the one of the
# Marshallese-English Dictionary and of the Ministry of Education's own
# materials — and the cedilla and macron letters are part of the spelling
# rather than decoration: `m̧`, `ņ`, `ļ`, `n̄`, and `o̧` where it occurs. The
# old mission orthography writes those as plain `m`, `n`, `l` and `ng`, so a
# bare `m` where this file has `m̧` is an error to fix and not a variant. Two
# of them are encoded as a base letter plus U+0327 COMBINING CEDILLA (`m̧`,
# `n̄` uses U+0304 COMBINING MACRON): a reviewer normalizing this file should
# keep the decomposed form, since the precomposed characters do not exist in
# Unicode for `m̧` and `n̄`.
#
# ## Number
#
# **A Marshallese noun is not inflected for number after a numeral**, and
# there is no obligatory plural on the noun at all — number is carried, when
# it matters, by a determiner (`ko`, `kaņ`) or by a numeral in front of the
# phrase. So a count in front of a noun changes nothing about the noun, and
# `Intl.PluralRules("mh")` has no CLDR data to resolve against in any case: it
# falls back to the runtime's default locale. Both facts point the same way,
# so the counted messages below are written as **one unselected form**, with
# an explicit `[0]` literal where the wording for none is genuinely different.
# `[0]` is matched numerically and is always safe. Never add a `[two]`,
# `[few]` or `[many]` branch here: nothing could select it.
#
# ## Gender and person
#
# Marshallese has **no grammatical gender**, so no adjective in this catalog
# forks on `$gender` (see `content.ftl`, which is where that argument is
# actually passed).
#
# Marshallese *does* distinguish inclusive from exclusive first person —
# «kōj»/«jej» against «kōm»/«kōmij». **No message in this catalog, or in any
# of the four, addresses the reader as "we"**: the English speaks either
# impersonally ("This document could not be started") or to the reader as
# «you». So the distinction never has to be made here. If a future message
# does say "we", the inclusive form is the one that means "you and I" and is
# almost certainly the one wanted.
#
# ## Word order
#
# A describing word **follows** the noun in Marshallese — «laain m̧ijel» is a
# thick line, not «m̧ijel laain» — so the composition messages in
# `content.ftl` reorder the English rather than copying its order. That is a
# whole-catalog decision and is argued there; it shows up in this file only in
# phrases like «uwaak eo» and «peba in».
#
# ## Vocabulary this seed had to build, and the sibling catalogs
#
# Marshallese schooling above the elementary grades is largely in English, so
# a good deal of the interface vocabulary below is **coined rather than
# attested**, and those are the first words for a reviewer to check:
# «ri-kwaļo̧k» for a renderer (the one who shows), «maro̧n̄ in tōpar» for
# accessibility (the ability to reach), «naan ium̧win» for a footnote (the
# word beneath), «alwōj m̧okta» for a preview, and «kiipoot» for a keyboard.
# «meļeļe» is doing three jobs across these four files — information,
# meaning, and the root of the word for a description — and a speaker may
# well want three different words; that is disclosed in `content.ftl` rather
# than repeated here.
#
# This is one of five Micronesian catalogs seeded together — Chuukese
# (`chk`), Pohnpeian (`pon`), Kosraean (`kos`), Gilbertese (`gil`) and this
# one. All five are expected to be postnominal and genderless, and none of
# the five has CLDR plural data, so a reviewer comparing them should expect
# the same one-form counting shape and should treat a divergence as something
# to explain rather than as a mistake in one of them.


## Answer submission

answer-checking = Ej lale...
answer-submitting = Ej jilkinļo̧k...
answer-checking-status = Ej lale uwaak eo
answer-submitting-status = Ej jilkinļo̧k uwaak eo
answer-correct = Ejim̧we
answer-incorrect = Ebōd
answer-response-saved = Em̧ōj ko̧jparok uwaak eo
answer-percent-credit = { $percent }% in tōprak
answer-percent-correct = { $percent }% ejim̧we
answer-percent-short = { $percent } %
max-credit-available = Tōprak eļaptata emaro̧n̄ bōk: { $percent }%
# One form for any count above none: «kajjio̧n̄» is the same word after
# «juon» as after «jiljinon̄oul», so a `one` branch would render the string
# the default already renders. The count itself is still printed and still
# formatted.
attempts-remaining =
    { $count ->
        [0] ejjeļo̧k bar kajjio̧n̄ ej pād
       *[other] { $count } kajjio̧n̄ ej pād wōt
    }
validation-correct = (Ejim̧we)
validation-incorrect = (Ebōd)
validation-partially-correct = (Ejim̧we jimattan)
# No select, for the reason given above: «uwaak» does not change after a
# numeral.
answer-show-responses = Kwaļo̧k { $count } uwaak n̄an { $answerId }

## Disclosure panels

feedback-heading = Naan in Uwaak
collapsible-click-to-open = (kilik n̄an kapeļļo̧k)
collapsible-click-to-close = (kilik n̄an kiil)
collapsible-initializing = Ej jino...
footnote-show = Kwaļo̧k naan ium̧win
footnote-hide = N̄ooj naan ium̧win
description-more-information = meļeļe ko jet

## Controls

slider-previous = M̧okta
slider-next = Ālik
keyboard-open = Kapeļļo̧k Kiipoot
keyboard-close = Kiil Kiipoot
choice-input-remove-choice = Joļo̧k { $choice }
matrix-remove-row = Joļo̧k laajrak
matrix-add-row = Kobaik juon laajrak
matrix-remove-column = Joļo̧k kōlōm
matrix-add-column = Kobaik juon kōlōm
subset-add-remove-points = Kobaik/Joļo̧k poin̄
subset-toggle-points-intervals = Ukōt ikōtaan poin̄ im intervōl
subset-move-points = Kam̧akūt Poin̄
subset-clear = Karreoik
orbital-add-row = Kobaik Laajrak
orbital-remove-row = Joļo̧k Laajrak
orbital-add-box = Kobaik Bo̧o̧k
orbital-remove-box = Joļo̧k Bo̧o̧k
orbital-add-up-arrow = Kobaik M̧ade Lōn̄ļo̧k
orbital-add-down-arrow = Kobaik M̧ade Laļļo̧k
orbital-remove-arrow = Joļo̧k M̧ade
orbital-row-label = Etan laajrak { $row }
pretzel-answer = Uwaak

## Math input

math-input-preview-region = alwōj m̧okta an jeje in bōnbōn
math-input-preview = Alwōj M̧okta
math-input-invalid-expression = Jeje in bōnbōn ejjab jim̧we:

## Document status

viewer-initializing = Ej jino...

## Errors

error-heading = Bōd
error-found-at =
    { $span ->
        [line] Ear waļo̧k ilo laajrak { $startLine }.
       *[lines] Ear waļo̧k ilo laajrak { $startLine }–{ $endLine }.
    }
document-contains-errors = Ewōr bōd ilo peba in!
diagnostic-heading-error = Bōd
diagnostic-heading-warning = Kakkōl
diagnostic-heading-information = Meļeļe
diagnostic-heading-hint = Naan in Jipan̄
accessibility-heading-level-1 = Bōd n̄ae WCAG AA kōn maro̧n̄ in tōpar
accessibility-heading-level-2 = Kakkōl kōn maro̧n̄ in tōpar
something-went-wrong = Ewōr men eo ear bōd.
renderer-load-failed = juon ri-kwaļo̧k ear jab ektak. Jouj im bar ektake peij in.
core-start-failed = Peba in ear jab maro̧n̄ jino. Jouj im bar ektake peij in.
core-start-failed-busy = Peba in ear jab maro̧n̄ jino. Elōn̄ peba raar jino ilo juon wōt iien, im men in emaro̧n̄ rum̧wij ļo̧k ilo juon kein jerbal em̧ōjņo. Bar ektake peij in emaro̧n̄ jipan̄ n̄e em̧ōj an peba ko jet tōprak.
core-start-failed-retry = Peba in ear jab maro̧n̄ jino.
core-start-failed-busy-retry = Peba in ear jab maro̧n̄ jino. Elōn̄ peba raar jino ilo juon wōt iien, im men in emaro̧n̄ rum̧wij ļo̧k ilo juon kein jerbal em̧ōjņo.
core-start-retry = Bar kajjio̧n̄
saved-state-unavailable = Jerbal eo am̧ em̧ōj ko̧jparoke ear jab maro̧n̄ ektak.
