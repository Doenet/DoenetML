import { cesc, cesc2 } from "@doenet/utils";

describe("DoenetML tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("doenetML with external copies", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <section name="s1">
      <section boxed>
        <title>Copy in external</title>
        <copy uri="doenet:cid=bafkreiatr7qxnkb5lnjd7bccsiravqyy7xnpynyskilyg2etb3hva7oe74" name="external" />
      </section>
      
      <p>Grab the DoenetML from external pre:</p>
      <pre>$(external/_pre1.doenetML)</pre>

      <p>Grab the DoenetML from external p from external:</p>
      <pre>$(external/external/p.doenetML)</pre>
    </section>


    $s1{name="s2" newNamespace}

    <section copySource="s1" name="s3" newNamespace />

    $s1{name="s4" newNamespace link="false"}

    <section copySource="s1" name="s5" link="false" newNamespace />
  `,
                },
                "*",
            );
        });

        let theGraphDoenetML = `<graph>
  <point name="P" />
</graph>`;

        cy.log("check original");

        cy.get(cesc2("#/external/external/_pre1")).should(
            "have.text",
            theGraphDoenetML,
        );
        cy.get(cesc2("#/external/external/_pre2")).should(
            "have.text",
            `<p name="p">The <alert>DoenetML</alert> of a graph:</p>`,
        );

        cy.get(cesc2("#/external/_pre1")).should(
            "have.text",
            '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
        );
        cy.get(cesc2("#/external/_pre2")).should(
            "have.text",
            `<text>hi</text>`,
        );

        cy.get(cesc2("#/_pre1")).should(
            "have.text",
            `<pre>$(external/p.doenetML)</pre>`,
        );
        cy.get(cesc2("#/_pre2")).should(
            "have.text",
            '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
        );

        cy.log("check s2");

        cy.get(cesc2("#/s2/external/external/_pre1")).should(
            "have.text",
            theGraphDoenetML,
        );
        cy.get(cesc2("#/s2/external/external/_pre2")).should(
            "have.text",
            `<p name="p">The <alert>DoenetML</alert> of a graph:</p>`,
        );

        cy.get(cesc2("#/s2/external/_pre1")).should(
            "have.text",
            '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
        );
        cy.get(cesc2("#/s2/external/_pre2")).should(
            "have.text",
            `<text>hi</text>`,
        );

        cy.get(cesc2("#/s2/_pre1")).should(
            "have.text",
            `<pre>$(external/p.doenetML)</pre>`,
        );
        cy.get(cesc2("#/s2/_pre2")).should(
            "have.text",
            `<p name="p">The <alert>DoenetML</alert> of a graph:</p>`,
        );

        cy.log("check s3");

        cy.get(cesc2("#/s3/external/external/_pre1")).should(
            "have.text",
            theGraphDoenetML,
        );
        cy.get(cesc2("#/s3/external/external/_pre2")).should(
            "have.text",
            `<p name="p">The <alert>DoenetML</alert> of a graph:</p>`,
        );

        cy.get(cesc2("#/s3/external/_pre1")).should(
            "have.text",
            '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
        );
        cy.get(cesc2("#/s3/external/_pre2")).should(
            "have.text",
            `<text>hi</text>`,
        );

        cy.get(cesc2("#/s3/_pre1")).should(
            "have.text",
            `<pre>$(external/p.doenetML)</pre>`,
        );
        cy.get(cesc2("#/s3/_pre2")).should(
            "have.text",
            '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
        );

        cy.log("check s4");

        cy.get(cesc2("#/s4/external/external/_pre1")).should(
            "have.text",
            theGraphDoenetML,
        );
        cy.get(cesc2("#/s4/external/external/_pre2")).should(
            "have.text",
            `<p name="p">The <alert>DoenetML</alert> of a graph:</p>`,
        );

        cy.get(cesc2("#/s4/external/_pre1")).should(
            "have.text",
            '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
        );
        cy.get(cesc2("#/s4/external/_pre2")).should(
            "have.text",
            `<text>hi</text>`,
        );

        cy.get(cesc2("#/s4/_pre1")).should(
            "have.text",
            `<pre>$(external/p.doenetML)</pre>`,
        );
        cy.get(cesc2("#/s4/_pre2")).should(
            "have.text",
            '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
        );

        cy.log("check s5");

        cy.get(cesc2("#/s5/external/external/_pre1")).should(
            "have.text",
            theGraphDoenetML,
        );
        cy.get(cesc2("#/s5/external/external/_pre2")).should(
            "have.text",
            `<p name="p">The <alert>DoenetML</alert> of a graph:</p>`,
        );

        cy.get(cesc2("#/s5/external/_pre1")).should(
            "have.text",
            '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
        );
        cy.get(cesc2("#/s5/external/_pre2")).should(
            "have.text",
            `<text>hi</text>`,
        );

        cy.get(cesc2("#/s5/_pre1")).should(
            "have.text",
            `<pre>$(external/p.doenetML)</pre>`,
        );
        cy.get(cesc2("#/s5/_pre2")).should(
            "have.text",
            '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
        );
    });
});
