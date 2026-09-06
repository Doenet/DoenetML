# Mon (ဘာသာမန်) viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety and script.** Mon (ဘာသာမန်) as written in Mon State and in the
# Mon communities of Thailand, in the Mon-Burmese script. Mon shares most of
# its letters with Burmese and adds letters of its own, and this catalog uses
# them rather than their Burmese substitutes: **ၚ** (Mon nga, U+105A) where
# Burmese writes င, **ၜ** (bba, U+105C), and the Mon medials **ၞ ၟ ၠ**. Mon's
# other own letters — ၝ (bbe) and ဿ (ssa) — are not in this catalog, because
# no word it happens to use needs them; their absence is not a claim that Mon
# lacks them. A corrector must not fold ၚ into င: the two
# are indistinguishable at a glance, the substitution is invisible on screen,
# and it breaks every search for a Mon word. Where Burmese letters do appear
# below they are inside declared Burmese loanwords, listed further down, and
# they are not Mon spellings of Mon words.
#
# **Tone and register are where this seed is weakest, and it says so first.**
# Mon's register (breathy against clear voice) is carried by the choice of
# consonant series rather than by a diacritic, so a wrong consonant is a wrong
# word rather than a misspelling. Where the seed could not choose the series
# with confidence it chose a different word, or a Burmese loan, rather than
# guessing.
#
# **Spacing.** Mon publishing follows the Burmese convention: no spaces inside
# a phrase, a space at a phrase or clause boundary. This catalog does the
# same, which is what decides where these messages may wrap in a narrow panel.
# It is the opposite of `locales/shn`'s practice, and the difference is real
# rather than an inconsistency between two files of one batch.
#
# **Register, and what is a loan.** Every Mon speaker in Myanmar is schooled
# in Burmese, and meets computing and higher mathematics in English. This
# catalog is a **Mon frame around two declared loan vocabularies**, and
# neither is respelled into invented Mon syllables:
#
#   * **Burmese, in its own Burmese spelling**, for the school register Mon
#     genuinely borrows: သတိပေးချက် (warning), အချက်အလက် (information),
#     တုံ့ပြန်ချက် (feedback), အောက်ခြေမှတ်စု (footnote), အမှတ် (point),
#     မြား (arrow), ဇယား (table), အပိုင်း (part), လေ့ကျင့်ခန်း (exercise),
#     လုပ်ငန်း (task), သက်သေပြချက် (proof), ကွက်လပ် (blank), and — see
#     `content.ftl` — the whole colour list.
#   * **English, in the Latin alphabet**, for computing and the DoenetML
#     vocabulary: `keyboard`, `row`, `column`, `box`, `credit`, `preview`,
#     `math expression`, `interval`, `document`, `renderer`, `load`,
#     `summary statistics`, `WCAG AA`, `accessibility`. Myanmar-script
#     technical writing leaves such terms in Latin letters, and writing them
#     out in Mon syllables would invent a spelling no reader has seen.
#
# The Mon is the frame: နွံ (there is), ဟွံမွဲ (there is not), ဒှ် (to be),
# ဟွံ (not), ဂှ် (that), မ (relativizer), လဝ် (perfective), မံၚ်
# (progressive), ပ္ဍဲ (in, at), နူ (from), ကဵု (to, give), သွက်ဂွံ (in order
# to), နကဵု (with), တုဲ (and then), ဟွံသေၚ် (or, is not), ဟိုတ်နူ (because),
# ညိ (please), ရ (final particle), and the verbs စၟဳစၟတ် (check), ပ္တိုန်
# (submit), စွံ (keep), ပံက် (open), ကၟာတ် (close), စုတ် (add, put in),
# ပတိတ် (take out), ပြံၚ် (move), ပလီု (clear), ထ္ၜး (show), ဍဵု (press),
# ကလေၚ် (again), ဆဵု (find), ဗၠေတ် (be wrong), ဒးရး (be correct).
#
# **Counting.** CLDR has no plural data for `mnw`, so `Intl.PluralRules`
# resolves it against the runtime's default locale and a category branch here
# would be text chosen by English's rules. Mon leaves a noun unmarked after a
# numeral, so one form is correct anyway: every count select below collapses
# to a single `*[other]`. English's explicit `[0]` is kept, because Fluent
# matches it against the number itself before consulting any plural rule. No
# `[zero]`, `[one]`, `[two]`, `[few]` or `[many]` branch appears in any of
# these four files.


## Answer submission

answer-checking = စၟဳစၟတ်မံၚ်…
answer-submitting = ပ္တိုန်မံၚ်…

answer-checking-status = စၟဳစၟတ်မံၚ် သွဟ်
answer-submitting-status = ပ္တိုန်မံၚ် သွဟ်

answer-correct = ဒးရး
answer-incorrect = ဟွံဒးရး

answer-response-saved = သွဟ် စွံလဝ်ရ

answer-percent-credit = { $percent }% credit
answer-percent-correct = { $percent }% ဒးရး
answer-percent-short = { $percent } %

max-credit-available = credit ဂၠိုၚ်အိုတ်: { $percent }%

# Single `*[other]`: Mon does not mark a noun for number after a numeral, and
# `mnw` has no CLDR plural data. `[0]` is matched against the number and fires.
attempts-remaining =
    { $count ->
        [0] အလန် ဟွံမွဲ ကွာ်ရ
       *[other] ဂွံအခေါၚ် { $count } အလန် ပၠန်
    }

validation-correct = (ဒးရး)
validation-incorrect = (ဟွံဒးရး)
validation-partially-correct = (ဒးရး တၞဟ်ခြာ)

answer-show-responses = ထ္ၜး သွဟ် { $count } တၚ် ကု { $answerId }


## Disclosure panels

feedback-heading = တုံ့ပြန်ချက်

collapsible-click-to-open = (ဍဵု သွက်ဂွံပံက်)
collapsible-click-to-close = (ဍဵု သွက်ဂွံကၟာတ်)

collapsible-initializing = စတမ်မံၚ်…

footnote-show = ထ္ၜး အောက်ခြေမှတ်စု
footnote-hide = ကၟာတ် အောက်ခြေမှတ်စု

description-more-information = အချက်အလက် ဂၠိုၚ်တိုန်


## Controls

slider-previous = ကၠာ
slider-next = လက္ကရဴ

keyboard-open = ပံက် keyboard
keyboard-close = ကၟာတ် keyboard

choice-input-remove-choice = ပတိတ် { $choice }

matrix-remove-row = ပတိတ် row
matrix-add-row = စုတ် row
matrix-remove-column = ပတိတ် column
matrix-add-column = စုတ် column

subset-add-remove-points = စုတ်/ပတိတ် အမှတ်
subset-toggle-points-intervals = ပြံၚ် အမှတ် ကဵု interval
subset-move-points = ပြံၚ် အမှတ်
subset-clear = ပလီု

orbital-add-row = စုတ် row
orbital-remove-row = ပတိတ် row
orbital-add-box = စုတ် box
orbital-remove-box = ပတိတ် box
orbital-add-up-arrow = စုတ် မြား တိုန်
orbital-add-down-arrow = စုတ် မြား စှေ်
orbital-remove-arrow = ပတိတ် မြား

orbital-row-label = ယၟု သွက် row { $row }

pretzel-answer = သွဟ်



## Math input

math-input-preview-region = preview နူ math expression
math-input-preview = preview
math-input-invalid-expression = expression ဟွံဒးရး:


## Document status

viewer-initializing = စတမ်မံၚ်…


## Errors

error-heading = တၚ်ဗၠေတ်

error-found-at =
    { $span ->
        [line] ဆဵုကေတ် ပ္ဍဲ line { $startLine } ရ။
       *[lines] ဆဵုကေတ် ပ္ဍဲ line { $startLine }–{ $endLine } ရ။
    }

document-contains-errors = document ဏအ် တၚ်ဗၠေတ် နွံမံၚ်ရ!

diagnostic-heading-error = တၚ်ဗၠေတ်
diagnostic-heading-warning = သတိပေးချက်
diagnostic-heading-information = အချက်အလက်
diagnostic-heading-hint = ကသပ်

accessibility-heading-level-1 = WCAG AA accessibility တၚ်ဗၠေတ်
accessibility-heading-level-2 = accessibility သတိပေးချက်

something-went-wrong = မွဲမွဲ ဗၠေတ်အာရ။

renderer-load-failed = renderer မွဲ load ဟွံဂွံ။ ကလေၚ် load မုက်လိက် ညိ။

core-start-failed = document ဏအ် စတမ် ဟွံဂွံ။ ကလေၚ် load မုက်လိက် ညိ။

core-start-failed-busy = document ဏအ် စတမ် ဟွံဂွံ။ document ဂၠိုၚ်ဂၠိုၚ် စတမ်မွဲစွံဟိုတ်နူ ပ္ဍဲစက် လျိုၚ်ဂှ် အခိၚ်ကၠာဲ။ document တၞဟ် အိုတ်တုဲ ကလေၚ် load မုက်လိက်မ္ဂး ကၠောန်ဂွံမာန်ရ။

core-start-failed-retry = document ဏအ် စတမ် ဟွံဂွံ။

core-start-failed-busy-retry = document ဏအ် စတမ် ဟွံဂွံ။ document ဂၠိုၚ်ဂၠိုၚ် စတမ်မွဲစွံဟိုတ်နူ ပ္ဍဲစက် လျိုၚ်ဂှ် အခိၚ်ကၠာဲ။

core-start-retry = ကလေၚ်စမ်ရံၚ်

saved-state-unavailable = ကမၠောန် မစွံလဝ်ဂှ် load ဟွံဂွံ။
