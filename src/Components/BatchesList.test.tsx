/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { Router } from "react-router";
import { render, cleanup } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { DataDeliveryBatchData, DataDeliveryFileStatus } from "../../Interfaces";
import { createMemoryHistory } from "history";
import BatchesList from "./BatchesList";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

// Create Mock adapter for Axios requests
const mock = new MockAdapter(axios, {onNoMatch: "throwException"});

describe("Check snapshot of BatchList:", () => {
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
            name: "OPN_12032021_023400"
        },
        {
            survey: "LM",
            date: new Date("2021-03-12T02:30:00.000Z"),
            dateString: "13/03/2021 04:30:00",
            name: "LM_12032021_023398"
        },
        {
            survey: "LM",
            date: new Date("2021-03-12T02:30:00.000Z"),
            dateString: "11/03/2021 09:30:00",
            name: "LM_12032021_876000"
        }
    ];

    beforeEach(() => {
        mock.onGet("/api/batch").reply(200, batches);
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
        expect(await screen.findByText(/Survey/)).toBeDefined();
        expect(await screen.findByText(/Data delivery run time/)).toBeDefined();
        expect(await screen.findByText(/Status/)).toBeDefined();
        expect(await screen.findAllByText(/View run status/)).toBeDefined();
        expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
});

describe("Check status component color:", () => {
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
            name: "OPN_12032021_023400"
        },
        {
            survey: "LM",
            date: new Date("2021-03-12T02:30:00.000Z"),
            dateString: "13/03/2021 04:30:00",
            name: "LM_12032021_023398"
        },
        {
            survey: "LM",
            date: new Date("2021-03-12T02:30:00.000Z"),
            dateString: "11/03/2021 09:30:00",
            name: "LM_12032021_876000"
        }
    ];

    const errorBatchInfoList: DataDeliveryFileStatus[] = [
        {
            batch: "OPN_24032021_113000",
            dd_filename: "OPN2004A",
            instrumentName: "OPN2004A",
            state: "in_arc",
            updated_at: "2021-03-26T12:21:10+00:00",
            error_info: ""
        },
        {
            batch: "OPN_24032021_113000",
            dd_filename: "dd_OPN2101A_26032021_121540.zip",
            instrumentName: "OPN2101A",
            state: "inactive",
            updated_at: "2021-03-26T12:21:10+00:00",
            error_info: ""
        },
        {
            batch: "OPN_24032021_113000",
            dd_filename: "dd_OPN2101A_26032021_121540.zip",
            instrumentName: "OPN2101A",
            state: "errored",
            updated_at: "2021-03-26T12:21:10+00:00",
            error_info: ""
        }
    ];

    const deadBatchInfoList: DataDeliveryFileStatus[] = [
        {
            batch: "OPN_12032021_023400",
            dd_filename: "OPN2004A",
            instrumentName: "OPN2004A",
            state: "in_arc",
            updated_at: "2021-03-26T12:21:10+00:00",
            error_info: ""
        },
        {
            batch: "OPN_12032021_023400",
            dd_filename: "dd_OPN2101A_26032021_121540.zip",
            instrumentName: "OPN2101A",
            state: "generated",
            updated_at: "2021-03-26T12:21:10+00:00",
            error_info: ""
        },
        {
            batch: "OPN_12032021_023400",
            dd_filename: "dd_OPN2101A_26032021_121540.zip",
            instrumentName: "OPN2101A",
            state: "inactive",
            updated_at: "2021-03-26T12:21:10+00:00",
            error_info: ""
        }
    ];

    const pendingBatchInfoList: DataDeliveryFileStatus[] = [
        {
            batch: "LM_12032021_023398",
            dd_filename: "LM2004A",
            instrumentName: "LM2004A",
            state: "in_arc",
            updated_at: "2021-03-26T12:21:10+00:00",
            error_info: ""
        },
        {
            batch: "LM_12032021_023398",
            dd_filename: "dd_LM2101A_26032021_121540.zip",
            instrumentName: "LM2101A",
            state: "in_arc",
            updated_at: "2021-03-26T12:21:10+00:00",
            error_info: ""
        },
        {
            batch: "LM_12032021_023398",
            dd_filename: "dd_LM2101A_26032021_121540.zip",
            instrumentName: "LM2101A",
            state: "chicken",
            updated_at: "2021-03-26T12:21:10+00:00",
            error_info: ""
        }
    ];

    const successBatchInfoList: DataDeliveryFileStatus[] = [
        {
            batch: "LM_12032021_876000",
            dd_filename: "LM2004A",
            instrumentName: "LM2004A",
            state: "in_arc",
            updated_at: "2021-03-26T12:21:10+00:00",
            error_info: ""
        },
        {
            batch: "LM_12032021_876000",
            dd_filename: "dd_LM2101A_26032021_121540.zip",
            instrumentName: "LM2101A",
            state: "in_arc",
            updated_at: "2021-03-26T12:21:10+00:00",
            error_info: ""
        },
        {
            batch: "LM_12032021_876000",
            dd_filename: "dd_LM2101A_26032021_121540.zip",
            instrumentName: "LM2101A",
            state: "in_arc",
            updated_at: "2021-03-26T12:21:10+00:00",
            error_info: ""
        }
    ];

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it("displays a red circle when a batch entry has errored ", async () => {
        mock.onGet("/api/batch").reply(200, [batches[0]]);
        mock.onGet("/api/batch/OPN_24032021_113000").reply(200, errorBatchInfoList);
        
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <BatchesList/>
            </Router>
        );

        expect(await screen.findByTestId(/OPN_24032021_113000-status-error/)).toBeDefined();
    });

    it("displays a grey circle when a batch entry is inactive", async () => {
        mock.onGet("/api/batch").reply(200, [batches[1]]);
        mock.onGet("/api/batch/OPN_12032021_023400").reply(200, deadBatchInfoList);
        
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <BatchesList/>
            </Router>
        );
        
        expect(await screen.findByTestId(/OPN_12032021_023400-status-dead/)).toBeDefined();
    });

    it("displays an amber circle when a batch entry is not in_arc, inactive or errored", async () => {
        mock.onGet("/api/batch").reply(200, [batches[2]]);
        mock.onGet("/api/batch/LM_12032021_023398").reply(200, pendingBatchInfoList);
        
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <BatchesList/>
            </Router>
        );

        expect(await screen.findByTestId(/LM_12032021_023398-status-pending/)).toBeDefined();
    });

    it("displays a green circle when a batch entry is in_arc", async () => {
        mock.onGet("/api/batch").reply(200, [batches[3]]);
        mock.onGet("/api/batch/LM_12032021_876000").reply(200, successBatchInfoList);
        
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <BatchesList/>
            </Router>
        );

        expect(await screen.findByTestId(/LM_12032021_876000-status-success/)).toBeDefined();
    });
});