# S'gaw Karen (ကညီကျိာ်) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety and script.** S'gaw Karen (ကညီကျိာ်) of Kayin State and of the
# Karen diaspora in Thailand, the United States, Australia and elsewhere,
# written in the Burmese-derived S'gaw Karen script — the orthography of the
# Karen Baptist mission tradition, which is what Karen literacy, hymnals,
# newspapers and Unicode publishing all use. The letters this catalog uses
# that Burmese does not are the S'gaw vowel and tone signs **ၢ** (U+1062),
# **ၣ** (U+1063) and **ၤ** (U+1064), which carry most of what makes a Karen
# word look like one. A corrector must not fold ၢ into Burmese ာ or ၣ into န:
# they look nearly alike at small sizes, the substitution is invisible on
# screen, and it breaks every search for a Karen word. **ၢ is shared with
# Shan**, which writes it for /aa/ before a final consonant, so its presence
# in `locales/shn` is not a Karen letter leaking in.
#
# Two further S'gaw letters — **ဢ** (U+1022) and **ၡ** (U+1061) — are part of
# the orthography and appear nowhere in this catalog, because no word it
# happens to use needs them. That is a fact about this vocabulary, not about
# the alphabet, and a corrector who needs either should write it.
#
# **ၦ and ၯ are not used here, and that is deliberate.** They are Pwo Karen
# letters. Pwo is a different language written in a related orthography, and a
# Pwo letter inside an S'gaw file is a mistake rather than a variant. If Pwo
# is ever seeded it is a catalog of its own beside this one.
#
# **Tone.** S'gaw writes its tones with the syllable-final signs ်, ၢ်, ၣ်,
# ံ, ဲ and ့, so a tone is part of the spelling of a word rather than an
# optional diacritic — a wrong tone sign is a different word. Where the seed
# could not place one with confidence it chose a word it could rather than
# guessing, which is why some sentences below are blunter than a speaker would
# write them. **This is the likeliest place for an error in this catalog to
# be**, and it is the first thing a reviewer should check.
#
# **Spacing.** S'gaw Karen publishing separates phrases with spaces rather
# than running a whole clause together as Burmese does, and this catalog
# follows that practice: a space between the parts of a phrase, none inside a
# word. That decides where these messages may wrap in a narrow panel.
#
# **Register, and what is a loan.** Karen speakers in Myanmar are schooled in
# Burmese; in the diaspora they are schooled in English or Thai. This catalog
# is an **S'gaw Karen frame around two declared loan vocabularies**, and
# neither is respelled into invented Karen syllables:
#
#   * **Burmese, in its own Burmese spelling**, for the school register:
#     အမှတ် (point), မြား (arrow), ဇယား (table), အောက်ခြေမှတ်စု (footnote),
#     စက်ဝိုင်း (circle), တြိဂံ (triangle), သက်သေပြချက် (proof), and — see
#     `content.ftl` — seven of the twelve colours.
#   * **English, in the Latin alphabet**, for computing and the DoenetML
#     vocabulary: `keyboard`, `row`, `column`, `box`, `credit`, `preview`,
#     `math expression`, `interval`, `document`, `renderer`, `load`,
#     `summary statistics`, `WCAG AA`, `accessibility`. Karen technical
#     writing leaves such terms in Latin letters, and writing them out in
#     Karen syllables would invent a spelling no reader has seen.
#
# The Karen is the frame, and it is a real one: the **negative circumfix
# တ…ဘၣ်** (တသ့ဘၣ် 'cannot', တအိၣ်ဘၣ် 'there is none', တထံၣ်ဘၣ် 'not
# found'), the nominalizing prefix **တၢ်**, the declarative sentence-final
# **လီၤ**, the postposed **အဃိ** ('because of that'), **အဂီၢ်** ('for'),
# **အပူၤ** ('inside'), **လၢ** (relative and locative), **ဒီး** ('and'),
# **မ့တမ့ၢ်** ('or'), **န့ၣ်** ('that'), **အံၤ** ('this'), and the verbs
# သမံသမိး (check), ဆှၢ (send), ပာ် (keep), အိးထီၣ် (open), ကးတံာ် (close),
# ပာ်ဖှိၣ် (add), ထုးထီၣ်ကွံာ် (remove), သုး (move), တြူာ်ကွံာ် (clear),
# ဒုးနဲၣ် (show), ဆီၣ် (press), ကဒီး (again), ထံၣ် (find), ကဘၣ် (must).
#
# **Counting.** CLDR has no plural data for `ksw`, so `Intl.PluralRules`
# resolves it against the runtime's default locale and a category branch here
# would be text chosen by English's rules. Karen leaves a noun unmarked after
# a numeral and counts with a classifier instead, so one form is correct
# anyway: every count select below collapses to a single `*[other]`.
# English's explicit `[0]` is kept, because Fluent matches it against the
# number itself before consulting any plural rule. No `[zero]`, `[one]`,
# `[two]`, `[few]` or `[many]` branch appears in any of these four files.


## Answer submission

answer-checking = သမံသမိးဝဲဒၣ်…
answer-submitting = ဆှၢထီၣ်ဝဲဒၣ်…

answer-checking-status = သမံသမိး တၢ်စံးဆၢ
answer-submitting-status = ဆှၢထီၣ် တၢ်စံးဆၢ

answer-correct = ဘၣ်
answer-incorrect = တဘၣ်ဘၣ်

answer-response-saved = တၢ်စံးဆၢ ပာ်ဃာ်ဝဲလံ

answer-percent-credit = { $percent }% credit
answer-percent-correct = { $percent }% ဘၣ်
answer-percent-short = { $percent } %

max-credit-available = credit အါကတၢၢ်: { $percent }%

# Single `*[other]`: Karen does not mark a noun for number after a numeral,
# and `ksw` has no CLDR plural data. `[0]` is matched against the number.
attempts-remaining =
    { $count ->
        [0] တၢ်ဂဲၤလိာ်အခွဲး တအိၣ်လၢၤဘၣ်
       *[other] အိၣ်ဒံး { $count } ဘျီ
    }

validation-correct = (ဘၣ်)
validation-incorrect = (တဘၣ်ဘၣ်)
validation-partially-correct = (ဘၣ် တနီၤ)

answer-show-responses = ဒုးနဲၣ် { $answerId } အဂီၢ် တၢ်စံးဆၢ { $count } ခါ


## Disclosure panels

feedback-heading = တၢ်စံးဆၢက့ၤ

collapsible-click-to-open = (ဆီၣ် ဒ်သိး ကအိးထီၣ်)
collapsible-click-to-close = (ဆီၣ် ဒ်သိး ကကးတံာ်)

collapsible-initializing = စးထီၣ်ဝဲဒၣ်…

footnote-show = ဒုးနဲၣ် အောက်ခြေမှတ်စု
footnote-hide = ပာ်ခူသူၣ် အောက်ခြေမှတ်စု

description-more-information = တၢ်ဂ့ၢ်တၢ်ကျိၤ အါထီၣ်


## Controls

slider-previous = လၢညါ
slider-next = လၢခံ

keyboard-open = အိးထီၣ် keyboard
keyboard-close = ကးတံာ် keyboard

choice-input-remove-choice = ထုးထီၣ်ကွံာ် { $choice }

matrix-remove-row = ထုးထီၣ်ကွံာ် row
matrix-add-row = ပာ်ဖှိၣ် row
matrix-remove-column = ထုးထီၣ်ကွံာ် column
matrix-add-column = ပာ်ဖှိၣ် column

subset-add-remove-points = ပာ်ဖှိၣ်/ထုးထီၣ်ကွံာ် အမှတ်
subset-toggle-points-intervals = ဆီတလဲ အမှတ် ဒီး interval
subset-move-points = သုး အမှတ်
subset-clear = တြူာ်ကွံာ်

orbital-add-row = ပာ်ဖှိၣ် row
orbital-remove-row = ထုးထီၣ်ကွံာ် row
orbital-add-box = ပာ်ဖှိၣ် box
orbital-remove-box = ထုးထီၣ်ကွံာ် box
orbital-add-up-arrow = ပာ်ဖှိၣ် မြား ဆူထး
orbital-add-down-arrow = ပာ်ဖှိၣ် မြား ဆူဖီလာ်
orbital-remove-arrow = ထုးထီၣ်ကွံာ် မြား

orbital-row-label = row { $row } အဂီၢ် အမံၤ

pretzel-answer = တၢ်စံးဆၢ



## Math input

math-input-preview-region = math expression အ preview
math-input-preview = preview
math-input-invalid-expression = expression တဘၣ်ဘၣ်:


## Document status

viewer-initializing = စးထီၣ်ဝဲဒၣ်…


## Errors

error-heading = တၢ်ကမၣ်

error-found-at =
    { $span ->
        [line] ထံၣ်န့ၢ်လၢ line { $startLine } အပူၤ လီၤ။
       *[lines] ထံၣ်န့ၢ်လၢ line { $startLine }–{ $endLine } အပူၤ လီၤ။
    }

document-contains-errors = document အံၤ အပူၤ တၢ်ကမၣ် အိၣ်ဝဲ လီၤ!

diagnostic-heading-error = တၢ်ကမၣ်
diagnostic-heading-warning = တၢ်ဟ့ၣ်ပလီၢ်
diagnostic-heading-information = တၢ်ဂ့ၢ်တၢ်ကျိၤ
diagnostic-heading-hint = တၢ်ဟ့ၣ်ကူၣ်

accessibility-heading-level-1 = WCAG AA accessibility တၢ်ကမၣ်
accessibility-heading-level-2 = accessibility တၢ်ဟ့ၣ်ပလီၢ်

something-went-wrong = တၢ်တခါခါ ကမၣ်ဝဲ လီၤ။

renderer-load-failed = renderer တခါ load တန့ၢ်ဘၣ်။ ဝံသးစူၤ load ကဘျံးပၤ ကဒီးတဘျီ။

core-start-failed = document အံၤ စးထီၣ် တန့ၢ်ဘၣ်။ ဝံသးစူၤ load ကဘျံးပၤ ကဒီးတဘျီ။

core-start-failed-busy = document အံၤ စးထီၣ် တန့ၢ်ဘၣ်။ document အါခါ စးထီၣ်တဘျီဃီ အဃိ စဲးဖီကဟၣ် လၢအဃၢ်န့ၣ် ဆၢကတီၢ်ယံာ်ဝဲ လီၤ။ document အဂၤ ဝံၤဝံၤ load ကဘျံးပၤ ကဒီးတဘျီ န့ၣ် ဘၣ်သ့ၣ်သ့ၣ် ကမၤစၢၤဝဲ လီၤ။

core-start-failed-retry = document အံၤ စးထီၣ် တန့ၢ်ဘၣ်။

core-start-failed-busy-retry = document အံၤ စးထီၣ် တန့ၢ်ဘၣ်။ document အါခါ စးထီၣ်တဘျီဃီ အဃိ စဲးဖီကဟၣ် လၢအဃၢ်န့ၣ် ဆၢကတီၢ်ယံာ်ဝဲ လီၤ။

core-start-retry = မၤကွၢ် ကဒီးတဘျီ

saved-state-unavailable = နတၢ်မၤ လၢပာ်ဃာ်ဝဲန့ၣ် load တန့ၢ်ဘၣ်။
