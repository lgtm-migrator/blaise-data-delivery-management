/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { Switch, Route, Router} from "react-router-dom";
import { render, cleanup } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { DataDeliveryBatchData, DataDeliveryFileStatus } from "../../Interfaces";
import { createMemoryHistory } from "history";
import BatchStatusList from "./BatchStatusList";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import userEvent from "@testing-library/user-event";
 
 // Create Mock adapter for Axios requests
const mock = new MockAdapter(axios, {onNoMatch: "throwException"});

const batches: DataDeliveryBatchData[] = [
    {
        survey: "OPN",
        date: new Date("2021-03-24T11:30:00.000Z"),
        dateString: "24/03/2021 11:30:00",
        name: "OPN_24032021_113000"
    }
];

const batchRuns: DataDeliveryFileStatus[] = [
    {
        batch: "OPN_24032021_113000",
        dd_filename: "OPN2004A__26032021_121540.zip",
        instrumentName: "OPN2004A",
        state: "in_arc",
        updated_at: "2021-03-24T12:21:10+00:00",
        error_info: ""
    },
    {
        batch: "OPN_24032021_113000",
        dd_filename: "dd_OPN2101A_26032031_121540.zip",
        instrumentName: "OPN2101A",
        state: "generated",
        updated_at: "2021-03-25T12:21:10+00:00",
        error_info: ""
    },
    {
        batch: "OPN_24032021_113000",
        dd_filename: "dd_OPN2331A_26032081_121540.zip",
        instrumentName: "OPN2331A",
        state: "inactive",
        updated_at: "2021-03-26T12:21:10+00:00",
        error_info: ""
    },
    {
        batch: "OPN_24032021_113000",
        dd_filename: "dd_OPN2806A_26032051_121540.zip",
        instrumentName: "OPN2806A",
        state: "errored",
        updated_at: "2021-03-27T12:21:10+00:00",
        error_info: ""
    }
];

const StatusDescriptions = {
    "inactive": "The data delivery instrument has no active survey days, we will not generate a data delivery file, we should never alert",
    "started": "The data delivery process has found an instrument with active survey days",
    "generated": "The data delivery process has generated the required files",
    "in_staging": "The data delivery files have been copied to the staging bucket",
    "encrypted": "The data delivery files have been encrypted and are ready for NiFi",
    "in_nifi_bucket": "The data delivery files are in the NiFi bucket",
    "nifi_notified": "NiFi has been notified that we have files to ingest",
    "in_arc": "NiFi has copied the files to ARC (on prem) and sent a receipt",
    "errored": "An error has occurred processing the file (error receipt from NiFi for example)",
};

const mockRoute = `/batch/${batches[0].name}`;

describe("Check BatchStatusList snapshot and breadcrumb:", () => {
    beforeEach(() => {
        mock.onGet("/api/batch").reply(200, batches);
        mock.onGet(`/api/batch/${batches[0].name}`).reply(200, batchRuns);
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it("matches the snapshot", async () => {
        const history = createMemoryHistory({
            initialEntries: [mockRoute]
        });
        const wrapper = render(
            <Router history={history}>
                <BatchStatusList statusDescriptionList={StatusDescriptions} />
            </Router>
        );
        
        expect(wrapper).toMatchSnapshot();
    });

    it("navigates to the homepage when the breadcrumb is clicked", async () => {
        const history = createMemoryHistory({
            initialEntries: [mockRoute]
        });
        render(
            <Router history={history}>
                <Switch>
                    <Route path={mockRoute}>
                        <BatchStatusList statusDescriptionList={StatusDescriptions} />
                    </Route>
                </Switch>
            </Router>
        );

        const homeLink = screen.getByText("Home");
        userEvent.click(homeLink);
        expect(history.location.pathname).toEqual("/");
    });
});

describe("Check run table:", () => {
    beforeEach(() => {
        mock.onGet("/api/batch").reply(200, batches);
        mock.onGet(`/api/batch/${batches[0].name}`).reply(200, batchRuns);
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it("displays table headings (including loader/spinner)", async () => {
        const history = createMemoryHistory({
            initialEntries: [mockRoute]
        });
        render(
            <Router history={history}>
                <BatchStatusList statusDescriptionList={StatusDescriptions} />
            </Router>
        );

        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
        expect(await screen.findByText(/Questionnaire/)).toBeVisible();
        expect(await screen.findByText(/Status/)).toBeVisible();
        expect(await screen.findByText(/Last update/)).toBeVisible();
        expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    it("displays the questionnaire/instrument names", async () => {
        const history = createMemoryHistory({
            initialEntries: [mockRoute]
        });
        render(
            <Router history={history}>
                <BatchStatusList statusDescriptionList={StatusDescriptions} />
            </Router>
        );

        expect(await screen.findByText(/OPN2004A/)).toBeVisible();
        expect(await screen.findByText(/OPN2101A/)).toBeVisible();
        expect(await screen.findByText(/OPN2331A/)).toBeVisible();
        expect(await screen.findByText(/OPN2806A/)).toBeVisible();
    });

    it("displays the status colour and details", async () => {
        const history = createMemoryHistory({
            initialEntries: [mockRoute]
        });
        render(
            <Router history={history}>
                <BatchStatusList statusDescriptionList={StatusDescriptions} />
            </Router>
        );

        expect(await screen.findByText(StatusDescriptions["in_arc"])).toBeVisible();
        expect(await screen.findByTestId(/OPN2004A-status--success/)).toBeDefined();
        expect(await screen.findByText(StatusDescriptions["generated"])).toBeVisible();
        expect(await screen.findByTestId(/OPN2101A-status--pending/)).toBeDefined();
        expect(await screen.findByText(StatusDescriptions["inactive"])).toBeVisible();
        expect(await screen.findByTestId(/OPN2331A-status--dead/)).toBeDefined();
        expect(await screen.findByText(StatusDescriptions["errored"])).toBeVisible();
        expect(await screen.findByTestId(/OPN2806A-status--error/)).toBeDefined();
    });

    it.only("displays last update details", async () => {
        const history = createMemoryHistory({
            initialEntries: [mockRoute]
        });
        render(
            <Router history={history}>
                <BatchStatusList statusDescriptionList={StatusDescriptions} />
            </Router>
        );

        expect(await screen.findByText(/2021-03-24T12:21:10+00:00/i)).toBeVisible();
        expect(await screen.findByText(/2021-03-25T12:21:10+00:00/i)).toBeVisible();
        expect(await screen.findByText(/2021-03-26T12:21:10+00:00/i)).toBeVisible();
        expect(await screen.findByText(/2021-03-27T12:21:10+00:00/i)).toBeVisible();
    });
});