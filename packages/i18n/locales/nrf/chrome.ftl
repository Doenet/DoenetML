# Norman (Nouormand) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Which Norman.** The tag `nrf` covers the whole of Norman: **Jèrriais**
# (Jersey), **Guernésiais** (Guernsey, with Sercquiais and Auregnais beside
# it), and **continental Norman** — Cotentinais, Augeron, Cauchois and the
# rest of mainland Normandy. There is no pan-Norman standard. This catalog is
# written in **Jèrriais**, in the orthography of **Frank Le Maistre's
# *Dictionnaire Jersiais–Français* (1966)**, which is the only Norman variety
# with a dictionary, a grammar, a settled spelling, a school programme and a
# living printed press behind it, and is therefore the one a seed can be
# written in without inventing a norm. A Guernésiais or Cotentin reviewer
# should expect to *respell* rather than to correct: «bliu» is Guernésiais
# «bleu», «muchi» is continental «muchi» / «cachi», and the Jèrriais dental
# `th` has no counterpart on the mainland at all.
#
# **Script and orthography.** Latin script, Le Maistre's spelling. Its marks,
# as this catalog uses them: **«th»** for the Jèrriais dental fricative,
# which is the single most visible thing on the page («nièthe», «figuthe»,
# «borduthe», «erreu» keeps none but «mesuthe» does); **«bl» → «bli»** and
# **«pl» → «ply»** («blianc», «bliu», «remplyi», «exempl'ye»); **«tch»** and
# **«dg»** for the palatals, where French has `qu`/`c` and `g`/`j`
# («tchestion», «tchi», «rédgion», «dgèrre»); **«ou»** for [u]; and the
# circumflex and grave accents of the dictionary («rêponse», «êpais»,
# «prêcédent»).
#
# **What is Norman's own.** The negator is **«pon»** — Jèrriais negates with
# `n'… pon`, not `n'… pas`, and it appears in this catalog wherever English
# says *not* or *no*. The relativiser is **«tchi»**. The copula is «êt'»
# («est», «sont»), and *to have* is «aver» («a», «ont»). The connectives are
# Norman: **«auve»** for *with* (not `avec`), «sans» for *without*, «sus» for
# *on*, «pour» for *in order to*, «entre» for *between*, «ou» for *or*, «si»
# for *if*, «autrément» for *otherwise*. The verbs on the buttons are
# Jèrriais: «ouvri» (open), «framer» (close), «montrer» (show), **«muchi»**
# (hide), «ajouter» (add), «ôter» (remove), **«bouogi»** (move), «effacer»
# (erase), «r'sayi» (try again), «cliqu'ter» (click). «essai» (attempt),
# «ligne» (line, row), «point», «page», «boête» (box), «flèche» (arrow) and
# «erreu» (error) are ordinary Jèrriais nouns.
#
# **What is borrowed.** The technical register is **French, respelled by Le
# Maistre's rules**: «rêponse», «vèrification», «maximum»,
# «gardé», «înformâtion», «expression», «mathémâtique», «statistique»,
# «colonne», «întervalle», «module», «document», «accessibilité»,
# «violâtion», «êtitchette», «orbital». That is the honest register: schooling
# in Jersey is in **English**, and no Norman computing vocabulary has ever
# been published. «aperçu» (preview) and «Coumenta» (feedback) are the two
# weakest entries in the file — French loans in Jèrriais dress, not attested
# Jèrriais words — and «clavyi» (keyboard) is a third. `WCAG AA` is the
# standard's name and is not a word.
#
# **Counts.** `Intl.PluralRules` has **no CLDR data for `nrf`** — the tag
# resolves against the runtime's default locale, so any `[zero]`, `[two]`,
# `[few]` or `[many]` branch would be a branch nothing here can select.
# **None is written anywhere in this catalog.** `[one]` *is* kept in the two
# counted messages below, and it is doing real work rather than being
# tolerated: Jèrriais writes its plural, on the noun («un essai» / «deux
# essais») and on the verb («reste» / «restent»), so the two branches are two
# different sentences. `attempts-remaining` keeps its `[0]` literal, which is
# a different mechanism and legal everywhere.
#
# **Punctuation.** Jersey typography follows **English** practice, so there
# is **no space before** `:`, `;`, `?` or `!` anywhere in these four files —
# except the three `data-frame-*` messages, which reproduce the odd
# `componentIdx :` spacing of the English original rather than tidy it, the
# same way `locales/en` records it.
# That is a deliberate choice and the one place this catalog parts from
# `locales/fr`; a continental Norman reviewer may well want the French
# spacing back.
#
# **Weakest first.** A reviewer should attack, in order: «aperçu»,
# «Coumenta» and «clavyi»; then the `th` spellings, which this seed applies
# only where it was sure of the word; then the imperatives on the buttons.


## Answer submission

answer-checking = Vèrification…
answer-submitting = Envyi…
answer-checking-status = Vèrification d'la rêponse
answer-submitting-status = Envyi d'la rêponse
answer-correct = Juste
answer-incorrect = Pon juste
answer-response-saved = Rêponse gardée
answer-percent-credit = { $percent }% des points
answer-percent-correct = { $percent }% juste
answer-percent-short = { $percent } %
max-credit-available = Maximum des points possibl'yes: { $percent }%
# `[0]` is its own sentence, not the singular of the counted one.
attempts-remaining =
    { $count ->
        [0] i' n' reste pon d'essai
        [one] i' reste { $count } essai
       *[other] i' restent { $count } essais
    }
validation-correct = (Juste)
validation-incorrect = (Pon juste)
validation-partially-correct = (Juste en partie)
answer-show-responses =
    { $count ->
        [one] Montrer { $count } rêponse à { $answerId }
       *[other] Montrer { $count } rêponses à { $answerId }
    }

## Disclosure panels

feedback-heading = Coumenta
collapsible-click-to-open = (cliqu'tez pour ouvri)
collapsible-click-to-close = (cliqu'tez pour framer)
collapsible-initializing = En c'menchant…
footnote-show = Montrer la note d'bas d'page
footnote-hide = Muchi la note d'bas d'page
description-more-information = pus d'înformâtion

## Controls

slider-previous = Prêcédent
slider-next = Siêvant
keyboard-open = Ouvri l'clavyi
keyboard-close = Framer l'clavyi
choice-input-remove-choice = Ôter { $choice }
matrix-remove-row = Ôter eune rangie
matrix-add-row = Ajouter eune rangie
matrix-remove-column = Ôter eune colonne
matrix-add-column = Ajouter eune colonne
subset-add-remove-points = Ajouter/ôter des points
subset-toggle-points-intervals = Changi entre les points et les întervalles
subset-move-points = Bouogi les points
subset-clear = Effacer
orbital-add-row = Ajouter eune rangie
orbital-remove-row = Ôter eune rangie
orbital-add-box = Ajouter eune boête
orbital-remove-box = Ôter eune boête
orbital-add-up-arrow = Ajouter eune flèche en haut
orbital-add-down-arrow = Ajouter eune flèche en bas
orbital-remove-arrow = Ôter eune flèche
orbital-row-label = Êtitchette d'la rangie { $row }
pretzel-answer = Rêponse

## Math input

math-input-preview-region = aperçu d'l'expression mathémâtique
math-input-preview = Aperçu
math-input-invalid-expression = Expression pon valabl'ye:

## Document status

viewer-initializing = En c'menchant…

## Errors

error-heading = Erreu
error-found-at =
    { $span ->
        [line] Trouvé à la ligne { $startLine }.
       *[lines] Trouvé ès lignes { $startLine }–{ $endLine }.
    }
document-contains-errors = Ch't' document-chîn a des erreurs!
diagnostic-heading-error = Erreu
diagnostic-heading-warning = Avèrtissement
diagnostic-heading-information = Înformâtion
diagnostic-heading-hint = Suggestion
accessibility-heading-level-1 = Violâtion d'l'accessibilité WCAG AA
accessibility-heading-level-2 = Alèrte d'accessibilité
something-went-wrong = I' y'a tchiquechose tchi n'a pon marchi.
renderer-load-failed = un module d'affichage n'a pon 'té chèrgi. Rechèrgiz la page, s'ous pliaît.
core-start-failed = Ch't' document-chîn n'a pon peu êt' c'menchi. Rechèrgiz la page, s'ous pliaît.
core-start-failed-busy = Ch't' document-chîn n'a pon peu êt' c'menchi. Pus d'un document c'menchaient en même temps, tchi peut prendre pus d'temps sus eune machine pus lente. Rechèrgi la page pouorra aidgi quand les aut's documents s'sont fini.
core-start-failed-retry = Ch't' document-chîn n'a pon peu êt' c'menchi.
core-start-failed-busy-retry = Ch't' document-chîn n'a pon peu êt' c'menchi. Pus d'un document c'menchaient en même temps, tchi peut prendre pus d'temps sus eune machine pus lente.
core-start-retry = R'sayi
saved-state-unavailable = Vot' travas gardé n'a pon peu êt' chèrgi.
