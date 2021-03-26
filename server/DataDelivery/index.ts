import express, {Request, Response, Router} from "express";
import axios, {AxiosRequestConfig} from "axios";
import {EnvironmentVariables} from "../Config";

type PromiseResponse = [number, any];

export default function DataDelivery(environmentVariables: EnvironmentVariables, logger: any): Router {
    const {PROJECT_ID, AZURE_AUTH_TOKEN, ENV_NAME, GIT_BRANCH, DATA_DELIVERY_AZURE_PIPELINE_NO}: EnvironmentVariables = environmentVariables;
    const router = express.Router();

    const base64token = Buffer.from(`:${AZURE_AUTH_TOKEN}`).toString("base64");

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64token}`
    };

    // Generic function to make requests to the API
    function SendAPIRequest(req: Request, res: Response, url: string, method: AxiosRequestConfig["method"], data: any = null) {
        logger(req, res);

        return new Promise((resolve: (object: PromiseResponse) => void) => {
            axios({
                url: url,
                method: method,
                data: data,
                headers,
                validateStatus: function (status) {
                    return status >= 200;
                },
            }).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    req.log.info(`Status ${response.status} from ${method} ${url}`);
                } else {
                    req.log.warn(`Status ${response.status} from ${method} ${url}`);
                }
                resolve([response.status, response.data]);
            }).catch((error) => {
                req.log.error(error, `${method} ${url} endpoint failed`);
                resolve([500, null]);
            });
        });
    }

    interface ResponseQuery extends Request {
        query: { filename: string }
    }


    // Call to install a specific instrument from a specified GCP bucket and file
    router.post("/api/trigger", async function (req: ResponseQuery, res: Response) {
        console.log("Called data delivery trigger");
        const data = {
            "resources": {
                "repositories": {"self": {"refName": `refs/heads/${GIT_BRANCH}`}}
            },
            "templateParameters": {"VarGroup": PROJECT_ID, "Environment": ENV_NAME},
        };

        const url = `https://dev.azure.com/blaise-gcp/csharp/_apis/pipelines/${DATA_DELIVERY_AZURE_PIPELINE_NO}/runs?api-version=6.0-preview.1`;

        const [status] = await SendAPIRequest(req, res, url, "POST", data);


        res.status(status).json("completed");
    });

    return router;
}

