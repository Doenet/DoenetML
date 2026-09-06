# Belize Kriol (Bileez Kriol) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** These four files are written in the **phonemic orthography
# of the Belize Kriol Council / National Kriol Council of Belize**, the system
# of the *Kriol-Inglish Dikshineri* and of «Di Nyoo Testiment». Its points:
#
#   * **Long vowels are doubled** — «chrii», «bloo», «griin», «sayv»; the
#     diphthongs are written «ai ou ie uo oa ay».
#   * **`ch` for English *tr-*** and **`j` for English *dr-*** — «chrai»
#     (*try*), «chraiangl» (*triangle*), «jraa» (*draw*). This is the single
#     most visible mark of the orthography and a reviewer should keep it.
#   * **`k` for hard *c*** — «klik», «kalam», «kredit».
#   * **No apostrophes anywhere**, and no silent English letters: «rait» not
#     *right*, «noat» not *note*.
#
# The **English-based ad-hoc spelling** — writing Kriol words as though they
# were the English words they descend from — is what most Belizeans actually
# write day to day, and it is **not used anywhere in these four files**. That
# is a deliberate choice of one system over the commoner practice, not an
# oversight. A reviewer who prefers the English-based spelling should
# **respell** these files rather than retranslate them: the grammar underneath
# is the same either way.
#
# **Grammar.** Kriol grammar, not English words in English order. Tense and
# aspect are preverbal markers — «mi» (past), «wahn» (future), «di»
# (progressive), «dohn» (completive) — never suffixes; the negator is the
# preverbal «noh», and it stacks («no chrai noh lef»); «wan» is the indefinite
# article and «di» the definite one; «dehn» after a noun marks the plural;
# «fi» is the purposive («klik fi oapn»). Serial verbs carry what English
# carries with a preposition.
#
# **Number.** `Intl.PluralRules("bzj")` has **no CLDR data for `bzj`**: it
# falls back and answers `['one', 'other']`, which is English's answer and not
# a fact about Kriol. A Kriol noun after a numeral does not inflect — «chree
# chrai», never a pluralized noun — so the `one` and `other` branches would be
# word-for-word identical. Where that is so, this file writes **one unselected
# form** rather than two identical branches. English's explicit `[0]` literal
# in `attempts-remaining` matches the number itself, not a plural category, and
# is kept.
#
# **Loans.** The computing and mathematics register is English, respelled into
# Kriol phonology and carried in Kriol grammar: «kiiboad», «rispans»,
# «kredit», «matriks», «vekta», «fongshan», «statistiks», «expreshan»,
# «dakiument», «renderer», «infamayshan», «akseh» (*access*). Where a Kriol
# word exists it is used instead — «chrai» for *attempt*, «rang» for
# *incorrect*, «lef» for *remaining*, «tek out» for *remove*.
#
# **Confidence.** Kriol has a settled orthography and a dictionary but very
# little written technical prose, so the loans above are respellings this seed
# made rather than usage it found. The everyday words — «rait», «rang»,
# «chrai», «oapn», «kloaz», «shoa», «lef» — are dictionary words and should
# stand. Nothing in this file was left in English.


answer-checking = Di chek...
answer-submitting = Di sen...

answer-checking-status = Di chek di ansa
answer-submitting-status = Di sen di ansa

answer-correct = Rait
answer-incorrect = Rang

answer-response-saved = Rispans Sayv

answer-percent-credit = { $percent }% Kredit
answer-percent-correct = { $percent }% Rait
answer-percent-short = { $percent } %

max-credit-available = Di moas kredit weh deh: { $percent }%

attempts-remaining =
    { $count ->
        [0] no chrai noh lef
       *[other] { $count } chrai lef
    }

validation-correct = (Rait)
validation-incorrect = (Rang)
validation-partially-correct = (Paat a it rait)

answer-show-responses = Shoa { $count } rispans fi { $answerId }


feedback-heading = Fiidbak

collapsible-click-to-open = (klik fi oapn)
collapsible-click-to-close = (klik fi kloaz)

collapsible-initializing = Di staat op...

footnote-show = Shoa di futnoat
footnote-hide = Haid di futnoat

description-more-information = moa infamayshan


slider-previous = Bak
slider-next = Neks

keyboard-open = Oapn di Kiiboad
keyboard-close = Kloaz di Kiiboad

choice-input-remove-choice = Tek out { $choice }

matrix-remove-row = Tek out wan roa
matrix-add-row = Ad wan roa
matrix-remove-column = Tek out wan kalam
matrix-add-column = Ad wan kalam

subset-add-remove-points = Ad/Tek out paint
subset-toggle-points-intervals = Swich bitwiin paint ahn intaval
subset-move-points = Muuv di Paint
subset-clear = Klier

orbital-add-row = Ad wan Roa
orbital-remove-row = Tek out wan Roa
orbital-add-box = Ad wan Baks
orbital-remove-box = Tek out wan Baks
orbital-add-up-arrow = Ad wan Aro weh Point Op
orbital-add-down-arrow = Ad wan Aro weh Point Dong
orbital-remove-arrow = Tek out di Aro

orbital-row-label = Laybl fi roa { $row }

pretzel-answer = Ansa



math-input-preview-region = priviu a di mat expreshan
math-input-preview = Priviu
math-input-invalid-expression = Di expreshan noh gud:


viewer-initializing = Di staat op...


error-heading = Era

error-found-at =
    { $span ->
        [line] Fain pahn lain { $startLine }.
       *[lines] Fain pahn lain { $startLine }–{ $endLine }.
    }

document-contains-errors = Dis dakiument gat era eena it!

diagnostic-heading-error = Era
diagnostic-heading-warning = Waanin
diagnostic-heading-information = Info
diagnostic-heading-hint = Hint

accessibility-heading-level-1 = WCAG AA akseh-vaiyolayshan
accessibility-heading-level-2 = Akseh-alert

something-went-wrong = Sohnting gaan rang.

renderer-load-failed = wan renderer noh mi lod. Pliiz lod di payj bak.

core-start-failed = Dis dakiument noh mi ku staat. Pliiz lod di payj bak.

core-start-failed-busy = Dis dakiument noh mi ku staat. Wahn hiip a dakiument mi di staat da di siem taim, ahn dat ku tek langa pahn wan sloa masheen. Wen di ada dakiument dehn dohn, den lod di payj bak — dat ku help.

core-start-failed-retry = Dis dakiument noh mi ku staat.

core-start-failed-busy-retry = Dis dakiument noh mi ku staat. Wahn hiip a dakiument mi di staat da di siem taim, ahn dat ku tek langa pahn wan sloa masheen.

core-start-retry = Chrai wan neks taim

saved-state-unavailable = Wi noh mi ku lod di wok weh yu mi sayv.
