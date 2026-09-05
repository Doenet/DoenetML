# Arpitan / Franco-Provençal (arpetan) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script, in **ORB** — the *Orthographe de
# Référence B* set out by Dominique Stich (*Dictionnaire francoprovençal /
# français*, 2003) and used by the Arpitan Wikipedia, by the Aliance
# Culturèla Arpitana and by most published pan-Arpitan writing since. ORB is
# a **supradialectal** spelling: it writes one form for Savoy, the Lyonnais,
# the Val d'Aosta and Romandy and leaves each valley to read it aloud its own
# way, which is exactly what a single locale directory needs. Its marks, as
# this catalog uses them: «ê», «é», «è», «â», «ô» for the vowel qualities;
# the **«cll» and «gll» digraphs** for the palatalised Latin clusters
# («cllâr», «cllôre», «cèrcllo», «triangllo»), which are the most visible
# Arpitan spelling on the page and are not French `cl`/`gl`; final
# etymological consonants that are not pronounced («pouent», «fôx»,
# «crouèx»); and the feminine in `-a` («rèponsa», «pâge»… «-a» nouns and
# «-a» adjectives).
#
# **What is Arpitan's own.** The copula is «étre» («o est», «est»); the
# negator is the preverbal **«ne»** with postverbal **«pas»**, and this
# catalog writes «pas» after the verb throughout («at pas pouessu étre…»).
# The connectives are Arpitan: «et», «ou», «se» (*if*), «mas» (*but*),
# «avouéc» (*with*), «sen» (*without*), «sur» (*on*), «por» (*in order to*),
# «entre» (*between*), «cen que» (*which*), «ôtrament» (*otherwise*). The
# verbs on the buttons are Arpitan infinitives in `-ar` / `-ir` / `-re`:
# «uvrir» (open), «cllôre» (close), «montrar» (show), «cachiér» (hide),
# «apondre» (add), «enlevar» (remove), «dèplaciér» (move), «èfaciér»
# (erase), «tornar assayér» (try again), «cllicar» (click). «assay»
# (attempt), «legne» (line, row), «pouent» (point), «pâge» (page), «bouèta»
# (box), «fllèche» (arrow), «cllavièr» (keyboard) and «èrror» (error) are
# ordinary Arpitan nouns.
#
# **What is borrowed.** The technical register is **French**, respelled by
# ORB's rules: «rèponsa», «vèrificacion», «mâximo»,
# «enrègistrâ», «informacion», «expression», «matèmatico»,
# «colona», «entèrvalo», «module», «document», «accèssibilitât»,
# «violacion», «ètiquèta», «orbital». That is the honest register: nobody
# has published an Arpitan computing vocabulary, and secondary schooling
# across the Arpitan area is in French or Italian. «apèrçu» (preview) and
# «Comentèros» (feedback) are the two weakest entries — French loans in ORB
# dress rather than attested Arpitan words. `WCAG AA` is the standard's name
# and is not a word.
#
# **Counts.** `Intl.PluralRules` has **no CLDR data for `frp`** — the tag
# resolves against the runtime's default locale, so any `[zero]`, `[two]`,
# `[few]` or `[many]` branch would be a branch nothing here can select.
# **None is written anywhere in this catalog.** `[one]` *is* kept in the two
# counted messages below, and it is doing real work rather than being
# tolerated: Arpitan marks its plural in ORB writing, on the noun («un
# assay» / «doux assays») and on the verb («rèste» / «rèstont»), so the two
# branches are two different sentences. `attempts-remaining` keeps its `[0]`
# literal, which is a different mechanism and legal everywhere.
#
# Arpitan is written with French typography, with a space before `:`, `;`,
# `?` and `!`. That spacing belongs to this catalog and is written out here.
#
# **Weakest first.** A reviewer should attack, in order: «apèrçu» and
# «Comentèros»; the `-cion` abstract nouns, where a Savoyard or Valdôtain
# speaker may prefer a verb; and the imperative forms on the buttons, which
# ORB writes but which vary widely in speech.


## Answer submission

answer-checking = Vèrificacion…
answer-submitting = Mandâjo…
answer-checking-status = Vèrificacion de la rèponsa
answer-submitting-status = Mandâjo de la rèponsa
answer-correct = Justo
answer-incorrect = Fôx
answer-response-saved = Rèponsa enrègistrâ
answer-percent-credit = { $percent }% des pouents
answer-percent-correct = { $percent }% justo
answer-percent-short = { $percent } %
max-credit-available = Mâximo des pouents possiblos : { $percent }%
# `[0]` is its own sentence, not the singular of the counted one.
attempts-remaining =
    { $count ->
        [0] rèste gins d'assay
        [one] rèste { $count } assay
       *[other] rèstont { $count } assays
    }
validation-correct = (Justo)
validation-incorrect = (Fôx)
validation-partially-correct = (Justo a mêtiêt)
answer-show-responses =
    { $count ->
        [one] Montrar { $count } rèponsa a { $answerId }
       *[other] Montrar { $count } rèponses a { $answerId }
    }

## Disclosure panels

feedback-heading = Comentèros
collapsible-click-to-open = (cllicâd por uvrir)
collapsible-click-to-close = (cllicâd por cllôre)
collapsible-initializing = Enmanchement…
footnote-show = Montrar la nota
footnote-hide = Cachiér la nota
description-more-information = més d'informacion

## Controls

slider-previous = Prècèdent
slider-next = Siuvent
keyboard-open = Uvrir lo cllavièr
keyboard-close = Cllôre lo cllavièr
choice-input-remove-choice = Enlevar { $choice }
matrix-remove-row = Enlevar una legne
matrix-add-row = Apondre una legne
matrix-remove-column = Enlevar una colona
matrix-add-column = Apondre una colona
subset-add-remove-points = Apondre/enlevar des pouents
subset-toggle-points-intervals = Chanjiér entre los pouents et los entèrvalos
subset-move-points = Dèplaciér los pouents
subset-clear = Èfaciér
orbital-add-row = Apondre una legne
orbital-remove-row = Enlevar una legne
orbital-add-box = Apondre una bouèta
orbital-remove-box = Enlevar una bouèta
orbital-add-up-arrow = Apondre una fllèche vers lo hôt
orbital-add-down-arrow = Apondre una fllèche vers lo bâs
orbital-remove-arrow = Enlevar una fllèche
orbital-row-label = Ètiquèta de la legne { $row }
pretzel-answer = Rèponsa

## Math input

math-input-preview-region = apèrçu de l'expression matèmatica
math-input-preview = Apèrçu
math-input-invalid-expression = Expression pas valabla :

## Document status

viewer-initializing = Enmanchement…

## Errors

error-heading = Èrror
error-found-at =
    { $span ->
        [line] Trovâ a la legne { $startLine }.
       *[lines] Trovâ a les legnes { $startLine }–{ $endLine }.
    }
document-contains-errors = Cél document at des èrrors !
diagnostic-heading-error = Èrror
diagnostic-heading-warning = Avèrtissement
diagnostic-heading-information = Informacion
diagnostic-heading-hint = Suggèstion
accessibility-heading-level-1 = Violacion de l'accèssibilitât WCAG AA
accessibility-heading-level-2 = Alèrta d'accèssibilitât
something-went-wrong = Y at quârque-ren que 'l est alâ de travèrs.
renderer-load-failed = un module d'afichâjo at pas étâ chargiê. Rechargiéd la pâge, s'el vos plét.
core-start-failed = Cél document at pas pouessu étre enmanchiê. Rechargiéd la pâge, s'el vos plét.
core-start-failed-busy = Cél document at pas pouessu étre enmanchiê. Plusiors documents s'enmanchévont a la vês, cen que pôt prendre més de temps sur una machina més lenta. Rechargiér la pâge porrat étre utilo quand los ôtros documents seront finis.
core-start-failed-retry = Cél document at pas pouessu étre enmanchiê.
core-start-failed-busy-retry = Cél document at pas pouessu étre enmanchiê. Plusiors documents s'enmanchévont a la vês, cen que pôt prendre més de temps sur una machina més lenta.
core-start-retry = Tornar assayér
saved-state-unavailable = Voutron travâly enrègistrâ at pas pouessu étre chargiê.
