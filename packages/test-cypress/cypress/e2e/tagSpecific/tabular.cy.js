/*
 * A tabular cell's side padding shrinks with the width of the columns it
 * covers — 15% of the cell's width, at most 10px and at least 1px — so that a
 * table with many narrow columns keeps its content between the rules. See
 * `utils/tabularCellPadding.ts` in `@doenet/doenetml`.
 */

/** A cell's width, its computed side padding, and where its text sits in it. */
function measureCell(td) {
    const cellRect = td.getBoundingClientRect();
    const range = td.ownerDocument.createRange();
    range.selectNodeContents(td);
    const textRect = range.getBoundingClientRect();
    const style = getComputedStyle(td);
    return {
        width: cellRect.width,
        paddingStart: parseFloat(style.paddingLeft),
        paddingEnd: parseFloat(style.paddingRight),
        gapStart: textRect.left - cellRect.left,
        gapEnd: cellRect.right - textRect.right,
    };
}

function ballotsTabular() {
    const rows = [
        "DACBADABCADACADCABACBDACDABCCADCBADBC",
        "BDBCDBDDBDBDBDBBDCDBDBDBBDCBBDBBDDBCB",
    ];
    const cols =
        `<col width="5%" endBorder="minor" />` +
        `<col endBorder="minor" />`.repeat(37);
    const body = rows
        .map(
            (row, i) =>
                `<row><cell halign="start">${i + 1}st</cell>${[...row]
                    .map((letter) => `<cell>${letter}</cell>`)
                    .join("")}</row>`,
        )
        .join("\n");
    return `<tabular name="ballots" halign="center">${cols}\n${body}</tabular>`;
}

describe("Tabular Tag Tests", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.viewport(1000, 800);
        cy.visit("/");
    });

    it("narrow columns shrink the padding and keep centered content between the rules", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
${ballotsTabular()}
<tabular name="ordinary">
  <row><cell>Ordinary</cell><cell>table</cell></row>
  <row><cell colSpan="2">spanning</cell></row>
</tabular>
`,
                },
                "*",
            );
        });

        cy.get("#ballots td").should("have.length", 76);

        // A letter cell: its padding follows its width, and the letter sits
        // centered inside the cell rather than spilling past its end rule.
        cy.get("#ballots tr")
            .first()
            .find("td")
            .eq(1)
            .should(($td) => {
                const cell = measureCell($td[0]);
                expect(cell.width).lessThan(40);
                expect(cell.paddingStart).closeTo(0.15 * cell.width, 0.5);
                expect(cell.paddingEnd).closeTo(cell.paddingStart, 0.01);
                expect(cell.gapStart).greaterThan(0);
                expect(cell.gapEnd).greaterThan(0);
                expect(cell.gapStart).closeTo(cell.gapEnd, 1);
            });

        // The `5%` label column is wider, and its start-aligned text still
        // fits.
        cy.get("#ballots tr")
            .first()
            .find("td")
            .first()
            .should(($td) => {
                const cell = measureCell($td[0]);
                expect(cell.paddingStart).closeTo(0.15 * cell.width, 0.5);
                expect(cell.gapEnd).greaterThan(0);
            });

        // Columns of an ordinary width keep the full padding, spanning cells
        // included.
        cy.get("#ordinary td").each(($td) => {
            const cell = measureCell($td[0]);
            expect(cell.paddingStart).eq(10);
            expect(cell.paddingEnd).eq(10);
        });
    });

    it("the padding of narrow columns follows the table's width as it changes", () => {
        cy.window().then(async (win) => {
            win.postMessage({ doenetML: ballotsTabular() }, "*");
        });

        cy.get("#ballots td").should("have.length", 76);

        cy.get("#ballots tr")
            .first()
            .find("td")
            .eq(1)
            .then(($td) => {
                const wide = measureCell($td[0]);

                cy.viewport(600, 800);

                cy.get("#ballots tr")
                    .first()
                    .find("td")
                    .eq(1)
                    .should(($narrowTd) => {
                        const narrow = measureCell($narrowTd[0]);
                        expect(narrow.width).lessThan(wide.width - 5);
                        expect(narrow.paddingStart).closeTo(
                            0.15 * narrow.width,
                            0.5,
                        );
                        expect(narrow.paddingStart).lessThan(wide.paddingStart);
                    });
            });
    });

    it("a cell spanning narrow columns gets the padding of their combined width", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<tabular name="t" width="200px">
  <col width="20px" /><col width="20px" /><col width="20px" /><col />
  <row><cell>a</cell><cell colSpan="3">spans three</cell></row>
</tabular>
`,
                },
                "*",
            );
        });

        cy.get("#t td").should("have.length", 2);

        cy.get("#t td")
            .first()
            .should(($td) => {
                expect(measureCell($td[0]).paddingStart).closeTo(3, 0.5);
            });

        // 20px + 20px + 140px = 180px, and 15% of that is over the 10px cap.
        cy.get("#t td")
            .eq(1)
            .should(($td) => {
                expect(measureCell($td[0]).paddingStart).eq(10);
            });
    });
});
