# Bislama viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Bislama is the batch's only contact language**, and that changes what a
# reviewer can check. It is the English-lexified creole of Vanuatu and one of
# that country's three official languages, so **its technical vocabulary is
# English-derived by nature**: «laen», «poen», «namba», «kolam», «bokis» are
# Bislama words that a speaker uses in Bislama sentences, not English left
# untranslated. The usual "grep the file for stray English" check therefore
# **cannot be run on this catalog** — it would flag the language itself. What
# was checked instead, message by message:
#   1. every message carries the predicate marker «i» where Bislama requires
#      one, which an untranslated English string never does;
#   2. every transitive verb carries «-em»/«-im»/«-um» (see below), which an
#      English verb never does;
#   3. the function words are Bislama throughout — «blong», «long», «wetem»,
#      «mo», «we», «oli», «bambae» — and those are what a sentence is built
#      from;
#   4. the DoenetML identifiers that must stay English (`WCAG`, tag and
#      attribute names) are listed in `diagnostics.ftl`'s header and were
#      checked against the English file rather than by eye.
# A reviewer who wants one check that works: **read a message aloud.** If it
# parses as Bislama it is Bislama; if it parses as English it is a residue.
#
# **Orthography.** The standard Vanuatu orthography — the one of the Bislama
# Bible, of Crowley's dictionary and of Vanuatu's official publications. It is
# phonemic, and it differs from Tok Pisin's in ways that are visible in almost
# every line here:
#   * the diphthongs are written «ae» and «ao», not «ai»/«au»: «faenem»,
#     «laen», «taem», «daon», «raon» (Tok Pisin: «painim», «lain», «taim»,
#     «daun», «raun»);
#   * Bislama keeps «f» and «v» as separate letters where Tok Pisin has «p»:
#     «finis», «faenem», «fes», «vekta» (Tok Pisin: «pinis», «painim», «pes»);
#   * the possessive is «blong», with no medial vowel (Tok Pisin: «bilong»).
# These are spelling facts, not stylistic ones. A reviewer should not
# "normalize" them towards Tok Pisin.
#
# **`locales/tpi` is this catalog's nearest sibling, and the resemblance is not
# evidence.** Tok Pisin and Bislama are both Melanesian pidgins descended from
# nineteenth-century Pacific plantation jargon, so a great deal of this file
# looks like that one — and where it legitimately does, it is because the two
# languages really do share the word: «long», «ol», «i», «no», «gat», «stap»,
# «finis», «tru», «giaman», «bokis», «wok», «nem». Where they differ, they
# differ:
#
#   | meaning              | Bislama (here)   | Tok Pisin (`locales/tpi`) |
#   | -------------------- | ---------------- | ------------------------- |
#   | and                  | mo               | na                        |
#   | with                 | wetem            | wantaim                   |
#   | of, belonging to     | blong            | bilong                    |
#   | but                  | be               | tasol                     |
#   | this (demonstrative) | … ya (postposed) | dispela … (preposed)      |
#   | other, another       | nara             | narapela                  |
#   | because              | from (we)        | long wanem                |
#   | again                | bakegen          | gen                       |
#   | find                 | faenem           | painim                    |
#   | get, receive         | kasem            | kisim                     |
#   | send                 | sanem            | salim                     |
#   | sell                 | salem            | salim                     |
#   | change               | jenisim          | senisim                   |
#   | 3sg pronoun          | hem              | em                        |
#   | 3pl subject + marker | oli              | ol i                      |
#
# The «sanem»/«salem» row is the sharpest of them: Tok Pisin's «salim» covers
# both *send* and *sell*, and Bislama splits them. `answer-submitting` uses
# «sanem» for that reason, and a corrector who reaches for «salem» there is
# importing Tok Pisin.
#
# **A Bislama catalog that is Tok Pisin with substitutions is a failed
# catalog**, and it would be easy to produce one, which is why the two points
# below are stated as rules rather than as observations.
#
# **Bislama has no productive `-pela`.** Tok Pisin suffixes «-pela» to almost
# every attributive adjective — «retpela lain», «narapela sait» — and Bislama
# does not. Its cognate «-fala» survives on a **closed set** of mostly
# monosyllabic stems: «bigfala», «smolfala», «nufala», «longfala»,
# «strongfala», «sotfala», «naerafala». Everything outside that set stands
# bare: **«red laen»**, not «redfala laen». This seed writes the bare form for
# every colour, width and dash pattern in `content.ftl`, and uses «-fala» only
# on stems that carry it in the dictionary («bigfala», «sotfala»). It did not
# extend the set, because extending it is exactly the Tok Pisin substitution
# this file exists not to be.
#
# **The transitive suffix is `-em`, and it harmonizes.** A Bislama transitive
# verb takes «-em», «-im» or «-um», picked by the vowel of the stem: «talem»,
# «openem», «klosem», «sanem» beside «klikim», «klinim», «jenisim», «finisim»
# beside «putum», «muvum», «pulum». Tok Pisin generalized «-im» to all of
# them. This is the single grammatical point most likely to be got wrong by a
# corrector working from Tok Pisin, and the second is the predicate marker.
#
# **The predicate marker `i`.** A Bislama clause with a third-person subject
# puts «i» between the subject and the predicate — «dokiumen ya **i** gat ol
# mastik» — and a plural subject uses «oli». It is not a pronoun and it is not
# optional; a message that drops it is ungrammatical rather than terse. Where
# a message here has no overt subject («I stap jekem…», the impersonal «oli
# lego» of `diagnostics.ftl`) the marker is doing the work of the missing one.
#
# **`long` and `blong` are two words.** «long» is the general preposition —
# at, in, to, on, for, about — and «blong» marks possession, purpose and
# origin. «nem blong laen» is *the name of the row*; «nem long laen» would be
# *a name on the row*. Tok Pisin draws the same line with «long»/«bilong», so
# the distinction is shared and only the spelling of the second word is not.
#
# **The French layer is real and this catalog does not reach it.** Bislama is
# the one Melanesian pidgin with a French substrate — «bebet» (insect, from
# *bébête*), «bonane» (*bonne année*), «lafet» (*la fête*), «lakol» (*la
# colle*), «pima» (*piment*) — and it characteristically incorporates the
# French article into the stem, which is why so many of them begin «la-»/«le-».
# Tok Pisin has nothing of this. **No message in these four files uses one**,
# and that is a fact about the message set rather than about the language: the
# French layer sits in food, church and daily life, and a mathematics viewer's
# vocabulary does not go there. A reviewer should not read its absence as a
# gap to be filled.
#
# **No grammatical gender**, so `noun-gender` in `content.ftl` answers a single
# token and no adjective here forks on `$gender`. **No `$role` fork** either:
# nothing in these files changes shape between a standalone position and a
# clause.
#
# **Number.** A Bislama noun is not marked for number. The plural is «ol» in
# front of it, and a noun after a numeral stays as it is — «tri poen», not
# «tri poens». `Intl.PluralRules("bi")` has no CLDR data and resolves against
# the runtime's default locale, so a `[two]`, `[few]` or `[many]` branch here
# would be text nothing could select. Where English's two branches differ only
# in the noun's number this file writes **one unselected form**, as
# `locales/sm` and `locales/tpi` do; an explicit `[0]` branch stays wherever
# English has one, because it names none rather than counting.
#
# **Word order: the describing word comes before the noun**, as in Tok Pisin,
# in English and in the five Philippine catalogs — «red laen», «bigfala mak» —
# and unlike the Polynesian and Micronesian catalogs of the earlier Oceania
# batches. That agreement with `locales/tpi` is deliberate and is one of the
# places the two languages really do coincide.
#
# **Coinages and loans this seed commits to**, all of them open to correction:
#   «respons»   the reader's submitted response, kept distinct from «ansa»
#               (answer) because the interface draws that distinction and no
#               settled Bislama pair was found for it. If a speaker says
#               Bislama uses «ansa» for both, collapse them.
#   «ara»       the arrow of an orbital diagram — an English loan, not
#               «spia» (spear), which is what Tok Pisin reaches for.
#   «emti spes» the gap an input fills inside typeset mathematics
#               (`content.ftl`).
#   «mastik»    error. This one is *not* a coinage — it is ordinary Bislama,
#               from English *mistake* — and it is named here because it is
#               the word a corrector working from `locales/tpi` («asua»)
#               would be most tempted to replace.


## Answer submission

answer-checking = I stap jekem…
answer-submitting = I stap sanem…
answer-checking-status = I stap jekem ansa
answer-submitting-status = I stap sanem ansa
answer-correct = I stret
answer-incorrect = I no stret
answer-response-saved = Respons i sef
answer-percent-credit = { $percent }% mak
answer-percent-correct = { $percent }% i stret
answer-percent-short = { $percent } %
max-credit-available = Bigfala mak we yu save kasem: { $percent }%
# No select: «traem» is the same word for one and for many. The `[0]` branch
# stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] i no gat traem i stap yet
       *[other] { $count } traem i stap yet
    }
validation-correct = (I stret)
validation-incorrect = (I no stret)
validation-partially-correct = (I stret smol)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Soemaot { $count } respons long { $answerId }

## Disclosure panels

feedback-heading = Tok bak
collapsible-click-to-open = (klikim blong openem)
collapsible-click-to-close = (klikim blong klosem)
collapsible-initializing = I stap statem…
footnote-show = Soemaot futnot
footnote-hide = Haedem futnot
description-more-information = moa toksave

## Controls

slider-previous = Bifo
slider-next = Nekis
keyboard-open = Openem kibod
keyboard-close = Klosem kibod
choice-input-remove-choice = Tekemaot { $choice }
matrix-remove-row = Tekemaot laen
matrix-add-row = Putum wan laen
matrix-remove-column = Tekemaot kolam
matrix-add-column = Putum wan kolam
subset-add-remove-points = Putum/Tekemaot ol poen
subset-toggle-points-intervals = Jenisim ol poen mo ol intaval
subset-move-points = Muvum ol poen
subset-clear = Klinim
orbital-add-row = Putum wan laen
orbital-remove-row = Tekemaot laen
orbital-add-box = Putum wan bokis
orbital-remove-box = Tekemaot bokis
orbital-add-up-arrow = Putum wan ara i go antap
orbital-add-down-arrow = Putum wan ara i go daon
orbital-remove-arrow = Tekemaot ara
orbital-row-label = Nem blong laen { $row }
pretzel-answer = Ansa

## Math input

math-input-preview-region = lukluk fastaem long tok matematik
math-input-preview = Lukluk fastaem
math-input-invalid-expression = Tok matematik i no stret:

## Document status

viewer-initializing = I stap statem…

## Errors

error-heading = Mastik
error-found-at =
    { $span ->
        [line] Hem i stap long laen { $startLine }.
       *[lines] Hem i stap long ol laen { $startLine }–{ $endLine }.
    }
document-contains-errors = Dokiumen ya i gat ol mastik!
diagnostic-heading-error = Mastik
diagnostic-heading-warning = Tok lukaot
diagnostic-heading-information = Toksave
diagnostic-heading-hint = Tok halpem
accessibility-heading-level-1 = Brekem loa blong akses WCAG AA
accessibility-heading-level-2 = Tok lukaot long akses
something-went-wrong = Wan samting i no stret.
renderer-load-failed = wan renderer i no save lod. Plis lodem pej ya bakegen.
core-start-failed = Dokiumen ya i no save stat. Plis lodem pej ya bakegen.
core-start-failed-busy = Dokiumen ya i no save stat. Plante dokiumen oli stap stat long sem taem, mo long wan masin we i slo hemia i save tekem longfala taem. Sipos yu wet kasem ol narawan oli finis, nao yu lodem pej ya bakegen, hemia i save halpem.
core-start-failed-retry = Dokiumen ya i no save stat.
core-start-failed-busy-retry = Dokiumen ya i no save stat. Plante dokiumen oli stap stat long sem taem, mo long wan masin we i slo hemia i save tekem longfala taem.
core-start-retry = Traem bakegen
saved-state-unavailable = Wok blong yu we i sef, i no save lod.
