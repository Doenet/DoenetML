# Garifuna viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Translated from `locales/en/chrome.ftl`, which is the source
# of truth: `lint:i18n` rejects a key that does not exist there, and reports a
# key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard Latin orthography used across the four Garifuna
# communities — Honduras, Belize, Guatemala and Nicaragua — and taught in the
# bilingual schools of Honduras and Belize:
# `a b ch d e f g h i k l m n ñ o p r s t u ü w y`. Three notes.
#
#   * **`ü` is a letter of its own**, the high central vowel, and is written
#     with the diaeresis everywhere it occurs: «buiti» has none, «ürüwa» and
#     «álügüdahani» have three between them. It is not a variant spelling of
#     `u` and the two are not interchangeable.
#   * **The falling tone is not written.** Garifuna distinguishes tone, and the
#     standard orthography leaves it unmarked; where an acute appears in these
#     files it is the Spanish-style stress accent Honduran practice uses on
#     some words («álügüdahani»), not a tone mark. A reviewer should not read
#     the absence of accents as an error.
#   * `c`, `j`, `q`, `v`, `x` and `z` are **not** in the alphabet; a Spanish
#     loan that would use them is respelled — «tekladu» for *teclado*,
#     «espresion» for *expresión*, «adbertensia» for *advertencia*, «asulu»
#     for *azul*.
#
# The language is named «Garifuna» in all four of these files. The spelling
# «Garínagu» is the name of the people rather than of the language and is not
# used here.
#
# **Number.** `Intl.PluralRules` has no CLDR data for `cab`; it falls back to
# the default locale and reports `one` and `other`, categories Garifuna does not
# select. Wherever English writes a `[one]`/`[other]` pair this file writes
# **one unselected form** — `answer-show-responses` is the case. English's
# explicit `[0]` literal in `attempts-remaining` matches the number itself
# rather than a plural category and is kept. Selects on non-numeric variables
# (`$span`) keep every branch English has.
#
# **Loans.** Garifuna has no native software register, but it borrows for
# exactly this register in school and everyday speech — Spanish in Honduras,
# Guatemala and Nicaragua, English in Belize. The technical nouns here are
# **Spanish loans respelled to the Garifuna alphabet and carried in a Garifuna
# frame**: «respuesta», «tekladu», «matrisi», «kolumna», «fila», «intentu»,
# «erroru», «adbertensia», «informasion», «dokumentu», «estadístika»,
# «espresion», «renderisadóru», «aksesibilidá». The frame around them is
# Garifuna: the second-person imperative prefix `b-` on the loan verbs
# («Bagregaru» add, «Bakitaru» remove, «Bakambiaru» change, «Bakargaru» load),
# «lidan» in, «lun» to, «luma» with, «anihein» there is, «úati» there is none,
# «mama» the negative copula, «siñá» cannot, and the privative `ma-` of
# «mabuiti». A Belizean speaker may prefer the English loan in any of these
# slots — *keyboard*, *matrix*, *error* — and should feel free to substitute,
# but the whole file has to move together.
#
# **Confidence, and it is low.** «buiti» and its privative «mabuiti», the two
# verdicts on a submitted answer, carry a great deal of this file and are worth
# a speaker's check before anything is built on them. So are four frame words
# used throughout: «arihini» (looking, for *checking*), «arúfudahani»
# (showing), «arámudahani» (hiding) and «lúeigiñe» (again). Buttons that
# English writes as bare verbs — *Open Keyboard*, *Close Keyboard* — are
# reframed as show and hide, which is what the Garifuna verbs here can say
# plainly. `error-found-at` says where the error is rather than that it was
# found: the locative sentence is safe and the passive is not.


## Answer submission

answer-checking = Arihini...
answer-submitting = Ichugúni...

answer-checking-status = Arihini respuesta
answer-submitting-status = Ichugúni respuesta

answer-correct = Buiti
answer-incorrect = Mabuiti

answer-response-saved = Aguardaruni respuesta

answer-percent-credit = { $percent }% puntu
answer-percent-correct = { $percent }% buiti
answer-percent-short = { $percent } %

max-credit-available = Puntu wéiriti: { $percent }%

attempts-remaining =
    { $count ->
        [0] úati intentu
       *[other] { $count } intentu lárigiñe
    }

validation-correct = (Buiti)
validation-incorrect = (Mabuiti)
validation-partially-correct = (Parti buiti)

answer-show-responses = Barúfuda { $count } respuesta lun { $answerId }


## Disclosure panels

feedback-heading = Uganu

collapsible-click-to-open = (bafara lun arihini)
collapsible-click-to-close = (bafara lun arámudahani)

collapsible-initializing = Agumeseha...

footnote-show = Barúfuda nota
footnote-hide = Barámuda nota

description-more-information = informasion ámuñegu


## Controls

slider-previous = Furumiñe
slider-next = Lárigi

keyboard-open = Barúfuda tekladu
keyboard-close = Barámuda tekladu

choice-input-remove-choice = Bakitaru { $choice }

matrix-remove-row = Bakitaru fila
matrix-add-row = Bagregaru fila
matrix-remove-column = Bakitaru kolumna
matrix-add-column = Bagregaru kolumna

subset-add-remove-points = Bagregaru/Bakitaru puntu
subset-toggle-points-intervals = Bakambiaru puntu luma interbalu
subset-move-points = Bamubaru puntu
subset-clear = Balimpiaru

orbital-add-row = Bagregaru fila
orbital-remove-row = Bakitaru fila
orbital-add-box = Bagregaru kaha
orbital-remove-box = Bakitaru kaha
orbital-add-up-arrow = Bagregaru flecha ariba
orbital-add-down-arrow = Bagregaru flecha abahu
orbital-remove-arrow = Bakitaru flecha

orbital-row-label = Etiketa lun fila { $row }

pretzel-answer = Respuesta



## Math input

math-input-preview-region = arihini furumiñe lun espresion matemátika
math-input-preview = Arihini furumiñe
math-input-invalid-expression = Espresion mabuiti:


## Document status

viewer-initializing = Agumeseha...


## Errors

error-heading = Erroru

# Says where the error is rather than that it was found: the locative sentence
# is the one this seed can write plainly.
error-found-at =
    { $span ->
        [line] Lidan línia { $startLine }.
       *[lines] Lidan línia { $startLine }–{ $endLine }.
    }

document-contains-errors = Anihein erroru lidan dokumentu le!

diagnostic-heading-error = Erroru
diagnostic-heading-warning = Adbertensia
diagnostic-heading-information = Informasion
diagnostic-heading-hint = Pista

accessibility-heading-level-1 = Erroru aksesibilidá WCAG AA
accessibility-heading-level-2 = Adbertensia aksesibilidá

something-went-wrong = Anihein ában katei mabuiti.

renderer-load-failed = mama lakargarun ában renderisadóru. Bakargaru páhina lúeigiñe.

core-start-failed = Siñá lagumeserun dokumentu le. Bakargaru páhina lúeigiñe.

core-start-failed-busy = Siñá lagumeserun dokumentu le. Saragu dokumentu agumeseha lidan ában dan, ligía lasandiragunbei dan wéiri lidan ában kompiutadora yebe. Danme lagumucha amu dokumentu, gayarabei líderaguni bakargarun páhina lúeigiñe.

core-start-failed-retry = Siñá lagumeserun dokumentu le.

core-start-failed-busy-retry = Siñá lagumeserun dokumentu le. Saragu dokumentu agumeseha lidan ában dan, ligía lasandiragunbei dan wéiri lidan ában kompiutadora yebe.

core-start-retry = Bafuranguagüda lúeigiñe

saved-state-unavailable = Siñá lakargarun badagimanu aguardaruati.
