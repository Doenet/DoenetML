# Tuvaluan (te ggana Tuvalu) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Dialect.** This file writes the **southern (Funafuti–Vaitupu)** variety,
# which is what printed and broadcast Tuvaluan is written in. The northern
# islands — Nanumea, Nanumaga, Niutao — differ in the lexicon and in the
# consonants (the northern «h» where the south has none is the most visible),
# and a reviewer from the north should expect to change words rather than
# spellings. Which dialect a catalog writes is a choice, not a default, and
# this is the choice.
#
# **Orthography.** Tuvaluan writes its **geminate consonants doubled**, and
# they are phonemic: «ggana» (language), «ttau» (must), «ttou» (our, inclusive)
# are not «gana», «tau», «tou». That is the single most visible way this file
# does not look like `locales/sm`, and a doubled letter here is spelling, not a
# typo to tidy away. **Long vowels are left unmarked**, which is the everyday
# printed practice (the Bible, government notices); Besnier's dictionary
# doubles them as well («aa», «ee»), and a reviewer who prefers that system
# should convert the whole file rather than mix the two.
#
# **Relation to `locales/sm`, said plainly.** Tuvaluan is Samoic-Outlier
# Polynesian and Samoan is its nearest catalogued relative, so this seed read
# `locales/sm` and, where Tuvaluan genuinely writes what Samoan writes, wrote
# the same thing. It is not a copy of it, and the places it parts company are
# the places to look first:
#
#   Samoan            Tuvaluan          why
#   faʻa-             faka-             Samoan's ʻ is *k, kept as k here
#   aofaʻi            aofaki            the same correspondence in a noun
#   tatau             ttau              Samoan's vowel, Tuvaluan's geminate
#   gagana            ggana             likewise
#   paʻepaʻe (white)  kena              a different word, not a sound change
#   mūmū (red)        kula              likewise
#   mafiafia (thick)  matolu            likewise
#   sesē (wrong)      sē                likewise
#
# The `faʻa-` ↔ `faka-` correspondence is regular and this file applies it as a
# productive rule; it is **not** true that every Samoan «ʻ» is a Tuvaluan «k»,
# because some of them are older glottal stops instead. Words this seed reached
# by that rule rather than by attestation are flagged where they occur.
#
# **`locales/tkl` (Tokelauan) is a sibling in this same batch**, and Tokelauan
# is closer to Tuvaluan than Samoan is. The two catalogs are *expected* to look
# alike, and their agreement is not evidence that either is right: they were
# seeded by one process from one set of inferences, so where they agree they may
# simply be wrong together. A reviewer should read each against Tuvaluan and
# Tokelauan, never against the other.
#
# **Number.** A Tuvaluan noun is not marked for number by a numeral in front of
# it — «lua poini», «lima poini», the noun does not move — so a count changes
# nothing about the word beside it. Tuvaluan *does* mark plural, but inside the
# word rather than at its edge: a family of adjectives and nouns geminates or
# reduplicates for a plural subject («matua» → «mmatua», «puli» → «ppuli»), and
# every description these messages build is of a single thing, so the singular
# is right throughout. A translator writing a message about several things has
# to reach for the other form, and no argument here would tell them to.
# `Intl.PluralRules` has no CLDR data for `tvl` and resolves against the
# runtime's default locale, so a `[two]`, `[few]` or `[many]` branch would be
# text nothing could select. Counted messages here keep only the `[0]` literal
# and a default.
#
# **No grammatical gender**, so `noun-gender` answers one token and nothing in
# these four files forks on `$gender`. **No `$role` fork** either: nothing here
# changes shape between standing alone and sitting in a clause.
#
# **Word order: the describing word follows the noun** — «laina matolu kula»,
# not «matolu kula laina» — as in `sm`, `to`, `tkl` and every other Polynesian
# catalog. See `content.ftl`, where the composition messages put it into effect.
#
# **Loans.** Tuvalu teaches mathematics and science in English from the middle
# primary grades on, and Tuvaluan takes loans readily. Where this seed could not
# establish a Tuvaluan word for a technical thing it keeps a loan and says so,
# rather than coining silently: «matematika», «poini», «laina», «koluma»,
# «palakalafa», «taimane». Tuvaluan has no /r/, so an adapted loan is spelled
# with «l» («numela», «vaioleti»). Loans left in English spelling below are the
# DoenetML identifiers, which stay English in every catalog.
#
# **Words this seed is least sure of, listed once so a reviewer can start
# here.** «kausiu» for *arrow*, «kipooti» for *keyboard*, «tapale» for *clear*,
# «funa» for *hide*, «manatu fakafoki» for *feedback*, «fakaeteete» for
# *warning*, and «kilokiloga muamua» for *preview* are this file's least
# attested choices. Each is Tuvaluan material used in a way this seed could not
# confirm is idiomatic, not an invented word.


## Answer submission

answer-checking = E siaki...
answer-submitting = E kave...
answer-checking-status = E siaki te tali
answer-submitting-status = E kave te tali
answer-correct = Tonu
answer-incorrect = Sē
answer-response-saved = Ko oti ne sefe te tali
answer-percent-credit = { $percent }% o togi
answer-percent-correct = { $percent }% tonu
answer-percent-short = { $percent }%
max-credit-available = Te togi sili e maua: { $percent }%
attempts-remaining =
    { $count ->
        [0] seai ne taumafaiga e toe
       *[other] e toe { $count } taumafaiga
    }
validation-correct = (Tonu)
validation-incorrect = (Sē)
validation-partially-correct = (Tonu se vaega)
answer-show-responses = Fakaasi tali e { $count } ki te { $answerId }

## Disclosure panels

feedback-heading = Manatu fakafoki
collapsible-click-to-open = (kiliki ke tala)
collapsible-click-to-close = (kiliki ke pono)
collapsible-initializing = E kamata...
footnote-show = Fakaasi te fakamatalaga i lalo
footnote-hide = Funa te fakamatalaga i lalo
description-more-information = nisi fakamatalaga

## Controls

slider-previous = Muamua
slider-next = Mulimuli
keyboard-open = Tala te kipooti
keyboard-close = Pono te kipooti
choice-input-remove-choice = Ave kese { $choice }
matrix-remove-row = Ave kese te laina
matrix-add-row = Fakaopoopo se laina
matrix-remove-column = Ave kese te koluma
matrix-add-column = Fakaopoopo se koluma
subset-add-remove-points = Fakaopoopo/Ave kese poini
subset-toggle-points-intervals = Sui i te va o poini mo vaitaimi
subset-move-points = Fakattele poini
subset-clear = Tapale
orbital-add-row = Fakaopoopo se laina
orbital-remove-row = Ave kese te laina
orbital-add-box = Fakaopoopo se pusa
orbital-remove-box = Ave kese te pusa
orbital-add-up-arrow = Fakaopoopo se kausiu ki luga
orbital-add-down-arrow = Fakaopoopo se kausiu ki lalo
orbital-remove-arrow = Ave kese te kausiu
orbital-row-label = Igoa mo te laina { $row }
pretzel-answer = Tali

## Math input

math-input-preview-region = kilokiloga muamua o te fakamatalaga matematika
math-input-preview = Kilokiloga muamua
math-input-invalid-expression = Fakamatalaga e se tonu:

## Document status

viewer-initializing = E kamata...

## Errors

error-heading = Mea sē
error-found-at =
    { $span ->
        [line] Ne maua i te laina { $startLine }.
       *[lines] Ne maua i laina { $startLine }–{ $endLine }.
    }
document-contains-errors = E isi ne mea sē i te pepa tenei!
diagnostic-heading-error = Mea sē
diagnostic-heading-warning = Fakaeteete
diagnostic-heading-information = Fakamatalaga
diagnostic-heading-hint = Fesoasoani
accessibility-heading-level-1 = Solitulafono ki avanoa faigofie WCAG AA
accessibility-heading-level-2 = Fakaeteete ki avanoa faigofie
something-went-wrong = Ne isi se mea ne sē.
renderer-load-failed = ne seki uta se mea fakaasi. Fakamolemole toe uta te itulau.
core-start-failed = E se mafai o kamata te pepa tenei. Fakamolemole toe uta te itulau.
core-start-failed-busy = E se mafai o kamata te pepa tenei. Ne kamata fakatasi a pepa e uke, telaa mea e fia leva ei i se masini e tuai. E mafai o fesoasoani te toe uta o te itulau kafai ko oti a isi pepa.
core-start-failed-retry = E se mafai o kamata te pepa tenei.
core-start-failed-busy-retry = E se mafai o kamata te pepa tenei. Ne kamata fakatasi a pepa e uke, telaa mea e fia leva ei i se masini e tuai.
core-start-retry = Toe taumafai
saved-state-unavailable = E se mafai o uta tau galuega ne sefe.
