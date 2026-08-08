import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

vi.mock("hyperformula");

/**
 * i18n Phase 2 (#1517): style descriptions follow the *content's* language.
 *
 * These go through the whole worker path — `setLocaleData`, the document's
 * `locale` state variable, the `translator` dependency, and the shared
 * description definitions — rather than calling the `describe*` helpers
 * directly, which `@doenet/utils`' golden-file suite covers. What is checked is
 * that the locale reaches the definitions at all, and that it is the document's
 * locale rather than the host's when the two disagree.
 */
describe("style descriptions follow the document locale @group4", () => {
    async function descriptions(
        doenetML: string,
        names: string[],
        documentLocale?: string,
    ): Promise<Record<string, string>> {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            documentLocale,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const values: Record<string, string> = {};
        for (const name of names) {
            const idx = await resolvePathToNodeIdx(name);
            values[name] = stateVariables[idx].stateValues.value;
        }
        return values;
    }

    // Every word spelled out, so the expectations below do not silently track
    // whatever the default palette happens to say this release.
    const styled = `
    <setup>
      <styleDefinition styleNumber="1" lineColor="red" lineWidth="6"
        lineStyle="dashed" fillColor="blue" fillStyle="dots"
        markerColor="green" markerStyle="square" />
    </setup>
    <graph>
      <line through="(0,0) (1,1)" name="l" />
      <point name="p" />
      <circle name="c" filled />
    </graph>
    <text name="st" extend="$l.styleDescription" />
    <text name="stn" extend="$l.styleDescriptionWithNoun" />
    <text name="pt" extend="$p.styleDescriptionWithNoun" />
    <text name="sh" extend="$c.styleDescriptionWithNoun" />
    <text name="bd" extend="$c.borderStyleDescription" />
    <text name="fd" extend="$c.fillStyleDescription" />
    `;
    const names = ["st", "stn", "pt", "sh", "bd", "fd"];

    it("renders English by default", async () => {
        const values = await descriptions(styled, names);
        expect(values.st).eq("thick dashed red");
        expect(values.stn).eq("thick dashed red line");
        expect(values.pt).eq("green square");
        expect(values.sh).eq(
            "filled blue circle with dots and a thick dashed red border",
        );
        expect(values.bd).eq("thick dashed red");
        expect(values.fd).eq("blue dots");
    });

    it("renders Spanish when the host asks for it", async () => {
        const values = await descriptions(styled, names, "es");
        expect(values.st).eq("discontinua gruesa roja");
        expect(values.stn).eq("línea discontinua gruesa roja");
        expect(values.pt).eq("cuadrado verde");
        expect(values.sh).eq(
            "círculo azul relleno con puntos y un borde discontinuo grueso rojo",
        );
        // Reported on its own, the border's adjectives agree with "borde".
        expect(values.bd).eq("discontinuo grueso rojo");
        expect(values.fd).eq("puntos de color azul");
    });

    it("negotiates a regional tag down to the catalog it has", async () => {
        const values = await descriptions(styled, names, "es-MX");
        expect(values.stn).eq("línea discontinua gruesa roja");
    });

    it("negotiates a region to the script it implies", async () => {
        // Chinese is catalogued by script, so `zh-TW` names no directory, and
        // stripping its region leaves `zh`, which names none either. Only a
        // negotiation that consults CLDR's likely-subtags gets to `zh-Hant`.
        const values = await descriptions(styled, names, "zh-TW");
        expect(values.stn).eq("紅色粗虛線直線");
    });

    it("agrees a Marathi adjective with the gender of what it describes", async () => {
        const values = await descriptions(styled, names, "mr");
        // «चौरस» is masculine and «वर्तुळ» neuter, so the same colour word
        // arrives as हिरवा in one and निळे in the other. The stroke's own
        // words — जाड, तुटक, लाल — end in a consonant and never change, which
        // is why `bd` and the border inside `sh` read alike here; the case
        // below is the one where they do not.
        expect(values.stn).eq("जाड तुटक लाल रेषा");
        expect(values.pt).eq("हिरवा चौरस");
        expect(values.sh).eq(
            "ठिपके वापरून भरलेले निळे वर्तुळ आणि जाड तुटक लाल किनारीसह",
        );
        expect(values.bd).eq("जाड तुटक लाल");
        // Reported on its own, the fill names «भरण» — the noun whose neuter
        // the colour was handed. Inside `sh` the colour agrees with «वर्तुळ»
        // instead and the pattern hangs off the same वापरून, so only the
        // standalone form carries the noun.
        expect(values.fd).eq("ठिपके वापरून निळे भरण");
    });

    it("inflects a Marathi border for the position it lands in", async () => {
        // The `$role` fork through the whole worker path rather than through
        // the `describe*` helpers: «काळी» agrees with the feminine «किनार»
        // reported on its own, and goes oblique to «काळ्या» in front of the
        // postposition -सह. A colour ending in -आ is what makes the two
        // visible; the fixture above has none.
        const doenetML = `
        <setup>
          <styleDefinition styleNumber="1" lineColor="black" lineWidth="6"
            fillColor="blue" />
        </setup>
        <graph><circle name="c" filled /></graph>
        <text name="sh" extend="$c.styleDescriptionWithNoun" />
        <text name="bd" extend="$c.borderStyleDescription" />
        `;
        expect(await descriptions(doenetML, ["sh", "bd"], "mr")).toEqual({
            sh: "भरलेले निळे वर्तुळ जाड काळ्या किनारीसह",
            bd: "जाड काळी",
        });
    });

    it("agrees a Gujarati adjective with three genders in one document", async () => {
        const values = await descriptions(styled, names, "gu");
        // «રેખા» is feminine, «ચોરસ» masculine and «વર્તુળ» neuter, so «જાડી»
        // and «લીલો» come out of the same tables differently — and «વાદળી» is
        // one of the nine invariant colour words, which is why the shape's own
        // colour does not move with them. `bd` and the border inside `sh` read
        // alike for a different reason: both take «કિનારી»'s feminine gender,
        // and neither position reaches an oblique a feminine -ી would spell
        // differently, so the catalog selects on `$gender` alone. `fd` names
        // «ભરણી», feminine like the `fill` gender its colour arrives with, so
        // the colour has a noun to agree with; «ટપકાં» beside it is neuter.
        expect(values.stn).eq("જાડી તૂટક લાલ રેખા");
        expect(values.pt).eq("લીલો ચોરસ");
        expect(values.sh).eq(
            "ભરેલું વાદળી વર્તુળ ટપકાં સાથે અને જાડી તૂટક લાલ કિનારી સાથે",
        );
        expect(values.bd).eq("જાડી તૂટક લાલ");
        expect(values.fd).eq("ટપકાં વાળી વાદળી ભરણી");
    });

    it("puts a Punjabi background in the oblique and its border in neither", async () => {
        // Punjabi's two marked positions fall the opposite way round from
        // Hindi's: «ਕਿਨਾਰੀ» is feminine and spells its -ੀ alike in both
        // positions, while «ਪਿਛੋਕੜ» is masculine and sends the colour in front
        // of ਉੱਤੇ to the oblique -ੇ. Both are read off the same document, so
        // the one catalog is asserted resolving `border-clause` to the default
        // branch and `background-clause` to the branch it writes out.
        const doenetML = `
        <setup>
          <styleDefinition styleNumber="1" lineColor="black" lineWidth="6"
            fillColor="blue" textColor="red" backgroundColor="yellow" />
        </setup>
        <graph><circle name="c" filled /></graph>
        <text name="t" styleNumber="1">ਸਤ ਸ੍ਰੀ ਅਕਾਲ</text>
        <text name="sh" extend="$c.styleDescriptionWithNoun" />
        <text name="bd" extend="$c.borderStyleDescription" />
        <text name="bg" extend="$t.backgroundColor" />
        <text name="tx" extend="$t.textStyleDescription" />
        `;
        expect(
            await descriptions(doenetML, ["sh", "bd", "bg", "tx"], "pa"),
        ).toEqual({
            sh: "ਭਰਿਆ ਨੀਲਾ ਚੱਕਰ ਮੋਟੀ ਕਾਲੀ ਕਿਨਾਰੀ ਨਾਲ",
            bd: "ਮੋਟੀ ਕਾਲੀ",
            bg: "ਪੀਲਾ",
            tx: "ਪੀਲੇ ਪਿਛੋਕੜ ਉੱਤੇ ਲਾਲ",
        });
    });

    it("carries a Swahili noun class through the worker path", async () => {
        const values = await descriptions(styled, names, "sw");
        // `$gender` carries a noun class rather than a gender in the Bantu
        // catalogs, and what this checks is that it survives the worker path —
        // `setLocaleData`, the document's locale, the `translator` dependency
        // — not the agreement itself, which `@doenet/utils`' "Swahili noun
        // classes" suite pins across all four classes the catalog names.
        //
        // This document reaches two of them: «mstari», «mraba» and «mpaka» are
        // all class 3, so the adjectives on them share the m- prefix, and the
        // class-5 «duara» shows only on «lililojazwa».
        expect(values.st).eq("mnene mwekundu kwa vipande");
        expect(values.stn).eq("mstari mnene mwekundu kwa vipande");
        expect(values.pt).eq("mraba kijani");
        expect(values.sh).eq(
            "duara lililojazwa buluu na vitone na mpaka mnene mwekundu kwa vipande",
        );
        // The border's words agree with «mpaka», not with the «duara» they
        // surround, which is why `bd` and the clause inside `sh` read alike:
        // Swahili agrees for class and not for the position a phrase lands in.
        expect(values.bd).eq("mnene mwekundu kwa vipande");
        expect(values.fd).eq("vitone buluu");
    });

    it("inflects Estonian for position with no gender to agree with", async () => {
        const values = await descriptions(styled, names, "et");
        // Estonian marks the clause with an ending on the noun rather than
        // with a preposition, so nothing stands in front of the colour in
        // `sh`: «äärisega» is the comitative of «ääris» and carries the "with"
        // itself. Why the catalog is shaped that way is in its own header and
        // in `@doenet/utils`' suite; what this checks is that the locale
        // reaches the definitions.
        expect(values.st).eq("paks katkendlik punane");
        expect(values.stn).eq("paks katkendlik punane sirge");
        expect(values.pt).eq("roheline ruut");
        expect(values.sh).eq(
            "täidetud sinine ringjoon punktidega ja paksu katkendliku punase äärisega",
        );
        // Standing alone the border's words are nominative; inside the clause
        // above they are genitive, which is the whole distinction `$role`
        // carries for a language with nothing else to agree for.
        expect(values.bd).eq("paks katkendlik punane");
        expect(values.fd).eq("sinine täide punktidega");
    });

    it("inflects Georgian in the one position that takes a case", async () => {
        const values = await descriptions(styled, names, "ka");
        // Georgian has seven cases and no gender, and an attributive adjective
        // drops its -ი in the dative and nowhere else. Only the background is a
        // dative here — «ფონზე» is dative plus the postposition -ზე — so the
        // catalog writes out one `$role` branch and the border, which sits in
        // an instrumental, reads the same in both of its positions. The case
        // below is the one that shows the fork.
        expect(values.st).eq("სქელი წყვეტილი წითელი");
        expect(values.stn).eq("სქელი წყვეტილი წითელი წრფე");
        expect(values.pt).eq("მწვანე კვადრატი");
        expect(values.sh).eq(
            "ლურჯი შევსებული წრეწირი წერტილებით და სქელი წყვეტილი წითელი ჩარჩოთი",
        );
        expect(values.bd).eq("სქელი წყვეტილი წითელი");
        expect(values.fd).eq("ლურჯი შევსება წერტილებით");
    });

    it("truncates a Georgian background and leaves the text colour alone", async () => {
        // The `$role` fork through the whole worker path: «ყვითელი» standing
        // alone loses its -ი to «ყვითელ» in front of -ზე, while the text colour
        // beside it stays nominative. The fixture above cannot show this — no
        // position in it is a dative — which is why this reads the two colours
        // off a text instead.
        const doenetML = `
        <setup>
          <styleDefinition styleNumber="1" textColor="red" backgroundColor="yellow" />
        </setup>
        <text name="t" styleNumber="1">გამარჯობა</text>
        <text name="c" extend="$t.textColor" />
        <text name="b" extend="$t.backgroundColor" />
        <text name="d" extend="$t.textStyleDescription" />
        `;
        expect(await descriptions(doenetML, ["c", "b", "d"], "ka")).toEqual({
            c: "წითელი",
            b: "ყვითელი",
            d: "ყვითელ ფონზე წითელი",
        });
    });

    it("mutates Irish adjectives after the noun they follow", async () => {
        const values = await descriptions(styled, names, "ga");
        // The Celtic fork through the whole worker path: adjectives come after
        // their noun, and a feminine noun softens the first consonant of each.
        // «líne» is feminine, so its words are lenited whether or not the noun
        // is printed beside them — `st` carries the line's own gender exactly
        // as `stn` does. «ciorcal» is masculine and leaves «gorm» alone, and
        // the border is feminine «imlíne» whatever it surrounds, so its
        // adjectives lenite there too. The h- «le» prefixes to that vowel is
        // absent in the `agus` branch, which is the one this fixture reaches.
        expect(values.st).eq("thiubh bhriste dhearg");
        expect(values.stn).eq("líne thiubh bhriste dhearg");
        expect(values.pt).eq("cearnóg ghlas");
        expect(values.sh).eq(
            "ciorcal gorm líonta le poncanna agus imlíne thiubh bhriste dhearg",
        );
        expect(values.bd).eq("thiubh bhriste dhearg");
        expect(values.fd).eq("líonadh gorm le poncanna");
    });

    it("joins a Cebuano noun to its adjectives with the linker", async () => {
        const values = await descriptions(styled, names, "ceb");
        // Cebuano has no gender, no case and no article, and what shapes every
        // description instead is the linker «nga»: it joins the noun to its
        // adjectives and the adjectives to each other, so a description with
        // three of them carries three linkers. Reported on its own, `st` is the
        // adjectives with the linkers between them and no noun in front, which
        // is what shows the linker is the catalog's own word rather than
        // something the noun brings with it.
        expect(values.st).eq("baga nga putol-putol nga pula");
        expect(values.stn).eq("linya nga baga nga putol-putol nga pula");
        expect(values.pt).eq("kwadrado nga lunhaw");
        expect(values.sh).eq(
            "sirkulo nga puno nga asul uban ang mga tuldok ug utlanan nga baga nga putol-putol nga pula",
        );
        expect(values.bd).eq("baga nga putol-putol nga pula");
        expect(values.fd).eq("mga tuldok nga asul");
    });

    it("agrees each Luganda word with its own noun's class", async () => {
        const values = await descriptions(styled, names, "lg");
        // Luganda carries six noun classes, and this fixture reaches three of
        // them: «olunyiriri» a line is class 11, «ekyenkanyi» a square is class
        // 7 and «enkulungo» a circle is class 9. The same adjective stems come
        // out «olunene»/«olumyufu» on the line and «enjjuvu» on the circle,
        // which is what would break if `noun-gender` were flattened to one
        // answer.
        //
        // «olukugiro», the border, is class 11 like the line, so `bd` and `st`
        // agree here — the two are the same string for a reason rather than by
        // accident, and the circle standing beside them in `sh` is what shows
        // the border is not taking the shape's class.
        //
        // Only the three colours with a native adjective stem inflect; the
        // rest are invariable nouns («bbululu», «kiragala») and stay put in
        // every position, which is why the square shows its class in its own
        // prefix and nowhere else.
        expect(values.st).eq("olunene olumyufu olw'obutundutundu");
        expect(values.stn).eq("olunyiriri olunene olumyufu olw'obutundutundu");
        expect(values.pt).eq("ekyenkanyi kiragala");
        expect(values.sh).eq(
            "enkulungo enjjuvu bbululu n'obutonnyeze n'olukugiro olunene olumyufu olw'obutundutundu",
        );
        expect(values.bd).eq("olunene olumyufu olw'obutundutundu");
        expect(values.fd).eq("obutonnyeze bbululu");
    });

    it("inverts the order and splits the noun in Occitan", async () => {
        const values = await descriptions(styled, names, "oc");
        // Occitan's adjectives follow the noun, so `stn`, `pt` and `sh` come
        // out the other way round from English. «bordadura» is feminine and
        // «carrat» masculine, which is why the same three stroke words are
        // «espessa discontinua roja» on the border and «verd» agrees the other
        // way on the marker.
        //
        // `fd` is the head-noun case: the pattern words are what follows «amb»
        // in the shape, so standing alone they need «emplenatge» to hang off,
        // and the colour agrees with that rather than with the circle.
        expect(values.st).eq("espessa discontinua roja");
        expect(values.stn).eq("linha espessa discontinua roja");
        expect(values.pt).eq("carrat verd");
        expect(values.sh).eq(
            "cercle emplenat blau amb punts e una bordadura espessa discontinua roja",
        );
        expect(values.bd).eq("espessa discontinua roja");
        expect(values.fd).eq("emplenatge blau amb punts");
    });

    it("carries Ojibwe animacy through the worker path", async () => {
        const values = await descriptions(styled, names, "oj");
        // The third thing `$gender` has been asked to carry, after a gender and
        // a Bantu noun class: Ojibwe's is animate against inanimate, and the
        // words describing a thing are verbs agreeing with it. The agreement
        // itself is pinned across four nouns by `@doenet/utils`' "Ojibwe
        // animacy" suite; what this checks is that the token survives
        // `setLocaleData`, the document's locale and the `translator`
        // dependency.
        //
        // This document reaches both values. «jiigaatig» (line),
        // «niiyoowiikwaan» (square) and «jiigaatigwaan» (border) are inanimate,
        // so their verbs end in -aa; «waawiyeyaa» (circle) is animate, and shows
        // as «mooshkinezi» and «ozhaawashko-gizhigizi» in `sh`.
        expect(values.st).eq("gipagaa bakwezhigaa miskwaa");
        expect(values.stn).eq("gipagaa bakwezhigaa miskwaa jiigaatig");
        expect(values.pt).eq("ozhaawashkwaa niiyoowiikwaan");
        // Two animacies in one sentence, and two connectives: «gaye» joins the
        // fill pattern and «miinawaa» the border clause behind it, because a
        // second «gaye» would read as one list of two rather than as two
        // clauses.
        expect(values.sh).eq(
            "mooshkinezi ozhaawashko-gizhigizi waawiyeyaa, gaye agwaawaadeg miinawaa gipagaa bakwezhigaa miskwaa jiigaatigwaan",
        );
        // The border's verbs agree with «jiigaatigwaan», not with the circle
        // they surround, which is why `bd` and the clause inside `sh` read
        // alike: Ojibwe agrees for animacy and not for the position a phrase
        // lands in.
        expect(values.bd).eq("gipagaa bakwezhigaa miskwaa");
        expect(values.fd).eq("ozhaawashko-gizhigaa agwaawaadeg");
    });

    it("puts Haitian Creole's adjectives after the noun with nothing to agree", async () => {
        const values = await descriptions(styled, names, "ht");
        // The other end of the range from Ojibwe, and the reason both are here:
        // Creole inflects nothing at all — no gender, no case, no agreement — so
        // every word below is cited once and the whole of the work is ordering.
        // The adjectives follow the noun, which is the opposite of English, and
        // that is the only thing separating `stn` from `st`.
        expect(values.st).eq("epè an tirè wouj");
        expect(values.stn).eq("liy epè an tirè wouj");
        expect(values.pt).eq("kare vèt");
        expect(values.sh).eq(
            "sèk ranpli ble ak pwen epi yon bòdi epè an tirè wouj",
        );
        expect(values.bd).eq("epè an tirè wouj");
        expect(values.fd).eq("pwen ble");
    });

    it("carries Ilocano's linker through the worker path", async () => {
        const values = await descriptions(styled, names, "ilo");
        // The Austronesian batch's prenominal end, and the language whose
        // ligature is the batch's one unresolved constraint. Ilocano joins an
        // adjective to what it describes with «a» before a consonant and «nga»
        // before a vowel — a shape the *following* word decides — so a ligature
        // in front of a placeable cannot be chosen, and `locales/ilo` writes
        // «a», which is right for every word its own tables supply but one.
        expect(values.st).eq("napuskol a naguris-guris a nalabaga");
        expect(values.stn).eq("napuskol a naguris-guris a nalabaga a linia");
        expect(values.pt).eq("berde a kuadrado");
        // That one word is «asul», and this is it: the shape's colour is
        // vowel-initial, so «napunno a asul» is where the rule the catalog's
        // header records comes out wrong. It is pinned rather than hidden,
        // because the fix is a change to how `$part` or a new argument reaches
        // the ligature rather than a change to this string.
        expect(values.sh).eq(
            "napunno a asul a sirkulo nga addaan iti tuldek ken napuskol a naguris-guris a nalabaga nga igid",
        );
        // «igid» is vowel-initial too, and there the ligature is «nga» and
        // fixed, because the catalog writes both words around it.
        expect(values.bd).eq("napuskol a naguris-guris a nalabaga");
        expect(values.fd).eq("asul a tuldek");
    });

    it("puts Tongan's adjectives after the noun", async () => {
        const values = await descriptions(styled, names, "to");
        // The other end of the batch's range: the adjectives follow the noun,
        // nothing agrees with anything, and there is no ligature at all. What
        // this checks past the word order is that the fakauʻa «ʻ» — U+02BB, a
        // letter of the Tongan alphabet rather than an apostrophe — survives
        // `setLocaleData` and the `translator` dependency unchanged.
        expect(values.st).eq("matolu motumotu kulokula");
        expect(values.stn).eq("laine matolu motumotu kulokula");
        expect(values.pt).eq("sikuea lanumata");
        expect(values.sh).eq(
            "fuopotopoto fonu lanumoana mo e tongi pea mo e kapa matolu motumotu kulokula",
        );
        // «mo e» opens the first clause and «pea mo e» the second, which is the
        // distinction English draws with "with" against "and" and the only work
        // `style-border-clause` does in a language with no article.
        expect(values.bd).eq("matolu motumotu kulokula");
        expect(values.fd).eq("tongi lanumoana");
    });

    it("carries Klingon's relative clause through the worker path", async () => {
        const values = await descriptions(styled, names, "tlh");
        // The roster's first constructed language, and the one catalog whose
        // description is a relative clause rather than a string of adjectives:
        // Klingon has no adjectives, and only one verb of quality may follow a
        // noun, so `locales/tlh` welds «-bogh» onto each verb, joins them with
        // «'ej», and puts the whole clause in front of the noun.
        expect(values.st).eq("tInbogh 'ej pe'lu'bogh 'ej Doqbogh");
        expect(values.stn).eq("tInbogh 'ej pe'lu'bogh 'ej Doqbogh tlhegh");
        // Two things this string pins at once. Canon «SuD» is green, blue and
        // yellow at once, and the catalog files cyan under it too — four of the
        // twelve colour keys collapsing onto one of Klingon's four basic
        // terms — and «square» is one of the thirteen nouns the catalog leaves
        // to English, because a word for it would be an invented root rather
        // than a compound of canon words.
        expect(values.pt).eq("SuDbogh square");
        expect(values.sh).eq(
            "buy'bogh 'ej SuDbogh 'ej nagHommey ngaSbogh circle tInbogh 'ej pe'lu'bogh 'ej Doqbogh HeH je",
        );
        expect(values.bd).eq("tInbogh 'ej pe'lu'bogh 'ej Doqbogh");
        expect(values.fd).eq("SuDbogh nagHommey");
    });

    it("falls back to English for a locale with no catalog", async () => {
        // `qaa` is in the ISO 639-3 private-use range, so it can never gain a
        // catalog and this stays a test of the fallback rather than of which
        // languages happen to be translated today.
        const values = await descriptions(styled, names, "qaa");
        expect(values.stn).eq("thick dashed red line");
    });

    it("lets an authored lang override the host's locale", async () => {
        const values = await descriptions(
            `<document lang="es">${styled}</document>`,
            names,
            "fr",
        );
        expect(values.stn).eq("línea discontinua gruesa roja");
    });

    it("names a regular polygon by its side count", async () => {
        const doenetML = `
        <setup><styleDefinition styleNumber="1" lineColor="red" lineWidth="6" /></setup>
        <graph><regularPolygon name="r" numSides="5" /></graph>
        <text name="stn" extend="$r.styleDescriptionWithNoun" />
        `;
        expect((await descriptions(doenetML, ["stn"])).stn).eq(
            "thick red 5-sided regular polygon",
        );
        // The noun splits so the adjectives stay beside the word they agree
        // with, rather than trailing after "lados".
        expect((await descriptions(doenetML, ["stn"], "es")).stn).eq(
            "polígono regular grueso rojo de 5 lados",
        );
    });

    it("describes a text's color and background", async () => {
        const doenetML = `
        <setup>
          <styleDefinition styleNumber="1" textColor="black" backgroundColor="yellow" />
        </setup>
        <text name="t" styleNumber="1">hola</text>
        <text name="d" extend="$t.textStyleDescription" />
        `;
        expect((await descriptions(doenetML, ["d"])).d).eq(
            "black with a yellow background",
        );
        expect((await descriptions(doenetML, ["d"], "es")).d).eq(
            "negro con un fondo amarillo",
        );
    });

    it("inflects a text description for the position each word lands in", async () => {
        // `textColor` and `backgroundColor` report their word standing alone;
        // `textStyleDescription` puts the same two words in a sentence, where
        // German wants the colour predicative and the background dative behind
        // `auf`. English and Spanish cannot tell the two apart, so this is what
        // holds the `text-clause` and `background-clause` arguments the shared
        // definitions pass (#1606) — dropping either leaves every expectation
        // above green.
        const doenetML = `
        <setup>
          <styleDefinition styleNumber="1" textColor="red" backgroundColor="yellow" />
        </setup>
        <text name="t" styleNumber="1">hallo</text>
        <text name="c" extend="$t.textColor" />
        <text name="b" extend="$t.backgroundColor" />
        <text name="d" extend="$t.textStyleDescription" />
        `;
        expect(await descriptions(doenetML, ["c", "b", "d"], "de")).toEqual({
            c: "roter",
            b: "gelber",
            d: "rot auf gelbem Hintergrund",
        });
    });
});
