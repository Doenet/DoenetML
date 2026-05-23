# DoenetML Do and Don't Checklist

## Do

- Name components when they are reused.
- Use `$name` references for reactive behavior.
- Keep validation explicit inside `<answer>` logic.
- Keep graph settings and labels intentional.
- Add short descriptions for interactive visuals.
- Break long logic into smaller named components.
- Verify all references resolve before delivery.

## Don't

- Don't leave key components unnamed when reuse is needed.
- Don't hide correctness logic in ambiguous text.
- Don't depend on color alone in graphs/feedback.
- Don't force publication-only PreTeXt patterns into interactive DoenetML flows.
- Don't assume static numbering/cross-reference behavior like PreTeXt.
- Don't use `<m>`/`<md>` when you need computed state.
- Don't extend an array/list state variable with a scalar component (use `<mathList extend="$x.someList"/>`, not `<math extend>`; same for `<textList>`/`<numberList>`/`<vectorList>`/`<booleanList>`/`<pointList>`).
- Don't write cross-component reference chains (`$user.value.latex` doesn't work; name the intermediate or pick a property that exists directly). Coordinate-style chains within one array's `indexAliases` (`$myLine.points[1].x`) *do* work.
- Don't call `$foo` a "macro" in prose, comments, or commit messages — the term is *reference*.

## Final Check Before Sending

- Every `$name` reference points to an existing named component.
- Every graded prompt includes explicit validation logic.
- Markup is well formed and tags are properly closed.
- Any accessibility-critical graph description/labeling is present.
