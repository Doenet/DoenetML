# Quechua viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Southern Quechua (Cusco–Collao) in the trivocalic orthography the
# Peruvian and Bolivian ministries use for intercultural bilingual education.
# That is a written standard over a spread of varieties, the way `locales/sc` is
# for Sardinian: a deployment wanting Ancashino or Kichwa supplies its own
# catalog as `localeResources` rather than correcting this one toward it
# sentence by sentence.
#
# Quechua marks number with the optional suffix «-kuna», and drops it after a
# numeral — a count in front of the noun already says how many. So a counted
# message has one form and its select is dropped, keeping the `[0]` wording that
# names none, which is a different sentence rather than a different form.
#
# Every case relation Quechua needs is a **suffix**, which is the constraint the
# README calls "an affix cannot be welded to a placeable". It turns out not to
# bite here, and for a reason worth recording: at each site where a suffix is
# wanted, the word it lands on is one this catalog writes — «p'anqamanta» for
# "of N pages", «manyayuq» for "with a border" — never the value. Where that was
# not true, `content.ftl` names the value instead; its header says where.


## Answer submission

answer-checking = Qhawachkan…
answer-submitting = Apachichkan…
answer-checking-status = Kutichiyta qhawachkan
answer-submitting-status = Kutichiyta apachichkan
answer-correct = Allin
answer-incorrect = Mana allinchu
answer-response-saved = Kutichiy waqaychasqa
answer-percent-credit = { $percent }% chanin
answer-percent-correct = { $percent }% allin
answer-percent-short = { $percent } %
max-credit-available = Aswan hatun chanin: { $percent }%
# No select: «ruray» does not take «-kuna» after a numeral, so both English
# categories render the same words. The count still arrives and is still
# formatted. `[0]` stays, because "none left" is its own sentence.
attempts-remaining =
    { $count ->
        [0] manaña ima ruraypas puchunchu
       *[other] { $count } ruray puchun
    }
validation-correct = (Allin)
validation-incorrect = (Mana allinchu)
validation-partially-correct = (Wakinlla allin)
# No select, for the reason given above. The answer is reached by naming it —
# «{ $answerId } sutiyuq tapuypaq», "for the question named X" — rather than by
# putting the dative «-man» on `$answerId`, which would weld a suffix to a value
# this catalog never sees.
answer-show-responses = { $answerId } sutiyuq tapuypaq { $count } kutichiy rikuchiy

## Disclosure panels

feedback-heading = Kutichiy rimay
collapsible-click-to-open = (kichanapaq ñit'iy)
collapsible-click-to-close = (wichq'anapaq ñit'iy)
collapsible-initializing = Qallarichkan…
footnote-show = Uraypi qillqata rikuchiy
footnote-hide = Uraypi qillqata pakay
description-more-information = aswan willay

## Controls

slider-previous = Ñawpaq
slider-next = Qhipa
keyboard-open = Ñit'ipanata kichay
keyboard-close = Ñit'ipanata wichq'ay
choice-input-remove-choice = { $choice } qichuy
matrix-remove-row = Siqita qichuy
matrix-add-row = Siqita yapay
matrix-remove-column = Sayaqta qichuy
matrix-add-column = Sayaqta yapay
subset-add-remove-points = Chimpukunata yapay/qichuy
subset-toggle-points-intervals = Chimpumanta chawpimanpas tikray
subset-move-points = Chimpukunata astay
subset-clear = Pichay
orbital-add-row = Siqita yapay
orbital-remove-row = Siqita qichuy
orbital-add-box = Q'ipita yapay
orbital-remove-box = Q'ipita qichuy
orbital-add-up-arrow = Wichay wach'ita yapay
orbital-add-down-arrow = Uray wach'ita yapay
orbital-remove-arrow = Wach'ita qichuy
orbital-row-label = { $row } siqipaq suti
pretzel-answer = Kutichiy

## Math input

math-input-preview-region = yupay rimay ñawpaq rikuchiy
math-input-preview = Ñawpaq rikuchiy
math-input-invalid-expression = Mana allin rimay:

## Document status

viewer-initializing = Qallarichkan…

## Errors

error-heading = Pantay
error-found-at =
    { $span ->
        [line] { $startLine } siqipi tarisqa.
       *[lines] { $startLine }–{ $endLine } siqikunapi tarisqa.
    }
document-contains-errors = Kay qillqapi pantaykuna kachkan!
diagnostic-heading-error = Pantay
diagnostic-heading-warning = Yuyaychay
diagnostic-heading-information = Willay
diagnostic-heading-hint = Yanapay
accessibility-heading-level-1 = WCAG AA chayanapaq p'akiy
accessibility-heading-level-2 = Chayanapaq yuyaychay
something-went-wrong = Imapas mana allinchu karqan.
renderer-load-failed = huk rikuchiq mana chayamurqanchu. Ama hina kaspa, p'anqata musuqmanta chaqnay.
core-start-failed = Qillqa rikuchiq mana qallarikuyta atirqanchu. Ama hina kaspa, p'anqata musuqmanta chaqnay.
