# Aukan / Ndyuka (Okanisi tongo), the Eastern Maroon Creole of the Tapanahoni
# and the Lawa in Suriname and French Guiana. Viewer chrome, translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The **SIL Ndyuka orthography**, the one the Ndyuka
# dictionary and the Ndyuka scriptures are written in. Its points:
#
#   * **A doubled vowel writes length** — «puu» (*take out*), «kibii»
#     (*keep*), «dii» (*three*), «wooko» (*work*), «gaan» (*big*), «ondoo»
#     (*under*), «neen» (*name*), «baaka» (*black*). A single vowel is short.
#     This is the mark of the orthography and a reviewer should keep it.
#   * **No consonant + `r` clusters.** Ndyuka has none, and where Sranan Tongo
#     writes one Ndyuka writes a plain consonant with a long vowel:
#     «gaantangi» not *grantangi*, «kiin» not *krin*, «taa» not *tra*,
#     «pooberi» not *proberi*, «kediti» not *krediti*. Any `Cr` cluster
#     anywhere in these four files is an error.
#   * **`u`, never «oe»**, and **`y`, never «j»**, as in the Surinamese
#     spelling conventions generally.
#   * **Tone is not written.** Ndyuka has contrastive tone and this
#     orthography leaves it unmarked, as the dictionary and the scriptures do.
#     That is stated plainly rather than passed over: it is the orthography's
#     own convention, not an omission this seed made.
#
# Sranan Tongo is a different language and its spellings are **not mixed into
# these files**; `locales/srn` is its own catalog. Saramaccan, in
# `locales/srm`, is a third language again — the two are related but not two
# spellings of one text, and a reviewer who finds a Saramaccan «ta» or «bi»
# here should treat it as a bug.
#
# **Grammar.** Ndyuka grammar carries every sentence. Tense and aspect are the
# preverbal markers «e» (imperfective), «be» (past), «o» (future), «sa»
# (able), «mu» (must), with «kaba» for the completive; negation is the
# preverbal «no» and it precedes the marker («a no e wooko»); «anga» is *and*
# and *with*; «fu» is the purposive and the possessive; «den» is the plural
# and «di» the definite article; «na» is the equative copula and «de» the
# locative. Serial verbs do the work English does with prepositions.
#
# **Number.** `Intl.PluralRules("djk")` has **no CLDR data for `djk`**: it
# falls back and answers `['one', 'other']`, which is English's answer and not
# a fact about Ndyuka. A Ndyuka noun after a numeral is unmarked — «tu
# pooberi», never a pluralized noun; the plural is the preposed «den», used
# for definiteness rather than for counting. So the `one` and `other` branches
# would be word-for-word identical, and where that is so this file writes
# **one unselected form**. English's explicit `[0]` literal in
# `attempts-remaining` matches the number itself, not a plural category, and
# is kept.
#
# **Loans.** The computing register is Dutch and English, reshaped to Ndyuka
# phonology and carried in Ndyuka grammar: «kiibodu» (*keyboard*), «kediti»
# (*credit*), «statistiki», «matematika», «ekispresi», «dokumenti»,
# «infoomasi», «pagina», «masiin», «futunota», «vekitoo», «funsi», «renderer»
# (left as the code's own name), «WCAG» and «aksesibiliteiti». Everyday words
# are Ndyuka: «piki» (*answer*), «leti» / «fowtu» (*right* / *wrong*),
# «pooberi» (*try*), «tan» (*remain*), «sori» (*show*), «opo» / «tapu»
# (*open* / *close*), «puu» / «poti» (*remove* / *add*), «kiin» (*clear*).
#
# **Confidence.** Ndyuka has a dictionary, a scripture translation and very
# little written technical prose, so the loans above are shapes this seed
# derived from Ndyuka phonology rather than usage it found. The grammar and
# the everyday words are the part to trust. Nothing here was left in English.


answer-checking = E luku...
answer-submitting = E seni...

answer-checking-status = E luku a piki
answer-submitting-status = E seni a piki

answer-correct = Leti
answer-incorrect = Fowtu

answer-response-saved = A piki kibii kaba

answer-percent-credit = { $percent }% kediti
answer-percent-correct = { $percent }% leti
answer-percent-short = { $percent } %

max-credit-available = A moo hei kediti: { $percent }%

attempts-remaining =
    { $count ->
        [0] no wan pooberi no tan moo
       *[other] { $count } pooberi tan
    }

validation-correct = (Leti)
validation-incorrect = (Fowtu)
validation-partially-correct = (Wan pisi leti)

answer-show-responses = Sori { $count } piki gi { $answerId }


feedback-heading = Piki fu a wooko

collapsible-click-to-open = (kiliki fu opo)
collapsible-click-to-close = (kiliki fu tapu)

collapsible-initializing = E bigin...

footnote-show = Sori a futunota
footnote-hide = Kibii a futunota

description-more-information = moo infoomasi


slider-previous = Baka
slider-next = Fesi

keyboard-open = Opo a kiibodu
keyboard-close = Tapu a kiibodu

choice-input-remove-choice = Puu { $choice }

matrix-remove-row = Puu wan lei
matrix-add-row = Poti wan lei
matrix-remove-column = Puu wan kolon
matrix-add-column = Poti wan kolon

subset-add-remove-points = Poti/Puu punt
subset-toggle-points-intervals = Kenki punt anga intavalu
subset-move-points = Seke den punt
subset-clear = Kiin

orbital-add-row = Poti wan lei
orbital-remove-row = Puu wan lei
orbital-add-box = Poti wan bokisi
orbital-remove-box = Puu wan bokisi
orbital-add-up-arrow = Poti wan peili di e go a tapu
orbital-add-down-arrow = Poti wan peili di e go a ondoo
orbital-remove-arrow = Puu a peili

orbital-row-label = Neen gi lei { $row }

pretzel-answer = Piki



math-input-preview-region = luku fosi fu a matematika-ekispresi
math-input-preview = Luku fosi
math-input-invalid-expression = A ekispresi no bun:


viewer-initializing = E bigin...


error-heading = Fowtu

error-found-at =
    { $span ->
        [line] Feni a lin { $startLine }.
       *[lines] Feni a lin { $startLine }–{ $endLine }.
    }

document-contains-errors = A dokumenti ya abi fowtu a ini!

diagnostic-heading-error = Fowtu
diagnostic-heading-warning = Wasikoi
diagnostic-heading-information = Info
diagnostic-heading-hint = Tipi

accessibility-heading-level-1 = WCAG AA aksesibiliteiti-fowtu
accessibility-heading-level-2 = Aksesibiliteiti-wasikoi

something-went-wrong = Wan sani go fowtu.

renderer-load-failed = wan renderer no man lai. Gaantangi, lai a pagina baka.

core-start-failed = A dokumenti ya no man bigin. Gaantangi, lai a pagina baka.

core-start-failed-busy = A dokumenti ya no man bigin. Somen dokumenti be e bigin a wan pisi ten, da a sa teke moo langa a wan safi masiin. Te den taa dokumenti kaba, da a sa yeepi efu i lai a pagina baka.

core-start-failed-retry = A dokumenti ya no man bigin.

core-start-failed-busy-retry = A dokumenti ya no man bigin. Somen dokumenti be e bigin a wan pisi ten, da a sa teke moo langa a wan safi masiin.

core-start-retry = Pooberi baka

saved-state-unavailable = A wooko di i be kibii no man lai.
