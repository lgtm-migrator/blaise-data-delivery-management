import React from "react";
import {render, waitFor, cleanup} from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";
import flushPromises, {mock_server_request_Return_JSON} from "./tests/utils";
import {act} from "react-dom/test-utils";
import {createMemoryHistory} from "history";
import {Router} from "react-router";
import {DataDeliveryBatchData} from "../Interfaces";

describe("React homepage", () => {

    const batches: DataDeliveryBatchData[] = [
        {
            survey: "OPN",
            date: new Date("2021-03-24T11:30:00.000Z"),
            dateString: "24/03/2021 11:30:00",
            name: "OPN_24032021_113000"
        },
        {
            survey: "OPN",
            date: new Date("2021-03-12T02:30:00.000Z"),
            dateString: "12/03/2021 02:30:00",
            name: "OPN_12032021_023000"
        }
    ];


    beforeAll(() => {
        mock_server_request_Return_JSON(200, batches);
    });

    it("view instrument page matches Snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <App/>
            </Router>
        );

        await act(async () => {
            await flushPromises();
        });

        await waitFor(() => {
            expect(wrapper).toMatchSnapshot();
        });
    });

    it("should render correctly", async () => {
        const history = createMemoryHistory();
        const {getByText, queryByText} = render(
            <Router history={history}>
                <App/>
            </Router>
        );

        expect(queryByText(/Loading/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(getByText(/Data Delivery Management/i)).toBeDefined();
            expect(queryByText(/Loading/i)).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(getByText(/Data Delivery Management/i)).toBeDefined();
            expect(getByText(/24\/03\/2021 11:30:00/i)).toBeDefined();
            expect(getByText(/12\/03\/2021 02:30:00/i)).toBeDefined();
            expect(queryByText(/Loading/i)).not.toBeInTheDocument();
        });

    });

    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});


describe("Given the API returns an empty list", () => {

    beforeAll(() => {
        mock_server_request_Return_JSON(200, []);
    });

    it("it should render with a message to inform the user in the list", async () => {
        const history = createMemoryHistory();
        const {getByText, queryByText} = render(
            <Router history={history}>
                <App/>
            </Router>
        );

        expect(queryByText(/Loading/i)).toBeInTheDocument();


        await waitFor(() => {
            expect(getByText(/No data delivery runs found./i)).toBeDefined();
            expect(queryByText(/Loading/i)).not.toBeInTheDocument();
        });

    });

    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});
