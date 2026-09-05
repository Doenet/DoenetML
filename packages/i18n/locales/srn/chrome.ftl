# Sranan Tongo (Sranantongo) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** These four files are written in the **1986 official
# Surinamese orthography** for Sranan Tongo — «taki», «wan», «sma», «tu»,
# «puru», «sroto», «koloku». The older Dutch-influenced spellings, the
# pre-1986 conventions that wrote Dutch digraphs and gave the vowels their
# Dutch values, are **not used anywhere in these four files** and must not be
# mixed into them. The points where the 1986 system differs from what a
# Dutch-reading eye expects are these:
#
#   * **`u`, never «oe»**, for the /u/ vowel — «puru», «lusu», «musu»,
#     «kondre-uku». A spelling «poeroe» belongs to the older convention.
#   * **`y`, never «j»**, for the palatal glide — «yepi», «nyun», «yu». A `j`
#     does not occur in these files at all.
#   * **`dy`** for the voiced affricate — «dyamanti», «dyompo» — where the
#     older spelling wrote «dj».
#   * **`ky`** and **`gy`** for the palatalized stops, where the older
#     spelling wrote «tj» and «dj».
#   * **Vowel length is written with a single letter.** No vowel is doubled
#     for length; a doubled vowel in the older convention («oso» not «ooso»)
#     is not reproduced here.
#
# The 1986 system is a phonemic Latin orthography with **no diacritics at
# all**. Any accented character anywhere in these four files is an error.
#
# **Number.** `Intl.PluralRules("srn")` reports that there is no CLDR data of
# its own for `srn`: it resolves to `en-US` and answers `['one', 'other']`.
# Sranan Tongo marks the plural with the preposed «den» and leaves a noun
# after a numeral unmarked — «tu pisi», not a pluralized noun — so the `one`
# and `other` branches would be word-for-word identical here. Where that is
# so, this file writes **one unselected form** rather than two identical
# branches. English's explicit `[0]` literal in `attempts-remaining` matches
# the number itself, not a plural category, and is kept as a branch.
#
# **Loans, named.** Sranan Tongo takes its technical vocabulary from Dutch and
# English, and this seed keeps that rather than coining: «funksi», «vektor»,
# «komponent», «atribut», «statistik», «matriks», «kibord», «interval»,
# «krediti», «informasi», «aksesibiliteit». The grammar around them is Sranan:
# the preverbal «e / ben / sa / musu», «no» for negation, «fu» for possession
# and purpose, «na» as the copula. «Aksesibiliteit» is the weakest word in the
# file — it is an English-shaped loan for a concept Suriname discusses in
# Dutch — and is what a reviewer should look at first. The technical
# vocabulary in this file is therefore a **lexifier loan set**, Dutch- and
# English-mediated, carried in Sranan Tongo's own grammar and written in the
# 1986 orthography: these loans are the words the language actually uses, and
# the sentences built around them are Sranan, not Dutch.


## Answer submission

answer-checking = E kontroleri...
answer-submitting = E seni...

answer-checking-status = E kontroleri a piki
answer-submitting-status = E seni a piki

answer-correct = Leti
answer-incorrect = Fowtu

answer-response-saved = A piki kibri

answer-percent-credit = { $percent }% krediti
answer-percent-correct = { $percent }% leti
answer-percent-short = { $percent } %

max-credit-available = A moro hei krediti: { $percent }%

attempts-remaining =
    { $count ->
        [0] no wan proberi no tan moro
       *[other] { $count } proberi tan
    }

validation-correct = (Leti)
validation-incorrect = (Fowtu)
validation-partially-correct = (Haffu leti)

answer-show-responses = Sori { $count } piki gi { $answerId }


## Disclosure panels

feedback-heading = Komentari

collapsible-click-to-open = (klik fu opo)
collapsible-click-to-close = (klik fu tapu)

collapsible-initializing = E bigin...

footnote-show = Sori a futnota
footnote-hide = Kibri a futnota

description-more-information = moro informasi


## Controls

slider-previous = Baka
slider-next = Fesi

keyboard-open = Opo a kibord
keyboard-close = Tapu a kibord

choice-input-remove-choice = Puru { $choice }

matrix-remove-row = Puru wan rei
matrix-add-row = Poti wan rei
matrix-remove-column = Puru wan kolom
matrix-add-column = Poti wan kolom

subset-add-remove-points = Poti/Puru punt
subset-toggle-points-intervals = Kenki punt nanga interval
subset-move-points = Skoifi punt
subset-clear = Krin

orbital-add-row = Poti wan rei
orbital-remove-row = Puru wan rei
orbital-add-box = Poti wan bokisi
orbital-remove-box = Puru wan bokisi
orbital-add-up-arrow = Poti wan peiri di e go na tapu
orbital-add-down-arrow = Poti wan peiri di e go na ondro
orbital-remove-arrow = Puru a peiri

orbital-row-label = Nen gi rei { $row }

pretzel-answer = Piki



## Math input

math-input-preview-region = luku fosi fu a matematika-ekspresi
math-input-preview = Luku fosi
math-input-invalid-expression = A ekspresi no bun:


## Document status

viewer-initializing = E bigin...


## Errors

error-heading = Fowtu

error-found-at =
    { $span ->
        [line] Feni na lin { $startLine }.
       *[lines] Feni na lin { $startLine }–{ $endLine }.
    }

document-contains-errors = A dokumenti disi abi fowtu na ini!

diagnostic-heading-error = Fowtu
diagnostic-heading-warning = Warskow
diagnostic-heading-information = Info
diagnostic-heading-hint = Tipi

accessibility-heading-level-1 = WCAG AA aksesibiliteit-fowtu
accessibility-heading-level-2 = Aksesibiliteit-warskow

something-went-wrong = Wan sani go fowtu.

renderer-load-failed = wan renderer no ben man lai. Grantangi, lai a blad baka.

core-start-failed = A dokumenti disi no ben man bigin. Grantangi, lai a blad baka.

core-start-failed-busy = A dokumenti disi no ben man bigin. Someni dokumenti ben e bigin na a srefi ten, en dati kan teki moro langa tapu wan moro safri masyin. Te den tra dokumenti kaba, dan a kan yepi fu lai a blad baka.

core-start-failed-retry = A dokumenti disi no ben man bigin.

core-start-failed-busy-retry = A dokumenti disi no ben man bigin. Someni dokumenti ben e bigin na a srefi ten, en dati kan teki moro langa tapu wan moro safri masyin.

core-start-retry = Proberi baka

saved-state-unavailable = A wroko di yu ben kibri no ben man lai.
