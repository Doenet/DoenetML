# Wakhi (Xik zik) viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **This is the thinnest catalog of its batch, and it says so first rather
# than last.** Wakhi is an Eastern Iranian (Pamiri) language of Gojal in upper
# Hunza, of the Wakhan in Tajikistan and Afghanistan, and of Xinjiang, and the
# published lexical material a seed can reach is very small. Almost every
# content word below is a declared loan. What is Wakhi here is the *frame* —
# the word order, one verb, one postposition, and a short list of function
# words — and a speaker should expect to rewrite the sentences rather than to
# correct words inside them.
#
# **Orthography: the Latin practice of Pakistan.** Wakhi has no single settled
# orthography. Two are in real use: a Latin alphabet developed in Gojal and
# used by the Wakhi Tajik Cultural Association and in Pakistani Wakhi
# publishing, and a Cyrillic one used in Tajikistan. This catalog writes the
# **Latin one**, for one reason and not a linguistic one: it is the system
# under which most Wakhi text a reader is likely to have seen in print is
# written, and it is the one whose loanwords (English and Urdu) match the
# school vocabulary of the community with the largest Wakhi-language media
# presence. A reader in Tajikistan, Afghanistan or Xinjiang **may simply not
# recognize these spellings**, and that is a real cost of the choice rather
# than an oversight.
#
# The Latin here is deliberately **plain**: `a b c d e f g h i j k l m n o p q
# r s t u v w x y z` plus the digraphs `sh ch zh kh gh th dh ts ng`, and no
# diacritics at all. Wakhi's fuller Latin orthographies mark contrasts this
# does not — the retroflexes and interdentals written x̌, ẓ̌, ṣ̌, ǰ, ð, θ, ɣ̌ —
# so this seed **under-differentiates**, knowingly. It does so because a seed
# whose every word carries characters a reviewer cannot type is a seed nobody
# corrects. A corrector who wants the diacritics should put them in; what they
# must not do is put them in one file.
#
# **What must not be mixed in.** No Cyrillic anywhere — a single Cyrillic word
# in a Latin file is a mistake, not a variant. No Perso-Arabic. Converting
# this catalog to the Tajikistani Cyrillic means converting **all four files
# at once**, loans and all, since the loans would change source language as
# well as script (see below).
#
# **The one verb.** Every action in this catalog is written as a noun plus
# **«tsar-»**, 'to do' — «chek tsar», «hazf tsar», «zam tsar», «nishon tsar».
# The imperative is «tsar», and the infinitive is written **«tsarn»**. That is
# the seed's single largest grammatical assumption, and it is stated here so
# that it can be checked in one place: if Wakhi builds its infinitive
# otherwise, every «-n» form in these four files is wrong in exactly the same
# predictable way, and one find-and-replace fixes all of them.
#
# **No copula.** These messages are written as verbless nominal predications —
# «Yiw chiz ghalat», not «Yiw chiz ghalat wost». A speaker should supply the
# copula and its agreement; the seed does not guess at them.
#
# **Word order and the postposition.** Wakhi is verb-final, adjectives precede
# their noun, and relations are marked by postpositions rather than by
# prepositions. This catalog uses **«-ir»** (dative/purposive, 'to, for') and
# **«-dar»** ('in, on'), both written onto the word they follow. Both have a
# **single invariant shape** — no vowel harmony, no allomorph picked by the
# preceding sound — so writing one against a placeable is adjacency rather
# than agreement, and the README's rule about welding an affix to a placeable
# does not reach it: `{ $startLine }-dar` is as correct as Finnish's
# `{ $numSides }-kulmio`. This file does that twice, and `editor.ftl` and
# `diagnostics.ftl` do it about two dozen times between them. Where the seed
# wanted a relation it was *less* sure of, it rebuilt the sentence around the
# free word «baroi» ('for') instead, which is why both constructions appear
# here.
#
# **Counting.** CLDR has **no plural data for `wbl`**, so `Intl.PluralRules`
# resolves it against the runtime's default locale and a category branch here
# would be text chosen by English's rules. Iranian languages leave a noun
# unmarked after a numeral — «yiw koshish», «tru koshish» — so this catalog
# writes a **single `*[other]` branch** wherever English's `one` and `other`
# differ only in the noun's plural, rather than writing two identical ones.
# English's explicit **`[0]`** branches are kept: Fluent matches those against
# the number itself, before it consults any plural rule, so they still fire.
# No `[zero]`, `[two]`, `[few]` or `[many]` branch appears anywhere in these
# four files.
#
# **Loans.** Everything this seed could not establish in Wakhi is kept as the
# word actually used in Gojal, in that language's own spelling, and is not
# respelled by an invented loan phonology. Two sources, and they are named
# rather than blurred together:
#
#   * **English**, for the whole of the computing and DoenetML vocabulary:
#     `document`, `page`, `viewer`, `editor`, `renderer`, `keyboard`, `row`,
#     `column`, `box`, `arrow`, `credit`, `preview`, `math`, `expression`,
#     `point`, `interval`, `label`, `component`, `attribute`, `variant`,
#     `reference`, `accessibility`, `contrast`, `style`, `line`, and the
#     DoenetML element and attribute names, which are identifiers and would
#     stay English in any case.
#   * **Urdu and Persian**, for the ordinary abstract vocabulary Wakhi in
#     Pakistan takes from them: «jawab» (answer), «sawol» (question),
#     «ghalati» (error), «ghalat» (wrong), «drust» (correct), «hushdor»
#     (warning), «ma'lumot» (information), «mahfuz» (saved), «koshish»
#     (attempt), «hazf» (removal), «zam» (addition), «harakat» (movement),
#     «intikhob» (selection), «nishon» (showing), «pinhon» (hiding), «kusho»
#     (open), «band» (closed), «pok» (clean), «badal» (change), «hoshiya»
#     (footnote), «safha» (page), «dubora» (again), «pichhla» (previous),
#     «agla» (next), «faol» (active), «khilofwarzi» (violation).
#
# The Wakhi in this file is: «at» (and), «yo» (or), «na-» (negation), «nast»
# (there is not), «yast» (there is), «yiw/buy/tru» (one/two/three), «yem»
# (this), «yaw» (that), «dram» (here), «az» (from, of), «-ir», «-dar», and
# «tsar-». If a Cyrillic-writing reviewer converts this catalog, that list is
# what has to survive the conversion; the loans above become their Tajik and
# Russian equivalents instead.


## Answer submission

answer-checking = Chek tsarn…
answer-submitting = Ravon tsarn…

answer-checking-status = Jawab chek tsarn
answer-submitting-status = Jawab ravon tsarn

answer-correct = Drust
answer-incorrect = Nodrust

answer-response-saved = Jawab mahfuz

answer-percent-credit = { $percent }% credit
answer-percent-correct = { $percent }% drust
answer-percent-short = { $percent } %

max-credit-available = Ziyottarin credit: { $percent }%

# Single `*[other]`: a noun after a numeral is unmarked, and `wbl` has no CLDR
# plural data. `[0]` is matched against the number and still fires.
attempts-remaining =
    { $count ->
        [0] koshish nast
       *[other] { $count } koshish boqi
    }

validation-correct = (Drust)
validation-incorrect = (Nodrust)
validation-partially-correct = (Yiw hissa drust)

answer-show-responses = { $count } jawab baroi { $answerId } nishon tsar


## Disclosure panels

feedback-heading = Fikru mulohiza

collapsible-click-to-open = (kusho tsarn-ir klik tsar)
collapsible-click-to-close = (band tsarn-ir klik tsar)

collapsible-initializing = Shuru tsarn…

footnote-show = Hoshiya nishon tsar
footnote-hide = Hoshiya pinhon tsar

description-more-information = ziyot ma'lumot


## Controls

slider-previous = Pichhla
slider-next = Agla

keyboard-open = Keyboard kusho tsar
keyboard-close = Keyboard band tsar

choice-input-remove-choice = { $choice } hazf tsar

matrix-remove-row = Row hazf tsar
matrix-add-row = Row zam tsar
matrix-remove-column = Column hazf tsar
matrix-add-column = Column zam tsar

subset-add-remove-points = Point zam tsar/hazf tsar
subset-toggle-points-intervals = Point at interval badal tsar
subset-move-points = Point harakat tsar
subset-clear = Pok tsar

orbital-add-row = Row zam tsar
orbital-remove-row = Row hazf tsar
orbital-add-box = Box zam tsar
orbital-remove-box = Box hazf tsar
orbital-add-up-arrow = Baland arrow zam tsar
orbital-add-down-arrow = Past arrow zam tsar
orbital-remove-arrow = Arrow hazf tsar

orbital-row-label = Label baroi row { $row }

pretzel-answer = Jawab



## Math input

math-input-preview-region = math expression-i preview
math-input-preview = Preview
math-input-invalid-expression = Ghalat expression:


## Document status

viewer-initializing = Shuru tsarn…


## Errors

error-heading = Ghalati

error-found-at =
    { $span ->
        [line] Line { $startLine }-dar peydo.
       *[lines] Line { $startLine }–{ $endLine }-dar peydo.
    }

document-contains-errors = Yem document-dar ghalati yast!

diagnostic-heading-error = Ghalati
diagnostic-heading-warning = Hushdor
diagnostic-heading-information = Ma'lumot
diagnostic-heading-hint = Ishora

accessibility-heading-level-1 = WCAG AA accessibility khilofwarzi
accessibility-heading-level-2 = Accessibility hushdor

something-went-wrong = Yiw chiz ghalat.

renderer-load-failed = yiw renderer load namumkin. Page dubora load tsar.

core-start-failed = Yem document shuru namumkin. Page dubora load tsar.

core-start-failed-busy = Yem document shuru namumkin. Bisyor document yiw waqt-dar shuru, at sust device-dar yem sust. Digar document tamom, ba'd page dubora load tsar.

core-start-failed-retry = Yem document shuru namumkin.

core-start-failed-busy-retry = Yem document shuru namumkin. Bisyor document yiw waqt-dar shuru, at sust device-dar yem sust.

core-start-retry = Dubora koshish tsar

saved-state-unavailable = Mahfuz kor load namumkin.
