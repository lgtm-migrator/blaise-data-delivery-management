import React, {ReactElement, useEffect, useState} from "react";
import {ErrorBoundary} from "./ErrorHandling/ErrorBoundary";
import {ONSButton, ONSPanel} from "blaise-design-system-react-components";
import {getAllBatches} from "../utilities/http";
import {DataDeliveryBatchData} from "../../Interfaces";
import dateFormatter from "dayjs";
import {Link} from "react-router-dom";

function BatchesList(): ReactElement {
    const [batchList, setBatchList] = useState<DataDeliveryBatchData[]>([]);
    const [listError, setListError] = useState<string>("Loading ...");

    useEffect(() => {
        callGetBatchList().then(() => console.log("callGetBatchList Complete"));
    }, []);

    async function callGetBatchList() {
        setBatchList([]);
        setListError("Loading ...");

        const [success, batchList] = await getAllBatches();

        if (!success) {
            setListError("Unable to load data delivery run list");
            return;
        }

        console.log(batchList);

        if (batchList.length === 0) {
            setListError("No data delivery runs found.");
        }

        batchList.sort((a: DataDeliveryBatchData, b: DataDeliveryBatchData) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
        setBatchList(batchList.slice(0, 10));
    }


    return (
        <>
            <h1 className="u-mt-m">Data delivery runs</h1>
            <ONSButton onClick={() => callGetBatchList()} label="Reload" primary={true} small={true}/>
            <ErrorBoundary errorMessageText={"Failed to load audit logs."}>
                {
                    batchList && batchList.length > 0
                        ?
                        <table id="batches-table" className="table ">
                            <thead className="table__head u-mt-m">
                            <tr className="table__row">
                                <th scope="col" className="table__header ">
                                    <span>Survey</span>
                                </th>
                                <th scope="col" className="table__header ">
                                    <span>Data delivery run time</span>
                                </th>
                                <th scope="col" className="table__header ">
                                    <span>View run status</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="table__body">
                            {
                                batchList.map((batch: DataDeliveryBatchData) => {
                                    return (
                                        <tr className="table__row" key={batch.name}
                                            data-testid={"batches-table-row"}>
                                            <td className="table__cell ">
                                                {batch.survey}
                                            </td>
                                            <td className="table__cell ">
                                                {
                                                    batch.date.toString() === new Date(0).toISOString() ?
                                                        batch.name
                                                        :
                                                        dateFormatter(batch.date).format("DD/MM/YYYY HH:mm:ss")
                                                }
                                            </td>
                                            <td className="table__cell ">
                                                <Link
                                                    aria-label={`View run status ${dateFormatter(batch.date).format("DD/MM/YYYY HH:mm:ss")}`}
                                                    data-testid={`view-${batch.name}`}
                                                    to={{
                                                        pathname: `/batch/${batch.name}`,
                                                        state: {batch: batch}
                                                    }
                                                    }>View run status</Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                        :
                        <ONSPanel>{listError}</ONSPanel>
                }
            </ErrorBoundary>
        </>
    );
}

export default BatchesList;
