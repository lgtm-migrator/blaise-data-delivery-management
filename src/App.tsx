import React, { ReactElement, useEffect, useState } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import {
    Footer,
    Header,
    BetaBanner,
    ONSPanel,
    DefaultErrorBoundary,
    ErrorBoundary,
} from "blaise-design-system-react-components";
import Confirmation from "./Components/Confirmation";
import BatchesList from "./Components/BatchesList";
import BatchStatusList from "./Components/BatchStatusList";
import { getBatchStatusDescriptions } from "./utilities/http";
import "./style.css";

const divStyle = {
    minHeight: "calc(67vh)"
};

interface Location {
    state: { status: string }
}

function App(): ReactElement {

    const location = useLocation();
    const { status } = (location as Location).state || { status: "" };
    const [statusDescriptionList, setStatusDescriptionList] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        callGetBatchStatusDescriptions().then(() => console.log("getBatchStatusDescriptions Complete"));
    }, []);

    async function callGetBatchStatusDescriptions() {
        setStatusDescriptionList({});

        const [success, statusDescriptionList] = await getBatchStatusDescriptions();

        if (!success) {
            return;
        }

        setStatusDescriptionList(statusDescriptionList);
    }

    return (
        <>
            <BetaBanner />
            <Header title={"Data Delivery Management"} />
            <div style={divStyle} className="page__container container">
                <DefaultErrorBoundary>
                    <Switch>
                        <Route path="/trigger">
                            <Confirmation />
                        </Route>
                        <Route path="/batch">
                            <BatchStatusList statusDescriptionList={statusDescriptionList} />
                        </Route>
                        <Route path="/">

                            {
                                status !== "" &&
                                <ONSPanel status={status?.includes("success") ? "success" : "error"}>
                                    <p>{status}</p>
                                </ONSPanel>
                            }

                            <main id="main-content" className="page__main u-mt-no">

                                {/*<ul className="list list--bare list--inline u-mt-m">*/}
                                {/*    <li className="list__item">*/}
                                {/*        <Link to="/trigger" id="audit-logs-link">*/}
                                {/*            Trigger Data Delivery*/}
                                {/*        </Link>*/}
                                {/*    </li>*/}
                                {/*</ul>*/}

                                <h1 className="u-mt-m">Data delivery runs</h1>
                                <ErrorBoundary errorMessageText={"Unable to load batch list table correctly"}>
                                    <BatchesList />
                                </ErrorBoundary>
                            </main>
                        </Route>
                    </Switch>
                </DefaultErrorBoundary>
            </div>
            <Footer />
        </>
    );
}

export default App;
