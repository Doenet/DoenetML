import { cesc } from "@doenet/utils";

describe("link Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("link to sections", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <section name="section1">
      <title>Section 1</title>
      <p>Paragraph one</p>
      <p>Paragraph two</p>
      <p>Paragraph three</p>
      <p>Paragraph four</p>
      <p>Paragraph five</p>
      <p>Paragraph six</p>
      <p>Paragraph seven</p>
      <p>Paragraph eight</p>
      <p>Goto:
      <link name="toTwo" to="$section2">Section 2</link>,
      <link name="toThree" to="$section3">Section 3</link>
      <link name="toFour" to="$section4">Section 4</link>
      <link name="toThreeii" to="$section3.p2">Second paragraph of Section 3</link>
      </p>

    </section>

    <section name="section2">
      <title>Section 2</title>
      <p>Paragraph a</p>
      <p name="p2">Paragraph b</p>
      <p>Paragraph c</p>
      <p>Paragraph d</p>
      <p name="p5">Paragraph e</p>
      <p>Paragraph f</p>
      <p>Paragraph g</p>
      <p>Paragraph h</p>
      <p>Goto:
      <link name="toOne" to="$section1">Section 1</link>,
      <link name="toThree" to="$section3">Section 3</link>
      <link name="toFour" to="$section4">Section 4</link>
      </p>
    </section>

    <section name="section3">
      <title>Section 3</title>
      <p>Paragraph i</p>
      <p name="p2">Paragraph ii</p>
      <p>Paragraph iii</p>
      <p>Paragraph iv</p>
      <p name="p5">Paragraph v</p>
      <p>Paragraph vi</p>
      <p>Paragraph vii</p>
      <p>Paragraph viii</p>
      <p>Goto:
      <link name="toOne" to="$section1">Section 1</link>
      <link name="toTwo" to="$section2">Section 2</link>,
      <link name="toFour" to="$section4">Section 4</link>
      </p>
    </section>

    <section name="section4">
      <title>Section 4</title>
      <p>Paragraph A</p>
      <p>Paragraph B</p>
      <p>Paragraph C</p>
      <p>Paragraph D</p>
      <p>Paragraph E</p>
      <p>Paragraph F</p>
      <p>Paragraph G</p>
      <p>Paragraph H</p>
      <p>Goto:
      <link to="$section1">Section 1</link>,
      <link name="toOne" to="$section1">Section 1</link>,
      <link name="toTwo" to="$section2">Section 2</link>,
      <link name="toThree" to="$section3">Section 3</link>
      <link name="toTwoe" to="$section2.p5">Fifth paragraph of Section 2</link>
      </p>
    </section>

    <section name="section5">
    <title>Section 5</title>
    <p>Paragraph I</p>
    <p>Paragraph II</p>
    <p>Paragraph III</p>
    <p>Paragraph IV</p>
    <p>Paragraph V</p>
    <p>Paragraph VI</p>
    <p>Paragraph VII</p>
    <p>Paragraph VII</p>
    <p>Goto:
    <link to="$section1">Section 1</link>,
    <link name="toOne" to="$section1">Section 1</link>,
    <link name="toTwo" to="$section2">Section 2</link>,
    <link name="toThree" to="$section3">Section 3</link>
    <link name="toTwoe" to="$section2.p5">Fifth paragraph of Section 2</link>
    </p>
  </section>

    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#section1_title")).should("include.text", "Section 1");

        cy.get(cesc("#section1.toFour")).click();
        cy.url().should("include", "#section4");

        cy.get(cesc("#section4.toOne")).click();
        cy.url().should("include", "#section1");

        cy.get(cesc("#toThreeii")).click();
        cy.url().should("include", "#section3.p2");

        cy.get(cesc("#section4.toTwoe")).click();
        cy.url().should("include", "#section2.p5");
    });

    it("simple url", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p name="p1">A link to <link name="link1" to="http://doenet.org">Doenet</link>.</p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#p1")).should("have.text", "A link to Doenet.");

        cy.get(cesc("#link1"))
            .should("have.text", "Doenet")
            .invoke("attr", "href")
            .then((href) => expect(href).eq("http://doenet.org"));
    });

    it("url with XML entity", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p name="p1">A link to <link name="link1" to="http://doenet.org/#a&amp;b">Doenet</link>.</p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#p1")).should("have.text", "A link to Doenet.");

        cy.get(cesc("#link1"))
            .should("have.text", "Doenet")
            .invoke("attr", "href")
            .then((href) => expect(href).eq("http://doenet.org/#a&b"));
    });

    it("link to doenet doc", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p name="p1">A link to <link name="link1" to="doenet:abcdefg">a Doenet doc</link>.</p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#p1")).should("have.text", "A link to a Doenet doc.");

        cy.get(cesc("#link1"))
            .should("have.text", "a Doenet doc")
            .invoke("attr", "href")
            .then((href) =>
                expect(href).eq("https://doenet.org/activityViewer/abcdefg"),
            );
    });

    it("url with no link text", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p name="p1">A link to <link name="link1" to="http://doenet.org"/>.</p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#p1")).should("have.text", "A link to http://doenet.org.");

        cy.get(cesc("#link1"))
            .should("have.text", "http://doenet.org")
            .invoke("attr", "href")
            .then((href) => expect(href).eq("http://doenet.org"));
    });

    it("referencing links", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p name="p1">A link to <link name="link1" to="http://doenet.org" />.</p>
  <p name="p2">Repeat url: <link extend="$link1" name="link2" />.</p>
  <p name="p3">The link address is: $link1.url.</p>
  <p name="p4">The text linked is: $link1.linkText.</p>

  <p name="p5">A link to <link name="link3" to="$p1">the first paragraph</link>.</p>
  <p name="p6">Repeat url: <link extend="$link3" name="link4" />.</p>
  <p name="p7">The link address is: $link3.url.</p>
  <p name="p8">The text linked is: $link3.linkText.</p>

  <p name="p9">A link to <link name="link5" to="doenet:abc">another doc</link>.</p>
  <p name="p10">Repeat url: <link extend="$link5" name="link6" />.</p>
  <p name="p11">The link address is: $link5.url.</p>
  <p name="p12">The text linked is: $link5.linkText.</p>

  `,
                },
                "*",
            );
        });

        cy.get(cesc("#p1")).should("have.text", "A link to http://doenet.org.");
        cy.get(cesc("#link1"))
            .should("have.text", "http://doenet.org")
            .invoke("attr", "href")
            .then((href) => expect(href).eq("http://doenet.org"));
        cy.get(cesc("#link2"))
            .should("have.text", "http://doenet.org")
            .invoke("attr", "href")
            .then((href) => expect(href).eq("http://doenet.org"));
        cy.get(cesc("#p3")).should(
            "have.text",
            "The link address is: http://doenet.org.",
        );
        cy.get(cesc("#p4")).should(
            "have.text",
            "The text linked is: http://doenet.org.",
        );

        cy.get(cesc("#p5")).should(
            "have.text",
            "A link to the first paragraph.",
        );
        cy.get(cesc("#link3"))
            .should("have.text", "the first paragraph")
            .invoke("attr", "href")
            .then((href) => expect(href).eq("#p1"));
        cy.get(cesc("#link4"))
            .should("have.text", "the first paragraph")
            .invoke("attr", "href")
            .then((href) => expect(href).eq("#p1"));
        cy.get(cesc("#p7")).should("have.text", "The link address is: #p1.");
        cy.get(cesc("#p8")).should(
            "have.text",
            "The text linked is: the first paragraph.",
        );

        cy.get(cesc("#p9")).should("have.text", "A link to another doc.");
        cy.get(cesc("#link5"))
            .should("have.text", "another doc")
            .invoke("attr", "href")
            .then((href) =>
                expect(href).eq("https://doenet.org/activityViewer/abc"),
            );
        cy.get(cesc("#link6"))
            .should("have.text", "another doc")
            .invoke("attr", "href")
            .then((href) =>
                expect(href).eq("https://doenet.org/activityViewer/abc"),
            );
        cy.get(cesc("#p11")).should(
            "have.text",
            "The link address is: doenet:abc.",
        );
        cy.get(cesc("#p12")).should(
            "have.text",
            "The text linked is: another doc.",
        );
    });

    it("create button", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p><link to="http://doenet.org" name="toDoenet" createButton>Go to Doenet</link>.</p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#toDoenet") + " button").should("contain", "Go to Doenet");
    });

    // Note: the next 5 test currently do not work as we have not fixed the navigate to target action

    it.skip("link opens aside", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>Goto:
    <link name="toAside" to="$aside">Aside</link>
    </p>
    <p>Paragraph one</p>
    <p>Paragraph two</p>
    <p>Paragraph three</p>
    <p>Paragraph four</p>
    <p>Paragraph five</p>
    <p>Paragraph six</p>
    <p>Paragraph seven</p>
    <p>Paragraph eight</p>

    <aside name="aside">
      <title name="asideTitle">The aside</title>
      <p name="inside">Inside the aside</p>
    </aside>

    <p>Paragraph a</p>
    <p>Paragraph b</p>
    <p>Paragraph c</p>
    <p>Paragraph d</p>
    <p>Paragraph e</p>
    <p>Paragraph f</p>
    <p>Paragraph g</p>
    <p>Paragraph h</p>
    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#asideTitle")).should("have.text", "The aside");

        cy.log("Aside closed at the beginning");
        cy.get(cesc("#inside")).should("not.exist");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("e")].stateValues.open,
            ).eq(false);
        });

        cy.log("clicking link opens aside");
        cy.get(cesc("#toAside")).click();

        cy.get(cesc("#inside")).should("have.text", "Inside the aside");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("e")].stateValues.open,
            ).eq(true);
        });
    });

    it.skip("link into descendant of aside opens aside", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>Goto:
    <link name="toAside" to="$inside">Paragraph inside aside</link>
    </p>
    <lorem generateParagraphs="10" />

    <aside name="aside">
      <title name="asideTitle">The aside</title>
      <lorem generateParagraphs="1" />
      <section>
        <title>Section inside the aside</title>
        <p name="inside">Paragraph inside the section inside the aside.</p>
      </section>
    </aside>

    <lorem generateParagraphs="10" />

    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#asideTitle")).should("have.text", "The aside");

        cy.log("Aside closed at the beginning");
        cy.get(cesc("#inside")).should("not.exist");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("e")].stateValues.open,
            ).eq(false);
        });

        cy.log("clicking link opens aside");
        cy.get(cesc("#toAside")).click();

        cy.get(cesc("#inside")).should(
            "have.text",
            "Paragraph inside the section inside the aside.",
        );

        cy.get(cesc("#inside")).then((el) => {
            let rect = el[0].getBoundingClientRect();
            expect(rect.top).gt(-1).lt(1);
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("e")].stateValues.open,
            ).eq(true);
        });
    });

    it.skip("navigate to target action opens aside", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <link name="toAside" to="$aside" hide>Aside</link>
    <p>
    <callAction target="$toAside" actionName="navigateToTarget" name="go"><label>Go to aside</label></callAction>
    </p>
    <lorem generateParagraphs="2" />

    <aside name="aside">
      <title name="asideTitle">The aside</title>
      <p name="inside">Inside the aside</p>
    </aside>

    <lorem generateParagraphs="10" />

    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#asideTitle")).should("have.text", "The aside");

        cy.log("Aside closed at the beginning");
        cy.get(cesc("#inside")).should("not.exist");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("e")].stateValues.open,
            ).eq(false);
        });

        cy.log("clicking action opens aside");
        cy.get(cesc("#go")).click();

        cy.get(cesc("#inside")).should("have.text", "Inside the aside");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("e")].stateValues.open,
            ).eq(true);
        });
    });

    it.skip("navigate to target action to paragraph inside aside opens aside", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <link name="toAside" to="$inside" hide>Aside</link>
    <p>
    <callAction target="$toAside" actionName="navigateToTarget" name="go"><label>Go to aside</label></callAction>
    </p>
    <lorem generateParagraphs="2" />

    <aside name="aside">
      <title name="asideTitle">The aside</title>
      <lorem generateParagraphs="1" />
      <section>
        <title>Section inside the aside</title>
        <p name="inside">Paragraph inside the section inside the aside.</p>
      </section>
    </aside>

    <lorem generateParagraphs="10" />

    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#asideTitle")).should("have.text", "The aside");

        cy.log("Aside closed at the beginning");
        cy.get(cesc("#inside")).should("not.exist");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("e")].stateValues.open,
            ).eq(false);
        });

        cy.log("clicking action opens aside");
        cy.get(cesc("#go")).click();

        cy.get(cesc("#inside")).should(
            "have.text",
            "Paragraph inside the section inside the aside.",
        );

        cy.get(cesc("#inside")).then((el) => {
            cy.waitUntil(() => {
                let rect = el[0].getBoundingClientRect();
                return rect.top > -1 && rect.top < 1;
            });
        });
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("e")].stateValues.open,
            ).eq(true);
        });
    });

    it.skip("chain action to navigate to target", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <setup>
      <link to="$countAside" name="refCountAside" />
      <animateFromSequence target="$n" from="1" to="5" animationinterval="500" animationmode="increase once" name="count" />
    </setup>

    <callAction target="$refCountAside" actionName="navigateToTarget" name="startCount">
      <label>Start counting</label>
    </callAction>
    <callAction target="$count" actionName="startAnimation" triggerWith="startCount" />
    <link name="toAside" to="$aside" hide>Aside</link>
    <p>
    <callAction target="$toAside" actionName="navigateToTarget" name="go"><label>Go to aside</label></callAction>
    </p>

    <lorem generateParagraphs="1" />

    <aside name="countAside">
      <title name="asideTitle">Counting</title>
      Let's count: <number name="n">1</number>
    </aside>

    <lorem generateParagraphs="10" />

    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#asideTitle")).should("have.text", "Counting");

        cy.log("Aside closed at the beginning");
        cy.get(cesc("#n")).should("not.exist");

        cy.log("clicking action opens aside and starts counting");
        cy.get(cesc("#startCount")).click();

        cy.get(cesc("#n")).should("have.text", "1");
        cy.get(cesc("#n")).should("have.text", "2");
        cy.get(cesc("#n")).should("have.text", "3");
        cy.get(cesc("#n")).should("have.text", "4");
        cy.get(cesc("#n")).should("have.text", "5");
    });
});
