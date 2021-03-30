import Functions from "./Functions";


describe("DD file to data test", () => {
    it("should return the prefix 'dd' for file dd_OPN2102T_12032021_023052.zip", () => {
        expect(Functions.dd_filename_to_data("dd_OPN2102T_12032021_023052.zip").prefix
        ).toBe("dd");
    });

    it("should return 'OPN2102T' for instrumentName for file dd_OPN2102T_12032021_023052.zip", () => {
        expect(Functions.dd_filename_to_data("dd_OPN2102T_12032021_023052.zip").instrumentName
        ).toBe("OPN2102T");
    });

    it("should return 'OPN2102T' for instrumentName when only instrument name is returned for the filename", () => {
        expect(Functions.dd_filename_to_data("OPN2102T").instrumentName
        ).toBe("OPN2102T");
    });

});

describe("Batch name to data", () => {
    it("should return the survey 'OPN' for batch OPN_26032021_083000", () => {
        expect(Functions.batch_to_data("OPN_26032021_083000").survey
        ).toBe("OPN");
    });

    it("should return correct date object for batch OPN_30032021_141600", () => {
        expect(Functions.batch_to_data("OPN_30032021_141600").date
        ).toStrictEqual(new Date("2021-03-30T13:16:00.000Z"));
    });

    it("should return correct date object for batch OPN_26032021_083000", () => {
        expect(Functions.batch_to_data("OPN_30032021_141600").date
        ).toStrictEqual(new Date("2021-03-30T13:30:00.000Z"));
    });

    it("should return original batch name for batch OPN_26032021_083000", () => {
        expect(Functions.batch_to_data("OPN_26032021_083000").name
        ).toBe("OPN_26032021_083000");
    });

    it("should return the a blank survey for batch 26032021_083000", () => {
        expect(Functions.batch_to_data("26032021_083000").survey
        ).toBe("");
    });

    it("should return original batch name for batch that doesn't match expected standard ", () => {
        expect(Functions.batch_to_data("batch-name-RANDOMM-").name
        ).toBe("batch-name-RANDOMM-");
    });
});
