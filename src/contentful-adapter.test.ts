import { ContentfulAdapter } from "./main";

describe("ContentfulAdapter", () => {
    test("throws an error when created with undefined config", () => {
        expect(() => new ContentfulAdapter(undefined)).toThrow(Error);
    });
});
