# Saint Lucian Creole French (Kwéyòl) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Saint Lucian and Dominican standard — the phonemic
# spelling settled by the Mouvman Kwéyòl and used in the Kwéyòl dictionary,
# the Bible translation and the Folk Research Centre's materials. Its marks,
# as this catalog uses them: «é» for close [e] and «è» for open [ɛ]; «ò» for
# open [ɔ]; «an», «on», «en» for the three nasal vowels; «ou» for [u]; «y» for
# the glide; «tj» and «dj» for the palatals; «k» always for [k].
#
# **It is very close to the Martinican and Guadeloupean spelling** — the same
# vowel letters, the same nasals, the same refusal of silent French letters —
# and a Guadeloupean reader will follow this file without difficulty. **Two
# conventions differ, and they are the two things to look at first:**
#
#   1. **Every etymological French /r/ is written «w».** Saint Lucian has no
#      velar continuant at all, where Guadeloupean and Martinican keep one
#      before an unrounded vowel. So «Kwéyòl» against Guadeloupean «kréyòl»,
#      «wéponn» against «répons», «kwedi» against «kredi», «twavay» against
#      «travay», «gwi» against «gri», «kòwèk» against «kòrèk», «éwè» against
#      «erè». Where both write «w» already — «wouj», «wòch» — the two agree.
#   2. **The determiner is a separate word and takes the full allomorph set.**
#      GEREC hyphenates a generalized «-la» («répons-la», «paj-la»); this
#      catalog writes «wéponn lan», «paj la», «fonksyon an», «kanva a» — «a»
#      after an oral vowel, «la» after an oral consonant, «an» after a nasal
#      vowel, «lan» after a nasal consonant. **A reviewer should check these
#      first**: the allomorph is chosen from the noun's final segment, and a
#      handful of the choices are judgement calls.
#
# The French-etymological spelling — «créole» for «Kwéyòl», «réponse» for
# «wéponn» — is a different practice with a different aim, and **none of it is
# mixed in here**. A few Guadeloupean words are also replaced by their Saint
# Lucian equivalents: «pyès» for *none* where Guadeloupean says «pon»,
# «anyen» for *nothing* where it says «ayen», «wè» for *see* where it says
# «vwè».
#
# **Number.** `Intl.PluralRules` has no CLDR data for `acf`, and the language
# would give it nothing to work with in any case: a Saint Lucian noun has one
# form for one and for many. The plural is the preposed «sé» with the
# postposed determiner («sé wéponn lan»), and a numeral in front of a bare
# noun does the whole job on its own — «3 ésè», never `*ésèyo`. So **no
# message in this file writes a `[one]`/`[other]` select**; each counted
# message is one unselected form. `attempts-remaining` keeps its `[0]` branch,
# because "none left" is a different sentence rather than a different form of
# this one.
#
# **Loans.** The technical register is French, carried in creole grammar and
# respelled by the Saint Lucian rules: «wéponn», «kwedi», «enfòmasyon»,
# «matématik», «ekspwesyon», «apèsi», «estatistik», «kolòn», «entèval»,
# «klavyé», «éwè», «avètisman», «aksésibilité», «vyolasyon», «inisyalizé»,
# «anwéjistwé», «maksimòm», «disponib», «etikèt». Saint Lucia schools in
# English, so the English loans arrive by a shorter road than they do in
# Guadeloupe: «fidbak» (*feedback*) and «wandè» (*renderer*) are here for that
# reason as much as for want of a creole word. «WCAG AA» is the standard's
# name and is not a word. The grammar around all of them is creole: preverbal
# «ka» for the progressive, «ké» for the future, «té» for the anterior, «pa»
# for negation, «pé pa» for *cannot*, «ni» for *have*, «sé» for the equative
# copula, and the postposed determiner throughout.
#
# **Confidence.** Saint Lucian has a settled orthography, a dictionary and a
# translated Bible, but no written computing register at all: there is no
# published Kwéyòl word for *renderer* or *feedback*, and the two above are
# proposals. The determiner allomorphs are the other thing to read closely.
#
# Kwéyòl punctuates as English does: no space before `:`, `;`, `?` or `!`.


## Answer submission

answer-checking = Ka véwifyé…
answer-submitting = Ka voyé…
answer-checking-status = Ka véwifyé wéponn lan
answer-submitting-status = Ka voyé wéponn lan
answer-correct = Kòwèk
answer-incorrect = Pa kòwèk
answer-response-saved = Wéponn lan anwéjistwé
answer-percent-credit = { $percent }% kwedi
answer-percent-correct = { $percent }% kòwèk
answer-percent-short = { $percent } %
max-credit-available = Kwedi maksimòm disponib: { $percent }%
# No `[one]`/`[other]` select: «ésè» is one word for one and for many, so both
# categories would render the same string. The count still arrives and is
# still formatted. `[0]` stays — it is its own sentence.
attempts-remaining =
    { $count ->
        [0] pa ni ésè ki wété
       *[other] { $count } ésè ki wété
    }
validation-correct = (Kòwèk)
validation-incorrect = (Pa kòwèk)
validation-partially-correct = (Kòwèk an pati)
# No select, for the reason given above.
answer-show-responses = Montwé { $count } wéponn ba { $answerId }

## Disclosure panels

feedback-heading = Fidbak
collapsible-click-to-open = (kliké pou ouvè)
collapsible-click-to-close = (kliké pou fèmé)
collapsible-initializing = Ka inisyalizé…
footnote-show = Montwé nòt anba paj la
footnote-hide = Kaché nòt anba paj la
description-more-information = plis enfòmasyon

## Controls

slider-previous = Avan
slider-next = Apwé
keyboard-open = Ouvè klavyé a
keyboard-close = Fèmé klavyé a
choice-input-remove-choice = Òté { $choice }
matrix-remove-row = Òté on wanjé
matrix-add-row = Ajouté on wanjé
matrix-remove-column = Òté on kolòn
matrix-add-column = Ajouté on kolòn
subset-add-remove-points = Ajouté/Òté pwen
subset-toggle-points-intervals = Chanjé ant pwen é entèval
subset-move-points = Deplasé pwen
subset-clear = Efasé
orbital-add-row = Ajouté on wanjé
orbital-remove-row = Òté on wanjé
orbital-add-box = Ajouté on bwèt
orbital-remove-box = Òté on bwèt
orbital-add-up-arrow = Ajouté on flèch anlè
orbital-add-down-arrow = Ajouté on flèch anba
orbital-remove-arrow = Òté on flèch
orbital-row-label = Etikèt pou wanjé { $row }
pretzel-answer = Wéponn

## Math input

math-input-preview-region = apèsi ekspwesyon matématik la
math-input-preview = Apèsi
math-input-invalid-expression = Ekspwesyon ki pa valab:

## Document status

viewer-initializing = Ka inisyalizé…

## Errors

error-heading = Éwè
error-found-at =
    { $span ->
        [line] Yo twouvé-y an liy { $startLine }.
       *[lines] Yo twouvé-y an liy { $startLine }–{ $endLine }.
    }
document-contains-errors = Dokiman sala ni éwè adan-y!
diagnostic-heading-error = Éwè
diagnostic-heading-warning = Avètisman
diagnostic-heading-information = Enfo
diagnostic-heading-hint = Endikasyon
accessibility-heading-level-1 = Vyolasyon aksésibilité WCAG AA
accessibility-heading-level-2 = Alèt aksésibilité
something-went-wrong = Ni on bagay ki pa maché.
renderer-load-failed = on wandè pa wivé chajé. Souplé, wechajé paj la.
core-start-failed = Dokiman sala pa pé démawé. Souplé, wechajé paj la.
core-start-failed-busy = Dokiman sala pa pé démawé. Plizyè dokiman té ka démawé an menm tan, é sa pé pwan plis tan asi on aparèy ki pi lan. Rechajé paj la pé édé lè lòt dokiman an fin.
core-start-failed-retry = Dokiman sala pa pé démawé.
core-start-failed-busy-retry = Dokiman sala pa pé démawé. Plizyè dokiman té ka démawé an menm tan, é sa pé pwan plis tan asi on aparèy ki pi lan.
core-start-retry = Eséyé ankò
saved-state-unavailable = Twavay ou té anwéjistwé a pa pé chajé.
