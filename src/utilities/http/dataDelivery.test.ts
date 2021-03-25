import {cleanup} from "@testing-library/react";
import {mock_server_request_function, mock_server_request_Return_JSON} from "../../tests/utils";
import {sendDataDeliveryRequest} from "./dataDelivery";

describe("Function sendDataDeliveryRequest() ", () => {

    it("It should return true the trigger was successful", async () => {
        mock_server_request_Return_JSON(200, "completed");
        const success = await sendDataDeliveryRequest();
        expect(success).toBeTruthy();
    });

    it("It should return false when the trigger returned a 200 but the state was 'failed'", async () => {
        mock_server_request_Return_JSON(200, "failed");
        const success = await sendDataDeliveryRequest();
        expect(success).toBeFalsy();
    });

    it("It should return false when the trigger returned a 200 but the state was 'canceled'", async () => {
        mock_server_request_Return_JSON(200, "canceled");
        const success = await sendDataDeliveryRequest();
        expect(success).toBeFalsy();
    });

    it("It should return false if a 404 is returned from the server", async () => {
        mock_server_request_Return_JSON(404, []);
        const success = await sendDataDeliveryRequest();
        expect(success).toBeFalsy();
    });

    it("It should return false if request returns an error code", async () => {
        mock_server_request_Return_JSON(500, {});
        const success = await sendDataDeliveryRequest();
        expect(success).toBeFalsy();
    });

    it("It should return false with an empty list if request JSON is invalid", async () => {
        mock_server_request_Return_JSON(200, {name: "NAME"});
        const success = await sendDataDeliveryRequest();
        expect(success).toBeFalsy();
    });

    it("It should return false with an empty list if request call fails", async () => {
        mock_server_request_function(() =>
            Promise.resolve(() => {
                throw "error";
            })
        );
        const success = await sendDataDeliveryRequest();
        expect(success).toBeFalsy();
    });

    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});
