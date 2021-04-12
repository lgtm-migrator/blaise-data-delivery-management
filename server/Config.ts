export interface EnvironmentVariables {
    PROJECT_ID: string
    DATA_DELIVERY_STATUS_API: string
    AZURE_AUTH_TOKEN: string
    ENV_NAME: string
    GIT_BRANCH: string
    DATA_DELIVERY_AZURE_PIPELINE_NO: string
    DDS_CLIENT_ID: string
}

export function getEnvironmentVariables(): EnvironmentVariables {
    let {PROJECT_ID, DATA_DELIVERY_STATUS_API, AZURE_AUTH_TOKEN, ENV_NAME, GIT_BRANCH, DATA_DELIVERY_AZURE_PIPELINE_NO, DDS_CLIENT_ID} = process.env;

    if (PROJECT_ID === undefined) {
        console.error("PROJECT_ID environment variable has not been set");
        PROJECT_ID = "ENV_VAR_NOT_SET";
    }

    if (DATA_DELIVERY_STATUS_API === undefined) {
        console.error("DATA_DELIVERY_STATUS_API environment variable has not been set");
        DATA_DELIVERY_STATUS_API = "ENV_VAR_NOT_SET";
    }

    if (AZURE_AUTH_TOKEN === undefined) {
        console.error("AZURE_AUTH_TOKEN environment variable has not been set");
        AZURE_AUTH_TOKEN = "ENV_VAR_NOT_SET";
    }

    if (ENV_NAME === undefined) {
        console.error("ENV_NAME environment variable has not been set");
        ENV_NAME = "ENV_VAR_NOT_SET";
    }

    if (GIT_BRANCH === undefined) {
        console.error("GIT_BRANCH environment variable has not been set");
        GIT_BRANCH = "ENV_VAR_NOT_SET";
    }

    if (DATA_DELIVERY_AZURE_PIPELINE_NO === undefined) {
        console.error("DATA_DELIVERY_AZURE_PIPELINE_NO environment variable has not been set");
        DATA_DELIVERY_AZURE_PIPELINE_NO = "ENV_VAR_NOT_SET";
    }

    if (DDS_CLIENT_ID === undefined) {
        console.error("DATA_DELIVERY_AZURE_PIPELINE_NO environment variable has not been set");
        DDS_CLIENT_ID = "ENV_VAR_NOT_SET";
    }


    return {PROJECT_ID, DATA_DELIVERY_STATUS_API, AZURE_AUTH_TOKEN, ENV_NAME, GIT_BRANCH, DATA_DELIVERY_AZURE_PIPELINE_NO, DDS_CLIENT_ID};
}
