# Walloon (walon) viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script, in the *rifondou walon* — the
# unified pan-Walloon spelling worked out from the 1990s onward and used by
# the Walloon Wikipedia, the Rifondou dictionaries and the Walloon software
# localisations. Its marks, as this catalog uses them: «å» for the long back
# vowel («pådje», «valåbe»), «ae» for the vowel that varies across the dialect
# area («taprece» keeps `a`, but «radjouter», «håynaedje», «enondaedje» carry
# it), «xh» for the fricative («adviertixhmint»), «dj» and «tch» for the
# affricates («djusse», «clitchîz»), «sh» for the palatal sibilant
# («shuvant»), and a **space after a clitic apostrophe** — «l' pådje»,
# «d' saye», «n' a nén» — which is the rifondou convention and not a typo.
#
# The **Feller system** — the dialect-by-dialect phonetic notation of 1900,
# still the spelling of most printed Walloon literature — is the alternative,
# and **none of it is used here**. Feller would write «li p'tite pådje» with
# tight apostrophes and would spell each dialect differently; rifondou writes
# one form for all of Wallonia. A reviewer who works in Feller should expect
# to respell rather than to correct.
#
# **What is Walloon's own and what is borrowed.** The grammar and the
# everyday words are Walloon: the copula «esse» («c' est», «n' est nén»), the
# postposed negator **«nén»** (Walloon negates with `nén` after the verb and
# very often drops the preverbal `ni`, which is what this catalog does),
# «pupont» for *none left*, «avou» for *with*, «sins» for *without*, «so» for
# *on*, «inte» for *between*, «po» for *in order to*, «çou ki» for *which*,
# «i gn a» for *there is*. The verbs on the buttons are Walloon: «drovi»
# (open), «serer» (close), «mostrer» (show), «catchî» (hide), «radjouter»
# (add), «oister» (remove), «bodjî» (move), «disfacer» (erase), «rissayî»
# (try again). So are the nouns «saye» (attempt), «roye» (row, line),
# «boesse» (box), «sayete» (arrow), «taprece» (keyboard), «pådje» (page),
# «racsegne» (piece of information), «aroke» (error), «rascourti» (summary),
# and the deverbal `-aedje` nouns this catalog leans on for the progress
# strings: «verifiaedje», «evoyaedje», «enondaedje», «håynaedje».
#
# The technical register is **French, respelled by rifondou rules**:
# «response», «espression», «matematike», «statistike», «colone»,
# «intervale», «infôrmåcion», «accessibilité», «violåcion», «etikete»,
# «macsimom», «module», «documint». Two words are the
# Walloon software-localisation register rather than general Walloon —
# «clitchî» for *to click* and «håyner» for *to display* — and are the words
# the existing Walloon KDE/GNOME translations use. «apiercu» (preview) and
# «Comintaires» (feedback) are the weakest entries in the file: Walloon has
# no settled word for either, and these are French loans respelled, not
# attested Walloon terms. `WCAG AA` is the standard's name and is not a word.
#
# **Counts.** CLDR has its own plural data for `wa`, with two categories,
# `one` and `other`. Walloon's `one` **covers zero as well as one**: a zero
# count selects the singular, so «0 saye» and not «0 sayes». Every
# `{ $count -> … }` below therefore keeps the English `[one]`/`*[other]`
# shape, and `attempts-remaining` still spells its `[0]` out as a literal
# branch — that is a different sentence («pupont d' saye»), not a different
# form of the counted one, and a numeric literal outranks the category.
#
# Walloon punctuates as French does, with a space before `:`, `;`, `?` and
# `!`. That spacing belongs to this catalog and is written out here.
#
# **Weakest first.** A reviewer should attack, in order: «apiercu» and
# «Comintaires»; the `-aedje` progress nouns, where a speaker may prefer a
# finite verb («on verifeye…»); and «espression», whose /ks/ spelling is the
# one place this seed had to choose between rifondou conventions.


## Answer submission

answer-checking = Verifiaedje…
answer-submitting = Evoyaedje…
answer-checking-status = Verifiaedje del response
answer-submitting-status = Evoyaedje del response
answer-correct = Djusse
answer-incorrect = Nén djusse
answer-response-saved = Response eredjistreye
answer-percent-credit = { $percent }% des ponts
answer-percent-correct = { $percent }% djusse
answer-percent-short = { $percent } %
max-credit-available = Macsimom des ponts k' on pout aveur : { $percent }%
# `[0]` is its own sentence. It is written out even though Walloon's `one`
# would catch a zero, because «pupont d' saye» is not the singular of
# anything.
attempts-remaining =
    { $count ->
        [0] i n' dimeure pupont d' saye
        [one] i dmeure { $count } saye
       *[other] i dmeure { $count } sayes
    }
validation-correct = (Djusse)
validation-incorrect = (Nén djusse)
validation-partially-correct = (Djusse a mitan)
answer-show-responses =
    { $count ->
        [one] Mostrer { $count } response a { $answerId }
       *[other] Mostrer { $count } responses a { $answerId }
    }

## Disclosure panels

feedback-heading = Comintaires
collapsible-click-to-open = (clitchîz po drovi)
collapsible-click-to-close = (clitchîz po serer)
collapsible-initializing = Enondaedje…
footnote-show = Mostrer l' note al valeye
footnote-hide = Catchî l' note al valeye
description-more-information = pus di racsegnes

## Controls

slider-previous = Divant
slider-next = Shuvant
keyboard-open = Drovi l' taprece
keyboard-close = Serer l' taprece
choice-input-remove-choice = Oister { $choice }
matrix-remove-row = Oister ene roye
matrix-add-row = Radjouter ene roye
matrix-remove-column = Oister ene colone
matrix-add-column = Radjouter ene colone
subset-add-remove-points = Radjouter/oister des ponts
subset-toggle-points-intervals = Discandjî inte les ponts et les intervales
subset-move-points = Bodjî les ponts
subset-clear = Disfacer
orbital-add-row = Radjouter ene roye
orbital-remove-row = Oister ene roye
orbital-add-box = Radjouter ene boesse
orbital-remove-box = Oister ene boesse
orbital-add-up-arrow = Radjouter ene sayete viè l' hôt
orbital-add-down-arrow = Radjouter ene sayete viè l' bas
orbital-remove-arrow = Oister ene sayete
orbital-row-label = Etikete del roye { $row }
pretzel-answer = Response

## Math input

math-input-preview-region = apiercu di l' espression matematike
math-input-preview = Apiercu
math-input-invalid-expression = Espression nén valåbe :

## Document status

viewer-initializing = Enondaedje…

## Errors

error-heading = Aroke
error-found-at =
    { $span ->
        [line] Trovêye al roye { $startLine }.
       *[lines] Trovêye azès royes { $startLine }–{ $endLine }.
    }
document-contains-errors = Ci documint chal a des arokes !
diagnostic-heading-error = Aroke
diagnostic-heading-warning = Adviertixhmint
diagnostic-heading-information = Infôrmåcion
diagnostic-heading-hint = Sujestion
accessibility-heading-level-1 = Violåcion di l' accessibilité WCAG AA
accessibility-heading-level-2 = Alerte d' accessibilité
something-went-wrong = I gn a åk k' a stî d' triviès.
renderer-load-failed = on module d' håynaedje n' a nén stî tcherdjî. Ritcherdjîz l' pådje, s' i vs plait.
core-start-failed = Ci documint chal n' a nén polou esse enondé. Ritcherdjîz l' pådje, s' i vs plait.
core-start-failed-busy = Ci documint chal n' a nén polou esse enondé. Sacwants documints s' enondént tot l' minme timps, çou ki pout prinde pus longtimps so ene macîne pus linte. Ritcherdjî l' pådje pôrè aidî ene feye ki les ôtes documints åront fini.
core-start-failed-retry = Ci documint chal n' a nén polou esse enondé.
core-start-failed-busy-retry = Ci documint chal n' a nén polou esse enondé. Sacwants documints s' enondént tot l' minme timps, çou ki pout prinde pus longtimps so ene macîne pus linte.
core-start-retry = Rissayî
saved-state-unavailable = Vost ovraedje eredjistré n' a nén polou esse tcherdjî.
