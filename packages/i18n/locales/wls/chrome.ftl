# Wallisian (Fakaʻuvea) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **The language names itself «Fakaʻuvea»**, after ʻUvea, the island French
# calls Wallis. That endonym is written here letter for letter — F-a-k-a-ʻ-u-v-e-a,
# with the ʻokina after «Faka» and no macron anywhere in it — because CLDR has
# **no name for `wls` in any language at all**, so the roster cannot derive one
# and `LOCALE_NAME_FALLBACKS` in `scripts/catalogUtils.ts` has to be given the
# name by hand: `englishName` "Wallisian", `endonym` "Fakaʻuvea". This is the
# `nah` situation with an answer rather than a shrug — see "A language CLDR has
# no name for" in the README. Without that entry `<document lang>`'s
# autocomplete offers a reader the four letters "wls" and nothing else.
#
# **Orthography.** This file writes the **standard ʻUvean spelling** used by
# Rensch's *Tikisionalio Fakaʻuvea-Fakafalani* and by the Church and school
# materials printed on the island. Three things are part of the spelling and
# not decoration:
#   * the glottal stop is written **«ʻ»** — U+02BB MODIFIER LETTER TURNED
#     COMMA, a letter of the alphabet, never U+0027 and never a typographic
#     quote. It distinguishes words, and the two render alike and compare
#     unequal;
#   * vowel length is written with the **macron**, «ā ē ī ō ū»;
#   * **/ŋ/ is written «g»**, a single letter. This is the loudest place
#     Wallisian parts company with Tongan in print: where `locales/to` writes
#     «ngāue», «ngaahi», «fakatokanga», this file writes **«gāue»,
#     «fakatokaga»** and uses «te ʻu» for the plural article. A corrector who
#     "fixes" a «g» to «ng» is converting the file to Tongan spelling.
#
# **Wallisian is Polynesian and its nearest large sibling is Tongan**, so
# `locales/to` was read line by line while this was written. Where the two
# genuinely share a word, this file writes it (with ʻUvean spelling): «tali»
# answer, «totonu» correct, «hala» wrong, «fakahā» show, «fufū» hide, «toʻo»
# remove, «tānaki» add, «fakamaʻa» clear, «laina» line/row, «vahe» section.
# Where Wallisian differs, it differs here too, and these are the differences a
# reviewer should check first:
#
#   | English            | `locales/to` | this file    |
#   | ------------------ | ------------ | ------------ |
#   | non-past marker    | ʻoku         | **ʻe**       |
#   | past marker        | naʻe         | **neʻe**     |
#   | plural article     | ngaahi       | **te ʻu**    |
#   | object marker      | ʻa e         | **te**       |
#   | not                | ʻikai        | **mole**     |
#   | more               | ange         | **age**      |
#   | open (a panel)     | fakaava      | **avahi**    |
#   | /ŋ/ spelled        | ng           | **g**        |
#
# A Wallisian catalog that merely respelled Tongan would be a failure, and the
# table above is where this one stakes the claim that it is not.
#
# **The contact language is French, not English** — ʻUvea is a French overseas
# collectivity, schooling is French-medium, and the loans in everyday Wallisian
# come through French. So where a technical word here is a loan it is the
# **French-mediated** one, which is the second systematic difference from
# `locales/to`, whose loans come through English:
#
#   | English   | French     | this file      | `locales/to` (English-mediated) |
#   | --------- | ---------- | -------------- | ------------------------------- |
#   | table     | tableau    | **tapelo**     | tēpile                          |
#   | page      | page       | **pasina**     | peesi                           |
#   | column    | colonne    | **kolone**     | kolomu                          |
#   | keyboard  | clavier    | **kalavie**    | kīpoti                          |
#   | note      | note       | **nota**       | nouti                           |
#   | problem   | problème   | **polopelema** | palopalema                      |
#   | theorem   | théorème   | **teoleme**    | tioleme                         |
#   | cascade   | cascade    | **kasikate**   | kasikeiti                       |
#   | paragraph | paragraphe | **palakalafe** | palakalafa                      |
#   | violet    | violet     | **violeti**    | vaioleti                        |
#
# Every one of those is a coinage of this seed by the ordinary loan phonology
# (no consonant clusters, every syllable open, French /ʒ/ → «s», /ʁ/ → «l») and
# is flagged as such: a reviewer who knows the word ʻUvea actually uses should
# replace it, and needs no permission to.
#
# **Number.** A Wallisian noun is not marked for number beside a numeral —
# plurality is «te ʻu» before the noun, and a numeral does not take it — so a
# `{ $count -> … }` whose two English branches differ **only** in the noun's
# number renders one string here and the select is dropped, exactly as
# `locales/to` and `locales/sm` do. A `[0]` branch stays wherever English has
# one, because it names none rather than counting; `[0]` is matched
# numerically and is always safe. `Intl.PluralRules("wls")` has no CLDR data
# and resolves against the runtime's default locale, so no `[two]`, `[few]` or
# `[many]` branch appears anywhere in these four files: nothing could select
# one.
#
# **No grammatical gender** and **no `$role` fork** — see `content.ftl`, where
# both decisions are recorded beside the words they govern.
#
# **Known residue.** English's politeness formula ("Please reload the page") is
# written here as a plain imperative, because this seed could not establish the
# Wallisian request formula with enough confidence to put it in front of a
# reader. That is a gap, not a stylistic choice.


## Answer submission

answer-checking = ʻE sivi…
answer-submitting = ʻE ʻave…
answer-checking-status = ʻE sivi te tali
answer-submitting-status = ʻE ʻave te tali
answer-correct = Totonu
answer-incorrect = Hala
answer-response-saved = Kua taupau te tali
# «poini» here is a mark of credit, from French «point». The geometric point is
# a different word in these files — «togi» — and the split is deliberate; see
# the `noun` table in `content.ftl`.
answer-percent-credit = { $percent }% poini
answer-percent-correct = { $percent }% totonu
answer-percent-short = { $percent } %
max-credit-available = Poini lahi ʻe lava ke maʻu: { $percent }%
# No select: «faiga» is the same word for one attempt and for many. The `[0]`
# branch stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] mole kei ʻi ai he faiga
       *[other] ʻe kei ʻi ai te faiga ʻe { $count }
    }
validation-correct = (Totonu)
validation-incorrect = (Hala)
validation-partially-correct = (Totonu fakakoga)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Fakahā te tali ʻe { $count } ki te { $answerId }

## Disclosure panels

# «Fakamatala fakafoki», an explanation given back — a coinage of this seed, so
# that feedback and the `Info` heading below do not come out as one word.
feedback-heading = Fakamatala fakafoki
collapsible-click-to-open = (lomi ke avahi)
collapsible-click-to-close = (lomi ke tāpuni)
collapsible-initializing = ʻE kamata…
footnote-show = Fakahā te nota ʻi lalo
footnote-hide = Fufū te nota ʻi lalo
description-more-information = fakamatala lahi age

## Controls

slider-previous = Muʻa
slider-next = Hoko
keyboard-open = Avahi te kalavie
keyboard-close = Tāpuni te kalavie
choice-input-remove-choice = Toʻo te { $choice }
matrix-remove-row = Toʻo te laina
matrix-add-row = Tānaki he laina
matrix-remove-column = Toʻo te kolone
matrix-add-column = Tānaki he kolone
subset-add-remove-points = Tānaki/Toʻo te ʻu togi
subset-toggle-points-intervals = Fetogi te ʻu togi mo te ʻu vahaʻa
subset-move-points = Hiki te ʻu togi
subset-clear = Fakamaʻa
orbital-add-row = Tānaki he laina
orbital-remove-row = Toʻo te laina
orbital-add-box = Tānaki he puha
orbital-remove-box = Toʻo te puha
orbital-add-up-arrow = Tānaki he gahau ki ʻoluga
orbital-add-down-arrow = Tānaki he gahau ki lalo
orbital-remove-arrow = Toʻo te gahau
orbital-row-label = Fakaʻiloga ki te laina { $row }
pretzel-answer = Tali

## Math input

math-input-preview-region = fakahā muʻa ʻo te fakamatala fika
math-input-preview = Fakahā muʻa
math-input-invalid-expression = Fakamatala fika hala:

## Document status

viewer-initializing = ʻE kamata…

## Errors

error-heading = Hala
error-found-at =
    { $span ->
        [line] Neʻe maʻu ʻi te laina { $startLine }.
       *[lines] Neʻe maʻu ʻi te ʻu laina { $startLine }–{ $endLine }.
    }
document-contains-errors = ʻE ʻi ai te ʻu hala ʻi te pepa nei!
diagnostic-heading-error = Hala
diagnostic-heading-warning = Fakatokaga
diagnostic-heading-information = Fakamatala
diagnostic-heading-hint = Fakahinohino
accessibility-heading-level-1 = Maumauʻi ʻo te aʻusia WCAG AA
accessibility-heading-level-2 = Fakatokaga ki te aʻusia
something-went-wrong = Neʻe ʻi ai he meʻa neʻe hala.
renderer-load-failed = neʻe mole lava ke hū mai he renderer. Toe fakaake te pasina.
core-start-failed = Neʻe mole lava ke kamata te pepa nei. Toe fakaake te pasina.
core-start-failed-busy = Neʻe mole lava ke kamata te pepa nei. Neʻe kamata fakatahi te ʻu pepa e lahi, pea ʻe fualoa age ʻi he masini tuai. ʻE lava ke ʻaoga te toe fakaake ʻo te pasina ʻi te ʻosi ʻo te ʻu pepa ʻaē.
core-start-failed-retry = Neʻe mole lava ke kamata te pepa nei.
core-start-failed-busy-retry = Neʻe mole lava ke kamata te pepa nei. Neʻe kamata fakatahi te ʻu pepa e lahi, pea ʻe fualoa age ʻi he masini tuai.
core-start-retry = Toe faiga
saved-state-unavailable = Neʻe mole lava ke hū mai tau gāue neʻe taupau.
