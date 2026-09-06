# Pohnpeian (lokaiahn Pohnpei) viewer chrome, Latin script. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# ORTHOGRAPHY. This catalog writes the **standard Pohnpeian orthography** — the
# one settled in the 1980s and used in the Pohnpeian–English Dictionary and in
# the schools of Pohnpei State. Its digraphs are part of the spelling and are
# never to be "simplified": `ng` is one letter, `oa` is one vowel, and `mw` and
# `pw` are the velarized labials that distinguish «mwahu» from «mahu» and
# «pwung» from «pung». A following `h` marks a long vowel — «mehlel», «pwuhk»,
# «kohdi» — and is not a consonant. The letters `b`, `c`, `f`, `g`, `j`, `q`,
# `v`, `x` and `z` are not part of the alphabet, so every loan below is
# respelled: English *blue* is «pluh», *green* is «kirihn», *credit* is
# «kredit». A `b` or an `f` anywhere in this file is a bug, not a variant.
#
# REGISTER. Pohnpeian has an elaborate honorific vocabulary (the *meing*
# speech) used to and about title-holders and the paramount chiefs. **This
# catalog is written entirely in the common, non-honorific register.** An
# interface addressing a student is not addressing a Nahnmwarki, and honorific
# forms here would be both wrong and, in Pohnpeian terms, presumptuous. So this
# file has «kilang» and not «mahsanih», «kang» and not «sak», «pasapeng» and
# not the honorific replies. A reviewer should not "improve" any of it upward.
#
# NO GENDER. Pohnpeian has no grammatical gender, so `content.ftl` answers
# `noun-gender` with one token and no adjective here or there forks on it.
#
# NUMBER, AND THE CLASSIFIER THAT CANNOT BE WRITTEN. Pohnpeian does not mark a
# noun for number after a numeral, so no message below needs a plural branch
# for the noun's sake. What it does have is a large system of numeral
# classifiers, and the classifier is **fused into the numeral itself** —
# «ehu», «riau», «siluh» for general things, «emen», «riemen» for animates,
# «apwoat», «riapwoat» for long things, «apali» for sides. A count that arrives
# as `{ $count }` is a placeable, so there is no numeral for the classifier to
# fuse with, and the catalog cannot choose one: this is exactly the
# "an affix cannot be welded to a placeable" case, reached through a
# classifier rather than a case ending. Every counted message below therefore
# writes the bare numeral after its noun, which is what Pohnpeian writing does
# with digits, and no `{ $count }` here carries a classifier. That is a real
# loss and it is recorded rather than papered over.
#
# `Intl.PluralRules("pon")` has no CLDR data and resolves against the runtime's
# default locale, so a `[two]`, `[few]` or `[many]` branch here would be text
# nothing could select. Only `[0]` — matched numerically, and always safe — is
# written, in `attempts-remaining`, where "none" wants «sohte» rather than a
# numeral. `answer-show-responses` drops its select entirely: both English
# branches differ only in the noun's number, which Pohnpeian does not mark, so
# a fork there would write one string twice.
#
# WORD ORDER. Pohnpeian is verb-medial and **head-initial**: a describing word
# follows the noun it describes («lain weitahta», a red line), which is the
# order `content.ftl`'s composition messages are built on. This catalog agrees
# with `locales/sm` and `locales/to` about that, and expects the sibling
# Micronesian catalogs of this batch — `mh`, `chk`, `kos` and `gil` — to agree
# too; all five are head-initial Oceanic languages and a prenominal
# description in any of them would be worth a second look.
#
# VOCABULARY THAT NEEDS A SPEAKER. «kaweid» does the work of three English
# words in these files — *feedback* here, *hint* as «kisin kaweid», and
# *recommendation* in `editor.ftl` — because this seed could not find three
# separate Pohnpeian words for them. That is the first thing to fix.
# «kredit» (credit), «kihpohd» (keyboard), «kolum» (column), «arro» (arrow),
# «pohs» (box) and «statistik» are English loans respelled, not attested
# Pohnpeian technical terms. «kak en pedolong» — literally "the ability to
# enter" — is this seed's coinage for *accessibility*, built from ordinary
# words by the language's own means; a speaker should confirm or replace it.
# «mehn kasale» is the *renderer* and «mehn kilang» the *viewer*; the two are
# deliberately different words, since the reader meets both.


## Answer submission

answer-checking = Kasawih...
answer-submitting = Kadarala...
answer-checking-status = Kasawih pasapeng
answer-submitting-status = Kadarala sapeng
answer-correct = Pwung
answer-incorrect = Sapwung
answer-response-saved = Sapeng nekidla
answer-percent-credit = { $percent }% en kredit
answer-percent-correct = { $percent }% pwung
answer-percent-short = { $percent } %
max-credit-available = Kredit laud me mie: { $percent }%
# «song» is a try or an attempt. The numeral stands bare after it: see the
# classifier note in the header.
attempts-remaining =
    { $count ->
        [0] sohte song luhwehdi
       *[other] song { $count } luhwehdi
    }
validation-correct = (Pwung)
validation-incorrect = (Sapwung)
validation-partially-correct = (Pwung ekis)
# No select: the two English branches differ only in the number of the noun,
# which Pohnpeian does not mark. The count still arrives and is still
# formatted; only the branching is gone.
answer-show-responses = Kasalehda sapeng { $count } ong { $answerId }

## Disclosure panels

feedback-heading = Kaweid
collapsible-click-to-open = (klik pwen ritingada)
collapsible-click-to-close = (klik pwen ritingedi)
collapsible-initializing = Tepida...
footnote-show = Kasalehda kisin nting pah
footnote-hide = Karirihla kisin nting pah
description-more-information = rohng laud

## Controls

slider-previous = Mwohn
slider-next = Mwuri
keyboard-open = Ritingada kihpohd
keyboard-close = Ritingedi kihpohd
choice-input-remove-choice = Kihsang { $choice }
matrix-remove-row = Kihsang irek
matrix-add-row = Kapataiong irek
matrix-remove-column = Kihsang kolum
matrix-add-column = Kapataiong kolum
subset-add-remove-points = Kapataiong/Kihsang poahn
subset-toggle-points-intervals = Wekidala nanpwungen poahn oh interwal
subset-move-points = Kamwakid poahn
subset-clear = Kamwakelekel
orbital-add-row = Kapataiong irek
orbital-remove-row = Kihsang irek
orbital-add-box = Kapataiong pohs
orbital-remove-box = Kihsang pohs
orbital-add-up-arrow = Kapataiong arro kohda
orbital-add-down-arrow = Kapataiong arro kohdi
orbital-remove-arrow = Kihsang arro
orbital-row-label = Kilel ong irek { $row }
pretzel-answer = Pasapeng

## Math input

math-input-preview-region = kasalepen mahsen en mahd
math-input-preview = Kasalepe
math-input-invalid-expression = Mahsen sapwung:

## Document status

viewer-initializing = Tepida...

## Errors

error-heading = Sapwung
error-found-at =
    { $span ->
        [line] Diarek nan lain { $startLine }.
       *[lines] Diarek nan lain { $startLine }–{ $endLine }.
    }
document-contains-errors = Doakumend wet mie sapwung loale!
diagnostic-heading-error = Sapwung
diagnostic-heading-warning = Kehkehlik
diagnostic-heading-information = Rohng
diagnostic-heading-hint = Kisin kaweid
accessibility-heading-level-1 = Kauwehla en WCAG AA en kak en pedolong
accessibility-heading-level-2 = Kehkehlik en kak en pedolong
something-went-wrong = Mie mehkot sapwungla.
renderer-load-failed = mehn kasale ehu sohte kak audehda. Menlau pwurehng audehda pali wet.
core-start-failed = Doakumend wet sohte kak tepida. Menlau pwurehng audehda pali wet.
core-start-failed-busy = Doakumend wet sohte kak tepida. Doakumend tohto me tepida ni ahnsou tehieu, oh met kak pwandala nan dipwisou me pwand. Pwurehng audehda pali wet mwurin doakumend teiko ar kanekehla, met kak sewese.
core-start-failed-retry = Doakumend wet sohte kak tepida.
core-start-failed-busy-retry = Doakumend wet sohte kak tepida. Doakumend tohto me tepida ni ahnsou tehieu, oh met kak pwandala nan dipwisou me pwand.
core-start-retry = Song pwurehng
saved-state-unavailable = Omw doadoahk me nekidla sohte kak audehda.
