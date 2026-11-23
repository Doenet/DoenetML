//! `<sort>` and `<shuffle>`: their operands in increasing order, or in an
//! order drawn at load (`sort.test.ts`, `shuffle.test.ts`). What the
//! entries show as text is checked in `tests/text_in_tick.rs`.

use crate::spec;

spec! {
    sort;

    case "numbers in increasing order" {
        doenet r#"<sort name="s" type="number">101 542 817 527 51 234 801</sort>"#;
        expect {
            "s.values" = [51, 101, 234, 527, 542, 801, 817],
            "s.numComponents" = 7, "s.value1" = 51,
        }
    }

    case "an operand from an input moves in the order" {
        doenet r#"<numberInput name="a" value="4"><label>a</label></numberInput>
                  <sort name="s">5 3 $a 1</sort>
                  <number name="first">$s[1]</number>"#;
        expect { "s.values" = [1, 3, 4, 5], "first.value" = 1, "s.componentOrder" = [4, 2, 3, 1] }
        request { "a.value" = 0 }
        expect { "s.values" = [0, 1, 3, 5], "first.value" = 0, "s.componentOrder" = [3, 4, 2, 1] }
    }

    case "a write to a sorted entry is dropped: it would move the entry" {
        doenet r#"<sort name="s">5 3 1</sort>
                  <mathInput name="n" bindValueTo="$s[1]"><label>n</label></mathInput>"#;
        expect { "s.values" = [1, 3, 5] }
        request { "n.value" = 7 }
        dropped(1)
        expect { "s.values" = [1, 3, 5] }
        diagnostics["cells-request-meets-no-inverse"]
    }

    case "a write to a shuffled entry lands on the operand it shows" {
        doenet r#"<shuffle name="s">5 3 1</shuffle>
                  <sort name="back">$s[1] $s[2] $s[3]</sort>
                  <mathInput name="n" bindValueTo="$s[1]"><label>n</label></mathInput>"#;
        expect { "back.values" = [1, 3, 5] }
        request { "n.value" = 7 }
        expect { "back.values" = [1, 3, 7] }
    }

    case "a shuffle holds every operand once, in the order the seed drew" {
        doenet r#"<shuffle name="s">1 2 3 4 5</shuffle>
                  <sort name="back">$s[1] $s[2] $s[3] $s[4] $s[5]</sort>"#;
        expect {
            "s.values" = [1, 3, 2, 4, 5], "s.numComponents" = 5,
            "s.componentOrder" = [1, 3, 2, 4, 5],
            "back.values" = [1, 2, 3, 4, 5],
        }
    }

    case "a shuffled value follows its operand, in the place drawn" {
        doenet r#"<numberInput name="a" value="7"><label>a</label></numberInput>
                  <shuffle name="s">$a 8 9</shuffle>
                  <sort name="back">$s[1] $s[2] $s[3]</sort>"#;
        expect { "back.values" = [7, 8, 9] }
        request { "a.value" = 10 }
        expect { "back.values" = [8, 9, 10] }
    }

    case "an invalid type is reported and dropped" {
        doenet r#"<sort name="s" type="bad">3 1 2</sort>"#;
        expect { "s.values" = [1, 2, 3] }
        diagnostics["cells-invalid-type"]
    }

    // A sorted point is read-only: the operand it shows decides its place,
    // so a drag of its row is dropped, which the load notes for each
    // coordinate of each row (`cells-request-meets-no-inverse`, an info).
    case "points sort by their first coordinate, each entry a point" {
        doenet r#"<graph><point name="A">(0,1)</point><point name="B">(-2,1)</point>
                  <point name="C">(7,1)</point></graph>
                  <sort name="s">$A$B$C</sort>"#;
        expect {
            "s.values" = [-2, 1, 0, 1, 7, 1], "s.numComponents" = 3,
            "s.math2" = (0, 1), "s.componentOrder" = [2, 1, 3],
            "s[1].x" = -2, "s[3].y" = 1,
        }
        request { "A.coords" = (9, 5) }
        expect { "s.values" = [-2, 1, 7, 1, 9, 5], "s.componentOrder" = [2, 3, 1] }
        diagnostics[
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
        ]
    }

    case "points sort by the coordinate sortByComponent names" {
        doenet r#"<graph><point name="A">(0,5)</point><point name="B">(-2,6)</point>
                  <point name="C">(7,-3)</point></graph>
                  <sort name="s" sortByComponent="2">$A $B $C</sort>"#;
        expect { "s.values" = [7, -3, 0, 5, -2, 6] }
        diagnostics[
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
        ]
    }

    case "points keep their order by a coordinate they do not have" {
        doenet r#"<graph><point name="A">(0,5)</point><point name="B">(-2,6)</point></graph>
                  <sort name="s" sortByComponent="3">$A $B</sort>"#;
        expect { "s.values" = [0, 5, -2, 6] }
        diagnostics[
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
        ]
    }

    case "vectors sort by their displacement" {
        doenet r#"<graph><vector name="A" displacement="(0,5)" tail="(5,2)" />
                  <vector name="B" displacement="(-2,6)" tail="(3,7)" /></graph>
                  <sort name="d">$A $B</sort>"#;
        expect { "d.values" = [-2, 6, 0, 5] }
        diagnostics[
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
        ]
    }

    case "vectors sort by their tail, by the coordinate sortByComponent names" {
        doenet r#"<graph><vector name="A" displacement="(0,5)" tail="(5,2)" />
                  <vector name="B" displacement="(-2,6)" tail="(3,7)" />
                  <vector name="C" displacement="(7,-3)" tail="(-4,5)" /></graph>
                  <sort name="t2" sortVectorsBy="tail" sortByComponent="2">$A $B $C</sort>"#;
        expect { "t2.values" = [0, 5, 7, -3, -2, 6] }
        diagnostics[
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
        ]
    }

    case "points sort by a prop they have, any spelling" {
        doenet r#"<graph><point name="A">(0,5)</point><point name="B">(-2,6)</point>
                  <point name="C">(7,-3)</point></graph>
                  <sort name="s" sortByProp="Y">$A $B $C</sort>"#;
        expect { "s.values" = [7, -3, 0, 5, -2, 6] }
        diagnostics[
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
        ]
    }

    case "a drag of a shuffled point lands on the point it shows" {
        doenet r#"<graph><point name="A">(1,2)</point><point name="B">(3,4)</point></graph>
                  <graph><shuffle name="s">$A $B</shuffle></graph>"#;
        expect { "s.componentOrder" = [1, 2], "s[2].coords" = (3, 4) }
        request { "s[2].coords" = (-3, -4) }
        expect { "B.coords" = (-3, -4), "s.values" = [1, 2, -3, -4] }
    }

    case "a drag of a sorted point is dropped: it would move the point" {
        doenet r#"<graph><point name="A">(1,2)</point><point name="B">(3,4)</point></graph>
                  <graph><sort name="s">$A $B</sort></graph>"#;
        request { "s[1].coords" = (5, 0) }
        dropped(2)
        expect { "A.coords" = (1, 2), "s.values" = [1, 2, 3, 4] }
        diagnostics[
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
            "cells-request-meets-no-inverse", "cells-request-meets-no-inverse",
        ]
    }

    case "booleans sort false before true, each entry a boolean" {
        doenet r#"<boolean name="b">true</boolean>
                  <sort name="s" type="boolean">true false $b false</sort>
                  <shuffle name="h" type="boolean">true false</shuffle>"#;
        expect {
            "s.values" = [0, 0, 1, 1], "s.componentOrder" = [2, 4, 1, 3],
            "s[1].value" = 0, "h.numComponents" = 2,
        }
    }

    case "a point among other values is refused" {
        doenet r#"<point name="A">(1,2)</point><sort name="s">$A 3</sort>"#;
        diagnostics["cells-unsupported"]
    }
}
