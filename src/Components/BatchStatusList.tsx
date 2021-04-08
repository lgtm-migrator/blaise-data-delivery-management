import React, {ReactElement, useEffect, useState} from "react";
import {ErrorBoundary} from "./ErrorHandling/ErrorBoundary";
import {ONSButton, ONSPanel} from "blaise-design-system-react-components";
import {getBatchInfo} from "../utilities/http";
import {DataDeliveryBatchData, DataDeliveryFileStatus} from "../../Interfaces";
import dateFormatter from "dayjs";
import {Link, useLocation} from "react-router-dom";
import {getDDFileStatusStyle} from "../utilities/BatchStatusColour";

interface Location {
    state: { batch: DataDeliveryBatchData }
}

interface Props {
    statusDescriptionList: any[]
}

function BatchStatusList({statusDescriptionList}: Props): ReactElement {
    const [batchList, setBatchList] = useState<DataDeliveryFileStatus[]>([]);
    const [listError, setListError] = useState<string>("Loading ...");

    const location = useLocation();
    const {batch} = (location as Location).state || {batch: {}};

    useEffect(() => {
        callGetBatchList().then(() => console.log("callGetBatchList Complete"));
    }, []);

    async function callGetBatchList() {
        setBatchList([]);
        setListError("Loading ...");

        const [success, batchList] = await getBatchInfo(batch.name);

        if (!success) {
            setListError("Unable to load batch info");
            return;
        }

        console.log(batchList);

        if (batchList.length === 0) {
            setListError("No data delivery files for this run found.");
        }

        batchList.sort((a: DataDeliveryFileStatus, b: DataDeliveryFileStatus) => new Date(b.updated_at).valueOf() - new Date(a.updated_at).valueOf());
        setBatchList(batchList);
    }


    return (
        <>
            <p>
                <Link to={"/"}>Previous</Link>
            </p>
            <h1 className="u-mt-m">Delivery
                trigger <em>{batch.survey} {batch.dateString}</em></h1>
            <ONSButton onClick={() => callGetBatchList()} label="Reload" primary={true} small={true}/>
            <ErrorBoundary errorMessageText={"Failed to load audit logs."}>
                {
                    batchList && batchList.length > 0
                        ?
                        <table id="batch-table" className="table ">
                            <thead className="table__head u-mt-m">
                            <tr className="table__row">
                                <th scope="col" className="table__header ">
                                    <span>Questionnaire</span>
                                </th>
                                <th scope="col" className="table__header ">
                                    <span>Status</span>
                                </th>
                                <th scope="col" className="table__header ">
                                    <span>Last update</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="table__body">
                            {
                                batchList.map(({
                                                   dd_filename,
                                                   state,
                                                   updated_at,
                                                   instrumentName
                                               }: DataDeliveryFileStatus) => {

                                    return (
                                        <tr className="table__row" key={dd_filename}
                                            data-testid={"batch-table-row"}>

                                            <td className="table__cell ">
                                                {instrumentName}
                                            </td>
                                            <td className="table__cell ">
                                                <span className={`status status--${getDDFileStatusStyle(state)}`}>
                                                {
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-ignore
                                                    statusDescriptionList[`${state}`]
                                                }
                                                </span>
                                            </td>
                                            <td className="table__cell ">
                                                {dateFormatter(updated_at).format("DD/MM/YYYY HH:mm:ss")}
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

export default BatchStatusList;
