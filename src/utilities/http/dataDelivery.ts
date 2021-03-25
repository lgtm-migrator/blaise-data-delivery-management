import {requestPromiseJson} from "./requestPromise";
type getBatchListResponse = [boolean, any[]];

function sendDataDeliveryRequest(): Promise<boolean> {
    console.log("Sending request to trigger data delivery");
    const url = "/api/trigger";

    return new Promise((resolve: (object: boolean) => void) => {
        requestPromiseJson("POST", url).then(([status, data]) => {
            console.log(`Response from trigger data delivery: Status ${status}, data ${data}`);
            if (status === 200) {
                if (data === "completed") {
                    resolve(true);
                    return;
                }
                resolve(false);
            } else {
                resolve(false);
            }
        }).catch((error: Error) => {
            console.error(`Failed to trigger data delivery, Error ${error}`);
            resolve(false);
        });
    });
}


export {sendDataDeliveryRequest};
