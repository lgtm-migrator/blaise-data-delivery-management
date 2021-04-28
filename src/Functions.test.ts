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

    it("should return 'LMS2101_AA1' for instrumentName for file dd_LMS2101_AA1_27042021_043113.zip", () => {
        expect(Functions.dd_filename_to_data("dd_LMS2101_AA1_27042021_043113.zip").instrumentName
        ).toBe("LMS2101_AA1");
    });

});

describe("Batch name to data", () => {
    it("should return the survey 'OPN' for batch OPN_26032021_083000", () => {
        expect(Functions.batch_to_data("OPN_26032021_083000").survey
        ).toBe("OPN");
    });

    it("should return correct datetime string for batch OPN_30032021_141600", () => {
        expect(Functions.batch_to_data("OPN_30032021_141600").dateString
        ).toStrictEqual("30/03/2021 14:16:00");
    });

    it("should return correct datetime string for batch OPN_26032021_083000", () => {
        expect(Functions.batch_to_data("OPN_26032021_083000").dateString
        ).toStrictEqual("26/03/2021 08:30:00");
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
