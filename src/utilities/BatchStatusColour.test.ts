import {getDDFileStatusStyle} from "./BatchStatusColour";

describe("Function getDDFileStatusStyle() ", () => {

    it("should return 'dead' is status is inactive", async () => {
        const status = getDDFileStatusStyle("inactive");
        expect(status).toEqual("dead");
    });

    it("should return 'success' is status is in_arc", async () => {
        const status = getDDFileStatusStyle("in_arc");
        expect(status).toEqual("success");
    });


    it("should return 'error' is status is errored", async () => {
        const status = getDDFileStatusStyle("errored");
        expect(status).toEqual("error");
    });

    it("should return 'pending' is status is not inactive, errored or in in_arc", async () => {
        const status = getDDFileStatusStyle("bacon");
        expect(status).toEqual("pending");
    });

    it("should return 'pending' is status is started", async () => {
        const status = getDDFileStatusStyle("started");
        expect(status).toEqual("pending");
    });

    it("should return 'pending' is status is generated", async () => {
        const status = getDDFileStatusStyle("generated");
        expect(status).toEqual("pending");
    });

    it("should return 'pending' is status is in_staging", async () => {
        const status = getDDFileStatusStyle("in_staging");
        expect(status).toEqual("pending");
    });

    it("should return 'pending' is status is encrypted", async () => {
        const status = getDDFileStatusStyle("encrypted");
        expect(status).toEqual("pending");
    });

    it("should return 'pending' is status is in_nifi_bucket", async () => {
        const status = getDDFileStatusStyle("in_nifi_bucket");
        expect(status).toEqual("pending");
    });

    it("should return 'pending' is status is nifi_notified", async () => {
        const status = getDDFileStatusStyle("nifi_notified");
        expect(status).toEqual("pending");
    });
});
