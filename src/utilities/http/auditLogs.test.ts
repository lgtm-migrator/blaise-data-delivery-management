import {cleanup} from "@testing-library/react";
import {mock_server_request_function, mock_server_request_Return_JSON} from "../../tests/utils";
import {getAuditLogs} from "./auditLogs";

const auditLogsList = [
    {id: "602fb3250003c61e92b25da0", timestamp: "Fri Feb 19 2021 12:46:29 GMT+0000 (Greenwich Mean Time)", message: "Successfully uninstalled questionnaire OPN2012K", severity: "INFO"}
];

describe("Function getAuditLogs(filename: string) ", () => {

    it("It should return true with data if the list is returned successfully", async () => {
        mock_server_request_Return_JSON(200, auditLogsList);
        const [success, instruments] = await getAuditLogs();
        expect(success).toBeTruthy();
        expect(instruments).toEqual(instruments);
    });

    it("It should return true with an empty list if a 404 is returned from the server", async () => {
        mock_server_request_Return_JSON(404, []);
        const [success, instruments] = await getAuditLogs();
        expect(success).toBeTruthy();
        expect(instruments).toEqual([]);
    });

    it("It should return false with an empty list if request returns an error code", async () => {
        mock_server_request_Return_JSON(500, {});
        const [success, instruments] = await getAuditLogs();
        expect(success).toBeFalsy();
        expect(instruments).toEqual([]);
    });

    it("It should return false with an empty list if request JSON is not a list", async () => {
        mock_server_request_function(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.reject("Failed"),
            })
        );
        const [success, instruments] = await getAuditLogs();
        expect(success).toBeFalsy();
        expect(instruments).toEqual([]);
    });

    it("It should return false with an empty list if request JSON is invalid", async () => {
        mock_server_request_Return_JSON(200, {name: "NAME"});
        const [success, instruments] = await getAuditLogs();
        expect(success).toBeFalsy();
        expect(instruments).toEqual([]);
    });

    it("It should return false with an empty list if request call fails", async () => {
        mock_server_request_function(() =>
            Promise.resolve(() => {
                throw "error";
            })
        );
        const [success, instruments] = await getAuditLogs();
        expect(success).toBeFalsy();
        expect(instruments).toEqual([]);
    });

    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});
