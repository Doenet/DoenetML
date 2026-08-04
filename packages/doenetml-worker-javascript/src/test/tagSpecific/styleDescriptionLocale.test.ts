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
        expect(values.st).eq("dhearg thiubh bhriste");
        expect(values.stn).eq("líne dhearg thiubh bhriste");
        expect(values.pt).eq("cearnóg ghlas");
        expect(values.sh).eq(
            "ciorcal gorm líonta le poncanna agus imlíne dhearg thiubh bhriste",
        );
        expect(values.bd).eq("dhearg thiubh bhriste");
        expect(values.fd).eq("líonadh gorm le poncanna");
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
