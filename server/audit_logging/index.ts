import logging from "./config";
import {IncomingMessage} from "http";

import {getEnvironmentVariables} from "../Config";
import {AuditLog} from "../../Interfaces";

const {PROJECT_ID} = getEnvironmentVariables();

// const logName = `projects/${PROJECT_ID}/logs/stdout`; // The name of the log to write to
// const logName = `projects/${PROJECT_ID}/logs/cloudfunctions.googleapis.com%2Fcloud-functions`; // The name of the log to write to
const logName = `projects/${PROJECT_ID}/logs/winevt.raw`; // The name of the log to write to

export const auditLogInfo = (logger: IncomingMessage["log"], message: string): void => {
    logger.info(`AUDIT_LOG: ${message}`);
};

export const auditLogError = (logger: IncomingMessage["log"], message: string): void => {
    logger.error(`AUDIT_LOG: ${message}`);
};
// {filter: "jsonPayload.message=~\"^AUDIT_LOG: \"", maxResults: 50}



// {filter: "resource.labels.function_name = \"dataDelivery\"\n" +
// "resource.labels.region = \"europe-west2\"\n" +
// " severity>=DEBUG"}

// {filter: "resource.labels.function_name = \"NiFiEncryptFunction\"", maxResults: 300, pageSize: 300}
export const getAuditLogs = (): Promise<AuditLog[]> => {
    return new Promise((resolve: (object: AuditLog[]) => void, reject: (error: string) => void) => {
        const log = logging.log(logName);
        log.getEntries({filter: "resource.type=\"gce_instance\"\n" +
                "\"datadelivery:\" OR \"restapi:\""})
            .then(([entries]) => {
                console.log(entries);
                const auditLogs: AuditLog[] = [];
                entries.map((entry) => {
                    let id = "";
                    let timestamp = "";
                    let severity = "INFO";
                    let service = "Unknown";
                    let message: string;
                    if (entry.metadata.insertId !== undefined && entry.metadata.insertId !== null) {
                        id = entry.metadata.insertId;
                    }
                    if (entry.metadata.timestamp !== undefined && entry.metadata.timestamp !== null) {
                        timestamp = entry.metadata.timestamp.toString();
                    }
                    if (entry.metadata.severity !== undefined && entry.metadata.severity !== null) {
                        severity = entry.metadata.severity.toString();
                    }
                    if (entry.metadata.resource !== undefined && entry.metadata.resource !== null) {
                        if (entry.metadata.resource.labels !== undefined && entry.metadata.resource.labels !== null) {
                            try {
                                service = entry.metadata.resource.labels.function_name.toString();
                            }
                            catch {
                                service = "unknown";
                            }

                        }
                    }

                    if (typeof entry.data === "string") {
                        message = entry.data;
                    } else {
                        message = entry.data.message;
                    }
                    auditLogs.push({
                        id: id,
                        timestamp: timestamp,
                        // message: entry.data.message.replace(/^AUDIT_LOG: /, ""),
                        severity: severity,
                        // message: message.replace(/^[a-zA-Z]+: /, ""),
                        message: message,
                        service: service
                    });
                });
                resolve(auditLogs);
            })
            .catch(error => reject(error));
    });
};

module.exports = {getAuditLogs, auditLogInfo, auditLogError};
