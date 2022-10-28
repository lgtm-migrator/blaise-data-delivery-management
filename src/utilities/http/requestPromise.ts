import axios, { Method } from "axios";

type PromiseResponse = [number, any];

async function requestPromiseJson(method: string, url: string, body: any = null): Promise<PromiseResponse> {
    try {
        const response = await fetch(url, {
            "method": method,
            "body": body
        });
        try {
            const data = await response.json();
            return [response.status, data];
    
        } catch (error) {
            console.log(`Failed to read JSON from response, Error: ${error}`);
            return [response.status, null];
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
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

export { requestPromiseJson, requestPromiseJsonList };
