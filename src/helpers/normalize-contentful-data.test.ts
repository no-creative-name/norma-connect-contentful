import { Entry } from "contentful";
import { normalizeContentfulData } from "./normalize-contentful-data";

const contentTypeInfos = {
    items: [
        {
            fields: [
                {
                    id: 'fieldA',
                    type: 'string'
                },
                {
                    id: 'fieldB',
                    type: 'number'
                },
                {
                    id: 'subContentA',
                    type: 'reference'
                },
                {
                    id: 'subContentB',
                    type: 'referenceArray'
                }
            ],
            sys: {
                id: "contentTypeA",
            },
        },
        {
            fields: [
                {
                    id: 'fieldA',
                    type: 'string'
                },
                {
                    id: 'fieldB',
                    type: 'number'
                }
            ],
            sys: {
                id: "contentTypeB",
            },
        },
        {
            fields: [
                {
                    id: 'fieldA',
                    type: 'string'
                },
                {
                    id: 'fieldB',
                    type: 'number'
                }
            ],
            sys: {
                id: "contentTypeC",
            },
        }
    ]
} 
const expectedInput = {
    fields: {
        fieldA: "",
        fieldB: 0,
        subContentA: {
            fields: {
                fieldA: "",
                fieldB: 0,
            },
            sys: {
                contentType: {
                    sys: {
                        id: "contentTypeB",
                    },
                },
                id: "1",
            },
        },
        subContentB: [
            {
                fields: {
                    fieldA: "",
                    fieldB: 0,
                },
                sys: {
                    contentType: {
                        sys: {
                            id: "contentTypeC",
                        },
                    },
                    id: "2",
                },
            },
            {
                fields: {
                    fieldA: "",
                    fieldB: 0,
                },
                sys: {
                    contentType: {
                        sys: {
                            id: "contentTypeC",
                        },
                    },
                    id: "3",
                },
            },
        ],
    },
    sys: {
        contentType: {
            sys: {
                id: "contentTypeA",
            },
        },
        id: "4",
    },
};
const expectedOutput = {
    data: {
        fieldA: {
            fieldType: "string",
            value: ""
        },
        fieldB: {
            fieldType: "number",
            value: 0
        },
        subContentA: {
            fieldType: 'reference',
            value: {
                data: {
                    fieldA: {
                        fieldType: "string",
                        value: ""
                    },
                    fieldB: {
                        fieldType: "number",
                        value: 0
                    },
                },
                type: "contentTypeB",
            },
        },
        subContentB: {
            fieldType: "referenceArray",
            value: [
                {
                    data: {
                        fieldA: {
                            fieldType: "string",
                            value: ""
                        },
                        fieldB: {
                            fieldType: "number",
                            value: 0
                        },
                    },
                    type: "contentTypeC",
                },
                {
                    data: {
                        fieldA: {
                            fieldType: "string",
                            value: ""
                        },
                        fieldB: {
                            fieldType: "number",
                            value: 0
                        }
                    },
                    type: "contentTypeC",
                },
            ]
        }
    },
    type: "contentTypeA",
};

describe("normalizeContentfulData", () => {
    test("throws an error for undefined raw content data", () => {
        expect(() => {normalizeContentfulData(undefined, (contentTypeInfos as any));}).toThrow(Error);
    });
    test("throws an error for undefined content type infos", () => {
        expect(() => {normalizeContentfulData((expectedInput as Entry<unknown>), undefined);}).toThrow(Error);
    });
    test("correctly converts raw to normalized data", () => {
        const result = normalizeContentfulData((expectedInput as Entry<unknown>), (contentTypeInfos as any));
        expect(result).toMatchObject(expectedOutput);
    });
});
