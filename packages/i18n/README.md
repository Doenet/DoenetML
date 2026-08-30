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

English is the source of truth. Every translation — `ab`, `ace`, `ady`,
`af`, `ak`, `alt`, `am`, `ar`, `arn`, `as`, `ast`, `av`, `ay`, `az`, `ba`,
`bal`, `ban`, `bci`, `be`, `bem`, `bg`, `bho`, `bi`, `bik`, `bin`, `bm`,
`bn`, `bo`, `br`, `brx`, `bs`, `bua`, `bum`, `ca`, `ce`, `ceb`, `ch`, `chk`,
`ckb`, `co`, `crh`, `cs`, `cv`, `cy`, `da`, `dag`, `dar`, `de`, `dje`,
`dng`, `doi`, `dv`, `dyo`, `dyu`, `dz`, `ee`, `efi`, `el`, `es`, `et`, `eu`,
`ewo`, `fa`, `ff`, `fi`, `fil`, `fit`, `fj`, `fo`, `fon`, `fr`, `fy`, `ga`,
`gaa`, `gag`, `gd`, `gil`, `gl`, `glk`, `gn`, `gu`, `ha`, `haw`, `haz`,
`he`, `hi`, `hil`, `hnj`, `hr`, `ht`, `hu`, `hy`, `id`, `ig`, `ilo`, `inh`,
`is`, `it`, `ja`, `jv`, `ka`, `kaa`, `kab`, `kbd`, `kbp`, `kca`, `kg`, `ki`,
`kjh`, `kk`, `km`, `kmb`, `kmr`, `kn`, `ko`, `koi`, `kok`, `kos`, `kpe`,
`kpv`, `kr`, `krc`, `kri`, `krl`, `ks`, `ktu`, `kum`, `ky`, `lb`, `lbe`,
`lez`, `lg`, `ln`, `lo`, `lom`, `lrc`, `lt`, `lua`, `luo`, `lv`, `mad`,
`mai`, `mdf`, `men`, `mg`, `mh`, `mhr`, `mi`, `min`, `mk`, `ml`, `mn`,
`mni`, `mnk`, `mns`, `mos`, `mr`, `mrj`, `ms`, `mt`, `my`, `myv`, `mzn`,
`nah`, `nb`, `nds`, `ne`, `niu`, `nl`, `nog`, `nso`, `ny`, `nyn`, `oc`,
`oj`, `olo`, `om`, `or`, `os`, `pa`, `pam`, `pcm`, `pl`, `pon`, `ps`, `pt`,
`qu`, `quc`, `rar`, `rm`, `rn`, `ro`, `ru`, `rw`, `sa`, `sah`, `sat`, `sc`,
`scn`, `sd`, `se`, `sg`, `sgh`, `shi`, `si`, `sjd`, `sk`, `sl`, `sm`, `sma`,
`smj`, `smn`, `sms`, `sn`, `so`, `sq`, `sr`, `ss`, `st`, `su`, `sus`, `sv`,
`sw`, `ta`, `tab`, `te`, `tem`, `tet`, `tg`, `th`, `ti`, `tiv`, `tk`, `tkl`,
`tlh`, `tly`, `tn`, `to`, `tpi`, `tr`, `ts`, `tt`, `ttt`, `tvl`, `ty`,
`tyv`, `udm`, `ug`, `uk`, `umb`, `ur`, `urh`, `uz`, `ve`, `vep`, `vi`,
`vro`, `war`, `wbl`, `wls`, `wo`, `xal`, `xh`, `yi`, `yo`, `zgh`, `zh-Hans`,
`zh-Hant`, `zu`, `zza`
— is an **unreviewed machine-generated seed**, which each file's own
header says at the top, and which is what #1521's translation platform is for.
None has been read by a speaker. Correcting one needs no permission and no
coordination: a wrong string is just wrong, and the English is one key away.

A hundred and ninety-four of them are deliberately partial. A hundred and
ninety-three are partial in the same place — the two chemistry tables — while
Klingon is partial almost everywhere, for a different reason: see
[A language with no word for it](#a-language-with-no-word-for-it). The hundred
and ninety-three are: Somali, Hmong Njua, Amharic, Assamese, Nepali, Burmese,
Pashto, Sindhi, Uyghur, Kannada, Punjabi, Filipino, Vietnamese, Zulu, Xhosa,
Kinyarwanda, Nyanja, Hausa, Yoruba, Igbo, Oromo, Khmer, Lao, Sinhala, Cebuano,
Malagasy, Māori, Samoan, Hawaiian, Wolof, Bambara, Akan, Ewe, Lingala, Shona,
Southern Sotho, Setswana, Tigrinya, Ganda, Luxembourgish, Western Frisian, Low
German, Romansh, Occitan, Asturian, Sardinian, Sicilian, Corsican, Northern
Sami, Yiddish, Haitian Creole, Quechua, Guarani, Aymara, Nahuatl, Kʼicheʼ,
Mapudungun, Ojibwe, Ilocano, Waray, Hiligaynon, Kapampangan, Bikol, Balinese,
Minangkabau, Acehnese, Madurese, Tetum, Tongan, Fijian, Tahitian, Chamorro, Tok
Pisin, Sanskrit, Maithili, Bhojpuri, Konkani, Dogri, Bodo, Manipuri, Santali,
Kashmiri, Dhivehi, Tibetan, Dzongkha, Northern Sotho, Swati, Venda, Tsonga,
Kikuyu, Bemba, Luo, Sango, Fula, Kabyle, Standard Moroccan Tamazight,
Tachelhit, Rundi, Nyankole, Luba-Lulua, Kituba, Mooré, Dagbani, Dyula,
Mandinka, Ga, Tiv, Kanuri, Kongo, Fon, Nigerian Pidgin, Krio, Kabiyè, Temne,
Mende, Umbundu, Kimbundu, Zarma, Baoulé, Bini, Bulu, Jola-Fonyi, Efik, Ewondo,
Kpelle, Loma, Susu, Urhobo, Bashkir, Chuvash, Yakut, Tuvinian, Buriat,
Kalmyk, Udmurt, Komi, Erzya, Mari, Ossetic, Chechen, Abkhazian, Adyghe,
Kabardian, Avaric, Lezghian, Dargwa, Lak, Tabasaran, Ingush, Karachay-Balkar,
Kumyk, Nogai, Talysh, Kurdish, Central Kurdish, Southern Sami, Lule Sami,
Inari Sami, Skolt Sami, Kildin Sami, Veps, Livvi-Karelian, Karelian, Võro,
Tornedalen Finnish, Moksha, Komi-Permyak, Hill Mari, Khanty, Mansi,
Marshallese, Chuukese, Pohnpeian, Kosraean, Gilbertese, Niuean, Tokelauan,
Tuvaluan, Rarotongan, Wallisian, Bislama, Crimean Tatar, Gagauz, Karakalpak,
Khakas, Southern Altai, Balochi, Hazaragi, Muslim Tat, Zazaki, Shughni,
Dungan and Wakhi
leave `element-name` and `element-anion-name` out, so those 130 keys fall back
to English and `lint:i18n` reports the gap. The first nine have no settled
chemical nomenclature to seed from, and inventing one would be worse than the
English a student meets in their own textbook. Kannada has two — native
coinages reaching a dozen elements and transliterations reaching all 118 — and
picking either would misreport the other. Punjabi, Filipino and Vietnamese have two as well, and in all three the
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

**All twelve of the South Asian batch are partial, and they split five ways** —
every shape the batches above them found, arriving together for the first
time. Maithili, Bhojpuri, Konkani, Dogri, Manipuri, Kashmiri and Dzongkha are
the school-system case, in six different school systems: secondary science is
Hindi-, Nepali-, English-, Marathi- or Urdu-medium depending on the state or
the country, so in all seven the fallback *is* the curriculum, and `locales/hi`,
`locales/ne`, `locales/mr` and `locales/ur` are the parallel texts each header
names. Bodo and Sanskrit are the Samoan case: Bodo-medium schooling in Assam
*does* run to the secondary grades, and Sanskrit has words for the metals it
knew, but neither has a settled list of all 118 to seed from. Santali is the
Ojibwe shape — schooling in it stops below the grades where the table is
taught, and no table waits on the other side — and Dhivehi is `locales/to`'s and
`locales/fj`'s, both halves at once.

Tibetan is the twelfth and the one claim about a language in the set: it is the
Khmer case, the only one in the batch. Tibetan-medium secondary schooling exists
in the TAR, in Qinghai and in the exile system, and it teaches chemistry out of
textbooks that print the table in Tibetan — so the names exist, and what is
missing is a convention this seed could reproduce rather than invent, the
terminology committees and the two curricula not spelling every element the same
way. **`locales/dz` beside it is partial for the opposite reason**, Bhutan
teaching every subject but Dzongkha itself in English: two catalogs in one
script, two different reasons for the same gap, which is the sharpest form this
file has of the sentence below.

**All twelve of the African and Berber batch are partial, and — like the second
sub-Saharan batch and unlike every batch since — they split no ways at all.**
Every one of the twelve is the school-system case, and the twelve run through
a whole row of education ministries rather than one: secondary science is
taught in English or Afrikaans in South Africa, English in Eswatini, Kenya and
Zambia, Portuguese in Mozambique, French in the Central African Republic and
across Fula's whole range but Nigeria, and Arabic and French in Morocco and
Algeria, where Amazigh is taught as a subject rather than used as a medium. So
in all twelve the fallback *is* the curriculum. That is a fact about those
school systems rather than about twelve languages, which is why it reads as one
paragraph here and takes a sentence of its own in each catalog's header.

The four South African ones make the point sharpest, because `locales/af` sits
in the same classrooms and **supplies the whole table**. Afrikaans and Northern
Sotho are taught chemistry side by side, in the same schools, out of the same
syllabus; one of them has a settled list of all 118 and the other meets the
table in English. Nothing about the two languages predicts that, and nothing
about the medium of instruction is a property of a language. `locales/sw` and
`locales/ki` are the same pair in Kenya, one education system and two different
answers.

**All fifteen of the Caucasus and Kurdish batch are partial, and fourteen of
the fifteen are partial for the school-system reason.** Secondary chemistry
across the North Caucasus is taught in Russian, so for the twelve Cyrillic
catalogs the fallback *is* the curriculum, exactly as it was for the twelve of
the Russian Federation batch — one sentence for twelve education ministries
that are really one.
`locales/tly` is a two-country version of the same case and the only one that
has to name two: Talysh schooling is Azerbaijani-medium in Azerbaijan and
Persian-medium in Iran, so there is no single curriculum to point at.
`locales/kmr` is a third variant, Kurmanji-medium secondary schooling barely
existing at all — Turkish in Turkey, Arabic in Syria.

**`locales/ckb` is the fifteenth and the one claim about a language, and it
stands beside `locales/kmr` the way `locales/bo` stands beside `locales/dz`.**
Central Kurdish *is* the medium of secondary science teaching in the Kurdistan
Region of Iraq, and its schools print the periodic table in Sorani — so the
names exist, and this is the Khmer and Tibetan case rather than the
school-system one: what is missing is a settled convention this seed could
reproduce rather than invent, published lists differing in how far they
transliterate and from which source language. Two catalogs of one
macrolanguage, two different reasons for the same gap, and the Kurdish pair
makes the point in two scripts and two directions at once.

**All fifteen of the Uralic north are partial, and the batch is the first where
the school-system case and the `locales/se` case arrive together in one
family.** Twelve are the ordinary case in three mediums: Russian for Kildin
Sami, Veps, Livvi, Karelian, Moksha, Komi-Permyak, Hill Mari, Khanty and Mansi,
Estonian for Võro, Finnish for Inari and Skolt Sami. `locales/fit` is the same
case in Sweden, and it is the one place where Meänkieli parts company with
`locales/fi`, which supplies the whole table: Finland teaches chemistry in
Finnish and Sweden does not teach it in Meänkieli.

**`locales/sma` and `locales/smj` are the two that inherit `locales/se`'s
problem exactly**, and this is the second time it has arisen — the batch that
seeded Northern Sami recorded that a Sami pupil meets the Norwegian, Swedish or
Finnish names depending on which side of a border their school is. Southern and
Lule Sami are both spoken across the Norwegian-Swedish border, so both inherit
it in full, and `locales/smj`'s header says so in as many words. Three Sami
catalogs, one problem, and the answer is the same each time: choosing a list
would report a fact about a border rather than about the language.

**All eleven of the Oceania batch are partial, and every one of them is the
school-system case** — English-medium across Micronesia, Niue, Tokelau,
Tuvalu, the Cook Islands and Vanuatu, and French-medium on ʻUvea, which is
`locales/wls` and the one of the eleven pointed at a fallback that is not
English. Most of the eleven record `locales/sm`'s and `locales/haw`'s reason
beside it rather than instead of it: a Pacific language with everyday words
for the substances known long before the elements were, and no settled list of
all 118 over them. `locales/bi` names its three — «aean», «gol», «silva» — as
where a speaker should start.

**The Silk Road batch is the first that does not split all one way or the
other: twelve leave the tables out and three supply them.** The twelve are
the school-system case in six mediums — Russian for `kjh`, `alt` and `dng`,
Russian and Ukrainian for `crh`, Russian and Romanian for `gag`, Uzbek and
Russian for `kaa`, Tajik and Russian for `sgh`, Azerbaijani for `ttt`, Turkish
for `zza`, Urdu, English and Persian for `bal`, Dari and Pashto for `haz`, and
`wbl`, which is the one with no single fallback at all, a Gojali pupil meeting
the English names and a Wakhan pupil the Tajik ones. The three that supply
them are `mzn`, `glk` and `lrc`, and they are a case no earlier batch had:
see [Fifteen catalogs along the Silk
Road](#fifteen-catalogs-along-the-silk-road-and-the-first-element-table-borrowed-whole)
for why a Persian table in a Mazanderani catalog is a loan the language
genuinely uses rather than an invented nomenclature.

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

### A language CLDR has no name for

The roster is derived, so a locale's name comes from `Intl.DisplayNames` rather
than from a hand-maintained list — which is what keeps adding a language free of
per-language prose. CLDR has no language data at all for a few of the tags this
repository ships catalogs for, though, and a `<document lang>` autocomplete
offering a reader "ktu" and expecting them to know what it is helps nobody. So
`LOCALE_NAME_FALLBACKS`, in `scripts/catalogUtils.ts`, supplies a name for the
locales CLDR has none for. Which locales those are is the table's own business
and is not repeated here: it grows with every batch that seeds a tag ICU has
never heard of, and a copy of the list in this file would be a copy that goes
stale.

It fills a gap and never overrides one. ICU is asked with `fallback: "none"`, so
it answers `undefined` where it has nothing — rather than its own rendering of
the tag's subtags, which reads like a name and is not one — and the table is
read only there. The rule above therefore still holds: a language is named
whatever CLDR names it, and an entry stops being consulted the day ICU learns a
name of its own.

The names in the table are **unreviewed and machine-generated**, the same status
as the seed catalogs — the best available answer, not a speaker's. `endonym` is
optional for that reason: an entry whose endonym turns out to be wrong should
have the field deleted rather than guessed at again, and the label falls back to
the English name alone. `englishName` is required, because an English name is
what identifies a language to someone choosing one and costs nothing to be sure
of.

Two tests keep the table small and honest. One fails if any locale's label is
still just its code, so a future batch cannot reintroduce the gap silently; the
other fails on an entry ICU no longer needs, since a fallback that never fires
is indistinguishable from one that is right. Both are in `catalogLint.test.ts`.

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

### Naming a catalog when a sibling member has one too

A catalog is named after the **individual language it is written in**, not after
the macrolanguage that language belongs to, whenever a *sibling* member of that
macrolanguage also has a catalog here.

The rule exists because a macrolanguage tag makes a promise the file cannot
keep. `locales/ku` was written in Northern Kurdish (Kurmanji) while
`locales/ckb` sat beside it in Sorani: `ku` covers both, so the directory name
claimed a reader it could not serve, and the only thing keeping Sorani readers
out of it was an explicit exclusion in `MACROLANGUAGE_MEMBERS`. The same held
for `locales/kv` (Komi-Zyrian, beside `locales/koi`) and `locales/chm` (Meadow
Mari, beside `locales/mrj`). All three were renamed — to `locales/kmr`,
`locales/kpv` and `locales/mhr` — so that each tag names what is actually in the
file.

**An alias adds a fallback; it does not replace the tag.** `available` is not
only this repository's roster — a host passes its own catalogs in as
`localeResources`, and [the contract those have is that they
win](#delivery). So `negotiateLocales` asks for the tag as written *and then*
its alias, in that order. Rewriting `ku` to `kmr` before matching would step
over a host that had keyed a catalog on `ku`: its key would never be compared
against anything, and its reader would get English while the translation sat in
memory. Keeping the original in front means the host's catalog is preferred,
the alias still carries the request to the bundled catalog when no host catalog
answers. That is what makes an alias safe to add to a tag that already worked,
which all three of these were.

What an alias cannot do is tell the two tags apart. `normalizeLocaleTag` folds
`kmr` to `ku` before negotiation runs — ICU's canonicalization again — so
`<document lang="kmr">` and `<document lang="ku">` arrive as the same request,
and a host offering catalogs under *both* keys is answered with the
macrolanguage's for either. That predates the aliases rather than following
from them: `kmr` folded to `ku` before there was a `locales/kmr` to fold it
onto. Undoing it would mean `normalizeLocaleTag` declining to canonicalize
these three subtags, which changes what a normalized tag means everywhere and
is a decision worth taking on its own.

**The rename is only safe with an alias behind it, and the reason is a trap
worth stating plainly.** ICU canonicalizes each of these member codes straight
back onto its macrolanguage:

```js
new Intl.Locale("kmr").toString(); // "ku"
new Intl.Locale("kpv").toString(); // "kv"
new Intl.Locale("mhr").toString(); // "chm"
```

`normalizeLocaleTag` runs that canonicalization, so a hand-typed `<document
lang="kmr">` has already become `ku` before negotiation sees it. A directory
named `kmr` is therefore unreachable under **both** names unless something maps
the macrolanguage *forward* onto the member — which is what the `ku: "kmr"`,
`kv: "kpv"` and `chm: "mhr"` rows in `LANGUAGE_ALIASES` do. Delete them as
redundant and three catalogs fall to English with nothing to say why.

That is the mirror of the `koi`/`mrj` case: there an alias had to be *removed*
for a member's own catalog to win, here one has to be *added* for a member's own
catalog to be reachable at all. `negotiate.test.ts` asserts both the
canonicalization and the negotiation result, so neither half can be quietly
dropped.

Two consequences are worth knowing before applying this rule to a fourth
catalog. The **roster label does not change**: `Intl.DisplayNames` gives `kmr`
the same "Kurdish" it gives `ku`, so what the rename buys is a precise tag
rather than a more precise name. And a member list that had shrunk to exactly
one member disappears entirely, because that member is now the catalog's own
name — which is what happened to `kv` and `chm`.

The rule does **not** reach every macrolanguage-named catalog on the roster.
`ms`, `fa`, `sw` and others ship no sibling member catalog, so nothing about
their tags overclaims in the way `ku` did, and renaming them would move each off
the ISO 639-1 code an author is most likely to type for no gain.

### The South Asian batch

Twelve languages, and the thing they add to this file is not any one of them
but the **five Devanagari catalogs that answer the agreement question three
different ways**. Sanskrit selects on `$gender` and `$role` and inflects for
gender, number *and* case; Konkani selects on both with Marathi's three
genders; Dogri selects on `$gender` alone; Maithili and Bhojpuri select on
neither. Hindi, Marathi and Nepali were already three more answers in the same
letters. **A script says nothing about the fork**, which is the sharpest
statement of that this repository has, and `styleDescriptions.test.ts` pins all
five side by side so it cannot quietly stop being true.

Dogri is the one worth reading closely, because it is *not* a claim that Dogri
does not inflect. Its masculine -आ adjectives take an oblique; none of the three
clause positions reaches it, because the border and background are feminine and
the text colour is a direct masculine. A `$role` branch would render what the
`$gender` branch underneath it already renders — the trap named above under
[Composition, not substitution](#composition-not-substitution), and
`locales/gu`'s case a second time. Its header records which noun would have to
change for the answer to change.

**Santali is the roster's first Munda language, and the catalog that writes a
`[two]` branch everywhere one is possible.** `Intl.PluralRules("sat")` reports
`one`, `two` and `other`, because Santali marks a dual on the noun with -ᱠᱤᱱ
where the plural takes -ᱠᱚ. A dual is not new here — `ar`, `he`, `mt`, `br`,
`cy`, `ga`, `gd`, `se` and `sl` all resolve `two` and all write it — but every
one of them writes it in a handful of messages, and `locales/sat` writes it in
every counted message it has: 16 branches against Slovene's 14, Arabic's ten and
Hebrew's eight. **Tibetan and Dzongkha are the opposite extreme**: ICU reports
exactly one category for each, so no message in either can select on a count and
every counted message in both is written flat, the way `locales/ja` and
`locales/th` write theirs. The `[0]` branches that survive are matched by
*number* rather than by category — Fluent resolves an explicit number before it
consults the plural rules, which is why a wording for none is still reachable.

Three catalogs put their adjectives **after** the noun — Meitei and both
Tibetan-script ones — and all three therefore reach `[noun-tail]` for the
regular polygon, because a side count is a complement there. That is the
Austronesian batch's lesson restated from a different family: what decides the
split is the shape of the complement, not the side the adjectives sit on.

`bo` and `dz` are two directories rather than one with a script tag, and it is
the `hr`-against-`sr` case a fifth time: two standard languages, two
vocabularies, one script. `locales/dz` writes ཧོནམ where `locales/bo` writes
སྔོན་པོ, and སྦོམ where it writes མཐུག་པོ. They are also partial for *opposite*
reasons — see the chemistry paragraph above — which is the neatest illustration
in the roster that the gap is a fact about a school system rather than about a
script.

`kok` and `doi` are ISO 639-3 **macrolanguages** and join
`MACROLANGUAGE_MEMBERS` for the same published reason `qu`, `oj` and `bik` did.
The catalogs are Goan Konkani and Dogri proper; `knn` (Maharashtrian Konkani)
and `xnr` (Kangri) reach them, and `gom` and `dgo` are the members ICU already
folds and are listed anyway so each group reads as a whole. Nothing else in the
batch needs an alias: `san`, `bod`, `dzo` and `div` are all canonicalized by
`Intl.getCanonicalLocales` before negotiation is reached. `negotiate.test.ts`
holds that, and holds `kfy`, `mag`, `hoc`, `njz` and `grt` on English —
neighbours of `mai`, `bho`, `sat` and `brx` that belong to no macrolanguage
with a catalog, which is the membership rule working rather than a gap in it.

The batch adds **six script asymmetries and no new answer to any of them**.
`sa` is Devanagari and is written in more scripts than anything else here, so
`sa-Gran`, `sa-Knda` and a dozen more reach it; `kok` is Devanagari and Romi
Konkani (`kok-Latn`) reaches it; `doi` is Devanagari and `doi-Arab` reaches it;
`sat` is Ol Chiki and `sat-Deva`, `sat-Beng`, `sat-Orya` and `sat-Latn` reach
it; `ks` is Perso-Arabic and `ks-Deva` reaches it. **`mni` is the one that will
be argued with.** The rule is that a catalog is written in whatever CLDR fills a
bare tag in as — the rule that makes `sr` Cyrillic and `az` Latin — and `mni`
maximizes to `mni-Beng`, so the catalog is in Bengali letters even though Meetei
Mayek is Manipur's official script and what its schools now teach. A reader
arriving under `mni-Mtei` gets Bengali letters. Here more than anywhere else the
usual answer — a second catalog beside the first — is owed rather than
hypothetical, and its header says so.

`dv` is the batch's locale whose **endonym comes back as its English name**, so
the roster reads "Divehi" once rather than twice. That is `locales/co`'s case
with Klingon's twist: Dhivehi has a well-known endonym, «ދިވެހި», and CLDR does
not carry it.

Two of the twelve record a limit rather than a decision, and both are worth
keeping visible. `locales/ks` writes every adjective in the **masculine
citation form** although Kashmiri agrees them for gender; `noun-gender` is
filled in with the real genders anyway, so that a speaker adding the fork has
the table already and need only write the feminine forms. And `locales/dv` puts
`piecewise-condition-if` on the wrong side of the mathematics: Dhivehi's
conditional particle «ނަމަ» is clause-final and the renderer places that key
*before* what it introduces, which no wording in the catalog can fix. That is
the `locales/tpi` shape — a distinction the composition messages do not expose
— and splitting the key into a prefix and a suffix is a change to the worker
that no existing catalog needs and this one would use.

**Tibetan's case particles are the affix rule in its sharpest form yet**, and
they belong beside that rule rather than here; see
[An affix cannot be welded to a placeable](#an-affix-cannot-be-welded-to-a-placeable).

### The African and Berber batch

Twelve languages: Northern Sotho, Swati, Venda, Tsonga, Kikuyu, Bemba, Luo,
Sango, Fula, Kabyle, Standard Moroccan Tamazight and Tachelhit. Four of them
**complete South Africa's spoken official languages** — `nso`, `ss`, `ve` and
`ts` join `af`, `en`, `zu`, `xh`, `st` and `tn`, so an activity can now declare
any of the ten and get prose in it. (South African Sign Language, official
since 2023, is the eleventh and has no written form to seed.)

**Six more Bantu catalogs take the noun-class group from ten to sixteen**, and
the thing they add is how *unevenly* a class concord lands. `locales/ts` is the
case worth reading: Xitsonga has very few true adjectives, and almost
everything English calls one is a noun joined with a possessive concord — so
the class fork falls on «-kulu», «-tsongo» and the passive «-tateriwaka» and on
nothing else, where `locales/zu` forks fifteen words and `locales/sw` six. That
is not less agreement; it is agreement landing on fewer words, and
`styleDescriptions.test.ts` pins the colour holding still while the width
moves. Sotho-Tswana builds its concord out of two pieces where Nguni builds it
out of one, so `locales/nso` writes «o mokoto» where `locales/ss` writes
«lomkhulu» — which is why each catalog writes its table out rather than
deriving it.

**Fula puts the same argument on the other end of the word.** A Fula adjective
agrees with its noun's class through a **suffix**: «ɓaleewol» against a `ngol`
noun, «ɓaleere» against a `nde` one. `$gender` is a token set and nothing
outside a catalog reads its values, so the argument needed no widening to reach
a suffix any more than it needed widening to reach a noun class — which is the
cleanest demonstration this file has that the mechanism is about *what a word
agrees with* rather than about gender, prefixes, or Bantu.

**Luo and Sango select on neither argument, and they sit between catalogs that
select on three classes each.** Dholuo is Nilotic and Sango Ubangian; neither has
gender or noun classes, and `locales/ki` and `locales/bem` on either side of
them fork on `c3`, `c7` and `c9`. A region says as little about agreement
as a script does. `locales/luo` adds one thing of its own: its relative
particle «ma-» is written onto the front of the colour, including when the
colour is a placeable, which makes it the roster's first *prefix* welded
onto a value the catalog never sees. That is sound for `locales/tlh`'s reason —
«ma-» has one shape and never assimilates — and its header records the one case
that would break it.

**Sango has exactly one plural category.** `Intl.PluralRules("sg")` reports
`other` and nothing else, so every counted message in it is flat, the way
`locales/bm`, `locales/wo`, `locales/yo` and `locales/ig` already are.
**Tachelhit is the opposite surprise**: `Intl.PluralRules("shi")` reports
`one`, `few` and `other`, which is exactly the shape `bs`, `hr`, `ro` and `sr`
have, reached from Afro-Asiatic rather than from Slavic or Romance. It is the
only catalog outside Europe besides `locales/ar` with a `few` at all, and
Arabic's sits in a six-category set rather than in this three-category one. The
three Berber catalogs disagree about plural categories as much as they disagree
about script: `kab` and `zgh` have two and `shi` has three. Plural categories
are per-language CLDR data, and neither a family nor a script predicts them.

**Tifinagh is new to the roster**, and it cost `direction.ts` nothing: it runs
left to right, and `zgh` and `shi` are ordinary left-to-right catalogs. Which
Berber catalog is in which script is CLDR's decision rather than this
repository's — `zgh` and `shi` maximize to `-Tfng` and `kab` to `-Latn`, the
same rule that makes `sr` Cyrillic and `az` Latin — and `tzm` would arrive in
Latin for the same reason, which is worth knowing before someone "fixes" it.
`zgh` and `shi` are two directories rather than one with a script tag, the
`hr`-against-`sr` case a sixth time: `locales/shi` writes ⵓⵎⵍⵉⵍ where
`locales/zgh` writes ⴰⵎⴻⵍⵍⴰⵍ and ⴰⵙⴳⴳⴰⵏ where it writes ⴰⴱⴻⵔⴽⴰⵏ.

The batch adds **five script asymmetries, one of which is owed rather than
hypothetical**. `kab-Tfng` and `kab-Arab` reach the Latin Kabyle catalog;
`zgh-Latn` and `shi-Latn` reach the Tifinagh ones. **`ff-Adlm` is the fifth,
and the one that is owed.** Adlam is a living script for Fulfulde — devised in
the 1980s, encoded in Unicode 9, taught and published in — and a reader
arriving under it gets Latin. As with `mni-Mtei` in the batch above, the usual
answer, a second catalog beside the first, is a real debt rather than a
formality, and the catalog's header says so.

`ff` is an ISO 639-3 **macrolanguage** and joins `MACROLANGUAGE_MEMBERS` for
the same published reason `qu`, `oj`, `bik`, `kok` and `doi` did. The catalog
is **Pulaar**, the Senegalese and Mauritanian variety, which is `fuc` — the one
member ICU folds on its own — and the other eight members reach it. That takes
the map to nine keys, eight of them macrolanguages. None of the other eleven
needs an alias: `ssw`, `ven`, `tso`, `kik`, `sag` and `ful` are canonicalized
by `Intl.getCanonicalLocales`, and `nso`, `bem`, `luo`, `kab`, `zgh` and `shi`
have no two-letter code to be canonicalized from. `negotiate.test.ts` holds
that, and holds `tzm`, `rif`, `nd`, `nr`, `nyn` and `kln` on English —
neighbours of the seeded languages that belong to no macrolanguage with a
catalog, which is the membership rule working rather than a gap in it.

Three of the twelve read their **English name once** in `<document lang>`'s
autocomplete: CLDR has no `ss`, `ve` or `ts` language data to answer an endonym
with, so Swati, Venda and Tsonga join `locales/co` and the rest. The other nine
read both names: "Kikuyu (Gikuyu)", "Bemba (Ichibemba)", "Luo (Dholuo)", "Sango
(Sängö)", "Northern Sotho (Sesotho sa Leboa)", "Kabyle (Taqbaylit)", "Standard
Moroccan Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", "Tachelhit (ⵜⴰⵛⵍⵃⵉⵜ)" and — the case most
likely to be read as a mistake — **"Fula (Pulaar)"**, where CLDR's English name
and its endonym are two different names for the language rather than one name
twice.

**What Kabyle adds to the affix rule is a new way out**, and it belongs beside
that rule rather than here; see
[An affix cannot be welded to a placeable](#an-affix-cannot-be-welded-to-a-placeable).

### The West and Central African batch

Rundi, Nyankole, Luba-Lulua, Kituba, Mooré, Dagbani, Dyula, Mandinka, Ga, Tiv
and Kanuri — eleven languages across six families, and the batch is arranged
around one question: **where does a language put its agreement, and what does
having a family in common tell you about the answer?**

The three places it can go are set out beside `$gender` in
[Composition, not substitution](#composition-not-substitution), because that is
where a reader meets the argument rather than the batch. In short: `rn`, `nyn`
and `lua` prefix it as sixteen Bantu catalogs already did; `mos` and `dag`
suffix it, as `locales/ff` does, from a family that shares nothing relevant with
Fula's; `tiv` writes it as a separate particle, which is new; and `dyu`, `mnk`,
`gaa` and `kr` fork on neither argument, having no class and no gender.

**`ktu` is the one that carries the batch.** Kituba is Bantu — a creole whose
lexifier is Kikongo — and it forks on nothing at all, its nouns keeping their
class prefixes as frozen parts of the word and nothing agreeing with them.
Nineteen catalogs had established that Bantu means a class table; this is the
twentieth Bantu catalog and it cannot write one. What a language does with
agreement is a fact about that language, and neither its family, its region nor
its script predicts it. `locales/ln` is the neighbour that settles it: the other
Congolese vehicular language, one border and no distance away, and it kept its
concord.

**Two sister pairs sit in the batch, and they are not the same kind of pair.**
`rn` beside `rw` is the `hr`/`sr` case as it has always been applied — two
national standards, two orthographies, and differences the sound changes do not
predict, «inyishu» here against «igisubizo» there. `dyu` beside `bm` is that
rule under real strain, and `locales/dyu`'s header says so rather than leaving
a reader to find it: Bambara and Dyula are mutually intelligible to a degree
Croatian and Serbian are not, and what separates them is an orthography —
Ouagadougou and Abidjan spell «gwɛ» where Bamako spells «jɛ» — rather than two
vocabularies. They are two directories because ISO 639-3 gives them two codes
and CLDR resolves them to two countries, which is a published fact rather than
a judgement made here, and because folding one onto the other would assert the
opposite fact just as loudly. A speaker who finds the difference too thin to
keep should say so in #1521.

**The loanwords carry a border.** `mos` and `dag` are both Gur, both suffix
their concord, and borrow their mathematical vocabulary from different
languages — Mooré from French and Dagbani from English — because Burkina Faso
and Ghana teach in different ones. That is the chemistry paragraph below
arriving in the vocabulary instead of in a gap, and it is the clearest thing in
the batch about what a school system does to a catalog.

#### Negotiation, and a macrolanguage shape that is new

`kr` is Kanuri, an ISO 639-3 **macrolanguage**, and it joins
`MACROLANGUAGE_MEMBERS` for the published reason `qu`, `ff`, `bik`, `kok` and
`doi` did. The catalog is Central Kanuri, which is `knc` — the member ICU folds
on its own — and `bms`, `kby` and `krt` reach it. `kbl` (Kanembu) is
deliberately absent: ISO 639-3 gives it a code outside `kr`.

`man` is the shape no earlier batch has had. It is the macrolanguage over the
Manding varieties, and this repository now has catalogs for **three of its
members** — `bm`, `dyu` and `mnk` — and none for the macrolanguage itself. So
`MACROLANGUAGE_MEMBERS`, which folds a member onto the wider code, has nothing
to fold `man` onto and cannot answer it, and `LANGUAGE_ALIASES` does instead.
Which member it points at is CLDR's decision rather than one made here:
`new Intl.Locale("man").maximize()` is `man-Latn-GM`, the Gambia, which is
Mandinka's country, so `man` reaches `locales/mnk`. `negotiate.test.ts` asserts
the maximization as well as the mapping, so a change in ICU data fails there
rather than quietly re-pointing a macrolanguage. The half of that entry easiest
to get wrong is the other one: `bam` and `dyu` are members with catalogs of
their own and are kept out of the members list, since folding them would serve
a Bamako reader Mandinka.

`rn` is the batch's directory-naming case and needs no alias at all.
`Intl.getCanonicalLocales` rewrites `run` to `rn` before negotiation is reached
— the service it already performs for `iw`, `in` and `tl` — so the directory is
named for the two-letter code and a hand-typed `<document lang="run">` lands on
it unaided. None of `nyn`, `lua`, `ktu`, `mos`, `dag`, `dyu`, `mnk`, `gaa` and
`tiv` has a two-letter code to be canonicalized from.

**`kby` is the script debt.** Manga Kanuri maximizes to `kby-Arab`: CLDR's own
data says such a reader most likely arrives in Ajami and what they get from
`locales/kr` is Latin. That is `locales/ha`'s asymmetry in the same script and
`locales/ff`'s in Adlam, and the answer to it is a second catalog beside the
first rather than a rename of it. The header says so.

**Three of the eleven have no CLDR language name at all**, which is further
than any earlier batch went, and it is what
[`LOCALE_NAME_FALLBACKS`](#a-language-cldr-has-no-name-for) exists for:
`Intl.DisplayNames` has nothing to answer `dag`, `ktu` or `mnk` with in either
English or the language itself, so without a fallback each would be labelled
with its own code. Five more read one name, their English name and their
endonym being the same word: Luba-Lulua, Dyula, Mossi, Tiv and Kanuri. Only
`rn`, `nyn` and `gaa` get both from CLDR, as "Rundi (Ikirundi)",
"Nyankole (Runyankore)" and "Ga (Gã)".

**"Mossi" is the one likeliest to be read as an error and is not one.** CLDR
names `mos` after the people; the language is Mooré, which is what its own
catalog header calls it. They are one entry, the way "Nyanja" and Chichewa are.

#### The chemistry gap splits two ways, and one of the two is new here

Ten of the eleven are the school-system case, in two mediums across eleven
countries rather than one: English in Ghana, Nigeria and Uganda, French in
Burundi, Burkina Faso, Côte d'Ivoire and both Congos, and English or French
depending on the country for Kanuri, which spans four. So in all ten the
fallback *is* the curriculum, which is a fact about those education ministries
rather than about ten languages.

**Mandinka is the eleventh and the one claim of a different kind.** It is
spoken across three countries with three different mediums of secondary
instruction — English in the Gambia, French in Senegal, Portuguese in
Guinea-Bissau — so there is no one curriculum for a fallback to *be*, and
choosing any of the three would report which side of which border a reader's
school is on. `locales/se` reached exactly that place between Norway, Sweden
and Finland; this is the Northern Sami case in West Africa, and it is the first
time a batch's chemistry paragraph has split since the South Asian one.

### The batch continued: a creole beside its lexifier

Kongo, Fon, Nigerian Pidgin, Krio, Kabiyè and Temne — six more from the same
region, and where the eleven above were arranged around *where* a language puts
its agreement, these six are arranged around a sharper question: **what can you
learn from two catalogs that you cannot learn from either one alone?**

Three pairs answer it.

**`kg` beside `ktu`.** Kituba was seeded in the batch above as the one Bantu
catalog selecting on neither `$gender` nor `$role`: a describing word is joined
to its noun by the invariable linker «ya» and never changes shape. Kikongo is
Kituba's lexifier, and its connective agrees — «dya», «kya», «ya», «lwa» — so
that «ya» turns out to be Kongo's class-9 row, frozen. The whole of the
agreement in `locales/kg` is that one syllable, and the describing stem behind
it never moves:

| class | linker | black         | thick       |
| ----- | ------ | ------------- | ----------- |
| 5     | dya    | dya ndombe    | dya nene    |
| 7     | kya    | kya ndombe    | kya nene    |
| 9     | ya     | ya ndombe     | ya nene     |
| 11    | lwa    | lwa ndombe    | lwa nene    |

Putting `color.black` in the two files side by side is the shortest statement of
what a creole did to its lexifier that this repository can make, and it cost
nothing but the two files being in the same tree. `catalogLint.test.ts` pins
both halves — that `kg` forks and that `ktu` does not — because a header can
drift and a `$gender` fork cannot.

**`pcm` beside `kri`.** Two English-lexifier creoles with much of the same
grammar: postposed plural, a preverbal completive, `na` for identity. They still
do not look alike, because Sierra Leone settled on a phonemic orthography and
Nigeria stayed close to English spelling — «blak/wet/grin» against
«black/white/green». The seam between them is **orthographic**, where
`locales/fon`'s internal seam (below) is morphological, and neither is the same
thing as a difference in grammar. Together they are this repository's shortest
argument that "English creole" names a family rather than a catalog.

`locales/pcm` is also the catalog most likely to be mistaken for padding, since
almost every word in it is English. Its header therefore leads with the grammar
rather than the vocabulary, and asks a reviewer to read the messages aloud.

**`kbp` beside `kg`.** Kabiyè is the third Gur catalog, after Mooré and
Dagbani, and it spells its class as a suffix as they do — but with five classes
where Mooré has four and Dagbani three. Read against Kikongo it makes the
general point the batch above was building towards: the agreement is **one
morph** in each, and it lands in front of an invariant stem in Kongo, behind one
in Kabiyè, and as a separate word between the two in Tiv. Three positions, one
argument, no change to anything outside those files.

**`tem` is the one that can be checked without knowing the language.** Temne's
concord is *alliterative*: the describing word takes the same prefix the noun
itself carries, so a rendered description reads «kʌlayn kʌbana-bana kʌbana» —
the same syllable three times. In every other noun-class catalog here the
concord and the noun's own prefix are different morphs, and `noun-gender` has to
be taken on trust; in this one every entry naming a noun can be read straight
off `noun` by eye. `styleDescriptions.test.ts` pins four rows of it. It is the
third Atlantic catalog and answers differently from both the others — `ff`
suffixes its class and `wo` marks it on a determiner.

**`fon` has no agreement at all, and is here for its colour words.** Fon has
three basic colour terms — «wiwi», «wewe», «vɔvɔ» — all reduplicated statives,
and the other nine in `color` are bare French loans because there is no stem to
reduplicate. The seam is sharpest there but runs through `noun` and `fill-style`
as well, and it is morphological rather than orthographic, so a speaker
reviewing it should expect to move words across it rather than to find the loans
wrong as loans.

#### Negotiation, and the exclusion that carries the argument

`kg` is Kongo, an ISO 639-3 macrolanguage, and it joins `MACROLANGUAGE_MEMBERS`
for the published reason `kr` and the rest did: `kwy` and `ldi` reach it because
the map lists them, and `kng` because ICU already folds it.

**`ktu` is deliberately absent from that list**, and it is the one exclusion
here that is not simply "it has a catalog of its own" — though it does. Kituba
is a creole *of* Kikongo rather than a variety of it, ISO 639-3 gives it a code
outside `kg`, and folding it would serve a Kituba reader a different language.
`mkw`, Kituba of the Republic of the Congo, is left to miss for the same reason;
answering it with `ktu` would be defensible and is not a membership fact, so it
is not done. `negotiate.test.ts` asserts the exclusion on the *un-normalized*
tag, which is the only form the mistake would be visible in.

**`son` is the road not taken, and the test says why.** It is the macrolanguage
over the Songhay varieties, and it is *not* aliased the way `man` was, because
the justification `man`'s entry rests on does not exist here:
`new Intl.Locale("son").maximize()` adds no region, so CLDR has no opinion about
which variety a bare `son` means. Picking one would be the judgement these maps
avoid. The test asserts the absent region rather than merely the absent entry.

`kbp` has **no CLDR language name** in either English or itself, so it takes the
fifth entry in [`LOCALE_NAME_FALLBACKS`](#a-language-cldr-has-no-name-for) —
the mechanism the previous batch added, doing the job it was added for. The
other five are named by CLDR, and `tem` reads **"Timne"**, which is CLDR's
spelling rather than the "Temne" its own header uses. That is the "Mossi" case
again, and it is not an error.

#### The chemistry gap, and the case where the fallback is the language

All six leave `element-name` and `element-anion-name` out. Four are the ordinary
school-system case — the DRC, Benin and Togo teach secondary science in French,
Sierra Leone in English — but `pcm` and `kri` are a shape no earlier batch had.
Their lexifier *is* English, so the fallback is not merely the curriculum, it is
very nearly the language: filling those 130 keys in would produce entries
character-identical to `locales/en` and claim a translation that had not
happened. Leaving the gap visible is the honest answer, and it is the
first time that argument has applied.

### Angola, Sierra Leone and the Songhay

Mende, Umbundu, Kimbundu and Zarma — four more, and where the last two batches
asked where agreement goes and what a pair of catalogs shows, this one is
arranged around **what a family does and does not predict**.

**`umb` beside `kmb`** is the whole argument in two files. Umbundu and Kimbundu
are the two largest languages of Angola, both Bantu, both with the same noun
class system, spoken next door to one another — and Umbundu prefixes the class
straight onto the describing stem while Kimbundu leaves the stem alone and moves
an agreeing connective in front of it:

| | line (c9) | circle (c7) | point (c5) |
| --- | --- | --- | --- |
| `umb` | ongoli **yi**nene | ocilinganya **ci**nene | ondimbu **li**nene |
| `kmb` | nlonji **ya** nene | kizenge **kya** nene | kimbanza **kya** nene |

And Kimbundu's mechanism is `locales/kg`'s exactly — an agreeing «-a»
connective a thousand kilometres north, in another country, differing only in
which classes the two catalogs happen to fork on. So **family does not predict the
shape of agreement, and neither does geography.** That was #1686's lesson about
a creole and its lexifier; this is the same lesson with the creole taken out,
which makes it a fact about Bantu rather than about creolization.
`styleDescriptions.test.ts` pins both halves.

**`men` is the clearest instance of the affix rule in the tree.** Mende's
definite marker is a suffix that attaches not to the noun but to whichever word
*ends* the noun phrase, and a describing word follows its noun here — so a style
description ends in a placeable, and «{ $color }i» is exactly what
[An affix cannot be welded to a placeable](#an-affix-cannot-be-welded-to-a-placeable)
forbids. The catalog therefore leaves **every describing word indefinite**, so
that no description ends in the suffix and the suffix is never written against a
placeable — the "choose the words that land there" way out taken at the level of a whole
file rather than of one message. That is defensible on its own terms: a style
description is read out of context — "thick red line", not "the thick red
line" — and the indefinite is what Mende uses there.

Mende is also the fourth Mande catalog, and like `bm`, `dyu` and `mnk` it forks
on nothing. Four Mande catalogs, four flat `noun-gender` messages: that is a
family predicting something about agreement for once, and it is the only one in
this repository that does.

**`dje` is here for where it sits rather than for what it does.** Every other
language in these three batches but one is Niger-Congo or an English-lexifier
creole built on one; the exception is `locales/kr`, the Nilo-Saharan catalog
#1685 seeded. Songhay is neither Niger-Congo nor securely anything else — its
affiliation is genuinely unsettled, often filed under Nilo-Saharan, often
argued to be an isolate that borrowed heavily from Mande and Berber. It forks on nothing, and its header says
so plainly rather than hunting for an argument: a batch that only ever added
forking catalogs would be selecting its languages for the argument rather than
for the readers.

#### Negotiation: a second member-shaped macrolanguage, and a road still not taken

`dje` joins `MACROLANGUAGE_MEMBERS` in the shape `mnk` introduced — a *member*
catalog carrying its siblings, rather than a macrolanguage carrying its members.
`ddn`, `hmb`, `khq`, `ses`, `tda` and `twq` reach Zarma, and ICU folds none of
them on its own, so every one of those six depends on the entry existing.

**`son` is still not aliased**, and that is the half worth reading. #1686
recorded the reason when no Songhay catalog existed; Zarma's arrival makes the
alias *possible* and no more justified. `man` earns its alias because CLDR
decides for itself which member a bare macrolanguage means —
`new Intl.Locale("man").maximize()` is `man-Latn-GM`, Mandinka's country.
`new Intl.Locale("son").maximize()` adds no region at all, so CLDR has no
opinion, and picking Zarma because it is the largest would be the judgement
these maps exist to avoid. The test asserts the absent region rather than the
absent entry, so a change in ICU data — not a change of mind — is what would
reopen it.

`tda` is this batch's script debt: Tadaksahak maximizes to `tda-Tfng-NE`, so a
reader CLDR expects in Tifinagh is served Latin. That is `locales/kr`'s
asymmetry with `kby` in Ajami and `locales/ff`'s in Adlam, and the answer is a
second catalog rather than a change here.

Three codes came *off* negative-control lists this batch — `men`, `umb` and
`kmb` were all asserted to fall to English until they got catalogs of their own.
That is the only thing that should ever shorten such a list, and `nyn` set the
precedent two batches ago.

#### The chemistry gap reaches Portuguese

All four leave `element-name` and `element-anion-name` out. Mende and Zarma are
ordinary school-system cases — Sierra Leone teaches secondary science in English
and Niger in French. **Umbundu and Kimbundu are a third shape and a sharper
one.** Angola teaches in Portuguese, so the English fallback is neither the
language nor the curriculum: it answers nobody.

That is an argument for filling those keys in from Portuguese, not for leaving
them — and they are left anyway, because a Portuguese table dressed as an
Umbundu one is the substitution this whole seeding effort is careful not to
make. It is the clearest case in the repository for a real translator, and
`locales/umb` records it at the foot of its own file so #1521 can find it.

#### What reading the prose caught, and what it could not

Reviewing these four message by message against `locales/en` turned up one
defect in **all four at once**, which is worth recording because it is the
first time a single mistranslation has been unanimous: `graph-grid-invalid`
rendered "two **positive** numbers" as "two **big** numbers" in Mende,
Umbundu, Kimbundu and Zarma alike — and the message's own example,
`grid="1 0.5"`, contradicts it. Every one of the four already had the right
idiom a few keys away, in
`select-from-sequence-coprime-not-positive-integers`, so the fix was to reuse
each catalog's own words rather than to invent any.

The rest of what review fixed is the same shape: a clause the English has and
the translation dropped (`attract-to-without-nearest-point` and its two
`constrain-to-*` siblings lost "state variable" in all four), a quantifier
that changed which claim it made ("will **always** match a blank" became
"matches **only** a blank"), a complaint that reversed
(`function-domain-insufficient-dimensions` read "dimensions are not
*required*"), and buttons whose word belonged to a different control — the
orbital spin arrows were labelled with `umb`'s, `kmb`'s and `dje`'s word for
*point*, three lines from a real points control.

**What review deliberately did not fix is the larger finding**, and it is a
limit of seeding rather than a bug in these four. Each catalog spreads one
word across several English concepts that the UI shows *at the same time*:
`umb`'s «ocituwa», `kmb`'s «kifwa» and `dje`'s «dumi» each carry *variant*,
*version*, *type* and *style* together, and `men`'s «wotela» carries
*variant*, *version* and *variable*, so in all four the editor's version
footer and its variant picker are labelled identically. Three of the
four also head the feedback panel with their word for *answer*, and all four
use one noun for both *viewer* and *renderer*, so the whole-page failure and
the one-component failure read alike. Separating these needs new words chosen
by someone who speaks the language; picking them here would be the
substitution the chemistry tables are left out to avoid. They are named here
so #1521 has them.

### Ten languages, and the batch that says plainly how little it knows

Baoulé, Bini, Bulu, Jola-Fonyi, Efik, Ewondo, Kpelle, Loma, Susu and Urhobo —
ten catalogs across six families (Bantu: `ewo`, `bum`; Edoid: `bin`, `urh`;
Mande: `sus`, `kpe`, `lom`; Kwa: `bci`; Atlantic: `dyo`; Cross River: `efi`),
continuing the three batches above. Where those batches asked where agreement
goes and what a family does or does not predict, this one adds a question the
earlier ones did not have to ask so loudly: **what happens when the batch runs
out of digitized language to draw from?**

**Agreement, once more, refuses to sort by family.** `bci` (Kwa, beside `ak`)
has no gender or class and marks plural with a suffix, «mun», where Akan
prefixes it — the same split direction Dyula's qualifier suffix takes for an
unrelated reason. `bin` and `urh` (Edoid, a sibling pair the way `bm`/`dyu`
are Manding) both have no adjective-noun agreement at all: description is
carried by stative verbs and word order, not by a concord. `efi` (Cross River)
keeps a reduced noun-class prefix for number but, like the Edoid pair, never
extends it to an agreeing adjective — a reminder that "has noun classes" and
"marks agreement with them" are two separate facts, not one. `dyo` (Atlantic)
is the one genuine noun-class catalog in the batch, the same shape
`locales/tem` has: four written prefixes (`ka-`/`si-`/`bu-`/`fu-`) that mark
both the noun and the word describing it, checkable by eye the way Temne's
alliterative concord is. `sus`, `kpe` and `lom` (three different Mande
branches — Central Mande, and two Southwestern Mande sisters) fork on neither
`$gender` nor `$role`, extending the finding `bm`, `dyu`, `mnk` and `men`
already made to seven Mande catalogs in a row; `kpe` and `lom` go further
than `sus` by lacking even a definite or qualifier suffix, so Southwestern
Mande genuinely marks nothing where Central Mande and Manding each mark one
thing. `ewo` and `bum` are the pair that shows agreement can be *present* and
still not written down: both are Beti-Pahuin Bantu with a real class-concord
system, but `bum`'s header commits to two classes (`c1`/`c7`) it found enough
colour-stem data to write with confidence, while `ewo`'s header explains why
it stops short of writing any class table at all — not because Ewondo lacks
one, but because this seed did not have reliable prefix data for the specific
words it needed and judged a partial, half-remembered table worse than a flat
answer. Read together they are the clearest instance yet of the distinction
`locales/ktu` first drew between a language having no agreement and a seed
having no confidence to report one.

**This is the first batch where honest confidence caveats are the headline
rather than a footnote.** `ewo`, `bum`, `bin`, `urh`, `dyo`, `sus`, `kpe` and
`lom` all carry one in their own headers, and they are not the same caveat:
`ewo`'s is about grammatical data it could not verify; `bin`, `urh` and `sus`
lean on English or French loanwords for newer technical and UI vocabulary
because no settled digital lexicon exists to draw from; `dyo`'s `diagnostics.ftl`
and `editor.ftl` say plainly that an earlier draft was discarded for being a
mechanical re-lexification of `locales/tem` rather than a translation, and
that the rewrite is "a fluent non-speaker's construction from published
grammatical sketches... not a speaker's translation"; and `kpe` and `lom` are
the least digitized languages this repository has seeded from yet — Kpelle is
close to unattested in machine-translation training data (arXiv:2505.18905
starts from near zero), and Loma has no comparable corpus at all, so `lom`'s
own header calls itself the least certain catalog in the batch and asks a
speaker to check it first. `bci` and `efi` are the two that do not carry this
caveat: Baoulé's only honesty flag is a segmental-spelling-without-tone-marks
choice, a narrower and more confident gap, and Efik draws on a written
tradition going back to the earliest regional Bible translations, which gives
it a settled orthography and vocabulary the rest of the batch does not have.
None of this is new information the catalogs invented for this README — it is
what each file's own header already says, gathered here so a reviewer does not
have to open ten files to find the same shape repeated.

**Two candidates were dropped rather than seeded.** Vai (`vai`) and Nupe
(`nup`) were both attempted for this batch and both discarded after an honest
self-audit: Vai's draft vocabulary could not be verified against any source
this seed could check and read as fabricated rather than researched, and
Nupe's draft amounted to the English text carried over with a disclaimer
rather than to any actual Nupe content. Leaving a gap is the same policy the
chemistry tables already follow — an admitted absence over an invented
answer — applied one level up, to whole catalogs rather than to 130 keys
inside one. Neither is aliased or fallen back to anywhere; a document asking
for `vai` or `nup` reaches English, as it did before this batch, until a real
seed exists.

#### Negotiation

None of the ten is an ISO 639-3 macrolanguage, a member of a macrolanguage
already in `MACROLANGUAGE_MEMBERS`, or has a script or region surprise in its
`Intl.Locale(...).maximize()` result the way `kby` (Ajami), `ff` (Adlam) and
`tda` (Tifinagh) do — every one of the ten maximizes to its expected Latin
script and country (`bci-Latn-CI`, `bin-Latn-NG`, `bum-Latn-CM`,
`dyo-Latn-SN`, `efi-Latn-NG`, `ewo-Latn-CM`, `kpe-Latn-LR`, `lom-Latn-LR`,
`sus-Latn-GN`, `urh-Latn-NG`), so `LANGUAGE_ALIASES` gains nothing from this
batch. `ewo` and `bum`, the one Bantu pair in the batch, were the most likely
candidates for a macrolanguage or member entry given how often that shape has
recurred in the three batches above; neither is one — both are ordinary
individual languages in ISO 639-3, with no wider macrolanguage code over
either of them.

**Three of the ten have no CLDR language name at all** — `bci`, `lom` and
`urh` — and take new entries in
[`LOCALE_NAME_FALLBACKS`](#a-language-cldr-has-no-name-for): "Baoulé", "Loma"
and "Urhobo". None gets an endonym: a wrong one is worse than none, and
`locales/lom`'s own header explicitly declines to choose between "Löömàgòòi"
(the Liberian name) and "Toma" (the Guinean one) rather than guess.

#### The chemistry gap

All ten leave `element-name` and `element-anion-name` out, and all ten are the
ordinary school-system case: secondary science is English-medium in Nigeria
(`bin`, `efi`, `urh`) and Liberia (`kpe`), French-medium in Cameroon (`ewo`,
`bum`) and Senegal (`dyo`), and English- or French-medium in Côte d'Ivoire and
Guinea depending on which is meant (`bci`, `sus`). `lom` is the one worth a
sentence of its own: Loma is spoken across a border where the two sides teach
science in different languages entirely — English in Liberia, French in
Guinea — so, as `locales/mnk` and `locales/se` already established for a
border of their own, there is no single curriculum for a fallback to *be*, and
leaving both keys out serves each side of the border the same way English
already partially does for the Liberian half.

### Twelve Cyrillic catalogs, and the one that forks

Bashkir, Chuvash, Yakut, Tuvan, Buryat, Kalmyk, Udmurt, Komi, Erzya, Mari,
Ossetian and Chechen — twelve catalogs from **five families** (Turkic: `ba`,
`cv`, `sah`, `tyv`; Mongolic: `bua`, `xal`; Uralic: `udm`, `kpv`, `myv`,
`mhr`; Iranian: `os`; Nakh: `ce`), all written in Cyrillic, all spoken inside the
Russian Federation. It is the roster's first batch whose whole membership
shares a **script** without sharing a family, and that is what makes it useful:
every question the earlier batches asked about what a family or a region
predicts can be asked here about a script, and the answer is the same.

**Eleven of the twelve select on neither `$gender` nor `$role`, and the twelfth
forks.** Turkic, Mongolic, Uralic and Iranian all answer the agreement question
with a flat "no": no grammatical gender, no inflected attributive adjective, so
`noun-gender` returns one token and no message forks on it. `locales/ce` is
Nakh, and Chechen has a real class system — nouns fall into classes marked by
в-, й-, б- and д-, and an agreeing word carries the class at the *front*. So
`locales/ce` writes a class table and forks `style-filled-word` on it, which
`styleDescriptions.test.ts` pins across two classes. One script, twelve
catalogs, one fork: a script says as little about agreement as a family or a
region does, which is the sentence `locales/ts` and `locales/ktu` earned inside
Bantu and this batch earns across five families at once.

`style-unfilled` is the other word Chechen would agree, and it is the batch's
one **unreachable** fork rather than a written one. The message describes a
fill standing on its own, so `describeFill` renders it with no arguments and no
noun exists to take a class from; a `$gender` select there could only ever
render its default branch. So the catalog writes the д-class form flat, as
every other agreeing catalog in the roster does — `locales/sw`, `locales/zu`
and `locales/ts` all write theirs as one string for the same reason, which is
what makes this an argument about the message rather than about Chechen.

**`locales/ce`'s header is honest about which half of its fork it can vouch
for.** The four class markers and the agreeing participle are what this seed
could check; the class of every individual geometric noun is what it could not,
so `noun-gender` lists the entries it is confident of and defaults the rest to
`d`. That is `locales/ewo`'s judgement — a partial, half-remembered class table
is worse than an admitted gap — with the difference that the fork is written
and waiting, so filling the table in costs a speaker one line per noun.

**Two catalogs record a colour vocabulary that does not split where the style
pipeline splits, and they are unrelated.** Sakha's «күөх» covers green and
blue; Ossetian's «цъæх» covers green, blue *and* grey. The style pipeline needs
those as separate words, so both catalogs write the modern compounds that split
them — «от күөх» and «халлаан күөҕэ» for Sakha, «кæрдæгхуыз» and «æрвхуыз» for
Ossetian — and both headers say plainly that this is a choice rather than a
translation. A Turkic language and an Iranian one, one problem, one shape of
answer, and neither of them got it from the other.

**`locales/sah` is the roster's first Turkic catalog with a single plural
category.** `Intl.PluralRules("sah")` reports `other` and nothing else, so no
message in it can select on a count and every counted message is written flat —
the shape `locales/ja`, `locales/th`, `locales/bo` and `locales/dz` already
have. The eleven catalogs beside it resolve `one` and `other`. Yakut marks a
plural perfectly well; what it does not do is keep it after a numeral, so a
category would have nothing to choose between.

**`locales/cv` is the roster's fourth `zero` category, and the interesting
comparison is with the one it does *not* match.** `locales/ar`, `locales/cy`
and `locales/lv` are the other three; Arabic's and Welsh's `zero` fire for
exactly 0, and so does Chuvash's, with `one` for exactly 1. Latvian's is the
odd one out — it covers every number ending in 0 and the whole of the teens, so
21 and 101 are `one` there and `other` in Chuvash. Four languages, one category
name, three rules — which is why `locales/cv`'s header spells out where its
`[zero]` branch is genuinely reached (`answer-show-responses`, and both counts
inside `editor-accessibility-label`) and where the explicit `[0]` branch wins
first (`attempts-remaining`).

**Five catalogs record the same limit, and it is word order rather than family
that decides which.** `piecewise-condition-if` is placed by the renderer
*before* the mathematics it introduces. Sakha's «буоллаҕына», Tuvan's «болза»,
Udmurt's «ке», Komi's «кӧ» and Mari's «гын» all close the clause they condition,
so all five files record the `locales/dv` shape beside the key — a distinction
the composition messages do not expose, which splitting the key into a prefix
and a suffix would fix and which no existing catalog needs. The other seven are
clause-initial and land correctly: Bashkir's «әгәр», Chuvash's «енчен»,
Buryat's «хэрбээ», Kalmyk's «кемр», Erzya's «бути», Ossetian's «кæд» and
Chechen's «нагахь санна». Two Turkic catalogs on each side of that line, and
three Uralic on one side against one on the other: the wall is syntax, not
ancestry.

#### Negotiation

**Three of the twelve are ISO 639-3 macrolanguages, which is the most any one
batch has added to `MACROLANGUAGE_MEMBERS`.** `bua` stands over Russia (`bxr`),
Mongolia (`bxm`) and China (`bxu`) Buriat; `kv` over Komi-Zyrian (`kpv`) and
Komi-Permyak (`koi`); `chm` over Meadow (`mhr`) and Hill (`mrj`) Mari. In each,
ICU folds exactly one member on its own — `bxr`, `kpv`, `mhr` — and the rest
reach a catalog only because the map names them, which is the failure that map
exists to prevent. Each catalog says in its own header which standard it is:
Russia Buriat, Komi-Zyrian, Meadow Mari.

Only `bua` is still keyed that way. The Komi and Mari catalogs are named
`locales/kpv` and `locales/mhr` today, after the varieties they are written in,
and their macrolanguage codes reach them through `LANGUAGE_ALIASES` instead —
see [Naming a catalog when a sibling member has one
too](#naming-a-catalog-when-a-sibling-member-has-one-too).

`bxu` is the batch's **script debt** and is recorded rather than fixed: China
Buriat maximizes to `bxu-Mong-CN`, so CLDR's own data says such a reader most
likely arrives in the Mongolian script and what `locales/bua` gives them is
Cyrillic. That is `locales/dje`'s debt to `tda` in Tifinagh and `locales/kr`'s
to `kby` in Ajami, and the answer to it is a second catalog rather than a change
in `negotiate.ts`.

**The other nine filter unaided, so the batch added no `LANGUAGE_ALIASES` entry
at all** — the `kv` and `chm` rows there arrived later, with the naming rule
above — and — for the first time in several batches — **no
`LOCALE_NAME_FALLBACKS` entry either**: CLDR has an English name for every one
of the twelve. Four of those names will look wrong and are not, the
`ny`-reads-Nyanja rule again: `sah` renders as **Yakut**, `tyv` as
**Tuvinian**, `bua` as **Buriat** and `os` as **Ossetic**, and each catalog's
header says which language it is. `os` is also the one locale here whose
maximization names a country outside Russia — `os-Cyrl-GE`, Georgia — which is
CLDR's data rather than an error and costs negotiation nothing.

`mdf` was the near miss worth naming, because it was the other half of a pair
whose first half had a catalog. Moksha and Erzya are two languages with two
ISO 639-3 codes and no macrolanguage over them, so `locales/myv` could do
nothing for a Moksha reader and must not pretend to — the rule working rather
than a gap in it, exactly as `fat` and `alq` land. `krc`, `kum`, `nog`, `ady`,
`kbd`, `av` and `sel` fell to English for the same reason. Only `sel` still
does: the other seven have catalogs of their own as of the Caucasus and Kurdish
and the Uralic north batches, and `negotiate.test.ts` pins each of them in the
`describe` for the batch that wrote it.

#### The chemistry gap

All twelve leave `element-name` and `element-anion-name` out, and — like the
second sub-Saharan batch and the African and Berber one — they split no ways at
all. Secondary chemistry across the Russian Federation is taught in Russian, so
in all twelve the fallback *is* the curriculum. That is a fact about one
education system rather than about twelve languages, which is why it reads as
one sentence here and takes a sentence of its own in each catalog's header.

**`locales/tt` is the counter-example that decides it, and it sits in the same
country.** Tatar supplies the whole table, because Tatar-medium chemistry
teaching produced one; Bashkir, its nearest relative and neighbour, does not.
Nothing about the two languages predicts that, which is `locales/af` against
`locales/nso` in South Africa and `locales/sw` against `locales/ki` in Kenya,
restated a third time in a third country. Copying the Russian list into Bashkir
or Chuvash spelling would produce neither language — the argument `locales/min`
already makes against copying Indonesian's table — which is the second half of
why the gap stands.

`locales/xal` gets a sentence of its own for a reason no other catalog in the
batch has: **it is the least certain catalog here and says so in its own
header.** Kalmyk is the most endangered language seeded in this batch, its
written output is small, and its orthography drops unstressed vowels that
Buryat and Mongolian write — so a word that looks like a typo beside
`locales/bua` may well be correct and vice versa, which is exactly the class of
error this seed is least able to check. `locales/lom` set the precedent for
saying that in a file's own header rather than leaving a reader to discover it,
and 118 unreviewed element coinages would have been the least defensible thing
in the file.

### Fifteen catalogs across the Caucasus, and the batch that stops agreeing about word order

Abkhaz, Adyghe, Kabardian, Avar, Lezgian, Dargwa, Lak, Tabasaran, Ingush,
Karachay-Balkar, Kumyk, Nogai, Talysh, Kurmanji Kurdish and Central Kurdish —
fifteen catalogs from **five families** (Northwest Caucasian: `ab`, `ady`,
`kbd`; Northeast Caucasian: `av`, `lez`, `dar`, `lbe`, `tab`; Nakh: `inh`;
Turkic: `krc`, `kum`, `nog`; Iranian: `tly`, `kmr`, `ckb`), and three scripts.
It picks up where the Russian Federation batch stopped in the most literal way
available: **six of these fifteen were named in that batch's own test** as
neighbours of `ba` and `ce` that fall back to English rather than being guessed
at. `krc`, `kum`, `nog`, `ady`, `kbd` and `av` reach a catalog now because one
was written for them, not because `negotiate.ts` learned to fold a neighbour
onto a neighbour, and `negotiate.test.ts` says so where those rows used to be.

**This is the first batch that cannot be pinned as one word order.** Every
earlier one could: the Russian Federation's twelve are prenominal to a catalog,
and `styleDescriptions.test.ts` asserts that as an identity. Here ten put the
description in front of the noun and five put it behind — and the five are not
a group anyone reading a map would predict. All three Northwest Caucasian
catalogs are postnominal, and so are **both** Kurdish ones, which are Iranian
and sit at the other end of the batch from them. Northeast Caucasian, Nakh and
Turkic are prenominal throughout. So a family predicts word order inside this
batch and the region does not, which is the mirror image of what the batch says
about agreement below — and the test holds both groups from opposite sides,
`startsWith` for one and `endsWith` for the other, so that the noun is being
appended to a description or prefixed to it rather than woven into it.

**Agreement splits four ways, and only two of the four are a fork.**

`locales/inh` and `locales/kmr` genuinely agree. Ingush is Chechen's sister and
forks the в-/й-/б-/д- class system the same way `locales/ce` does — and forks
one message more: **`line-style.dashed`, which `locales/ce` leaves flat**
although «кагйина» is the same kind of participle and `describeStroke` hands
every adjective the same `$gender`. The branch is live rather than decorative,
and the divergence is a question for a speaker of either language rather than a
defect in either file; the test pins both forks so nobody flattens one catalog
to match its neighbour without answering it. `locales/kmr` is the other, and its
mechanism is not a class at all — see [The Kurdish pair](#the-kurdish-pair).

**`locales/av` agrees more than Chechen does and still forks nothing, which is
the sharpest thing in the batch.** Avar has three singular classes and a
plural, the marker is a *suffix* rather than a prefix, and — unlike Chechen,
where the colour and width words take no marker at all — **every attributive
adjective carries it**. On the face of it every style word in the file should
fork. None does, because every noun this core names is a thing rather than a
person and so is class III: `[v]`, `[j]` and `[l]` would be variants nothing
can select. That is the reachability rule `locales/ve`, `locales/ts`,
`locales/ki` and `locales/bem` already apply to their unreached Bantu classes,
arriving for the first time from a language that agrees *more* rather than
less. `locales/lbe` reaches the same place from four classes. `locales/dar` is
the one of the three whose select is actually written out — `[v]` вицӀибси,
`[r]` рицӀибси, `*[b]` бицӀибси, with only the last reachable — left standing
so that filling in a class table costs a speaker one line rather than a
rewrite.

**`locales/lez` is the Northeast Caucasian language that lost its classes**,
and its header says so where a reader who knows the family will look for a fork
and must not find one. `locales/tab`'s classes survive on numerals, verbs and
pronouns and never reach an attributive adjective. `locales/ab`'s agreement is
a verb prefix and nothing the core names is human. `locales/ady`,
`locales/kbd`, the three Turkic catalogs, `locales/tly` and `locales/ckb` never
had classes to lose, and each header says so where a reader would look for the
fork its neighbours have. Thirteen catalogs, five different reasons for the
same flat `noun-gender`, in one region; `locales/inh` and `locales/kmr` are the
only two whose `noun-gender` answers per noun.

#### The Kurdish pair

`locales/kmr` and `locales/ckb` are **two members of one macrolanguage, with a
catalog each and no catalog named after the macrolanguage itself**, and
they differ in every dimension this package has: script, direction, and whether
the language agrees.

Kurmanji is Latin (Hawar), left to right, and has masculine and feminine nouns
linked to their adjectives by an ezafe. The bound ezafe cannot be welded onto
`{ $noun }` — the constraint [An affix cannot be welded to a
placeable](#an-affix-cannot-be-welded-to-a-placeable) describes — so
`locales/kmr` writes the free particle «ya» after a feminine noun and «yê» after
a masculine one, repeating it before each further adjective, and three messages
fork on `$gender`: `style-stroke`, `style-filled` and `style-filled-with-noun`.
A line is feminine and a polygon masculine, so one description changes in three
places and the other does not change at all, which is what the test pins.
`style-filled-word` is flat, because «dagirtî» is a past participle and does
not inflect — the agreement beside it is carried entirely by the particle.

Sorani is Perso-Arabic, right to left, and **has no gender at all**, having
lost the distinction Kurmanji keeps. So `locales/ckb` forks nothing while its
sibling writes a full gender table. It solved the ezafe problem the other way
round: rather than a free particle, **every entry in its `noun` table is
written with its ezafe already on it**, so the composition messages add nothing
and the adjectives chain with a free «و». Sorani's ezafe is always written,
where Persian's is an unwritten vowel a space can carry, which is why
`locales/fa`'s answer was not available to it.

`locales/ckb` is the roster's eleventh right-to-left catalog and needed nothing
from `direction.ts`: direction is keyed on the script, `ckb` maximizes to
`ckb-Arab-IQ`, and `kmr` maximizes to `ku-Latn-TR` — ICU canonicalizes `kmr`
onto `ku` first, and both roads end in the Latin script. One macrolanguage
rendering in both directions is the plainest demonstration this repository has
that direction is a fact about a script rather than about a language.

#### Negotiation

**`kmr` is a key in `MACROLANGUAGE_MEMBERS` that is a *member* rather than the
macrolanguage, and still excludes one of its own siblings.** ISO 639-3 gives
Kurdish three members — `ckb`, `kmr`, `sdh` — and this key names one of them
and lists a second. `ckb` is left out because it has a catalog of its own, and
folding it would serve a Sorani reader Kurmanji in a script they do not read.
That is `locales/mnk` excluding `bam` and `dyu`. `sdh` reaches a catalog only
because the map names it.

The catalog was originally called `locales/ku`, after the macrolanguage, and
was renamed to `locales/kmr` under the rule described in [Naming a catalog when
a sibling member has one
too](#naming-a-catalog-when-a-sibling-member-has-one-too). A reader who types
`ku` still reaches it.

`sdh` is the batch's **script debt**, and it is recorded rather than fixed:
Southern Kurdish maximizes to `sdh-Arab-IR`, so CLDR's own data says such a
reader most likely arrives in the Perso-Arabic script, and what published
membership hands them is Latin Kurmanji. Routing it to `locales/ckb` on script
alone would read better and would be exactly the judgement these maps exist to
avoid — sharing a script is not a membership fact. That is `locales/bua`'s debt
to `bxu` in Mongolian script and `locales/kr`'s to `kby` in Ajami, and the
answer to it is a `sdh` catalog.

`lki` (Laki) is the near miss worth naming, because everything except the
published mapping points the other way: it is written in the same script as
`ckb`, and it is often described as a variety of Southern Kurdish. ISO 639-3's
macrolanguage mapping still gives it a code outside `kur`, so it falls back —
`alq` beside `oj` and `kbl` beside `kr` land the same way. `zza`, `agx`, `ddo`,
`xmf` and `sva` are the same shape in five other families, and
`negotiate.test.ts` pins every one.

**The other thirteen filter unaided, so the batch added no `LANGUAGE_ALIASES`
entry at all** — the `ku: "kmr"` row there arrived later, with the naming rule
above — and every regional and script tag — `ab-GE`, `lez-AZ`, `tly-IR`,
`ku-SY`, `ckb-IQ`, `ab-Latn`, `ku-Arab`, `tly-Cyrl` — reaches its catalog on
ICU data plus that one row. The script asymmetries the headers record: `kmr` is
Latin and answers `ku-Arab`, `tly` is Latin and answers both `tly-Cyrl` and
`tly-Arab`, `ckb` is Perso-Arabic and answers `ckb-Latn`, and
the twelve Cyrillic ones answer a Latin tag with Cyrillic. As ever the answer
to a mismatch is a second catalog beside the first rather than a rename of it.

**`lbe` and `tab` need `LOCALE_NAME_FALLBACKS` entries, and they part company
over the endonym.** CLDR has no language data for either tag, so without the
table `<document lang>`'s autocomplete would offer a reader "lbe" and "tab" and
nothing else. Lak gets both fields — its own headers name the language «лакку
маз» and three of the four repeat it — while Tabasaran gets only an English
name, because no header of its commits to a self-name in any script and a wrong
endonym is worse than none. Its label therefore reads "Tabasaran (tab)", which
is `locales/bci`'s and `locales/lom`'s shape rather than a new one.

Four of the batch's CLDR names will look wrong and are not, the
`ny`-reads-Nyanja rule again: `ab` renders as **Abkhazian**, `av` as
**Avaric**, `lez` as **Lezghian**, and `kmr` — which ICU canonicalizes to `ku`
and whose endonym it therefore gives as "kurdî (kurmancî)" — labels itself
**"Kurdish (kurdî (kurmancî))"**, nested parenthesis and all. That last one is
the label consequence of the rename spelled out under [Naming a catalog when a
sibling member has one
too](#naming-a-catalog-when-a-sibling-member-has-one-too): the tag is now the
member's, and the name CLDR answers with is still the macrolanguage's.
`supportedLocales.ts` is derived rather than hand-written,
which is the whole point: adding fifteen languages cost no per-language prose,
and the price of that is that ICU's rendering stands even when it reads oddly.
Each catalog's header says which language it is.

#### What the batch could not do, and says so

**`piecewise-condition-if` splits, and the wall is syntax rather than family.**
The renderer places the key *before* the mathematics it introduces. Abkhaz,
Adyghe, Kabardian and Lak all mark a condition on a clause-final verb form and
have no free word to put in front, so all four record the `locales/sah` shape
beside the key rather than inventing a workaround — the same limit five
catalogs of the previous batch recorded. The other eleven land correctly, and
**nine of the eleven do it with the same borrowed word**: «эгер» in Lezgian,
Dargwa, Tabasaran, Karachay-Balkar, Kumyk and Nogai, «əqər» in Talysh, «eger»
in Kurmanji and «ئەگەر» in Sorani, all of them Persian and all of them
clause-initial in languages whose own conditional is a suffix that would close
the clause. Avar's «нагагь» and Ingush's «нагахьа» are the two that land on
native words. Three Northwest Caucasian catalogs and Lak on one side of that
line, and every Turkic and Iranian one on the other — which is the shape the
previous batch found too, where two Turkic catalogs fell on each side and the
wall turned out to be syntax rather than ancestry.

**Two catalogs put a regular polygon's side count in a trailing complement**,
where thirteen fold it into the noun and leave `noun-regular-polygon`'s `[tail]`
branch empty. `locales/kbd` cannot incorporate the numeral into a word it does
not own — Kabardian would write «къуапитху», and the count arrives as a
formatted `{ $numSides }` — so it appends «къуапэ 5 иӀэу» behind the
description; `locales/ckb`'s noun carries its ezafe and takes the count in a
«بە … ەوە» phrase behind it. Those two are why `$part` is not dead weight.
`styleDescriptions.test.ts` holds all fifteen to rendering the count exactly
once, and names `kbd` and `ckb` against `ab`, `ady` and `kmr` — the three other
postnominal catalogs, which are where the tail is what the string ends with and
so the only group in which the split is visible from the outside.

**`locales/ady` and `locales/kbd` both record a limit the affix rule creates
from the other direction.** A postnominal adjective in Circassian is normally
written *together* with its noun as one word, and the noun is a placeable, so
both catalogs write it as a separate word one space away from the compound a
speaker would write. Splitting the key would not help: the affix belongs to
whichever word lands last, and that word is a placeable too.

Three catalogs are candid about vocabulary rather than grammar, and they are
where a speaker should start. **`locales/tly` is the least certain catalog in
the batch** and says so — Talysh is endangered, its written output is small,
and its Latin orthography is not fully settled even within the tradition this
catalog writes. **`locales/dar` discloses that seven of its twelve colour slots
are plain Russian words**, its header naming that the file's most valuable
edit; that is a decision to leave a visible gap rather than coin seven terms,
`locales/xal`'s judgement in a different part of a file. **`locales/nog` names
`editor.ftl` as the file with the most invented vocabulary it contains**, built
from general Kipchak on the Kazakh and Karakalpak pattern because Nogai has no
published equivalents. Correcting any of it needs no permission.

### Fifteen catalogs of the Uralic north, and the first member lists to shrink

Southern, Lule, Inari, Skolt and Kildin Sami; Veps, Livvi, Karelian, Võro and
Meänkieli; Moksha, Komi-Permyak and Hill Mari; Khanty and Mansi — fifteen
catalogs from **one family**, which is what makes the batch useful, because
every earlier batch was assembled around a region (the Caucasus), a script (the
Russian Federation) or a continent. This one holds the family constant and
varies everything else: two scripts, five countries, four branches, and a range
from a national minority language of Sweden to two Siberian languages with a
few hundred speakers each.

Held that way, the family predicts a great deal about grammar and almost
nothing about delivery.

**All fifteen agree about word order, and that is the answer to the question
the Caucasus batch left open.** That batch was the first whose members did not
agree — ten prenominal, five postnominal — which made it fair to ask whether a
batch can be pinned as one shape at all any more. This one can: every catalog
here puts the description in front of the noun, across both scripts and all
four branches, and `styleDescriptions.test.ts` holds all fifteen to it over six
nouns rather than the one the rows spell out.

**None of the fifteen forks on `$gender`, and the test says so rather than the
headers.** No Uralic language has grammatical gender, so `noun-gender` returns
one token in every file — the flat answer eleven of the Russian Federation's
twelve gave. What is new is that it is *asserted*: the same suite checks that a
catalog's adjectives come out identical whatever noun follows them, which is
exactly what `locales/inh` and `locales/kmr` fail — their descriptions come out
in two different shapes depending on the noun — and it turns "this language
does not agree" from a remark in a header into a property of the file.
(`locales/ce` and `locales/av` write a `$gender` fork too, but the branches no
noun key can reach; that is the separate thing the "Dagestanian agreement that
no message can reach" rows pin.)

**Four catalogs do use `$role`, and none of them for gender.** Finnic
adjectives agree in *case*, so `locales/vep`, `locales/olo`, `locales/krl` and
`locales/fit` fork on the syntactic position the way `locales/fi` does — a
nominative standing alone, an adessive inside a border clause. `locales/vro` is
the honest failure beside them and says so in its own header: Võro needs the
same fork and the seed declined to invent the oblique forms it would take, so
two messages read with a nominative where a genitive or adessive belongs. That
is a recorded debt of exactly the kind `locales/ewo` set the precedent for, and
it costs a speaker a handful of lines to pay off.

#### The dual, and the one Sami language that cannot write it

**`sma`, `smj`, `smn` and `sms` resolve `one`, `two` and `other`** — the `se`
shape, and the only place in the roster where a plural category exists because
a language counts in pairs. Each writes all three branches where the count and
its noun are the whole quantified phrase — `attempts-remaining` and the
editor's two accessibility counters, exactly the three messages `locales/se`
writes them in — keeping `two` and `other` apart even though they coincide in
wording, because they are two categories rather than one with a spelling
variant. Three diagnostics messages print a count inside a longer clause —
`function-domain-insufficient-dimensions`,
`function-iterates-input-output-mismatch` and
`field-function-wrong-num-outputs` — and keep English's two-branch shape, as
`locales/se` does for the first two: a count of two falls to `*[other]`, whose
noun is right after any numeral and whose verb wants the dual. Each
`diagnostics.ftl` header records that as a debt rather than a decision, and a
speaker can pay it off in a dozen lines.

**`sjd` is the family's fifth, and gets only `one` and `other`.** Kildin Sami
has a dual as surely as the others do; what it does not have is CLDR plural
data, so `Intl.PluralRules("sjd")` resolves against the *runtime's* default
locale and a `[two]` branch in that catalog would be text nothing could select.
Its header says so, `chrome.test.ts` pins both halves — the four resolving from
their own data, `sjd` resolving from something else — and the assertion is made
through `resolvedOptions().locale` rather than by rendering a count, because
what a runtime with no `sjd` data falls back to is the environment's business.

That is not a fact about Kildin Sami, and it is not rare: **eleven of these
fifteen tags have no CLDR plural data at all**, as `myv`, `kpv`, `mhr` and
`tlh` already did before them. The roster's plural shapes are a map of CLDR's
coverage, not of how the world's languages count, and the four Sami catalogs
are here to make the difference visible from inside one family.

#### Negotiation: the first entries to shrink

**`MACROLANGUAGE_MEMBERS` lost two members in this batch, and no previous batch
has ever removed one.** `koi` (Komi-Permyak) was folded onto `locales/kpv` and
`mrj` (Hill Mari) onto `locales/mhr`, both added by the Russian Federation
batch, both correct at the time: neither had anywhere else to go, and a reader
served a neighbouring standard beats a reader served English. The moment each
had a catalog of its own the fold became the thing the map exists to prevent —
`applyLanguageAlias` rewrites the tag *before* negotiation, so a `locales/koi`
on disk would have been unreachable while every Komi-Permyak reader kept
getting Zyrian.

So `kv` was left listing `kpv` alone and `chm` listing `mhr` alone. That was
`kmr` excluding `ckb` and `mnk` excluding `bam` and `dyu`, arriving for the
first time as a *removal* rather than as an omission, and `negotiate.test.ts`
asserts it as a removal: `koi` and `mrj` reach themselves even when the
neighbouring standard's catalog is also on offer.

Those two one-member lists are gone now, and their disappearance finished the
argument this batch started. A list folding a macrolanguage's last unwritten
member onto a catalog written *in* that member is not a fold at all, so when
the catalogs were renamed to `locales/kpv` and `locales/mhr` both rows became
`LANGUAGE_ALIASES` entries instead. See [Naming a catalog when a sibling
member has one too](#naming-a-catalog-when-a-sibling-member-has-one-too).

**`mdf` moved for the same reason without ever having been folded.** The
Russian Federation batch pinned Moksha on English and explained why at length:
Moksha and Erzya are two languages with two ISO 639-3 codes and no
macrolanguage over them, so `locales/myv` could do nothing for a Moksha reader
and must not pretend to. `locales/myv`'s own header ends that argument by
saying the answer is "a `locales/mdf` beside this one, not a widening of this
one". This batch wrote that file. The row moved rather than being deleted,
because what it was pinning still holds — Moksha reaches a catalog now because
one was written for it, not because `negotiate.ts` learned to fold a sister
onto a sister.

**Seven near misses, more than any earlier batch, because the north is full of
languages one code away from a catalog.** `sje` (Pite), `sju` (Ume) and `sjt`
(Ter) are Sami beside four Sami catalogs; `izh` (Ingrian), `liv` (Livonian) and
`vot` (Votic) are Finnic beside five. `fkv` (Kven) is the sharpest: it stands
to `fit` roughly as Meänkieli stands to Finnish, is written in a closely
related orthography, and is a separate ISO 639-3 language on the other side of
a national border — so folding it would be a judgement about how close two
varieties are rather than a published fact, which is `lki` beside `ckb` and
`alq` beside `oj`.

**`smi` is left to miss for `son`'s reason rather than `nah`'s**, and the
difference is CLDR's rather than a preference. Both are collection codes, and
this repository aliases `nah` because it names one written standard the group's
members can be served with. `smi` covers ten languages in two scripts across
four countries, and `new Intl.Locale("smi").maximize()` adds neither script nor
region — CLDR has no opinion about which of them a bare `smi` means, exactly as
it has none about `son`. Picking Northern Sami because it is the largest would
be the judgement these maps exist to avoid. The test asserts the absent
maximization rather than merely the absent entry, so a change in ICU data fails
there and invites someone to reconsider.

**Four locales need `LOCALE_NAME_FALLBACKS` entries** — `sjd`, `olo`, `kca` and
`mns`, which CLDR has no language data for at all — and they split over the
endonym the way `locales/lbe` and `locales/tab` do. Three of the headers name
their own language, so those spellings are copied into the table letter for
letter; no `locales/olo` header commits to a self-name, so Livvi-Karelian's
label reads "Livvi-Karelian (olo)" rather than guessing between the Livvi and
the Finnish spelling of it. Two more of the batch's CLDR names will look
wrong and are not, the `ny`-reads-Nyanja rule again: `mrj` renders as
**Western Mari** where every header in it says Hill Mari, and `fit` as
**Tornedalen Finnish** where the language calls itself Meänkieli. The table
fills gaps and never overrides ICU, so both stand as CLDR writes them and each
catalog's header says which language it is.

#### What the batch could not do, and says so

**`piecewise-condition-if` splits four against eleven, and the wall is syntax
rather than branch.** The renderer places the key *before* the mathematics it
introduces. Komi-Permyak's «кӧ», Hill Mari's «гӹнь», Khanty's «ки» and Mansi's
«ке» are all clause-final enclitics, so all four record the `locales/dv` shape
beside the key rather than inventing a workaround — the same limit
`locales/kpv`, `locales/udm` and `locales/mhr` recorded in the Russian
Federation batch, which means every Permic and Mari catalog in the roster now
sits on that line. The other eleven land correctly, and they include both of
the batch's Cyrillic non-Ugric files: Moksha's «кда» and Kildin Sami's «кōhт»
open their clauses, as the four Latin Sami catalogs'
«jis»/«jus»/«jõs» and Finnic's «ku»/«gu»/«kun»/«jos» do. Two Ob-Ugric and two
Volga-Permic catalogs on one side, every Sami and Finnic one on the other.

**`locales/kca` and `locales/mns` record a second limit that no earlier catalog
has**: their causal postposition follows the clause it marks, so English's "X
is ignored because Y" cannot be written as one sentence and both files write
two. That is the affix rule from a new direction — not a bound morpheme that
cannot reach a placeable, but a free word whose position the message shape does
not offer — and both `diagnostics.ftl` headers name it as a real loss rather
than a stylistic choice.

**Four catalogs are candid about vocabulary rather than grammar, and they are
where a speaker should start.** `locales/kca` and `locales/mns` say plainly
that much of their editor and diagnostics vocabulary is **coined rather than
attested**, and each lists its coinages by name in its own header — the
`locales/nog` disclosure applied to two whole files. `locales/sjd` marks itself
the least certain of the five Sami catalogs, for `locales/xal`'s reasons:
severely endangered, small written output, Russian technical nouns where
written Kildin uses them. `locales/sms` records that a large share of its
lexicon is *derived* from Northern Sami by regular sound correspondence rather
than found in Skolt, and names the two words it is least sure of. Correcting
any of it needs no permission.

**Two pairs of catalogs are deliberately not copies of each other, and both say
so.** `krl` and `olo` are Karelian Proper and Livvi, two ISO 639-3 languages
with no macrolanguage over them, close enough that a reader of one can largely
read the other — which is exactly why neither file is a respelling of the
other: `krl` has «š», the adessive `-lla/-llä`, «ta» and «kun»; `olo` has plain
«s», the merged `-l`, «da» and «gu», and takes its technical nouns from Russian
where `krl` takes Finnic ones. `mdf` and `myv` are the same relationship one
branch over. Neither pair can serve the other's reader and neither pretends to.

### Eleven catalogs across Oceania, and the batch that grades its own confidence

The roster goes from 245 locales to 256: Marshallese (`mh`), Chuukese (`chk`),
Pohnpeian (`pon`), Kosraean (`kos`) and Gilbertese (`gil`) in Micronesia;
Niuean (`niu`), Tokelauan (`tkl`), Tuvaluan (`tvl`), Rarotongan (`rar`) and
Wallisian (`wls`) in Polynesia; and Bislama (`bi`), the English-lexified creole
of Vanuatu.

It is the first batch assembled around **an ocean** rather than a family, a
script or a state, and the first whose members are spread across nine countries
and territories without a single shared administration between them.

#### The batch that needed nothing from the maps

`MACROLANGUAGE_MEMBERS` and `LANGUAGE_ALIASES` are **unchanged**, and after two
batches that each turned on them that is worth saying rather than passing over.
The Caucasus batch had to keep `ckb` *out* of a list it had never been in; the
Uralic north had to take `koi` and `mrj` *out* of lists they were already in.
Here not one of the eleven is a macrolanguage, not one is a member of one, and
not one was being folded onto a wider code — so every tag reached English on its
own account before this batch and reaches its own catalog after it.
`negotiate.test.ts` asserts that as a property rather than leaving it implicit:
each of the eleven resolves to itself against the full roster and to English
against a roster of English alone.

Two of them — `mh` and `bi` — have ISO 639-1 codes, so a reader can also arrive
under the alpha-3 (`mah`, `bis`) that `Intl.getCanonicalLocales` folds. Those
rows are pinned because the folding is ICU's rather than this repository's.

#### Not one member has CLDR plural data

This is the first batch of which that is true, and it inverts the Uralic north's
finding. There, four Sami catalogs wrote a `[two]` branch because their own CLDR
rules select it and a fifth could not; here the fifth case is the whole batch.
`Intl.PluralRules` resolves all eleven tags against the *runtime's* default
locale, so a category branch in any of these files would be text selected by
English's rules on English's terms.

The catalogs are not the worse for it, because the grammar agrees with the
constraint: a noun in these languages is not marked for number after a numeral,
so a single unselected form is the right translation as well as the safe one.
`chrome.test.ts` holds all eleven to it — no `zero`, `two`, `few` or `many`
branch anywhere — and holds the other half too, that each still renders its
count and still selects the explicit `[0]` branch, which is matched against the
number rather than against a category and so stays legal.

Two catalogs found the same wall from a different direction. Pohnpeian and
Gilbertese both count with **numeral classifiers**, and in both the classifier is
a suffix on the numeral word — «uoua», «ruuw», never «2-ua» — so a count that
arrives as `{ $count }` gives it nothing to attach to. That is the README's
existing "an affix cannot be welded to a placeable" rule reached through a
classifier rather than through a case ending, and `chk` records it a third time.

#### A declared confidence scale, and the tier that was dropped

The honest thing about this batch is that its eleven catalogs are **not equally
good, and each one says where it sits.** Published lexical material for these
languages ranges from a modern dictionary with a searchable web edition to a
1907 missionary wordlist that exists nowhere as text, and the catalogs track
that range rather than papering over it:

- **Translated.** `pon`, `mh`, `chk`, `niu`, `tkl`, `tvl`, `rar`, `wls`, `bi`
  write their own vocabulary throughout, leaning on a published dictionary each
  header names.
- **Framed.** `kos` and `gil` write a catalog's *frame* in the language —
  «Tia ku in…», «Wangin…», «ke sripen» — around English technical nouns, and
  say so.

**A third tier was seeded and then dropped from the batch, which is worth
recording rather than losing.** Nauruan (`na`), Yapese (`yap`), Palauan (`pau`)
and Rotuman (`rtm`) began as correct frames with the whole technical lexicon
declared as English loans, and a later pass recovered their *basic* vocabulary —
colour terms, thick and thin, the geometric nouns — from Josephs, Churchward and
Jensen. That recovery reached `content.ftl` and stopped there, because the style
tables are single words and the other three namespaces are sentences: their
`chrome.ftl`, `editor.ftl` and `diagnostics.ftl` stayed byte-identical to
English, translating none of their 67, 64 and 220 messages. Shipping them would
have put over 5,000 lines of English under four locale directories where the
existing English fallback already puts identical text on screen, so all four are
held back for a later batch with better lexical sources. Every key, placeable and
variant key is in place in them, so nothing structural stands in the way; what
they need is words.

No word went in by guess. Where a dictionary gave nothing the English loan
stands and is *declared* a loan rather than respelled by an invented loan
phonology — `locales/kos` argues that case explicitly, on the grounds that
`b c d g h j q v x z` are not Kosraean letters, so a loan should stay visibly a
loan. `styleDescriptions.test.ts` pins the words that are the language beside
the ones that are not, which makes replacing a loan a visible diff rather than a
silent improvement.

#### A colour system that is not English's

`locales/gil` is the batch's one colour-system mismatch: «mawaawa» covers green
and blue both, so it is assigned to one key and the other keeps a loan, with the
header saying why rather than splitting the word silently.

#### Word order, and a disagreement inside a subfamily

Ten of the eleven put the adjectives behind the noun and one puts them in
front — `bi`, which follows `locales/tpi`. A region is not a word order and here
neither is a family: the ten postnominal catalogs and the one prenominal one all
share the region, and every catalog but `bi` shares the family. Two catalogs
write a linker out themselves: `chk`'s relative «mi» and `gil`'s «ae».

The sharper split is over the side count. Eight of the eleven — `chk`, `pon`,
`kos`, `niu`, `tvl`, `rar`, `wls` and `bi` — make it a following clause and so
reach `[noun-tail]`, which is the widest use `[noun-tail]` has had in one batch.
The other three fold it into the head: `mh`, `gil` and `tkl`, each because its
own grammar puts it there. `tkl` is the interesting one, because it is
Tuvaluan's closest relative here and `tvl` went the other way — a disagreement
*inside* a subfamily, which no earlier batch's had, and both files state their
choice so a reviewer can tell it is deliberate.

A catalog that reaches `[noun-tail]` has to place the tail the same way in
`style-with-noun` and in `style-filled-with-noun`, or the same polygon is
assembled two ways in one language depending on whether it is filled.
`locales/pon` and `locales/kos` each said in their headers that the tail closes
the phrase and then placed it right after the noun in the filled message; both
are corrected, and `styleDescriptions.test.ts` now renders the filled phrase for
all eleven so the two messages cannot drift apart again.

#### Pairs that are deliberately not copies of each other

Five relationships in this batch could each have produced a respelling of an
existing catalog, and every one of the five is argued in a header instead.
`niu` and `wls` both sit beside `locales/to`: Niuean has no glottal-stop letter
where Tongan writes the fakauʻa, and Wallisian writes /ŋ/ as a single `g`, so
"correcting" a `g` to `ng` would convert that file into Tongan. `rar` sits
beside `locales/mi` and `locales/ty` with a ten-row correspondence table and the
instruction not to edit it back toward Māori. `bi` sits beside `locales/tpi`
with fifteen rows and the rule stated outright that resemblance is not
evidence. And `tkl` and `tvl` sit beside each other and beside `locales/sm`,
each warning that the two are expected to look alike and that **their agreement
is not evidence either is right**, since one process produced both — the
self-suspicion the Uralic north batch had to discover by auditing itself, built
in here from the start.

`tkl`'s header also names its own largest risk, which is the shape this
convention takes when a sound law is only half applicable: Samoan `ʻ`
corresponds to Tokelauan `k` where it continues Proto-Polynesian \*k and to
nothing where it does not, and the seed cannot always tell which.

#### Also here

- A `LOCALE_NAME_FALLBACKS` entry for `wls`, the only tag of the eleven CLDR
  has no name for in any language, its own included. The endonym «Fakaʻuvea» is
  copied letter for letter from `locales/wls`'s headers — `locales/sjd` fashion
  rather than `locales/olo` fashion, because those headers do commit to a
  self-name. ICU knows the other ten, down to `tkl` and `niu`, which makes this
  the best-named batch the roster has had.
- Two tags left to miss for `smi`'s reason one family up: `map`, the ISO 639-5
  collection over all Austronesian languages, which maximizes to nothing at all,
  and — recorded rather than fixed — `und-WF`, which CLDR maximizes to
  **French**. That is true of Wallis and Futuna's administration and schooling,
  and is why `locales/wls`'s loans are French-mediated where `locales/to`'s are
  English-mediated; `locales/rar` is the mirror image, taking English loans where
  `locales/ty` takes French ones.
- Twelve near misses, and the Pacific's are sharper than the north's because its
  language boundaries do not follow its political ones. `kpg` and `nkr` are
  *Polynesian* languages spoken inside the Federated States of Micronesia, so
  neither the country's catalogs nor the family's is the right answer. `fud`
  (East Futunan) is this batch's `fkv` and sharper than `fkv` was: it is not
  merely a sister of a catalogued language but is spoken in the **same
  territory** as `wls`.
- The first catalogs to carry `math-embedded-input-blank`, its ordinal and
  `math-embedded-input-shape-unsuitable`, which no earlier seeded batch has, so
  each of the eleven sits at 445/575 rather than 442.
- Regenerated locale roster and schema, so `<document lang>` autocompletes all
  eleven.

#### Honesty

Every string is machine-generated and unread by a speaker, and each catalog says
so in its own header. Beyond the confidence scale above, `locales/chk` names
«pwóón» — its word for *answer*, the highest-frequency word in the catalog — as
one it could not confirm, and `locales/gil` names its colour line as its least
certain. Each catalog lists its own coinages, and correcting any of it needs no
permission.

### Fifteen catalogs along the Silk Road, and the first element table borrowed whole

The roster goes from 256 locales to 271: Crimean Tatar (`crh`), Gagauz
(`gag`), Karakalpak (`kaa`), Khakas (`kjh`) and Southern Altai (`alt`) —
Turkic, across four states and two scripts; Mazanderani (`mzn`), Gilaki
(`glk`), Northern Luri (`lrc`), Balochi (`bal`) and Hazaragi (`haz`) —
Iranian, Perso-Arabic and right to left; Muslim Tat (`ttt`), Zazaki (`zza`)
and Shughni (`sgh`) — Iranian in three other scripts; Dungan (`dng`), which is
Sinitic written in Cyrillic; and Wakhi (`wbl`), a Pamir language of northern
Pakistan.

It is the first batch assembled around a **trade route** rather than a family,
a script, a state or an ocean, and the loosest grouping the roster has had:
what its members share is a corridor, and almost every property this file
tracks splits inside it.

#### Three scripts, and five catalogs that had to choose between two

The batch writes **Latin** (`crh`, `gag`, `kaa`, `ttt`, `zza`, `wbl`),
**Cyrillic** (`kjh`, `alt`, `sgh`, `dng`) and **Perso-Arabic** (`mzn`, `glk`,
`lrc`, `bal`, `haz`). That count understates it, because **five of the fifteen
are written in two scripts today** and each of those five had to choose one
and say so:

- `crh` writes the **Latin alphabet standardized in Ukraine in 2021**, and its
  header states plainly that Cyrillic is equally current among readers in
  Crimea. `kaa` writes the **current Latin alphabet** of Karakalpakstan's
  schoolbooks, over a Cyrillic that is also official and whose replacement has
  been legislated and put off more than once. `ttt` writes the **Latin
  alphabet of Azerbaijan**, over the Cyrillic that Dagestan has used for
  longer and in which most published Tat still appears. `wbl` writes the
  **Latin practice of Pakistan** without diacritics, over the Cyrillic of
  Tajikistan. `sgh` writes the **Cyrillic of Gorno-Badakhshan**, over the
  Latin and Arabic-script practices used chiefly in Afghanistan.
- The rule every one of them states is the same, and it is the roster's
  existing one: a corrector who prefers the other script must convert **all
  four files at once** and must never mix two alphabets inside a catalog.
- `locales/kjh`'s and `locales/alt`'s headers go further and name the exact
  extra letters their files may contain — **і ғ ң ӧ ӱ ӌ** and **ј ҥ ӧ ӱ** —
  warning a corrector not to fold them into their Russian look-alikes. That is
  a checkable claim, and worth re-checking after any edit: dumping the
  non-ASCII letters a catalog actually uses is a one-liner, and it is how two
  homoglyph slips in the seed were found. `locales/kjh` had written the
  Tajik **ҷ** (U+04B7) where Khakas has **ӌ** (U+04CC), and `locales/dng` the
  Latin **ə** (U+0259) beside the Cyrillic **ә** (U+04D9) it uses everywhere
  else — the same phoneme spelled two ways in one file, invisible on screen
  and fatal to a search.

Three of the Perso-Arabic five make an orthographic choice of a different
kind. The Gilaki and Luri Wikipedias write «ؤ» for /o/ and «ۊ» for /u/;
`locales/glk` and `locales/lrc` **decline the convention**, on the ground that
applying it evenly would mean guessing the vowel of every borrowed technical
term and that half an orthography is worse than none. `locales/mzn` declines
the same two letters for the same reason. All three then have to say that «ؤ»
still occurs inside Persian loanwords like «مؤلفه», where it is an ordinary
hamza carrier and not the vowel letter, so that nobody "fixes" it.

**Two script asymmetries, both the `locales/ha` and `locales/kr` shape.**
`new Intl.Locale("crh").maximize()` is `crh-Cyrl-UA` and
`new Intl.Locale("kaa").maximize()` is `kaa-Cyrl-UZ`, while both catalogs are
Latin — so a reader arriving under `crh-Cyrl` or `kaa-Cyrl` reaches a Latin
catalog. That is the asymmetry `pa`, `sr` and `ha` already have, and the
answer to it is a second catalog rather than a rename of the first. The other
thirteen agree with CLDR: `ttt` maximizes to `-Latn-AZ`, `zza` to `-Latn-TR`,
`wbl` to `-Latn-PK`, `sgh` to `-Cyrl-TJ`, `dng` to `-Cyrl-KG`, `kjh` and `alt`
to `-Cyrl-RU`, `gag` to `-Latn-MD`, and all five Perso-Arabic ones to `-Arab`.

#### Negotiation: two macrolanguages, and a member that names the standard

`MACROLANGUAGE_MEMBERS` gained exactly **two** entries.

**`zza: ["diq", "kiu"]`** is the sharper of the two. `locales/zza` is written
in the **Vate standard**, which leans on the Northern forms where Northern
(Kirmanckî, `kiu`) and Southern (Dimlî, `diq`) Zazaki part company.
`Intl.getCanonicalLocales("diq")` already returns `zza`, so the Southern code
reached the catalog without help; `kiu` does not fold and reaches it **only
because this list exists** — and `kiu` names the very variety the catalog is
written in. That inverts the usual shape of these lists, where the member the
map has to rescue is the one the catalog serves least well.

**`bal: ["bcc", "bgn", "bgp"]`** is the ordinary shape with its cost named.
`locales/bal` is Southern Balochi as written in Pakistan, on the Urdu letter
inventory; `bcc` is that variety's own code and the one ICU already folds.
`bgn` (Western Balochi, written in Iran) and `bgp` (Eastern) reach the catalog
through the map alone, and the entry says outright that the Iranian
orthography is a different convention rather than a spelling variant, so a
Western Balochi reader is served a spelling they must adjust to. That is the
trade region-stripping makes everywhere else — a language they can read rather
than English — and the answer to it is a second catalog.

**`zza` also left a list, which is the batch's other negotiation change.** It
had been one of the Caucasus batch's near misses in `negotiate.test.ts`,
listed there beside `lki` as a language one code away from a catalog it must
not be folded onto. Seeding it turned it from a near miss into a hit, so it
was removed from that list rather than left to assert something no longer
true. `lki` stays exactly where it was, which is the point: Laki did not
become reachable because a neighbour did.

Nothing else moved. `LANGUAGE_ALIASES` is unchanged, and thirteen of the
fifteen tags are neither macrolanguages nor members of one.

Four tags are worth naming as near misses this batch does **not** fold, and
each is one code away from a catalog it resembles: `bqi` (Bakhtiari) and `luz`
(Southern Luri) beside `locales/lrc`, which is Northern Luri and an individual
language with no macrolanguage over it; `srh` (Sarikoli) and `yah`
(Yazgulyam), Shughni's own subgroup, beside `locales/sgh`; and `jdt`
(Judeo-Tat) beside `locales/ttt`, which `locales/ttt`'s header explicitly
names as a separate written tradition rather than a variety of itself.

**`prs` is the one that needs saying because it is *not* a near miss.**
`Intl.getCanonicalLocales("prs")` returns `fa-AF`, so a Dari reader
region-strips to `locales/fa` today and gets Iranian Persian. That is exactly
the fact `locales/haz`'s chemistry argument turns on, below.

#### One tag with CLDR plural data, and fourteen without

`bal` is the one, and it is worth reading beside `fa`.
`new Intl.PluralRules("bal").resolvedOptions().locale` is `"bal"`, its
categories are `one` and `other`, and **zero falls in `other`** — where
Persian's rule counts zero with the singular. So a `[few]` or `[many]` branch
would be unreachable, and `locales/bal` writes none.

What `locales/bal` also does not do is fork a **count**, and that is a fact
about Balochi rather than about CLDR: a Balochi noun after a numeral stays
unmarked, so the two categories would carry identical text. Every count
message is a single `*[other]`.

The other fourteen tags have no CLDR plural data at all, so
`Intl.PluralRules` resolves them against the **runtime's** default locale and a
category branch in any of those files would be text selected by something
else's rules. Thirteen of the fourteen collapse their count selects to one
form rather than writing a branch nothing could select — and the grammar
agrees with the constraint in all fifteen, since Turkic, Iranian and Sinitic
alike leave a noun unmarked after a numeral.

**`[one]` still appears in eleven of the fifteen, and almost everywhere it is
not a count.** Ten catalogs — every one of the fifteen except `alt`, `kaa`,
`kjh`, `ttt` and `sgh` — write exactly one `[one]`, and all ten write it in the
same message: `field-function-wrong-num-outputs`, which forks on how many
outputs a component *needs* ("one output" against "two outputs") rather than on
a quantity the reader is looking at. `alt`, `kaa` and `kjh` write that same
fork as the numeric literal `[1]`, which Fluent matches against the number
before consulting any plural rule and which therefore does not depend on whose
rules the runtime picked; `ttt` omits the message. **`locales/sgh` is the one
catalog in the batch that forks a real count**, in sixteen places across three
files — plus the same output fork the other ten write, twice over — and it has
no rules of its own to do it with: English's rules
select the branch and it says the same thing as the `*[other]` beside it, so a
Shughni reader is served Shughni either way. That is recorded rather than
forbidden — `one` is the one category every runtime default can select — and
`test/chrome.test.ts` pins the whole distribution, reading each catalog's
`chrome.ftl` and `diagnostics.ftl` together so that a claim about a catalog is
not checked against a fraction of it.

English's explicit `[0]` numeric
literals are kept everywhere, because Fluent matches those against the number
itself before consulting any plural rule. `locales/dng` gives the sharpest
reason for keeping one: Dungan says "none left" with the negative «мый»
rather than with a numeral.

#### The chemistry gap splits twelve against three, and the three are new

Twelve catalogs leave `element-name` and `element-anion-name` out, for the
reasons the roster already knows: no settled list, and a school system that
teaches the periodic table in another language. The mediums are listed in
[Catalog layout](#catalog-layout) above. Two of the twelve add something to
that argument:

- **`locales/haz` is the only catalog in the roster whose gap is a *missing
  sibling* rather than a missing list.** Hazaragi is a variety of Persian, so
  a Persian table is exactly the kind of loan the three below ship — but the
  table a Hazara pupil meets is the **Dari** one, which differs from
  `locales/fa`'s Iranian names in a scatter of places and belongs in a `prs`
  catalog that does not exist. Writing the Iranian names and calling them
  Hazaragi would report a fact about Tehran. So the keys fall back to English
  and the header says which catalog would end the argument.
- **`locales/wbl` is the one with no single fallback at all.** Wakhi's
  readership is split across three states: a Gojali pupil meets the English
  names and a Wakhan pupil the Tajik ones. English falls through, which is
  what half the readership's textbooks print, and the header says that
  choosing either would hide the split.

**`locales/mzn`, `locales/glk` and `locales/lrc` supply the tables, and they
carry `locales/fa`'s character for character.** That has been checked rather
than asserted: all three files' `element-name` and `element-anion-name` are
byte-identical to the Persian ones.

This is a case no earlier batch had. Every complete table in the roster until
now was a language's own list — Afrikaans's, Bosnian's, Swahili's — or, in
`locales/jv` and `locales/su`, an adapted one: those two take the Indonesian
names their schools' textbooks print, but their `element-name` tables are
*not* `locales/id`'s, because both keep their own words for the substances
known long before the elements were. These three copy a neighbour's table
**unchanged**, and argue for it: chemistry in Māzandarān, Gilan and Lorestan is **taught, examined and
printed in Persian**, so the settled, checkable list of 118 names a
Mazanderani, Gilaki or Luri speaker actually reads and writes *is* the Persian
one. It is a loan the language genuinely uses rather than a nomenclature this
seed invented, which is the only kind of table it may ship — and it serves a
reader better than English, which is neither their school language nor their
own. All three headers forbid the obvious "improvement": a corrector must
**not** respell these names with Mazanderani, Gilaki or Luri vowels or attach
a native plural to them, because there is no native nomenclature to correct
them towards and respelling would produce a vocabulary nobody uses.

That decision has an arithmetic consequence worth recording. **`locales/glk`
and `locales/lrc` are the first non-English catalogs in the roster to reach
575/575** — `lint:i18n` reports them at full coverage, ahead of `fa`, `de` and
every other complete catalog, all of which sit at 560/575 because they predate
the fifteen newest keys. `locales/mzn` is at 573/575, and its two gaps are
deliberate and shared with `fa`: it omits `noun.slope-field` and
`noun.vector-field`, because Mazanderani has no phrase for either that is not
a transparent calque of the English. The other twelve sit at 445/575, except
`alt` and `kjh` at 443 and `ttt` at 435.

**`locales/ttt` is the batch's thinnest catalog and the only one that omits
anything beyond chemistry.** Its `diagnostics.ftl` leaves out ten of the
longest messages — the three `style-definition-*` contrast paragraphs, the
`<slopeField>`/`<vectorField>` pair and `field-variables-ignored`, the two
`sectionWideCheckWork` paragraphs, `math-input-invalid-function-names` and
`math-embedded-input-shape-unsuitable` — on the ground that writing
four-clause sentences about software would mean inventing a Tat syntax for a
subject Tat has never been written about. The header names the omitted groups
where they would have appeared, so a reviewer sees the gaps rather than
hunting for them. `alt` and `kjh` are two keys thinner than their Turkic
siblings for `locales/mzn`'s reason rather than `locales/ttt`'s: neither could
establish an Altai or Khakas phrase for a slope field or a vector field, and
both say beside the gap that a calque would be invention.

#### Word order splits inside the batch, and inside a family

Eleven catalogs put the description in front of the noun and four put it
behind, and the split does not follow the family, the script or the region.
The eleven prenominal ones are every Turkic catalog (`crh`, `gag`, `kaa`,
`kjh`, `alt`), `dng`, `sgh`, `wbl`, `bal` — and `mzn` and `glk`. The four
postnominal ones are `lrc`, `haz`, `ttt` and `zza`, which link the noun to its
modifiers with an **ezafe**.

**The Iranian catalogs disagree with each other, which is the batch's most
useful finding.** Mazanderani and Gilaki are head-final: an adjective precedes
its noun, so `style-with-noun` reads `{ $description } { $noun }` — English's
order, arrived at from the opposite direction, and the exact reverse of what
`locales/fa` writes. Northern Luri and Hazaragi are head-initial and build the
phrase the Persian way. Four Iranian languages, all four of them beside `fa`
and borrowing most of their technical vocabulary from it, and they do not
agree about the one thing a reader would expect a family to settle.

**Balochi is the third position and states it as a decision.** Its
attributive suffix `-ēn` sits on the **adjective**, which the catalog writes
itself, so the prenominal order it chooses disposes of the placeable problem
entirely: nothing is welded to a value the catalog cannot see. An ezafe
construction does exist in Balochi, chiefly in the Eastern varieties and in a
literary register, and the header says a corrector who prefers it must convert
the whole file rather than one message.

**`locales/zza` takes `locales/ckb`'s way out** — its ezafe is a bound vowel
on the noun (`-o`, `-a`, `-ê`, with `y` inserted after a vowel), so every
entry in its `noun` table is written **with its ezafe already on it** and the
composition messages add nothing. Two stiffnesses are recorded rather than
hidden: written Zazaki repeats the ezafe before each modifier after the first
and this catalog writes it once, and a masculine noun after «bi» takes the
oblique where this catalog writes the direct form. `locales/ttt` is the one
that had no way out and welded the affix anyway; see [An affix cannot be
welded to a placeable](#an-affix-cannot-be-welded-to-a-placeable).

**Two catalogs write an affix against a placeable and are not that case.**
`locales/wbl` puts its postpositions «-ir» and «-dar» straight onto
`{ $component }` and `{ $startLine }` in about two dozen places, and
`locales/sgh` does the same with Tajik's «-ро». Both affixes have a single
invariant shape, so this is `{ $numSides }-kulmio`'s adjacency rather than
`locales/tg`'s agreement, and all three of `locales/wbl`'s headers that
mention the postpositions now say which of the two it is. `locales/gag` is the
one place in the batch where the distinction had to be *acted* on: a Gagauz
ordinal suffix harmonizes with the vowels of the spoken numeral — «beșinci»
but «dokuzuncu» — which a digit does not show, so the line and row numbers are
written with a period after the figure, `{ $line }. satır`, exactly as
`locales/crh` and `locales/tr` write theirs.

Only four catalogs use `[noun-tail]` — `lrc`, `haz`, `bal` and `zza` — and the
other eleven fold a polygon's side count into the head, because a modifier
precedes in all of them.

**Not one of the fifteen forks on `$gender` or `$role`,** which is the second
batch in a row of which that is true. The reason is different this time.
Oceania's eleven had no gender to fork on; here **two of the fifteen do**, and
both decline for stated reasons rather than by default. `locales/zza` has
masculine and feminine, and spends the agreement in the `noun` table, so the
attributive adjectives after the ezafe are invariable and nothing is left to
fork. `locales/sgh` is the honest failure: Shughni distinguishes gender in the
demonstratives, in some nouns and in parts of the verb, and its header says in
as many words that the seed cannot assign the right gender to *line*, *curve*
and *region* and would rather leave the agreement flat than get it wrong in
eighty places — with the note that the machinery is already wired for a
speaker who fills `noun-gender` in. `locales/wbl` is a third shape again: it
declines to write down "no gender" as a *finding*, because the Pamir languages
differ here, and says what it is actually confident of, which is that it has
no reliable table to fork with.

#### Naming: five gaps, the most any batch has needed

`LOCALE_NAME_FALLBACKS` gained five entries — CLDR names none of `kjh`,
`haz`, `dng`, `sgh` and `wbl` in any language, their own included. No earlier
batch needed more than four. That is a fact about where these languages are
written rather than about how many speak them: ICU knows the other ten of the
fifteen.

The five split over the endonym the way `locales/lbe` and `locales/tab` do,
and the split is decided by the catalogs rather than by the table.
`locales/kjh` and `locales/wbl` each name their language exactly one way
wherever their headers name it at all — `wbl` in all four files, `kjh` in
`chrome.ftl` and `content.ftl` — so «хакас тілі» and «Xik zik» are copied
letter for letter. The other three name theirs **two** ways — «хуэйзў хуа»
beside «хуэйзў йүян», «Шугнонӣ» beside «х̌уг̌нӯн зивод», «هزارگی» beside
«آزرگی» — so all three take `locales/olo`'s shape and their labels read
"Dungan (dng)", "Shughni (sgh)" and "Hazaragi (haz)": an admitted gap rather
than a guess.

**Three of the ten CLDR does name, it names differently from the catalogs, and
all three stand** — the `ny`-reads-Nyanja rule, arriving three times in one
batch where the Uralic north, the last batch to hit it, hit it twice. The roster renders `kaa` as
**Kara-Kalpak**, `bal` as **Baluchi** and `zza` as **Zaza**, where every
header in those files writes Karakalpak, Balochi and Zazaki. The table fills
gaps and never overrides ICU, so each catalog's own header says which language
it is and the label stays as CLDR writes it.

A fourth mismatch is finer and is worth knowing about because it looks like an
inconsistency. CLDR's endonym for `lrc` is «لۊری شومالی» and for `mzn`
«مازرونی» — the first spelled with the very «ۊ» those catalogs decided not to
use, the second without the diacritic `locales/mzn` writes. So the roster's
label and the catalog's own prose disagree about a letter. Both are right in
their own place: the label is CLDR's and the file is the seed's, and neither
is authority over the other.

#### What the batch could not do, and says so

**Three catalogs say outright that most of their vocabulary is not their own
language's.** `locales/lrc`, `locales/mzn` and `locales/glk` each state that
apart from the copula, the plural suffix, the numeral classifier and a short
list of everyday words, the vocabulary in them is **Persian**, deliberately
and openly, because none of the three has a register of its own for geometry
or for software. All three tell a reviewer to expect to be **rewriting
sentences, not correcting typos**. `locales/haz` records the mirror image:
most of its vocabulary is shared with Dari word for word, and **a Dari word in
that file is not an oversight** — the two places Hazaragi's own usage shows
are «قد» for *with* and «بلدِ» for *for*.

**`locales/sgh` goes further than any catalog in the roster has.** Its
`diagnostics.ftl` header says that Shughni has no written register for
compiler diagnostics at all, that a Shughni speaker who reads an error message
reads it in Tajik or Russian, and that the file therefore keeps **that loan
register** rather than inventing a Shughni one: the wording is Tajik almost
throughout, with the Russian internationalisms Tajik itself uses, and **only
the conjunctions are Shughni** — «ат» for *and*, «йо» for *or*. It calls
itself a usable frame and not yet Shughni prose. That is the Oceania batch's
"framed" tier stated for two whole namespaces rather than for a vocabulary.

**`locales/kjh` and `locales/alt` say how thin they are before they say
anything else.** Khakas has a literary standard and a press but essentially no
written technical register — mathematics and chemistry in Khakassia are taught
in Russian — and its header says the catalog is **thinner and less certain
than its Turkic siblings `tyv` and `sah`**, with much of the geometric
vocabulary a first attempt at a calque rather than an attested word. Southern
Altai is better provided for and still tells a speaker to expect to rewrite
rather than merely correct. Both name the same suspicion: their
corner-based figure names («кӧп пулуңныг», «кӧп мӱйӱштӱ») read as Khakas and
Altai, and a mathematics teacher in either republic would very likely write
«треугольник» and «прямоугольник», because that is what the textbook in front
of them says. Neither file picks the register; both ask a speaker to.

**`locales/wbl` names the risk that a reader outside Pakistan may not
recognize its spellings at all**, since the Cyrillic used in Tajikistan is the
other live orthography and converting to it would mean changing the source
language of the loans as well — Tajik and Russian instead of Urdu and English
— which is why its header calls that a conversion rather than a
transliteration. It also says its colour line is its least certain: the seed
could not establish Wakhi's own basic colour terms, so all twelve are the
Persianate words current across the region.

**`locales/ttt` marks itself the least certain of the batch and asks a
reviewer to assume every line needs work**, which is the strongest such
statement any catalog in the roster makes.

Every string in all fifteen is machine-generated and unread by a speaker, and
each file says so at the top. Correcting any of it needs no permission.

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

The glob is what makes adding a language cost a directory. It is also why two
builds need a different answer. The worker is one file — an IIFE started from
a blob URL in some variants — so it cannot code-split, and *being reachable is
enough*, whether or not anything calls it, to fold every catalog in. The
standalone build is code-split, but serves its catalogs as plain
runtime-fetched files all the same: as served assets they can be
version-pinned, and the single-file `doenet-standalone-inline.js` variant
published beside it stays free of them too. Both therefore define
`__DOENET_CODE_SPLIT_CATALOGS__` false, which makes the glob dead code. The
standalone build then copies
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
since a script is what shares a module registry: a package that emits both a
bundle and a worker holds a copy in each quite correctly, while the code-split
standalone bundle is judged over its entry and `chunks/` together, because
those load into one registry.

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

### A variant key is an interface, not prose

A key is not the only identifier a catalog has to leave alone. Fluent matches a
variant by comparing the selector's value to the key *letter for letter*, so
`$parts`, `$role`, `$reason`, `$context` and the rest are symbols the core
passes in and a translated key is not a translation — it is a branch nothing can
reach:

```ftl
style-definition-insufficient-contrast =
    { $context ->
        [text-on-background] …
       *[text-on-canvas] …
    }
```

Rename `[text-on-background]` and the message still parses, still lints, still
resolves — and quietly renders the default for every input that should have
chosen it. `locales/fit` shipped exactly that, having applied Meänkieli's
`on` → `oon` spelling rule to the keys along with the sentence around them.

`symbolicVariantKeys` in `scripts/catalogUtils.ts` lists the keys a catalog
selects on, and `catalogLint.test.ts` holds every translation's list against
English, one test per locale. Plural categories are excluded, because those are
the keys a language *is* entitled to differ on: CLDR gives each its own set, so
a catalog resolving `one` and `other` where English resolves `one`, `two` and
`other` is right rather than broken — see [The dual, and the one Sami language
that cannot write it](#the-dual-and-the-one-sami-language-that-cannot-write-it).
The check is a subset rather than an equality for the mirror-image reason: a
catalog may legitimately select on more than English does — `locales/kmr` and the
Dagestanian catalogs nest a `$gender` select inside `$parts`, and the four
Finnic catalogs fork on `$role` — so what it forbids is a branch going *missing*,
which is the only shape the failure takes.

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
values. The nineteen Bantu catalogs that fork on one — Swahili, Zulu, Xhosa,
Kinyarwanda, Nyanja, Shona, Lingala, Ganda, Southern Sotho, Tswana, Northern
Sotho, Swati, Venda, Tsonga, Kikuyu, Bemba, Rundi, Nyankole and Luba-Lulua —
answer it with the noun's **class** (`c3`, `c5`, `c6`, `c7`, `c9`, `c11` and
`c12`) rather than with a gender, and nothing outside them had to learn what a
noun class is. Ganda answers with the widest set, six; Nyankole with five, and
its fifth is `c12` — «akadomo», the point, is a diminutive there, as it is in
Ganda. The reachability rule applies to the class tokens exactly as it does to
`$role`: a catalog writes a branch for a class only if its own `noun-gender`
can answer that class. That is why Swahili and Nyanja carry `c6` — the plural
class, which their word for *text* or *border* lands in — and the other
seventeen do not, and why Venda, Tsonga, Kikuyu and Bemba stop at `c3`, `c7`
and `c9`: no noun the core names is class 5 in any of the four, so the ḽi-,
leri-, i- and ili- forms are named in those catalogs' headers rather than
written as branches nothing can select.

**Fula answers it with a class too, and the concord is a suffix.**
`locales/ff` writes «ɓaleewol» against a `ngol` noun and «ɓaleere» against a
`nde` one, so the same argument that reaches the front of a Bantu adjective
reaches the back of a Fula one. Nothing outside the catalog changed to allow
that, which is the point: what `$gender` names is *what a word agrees with*,
not where the agreement is spelled.

**The Gur pair spells it the same way from a different family**, which is what
turns Fula's case from a curiosity into a shape. `locales/mos` and
`locales/dag` are Mooré and Dagbani, they suffix the concord as Fula does, and
they disagree with each other about how many classes the core's nouns reach —
Mooré forks four ways and Dagbani three. A class inventory is a fact about
which nouns a catalog happens to name, not about a family, which is what the
nineteen Bantu catalogs have been saying all along in a script where it is
easier to miss.

Both write the *juxtaposed* construction, where the noun keeps its own class
suffix and each modifier agrees with it, rather than the compound one, where
the noun drops to its bare stem and the last modifier carries the suffix alone.
That is the affix rule below: the last element of a description is often a
placeable, and a suffix cannot be welded to a word the catalog never sees. It
is *choose the words that land there* applied to a whole construction rather
than to one word.

**Tiv writes it as a word of its own, which is the third place it can go.**
`locales/tiv` has very few true adjectives — what English calls one is a verb
of quality there — and a verb of quality modifies a noun through a relative
particle, «u», «i» or «a», chosen by the noun's class. So «vesen» and «nyian»
never change and the particle in front of them does. Prefix, suffix, separate
word: three positions, one argument, and no change to anything outside a
catalog to reach any of them.

Tiv is also `locales/ts`'s shape rather than `locales/zu`'s — it forks on six
words and leaves nine alone, where Zulu forks all fifteen, because a language
with few adjectives has few places for agreement to land. That is not less
agreement; it is agreement landing on fewer words.

**`locales/ktu` is the catalog that forks on nothing, and it is Bantu.** Kituba
is a creole whose lexifier is Kikongo: its nouns keep their class prefixes as
frozen parts of the word and nothing agrees with them, so a describing word is
joined by the invariable linker «ya» and never changes shape. It answers
`noun-gender` with one token, the way `locales/en` does, and it is pinned from
both ends: `styleDescriptions.test.ts` holds three rendered rows whose
describing words are identical and whose nouns are all that differ, and
`catalogLint.test.ts` asserts at the source that no message in `locales/ktu`
forks on `$gender` at all, so a fork appearing there has to delete an assertion
rather than merely pass one. `locales/ln` is the instructive neighbour — the
other Congolese vehicular language, which kept its concord. A family says as
little about agreement as a region or a script does.

Gender is not the only thing an adjective has to agree with. Three sets of
words are rendered in two places each — a border's adjectives, the background
colour, and the text colour beside it — once standing alone as a state
variable reports them and once embedded in a clause, and a language that
inflects for case wants a different form in each. So every adjective is handed
`$role` as well, naming the *position* the phrase is going into rather than
the case it takes: which case a position governs is the catalog's business,
exactly as `$gender`'s token set already is. `locales/en/content.ftl` lists the
positions, and `be`, `bs`, `cs`, `de`, `el`, `et`, `fi`, `fo`, `hi`, `hr`,
`is`, `ka`, `kok`, `lt`, `lv`, `mr`, `pa`, `pl`, `ps`, `ro`, `ru`, `sa`, `sd`,
`sk`, `sl`, `sq`, `sr`, `uk`, `ur` and `yi` are the catalogs that select on
them. `locales/sa` and `locales/kok` both take the widest set the fork allows —
three genders and all four positions, which is the shape `de`, `ru`, `pl`,
`cs`, `hr`, `sr` and `sl` already have — and `sa` writes it in every one of the
sixteen adjectives, where `kok` writes it in nine. Sharing a script does
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
| the definite article on the value | `ro`, `men` | the article is a suffix — «secțiune» → «secțiunea», «wa» → «wai» |
| a preposition before the value | `cs`, `sk` | «v»/«ve» and «s»/«se» vocalize according to what follows |
| a compound with the value | `fi` | Finnish writes a compound as one word |
| a case particle after the value | `bo`, `dz` | the particle has four shapes, picked by the final letter of the syllable before it |
| the annexed state on the value | `kab`, `zgh`, `shi` | a Berber noun changes its initial vowel after a preposition — «tawinest» → «n twinest» |

Adjacency is not the problem. `{ $numSides }-kulmio` is correct Finnish for
every side count, because `-kulmio` is the same whatever number lands in front
of it. What cannot be written is *agreement* with an unknown word.

**Tibetan and Dzongkha are the table's sharpest entry, and the way out they
take is the fifth one.** A Tibetan case particle is chosen by the *final letter
of the syllable before it*: the agentive is གིས་, ཀྱིས་, གྱིས་ or ཡིས་ and the
genitive གི་, ཀྱི་, གྱི་ or ཡི་. Beside a placeable there is no syllable to
look at. So `bo/content.ftl` and `dz/content.ftl` — the two files that
*compose* a phrase, and so the two that get to choose their particles — use
only the ones that have a single shape: དང་ for accompaniment, ལ་ (Dzongkha
ལུ་) for location, ནང་ for containment. That is *prefer the free allomorph
over the bound one* applied to a particle rather than to a prefix, and the
third family to take that way out, after Kʼicheʼ and the Bisayan catalogs.

**The other three files in each are where the way out runs out**, and it is
worth saying because no earlier catalog has shown the boundary this clearly. A
message that names a thing the document contains — `summary-statistics-caption`,
the fifteen `variant-*` diagnostics — needs a genitive, and there is no
invariant genitive to reach for. Both catalogs write the default shape, གི་ and
གིས་, after a placeable: correct after most syllables and wrong after some.
That is a recorded limit, and the reason to write one shape rather than guess
per message is that a single wrong form is findable where a scatter of them is
not. Both headers say so outright.

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

**`locales/ttt` is that paragraph with the mitigation missing, and it is the
first catalog in the roster to weld a shape-changing affix onto a placeable
and record the result as wrong.** Muslim Tat builds the same phrases Tajik
does, and its ezafe is `-i` after a consonant and `-yi` after a vowel. Where
the catalog writes the word itself it writes the right one; where the ezafe
has to follow `{ $noun }`, `{ $color }` or `{ $width }` it always writes a
hyphenated `-i`, which is wrong after every vowel-final word — and Tat's own
noun table has vowel-final entries in it. The header says so in as many words
and names it the first thing a speaker should fix. The reason it is written
that way rather than left out is the same one `locales/bo` gives: one wrong
shape everywhere is findable, and a scatter of guesses is not.

There are five ways out, and every catalog here takes one of them:

- **Name what the value is.** «للمكوّن { $component }» — "for the component X"
  — puts the affix on a word the catalog writes.
- **Reach for a word that can stand beside it.** A postposition in Urdu, a
  relative clause in Finnish («jossa on vinoneliöitä»), a demonstrative in
  Hungarian («ehhez: { $answerId }»).
- **Choose the words that land there.** Czech's pattern for horizontal lines is
  «horizontální čáry» rather than «vodorovné čáry», because «v vodorovné» would
  have wanted «ve». `locales/men` takes the same way out across a whole file
  rather than one message, staying in the indefinite so that no description ever
  ends in a definite suffix — see
  [Angola, Sierra Leone and the Songhay](#angola-sierra-leone-and-the-songhay)
  for why that is the right reading of Mende rather than a dodge.
- **Write both forms.** Hungarian's «a(z)» is the standard orthographic answer
  to exactly this problem, and predates software by a long way.
- **Prefer the free allomorph over the bound one.** Where the affix has a
  free-standing counterpart that is grammatical in every position, write that:
  Kʼicheʼ's relational «rech» in place of the possessive prefix «u-»/«r-», and
  the Bisayan linker «nga» in place of the enclitic `-ng`, which is what
  `locales/ceb` already does — see
  [A ligature is an affix too](#a-ligature-is-an-affix-too).

**The three Berber catalogs sharpen the third of those into something new: make
the position uniform, and one written form is right in all of them.** A Berber
noun after a preposition goes into the *état d'annexion*, and `$pattern` is a
noun these catalogs never see — so no branch can inflect it. What they do
instead is arrange that every one of the four places a fill pattern is placed
puts it behind the *same* preposition «s», including `style-fill`, where
English has no preposition at all. `fill-style` then writes its words already
annexed and cannot be wrong anywhere. That is *choose the words that land
there* with the extra step of choosing how many positions there are to choose
for, and `styleDescriptions.test.ts` pins two of the four so that a branch
dropping the preposition fails rather than quietly producing an unannexed noun.

The same three catalogs also settle a question the affix table can otherwise
make look decided: **an alternation that a clause position triggers is not
automatically a `$role` fork.** The annexed state is exactly the kind of thing
`$role` exists for, and all three select on `$gender` alone — because the state
falls on the *noun*, and every noun a clause position lands on is one the
catalog writes out. A `$role` branch would render what the `$gender` branch
underneath it already renders, which is `locales/gu`'s trap reached from
Afro-Asiatic.

**Dholuo welds a prefix onto a placeable, which nothing else here does.** Its
relative particle «ma-» is written as part of the following word, and the
following word is often a value: `locales/luo` writes `ma{ $color }`. It comes
out right for `locales/tlh`'s reason rather than by luck — «ma-» has one shape
and assimilates to nothing — and it is written on the colour arguments alone
(`$color`, and `$background` beside it in `style-text`), because `line-width`
and `line-style` write their words already marked and would come out doubled;
so the table above stays a list of languages whose endings *change shape*, and
gains a language whose beginnings do not.

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
is stated as a rule here because three families now take it: the Bisayan
catalogs, Kʼicheʼ, and the two Tibetan-script ones, which reach it for a case
particle rather than for a linker.

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

Sixteen ship: `ar`, `fa`, `he`, `ur`, `ps`, `sd`, `ug`, `yi`, `ks`, `dv`,
`ckb`, and the Silk Road batch's five Iranian ones — `mzn`, `glk`, `lrc`,
`bal` and `haz`. Nothing about the file format changes for any of them. A `.ftl` pattern
is a sequence of characters in **logical** order — the order the text is spoken
— and `dir` decides where each run is drawn, so a translation is written as read
and never reordered by hand to look right in an editor. Brackets, quotes and
dashes are the same characters in every one of these scripts and are written
opening-first; the bidi algorithm turns them around at render time. Digits stay
Latin, as [everywhere else](#digits-are-latin-separators-are-not), which is why
an Arabic sentence and the mathematics beside it count in the same characters.

**Direction is not a language family.** These sixteen share a writing direction
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
| `ks` | precede the noun | m/f | two |
| `dv` | precede the noun | none | two |
| `ckb` | follow the noun | none | two |
| `mzn`, `glk` | precede the noun | none | none in CLDR |
| `lrc`, `haz` | follow the noun | none | none in CLDR |
| `bal` | precede the noun | none | two |

The last three rows are the Silk Road batch's, and they are the first entries
in this table whose language is neither Arabic, Persian, Hebrew nor a language
of South Asia. Four of the five sit beside `locales/fa` and take most of their
technical vocabulary from it, and the two rows they occupy are the point: the
Caspian pair is head-final and needs no ezafe at all, while Northern Luri and
Hazaragi are head-initial and build the same phrases the way Persian does. A
family is not a word order either.

`ur` is the outlier worth knowing about: its grammar is `hi`'s, so `locales/hi`
is the closest thing to a parallel text for it and a correction to one is
usually a correction to both. `ug` is Turkic and agrees with nothing, and `dv`
is Indo-Aryan and agrees with nothing either — the two reach the same answer
from opposite families. `ks` is the one of the sixteen whose catalog records a
gap rather than a decision: it *does* agree an adjective for gender and this
seed does not, which its header says outright. `ckb` is the only one whose
*sibling* is on the roster in the other direction — `locales/kmr` is the same
macrolanguage in Latin, left to right — and the only one that solves the affix
problem by writing the linker into its `noun` table; see [The Kurdish
pair](#the-kurdish-pair). `yi` is Germanic, and it forks on `$role` for a
reason none of the other fifteen does: `ur`, `ps` and `sd` fork because an
Indo-Aryan or Iranian adjective takes an oblique before a postposition, and
Yiddish's adjectives take a **dative** after «מיט» and «אויף» — so its catalog
has the shape `locales/de` and `locales/bs` have rather than `locales/hi`'s,
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
  `one` in Persian, whose rule counts zero with the singular — and `other` in
  Balochi, which is the sharpest form of the warning, since `bal` is a
  neighbour of Persian whose CLDR rule disagrees with it about exactly this.
  The other four of the Silk Road's right-to-left catalogs have no CLDR plural
  data at all, so nothing selects in them by category. That is why a
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
  the script: Persian, Urdu and Uyghur leave a noun singular after a numeral —
  as do all five of the Silk Road's right-to-left catalogs — while Arabic,
  Hebrew, Pashto and Sindhi pluralize it.

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
