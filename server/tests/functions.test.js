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

    it("should return the date string '12/03/2021' for file dd_OPN2102T_12032021_023052.zip", () => {
        expect(Functions.dd_filename_to_data("dd_OPN2102T_12032021_023052.zip").dateString
        ).toBe("12/03/2021");
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
