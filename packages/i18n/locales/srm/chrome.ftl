# Saramaccan (Saamáka tongo), the Maroon creole of the upper Suriname River.
# Viewer chrome, translated from `locales/en/chrome.ftl`, which is the source
# of truth: `lint:i18n` rejects a key that does not exist there, and reports a
# key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The **standard Saramaccan orthography** of the Rountree /
# Glock dictionary and of the Saramaccan scriptures. Its points:
#
#   * **Seven vowel letters** — `a e ë i o ö u`. `ë` (U+00EB) and `ö`
#     (U+00F6) are the open-mid vowels and are letters of the alphabet, not
#     decorations on `e` and `o`.
#   * **A doubled vowel writes length** — «puu» (*take out*), «hii» (*all*),
#     «kiin» (*clean*), «gaan» (*big*), «baaka» (*black*), «wooko» (*work*).
#   * **Nasality is written with an `n` after the vowel** — «an», «en», «in»,
#     «on», «un» — and that `n` is part of the vowel, not a consonant of its
#     own.
#   * **Prenasalized stops are written `mb`, `nd`, `ng`**; `tj` and `dj` are
#     the palatal affricates.
#   * **Initial `h`** where the eastern creoles have none: «hopo» (*open*),
#     «hakisi» (*ask*), «hii», «hën», «hesi». This is one of the clearest
#     marks that a line is Saramaccan and not Ndyuka.
#
# **Tone is NOT written in this catalog, and that is a real loss.** Saramaccan
# is a tone language: the dictionary and the scriptures mark tone with
# accents, and tone distinguishes words that are otherwise spelled alike. This
# seed leaves tone unmarked throughout all four files. A reviewer restoring it
# is restoring information these files do not carry, not correcting a
# misspelling. The one accented letter outside `ë` and `ö` is **«á», the
# preverbal negator** — «wi á sa luku» *we cannot look* — which is written
# with its accent because that is how the negator is spelled, not as a tone
# mark this file otherwise omits.
#
# **Saramaccan is Portuguese- as well as English-lexified**, and this catalog
# keeps the Portuguese-derived stratum where the language has it: «manda»
# (*send*, *mandar*), «kaba» (*finish*, *acabar*), «alanza» (*orange*,
# *laranja*), «sikifi» (*write*, *escrever*), «pooba» (*try*, *provar*),
# «buka» (*word*, *boca*), «kuma» (*like*, *como*), «ku» (*and*, *com*),
# «ezempu» (*example*, *exemplo*). It is not an English creole with Portuguese
# spellings sprinkled in.
#
# **Grammar.** Saramaccan grammar carries every sentence. The preverbal
# markers are **«ta» (imperfective), «bi» (past), «o» (future), «sa» (able),
# «musu» (must)** — «ta», not the eastern «e», and «bi», not «be»; the
# negator «á» stands in front of them; «ku» is *and* and *with*; «u» / «fu» is
# the purposive; «dee» is the plural and «di» the definite article. Ndyuka, in
# `locales/djk`, is a different language with a different marker set, and
# these are not two spellings of one text: an «e» or a «be» in this file is a
# bug.
#
# **Number.** `Intl.PluralRules("srm")` has **no CLDR data for `srm`**: it
# falls back and answers `['one', 'other']`, which is English's answer and not
# a fact about Saramaccan. A Saramaccan noun after a numeral is unmarked —
# «tu pooba», never a pluralized noun; the plural is the preposed «dee», used
# for definiteness rather than for counting. So the `one` and `other` branches
# would be word-for-word identical, and where that is so this file writes
# **one unselected form**. English's explicit `[0]` literal in
# `attempts-remaining` matches the number itself, not a plural category, and
# is kept.
#
# **Loans.** The computing register is Dutch and English, reshaped to
# Saramaccan phonology and carried in Saramaccan grammar: «kiibolo»
# (*keyboard*), «punti» (*point*, and the score word here), «statistika»,
# «matematika», «ekispesi» (*expression*), «dokumenti», «infoomasi»,
# «pagina», «masini», «futunota», «vekitoo», «funsi», «renderer» (left as the
# code's own name), «WCAG» and «aksesibiliteiti».
#
# **Confidence.** Saramaccan has a dictionary, a full scripture translation
# and almost no written technical prose, so the loans above are shapes this
# seed derived from Saramaccan phonology rather than usage it found. The
# grammar, the h-initials and the Portuguese stratum are the part to trust.
# Nothing here was left in English.


answer-checking = Ta luku...
answer-submitting = Ta manda...

answer-checking-status = Ta luku di piki
answer-submitting-status = Ta manda di piki

answer-correct = Leti
answer-incorrect = Fowtu

answer-response-saved = Di piki kibi kaba

answer-percent-credit = { $percent }% punti
answer-percent-correct = { $percent }% leti
answer-percent-short = { $percent } %

max-credit-available = Di möön hei punti: { $percent }%

attempts-remaining =
    { $count ->
        [0] na wan pooba á tan möön
       *[other] { $count } pooba tan
    }

validation-correct = (Leti)
validation-incorrect = (Fowtu)
validation-partially-correct = (Wan pisi leti)

answer-show-responses = Lei { $count } piki da { $answerId }


feedback-heading = Piki u di wooko

collapsible-click-to-open = (kiliki u hopo)
collapsible-click-to-close = (kiliki u tapa)

collapsible-initializing = Ta bigi...

footnote-show = Lei di futunota
footnote-hide = Kibi di futunota

description-more-information = möön infoomasi


slider-previous = Baka
slider-next = Fesi

keyboard-open = Hopo di kiibolo
keyboard-close = Tapa di kiibolo

choice-input-remove-choice = Puu { $choice }

matrix-remove-row = Puu wan lo
matrix-add-row = Buta wan lo
matrix-remove-column = Puu wan kolon
matrix-add-column = Buta wan kolon

subset-add-remove-points = Buta/Puu punti
subset-toggle-points-intervals = Kambia punti ku intavalu
subset-move-points = Seke dee punti
subset-clear = Kiin

orbital-add-row = Buta wan lo
orbital-remove-row = Puu wan lo
orbital-add-box = Buta wan bokisi
orbital-remove-box = Puu wan bokisi
orbital-add-up-arrow = Buta wan peli di ta go a hei
orbital-add-down-arrow = Buta wan peli di ta go a basu
orbital-remove-arrow = Puu di peli

orbital-row-label = Nen da lo { $row }

pretzel-answer = Piki



math-input-preview-region = luku fosu u di matematika-ekispesi
math-input-preview = Luku fosu
math-input-invalid-expression = Di ekispesi á bunu:


viewer-initializing = Ta bigi...


error-heading = Fowtu

error-found-at =
    { $span ->
        [line] Feni a lin { $startLine }.
       *[lines] Feni a lin { $startLine }–{ $endLine }.
    }

document-contains-errors = Di dokumenti aki abi fowtu a dendu!

diagnostic-heading-error = Fowtu
diagnostic-heading-warning = Wakiman-buka
diagnostic-heading-information = Info
diagnostic-heading-hint = Tipi

accessibility-heading-level-1 = WCAG AA aksesibiliteiti-fowtu
accessibility-heading-level-2 = Aksesibiliteiti-buka

something-went-wrong = Wan soni go fowtu.

renderer-load-failed = wan renderer á sa lai. Gaantangi, lai di pagina baka.

core-start-failed = Di dokumenti aki á sa bigi. Gaantangi, lai di pagina baka.

core-start-failed-busy = Di dokumenti aki á sa bigi. Sömëni dokumenti bi ta bigi a wan pisi ten, nöö a sa tei möön longi a wan safi masini. Te dee woto dokumenti kaba, nöö a sa heepi ee i lai di pagina baka.

core-start-failed-retry = Di dokumenti aki á sa bigi.

core-start-failed-busy-retry = Di dokumenti aki á sa bigi. Sömëni dokumenti bi ta bigi a wan pisi ten, nöö a sa tei möön longi a wan safi masini.

core-start-retry = Pooba baka

saved-state-unavailable = Di wooko di i bi kibi á sa lai.
