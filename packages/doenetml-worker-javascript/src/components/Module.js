import Group from "./Group";

export default class Module extends Group {
    static componentType = "module";

    static componentDocs = {
        summary:
            "A reusable group with parameterized attributes; can be referenced or extended elsewhere.",
    };

    static acceptAnyAttribute = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        delete attributes.styleNumber;

        return attributes;
    }
}
