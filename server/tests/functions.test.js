import Functions from "../Functions";

describe("Field period to text test", () => {
    it("should return 'April 2020' for field period 2004", () => {
        expect(Functions.field_period_to_text("OPN2004")
        ).toBe("April 2020");
    });

    it("should return 'January 2020' for field period 2001", () => {
        expect(Functions.field_period_to_text("OPN2001")
        ).toBe("January 2020");
    });

    it("should return 'December 2020' for field period 2012", () => {
        expect(Functions.field_period_to_text("OPN2012")
        ).toBe("December 2020");
    });

    it("should return an unknown message if the survey is unrecognised", () => {
        expect(Functions.field_period_to_text("DST2008")
        ).toBe("Field period unknown");
    });

    it("should return an unknown message if the month is unrecognised", () => {
        expect(Functions.field_period_to_text("OPN20AB")
        ).toBe("Unknown 2020");
    });
});


describe("DD file to data test", () => {
    it("should return the prefix 'dd' for file dd_OPN2102T_12032021_023052.zip", () => {
        expect(Functions.dd_filename_to_data("dd_OPN2102T_12032021_023052.zip").prefix
        ).toBe("dd");
    });

    it("should return correct date object for file dd_OPN2102T_12032021_023052.zip", () => {
        expect(Functions.dd_filename_to_data("dd_OPN2102T_12032021_023052.zip").date
        ).toStrictEqual(new Date("2021-03-12T02:30:52.000Z"));
    });

    it("should return 'OPN2102T' for instrumentName for file dd_OPN2102T_12032021_023052.zip", () => {
        expect(Functions.dd_filename_to_data("dd_OPN2102T_12032021_023052.zip").instrumentName
        ).toBe("OPN2102T");
    });
});

describe("Batch name to data", () => {
    it("should return the survey 'OPN' for batch OPN_26032021_083000", () => {
        expect(Functions.batch_to_data("OPN_26032021_083000").survey
        ).toBe("OPN");
    });

    it("should return correct date object for batch OPN_26032021_083000", () => {
        expect(Functions.batch_to_data("OPN_26032021_083000").date
        ).toStrictEqual(new Date("2021-03-26T08:30:00.000Z"));
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
