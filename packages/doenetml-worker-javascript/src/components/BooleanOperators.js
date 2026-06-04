import BooleanBaseOperator from "./abstract/BooleanBaseOperator";
import BooleanBaseOperatorOneInput from "./abstract/BooleanBaseOperatorOneInput";

export class Not extends BooleanBaseOperatorOneInput {
    static componentType = "not";

    static componentDocs = {
        summary: "Logical negation of a boolean value",
    };

    static applyBooleanOperator(value) {
        return !value;
    }
}

export class And extends BooleanBaseOperator {
    static componentType = "and";

    static componentDocs = {
        summary:
            "Logical AND: true only when all child boolean values are true",
    };

    static applyBooleanOperator(values) {
        return values.every((x) => x);
    }
}

export class Or extends BooleanBaseOperator {
    static componentType = "or";

    static componentDocs = {
        summary:
            "Logical OR: true when at least one child boolean value is true",
    };

    static applyBooleanOperator(values) {
        return values.some((x) => x);
    }
}

export class Xor extends BooleanBaseOperator {
    static componentType = "xor";

    static componentDocs = {
        summary:
            "Logical exclusive OR: true when exactly one child boolean value is true",
    };

    static applyBooleanOperator(values) {
        let numberTrues = values.reduce((acc, curr) => acc + (curr ? 1 : 0), 0);
        return numberTrues === 1;
    }
}

export class Iff extends BooleanBaseOperator {
    static componentType = "iff";

    static componentDocs = {
        summary:
            "IF and only iF: Logical exclusive NOR: true when exactly one child boolean value is false",
    };

    static applyBooleanOperator(values) {
        return values.every((x) => x === values[0]);
    }
}

export class Implies extends BooleanBaseOperator {
    static componentType = "implies";

    static componentDocs = {
        summary:
            "Logical implication (binary): true when the first value is false or the second value is true",
    };

    static applyBooleanOperator(values) {
        let tooManyValues = values.length > 2;
        if (tooManyValues) {
            console.warn(
                "Implies operator should have at most two boolean children",
            );
        }
        switch (values.length) {
            case 0:
                return true;
            case 1:
                return !values[0];
            case 2:
                return !values[0] || values[1];
            default:
                return false;
        }
    }
}
