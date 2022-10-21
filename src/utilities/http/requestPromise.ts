import axios, { Method } from "axios";

type PromiseResponse = [number, any];

function requestPromiseJson(method: string, url: string, body: any = null): Promise<PromiseResponse> {
    return new Promise((resolve: (object: PromiseResponse) => void, reject: (error: string) => void) => {
        fetch(url, {
            "method": method,
            "body": body
        })
            .then(async response => {
                response.json().then(
                    data => (resolve([response.status, data]))
                ).catch((error) => {
                    console.log(`Failed to read JSON from response, Error: ${error}`);
                    resolve([response.status, null]);
                });
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

type PromiseResponseList = [boolean, any[]];

async function requestPromiseJsonList(method: Method, url: string, body: any = null): Promise<PromiseResponseList> {
    try {
        const response = await axios({
            url: url,
            method: method,
            data: body,
            validateStatus: () => true,
        });
        
        const data = response.data; 
    
        if (response.status === 200) {
            if (!Array.isArray(data)) {
                return [false, []];
            }
            return [true, data];
        } else if (response.status === 404) {
            return [true, data];
        } else {
            return [false, []];
        }
    } catch (error) {
        console.log(error);
        throw error;        
    }
}

export {requestPromiseJson, requestPromiseJsonList};
