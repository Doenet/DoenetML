import { useCell, useStore } from "../hooks";
import { Children } from "./index";

/** `<answer>`: its input children (an explicit or implicit `<mathInput>`),
 * a Submit button, and the credit the last submit earned. Awards, whens and
 * submitted responses are children too but render as nothing. */
export function AnswerView({ idx }: { idx: number }) {
    const store = useStore();
    const credit = useCell(store.comps.cell(idx, "credit"));
    const submissions = useCell(store.comps.cell(idx, "numSubmissions"));
    const shown = Number.isNaN(credit) ? 0 : credit;
    return (
        <span
            className="answer"
            data-comp={idx}
            data-name={store.comps.name(idx) ?? undefined}
        >
            <Children idx={idx} inGraph={false} />
            <button
                className="submitAnswer"
                onClick={() => store.submit(idx)}
                style={{ marginLeft: "0.4em" }}
            >
                Submit
            </button>
            {submissions > 0 ? (
                <span
                    className="answerCredit"
                    style={{
                        marginLeft: "0.4em",
                        color:
                            shown >= 1 ? "green" : shown > 0 ? "orange" : "red",
                    }}
                >
                    {Math.round(shown * 100)}%
                </span>
            ) : null}
        </span>
    );
}
