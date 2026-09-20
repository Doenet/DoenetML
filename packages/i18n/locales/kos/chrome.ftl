# Kosraean (kas Kosrae) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# ## Orthography
#
# This catalog writes the **standard modern Kosraean orthography** — the one of
# Kee-dong Lee's *Kusaiean–English Dictionary* (1976) and *Kusaiean Reference
# Grammar*, and of Kosrae State's school and church materials. Its digraphs are
# single letters and must never be "simplified": the vowels **`ac`, `ah`, `oa`,
# `oh`, `uc`, `uh`** are each one vowel and not a vowel plus a consonant, and
# **`ng`, `sr`, `kw`, `mw`, `srw`** are each one consonant. `y` and `w` are
# full letters. There are no diacritics anywhere in Kosraean spelling, so an
# accent or a macron below would be a bug rather than a variant. The older
# missionary spelling of the Kosraean Bible writes several of these
# differently; a reviewer who prefers it should convert the whole catalog
# rather than mix the two.
#
# Kosraean nouns take determiner suffixes (`-uh`, `-ah`, `-uc`) that this seed
# is not confident enough to place, so every noun below stands bare. A speaker
# adding them should expect to touch nearly every line, which is why they are
# absent rather than guessed at.
#
# ## What this seed could not establish, said plainly
#
# Kosraean has less published lexical material within reach than any of the
# other Micronesian languages of this batch, and almost none of it is
# technical. **Every word this seed could not establish is left as the
# English word, in English spelling, and is a loan rather than Kosraean.** It
# is deliberately *not* respelled into the Kosraean alphabet: `b`, `c`, `d`,
# `g`, `h`, `j`, `q`, `v`, `x` and `z` are not Kosraean letters, and a loan
# carrying them is visibly a loan, where a respelling would present this seed's
# invented loan phonology as a fact about the language. That policy is stated
# here for the whole residue, and it **disagrees on purpose** with
# `locales/pon`, `locales/mh` and `locales/chk`, which respell
# their loans into their own alphabets because they had a dictionary's worth of
# evidence for how those languages take a loan. This seed does not.
#
# The Kosraean words the four files of this catalog commit to, all of which a
# reviewer should check before anything else:
#
#   pwaye        true, right, correct        tia          not
#   tia pwaye    false, incorrect            ku           can; or
#   oasr         there is                    wangin       there is none
#   ma           thing, that which           mwet         person
#   kas          word, speech                orekma       work
#   ac           and                         ke           of, at, about, with
#   nu ke        to                          lun / lom    of / your
#   sie          one                         kutu         some
#   pus          many                        nukewa       all
#   kais sie     each                        liki         than, from, out of
#   yohk         big                         srik         small
#   sasu         new                         loes         long
#   meet         before, previous            tok          after, next
#   sifil        again                       pacl         time
#   fin          if                          soenna       not yet
#   ke sripen    because of                  fal          fitting, enough
#   lupa         amount                      ip           piece, part
#   acn          place, area                 ine          name
#   sakseng      cross                       lucng / ten  above / below
#   liye         see                         etu          know
#   konauk       find (koneyuk, be found)    orala        make
#   sulela       choose                      supwala      send
#   eisla        take away, remove           moklela      move
#   sim          write                       lutlut       learn, study
#   kasru        help                        kol          lead, guide
#   taran        watch out, guard            esam         remember
#   ekulla       change                      utyak        enter
#   kunausla     break, spoil                lela         allow
#   filiya       put, place                  oakiya       arrange
#   nunak munas  please                      oana         like, as
#
# ## Coinages, built by Kosraean's own means, all needing confirmation
#
#   ku in utyak     accessibility — "the ability to enter". The same move
#                   `locales/pon` makes with «kak en pedolong» and
#                   `locales/chk` with «tolong»; this catalog joins them
#                   deliberately rather than arriving there by chance.
#   kas in kasru    feedback — "words of help"
#   kas in kol      hint — "words that guide"
#   kas in taran    warning — "words of watching out"
#   kas in etu      information — "words of knowing"
#   kas ke nia      footnote — "the word at the foot"
#   mwe liye        the viewer — "the thing for seeing"
#   mwe akkalem     the renderer — "the thing that reveals". Two different
#                   words on purpose, as in `locales/pon`: the reader meets
#                   both.
#   liye meet       preview — "to see beforehand"
#   sifil ikasla    reload — "open again"
#
# ## Words this seed is least sure of, in order
#
# «tafongla» for *error*, «ikasla» for *open* and «kaliya» for *close*,
# «karingin» for *keep, save*, «lula» for *remaining*, «srike» for *try, an
# attempt*, «koneyuk» as the passive of «konauk», and the passive `-yuk`
# throughout. If any one of these is wrong the file reads wrong in many places
# at once, which is exactly why they are listed here and not buried.
#
# ## No gender, no `$role` fork
#
# Kosraean has **no grammatical gender**, so `content.ftl` answers
# `noun-gender` with one token and no adjective in any of these four files
# forks on `$gender`. Nothing here changes shape between standing alone and
# standing inside a clause either, so **no message forks on `$role`**. This is
# `locales/sm`'s and `locales/tpi`'s answer, and it is the answer the whole
# Micronesian group of this batch gives — `mh`, `chk`, `pon` and `gil`.
#
# ## Number
#
# A Kosraean noun is not marked for number by a numeral in front of it, so a
# count changes nothing about the word beside it. `Intl.PluralRules("kos")`
# has no CLDR data and resolves against the runtime's default locale, so a
# `[two]`, `[few]` or `[many]` branch here would be text nothing could select.
# Every counted message below is written as **one unselected form**, with only
# an explicit `[0]` literal — matched numerically, and always safe — where
# "none" is a different sentence rather than a different form of the same one.
# `answer-show-responses` drops its select entirely.
#
# ## Word order
#
# Kosraean is SVO and head-initial: a describing word **follows** the noun it
# describes, so `content.ftl`'s composition messages put `{ $noun }` ahead of
# `{ $description }`. That is the same order `mh`, `chk`, `pon`, `gil`, `ch`,
# `sm` and `to` write, and this catalog joins the agreement rather than
# arriving at it alone.


## Answer submission

answer-checking = Ke liye...
answer-submitting = Ke supwala...
answer-checking-status = Ke liye topuk
answer-submitting-status = Ke supwala topuk
answer-correct = Pwaye
answer-incorrect = Tia pwaye
answer-response-saved = Topuk karinginyuk
answer-percent-credit = { $percent }% ke credit
answer-percent-correct = { $percent }% pwaye
answer-percent-short = { $percent } %
max-credit-available = Lupan credit ma oasr: { $percent }%
# «srike» is a try. Only the `[0]` literal forks: "none left" is a different
# sentence, not a different form of the noun.
attempts-remaining =
    { $count ->
        [0] wangin srike lula
       *[other] srike { $count } lula
    }
validation-correct = (Pwaye)
validation-incorrect = (Tia pwaye)
validation-partially-correct = (Pwaye ke kutu)
# No select: the two English branches differ only in the number of the noun,
# which Kosraean does not mark. The count still arrives and is still formatted.
answer-show-responses = Akkalemye topuk { $count } nu ke { $answerId }


## Disclosure panels

feedback-heading = Kas in kasru
collapsible-click-to-open = (klik in ikasla)
collapsible-click-to-close = (klik in kaliya)
collapsible-initializing = Ke mutawauk...
footnote-show = Akkalemye kas ke nia
footnote-hide = Okanla kas ke nia
description-more-information = kas in etu pac


## Controls

slider-previous = Meet
slider-next = Tok
keyboard-open = Ikasla keyboard
keyboard-close = Kaliya keyboard
choice-input-remove-choice = Eisla { $choice }
matrix-remove-row = Eisla row
matrix-add-row = Weang row
matrix-remove-column = Eisla column
matrix-add-column = Weang column
subset-add-remove-points = Weang/Eisla point
subset-toggle-points-intervals = Ekulla inmasrlon point ac interval
subset-move-points = Moklela point
subset-clear = Eisla nukewa
orbital-add-row = Weang row
orbital-remove-row = Eisla row
orbital-add-box = Weang box
orbital-remove-box = Eisla box
orbital-add-up-arrow = Weang arrow nu lucng
orbital-add-down-arrow = Weang arrow nu ten
orbital-remove-arrow = Eisla arrow
orbital-row-label = Ine lun row { $row }
pretzel-answer = Topuk


## Math input

math-input-preview-region = liye meet ke math
math-input-preview = Liye meet
math-input-invalid-expression = Math tia fal:


## Document status

viewer-initializing = Ke mutawauk...


## Errors

error-heading = Tafongla
error-found-at =
    { $span ->
        [line] Koneyuk ke line { $startLine }.
       *[lines] Koneyuk ke line { $startLine }–{ $endLine }.
    }
document-contains-errors = Oasr tafongla in document se inge!
diagnostic-heading-error = Tafongla
diagnostic-heading-warning = Kas in taran
diagnostic-heading-information = Kas in etu
diagnostic-heading-hint = Kas in kol
accessibility-heading-level-1 = Kunausla ke WCAG AA ke ku in utyak
accessibility-heading-level-2 = Kas in taran ke ku in utyak
something-went-wrong = Oasr ma tafongla.
renderer-load-failed = mwe akkalem se tia ku in utyak. Nunak munas, sifil ikasla page se inge.
core-start-failed = Document se inge tia ku in mutawauk. Nunak munas, sifil ikasla page se inge.
core-start-failed-busy = Document se inge tia ku in mutawauk. Document pus tukeni mutawauk ke pacl sefanna, ac ma inge ku in loes. Sifil ikasla page se inge tukun document saya uh safla, sahp ma inge ac kasru.
core-start-failed-retry = Document se inge tia ku in mutawauk.
core-start-failed-busy-retry = Document se inge tia ku in mutawauk. Document pus tukeni mutawauk ke pacl sefanna, ac ma inge ku in loes.
core-start-retry = Sifil srike
saved-state-unavailable = Orekma lom ma karinginyuk tia ku in utyak.
