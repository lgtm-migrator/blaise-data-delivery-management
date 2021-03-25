# Data Delivery Management

[![codecov](https://codecov.io/gh/ONSdigital/blaise-data-delivery-management/branch/main/graph/badge.svg)](https://codecov.io/gh/ONSdigital/blaise-data-delivery-management)
[![CI status](https://github.com/ONSdigital/blaise-data-delivery-management/workflows/Test%20coverage%20report/badge.svg)](https://github.com/ONSdigital/blaise-data-delivery-management/workflows/Test%20coverage%20report/badge.svg)
<img src="https://img.shields.io/github/release/ONSdigital/blaise-data-delivery-management.svg?style=flat-square" alt="Nisra Case Mover release verison">
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/ONSdigital/blaise-data-delivery-management.svg)](https://github.com/ONSdigital/blaise-data-delivery-management/pulls)
[![Github last commit](https://img.shields.io/github/last-commit/ONSdigital/blaise-data-delivery-management.svg)](https://github.com/ONSdigital/blaise-data-delivery-management/commits)
[![Github contributors](https://img.shields.io/github/contributors/ONSdigital/blaise-data-delivery-management.svg)](https://github.com/ONSdigital/blaise-data-delivery-management/graphs/contributors)

Service to see the status of data delivery files and manually trigger data delivery pipeline.

This project is a React application which when build is rendered by a Node.js express server.

### Setup

#### Prerequisites
To run Blaise Data Delivery Management locally, you'll need to have [Node installed](https://nodejs.org/en/), as well as [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable).
To have the list of instruments load on the page, you'll need to have [Blaise data delivery status](https://github.com/ONSdigital/blaise-data-delivery-management) running locally (On a Windows machine), or you
can set the url to the service running in App Engine in a sandbox.

#### Setup locally steps
Clone the Repo
```shell script
git clone https://github.com/ONSdigital/blaise-data-delivery-management.git
```

Create a new .env file and add the following variables.

| Variable                        | Description                                                                     | Var Example                  |
|---------------------------------|---------------------------------------------------------------------------------|------------------------------|
| PORT                            | Optional variable, specify the Port for express server to run on. If not passed in this is set as 5000 by default. <br><br>It's best not to set this as the react project will try and use the variable as well and conflict. By default React project locally runs on port 3000.                                              | 5009                         |
| PROJECT_ID                      | GCP Project ID                                                                  | ons-blaise-dev-matt55        |
| DATA_DELIVERY_STATUS_API        | The URL the [Blaise data delivery status](https://github.com/ONSdigital/blaise-data-delivery-management)| BLAISE_API_URL                | Url that the [Blaise Rest API](https://github.com/ONSdigital/blaise-api-rest) is running on to send calls to. | localhost:5008 |
| AZURE_AUTH_TOKEN                | Azure token to authenticate with the Azure rest API  | super0unique0token  |
| ENV_NAME                        | Environment label  | Dev | 
| GIT_BRANCH                      | Branch that data delivery pipeline will run from (this is usually inline with the environment name) | Main | 
| DATA_DELIVERY_AZURE_PIPELINE_NO | The number for the data delivery pipeline in Azure  | 46 | 



The .env file should be setup as below
```.env
PORT=5001
DATA_DELIVERY_STATUS_API=https://data-delivery-status-dot-ons-blaise-v2-dev-matt01.nw.r.appspot.com
PROJECT_ID=ons-blaise-v2-dev
AZURE_AUTH_TOKEN=super0unique0token
ENV_NAME=Dev
GIT_BRANCH=main
DATA_DELIVERY_AZURE_PIPELINE_NO=46

```

Install required modules
```shell script
yarn
```


##### Run commands

The following run commands are available, these are all setup in the `package.json` under `scripts`.

| Command                | Description                                                                                                                                               |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `yarn server`          | Starts the complied express server (Used by App Engine to start the server), Note: The server will need to be complied and the React Project will need to be built first.  |
| `yarn start-server`    | Complies Typescript and starts the express server, Note: For the website to be rendered the React Project will need to be built.                          |
| `yarn start-react`     | Starts react project in local development setup with quick reloading on making changes. Note: For instruments to be shown the server needs to be running. |
| `yarn build-react`     | Compiles build project ready to be served by express. The build in outputted to the the `build` directory which express points to with the var `buildFolder` in `server/server.js`.                       |
| `yarn test`            | Runs all tests for server and React Components and outputs coverage statistics.                                                                           |
| `gcp-build`            | Used by CloudBuild to build the React app and compile the server for App Engine                                                                               |

##### Simple setup for local development

Setup express project that handles the requests to the [Blaise data delivery status](https://github.com/ONSdigital/blaise-data-delivery-management).
By default, will be running on PORT 5000.

```shell script
yarn start-server
```

Next to make sure the React project make requests the express server make sure the proxy option is set to the right port
in the 'package.json'

```.json
"proxy": "http://localhost:5000",
```

Run the React project for local development. By default, this will be running
on [http://localhost:3000/](http://localhost:3000/)

```shell script
yarn start-react
```

To test express sever serving the React project, you need to compile the React project, then you can see it running
at [http://localhost:5000/](http://localhost:5000/)

```shell script
yarn build-react
```

### Tests
The [Jest testing framework](https://jestjs.io/en/) has been setup in this project, all tests currently reside in the `tests` directory.
This currently only running tests on the health check endpoint, haven't got the hang of mocking Axios yet.
 
To run all tests run
```shell script
yarn test
```

Other test command can be seen in the Run Commands section above.

Deploying to app engine

To deploy the locally edited service to app engine in your environment, you can run trigger the cloudbuild trigger with the following line, changing the environment variables as needed. 
```.shell
gcloud builds submit --substitutions=_PROJECT_ID=ons-blaise-v2-dev-matt56,_BLAISE_API_URL=/,_BUCKET_NAME=ons-blaise-dev-matt56-survey-bucket-44,_SERVER_PARK=gusty
```

Copyright (c) 2021 Crown Copyright (Government Digital Service)
