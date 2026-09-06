# Guianese Creole French (kriyòl gwiyanè) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The orthography of French Guiana — the phonemic Latin
# spelling used in the Guianese dictionaries, in the schoolbooks produced for
# the *langues et cultures régionales* option, and in the Guianese press:
# «kriyòl», «kaz», «lò», «roun». Its marks, as this catalog uses them: «é» for
# close [e] and «è» for open [ɛ]; «ò» for open [ɔ]; «an», «on», «en» for the
# three nasal vowels; «ou» for [u]; «y» for the glide; «w» for [w], including
# where French wrote `r` before a rounded vowel («wouj»); «r» elsewhere
# («répons», «gri»); «tj» and «dj» for the palatals; «k» always for [k].
# Silent French letters are not written.
#
# **Its relation to the Antillean standards.** Guianese is written on the same
# principles as GEREC's Guadeloupean and Martinican orthography and as the
# Saint Lucian one — the same vowel letters, the same nasals, the same «k» —
# so all three catalogs look alike on the page. The language underneath is
# where they part, and three differences run through every file here:
#
#   1. **The pronouns.** Guianese has «mo» *I*, «to» *you*, «li» *he/she/it*,
#      «nou», «zòt», «yé» *they*, against Antillean «an/mwen», «ou», «i»,
#      «nou», «zòt», «yo». «yé» carries every impersonal passive in these
#      files, and «to» is the reader the imperatives address.
#   2. **The indefinite article is «roun»**, not Antillean «on» or «an» —
#      «roun pwen», «roun atribi», «roun sèl konpozan».
#   3. **The definite determiner is a single postposed «-a»**, «-an» after a
#      nasal vowel, hyphenated: «kaz-a», «répons-a», «paj-a», «fonksyon-an»,
#      «dokiman-an». Antillean has the four-way «a / la / an / lan»;
#      Guianese does not.
#
# Guianese also says «lò» where the Antilles say «lè» (*when*), «asou» for
# *on*, «annan» for *in*, «arien» for *nothing*, and «pa pouvé» for *cannot*
# where Guadeloupean says «pé pa». The French-etymological spelling — «créole»
# for «kriyòl», «réponse» for «répons» — is a different practice with a
# different aim, and **none of it is mixed in here**.
#
# One point a reviewer should settle: this catalog writes the equative copula
# «sé» throughout, on the Antillean pattern. Guianese also uses «sa» in that
# slot, and a speaker may prefer it in some or all of these sentences.
#
# **Number.** `Intl.PluralRules` has no CLDR data for `gcr`, and the language
# would give it nothing to work with in any case: a Guianese noun has one form
# for one and for many. The plural is the preposed «sé» with the postposed
# determiner («sé répons-a»), and a numeral in front of a bare noun does the
# whole job on its own — «3 ésè», never `*ésèyé`. So **no message in this file
# writes a `[one]`/`[other]` select**; each counted message is one unselected
# form. `attempts-remaining` keeps its `[0]` branch, because "none left" is a
# different sentence rather than a different form of this one.
#
# **Loans.** The technical register is French, carried in creole grammar and
# respelled by the Guianese rules: «répons», «kredi», «enfòmasyon»,
# «matématik», «ekspresyon», «apèsi», «estatistik», «kolòn», «entèval»,
# «klavyé», «erè», «avètisman», «aksésibilité», «vyolasyon», «inisyalizé»,
# «anrejistré», «maksimòm», «disponib», «etikèt». Two are English: «fidbak»
# (*feedback*) and «randè» (*renderer*). «WCAG AA» is the standard's name and
# is not a word. The grammar around all of them is creole: preverbal «ka» for
# the progressive, «ké» for the future, «té» for the anterior, «pa» for
# negation, «ni» for *have*, and the postposed determiner throughout.
#
# **Confidence.** Guianese has a settled orthography and a body of published
# writing, but no written computing register: «randè» and «fidbak» are the
# loan a speaker would say rather than a coinage this seed invented, and
# should be read as proposals.
#
# Kriyòl punctuates as English does: no space before `:`, `;`, `?` or `!`.


## Answer submission

answer-checking = Ka vérifyé…
answer-submitting = Ka voyé…
answer-checking-status = Ka vérifyé répons-a
answer-submitting-status = Ka voyé répons-a
answer-correct = Kòrèk
answer-incorrect = Pa kòrèk
answer-response-saved = Répons-a anrejistré
answer-percent-credit = { $percent }% kredi
answer-percent-correct = { $percent }% kòrèk
answer-percent-short = { $percent } %
max-credit-available = Kredi maksimòm disponib: { $percent }%
# No `[one]`/`[other]` select: «ésè» is one word for one and for many, so both
# categories would render the same string. The count still arrives and is
# still formatted. `[0]` stays — it is its own sentence.
attempts-remaining =
    { $count ->
        [0] pa ni ésè ki rété
       *[other] { $count } ésè ki rété
    }
validation-correct = (Kòrèk)
validation-incorrect = (Pa kòrèk)
validation-partially-correct = (Kòrèk an pati)
# No select, for the reason given above.
answer-show-responses = Montré { $count } répons ba { $answerId }

## Disclosure panels

feedback-heading = Fidbak
collapsible-click-to-open = (kliké pou ouvè)
collapsible-click-to-close = (kliké pou fèmé)
collapsible-initializing = Ka inisyalizé…
footnote-show = Montré nòt anba paj-a
footnote-hide = Kaché nòt anba paj-a
description-more-information = plis enfòmasyon

## Controls

slider-previous = Avan
slider-next = Apré
keyboard-open = Ouvè klavyé-a
keyboard-close = Fèmé klavyé-a
choice-input-remove-choice = Òté { $choice }
matrix-remove-row = Òté roun ranjé
matrix-add-row = Ajouté roun ranjé
matrix-remove-column = Òté roun kolòn
matrix-add-column = Ajouté roun kolòn
subset-add-remove-points = Ajouté/Òté pwen
subset-toggle-points-intervals = Chanjé ant pwen é entèval
subset-move-points = Deplasé pwen
subset-clear = Efasé
orbital-add-row = Ajouté roun ranjé
orbital-remove-row = Òté roun ranjé
orbital-add-box = Ajouté roun bwèt
orbital-remove-box = Òté roun bwèt
orbital-add-up-arrow = Ajouté roun flèch anlè
orbital-add-down-arrow = Ajouté roun flèch anba
orbital-remove-arrow = Òté roun flèch
orbital-row-label = Etikèt pou ranjé { $row }
pretzel-answer = Répons

## Math input

math-input-preview-region = apèsi ekspresyon matématik-a
math-input-preview = Apèsi
math-input-invalid-expression = Ekspresyon ki pa valab:

## Document status

viewer-initializing = Ka inisyalizé…

## Errors

error-heading = Erè
error-found-at =
    { $span ->
        [line] Yo trouvé-y an liy { $startLine }.
       *[lines] Yo trouvé-y an liy { $startLine }–{ $endLine }.
    }
document-contains-errors = Dokiman-an ni erè annan-y!
diagnostic-heading-error = Erè
diagnostic-heading-warning = Avètisman
diagnostic-heading-information = Enfo
diagnostic-heading-hint = Endikasyon
accessibility-heading-level-1 = Vyolasyon aksésibilité WCAG AA
accessibility-heading-level-2 = Alèt aksésibilité
something-went-wrong = Ni roun bagay ki pa maché.
renderer-load-failed = roun randè pa rivé chajé. Souplé, rechajé paj-a.
core-start-failed = Dokiman-an pa pouvé démaré. Souplé, rechajé paj-a.
core-start-failed-busy = Dokiman-an pa pouvé démaré. Plizyè dokiman té ka démaré an menm tan, é sa pouvé pran plis tan asou roun aparèy ki pi lan. Rechajé paj-a pouvé édé lò lòt dokiman-an fin.
core-start-failed-retry = Dokiman-an pa pouvé démaré.
core-start-failed-busy-retry = Dokiman-an pa pouvé démaré. Plizyè dokiman té ka démaré an menm tan, é sa pouvé pran plis tan asou roun aparèy ki pi lan.
core-start-retry = Eséyé ankò
saved-state-unavailable = Travay to té anrejistré-a pa pouvé chajé.
