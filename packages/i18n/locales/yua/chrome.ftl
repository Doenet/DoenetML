# Yucatec Maya (Maayaʼ tʼàan) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The modern unified orthography of the Academia de la Lengua
# Maya de Yucatán, as INALI publishes it: `a aa b ch chʼ e ee i ii j k kʼ l m n
# o oo p pʼ r s t tʼ ts tsʼ u uu w x y ʼ`. Two things about it decide how these
# files look.
#
#   * **Length is written by doubling the vowel** — «maayaʼ», «tʼaan»,
#     «maʼalob» — never by an acute accent or a macron.
#   * **The glottal stop and the ejectives are written with U+02BC MODIFIER
#     LETTER APOSTROPHE `ʼ`**, not U+2019 RIGHT SINGLE QUOTATION MARK `’` and
#     not U+0027 APOSTROPHE `'`. Every apostrophe *inside a Maya word* in
#     these four files is U+02BC. The three characters are homoglyphs in most
#     fonts, so a reviewer who retypes a word should check the codepoint
#     rather than the shape. The straight ASCII `'` does still appear, and is
#     not a respelling: it is English's own punctuation, carried through
#     unchanged where a message quotes an enumerated value back to the author
#     or writes the derivative `y'`. `catalogLint.test.ts` forbids U+2019 here
#     and deliberately permits U+0027 for that reason.
#
# The catalog writes the name of the language as «Maayaʼ tʼàan» in all four
# files, following the way this batch was commissioned. The tone-marked `à` is
# not part of the ordinary ALMY spelling, which writes «maayaʼ tʼaan»; the
# grave here marks the falling tone and is otherwise unwritten in the body of
# these catalogs.
#
# **Number.** `Intl.PluralRules` has no CLDR data for `yua`, so it falls back
# to the default locale and reports `one` and `other` — categories Yucatec does
# not select. A Yucatec noun after a numeral takes no plural suffix, so the two
# branches would be the same text, and where that is so this file writes **one
# unselected form**. English's explicit `[0]` literals match the number itself
# rather than a category, and `attempts-remaining` keeps that shape.
#
# **Loans.** Yucatec has no native software register, and the register it does
# use for this material in school and in everyday speech is Spanish. The
# technical nouns here are therefore **Spanish loans written in the ALMY
# orthography and carried inside an ordinary Yucatec sentence frame** — native
# verbs, native word order, the native negation «maʼ … -iʼ». The loans this
# file carries are «teklaado» (keyboard), «renglón» (row), «kolumna» (column),
# «kaja» (box), «flecha» (arrow), «punto» (point), «intervalo» (interval),
# «matrís» (matrix), «kréedito» (credit), «ekspresión matemátika» (math
# expression), «estadístika» (statistics), «dokumento», «páajina» (page),
# «renderisador» (renderer), «nota» (footnote), «informasión», «aksesibilidad»,
# «etiketa» (label). Nothing here is a coinage; where the loan is what a
# speaker would actually say, the loan is written.
#
# **Confidence.** All sixty-seven keys in this file are translated. The
# weakest of them are «Komentario» for *feedback*, which is a loan chosen for
# want of a settled word rather than an established usage, and the four
# diagnostic headings, where «Síiʼpil» (fault, mistake) is doing the work of
# *error* and «Áantaj» (help) that of *hint*. `WCAG AA` is the name of a
# standard and stays as written, as do `%` and every `{ $variable }`.


## Answer submission

answer-checking = Táan u yilaʼal...
answer-submitting = Táan u túuxtaʼal...

answer-checking-status = Táan u yilaʼal le núukoʼ
answer-submitting-status = Táan u túuxtaʼal le núukoʼ

answer-correct = Maʼalob
answer-incorrect = Maʼ maʼalobiʼ

answer-response-saved = Tsʼoʼok u kanáantaʼal le núukoʼ

answer-percent-credit = { $percent }% kréedito
answer-percent-correct = { $percent }% maʼalob
answer-percent-short = { $percent } %

max-credit-available = U nojochil kréedito jeʼel u páajtal u kʼaʼamal: { $percent }%

attempts-remaining =
    { $count ->
        [0] minaʼan u láakʼ téenel
       *[other] { $count } téenel pʼaatal
    }

validation-correct = (Maʼalob)
validation-incorrect = (Maʼ maʼalobiʼ)
validation-partially-correct = (Chéen junjaats maʼalob)

answer-show-responses = Eʼes { $count } núuk tiʼ { $answerId }


## Disclosure panels

feedback-heading = Komentario

collapsible-click-to-open = (kʼop utiaʼal u jeʼebel)
collapsible-click-to-close = (kʼop utiaʼal u kʼaʼalal)

collapsible-initializing = Táan u káajsaʼal...

footnote-show = Eʼes le notaoʼ
footnote-hide = Taʼak le notaoʼ

description-more-information = maas informasión


## Controls

slider-previous = Paachil
slider-next = Táanil

keyboard-open = Jeʼe le teklaadooʼ
keyboard-close = Kʼal le teklaadooʼ

choice-input-remove-choice = Luʼs { $choice }

matrix-remove-row = Luʼs junpʼéel renglón
matrix-add-row = Tsʼáa junpʼéel renglón
matrix-remove-column = Luʼs junpʼéel kolumna
matrix-add-column = Tsʼáa junpʼéel kolumna

subset-add-remove-points = Tsʼáa wa luʼs puntoʼob
subset-toggle-points-intervals = Kʼex ichil puntoʼob yéetel intervaloʼob
subset-move-points = Péeks le puntoʼoboʼ
subset-clear = Luʼs tuláakal

orbital-add-row = Tsʼáa junpʼéel renglón
orbital-remove-row = Luʼs junpʼéel renglón
orbital-add-box = Tsʼáa junpʼéel kaja
orbital-remove-box = Luʼs junpʼéel kaja
orbital-add-up-arrow = Tsʼáa junpʼéel flecha kaʼanal
orbital-add-down-arrow = Tsʼáa junpʼéel flecha kabal
orbital-remove-arrow = Luʼs le flechaoʼ

orbital-row-label = Etiketa tiʼ le renglón { $row }

pretzel-answer = Núuk



## Math input

math-input-preview-region = eʼesajil ekspresión matemátika
math-input-preview = Eʼesajil
math-input-invalid-expression = Ekspresión maʼ maʼalobiʼ:


## Document status

viewer-initializing = Táan u káajsaʼal...


## Errors

error-heading = Síiʼpil

error-found-at =
    { $span ->
        [line] Kaxtaʼab tiʼ renglón { $startLine }.
       *[lines] Kaxtaʼab tiʼ renglonoʼob { $startLine }–{ $endLine }.
    }

document-contains-errors = ¡Le dokumentoaʼ yaan síiʼpiloʼob ichil!

diagnostic-heading-error = Síiʼpil
diagnostic-heading-warning = Aviso
diagnostic-heading-information = Informasión
diagnostic-heading-hint = Áantaj

accessibility-heading-level-1 = U síiʼpilil aksesibilidad tiʼ WCAG AA
accessibility-heading-level-2 = Aviso tiʼ aksesibilidad

something-went-wrong = Yaan baʼax maʼ bin utsiʼ.

renderer-load-failed = maʼ tu páajtal u káajsaʼal junpʼéel renderisador. Kaʼa káajs le páajinaoʼ.

core-start-failed = Maʼ tu páajtal u káajsaʼal le dokumentoaʼ. Kaʼa káajs le páajinaoʼ.

core-start-failed-busy = Maʼ tu páajtal u káajsaʼal le dokumentoaʼ. Yaʼabach dokumento táan u káajsaʼaloʼob junsúutuk, yéetel jeʼel u xáantal maas tiʼ junpʼéel núukul chan chaambelil. Jeʼel u páajtal u yáantaj a kaʼa káajsik le páajina ken tsʼoʼokok u káajal le uláakʼ dokumentoʼoboʼ.

core-start-failed-retry = Maʼ tu páajtal u káajsaʼal le dokumentoaʼ.

core-start-failed-busy-retry = Maʼ tu páajtal u káajsaʼal le dokumentoaʼ. Yaʼabach dokumento táan u káajsaʼaloʼob junsúutuk, yéetel jeʼel u xáantal maas tiʼ junpʼéel núukul chan chaambelil.

core-start-retry = Kaʼa túuntej

saved-state-unavailable = Maʼ tu páajtal u káajsaʼal a meyaj kanáantaʼanoʼ.
