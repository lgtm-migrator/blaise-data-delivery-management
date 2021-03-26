import {requestPromiseJson} from "./requestPromise";
import {DataDeliveryBatchData} from "../../../Interfaces";
type getBatchListResponse = [boolean, any[]];
type getAllBatchesResponse = [boolean, DataDeliveryBatchData[]];

function getAllBatches(): Promise<getAllBatchesResponse> {
    let list: DataDeliveryBatchData[] = [];
    console.log("Call to getAllBatches");
    const url = "/api/batch";

    return new Promise((resolve: (object: getAllBatchesResponse) => void) => {
        requestPromiseJson("GET", url).then(([status, data]) => {
            console.log(`Response from get All Batches: Status ${status}, data ${data}`);
            if (status === 200) {
                if (!Array.isArray(data)) {
                    resolve([false, list]);
                }
                list = data;
                resolve([true, list]);
            } else if (status === 404) {
                resolve([true, list]);
            } else {
                resolve([false, list]);
            }
        }).catch((error: Error) => {
            console.error(`Response from get All Batches Failed: Error ${error}`);
            resolve([false, list]);
        });
    });
}

function getBatchInfo(batchName: string): Promise<getBatchListResponse> {
    let list: any[] = [];
    console.log("Call to getBatchInfo");
        const url = `/api/batch/${batchName}`;

    return new Promise((resolve: (object: getBatchListResponse) => void) => {
        requestPromiseJson("GET", url).then(([status, data]) => {
            console.log(`Response from get Batch Info Status ${status}, data ${data}`);
            if (status === 200) {
                if (!Array.isArray(data)) {
                    resolve([false, list]);
                }
                list = data;
                resolve([true, list]);
            } else if (status === 404) {
                resolve([true, list]);
            } else {
                resolve([false, list]);
            }
        }).catch((error: Error) => {
            console.error(`Response from get Batch Info Failed: Error ${error}`);
            resolve([false, list]);
        });
    });
}

function getBatchStatusDescriptions(): Promise<getBatchListResponse> {
    let list: any[] = [];
    console.log("Call to getBatchStatusDescriptions");
    const url = "/api/state/descriptions";

    return new Promise((resolve: (object: getBatchListResponse) => void) => {
        requestPromiseJson("GET", url).then(([status, data]) => {
            console.log(`Response from get Batch Status Descriptions ${status}, data ${data}`);
            if (status === 200) {
                list = data;
                resolve([true, list]);
            } else if (status === 404) {
                resolve([true, list]);
            } else {
                resolve([false, list]);
            }
        }).catch((error: Error) => {
            console.error(`Response from get Batch Status Descriptions: Error ${error}`);
            resolve([false, list]);
        });
    });
}

export {getAllBatches, getBatchInfo, getBatchStatusDescriptions};
