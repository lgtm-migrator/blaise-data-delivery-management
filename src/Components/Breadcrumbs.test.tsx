/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { Switch, Route, Router} from "react-router-dom";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { createMemoryHistory } from "history";
import BatchStatusList from "./BatchStatusList";
import userEvent from "@testing-library/user-event";

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

const mockRoute = "/batch/OPN_24032021_113000";

describe("Breadcrumbs:", () => {
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