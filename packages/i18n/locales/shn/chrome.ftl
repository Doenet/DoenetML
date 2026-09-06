# Shan (လိၵ်ႈတႆး) viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety and script.** Shan (Tai Long, ၵႂၢမ်းတႆး) of Shan State, written in
# the modern reformed Shan orthography — the one used in Shan-language
# schooling, newspapers and Unicode publishing today, not the older
# pre-reform spelling that leaves the tones unmarked. The consonants are the
# **Shan letters**, not their Burmese look-alikes: ၵ ၶ ၸ ၺ ၼ ပ ၽ ၾ မ ယ ရ လ ဝ
# **ႁ** ဢ, with the Shan vowels **ႃ ႄ ႅ ႆ ွ ႂ** and the Shan tone marks
# **ႇ ႈ း ႉ ႊ**. A corrector must not fold ႁ into Burmese ဟ, ၵ into က, ၶ into
# ခ, ၸ into စ, ၼ into န, ၽ into ဖ, ၾ into ဖ or ဢ into အ: they are different
# characters, they look nearly alike at small sizes, and a substitution is
# invisible on screen and fatal to a search.
#
# **One more letter is in these files and is easy to mistake for a Karen
# one.** /aa/ is written **ႃ** (U+1083) in an open syllable — မႃး — and **ၢ**
# (U+1062) before a final consonant — ၵၢၼ်, တၢင်း, ၶၢဝ်း. U+1062 is named
# MYANMAR VOWEL SIGN SGAW KAREN EU in Unicode and is shared between Shan and
# S'gaw Karen; it appears here because Shan spelling wants it, not because a
# Karen letter leaked in. Do not "correct" it to ႃ, and do not write ႃ where
# a final consonant follows.
#
# **Tone.** Shan writes five tones with ႇ ႈ း ႉ ႊ and leaves one unmarked.
# Where the seed could not place a tone mark with confidence it chose a word
# it could rather than guessing at a diacritic, which is why some sentences
# below are blunter than a speaker would write them.
#
# **Spacing.** Shan publishing separates words with spaces, unlike the Burmese
# convention of running a clause together, and this catalog follows the Shan
# practice throughout. That matters for how these messages wrap in a narrow
# panel, so it is stated rather than left to be inferred.
#
# **Register, and what is a loan.** Shan speakers are schooled in Burmese, and
# meet computing and higher mathematics in English. This catalog is a **Shan
# frame around two declared loan vocabularies**, and neither is respelled into
# an invented Shan phonology:
#
#   * **Burmese**, in its own Burmese spelling, for the school register Shan
#     genuinely borrows: သတိပေးချက် (warning), အချက်အလက် (information),
#     တုံ့ပြန်ချက် (feedback), အောက်ခြေမှတ်စု (footnote), အမှတ် (point) and
#     မြား (arrow). These six are the only Burmese-spelled words in this file
#     — the other three files declare their own, `content.ftl`'s geometry and
#     colour terms among them — and they are recognizable as loans because they keep
#     Burmese letters (က ခ စ ဖ ဟ အ) that no Shan word below is written with.
#     `န` is the one letter both registers use — the Shan «နဵၵ်း» (press)
#     carries it — so it is not a marker of a loan on its own.
#   * **English, in the Latin alphabet**, for computing and for the DoenetML
#     vocabulary: `keyboard`, `row`, `column`, `box`, `credit`, `preview`,
#     `math expression`, `interval`, `document`, `page`, `renderer`, `load`,
#     `summary statistics`, `WCAG AA`, `accessibility`. Myanmar-script
#     technical writing routinely leaves such terms in Latin letters, and
#     writing them out in Shan syllables would invent a spelling no reader has
#     seen.
#
# The Shan is the frame: ဢၼ် (relative), တီႈ (at), ၼႂ်း (in), လူၺ်ႈ (with),
# လႄႈ (and), ဢမ်ႇၼၼ် (or), ဢမ်ႇ (not), မီး (have), ပဵၼ် (be), လႆႈ (get, can),
# ႁဵတ်း (do), ပၼ် (give), ၼႄ (show), ၶိုၼ်း (again), တႃႇ (for), ၶွင် (of),
# ၶႅၼ်းတေႃႈ (please), and the verbs ၸႅတ်ႈတူၺ်း (check), သူင်ႇ (send),
# သိမ်း (save), ပိုတ်ႇ (open), ပိၵ်ႉ (close), ထႅမ် (add), ဢဝ်ဢွၵ်ႇ (remove),
# ၶၢႆႉ (move), မွတ်ႇ (erase), နဵၵ်း (press).
#
# **Counting.** CLDR has no plural data for `shn`, so `Intl.PluralRules`
# resolves it against the runtime's default locale and a category branch here
# would be text chosen by English's rules. Shan leaves a noun unmarked after a
# numeral and counts with a classifier instead, so one form is correct anyway:
# every count select below collapses to a single `*[other]`. English's
# explicit `[0]` is kept, because Fluent matches it against the number itself
# before it consults any plural rule. No `[zero]`, `[one]`, `[two]`, `[few]`
# or `[many]` branch appears in any of these four files.


## Answer submission

answer-checking = ၸႅတ်ႈတူၺ်းယူႇ…
answer-submitting = သူင်ႇယူႇ…

answer-checking-status = ၸႅတ်ႈတူၺ်း ၶေႃႈတွပ်ႇ
answer-submitting-status = သူင်ႇ ၶေႃႈတွပ်ႇ

answer-correct = ထုၵ်ႇမႅၼ်ႈ
answer-incorrect = ဢမ်ႇထုၵ်ႇမႅၼ်ႈ

answer-response-saved = ၶေႃႈတွပ်ႇ သိမ်းဝႆႉယဝ်ႉ

answer-percent-credit = { $percent }% credit
answer-percent-correct = { $percent }% ထုၵ်ႇမႅၼ်ႈ
answer-percent-short = { $percent } %

max-credit-available = credit ၼမ်သုတ်း: { $percent }%

# Single `*[other]`: Shan does not mark a noun for number after a numeral, and
# `shn` has no CLDR plural data. `[0]` is matched against the number and fires.
attempts-remaining =
    { $count ->
        [0] ဢမ်ႇမီး ပွၵ်ႈ လိူဝ်ယဝ်ႉ
       *[other] လိူဝ်ဝႆႉ { $count } ပွၵ်ႈ
    }

validation-correct = (ထုၵ်ႇမႅၼ်ႈ)
validation-incorrect = (ဢမ်ႇထုၵ်ႇမႅၼ်ႈ)
validation-partially-correct = (ထုၵ်ႇမႅၼ်ႈ ၸိုင်ႈပွတ်း)

answer-show-responses = ၼႄ ၶေႃႈတွပ်ႇ { $count } ၶေႃႈ ၶွင် { $answerId }


## Disclosure panels

feedback-heading = တုံ့ပြန်ချက်

collapsible-click-to-open = (နဵၵ်း တႃႇ ပိုတ်ႇ)
collapsible-click-to-close = (နဵၵ်း တႃႇ ပိၵ်ႉ)

collapsible-initializing = တႄႇယူႇ…

footnote-show = ၼႄ အောက်ခြေမှတ်စု
footnote-hide = ႁၢမ်ႈ အောက်ခြေမှတ်စု

description-more-information = အချက်အလက် ထႅင်ႈ


## Controls

slider-previous = ဢွၼ်တၢင်း
slider-next = တေႃႇၼႃႈ

keyboard-open = ပိုတ်ႇ keyboard
keyboard-close = ပိၵ်ႉ keyboard

choice-input-remove-choice = ဢဝ်ဢွၵ်ႇ { $choice }

matrix-remove-row = ဢဝ်ဢွၵ်ႇ row
matrix-add-row = ထႅမ် row
matrix-remove-column = ဢဝ်ဢွၵ်ႇ column
matrix-add-column = ထႅမ် column

subset-add-remove-points = ထႅမ်/ဢဝ်ဢွၵ်ႇ အမှတ်
subset-toggle-points-intervals = လႅၵ်ႈ အမှတ် လႄႈ interval
subset-move-points = ၶၢႆႉ အမှတ်
subset-clear = မွတ်ႇပႅတ်ႈ

orbital-add-row = ထႅမ် row
orbital-remove-row = ဢဝ်ဢွၵ်ႇ row
orbital-add-box = ထႅမ် box
orbital-remove-box = ဢဝ်ဢွၵ်ႇ box
orbital-add-up-arrow = ထႅမ် မြား ၶိုၼ်ႈ
orbital-add-down-arrow = ထႅမ် မြား လူင်း
orbital-remove-arrow = ဢဝ်ဢွၵ်ႇ မြား

orbital-row-label = ၸိုဝ်ႈ တႃႇ row { $row }

pretzel-answer = ၶေႃႈတွပ်ႇ



## Math input

math-input-preview-region = preview ၶွင် math expression
math-input-preview = preview
math-input-invalid-expression = expression ဢမ်ႇထုၵ်ႇမႅၼ်ႈ:


## Document status

viewer-initializing = တႄႇယူႇ…


## Errors

error-heading = ၽိတ်းပိူင်ႈ

error-found-at =
    { $span ->
        [line] ႁၼ်တီႈ line { $startLine }။
       *[lines] ႁၼ်တီႈ line { $startLine }–{ $endLine }။
    }

document-contains-errors = document ဢၼ်ၼႆႉ မီးလွင်ႈၽိတ်းပိူင်ႈယူႇ!

diagnostic-heading-error = ၽိတ်းပိူင်ႈ
diagnostic-heading-warning = သတိပေးချက်
diagnostic-heading-information = အချက်အလက်
diagnostic-heading-hint = ၶေႃႈၸီႉၼႄ

accessibility-heading-level-1 = WCAG AA accessibility ၽိတ်းပိူင်ႈ
accessibility-heading-level-2 = accessibility သတိပေးချက်

something-went-wrong = ပဵၼ်လွင်ႈၽိတ်းပိူင်ႈဝႆႉ။

renderer-load-failed = renderer ဢၼ်ၼိုင်ႈ load ဢမ်ႇလႆႈ။ ၶႅၼ်းတေႃႈ ၶိုၼ်း load ၼႃႈလိၵ်ႈ။

core-start-failed = document ဢၼ်ၼႆႉ တႄႇဢမ်ႇလႆႈ။ ၶႅၼ်းတေႃႈ ၶိုၼ်း load ၼႃႈလိၵ်ႈ။

core-start-failed-busy = document ဢၼ်ၼႆႉ တႄႇဢမ်ႇလႆႈ။ document လၢႆလၢႆဢၼ် တႄႇမႃးၸွမ်းၵၼ်လႄႈ ၶိူင်ႈဢၼ်ဢွၼ်ႈ တေၸႂ်ႉၶၢဝ်းယၢမ်းႁိုင်။ document တၢင်ႇဢၼ် ယဝ်ႉတူဝ်ႈယဝ်ႉ ၶိုၼ်း load ၼႃႈလိၵ်ႈ တေၸွႆႈလႆႈ။

core-start-failed-retry = document ဢၼ်ၼႆႉ တႄႇဢမ်ႇလႆႈ။

core-start-failed-busy-retry = document ဢၼ်ၼႆႉ တႄႇဢမ်ႇလႆႈ။ document လၢႆလၢႆဢၼ် တႄႇမႃးၸွမ်းၵၼ်လႄႈ ၶိူင်ႈဢၼ်ဢွၼ်ႈ တေၸႂ်ႉၶၢဝ်းယၢမ်းႁိုင်။

core-start-retry = ၶိုၼ်းႁဵတ်းထႅင်ႈ

saved-state-unavailable = ၵၢၼ် ဢၼ်သိမ်းဝႆႉ load ဢမ်ႇလႆႈ။
