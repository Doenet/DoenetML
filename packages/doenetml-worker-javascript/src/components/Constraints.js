import BaseComponent from "./abstract/BaseComponent";

export default class Constraints extends BaseComponent {
    static componentType = "constraints";
    static rendererType = undefined;

    static excludeFromSchema = true;

    static returnChildGroups() {
        return [
            {
                group: "constraints",
                componentTypes: ["_constraint"],
            },
        ];
    }
}
