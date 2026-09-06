# Qʼeqchiʼ viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The alphabet of the Academia de Lenguas Mayas de Guatemala
# (ALMG), which is the orthography Qʼeqchiʼ is officially written in today:
# `a aa bʼ ch chʼ e ee h i ii j k kʼ l m n o oo p q qʼ r s t tʼ tz tzʼ u uu w x y`.
# Three properties of it matter for reading these files.
#
#   * **The ejectives are digraphs made with `ʼ`** — `bʼ chʼ kʼ qʼ tʼ tzʼ` — and
#     the same character writes the glottal stop. It is U+02BC MODIFIER LETTER
#     APOSTROPHE `ʼ`, not U+2019 RIGHT SINGLE QUOTATION MARK `’` and not U+0027
#     APOSTROPHE `'`; the three are homoglyphs in most fonts, so a reviewer who
#     retypes «inkʼaʼ» should check the codepoint and not the shape.
#   * **`q` and `k` are two different sounds**, uvular and velar, and both are
#     written with the letter they are pronounced with.
#   * **Long vowels are written doubled**, «aa ee ii oo uu».
#
# The colonial-era spellings are **not mixed in anywhere in these four files**:
# no `qu` for `k`, no `hu` for `w`, no `k` standing for the uvular `q`, no `4`
# or `ɜ` for an ejective.
#
# The language is named «Qʼeqchiʼ» in all four of these files, spelled exactly
# that way.
#
# **Number.** `Intl.PluralRules` has no CLDR data for `kek`; it falls back to
# the default locale and reports `one` and `other`, categories Qʼeqchiʼ does not
# select. A Qʼeqchiʼ noun after a numeral is not marked for plural, so wherever
# English writes a `[one]`/`[other]` pair this file writes **one unselected
# form**. English's explicit `[0]` literal in `attempts-remaining` matches the
# number itself rather than a plural category, and is kept.
#
# **Loans.** Qʼeqchiʼ has no native software register, and the register it does
# use for this material in school and in daily speech is Spanish. The technical
# nouns here are therefore Spanish loans written to ALMG spelling — «teklado»,
# «matris», «kolumna», «estadistika», «punto», «interbalo», «nota», «bersion» —
# carried inside an ordinary Qʼeqchiʼ sentence frame: native verbs («isi»,
# «kʼe», «te», «tzʼap», «kʼutbʼesi»), the negator «inkʼaʼ», the existential
# negation «maakʼaʼ», and Qʼeqchiʼ word order. No novel native compound is
# coined for a thing the language has no word for.
#
# **Confidence.** Every key in the English catalog is answered here. The
# weakest wordings are the error sentences, which are longer than anything
# Qʼeqchiʼ ordinarily writes about a machine, and «okenk» for *accessibility*,
# which is a description rather than an established term.


## Answer submission

answer-checking = Yook chi ilmank...
answer-submitting = Yook chi taqlamank...

answer-checking-status = Yook chi ilmank li sumenk
answer-submitting-status = Yook chi taqlamank li sumenk

answer-correct = Us
answer-incorrect = Inkʼaʼ us

answer-response-saved = Xkʼuulamank li sumenk

answer-percent-credit = { $percent }% punto
answer-percent-correct = { $percent }% us
answer-percent-short = { $percent } %

max-credit-available = Xnimal punto naru xtawbʼal: { $percent }%

attempts-remaining =
    { $count ->
        [0] maakʼaʼ chik yalok
       *[other] { $count } yalok chik wan
    }

validation-correct = (Us)
validation-incorrect = (Inkʼaʼ us)
validation-partially-correct = (Jachal us)

answer-show-responses = Kʼutbʼesi { $count } sumenk re { $answerId }


## Disclosure panels

feedback-heading = Naʼlebʼ

collapsible-click-to-open = (kʼe li klik re teebʼal)
collapsible-click-to-close = (kʼe li klik re tzʼapbʼal)

collapsible-initializing = Yook chi tikibʼaak...

footnote-show = Kʼutbʼesi li nota
footnote-hide = Muq li nota

description-more-information = esil chik


## Controls

slider-previous = Junxil
slider-next = Moqon

keyboard-open = Te li teklado
keyboard-close = Tzʼap li teklado

choice-input-remove-choice = Isi { $choice }

matrix-remove-row = Isi jun tasal
matrix-add-row = Kʼe jun tasal
matrix-remove-column = Isi jun kolumna
matrix-add-column = Kʼe jun kolumna

subset-add-remove-points = Kʼe malaj isi punto
subset-toggle-points-intervals = Jala punto ut interbalo
subset-move-points = Kʼam li punto
subset-clear = Sacha chixjunil

orbital-add-row = Kʼe jun tasal
orbital-remove-row = Isi jun tasal
orbital-add-box = Kʼe jun kaxa
orbital-remove-box = Isi jun kaxa
orbital-add-up-arrow = Kʼe jun tzimaj chi taqeʼk
orbital-add-down-arrow = Kʼe jun tzimaj chi kubʼeek
orbital-remove-arrow = Isi li tzimaj

orbital-row-label = Xkʼabaʼ li tasal { $row }

pretzel-answer = Sumenk



## Math input

math-input-preview-region = kʼutbʼil chi ubʼej li matematika
math-input-preview = Kʼutbʼil chi ubʼej
math-input-invalid-expression = Inkʼaʼ us li matematika:


## Document status

viewer-initializing = Yook chi tikibʼaak...


## Errors

error-heading = Paltil

error-found-at =
    { $span ->
        [line] Xtawmank saʼ li raqal { $startLine }.
       *[lines] Xtawmank saʼ eb li raqal { $startLine }–{ $endLine }.
    }

document-contains-errors = Wan paltil saʼ li hu aʼin!

diagnostic-heading-error = Paltil
diagnostic-heading-warning = Reetal
diagnostic-heading-information = Esil
diagnostic-heading-hint = Tenqʼ

accessibility-heading-level-1 = Paltil chirix li WCAG AA
accessibility-heading-level-2 = Reetal chirix li okenk

something-went-wrong = Wan jun li inkʼaʼ us xkʼulman.

renderer-load-failed = inkʼaʼ xkʼulunk jun li renderer. Bʼaanu usilal, taqla wiʼ chik li perel.

core-start-failed = Inkʼaʼ xtiklaak li hu aʼin. Bʼaanu usilal, taqla wiʼ chik li perel.

core-start-failed-busy = Inkʼaʼ xtiklaak li hu aʼin. Kʼiila hu yookeb chi tiklaak saʼ junaj kutan, ut naru nabʼayk chiru jun chʼiichʼ inkʼaʼ kaw. Naru natenqʼan xtaqlankil wiʼ chik li perel naq akeʼraqeʼ chik li jun chik hu.

core-start-failed-retry = Inkʼaʼ xtiklaak li hu aʼin.

core-start-failed-busy-retry = Inkʼaʼ xtiklaak li hu aʼin. Kʼiila hu yookeb chi tiklaak saʼ junaj kutan, ut naru nabʼayk chiru jun chʼiichʼ inkʼaʼ kaw.

core-start-retry = Yal wiʼ chik

saved-state-unavailable = Inkʼaʼ xkʼulunk li kʼanjel kʼuulanbʼil aawe.
