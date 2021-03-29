// React
import React from "react";
// Test modules
import {defineFeature, loadFeature} from "jest-cucumber";
import {act, cleanup, fireEvent, render, screen} from "@testing-library/react";
import {createMemoryHistory} from "history";
import App from "../../App";
import {Router} from "react-router";
import "@testing-library/jest-dom";
// Mock elements
import flushPromises from "../../tests/utils";
import {mock_fetch_requests} from "./functions";
import {BatchInfoList, BatchList, StatusDescriptions} from "./mock_objects";


// Load in feature details from .feature file
const feature = loadFeature(
    "./src/features/view_run_status_empty_lists.feature",
    {tagFilter: "not @server and not @integration"}
);

const mock_server_responses_no_batches = (url: string) => {
    console.log(url);
    if (url.includes("/api/batch/OPN_26032021_112954")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(BatchInfoList),
        });
    } else if (url.includes("/api/batch")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve([]),
        });
    } else if (url.includes("/api/state/descriptions")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(StatusDescriptions),
        });
    }
};

const mock_server_responses_empty_batch = (url: string) => {
    console.log(url);
    if (url.includes("/api/batch/OPN_26032021_112954")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve([]),
        });
    } else if (url.includes("/api/batch")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(BatchList),
        });
    } else if (url.includes("/api/state/descriptions")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(StatusDescriptions),
        });
    }
};

defineFeature(feature, test => {
    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
        jest.resetModules();
    });

    beforeEach(() => {
        cleanup();
    });

    test("No recent Data Delivery runs found", ({given, when, then}) => {
        given("I have launched the Data Delivery Management", () => {
            mock_fetch_requests(mock_server_responses_no_batches);
            const history = createMemoryHistory();
            render(
                <Router history={history}>
                    <App/>
                </Router>
            );

        });

        when("I view the landing page", async () => {
            await act(async () => {
                await flushPromises();
            });
        });

        then("I am presented with a message saying that there are no runs found", () => {
            expect(screen.getByText(/Data delivery runs/)).toBeDefined();
            expect(screen.getByText(/No data delivery runs found./i)).toBeDefined();
        });
    });

    test("No files found in run", ({given, when, then, and}) => {
        given("I can see the run I wish to see the status of", async () => {
            mock_fetch_requests(mock_server_responses_empty_batch);
            const history = createMemoryHistory();
            render(
                <Router history={history}>
                    <App/>
                </Router>
            );
            await act(async () => {
                await flushPromises();
            });
            expect(screen.getByText(/Data delivery runs/i)).toBeDefined();
            expect(screen.getByText(/26\/03\/2021 11:29:54/i)).toBeDefined();

        });

        when("I select the 'View run status' link", async () => {
            await act(async () => {
                fireEvent.click(screen.getByTestId(/view-OPN_26032021_112954/));
                await flushPromises();
            });
        });

        then("I am presented with a message saying that there are no files found", () => {
            expect(screen.getByText(/Delivery trigger/i));
            expect(screen.getByText(/No data delivery files for this run found./i)).toBeDefined();
        });
    });
});
