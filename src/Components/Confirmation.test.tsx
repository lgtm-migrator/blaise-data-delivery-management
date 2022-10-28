/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { Switch, Route, Router } from "react-router-dom";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import Confirmation from "./Confirmation";
import { sendDataDeliveryRequest } from "../utilities/http";

const mockRoute = "/trigger";

afterAll(() => {
    jest.clearAllMocks();
});

describe("Check Confirmation page snapshot:", () => {
    it("matches the snapshot", async () => {
        const history = createMemoryHistory({
            initialEntries: [mockRoute]
        });
        const wrapper = render(
            <Router history={history}>
                <Confirmation />
            </Router>
        );
        
        expect(wrapper).toMatchSnapshot();
    });
});

describe("Check form:", () => {
    it("'Yes, trigger Data delivery' is selectable and is the only one checked", async () => {
        const history = createMemoryHistory({
            initialEntries: [mockRoute]
        });
        render(
            <Router history={history}>
                <Switch>
                    <Route path={mockRoute}>
                        <Confirmation />
                    </Route>
                </Switch>
            </Router>
        );
        
        const radioBtnForYes = screen.getByText("Yes, trigger Data Delivery");
        userEvent.click(radioBtnForYes);

        expect(screen.getByLabelText("Yes, trigger Data Delivery")).toBeChecked();
        expect(screen.getByLabelText("No, do not trigger Data Delivery")).not.toBeChecked();
    });
    
    it("'No, do not trigger Data delivery' is selectable and is the only one checked", async () => {
        const history = createMemoryHistory({
            initialEntries: [mockRoute]
        });
        render(
            <Router history={history}>
                <Switch>
                    <Route path={mockRoute}>
                        <Confirmation />
                    </Route>
                </Switch>
            </Router>
        );
        
        const radioBtnForNo = screen.getByText("No, do not trigger Data Delivery");
        userEvent.click(radioBtnForNo);

        expect(screen.getByLabelText("Yes, trigger Data Delivery")).not.toBeChecked();
        expect(screen.getByLabelText("No, do not trigger Data Delivery")).toBeChecked();
    });

    // NOTE: This behaviour is tested in trigger_data_delivery (maybe mock sendDataDeliveryRequest()???)
    it.skip("calls sendDataDeliverRequest() when 'Yes' is the selected form option and confirmed", async () => {
        const history = createMemoryHistory({
            initialEntries: [mockRoute]
        });
        render(
            <Router history={history}>
                <Switch>
                    <Route path={mockRoute}>
                        <Confirmation />
                    </Route>
                </Switch>
            </Router>
        );
        
        const radioBtnForYes = screen.getByText("Yes, trigger Data Delivery");
        const confirmBtn = screen.getByRole("button", { name: "Continue" });
        userEvent.click(radioBtnForYes);
        userEvent.click(confirmBtn);
        
        expect(sendDataDeliveryRequest).toHaveBeenCalled();
    });

    it("navigates back to the homepage when 'No' is the selected form option and confirmed", async () => {
        const history = createMemoryHistory({
            initialEntries: [mockRoute]
        });
        render(
            <Router history={history}>
                <Switch>
                    <Route path={mockRoute}>
                        <Confirmation />
                    </Route>
                </Switch>
            </Router>
        );
        
        const radioBtnForNo = screen.getByText("No, do not trigger Data Delivery");
        const confirmBtn = screen.getByRole("button", { name: "Continue" });
        userEvent.click(radioBtnForNo);
        userEvent.click(confirmBtn);
        
        expect(history.location.pathname).toEqual("/");
    });

    it("navigates back to the homepage when the 'Cancel' button is clicked", async () => {
        const history = createMemoryHistory({
            initialEntries: [mockRoute]
        });
        render(
            <Router history={history}>
                <Switch>
                    <Route path={mockRoute}>
                        <Confirmation />
                    </Route>
                </Switch>
            </Router>
        );
        
        const confirmBtn = screen.getByRole("button", { name: "Cancel" });
        userEvent.click(confirmBtn);
        
        expect(history.location.pathname).toEqual("/");
    });
});