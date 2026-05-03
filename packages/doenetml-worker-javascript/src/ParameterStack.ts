/**
 * Stack of parameter bags used for template/composite expansion. The top of
 * the stack is the active set; `push` and `pop` track entry into and exit
 * from a nested scope, optionally merging the parent scope on entry.
 */
export default class ParameterStack {
    stack: Record<string, any>[];

    constructor(initialParameters?: Record<string, any>) {
        this.stack = [{}];
        if (initialParameters !== undefined) {
            Object.assign(this.parameters, initialParameters);
        }
    }

    get parameters(): Record<string, any> {
        return this.stack[this.stack.length - 1];
    }

    push(
        additionalParameters?: Record<string, any>,
        mergePrevious: boolean = true,
    ): void {
        let newParameters: Record<string, any> = {};
        if (mergePrevious) {
            Object.assign(newParameters, this.parameters);
            if (additionalParameters !== undefined) {
                Object.assign(newParameters, additionalParameters);
            }
        } else {
            newParameters = additionalParameters ?? {};
        }
        this.stack.push(newParameters);
    }

    pop(): Record<string, any> | undefined {
        let lastParams = this.stack.pop();

        // Don't fail if pop off too much; just create an empty object.
        if (this.stack.length === 0) {
            this.stack = [{}];
        }
        return lastParams;
    }
}
