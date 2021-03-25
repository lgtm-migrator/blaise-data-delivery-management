import express, {Request, Response, Router} from "express";
import axios, {AxiosRequestConfig} from "axios";
import {EnvironmentVariables} from "../Config";
import {batch_to_data, dd_filename_to_data} from "../Functions";
import {DataDeliveryBatchDates} from "../../Interfaces";

type PromiseResponse = [number, any];

export default function DataDeliveryStatus(environmentVariables: EnvironmentVariables, logger: any): Router {
    const {DATA_DELIVERY_STATUS_API}: EnvironmentVariables = environmentVariables;
    const router = express.Router();

    // Generic function to make requests to the API
    function SendAPIRequest(req: Request, res: Response, url: string, method: AxiosRequestConfig["method"], data: any = null) {
        logger(req, res);

        return new Promise((resolve: (object: PromiseResponse) => void) => {
            axios({
                url: url,
                method: method,
                data: data,
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

    router.get("/api/batch/:batchName", async function (req: ResponseQuery, res: Response) {
        const {batchName} = req.params;
        console.log("Called get batch status");

        const url = `${DATA_DELIVERY_STATUS_API}/v1/batch/${batchName}`;

        const [status, result] = await SendAPIRequest(req, res, url, "GET");

        const batchList: DataDeliveryBatchDates[] = [];
        result.map((item: any) => {
            Object.assign(item, dd_filename_to_data(item.dd_filename));

        });

        // Object.assign(profile, job);
        res.status(status).json(result);

    });

    router.get("/api/batch", async function (req: ResponseQuery, res: Response) {
        console.log("Called get data delivery status");

        const url = `${DATA_DELIVERY_STATUS_API}/v1/batch`;

        const [status, result] = await SendAPIRequest(req, res, url, "GET");

        const batchList: DataDeliveryBatchDates[] = [];
        result.map((item: string) => {
            batchList.push(batch_to_data(item));
        });

        res.status(status).json(batchList);

    });

    interface ResponseQuery extends Request {
        query: { filename: string }
    }

    return router;
}

