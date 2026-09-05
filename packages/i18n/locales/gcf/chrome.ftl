# Guadeloupean Creole French (kréyòl gwadloupéyen) viewer chrome. Translated
# from `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The GEREC standard — the phonemic Latin orthography worked
# out at the Groupe d'Études et de Recherches en Espace Créolophone at the
# Université des Antilles and used in Guadeloupean schoolbooks, dictionaries
# and the Antillean press. Its marks, as this catalog uses them: «é» for close
# [e] and «è» for open [ɛ]; «ò» for open [ɔ]; «an», «on», «en» for the three
# nasal vowels; «ou» for [u]; «y» for the glide; «w» for [w], including where
# French wrote `r` before a rounded vowel («wouj», «wòch»); «r» elsewhere for
# the velar continuant («répons», «gri»); «tj» and «dj» for the palatals; «k»
# always for [k], so French `qu` and `c` are both written «k» («kalkilé»).
# Silent French letters are not written: «tan», not `temps`.
#
# The French-etymological spelling — writing «créole» for «kréyòl», «réponse»
# for «répons» — is a different practice with a different aim, and **none of
# it is mixed in here**. Where a word is a loan it is respelled by GEREC's own
# rules rather than left in its French dress.
#
# **The determiner is postposed and hyphenated**, which is the most visible
# thing on the page: «répons-la» *the answer*, «paj-la» *the page*,
# «klavyé-la» *the keyboard*, «dokiman-lasa» *this document*. GEREC writes the
# hyphen; a reader used to Haitian, which writes «repons lan» open, will
# notice it first.
#
# **Number.** `Intl.PluralRules` has no CLDR data for `gcf`, and the language
# would give it nothing to work with in any case: a Guadeloupean noun has one
# form for one and for many. The plural is the preposed «sé» with the
# postposed determiner («sé répons-la»), and a numeral in front of a bare noun
# does the whole job on its own — «3 ésè», never `*ésèyo`. So **no message in
# this file writes a `[one]`/`[other]` select**; each counted message is one
# unselected form. `attempts-remaining` keeps its `[0]` branch, because
# "none left" is a different sentence rather than a different form of this
# one.
#
# **Loans.** The technical register is French, carried in creole grammar and
# respelled by GEREC: «répons», «kredi», «enfòmasyon», «matématik»,
# «ekspresyon», «apèsi», «estatistik», «kolòn», «entèval», «klavyé», «erè»,
# «avètisman», «aksésibilité», «vyolasyon», «inisyalizé», «anrejistré»,
# «maksimòm», «disponib», «etikèt», «orbital». Two are English, taken through
# the same door the language takes them through in speech: «fidbak»
# (*feedback*) and «randè» (*renderer*); «WCAG AA» is the standard's name and
# is not a word. The grammar around all of them is creole: preverbal «ka» for
# the progressive, «pa» for negation, «pé pa» for *cannot*, «ni» for *have*,
# and the postposed determiner throughout.
#
# **Confidence.** Guadeloupean has a settled orthography and a real written
# literature, but very little written computing register: nobody has published
# a Guadeloupean word for *renderer* or *feedback*, and the two above are the
# loan a speaker would actually say rather than a coinage this seed invented.
# A reviewer should read them as proposals.
#
# Creole punctuates as English does: no space before `:`, `;`, `?` or `!`.
# That is one of the places the orthography deliberately parted from French.


## Answer submission

answer-checking = Ka vérifyé…
answer-submitting = Ka voyé…
answer-checking-status = Ka vérifyé répons-la
answer-submitting-status = Ka voyé répons-la
answer-correct = Kòrèk
answer-incorrect = Pa kòrèk
answer-response-saved = Répons-la anrejistré
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
footnote-show = Montré nòt anba paj-la
footnote-hide = Kaché nòt anba paj-la
description-more-information = plis enfòmasyon

## Controls

slider-previous = Avan
slider-next = Apré
keyboard-open = Ouvè klavyé-la
keyboard-close = Fèmé klavyé-la
choice-input-remove-choice = Òté { $choice }
matrix-remove-row = Òté on ranjé
matrix-add-row = Ajouté on ranjé
matrix-remove-column = Òté on kolòn
matrix-add-column = Ajouté on kolòn
subset-add-remove-points = Ajouté/Òté pwen
subset-toggle-points-intervals = Chanjé ant pwen é entèval
subset-move-points = Deplasé pwen
subset-clear = Efasé
orbital-add-row = Ajouté on ranjé
orbital-remove-row = Òté on ranjé
orbital-add-box = Ajouté on bwèt
orbital-remove-box = Òté on bwèt
orbital-add-up-arrow = Ajouté on flèch anlè
orbital-add-down-arrow = Ajouté on flèch anba
orbital-remove-arrow = Òté on flèch
orbital-row-label = Etikèt pou ranjé { $row }
pretzel-answer = Répons

## Math input

math-input-preview-region = apèsi ekspresyon matématik-la
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
document-contains-errors = Dokiman-lasa ni erè adan-y!
diagnostic-heading-error = Erè
diagnostic-heading-warning = Avètisman
diagnostic-heading-information = Enfo
diagnostic-heading-hint = Endikasyon
accessibility-heading-level-1 = Vyolasyon aksésibilité WCAG AA
accessibility-heading-level-2 = Alèt aksésibilité
something-went-wrong = Ni on bagay ki pa maché.
renderer-load-failed = on randè pa rivé chajé. Souplé, rechajé paj-la.
core-start-failed = Dokiman-lasa pa pé démaré. Souplé, rechajé paj-la.
core-start-failed-busy = Dokiman-lasa pa pé démaré. Plizyè dokiman té ka démaré an menm tan, é sa pé pran plis tan asi on aparèy ki pi lan. Rechajé paj-la pé édé lè lòt dokiman-la fin.
core-start-failed-retry = Dokiman-lasa pa pé démaré.
core-start-failed-busy-retry = Dokiman-lasa pa pé démaré. Plizyè dokiman té ka démaré an menm tan, é sa pé pran plis tan asi on aparèy ki pi lan.
core-start-retry = Eséyé ankò
saved-state-unavailable = Travay ou té anrejistré-la pa pé chajé.
