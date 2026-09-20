# Emilian (emiliàn) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **`egl` is the Emilian half.** The tag most often seen in the wild, `eml`,
# is a macrolanguage that lumps Emilian together with **Romagnol** (`rgn`),
# which is a different language with a different vowel system and a different
# written tradition. This catalog is `egl` and is Emilian only: a Romagnol
# reader would find it foreign, and a Romagnol deployment supplies its own
# catalog as `localeResources` rather than correcting this one.
#
# **Variety and orthography.** Latin script, and the variety is **Bolognese**
# (bulgnaiṡ), written in the modern lexicographic orthography of Daniele
# Vitali and Luigi Lepri — the spelling of the «Dizionario Bolognese-Italiano
# Italiano-Bolognese» and of the Bolognese teaching materials that follow it.
# Modenese, Reggiano, Parmigiano, Piacentino and Ferrarese are all Emilian and
# all differ from it; correcting this file toward one of them sentence by
# sentence would leave it in two orthographies at once.
#
# The marks are letters, not decoration:
#   * **«â ê î ô û»** mark a long vowel and distinguish words;
#   * **«å»** is a vowel of its own, the sound of «bån», and is never a plain
#     «a» or «o»;
#   * **«ä»** writes the vowel before a nasal («pän», «bän») and is not an «a»
#     with a mark on it;
#   * **«ç»** is voiceless [s] against voiced **«ṡ»** [z], and «ż» is the
#     voiced affricate; the three are not interchangeable.
# A corrector who strips them is writing different words. Digits render in
# Latin numerals in every locale, so any digit inside prose here is Latin.
#
# **What is Emilian's own and what is borrowed.** The negator, the connectives
# and the everyday verbs are Bolognese and are what makes these lines Emilian
# rather than Italian in Bolognese spelling: the two-part negation **«an …
# brîṡa»** («an n é brîṡa vàlid»), the obligatory subject clitic before a
# finite verb («a cuntrôl», «al é», «i én», «ai é» for *there is*), the past
# participle in **«-è»** / feminine **«-èda»** («mandè», «salvè», «mandèda»),
# «brîṡa» for *not*, «inción» for *none*, «truvè» for *found*, «vàdder» for
# *to see*. The **mathematical and computing nouns** — «vetåur», «poligon»,
# «funziån», «matrîz», «antiprîma», «viṡualiżadåur» — are the international
# technical register given Bolognese phonology and spelling, which is what
# Vitali's own dictionary does with them. Emilian has no standardized technical
# terminology of its own and its speakers are schooled in **Italian**, so that
# is the register those nouns come from; naming it is the point of this seed
# rather than something to disguise.
#
# **Counts.** CLDR has **no** plural rules for `egl`:
# `Intl.PluralRules("egl")` resolves to the runtime's default locale, so a
# `zero`, `two`, `few` or `many` branch in these files would be selected by
# some other language's rules. **None appears anywhere.** `[one]`/`*[other]`
# is kept, and only that, because the split the fallback happens to make — 1
# against everything else — is the split Bolognese needs too: the feminine
# plural is a real ending here («la rispòsta» → «äl rispòst») and the verb
# beside a masculine noun changes even where the noun itself does not. `[0]` is
# matched against the number itself, not against a category, and stays legal.
#
# **Weakest first.** A reviewer should attack (1) the imperatives — «Mòstra»,
# «Prêm», «Żónta», «Câva» — and (2) any sentence with no «an … brîṡa» and no
# subject clitic, which is where an Italian frame has most likely survived
# under Bolognese words.


## Answer submission

answer-checking = A cuntrôl…
answer-submitting = A mand…
answer-checking-status = A cuntrôl la rispòsta
answer-submitting-status = A mand la rispòsta
answer-correct = Giósst
answer-incorrect = Ṡbaglè
answer-response-saved = Rispòsta salvèda
answer-percent-credit = { $percent }% ed pónt
answer-percent-correct = { $percent }% giósst
answer-percent-short = { $percent } %
max-credit-available = Pónt màssim che as pôlen ciapèr: { $percent }%
attempts-remaining =
    { $count ->
        [0] inción tentatîv ch'al resta
        [one] { $count } tentatîv ch'al resta
       *[other] { $count } tentatîv ch'i restan
    }
validation-correct = (Giósst)
validation-incorrect = (Ṡbaglè)
validation-partially-correct = (In pèrt giósst)
answer-show-responses =
    { $count ->
        [one] Mòstra { $count } rispòsta a { $answerId }
       *[other] Mòstra { $count } rispòst a { $answerId }
    }

## Disclosure panels

feedback-heading = Cumänt
collapsible-click-to-open = (prêm par avrîr)
collapsible-click-to-close = (prêm par serrèr)
collapsible-initializing = As và in mòt…
footnote-show = Mòstra la nòta a pî ed pàgina
footnote-hide = Scundé la nòta a pî ed pàgina
description-more-information = pió informaziån

## Controls

slider-previous = Prémma
slider-next = Dåpp
keyboard-open = Âvra la tastîra
keyboard-close = Sèra la tastîra
choice-input-remove-choice = Câva { $choice }
matrix-remove-row = Câva na rîga
matrix-add-row = Żónta na rîga
matrix-remove-column = Câva na colòna
matrix-add-column = Żónta na colòna
subset-add-remove-points = Żónta / câva pónt
subset-toggle-points-intervals = Câmbia tra pónt e intervâl
subset-move-points = Móv i pónt
subset-clear = Natèzza
orbital-add-row = Żónta na rîga
orbital-remove-row = Câva na rîga
orbital-add-box = Żónta na caṡèla
orbital-remove-box = Câva na caṡèla
orbital-add-up-arrow = Żónta na frazza in só
orbital-add-down-arrow = Żónta na frazza in ṡå
orbital-remove-arrow = Câva la frazza
orbital-row-label = Etichèta pr la rîga { $row }
pretzel-answer = Rispòsta

## Math input

math-input-preview-region = antiprîma dl'esprasiån matemâtica
math-input-preview = Antiprîma
math-input-invalid-expression = Esprasiån brîṡa vàlida:

## Document status

viewer-initializing = As và in mòt…

## Errors

error-heading = Erôr
error-found-at =
    { $span ->
        [line] Truvè int la rîga { $startLine }.
       *[lines] Truvè int äl rîg { $startLine }–{ $endLine }.
    }
document-contains-errors = Ste documänt qué al à dänter di erôr!
diagnostic-heading-error = Erôr
diagnostic-heading-warning = Avîṡ
diagnostic-heading-information = Informaziån
diagnostic-heading-hint = Cunsélli
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Violaziån d'acesibilitè WCAG AA
accessibility-heading-level-2 = Avîṡ d'acesibilitè
something-went-wrong = Quèl l'é andè stòrt.
renderer-load-failed = un mòdul ed viṡualiżaziån an s é brîṡa cariè. Tåurna a carièr la pàgina.
core-start-failed = An s pôl brîṡa fèr partîr ste documänt. Tåurna a carièr la pàgina.
core-start-failed-busy = An s pôl brîṡa fèr partîr ste documänt. Pió documént i partîven insàmm, e só na mâchina pió länta quasst al pôl tirèr pió a lóng. Turnèr a carièr la pàgina al pôl ajutèr quand ch'i èter documént i an finé.
core-start-failed-retry = An s pôl brîṡa fèr partîr ste documänt.
core-start-failed-busy-retry = An s pôl brîṡa fèr partîr ste documänt. Pió documént i partîven insàmm, e só na mâchina pió länta quasst al pôl tirèr pió a lóng.
core-start-retry = Prôva ancåura
saved-state-unavailable = An s pôl brîṡa carièr al tô lavurîr salvè.
