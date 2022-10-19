/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { Router } from "react-router";
import { render, waitFor, cleanup } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import flushPromises, { mock_server_request_function, mock_server_request_Return_JSON } from "../tests/utils";
import { getAllBatches, getBatchInfo } from "../utilities/http";
import { DataDeliveryBatchData } from "../../Interfaces";
import { createMemoryHistory } from "history";
import MockDate from "mockdate";
import BatchesList from "./BatchesList";

const BatchInfoList = [
    {
        batch: "OPN_26032021_121540",
        dd_filename: "OPN2004A",
        instrumentName: "OPN2004A",
        prefix: "dd",
        state: "inactive",
        updated_at: "2021-03-26T12:21:10+00:00"
    },
    {
        batch: "OPN_26032021_121540",
        dd_filename: "dd_OPN2101A_26032021_121540.zip",
        instrumentName: "OPN2101A",
        prefix: "dd",
        state: "generated",
        updated_at: "2021-03-26T12:21:10+00:00"
    }
];

describe("Batches List:", () => {
    const batches: DataDeliveryBatchData[] = [
        {
            survey: "OPN",
            date: new Date("2021-03-24T11:30:00.000Z"),
            dateString: "24/03/2021 11:30:00",
            status: "success",
            name: "OPN_24032021_113000"
        },
        {
            survey: "OPN",
            date: new Date("2021-03-12T02:30:00.000Z"),
            dateString: "12/03/2021 02:30:00",
            status: "failure",
            name: "OPN_12032021_023000"
        }
    ];

    beforeEach(() => {
        mock_server_request_Return_JSON(200, batches);
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it("matches the snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <BatchesList/>
            </Router>
        );

        expect(wrapper).toMatchSnapshot();
    });

    it("displays table headings", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <BatchesList/>
            </Router>
        );
        
        expect(screen.queryByText(/Loading/i)).toBeInTheDocument();
        
        await waitFor(() => {
            expect(screen.getByText(/Survey/)).toBeDefined();
            expect(screen.getByText(/Data delivery run time/)).toBeDefined();
            expect(screen.getByText(/Status/)).toBeDefined();
            expect(screen.getAllByText(/View run status/)).toBeDefined();
            expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText(/Survey/)).toBeDefined();
            expect(screen.getByText(/Data delivery run time/)).toBeDefined();
            expect(screen.getByText(/Status/)).toBeDefined();
            expect(screen.getAllByText(/View run status/)).toBeDefined();
            expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
        });
    });

    it("displays a green circle under status", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <BatchesList/>
            </Router>
        );

        expect(screen.queryByText(/Loading/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getAllByTitle(/batchStatus/i)).toBeDefined();
            expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
        });
    })
});