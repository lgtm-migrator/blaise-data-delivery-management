# Data Delivery Management

[![codecov](https://codecov.io/gh/ONSdigital/blaise-data-delivery-management/branch/main/graph/badge.svg)](https://codecov.io/gh/ONSdigital/blaise-data-delivery-management)
[![CI status](https://github.com/ONSdigital/blaise-data-delivery-management/workflows/Test%20coverage%20report/badge.svg)](https://github.com/ONSdigital/blaise-data-delivery-management/workflows/Test%20coverage%20report/badge.svg)
<img src="https://img.shields.io/github/release/ONSdigital/blaise-data-delivery-management.svg?style=flat-square" alt="Nisra Case Mover release verison">
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/ONSdigital/blaise-data-delivery-management.svg)](https://github.com/ONSdigital/blaise-data-delivery-management/pulls)
[![Github last commit](https://img.shields.io/github/last-commit/ONSdigital/blaise-data-delivery-management.svg)](https://github.com/ONSdigital/blaise-data-delivery-management/commits)
[![Github contributors](https://img.shields.io/github/contributors/ONSdigital/blaise-data-delivery-management.svg)](https://github.com/ONSdigital/blaise-data-delivery-management/graphs/contributors)

Service to see the status of data delivery files and manually trigger data delivery pipeline.

This project is a React application which when build is rendered by a Node.js express server.

### First time setup

To run Blaise Data Delivery Management locally, you'll need to have [Node installed](https://nodejs.org/en/), as well as [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable).

To have the list of instruments load on the page you can set the url to the service running in App Engine in a sandbox.

Clone the repository:
```shell script
git clone https://github.com/ONSdigital/blaise-data-delivery-management.git
```

and install the project dependencies:
```shell script
yarn install
```

Create a .env file in the root of the project and add the following variables:

| Variable | Description | Example |
|---------------------------------|---------------------------------------------------------------------------------|------------------------------|
| PROJECT_ID                      | To run locally, set this to the unique GCP project ID. Set to anything when testing locally.                                                                  | `ons-blaise-dev-<env>`      |
| DATA_DELIVERY_STATUS_API        | The URL the [Blaise data delivery status](https://github.com/ONSdigital/blaise-data-delivery-management)| BLAISE_API_URL                | Url that the [Blaise Rest API](https://github.com/ONSdigital/blaise-api-rest) is running on to send calls to. | localhost:5008 |
| DDS_CLIENT_ID                        | Client ID to authenticate with DDS - navigate to the GCP console, search for IAP, click the three dots on right of the service and select OAuth. Client Id will be on the right.  | Dev | 
| GOOGLE_APPLICATION_CREDENTIALS                        | JSON service account key (see below for how to obtain)  | keys.json |
||**The following variables are only used for triggering data delivery - they do not need to be set to get DDM running locally**|| 
| AZURE_AUTH_TOKEN                | Azure token to authenticate with the Azure rest API - only needed for manually triggering Data Delivery, not needed to get it running locally | super0unique0token  |
| ENV_NAME                        | Environment label  | Dev | 
| GIT_BRANCH                      | Branch that data delivery pipeline will run from (this is usually inline with the environment name) | Main | 
| DATA_DELIVERY_AZURE_PIPELINE_NO | The number for the data delivery pipeline in Azure  | 46 | 


The .env file should be setup as below. **DO NOT COMMIT THIS FILE**
```.env
DATA_DELIVERY_STATUS_API=https://dev-<env>-ddstatus.social-surveys.gcp.onsdigital.uk
PROJECT_ID=ons-blaise-v2-dev
DDS_CLIENT_ID=blah
GOOGLE_APPLICATION_CREDENTIALS=keys.json
AZURE_AUTH_TOKEN=super0unique0token
ENV_NAME=Dev
GIT_BRANCH=main
DATA_DELIVERY_AZURE_PIPELINE_NO=46
```

To get the service working locally, you need
to [obtain a JSON service account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys), this
will need to be a service account with create and list permissions. Save the service account key
as  `keys.json` and place in the root of the project. Providing the NODE_ENV is not production, then the GCP storage
config will attempt to use this file. **DO NOT COMMIT THIS FILE**


To create a keys.json file:
```shell
gcloud iam service-accounts keys create keys.json --iam-account ons-blaise-v2-dev-<sandbox>@appspot.gserviceaccount.com`
```

Run Node.js and React.js via the package.json script:
```shell script
yarn dev
```

The UI should now be accessible via:
http://localhost:3000/

### Executing tests

Tests can be run via the package.json script:
```shell script
yarn test
```

To prevent tests from printing messages through the console tests can be run silently via the package.json script:
```shell script
yarn test --silent
```

Test snapshots can be updated via:
```shell script
yarn test -u
```
