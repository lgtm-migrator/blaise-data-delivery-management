import axios, { Method } from "axios";

type PromiseResponse = [number, any];

async function requestPromiseJson(method: Method, url: string, body: any = null): Promise<PromiseResponse> {
    try {
        const response = await axios({
            url: url,
            method: method,
            data: body,
            validateStatus: () => true,
        });
        
        const data = response.data; 

        if (!data) {
            return [response.status, null];
        }
        return [response.status, data];
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
