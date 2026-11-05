# Skolt Sami viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Skolt Sami — nuõrttsääʹmǩiõll — is written in Latin script with its own
# letters: `â`, `ä`, `õ`, `å`, `ǩ`, `ǧ`, `ǥ`, `ǯ`, `ǰ`, `š`, `ž`, and the
# palatalisation mark `ʹ` (U+02B9 MODIFIER LETTER PRIME, not an apostrophe and
# not U+2019). Anything that renders `ʹ` as `'` has damaged the word, and a
# review that normalises quotation marks across this repository must leave
# these alone.
#
# **HOW MUCH OF THIS LEXICON IS DERIVED RATHER THAN KNOWN.** Skolt Sami has
# some six hundred speakers and a small published corpus, and this seed had far
# less of it to draw on than it had for `locales/se`. Where a Skolt word was
# not available to it, the seed took the Northern Sami word from `locales/se`
# and applied the regular correspondences — `ie`→`iõ`, `uo`→`uõ`, `ea`→`eä`,
# a lost final vowel, the palatalisation mark where Skolt marks it — rather
# than leaving English in place. That produces a word-shaped thing that a
# speaker can correct quickly, but a good share of this vocabulary is
# reconstruction and not attestation, and it should be read as a draft of the
# whole rather than as a translation with a few doubtful spots. The nouns for
# score («poeʹnn») and for a table column («ceäkk») are the two the seed is
# least sure of.
#
# Skolt Sami counts in a **dual**, as Northern Sami does. CLDR gives it `one`,
# `two` and `other`, so a `{ $count -> … }` below that prints its number writes
# three branches, and the middle one is not a rounding of the plural: two of a
# thing is its own number in Sami, as it is in the pronouns and in the verb.
#
# What the noun does across the three is not what English does either. It is in
# the nominative singular after «õhtt», in the genitive singular after «kueʹhtt»
# and every higher numeral — so `two` and `other` share a form that neither
# shares with `one`. The two are written out anyway rather than collapsed,
# because they are two categories and a later correction to one of them is
# unlikely to be a correction to both. Where nothing at all differs —
# `answer-show-responses`, whose whole branch would be one string three times —
# the select is dropped and a comment there says so, which is the shape
# `locales/se` already uses.
#
# `one` does not catch zero, so the wording for none is spelled out in `[0]`.


## Answer submission

answer-checking = Taʹrǩsteeʹmen…
answer-submitting = Vuõltteeʹmen…
answer-checking-status = Taʹrǩast vaʹsttõõzz
answer-submitting-status = Vuõlttad vaʹsttõõzz
answer-correct = Riõktta
answer-incorrect = Puästtai
answer-response-saved = Vaʹsttõs lij seeiljum
answer-percent-credit = { $percent }% poeeʹnnin
answer-percent-correct = { $percent }% riõktta
answer-percent-short = { $percent } %
max-credit-available = Jäänmõsân poeeʹn: { $percent }%
attempts-remaining =
    { $count ->
        [0] ǩiõččlõddmõõžž jiâ leäkku šõddâm
        [one] { $count } ǩiõččlõddmõš pååcc
        [two] { $count } ǩiõččlõddmõõžž pååcc
       *[other] { $count } ǩiõččlõddmõõžž pååcc
    }
validation-correct = (Riõktta)
validation-incorrect = (Puästtai)
validation-partially-correct = (Peäʹlnn riõktta)
# No select: the noun is the object of «čuäʹjet» and takes the same form after
# every numeral, so all three categories would render one string. The count
# still arrives and is still formatted; only the branching is gone. This is the
# shape `locales/se` uses for the same message and for the same reason.
answer-show-responses = Čuäʹjet { $count } vaʹsttõõzz tän: { $answerId }

## Disclosure panels

feedback-heading = Maacctõs
collapsible-click-to-open = (koʹčǩǩ ääʹveed)
collapsible-click-to-close = (koʹčǩǩ ǩiddeed)
collapsible-initializing = Aalǥteeʹmen…
footnote-show = Čuäʹjet vuâlaʹmerkkjõõzz
footnote-hide = Peiʹtted vuâlaʹmerkkjõõzz
description-more-information = jäänab teâđ

## Controls

slider-previous = Ouddel
slider-next = Pueʹtti
keyboard-open = Ääʹved båʹllǩeʹvv
keyboard-close = Ǩidd båʹllǩeʹvv
choice-input-remove-choice = Vääʹldd meädda { $choice }
matrix-remove-row = Vääʹldd meädda linjj
matrix-add-row = Lââʹzzet linjj
matrix-remove-column = Vääʹldd meädda ceäkk
matrix-add-column = Lââʹzzet ceäkk
subset-add-remove-points = Lââʹzzet/vääʹldd meädda čuõkkâzid
subset-toggle-points-intervals = Mõlss čuõkkâzi da kõskki kõskkâst
subset-move-points = Serdd čuõkkâzid
subset-clear = Nuõrt
orbital-add-row = Lââʹzzet linjj
orbital-remove-row = Vääʹldd meädda linjj
orbital-add-box = Lââʹzzet bokks
orbital-remove-box = Vääʹldd meädda bokks
orbital-add-up-arrow = Lââʹzzet njuõll pâjjas
orbital-add-down-arrow = Lââʹzzet njuõll vueʹlnn
orbital-remove-arrow = Vääʹldd meädda njuõll
orbital-row-label = Linjj { $row } nõmmtõs
pretzel-answer = Vaʹsttõs

## Math input

math-input-preview-region = matemaattlaž ceälkkâz ouddčuäʹjtõs
math-input-preview = Ouddčuäʹjtõs
math-input-invalid-expression = Kuõskteʹmes ceälkkâz:

## Document status

viewer-initializing = Aalǥteeʹmen…

## Errors

error-heading = Puästtõs
error-found-at =
    { $span ->
        [line] Kaunnâm linjjest { $startLine }.
       *[lines] Kaunnâm linjjin { $startLine }–{ $endLine }.
    }
document-contains-errors = Tän teâttǩeʹrjjest lie puästtõõzz!
diagnostic-heading-error = Puästtõs
diagnostic-heading-warning = Vaʹrrjõs
diagnostic-heading-information = Teâtt
diagnostic-heading-hint = Rääʹvv
accessibility-heading-level-1 = WCAG AA vuäǯǯamvuõđ rikkmõš
accessibility-heading-level-2 = Vuäǯǯamvuõđ vaʹrrjõs
something-went-wrong = Mâʹtt-a mõõni puästtai.
renderer-load-failed = čuäʹjtemmoodul ij vuäǯǯum. Vieʹǩǩed seeidad ođđsest.
core-start-failed = Teâttǩeʹrjj-čuäʹjteei ij vuäittam aalǥted. Vieʹǩǩed seeidad ođđsest.
core-start-failed-busy = Teâttǩeʹrjj-čuäʹjteei ij vuäittam aalǥted. Määŋg teâttǩeʹrjj aalǥteʹvve seämma ääiʹj, mii vuäitt kâʹll ǩeeʹjjed hiâlbben mašinast. Seeid ođđsest vieʹǩǩummuš vuäitt vieʹǩǩed, ko jeeʹres teâttǩeeʹrj lie valmmâš.
core-start-failed-retry = Teâttǩeʹrjj-čuäʹjteei ij vuäittam aalǥted.
core-start-failed-busy-retry = Teâttǩeʹrjj-čuäʹjteei ij vuäittam aalǥted. Määŋg teâttǩeʹrjj aalǥteʹvve seämma ääiʹj, mii vuäitt kâʹll ǩeeʹjjed hiâlbben mašinast.
core-start-retry = Ǩiõččlõõđ ođđsest
saved-state-unavailable = Tuu seeiljum tuâj ij vuäǯǯum.
