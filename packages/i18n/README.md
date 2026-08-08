# `@doenet/i18n`

Message catalogs and translation utilities shared by every DoenetML surface:
the viewer chrome, the web worker, and the language server.

This package is **never published**. Its `vite.config.ts` has no
`transform-package-json` step and it is absent from the publish targets in
`.github/workflows/publish.yml`, so its source rides out inside
`@doenet/doenetml` (and from there `@doenet/standalone` and
`@doenet/doenetml-iframe`). Never list it in a changeset — see
[`.github/skills/changesets/SKILL.md`](../../.github/skills/changesets/SKILL.md).

## The two locales

DoenetML separates the language of the *content* from the language of the
*chrome*, because they genuinely differ: a Spanish-speaking student may work a
French physics problem, and a French activity embedded in an English course
should still say "thick red line" in French.

| Setting          | Selects                                                 | Namespaces                |
| ---------------- | ------------------------------------------------------- | ------------------------- |
| `documentLocale` | Prose the core computes into the document               | `content`                 |
| `uiLocale`       | Everything addressed to whoever is looking at the screen | `chrome`, `diagnostics`, `editor` |

`<document lang>` wins over the `documentLocale` prop, which falls back to
`"en"`. `uiLocale` defaults to `documentLocale`, so a fully Spanish activity is
fully Spanish without the host configuring anything.

`resolveDocumentLocale` applies that rule and supplies `"en"` when nobody
declared anything. One tag, two consumers: the core translates into it, and the
viewer puts it in the `lang` attribute on the rendered wrapper, so the DOM never
claims a language the content was not rendered in. An undeclared activity is
labeled `en` — not a guess about what its author wrote, but a report of the
language the core computed its prose in.

That wrapper settles one language for the activity as a whole; a nested
`<document lang>` labels its own subtree on top of it. `<document>`'s
`renderedLang` state variable hands the section renderer a tag only when the
nested document's language differs from the one already in effect around it,
and the renderer emits `lang` only when it is given one. A nested document that
merely restates the surrounding language stays silent, because the DOM already
says it.

`resolveUiLocale` applies the chrome's rule — the configured `uiLocale`,
otherwise the content's language. Both normalize what they return (`ES-mx` →
`es-MX`) and treat a blank tag as unset, so a hand-typed `lang` and a
hand-configured prop negotiate the same way a canonical tag does.

A tag they cannot parse is left alone rather than rejected — `en_US`, the POSIX
spelling, is the usual way a host mis-keys a catalog, and rewriting it would
stop that catalog from being found. So such a tag keys and negotiates like any
other; what it must not do is reach `Intl`, which refuses it outright.
`createTranslator` therefore builds the bundle's formatter under English
whenever the tag is one `Intl` can't parse — otherwise Fluent's
`Intl.PluralRules` throws and the whole message resolves to `{???}` — and
`createDiagnosticFormatter` joins its lists the same way. The host's own words
are kept; only the counting and number conventions fall back.

## Catalog layout

```
locales/<locale>/
  chrome.ftl        # viewer UI (buttons, feedback headers)  — uiLocale
  content.ftl       # worker-generated content               — documentLocale
  diagnostics.ftl   # warnings and errors                    — uiLocale
  editor.ftl        # editor and LSP surfaces                — uiLocale
```

English is the source of truth. Every translation — `ace`, `af`, `ak`, `am`,
`ar`, `arn`, `as`, `ast`, `ay`, `az`, `ban`, `be`, `bg`, `bik`, `bm`, `bn`,
`br`, `bs`, `ca`, `ceb`, `ch`, `co`, `cs`, `cy`, `da`, `de`, `ee`, `el`, `es`,
`et`, `eu`, `fa`, `fi`, `fil`, `fj`, `fo`, `fr`, `fy`, `ga`, `gd`, `gl`, `gn`,
`gu`, `ha`, `haw`, `he`, `hi`, `hil`, `hnj`, `hr`, `ht`, `hu`, `hy`, `id`, `ig`,
`ilo`, `is`, `it`, `ja`, `jv`, `ka`, `kk`, `km`, `kn`, `ko`, `ky`, `lb`, `lg`,
`ln`, `lo`, `lt`, `lv`, `mad`, `mg`, `mi`, `min`, `mk`, `ml`, `mn`, `mr`, `ms`,
`mt`, `my`, `nah`, `nb`, `nds`, `ne`, `nl`, `ny`, `oc`, `oj`, `om`, `or`, `pa`,
`pam`, `pl`, `ps`, `pt`, `qu`, `quc`, `rm`, `ro`, `ru`, `rw`, `sc`, `scn`, `sd`,
`se`, `si`, `sk`, `sl`, `sm`, `sn`, `so`, `sq`, `sr`, `st`, `su`, `sv`, `sw`,
`ta`, `te`, `tet`, `tg`, `th`, `ti`, `tk`, `tlh`, `tn`, `to`, `tpi`, `tr`, `tt`,
`ty`, `ug`, `uk`, `ur`, `uz`, `vi`, `war`, `wo`, `xh`, `yi`, `yo`, `zh-Hans`,
`zh-Hant`, `zu` — is an **unreviewed machine-generated seed**, which each file's
own header says at the top, and which is what #1521's translation platform is
for. None has been read by a speaker. Correcting one needs no permission and no
coordination: a wrong string is just wrong, and the English is one key away.

Seventy-four of them are deliberately partial. Seventy-three are partial in the
same place — the two chemistry tables — while Klingon is partial almost
everywhere, for a different reason: see
[A language with no word for it](#a-language-with-no-word-for-it). The
seventy-three are: Somali, Hmong Njua, Amharic, Assamese, Nepali, Burmese,
Pashto, Sindhi, Uyghur, Kannada, Punjabi, Filipino, Vietnamese, Zulu, Xhosa,
Kinyarwanda, Nyanja, Hausa, Yoruba, Igbo, Oromo, Khmer, Lao, Sinhala, Cebuano,
Malagasy, Māori, Samoan, Hawaiian, Wolof, Bambara, Akan, Ewe, Lingala, Shona,
Southern Sotho, Setswana, Tigrinya, Ganda, Luxembourgish, Western Frisian, Low
German, Romansh, Occitan, Asturian, Sardinian, Sicilian, Corsican, Northern
Sami, Yiddish, Haitian Creole, Quechua, Guarani, Aymara, Nahuatl, Kʼicheʼ,
Mapudungun, Ojibwe, Ilocano, Waray, Hiligaynon, Kapampangan, Bikol, Balinese,
Minangkabau, Acehnese, Madurese, Tetum, Tongan, Fijian, Tahitian, Chamorro and
Tok Pisin leave `element-name` and `element-anion-name` out, so those 130 keys
fall back to English and `lint:i18n` reports the gap.
The first nine have no settled chemical nomenclature to seed from, and
inventing one would be worse than the English a student meets in their own
textbook. Kannada has two — native coinages reaching a dozen elements and
transliterations reaching all 118 — and picking either would misreport the
other. Punjabi, Filipino and Vietnamese have two as well, and in all three the
current one is English: Punjabi secondary chemistry uses the English terms, the
Philippines teaches science in English from the intermediate grades, and
Vietnamese school chemistry has moved from the transliterated names to the
IUPAC forms, so in each case the fallback is already what the curriculum uses.
The eight from the first sub-Saharan batch are that same case for a different
reason: secondary science is taught in English, French or Afrikaans across all
of them, so the fallback *is* the curriculum. Afrikaans and Swahili are the two
of that batch that do have a settled list and supply it.

The eight from the Southeast Asian and Pacific batch split three ways, and the
split is worth keeping straight because only one of the three is a claim about
the language. Cebuano is the Filipino case again and for the same school
system, and Malagasy the French-medium case; Samoan and Hawaiian have no
settled list of all 118 to seed from, and neither does Māori, whose
kura-taught science coins terms without having reached the whole table.
Khmer, Lao and Sinhala are the one group where the language *does* have the
names — all three are taught chemistry in their own language, out of textbooks
that print their own transcriptions — and what is missing is a convention this
seed could reproduce rather than invent. An unreviewed guess written in a
script the reader cannot check against the English beside it is worse than the
English, so those three are the first place a speaker should look, and the
catalogs say so in their own headers.

Javanese and Sundanese are the two of that batch's ten that supply the names,
and they are a case of their own: their schools teach chemistry out of
Indonesian-language textbooks, so the scientific names are the Indonesian ones
`locales/id` already carries. Both keep their own words for the substances
known long before the elements were — «wesi» and «beusi» for iron, «walirang»
for sulfur, «warangan» for arsenic — which is where the two catalogs differ
from `id` and from each other.

All ten of the second sub-Saharan batch — Wolof, Bambara, Akan, Ewe, Lingala,
Shona, Southern Sotho, Setswana, Tigrinya and Ganda — are partial too, and
unlike the batches above them they split no ways at all: every one of the ten
is the school-system case. Secondary science is taught in English across
Ghana, Zimbabwe, Botswana, Lesotho, Uganda, Eritrea and Tigray, and in French
across Senegal, Mali and both Congos, so in all ten the fallback *is* the
curriculum. That is a fact about ten education ministries rather than about ten
languages, which is why it reads as one sentence here and takes a sentence of
its own in each catalog's header.

Eleven of the twelve European regional and minority languages are partial for
the school-system reason as well, and the eleven are not one story but the same
story told in six school systems: Occitan and Corsican are taught out of French
textbooks, Asturian out of Spanish, Sardinian and Sicilian out of Italian,
Western Frisian out of Dutch, Low German and Luxembourgish out of German —
Luxembourg's upper grades in French as well — and Romansh-medium schooling
stops below the grades where the periodic table is taught. Northern Sami is the
one of the eleven where the schooling *is* in the language and the table still
does not settle: a Sami pupil meets the Norwegian, Swedish or Finnish names
depending on which side of a border the school is, and those three differ, so
choosing any of them would report a fact about a border. Yiddish has the
vocabulary in its scientific writing and no school system teaching secondary
chemistry in it, which is the Samoan case rather than the French one.

Bosnian is that batch's one complete catalog, and it is the Swahili case: its
schools teach chemistry in it out of textbooks that print the whole table. The
list is close to `locales/hr`'s without being a copy — «kalaj» against
Croatian's «kositar», «hlor» against «klor», and, in the two messages at the
foot of the file, «hemijski» for «kemijski» and «jonski» for «ionski».

**All eight of the Indigenous Americas batch are partial, and it is the first
batch with no complete catalog in it at all.** That is not eight languages
failing a test; it is one fact about eight education ministries, and the split
inside it is worth keeping because only part of it is about the languages.

Seven of the eight are the colonial-medium case, told in three school systems.
Quechua, Aymara, Guarani, Nahuatl, Kʼicheʼ and Mapudungun are taught out of
Spanish textbooks once the periodic table appears — in Peru, Bolivia, Paraguay,
Mexico, Guatemala, Chile and Argentina — and Haitian Creole out of French ones.
Every one of those seven reaches real classrooms, and Guarani reaches further
than any other language in the batch, being co-official in Paraguay; but
bilingual education in all seven is the primary grades and the language
classroom, and secondary chemistry is not. So in all seven the fallback *is* the
curriculum, which is the same sentence the two sub-Saharan batches earned and
for the same reason.

Ojibwe is the eighth and a different case: its schooling is immersion and
language revitalization, and it stops below the grades where the table is
taught. It is also the one where coining a list would be hardest rather than
merely unreviewed — a Nahuatl or Quechua coinage is a name, and an Ojibwe one is
a whole descriptive verb, so 118 of them would be 118 sentences invented by a
machine. That is the Samoan case with an extra reason on top of it.

None of the eight is the Kannada case of having two lists and having to pick,
and none is the Khmer case of having the names but no convention to reproduce.
They simply do not have the table, and the catalogs say so in their own headers
rather than leaving a reader to infer it from a gap.

**All fifteen of the Austronesian batch are partial too, and they split four
ways**, only one of which is a claim about a language. Ilocano, Waray,
Hiligaynon, Kapampangan, Bikol, Chamorro and Tok Pisin are the English-medium
case — the Philippines from the intermediate grades, Guam and the Northern
Marianas, Papua New Guinea — which is the `fil` and `ceb` case those two
catalogs already record. Balinese, Minangkabau, Acehnese and Madurese are the
Indonesian-medium case, and they differ from `jv` and `su` in an instructive
way: those two *supply* the Indonesian names, because their own vocabulary for
the substances agrees with Indonesian's often enough that the table reads as
theirs. These four do not, and copying it whole would be neither language —
Minangkabau says «ameh» where Indonesian says «emas» — so where `jv` and `su`
chose to carry the table, these choose to leave it. Tetum and Tahitian are the
colonial-medium case a third and fourth time, Portuguese and French, which is
`locales/ht`'s exactly.

Tongan and Fijian are the fourth case and the one about the languages: both are
schooled in English, but neither has a settled list of all 118 to seed from
without inventing one, which is the Samoan and Hawaiian case in `locales/sm`
and `locales/haw` — Pacific languages naming the substances known long before
the elements were, with no table over them. Chamorro's header records that
second reason beside its school system, since Guam's periodic table arrived
through English rather than through the Spanish the rest of its vocabulary came
from.

That is a decision per language and not per script: Bangla supplies the names
its schools use, and Assamese, written in the same letters, does not. The same
line runs through the Arabic script — Arabic, Persian and Urdu supply them and
Pashto, Sindhi and Uyghur do not — and through the Brahmic scripts of southern
India, where Tamil, Telugu and Malayalam supply them and Kannada does not. It
runs through a language family too: Swahili supplies them and Zulu, Xhosa,
Kinyarwanda and Nyanja do not, which is a fact about five school systems rather
than about Bantu.

A directory is named for a **script** rather than a language only where two
scripts of one language are translated separately, which today is Chinese.
Name that pair `zh-Hans` and `zh-Hant`, never `zh`: filtering negotiation tries
the region-stripped tag before it consults likely-subtags, so a directory named
`zh` answers `zh-TW`, `zh-HK` and `zh-MO` ahead of `zh-Hant` and serves a
Traditional reader Simplified text. Named by script, every tag reaches the
catalog it should, and bare `zh` reaches `zh-Hans` because that is what CLDR
fills it in as. `negotiate.test.ts` holds this.

Keep both complete rather than layering one over the other. A Traditional tag
negotiates to `["zh-Hant", "en"]`, so a key missing there renders in English —
the right outcome, since the wrong script is not a partial translation but a
different one. It is not symmetric: `zh-CN` and `zh-SG` negotiate to
`["zh-Hans", "zh-Hant", "en"]`, since filtering offers every `zh-*` catalog it
has, so a gap in `zh-Hans` can be filled from `zh-Hant` on a page holding both.

Norwegian is the other case where the tag a reader arrives under is not the tag
a directory is named for. `nb` is Bokmål specifically; `no` is the
macrolanguage over Bokmål and Nynorsk, and it is what a hand-typed
`<document lang>` usually says and what several browsers still send. Nothing in
filtering negotiation connects the two, so `negotiate.ts` rewrites the language
subtag before negotiating — the same service `Intl.getCanonicalLocales` already
performs for `iw`, `in` and `mo`, which it maps to `he`, `id` and `ro` on its
own. `nn` is left alone: Nynorsk is a written standard of its own, and
answering it with Bokmål would be a substitution rather than a
canonicalization.

Filipino needs no such entry, and that is worth saying so nobody adds one:
`fil` is the standard language's code and `tl` is the deprecated one, so
`Intl.Locale` canonicalizes `tl` to `fil` and `normalizeLocaleTag` has already
rewritten it before negotiation is reached. `negotiate.test.ts` holds that too,
against the real roster rather than a stub — a change to the normalization step
is the only thing that could drop Filipino to English, and this is what would
catch it.

The roster names a language whatever CLDR names it, which is why Chichewa
appears as **Nyanja** in `<document lang>`'s autocomplete: `ny` is the code,
`Intl.DisplayNames` renders it "Nyanja", and `supportedLocales.ts` is derived
rather than hand-written so that adding a language costs no prose. The two
names are one language, and the catalog's own header says so.

Punjabi is named `pa` and written in Gurmukhi, which the rule above allows
because only one of its two scripts is translated. A Shahmukhi reader arriving
under `pa-Arab` reaches it and gets Gurmukhi — the same asymmetry `zh-CN`
already has, and the answer to it is a second catalog rather than a differently
named first one.

Hausa is the same case again: `ha` is Boko, the Latin orthography its schools,
its publishing and CLDR all use, and a reader arriving under `ha-Arab` reaches
it and gets Boko. Ajami is still written, so if it is ever seeded it is a
`ha-Arab` catalog beside this one rather than a rename of it.

Serbian is that same shape a fourth time. `sr` is written in Cyrillic, which is
what CLDR fills a bare `sr` in as, and a reader arriving under `sr-Latn` reaches
it and gets Cyrillic. `sh` — the retired Serbo-Croatian code — needs no entry in
`LANGUAGE_ALIASES` either: `Intl.getCanonicalLocales` maps it to `sr-Latn` on
its own, and that lands on the same catalog. Croatian is a directory of its
own rather than a script of Serbian's, because the two are separate standard
languages with separate vocabularies; `locales/hr` and `locales/sr` pick
different words for the same border and so inflect it differently.

Four more of the same shape arrive with the Turkic and Inner Asian batch, and
they are worth listing because two of them go the opposite way from each other.
`az` and `uz` are Latin — the official orthography in Azerbaijan and Uzbekistan
and what CLDR fills a bare tag in as — so a reader arriving under `az-Cyrl`,
`uz-Cyrl` or `uz-Arab` reaches them and gets Latin. `kk` and `mn` are Cyrillic
for exactly the same reason, so Kazakhstan's incoming Latin orthography and a
reader arriving under `mn-Mong` reach a Cyrillic catalog. In all four the answer
to the mismatch is a second catalog beside the first rather than a rename of it.
None of the ten needs an entry in `LANGUAGE_ALIASES`: every regional tag over
them — `az-AZ`, `uz-UZ`, `kk-KZ`, `mn-MN`, `hy-AM`, `ka-GE` — filters to its
catalog unaided.

The Celtic, North Atlantic and western-European batch raises none of this: all
ten are Latin-script languages with one settled orthography apiece, and every
regional tag over them — `ga-IE`, `gd-GB`, `cy-GB`, `br-FR`, `is-IS`, `fo-FO`,
`eu-ES`, `ca-ES`, `ca-AD`, `gl-ES`, `mt-MT` — filters to its catalog with no
alias.

The Southeast Asian and Pacific batch adds one script case and one that is not
about script at all. `jv` and `su` are Javanese and Sundanese in Latin letters,
which is what the schooling, the publishing and CLDR of both use, so a reader
arriving under `jv-Java` or `su-Sund` — the Javanese and Sundanese scripts —
reaches them and gets Latin, the same asymmetry `pa` and `sr` already have and
with the same answer: a second catalog beside the first rather than a rename of
it.

The other is **speech level**, and it is a decision a catalog cannot avoid
making. Javanese and Sundanese choose a register for every sentence, and a
file with two registers in it is wrong in both, so each of those two locales is
written at its unmarked everyday level throughout — ngoko for Javanese, loma
for Sundanese — and every one of their eight file headers says so. Those are
the levels
Javanese and Sundanese writing addressed to a general reader uses, and the
polite registers would be derived from them rather than the other way round. A
deployment that wants krama or lemes supplies its own catalog as
`localeResources`, which wins over the shipped one; correcting these files
sentence by sentence toward a different level is what would leave the locale in
two registers at once.

The second sub-Saharan batch adds three naming cases and no direction case:
nine of the ten are Latin-script, and Tigrinya's Ge'ez runs left to right, so
none of them needs anything from `direction.ts`.

`lg` appears in `<document lang>`'s autocomplete as **Ganda** rather than
Luganda, for the same reason Chichewa appears as Nyanja: `Intl.DisplayNames`
renders it that way and `supportedLocales.ts` is derived rather than
hand-written. `st` is likewise **Southern Sotho** and not Sesotho, and `tn` is
**Tswana** and not Setswana. In all three the two names are one language, and
all three catalogs' headers say so.

`ak` is the macrolanguage, and the catalog is written in **Asante Twi** — the
variety Ghanaian schooling and publishing use and what CLDR fills a bare `ak`
in as. It is the one locale in this batch that needs an entry in
`LANGUAGE_ALIASES`, and it is the Norwegian case a second time: `tw` is the
retired code for Twi, `Intl.getCanonicalLocales` leaves it alone rather than
rewriting it the way it rewrites `iw` and `in`, and a hand-typed
`<document lang="tw">` would otherwise fall to English with nothing to say why.
So `negotiate.ts` maps `tw` to `ak`. Fante is deliberately left out, exactly as
Nynorsk is: it is a written standard of its own, and answering `fat` with an
Asante Twi catalog would be a substitution rather than a canonicalization.
`negotiate.test.ts` holds both halves against the real roster.

None of the other nine needs an alias — `wo-SN`, `bm-ML`, `ee-GH`, `ee-TG`,
`ln-CD`, `sn-ZW`, `st-LS`, `st-ZA`, `tn-BW`, `ti-ER`, `ti-ET` and `lg-UG` all
filter to their catalogs unaided.

Setswana and Southern Sotho are close enough that it is worth recording why
they are two files rather than one with a script tag: they are two standard
languages with two orthographies and two vocabularies. `locales/tn` writes
«kgotsa» where `locales/st` writes «kapa», «boammaaruri» where it writes
«nnete», and «-hibidu» where it writes «-fubedu». Copying either over the other
would be wrong in both, which is the same reason `hr` is a directory of its own
rather than a script of `sr`.

The European regional and minority batch adds two script asymmetries, one
direction case that costs nothing, and no alias at all.

`bs` is Bosnian in Latin letters, which is what CLDR fills a bare tag in as and
what its schools and publishing use, so a reader arriving under `bs-Cyrl`
reaches it and gets Latin — the same asymmetry `pa` and `sr` already have, with
the same answer: a second catalog beside it rather than a rename of it. `nds` is
Northern Low Saxon in the German-based orthography, so a reader arriving under
`nds-NL` — Dutch Low Saxon, written in a Dutch-based one — reaches it and gets
the German-based spelling.

`yi` is the batch's right-to-left catalog and needed nothing from
`direction.ts`, which already listed both `yi` and the retired `ji`. See
[Writing a right-to-left catalog](#writing-a-right-to-left-catalog).

None of the twelve needs an entry in `LANGUAGE_ALIASES`. `ji` is the Filipino
case — `Intl.Locale` canonicalizes it to `yi` before negotiation is reached —
and so is `sme`, the ISO 639-3 code for Northern Sami, which folds to `se`.
`negotiate.test.ts` holds both against the real roster, along with the region
and script tags above.

Two of the twelve are written standards over a spread of varieties, and both
catalogs say which one they are. `sc` is the **Limba Sarda Comuna**, the
standard the Regione Autònoma de Sardigna publishes in, and `rm` is **Rumantsch
Grischun**, the common written standard rather than any of the five idioms. In
both, a deployment that wants a variety supplies its own catalog as
`localeResources`; correcting the shipped file toward Campidanese or Vallader
sentence by sentence is what would leave it in two standards at once, which is
the trade `locales/jv` and `locales/su` already make with speech level.

`co` is the batch's one locale whose **endonym comes back as its English
name**. `supportedLocales.ts` asks `Intl.DisplayNames` for a language's name in
itself, CLDR has no Corsican-language data to answer with, and the fallback is
English — so `endonym` equals `englishName`, the label drops its parenthesis,
and the roster reads "Corsican" once rather than "Corsican (Corsican)". It is
not the first to do that: `ak`, `ceb`, `fil`, `hnj`, `mg`, `mi`, `ny` and `sm`
already read that way, and so do the several whose endonym genuinely *is* the
English word — Afrikaans, Hausa, Igbo, Wolof. Nothing here hand-writes around
either case, which is why the rule that makes `ny` read "Nyanja" is the rule
that makes this read "Corsican".

The Indigenous Americas batch is the first to seed codes that stand for **more
than one individual language**, and doing so uncovered a real fallback bug rather
than merely needing a note.

`qu`, `ay`, `gn` and `oj` are ISO 639-3 macrolanguages and `nah` is an ISO 639-3
*collection* code: each covers a family of individual languages with codes of
their own. **CLDR's likely-subtags folds exactly one member of a macrolanguage to
it and leaves the rest unresolvable.** So `quz` reached `qu` on ICU data alone
and `quh` did not; `ojg` reached `oj` and `ojb` did not; `gug` reached `gn` and
`gui` did not. A Bolivian Quechua reader arriving under `quh` was getting English
with a `qu` catalog sitting on disk, and nothing said why.

`MACROLANGUAGE_MEMBERS` in `negotiate.ts` closes that. It keys on **published
membership** — ISO 639-3's for the four macrolanguages, ISO 639-5's grouping for
`nah` — which is what makes it checkable rather than a matter of taste, and what
distinguishes it from the `nn` and `fat` cases above: neither of those is a
member of `nb` or `ak`, and both are deliberately left to miss. The member CLDR
already folds is listed anyway, so each list reads as the whole of a group rather
than the leftovers of one, and so a change in ICU data cannot silently drop a
code out of coverage. `negotiate.test.ts` asserts both halves.

Algonquin is the nearest miss and the one worth naming: it is often called a
dialect of Ojibwe and is mutually intelligible with the Ontario varieties, but
ISO 639-3 gives it `alq` outside the `oj` macrolanguage, so it falls to English
like Fante does. That is the rule doing its job rather than a gap in the list —
the moment membership becomes a judgement about how close two varieties sound,
nothing in the map is checkable any more. `negotiate.test.ts` pins the exclusion
too.

Serving a related variety is a real compromise, and each of these catalogs says
in its own header which written standard it is: Southern Quechua in the
trivocalic orthography, Paraguayan Guarani in the *jopara* register, Central
Nahuatl in the SEP/INALI orthography, Ojibwe in the Fiero double-vowel
orthography, Mapudungun in the Alfabeto Mapuche Unificado — which is a choice
among three live orthographies rather than a neutral default, and its header says
so. A reader who wants their own supplies it as `localeResources`. What the map
buys is that they get a language they can read instead of English, which is the
same trade region-stripping already makes for `es-MX`.

`oj` adds a script asymmetry of the kind `bs` and `pa` already have: Ojibwe is
written both in the Latin orthography this catalog uses and in syllabics, so a
reader arriving under `oj-Cans` reaches it and gets Latin.

`nah` is the first locale in the roster that CLDR has **no name for in either
language**. `supportedLocales.ts` gets the tag back from `Intl.DisplayNames` for
both the English name and the endonym, so `<document lang>`'s autocomplete offers
"nah" and nothing else. That is the documented fallback for a tag ICU does not
know — see the note on `localeNames` in `catalogUtils.ts` — and nothing here
hand-writes around it, which is the same rule that leaves `co` reading
"Corsican" twice. It is a gap in CLDR, and until it closes the label is the tag.

The Austronesian batch adds one macrolanguage, two script asymmetries and three
naming cases. What it adds to the affix rule belongs beside that rule rather
than here, and is in
[A ligature is an affix too](#a-ligature-is-an-affix-too).

`bik` is an ISO 639-3 macrolanguage over the eight Bikol languages of the Bicol
peninsula, so it joins `MACROLANGUAGE_MEMBERS` for the same published reason
`qu` and `oj` did. The catalog is **Central Bikol** (Naga), which is `bcl` — the
variety Bikol publishing and the mother-tongue materials use — and `bto`, `cts`,
`ubl` and the rest reach it. Tagalog is deliberately not in that list and must
not be added: `fil` is a language of its own with a catalog of its own, and
folding it would serve a Tagalog reader Bikol. `negotiate.test.ts` holds both
halves, and holds `pag` (Pangasinan) on English — a Philippine language that
belongs to no macrolanguage with a catalog, and so falls back rather than being
guessed at.

`ban` and `ace` add the script asymmetry `pa`, `sr`, `jv` and `su` already have:
both catalogs are Latin, so a reader arriving under `ban-Bali` (the Balinese
script) or `ace-Arab` (Jawi) reaches them and gets Latin. As ever the answer is
a second catalog beside the first rather than a rename of it.

The naming cases are the `ny`-reads-Nyanja rule again, and they are worth
listing because two of them will look like mistakes: `ilo` appears in
`<document lang>`'s autocomplete as **Iloko** rather than Ilocano and `pam` as
**Pampanga** rather than Kapampangan, because that is what `Intl.DisplayNames`
renders and `supportedLocales.ts` is derived rather than hand-written. Both
catalogs' headers say which language they are. The third is the `co` case at
scale: `to` is the only one of the fifteen whose **endonym** CLDR knows — the
roster reads "Tongan (lea fakatonga)" — and the other fourteen read their
English name once. None of the fifteen is right-to-left, so `direction.ts` is
untouched.

### A language with no word for it

`tlh` is **Klingon**, and it is the roster's first constructed language. Nothing
about delivering it is special: `tlh` is a registered IANA primary subtag with
an ISO 639-3 code, so it filters like any other individual language, needs no
entry in `LANGUAGE_ALIASES`, and belongs to no macrolanguage. `Intl` knows the
English name, so the roster reads **Klingon** — once, not twice, because CLDR
has no `tlh`-language data to answer the endonym with and the fallback is the
English name. That is the `co` case, with the twist that Klingon *has* a
well-known endonym («tlhIngan Hol») and CLDR simply does not carry it.

pIqaD is ISO 15924 `Piqd`, so `tlh-Piqd` is a well-formed tag and reaches the
Latin catalog. That is the `ban-Bali` and `ace-Arab` asymmetry with the answer
removed: everywhere else the answer to a script mismatch is a second catalog
beside the first, and here there cannot be one, because Unicode does not encode
pIqaD. Quenya (`qya`), Sindarin (`sjn`) and the ISO 639-2 collection code `art`
all fall to English, which is the membership rule working rather than a gap in
it — none of them is a member of `tlh`. `negotiate.test.ts` holds all of that.

What *is* new is the **shape of the gap**. Every other partial catalog leaves
out the chemistry tables because a school system teaches chemistry in another
language; the language has the words and the seed has no settled list to copy.
Klingon is the first partial for a lexical reason — its lexicon is closed, since
every word in it is one Marc Okrand has published — and `locales/tlh` translates
160 of the 562 keys, leaving the rest to English.

The line it draws is stated once in `content.ftl` and applied everywhere:

> A compound of canon words whose sense a speaker could work out is a
> description, and is written. A new root is an invention, and is not.

Under it «nagHom» — «nagh» (rock) with the canon diminutive — is a fair way to
say *dot*, and a word for *parabola* is not a translation of anything. It is the
argument `locales/oj` already makes about coining 118 element names, generalized
from one table to a whole catalog.

**The gap is much narrower than a first look suggests, and getting that wrong is
the mistake this catalog was drafted around before review caught it.** Okrand
has released a mathematics register over the years, well after TKD, so «mey'»
(polygon), «ra'Duch» (triangle), «letbaQ» (rectangle), «meyrI'» (square), «vI'»
(point), «baSta'» (vector) and «chav» (function) all exist and are all used. So
are «wa'chaw» (table), «wev» and «war» (row and column), «tenwal» (page) and
«vorgh» (be previous), each of which an earlier draft either coined around or
left to English. What is genuinely absent is smaller and stranger: *parabola*,
*polyline*, *curve* as a noun, and the vocabulary of a document editor —
*attribute*, *variant*, *matrix*, *snippet*, *accessibility*. **The lesson
generalizes past Klingon: "this language has no word for X" is a claim about a
word list, and it needs checking against the word list.**

**"Canon" is three different things, and `locales/tlh` says which one it means
every time it makes a claim.** The word list those geometry nouns come from
records a source for each entry, and the sources are not equivalent. Some words
are in the printed books — «gho» (circle), «tlhegh» (line), «tIH» (ray) and all
four colour terms are TKD entries. Some are Okrand's own but were released at a
`qep'a'` or `qepHom'a'` gathering or posted to the old `startrek.klingon`
newsgroup: «meyrI'», «me'cheD», «baSta'», «chav» in its mathematical sense,
«vorgh», «wa'chaw», «wev», «war», «tenwal» and «nItlh 'echlet» (keyboard). And
three of the geometry nouns — «mey'», «ra'Duch», «letbaQ» — rest on a *single*
relayed answer on the KLI mailing list, one post of 2014.01.27, with no second
attestation; «ghantoH» (example) and «nompuq» (reference) are the same. All
three classes are used and none is removed, but the catalogs mark the third
where it appears rather than presenting it flat as canon. That matters
precisely because of the argument the catalog makes for using these words at
all: the KLI does not coin vocabulary, it relays Okrand's — so the third class
is still his, and what a reader has to go on is one paraphrase. Telling them
which entries those are is what lets a speaker overrule the right ones.

`.diamond` is the instructive omission, because it is not a lexical gap at all.
Okrand's note on «chanmon» (the gemstone) says the diamond *shape* is «meyrI'»,
which the catalog already spends on `square`. Writing it would make a square
marker and a diamond marker report identically — the one distinction a shape
noun exists to carry — so the key falls back to English instead. That is the
opposite call from the colour table below, and the difference is that the colour
collapse is Klingon's own and this one would have been the catalog's.

The four files are lopsided as a result and instructively so: `chrome.ftl` is
nearly complete, because a button is a verb and Klingon is rich in verbs of
acting and judging, while `diagnostics.ftl` is the emptiest file in the
repository, because its two hundred messages are built out of the nouns that are
missing.

**Four colour words for twelve keys** is the sharpest instance, and the one
that costs something: Klingon's basic terms are «qIj», «chIS», «Doq» and «SuD»,
so after the collapse a blue curve and a green one report the same word, in
strings whose whole purpose is letting a reader who cannot see the graph tell
its objects apart. Tongan, Fijian and Tahitian met the mild form of this — one
key inside a neighbour's word — and this is the same thing at full size. The
collapse is left standing anyway, because coined colour words would be
inventions; a deployment that needs the distinction supplies them as
`localeResources`, in front of the readers who asked for it rather than in
front of everyone. Only `purple` and `pink` are placed with nothing canon behind
them — Okrand's own note puts brown under «Doq», and gray has the canon phrase
«qIj 'ej wov», which the table cannot hold because «-bogh» welds onto a single
verb. `content.ftl`'s header gives the mapping and `styleDescriptions.test.ts`
pins all twelve, so the day someone does coin the rest the test says which
distinctions they bought.

The chemistry tables are left to English here too, and for a third reason again:
«tamler wa'chaw» is the periodic table and roughly thirty of the 118 elements
have canon names, so what stops the table is that seventy percent of it would
still be English. That is the largest piece of real work left in the catalog.

A catalog's **comments are in English** whatever it translates into: its
header, its `##` group headings, and the notes explaining a wording choice.
They are addressed to whoever maintains the file, and no one maintaining it
reads them all — a note that cannot be read cannot be checked. Only the text to
the right of `=` is translated.

The split is by **load context**, not topic: the worker never draws chrome and
never renders a diagnostic, so it ships only `content` (`WORKER_NAMESPACES`).
English is inlined into every build via `?raw` imports — the worker cannot
reliably fetch a relative URL across the standalone/iframe/dedicated-worker
variants, so the fallback locale must not depend on the network.

English is the only language inlined. `createChromeTranslator` builds its own
English candidate with `englishResources(namespaces)` and merges host-supplied
`localeResources` over it, the host's copy winning for a locale in both;
`createTranslatorFromLocaleData` builds none, translating out of what reached
the worker and nothing else. Neither has to carry English for the fallback:
`createTranslator` appends the whole English catalog behind every chain.

Every translation is **loaded on demand** — see [Delivery](#delivery). At
roughly 16 KB gzipped for a complete one, inlining a language puts its weight on
every consumer whether or not anyone reads it, and no single language earns
that. English is exempt because every fallback chain ends there: it has to be
present with no network, in every bundling variant.

Note that `content` and `diagnostics` answer to *different* settings —
`documentLocale` and `uiLocale` respectively — which is why `WORKER_NAMESPACES`
is `content` alone. The worker knows only the content locale, and needs only
that: it renders `content` itself, but for a diagnostic it emits a code and the
values that fill the message in and lets the main thread render it. The English
it writes onto each record on the way past comes from the built-in English,
which `createTranslator` appends whole regardless of namespace, so a translated
diagnostics catalog inside the worker would never be read. See
[Diagnostics](#diagnostics) below.

### The roster is not the bundle

Two different questions get asked about locales, and they must be answered from
two different places:

| Question                              | Source of truth                               |
| ------------------------------------- | --------------------------------------------- |
| Which languages does DoenetML have?   | `SUPPORTED_LOCALES` — the `locales/` dirs     |
| Which catalogs are in this JS bundle? | `BUNDLED_LOCALES` — English, and only English |

`SUPPORTED_LOCALES` (`src/generated/supportedLocales.ts`, regenerated by
`codegen` and guarded by `lint:i18n`) is the roster: every locale with a
catalog directory, each with its name in English and in itself, derived at
codegen time from `Intl.DisplayNames` so that adding a language costs no
hand-written prose. The second answer is a delivery decision, and the two lists
have long since diverged: English is the only catalog inlined, and every other
one is fetched or code-split when a document or a reader asks for it (see
[Delivery](#delivery)).

Author-facing surfaces read the **roster**. That is what lets the editor offer
the languages in `<document lang>`'s autocomplete and help panel (via the
attribute's `suggestedValues` in the worker's `Document.js`) and keep offering
them after a locale stops being inlined. Reading `BUNDLED_LOCALES` for that
would offer the author English and nothing else.

Neither list is exhaustive from an author's point of view: a deployment can
hand over catalogs of its own as `localeResources`, which no build-time list
can know about. So the roster *suggests* and never *enforces* — `lang` accepts
any BCP-47 tag, and an unlisted one draws no diagnostic.

## Delivery

A locale that is not inlined still has to reach the browser. `load.ts` does
that, and the viewer calls it for you: `useLocaleCatalogs` (in
`@doenet/doenetml`'s `utils/i18n.tsx`) loads the catalogs for whatever tags are
in play and merges them *under* the host's `localeResources`, so a deployment
correcting a shipped translation still wins. Adding `locales/pt/` and running
`npm run codegen` is therefore the whole job — no list of languages to register
anywhere, and `documentLocale="pt"` and `<document lang="pt">` both work with
nothing configured. (The codegen step is what puts `pt` in `SUPPORTED_LOCALES`,
which is the list `fetchLocaleLoaders` offers by default; `lint:i18n` fails if
it is skipped.)

```ts
// What the viewer does. Returns {} for English, for a locale the caller says
// it already has, and for one nothing offers a catalog for. A served catalog
// that 404s or cannot be reached is {} too; only a code-split chunk that
// fails to load rejects, and `useLocaleCatalogs` catches that and leaves the
// locale on English.
const resources = await loadLocaleResources("de-AT", CATALOG_NAMESPACES);
// → { de: "<all four namespaces, concatenated>" }
```

The tag is negotiated the usual way, so `de-AT` loads `de` and comes back keyed
`de` — the key the fallback chain looks for. Requests are cached by what was
asked for, so N viewers on a page share one fetch.

The viewer asks for all four namespaces because the one map it builds serves
both jobs: the chrome reads three of them and the core, handed the same map as
`LocaleData.resources`, reads `content`. The namespaces stay a parameter
because each costs a request (or a chunk) of its own, so a context that renders
a subset — `WORKER_NAMESPACES`, which is `content` alone — need not move four
catalogs to get one.

Where the catalogs come from depends on the build, and the difference is real
rather than cosmetic:

| Build                     | Mechanism                                              |
| ------------------------- | ------------------------------------------------------ |
| `@doenet/doenetml`        | `import.meta.glob` — one code-split chunk per catalog   |
| `@doenet/standalone`      | `fetch` from `locales/`, served beside the bundle       |
| `@doenet/doenetml-worker` | Neither: it is handed `LocaleData.resources`           |
| `@doenet/doenetml-iframe` | Neither: what renders inside its iframe is a standalone bundle, which loads its own |

The glob is what makes adding a language cost a directory. It is also why the
two single-file builds need a different answer: `inlineDynamicImports` folds
every dynamic import back into the one output file, so code-splitting cannot
keep catalogs out of them — and *being reachable is enough*, whether or not
anything calls it. Both therefore define `__DOENET_CODE_SPLIT_CATALOGS__`
false, which makes the glob dead code. The standalone build then copies
`locales/` into `dist/` (`copyLocaleCatalogsPlugin`) and installs
`fetchLocaleLoaders` against it in `src/index.tsx`; the worker needs no
replacement at all, because the main thread loads its catalog and passes it
across. `packages/standalone/scripts/check-bundle-size.mjs` fails the build if
a served catalog turns up inside an emitted script, and if any locale directory
did not reach `dist/locales/` — the copy is of the whole directory, English
included, so the second half stays meaningful whatever the inlining decision
turns out to be.

The third way a served catalog goes unread has its own check, `check:instances`
in this package (`npm run check:i18n-instances` from the root): the loaders are
module-level state, so a bundle holding two copies of this package installs them
on an instance the viewer never reads, sees an empty registry, and falls back to
English in silence. Every built `packages/*/dist/` is scanned, not only the
bundle that has been bitten, because any build combining a prebuilt `@doenet/doenetml`
with a source build of this package can hit it — counted per emitted script,
since a script is what shares a module registry, and a package that emits both a
bundle and a worker holds a copy in each quite correctly.

Two lists have to agree for any of this to hold, and `lint:i18n` checks that
they do: the locales excluded from the glob in `load.ts` are exactly
`BUNDLED_LOCALES`. A bundled locale left in the glob is imported both
statically and dynamically, never gets its own chunk, and makes Rollup warn on
every build; an unbundled one excluded from it can never be loaded at all.

A host with a translation of its own has two ways in: pass it as
`localeResources` (highest precedence, no loading involved), or serve it and
call `setLocaleLoaders(fetchLocaleLoaders(url, tags))`. The second replaces the
loaders for the whole page rather than adding to them — a standalone bundle
that calls it is no longer reading its own `locales/` — and `tags` is worth
passing whenever the language is not one DoenetML ships, since the default list
is `SUPPORTED_LOCALES`. Import both functions from `@doenet/doenetml`, which
re-exports them, rather than from `@doenet/i18n` directly: that reaches the same
instance the viewer resolves a language through, and a host bundle that pulls in
this package separately would otherwise install the loaders where nothing reads
them.

## Keys

Keys are Fluent identifiers — lower-kebab-case, optionally with a single
`.attribute` suffix:

```ftl
submit-button = Submit
color =
    .blue = blue
    .red = red
```

`t("submit-button")` and `t("color.blue")` both resolve. Fluent identifiers
cannot contain `.`, so a key with more than one dot can never name anything and
always falls through to its English fallback.

Namespaces share one bundle per context, so ids must be unique across the
catalogs a context loads. `lint:i18n` enforces that.

## Call sites

```ts
import { createTranslator, negotiateLocales } from "@doenet/i18n";

const t = createTranslator(negotiateLocales(["es-MX"], available), resources);
t("submit-button", undefined, "Submit");
```

Resolution order is the negotiated chain → the bundled English catalogs → the
`fallback` argument → the key itself. A missing key degrades; it never throws.

**The key must be a string literal**, and the translator must be named `t` or
`translate`. `lint:i18n` matches exactly that shape; a computed key
(`t(makeKey(x))`) is invisible to the lint and will silently miss at runtime.

### In the viewer

React chrome does not call `createTranslator` directly. `@doenet/doenetml`
mounts a provider (`src/utils/i18n.tsx`) over `createChromeTranslator`, and
renderers read it with `useT()`:

```tsx
const t = useT();
return <button>{t("slider-next", undefined, "Next")}</button>;
```

Always pass the English fallback. It is what renders if a catalog is somehow
missing the key, and it keeps the English visible next to the call site.

The provider is mounted twice on purpose. `doenetml.tsx` mounts one from the
props alone, covering chrome that sits outside the document — the virtual
keyboard today, the variant selector once its strings move. `DocViewer` nests a
second one inside it, because only there is an authored `<document lang>`
known, and the chrome follows the content's language by default.

A few strings — the "document contains errors" banner, the message shown while
the core boots, the error boundary's fallback — render outside both providers,
or from a class component that cannot call a hook at all, and so reach the
translator directly rather than through `useT()`. Bind it to a local `t` or
`translate` first (`const { translate } = this.props`); `lint:i18n` recognizes
no other name and no member expression, and a key it cannot see reads as an
orphan and fails the build.

The virtual keyboard tray is the exception: it renders into its own React root
shared by every viewer on the page, which context cannot cross, so it takes a
`translate` prop the same way it already takes `theme`.

### In the worker

Prose the core computes — style descriptions today — is content, so it follows
`documentLocale` and is built where the core builds everything else. The
translator arrives as the value of the `translator` dependency, which is a
*factory* keyed by locale rather than a translator: the catalogs are fixed for
a core's lifetime but the locale is not, since a nested `<document lang>` can
differ from the one around it. A definition takes the `locale` of the document
it sits in — an ordinary ancestor dependency, alongside `theme` — and asks the
factory for the matching translator.

Those state variables stay **computed, never essential**, so a locale change
recomputes them and no English is written into saved state.

The wiring is packaged as `returnContentLocaleDependencies` /
`contentTranslator` in the worker's `utils/contentLocale.js`. Bind the
translator to `t` and pass a literal key, or `lint:i18n` cannot see the use:

```js
returnDependencies: () => ({
    value: { dependencyType: "stateVariable", variableName: "value" },
    ...returnContentLocaleDependencies(),
}),
definition({ dependencyValues }) {
    const t = contentTranslator(dependencyValues);
    return { setValue: { text: t("some-key") } };
},
```

An ancestor dependency skips the component it runs on, which is what lets a
nested `<document>` detect that it is nested — so `<document>` itself passes
`{ ownLocale: true }` to read the language it declares rather than the host's.

### Composition, not substitution

`@doenet/utils/style/styleDescriptions.ts` is the worked example of a phrase
that cannot be translated word for word. English writes adjectives before the
noun and inserts an article before "border"; Spanish writes them after and
agrees them with the noun's gender. So each description is assembled by a
message that receives the pieces as arguments plus a `$parts` argument naming
*which* pieces are present, and every adjective is handed `$gender`. An absent
piece selects a different branch rather than substituting an empty string —
that is what lets a translation reorder and re-punctuate each combination on
its own terms.

`$gender` is read more widely than its name suggests: it is a token set naming
what an adjective agrees with, and nothing outside a catalog interprets its
values. The five Bantu catalogs — Swahili, Zulu, Xhosa, Kinyarwanda and Nyanja
— answer it with the noun's **class** (`c3`, `c5`, `c6`, `c7`, `c9`) rather
than with a gender, and nothing outside them had to learn what a noun class is.
The reachability rule applies to the class tokens exactly as it does to
`$role`: a catalog writes a branch for a class only if its own `noun-gender`
can answer that class, which is why Swahili and Nyanja carry `c6` — the plural
class, which their word for *text* or *border* lands in — and Zulu, Xhosa and
Kinyarwanda do not.

Gender is not the only thing an adjective has to agree with. Three sets of
words are rendered in two places each — a border's adjectives, the background
colour, and the text colour beside it — once standing alone as a state
variable reports them and once embedded in a clause, and a language that
inflects for case wants a different form in each. So every adjective is handed
`$role` as well, naming the *position* the phrase is going into rather than
the case it takes: which case a position governs is the catalog's business,
exactly as `$gender`'s token set already is. `locales/en/content.ftl` lists the
positions, and `be`, `cs`, `de`, `el`, `et`, `fi`, `fo`, `hi`, `hr`, `is`,
`ka`, `lt`, `lv`, `mr`, `pa`, `pl`, `ps`, `ro`, `ru`, `sd`, `sk`, `sl`, `sq`,
`sr`, `uk` and `ur` are the catalogs that select on them. Sharing a script does
not imply sharing the fork: Marathi and Hindi both take an oblique adjective
before a postposition and Nepali, written in the same letters, takes none. Nor
is the fork all-or-nothing: Pashto marks the oblique on a feminine adjective in
ـه and nowhere else, and Punjabi only where the position's own noun is masculine, so
each branches on one position out of the four and leaves the rest to the
default. Georgian is the third of that kind and the narrowest: an attributive
adjective there drops its final -ი in the dative and keeps it everywhere else,
and only the background is a dative, so `background-clause` is the one branch
its catalog writes out — and only for the colours, since a colour is the one
thing ever looked up in that position.

Nor does inflecting for case imply forking at all. The Turkic catalogs — `tr`,
`az`, `kk`, `ky`, `uz`, `tk`, `tt`, `ug` — inflect a great deal and select on
neither argument, because what carries a clause there is a suffix on the noun
and an attributive adjective in front of it never moves. Armenian and Mongolian
land in the same place by different routes. Which words a language happens to
inflect decides this, not whether it has cases.

The **Celtic four** — `ga`, `gd`, `cy`, `br` — reach that same answer from the
other end. They mark an adjective heavily, but by mutating the front of it
rather than by inflecting the end: a feminine singular noun softens whatever
follows it, so «dearg» is «dhearg» in Irish, «coch» is «goch» in Welsh, and
«du» is «zu» in Breton. That trigger is the *noun*, and the noun's gender is
already a token these messages carry — so all four select on `$gender` alone
and none of them writes a `$role` branch. Welsh goes one step past the other
three: a handful of its adjectives have a feminine form of their own before the
mutation applies, so «gwyn» becomes «gwen» and only then «wen», and its
feminine branch is that finished word rather than the mutation by itself.

Sharing a family does not settle the word order either. Irish, Gaelic and
Breton run a string of postnominal adjectives in the order English writes them
— size or texture first and colour last, «cù mòr dubh» — so `style-stroke`
reads width, dash, colour in all three. Welsh runs it the other way round, the
most closely defining word nearest the noun («ci du mawr»), so `locales/cy`
puts the colour first and says so above the message, since the difference is
the kind a later reader would otherwise "fix". Welsh is not alone in that:
`locales/eu` orders its postnominal adjectives the same way, and `locales/gl`
puts the dash word ahead of the width word as `es` and `pt` do while `ca` keeps
width first. Each of those says so above its own `style-stroke`, for the same
reason.

Basque is the clean case of the opposite: it has a great many cases and selects
on neither argument, because a Basque case is a suffix on the *last word of the
whole noun phrase*. What a position asks for lands on a word `locales/eu`
writes — «batekin», «planoarekin» — rather than on the adjective, so the
description reads the same in all four positions.

Whether a language inflects is not on its own the question. Gujarati has the
same oblique Punjabi has and still selects on `$gender` alone, because the
words its clause positions land on never reach that form — feminine before the
two postpositions, predicative in the third. `locales/gu/content.ftl` records
which noun would have to change for a `$role` branch to be needed, since
nothing about the language itself says so.

That is the trap worth naming, because the three clause positions each arrive
with `$gender` already set from the position's own noun — `border`,
`background`, `text` in `noun-gender` — so a `$role` fork that only restates
that gender renders exactly what the `$gender` fork underneath it would. The
other half of the same check is reachability: only `describeColor` ever asks
for `background-clause` or `text-clause`, so a stroke width or a dash pattern
branching on either is writing a variant nothing can select.

**`standalone` covers two positions, and `locales/tpi` is the first catalog that
wants them apart.** A Tok Pisin adjective carries «-pela» attributively —
«retpela lain» — and drops it predicatively: «lain i ret». That is exactly the
kind of distinction `$role` names, and it is unreachable, because `attachNoun`
passes `role: "standalone"` for the phrase it is about to put in front of a noun
and `describeColor` passes the same token for the citation form a state variable
reports. One token, two positions. So the catalog writes the attributive form
throughout, which is right wherever a noun follows, and its header records the
reason rather than the workaround. Splitting `standalone` into a citation
position and an attributive one is a change to `styleDescriptions.ts` that no
existing catalog needs and this one would use on the day it lands.

**Klingon has no adjectives at all, and that turns the whole description into a
relative clause.** What English writes as an adjective is a verb of quality
there, and TKD describes putting one of them directly after the noun it
modifies — «tlhegh Doq», a red line — giving no way to chain three, which is
what `style-stroke`'s widest branch needs. `locales/tlh` writes «-bogh» on each
verb, «'ej» between them, and stands the whole clause in front of the noun:
«jeDbogh 'ej pe'lu'bogh 'ej Doqbogh tlhegh» — an extension of «'ej» rather than
an attested pattern, since no canon example chains three relative clauses, and
the catalog's header says so. That puts Klingon on the prenominal
side with the Philippine catalogs and Tok Pisin, for a reason none of them
shares, and it is why the catalog needs no `$role` fork — the *position* is
handled by the message that composes the phrase rather than by the word inside
it, so its tables can hold bare verbs that double as the citation form a state
variable reports.

It also turned an accident into an invariant. **`style-with-noun`'s
`$description` is always `style-stroke`'s output, never a word looked up on its
own.** `describeMarker` and `describeRegion` look up one colour and nothing
else, and used to hand that raw word straight to `attachNoun`; every catalog
writes `style-stroke`'s `[color]` branch as the identity `{ $color }`, so
nothing said the two paths differed. Klingon says so, because a bare verb and a
«-bogh» clause are not interchangeable in front of a noun. Both now go through
`style-stroke`, which moves no existing language's output — all 147 of the other
catalogs write that branch identically — and buys a catalog the right to rely on
the shape of what arrives.

Even the noun is not one string. A regular polygon is "5-sided regular polygon"
in English but "polígono regular … de 5 lados" in Spanish, wrapped around the
adjectives rather than sitting beside them, so `noun-regular-polygon` answers
in two halves (`$part`) and the composing message places each. A noun that
needs no complement leaves the second half empty. The rule generalizes: **a
phrase a language cannot keep contiguous has to be split at the source** —
there is no reaching inside `{ $noun }` from the message that places it, so
split the phrase, not the message that uses it.

**The split is not the postnominal languages' property**, and the Austronesian
batch is what shows it. In the Indigenous Americas batch every prenominal
catalog folded its side count into the head and left `[tail]` empty, because a
count is a modifier there; here **all fifteen reach `[noun-tail]`, six of them
with their adjectives in front of the noun**, because in every one of the
fifteen the count is a relative clause — «nga addaan iti 5 a sikigan», «i gat 5
sait wankain» — which has to follow the whole phrase whichever side the
adjectives sit on. What decides the split is the shape of the complement, not
the order of the adjectives, and `styleDescriptions.test.ts` pins both halves.

Two further Fluent constraints shaped it, and both are easy to rediscover the
hard way:

- **A word that inflects has to be passed in, not referenced.** A *term*
  reference cannot carry a runtime value — `{ -filled(gender: $gender) }` does
  not parse (`E0014 Expected literal`), and `{ -filled }` gets an empty scope
  and always picks its default variant. A *message* reference does inherit the
  caller's arguments, but references never cross a bundle boundary: a locale
  that translates `style-filled` and not `style-filled-word` would render the
  literal `{style-filled-word}` rather than falling back to English. So the
  inflecting word is a message the code looks up and hands over as an
  argument, which is why `style-filled-word` is a key of its own.
- **A multiline pattern keeps its newlines.** Continuing a variant onto a
  further line puts a `\n` in the rendered string — including when that line
  opens a nested select. Keep each variant's content on one line; a select
  nested *within* that line is fine, and is how a message would sub-divide one
  of its variants. The same rule catches a subtler mistake: a `#` line indented
  *under* a message is not a comment, it is more of the pattern above it, so a
  note explaining a wording choice has to sit above the message rather than
  beside the attribute it explains. `lint:i18n` fails on any pattern that
  renders a line break, which is what makes both of these findable before a
  reader meets them.

### An affix cannot be welded to a placeable

The one constraint that recurs in every catalog that has to restructure a
message rather than translate it in place, and it has nothing to do with
writing direction — it turned up first in Arabic and Uyghur and then in
Hungarian, Finnish, Czech, Slovak and Romanian.

A placeable is a value the catalog never sees. So a message may not depend on
what that value turns out to *be*:

| The catalog wants | The language | Why it cannot |
| --- | --- | --- |
| a case ending on the value | `ar`, `ug`, `hu`, `fi`, `ta`, `te` | the ending is welded to the word, and vowel harmony or the final consonant picks its shape |
| the definite article on the value | `ro` | the article is a suffix — «secțiune» → «secțiunea» |
| a preposition before the value | `cs`, `sk` | «v»/«ve» and «s»/«se» vocalize according to what follows |
| a compound with the value | `fi` | Finnish writes a compound as one word |

Adjacency is not the problem. `{ $numSides }-kulmio` is correct Finnish for
every side count, because `-kulmio` is the same whatever number lands in front
of it. What cannot be written is *agreement* with an unknown word.

**Klingon is that paragraph from the other end, and it is worth stating because
`locales/tlh` welds a suffix onto a placeable in nearly every message it
writes.** «-bogh», «-Daq» and «-vaD» sit on values the catalog never sees —
`{ $color }bogh`, `{ $answerId }vaD` — and come out right whatever lands there,
because Klingon suffixes have one shape each: no vowel harmony, no assimilation,
no consonant grade. It is a constructed language, and invariant affixes are one
of the things its designer chose. So the table above is not a list of scripts or
of families; it is a list of languages whose endings change shape, and the rule
is about that property rather than about welding.

Tajik is the case where that distinction decides something, and it needs both
this rule and the third way out below to come off. Its adjectives follow the
noun and the izafat links them, and unlike Persian's — an unwritten vowel after
a consonant, which is why `locales/fa` lets the space carry it — Tajik's is
written, as «-и». So `locales/tg` writes `{ $noun }и { $description }`, welding
an affix onto a value whose *form* the value decides, which nothing else here
does — the hyphenated endings `locales/hy` and `locales/ka` put on an
identifier are welds too, but each has one shape whatever precedes it, so they
fall under the paragraph above rather than this one. What makes Tajik's sound is
not that the izafat never changes: a ъ-final word drops the ъ before it
(«шуоъ» → «шуои») and a ӣ-final word shortens the ӣ. It is that the catalog
**chooses the words that land there** — `.ray` is «нур» rather than «шуоъ»,
`.square` is «квадрат» rather than «мураббаъ», and the colours that chain an
izafat in `style-stroke` are picked the same way — so every word the frame can
meet is one the ending merely sits beside. `locales/tg`'s own header records
that, because a new entry in its `noun` or `color` table has to be checked
against it.

There are five ways out, and every catalog here takes one of them:

- **Name what the value is.** «للمكوّن { $component }» — "for the component X"
  — puts the affix on a word the catalog writes.
- **Reach for a word that can stand beside it.** A postposition in Urdu, a
  relative clause in Finnish («jossa on vinoneliöitä»), a demonstrative in
  Hungarian («ehhez: { $answerId }»).
- **Choose the words that land there.** Czech's pattern for horizontal lines is
  «horizontální čáry» rather than «vodorovné čáry», because «v vodorovné» would
  have wanted «ve».
- **Write both forms.** Hungarian's «a(z)» is the standard orthographic answer
  to exactly this problem, and predates software by a long way.
- **Prefer the free allomorph over the bound one.** Where the affix has a
  free-standing counterpart that is grammatical in every position, write that:
  Kʼicheʼ's relational «rech» in place of the possessive prefix «u-»/«r-», and
  the Bisayan linker «nga» in place of the enclitic `-ng`, which is what
  `locales/ceb` already does — see
  [A ligature is an affix too](#a-ligature-is-an-affix-too).

A select whose variants would land against such an affix carries the affix into
each variant: Fluent does not care where a select sits inside a pattern.

### A ligature is an affix too

A Philippine language joins an attributive adjective to what it describes with a
**linker**, and a linker has two forms. Which one is right is decided by a
neighbouring word — which, in these messages, is often a placeable. So the
constraint that turned up first as a case ending in Arabic and a preposition in
Czech turns up here as a ligature.

`locales/ceb` and `locales/fil` reached it first and one at a time: Cebuano's
header calls writing the uncontracted «nga» everywhere "the one place this seed
is deliberately stiff", and `fil` escapes the ligature outright by selecting on
the side count, whose two CLDR plural categories *are* its two linkers. What the
Austronesian batch adds is the five Philippine catalogs side by side, which is
what shows that they do not all resolve it the same way:

| | The linker | Decided by | Resolution |
| --- | --- | --- | --- |
| `war`, `hil` | «nga» / `-ng` | the word **before** it | write the free «nga», which is grammatical in both positions |
| `ilo` | «a» / «nga» | the word **after** it | no invariant form exists; write «a» and name the exception |
| `pam` | «a» / `-ng` | the word **before** it | no invariant form exists; write «a» and name the exception |
| `bik` | «na» / `-ng` | the word **before** it | no invariant form exists; write «na» and name the exception |

Two of the five escape it outright, which is the useful half: Bisayan «nga» is a
free word in both positions, so writing it out is not a compromise but the form
that can be written without knowing what stands beside it — the move `locales/ceb`
already makes, and the same move `locales/quc` makes when it writes the free
relational «rech» instead of the possessive prefix «u-»/«r-». That is the fifth
way out listed above — *prefer the free allomorph over the bound one* — and it
is stated as a rule here because three catalogs now take it.

The other three cannot, and each header says exactly where its choice comes out
wrong rather than leaving a reader to find it. Ilocano's is the sharpest and is
**pinned as a test**: every word in its own tables is consonant-initial but
«asul», so `styleDescriptionLocale.test.ts` asserts the string «napunno a asul a
sirkulo» — the one place the rule misfires — rather than hiding it. A fix is a
change to what the composition messages are handed, not a change to that string,
and the test is what would notice the day it becomes possible.

## Diagnostics

Warnings, errors, info notices and accessibility alerts take a different route
from every other string, because they are produced in one place and read in
another. The worker knows what went wrong; it does not know what language the
person looking at the screen reads, and it shouldn't — a diagnostic follows
`uiLocale`, which a nested `<document lang>` has no say over.

So a diagnostic is not translated where it is raised. It carries a **stable
code** naming the situation, the **arguments** that fill its message in, and
the **English**, and the main thread renders it:

```js
// before
sendDiagnostics.push({
    type: "warning",
    message: "numDimensions mismatch in ray.",
});

// after
sendDiagnostics.push(
    codedDiagnostic({ type: "warning", code: "doenet-w0006" }),
);
```

`codedDiagnostic` lives in `@doenet/utils`, beside the `DiagnosticRecord` it
builds, because the worker is no longer the only place that raises one — the
style-contrast checks in that package do too, and a record assembled two
different ways in two packages is a record whose shape can drift.
`@doenet/doenetml-worker-javascript/src/utils/diagnostics.ts` re-exports it, so
the worker's call sites import it from where they always did. It fills
`message` in from the English catalog, so the English and the catalog cannot
drift and everything that reads `message` inside the worker — the dedupe in
`DiagnosticsManager`, the tests that assert exact strings — sees what it saw
before. `DocViewer` then re-renders `message` through
`createDiagnosticFormatter` before handing the records on, so the editor's
panel, the LSP squiggles and a host's `setDiagnosticsCallback` all show one
consistent set, in the reader's language.

Both shapes are valid records. A record with no code renders its English and
nothing else, which is what lets the ~200 messages still holding a literal
string migrate a few at a time (#1518). `lint:i18n` reports the remaining count
on every run.

### Errors that are thrown, not built

Errors raised while the source is being turned into components don't build a
record at all — they `throw`, the caller catches, and the component becomes an
`_error` whose message `ComponentBuilder` re-raises as the diagnostic. The
record built at the `catch` is discarded on purpose (`DiagnosticsManager`
gathers errors from the dast pass instead), so the `_error` component is the
only thing carrying the diagnostic across, and a bare `Error` arrives with
nothing but an English sentence on it.

```js
// before
throw Error(`Cannot repeat attribute ${attrName}.`);

// after
throw new DiagnosticError({
    code: "doenet-e0003",
    args: { attribute: attrName },
});
```

`DiagnosticError` (in the worker's `utils/diagnostics.ts`, alongside its
re-export of `codedDiagnostic`) is an `Error` subclass whose
`message` comes from the same English catalog, so it drops straight into a
`throw` site: `instanceof Error` still holds and a `catch` reading `e.message`
sees what it saw before. `errorComponentState` puts the code and arguments on
the `_error`'s `state` — every place that builds one of those components out
of something that could be carrying a code uses it — and the builder reads
them back off when it raises the diagnostic. The other places that build an
`_error` compose their own English string, so there is no code for them to
lose; they join this path when those messages migrate.

The sites in between — the two `catch` blocks that build a record from a
caught error, and the `ComponentBuilder` branch that raises one from an
`_error` component — hold no English of their own, so they have nothing to
migrate and no code to name; they spread `diagnosticCodeFrom` to pass along
whatever their source carried. `lint:i18n` counts those as migrated too, since
there is nothing further to do to them.

### Producers that cannot read the catalog

`@doenet/parser` and `@doenet/lsp-tools` raise author-facing diagnostics and
neither can render one. Both are bundled into the DoenetML language server,
which `@doenet/codemirror` embeds verbatim and starts as a blob worker, so
every byte sits on the editor's critical path before the first cursor-help
request can be answered — and the server has no locale to render in anyway.
Reaching the catalog from there pulls in `EN_CATALOG_SOURCE`, every English
namespace joined, plus the Fluent runtime to read it;
`packages/lsp/scripts/check-server-bundle.mjs` fails outright if either
arrives, rather than budgeting for it (see [Bundling](#bundling)).

So these two pass the English **alongside** the code instead of rendering it —
`codedDastError` in `packages/parser/src/coded-dast-error.ts`,
`codedLspDiagnostic` in `packages/lsp-tools/src/coded-lsp-diagnostic.ts`. The
message lives in two places, and each package holds the two together with a
test: `test/coded-dast-errors.test.ts` and `test/coded-schema-violations.test.ts`
run their producer over a corpus of broken DoenetML and assert every coded
diagnostic renders, through the catalog, to exactly the string the producer
wrote. A message edited on one side and not the other fails there, as does a
missing or misnamed argument — one the catalog reads and the producer doesn't
pass renders as `{$name}`, which no hand-written English will match.

`@doenet/i18n` is a **devDependency** in both: `import type` in `src/`, so
every code is still checked against the registry at compile time, and the real
package only in that test. Their `dependencies` stay free of it and the bundle
guard stays green.

The same boundary runs through `@doenet/codemirror`, which draws the tooltip
over a squiggle: it embeds that server and so carries no catalogs either. It
takes a `diagnosticPresentation` instead — a message formatter and a source of
severity headings, supplied by `EditorViewer` from the translator the
Diagnostics tab renders with. The language is the one the **viewer** resolved,
since only there is an authored `<document lang>` known, and the hover and the
tab are showing the same records.

### Codes

A code is a permanent name — what a bug report cites, what a host reading
`setDiagnosticsCallback` can filter on, and the anchor a documentation page
will hang off (#1548). It rides on the record, and on the LSP `code` field for
a positioned diagnostic — with the arguments alongside it in `data.args`, since
a code names a message *template* and it takes both to say which occurrence of
it this is. That pair is how the language server's `dedupeLspDiagnostics`
recognizes two renderings of one diagnostic without comparing their text.
Nothing renders the code itself yet, so the codes earn their keep as an
identifier rather than as UI.

`DIAGNOSTIC_CODES` in `src/diagnostics.ts` maps each to a message id, and
`diagnostic-codes.lock.json` records every code ever issued, so `lint:i18n`
fails if one is renumbered, reused, or dropped from the registry. Retire a code
in place; never recycle it.

The lock is a committed file, not a service, so it enforces the contract only
against the registry — deleting a code's line from *both* files in one change
passes the lint, exactly as deleting a `package-lock.json` entry does. That is
what makes the lock worth reviewing: a diff that removes or edits an existing
line, rather than only adding one at the end, is the thing to refuse.

The letter is part of the name (`w` warning, `e` error, `i` info, `a`
accessibility), recording what the diagnostic was born as. It is not a live
severity — the emitting call site chooses the record's `type`.

Two branches that each claim the next number collide in both the registry and
the lock, which is the intended outcome: neither file can be auto-merged, so
the conflict is resolved by hand. Give the later branch the next free number in
*both* files — the lock is sorted by code, so its entry moves with it, and the
lint passes once the two agree again. Never resolve it by editing a code that
is already on `main`.

The registry is also what makes these messages visible to the lint. They are
reached by code rather than by a literal `t("key")`, which the call-site scan
cannot see, so `lint:i18n` reads the registry as a call site of its own. A
message with no code registered for it fails as an orphan.

The reverse direction is checked too: a registered code that nothing raises
fails. That is the shape a consolidation leaves behind — the last site using a
number moves to another one and the registry entry stays, naming a situation
nothing can produce. When a code genuinely stops being raised, list it in
`RETIRED_DIAGNOSTIC_CODES` beside the registry; it keeps its entry, so the lock
still agrees, and retiring becomes a line in a diff rather than a silent
consequence of deleting the last call site. Putting a code back to work means
dropping it from that list, which the lint also insists on.

Three things `lint:i18n` counts by scanning source text, wherever they appear
and **comments included**: a `type` property naming a severity, a
`codedDiagnostic(` call, and a `code` property naming a diagnostic code. The
first two are the two halves of the migration burn-down — every construction,
and the ones taking their message from the catalog. The third is separate: it
is what proves every registered code is raised somewhere.

So an example written in a doc comment is read as real, and which way it lands
depends on what the example contains: a lone `type: "warning"` adds to the work
remaining, a lone `codedDiagnostic(` subtracts from it, and a `code:` makes a
code nothing raises look raised. The same trap as writing a `t("key")` call in
a comment.

### Lists and agreement

Fluent has no list type, and a list is exactly where hand-written English
grammar hides — the serial comma, the "and", the verb that has to agree with
how many things there are. So a list argument stays a list all the way to
format time:

```js
codedDiagnostic({
    type: "info",
    code: "doenet-i0001",
    args: { attributes: ["slope", "length"] },
});
```

`Intl.ListFormat` joins it in the reader's language, and the message also
receives `attributesCount`, so the catalog can select on it:

```ftl
line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } is ignored when two endpoints are specified
       *[other] { $attributes } are ignored when two endpoints are specified
    }
```

A count the catalog derives itself can never disagree with the list beside it.
Pass `{ list, type: "unit" }` instead of a bare array for a bare enumeration
("x, y, z") rather than a conjunction ("x, y, and z") — English distinguishes
them and other languages distinguish them differently.

## Bundling

`package.json` declares `"sideEffects": false`, and that is load-bearing rather
than tidiness. The English catalogs are `?raw` imports assembled by a
module-level call in `catalogs.ts`; without the declaration a bundler has to
assume that call might do something observable, so it keeps it — and keeping it
keeps all four FTL files — in **any** bundle that reaches this package for any
reason, even one where every function has already been tree-shaken away.

That is not hypothetical — it was measured. When `@doenet/utils` took its
runtime dependency on this package (#1557), the DoenetML language server grew
by 20 KB gzipped of catalog text without gaining a single line of code that
reads it: it imports `@doenet/utils/style` for something unrelated, and the
strings came along. The declaration is what kept that off `main`, and
`packages/lsp/scripts/check-server-bundle.mjs` fails the build if it comes
back.

Nothing here registers globals, patches prototypes, or imports for effect, so
the claim is true today. Anything added that breaks it has to remove the
declaration and pay the cost everywhere.

## Commands

```bash
npm run test     -w @doenet/i18n     # vitest
npm run codegen  -w @doenet/i18n     # regenerate src/generated/{messageKeys,supportedLocales}.ts
npm run lint:i18n -w @doenet/i18n    # CI catalog check (also `npm run lint:i18n` at the root)
```

`lint:i18n` fails on: a catalog that doesn't parse (including entries the Fluent
*runtime* would silently drop as junk), an id defined twice within a locale, a
catalog naming a `numberingSystem` on a Fluent builtin, a message whose value
would render a line break, a translated locale
defining a key English lacks, a stale `messageKeys.ts`, `supportedLocales.ts`,
or `diagnostic-codes.lock.json`, a lazy-catalog glob that no longer excludes
exactly the inlined locales, a call site referencing a key that doesn't exist,
an English key no source file references, a malformed diagnostic code, a code
naming a message English lacks, a code used in source that the registry doesn't
define, a registered code that nothing raises and that is not listed as
retired, and any change to a code already issued. Keys *missing* from a
translation are reported as coverage, not failure — a partial translation is
legitimate and falls back.

Run `codegen` after editing any English catalog, adding a diagnostic code, or
adding a locale directory; the generated `MessageKey` union, the locale roster
and the code lock are all committed.

## Pseudo-localization

`pseudoLocalize(ftlSource)` generates the `en-XA` catalog:

```
greeting = Hello there   →   greeting = »Ĥéļļó ţĥéřé···«
```

Load it as a locale and look at the app. Anything that renders **unaccented**
is a string that never went through the catalogs — the class of bug no
key-based lint can see. Anything with a **missing `«`** is a layout that only
fits English. Message ids, term ids (`-brand`), placeables (`{ $count }`), and
select expressions are left untouched, so the output is a working catalog.

## Number formatting

Math-context numbers keep `.` as the decimal separator regardless of locale,
until the deferred math-notation phase decides otherwise; changing it would
alter answers, not just their presentation. `MATH_NOTATION_LOCALE` in
`src/intl.ts` is where that policy is written down, so a number formatted in
English is a decision with a name rather than an omission.

Prose numbers do localize. Inside a message, that happens for free: Fluent
formats a placeable with `Intl.NumberFormat`, which is why `TranslationArgs`
accepts a real `number` rather than a pre-formatted string. Outside one —
`<intComma>`, whose whole output is a number and which has no sentence around
it — use `formatDecimalString`, which re-punctuates an already-rendered decimal
under the locale's grouping and separator without adding, removing, or rounding
a digit.

### Digits are Latin, separators are not

What localizes is the **punctuation**, never the ten characters. German still
groups with periods, India still groups in twos, and a number still comes back
in `0`–`9` — even under a locale CLDR counts in another script, which today
includes Bangla, Assamese, Marathi, Nepali, Burmese, Persian, Pashto, Sindhi
and Arabic as written in Egypt.

`intlLocale` pins the numbering system, so this holds for every formatter this
package builds and for every one added later: a locale reaches an `Intl`
formatter through that function or it reaches none at all. It applies to
Fluent's `NUMBER()`, to a bare `{ $count }` — which Fluent wraps and formats
identically — to `DATETIME()`, and to `formatDecimalString`. A tag that names a
numbering system itself (`zh-u-nu-hanidec`) is overridden; the policy is one
answer per product, not per tag. `lint:i18n` rejects a catalog that passes
`numberingSystem` to a builtin, which is the only other way back out.

Two reasons, and the second decides it. A number in prose sits beside numbers
that are not prose: a contrast ratio is written `{ ratio }:1` with the `1` a
literal in the catalog, a line number is read off a gutter the editor draws
itself, an author's `styleNumber="3"` is quoted back at them. And mathematics
is Latin-digit regardless — `MATH_NOTATION_LOCALE`, which #1528 keeps that way
while it makes the *separator* configurable. A document whose prose counted in
one script and whose equations counted in another would be worse than either
alone.

For the Arabic script the two halves are not independent: Persian pairs `٬` and
`٫` with its own digits and `,` and `.` with these, so pinning the digits takes
the Latin-digit separators with it. Everywhere else the separator is untouched.

The other half of the rule is on the argument, not the formatter: a value that
is an **identifier** rather than a quantity — a line number, a `styleNumber`, a
`componentIdx`, a section number built out of counters — is passed as a
`string`, so that nothing groups it either. `TranslationArgs` is where that is
written down.

## Direction

`directionOf(tag)` in `src/direction.ts` is the whole rule. It answers for
**any** BCP-47 tag, not only the ones with a catalog: `lang` accepts whatever an
author types, and `<document lang="ar">` has to lay out right-to-left whether or
not `locales/ar/` exists. That is why direction is computed rather than recorded
beside the catalogs — a generated field could only cover the roster, which is
[not the bundle](#the-roster-is-not-the-bundle) and not exhaustive either.

It keys on **script**, because that is what decides: Punjabi is left-to-right in
Gurmukhi and right-to-left in Arabic, Kurdish likewise in Latin and Arabic. A
bare `ar` or `he` resolves through `Intl.Locale`'s `maximize()`. Deliberately
not `Intl.Locale.prototype.getTextInfo()`, which is too new to rely on and
throws on exactly the tags `normalizeLocaleTag` is written to pass through
untouched.

Two roots carry `dir`, for the same reason there are two locales. `DocViewer`
puts the **content's** direction on `.doenet-viewer` beside its `lang`;
`doenetml.tsx` puts the **reader's** on the wrapper around the chrome that sits
outside it. A nested `<document lang>` needs no state variable of its own —
`renderedLang` is set exactly when the language changes, so where it is absent
the direction cannot have changed either.

Chrome drawn *inside* the document is the reader's language in a box declared to
be the content's. `useChromeLangDir()` re-declares it — on the in-document error
box, the feedback heading, the click-to-toggle text on a hint, a solution and a
collapsible section, a pretzel's answer label, the summary-statistics caption,
and the math-input preview's parse-error message — and returns `{}` when the two
directions already agree, so the common case adds no attributes at all. It is
not for anything reading `useContentT`: the check-work widget follows the
document's language by design, so it follows its direction too. Nor for
tooltips, for the opposite reason: Ariakit portals them to `document.body`, so
they are never inside the document's box, and a native `title` attribute is
drawn by the browser rather than by CSS. `DocViewer`'s error banner is built
above the provider the hook reads, so it calls the same rule as the plain
function `chromeLangDir(uiLocale, documentDirection)`.

"The document" there means the *nearest* one, not the activity: a nested
`<document lang>` turns its own subtree around, so `section.tsx` re-mounts
`DocumentDirectionProvider` around whatever it just declared. Otherwise chrome
inside `<document lang="ar">` would compare itself against a left-to-right
activity, find no disagreement, and stay silent in a box running the other way.

### Notation is a left-to-right island

Mathematics reads left-to-right in Arabic and Hebrew as well, so a graph must
not mirror while the prose around it does. The pins are `dir="ltr"` on the
JSXGraph board and the prefigure SVG (both write `text-anchor: start|end`, which
resolves against the computed direction), the MathQuill wrapper (no `direction`
declaration anywhere, inline siblings in source order, physical kerns), the
matrix input (a `<table>` reverses its columns), the slider (a native range
input reverses its track), the number line, the orbital diagram, the math
input's preview (the popover does not portal, and the div that scrolls a long
expression must not become an RTL scroll container, whose `scrollLeft` runs
from the negatives up to zero), and CodeMirror (it renders XML source). The
spreadsheet is the one exception to the attribute: Handsontable reads the
inherited direction through its own `layoutDirection` option, so it is told
rather than styled. MathJax needs nothing: its CHTML output already pins
`direction: ltr` on `mjx-math` — but only on the mathematics itself, which is
why the preview's scroll container still needs its own pin.

A pin on a *block* needs a width with it: an element as wide as its container
aligns its left-to-right contents to the container's left edge, stranding the
widget at the far side of the page from the prose it belongs to.
`ltrIslandProps()` in
`packages/doenetml/src/Viewer/renderers/utils/direction.ts` carries the pair, so
the sizing half cannot be left off by accident. It shrink-wraps by default and
takes a width for a widget the author can size — the slider passes its own,
because a percentage inside a shrink-wrapped box would measure against the box
instead of the column. An inline island, or one whose element already
shrink-wraps, takes a bare `dir="ltr"`.

The keyboard's keys are pinned in `keyboard.css` rather than by attribute,
because `Keyboard` returns a different element per style. The tray *around*
them follows the reader.

Everything else mirrors: the paginator, prose renderers, the feedback and hint
headers, the graph-controls panel, the editor chrome.

### Writing a right-to-left catalog

Eight ship: `ar`, `fa`, `he`, `ur`, `ps`, `sd`, `ug` and `yi`. Nothing about the
file format changes for any of them. A `.ftl` pattern is a sequence of
characters in **logical** order — the order the text is spoken — and `dir`
decides where each run is drawn, so a translation is written the way it is read
and never reordered by hand to look right in an editor. Brackets, quotes and
dashes are the same characters in every one of these scripts and are written
opening-first; the bidi algorithm turns them around at render time. Digits stay
Latin, as [everywhere else](#digits-are-latin-separators-are-not), which is why
an Arabic sentence and the mathematics beside it count in the same characters.

**Direction is not a language family.** These eight share a writing direction
and almost nothing else, and the catalogs differ from each other far more than
they differ from `de` or `es`:

| | Adjectives | Gender | Plural categories |
| --- | --- | --- | --- |
| `ar` | follow the noun | m/f | six |
| `he` | follow the noun | m/f | three |
| `fa` | follow the noun | none | two |
| `ur`, `ps`, `sd` | precede the noun | m/f | two |
| `ug` | precede the noun | none | two |
| `yi` | precede the noun | m/f/n | two |

`ur` is the outlier worth knowing about: its grammar is `hi`'s, so
`locales/hi` is the closest thing to a parallel text for it and a correction to
one is usually a correction to both. `ug` is Turkic and agrees with nothing.
`yi` is Germanic and the only one of the eight that forks on `$role`: its
adjectives take a dative after «מיט» and «אויף», so its catalog has the shape
`locales/de` and `locales/bs` have rather than the shape of the six beside it —
which is the paragraph above put as sharply as it goes. Its one spelling
convention worth stating is that Yiddish's three digraphs are written as **two
letters each** — «וו», «וי», «יי» — and never as the precomposed ligatures
U+05F0–U+05F2, which render identically and compare unequal. CLDR spells the
endonym «ייִדיש» that way, so the roster's own label and the catalogs match.

Three things recur across them, none a property of the direction:

- **Plural categories.** Fluent selects through `Intl.PluralRules`, so an
  Arabic `{ $count -> … }` has `zero`, `one`, `two`, `few`, `many` and `other`
  where English has two branches, and Hebrew has `one`, `two` and `other`. Only
  Arabic has a `zero` category, and which branch catches none elsewhere is not
  worth guessing: it is `other` in Hebrew, Urdu, Pashto, Sindhi and Uyghur but
  `one` in Persian, whose rule counts zero with the singular. That is why a
  message wanting a separate wording for none says `[0]` by number, as the
  English does, rather than reaching for a category — Fluent matches an
  explicit number before it consults the rules, so the branch is right whatever
  the locale would otherwise have chosen.
- **An affix cannot be welded to a placeable.** Arabic attaches «لـ» and «بـ»
  to the word after them and Uyghur attaches its case endings to the word
  before, and in each case there is no word — there is an argument. This is
  where these two met a constraint that turned out to hold in half the
  left-to-right catalogs as well; see
  [An affix cannot be welded to a placeable](#an-affix-cannot-be-welded-to-a-placeable)
  for the general shape of it and the ways out.
- **A distinction the source language makes may not exist.** Where English
  separates a singular from a plural only in the verb — "is ignored" against
  "are ignored" — most of these cover both with one form, and the select is
  dropped rather than written out twice identically. The count argument then
  goes unused, which is harmless: it stays in the English message for the
  languages that need it. Where English changes the *noun* as well, the branch
  stays — and whether it has to is a fact about the language rather than about
  the script: Persian, Urdu and Uyghur leave a noun singular after a numeral,
  while Arabic, Hebrew, Pashto and Sindhi pluralize it.

### Testing it without a catalog

`en-XB` renders visually identical text to `en-XA` and differs only in
`directionOf` reporting it `rtl`, plus an invisible right-to-left mark against
the outer face of each bracket so that a value's trailing punctuation resolves
the way it would in a real RTL sentence. A difference between the two runs is a
difference in layout and nothing else, and every right-to-left assertion is
runnable before any right-to-left language is translated. It stays useful now
that one is: a layout regression under `en-XB` is legible to a reviewer who
reads no Arabic, so what a screenshot shows is the layout rather than the
words. It is deliberately not a text transform: Android's U+202E override
demonstrates bidi rather than testing a layout, and look-alike glyphs would
cost the accented text its readability and break the hard-coded-English sweep.

## Bidi isolation

An interpolated value that runs the other way from the sentence around it
scrambles that sentence. Unicode's isolates prevent that, and Fluent adds them
per bundle — so `useIsolating` is decided per translator, and the two
translators want opposite answers:

- **`createChromeTranslator` turns it on**, for every language but English.
  What it renders is looked at and discarded.
- **`createTranslatorFromLocaleData` leaves it off.** What the worker renders
  becomes state variables an author interpolates, an `<award>` compares against
  a response, and `answer.js` folds into a SHA-1 of the dependency graph. The
  line is drawn at what is compared, not at what looks like prose.

Isolation is uniform across a fallback chain rather than per catalog: a key the
reader's language has not translated resolves from English and is isolated all
the same, because the chrome around it is still the reader's.

**English is excluded, and the reason is not principled.** Isolation protects a
sentence whose placeable runs the other way, which has nothing to do with
whether the sentence is English — an English UI naming an Arabic answer still
gets none. It is excluded because the assertion corpus compares English chrome
as plain text, and every phase has held English byte-identical to what it
replaced. Turning it on for English later is a mechanical change plus a sweep
of exact-string assertions. Keyed on the primary subtag, so `en-GB` is English
and so are both pseudo-locales.

A test asserting on translated chrome has to strip the marks with
`stripBidiIsolates`. They render as nothing, so a failure diff otherwise shows
two strings that look identical.
